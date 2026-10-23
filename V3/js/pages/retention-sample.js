// ===== 留样管理页面 =====
// 质量管理 → 质量检验 → 留样管理（与检验批管理并列）
//
// 职责划分：
//   MES 负责业务过程 —— 留样规则、登记、位置管理、观察、调用与归还、到期预警、销毁审批
//   SAP 负责库存移动 —— 仅在「登记入库」与「销毁执行」两个动作触发：
//     · 登记入库：移动类型 311（生产/仓库库位 → 留样室库位，存储地点转储）
//     · 销毁执行：移动类型 551（报废出库）
//   调用 / 归还 / 观察只登记台账，不做库存移动（样品仍在留样库存）
//
// 三个页签：留样台账 / 留样观察 / 到期处理与销毁
const RetentionSample = {
  _version: '1.0-20261023',
  activeTab: 'ledger', // ledger | observe | destroy
  page: 1, pageSize: 10,
  filtered: [],
  moreOpen: false,

  // ==================== 字典 ====================

  plantOptions: [
    { code: '1000', name: '山东步长制药工厂' },
    { code: '2001', name: '陕西步长制药工厂' },
    { code: '2002', name: '山东丹红制药工厂' }
  ],

  sampleTypeOptions: [
    { code: 'RM', name: '原料' },
    { code: 'EX', name: '辅料' },
    { code: 'IP', name: '中间品' },
    { code: 'FP', name: '成品' },
    { code: 'PK', name: '包装材料' }
  ],

  destroyMethodOptions: [
    { code: 'INCINERATE', name: '焚烧' },
    { code: 'LANDFILL', name: '填埋' },
    { code: 'RETURN', name: '退回供应商' },
    { code: 'RECYCLE', name: '回收处理' }
  ],

  // 留样状态机：登记 → 入库在库 →（调用/归还）→（到期）→ 销毁审批 → 已销毁
  statusFlow: [
    { code: 'REG',           name: '待入库',     badge: 'badge-yellow', desc: '已登记留样数量并过账 SAP 311，待指定留样位置入库' },
    { code: 'STORED',        name: '在库',       badge: 'badge-green',  desc: '已入留样室，按观察频次执行留样观察' },
    { code: 'CALLED',        name: '调用中',     badge: 'badge-purple', desc: '因投诉/调查/复验被借出，待归还' },
    { code: 'EXPIRING',      name: '即将到期',   badge: 'badge-yellow', desc: '距留样到期日不足 90 天，需安排销毁' },
    { code: 'EXPIRED',       name: '已到期',     badge: 'badge-red',    desc: '已过留样到期日，须尽快销毁' },
    { code: 'DESTROY_APPLY', name: '销毁审批中', badge: 'badge-blue',   desc: '销毁申请待 QA 审批，样品不得调用' },
    { code: 'DESTROYED',     name: '已销毁',     badge: 'badge-gray',   desc: '已执行销毁并过账 SAP 551，台账只读（终态）' }
  ],

  // 销毁单状态机：申请 → 审批 → 执行（或驳回）
  destroyFlow: [
    { code: 'APPLY',    name: '待审批',       badge: 'badge-yellow' },
    { code: 'APPROVED', name: '已批准待执行', badge: 'badge-blue'   },
    { code: 'REJECTED', name: '已驳回',       badge: 'badge-red'    },
    { code: 'DONE',     name: '已销毁',       badge: 'badge-gray'   }
  ],

  getStatusMeta(code) {
    return this.statusFlow.find(s => s.code === code) || { code: code, name: code, badge: 'badge-gray', desc: '—' };
  },
  getDestroyMeta(code) {
    return this.destroyFlow.find(s => s.code === code) || { code: code, name: code, badge: 'badge-gray' };
  },
  getTypeName(code) {
    const t = this.sampleTypeOptions.find(x => x.code === code);
    return t ? t.name : code;
  },
  getPlantName(code) {
    const p = this.plantOptions.find(x => x.code === code);
    return p ? p.name : code;
  },

  // ==================== 留样规则（物料/产品维度，登记时自动带出） ====================

  ruleData: [
    { id: 'R01', plant: '2001', materialCode: 'MAT-10005', materialName: '布洛芬原料药', sampleType: 'RM', needSample: true, sampleQty: '0.500', unit: 'KG', storageCondition: '阴凉干燥处（≤25℃，RH≤60%）', keepRule: '有效期后 1 年', observeFreq: '每 12 个月', observeTimes: 3 },
    { id: 'R02', plant: '2001', materialCode: 'MAT-20002', materialName: '布洛芬缓释胶囊', sampleType: 'FP', needSample: true, sampleQty: '2.000', unit: '盒', storageCondition: '密封、室温（10~30℃）', keepRule: '有效期后 1 年', observeFreq: '每 12 个月', observeTimes: 3 },
    { id: 'R03', plant: '2001', materialCode: 'MAT-10009', materialName: '甘露醇辅料', sampleType: 'EX', needSample: true, sampleQty: '0.300', unit: 'KG', storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月', observeFreq: '每 12 个月', observeTimes: 2 },
    { id: 'R04', plant: '2002', materialCode: 'MAT-30002', materialName: '丹红注射液', sampleType: 'FP', needSample: true, sampleQty: '4.000', unit: '支', storageCondition: '避光、阴凉处（2~8℃）', keepRule: '有效期后 1 年', observeFreq: '每 6 个月', observeTimes: 6 },
    { id: 'R05', plant: '2002', materialCode: 'MAT-30003', materialName: '注射用水', sampleType: 'IP', needSample: false, sampleQty: '0.000', unit: 'L', storageCondition: '—', keepRule: '不留样', observeFreq: '—', observeTimes: 0 },
    { id: 'R06', plant: '1000', materialCode: 'MAT-10006', materialName: '维生素C原料', sampleType: 'RM', needSample: true, sampleQty: '0.500', unit: 'KG', storageCondition: '避光、密封、干燥处', keepRule: '放行后 3 年', observeFreq: '每 12 个月', observeTimes: 3 }
  ],

  // ==================== 留样台账 ====================

  sampleData: [
    { id: 'S001', sampleNo: 'LS-2001-2606001', plant: '2001', materialCode: 'MAT-10005', materialName: '布洛芬原料药', sampleType: 'RM',
      sourceBatch: 'SAP-BT-20260501', inspectBatchNo: '100000012301',
      sampleQty: '0.500', remainQty: '0.500', unit: 'KG',
      storageCondition: '阴凉干燥处（≤25℃，RH≤60%）', keepRule: '有效期后 1 年',
      room: '留样室A', cabinet: 'A-03', shelf: '2 层', location: 'A-03-02-01',
      registerBy: '张工', registerTime: '2026-06-14 10:20', validDate: '2028-05-31', dueDate: '2029-05-31',
      observeFreq: '每 12 个月', nextObserveDate: '2026-12-14', status: 'STORED',
      labelNo: 'LBL-20260614-0001', sapDocNo: '4900000123', sapMoveType: '311', sapSyncTime: '2026-06-14 10:20:08' },
    { id: 'S002', sampleNo: 'LS-2001-2606002', plant: '2001', materialCode: 'MAT-20002', materialName: '布洛芬缓释胶囊', sampleType: 'FP',
      sourceBatch: 'SAP-BT-20260610', inspectBatchNo: '100000012305',
      sampleQty: '2.000', remainQty: '2.000', unit: '盒',
      storageCondition: '密封、室温（10~30℃）', keepRule: '有效期后 1 年',
      room: '留样室A', cabinet: 'B-01', shelf: '1 层', location: 'B-01-01-02',
      registerBy: '李工', registerTime: '2026-06-20 09:10', validDate: '2027-12-31', dueDate: '2028-12-31',
      observeFreq: '每 12 个月', nextObserveDate: '2026-06-20', status: 'EXPIRING',
      labelNo: 'LBL-20260620-0002', sapDocNo: '4900000140', sapMoveType: '311', sapSyncTime: '2026-06-20 09:10:12' },
    { id: 'S003', sampleNo: 'LS-2001-2509003', plant: '2001', materialCode: 'MAT-10009', materialName: '甘露醇辅料', sampleType: 'EX',
      sourceBatch: 'SAP-BT-20250918', inspectBatchNo: '100000009812',
      sampleQty: '0.300', remainQty: '0.300', unit: 'KG',
      storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月',
      room: '留样室A', cabinet: 'C-02', shelf: '3 层', location: 'C-02-03-01',
      registerBy: '王工', registerTime: '2025-09-20 14:00', validDate: '2026-06-30', dueDate: '2026-12-31',
      observeFreq: '每 12 个月', nextObserveDate: '2026-12-20', status: 'CALLED',
      labelNo: 'LBL-20250920-0003', sapDocNo: '4900000088', sapMoveType: '311', sapSyncTime: '2025-09-20 14:00:05',
      calls: [{ callNo: 'CALL-20261012-01', by: '孙工', dept: '质量部', purpose: '客户投诉复验（投诉单 TS-20261010-03）', qty: '0.100', unit: 'KG', time: '2026-10-12 10:30', approveBy: 'QA经理', sign: '电子签名已签', returnTime: '', returnBy: '' }] },
    { id: 'S004', sampleNo: 'LS-2002-2603004', plant: '2002', materialCode: 'MAT-30002', materialName: '丹红注射液', sampleType: 'FP',
      sourceBatch: 'SAP-BT-20260305', inspectBatchNo: '100000010233',
      sampleQty: '4.000', remainQty: '4.000', unit: '支',
      storageCondition: '避光、阴凉处（2~8℃）', keepRule: '有效期后 1 年',
      room: '留样室B', cabinet: 'A-01', shelf: '1 层', location: 'B-A-01-01',
      registerBy: '赵工', registerTime: '2026-03-08 08:40', validDate: '2026-09-30', dueDate: '2027-09-30',
      observeFreq: '每 6 个月', nextObserveDate: '2026-09-08', status: 'DESTROY_APPLY',
      labelNo: 'LBL-20260308-0004', sapDocNo: '4900000211', sapMoveType: '311', sapSyncTime: '2026-03-08 08:40:03' },
    { id: 'S005', sampleNo: 'LS-2001-2408005', plant: '2001', materialCode: 'MAT-10002', materialName: '阿莫西林原料药', sampleType: 'RM',
      sourceBatch: 'SAP-BT-20240801', inspectBatchNo: '100000007701',
      sampleQty: '0.500', remainQty: '0.000', unit: 'KG',
      storageCondition: '阴凉干燥处（≤25℃）', keepRule: '有效期后 1 年',
      room: '留样室A', cabinet: 'A-01', shelf: '1 层', location: 'A-01-01-03',
      registerBy: '刘工', registerTime: '2024-08-05 11:00', validDate: '2025-12-31', dueDate: '2026-06-30',
      observeFreq: '每 12 个月', nextObserveDate: '—', status: 'DESTROYED',
      labelNo: 'LBL-20240805-0005', sapDocNo: '4900000071', sapMoveType: '311', sapSyncTime: '2024-08-05 11:00:02',
      destroyNo: 'DS-20260901-003', destroyDate: '2026-09-05', destroyMethod: 'INCINERATE',
      sapDestroyDoc: '5510000451', sapDestroyMoveType: '551' },
    { id: 'S006', sampleNo: 'LS-1000-2607006', plant: '1000', materialCode: 'MAT-10006', materialName: '维生素C原料', sampleType: 'RM',
      sourceBatch: 'SAP-BT-20260701', inspectBatchNo: '100000013211',
      sampleQty: '0.500', remainQty: '0.500', unit: 'KG',
      storageCondition: '避光、密封、干燥处', keepRule: '放行后 3 年',
      room: '留样室C', cabinet: 'A-02', shelf: '2 层', location: 'C-A-02-02',
      registerBy: '陈工', registerTime: '2026-07-03 15:30', validDate: '2027-06-30', dueDate: '2029-07-02',
      observeFreq: '每 12 个月', nextObserveDate: '2027-07-03', status: 'REG',
      labelNo: 'LBL-20260703-0006', sapDocNo: '4900000302', sapMoveType: '311', sapSyncTime: '2026-07-03 15:30:11' },
    { id: 'S007', sampleNo: 'LS-2001-2609007', plant: '2001', materialCode: 'MAT-20003', materialName: '稳心颗粒', sampleType: 'FP',
      sourceBatch: 'SAP-BT-20260902', inspectBatchNo: '100000013501',
      sampleQty: '3.000', remainQty: '3.000', unit: '袋',
      storageCondition: '密封、阴凉干燥处', keepRule: '有效期后 1 年',
      room: '留样室A', cabinet: 'B-04', shelf: '2 层', location: 'B-04-02-01',
      registerBy: '周工', registerTime: '2026-09-05 10:00', validDate: '2027-08-31', dueDate: '2028-08-31',
      observeFreq: '每 12 个月', nextObserveDate: '2027-03-05', status: 'STORED',
      labelNo: 'LBL-20260905-0007', sapDocNo: '4900000311', sapMoveType: '311', sapSyncTime: '2026-09-05 10:00:07' },
    { id: 'S008', sampleNo: 'LS-2002-2506008', plant: '2002', materialCode: 'MAT-30004', materialName: '注射用灯盏花素', sampleType: 'FP',
      sourceBatch: 'SAP-BT-20250612', inspectBatchNo: '100000009120',
      sampleQty: '6.000', remainQty: '5.000', unit: '支',
      storageCondition: '避光、密闭（2~8℃）', keepRule: '有效期后 1 年',
      room: '留样室B', cabinet: 'A-02', shelf: '2 层', location: 'B-A-02-02',
      registerBy: '赵工', registerTime: '2025-06-15 09:20', validDate: '2026-05-31', dueDate: '2027-05-31',
      observeFreq: '每 6 个月', nextObserveDate: '2026-11-15', status: 'STORED',
      labelNo: 'LBL-20250615-0008', sapDocNo: '4900000155', sapMoveType: '311', sapSyncTime: '2025-06-15 09:20:06',
      calls: [{ callNo: 'CALL-20260720-02', by: '吴工', dept: '注册部', purpose: '注册申报补充资料', qty: '1.000', unit: '支', time: '2026-07-20 14:10', approveBy: 'QA经理', sign: '电子签名已签', returnTime: '2026-08-02 09:00', returnBy: '吴工' }] },
    { id: 'S009', sampleNo: 'LS-2001-2405010', plant: '2001', materialCode: 'MAT-10010', materialName: '微晶纤维素', sampleType: 'EX',
      sourceBatch: 'SAP-BT-20240510', inspectBatchNo: '100000007412',
      sampleQty: '0.300', remainQty: '0.300', unit: 'KG',
      storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月',
      room: '留样室A', cabinet: 'C-01', shelf: '1 层', location: 'C-01-01-02',
      registerBy: '张工', registerTime: '2024-05-12 16:00', validDate: '2025-05-31', dueDate: '2025-11-30',
      observeFreq: '每 12 个月', nextObserveDate: '—', status: 'EXPIRED',
      labelNo: 'LBL-20240512-0009', sapDocNo: '4900000062', sapMoveType: '311', sapSyncTime: '2024-05-12 16:00:04' },
    { id: 'S010', sampleNo: 'LS-2002-2607011', plant: '2002', materialCode: 'MAT-30005', materialName: '冠心宁注射液', sampleType: 'FP',
      sourceBatch: 'SAP-BT-20260715', inspectBatchNo: '100000013622',
      sampleQty: '4.000', remainQty: '4.000', unit: '支',
      storageCondition: '避光、阴凉处（2~8℃）', keepRule: '有效期后 1 年',
      room: '留样室B', cabinet: 'B-02', shelf: '1 层', location: 'B-B-02-01',
      registerBy: '钱工', registerTime: '2026-07-18 11:20', validDate: '2027-07-31', dueDate: '2028-07-31',
      observeFreq: '每 6 个月', nextObserveDate: '2027-01-18', status: 'STORED',
      labelNo: 'LBL-20260718-0010', sapDocNo: '4900000320', sapMoveType: '311', sapSyncTime: '2026-07-18 11:20:09' },
    { id: 'S011', sampleNo: 'LS-1000-2608012', plant: '1000', materialCode: 'MAT-10011', materialName: '硬脂酸镁', sampleType: 'EX',
      sourceBatch: 'SAP-BT-20260805', inspectBatchNo: '100000013780',
      sampleQty: '0.200', remainQty: '0.200', unit: 'KG',
      storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月',
      room: '留样室C', cabinet: 'B-01', shelf: '3 层', location: 'C-B-01-03',
      registerBy: '孙工', registerTime: '2026-08-08 09:00', validDate: '2026-11-30', dueDate: '2027-05-31',
      observeFreq: '每 12 个月', nextObserveDate: '2027-08-08', status: 'STORED',
      labelNo: 'LBL-20260808-0011', sapDocNo: '4900000333', sapMoveType: '311', sapSyncTime: '2026-08-08 09:00:10' },
    { id: 'S012', sampleNo: 'LS-2001-2512013', plant: '2001', materialCode: 'MAT-10012', materialName: '乳糖', sampleType: 'EX',
      sourceBatch: 'SAP-BT-20251201', inspectBatchNo: '100000010010',
      sampleQty: '0.300', remainQty: '0.300', unit: 'KG',
      storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月',
      room: '留样室A', cabinet: 'C-03', shelf: '1 层', location: 'C-03-01-01',
      registerBy: '李工', registerTime: '2025-12-03 13:40', validDate: '2026-10-31', dueDate: '2027-04-30',
      observeFreq: '每 12 个月', nextObserveDate: '2026-12-03', status: 'EXPIRING',
      labelNo: 'LBL-20251203-0012', sapDocNo: '4900000166', sapMoveType: '311', sapSyncTime: '2025-12-03 13:40:02' }
  ],

  // ==================== 留样观察任务（按频次自动生成） ====================

  observeData: [
    { id: 'O001', taskNo: 'OB-20260620-001', sampleId: 'S002', sampleNo: 'LS-2001-2606002', materialName: '布洛芬缓释胶囊', plant: '2001',
      seq: 1, total: 3, planDate: '2026-06-20', actualDate: '2026-06-22', observer: '李工',
      item: '外观、包装密封性', result: 'OK', remark: '外观完好，铝塑板密封良好，无变色', abnormalNo: '' },
    { id: 'O002', taskNo: 'OB-20260908-001', sampleId: 'S004', sampleNo: 'LS-2002-2603004', materialName: '丹红注射液', plant: '2002',
      seq: 1, total: 6, planDate: '2026-09-08', actualDate: '2026-09-10', observer: '赵工',
      item: '外观、澄明度、安瓿完整性', result: 'NG', remark: '发现 2 支安瓿内可见少量白点，其余正常', abnormalNo: 'QA-20260910-006' },
    { id: 'O003', taskNo: 'OB-20261012-001', sampleId: 'S001', sampleNo: 'LS-2001-2606001', materialName: '布洛芬原料药', plant: '2001',
      seq: 1, total: 3, planDate: '2026-10-12', actualDate: '', observer: '',
      item: '外观、包装完整性、色泽', result: '', remark: '', abnormalNo: '' },
    { id: 'O004', taskNo: 'OB-20261018-001', sampleId: 'S007', sampleNo: 'LS-2001-2609007', materialName: '稳心颗粒', plant: '2001',
      seq: 1, total: 3, planDate: '2026-10-18', actualDate: '', observer: '',
      item: '外观、包装密封性', result: '', remark: '', abnormalNo: '' },
    { id: 'O005', taskNo: 'OB-20261115-001', sampleId: 'S008', sampleNo: 'LS-2002-2506008', materialName: '注射用灯盏花素', plant: '2002',
      seq: 4, total: 6, planDate: '2026-11-15', actualDate: '', observer: '',
      item: '外观、澄明度、西林瓶完整性', result: '', remark: '', abnormalNo: '' },
    { id: 'O006', taskNo: 'OB-20261023-001', sampleId: 'S011', sampleNo: 'LS-1000-2608012', materialName: '硬脂酸镁', plant: '1000',
      seq: 1, total: 2, planDate: '2026-10-23', actualDate: '', observer: '',
      item: '外观、包装完整性', result: '', remark: '', abnormalNo: '' },
    { id: 'O007', taskNo: 'OB-20261203-001', sampleId: 'S012', sampleNo: 'LS-2001-2512013', materialName: '乳糖', plant: '2001',
      seq: 2, total: 2, planDate: '2026-12-03', actualDate: '', observer: '',
      item: '外观、结块情况', result: '', remark: '', abnormalNo: '' },
    { id: 'O008', taskNo: 'OB-20260920-001', sampleId: 'S003', sampleNo: 'LS-2001-2509003', materialName: '甘露醇辅料', plant: '2001',
      seq: 2, total: 2, planDate: '2026-09-20', actualDate: '2026-09-21', observer: '王工',
      item: '外观、结块情况', result: 'OK', remark: '无结块、无变色', abnormalNo: '' },
    { id: 'O009', taskNo: 'OB-20261010-001', sampleId: 'S010', sampleNo: 'LS-2002-2607011', materialName: '冠心宁注射液', plant: '2002',
      seq: 1, total: 6, planDate: '2026-10-10', actualDate: '', observer: '',
      item: '外观、澄明度', result: '', remark: '', abnormalNo: '' }
  ],

  // ==================== 销毁申请与执行 ====================

  destroyData: [
    { id: 'D001', applyNo: 'DS-20260901-003', sampleId: 'S005', sampleNo: 'LS-2001-2408005', plant: '2001',
      materialCode: 'MAT-10002', materialName: '阿莫西林原料药', qty: '0.500', unit: 'KG', dueDate: '2026-06-30',
      reason: '留样到期', applyBy: '刘工', applyTime: '2026-09-01 09:30',
      approveBy: 'QA经理', approveTime: '2026-09-02 10:00', approveResult: '同意销毁',
      executeBy1: '刘工', executeBy2: '孙工', witness: 'QA经理', method: 'INCINERATE', destroyDate: '2026-09-05',
      sapDocNo: '5510000451', sapMoveType: '551', status: 'DONE' },
    { id: 'D002', applyNo: 'DS-20260920-004', sampleId: 'S004', sampleNo: 'LS-2002-2603004', plant: '2002',
      materialCode: 'MAT-30002', materialName: '丹红注射液', qty: '4.000', unit: '支', dueDate: '2027-09-30',
      reason: '观察发现异常（QA-20260910-006），经评估不再保留', applyBy: '赵工', applyTime: '2026-09-20 15:10',
      approveBy: '', approveTime: '', approveResult: '',
      executeBy1: '', executeBy2: '', witness: '', method: '', destroyDate: '',
      sapDocNo: '', sapMoveType: '', status: 'APPLY' },
    { id: 'D003', applyNo: 'DS-20260928-005', sampleId: 'S009', sampleNo: 'LS-2001-2405010', plant: '2001',
      materialCode: 'MAT-10010', materialName: '微晶纤维素', qty: '0.300', unit: 'KG', dueDate: '2025-11-30',
      reason: '留样到期', applyBy: '张工', applyTime: '2026-09-28 11:00',
      approveBy: 'QA经理', approveTime: '2026-09-29 09:20', approveResult: '同意销毁',
      executeBy1: '', executeBy2: '', witness: '', method: '', destroyDate: '',
      sapDocNo: '', sapMoveType: '', status: 'APPROVED' },
    { id: 'D004', applyNo: 'DS-20261008-006', sampleId: 'S003', sampleNo: 'LS-2001-2509003', plant: '2001',
      materialCode: 'MAT-10009', materialName: '甘露醇辅料', qty: '0.300', unit: 'KG', dueDate: '2026-12-31',
      reason: '客户投诉复验结束，剩余样品不再保留', applyBy: '王工', applyTime: '2026-10-08 16:40',
      approveBy: 'QA经理', approveTime: '2026-10-09 10:30', approveResult: '驳回：未到期且复验报告未归档',
      executeBy1: '', executeBy2: '', witness: '', method: '', destroyDate: '',
      sapDocNo: '', sapMoveType: '', status: 'REJECTED' },
    { id: 'D005', applyNo: 'DS-20261015-007', sampleId: 'S002', sampleNo: 'LS-2001-2606002', plant: '2001',
      materialCode: 'MAT-20002', materialName: '布洛芬缓释胶囊', qty: '2.000', unit: '盒', dueDate: '2028-12-31',
      reason: '包装破损，样品污染', applyBy: '李工', applyTime: '2026-10-15 08:50',
      approveBy: '', approveTime: '', approveResult: '',
      executeBy1: '', executeBy2: '', witness: '', method: '', destroyDate: '',
      sapDocNo: '', sapMoveType: '', status: 'APPLY' }
  ],

  // ==================== 页面骨架 ====================

  render() {
    this.page = 1;
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">留样管理</div>
            <div style="font-size:13px;opacity:0.85;">留样登记、位置、观察、调用与到期销毁 · 登记与销毁自动过账 SAP 库存</div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
              onclick="RetentionSample.openRuleConfig()">留样规则</button>
            <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
              onclick="RetentionSample.openRegister()">+ 留样登记</button>
          </div>
        </div>

        <div class="tabs" style="margin:0;padding:0 24px;background:white;border-bottom:1px solid var(--border);flex-shrink:0;">
          <div class="tab ${this.activeTab === 'ledger' ? 'active' : ''}" onclick="RetentionSample.switchTab('ledger')">留样台账</div>
          <div class="tab ${this.activeTab === 'observe' ? 'active' : ''}" onclick="RetentionSample.switchTab('observe')">留样观察</div>
          <div class="tab ${this.activeTab === 'destroy' ? 'active' : ''}" onclick="RetentionSample.switchTab('destroy')">到期处理与销毁</div>
        </div>

        <div id="rsFilterBar" style="flex-shrink:0;"></div>
        <div class="table-wrapper" id="rsTableWrapper" style="flex:1;overflow:auto;width:100%;min-width:0;"></div>
        <div id="rsPagination" style="flex-shrink:0;"></div>
      </div>`;
  },

  init() {
    if (window.QueryVariant) {
      QueryVariant.mount('retention-sample');
      QueryVariant.restore('retention-sample');
      QueryVariant.bindRecent('retention-sample');
    }
    this.renderFilterBar();
    this.renderTable();
    this.renderPagination();
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.page = 1;
    this.moreOpen = false;
    this.init();
  },

  refresh() { this.init(); toast('数据已刷新'); },

  _val(id) {
    const e = document.getElementById(id);
    return e ? String(e.value || '').trim() : '';
  },

  search() { this.page = 1; this.renderTable(); this.renderPagination(); },

  resetFilter() {
    ['rsPlant', 'rsKeyword', 'rsType', 'rsStatus', 'rsLocation', 'rsBatch',
      'rsObsResult', 'rsObsState', 'rsObsMonth', 'rsDesMethod'].forEach(id => {
      const e = document.getElementById(id); if (e) e.value = '';
    });
    this.search();
  },

  toggleMore() {
    this.moreOpen = !this.moreOpen;
    this.renderFilterBar();
  },

  // ==================== 筛选栏（按页签切换） ====================

  renderFilterBar() {
    const el = document.getElementById('rsFilterBar');
    if (!el) return;
    const plantOpts = this.plantOptions.map(p => `<option value="${p.code}">${p.code} ${p.name}</option>`).join('');
    const btn = `
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="RetentionSample.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="RetentionSample.exportData()">导出</button>
          <button class="btn btn-secondary btn-sm" onclick="RetentionSample.refresh()">刷新</button>
          <button class="btn btn-secondary btn-sm" onclick="RetentionSample.resetFilter()">重置</button>
          <button class="btn btn-secondary btn-sm" onclick="RetentionSample.toggleMore()">${this.moreOpen ? '收起 ▴' : '更多条件 ▾'}</button>
        </div>`;
    const moreStyle = `display:${this.moreOpen ? 'flex' : 'none'};flex-wrap:wrap;gap:12px;width:100%;padding:0;border:none;background:transparent;`;

    if (this.activeTab === 'ledger') {
      const typeOpts = this.sampleTypeOptions.map(t => `<option value="${t.code}">${t.name}</option>`).join('');
      const statOpts = this.statusFlow.map(s => `<option value="${s.code}">${s.name}</option>`).join('');
      el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
        <div class="filter-group"><label>工厂</label><select id="rsPlant"><option value="">全部</option>${plantOpts}</select></div>
        <div class="filter-group"><label>留样编号 / 物料</label><input type="text" id="rsKeyword" placeholder="如 LS-2001 或 布洛芬"></div>
        <div class="filter-group"><label>留样类型</label><select id="rsType"><option value="">全部</option>${typeOpts}</select></div>
        <div class="filter-group"><label>留样状态</label><select id="rsStatus"><option value="">全部</option>${statOpts}</select></div>
        ${btn}
        <div id="rsMoreBar" style="${moreStyle}">
          <div class="filter-group"><label>留样位置</label><input type="text" id="rsLocation" placeholder="如 A-03 或 留样室A"></div>
          <div class="filter-group"><label>来源批次</label><input type="text" id="rsBatch" placeholder="SAP 批次号"></div>
        </div>
      </div>`;
      return;
    }

    if (this.activeTab === 'observe') {
      el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
        <div class="filter-group"><label>工厂</label><select id="rsPlant"><option value="">全部</option>${plantOpts}</select></div>
        <div class="filter-group"><label>留样编号 / 物料</label><input type="text" id="rsKeyword" placeholder="如 LS-2001 或 布洛芬"></div>
        <div class="filter-group"><label>观察状态</label><select id="rsObsState">
          <option value="">全部</option><option value="WAIT">待观察</option><option value="DONE">已观察</option><option value="NG">观察异常</option>
        </select></div>
        <div class="filter-group"><label>计划月份</label><input type="month" id="rsObsMonth"></div>
        ${btn}
        <div id="rsMoreBar" style="${moreStyle}">
          <div class="filter-group"><label>观察结果</label><select id="rsObsResult"><option value="">全部</option>
            <option value="OK">正常</option><option value="NG">异常</option></select></div>
        </div>
      </div>`;
      return;
    }

    const desOpts = this.destroyFlow.map(d => `<option value="${d.code}">${d.name}</option>`).join('');
    const methodOpts = this.destroyMethodOptions.map(m => `<option value="${m.code}">${m.name}</option>`).join('');
    el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
      <div class="filter-group"><label>工厂</label><select id="rsPlant"><option value="">全部</option>${plantOpts}</select></div>
      <div class="filter-group"><label>留样编号 / 物料 / 单号</label><input type="text" id="rsKeyword" placeholder="如 LS-2002 或 DS-"></div>
      <div class="filter-group"><label>处理状态</label><select id="rsStatus"><option value="">全部</option>${desOpts}</select></div>
      ${btn}
      <div id="rsMoreBar" style="${moreStyle}">
        <div class="filter-group"><label>销毁方式</label><select id="rsDesMethod"><option value="">全部</option>${methodOpts}</select></div>
      </div>
    </div>`;
  },

  // ==================== 表格分发 ====================

  renderTable() {
    if (this.activeTab === 'ledger') this.renderLedgerTable();
    else if (this.activeTab === 'observe') this.renderObserveTable();
    else this.renderDestroyTable();
  },

  _paged(list) {
    const pages = Math.max(1, Math.ceil(list.length / this.pageSize));
    if (this.page > pages) this.page = pages;
    const start = (this.page - 1) * this.pageSize;
    return { page: list.slice(start, start + this.pageSize), start: start };
  },

  // ---------- 页签一：留样台账 ----------

  renderLedgerTable() {
    const plant = this._val('rsPlant');
    const kw = this._val('rsKeyword').toLowerCase();
    const type = this._val('rsType');
    const status = this._val('rsStatus');
    const loc = this._val('rsLocation').toLowerCase();
    const batch = this._val('rsBatch').toLowerCase();

    this.filtered = this.sampleData.filter(s => {
      if (plant && s.plant !== plant) return false;
      if (type && s.sampleType !== type) return false;
      if (status && s.status !== status) return false;
      if (loc && (s.location + ' ' + s.room + ' ' + s.cabinet).toLowerCase().indexOf(loc) === -1) return false;
      if (batch && (s.sourceBatch || '').toLowerCase().indexOf(batch) === -1) return false;
      if (kw && (s.sampleNo + ' ' + s.materialCode + ' ' + s.materialName).toLowerCase().indexOf(kw) === -1) return false;
      return true;
    });

    const { page } = this._paged(this.filtered);
    const el = document.getElementById('rsTableWrapper');
    if (!el) return;

    el.innerHTML = `<table class="data-table" style="min-width:1980px;">
      <thead><tr>
        <th style="width:160px;">留样编号</th>
        <th style="width:130px;">物料编码</th>
        <th style="width:170px;">物料名称</th>
        <th style="width:90px;">留样类型</th>
        <th style="width:150px;">来源批次</th>
        <th style="width:130px;">留样量 / 余量</th>
        <th style="width:170px;">留样位置</th>
        <th style="width:110px;">登记人</th>
        <th style="width:150px;">登记时间</th>
        <th style="width:110px;">有效期</th>
        <th style="width:110px;">留样到期日</th>
        <th style="width:150px;">下次观察</th>
        <th style="width:110px;">状态</th>
        <th style="width:250px;">操作</th>
      </tr></thead>
      <tbody>${page.length ? page.map(s => this.renderLedgerRow(s)).join('')
        : `<tr><td colspan="14" class="empty-cell">暂无符合条件的留样记录</td></tr>`}</tbody>
    </table>`;
  },

  renderLedgerRow(s) {
    const m = this.getStatusMeta(s.status);
    const acts = [];
    if (s.status === 'REG') acts.push(`<button class="btn btn-primary btn-sm" onclick="RetentionSample.openPutaway('${s.id}')">入库</button>`);
    if (s.status === 'STORED' || s.status === 'EXPIRING') acts.push(`<button class="btn btn-sm" style="background:#6366f1;color:#fff;" onclick="RetentionSample.openCall('${s.id}')">调用</button>`);
    if (s.status === 'CALLED') acts.push(`<button class="btn btn-success btn-sm" onclick="RetentionSample.openReturn('${s.id}')">归还</button>`);
    if (['EXPIRING', 'EXPIRED', 'STORED', 'CALLED'].indexOf(s.status) !== -1) {
      acts.push(`<button class="btn btn-danger btn-sm" onclick="RetentionSample.openDestroyApply('${s.id}')">销毁申请</button>`);
    }
    acts.push(`<button class="btn btn-blue btn-sm" onclick="RetentionSample.openDetail('${s.id}')">查看</button>`);

    return `<tr${s.status === 'DESTROYED' ? ' style="opacity:0.62;"' : ''}>
      <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(s.sampleNo)}</td>
      <td style="font-family:monospace;font-size:12px;">${esc(s.materialCode)}</td>
      <td>${esc(s.materialName)}</td>
      <td><span class="badge badge-gray badge-sm">${esc(this.getTypeName(s.sampleType))}</span></td>
      <td style="font-family:monospace;font-size:11px;">${esc(s.sourceBatch || '—')}</td>
      <td style="font-size:12px;">${esc(s.sampleQty)} / <b>${esc(s.remainQty)}</b> ${esc(s.unit)}</td>
      <td style="font-size:12px;">${esc(s.room)} / ${esc(s.cabinet)} / ${esc(s.shelf)}
        <div style="color:var(--text-muted);font-family:monospace;font-size:11px;">${esc(s.location)}</div></td>
      <td>${esc(s.registerBy)}</td>
      <td style="font-size:12px;">${esc(s.registerTime)}</td>
      <td style="font-size:12px;">${esc(s.validDate)}</td>
      <td style="font-size:12px;${s.status === 'EXPIRED' ? 'color:#dc2626;font-weight:600;' : ''}">${esc(s.dueDate)}</td>
      <td style="font-size:12px;">${esc(s.nextObserveDate || '—')}</td>
      <td><span class="badge ${m.badge}">${esc(m.name)}</span></td>
      <td><div class="table-actions">${acts.join('')}</div></td>
    </tr>`;
  },

  // ---------- 页签二：留样观察 ----------

  renderObserveTable() {
    const plant = this._val('rsPlant');
    const kw = this._val('rsKeyword').toLowerCase();
    const state = this._val('rsObsState');
    const month = this._val('rsObsMonth');
    const result = this._val('rsObsResult');

    this.filtered = this.observeData.filter(o => {
      if (plant && o.plant !== plant) return false;
      if (state === 'WAIT' && o.actualDate) return false;
      if (state === 'DONE' && !o.actualDate) return false;
      if (state === 'NG' && o.result !== 'NG') return false;
      if (month && o.planDate.substring(0, 7) !== month) return false;
      if (result && o.result !== result) return false;
      if (kw && (o.sampleNo + ' ' + o.materialName).toLowerCase().indexOf(kw) === -1) return false;
      return true;
    });

    const { page } = this._paged(this.filtered);
    const el = document.getElementById('rsTableWrapper');
    if (!el) return;

    el.innerHTML = `<table class="data-table" style="min-width:1560px;">
      <thead><tr>
        <th style="width:160px;">观察任务号</th>
        <th style="width:160px;">留样编号</th>
        <th style="width:170px;">物料名称</th>
        <th style="width:110px;">工厂</th>
        <th style="width:110px;">观察次序</th>
        <th style="width:110px;">计划日期</th>
        <th style="width:150px;">实际观察</th>
        <th style="width:100px;">观察人</th>
        <th style="width:190px;">观察项目</th>
        <th style="width:90px;">结果</th>
        <th style="width:240px;">观察记录</th>
        <th style="width:180px;">操作</th>
      </tr></thead>
      <tbody>${page.length ? page.map(o => {
        const done = !!o.actualDate;
        const resBadge = o.result === 'OK' ? '<span class="badge badge-green">正常</span>'
          : o.result === 'NG' ? '<span class="badge badge-red">异常</span>'
          : '<span class="badge badge-gray">待观察</span>';
        const act = done
          ? `<button class="btn btn-blue btn-sm" onclick="RetentionSample.openObserveForm('${o.id}')">查看/补录</button>`
          : `<button class="btn btn-primary btn-sm" onclick="RetentionSample.openObserveForm('${o.id}')">录入观察</button>`;
        return `<tr>
          <td style="font-family:monospace;font-size:12px;">${esc(o.taskNo)}</td>
          <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(o.sampleNo)}</td>
          <td>${esc(o.materialName)}</td>
          <td>${esc(o.plant)}</td>
          <td style="font-size:12px;">第 ${o.seq} / ${o.total} 次</td>
          <td style="font-size:12px;">${esc(o.planDate)}</td>
          <td style="font-size:12px;">${esc(o.actualDate || '—')}</td>
          <td>${esc(o.observer || '—')}</td>
          <td style="font-size:12px;">${esc(o.item)}</td>
          <td>${resBadge}</td>
          <td style="font-size:12px;">${esc(o.remark || '—')}${o.abnormalNo ? `<div style="color:#dc2626;font-size:11px;">异常单 ${esc(o.abnormalNo)}</div>` : ''}</td>
          <td><div class="table-actions">${act}</div></td>
        </tr>`;
      }).join('') : `<tr><td colspan="12" class="empty-cell">暂无观察任务</td></tr>`}</tbody>
    </table>`;
  },

  // ---------- 页签三：到期处理与销毁 ----------

  renderDestroyTable() {
    const plant = this._val('rsPlant');
    const kw = this._val('rsKeyword').toLowerCase();
    const status = this._val('rsStatus');
    const method = this._val('rsDesMethod');

    this.filtered = this.destroyData.filter(d => {
      if (plant && d.plant !== plant) return false;
      if (status && d.status !== status) return false;
      if (method && d.method !== method) return false;
      if (kw && (d.sampleNo + ' ' + d.materialName + ' ' + d.applyNo).toLowerCase().indexOf(kw) === -1) return false;
      return true;
    });

    const { page } = this._paged(this.filtered);
    const stat = this._expireStat();
    const el = document.getElementById('rsTableWrapper');
    if (!el) return;

    const cards = `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:14px 24px;background:#f8fafc;border-bottom:1px solid var(--border);">
        ${[['90 天内到期', stat.expiring, '#f59e0b'], ['已到期未处理', stat.expired, '#dc2626'],
           ['待审批销毁', stat.applying, '#2563eb'], ['已销毁', stat.done, '#64748b']]
          .map(c => `<div style="background:#fff;border:1px solid var(--border);border-radius:8px;padding:12px 16px;">
            <div style="font-size:12px;color:var(--text-muted);">${c[0]}</div>
            <div style="font-size:22px;font-weight:700;color:${c[2]};">${c[1]}</div>
          </div>`).join('')}
      </div>`;

    el.innerHTML = cards + `<table class="data-table" style="min-width:1880px;">
      <thead><tr>
        <th style="width:160px;">申请单号</th>
        <th style="width:160px;">留样编号</th>
        <th style="width:170px;">物料名称</th>
        <th style="width:120px;">数量</th>
        <th style="width:110px;">留样到期日</th>
        <th style="width:200px;">申请原因</th>
        <th style="width:150px;">申请人 / 时间</th>
        <th style="width:200px;">审批</th>
        <th style="width:180px;">执行（双人签名）</th>
        <th style="width:100px;">销毁方式</th>
        <th style="width:150px;">SAP 物料凭证</th>
        <th style="width:110px;">状态</th>
        <th style="width:160px;">操作</th>
      </tr></thead>
      <tbody>${page.length ? page.map(d => {
        const m = this.getDestroyMeta(d.status);
        const methodName = (this.destroyMethodOptions.find(x => x.code === d.method) || {}).name || '—';
        const acts = [];
        if (d.status === 'APPLY') acts.push(`<button class="btn btn-success btn-sm" onclick="RetentionSample.openApprove('${d.id}')">审批</button>`);
        if (d.status === 'APPROVED') acts.push(`<button class="btn btn-danger btn-sm" onclick="RetentionSample.openExecuteDestroy('${d.id}')">执行销毁</button>`);
        acts.push(`<button class="btn btn-blue btn-sm" onclick="RetentionSample.openDestroyDetail('${d.id}')">查看</button>`);
        return `<tr>
          <td style="font-family:monospace;font-size:12px;">${esc(d.applyNo)}</td>
          <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(d.sampleNo)}</td>
          <td>${esc(d.materialName)}</td>
          <td style="font-size:12px;">${esc(d.qty)} ${esc(d.unit)}</td>
          <td style="font-size:12px;">${esc(d.dueDate)}</td>
          <td style="font-size:12px;">${esc(d.reason)}</td>
          <td style="font-size:12px;">${esc(d.applyBy)}<div style="color:var(--text-muted);font-size:11px;">${esc(d.applyTime)}</div></td>
          <td style="font-size:12px;">${d.approveBy ? esc(d.approveBy) + '<div style="color:var(--text-muted);font-size:11px;">' + esc(d.approveTime) + '</div><div style="font-size:11px;color:' + (d.status === 'REJECTED' ? '#dc2626' : '#16a34a') + ';">' + esc(d.approveResult) + '</div>' : '—'}</td>
          <td style="font-size:12px;">${d.executeBy1 ? esc(d.executeBy1) + ' / ' + esc(d.executeBy2) + '<div style="color:var(--text-muted);font-size:11px;">见证：' + esc(d.witness) + ' · ' + esc(d.destroyDate) + '</div>' : '—'}</td>
          <td style="font-size:12px;">${esc(methodName)}</td>
          <td style="font-size:12px;">${d.sapDocNo ? esc(d.sapDocNo) + '<div style="color:var(--text-muted);font-size:11px;">移动类型 ' + esc(d.sapMoveType) + '</div>' : '—'}</td>
          <td><span class="badge ${m.badge}">${esc(m.name)}</span></td>
          <td><div class="table-actions">${acts.join('')}</div></td>
        </tr>`;
      }).join('') : `<tr><td colspan="13" class="empty-cell">暂无销毁记录</td></tr>`}</tbody>
    </table>`;
  },

  // 到期统计（与当前日期比较）
  _expireStat() {
    const today = new Date();
    let expiring = 0, expired = 0;
    this.sampleData.forEach(s => {
      if (s.status === 'DESTROYED') return;
      const due = new Date(s.dueDate);
      if (isNaN(due.getTime())) return;
      const days = Math.round((due - today) / 86400000);
      if (days < 0) expired++;
      else if (days <= 90) expiring++;
    });
    const applying = this.destroyData.filter(d => d.status === 'APPLY').length;
    const done = this.destroyData.filter(d => d.status === 'DONE').length;
    return { expiring: expiring, expired: expired, applying: applying, done: done };
  },

  // ==================== 分页 ====================

  renderPagination() {
    const el = document.getElementById('rsPagination');
    if (!el) return;
    const total = this.filtered.length;
    const pages = Math.max(1, Math.ceil(total / this.pageSize));
    el.innerHTML = `<div class="pagination">
      <span style="color:var(--text-muted);font-size:12px;margin-right:12px;">共 ${total} 条</span>
      <button class="pagination-btn" onclick="RetentionSample.prevPage()" ${this.page <= 1 ? 'disabled' : ''}>‹</button>
      <span class="pagination-info">第 ${this.page} / ${pages} 页</span>
      <button class="pagination-btn" onclick="RetentionSample.nextPage()" ${this.page >= pages ? 'disabled' : ''}>›</button>
      <select class="page-size-select" onchange="RetentionSample.changePageSize(this.value)">
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

  // ==================== 留样登记（触发 SAP 311） ====================

  openRegister() {
    const plantOpts = this.plantOptions.map(p => `<option value="${p.code}">${p.code} ${p.name}</option>`).join('');
    const typeOpts = this.sampleTypeOptions.map(t => `<option value="${t.code}">${t.name}</option>`).join('');
    const batchOpts = this.sampleData.slice(0, 8).map(s =>
      `<option value="${s.id}">${s.inspectBatchNo || '—'} · ${s.materialName}</option>`).join('');

    showModal('留样登记', `
      <div style="padding:4px 0;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#1e293b;">
          登记后按留样规则带出留样量、保存条件与到期日，并向 SAP 发起 <b>移动类型 311</b> 库存转储（生产/仓库库位 → 留样室库位），过账成功后生成物料凭证号。
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>工厂 <span class="req">*</span></label><select id="rgPlant">${plantOpts}</select></div>
          <div class="form-group"><label>关联检验批 <span class="req">*</span></label><select id="rgBatch">${batchOpts}</select></div>
          <div class="form-group"><label>留样类型</label><select id="rgType">${typeOpts}</select></div>
          <div class="form-group"><label>留样量 <span class="req">*</span></label><input type="text" id="rgQty" value="0.500" placeholder="按规则带出，可覆盖"></div>
          <div class="form-group"><label>保存条件</label><input type="text" id="rgCondition" value="阴凉干燥处（≤25℃，RH≤60%）"></div>
          <div class="form-group"><label>保存期限规则</label><select id="rgKeepRule">
            <option value="有效期后 1 年">有效期后 1 年</option>
            <option value="有效期后 6 个月">有效期后 6 个月</option>
            <option value="放行后 3 年">放行后 3 年</option>
          </select></div>
          <div class="form-group"><label>有效期</label><input type="date" id="rgValid" value="2028-05-31"></div>
          <div class="form-group"><label>观察频次</label><select id="rgFreq">
            <option value="每 12 个月">每 12 个月</option>
            <option value="每 6 个月">每 6 个月</option>
            <option value="每 3 个月">每 3 个月</option>
          </select></div>
        </div>
        <label style="display:flex;align-items:center;gap:8px;margin-top:16px;font-size:13px;">
          <input type="checkbox" id="rgPrint" checked> 登记后打印条码标签（留样编号 / 物料 / 批次 / 到期日）
        </label>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认登记', cls: 'btn-primary', action: () => RetentionSample.submitRegister() }
    ], 'modal-md');
  },

  submitRegister() {
    const batchId = (document.getElementById('rgBatch') || {}).value;
    const src = this.sampleData.find(s => s.id === batchId);
    const qty = (document.getElementById('rgQty') || {}).value || '0';
    const validDate = (document.getElementById('rgValid') || {}).value || '2028-05-31';
    const plant = (document.getElementById('rgPlant') || {}).value || '2001';
    // 到期日按「有效期后 1 年」计算
    const due = new Date(new Date(validDate).getTime() + 365 * 86400000);
    const dueDate = due.toISOString().substring(0, 10);
    const seq = String(this.sampleData.length + 1).padStart(3, '0');

    const rec = {
      id: 'S' + (900 + this.sampleData.length),
      sampleNo: 'LS-' + plant + '-26' + seq,
      plant: plant,
      materialCode: src ? src.materialCode : 'MAT-NEW',
      materialName: src ? src.materialName : '待确认物料',
      sampleType: (document.getElementById('rgType') || {}).value || 'RM',
      sourceBatch: src ? src.sourceBatch : '',
      inspectBatchNo: src ? (src.inspectBatchNo || '') : '',
      sampleQty: qty, remainQty: qty, unit: src ? src.unit : 'KG',
      storageCondition: (document.getElementById('rgCondition') || {}).value || '',
      keepRule: (document.getElementById('rgKeepRule') || {}).value || '',
      room: '', cabinet: '', shelf: '', location: '',
      registerBy: (window.currentUser && window.currentUser.name) || '当前用户',
      registerTime: this._now(),
      validDate: validDate, dueDate: dueDate,
      observeFreq: (document.getElementById('rgFreq') || {}).value || '',
      nextObserveDate: validDate, status: 'REG',
      labelNo: 'LBL-20261023-' + seq,
      sapDocNo: '49000009' + String(60 + this.sampleData.length),
      sapMoveType: '311', sapSyncTime: this._now() + ':03'
    };
    this.sampleData.unshift(rec);
    closeModal();
    this.init();
    toast(`登记成功：${rec.sampleNo} · SAP 物料凭证 ${rec.sapDocNo}（311），待指定留样位置入库`);
  },

  _now() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  },

  // 入库：指定位置，状态 → 在库
  openPutaway(sid) {
    const s = this.sampleData.find(x => x.id === sid);
    if (!s) return;
    showModal('留样入库 — 指定位置', `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          ${esc(s.sampleNo)} · ${esc(s.materialName)} · ${esc(s.sampleQty)} ${esc(s.unit)} · 保存条件：${esc(s.storageCondition)}
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
          <div class="form-group"><label>留样室</label><input type="text" id="pwRoom" value="${esc(s.room || '留样室A')}"></div>
          <div class="form-group"><label>柜</label><input type="text" id="pwCabinet" value="${esc(s.cabinet || 'A-01')}"></div>
          <div class="form-group"><label>层</label><input type="text" id="pwShelf" value="${esc(s.shelf || '1 层')}"></div>
        </div>
        <div class="form-group" style="margin-top:14px;"><label>位置编码</label><input type="text" id="pwLoc" value="${esc(s.location || 'A-01-01-01')}"></div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认入库', cls: 'btn-primary', action: () => {
        s.room = (document.getElementById('pwRoom') || {}).value || '';
        s.cabinet = (document.getElementById('pwCabinet') || {}).value || '';
        s.shelf = (document.getElementById('pwShelf') || {}).value || '';
        s.location = (document.getElementById('pwLoc') || {}).value || '';
        s.status = 'STORED';
        closeModal(); RetentionSample.init();
        toast('入库完成，留样状态更新为「在库」');
      } }
    ], 'modal-md');
  },

  // ==================== 调用与归还（只动台账，不过账） ====================

  openCall(sid) {
    const s = this.sampleData.find(x => x.id === sid);
    if (!s) return;
    showModal('留样调用 — 需审批与电子签名', `
      <div style="padding:4px 0;">
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          ${esc(s.sampleNo)} · ${esc(s.materialName)} · 当前余量 <b>${esc(s.remainQty)} ${esc(s.unit)}</b>。调用只登记台账，不做 SAP 库存移动；归还时需确认样品状态。
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>取用人 <span class="req">*</span></label><input type="text" id="clBy" value="孙工"></div>
          <div class="form-group"><label>部门</label><input type="text" id="clDept" value="质量部"></div>
          <div class="form-group"><label>用途 <span class="req">*</span></label><select id="clPurpose">
            <option>客户投诉复验</option><option>偏差/OOS 调查</option><option>稳定性对比</option><option>注册申报</option><option>其他</option>
          </select></div>
          <div class="form-group"><label>取用数量 <span class="req">*</span></label><input type="text" id="clQty" value="0.100"></div>
        </div>
        <div class="form-group" style="margin-top:14px;"><label>用途说明</label><input type="text" id="clRemark" placeholder="如 投诉单号 / 调查单号"></div>
        <label style="display:flex;align-items:center;gap:8px;margin-top:14px;font-size:13px;">
          <input type="checkbox" id="clSign" checked> 申请人电子签名（审批人：QA 经理）
        </label>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '提交调用', cls: 'btn-primary', action: () => {
        const qty = Number((document.getElementById('clQty') || {}).value || 0);
        if (qty <= 0) return toast('请填写取用数量');
        if (qty > Number(s.remainQty)) return toast('取用数量不能大于当前余量');
        s.calls = s.calls || [];
        s.calls.push({
          callNo: 'CALL-20261023-' + String(s.calls.length + 1).padStart(2, '0'),
          by: (document.getElementById('clBy') || {}).value || '',
          dept: (document.getElementById('clDept') || {}).value || '',
          purpose: (document.getElementById('clPurpose') || {}).value + ((document.getElementById('clRemark') || {}).value ? '（' + (document.getElementById('clRemark') || {}).value + '）' : ''),
          qty: String(qty), unit: s.unit, time: this._now(),
          approveBy: 'QA经理', sign: '电子签名已签', returnTime: '', returnBy: ''
        });
        s.remainQty = String((Number(s.remainQty) - qty).toFixed(3));
        s.status = 'CALLED';
        closeModal(); RetentionSample.init();
        toast('调用已登记（审批与电子签名完成），留样状态更新为「调用中」');
      } }
    ], 'modal-md');
  },

  openReturn(sid) {
    const s = this.sampleData.find(x => x.id === sid);
    if (!s) return;
    showModal('留样归还', `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          ${esc(s.sampleNo)} · ${esc(s.materialName)} · 当前余量 ${esc(s.remainQty)} ${esc(s.unit)}
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;">
          <div class="form-group"><label>归还人</label><input type="text" id="rtBy" value="孙工"></div>
          <div class="form-group"><label>归还时间</label><input type="text" id="rtTime" value="${esc(this._now())}"></div>
        </div>
        <div class="form-group" style="margin-top:14px;"><label>样品状态确认</label><select id="rtCond">
          <option value="OK">完好，可继续留样</option>
          <option value="NG">破损 / 污染，建议销毁</option>
        </select></div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认归还', cls: 'btn-primary', action: () => {
        const last = (s.calls || [])[s.calls.length - 1];
        if (last && !last.returnTime) {
          last.returnTime = (document.getElementById('rtTime') || {}).value || '';
          last.returnBy = (document.getElementById('rtBy') || {}).value || '';
        }
        const cond = (document.getElementById('rtCond') || {}).value;
        s.status = cond === 'NG' ? 'EXPIRED' : 'STORED';
        closeModal(); RetentionSample.init();
        toast(cond === 'NG' ? '已归还并标记异常，建议尽快发起销毁申请' : '归还完成，留样状态回到「在库」');
      } }
    ], 'modal-sm');
  },

  // ==================== 留样观察 ====================

  openObserveForm(oid) {
    const o = this.observeData.find(x => x.id === oid);
    if (!o) return;
    showModal('留样观察记录 — ' + o.sampleNo, `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          ${esc(o.taskNo)} · 第 ${o.seq} / ${o.total} 次 · 计划 ${esc(o.planDate)} · 观察项目：${esc(o.item)}
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>观察日期</label><input type="date" id="obDate" value="${esc(o.actualDate || '2026-10-23')}"></div>
          <div class="form-group"><label>观察人</label><input type="text" id="obBy" value="${esc(o.observer || '李工')}"></div>
          <div class="form-group"><label>观察结果</label><select id="obResult">
            <option value="OK" ${o.result === 'OK' ? 'selected' : ''}>正常</option>
            <option value="NG" ${o.result === 'NG' ? 'selected' : ''}>异常</option>
          </select></div>
        </div>
        <div class="form-group" style="margin-top:14px;"><label>观察记录</label>
          <textarea id="obRemark" rows="3" placeholder="外观、包装密封性、色泽等描述">${esc(o.remark || '')}</textarea>
        </div>
        <label style="display:flex;align-items:center;gap:8px;margin-top:12px;font-size:13px;">
          <input type="checkbox" id="obRaise" ${o.result === 'NG' ? 'checked' : ''}> 结果为异常时，一键发起质量异常（偏差/OOS 流程）
        </label>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '保存观察', cls: 'btn-primary', action: () => {
        const result = (document.getElementById('obResult') || {}).value;
        const raise = (document.getElementById('obRaise') || {}).checked;
        o.actualDate = (document.getElementById('obDate') || {}).value || '';
        o.observer = (document.getElementById('obBy') || {}).value || '';
        o.result = result;
        o.remark = (document.getElementById('obRemark') || {}).value || '';
        if (result === 'NG' && raise && !o.abnormalNo) o.abnormalNo = 'QA-20261023-011';
        closeModal(); RetentionSample.init();
        toast(result === 'NG' ? ('观察已记录为异常' + (o.abnormalNo ? '，已发起质量异常 ' + o.abnormalNo : '')) : '观察记录已保存');
      } }
    ], 'modal-md');
  },

  // ==================== 销毁：申请 → 审批 → 执行（触发 SAP 551） ====================

  openDestroyApply(sid) {
    const s = this.sampleData.find(x => x.id === sid);
    if (!s) return;
    if (s.status === 'DESTROY_APPLY') return toast('该留样已在销毁审批中');
    showModal('销毁申请 — ' + s.sampleNo, `
      <div style="padding:4px 0;">
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          ${esc(s.materialName)} · 剩余 ${esc(s.remainQty)} ${esc(s.unit)} · 留样到期日 ${esc(s.dueDate)}。
          QA 审批通过并执行销毁时，才向 SAP 发起 <b>移动类型 551</b> 报废过账。
        </div>
        <div class="form-group"><label>申请原因 <span class="req">*</span></label><select id="dyReason">
          <option value="留样到期">留样到期</option>
          <option value="包装破损/污染">包装破损 / 污染</option>
          <option value="观察异常">观察异常</option>
          <option value="其他">其他</option>
        </select></div>
        <div class="form-group" style="margin-top:14px;"><label>申请说明</label>
          <textarea id="dyRemark" rows="3" placeholder="补充说明（如异常单号、评估结论）"></textarea></div>
        <div class="form-group" style="margin-top:14px;"><label>销毁数量</label><input type="text" id="dyQty" value="${esc(s.remainQty)}"></div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '提交审批', cls: 'btn-primary', action: () => {
        const reason = (document.getElementById('dyReason') || {}).value || '';
        const remark = (document.getElementById('dyRemark') || {}).value || '';
        const qty = (document.getElementById('dyQty') || {}).value || s.remainQty;
        this.destroyData.unshift({
          id: 'D' + (900 + this.destroyData.length),
          applyNo: 'DS-20261023-0' + (this.destroyData.length + 8),
          sampleId: s.id, sampleNo: s.sampleNo, plant: s.plant,
          materialCode: s.materialCode, materialName: s.materialName,
          qty: qty, unit: s.unit, dueDate: s.dueDate,
          reason: reason + (remark ? '（' + remark + '）' : ''),
          applyBy: (window.currentUser && window.currentUser.name) || '当前用户',
          applyTime: this._now(),
          approveBy: '', approveTime: '', approveResult: '',
          executeBy1: '', executeBy2: '', witness: '', method: '', destroyDate: '',
          sapDocNo: '', sapMoveType: '', status: 'APPLY'
        });
        s.status = 'DESTROY_APPLY';
        closeModal(); RetentionSample.switchTab('destroy');
        toast('销毁申请已提交，等待 QA 审批');
      } }
    ], 'modal-md');
  },

  openApprove(did) {
    const d = this.destroyData.find(x => x.id === did);
    if (!d) return;
    showModal('销毁审批 — ' + d.applyNo, `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;line-height:1.9;">
          留样：${esc(d.sampleNo)} · ${esc(d.materialName)}<br>
          数量：${esc(d.qty)} ${esc(d.unit)} · 留样到期日 ${esc(d.dueDate)}<br>
          申请原因：${esc(d.reason)}（${esc(d.applyBy)} ${esc(d.applyTime)}）
        </div>
        <div class="form-group"><label>审批结论 <span class="req">*</span></label><select id="apResult">
          <option value="同意销毁">同意销毁</option>
          <option value="驳回">驳回</option>
        </select></div>
        <div class="form-group" style="margin-top:14px;"><label>审批意见</label>
          <textarea id="apRemark" rows="3" placeholder="审批意见"></textarea></div>
        <div style="margin-top:12px;font-size:12px;color:var(--text-muted);">审批人：QA 经理 · 电子签名</div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '提交审批', cls: 'btn-primary', action: () => {
        const r = (document.getElementById('apResult') || {}).value;
        d.approveBy = 'QA经理';
        d.approveTime = this._now();
        d.approveResult = (document.getElementById('apRemark') || {}).value || r;
        d.status = r === '同意销毁' ? 'APPROVED' : 'REJECTED';
        const s = this.sampleData.find(x => x.id === d.sampleId);
        if (s) s.status = r === '同意销毁' ? 'DESTROY_APPLY' : (s.status === 'DESTROY_APPLY' ? 'STORED' : s.status);
        closeModal(); RetentionSample.init();
        toast(r === '同意销毁' ? '已批准，待双人签名执行销毁' : '已驳回');
      } }
    ], 'modal-md');
  },

  openExecuteDestroy(did) {
    const d = this.destroyData.find(x => x.id === did);
    if (!d) return;
    showModal('执行销毁 — ' + d.applyNo, `
      <div style="padding:4px 0;">
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          执行确认后将向 SAP 发起 <b>移动类型 551</b> 报废过账，并同步更新留样台账为「已销毁」、余量清零。操作不可撤销。
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>执行人 1 <span class="req">*</span></label><input type="text" id="exBy1" value="刘工"></div>
          <div class="form-group"><label>执行人 2 <span class="req">*</span></label><input type="text" id="exBy2" value="孙工"></div>
          <div class="form-group"><label>见证人</label><input type="text" id="exWitness" value="QA经理"></div>
          <div class="form-group"><label>销毁方式</label><select id="exMethod">
            ${this.destroyMethodOptions.map(m => `<option value="${m.code}">${m.name}</option>`).join('')}
          </select></div>
          <div class="form-group"><label>销毁日期</label><input type="date" id="exDate" value="2026-10-23"></div>
          <div class="form-group"><label>销毁数量</label><input type="text" id="exQty" value="${esc(d.qty)}"></div>
        </div>
        <label style="display:flex;align-items:center;gap:8px;margin-top:14px;font-size:13px;">
          <input type="checkbox" id="exSign" checked> 双人电子签名确认
        </label>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '执行销毁', cls: 'btn-danger', action: () => {
        const by1 = (document.getElementById('exBy1') || {}).value;
        const by2 = (document.getElementById('exBy2') || {}).value;
        if (!by1 || !by2) return toast('销毁必须双人签名');
        d.executeBy1 = by1; d.executeBy2 = by2;
        d.witness = (document.getElementById('exWitness') || {}).value || '';
        d.method = (document.getElementById('exMethod') || {}).value || '';
        d.destroyDate = (document.getElementById('exDate') || {}).value || '';
        d.sapDocNo = '5510000' + String(470 + this.destroyData.length);
        d.sapMoveType = '551';
        d.status = 'DONE';
        const s = this.sampleData.find(x => x.id === d.sampleId);
        if (s) {
          s.status = 'DESTROYED';
          s.remainQty = '0.000';
          s.destroyNo = d.applyNo;
          s.sapDestroyDoc = d.sapDocNo;
          s.sapDestroyMoveType = '551';
        }
        closeModal(); RetentionSample.init();
        toast(`销毁完成 · SAP 物料凭证 ${d.sapDocNo}（移动类型 551）`);
      } }
    ], 'modal-md');
  },

  openDestroyDetail(did) {
    const d = this.destroyData.find(x => x.id === did);
    if (!d) return;
    const m = this.getDestroyMeta(d.status);
    const methodName = (this.destroyMethodOptions.find(x => x.code === d.method) || {}).name || '—';
    showModal('销毁记录 — ' + d.applyNo, `
      <div style="padding:4px 0;font-size:13px;">
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px 24px;padding:14px 16px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;">
          <div><span style="color:var(--text-muted);">留样编号：</span>${esc(d.sampleNo)}</div>
          <div><span style="color:var(--text-muted);">状态：</span><span class="badge ${m.badge}">${esc(m.name)}</span></div>
          <div><span style="color:var(--text-muted);">物料：</span>${esc(d.materialCode)} ${esc(d.materialName)}</div>
          <div><span style="color:var(--text-muted);">数量：</span>${esc(d.qty)} ${esc(d.unit)}</div>
          <div><span style="color:var(--text-muted);">留样到期日：</span>${esc(d.dueDate)}</div>
          <div><span style="color:var(--text-muted);">申请原因：</span>${esc(d.reason)}</div>
          <div><span style="color:var(--text-muted);">申请人：</span>${esc(d.applyBy)} ${esc(d.applyTime)}</div>
          <div><span style="color:var(--text-muted);">审批：</span>${d.approveBy ? esc(d.approveBy) + ' ' + esc(d.approveTime) + ' · ' + esc(d.approveResult) : '—'}</div>
          <div><span style="color:var(--text-muted);">执行：</span>${d.executeBy1 ? esc(d.executeBy1) + ' / ' + esc(d.executeBy2) + '（见证 ' + esc(d.witness) + '）' : '—'}</div>
          <div><span style="color:var(--text-muted);">销毁方式：</span>${esc(methodName)} ${esc(d.destroyDate || '')}</div>
          <div><span style="color:var(--text-muted);">SAP 凭证：</span>${d.sapDocNo ? esc(d.sapDocNo) + '（移动类型 ' + esc(d.sapMoveType) + '）' : '—'}</div>
        </div>
      </div>`, [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-md');
  },

  // ==================== 台账详情（含调用与观察审计记录） ====================

  openDetail(sid) {
    const s = this.sampleData.find(x => x.id === sid);
    if (!s) return;
    const m = this.getStatusMeta(s.status);
    const calls = (s.calls || []).length
      ? `<table class="data-table">
          <thead><tr><th>调用单号</th><th>取用人</th><th>用途</th><th>数量</th><th>取用时间</th><th>归还</th></tr></thead>
          <tbody>${s.calls.map(c => `<tr>
            <td style="font-family:monospace;font-size:12px;">${esc(c.callNo)}</td>
            <td>${esc(c.by)}（${esc(c.dept)}）</td>
            <td style="font-size:12px;">${esc(c.purpose)}</td>
            <td>${esc(c.qty)} ${esc(c.unit)}</td>
            <td style="font-size:12px;">${esc(c.time)} · 审批 ${esc(c.approveBy)}</td>
            <td style="font-size:12px;">${c.returnTime ? esc(c.returnTime) + ' · ' + esc(c.returnBy) : '<span style="color:#dc2626;">未归还</span>'}</td>
          </tr>`).join('')}</tbody></table>`
      : '<div style="color:var(--text-muted);font-size:12px;margin-top:6px;">暂无调用记录</div>';
    const obs = this.observeData.filter(o => o.sampleId === s.id);
    const obsHtml = obs.length
      ? `<table class="data-table">
          <thead><tr><th>任务号</th><th>次序</th><th>计划</th><th>实际</th><th>结果</th><th>记录</th></tr></thead>
          <tbody>${obs.map(o => `<tr>
            <td style="font-family:monospace;font-size:12px;">${esc(o.taskNo)}</td>
            <td style="font-size:12px;">第 ${o.seq} / ${o.total} 次</td>
            <td style="font-size:12px;">${esc(o.planDate)}</td>
            <td style="font-size:12px;">${esc(o.actualDate || '—')}</td>
            <td>${o.result === 'OK' ? '<span class="badge badge-green">正常</span>' : o.result === 'NG' ? '<span class="badge badge-red">异常</span>' : '<span class="badge badge-gray">待观察</span>'}</td>
            <td style="font-size:12px;">${esc(o.remark || '—')}${o.abnormalNo ? '<div style="color:#dc2626;font-size:11px;">异常单 ' + esc(o.abnormalNo) + '</div>' : ''}</td>
          </tr>`).join('')}</tbody></table>`
      : '<div style="color:var(--text-muted);font-size:12px;margin-top:6px;">暂无观察任务</div>';

    showModal('留样详情 — ' + s.sampleNo, `
      <div style="padding:4px 0;font-size:13px;">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px 24px;padding:14px 16px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;">
          <div><span style="color:var(--text-muted);">状态：</span><span class="badge ${m.badge}">${esc(m.name)}</span></div>
          <div><span style="color:var(--text-muted);">工厂：</span>${esc(s.plant)} ${esc(this.getPlantName(s.plant))}</div>
          <div><span style="color:var(--text-muted);">留样类型：</span>${esc(this.getTypeName(s.sampleType))}</div>
          <div><span style="color:var(--text-muted);">物料：</span>${esc(s.materialCode)} ${esc(s.materialName)}</div>
          <div><span style="color:var(--text-muted);">来源批次：</span>${esc(s.sourceBatch || '—')}</div>
          <div><span style="color:var(--text-muted);">关联检验批：</span>${esc(s.inspectBatchNo || '—')}</div>
          <div><span style="color:var(--text-muted);">留样量：</span>${esc(s.sampleQty)} ${esc(s.unit)}（余 ${esc(s.remainQty)}）</div>
          <div><span style="color:var(--text-muted);">保存条件：</span>${esc(s.storageCondition)}</div>
          <div><span style="color:var(--text-muted);">保存期限规则：</span>${esc(s.keepRule)}</div>
          <div><span style="color:var(--text-muted);">位置：</span>${esc(s.room) || '—'} / ${esc(s.cabinet) || '—'} / ${esc(s.shelf) || '—'}（${esc(s.location) || '—'}）</div>
          <div><span style="color:var(--text-muted);">登记：</span>${esc(s.registerBy)} ${esc(s.registerTime)}</div>
          <div><span style="color:var(--text-muted);">条码标签：</span>${esc(s.labelNo)}</div>
          <div><span style="color:var(--text-muted);">有效期：</span>${esc(s.validDate)}</div>
          <div><span style="color:var(--text-muted);">留样到期日：</span>${esc(s.dueDate)}</div>
          <div><span style="color:var(--text-muted);">观察：</span>${esc(s.observeFreq)} · 下次 ${esc(s.nextObserveDate || '—')}</div>
          <div style="grid-column:span 3;"><span style="color:var(--text-muted);">SAP 登记凭证：</span>
            ${esc(s.sapDocNo)}（移动类型 ${esc(s.sapMoveType)}，${esc(s.sapSyncTime)}）
            ${s.destroyNo ? ` · 销毁单 ${esc(s.destroyNo)} · 报废凭证 ${esc(s.sapDestroyDoc || '—')}（移动类型 ${esc(s.sapDestroyMoveType || '551')}）` : ''}</div>
        </div>
        <div style="margin-top:18px;font-weight:700;">调用记录</div>
        ${calls}
        <div style="margin-top:18px;font-weight:700;">观察记录</div>
        ${obsHtml}
      </div>`, [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-lg');
  },

  // ==================== 留样规则配置 ====================

  openRuleConfig() {
    const rows = this.ruleData.map(r => `<tr>
      <td>${esc(r.plant)} ${esc(this.getPlantName(r.plant))}</td>
      <td style="font-family:monospace;font-size:12px;">${esc(r.materialCode)}</td>
      <td>${esc(r.materialName)}</td>
      <td>${esc(this.getTypeName(r.sampleType))}</td>
      <td>${r.needSample ? '<span class="badge badge-green">留样</span>' : '<span class="badge badge-gray">不留样</span>'}</td>
      <td>${esc(r.sampleQty)} ${esc(r.unit)}</td>
      <td style="font-size:12px;">${esc(r.storageCondition)}</td>
      <td style="font-size:12px;">${esc(r.keepRule)}</td>
      <td style="font-size:12px;">${esc(r.observeFreq)}${r.observeTimes ? ' · 共 ' + r.observeTimes + ' 次' : ''}</td>
    </tr>`).join('');

    showModal('留样规则配置', `
      <div style="padding:4px 0;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;margin-bottom:14px;font-size:13px;">
          按物料 / 产品设置是否留样、留样量、保存条件、保存期限规则（有效期后若干年或放行后若干年）与观察频次。留样登记时自动带出并计算到期日。
        </div>
        <table class="data-table">
          <thead><tr><th>工厂</th><th>物料编码</th><th>物料名称</th><th>类型</th><th>是否留样</th><th>留样量</th><th>保存条件</th><th>保存期限规则</th><th>观察频次</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`, [
      { text: '关闭', cls: 'btn-secondary', action: closeModal },
      { text: '新增规则', cls: 'btn-primary', action: () => toast('演示环境：规则新增待接后端接口') }
    ], 'modal-xl');
  },

  // ==================== 导出（当前页签的查询结果） ====================

  exportData() {
    if (!this.filtered || !this.filtered.length) return toast('无数据可导出');
    let head, lines = [];
    if (this.activeTab === 'ledger') {
      head = ['留样编号', '工厂', '物料编码', '物料名称', '留样类型', '来源批次', '留样量', '余量', '单位', '位置', '登记人', '登记时间', '有效期', '留样到期日', '下次观察', '状态', 'SAP 凭证'];
      this.filtered.forEach(s => lines.push([s.sampleNo, s.plant, s.materialCode, s.materialName, this.getTypeName(s.sampleType),
        s.sourceBatch, s.sampleQty, s.remainQty, s.unit, s.location, s.registerBy, s.registerTime, s.validDate, s.dueDate,
        s.nextObserveDate || '—', this.getStatusMeta(s.status).name, s.sapDocNo + '（' + s.sapMoveType + '）']));
    } else if (this.activeTab === 'observe') {
      head = ['观察任务号', '留样编号', '物料名称', '次序', '计划日期', '实际日期', '观察人', '观察项目', '结果', '观察记录', '异常单'];
      this.filtered.forEach(o => lines.push([o.taskNo, o.sampleNo, o.materialName, '第' + o.seq + '/' + o.total + '次',
        o.planDate, o.actualDate || '—', o.observer || '—', o.item,
        o.result === 'OK' ? '正常' : o.result === 'NG' ? '异常' : '待观察', o.remark || '—', o.abnormalNo || '—']));
    } else {
      head = ['申请单号', '工厂', '留样编号', '物料编码', '物料名称', '数量', '单位', '留样到期日', '申请原因', '申请人', '申请时间',
        '审批人', '审批结论', '执行人', '见证人', '销毁方式', '销毁日期', 'SAP 凭证', '状态'];
      this.filtered.forEach(d => lines.push([d.applyNo, d.plant, d.sampleNo, d.materialCode, d.materialName, d.qty, d.unit, d.dueDate,
        d.reason, d.applyBy, d.applyTime, d.approveBy || '—', d.approveResult || '—',
        (d.executeBy1 ? d.executeBy1 + ' / ' + d.executeBy2 : '—'), d.witness || '—',
        (this.destroyMethodOptions.find(x => x.code === d.method) || {}).name || '—', d.destroyDate || '—',
        d.sapDocNo ? d.sapDocNo + '（' + d.sapMoveType + '）' : '—', this.getDestroyMeta(d.status).name]));
    }
    const csv = '\uFEFF' + [head.join(',')].concat(lines.map(r => r.map(c => {
      const v = String(c == null ? '' : c);
      return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(','))).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const names = { ledger: '留样台账', observe: '留样观察', destroy: '到期处理与销毁' };
    a.download = names[this.activeTab] + '_' + new Date().toISOString().substring(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('已导出 ' + lines.length + ' 条');
  }
};
