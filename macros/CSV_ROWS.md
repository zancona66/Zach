# /CSV_ROWS — Re-emit current data as raw CSV rows only

Effect: Take the most recent tabular artifact and emit it as raw
CSV. No prose. No header outside the CSV itself. Output starts at
the header row.

This is the minimal sibling to `/csv` — `/csv` includes guidance,
`/CSV_ROWS` is just the rows.

---

## Rules
- RFC 4180. UTF-8. LF line endings.
- First row is the header (always).
- Quote any field containing comma, quote, or newline.
- Escape internal `"` by doubling: `"He said ""hi"""`.
- ISO-8601 dates.
- No currency symbols inside numeric fields; currency in its own
  column.
- One value per cell. No multi-value cells; explode to multiple
  rows or use a `;` delimiter inside quotes when truly necessary.
- Empty cell = `,,` (no `NULL`, no `N/A` unless the schema
  requires).

## Recovery
If the user invokes `/CSV_ROWS` but the prior artifact was not
tabular, respond with EXACTLY one line:

```
ERROR: prior artifact is not tabular; nothing to emit.
```

## Self-check
- Header present, unique columns? [Y/N]
- Same column count on every row? [Y/N]
- Quoting/escaping correct? [Y/N]
- No prose around the CSV? [Y/N]
