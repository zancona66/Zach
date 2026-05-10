# /cad — CAD Spec Sheet

Use: Any new piece going to print, casting, or CNC.
Output: structured spec + filename + QC checklist.

---

## A. Identity
- Piece:           [e.g., Ring / Pendant / Necklace / Earring / Bangle]
- Reference name:  [internal nickname]
- Designer:        ZRA
- Date:            [DATE]
- Version:         v[###]

## B. Filenames
Naming pattern (mandatory):
`ANCONA_[Piece]_[Size]_v###.stl`
`ANCONA_[Piece]_[Size]_v###.obj`

Example: `ANCONA_Ring_7_v003.stl`

Bump rules:
- Geometry change → bump `v###`.
- Material/finish change only → suffix `_M[code]` (does not bump v).
- Size sweep → suffix `_S[size]` per file in the sweep.

## C. Dimensions  (units: mm; tolerance ±0.05–0.10 mm default)
| Feature | Value | Tolerance |
|---|---|---|
| Overall length | [____] | ±0.10 |
| Overall width  | [____] | ±0.10 |
| Overall height | [____] | ±0.10 |
| Shank thickness (rings) | [____] | ±0.05 |
| Shank width (rings) | [____] | ±0.05 |
| US ring size | [____] | — |
| ID diameter (rings) | [____] | ±0.05 |
| Wall thickness (min) | [____] | ±0.05 |
| Bail ID (pendants) | [____] | ±0.10 |
| Findings spec | [____] | per supplier |

## D. Stones  (per setting)
| ID | Type | Cut | Size (mm) | Qty | Setting | Seat depth | Prong / bezel |
|---|---|---|---|---|---|---|---|
| S1 | [Diamond] | RBC | [3.00] | [1] | [Prong 4] | [____] | [____] |
| S2 | [____] | [____] | [____] | [____] | [____] | [____] | [____] |

Clearances (min):
- Stone-to-stone (girdle): 0.20 mm
- Prong tip cover over girdle: 0.30 mm
- Stone-to-finger / wear surface: 0.30 mm
- Bezel wall thickness: ≥ 0.30 mm

## E. Material plan
- Casting alloy:    [14K yellow / 18K white / 925 silver / etc.]
- Estimated weight: [____] g (alloy)  →  [____] g (pure) per Karat
- Plating / finish: [none / rhodium / etc.]
- Hand-finishing:   [polish / matte / hammer / etc.]

## F. Print / cast plan
- Printer:        [SLA / DLP / wax]
- Resin:          [castable resin name + lot]
- Layer height:   [25 / 50 µm]
- Orientation:    [____]
- Supports:       [auto / manual; tip dia ____ mm]
- Tree plan:      [piece per tree, sprue diameter, gate placement]
- Burnout cycle:  [investment + ramp profile]
- Quench:         [time + method]

## G. QC checklist (before sign-off)
- [ ] Wall thickness ≥ 0.80 mm everywhere (or stated minimum)
- [ ] No non-manifold edges (mesh closed and watertight)
- [ ] Stone seats verified against actual stone caliper readings
- [ ] Prong heights uniform within ±0.05 mm
- [ ] Bail ID accepts intended chain (gauge confirmed)
- [ ] Engraving depth ≥ 0.15 mm and legible after polish
- [ ] Hallmark + maker mark area reserved (≥ 4×2 mm flat)
- [ ] Filename matches pattern in §B
- [ ] STL + OBJ both exported and SHA-256 logged
- [ ] Render screenshots saved to `/renders/[v###]/`

## Self-check
- Tolerances explicit per feature? [Y/N]
- Stone clearances meet §D minimums? [Y/N]
- Filename matches §B pattern exactly? [Y/N]
- Material weight estimate computed and documented? [Y/N]
