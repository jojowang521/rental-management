---
name: honeycomb-ai-designer
description: |
  Honeycomb ERP 高保真原型生成专家。当用户需要以下帮助时激活：
  1. 从一句话需求生成高保真页面原型（HTML 可预览）
  2. 从 Figma 设计稿/链接提取设计数据并生成对齐的页面
  3. 产品经理快速出中后台原型（列表页/表单页/详情页）
  4. 验证界面是否符合 Honeycomb 组件规范和设计 token
---

# Honeycomb AI Designer

> 所有生成的 HTML 必须基于 `templates/shell.html` 的框架结构。

---

## 核心约束

- 颜色只用 `var(--cp*)` / `var(--cg*)` / `var(--ce*)` 等，禁止硬编码 `#xxxxxx`
- 所有页面复用 `templates/shell.html` 的侧边导航、顶栏、JS 函数
- 导航模块顺序和链接必须与「标准导航」完全一致，禁止重复插入

---

## CSS Token 声明（每个新页面必须照抄）

```css
:root{
  --cp50:#EBF2FF;--cp100:#D0E4FF;--cp500:#266EFF;--cp600:#266EFF;--cp700:#1A55D6;
  --cg0:#fff;--cg25:#FAFAFA;--cg50:#F5F5F5;--cg100:#F0F0F0;--cg200:#E8E8E8;
  --cg300:#D9D9D9;--cg400:#BFBFBF;--cg500:#8C8C8C;--cg600:#595959;--cg800:#262626;
  --cs50:#F6FFED;--cs500:#52C41A;--cs600:#389E0D;
  --cw50:#FFFBE6;--cw500:#FAAD14;
  --ce50:#FFF1F0;--ce500:#FF4D4F;--ce600:#CF1322;
  --cbg:#F0F2F5;--cbase:#fff;--cb:#E8E8E8;--cbsub:#F5F5F5;
  --ctp:#262626;--cts:#595959;--ctt:#8C8C8C;--ctd:#BFBFBF;--ctl:#266EFF;
  --ff:-apple-system,"PingFang SC","Microsoft YaHei",Arial,sans-serif;
}
```

---

## 整体布局

```
body (display:flex, height:100vh, overflow:hidden)
├── aside.sn          # 侧边导航，208px，背景 #1C1C1E
└── div.main
    ├── div.topbar    # 顶部栏，48px，白色
    └── div.pb        # 内容区，overflow-y:auto，padding:12px，gap:12px
```

---

## 侧边导航规范

- **宽度**：展开 208px / 收起 56px（`.sn.collapsed`）
- **Logo 区**：高 44px，`padding:11px 16px`，底部 `rgba(255,255,255,.12)` 分隔线
- **一级菜单 `.ni`**：`padding:13px 20px; gap:16px`，色 `rgba(255,255,255,.65)`，`.on` 色 `#fff`
- **展开状态**：有子菜单的 `.ni` 加 `.open` 类（箭头旋转 180deg）
- **二级菜单 `.nsl`**：默认 `display:none`，加 `.open` 后展开
- **所有业务模块默认展开**（`.ni.open` + `.nsl.open`）
- **二级菜单项 `.nsi`**：`padding:9px 20px 9px 52px`，色 `rgba(255,255,255,.45)`
- **当前激活 `.nsi.active`**：`color:#60A5FA; background:rgba(37,99,235,.15)`
- **可跳转 nsi**：必须加 `style="cursor:pointer" onclick="location.href='xxx.html'"`
- **底部**：`padding:12px 20px; box-shadow:inset 0 1px 0 rgba(255,255,255,.1)`

### 标准导航顺序（所有页面统一，禁止增删模块或重复）

```
首页
房源管理（open）
  └─ 房源列表 → prototype-list-page.html
  └─ 房源地图
合同管理（open）
  └─ 合同列表 → contract-list.html
  └─ 续签管理
  └─ 到期提醒
租户管理
账单管理
工单管理
```

---

## 顶部栏规范

- 高度 48px，白色，底部 `1px solid var(--cb)`
- 面包屑 `.bc`：链接色 `var(--ctt)`，hover `var(--ctl)`，当前页 `var(--ctp) font-weight:500`
- 右侧图标按钮 `.ib`：32x32px，`border-radius:6px`，hover `background:var(--cg100)`

---

## 页面内容区规范

- `.pb`：`padding:12px; gap:12px; background:var(--cbg)`
- **普通卡片**：白色，`border-radius:4px; box-shadow:0 0 3px rgba(0,0,0,.04)`
- **表格卡片 `.tc`**：`border:1px solid var(--cb); border-radius:4px`（不用 box-shadow）

---

## 按钮规范

| class | 说明 |
|---|---|
| `.btn.btn-p` | 主按钮，品牌色背景，白色文字 |
| `.btn.btn-d` | 次按钮，白色背景，灰色边框 |
| `.btn.btn-t` | 文字按钮，无边框，品牌色，`padding:0 8px` |
| `.btn.btn-x` | 危险文字按钮，红色，`padding:0 8px` |

高度 32px，圆角 4px；操作列按钮高度降为 28px。

---

## 标签规范

**带边框版**（合同管理等新模块）：

| class | 颜色 | 用途 |
|---|---|---|
| `.tag.t-green` | 绿色带边框 | 履行中/成功 |
| `.tag.t-orange` | 橙色带边框 | 即将到期/警告 |
| `.tag.t-red` | 红色带边框 | 已到期/错误 |
| `.tag.t-gray` | 灰色带边框 | 已终止/默认 |
| `.tag.t-blue` | 蓝底无边框 | 类型标识 |

**无边框版**（房源管理模块）：

| class | 颜色 | 用途 |
|---|---|---|
| `.tag.t-ok` | `#D7F5E5 / #13A374` | 已出租 |
| `.tag.t-warn` | `#FFFAD9 / #AF8B04` | 空置中 |
| `.tag.t-err` | `#FFE7E7 / #FF4C4C` | 维修中 |
| `.tag.t-def` | `#F2F4F6 / #576275` | 已下架 |
| `.tag.t-blue` | `#EBF2FF / #266EFF` | 类型 |

---

## 表单规范

### 分组标题
- `.d-title::before`：左侧 `3x16px` 蓝色竖条，`background:var(--cp600); border-radius:2px`
- 标题：`font-size:14px; font-weight:600; color:#333; margin-bottom:16px`

### Label 对齐
- label 容器宽度 `110px`，`padding-right:8px`
- 必填 `*`：`<span class="req">` 独立占 `10px`，无必填留空
- 文字：`<span class="fi-txt">` 包裹

### 编辑页底部操作栏
- `.edit-foot`：白色背景，`border-top:1px solid var(--cb)`，`padding:12px 24px`
- 按钮**居中**排列（`justify-content:center`），取消（次按钮）+ 保存（主按钮）

---

## 筛选区规范（FilterBar）

- **整体**：单行，`display:flex; align-items:center; gap:16px; padding:12px 20px; flex-wrap:nowrap`
- **搜索框**：无 label，`.iw` 包裹（含搜索图标），`placeholder` 说明搜索内容
- **筛选项**：label + 控件左右结构，`gap:8px`，label `white-space:nowrap; color:var(--ctt)`
- **日期范围**：label + 起始日期 + 「—」分隔符 + 结束日期，同一行
- **右侧**：`margin-left:auto`，只放 `.adv-btn`（高级查询，漏斗图标 + 下箭头）
- **禁止**：筛选项竖排；搜索框带 label；添加「重置」「查询」按钮

### 高级查询展开区
- `.adv-row`：默认 `display:none`，加 `.open` 展开为 `display:flex; flex-direction:column`
- 筛选项 `.adv-fi`：label `width:91px; flex-shrink:0`，右侧放标签组（`.adv-tags`）或控件
- 标签 `.adv-tag`：高 24px，圆角 4px，选中加 `.on` 变蓝（`var(--cp50)` 背景 + `var(--cp600)` 文字边框）
- 底部 `.adv-actions`：「清空筛选」按钮右对齐，`border-top:1px dashed #EAEAEA`
- 主筛选行加 `.has-adv` 时底部显示 `border-bottom:1px dashed #EAEAEA`

### toggleAdv JS
```js
function toggleAdv(){
  var row=document.getElementById('advRow');
  var btn=document.getElementById('advBtn');
  var arrow=document.getElementById('advArrow');
  var fr=document.querySelector('.fr');
  var open=row.classList.toggle('open');
  btn.classList.toggle('active',open);
  if(arrow)arrow.style.transform=open?'rotate(180deg)':'rotate(0deg)';
  if(fr)fr.classList.toggle('has-adv',open);
}
```

---

## 确认对话框规范

- 宽度 `400px`，`padding:32px 24px 24px`
- 右上角关闭图标：绝对定位 `top:16px right:16px`，`color:#999`，hover `#333`
- 图标：24px 警告色 `#FF9902`
- 标题：`16px font-weight:600 #333`，描述：`13px #666`
- 按钮：右对齐，取消（`.btn-d`）+ 确认（`background:#FF4C4C; color:#fff`）
- 点击遮罩关闭：`mask.addEventListener('click', e => { if(e.target===this) this.classList.remove('open') })`

---

## 批量操作栏规范

- 勾选复选框后：隐藏 `#tt-normal`（视图切换标签）和 `#tt-actions`，显示 `#tt-batch`
- 批量栏：关闭图标（16px `#576275`）+ 「已选择 N 项」（N 用蓝色 `var(--cp600)`）+ 操作按钮
- 取消选择后恢复原始视图

---

## 弹窗规范（Modal）

- 遮罩 `.modal-mask`：`position:fixed; inset:0; background:rgba(0,0,0,0.45); z-index:1000`
- 弹窗 `.modal`：白色，`border-radius:4px`，默认宽度 `680px`
- 头部 `.modal-hd`：`padding:16px 20px; border-bottom:1px solid #EAEAEA`
- 底部 `.modal-ft`：`padding:12px 20px; border-top:1px solid #EAEAEA`，按钮右对齐
- 点击遮罩关闭

---

## 详情页规范（DetailPage）

- **概要卡片**：图标（48x48px，圆角 8px，品牌色背景）+ 名称/状态 + 右侧操作按钮
- **统计卡片行 `.stat-row`**：等宽卡片，图标（40x40px）+ label + 数值
- **Tab 栏 `.tabs-bar`**：高 44px，`gap:32px`，激活 tab 底部 `2px solid var(--cp600)`
- **详情卡片 `.detail-card`**：分组标题 + `.d-grid`（两列）+ `.d-item`（label 100px + value）

---

## 快速上手

### 方式 A：一句话生成页面
1. 读 `templates/shell.html` → 复用导航框架和 CSS token
2. 确认 pattern（ListPage / EditPage / DetailPage）
3. 输出完整 HTML，导航使用「标准导航顺序」

### 方式 B：从 Figma 链接生成（需 Figma MCP）
1. 提取 fileKey + nodeId
2. 调用 Figma MCP 读取节点数据
3. 匹配 token，识别组件，复用 shell.html 框架输出

---

## Figma 业务案例参考

| pattern | 参考节点 |
|---|---|
| `ListPage` | node-id=411-77456 / 411-85519 |
| `FormPage` | node-id=5952-110498 / 1324-166993 |
| `DetailPage` | node-id=6575-38012 / 5955-167731 |
| `批量操作栏` | node-id=6807-261149 |
| `确认对话框` | node-id=1807-78552 |

---

## 组件优先级

1. `templates/shell.html` 框架 > 自由布局
2. 标准组件 > 自定义组合
3. pattern 骨架 > 自由布局
4. tokens > 硬编码值

---

## 校验清单（每次输出必须附带）

1. ✅/❌ 是否复用了 `templates/shell.html` 的导航框架
2. ✅/❌ 颜色是否全部来自 `var(--*)`，无硬编码色值
3. ✅/❌ 导航是否使用「标准导航顺序」，无重复模块
4. ✅/❌ 所有业务模块的 `.nsi` 是否有 onclick 跳转
5. ✅/❌ 表单 label 是否使用 req 占位 + fi-txt 左对齐结构
6. ✅/❌ 筛选区是否符合规范（无重置/查询按钮，搜索框无 label）
7. ✅/❌ 弹窗/确认框是否有点击遮罩关闭逻辑
