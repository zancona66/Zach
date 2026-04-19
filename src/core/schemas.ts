import { z } from "zod";

export const ConfidenceSchema = z.enum(["H", "M", "L"]);

export const AgentModeSchema = z.enum([
  "FAST",
  "DEEP",
  "FULL_POWER",
  "LEGAL",
  "FINANCE",
  "CAD",
  "EVIDENCE",
  "OPS",
  "DECIDE",
  "HEALTHCHECK",
]);

export const CitationSchema = z.object({
  source: z.string().min(1),
  title: z.string().optional(),
  url: z.string().url().optional(),
  locator: z.string().optional(),
  retrievedAt: z.string().optional(),
});

export const AssumptionSchema = z.object({
  id: z.string(),
  statement: z.string().min(1),
  basis: z.string().optional(),
  confidence: ConfidenceSchema,
  impact: z.enum(["high", "medium", "low"]).optional(),
});

export const ContradictionSchema = z.object({
  id: z.string(),
  entity: z.string().optional(),
  field: z.string().optional(),
  a: z.object({
    source: z.string(),
    value: z.unknown(),
    date: z.string().optional(),
  }),
  b: z.object({
    source: z.string(),
    value: z.unknown(),
    date: z.string().optional(),
  }),
  reason: z.string(),
  severity: z.enum(["minor", "material", "critical"]),
});

export const EvidenceEventSchema = z.object({
  id: z.string(),
  date: z.string(),
  normalizedDate: z.string().optional(),
  source: z.string(),
  summary: z.string(),
  exhibitTag: z.string().optional(),
  confidence: ConfidenceSchema,
  notes: z.string().optional(),
  entities: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export const ExhibitEntrySchema = z.object({
  tag: z.string(),
  title: z.string(),
  description: z.string().optional(),
  dateProduced: z.string().optional(),
  origin: z.string().optional(),
  relatedEvents: z.array(z.string()).optional(),
  bates: z.string().optional(),
});

export const ChainOfCustodySchema = z.object({
  exhibitTag: z.string(),
  timestamp: z.string(),
  actor: z.string(),
  action: z.enum([
    "created",
    "received",
    "transferred",
    "copied",
    "reviewed",
    "stored",
    "produced",
    "redacted",
  ]),
  location: z.string().optional(),
  notes: z.string().optional(),
  hash: z.string().optional(),
});

export const CalculationAuditSchema = z.object({
  label: z.string(),
  inputs: z.record(z.union([z.string(), z.number()])),
  formula: z.string(),
  result: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
  notes: z.string().optional(),
});

export const ResponsePayloadSchema = z.object({
  tldr: z.string(),
  bullets: z.array(z.string()),
  fullDraft: z.string(),
  nextActions: z.array(z.string()),
  confidence: ConfidenceSchema,
  assumptions: z.array(AssumptionSchema).optional(),
  contradictions: z.array(ContradictionSchema).optional(),
  citations: z.array(CitationSchema).optional(),
  calculationAudit: z.array(CalculationAuditSchema).optional(),
  mode: AgentModeSchema.optional(),
  macros: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
  meta: z.record(z.unknown()).optional(),
});

export const ChatRequestSchema = z.object({
  input: z.string().min(1),
  mode: AgentModeSchema.optional(),
  context: z.record(z.unknown()).optional(),
  referenceDate: z.string().optional(),
});

export const AnalyzeRequestSchema = z.object({
  events: z.array(EvidenceEventSchema).optional(),
  statements: z
    .array(
      z.object({
        source: z.string(),
        date: z.string().optional(),
        field: z.string().optional(),
        entity: z.string().optional(),
        value: z.unknown(),
      }),
    )
    .optional(),
  referenceDate: z.string().optional(),
});

export const ExportRequestSchema = z.object({
  payload: ResponsePayloadSchema,
  format: z.enum(["json", "csv", "markdown"]).optional(),
});

export const CsvRowsRequestSchema = z.object({
  rows: z.array(z.record(z.union([z.string(), z.number(), z.boolean(), z.null()]))),
  headers: z.array(z.string()).optional(),
});
