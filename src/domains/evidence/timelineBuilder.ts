import type { EvidenceEvent } from "../../core/types.js";
import { buildChronology, renderTimeline } from "../../core/chronology.js";

export interface TimelineOutput {
  events: EvidenceEvent[];
  rendered: string;
  undatedCount: number;
}

export function buildTimeline(
  events: EvidenceEvent[],
  reference: Date = new Date(),
): TimelineOutput {
  const ordered = buildChronology(events, reference);
  const undatedCount = ordered.filter((e) => !e.normalizedDate).length;
  return {
    events: ordered,
    rendered: renderTimeline(ordered),
    undatedCount,
  };
}
