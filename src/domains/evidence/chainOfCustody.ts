import type { ChainOfCustodyEntry } from "../../core/types.js";

export function addCustody(
  log: ChainOfCustodyEntry[],
  entry: ChainOfCustodyEntry,
): ChainOfCustodyEntry[] {
  return [...log, entry].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function renderCustodyLog(log: ChainOfCustodyEntry[]): string {
  if (log.length === 0) return "No chain-of-custody entries.";
  const header = "Timestamp | Exhibit | Actor | Action | Location | Notes | Hash";
  const rows = log.map(
    (e) =>
      `${e.timestamp} | ${e.exhibitTag} | ${e.actor} | ${e.action} | ${
        e.location ?? "-"
      } | ${e.notes ?? "-"} | ${e.hash ?? "-"}`,
  );
  return [header, ...rows].join("\n");
}

export function validateCustody(log: ChainOfCustodyEntry[]): string[] {
  const warn: string[] = [];
  const byExhibit = new Map<string, ChainOfCustodyEntry[]>();
  for (const e of log) {
    const arr = byExhibit.get(e.exhibitTag) ?? [];
    arr.push(e);
    byExhibit.set(e.exhibitTag, arr);
  }
  for (const [tag, arr] of byExhibit) {
    const sorted = [...arr].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    if (sorted[0].action !== "created" && sorted[0].action !== "received") {
      warn.push(`${tag}: chain does not start with a 'created' or 'received' action.`);
    }
    for (let i = 1; i < sorted.length; i += 1) {
      if (sorted[i].timestamp === sorted[i - 1].timestamp) {
        warn.push(`${tag}: duplicate timestamp at ${sorted[i].timestamp}`);
      }
    }
  }
  return warn;
}
