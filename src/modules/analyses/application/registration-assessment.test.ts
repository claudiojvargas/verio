import assert from "node:assert/strict";
import test from "node:test";

import { assessRegisteredChannels } from "./registration-assessment";
import { calculateVerioScore } from "@/modules/scoring";
import { VERIO_SCORE_V1 } from "@/modules/scoring/policies/verio-score-v1";

test("uses confirmed registration without claiming unavailable signals", () => {
  const result = assessRegisteredChannels([
    {
      type: "GOOGLE_MAPS",
      value: "https://maps.google.com/example",
      status: "CONFIRMED",
    },
    { type: "WEBSITE", value: "https://example.com", status: "CONFIRMED" },
    {
      type: "WHATSAPP",
      value: "https://wa.me/5511999999999",
      status: "CONFIRMED",
    },
  ]);

  assert.equal(result.evidence.length, 3);
  assert.equal(
    result.observations.find(({ signalKey }) => signalKey === "website-secure")
      ?.outcome,
    "POSITIVE",
  );
  assert.equal(
    result.observations.find(({ signalKey }) => signalKey === "services-clear")
      ?.outcome,
    "NOT_VERIFIABLE",
  );
  assert.equal(
    calculateVerioScore(result.observations, VERIO_SCORE_V1).status,
    "SCORED",
  );
});

test("ignores channels that were not confirmed", () => {
  const result = assessRegisteredChannels([
    { type: "WEBSITE", value: "https://example.com", status: "UNRECOGNIZED" },
  ]);

  assert.deepEqual(result.evidence, []);
  assert.equal(
    result.observations.find(({ signalKey }) => signalKey === "website-secure")
      ?.outcome,
    "NOT_VERIFIABLE",
  );
});
