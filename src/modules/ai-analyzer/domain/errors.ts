export type AIAnalyzerErrorCode =
  | "INVALID_INPUT"
  | "PROVIDER_AUTHENTICATION"
  | "PROVIDER_RATE_LIMIT"
  | "PROVIDER_TIMEOUT"
  | "PROVIDER_UNAVAILABLE"
  | "PROVIDER_MODEL_NOT_AVAILABLE"
  | "INVALID_PROVIDER_OUTPUT"
  | "UNKNOWN_PROVIDER_ERROR";

export class AIAnalyzerError extends Error {
  readonly retryable: boolean;

  constructor(
    public readonly code: AIAnalyzerErrorCode,
    message: string,
    options?: { cause?: unknown; retryable?: boolean },
  ) {
    super(message, { cause: options?.cause });
    this.name = "AIAnalyzerError";
    this.retryable = options?.retryable ?? false;
  }
}
