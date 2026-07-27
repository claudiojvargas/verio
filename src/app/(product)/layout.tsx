import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type ProductLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function ProductLayout({ children }: ProductLayoutProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/entrar");
  }

  return children;
}
