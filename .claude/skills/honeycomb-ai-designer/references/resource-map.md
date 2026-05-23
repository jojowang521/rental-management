# Resource Map

Load only the resource needed for the current request.

## Assets

- `assets/templates/shell.html`: base PC management shell.
- `assets/templates/components/layout-shell.html`: stable app shell, topbar, and 12px page canvas structure.
- `assets/templates/components/side-nav.html`: stable parent/child side navigation structure.
- `assets/templates/components/filter-bar.html`: stable inline filter bar and expandable advanced filter pattern.
- `assets/templates/components/table-card.html`: stable table toolbar, grid, and pagination pattern.
- `assets/templates/components/form-horizontal.html`: stable PC horizontal left-label/right-control form pattern.
- `assets/templates/components/detail-profile.html`: stable detail-page component blocks for information profile, key metrics, tabs, detail form sections, tab tables, logs, empty states, detail-page modal grouped forms, and detail action confirm dialogs.
- `assets/templates/components/modal-form.html`: stable modal wrapper for horizontal forms.
- `assets/templates/components/drawer-detail.html`: stable drawer/detail wrapper.
- `assets/templates/components/metric-dashboard.html`: stable dashboard metric/chart/list spacing pattern.
- `assets/templates/rental-management/prototype-list-page.html`: default list-page template for general enterprise, park, rental, asset, and admin pages.
- `assets/templates/rental-management/prototype-edit-page.html`: default edit/form-page template.
- `assets/templates/rental-management/prototype-detail-page.html`: default detail-page template.
- `assets/templates/cost-investment-crud/cost-investment-plan-list.html`: cost-investment list page.
- `assets/templates/cost-investment-crud/city-benchmark-edit.html`: cost-investment edit page.
- `assets/templates/cost-investment-crud/city-benchmark-detail.html`: cost-investment detail page.
- Honeycomb component-library source: https://www.figma.com/design/HQFmiqvsbukzAAKbiB1sla/Honeycomb%E4%B8%AD%E5%90%8E%E5%8F%B0%E7%BB%84%E4%BB%B6%E5%BA%93
- `assets/figma/Honeycomb中后台组件库.fig`: optional offline cache; not required in the published skill package.
- `assets/figma/component-library-source.json`: component-library provenance and priority.
- `assets/icons/navigation/navigation-icons.json`: navigation icon manifest; source Figma node is `46:418`.
- `assets/components/design-components.json`: component prop and token contract.
- `assets/tokens/design-tokens.json`: design tokens.
- `assets/patterns/design-patterns.json`: reusable page and interaction patterns.
- `assets/examples/*.json`: lightweight example page configs.

## References

- `references/mytepro-visual-standard.md`: default visual standard for PC admin pages.
- `references/design-rules.md`: general component and layout rules.
- `references/component-templates.md`: when and how to use stable component templates.
- `references/rental-management-patterns.md`: extracted baseline patterns from the user-supplied `rental-management.zip`.
- `references/ux-guidelines.md`: feedback, empty states, loading, and interaction rules.
- `references/accessibility.md`: accessibility checks.
- `references/cost-investment-crud.md`: cost-investment page family.
- `references/generate-page.md`: expanded page-generation workflow.
- `references/generate-figma.md`: Figma-aligned generation workflow.

## Scripts

- `scripts/figma-export-nav-icons.js`: export navigation icons from Figma when `FIGMA_TOKEN` is available.
- `scripts/figma-sync.js`: synchronize Figma resources when configured.
