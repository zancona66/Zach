# AGENTS

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
