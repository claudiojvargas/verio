import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const supportedKeywords = new Set([
  "anyOf",
  "enum",
  "items",
  "oneOf",
  "properties",
  "required",
  "type",
]);

type JsonObject = Record<string, unknown>;

/**
 * Converts the validation schema into the small JSON Schema subset needed to
 * guide Gemini. Zod remains the authoritative validator after generation.
 */
export function createGoogleResponseSchema(schema: z.ZodTypeAny): JsonObject {
  const generated = zodToJsonSchema(schema, { $refStrategy: "none" });
  return sanitizeSchema(generated);
}

function sanitizeSchema(value: unknown): JsonObject {
  if (!isJsonObject(value)) return {};

  const sanitized: JsonObject = {};
  for (const [keyword, keywordValue] of Object.entries(value)) {
    if (!supportedKeywords.has(keyword)) continue;

    if (keyword === "properties" && isJsonObject(keywordValue)) {
      sanitized.properties = Object.fromEntries(
        Object.entries(keywordValue).map(([name, propertySchema]) => [
          name,
          sanitizeSchema(propertySchema),
        ]),
      );
      continue;
    }

    if (keyword === "items") {
      sanitized.items = sanitizeSchema(keywordValue);
      continue;
    }

    if (
      (keyword === "anyOf" || keyword === "oneOf") &&
      Array.isArray(keywordValue)
    ) {
      sanitized[keyword] = keywordValue.map(sanitizeSchema);
      continue;
    }

    sanitized[keyword] = keywordValue;
  }

  return sanitized;
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
