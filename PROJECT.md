# Project Management Guide

本项目按“设计系统站点 + 可交互 demo 资产库”的方式维护。目标是避免临时改动破坏导航、内容页、案例嵌入和视觉风格。

## 项目定位

- 站点名称：AI产品设计系统
- 站点类型：静态 HTML 原型站点
- 主要用户：产品经理、设计师、AI 方案共创人员
- 核心价值：把 AI 产品设计语言、交互范式、设计规范和业务场景案例集中管理

## 单一准则

- 视觉风格以 `DESIGN.md` 为准。
- 项目结构和改动边界以本文档为准。
- 场景 demo 不直接重写到主站里，原则上通过 iframe 或图片预览嵌入。
- 用户明确要求“只改某处”时，不做额外视觉优化和结构重排。

## 文件职责

| 文件/目录 | 职责 | 改动注意 |
| --- | --- | --- |
| `index.html` | 站点首页、主入口、外壳页面 | 只在调整首页、站点名称、入口卡片时修改 |
| `assets/site-pages.html` | 设计系统正文、左侧导航、右侧内容、场景案例 | 当前最核心文件，改动前先定位对应 page id |
| `assets/*-demo/` | 独立业务 demo | 不要为主站样式强行改 demo 内部结构 |
| `assets/user-previews/` | 静态图片预览 | 替换图片时保持文件名和引用一致 |
| `assets/icons/navigation/` | 左侧导航线性图标 | 不要删除已被导航引用的图标 |
| `DESIGN.md` | 视觉风格准则 | 修改风格前先确认是否影响全站 |
| `scripts/validate-site.js` | 项目护栏校验 | 新增关键页面或案例时同步扩展校验 |

## 当前信息架构

`assets/site-pages.html` 的左侧导航分为三层：

1. 设计语言
   - 核心认知转变
   - 设计决策层级
2. AI 交互框架与规范
   - 框架选型总览
   - 全屏 Agent 工作台
   - 侧边辅助模式
   - 输入与上下文规范
   - 过程可见性规范
   - 结果呈现规范
   - 确认交接规范
   - 闭环追问规范
3. 场景案例
   - 场景总览
   - 查询
   - 录入
   - 审核
   - 分析
   - 报告
   - 组合场景

其中“框架选型”“交互规范”“场景案例”都是可展开/收起分组，分别对应 `g-frame`、`g-ux`、`g-case`。

## 场景案例映射

| 场景 | 页面 id | 当前内容来源 |
| --- | --- | --- |
| 查询 | `p-case-query` | `assets/asset-query-demo/index.html` |
| 录入 | `p-case-entry` | `assets/cost-contract-native-demo/index.html` |
| 审核 | `p-case-audit` | 页签 1：`assets/contract-audit-demo/index.html`；页签 2：`assets/tender-review-demo/ai-audit/task-P-2025-DEMO/index.html` |
| 分析 | `p-case-analysis` | `assets/cost-analysis-demo/index.html` |
| 报告 | `p-case-report` | `assets/sales-daily-demo/index.html` |
| 组合场景 | `p-case-combo` | `assets/cost-advisor-control-price-demo/index.html?phase=auditing` |

## 框架页面 demo 映射

| 页面 | 页面 id | 页签 | 当前内容来源 |
| --- | --- | --- | --- |
| 全屏 Agent 工作台 | `p-frame-1` | 总览 | 页面内规范说明 |
| 全屏 Agent 工作台 | `p-frame-1` | 独立模式 | `assets/ai-native-mode-demo/index.html` |

## 改动护栏

### 修改导航时

- 导航按钮、页面 id、`show()` / `showCase()` 映射必须同步。
- 左侧导航保持深色背景。
- 导航标题、图标、展开箭头不换行。
- “场景案例”必须保持可展开/收起。
- 不要删除“场景总览”和六个场景入口。

### 修改场景案例时

- 右侧案例页保持白色标题栏。
- 案例详情页标题栏只显示当前场景名，例如“录入场景”。
- 不显示多余 eyebrow、说明文案或“打开完整 demo”按钮。
- demo 预览必须在当前页面内可交互查看。
- iframe / 图片宽度要自适应右侧区域。
- 审核场景保留两个页签：“合同审核”和“合规审查”。

### 修改框架页面时

- 全屏 Agent 工作台保留两个页签：“设计理念”和“独立模式”。
- “总览”页签保留框架规范说明。
- “独立模式”页签嵌入 `assets/ai-native-mode-demo/index.html`。

### 修改视觉风格时

- 保持 Soft Minimal System。
- 内容区以白色、浅灰、中性文字为主。
- 避免大面积彩色背景、厚阴影、玻璃拟态、营销页式 hero。
- 优先统一已有组件样式，不新增随机视觉处理。

## 本地校验

每次提交或继续大改前运行：

```bash
npm run validate
```

校验内容包括：

- HTML 内联脚本语法是否正确。
- 核心文件是否存在。
- 场景页 id 是否齐全。
- 场景 demo 路径是否存在。
- 场景导航是否能对应到页面。
- 案例页标题栏规则是否保留。
- 不允许恢复“打开完整 demo”类外跳按钮。

## 推荐工作流

1. 明确用户要改的页面或区域。
2. 在 `assets/site-pages.html` 中定位对应 page id。
3. 小步修改，不跨区域重排。
4. 运行 `npm run validate`。
5. 浏览器检查当前 URL 和目标页面。
6. 如需推送 git，再单独提交本次相关文件。
