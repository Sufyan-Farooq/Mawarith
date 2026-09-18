# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are Muslim families, estate executors, inheritors, and individuals managing the division of a deceased relative's estate according to Islamic jurisprudence (Shariah). Secondary users include Islamic scholars, imams, lawyers, and students of Islamic law (Ilm al-Fara'id) seeking verifiable calculation proofs and structured estate summaries.

## Product Purpose

Mawarith (مَوارِيث) provides an authoritative, mathematically exact, and spiritually reassuring platform for Islamic inheritance distribution. It translates complex rules of Quranic shares (Ashab al-Furood), residuary entitlement (Asabah), partial/total blocking (Hajb), proportional deficit adjustments (Awl), and surplus reallocation (Radd) into an intuitive, transparent interface with verifiable scriptural proofs (Daleel) and official distribution certificates.

## Positioning

Unlike generic financial calculators or opaque legal spreadsheets, Mawarith anchors every allocation in explicit scriptural evidence (Daleel citations from Surah An-Nisa and Sahih Hadith), enforces the strict Shariah debt-and-bequest liquidation waterfall before distribution, and integrates an interactive visual calculation studio alongside a context-aware AI Shariah advisor.

## Operating Context

Used during emotionally sensitive moments of bereavement, family meetings, legal estate planning, or formal distribution execution. Users operate across multiple languages (English, Arabic, Urdu) with full bidirectional LTR/RTL support and multiple international currencies (SAR, USD, PKR, etc.) across desktop and mobile devices.

## Capabilities and Constraints

- **Estate Waterfall Ledger:** Computes gross assets (cash accounts, real estate, gold/jewelry, other personal assets) minus funeral/burial costs, followed by secured and unsecured debts, followed by bequests (Wasiyyah capped at 1/3 for non-heirs), yielding the net distributable estate.
- **Comprehensive Heir Categorization:** Evaluates over 22 distinct heir categories (spouses, parents, grandparents, primary offspring, grandchildren, full/consanguine/uterine siblings, nephews, uncles, cousins).
- **Consensus Calculation Engine:** Implements the majority Sunni consensus (Jumhur: Hanafi, Maliki, Shafi'i, Hanbali standard rules) handling Fardh, Asabah (bi-nafsihi, bi-ghayrihi, ma'a ghayrihi), Hajb Nuqsan, Hajb Hirman, Awl (share expansion), and Radd (proportional return).
- **Evidentiary Verification (Daleel):** Provides modal breakdowns linking each heir's assigned fraction to primary Islamic texts (Quranic ayat and Sahih ahadith).
- **Distribution Certificate:** Generates a formal, printable/exportable estate distribution certificate.
- **AI Shariah Consultant:** Gemini-powered interactive assistant answering nuanced inheritance queries with conversation-to-studio state synchronization.

## Brand Commitments

- **Name:** Mawarith (مَوارِيث) — Shariah-Compliant Inheritance Platform.
- **Voice & Tone:** Dignified, reverent, solemn, transparent, unhurried, and reassuring.
- **Aesthetic Direction:** Elevated modern Islamic visual identity. Deep obsidian neutrals, warm ivory backgrounds (`#fbfaf8`), jade/emerald accents, and gold accents. No frivolous animations, gamification badges, or generic AI templates.

## Evidence on Hand

- Verified Quranic ayat (Surah An-Nisa 4:11, 4:12, 4:176) and Sahih Hadith cataloged in `src/data/daleel.ts`.
- Validated calculation engine and complex test cases in `src/engine/calculator.ts` and `src/data/samples.ts`.
- Multilingual translation dictionaries across English, Arabic, and Urdu in `src/i18n/translations.ts`.

## Product Principles

1. **Scriptural Authority First (Daleel):** Never compute a distribution without making the theological and textual foundation immediately inspectable and transparent.
2. **Absolute Mathematical Precision:** Zero tolerance for rounding leaks, unallocated fractions, or ambiguous decimal remainders; fractions must mathematically resolve to 1.
3. **Dignity in Bereavement:** Interfaces must respect the user's state of mind with clear visual hierarchy, calm layouts, and zero unnecessary friction or aggressive prompts.
4. **First-Class Multilingual Experience:** Arabic and Urdu are equal first-class citizens alongside English, featuring proper typography (Amiri, Noto Naskh) and true RTL layouts.

## Accessibility & Inclusion

- Bidirectional layout support (RTL for Arabic and Urdu, LTR for English) with dynamic `dir` and `lang` synchronization.
- High-contrast text against backgrounds ensuring readability for older family members and executors.
- Fully accessible keyboard navigation and modal dialogs.
