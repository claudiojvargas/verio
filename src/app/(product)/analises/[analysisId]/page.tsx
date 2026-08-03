import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db/client";
import { formatDate } from "@/lib/formatters";
import { AnalysisStatus } from "@/modules/analyses/ui/analysis-status";
import {
  parseDimensions,
  parseSummary,
  toRankedBusiness,
  toRecommendationViewModel,
} from "@/modules/reports/application/result-view-model";
import { ResultsDashboard } from "@/modules/reports/ui/results-dashboard";

export const dynamic = "force-dynamic";

export default async function AnalysisResultPage({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = await params;
  const user = await getOrCreateCurrentUser();
  if (!user) notFound();

  const analysis = await db.analysis.findFirst({
    where: {
      id: analysisId,
      business: { memberships: { some: { userId: user.id } } },
    },
    include: {
      business: true,
      result: true,
      job: true,
      events: { orderBy: [{ createdAt: "asc" }, { id: "asc" }] },
      recommendations: { orderBy: { priority: "asc" } },
      competitors: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!analysis) notFound();
  if (!analysis.result) {
    return (
      <AnalysisStatus
        failed={analysis.status === "FAILED"}
        failureCode={analysis.failureCode}
        attempt={analysis.job?.attempts ?? 0}
        events={analysis.events.map((event) => ({
          id: event.id,
          stage: event.stage,
          status: event.status,
          code: event.code,
          publicMessage: event.publicMessage,
          technicalMessage: event.technicalMessage,
          metadata: event.metadata,
          durationMs: event.durationMs,
          createdAt: event.createdAt.toISOString(),
        }))}
      />
    );
  }

  const dimensions = parseDimensions(analysis.result.dimensions);
  const ranking = [
    toRankedBusiness({
      id: analysis.business.id,
      name: analysis.business.name,
      score: analysis.result.totalScore,
      coverage: analysis.result.coveragePercentage,
      primary: true,
      dimensions: analysis.result.dimensions,
    }),
    ...analysis.competitors.map((competitor) =>
      toRankedBusiness({
        id: competitor.competitorBusinessId,
        name: competitor.nameSnapshot,
        score: competitor.totalScore,
        coverage: competitor.coveragePercentage,
        primary: false,
        dimensions: competitor.dimensions,
      }),
    ),
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-3 mb-3 gap-2"
          >
            <Link href="/analises">
              <ArrowLeft className="size-4" /> Voltar às análises
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              Resultado da análise
            </h1>
            <Badge
              variant={
                analysis.status === "COMPLETED" ? "success" : "secondary"
              }
            >
              {analysis.status === "COMPLETED" ? "Concluída" : "Parcial"}
            </Badge>
          </div>
          <p className="mt-2 text-muted-foreground">
            {analysis.business.name} · {formatDate(analysis.createdAt, "long")}
          </p>
        </div>
      </header>

      {analysis.status === "PARTIAL" ? (
        <div className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <div>
            <p className="font-medium">Resultado determinístico disponível</p>
            <p className="mt-1 text-muted-foreground">
              O score e a comparação com concorrentes foram concluídos, mas a
              síntese e as recomendações por IA não ficaram disponíveis nesta
              execução.
            </p>
          </div>
        </div>
      ) : null}

      <ResultsDashboard
        businessName={analysis.business.name}
        score={analysis.result.totalScore}
        coverage={analysis.result.coveragePercentage}
        dimensions={dimensions}
        ranking={ranking}
        summary={parseSummary(analysis.result.summary)}
        recommendations={analysis.recommendations.map(
          toRecommendationViewModel,
        )}
        methodologyVersion={analysis.methodologyVersion}
      />
    </div>
  );
}
