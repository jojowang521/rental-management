# Component Templates

Use these templates to reduce drift in Honeycomb PC admin prototypes. They are structural contracts, not examples to paraphrase.

## When To Use

- Any PC admin page: start with `assets/templates/components/layout-shell.html`.
- Any left navigation: use `assets/templates/components/side-nav.html`.
- Any list or data page filter area: use `assets/templates/components/filter-bar.html`.
- Any list grid: use `assets/templates/components/table-card.html`.
- Any PC form, whether page, modal, drawer, inline edit, grouped form, or advanced filter panel: use `assets/templates/components/form-horizontal.html`.
- Any detail page information header, customer/company profile, information filing card, key metrics, tabs, tab table, operation log, ordinary detail information section, detail-page modal grouped form, or detail action confirm dialog: use `assets/templates/components/detail-profile.html`.
- Any modal form: wrap horizontal form fields with `assets/templates/components/modal-form.html`.
- Any drawer detail or drill-down panel: use `assets/templates/components/drawer-detail.html`.
- Any home or overview page with metric cards, chart/image area, and list area: use `assets/templates/components/metric-dashboard.html`.

## Replacement Rules

- Replace placeholders such as `{{TITLE}}`, `{{FILTER_ITEMS}}`, `{{TABLE_HEADERS}}`, and `{{FORM_FIELDS}}`.
- Keep class names, nesting, footer placement, and spacing intact.
- Keep SideNav based on `side-nav.html`: `208px` expanded, `56px` collapsed, `id="sn"`, `.sn-toggle`, cached SVG `.ni-img`, clickable parent `.ni`, expandable `.nsl`, and `toggleSidebar() / toggleNav() / initNav()`.
- If the HTML output is outside the skill package, copy `assets/icons/navigation/svg/` to the output directory or use a verified local preview path so `.ni-img` actually renders in `file://`.
- Keep list page global actions in `.tt-r`, never in `.fc`.
- Keep filter bars visually aligned to the Honeycomb component library: white 4px container, subtle shadow, main `.fr` row with left-right `.fi` fields, and advanced rows as tag groups.
- Keep advanced filter type blocks complete: 类别 `.adv-tags`, 日期 `.adv-date`, 范围 `.adv-range`, 录入 `.adv-input`, 选择 `.adv-select`.
- Keep list status views on the left side of `.tt` as `view-tabs / view-tab`; do not use detail-page `.tab` for list views.
- When batch operations are required, use `.batch-bar` inside `.tt-l`; it appears only after row checkbox selection and replaces `.view-tabs` through `.tt.batch-mode`.
- Keep pagination inside `.tc`, below `.tw`.
- Keep PC form fields as left label + right control.
- Keep grouped forms as lightweight `.d-sec` sections inside one `.edit-card`: `.d-title` with blue left bar, no bordered nested cards, no title divider line.
- Keep full-page form actions in the bottom footer and horizontally centered; do not duplicate save/cancel actions in the form header.
- Keep modal and drawer form actions in the bottom footer and right aligned.
- Keep detail page header / information filing cards as `profile-card`: `.profile-hd` with left 48px icon, title + tags, `.p-fields` meta row, and actions on the right.
- Keep detail page key metrics as `.stat-row > .stat-card`; use it only after the profile card, not as a replacement for the information header.
- Keep detail tabs as `.tabs-bar > .tab` plus matching `.tab-panel`; tab content must be wrapped in `detail-card` or `detail-table-card`.
- Keep normal detail information as `detail-card` containing `d-sec`, `d-title`, `d-grid`, `d-item`, `d-lbl`, and `d-val`; avoid table-row divider styles for non-table detail fields.
- Keep records inside detail tabs as `.detail-card.detail-table-card > table.tbl`; do not leave tables directly on the gray page background.
- Keep detail-page modal forms as `.modal-detail-form / .m-sec / .m-title / .m-grid / .mfi`; fields remain left-label/right-control.
- Keep destructive/detail action confirmations as `.confirm-mask / .confirm-box / .confirm-content / .confirm-ft`; do not replace them with browser confirm dialogs.
- Keep dashboard sections separated by `gap:12px`.

## Do Not

- Do not stack PC form labels above controls unless the target is explicitly mobile/H5 or the user asks for vertical fields.
- Do not place `查询` or `重置` in the filter bar by default.
- Do not place `新增`、`导入`、`导出`、`下载模板`、`同步`、`批量操作` in the filter bar.
- Do not create a separate title/description intro card above the first functional area unless requested.
- Do not move pagination outside the table card.
- Do not paste ad hoc inline SVG icons into the left navigation when a matching cached icon exists in `assets/icons/navigation/svg/`.
- Do not make the left navigation flat when the product has modules and child pages; use parent `.ni` plus child `.nsi`.

## Minimum CSS Contract

Generated pages must include or preserve these layout behaviors:

```css
.sn{width:208px;height:100vh;background:#1C1C1E;display:flex;flex-direction:column;flex-shrink:0;overflow:hidden}
.sn.collapsed{width:56px}
.sn.collapsed .sn-txt,.sn.collapsed .sn-mark,.sn.collapsed .ni-lb,.sn.collapsed .ni-arrow,.sn.collapsed .nsl,.sn.collapsed .sn-foot{display:none!important}
.sn-logo{height:44px;padding:11px 16px;border-bottom:1px solid rgba(255,255,255,.12);display:flex;align-items:center;gap:8px}
.sn-toggle{width:20px;height:20px;margin-left:auto;border:0;background:transparent;color:rgba(255,255,255,.55);cursor:pointer}
.sn.collapsed .sn-logo{padding:11px 8px;justify-content:center}
.sn.collapsed .sn-toggle{margin-left:0}
.ni{min-height:44px;padding:13px 20px;display:flex;align-items:center;gap:16px;color:rgba(255,255,255,.65);font-size:14px;cursor:pointer}
.sn.collapsed .ni{padding:14px 18px;justify-content:center;gap:0}
.ni-ic,.ni-img{width:16px;height:16px}
.ni-img{display:block;opacity:.78;filter:brightness(0) invert(1)}
.ni-arrow{width:14px;height:14px;transition:transform .18s ease}
.ni.open .ni-arrow{transform:rotate(180deg)}
.nsl{display:none}
.nsl.open{display:block}
.nsi{height:34px;padding:9px 20px 9px 52px;display:flex;align-items:center;color:rgba(255,255,255,.45);font-size:13px;cursor:pointer}
.nsi.active{color:#60A5FA;background:rgba(37,99,235,.15)}
.pb{flex:1;min-height:0;overflow:hidden;padding:12px;display:flex;flex-direction:column;gap:12px}
.tc{flex:1;min-height:0;display:flex;flex-direction:column}
.tw{flex:1;min-height:0;overflow:auto}
.view-tabs{display:flex;align-items:stretch;background:#F5F5F5;border-radius:4px;padding:3px;height:32px;flex-shrink:0}
.view-tab{display:flex;align-items:center;justify-content:center;gap:0;padding:2px 10px;border-radius:3px;cursor:pointer;color:#666;background:transparent;border:0;font-size:13px;font-weight:400;white-space:nowrap;transition:all .15s;position:relative;line-height:22px}
.view-tab:hover{color:#266EFF}
.view-tab.on{background:#fff;color:#266EFF;box-shadow:0 1px 2px rgba(0,0,0,.06)}
.view-tab .vt-div{position:absolute;left:0;top:50%;transform:translateY(-50%);width:1px;height:16px;background:#EAEAEA}
.batch-bar{display:none;align-items:center;gap:8px;height:32px}
.tt.batch-mode .view-tabs{display:none}
.tt.batch-mode .batch-bar{display:flex}
.batch-count{font-size:13px;color:var(--cts);margin-right:4px}
.batch-count b{color:var(--cp600);font-weight:600}
.batch-cancel{height:28px;padding:0 8px;background:transparent;color:var(--ctl);cursor:pointer}
.chk{width:14px;height:14px;border:1px solid var(--cg300);border-radius:2px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative}
.chk.on{background:var(--cp600);border-color:var(--cp600)}
.chk.on::after{content:"";width:7px;height:4px;border-left:1.5px solid #fff;border-bottom:1.5px solid #fff;transform:rotate(-45deg);margin-top:-1px}
.chk.part{background:var(--cp600);border-color:var(--cp600)}
.chk.part::after{content:"";width:8px;height:1.5px;background:#fff;border-radius:1px}
.fc{background:var(--cg0);border-radius:4px;border:none;padding:0;box-shadow:0 0 3px 0 rgba(0,0,0,.04);flex-shrink:0}
.fr{min-height:56px;padding:12px 20px;display:flex;align-items:center;gap:20px;flex-wrap:nowrap}
.fr.has-adv{border-bottom:1px dashed #EAEAEA}
.fc .fi{display:flex;flex-direction:row;align-items:center;gap:8px;min-width:0;flex-shrink:0}
.fc .fi.lg{width:220px}
.fc .fi.date{width:280px}
.fc .fi .sel{width:140px}
.fc .fi.date .inp{width:200px}
.fc .fl{font-size:13px;color:var(--ctt);font-weight:400;white-space:nowrap}
.adv-row{display:none;flex-direction:column;gap:0;margin-top:0;background:var(--cg0)}
.adv-row.open{display:flex}
.adv-grid{display:flex;flex-direction:column;gap:0;padding:4px 20px}
.adv-fi{display:flex;flex-direction:row;align-items:center;gap:8px;padding:6px 0;border-bottom:none}
.adv-fi .fl{width:91px;flex-shrink:0}
.adv-tags{display:flex;flex-wrap:wrap;align-items:center;gap:16px;padding:2px 0}
.adv-tag{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:4px;font-size:13px;cursor:pointer;border:1px solid var(--cg300);color:var(--cts);background:var(--cg0);transition:all .15s}
.adv-tag:hover,.adv-tag.on{background:var(--cp50);border-color:var(--cp500);color:var(--cp600)}
.adv-date,.adv-range,.adv-input,.adv-select{display:flex;align-items:center;gap:8px}
.adv-date .inp{width:180px}
.adv-range .inp{width:160px}
.adv-input .inp{width:240px}
.adv-select .sel{width:180px}
.adv-actions{display:flex;align-items:center;justify-content:flex-end;gap:16px;padding:11px 20px;border-top:1px dashed #EAEAEA}
#page-detail.active{overflow:auto}
#page-detail .detail{flex:none;min-height:auto;overflow:visible;padding-bottom:12px}
.edit-card{background:#fff;border-radius:4px;box-shadow:0 0 3px rgba(0,0,0,.04);padding:20px;display:flex;flex-direction:column;gap:24px}
.edit-foot{background:#fff;border-top:1px solid var(--cb);padding:12px 24px;display:flex;align-items:center;justify-content:center;gap:8px;flex-shrink:0}
.edit-card .d-sec{display:flex;flex-direction:column;gap:0}
.edit-card .d-title{font-size:14px;font-weight:600;color:#333;padding:5px 0;display:flex;align-items:center;gap:8px;margin-bottom:16px}
.edit-card .d-title::before{content:"";display:block;width:3px;height:16px;border-radius:2px;background:var(--cp600,#266EFF);flex-shrink:0}
.edit-card .d-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 48px}
.edit-card .fi{display:flex;flex-direction:row;align-items:center;gap:0;min-height:32px;min-width:0}
.edit-card .fi.full{grid-column:1/-1}
.edit-card .fi-lbl{font-size:13px;color:var(--ctt);width:110px;flex-shrink:0;display:flex;align-items:center;padding-right:8px;white-space:nowrap}
.edit-card .fi-lbl .req{color:#FF4D4F;width:10px;flex-shrink:0;text-align:center}
.edit-card .fi-lbl .fi-txt{flex:1}
.edit-card .fi-ctrl{flex:1;min-width:0}
.edit-card .fi-ctrl .inp,.edit-card .fi-ctrl .sel,.edit-card .fi-ctrl .txt,.edit-card .fi-ctrl .upload{width:100%;min-width:0}
.form-head .tt-r{display:none!important}
.form-foot{position:sticky;bottom:0;width:100%;height:56px;border-top:1px solid var(--cb);background:var(--cg0);display:flex;align-items:center;justify-content:center!important;gap:8px;padding:0 20px;flex-shrink:0}
.panel-foot{height:56px;border-top:1px solid var(--cb);display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:0 20px;flex-shrink:0}
.profile-card{background:#fff;border-radius:4px;box-shadow:0 0 3px rgba(0,0,0,.04);padding:16px 20px;display:flex;flex-direction:column;gap:16px;flex-shrink:0}
.profile-hd{display:flex;align-items:center;gap:20px}
.p-icon{width:48px;height:48px;border-radius:8px;background:#EBF2FF;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.p-meta{flex:1;display:flex;flex-direction:column;gap:6px;min-width:0}
.p-name-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-width:0}
.p-name{font-size:16px;font-weight:600;color:#333}
.p-actions{display:flex;gap:8px;margin-left:auto;align-items:center;flex-shrink:0}
.p-fields{display:flex;gap:24px;flex-wrap:wrap}
.pf{display:flex;align-items:center;gap:4px;font-size:13px}
.pf-l{color:var(--ctt)}
.pf-v{color:#333}
.detail-card{background:#fff;border-radius:4px;box-shadow:0 0 3px rgba(0,0,0,.04);padding:20px;display:flex;flex-direction:column;gap:24px;flex-shrink:0}
.detail-card .d-sec{display:flex;flex-direction:column;gap:0}
.detail-card .d-title{font-size:14px;font-weight:600;color:#333;padding:5px 0;display:flex;align-items:center;gap:8px;margin-bottom:16px}
.detail-card .d-title::before{content:"";display:block;width:3px;height:16px;border-radius:2px;background:#266EFF;flex-shrink:0}
.detail-card .d-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 24px}
.detail-card .d-item{display:flex;flex-direction:row;align-items:baseline;gap:0;min-width:0}
.detail-card .d-lbl{font-size:13px;color:var(--ctt);width:100px;flex-shrink:0}
.detail-card .d-val{font-size:13px;color:#333;flex:1;min-width:0;word-break:break-all}
.dash{display:flex;flex-direction:column;gap:12px}
```

Generated pages must also include the side-nav JS contract:

```js
function toggleSidebar(){
  var sn=document.getElementById('sn')||document.querySelector('.sn');
  if(sn) sn.classList.toggle('collapsed');
}
function toggleNav(ni){
  var sub=ni.nextElementSibling;
  if(sub&&sub.classList.contains('nsl')){
    var open=sub.classList.toggle('open');
    ni.classList.toggle('open',open);
  }
}
function initNav(){
  document.querySelectorAll('.sn .ni').forEach(function(item){
    if(!item.classList.contains('on')) item.classList.remove('open');
  });
  document.querySelectorAll('.sn .nsl').forEach(function(sub){sub.classList.remove('open')});
  var active=document.querySelector('.sn .nsi.active');
  var parent=active&&active.parentElement&&active.parentElement.previousElementSibling;
  if(parent&&parent.classList.contains('ni')){
    parent.classList.add('open');
    active.parentElement.classList.add('open');
  }
}
initNav();
```

## Generation Order

1. Choose page family: dashboard, list, form, detail, or mixed prototype.
2. Copy the shell template.
3. Copy SideNav template and replace navigation labels.
4. For each list page, copy FilterBar and TableCard templates.
5. For each form interaction, copy ModalForm or DrawerDetail plus HorizontalForm.
6. Replace only business-specific labels, fields, columns, actions, status tags, and mock rows.
7. Run visual verification on at least one dashboard and one list/form interaction.
