import assert from "node:assert/strict";
import test from "node:test";
import { z } from "zod";

import { createGoogleResponseSchema } from "@/modules/ai-analyzer/infrastructure/google/google-response-schema";

test("keeps structural output rules and removes provider-unsafe constraints", () => {
  const schema = z
    .object({
      summary: z.string().min(1).max(600),
      observations: z.array(
        z
          .object({
            outcome: z.enum(["POSITIVE", "ATTENTION"]),
          })
          .strict(),
      ),
    })
    .strict()
    .superRefine(() => undefined);

  const providerSchema = createGoogleResponseSchema(schema);

  assert.deepEqual(providerSchema, {
    type: "object",
    properties: {
      summary: { type: "string" },
      observations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            outcome: {
              type: "string",
              enum: ["POSITIVE", "ATTENTION"],
            },
          },
          required: ["outcome"],
        },
      },
    },
    required: ["summary", "observations"],
  });
});
