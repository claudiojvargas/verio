import { SignOutButton } from "@clerk/nextjs";
import {
  BarChart3,
  Building2,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const navigation = [
  { label: "Visão geral", icon: LayoutDashboard, href: "/painel", current: true },
  { label: "Análises", icon: BarChart3, disabled: true },
  { label: "Minha empresa", icon: Building2, disabled: true },
  { label: "Recomendações", icon: Lightbulb, disabled: true },
] as const;

type DashboardShellProps = Readonly<{
  children: ReactNode;
}>;

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-dvh bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/painel" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
              V
            </span>
            Verio
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Navegação do painel">
          {navigation.map(({ label, icon: Icon, ...item }) =>
            "href" in item ? (
              <Link
                key={label}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ) : (
              <span
                key={label}
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground/60"
                title="Disponível em breve"
              >
                <Icon className="size-4" />
                {label}
              </span>
            ),
          )}
        </nav>
        <div className="border-t p-3">
          <span className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground/60">
            <Settings className="size-4" />
            Configurações
          </span>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link href="/painel" className="flex items-center gap-2 font-semibold lg:hidden">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
                V
              </span>
              Verio
            </Link>
            <p className="hidden text-sm text-muted-foreground lg:block">
              Sua presença digital em um só lugar
            </p>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <SignOutButton redirectUrl="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </SignOutButton>
            </div>
          </div>
          <nav
            className="flex gap-1 overflow-x-auto border-t px-3 py-2 lg:hidden"
            aria-label="Navegação móvel do painel"
          >
            <Link
              href="/painel"
              aria-current="page"
              className="flex shrink-0 items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-xs font-medium text-primary"
            >
              <LayoutDashboard className="size-3.5" /> Visão geral
            </Link>
            <span className="flex shrink-0 cursor-not-allowed items-center gap-2 px-3 py-2 text-xs text-muted-foreground/60">
              <BarChart3 className="size-3.5" /> Análises
            </span>
            <span className="flex shrink-0 cursor-not-allowed items-center gap-2 px-3 py-2 text-xs text-muted-foreground/60">
              <Building2 className="size-3.5" /> Empresa
            </span>
          </nav>
        </header>
        <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function NewAnalysisButton() {
  return (
    <Button disabled className="gap-2" title="Disponível na próxima fase">
      <Plus className="size-4" />
      Nova análise
    </Button>
  );
}
