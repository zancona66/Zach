import type { Contradiction, EvidenceEvent } from "./types.js";
import { normalizeDate } from "./chronology.js";

export interface StatementRecord {
  source: string;
  entity?: string;
  field?: string;
  value?: unknown;
  date?: string;
}

let cid = 0;
function nextId(): string {
  cid += 1;
  return `CONTRA-${cid.toString().padStart(4, "0")}`;
}

function keyFor(rec: { entity?: string; field?: string }): string {
  return `${rec.entity ?? "*"}::${rec.field ?? "*"}`;
}

function equalish(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) < 1e-9;
  }
  if (typeof a === "string" && typeof b === "string") {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

function severityOf(field?: string): Contradiction["severity"] {
  if (!field) return "minor";
  const critical = ["payment", "paid", "amount_due", "ownership", "signature"];
  const material = ["date", "quantity", "weight", "karat", "price", "address"];
  const fl = field.toLowerCase();
  if (critical.some((k) => fl.includes(k))) return "critical";
  if (material.some((k) => fl.includes(k))) return "material";
  return "minor";
}

export function detectContradictions(
  statements: StatementRecord[],
  reference: Date = new Date(),
): Contradiction[] {
  const grouped = new Map<string, StatementRecord[]>();
  for (const s of statements) {
    const k = keyFor(s);
    const arr = grouped.get(k) ?? [];
    arr.push(s);
    grouped.set(k, arr);
  }

  const out: Contradiction[] = [];
  for (const [, arr] of grouped) {
    for (let i = 0; i < arr.length; i += 1) {
      for (let j = i + 1; j < arr.length; j += 1) {
        const a = arr[i];
        const b = arr[j];
        if (!equalish(a.value, b.value)) {
          out.push({
            id: nextId(),
            entity: a.entity ?? b.entity,
            field: a.field ?? b.field,
            a: {
              source: a.source,
              value: a.value,
              date: a.date ? normalizeDate(a.date, reference) ?? a.date : undefined,
            },
            b: {
              source: b.source,
              value: b.value,
              date: b.date ? normalizeDate(b.date, reference) ?? b.date : undefined,
            },
            reason: `Conflicting values for ${a.field ?? "field"}${
              a.entity ? ` of ${a.entity}` : ""
            }: ${JSON.stringify(a.value)} vs ${JSON.stringify(b.value)}`,
            severity: severityOf(a.field ?? b.field),
          });
        }
      }
    }
  }
  return out;
}

export function detectEventDuplicates(events: EvidenceEvent[]): Contradiction[] {
  const seen = new Map<string, EvidenceEvent>();
  const out: Contradiction[] = [];
  for (const e of events) {
    const key = `${e.normalizedDate ?? e.date}::${e.summary.trim().toLowerCase()}`;
    const prior = seen.get(key);
    if (prior && prior.id !== e.id) {
      out.push({
        id: nextId(),
        entity: e.entities?.[0],
        field: "duplicate_event",
        a: { source: prior.source, value: prior.summary, date: prior.normalizedDate ?? prior.date },
        b: { source: e.source, value: e.summary, date: e.normalizedDate ?? e.date },
        reason: "Possible duplicate event detected by date+summary key",
        severity: "minor",
      });
    } else {
      seen.set(key, e);
    }
  }
  return out;
}

export function detectEventContradictions(events: EvidenceEvent[]): Contradiction[] {
  const statements: StatementRecord[] = events.map((e) => ({
    source: e.source,
    entity: e.entities?.[0],
    field: "event_summary",
    value: e.summary,
    date: e.normalizedDate ?? e.date,
  }));
  return [...detectContradictions(statements), ...detectEventDuplicates(events)];
}
