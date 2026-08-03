import { ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";

import { NewAnalysisButton } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db/client";
import { formatDate } from "@/lib/formatters";

export const dynamic = "force-dynamic";

export default async function AnalysesPage() {
  const user = await getOrCreateCurrentUser();
  const analyses = user
    ? await db.analysis.findMany({
        where: {
          business: { memberships: { some: { userId: user.id } } },
          status: { in: ["COMPLETED", "PARTIAL"] },
          result: { isNot: null },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { business: true, result: true },
      })
    : [];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Histórico</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Análises</h1>
          <p className="mt-2 text-muted-foreground">
            Consulte os resultados preservados de cada diagnóstico.
          </p>
        </div>
        <NewAnalysisButton />
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Resultados disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          {analyses.length > 0 ? (
            <div className="divide-y">
              {analyses.map((analysis) => (
                <article
                  key={analysis.id}
                  className="flex flex-col justify-between gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BarChart3 className="size-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-medium">{analysis.business.name}</h2>
                        <Badge variant={analysis.status === "COMPLETED" ? "success" : "secondary"}>
                          {analysis.status === "COMPLETED" ? "Concluída" : "Parcial"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDate(analysis.createdAt)} · Score {analysis.result?.totalScore ?? "indisponível"}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <Link href={`/analises/${analysis.id}`}>
                      Ver resultado <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed py-12 text-center">
              <BarChart3 className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-4 font-medium">Nenhum resultado disponível</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Inicie o primeiro diagnóstico para gerar um resultado.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
