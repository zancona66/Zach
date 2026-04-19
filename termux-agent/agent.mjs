#!/usr/bin/env node
// Tiny Claude chat agent. Zero dependencies. Node 18+.
// Usage:
//   node agent.mjs                    # interactive REPL
//   node agent.mjs "one-shot prompt"  # single turn
// Requires ANTHROPIC_API_KEY in env (or in a sibling .env file).

import { readFile, writeFile, stat } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------- .env loader (no dotenv dependency) ----------
async function loadDotenv() {
  const candidates = [
    join(__dirname, ".env"),
    join(process.cwd(), ".env"),
  ];
  for (const path of candidates) {
    try {
      const text = await readFile(path, "utf8");
      for (const raw of text.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq <= 0) continue;
        const key = line.slice(0, eq).trim();
        let val = line.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!(key in process.env)) process.env[key] = val;
      }
      return;
    } catch {
      // file not there; try next candidate
    }
  }
}

// ---------- built-in tools ----------
const TOOLS = [
  {
    name: "calculator",
    description:
      "Evaluate a single arithmetic expression using +, -, *, /, %, parentheses, and numeric literals.",
    input_schema: {
      type: "object",
      properties: {
        expression: { type: "string", description: "e.g. (5 * 2350) / 31.1034768" },
      },
      required: ["expression"],
    },
    handler: ({ expression }) => {
      const cleaned = String(expression).replace(/,/g, "").trim();
      if (!/^[-+*/%().\d\s,eE]+$/.test(cleaned)) {
        throw new Error("Only +, -, *, /, %, parentheses, and numbers allowed.");
      }
      const result = new Function(`"use strict";return (${cleaned});`)();
      if (typeof result !== "number" || !Number.isFinite(result)) {
        throw new Error("Expression did not evaluate to a finite number.");
      }
      return { expression: cleaned, result };
    },
  },
  {
    name: "now",
    description: "Return the current ISO timestamp and local date/time.",
    input_schema: { type: "object", properties: {} },
    handler: () => {
      const d = new Date();
      return {
        iso: d.toISOString(),
        local: d.toString(),
        unixSeconds: Math.floor(d.getTime() / 1000),
      };
    },
  },
  {
    name: "read_file",
    description:
      "Read a text file from the local filesystem. Path is resolved relative to the current working directory.",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string" },
        maxBytes: { type: "number", description: "Default 65536." },
      },
      required: ["path"],
    },
    handler: async ({ path, maxBytes = 65536 }) => {
      const abs = resolve(process.cwd(), path);
      const s = await stat(abs);
      if (!s.isFile()) throw new Error(`Not a file: ${abs}`);
      const buf = await readFile(abs);
      const slice = buf.subarray(0, Math.min(buf.length, maxBytes)).toString("utf8");
      return { path: abs, size: buf.length, truncated: buf.length > maxBytes, content: slice };
    },
  },
  {
    name: "write_file",
    description:
      "Write text content to a file. Requires the user to confirm before the call is made by the host app — do not assume this is silent.",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string" },
        content: { type: "string" },
      },
      required: ["path", "content"],
    },
    handler: async ({ path, content }) => {
      const abs = resolve(process.cwd(), path);
      await writeFile(abs, content, "utf8");
      return { path: abs, bytes: Buffer.byteLength(content, "utf8") };
    },
  },
];

const toolByName = Object.fromEntries(TOOLS.map((t) => [t.name, t]));
function toolSpecForApi() {
  return TOOLS.map(({ name, description, input_schema }) => ({ name, description, input_schema }));
}

// ---------- Anthropic API ----------
async function callClaude({ messages, system, apiKey, model, maxTokens }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages,
      tools: toolSpecForApi(),
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Anthropic API ${res.status}: ${text.slice(0, 500)}`);
  }
  return res.json();
}

// ---------- agent loop ----------
async function runAgentTurn({ conversation, system, apiKey, model, maxTokens, printAssistant }) {
  // Loop: call API → if tool_use, execute tools, append tool_result, call again.
  for (let hop = 0; hop < 8; hop += 1) {
    const resp = await callClaude({
      messages: conversation,
      system,
      apiKey,
      model,
      maxTokens,
    });
    // Append assistant message to conversation with original content blocks.
    conversation.push({ role: "assistant", content: resp.content });

    const toolUses = (resp.content || []).filter((b) => b.type === "tool_use");
    const textBlocks = (resp.content || []).filter((b) => b.type === "text");

    for (const t of textBlocks) if (t.text) printAssistant(t.text);

    if (resp.stop_reason !== "tool_use" || toolUses.length === 0) return;

    // Execute each requested tool and feed results back.
    const toolResults = [];
    for (const call of toolUses) {
      const tool = toolByName[call.name];
      let content;
      let isError = false;
      if (!tool) {
        content = `Unknown tool: ${call.name}`;
        isError = true;
      } else {
        try {
          const out = await tool.handler(call.input ?? {});
          content = JSON.stringify(out);
        } catch (err) {
          content = err instanceof Error ? err.message : String(err);
          isError = true;
        }
      }
      toolResults.push({
        type: "tool_result",
        tool_use_id: call.id,
        content,
        ...(isError ? { is_error: true } : {}),
      });
    }
    conversation.push({ role: "user", content: toolResults });
  }
  printAssistant("[agent] Stopping after 8 tool hops.");
}

// ---------- entry ----------
async function main() {
  await loadDotenv();
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  const model = process.env.ANTHROPIC_MODEL?.trim() || "claude-opus-4-5";
  const maxTokens = Math.max(128, Number(process.env.MAX_TOKENS) || 2048);
  const system =
    process.env.SYSTEM_PROMPT?.trim() ||
    "You are a helpful, concise assistant running in a Termux terminal on Android.";

  if (!apiKey) {
    console.error(
      "ANTHROPIC_API_KEY is not set.\n" +
        "  1. Get one: https://console.anthropic.com/settings/keys\n" +
        "  2. cp .env.example .env\n" +
        "  3. Edit .env and paste the key after ANTHROPIC_API_KEY=",
    );
    process.exit(1);
  }

  const oneShot = process.argv.slice(2).join(" ").trim();
  const conversation = [];

  const printAssistant = (text) => {
    process.stdout.write(`\nassistant> ${text}\n`);
  };

  if (oneShot) {
    conversation.push({ role: "user", content: oneShot });
    await runAgentTurn({ conversation, system, apiKey, model, maxTokens, printAssistant });
    return;
  }

  // Interactive REPL.
  const rl = createInterface({ input, output });
  console.log(`agent ready. model=${model}. commands: /reset /exit`);
  while (true) {
    let line;
    try {
      line = await rl.question("you> ");
    } catch {
      break;
    }
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed === "/exit" || trimmed === "/quit") break;
    if (trimmed === "/reset") {
      conversation.length = 0;
      console.log("[agent] conversation cleared.");
      continue;
    }
    conversation.push({ role: "user", content: trimmed });
    try {
      await runAgentTurn({ conversation, system, apiKey, model, maxTokens, printAssistant });
    } catch (err) {
      console.error(`[error] ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
