import { Building2, MapPin, Users } from "lucide-react";
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
import {
  CompetitorForm,
  RemoveCompetitorButton,
} from "@/modules/businesses/ui/competitor-form";

export const dynamic = "force-dynamic";

function channelValue(
  channels: Array<{ type: string; value: string }>,
  type: string,
) {
  return channels.find((channel) => channel.type === type)?.value ?? "";
}

export default async function CompetitorsPage() {
  const user = await getOrCreateCurrentUser();
  const membership = user
    ? await db.businessMembership.findFirst({
        where: { userId: user.id, role: "OWNER", business: { status: "ACTIVE" } },
        include: {
          business: {
            include: {
              competitors: {
                orderBy: { position: "asc" },
                include: { competitorBusiness: { include: { channels: true } } },
              },
            },
          },
        },
      })
    : null;
  const competitors = membership?.business.competitors ?? [];
  const canAdd = Boolean(membership) && competitors.length < 3;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="size-5" />
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Concorrentes</h1>
            <p className="mt-1 text-muted-foreground">
              Adicione até três referências para futuras comparações privadas.
            </p>
          </div>
        </div>
        <Badge variant="secondary">{competitors.length} de 3 cadastrados</Badge>
      </section>

      {!membership ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Building2 className="size-8 text-muted-foreground" />
            <h2 className="mt-4 font-semibold">Cadastre sua empresa primeiro</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Precisamos saber qual é a sua empresa antes de relacionar concorrentes.
            </p>
            <Button asChild className="mt-5">
              <Link href="/empresa">Cadastrar empresa</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {competitors.map((relation) => {
              const competitor = relation.competitorBusiness;
              return (
                <Card key={relation.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-base">{competitor.name}</CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          {competitor.city}
                          {competitor.state ? `, ${competitor.state}` : ""}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">#{relation.position}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      {competitor.channels.length} canal(is) confirmado(s)
                    </p>
                    <details className="group">
                      <summary className="cursor-pointer text-sm font-medium text-primary marker:hidden">
                        Editar dados
                      </summary>
                      <div className="mt-5 border-t pt-5">
                        <CompetitorForm
                          competitorId={relation.id}
                          defaultValues={{
                            name: competitor.name,
                            city: competitor.city,
                            state: competitor.state ?? "",
                            googleMaps: channelValue(competitor.channels, "GOOGLE_MAPS"),
                            website: channelValue(competitor.channels, "WEBSITE"),
                            whatsapp: channelValue(competitor.channels, "WHATSAPP"),
                          }}
                        />
                      </div>
                    </details>
                    <RemoveCompetitorButton competitorId={relation.id} />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {canAdd ? (
            <Card>
              <CardHeader>
                <CardTitle>Adicionar concorrente</CardTitle>
                <CardDescription>
                  Os canais são opcionais agora e poderão ser completados depois.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompetitorForm />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Você atingiu o limite de três concorrentes do MVP. Remova um para
                adicionar outro.
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
