import "server-only";

import { z } from "zod";

const serverEnvironmentSchema = z.object({
  DATABASE_URL: z.string().url(),
  INTERNAL_JOB_SECRET: z.string().min(32),
  CLERK_SECRET_KEY: z.string().min(1),
  GOOGLE_AI_API_KEY: z.string().min(1).optional(),
  GOOGLE_AI_MODEL: z.string().min(1).default("gemini-3.6-flash"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export function getServerEnvironment() {
  return serverEnvironmentSchema.parse(process.env);
}
