import type { ExhibitEntry } from "../../core/types.js";

const EXHIBIT_ALPHA = "ABCDEFGHIJKL".split("");

export function nextExhibitTag(existing: ExhibitEntry[]): string {
  const used = new Set(existing.map((e) => e.tag));
  for (const letter of EXHIBIT_ALPHA) {
    const tag = `Exhibit ${letter}`;
    if (!used.has(tag)) return tag;
  }
  let i = EXHIBIT_ALPHA.length;
  while (true) {
    const tag = `Exhibit ${i + 1}`;
    if (!used.has(tag)) return tag;
    i += 1;
  }
}

export function tagFromMacro(macro: string): string | null {
  const m = macro.match(/^\/exh([A-L])$/i);
  if (!m) return null;
  return `Exhibit ${m[1].toUpperCase()}`;
}

export function registerExhibit(
  existing: ExhibitEntry[],
  partial: Omit<ExhibitEntry, "tag"> & { tag?: string },
): ExhibitEntry {
  return {
    tag: partial.tag ?? nextExhibitTag(existing),
    title: partial.title,
    description: partial.description,
    dateProduced: partial.dateProduced,
    origin: partial.origin,
    relatedEvents: partial.relatedEvents,
    bates: partial.bates,
  };
}
