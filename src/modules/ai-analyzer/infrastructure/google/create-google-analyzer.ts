import "server-only";

import { z } from "zod";

import { GoogleAIProvider } from "@/modules/ai-analyzer/infrastructure/google/google-ai-provider";
import { CredibilityAIAnalyzer } from "@/modules/analyses/ai/credibility-ai-analyzer";

const googleAIEnvironmentSchema = z.object({
  GOOGLE_AI_API_KEY: z.string().min(1),
  GOOGLE_AI_MODEL: z.string().min(1).default("gemini-3.6-flash"),
});

/** Composition root: the only place that selects Google for this use case. */
export function createGoogleCredibilityAnalyzer() {
  const environment = googleAIEnvironmentSchema.parse(process.env);
  const provider = new GoogleAIProvider({
    apiKey: environment.GOOGLE_AI_API_KEY,
    model: environment.GOOGLE_AI_MODEL,
  });
  return new CredibilityAIAnalyzer(provider);
}
