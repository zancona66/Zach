# Task Brief — super-agent-code (bootstrap run)

## Request
- Skill scope anchor: `super-agent-code` is the cross-domain orchestrator.
- Objective: Add a new sibling skill at `.agents/skills/super-agent-code/` that orchestrates routing across `zra-master-ops`, `zra-special-ops`, and `deep-coded`, plus a routing rubric, scaffold templates, and index updates.
- Requested deliverable(s):
  - `.agents/skills/super-agent-code/SKILL.md`
  - `.agents/skills/super-agent-code/ROUTING.md`
  - `.agents/skills/super-agent-code/scaffold/{README,task-brief,validation-log}.md`
  - `.agents/runs/2026-04-29-super-agent-code-bootstrap/{task-brief,validation-log}.md`
  - Index updates to `README.md`, `.agents/skills/README.md`, `AGENTS.md`
- Deadline (absolute date, YYYY-MM-DD): 2026-04-29

## Routing decision
- Chosen sub-skill: `deep-coded`
- Signals matched (cite ROUTING.md rows):
  - "repo automation, CI script, build tooling, migration tooling" → `deep-coded`
  - "docs/markdown scaffold change inside `.agents/`" → `deep-coded`
- Alternatives considered: `zra-master-ops` (rejected: no legal/CAD/finance/CSV/comms content); `zra-special-ops` (rejected: no chronology or evidence-finance crossover).
- Why rejected: this is a markdown repo-automation change, not a ZRA operational deliverable.
- Tie-breaker applied (if any): none — single dominant signal.
- Multi-phase plan? no — single phase under `deep-coded`.

## Sub-skill scaffold pointer
- Sub-skill scaffold to copy alongside this brief: `.agents/skills/deep-coded/scaffold/`
- Active sub-skill brief filename in this run folder: `task-brief.md` (this file doubles as the orchestrator brief; a separate `deep-coded` brief is not needed for a single-phase docs change of this scope).
- Active sub-skill validation-log filename in this run folder: `validation-log.md`

## Inputs and sources
- Source file(s):
  - `AGENTS.md`
  - `README.md`
  - `.agents/skills/README.md`
  - `.agents/skills/zra-master-ops/SKILL.md`
  - `.agents/skills/zra-special-ops/SKILL.md`
  - `.agents/skills/deep-coded/SKILL.md`
  - `.agents/skills/deep-coded/scaffold/{README,task-brief,validation-log}.md`
- Relevant modules / packages / exhibits / CSVs: n/a (docs-only)
- External reference(s): branch `claude/super-agent-code-sFYPw`

## Traceability split
- Facts:
  - Three sibling skills exist with the same shape (`SKILL.md` + `scaffold/`).
  - `AGENTS.md` is short and non-domain-specific by design.
- User statements:
  - "make me a super agen code"
  - Selected: cross-domain orchestrator + SKILL.md + scaffold + README/index updates + AGENTS.md update + "everything you recommend".
- Assumptions:
  - "everything you recommend" covers both the routing rubric (`ROUTING.md`) and an example run folder.
  - Single-phase `deep-coded` execution is acceptable for this docs-only bootstrap.
- Inferences:
  - The orchestrator should not duplicate domain rules; instead link to sub-skills.

## Constraints
- Skill preservation check: confirmed — `super-agent-code` performed routing; `deep-coded` is the active sub-skill.
- Non-destructive requirements: do not edit existing skill files; do not edit `LICENSE` or `.gitignore`.
- Security / secrets constraints: n/a
- Scope boundaries (out of scope): code, scripts, CI, tests; modifications to the three existing skills.

## Rollback plan
- How to revert if the change is wrong: `git revert` the commit on branch `claude/super-agent-code-sFYPw`; the new files are additive and the index edits are localized.
- Re-route trigger: any signal that the work needs ZRA chronology/finance/CAD rules (would push to `zra-special-ops` or `zra-master-ops`).
- Observability / signal to watch after merge or delivery: real tasks invoking `super-agent-code` and whether their routing audits come back `pass`.
