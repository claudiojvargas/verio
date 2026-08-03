import { z } from "zod";

import type { RegisteredChannel } from "@/modules/analyses/application/registration-assessment";

export const competitorChannelsSnapshotSchema = z.array(
  z
    .object({
      type: z.enum(["GOOGLE_MAPS", "WEBSITE", "WHATSAPP"]),
      value: z.string().min(1),
      status: z.enum(["CONFIRMED", "UNAVAILABLE", "UNRECOGNIZED"]),
    })
    .strict(),
);

export function parseCompetitorChannelsSnapshot(
  value: unknown,
): RegisteredChannel[] {
  const parsed = competitorChannelsSnapshotSchema.safeParse(value);
  return parsed.success ? parsed.data : [];
}
