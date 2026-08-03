import { Prisma } from "@prisma/client";

import { db } from "@/lib/db/client";
import { createGoogleCredibilityAnalyzer } from "@/modules/ai-analyzer/infrastructure/google/create-google-analyzer";
import {
  recordAnalysisEvent,
  safeFailureDetails,
  type AnalysisStage,
} from "@/modules/analyses/application/analysis-events";
import { parseCompetitorChannelsSnapshot } from "@/modules/analyses/application/competitor-snapshot";
import { assessRegisteredChannels } from "@/modules/analyses/application/registration-assessment";
import type { CredibilityAnalysisDraft } from "@/modules/analyses/ai/credibility-analysis";
import { calculateVerioScore } from "@/modules/scoring";
import { VERIO_SCORE_V1 } from "@/modules/scoring/policies/verio-score-v1";

export async function runAnalysis(analysisId: string) {
  const analysis = await db.analysis.findUnique({
    where: { id: analysisId },
    include: {
      business: { include: { channels: true } },
      competitors: true,
    },
  });
  if (!analysis) throw new Error("ANALYSIS_NOT_FOUND");

  let currentStage: AnalysisStage = "EVIDENCE_ASSESSMENT";
  try {
    const evidenceStartedAt = Date.now();
    await recordAnalysisEvent(db, {
      analysisId: analysis.id,
      stage: "EVIDENCE_ASSESSMENT",
      status: "RUNNING",
      publicMessage: "Avaliando os canais confirmados.",
    });
    const primaryAssessment = assessRegisteredChannels(
      analysis.business.channels,
    );
    if (primaryAssessment.evidence.length === 0)
      throw new Error("NO_CONFIRMED_CHANNELS");
    await recordAnalysisEvent(db, {
      analysisId: analysis.id,
      stage: "EVIDENCE_ASSESSMENT",
      status: "COMPLETED",
      publicMessage: "Canais e evidências preparados.",
      technicalMessage: "Registered channel evidence assessment completed",
      metadata: {
        evidenceCount: primaryAssessment.evidence.length,
        competitorCount: analysis.competitors.length,
      },
      durationMs: Date.now() - evidenceStartedAt,
    });

    currentStage = "SCORE_CALCULATION";
    const scoreStartedAt = Date.now();
    await recordAnalysisEvent(db, {
      analysisId: analysis.id,
      stage: "SCORE_CALCULATION",
      status: "RUNNING",
      publicMessage: "Calculando o Verio Score.",
    });
    const score = calculateVerioScore(
      primaryAssessment.observations,
      VERIO_SCORE_V1,
    );
    await recordAnalysisEvent(db, {
      analysisId: analysis.id,
      stage: "SCORE_CALCULATION",
      status: "COMPLETED",
      publicMessage: "Verio Score calculado.",
      technicalMessage: "Deterministic score policy completed without AI",
      metadata: {
        methodologyVersion: score.methodologyVersion,
        coverage: score.coverage,
        scoreStatus: score.status,
      },
      durationMs: Date.now() - scoreStartedAt,
    });

    currentStage = "COMPETITOR_SCORING";
    const competitorStartedAt = Date.now();
    await recordAnalysisEvent(db, {
      analysisId: analysis.id,
      stage: "COMPETITOR_SCORING",
      status: "RUNNING",
      publicMessage: "Calculando a comparação com concorrentes.",
    });
    const competitorResults = analysis.competitors.map((competitor) => {
      const assessment = assessRegisteredChannels(
        parseCompetitorChannelsSnapshot(competitor.channelsSnapshot),
      );
      return {
        competitorBusinessId: competitor.competitorBusinessId,
        assessment,
        score: calculateVerioScore(assessment.observations, VERIO_SCORE_V1),
      };
    });
    await recordAnalysisEvent(db, {
      analysisId: analysis.id,
      stage: "COMPETITOR_SCORING",
      status: "COMPLETED",
      publicMessage: "Comparação determinística concluída.",
      technicalMessage:
        "Competitor snapshots scored with the primary methodology",
      metadata: {
        competitorCount: competitorResults.length,
        scoredCount: competitorResults.filter(
          ({ score: competitorScore }) => competitorScore.status === "SCORED",
        ).length,
      },
      durationMs: Date.now() - competitorStartedAt,
    });

    currentStage = "AI_SYNTHESIS";
    const model = process.env.GOOGLE_AI_MODEL ?? "not-configured";
    const aiStartedAt = Date.now();
    await recordAnalysisEvent(db, {
      analysisId: analysis.id,
      stage: "AI_SYNTHESIS",
      status: "RUNNING",
      publicMessage: "Gerando resumo e recomendações.",
      technicalMessage: "Calling provider-neutral AI analyzer",
      metadata: { provider: "google-ai", model },
    });
    let aiFailureCode: string | null = null;
    let recommendations: CredibilityAnalysisDraft["recommendationDrafts"] = [];
    let generatorVersion = "deterministic-fallback-v1";
    let summary = createDeterministicSummary(
      primaryAssessment.evidence.length,
      score.coverage,
    );
    try {
      const ai = await createGoogleCredibilityAnalyzer().analyze(
        {
          business: {
            name: analysis.business.name,
            city: analysis.business.city,
          },
          evidence: primaryAssessment.evidence,
        },
        AbortSignal.timeout(45_000),
      );
      const positive = ai.data.observations.find(
        ({ outcome }) => outcome === "POSITIVE",
      );
      const attention = ai.data.observations.find(
        ({ outcome }) => outcome === "ATTENTION",
      );
      summary = {
        strength: positive?.explanation ?? ai.data.summary,
        priority:
          attention?.explanation ??
          ai.data.recommendationDrafts[0]?.rationale ??
          ai.data.summary,
      };
      recommendations = ai.data.recommendationDrafts;
      generatorVersion = `${ai.metadata.provider}:${ai.metadata.model}:${ai.metadata.promptVersion}`;
      await recordAnalysisEvent(db, {
        analysisId: analysis.id,
        stage: "AI_SYNTHESIS",
        status: "COMPLETED",
        publicMessage: "Resumo e recomendações validados.",
        technicalMessage:
          "Provider output passed schema and evidence-reference validation",
        metadata: {
          provider: ai.metadata.provider,
          model: ai.metadata.model,
          promptVersion: ai.metadata.promptVersion,
          recommendationCount: recommendations.length,
        },
        durationMs: Date.now() - aiStartedAt,
      });
    } catch (error) {
      const failure = safeFailureDetails(error, model, "AI_SYNTHESIS");
      aiFailureCode = failure.code;
      await recordAnalysisEvent(db, {
        analysisId: analysis.id,
        stage: "AI_SYNTHESIS",
        status: "FAILED",
        code: failure.code,
        publicMessage:
          "A síntese por IA não ficou disponível; o resultado determinístico será preservado.",
        technicalMessage: failure.technicalMessage,
        metadata: failure.metadata,
        durationMs: Date.now() - aiStartedAt,
      });
    }

    currentStage = "RESULT_PERSISTENCE";
    const persistenceStartedAt = Date.now();
    await recordAnalysisEvent(db, {
      analysisId: analysis.id,
      stage: "RESULT_PERSISTENCE",
      status: "RUNNING",
      publicMessage: "Salvando o resultado.",
    });
    await db.$transaction(async (transaction) => {
      await transaction.analysisResult.create({
        data: {
          analysisId: analysis.id,
          status: score.status,
          totalScore: score.totalScore,
          coveragePercentage: Math.round(score.coverage),
          dimensions: score.categories.map(
            ({ category, score: categoryScore }) => ({
              key: category,
              score: categoryScore,
            }),
          ) as Prisma.InputJsonValue,
          evidence:
            primaryAssessment.evidence as unknown as Prisma.InputJsonValue,
          summary,
        },
      });
      for (const competitor of competitorResults) {
        await transaction.analysisCompetitor.update({
          where: {
            analysisId_competitorBusinessId: {
              analysisId: analysis.id,
              competitorBusinessId: competitor.competitorBusinessId,
            },
          },
          data: {
            resultStatus: competitor.score.status,
            totalScore: competitor.score.totalScore,
            coveragePercentage: Math.round(competitor.score.coverage),
            dimensions: competitor.score.categories.map(
              ({ category, score: categoryScore }) => ({
                key: category,
                score: categoryScore,
              }),
            ) as Prisma.InputJsonValue,
            evidence: competitor.assessment
              .evidence as unknown as Prisma.InputJsonValue,
          },
        });
      }
      for (const [index, recommendation] of recommendations.entries()) {
        await transaction.recommendation.create({
          data: {
            analysisId: analysis.id,
            key: recommendation.key,
            title: recommendation.title,
            rationale: recommendation.rationale,
            evidenceKeys: recommendation.evidenceKeys,
            impact: recommendation.impact,
            effort: recommendation.effort,
            confidence: 70,
            priority: index + 1,
            steps: recommendation.steps,
            generatorVersion,
          },
        });
      }
      await transaction.analysis.update({
        where: { id: analysis.id },
        data: {
          status: aiFailureCode ? "PARTIAL" : "COMPLETED",
          completedAt: new Date(),
          failureCode: aiFailureCode,
        },
      });
      await transaction.analysisJob.update({
        where: { analysisId: analysis.id },
        data: { status: "SUCCEEDED", lockedAt: null, lockedBy: null },
      });
      await recordAnalysisEvent(transaction, {
        analysisId: analysis.id,
        stage: "RESULT_PERSISTENCE",
        status: "COMPLETED",
        publicMessage: "Resultado salvo com segurança.",
        technicalMessage:
          "Result, competitor snapshots and recommendations committed",
        durationMs: Date.now() - persistenceStartedAt,
      });
      await recordAnalysisEvent(transaction, {
        analysisId: analysis.id,
        stage: "ANALYSIS_COMPLETED",
        status: "COMPLETED",
        publicMessage: aiFailureCode
          ? "Score e comparação concluídos; síntese de IA indisponível."
          : "Análise concluída.",
        metadata: { aiEnriched: !aiFailureCode },
      });
    });
  } catch (error) {
    const failure = safeFailureDetails(
      error,
      process.env.GOOGLE_AI_MODEL ?? "not-configured",
      currentStage,
    );
    await db.$transaction(async (transaction) => {
      await transaction.analysis.update({
        where: { id: analysis.id },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          failureCode: failure.code,
        },
      });
      await transaction.analysisJob.update({
        where: { analysisId: analysis.id },
        data: {
          status: "FAILED",
          lockedAt: null,
          lockedBy: null,
          lastErrorCode: failure.code,
        },
      });
      await recordAnalysisEvent(transaction, {
        analysisId: analysis.id,
        stage: failure.stage,
        status: "FAILED",
        code: failure.code,
        publicMessage: failure.publicMessage,
        technicalMessage: failure.technicalMessage,
        metadata: failure.metadata,
      });
      await recordAnalysisEvent(transaction, {
        analysisId: analysis.id,
        stage: "ANALYSIS_FAILED",
        status: "FAILED",
        code: failure.code,
        publicMessage: failure.publicMessage,
      });
    });
    throw error;
  }
}

function createDeterministicSummary(evidenceCount: number, coverage: number) {
  return {
    strength:
      evidenceCount === 1
        ? "A empresa possui um canal digital confirmado."
        : `A empresa possui ${evidenceCount} canais digitais confirmados.`,
    priority:
      coverage < 70
        ? "Amplie e mantenha atualizados os canais verificáveis para aumentar a cobertura do diagnóstico."
        : "Mantenha os canais confirmados consistentes e atualizados.",
  };
}

export async function processNextAnalysisJob(workerId: string) {
  const job = await db.$transaction(
    async (transaction) => {
      const staleBefore = new Date(Date.now() - 5 * 60_000);
      await transaction.analysisJob.updateMany({
        where: { status: "PROCESSING", lockedAt: { lt: staleBefore } },
        data: { status: "RETRY", lockedAt: null, lockedBy: null },
      });
      const candidate = await transaction.analysisJob.findFirst({
        where: {
          status: { in: ["PENDING", "RETRY"] },
          availableAt: { lte: new Date() },
        },
        orderBy: { availableAt: "asc" },
      });
      if (!candidate) return null;

      const claimed = await transaction.analysisJob.updateMany({
        where: { id: candidate.id, status: candidate.status, lockedAt: null },
        data: {
          status: "PROCESSING",
          attempts: { increment: 1 },
          lockedAt: new Date(),
          lockedBy: workerId,
        },
      });
      if (claimed.count !== 1) return null;

      await transaction.analysis.update({
        where: { id: candidate.analysisId },
        data: {
          status: "PROCESSING",
          startedAt: new Date(),
          failureCode: null,
        },
      });
      await recordAnalysisEvent(transaction, {
        analysisId: candidate.analysisId,
        stage: "JOB_CLAIMED",
        status: "COMPLETED",
        publicMessage: "Processamento iniciado.",
        technicalMessage: "Persistent job lease claimed by internal processor",
        metadata: { attempt: candidate.attempts + 1 },
      });
      return candidate;
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );

  if (!job) return null;
  await runAnalysis(job.analysisId);
  return job.analysisId;
}
