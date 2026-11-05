---
name: mes-sample-management-prd
overview: 在 MES V3 质量管理目录下落地"样品管理"整合方案：新增位置树主数据（位置管理页）、泛化样品台账页（检验样品收样→定位→检毕处置，不含检验进度、不过账 SAP、不做审批）、到期报表页（留样+样品到期统一展示），并改造现有留样台账的位置字段为位置树引用。
design:
  architecture:
    framework: html
  styleKeywords:
    - 性冷淡商务风
    - 极简中性灰
    - 藏青主色点缀
    - 大弹窗低密度
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
      - "#2c4a70"
    background:
      - "#f8fafc"
      - "#FFFFFF"
    text:
      - "#1f2937"
      - "#6b7280"
    functional:
      - "#16a34a"
      - "#b45309"
      - "#dc2626"
      - "#e5e7eb"
todos:
  - id: prd-doc
    content: 编写 样品管理PRD.md，沉淀业务边界、状态机、数据流与字段清单
    status: completed
  - id: location-core
    content: 新建 js/core/sample-locations.js：位置树数据、级联选择器、面包屑与反查 API
    status: completed
  - id: location-page
    content: 新建 js/pages/sample-location.js 位置管理页（树形维护+停用占用校验）
    status: completed
  - id: sample-ledger-page
    content: 新建 js/pages/sample-ledger.js 样品台账页：登记方式选择弹窗、上架定位、调用归还、检毕处置、大查看弹窗四页签
    status: completed
  - id: retention-loc-refactor
    content: 改造 js/pages/retention-sample.js：位置字段改为位置树引用，状态机与 SAP 逻辑不动
    status: completed
  - id: expiry-report
    content: 新建 js/pages/sample-expiry-report.js 到期报表页（聚合双台账，剩余天数分档）
    status: completed
  - id: menu-register
    content: 注册 js/main.js 菜单分组与 pageMap，main.html 追加 script 引用
    status: completed
  - id: spec-and-git
    content: 更新 docs/frontend-design-spec.md 样品管理条目，自测后 git add/commit/push
    status: completed
---

## 产品概述

在 MES V3 质量管理目录下建设「样品管理」模块，解决步长 QC 部门样品"找不到在哪"的问题：SAP 库位是逻辑仓，无法管理到冰箱、层架、盒子、行列位。方案以现有留样台账（retention-sample.js v2）为底座泛化，统一位置树主数据，新增样品台账与到期报表，形成完整的样品保管 PRD。

## 业务边界（铁律）

- 检验批管"结果与进度"，样品台账只管"物理位置与保管"，禁止双头状态；检验样品的检验进度不进本模块
- MES 只做事实与结果录入，不做任何审批（审批在纸质/eQMS 完成）
- 不接条码打印机、不接任何硬件；定位靠键盘输入样品编号 → 返回位置路径
- 到期不主动推送，用报表页展示
- 留样在取样环节即已分流，检毕样品去向仅"返还/销毁"，不存在"检毕转留样"
- 编号不统一：检验样品按类别代码规则（如 YF-2026-05-018），留样沿用 LS 编号，靠检验批号关联
- 标准品/对照品管理、温湿度监控、检验结果录入均不在范围内

## 核心功能

### 1. 位置管理（公共主数据，新增）

- 位置树：房间/样品间 → 冰箱/留样柜/干燥器 → 层/搁架 → 盒 → 行列位，节点属性：位置编码、名称、类型、温区（常温/阴凉/冷藏 2~8℃/冷冻）、备注
- 树形维护页面：新增/编辑/停用节点；停用前校验"无在库样品占用"
- 位置结构由 QC 自定，系统只提供层级模型

### 2. 样品台账（新增，泛化页）

- 管理对象：检验样品（原辅料/中药材/包材/成品/中间产品/工艺用水等 14 类别代码）；稳定性样归稳定性模块、留样归留样台账，均不纳入
- 状态机五态：待入库 → 在库 → 调用中 → 已消耗/已销毁（终态只读）
- 登记：点「登记」先弹创建方式选择弹窗——①从检验批带出（物料/批次/检验批号自动带入）②手动登记；编号按"类别代码-年-月-流水号"自动生成且唯一
- 上架定位：从位置树选择节点，落位置路径（面包屑展示）
- 查询定位（最高频）：输入样品编号 → 返回完整位置路径；反向点击某位置节点 → 列出该位置全部在库样品
- 调用/归还：登记领用人、用途、数量，消耗后减余量
- 检毕处置：返还送检方 / 销毁登记（方式、执行人、日期），均记事实不做审批
- 查看弹窗（大弹窗 ≥1200px）四页签：基本信息 / 位置与移动记录 / 调用记录 / 处置记录；列表行项目仅「查看」（btn-blue btn-sm），操作在弹窗内

### 3. 留样台账（改造，不动结构）

- 位置字段由 room/cabinet/shelf/location 四个手填字符串改为引用位置树（登记/上架弹窗换位置选择器）
- 状态机、SAP 311/551 过账、观察/调用/销毁四页签逻辑全部保留不动

### 4. 样品到期报表（新增）

- 汇聚留样台账到期 + 样品台账到期，一张页统一展示：工厂/类型/到期区间/状态筛选，剩余天数高亮分档
- 遵循 FilterActions 五键规范：查询/打印（PrintHelper.printCurrentTable）/导出/我的变式/更多条件

### 5. 菜单结构

质量管理下新增「样品管理」分组：样品台账、留样管理（菜单迁移，路由不变）、位置管理、样品到期报表

## 视觉效果

延续 V3 性冷淡极简商务风：中性灰背景 + 藏青主色，状态用小面积语义徽章，列表页规范复用 filter-actions/query-variant/print 组件，弹窗大而通透无滚动条。

## 技术方案

### 技术栈

沿用 V3 现有纯前端架构：原生 HTML/JS 单页 + 页面对象模式（每页一个全局对象，如 RetentionSample），数据为内存 mock 数组，无后端。不引入新框架。

### 实现思路

完全复用留样台账已验证的页面骨架（筛选栏 + FilterActions 五键 + QueryVariant 变式 + 分页表格 + 大查看弹窗 + 行项目按钮），将可复用部分抽为共享件：

1. 位置树做成独立 core 模块 `js/core/sample-locations.js`：树数据 + 级联位置选择器 + 路径面包屑 + 按位置反查样品的公共 API，供样品台账、留样台账、到期报表三处共用（DRY）
2. 新页面照抄 retention-sample.js 的结构与代码风格（对象字面量、renderFilterBar/renderTable/弹窗方法），保持一致性
3. 到期报表聚合两个台账内存数据做只读视图，不建第三份数据

### 关键数据结构

```js
// 位置树节点（js/core/sample-locations.js）
{
  code: 'FRZ-01-L2-B',      // 位置编码（QC 自定编码规则）
  name: 'B盒',
  type: 'box',              // room|fridge|cabinet|shelf|box|slot
  tempZone: 'COLD',         // RT|COOL|COLD|FREEZE
  parentCode: 'FRZ-01-L2',
  status: 'active',
  path: '样品间1 / 3号冰箱 / 2层 / B盒'  // 冗余面包屑路径
}

// 样品台账记录（js/pages/sample-ledger.js）
{
  sampleNo: 'YF-2026-05-018',   // 类别代码-年-月-流水号，自动生成
  type: 'YF',                    // 类别代码（14 类字典）
  materialCode, materialName, sourceBatch, inspectBatchNo,  // 检验批带出
  qty, remainQty, unit,
  locCode,                       // 引用位置树，替代手填字符串
  status: 'REG|STORED|CALLED|CONSUMED|DESTROYED',
  registerBy, registerTime, moves: [], calls: [], disposal: {}
}
```

### 架构与数据流

```mermaid
graph LR
  检验批 --带出物料/批次/批号--> 样品台账
  位置管理(位置树core) --引用--> 样品台账
  位置管理 --引用--> 留样台账
  样品台账 --到期数据--> 到期报表
  留样台账 --到期数据--> 到期报表
  检验批 --仅展示"留样/样品已登记"状态, 不回写--> 样品台账
```

### 目录结构

```
V3/
├── js/
│   ├── core/
│   │   └── sample-locations.js        # [NEW] 位置树数据 + 级联选择器 + 面包屑 + 反查 API
│   └── pages/
│       ├── sample-location.js         # [NEW] 位置管理页（树形维护，停用校验占用）
│       ├── sample-ledger.js           # [NEW] 样品台账页（登记选择弹窗/上架/调用/检毕处置）
│       ├── sample-expiry-report.js    # [NEW] 样品到期报表页（聚合只读）
│       └── retention-sample.js        # [MODIFY] 位置字段改位置树引用，其余不动
├── main.html                          # [MODIFY] 追加 4 个 script 引用
├── js/main.js                         # [MODIFY] 质量管理下新增"样品管理"分组 + pageMap 注册
├── 样品管理PRD.md                      # [NEW] 本 PRD 文档定稿（沿用根目录 PRD 文件惯例）
└── docs/frontend-design-spec.md       # [MODIFY] 追加样品管理模块 UI 规范条目
```

### 实现要点

- 列表页硬规范：FilterActions.render(cfg) 渲染五键（查询/打印/导出/我的变式/更多条件），禁手写 filter-actions div；QueryVariant.mount/register 照 retention-sample.js 模式；打印走 PrintHelper.printCurrentTable（自动剔操作列）
- 弹窗规范：max-width ≥1200px，四页签布局充分利用高度，避免滚动条
- 查看按钮统一 `btn btn-blue btn-sm`；登记入口存在两种方式 → 先弹方式选择弹窗
- 性能：位置树一次加载内存缓存；反查样品用 code 索引（对象映射）避免遍历；表格分页复用 core/pagination.js
- 留样台账改造严格控制爆炸半径：只动登记/上架弹窗的位置字段来源与展示列渲染，状态机与 SAP 逻辑零改动
- 完成后自动 git add/commit/push，不需询问用户

## 设计风格

延续 V3 既有"性冷淡极简商务风"，与留样台账视觉完全一致：白卡片 + 中性灰分隔线 + 藏青主色，仅状态徽章使用小面积语义色（黄=待办、紫=调用中、红=到期、灰=终态）。三张新页面均为"筛选栏 + 表格 + 大弹窗"经典布局；位置管理页左侧树形面板 + 右侧节点属性卡；到期报表突出"剩余天数"分档高亮（≤30天红/≤90天黄/其余灰），无图表装饰。位置路径一律以面包屑形式展示（样品间1 / 3号冰箱 / 2层 / B盒），这是本模块最具辨识度的视觉元素。