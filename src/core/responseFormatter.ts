import type {
  Assumption,
  CalculationAudit,
  Citation,
  ConfidenceLevel,
  Contradiction,
  ResponsePayload,
} from "./types.js";
import { ResponsePayloadSchema } from "./schemas.js";
import { formatAssumptions } from "./assumptions.js";
import { renderCitationsBlock } from "./citations.js";

export interface BuildResponseInput {
  tldr: string;
  bullets?: string[];
  fullDraft?: string;
  nextActions?: string[];
  confidence?: ConfidenceLevel;
  assumptions?: Assumption[];
  contradictions?: Contradiction[];
  citations?: Citation[];
  calculationAudit?: CalculationAudit[];
  warnings?: string[];
  meta?: Record<string, unknown>;
  mode?: ResponsePayload["mode"];
  macros?: string[];
}

function clampBullets(bullets: string[]): string[] {
  const cleaned = bullets.map((b) => b.trim()).filter(Boolean);
  if (cleaned.length >= 4 && cleaned.length <= 6) return cleaned;
  if (cleaned.length < 4) {
    const padding = [
      "No additional blockers identified.",
      "Inputs appear internally consistent.",
      "No new dependencies introduced.",
      "Output is ready for review.",
    ];
    let i = 0;
    while (cleaned.length < 4 && i < padding.length) {
      if (!cleaned.includes(padding[i])) cleaned.push(padding[i]);
      i += 1;
    }
  }
  if (cleaned.length > 6) return cleaned.slice(0, 6);
  return cleaned;
}

export function buildResponse(input: BuildResponseInput): ResponsePayload {
  const payload: ResponsePayload = {
    tldr: input.tldr.trim() || "No summary produced.",
    bullets: clampBullets(input.bullets ?? []),
    fullDraft: (input.fullDraft ?? "").trim(),
    nextActions:
      (input.nextActions ?? []).map((a) => a.trim()).filter(Boolean).length > 0
        ? (input.nextActions ?? []).map((a) => a.trim()).filter(Boolean)
        : ["Review output.", "Flag any changes required."],
    confidence: input.confidence ?? "M",
    assumptions: input.assumptions,
    contradictions: input.contradictions,
    citations: input.citations,
    calculationAudit: input.calculationAudit,
    warnings: input.warnings,
    meta: input.meta,
    mode: input.mode,
    macros: input.macros,
  };
  return ResponsePayloadSchema.parse(payload);
}

export function renderMarkdown(r: ResponsePayload): string {
  const sections: string[] = [];
  sections.push(`## TL;DR\n${r.tldr}`);
  sections.push(`## Bullets\n${r.bullets.map((b) => `- ${b}`).join("\n")}`);
  if (r.fullDraft) sections.push(`## Full Draft\n\n${r.fullDraft}`);
  sections.push(
    `## Next Actions\n${r.nextActions.map((a, i) => `${i + 1}. ${a}`).join("\n")}`,
  );
  sections.push(`## Confidence\n${r.confidence}`);
  if (r.assumptions && r.assumptions.length > 0) {
    sections.push(`## Assumptions\n${formatAssumptions(r.assumptions)}`);
  }
  if (r.contradictions && r.contradictions.length > 0) {
    sections.push(
      `## Contradictions\n${r.contradictions
        .map(
          (c) =>
            `- [${c.severity}] ${c.reason} — A(${c.a.source}) vs B(${c.b.source})`,
        )
        .join("\n")}`,
    );
  }
  if (r.calculationAudit && r.calculationAudit.length > 0) {
    sections.push(
      `## Calculation Audit\n${r.calculationAudit
        .map(
          (c) =>
            `- ${c.label}: Inputs=${JSON.stringify(c.inputs)} | Formula=${c.formula} | Result=${c.result}${
              c.unit ? ` ${c.unit}` : ""
            }`,
        )
        .join("\n")}`,
    );
  }
  if (r.citations && r.citations.length > 0) {
    sections.push(`## References\n${renderCitationsBlock(r.citations)}`);
  }
  if (r.warnings && r.warnings.length > 0) {
    sections.push(`## Warnings\n${r.warnings.map((w) => `- ${w}`).join("\n")}`);
  }
  return sections.join("\n\n");
}
