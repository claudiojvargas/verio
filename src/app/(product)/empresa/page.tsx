import { Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
  ArchiveBusinessButton,
  BusinessForm,
} from "@/modules/businesses/ui/business-form";

export const dynamic = "force-dynamic";

function channelValue(
  channels: Array<{ type: string; value: string }>,
  type: string,
) {
  return channels.find((channel) => channel.type === type)?.value ?? "";
}

export default async function BusinessPage() {
  const user = await getOrCreateCurrentUser();
  const membership = user
    ? await db.businessMembership.findFirst({
        where: { userId: user.id, role: "OWNER", business: { status: "ACTIVE" } },
        include: { business: { include: { channels: true } } },
      })
    : null;
  const business = membership?.business;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">Minha empresa</h1>
              {business ? <Badge variant="success">Ativa</Badge> : null}
            </div>
            <p className="mt-1 text-muted-foreground">
              Confirme os dados que serão usados nos diagnósticos do Verio.
            </p>
          </div>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{business ? "Dados da empresa" : "Cadastre sua empresa"}</CardTitle>
          <CardDescription>
            Google Maps e WhatsApp são necessários. O site é opcional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BusinessForm
            defaultValues={{
              name: business?.name ?? "",
              city: business?.city ?? "",
              state: business?.state ?? "",
              googleMaps: channelValue(business?.channels ?? [], "GOOGLE_MAPS"),
              website: channelValue(business?.channels ?? [], "WEBSITE"),
              whatsapp: channelValue(business?.channels ?? [], "WHATSAPP"),
            }}
          />
        </CardContent>
      </Card>

      {business ? (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base">Arquivar empresa</CardTitle>
            <CardDescription>
              A empresa deixará de aparecer no painel ativo. O histórico não será apagado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ArchiveBusinessButton />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
