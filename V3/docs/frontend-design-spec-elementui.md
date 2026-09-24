# MES 系统 — 前端设计规范 · Vue2 + Element UI 2.15 落地版

> 版本：v1.1（Element UI 落地版）
> 日期：2026-09-24
> 技术栈：**Vue 2.7 + Element UI 2.15.0**
> 状态：**已生效**
> 配套文档：
> - `docs/frontend-design-spec.md`（v1.0 视觉与交互规范：设计原则、设计令牌、约束规则）—— **配色、字号、约束条件以 v1.0 为准**
> - `docs/ui-layout-spec.md`（列表页布局、分页位置、单据一致性）

---

## 0. 这份文档与 v1.0 的关系

v1.0 定义了「长什么样、什么约束」。本版只解决一个问题：**在 Vue2 + Element UI 2.15.0 上怎么用最小改动落地它**。

**核心前提：不重造组件。** Element 已有的组件全部用原生，只做三件事：

1. 改主题变量（配色 / 圆角）→ 编译出一套主题 CSS
2. 加一份集中的补丁 CSS（紧凑尺寸、单滚动条、胶囊标签）
3. 业务代码按本文的组件映射和骨架模板写

> 本文档中出现的所有 Element 组件（`el-button` / `el-table` / `el-pagination` / `el-dialog` / `el-drawer` / `el-tag` / `el-empty`）均为 Element UI 2.15.0 自带。**Element UI 2.x 没有 `el-descriptions`**，详情字段网格用 `el-row/el-col` 实现（见 4.9）。

---

## 1. 落地三原则

| # | 原则 | 说明 |
|---|---|---|
| 1 | **原生优先** | 能用 Element 组件就用，禁止自造表格 / 下拉 / 弹窗 / 分页 |
| 2 | **只改外观，不改结构** | 通过主题变量 + 补丁 CSS 改颜色、圆角、间距、字号；禁止 fork / 修改 `element-ui` 源码，禁止大面积 `!important` |
| 3 | **补丁集中** | 所有对 Element 的样式覆盖统一放 `src/styles/element-patch.css`，**禁止散落到各页面 `<style scoped>`**（否则不同页面长得不一样） |

---

## 2. 主题定制（改色，最小改动）

### 2.1 方案 A：SCSS 变量重编译（推荐）

Element UI 2.x 官方主题定制方式。用 `element-theme` 生成 `element-variables.scss`，**只改变量值**，再编译出主题 CSS。

```bash
npm i element-theme element-theme-chalk -D
npx et --init     # 生成 element-variables.scss（原始文件）
npx et            # 编译输出 ./theme/index.css
```

`main.js` 中把默认主题换成编译产物：

```js
// import 'element-ui/lib/theme-chalk/index.css';  // ← 注释掉
import './theme/index.css';                        // ← 用编译后的主题
import './styles/element-patch.css';               // ← 补丁，必须在主题之后
```

`element-variables.scss` 中需要修改的变量（其余保持默认）：

```scss
/* ===== 品牌与语义色 → 对齐 MES 设计令牌 ===== */
$--color-primary: #1E3A5F;   // 原 #409EFF 深蓝主色
$--color-success: #10B981;   // 原 #67C23A
$--color-warning: #F59E0B;   // 原 #E6A23C
$--color-danger:  #DC2626;   // 原 #F56C6C
$--color-info:    #6B7280;   // 原 #909399

/* ===== 文字 ===== */
$--color-text-primary:     #1F2937;  // 原 #303133
$--color-text-regular:     #6B7280;  // 原 #606266
$--color-text-secondary:   #9CA3AF;  // 原 #909399
$--color-text-placeholder: #9CA3AF;  // 原 #C0C4CC

/* ===== 边框与背景 ===== */
$--border-color-base:         #E5E7EB;  // 原 #DCDFE6
$--border-color-light:        #F3F4F6;
$--border-color-lighter:      #F3F4F6;
$--border-color-extra-light:  #F8FAFC;
$--background-color-base:     #F0F2F5;  // 原 #F5F7FA

/* ===== 圆角 ===== */
$--border-radius-base:  6px;
$--border-radius-small: 6px;

/* ===== 字号：保持 Element 默认值，避免全局尺寸失控 ===== */
$--font-size-base:  14px;
$--font-size-small: 13px;

/* 注意：$--font-path 必须保留在文件顶部（et --init 默认已生成） */
$--font-path: '~element-ui/lib/theme-chalk/fonts';
```

> 变量名以 `et --init` 实际生成的文件为准；新增变量前先确认文件中存在。
> 若团队编译链（node-sass / Node 版本）走不通，改用方案 B。

### 2.2 方案 B：CSS 覆盖（零编译，兜底）

不改构建链，直接在 `element-patch.css` 里覆盖主色：

```css
/* 兜底方案：仅在无法编译主题时使用 */
.el-button--primary { background:#1E3A5F; border-color:#1E3A5F; }
.el-button--primary:hover, .el-button--primary:focus { background:#2D5A87; border-color:#2D5A87; }
.el-button--success { background:#10B981; border-color:#10B981; }
.el-button--warning { background:#F59E0B; border-color:#F59E0B; }
.el-button--danger  { background:#DC2626; border-color:#DC2626; }
.el-button:not(.el-button--primary):not(.el-button--text) { border-color:#E5E7EB; }
```

### 2.3 字体

Element 大多数组件继承 `body` 字体，只需在应用级设置一次，另加一条继承兜底：

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
  background: #F0F2F5;
  color: #1F2937;
}
.el-button, .el-input__inner, .el-select, .el-table, .el-tag, .el-dialog { font-family: inherit; }
```

---

## 3. 组件映射总表

| 设计组件（v1.0） | Element 组件 | 关键配置 | 需要补丁 |
|---|---|---|---|
| 主按钮 `btn-primary` | `el-button type="primary"` | `size="small"` | 主题变量已改色 |
| 次按钮 `btn-secondary` | `el-button`（默认 type） | `size="small"` | 边框色已随主题 |
| 弱操作 `btn-outline` | `el-button plain` | — | — |
| 刷新/同步 `btn-teal` | `el-button` + `class="btn-teal"` | — | **需补丁**（Element 无此 type） |
| 输入框 | `el-input` | `size="small"` | — |
| 下拉 | `el-select` + `el-option` | `size="small"`、`clearable` | — |
| 日期范围 | `el-date-picker type="daterange"` | `range-separator="~"`、`value-format="yyyy-MM-dd"` | — |
| 表格 | `el-table` | `size="small"`、`height="100%"` | 紧凑 padding + 单滚动条 |
| 状态 badge | `el-tag` | `size="small"`、`effect="light"`（默认） | 胶囊形 + 淡底深字 |
| 分页 | `el-pagination` | `layout="total, sizes, prev, pager, next"` | — |
| 弹窗 | `el-dialog` | `width`、`top="4vh"`、`custom-class` | — |
| 右侧抽屉 | `el-drawer` | `direction="rtl"`、`size="750px"` | — |
| 页签 | `el-tabs` | 默认下划线样式 | — |
| 卡片 | `el-card` | `shadow="never"` | — |
| 详情字段网格 | `el-row` + `el-col`（无 `el-descriptions`） | `:gutter="12"`、`:span="8"` | 需补丁 `.detail-item` |
| 悬浮提示 | `el-tooltip` | `placement`、`content` | — |
| 轻提示 toast | `this.$message` | — | — |
| 加载态 | `v-loading` | 表格上用 | — |
| 空态 | `el-empty` | `description` | — |
| 查询变式「我的变式」 | **自定义组件** | Element 无对应组件 | 沿用现有实现 |

---

## 4. 各组件落地细则

### 4.1 按钮

| 场景 | 写法 |
|---|---|
| 查询 / 保存 / 提交（每屏最多一个主按钮） | `<el-button type="primary" size="small">查询</el-button>` |
| 导出 / 重置 / 更多条件 | `<el-button size="small">导出</el-button>` |
| 新增 / 创建 | `<el-button type="primary" size="small">新增</el-button>` |
| 刷新 / 同步 / 下发 | `<el-button size="small" class="btn-teal">刷新</el-button>`（需补丁） |
| 通过 / 确认 | `type="success"` |
| 驳回 / 冻结 | `type="warning"` |
| 删除 | `type="danger"` |
| 弱操作 / 表格行内 | `type="text"` |

### 4.2 表格 `el-table`

```html
<el-table
  :data="list"
  size="small"
  height="100%"
  v-loading="loading"
  :header-cell-style="HEADER_STYLE"
  :row-style="{ height: '36px' }">
  <!-- 编码列 -->
  <el-table-column prop="matCode" label="物料号" width="120" class-name="cell-mono" />
  <!-- 文本列 -->
  <el-table-column prop="matName" label="物料描述" min-width="180" show-overflow-tooltip />
  <!-- 数字列：必须右对齐 -->
  <el-table-column prop="reqQty" label="本车间需求量" width="120" align="right" :formatter="fmtQty" />
  <!-- 状态列：必须居中 + tag -->
  <el-table-column label="状态" width="90" align="center">
    <template slot-scope="{ row }">
      <el-tag size="small" :type="tagType(row)">{{ row.statusText }}</el-tag>
    </template>
  </el-table-column>
</el-table>
```

| 规则 | 说明 |
|---|---|
| **尺寸** | 统一 `size="small"`；超密集子表可用 `mini` |
| **高度** | 必须 `height="100%"`，父容器 `flex:1; min-height:0`。**禁止同时设 `max-height`**（会出双滚动条） |
| **边框** | 不加 `border`（我们风格无竖线），只保留水平分隔线 |
| **对齐** | 文本左、数字 `align="right"`、状态/操作 `align="center"` |
| **表头** | 用 `:header-cell-style` 统一设置（见 5.2） |
| **空值** | formatter 返回 `-`，禁止 `– –` |
| **长文本** | `show-overflow-tooltip`，禁止换行撑高行 |
| **展开明细** | `type="expand"` 的 `colspan` 由 Element 自动处理，不会错位（这是 Element 相对原生 table 的优势） |

### 4.3 状态标签 `el-tag`

```html
<el-tag size="small" type="danger">缺料</el-tag>
<el-tag size="small" type="warning">并发紧张</el-tag>
<el-tag size="small" type="success">齐套</el-tag>
<el-tag size="small" type="info">已下达</el-tag>
<el-tag size="small" type="info" class="tag-gray">未编辑</el-tag>  <!-- 灰色用 class -->
```

type → 语义映射（与 v1.0 §3.2 一致）：

| type | 语义 |
|---|---|
| `success` | 齐套 / 已过账 / 正常 / 已完成 |
| `info` | 进行中 / 已下达 / 已创建采购 |
| `warning` | 并发紧张 / 待检验 / 部分完成 |
| `danger` | 缺料 / 已冲销 / 异常 / 超期 |

### 4.4 筛选栏（五按钮 + 更多条件折叠）

```html
<el-form :inline="true" size="small" class="mes-filter" @submit.native.prevent>
  <!-- ① 高频条件常驻第一行 -->
  <el-form-item label="工厂">
    <el-select v-model="f.plant" clearable style="width:140px">
      <el-option label="全部" value="" />
      <el-option v-for="p in plants" :key="p" :label="p" :value="p" />
    </el-select>
  </el-form-item>
  <el-form-item label="计划开始日">
    <el-date-picker v-model="dateRange" type="daterange" range-separator="~"
      start-placeholder="开始" end-placeholder="结束" value-format="yyyy-MM-dd" />
  </el-form-item>
  <el-form-item label="齐套状态">
    <el-select v-model="f.readiness" style="width:140px">
      <el-option label="全部" value="" />
      <el-option label="仅缺料" value="short" />
      <el-option label="仅齐套" value="ok" />
    </el-select>
  </el-form-item>

  <!-- ② 按钮组：靠右常驻 -->
  <el-form-item class="mes-filter__actions">
    <el-button type="primary" size="small" @click="search">查询</el-button>
    <el-button size="small" @click="exportData">导出</el-button>
    <el-button size="small" class="btn-teal" @click="refresh">刷新</el-button>
    <el-button size="small" @click="resetFilter">重置</el-button>
    <el-button size="small" @click="moreOpen = !moreOpen">
      {{ moreOpen ? '收起 ▴' : '更多条件 ▾' }}
    </el-button>
    <!-- 「我的变式」由查询变式组件插入此处 -->
  </el-form-item>

  <!-- ③ 更多条件：v-show + 独占一整行 -->
  <div v-show="moreOpen" class="mes-filter__more">
    <el-form-item label="流程订单号"><el-input v-model="f.orderNo" style="width:140px" /></el-form-item>
    <el-form-item label="物料号/描述"><el-input v-model="f.matCode" style="width:140px" /></el-form-item>
    <el-form-item label="车间"><el-select v-model="f.workCenter" style="width:140px" /></el-form-item>
    <el-form-item label="订单状态"><el-select v-model="f.status" style="width:140px" /></el-form-item>
  </div>
</el-form>
```

约束（沿用 v1.0 UI-FLT-01/02/03）：

- 五按钮顺序固定：**查询 → 导出 → 刷新 → 重置 → 更多条件**（我的变式追加在末尾）
- 展开区 `.mes-filter__more` **必须 `width:100%` 独占一整行**（补丁 CSS 已保证），禁止用 `display: contents`
- 展开区**不得单独设 `background` / `border-top`**，与上方保持同一底色（`v-show` 控制的 `div` 天然满足）
- 用 `v-show` 而非 `v-if`：保留已填条件，收起再展开不丢值

### 4.5 分页

```html
<div class="mes-pager">
  <el-pagination
    layout="total, sizes, prev, pager, next"
    :total="total"
    :page-sizes="[10, 20, 50]"
    :current-page.sync="page"
    :page-size.sync="pageSize"
    @current-change="load"
    @size-change="load" />
</div>
```

必须在表格**下方**（UI-PAG-01）。`layout` 固定，不要加 `jumper`（企业系统很少用跳页）。

### 4.6 弹窗 `el-dialog`

| v1.0 尺寸 | Element 写法 |
|---|---|
| modal-sm 480px | `width="480px"` |
| modal-md 900px | `width="900px"` |
| modal-lg 1400px | `width="1400px"` |
| modal-xl 1700px | `width="1700px"` |
| modal-xxl 96vw | `width="96%"` |

```html
<el-dialog :visible.sync="visible" width="1400px" top="4vh" custom-class="mes-dialog" :close-on-click-modal="false">
  <div slot="title" class="mes-dialog__title">流程订单详情</div>
  <!-- 内容 -->
  <div slot="footer" class="mes-dialog__footer">
    <el-button size="small" @click="visible = false">关闭</el-button>
    <el-button type="primary" size="small" @click="submit">保存</el-button>
  </div>
</el-dialog>
```

| 规则 | 说明 |
|---|---|
| 同一单据创建/编辑/查看必须**同 width**（UI-MOD-01） | |
| 弹窗内**禁止出现横向滚动条**（UI-MOD-02） | 子表列多时改 `el-row/el-col` 字段网格，或精简列 |
| 详情字段 ≥ 6 组时优先 `el-drawer` | `<el-drawer :visible.sync="v" direction="rtl" size="750px">` |

### 4.7 页签

```html
<el-tabs v-model="activeTab">
  <el-tab-pane label="物料维度" name="mat" />
  <el-tab-pane label="订单维度" name="order" />
</el-tabs>
```
默认下划线样式即符合规范（主色 2px 下划线）；不要加 `type="card"`。

### 4.8 统计卡片 / 卡片

```html
<el-card shadow="never" class="mes-stat">
  <div class="mes-stat__label">缺料物料</div>
  <div class="mes-stat__value txt-danger">3</div>
</el-card>
```
`shadow="never"` —— 我们风格是扁平卡片 + 细边框，不用投影卡片。

### 4.9 详情字段网格（Element 无 `el-descriptions`）

```html
<el-row :gutter="12">
  <el-col :span="8">
    <div class="detail-item"><dt>工厂</dt><dd>1000</dd></div>
  </el-col>
  <el-col :span="8">
    <div class="detail-item"><dt>计划开始日</dt><dd>2026-09-23</dd></div>
  </el-col>
</el-row>
```
`.detail-item` 样式走补丁 CSS（见 5.1 第 6 段）。

### 4.10 提示与反馈

| 场景 | 写法 |
|---|---|
| 操作成功/失败轻提示 | `this.$message.success('已保存')` / `this.$message.error(msg)` —— **禁止 `alert`** |
| 二次确认 | `this.$confirm(...)` |
| 表格加载 | `v-loading="loading"` |
| 空数据 | `<el-empty description="暂无数据" :image-size="80" />` |
| 字段说明 | `<el-tooltip content="可用库存 = 非限制 + 质检"><i class="el-icon-question" /></el-tooltip>` |

---

## 5. 集中补丁 CSS

**文件：`src/styles/element-patch.css`（唯一允许覆盖 Element 样式的地方）**
引入顺序：`element 主题` → `element-patch.css` → 业务样式。

### 5.1 完整补丁

```css
/* ============================================================
   element-patch.css —— 对 Element UI 2.15 的最小外观覆盖
   只改：颜色 / 圆角 / 间距 / 字号 / 滚动条
   ============================================================ */

/* 1) 页面骨架：单滚动条布局 */
.mes-page {
  display: flex; flex-direction: column;
  width: 100%;                    /* 禁止 100vw：内容区在 260px 侧边栏右侧 */
  height: calc(100vh - 56px);     /* 顶部导航 56px */
  overflow: hidden;
  background: #F0F2F5;
}
.mes-page__header {
  flex-shrink: 0; padding: 16px 24px;
  background: linear-gradient(135deg, #1E3A5F, #2D5A87); color: #fff;
}
.mes-page__title { font-size: 18px; font-weight: 700; }
.mes-page__subtitle { font-size: 12px; opacity: .85; margin-top: 2px; }

/* 2) 筛选栏 */
.mes-filter {
  flex-shrink: 0; display: flex; flex-wrap: wrap; align-items: flex-end;
  gap: 12px; padding: 14px 20px; background: #FAFBFC;
  border-bottom: 1px solid #E5E7EB;
}
.mes-filter .el-form-item { margin-bottom: 0; margin-right: 0; }
.mes-filter__actions { margin-left: auto; }          /* 按钮组靠右常驻 */
.mes-filter__more {                                   /* 展开区独占一整行 */
  display: flex; flex-wrap: wrap; gap: 12px;
  width: 100%; padding: 0; border: none; background: transparent;
}

/* 3) 表格区：唯一滚动区 */
.mes-table { flex: 1; min-height: 0; }
.mes-table .el-table__body-wrapper::-webkit-scrollbar { height: 0; }  /* 隐藏横向滚动条，保留滚动能力 */
.mes-table .el-table__body-wrapper { scrollbar-width: thin; scrollbar-color: rgba(203,213,225,.6) transparent; }
.mes-table .el-table__body-wrapper::-webkit-scrollbar-thumb { background: rgba(203,213,225,.6); border-radius: 3px; }

/* 4) 紧凑表格 */
.mes-table .el-table td { padding: 7px 0; font-size: 13px; }
.mes-table .el-table th { padding: 11px 0; font-size: 12px; background: #F8FAFC; }
.mes-table .el-table .cell { padding: 0 10px; }
.cell-mono { font-family: monospace; font-size: 12px; }

/* 5) 状态标签：胶囊形 + 淡底深字（默认 effect="light"） */
.el-tag { border-radius: 12px; border: none; font-weight: 600; }
.el-tag--success { background: rgba(16,185,129,.1);  color: #065F46; }
.el-tag--warning { background: rgba(245,158,11,.1);  color: #92400E; }
.el-tag--danger  { background: rgba(220,38,38,.1);   color: #991B1B; }
.el-tag--info    { background: rgba(59,130,246,.1);  color: #1E40AF; }
.tag-gray        { background: #F3F4F6; color: #6B7280; }

/* 6) 详情字段网格 */
.detail-item { padding: 14px 16px; background: #F8FAFC; border: 1px solid #F1F5F9; border-radius: 6px; }
.detail-item dt { font-size: 12px; color: #6B7280; margin-bottom: 4px; }
.detail-item dd { font-size: 14px; font-weight: 600; color: #1F2937; word-break: break-word; }

/* 7) 刷新按钮：青绿（Element 无此 type） */
.btn-teal { background: #0D9488; border-color: #0D9488; color: #fff; }
.btn-teal:hover, .btn-teal:focus { background: #0F766E; border-color: #0F766E; color: #fff; }

/* 8) 弹窗标题与页脚 */
.mes-dialog__title { font-size: 17px; font-weight: 700; }
.mes-dialog .el-dialog__body { padding: 24px 28px; }

/* 9) 字体继承 */
.el-button, .el-input__inner, .el-select, .el-table, .el-tag, .el-dialog { font-family: inherit; }

/* 10) 工具类 */
.txt-danger { color: #DC2626; font-weight: 600; }
.txt-muted  { color: #9CA3AF; }
```

### 5.2 表头样式（JS 侧常量，全项目复用）

```js
// src/utils/table-style.js
export const HEADER_STYLE = {
  background: '#F8FAFC',
  color: '#6B7280',
  fontSize: '12px',
  fontWeight: '700'
};

export function fmt(v) {
  return v === null || v === undefined || v === ''
    ? '-'
    : Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 3 });
}
export const fmtQty = (row, col, v) => fmt(v);
```

---

## 6. 列表页标准骨架（可直接复制）

```vue
<template>
  <div class="mes-page">
    <!-- ① 标题栏 -->
    <div class="mes-page__header">
      <div class="mes-page__title">订单齐套检查</div>
      <div class="mes-page__subtitle">口径：单工厂 · 可用库存 = 非限制 + 质检 · 已扣减已投料</div>
    </div>

    <!-- ② 筛选栏（见 4.4） -->
    <el-form :inline="true" size="small" class="mes-filter" @submit.native.prevent>
      <!-- 高频条件 + 按钮组 + .mes-filter__more -->
    </el-form>

    <!-- ③ 表格：唯一滚动区 -->
    <div class="mes-table">
      <el-table :data="list" size="small" height="100%" v-loading="loading" :header-cell-style="HEADER_STYLE">
        <el-table-column prop="matCode" label="物料号" width="120" class-name="cell-mono" />
        <el-table-column prop="matName" label="物料描述" min-width="180" show-overflow-tooltip />
        <el-table-column prop="reqQty" label="本车间需求量" width="120" align="right" :formatter="fmtQty" />
        <el-table-column prop="plantReq" label="全厂总需求" width="110" align="right" :formatter="fmtQty" />
        <el-table-column prop="stock" label="可用库存" width="110" align="right" :formatter="fmtQty" />
        <el-table-column label="缺口" width="100" align="right">
          <template slot-scope="{ row }">
            <span :class="row.gap > 0 ? 'txt-danger' : ''">{{ fmt(row.gap) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template slot-scope="{ row }">
            <el-tag size="small" :type="tagType(row)">{{ row.statusText }}</el-tag>
          </template>
        </el-table-column>
        <template slot="empty"><el-empty description="暂无数据" :image-size="80" /></template>
      </el-table>
    </div>

    <!-- ④ 分页：表格下方 -->
    <div class="mes-pager">
      <el-pagination layout="total, sizes, prev, pager, next" :total="total" :page-sizes="[10,20,50]"
        :current-page.sync="page" :page-size.sync="pageSize" @current-change="load" @size-change="load" />
    </div>
  </div>
</template>

<script>
import { HEADER_STYLE, fmt, fmtQty } from '@/utils/table-style';

export default {
  data() {
    return {
      HEADER_STYLE,
      list: [], total: 0, page: 1, pageSize: 20,
      loading: false, moreOpen: false,
      f: { plant: '', readiness: '', orderNo: '', matCode: '', workCenter: '', status: '' },
      dateRange: null
    };
  },
  methods: {
    fmt, fmtQty,
    tagType(row) {
      return row.status === 'short' ? 'danger' : row.status === 'tight' ? 'warning' : 'success';
    },
    search() { this.page = 1; this.load(); },
    load() { /* 请求数据 */ },
    refresh() { this.load(); this.$message.success('已刷新'); },
    resetFilter() { this.f = { plant:'', readiness:'', orderNo:'', matCode:'', workCenter:'', status:'' }; this.dateRange = null; this.search(); },
    exportData() { /* 导出 */ }
  }
};
</script>
```

---

## 7. 强制约束清单（Element 版）

沿用 v1.0 全部规则（UI-SCR / UI-LAY / UI-BTN / UI-FLT / UI-PAG / UI-ALIGN / UI-NUM / UI-STATE / UI-MOD），配色与数值以 v1.0 为准。以下是 **Element 技术栈新增条款**：

| 规则ID | 约束 | 等级 |
|---|---|---|
| **EL-01** | 优先使用 Element 原生组件，禁止自造表格 / 下拉 / 弹窗 / 分页 | **MUST** |
| **EL-02** | 只允许通过主题变量 + `element-patch.css` 改外观，禁止修改 `element-ui` 源码 | **MUST** |
| **EL-03** | Element 样式覆盖必须集中在 `src/styles/element-patch.css`，禁止散落在页面 `scoped` 样式里 | **MUST** |
| **EL-04** | 全项目统一 `size="small"`（`el-button` / `el-input` / `el-select` / `el-table` / `el-tag`） | **MUST** |
| **EL-05** | `el-table` 用 `height="100%"` + 父级 `flex:1; min-height:0`；**禁止同时设 `max-height`** | **MUST** |
| **EL-06** | 分页 `layout="total, sizes, prev, pager, next"`、`page-sizes="[10,20,50]"`，位于表格下方 | **MUST** |
| **EL-07** | 同一单据创建/编辑/查看 `el-dialog` 的 `width` 必须一致 | **MUST** |
| **EL-08** | 详情字段 ≥ 6 组时用 `el-drawer`（`direction="rtl"`），弹窗内禁止横向滚动条 | SHOULD |
| **EL-09** | 反馈统一 `this.$message` / `this.$confirm`，禁止 `alert` / `confirm` | **MUST** |
| **EL-10** | 加载态 `v-loading`；空态 `el-empty`；禁止自造 loading 遮罩 | SHOULD |
| **EL-11** | 数字列 `align="right"` + `formatter` 千分位；空值返回 `-` | **MUST** |
| **EL-12** | 筛选栏折叠用 `v-show`（保留已填值），禁止 `v-if` | SHOULD |

---

## 8. Element 特有反模式（禁止）

| # | 反模式 | 后果 |
|---|---|---|
| 1 | `el-table` 同时设 `height` 和 `max-height` | 双滚动条 |
| 2 | 页面容器 `width: 100vw` | 撑出窗口级横向滚动条 |
| 3 | 表格父级没有 `min-height: 0` | `height="100%"` 失效，表格撑破页面 |
| 4 | 在页面 `<style scoped>` 里覆盖 `.el-table` 样式 | 各页面表格长得不一样，且 scoped 穿透失败 |
| 5 | 弹窗内放带横向滚动的 `el-table` | 详情里横向滚动极难用，改字段网格或精简列 |
| 6 | 用 `el-badge` 当状态标签 | `el-badge` 是数字角标组件，状态应用 `el-tag` |
| 7 | 表格加 `border` + `stripe` 混用 | 与我们的扁平干净风格冲突（无竖线、无斑马纹） |
| 8 | 用 `alert` / 原生 `confirm` | 风格割裂，且阻塞线程 |
| 9 | 修改 `node_modules/element-ui` 里的样式 | 升级即失效 |
| 10 | 每个页面各写一份「紧凑表格」样式 | 维护灾难，统一走 `.mes-table` |

---

## 9. 提测自检清单（Element 版）

- [ ] 主题已按 §2.1 编译并引入（或兜底 CSS 已生效），主色是 `#1E3A5F`
- [ ] 页面容器 `.mes-page` 是 `width:100%`（不是 `100vw`）
- [ ] 整页只有表格区一条纵向滚动条（横向条已隐藏但仍可滚动）
- [ ] 筛选区五按钮齐全（查询/导出/刷新/重置/更多条件），按钮组靠右常驻
- [ ] 「更多条件」展开后独占一整行，与上方同底色、无分隔线，且切换后已填值不丢
- [ ] 表格 `size="small"`、`height="100%"`，父级有 `min-height:0`
- [ ] 数字列 `align="right"` 且有千分位，空值显示 `-`
- [ ] 状态列全部 `el-tag`，type 符合 §4.3 语义映射
- [ ] 分页在表格下方，`layout` 与 `page-sizes` 符合 EL-06
- [ ] 弹窗内无横向滚动条；同单据创建/编辑/查看 `width` 一致
- [ ] 提示用 `this.$message`，加载用 `v-loading`，空态用 `el-empty`
- [ ] 没有在页面 `scoped` 样式里覆盖 Element 组件

---

## 10. 变更记录

| 日期 | 版本 | 变更内容 |
|---|---|---|
| 2026-09-24 | v1.0 | 视觉与交互规范（设计令牌、组件规范、强制约束） |
| 2026-09-24 | v1.1 | 新增 Element UI 2.15 落地版：主题变量映射、组件映射表、集中补丁 CSS、Vue2 骨架模板、EL-xx 约束条款 |

---

*本版基于 Element UI 2.15.0 编写。若后续升级 Element Plus，组件名与主题变量体系均不同，需另出一版。*
