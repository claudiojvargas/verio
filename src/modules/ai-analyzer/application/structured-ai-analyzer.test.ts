import assert from "node:assert/strict";
import test from "node:test";
import { z } from "zod";

import { StructuredAIAnalyzer } from "@/modules/ai-analyzer/application/structured-ai-analyzer";
import type {
  AIProvider,
  AIProviderRequest,
  AIProviderResponse,
  PromptBuilder,
} from "@/modules/ai-analyzer/domain/contracts";

class FakeProvider implements AIProvider {
  readonly name = "fake";

  async generateStructured<TOutput>(
    request: AIProviderRequest<TOutput>,
  ): Promise<AIProviderResponse<TOutput>> {
    return {
      data: request.outputSchema.parse({ message: "resultado controlado" }),
      provider: this.name,
      model: "fake-model",
      usage: { totalTokens: 10 },
    };
  }
}

const promptBuilder: PromptBuilder<{ company: string }> = {
  version: "test-v1",
  build: (input) => ({
    version: "test-v1",
    system: "test",
    instruction: input.company,
  }),
};

test("orchestrates any AIProvider without importing its SDK", async () => {
  const analyzer = new StructuredAIAnalyzer({
    provider: new FakeProvider(),
    promptBuilder,
    outputSchema: z.object({ message: z.string() }),
    schemaName: "test_output",
  });

  const result = await analyzer.analyze({ company: "Verio" });

  assert.deepEqual(result.data, { message: "resultado controlado" });
  assert.equal(result.metadata.provider, "fake");
  assert.equal(result.metadata.promptVersion, "test-v1");
});
