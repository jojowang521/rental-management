# AI产品设计系统

这是一个静态站点项目，用于沉淀 AI 产品设计语言、交互范式、组件规范与场景案例 demo。站点入口是 `index.html`，核心内容页是 `assets/site-pages.html`。

## 快速预览

```bash
npm run start
```

然后打开：

```text
http://127.0.0.1:8866/index.html
```

也可以直接查看内容页：

```text
http://127.0.0.1:8866/assets/site-pages.html
```

## 项目文件

- `index.html`：站点外壳、首页入口与主框架。
- `assets/site-pages.html`：设计系统正文、左侧导航、右侧内容页、场景案例嵌入。
- `assets/*-demo/`：各类可交互 demo，不在主站内重写，只通过 iframe 嵌入。
- `assets/user-previews/`：用户提供的静态预览图。
- `assets/icons/navigation/`：左侧导航图标资源。
- `DESIGN.md`：视觉风格唯一准则。
- `PROJECT.md`：项目管理、改动边界、导航与案例维护规则。
- `scripts/validate-site.js`：本地结构校验脚本。

## 改动流程

1. 先阅读 `PROJECT.md` 和 `DESIGN.md`。
2. 只改和需求相关的文件，避免顺手重构。
3. 修改导航或案例页后，必须同步检查 `assets/site-pages.html` 中的页面 id、导航入口和 demo 路径。
4. 改完运行：

```bash
npm run validate
```

5. 再用浏览器打开本地站点做视觉确认。

## 设计原则

站点风格以 `DESIGN.md` 为准：Soft Minimal System、白色内容区、深色左侧导航、清晰层级、少装饰、轻边框、弱阴影。
