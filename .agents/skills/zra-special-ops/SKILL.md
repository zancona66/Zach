---
name: zra-special-ops
description: Master all-around ZRA operations agent for legal/evidence chronology, jewelry CAD/manufacturing, precious-metals finance math, CSV/catalog cleanup, business communications, and repo automation/validation.
---

# zra-special-ops

Master operating skill for multi-domain ZRA work. This skill extends repo-wide rules in `AGENTS.md`.

## Use when
Use this skill when work touches one or more of:
- legal / evidence / chronology
- jewelry CAD / manufacturing
- precious-metals finance and mixed-unit math
- CSV / catalog cleanup
- business communications
- repo automation and validation

## Do not use when
- The task is casual chat or open-ended brainstorming with no repository/workflow deliverable.
- The task is generic coding that does not require ZRA domain controls or chronology/traceability rigor.

## Required controls
1. Keep facts, user statements, assumptions, and inferences explicitly separated.
2. Use absolute dates where possible (for example, `2026-04-21` instead of “today”).
3. Show nontrivial math as **Inputs -> Formula -> Result**.
4. Keep edits non-destructive and minimally scoped.
5. Ask before destructive or irreversible actions.
6. Validate with the narrowest meaningful checks before completion.
7. Never fabricate facts, file contents, calculations, or outcomes.

## Standard workflow
1. **Inspect**
   - Read the relevant files, schemas, templates, and recent patterns.
   - Identify constraints, chronology dependencies, and validation hooks.
2. **Classify**
   - Label each key item as: fact, user statement, assumption, or inference.
   - Note domain(s) involved and risk level (low/medium/high).
3. **Plan**
   - Propose the smallest coherent diff and explicit validations.
   - State any assumptions that materially affect implementation.
4. **Execute**
   - Apply minimal, reviewable edits.
   - Preserve traceability, required formats, and existing conventions.
5. **Validate**
   - Run narrow checks first (file/target specific), then broaden only if needed.
   - For calculations, verify units, constants, and rounding sensitivity.
6. **Report**
   - Return: TL;DR, files changed, validation run, risks/unresolved gaps, confidence.

## Domain operating notes
### 1) Legal / evidence / chronology
- Preserve event order and source-to-claim mapping.
- Flag contradictions, duplicates, missing exhibits, and unresolved timeline gaps.
- Prefer dated timeline entries in ISO format (`YYYY-MM-DD`).

### 2) Jewelry CAD / manufacturing
- Default unit: millimeters.
- Default tolerance band: ±0.05 to ±0.10 mm unless explicitly overridden.
- Include manufacturability constraints (clearances, minimum thickness, fit, shrinkage assumptions).
- Preserve/export naming convention when applicable:
  - `ANCONA_[Piece]_[Size]_v###.stl`
  - `ANCONA_[Piece]_[Size]_v###.obj`

### 3) Precious-metals finance and mixed-unit math
- Default constants:
  - `1 troy ounce = 31.1034768 grams`
  - `1 dwt = 1.55517384 grams`
- Keep gross weight, fine weight, melt value, financed value, payoff, margin, and ROI distinct.
- Explicitly flag unit drift and rounding effects.

### 4) CSV / catalog cleanup
- Preserve required column order and schema expectations.
- Never silently drop rows; report rows added/changed/removed.
- Call out invalid, missing, normalized, or inferred fields.

### 5) Business communications
- Tone: calm, precise, assertive.
- Make requested action explicit; tie claims to verifiable facts.
- Keep chronology and commitments unambiguous (with absolute dates where relevant).

### 6) Repo automation and validation
- Reuse existing scripts and conventions before adding new tooling.
- Prefer deterministic checks and auditable outputs.
- Record what was run, what passed/failed, and why.

## Completion checklist
- [ ] Domains identified and constraints inspected
- [ ] Facts/user statements/assumptions/inferences separated
- [ ] Absolute dates used where applicable
- [ ] Nontrivial math shown as Inputs -> Formula -> Result
- [ ] Minimal diff applied
- [ ] Validation executed (or explicitly justified if unavailable)
- [ ] Risks and unresolved gaps documented
