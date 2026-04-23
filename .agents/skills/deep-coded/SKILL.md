---
name: deep-coded
description: High-rigor deep coding agent for nontrivial software changes — multi-file refactors, subtle bug hunts, architecture-sensitive features, performance and concurrency work, test-hardening, and repo automation that demands inspection before editing, minimal reviewable diffs, explicit assumption tracking, and auditable validation. Use when coding requires depth, traceability, and care. Do not use for trivial one-liners, casual chat, or brainstorming without a code deliverable.
---

# deep-coded

A depth-first coding operating skill. This skill extends (does not replace) repo-wide rules in `AGENTS.md`.

## Use when
Use this skill when the task involves one or more of:
- multi-file refactors or API surface changes
- subtle or intermittent bugs requiring root-cause analysis
- architecture-sensitive features (data model, boundaries, invariants)
- performance, memory, or concurrency work
- test hardening, flake reduction, or coverage of real failure modes
- repo automation, build/CI scripting, or migration tooling
- code review with actionable, minimal-diff suggestions

## Do not use when
- The change is a trivial one-liner with no ambiguity.
- The task is casual chat or open-ended brainstorming with no code deliverable.
- The task belongs to a ZRA operational domain — prefer `zra-special-ops` or `zra-master-ops`.

## Required controls
1. Read before writing. Never edit a file you have not inspected.
2. Separate facts, user statements, assumptions, and inferences in any analysis.
3. Prefer the smallest correct diff that fully resolves the task.
4. Do not fabricate file contents, symbols, test output, or command results.
5. Respect existing conventions (naming, layout, formatting, dependency choices).
6. Ask before destructive or irreversible actions (force push, schema drops, mass deletes).
7. Run the narrowest meaningful validation before declaring done.

## Core execution sequence
For every deep coding task, follow this order unless blocked.

### 1. Inspect
- Read the directly relevant files and their immediate collaborators.
- Map entry points, call sites, public APIs, and tests touching the change area.
- Identify conventions: module layout, error handling, logging, typing, test framework.
- Search for prior art before creating new files.

### 2. Classify
- Domain(s): refactor | bugfix | feature | performance | concurrency | tests | tooling | review.
- Risk level: low | medium | high (based on blast radius, reversibility, shared state).
- Blast radius: local | module | package | repo | external (API/DB/contract).

### 3. Plan
- State the smallest coherent plan.
- List invariants to preserve and edges that must still pass.
- Decide validation (unit, integration, lint, type, build, manual) before editing.
- Surface assumptions that would change the plan if wrong.

### 4. Execute
- Make minimal, reviewable edits.
- Keep each change coherent; avoid opportunistic cleanup unrelated to the task.
- Prefer pure functions, narrow interfaces, and clear boundaries over abstractions.
- Do not add comments that restate the code; only encode nonobvious WHY.

### 5. Validate
- Run the narrowest relevant checks first (the tests or types that could catch this).
- Broaden only if the narrow pass is insufficient.
- For perf/concurrency, describe the failure mode the check actually exercises.
- If validation cannot run, state exactly why and what a reviewer should run.

### 6. Report
Return:
- TL;DR (one or two sentences)
- Findings (what was true before the change)
- Work performed (grouped by file or concern)
- Files changed
- Validation (commands, outcomes, what they prove)
- Risks / unresolved gaps
- Next actions (if any)
- Confidence (low | medium | high)

## Code quality rules

### Diff discipline
- No drive-by formatting changes.
- No dead code, no commented-out code, no `TODO` left as the final state.
- No speculative abstractions for a single call site.
- Remove a thing completely rather than leaving a stub when you know it is unused.

### Error handling
- Handle errors at the boundary where you can act on them.
- Do not swallow errors silently; do not wrap in try/except to hide failures.
- Do not invent fallback behavior for conditions that cannot occur.

### Tests
- Prefer tests that would have caught the bug or regression.
- Avoid tests that assert implementation details unrelated to behavior.
- Deterministic first; quarantine flakes explicitly rather than hiding them.

### Comments and naming
- Default to no comments. Add one only when WHY is nonobvious.
- Never narrate WHAT the code does; let names do that work.
- Do not reference tasks, tickets, authors, or "added for" context in code.

### Performance and concurrency
- Measure before optimizing; state baseline and target.
- Call out allocations, locks, IO, and async boundaries when relevant.
- Note invariants that protect against races or data corruption.

## Security and safety rules
- Treat all external input as untrusted; validate at the boundary.
- Avoid command injection, path traversal, SQL injection, XSS, SSRF patterns.
- Never commit secrets, tokens, or credentials; never widen permissions silently.
- For dependency additions, justify the choice and note supply-chain considerations.

## Destructive actions
Ask before:
- deleting files outside the immediate scope
- rewriting history, force-push, or amending published commits
- dropping tables, migrations that are not reversible, or schema-level changes
- changing CI, release, or permission configuration
- modifying secrets or credentials

## File placement rules
- repo-wide policy: `AGENTS.md`
- skill docs: `.agents/skills/deep-coded/`
- reusable templates: `.agents/skills/deep-coded/scaffold/`
- task runs: `.agents/runs/YYYY-MM-DD-<task-name>/`

## Completion checklist
- [ ] Relevant files and collaborators inspected
- [ ] Domain, risk, and blast radius classified
- [ ] Assumptions surfaced and separated from facts
- [ ] Smallest correct diff applied; no drive-by changes
- [ ] Narrow validation run (or explicitly justified if unavailable)
- [ ] Files changed listed
- [ ] Risks and unresolved gaps documented
- [ ] Confidence stated
