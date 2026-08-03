import assert from "node:assert/strict";
import test from "node:test";

import type {
  AIProvider,
  AIProviderRequest,
  AIProviderResponse,
} from "@/modules/ai-analyzer";
import { AIAnalyzerError } from "@/modules/ai-analyzer";
import { CredibilityAIAnalyzer } from "@/modules/analyses/ai/credibility-ai-analyzer";

class DraftProvider implements AIProvider {
  readonly name = "draft-provider";

  constructor(private readonly evidenceKey: string) {}

  async generateStructured<TOutput>(
    request: AIProviderRequest<TOutput>,
  ): Promise<AIProviderResponse<TOutput>> {
    const draft = {
      summary: "Resumo baseado na evidência.",
      observations: [
        {
          signalKey: "contact-consistency",
          evidenceKeys: [this.evidenceKey],
          outcome: "ATTENTION",
          explanation: "Os canais apresentam contatos diferentes.",
        },
      ],
      recommendationDrafts: [],
    };
    return {
      data: request.outputSchema.parse(draft),
      provider: this.name,
      model: "fake-model",
    };
  }
}

const input = {
  business: { name: "Estúdio Aurora", city: "São Paulo" },
  evidence: [
    {
      key: "website-contact",
      channel: "WEBSITE" as const,
      observation: "O site mostra um telefone diferente do canal confirmado.",
    },
  ],
};

test("accepts drafts grounded in supplied evidence", async () => {
  const analyzer = new CredibilityAIAnalyzer(new DraftProvider("website-contact"));
  const result = await analyzer.analyze(input);
  assert.equal(result.data.observations[0]?.evidenceKeys[0], "website-contact");
});

test("rejects evidence invented by a provider", async () => {
  const analyzer = new CredibilityAIAnalyzer(new DraftProvider("invented-evidence"));
  await assert.rejects(
    analyzer.analyze(input),
    (error: unknown) =>
      error instanceof AIAnalyzerError &&
      error.code === "PROVIDER_OUTPUT_UNKNOWN_EVIDENCE",
  );
});
