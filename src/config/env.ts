import { config as loadDotenv } from "dotenv";
import { z } from "zod";

loadDotenv();

const EnvSchema = z.object({
  LLM_API_KEY: z.string().optional().default(""),
  LLM_MODEL: z.string().optional().default("gpt-4o"),
  LLM_PROVIDER: z.string().optional().default("openai"),
  LLM_BASE_URL: z.string().optional().default(""),
  PORT: z.coerce.number().int().positive().default(8080),
  HOST: z.string().default("0.0.0.0"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  ENABLE_MEMORY: z
    .string()
    .optional()
    .default("false")
    .transform((v) => v === "true"),
  ENABLE_WEB_SEARCH: z
    .string()
    .optional()
    .default("false")
    .transform((v) => v === "true"),
  ENABLE_FILE_SEARCH: z
    .string()
    .optional()
    .default("false")
    .transform((v) => v === "true"),
  DEFAULT_MODE: z.string().default("FULL_POWER"),
  PRO_SE_FOOTER: z.string().default("Prepared by pro se plaintiff."),
  REFERENCE_DATE: z.string().optional().default(""),
  AUTH_KEY: z.string().optional().default(""),
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse(process.env);

export function referenceDate(): Date {
  if (env.REFERENCE_DATE) {
    const parsed = new Date(env.REFERENCE_DATE);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}
