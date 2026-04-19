import type { Citation } from "./types.js";

export function formatCitation(c: Citation, index: number): string {
  const parts: string[] = [];
  parts.push(`[${index + 1}]`);
  if (c.title) parts.push(c.title);
  parts.push(`(${c.source})`);
  if (c.locator) parts.push(`@ ${c.locator}`);
  if (c.url) parts.push(c.url);
  if (c.retrievedAt) parts.push(`retrieved ${c.retrievedAt}`);
  return parts.join(" ");
}

export function renderCitationsBlock(citations: Citation[]): string {
  if (!citations || citations.length === 0) return "";
  return ["References:", ...citations.map((c, i) => `  ${formatCitation(c, i)}`)].join("\n");
}

export function validateCitations(citations: Citation[]): string[] {
  const warnings: string[] = [];
  for (const c of citations) {
    if (!c.source) warnings.push("Citation missing source");
    if (c.url && !/^https?:\/\//i.test(c.url)) {
      warnings.push(`Citation URL looks malformed: ${c.url}`);
    }
  }
  return warnings;
}
