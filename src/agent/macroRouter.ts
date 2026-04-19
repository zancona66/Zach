import { ALL_MACROS } from "../config/constants.js";
import type { AgentMode } from "../core/types.js";

export interface ParsedMacros {
  macros: string[];
  cleanedInput: string;
  modeHint?: AgentMode;
  domainHint?:
    | "legal"
    | "finance"
    | "cad"
    | "evidence"
    | "ops"
    | "meta"
    | "general";
  exhibitTags: string[];
}

const MACRO_MODE_MAP: Record<string, AgentMode> = {
  "/FAST": "FAST",
  "/DEEP": "DEEP",
  "/EVIDENCE": "EVIDENCE",
  "/HEALTHCHECK": "HEALTHCHECK",
  "/DECIDE": "DECIDE",
};

const MACRO_DOMAIN_MAP: Record<string, ParsedMacros["domainHint"]> = {
  "/vc": "legal",
  "/summons": "legal",
  "/demand": "legal",
  "/preserve": "legal",
  "/discovery": "legal",
  "/nta": "legal",
  "/aos": "legal",
  "/toc": "legal",
  "/pricing": "finance",
  "/csv": "meta",
  "/cad": "cad",
  "/torah": "general",
  "/zohar": "general",
  "/EVIDENCE": "evidence",
  "/EXPORT_JSON": "meta",
  "/CSV_ROWS": "meta",
  "/PY_SNIPPET": "meta",
};

const KNOWN = new Set<string>(ALL_MACROS);

export function parseMacros(input: string): ParsedMacros {
  const tokens = input.split(/\s+/);
  const macros: string[] = [];
  const remaining: string[] = [];
  const exhibitTags: string[] = [];
  let modeHint: AgentMode | undefined;
  let domainHint: ParsedMacros["domainHint"] | undefined;

  for (const tok of tokens) {
    if (!tok.startsWith("/")) {
      remaining.push(tok);
      continue;
    }
    // normalize case for uppercase macros; keep lowercase macros as-is
    const lc = tok.toLowerCase();
    const uc = tok.toUpperCase();
    let canonical: string | undefined;
    if (KNOWN.has(tok)) canonical = tok;
    else if (KNOWN.has(lc)) canonical = lc;
    else if (KNOWN.has(uc)) canonical = uc;
    else if (/^\/exh[A-La-l]$/.test(tok)) {
      canonical = `/exh${tok.slice(4).toUpperCase()}`;
    }
    if (canonical) {
      macros.push(canonical);
      if (/^\/exh[A-L]$/.test(canonical)) {
        exhibitTags.push(`Exhibit ${canonical.slice(4).toUpperCase()}`);
      }
      if (MACRO_MODE_MAP[canonical] && !modeHint) modeHint = MACRO_MODE_MAP[canonical];
      if (MACRO_DOMAIN_MAP[canonical] && !domainHint)
        domainHint = MACRO_DOMAIN_MAP[canonical];
    } else {
      remaining.push(tok);
    }
  }

  return {
    macros,
    cleanedInput: remaining.join(" ").trim(),
    modeHint,
    domainHint,
    exhibitTags,
  };
}
