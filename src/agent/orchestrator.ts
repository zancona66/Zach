import { env, referenceDate } from "../config/env.js";
import type {
  AgentMode,
  ResponsePayload,
  UserIntent,
} from "../core/types.js";
import { buildResponse } from "../core/responseFormatter.js";
import { buildSystemPrompt } from "../prompts/systemPrompt.js";
import { modePrompt } from "../prompts/modePrompts.js";
import { parseMacros } from "./macroRouter.js";
import { normalizeMode } from "./modeRegistry.js";
import { planFromIntent, type PlanStep } from "./planner.js";
import { classifyInputRisk } from "./policy.js";
import { createOpenAIProvider } from "../providers/openaiProvider.js";
import type { LLMProvider } from "../providers/llmProvider.js";
import {
  draftDemandLetter,
  draftDiscovery,
  draftPreservationLetter,
  draftSummons,
  draftVerifiedComplaint,
  type DemandLetterInput,
  type DiscoveryInput,
  type PreservationLetterInput,
  type SummonsInput,
  type VerifiedComplaintInput,
} from "../domains/legal/legalEngine.js";
import { price, type PricingRequest } from "../domains/finance/financeEngine.js";
import { buildCadSpec, renderCadSpec, type CadSpecInput } from "../domains/cad/cadEngine.js";
import { buildReport, createWorkspace } from "../domains/evidence/evidenceEngine.js";
import type { EvidenceEvent, ExhibitEntry, ChainOfCustodyEntry } from "../core/types.js";
import { toolSpecs } from "../tools/registry.js";

export interface OrchestratorInput {
  input: string;
  mode?: AgentMode | string;
  context?: Record<string, unknown>;
  referenceDate?: string;
}

export interface OrchestratorDeps {
  provider?: LLMProvider;
}

export interface OrchestratorOutput extends ResponsePayload {
  intent: UserIntent;
  plan: PlanStep[];
}

export function buildIntent(input: OrchestratorInput): UserIntent {
  const parsed = parseMacros(input.input);
  const mode = normalizeMode(
    typeof input.mode === "string" ? input.mode : parsed.modeHint ?? env.DEFAULT_MODE,
  );
  return {
    raw: parsed.cleanedInput || input.input,
    mode,
    macros: parsed.macros,
    domain: parsed.domainHint,
    referenceDate: input.referenceDate,
    context: input.context,
  };
}

export async function orchestrate(
  input: OrchestratorInput,
  deps: OrchestratorDeps = {},
): Promise<OrchestratorOutput> {
  const intent = buildIntent(input);
  const plan = planFromIntent(intent);
  const risk = classifyInputRisk(intent.raw);
  const ref = input.referenceDate ? new Date(input.referenceDate) : referenceDate();

  const base: Partial<ResponsePayload> = {
    mode: intent.mode,
    macros: intent.macros,
    warnings: [],
    calculationAudit: [],
    assumptions: [],
    contradictions: [],
  };

  const ctx = (intent.context ?? {}) as Record<string, unknown>;
  const domains = plan.filter((p) => p.kind === "domain").map((p) => p.name);

  // Deterministic domain handlers (priority 1).
  if (domains.includes("legal")) {
    return finalize(intent, plan, runLegal(intent, ctx, base));
  }
  if (domains.includes("finance")) {
    return finalize(intent, plan, runFinance(intent, ctx, base));
  }
  if (domains.includes("cad")) {
    return finalize(intent, plan, runCad(intent, ctx, base));
  }
  if (domains.includes("evidence")) {
    return finalize(intent, plan, runEvidence(intent, ctx, base, ref));
  }
  if (domains.includes("ops")) {
    return finalize(intent, plan, runOps(intent, ctx, base));
  }

  // Fallback: optional LLM pass if a provider is available and API key is set.
  const provider = deps.provider ?? defaultProvider();
  const llmResp = await provider.complete({
    model: env.LLM_MODEL,
    messages: [
      { role: "system", content: buildSystemPrompt({ proSeFooter: env.PRO_SE_FOOTER }) },
      { role: "system", content: modePrompt(intent.mode) },
      {
        role: "system",
        content: `Available tools: ${toolSpecs()
          .map((t) => t.name)
          .join(", ")}. Risk classification: ${risk}.`,
      },
      { role: "user", content: intent.raw },
    ],
    temperature: 0.2,
  });

  return finalize(
    intent,
    plan,
    buildResponse({
      tldr: `Answer produced via ${llmResp.provider}:${llmResp.model}.`,
      bullets: [
        `Mode: ${intent.mode}`,
        `Macros: ${intent.macros.join(", ") || "none"}`,
        `Risk: ${risk}`,
        `Tools available: ${toolSpecs().length}`,
      ],
      fullDraft: llmResp.content || "No content returned.",
      nextActions: ["Review output.", "Add domain hints or macros for deterministic handling."],
      confidence: llmResp.content ? "M" : "L",
      mode: intent.mode,
      macros: intent.macros,
      warnings: risk === "high" ? ["Input flagged as high risk — require confirmation before side effects."] : [],
    }),
  );
}

function finalize(
  intent: UserIntent,
  plan: PlanStep[],
  payload: ResponsePayload,
): OrchestratorOutput {
  return { ...payload, intent, plan };
}

function defaultProvider(): LLMProvider {
  return createOpenAIProvider({
    apiKey: env.LLM_API_KEY,
    model: env.LLM_MODEL,
    baseUrl: env.LLM_BASE_URL || undefined,
  });
}

// ---- Domain runners ----

function runLegal(
  intent: UserIntent,
  ctx: Record<string, unknown>,
  _base: Partial<ResponsePayload>,
): ResponsePayload {
  const macros = intent.macros;
  const footer = env.PRO_SE_FOOTER;

  if (macros.includes("/demand") && ctx.demandLetter) {
    const body = draftDemandLetter({ footer, ...(ctx.demandLetter as DemandLetterInput) });
    return buildResponse({
      tldr: "Demand letter drafted.",
      bullets: [
        "Facts numbered per house style.",
        "Demand and deadline stated explicitly.",
        "Reservation of rights included.",
        "Footer applied.",
      ],
      fullDraft: body,
      nextActions: ["Review tone.", "Verify address and service method.", "Confirm before sending."],
      confidence: "M",
      mode: intent.mode,
      macros,
    });
  }

  if (macros.includes("/vc") && ctx.verifiedComplaint) {
    const out = draftVerifiedComplaint({
      footer,
      ...(ctx.verifiedComplaint as VerifiedComplaintInput),
    });
    return buildResponse({
      tldr: "Verified complaint drafted (NY Supreme format).",
      bullets: [
        "Caption, parties, jurisdiction, facts in numbered form.",
        "Causes of action with element checklists.",
        "Prayer for relief and verification block included.",
        `Exhibits cited: ${out.usedExhibitTags.join(", ") || "none"}`,
      ],
      fullDraft: out.document,
      nextActions: ["Final review.", "File with index number.", "Serve defendants."],
      confidence: "M",
      assumptions: out.assumptions,
      mode: intent.mode,
      macros,
    });
  }

  if (macros.includes("/summons") && ctx.summons) {
    const body = draftSummons({ footer, ...(ctx.summons as SummonsInput) });
    return buildResponse({
      tldr: "Summons drafted.",
      bullets: [
        "CPLR-style 20/30 day language.",
        "Default judgment warning included.",
        "Plaintiff contact block preserved.",
        "Footer applied.",
      ],
      fullDraft: body,
      nextActions: ["Pair with verified complaint.", "Arrange service."],
      confidence: "M",
      mode: intent.mode,
      macros,
    });
  }

  if (macros.includes("/preserve") && ctx.preservation) {
    const body = draftPreservationLetter({ footer, ...(ctx.preservation as PreservationLetterInput) });
    return buildResponse({
      tldr: "Preservation (litigation hold) letter drafted.",
      bullets: [
        "Scope enumerated.",
        "Duty extended to custodians.",
        "Spoliation / adverse-inference language included.",
        "Footer applied.",
      ],
      fullDraft: body,
      nextActions: ["Deliver via trackable method.", "Docket hold internally."],
      confidence: "M",
      mode: intent.mode,
      macros,
    });
  }

  if (macros.includes("/discovery") && ctx.discovery) {
    const body = draftDiscovery({ footer, ...(ctx.discovery as DiscoveryInput) });
    return buildResponse({
      tldr: "Discovery request drafted.",
      bullets: [
        `Type: ${(ctx.discovery as DiscoveryInput).type}`,
        `Items: ${(ctx.discovery as DiscoveryInput).items.length}`,
        "Numbered per CPLR style.",
        "Footer applied.",
      ],
      fullDraft: body,
      nextActions: ["Verify scope.", "Serve counterparty."],
      confidence: "M",
      mode: intent.mode,
      macros,
    });
  }

  return buildResponse({
    tldr: "Legal domain routed but no payload attached.",
    bullets: [
      "Attach ctx.demandLetter, ctx.verifiedComplaint, ctx.summons, ctx.preservation, or ctx.discovery.",
      "Or pass macros like /demand with structured context.",
      "Footer defaults to env.PRO_SE_FOOTER.",
      "All drafts require explicit confirmation before filing.",
    ],
    fullDraft:
      "No document produced — supply a structured legal payload in the request context to generate a draft.",
    nextActions: ["Provide structured legal input.", "Pick a specific legal macro."],
    confidence: "L",
    mode: intent.mode,
    macros,
  });
}

function runFinance(
  intent: UserIntent,
  ctx: Record<string, unknown>,
  _base: Partial<ResponsePayload>,
): ResponsePayload {
  if (!ctx.pricing) {
    return buildResponse({
      tldr: "Finance domain routed but no pricing payload.",
      bullets: [
        "Attach ctx.pricing with weight, unit, karat, spot price, labor, markup.",
        "Engine emits calculationAudit entries for every numeric claim.",
        "Units: g, ozt, dwt (with 1 ozt = 31.1034768 g).",
        "Margin and breakeven helpers available.",
      ],
      fullDraft:
        "Supply ctx.pricing = { weight, unit, karat, spotPricePerTroyOz, laborCost, markup, ... } to run.",
      nextActions: ["Provide pricing input.", "Specify desired markup or retail price."],
      confidence: "L",
      mode: intent.mode,
      macros: intent.macros,
    });
  }
  const result = price(ctx.pricing as PricingRequest);
  const lines = [
    `Melt value: $${result.meltUSD.toFixed(2)}`,
    `COGS: $${result.cogs.toFixed(2)}`,
    result.suggestedPrice !== undefined
      ? `Suggested price: $${result.suggestedPrice.toFixed(2)}`
      : "",
    result.grossMarginUSD !== undefined
      ? `Gross margin: $${result.grossMarginUSD.toFixed(2)} (${result.grossMarginPct?.toFixed(2)}%)`
      : "",
  ].filter(Boolean);
  return buildResponse({
    tldr: `Priced piece; COGS $${result.cogs.toFixed(2)}.`,
    bullets: [
      `Melt: $${result.meltUSD.toFixed(2)}`,
      `COGS: $${result.cogs.toFixed(2)}`,
      result.suggestedPrice !== undefined
        ? `Suggested: $${result.suggestedPrice.toFixed(2)}`
        : "No markup provided.",
      result.grossMarginPct !== undefined
        ? `Gross margin: ${result.grossMarginPct.toFixed(2)}%`
        : "No revenue provided.",
    ],
    fullDraft: lines.join("\n"),
    nextActions: ["Confirm spot price.", "Sanity-check labor and findings cost."],
    confidence: "H",
    calculationAudit: result.audit,
    mode: intent.mode,
    macros: intent.macros,
  });
}

function runCad(
  intent: UserIntent,
  ctx: Record<string, unknown>,
  _base: Partial<ResponsePayload>,
): ResponsePayload {
  if (!ctx.cad) {
    return buildResponse({
      tldr: "CAD domain routed but no spec provided.",
      bullets: [
        "Attach ctx.cad with piece, size, version, dimensions, alloyKarat.",
        "Default unit is mm; default tolerance ±0.075 mm.",
        "Returns ANCONA_[Piece]_[Size]_v###.ext filename.",
        "Includes manufacturability checklist.",
      ],
      fullDraft: "Provide ctx.cad to generate a spec.",
      nextActions: ["Provide ctx.cad with piece, size, version, dimensions."],
      confidence: "L",
      mode: intent.mode,
      macros: intent.macros,
    });
  }
  const out = buildCadSpec(ctx.cad as CadSpecInput);
  return buildResponse({
    tldr: `CAD spec ready: ${out.file}`,
    bullets: [
      `File: ${out.file}`,
      `Tolerance: ${out.toleranceLine}`,
      `Warnings: ${out.warnings.length}`,
      `Checklist items: ${out.checklist.length}`,
    ],
    fullDraft: renderCadSpec(out),
    nextActions: ["Review checklist.", "Approve version for print."],
    confidence: out.warnings.length === 0 ? "H" : "M",
    warnings: out.warnings,
    mode: intent.mode,
    macros: intent.macros,
  });
}

function runEvidence(
  intent: UserIntent,
  ctx: Record<string, unknown>,
  _base: Partial<ResponsePayload>,
  ref: Date,
): ResponsePayload {
  const events = (ctx.events as EvidenceEvent[] | undefined) ?? [];
  const exhibits = (ctx.exhibits as ExhibitEntry[] | undefined) ?? [];
  const custody = (ctx.custody as ChainOfCustodyEntry[] | undefined) ?? [];
  let ws = createWorkspace();
  ws = { events, exhibits, custody };
  const report = buildReport(ws, ref);
  const draft = [
    "# Timeline",
    report.timeline,
    "",
    "# Exhibit Register",
    report.exhibitRegister,
    "",
    "# Chain of Custody",
    report.custodyLog,
  ].join("\n");
  const conf = report.contradictions.some((c) => c.severity === "critical")
    ? "L"
    : report.contradictions.length > 0
      ? "M"
      : "H";
  return buildResponse({
    tldr: `Evidence report: ${report.stats.events} events, ${report.stats.exhibits} exhibits, ${report.contradictions.length} contradictions.`,
    bullets: [
      `Events: ${report.stats.events} (undated: ${report.stats.undatedEvents})`,
      `Exhibits: ${report.stats.exhibits}`,
      `Custody entries: ${report.stats.custodyEntries}`,
      `Contradictions: ${report.contradictions.length}`,
    ],
    fullDraft: draft,
    nextActions: ["Resolve contradictions.", "Fill undated events.", "Produce exhibits."],
    confidence: conf,
    contradictions: report.contradictions,
    warnings: report.warnings,
    mode: intent.mode,
    macros: intent.macros,
  });
}

function runOps(
  intent: UserIntent,
  ctx: Record<string, unknown>,
  _base: Partial<ResponsePayload>,
): ResponsePayload {
  return buildResponse({
    tldr: "Ops domain routed.",
    bullets: [
      "Supply ctx.catalog and ctx.inventory.",
      "SKU normalization + validation available.",
      "Inventory valuation and low-stock reports available.",
      "Catalog diff compares prior vs current.",
    ],
    fullDraft:
      "Ops domain responds deterministically when given ctx.catalog / ctx.inventory. Use /CSV_ROWS or /EXPORT_JSON to export.",
    nextActions: ["Provide catalog and inventory payloads.", "Run ops snapshot."],
    confidence: "M",
    mode: intent.mode,
    macros: intent.macros,
  });
}
