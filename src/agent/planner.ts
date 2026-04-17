import type { UserIntent } from "../core/types.js";

export interface PlanStep {
  kind: "tool" | "domain" | "format";
  name: string;
  reason: string;
  args?: Record<string, unknown>;
}

export function planFromIntent(intent: UserIntent): PlanStep[] {
  const plan: PlanStep[] = [];
  const raw = intent.raw.toLowerCase();

  if (intent.domain === "legal" || intent.macros.some((m) => /vc|summons|demand|preserve|discovery|nta|aos|toc/.test(m))) {
    plan.push({ kind: "domain", name: "legal", reason: "Legal macro or domain routed." });
  }
  if (intent.domain === "finance" || intent.macros.includes("/pricing") || /melt|karat|margin|roi|cogs|breakeven/.test(raw)) {
    plan.push({ kind: "domain", name: "finance", reason: "Finance cues present." });
  }
  if (intent.domain === "cad" || intent.macros.includes("/cad") || /\.stl|\.obj|tolerance|cad/.test(raw)) {
    plan.push({ kind: "domain", name: "cad", reason: "CAD cues present." });
  }
  if (intent.domain === "evidence" || intent.macros.includes("/EVIDENCE") || /exhibit|timeline|custody/.test(raw)) {
    plan.push({ kind: "domain", name: "evidence", reason: "Evidence cues present." });
  }
  if (intent.domain === "ops" || /inventory|sku|catalog/.test(raw)) {
    plan.push({ kind: "domain", name: "ops", reason: "Ops cues present." });
  }

  if (intent.macros.includes("/EXPORT_JSON")) {
    plan.push({ kind: "format", name: "json", reason: "JSON export macro." });
  }
  if (intent.macros.includes("/CSV_ROWS") || intent.macros.includes("/csv")) {
    plan.push({ kind: "format", name: "csv", reason: "CSV export macro." });
  }

  if (plan.length === 0) {
    plan.push({ kind: "format", name: "markdown", reason: "No domain routed; default answer." });
  }

  return plan;
}
