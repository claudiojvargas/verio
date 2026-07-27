import type { ChannelType, Prisma } from "@prisma/client";

import type {
  BusinessFormValues,
  CompetitorFormValues,
} from "@/modules/businesses/schemas/business-form";

type FormValues = BusinessFormValues | CompetitorFormValues;

export function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeUrl(value: string) {
  const url = new URL(value.trim());
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("UNSAFE_URL");
  }
  url.hash = "";
  url.hostname = url.hostname.toLowerCase();
  return url.toString();
}

export function channelsFromForm(values: FormValues) {
  const candidates: Array<[ChannelType, string]> = [
    ["GOOGLE_MAPS", values.googleMaps],
    ["WEBSITE", values.website],
    ["WHATSAPP", values.whatsapp],
  ];

  return candidates
    .filter((entry): entry is [ChannelType, string] => Boolean(entry[1]))
    .map(([type, value]) => ({
      type,
      value: value.trim(),
      canonicalValue: normalizeUrl(value),
      status: "CONFIRMED" as const,
      confirmedAt: new Date(),
    })) satisfies Prisma.BusinessChannelCreateWithoutBusinessInput[];
}
