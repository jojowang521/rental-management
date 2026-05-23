# Cost Investment CRUD Reference

Use this reference only when the user asks for the cost-investment / city-benchmark prototype family, or when the requested page explicitly mentions 城市基准方案、成本试算、历史项目库、标准成本, or 成本投资管理系统.

## Navigation

Use the cost-investment navigation instead of the rental-management navigation:

```text
成本适配
  城市基准方案
  成本试算
  历史项目库
目标管理
合同管理
付款管理
决算管理
三费集成
资金计划
合作方履约协同
清单管理
成本智库
成本管理设置
成本协同设置
智慧清单设置
```

Only expand the current first-level module. Other first-level modules stay collapsed.

## List Page

Base template: `assets/templates/cost-investment-crud/cost-investment-plan-list.html`.

Fixed requirements for 城市基准方案列表页:

- Page title: `城市基准方案`.
- Top bar may omit breadcrumb; when present, keep only the current page name.
- Content structure: `FilterBar` followed directly by `TableCard`.
- Filter fields: keep only `公司` and `项目定位` unless the user explicitly asks for more.
- Filter conditions use real-time querying; do not add `查询` or `重置`.
- Keep `高级筛选` / `高级查询` only when there are advanced conditions.
- Put global actions in the table toolbar right side, not in the filter bar.
- Table toolbar actions: `新增` as primary, `引入其他公司` as secondary.
- Required columns: 序号、版本号、项目定位、配置等级、科目模板、业态范围、审核状态、是否禁用、操作.
- Version number is a highlighted link to `city-benchmark-detail.html`.
- Include pagination at the bottom of the same table card.

Operation buttons by status:

- 未审核: `编制标准成本` + `发起审批` + `更多`.
- 审核中: `审批过程` + `更多`.
- 已审核: `查看详情` + `编制标准成本` + `更多`.
- Disabled: use `详情` + `更多` only.

Use text-style action buttons in operation columns. `更多` is a highlighted text entry, never a filled button.

## Create / Edit Modal

When the user asks for add/edit inside the list page, use a modal rather than navigating away.

- Width: `680px`.
- Header: title plus close button.
- Footer: right aligned `取消` + `保存`.
- Close on mask click, close icon, and cancel.
- Keep required marker placeholders aligned with the form label pattern.
- Use two-column layout where possible.
- `科目模板` and `模块标准` use input plus a right-side thin SVG plus icon; do not use a bold text `+`.

## Detail Page

Base template: `assets/templates/cost-investment-crud/city-benchmark-detail.html`.

- Use read-only detail groups.
- Keep version/status summary near the top.
- Operation column `详情` must be plain highlighted text, without border or background.
- Drawer detail, when requested, opens from the right.
- Drawer footer keeps a single `取消` button unless the user requests a workflow action.

## Edit Page

Base template: `assets/templates/cost-investment-crud/city-benchmark-edit.html`.

- Bottom actions: `取消` returns to `cost-investment-plan-list.html`; `保存` keeps the user on the edit flow unless a success redirect is requested.
- `业态构成` table title bar includes `引入规划指标` as a secondary button.
- If a detail action remains in an edit table, use the same plain highlighted text style as detail pages.

## Verification

Before finalizing, check:

- Cost-investment navigation is used, not rental navigation.
- Filter bar has no query/reset/global action buttons.
- Table toolbar right side contains global actions.
- Pagination exists in list pages.
- Related list, detail, and edit filenames link consistently.
