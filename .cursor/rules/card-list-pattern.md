# CardListPage 横向列表卡片规范

来源：Figma node-id=607-176141，已实现于 prototypes/property-list.html

## 默认视图

默认使用横向列表卡片 listView，不是网格卡片。支持 listView / gridView 切换。

## 页面结构

SideNav + PageHeader + FilterBar + Toolbar + SortBar + ListCardGrid + Pagination

PageHeader 右侧：新建（primary）+ 导出（default）+ 视图切换图标组

## Toolbar

padding: 12px 20px 8px; border-bottom: 1px solid var(--color-border-divider)
左：标题+数量；右：批量操作按钮

## SortBar

padding: 9px 20px; background: var(--color-bg-grey-0); border-bottom: 1px solid var(--color-border-divider); gap: 24px; font-size: 13px
激活项：var(--color-primary)；默认：var(--color-text-1)

## 列表卡片行容器

display: flex; align-items: center; gap: 16px; padding: 20px; min-height: 160px
background: var(--color-bg-white-0); border-bottom: 1px solid var(--color-border-divider)
hover: background: var(--color-bg-hover)

## 封面图 CardCover

width: 200px; height: 120px; border-radius: 6px; flex-shrink: 0
background: var(--color-primary-light)（无图占位）

## 内容区 CardBody

flex: 1; display: flex; flex-direction: column; gap: 12px

headerRow：编号标签 + 标题(font-weight:600, 15px, var(--color-text-0)) + 状态Tag，同行，gap: 8px

fieldGrid：
- display: flex; flex-wrap: wrap; row-gap: 6px; column-gap: 24px; font-size: 13px
- label: var(--color-text-2); value: var(--color-text-0)
- 价格值：var(--color-error), font-weight:600, font-size:15px
- 警告值（空置天数/预计完工等）：var(--color-warning)
- 最多 6 个字段

## 操作区 CardFooter

align-self: flex-start; flex-shrink: 0
link 样式，最多 3 个，危险操作用 var(--color-error)
删除需二次确认 Modal

## Figma 参考

横向列表卡片：https://www.figma.com/design/YnekqUcG4ElWENxUoffqcv/中后台设计模板?node-id=607-176141
网格卡片变体：node-id=607-176109 / 607-176165 / 607-176094

---

## link-btn 规范（全局）

`.link-btn` 必须包含 `text-decoration: none`，避免 `<a>` 标签默认下划线。

```css
.link-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  font-family: inherit;
  text-decoration: none;  /* 必须，防止 <a> 标签默认下划线 */
}
.link-btn:hover { opacity: .75; }
.link-btn.danger { color: var(--color-error); }
```

---

## PropertyDetailPage 规范

已实现于 `prototypes/property-detail.html`

### 页面结构

SideNav + PageHeader(面包屑+标题+操作) + HeroCard + TabsWrap(5个Tab)

### HeroCard

- 左：封面图 280×180px border-radius:8px background:var(--color-primary-light)
- 右：hero-info
  - headerRow：房间编号标签 + 状态Tag + 类型Tag
  - title：font-size:20px font-weight:600
  - meta grid：4列，字段：建筑面积/户型/楼层/朝向/月租金/当前租客/合同到期/房源编号
  - 月租金值：var(--color-error) font-size:18px font-weight:700
  - footer：查看合同 → contract-list.html / 查看租客 → tenant-detail.html / 停用房源(danger)

### 5个 Tab

| Tab | 内容 |
|---|---|
| 基本信息 | 基础信息 + 房屋参数 + 租金信息 + 配套设施(Tag列表) |
| 合同记录 | 关联合同表格，合同编号→contract-detail，租客名→tenant-detail |
| 房源照片 | 4/3比例网格，5列，支持上传 |
| 维修记录 | 时间线样式，含状态Tag和费用 |
| 操作日志 | 变更历史表格 |

### 导航跳转

- 面包屑「房源列表」→ property-list.html
- PageHeader「返回列表」→ property-list.html
- 从 property-list.html 卡片「详情」→ property-detail.html
