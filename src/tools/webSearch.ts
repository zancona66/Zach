import type { Citation } from "../core/types.js";
import { env } from "../config/env.js";

export interface WebSearchArgs {
  query: string;
  maxResults?: number;
}

export interface WebSearchResult {
  results: Array<{
    title: string;
    url: string;
    snippet: string;
    source: string;
    retrievedAt: string;
  }>;
  citations: Citation[];
  disabled?: boolean;
  note?: string;
}

export async function webSearch(args: WebSearchArgs): Promise<WebSearchResult> {
  if (!env.ENABLE_WEB_SEARCH) {
    return {
      results: [],
      citations: [],
      disabled: true,
      note: "Web search disabled — set ENABLE_WEB_SEARCH=true and wire a provider.",
    };
  }
  return {
    results: [],
    citations: [],
    note: `Web search enabled but no provider configured. Query was: ${args.query}`,
  };
}
