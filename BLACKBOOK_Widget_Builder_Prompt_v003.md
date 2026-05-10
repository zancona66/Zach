# BLACKBOOK Widget Builder Prompt v003

Build a premium, mobile-first results widget named
`blackbook_search_results` aligned to BLACKBOOK v2.0.0 (MAX).

This is a professional review surface for retrieved files, legal
items, finance records, ops notes, evidence packets, and memory
results — not a consumer widget.

---

## 1. Mission

Display retrieved search results so the user can, in under five
seconds on a phone:
1. scan results,
2. identify the strongest source,
3. open a result, and
4. pass a selected result into downstream agent use.

Workflow context: `Start → File Search → Agent → End`.

---

## 2. BLACKBOOK Alignment Rules

Must reflect the BLACKBOOK operating style:
- strong structure, no clutter, high signal density
- premium restraint
- chronology-aware presentation
- evidence-friendly formatting
- absolute dates only — never "yesterday" / "last week"
- professional tone, fast mobile readability
- clear separation of title / source / date / snippet / action

Avoid:
- decorative noise, playful UI, excessive gradients
- oversized icons, weak contrast, vague labels
- emoji
- relative dates

---

## 3. Data Contract  (typed)

```ts
type Category =
  | "LEGAL" | "EVIDENCE" | "FINANCE"
  | "OPS"   | "COMMS"    | "CAD";

interface BlackbookResult {
  result_id:          string;          // stable id
  title:              string;          // ≤ 80 chars
  source:             string;          // e.g. "File Search"
  snippet:            string;          // ≤ 320 chars; truncated UI-side
  absolute_date:      string;          // "April 11, 2026"  (NEVER relative)
  relevance_score:    number;          // 0.0 – 1.0
  category_tag:       Category;
  is_selected:        boolean;
  is_high_importance: boolean;
}

interface BlackbookSearchPayload {
  query:        string;
  result_count: number;
  results:      BlackbookResult[];
  state:        "loading" | "ok" | "empty" | "error";
  error_msg?:   string;
}
```

Mock data:

```json
{
  "query": "Altin Realty deposit",
  "result_count": 2,
  "state": "ok",
  "results": [
    {
      "result_id": "res_001",
      "title": "Altin Realty Timeline",
      "source": "File Search",
      "snippet": "Timeline of key events, deposit dispute, missing property claims, and communication history.",
      "absolute_date": "April 11, 2026",
      "relevance_score": 0.98,
      "category_tag": "LEGAL",
      "is_selected": false,
      "is_high_importance": true
    },
    {
      "result_id": "res_002",
      "title": "Black Book Operating Rules",
      "source": "Uploaded File",
      "snippet": "Response structure, chronology rules, math verification, confidence discipline, and formatting defaults.",
      "absolute_date": "March 2, 2026",
      "relevance_score": 0.95,
      "category_tag": "OPS",
      "is_selected": false,
      "is_high_importance": false
    }
  ]
}
```

---

## 4. Layout

### Header
- Widget title: `Search Results`
- Query label (`for: "<query>"`)
- Result count (`<n> results`)
- Optional filter-chip row (categories)

### Results list
- Stacked vertical cards
- 12 px gap between cards on mobile, 16 px on tablet+
- Easy thumb reach; min tap target 44×44 px

### Footer
- Optional: load more, refresh, status indicator

---

## 5. Card Anatomy

Top row:
- Title (left, 16 px / 600 weight)
- Category tag (right, 11 px uppercase, monospace)

Metadata row (12 px, secondary text color):
- Source · Absolute date · Relevance (`98%`)

Snippet:
- 14 px, 1.45 line-height, clamp at 3 lines, ellipsis on overflow

Action row:
- `Open`         (primary outline)
- `Use Result`   (primary filled)
- `Copy Citation` (ghost; optional)

---

## 6. UI States  (all required)

1. **Loading** — 4 skeleton cards with placeholders for title,
   metadata, snippet, button row. Shimmer animation ≤ 1.2 s loop.
2. **Empty** — message `No results found.`
   Subtext `Try a different query or broaden the search.`
3. **Error** — message `Search results could not be loaded.`
   `Retry` button; surface `error_msg` in monospace under it.
4. **Selected** — selected card gains a 2 px accent border + a
   small `SELECTED` badge, no color noise elsewhere.
5. **High importance** — `is_high_importance: true` adds a subtle
   left-edge accent stripe (3 px) and a small `IMPORTANT` badge.
   Never combine with bright fills.

---

## 7. Visual System

- Dark mode first; light mode is a secondary theme.
- Neutral premium palette:
  - bg:        `#0B0B0D`
  - card:      `#141418`
  - border:    `#22232A`
  - text:      `#ECECEE`
  - text-dim:  `#9A9AA3`
  - accent:    `#C9A227`  (restrained gold; legal/premium read)
  - danger:    `#E5484D`
- Cards: 12 px radius, 1 px border, no shadow on dark, 1-step soft
  shadow on light.
- Typography: system UI stack; tabular numerals for scores/dates.

---

## 8. Interaction

- Tap `Open`        → opens result detail (route or modal).
- Tap `Use Result`  → marks `is_selected = true` (single-select
  unless multi-select is explicitly enabled).
- Tap `Copy Citation` → copies `"<title>" — <source>, <absolute_date>
  (id: <result_id>)` to clipboard; show 1.2 s "Copied" toast.
- Filter chip tap   → applies category filter; chip shows active
  state; clear-all button appears when ≥1 chip active.
- Selection state must be visually obvious without color alone.

---

## 9. Accessibility (WCAG 2.2 AA minimum)

- Text contrast ≥ 4.5:1 for body, ≥ 3:1 for ≥ 18 pt.
- Buttons have accessible names matching visible labels.
- Focus ring: 2 px accent, 2 px offset, visible in dark and light.
- Card is a `<article>` with `role="article"` and an
  `aria-labelledby` pointing at the title.
- Action buttons grouped in `role="group"` with
  `aria-label="Actions for <title>"`.
- `is_high_importance` mirrored in an `aria-label` suffix
  (`(important)`), never color-only.
- Keyboard: `Tab` traverses cards; within a card,
  `Tab` moves through Open → Use Result → Copy Citation;
  `Enter` activates focused button; `Esc` closes any modal.

---

## 10. Telemetry Hooks  (optional, opt-in)

Emit events with this shape so they pipe into BLACKBOOK ops:
```ts
type WidgetEvent =
  | { type: "view";          query: string; count: number }
  | { type: "open";          result_id: string }
  | { type: "use_result";    result_id: string }
  | { type: "copy_citation"; result_id: string }
  | { type: "filter";        category: Category | null }
  | { type: "retry" };
```

---

## 11. Acceptance Test Checklist

- [ ] Title, source, date, snippet, category visible in ≤ 1 s on
      mid-tier phone.
- [ ] All 5 states reachable in a storybook/preview harness.
- [ ] No relative dates anywhere in copy or formatters.
- [ ] Keyboard-only operator can select and open any result.
- [ ] Screen reader announces title, category, date, and selection
      state for each card.
- [ ] Lighthouse mobile a11y score ≥ 95.
- [ ] Dark and light themes both pass contrast checks.
- [ ] No emoji in any string.
- [ ] Copy Citation produces the exact format in §8.
- [ ] High-importance + selected states render together cleanly
      without visual conflict.

---

## 12. Output Goal

Produce a polished, production-feeling widget that works as a
premium search-results browser for a high-discipline AI assistant.

Keep it simple. Keep it strong. Keep it mobile. Keep it BLACKBOOK.
