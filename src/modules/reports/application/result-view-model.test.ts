import assert from "node:assert/strict";
import test from "node:test";

import {
  parseDimensions,
  parseSummary,
  toRecommendationViewModel,
} from "@/modules/reports/application/result-view-model";

test("parses and labels persisted dimensions", () => {
  assert.deepEqual(
    parseDimensions([
      { key: "discovery", score: 80, weight: 25 },
      { key: "TRUST", score: 65, weight: 35 },
    ]),
    [
      { key: "discovery", score: 80, label: "Descoberta" },
      { key: "TRUST", score: 65, label: "Confiança" },
    ],
  );
});

test("uses safe fallbacks for malformed JSON snapshots", () => {
  assert.deepEqual(parseDimensions({ unexpected: true }), []);
  assert.equal(parseSummary([]).strength.includes("Não foi possível"), true);
  assert.deepEqual(
    toRecommendationViewModel({
      id: "rec",
      title: "Título",
      rationale: "Motivo",
      impact: "HIGH",
      effort: "LOW",
      priority: 1,
      steps: { unexpected: true },
    }).steps,
    [],
  );
});
