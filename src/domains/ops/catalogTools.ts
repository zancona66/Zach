export interface CatalogItem {
  sku: string;
  name: string;
  category: string;
  karat?: number;
  weightGrams?: number;
  stones?: string;
  price?: number;
  cost?: number;
  active?: boolean;
  tags?: string[];
}

export function validateSku(sku: string): string | null {
  if (!/^[A-Z0-9-]{3,32}$/.test(sku)) {
    return "SKU must be 3-32 chars, uppercase letters, digits, or dashes.";
  }
  return null;
}

export function normalizeCatalog(items: CatalogItem[]): CatalogItem[] {
  return items.map((it) => ({
    ...it,
    sku: it.sku.trim().toUpperCase(),
    active: it.active ?? true,
    tags: it.tags?.map((t) => t.trim().toLowerCase()),
  }));
}

export function diffCatalogs(
  previous: CatalogItem[],
  current: CatalogItem[],
): {
  added: CatalogItem[];
  removed: CatalogItem[];
  changed: Array<{ sku: string; fields: string[] }>;
} {
  const prevMap = new Map(previous.map((i) => [i.sku, i]));
  const curMap = new Map(current.map((i) => [i.sku, i]));
  const added: CatalogItem[] = [];
  const removed: CatalogItem[] = [];
  const changed: Array<{ sku: string; fields: string[] }> = [];

  for (const [sku, cur] of curMap) {
    const prev = prevMap.get(sku);
    if (!prev) {
      added.push(cur);
      continue;
    }
    const fields: string[] = [];
    for (const key of Object.keys(cur) as Array<keyof CatalogItem>) {
      if (JSON.stringify(cur[key]) !== JSON.stringify(prev[key])) fields.push(key);
    }
    if (fields.length > 0) changed.push({ sku, fields });
  }
  for (const [sku, prev] of prevMap) {
    if (!curMap.has(sku)) removed.push(prev);
  }
  return { added, removed, changed };
}
