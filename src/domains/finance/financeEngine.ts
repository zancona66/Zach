import type { CalculationAudit } from "../../core/types.js";
import {
  convertWeight,
  karatPurity,
  meltValue,
  round,
  type WeightUnit,
} from "./preciousMetals.js";
import { breakeven, cogs, grossMargin, netMargin, roi, type COGSInput } from "./roi.js";

export interface PricingRequest {
  weight: number;
  unit: WeightUnit;
  karat?: number;
  purity?: number;
  spotPricePerTroyOz: number;
  laborCost?: number;
  findings?: number;
  packaging?: number;
  overhead?: number;
  markup?: number;
  retailPrice?: number;
}

export interface PricingResult {
  meltUSD: number;
  suggestedPrice?: number;
  cogs: number;
  grossMarginUSD?: number;
  grossMarginPct?: number;
  audit: CalculationAudit[];
}

export function price(request: PricingRequest): PricingResult {
  const audits: CalculationAudit[] = [];

  const mv = meltValue({
    grossWeight: request.weight,
    unit: request.unit,
    karat: request.karat,
    purity: request.purity,
    spotPricePerTroyOz: request.spotPricePerTroyOz,
  });
  audits.push(mv.audit);

  const c = cogs({
    material: mv.value,
    labor: request.laborCost ?? 0,
    overhead: request.overhead ?? 0,
    findings: request.findings,
    packaging: request.packaging,
  });
  audits.push(c.audit);

  let suggestedPrice: number | undefined;
  if (request.markup !== undefined) {
    suggestedPrice = round(c.value * (1 + request.markup / 100), 2);
    audits.push({
      label: "Suggested retail (markup)",
      inputs: { cogs: c.value, markupPct: request.markup },
      formula: "suggested = cogs * (1 + markup/100)",
      result: suggestedPrice,
      unit: "USD",
    });
  }

  const revenue = request.retailPrice ?? suggestedPrice;
  let gm: ReturnType<typeof grossMargin> | undefined;
  if (revenue !== undefined) {
    gm = grossMargin(revenue, c.value);
    audits.push(gm.audit);
  }

  return {
    meltUSD: mv.value,
    suggestedPrice,
    cogs: c.value,
    grossMarginUSD: gm?.value,
    grossMarginPct: gm?.percent,
    audit: audits,
  };
}

export {
  convertWeight,
  karatPurity,
  meltValue,
  cogs,
  grossMargin,
  netMargin,
  roi,
  breakeven,
  round,
};
export type { WeightUnit, COGSInput };
