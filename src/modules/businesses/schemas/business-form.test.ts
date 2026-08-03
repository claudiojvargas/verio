import assert from "node:assert/strict";
import test from "node:test";

import { competitorFormSchema } from "@/modules/businesses/schemas/business-form";

const baseCompetitor = {
  name: "Concorrente Exemplo",
  city: "São Paulo",
  state: "SP",
  googleMaps: "",
  website: "",
  whatsapp: "",
};

test("requires at least one auditable competitor channel", () => {
  assert.equal(competitorFormSchema.safeParse(baseCompetitor).success, false);
});

test("accepts a competitor with one valid channel", () => {
  assert.equal(
    competitorFormSchema.safeParse({
      ...baseCompetitor,
      website: "https://example.com",
    }).success,
    true,
  );
});

test("returns validation errors instead of throwing for malformed URLs", () => {
  for (const field of ["googleMaps", "website", "whatsapp"] as const) {
    for (const invalidUrl of [" ", "example.com", "https://"]) {
      const input = { ...baseCompetitor, [field]: invalidUrl };
      assert.doesNotThrow(() => competitorFormSchema.safeParse(input));
      assert.equal(competitorFormSchema.safeParse(input).success, false);
    }
  }
});
