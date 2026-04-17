#!/usr/bin/env node
import { orchestrate } from "./agent/orchestrator.js";
import { renderMarkdown } from "./core/responseFormatter.js";
import { toJson } from "./exporters/json.js";
import { toCsvRows } from "./exporters/csv.js";

interface CliArgs {
  mode?: string;
  input?: string;
  format: "markdown" | "json" | "csv";
  contextPath?: string;
  referenceDate?: string;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { format: "markdown" };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--mode" && next) {
      args.mode = next;
      i += 1;
    } else if (a === "--input" && next) {
      args.input = next;
      i += 1;
    } else if (a === "--format" && next) {
      if (next === "json" || next === "csv" || next === "markdown") {
        args.format = next;
      }
      i += 1;
    } else if (a === "--context" && next) {
      args.contextPath = next;
      i += 1;
    } else if (a === "--ref" && next) {
      args.referenceDate = next;
      i += 1;
    } else if (a === "--help" || a === "-h") {
      printHelp();
      process.exit(0);
    }
  }
  return args;
}

function printHelp(): void {
  const lines = [
    "Usage: npm run chat -- --mode FULL_POWER --input \"your request\"",
    "",
    "Flags:",
    "  --mode <AgentMode>   One of FAST, DEEP, FULL_POWER, LEGAL, FINANCE, CAD, EVIDENCE, OPS, DECIDE, HEALTHCHECK",
    "  --input <string>     Required request text (may include macros like /demand, /pricing, /cad).",
    "  --context <path>     Optional JSON file with structured context (e.g. verifiedComplaint, pricing).",
    "  --format <fmt>       Output format: markdown (default), json, csv.",
    "  --ref <YYYY-MM-DD>   Reference date for relative-date normalization.",
    "",
    "Examples:",
    "  npm run chat -- --mode LEGAL --input \"/demand draft letter\" --context ./samples/demand.json",
    "  npm run chat -- --input \"/pricing ring spec\" --context ./samples/pricing.json --format json",
  ];
  process.stdout.write(lines.join("\n") + "\n");
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input) {
    printHelp();
    process.exit(1);
  }
  let context: Record<string, unknown> | undefined;
  if (args.contextPath) {
    const fs = await import("node:fs/promises");
    const raw = await fs.readFile(args.contextPath, "utf8");
    context = JSON.parse(raw);
  }
  const result = await orchestrate({
    input: args.input,
    mode: args.mode,
    context,
    referenceDate: args.referenceDate,
  });
  if (args.format === "json") process.stdout.write(toJson(result) + "\n");
  else if (args.format === "csv") process.stdout.write(toCsvRows(result) + "\n");
  else process.stdout.write(renderMarkdown(result) + "\n");
}

main().catch((err) => {
  process.stderr.write(`CLI error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
