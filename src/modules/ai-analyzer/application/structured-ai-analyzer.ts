import type { z } from "zod";

import type {
  AIAnalysis,
  AIAnalyzer,
  AIProvider,
  PromptBuilder,
} from "@/modules/ai-analyzer/domain/contracts";

type StructuredAIAnalyzerOptions<TInput, TOutput> = Readonly<{
  provider: AIProvider;
  promptBuilder: PromptBuilder<TInput>;
  outputSchema: z.ZodType<TOutput>;
  schemaName: string;
}>;

/** Provider-neutral orchestration. Product policies and scoring live elsewhere. */
export class StructuredAIAnalyzer<TInput, TOutput>
  implements AIAnalyzer<TInput, TOutput>
{
  constructor(private readonly options: StructuredAIAnalyzerOptions<TInput, TOutput>) {}

  async analyze(input: TInput, signal?: AbortSignal): Promise<AIAnalysis<TOutput>> {
    const prompt = this.options.promptBuilder.build(input);
    const response = await this.options.provider.generateStructured({
      prompt,
      outputSchema: this.options.outputSchema,
      schemaName: this.options.schemaName,
      signal,
    });

    return {
      data: response.data,
      metadata: {
        provider: response.provider,
        model: response.model,
        promptVersion: prompt.version,
        usage: response.usage,
      },
    };
  }
}
