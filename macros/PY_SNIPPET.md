# /PY_SNIPPET — Re-emit calculations as a runnable Python snippet

Effect: Take the most recent numeric/calculation artifact and emit
a self-contained, deterministic Python 3 snippet that, when run,
prints the final result(s).

---

## Rules
- Python 3.10+; standard library only (no pip installs).
- Self-contained: all inputs as named constants at the top.
- Deterministic: no randomness, no network, no file I/O.
- Type annotations on functions. No global mutation.
- Print final result(s) only; intermediates allowed if helpful but
  clearly labeled.
- Include a `# verify:` comment at the bottom showing the expected
  output, so the user can spot a regression instantly.
- Use BLACKBOOK constants where applicable:
  - `OZT_TO_G = 31.1034768`
  - `DWT_TO_G = 1.55517384`
- Round only at the final print step. Carry full precision through.

## Skeleton

```python
#!/usr/bin/env python3
"""BLACKBOOK pricing snippet — generated [DATE]"""

# ---- Constants
OZT_TO_G: float = 31.1034768
DWT_TO_G: float = 1.55517384

def karat_purity(karat: int) -> float:
    return karat / 24.0

# ---- Inputs (edit me)
M_G: float        = 12.40    # piece weight, grams of alloy
KARAT: int        = 14       # 10/14/18/22/24
P_AU_OZT: float   = 2350.00  # USD per troy ounce, with timestamp
RECOVERY: float   = 0.97     # refiner recovery fraction
REFINING_FEE: float = 25.00  # USD flat
LABOR: float      = 60.00    # USD per piece
STONES: float     = 0.00     # USD
OVERHEAD: float   = 25.00    # USD per piece
MARKUP: float     = 2.20     # multiplier

def compute() -> dict[str, float]:
    pure_g   = M_G * karat_purity(KARAT)
    pure_ozt = pure_g / OZT_TO_G
    melt     = pure_ozt * P_AU_OZT
    recover  = melt * RECOVERY - REFINING_FEE
    cogs     = melt * RECOVERY + LABOR + STONES + OVERHEAD
    price    = cogs * MARKUP
    margin   = (price - cogs) / price * 100.0
    return {
        "pure_g": pure_g,
        "pure_ozt": pure_ozt,
        "melt_usd": melt,
        "recover_usd": recover,
        "cogs_usd": cogs,
        "price_usd": price,
        "margin_pct": margin,
    }

if __name__ == "__main__":
    r = compute()
    print(f"pure_g       {r['pure_g']:.4f} g")
    print(f"pure_ozt     {r['pure_ozt']:.5f} ozt")
    print(f"melt_usd     ${r['melt_usd']:.2f}")
    print(f"recover_usd  ${r['recover_usd']:.2f}")
    print(f"cogs_usd     ${r['cogs_usd']:.2f}")
    print(f"price_usd    ${r['price_usd']:.2f}")
    print(f"margin_pct   {r['margin_pct']:.2f}%")

# verify:
# pure_g       7.2333 g
# pure_ozt     0.23257 ozt
# melt_usd     $546.54
# recover_usd  $505.14
# cogs_usd     $615.14
# price_usd    $1353.31
# margin_pct   54.55%
```

## Recovery
If the user invokes `/PY_SNIPPET` but the prior artifact has no
computation, respond EXACTLY:

```
ERROR: prior artifact has no computation to emit as Python.
```

## Self-check
- Runs as-is on Python 3.10+ stdlib? [Y/N]
- No network / file I/O / randomness? [Y/N]
- Inputs at the top, constants named? [Y/N]
- `# verify:` block present at the bottom? [Y/N]
