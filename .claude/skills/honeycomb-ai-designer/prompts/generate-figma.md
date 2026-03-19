# generate-figma：从 Figma 提取设计数据流程

## 触发时机
用户提供 Figma 链接，或说「从 Figma 读取」「对齐设计稿」时执行此流程。

## Step 1：解析链接，提取 fileKey 和 nodeId

从 URL 中提取：
- `fileKey`：`/design/{fileKey}/` 段
- `nodeId`：`node-id=` 参数（将 `-` 替换为 `:` 作为 API 参数）

示例：
```
https://www.figma.com/design/HQFmiqvsbukzAAKbiB1sla/Honeycomb组件库?node-id=1415-58614
→ fileKey = HQFmiqvsbukzAAKbiB1sla
→ nodeId  = 1415:58614
```

## Step 2：读取节点数据（通过 Figma MCP）

调用 MCP 工具读取节点，重点提取：

| 提取目标 | Figma 字段 | 映射到 |
|---|---|---|
| 颜色 | `fills[].color` (RGBA) | `--color-*` CSS 变量 |
| 文字样式 | `style.fontSize / fontWeight / lineHeightPx` | `tokenRef("typography.*")` |
| 阴影 | `effects[].type=DROP_SHADOW` | `tokenRef("effect.shadow.*")` |
| 间距 | `paddingLeft/Right/Top/Bottom` | 取最近的 `--spacing-*` 档位 |
| 圆角 | `cornerRadius` | 取最近的 `--radius-*` 档位 |
| 尺寸 | `absoluteBoundingBox.width/height` | 写入 `style.width/height` |

## Step 3：颜色匹配规则

读取到 RGBA 后，按以下顺序匹配 CSS 变量：
1. 精确匹配 `design-tokens.json` 中 `color.*.value`
2. 近似匹配（容差 ±5）
3. 无匹配时：**禁止**写入十六进制值，改为写注释 `/* TODO: 补充 token */`

## Step 4：间距对齐规则（4px 网格）

读取到像素值后，向下取最近的 spacing token：
```
1–4px   → --spacing-1 (4px)
5–8px   → --spacing-2 (8px)
9–12px  → --spacing-3 (12px)
13–16px → --spacing-4 (16px)
17–20px → --spacing-5 (20px)
21–24px → --spacing-6 (24px)
25–32px → --spacing-8 (32px)
33–40px → --spacing-10 (40px)
```

## Step 5：组件识别

若节点名称包含以下关键词，直接映射到对应组件契约：

| 节点名关键词 | 映射组件 |
|---|---|
| Button / 按钮 | `Button` |
| Input / 输入框 | `Input` |
| Select / 下拉 | `Select` |
| Table / Grid / 表格 | `Grid` |
| Pagination / 分页 | `Pagination` |
| Form / 表单 | `Form` |
| Modal / Dialog / 弹窗 | `Modal` |
| Tabs / 标签页 | `Tabs` |
| Tag / 标签 | `Tag` |
| Nav / 导航 / Sidebar | `SideNav` |
| Header / 页头 | `PageHeader` |

## Step 6：输出结构

提取完成后，整理为以下结构供后续 generate-page 使用：

```json
{
  "source": "figma",
  "fileKey": "HQFmiqvsbukzAAKbiB1sla",
  "nodeId": "1415:58614",
  "extractedTokens": {
    "colors": { "primary": "var(--color-primary)", "..." : "..." },
    "typography": "tokenRef(\"typography.heading-md\")",
    "shadow": "tokenRef(\"effect.shadow.card\")"
  },
  "components": ["SideNav", "PageHeader", "Grid", "Pagination"],
  "layout": "left-nav + content",
  "pattern": "ListPage"
}
```

## 禁止事项
- 禁止将颜色硬编码为 `#xxxxxx` 或 `rgb()` 写入原型
- 禁止跳过 Step 3 匹配直接使用 Figma 原始色值
- 禁止修改 `design-tokens.json`（只读引用）
