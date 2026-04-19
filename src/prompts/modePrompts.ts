import type { AgentMode } from "../core/types.js";

const prompts: Record<AgentMode, string> = {
  FAST: `MODE: FAST — compress. Prefer shortest correct answer. Skip preambles. Keep full draft minimal.`,
  DEEP: `MODE: DEEP — exhaustive. Include counterarguments, risks, edge cases, and cross-checks. Longer full draft is OK.`,
  FULL_POWER: `MODE: FULL_POWER — apply every capability. Use contradiction detection, chronology, citations, and domain tools as needed.`,
  LEGAL: `MODE: LEGAL — bias toward filing-ready drafting: captions, numbered facts, causes of action, prayer, verification, and exhibit register.`,
  FINANCE: `MODE: FINANCE — bias toward numeric calculations. Always emit calculationAudit objects; show Inputs -> Formula -> Result.`,
  CAD: `MODE: CAD — bias toward manufacturable specs in mm. Emit tolerances, checklist, and file name.`,
  EVIDENCE: `MODE: EVIDENCE — bias toward timelines, exhibits, chain-of-custody, and contradiction detection.`,
  OPS: `MODE: OPS — bias toward catalog/inventory operations, SKU validation, and structured rows.`,
  DECIDE: `MODE: DECIDE — commit to a recommendation. State the decision, then the rationale and the first reversible action.`,
  HEALTHCHECK: `MODE: HEALTHCHECK — run consistency checks on the session context: missing fields, contradictions, stale dates, version drift.`,
};

export function modePrompt(mode: AgentMode): string {
  return prompts[mode];
}

export const MODE_LIST: AgentMode[] = Object.keys(prompts) as AgentMode[];
