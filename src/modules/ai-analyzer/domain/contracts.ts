import type { z } from "zod";

export type AIPrompt = Readonly<{
  system: string;
  instruction: string;
  version: string;
}>;

export type AIProviderRequest<TOutput> = Readonly<{
  prompt: AIPrompt;
  outputSchema: z.ZodType<TOutput>;
  schemaName: string;
  signal?: AbortSignal;
}>;

export type AIProviderResponse<TOutput> = Readonly<{
  data: TOutput;
  provider: string;
  model: string;
  usage?: Readonly<{
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  }>;
}>;

export interface AIProvider {
  readonly name: string;
  generateStructured<TOutput>(
    request: AIProviderRequest<TOutput>,
  ): Promise<AIProviderResponse<TOutput>>;
}

export interface PromptBuilder<TInput> {
  readonly version: string;
  build(input: TInput): AIPrompt;
}

export interface AIAnalyzer<TInput, TOutput> {
  analyze(input: TInput, signal?: AbortSignal): Promise<AIAnalysis<TOutput>>;
}

export type AIAnalysis<TOutput> = Readonly<{
  data: TOutput;
  metadata: Readonly<{
    provider: string;
    model: string;
    promptVersion: string;
    usage?: AIProviderResponse<TOutput>["usage"];
  }>;
}>;
