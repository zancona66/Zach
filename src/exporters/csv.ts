import type { ResponsePayload } from "../core/types.js";

export type CsvScalar = string | number | boolean | null | undefined;

export function escapeCell(v: CsvScalar): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function rowsToCsv(
  rows: Array<Record<string, CsvScalar>>,
  headers?: string[],
): string {
  if (rows.length === 0 && (!headers || headers.length === 0)) return "";
  const keys = headers ?? Array.from(
    rows.reduce<Set<string>>((set, r) => {
      for (const k of Object.keys(r)) set.add(k);
      return set;
    }, new Set<string>()),
  );
  const head = keys.map(escapeCell).join(",");
  const body = rows.map((r) => keys.map((k) => escapeCell(r[k])).join(",")).join("\n");
  return `${head}\n${body}`;
}

export function toCsvRows(payload: ResponsePayload): string {
  const rows: Record<string, CsvScalar>[] = [
    { section: "tldr", value: payload.tldr },
    ...payload.bullets.map((b, i) => ({ section: `bullet_${i + 1}`, value: b })),
    { section: "fullDraft", value: payload.fullDraft },
    ...payload.nextActions.map((a, i) => ({ section: `nextAction_${i + 1}`, value: a })),
    { section: "confidence", value: payload.confidence },
  ];
  if (payload.calculationAudit) {
    for (const [i, a] of payload.calculationAudit.entries()) {
      rows.push({
        section: `calc_${i + 1}`,
        value: `${a.label}: ${a.formula} = ${a.result}${a.unit ? ` ${a.unit}` : ""}`,
      });
    }
  }
  if (payload.contradictions) {
    for (const [i, c] of payload.contradictions.entries()) {
      rows.push({ section: `contradiction_${i + 1}`, value: c.reason });
    }
  }
  return rowsToCsv(rows, ["section", "value"]);
}
