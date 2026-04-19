import { describe, expect, it } from "vitest";
import {
  detectContradictions,
  detectEventContradictions,
  detectEventDuplicates,
} from "../core/contradictionDetector.js";
import type { EvidenceEvent } from "../core/types.js";

describe("detectContradictions on statements", () => {
  it("flags conflicting values for same entity+field", () => {
    const out = detectContradictions([
      { source: "Complaint", entity: "Invoice #1042", field: "price", value: 18750 },
      { source: "Defendant email", entity: "Invoice #1042", field: "price", value: 15000 },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].severity).toBe("material");
  });

  it("does not flag equal values", () => {
    const out = detectContradictions([
      { source: "A", entity: "X", field: "k", value: 5 },
      { source: "B", entity: "X", field: "k", value: 5 },
    ]);
    expect(out).toHaveLength(0);
  });

  it("escalates to critical for payment/ownership fields", () => {
    const out = detectContradictions([
      { source: "A", entity: "X", field: "payment_status", value: "paid" },
      { source: "B", entity: "X", field: "payment_status", value: "unpaid" },
    ]);
    expect(out[0].severity).toBe("critical");
  });
});

describe("detectEventDuplicates", () => {
  it("flags events with same normalized date and summary", () => {
    const events: EvidenceEvent[] = [
      {
        id: "e1",
        date: "2025-10-01",
        normalizedDate: "2025-10-01",
        source: "a",
        summary: "Delivery made",
        confidence: "H",
      },
      {
        id: "e2",
        date: "2025-10-01",
        normalizedDate: "2025-10-01",
        source: "b",
        summary: "Delivery made",
        confidence: "H",
      },
    ];
    const out = detectEventDuplicates(events);
    expect(out).toHaveLength(1);
    expect(out[0].field).toBe("duplicate_event");
  });
});

describe("detectEventContradictions", () => {
  it("surfaces both statement conflicts and duplicates", () => {
    const events: EvidenceEvent[] = [
      {
        id: "e1",
        date: "2025-10-01",
        normalizedDate: "2025-10-01",
        source: "a",
        summary: "Delivery made",
        confidence: "H",
        entities: ["Acme"],
      },
      {
        id: "e2",
        date: "2025-10-01",
        normalizedDate: "2025-10-01",
        source: "b",
        summary: "Delivery disputed",
        confidence: "M",
        entities: ["Acme"],
      },
    ];
    const out = detectEventContradictions(events);
    expect(out.length).toBeGreaterThanOrEqual(1);
  });
});
