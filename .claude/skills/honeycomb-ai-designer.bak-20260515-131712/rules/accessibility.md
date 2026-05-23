# Honeycomb 可访问性规则

## 1. 颜色对比度

- 正文文字与背景对比度 ≥ 4.5:1（WCAG AA 标准）
- 大字号（≥18px 或 ≥14px Bold）对比度 ≥ 3:1
- 当前 token 对比度验证：
  - `--color-text-0`（#333）on `--color-bg-white-0`（#fff）→ 12.6:1 ✅
  - `--color-text-1`（#666）on `--color-bg-white-0`（#fff）→ 5.7:1 ✅
  - `--color-text-2`（#999）on `--color-bg-white-0`（#fff）→ 2.8:1 ⚠️（仅用于辅助文字）
  - `--color-primary`（#6a3ac7）on `--color-bg-white-0`（#fff）→ 7.2:1 ✅
- 禁止仅用颜色区分信息（如状态），必须同时使用图标或文字

## 2. 键盘导航

- 所有交互元素必须可通过 `Tab` 键聚焦
- 焦点样式：`outline: 2px solid var(--color-border-focus); outline-offset: 2px`
- 禁止移除 `outline`（不能写 `outline:none`），可替换为自定义焦点样式
- 模态框打开时，焦点锁定在模态框内（Focus Trap）
- 模态框关闭后，焦点返回触发元素
- 下拉菜单：`↑↓` 方向键切换选项，`Enter` 确认，`Esc` 关闭

## 3. ARIA 语义

- 图标按钮（无文字）必须有 `aria-label`
  - 示例：`<button aria-label="删除">🗑</button>`
- 表格必须有 `role="table"` 和列头 `scope="col"`
- 表单输入框通过 `for/id` 或 `aria-labelledby` 关联标签
- 加载状态：`aria-busy="true"` 加在加载区域的容器上
- 展开/收起：使用 `aria-expanded="true|false"`
- 模态框：`role="dialog"`, `aria-modal="true"`, `aria-labelledby` 指向标题
- 必填字段：`aria-required="true"`
- 错误提示：`aria-describedby` 关联到错误信息元素

## 4. 语义化 HTML（HTML 预览输出时适用）

- 页面标题用 `<h1>`，卡片标题用 `<h2>`，子标题用 `<h3>`
- 导航用 `<nav>`，主内容用 `<main>`，页头用 `<header>`
- 列表用 `<ul>/<li>`，不用 `<div>` 模拟列表
- 按钮用 `<button>`，链接用 `<a>`，不互换使用
- 表格必须有 `<thead>/<tbody>`，表头用 `<th>`

## 5. 文字与间距

- 最小可点击区域：`44px × 44px`（移动端），PC 端 `32px × 32px`
- 行间距至少为字号的 1.5 倍（已在 typography token 中保证）
- 禁止文字截断（overflow:hidden）时不提供 tooltip 展示完整内容
- 长文本截断时加 `title` 属性显示完整文本

## 6. 生成原型时的可访问性检查点

每次生成 HTML 预览时，确认以下项：
- [ ] 图标按钮有 `aria-label`
- [ ] 输入框有关联的 `<label>`
- [ ] 颜色不是唯一的信息区分手段（Tag 有文字）
- [ ] 焦点样式未被移除
- [ ] 页面有且仅有一个 `<h1>`
