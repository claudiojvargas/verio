import { SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";

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

  return (
    <main className="min-h-dvh bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <span className="text-lg font-semibold">Verio</span>
          <SignOutButton redirectUrl="/">
            <Button variant="outline" size="sm">
              Sair
            </Button>
          </SignOutButton>
        </div>
      </header>
      <section className="container py-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-medium text-primary">Área protegida</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Olá{user.name ? `, ${user.name.split(" ")[0]}` : ""}.
          </h1>
          <p className="text-muted-foreground">
            Sua conta está pronta. O fluxo de análise será implementado na
            próxima etapa do produto.
          </p>
        </div>
      </section>
    </main>
  );
}
