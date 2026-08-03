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
