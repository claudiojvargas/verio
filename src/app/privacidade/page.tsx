import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <main className="container max-w-3xl py-16">
      <Button asChild variant="ghost" className="-ml-4 mb-8">
        <Link href="/">← Voltar</Link>
      </Button>
      <h1 className="text-3xl font-semibold tracking-tight">Privacidade</h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        A política de privacidade completa será publicada antes do início do
        piloto. O Verio utiliza somente os dados necessários para autenticação e
        funcionamento da conta nesta fase.
      </p>
    </main>
  );
}
