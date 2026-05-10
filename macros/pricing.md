# /pricing — Inputs → Formula → Result

Use: Any quote, ROI calc, or COGS sheet for AJLLC.
Output: numeric table only (per output contract); show units.

---

## A. Inputs
| Symbol | Meaning | Value | Unit | Source |
|---|---|---|---|---|
| `M_g` | Metal weight | [____] | g | Scale reading [DATE] |
| `K`   | Karat | [____] | (10/14/18/22/24) | Stamp / XRF |
| `P_au`| Spot gold | [____] | USD/ozt | [Source + DATE TIME] |
| `P_ag`| Spot silver | [____] | USD/ozt | [Source + DATE TIME] |
| `R`   | Refining recovery | [____] | fraction (0–1) | Refiner schedule |
| `F_r` | Refining fee | [____] | USD or % | Refiner contract |
| `L_p` | Labor (per piece) | [____] | USD | Labor sheet |
| `S_p` | Stones cost | [____] | USD | Vendor invoice |
| `O_p` | Overhead allocation | [____] | USD/piece | Ops sheet |
| `m`   | Markup (multiplier) | [____] | × | Pricing policy |

## B. Constants
- `1 ozt = 31.1034768 g`
- `1 dwt = 1.55517384 g`
- Karat purity:
  `purity(K) = K / 24`
  · 24K = 1.0000  · 22K = 0.9167  · 18K = 0.7500
  · 14K = 0.5833  · 10K = 0.4167

## C. Formulas
1. Pure metal mass:
   `M_pure_g = M_g × purity(K)`
2. Pure metal in troy ounces:
   `M_pure_ozt = M_pure_g / 31.1034768`
3. Melt value (gross):
   `V_melt = M_pure_ozt × P_au`
4. Recoverable value at refiner:
   `V_recover = V_melt × R − F_r`
   (if `F_r` is a percent, use `V_melt × R × (1 − F_r)` instead)
5. Cost of goods (COGS) for finished piece:
   `COGS = (V_melt × R × adj) + L_p + S_p + O_p`
   where `adj` reflects shrinkage / scrap policy.
6. Asking price:
   `Price = COGS × m`
7. Gross margin %:
   `GM% = (Price − COGS) / Price × 100`

## D. Worked example (replace numbers)
Inputs:
`M_g = 12.40`, `K = 14`, `P_au = 2350.00`, `R = 0.97`, `F_r = 25.00`,
`L_p = 60.00`, `S_p = 0.00`, `O_p = 25.00`, `m = 2.20`

Step 1: `M_pure_g  = 12.40 × (14/24)            = 7.2333 g`
Step 2: `M_pure_ozt= 7.2333 / 31.1034768        = 0.23257 ozt`
Step 3: `V_melt    = 0.23257 × 2350.00          = $546.54`
Step 4: `V_recover = 546.54 × 0.97 − 25.00      = $505.14`
Step 5: `COGS      = 546.54 × 0.97 + 60 + 0 + 25 = $615.14`
Step 6: `Price     = 615.14 × 2.20              = $1,353.31`
Step 7: `GM%       = (1353.31 − 615.14)/1353.31 = 54.55%`

## E. Alternate check
Cross-check Step 3 with dwt path:
`M_pure_dwt = M_pure_g / 1.55517384 = 4.6512 dwt`
`P_dwt      = P_au / (31.1034768/1.55517384) = P_au / 20`
            `= 2350 / 20 = 117.50 USD/dwt`
`V_melt     = 4.6512 × 117.50 = $546.51`  → matches within rounding.

## F. Output (paste-ready table)
| Item | Value | Unit |
|---|---|---|
| Pure metal mass | [____] | g |
| Pure metal mass | [____] | ozt |
| Melt value | $[____] | — |
| Recoverable value | $[____] | — |
| COGS | $[____] | — |
| Price | $[____] | — |
| Gross margin | [____] | % |

## Self-check
- Spot price has timestamp + source? [Y/N]
- Units carried through every step? [Y/N]
- Alternate path within rounding tolerance? [Y/N]
- Karat purity used correctly (K/24)? [Y/N]
