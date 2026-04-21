# Task Brief

## Request
- Objective: Establish and validate a repo-standard workflow for CAD specifications.
- Requested deliverable(s): Benchmark run folder with filled brief/log, CAD consistency findings, and smallest safe standards updates.
- Deadline (absolute date): 2026-04-20.

## Inputs and sources
- Source file(s):
  - `AGENTS.md`
  - `.agents/skills/README.md`
  - `.agents/skills/zra-master-ops/SKILL.md`
  - `.agents/skills/zra-master-ops/scaffold/task-brief.md`
  - `.agents/skills/zra-master-ops/scaffold/validation-log.md`
  - `.agents/skills/zra-special-ops/SKILL.md`
  - `.agents/skills/zra-special-ops/scaffold/task-brief.md`
  - `.agents/skills/zra-special-ops/scaffold/validation-log.md`
- External reference(s): none.

## Traceability split
- Facts: Repo contains policy/skill/scaffold markdown; no standalone CAD spec files found outside skill docs.
- User statements: Scope requires CAD specs, dimensions, tolerances, STL/OBJ naming, production notes, and manufacturing standards.
- Assumptions: CAD consistency hardening should be applied to existing skill docs and one new checklist file if missing.
- Inferences: A concise CAD standards file is needed because no dedicated CAD checklist existed.

## Constraints
- Domain(s): CAD/manufacturing (benchmark), with traceability/validation requirements.
- Units: millimeters for CAD dimensions and tolerances where applicable.
- Validation requirements: Confirm file presence, inspect CAD-related wording consistency, and log commands/results.
- Non-destructive requirements: Smallest safe diffs only; no file deletions.
- Scope boundaries: Documentation, templates, and standards only; no CAD model geometry changes.

## Planned outputs
- Files to create:
  - `.agents/runs/2026-04-20-cad-benchmark/task-brief.md`
  - `.agents/runs/2026-04-20-cad-benchmark/validation-log.md`
  - `.agents/standards/CAD_CHECKLIST.md`
- Files to update:
  - `.agents/skills/zra-master-ops/SKILL.md`
- Files not to touch:
  - Source code or production runtime files (none present in this repo).
- Non-destructive requirements: Smallest safe diffs only; no file deletions.
- Validation requirements: Confirm file presence, inspect CAD-related wording consistency, and log commands/results.
