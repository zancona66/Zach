import type {
  LLMCompletionRequest,
  LLMCompletionResponse,
  LLMProvider,
} from "./llmProvider.js";

export interface OpenAIProviderOptions {
  apiKey: string;
  model: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

interface OpenAIToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string | null;
      tool_calls?: OpenAIToolCall[];
    };
  }>;
  model?: string;
}

export function createOpenAIProvider(opts: OpenAIProviderOptions): LLMProvider {
  const baseUrl = opts.baseUrl?.replace(/\/$/, "") || "https://api.openai.com/v1";
  const fetchImpl = opts.fetchImpl ?? globalThis.fetch;

  return {
    name: "openai",
    async complete(req: LLMCompletionRequest): Promise<LLMCompletionResponse> {
      if (!opts.apiKey) {
        return offlineStub(req, opts.model, "openai");
      }
      const body = {
        model: req.model,
        messages: req.messages.map((m) => ({
          role: m.role,
          content: m.content,
          ...(m.name ? { name: m.name } : {}),
          ...(m.tool_call_id ? { tool_call_id: m.tool_call_id } : {}),
        })),
        temperature: req.temperature ?? 0.2,
        max_tokens: req.maxTokens,
        tools: req.tools?.map((t) => ({
          type: "function",
          function: {
            name: t.name,
            description: t.description,
            parameters: t.jsonSchema,
          },
        })),
      };
      const res = await fetchImpl(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${opts.apiKey}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`OpenAI request failed: ${res.status} ${res.statusText} ${text}`);
      }
      const json = (await res.json()) as OpenAIResponse;
      const msg = json.choices[0]?.message;
      const content = msg?.content ?? "";
      const toolCalls = msg?.tool_calls?.map((tc) => ({
        id: tc.id,
        name: tc.function.name,
        arguments: safeJson(tc.function.arguments),
      }));
      return {
        content,
        toolCalls,
        raw: json,
        provider: "openai",
        model: json.model ?? req.model,
      };
    },
  };
}

function safeJson(s: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(s);
    return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function offlineStub(
  req: LLMCompletionRequest,
  model: string,
  provider: string,
): LLMCompletionResponse {
  const last = req.messages[req.messages.length - 1];
  const preview = (last?.content ?? "").slice(0, 240);
  return {
    content:
      `[offline-stub:${provider}] No API key configured. Echoing preview of last user turn for deterministic local dev:\n` +
      preview,
    provider,
    model,
  };
}
