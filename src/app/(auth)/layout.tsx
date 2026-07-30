import type { ReactNode } from "react";

type AuthLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted/40 px-4 py-10">
      {children}
    </main>
  );
}
