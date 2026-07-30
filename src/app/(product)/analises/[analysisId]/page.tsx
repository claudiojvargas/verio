import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db/client";
import { formatDate } from "@/lib/formatters";
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
      status: { in: ["COMPLETED", "PARTIAL"] },
    },
    include: {
      business: true,
      result: true,
      recommendations: { orderBy: { priority: "asc" } },
      competitors: {
        orderBy: { position: "asc" },
        include: { competitorBusiness: true },
      },
    },
  });

  if (!analysis?.result) notFound();

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
        id: competitor.competitorBusiness.id,
        name: competitor.competitorBusiness.name,
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
          <Button asChild variant="ghost" size="sm" className="-ml-3 mb-3 gap-2">
            <Link href="/analises">
              <ArrowLeft className="size-4" /> Voltar às análises
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">Resultado da análise</h1>
            <Badge variant={analysis.status === "COMPLETED" ? "success" : "secondary"}>
              {analysis.status === "COMPLETED" ? "Concluída" : "Parcial"}
            </Badge>
          </div>
          <p className="mt-2 text-muted-foreground">
            {analysis.business.name} · {formatDate(analysis.createdAt, "long")}
          </p>
        </div>
      </header>

      <ResultsDashboard
        businessName={analysis.business.name}
        score={analysis.result.totalScore}
        coverage={analysis.result.coveragePercentage}
        dimensions={dimensions}
        ranking={ranking}
        summary={parseSummary(analysis.result.summary)}
        recommendations={analysis.recommendations.map(toRecommendationViewModel)}
        methodologyVersion={analysis.methodologyVersion}
      />
    </div>
  );
}
