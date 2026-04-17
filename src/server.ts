import Fastify from "fastify";
import pino from "pino";
import { env } from "./config/env.js";
import {
  AnalyzeRequestSchema,
  ChatRequestSchema,
  CsvRowsRequestSchema,
  ExportRequestSchema,
} from "./core/schemas.js";
import { orchestrate } from "./agent/orchestrator.js";
import { toJson } from "./exporters/json.js";
import { toMarkdown } from "./exporters/markdown.js";
import { rowsToCsv, toCsvRows } from "./exporters/csv.js";
import { buildReport, createWorkspace } from "./domains/evidence/evidenceEngine.js";
import { detectContradictions } from "./core/contradictionDetector.js";

const logger = pino({ level: env.LOG_LEVEL });

export function buildServer() {
  const app = Fastify({ logger });

  app.post("/chat", async (req, reply) => {
    const parsed = ChatRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "invalid_input", issues: parsed.error.issues });
    }
    const result = await orchestrate(parsed.data);
    return reply.send(result);
  });

  app.post("/analyze", async (req, reply) => {
    const parsed = AnalyzeRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "invalid_input", issues: parsed.error.issues });
    }
    const { events = [], statements = [], referenceDate } = parsed.data;
    const ref = referenceDate ? new Date(referenceDate) : new Date();
    const ws = { ...createWorkspace(), events };
    const report = buildReport(ws, ref);
    const stmtContradictions = detectContradictions(statements, ref);
    return reply.send({
      timeline: report.timeline,
      exhibitRegister: report.exhibitRegister,
      custody: report.custodyLog,
      contradictions: [...report.contradictions, ...stmtContradictions],
      stats: report.stats,
      warnings: report.warnings,
    });
  });

  app.post("/export/json", async (req, reply) => {
    const parsed = ExportRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "invalid_input", issues: parsed.error.issues });
    }
    const format = parsed.data.format ?? "json";
    const p = parsed.data.payload;
    if (format === "markdown") return reply.type("text/markdown").send(toMarkdown(p));
    if (format === "csv") return reply.type("text/csv").send(toCsvRows(p));
    return reply.type("application/json").send(toJson(p));
  });

  app.post("/export/csv", async (req, reply) => {
    const parsed = CsvRowsRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "invalid_input", issues: parsed.error.issues });
    }
    const csv = rowsToCsv(parsed.data.rows, parsed.data.headers);
    return reply.type("text/csv").send(csv);
  });

  app.get("/health", async () => ({ ok: true, ts: new Date().toISOString() }));

  return app;
}

const isDirectRun = (() => {
  try {
    const entry = process.argv[1] ? new URL(`file://${process.argv[1]}`).href : "";
    return import.meta.url === entry;
  } catch {
    return false;
  }
})();

if (isDirectRun) {
  const app = buildServer();
  app
    .listen({ port: env.PORT, host: env.HOST })
    .then((addr) => logger.info(`ZRA_OS_AGENT server listening on ${addr}`))
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });
}
