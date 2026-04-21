# AGENTS

Repository-wide operating rules for all tasks.

## Mission
This repository is operated under a high-rigor workflow for multi-domain work including:
- legal / evidence organization
- jewelry CAD / manufacturing specifications
- precious-metals finance and calculations
- catalog / CSV / structured data cleanup
- business communications
- repo automation and validation

## Repo-wide rules
1. Keep changes small, reviewable, and non-destructive.
2. Inspect existing files, naming conventions, docs, and schemas before editing.
3. Preserve chronology and traceability in all workflow outputs.
4. Separate:
   - facts
   - user statements
   - assumptions
   - inferences
5. Use absolute dates where possible.
6. Verify nontrivial math explicitly:
   Inputs -> Formula -> Result
7. Run the narrowest relevant validation before completion.
8. Do not fabricate facts, file contents, citations, figures, or test outcomes.
9. Prefer minimal diffs over broad rewrites.
10. Ask before destructive or irreversible actions.

## Skill structure
- Keep repo-wide policy here.
- Keep domain behavior in skill files under `.agents/skills/<skill-name>/SKILL.md`.
- Reusable task templates live under skill scaffold folders.
- Benchmark / run records live under `.agents/runs/`.

## Default completion format
Return:
- TL;DR
- Findings
- Work performed
- Files changed
- Validation
- Risks / unresolved gaps
- Next actions
- Confidence
Repository-wide rules for all tasks.

## Repo-wide operating rules
1. Keep changes small, reviewable, and non-destructive.
2. Preserve chronology and traceability in all workflow outputs.
3. Verify nontrivial math explicitly (Inputs -> Formula -> Result).
4. Run the narrowest relevant validation before completion.
5. Do not fabricate facts, file contents, or test outcomes.

## Skill structure
- Keep repo-wide policy here; keep domain behavior in skill files.
- Skills live under `.agents/skills/<skill-name>/SKILL.md`.
- Use `.agents/skills/zra-special-ops/SKILL.md` for ZRA operational workflows requiring domain controls.
- Reusable templates live under `.agents/skills/zra-special-ops/scaffold/`.
- For tasks outside skill scope, follow only these repo-wide rules.
