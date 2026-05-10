# /csv — Structured CSV Output

Use: When data should be machine-readable, not narrative.
Output: CSV only. No prose, no markdown table.

---

## Rules
- RFC 4180 compliant.
- UTF-8, LF line endings.
- Header row required.
- Quote any field containing comma, quote, or newline.
- Escape internal quotes by doubling them: `"He said ""hi"""`.
- Dates in ISO-8601: `YYYY-MM-DD`.
- Money: digits with optional decimal point, no currency symbol.
  Currency in a separate column.
- Empty cell = explicit empty (`,,`), never `NULL` or `N/A` unless
  the schema requires it.

## Common schemas

### Evidence log
```csv
exhibit,date,source,custodian,description,bates_start,bates_end,authentication_basis
A,2026-04-11,Lease,ZRA,"Lease for 23 W 47 St #7, with addenda",ZRA000001,ZRA000018,Notice to Admit ¶7
B,2026-04-15,Bank,ZRA,"Wire confirmation, $5000 deposit",ZRA000019,ZRA000019,Bank records subpoena
```

### Pricing rows
```csv
sku,piece,size,metal_g,karat,spot_usd_per_ozt,cogs_usd,price_usd,margin_pct,priced_on
ANC-R-001,Ring,7,12.40,14,2350.00,615.14,1353.31,54.55,2026-05-10
ANC-N-014,Necklace,18in,28.10,18,2350.00,1280.45,2816.99,54.55,2026-05-10
```

### Timeline rows
```csv
date,actor,event,exhibit,notes
2026-04-11,ZRA,"Sent demand letter via certified mail RRR",D,Tracking 9410...
2026-04-18,Altin Realty,"No response by deadline",,Deadline was 2026-04-17
```

### Communications log
```csv
datetime_iso,channel,from,to,subject_or_topic,attachment_count,exhibit
2026-04-11T09:14:00-04:00,email,zra@example.com,leasing@altin.example,"Deposit return request",1,E
2026-04-12T17:42:00-04:00,sms,+1212XXXXXXX,+1212YYYYYYY,"Follow-up re deposit",0,F
```

## Self-check
- Header row present and unique? [Y/N]
- Every row has the same column count? [Y/N]
- Quoting and escaping correct on commas/quotes/newlines? [Y/N]
- Dates in ISO-8601? [Y/N]
