# Task Brief

## Request
- Objective: Establish the first deep all-around benchmark run and implement one highest-value non-destructive improvement.
- Requested deliverable(s): Benchmark artifacts plus one minimal, high-impact repo improvement.
- Deadline (absolute date): 2026-04-21.

## Inputs and sources
- Source file(s):
  - `AGENTS.md`
  - `README.md`
  - `.agents/skills/README.md`
  - `.agents/skills/zra-special-ops/SKILL.md`
  - `.agents/skills/zra-special-ops/scaffold/task-brief.md`
  - `.agents/skills/zra-special-ops/scaffold/validation-log.md`
  - `.agents/runs/2026-04-20-cad-benchmark/task-brief.md`
  - `.agents/runs/2026-04-20-cad-benchmark/validation-log.md`
- External reference(s): none.

## Workflow phase checkpoints
### Inspect
- Relevant files/patterns inspected: existing skill docs, scaffold templates, and prior benchmark artifacts.
- Chronology dependencies found: benchmark runs are date-stamped under `.agents/runs/YYYY-MM-DD-<task-name>/`.

### Classify
- Domain(s): legal/evidence chronology, finance/math rigor, communications structure, workflow governance.
- Risk level: low (documentation-only change).

### Plan
- Smallest coherent diff: tighten zra-special-ops scaffold templates to enforce inspect->classify->plan->execute->validate->report and explicit traceability split.
- Validation plan (narrowest first): file presence checks, targeted content checks for required sections.

### Execute
- Apply minimal documentation-only updates to special-ops scaffolds and benchmark artifacts.

### Validate
- Run heading checks, file existence checks, and anti-drift skill-reference checks.

### Report
- Return TL;DR, findings, files changed, validations, risks/unresolved gaps, and confidence.

## Traceability split
- Facts:
  - Repository is primarily policy/skill/scaffold markdown with one prior benchmark run on 2026-04-20.
  - Existing zra-special-ops scaffold templates are minimal and do not explicitly enforce full workflow-phase tracking.
- User statements:
  - Run first deep benchmark run and harden scaffold templates while preserving zra-special-ops as the master all-around ZRA operations skill.
  - Create run artifacts at `.agents/runs/2026-04-21-master-benchmark/`.
  - Choose one highest-value non-destructive improvement with small diff and structured reporting.
- Assumptions:
  - In a policy-first repo, improving reusable benchmark scaffolds has higher leverage than one-off content tweaks.
  - The most valuable improvement is one that increases consistency across future runs.
- Inferences:
  - Strengthening scaffold templates improves chronology, traceability, governance, validation discipline, and communication quality across all domains.

## Improvement selection math
- Inputs:
  - Option A: Update zra-special-ops scaffold templates (impact 5, effort 1)
  - Option B: Add new standalone benchmark policy file (impact 3, effort 2)
  - Option C: Add domain-specific finance example doc (impact 2, effort 2)
- Formula:
  - Impact-to-diff ratio = impact / effort
- Result:
  - Option A = 5 / 1 = 5.0
  - Option B = 3 / 2 = 1.5
  - Option C = 2 / 2 = 1.0
  - Chosen: Option A (highest ratio).

## Constraints
- Non-destructive requirements: no deletions, no rewrites outside targeted templates and run artifacts.
- Validation requirements: confirm required sections are present; log commands and outputs.
- Scope boundaries: documentation/workflow governance only.
- Preservation requirement: keep `zra-special-ops` designated as master all-around skill.

## Planned outputs
- Files to create:
  - `.agents/runs/2026-04-21-master-benchmark/task-brief.md`
  - `.agents/runs/2026-04-21-master-benchmark/validation-log.md`
- Files to update:
  - `.agents/skills/zra-special-ops/scaffold/task-brief.md`
  - `.agents/skills/zra-special-ops/scaffold/validation-log.md`
- Files not to touch:
  - runtime/source code files (none present).
