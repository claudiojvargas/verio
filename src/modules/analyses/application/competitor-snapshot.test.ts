import assert from "node:assert/strict";
import test from "node:test";

import { parseCompetitorChannelsSnapshot } from "@/modules/analyses/application/competitor-snapshot";

test("restores immutable competitor channels used by an analysis", () => {
  const channels = parseCompetitorChannelsSnapshot([
    {
      type: "WEBSITE",
      value: "https://example.com",
      status: "CONFIRMED",
    },
  ]);

  assert.equal(channels[0]?.type, "WEBSITE");
  assert.equal(channels[0]?.value, "https://example.com");
});

test("rejects malformed competitor channel snapshots", () => {
  assert.deepEqual(
    parseCompetitorChannelsSnapshot([
      { type: "INSTAGRAM", value: "https://example.com", status: "CONFIRMED" },
    ]),
    [],
  );
});
