---
name: zra-master-ops
description: High-rigor all-around operating skill for ZRA workflows across legal/evidence, jewelry CAD/manufacturing, precious-metals finance, catalog/CSV cleanup, business communications, structured repo automation, chronology-sensitive analysis, and validation-heavy operational work. Use when the task requires traceability, explicit math verification, careful repo inspection, minimal diffs, and auditable outputs. Do not use for casual chat, open-ended brainstorming, or generic coding unrelated to these workflows.
---

# zra-master-ops

This skill extends (does not replace) repo-wide rules in `AGENTS.md`.

## Use when
Use this skill when the task involves one or more of:
- legal chronology, evidence organization, exhibit logic, contradiction checks
- jewelry CAD/manufacturing specs, tolerances, naming standards, production notes
- precious-metals math, mixed-unit conversions, melt/payoff/ROI calculations
- catalog / CSV / structured data normalization and validation
- business communication drafts tied to facts, calculations, or repo artifacts
- repo workflows where traceability, validation, and non-destructive editing matter

## Do not use when
Do not use this skill for:
- casual chat
- vague brainstorming with no repo or workflow deliverable
- generic coding tasks unrelated to ZRA operational controls
- destructive cleanup without explicit approval
- speculative outputs without source grounding

## Core execution sequence
For every task, follow this order unless blocked:

1. Inspect
- Read relevant files first
- Identify naming patterns, schemas, conventions, dependencies, and scope boundaries
- Search for prior related files before creating new ones

2. Classify
- Determine which domain(s) apply:
  - legal/evidence
  - CAD/manufacturing
  - finance/metals
  - catalog/data
  - communications
  - automation/repo maintenance

3. Plan
- State the smallest safe plan internally
- Prefer a narrow, reversible path
- Avoid repo-wide rewrites

4. Execute
- Make the minimum coherent set of changes needed
- Preserve recoverability and clarity
- Reuse existing structure where possible

5. Validate
- Run the narrowest relevant validation
- If validation cannot be run, state exactly why

6. Report
Return:
- TL;DR
- Findings
- Work performed
- Files changed
- Validation
- Risks / unresolved gaps
- Next actions
- Confidence

## Traceability rules
Always separate:
- Facts
- User statements
- Assumptions
- Inferences

When working on timelines, legal summaries, or operational logs:
- preserve chronology
- prefer absolute dates
- flag contradictions
- identify missing support
- avoid blending speculation into factual summaries

## Math rules
For any nontrivial math:
- show Inputs -> Formula -> Result
- write units explicitly
- flag unit drift, rounding sensitivity, or mixed-basis assumptions
- recheck totals before finalizing

### Default metals constants
Unless the task explicitly overrides them:
- 1 troy ounce = 31.1034768 grams
- 1 dwt = 1.55517384 grams

## Domain modules

### Legal / evidence
When handling legal or evidence work:
- preserve chronology
- flag contradiction, duplication, drift, and missing exhibits
- maintain source-to-claim traceability
- distinguish fact from legal analysis
- prefer structured registers, timelines, and support mapping

### Jewelry CAD / manufacturing
When handling CAD/manufacturing work:
- default units: millimeters
- default tolerance target: ±0.05 to ±0.10 mm unless overridden
- include manufacturability concerns where relevant:
  - thickness
  - clearances
  - stone seats
  - casting considerations
  - export naming
- default export naming:
  - `ANCONA_[Piece]_[Size]_v###.stl`
  - `ANCONA_[Piece]_[Size]_v###.obj`

### Finance / precious metals
When handling metals finance:
- distinguish gross weight, fine weight, purity basis, melt value, financed value, payoff, margin, and ROI
- clearly label whether assumptions are based on spot, melt, ticket, payoff, or resale
- never silently convert units

### Catalog / CSV / structured data
When handling CSV/structured data:
- preserve required column order
- do not silently drop rows
- report rows added / changed / removed
- validate formatting where possible
- prefer normalization over creative rewriting

### Business communications
When drafting messages:
- tone = calm, precise, assertive, professional
- keep asks explicit
- tie statements to supportable facts
- avoid fluff and vague language

### Repo automation / code
When editing scripts or automation:
- inspect existing structure first
- follow local conventions
- add the smallest useful change
- avoid unnecessary dependencies
- provide usage notes if a new script is added

## File placement rules
- repo-wide policy: `AGENTS.md`
- skill docs: `.agents/skills/zra-master-ops/`
- reusable templates: `.agents/skills/zra-master-ops/scaffold/`
- benchmark runs: `.agents/runs/YYYY-MM-DD-<task-name>/`

## Destructive actions
Ask before:
- deleting multiple files
- replacing established structures repo-wide
- force-pushing
- changing secrets or credentials
- irreversible external effects

## Done criteria
A task is not done until:
- the requested deliverable exists
- relevant files were inspected
- assumptions are identified
- validation ran or was explicitly skipped with reason
- changed files are listed
- risks / unresolved gaps are surfaced
- confidence is stated
