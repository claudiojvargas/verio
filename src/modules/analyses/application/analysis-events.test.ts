import assert from "node:assert/strict";
import test from "node:test";

import { AIAnalyzerError } from "@/modules/ai-analyzer";
import { safeFailureDetails } from "@/modules/analyses/application/analysis-events";

test("maps provider model failures to sanitized debugger data", () => {
  const error = new AIAnalyzerError(
    "PROVIDER_MODEL_NOT_AVAILABLE",
    "raw provider message that must not be persisted",
  );

  const failure = safeFailureDetails(error, "retired-model", "AI_SYNTHESIS");

  assert.equal(failure.code, "PROVIDER_MODEL_NOT_AVAILABLE");
  assert.equal(failure.stage, "AI_SYNTHESIS");
  assert.equal(failure.metadata.model, "retired-model");
  assert.doesNotMatch(failure.technicalMessage, /raw provider message/);
});

test("maps rejected provider requests without exposing the raw message", () => {
  const error = new AIAnalyzerError(
    "PROVIDER_INVALID_REQUEST",
    "raw schema rejection that must not be persisted",
  );

  const failure = safeFailureDetails(error, "configured-model", "AI_SYNTHESIS");

  assert.equal(failure.code, "PROVIDER_INVALID_REQUEST");
  assert.match(failure.publicMessage, /configuração da solicitação/);
  assert.doesNotMatch(failure.technicalMessage, /raw schema rejection/);
});
