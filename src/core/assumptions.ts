import type { Assumption, ConfidenceLevel } from "./types.js";

let counter = 0;
function nextId(prefix = "A"): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

export function assume(
  statement: string,
  opts: {
    basis?: string;
    confidence?: ConfidenceLevel;
    impact?: "high" | "medium" | "low";
  } = {},
): Assumption {
  return {
    id: nextId("ASSUM"),
    statement,
    basis: opts.basis,
    confidence: opts.confidence ?? "M",
    impact: opts.impact,
  };
}

export function formatAssumptions(list: Assumption[]): string {
  if (list.length === 0) return "";
  return list
    .map(
      (a, i) =>
        `${i + 1}. [${a.confidence}${a.impact ? `/${a.impact}` : ""}] ${a.statement}${
          a.basis ? ` (basis: ${a.basis})` : ""
        }`,
    )
    .join("\n");
}
