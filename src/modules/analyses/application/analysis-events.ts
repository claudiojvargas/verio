import type { Prisma, PrismaClient } from "@prisma/client";

import { AIAnalyzerError } from "@/modules/ai-analyzer";

type EventClient =
  | Pick<PrismaClient, "analysisEvent">
  | Prisma.TransactionClient;

export type AnalysisStage =
  | "ANALYSIS_CREATED"
  | "JOB_CLAIMED"
  | "EVIDENCE_ASSESSMENT"
  | "SCORE_CALCULATION"
  | "AI_SYNTHESIS"
  | "RESULT_PERSISTENCE"
  | "ANALYSIS_COMPLETED"
  | "ANALYSIS_FAILED";

export type AnalysisEventStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export async function recordAnalysisEvent(
  client: EventClient,
  input: {
    analysisId: string;
    stage: AnalysisStage;
    status: AnalysisEventStatus;
    publicMessage: string;
    code?: string;
    technicalMessage?: string;
    metadata?: Prisma.InputJsonValue;
    durationMs?: number;
  },
) {
  return client.analysisEvent.create({ data: input });
}

export function safeFailureDetails(
  error: unknown,
  model: string,
  stage: AnalysisStage,
) {
  if (error instanceof AIAnalyzerError) {
    const messages: Record<AIAnalyzerError["code"], string> = {
      INVALID_INPUT: "Os dados preparados para a análise são inválidos.",
      PROVIDER_AUTHENTICATION:
        "O provedor de IA recusou a credencial configurada.",
      PROVIDER_RATE_LIMIT:
        "O limite temporário do provedor de IA foi atingido.",
      PROVIDER_TIMEOUT: "O provedor de IA demorou além do limite esperado.",
      PROVIDER_UNAVAILABLE:
        "O provedor de IA está temporariamente indisponível.",
      PROVIDER_MODEL_NOT_AVAILABLE:
        "O modelo de IA configurado não está disponível.",
      INVALID_PROVIDER_OUTPUT:
        "A resposta da IA não passou pela validação de segurança.",
      PROVIDER_OUTPUT_EMPTY: "O provedor de IA retornou uma resposta vazia.",
      PROVIDER_OUTPUT_INVALID_JSON:
        "O provedor de IA não retornou um JSON válido.",
      PROVIDER_OUTPUT_SCHEMA_MISMATCH:
        "O JSON retornado pela IA não segue o formato exigido.",
      PROVIDER_OUTPUT_UNKNOWN_EVIDENCE:
        "A IA citou uma evidência que não pertence a esta análise.",
      UNKNOWN_PROVIDER_ERROR:
        "O provedor de IA não conseguiu concluir a solicitação.",
    };
    return {
      code: error.code,
      publicMessage: messages[error.code],
      technicalMessage: `${error.name}: ${error.code}`,
      metadata: { provider: "google-ai", model, retryable: error.retryable },
      stage,
    };
  }
  if (error instanceof Error && error.message === "NO_CONFIRMED_CHANNELS") {
    return {
      code: error.message,
      publicMessage:
        "Nenhum canal confirmado estava disponível para a análise.",
      technicalMessage: "Analysis precondition failed: NO_CONFIRMED_CHANNELS",
      metadata: { retryable: false },
      stage,
    };
  }
  return {
    code: "ANALYSIS_EXECUTION_FAILED",
    publicMessage: "Não foi possível concluir a análise.",
    technicalMessage: "Unexpected analysis execution failure",
    metadata: { retryable: false },
    stage,
  };
}
