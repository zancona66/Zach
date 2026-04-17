export interface PolicyDecision {
  allow: boolean;
  requireConfirmation: boolean;
  reason?: string;
}

const SIDE_EFFECT_TOOLS = new Set([
  "export_payload",
  "memory_set",
]);

const DESTRUCTIVE_KEYWORDS = [
  "send",
  "file with court",
  "execute trade",
  "wire transfer",
  "post to",
  "delete",
  "drop table",
];

export function policyForTool(tool: string, args: Record<string, unknown>): PolicyDecision {
  if (!SIDE_EFFECT_TOOLS.has(tool)) {
    return { allow: true, requireConfirmation: false };
  }
  const hasOutPath = typeof args.outPath === "string" && args.outPath.length > 0;
  return {
    allow: true,
    requireConfirmation: hasOutPath,
    reason: hasOutPath ? "Writing to disk requires confirmation." : undefined,
  };
}

export function classifyInputRisk(input: string): "low" | "medium" | "high" {
  const lower = input.toLowerCase();
  if (DESTRUCTIVE_KEYWORDS.some((k) => lower.includes(k))) return "high";
  if (/(pay|fund|transfer|file|serve|publish)/.test(lower)) return "medium";
  return "low";
}
