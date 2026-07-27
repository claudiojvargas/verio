import { z } from "zod";

export const credibilityAnalysisInputSchema = z.object({
  business: z.object({
    name: z.string().trim().min(2).max(160),
    city: z.string().trim().min(2).max(120),
    segment: z.string().trim().min(2).max(120).optional(),
  }),
  evidence: z
    .array(
      z.object({
        key: z.string().min(1).max(120),
        channel: z.enum(["GOOGLE_MAPS", "WEBSITE", "WHATSAPP"]),
        observation: z.string().min(1).max(2_000),
      }),
    )
    .min(1)
    .max(50),
});

export const credibilityAnalysisDraftSchema = z.object({
  summary: z.string().min(1).max(600),
  observations: z
    .array(
      z.object({
        signalKey: z.string().min(1).max(120),
        evidenceKeys: z.array(z.string().min(1).max(120)).min(1).max(10),
        outcome: z.enum(["POSITIVE", "ATTENTION"]),
        explanation: z.string().min(1).max(500),
      }),
    )
    .max(20),
  recommendationDrafts: z
    .array(
      z.object({
        key: z.string().min(1).max(120),
        title: z.string().min(2).max(160),
        rationale: z.string().min(2).max(500),
        evidenceKeys: z.array(z.string().min(1).max(120)).min(1).max(10),
        impact: z.enum(["LOW", "MEDIUM", "HIGH"]),
        effort: z.enum(["LOW", "MEDIUM", "HIGH"]),
        steps: z.array(z.string().min(2).max(240)).min(1).max(5),
      }),
    )
    .max(5),
});

export type CredibilityAnalysisInput = z.infer<typeof credibilityAnalysisInputSchema>;
export type CredibilityAnalysisDraft = z.infer<typeof credibilityAnalysisDraftSchema>;
