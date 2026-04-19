import { CAD_UNIT, DEFAULT_CAD_TOLERANCE_MM } from "../../config/constants.js";
import { buildFileName, type CadExtension } from "./fileNaming.js";
import {
  manufacturabilityChecklist,
  renderTolerance,
  symmetricTolerance,
  validateTolerance,
} from "./tolerances.js";

export interface CadSpecInput {
  piece: string;
  size: string | number;
  version: number;
  dimensionsMm?: Record<string, number>;
  toleranceMm?: number;
  alloyKarat?: number;
  stones?: Array<{ cut: string; mmDiameter: number; count: number }>;
  ext?: CadExtension;
  notes?: string[];
}

export interface CadSpecOutput {
  unit: typeof CAD_UNIT;
  file: string;
  toleranceLine: string;
  checklist: ReadonlyArray<string>;
  warnings: string[];
  spec: CadSpecInput;
}

export function buildCadSpec(input: CadSpecInput): CadSpecOutput {
  const tol = symmetricTolerance(
    0,
    input.toleranceMm ?? DEFAULT_CAD_TOLERANCE_MM,
  );
  const warnings = validateTolerance(tol);
  const file = buildFileName({
    piece: input.piece,
    size: input.size,
    version: input.version,
    ext: input.ext ?? "stl",
  });

  if (input.stones) {
    for (const s of input.stones) {
      if (s.mmDiameter <= 0.5) {
        warnings.push(
          `Stone seat for ${s.cut} at ${s.mmDiameter}mm may exceed print resolution — verify.`,
        );
      }
    }
  }

  return {
    unit: CAD_UNIT,
    file,
    toleranceLine: `Target tolerance: ${renderTolerance(tol)}`,
    checklist: manufacturabilityChecklist,
    warnings,
    spec: input,
  };
}

export function renderCadSpec(out: CadSpecOutput): string {
  const lines: string[] = [];
  lines.push(`File: ${out.file}`);
  lines.push(`Unit: ${out.unit}`);
  lines.push(out.toleranceLine);
  if (out.spec.alloyKarat) lines.push(`Alloy: ${out.spec.alloyKarat}K`);
  if (out.spec.dimensionsMm) {
    lines.push("Dimensions:");
    for (const [k, v] of Object.entries(out.spec.dimensionsMm)) {
      lines.push(`  - ${k}: ${v.toFixed(2)} mm`);
    }
  }
  if (out.spec.stones && out.spec.stones.length > 0) {
    lines.push("Stones:");
    for (const s of out.spec.stones) {
      lines.push(`  - ${s.count} × ${s.cut} @ ${s.mmDiameter.toFixed(2)} mm`);
    }
  }
  lines.push("Manufacturability Checklist:");
  for (const c of out.checklist) lines.push(`  - ${c}`);
  if (out.warnings.length > 0) {
    lines.push("Warnings:");
    for (const w of out.warnings) lines.push(`  - ${w}`);
  }
  if (out.spec.notes && out.spec.notes.length > 0) {
    lines.push("Notes:");
    for (const n of out.spec.notes) lines.push(`  - ${n}`);
  }
  return lines.join("\n");
}
