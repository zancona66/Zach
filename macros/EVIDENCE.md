# /EVIDENCE — Force FACTS / CONTENTIONS / ASSUMPTIONS / UNKNOWNS

Effect: For the next response, the analysis is structured into the
forensic four-bucket table. Use whenever a chronology or factual
dispute is in play.

---

## Output contract for /EVIDENCE

### 1. Bucket table  (mandatory, in this order)

| Bucket | Definition | Source level (1–4) |
|---|---|---|
| FACTS | Verifiable, dated, sourced. Each row cites an exhibit, document, or recorded communication. | (1) user file or (2) connected source |
| CONTENTIONS | Disputed assertions made by a party. Mark the asserter. | varies |
| ASSUMPTIONS | Things treated as true to proceed; would change outcome if wrong. | (4) inference, labeled |
| UNKNOWNS | What remains to be determined; what would resolve it; cost / effort to obtain. | n/a |

### 2. Chronological timeline
Sorted ascending by absolute date. Columns:
`date | actor | event | exhibit | bucket`

### 3. Contradiction ledger
For every pairwise conflict between FACTS or between FACTS and
CONTENTIONS:
`#  | claim_A (source) | claim_B (source) | proposed cure | branching (IF A / IF B)`

### 4. Cures and next-step evidence asks
For each gap in FACTS or each ASSUMPTION:
- What document or testimony would close it?
- Which discovery vehicle obtains it (RFP # / Interrogatory #
  / NTA # / Subpoena)?
- Cost / effort estimate.

### 5. Risk if unresolved
Short paragraph: what happens to the case theory if each top
UNKNOWN stays open at trial.

---

## Worked skeleton (delete and replace with case content)

```
FACTS
F1  2026-04-11  ZRA paid $5,000 deposit by wire (Ex. B).
F2  2026-04-15  Lease executed by both parties (Ex. A).
F3  2026-04-18  ZRA sent demand for return of deposit (Ex. D).

CONTENTIONS
C1  Altin asserts deposit was applied to alleged damages
    (asserter: Altin, source: counsel email 2026-04-22).

ASSUMPTIONS
A1  Wire confirmation in Ex. B is genuine and unmodified
    (basis: ZRA's own bank records; bank can subpoena).

UNKNOWNS
U1  Existence and contents of any move-out condition report.
    Cure: RFP No. 5 + NTA ¶ 8.
U2  Identity of person who authorized the deposit retention.
    Cure: Interrogatory No. 3.

TIMELINE
2026-04-11  ZRA          Wire $5,000 deposit                  Ex. B  F1
2026-04-15  Both         Lease executed                       Ex. A  F2
2026-04-18  ZRA          Demand letter sent                   Ex. D  F3
2026-04-22  Altin counsel Asserted damages offset             —      C1

CONTRADICTION LEDGER
1  F3: timely demand for return  vs  C1: damages offset
   Cure: production of move-out condition report (RFP 5)
   IF A (no report exists) → C1 unsupported → likely return.
   IF B (report exists) → assess validity of damages claim.
```

## Self-check
- Every FACT has an exhibit/source citation? [Y/N]
- Every CONTENTION names the asserter? [Y/N]
- Every ASSUMPTION names the basis and the failure mode? [Y/N]
- Every UNKNOWN names a discovery vehicle to resolve it? [Y/N]
