# SHOPIFY BLACKBOOK v1.0
## Ancona Jewelry LLC / AJLLC — Master Image Pipeline & Metadata Standard

**Point of Contact:** Zachary @ Cloude Cowork
**Scope:** Complete production pipeline from source pixel → PSD master → JPEG/WebP exports → QA sign-off → Shopify metadata handoff.
**Critical rule:** Retouchers and vendors **DO NOT upload to Shopify directly.** All uploads handled exclusively by Zachary. Deliverables ship as handoff ZIPs.

This document is the single authoritative reference. Every other spec file (PSD layer, CLI export, QA checklist, metadata templates) is a canonical section within this file. When they conflict, this file wins.

---

## TABLE OF CONTENTS

0. Activation & Handoff Model
1. File Naming Standard
2. PSD Master Layer Specification
3. Retoucher Standard Operating Procedure
4. Export Pipeline (CLI)
5. Per-Image QA Sign-Off Checklist
6. Shopify Metadata Templates & Formulas
7. JSON-LD Structured Data Reference
8. Manifest CSV Schema
9. Handoff ZIP Structure
10. Common Mistakes / Do Not
11. Fact Discipline & Verification (Blackbook link)

---

## 0. ACTIVATION & HANDOFF MODEL

### Roles
- **Retoucher:** builds PSD master, generates exports, self-QA, fills manifest row, signs Block G. Does not upload to Shopify.
- **Lead QA:** verifies against sign-off checklist, approves or returns for revision.
- **Zachary @ Cloude Cowork:** receives handoff ZIP, uploads to Shopify, applies alt text, verifies retina load.

### Handoff trigger
A product is ready for handoff when:
1. All 7 named layers exist in the PSD master (see §2).
2. Both JPEG and WebP exist at 2048px and 3072px (see §4).
3. Standalone `_MASK.png` exists as greyscale PNG-8.
4. QA sign-off checklist is complete and both signatures dated (see §5).
5. Manifest row is filled (see §8).
6. Handoff ZIP is built (see §9).

### Confirmation phrase
When invoked as a standalone prompt: reply exactly `SHOPIFY BLACKBOOK v1.0 LOADED. Ready.` then wait for the task.

---

## 1. FILE NAMING STANDARD

**Canonical pattern:**
```
[SKU]_[view]_[metal]_[variant].[ext]
```

**Tokens:**
| Token | Values | Notes |
|-------|--------|-------|
| SKU | `AJ-DIA-######` or `CC-ST###` | Ancona SKU or Cloude Cowork prefix |
| view | `front` \| `angle` \| `lifestyle` \| `detail` \| `group` | Lowercase, underscore-separated |
| metal | `wg` \| `yg` \| `rg` | White / Yellow / Rose gold |
| variant | `MASTER.psd` \| `MASK.png` \| `2048.jpg` \| `2048.webp` \| `3072.jpg` \| `3072.webp` \| `SOURCE.jpg` \| `BASE.tif` | Export tier / role |

**Complete deliverable set for one product view:**
```
AJ-DIA-410190_front_wg_MASTER.psd     ← layered working file
AJ-DIA-410190_front_wg_MASK.png       ← standalone greyscale alpha mask
AJ-DIA-410190_front_wg_2048.jpg       ← standard JPEG (hero)
AJ-DIA-410190_front_wg_2048.webp      ← standard WebP
AJ-DIA-410190_front_wg_3072.jpg       ← retina JPEG
AJ-DIA-410190_front_wg_3072.webp      ← retina WebP
```

**Rules:**
- Underscores only. No spaces, no special characters, no promotional language in filenames.
- Never rename after Shopify upload — CDN caches by filename.
- **GOOD:** `AJ-DIA-410190_front_wg_2048.jpg`
- **BAD:** `stud_FINAL_USE_THIS_v7_REALLYFINAL.jpg`

---

## 2. PSD MASTER LAYER SPECIFICATION

### Layer stack (top → bottom)

```
┌───────────────────────────────────────────────────────────────────────┐
│ #  LAYER / GROUP           BLEND MODE    OPAC  CLIP   TYPE     LOCK  │
├───────────────────────────────────────────────────────────────────────┤
│ 1  Final_Composite         Normal        100%   —     SmartObj  —    │
│ ═════════════ SPECULAR GROUP ══════════════════════════════════════   │
│ 2  Specular_Highlights     Pass Through   —     —     Group     —    │
│ 2a   Table_HotSpot         Soft Light    70%    ✓     Pixel     —    │
│ 2b   Table_HotSpot_Bloom   Soft Light    45%    ✓     Pixel     —    │
│ 2c   Girdle_Return         Screen        25%    ✓     Pixel     —    │
│ 2d   Pavilion_Return       Screen        20%    ✓     Pixel     —    │
│ ═════════════ INCLUSIONS GROUP ═══════════════════════════════════    │
│ 3  Stone_Inclusions        Pass Through   —     —     Group     —    │
│ 3a   Inclusion_Lines       Multiply      10%    ✓     Pixel     —    │
│ 3b   Pinpoint_Reflex       Screen        40%    ✓     Pixel     —    │
│ ═════════════ BRILLIANCE GROUP ═══════════════════════════════════    │
│ 4  Stone_Brilliance        Pass Through   —     —     Group     —    │
│ 4a   Fire_Red              Screen        22%    ✓     Pixel     —    │
│ 4b   Fire_Orange           Screen        20%    ✓     Pixel     —    │
│ 4c   Fire_Yellow           Screen        25%    ✓     Pixel     —    │
│ 4d   Fire_Green            Screen        18%    ✓     Pixel     —    │
│ 4e   Fire_Cyan             Screen        16%    ✓     Pixel     —    │
│ 4f   Fire_Blue             Screen        20%    ✓     Pixel     —    │
│ 4g   Fire_Violet           Screen        18%    ✓     Pixel     —    │
│ 4h   Secondary_Return      Screen        28%    ✓     Pixel     —    │
│ ═════════════ METAL GRADE GROUP ══════════════════════════════════    │
│ 5  Metal_Grade             Pass Through   —     —     Group     —    │
│ 5a   [WG] Hue_Sat_Adj      —              —     ✓     Adj.Lyr   —    │
│ 5b   [WG] Highlight        Screen        25%    ✓     Pixel     —    │
│ 5c   [WG] Grain            Luminosity   100%    ✓     Pixel     —    │
│ 5d   [WG] Shadow_Dark      Multiply      30%    ✓     Pixel     —    │
│ 5e   [YG] Hue_Sat_Adj      —              —     ✓     Adj.Lyr   —    │
│ 5f   [YG] Highlight        Screen        35%    ✓     Pixel     —    │
│ 5g   [YG] Shadow_Dark      Multiply      20%    ✓     Pixel     —    │
│ 5h   SubRefl_Stone         Color Dodge   12%    ✓     Pixel     —    │
│ ═════════════ SHADOW GROUP ═══════════════════════════════════════    │
│ 6  Shadow_Contact          Pass Through   —     —     Group     —    │
│ 6a   Contact_Gradient      Multiply      38%    —     Pixel     —    │
│ 6b   Shadow_Original       Normal       100%    —     Pixel     🔒   │
│ ═════════════ MASK ═══════════════════════════════════════════════    │
│ 7  Mask_Clean              Normal       100%    —     SmartObj  —    │
│ ═════════════ BASE ═══════════════════════════════════════════════    │
│ 8  Base                    Normal       100%    —     Pixel     🔒   │
└───────────────────────────────────────────────────────────────────────┘
```

**Legend:** ✓ = clipped to Mask_Clean. 🔒 = double-locked (Position + Pixels).

### Layer-by-layer rules

**Layer 8 — Base**
- Original source pixel. NEVER paint, filter, stamp, or transform.
- Lock immediately on PSD open: right-click → Lock All.
- Work in RGB 16-bit throughout. Convert to 8-bit only at export.
- If source is JPEG, do not save back to JPEG until final export — always work from TIFF/PSD.

**Layer 7 — Mask_Clean**
- Linked Smart Object → sibling file `[SKU]_[view]_[metal]_MASK.png`.
- Re-link if moved: right-click → Replace Contents → locate new PNG.
- Do NOT rasterise. Do NOT embed. Never flatten.
- All stone-group layers (4, 3, 2) must be clipped (Alt-click between layers).

**Layer 6 — Shadow_Contact**
- **6b Shadow_Original:** pixel copy of source shadow, locked. Reference only — never edit.
- **6a Contact_Gradient:** new layer. Radial gradient over prong/bezel contact zone. Brush: soft round 60px, Multiply 38%, 8px feather on selection before painting. Direction: centre of prong base outward. Do not exceed stone perimeter.
- No hue or saturation changes on any shadow layer.

**Layer 5 — Metal_Grade**
DELETE the inapplicable sub-group before delivering master PSD. White gold images → delete `[YG]` layers. Yellow gold → delete `[WG]` layers.

*White gold sub-group:*
- **5a [WG] Hue_Sat_Adj:** Hue 0°, Sat −8 to −12, Lightness +2. Clipped to metal selection — never global.
- **5b [WG] Highlight:** R:225 G:232 B:240, soft brush 30px, Screen 25%. Paint at sharpest metal reflection edge only.
- **5c [WG] Grain:** Add Noise 2%, Gaussian, Monochromatic → set to Luminosity 100%. Simulates brushed white gold micro-texture.
- **5d [WG] Shadow_Dark:** R:185 G:188 B:192, Multiply 30%. Paint at deepest shadow crease only.

*Yellow gold sub-group:*
- **5e [YG] Hue_Sat_Adj:** Hue +2 to +4 (push toward 40°), Sat +8, Lightness 0.
- **5f [YG] Highlight:** R:255 G:248 B:210, Screen 35%. Place at primary specular point.
- **5g [YG] Shadow_Dark:** R:140 G:90 B:10, Multiply 20%. Paint at deepest shadow crease only.

*Shared:*
- **5h SubRefl_Stone:** eyedrop dominant hue from Stone_Brilliance centroid. Soft 6px brush, Color Dodge 12%. Single stroke on metal directly beneath girdle.

**Layers 4a–4h — Stone_Brilliance**
- Each `Fire_` layer: Radial gradient, Foreground to Transparent.
- Gradient drag length = percentage of stone diameter (see Colour Reference below).
- **No two flares in the same 45° angular sector.** Mental clock positioning:
  - Fire_Red @ ~10 o'clock
  - Fire_Orange @ ~2 o'clock
  - Fire_Yellow @ ~1 o'clock
  - Fire_Green @ ~7 o'clock
  - Fire_Cyan @ ~5 o'clock
  - Fire_Blue @ ~9 o'clock
  - Fire_Violet @ ~3 o'clock
  - Secondary_Return scattered around girdle ring
- All fire layers MUST be clipped to Mask_Clean — zero bleed outside stone.

**Layers 3a–3b — Stone_Inclusions**
- **3a Inclusion_Lines:** Pen tool paths, 1px stroke, Simulate Pressure ON. Draw 2–5 gently curved lines. No two lines parallel. Lengths vary 20–50% of stone diameter. Colour R:18 G:12 B:8. Mode Multiply 8–12%. Rasterise path after stroke.
- **3b Pinpoint_Reflex:** Hard round 2px brush, white, Screen 40%. 1–3 single clicks at random facet junctions. **Not at table centre.**

**Layers 2a–2d — Specular_Highlights**
- **2a Table_HotSpot:** Hard brush 90% hardness, size = 4–6% stone diameter. Pure white. Single click at table geometric centre. Soft Light 70%.
- **2b Table_HotSpot_Bloom:** Duplicate 2a → Gaussian Blur 5px → Soft Light 45%. Soft outer glow.
- **2c Girdle_Return:** Soft elliptical brush, white, Screen 25%. 4–6 small strokes at facet junctions around girdle perimeter.
- **2d Pavilion_Return:** Larger soft oval brushes, white, Screen 20%. 2–3 strokes at deepest pavilion facet centres.

**Layer 1 — Final_Composite**
- Created LAST using Stamp Visible: `Cmd+Alt+Shift+E` (Mac) / `Ctrl+Alt+Shift+E` (Win).
- Immediately convert to Smart Object (right-click → Convert to Smart Object).
- **Only layer exported for JPEG/WebP.**
- Regenerate every time any underlying layer changes.
- Keep at absolute top of stack — never insert layers above it.

### Colour reference table

**White gold metal (14K reference)**
| Element | RGB | Mode | Notes |
|---------|-----|------|-------|
| Mid-tone target | 210,212,215 | — | Info panel check |
| Highlight | 225,232,240 | Screen 25% | Sharpest reflection edge |
| Shadow dark | 185,188,192 | Multiply 30% | Deepest crease only |
| Hue/Sat range | Hue 0° · Sat 4–8% · Val 88–96% | — | HSB check |

**Yellow gold metal (18K reference)**
| Element | RGB | Mode | Notes |
|---------|-----|------|-------|
| Mid-tone target | 218,165,32 | — | Info panel check |
| Highlight | 255,248,210 | Screen 35% | Primary specular point |
| Shadow dark | 140,90,10 | Multiply 20% | Deepest crease only |
| Hue/Sat range | Hue 38–44° · Sat 62–72% · Val 78–88% | — | Never exceed 46° (orange) or drop below 35° (rose) |

**Stone fire flares**
| Flare | RGB | Mode | % Stone Ø |
|-------|-----|------|-----------|
| Fire_Red | 255,30,30 | Screen 22% | ~8% |
| Fire_Orange | 255,120,0 | Screen 20% | ~10% |
| Fire_Yellow | 255,245,0 | Screen 25% | ~12% |
| Fire_Green | 20,210,60 | Screen 18% | ~7% |
| Fire_Cyan | 0,200,220 | Screen 16% | ~6% |
| Fire_Blue | 30,90,255 | Screen 20% | ~8% |
| Fire_Violet | 150,0,255 | Screen 18% | ~7% |
| Secondary_Return | 255,255,255 | Screen 28% | ~5% |

**Specular & inclusions**
| Element | RGB | Mode |
|---------|-----|------|
| Table hot-spot | 255,255,255 | Soft Light 70% |
| Bloom overlay | 255,255,255 | Soft Light 45% (blurred) |
| Girdle return | 255,255,255 | Screen 25% |
| Pavilion return | 255,255,255 | Screen 20% |
| Inclusion lines | 18,12,8 | Multiply 10% |
| Pinpoint reflex | 255,255,255 | Screen 40% |

---

## 3. RETOUCHER STANDARD OPERATING PROCEDURE

Follow in order. Do not skip stages.

1. **Ingest:** Copy source into `exports/source/[SKU]_[view]_[metal]_SOURCE.jpg`. Never edit source.
2. **Flatten to TIFF:** Run Step 1 in §4 to create `exports/base_tif/[SKU]_[view]_[metal]_BASE.tif` (16-bit sRGB).
3. **Open PSD workspace:** New PSD from BASE.tif. Set RGB 16-bit. Lock Base layer.
4. **Build mask:** Create clean stone alpha at ≤0.5px feather. Export as `[SKU]_[view]_[metal]_MASK.png` (greyscale PNG-8, white=stone, black=background).
5. **Halo removal:** Clear grey pixels within 8px of stone edges (Block A criteria in §5).
6. **Layer 6 — Shadow:** Preserve original shadow. Add contact gradient at prong base.
7. **Layer 5 — Metal grade:** Apply metal-specific sub-group. Delete inapplicable metals.
8. **Layer 4 — Brilliance:** Paint 7 fire flares in prescribed clock positions. Add Secondary_Return.
9. **Layer 3 — Inclusions:** Draw 2–5 curved lines + 1–3 pinpoint reflexes.
10. **Layer 2 — Specular:** Table hot-spot + bloom + girdle returns + pavilion returns.
11. **Stamp Final_Composite:** Cmd/Ctrl+Alt+Shift+E → convert to Smart Object.
12. **Export pipeline:** Run §4 Steps 2–7.
13. **QA self-review:** Complete §5 checklist. Sign retoucher line.
14. **Manifest row:** Fill CSV row per §8 schema.
15. **Handoff prep:** Run §9 to build ZIP.

---

## 4. EXPORT PIPELINE (CLI)

### Prerequisites

**macOS (Homebrew):**
```bash
brew install imagemagick webp exiftool
```

**Ubuntu / Debian:**
```bash
sudo apt-get update && sudo apt-get install -y imagemagick webp libimage-exiftool-perl
```

**Verify:**
```bash
magick --version && cwebp -version && exiftool -ver
```

### Directory setup (once per project)
```bash
mkdir -p exports/{source,base_tif,jpeg_2048,jpeg_3072,webp_2048,webp_3072,masks,masters}
```

### Step 1 — Flatten source to 16-bit TIFF
```bash
# Batch all source files:
for f in exports/source/*.jpg; do
  name=$(basename "${f%_SOURCE.jpg}")
  magick "$f" \
    -colorspace sRGB \
    -depth 16 \
    "exports/base_tif/${name}_BASE.tif"
  echo "Flattened: ${name}_BASE.tif"
done
```

### Step 2 — Standard JPEG (2048px, quality 80)
```bash
for f in exports/base_tif/*.tif; do
  name=$(basename "${f%_BASE.tif}")
  magick "$f" \
    -resize "2048x2048>" \
    -colorspace sRGB \
    -profile /usr/share/color/icc/colord/sRGB.icc \
    -quality 80 \
    -sampling-factor 2x1 \
    -interlace Plane \
    -strip \
    -define jpeg:dct-method=float \
    "exports/jpeg_2048/${name}_2048.jpg"
  echo "JPEG 2048: ${name}_2048.jpg"
done
```

### Step 3 — Retina JPEG (3072px, quality 80)
```bash
for f in exports/base_tif/*.tif; do
  name=$(basename "${f%_BASE.tif}")
  magick "$f" \
    -resize "3072x3072>" \
    -colorspace sRGB \
    -profile /usr/share/color/icc/colord/sRGB.icc \
    -quality 80 \
    -sampling-factor 2x1 \
    -interlace Plane \
    -strip \
    -define jpeg:dct-method=float \
    "exports/jpeg_3072/${name}_3072.jpg"
  echo "JPEG 3072: ${name}_3072.jpg"
done
```

### Step 4 — Standard WebP (from 2048 JPEG)
```bash
for f in exports/jpeg_2048/*.jpg; do
  base=$(basename "${f%.jpg}")
  cwebp -q 78 -m 6 -mt -metadata none -sharp_yuv \
    "$f" -o "exports/webp_2048/${base}.webp"
  echo "WebP 2048: ${base}.webp"
done
```

### Step 5 — Retina WebP (from 3072 JPEG)
```bash
for f in exports/jpeg_3072/*.jpg; do
  base=$(basename "${f%.jpg}")
  cwebp -q 78 -m 6 -mt -metadata none -sharp_yuv \
    "$f" -o "exports/webp_3072/${base}.webp"
  echo "WebP 3072: ${base}.webp"
done
```

### Step 6 — Validate all exports
```bash
echo "=== JPEG 2048 VALIDATION ==="
for f in exports/jpeg_2048/*.jpg; do
  w=$(magick identify -format "%w" "$f")
  h=$(magick identify -format "%h" "$f")
  q=$(exiftool -s3 -JPEGQualityEstimate "$f" 2>/dev/null || echo "N/A")
  cs=$(magick identify -format "%[colorspace]" "$f")
  [ "$w" -le 2048 ] && [ "$h" -le 2048 ] && wok="OK" || wok="FAIL"
  echo "$wok $(basename $f) | ${w}x${h} | Quality:$q | $cs"
done

echo "=== WEBP 2048 VALIDATION ==="
for f in exports/webp_2048/*.webp; do
  info=$(magick identify -format "%w %h %[colorspace]" "$f")
  echo "OK $(basename $f) | $info"
done

echo "=== MASK PNG VALIDATION ==="
for f in exports/masks/*_MASK.png; do
  cs=$(magick identify -format "%[colorspace]" "$f")
  w=$(magick identify -format "%w" "$f")
  h=$(magick identify -format "%h" "$f")
  [ "$cs" = "Gray" ] && cok="OK" || cok="FAIL WRONG COLORSPACE: $cs"
  echo "$cok $(basename $f) | ${w}x${h}"
done
```

### Step 7 — Strip EXIF / metadata
```bash
exiftool -all= -overwrite_original exports/jpeg_2048/ exports/jpeg_3072/
echo "EXIF stripped from all JPEG exports"
# WebP already stripped via cwebp -metadata none
# PNG masks have no embedded metadata by default
```

### Quick single-file test
```bash
SKU="AJ-DIA-410190" VIEW="front" METAL="wg"
magick "exports/source/${SKU}_${VIEW}_${METAL}_SOURCE.jpg" \
  -resize "2048x2048>" -colorspace sRGB -quality 80 \
  -sampling-factor 2x1 -interlace Plane -strip \
  "exports/jpeg_2048/${SKU}_${VIEW}_${METAL}_2048.jpg" && \
cwebp -q 78 -m 6 -mt -metadata none -sharp_yuv \
  "exports/jpeg_2048/${SKU}_${VIEW}_${METAL}_2048.jpg" \
  -o "exports/webp_2048/${SKU}_${VIEW}_${METAL}_2048.webp" && \
echo "Test export complete: ${SKU}_${VIEW}_${METAL}"
```

---

## 5. PER-IMAGE QA SIGN-OFF CHECKLIST

Complete for EVERY image before handoff.

```
IMAGE FILENAME:  ___________________________________
SKU:             ___________________________________
VIEW:            front / angle / lifestyle / detail / group
METAL:           white_gold / yellow_gold / rose_gold
RETOUCHER:       ___________________________________
REVIEW DATE:     ___________________________________ (YYYY-MM-DD)
LEAD QA:         ___________________________________
```

### Block A — Halo Removal
- [ ] A1  Zero grey pixels at 400% zoom within 8px of any stone edge
- [ ] A2  Zero dark-edge artifact after halo removal
- [ ] A3  Zero colour-cast fringe (eyedrop 1px sample in transition)
- [ ] A4  Background tone seamless ±4 L* delta from surrounding area
- [ ] A5  No Content-Aware Fill smear visible at transition zone

### Block B — Mask Quality
- [ ] B1  Stone alpha mask: no stair-step aliasing at 200% zoom
- [ ] B2  Mask feather ≤0.5px (check Properties panel)
- [ ] B3  No stone transparency bleeding onto prong/bezel metal
- [ ] B4  MASK.png dimensions match parent image exactly
- [ ] B5  MASK.png is greyscale PNG-8 (confirmed via CLI validator)
- [ ] B6  Mask white=255 covers full stone; black=0 covers background

### Block C — Stone Brilliance
- [ ] C1  Minimum 6 distinct spectral hue flares visible
- [ ] C2  No two flares mirror-symmetric across any axis
- [ ] C3  No two flares share the same 45° angular quadrant
- [ ] C4  Table hot-spot present at geometric centre of table facet
- [ ] C5  Hot-spot has hard inner core (≤2px) + soft bloom (4–6px)
- [ ] C6  Girdle return reflections present (4–6 ellipses)
- [ ] C7  Pavilion return reflections present (2–3 diffuse ovals)
- [ ] C8  Micro-inclusions present — 2–5 curved lines at 200% zoom
- [ ] C9  Pinpoint reflectors present — 1–3 white 2px dots
- [ ] C10 Stone does NOT look synthetic/CGI — inclusions break clarity
- [ ] C11 All brilliance layers clipped to Mask_Clean (zero bleed)

### Block D — Metal Grading
- [ ] D1  [WG] Hue 0°, Sat 4–8%, Val 88–96% (Info panel verified)
- [ ] D2  [WG] Cool blue-grey highlight at reflection edge
- [ ] D3  [WG] Grain texture on brushed surfaces (Luminosity mode)
- [ ] D4  [YG] Hue 38–44°, Sat 62–72%, Val 78–88%
- [ ] D5  [YG] No orange shift (Hue must be ≤46°)
- [ ] D6  [YG] No red/rose-gold shift (Hue must be ≥35°)
- [ ] D7  Sub-reflection of stone hue present on metal below girdle
- [ ] D8  Inapplicable metal sub-group deleted from PSD master

### Block E — Shadow & Contact
- [ ] E1  Original shadow geometry unchanged from source
- [ ] E2  No shadow clipping, hue-shift, or opacity reduction
- [ ] E3  Contact gradient added at prong/bezel base (8px feather)
- [ ] E4  Shadow_Original layer remains locked and unmodified

### Block F — Technical Specs
- [ ] F1  Colour profile: sRGB IEC61966-2.1 embedded (≤3KB)
- [ ] F2  JPEG chroma subsampling: 4:2:0 (NOT 4:4:4)
- [ ] F3  JPEG quality: exactly 80 (verify via exiftool)
- [ ] F4  WebP quality: 75–80 (verify via cwebp -print_ssim)
- [ ] F5  2048px variant: long edge exactly 2048px (±0px tolerance)
- [ ] F6  3072px variant: long edge within 3072–4096px range
- [ ] F7  Filename matches convention: [SKU]_[view]_[metal]_[px].[ext]
- [ ] F8  CSV manifest row completed and verified for this image
- [ ] F9  PSD master saved with all 8 named layers intact
- [ ] F10 Base layer double-locked (Position + Pixels)
- [ ] F11 Final_Composite regenerated after last layer change
- [ ] F12 No EXIF GPS data embedded in any export file

### Block G — Deliverables
- [ ] `[SKU]_[view]_[metal]_MASTER.psd`
- [ ] `[SKU]_[view]_[metal]_MASK.png`
- [ ] `[SKU]_[view]_[metal]_2048.jpg`
- [ ] `[SKU]_[view]_[metal]_2048.webp`
- [ ] `[SKU]_[view]_[metal]_3072.jpg`
- [ ] `[SKU]_[view]_[metal]_3072.webp`
- [ ] CSV manifest row filled and saved

### Sign-off
```
RETOUCHER SELF-REVIEW:  ______________________  DATE: __________
LEAD QA APPROVAL:       ______________________  DATE: __________
STATUS: [ ] APPROVED FOR HANDOFF   [ ] RETURNED FOR REVISION

REVISION NOTES:
_______________________________________________________________
_______________________________________________________________
```

**REMINDER:** Do not upload any file to Shopify. All uploads handled exclusively by Zachary @ Cloude Cowork.

---

## 6. SHOPIFY METADATA TEMPLATES & FORMULAS

### Formulas

**ALT TEXT** — max 125 characters, no HTML, no price, no special characters:
```
[Brand] [metal] [stone type] [product type] [view] [clarity grade]
```
Lead with brand. End hero image with clarity grade.

**TITLE** — max 70 characters (Google Shopping truncation), Title Case:
```
[Brand] [Material] [Stone] [Product Type] | [Key Attribute]
```

**DESCRIPTION** — 120–160 chars per image:
```
[Cut]-cut [clarity] [stone] set in [karat] [metal] [setting]. [Cert note]. [View note].
```

### Copy-paste ready — CC-ST001 White Gold Stud

**FRONT VIEW**
- **Alt:** `Cloude Cowork white gold diamond stud earring front view VVS1 clarity`
- **Title:** `Cloude Cowork White Gold Diamond Stud Earring | VVS1 Clarity`
- **Description:** `Brilliant-cut VVS1 diamond set in 14k white gold four-prong setting. Conflict-free, GIA-certified. Shown from front angle.`
- **Filename:** `CC-ST001_front_wg_2048.jpg` / `.webp`

**ANGLE VIEW**
- **Alt:** `Cloude Cowork white gold diamond stud earring three-quarter angle view prong detail`
- **Title:** `Cloude Cowork White Gold Diamond Stud Earring | Angle View`
- **Description:** `Three-quarter angle view of VVS1 brilliant-cut diamond in 14k white gold. Shows prong detail, stone depth, and setting profile.`
- **Filename:** `CC-ST001_angle_wg_2048.jpg` / `.webp`

**LIFESTYLE VIEW**
- **Alt:** `Cloude Cowork white gold diamond stud earring worn on earlobe lifestyle close-up`
- **Title:** `Cloude Cowork White Gold Diamond Stud Earring | Worn View`
- **Description:** `Lifestyle close-up of 14k white gold diamond stud earring worn on earlobe. Natural studio light, soft contact shadow, VVS1 clarity.`
- **Filename:** `CC-ST001_lifestyle_wg_2048.jpg` / `.webp`

### Copy-paste ready — CC-ST002 Yellow Gold Stud

**FRONT VIEW**
- **Alt:** `Cloude Cowork yellow gold diamond stud earring front view VVS2 clarity warm gold`
- **Title:** `Cloude Cowork Yellow Gold Diamond Stud Earring | VVS2 Clarity`
- **Description:** `Brilliant-cut VVS2 diamond set in 18k yellow gold four-prong setting. Warm amber finish. Conflict-free, GIA-certified. Front angle view.`
- **Filename:** `CC-ST002_front_yg_2048.jpg` / `.webp`

**ANGLE VIEW**
- **Alt:** `Cloude Cowork yellow gold diamond stud earring three-quarter angle warm gold prong`
- **Title:** `Cloude Cowork Yellow Gold Diamond Stud Earring | Angle View`
- **Description:** `Three-quarter angle view of VVS2 diamond in 18k yellow gold. Shows warm gold prong detail and stone brilliance against white background.`
- **Filename:** `CC-ST002_angle_yg_2048.jpg` / `.webp`

**LIFESTYLE VIEW**
- **Alt:** `Cloude Cowork yellow gold diamond stud earring worn lifestyle close-up warm light`
- **Title:** `Cloude Cowork Yellow Gold Diamond Stud Earring | Worn View`
- **Description:** `Lifestyle close-up of 18k yellow gold diamond stud earring on earlobe. Warm natural light enhances gold finish and VVS2 stone clarity.`
- **Filename:** `CC-ST002_lifestyle_yg_2048.jpg` / `.webp`

### Shopify upload sequence (Zachary only)

1. Products → [Product] → Media tab
2. Upload order: `front` → `angle` → `lifestyle` → `detail` → `group`
3. Primary (hero) image = front view, 2048px standard JPEG
4. After each upload: click "Edit alt text" → paste exact alt text from above
5. Never rename after upload (Shopify CDN caches by filename)
6. Verify retina load: Storefront → Product page on HiDPI display
7. Check Google Search Console after 48h for image indexing

---

## 7. JSON-LD STRUCTURED DATA REFERENCE

Replace `[STORE]` with actual Shopify CDN path segment.

### CC-ST001 White Gold Stud
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Cloude Cowork White Gold Diamond Stud Earring",
  "image": [
    "https://cdn.shopify.com/s/files/[STORE]/CC-ST001_front_wg_2048.jpg",
    "https://cdn.shopify.com/s/files/[STORE]/CC-ST001_angle_wg_2048.jpg",
    "https://cdn.shopify.com/s/files/[STORE]/CC-ST001_lifestyle_wg_2048.jpg"
  ],
  "description": "Brilliant-cut VVS1 diamond set in 14k white gold four-prong setting.",
  "brand": { "@type": "Brand", "name": "Cloude Cowork" },
  "material": "14k White Gold",
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Clarity",   "value": "VVS1" },
    { "@type": "PropertyValue", "name": "Cut",       "value": "Brilliant" },
    { "@type": "PropertyValue", "name": "Setting",   "value": "Four-Prong" },
    { "@type": "PropertyValue", "name": "Certified", "value": "GIA" }
  ]
}
```

### CC-ST002 Yellow Gold Stud
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Cloude Cowork Yellow Gold Diamond Stud Earring",
  "image": [
    "https://cdn.shopify.com/s/files/[STORE]/CC-ST002_front_yg_2048.jpg",
    "https://cdn.shopify.com/s/files/[STORE]/CC-ST002_angle_yg_2048.jpg",
    "https://cdn.shopify.com/s/files/[STORE]/CC-ST002_lifestyle_yg_2048.jpg"
  ],
  "description": "Brilliant-cut VVS2 diamond set in 18k yellow gold four-prong setting.",
  "brand": { "@type": "Brand", "name": "Cloude Cowork" },
  "material": "18k Yellow Gold",
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Clarity",   "value": "VVS2" },
    { "@type": "PropertyValue", "name": "Cut",       "value": "Brilliant" },
    { "@type": "PropertyValue", "name": "Setting",   "value": "Four-Prong" },
    { "@type": "PropertyValue", "name": "Certified", "value": "GIA" }
  ]
}
```

---

## 8. MANIFEST CSV SCHEMA

### Column order (do not change)
```
source_zip,zip_path,original_filename,stock_id,file_size_bytes,detected_format,width_px,height_px,sha256,duplicate_group_id,is_canonical_unique,usable_status,normalized_filename,issue
```

### Column definitions

| Column | Type | Rule |
|--------|------|------|
| `source_zip` | string | Original delivery ZIP filename |
| `zip_path` | string | Path inside the ZIP |
| `original_filename` | string | As-received filename |
| `stock_id` | string | AJLLC stock ID (numeric or `AJ-DIA-######`) |
| `file_size_bytes` | int | 0 = zero-byte placeholder (unusable) |
| `detected_format` | enum | `JPEG` \| `PNG` \| empty for unusable |
| `width_px` | int | Actual pixel width |
| `height_px` | int | Actual pixel height |
| `sha256` | hex | Full SHA-256 hash for dedup |
| `duplicate_group_id` | string | `DUPG####` — groups files with identical SHA-256 |
| `is_canonical_unique` | bool | `TRUE` = keep this copy, `FALSE` = duplicate of canonical |
| `usable_status` | enum | `usable` \| `unusable_zero_byte` \| `unusable_corrupt` |
| `normalized_filename` | string | `[stock_id]__[sha256_prefix10].jpg` |
| `issue` | string | Free-text (e.g., "extension/detected-format mismatch") |

### Rules
- Never silently drop rows. Every source file gets a row.
- Zero-byte files → `usable_status=unusable_zero_byte`, empty format/width/height/hash.
- Duplicates share the same `duplicate_group_id`; exactly one row per group has `is_canonical_unique=TRUE`.
- `normalized_filename` uses the canonical stock_id (from `is_canonical_unique=TRUE` row) — duplicates point back to it.
- Flag format mismatches (e.g., `.jpg` extension but PNG detected) in the `issue` column.

---

## 9. HANDOFF ZIP STRUCTURE

### Build command
```bash
cd exports && zip -r9 \
  ../cloude-cowork-handoff-$(date +%Y%m%d).zip \
  jpeg_2048/ jpeg_3072/ webp_2048/ webp_3072/ masks/ masters/ \
  ../manifest.csv \
  ../README.md \
  ../SHOPIFY_BLACKBOOK_v1.md \
  ../RETOUCHER_PROMPT.md \
  && echo "ZIP created: cloude-cowork-handoff-$(date +%Y%m%d).zip"
```

### Expected ZIP contents
```
cloude-cowork-handoff-YYYYMMDD.zip
├── jpeg_2048/          # standard JPEGs for Shopify upload
├── jpeg_3072/          # retina JPEGs
├── webp_2048/          # standard WebPs
├── webp_3072/          # retina WebPs
├── masks/              # standalone MASK.png files
├── masters/            # layered PSD masters
├── manifest.csv        # per-image manifest with QA status
├── README.md           # handoff summary
├── SHOPIFY_BLACKBOOK_v1.md  # this file
└── RETOUCHER_PROMPT.md # optional retoucher briefing
```

---

## 10. COMMON MISTAKES / DO NOT

**Metadata:**
- ✗ Promotional language in alt text ("50% off diamond studs")
- ✗ Superlatives in alt text ("Best diamond earrings")
- ✗ Alt text >125 characters (screen readers truncate)
- ✗ Title >70 characters (Google Shopping truncates)
- ✗ Same alt text on all variants (duplicate content penalty)
- ✗ Missing alt text on any image (ADA compliance risk)

**File handling:**
- ✗ Uploading TIFF or PNG as product image (JPEG and WebP only)
- ✗ Spaces or special characters in filenames (underscores only)
- ✗ Renaming after Shopify upload (CDN caches by filename)
- ✗ Editing evidence originals (work on copies)

**Retouching:**
- ✗ Painting on Base layer (always locked)
- ✗ Rasterising Mask_Clean Smart Object
- ✗ Flares in mirror-symmetric positions (breaks realism)
- ✗ Table hot-spot without soft bloom (looks CGI)
- ✗ Yellow gold Hue >46° (shifts orange) or <35° (shifts rose)
- ✗ Global metal Hue/Sat adjustments (must be clipped to metal selection)
- ✗ Leaving inapplicable metal sub-group in PSD master
- ✗ Skipping Final_Composite regeneration after layer changes

**Uploads:**
- ✗ Retoucher uploading directly to Shopify — ALL uploads go through Zachary

---

## 11. FACT DISCIPLINE & VERIFICATION

This document extends Blackbook Ultimate v013 (`.agents/skills/blackbook-ultimate/SUPER_BLACKBOOK_ULTIMATE_v013.md`). Universal rules apply:

- **Never invent** stone weights, certifications, karats, clarity grades, prices, or supplier facts.
- **Label** every metadata claim as VERIFIED (from GIA cert / supplier docs), USER-STATED, or CURRENT-UNVERIFIED.
- **Verify current** before publishing: metal prices, diamond comps, Shopify CDN paths, GIA cert numbers, platform fee changes.
- **Preserve** source pixels — Base layer never edited. Original shadow never modified.
- **Chronology** — use absolute dates (YYYY-MM-DD) in manifest and QA sign-off.

For any deviation from this blackbook — new metals, new product categories, new views, new spec dimensions — do not extrapolate. Draft the proposed extension, mark it CURRENT-UNVERIFIED, and route to Zachary for sign-off before production use.

---

**END OF SHOPIFY BLACKBOOK v1.0**

Confirmation phrase when loaded standalone:
`SHOPIFY BLACKBOOK v1.0 LOADED. Ready.`
