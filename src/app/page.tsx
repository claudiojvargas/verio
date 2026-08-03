import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, Check, Eye, Gauge, Sparkles } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Eye,
    title: "Veja como sua empresa aparece",
    description:
      "Reunimos os sinais públicos do Google, site e canal de contato em uma visão clara.",
  },
  {
    icon: Gauge,
    title: "Entenda o que merece atenção",
    description:
      "Cada conclusão mostra a evidência e o impacto, sem notas misteriosas ou jargão técnico.",
  },
  {
    icon: Sparkles,
    title: "Saiba o que fazer primeiro",
    description:
      "Receba poucas recomendações práticas, organizadas por impacto e esforço.",
  },
] as const;

const steps = [
  "Confirme sua empresa e seus canais",
  "Receba um diagnóstico explicável",
  "Execute prioridades e acompanhe a evolução",
] as const;

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
              V
            </span>
            Verio
          </Link>
          <nav className="flex items-center gap-1" aria-label="Navegação principal">
            <ThemeToggle />
            <SignedOut>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/entrar">Entrar</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/cadastro">Criar conta</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button asChild size="sm">
                <Link href="/painel">Abrir painel</Link>
              </Button>
            </SignedIn>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="container grid items-center gap-14 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
            <div className="max-w-3xl space-y-7">
              <Badge variant="secondary" className="gap-1.5 py-1">
                <Sparkles className="size-3.5" />
                Credibilidade digital, sem complicação
              </Badge>
              <div className="space-y-5">
                <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                  Descubra o que faz sua empresa parecer confiável online.
                </h1>
                <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  O Verio transforma sinais dispersos da sua presença digital em
                  um diagnóstico claro e um plano curto de ações prioritárias.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <SignedOut>
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/cadastro">
                      Criar minha conta <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/entrar">Já tenho uma conta</Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/painel">
                      Ir para o painel <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </SignedIn>
              </div>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="size-4 text-emerald-600" />
                Conta gratuita. Sem cartão de crédito.
              </p>
            </div>

            <Card className="relative mx-auto w-full max-w-md overflow-hidden shadow-xl shadow-primary/10">
              <div className="border-b bg-muted/40 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Visão do diagnóstico</p>
                    <p className="text-xs text-muted-foreground">Exemplo ilustrativo</p>
                  </div>
                  <Badge variant="success">Análise concluída</Badge>
                </div>
              </div>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Score de presença</p>
                    <p className="text-5xl font-semibold tracking-tight">78</p>
                  </div>
                  <span className="pb-1 text-sm text-muted-foreground">de 100</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[78%] rounded-full bg-primary" />
                </div>
                <div className="space-y-3">
                  {[
                    ["Descoberta", "82"],
                    ["Confiança", "74"],
                    ["Contato", "79"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-lg border px-4 py-3"
                    >
                      <span className="text-sm">{label}</span>
                      <span className="text-sm font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-primary/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">
                    Próxima prioridade
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    Padronize o telefone exibido no site e no Google.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-primary">Clareza para agir</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Menos métricas. Mais decisões úteis.
            </h2>
            <p className="mt-4 text-muted-foreground">
              O Verio foi pensado para quem administra um negócio, não para quem
              precisa aprender uma nova ferramenta de marketing.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="border-muted shadow-none">
                <CardContent className="pt-6">
                  <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y bg-muted/30">
          <div className="container grid gap-12 py-20 md:grid-cols-2 md:items-center sm:py-24">
            <div>
              <p className="text-sm font-semibold text-primary">Como funciona</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Da dúvida à primeira ação em poucos passos.
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                Você sempre sabe o que foi verificado, por que aquilo importa e
                como avançar.
              </p>
            </div>
            <ol className="space-y-6">
              {steps.map((step, index) => (
                <li key={step} className="flex items-center gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-background text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="container py-20 sm:py-24">
          <div className="rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
              Sua presença digital pode ser mais clara hoje.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Crie sua conta e prepare sua empresa para o primeiro diagnóstico do
              Verio.
            </p>
            <div className="mt-7">
              <SignedOut>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/cadastro">Começar gratuitamente</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/painel">Abrir meu painel</Link>
                </Button>
              </SignedIn>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Clovr. Verio é uma plataforma de credibilidade digital.</p>
          <Link href="/privacidade" className="hover:text-foreground">
            Privacidade
          </Link>
        </div>
      </footer>
    </div>
  );
}
