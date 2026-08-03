"use client";

import { AlertCircle, CheckCircle2, Circle, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SafeAnalysisEvent = {
  id: string;
  stage: string;
  status: string;
  code: string | null;
  publicMessage: string;
  technicalMessage: string | null;
  metadata: unknown;
  durationMs: number | null;
  createdAt: string;
};

export function AnalysisStatus({
  failed = false,
  failureCode,
  attempt,
  events,
}: {
  failed?: boolean;
  failureCode: string | null;
  attempt: number;
  events: SafeAnalysisEvent[];
}) {
  const router = useRouter();

  useEffect(() => {
    if (failed) return;
    const interval = window.setInterval(() => router.refresh(), 3_000);
    return () => window.clearInterval(interval);
  }, [failed, router]);

  const visibleEvents = latestEventPerStage(events);
  const latestFailure = [...events]
    .reverse()
    .find(({ status }) => status === "FAILED");

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              {failed ? (
                <AlertCircle className="size-5 text-destructive" />
              ) : (
                <LoaderCircle className="size-5 animate-spin text-primary" />
              )}
              {failed ? "Não foi possível concluir" : "Análise em andamento"}
            </CardTitle>
            <Badge variant={failed ? "destructive" : "secondary"}>
              Tentativa {attempt || 1}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5" aria-live="polite">
          <ol className="space-y-4" aria-label="Progresso da análise">
            {visibleEvents.map((event) => (
              <li key={event.id} className="flex gap-3">
                <EventIcon status={event.status} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">{event.publicMessage}</p>
                    {event.durationMs !== null ? (
                      <span className="text-xs text-muted-foreground">
                        {event.durationMs} ms
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(event.createdAt).toLocaleTimeString("pt-BR")}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {events.length === 0 && !failed ? (
            <p className="text-sm text-muted-foreground">
              Aguardando o processador iniciar o diagnóstico.
            </p>
          ) : null}

          {failed ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive">
                {latestFailure?.publicMessage ??
                  "Não foi possível concluir a análise."}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Corrija a configuração indicada e inicie uma nova análise.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Você pode permanecer nesta página. O resultado aparecerá
              automaticamente.
            </p>
          )}
        </CardContent>
      </Card>

      <TechnicalDebugger
        events={events}
        failureCode={failureCode}
        attempt={attempt}
      />
    </div>
  );
}

function EventIcon({ status }: { status: string }) {
  if (status === "FAILED") {
    return <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />;
  }
  if (status === "COMPLETED") {
    return <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />;
  }
  if (status === "RUNNING") {
    return (
      <LoaderCircle className="mt-0.5 size-5 shrink-0 animate-spin text-primary" />
    );
  }
  return <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />;
}

function TechnicalDebugger({
  events,
  failureCode,
  attempt,
}: {
  events: SafeAnalysisEvent[];
  failureCode: string | null;
  attempt: number;
}) {
  return (
    <details className="rounded-lg border bg-muted/20">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
        Detalhes técnicos
      </summary>
      <div className="space-y-3 border-t p-4 font-mono text-xs">
        <p>tentativa: {attempt}</p>
        <p>failure_code: {failureCode ?? "—"}</p>
        {events.map((event) => (
          <div key={event.id} className="rounded-md bg-background p-3">
            <p>
              {event.stage} · {event.status}
              {event.code ? ` · ${event.code}` : ""}
            </p>
            {event.technicalMessage ? (
              <p className="mt-1 text-muted-foreground">
                {event.technicalMessage}
              </p>
            ) : null}
            {event.metadata ? (
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-muted-foreground">
                {JSON.stringify(event.metadata, null, 2)}
              </pre>
            ) : null}
          </div>
        ))}
      </div>
    </details>
  );
}

function latestEventPerStage(events: SafeAnalysisEvent[]) {
  const latest = new Map<string, SafeAnalysisEvent>();
  for (const event of events) latest.set(event.stage, event);
  return [...latest.values()];
}
