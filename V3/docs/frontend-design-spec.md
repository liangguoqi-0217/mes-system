# MES 系统 V3 — 前端视觉与交互设计规范

> 版本：v1.0
> 日期：2026-09-24
> 状态：**已生效**（新页面开发 / 旧页面重构必须遵守）
> 适用范围：MES 系统 V3 全部 Web 页面
> 配套文档：`docs/ui-layout-spec.md`（列表页布局结构、分页位置、单据创建/编辑/查看一致性）

---

## 0. 这份文档是做什么的

我们把原型（订单齐套检查、物料凭证清单等）的界面风格、配色、交互约束固化成这份文档，前端按此还原即可保证全项目视觉一致。

文档分四部分：

1. **设计原则** —— 我们做设计判断时的取舍依据
2. **设计令牌** —— 配色 / 圆角 / 阴影 / 字号，可直接抄色值
3. **组件规范** —— 按钮、badge、表格、筛选栏、弹窗等怎么用
4. **强制约束清单** —— 带规则 ID 的 MUST / SHOULD 条款，提测自检用

---

## 1. 设计原则

| # | 原则 | 说明 |
|---|---|---|
| 1 | **信息密度优先** | 企业系统，一屏要看到尽可能多行。行高、padding 一律紧凑，不做大留白、不做营销式视觉 |
| 2 | **一致性大于个性** | 同一业务语义在任何页面必须用同一颜色、同一组件。「缺料」永远是红 badge，不允许各页面自创 |
| 3 | **状态可视化** | 状态不用纯文字，统一 badge；异常用红 / 黄，正常用绿 / 灰 |
| 4 | **单一滚动容器** | 一个页面只允许出现一个滚动条，即表格区的纵向滚动条 |
| 5 | **操作可达性** | 高频操作按钮必须常驻可见，不能因为表格横向滚动被挤出屏幕 |

---

## 2. 设计令牌（Design Tokens）

所有令牌定义在 `css/common.css` 的 `:root` 中，**禁止在页面里硬编码色值**，一律用 `var(--xxx)`。

### 2.1 品牌色与语义色

| 令牌 | 色值 | 使用场景 | 禁止 |
|---|---|---|---|
| `--primary` | `#1E3A5F` | 主色：标题栏渐变起点、主按钮、Tab 选中态、区块标题、输入框聚焦边框 | 不做大面积背景 |
| `--primary-light` | `#2D5A87` | 主色浅：标题栏渐变终点、主按钮 hover | — |
| `--primary-lighter` | `#3B82F6` | 辅助蓝：可点击编码（订单号/凭证号）、`btn-blue` | — |
| `--success` | `#10B981` | 成功 / 齐套 / 正常 / 已完成 | — |
| `--warning` | `#F59E0B` | 警告 / 并发紧张 / 待检验 / 部分完成 | — |
| `--danger` | `#DC2626` | 错误 / 缺料 / 删除 / 超期 | — |
| `--info` | `#6366F1` | 信息提示（少用，优先用上述四色） | — |

### 2.2 中性色与背景

| 令牌 / 值 | 色值 | 使用场景 |
|---|---|---|
| `--bg` | `#f0f2f5` | 页面底色 |
| `--surface` | `#ffffff` | 卡片 / 表格 / 弹窗底色 |
| `--border` | `#e5e7eb` | 分隔线、输入框边框、按钮边框 |
| `--text` | `#1f2937` | 正文 |
| `--text-secondary` | `#6b7280` | 次要文字、表头、`label` |
| `--text-muted` | `#9ca3af` | 占位符、禁用态、`0` 值 |
| 筛选栏底 | `#fafbfc` | `.filter-bar` 背景 |
| 表头底 | `#f8fafc` | `.data-table th` 背景 |
| 行 hover | `#f8fafc` | `.data-table tbody tr:hover` |
| 行分隔线 | `#f3f4f6` | `.data-table td` 下边框 |
| 展开明细行底 | `#fafbfc` | 行内展开的明细区域 |

### 2.3 圆角、阴影、字体、字号

| 类别 | 取值 |
|---|---|
| 圆角 | `--radius: 8px`（卡片/输入框）、`--radius-sm: 6px`（按钮/输入框/badge 外框）、`--radius-lg: 12px`（弹窗） |
| 阴影 | `--shadow`（卡片）、`--shadow-md`（悬浮）、`--shadow-lg`（弹窗/抽屉） |
| 字体 | `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif` |
| 页面标题 | `18px / 700` |
| 弹窗标题 | `17px / 700` |
| 区块标题 | `14~15px / 700`，主色，下边框 `2px solid var(--primary)` |
| 正文 / 表格单元格 | `13px` |
| 表头 | `12px / 700`，`text-transform: uppercase`，`letter-spacing: .5px` |
| 筛选栏 label | `12px / 600` |
| badge | `12px`（`.badge-sm` 为 `11px`） |
| 按钮 | `13px`（`.btn-sm` 为 `12px`） |
| 编码列 | `12px`，`font-family: monospace` |

### 2.4 间距

| 位置 | 取值 |
|---|---|
| 筛选栏 | `padding: 14px 20px`，`gap: 12px` |
| 表格单元格 | `padding: 11px 14px`（`.data-table-compact` 为 `7~8px / 10px`） |
| 弹窗内容区 | `padding: 24px 28px` |
| 分页栏 | `padding: 10px 20px` |

### 2.5 框架尺寸

| 项 | 值 |
|---|---|
| 顶部导航栏高度 | `56px` |
| 侧边栏宽度 | `260px` |
| 页面内容区高度 | `calc(100vh - 56px)` |
| 页面内容区宽度 | `100%`（**禁止 `100vw`**，见 UI-SCR-01） |

---

## 3. 组件规范

### 3.1 按钮 `.btn`

| 变体 | 用法 |
|---|---|
| `.btn-primary` | 主操作：查询、保存、提交。**每屏最多一个**，且位于按钮组最左 |
| `.btn-secondary` | 次操作：重置、导出、刷新、更多条件 |
| `.btn-blue` | 新增 / 创建 |
| `.btn-teal` | 刷新 / 同步 / 下发（数据流动语义，与 `btn-blue` 明确区分） |
| `.btn-success` | 确认 / 通过 / 放行 |
| `.btn-warning` | 风险操作：驳回、冻结 |
| `.btn-outline` | 弱操作 |
| `.btn-sm` | **筛选区按钮统一使用** |

规则：

| 规则ID | 约束 | 等级 |
|---|---|---|
| UI-BTN-01 | 列表页筛选区必须包含「查询、导出、刷新、重置、更多条件」五个按钮，「我的变式」由 `QueryVariant` 组件自动追加到按钮组末尾 | **MUST** |
| UI-BTN-02 | 筛选区按钮统一 `.btn-sm` | MUST |
| UI-BTN-03 | 每屏主按钮（`btn-primary`）最多一个 | MUST |
| UI-BTN-04 | 按钮组固定在筛选栏最右侧（`.filter-actions` 已 `margin-left:auto`），不因表格横向滚动被挤出屏幕 | **MUST** |

### 3.2 状态标签 `.badge`

状态语义与颜色映射（全项目统一）：

| 变体 | 语义 |
|---|---|
| `.badge-green` | 齐套 / 已过账 / 正常 / 已完成 |
| `.badge-blue` | 进行中 / 已下达 / 已创建采购 |
| `.badge-yellow` | 并发紧张 / 待检验 / 部分完成 |
| `.badge-red` | 缺料 / 已冲销 / 异常 / 超期 |
| `.badge-gray` | 未编辑 / 草稿 / 无状态 |
| `.badge-purple` | 特殊 / 预留 |

| 规则ID | 约束 | 等级 |
|---|---|---|
| UI-STATE-01 | 状态列必须使用 badge，禁止纯文字或自造颜色 | **MUST** |
| UI-STATE-02 | 同一业务状态在所有页面使用同一 badge 颜色 | **MUST** |
| UI-STATE-03 | 多状态排序按异常优先：红 → 黄 → 绿 | SHOULD |

三态示例（订单齐套检查）：

```
缺料        → badge-red     本车间需求 > 可用库存
并发紧张    → badge-yellow  本车间够，但全厂总需求 > 可用库存
齐套        → badge-green   都不超
```

### 3.3 表格 `.data-table`

- 基础：`class="data-table"`（`min-width: 800px`），表头 `position: sticky; top: 0`
- 紧凑子表：行内展开的明细用 `class="data-table data-table-compact"`

**列对齐规则**

| 内容类型 | 对齐 | 附加样式 |
|---|---|---|
| 文本、名称、描述 | 左对齐 | — |
| 数量、金额、库存、缺口 | **右对齐** | 千分位 |
| 状态、操作 | 居中 | badge / 文字按钮 |
| 编码（订单号、物料号、凭证号、WBS） | 左对齐 | `font-family: monospace; font-size: 12px` |
| 可点击编码 | 左对齐 | `color: #2563eb; cursor: pointer` |

| 规则ID | 约束 | 等级 |
|---|---|---|
| UI-ALIGN-01 | 数字列一律右对齐，文本列左对齐，状态/操作列居中 | **MUST** |
| UI-NUM-01 | 数字统一千分位：`Number(n).toLocaleString('zh-CN', { maximumFractionDigits: 3 })` | **MUST** |
| UI-NUM-02 | 空值统一显示 `-`，禁止 `– –`、空字符串混用 | **MUST** |
| UI-EXPAND-01 | 行内展开的明细行，`colspan` 必须等于主表列数（列增减时同步改，否则明细行错位） | **MUST** |

### 3.4 筛选栏 `.filter-bar`

标准结构（含五按钮 + 更多条件折叠）：

```html
<div class="filter-bar" style="flex-wrap:wrap;">
  <!-- ① 高频条件：常驻第一行 -->
  <div class="filter-group"><label>工厂</label><select id="xxxPlant">...</select></div>
  <div class="filter-group"><label>计划开始日</label>
    <div style="display:flex;align-items:center;gap:4px;">
      <input type="date" id="xxxDateFrom"><span style="color:var(--text-muted);">~</span><input type="date" id="xxxDateTo">
    </div>
  </div>

  <!-- ② 操作按钮组：靠右 -->
  <div class="filter-actions">
    <button class="btn btn-primary btn-sm"   onclick="Xxx.search()">查询</button>
    <button class="btn btn-secondary btn-sm" onclick="Xxx.exportData()">导出</button>
    <button class="btn btn-secondary btn-sm" onclick="Xxx.refresh()">刷新</button>
    <button class="btn btn-secondary btn-sm" onclick="Xxx.resetFilter()">重置</button>
    <button class="btn btn-secondary btn-sm" id="xxxMoreBtn" onclick="Xxx.toggleMore()">更多条件 ▾</button>
    <!-- 「我的变式」由 QueryVariant.mount(pageId) 自动插入到这里 -->
  </div>

  <!-- ③ 更多条件：独占一整行，默认隐藏 -->
  <div id="xxxMoreBar" style="display:none;flex-wrap:wrap;gap:12px;width:100%;padding:0;border:none;background:transparent;">
    <div class="filter-group"><label>流程订单号</label><input type="text" id="xxxOrderNo"></div>
    <div class="filter-group"><label>物料号/描述</label><input type="text" id="xxxMatCode"></div>
  </div>
</div>
```

| 规则ID | 约束 | 等级 |
|---|---|---|
| UI-FLT-01 | 高频条件常驻第一行，其余进「更多条件」折叠区 | **MUST** |
| UI-FLT-02 | 展开区用 `width:100%` 的 flex 容器**独占一整行**，禁止 `display:contents`（会与按钮混排导致布局错乱） | **MUST** |
| UI-FLT-03 | 展开区不得单独设 `background` 或 `border-top`，保持与上方同一底色、视觉一体 | **MUST** |
| UI-FLT-04 | 展开/收起只切换 `display:flex` / `display:none`，按钮文案同步为「更多条件 ▾」/「收起 ▴」 | SHOULD |
| UI-FLT-05 | 日期范围用两个 `type="date"` 加 `~` 连接；需要快捷范围时配「今日 / 本周 / 本月」按钮组 | SHOULD |
| UI-FLT-06 | 字段最小宽度 `140px`（`.filter-group` 已预设），不要改小 | SHOULD |

### 3.5 分页控件

沿用 `docs/ui-layout-spec.md`：分页**必须**位于表格正下方（UI-PAG-01），结构为
`共 N 行 / N 条` + `‹` + `第 x / y 页` + `›` + 每页条数 `select`（10 / 20 / 50）。

### 3.6 弹窗 `.modal`

| 变体 | 最大宽度 | 适用 |
|---|---|---|
| `.modal-sm` | 480px | 确认框、单行输入 |
| `.modal-md` | 900px | 简单表单 |
| `.modal-lg` | 1400px | 复杂表单 / 详情 |
| `.modal-xl` | 1700px | 多行项目详情 |
| `.modal-xxl` | 96vw | 超宽内容 |
| `.modal-decision` | 1150px | 决策类弹窗 |
| `.side-panel` | 90%（max 750px） | 右侧抽屉，详情内容多时优先 |

| 规则ID | 约束 | 等级 |
|---|---|---|
| UI-MOD-01 | 同一单据的创建 / 编辑 / 查看弹窗必须使用相同尺寸 | **MUST**（详见 `ui-layout-spec.md`） |
| UI-MOD-02 | 弹窗内**禁止出现横向滚动条**；子表格列多时改为 `.detail-grid` 卡片或精简列 | **MUST** |
| UI-MOD-03 | 详情内容超过 6 个字段组时，优先用右侧抽屉 `side-panel` 而非居中 modal | SHOULD |

### 3.7 页签 `.tabs` / `.form-tab`

- 弹窗内页签：`.tabs` + `.tab`，选中态 `color: var(--primary)` + `border-bottom: 2px solid var(--primary)`
- 页面级 Tab：白底、底部 1px 边框、选中主色 2px 下划线，Tab 上可带 `badge-gray` 计数

### 3.8 其他组件

| 组件 | 用法 |
|---|---|
| `.stats-row` / `.stat-card` | 顶部统计卡片区（可选），图标底色用对应语义色 10% 透明度 |
| `.detail-grid` / `.detail-item` | 详情字段网格，`auto-fill minmax(190px, 1fr)`，抬头信息优先 2~3 列紧凑排布 |
| `.ui-tooltip` | hover 提示；可提示的字段加 `.price-cell`（点线底线 + `cursor: help`） |
| `toast(msg)` | 全局轻提示，操作反馈统一用它 |
| `QueryVariant` | 查询变式（我的变式）：`register` 注册字段 → `mount` 挂载按钮 → `restore` 回填 → `bindRecent` |

---

## 4. 强制约束清单（提测自检）

| 规则ID | 约束 | 等级 |
|---|---|---|
| **UI-SCR-01** | 页面容器宽度用 `width:100%`，**禁止 `width:100vw`**（内容区在 260px 侧边栏右侧，100vw 会撑出窗口级横向滚动条） | **MUST** |
| **UI-SCR-02** | 整个页面只允许一个滚动条：表格区纵向滚动条 | **MUST** |
| **UI-SCR-03** | 表格横向滚动条隐藏但保留滚动能力（Shift+滚轮 / 触控板）：`::-webkit-scrollbar { height: 0 }` + `scrollbar-width: thin` | **MUST** |
| **UI-LAY-01** | 外层容器 `display:flex; flex-direction:column; height:calc(100vh - 56px); overflow:hidden` | **MUST** |
| **UI-LAY-02** | 表格容器 `flex:1; overflow:auto; width:100%; min-width:0` | **MUST** |
| **UI-BTN-01** | 筛选区五按钮：查询、导出、刷新、重置、更多条件（+ 组件插入的「我的变式」） | **MUST** |
| **UI-BTN-04** | 按钮组常驻可见，不被横向滚动挤出屏幕 | **MUST** |
| **UI-FLT-01/02/03** | 条件折叠：常驻第一行 + 展开区独占整行 + 无独立背景/分隔线 | **MUST** |
| **UI-PAG-01/02** | 分页在表格下方，禁止在上方或侧边 | **MUST** |
| **UI-ALIGN-01** | 数字右对齐、文本左对齐、状态/操作居中 | **MUST** |
| **UI-NUM-01/02** | 千分位格式；空值显示 `-` | **MUST** |
| **UI-STATE-01/02** | 状态用 badge，同语义同色 | **MUST** |
| **UI-EXPAND-01** | 展开行 `colspan` 等于主表列数 | **MUST** |
| **UI-MOD-01/02** | 弹窗尺寸一致；弹窗内无横向滚动条 | **MUST** |
| UI-STATE-03 | 多状态排序异常优先 | SHOULD |
| UI-MOD-03 | 详情字段多时用右侧抽屉 | SHOULD |

---

## 5. 页面骨架代码（可直接复制）

### 5.1 列表页容器

```html
<div class="xxx-page" style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">

  <!-- ① 标题栏 -->
  <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;flex-shrink:0;">
    <div style="font-size:18px;font-weight:700;">页面标题</div>
    <div style="font-size:12px;opacity:0.85;margin-top:2px;">口径说明 / 副标题</div>
  </div>

  <!-- ② 筛选栏 -->
  <div id="xxxFilterBar" style="flex-shrink:0;"></div>

  <!-- ③ 单滚动条样式 -->
  <style>
    #xxxTableWrapper { scrollbar-width: thin; scrollbar-color: rgba(203,213,225,0.6) transparent; }
    #xxxTableWrapper::-webkit-scrollbar { width: 6px; height: 0; }
    #xxxTableWrapper::-webkit-scrollbar-thumb { background: rgba(203,213,225,0.6); border-radius: 3px; }
    #xxxTableWrapper::-webkit-scrollbar-track { background: transparent; }
  </style>

  <!-- ④ 表格区 -->
  <div class="table-wrapper" style="flex:1;overflow:auto;width:100%;min-width:0;" id="xxxTableWrapper"></div>

  <!-- ⑤ 分页栏 -->
  <div id="xxxPagination" style="flex-shrink:0;"></div>
</div>
```

### 5.2 状态 badge 与数字格式化

```js
// 三态 badge（可推广到任何「正常 / 警告 / 异常」语义）
const badge = (s) => s === 'short'
  ? '<span class="badge badge-red badge-sm">缺料</span>'
  : s === 'tight'
    ? '<span class="badge badge-yellow badge-sm">并发紧张</span>'
    : '<span class="badge badge-green badge-sm">齐套</span>';

// 数字格式：千分位 + 最多 3 位小数；空值返回 '-'
const fmt = (n) => (n === null || n === undefined || n === '')
  ? '-'
  : Number(n).toLocaleString('zh-CN', { maximumFractionDigits: 3 });
```

### 5.3 更多条件展开/收起

```js
toggleMore() {
  this.moreOpen = !this.moreOpen;
  const bar = document.getElementById('xxxMoreBar');
  if (bar) bar.style.display = this.moreOpen ? 'flex' : 'none';
  const btn = document.getElementById('xxxMoreBtn');
  if (btn) btn.textContent = this.moreOpen ? '收起 ▴' : '更多条件 ▾';
}
```

---

## 6. 反模式清单（禁止）

| # | 反模式 | 后果 |
|---|---|---|
| 1 | `width: 100vw` | 撑出窗口级横向滚动条，页面多一条滚动条 |
| 2 | 展开区 `display: contents` | 更多条件字段混进外层 flex 流，与按钮挤在一起，布局错乱 |
| 3 | 展开区单独设 `background` 或 `border-top` | 视觉上割裂成两块，不像一体 |
| 4 | 状态用纯文字 / 自造颜色 | 全项目状态色不一致，用户要重新学习 |
| 5 | 空值写 `– –` | 视觉噪音，统一用 `-` |
| 6 | 表格横向滚动条可见 | 一个页面两条滚动条 |
| 7 | 分页放在表格上方 | 违反 `ui-layout-spec.md` UI-PAG-01 |
| 8 | 展开行 `colspan` 数错 | 明细行列宽错位 |
| 9 | 弹窗内子表格出现横向滚动条 | 详情弹窗里横向滚动极难用，改卡片或精简列 |
| 10 | 金额/数量不右对齐 | 数字无法纵向比对 |

---

## 7. 提测自检清单

- [ ] 页面容器是 `width:100%`（不是 `100vw`）
- [ ] 整个页面只有表格区一条纵向滚动条
- [ ] 筛选区有「查询、导出、刷新、重置、更多条件」五个按钮，且常驻可见
- [ ] 「更多条件」展开后独占一行，与上方同底色、无分隔线
- [ ] 数字列右对齐并带千分位，空值显示 `-`
- [ ] 状态列全部使用 badge，颜色符合第 3.2 节语义映射
- [ ] 分页在表格正下方
- [ ] 展开明细行的 `colspan` 与主表列数一致
- [ ] 弹窗内没有横向滚动条；同一单据创建/编辑/查看弹窗尺寸一致
- [ ] 没有硬编码色值，全部使用 `var(--xxx)` 令牌

---

## 8. 变更记录

| 日期 | 版本 | 变更内容 |
|---|---|---|
| 2026-09-24 | v1.0 | 初始版本：设计原则、设计令牌、组件规范、强制约束清单（基于订单齐套检查、物料凭证清单等原型固化） |

---

*本规范是 MES 系统 V3 前端开发标准的组成部分，与 `docs/ui-layout-spec.md` 配套使用。新增或修改页面时必须遵循。*
