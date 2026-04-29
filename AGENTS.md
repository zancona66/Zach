# AGENTS

Repo-wide policy for all tasks in this repository.

## Core rules
1. Keep changes small, reviewable, and non-destructive.
2. Preserve chronology and traceability; use absolute dates where possible.
3. Separate: facts, user statements, assumptions, and inferences.
4. For nontrivial math, always show: **Inputs -> Formula -> Result**.
5. Run the narrowest relevant validation before completion.
6. Do not fabricate facts, file contents, citations, figures, or test outcomes.
7. Ask before destructive or irreversible actions.

## Skills
- Use `.agents/skills/zra-special-ops/SKILL.md` as the all-around ZRA operations agent for:
  legal/evidence/chronology, precious-metals finance, CSV/catalog cleanup,
  business communications, document/source analysis, and repo automation/validation.
- Use `.agents/skills/super-agent-code/SKILL.md` as the cross-domain router when the right
  sub-skill is not obvious or a task spans multiple domains. Prefer direct sub-skill use
  (`zra-master-ops`, `zra-special-ops`, `deep-coded`) when the domain is unambiguous.
- Keep domain workflow details in skill files; keep this file short, repo-wide, and non-domain-specific.
