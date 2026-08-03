import {
  AlertTriangle,
  Building2,
  Globe2,
  MapPin,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db/client";
import { StartAnalysisForm } from "@/modules/analyses/ui/start-analysis-form";

export const dynamic = "force-dynamic";

const channelLabels = {
  GOOGLE_MAPS: "Google Maps",
  WEBSITE: "Site",
  WHATSAPP: "WhatsApp",
};
const channelIcons = {
  GOOGLE_MAPS: MapPin,
  WEBSITE: Globe2,
  WHATSAPP: MessageCircle,
};

export default async function NewAnalysisPage() {
  const user = await getOrCreateCurrentUser();
  const membership = user
    ? await db.businessMembership.findFirst({
        where: {
          userId: user.id,
          role: "OWNER",
          business: { status: "ACTIVE" },
        },
        include: {
          business: {
            include: {
              channels: true,
              competitors: { include: { competitorBusiness: true } },
            },
          },
        },
      })
    : null;

  if (!membership) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Cadastre sua empresa primeiro</CardTitle>
          <CardDescription>
            Precisamos dos canais que serão usados no diagnóstico.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/empresa">Cadastrar empresa</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  const { business } = membership;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-sm font-medium text-primary">Novo diagnóstico</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Confirme os dados da análise
        </h1>
        <p className="mt-2 text-muted-foreground">
          Revise a empresa e os canais antes de iniciar.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-5" />
            {business.name}
          </CardTitle>
          <CardDescription>
            {business.city}
            {business.state ? `, ${business.state}` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {business.channels.map((channel) => {
            const Icon = channelIcons[channel.type];
            return (
              <div
                key={channel.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm">
                    {channelLabels[channel.type]}
                  </span>
                </span>
                <Badge
                  variant={
                    channel.status === "CONFIRMED" ? "success" : "secondary"
                  }
                >
                  {channel.status === "CONFIRMED"
                    ? "Confirmado"
                    : "Indisponível"}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Comparação</CardTitle>
          <CardDescription>
            {business.competitors.length
              ? `${business.competitors.length} concorrente(s) será(ão) incluído(s).`
              : "A análise será feita sem concorrentes."}
          </CardDescription>
        </CardHeader>
        {business.competitors.length ? (
          <CardContent>
            <ul className="space-y-2">
              {business.competitors.map(({ competitorBusiness }) => (
                <li
                  key={competitorBusiness.id}
                  className="rounded-lg border p-3 text-sm"
                >
                  {competitorBusiness.name}
                </li>
              ))}
            </ul>
          </CardContent>
        ) : null}
      </Card>
      <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <p>
          Este diagnóstico usa somente os canais confirmados. Sinais que não
          puderem ser verificados reduzem a cobertura e nunca são tratados
          automaticamente como negativos.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <StartAnalysisForm />
        <Button asChild variant="outline">
          <Link href="/empresa">Revisar empresa</Link>
        </Button>
      </div>
    </div>
  );
}
