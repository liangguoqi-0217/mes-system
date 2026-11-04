// ===== 样品台账（统一台账：留样 + 检验样品） =====
// 质量管理 → 样品管理 → 样品台账
//
// 设计原则（v2，2026-11-04 合并原留样管理）：
//   1. 一个台账、一条类别轴：category = RETENTION（留样）/ INSPECT（检验样品）；留样专属字段在检验样品上为空。
//   2. 状态只描述"东西在哪"，粗化为 4 态：待入库 → 在库 →（借出中）→ 已处置（终态）。
//      到期 / 待观察 / 待处置不是状态，是派生筛选（日期算出来、任务表查出来、标记打出来）。
//   3. 动作矩阵两类同构（上架 / 位置变更 / 调用 / 归还 / 处置），差异只在表单字段显隐。
//   4. 检验批管"结果与进度"，本台账只管"物理位置与保管"，禁止双头状态、不回写检验批。
//   5. MES 只做事实与结果录入，不做审批；销毁 / 返还 / 消耗只登记结果（审批在纸质 / eQMS）。
//   6. SAP 边界：仅留样过账——登记 311、销毁 551；检验样品不是库存，不过账。
//   7. 不接条码 / 硬件：定位靠输入样品编号 → 位置面包屑（位置树为公共主数据）。
//   8. 列表行项目只留「查看」，所有动作在查看弹窗顶部操作区按状态显隐。

const SampleLedger = {
  _version: '2.0-20261104',
  page: 1, pageSize: 10,
  filtered: [],
  moreOpen: false,

  // ==================== 字典 ====================
  categoryOptions: [
    { code: 'RETENTION', name: '留样', badge: 'badge-purple' },
    { code: 'INSPECT', name: '检验样品', badge: 'badge-blue' }
  ],

  statusFlow: [
    { code: 'REG', name: '待入库', badge: 'badge-yellow', desc: '已登记，待从位置树指定存放位置' },
    { code: 'STORED', name: '在库', badge: 'badge-green', desc: '已按位置树落位' },
    { code: 'CALLED', name: '借出中', badge: 'badge-purple', desc: '被取用 / 复测，待归还' },
    { code: 'DISPOSED', name: '已处置', badge: 'badge-gray', desc: '已销毁 / 返还 / 消耗（终态，只读）' }
  ],

  // 处置方式：categories 决定该类样品可选方式
  disposalModes: [
    { code: 'DESTROY', name: '销毁', categories: ['RETENTION', 'INSPECT'] },
    { code: 'RETURN', name: '返还送检方', categories: ['INSPECT'] },
    { code: 'CONSUME', name: '检验消耗', categories: ['INSPECT'] }
  ],

  destroyMethodOptions: [
    { code: 'INCINERATE', name: '焚烧' },
    { code: 'LANDFILL', name: '填埋' },
    { code: 'RETURN', name: '退回供应商' },
    { code: 'RECYCLE', name: '回收处理' },
    { code: 'SHRED', name: '手撕 / 剪碎（不可重复利用）' }
  ],

  plantOptions: [
    { code: '1000', name: '山东步长制药工厂' },
    { code: '2001', name: '陕西步长制药工厂' },
    { code: '2002', name: '山东丹红制药工厂' }
  ],

  // 14 类类别代码（检验样品编号规则，同受控文件）
  typeOptions: [
    { code: 'YC', name: '中药材及饮片' }, { code: 'YF', name: '原辅料' },
    { code: 'NBC', name: '内包材' }, { code: 'WBC', name: '外包材' },
    { code: 'CP', name: '成品' }, { code: 'ZJ', name: '中间产品' },
    { code: 'WD', name: '稳定性样' }, { code: 'GS', name: '工艺用水' },
    { code: 'KQ', name: '压缩空气' }, { code: 'HJ', name: '环境监测' },
    { code: 'YZ', name: '验证类' }, { code: 'WT', name: '外部委托' },
    { code: 'KY', name: '科研' }, { code: 'QT', name: '其他' }
  ],

  // 检验批 mock（"从检验批带出"登记用）
  inspectBatchOptions: [
    { no: '100000013780', materialCode: 'MAT-10011', materialName: '硬脂酸镁', batch: 'SAP-BT-20261022', type: 'YF', unit: 'KG' },
    { no: '100000013755', materialCode: 'MAT-20006', materialName: '当归饮片', batch: 'SAP-BT-20261028', type: 'YC', unit: 'KG' },
    { no: '100000013742', materialCode: 'MAT-20010', materialName: '铝塑板', batch: 'SAP-BT-20261030', type: 'NBC', unit: '㎡' },
    { no: '100000013736', materialCode: 'MAT-30002', materialName: '丹红注射液', batch: 'SAP-BT-20261101', type: 'CP', unit: '支' },
    { no: '100000013721', materialCode: 'MAT-90001', materialName: '纯化水', batch: 'SAP-BT-20261103', type: 'GS', unit: 'L' }
  ],

  getStatusMeta(code) {
    return this.statusFlow.find(s => s.code === code) || { code: code, name: code, badge: 'badge-gray', desc: '—' };
  },
  getTypeName(code) {
    const t = this.typeOptions.find(x => x.code === code);
    return t ? t.name : '—';
  },
  getPlantName(code) {
    const p = this.plantOptions.find(x => x.code === code);
    return p ? p.name : code;
  },
  getMethodName(code) {
    const m = this.destroyMethodOptions.find(x => x.code === code);
    return m ? m.name : '—';
  },
  getDisposalName(code) {
    const m = this.disposalModes.find(x => x.code === code);
    return m ? m.name : '—';
  },
  isRetention(s) { return s.category === 'RETENTION'; },

  // ==================== 位置树引用（js/core/sample-locations.js） ====================
  locOf(s) {
    if (s.locCode) return s.locCode;
    if (!window.SampleLocations) return '';
    return this._resolveLoc(s);
  },

  // 历史留样数据无 locCode，按 留样室/柜/层 名称匹配位置树
  _resolveLoc(s) {
    if (s._locCode !== undefined) return s._locCode;
    s._locCode = '';
    const norm = t => String(t || '').replace(/\s+/g, '');
    const room = SampleLocations.getRoots().find(n => norm(n.name) === norm(s.room));
    if (room) {
      const cab = SampleLocations.getChildren(room.code).find(c => norm(c.name).indexOf(norm(s.cabinet)) !== -1);
      if (cab) {
        const shf = SampleLocations.getChildren(cab.code).find(c => norm(c.name) === norm(s.shelf));
        s._locCode = shf ? shf.code : cab.code;
      } else {
        s._locCode = room.code;
      }
    }
    return s._locCode;
  },

  // ==================== 留样规则（物料维度，登记时带出） ====================
  ruleData: [
    { id: 'R01', plant: '2001', materialCode: 'MAT-10005', materialName: '布洛芬原料药', needSample: true, sampleQty: '0.500', unit: 'KG', storageCondition: '阴凉干燥处（≤25℃，RH≤60%）', keepRule: '有效期后 1 年', observeFreq: '每 12 个月', observeTimes: 3 },
    { id: 'R02', plant: '2001', materialCode: 'MAT-20002', materialName: '布洛芬缓释胶囊', needSample: true, sampleQty: '2.000', unit: '盒', storageCondition: '密封、室温（10~30℃）', keepRule: '有效期后 1 年', observeFreq: '每 12 个月', observeTimes: 3 },
    { id: 'R03', plant: '2001', materialCode: 'MAT-10009', materialName: '甘露醇辅料', needSample: true, sampleQty: '0.300', unit: 'KG', storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月', observeFreq: '每 12 个月', observeTimes: 2 },
    { id: 'R04', plant: '2002', materialCode: 'MAT-30002', materialName: '丹红注射液', needSample: true, sampleQty: '4.000', unit: '支', storageCondition: '避光、阴凉处（2~8℃）', keepRule: '有效期后 1 年', observeFreq: '每 6 个月', observeTimes: 6 },
    { id: 'R05', plant: '2002', materialCode: 'MAT-30003', materialName: '注射用水', needSample: false, sampleQty: '0.000', unit: 'L', storageCondition: '—', keepRule: '不留样', observeFreq: '—', observeTimes: 0 },
    { id: 'R06', plant: '1000', materialCode: 'MAT-10006', materialName: '维生素C原料', needSample: true, sampleQty: '0.500', unit: 'KG', storageCondition: '避光、密封、干燥处', keepRule: '放行后 3 年', observeFreq: '每 12 个月', observeTimes: 3 }
  ],

  // ==================== 台账数据（内存 mock，两类同表） ====================
  data: [
    // ---------- 留样（原留样台账数据，状态按 4 态归一） ----------
    { id: 'S001', category: 'RETENTION', sampleNo: 'LS-2001-2606001', plant: '2001', materialCode: 'MAT-10005', materialName: '布洛芬原料药',
      sourceBatch: 'SAP-BT-20260501', inspectBatchNo: '100000012301', qty: '0.500', remainQty: '0.500', unit: 'KG',
      storageCondition: '阴凉干燥处（≤25℃，RH≤60%）', keepRule: '有效期后 1 年',
      room: '留样室A', cabinet: 'A-03', shelf: '2 层', location: 'A-03-02-01',
      registerBy: '张工', registerTime: '2026-06-14 10:20', putawayTime: '2026-06-14 10:35',
      validDate: '2028-05-31', dueDate: '2029-05-31', observeFreq: '每 12 个月', nextObserveDate: '2027-06-14', status: 'STORED',
      labelNo: 'LBL-20260614-0001', sapDocNo: '4900000123', sapMoveType: '311', sapSyncTime: '2026-06-14 10:20:08', moves: [], calls: [] },

    { id: 'S002', category: 'RETENTION', sampleNo: 'LS-2001-2606002', plant: '2001', materialCode: 'MAT-20002', materialName: '布洛芬缓释胶囊',
      sourceBatch: 'SAP-BT-20260610', inspectBatchNo: '100000012305', qty: '2.000', remainQty: '2.000', unit: '盒',
      storageCondition: '密封、室温（10~30℃）', keepRule: '有效期后 1 年',
      room: '留样室A', cabinet: 'B-01', shelf: '1 层', location: 'B-01-01-02',
      registerBy: '李工', registerTime: '2026-06-20 09:10', putawayTime: '2026-06-20 09:25',
      validDate: '2025-12-31', dueDate: '2026-12-31', observeFreq: '每 12 个月', nextObserveDate: '2026-12-20', status: 'STORED',
      labelNo: 'LBL-20260620-0002', sapDocNo: '4900000140', sapMoveType: '311', sapSyncTime: '2026-06-20 09:10:12', moves: [], calls: [] },

    { id: 'S003', category: 'RETENTION', sampleNo: 'LS-2001-2509003', plant: '2001', materialCode: 'MAT-10009', materialName: '甘露醇辅料',
      sourceBatch: 'SAP-BT-20250918', inspectBatchNo: '100000009812', qty: '0.300', remainQty: '0.200', unit: 'KG',
      storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月',
      room: '留样室A', cabinet: 'C-02', shelf: '3 层', location: 'C-02-03-01',
      registerBy: '王工', registerTime: '2025-09-20 14:00', putawayTime: '2025-09-20 14:20',
      validDate: '2026-06-30', dueDate: '2026-12-31', observeFreq: '每 12 个月', nextObserveDate: '2026-12-20', status: 'CALLED',
      labelNo: 'LBL-20250920-0003', sapDocNo: '4900000088', sapMoveType: '311', sapSyncTime: '2025-09-20 14:00:05', moves: [],
      calls: [{ callNo: 'CALL-20261012-01', by: '孙工', dept: '质量部', purpose: '客户投诉复验（投诉单 TS-20261010-03）',
        qty: '0.100', unit: 'KG', time: '2026-10-12 10:30', returnTime: '', returnBy: '', returnCond: '' }] },

    { id: 'S004', category: 'RETENTION', sampleNo: 'LS-2002-2603004', plant: '2002', materialCode: 'MAT-30002', materialName: '丹红注射液',
      sourceBatch: 'SAP-BT-20260305', inspectBatchNo: '100000010233', qty: '4.000', remainQty: '4.000', unit: '支',
      storageCondition: '避光、阴凉处（2~8℃）', keepRule: '有效期后 1 年',
      room: '留样室B', cabinet: 'A-01', shelf: '1 层', location: 'B-A-01-01',
      registerBy: '赵工', registerTime: '2026-03-08 08:40', putawayTime: '2026-03-08 09:00',
      validDate: '2026-09-30', dueDate: '2027-09-30', observeFreq: '每 6 个月', nextObserveDate: '2027-03-08', status: 'STORED',
      labelNo: 'LBL-20260308-0004', sapDocNo: '4900000211', sapMoveType: '311', sapSyncTime: '2026-03-08 08:40:03', moves: [], calls: [] },

    { id: 'S005', category: 'RETENTION', sampleNo: 'LS-2001-2408005', plant: '2001', materialCode: 'MAT-10002', materialName: '阿莫西林原料药',
      sourceBatch: 'SAP-BT-20240801', inspectBatchNo: '100000007701', qty: '0.500', remainQty: '0.000', unit: 'KG',
      storageCondition: '阴凉干燥处（≤25℃）', keepRule: '有效期后 1 年',
      room: '留样室A', cabinet: 'A-01', shelf: '1 层', location: 'A-01-01-03',
      registerBy: '刘工', registerTime: '2024-08-05 11:00', putawayTime: '2024-08-05 11:15',
      validDate: '2025-12-31', dueDate: '2026-06-30', observeFreq: '每 12 个月', nextObserveDate: '—', status: 'DISPOSED',
      labelNo: 'LBL-20240805-0005', sapDocNo: '4900000071', sapMoveType: '311', sapSyncTime: '2024-08-05 11:00:02', moves: [], calls: [],
      disposal: { mode: 'DESTROY', date: '2026-09-05', by1: '刘工', by2: '孙工', witness: 'QA经理',
        method: 'INCINERATE', qty: '0.500', reason: '留样到期', sapDoc: '5510000451', sapMoveType: '551' } },

    { id: 'S006', category: 'RETENTION', sampleNo: 'LS-1000-2607006', plant: '1000', materialCode: 'MAT-10006', materialName: '维生素C原料',
      sourceBatch: 'SAP-BT-20260701', inspectBatchNo: '100000013211', qty: '0.500', remainQty: '0.500', unit: 'KG',
      storageCondition: '避光、密封、干燥处', keepRule: '放行后 3 年',
      room: '', cabinet: '', shelf: '', location: '',
      registerBy: '陈工', registerTime: '2026-07-03 15:30', putawayTime: '',
      validDate: '2027-06-30', dueDate: '2029-07-02', observeFreq: '每 12 个月', nextObserveDate: '2027-07-03', status: 'REG',
      labelNo: 'LBL-20260703-0006', sapDocNo: '4900000302', sapMoveType: '311', sapSyncTime: '2026-07-03 15:30:11', moves: [], calls: [] },

    { id: 'S007', category: 'RETENTION', sampleNo: 'LS-2001-2609007', plant: '2001', materialCode: 'MAT-20003', materialName: '稳心颗粒',
      sourceBatch: 'SAP-BT-20260902', inspectBatchNo: '100000013501', qty: '3.000', remainQty: '3.000', unit: '袋',
      storageCondition: '密封、阴凉干燥处', keepRule: '有效期后 1 年',
      room: '留样室A', cabinet: 'B-04', shelf: '2 层', location: 'B-04-02-01',
      registerBy: '周工', registerTime: '2026-09-05 10:00', putawayTime: '2026-09-05 10:20',
      validDate: '2027-08-31', dueDate: '2028-08-31', observeFreq: '每 12 个月', nextObserveDate: '2027-09-05', status: 'STORED',
      labelNo: 'LBL-20260905-0007', sapDocNo: '4900000311', sapMoveType: '311', sapSyncTime: '2026-09-05 10:00:07', moves: [], calls: [] },

    { id: 'S008', category: 'RETENTION', sampleNo: 'LS-2002-2506008', plant: '2002', materialCode: 'MAT-30004', materialName: '注射用灯盏花素',
      sourceBatch: 'SAP-BT-20250612', inspectBatchNo: '100000009120', qty: '6.000', remainQty: '5.000', unit: '支',
      storageCondition: '避光、密闭（2~8℃）', keepRule: '有效期后 1 年',
      room: '留样室B', cabinet: 'A-02', shelf: '2 层', location: 'B-A-02-02',
      registerBy: '赵工', registerTime: '2025-06-15 09:20', putawayTime: '2025-06-15 09:40',
      validDate: '2026-05-31', dueDate: '2027-05-31', observeFreq: '每 6 个月', nextObserveDate: '2026-12-15', status: 'STORED',
      labelNo: 'LBL-20250615-0008', sapDocNo: '4900000155', sapMoveType: '311', sapSyncTime: '2025-06-15 09:20:06', moves: [],
      calls: [{ callNo: 'CALL-20260720-02', by: '吴工', dept: '注册部', purpose: '注册申报补充资料',
        qty: '1.000', unit: '支', time: '2026-07-20 14:10', returnTime: '2026-08-02 09:00', returnBy: '吴工', returnCond: 'OK' }] },

    { id: 'S009', category: 'RETENTION', sampleNo: 'LS-2001-2405010', plant: '2001', materialCode: 'MAT-10010', materialName: '微晶纤维素',
      sourceBatch: 'SAP-BT-20240510', inspectBatchNo: '100000007412', qty: '0.300', remainQty: '0.300', unit: 'KG',
      storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月',
      room: '留样室A', cabinet: 'C-01', shelf: '1 层', location: 'C-01-01-02',
      registerBy: '张工', registerTime: '2024-05-12 16:00', putawayTime: '2024-05-12 16:20',
      validDate: '2025-05-31', dueDate: '2025-11-30', observeFreq: '每 12 个月', nextObserveDate: '—', status: 'STORED',
      labelNo: 'LBL-20240512-0009', sapDocNo: '4900000062', sapMoveType: '311', sapSyncTime: '2024-05-12 16:00:04', moves: [], calls: [] },

    { id: 'S010', category: 'RETENTION', sampleNo: 'LS-2002-2607011', plant: '2002', materialCode: 'MAT-30005', materialName: '冠心宁注射液',
      sourceBatch: 'SAP-BT-20260715', inspectBatchNo: '100000013622', qty: '4.000', remainQty: '4.000', unit: '支',
      storageCondition: '避光、阴凉处（2~8℃）', keepRule: '有效期后 1 年',
      room: '留样室B', cabinet: 'B-02', shelf: '1 层', location: 'B-B-02-01',
      registerBy: '钱工', registerTime: '2026-07-18 11:20', putawayTime: '2026-07-18 11:40',
      validDate: '2027-07-31', dueDate: '2028-07-31', observeFreq: '每 6 个月', nextObserveDate: '2027-01-18', status: 'STORED',
      labelNo: 'LBL-20260718-0010', sapDocNo: '4900000320', sapMoveType: '311', sapSyncTime: '2026-07-18 11:20:09', moves: [], calls: [] },

    { id: 'S011', category: 'RETENTION', sampleNo: 'LS-1000-2608012', plant: '1000', materialCode: 'MAT-10011', materialName: '硬脂酸镁',
      sourceBatch: 'SAP-BT-20260805', inspectBatchNo: '100000013780', qty: '0.200', remainQty: '0.200', unit: 'KG',
      storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月',
      room: '留样室C', cabinet: 'B-01', shelf: '3 层', location: 'C-B-01-03',
      registerBy: '孙工', registerTime: '2026-08-08 09:00', putawayTime: '2026-08-08 09:20',
      validDate: '2026-11-30', dueDate: '2027-05-31', observeFreq: '每 12 个月', nextObserveDate: '2027-08-08', status: 'STORED',
      labelNo: 'LBL-20260808-0011', sapDocNo: '4900000333', sapMoveType: '311', sapSyncTime: '2026-08-08 09:00:10', moves: [], calls: [] },

    { id: 'S012', category: 'RETENTION', sampleNo: 'LS-2001-2512013', plant: '2001', materialCode: 'MAT-10012', materialName: '乳糖',
      sourceBatch: 'SAP-BT-20251201', inspectBatchNo: '100000010010', qty: '0.300', remainQty: '0.300', unit: 'KG',
      storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月',
      room: '留样室A', cabinet: 'C-03', shelf: '1 层', location: 'C-03-01-01',
      registerBy: '李工', registerTime: '2025-12-03 13:40', putawayTime: '2025-12-03 14:00',
      validDate: '2026-10-31', dueDate: '2027-04-30', observeFreq: '每 12 个月', nextObserveDate: '2026-12-03', status: 'STORED',
      labelNo: 'LBL-20251203-0012', sapDocNo: '4900000166', sapMoveType: '311', sapSyncTime: '2025-12-03 13:40:02', moves: [], calls: [] },

    // ---------- 检验样品 ----------
    { id: 'P001', category: 'INSPECT', sampleNo: 'YF-2026-05-018', type: 'YF', plant: '2001', materialCode: 'MAT-10005', materialName: '布洛芬原料药',
      sourceBatch: 'SAP-BT-20260501', inspectBatchNo: '100000012301', qty: '0.500', remainQty: '0.350', unit: 'KG',
      storageCondition: '阴凉干燥处（≤25℃）', validDate: '2028-05-31', locCode: 'CAB-01-L2',
      registerBy: '张工', registerTime: '2026-05-18 09:20', putawayTime: '2026-05-18 09:40', status: 'STORED',
      moves: [{ time: '2026-05-18 09:40', from: '', to: 'CAB-01-L2', by: '张工', reason: '入库上架' }],
      calls: [{ callNo: 'CALL-20260902-01', by: '孙工', dept: '质量控制部', purpose: 'OOS 调查复测（QA-20260902-018）',
        qty: '0.150', unit: 'KG', time: '2026-09-02 10:10', returnTime: '2026-09-05 09:00', returnBy: '孙工', returnCond: 'OK' }] },

    { id: 'P002', category: 'INSPECT', sampleNo: 'YC-2026-04-102', type: 'YC', plant: '2001', materialCode: 'MAT-20004', materialName: '当归饮片',
      sourceBatch: 'SAP-BT-20260415', inspectBatchNo: '100000012102', qty: '1.000', remainQty: '0.800', unit: 'KG',
      storageCondition: '密闭、阴凉干燥处', validDate: '2027-04-15', locCode: 'DR-01-T1',
      registerBy: '李工', registerTime: '2026-04-20 14:00', putawayTime: '2026-04-20 14:20', status: 'STORED',
      moves: [{ time: '2026-04-20 14:20', from: '', to: 'DR-01-T1', by: '李工', reason: '入库上架' }], calls: [] },

    { id: 'P003', category: 'INSPECT', sampleNo: 'NBC-2026-06-045', type: 'NBC', plant: '2001', materialCode: 'MAT-20010', materialName: '铝塑板',
      sourceBatch: 'SAP-BT-20260612', inspectBatchNo: '100000012418', qty: '2.000', remainQty: '2.000', unit: '㎡',
      storageCondition: '常温干燥处', validDate: '2027-06-12', locCode: 'CAB-01-L1',
      registerBy: '王工', registerTime: '2026-06-15 10:30', putawayTime: '2026-06-15 10:50', status: 'STORED', moves: [], calls: [] },

    { id: 'P004', category: 'INSPECT', sampleNo: 'CP-2026-09-021', type: 'CP', plant: '2002', materialCode: 'MAT-30002', materialName: '丹红注射液',
      sourceBatch: 'SAP-BT-20260908', inspectBatchNo: '100000013012', qty: '12.000', remainQty: '10.000', unit: '支',
      storageCondition: '避光、阴凉处（2~8℃）', validDate: '2027-09-08', locCode: 'FRZ-01-L2-A',
      registerBy: '赵工', registerTime: '2026-09-10 08:40', putawayTime: '2026-09-10 09:00', status: 'STORED', moves: [], calls: [] },

    { id: 'P005', category: 'INSPECT', sampleNo: 'GS-2026-11-007', type: 'GS', plant: '2001', materialCode: 'MAT-90001', materialName: '纯化水',
      sourceBatch: '—', inspectBatchNo: '100000013690', qty: '0.500', remainQty: '0.500', unit: 'L',
      storageCondition: '冷藏（取样后 8h 内检验）', validDate: '2026-11-11', locCode: 'FRZ-01-L1-A',
      registerBy: '陈工', registerTime: '2026-11-04 07:50', putawayTime: '2026-11-04 08:05', status: 'STORED', moves: [], calls: [] },

    { id: 'P006', category: 'INSPECT', sampleNo: 'YF-2026-11-021', type: 'YF', plant: '2001', materialCode: 'MAT-10009', materialName: '甘露醇辅料',
      sourceBatch: 'SAP-BT-20261102', inspectBatchNo: '100000013705', qty: '0.300', remainQty: '0.300', unit: 'KG',
      storageCondition: '密闭、干燥处', validDate: '2027-11-02', locCode: '',
      registerBy: '周工', registerTime: '2026-11-03 15:30', putawayTime: '', status: 'REG', moves: [], calls: [] },

    { id: 'P007', category: 'INSPECT', sampleNo: 'ZJ-2026-10-033', type: 'ZJ', plant: '2001', materialCode: 'MAT-50001', materialName: '脑心通胶囊混合粉',
      sourceBatch: 'SAP-BT-20261005', inspectBatchNo: '100000013351', qty: '0.200', remainQty: '0.120', unit: 'KG',
      storageCondition: '密封、阴凉处', validDate: '2026-12-05', locCode: 'FRZ-02-D1',
      registerBy: '钱工', registerTime: '2026-10-06 16:00', putawayTime: '2026-10-06 16:20', status: 'CALLED',
      moves: [{ time: '2026-10-06 16:20', from: '', to: 'FRZ-02-D1', by: '钱工', reason: '入库上架' }],
      calls: [{ callNo: 'CALL-20261103-01', by: '吴工', dept: '质量部', purpose: '偏差调查取样（DEV-20261101-007）',
        qty: '0.080', unit: 'KG', time: '2026-11-03 09:30', returnTime: '', returnBy: '', returnCond: '' }] },

    { id: 'P008', category: 'INSPECT', sampleNo: 'WBC-2026-08-012', type: 'WBC', plant: '2001', materialCode: 'MAT-60002', materialName: '纸盒（12袋装）',
      sourceBatch: 'SAP-BT-20260810', inspectBatchNo: '100000012866', qty: '6.000', remainQty: '0.000', unit: '个',
      storageCondition: '常温', validDate: '—', locCode: 'CAB-01-L3',
      registerBy: '刘工', registerTime: '2026-08-12 11:00', putawayTime: '2026-08-12 11:15', status: 'DISPOSED', moves: [], calls: [],
      disposal: { mode: 'CONSUME', date: '2026-09-18', by1: '刘工', remark: '检验项目全部消耗' } },

    { id: 'P009', category: 'INSPECT', sampleNo: 'YC-2026-09-088', type: 'YC', plant: '2002', materialCode: 'MAT-20007', materialName: '黄芪饮片',
      sourceBatch: 'SAP-BT-20260901', inspectBatchNo: '100000013018', qty: '0.500', remainQty: '0.000', unit: 'KG',
      storageCondition: '密闭、阴凉干燥处', validDate: '2027-09-01', locCode: 'DR-01-T1',
      registerBy: '孙工', registerTime: '2026-09-03 09:10', putawayTime: '2026-09-03 09:30', status: 'DISPOSED', moves: [], calls: [],
      disposal: { mode: 'DESTROY', date: '2026-10-28', by1: '孙工', by2: '王工',
        method: 'SHRED', qty: '0.500', reason: '检验完成多余样品', remark: '手撕剪碎，不可重复利用' } },

    { id: 'P010', category: 'INSPECT', sampleNo: 'HJ-2026-11-004', type: 'HJ', plant: '2001', materialCode: '—', materialName: '洁净区沉降菌（D级 车间二）',
      sourceBatch: '—', inspectBatchNo: '100000013712', qty: '3.000', remainQty: '3.000', unit: '皿',
      storageCondition: '冷藏（培养后观察）', validDate: '2026-11-08', locCode: 'CAB-02-L1',
      registerBy: '陈工', registerTime: '2026-11-04 08:30', putawayTime: '2026-11-04 08:45', status: 'STORED', moves: [], calls: [] }
  ],

  // ==================== 留样观察任务（仅留样） ====================
  observeData: [
    { id: 'O001', sampleId: 'S002', seq: 1, total: 3, planDate: '2026-06-20', actualDate: '2026-06-22', observer: '李工', item: '外观、包装密封性', result: 'OK', remark: '外观完好，铝塑板密封良好，无变色', abnormalNo: '' },
    { id: 'O002', sampleId: 'S004', seq: 1, total: 6, planDate: '2026-09-08', actualDate: '2026-09-10', observer: '赵工', item: '外观、澄明度、安瓿完整性', result: 'NG', remark: '发现 2 支安瓿内可见少量白点，其余正常', abnormalNo: 'QA-20260910-006' },
    { id: 'O003', sampleId: 'S001', seq: 1, total: 3, planDate: '2027-06-14', actualDate: '', observer: '', item: '外观、包装完整性、色泽', result: '', remark: '', abnormalNo: '' },
    { id: 'O004', sampleId: 'S007', seq: 1, total: 3, planDate: '2027-09-05', actualDate: '', observer: '', item: '外观、包装密封性', result: '', remark: '', abnormalNo: '' },
    { id: 'O005', sampleId: 'S008', seq: 4, total: 6, planDate: '2026-12-15', actualDate: '', observer: '', item: '外观、澄明度、西林瓶完整性', result: '', remark: '', abnormalNo: '' },
    { id: 'O006', sampleId: 'S011', seq: 1, total: 2, planDate: '2027-08-08', actualDate: '', observer: '', item: '外观、包装完整性', result: '', remark: '', abnormalNo: '' },
    { id: 'O007', sampleId: 'S012', seq: 2, total: 2, planDate: '2026-12-03', actualDate: '', observer: '', item: '外观、结块情况', result: '', remark: '', abnormalNo: '' },
    { id: 'O008', sampleId: 'S003', seq: 2, total: 2, planDate: '2026-09-20', actualDate: '2026-09-21', observer: '王工', item: '外观、结块情况', result: 'OK', remark: '无结块、无变色', abnormalNo: '' },
    { id: 'O009', sampleId: 'S010', seq: 1, total: 6, planDate: '2027-01-18', actualDate: '', observer: '', item: '外观、澄明度', result: '', remark: '', abnormalNo: '' },
    { id: 'O010', sampleId: 'S002', seq: 2, total: 3, planDate: '2026-12-20', actualDate: '', observer: '', item: '外观、包装密封性', result: '', remark: '', abnormalNo: '' },
    { id: 'O011', sampleId: 'S004', seq: 2, total: 6, planDate: '2027-03-08', actualDate: '', observer: '', item: '外观、澄明度、安瓿完整性', result: '', remark: '', abnormalNo: '' },
    { id: 'O012', sampleId: 'S005', seq: 1, total: 3, planDate: '2025-08-05', actualDate: '2025-08-06', observer: '刘工', item: '外观、包装完整性、色泽', result: 'OK', remark: '外观正常，无结块', abnormalNo: '' }
  ],

  // ==================== 页面骨架 ====================
  render() {
    this.page = 1;
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">样品台账</div>
            <div style="font-size:13px;opacity:0.85;">留样 + 检验样品统一台账 · 位置定位 · 调用归还 · 观察销毁 · 全程追溯</div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
              onclick="SampleLedger.openRuleConfig()">留样规则</button>
            <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
              onclick="App.navigateTo('quality-management','sample-location','sample-location','位置管理')">位置管理</button>
            <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
              onclick="SampleLedger.openRegisterChoice()">+ 样品登记</button>
          </div>
        </div>

        <div id="sdFilterBar" style="flex-shrink:0;"></div>
        <div class="table-wrapper" id="sdTableWrapper" style="flex:1;overflow:auto;width:100%;min-width:0;"></div>
        <div id="sdPagination" style="flex-shrink:0;"></div>
      </div>`;
  },

  init() {
    this.renderFilterBar();
    if (window.QueryVariant) {
      QueryVariant.mount('sample-ledger');
      QueryVariant.restore('sample-ledger');
      QueryVariant.bindRecent('sample-ledger');
    }
    this.renderTable();
    this.renderPagination();
  },

  _val(id) {
    const e = document.getElementById(id);
    return e ? String(e.value || '').trim() : '';
  },

  search() { this.page = 1; this.renderTable(); this.renderPagination(); },
  toggleMore() { this.moreOpen = !this.moreOpen; this.renderFilterBar(); },

  // 占用统计注册见文件底部（脚本加载即注册，不依赖是否打开过本页）

  // ==================== 派生判断（不做状态，只算结果） ====================
  dueOf(s) { return s.dueDate || s.validDate || ''; },

  daysLeft(s) {
    const d = this.dueOf(s);
    if (!d || d === '—') return null;
    const due = new Date(d);
    if (isNaN(due.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((due - today) / 86400000);
  },

  hasPendingObserve(s) {
    return this.isRetention(s) && this.observeData.some(o => o.sampleId === s.id && !o.actualDate);
  },

  // ==================== 筛选栏 ====================
  renderFilterBar() {
    const el = document.getElementById('sdFilterBar');
    if (!el) return;
    const plantOpts = this.plantOptions.map(p => `<option value="${p.code}">${p.code} ${p.name}</option>`).join('');
    const catOpts = this.categoryOptions.map(c => `<option value="${c.code}">${c.name}</option>`).join('');
    const statOpts = this.statusFlow.map(s => `<option value="${s.code}">${s.name}</option>`).join('');
    const moreStyle = `display:${this.moreOpen ? 'flex' : 'none'};flex-wrap:wrap;gap:12px;width:100%;padding:0;border:none;background:transparent;`;

    el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
      <div class="filter-group"><label>工厂</label><select id="sdPlant"><option value="">全部</option>${plantOpts}</select></div>
      <div class="filter-group"><label>样品类别</label><select id="sdCategory"><option value="">全部</option>${catOpts}</select></div>
      <div class="filter-group"><label>样品编号 / 物料</label><input type="text" id="sdKeyword" placeholder="如 LS-2001 或 当归"></div>
      <div class="filter-group"><label>状态</label><select id="sdStatus">
        <option value="">全部</option>${statOpts}
        <option value="TO_OBSERVE">待观察（留样）</option>
        <option value="TO_DISPOSE">待处置</option>
      </select></div>
      ${FilterActions.render({ pageId: 'sample-ledger', scope: 'SampleLedger', onExport: 'exportData', onMore: 'toggleMore', moreOpen: this.moreOpen })}
      <div id="sdMoreBar" style="${moreStyle}">
        <div class="filter-group"><label>存放位置</label><input type="text" id="sdLoc" placeholder="如 3号冰箱 或 FRZ-01"></div>
        <div class="filter-group"><label>检验批号</label><input type="text" id="sdBatch" placeholder="如 100000013"></div>
        <div class="filter-group"><label>来源批次</label><input type="text" id="sdSourceBatch" placeholder="SAP 批次号"></div>
        <div class="filter-group"><label>剩余天数</label><select id="sdExpiry">
          <option value="">全部</option><option value="EXPIRED">已过期</option>
          <option value="D30">≤30 天</option><option value="D90">≤90 天</option>
        </select></div>
        <div class="filter-group"><label>登记日期从</label><input type="date" id="sdDateFrom"></div>
        <div class="filter-group"><label>至</label><input type="date" id="sdDateTo"></div>
      </div>
    </div>`;
  },

  // ==================== 台账表格 ====================
  renderTable() {
    const plant = this._val('sdPlant');
    const category = this._val('sdCategory');
    const kw = this._val('sdKeyword').toLowerCase();
    const status = this._val('sdStatus');
    const loc = this._val('sdLoc').toLowerCase();
    const batch = this._val('sdBatch').toLowerCase();
    const srcBatch = this._val('sdSourceBatch').toLowerCase();
    const expiry = this._val('sdExpiry');
    const dFrom = this._val('sdDateFrom');
    const dTo = this._val('sdDateTo');

    this.filtered = this.data.filter(s => {
      if (plant && s.plant !== plant) return false;
      if (category && s.category !== category) return false;
      if (batch && (s.inspectBatchNo || '').toLowerCase().indexOf(batch) === -1) return false;
      if (srcBatch && (s.sourceBatch || '').toLowerCase().indexOf(srcBatch) === -1) return false;
      if (dFrom && s.registerTime.substring(0, 10) < dFrom) return false;
      if (dTo && s.registerTime.substring(0, 10) > dTo) return false;
      if (loc) {
        const lc = this.locOf(s);
        const locText = ((lc ? SampleLocations.breadcrumbText(lc) + ' ' + lc : '') + ' ' +
          (s.room || '') + ' ' + (s.cabinet || '') + ' ' + (s.location || '')).toLowerCase();
        if (locText.indexOf(loc) === -1) return false;
      }
      if (expiry) {
        const days = this.daysLeft(s);
        if (days === null) return false;
        if (expiry === 'EXPIRED' && days >= 0) return false;
        if (expiry === 'D30' && (days < 0 || days > 30)) return false;
        if (expiry === 'D90' && (days < 0 || days > 90)) return false;
      }
      if (kw && (s.sampleNo + ' ' + s.materialCode + ' ' + s.materialName + ' ' +
        this.getTypeName(s.type)).toLowerCase().indexOf(kw) === -1) return false;
      if (status === 'TO_OBSERVE') return this.hasPendingObserve(s);
      if (status === 'TO_DISPOSE') return !!s.pendingDisposal;
      if (status && s.status !== status) return false;
      return true;
    });

    const { page } = this._paged(this.filtered);
    const el = document.getElementById('sdTableWrapper');
    if (!el) return;

    el.innerHTML = `<table class="data-table" style="min-width:1280px;">
      <thead><tr>
        <th style="width:165px;">样品编号</th>
        <th style="width:95px;">类别</th>
        <th style="width:180px;">物料</th>
        <th style="width:145px;">批次 / 检验批</th>
        <th style="width:110px;">数量 / 余量</th>
        <th style="width:185px;">存放位置</th>
        <th style="width:115px;">到期日</th>
        <th style="width:105px;">状态</th>
        <th style="width:70px;">操作</th>
      </tr></thead>
      <tbody>${page.length ? page.map(s => this.renderRow(s)).join('')
        : `<tr><td colspan="9" class="empty-cell">暂无符合条件的样品记录</td></tr>`}</tbody>
    </table>`;
  },

  renderRow(s) {
    const m = this.getStatusMeta(s.status);
    const cat = this.categoryOptions.find(c => c.code === s.category) || { badge: 'badge-gray' };
    const catHtml = this.isRetention(s)
      ? `<span class="badge ${cat.badge}" style="font-size:11px;">留样</span>`
      : `<span class="badge ${cat.badge}" style="font-size:11px;">${esc(s.type)}</span>
         <div style="color:var(--text-muted);font-size:11px;margin-top:2px;">${esc(this.getTypeName(s.type))}</div>`;

    const batchHtml = `<div style="font-family:monospace;font-size:12px;">${esc(s.sourceBatch || '—')}</div>
      <div style="color:var(--text-muted);font-family:monospace;font-size:11px;">检验批 ${esc(s.inspectBatchNo || '—')}</div>`;

    const lc = this.locOf(s);
    const locHtml = lc
      ? SampleLocations.breadcrumbHtml(lc) +
        `<div style="color:var(--text-muted);font-family:monospace;font-size:11px;">${esc(lc)}</div>`
      : '<span style="color:var(--text-muted);">未入库</span>';

    const due = this.dueOf(s);
    const days = this.daysLeft(s);
    let dueHtml = `<span style="font-size:12px;">${esc(due || '—')}</span>`;
    if (days !== null) {
      if (days < 0) dueHtml += `<div style="color:#dc2626;font-size:11px;">已超期 ${-days} 天</div>`;
      else if (days <= 90) dueHtml += `<div style="color:#b45309;font-size:11px;">${days} 天后到期</div>`;
    }

    const marks = [];
    if (this.hasPendingObserve(s)) marks.push('<span class="badge badge-yellow" style="font-size:10px;padding:0 5px;">待观察</span>');
    if (s.pendingDisposal) marks.push('<span class="badge badge-red" style="font-size:10px;padding:0 5px;">待处置</span>');

    return `<tr>
      <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(s.sampleNo)}</td>
      <td>${catHtml}</td>
      <td>${esc(s.materialName)}
        <div style="color:var(--text-muted);font-family:monospace;font-size:11px;">${esc(s.materialCode)}</div></td>
      <td>${batchHtml}</td>
      <td style="font-size:12px;">${esc(s.qty)} / <b>${esc(s.remainQty)}</b> ${esc(s.unit)}</td>
      <td style="font-size:12px;">${locHtml}</td>
      <td>${dueHtml}</td>
      <td><span class="badge ${m.badge}">${esc(m.name)}</span>
        ${marks.length ? '<div style="margin-top:2px;">' + marks.join(' ') + '</div>' : ''}</td>
      <td><div class="table-actions">
        <button class="btn btn-blue btn-sm" onclick="SampleLedger.openDetail('${s.id}')">查看</button>
      </div></td>
    </tr>`;
  },

  _paged(list) {
    const pages = Math.max(1, Math.ceil(list.length / this.pageSize));
    if (this.page > pages) this.page = pages;
    const start = (this.page - 1) * this.pageSize;
    return { page: list.slice(start, start + this.pageSize), start: start };
  },

  // ==================== 登记：先弹方式选择（三选一） ====================
  openRegisterChoice() {
    const cards = [
      { title: '留样登记', emoji: '🧫',
        desc: '按留样规则带出留样量、保存条件与到期日<br>登记后过账 SAP 311（→ 留样室库位）',
        call: 'SampleLedger.openRegisterRetention()',
        bg: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', border: '#ddd6fe', hover: '#8b5cf6',
        titleColor: '#5b21b6', shadow: 'rgba(139,92,246,.12)',
        pill: '<span class="badge" style="padding:6px 18px;border-radius:16px;font-size:12px;background:#8b5cf6;color:#fff;cursor:pointer;">开始登记 →</span>' },
      { title: '从检验批带出', emoji: '📋',
        desc: '选择检验批，物料 / 批次 / 检验批号自动带入<br>适用于取样送检的常规检验样品（不过账）',
        call: 'SampleLedger.openRegisterFromBatch()',
        bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '#bfdbfe', hover: '#3b82f6',
        titleColor: '#1e40af', shadow: 'rgba(59,130,246,.12)',
        pill: '<span class="badge badge-blue" style="padding:6px 18px;border-radius:16px;font-size:12px;cursor:pointer;">开始登记 →</span>' },
      { title: '手动登记', emoji: '✍️',
        desc: '手工填写物料与来源信息<br>适用于环境监测、验证样等无请验单样品',
        call: 'SampleLedger.openRegisterManual()',
        bg: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', border: '#cbd5e1', hover: '#64748b',
        titleColor: '#334155', shadow: 'rgba(100,116,139,.12)',
        pill: '<span class="badge badge-gray" style="padding:6px 18px;border-radius:16px;font-size:12px;background:#64748b;color:#fff;cursor:pointer;">开始登记 →</span>' }
    ];
    const card = c => `
      <div onclick="closeModal();${c.call}"
        style="background:${c.bg};border:1.5px solid ${c.border};border-radius:12px;padding:22px 14px;cursor:pointer;transition:all .22s;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:190px;"
        onmouseenter="this.style.borderColor='${c.hover}';this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 14px ${c.shadow}'"
        onmouseleave="this.style.borderColor='${c.border}';this.style.transform='translateY(0)';this.style.boxShadow='none'">
        <div style="font-size:38px;margin-bottom:8px;">${c.emoji}</div>
        <div style="font-size:16px;font-weight:700;color:${c.titleColor};margin-bottom:6px;">${c.title}</div>
        <div style="font-size:12px;color:#4b5563;line-height:1.5;">${c.desc}</div>
        <div style="margin-top:14px;">${c.pill}</div>
      </div>`;

    showModal('📌 选择登记方式', `
      <div style="padding:8px 0;">
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px;text-align:center;">
          留样与检验样品同一台账管理，登记后状态为「待入库」，再走入库上架指定位置
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
          ${cards.map(card).join('')}
        </div>
      </div>`, [{ text: '取消', cls: 'btn-secondary', action: closeModal }], 'modal-lg');
  },

  _typeOpts(selected) {
    return this.typeOptions.map(t =>
      `<option value="${t.code}" ${selected === t.code ? 'selected' : ''}>${t.code} ${t.name}</option>`).join('');
  },
  _plantOpts(selected) {
    return this.plantOptions.map(p =>
      `<option value="${p.code}" ${selected === p.code ? 'selected' : ''}>${p.code} ${p.name}</option>`).join('');
  },

  // ---- 留样登记（SAP 311） ----
  openRegisterRetention() {
    const batchOpts = this.data.filter(s => s.inspectBatchNo).slice(0, 10).map(s =>
      `<option value="${s.id}">${s.inspectBatchNo} · ${s.materialName}</option>`).join('');

    showModal('留样登记', `
      <div style="padding:4px 0;">
        <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          登记后按留样规则带出留样量、保存条件与到期日，并向 SAP 发起 <b>移动类型 311</b> 库存转储（生产/仓库库位 → 留样室库位），过账成功后回写物料凭证号。
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>工厂 <span class="req">*</span></label><select id="rrPlant">${this._plantOpts('2001')}</select></div>
          <div class="form-group"><label>关联检验批 <span class="req">*</span></label><select id="rrBatch">${batchOpts}</select></div>
          <div class="form-group"><label>留样量 <span class="req">*</span></label><input type="text" id="rrQty" value="0.500" placeholder="按规则带出，可覆盖"></div>
          <div class="form-group"><label>保存条件</label><input type="text" id="rrCondition" value="阴凉干燥处（≤25℃，RH≤60%）"></div>
          <div class="form-group"><label>保存期限规则</label><select id="rrKeepRule">
            <option value="有效期后 1 年">有效期后 1 年</option>
            <option value="有效期后 6 个月">有效期后 6 个月</option>
            <option value="放行后 3 年">放行后 3 年</option>
          </select></div>
          <div class="form-group"><label>有效期</label><input type="date" id="rrValid" value="2028-05-31"></div>
          <div class="form-group"><label>观察频次</label><select id="rrFreq">
            <option value="每 12 个月">每 12 个月</option>
            <option value="每 6 个月">每 6 个月</option>
            <option value="每 3 个月">每 3 个月</option>
          </select></div>
        </div>
        <div style="margin-top:14px;font-size:12px;color:var(--text-muted);">
          样品标识照旧纸质样品签；登记完成后在台账「查看 → 入库上架」中从位置树指定留样位置。
        </div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认登记', cls: 'btn-primary', action: () => SampleLedger.submitRegister('retention') }
    ], 'modal-md');
  },

  // ---- 从检验批带出 ----
  openRegisterFromBatch() {
    const batchOpts = this.inspectBatchOptions.map(b =>
      `<option value="${b.no}" data-type="${b.type}" data-mc="${b.materialCode}" data-mn="${b.materialName}"
        data-batch="${b.batch}" data-unit="${b.unit}">${b.no} · ${b.materialName} · ${b.batch}</option>`).join('');

    showModal('样品登记 — 从检验批带出', `
      <div style="padding:4px 0;">
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          选择检验批后物料、批次自动带入；登记后状态为「待入库」，SAP 不做过账（检验样品不是库存）。
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>关联检验批 <span class="req">*</span></label>
            <select id="rbBatch" onchange="SampleLedger._onBatchChange()">${batchOpts}</select></div>
          <div class="form-group"><label>样品类别 <span class="req">*</span></label>
            <select id="rbType">${this._typeOpts('YF')}</select></div>
          <div class="form-group"><label>物料</label><input type="text" id="rbMaterial" readonly style="background:#f3f4f6;"></div>
          <div class="form-group"><label>来源批次</label><input type="text" id="rbSourceBatch" readonly style="background:#f3f4f6;"></div>
          <div class="form-group"><label>样品数量 <span class="req">*</span></label><input type="text" id="rbQty" value="0.500"></div>
          <div class="form-group"><label>保存条件</label><input type="text" id="rbCondition" placeholder="如 阴凉干燥处（≤25℃）"></div>
          <div class="form-group"><label>有效期 / 保存期限</label><input type="date" id="rbValid"></div>
        </div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认登记', cls: 'btn-primary', action: () => SampleLedger.submitRegister('batch') }
    ], 'modal-md');

    this._onBatchChange();
  },

  _onBatchChange() {
    const sel = document.getElementById('rbBatch');
    if (!sel) return;
    const opt = sel.options[sel.selectedIndex];
    if (!opt) return;
    const d = opt.dataset;
    const mat = document.getElementById('rbMaterial');
    const sb = document.getElementById('rbSourceBatch');
    const tp = document.getElementById('rbType');
    if (mat) mat.value = (d.mc || '') + ' ' + (d.mn || '');
    if (sb) sb.value = d.batch || '';
    if (tp && d.type) tp.value = d.type;
  },

  // ---- 手动登记 ----
  openRegisterManual() {
    showModal('样品登记 — 手动登记', `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          物料从主数据口径手工填写（环境监测 / 验证样等无请验单样品）；登记后状态为「待入库」。
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>工厂 <span class="req">*</span></label>
            <select id="rmPlant">${this._plantOpts('2001')}</select></div>
          <div class="form-group"><label>样品类别 <span class="req">*</span></label>
            <select id="rmType">${this._typeOpts('HJ')}</select></div>
          <div class="form-group"><label>物料编码</label><input type="text" id="rmMaterialCode" placeholder="无则填 —"></div>
          <div class="form-group"><label>物料 / 样品名称 <span class="req">*</span></label><input type="text" id="rmMaterialName" placeholder="如 洁净区沉降菌（D级 车间一）"></div>
          <div class="form-group"><label>来源批次</label><input type="text" id="rmSourceBatch" placeholder="如 —"></div>
          <div class="form-group"><label>检验批号</label><input type="text" id="rmInspectBatch" placeholder="可空"></div>
          <div class="form-group"><label>样品数量 <span class="req">*</span></label><input type="text" id="rmQty" value="1.000"></div>
          <div class="form-group"><label>单位</label><input type="text" id="rmUnit" value="皿"></div>
          <div class="form-group"><label>保存条件</label><input type="text" id="rmCondition" placeholder="如 冷藏"></div>
        </div>
        <div class="form-group" style="margin-top:6px;"><label>有效期 / 保存期限</label><input type="date" id="rmValid"></div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认登记', cls: 'btn-primary', action: () => SampleLedger.submitRegister('manual') }
    ], 'modal-md');
  },

  submitRegister(mode) {
    const now = this._now();
    let rec;

    if (mode === 'retention') {
      const src = this.data.find(s => s.id === this._val('rrBatch'));
      const qty = this._val('rrQty');
      if (!qty || Number(qty) <= 0) return toast('请填写留样量');
      const validDate = this._val('rrValid') || '2028-05-31';
      const plant = this._val('rrPlant') || '2001';
      const keepRule = this._val('rrKeepRule');
      const months = keepRule === '有效期后 6 个月' ? 6 : (keepRule === '放行后 3 年' ? 36 : 12);
      const due = new Date(validDate);
      due.setMonth(due.getMonth() + months);
      const seq = String(this.data.filter(r => this.isRetention(r)).length + 1).padStart(3, '0');
      const sapDoc = '49000009' + String(60 + this.data.length);

      this.data.unshift({
        id: 'S' + (900 + this.data.length),
        category: 'RETENTION',
        sampleNo: 'LS-' + plant + '-26' + seq,
        plant: plant,
        materialCode: src ? src.materialCode : 'MAT-NEW',
        materialName: src ? src.materialName : '待确认物料',
        sourceBatch: src ? src.sourceBatch : '',
        inspectBatchNo: src ? (src.inspectBatchNo || '') : '',
        qty: qty, remainQty: qty, unit: src ? src.unit : 'KG',
        storageCondition: this._val('rrCondition'),
        keepRule: keepRule,
        room: '', cabinet: '', shelf: '', location: '', locCode: '',
        registerBy: this._user(), registerTime: now, putawayTime: '',
        validDate: validDate, dueDate: due.toISOString().substring(0, 10),
        observeFreq: this._val('rrFreq'),
        nextObserveDate: due.toISOString().substring(0, 10),
        status: 'REG',
        labelNo: 'LBL-' + now.substring(0, 10).replace(/-/g, '') + '-' + seq,
        sapDocNo: sapDoc, sapMoveType: '311', sapSyncTime: now + ':03',
        moves: [], calls: []
      });
      const no = this.data[0].sampleNo;
      closeModal(); this.init();
      toast('登记成功：' + no + ' · SAP 物料凭证 ' + sapDoc + '（311），待指定留样位置入库');
      return;
    }

    if (mode === 'batch') {
      const sel = document.getElementById('rbBatch');
      const opt = sel ? sel.options[sel.selectedIndex] : null;
      const d = opt ? opt.dataset : {};
      const qty = this._val('rbQty');
      if (!qty || Number(qty) <= 0) return toast('请填写样品数量');
      rec = {
        id: 'P' + (900 + this.data.length), category: 'INSPECT', plant: '2001',
        type: this._val('rbType') || d.type || 'QT',
        materialCode: d.mc || '—', materialName: d.mn || '待确认样品',
        sourceBatch: d.batch || '', inspectBatchNo: d.no || '',
        qty: qty, remainQty: qty, unit: d.unit || '',
        storageCondition: this._val('rbCondition'),
        validDate: this._val('rbValid') || '—',
        locCode: '', registerBy: this._user(), registerTime: now, putawayTime: '',
        status: 'REG', moves: [], calls: []
      };
    } else {
      const name = this._val('rmMaterialName');
      if (!name) return toast('请填写物料 / 样品名称');
      const qty = this._val('rmQty');
      if (!qty || Number(qty) <= 0) return toast('请填写样品数量');
      rec = {
        id: 'P' + (900 + this.data.length), category: 'INSPECT',
        plant: this._val('rmPlant') || '2001',
        type: this._val('rmType') || 'QT',
        materialCode: this._val('rmMaterialCode') || '—',
        materialName: name,
        sourceBatch: this._val('rmSourceBatch') || '—',
        inspectBatchNo: this._val('rmInspectBatch'),
        qty: qty, remainQty: qty, unit: this._val('rmUnit'),
        storageCondition: this._val('rmCondition'),
        validDate: this._val('rmValid') || '—',
        locCode: '', registerBy: this._user(), registerTime: now, putawayTime: '',
        status: 'REG', moves: [], calls: []
      };
    }
    rec.sampleNo = this._genSampleNo(rec.type);
    this.data.unshift(rec);
    closeModal(); this.init();
    toast('登记成功：' + rec.sampleNo + '（待入库），请在「查看 → 入库上架」中指定位置');
  },

  // 检验样品编号：类别代码-年-月-流水号（留样沿用 LS 规则）
  _genSampleNo(type) {
    const d = new Date();
    const ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    const prefix = type + '-' + ym + '-';
    const seq = this.data.filter(r => (r.sampleNo || '').indexOf(prefix) === 0).length + 1;
    return prefix + String(seq).padStart(3, '0');
  },

  _user() {
    return (window.currentUser && window.currentUser.name) || '当前用户';
  },

  _now() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  },

  // ==================== 动作：入库上架 / 位置变更 ====================
  openPutaway(sid) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    const isMove = s.status !== 'REG';
    SampleLocations.pick({
      title: (isMove ? '位置变更 — ' : '入库上架 — ') + s.sampleNo,
      currentNode: this.locOf(s),
      onPick: (code) => {
        if (isMove && code === s.locCode) return toast('新位置与当前位置相同');
        const from = SampleLedger.locOf(s) || '';
        const segs = SampleLocations.pathSegments(code);
        const room = segs.find(x => x.type === 'room');
        const cab = segs.find(x => x.type === 'fridge' || x.type === 'cabinet');
        const shf = segs.find(x => x.type === 'shelf' || x.type === 'box');
        if (SampleLedger.isRetention(s)) {
          s.room = room ? room.name : '';
          s.cabinet = cab ? cab.name : '';
          s.shelf = shf ? shf.name : '';
          s.location = code;
        }
        s.locCode = code;
        s._locCode = code;
        if (!isMove) s.putawayTime = SampleLedger._now();
        s.moves = s.moves || [];
        s.moves.push({ time: SampleLedger._now(), from: from, to: code, by: SampleLedger._user(),
          reason: isMove ? '位置变更' : '入库上架' });
        if (!isMove) s.status = 'STORED';
        SampleLedger.init();
        toast((isMove ? '位置已变更：' : '入库完成，位置：') + SampleLocations.breadcrumbText(code));
      }
    });
  },

  // ==================== 动作：调用登记 ====================
  openCall(sid) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    const consumeOption = this.isRetention(s) ? '' : `
      <label style="display:flex;align-items:center;gap:8px;margin-top:10px;font-size:13px;">
        <input type="checkbox" id="clConsume" checked> 取用后不再归还（检验消耗）
      </label>`;

    showModal('调用登记 — ' + s.sampleNo, `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          ${esc(s.sampleNo)} · ${esc(s.materialName)} · 当前余量 <b>${esc(s.remainQty)} ${esc(s.unit)}</b>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>领取人 <span class="req">*</span></label><input type="text" id="clBy" value="${esc(this._user())}"></div>
          <div class="form-group"><label>部门</label><input type="text" id="clDept" value="质量控制部"></div>
          <div class="form-group"><label>用途 <span class="req">*</span></label><select id="clPurpose">
            <option>客户投诉复验</option><option>偏差 / OOS 调查</option><option>复测</option>
            <option>稳定性对比</option><option>注册申报</option><option>验证 / 方法确认</option><option>其他</option>
          </select></div>
          <div class="form-group"><label>领用数量 <span class="req">*</span></label><input type="text" id="clQty" value="0.050"></div>
        </div>
        <div class="form-group" style="margin-top:6px;"><label>说明（单号 / 备注）</label>
          <input type="text" id="clRemark" placeholder="如 TS-20261010-03 / DEV-20261101-007"></div>
        ${consumeOption}
        <div style="margin-top:10px;font-size:12px;color:var(--text-muted);">
          调用只登记台账，不做 SAP 库存移动；审批在纸质 / eQMS 完成。
        </div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '登记调用', cls: 'btn-primary', action: () => {
        const by = SampleLedger._val('clBy');
        const qty = Number(SampleLedger._val('clQty') || 0);
        if (!by) return toast('请填写领取人');
        if (qty <= 0) return toast('请填写领用数量');
        if (qty > Number(s.remainQty)) return toast('领用数量不能大于当前余量');
        const remark = SampleLedger._val('clRemark');
        s.calls = s.calls || [];
        s.calls.push({
          callNo: 'CALL-' + new Date().toISOString().substring(0, 10).replace(/-/g, '') + '-' + String(s.calls.length + 1).padStart(2, '0'),
          by: by,
          dept: SampleLedger._val('clDept'),
          purpose: SampleLedger._val('clPurpose') + (remark ? '（' + remark + '）' : ''),
          qty: String(qty), unit: s.unit, time: SampleLedger._now(),
          returnTime: '', returnBy: '', returnCond: ''
        });
        s.remainQty = (Number(s.remainQty) - qty).toFixed(3);
        const consumeEl = document.getElementById('clConsume');
        const consume = consumeEl ? consumeEl.checked : false;
        if (consume && Number(s.remainQty) <= 0) {
          s.status = 'DISPOSED';
          s.disposal = { mode: 'CONSUME', date: SampleLedger._now().substring(0, 10), by1: by,
            remark: '调用消耗，余量清零' };
          toast('调用已登记，余量清零，样品转为「已处置（检验消耗）」');
        } else {
          s.status = 'CALLED';
          toast('调用已登记，状态更新为「借出中」');
        }
        closeModal(); SampleLedger.init();
      } }
    ], 'modal-md');
  },

  // ==================== 动作：归还登记 ====================
  openReturn(sid) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    showModal('归还登记 — ' + s.sampleNo, `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          ${esc(s.sampleNo)} · ${esc(s.materialName)} · 当前余量 ${esc(s.remainQty)} ${esc(s.unit)}
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;">
          <div class="form-group"><label>归还人</label><input type="text" id="rtBy" value="${esc(this._user())}"></div>
          <div class="form-group"><label>归还时间</label><input type="text" id="rtTime" value="${esc(this._now())}"></div>
        </div>
        <div class="form-group" style="margin-top:14px;"><label>样品状态确认</label><select id="rtCond">
          <option value="OK">完好，继续在库保管</option>
          <option value="NG">破损 / 污染，转待处置</option>
        </select></div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '登记归还', cls: 'btn-primary', action: () => {
        const last = (s.calls || []).filter(c => !c.returnTime).pop();
        const cond = SampleLedger._val('rtCond');
        if (last) {
          last.returnTime = SampleLedger._val('rtTime');
          last.returnBy = SampleLedger._val('rtBy');
          last.returnCond = cond;
        }
        s.status = 'STORED';
        s.pendingDisposal = cond === 'NG';
        closeModal(); SampleLedger.init();
        toast(cond === 'NG'
          ? '归还已登记，标记「待处置」，请在处置登记中销毁'
          : '归还完成，状态回到「在库」');
      } }
    ], 'modal-sm');
  },

  // ==================== 动作：留样观察（仅留样） ====================
  openObserve(sid) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    if (!this.isRetention(s)) return toast('观察仅适用于留样');

    const tasks = this.observeData.filter(o => o.sampleId === sid).sort((a, b) => a.seq - b.seq);
    const pending = tasks.filter(o => !o.actualDate)[0];

    const rows = tasks.length ? `<table class="data-table" style="margin-bottom:6px;">
      <thead><tr><th>次序</th><th>计划日期</th><th>实际观察</th><th>观察人</th><th>观察项目</th><th>结果</th><th>观察记录</th></tr></thead>
      <tbody>${tasks.map(o => `<tr>
        <td style="font-size:12px;">第 ${o.seq} / ${o.total} 次</td>
        <td style="font-size:12px;">${esc(o.planDate)}</td>
        <td style="font-size:12px;">${esc(o.actualDate || '—')}</td>
        <td style="font-size:12px;">${esc(o.observer || '—')}</td>
        <td style="font-size:12px;">${esc(o.item)}</td>
        <td>${o.result === 'OK' ? '<span class="badge badge-green">正常</span>' : o.result === 'NG' ? '<span class="badge badge-red">异常</span>' : '<span class="badge badge-gray">待观察</span>'}</td>
        <td style="font-size:12px;">${esc(o.remark || '—')}${o.abnormalNo ? `<div style="color:#dc2626;font-size:11px;">异常单 ${esc(o.abnormalNo)}</div>` : ''}</td>
      </tr>`).join('')}</tbody></table>` : '<div style="color:var(--text-muted);font-size:12px;">该留样暂无观察任务</div>';

    const form = pending ? `
      <div style="font-weight:700;margin-top:16px;">录入观察（第 ${pending.seq} / ${pending.total} 次 · 计划 ${esc(pending.planDate)}）</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:8px;">
        <div class="form-group"><label>观察日期</label><input type="date" id="obDate" value="${new Date().toISOString().substring(0, 10)}"></div>
        <div class="form-group"><label>观察人</label><input type="text" id="obBy" value="${esc(this._user())}"></div>
        <div class="form-group"><label>观察结果</label><select id="obResult">
          <option value="OK">正常</option><option value="NG">异常</option>
        </select></div>
      </div>
      <div class="form-group" style="margin-top:12px;"><label>观察记录</label>
        <textarea id="obRemark" rows="2" placeholder="${esc(pending.item)}"></textarea></div>
      <label style="display:flex;align-items:center;gap:8px;margin-top:8px;font-size:13px;">
        <input type="checkbox" id="obRaise"> 结果为异常时，一键发起质量异常（偏差/OOS 流程）
      </label>` : '<div style="margin-top:16px;color:var(--text-muted);font-size:12px;">该留样已无待观察时间点</div>';

    showModal('留样观察 — ' + s.sampleNo, `
      <div style="padding:4px 0;font-size:13px;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:10px 16px;margin-bottom:12px;">
          ${esc(s.materialName)} · ${esc(s.observeFreq || '—')} · 共 ${tasks.length ? tasks[0].total : 0} 次 · 下次 ${esc(s.nextObserveDate || '—')}
        </div>
        ${rows}
        ${form}
      </div>`, [
      { text: '关闭', cls: 'btn-secondary', action: closeModal },
      pending ? { text: '保存观察', cls: 'btn-primary', action: () => {
        const result = SampleLedger._val('obResult');
        pending.actualDate = SampleLedger._val('obDate');
        pending.observer = SampleLedger._val('obBy');
        pending.result = result;
        pending.remark = SampleLedger._val('obRemark');
        const raise = document.getElementById('obRaise');
        if (result === 'NG' && raise && raise.checked && !pending.abnormalNo) {
          pending.abnormalNo = 'QA-' + new Date().toISOString().substring(0, 10).replace(/-/g, '') + '-011';
        }
        const next = SampleLedger.observeData
          .filter(o => o.sampleId === sid && !o.actualDate).sort((a, b) => a.seq - b.seq)[0];
        s.nextObserveDate = next ? next.planDate : '—';
        closeModal(); SampleLedger.init();
        toast(result === 'NG'
          ? ('观察已记录为异常' + (pending.abnormalNo ? '，已发起质量异常 ' + pending.abnormalNo : ''))
          : '观察记录已保存');
      } } : null
    ].filter(Boolean), 'modal-lg');
  },

  // ==================== 动作：处置登记（销毁 / 返还 / 消耗） ====================
  openDisposal(sid) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    if (s.status === 'DISPOSED') {
      showModal('处置记录 — ' + s.sampleNo,
        `<div style="padding:4px 0;font-size:13px;">${this._disposalBlock(s)}</div>`,
        [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-md');
      return;
    }
    const modes = this.disposalModes.filter(m => m.categories.indexOf(s.category) !== -1);
    // 留样只有销毁一种处置方式 → 直接进表单；检验样品三种 → 先选择
    if (modes.length === 1) return this.openDisposalForm(sid, modes[0].code);

    const meta = {
      DESTROY: { title: '销毁', emoji: '🗑️', desc: '销毁方式使其不可重复利用<br>登记方式 / 执行人 / 日期',
        bg: 'linear-gradient(135deg,#fef2f2,#fee2e2)', border: '#fecaca', hover: '#dc2626',
        titleColor: '#991b1b', shadow: 'rgba(220,38,38,.12)', btn: '#dc2626' },
      RETURN: { title: '返还送检方', emoji: '↩️', desc: '样品退还请验单位 / 供应商<br>登记返还对象与日期',
        bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '#bfdbfe', hover: '#3b82f6',
        titleColor: '#1e40af', shadow: 'rgba(59,130,246,.12)', btn: '#3b82f6' },
      CONSUME: { title: '检验消耗', emoji: '🧪', desc: '剩余样品在检验中用完<br>余量清零，转已处置',
        bg: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', border: '#c7d2fe', hover: '#6366f1',
        titleColor: '#4338ca', shadow: 'rgba(99,102,241,.12)', btn: '#6366f1' }
    };
    const card = m => {
      const c = meta[m.code];
      return `
      <div onclick="closeModal();SampleLedger.openDisposalForm('${sid}','${m.code}')"
        style="background:${c.bg};border:1.5px solid ${c.border};border-radius:12px;padding:22px 14px;cursor:pointer;transition:all .22s;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:170px;"
        onmouseenter="this.style.borderColor='${c.hover}';this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 14px ${c.shadow}'"
        onmouseleave="this.style.borderColor='${c.border}';this.style.transform='translateY(0)';this.style.boxShadow='none'">
        <div style="font-size:36px;margin-bottom:8px;">${c.emoji}</div>
        <div style="font-size:15px;font-weight:700;color:${c.titleColor};margin-bottom:6px;">${c.title}</div>
        <div style="font-size:12px;color:#4b5563;line-height:1.5;">${c.desc}</div>
        <div style="margin-top:12px;"><span class="badge" style="padding:6px 18px;border-radius:16px;font-size:12px;background:${c.btn};color:#fff;cursor:pointer;">登记${c.title} →</span></div>
      </div>`;
    };

    showModal('📌 处置方式选择 — ' + s.sampleNo, `
      <div style="padding:8px 0;">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:14px;text-align:center;">
          ${esc(s.materialName)} · 余量 ${esc(s.remainQty)} ${esc(s.unit)} · MES 只登记事实，不做审批
        </div>
        <div style="display:grid;grid-template-columns:repeat(${modes.length},1fr);gap:14px;">
          ${modes.map(card).join('')}
        </div>
      </div>`, [{ text: '取消', cls: 'btn-secondary', action: closeModal }], 'modal-md');
  },

  openDisposalForm(sid, mode) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    const isDestroy = mode === 'DESTROY';
    const isRet = this.isRetention(s);
    const today = new Date().toISOString().substring(0, 10);
    let body = '';

    if (mode === 'RETURN') {
      body = `
        <div class="form-group"><label>返还对象 <span class="req">*</span></label>
          <input type="text" id="dpTarget" placeholder="如 物流部库房 / 供应商"></div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;margin-top:6px;">
          <div class="form-group"><label>返还日期 <span class="req">*</span></label><input type="date" id="dpDate" value="${today}"></div>
          <div class="form-group"><label>返还数量</label><input type="text" id="dpQty" value="${esc(s.remainQty)}"></div>
        </div>`;
    } else if (mode === 'CONSUME') {
      body = `
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>消耗日期 <span class="req">*</span></label><input type="date" id="dpDate" value="${today}"></div>
          <div class="form-group"><label>经办人 <span class="req">*</span></label><input type="text" id="dpBy1" value="${esc(this._user())}"></div>
        </div>
        <div class="form-group" style="margin-top:6px;"><label>说明</label>
          <input type="text" id="dpRemark" value="检验项目全部消耗"></div>`;
    } else {
      body = `
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>销毁单号</label>
            <input type="text" id="dpNo" value="DS-${today.replace(/-/g, '')}-0${this.data.length + 8}"></div>
          <div class="form-group"><label>销毁日期 <span class="req">*</span></label><input type="date" id="dpDate" value="${today}"></div>
          <div class="form-group"><label>销毁方式 <span class="req">*</span></label><select id="dpMethod">
            ${this.destroyMethodOptions.map(m => `<option value="${m.code}">${m.name}</option>`).join('')}
          </select></div>
          <div class="form-group"><label>销毁数量</label><input type="text" id="dpQty" value="${esc(s.remainQty)}"></div>
          <div class="form-group"><label>执行人 1 <span class="req">*</span></label><input type="text" id="dpBy1" value="${esc(this._user())}"></div>
          ${isRet ? `<div class="form-group"><label>执行人 2 <span class="req">*</span></label><input type="text" id="dpBy2" value="孙工"></div>
          <div class="form-group"><label>见证人</label><input type="text" id="dpWitness" value="QA经理"></div>` : ''}
          <div class="form-group"><label>销毁原因</label><select id="dpReason">
            <option>留样到期</option><option>包装破损 / 污染</option><option>观察异常</option>
            <option>检验完成多余样品</option><option>考察 / 调查结束</option>
          </select></div>
          <div class="form-group" style="grid-column:span 2;"><label>说明</label>
            <input type="text" id="dpRemark" placeholder="销毁审批在纸质 / eQMS 完成，此处只登记最终结果"></div>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-muted);">
          ${isRet ? '留样销毁登记完成后向 SAP 发起 <b>移动类型 551</b> 报废过账。' : '检验样品销毁不过账（非库存）。'}
        </div>`;
    }

    const title = (isRet ? '留样' : '样品') + (isDestroy ? '销毁登记' : (mode === 'RETURN' ? '返还登记' : '消耗登记'));

    showModal(title + ' — ' + s.sampleNo, `<div style="padding:4px 0;">${body}</div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认登记', cls: isDestroy ? 'btn-danger' : 'btn-primary', action: () => {
        const date = SampleLedger._val('dpDate');
        if (!date) return toast('请填写日期');
        const by1 = SampleLedger._val('dpBy1') || SampleLedger._user();
        const disposal = {
          mode: mode, date: date, by1: by1,
          qty: SampleLedger._val('dpQty') || s.remainQty,
          reason: SampleLedger._val('dpReason'),
          remark: SampleLedger._val('dpRemark')
        };
        if (mode === 'RETURN') {
          disposal.target = SampleLedger._val('dpTarget');
          if (!disposal.target) return toast('请填写返还对象');
        }
        if (mode === 'DESTROY') {
          disposal.no = SampleLedger._val('dpNo');
          disposal.method = SampleLedger._val('dpMethod');
          if (!disposal.method) return toast('请填写销毁方式');
          if (isRet) {
            disposal.by2 = SampleLedger._val('dpBy2');
            if (!disposal.by2) return toast('留样销毁须登记双执行人');
            disposal.witness = SampleLedger._val('dpWitness');
            disposal.sapDoc = '5510000' + String(470 + SampleLedger.data.length);
            disposal.sapMoveType = '551';
          }
        }
        s.disposal = disposal;
        s.status = 'DISPOSED';
        s.pendingDisposal = false;
        s.remainQty = '0.000';
        closeModal(); SampleLedger.init();
        toast(title + '完成' + (disposal.sapDoc ? ' · SAP 物料凭证 ' + disposal.sapDoc + '（551）' : '') + '，台账转终态');
      } }
    ], 'modal-md');
  },

  // ==================== 查看弹窗（5 页签 + 顶部操作区） ====================
  openDetail(sid) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    const m = this.getStatusMeta(s.status);
    const isRet = this.isRetention(s);
    const terminal = s.status === 'DISPOSED';

    const actions = [];
    if (s.status === 'REG') {
      actions.push(`<button class="btn btn-primary btn-sm" onclick="closeModal();SampleLedger.openPutaway('${sid}')">📥 入库上架</button>`);
    }
    if (s.status === 'STORED' || s.status === 'CALLED') {
      actions.push(`<button class="btn btn-sm" onclick="closeModal();SampleLedger.openPutaway('${sid}')">📍 位置变更</button>`);
    }
    if (s.status === 'STORED') {
      actions.push(`<button class="btn btn-sm" style="background:#0ea5e9;color:#fff;" onclick="closeModal();SampleLedger.openCall('${sid}')">📤 调用登记</button>`);
      if (isRet) actions.push(`<button class="btn btn-sm" style="background:#8b5cf6;color:#fff;" onclick="closeModal();SampleLedger.openObserve('${sid}')">🔬 留样观察</button>`);
      actions.push(`<button class="btn btn-danger btn-sm" onclick="closeModal();SampleLedger.openDisposal('${sid}')">处置登记</button>`);
    }
    if (s.status === 'CALLED') {
      actions.push(`<button class="btn btn-primary btn-sm" onclick="closeModal();SampleLedger.openReturn('${sid}')">🔄 归还登记</button>`);
    }

    const lc = this.locOf(s);
    const locBanner = lc
      ? `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px 16px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;">
           <div><span style="font-size:12px;color:var(--text-muted);">存放位置</span>
             <div style="margin-top:2px;">${SampleLocations.breadcrumbHtml(lc, 'font-size:14px;font-weight:600;color:#1E3A5F;')}</div></div>
           <div style="font-family:monospace;font-size:12px;color:var(--text-muted);">${esc(lc)}</div>
         </div>`
      : `<div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:10px 16px;margin-bottom:14px;font-size:13px;color:#b45309;">
           该样品尚未入库定位，请通过「入库上架」从位置树选择存放位置。</div>`;

    showModal('样品详情 — ' + s.sampleNo, `
      <div style="padding:4px 0;font-size:13px;">
        ${locBanner}
        <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;align-items:center;">
          <span class="badge ${m.badge}">${esc(m.name)}</span>
          ${actions.join('')}
          ${terminal ? '<span class="badge badge-gray">终态只读，不可再操作</span>' : ''}
        </div>
        <div style="display:flex;gap:4px;border-bottom:2px solid var(--border);margin-bottom:16px;">
          <div class="form-tab active" data-sltab="base" onclick="SampleLedger._switchTab(this)">基本信息</div>
          <div class="form-tab" data-sltab="location" onclick="SampleLedger._switchTab(this)">位置与移动</div>
          <div class="form-tab" data-sltab="call" onclick="SampleLedger._switchTab(this)">调用记录</div>
          ${isRet ? '<div class="form-tab" data-sltab="observe" onclick="SampleLedger._switchTab(this)">观察记录</div>' : ''}
          <div class="form-tab" data-sltab="disposal" onclick="SampleLedger._switchTab(this)">处置记录</div>
        </div>
        <div class="ib-tab-panel active" data-slpanel="base">${this._tabBase(s)}</div>
        <div class="ib-tab-panel" data-slpanel="location">${this._tabLocation(s)}</div>
        <div class="ib-tab-panel" data-slpanel="call">${this._tabCall(s)}</div>
        ${isRet ? `<div class="ib-tab-panel" data-slpanel="observe">${this._tabObserve(s)}</div>` : ''}
        <div class="ib-tab-panel" data-slpanel="disposal">${this._tabDisposal(s)}</div>
      </div>`, [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-lg');
  },

  _switchTab(el) {
    const wrap = el.closest('.modal-body') || document;
    wrap.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
    wrap.querySelectorAll('.ib-tab-panel').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    const panel = wrap.querySelector('.ib-tab-panel[data-slpanel="' + el.dataset.sltab + '"]');
    if (panel) panel.classList.add('active');
  },

  _tabBase(s) {
    const m = this.getStatusMeta(s.status);
    const isRet = this.isRetention(s);
    const catName = isRet ? '留样' : (s.type + ' ' + this.getTypeName(s.type));
    const days = this.daysLeft(s);
    const daysTxt = days === null ? '—' : (days < 0 ? '已超期 ' + (-days) + ' 天' : days + ' 天');
    return `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px 24px;padding:14px 16px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;">
        <div><span style="color:var(--text-muted);">样品编号：</span><span style="font-family:monospace;font-weight:600;color:#1E3A5F;">${esc(s.sampleNo)}</span></div>
        <div><span style="color:var(--text-muted);">状态：</span><span class="badge ${m.badge}">${esc(m.name)}</span></div>
        <div><span style="color:var(--text-muted);">类别：</span>${esc(catName)}</div>
        <div><span style="color:var(--text-muted);">工厂：</span>${esc(s.plant)} ${esc(this.getPlantName(s.plant))}</div>
        <div><span style="color:var(--text-muted);">物料：</span>${esc(s.materialCode)} ${esc(s.materialName)}</div>
        <div><span style="color:var(--text-muted);">来源批次：</span>${esc(s.sourceBatch || '—')}</div>
        <div><span style="color:var(--text-muted);">关联检验批：</span>${esc(s.inspectBatchNo || '—')}</div>
        <div><span style="color:var(--text-muted);">数量：</span>${esc(s.qty)} ${esc(s.unit)}（余 ${esc(s.remainQty)}）</div>
        <div><span style="color:var(--text-muted);">保存条件：</span>${esc(s.storageCondition || '—')}</div>
        <div><span style="color:var(--text-muted);">有效期：</span>${esc(s.validDate || '—')}</div>
        <div><span style="color:var(--text-muted);">到期日：</span>${esc(this.dueOf(s) || '—')}<span style="color:var(--text-muted);font-size:12px;">（剩余 ${daysTxt}）</span></div>
        <div><span style="color:var(--text-muted);">${isRet ? '期限规则' : '登记人'}：</span>${isRet ? esc(s.keepRule || '—') : esc(s.registerBy)}</div>
        <div><span style="color:var(--text-muted);">登记：</span>${esc(s.registerBy)} ${esc(s.registerTime)}</div>
        <div><span style="color:var(--text-muted);">入库上架：</span>${esc(s.putawayTime || '—')}</div>
        ${isRet ? `<div><span style="color:var(--text-muted);">观察：</span>${esc(s.observeFreq || '—')} · 下次 ${esc(s.nextObserveDate || '—')}</div>
        <div><span style="color:var(--text-muted);">标签号：</span>${esc(s.labelNo || '—')}</div>
        <div style="grid-column:span 3;"><span style="color:var(--text-muted);">SAP 登记凭证：</span>
          ${esc(s.sapDocNo || '—')}（移动类型 ${esc(s.sapMoveType || '311')}，${esc(s.sapSyncTime || '—')}）</div>` : ''}
      </div>
      <div style="margin-top:10px;font-size:12px;color:var(--text-muted);">
        ${isRet
          ? '留样观察见「观察记录」页签；销毁登记后过账 SAP 551。'
          : '检验进度与结果请在「检验批管理」（检验批号 ' + esc(s.inspectBatchNo || '—') + '）查看，本台账只管实物。'}
      </div>`;
  },

  _tabLocation(s) {
    const lc = this.locOf(s);
    const moves = s.moves || [];
    return `
      <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:12px 16px;margin-bottom:12px;font-size:13px;">
        <span style="color:var(--text-muted);">当前位置：</span>
        ${lc ? SampleLocations.breadcrumbText(lc) + '（' + esc(lc) + '）' : '未入库'}
      </div>
      <table class="data-table">
        <thead><tr><th style="width:150px;">时间</th><th>原位置</th><th>新位置</th><th style="width:90px;">操作人</th><th style="width:110px;">原因</th></tr></thead>
        <tbody>${moves.length ? moves.map(mv => `<tr>
          <td style="font-size:12px;">${esc(mv.time)}</td>
          <td style="font-size:12px;">${mv.from ? SampleLocations.breadcrumbHtml(mv.from) : '<span style="color:var(--text-muted);">—（登记）</span>'}</td>
          <td style="font-size:12px;">${mv.to ? SampleLocations.breadcrumbHtml(mv.to) : '—'}</td>
          <td>${esc(mv.by)}</td>
          <td style="font-size:12px;">${esc(mv.reason || '—')}</td>
        </tr>`).join('') : '<tr><td colspan="5" class="empty-cell">无位置变更记录</td></tr>'}</tbody>
      </table>`;
  },

  _tabCall(s) {
    const calls = s.calls || [];
    if (!calls.length) return '<div style="color:var(--text-muted);font-size:12px;">暂无调用记录</div>';
    return `<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">共 ${calls.length} 条调用记录</div>
      <table class="data-table">
        <thead><tr><th>调用单号</th><th>领取人</th><th>用途</th><th>数量</th><th>领用时间</th><th>归还时间 / 归还人</th><th>样品状态</th></tr></thead>
        <tbody>${calls.map(c => `<tr>
          <td style="font-family:monospace;font-size:12px;">${esc(c.callNo)}</td>
          <td>${esc(c.by)}${c.dept ? '（' + esc(c.dept) + '）' : ''}</td>
          <td style="font-size:12px;">${esc(c.purpose)}</td>
          <td>${esc(c.qty)} ${esc(c.unit)}</td>
          <td style="font-size:12px;">${esc(c.time)}</td>
          <td style="font-size:12px;">${c.returnTime ? esc(c.returnTime) + ' · ' + esc(c.returnBy) : '<span style="color:#dc2626;">未归还</span>'}</td>
          <td style="font-size:12px;">${c.returnTime ? (c.returnCond === 'NG' ? '<span class="badge badge-red">破损 / 污染</span>' : '<span class="badge badge-green">完好</span>') : '—'}</td>
        </tr>`).join('')}</tbody></table>`;
  },

  _tabObserve(s) {
    const obs = this.observeData.filter(o => o.sampleId === s.id).sort((a, b) => a.seq - b.seq);
    if (!obs.length) return '<div style="color:var(--text-muted);font-size:12px;">暂无观察任务</div>';
    const done = obs.filter(o => o.actualDate).length;
    const entry = s.status === 'DISPOSED' ? ''
      : `<span style="margin-left:10px;color:#2563eb;cursor:pointer;" onclick="closeModal();SampleLedger.openObserve('${s.id}')">录入观察 →</span>`;
    return `<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">
        ${esc(s.observeFreq || '—')} · 共 ${obs[0].total} 次，已完成 ${done} 次${entry}
      </div>
      <table class="data-table">
        <thead><tr><th>观察次序</th><th>计划日期</th><th>实际观察</th><th>观察人</th><th>观察项目</th><th>结果</th><th>观察记录</th></tr></thead>
        <tbody>${obs.map(o => `<tr>
          <td style="font-size:12px;">第 ${o.seq} / ${o.total} 次</td>
          <td style="font-size:12px;">${esc(o.planDate)}</td>
          <td style="font-size:12px;">${esc(o.actualDate || '—')}</td>
          <td style="font-size:12px;">${esc(o.observer || '—')}</td>
          <td style="font-size:12px;">${esc(o.item)}</td>
          <td>${o.result === 'OK' ? '<span class="badge badge-green">正常</span>' : o.result === 'NG' ? '<span class="badge badge-red">异常</span>' : '<span class="badge badge-gray">待观察</span>'}</td>
          <td style="font-size:12px;">${esc(o.remark || '—')}${o.abnormalNo ? `<div style="color:#dc2626;font-size:11px;">异常单 ${esc(o.abnormalNo)}</div>` : ''}</td>
        </tr>`).join('')}</tbody></table>`;
  },

  _disposalBlock(s) {
    const d = s.disposal;
    if (!d) {
      return `<div style="padding:24px 16px;text-align:center;color:var(--text-muted);background:#f8fafc;border:1px dashed var(--border);border-radius:8px;">
        该样品尚未处置${this.isRetention(s) ? '（留样到期日 ' + esc(s.dueDate || '—') + '，销毁登记后过账 SAP 551）' : '（检毕后在「处置登记」中选择销毁 / 返还 / 消耗）'}
      </div>`;
    }
    const badge = d.mode === 'RETURN' ? 'badge-blue' : d.mode === 'CONSUME' ? 'badge-purple' : 'badge-red';
    const cells = [];
    cells.push(`<div><span style="color:var(--text-muted);">处置方式：</span><span class="badge ${badge}">${esc(this.getDisposalName(d.mode))}</span></div>`);
    cells.push(`<div><span style="color:var(--text-muted);">处置日期：</span>${esc(d.date || '—')}</div>`);
    cells.push(`<div><span style="color:var(--text-muted);">数量：</span>${esc(d.qty || '—')} ${esc(s.unit)}</div>`);
    if (d.mode === 'DESTROY') {
      cells.push(`<div><span style="color:var(--text-muted);">销毁单号：</span>${esc(d.no || '—')}</div>`);
      cells.push(`<div><span style="color:var(--text-muted);">销毁方式：</span>${esc(this.getMethodName(d.method))}</div>`);
      cells.push(`<div><span style="color:var(--text-muted);">执行人：</span>${esc(d.by1 || '—')}${d.by2 ? ' / ' + esc(d.by2) : ''}</div>`);
      if (d.witness) cells.push(`<div><span style="color:var(--text-muted);">见证人：</span>${esc(d.witness)}</div>`);
      cells.push(`<div><span style="color:var(--text-muted);">销毁原因：</span>${esc(d.reason || '—')}</div>`);
    } else if (d.mode === 'RETURN') {
      cells.push(`<div><span style="color:var(--text-muted);">返还对象：</span>${esc(d.target || '—')}</div>`);
      cells.push(`<div><span style="color:var(--text-muted);">经办人：</span>${esc(d.by1 || '—')}</div>`);
    } else {
      cells.push(`<div><span style="color:var(--text-muted);">经办人：</span>${esc(d.by1 || '—')}</div>`);
    }
    if (d.remark) cells.push(`<div style="grid-column:span 3;"><span style="color:var(--text-muted);">说明：</span>${esc(d.remark)}</div>`);
    const sapRow = d.sapDoc
      ? `<div style="grid-column:span 3;"><span style="color:var(--text-muted);">SAP 报废凭证：</span>
           ${esc(d.sapDoc)}（移动类型 ${esc(d.sapMoveType || '551')}）</div>` : '';

    return `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px 24px;padding:14px 16px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;">
      ${cells.join('')}${sapRow}
    </div>
    <div style="margin-top:12px;font-size:12px;color:var(--text-muted);">
      处置审批在纸质 / eQMS 完成，MES 只登记最终结果；处置后余量清零，台账为只读终态。
    </div>`;
  },

  _tabDisposal(s) {
    return `<div style="font-size:13px;">${this._disposalBlock(s)}</div>`;
  },

  // ==================== 留样规则配置 ====================
  openRuleConfig() {
    const rows = this.ruleData.map(r => `<tr>
      <td>${esc(r.plant)} ${esc(this.getPlantName(r.plant))}</td>
      <td style="font-family:monospace;font-size:12px;">${esc(r.materialCode)}</td>
      <td>${esc(r.materialName)}</td>
      <td>${r.needSample ? '<span class="badge badge-green">留样</span>' : '<span class="badge badge-gray">不留样</span>'}</td>
      <td>${esc(r.sampleQty)} ${esc(r.unit)}</td>
      <td style="font-size:12px;">${esc(r.storageCondition)}</td>
      <td style="font-size:12px;">${esc(r.keepRule)}</td>
      <td style="font-size:12px;">${esc(r.observeFreq)}${r.observeTimes ? ' · 共 ' + r.observeTimes + ' 次' : ''}</td>
    </tr>`).join('');

    showModal('留样规则配置', `
      <div style="padding:4px 0;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;margin-bottom:14px;font-size:13px;">
          按物料 / 产品设置是否留样、留样量、保存条件、保存期限规则（有效期后若干年或放行后若干年）与观察频次。
          留样登记时自动带出并计算到期日；检验样品不走本规则。
        </div>
        <table class="data-table">
          <thead><tr><th>工厂</th><th>物料编码</th><th>物料名称</th><th>是否留样</th><th>留样量</th><th>保存条件</th><th>保存期限规则</th><th>观察频次</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`, [
      { text: '关闭', cls: 'btn-secondary', action: closeModal },
      { text: '新增规则', cls: 'btn-primary', action: () => toast('演示环境：规则新增待接后端接口') }
    ], 'modal-xl');
  },

  // ==================== 导出 ====================
  exportData() {
    if (!this.filtered || !this.filtered.length) return toast('无数据可导出');
    const head = ['样品编号', '类别', '细分类型', '工厂', '物料编码', '物料名称', '来源批次', '检验批号',
      '数量', '余量', '单位', '位置编码', '位置路径', '保存条件', '有效期', '到期日', '剩余天数',
      '登记人', '登记时间', '上架时间', '状态', '处置方式', '处置日期', '处置执行人', '销毁方式', 'SAP 凭证'];
    const lines = this.filtered.map(s => {
      const lc = this.locOf(s);
      const d = s.disposal || {};
      return [
        s.sampleNo,
        s.category === 'RETENTION' ? '留样' : '检验样品',
        s.category === 'RETENTION' ? '—' : (s.type + ' ' + this.getTypeName(s.type)),
        s.plant, s.materialCode, s.materialName, s.sourceBatch || '—', s.inspectBatchNo || '—',
        s.qty, s.remainQty, s.unit,
        lc || '—', lc ? SampleLocations.breadcrumbText(lc) : '—',
        s.storageCondition || '—', s.validDate || '—', this.dueOf(s) || '—',
        this.daysLeft(s) === null ? '—' : this.daysLeft(s),
        s.registerBy, s.registerTime, s.putawayTime || '—',
        this.getStatusMeta(s.status).name,
        d.mode ? this.getDisposalName(d.mode) : '—',
        d.date || '—',
        [d.by1, d.by2].filter(Boolean).join(' / ') || '—',
        d.method ? this.getMethodName(d.method) : '—',
        d.sapDoc ? d.sapDoc + '（' + (d.sapMoveType || '551') + '）' : (s.sapDocNo ? s.sapDocNo + '（311）' : '—')
      ];
    });
    this._downloadCsv('样品台账', head, lines);
  },

  _downloadCsv(name, head, lines) {
    const csv = '\uFEFF' + [head.join(',')].concat(lines.map(r => r.map(c => {
      const v = String(c == null ? '' : c);
      return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(','))).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = name + '_' + new Date().toISOString().substring(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('已导出 ' + lines.length + ' 条');
  },

  // ==================== 分页 ====================
  renderPagination() {
    const el = document.getElementById('sdPagination');
    if (!el) return;
    const total = this.filtered.length;
    const pages = Math.max(1, Math.ceil(total / this.pageSize));
    el.innerHTML = `<div class="pagination">
      <span style="color:var(--text-muted);font-size:12px;margin-right:12px;">共 ${total} 条</span>
      <button class="pagination-btn" onclick="SampleLedger.prevPage()" ${this.page <= 1 ? 'disabled' : ''}>‹</button>
      <span class="pagination-info">第 ${this.page} / ${pages} 页</span>
      <button class="pagination-btn" onclick="SampleLedger.nextPage()" ${this.page >= pages ? 'disabled' : ''}>›</button>
      <select class="page-size-select" onchange="SampleLedger.changePageSize(this.value)">
        ${[10, 20, 50].map(n => `<option value="${n}" ${n === this.pageSize ? 'selected' : ''}>${n}条/页</option>`).join('')}
      </select>
    </div>`;
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); this.renderPagination(); } },
  nextPage() {
    const pages = Math.ceil(Math.max(this.filtered.length, 1) / this.pageSize);
    if (this.page < pages) { this.page++; this.renderTable(); this.renderPagination(); }
  },
  changePageSize(n) { this.pageSize = Number(n); this.page = 1; this.renderTable(); this.renderPagination(); }
};

// 查询变式注册（「我的变式」由 FilterActions 渲染，这里提供字段与回填入口）
if (window.QueryVariant) {
  QueryVariant.register({
    pageId: 'sample-ledger',
    fields: ['sdPlant', 'sdCategory', 'sdKeyword', 'sdStatus', 'sdLoc', 'sdBatch', 'sdSourceBatch', 'sdExpiry', 'sdDateFrom', 'sdDateTo'],
    textFields: ['sdKeyword', 'sdLoc', 'sdBatch', 'sdSourceBatch', 'sdDateFrom', 'sdDateTo'],
    labels: {
      sdPlant: '工厂', sdCategory: '样品类别', sdKeyword: '样品编号/物料', sdStatus: '状态',
      sdLoc: '存放位置', sdBatch: '检验批号', sdSourceBatch: '来源批次', sdExpiry: '剩余天数',
      sdDateFrom: '登记日期从', sdDateTo: '登记日期至'
    },
    onApply: function () { SampleLedger.search(); }
  });
}

// 注册到位置树占用统计：脚本加载即注册，位置管理页的占用数与反查不依赖是否打开过本页
if (window.SampleLocations && !SampleLedger._providerAdded) {
  SampleLedger._providerAdded = true;
  SampleLocations.addProvider(function () {
    return SampleLedger.data
      .filter(function (r) { return r.status !== 'DISPOSED' && SampleLedger.locOf(r); })
      .map(function (r) {
        return { source: r.category === 'RETENTION' ? 'retention' : 'ledger',
          locCode: SampleLedger.locOf(r),
          record: Object.assign({}, r, { statusName: SampleLedger.getStatusMeta(r.status).name }) };
      });
  });
}
