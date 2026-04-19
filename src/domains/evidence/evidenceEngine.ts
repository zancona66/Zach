import type {
  ChainOfCustodyEntry,
  Contradiction,
  EvidenceEvent,
  ExhibitEntry,
} from "../../core/types.js";
import { detectEventContradictions } from "../../core/contradictionDetector.js";
import { addCustody, renderCustodyLog, validateCustody } from "./chainOfCustody.js";
import { buildTimeline } from "./timelineBuilder.js";

export interface EvidenceWorkspace {
  events: EvidenceEvent[];
  exhibits: ExhibitEntry[];
  custody: ChainOfCustodyEntry[];
}

export function createWorkspace(): EvidenceWorkspace {
  return { events: [], exhibits: [], custody: [] };
}

export function addEvent(ws: EvidenceWorkspace, event: EvidenceEvent): EvidenceWorkspace {
  return { ...ws, events: [...ws.events, event] };
}

export function addExhibit(
  ws: EvidenceWorkspace,
  exhibit: ExhibitEntry,
): EvidenceWorkspace {
  return { ...ws, exhibits: [...ws.exhibits, exhibit] };
}

export function logCustody(
  ws: EvidenceWorkspace,
  entry: ChainOfCustodyEntry,
): EvidenceWorkspace {
  return { ...ws, custody: addCustody(ws.custody, entry) };
}

export interface EvidenceReport {
  timeline: string;
  exhibitRegister: string;
  custodyLog: string;
  contradictions: Contradiction[];
  warnings: string[];
  stats: {
    events: number;
    exhibits: number;
    custodyEntries: number;
    undatedEvents: number;
  };
}

export function buildReport(
  ws: EvidenceWorkspace,
  reference: Date = new Date(),
): EvidenceReport {
  const timeline = buildTimeline(ws.events, reference);
  const contradictions = detectEventContradictions(timeline.events);
  const custodyWarnings = validateCustody(ws.custody);
  const exhibitRegister = renderExhibitRegister(ws.exhibits);
  return {
    timeline: timeline.rendered,
    exhibitRegister,
    custodyLog: renderCustodyLog(ws.custody),
    contradictions,
    warnings: custodyWarnings,
    stats: {
      events: ws.events.length,
      exhibits: ws.exhibits.length,
      custodyEntries: ws.custody.length,
      undatedEvents: timeline.undatedCount,
    },
  };
}

export function renderExhibitRegister(exhibits: ExhibitEntry[]): string {
  if (exhibits.length === 0) return "No exhibits registered.";
  const header = "Tag | Title | Date | Origin | Bates | Description";
  const rows = exhibits.map(
    (e) =>
      `${e.tag} | ${e.title} | ${e.dateProduced ?? "-"} | ${e.origin ?? "-"} | ${
        e.bates ?? "-"
      } | ${e.description ?? "-"}`,
  );
  return [header, ...rows].join("\n");
}
