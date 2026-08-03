"use client";

import { SignOutButton } from "@clerk/nextjs";
import {
  BarChart3,
  Building2,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const navigation = [
  { label: "Visão geral", icon: LayoutDashboard, href: "/painel" },
  { label: "Análises", icon: BarChart3, href: "/analises" },
  { label: "Minha empresa", icon: Building2, href: "/empresa" },
  { label: "Concorrentes", icon: Users, href: "/concorrentes" },
  { label: "Recomendações", icon: Lightbulb, disabled: true },
] as const;

type DashboardShellProps = Readonly<{
  children: ReactNode;
}>;

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();

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
          {navigation.map(({ label, icon: Icon, ...item }) => {
            const isCurrent = "href" in item && pathname === item.href;
            return "href" in item ? (
              <Link
                key={label}
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                className={
                  isCurrent
                    ? "flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary"
                    : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                }
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
            );
          })}
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
            {navigation
              .filter((item) => "href" in item)
              .map(({ label, icon: Icon, ...item }) => {
                if (!("href" in item)) return null;
                const isCurrent = pathname === item.href;
                return (
                  <Link
                    key={label}
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={
                      isCurrent
                        ? "flex shrink-0 items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-xs font-medium text-primary"
                        : "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground"
                    }
                  >
                    <Icon className="size-3.5" /> {label}
                  </Link>
                );
              })}
          </nav>
        </header>
        <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function NewAnalysisButton() {
  return (
    <Button asChild className="gap-2">
      <Link href="/analises/nova">
        <Plus className="size-4" />
        Nova análise
      </Link>
    </Button>
  );
}
