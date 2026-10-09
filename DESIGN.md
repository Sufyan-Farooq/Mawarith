---
name: Mawarith
description: Shariah-Compliant Inheritance Platform (علم الفرائض والمواريث)
colors:
  primary: "#047857"
  primary-light: "#10b981"
  primary-deep: "#064e3b"
  secondary: "#d97706"
  secondary-light: "#f59e0b"
  neutral-bg: "#fcfbfa"
  neutral-surface: "#ffffff"
  neutral-text: "#0c1015"
  neutral-subtle: "#64748b"
  neutral-border: "#e2e8f0"
typography:
  display:
    fontFamily: "'Plus Jakarta Sans', 'Amiri', 'Noto Nastaliq Urdu', system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "'Plus Jakarta Sans', 'Amiri', 'Noto Nastaliq Urdu', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "'Plus Jakarta Sans', 'Amiri', 'Noto Nastaliq Urdu', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "'Plus Jakarta Sans', 'Amiri', 'Noto Nastaliq Urdu', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Plus Jakarta Sans', 'Amiri', 'Noto Nastaliq Urdu', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.025em"
  caption:
    fontFamily: "'Plus Jakarta Sans', 'Amiri', 'Noto Nastaliq Urdu', system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
  micro:
    fontFamily: "'Plus Jakarta Sans', 'Amiri', 'Noto Nastaliq Urdu', system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.3
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-surface}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  button-secondary:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
---

# Design System: Mawarith

## Overview

**Creative North Star: "The Sacred Sanctuary"**

Mawarith embodies the reverent precision of classical Islamic jurisprudence combined with contemporary software craftsmanship. Dealing with the division of an estate after a death requires an atmosphere that is serene, unhurried, mathematically unassailable, and respectful of bereavement. The interface avoids aggressive visual noise, generic AI tropes, and cold administrative cynicism.

Surfaces rest on a warm, organic ivory foundation (`#fcfbfa`) reminiscent of parchment, contrasted with deep obsidian typography (`#0c1015`), dignified emerald/jade accents (`#047857`) representing life, heritage, and peace, and restrained warm brass (`#d97706`) denoting classical rulings and historical scholarly consensus.

**Key Characteristics:**
- Quiet, sacred restraint that honors families in mourning.
- First-class bidirectional typography treating Arabic (`Amiri`), Urdu (`Noto Nastaliq Urdu`), and English (`Plus Jakarta Sans`) with equal typographic weight.
- Uncompromising mathematical transparency with live share breakdowns and evidentiary Daleel modals.
- Clean planar layering with micro-shadows rather than gaudy gradients or heavy skeuomorphism.

## Colors

The palette balances warm organic neutrality with deep mineral tones and sacred jewel accents.

### Primary
- **Sanctuary Jade** (#047857): Anchors primary interactive actions, affirmative calculation results (such as Radd surplus), and verified status badges. Used with deliberate scarcity.
- **Jade Sheen** (#10b981): Ambient highlights, glowing progress bars, and subtle borders.
- **Deep Jade** (#064e3b): Hover states and dense focus indicators.

### Secondary
- **Scholarly Brass** (#d97706): Classical jurisprudence indicators, Al-Awl denominator adjustments, and Al-Umariyyatan special scenario notices.
- **Warm Amber** (#f59e0b): Secondary badges, warnings, and attention indicators.

### Neutral
- **Warm Parchment** (#fcfbfa): Canvas root background providing warmth and reducing eye strain.
- **Pure Canvas** (#ffffff): Card, modal, and elevated surface containers.
- **Obsidian Dark** (#0c1015): Primary body typography, high-contrast headings, and crisp numerals.
- **Slate Subtle** (#64748b): Secondary labels, unit markers, and structural guidance copy.
- **Hairline Border** (#e2e8f0): Subtle containment lines and card outlines.

### Named Rules
**The Reverence Rule.** Colored accents must never exceed 15% of surface area. Primary jade and brass exist as beacons of clarity and scriptural authority, not decorative paint.

## Typography

**Display Font:** Plus Jakarta Sans / Amiri / Noto Nastaliq Urdu  
**Body Font:** Plus Jakarta Sans / Amiri / Noto Nastaliq Urdu  
**Label/Mono Font:** System Monospace (tabular figures for fractions, currencies, and percentages)

**Character:** Dignified geometric clarity in Latin paired with calligraphic warmth in Arabic and Nastaliq Urdu script, maintaining baseline alignment across language shifts.

### Hierarchy
- **Display** (Bold 700, clamp(1.75rem, 4vw, 2.5rem), 1.2): Main view headings.
- **Headline** (SemiBold 600, 1.25rem / 20px, 1.3): Major card headers, modal titles, and heir category sections.
- **Title** (SemiBold 600, 1rem / 16px, 1.4): Heir names, ledger items, and accordion triggers.
- **Body** (Regular 400, 0.875rem / 14px, 1.5): Descriptive text, scholarly daleel excerpts, and instructions.
- **Label** (SemiBold 600, 0.75rem / 12px, letter-spacing 0.025em): Form labels, table headers, and status pills.
- **Caption** (Medium 500, 11px, 1.4): Currency tags, secondary footnotes, and auxiliary status text.
- **Micro** (Medium 500, 10px, 1.3): Compact badge metadata and fine ledger labels.

### Named Rules
**The Tabular Number Rule.** All monetary amounts, fractions, and percentages must render with monospace tabular figures (`font-mono` or `font-variant-numeric: tabular-nums`) to preserve columnar scanability.

## Layout

The application operates on a responsive single-page canvas with a max-width container of `80rem` (1280px) centered horizontally. The Visual Studio arranges inputs and live outputs into a harmonious two-column asymmetric layout on desktop (inputs on left in LTR / right in RTL, live calculation summary on right/left), stacking into a focused vertical flow on mobile.

Spacing strictly adheres to an 8px modular scale (4px, 8px, 12px, 16px, 24px, 32px, 48px).

## Elevation & Depth

Surfaces rely on subtle tonal contrast and soft micro-elevation rather than dark, heavy shadows.

### Shadow Vocabulary
- **Micro Shadow** (`box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)`): Standard resting card elevation.
- **Float Shadow** (`box-shadow: 0 12px 32px -4px rgba(12, 16, 21, 0.12), 0 4px 12px -2px rgba(12, 16, 21, 0.08)`): Modals, floating dropdowns, and active tooltips.
- **Ambient Jade Glow** (`box-shadow: 0 0 24px -4px rgba(16, 185, 129, 0.25)`): Active calculation highlight states.

### Named Rules
**The Flat-Rest Rule.** All cards rest flat against the parchment background with crisp hairline borders (`border-slate-200/80`). Shadows indicate z-axis elevation during modal presentations or hover states.

## Shapes

Corners use gentle, organic rounding:
- Modals & Hero Containers: `24px` (rounded-3xl / 2xl)
- Primary Cards & Accordions: `16px` (rounded-2xl)
- Buttons & Input Fields: `10px` (rounded-xl / lg)
- Badges & Pills: `9999px` (rounded-full)

Form inputs utilize a 1px solid stroke with inset highlight on focus.

## Components

### Buttons
- **Shape:** Rounded corners (10px).
- **Primary:** Solid Jade (`#047857`), white text, subtle micro-shadow, transitions to Deep Jade (`#064e3b`) on hover.
- **Secondary / Ghost:** White background, slate border (`#e2e8f0`), dark obsidian text (`#0c1015`), subtle hover wash (`#f8fafc`).

### Cards / Containers
- **Corner Style:** Rounded-2xl (16px).
- **Background:** Crisp pure white (`#ffffff`).
- **Border:** 1px hairline border (`#e2e8f0` / `border-slate-200/90`).
- **Internal Padding:** 16px (mobile) to 24px (desktop).

### Notice & Jurisprudence Alerts
- **Corner Style:** Rounded-xl (12px).
- **Background:** Subtle tinted wash (e.g. Amber 50/40 or Jade 50/40) with balanced, full perimeter border (`border-amber-200/80` or `border-jade-200/80`).
- **Rule:** Never use heavy asymmetric single-side tab borders (`border-s-4`); use balanced, complete borders with an icon container.

### Inputs / Fields
- **Style:** Background white, border `#e2e8f0`, text `#0c1015`, placeholder `#94a3b8`.
- **Focus:** 2px ring with `rgba(16, 185, 129, 0.2)` glow and border `#10b981`.

## Do's and Don'ts

### Do:
- **Do** maintain authentic Arabic script typography (Amiri) with correct line heights when switching to Arabic or Urdu.
- **Do** accompany every calculated heir fraction with a clickable Daleel citation.
- **Do** format monetary values with currency symbols, thousand separators, and tabular numeric alignment.
- **Do** use balanced 4-sided containment borders with soft icon badges for special jurisprudence alerts.

### Don't:
- **Don't** use asymmetric colored side-tab borders (`border-s-4` / `border-l-4`) on notice cards.
- **Don't** use harsh neon colors or high-contrast saturation that disrupts the calm, solemn environment.
- **Don't** hide or round off fractions in ways that obscure exact Quranic share definitions.
- **Don't** break RTL layout harmony when rendering mixed Arabic and numeric/Latin strings.


## Calculator surface refinement (October 2026)

Mode: Operate. The established ivory, jade and geometric brand mark remain. The calculator uses a quiet introduction, an optional example picker and an Estate → Family → Shares sequence. Desktop pairs the current input stage with a live breakdown; below 1024px one stage is visible at a time, including persistent stage navigation on the results screen.

Results are divided rows, rather than a horizontal table or a dark dashboard. Show relationship, fraction, percentage, amount, per-person amount, evidence and an optional explanation. Do not use certificates, release tags or compliance badges. A blank estate is the starting state; all sample values are identified.

The calculator uses green-tinted neutrals: foreground `#17221d`, secondary `#52625a`, muted `#67746d`, border `#dce2dc`, field border `#d5ded6`, selection `#d1e9df`, and surface tint `#edf5ef`. Jade `#047857` and deep jade `#065f46` identify actions and totals. Notices use `#f6efe0` with text `#6c4d19`. Distribution colors are `#047857`, `#ad7932`, `#517c75`, `#755f50`, `#64748b`, and `#6f6c96`.

English retains Plus Jakarta Sans; Arabic uses Amiri and Urdu uses Noto Naskh Arabic for readable form controls. Form labels and supporting text are 13–15px, inputs 16px, headings 21–23px and the page heading 29–42px. Buttons use 8px corners; workspace surfaces use 12px corners; native dialogs use 16px corners. Main actions are at least 48px high and number-stepper buttons 44px square.

Use native select controls and native modal dialogs, with browser focus containment, Escape dismissal and focus restoration. Respect reduced motion. Step transitions scroll immediately after the new content renders, avoiding moving click targets.


## Heritage refinement

The calculator retains its focused flow while making its Islamic identity more visible. Use a bilingual Arabic/Latin wordmark, an Arabic Mawarith signature with a precise eight-point geometric divider, and a warm editorial heading face (Lora for English, Amiri for Arabic). The primary headline names the task: understanding the family's inheritance shares.

Brass accents (`#96713b`, foreground `#715323`, light surface `#f5efdf`, and borders `#daceb5` / `#e4d7b9`) identify heritage details and evidence links. A warm white navigation surface (`#fffdf8`), cream step navigation (`#f8f6ef`) and soft sage net-estate band (`#f3f5ed`) provide depth through tone. The wordmark uses deep jade `#204c3b`.

The results heading is “Shares & their evidence.” Evidence actions remain attached to each heir and open the existing source dialog. Geometric decoration is confined to the brand signature and brief welcome introduction; keep forms clear. The welcome includes a short Bismillah followed by the established practical instructions. On phones, compress the signature into one row and stack the bilingual header wordmark to preserve room for language and currency controls.
