import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard-shell";

type ProductLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function ProductLayout({ children }: ProductLayoutProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/entrar");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
