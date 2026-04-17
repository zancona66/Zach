import type { ResponsePayload } from "../core/types.js";

export function toJson(payload: ResponsePayload, pretty = true): string {
  return JSON.stringify(payload, null, pretty ? 2 : 0);
}
