import type { CalculationAudit } from "../core/types.js";

const ALLOWED = /^[-+*/%().\d\s,eE]+$/;

export interface CalculatorArgs {
  expression: string;
  label?: string;
}

export function evaluate({ expression, label }: CalculatorArgs): CalculationAudit {
  const cleaned = expression.replace(/,/g, "").trim();
  if (!ALLOWED.test(cleaned)) {
    throw new Error("Calculator only supports +, -, *, /, %, parentheses, and numbers.");
  }
  const fn = new Function(`"use strict"; return (${cleaned});`) as () => number;
  const result = fn();
  if (typeof result !== "number" || Number.isNaN(result)) {
    throw new Error("Expression did not evaluate to a finite number.");
  }
  return {
    label: label ?? "Expression",
    inputs: { expression },
    formula: cleaned,
    result: Math.round(result * 1e6) / 1e6,
  };
}
