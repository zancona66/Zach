import type { ResponsePayload } from "../core/types.js";
import { renderMarkdown } from "../core/responseFormatter.js";

export function toMarkdown(payload: ResponsePayload): string {
  return renderMarkdown(payload);
}
