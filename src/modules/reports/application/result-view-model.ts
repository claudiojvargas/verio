import { z } from "zod";

import type {
  RankedBusiness,
  ResultDimension,
  ResultRecommendation,
} from "@/modules/reports/ui/results-dashboard";

const dimensionsSchema = z.array(
  z.object({
    key: z.string(),
    score: z.number().min(0).max(100).nullable(),
  }),
);

const summarySchema = z.object({
  strength: z.string(),
  priority: z.string(),
});

const stepsSchema = z.array(z.string());

const categoryLabels: Record<string, string> = {
  discovery: "Descoberta",
  trust: "Confiança",
  clarity: "Clareza",
  contact: "Contato",
  DISCOVERY: "Descoberta",
  TRUST: "Confiança",
  CLARITY: "Clareza",
  CONTACT: "Contato",
};

export function parseDimensions(value: unknown): ResultDimension[] {
  const parsed = dimensionsSchema.safeParse(value);
  if (!parsed.success) return [];
  return parsed.data.map((dimension) => ({
    ...dimension,
    label: categoryLabels[dimension.key] ?? dimension.key,
  }));
}

export function parseSummary(value: unknown) {
  const parsed = summarySchema.safeParse(value);
  return parsed.success
    ? parsed.data
    : {
        strength: "Não foi possível sintetizar um ponto forte nesta análise.",
        priority: "Revise as recomendações e evidências disponíveis.",
      };
}

export function toRecommendationViewModel(recommendation: {
  id: string;
  title: string;
  rationale: string;
  impact: "LOW" | "MEDIUM" | "HIGH";
  effort: "LOW" | "MEDIUM" | "HIGH";
  priority: number;
  steps: unknown;
}): ResultRecommendation {
  const parsedSteps = stepsSchema.safeParse(recommendation.steps);
  return {
    ...recommendation,
    steps: parsedSteps.success ? parsedSteps.data : [],
  };
}

export function toRankedBusiness(input: {
  id: string;
  name: string;
  score: number | null;
  coverage: number | null;
  primary: boolean;
  dimensions: unknown;
}): RankedBusiness {
  return {
    id: input.id,
    name: input.name,
    score: input.score,
    coverage: input.coverage ?? 0,
    primary: input.primary,
    dimensions: parseDimensions(input.dimensions),
  };
}
