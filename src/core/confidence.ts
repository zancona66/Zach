import type { ConfidenceLevel } from "./types.js";

export function scoreToConfidence(score: number): ConfidenceLevel {
  if (score >= 0.8) return "H";
  if (score >= 0.5) return "M";
  return "L";
}

export function lowest(levels: ConfidenceLevel[]): ConfidenceLevel {
  if (levels.some((l) => l === "L")) return "L";
  if (levels.some((l) => l === "M")) return "M";
  return "H";
}

export function combine(a: ConfidenceLevel, b: ConfidenceLevel): ConfidenceLevel {
  return lowest([a, b]);
}

export function describe(level: ConfidenceLevel): string {
  switch (level) {
    case "H":
      return "High — supported by direct evidence or deterministic calculation.";
    case "M":
      return "Medium — reasonable inference, some assumptions in play.";
    case "L":
      return "Low — significant unknowns or contested facts.";
  }
}
