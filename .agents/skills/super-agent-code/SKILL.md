---
name: super-agent-code
description: Cross-domain orchestrator skill that routes a task to the strongest sub-skill in this repo (`zra-master-ops`, `zra-special-ops`, or `deep-coded`) instead of duplicating their rules. Use when a task spans multiple domains, when the right sub-skill is not obvious from the prompt alone, or when a single deliverable requires deep coding plus ZRA operational rigor. Do not use when the domain is unambiguous — invoke the matching sub-skill directly.
---

# super-agent-code

A cross-domain orchestrator. This skill extends (does not replace) repo-wide rules in `AGENTS.md` and delegates all domain rigor to one of the existing sub-skills.

## Use when
- The task signal is mixed: e.g., legal exhibits that require code automation, or CAD specs that need a CSV pipeline.
- The right sub-skill is genuinely unclear after reading the prompt.
- The deliverable needs more than one sub-skill in sequence (route → handoff → route).
- A user explicitly invokes `super-agent-code` for routing oversight.

## Do not use when
- The domain is unambiguous. Invoke the sub-skill directly:
  - Legal/evidence/finance/CAD/CSV/comms → `zra-master-ops` or `zra-special-ops`.
  - Multi-file refactor, subtle bug, performance, concurrency, test hardening → `deep-coded`.
- The task is casual chat, brainstorming with no deliverable, or trivial one-liners.

## Required controls
This skill inherits all controls from `AGENTS.md` and from the chosen sub-skill. It adds:
1. **Read before routing.** Inspect the user request and any referenced files before picking a sub-skill.
2. **Single active sub-skill at a time.** Never blend rules from two sub-skills in one execution; if a handoff is needed, finish phase one cleanly first.
3. **Document the routing decision.** Record the chosen sub-skill, signals matched, and rejected alternatives in the task-brief before executing.
4. **No duplication.** Do not restate sub-skill rules; link to them.
5. **Ask before destructive or irreversible actions** (per `AGENTS.md`).

## Routing decision sequence
For every task:

### 1. Detect
- Read the prompt and any explicitly referenced files.
- Extract signal tokens: domain words (legal, exhibit, CAD, mm, troy oz, CSV, payoff), action words (refactor, race, flake, benchmark), and risk words (force-push, drop, migrate, delete).

### 2. Classify
- Map signals to candidate sub-skills using `ROUTING.md` in this folder.
- Tag risk level (low | medium | high) and blast radius (local | module | package | repo | external).
- Separate facts, user statements, assumptions, and inferences.

### 3. Delegate
- Choose exactly one sub-skill for the active phase.
- Copy that sub-skill's scaffold (`task-brief.md`, `validation-log.md`) into a run folder under `.agents/runs/YYYY-MM-DD-<task-name>/`.
- Add a top-of-brief note that `super-agent-code` performed routing, with the decision rationale.

### 4. Execute (in the sub-skill)
- Hand control to the chosen sub-skill. Follow its execution sequence verbatim.
- Do not re-enter `super-agent-code` mid-execution unless a new domain signal forces a re-route.

### 5. Aggregate (if multi-phase)
- After phase one finishes and reports out, decide whether a second phase is needed in a different sub-skill.
- Each phase gets its own brief + validation log.

### 6. Validate
- Run the narrowest sub-skill validation first.
- Add a routing audit: in hindsight, was the chosen sub-skill correct? If not, log why and what would have caught it earlier.

### 7. Report
Return:
- TL;DR
- Routing decision (chosen sub-skill, signals, alternatives rejected)
- Findings
- Work performed (grouped by phase if multi-phase)
- Files changed
- Validation (sub-skill checks + routing audit)
- Risks / unresolved gaps
- Next actions
- Confidence (low | medium | high)

## Sub-skill catalog
- [`zra-master-ops`](../zra-master-ops/SKILL.md) — all-around ZRA operating skill (legal, CAD, metals finance, CSV, comms, repo automation).
- [`zra-special-ops`](../zra-special-ops/SKILL.md) — master multi-domain ZRA agent for chronology-heavy or evidence-finance crossover work.
- [`deep-coded`](../deep-coded/SKILL.md) — depth-first coding skill for multi-file refactors, subtle bugs, performance/concurrency, test hardening.

See `ROUTING.md` for the signals → skill rubric and worked examples.

## Escalation and handoff rules
- **Mid-task signal flip.** If new evidence shifts the task into a different domain (e.g., a "refactor" task reveals an evidence-chronology gap), pause, log a re-route in the validation log, write a fresh brief for the new sub-skill, and continue.
- **Conflicting signals.** When two domains tie, prefer the sub-skill whose required controls are strictest for the dominant risk: legal/finance accuracy → `zra-special-ops`; code correctness/concurrency → `deep-coded`; mixed business operations → `zra-master-ops`.
- **Non-coverage.** If no sub-skill fits, stop and ask the user. Do not invent rules.

## Destructive-action gate
Inherits `AGENTS.md` core rule 7: ask before destructive or irreversible actions. The orchestrator never relaxes a sub-skill's destructive-action gate; it may only add gates, never remove them.

## File placement rules
- Repo-wide policy: `AGENTS.md`
- Skill docs: `.agents/skills/super-agent-code/`
- Routing rubric: `.agents/skills/super-agent-code/ROUTING.md`
- Reusable templates: `.agents/skills/super-agent-code/scaffold/`
- Task runs: `.agents/runs/YYYY-MM-DD-<task-name>/`

## Completion checklist
- [ ] Routing decision recorded in the task-brief
- [ ] Exactly one active sub-skill per phase
- [ ] Sub-skill's own completion checklist satisfied
- [ ] Routing audit recorded in the validation log
- [ ] Multi-phase handoffs (if any) each have their own brief + log
- [ ] Risks and unresolved gaps documented
- [ ] Confidence stated
