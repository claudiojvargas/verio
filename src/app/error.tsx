"use client";

import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <section className="space-y-4 text-center">
        <h1 className="text-3xl font-semibold">Não foi possível continuar</h1>
        <p className="text-muted-foreground">
          Ocorreu uma falha inesperada. Tente novamente.
        </p>
        <Button onClick={reset}>Tentar novamente</Button>
      </section>
    </main>
  );
}
