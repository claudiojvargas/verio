import { z } from "zod";

const uniqueStrings = (values: string[]) =>
  new Set(values).size === values.length;

export const credibilityAnalysisInputSchema = z
  .object({
    business: z
      .object({
        name: z.string().trim().min(2).max(160),
        city: z.string().trim().min(2).max(120),
        segment: z.string().trim().min(2).max(120).optional(),
      })
      .strict(),
    evidence: z
      .array(
        z
          .object({
            key: z.string().min(1).max(120),
            channel: z.enum(["GOOGLE_MAPS", "WEBSITE", "WHATSAPP"]),
            observation: z.string().min(1).max(2_000),
          })
          .strict(),
      )
      .min(1)
      .max(50),
  })
  .strict()
  .superRefine(({ evidence }, context) => {
    const keys = evidence.map(({ key }) => key);
    if (!uniqueStrings(keys)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["evidence"],
        message: "Evidence keys must be unique.",
      });
    }
  });

export const credibilityAnalysisDraftSchema = z
  .object({
    summary: z.string().min(1).max(600),
    observations: z
      .array(
        z
          .object({
            signalKey: z.string().min(1).max(120),
            evidenceKeys: z
              .array(z.string().min(1).max(120))
              .min(1)
              .max(10)
              .refine(uniqueStrings, "Evidence keys must be unique."),
            outcome: z.enum(["POSITIVE", "ATTENTION"]),
            explanation: z.string().min(1).max(500),
          })
          .strict(),
      )
      .max(20),
    recommendationDrafts: z
      .array(
        z
          .object({
            key: z.string().min(1).max(120),
            title: z.string().min(2).max(160),
            rationale: z.string().min(2).max(500),
            evidenceKeys: z
              .array(z.string().min(1).max(120))
              .min(1)
              .max(10)
              .refine(uniqueStrings, "Evidence keys must be unique."),
            impact: z.enum(["LOW", "MEDIUM", "HIGH"]),
            effort: z.enum(["LOW", "MEDIUM", "HIGH"]),
            steps: z.array(z.string().min(2).max(240)).min(1).max(5),
          })
          .strict(),
      )
      .max(5),
  })
  .strict()
  .superRefine(({ observations, recommendationDrafts }, context) => {
    const signalKeys = observations.map(({ signalKey }) => signalKey);
    if (!uniqueStrings(signalKeys)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["observations"],
        message: "Observation signal keys must be unique.",
      });
    }

    const recommendationKeys = recommendationDrafts.map(({ key }) => key);
    if (!uniqueStrings(recommendationKeys)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["recommendationDrafts"],
        message: "Recommendation keys must be unique.",
      });
    }
  });

export type CredibilityAnalysisInput = z.infer<
  typeof credibilityAnalysisInputSchema
>;
export type CredibilityAnalysisDraft = z.infer<
  typeof credibilityAnalysisDraftSchema
>;
