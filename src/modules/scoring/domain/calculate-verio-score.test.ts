import assert from "node:assert/strict";
import test from "node:test";

import { calculateVerioScore } from "@/modules/scoring/domain/calculate-verio-score";
import { ScoreCalculationError } from "@/modules/scoring/domain/errors";
import type { ScoreObservation, ScorePolicy } from "@/modules/scoring/domain/types";
import { VERIO_SCORE_V1 } from "@/modules/scoring/policies/verio-score-v1";

function observations(outcome: ScoreObservation["outcome"]): ScoreObservation[] {
  return VERIO_SCORE_V1.signals.map(({ key }) => ({ signalKey: key, outcome }));
}

test("returns 100 when every verifiable signal is positive", () => {
  const result = calculateVerioScore(observations("POSITIVE"), VERIO_SCORE_V1);
  assert.equal(result.status, "SCORED");
  assert.equal(result.totalScore, 100);
  assert.equal(result.coverage, 100);
  assert.equal(result.categories.length, 4);
});

test("returns zero, not null, when every signal is negative", () => {
  const result = calculateVerioScore(observations("NEGATIVE"), VERIO_SCORE_V1);
  assert.equal(result.status, "SCORED");
  assert.equal(result.totalScore, 0);
  assert.equal(result.coverage, 100);
});

test("uses signal and category weights deterministically", () => {
  const input = observations("POSITIVE").map((observation) =>
    observation.signalKey === "public-reputation-visible"
      ? { ...observation, outcome: "NEGATIVE" as const }
      : observation,
  );
  const first = calculateVerioScore(input, VERIO_SCORE_V1);
  const second = calculateVerioScore(input, VERIO_SCORE_V1);
  assert.deepEqual(first, second);
  assert.equal(first.totalScore, 85);
});

test("does not turn unavailable evidence into zero", () => {
  const result = calculateVerioScore(
    observations("NOT_VERIFIABLE"),
    VERIO_SCORE_V1,
  );
  assert.equal(result.status, "INSUFFICIENT_COVERAGE");
  assert.equal(result.totalScore, null);
  assert.equal(result.coverage, 0);
  assert.ok(result.categories.every(({ score }) => score === null));
});

test("renormalizes available categories but still enforces coverage", () => {
  const relaxedPolicy: ScorePolicy = {
    ...VERIO_SCORE_V1,
    version: "test-relaxed-coverage",
    minimumCoverage: 0,
  };
  const input = VERIO_SCORE_V1.signals.map(({ key, category }) => ({
    signalKey: key,
    outcome: category === "TRUST" ? ("NOT_VERIFIABLE" as const) : ("POSITIVE" as const),
  }));
  const result = calculateVerioScore(input, relaxedPolicy);
  assert.equal(result.totalScore, 100);
  assert.equal(result.categories.find(({ category }) => category === "TRUST")?.score, null);
  assert.equal(result.coverage, 65);
});

test("rejects unknown and duplicate observations", () => {
  assert.throws(
    () =>
      calculateVerioScore(
        [{ signalKey: "unknown", outcome: "POSITIVE" }],
        VERIO_SCORE_V1,
      ),
    (error: unknown) =>
      error instanceof ScoreCalculationError && error.code === "UNKNOWN_SIGNAL",
  );
  const known = VERIO_SCORE_V1.signals[0]?.key;
  assert.ok(known);
  assert.throws(
    () =>
      calculateVerioScore(
        [
          { signalKey: known, outcome: "POSITIVE" },
          { signalKey: known, outcome: "NEGATIVE" },
        ],
        VERIO_SCORE_V1,
      ),
    (error: unknown) =>
      error instanceof ScoreCalculationError && error.code === "DUPLICATE_OBSERVATION",
  );
});
