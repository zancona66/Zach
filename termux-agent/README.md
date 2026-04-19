# Termux Claude Agent

A tiny interactive agent that runs on Termux with **just an Anthropic API key**.
Zero npm dependencies — uses Node 18+ built-in `fetch`. Single file: `agent.mjs`.

Built-in tools the model can call:
- `calculator` — arithmetic expressions
- `now` — current date/time
- `read_file` — read a local text file
- `write_file` — write a local text file

## Install on Termux (Android)

Open Termux and paste this once:

```bash
pkg update -y && pkg upgrade -y
pkg install -y nodejs-lts git
termux-setup-storage   # tap Allow when prompted

cd ~
git clone -b claude/zra-os-agent-build-5KFFr https://github.com/zancona66/Zach.git
cd Zach/termux-agent
```

## Add your API key

1. Get a key: https://console.anthropic.com/settings/keys
2. Copy the template and paste your key:
   ```bash
   cp .env.example .env
   nano .env
   ```
   Set:
   ```env
   ANTHROPIC_API_KEY=sk-ant-...paste-here...
   ```
   Save with `Ctrl+O`, `Enter`, `Ctrl+X`.

That's the only config required. The model defaults to `claude-opus-4-5`.

## Run it

**Interactive chat:**
```bash
node agent.mjs
```
You'll see:
```
agent ready. model=claude-opus-4-5. commands: /reset /exit
you>
```

Type a message and press Enter. The agent streams back as `assistant>`.
Slash commands inside the REPL:
- `/reset` — clear the conversation
- `/exit` — quit

**One-shot (no REPL):**
```bash
node agent.mjs "What's 5 grams of 14K gold worth at \$2,350/ozt?"
```

## Example session

```
you> what's the melt value of 10g of 18K gold at $2300/ozt? use the calculator tool.
assistant> [calls calculator: (10 * 0.75) / 31.1034768 * 2300]
assistant> At $2,300/ozt, 10 g of 18K gold contains 7.5 g of pure gold (~0.2412 troy oz), worth about $554.77 at spot.

you> what time is it in UTC?
assistant> [calls now]
assistant> It's 2026-04-17T08:30:12Z.

you> /exit
```

## Keep it running with screen off (optional)

```bash
termux-wake-lock
node agent.mjs
# Ctrl+C to stop, then:
termux-wake-unlock
```

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| `ANTHROPIC_API_KEY is not set` | You didn't save `.env`, or you put the key somewhere else. File must be `./termux-agent/.env`. |
| `Anthropic API 401` | Key is wrong / revoked. Make a new key and update `.env`. |
| `Anthropic API 429` | Rate-limited or hit your usage cap. Check https://console.anthropic.com. |
| `Anthropic API 404 model_not_found` | Change `ANTHROPIC_MODEL` in `.env` to a model you have access to (try `claude-sonnet-4-5`). |
| `node: command not found` | `pkg install nodejs-lts` then retry. |
| Phone sleeps and kills the agent | `termux-wake-lock` before running. |

## What it's **not**

This agent is intentionally minimal. It does not have web search, file search
across a tree, memory persistence across runs, streaming output, or the legal /
finance / CAD domain handlers from the sibling `../src/` project
(`ZRA_OS_AGENT`). If you need those, run the larger project — they're in the
same repo.
