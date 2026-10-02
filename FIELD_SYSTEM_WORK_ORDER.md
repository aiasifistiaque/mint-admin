# Work Order — Unified Field System

**Scope:** the admin's schema → form / table / view pipeline.
**Status:** plan only. No code changed.
**Audit date:** 2026-09-19

Each item: **files → change → done-when**. `BLOCKER` marks items that gate later work.
Sizes: **S** ≤ 1h, **M** ≤ half-day, **L** ≤ 2 days.

---

## Background

The pipeline today:

```
src/models/*/*.schema.ts                           <- authored schema (untyped in practice)
  |- createFormFields({schema, layout, type})      <- model/functions/createFormFields.ts
  |    `- FormMain / FormPage / FormContent        <- 3 form shells
  |         `- FormInput.tsx                       <- 720-line switch, 55 cases
  |              `- utils/inputs/V*.tsx            <- ~60 input components
  |- convertToTableFields({schema, fields, menu})
  |    `- TableRowComponent -> TableData -> CustomTd   <- 2 nested switches
  `- convertToViewFields({schema, fields})
       `- ViewItemModal / ViewServerModal / ViewPageItem
            `- renderViewItem  +  3 stale duplicates
```

Backend parity: `GET /:path/get/schema` serves the same shape from
`backend/library/controllers/config/getSchema.controller.ts`, derived from
`SettingType.schema` + `convertType()`.

**Root cause of the defect list below:** field behaviour lives in switch statements,
not in data. Every new type needs edits in 4+ files, and nothing forces those edits
to happen together.

### Verified defects

| # | Finding | Evidence |
|---|---|---|
| 1 | 10 declared input types have no `case` — `radio`, `multi-select`, `checkbox-menu`, `shadow`, `font-style`, `nested-text`, `menu`, `number`, `text`, `fint-size` (typo of `font-size`). They fall to `default` -> `VInput`. A `radio` field silently renders a text box. | `types/data-types/inputDataOptions.ts` vs `create-page/inputs/form-input/FormInput.tsx:103` |
| 2 | 11 implemented types aren't in the union — `variant`, `video`, `icon`, `basic-editor`, `case-tag`, `section-tag`, `model-fields`, `form-fields`, `settings`, `time`, `select-tag`. No autocomplete, no type error on typos. | same |
| 3 | `'checkbox'` appears twice in `inputDataOptions` | `inputDataOptions.ts:24,35` |
| 4 | 4 near-identical `renderContent` implementations. Only `renderViewItem.tsx:233` is correct; the two copies in `modal-components/ViewItem.tsx:247,254` pass `dangerouslySetInnerHTML={children}` (raw string, not `{__html}`) and lack `date-only`/`textarea`. | 4 files |
| 5 | 9 of 18 declared `ViewDataType`s are unhandled — `object` renders `[object Object]`, `price` gets no currency format, `boolean` prints `true`. | `types/data-types/index.ts:5` |
| 6 | 5 of 15 declared `TableDataFieldType`s unhandled — `price`, `text`, `data-array`, `data-array-count` (`menu` is intercepted upstream). `utils/texts/Price.tsx` exists but nothing routes to it. | `table-components/data/TableData.tsx:105` |
| 7 | Two competing condition systems. `renderCondition: (d)=>bool` (works) and `renderIf: {field,operator,value}` — whose evaluator is inverted and incomplete: `if (!condition) return false`, `case 'eq': return formData[field] !== value`, `default: return true` (unknown operator hides the field). | `form-components/FormMain.tsx:133-143` |
| 8 | Server-sent conditions are broken by construction. The backend does `renderCondition.toString()`; the client calls it as a function. Any server-driven schema with a condition throws. | `backend/library/controllers/config/getSchema.controller.ts:18` |
| 9 | Hidden fields still submit. `renderCondition` only hides the input; the value stays in `formData`/`changedData`. Uncheck `isDiscount` and a stale `discount` is still PATCHed. | `create-page/page/FormPage.tsx:116` |
| 10 | No validation layer at all. Zero `isInvalid` / `Field.ErrorText` in the library; `FormStack` renders label + children + helper only. Required is HTML-only; server errors go to a toast, never to the field. | `utils/inputs/input-components/FormStack.tsx` |
| 11 | `createFormFields` hand-copies ~25 optional props twice and the branches have drifted: the array branch has `dataModel: fieldConfig.model` (bug) and omits `tooltip`/`colorTheme`. | `model/functions/createFormFields.ts:52` |
| 12 | Key-name drift: `createFormFields` emits `valKey`, `FormInput` reads `item?.valueKey`, `VDataTags` reads `valKey`, `VDataSelect` reads `valueKey`. | 4 files |
| 13 | `displayIntable: true` (typo) in two product fields silently drops those columns. Nothing catches it because schemas are untyped. | `src/models/products/product.schema.ts:139,146` |
| 14 | `convertToTableFields` reads `tableLabel`, `editable`, `colorTheme`, `helperText` — none declared in `CommonProps`. | `convertToTableFields.ts` vs `types/schema.types.ts` |
| 15 | Three parallel type vocabularies with no mapping: backend `setttingsTypeOptions` (storage: `array-object`, `uri`, `email`...), admin `InputDataType`, and `ViewDataType`/`TableDataFieldType`. `convertType` maps only 3 of them. | backend `settings.type.ts` + 2 admin files |

---

## Phase 0 — Vocabulary & silent failures

*No behaviour change. Converts ~25 classes of silent failure into compile errors.*

### WO-01 — Single source of truth for type ids — **BLOCKER, S**
**Files:** `src/components/library/types/data-types/inputDataOptions.ts`, `InputDataType.ts`
Dedupe `'checkbox'` (index 24 and 35). Delete `'fint-size'` (dupe of `font-size`).
Add the 11 live-but-undeclared types: `variant`, `video`, `icon`, `basic-editor`,
`case-tag`, `section-tag`, `model-fields`, `form-fields`, `settings`, `time`, `select-tag`.
**Done when:** the declared-vs-handled diff is empty in both directions except the 10 known-unimplemented (WO-02).

### WO-02 — Quarantine the unimplemented types — **S**
**Files:** `inputDataOptions.ts`
Move `radio`, `multi-select`, `checkbox-menu`, `shadow`, `font-style`, `nested-text`, `menu`
into an exported `PLANNED_FIELD_TYPES` array, excluded from `InputDataType`.
Keep `text` and `number` live (they work via the `default` branch); give them explicit cases in WO-11.
**Done when:** `type: 'radio'` is a TypeScript error, not a text box.

### WO-03 — Make `CommonProps` match reality — **BLOCKER, M**
**Files:** `src/components/library/types/schema.types.ts`
Add keys the converters already read but that aren't declared: `tableLabel`, `editable`,
`editType`, `colorTheme`, `folder`, `labelKey`, `valueKey`, `readOnlyOnUpdate`, `style`,
`hasImage`, `helper`, `renderIf`, `displayValue`, `path`, `min`, `max`, `step`,
`threshold`, `values`. Mark `renderIf` `@deprecated`.
**Done when:** `convertToTableFields` and `createFormFields` compile with `schema: SchemaType<T>` instead of `any`.

### WO-04 — Dev-mode schema assertion — **S**
**Files:** new `src/components/library/model/functions/assertSchema.ts`, called from `createFormFields` / `convertTo*Fields`
Under `NODE_ENV !== 'production'`: throw on an unregistered `type`, and on any key not in
the `CommonProps` allowlist. Error names model + field + offending key.
**Done when:** `displayIntable` in `product.schema.ts:139,146` throws at import, naming both fields.

### WO-05 — Fix the three known key bugs — **S**
**Files:** `src/components/library/model/functions/createFormFields.ts`, `utils/inputs/VDataTags.tsx`
- Line 52: `dataModel: fieldConfig.model` -> `fieldConfig.dataModel`.
- Lines 69/107: emit `valueKey`, not `valKey`; `VDataTags.tsx:35` reads `valueKey` with a `valKey` fallback.
- Array branch is missing `tooltip`, `colorTheme`, `folder` — add.
**Done when:** array-branch and scalar-branch outputs are identical for the same field config (unit test).

### WO-06 — `createResolvedField()` replaces both prop-copy blocks — **BLOCKER, M**
**Files:** `createFormFields.ts`
Extract one whitelist-driven mapper; both branches call it. The ~25 hand-copied
`...(x && {x})` spreads collapse to one list.
**Done when:** `createFormFields` is under 60 lines and the WO-05 test still passes.

### WO-07 — Type the authored schemas — **M**
**Files:** `src/models/**/*.schema.ts` (~30 files)
Add `satisfies SchemaType<T>`. Fix whatever WO-03/WO-04 surface.
**Done when:** `npm run type-check` clean.

### WO-08 — Delete the duplicated backend controller — **S**
**Files:** `backend/controllers/common/getSchema.controller.ts`, `backend/controllers/common/convertType.ts`
Byte-identical copies of the `library/` versions. Re-point imports, delete.
**Done when:** one `getSchema` and one `convertType` remain.

> **Gate:** all existing admin pages render unchanged; `type-check` clean.

---

## Phase 1 — Field type registry

### WO-09 — Registry scaffolding — **BLOCKER, L**
**Files:** new `src/components/library/fields/registry/{types.ts,registry.ts,index.ts}`
Define `FieldTypeDescriptor` (input / table / view / storage facets, `changeMode`,
`emptyValue`, `coerceIn`/`coerceOut`, `validate`, `supportsInlineEdit`).
Derive `FieldTypeId` from the registry with `satisfies`; re-export as `InputDataType`
so nothing downstream breaks.

```ts
export type FieldTypeDescriptor = {
  id: FieldTypeId;
  family: 'text'|'number'|'boolean'|'choice'|'relation'|'datetime'
        | 'media'|'style'|'composite'|'geo'|'special';

  // form facet
  input: ComponentType<FieldInputProps>;
  changeMode: 'event'|'value'|'array'|'nested-event'|'nested-value';
  emptyValue: () => unknown;
  coerceIn?:  (raw: unknown) => unknown;   // doc  -> form value
  coerceOut?: (v: unknown) => unknown;     // form -> payload
  validate?:  (v: unknown, f: ResolvedField) => string | null;
  supportsInlineEdit?: boolean;

  // table facet
  table: { type: TableTypeId; cell: ComponentType<CellProps>;
           align?: 'start'|'end'; minW?: string; maxW?: string;
           sortable?: boolean; mobilePriority?: number };

  // view facet
  view: { type: ViewTypeId; render: ComponentType<ViewProps>;
          layout: 'inline'|'full'; hideIfEmptyDefault?: boolean };

  // storage facet (backend parity)
  storage: StorageTypeId;   // one of setttingsTypeOptions
};
```

**Done when:** registry compiles with zero entries and `InputDataType` still resolves.

### WO-10 — Populate descriptors for all ~55 existing types — **L**
**Files:** `fields/registry/descriptors/*.ts` (one per family)
Each entry points at the existing `V*` component — no component rewrites in this item.
**Done when:** every id in `inputDataOptions` has a descriptor; a test asserts registry keys === id list.

### WO-11 — `FormInput` delegates — **BLOCKER, M**
**Files:** `src/components/library/create-page/inputs/form-input/FormInput.tsx`
720 lines / 55 cases -> resolve descriptor, render `descriptor.input`. Per-type prop
wiring (`folder`, `limit`, `menuKey`, ...) moves into each descriptor's `mapProps`.
**Done when:** file is under 60 lines; every form page spot-checked.

### WO-12 — Unify the two `getOnChangeHandler` switches — **M**
**Files:** `create-page/page/form-components/FormMain.tsx:49`, `create-page/page/FormPage.tsx:87`, `functions/getOnChangeHandler.ts`
`FormPage`'s copy is missing `image-array`, `nested-image`, `nested-string`,
`nested-select`, `nested-data-menu`, `icon`, `video` — those fields are silently broken
on that shell. Replace both with `descriptor.changeMode`.
**Done when:** one handler resolver; `FormPage` and `FormMain` behave identically for every type.

### WO-13 — `TableData` delegates — **M**
**Files:** `components/table/table-components/data/TableData.tsx`, `CustomTd.tsx`
Type switch -> `descriptor.table.cell`. Implement the 3 declared-unhandled cells:
`price` (route to `utils/texts/Price.tsx`), `data-array`, `data-array-count`.
**Done when:** the `TableDataFieldType` union and the rendered cells match 1:1.

### WO-14 — One view renderer, three deletions — **BLOCKER, M**
**Files:** keep `components/view/utils/render-view-item/renderViewItem.tsx` (becomes the
`descriptor.view.render` dispatch); delete `table-components/modals/modal-components/renderContent.tsx`;
delete the inline `renderContent` in `modal-components/ViewItem.tsx` and re-point it at
`components/view/view-item/ModalViewItem.tsx`.
**Done when:** exactly one `renderContent` exists in the repo; the broken
`dangerouslySetInnerHTML={children}` at `ViewItem.tsx:247,254` is gone with it.

### WO-15 — Implement the 9 unhandled view types — **M**
**Files:** `renderViewItem.tsx` + descriptors
`object` (recursive definition list — currently `[object Object]`), `price`, `boolean`,
`number`, `image-text`, `data-array-count`, `text`, `string`, `menu`.
**Done when:** `ViewDataType` and the renderer's cases match 1:1.

### WO-16 — `<RichText>` with sanitization — **M**
**Files:** new `src/components/library/utils/texts/RichText.tsx`; used by `renderViewItem` for `editor` / `basic-editor`
Allowlist sanitizer over stored HTML. Currently admin-authored/imported HTML is injected
raw — an XSS path between admins.
**Done when:** no `dangerouslySetInnerHTML` outside `RichText.tsx`.

### WO-17 — Derive facet defaults from the registry — **S**
**Files:** `convertToTableFields.ts`, `convertToViewFields.ts`
Default `type` from `descriptor.table.type` / `descriptor.view.type`; `tableType`/`viewType`
still override. Removes the hardcoded mapping at `convertToViewFields.ts:9-13`.
**Done when:** a new registry entry needs no converter edit.

> **Gate:** the registry is the only place a field type is defined.

---

## Phase 2 — Condition DSL

Replaces `renderCondition` (works, unserializable — defect 8) and `renderIf`
(serializable, broken — defect 7).

```ts
type Cond =
  | { field: string; op: 'eq'|'ne'|'in'|'nin'|'gt'|'gte'|'lt'|'lte'
        |'truthy'|'falsy'|'empty'|'notEmpty'|'contains'|'startsWith'|'regex'|'between';
      value?: unknown }
  | { and: Cond[] } | { or: Cond[] } | { not: Cond }
  | { mode: ('create'|'update'|'view')[] }
  | { role: string[] } | { permission: string[] };

type FieldEffects = {
  hidden?: boolean; disabled?: boolean; readOnly?: boolean; required?: boolean;
  label?: string; helperText?: string; placeholder?: string;
  options?: Option[] | { fromField: string };
  min?: number; max?: number; step?: number;
  setValue?: unknown; clearValue?: true;
};

// on a field:
when?: Array<{ if: Cond; then: Partial<FieldEffects> }>;
```

Example — the product discount block, today three separate lambdas:

```ts
isDiscount: { type: 'checkbox', label: 'Is Discount' },
discountType: {
  type: 'select', label: 'Discount Type', options: discountTypeOptions,
  when: [{ if: { field: 'isDiscount', op: 'falsy' }, then: { hidden: true, clearValue: true } }],
},
discount: {
  type: 'number', label: 'Discount',
  when: [
    { if: { field: 'isDiscount', op: 'falsy' }, then: { hidden: true, clearValue: true } },
    { if: { field: 'discountType', op: 'eq', value: 'percentage' },
      then: { max: 100, helperText: 'Percent off, 0-100' } },
  ],
},
```

### WO-18 — `Cond` type + evaluator — **BLOCKER, M**
**Files:** new `src/components/library/fields/conditions/{types.ts,evaluate.ts}`
All operators + combinators + `mode`/`role`/`permission` contexts. Field paths reuse
`getFieldValue`'s dot/index parser.
**Done when:** unit tests cover every operator, nested combinators, and missing-path cases.

### WO-19 — `FieldEffects` + `resolveField()` — **BLOCKER, M**
**Files:** `fields/conditions/resolveField.ts`
Apply `when` in order, last wins.
**Done when:** a field can be conditionally *required* and conditionally *option-filtered*, not just hidden.

### WO-20 — Dependency index — **M**
**Files:** `fields/conditions/buildDependencyIndex.ts`
Compile schema -> `Map<watchedPath, dependentFieldKeys[]>` once; re-resolve only dependents on change.
**Done when:** a 40-field form re-evaluates only the actual dependents per keystroke (assert via a counter in a test).

### WO-21 — Wire into the form shells — **BLOCKER, M**
**Files:** `FormMain.tsx`, `FormPage.tsx`, `FormContent.tsx`, `form-section/FormItem.tsx`, `FormItemAccordion.tsx`
Replace the three inline `item?.renderCondition && ...` checks; delete `evaluateCondition`
at `FormMain.tsx:133-143`. Migrate `renderIf` -> `when`.
**Done when:** one condition path across all three shells; `renderIf` has no remaining call sites.

### WO-22 — Legacy + server-string guard — **S**
**Files:** `fields/conditions/resolveField.ts`
Support `renderCondition` only when `typeof === 'function'`. A string (server `.toString()`
output) is ignored with a dev error naming model + field.
**Done when:** a server schema carrying `renderCondition` logs a diagnosable warning instead
of throwing `renderCondition is not a function`.

### WO-23 — Hidden-value policy — **BLOCKER, M**
**Files:** `fields/conditions/applyHiddenValues.ts`, called from the form shells
`onHide: 'keep' | 'clear' | 'default'`, default `clear`. Writes to **both** `formData` and `changedData`.
**Done when:** unchecking `isDiscount` removes `discount`/`discountType` from the PATCH body.

### WO-24 — Section-level conditions — **S**
**Files:** `FormMain.tsx` section grouping
A section with `when: {...}` hides wholesale, including its accordion header.
**Done when:** a conditional section collapses without leaving an empty titled block.

### WO-25 — Serializable dependent relation queries — **M**
**Files:** `VDataMenu/index.tsx`, `VDataSelect.tsx`, `VDataTags.tsx`
`query: { filter: { parent: { $field: 'category' } } }` + `dependsOn: ['category']`;
resolve `$field` against form values, use as the RTK Query cache key.
**Done when:** a subcategory menu refetches when its parent category changes.

### WO-26 — Migrate existing conditions — **S**
**Files:** `src/models/products/product.schema.ts` (4), `src/models/subscription/subscription.schema.ts` (1),
`src/app/{purchased-themes,sidebaritems,portfolios,shops}/page.tsx` (7)
Lambdas -> `when`. Keep lambdas where they touch `new Date()` (`shops/page.tsx:99`) until WO-40.
**Done when:** every lambda condition in `src/models/**` is declarative.

> **Gate:** conditions are JSON, evaluated once per dependency change, and hidden fields don't submit.

---

## Phase 3 — Validation

Currently absent (defect 10) — the largest functional hole.

### WO-27 — `FormStack` error slot — **BLOCKER, S**
**Files:** `utils/inputs/input-components/FormStack.tsx`
Add `invalid` + `Field.ErrorText`. One file; unblocks everything below.

### WO-28 — `descriptor.validate` — **M**
**Files:** registry descriptors
Type-intrinsic rules: email/url shape, number range + precision, json parse, required-image.

### WO-29 — Declarative `rules` — **M**
**Files:** `types/schema.types.ts`, new `fields/validation/validateField.ts`
`{ required, min, max, minLength, maxLength, pattern, custom: Cond }`.
`required` composes with `when`, so conditional-required works.

### WO-30 — Submit gate — **BLOCKER, M**
**Files:** `FormPage.tsx`, `FormMain.tsx`, `create-page/page/EditItemPage.tsx`, `AddItemPage.tsx`
`validateForm()` -> `Record<path, string>`; block submit, focus + scroll to first error.
**Done when:** an invalid form never reaches the network.

### WO-31 — Server errors onto fields — **M**
**Files:** `FormPage.tsx` + `useCustomToast` call sites
Map a 400's field errors into `errors[path]` instead of only toasting.

### WO-32 — Async `unique` — **M**
**Files:** `utils/inputs/VSlug.tsx`, `VInput` descriptor
Debounced uniqueness check against `{path, field}` for slug / SKU / email.

> **Gate:** required, typed and unique constraints all fail at the field, before submit.

---

## Phase 4 — New input types

Independent of each other; ship in value order. All unblocked once WO-11 lands.

| ID | Type | Size | Notes |
|---|---|---|---|
| WO-33 | `combobox` | M | searchable single select — highest-value gap |
| WO-34 | `multi-select` | M | declared since day one, never built |
| WO-35 | `radio` + `radio-card` | S | |
| WO-36 | `checkbox-group` / `checkbox-menu` | S | |
| WO-37 | `datetime`, `date-range` | M | |
| WO-38 | `currency` / `percent` / `integer` | M | `{amount, currency}` payload; pairs with WO-13's `price` cell |
| WO-39 | `object` (nested fieldset) | M | recursive `createFormFields` on a sub-schema |
| WO-40 | `repeater` (generic array-of-objects) | L | subsumes bespoke `VSection`, `VSectionDataArray`, `VCustom` |
| WO-41 | `inline-relation-table` | L | order/invoice line items, hand-rolled per page today |
| WO-42 | `phone`, `email`, `url`, `address` | M | |
| WO-43 | `key-value`, `json`, `rating`, `qr` | M | `UserRating` and `react-qr-code` already present, unwired |
| WO-44 | `shadow`, `font-style`, `gradient`, `spacing`, `radius` | M | closes the WO-02 quarantine list |
| WO-45 | `cascading-select`, `tree-select` | M | needs WO-25 |
| WO-46 | `polymorphic-ref` | M | formalizes `functions/linkRenderOptions.ts` |

### Full type catalogue (reference)

Status: **[x]** implemented - **[!]** declared but falls through to a text input - **[+]** proposed

**Text & scalar** — `text`[!] / `string`[x], `textarea`[x], `nested-textarea`[x], `editor`[x],
`basic-editor`[x], `slug`[x], `password`[x], `read-only`[x], `view-only`[x], `number`[!],
`markdown`[+], `code`[+], `email`[+], `url`[+], `phone`[+], `currency`[+], `percent`[+],
`integer`[+], `decimal`[+], `masked`[+], `hidden`[+], `computed`[+], `json`[+]

**Boolean** — `switch`[x], `checkbox`[x], `checkbox-group`[+], `segmented`[+], `tri-state`[+]

**Choice** — `select`[x], `combobox`[+], `multi-select`[!], `radio`[!], `radio-card`[+],
`checkbox-menu`[!], `tag`[x], `case-tag`[x], `section-tag`[x], `select-tag`(implemented but
commented out at `FormInput.tsx:447`), `data-select`[x], `data-menu`[x], `nested-data-menu`[x],
`data-tag`[x], `cascading-select`[+], `tree-select`[+], `transfer`[+], `polymorphic-ref`[+]

**Date & time** — `date`[x], `time`[x], `datetime`[+], `date-range`[+], `month`/`year`/`week`[+],
`duration`[+], `timezone`[+], `cron`/`recurrence`[+]

**Media** — `image`[x], `image-array`[x], `file`[x], `file-array`[x], `video`[x], `icon`[x],
`avatar`[+], `gallery`[+] (image + alt + caption), `image-crop`[+], `audio`[+], `svg`[+]

**Style / builder** — `color`[x], `font`[x], `font-weight`[x], `font-size`[x], `line-height`[x],
`letterspacing`[x], `opacity`[x], `slider`[x], `alignment`[x], `flex-justify`[x], `flex-align`[x],
`text-align`[x], `font-style`[!], `shadow`[!], `gradient`[+], `spacing`[+], `border`[+],
`radius`[+], `responsive<T>`[+]

**Composite** — `custom-attribute`[x], `custom-section`[x], `custom-section-array`[x],
`section-data-array`[x], `array-string`[x], `variant`[x], `permissions`[x], `seo`[x],
`model-fields`[x], `form-fields`[x], `settings`[x], `object`[+], `repeater`[+], `key-value`[+],
`matrix`[+], `inline-relation-table`[+]

**Geo & special** — `address`[+], `location`[+], `country`[+], `currency-picker`[+],
`language`[+], `qr`[+], `signature`[+], `otp`[+], `rating`[+]

---

## Phase 5 — Table & view conditional rendering

"Conditional table renders" is three separate problems needing three mechanisms.

### WO-47 — `columnCondition` (axis 1: column visibility) — **M**
**Files:** `convertToTableFields.ts`, `components/table/CustomTable.tsx`, `components/table/Preferences.tsx`
Row-independent gate (role/permission), evaluated once per table.
Precedence: `columnCondition` (hard gate) -> server `tableconfig` -> user preference.

### WO-48 — `cellVariant` (axis 2: per-row formatting) — **M**
**Files:** `TableData.tsx` + descriptors
`[{ if: Cond, then: { colorPalette, icon, prefix, suffix, strikeThrough } }]`, evaluated per
row against that row's doc. Generalises the scattered `colorPalette:` lambdas and the
half-used `colorTheme` map; lambdas keep working.
Example: stock red below `lowStockAlert`; order status colour by value.

### WO-49 — Row-level conditions (axis 3) — **S**
**Files:** `table-components/row/TableRowComponent.tsx`, `table-components/menu/TableMenu.tsx`
`rowCondition` for highlight/dim/strike; re-type `TableMenu`'s existing `renderCondition(doc)`
(`TableMenu.tsx:63`) as `Cond` and add `{ permission }`.

### WO-50 — Empty-value policy — **S**
**Files:** `CustomTd.tsx`, `TableData.tsx`, `functions/getValue.ts`
`'--'` is hardcoded independently in three places. One `emptyText` facet.

### WO-51 — Mobile facet — **M**
**Files:** `CustomTd.tsx`, `TableRowComponent.tsx`
Six scattered `useIsMobile()` branches -> `mobile: { hide, label, span, priority }`.

### WO-52 — Editable cells from the registry — **M**
**Files:** `table-components/data/EditableTableData.tsx`
Drive from `descriptor.supportsInlineEdit` (today: text/select/boolean only). Add rollback —
the optimistic `setVal` never reverts on mutation failure.

### WO-53 — View facets + conditions — **M**
**Files:** `components/view/view-item/ModalViewItem.tsx`, `ViewPageItem.tsx`, `convertToViewFields.ts`
`view: { span, group, order, hideIfEmpty, emptyText, copy, mask, lightbox }`. Replaces the
`type == 'textarea' || 'editor' || 'section-data-array'` full-width test duplicated at
`ModalViewItem.tsx:75` and `modal-components/ViewItem.tsx:297`.
Evaluate `Cond` against the fetched doc with `mode: 'view'`; `hideIfEmpty` defaults true.
Covers permission-gated fields (e.g. hide cost price from staff).

### WO-54 — View modal error states — **S**
**Files:** `table-components/modals/ViewItemModal.tsx`, `ViewServerModal.tsx`
`isError` is destructured and never used — a deleted record renders an all-`--` modal.

### WO-55 — View groups / tabs — **M**
**Files:** `ViewItemModal.tsx`
Drive from `view.group` for large docs (orders, invoices).

### View type catalogue (reference)

Existing: `string`/`text`, `tag`, `array-tag`, `data-tag`, `data-array-tag`, `checkbox`,
`custom-attribute`, `custom-section-array`, `section-data-array`, `image`, `image-array`,
`file`, `external-link`, `date`, `date-only`, `textarea`, `editor`, `basic-editor`.
Declared-but-unhandled (WO-15): `object`, `price`, `boolean`, `number`, `image-text`,
`data-array-count`, `menu`.
Proposed: `currency`, `percent`, `datetime`, `relative-time`, `file-array`, `video`, `audio`,
`icon`, `color` (swatch + hex), `internal-link`, `relation` (chip opening that record's modal —
the `originalType === 'data-menu'` default branch already hints at this), `relation-array`,
`count`, `array-of-objects` (mini table), `json` (collapsible; `JSONDisplay` exists),
`permissions` (matrix), `variant` (table), `seo` (`SerpPreview` exists), `qr`, `address`/`map`,
`masked` (dots + permission-gated reveal), `audit` (created/updated by + at).

### Table type catalogue (reference)

Existing: `text`, `number`, `tag`, `checkbox` (status dot), `boolean`, `date`, `date-only`,
`time`, `image-text`, `file`, `external-link`, `menu`.
Declared-but-unhandled (WO-13): `price`, `data-array`, `data-array-count`.
Proposed: `currency`, `percent`, `datetime`, `relative-time`, `image`, `image-stack` (+N
overflow), `internal-link`, `count`, `progress`, `rating`, `color-swatch`, `status` (icon +
label), `code`, `json`, `truncate` (tooltip), `array-preview` (first n + "+N"), `qr`, `custom`.

---

## Phase 6 — Backend parity

### WO-56 — Extend `SettingType.schema` — **BLOCKER, M**
**Files:** `backend/library/types/model/settings.type.ts`
Carry `when`, `rules`, `cellVariant`, `view`, `table`, `columnCondition` through to the client.

### WO-57 — Retire the `.toString()` serialization — **S**
**Files:** `backend/library/controllers/config/getSchema.controller.ts:18-20`
Drop it once WO-26 lands; emit `when` instead.

### WO-58 — Storage <-> field-type map — **M**
**Files:** `backend/library/functions/convertType.ts`
Currently maps 3 of 12 storage types. Make it total, sourced from `descriptor.storage`.

### WO-59 — Round-trip contract test — **M**
**Files:** new `backend/test/schema-contract.test.ts`
Assert every registry type survives `getSchema` -> client resolution, and that every
operator serializes.

---

## Critical path

```
WO-01 -> WO-03 -> WO-06 -> WO-09 -> WO-10 -> WO-11 --+
                                    WO-14 -----------+-> WO-18 -> WO-19 -> WO-21 -> WO-23
                                                     |                                |
                                          WO-27 -> WO-30 -------------------> Phase 4/5/6
```

Everything in Phase 4 is parallelizable once WO-11 lands.
Phases 5 and 6 need Phase 2's evaluator.

**Counts:** 59 items — 18 S, 33 M, 3 L (WO-40, WO-41, and WO-09/WO-10 as a pair).

Phases 0-1 are 17 items and hold the leverage: mostly mechanical, and they turn the
recurring silent-failure modes into compile errors.

---

## Open decisions

**1. Lambdas in schemas.** `colorPalette`, `renderCondition`, `getValue` and `fetch` are
functions — they can't cross the `getSchema` boundary, which is why defect 8 exists.
*Recommendation:* keep both, with `Cond`/`cellVariant` preferred, plus a lint rule that
models backed by server schemas must be lambda-free. Ripping lambdas out now touches every
schema for no immediate gain.

**2. Flat vs nested facet keys.** `tableType`/`viewType`/`tableKey`/`viewKey` are flat today.
*Recommendation:* introduce nested `table: {}` / `view: {}` / `input: {}`, keep the flat keys
as deprecated aliases resolved in `createResolvedField`. No big-bang migration; new fields
use the nested form.
