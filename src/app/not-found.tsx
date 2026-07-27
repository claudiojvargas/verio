import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <section className="space-y-4 text-center">
        <p className="text-sm font-semibold text-primary">Erro 404</p>
        <h1 className="text-3xl font-semibold">Página não encontrada</h1>
        <p className="text-muted-foreground">
          O endereço informado não existe ou não está mais disponível.
        </p>
        <Button asChild>
          <Link href="/">Voltar ao início</Link>
        </Button>
      </section>
    </main>
  );
}
