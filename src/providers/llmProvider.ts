export interface LLMMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
  tool_call_id?: string;
}

export interface LLMCompletionRequest {
  model: string;
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  tools?: LLMToolSpec[];
  toolChoice?: "auto" | "none" | { name: string };
}

export interface LLMToolSpec {
  name: string;
  description: string;
  jsonSchema: Record<string, unknown>;
}

export interface LLMCompletionResponse {
  content: string;
  toolCalls?: Array<{ name: string; arguments: Record<string, unknown>; id: string }>;
  raw?: unknown;
  provider: string;
  model: string;
}

export interface LLMProvider {
  name: string;
  complete(req: LLMCompletionRequest): Promise<LLMCompletionResponse>;
}
