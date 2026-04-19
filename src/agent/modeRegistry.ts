import type { AgentMode } from "../core/types.js";
import { MODE_LIST } from "../prompts/modePrompts.js";

export function normalizeMode(input: string | undefined | null): AgentMode {
  if (!input) return "FULL_POWER";
  const upper = input.toUpperCase() as AgentMode;
  if (MODE_LIST.includes(upper)) return upper;
  return "FULL_POWER";
}

export function isMode(input: string): input is AgentMode {
  return (MODE_LIST as string[]).includes(input);
}
