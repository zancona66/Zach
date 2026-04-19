import type { EvidenceEvent } from "./types.js";

const RELATIVE_PATTERNS: Array<{
  regex: RegExp;
  resolve: (m: RegExpMatchArray, ref: Date) => Date | null;
}> = [
  {
    regex: /^today$/i,
    resolve: (_m, ref) => new Date(ref),
  },
  {
    regex: /^yesterday$/i,
    resolve: (_m, ref) => {
      const d = new Date(ref);
      d.setUTCDate(d.getUTCDate() - 1);
      return d;
    },
  },
  {
    regex: /^tomorrow$/i,
    resolve: (_m, ref) => {
      const d = new Date(ref);
      d.setUTCDate(d.getUTCDate() + 1);
      return d;
    },
  },
  {
    regex: /^(\d+)\s+(day|days|week|weeks|month|months|year|years)\s+ago$/i,
    resolve: (m, ref) => {
      const n = parseInt(m[1], 10);
      const unit = m[2].toLowerCase();
      const d = new Date(ref);
      if (unit.startsWith("day")) d.setUTCDate(d.getUTCDate() - n);
      else if (unit.startsWith("week")) d.setUTCDate(d.getUTCDate() - n * 7);
      else if (unit.startsWith("month")) d.setUTCMonth(d.getUTCMonth() - n);
      else if (unit.startsWith("year")) d.setUTCFullYear(d.getUTCFullYear() - n);
      return d;
    },
  },
  {
    regex: /^in\s+(\d+)\s+(day|days|week|weeks|month|months|year|years)$/i,
    resolve: (m, ref) => {
      const n = parseInt(m[1], 10);
      const unit = m[2].toLowerCase();
      const d = new Date(ref);
      if (unit.startsWith("day")) d.setUTCDate(d.getUTCDate() + n);
      else if (unit.startsWith("week")) d.setUTCDate(d.getUTCDate() + n * 7);
      else if (unit.startsWith("month")) d.setUTCMonth(d.getUTCMonth() + n);
      else if (unit.startsWith("year")) d.setUTCFullYear(d.getUTCFullYear() + n);
      return d;
    },
  },
];

export function normalizeDate(raw: string, reference: Date = new Date()): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  for (const { regex, resolve } of RELATIVE_PATTERNS) {
    const m = trimmed.match(regex);
    if (m) {
      const d = resolve(m, reference);
      if (d && !Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    }
  }

  if (/^\d{4}$/.test(trimmed)) return `${trimmed}-01-01`;
  if (/^\d{4}-\d{2}$/.test(trimmed)) return `${trimmed}-01`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const m = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m) {
    const mo = m[1].padStart(2, "0");
    const d = m[2].padStart(2, "0");
    let y = m[3];
    if (y.length === 2) y = (parseInt(y, 10) > 50 ? "19" : "20") + y;
    return `${y}-${mo}-${d}`;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);

  return undefined;
}

export function sortEvents<T extends { date: string; normalizedDate?: string }>(
  events: T[],
  reference: Date = new Date(),
): T[] {
  const withNorm = events.map((e) => ({
    ...e,
    normalizedDate: e.normalizedDate ?? normalizeDate(e.date, reference),
  }));
  return withNorm.sort((a, b) => {
    const ad = a.normalizedDate ?? "9999-99-99";
    const bd = b.normalizedDate ?? "9999-99-99";
    return ad.localeCompare(bd);
  });
}

export function buildChronology(
  events: EvidenceEvent[],
  reference: Date = new Date(),
): EvidenceEvent[] {
  return sortEvents(events, reference);
}

export function renderTimeline(events: EvidenceEvent[]): string {
  return events
    .map(
      (e, i) =>
        `${(i + 1).toString().padStart(2, "0")}. ${
          e.normalizedDate ?? e.date ?? "undated"
        } — ${e.summary}${e.exhibitTag ? ` [${e.exhibitTag}]` : ""} (${e.confidence})`,
    )
    .join("\n");
}
