import type { CalculationAudit } from "../../core/types.js";
import { round } from "../finance/preciousMetals.js";
import {
  availability,
  lowStock,
  needsReorder,
  valuation,
  type InventoryLine,
} from "./inventoryTools.js";
import {
  diffCatalogs,
  normalizeCatalog,
  validateSku,
  type CatalogItem,
} from "./catalogTools.js";

export function opsSnapshot(
  catalog: CatalogItem[],
  inventory: InventoryLine[],
): {
  catalog: CatalogItem[];
  skuWarnings: string[];
  lowStock: InventoryLine[];
  valuation: CalculationAudit;
} {
  const normalized = normalizeCatalog(catalog);
  const skuWarnings: string[] = [];
  for (const it of normalized) {
    const err = validateSku(it.sku);
    if (err) skuWarnings.push(`${it.sku}: ${err}`);
  }
  const value = valuation(inventory);
  return {
    catalog: normalized,
    skuWarnings,
    lowStock: lowStock(inventory),
    valuation: {
      label: "Inventory valuation",
      inputs: {
        lineCount: inventory.length,
        totalOnHand: inventory.reduce((a, l) => a + l.onHand, 0),
      },
      formula: "valuation = sum(unitCost * onHand)",
      result: round(value, 2),
      unit: "USD",
    },
  };
}

export { availability, needsReorder, diffCatalogs };
export type { InventoryLine, CatalogItem };
