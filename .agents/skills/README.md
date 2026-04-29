# Skills

## Available skill
- `zra-master-ops`
- `zra-special-ops`
- `deep-coded`
- `super-agent-code`

## When to use it
Use for ZRA operational work involving legal/evidence, jewelry CAD/manufacturing, metals-finance math, CSV/catalog cleanup, communications, or repo automation requiring chronology, traceability, validation, and small non-destructive diffs.

## When not to use it
Do not use for casual chat, generic coding unrelated to these workflows, or broad brainstorming with no concrete deliverable.

## Example prompts
1. "Build an exhibit register and chronology from these filings and flag contradictions by absolute date."
2. "Draft a manufacturable ring spec in mm with tolerances and export naming from this CAD brief."
3. "Recalculate melt value, payoff, and ROI from these mixed-unit gold weights with explicit formulas."
4. "Normalize this marketplace CSV, preserve column order, and report rows changed."
5. "Inspect this repo workflow and return a traceable validation report with assumptions and risks."
- `zra-special-ops`

## When to use it
- Use for ZRA operational tasks spanning legal/evidence, jewelry CAD/manufacturing, metals-finance math, catalog/CSV cleanup, structured business communications, or related workflow automation where chronology, traceability, and strict validation matter.

## When not to use it
- Do not use for casual chat, open-ended brainstorming, or generic coding tasks that do not require ZRA operational controls.

## Scaffold
- Path: `.agents/skills/zra-special-ops/scaffold/`
- Includes reusable templates for intake (`task-brief.md`) and verification (`validation-log.md`).

## Example prompts
1. "Build an exhibit register from these filings and flag chronology conflicts by absolute date."
2. "Draft a manufacturable ring spec in mm with tolerances and production notes from this CAD brief."
3. "Recalculate melt value, payoff, and ROI from these mixed-unit gold weights and purity assumptions."
4. "Normalize this marketplace CSV, preserve column order, and report rows added/changed/removed."
5. "Refactor this repo script and return a traceable validation report with assumptions and risks."

- `deep-coded`

## When to use it
- Depth-first coding: multi-file refactors, subtle bug hunts, architecture-sensitive features, performance or concurrency work, test hardening, and repo automation where inspection-before-editing, minimal diffs, and auditable validation matter.

## When not to use it
- Trivial one-liners, casual chat, or ZRA operational domain tasks (prefer `zra-special-ops` or `zra-master-ops`).

## Scaffold
- Path: `.agents/skills/deep-coded/scaffold/`
- Includes reusable templates for intake (`task-brief.md`) and verification (`validation-log.md`).

## Example prompts
1. "Find the root cause of this intermittent test flake and propose the smallest fix with a regression test."
2. "Refactor this module to remove the circular import without changing public behavior; run narrow tests first."
3. "Add a feature flag around this endpoint, preserve existing contract, and document the rollback path."
4. "Audit this function for race conditions under concurrent writers and propose a minimal fix."
5. "Review this diff for blast radius, drive-by changes, and tests that actually exercise the failure mode."

- `super-agent-code`

## When to use it
- Cross-domain orchestration. Use when the right sub-skill isn't obvious, when signals span multiple domains (e.g., legal + code, CAD + CSV), or when one deliverable needs sequential phases under different sub-skills. Routes to `zra-master-ops`, `zra-special-ops`, or `deep-coded` and never duplicates their domain rules.

## When not to use it
- The domain is unambiguous — invoke the matching sub-skill directly. Also skip for casual chat, brainstorming, or trivial one-liners.

## Scaffold
- Path: `.agents/skills/super-agent-code/scaffold/`
- Routing rubric: `.agents/skills/super-agent-code/ROUTING.md`
- Includes reusable templates for routing intake (`task-brief.md`) and routing audit (`validation-log.md`).

## Example prompts
1. "Refactor the exhibit-register parser to remove a circular import; preserve chronology output exactly." (routes to `deep-coded`)
2. "Build a memo tying gold-payoff figures to the supporting exhibits and flag contradictions by absolute date." (routes to `zra-special-ops`)
3. "Normalize this catalog CSV; if you find a parser bug, fix it before completing the normalization." (routes `zra-master-ops` → `deep-coded` → `zra-master-ops`)
4. "I have a task that mixes a CAD spec change with a CSV pipeline update — figure out which sub-skill owns each phase."
5. "Decide which sub-skill should run this and document the routing decision before executing."
