/**
 * 样品台账（SampleLedger）— 质量管理 → 样品管理 → 样品台账
 *
 * 设计基线（2026-11-16 冻结）：
 *  1) 三类实物：留样 RETENTION / 检验样品 INSPECT / 稳定性 STAB，同一张表用 category 区分
 *  2) 3 态：待入库 REG → 存放中 STORED → 已处置 DISPOSED；到期/待观察是派生提示，不做状态
 *  3) 无借出/调用/归还业务；留样只做目检不消耗；检验样品 331 出账后整批消耗
 *  4) 位置只到「库存地点」（与 SAP 同颗粒度），不做位置树、不做占用统计、不做盘点
 *  5) 处置按类别分叉：检验样品=消耗（无凭证）；留样/稳定性=销毁（双执行人+见证人+551）
 *  6) MES 不建库存账，台账只记实物行踪与 GMP 记录，因此不存在与 SAP 的对账
 */

const SampleLedger = {
  // ==================== 主数据 ====================
  plantOptions: [
    { code: '2001', name: '陕西步长制药' },
    { code: '2002', name: '山东丹红制药' },
    { code: '1000', name: '山东步长制药' }
  ],

  // 库存地点（与 SAP 库存地点一一对应，只到这一级）
  locations: [
    { code: 'LY-A', name: '留样室 A' },
    { code: 'LY-B', name: '留样室 B' },
    { code: 'WD-01', name: '稳定性室' },
    { code: 'QC-01', name: 'QC 样品间' },
    { code: 'FRZ-01', name: '冷库（2~8℃）' },
    { code: 'DR-01', name: '阴凉库' }
  ],

  typeOptions: [
    { code: 'YC', name: '药材' }, { code: 'YF', name: '原辅料' }, { code: 'NBC', name: '内包材' },
    { code: 'WBC', name: '外包材' }, { code: 'CP', name: '成品' }, { code: 'ZJ', name: '中间品' },
    { code: 'WD', name: '稳定性' }, { code: 'GS', name: '公用工程' }, { code: 'KQ', name: '空气' },
    { code: 'HJ', name: '环境' }, { code: 'YZ', name: '验证' }, { code: 'WT', name: '委托' },
    { code: 'KY', name: '科研' }, { code: 'QT', name: '其他' }
  ],

  statusMeta: {
    REG: { name: '待入库', badge: 'badge-yellow' },
    STORED: { name: '存放中', badge: 'badge-green' },
    DISPOSED: { name: '已处置', badge: 'badge-gray' }
  },

  pageSize: 10,
  page: 1,

  // ==================== 数据 ====================
  data: [
    // ---------- 留样 ----------
    { id: 'S001', category: 'RETENTION', sampleNo: 'LS-2001-2604001', plant: '2001',
      materialCode: 'MAT-10005', materialName: '布洛芬原料药', sourceBatch: 'SAP-BT-20260401', inspectBatchNo: '100000012301',
      qty: '0.500', unit: 'KG', storageCondition: '阴凉干燥处（≤25℃）', keepRule: '有效期后 1 年',
      validDate: '2028-05-31', dueDate: '2029-05-31', observeFreq: '每 12 个月', nextObserveDate: '2026-12-01',
      locCode: 'LY-A', status: 'STORED', registerBy: '王工', registerTime: '2026-04-05 10:00', putawayTime: '2026-04-05 10:20',
      sapDocNo: '4900000201', sapMoveType: '311', sapSyncTime: '2026-04-05 10:00:06', source: 'SAMPLING',
      locationLog: [{ time: '2026-04-05 10:20', from: '', to: 'LY-A', by: '王工', reason: '入库上架' }] },

    // 临期 26 天
    { id: 'S002', category: 'RETENTION', sampleNo: 'LS-2002-2604002', plant: '2002',
      materialCode: 'MAT-30002', materialName: '丹红注射液', sourceBatch: 'SAP-BT-20260408', inspectBatchNo: '100000011902',
      qty: '4.000', unit: '支', storageCondition: '避光、阴凉处（2~8℃）', keepRule: '有效期后 6 个月',
      validDate: '2026-06-12', dueDate: '2026-12-12', observeFreq: '每 6 个月', nextObserveDate: '2026-12-12',
      locCode: 'FRZ-01', status: 'STORED', registerBy: '赵工', registerTime: '2026-04-12 08:30', putawayTime: '2026-04-12 08:50',
      sapDocNo: '4900000208', sapMoveType: '311', sapSyncTime: '2026-04-12 08:30:05', source: 'SAMPLING',
      locationLog: [{ time: '2026-04-12 08:50', from: '', to: 'FRZ-01', by: '赵工', reason: '入库上架' },
        { time: '2026-09-15 16:20', from: 'FRZ-01', to: 'LY-B', by: '钱工', reason: '温度异常转移' },
        { time: '2026-09-22 09:10', from: 'LY-B', to: 'FRZ-01', by: '赵工', reason: '复归原位' }] },

    // 已超期 289 天（有效期 2025-01-31 + 1 年）
    { id: 'S003', category: 'RETENTION', sampleNo: 'LS-1000-2501003', plant: '1000',
      materialCode: 'MAT-10006', materialName: '维生素C原料', sourceBatch: 'SAP-BT-20250105', inspectBatchNo: '100000010120',
      qty: '0.500', unit: 'KG', storageCondition: '避光、密封、干燥处', keepRule: '有效期后 1 年',
      validDate: '2025-01-31', dueDate: '2026-01-31', observeFreq: '每 12 个月', nextObserveDate: '2026-12-01',
      locCode: 'DR-01', status: 'STORED', registerBy: '李工', registerTime: '2025-01-08 09:00', putawayTime: '2025-01-08 09:20',
      sapDocNo: '4900000118', sapMoveType: '311', sapSyncTime: '2025-01-08 09:00:04', source: 'SAMPLING',
      locationLog: [{ time: '2025-01-08 09:20', from: '', to: 'DR-01', by: '李工', reason: '入库上架' }] },

    // 待观察（观察任务未做）
    { id: 'S004', category: 'RETENTION', sampleNo: 'LS-2001-2605004', plant: '2001',
      materialCode: 'MAT-10013', materialName: '盐酸二甲双胍', sourceBatch: 'SAP-BT-20260502', inspectBatchNo: '100000011880',
      qty: '0.400', unit: 'KG', storageCondition: '阴凉干燥处（≤25℃）', keepRule: '有效期后 1 年',
      validDate: '2027-05-02', dueDate: '2028-05-02', observeFreq: '每 12 个月', nextObserveDate: '2026-11-20',
      locCode: 'LY-A', status: 'STORED', registerBy: '王工', registerTime: '2026-05-05 10:00', putawayTime: '2026-05-05 10:20',
      sapDocNo: '4900000233', sapMoveType: '311', sapSyncTime: '2026-05-05 10:00:06', source: 'SAMPLING',
      locationLog: [{ time: '2026-05-05 10:20', from: '', to: 'LY-A', by: '王工', reason: '入库上架' }] },

    // 已销毁（551）
    { id: 'S005', category: 'RETENTION', sampleNo: 'LS-2001-2208005', plant: '2001',
      materialCode: 'MAT-10005', materialName: '布洛芬原料药', sourceBatch: 'SAP-BT-20220801', inspectBatchNo: '100000009005',
      qty: '0.500', unit: 'KG', storageCondition: '阴凉干燥处（≤25℃）', keepRule: '有效期后 1 年',
      validDate: '2023-08-01', dueDate: '2024-08-01', observeFreq: '每 12 个月', nextObserveDate: '—',
      locCode: 'LY-A', status: 'DISPOSED', registerBy: '刘工', registerTime: '2022-08-05 09:00', putawayTime: '2022-08-05 09:20',
      sapDocNo: '4900000042', sapMoveType: '311', sapSyncTime: '2022-08-05 09:00:04',
      locationLog: [{ time: '2022-08-05 09:20', from: '', to: 'LY-A', by: '刘工', reason: '入库上架' }],
      disposal: { mode: 'DESTROY', date: '2024-09-10', by1: '刘工', by2: '王工', witness: 'QA 张工', method: '焚烧',
        no: 'DSP-20240910-001', sapDoc: '4900000501', sapMoveType: '551', remark: '到期销毁，观察记录齐全' } },

    { id: 'S006', category: 'RETENTION', sampleNo: 'LS-2001-2611006', plant: '2001',
      materialCode: 'MAT-10014', materialName: '格列美脲', sourceBatch: 'SAP-BT-20261108', inspectBatchNo: '100000013001',
      qty: '0.500', unit: 'KG', storageCondition: '密闭、阴凉干燥处', keepRule: '有效期后 1 年',
      validDate: '2028-11-08', dueDate: '2029-11-08', observeFreq: '每 12 个月', nextObserveDate: '—',
      locCode: '', status: 'REG', registerBy: '陈工', registerTime: '2026-11-14 09:00', putawayTime: '',
      sapDocNo: '4900000311', sapMoveType: '311', sapSyncTime: '2026-11-14 09:00:07', source: 'SAMPLING',
      locationLog: [] },

    // ---------- 稳定性（独立成袋，独立记录） ----------
    { id: 'W001', category: 'STAB', sampleNo: 'WD-2001-2604001', plant: '2001',
      materialCode: 'MAT-10005', materialName: '布洛芬原料药（稳定性）', sourceBatch: 'SAP-BT-20260401', inspectBatchNo: '100000012301',
      qty: '2.000', unit: 'KG', storageCondition: '稳定性室（25℃/60%RH）', keepRule: '考察期结束',
      validDate: '2029-04-01', dueDate: '2029-04-01', observeFreq: '—', nextObserveDate: '—',
      locCode: 'WD-01', status: 'STORED', registerBy: '王工', registerTime: '2026-04-06 09:00', putawayTime: '2026-04-06 09:20',
      sapDocNo: '4900000202', sapMoveType: '311', sapSyncTime: '2026-04-06 09:00:03', source: 'STABILITY',
      locationLog: [{ time: '2026-04-06 09:20', from: '', to: 'WD-01', by: '王工', reason: '入稳定性室' }] },

    { id: 'W002', category: 'STAB', sampleNo: 'WD-2002-2204002', plant: '2002',
      materialCode: 'MAT-30002', materialName: '丹红注射液（稳定性）', sourceBatch: 'SAP-BT-20220402', inspectBatchNo: '100000007882',
      qty: '40.000', unit: '支', storageCondition: '稳定性室（30℃/65%RH）', keepRule: '考察期结束',
      validDate: '2025-04-02', dueDate: '2025-04-02', observeFreq: '—', nextObserveDate: '—',
      locCode: 'WD-01', status: 'DISPOSED', registerBy: '赵工', registerTime: '2022-04-08 09:00', putawayTime: '2022-04-08 09:20',
      sapDocNo: '4900000066', sapMoveType: '311', sapSyncTime: '2022-04-08 09:00:03',
      locationLog: [{ time: '2022-04-08 09:20', from: '', to: 'WD-01', by: '赵工', reason: '入稳定性室' }],
      disposal: { mode: 'DESTROY', date: '2025-05-12', by1: '赵工', by2: '钱工', witness: 'QA 李工', method: '高压灭菌',
        no: 'DSP-20250512-003', sapDoc: '4900000777', sapMoveType: '551', remark: '考察期结束报废' } },

    // ---------- 检验样品 ----------
    { id: 'P001', category: 'INSPECT', type: 'YF', sampleNo: 'YF-2026-05-018', plant: '2001',
      materialCode: 'MAT-10007', materialName: '葡萄糖原料', sourceBatch: 'SAP-BT-20260510', inspectBatchNo: '100000012303',
      qty: '3.000', unit: 'KG', storageCondition: '密闭、干燥处', validDate: '2027-05-10',
      locCode: 'QC-01', status: 'STORED', registerBy: '张工', registerTime: '2026-05-12 08:30', putawayTime: '2026-05-12 08:45',
      sapDocNo: '4900000180', sapMoveType: '331', sapSyncTime: '2026-05-12 08:30:02', source: 'SAMPLING',
      locationLog: [{ time: '2026-05-12 08:45', from: '', to: 'QC-01', by: '张工', reason: '入库上架' }] },

    { id: 'P002', category: 'INSPECT', type: 'YF', sampleNo: 'YF-2026-06-029', plant: '2001',
      materialCode: 'MAT-10008', materialName: '盐酸克林霉素', sourceBatch: 'SAP-BT-20260616', inspectBatchNo: '100000012304',
      qty: '0.300', unit: 'KG', storageCondition: '阴凉干燥处', validDate: '2027-06-16',
      locCode: 'QC-01', status: 'DISPOSED', registerBy: '李工', registerTime: '2026-06-18 09:00', putawayTime: '2026-06-18 09:20',
      sapDocNo: '4900000192', sapMoveType: '331', sapSyncTime: '2026-06-18 09:00:02',
      locationLog: [{ time: '2026-06-18 09:20', from: '', to: 'QC-01', by: '李工', reason: '入库上架' }],
      disposal: { mode: 'CONSUME', date: '2026-07-02', by1: '李工', remark: '检验完成，样品消耗完毕' } },

    // 外包材：无有效期
    { id: 'P003', category: 'INSPECT', type: 'WBC', sampleNo: 'WBC-2026-10-026', plant: '2001',
      materialCode: 'MAT-60003', materialName: '说明书（24 粒装）', sourceBatch: 'SAP-BT-20261010', inspectBatchNo: '100000013405',
      qty: '20.000', unit: '份', storageCondition: '常温、防潮', validDate: '—',
      locCode: 'QC-01', status: 'STORED', registerBy: '刘工', registerTime: '2026-10-12 14:00', putawayTime: '2026-10-12 14:20',
      sapDocNo: '4900000299', sapMoveType: '331', sapSyncTime: '2026-10-12 14:00:01',
      locationLog: [{ time: '2026-10-12 14:20', from: '', to: 'QC-01', by: '刘工', reason: '入库上架' }] },

    // 已超期 27 天
    { id: 'P004', category: 'INSPECT', type: 'YC', sampleNo: 'YC-2026-07-091', plant: '2001',
      materialCode: 'MAT-20012', materialName: '白术饮片', sourceBatch: 'SAP-BT-20260705', inspectBatchNo: '100000012588',
      qty: '0.600', unit: 'KG', storageCondition: '密闭、阴凉干燥处', validDate: '2026-10-20',
      locCode: 'DR-01', status: 'STORED', registerBy: '孙工', registerTime: '2026-07-08 11:20', putawayTime: '2026-07-08 11:40',
      sapDocNo: '4900000216', sapMoveType: '331', sapSyncTime: '2026-07-08 11:20:01',
      locationLog: [{ time: '2026-07-08 11:40', from: '', to: 'DR-01', by: '孙工', reason: '入库上架' }] },

    // 待入库（外部委托样，无物料主数据）
    { id: 'P005', category: 'INSPECT', type: 'WT', sampleNo: 'WT-2026-11-002', plant: '2001',
      materialCode: '—', materialName: '客户送检样品（XX 药业 委托）', sourceBatch: '—', inspectBatchNo: '',
      qty: '0.200', unit: 'KG', storageCondition: '冷藏（2~8℃）', validDate: '—',
      locCode: '', status: 'REG', registerBy: '陈工', registerTime: '2026-11-04 09:10', putawayTime: '',
      source: 'MANUAL', locationLog: [] },

    { id: 'P006', category: 'INSPECT', type: 'ZJ', sampleNo: 'ZJ-2026-08-012', plant: '2002',
      materialCode: 'MAT-30009', materialName: '银杏叶提取物（中间品）', sourceBatch: 'SAP-BT-20260812', inspectBatchNo: '100000012901',
      qty: '1.500', unit: 'KG', storageCondition: '避光、阴凉处', validDate: '2026-11-12',
      locCode: 'FRZ-01', status: 'STORED', registerBy: '赵工', registerTime: '2026-08-15 10:00', putawayTime: '2026-08-15 10:20',
      sapDocNo: '4900000250', sapMoveType: '331', sapSyncTime: '2026-08-15 10:00:02',
      locationLog: [{ time: '2026-08-15 10:20', from: '', to: 'FRZ-01', by: '赵工', reason: '入库上架' }] },

    { id: 'P007', category: 'INSPECT', type: 'NBC', sampleNo: 'NBC-2026-09-052', plant: '2001',
      materialCode: 'MAT-20011', materialName: '药用铝箔', sourceBatch: 'SAP-BT-20260905', inspectBatchNo: '100000012930',
      qty: '2.000', unit: '㎡', storageCondition: '常温干燥处', validDate: '2028-09-05',
      locCode: 'QC-01', status: 'STORED', registerBy: '王工', registerTime: '2026-09-08 10:00', putawayTime: '2026-09-08 10:20',
      sapDocNo: '4900000265', sapMoveType: '331', sapSyncTime: '2026-09-08 10:00:01',
      locationLog: [{ time: '2026-09-08 10:20', from: '', to: 'QC-01', by: '王工', reason: '入库上架' }] },

    { id: 'P008', category: 'INSPECT', type: 'CP', sampleNo: 'CP-2026-06-007', plant: '2002',
      materialCode: 'MAT-30007', materialName: '银杏叶提取物注射液', sourceBatch: 'SAP-BT-20260620', inspectBatchNo: '100000012640',
      qty: '12.000', unit: '支', storageCondition: '避光、阴凉处（2~8℃）', validDate: '2027-06-20',
      locCode: 'FRZ-01', status: 'DISPOSED', registerBy: '赵工', registerTime: '2026-06-22 09:30', putawayTime: '2026-06-22 09:50',
      sapDocNo: '4900000198', sapMoveType: '331', sapSyncTime: '2026-06-22 09:30:02',
      locationLog: [{ time: '2026-06-22 09:50', from: '', to: 'FRZ-01', by: '赵工', reason: '入库上架' }],
      disposal: { mode: 'CONSUME', date: '2026-07-10', by1: '赵工', remark: '放行检验完成' } }
  ],

  // 观察任务（仅留样，目检）
  observeData: [
    { id: 'O001', sampleId: 'S001', seq: 1, total: 3, planDate: '2026-04-05', actualDate: '2026-04-06', observer: '王工', item: '外观、包装完整性', result: 'OK', remark: '外观正常，无结块', abnormalNo: '' },
    { id: 'O002', sampleId: 'S001', seq: 2, total: 3, planDate: '2026-11-01', actualDate: '', observer: '', item: '外观、包装完整性', result: '', remark: '', abnormalNo: '' },
    { id: 'O003', sampleId: 'S002', seq: 1, total: 2, planDate: '2026-10-12', actualDate: '2026-10-12', observer: '赵工', item: '外观、澄明度、安瓿完整性', result: 'OK', remark: '外观正常', abnormalNo: '' },
    { id: 'O004', sampleId: 'S002', seq: 2, total: 2, planDate: '2026-12-12', actualDate: '', observer: '', item: '外观、澄明度、安瓿完整性', result: '', remark: '', abnormalNo: '' },
    { id: 'O005', sampleId: 'S003', seq: 1, total: 3, planDate: '2026-01-08', actualDate: '2026-01-09', observer: '李工', item: '外观、包装完整性', result: 'NG', remark: '瓶口有轻微吸潮迹象', abnormalNo: 'QA-2026-0113' },
    { id: 'O006', sampleId: 'S003', seq: 2, total: 3, planDate: '2026-12-01', actualDate: '', observer: '', item: '外观、包装完整性', result: '', remark: '', abnormalNo: '' },
    { id: 'O007', sampleId: 'S004', seq: 1, total: 2, planDate: '2026-11-20', actualDate: '', observer: '', item: '外观、包装完整性', result: '', remark: '', abnormalNo: '' },
    { id: 'O008', sampleId: 'S005', seq: 1, total: 2, planDate: '2023-08-05', actualDate: '2023-08-06', observer: '刘工', item: '外观、包装完整性', result: 'OK', remark: '外观正常', abnormalNo: '' },
    { id: 'O009', sampleId: 'S005', seq: 2, total: 2, planDate: '2024-08-01', actualDate: '2024-08-02', observer: '刘工', item: '外观、包装完整性', result: 'OK', remark: '观察完成，可进入到期处置', abnormalNo: '' }
  ],

  // ==================== 页面骨架 ====================
  render() {
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div style="font-size:18px;font-weight:700;">样品台账</div>
          <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
            onclick="SampleLedger.openRegisterChoice()">+ 样品登记</button>
        </div>
        <div id="sdFilterBar" style="flex-shrink:0;"></div>
        <div class="table-wrapper" id="sdTableWrapper" style="flex:1;overflow:auto;width:100%;min-width:0;"></div>
        <div id="sdPagination" style="flex-shrink:0;"></div>
      </div>`;
  },

  init() {
    this.page = 1;
    this.renderFilterBar();
    if (window.QueryVariant) {
      QueryVariant.mount('sample-ledger');
      QueryVariant.restore('sample-ledger');
      QueryVariant.bindRecent('sample-ledger');
    }
    this.renderTable();
    this.renderPagination();
  },

  // ==================== 通用工具 ====================
  _val(id) { const e = document.getElementById(id); return e ? String(e.value || '').trim() : ''; },
  _user() { return (window.currentUser && window.currentUser.name) || '当前用户'; },
  _now() {
    const d = new Date(), p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  },
  _today() { return this._now().substring(0, 10); },
  // 本地日期格式化（不能用 toISOString：会按 UTC 截断，东八区会少一天）
  _fmtDate(d) {
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  },

  isRetention(s) { return s && s.category === 'RETENTION'; },
  isStab(s) { return s && s.category === 'STAB'; },
  locName(code) { const l = this.locations.find(x => x.code === code); return l ? l.name : (code || '—'); },
  getStatusMeta(status) { return this.statusMeta[status] || { name: status, badge: 'badge-gray' }; },
  getCategoryMeta(s) {
    if (this.isRetention(s)) return { name: '留样', badge: 'badge-purple' };
    if (this.isStab(s)) return { name: '稳定性', badge: 'badge-blue' };
    const t = this.typeOptions.find(x => x.code === s.type);
    return { name: t ? t.name : '检验样品', badge: 'badge-blue' };
  },

  // 到期日：留样/稳定性取 dueDate，检验样品取有效期
  dueOf(s) { return s.dueDate && s.dueDate !== '—' ? s.dueDate : (s.validDate || ''); },
  daysLeft(s) {
    const d = this.dueOf(s);
    if (!d || d === '—') return null;
    const due = new Date(d + 'T00:00:00');
    if (isNaN(due.getTime())) return null;
    const today = new Date(this._today() + 'T00:00:00');
    return Math.round((due - today) / 86400000);
  },

  observeOf(sid) { return this.observeData.filter(o => o.sampleId === sid).sort((a, b) => a.seq - b.seq); },
  pendingObserve(s) {
    if (!this.isRetention(s) || s.status === 'DISPOSED') return 0;
    return this.observeData.filter(o => o.sampleId === s.id && !o.actualDate).length;
  },

  // ==================== 筛选栏 ====================
  renderFilterBar() {
    const el = document.getElementById('sdFilterBar');
    if (!el) return;
    const plantOpts = this.plantOptions.map(p => `<option value="${p.code}">${p.code} ${p.name}</option>`).join('');
    const typeOpts = this.typeOptions.map(t => `<option value="${t.code}">${t.code} ${t.name}</option>`).join('');
    const locOpts = this.locations.map(l => `<option value="${l.code}">${l.name}</option>`).join('');
    el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
      <div class="filter-group"><label>工厂</label><select id="sdPlant"><option value="">全部</option>${plantOpts}</select></div>
      <div class="filter-group"><label>样品类别</label><select id="sdCategory">
        <option value="">全部</option>
        <option value="RETENTION">留样</option>
        <option value="STAB">稳定性</option>
        <option value="INSPECT">检验样品</option>
      </select></div>
      <div class="filter-group"><label>检验类别</label><select id="sdType"><option value="">全部</option>${typeOpts}</select></div>
      <div class="filter-group"><label>编号 / 物料</label><input type="text" id="sdKeyword" placeholder="编号 / 物料 / 批次"></div>
      <div class="filter-group"><label>状态</label><select id="sdStatus">
        <option value="">全部</option>
        <option value="REG">待入库</option>
        <option value="STORED">存放中</option>
        <option value="DISPOSED">已处置</option>
        <option value="TO_OBSERVE">待观察（留样）</option>
      </select></div>
      <div class="filter-group"><label>存放地点</label><select id="sdLoc"><option value="">全部</option>${locOpts}</select></div>
      <div class="filter-group"><label>剩余天数</label><select id="sdDue">
        <option value="">全部</option>
        <option value="EXPIRED">已过期</option>
        <option value="D30">≤30 天</option>
        <option value="D90">≤90 天</option>
      </select></div>
      <div class="filter-group"><label>检验批号</label><input type="text" id="sdBatch" placeholder="检验批号"></div>
      ${FilterActions.render({ pageId: 'sample-ledger', scope: 'SampleLedger', onExport: 'exportData' })}
    </div>`;
  },

  filtered() {
    const plant = this._val('sdPlant'), cat = this._val('sdCategory'), type = this._val('sdType');
    const kw = this._val('sdKeyword').toLowerCase(), st = this._val('sdStatus');
    const loc = this._val('sdLoc'), due = this._val('sdDue'), batch = this._val('sdBatch').toLowerCase();

    return this.data.filter(s => {
      if (plant && s.plant !== plant) return false;
      if (cat && s.category !== cat) return false;
      if (type && s.type !== type) return false;
      if (loc && s.locCode !== loc) return false;
      if (batch && (s.inspectBatchNo || '').toLowerCase().indexOf(batch) === -1) return false;
      if (kw) {
        const hay = [s.sampleNo, s.materialCode, s.materialName, s.sourceBatch, s.inspectBatchNo].join(' ').toLowerCase();
        if (hay.indexOf(kw) === -1) return false;
      }
      if (st === 'TO_OBSERVE') return this.pendingObserve(s) > 0;
      if (st && s.status !== st) return false;
      if (due) {
        const d = this.daysLeft(s);
        if (d === null) return false;
        if (due === 'EXPIRED' && d >= 0) return false;
        if (due === 'D30' && (d < 0 || d > 30)) return false;
        if (due === 'D90' && (d < 0 || d > 90)) return false;
      }
      return true;
    });
  },

  search() { this.page = 1; this.renderTable(); this.renderPagination(); },

  // ==================== 表格 ====================
  renderTable() {
    const el = document.getElementById('sdTableWrapper');
    if (!el) return;
    const list = this.filtered();
    const totalPages = Math.ceil(list.length / this.pageSize) || 1;
    if (this.page > totalPages) this.page = totalPages;
    const start = (this.page - 1) * this.pageSize;
    const rows = list.slice(start, start + this.pageSize).map(s => this.renderRow(s)).join('');

    el.innerHTML = `<table class="data-table" style="min-width:1280px;">
      <thead><tr>
        <th style="width:165px;">样品编号</th>
        <th style="width:85px;">类别</th>
        <th style="width:225px;">物料 / 来源批次</th>
        <th style="width:135px;">检验批号</th>
        <th style="width:90px;">数量</th>
        <th style="width:115px;">存放地点</th>
        <th style="width:105px;">到期日</th>
        <th style="width:105px;">状态</th>
        <th style="width:250px;">操作</th>
      </tr></thead>
      <tbody>${rows || '<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:32px;">暂无符合条件的数据</td></tr>'}</tbody>
    </table>`;
  },

  renderRow(s) {
    const cat = this.getCategoryMeta(s);
    const st = this.getStatusMeta(s.status);
    const d = this.daysLeft(s);
    let dueHtml = '<span style="color:var(--text-muted);">—</span>';
    if (d !== null) {
      if (d < 0) dueHtml = `<div>${esc(this.dueOf(s))}</div><div style="font-size:11px;color:#dc2626;">已超期 ${-d} 天</div>`;
      else if (d <= 30) dueHtml = `<div>${esc(this.dueOf(s))}</div><div style="font-size:11px;color:#d97706;">${d} 天后到期</div>`;
      else dueHtml = esc(this.dueOf(s));
    }
    const obs = this.pendingObserve(s);
    return `<tr>
      <td style="font-family:monospace;font-size:12px;">${esc(s.sampleNo)}</td>
      <td><span class="badge badge-sm ${cat.badge}">${esc(cat.name)}</span></td>
      <td>
        <div style="font-weight:500;">${esc(s.materialName)}</div>
        <div style="font-size:11px;color:var(--text-muted);">${esc(s.materialCode || '—')} · ${esc(s.sourceBatch || '—')}</div>
      </td>
      <td style="font-family:monospace;font-size:12px;">${esc(s.inspectBatchNo || '—')}</td>
      <td>${esc(s.qty)} ${esc(s.unit || '')}</td>
      <td>${s.locCode ? esc(this.locName(s.locCode)) : '<span style="color:var(--text-muted);">未上架</span>'}</td>
      <td style="font-size:12px;">${dueHtml}</td>
      <td>
        <span class="badge badge-sm ${st.badge}">${esc(st.name)}</span>
        ${obs ? `<span class="badge badge-sm badge-purple" style="margin-left:4px;">待观察 ${obs}</span>` : ''}
      </td>
      <td><div class="table-actions">${this.getSampleActions(s)}</div></td>
    </tr>`;
  },

  // 行内按钮：全集常显、每行一致；不支持时由 _act 提示原因
  getSampleActions(s) {
    const b = (action, label, cls, title) =>
      `<button class="btn ${cls} btn-sm" onclick="SampleLedger._act('${s.id}','${action}')" title="${title}">${label}</button>`;
    return b('putaway', '上架', 'btn-primary', '入库上架：选择库存地点')
      + b('move', '变更', '', '库存地点变更')
      + b('observe', '观察', 'style="background:#8b5cf6;color:#fff;"', '留样目检')
      + b('dispose', '处置', 'btn-danger', '处置登记')
      + b('view', '查看', 'btn-blue', '样品详情');
  },

  _actName(action) {
    return { putaway: '上架', move: '变更', observe: '留样观察', dispose: '处置', view: '查看' }[action] || action;
  },

  _act(id, action) {
    const s = this.data.find(x => x.id === id);
    if (!s) return;
    const allowed = {
      putaway: s.status === 'REG',
      move: s.status === 'STORED',
      observe: s.status === 'STORED' && this.isRetention(s),
      dispose: s.status === 'STORED',
      view: true
    }[action];
    if (!allowed) return this.notifyBlocked(s, action);
    if (action === 'putaway' || action === 'move') return this.openLocationForm(id, action === 'move');
    if (action === 'observe') return this.openObserveList(id);
    if (action === 'dispose') return this.openDisposal(id);
    if (action === 'view') return this.openDetail(id);
  },

  notifyBlocked(s, action) {
    const st = this.getStatusMeta(s.status).name;
    let reason = '';
    if (action === 'observe' && !this.isRetention(s)) reason = '该样品非留样，不做目检';
    else if (action === 'putaway' && s.status !== 'REG') reason = '已上架，无需重复上架';
    else if (s.status === 'DISPOSED') reason = '已完成处置，台账只读';
    toast('样品 ' + s.sampleNo + ' 状态为「' + st + '」，不支持「' + this._actName(action) + '」操作' + (reason ? '（' + reason + '）' : ''));
  },

  // ==================== 分页 ====================
  renderPagination() {
    const el = document.getElementById('sdPagination');
    if (!el) return;
    const total = this.filtered().length;
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
    const pages = Math.ceil(Math.max(this.filtered().length, 1) / this.pageSize);
    if (this.page < pages) { this.page++; this.renderTable(); this.renderPagination(); }
  },
  changePageSize(n) { this.pageSize = Number(n) || 10; this.page = 1; this.renderTable(); this.renderPagination(); },

  // ==================== 登记 ====================
  openRegisterChoice() {
    const cards = [
      { title: '留样登记', desc: '按留样规则带出留样量、保存条件与到期日<br>登记后过账 SAP 311（→ 留样库位）', call: 'SampleLedger.openRegisterRetention()', emoji: '🧫' },
      { title: '从检验批带出', desc: '选择检验批，物料 / 批次 / 检验批号自动带入<br>适用于补录检验样品', call: 'SampleLedger.openRegisterFromBatch()', emoji: '📋' },
      { title: '手动登记', desc: '手工填写物料与来源<br>适用于环境监测、验证样等无请验单样品', call: 'SampleLedger.openRegisterManual()', emoji: '✍️' }
    ];
    const html = `<div style="padding:8px 0;"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
      ${cards.map(c => `<div onclick="closeModal();${c.call}"
        style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:12px;padding:22px 14px;cursor:pointer;text-align:center;min-height:180px;"
        onmouseenter="this.style.borderColor='#6366f1';this.style.transform='translateY(-2px)'"
        onmouseleave="this.style.borderColor='#e2e8f0';this.style.transform='translateY(0)'">
        <div style="font-size:36px;margin-bottom:8px;">${c.emoji}</div>
        <div style="font-size:16px;font-weight:700;color:#334155;margin-bottom:6px;">${c.title}</div>
        <div style="font-size:12px;color:#4b5563;line-height:1.5;">${c.desc}</div>
      </div>`).join('')}
    </div></div>`;
    showModal('选择登记方式', html, [{ text: '取消', cls: 'btn-secondary', action: closeModal }], 'modal-lg');
  },

  openRegisterRetention() {
    const rule = (window.RetentionRule && RetentionRule.data.find(r => r.needSample)) || null;
    const plantOpts = this.plantOptions.map(p => `<option value="${p.code}" ${p.code === '2001' ? 'selected' : ''}>${p.code} ${p.name}</option>`).join('');
    const locOpts = this.locations.map(l => `<option value="${l.code}">${l.name}</option>`).join('');
    const keepOpts = (window.RetentionRule ? RetentionRule.keepRuleOptions : ['有效期后 1 年', '有效期后 6 个月', '放行后 3 年'])
      .map(v => `<option ${rule && rule.keepRule === v ? 'selected' : ''}>${v}</option>`).join('');
    const freqOpts = (window.RetentionRule ? RetentionRule.freqOptions : ['每 12 个月', '每 6 个月', '每 3 个月'])
      .map(v => `<option ${rule && rule.observeFreq === v ? 'selected' : ''}>${v}</option>`).join('');

    showModal('留样登记', `
      <div style="padding:4px 0;"><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
        <div class="form-group"><label>工厂 <span class="req">*</span></label><select id="rrPlant">${plantOpts}</select></div>
        <div class="form-group"><label>物料编码 <span class="req">*</span></label><input type="text" id="rrMatCode" value="${esc(rule ? rule.materialCode : '')}"></div>
        <div class="form-group"><label>物料名称 <span class="req">*</span></label><input type="text" id="rrMatName" value="${esc(rule ? rule.materialName : '')}"></div>
        <div class="form-group"><label>来源批次</label><input type="text" id="rrBatch" placeholder="SAP 批次"></div>
        <div class="form-group"><label>检验批号</label><input type="text" id="rrInspectBatch" placeholder="可空"></div>
        <div class="form-group"><label>留样量 <span class="req">*</span></label><input type="text" id="rrQty" value="${esc(rule ? rule.sampleQty : '0.500')}"></div>
        <div class="form-group"><label>单位</label><input type="text" id="rrUnit" value="${esc(rule ? rule.unit : 'KG')}"></div>
        <div class="form-group"><label>保存条件</label><input type="text" id="rrCondition" value="${esc(rule ? rule.storageCondition : '阴凉干燥处')}"></div>
        <div class="form-group"><label>保存期限规则</label><select id="rrKeepRule">${keepOpts}</select></div>
        <div class="form-group"><label>观察频次</label><select id="rrFreq">${freqOpts}</select></div>
        <div class="form-group"><label>观察次数</label><input type="number" id="rrTimes" min="1" max="12" value="${rule ? rule.observeTimes : 3}"></div>
        <div class="form-group"><label>有效期</label><input type="date" id="rrValid" value="2028-05-31"></div>
        <div class="form-group"><label>库存地点</label><select id="rrLoc"><option value="">暂不上架</option>${locOpts}</select></div>
      </div>
      <div style="margin-top:14px;font-size:12px;color:var(--text-muted);">登记后过账 SAP 311（→ 留样库位），到期销毁时 551。</div></div>`,
      [{ text: '取消', cls: 'btn-secondary', action: closeModal },
       { text: '确认登记', cls: 'btn-primary', action: () => SampleLedger.submitRegister('retention') }], 'modal-lg');
  },

  openRegisterFromBatch() {
    const batches = this.data.filter(s => s.inspectBatchNo).slice(0, 12);
    const batchOpts = batches.map(s => `<option value="${s.id}">${esc(s.inspectBatchNo)} · ${esc(s.materialName)}</option>`).join('');
    const typeOpts = this.typeOptions.map(t => `<option value="${t.code}">${t.code} ${t.name}</option>`).join('');
    const locOpts = this.locations.map(l => `<option value="${l.code}">${l.name}</option>`).join('');
    showModal('从检验批带出', `
      <div style="padding:4px 0;"><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
        <div class="form-group" style="grid-column:span 2;"><label>检验批 <span class="req">*</span></label><select id="rbBatch">${batchOpts}</select></div>
        <div class="form-group"><label>样品类别</label><select id="rbType">${typeOpts}</select></div>
        <div class="form-group"><label>样品数量 <span class="req">*</span></label><input type="text" id="rbQty" value="1.000"></div>
        <div class="form-group"><label>保存条件</label><input type="text" id="rbCondition" placeholder="如 阴凉干燥处"></div>
        <div class="form-group"><label>有效期</label><input type="date" id="rbValid"></div>
        <div class="form-group"><label>库存地点</label><select id="rbLoc"><option value="">暂不上架</option>${locOpts}</select></div>
      </div></div>`,
      [{ text: '取消', cls: 'btn-secondary', action: closeModal },
       { text: '确认登记', cls: 'btn-primary', action: () => SampleLedger.submitRegister('batch') }], 'modal-lg');
  },

  openRegisterManual() {
    const plantOpts = this.plantOptions.map(p => `<option value="${p.code}">${p.code} ${p.name}</option>`).join('');
    const typeOpts = this.typeOptions.map(t => `<option value="${t.code}" ${t.code === 'HJ' ? 'selected' : ''}>${t.code} ${t.name}</option>`).join('');
    const locOpts = this.locations.map(l => `<option value="${l.code}">${l.name}</option>`).join('');
    showModal('手动登记', `
      <div style="padding:4px 0;"><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
        <div class="form-group"><label>工厂</label><select id="rmPlant">${plantOpts}</select></div>
        <div class="form-group"><label>样品类别</label><select id="rmType">${typeOpts}</select></div>
        <div class="form-group"><label>物料编码</label><input type="text" id="rmMaterialCode" placeholder="无则填 —"></div>
        <div class="form-group"><label>物料 / 样品名称 <span class="req">*</span></label><input type="text" id="rmMaterialName" placeholder="如 洁净区沉降菌（D级 车间一）"></div>
        <div class="form-group"><label>来源批次</label><input type="text" id="rmSourceBatch" placeholder="如 —"></div>
        <div class="form-group"><label>检验批号</label><input type="text" id="rmInspectBatch" placeholder="可空"></div>
        <div class="form-group"><label>数量 <span class="req">*</span></label><input type="text" id="rmQty" value="1.000"></div>
        <div class="form-group"><label>单位</label><input type="text" id="rmUnit" value="皿"></div>
        <div class="form-group"><label>保存条件</label><input type="text" id="rmCondition" placeholder="如 冷藏"></div>
        <div class="form-group"><label>有效期</label><input type="date" id="rmValid"></div>
        <div class="form-group"><label>库存地点</label><select id="rmLoc"><option value="">暂不上架</option>${locOpts}</select></div>
      </div></div>`,
      [{ text: '取消', cls: 'btn-secondary', action: closeModal },
       { text: '确认登记', cls: 'btn-primary', action: () => SampleLedger.submitRegister('manual') }], 'modal-lg');
  },

  submitRegister(mode) {
    const now = this._now();

    if (mode === 'retention') {
      const qty = this._val('rrQty');
      const name = this._val('rrMatName');
      if (!qty || Number(qty) <= 0) return toast('请填写留样量');
      if (!name) return toast('请填写物料名称');

      const validDate = this._val('rrValid') || '—';
      const keepRule = this._val('rrKeepRule');
      let due = '—';
      if (validDate !== '—') {
        const months = window.RetentionRule ? RetentionRule.keepMonths(keepRule) : 12;
        const d = new Date(validDate + 'T00:00:00');
        d.setMonth(d.getMonth() + months);
        due = this._fmtDate(d);
      }
      const plant = this._val('rrPlant') || '2001';
      const loc = this._val('rrLoc');
      const seq = String(this.data.filter(r => this.isRetention(r)).length + 1).padStart(3, '0');
      const rec = {
        id: 'S' + (900 + this.data.length + 1), category: 'RETENTION',
        sampleNo: 'LS-' + plant + '-26' + seq, plant,
        materialCode: this._val('rrMatCode') || '—', materialName: name,
        sourceBatch: this._val('rrBatch'), inspectBatchNo: this._val('rrInspectBatch'),
        qty, unit: this._val('rrUnit'), storageCondition: this._val('rrCondition'),
        keepRule, validDate, dueDate: due,
        observeFreq: this._val('rrFreq'), nextObserveDate: '',
        locCode: loc, status: loc ? 'STORED' : 'REG',
        registerBy: this._user(), registerTime: now, putawayTime: loc ? now : '',
        sapDocNo: '49000009' + String(60 + this.data.length), sapMoveType: '311', sapSyncTime: now,
        source: 'MANUAL',
        locationLog: loc ? [{ time: now, from: '', to: loc, by: this._user(), reason: '入库上架' }] : []
      };
      this.data.unshift(rec);
      this._genObserveTasks(rec, this._val('rrTimes'), rec.observeFreq);
      closeModal(); this.init();
      toast('登记成功：' + rec.sampleNo + ' · SAP 311 凭证 ' + rec.sapDocNo);
      return;
    }

    if (mode === 'batch') {
      const src = this.data.find(x => x.id === this._val('rbBatch'));
      const qty = this._val('rbQty');
      if (!src) return toast('请选择检验批');
      if (!qty || Number(qty) <= 0) return toast('请填写样品数量');
      const loc = this._val('rbLoc');
      const rec = {
        id: 'P' + (900 + this.data.length + 1), category: 'INSPECT', plant: src.plant,
        type: this._val('rbType') || 'QT',
        materialCode: src.materialCode, materialName: src.materialName,
        sourceBatch: src.sourceBatch, inspectBatchNo: src.inspectBatchNo,
        qty, unit: src.unit, storageCondition: this._val('rbCondition'),
        validDate: this._val('rbValid') || '—',
        locCode: loc, status: loc ? 'STORED' : 'REG',
        registerBy: this._user(), registerTime: now, putawayTime: loc ? now : '',
        source: 'INSPECT_BATCH',
        locationLog: loc ? [{ time: now, from: '', to: loc, by: this._user(), reason: '入库上架' }] : []
      };
      rec.sampleNo = this._genSampleNo(rec.type);
      this.data.unshift(rec);
      closeModal(); this.init();
      toast('登记成功：' + rec.sampleNo);
      return;
    }

    const name = this._val('rmMaterialName');
    const qty = this._val('rmQty');
    if (!name) return toast('请填写物料 / 样品名称');
    if (!qty || Number(qty) <= 0) return toast('请填写样品数量');
    const loc = this._val('rmLoc');
    const rec = {
      id: 'P' + (900 + this.data.length + 1), category: 'INSPECT',
      plant: this._val('rmPlant') || '2001', type: this._val('rmType') || 'QT',
      materialCode: this._val('rmMaterialCode') || '—', materialName: name,
      sourceBatch: this._val('rmSourceBatch') || '—', inspectBatchNo: this._val('rmInspectBatch'),
      qty, unit: this._val('rmUnit'), storageCondition: this._val('rmCondition'),
      validDate: this._val('rmValid') || '—',
      locCode: loc, status: loc ? 'STORED' : 'REG',
      registerBy: this._user(), registerTime: now, putawayTime: loc ? now : '',
      source: 'MANUAL',
      locationLog: loc ? [{ time: now, from: '', to: loc, by: this._user(), reason: '入库上架' }] : []
    };
    rec.sampleNo = this._genSampleNo(rec.type);
    this.data.unshift(rec);
    closeModal(); this.init();
    toast('登记成功：' + rec.sampleNo);
  },

  _genSampleNo(type) {
    const d = new Date();
    const ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    const prefix = type + '-' + ym + '-';
    const seq = this.data.filter(r => (r.sampleNo || '').indexOf(prefix) === 0).length + 1;
    return prefix + String(seq).padStart(3, '0');
  },

  // ==================== 取样建账（331 消耗 / 311 留样） ====================
  // 由检验批取样弹窗调用：一次取样按用途分流，最多生成两条记录
  createFromSampling(p) {
    const now = p.time || this._now();
    const by = p.by || this._user();
    const made = [];

    // 消耗性取样 → 检验样品（331 出账，SAP 不再有库存）
    if (Number(p.consumeQty) > 0) {
      const rec = {
        id: 'P' + (900 + this.data.length + 1), category: 'INSPECT', type: p.type || 'YF',
        plant: p.plant || '2001', materialCode: p.materialCode || '—',
        materialName: p.materialName || '待确认样品',
        sourceBatch: p.sourceBatch || '', inspectBatchNo: p.batchNo || '',
        qty: String(p.consumeQty), unit: p.unit || '',
        storageCondition: '—', validDate: '—', locCode: '', status: 'REG',
        registerBy: by, registerTime: now, putawayTime: '',
        source: 'SAMPLING',
        sapDocNo: (p.vouchers && p.vouchers.m331) || '', sapMoveType: '331', sapSyncTime: now,
        locationLog: []
      };
      rec.sampleNo = this._genSampleNo(rec.type);
      if (p.waiver && p.waiver.reason) {
        rec.retainWaiver = { reason: p.waiver.reason, rule: p.waiver.rule || '', by, time: now };
      }
      this.data.unshift(rec); made.push(rec);
    }

    // 作为留样 → 311 转储留样库位（SAP 仍有库存，到期 551 报废）
    const rt = p.retain || {};
    if (Number(rt.qty) > 0) {
      const keepRule = rt.keepRule || '有效期后 1 年';
      let due = '—';
      if (rt.validDate && rt.validDate !== '—') {
        const months = window.RetentionRule ? RetentionRule.keepMonths(keepRule) : 12;
        const d = new Date(rt.validDate + 'T00:00:00');
        d.setMonth(d.getMonth() + months);
        due = this._fmtDate(d);
      }
      const seq = String(this.data.filter(r => this.isRetention(r)).length + 1).padStart(3, '0');
      const rec = {
        id: 'S' + (900 + this.data.length + 1), category: 'RETENTION',
        sampleNo: 'LS-' + (p.plant || '2001') + '-26' + seq,
        plant: p.plant || '2001', materialCode: p.materialCode || '—',
        materialName: p.materialName || '待确认物料',
        sourceBatch: p.sourceBatch || '', inspectBatchNo: p.batchNo || '',
        qty: String(rt.qty), unit: p.unit || '',
        storageCondition: rt.condition || '阴凉干燥处', keepRule,
        validDate: rt.validDate || '—', dueDate: due,
        observeFreq: rt.observeFreq || '每 12 个月', nextObserveDate: '',
        locCode: '', status: 'REG',
        registerBy: by, registerTime: now, putawayTime: '',
        source: 'SAMPLING',
        sapDocNo: (p.vouchers && p.vouchers.m311) || '', sapMoveType: '311', sapSyncTime: now,
        locationLog: []
      };
      this.data.unshift(rec); made.push(rec);
      this._genObserveTasks(rec, rt.observeTimes, rt.observeFreq);
    }
    return made;
  },

  // 按观察频次预排目检任务，并把首个计划日写回 nextObserveDate
  _genObserveTasks(rec, times, freq) {
    const total = Math.max(1, Number(times) || 3);
    const step = window.RetentionRule ? RetentionRule.freqMonths(freq || rec.observeFreq) : 12;
    const base = new Date((rec.registerTime || this._now()).substring(0, 10) + 'T00:00:00');
    let first = '';
    for (let i = 1; i <= total; i++) {
      const d = new Date(base);
      d.setMonth(d.getMonth() + step * i);
      const plan = this._fmtDate(d);
      if (i === 1) first = plan;
      this.observeData.push({
        id: 'O' + (900 + this.observeData.length + 1),
        sampleId: rec.id, seq: i, total, planDate: plan,
        actualDate: '', observer: '', item: '外观、包装完整性',
        result: '', remark: '', abnormalNo: ''
      });
    }
    rec.nextObserveDate = first;
    return total;
  },

  // ==================== 上架 / 地点变更 ====================
  openLocationForm(sid, isMove) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    const opts = this.locations.map(l =>
      `<option value="${l.code}" ${isMove && l.code === s.locCode ? 'disabled' : ''}>${l.name}</option>`).join('');
    showModal(isMove ? '库存地点变更' : '入库上架', `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:13px;">
          ${esc(s.sampleNo)} · ${esc(s.materialName)} · ${esc(s.qty)} ${esc(s.unit)}
          <div style="color:var(--text-secondary);font-size:12px;margin-top:2px;">当前地点：${s.locCode ? esc(this.locName(s.locCode)) : '未上架'}</div>
        </div>
        <div class="form-group"><label>新地点 <span class="req">*</span></label><select id="sdNewLoc">${opts}</select></div>
        <div class="form-group"><label>${isMove ? '变更原因' : '备注'}</label>
          <input type="text" id="sdMoveReason" placeholder="${isMove ? '如 温度异常转移 / 容量调整' : '可选'}"></div>
      </div>`,
      [{ text: '取消', cls: 'btn-secondary', action: closeModal },
       { text: isMove ? '确认变更' : '确认上架', cls: 'btn-primary', action: () => SampleLedger.saveLocation(sid, isMove) }], 'modal-md');
  },

  saveLocation(sid, isMove) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    const to = this._val('sdNewLoc');
    if (!to) return toast('请选择库存地点');
    if (isMove && to === s.locCode) return toast('新地点与当前地点相同');
    const now = this._now();
    s.locationLog = s.locationLog || [];
    s.locationLog.push({
      time: now, from: s.locCode || '', to,
      by: this._user(), reason: isMove ? (this._val('sdMoveReason') || '地点变更') : '入库上架'
    });
    s.locCode = to;
    if (!isMove) { s.status = 'STORED'; s.putawayTime = now; }
    closeModal(); this.init();
    toast((isMove ? '已变更至 ' : '已上架至 ') + this.locName(to));
  },

  // ==================== 观察（仅留样，目检） ====================
  openObserveList(sid) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    const tasks = this.observeOf(sid);
    const rows = tasks.map(t => `<tr>
      <td>第 ${t.seq} / ${t.total} 次</td>
      <td>${esc(t.planDate)}</td>
      <td>${esc(t.actualDate || '—')}</td>
      <td>${esc(t.observer || '—')}</td>
      <td>${t.result === 'NG' ? '<span style="color:#dc2626;font-weight:600;">NG</span>' : esc(t.result || '—')}</td>
      <td style="font-size:12px;">${esc(t.abnormalNo || '—')}</td>
      <td class="table-actions">${t.actualDate
        ? '<span style="color:var(--text-muted);font-size:12px;">已完成</span>'
        : `<button class="btn btn-primary btn-sm" onclick="closeModal();SampleLedger.openObserveEntry('${sid}','${t.id}')">录入</button>`}</td>
    </tr>`).join('');

    showModal('留样观察 · ' + s.sampleNo, `
      <div style="padding:4px 0;">
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:10px;">
          ${esc(s.materialName)} · 频次 ${esc(s.observeFreq || '—')} · 共 ${tasks.length} 次
        </div>
        <table class="data-table"><thead><tr>
          <th>次序</th><th>计划日期</th><th>实际日期</th><th>观察人</th><th>结果</th><th>质量异常单</th><th>操作</th>
        </tr></thead><tbody>${rows || '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">未生成观察任务</td></tr>'}</tbody></table>
      </div>`,
      [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-lg');
  },

  openObserveEntry(sid, obsId) {
    const s = this.data.find(x => x.id === sid);
    const t = this.observeData.find(o => o.id === obsId);
    if (!s || !t) return;
    showModal('录入观察 · 第 ' + t.seq + ' / ' + t.total + ' 次', `
      <div style="padding:4px 0;"><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
        <div class="form-group"><label>实际日期 <span class="req">*</span></label><input type="date" id="obDate" value="${this._today()}"></div>
        <div class="form-group"><label>观察人 <span class="req">*</span></label><input type="text" id="obBy" value="${esc(this._user())}"></div>
        <div class="form-group" style="grid-column:span 2;"><label>观察项目</label><input type="text" id="obItem" value="${esc(t.item)}"></div>
        <div class="form-group"><label>结果 <span class="req">*</span></label><select id="obResult">
          <option value="OK">合格</option><option value="NG">不合格</option></select></div>
        <div class="form-group"><label>备注</label><input type="text" id="obRemark"></div>
        <div class="form-group" style="grid-column:span 2;"><label>质量异常单号</label>
          <input type="text" id="obAbnormal" placeholder="结果不合格时生成／填写">
          <span style="font-size:12px;color:var(--text-muted);">结果选不合格且留空，将自动生成异常单号</span></div>
      </div></div>`,
      [{ text: '取消', cls: 'btn-secondary', action: () => { closeModal(); SampleLedger.openObserveList(sid); } },
       { text: '保存', cls: 'btn-primary', action: () => SampleLedger.saveObserve(sid, obsId) }], 'modal-lg');
  },

  saveObserve(sid, obsId) {
    const s = this.data.find(x => x.id === sid);
    const t = this.observeData.find(o => o.id === obsId);
    if (!s || !t) return;
    const date = this._val('obDate');
    if (!date) return toast('请选择实际日期');
    t.actualDate = date;
    t.observer = this._val('obBy') || this._user();
    t.item = this._val('obItem') || t.item;
    t.result = this._val('obResult') || 'OK';
    t.remark = this._val('obRemark');
    let ab = this._val('obAbnormal');
    if (t.result === 'NG' && !ab) {
      ab = 'QA-' + date.replace(/-/g, '') + '-' + String(Math.floor(Math.random() * 900) + 100);
    }
    t.abnormalNo = ab;

    const pending = this.observeOf(sid).filter(o => !o.actualDate);
    s.nextObserveDate = pending.length ? pending[0].planDate : '—';
    closeModal(); this.init();
    if (pending.length) this.openObserveList(sid);
    toast(t.result === 'NG' ? '观察不合格，已关联质量异常单 ' + ab : '观察已录入');
  },

  // ==================== 处置（按类别分叉） ====================
  openDisposal(sid) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    const destroy = this.isRetention(s) || this.isStab(s);
    showModal((destroy ? '销毁登记' : '消耗登记') + ' · ' + s.sampleNo, `
      <div style="padding:4px 0;">
        <div style="background:${destroy ? '#fef2f2' : '#f0f9ff'};border:1px solid ${destroy ? '#fecaca' : '#bae6fd'};border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:13px;">
          ${esc(s.materialName)} · ${esc(s.qty)} ${esc(s.unit)} · ${esc(this.getCategoryMeta(s).name)}
          <div style="color:var(--text-secondary);font-size:12px;margin-top:2px;">处置为整批，处置后进入终态只读</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>处置日期 <span class="req">*</span></label><input type="date" id="dpDate" value="${this._today()}"></div>
          <div class="form-group"><label>执行人 <span class="req">*</span></label><input type="text" id="dpBy1" value="${esc(this._user())}"></div>
          ${destroy ? `
          <div class="form-group"><label>执行人 2 <span class="req">*</span></label><input type="text" id="dpBy2"></div>
          <div class="form-group"><label>见证人 <span class="req">*</span></label><input type="text" id="dpWitness"></div>
          <div class="form-group"><label>销毁方式 <span class="req">*</span></label><select id="dpMethod">
            <option>焚烧</option><option>化学处理</option><option>撕碎</option><option>高压灭菌</option></select></div>
          <div class="form-group"><label>销毁单号</label><input type="text" id="dpNo" placeholder="留空自动生成"></div>` : `
          <div class="form-group" style="grid-column:span 2;"><label>消耗说明</label>
            <input type="text" id="dpRemark" placeholder="如 检验完成，样品消耗完毕"></div>`}
        </div>
        <div style="margin-top:12px;font-size:12px;color:var(--text-muted);">
          ${destroy ? '登记后过账 SAP 551（报废），并回写物料凭证号。' : '检验样品取样时已按 331 出账，处置不再产生 SAP 凭证。'}
        </div>
      </div>`,
      [{ text: '取消', cls: 'btn-secondary', action: closeModal },
       { text: '确认' + (destroy ? '销毁' : '消耗'), cls: 'btn-danger', action: () => SampleLedger.saveDisposal(sid, destroy) }], 'modal-lg');
  },

  saveDisposal(sid, destroy) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    const date = this._val('dpDate');
    const by1 = this._val('dpBy1');
    if (!date) return toast('请选择处置日期');
    if (!by1) return toast('请填写执行人');

    if (destroy) {
      const by2 = this._val('dpBy2'), witness = this._val('dpWitness');
      if (!by2) return toast('销毁需双执行人');
      if (!witness) return toast('销毁需见证人');
      const no = this._val('dpNo') || ('DSP-' + date.replace(/-/g, '') + '-' + String(this.data.length + 1).padStart(3, '0'));
      s.disposal = {
        mode: 'DESTROY', date, by1, by2, witness,
        method: this._val('dpMethod') || '焚烧', no,
        sapDoc: '49000008' + String(10 + this.data.length), sapMoveType: '551'
      };
      s.status = 'DISPOSED';
      closeModal(); this.init();
      toast('销毁登记完成 · ' + no + ' · SAP 551 凭证 ' + s.disposal.sapDoc);
      return;
    }

    s.disposal = { mode: 'CONSUME', date, by1, remark: this._val('dpRemark') };
    s.status = 'DISPOSED';
    closeModal(); this.init();
    toast('消耗登记完成，样品 ' + s.sampleNo + ' 已闭环');
  },

  // ==================== 详情（只读） ====================
  openDetail(sid) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    const cat = this.getCategoryMeta(s), st = this.getStatusMeta(s.status);
    const isRet = this.isRetention(s);

    showModal('样品详情 — ' + s.sampleNo, `
      <div style="padding:4px 0;">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px;">
          <span style="font-family:monospace;font-weight:700;font-size:15px;">${esc(s.sampleNo)}</span>
          <span class="badge ${cat.badge}">${esc(cat.name)}</span>
          <span class="badge ${st.badge}">${esc(st.name)}</span>
          ${s.status === 'DISPOSED' ? '<span class="badge badge-gray">终态只读</span>' : ''}
        </div>
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:13px;">
          存放地点：<b>${s.locCode ? esc(this.locName(s.locCode)) : '未上架'}</b>
          ${this.pendingObserve(s) ? `<span style="margin-left:12px;color:#7c3aed;">待观察 ${this.pendingObserve(s)} 次</span>` : ''}
        </div>
        <div style="display:flex;gap:4px;border-bottom:2px solid var(--border);margin-bottom:14px;">
          <div class="form-tab active" data-sltab="base" onclick="SampleLedger._switchTab(this)">基本信息</div>
          <div class="form-tab" data-sltab="loc" onclick="SampleLedger._switchTab(this)">地点变更</div>
          ${isRet ? '<div class="form-tab" data-sltab="obs" onclick="SampleLedger._switchTab(this)">观察记录</div>' : ''}
          <div class="form-tab" data-sltab="dsp" onclick="SampleLedger._switchTab(this)">处置记录</div>
        </div>
        <div class="sl-tab-panel" data-slpanel="base">${this._tabBase(s)}</div>
        <div class="sl-tab-panel" data-slpanel="loc" style="display:none;">${this._tabLocation(s)}</div>
        ${isRet ? `<div class="sl-tab-panel" data-slpanel="obs" style="display:none;">${this._tabObserve(s)}</div>` : ''}
        <div class="sl-tab-panel" data-slpanel="dsp" style="display:none;">${this._tabDisposal(s)}</div>
      </div>`,
      [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-lg');
  },

  _switchTab(el) {
    const key = el.dataset.sltab;
    document.querySelectorAll('.form-tab[data-sltab]').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    document.querySelectorAll('.sl-tab-panel').forEach(p => {
      p.style.display = p.dataset.slpanel === key ? '' : 'none';
    });
  },

  _tabBase(s) {
    const isRet = this.isRetention(s);
    const isStab = this.isStab(s);
    const sapTitle = isRet || isStab ? 'SAP 转储凭证（311）' : 'SAP 取样凭证（331）';
    return `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px 18px;font-size:13px;">
      <div><span style="color:var(--text-muted);">工厂：</span>${esc(s.plant || '—')}</div>
      <div><span style="color:var(--text-muted);">物料：</span>${esc(s.materialCode || '—')} ${esc(s.materialName)}</div>
      <div><span style="color:var(--text-muted);">数量：</span>${esc(s.qty)} ${esc(s.unit || '')}</div>
      <div><span style="color:var(--text-muted);">来源批次：</span>${esc(s.sourceBatch || '—')}</div>
      <div><span style="color:var(--text-muted);">检验批号：</span>${esc(s.inspectBatchNo || '—')}</div>
      <div><span style="color:var(--text-muted);">保存条件：</span>${esc(s.storageCondition || '—')}</div>
      <div><span style="color:var(--text-muted);">有效期：</span>${esc(s.validDate || '—')}</div>
      <div><span style="color:var(--text-muted);">到期日：</span>${esc(this.dueOf(s) || '—')}</div>
      <div><span style="color:var(--text-muted);">登记人：</span>${esc(s.registerBy)} ${esc(s.registerTime)}</div>
      <div><span style="color:var(--text-muted);">入库上架：</span>${esc(s.putawayTime || '—')}</div>
      ${isRet ? `<div><span style="color:var(--text-muted);">期限规则：</span>${esc(s.keepRule || '—')}</div>
      <div><span style="color:var(--text-muted);">观察：</span>${esc(s.observeFreq || '—')} · 下次 ${esc(s.nextObserveDate || '—')}</div>` : ''}
      ${isStab ? `<div><span style="color:var(--text-muted);">期限规则：</span>${esc(s.keepRule || '—')}</div>
      <div><span style="color:var(--text-muted);">考察方案：</span>稳定性研究模块</div>` : ''}
      ${s.sapDocNo ? `<div style="grid-column:span 3;"><span style="color:var(--text-muted);">${sapTitle}：</span>
        ${esc(s.sapDocNo)}（${esc(s.sapSyncTime || '—')}）</div>` : ''}
      ${s.retainWaiver ? `<div style="grid-column:span 3;"><span style="color:var(--text-muted);">留样豁免：</span>
        ${esc(s.retainWaiver.reason)}（${esc(s.retainWaiver.by)} ${esc(s.retainWaiver.time)}）</div>` : ''}
    </div>`;
  },

  _tabLocation(s) {
    const list = s.locationLog || [];
    const rows = list.map(m => `<tr>
      <td>${esc(m.time)}</td>
      <td>${esc(m.from ? this.locName(m.from) : '—')}</td>
      <td>${esc(this.locName(m.to))}</td>
      <td>${esc(m.by)}</td>
      <td>${esc(m.reason || '—')}</td>
    </tr>`).join('');
    return `<table class="data-table"><thead><tr>
      <th>时间</th><th>原地点</th><th>新地点</th><th>操作人</th><th>原因</th>
    </tr></thead><tbody>${rows || '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);">尚无地点变更记录</td></tr>'}</tbody></table>`;
  },

  _tabObserve(s) {
    const tasks = this.observeOf(s.id);
    const rows = tasks.map(t => `<tr>
      <td>第 ${t.seq} / ${t.total} 次</td>
      <td>${esc(t.planDate)}</td>
      <td>${esc(t.actualDate || '—')}</td>
      <td>${esc(t.observer || '—')}</td>
      <td>${t.result === 'NG' ? '<span style="color:#dc2626;font-weight:600;">NG</span>' : esc(t.result || '—')}</td>
      <td style="font-size:12px;">${esc(t.abnormalNo || '—')}</td>
    </tr>`).join('');
    return `<table class="data-table"><thead><tr>
      <th>次序</th><th>计划日期</th><th>实际日期</th><th>观察人</th><th>结果</th><th>质量异常单</th>
    </tr></thead><tbody>${rows || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">未生成观察任务</td></tr>'}</tbody></table>
    ${s.status !== 'DISPOSED' ? `<div style="margin-top:8px;text-align:right;">
      <span style="color:#8b5cf6;cursor:pointer;font-size:13px;" onclick="closeModal();SampleLedger.openObserveList('${s.id}')">录入观察 →</span></div>` : ''}`;
  },

  _tabDisposal(s) {
    const d = s.disposal;
    if (!d) return '<div style="text-align:center;color:var(--text-muted);padding:24px;">尚未处置</div>';
    const destroy = d.mode === 'DESTROY';
    return `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px 18px;font-size:13px;">
      <div><span style="color:var(--text-muted);">处置方式：</span>${destroy ? '销毁' : '检验消耗'}</div>
      <div><span style="color:var(--text-muted);">处置日期：</span>${esc(d.date)}</div>
      <div><span style="color:var(--text-muted);">执行人：</span>${esc(d.by1)}</div>
      ${destroy ? `
      <div><span style="color:var(--text-muted);">执行人 2：</span>${esc(d.by2 || '—')}</div>
      <div><span style="color:var(--text-muted);">见证人：</span>${esc(d.witness || '—')}</div>
      <div><span style="color:var(--text-muted);">销毁方式：</span>${esc(d.method || '—')}</div>
      <div><span style="color:var(--text-muted);">销毁单号：</span>${esc(d.no || '—')}</div>
      <div style="grid-column:span 2;"><span style="color:var(--text-muted);">SAP 551 凭证：</span>${esc(d.sapDoc || '—')}</div>`
      : `<div style="grid-column:span 2;"><span style="color:var(--text-muted);">说明：</span>${esc(d.remark || '—')}</div>`}
    </div>`;
  },

  // ==================== 导出 ====================
  exportData() {
    const list = this.filtered();
    const head = ['样品编号', '类别', '物料编码', '物料名称', '来源批次', '检验批号',
      '数量', '单位', '存放地点', '有效期', '到期日', '状态', '登记人', '登记时间', 'SAP凭证'];
    const lines = list.map(s => [
      s.sampleNo, this.getCategoryMeta(s).name, s.materialCode, s.materialName, s.sourceBatch,
      s.inspectBatchNo, s.qty, s.unit, this.locName(s.locCode), s.validDate, this.dueOf(s) || '—',
      this.getStatusMeta(s.status).name, s.registerBy, s.registerTime, s.sapDocNo || ''
    ]);
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
  }
};

window.SampleLedger = SampleLedger;

// 查询变式注册（「我的变式」由 FilterActions 渲染，这里提供字段与回填入口）
if (window.QueryVariant) {
  QueryVariant.register({
    pageId: 'sample-ledger',
    fields: ['sdPlant', 'sdCategory', 'sdType', 'sdKeyword', 'sdStatus', 'sdLoc', 'sdDue', 'sdBatch'],
    textFields: ['sdKeyword', 'sdBatch'],
    labels: {
      sdPlant: '工厂', sdCategory: '样品类别', sdType: '检验类别', sdKeyword: '样品编号/物料',
      sdStatus: '状态', sdLoc: '存放地点', sdDue: '剩余天数', sdBatch: '检验批号'
    },
    onApply: function () { SampleLedger.search(); }
  });
}
