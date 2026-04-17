import type { CalculationAudit } from "../../core/types.js";
import { round } from "./preciousMetals.js";

export interface COGSInput {
  material: number;
  labor: number;
  overhead: number;
  findings?: number;
  packaging?: number;
  misc?: number;
}

export function cogs(input: COGSInput): { value: number; audit: CalculationAudit } {
  const parts = [
    input.material,
    input.labor,
    input.overhead,
    input.findings ?? 0,
    input.packaging ?? 0,
    input.misc ?? 0,
  ];
  const total = parts.reduce((a, b) => a + b, 0);
  return {
    value: round(total, 2),
    audit: {
      label: "COGS",
      inputs: {
        material: input.material,
        labor: input.labor,
        overhead: input.overhead,
        findings: input.findings ?? 0,
        packaging: input.packaging ?? 0,
        misc: input.misc ?? 0,
      },
      formula: "COGS = material + labor + overhead + findings + packaging + misc",
      result: round(total, 2),
      unit: "USD",
    },
  };
}

export function grossMargin(
  revenue: number,
  cogsValue: number,
): { value: number; percent: number; audit: CalculationAudit } {
  const gross = revenue - cogsValue;
  const pct = revenue === 0 ? 0 : (gross / revenue) * 100;
  return {
    value: round(gross, 2),
    percent: round(pct, 2),
    audit: {
      label: "Gross margin",
      inputs: { revenue, cogs: cogsValue },
      formula: "gross = revenue - cogs; pct = gross / revenue * 100",
      result: `${round(gross, 2)} (${round(pct, 2)}%)`,
      unit: "USD",
    },
  };
}

export function netMargin(
  revenue: number,
  cogsValue: number,
  opex: number,
  taxes = 0,
): { value: number; percent: number; audit: CalculationAudit } {
  const net = revenue - cogsValue - opex - taxes;
  const pct = revenue === 0 ? 0 : (net / revenue) * 100;
  return {
    value: round(net, 2),
    percent: round(pct, 2),
    audit: {
      label: "Net margin",
      inputs: { revenue, cogs: cogsValue, opex, taxes },
      formula: "net = revenue - cogs - opex - taxes; pct = net / revenue * 100",
      result: `${round(net, 2)} (${round(pct, 2)}%)`,
      unit: "USD",
    },
  };
}

export function roi(
  gain: number,
  cost: number,
): { value: number; audit: CalculationAudit } {
  const pct = cost === 0 ? 0 : ((gain - cost) / cost) * 100;
  return {
    value: round(pct, 2),
    audit: {
      label: "ROI",
      inputs: { gain, cost },
      formula: "ROI = (gain - cost) / cost * 100",
      result: `${round(pct, 2)}%`,
      unit: "%",
    },
  };
}

export function breakeven(
  fixedCosts: number,
  pricePerUnit: number,
  variableCostPerUnit: number,
): { units: number; revenue: number; audit: CalculationAudit } {
  const margin = pricePerUnit - variableCostPerUnit;
  const units = margin <= 0 ? Infinity : Math.ceil(fixedCosts / margin);
  const revenue = Number.isFinite(units) ? units * pricePerUnit : Infinity;
  return {
    units,
    revenue: round(revenue, 2),
    audit: {
      label: "Breakeven",
      inputs: { fixedCosts, pricePerUnit, variableCostPerUnit, contributionMargin: round(margin, 2) },
      formula: "units = ceil(fixedCosts / (price - variableCost)); revenue = units * price",
      result: Number.isFinite(units) ? `${units} units / ${round(revenue, 2)} USD` : "unattainable at current price",
      unit: "units",
    },
  };
}
