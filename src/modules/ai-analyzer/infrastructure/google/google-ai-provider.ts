import "server-only";

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import type {
  AIProvider,
  AIProviderRequest,
  AIProviderResponse,
} from "@/modules/ai-analyzer/domain/contracts";
import { AIAnalyzerError } from "@/modules/ai-analyzer/domain/errors";

type GoogleAIProviderOptions = Readonly<{
  apiKey: string;
  model: string;
}>;

export class GoogleAIProvider implements AIProvider {
  readonly name = "google-ai";
  private readonly client: GoogleGenAI;

  constructor(private readonly options: GoogleAIProviderOptions) {
    this.client = new GoogleGenAI({ apiKey: options.apiKey });
  }

  async generateStructured<TOutput>({
    prompt,
    outputSchema,
    signal,
  }: AIProviderRequest<TOutput>): Promise<AIProviderResponse<TOutput>> {
    try {
      if (signal?.aborted) throw signal.reason;

      const response = await this.client.models.generateContent({
        model: this.options.model,
        contents: prompt.instruction,
        config: {
          systemInstruction: prompt.system,
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      if (signal?.aborted) throw signal.reason;
      const text = response.text;
      if (!text) {
        throw new AIAnalyzerError(
          "INVALID_PROVIDER_OUTPUT",
          "The provider returned an empty response.",
        );
      }

      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch (cause) {
        throw new AIAnalyzerError(
          "INVALID_PROVIDER_OUTPUT",
          "The provider did not return valid JSON.",
          { cause },
        );
      }

      const parsed = outputSchema.safeParse(json);
      if (!parsed.success) {
        throw new AIAnalyzerError(
          "INVALID_PROVIDER_OUTPUT",
          "The provider response does not match the required schema.",
          { cause: parsed.error },
        );
      }

      const usage = response.usageMetadata;
      return {
        data: parsed.data,
        provider: this.name,
        model: this.options.model,
        usage: usage
          ? {
              inputTokens: usage.promptTokenCount,
              outputTokens: usage.candidatesTokenCount,
              totalTokens: usage.totalTokenCount,
            }
          : undefined,
      };
    } catch (error) {
      if (error instanceof AIAnalyzerError) throw error;
      throw mapGoogleError(error, signal);
    }
  }
}

const providerErrorSchema = z.object({
  status: z.number().optional(),
  code: z.union([z.number(), z.string()]).optional(),
  message: z.string().optional(),
});

function mapGoogleError(error: unknown, signal?: AbortSignal) {
  if (signal?.aborted) {
    return new AIAnalyzerError(
      "PROVIDER_TIMEOUT",
      "The AI request was aborted.",
      {
        cause: error,
        retryable: true,
      },
    );
  }

  const parsed = providerErrorSchema.safeParse(error);
  const status = parsed.success
    ? (parsed.data.status ??
      numericCode(parsed.data.code) ??
      nestedStatus(error))
    : nestedStatus(error);
  if (status === 401 || status === 403) {
    return new AIAnalyzerError(
      "PROVIDER_AUTHENTICATION",
      "The AI provider rejected its credentials.",
      { cause: error },
    );
  }
  if (status === 429) {
    return new AIAnalyzerError(
      "PROVIDER_RATE_LIMIT",
      "The AI provider rate limit was reached.",
      {
        cause: error,
        retryable: true,
      },
    );
  }
  if (status === 404) {
    return new AIAnalyzerError(
      "PROVIDER_MODEL_NOT_AVAILABLE",
      "The configured AI model is not available.",
      { cause: error },
    );
  }
  if (status !== undefined && status >= 500) {
    return new AIAnalyzerError(
      "PROVIDER_UNAVAILABLE",
      "The AI provider is unavailable.",
      {
        cause: error,
        retryable: true,
      },
    );
  }
  return new AIAnalyzerError(
    "UNKNOWN_PROVIDER_ERROR",
    "The AI provider request failed.",
    {
      cause: error,
    },
  );
}

function numericCode(code: number | string | undefined) {
  if (typeof code === "number") return code;
  if (typeof code === "string" && /^\d+$/.test(code)) return Number(code);
  return undefined;
}

function nestedStatus(error: unknown) {
  if (!error || typeof error !== "object") return undefined;
  const candidate = error as {
    status?: unknown;
    code?: unknown;
    error?: unknown;
  };
  if (typeof candidate.status === "number") return candidate.status;
  if (typeof candidate.code === "number") return candidate.code;
  if (typeof candidate.error === "object" && candidate.error) {
    const nested = candidate.error as { code?: unknown };
    if (typeof nested.code === "number") return nested.code;
  }
  const message = error instanceof Error ? error.message : String(error);
  if (/\b404\b|not found|no longer available/i.test(message)) return 404;
  return undefined;
}
