# Routing rubric

The orchestrator (`super-agent-code`) uses this table to pick exactly one sub-skill per phase. Match on dominant signal first; if signals conflict, fall through to the tie-breakers below.

## Signal table

| Signal tokens in the prompt or sources                                                                        | Recommended sub-skill | Why                                                                 |
| ------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------- |
| filings, exhibits, chronology, contradiction, evidence register, source-to-claim                              | `zra-special-ops`     | Multi-domain ZRA with strict chronology and evidence rules          |
| melt, payoff, ROI, troy oz, dwt, fine weight, mixed-unit, spot price                                          | `zra-master-ops`      | Metals finance math + unit-discipline rules                         |
| CAD, mm, tolerance, ring spec, casting, stone seat, export naming                                             | `zra-master-ops`      | Jewelry CAD/manufacturing module lives here                         |
| CSV, catalog, normalize, column order, rows added/changed/removed                                             | `zra-master-ops`      | Catalog/structured-data rules + reporting format                    |
| business message, tone, asks, calm/precise/assertive draft                                                    | `zra-master-ops`      | Communications module                                               |
| filings + finance crossover (e.g., evidence-finance memo)                                                     | `zra-special-ops`     | Designed for multi-domain ZRA crossover work                        |
| multi-file refactor, API surface change, public interface                                                     | `deep-coded`          | Diff-discipline + inspection-before-edit                            |
| race condition, concurrency, lock, async boundary, intermittent                                               | `deep-coded`          | Concurrency rules + failure-mode-driven validation                  |
| performance, allocation, hot path, baseline vs target                                                         | `deep-coded`          | Measure-before-optimizing rule                                      |
| flaky test, regression test, coverage of failure mode                                                         | `deep-coded`          | Test-hardening guidance                                             |
| repo automation, CI script, build tooling, migration tooling                                                  | `deep-coded`          | Repo automation falls under depth-first coding controls             |
| code review with actionable diff suggestions                                                                  | `deep-coded`          | Review checklist (blast radius, drive-by changes, real failure mode) |
| docs/markdown scaffold change inside `.agents/`                                                               | `deep-coded`          | Treat the scaffold as repo automation                               |

## Tie-breakers
Apply in order until one fires:

1. **Dominant risk wins.**
   - Legal/finance accuracy at risk → `zra-special-ops`.
   - Code correctness/concurrency at risk → `deep-coded`.
   - Mixed business operations (CSV + comms + light automation) → `zra-master-ops`.

2. **Reversibility wins.** If one candidate's required controls include a stricter destructive-action gate for this task, prefer it.

3. **Strictest controls win.** If still tied, prefer the sub-skill with the narrower validation ladder (the one most likely to catch silent failure).

4. **Ask the user.** If none of the above resolve the tie, stop and ask. Do not invent a hybrid skill.

## Worked examples

### Example 1 — code refactor with evidence side-effects
**Prompt:** "Refactor the exhibit-register parser to remove a circular import; preserve chronology output exactly."
- Dominant signal: refactor + circular import → `deep-coded`.
- Secondary signal: chronology output preservation → covered by `deep-coded` invariant-preservation rule, no second phase needed.
- **Route:** `deep-coded` (single phase).

### Example 2 — evidence + finance crossover
**Prompt:** "Build a memo tying gold-payoff figures to the exhibits supporting them, flag contradictions by absolute date."
- Dominant signal: filings + finance crossover → `zra-special-ops`.
- No code change needed; do not split phases.
- **Route:** `zra-special-ops` (single phase).

### Example 3 — CSV cleanup that uncovers a parser bug
**Prompt:** "Normalize this catalog CSV; reuse the existing parser if it works."
- Phase 1 signal: CSV normalize, preserve column order → `zra-master-ops`.
- If during phase 1 the parser is found to drop rows under a specific input shape, re-route phase 2 to `deep-coded` for the bug fix, then return to `zra-master-ops` to finish the normalization deliverable.
- **Route:** `zra-master-ops` → `deep-coded` → `zra-master-ops` (three phases, three briefs).

### Example 4 — bootstrapping this skill
**Prompt:** "Add a new orchestrator skill under `.agents/skills/`."
- Dominant signal: docs/markdown scaffold inside `.agents/` (repo automation) → `deep-coded`.
- **Route:** `deep-coded` (single phase). See the example run at `.agents/runs/2026-04-29-super-agent-code-bootstrap/`.
