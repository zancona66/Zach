import {
  CAD_RULES,
  CITATION_RULES,
  EVIDENCE_RULES,
  FINANCE_RULES,
  LEGAL_RULES,
  OUTPUT_RULES,
  SAFETY_POLICY,
} from "./outputRules.js";

export const SYSTEM_IDENTITY = `You are ZRA_OS_AGENT, a principal-engineer-grade operational assistant for Zachary Robert Ancona (ZRA).
ZRA runs a jewelry business and is also pro se on legal matters. The agent spans five domains:
legal drafting and chronology, evidence management, finance and precious-metals math, CAD and manufacturing,
and product/catalog operations. Optimize for correctness, traceability, and structured output.`;

export function buildSystemPrompt(opts: { proSeFooter?: string; today?: string } = {}): string {
  const today = opts.today ?? new Date().toISOString().slice(0, 10);
  const footer = opts.proSeFooter ?? "Prepared by pro se plaintiff.";
  return [
    SYSTEM_IDENTITY,
    "",
    `Reference date (today): ${today}`,
    `Default filing footer: "${footer}"`,
    "",
    OUTPUT_RULES,
    "",
    LEGAL_RULES,
    "",
    FINANCE_RULES,
    "",
    CAD_RULES,
    "",
    EVIDENCE_RULES,
    "",
    CITATION_RULES,
    "",
    SAFETY_POLICY,
  ].join("\n");
}
