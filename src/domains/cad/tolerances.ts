import { DEFAULT_CAD_TOLERANCE_MM } from "../../config/constants.js";

export interface ToleranceSpec {
  nominal: number;
  plus: number;
  minus: number;
  unit: "mm";
}

export function symmetricTolerance(
  nominal: number,
  tol: number = DEFAULT_CAD_TOLERANCE_MM,
): ToleranceSpec {
  const t = Math.abs(tol);
  return { nominal, plus: t, minus: t, unit: "mm" };
}

export function renderTolerance(spec: ToleranceSpec): string {
  if (spec.plus === spec.minus) {
    return `${spec.nominal.toFixed(2)} ±${spec.plus.toFixed(2)} mm`;
  }
  return `${spec.nominal.toFixed(2)} +${spec.plus.toFixed(2)}/-${spec.minus.toFixed(2)} mm`;
}

export function validateTolerance(spec: ToleranceSpec): string[] {
  const warn: string[] = [];
  if (spec.plus < 0.01) warn.push("Plus tolerance under 0.01mm is likely unmanufacturable.");
  if (spec.minus < 0.01) warn.push("Minus tolerance under 0.01mm is likely unmanufacturable.");
  if (spec.plus > 0.25 || spec.minus > 0.25) {
    warn.push("Tolerance exceeds typical ±0.05–0.10 mm target; verify intent.");
  }
  return warn;
}

export const manufacturabilityChecklist: ReadonlyArray<string> = [
  "Minimum wall thickness ≥ 0.8 mm for casting; ≥ 0.6 mm for direct print.",
  "Prong tip ≥ 0.6 mm, base ≥ 1.0 mm, rounded on outside.",
  "Stone seats cut to actual stone diameter, not catalog CT weight.",
  "Engraving depth ≥ 0.15 mm, width ≥ 0.25 mm.",
  "Solder seams planned; high-stress joints reinforced.",
  "Support anchors placed on non-visible surfaces.",
  "Hallmark + maker's mark region designated and flat.",
  "Confirm karat on alloy sheet matches design spec.",
];
