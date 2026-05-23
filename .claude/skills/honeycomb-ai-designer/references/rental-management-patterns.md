# Rental Management Pattern Baseline

Source: `rental-management.zip` pages supplied by the user, especially:

- `prototype-list-page.html`
- `prototype-edit-page.html`
- `prototype-detail-page.html`
- `contract-list.html`
- `contract-edit.html`
- `contract-detail.html`

Use these as the default Honeycomb PC admin baseline when generating general ERP, park, rental, asset, lead-follow-up, and management-console prototypes.

## Filter And Advanced Filter

- Filter card: `.fc`, white background, `border-radius:4px`, no border, subtle `box-shadow:0 0 3px rgba(0,0,0,.04)`.
- Main filter row: `.fr`, `padding:12px 20px`, `gap:20px`, inline items.
- Main filter item: `.fc .fi`, horizontal left-label/right-control layout; search item uses `.fi.lg` with `width:220px`, regular select items use compact fixed control widths.
- Advanced entry: `.adv-btn` only. It expands/collapses `.adv-row`; no query/reset buttons by default.
- Advanced content: `.adv-grid` is vertical; each `.adv-fi` is a row with fixed `91px` label and either `.adv-tags` or `.adv-range`.
- Advanced tags: `.adv-tag`, `height:24px`, `padding:0 10px`, selected state is blue border + pale blue background.
- Advanced filter types: 类别 uses `.adv-tags`; 日期 uses `.adv-date` with two date inputs; 范围 uses `.adv-range` with min/max inputs; 录入 uses `.adv-input` with one text input; 选择 uses `.adv-select` with one or more selects.
- Advanced actions: `.adv-actions` right aligned, top dashed border, only `清空筛选`-style helper action.

## Side Navigation

- Baseline interaction follows `cost-investment-plan-list.html`: `toggleSidebar()` toggles `.sn.collapsed`; `toggleNav(this)` toggles the sibling `.nsl.open`; `initNav()` opens only the active parent group on page load.
- Use expanded width `208px`, collapsed width `56px`, logo height `44px`, and parent item height about `44px`.
- Do not use the cost-investment sprite positions for general Honeycomb pages. Default to cached SVG image nodes from `assets/icons/navigation/svg/` using the manifest `assets/icons/navigation/navigation-icons.json`.
- Parent item pattern: `.ni` contains `.ni-ic > img.ni-img`, `.ni-lb`, and `.ni-arrow`; child list pattern is sibling `.nsl` containing `.nsi` items.
- Active state belongs to the current child `.nsi.active`; the parent receives `.open` only to reveal the child group.
- Collapsed navigation hides child groups, labels, arrows, and footer; icons remain visible and centered.

## List And Table

- Table card: `.tc`, white background, `border-radius:8px`, `border:1px solid var(--cb)`, `overflow:hidden`, `flex:1`, `min-height:0`.
- Toolbar: `.tt`, `padding:12px 20px`, bottom border. Left side contains status tabs or count; right side contains global actions.
- List status views use segmented `.view-tabs > .view-tab` in the toolbar left side, with gray background, white active item, blue active text, and optional count suffix such as `全部·86`; do not reuse detail-page `.tab` styles for list views.
- Batch interaction: row checkboxes use `.chk[data-check="row"]`, header checkbox uses `.chk[data-check="all"]`. After selection, `.tt` gets `.batch-mode`, `.view-tabs` hides, and `.batch-bar` shows `已选 N 条` plus batch actions and `取消选择`.
- Table wrapper: `.tw`, both x/y scroll, `flex:1`, `min-height:0`.
- Table: header background `#FAFAFA`; `th` uses `padding:10px 16px`, 13px, 600 weight; `td` uses `padding:13px 16px`.
- Pagination: `.pgn` inside the table card bottom, left total count, right page buttons and page-size selector.

## Page Form And Grouped Form

- Page form container: `.edit-card`, white card, `border-radius:4px`, subtle shadow, `padding:20px`, `gap:24px`.
- Group section: `.d-sec` containing `.d-title` and `.d-grid`.
- Group title: `.d-title`, 14px semibold, left 3px blue vertical bar, `margin-bottom:16px`.
- Grid: `.edit-card .d-grid`, two columns, `gap:16px 48px`.
- Field: `.edit-card .fi`, horizontal left-label/right-control, `min-height:32px`.
- Label: `.fi-lbl`, width `110px`, includes optional `.req` and `.fi-txt`.
- Control: `.fi-ctrl`, flexible width; inputs/selects/textareas fill available width.
- Page footer: `.edit-foot`, bottom footer, center aligned buttons. Modal/drawer footers stay right aligned.

## Detail And Information Filing

- Header/profile card: `.profile-card > .profile-hd`.
- Icon: `.p-icon`, 48px, pale blue, business icon inside.
- Main title row: `.p-name-row`, title plus tags.
- Meta row: `.p-fields`, horizontal wrapping `.pf` fields.
- Actions: `.p-actions`, right side button group.
- Key metrics: `.stat-row > .stat-card`, each with `.s-ic`, `.s-label`, `.s-value`, and `.s-unit`; use after the profile card and before tabs.
- Tabs: `.tabs-bar > .tab`, with content in matching `.tab-panel`; only one tab and one panel should have `.on`.
- Ordinary detail info: `.detail-card` with `.d-sec / .d-title / .d-grid / .d-item / .d-lbl / .d-val`.
- Tab tables: `.detail-card.detail-table-card > table.tbl`, with card `padding:0; overflow:hidden`.
- Operation logs: `.detail-card > .log-list > .log-item`, with fixed-width time text and flexible log text.
- Detail action modal forms: `.modal-detail-form / .m-sec / .m-title / .m-grid / .mfi`; fields are horizontal left-label/right-control and may include disabled read-only inputs.
- Detail action confirmation: `.confirm-mask / .confirm-box / .confirm-content / .confirm-ft`, centered 400px dialog with right-aligned footer actions.
- Do not use table-style horizontal divider rows for ordinary detail fields. Use real tables only for lists/records.
