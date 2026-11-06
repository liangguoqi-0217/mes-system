// ===== 稳定性研究 =====
// 质量管理 → 稳定性管理 → 稳定性研究
//
// 定位：稳定性研究是一张「研究主单」，一个研究 = 一个小项目，周期以年计。
// 主单贯穿全生命周期：草稿 → 立项（登记方案批准文号）→ 备样入箱 → 进行中 ⇄ 停用 → 完成 / 取消。
//
// 四个页签：研究方案 / 样品与位置 / 时间点执行 / 生命周期
// 关键模型：条件（长期 / 加速 / 中间 / 强制降解）→ 每个条件下挂 样品 + 时间点
//
// 边界：
//   · 方案批准、偏差/OOS 调查、报告签发在纸质 / eQMS，本页只登记文号与单号，不做审批流；
//   · 结果录入与使用决策复用「检验批管理」，到点取样生成 89 型手工检验批；
//   · 稳定性样品不纳入 SAP 库存（与留样的 311/551 过账不同），只登记数量与位置；
//   · 稳定性样品不进「样品台账」，位置引用公共位置树（样品台账只管留样 + 检验样品）。
const StabilityPlan = {
  _version: '2.0-20261106',
  page: 1,
  pageSize: 10,
  filtered: [],
  moreOpen: false,
  _ctx: {},
  _seeded: false,
  _lotSeq: 4200,

  // ==================== 字典 ====================

  typeOptions: [
    { code: 'PREMARKET',  name: '上市前',   badge: 'badge-purple' },
    { code: 'POSTCHANGE', name: '变更后',   badge: 'badge-yellow' },
    { code: 'CONTINUOUS', name: '持续考察', badge: 'badge-blue' },
    { code: 'FORCED',     name: '强制降解', badge: 'badge-gray' }
  ],

  masterStatusMeta: {
    DRAFT:     { name: '草稿',   badge: 'badge-gray' },
    READY:     { name: '待入箱', badge: 'badge-yellow' },
    RUNNING:   { name: '进行中', badge: 'badge-green' },
    SUSPENDED: { name: '已停用', badge: 'badge-yellow' },
    COMPLETED: { name: '已完成', badge: 'badge-gray' },
    CANCELLED: { name: '已取消', badge: 'badge-red' }
  },

  condStatusMeta: {
    NOT_STARTED: { name: '未启动', badge: 'badge-gray' },
    RUNNING:     { name: '进行中', badge: 'badge-green' },
    SUSPENDED:   { name: '已停用', badge: 'badge-yellow' },
    COMPLETED:   { name: '已完成', badge: 'badge-gray' },
    CANCELLED:   { name: '已取消', badge: 'badge-red' }
  },

  pointStatusMeta: {
    PLANNED:  { name: '待取样', badge: 'badge-gray' },
    DUE:      { name: '到期',   badge: 'badge-blue' },
    OVERDUE:  { name: '已超期', badge: 'badge-red' },
    TESTING:  { name: '检验中', badge: 'badge-purple' },
    DONE:     { name: '已完成', badge: 'badge-green' },
    SKIPPED:  { name: '已跳过', badge: 'badge-gray' }
  },

  condOptions: [
    { code: 'LT', name: '长期 25℃/60%RH' },
    { code: 'AC', name: '加速 40℃/75%RH' },
    { code: 'IC', name: '中间 30℃/65%RH' },
    { code: 'FD', name: '强制降解' }
  ],

  itemOptions: ['性状', '鉴别', '含量测定', '有关物质', '水分', '溶出度', 'pH值', '可见异物', '无菌', '微生物限度'],

  plantOptions: [
    { code: '1000', name: '山东步长制药工厂' },
    { code: '2001', name: '陕西步长制药工厂' },
    { code: '2002', name: '山东丹红制药工厂' },
    { code: '2003', name: '山东神州制药工厂' },
    { code: '2004', name: '山东康爱制药工厂' },
    { code: '2005', name: '通化谷红制药工厂' }
  ],

  templates: [
    { id: 'T1', name: '固体口服制剂（长期 + 加速）', type: 'CONTINUOUS', conds: ['LT', 'AC'],
      months: [0, 3, 6, 9, 12, 18, 24, 36], items: ['性状', '鉴别', '含量测定', '有关物质', '溶出度', '微生物限度'],
      qtyPerPoint: 6, unit: '盒', backupRate: 0.2 },
    { id: 'T2', name: '注射剂（长期 + 加速）', type: 'CONTINUOUS', conds: ['LT', 'AC'],
      months: [0, 3, 6, 9, 12, 18, 24], items: ['性状', '鉴别', '含量测定', '有关物质', 'pH值', '可见异物', '无菌'],
      qtyPerPoint: 10, unit: '支', backupRate: 0.2 },
    { id: 'T3', name: '原料药（长期 + 加速 + 强制降解）', type: 'PREMARKET', conds: ['LT', 'AC', 'FD'],
      months: [0, 3, 6, 9, 12, 18, 24], items: ['性状', '鉴别', '含量测定', '有关物质', '水分'],
      qtyPerPoint: 200, unit: 'g', backupRate: 0.15 }
  ],

  // 年度考察计划（AP-xxxx）由 js/pages/stability-annual.js 维护，本页只读取与回写

  // ==================== 研究主单数据 ====================
  // conds[].done: 已执行时间点（month → 执行事实）；未列出的时间点由 _seed 按日期推导状态

  studies: [
    {
      id: 'S01', no: 'STB-26001', name: '布洛芬缓释胶囊 2026 年度持续稳定性考察',
      type: 'CONTINUOUS', plant: '2001', materialCode: 'MAT-20002', materialName: '布洛芬缓释胶囊',
      spec: '0.3g', packSpec: '铝塑泡罩 12 粒/盒', batchNo: 'SAP-BT-20250520', batchQty: '9,600 盒',
      purpose: '2026 年度持续稳定性考察计划', changeNo: '',
      protocolNo: 'ST-P-2025-001', approvalNo: 'QA-AP-2025-0312', approvalDate: '2025-06-01',
      startDate: '2025-06-20', windowDays: 5, owner: '李工', qaOwner: '张 QA',
      qtyPerPoint: 6, unit: '盒', backupRate: 0.2, status: 'RUNNING',
      createdAt: '2025-05-28', createdBy: '李工', remark: '商业化年度持续考察',
      conds: [
        { code: 'LT', status: 'RUNNING', locCode: 'STB-X01-L1-A',
          months: [0, 3, 6, 9, 12, 18, 24, 36],
          items: ['性状', '鉴别', '含量测定', '有关物质', '溶出度', '微生物限度'],
          done: {
            0:  { date: '2025-06-21', batch: '100000013101', verdict: 'PASS' },
            3:  { date: '2025-09-22', batch: '100000013102', verdict: 'PASS' },
            6:  { date: '2025-12-21', batch: '100000013103', verdict: 'PASS' },
            9:  { date: '2026-03-21', batch: '100000013104', verdict: 'PASS' },
            12: { date: '2026-06-22', batch: '100000013105', verdict: 'OOT', note: '有关物质 0.32%→0.61% 趋势上移，趋势评估 TREND-EVA-2026-006' }
          } },
        { code: 'AC', status: 'COMPLETED', locCode: 'STB-X02-L1-A',
          months: [0, 3, 6, 9],
          items: ['性状', '鉴别', '含量测定', '有关物质', '溶出度'],
          done: {
            0: { date: '2025-06-21', batch: '100000013111', verdict: 'PASS' },
            3: { date: '2025-09-22', batch: '100000013112', verdict: 'PASS' },
            6: { date: '2025-12-21', batch: '100000013113', verdict: 'PASS' },
            9: { date: '2026-03-20', batch: '100000013114', verdict: 'PASS', note: '有关物质 0.94%，接近限值 1.0%' }
          } }
      ],
      logs: [
        { time: '2025-05-28 09:10', action: '创建研究', by: '李工', note: '草稿' },
        { time: '2025-06-01 14:20', action: '研究立项', by: '张 QA', note: '方案 ST-P-2025-001，批准文号 QA-AP-2025-0312' },
        { time: '2025-06-20 10:00', action: '备样入箱', by: '李工', note: '长期 / 加速两个条件入箱' },
        { time: '2026-03-20 16:10', action: '条件完成', by: '李工', note: '加速条件 9 月点完成后结束' }
      ]
    },
    {
      id: 'S02', no: 'STB-25902', name: '维生素C原料上市稳定性考察',
      type: 'PREMARKET', plant: '1000', materialCode: 'MAT-10006', materialName: '维生素C原料',
      spec: '25kg/桶', packSpec: '双层聚乙烯袋 + 纸板桶', batchNo: 'SAP-BT-20230601', batchQty: '1,200 kg',
      purpose: '注册申报（支持有效期 24 个月）', changeNo: '',
      protocolNo: 'ST-P-2023-003', approvalNo: 'QA-AP-2023-0508', approvalDate: '2023-05-20',
      startDate: '2023-06-15', windowDays: 5, owner: '陈工', qaOwner: '吴 QA',
      qtyPerPoint: 200, unit: 'g', backupRate: 0.15, status: 'COMPLETED',
      createdAt: '2023-05-10', createdBy: '陈工', remark: '注册获批（有效期 24 个月）',
      conds: [
        { code: 'LT', status: 'COMPLETED', locCode: 'STB-X03-L1-A',
          months: [0, 3, 6, 9, 12, 18, 24],
          items: ['性状', '鉴别', '含量测定', '有关物质', '水分'],
          done: {
            0:  { date: '2023-06-16', batch: '100000008801', verdict: 'PASS' },
            3:  { date: '2023-09-18', batch: '100000009105', verdict: 'PASS' },
            6:  { date: '2023-12-16', batch: '100000009406', verdict: 'PASS' },
            9:  { date: '2024-03-18', batch: '100000009902', verdict: 'PASS' },
            12: { date: '2024-06-17', batch: '100000010403', verdict: 'PASS' },
            18: { date: '2024-12-16', batch: '100000011208', verdict: 'PASS' },
            24: { date: '2025-06-16', batch: '100000011906', verdict: 'PASS', note: '全时间点合格，报告用于注册申报' }
          } }
      ],
      logs: [
        { time: '2023-05-10 10:00', action: '创建研究', by: '陈工', note: '上市前注册研究' },
        { time: '2023-05-20 09:30', action: '研究立项', by: '吴 QA', note: '批准文号 QA-AP-2023-0508' },
        { time: '2023-06-15 10:20', action: '备样入箱', by: '陈工', note: '长期条件入箱 1,720 g' },
        { time: '2025-06-20 15:00', action: '研究完成', by: '陈工', note: '24 月点合格，支持有效期 24 个月' }
      ]
    },
    {
      id: 'S03', no: 'STB-26003', name: '冠心宁注射液变更后稳定性考察',
      type: 'POSTCHANGE', plant: '2002', materialCode: 'MAT-30005', materialName: '冠心宁注射液',
      spec: '10ml', packSpec: '安瓿 10ml × 5 支/盒', batchNo: 'SAP-BT-20260710', batchQty: '12,000 支',
      purpose: '包材供应商变更（关联变更单 CHG-2026-021）', changeNo: 'CHG-2026-021',
      protocolNo: 'ST-P-2026-003', approvalNo: 'QA-AP-2026-0715', approvalDate: '2026-07-15',
      startDate: '2026-07-18', windowDays: 7, owner: '钱工', qaOwner: '张 QA',
      qtyPerPoint: 10, unit: '支', backupRate: 0.2, status: 'RUNNING',
      createdAt: '2026-07-10', createdBy: '钱工', remark: '',
      conds: [
        { code: 'LT', status: 'RUNNING', locCode: 'STB-X01-L2-A',
          months: [0, 3, 6, 12, 18, 24],
          items: ['性状', '鉴别', '含量测定', '有关物质', 'pH值', '可见异物', '无菌'],
          done: {
            0: { date: '2026-07-18', batch: '100000014001', verdict: 'PASS' }
          } }
      ],
      logs: [
        { time: '2026-07-10 14:00', action: '创建研究', by: '钱工', note: '关联变更 CHG-2026-021' },
        { time: '2026-07-15 11:00', action: '研究立项', by: '张 QA', note: '批准文号 QA-AP-2026-0715' },
        { time: '2026-07-18 14:30', action: '备样入箱', by: '钱工', note: '长期条件入箱 72 支' }
      ]
    },
    {
      id: 'S04', no: 'STB-26004', name: '丹红注射液 2026 年度持续稳定性考察',
      type: 'CONTINUOUS', plant: '2002', materialCode: 'MAT-30002', materialName: '丹红注射液',
      spec: '10ml', packSpec: '安瓿 10ml × 5 支/盒', batchNo: 'SAP-BT-20260305', batchQty: '15,000 支',
      purpose: '2026 年度持续稳定性考察计划', changeNo: '',
      protocolNo: 'ST-P-2026-004', approvalNo: 'QA-AP-2026-0301', approvalDate: '2026-03-01',
      startDate: '2026-03-10', windowDays: 5, owner: '赵工', qaOwner: '张 QA',
      qtyPerPoint: 8, unit: '支', backupRate: 0.25, status: 'RUNNING',
      createdAt: '2026-02-25', createdBy: '赵工', remark: '',
      conds: [
        { code: 'LT', status: 'RUNNING', locCode: 'STB-X01-L1-B',
          months: [0, 6, 12, 24, 36],
          items: ['性状', '鉴别', '含量测定', '有关物质', 'pH值', '可见异物'],
          done: {
            0: { date: '2026-03-11', batch: '100000014101', verdict: 'PASS' },
            6: { date: '2026-09-12', batch: '100000014208', verdict: 'OOS', note: '有关物质 1.12% 超限（≤1.0%），关联偏差 DEV-20260915-002' }
          } },
        { code: 'AC', status: 'SUSPENDED', locCode: 'STB-X01-L2-A',
          months: [0, 6, 12],
          items: ['性状', '鉴别', '含量测定', '有关物质'],
          done: {
            0: { date: '2026-03-11', batch: '100000014102', verdict: 'PASS' },
            6: { date: '2026-09-12', batch: '100000014209', verdict: 'PASS' }
          },
          suspend: { date: '2026-09-20', by: '张 QA', reason: '加速 6 月点 OOS，经评估暂停后续加速时间点', approvalNo: 'QA-AP-2026-0920' } }
      ],
      logs: [
        { time: '2026-02-25 09:00', action: '创建研究', by: '赵工', note: '' },
        { time: '2026-03-01 10:00', action: '研究立项', by: '张 QA', note: '批准文号 QA-AP-2026-0301' },
        { time: '2026-03-10 09:40', action: '备样入箱', by: '赵工', note: '长期 / 加速两个条件入箱' },
        { time: '2026-09-20 16:30', action: '条件停用', by: '张 QA', note: '加速条件停用：加速 6 月点 OOS' }
      ]
    },
    {
      id: 'S05', no: 'STB-26005', name: '稳心颗粒 2026 年度持续稳定性考察',
      type: 'CONTINUOUS', plant: '2001', materialCode: 'MAT-20003', materialName: '稳心颗粒',
      spec: '9g', packSpec: '复合膜袋 9g × 9 袋/盒', batchNo: 'SAP-BT-20260420', batchQty: '20,000 盒',
      purpose: '2026 年度持续稳定性考察计划', changeNo: '',
      protocolNo: 'ST-P-2026-005', approvalNo: 'QA-AP-2026-0425', approvalDate: '2026-04-25',
      startDate: '2026-05-10', windowDays: 7, owner: '周工', qaOwner: '张 QA',
      qtyPerPoint: 4, unit: '袋', backupRate: 0.2, status: 'RUNNING',
      createdAt: '2026-04-20', createdBy: '周工', remark: '',
      conds: [
        { code: 'LT', status: 'RUNNING', locCode: 'STB-X01-L2-B',
          months: [0, 3, 6, 9, 12],
          items: ['性状', '鉴别', '含量测定', '有关物质', '水分', '微生物限度'],
          done: {
            0: { date: '2026-05-11', batch: '100000014301', verdict: 'PASS' },
            3: { date: '2026-08-11', batch: '100000014305', verdict: 'PASS' }
          } }
      ],
      logs: [
        { time: '2026-04-20 09:30', action: '创建研究', by: '周工', note: '' },
        { time: '2026-04-25 15:00', action: '研究立项', by: '张 QA', note: '批准文号 QA-AP-2026-0425' },
        { time: '2026-05-10 09:20', action: '备样入箱', by: '周工', note: '长期条件入箱 24 袋' }
      ]
    },
    {
      id: 'S06', no: 'STB-26006', name: '脑心通胶囊包材变更后稳定性考察',
      type: 'POSTCHANGE', plant: '2001', materialCode: 'MAT-20001', materialName: '脑心通胶囊',
      spec: '0.4g', packSpec: '铝塑泡罩 12 粒/盒', batchNo: 'SAP-BT-20260901', batchQty: '8,000 盒',
      purpose: '包装材料变更（关联变更单 CHG-2026-046）', changeNo: 'CHG-2026-046',
      protocolNo: 'ST-P-2026-012', approvalNo: 'QA-AP-2026-0918', approvalDate: '2026-09-18',
      startDate: '2026-09-25', windowDays: 5, owner: '王工', qaOwner: '张 QA',
      qtyPerPoint: 6, unit: '盒', backupRate: 0.2, status: 'READY',
      createdAt: '2026-09-15', createdBy: '王工', remark: '方案已批准，待备样入箱',
      conds: [
        { code: 'LT', status: 'NOT_STARTED', months: [0, 3, 6, 9, 12, 18, 24],
          items: ['性状', '鉴别', '含量测定', '有关物质', '溶出度', '微生物限度'] },
        { code: 'AC', status: 'NOT_STARTED', months: [0, 3, 6],
          items: ['性状', '鉴别', '含量测定', '有关物质', '溶出度'] }
      ],
      logs: [
        { time: '2026-09-15 10:20', action: '创建研究', by: '王工', note: '关联变更 CHG-2026-046' },
        { time: '2026-09-18 14:00', action: '研究立项', by: '张 QA', note: '批准文号 QA-AP-2026-0918' }
      ]
    },
    {
      id: 'S07', no: 'STB-26007', name: '布洛芬原料药强制降解试验',
      type: 'FORCED', plant: '1000', materialCode: 'MAT-10005', materialName: '布洛芬原料药',
      spec: '25kg/桶', packSpec: '双层聚乙烯袋 + 纸板桶', batchNo: '', batchQty: '',
      purpose: '降解路径研究（支持有关物质方法开发）', changeNo: '',
      protocolNo: '', approvalNo: '', approvalDate: '',
      startDate: '2026-11-20', windowDays: 3, owner: '陈工', qaOwner: '吴 QA',
      qtyPerPoint: 50, unit: 'g', backupRate: 0.3, status: 'DRAFT',
      createdAt: '2026-11-05', createdBy: '陈工', remark: '',
      conds: [
        { code: 'FD', status: 'NOT_STARTED', months: [0],
          items: ['性状', '含量测定', '有关物质'] }
      ],
      logs: [
        { time: '2026-11-05 16:10', action: '创建研究', by: '陈工', note: '草稿' }
      ]
    }
  ],

  // ==================== 种子：时间点 + 样品 ====================

  // 方案组示例：同一方案 ST-P-2025-001 下第 2 批（第 1 批为 S01 / STB-26001）
  // 目的：多批并列趋势与「同方案批次」聚合有真实数据可看
  _seedBatches() {
    if (this.studies.some(s => s.no === 'STB-26009')) return;
    const base = this.studies.find(s => s.no === 'STB-26001');
    if (!base) return;
    this.studies.push({
      id: 'S08', no: 'STB-26009', name: '布洛芬缓释胶囊 2026 年度第 2 批持续稳定性考察',
      type: 'CONTINUOUS', plant: '2001', materialCode: 'MAT-20002', materialName: '布洛芬缓释胶囊',
      spec: '0.3g', packSpec: '铝塑泡罩 12 粒/盒', batchNo: 'SAP-BT-20260318', batchQty: '8,800 盒',
      purpose: '2026 年度持续稳定性考察计划（同方案第 2 批）', changeNo: '',
      protocolNo: 'ST-P-2025-001', approvalNo: 'QA-AP-2025-0312', approvalDate: '2025-06-01',
      startDate: '2026-03-18', windowDays: 5, owner: '李工', qaOwner: '张 QA',
      qtyPerPoint: 6, unit: '盒', backupRate: 0.2, status: 'RUNNING',
      createdAt: '2026-03-10', createdBy: '李工', remark: '沿用方案 ST-P-2025-001，第 2 批',
      conds: [
        { code: 'LT', status: 'RUNNING', locCode: 'STB-X01-L2-A',
          months: [0, 3, 6, 9, 12, 18, 24, 36],
          items: base.conds[0].items.slice(),
          done: {
            0: { date: '2026-03-19', batch: '100000014201', verdict: 'PASS' },
            3: { date: '2026-06-19', batch: '100000014202', verdict: 'PASS' }
          } },
        { code: 'AC', status: 'RUNNING', locCode: 'STB-X02-L1-B',
          months: [0, 3, 6, 9],
          items: base.conds[1].items.slice(),
          done: {
            0: { date: '2026-03-19', batch: '100000014211', verdict: 'PASS' },
            3: { date: '2026-06-19', batch: '100000014212', verdict: 'PASS' }
          } }
      ],
      logs: [
        { time: '2026-03-10 09:00', action: '创建研究', by: '李工', note: '从年度考察计划立项（第 2 批）' },
        { time: '2026-03-12 10:00', action: '研究立项', by: '张 QA', note: '沿用方案 ST-P-2025-001，批准文号 QA-AP-2025-0312' },
        { time: '2026-03-18 10:30', action: '备样入箱', by: '李工', note: '长期 / 加速两个条件入箱' }
      ]
    });
  },

  _seed() {
    if (this._seeded) return;
    this._seedBatches();
    this.studies.forEach(s => {
      s.conds.forEach(c => {
        c.points = (c.months || []).map(m => {
          const d = c.done && c.done[m];
          const p = { month: m, planDate: _addMonths(s.startDate, m) };
          if (d) {
            p.date = d.date; p.batch = d.batch; p.verdict = d.verdict; p.note = d.note || '';
          }
          return p;
        });
        if (c.status !== 'NOT_STARTED') {
          const total = Math.ceil(c.points.length * s.qtyPerPoint * (1 + s.backupRate));
          const used = c.points.filter(p => p.batch).length * s.qtyPerPoint;
          const sm = {
            id: s.id + '-' + c.code, no: s.no + '-' + c.code + '-01', cond: c.code,
            qty: c.inQty || total, unit: s.unit, used: used,
            locCode: c.locCode || '', inDate: s.stockInDate || s.startDate,
            by: s.owner, status: 'IN_STORAGE', moves: []
          };
          if (c.code === 'AC' && s.id === 'S04') {
            sm.moves.push({ time: '2026-09-20 16:00', from: 'STB-X02-L1-B', to: 'STB-X01-L2-A', by: '赵工', reason: 'STB-X04 压缩机故障，样品转移' });
          }
          s.samples = s.samples || [];
          s.samples.push(sm);
        }
      });
      s.status = this._deriveMaster(s);
    });
    this._seeded = true;
  },

  _deriveMaster(s) {
    if (s.status === 'CANCELLED') return 'CANCELLED';
    const cs = s.conds.map(c => c.status);
    if (cs.every(x => x === 'COMPLETED' || x === 'CANCELLED')) return 'COMPLETED';
    if (cs.every(x => x === 'SUSPENDED' || x === 'CANCELLED')) return 'SUSPENDED';
    if (cs.some(x => x === 'RUNNING' || x === 'COMPLETED')) return 'RUNNING';
    return s.status;
  },

  // ==================== 查询 / 派生 ====================

  find(id) { return this.studies.find(s => s.id === id) || null; },

  getStudy(no) { return this.studies.find(s => s.no === no) || null; },

  // 同方案批次（A+ 聚合键 = 方案编号，批次是研究属性而非研究本身）
  groupStudies(protocolNo) {
    if (!protocolNo) return [];
    return this.studies.filter(s => s.protocolNo === protocolNo)
      .sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)));
  },

  batchIndex(s) {
    const i = this.groupStudies(s.protocolNo).findIndex(x => x.id === s.id);
    return i < 0 ? 1 : i + 1;
  },

  batchLabel(s) {
    const list = this.groupStudies(s.protocolNo);
    if (list.length <= 1) return '';
    return '第 ' + this.batchIndex(s) + ' / ' + list.length + ' 批';
  },

  typeMeta(code) {
    const t = this.typeOptions.find(x => x.code === code);
    return t || { name: code, badge: 'badge-gray' };
  },

  condName(code) {
    const c = this.condOptions.find(x => x.code === code);
    return c ? c.name : code;
  },

  plantName(code) {
    const p = this.plantOptions.find(x => x.code === code);
    return p ? p.name : code;
  },

  allPoints(s) {
    return s.conds.reduce((arr, c) => arr.concat(c.points.map(p => ({ cond: c, point: p }))), []);
  },

  // 已启动的条件（未入箱的条件不参与进度与超期判定）
  activeConds(s) {
    return s.conds.filter(c => c.status !== 'NOT_STARTED' && c.status !== 'CANCELLED');
  },

  allPointRows() {
    const out = [];
    this.studies.forEach(s => this.allPoints(s).forEach(r => out.push(Object.assign({ study: s }, r))));
    return out;
  },

  pointStatus(s, c, p) {
    if (p.skip) return 'SKIPPED';
    if (p.batch) return p.verdict ? 'DONE' : 'TESTING';
    if (p.sampledDate) return 'TESTING';
    const today = _today();
    if (today > _addDays(p.planDate, s.windowDays || 0)) return 'OVERDUE';
    if (today >= p.planDate) return 'DUE';
    return 'PLANNED';
  },

  isTerminal(s, c, p) {
    const st = this.pointStatus(s, c, p);
    return st === 'DONE' || st === 'SKIPPED';
  },

  progress(s) {
    const rows = this.activeConds(s).reduce((arr, c) => arr.concat(c.points.map(p => ({ cond: c, point: p }))), []);
    const done = rows.filter(r => this.pointStatus(s, r.cond, r.point) === 'DONE').length;
    const over = rows.filter(r => this.pointStatus(s, r.cond, r.point) === 'OVERDUE').length;
    return { done: done, total: rows.length, over: over };
  },

  nextPoint(s) {
    const rows = this.activeConds(s).reduce((arr, c) => arr.concat(c.points.map(p => ({ cond: c, point: p }))), [])
      .filter(r => !this.isTerminal(s, r.cond, r.point));
    rows.sort((a, b) => String(a.point.planDate).localeCompare(String(b.point.planDate)));
    return rows[0] || null;
  },

  sampleOf(s, condCode) {
    return (s.samples || []).find(x => x.cond === condCode) || null;
  },

  remain(sm) { return Math.max(0, sm.qty - sm.used); },

  planTotal(s) {
    return s.conds.reduce((sum, c) => sum + Math.ceil(c.points.length * s.qtyPerPoint * (1 + s.backupRate)), 0);
  },

  stockTotal(s) {
    return (s.samples || []).reduce((sum, x) => sum + x.qty, 0);
  },

  usedTotal(s) {
    return (s.samples || []).reduce((sum, x) => sum + x.used, 0);
  },

  condMeta(code) { return this.condStatusMeta[code] || { name: code, badge: 'badge-gray' }; },
  pointMeta(code) { return this.pointStatusMeta[code] || { name: code, badge: 'badge-gray' }; },
  statusMeta(code) { return this.masterStatusMeta[code] || { name: code, badge: 'badge-gray' }; },

  _log(s, action, note) {
    s.logs = s.logs || [];
    s.logs.unshift({ time: _now(), action: action, by: '当前用户', note: note || '' });
  },

  // ==================== 页面骨架 ====================

  render() {
    this._seed();
    this.page = 1;
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div style="font-size:18px;font-weight:700;">稳定性研究</div>
          <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
            onclick="StabilityPlan.openCreate()">+ 新建研究</button>
        </div>
        <div id="spFilterBar" style="flex-shrink:0;"></div>
        <div class="table-wrapper" id="spTableWrapper" style="flex:1;overflow:auto;width:100%;min-width:0;"></div>
        <div id="spPagination" style="flex-shrink:0;"></div>
      </div>`;
  },

  init() {
    this._seed();
    this.renderFilterBar();
    if (window.QueryVariant) {
      QueryVariant.mount('stability-plan');
      QueryVariant.restore('stability-plan');
      QueryVariant.bindRecent('stability-plan');
    }
    this.renderTable();
    this.renderPagination();
  },

  _val(id) {
    const e = document.getElementById(id);
    return e ? String(e.value || '').trim() : '';
  },

  search() {
    this.page = 1;
    this.renderTable();
    this.renderPagination();
    if (window.QueryVariant) {
      QueryVariant.saveAuto('stability-plan');
      QueryVariant.recordUsed('stability-plan');
    }
  },

  toggleMore() { this.moreOpen = !this.moreOpen; this.renderFilterBar(); },

  // ==================== 筛选栏 ====================

  renderFilterBar() {
    const el = document.getElementById('spFilterBar');
    if (!el) return;

    const typeOpts = this.typeOptions.map(t => `<option value="${t.code}">${t.name}</option>`).join('');
    const statusOpts = Object.keys(this.masterStatusMeta)
      .map(k => `<option value="${k}">${this.masterStatusMeta[k].name}</option>`).join('');
    const plantOpts = this.plantOptions.map(p => `<option value="${p.code}">${p.code} ${p.name}</option>`).join('');

    const more = this.moreOpen ? `
      <div class="filter-group"><label>物料编码</label><input type="text" id="spMaterial" placeholder="如 MAT-20002"></div>
      <div class="filter-group"><label>负责人</label><input type="text" id="spOwner" placeholder="如 李工"></div>
      <div class="filter-group"><label>时间点</label><select id="spDue">
        <option value="">全部</option>
        <option value="OVERDUE">有超期</option>
        <option value="SOON">30 天内到期</option>
      </select></div>` : '';

    el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
      <div class="filter-group"><label>研究编号 / 名称 / 物料</label><input type="text" id="spKeyword" placeholder="如 STB-26001 或 布洛芬"></div>
      <div class="filter-group"><label>研究类型</label><select id="spType"><option value="">全部</option>${typeOpts}</select></div>
      <div class="filter-group"><label>状态</label><select id="spStatus"><option value="">全部</option>${statusOpts}</select></div>
      <div class="filter-group"><label>工厂</label><select id="spPlant"><option value="">全部</option>${plantOpts}</select></div>
      ${more}
      ${FilterActions.render({
        pageId: 'stability-plan',
        scope: 'StabilityPlan',
        onExport: 'exportData',
        onMore: 'toggleMore',
        moreOpen: this.moreOpen
      })}
    </div>`;
  },

  _apply() {
    const kw = this._val('spKeyword').toLowerCase();
    const type = this._val('spType');
    const status = this._val('spStatus');
    const plant = this._val('spPlant');
    const material = this._val('spMaterial').toLowerCase();
    const owner = this._val('spOwner');
    const due = this._val('spDue');
    const today = _today();

    this.filtered = this.studies.filter(s => {
      if (type && s.type !== type) return false;
      if (status && s.status !== status) return false;
      if (plant && s.plant !== plant) return false;
      if (material && String(s.materialCode).toLowerCase().indexOf(material) < 0) return false;
      if (owner && String(s.owner).indexOf(owner) < 0) return false;
      if (kw) {
        const hay = [s.no, s.name, s.materialCode, s.materialName, s.batchNo, s.protocolNo].join(' ').toLowerCase();
        if (hay.indexOf(kw) < 0) return false;
      }
      if (due) {
        const rows = this.activeConds(s).reduce((arr, c) => arr.concat(c.points.map(p => ({ cond: c, point: p }))), [])
          .filter(r => !this.isTerminal(s, r.cond, r.point));
        const hitOver = rows.some(r => this.pointStatus(s, r.cond, r.point) === 'OVERDUE');
        const hitSoon = rows.some(r => {
          const d = _diffDays(r.point.planDate, today);
          return d >= 0 && d <= 30;
        });
        if (due === 'OVERDUE' && !hitOver) return false;
        if (due === 'SOON' && !hitSoon) return false;
      }
      return true;
    });
  },

  // ==================== 列表 ====================

  renderTable() {
    const el = document.getElementById('spTableWrapper');
    if (!el) return;
    this._apply();

    if (!this.filtered.length) {
      el.innerHTML = `<div style="padding:48px 0;text-align:center;color:var(--text-muted);font-size:13px;">暂无稳定性研究</div>`;
      return;
    }

    const start = (this.page - 1) * this.pageSize;
    const rows = this.filtered.slice(start, start + this.pageSize);

    el.innerHTML = `<table class="data-table" style="min-width:1480px;">
      <thead><tr>
        <th style="width:50px;">序号</th>
        <th style="width:140px;">研究编号</th>
        <th style="width:280px;">研究名称</th>
        <th style="width:100px;">类型</th>
        <th style="width:210px;">物料 / 批次</th>
        <th style="width:120px;">工厂</th>
        <th style="width:130px;">考察条件</th>
        <th style="width:130px;">进度</th>
        <th style="width:190px;">下一时间点</th>
        <th style="width:100px;">状态</th>
        <th style="width:90px;">操作</th>
      </tr></thead>
      <tbody>${rows.map((s, i) => this._rowHtml(s, start + i + 1)).join('')}</tbody>
    </table>`;
  },

  _rowHtml(s, seq) {
    const tm = this.typeMeta(s.type);
    const sm = this.statusMeta(s.status);
    const pg = this.progress(s);
    const np = this.nextPoint(s);
    const today = _today();

    const condHtml = s.conds.map(c => {
      const cm = this.condMeta(c.status);
      const cls = c.status === 'RUNNING' ? 'badge-green' : c.status === 'SUSPENDED' ? 'badge-yellow' : 'badge-gray';
      return `<span class="badge ${cls} badge-sm" title="${esc(this.condName(c.code))} · ${esc(cm.name)}">${esc(c.code)}</span>`;
    }).join(' ');

    let nextHtml = '<span style="color:var(--text-muted);">—</span>';
    if (np) {
      const d = _diffDays(np.point.planDate, today);
      let extra = '';
      if (d < 0) extra = `<div style="color:#dc2626;font-size:11px;">已超期 ${-d} 天</div>`;
      else if (d <= 30) extra = `<div style="color:#b45309;font-size:11px;">${d} 天后</div>`;
      nextHtml = `<span style="font-size:12px;">${np.point.month} 月 · ${esc(np.point.planDate)}</span>${extra}`;
    }

    return `<tr>
      <td style="color:var(--text-muted);font-size:12px;">${seq}</td>
      <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(s.no)}
        ${s.protocolNo ? `<div style="font-family:inherit;font-weight:400;font-size:11px;color:var(--text-muted);">${esc(s.protocolNo)}${this.batchLabel(s) ? ' · ' + this.batchLabel(s) : ''}</div>` : ''}</td>
      <td style="font-size:13px;">${esc(s.name)}</td>
      <td><span class="badge ${tm.badge} badge-sm">${esc(tm.name)}</span></td>
      <td style="font-size:12px;">${esc(s.materialName)}
        <div style="font-family:monospace;font-size:11px;color:var(--text-muted);">${esc(s.batchNo || '—')}</div></td>
      <td style="font-size:12px;">${esc(s.plant)} ${esc(this.plantName(s.plant))}</td>
      <td>${condHtml}</td>
      <td style="font-size:12px;">${pg.total ? `${pg.done}/${pg.total} 点` : '<span style="color:var(--text-muted);">未启动</span>'}
        ${pg.over ? `<div style="color:#dc2626;font-size:11px;">超期 ${pg.over} 点</div>` : ''}</td>
      <td>${nextHtml}</td>
      <td><span class="badge ${sm.badge}">${esc(sm.name)}</span></td>
      <td><button class="btn btn-blue btn-sm" onclick="StabilityPlan.openDetail('${s.id}')">查看</button></td>
    </tr>`;
  },

  renderPagination() {
    const el = document.getElementById('spPagination');
    if (!el) return;
    const total = this.filtered.length;
    const pages = Math.max(1, Math.ceil(total / this.pageSize));
    el.innerHTML = `<div class="pagination">
      <span style="color:var(--text-muted);font-size:12px;margin-right:12px;">共 ${total} 条</span>
      <button class="pagination-btn" onclick="StabilityPlan.prevPage()" ${this.page <= 1 ? 'disabled' : ''}>‹</button>
      <span class="pagination-info">第 ${this.page} / ${pages} 页</span>
      <button class="pagination-btn" onclick="StabilityPlan.nextPage()" ${this.page >= pages ? 'disabled' : ''}>›</button>
      <select class="page-size-select" onchange="StabilityPlan.changePageSize(this.value)">
        ${[10, 20, 50].map(n => `<option value="${n}" ${n === this.pageSize ? 'selected' : ''}>${n}条/页</option>`).join('')}
      </select>
    </div>`;
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); this.renderPagination(); } },
  nextPage() {
    const pages = Math.ceil(Math.max(this.filtered.length, 1) / this.pageSize);
    if (this.page < pages) { this.page++; this.renderTable(); this.renderPagination(); }
  },
  changePageSize(n) { this.pageSize = Number(n); this.page = 1; this.renderTable(); this.renderPagination(); },

  // ==================== 详情弹窗 ====================

  openDetail(id) {
    const s = this.find(id);
    if (!s) return toast('研究未找到');
    this._ctx = { id: id };

    const body = `<div style="padding:2px 0;">
      ${this._detailHeader(s)}
      ${this._statusTrack(s)}
      <div style="display:flex;gap:4px;border-bottom:2px solid var(--border);margin:14px 0 16px;">
        <div class="form-tab active" onclick="StabilityPlan._switchTab(this,'proto')">研究方案</div>
        <div class="form-tab" onclick="StabilityPlan._switchTab(this,'samples')">样品与位置</div>
        <div class="form-tab" onclick="StabilityPlan._switchTab(this,'points')">时间点执行</div>
        <div class="form-tab" onclick="StabilityPlan._switchTab(this,'trend')">趋势</div>
        <div class="form-tab" onclick="StabilityPlan._switchTab(this,'life')">生命周期</div>
      </div>
      <div class="ib-tab-panel active" data-panel="proto">${this._tabProtocol(s)}</div>
      <div class="ib-tab-panel" data-panel="samples">${this._tabSamples(s)}</div>
      <div class="ib-tab-panel" data-panel="points">${this._tabPoints(s)}</div>
      <div class="ib-tab-panel" data-panel="trend">${this._tabTrend(s)}</div>
      <div class="ib-tab-panel" data-panel="life">${this._tabLife(s)}</div>
    </div>`;

    showModal(`稳定性研究 — ${s.no}`, body, this._detailFooter(s), 'modal-xl');
    setTimeout(() => StabilityPlan.drawTrendChart(), 0);
  },

  _detailFooter(s) {
    const btns = [];
    if (s.status === 'DRAFT') {
      btns.push({ text: '登记立项', cls: 'btn-primary', action: () => { StabilityPlan.openApprove(); } });
    } else if (s.status === 'READY') {
      btns.push({ text: '备样入箱', cls: 'btn-primary', action: () => { StabilityPlan.openStockInAll(); } });
    } else if (s.status === 'RUNNING') {
      if (s.conds.some(c => c.status === 'NOT_STARTED')) {
        btns.push({ text: '备样入箱', cls: 'btn-primary', action: () => { StabilityPlan.openStockInAll(); } });
      }
      btns.push({ text: '停用研究', cls: 'btn-secondary', action: () => { StabilityPlan.openSuspendAll(); } });
      btns.push({ text: '完成研究', cls: 'btn-secondary', action: () => { StabilityPlan.completeStudy(); } });
    } else if (s.status === 'SUSPENDED') {
      btns.push({ text: '恢复研究', cls: 'btn-primary', action: () => { StabilityPlan.resumeAll(); } });
    }
    if (s.status !== 'COMPLETED' && s.status !== 'CANCELLED') {
      btns.push({ text: '取消研究', cls: 'btn-secondary', action: () => { StabilityPlan.openCancel(); } });
    }
    btns.push({ text: '关闭', cls: 'btn-secondary', action: closeModal });
    return btns;
  },

  _detailHeader(s) {
    const tm = this.typeMeta(s.type);
    const sm = this.statusMeta(s.status);
    return `<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
      <span style="font-size:18px;font-weight:700;font-family:monospace;color:#1E3A5F;">${esc(s.no)}</span>
      <span class="badge ${sm.badge}">${esc(sm.name)}</span>
      <span class="badge ${tm.badge}">${esc(tm.name)}</span>
      <span style="color:#d1d5db;">|</span>
      <span style="font-size:13px;color:var(--text-secondary);">${esc(s.materialName)}</span>
      <span style="font-size:13px;color:var(--text-muted);">${esc(s.batchNo || '无批次')}</span>
      <span style="font-size:13px;color:var(--text-muted);">${esc(s.plant)} ${esc(this.plantName(s.plant))}</span>
    </div>
    <div style="font-size:13px;color:var(--text-secondary);margin-top:6px;">${esc(s.name)}</div>`;
  },

  _statusTrack(s) {
    const steps = [
      { code: 'DRAFT', name: '草稿' },
      { code: 'READY', name: '待入箱' },
      { code: 'RUNNING', name: '进行中' },
      { code: 'COMPLETED', name: '已完成' }
    ];
    const cur = s.status === 'SUSPENDED' ? 2 : steps.findIndex(x => x.code === s.status);
    const cancelled = s.status === 'CANCELLED';
    const nodes = steps.map((st, i) => {
      const done = !cancelled && i < cur;
      const now = !cancelled && i === cur;
      const bg = done ? '#f0fdf4' : now ? '#eff6ff' : '#f8fafc';
      const bd = done ? '#86efac' : now ? '#bfdbfe' : '#e5e7eb';
      const fg = done ? '#15803d' : now ? '#1d4ed8' : '#94a3b8';
      const mark = done ? '✓' : now ? '●' : i + 1;
      return `<div style="display:flex;align-items:center;flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;background:${bg};border:1px solid ${bd};border-radius:8px;padding:6px 12px;">
          <span style="width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;background:${done ? '#22c55e' : now ? '#3b82f6' : '#cbd5e1'};">${mark}</span>
          <span style="font-size:12px;font-weight:600;color:${fg};">${st.name}${now && s.status === 'SUSPENDED' ? '（已停用）' : ''}</span>
        </div>
        ${i < steps.length - 1 ? '<div style="flex:1;height:1px;background:#e5e7eb;margin:0 6px;"></div>' : ''}
      </div>`;
    }).join('');

    return `<div style="display:flex;align-items:center;gap:2px;margin-top:12px;padding:10px 12px;background:#fff;border:1px solid #eef1f4;border-radius:8px;">
      ${cancelled ? '<span class="badge badge-red">已取消</span>' : nodes}
      <div style="margin-left:auto;font-size:12px;color:var(--text-muted);white-space:nowrap;">开始日期 ${esc(s.startDate)} · 窗口 ±${s.windowDays} 天</div>
    </div>`;
  },

  _switchTab(el, key) {
    const wrap = el.closest('.modal-body') || document;
    wrap.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    wrap.querySelectorAll('.ib-tab-panel').forEach(p => {
      p.classList.toggle('active', p.dataset.panel === key);
    });
  },

  // ---------- 页签一：研究方案 ----------

  _tabProtocol(s) {
    const total = this.planTotal(s);
    const stock = this.stockTotal(s);
    const used = this.usedTotal(s);
    const info = [
      ['研究依据', s.purpose || '—'],
      ['变更单', s.changeNo || '—'],
      ['方案编号', s.protocolNo || '—'],
      ['批准文号', s.approvalNo || '—'],
      ['批准日期', s.approvalDate || '—'],
      ['规格', s.spec || '—'],
      ['上市包装', s.packSpec || '—'],
      ['批数量', s.batchQty || '—'],
      ['负责人', s.owner || '—'],
      ['QA 负责人', s.qaOwner || '—'],
      ['每点用量', s.qtyPerPoint + ' ' + s.unit],
      ['备用系数', (s.backupRate * 100).toFixed(0) + '%']
    ].map(x => `<div><span style="color:var(--text-muted);">${x[0]}：</span>${esc(x[1])}</div>`).join('');

    const calc = `<div style="display:flex;gap:24px;flex-wrap:wrap;align-items:center;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:10px 16px;margin:12px 0;font-size:13px;">
      <span>应备样量 <b style="color:#1E3A5F;">${total} ${esc(s.unit)}</b>
        <span style="color:var(--text-muted);font-size:12px;">（${s.qtyPerPoint} × 时间点数 × 条件数 × ${(1 + s.backupRate).toFixed(2)}）</span></span>
      <span>实备 <b>${stock}</b></span>
      <span>已消耗 <b>${used}</b></span>
      <span>剩余 <b style="color:${stock - used <= s.qtyPerPoint * 2 ? '#dc2626' : '#15803d'};">${stock - used}</b></span>
    </div>`;

    const cards = s.conds.map(c => this._condCard(s, c)).join('');

    const group = this.groupStudies(s.protocolNo);
    const groupHtml = group.length > 1 ? `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px;padding:8px 12px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;font-size:12.5px;">
        <span style="color:var(--text-muted);">同方案 ${esc(s.protocolNo)} · 共 ${group.length} 批</span>
        ${group.map(x => `<span class="badge ${x.id === s.id ? 'badge-blue' : 'badge-gray'} badge-sm" style="${x.id === s.id ? '' : 'cursor:pointer;'}"
          ${x.id === s.id ? '' : `onclick="StabilityPlan.openDetail('${x.id}')"`}>第 ${this.batchIndex(x)} 批 · ${esc(x.batchNo || x.no)}</span>`).join('')}
      </div>` : '';

    return `<div style="font-size:13px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px 24px;padding:14px 16px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;">${info}</div>
      ${groupHtml}
      ${calc}
      <div style="font-size:14px;font-weight:600;margin-bottom:10px;">考察条件</div>
      <div style="display:grid;grid-template-columns:repeat(${s.conds.length > 1 ? 2 : 1},1fr);gap:12px;">${cards}</div>`;
  },

  _condCard(s, c) {
    const cm = this.condMeta(c.status);
    const sample = this.sampleOf(s, c.code);
    const locHtml = c.locCode ? SampleLocations.breadcrumbHtml(c.locCode) : '<span style="color:var(--text-muted);">未入箱</span>';

    const chips = c.points.map(p => {
      const st = this.pointStatus(s, c, p);
      const meta = this.pointMeta(st);
      const color = st === 'OVERDUE' ? '#dc2626' : st === 'DUE' ? '#2563eb' : st === 'DONE' ? '#15803d' : st === 'TESTING' ? '#7c3aed' : '#94a3b8';
      return `<span title="${esc(meta.name)} · ${esc(p.planDate)}" style="display:inline-flex;align-items:center;gap:4px;border:1px solid #e5e7eb;border-radius:12px;padding:2px 8px;font-size:11px;color:${color};background:#fff;">
        ${p.month} 月${st === 'DONE' ? ' ✓' : st === 'OVERDUE' ? ' !' : st === 'TESTING' ? ' ⋯' : ''}
      </span>`;
    }).join('');

    const acts = [];
    if (c.status === 'NOT_STARTED' && s.status !== 'DRAFT' && s.status !== 'CANCELLED') {
      acts.push(`<button class="btn btn-primary btn-sm" onclick="StabilityPlan.openStockIn('${s.id}','${c.code}')">入箱</button>`);
    }
    if (c.status === 'RUNNING') {
      acts.push(`<button class="btn btn-secondary btn-sm" onclick="StabilityPlan.openSuspendCond('${s.id}','${c.code}')">停用</button>`);
    }
    if (c.status === 'SUSPENDED') {
      acts.push(`<button class="btn btn-primary btn-sm" onclick="StabilityPlan.resumeCond('${s.id}','${c.code}')">恢复</button>`);
    }

    const suspend = c.suspend ? `<div style="margin-top:8px;font-size:12px;color:#b45309;">停用 ${esc(c.suspend.date)}：${esc(c.suspend.reason)}</div>` : '';

    return `<div style="border:1px solid #e5e7eb;border-radius:10px;padding:12px 14px;background:#fff;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span style="font-size:13px;font-weight:700;">${esc(this.condName(c.code))}</span>
        <span class="badge ${cm.badge} badge-sm">${esc(cm.name)}</span>
        <div style="margin-left:auto;display:flex;gap:6px;">${acts.join('')}</div>
      </div>
      <div style="font-size:12px;color:var(--text-secondary);display:flex;gap:16px;flex-wrap:wrap;margin-bottom:8px;">
        <span>箱 / 位置：${locHtml}</span>
        ${sample ? `<span>样品 ${esc(sample.no)}：${sample.qty - sample.used}/${sample.qty} ${esc(sample.unit)}</span>` : '<span>无样品</span>'}
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;">${chips}</div>
      <div style="font-size:12px;color:var(--text-muted);">检验项目：${esc(c.items.join('、'))}</div>
      ${suspend}
    </div>`;
  },

  // ---------- 页签二：样品与位置 ----------

  _tabSamples(s) {
    const list = s.samples || [];
    if (!list.length) {
      return `<div style="padding:36px 0;text-align:center;color:var(--text-muted);font-size:13px;">尚未备样入箱</div>`;
    }

    const rows = list.map(sm => {
      const remain = this.remain(sm);
      const st = remain <= 0 ? '<span class="badge badge-gray badge-sm">已用尽</span>' : '<span class="badge badge-green badge-sm">在库</span>';
      return `<tr>
        <td style="font-family:monospace;font-size:12px;">${esc(sm.no)}</td>
        <td>${esc(this.condName(sm.cond))}</td>
        <td style="font-size:12px;">${sm.qty} / <b>${sm.used}</b> / ${remain} ${esc(sm.unit)}</td>
        <td>${SampleLocations.breadcrumbHtml(sm.locCode)}</td>
        <td style="font-size:12px;">${esc(sm.inDate)}</td>
        <td>${st}</td>
        <td><div class="table-actions">
          <button class="btn btn-secondary btn-sm" onclick="StabilityPlan.openMove('${sm.id}')">移库</button>
          <button class="btn btn-secondary btn-sm" onclick="StabilityPlan.openConsume('${sm.id}')">消耗</button>
        </div></td>
      </tr>`;
    }).join('');

    const moves = [];
    list.forEach(sm => (sm.moves || []).forEach(m => moves.push(Object.assign({ sampleNo: sm.no }, m))));
    moves.sort((a, b) => String(b.time).localeCompare(String(a.time)));
    const moveRows = moves.length ? moves.map(m => `<tr>
        <td style="font-size:12px;">${esc(m.time)}</td>
        <td style="font-family:monospace;font-size:12px;">${esc(m.sampleNo)}</td>
        <td>${SampleLocations.breadcrumbHtml(m.from)}</td>
        <td>${SampleLocations.breadcrumbHtml(m.to)}</td>
        <td>${esc(m.by)}</td>
        <td style="font-size:12px;">${esc(m.reason)}</td>
      </tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">无移动记录</td></tr>';

    return `<table class="data-table" style="min-width:1000px;">
        <thead><tr><th>样品编号</th><th style="width:150px;">条件</th><th style="width:150px;">备样 / 已耗 / 剩余</th><th style="width:280px;">位置</th><th style="width:110px;">入箱日期</th><th style="width:90px;">状态</th><th style="width:150px;">操作</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="font-size:14px;font-weight:600;margin:18px 0 8px;">移动流水</div>
      <table class="data-table" style="min-width:1000px;">
        <thead><tr><th style="width:140px;">时间</th><th style="width:180px;">样品编号</th><th style="width:220px;">原位置</th><th style="width:220px;">新位置</th><th style="width:80px;">操作人</th><th>原因</th></tr></thead>
        <tbody>${moveRows}</tbody>
      </table>`;
  },

  // ---------- 页签三：时间点执行 ----------

  _tabPoints(s) {
    const rows = [];
    s.conds.forEach(c => c.points.forEach(p => rows.push({ c: c, p: p })));
    rows.sort((a, b) => String(a.p.planDate).localeCompare(String(b.p.planDate)) || a.c.code.localeCompare(b.c.code));

    const body = rows.map(r => {
      const st = this.pointStatus(s, r.c, r.p);
      const meta = this.pointMeta(st);
      const winEnd = _addDays(r.p.planDate, s.windowDays || 0);
      const verdict = r.p.verdict
        ? `<span class="badge ${r.p.verdict === 'PASS' ? 'badge-green' : r.p.verdict === 'OOT' ? 'badge-yellow' : 'badge-red'} badge-sm">${esc(r.p.verdict)}</span>`
        : '<span style="color:var(--text-muted);">—</span>';
      const acts = this._pointActions(s, r.c, r.p, st);
      return `<tr>
        <td style="font-size:12px;">${esc(this.condName(r.c.code))}</td>
        <td style="font-size:12px;font-weight:600;">${r.p.month} 月</td>
        <td style="font-size:12px;">${esc(r.p.planDate)}</td>
        <td style="font-size:11px;color:var(--text-muted);">${esc(winEnd)}</td>
        <td><span class="badge ${meta.badge} badge-sm">${esc(meta.name)}</span></td>
        <td style="font-size:12px;">${esc(r.p.date || '—')}</td>
        <td style="font-family:monospace;font-size:12px;">${esc(r.p.batch || '—')}</td>
        <td>${verdict}</td>
        <td style="font-size:11px;color:var(--text-muted);max-width:200px;">${esc(r.p.note || '')}</td>
        <td><div class="table-actions">${acts}</div></td>
      </tr>`;
    }).join('');

    return `<table class="data-table" style="min-width:1180px;">
      <thead><tr>
        <th style="width:160px;">条件</th><th style="width:70px;">时间点</th><th style="width:110px;">计划日期</th>
        <th style="width:100px;">窗口截止</th><th style="width:90px;">状态</th><th style="width:110px;">实际取样</th>
        <th style="width:140px;">检验批号</th><th style="width:80px;">结论</th><th>备注</th><th style="width:190px;">操作</th>
      </tr></thead>
      <tbody>${body}</tbody>
    </table>`;
  },

  _pointActions(s, c, p, st) {
    const btns = [];
    const act = (label, cls, call, reason) => {
      if (reason) return `<button class="btn ${cls} btn-sm" onclick="toast('${reason}')">${label}</button>`;
      return `<button class="btn ${cls} btn-sm" onclick="${call}">${label}</button>`;
    };
    const terminal = st === 'DONE' || st === 'SKIPPED';
    const locked = s.status === 'CANCELLED' || s.status === 'DRAFT' || c.status === 'CANCELLED';

    if (!terminal) {
      if (st === 'PLANNED' || st === 'DUE' || st === 'OVERDUE') {
        btns.push(act('取样出箱', 'btn-primary', `StabilityPlan.openSampling('${s.id}','${c.code}',${p.month})`,
          locked ? '研究未立项或该条件未启动，不能取样' : ''));
        btns.push(act('跳过', 'btn-secondary', `StabilityPlan.openSkip('${s.id}','${c.code}',${p.month})`,
          locked ? '研究未立项或该条件未启动，不能跳过时间点' : ''));
      } else if (st === 'TESTING') {
        btns.push(act('录入结论', 'btn-primary', `StabilityPlan.openResult('${s.id}','${c.code}',${p.month})`, ''));
      }
    } else {
      btns.push(`<button class="btn btn-blue btn-sm" onclick="StabilityPlan.openPointView('${s.id}','${c.code}',${p.month})">查看</button>`);
    }
    return btns.join('');
  },

  // ---------- 页签五：生命周期 ----------

  _tabLife(s) {
    const logs = (s.logs || []).map(l => `<tr>
      <td style="font-size:12px;width:150px;">${esc(l.time)}</td>
      <td style="width:130px;"><span class="badge badge-gray badge-sm">${esc(l.action)}</span></td>
      <td style="width:100px;font-size:12px;">${esc(l.by)}</td>
      <td style="font-size:12px;">${esc(l.note || '')}</td>
    </tr>`).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);">无记录</td></tr>';

    return `<table class="data-table" style="min-width:900px;">
      <thead><tr><th>时间</th><th>动作</th><th>操作人</th><th>说明</th></tr></thead>
      <tbody>${logs}</tbody>
    </table>`;
  },

  // ---------- 页签四：趋势 ----------

  _resultRows(s) {
    const SD = typeof StabilityData !== 'undefined' ? StabilityData : null;
    if (!SD || !SD.resultData) return [];
    return SD.resultData.filter(r => r.studyNo === s.no);
  },

  _trendItemMeta() {
    const SD = typeof StabilityData !== 'undefined' ? StabilityData : null;
    return SD && SD.itemMeta ? SD.itemMeta : {};
  },

  _tabTrend(s) {
    const rows = this._resultRows(s);
    const meta = this._trendItemMeta();
    const keys = Object.keys(meta).filter(k => rows.some(r => r[k] !== '' && r[k] != null));
    if (!rows.length || !keys.length) {
      return `<div style="padding:44px 0;text-align:center;color:var(--text-muted);font-size:13px;">暂无检验结果，取样并录入结论后在此形成趋势</div>`;
    }
    const cur = keys.indexOf('related') >= 0 ? 'related' : keys[0];
    this._ctx.trendItem = cur;
    const opts = keys.map(k => `<option value="${k}">${esc(meta[k].name)}</option>`).join('');
    return `<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div class="filter-group" style="margin:0;"><label>检验项目</label>
          <select id="spTrendItem" onchange="StabilityPlan.drawTrendChart()">${opts}</select></div>
      </div>
      <div id="spTrendBox"></div>`;
  },

  drawTrendChart() {
    const box = document.getElementById('spTrendBox');
    const s = this.find(this._ctx.id);
    if (!box || !s) return;
    const key = this._val('spTrendItem') || this._ctx.trendItem || 'related';
    this._ctx.trendItem = key;
    box.innerHTML = this._trendBlock(s, key);
  },

  _trendBlock(s, key) {
    const meta = this._trendItemMeta()[key];
    if (!meta) return '';
    const rows = this._resultRows(s).filter(r => r[key] !== '' && r[key] != null);
    const series = this.condOptions.map(c => ({
      name: c.name,
      color: c.code === 'LT' ? '#1E3A5F' : '#94a3b8',
      dash: c.code === 'LT' ? '' : '6,4',
      pts: rows.filter(r => r.cond === c.code).sort((a, b) => a.point - b.point)
        .map(r => ({ m: Number(r.point), v: Number(r[key]), verdict: r.verdict }))
    })).filter(x => x.pts.length);
    return this._chart(series, meta);
  },

  // 同方案多批并列：一条线一批（A+ 聚合键 = 方案编号）
  _groupTrendBlock(protocolNo, key, condCode) {
    const meta = this._trendItemMeta()[key];
    if (!meta) return '';
    const palette = ['#1E3A5F', '#0f766e', '#b45309', '#6d28d9', '#94a3b8'];
    const series = this.groupStudies(protocolNo).map((s, i) => ({
      name: '第 ' + this.batchIndex(s) + ' 批 · ' + (s.batchNo || s.no),
      color: palette[i % palette.length],
      dash: '',
      pts: this._resultRows(s).filter(r => r.cond === condCode && r[key] !== '' && r[key] != null)
        .sort((a, b) => a.point - b.point)
        .map(r => ({ m: Number(r.point), v: Number(r[key]), verdict: r.verdict }))
    })).filter(x => x.pts.length);
    if (!series.length) {
      return `<div style="padding:36px 0;text-align:center;color:var(--text-muted);font-size:13px;">该条件下同方案批次暂无结果</div>`;
    }
    return this._chart(series, meta);
  },

  // 折线图渲染：series = [{ name, color, dash, pts:[{m,v,verdict}] }]
  _chart(series, meta) {
    if (!series || !series.length) {
      return `<div style="padding:36px 0;text-align:center;color:var(--text-muted);font-size:13px;">该项目暂无结果</div>`;
    }

    const months = [];
    series.forEach(x => x.pts.forEach(p => { if (months.indexOf(p.m) < 0) months.push(p.m); }));
    months.sort((a, b) => a - b);

    const vals = [];
    series.forEach(x => x.pts.forEach(p => vals.push(p.v)));
    const lo = Math.min.apply(null, vals.concat(meta.lower != null ? [meta.lower] : []));
    const hi = Math.max.apply(null, vals.concat(meta.upper != null ? [meta.upper] : []));
    const pad = (hi - lo) * 0.2 || Math.abs(hi) * 0.1 || 1;
    const yMin = lo - pad, yMax = hi + pad;

    const W = 880, H = 330, L = 66, R = 96, T = 30, B = 44;
    const n = months.length;
    const xi = m => L + (n === 1 ? (W - L - R) / 2 : months.indexOf(m) * (W - L - R) / (n - 1));
    const yi = v => T + (yMax - v) / (yMax - yMin) * (H - T - B);
    const out = v => (meta.upper != null && v > meta.upper) || (meta.lower != null && v < meta.lower);

    let g = '';
    for (let k = 0; k <= 4; k++) {
      const v = yMin + (yMax - yMin) * k / 4;
      g += `<line x1="${L}" y1="${yi(v)}" x2="${W - R}" y2="${yi(v)}" stroke="#eef1f4" stroke-width="1"/>`
        + `<text x="${L - 10}" y="${yi(v) + 4}" text-anchor="end" font-size="11" fill="#94a3b8">${v.toFixed(2)}</text>`;
    }
    if (meta.upper != null) {
      g += `<line x1="${L}" y1="${yi(meta.upper)}" x2="${W - R}" y2="${yi(meta.upper)}" stroke="#dc2626" stroke-width="1.2" stroke-dasharray="6,4"/>`
        + `<text x="${W - R + 8}" y="${yi(meta.upper) + 4}" font-size="11" fill="#dc2626">上限 ${meta.upper}</text>`;
    }
    if (meta.lower != null) {
      g += `<line x1="${L}" y1="${yi(meta.lower)}" x2="${W - R}" y2="${yi(meta.lower)}" stroke="#dc2626" stroke-width="1.2" stroke-dasharray="6,4"/>`
        + `<text x="${W - R + 8}" y="${yi(meta.lower) + 4}" font-size="11" fill="#dc2626">下限 ${meta.lower}</text>`;
    }
    months.forEach(m => {
      g += `<text x="${xi(m)}" y="${H - B + 22}" text-anchor="middle" font-size="11" fill="#94a3b8">${m} 月</text>`;
    });

    series.forEach(x => {
      const dash = x.dash ? ` stroke-dasharray="${x.dash}"` : '';
      if (x.pts.length > 1) {
        g += `<polyline points="${x.pts.map(p => xi(p.m) + ',' + yi(p.v)).join(' ')}" fill="none" stroke="${x.color}" stroke-width="2"${dash}/>`;
      }
      x.pts.forEach(p => {
        const bad = out(p.v) || p.verdict === 'OOT' || p.verdict === 'OOS';
        g += `<circle cx="${xi(p.m)}" cy="${yi(p.v)}" r="4.5" fill="${bad ? '#fff' : x.color}" stroke="${bad ? '#dc2626' : '#fff'}" stroke-width="${bad ? 2 : 1.5}"/>`;
        if (series.length === 1) {
          g += `<text x="${xi(p.m)}" y="${yi(p.v) - 10}" text-anchor="middle" font-size="11" font-weight="600" fill="${bad ? '#dc2626' : '#1e293b'}">${p.v}</text>`;
        }
      });
    });

    g += `<line x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}" stroke="#cbd5e1" stroke-width="1.2"/>`
      + `<line x1="${L}" y1="${T}" x2="${L}" y2="${H - B}" stroke="#cbd5e1" stroke-width="1.2"/>`;

    const legend = series.map(x => `<span style="display:inline-flex;align-items:center;gap:6px;margin-right:18px;font-size:12px;color:var(--text-secondary);">
        <span style="width:14px;height:2px;background:${x.color};display:inline-block;"></span>${esc(x.name)}</span>`).join('');

    const fmt = v => (Math.round(v * 100) / 100).toFixed(2);
    const lines = series.map(x => {
      const first = x.pts[0], last = x.pts[x.pts.length - 1];
      const d = last.v - first.v;
      const bads = x.pts.filter(p => out(p.v) || p.verdict === 'OOT' || p.verdict === 'OOS');
      return `<div><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${x.color};margin-right:6px;"></span>${esc(x.name)}：${first.m} 月 ${fmt(first.v)}${esc(meta.unit)} → ${last.m} 月 ${fmt(last.v)}${esc(meta.unit)}
        <span style="color:${Math.abs(d) < 1e-9 ? 'var(--text-muted)' : '#b45309'};">（${d > 0 ? '+' : ''}${fmt(d)}）</span>
        ${bads.length ? `<span style="color:#dc2626;font-weight:600;margin-left:8px;">${bads.map(b => b.m + ' 月点异常').join('、')}</span>` : ''}</div>`;
    }).join('');

    return `<div style="border:1px solid var(--border);border-radius:8px;padding:10px 6px 4px;background:#fff;">
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;">${g}</svg>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;flex-wrap:wrap;gap:8px;">
        <div>${legend}</div>
        <div style="font-size:12px;color:var(--text-muted);">${esc(meta.name)}${meta.unit ? '（' + esc(meta.unit) + '）' : ''}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:5px;margin-top:10px;font-size:12.5px;color:var(--text-secondary);">${lines}</div>`;
  },

  // ==================== 动作：立项 / 入箱 ====================

  openApprove() {
    const s = this.find(this._ctx.id);
    showModal('研究立项 — ' + s.no, `
      <div style="padding:4px 0;display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
        <div class="form-group"><label>方案编号 <span class="req">*</span></label><input type="text" id="apProto" value="${esc(s.protocolNo)}" placeholder="如 ST-P-2026-001"></div>
        <div class="form-group"><label>批准文号 <span class="req">*</span></label><input type="text" id="apNo" value="${esc(s.approvalNo)}" placeholder="纸质 / eQMS 批准文号"></div>
        <div class="form-group"><label>批准日期 <span class="req">*</span></label><input type="date" id="apDate" value="${esc(s.approvalDate || s.startDate)}"></div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认立项', cls: 'btn-primary', action: () => { StabilityPlan.saveApprove(); } }
    ], 'modal-lg');
  },

  saveApprove() {
    const s = this.find(this._ctx.id);
    const proto = this._val('apProto');
    const no = this._val('apNo');
    const date = this._val('apDate');
    if (!proto || !no || !date) return toast('请填写方案编号、批准文号与批准日期');
    s.protocolNo = proto;
    s.approvalNo = no;
    s.approvalDate = date;
    s.status = 'READY';
    this._log(s, '研究立项', '方案 ' + proto + '，批准文号 ' + no);
    closeModal();
    this.openDetail(s.id);
    this.renderTable();
    toast('已立项，下一步为备样入箱');
  },

  openStockInAll() {
    const s = this.find(this._ctx.id);
    const pending = s.conds.filter(c => c.status === 'NOT_STARTED');
    if (!pending.length) return toast('所有条件均已入箱');
    this.openStockIn(s.id, pending[0].code);
  },

  openStockIn(studyId, condCode) {
    const s = this.find(studyId);
    const c = s.conds.find(x => x.code === condCode);
    const total = Math.ceil(c.points.length * s.qtyPerPoint * (1 + s.backupRate));
    this._ctx = { id: studyId, cond: condCode };

    showModal('备样入箱 — ' + s.no, `
      <div style="padding:4px 0;">
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;">
          入箱后该条件转为「进行中」；稳定性样品不纳入 SAP 库存。
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;margin-bottom:8px;">
          <div class="form-group"><label>条件</label><input type="text" value="${esc(this.condName(condCode))}" disabled></div>
          <div class="form-group"><label>应备样量</label><input type="text" value="${total} ${esc(s.unit)}" disabled></div>
          <div class="form-group"><label>实备数量 <span class="req">*</span></label><input type="number" id="siQty" value="${total}"></div>
          <div class="form-group"><label>入箱日期 <span class="req">*</span></label><input type="date" id="siDate" value="${esc(s.startDate)}"></div>
        </div>
        <div class="form-group" style="margin-bottom:10px;"><label>存放位置 <span class="req">*</span></label>${SampleLocations.cascadeHtml('siLoc')}</div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认入箱', cls: 'btn-primary', action: () => { StabilityPlan.saveStockIn(); } }
    ], 'modal-xl');

    SampleLocations.bindCascade('siLoc', null, c.locCode || '');
  },

  saveStockIn() {
    const s = this.find(this._ctx.id);
    const c = s.conds.find(x => x.code === this._ctx.cond);
    const qty = Number(this._val('siQty'));
    const date = this._val('siDate');
    const box = document.getElementById('siLoc');
    const locCode = box && box.dataset ? box.dataset.slValue : '';
    if (!qty || qty <= 0) return toast('请填写实备数量');
    if (!date) return toast('请填写入箱日期');
    if (!locCode) return toast('请选择存放位置');

    c.status = 'RUNNING';
    c.locCode = locCode;
    s.samples = s.samples || [];
    s.samples.push({
      id: s.id + '-' + c.code, no: s.no + '-' + c.code + '-01', cond: c.code,
      qty: qty, unit: s.unit, used: 0, locCode: locCode, inDate: date, by: '当前用户',
      status: 'IN_STORAGE', moves: []
    });
    s.status = this._deriveMaster(s);
    this._log(s, '备样入箱', this.condName(c.code) + '：' + qty + ' ' + s.unit + '，位置 ' + SampleLocations.breadcrumbText(locCode));
    closeModal();
    this.openDetail(s.id);
    this.renderTable();
    toast('已入箱，该条件转进行中');
  },

  // ==================== 动作：样品移库 / 消耗 ====================

  _findSample(sampleId) {
    for (const s of this.studies) {
      const sm = (s.samples || []).find(x => x.id === sampleId);
      if (sm) return { study: s, sample: sm };
    }
    return null;
  },

  openMove(sampleId) {
    const hit = this._findSample(sampleId);
    if (!hit) return;
    this._ctx = { sampleId: sampleId };
    showModal('样品移库 — ' + hit.sample.no, `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:10px 16px;margin-bottom:14px;font-size:13px;">
          当前位置：${SampleLocations.breadcrumbHtml(hit.sample.locCode)}
        </div>
        <div class="form-group" style="margin-bottom:10px;"><label>新位置 <span class="req">*</span></label>${SampleLocations.cascadeHtml('mvLoc')}</div>
        <div class="form-group"><label>移库原因 <span class="req">*</span></label><input type="text" id="mvReason" placeholder="如 温度异常转移 / 箱故障"></div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认移库', cls: 'btn-primary', action: () => { StabilityPlan.saveMove(); } }
    ], 'modal-lg');
    SampleLocations.bindCascade('mvLoc', null, '');
  },

  saveMove() {
    const hit = this._findSample(this._ctx.sampleId);
    const box = document.getElementById('mvLoc');
    const to = box && box.dataset ? box.dataset.slValue : '';
    const reason = this._val('mvReason');
    if (!to) return toast('请选择新位置');
    if (!reason) return toast('请填写移库原因');
    if (to === hit.sample.locCode) return toast('新旧位置相同');
    hit.sample.moves = hit.sample.moves || [];
    hit.sample.moves.unshift({ time: _now(), from: hit.sample.locCode, to: to, by: '当前用户', reason: reason });
    const from = hit.sample.locCode;
    hit.sample.locCode = to;
    const c = hit.study.conds.find(x => x.code === hit.sample.cond);
    if (c) c.locCode = to;
    this._log(hit.study, '样品移库', SampleLocations.breadcrumbText(from) + ' → ' + SampleLocations.breadcrumbText(to) + '（' + reason + '）');
    closeModal();
    this.openDetail(hit.study.id);
    toast('已移库');
  },

  openConsume(sampleId) {
    const hit = this._findSample(sampleId);
    if (!hit) return;
    this._ctx = { sampleId: sampleId };
    showModal('样品消耗 — ' + hit.sample.no, `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:10px 16px;margin-bottom:14px;font-size:13px;">
          剩余 ${this.remain(hit.sample)} ${esc(hit.sample.unit)}
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>消耗数量 <span class="req">*</span></label><input type="number" id="csQty" value="1"></div>
          <div class="form-group"><label>用途 / 原因 <span class="req">*</span></label><input type="text" id="csReason" placeholder="如 OOS 复测 / 破损报废"></div>
        </div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认消耗', cls: 'btn-primary', action: () => { StabilityPlan.saveConsume(); } }
    ], 'modal-lg');
  },

  saveConsume() {
    const hit = this._findSample(this._ctx.sampleId);
    const qty = Number(this._val('csQty'));
    const reason = this._val('csReason');
    if (!qty || qty <= 0) return toast('请填写消耗数量');
    if (!reason) return toast('请填写用途或原因');
    if (qty > this.remain(hit.sample)) return toast('超出剩余数量');
    hit.sample.used += qty;
    this._log(hit.study, '样品消耗', hit.sample.no + '：' + qty + ' ' + hit.sample.unit + '（' + reason + '）');
    closeModal();
    this.openDetail(hit.study.id);
    toast('已登记消耗');
  },

  // ==================== 动作：取样 / 结论 / 跳过 ====================

  _findPoint(studyId, condCode, month) {
    const s = this.find(studyId);
    const c = s.conds.find(x => x.code === condCode);
    return { study: s, cond: c, point: c.points.find(p => p.month === Number(month)) };
  },

  openSampling(studyId, condCode, month) {
    const hit = this._findPoint(studyId, condCode, month);
    this._ctx = { id: studyId, cond: condCode, month: Number(month) };
    const remain = this.sampleOf(hit.study, condCode) ? this.remain(this.sampleOf(hit.study, condCode)) : 0;

    showModal('取样出箱 — ' + hit.study.no + ' ' + month + ' 月点', `
      <div style="padding:4px 0;">
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;">
          取样后生成 89 型手工检验批，结果录入在「检验批管理」；剩余样品 ${remain} ${esc(hit.study.unit)}。
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px 20px;">
          <div class="form-group"><label>条件</label><input type="text" value="${esc(this.condName(condCode))}" disabled></div>
          <div class="form-group"><label>取样数量 <span class="req">*</span></label><input type="number" id="saQty" value="${hit.study.qtyPerPoint}"></div>
          <div class="form-group"><label>取样日期 <span class="req">*</span></label><input type="date" id="saDate" value="${esc(_today())}"></div>
          <div class="form-group"><label>取样人 <span class="req">*</span></label><input type="text" id="saBy" value="李工"></div>
          <div class="form-group"><label>计划日期</label><input type="text" value="${esc(hit.point.planDate)}" disabled></div>
          <div class="form-group"><label>窗口截止</label><input type="text" value="${esc(_addDays(hit.point.planDate, hit.study.windowDays))}" disabled></div>
        </div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认取样', cls: 'btn-primary', action: () => { StabilityPlan.saveSampling(); } }
    ], 'modal-xl');
  },

  saveSampling() {
    const hit = this._findPoint(this._ctx.id, this._ctx.cond, this._ctx.month);
    const qty = Number(this._val('saQty'));
    const date = this._val('saDate');
    const by = this._val('saBy');
    if (!qty || qty <= 0) return toast('请填写取样数量');
    if (!date || !by) return toast('请填写取样日期与取样人');

    const sm = this.sampleOf(hit.study, this._ctx.cond);
    if (sm && qty > this.remain(sm)) return toast('取样数量超出剩余样品');

    hit.point.sampledDate = date;
    hit.point.date = date;
    hit.point.batch = String(100000014400 + this._lotSeq++);
    if (sm) sm.used += qty;
    this._log(hit.study, '取样出箱', this.condName(this._ctx.cond) + ' ' + this._ctx.month + ' 月点，生成检验批 ' + hit.point.batch);
    closeModal();
    this.openDetail(hit.study.id);
    this.renderTable();
    toast('已取样，生成 89 型检验批 ' + hit.point.batch);
  },

  openResult(studyId, condCode, month) {
    const hit = this._findPoint(studyId, condCode, month);
    this._ctx = { id: studyId, cond: condCode, month: Number(month) };
    showModal('录入结论 — ' + month + ' 月点', `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:10px 16px;margin-bottom:14px;font-size:13px;">
          检验批 ${esc(hit.point.batch || '—')} · 结论取自检验批的使用决策。
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>结论 <span class="req">*</span></label><select id="rsVerdict">
            <option value="PASS">PASS 合格</option>
            <option value="OOT">OOT 趋势异常</option>
            <option value="OOS">OOS 超限</option>
          </select></div>
          <div class="form-group"><label>评估 / 偏差单号</label><input type="text" id="rsNote" placeholder="如 DEV-20260915-002"></div>
        </div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认结论', cls: 'btn-primary', action: () => { StabilityPlan.saveResult(); } }
    ], 'modal-lg');
  },

  saveResult() {
    const hit = this._findPoint(this._ctx.id, this._ctx.cond, this._ctx.month);
    const verdict = this._val('rsVerdict');
    const note = this._val('rsNote');
    hit.point.verdict = verdict;
    hit.point.note = note;
    hit.point.date = hit.point.sampledDate || _today();
    this._log(hit.study, '录入结论', this.condName(this._ctx.cond) + ' ' + this._ctx.month + ' 月点：' + verdict + (note ? '（' + note + '）' : ''));

    // 该条件全部时间点终态 → 条件完成
    const c = hit.cond;
    if (c.points.every(p => this.isTerminal(hit.study, c, p))) {
      c.status = 'COMPLETED';
      this._log(hit.study, '条件完成', this.condName(c.code) + ' 全部时间点完成');
    }
    hit.study.status = this._deriveMaster(hit.study);
    closeModal();
    this.openDetail(hit.study.id);
    this.renderTable();
    toast('结论已录入');
  },

  openSkip(studyId, condCode, month) {
    const hit = this._findPoint(studyId, condCode, month);
    this._ctx = { id: studyId, cond: condCode, month: Number(month) };
    showModal('跳过时间点 — ' + month + ' 月点', `
      <div style="padding:4px 0;">
        <div style="display:grid;grid-template-columns:1fr;gap:14px;">
          <div class="form-group"><label>跳过原因 <span class="req">*</span></label><input type="text" id="skReason" placeholder="如 方案修订取消该时间点"></div>
          <div class="form-group"><label>批准文号 <span class="req">*</span></label><input type="text" id="skNo" placeholder="方案变更批准文号"></div>
        </div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认跳过', cls: 'btn-primary', action: () => { StabilityPlan.saveSkip(); } }
    ], 'modal-lg');
  },

  saveSkip() {
    const reason = this._val('skReason');
    const no = this._val('skNo');
    if (!reason || !no) return toast('请填写跳过原因与批准文号');
    const hit = this._findPoint(this._ctx.id, this._ctx.cond, this._ctx.month);
    hit.point.skip = true;
    hit.point.note = reason + '（' + no + '）';
    this._log(hit.study, '时间点跳过', this.condName(this._ctx.cond) + ' ' + this._ctx.month + ' 月点：' + reason);
    closeModal();
    this.openDetail(hit.study.id);
    this.renderTable();
    toast('已跳过该时间点');
  },

  openPointView(studyId, condCode, month) {
    const hit = this._findPoint(studyId, condCode, month);
    const p = hit.point;
    showModal('时间点 — ' + month + ' 月点', `
      <div style="padding:4px 0;font-size:13px;display:grid;grid-template-columns:repeat(2,1fr);gap:10px 24px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:14px 16px;">
        <div><span style="color:var(--text-muted);">条件：</span>${esc(this.condName(condCode))}</div>
        <div><span style="color:var(--text-muted);">时间点：</span>${month} 月</div>
        <div><span style="color:var(--text-muted);">计划日期：</span>${esc(p.planDate)}</div>
        <div><span style="color:var(--text-muted);">实际取样：</span>${esc(p.date || p.sampledDate || '—')}</div>
        <div><span style="color:var(--text-muted);">检验批号：</span>${esc(p.batch || '—')}</div>
        <div><span style="color:var(--text-muted);">结论：</span>${esc(p.verdict || '—')}</div>
        <div style="grid-column:1 / -1;"><span style="color:var(--text-muted);">备注：</span>${esc(p.note || '—')}</div>
      </div>`, [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-lg');
  },

  // ==================== 动作：停用 / 恢复 / 完成 / 取消 ====================

  openSuspendCond(studyId, condCode) {
    this._ctx = { id: studyId, cond: condCode };
    showModal('停用条件 — ' + this.condName(condCode), `
      <div style="padding:4px 0;display:grid;grid-template-columns:1fr;gap:14px;">
        <div class="form-group"><label>停用原因 <span class="req">*</span></label><input type="text" id="scReason" placeholder="如 该条件样品出现 OOS，评估后暂停"></div>
        <div class="form-group"><label>批准文号 <span class="req">*</span></label><input type="text" id="scNo" placeholder="纸质 / eQMS 批准文号"></div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认停用', cls: 'btn-primary', action: () => { StabilityPlan.saveSuspendCond(); } }
    ], 'modal-lg');
  },

  saveSuspendCond() {
    const reason = this._val('scReason');
    const no = this._val('scNo');
    if (!reason || !no) return toast('请填写停用原因与批准文号');
    const s = this.find(this._ctx.id);
    const c = s.conds.find(x => x.code === this._ctx.cond);
    c.status = 'SUSPENDED';
    c.suspend = { date: _today(), by: '当前用户', reason: reason, approvalNo: no };
    s.status = this._deriveMaster(s);
    this._log(s, '条件停用', this.condName(c.code) + '：' + reason);
    closeModal();
    this.openDetail(s.id);
    this.renderTable();
    toast('条件已停用');
  },

  resumeCond(studyId, condCode) {
    const s = this.find(studyId);
    const c = s.conds.find(x => x.code === condCode);
    c.status = 'RUNNING';
    c.suspend = null;
    s.status = this._deriveMaster(s);
    this._log(s, '条件恢复', this.condName(condCode) + ' 恢复考察');
    this.openDetail(s.id);
    this.renderTable();
    toast('条件已恢复');
  },

  openSuspendAll() {
    this._ctx = { id: this._ctx.id };
    showModal('停用研究', `
      <div style="padding:4px 0;display:grid;grid-template-columns:1fr;gap:14px;">
        <div class="form-group"><label>停用原因 <span class="req">*</span></label><input type="text" id="ssReason" placeholder="如 产品工艺变更，原研究暂停"></div>
        <div class="form-group"><label>批准文号 <span class="req">*</span></label><input type="text" id="ssNo" placeholder="纸质 / eQMS 批准文号"></div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认停用', cls: 'btn-primary', action: () => { StabilityPlan.saveSuspendAll(); } }
    ], 'modal-lg');
  },

  saveSuspendAll() {
    const reason = this._val('ssReason');
    const no = this._val('ssNo');
    if (!reason || !no) return toast('请填写停用原因与批准文号');
    const s = this.find(this._ctx.id);
    s.conds.forEach(c => {
      if (c.status === 'RUNNING') {
        c.status = 'SUSPENDED';
        c.suspend = { date: _today(), by: '当前用户', reason: reason, approvalNo: no };
      }
    });
    s.status = this._deriveMaster(s);
    this._log(s, '研究停用', reason + '（' + no + '）');
    closeModal();
    this.openDetail(s.id);
    this.renderTable();
    toast('研究已停用');
  },

  resumeAll() {
    const s = this.find(this._ctx.id);
    s.conds.forEach(c => { if (c.status === 'SUSPENDED') { c.status = 'RUNNING'; c.suspend = null; } });
    s.status = this._deriveMaster(s);
    this._log(s, '研究恢复', '全部停用条件恢复考察');
    this.openDetail(s.id);
    this.renderTable();
    toast('研究已恢复');
  },

  completeStudy() {
    const s = this.find(this._ctx.id);
    const pending = this.allPoints(s).filter(r => !this.isTerminal(s, r.cond, r.point));
    if (pending.length) {
      return toast('仍有 ' + pending.length + ' 个时间点未完成，不能完成研究');
    }
    s.conds.forEach(c => { if (c.status !== 'CANCELLED') c.status = 'COMPLETED'; });
    s.status = 'COMPLETED';
    this._log(s, '研究完成', '全部时间点完成');
    this.openDetail(s.id);
    this.renderTable();
    toast('研究已完成');
  },

  openCancel() {
    showModal('取消研究', `
      <div style="padding:4px 0;display:grid;grid-template-columns:1fr;gap:14px;">
        <div class="form-group"><label>取消原因 <span class="req">*</span></label><input type="text" id="cnReason" placeholder="如 品种退市 / 研究方案作废"></div>
        <div class="form-group"><label>批准文号 <span class="req">*</span></label><input type="text" id="cnNo" placeholder="纸质 / eQMS 批准文号"></div>
      </div>`, [
      { text: '返回', cls: 'btn-secondary', action: closeModal },
      { text: '确认取消', cls: 'btn-danger', action: () => { StabilityPlan.saveCancel(); } }
    ], 'modal-lg');
  },

  saveCancel() {
    const reason = this._val('cnReason');
    const no = this._val('cnNo');
    if (!reason || !no) return toast('请填写取消原因与批准文号');
    const s = this.find(this._ctx.id);
    s.status = 'CANCELLED';
    s.conds.forEach(c => { if (c.status !== 'COMPLETED') c.status = 'CANCELLED'; });
    this._log(s, '研究取消', reason + '（' + no + '）');
    closeModal();
    this.openDetail(s.id);
    this.renderTable();
    toast('研究已取消');
  },

  // ==================== 新建研究 ====================

  openCreate() {
    const cards = [
      { title: '空白新建', emoji: '📝', desc: '手工填写研究信息与条件<br>适用于计划外研究、强制降解试验',
        call: 'StabilityPlan.openCreateForm("blank")', bg: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', border: '#cbd5e1', hover: '#64748b', titleColor: '#334155' },
      { title: '从方案模板', emoji: '📋', desc: '按剂型模板带出条件、时间点与检验项目<br>适用于常规持续稳定性考察',
        call: 'StabilityPlan.openTemplatePick()', bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '#bfdbfe', hover: '#3b82f6', titleColor: '#1e40af' },
      { title: '从往期研究复制', emoji: '🔁', desc: '复制既往研究的方案结构<br>仅带出条件与时间点，不带结果',
        call: 'StabilityPlan.openCopyPick()', bg: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', border: '#ddd6fe', hover: '#8b5cf6', titleColor: '#5b21b6' },
      { title: '从年度考察计划', emoji: '📅', desc: '按年度计划带出品种与批次<br>批量生成当年持续考察研究',
        call: 'StabilityPlan.openAnnualPick()', bg: 'linear-gradient(135deg,#ecfdf5,#d1fae5)', border: '#a7f3d0', hover: '#10b981', titleColor: '#065f46' }
    ];
    const card = c => `
      <div onclick="closeModal();${c.call}"
        style="background:${c.bg};border:1.5px solid ${c.border};border-radius:12px;padding:22px 14px;cursor:pointer;transition:all .22s;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:180px;"
        onmouseenter="this.style.borderColor='${c.hover}';this.style.transform='translateY(-2px)'"
        onmouseleave="this.style.borderColor='${c.border}';this.style.transform='translateY(0)'">
        <div style="font-size:36px;margin-bottom:8px;">${c.emoji}</div>
        <div style="font-size:15px;font-weight:700;color:${c.titleColor};margin-bottom:6px;">${c.title}</div>
        <div style="font-size:12px;color:#4b5563;line-height:1.5;">${c.desc}</div>
      </div>`;

    showModal('选择创建方式', `<div style="padding:8px 0;display:grid;grid-template-columns:repeat(4,1fr);gap:14px;">${cards.map(card).join('')}</div>`,
      [{ text: '取消', cls: 'btn-secondary', action: closeModal }], 'modal-xl');
  },

  openTemplatePick() {
    const items = this.templates.map(t => `<tr>
      <td style="font-weight:600;">${esc(t.name)}</td>
      <td style="font-size:12px;">${t.conds.map(c => esc(this.condName(c))).join(' / ')}</td>
      <td style="font-size:12px;">${t.months.join('/')} 月</td>
      <td style="font-size:12px;">${t.qtyPerPoint} ${esc(t.unit)}/点</td>
      <td><button class="btn btn-primary btn-sm" onclick="closeModal();StabilityPlan.openCreateForm('template','${t.id}')">选用</button></td>
    </tr>`).join('');

    showModal('选择方案模板', `<table class="data-table" style="min-width:900px;">
      <thead><tr><th>模板名称</th><th style="width:260px;">考察条件</th><th style="width:180px;">时间点</th><th style="width:120px;">每点用量</th><th style="width:90px;">操作</th></tr></thead>
      <tbody>${items}</tbody></table>`, [{ text: '返回', cls: 'btn-secondary', action: () => { closeModal(); StabilityPlan.openCreate(); } }], 'modal-xl');
  },

  openCopyPick() {
    const list = this.studies.filter(s => s.status !== 'DRAFT');
    const items = list.map(s => `<tr>
      <td style="font-family:monospace;font-size:12px;">${esc(s.no)}</td>
      <td>${esc(s.name)}</td>
      <td style="font-size:12px;">${s.conds.map(c => esc(c.code)).join(' / ')}</td>
      <td style="font-size:12px;">${esc(s.startDate)}</td>
      <td><button class="btn btn-primary btn-sm" onclick="closeModal();StabilityPlan.openCreateForm('copy','${s.id}')">复制</button></td>
    </tr>`).join('');
    showModal('选择往期研究', `<table class="data-table" style="min-width:900px;">
      <thead><tr><th style="width:140px;">研究编号</th><th>研究名称</th><th style="width:120px;">条件</th><th style="width:110px;">开始日期</th><th style="width:90px;">操作</th></tr></thead>
      <tbody>${items}</tbody></table>`, [{ text: '返回', cls: 'btn-secondary', action: () => { closeModal(); StabilityPlan.openCreate(); } }], 'modal-xl');
  },

  openAnnualPick() {
    const plans = this._annualPlans();
    if (!plans.length) {
      showModal('从年度考察计划生成', `<div style="padding:36px 0;text-align:center;color:var(--text-muted);font-size:13px;">
        当年年度考察计划已全部立项</div>`, [{ text: '返回', cls: 'btn-secondary', action: () => { closeModal(); StabilityPlan.openCreate(); } }], 'modal-lg');
      return;
    }
    const items = plans.map(a => {
      const done = (a.studyNos || []).length;
      return `<tr>
        <td style="font-family:monospace;font-size:12px;">${esc(a.id)}</td>
        <td style="font-size:12px;">${esc(a.year)}</td>
        <td style="font-size:12px;">${esc(a.materialName)}
          <div style="font-family:monospace;font-size:11px;color:var(--text-muted);">${esc(a.materialCode)}</div></td>
        <td style="font-size:12px;">${esc(a.plant)} ${esc(this.plantName(a.plant))}</td>
        <td style="font-size:12px;">${a.batchCount} 批${done ? `<span style="color:var(--text-muted);">（已立 ${done}）</span>` : ''}</td>
        <td><button class="btn btn-primary btn-sm" onclick="closeModal();StabilityPlan.openCreateForm('annual','${a.id}')">立项第 ${done + 1} 批</button></td>
      </tr>`;
    }).join('');
    showModal('从年度考察计划生成', `<table class="data-table" style="min-width:1000px;">
      <thead><tr><th style="width:130px;">计划编号</th><th style="width:70px;">年度</th><th>物料</th><th style="width:200px;">工厂</th><th style="width:120px;">计划批次</th><th style="width:130px;">操作</th></tr></thead>
      <tbody>${items}</tbody></table>`, [{ text: '返回', cls: 'btn-secondary', action: () => { closeModal(); StabilityPlan.openCreate(); } }], 'modal-xl');
  },

  // 年度考察计划由 StabilityAnnual 维护，这里只读未立满的计划
  _annualPlans() {
    if (typeof StabilityAnnual === 'undefined' || !StabilityAnnual.openPlans) return [];
    return StabilityAnnual.openPlans();
  },

  openCreateForm(mode, srcId) {
    let pre = { type: 'CONTINUOUS', conds: ['LT'], months: [0, 3, 6, 9, 12, 18, 24], items: ['性状', '鉴别', '含量测定', '有关物质'],
      qtyPerPoint: 6, unit: '盒', backupRate: 0.2, materialCode: '', materialName: '', plant: '2001', name: '' };

    if (mode === 'template') {
      const t = this.templates.find(x => x.id === srcId);
      pre = Object.assign(pre, { type: t.type, conds: t.conds.slice(), months: t.months.slice(), items: t.items.slice(),
        qtyPerPoint: t.qtyPerPoint, unit: t.unit, backupRate: t.backupRate });
    } else if (mode === 'copy') {
      const s = this.find(srcId);
      pre = Object.assign(pre, { type: s.type, plant: s.plant, materialCode: s.materialCode, materialName: s.materialName,
        name: s.name.replace(/20\d\d 年度/, '2027 年度').replace(/（.*）$/, '') + '（复制）',
        conds: s.conds.map(c => c.code), months: s.conds[0].months.slice(),
        items: s.conds[0].items.slice(), qtyPerPoint: s.qtyPerPoint, unit: s.unit, backupRate: s.backupRate });
    } else if (mode === 'annual') {
      const a = (typeof StabilityAnnual !== 'undefined' && StabilityAnnual.get) ? StabilityAnnual.get(srcId) : null;
      if (a) {
        const t = this.templates.find(x => x.id === a.template) || this.templates[0];
        const n = (a.studyNos || []).length + 1;
        pre = Object.assign(pre, {
          type: a.type || 'CONTINUOUS', plant: a.plant, materialCode: a.materialCode, materialName: a.materialName,
          spec: a.spec || '', packSpec: a.packSpec || '',
          startDate: a.startMonth ? a.startMonth + '-01' : '',
          name: a.materialName + ' ' + a.year + ' 年度第 ' + n + ' 批持续稳定性考察',
          conds: (a.conds && a.conds.length ? a.conds : t.conds).slice(),
          months: (a.months && a.months.length ? a.months : t.months).slice(),
          items: t.items.slice(), qtyPerPoint: t.qtyPerPoint, unit: t.unit, backupRate: t.backupRate
        });
      }
    }

    this._ctx = { mode: mode, srcId: srcId, pre: pre };

    const condRows = this.condOptions.map(c => `<label style="display:flex;align-items:center;gap:6px;font-size:13px;margin-right:16px;">
      <input type="checkbox" name="ncCond" value="${c.code}" ${pre.conds.indexOf(c.code) >= 0 ? 'checked' : ''}> ${esc(c.name)}
    </label>`).join('');

    const monthChips = [0, 3, 6, 9, 12, 18, 24, 36].map(m => `<label style="display:inline-flex;align-items:center;gap:4px;border:1px solid #e5e7eb;border-radius:12px;padding:3px 10px;font-size:12px;margin-right:6px;">
      <input type="checkbox" name="ncMonth" value="${m}" ${pre.months.indexOf(m) >= 0 ? 'checked' : ''}> ${m} 月
    </label>`).join('');

    const itemChips = this.itemOptions.map(it => `<label style="display:inline-flex;align-items:center;gap:4px;border:1px solid #e5e7eb;border-radius:12px;padding:3px 10px;font-size:12px;margin:0 6px 6px 0;">
      <input type="checkbox" name="ncItem" value="${it}" ${pre.items.indexOf(it) >= 0 ? 'checked' : ''}> ${esc(it)}
    </label>`).join('');

    const typeOpts = this.typeOptions.map(t => `<option value="${t.code}" ${pre.type === t.code ? 'selected' : ''}>${t.name}</option>`).join('');
    const plantOpts = this.plantOptions.map(p => `<option value="${p.code}" ${pre.plant === p.code ? 'selected' : ''}>${p.code} ${p.name}</option>`).join('');

    showModal('新建稳定性研究', `<div style="padding:2px 0;">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px 20px;margin-bottom:16px;">
        <div class="form-group" style="grid-column:span 2;"><label>研究名称 <span class="req">*</span></label><input type="text" id="ncName" value="${esc(pre.name)}" placeholder="如 ×× 2026 年度持续稳定性考察"></div>
        <div class="form-group"><label>研究类型 <span class="req">*</span></label><select id="ncType">${typeOpts}</select></div>
        <div class="form-group"><label>工厂</label><select id="ncPlant">${plantOpts}</select></div>
        <div class="form-group"><label>物料编码 <span class="req">*</span></label><input type="text" id="ncMatCode" value="${esc(pre.materialCode)}" placeholder="如 MAT-20002"></div>
        <div class="form-group"><label>物料名称 <span class="req">*</span></label><input type="text" id="ncMatName" value="${esc(pre.materialName)}"></div>
        <div class="form-group"><label>生产批次</label><input type="text" id="ncBatch" placeholder="SAP 批次号"></div>
        <div class="form-group"><label>规格</label><input type="text" id="ncSpec" value="${esc(pre.spec || '')}" placeholder="如 0.3g"></div>
        <div class="form-group"><label>上市包装</label><input type="text" id="ncPack" value="${esc(pre.packSpec || '')}" placeholder="如 铝塑泡罩 12 粒/盒"></div>
        <div class="form-group"><label>开始日期（0 月） <span class="req">*</span></label><input type="date" id="ncStart" value="${esc(pre.startDate || _today())}"></div>
        <div class="form-group"><label>取样窗口 ±天</label><input type="number" id="ncWindow" value="5"></div>
        <div class="form-group"><label>负责人</label><input type="text" id="ncOwner" value="李工"></div>
        <div class="form-group"><label>每点用量</label><input type="number" id="ncQty" value="${pre.qtyPerPoint}"></div>
        <div class="form-group"><label>单位</label><input type="text" id="ncUnit" value="${esc(pre.unit)}"></div>
        <div class="form-group"><label>备用系数</label><input type="number" step="0.05" id="ncBackup" value="${pre.backupRate}"></div>
      </div>
      <div style="font-size:13px;font-weight:600;margin-bottom:8px;">考察条件</div>
      <div style="margin-bottom:16px;">${condRows}</div>
      <div style="font-size:13px;font-weight:600;margin-bottom:8px;">时间点（月）</div>
      <div style="margin-bottom:16px;">${monthChips}</div>
      <div style="font-size:13px;font-weight:600;margin-bottom:8px;">检验项目</div>
      <div>${itemChips}</div>
    </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '创建研究', cls: 'btn-primary', action: () => { StabilityPlan.saveCreate(); } }
    ], 'modal-xl');
  },

  _checked(name) {
    return Array.prototype.slice.call(document.querySelectorAll('input[name="' + name + '"]:checked')).map(x => x.value);
  },

  saveCreate() {
    const name = this._val('ncName');
    const matCode = this._val('ncMatCode');
    const matName = this._val('ncMatName');
    const start = this._val('ncStart');
    const conds = this._checked('ncCond');
    const months = this._checked('ncMonth').map(Number).sort((a, b) => a - b);
    const items = this._checked('ncItem');

    if (!name) return toast('请填写研究名称');
    if (!matCode || !matName) return toast('请填写物料编码与名称');
    if (!start) return toast('请填写开始日期');
    if (!conds.length) return toast('请至少选择一个考察条件');
    if (!months.length) return toast('请至少选择一个时间点');
    if (!items.length) return toast('请至少选择一个检验项目');

    const seq = this.studies.length + 1;
    const no = 'STB-26' + String(seq).padStart(3, '0');
    const id = 'S' + String(Date.now()).slice(-6);

    const study = {
      id: id, no: no, name: name,
      type: this._val('ncType'), plant: this._val('ncPlant'),
      materialCode: matCode, materialName: matName,
      spec: this._val('ncSpec'), packSpec: this._val('ncPack'),
      batchNo: this._val('ncBatch'), batchQty: '',
      purpose: '', changeNo: '',
      protocolNo: '', approvalNo: '', approvalDate: '',
      startDate: start, windowDays: Number(this._val('ncWindow')) || 5,
      owner: this._val('ncOwner'), qaOwner: '',
      qtyPerPoint: Number(this._val('ncQty')) || 1,
      unit: this._val('ncUnit') || '件',
      backupRate: Number(this._val('ncBackup')) || 0.2,
      status: 'DRAFT',
      createdAt: _today(), createdBy: '当前用户', remark: '',
      conds: conds.map(code => ({ code: code, status: 'NOT_STARTED', months: months.slice(), items: items.slice() })),
      logs: [{ time: _now(), action: '创建研究', by: '当前用户', note: '草稿' }]
    };

    this.studies.unshift(study);
    if (this._ctx.mode === 'annual' && this._ctx.srcId && typeof StabilityAnnual !== 'undefined' && StabilityAnnual.addStudy) {
      StabilityAnnual.addStudy(this._ctx.srcId, no);
    }
    const fromPlan = this._ctx.mode === 'annual';
    closeModal();
    this.search();
    toast(fromPlan ? '研究 ' + no + ' 已创建（草稿），已回写年度考察计划' : '研究已创建，下一步登记立项');
  },

  // ==================== 导出 ====================

  exportData() {
    this._apply();
    const head = ['研究编号', '方案编号', '同方案批次', '研究名称', '类型', '物料编码', '物料名称', '生产批次', '工厂', '考察条件', '时间点完成', '超期点', '开始日期', '状态'];
    const lines = [head.join(',')];
    this.filtered.forEach(s => {
      const pg = this.progress(s);
      lines.push([s.no, s.protocolNo || '', this.batchLabel(s), s.name, this.typeMeta(s.type).name, s.materialCode, s.materialName, s.batchNo || '', s.plant,
        s.conds.map(c => c.code).join('/'), pg.done + '/' + pg.total, pg.over, s.startDate, this.statusMeta(s.status).name]
        .map(v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"').join(','));
    });
    const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '稳定性研究_' + _today() + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('已导出 ' + this.filtered.length + ' 条');
  }
};

// ==================== 日期工具 ====================

function _pad2(n) { return n < 10 ? '0' + n : '' + n; }
function _parseDate(s) {
  const p = String(s || '').split('-');
  return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
}
function _fmtDate(d) { return d.getFullYear() + '-' + _pad2(d.getMonth() + 1) + '-' + _pad2(d.getDate()); }
function _today() { return _fmtDate(new Date()); }
function _now() { const d = new Date(); return _fmtDate(d) + ' ' + _pad2(d.getHours()) + ':' + _pad2(d.getMinutes()); }
function _addMonths(dateStr, m) {
  const d = _parseDate(dateStr);
  const day = d.getDate();
  d.setMonth(d.getMonth() + m);
  if (d.getDate() < day) d.setDate(0);
  return _fmtDate(d);
}
function _addDays(dateStr, n) {
  const d = _parseDate(dateStr);
  d.setDate(d.getDate() + Number(n || 0));
  return _fmtDate(d);
}
function _diffDays(a, b) {
  return Math.round((_parseDate(a) - _parseDate(b)) / 86400000);
}

// ==================== 查询变式 ====================

if (window.QueryVariant) {
  QueryVariant.register({
    pageId: 'stability-plan',
    fields: ['spKeyword', 'spType', 'spStatus', 'spPlant', 'spMaterial', 'spOwner', 'spDue'],
    textFields: ['spKeyword', 'spMaterial', 'spOwner'],
    labels: {
      spKeyword: '关键词', spType: '研究类型', spStatus: '状态', spPlant: '工厂',
      spMaterial: '物料编码', spOwner: '负责人', spDue: '时间点'
    },
    onApply: function () { StabilityPlan.search(); }
  });
}

// ==================== 位置占用注册（稳定性样品参与位置树占用统计） ====================

if (window.SampleLocations) {
  SampleLocations.addProvider(function () {
    const out = [];
    StabilityPlan.studies.forEach(s => {
      (s.samples || []).forEach(sm => {
        if (sm.locCode && StabilityPlan.remain(sm) > 0) out.push({ locCode: sm.locCode });
      });
    });
    return out;
  });
}
