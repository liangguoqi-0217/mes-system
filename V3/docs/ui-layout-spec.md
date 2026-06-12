# MES系统 — 前端UI布局规范

> 版本：v1.0  
> 生效日期：2026-05-29  
> 状态：**已生效**

---

## 1. 总则

本规范定义了 MES 系统（制造执行系统）所有列表页面的 UI 布局标准，确保全项目界面风格一致、用户体验统一。**所有开发人员在新页面开发或旧页面重构时，必须严格遵守本规范。**

---

## 2. 列表页标准布局结构（从上到下）

```
┌─────────────────────────────────────────────┐
│  ① 页面标题栏（Header）                     │  flex-shrink:0
│     标题 + 副标题 | 操作按钮                │
├─────────────────────────────────────────────┤
│  ② 统计卡片区（可选）                        │  flex-shrink:0
│     [总数] [状态A] [状态B] ...              │
├─────────────────────────────────────────────┤
│  ③ 筛选工具栏（Filter Bar）                  │  flex-shrink:0
│     [筛选字段] ... [查询] [重置]            │
├─────────────────────────────────────────────┤
│  ④ 数据表格区（Table Wrapper）               │  flex:1（占据剩余空间）
│  ┌───────────────────────────────────┐      │
│  │ <thead> 表头                      │      │
│  │ <tbody> 数据行                    │      │
│  └───────────────────────────────────┘      │
├─────────────────────────────────────────────┤
│  ⑤ ★ 分页控件栏（Pagination Toolbar） ★    │  flex-shrink:0
│     [共 N 条]       [‹] 第x/y页 [›] [每页] │
└─────────────────────────────────────────────┘
```

### 核心规则

| 规则ID | 规则描述 | 强制等级 |
|--------|---------|----------|
| **UI-PAG-01** | **分页控件必须置于数据表格/内容区域的正下方** | **MUST** |
| **UI-PAG-02** | 分页控件不得置于表格上方或侧边 | **MUST NOT** |
| **UI-PAG-03** | 分页栏使用 `class="list-toolbar"` + `style="flex-shrink:0;"` | SHOULD |
| **UI-PAG-04** | 分页栏包含：左侧记录数统计 + 右侧翻页控件 | SHOULD |
| **UI-LAY-01** | 外层容器使用 `display:flex; flex-direction:column; height:calc(100vh - 56px);` | MUST |
| **UI-LAY-02** | 表格容器使用 `flex:1` 自动填充剩余空间 | MUST |

---

## 3. DOM 结构模板（参考实现）

```html
<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
  <!-- ① 标题栏 -->
  <div style="...flex-shrink:0;">
    <h1>页面标题</h1>
    <button>+ 操作</button>
  </div>

  <!-- ② 统计卡片（可选） -->
  <div style="...flex-shrink:0;">
    <!-- stat-card 组件 -->
  </div>

  <!-- ③ 筛选栏 -->
  <div class="filter-bar" style="flex-shrink:0;">
    <input /> <select />
    <button onclick="search()">查询</button>
  </div>

  <!-- ④ 表格区域（flex:1 占满剩余高度） -->
  <div class="table-wrapper" style="flex:1;">
    <table class="data-table">
      <thead><tr>...</tr></thead>
      <tbody id="xxxTableBody"></tbody>
    </table>
  </div>

  <!-- ⑤ ★ 分页控件（必须位于此处：表格之后）★ -->
  <div class="list-toolbar" style="flex-shrink:0;">
    <div class="list-info">
      <span class="list-count" id="xxxCount">共 N 条</span>
    </div>
    <div class="pagination">
      <button class="pagination-btn" id="xxxPrev" disabled onclick="Xxx.prevPage()">‹</button>
      <span class="pagination-info" id="xxxPageInfo">第 1 / N 页</span>
      <button class="pagination-btn" id="xxxNext" onclick="Xxx.nextPage()">›</button>
      <select class="page-size-select" onchange="Xxx.changePageSize()">
        <option value="10">10条</option>
        <option value="20">20条</option>
        <option value="50">50条</option>
      </select>
    </div>
  </div>
</div>
```

---

## 4. 已合规页面清单

以下页面已按本规范调整分页位置至底部：

| # | 模块文件 | 页面名称 | 分页位置 |
|---|---------|---------|---------|
| 1 | `equipment-master.js` | 设备主数据管理 | 底部 |
| 2 | `equipment-install.js` | 设备安装/移交 | 底部 |
| 3 | `equipment-bom.js` | 设备BOM管理 | 底部 |
| 4 | `spare-parts-stock.js` | 备件库存查询 | 底部 |
| 5 | `sp-purchase.js` | 采购申请提报 | 底部 |
| 6 | `sp-pick.js` | 备件领用 | 底部 |
| 7 | `equipment-status-change.js` | 设备状态变更单 | 底部 |
| 8 | `equipment-run-log.js` | 设备运行&停机台账 | 底部 |
| 9 | `equipment-retrofit.js` | 设备改造/升级（列表页） | 底部 |
| 10 | `equipment-retire.js` | 设备退役/报废（列表页） | 底部 |

> 注：`equipment-run-dashboard.js`（设备运行总看板）为看板双面板布局，不使用传统分页。
> 注：`equipment-retrofit.js` 单据页（4标签）、`equipment-retire.js` 单据页（5分区）为表单页，不使用分页。

---

## 5. 违规示例（禁止）

```html
<!-- ❌ 错误：分页在表格上方 -->
<div class="list-toolbar">...</div>   <!-- 违规！ -->
<div class="table-wrapper">...</div>

<!-- ✅ 正确：分页在表格下方 -->
<div class="table-wrapper">...</div>
<div class="list-toolbar">...</div>   <!-- 合规 -->
```

---

## 6. 设计依据

1. **用户视觉习惯**：用户从上到下浏览数据后，翻页控件自然出现在视线末端，符合 F 型阅读模式。
2. **行业惯例**：主流企业管理系统（SAP、钉钉、飞书、企业微信）均将分页置于数据列表底部。
3. **空间利用效率**：顶部空间留给筛选条件和操作按钮，底部固定分页不占用数据展示区域。

---

## 7. 变更记录

| 日期 | 版本 | 变更内容 | 操作人 |
|------|------|---------|-------|
| 2026-05-29 | v1.0 | 初始版本；统一6个模块分页位置至底部 | - |
| 2026-05-29 | v1.1 | 新增4.2设备运行/状态管理模块（3页面），分页合规 | - |
| 2026-05-29 | v1.2 | 新增4.3设备改造升级 + 4.4设备退役报废（2模块4页面），分页合规 | - |

---

*本规范属于 PM 系统前端开发标准的组成部分。新增列表页面时必须遵循此布局。*
