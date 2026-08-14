---
name: 批次特性与物料凭证冲销功能开发
overview: 在库存管理模块新增两个功能：1) 批次特性修改（含修改记录，合并为一个菜单双 Tab，置于物料主数据分组）；2) 物料凭证冲销（置于库存记账分组，与库存记账并列）。
design:
  architecture:
    framework: html
  styleKeywords:
    - 性冷淡
    - 极简商务
    - 中性灰
    - 克制深蓝强调
    - 大弹窗
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 18px
      weight: 700
    subheading:
      size: 14px
      weight: 600
    body:
      size: 13px
      weight: 400
  colorSystem:
    primary:
      - "#1E3A5F"
      - "#2C5282"
    background:
      - "#F8FAFC"
      - "#F1F5F9"
      - "#FFFFFF"
    text:
      - "#1F2937"
      - "#475569"
      - "#FFFFFF"
    functional:
      - "#10B981"
      - "#DC2626"
      - "#F59E0B"
      - "#3B82F6"
      - "#9CA3AF"
todos:
  - id: create-batch-char-page
    content: 新建 V3/js/pages/batch-char.js：BatchChar 双 Tab 页面（特性修改+修改记录），含 batchCharData/batchCharLogData 数据
    status: completed
  - id: create-reversal-page
    content: 新建 V3/js/pages/material-doc-reversal.js 冲销页面，并为 SAP_MOCK 新增 changeBatchChar/reverseGoodsMovement 接口
    status: completed
  - id: register-menu-scripts
    content: 注册菜单：main.js 菜单项与 pageMap、main.html 与 debug.html 脚本引用
    status: completed
    dependencies:
      - create-batch-char-page
      - create-reversal-page
  - id: sync-docs
    content: 同步 ui-layout-spec.md 合规清单与库存记账 PRD（菜单/数据模型/接口/移动类型映射）
    status: completed
    dependencies:
      - register-menu-scripts
  - id: verify-commit
    content: node --check 与 lint 校验，自动 git add/commit/push（UTF-8 文件方式提交信息）
    status: completed
    dependencies:
      - sync-docs
---

## 产品概述

在库存管理模块中新增两个功能入口，并对功能组织方式做合并优化。

## 核心功能

- **批次特性（合并菜单，页面内双 Tab）**：Tab1「批次特性修改」按工厂/物料/批次查询批次，查看弹窗内编辑批次特性值并保存（调 SAP 模拟接口，自动写入修改记录）；Tab2「修改记录」按批次/特性/修改人/日期查询修改历史（原值→新值、修改原因）
- **物料凭证冲销（独立菜单）**：汇总所有已过账来源（库存记账/入库单/领料单/退料单/预留过账）的物料凭证，查看凭证详情后执行冲销（冲销原因必填、移动类型自动映射反向），冲销后同步回写源单据状态为「已冲销」
- 菜单位置：批次特性放「库存管理→物料主数据」分组；物料凭证冲销放「库存管理→库存记账」分组
- 遵循既有规范：列表操作列仅「查看」、编辑/冲销操作在弹窗内、弹窗大尺寸、UI 沿用性冷淡/极简商务风

## 技术栈

- 沿用现有技术：原生 HTML + CSS + JavaScript（无框架），单页应用由 `V3/js/main.js` 统一管理菜单与 pageMap 路由
- 数据层：沿用「页面文件顶层 const 全局数组 + SAP_MOCK 模拟接口」模式（与 sp-stock-post.js / inspection-batch.js 一致）

## 实施思路

- 参照 `inspection-batch.js` 的 Tab 模式（activeTab + switchTab + 条件渲染）实现「批次特性」双 Tab 页面
- 参照 `sp-stock-post.js` 的扁平化行模型（flattenData）实现「物料凭证冲销」：render 时一次性汇总 `spStockPostData / spReceiptData / spIssueData / spReturnData / spReservationData` 中 `materialDocNo` 非空的行，冲销后回写源数组对应元素 `status='已冲销'` 并记录冲销凭证号，保证与各单据页状态联动
- SAP_MOCK（`V3/js/core/sap-mock.js`）沿用 IIFE + delay + Promise + 随机失败率模式，新增 `changeBatchChar` 与 `reverseGoodsMovement` 两个接口
- 移动类型冲销映射（SAP 标准，自动带出不可手工修改）：101→102、261→262、201→202、311→312、551→552、561→562

## 实施要点

- **脚本加载顺序**：`material-doc-reversal.js` 必须排在所有 sp-* 单据脚本之后（依赖其顶层 const 数组）；`batch-char.js` 排在 material-master.js 之后
- **数据联动**：冲销操作必须同步更新源单据数组，避免单据页与冲销页状态不一致
- **UI 风格**：中性灰（#F8FAFC/#E5E7EB/#1F2937）+ 单一强调色深蓝 #1E3A5F，状态用小面积语义徽章（绿=成功/红=已冲销/黄=待处理/蓝=部分/灰=草稿），无装饰性元素
- **弹窗规范**：查看/编辑/冲销弹窗用 modal-xl / 96vw 大尺寸，内容区留足高度避免滚动
- **性能**：冲销页 flatRows 在 render 时一次性构建，筛选走内存过滤，避免重复遍历
- **反馈**：沿用 toast 提示，SAP 调用用既有 showLoading/hideLoading 遮罩

## 目录结构

```
V3/
├── js/
│   ├── pages/
│   │   ├── batch-char.js              # [NEW] 批次特性页面：BatchChar 对象，双 Tab（修改/记录），batchCharData、batchCharLogData 数据数组
│   │   └── material-doc-reversal.js   # [NEW] 物料凭证冲销页面：MaterialDocReversal 对象，汇总 sp-* 凭证 + 冲销联动
│   ├── core/
│   │   └── sap-mock.js                # [MODIFY] 新增 changeBatchChar、reverseGoodsMovement 接口
│   └── main.js                        # [MODIFY] 菜单两项 + pageMap 注册 BatchChar、MaterialDocReversal
├── main.html                          # [MODIFY] 引入 batch-char.js（material-master.js 后）、material-doc-reversal.js（sp-stock-post.js 后）
├── debug.html                         # [MODIFY] files 数组与 vars 数组补充新文件/新对象
├── docs/
│   └── ui-layout-spec.md              # [MODIFY] 合规清单新增两行
└── 车间领退料与库存记账PRD.md          # [MODIFY] 菜单结构/数据模型/功能/接口/移动类型映射/单据号规则更新
```

## 关键数据结构

- `batchCharData`：批次特性主数据，字段含 batchNo、materialCode、materialName、factory、location、chars[]（charCode/charName/charValue/unit）、updateBy、updateTime
- `batchCharLogData`：修改记录，字段含 logNo、batchNo、materialCode、charCode/charName、oldValue→newValue、changeBy、changeTime、reason
- 冲销扁平行：docNo、sourceType（库存记账/入库单/领料单/退料单/预留过账）、materialDocNo、moveType、matCode/matName、qty/unit、batch、factory/location、postDate、status、reversalDocNo

## 设计风格

沿用项目既有「性冷淡/极简商务风」，与现有页面保持一致，不做风格创新：

- 顶部标题栏沿用深蓝渐变（#1E3A5F 渐变）+ 白字，左侧标题右侧刷新按钮
- Tab 切换沿用检验批管理的白色 tabs 栏（active 下划线/底色）
- 筛选栏、表格、分页、大尺寸弹窗（modal-xl/96vw）均复用现有 common.css 组件类
- 状态信息仅用小面积语义徽章：绿=已过账/成功、红=已冲销/错误、黄=待处理、灰=草稿
- 无装饰元素、无彩虹色块、无多余动效