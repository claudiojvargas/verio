"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, CheckCircle2, Lightbulb, Trophy } from "lucide-react";

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

export type ResultDimension = {
  key: string;
  label: string;
  score: number | null;
};

export type RankedBusiness = {
  id: string;
  name: string;
  score: number | null;
  coverage: number;
  primary: boolean;
  dimensions: ResultDimension[];
};

export type ResultRecommendation = {
  id: string;
  title: string;
  rationale: string;
  impact: "LOW" | "MEDIUM" | "HIGH";
  effort: "LOW" | "MEDIUM" | "HIGH";
  priority: number;
  steps: string[];
};

type ResultsDashboardProps = {
  businessName: string;
  score: number | null;
  coverage: number;
  dimensions: ResultDimension[];
  ranking: RankedBusiness[];
  summary: { strength: string; priority: string };
  recommendations: ResultRecommendation[];
  methodologyVersion: string;
};

const chartColors = [
  "hsl(var(--primary))",
  "hsl(217 91% 60%)",
  "hsl(160 84% 39%)",
  "hsl(38 92% 50%)",
];

export function ResultsDashboard({
  businessName,
  score,
  coverage,
  dimensions,
  ranking,
  summary,
  recommendations,
  methodologyVersion,
}: ResultsDashboardProps) {
  const sortedRanking = [...ranking].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  const primaryPosition = sortedRanking.findIndex(({ primary }) => primary) + 1;
  const comparisonData = dimensions.map((dimension) => {
    const row: Record<string, string | number | null> = {
      category: dimension.label,
    };
    for (const business of ranking) {
      row[business.id] =
        business.dimensions.find(({ key }) => key === dimension.key)?.score ?? null;
    }
    return row;
  });

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Verio Score</CardTitle>
            <CardDescription>
              Síntese dos sinais verificáveis de {businessName}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mx-auto h-64 max-w-xs" aria-label={`Score ${score ?? "indisponível"} de 100`}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={[{ value: score ?? 0 }]}
                  innerRadius="72%"
                  outerRadius="100%"
                  startAngle={90}
                  endAngle={-270}
                  barSize={16}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar
                    dataKey="value"
                    background={{ fill: "hsl(var(--muted))" }}
                    cornerRadius={10}
                    fill="hsl(var(--primary))"
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-semibold tracking-tight">{score ?? "—"}</span>
                <span className="text-sm text-muted-foreground">de 100</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t pt-5 text-center">
              <div>
                <p className="text-2xl font-semibold">{coverage}%</p>
                <p className="text-xs text-muted-foreground">Cobertura</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{primaryPosition || "—"}º</p>
                <p className="text-xs text-muted-foreground">No comparativo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desempenho por categoria</CardTitle>
            <CardDescription>Veja onde a presença está mais consistente.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full" aria-label="Gráfico de score por categoria">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dimensions} layout="vertical" margin={{ left: 8, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={84}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<ScoreTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.5)" }} />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={24}>
                    {dimensions.map((dimension, index) => (
                      <Cell key={dimension.key} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-600" /> Resumo da análise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-emerald-50/60 p-4 dark:bg-emerald-950/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                Ponto forte
              </p>
              <p className="mt-2 text-sm leading-relaxed">{summary.strength}</p>
            </div>
            <div className="rounded-lg border bg-amber-50/60 p-4 dark:bg-amber-950/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                Principal prioridade
              </p>
              <p className="mt-2 text-sm leading-relaxed">{summary.priority}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-amber-500" /> Ranking privado
            </CardTitle>
            <CardDescription>Comparação apenas entre empresas selecionadas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14">Pos.</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRanking.map((business, index) => (
                  <TableRow key={business.id}>
                    <TableCell className="font-semibold">{business.score === null ? "—" : `${index + 1}º`}</TableCell>
                    <TableCell>
                      <span className="font-medium">{business.name}</span>
                      {business.primary ? (
                        <Badge variant="secondary" className="ml-2">Sua empresa</Badge>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right text-lg font-semibold">
                      {business.score ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {ranking.length > 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>Comparação por categoria</CardTitle>
            <CardDescription>Os mesmos critérios são aplicados a todas as empresas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 w-full" aria-label="Gráfico comparativo por categoria">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 16, left: 0, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="category" tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                  <Tooltip content={<ComparisonTooltip ranking={ranking} />} />
                  {ranking.map((business, index) => (
                    <Bar
                      key={business.id}
                      dataKey={business.id}
                      name={business.name}
                      fill={chartColors[index % chartColors.length]}
                      radius={[5, 5, 0, 0]}
                      maxBarSize={42}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {ranking.map((business, index) => (
                <div key={business.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="size-2.5 rounded-sm" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                  {business.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="size-5 text-primary" /> Recomendações prioritárias
          </CardTitle>
          <CardDescription>Ações ordenadas por impacto e esforço estimados.</CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {recommendations.map((recommendation) => (
                <article key={recommendation.id} className="rounded-xl border p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {recommendation.priority}
                      </span>
                      <div>
                        <h3 className="font-semibold">{recommendation.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {recommendation.rationale}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                  </div>
                  <div className="ml-11 mt-4 flex flex-wrap gap-2">
                    <Badge variant={recommendation.impact === "HIGH" ? "attention" : "outline"}>
                      Impacto {translateLevel(recommendation.impact)}
                    </Badge>
                    <Badge variant="secondary">Esforço {translateLevel(recommendation.effort)}</Badge>
                  </div>
                  <ol className="ml-11 mt-4 space-y-2">
                    {recommendation.steps.map((step, index) => (
                      <li key={`${recommendation.id}-${index}`} className="flex gap-2 text-sm">
                        <span className="text-muted-foreground">{index + 1}.</span> {step}
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Nenhuma recomendação foi gerada para esta análise.
            </p>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Metodologia {methodologyVersion}. O score resume sinais observáveis e não garante vendas ou posição no Google.
      </p>
    </div>
  );
}

function translateLevel(level: "LOW" | "MEDIUM" | "HIGH") {
  return { LOW: "baixo", MEDIUM: "médio", HIGH: "alto" }[level];
}

function ScoreTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value?: number }> }) {
  if (!active || !payload?.[0]) return null;
  return <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-md">Score: <strong>{payload[0].value}</strong></div>;
}

function ComparisonTooltip({
  active,
  payload,
  label,
  ranking,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string; value?: number }>;
  label?: string;
  ranking: RankedBusiness[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-48 rounded-md border bg-background p-3 text-sm shadow-md">
      <p className="mb-2 font-medium">{label}</p>
      {payload.map((item) => (
        <div key={String(item.dataKey)} className="flex justify-between gap-4 text-muted-foreground">
          <span>{ranking.find(({ id }) => id === item.dataKey)?.name}</span>
          <strong className="text-foreground">{item.value ?? "—"}</strong>
        </div>
      ))}
    </div>
  );
}
