# MytePro Visual Standard

无截图、无 Figma 节点、无用户指定其它风格时，HTML 预览与 PC 管理台原型默认使用本标准。本标准以 `assets/templates/rental-management/` 三个高保真页面为基准，优先约束视觉外壳、信息密度、列表页组织方式、表单页结构和详情页结构；业务字段仍以用户需求为准。

## Table Of Contents

- 0. 模板基准
- 1. 管理台外壳
- 2. ListPage 默认结构
- 3. 表格工具栏
- 4. 信息密度
- 5. Token 规则
- 6. 账单列表默认业务处理

## 0. 模板基准

生成前先按页面类型选择参考模板：

| 页面类型 | 参考文件 |
|---|---|
| 列表页 | `assets/templates/rental-management/prototype-list-page.html` |
| 表单/编辑页 | `assets/templates/rental-management/prototype-edit-page.html` |
| 详情页 | `assets/templates/rental-management/prototype-detail-page.html` |

对导航、筛选、表格卡片、横向表单、弹窗、抽屉、首页看板等高频结构，优先使用 `assets/templates/components/` 中的组件模板，再填充业务字段和 mock 数据；不要仅凭文字规则重写这些结构。

这三个模板体现当前默认 MytePro 管理台风格：`208px` 深色侧栏、`48px` 顶栏、内容区 `12px` padding、卡片 `4px` 圆角、弱阴影、32px 控件高度、13px 主体字号。

详情页必须复用 `assets/templates/rental-management/prototype-detail-page.html` 的结构，并优先从 `assets/templates/components/detail-profile.html` 复制对应组件块。顶部信息头使用白色 `.profile-card`：内部为 `.profile-hd`，左侧 48px 蓝色业务图标，中间为主标题、标签组和 `.p-fields` 元信息行，右侧放操作按钮组；不要默认用多个指标块代替信息头。关键指标使用 `.stat-row > .stat-card`，放在信息头下方。普通信息使用 `.detail-card`，内部为 `.d-sec / .d-title / .d-grid / .d-item / .d-lbl / .d-val` 的详情表单样式，禁止默认做成带横线分隔的 `.kv` 表格行。Tabs 内容承载方式为：`tabs-bar` 下方每个 `tab-panel` 内容都放在白色 `.detail-card` 或 `.detail-table-card` 中。表格类内容使用 `.detail-card.detail-table-card` 白底容器并设置 `padding:0; overflow:hidden`，不允许表格或日志直接裸露在灰色页面背景上。详情页弹窗内分组表单使用 `.modal-detail-form / .m-sec / .m-title / .m-grid / .mfi`。

## 1. 管理台外壳

- 左侧固定深色导航，宽 `208px`，收起宽 `56px`，背景 `#1C1C1E` 只允许集中写在 `:root` 或外壳基础样式里。
- Logo 区高 `44px`，`padding:11px 16px`，底部 `1px solid rgba(255,255,255,.12)`。
- 右侧内容区为 `.main`，内部是 `48px` 白色 `.topbar` + 浅灰 `.pb`。
- `.topbar` 高 `48px`，底部 `1px solid var(--cb)`，左侧面包屑，右侧放图标按钮或页面动作。
- `.pb` 使用 `padding:12px; gap:12px; background:var(--cbg); overflow-y:auto`。
- 普通内容卡片白底、`border-radius:4px`、`box-shadow:0 0 3px rgba(0,0,0,.04)`。
- 默认不在内容区额外生成页面说明区、宣传式标题区或“标题 + 描述文案”块。页面定位由 `.topbar` 面包屑/当前标题表达，内容区第一屏直接进入筛选区、表格、表单或详情概要。

### 1.1 左侧导航层级

MytePro 租赁/资产管理类页面必须优先使用以下导航树，不要生成扁平导航：

```
首页
房源管理
├── 房源列表
└── 房源地图
合同管理
├── 合同列表
├── 续签管理
└── 到期提醒
租户管理
账单管理
├── 账单列表
├── 收款记录
└── 欠费催收
工单管理
```

- 一级菜单 `.ni` 使用 `padding:13px 20px; gap:16px; font-size:14px`。
- 二级菜单 `.nsi` 使用 `padding:9px 20px 9px 52px; font-size:13px`。
- 父级包含图标、文案、右侧展开箭头；已展开用向上箭头，未展开用向下箭头。
- 左侧导航必须支持整体展开/收起：`.sn` 展开宽 `208px`，`.sn.collapsed` 收起宽 `56px`；收起时隐藏 `.sn-txt`、`.ni-lb`、`.ni-arrow`、`.nsl` 和 `.sn-foot`。
- 父级菜单必须支持点击展开/收起：父级 `.ni` 绑定 `toggleNav(this)`，对应子菜单 `.nsl` 通过 `.open` 控制显示；页面初始化调用 `initNav()`，只自动展开当前 active 子级所在父级。
- 一级导航图标默认来自 `assets/icons/navigation/navigation-icons.json` 指向的 Honeycomb Figma 组件库导航图标；生成时按业务模块 key 匹配本地 `assets/icons/navigation/svg/*.svg`，没有本地 SVG 时再读取 Figma 节点。
- 图标统一 16x16，静态 HTML / `file://` 预览使用真实 `<img class="ni-img" src="assets/icons/navigation/svg/<key>.svg" alt="">` 节点；深色侧栏只通过 `.ni-img` 的 `opacity/filter` 统一处理图标明暗，不为单个菜单硬编码颜色。
- 当前页面高亮子级，而不是把整个父级做成蓝色块；当前子级文字使用 `#60A5FA`，背景 `rgba(37,99,235,.15)`。
- 生成账单列表页时，`账单管理` 必须展开，`账单列表` 必须为 active；同时 `房源管理` 和 `合同管理` 默认展开展示子菜单。
- 若产品不是租赁/资产管理域，仍应保持“父级模块 + 子级页面”的层级导航形态，不要退化成 9 个一级菜单。

## 2. ListPage 默认结构

PC 列表页必须使用：

```
SideNav
Content
├── PageHeader
└── Main
    ├── MetricCards / ChartCards / ConfigCards（可选）
    ├── FilterBar / FilterCard
    └── TableCard
        ├── TableToolbar
        ├── Grid
        └── Pagination
```

- 数据指标、统计卡片、趋势图、配置卡片一般放在筛选条件上方。
- 除非用户明确要求，不要在筛选区上方放页面标题和解释文案。
- 筛选区必须紧贴列表：`FilterBar` 后面直接是 `TableCard`，中间不要插入指标卡、图表卡、说明卡或其它内容。
- 筛选区是白色容器，位于表格上方，圆角 `4px`，弱阴影，主筛选行 `padding:12px 20px`。
- 表格与筛选区间距 `12px`。
- 筛选条件默认实时查询，筛选区默认不放 `查询`、`重置` 按钮。
- 筛选区按钮只允许高级筛选入口：`高级筛选` / `高级查询`。不得放 `查询`、`新增`、`导入`、`下载模板`、`导出`、`同步`、`批量操作`、`刷新数据`、`视图切换` 等按钮。
- 只要出现 `高级筛选` / `高级查询`，必须复用 `assets/templates/rental-management/prototype-list-page.html` 的展开收起结构：主筛选行按钮 `.adv-btn`，展开区 `.adv-row`，内部 `.adv-grid / .adv-fi / .adv-tags / .adv-tag`，底部 `.adv-actions`，并提供 `toggleAdv()` 控制展开收起、按钮 active 状态、箭头旋转和主筛选行 `.has-adv` 分隔线。
- 高级筛选展开区内的筛选项仍然实时生效；底部只允许 `清空筛选` 这类筛选辅助操作，不放查询、导入、导出、新增、同步等全局按钮。
- 全局按钮必须放到列表 `TableToolbar` 右侧；参考布局为左侧状态视图 tabs，右侧按钮组。
- 表格必须包在白色 `TableCard` 中；分页在同一个 `TableCard` 底部，不单独漂浮。
- `Grid.pagination` 保持 `false`，使用独立 `Pagination`。
- 列表页内容区必须自适应浏览器高度：`.pb { min-height:0 }`，`.tc { flex:1; display:flex; flex-direction:column; min-height:0 }`，`.tw { flex:1; overflow:auto; min-height:0 }`。

## 3. 表格工具栏

- 表格卡片顶部默认有 `TableToolbar`，使用 `.tt`，`padding:12px 20px; border-bottom:1px solid var(--cb)`。
- 左侧优先放状态 tabs；右侧放按钮组。
- 有状态字段时必须生成状态 tabs。常见映射：
  - 账单/收款：`全部 / 未收 / 已收 / 逾期`
  - 房源：`全部 / 已出租 / 空置中 / 维修中 / 已下架`
  - 合同：`全部 / 履约中 / 待续签 / 即将到期 / 已终止`
- 有批量操作时，默认放工具栏右侧，例如 `批量催收`、`批量导出`。
- 每个列表视图最多一个 `primary` 按钮；默认放工具栏最右侧，如 `新增账单` / `新增房源` / `新建线索`。
- 只有用户明确要求“选中后展示批量操作”时，才生成选中态批量操作栏。

## 4. 信息密度

- `Topbar` 高 `48px`。
- `FilterBar` 推荐高 `56px` 左右。
- `TableToolbar` 推荐高 `56px` 左右。
- PC 表单、弹窗表单、抽屉表单默认使用左右结构：label 左侧固定宽度并右对齐，control 在右侧；不要生成 label 在上、input 在下的上下结构。
- 表单 label 推荐宽 `100px-120px`，同一表单保持统一；两列表单只是字段区域分列，字段内部仍保持左 label + 右 control。默认表单字段结构参考 `.edit-card .fi / .fi-lbl / .fi-ctrl`。
- 页面级表单按钮固定在底部 footer 并水平居中；弹窗、抽屉等浮层表单按钮固定在面板底部并右对齐。不要在页面级表单标题栏重复放保存/取消。
- 表头高 `40px` 左右，表格行高 `44px-56px`，根据字段密度选择。
- 分页行高 `44px-56px`，左侧显示总数，右侧显示页码与每页条数。
- 表格内容字号 `13px`，表头字重 `600`。
- 金额、面积、数量等数字列右对齐。
- 操作列固定右侧，宽度 `160px`，操作使用蓝色 link 样式。

## 5. Token 规则

- JSON 原型中颜色只允许 `var(--color-*)`。
- HTML 预览的颜色优先使用 Honeycomb token；MytePro 外壳允许补充以下扩展 token：
  - `--color-bg-nav`
  - `--color-bg-nav-line`
  - `--color-text-nav-0`
  - `--color-text-nav-1`
  - `--color-text-nav-2`
- 禁止在 HTML 样式体内散落业务色值；色值集中写在 `:root`。

## 6. 账单列表默认业务处理

生成账单管理列表页时：

- 导航归属 `账单管理`，子菜单默认包含 `账单列表 / 收款记录 / 欠费催收`。
- 筛选默认包含：租户姓名或账单编号搜索、收款状态、账单月份、高级筛选。
- 表格工具栏 tabs 默认：`全部 / 未收 / 已收 / 逾期`。
- 工具栏右侧默认：`批量催收`、`批量导出`、`新增账单`。
- 状态 Tag 映射：`未收=warning`、`已收=success`、`逾期=error`。
- 操作列默认：`收款`、`查看`，均为 link；`收款` 使用主链接色。
