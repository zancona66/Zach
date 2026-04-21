---
name: zra-special-ops
description: High-rigor reusable workflow for ZRA operations spanning legal/evidence organization, jewelry CAD/manufacturing specs, precious-metals finance math, catalog data cleanup, business communications, and repo automation. Use for tasks requiring chronology, traceability, explicit validation, and non-destructive edits; do not trigger for casual chat or generic coding unrelated to these workflows.
---

# zra-special-ops

This skill extends (does not replace) repo-wide rules in `AGENTS.md`.

## Use when
- The task crosses or tightly depends on ZRA operational domains: legal/evidence, CAD/manufacturing, metals finance, catalog data, structured business comms, or workflow automation.
- Output quality requires chronological integrity, source traceability, math verification, and auditable validation.

## Do not use when
- Casual conversation or brainstorming with no repository/workflow deliverable.
- Generic coding tasks that do not involve ZRA operational controls.

## Scaffold
- Reusable templates: `.agents/skills/zra-special-ops/scaffold/task-brief.md` and `.agents/skills/zra-special-ops/scaffold/validation-log.md`.

## Core operating principles
1. Decide and proceed unless blocked by missing credentials/files or destructive external side effects.
2. Inspect workspace conventions before introducing new patterns.
3. Keep facts, user statements, assumptions, and inferences separate.
4. Prefer absolute dates in timelines and evidence summaries.
5. Show nontrivial math as **Inputs -> Formula -> Result**.
6. Edit non-destructively with recoverable versions and small diffs.
7. Validate before completion; disclose any skipped validation.
8. Do not fabricate facts, figures, citations, or outputs.

## Domain modules
### Legal / evidence
- Preserve chronology and source-to-claim mapping.
- Flag contradictions, missing exhibits, duplicate claims, and open gaps.

### Jewelry CAD / manufacturing
- Default units: millimeters.
- Target tolerance: +/- 0.05 to 0.10 mm unless overridden.
- Include manufacturability constraints, dimensions, clearances, thickness, material assumptions.

### Metals finance
- Default constants:
  - `1 troy ounce = 31.1034768 grams`
  - `1 dwt = 1.55517384 grams`
- Distinguish gross weight, fine weight, melt value, financed value, payoff, margin, ROI.
- Flag unit drift and rounding sensitivity.

### Catalog / CSV
- Validate structured outputs, preserve required column order, and never silently drop rows.
- Report rows added/changed/removed plus invalid or inferred fields.

### Business communications
- Tone: calm, precise, assertive.
- Make the ask explicit and tie statements to supporting facts.

## Execution sequence
1. Inspect relevant files/schemas/examples.
2. Plan minimal coherent change + validations.
3. Execute durable fix with smallest practical diff.
4. Verify via tests/checks/recalculations.
5. Report files changed, validations, assumptions, and risks.
