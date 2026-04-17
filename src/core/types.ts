export type ConfidenceLevel = "H" | "M" | "L";

export type AgentMode =
  | "FAST"
  | "DEEP"
  | "FULL_POWER"
  | "LEGAL"
  | "FINANCE"
  | "CAD"
  | "EVIDENCE"
  | "OPS"
  | "DECIDE"
  | "HEALTHCHECK";

export interface UserIntent {
  raw: string;
  mode: AgentMode;
  macros: string[];
  domain?:
    | "legal"
    | "finance"
    | "cad"
    | "evidence"
    | "ops"
    | "meta"
    | "general";
  referenceDate?: string;
  context?: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  tool: string;
  args: Record<string, unknown>;
}

export interface ToolResult<T = unknown> {
  id: string;
  tool: string;
  ok: boolean;
  data?: T;
  error?: string;
}

export interface Citation {
  source: string;
  title?: string;
  url?: string;
  locator?: string;
  retrievedAt?: string;
}

export interface Assumption {
  id: string;
  statement: string;
  basis?: string;
  confidence: ConfidenceLevel;
  impact?: "high" | "medium" | "low";
}

export interface Contradiction {
  id: string;
  entity?: string;
  field?: string;
  a: { source: string; value?: unknown; date?: string };
  b: { source: string; value?: unknown; date?: string };
  reason: string;
  severity: "minor" | "material" | "critical";
}

export interface EvidenceEvent {
  id: string;
  date: string;
  normalizedDate?: string;
  source: string;
  summary: string;
  exhibitTag?: string;
  confidence: ConfidenceLevel;
  notes?: string;
  entities?: string[];
  tags?: string[];
}

export interface ExhibitEntry {
  tag: string;
  title: string;
  description?: string;
  dateProduced?: string;
  origin?: string;
  relatedEvents?: string[];
  bates?: string;
}

export interface ChainOfCustodyEntry {
  exhibitTag: string;
  timestamp: string;
  actor: string;
  action:
    | "created"
    | "received"
    | "transferred"
    | "copied"
    | "reviewed"
    | "stored"
    | "produced"
    | "redacted";
  location?: string;
  notes?: string;
  hash?: string;
}

export interface CalculationAudit {
  label: string;
  inputs: Record<string, number | string>;
  formula: string;
  result: number | string;
  unit?: string;
  notes?: string;
}

export interface DraftSection {
  heading: string;
  body: string;
  numbered?: boolean;
}

export interface ResponsePayload {
  tldr: string;
  bullets: string[];
  fullDraft: string;
  nextActions: string[];
  confidence: ConfidenceLevel;
  assumptions?: Assumption[];
  contradictions?: Contradiction[];
  citations?: Citation[];
  calculationAudit?: CalculationAudit[];
  mode?: AgentMode;
  macros?: string[];
  warnings?: string[];
  meta?: Record<string, unknown>;
}

export interface AgentError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
