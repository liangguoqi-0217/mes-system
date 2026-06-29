---
name: 采购申请创建弹窗风格统一
overview: 将采购申请（sp-purchase.js）的「新建申请」弹窗 UI 风格改造为与维修工单（maintenance-workorder-v3.js）的「新建工单」弹窗完全一致，包括渐变背景卡片、悬停动画、badge 按钮等视觉元素。
design:
  architecture:
    framework: html
  styleKeywords:
    - Gradient Cards
    - Colored Borders
    - Hover Animation
    - Badge Buttons
    - Grid Layout
    - Consistent UI
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 15px
      weight: 700
    subheading:
      size: 14px
      weight: 600
    body:
      size: 12px
      weight: 400
  colorSystem:
    primary:
      - "#3b82f6"
      - "#10b981"
    background:
      - "#eff6ff"
      - "#dbeafe"
      - "#ecfdf5"
      - "#d1fae5"
    text:
      - "#1e40af"
      - "#065f46"
      - "#6b7280"
    functional:
      - "#bfdbfe"
      - "#86efac"
      - "#f59e0b"
todos:
  - id: refactor-openNewModal
    content: 改造 sp-purchase.js 中 openNewModal() 方法，对齐维修工单弹窗风格（渐变卡片+彩色边框+hover动画+badge按钮+grid布局+modal-xl宽度）
    status: completed
  - id: cleanup-old-code
    content: 清理采购申请文件中旧的弹窗相关代码（prModalContainer 写入方式及 .choice-card CSS）
    status: completed
    dependencies:
      - refactor-openNewModal
  - id: commit-push
    content: 提交代码并推送到 GitHub
    status: completed
    dependencies:
      - cleanup-old-code
---

## 需求概述

将采购申请（sp-purchase.js）的「新建申请」选择弹窗 UI 风格改造为与维修工单（maintenance-workorder-v3.js）的「选择工单创建方式」弹窗完全一致。

## 背景

用户要求：多种创建方式的单据，点击「创建」按钮后先弹出选择弹窗，且所有此类弹窗的 UI 风格必须以维修工单创建弹窗为模板，后续新单据都沿用此风格。

## 当前差异

| 对比项 | 维修工单（模板） | 采购申请（待改造） |
| --- | --- | --- |
| 弹窗调用 | 全局 showModal() | 直接操作 prModalContainer.innerHTML |
| 卡片背景 | 渐变背景 linear-gradient | 白色背景 |
| 卡片边框 | 彩色边框（与背景同色系） | 灰色边框 var(--border) |
| 悬停效果 | onmouseenter/onmouseleave 实现，彩色阴影 | CSS .choice-card:hover，蓝色阴影 |
| 卡片内容 | emoji + 标题 + 描述 + badge按钮 | emoji + 标题 + 描述，无badge按钮 |
| 布局 | grid 2×2，gap:14px | flex 横向，gap:16px |
| 弹窗宽度 | modal-xl | max-width:500px |
| 底部提示 | 有虚线提示条 | 无 |


## 改造范围

仅修改 `d:\我的项目\MES系统\V3\js\pages\sp-purchase.js` 中的 `openNewModal()` 方法（第320-352行）。

## 技术栈

- 现有项目，纯前端（HTML + CSS + JavaScript）
- 弹窗系统：全局 `showModal()` / `closeModal()` 函数（定义于 `V3/js/app.js`）

## 实现方案

### 修改文件

- `d:\我的项目\MES系统\V3\js\pages\sp-purchase.js` 第320-352行

### 改造步骤

#### 1. 弹窗调用方式改造

将 `prModalContainer.innerHTML` 直接写入方式改为调用全局 `showModal()` 函数，与维修工单保持一致。

#### 2. 卡片一「手工填写」样式（蓝色系，对齐维修工单「手工创建」卡片）

- 背景：`linear-gradient(135deg, #eff6ff, #dbeafe)`
- 边框：`2px solid #bfdbfe`
- 圆角：`12px`，padding：`20px 16px`
- 悬停（`onmouseenter`）：`borderColor='#3b82f6'`，`transform='translateY(-2px)'`，`boxShadow='0 6px 20px rgba(59,130,246,.15)'`
- 悬停（`onmouseleave`）：恢复 `#bfdbfe` 边框，阴影 none
- 标题颜色：`#1e40af`
- 描述颜色：`#6b7280`
- 底部添加 badge：`<span class="badge badge-blue" style="padding:5px 16px;border-radius:16px;font-size:12px;">开始填写 →</span>`

#### 3. 卡片二「模板批导」样式（绿色系，对齐维修工单「引用维护计划」卡片色系）

- 背景：`linear-gradient(135deg, #ecfdf5, #d1fae5)`
- 边框：`2px solid #86efac`
- 悬停（`onmouseenter`）：`borderColor='#10b981'`，`transform='translateY(-2px)'`，`boxShadow='0 6px 20px rgba(16,185,129,.15)'`
- 悬停（`onmouseleave`）：恢复 `#86efac` 边框，阴影 none
- 标题颜色：`#065f46`
- 描述颜色：`#6b7280`
- 底部添加 badge：`<span class="badge" style="padding:5px 16px;border-radius:16px;font-size:12px;background:#10b981;color:#fff;">开始批导 →</span>`

#### 4. 布局改造

- 使用 `display:grid; grid-template-columns:1fr 1fr; gap:14px;` 替代 `display:flex; gap:16px;`
- 弹窗宽度改为 `'modal-xl'`（第四个参数传给 showModal）

#### 5. 底部提示条

添加与维修工单风格一致的虚线提示条：

```html
<div style="margin-top:14px;padding:8px 12px;background:#f9fafb;border-radius:8px;font-size:12px;color:var(--text-muted);text-align:center;border:1px dashed var(--border);">
  💡 提示：也可从已有采购申请复制创建
</div>
```

#### 6. 清理旧代码

- 删除 `prModalContainer` 相关 innerHTML 写入代码
- 删除 `.choice-card:hover` 的 CSS 代码块（不再需要）
- `onclick` 回调中先调用 `closeModal()` 再执行对应操作（与维修工单一致）

### 改造后 openNewModal() 结构示意

```javascript
openNewModal() {
  const body = `
    <div style="padding:4px 0;">
      <div style="font-size:14px;color:var(--text-secondary);margin-bottom:16px;text-align:center;">
        请选择一种方式创建采购申请
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <!-- 卡片一：手工填写（蓝色渐变+彩色边框+悬停动画+badge按钮） -->
        <!-- 卡片二：模板批导（绿色渐变+彩色边框+悬停动画+badge按钮） -->
      </div>
      <div style="margin-top:14px;...">💡 提示：...</div>
    </div>`;
  showModal('📌 选择创建方式', body, [
    { text: '取消', cls: 'btn-secondary', action: closeModal }
  ], 'modal-xl');
}
```

## 设计风格

严格对齐维修工单「选择工单创建方式」弹窗的视觉风格，作为后续所有多创建方式单据弹窗的统一模板。

## 弹窗设计规格

### 弹窗容器

- 调用全局 `showModal()` 函数，标题为 `📌 选择创建方式`
- 弹窗宽度：`modal-xl`（大宽屏，与维修工单一致）
- 底部按钮：仅「取消」按钮（由 showModal 的 footerBtns 参数控制）

### 卡片设计（2×1 网格布局）

- 布局：`display:grid; grid-template-columns:1fr 1fr; gap:14px;`
- 卡片尺寸：自适应 grid，内容居中（`text-align:center`）

#### 卡片一：手工填写（蓝色系）

- 背景：`linear-gradient(135deg, #eff6ff, #dbeafe)`
- 边框：`2px solid #bfdbfe`，圆角 `12px`
- 内边距：`20px 16px`
- 悬停效果：
- 边框变为 `#3b82f6`
- 向上浮动 `translateY(-2px)`
- 阴影 `0 6px 20px rgba(59,130,246,.15)`
- 内容：
- Emoji 图标：36px，底部间距 8px
- 标题：「手工填写」15px、font-weight:700、颜色 `#1e40af`，底部间距 4px
- 描述：「逐项填写物料信息，适合单次少量采购申请」12px、颜色 `#6b7280`、line-height:1.45
- Badge 按钮：`<span class="badge badge-blue">` 样式，`padding:5px 16px;border-radius:16px;font-size:12px`，文字「开始填写 →」，顶部间距 12px

#### 卡片二：模板批导（绿色系）

- 背景：`linear-gradient(135deg, #ecfdf5, #d1fae5)`
- 边框：`2px solid #86efac`，圆角 `12px`
- 内边距：`20px 16px`
- 悬停效果：
- 边框变为 `#10b981`
- 向上浮动 `translateY(-2px)`
- 阴影 `0 6px 20px rgba(16,185,129,.15)`
- 内容：
- Emoji 图标：36px，底部间距 8px
- 标题：「模板批导」15px、font-weight:700、颜色 `#065f46`，底部间距 4px
- 描述：「下载模板批量填写后上传，适合大批量采购申请」12px、颜色 `#6b7280`、line-height:1.45
- Badge 按钮：背景 `#10b981`、颜色 `#fff`，`padding:5px 16px;border-radius:16px;font-size:12px`，文字「开始批导 →」，顶部间距 12px

### 底部提示条

- 顶部间距：`14px`
- 背景：`#f9fafb`
- 边框：`1px dashed var(--border)`，圆角 `8px`
- 内边距：`8px 12px`
- 文字：12px、`var(--text-muted)`、居中
- 内容：「💡 提示：也可从已有采购申请复制创建」

### 交互行为

- 点击卡片：先调用 `closeModal()` 关闭选择弹窗，再执行对应创建操作（手工填写/`openManualForm()` 或模板批导/`openBatchImportModal()`）
- 悬停效果通过 `onmouseenter`/`onmouseleave` 内联事件实现（与维修工单完全一致）

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 深入探索维修工单弹窗的完整实现细节，确保采购申请弹窗改造后完全对齐样式规范
- Expected outcome: 获取维修工单 showCreatePicker 的完整 DOM 结构和样式属性，作为改造的精确参考