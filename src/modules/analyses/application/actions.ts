"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db/client";
import { VERIO_SCORE_V1 } from "@/modules/scoring/policies/verio-score-v1";

export type StartAnalysisState = { error?: string };

export async function startAnalysis(
  _previousState: StartAnalysisState,
  _formData: FormData,
): Promise<StartAnalysisState> {
  void _previousState;
  void _formData;
  const user = await getOrCreateCurrentUser();
  if (!user) return { error: "Sua sessão expirou. Entre novamente." };

  const membership = await db.businessMembership.findFirst({
    where: { userId: user.id, role: "OWNER", business: { status: "ACTIVE" } },
    include: {
      business: {
        include: {
          channels: true,
          competitors: {
            orderBy: { position: "asc" },
            include: {
              competitorBusiness: { include: { channels: true } },
            },
          },
        },
      },
    },
  });
  if (!membership)
    return { error: "Cadastre sua empresa antes de iniciar uma análise." };
  if (
    !membership.business.channels.some(({ status }) => status === "CONFIRMED")
  ) {
    return {
      error: "Confirme ao menos um canal da empresa antes de continuar.",
    };
  }

  let analysisId: string;
  try {
    analysisId = await db.$transaction(
      async (transaction) => {
        const running = await transaction.analysis.findFirst({
          where: {
            businessId: membership.businessId,
            status: { in: ["PENDING", "PROCESSING"] },
          },
          orderBy: { createdAt: "desc" },
        });
        if (running) throw new Error("ANALYSIS_IN_PROGRESS");
        const baseline = await transaction.analysis.findFirst({
          where: {
            businessId: membership.businessId,
            status: { in: ["COMPLETED", "PARTIAL"] },
            result: { isNot: null },
          },
          orderBy: { completedAt: "desc" },
        });
        const analysis = await transaction.analysis.create({
          data: {
            businessId: membership.businessId,
            requestedByUserId: user.id,
            baselineAnalysisId: baseline?.id,
            kind: baseline ? "REANALYSIS" : "INITIAL",
            methodologyVersion: VERIO_SCORE_V1.version,
            job: { create: {} },
            events: {
              create: {
                stage: "ANALYSIS_CREATED",
                status: "COMPLETED",
                publicMessage: "Análise criada e adicionada à fila.",
                technicalMessage:
                  "Analysis and persistent job created atomically",
                metadata: {
                  methodologyVersion: VERIO_SCORE_V1.version,
                  competitorCount: membership.business.competitors.length,
                },
              },
            },
            competitors: {
              create: membership.business.competitors.map((competitor) => ({
                primaryBusinessId: membership.businessId,
                competitorBusinessId: competitor.competitorBusinessId,
                position: competitor.position,
                nameSnapshot: competitor.competitorBusiness.name,
                citySnapshot: competitor.competitorBusiness.city,
                stateSnapshot: competitor.competitorBusiness.state,
                channelsSnapshot: competitor.competitorBusiness.channels.map(
                  ({ type, value, status }) => ({ type, value, status }),
                ),
              })),
            },
          },
        });
        return analysis.id;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "ANALYSIS_IN_PROGRESS") {
      return { error: "Já existe uma análise em andamento para esta empresa." };
    }
    return { error: "Não foi possível preparar a análise. Tente novamente." };
  }

  return redirect(`/analises/${analysisId}`);
}
