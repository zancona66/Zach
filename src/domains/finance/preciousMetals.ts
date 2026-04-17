import {
  GRAMS_PER_PENNYWEIGHT,
  GRAMS_PER_TROY_OZ,
  KARAT_PURITY,
  SILVER_FINENESS,
} from "../../config/constants.js";
import type { CalculationAudit } from "../../core/types.js";

export function round(n: number, digits = 4): number {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

export type WeightUnit = "g" | "ozt" | "dwt";

export function toGrams(value: number, unit: WeightUnit): number {
  if (unit === "g") return value;
  if (unit === "ozt") return value * GRAMS_PER_TROY_OZ;
  return value * GRAMS_PER_PENNYWEIGHT;
}

export function fromGrams(grams: number, unit: WeightUnit): number {
  if (unit === "g") return grams;
  if (unit === "ozt") return grams / GRAMS_PER_TROY_OZ;
  return grams / GRAMS_PER_PENNYWEIGHT;
}

export function convertWeight(
  value: number,
  from: WeightUnit,
  to: WeightUnit,
): number {
  const grams = toGrams(value, from);
  return fromGrams(grams, to);
}

export function karatPurity(karat: number): number {
  const preset = KARAT_PURITY[karat];
  if (preset !== undefined) return preset;
  return Math.max(0, Math.min(1, karat / 24));
}

export function silverPurity(kind: keyof typeof SILVER_FINENESS | number): number {
  if (typeof kind === "number") return Math.max(0, Math.min(1, kind));
  return SILVER_FINENESS[kind] ?? 0.999;
}

export interface MeltValueInput {
  grossWeight: number;
  unit: WeightUnit;
  karat?: number;
  purity?: number;
  spotPricePerTroyOz: number;
}

export function meltValue(input: MeltValueInput): {
  value: number;
  audit: CalculationAudit;
} {
  const purity =
    input.purity ?? (input.karat !== undefined ? karatPurity(input.karat) : 1);
  const grams = toGrams(input.grossWeight, input.unit);
  const pureGrams = grams * purity;
  const troyOz = pureGrams / GRAMS_PER_TROY_OZ;
  const value = round(troyOz * input.spotPricePerTroyOz, 2);

  const audit: CalculationAudit = {
    label: "Melt value",
    inputs: {
      grossWeight: input.grossWeight,
      unit: input.unit,
      karat: input.karat ?? "n/a",
      purity: round(purity, 4),
      spotPricePerTroyOz: input.spotPricePerTroyOz,
      gramsPureMetal: round(pureGrams, 4),
      pureTroyOz: round(troyOz, 6),
    },
    formula:
      "grams = toGrams(grossWeight, unit); pureGrams = grams * purity; troyOz = pureGrams / 31.1034768; value = troyOz * spotPrice",
    result: value,
    unit: "USD",
  };

  return { value, audit };
}
