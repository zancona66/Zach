import { describe, expect, it } from "vitest";
import { buildChronology, normalizeDate, sortEvents } from "../core/chronology.js";
import type { EvidenceEvent } from "../core/types.js";

describe("normalizeDate", () => {
  const ref = new Date("2026-04-17T00:00:00Z");

  it("passes through ISO YYYY-MM-DD", () => {
    expect(normalizeDate("2025-10-01", ref)).toBe("2025-10-01");
  });

  it("expands YYYY to January 1", () => {
    expect(normalizeDate("2024", ref)).toBe("2024-01-01");
  });

  it("expands YYYY-MM to first of month", () => {
    expect(normalizeDate("2024-06", ref)).toBe("2024-06-01");
  });

  it("parses US MM/DD/YYYY", () => {
    expect(normalizeDate("10/01/2025", ref)).toBe("2025-10-01");
  });

  it("resolves 'yesterday' against reference", () => {
    expect(normalizeDate("yesterday", ref)).toBe("2026-04-16");
  });

  it("resolves 'N days ago' against reference", () => {
    expect(normalizeDate("10 days ago", ref)).toBe("2026-04-07");
  });

  it("resolves 'in N weeks' against reference", () => {
    expect(normalizeDate("in 2 weeks", ref)).toBe("2026-05-01");
  });

  it("returns undefined for unparseable garbage", () => {
    expect(normalizeDate("banana", ref)).toBeUndefined();
  });
});

describe("sortEvents / buildChronology", () => {
  const ref = new Date("2026-04-17T00:00:00Z");
  const events: EvidenceEvent[] = [
    { id: "a", date: "2025-12-10", source: "doc1", summary: "Later", confidence: "M" },
    { id: "b", date: "2025-01-15", source: "doc2", summary: "Earlier", confidence: "H" },
    { id: "c", date: "2 weeks ago", source: "doc3", summary: "Recent", confidence: "L" },
    { id: "d", date: "tbd", source: "doc4", summary: "Undated", confidence: "L" },
  ];

  it("sorts by normalized date ascending", () => {
    const out = sortEvents(events, ref);
    expect(out.map((e) => e.id)).toEqual(["b", "a", "c", "d"]);
  });

  it("normalizes undated values consistently (undated goes last)", () => {
    const out = buildChronology(events, ref);
    expect(out[out.length - 1].id).toBe("d");
  });

  it("attaches normalizedDate to each event", () => {
    const out = buildChronology(events, ref);
    expect(out.find((e) => e.id === "c")?.normalizedDate).toBe("2026-04-03");
  });
});
