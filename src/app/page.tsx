import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl space-y-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Clovr apresenta
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Credibilidade digital, explicada com clareza.
        </h1>
        <p className="mx-auto max-w-xl text-pretty text-lg text-muted-foreground">
          A fundação técnica do Verio está pronta. As funcionalidades serão
          implementadas após a validação dos gates de produto.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/cadastro">Criar minha conta</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/entrar">Entrar</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          O cadastro é gratuito. As análises serão liberadas nas próximas fases.
        </p>
      </section>
    </main>
  );
}
