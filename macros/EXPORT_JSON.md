# /EXPORT_JSON — Re-emit current artifact as JSON

Effect: Take the most recent substantive artifact and re-emit it
as machine-readable JSON. Pure JSON only — no prose, no markdown
code fence necessary for downstream parsing (use one if rendering).

---

## Rules
- Valid JSON. UTF-8. No trailing commas.
- Dates: ISO-8601 (`YYYY-MM-DD` or full `YYYY-MM-DDThh:mm:ss±hh:mm`).
- Money: numbers (not strings). Currency in a sibling field.
- Booleans: `true` / `false`. Never `"true"`.
- Empty values: `null` (not `""`, not omitted, unless the schema
  explicitly allows omission).
- Snake_case keys.
- Arrays of homogeneous objects only.
- No comments (JSON has none). Put rationale in a `_meta` object.

## Schemas

### Generic envelope
```json
{
  "schema":  "blackbook.export.v1",
  "kind":    "[evidence|pricing|timeline|complaint|cad|...]",
  "produced_at": "2026-05-10T14:00:00-04:00",
  "matter":  "ZRA v. Altin Realty",
  "_meta":   { "source_turn": "[turn id or descriptor]" },
  "data":    [ ... ]
}
```

### Evidence row
```json
{
  "exhibit": "A",
  "date": "2026-04-11",
  "source": "Lease",
  "custodian": "ZRA",
  "description": "Lease for 23 W 47 St #7, with addenda",
  "bates_start": "ZRA000001",
  "bates_end":   "ZRA000018",
  "authentication_basis": "Notice to Admit ¶ 7"
}
```

### Pricing row
```json
{
  "sku": "ANC-R-001",
  "piece": "Ring",
  "size": "7",
  "metal_g": 12.40,
  "karat": 14,
  "spot": { "metal": "AU", "usd_per_ozt": 2350.00,
            "as_of": "2026-05-10T09:30:00-04:00",
            "source": "[name]" },
  "cogs_usd": 615.14,
  "price_usd": 1353.31,
  "margin_pct": 54.55
}
```

### Timeline row
```json
{
  "date": "2026-04-11",
  "actor": "ZRA",
  "event": "Sent demand letter via certified mail RRR",
  "exhibit": "D",
  "notes": "Tracking 9410..."
}
```

### Complaint allegation
```json
{
  "paragraph": 6,
  "date": "2026-04-11",
  "fact": "ZRA paid $5,000 deposit by wire.",
  "exhibit": "B",
  "support_level": 1
}
```

### CAD spec
```json
{
  "piece": "Ring",
  "size_us": 7,
  "version": "v003",
  "filename_stl": "ANCONA_Ring_7_v003.stl",
  "dimensions_mm": {
    "shank_thickness": 1.80,
    "shank_width":     2.40,
    "id_diameter":     17.30,
    "wall_min":        0.85
  },
  "tolerance_mm": 0.05,
  "stones": [
    { "id": "S1", "type": "diamond", "cut": "RBC",
      "size_mm": 3.00, "qty": 1, "setting": "prong-4" }
  ],
  "alloy": "14K yellow",
  "estimated_alloy_g": 4.10
}
```

## Self-check
- Output parses as valid JSON (no trailing commas, balanced
  braces)? [Y/N]
- Dates ISO-8601, money numeric, booleans real booleans? [Y/N]
- Schema name and version included? [Y/N]
- No prose outside the JSON? [Y/N]
