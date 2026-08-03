import type { ScoreObservation } from "@/modules/scoring";

export type RegisteredChannel = Readonly<{
  type: "GOOGLE_MAPS" | "WEBSITE" | "WHATSAPP";
  value: string;
  status: "CONFIRMED" | "UNAVAILABLE" | "UNRECOGNIZED";
}>;

export type RegistrationEvidence = Readonly<{
  key: string;
  channel: RegisteredChannel["type"];
  observation: string;
}>;

export function assessRegisteredChannels(
  channels: readonly RegisteredChannel[],
) {
  const confirmed = new Map(
    channels
      .filter(({ status }) => status === "CONFIRMED")
      .map((channel) => [channel.type, channel]),
  );
  const google = confirmed.get("GOOGLE_MAPS");
  const website = confirmed.get("WEBSITE");
  const whatsapp = confirmed.get("WHATSAPP");
  const evidence: RegistrationEvidence[] = [];

  if (google) {
    evidence.push({
      key: "registered-google-maps",
      channel: "GOOGLE_MAPS",
      observation:
        "O responsável confirmou este link como o perfil da empresa no Google Maps.",
    });
  }
  if (website) {
    evidence.push({
      key: "registered-website",
      channel: "WEBSITE",
      observation: `O responsável confirmou um site com protocolo ${
        website.value.startsWith("https://") ? "HTTPS" : "HTTP"
      }.`,
    });
  }
  if (whatsapp) {
    evidence.push({
      key: "registered-whatsapp",
      channel: "WHATSAPP",
      observation: "O responsável confirmou um canal direto de WhatsApp.",
    });
  }

  const observations: ScoreObservation[] = [
    {
      signalKey: "google-profile-found",
      outcome: google ? "PARTIAL" : "NOT_VERIFIABLE",
    },
    {
      signalKey: "business-identity-consistent",
      outcome: google && whatsapp ? "PARTIAL" : "NOT_VERIFIABLE",
    },
    { signalKey: "public-reputation-visible", outcome: "NOT_VERIFIABLE" },
    {
      signalKey: "business-information-complete",
      outcome:
        google && whatsapp ? (website ? "POSITIVE" : "PARTIAL") : "NEGATIVE",
    },
    {
      signalKey: "website-secure",
      outcome: website
        ? website.value.startsWith("https://")
          ? "POSITIVE"
          : "NEGATIVE"
        : "NOT_VERIFIABLE",
    },
    { signalKey: "services-clear", outcome: "NOT_VERIFIABLE" },
    { signalKey: "business-description-clear", outcome: "NOT_VERIFIABLE" },
    {
      signalKey: "whatsapp-reachable",
      outcome: whatsapp ? "PARTIAL" : "NOT_VERIFIABLE",
    },
    {
      signalKey: "contact-consistent",
      outcome: whatsapp && google ? "PARTIAL" : "NOT_VERIFIABLE",
    },
    {
      signalKey: "contact-action-clear",
      outcome: whatsapp ? "POSITIVE" : "NOT_VERIFIABLE",
    },
  ];

  return { evidence, observations };
}
