# ZRA_OS_AGENT

Multi-domain assistant for Zachary Robert Ancona (ZRA). High-reliability agent
that routes between legal drafting, evidence management, finance and precious-
metals math, CAD specifications, and product/catalog operations. Built in
TypeScript with a provider-agnostic LLM adapter so deterministic domain work
runs without network access and LLM fallback is available when an API key is
set.

## What it does

- **Legal** — NY Supreme Court-style demand letters, verified complaints,
  summons, preservation letters, discovery requests, caption + verification
  blocks, exhibit register, footer configuration.
- **Evidence** — timeline building with normalized absolute dates, exhibit
  register, chain-of-custody logs with validation, contradiction + duplicate
  detection.
- **Finance** — karat purity, troy-ounce / pennyweight conversions, melt value,
  COGS, gross/net margin, ROI, breakeven. Every numeric claim emits a
  `calculationAudit` entry (Inputs → Formula → Result).
- **CAD** — default mm unit, ±0.05–0.10 mm tolerances, `ANCONA_[Piece]_[Size]_v###.stl`
  file naming, manufacturability checklist.
- **Ops** — catalog normalization + diff, SKU validation, inventory valuation,
  low-stock report.
- **Structured output** — every final answer follows: TL;DR → bullets (4–6) →
  Full Draft → Next Actions → Confidence (H/M/L). Exportable to Markdown, JSON,
  or CSV.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env and add LLM_API_KEY if you want LLM fallback. Domain handlers work
# deterministically without any API key.
npm run build
npm test
```

## Environment variables

| Name | Purpose | Default |
| ---- | ------- | ------- |
| `LLM_API_KEY` | API key for the LLM provider (OpenAI-compatible). | empty |
| `LLM_MODEL` | Model name for the provider. | `gpt-4o` |
| `LLM_PROVIDER` | Provider identifier (adapter dispatch). | `openai` |
| `LLM_BASE_URL` | Override base URL for OpenAI-compatible APIs. | empty |
| `PORT` | HTTP port. | `8080` |
| `HOST` | HTTP host. | `0.0.0.0` |
| `LOG_LEVEL` | pino log level. | `info` |
| `ENABLE_MEMORY` | In-process memory tool on/off. | `false` |
| `ENABLE_WEB_SEARCH` | Enable the web-search tool stub. | `false` |
| `ENABLE_FILE_SEARCH` | Enable the local file-search tool. | `false` |
| `DEFAULT_MODE` | Default `AgentMode`. | `FULL_POWER` |
| `PRO_SE_FOOTER` | Footer appended to legal filings. | `Prepared by pro se plaintiff.` |
| `REFERENCE_DATE` | Optional reference date for relative-date normalization. | today |
| `AUTH_KEY` | If set, the HTTP server requires header `X-ZRA-KEY: <value>` on every non-/health request. | empty (auth off) |

## CLI usage

```bash
# Markdown output
npm run chat -- --mode FULL_POWER --input "Draft a demand letter..."

# JSON output with structured context (sample payloads in src/examples)
npm run chat -- --mode LEGAL \
  --input "/demand draft letter to Acme" \
  --context ./samples/demand.json \
  --format json
```

Flags: `--mode`, `--input`, `--context`, `--format {markdown|json|csv}`,
`--ref YYYY-MM-DD`.

## HTTP API

```bash
npm run serve
```

| Endpoint | Body | Returns |
| -------- | ---- | ------- |
| `POST /chat` | `{ input, mode?, context?, referenceDate? }` | `ResponsePayload` with `intent` + `plan` |
| `POST /analyze` | `{ events?, statements?, referenceDate? }` | `{ timeline, exhibitRegister, custody, contradictions, stats, warnings }` |
| `POST /export/json` | `{ payload, format? }` | JSON / Markdown / CSV of payload |
| `POST /export/csv` | `{ rows, headers? }` | CSV text |
| `GET  /health` | — | `{ ok, ts }` |

### Example requests

```bash
# Deterministic pricing (no LLM needed)
curl -s http://localhost:8080/chat -H 'content-type: application/json' -d '{
  "input": "/pricing 14K 5g band",
  "context": {
    "pricing": {
      "weight": 5, "unit": "g", "karat": 14,
      "spotPricePerTroyOz": 2350,
      "laborCost": 60, "findings": 15, "overhead": 25,
      "markup": 15
    }
  }
}'

# CAD spec
curl -s http://localhost:8080/chat -H 'content-type: application/json' -d '{
  "input": "/cad SignetRing size 10",
  "context": {
    "cad": {
      "piece": "SignetRing", "size": "10", "version": 1,
      "dimensionsMm": { "bandWidth": 4.5, "bandThickness": 1.8 },
      "alloyKarat": 14
    }
  }
}'

# Evidence: timeline + contradictions
curl -s http://localhost:8080/analyze -H 'content-type: application/json' -d '{
  "events": [
    { "id":"e1","date":"2025-10-01","source":"Invoice","summary":"Delivery","confidence":"H" },
    { "id":"e2","date":"2025-11-01","source":"Email","summary":"Dispute","confidence":"M" }
  ]
}'
```

## Macros

Global mode/meta: `/FAST`, `/DEEP`, `/EVIDENCE`, `/HEALTHCHECK`, `/DECIDE`,
`/EXPORT_JSON`, `/CSV_ROWS`, `/PY_SNIPPET`.

Legal: `/vc`, `/summons`, `/demand`, `/preserve`, `/discovery`, `/nta`, `/aos`,
`/toc`.

Finance / ops / CAD: `/pricing`, `/csv`, `/cad`.

Evidence tags: `/exhA` through `/exhL` (auto-mapped to `Exhibit A`–`Exhibit L`).

Other reserved prefixes: `/torah`, `/zohar`.

Macros can be combined: e.g. `/DEEP /EVIDENCE build timeline for Q4`.

## Architecture

```
src/
  agent/            # orchestrator, macroRouter, modeRegistry, planner, policy
  core/             # types, schemas, response formatter, chronology, contradictions
  domains/
    legal/          # demand, VC, summons, preservation, discovery + exhibit register
    finance/        # metals, karat, roi, pricing engine
    cad/            # tolerances, file naming, spec engine
    evidence/       # timeline, custody, report builder
    ops/            # catalog + inventory
  prompts/          # system prompt, mode overlays, output/legal/finance/cad/evidence rules
  providers/        # LLM adapter (openai-compatible) behind LLMProvider interface
  tools/            # calculator, web/file/pdf/memory/exporter + registry
  exporters/        # markdown, json, csv
  examples/         # sample requests for each domain
  tests/            # vitest tests
  cli.ts            # CLI entry
  server.ts         # Fastify HTTP API
  index.ts          # public exports
```

- **Orchestrator** builds a `UserIntent`, plans domain + tool steps, and either
  runs deterministic domain handlers or falls back to the LLM adapter.
- **Providers** are hidden behind `LLMProvider`. `createOpenAIProvider` works
  out of the box and returns a deterministic offline stub when no API key is
  set, so `/chat` always returns something usable in dev.
- **Tools** (`calculator`, `web_search`, `file_search`, `pdf_extract`,
  `memory_get/set`, `export_payload`) are registered in `tools/registry.ts` and
  can be invoked through the planner / LLM tool-call path.
- **Response contract** is enforced by `buildResponse` (clamps bullets to 4–6,
  defaults confidence to M, validates with zod).

## Limitations

- LLM provider adapter ships with an OpenAI-compatible client. Other providers
  require a new adapter implementing `LLMProvider`.
- `web_search`, `pdf_extract`, and `memory_store` are intentional stubs so the
  project stays dependency-light; each has a clear extension point.
- No persistent storage — `memoryStore` is in-process. Wire a durable store
  (SQLite, Redis, etc.) if you need cross-session memory.
- Legal output is drafting-style, not legal advice. Nothing is filed or served
  without explicit confirmation.
- Relative-date normalization covers the common cases (`today`, `yesterday`,
  `N days/weeks/months/years ago`, `in N …`, US and ISO formats) but is not a
  full natural-language date parser.

## Extension points

- **New domain** — add `src/domains/<name>/` + a runner branch in
  `orchestrator.ts`.
- **New macro** — add to `ALL_MACROS` in `config/constants.ts` and map it in
  `agent/macroRouter.ts` + `agent/planner.ts`.
- **New tool** — add a handler in `src/tools/`, register it in
  `tools/registry.ts`, and optionally gate with a policy in `agent/policy.ts`.
- **New provider** — implement `LLMProvider` and swap the default in
  `orchestrator.defaultProvider()`.
- **New exporter** — drop into `src/exporters/` and wire into
  `tools/exporter.ts`.

## Assumptions baked into this build

- Jewelry business is operated in New York; legal defaults target NY Supreme.
- ZRA files pro se by default; footer defaults to
  `Prepared by pro se plaintiff.` and is configurable via `PRO_SE_FOOTER`.
- Default CAD unit is mm; default tolerance is ±0.075 mm (midpoint of the
  stated ±0.05–0.10 mm band).
- Default file prefix is `ANCONA`.
- Finance results are rounded to 2 decimals unless specified otherwise;
  precious-metals constants use the exact values in the spec (1 ozt =
  31.1034768 g; 1 dwt = 1.55517384 g).
- `/torah` and `/zohar` macros are reserved channel names; they currently route
  to the general LLM path without a dedicated handler.
