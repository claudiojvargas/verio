"use client";

import { AlertCircle, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalysisStatus({ failed = false }: { failed?: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (failed) return;
    const interval = window.setInterval(() => router.refresh(), 3_000);
    return () => window.clearInterval(interval);
  }, [failed, router]);

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {failed ? (
            <AlertCircle className="size-5 text-destructive" />
          ) : (
            <LoaderCircle className="size-5 animate-spin text-primary" />
          )}
          {failed ? "Não foi possível concluir" : "Análise em andamento"}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground" aria-live="polite">
        {failed
          ? "Revise a chave Google AI e os canais cadastrados antes de tentar novamente."
          : "Você pode permanecer nesta página. O resultado será exibido automaticamente quando estiver pronto."}
      </CardContent>
    </Card>
  );
}
