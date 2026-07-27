import { auth } from "@clerk/nextjs/server";
import { ArrowUpRight, Building2, CheckCircle2, Clock3, Gauge } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

import { NewAnalysisButton } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db/client";
import { formatAnalysisStatus, formatDate } from "@/lib/formatters";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/entrar");
  }

  const user = await getOrCreateCurrentUser();

  if (!user) {
    redirect("/entrar");
  }

  const membership = await db.businessMembership.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    include: {
      business: {
        include: {
          channels: true,
          analyses: {
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
              result: true,
              recommendations: {
                orderBy: { priority: "asc" },
              },
            },
          },
        },
      },
    },
  });

  const business = membership?.business;
  const analyses = business?.analyses ?? [];
  const latestAnalysis = analyses[0];
  const score = latestAnalysis?.result?.totalScore;
  const recommendations = latestAnalysis?.recommendations ?? [];
  const firstName = user.name?.split(" ")[0];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Visão geral</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            {firstName ? `Olá, ${firstName}.` : "Olá."}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {business
              ? `Acompanhe a presença digital de ${business.name}.`
              : "Cadastre sua empresa para preparar o primeiro diagnóstico."}
          </p>
        </div>
        <NewAnalysisButton />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores">
        <MetricCard
          title="Score atual"
          value={typeof score === "number" ? String(score) : "—"}
          detail={typeof score === "number" ? "de 100 pontos" : "Sem análise concluída"}
          icon={Gauge}
        />
        <MetricCard
          title="Análises"
          value={String(analyses.length)}
          detail="histórico recente"
          icon={Clock3}
        />
        <MetricCard
          title="Recomendações"
          value={String(recommendations.length)}
          detail="prioridades encontradas"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Canais confirmados"
          value={String(
            business?.channels.filter(({ status }) => status === "CONFIRMED").length ?? 0,
          )}
          detail="Google, site e WhatsApp"
          icon={Building2}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de análises</CardTitle>
            <CardDescription>
              Resultados recentes e cobertura dos sinais verificados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Cobertura</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyses.map((analysis) => (
                    <TableRow key={analysis.id}>
                      <TableCell className="font-medium">
                        {analysis.result ? (
                          <Link href={`/analises/${analysis.id}`} className="hover:text-primary hover:underline">
                            {formatDate(analysis.createdAt, "short")}
                          </Link>
                        ) : (
                          formatDate(analysis.createdAt, "short")
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            analysis.status === "COMPLETED" ? "success" : "secondary"
                          }
                        >
                          {formatAnalysisStatus(analysis.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {analysis.result
                          ? `${analysis.result.coveragePercentage}%`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {analysis.result?.totalScore ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                title="Nenhuma análise ainda"
                description="Quando o fluxo de análise estiver disponível, seu histórico aparecerá aqui."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas prioridades</CardTitle>
            <CardDescription>Recomendações da análise mais recente.</CardDescription>
          </CardHeader>
          <CardContent>
            {recommendations.length > 0 ? (
              <ol className="space-y-3">
                {recommendations.slice(0, 3).map((recommendation) => (
                  <li
                    key={recommendation.id}
                    className="rounded-lg border p-4 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{recommendation.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {recommendation.rationale}
                        </p>
                      </div>
                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Badge variant="outline">Impacto {recommendation.impact.toLowerCase()}</Badge>
                      <Badge variant="secondary">
                        Esforço {recommendation.effort.toLowerCase()}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState
                title="Sem prioridades"
                description="As recomendações aparecerão depois do primeiro diagnóstico."
              />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

type MetricCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: typeof Gauge;
};

function MetricCard({ title, value, detail, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </span>
        </div>
        <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
      <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
        <BarChartIcon />
      </span>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function BarChartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-4 text-muted-foreground"
      aria-hidden="true"
    >
      <path d="M4 19V9m6 10V5m6 14v-7m4 7H2" />
    </svg>
  );
}
