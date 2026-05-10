# /DECIDE — Force a single recommended action

Effect: Stop deliberating. Pick one path, name one fallback, no
further questions.

Use when: you are time-boxed, the cost of further analysis exceeds
the value, or analysis paralysis is the actual problem.

---

## Output contract for /DECIDE

```
DECISION
  Recommended action:  [one sentence, concrete, dated, copy/paste-
                       ready]

WHY THIS, NOT THE ALTERNATIVES
  - Top tradeoff vs option B: [one line]
  - Top tradeoff vs option C: [one line]

FALLBACK  (single, exactly one)
  If the recommendation is blocked or fails by [DATE/CHECK], do:
  [one sentence]

PRECONDITIONS  (must be true to act)
  1. [precondition]
  2. [precondition]

KILL CRITERIA  (stop and reassess if any of these become true)
  - [criterion]
  - [criterion]

CONFIDENCE: [H | M | L] — [one-line basis]
```

## Hard rules
- One recommendation. Not "either / or".
- One fallback. Not a tree of fallbacks.
- No questions back to the user. If a fact is missing, label an
  assumption and proceed.
- Concrete dates and amounts; no "soon", no "around".
- Must include kill criteria so the decision is reversible if
  reality changes.

## When NOT to use
- Anything irreversible without explicit user consent.
- Anything that would commit the user to a court filing they have
  not approved.
- Anything that spends money beyond a personally-set threshold
  without confirmation.

## Self-check
- Exactly one recommendation? [Y/N]
- Exactly one fallback? [Y/N]
- Kill criteria present? [Y/N]
- No questions to user? [Y/N]
- Reversible or explicitly authorized? [Y/N]
