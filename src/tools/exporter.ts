import { writeFile } from "node:fs/promises";
import type { ResponsePayload } from "../core/types.js";
import { toJson } from "../exporters/json.js";
import { toMarkdown } from "../exporters/markdown.js";
import { toCsvRows } from "../exporters/csv.js";

export type ExportFormat = "json" | "markdown" | "csv";

export interface ExportArgs {
  payload: ResponsePayload;
  format: ExportFormat;
  outPath?: string;
}

export async function exportPayload(args: ExportArgs): Promise<{
  format: ExportFormat;
  content: string;
  outPath?: string;
}> {
  let content = "";
  if (args.format === "json") content = toJson(args.payload);
  else if (args.format === "markdown") content = toMarkdown(args.payload);
  else content = toCsvRows(args.payload);

  if (args.outPath) {
    await writeFile(args.outPath, content, "utf8");
  }
  return { format: args.format, content, outPath: args.outPath };
}
