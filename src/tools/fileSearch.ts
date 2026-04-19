import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { env } from "../config/env.js";

export interface FileSearchArgs {
  root: string;
  query: string;
  glob?: string;
  maxMatches?: number;
}

export interface FileSearchMatch {
  path: string;
  line: number;
  preview: string;
}

export interface FileSearchResult {
  matches: FileSearchMatch[];
  disabled?: boolean;
  note?: string;
}

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name.startsWith(".")) continue;
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

function matchesGlob(path: string, glob?: string): boolean {
  if (!glob) return true;
  const re = new RegExp(
    "^" +
      glob
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*\*/g, "::DOUBLE::")
        .replace(/\*/g, "[^/]*")
        .replace(/::DOUBLE::/g, ".*") +
      "$",
  );
  return re.test(path);
}

export async function fileSearch(args: FileSearchArgs): Promise<FileSearchResult> {
  if (!env.ENABLE_FILE_SEARCH) {
    return {
      matches: [],
      disabled: true,
      note: "File search disabled — set ENABLE_FILE_SEARCH=true to enable.",
    };
  }
  const maxMatches = args.maxMatches ?? 50;
  const matches: FileSearchMatch[] = [];
  const rootStat = await stat(args.root);
  if (!rootStat.isDirectory()) {
    return { matches: [], note: `Root is not a directory: ${args.root}` };
  }
  const needle = args.query.toLowerCase();
  for await (const file of walk(args.root)) {
    const rel = relative(args.root, file);
    if (!matchesGlob(rel, args.glob)) continue;
    try {
      const content = await readFile(file, "utf8");
      const lines = content.split(/\r?\n/);
      for (let i = 0; i < lines.length; i += 1) {
        if (lines[i].toLowerCase().includes(needle)) {
          matches.push({ path: rel, line: i + 1, preview: lines[i].slice(0, 240) });
          if (matches.length >= maxMatches) return { matches };
        }
      }
    } catch {
      // binary or unreadable file; skip
    }
  }
  return { matches };
}
