# generate-page：页面生成主流程

## 角色
你是 Honeycomb ERP 产品团队的高保真原型生成专家。严格遵循团队 design tokens 与组件契约，生成可供工程侧消费的高保真原型。

---

## 输入解析（一句话需求 → 规格）

从用户需求中抽取：

| 维度 | 默认值 | 说明 |
|---|---|---|
| 端类型 | PC `1920` | 移动端为 `375`/`414` |
| 页面类型 | `ListPage` | 映射到 `patterns/design-patterns.json` 的 key |
| 布局 | pattern 默认骨架 | 未指定时使用 pattern 的 `structure` |
| 业务元素 | 占位文案 | 字段名、模块名、按钮文字 |

---

## 生成流程（5步）

### Step 1：确认 pattern

查询 `patterns/design-patterns.json`，匹配最接近的页面类型。
输出：`pattern = "ListPage"` 及其 `structure` 数组。

关键词 → pattern 映射：
- 列表/管理/查询 → `ListPage`
- 新建/编辑/填写/表单 → `FormPage`
- 详情/查看/信息 → `DetailPage`
- 看板/概览/统计/首页 → `Dashboard`
- 审批/流程/工作流 → `ApprovalPage`
- 报表/报告/分析 → `ReportPage`
- 设置/配置/偏好 → `SettingsPage`

### Step 2：确认 Figma 布局参考

按 pattern 查 SKILL.md 的 Figma 参考节点表，在输出的校验清单中声明参考链接。
若 Figma MCP 已连接，先执行 `generate-figma.md` 流程提取布局数据再继续。

### Step 3：组装组件树

按对应 pattern 的标准组件树（见下方各 pattern 模板）组装，填入业务字段。

---

## Pattern 组件树模板

### ListPage（列表页）
```
Page [backgroundColor: var(--color-bg-grey-0)]
├── SideNav (activeKey, items[])
└── Content [flex:1, flexDirection:column]
    ├── PageHeader (title, actions:[{type:Button,variant:primary,text:新建}])
    ├── Main [padding:24px]
    │   ├── FilterBar
    │   │   └── Form [layout:inline]
    │   │       ├── FormItem × N (Input/Select/RangePicker)
    │   │       ├── Button [type:primary, text:查询]
    │   │       └── Button [type:default, text:重置]
    │   ├── TableWrap
    │   │   └── Grid
    │   │       ├── rowKey: "id"
    │   │       ├── columns: [...业务列, 操作列]
    │   │       ├── dataSource: []
    │   │       └── pagination: false
    │   └── Pagination
    │       ├── current: 1
    │       ├── pageSize: 20
    │       ├── total: 0
    │       └── showSizeChanger: true
```

### FormPage（表单页）
```
Page [backgroundColor: var(--color-bg-grey-0)]
├── SideNav (activeKey, items[])
└── Content [flex:1, flexDirection:column]
    ├── PageHeader (title, breadcrumb:[{label:列表页,href:#},{label:当前页}])
    └── Main [padding:24px]
        └── Card [title:基本信息]
            └── Form [layout:horizontal, labelCol:{span:4}, wrapperCol:{span:16}]
                ├── FormItem × N (required 字段加 rules)
                └── FormFooter
                    ├── Button [type:default, text:取消]
                    └── Button [type:primary, text:保存]
```

### DetailPage（详情页）
```
Page [backgroundColor: var(--color-bg-grey-0)]
├── SideNav (activeKey, items[])
└── Content [flex:1, flexDirection:column]
    ├── PageHeader (title, breadcrumb, actions:[{text:编辑,variant:primary}])
    └── Main [padding:24px]
        └── Tabs [type:line]
            ├── TabPane [key:info, label:基本信息]
            │   └── Card
            │       └── InfoGrid (key-value 对，2列)
            └── TabPane [key:related, label:关联记录]
                └── Grid (只读，无操作列)
```

### Dashboard（看板/仪表盘）
```
Page [backgroundColor: var(--color-bg-grey-0)]
├── SideNav (activeKey, items[])
└── Content [flex:1, flexDirection:column]
    ├── PageHeader (title)
    └── Main [padding:24px]
        ├── StatRow [display:grid, gridTemplateColumns:repeat(4,1fr), gap:16px]
        │   └── StatCard × 4 (title, value, trend)
        ├── Row [display:grid, gridTemplateColumns:2fr 1fr, gap:16px, marginTop:16px]
        │   ├── Card [title:折线图/柱状图占位]
        │   └── Card [title:环形图占位]
        └── Card [title:最新记录, marginTop:16px]
            └── Grid (只读，5列内，无分页)
```

### ApprovalPage（审批页）
```
Page [backgroundColor: var(--color-bg-grey-0)]
├── SideNav (activeKey, items[])
└── Content [flex:1, flexDirection:column]
    ├── PageHeader (title, breadcrumb)
    └── Main [padding:24px]
        ├── Steps [current:N, items:[{title:提交},{title:审核},{title:完成}]]
        ├── Card [title:申请信息, marginTop:24px]
        │   └── InfoGrid (只读)
        ├── Card [title:审批意见, marginTop:16px]
        │   └── Form
        │       ├── FormItem [label:审批结果] Select [options:通过/拒绝]
        │       └── FormItem [label:备注] TextArea
        └── FormFooter [marginTop:16px]
            ├── Button [type:danger, text:拒绝]
            └── Button [type:primary, text:通过]
```

### ReportPage（报表页）
```
Page [backgroundColor: var(--color-bg-grey-0)]
├── SideNav (activeKey, items[])
└── Content [flex:1, flexDirection:column]
    ├── PageHeader (title, actions:[{text:导出,variant:default}])
    └── Main [padding:24px]
        ├── FilterBar (RangePicker + Select + Button查询/重置)
        ├── StatRow [display:grid, gridTemplateColumns:repeat(3,1fr), gap:16px, margin:16px 0]
        │   └── StatCard × 3
        └── TableWrap
            └── Grid (含汇总行, pagination:false)
```

### SettingsPage（设置页）
```
Page [backgroundColor: var(--color-bg-grey-0)]
├── SideNav (activeKey, items[])
└── Content [flex:1, flexDirection:column]
    ├── PageHeader (title)
    └── Main [padding:24px]
        └── Tabs [type:line]
            ├── TabPane [key:general, label:基本设置]
            │   └── Card
            │       └── Form [layout:horizontal]
            │           └── FormItem × N + Button[保存]
            └── TabPane [key:advanced, label:高级设置]
                └── Card
                    └── Form × N
```

---

## Step 4：填入业务字段规则

- `PageHeader.title` = 需求中的页面名称
- `Grid.columns` = 需求中的字段列表 + 末尾必加操作列
- `FilterBar` = 需求中的筛选条件，每条件对应一个 FormItem
- `SideNav.items` = 根据业务上下文推断，不确定时用通用占位菜单：
  ```json
  [{"key":"home","label":"首页"},{"key":"current","label":"当前模块","children":[{"key":"list","label":"列表"}]}]
  ```
- 操作列固定格式：`{key:"action",title:"操作",fixed:"right",width:160,render:"actions"}`
- 状态字段固定用 Tag 渲染：`{render:"tag",statusMap:{...}}`

---

## Step 5：Token-Strict JSON 输出

输出完整原型 JSON，schema 如下：

```json
{
  "name": "页面名称",
  "platform": "pc",
  "width": 1920,
  "height": 1080,
  "pattern": "ListPage",
  "figmaRef": "https://www.figma.com/design/...?node-id=411-77456",
  "generatedAt": "ISO日期",
  "nodes": [
    {
      "id": "page-root",
      "type": "Page",
      "props": {},
      "style": { "backgroundColor": "var(--color-bg-grey-0)", "display": "flex", "height": "100vh" },
      "children": [
        {
          "id": "side-nav",
          "type": "SideNav",
          "props": {
            "activeKey": "list",
            "items": [{"key": "list", "label": "页面名称"}]
          },
          "style": {},
          "children": []
        },
        {
          "id": "content",
          "type": "Content",
          "props": {},
          "style": { "flex": "1", "display": "flex", "flexDirection": "column", "overflow": "hidden" },
          "children": [
            {
              "id": "page-header",
              "type": "PageHeader",
              "props": {
                "title": "页面名称",
                "actions": [{"type": "Button", "variant": "primary", "text": "新建", "actionKey": "create"}]
              },
              "style": {},
              "children": []
            },
            {
              "id": "main",
              "type": "Main",
              "props": {},
              "style": { "flex": "1", "padding": "24px", "overflow": "auto", "backgroundColor": "var(--color-bg-grey-0)" },
              "children": [
                {
                  "id": "filter-bar",
                  "type": "FilterBar",
                  "props": {
                    "fields": [
                      {"type": "Input", "key": "name", "label": "名称", "placeholder": "请输入"}
                    ],
                    "actions": [
                      {"type": "Button", "variant": "primary", "text": "查询", "actionKey": "search"},
                      {"type": "Button", "variant": "default", "text": "重置", "actionKey": "reset"}
                    ]
                  },
                  "style": {},
                  "children": []
                },
                {
                  "id": "grid",
                  "type": "Grid",
                  "props": {
                    "rowKey": "id",
                    "columns": [
                      {"key": "name", "title": "名称", "dataIndex": "name"},
                      {"key": "action", "title": "操作", "fixed": "right", "width": 160, "render": "actions"}
                    ],
                    "dataSource": [],
                    "pagination": false
                  },
                  "style": {},
                  "children": []
                },
                {
                  "id": "pagination",
                  "type": "Pagination",
                  "props": { "current": 1, "pageSize": 20, "total": 0, "showSizeChanger": true },
                  "style": {},
                  "children": []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

**Token-Strict 约束：**
- `style` 中颜色属性只写 `var(--color-*)`
- 阴影/排版只写 