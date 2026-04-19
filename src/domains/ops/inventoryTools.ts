export interface InventoryLine {
  sku: string;
  location?: string;
  onHand: number;
  reserved?: number;
  reorderLevel?: number;
  unitCost?: number;
}

export function availability(line: InventoryLine): number {
  return Math.max(0, line.onHand - (line.reserved ?? 0));
}

export function needsReorder(line: InventoryLine): boolean {
  if (line.reorderLevel === undefined) return false;
  return availability(line) <= line.reorderLevel;
}

export function valuation(lines: InventoryLine[]): number {
  return lines.reduce(
    (sum, l) => sum + (l.unitCost ?? 0) * l.onHand,
    0,
  );
}

export function lowStock(lines: InventoryLine[]): InventoryLine[] {
  return lines.filter(needsReorder);
}
