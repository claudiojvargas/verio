import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Verio",
    template: "%s | Verio",
  },
  description:
    "Entenda os sinais digitais que influenciam a credibilidade do seu negócio.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
