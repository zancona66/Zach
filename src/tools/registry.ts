import type { ToolCall, ToolResult } from "../core/types.js";
import { evaluate } from "./calculator.js";
import { webSearch } from "./webSearch.js";
import { fileSearch } from "./fileSearch.js";
import { extractPdfText } from "./pdfAdapter.js";
import { createMemoryStore } from "./memoryStore.js";
import { exportPayload } from "./exporter.js";

type Handler = (args: Record<string, unknown>) => Promise<unknown> | unknown;

export interface ToolDescriptor {
  name: string;
  description: string;
  handler: Handler;
}

const memory = createMemoryStore();

export const tools: ToolDescriptor[] = [
  {
    name: "calculator",
    description:
      "Evaluate a single arithmetic expression using +, -, *, /, %, parentheses, and numeric literals.",
    handler: (args) =>
      evaluate({
        expression: String(args.expression ?? ""),
        label: typeof args.label === "string" ? args.label : undefined,
      }),
  },
  {
    name: "web_search",
    description: "Stubbed web search. Returns disabled=true unless ENABLE_WEB_SEARCH is set.",
    handler: (args) =>
      webSearch({
        query: String(args.query ?? ""),
        maxResults: typeof args.maxResults === "number" ? args.maxResults : undefined,
      }),
  },
  {
    name: "file_search",
    description: "Search local files for a literal query.",
    handler: (args) =>
      fileSearch({
        root: String(args.root ?? "."),
        query: String(args.query ?? ""),
        glob: typeof args.glob === "string" ? args.glob : undefined,
        maxMatches: typeof args.maxMatches === "number" ? args.maxMatches : undefined,
      }),
  },
  {
    name: "pdf_extract",
    description: "Extract text from a PDF (stub adapter).",
    handler: (args) => extractPdfText({ path: String(args.path ?? "") }),
  },
  {
    name: "memory_get",
    description: "Fetch a memory record by key. No-op unless ENABLE_MEMORY=true.",
    handler: (args) => memory.get(String(args.key ?? "")),
  },
  {
    name: "memory_set",
    description: "Store a memory record. No-op unless ENABLE_MEMORY=true.",
    handler: (args) =>
      memory.set(
        String(args.key ?? ""),
        args.value,
        Array.isArray(args.tags) ? (args.tags as string[]) : undefined,
      ),
  },
  {
    name: "export_payload",
    description: "Render a ResponsePayload as json, markdown, or csv.",
    handler: async (args) => {
      const payload = args.payload as never;
      const format = (args.format ?? "json") as "json" | "markdown" | "csv";
      return exportPayload({ payload, format });
    },
  },
];

export function findTool(name: string): ToolDescriptor | undefined {
  return tools.find((t) => t.name === name);
}

export async function runTool(call: ToolCall): Promise<ToolResult> {
  const tool = findTool(call.tool);
  if (!tool) {
    return {
      id: call.id,
      tool: call.tool,
      ok: false,
      error: `Unknown tool: ${call.tool}`,
    };
  }
  try {
    const data = await tool.handler(call.args);
    return { id: call.id, tool: call.tool, ok: true, data };
  } catch (err) {
    return {
      id: call.id,
      tool: call.tool,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export function toolSpecs() {
  return tools.map((t) => ({ name: t.name, description: t.description }));
}
