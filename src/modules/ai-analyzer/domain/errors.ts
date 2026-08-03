export type AIAnalyzerErrorCode =
  | "INVALID_INPUT"
  | "PROVIDER_AUTHENTICATION"
  | "PROVIDER_RATE_LIMIT"
  | "PROVIDER_TIMEOUT"
  | "PROVIDER_UNAVAILABLE"
  | "PROVIDER_MODEL_NOT_AVAILABLE"
  | "PROVIDER_INVALID_REQUEST"
  | "INVALID_PROVIDER_OUTPUT"
  | "PROVIDER_OUTPUT_EMPTY"
  | "PROVIDER_OUTPUT_INVALID_JSON"
  | "PROVIDER_OUTPUT_SCHEMA_MISMATCH"
  | "PROVIDER_OUTPUT_UNKNOWN_EVIDENCE"
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
