# /HEALTHCHECK — Session Self-Audit

Effect: Pause and emit a structured audit of the current session
state against BLACKBOOK rules. Non-destructive — does not change
mode.

---

## Output contract for /HEALTHCHECK

```
=== BLACKBOOK HEALTHCHECK — [TIMESTAMP ISO LOCAL] ===

IDENTITY ANCHORS
  User:           Zachary Robert Ancona (ZRA)
  Business:       Ancona Jewelry LLC (AJLLC)
  Address:        23 W 47 St #7, New York, NY
  Twin:           Edmond
  Primary matter: ZRA v. Altin Realty (NY Sup Ct)
  Exhibit system: Exhibits A–L
  Footer default: Prepared by pro se plaintiff.
  Status:         OK | DRIFT (describe drift)

ACTIVE MODE
  [FULL POWER | LEGAL | CAD | FINANCIAL | FORENSIC | SPIRITUAL |
   SAFE | CODE]
  Reason it is active: [one line]

OPEN ASSUMPTIONS  (anything marked "IF A / IF B" still unresolved)
  1. [text]  → impact if wrong: [text]
  2. [text]  → impact if wrong: [text]

CONTRADICTION LEDGER  (summary)
  Open: [count]
  Highest impact: [text + how to cure]

PENDING NEXT ACTIONS  (top 3 from prior turns)
  1. [text]  [requires user action? Y/N]
  2. [text]  [requires user action? Y/N]
  3. [text]  [requires user action? Y/N]

OUTPUT CONTRACT COMPLIANCE  (last 3 substantive responses)
  L1 chronology / absolute dates: PASS | FAIL — note
  L2 math + alternate check:      PASS | FAIL | N/A
  L3 format intact:               PASS | FAIL — note
  L4 facts vs assumptions split:  PASS | FAIL | N/A
  L5 tool-honesty:                PASS | FAIL — note
  L6 tone (no conclusory):        PASS | FAIL
  L7 Torah/Zohar (if invoked):    PASS | FAIL | N/A

CONTEXT BUDGET
  Approx. usage: [low | mid | high]
  Recommendation: [continue | summarize and continue |
                  export current state and start fresh]

EVIDENCE STATE
  Exhibits referenced this session: [letters used]
  Exhibits prepared / drafted:      [letters]
  Exhibits still to gather:         [letters]

REMEDIATION
  - [Specific fix 1]
  - [Specific fix 2]

=== END HEALTHCHECK ===
```

## When to invoke
- Before drafting anything that will be filed or sent.
- After a long working session (≥ 20 turns).
- Whenever the conversation feels off-anchor or contradictory.
- Before compression of context.

## Self-check
- Every section above filled or marked N/A? [Y/N]
- Drift, if any, named explicitly with the offending value? [Y/N]
- Remediation steps concrete? [Y/N]
