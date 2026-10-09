# Mawarith (مَوارِيث)

An Islamic inheritance calculator for understanding an estate and each surviving relative’s share. Available in English, Arabic and Urdu.

## The calculation flow

1. **Estate:** enter cash, property, jewelry and other assets. Deduct funeral costs, secured and other debts, and any bequest. Optional item details keep separate accounts or properties organized.
2. **Family:** select the deceased’s gender and surviving relatives. Extended relatives and personal names are available through optional sections.
3. **Shares:** review fractions, monetary amounts, per-person shares, excluded relatives, adjustments and supporting evidence. Copy a summary for your own use.

The calculator starts blank. Example cases are available through “Explore example cases” and are clearly identified. On desktop the breakdown stays alongside the inputs; on mobile each stage gets its own screen.

This is a starting point for understanding a distribution. Have a qualified scholar review the family’s circumstances before distributing an estate.

## Development

```sh
npm install
npm run dev
```

The Vite development server opens at http://localhost:5173.

```sh
npm run build
npm run lint
npm test
```

The engine suite covers 12 scenarios including prescribed shares, residuary shares, blocking, Awl, Radd, Umariyyatan, estate deductions and personalized names.

## Project structure

- `src/engine`: calculation rules, estate deductions, fraction arithmetic and tests.
- `src/components`: responsive calculator flow and evidence dialogs.
- `src/i18n`: domain labels and localized workflow copy.
- `src/data`: example cases and supporting evidence.
- `src/utils`: currency formatting and relationship names.
- `PRODUCT.md` and `DESIGN.md`: product and visual direction.

React, TypeScript, Vite and Tailwind CSS. MIT license.
