---
name: honeycomb-ai-designer
description: |
  Honeycomb ERP 高保真原型生成专家。当用户需要以下帮助时激活：
  1. 从一句话需求生成高保真页面原型（HTML 可预览 / 原型 JSON）
  2. 从 Figma 设计稿/链接提取设计数据并生成对齐的页面
  3. 产品经理快速出中后台原型（列表页/表单页/详情页/看板/审批页）
  4. 验证界面是否符合 Honeycomb 组件规范和设计 token
  5. 生成符合 Token-Strict 规范的原型 JSON（颜色只用 var(--color-*)）
  需要参考 Figma 时优先使用 Figma MCP（若已连接）。
---

# Honeycomb AI Designer

> 高保真原型生成专家，严格遵循团队 design tokens 与组件契约。

## 文件索引

| 文件 | 用途 |
|---|---|
| `tokens/design-tokens.json` | 颜色/间距/圆角/字体/阴影 token（权威来源）|
| `components/design-components.json` | 组件最小契约（props / token 映射）|
| `patterns/design-patterns.json` | 页面骨架 pattern（ListPage/FormPage/…）|
| `prompts/generate-figma.md` | 从 Figma 提取设计数据的流程 |
| `prompts/generate-page.md` | 页面生成主流程（解析需求→组件树→输出）|
| `prompts/generate-ui.md` | HTML 预览输出规范（CSS 工具类 + :root 变量）|
| `rules/design-rules.md` | 布局/交互基础规则 |
| `rules/accessibility.md` | 可访问性规则 |
| `scripts/figma-sync.js` | 从 Figma API 同步颜色 token 的脚本 |

---

## 核心约束（Token-Strict）

- **颜色**：只允许 `var(--color-*)`，禁止 `#xxxxxx`/`rgb()`/`hsl()`
- **阴影/排版**：JSON 原型中只允许 `tokenRef("effect.shadow.*")` / `tokenRef("typography.*")`
- **HTML 预览**：颜色仍用 `var(--color-*)`；阴影/spacing/radius 可用具体 px 数值
- **组件优先**：能用 `components/design-components.json` 中的标准组件就不自造结构

---

## 快速上手：三种使用方式

### 方式 A：一句话生成页面（最常用）

```
用户：「帮我生成一个房源管理列表页，PC端，有名称/地址/状态筛选，表格显示房源编号、名称、面积、租金、状态，支持新建和导出」
```

AI 执行流程：
1. 读 `prompts/generate-page.md` → 解析需求 → 确认 pattern=`ListPage`
2. 读 `patterns/design-patterns.json` → 取 `ListPage` structure
3. 读 `components/design-components.json` → 填写组件 props
4. 读 `tokens/design-tokens.json` → 应用 token
5. 用户要 HTML → 同时读 `prompts/generate-ui.md`
6. 输出原型 JSON + HTML 预览 + 校验清单

### 方式 B：从 Figma 链接生成（需 Figma MCP）

```
用户：「参考这个 Figma 帮我生成合同列表页：
https://www.figma.com/design/YnekqUcG4ElWENxUoffqcv/...?node-id=411-77456」
```

AI 执行流程：
1. 读 `prompts/generate-figma.md` → 提取 fileKey + nodeId
2. 调用 Figma MCP 读取节点数据
3. 匹配 token，识别组件
4. 后续同方式 A 的 Step 3–6

### 方式 C：同步 Figma Token（设计师更新色板后执行）

```bash
export FIGMA_TOKEN=figd_xxxxxxxxxxxxxxxx
node .claude/skills/honeycomb-ai-designer/scripts/figma-sync.js HQFmiqvsbukzAAKbiB1sla
```

同步后会更新 `tokens/design-tokens.json` 的 `color` 块，spacing/radius/typography 不受影响。

---

## Figma 业务案例参考

**中后台设计模板**（布局/信息密度参考权威源）：
`https://www.figma.com/design/YnekqUcG4ElWENxUoffqcv/中后台设计模板?node-id=411-76882`

| pattern | 参考节点 |
|---|---|
| `ListPage` | node-id=411-77456 / 411-85519 / 411-79248 |
| `FormPage` | node-id=5952-110498 / 1324-166993 / 5952-109908 |
| `DetailPage` | node-id=6575-38012 / 5955-167731 / 5955-168141 |

**Honeycomb 组件库**（组件视觉/状态参考）：
`https://www.figma.com/design/HQFmiqvsbukzAAKbiB1sla/Honeycomb中后台组件库?node-id=1415-58614`

**组件文档**：`https://honeycomb.mingyuanyun.com/component/`

---

## 组件优先级规则

1. 标准组件（`components/design-components.json`）> 自定义组合
2. pattern 骨架（`patterns/design-patterns.json`）> 自由布局
3. Figma 案例布局 > 自由发挥
4. tokens > 硬编码值

**推荐 pattern → 组件组合：**

| pattern | 组件树 |
|---|---|
| `ListPage` | SideNav + PageHeader + FilterBar(Form) + Grid + Pagination |
| `FormPage` | SideNav + PageHeader + Card + Form(FormItem[]) + Button[取消,保存] |
| `DetailPage` | SideNav + PageHeader + Tabs + Card(InfoProfile/Grid) |
| `Dashboard` | SideNav + PageHeader + CardGrid(Statistic) |
| `ApprovalPage` | SideNav + PageHeader + Steps + Form |
| `ReportPage` | SideNav + PageHeader + FilterBar + Statistic[] + Grid |

---

## 输出格式

### 原型 JSON（Token-Strict）

```json
{
  "name": "页面名称",
  "platform": "pc",
  "width": 1920,
  "height": 1080,
  "pattern": "ListPage",
  "figmaRef": "https://www.figma.com/design/.../...?node-id=411-77456",
  "nodes": [
    {
      "id": "page-root",
      "type": "Page",
      "props": {},
      "style": { "backgroundColor": "var(--color-bg-grey-0)" },
      "children": []
    }
  ]
}
```

### HTML 预览

参见 `prompts/generate-ui.md`：
- 完整独立 HTML，`<style>` 内联
- `:root` 变量块必须完整
- 使用 `generate-ui.md` 中定义的工具类

---

## 校验清单（每次输出必须附带）

1. ✅/❌ 颜色是否全部来自 `var(--color-*)`
2. ✅/❌ 阴影/排版是否全部来自 `tokenRef("...")`（JSON 模式）
3. ✅/❌ 是否存在硬编码颜色值（`#xxxxxx`/`rgb()`/`hsl()`）
4. ✅/❌ 页面结构是否符合所选 pattern 骨架
5. ✅/❌ `width` 是否在 {375, 414, 1920} 之内
6. ✅/❌ 布局是否对齐 Figma 业务案例（差异说明）
7. ✅/❌ 组件是否对齐 Honeycomb 组件文档（差异说明 + 参考链接）
