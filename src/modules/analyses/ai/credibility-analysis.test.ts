import assert from "node:assert/strict";
import test from "node:test";

import {
  credibilityAnalysisDraftSchema,
  credibilityAnalysisInputSchema,
} from "@/modules/analyses/ai/credibility-analysis";

const validDraft = {
  summary: "Resumo baseado nas evidências fornecidas.",
  observations: [
    {
      signalKey: "contact-consistency",
      evidenceKeys: ["website-contact"],
      outcome: "POSITIVE" as const,
      explanation: "O contato está consistente.",
    },
  ],
  recommendationDrafts: [],
};

test("rejects unknown properties at every output level", () => {
  const result = credibilityAnalysisDraftSchema.safeParse({
    ...validDraft,
    providerNote: "must not pass",
    observations: [{ ...validDraft.observations[0], confidence: 100 }],
  });

  assert.equal(result.success, false);
  if (!result.success) {
    const paths = result.error.issues.map(({ path }) => JSON.stringify(path));
    assert.ok(paths.includes("[]"));
    assert.ok(paths.includes('["observations",0]'));
  }
});

test("rejects duplicate semantic identifiers and evidence references", () => {
  const duplicateObservation = validDraft.observations[0];
  const result = credibilityAnalysisDraftSchema.safeParse({
    ...validDraft,
    observations: [
      {
        ...duplicateObservation,
        evidenceKeys: ["website-contact", "website-contact"],
      },
      duplicateObservation,
    ],
  });

  assert.equal(result.success, false);
});

test("rejects duplicate evidence keys in analyzer input", () => {
  const evidence = {
    key: "website-contact",
    channel: "WEBSITE" as const,
    observation: "Contato publicado no site.",
  };
  const result = credibilityAnalysisInputSchema.safeParse({
    business: { name: "Estúdio Aurora", city: "São Paulo" },
    evidence: [evidence, evidence],
  });

  assert.equal(result.success, false);
});
