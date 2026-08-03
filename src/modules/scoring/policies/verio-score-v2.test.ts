import assert from "node:assert/strict";
import test from "node:test";

import { calculateVerioScore } from "../domain/calculate-verio-score";
import { VERIO_SCORE_V2 } from "./verio-score-v2";

test("v2 scores reproducibly when every signal is observed", () => {
  const observations = VERIO_SCORE_V2.signals.map(({ key }) => ({
    signalKey: key,
    outcome: "POSITIVE" as const,
  }));

  const result = calculateVerioScore(observations, VERIO_SCORE_V2);
  assert.equal(result.methodologyVersion, "verio-score-v2");
  assert.equal(result.coverage, 100);
  assert.equal(result.totalScore, 100);
});
