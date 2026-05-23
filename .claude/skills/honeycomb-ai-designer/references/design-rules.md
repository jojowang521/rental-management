# Honeycomb Design Rules

## Table Of Contents

- 0. 组件库权威来源
- 1. 布局规则
- 2. 组件使用规则
- 3. 状态规范
- 4. 交互规则
- 5. 颜色语义规则
- 6. 信息密度规则

## 0. 组件库权威来源

- 所有基础组件默认以线上 Honeycomb Figma 组件库为视觉权威来源：https://www.figma.com/design/HQFmiqvsbukzAAKbiB1sla/Honeycomb%E4%B8%AD%E5%90%8E%E5%8F%B0%E7%BB%84%E4%BB%B6%E5%BA%93
- 若可连接 Figma MCP，优先读取线上组件库 `HQFmiqvsbukzAAKbiB1sla` 的节点数据。
- 本地 `.fig` 文件只是可选离线缓存，不作为发布版必需文件；`assets/components/design-components.json` 只作为组件 props/token/工程契约，不替代 Figma 视觉。
- 若无法连接 Figma MCP 且无本地 `.fig` 缓存，使用 `assets/templates/`、`assets/tokens/`、`assets/components/` 和缓存图标生成页面。
- 导航图标默认来自 `assets/icons/navigation/navigation-icons.json` 指向的组件库导航图标节点。
- 导航、筛选区、表格卡片、PC 横向表单、弹窗、抽屉、首页看板等易漂移结构必须优先复用 `assets/templates/components/` 下的组件模板；文字规则用于补充，不替代模板结构。

## 1. 布局规则

### 1.1 整体骨架
- PC 端：左侧固定侧边导航（展开 `208px`、收起 `56px`）+ 右侧内容区（flex:1）
- 侧边导航必须支持两类交互：整体展开/收起用 `.sn.collapsed`，父级菜单展开/收起用 `.ni.open + .nsl.open`
- 内容区分三层：48px Topbar → Main/PageBody（flex:1，可滚动或列表内滚动）
- 移动端：无侧边导航，顶部 TabBar 或 Header + 内容区

### 1.2 内容区间距
- Main/PageBody 区域内边距：`12px`（所有方向）
- 筛选区与表格间距：`12px`
- 卡片之间间距：`12px`
- 统计卡片行用 CSS Grid，gap：`12px`
- 默认不生成独立页面说明区。除非用户明确要求，内容区不要出现额外的“大标题 + 描述文案”块；页面名称使用顶栏面包屑或当前页标题表达。

### 1.3 响应式规则
- PC 原型宽度固定为 `1920px`，不做响应式
- 移动端原型宽度固定为 `375px` 或 `414px`
- 禁止在同一原型中混用 PC 和移动端布局

---

## 2. 组件使用规则

### 2.1 按钮层级
- 每个视图区域最多1个 `primary` 按钮
- 主操作放 PageHeader 右侧（新建/导入/导出）
- 次要操作放表格操作列（详情/编辑/删除），使用 `link` 样式
- 危险操作（删除/停用）使用 `danger` 样式，必须二次确认（Modal）
- 按钮间距：相邻按钮 `gap: 8px`

### 2.2 筛选区
- 筛选区生成前先读取并复用 `assets/templates/components/filter-bar.html`
- 筛选区始终在表格上方
- 筛选区按 Honeycomb Figma 组件库筛选条样式还原：白色容器、4px 圆角、`box-shadow:0 0 3px rgba(0,0,0,.04)`；主筛选行 `padding:12px 20px`、`gap:20px`
- 主筛选项使用 PC 左右字段结构：`.fc .fi` 为 `flex-direction:row; align-items:center`，label 在左、control 在右；搜索框可无 label，并使用 `.fi.lg` 宽 `220px`
- 每行最多4个筛选项，超过4个折叠收起
- 筛选条件默认实时查询，筛选区默认不放 `查询`、`重置` 按钮
- 筛选区按钮只允许高级筛选入口：`高级筛选` / `高级查询`
- 高级筛选必须支持展开/收起，不得只是静态按钮。默认结构为 `.adv-btn` 触发 `.adv-row`，展开区使用纵向 `.adv-grid / .adv-fi / .adv-tags / .adv-tag / .adv-date / .adv-range / .adv-input / .adv-select / .adv-actions`
- 高级筛选类型必须覆盖 Honeycomb 组件库常用类别：`类别` 使用 `.adv-tags` 标签组，`日期` 使用 `.adv-date` 日期范围，`范围` 使用 `.adv-range` 数值范围，`录入` 使用 `.adv-input` 文本输入，`选择` 使用 `.adv-select` 下拉选择
- `查询`、`重置`、`新增`、`导入`、`下载模板`、`导出`、`同步`、`批量操作`、`刷新数据`、`视图切换` 等按钮不得放在筛选区
- 全局按钮统一放在列表 `TableToolbar` 右侧；有状态视图时，左侧放状态 tabs，右侧放按钮组
- 筛选项宽度：Input `200px`，Select `160px`，RangePicker `240px`

### 2.3 表格
- 表格卡片生成前先读取并复用 `assets/templates/components/table-card.html`
- 默认每页 `20` 条
- 操作列：`fixed:right`，宽度 `160px`，最多3个操作链接
- 3个以上操作用「更多」下拉菜单收纳
- 状态字段用 Tag 渲染
- 金额/数字字段右对齐
- 时间字段格式：`YYYY-MM-DD HH:mm`
- 表头文字颜色：`var(--color-text-1)`，字重 `500`

### 2.4 表单
- 表单生成前先读取并复用 `assets/templates/components/form-horizontal.html`
- PC 表单默认必须使用左右结构（horizontal）：标签在左、控件在右；禁止使用标签在上、控件在下的上下结构，除非用户明确要求移动端/H5或垂直表单
- 弹窗表单、抽屉表单、编辑页表单、详情页内联编辑表单、高级筛选展开区均遵循左右结构
- 标签宽度统一：常规为 `100px-120px`，同一表单内保持一致；默认使用 `.fi-lbl` 固定宽度 + `.fi-ctrl` 弹性控件区，控件在右侧对齐
- 多列表单只是字段栅格分栏，每个字段内部仍然是左 label + 右 control，不得因为两列布局改成上下结构
- 必填字段标签前加红色星号（`var(--color-error)`）
- 输入框宽度：单行占 `wrapperCol`，不超过 `480px`
- Textarea、Upload、RadioGroup、CheckboxGroup、DateRange、自定义选择器等复杂控件也必须沿用左 label + 右 control
- 多个表单分组时使用同一个白色 `.edit-card` 容器内的轻量 `.d-sec` 分组：分组标题 `.d-title` 为 14px 加粗 + 左侧 3px 蓝色竖条，分组之间 `24px` 间距；禁止默认做成带边框、底色、标题分割线的嵌套 Card
- 页面级表单按钮区必须固定在表单容器底部并水平居中，按钮顺序为取消（default）在左、保存/提交（primary）在右，间距 `8px`；不要在表单标题栏右侧重复放保存/取消按钮
- 弹窗表单、抽屉表单等浮层模式的按钮区保持底部右对齐，按钮顺序为取消/关闭在左、保存/确认（primary）在右，间距 `8px`

### 2.4.1 详情信息头
- 详情页顶部信息卡/信息建档卡默认使用客户/企业档案头样式：白色 `profile-card`，内部为 `.profile-hd`，左侧 48px 蓝色业务图标，中间为主标题 + 标签组 + `.p-fields` 元信息行，右侧为操作按钮组
- 主标题通常为企业/客户/楼宇/单据名称，不要把编号和名称拼成一个指标标题；编号放到下方元信息行
- 标签紧跟标题右侧展示，使用小尺寸彩色 tag，避免做成独立指标卡
- 元信息行展示负责人、添加日期、状态来源、任务编号等关键字段；字体比标题小，信息横向排布
- 详情页顶部不要默认使用“2fr + 多个指标块”的摘要卡，除非用户明确要求 KPI 摘要
- 详情页的普通信息区域使用详情表单样式：`.detail-card` 内包含 `.d-sec / .d-title / .d-grid / .d-item / .d-lbl / .d-val`；标题使用蓝色竖条轻量分组，不使用带底部分割线的卡片标题栏；在单文件多页面原型中应通过 `.detail-card .d-grid` 作用域避免和表单 `.edit-card .d-grid` 冲突
- 详情字段禁止默认做成表格横线或 `.kv` 行分割样式；只有真正的明细列表才使用表格
- 详情页内容超过视口时，详情页自身必须可滚动：`#page-detail.active{overflow:auto}`，内部 `.detail` 只负责内容纵向排布，不要再作为裁切容器；避免 `overflow:hidden` 把时间线、关联记录等下方内容截断

### 2.5 分页
- 分页组件固定在表格下方，右对齐
- 显示总条数：`showTotal: (total) => \`共 ${total} 条\``
- 默认开启 `showSizeChanger`，可选 10/20/50/100
- 报表页可关闭分页（`pagination:false`）

---

## 3. 状态规范

### 3.1 加载状态
- 表格加载：`Grid` 的 `loading:true`，显示骨架屏效果
- 按钮加载：`Button` 的 `loading:true`，禁止重复点击
- 整页加载：在 `Main` 区域中心显示 Spin 组件
- 加载超过 300ms 才显示 loading 状态（避免闪烁）

### 3.2 空状态
- 表格无数据：显示空状态插图 + 说明文字 + 主操作按钮
- 空状态文案格式：「暂无{业务对象}，{引导动作}」
- 示例：「暂无房源，点击新建房源开始管理」
- 搜索无结果：「未找到符合条件的{业务对象}，请调整筛选条件」
- 空状态图标颜色：`var(--color-text-disabled)`

### 3.3 错误状态
- 表单校验失败：在字段下方红色文字提示，颜色 `var(--color-error)`
- 接口请求失败：页面级错误用 Alert（error 类型）展示
- 权限不足：跳转 403 页面，显示「无权限访问」
- 网络异常：Toast 提示「网络异常，请检查网络后重试」
- 错误提示字号：12px，颜色 `var(--color-error)`

### 3.4 成功/反馈状态
- 操作成功：Toast 提示（右上角，3秒自动消失）
- 删除成功后：刷新列表，Toast 提示「删除成功」
- 保存成功后：跳转列表页，Toast 提示「保存成功」
- 导出操作：按钮进入 loading，完成后 Toast 提示「导出成功」

---

## 4. 交互规则

### 4.1 删除操作
- 必须弹出 Modal 二次确认
- 确认 Modal 标题：「确认删除」
- 内容：「删除后不可恢复，确认删除「{名称}」吗？」
- 确认按钮：danger 样式，文字「确认删除」
- 取消按钮：default 样式

### 4.2 表单提交
- 提交前必须前端校验（required 字段不能为空）
- 提交中按钮进入 `loading` 状态，防止重复提交
- 取消表单：若有修改，弹出确认「内容尚未保存，确认离开？」
- 表单重置：清空所有字段，恢复初始值

### 4.3 导航跳转
- 列表页「新建」→ 新建表单页（跳转）
- 列表页「详情」→ 详情页（跳转）
- 列表页「编辑」→ 编辑表单页（跳转）
- 表单页「保存」成功 → 返回列表页
- 表单页「取消」→ 返回列表页（有修改时二次确认）
- 详情页「编辑」→ 编辑表单页

### 4.4 批量操作
- 表格左侧 checkbox 支持多选
- 选中后顶部出现批量操作栏（悬浮于筛选区下方）
- 批量操作栏显示：已选N条 + 操作按钮（批量导出/批量删除等）
- 批量删除同样需要二次确认

---

## 5. 颜色语义规则

| 场景 | Token |
|---|---|
| 主操作、选中、激活 | `var(--color-primary)` |
| 成功、完成、正常 | `var(--color-success)` |
| 警告、待处理、即将到期 | `var(--color-warning)` |
| 错误、失败、停用、逾期 | `var(--color-error)` |
| 信息、进行中、待审批 | `var(--color-info)` |
| 正文 | `var(--color-text-0)` |
| 次要文字、标签 | `var(--color-text-1)` |
| 辅助文字、占位符 | `var(--color-text-2)` |
| 禁用文字 | `var(--color-text-disabled)` |

---

## 6. 信息密度规则

- 表格行高：`48px`（默认 middle 尺寸）
- 普通卡片内边距：`20px`
- 筛选区主行内边距：`12px 20px`
- 相邻区块间距：`12px`
- 页面最大内容宽度：不限（全宽铺满内容区）
- 表格列数：PC 端不超过 `12` 列（含操作列），超出横向滚动
