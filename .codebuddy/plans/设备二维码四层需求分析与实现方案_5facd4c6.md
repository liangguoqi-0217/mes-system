---
name: 设备二维码四层需求分析与实现方案
overview: 分析"设备二维码"四层需求（身份/档案/资料/业务）在现有 V3 PC 端与小程序原型中的覆盖情况，产出 SAP 术语对照表与小程序统一入口的信息架构方案，本轮只做需求分析与方案梳理，不动代码。
design:
  architecture:
    framework: html
  styleKeywords:
    - 极简商务
    - 中性灰
    - 深蓝强调
    - 克制徽章
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 17px
      weight: 600
    subheading:
      size: 14px
      weight: 500
    body:
      size: 13px
      weight: 400
  colorSystem:
    primary:
      - "#1E3A5F"
      - "#2B4C7E"
    background:
      - "#F8FAFC"
      - "#FFFFFF"
    text:
      - "#1F2937"
      - "#6B7280"
    functional:
      - "#16A34A"
      - "#DC2626"
      - "#9CA3AF"
todos:
  - id: verify-module-matrix
    content: 使用[subagent:code-explorer]核实V3设备相关模块的功能与SAP字段，形成四层需求覆盖矩阵
    status: completed
  - id: sap-mapping-table
    content: 编制用户需求描述与SAP术语及V3模块的映射对照表，并说明点检语义差异
    status: completed
    dependencies:
      - verify-module-matrix
  - id: miniapp-architecture
    content: 设计小程序扫码统一入口（设备主页四层Tab）信息架构与页面流程
    status: completed
    dependencies:
      - sap-mapping-table
  - id: write-plan-doc
    content: 产出《设备二维码功能分析方案.md》文档，汇总覆盖矩阵、对照表、信息架构与实施建议
    status: completed
    dependencies:
      - miniapp-architecture
---

## 产品概述

设备二维码（设备铭牌二维码）是连接实体设备与信息系统的入口。每个设备张贴唯一二维码，扫码即可进入该设备的专属页面，按四层结构获取信息与发起业务操作。PC 端用于数据维护与二维码打印，小程序端用于现场扫码使用。

## 核心功能

### 第一层：设备身份（扫一下，知道它是谁）

- 展示设备主数据：设备编码、设备名称、规格型号、制造商、功能位置、运行状态

### 第二层：设备档案（知道它过去发生了什么）

- 维修工单记录、点检记录、保养记录、校准记录、故障记录、变更记录（历史可追溯，只读为主）

### 第三层：设备资料（知道怎么使用和维修它）

- 说明书、SOP、图纸、设备BOM、合格证、验收资料、维修报告（文档附件在线查看）

### 第四层：设备业务（现在可以对它做什么）

- 报修（创建维修通知单）、创建维修工单、执行点检、执行保养、查看待处理工单、查看维修任务、上传维修照片/报告

## 本轮目标（方案确认阶段）

- 不写业务代码；产出《设备二维码功能分析方案》：覆盖矩阵（确认 PC 端已满足大部分需求但分散在不同菜单）、需求描述与 SAP 术语映射对照表、小程序统一入口信息架构设计，以及后续实施建议，供用户确认后再动手开发。

## 技术栈与现状

- PC 端：V3 系统（原生 JS 单页应用，V3/js/main.js 定义菜单，V3/js/pages/ 下各业务模块），已按 SAP 术语建模
- 小程序：miniapp/device-info.html（IBM Carbon 风格手机原型，纯 HTML 单文件，含设备信息/通知单/库存/故障代码 4 个入口与扫码模拟 simulateScan）
- 二维码：PC 端 equipment-master.js 已实现生成与打印（qrContent 为 JSON：{type:'EQUIPMENT',id,code,name,model,location,generatedAt,system:'PM-Master'}），生成后锁定不可变

## 实现思路

以"扫码 → 设备主页 → 四层分区"为小程序统一入口模型；PC 端保持现有模块划分，仅需在方案中给出各模块与四层需求的对应关系（覆盖矩阵），并指出需补齐的缺口（如设备点检模块与 SAP 语义差异、设备资料附件聚合页）。本轮只输出方案文档，不修改任何代码。

## 需求与 SAP 术语映射对照表（核心交付物）

| 用户需求描述 | SAP 术语 | V3 现有模块 | 现状 |
| --- | --- | --- | --- |
| 设备身份/主数据 | 设备主记录（EQUI/EQUNR、设备类别、功能位置） | 设备主数据（equipment-master，tabs：一般/位置/组织结构/结构/分类/交付验收/附件） | 已覆盖 |
| 报修 | 维修通知单（QMEL/QMNUM；QMART：M1 故障报告、M2 维护请求） | 通知单管理（maintenance-notification-v3） | 已覆盖 |
| 创建维修工单 | 维修工单（AUFK/AUFNR；AUART：PM01 预防性、PM02 纠正性、PM03 改造、ZI02 拆卸） | 维修工单管理（maintenance-workorder-v3） | 已覆盖 |
| 点检记录 | 测量点/测量记录（Measurement Point/Measuring Document）；注意：V3 的 inspection-* 是质量检验批，非设备点检 | 测量数据管理（measurement-record、mr-history、mr-import） | 语义需澄清，方案中说明 |
| 保养记录 | 维护计划/预防性维护（Maintenance Plan/Preventive，MPLAN） | 预防性维护计划、保养调度、保养执行（maintenance-preventive/scheduling/execution） | 已覆盖 |
| 校准记录 | 测量记录（校准类） | 测量数据管理（历史查询与趋势 mr-history） | 已覆盖 |
| 故障记录 | 故障代码目录（Code Group/Code） | 故障代码知识库（fault-code-kb）、通知单故障现象 | 已覆盖 |
| 变更记录 | 设备主数据变更/状态变更 | 设备主数据内"状态变更记录"、设备安装移交（equipment-install）、状态变更 | 已覆盖 |
| 说明书/SOP/图纸/合格证 | 设备文档/附件管理 | 设备主数据"附件"tab（documents/photos） | 字段已有，缺聚合展示 |
| 验收资料 | 交付验收 | 设备主数据"交付验收"tab（OA流程/到货/安装/试运行/验收人员） | 已覆盖 |
| 设备BOM | 设备BOM/物料清单 | 设备BOM（equipment-bom） | 已覆盖 |
| 维修报告 | 维修履历与报表 | 设备维修履历与报表（maintenance-reports） | 已覆盖 |
| 查看待处理工单/维修任务 | 工单状态/任务清单（Task List） | 维修工单管理（状态筛选）、任务清单（maintenance-tasklist） | 已覆盖 |
| 上传维修照片/报告 | 工单附件/完工确认 | 维修工单（附件与照片字段） | 已覆盖 |


## 小程序统一入口信息架构（方案设计）

- 入口：首页"设备信息"卡片或任意设备二维码扫码 → 进入设备主页
- 设备主页采用四层 Tab 切换（顶部分段控件：身份 / 档案 / 资料 / 业务），顶部固定设备身份摘要（名称、编码、状态徽章）
- 身份 Tab：设备主数据只读展示（沿用现有详情分组：基本信息/位置组织/技术参数/日期保修）
- 档案 Tab：维修工单、点检、保养、校准、故障、变更六类记录列表（按类型分组，数据来自 PC 端各模块，只读）
- 资料 Tab：说明书、SOP、图纸、BOM、合格证、验收资料、维修报告的附件列表（点击在线查看/跳转 PC 端）
- 业务 Tab：报修（复用现有 showNFForm 通知单创建流程）、创建维修工单、点检、保养入口、待处理工单/维修任务列表、上传照片/报告按钮
- 扫码后直达设备主页，免去手动检索；保留现有库存查询与故障代码独立入口

## 性能与可靠性

- 方案阶段无性能风险；实施时小程序数据全部来自 PC 端接口，采用按 Tab 懒加载，避免一次性拉取全部档案
- 二维码内容为 JSON 明文（含设备 id），后续实施可考虑仅携带 id 以减小体积

## 交付物

- 新增文档：设备二维码功能分析方案.md（含覆盖矩阵、SAP 对照表、小程序信息架构图、实施建议清单），不修改任何业务代码

## 设计目标

本轮为方案确认，不产出视觉稿；信息架构延续现有小程序原型（miniapp/device-info.html 的 IBM Carbon 风格），并遵循用户既定偏好（性冷淡/极简商务风：中性灰 #f8fafc/#e5e7eb/#1f2937 + 单一强调色深蓝 #1E3A5F）。

## 页面规划（不超过 6 屏）

1. 首页（现状保留）：设备信息/通知单/库存查询/故障代码入口
2. 设备列表页（现状保留）：工厂/功能位置/编码筛选 + 搜索
3. 设备主页（新增核心屏）：顶部设备身份摘要卡（名称/编码/状态徽章）＋ 四层 Tab（身份/档案/资料/业务）
4. 档案 Tab 记录列表（可复用同一屏内切换）：六类记录分组展示
5. 资料 Tab 附件列表：文档分类 + 点击查看
6. 业务 Tab：业务操作入口网格（报修/建工单/点检/保养/待处理/上传）

## 布局与交互

- 顶部导航栏保持现有样式，返回按钮复用 goBack 逻辑
- 四层 Tab 采用分段控件，切换即时刷新内容区，无整页跳转
- 状态类信息使用小面积语义色徽章（绿=运行/正常、红=故障、灰=待机），克制使用
- 所有列表行右侧箭头进入明细，操作按钮统一蓝色主按钮

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 验证 V3 各设备模块（equipment-master、maintenance-notification-v3、maintenance-workorder-v3、maintenance-preventive、measurement-record、fault-code-kb、equipment-bom、maintenance-reports 等）与四层需求的对应关系及关键字段，确保覆盖矩阵与 SAP 对照表准确
- Expected outcome: 输出各模块功能与 SAP 字段的准确清单，支撑方案文档中的覆盖矩阵与对照表