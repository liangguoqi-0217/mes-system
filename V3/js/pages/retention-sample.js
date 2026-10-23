// ===== 留样管理页面 =====
// 质量管理 → 质量检验 → 留样管理（与检验批管理并列）
//
// 设计原则（v2）：
//   1. MES 只承载业务过程与最终结果记录，**不做审批**——销毁不再有申请/QA审批，调用不再有审批与电子签名；
//      审批在纸质或 eQMS 完成，MES 记录定稿后的事实。
//   2. 只有一个页面：留样台账。观察与销毁作为行项目按钮入口，不再单独开 Tab；
//      观察待办由「待观察」统计卡 + 状态筛选补齐，销毁历史由「已销毁」状态筛选查看。
//   3. 追溯：点「查看」可看到该留样的全部操作内容（操作流水 / 分类明细 两种视图可切换）。
//
// SAP 边界（只有两个动作过账）：
//   · 留样登记 → 移动类型 311（生产/仓库库位 → 留样室库位）
//   · 销毁登记 → 移动类型 551（报废）
//   入库上架 / 调用 / 归还 / 观察只登记台账，不做库存移动。
const RetentionSample = {
  _version: '2.0-20261023',
  page: 1, pageSize: 10,
  filtered: [],
  moreOpen: false,
  detailView: 'timeline', // timeline | blocks

  // ==================== 字典 ====================

  plantOptions: [
    { code: '1000', name: '山东步长制药工厂' },
    { code: '2001', name: '陕西步长制药工厂' },
    { code: '2002', name: '山东丹红制药工厂' }
  ],

  destroyMethodOptions: [
    { code: 'INCINERATE', name: '焚烧' },
    { code: 'LANDFILL', name: '填埋' },
    { code: 'RETURN', name: '退回供应商' },
    { code: 'RECYCLE', name: '回收处理' }
  ],

  // 留样状态机（6 态，无审批卡点）
  //   待入库 → 在库 →（调用中）→（即将到期 / 已到期）→ 已销毁
  statusFlow: [
    { code: 'REG', name: '待入库', badge: 'badge-yellow', desc: '已登记并过账 SAP 311，待指定留样位置入库' },
    { code: 'STORED', name: '在库', badge: 'badge-green', desc: '已入留样室，按观察频次执行留样观察' },
    { code: 'CALLED', name: '调用中', badge: 'badge-purple', desc: '因投诉/调查/复验被借出，待归还' },
    { code: 'EXPIRING', name: '即将到期', badge: 'badge-yellow', desc: '距留样到期日不足 90 天，需安排销毁' },
    { code: 'EXPIRED', name: '已到期', badge: 'badge-red', desc: '已过留样到期日，须尽快销毁' },
    { code: 'DESTROYED', name: '已销毁', badge: 'badge-gray', desc: '已销毁并过账 SAP 551，台账只读（终态）' }
  ],

  getStatusMeta(code) {
    return this.statusFlow.find(s => s.code === code) || { code: code, name: code, badge: 'badge-gray', desc: '—' };
  },
  getPlantName(code) {
    const p = this.plantOptions.find(x => x.code === code);
    return p ? p.name : code;
  },
  getMethodName(code) {
    const m = this.destroyMethodOptions.find(x => x.code === code);
    return m ? m.name : '—';
  },

  // ==================== 留样规则（物料维度，登记时自动带出） ====================

  ruleData: [
    { id: 'R01', plant: '2001', materialCode: 'MAT-10005', materialName: '布洛芬原料药', needSample: true, sampleQty: '0.500', unit: 'KG', storageCondition: '阴凉干燥处（≤25℃，RH≤60%）', keepRule: '有效期后 1 年', observeFreq: '每 12 个月', observeTimes: 3 },
    { id: 'R02', plant: '2001', materialCode: 'MAT-20002', materialName: '布洛芬缓释胶囊', needSample: true, sampleQty: '2.000', unit: '盒', storageCondition: '密封、室温（10~30℃）', keepRule: '有效期后 1 年', observeFreq: '每 12 个月', observeTimes: 3 },
    { id: 'R03', plant: '2001', materialCode: 'MAT-10009', materialName: '甘露醇辅料', needSample: true, sampleQty: '0.300', unit: 'KG', storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月', observeFreq: '每 12 个月', observeTimes: 2 },
    { id: 'R04', plant: '2002', materialCode: 'MAT-30002', materialName: '丹红注射液', needSample: true, sampleQty: '4.000', unit: '支', storageCondition: '避光、阴凉处（2~8℃）', keepRule: '有效期后 1 年', observeFreq: '每 6 个月', observeTimes: 6 },
    { id: 'R05', plant: '2002', materialCode: 'MAT-30003', materialName: '注射用水', needSample: false, sampleQty: '0.000', unit: 'L', storageCondition: '—', keepRule: '不留样', observeFreq: '—', observeTimes: 0 },
    { id: 'R06', plant: '1000', materialCode: 'MAT-10006', materialName: '维生素C原料', needSample: true, sampleQty: '0.500', unit: 'KG', storageCondition: '避光、密封、干燥处', keepRule: '放行后 3 年', observeFreq: '每 12 个月', observeTimes: 3 }
  ],

  // ==================== 留样台账 ====================

  sampleData: [
    { id: 'S001', sampleNo: 'LS-2001-2606001', plant: '2001', materialCode: 'MAT-10005', materialName: '布洛芬原料药',
      sourceBatch: 'SAP-BT-20260501', inspectBatchNo: '100000012301',
      sampleQty: '0.500', remainQty: '0.500', unit: 'KG',
      storageCondition: '阴凉干燥处（≤25℃，RH≤60%）', keepRule: '有效期后 1 年',
      room: '留样室A', cabinet: 'A-03', shelf: '2 层', location: 'A-03-02-01',
      registerBy: '张工', registerTime: '2026-06-14 10:20', putawayTime: '2026-06-14 10:35',
      validDate: '2028-05-31', dueDate: '2029-05-31',
      observeFreq: '每 12 个月', nextObserveDate: '2027-06-14', status: 'STORED',
      labelNo: 'LBL-20260614-0001', sapDocNo: '4900000123', sapMoveType: '311', sapSyncTime: '2026-06-14 10:20:08' },

    { id: 'S002', sampleNo: 'LS-2001-2606002', plant: '2001', materialCode: 'MAT-20002', materialName: '布洛芬缓释胶囊',
      sourceBatch: 'SAP-BT-20260610', inspectBatchNo: '100000012305',
      sampleQty: '2.000', remainQty: '2.000', unit: '盒',
      storageCondition: '密封、室温（10~30℃）', keepRule: '有效期后 1 年',
      room: '留样室A', cabinet: 'B-01', shelf: '1 层', location: 'B-01-01-02',
      registerBy: '李工', registerTime: '2026-06-20 09:10', putawayTime: '2026-06-20 09:25',
      validDate: '2025-12-31', dueDate: '2026-12-31',
      observeFreq: '每 12 个月', nextObserveDate: '2026-12-20', status: 'EXPIRING',
      labelNo: 'LBL-20260620-0002', sapDocNo: '4900000140', sapMoveType: '311', sapSyncTime: '2026-06-20 09:10:12' },

    { id: 'S003', sampleNo: 'LS-2001-2509003', plant: '2001', materialCode: 'MAT-10009', materialName: '甘露醇辅料',
      sourceBatch: 'SAP-BT-20250918', inspectBatchNo: '100000009812',
      sampleQty: '0.300', remainQty: '0.200', unit: 'KG',
      storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月',
      room: '留样室A', cabinet: 'C-02', shelf: '3 层', location: 'C-02-03-01',
      registerBy: '王工', registerTime: '2025-09-20 14:00', putawayTime: '2025-09-20 14:20',
      validDate: '2026-06-30', dueDate: '2026-12-31',
      observeFreq: '每 12 个月', nextObserveDate: '2026-12-20', status: 'CALLED',
      labelNo: 'LBL-20250920-0003', sapDocNo: '4900000088', sapMoveType: '311', sapSyncTime: '2025-09-20 14:00:05',
      calls: [{ callNo: 'CALL-20261012-01', by: '孙工', dept: '质量部', purpose: '客户投诉复验（投诉单 TS-20261010-03）',
        qty: '0.100', unit: 'KG', time: '2026-10-12 10:30', returnTime: '', returnBy: '', returnCond: '' }] },

    { id: 'S004', sampleNo: 'LS-2002-2603004', plant: '2002', materialCode: 'MAT-30002', materialName: '丹红注射液',
      sourceBatch: 'SAP-BT-20260305', inspectBatchNo: '100000010233',
      sampleQty: '4.000', remainQty: '4.000', unit: '支',
      storageCondition: '避光、阴凉处（2~8℃）', keepRule: '有效期后 1 年',
      room: '留样室B', cabinet: 'A-01', shelf: '1 层', location: 'B-A-01-01',
      registerBy: '赵工', registerTime: '2026-03-08 08:40', putawayTime: '2026-03-08 09:00',
      validDate: '2026-09-30', dueDate: '2027-09-30',
      observeFreq: '每 6 个月', nextObserveDate: '2027-03-08', status: 'STORED',
      labelNo: 'LBL-20260308-0004', sapDocNo: '4900000211', sapMoveType: '311', sapSyncTime: '2026-03-08 08:40:03' },

    { id: 'S005', sampleNo: 'LS-2001-2408005', plant: '2001', materialCode: 'MAT-10002', materialName: '阿莫西林原料药',
      sourceBatch: 'SAP-BT-20240801', inspectBatchNo: '100000007701',
      sampleQty: '0.500', remainQty: '0.000', unit: 'KG',
      storageCondition: '阴凉干燥处（≤25℃）', keepRule: '有效期后 1 年',
      room: '留样室A', cabinet: 'A-01', shelf: '1 层', location: 'A-01-01-03',
      registerBy: '刘工', registerTime: '2024-08-05 11:00', putawayTime: '2024-08-05 11:15',
      validDate: '2025-12-31', dueDate: '2026-06-30',
      observeFreq: '每 12 个月', nextObserveDate: '—', status: 'DESTROYED',
      labelNo: 'LBL-20240805-0005', sapDocNo: '4900000071', sapMoveType: '311', sapSyncTime: '2024-08-05 11:00:02',
      destroyNo: 'DS-20260901-003', destroyDate: '2026-09-05', destroyMethod: 'INCINERATE', destroyQty: '0.500',
      destroyReason: '留样到期', destroyBy1: '刘工', destroyBy2: '孙工', witness: 'QA经理',
      sapDestroyDoc: '5510000451', sapDestroyMoveType: '551' },

    { id: 'S006', sampleNo: 'LS-1000-2607006', plant: '1000', materialCode: 'MAT-10006', materialName: '维生素C原料',
      sourceBatch: 'SAP-BT-20260701', inspectBatchNo: '100000013211',
      sampleQty: '0.500', remainQty: '0.500', unit: 'KG',
      storageCondition: '避光、密封、干燥处', keepRule: '放行后 3 年',
      room: '', cabinet: '', shelf: '', location: '',
      registerBy: '陈工', registerTime: '2026-07-03 15:30', putawayTime: '',
      validDate: '2027-06-30', dueDate: '2029-07-02',
      observeFreq: '每 12 个月', nextObserveDate: '2027-07-03', status: 'REG',
      labelNo: 'LBL-20260703-0006', sapDocNo: '4900000302', sapMoveType: '311', sapSyncTime: '2026-07-03 15:30:11' },

    { id: 'S007', sampleNo: 'LS-2001-2609007', plant: '2001', materialCode: 'MAT-20003', materialName: '稳心颗粒',
      sourceBatch: 'SAP-BT-20260902', inspectBatchNo: '100000013501',
      sampleQty: '3.000', remainQty: '3.000', unit: '袋',
      storageCondition: '密封、阴凉干燥处', keepRule: '有效期后 1 年',
      room: '留样室A', cabinet: 'B-04', shelf: '2 层', location: 'B-04-02-01',
      registerBy: '周工', registerTime: '2026-09-05 10:00', putawayTime: '2026-09-05 10:20',
      validDate: '2027-08-31', dueDate: '2028-08-31',
      observeFreq: '每 12 个月', nextObserveDate: '2027-09-05', status: 'STORED',
      labelNo: 'LBL-20260905-0007', sapDocNo: '4900000311', sapMoveType: '311', sapSyncTime: '2026-09-05 10:00:07' },

    { id: 'S008', sampleNo: 'LS-2002-2506008', plant: '2002', materialCode: 'MAT-30004', materialName: '注射用灯盏花素',
      sourceBatch: 'SAP-BT-20250612', inspectBatchNo: '100000009120',
      sampleQty: '6.000', remainQty: '5.000', unit: '支',
      storageCondition: '避光、密闭（2~8℃）', keepRule: '有效期后 1 年',
      room: '留样室B', cabinet: 'A-02', shelf: '2 层', location: 'B-A-02-02',
      registerBy: '赵工', registerTime: '2025-06-15 09:20', putawayTime: '2025-06-15 09:40',
      validDate: '2026-05-31', dueDate: '2027-05-31',
      observeFreq: '每 6 个月', nextObserveDate: '2026-12-15', status: 'STORED',
      labelNo: 'LBL-20250615-0008', sapDocNo: '4900000155', sapMoveType: '311', sapSyncTime: '2025-06-15 09:20:06',
      calls: [{ callNo: 'CALL-20260720-02', by: '吴工', dept: '注册部', purpose: '注册申报补充资料',
        qty: '1.000', unit: '支', time: '2026-07-20 14:10', returnTime: '2026-08-02 09:00', returnBy: '吴工', returnCond: 'OK' }] },

    { id: 'S009', sampleNo: 'LS-2001-2405010', plant: '2001', materialCode: 'MAT-10010', materialName: '微晶纤维素',
      sourceBatch: 'SAP-BT-20240510', inspectBatchNo: '100000007412',
      sampleQty: '0.300', remainQty: '0.300', unit: 'KG',
      storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月',
      room: '留样室A', cabinet: 'C-01', shelf: '1 层', location: 'C-01-01-02',
      registerBy: '张工', registerTime: '2024-05-12 16:00', putawayTime: '2024-05-12 16:20',
      validDate: '2025-05-31', dueDate: '2025-11-30',
      observeFreq: '每 12 个月', nextObserveDate: '—', status: 'EXPIRED',
      labelNo: 'LBL-20240512-0009', sapDocNo: '4900000062', sapMoveType: '311', sapSyncTime: '2024-05-12 16:00:04' },

    { id: 'S010', sampleNo: 'LS-2002-2607011', plant: '2002', materialCode: 'MAT-30005', materialName: '冠心宁注射液',
      sourceBatch: 'SAP-BT-20260715', inspectBatchNo: '100000013622',
      sampleQty: '4.000', remainQty: '4.000', unit: '支',
      storageCondition: '避光、阴凉处（2~8℃）', keepRule: '有效期后 1 年',
      room: '留样室B', cabinet: 'B-02', shelf: '1 层', location: 'B-B-02-01',
      registerBy: '钱工', registerTime: '2026-07-18 11:20', putawayTime: '2026-07-18 11:40',
      validDate: '2027-07-31', dueDate: '2028-07-31',
      observeFreq: '每 6 个月', nextObserveDate: '2027-01-18', status: 'STORED',
      labelNo: 'LBL-20260718-0010', sapDocNo: '4900000320', sapMoveType: '311', sapSyncTime: '2026-07-18 11:20:09' },

    { id: 'S011', sampleNo: 'LS-1000-2608012', plant: '1000', materialCode: 'MAT-10011', materialName: '硬脂酸镁',
      sourceBatch: 'SAP-BT-20260805', inspectBatchNo: '100000013780',
      sampleQty: '0.200', remainQty: '0.200', unit: 'KG',
      storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月',
      room: '留样室C', cabinet: 'B-01', shelf: '3 层', location: 'C-B-01-03',
      registerBy: '孙工', registerTime: '2026-08-08 09:00', putawayTime: '2026-08-08 09:20',
      validDate: '2026-11-30', dueDate: '2027-05-31',
      observeFreq: '每 12 个月', nextObserveDate: '2027-08-08', status: 'STORED',
      labelNo: 'LBL-20260808-0011', sapDocNo: '4900000333', sapMoveType: '311', sapSyncTime: '2026-08-08 09:00:10' },

    { id: 'S012', sampleNo: 'LS-2001-2512013', plant: '2001', materialCode: 'MAT-10012', materialName: '乳糖',
      sourceBatch: 'SAP-BT-20251201', inspectBatchNo: '100000010010',
      sampleQty: '0.300', remainQty: '0.300', unit: 'KG',
      storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月',
      room: '留样室A', cabinet: 'C-03', shelf: '1 层', location: 'C-03-01-01',
      registerBy: '李工', registerTime: '2025-12-03 13:40', putawayTime: '2025-12-03 14:00',
      validDate: '2026-10-31', dueDate: '2027-04-30',
      observeFreq: '每 12 个月', nextObserveDate: '2026-12-03', status: 'STORED',
      labelNo: 'LBL-20251203-0012', sapDocNo: '4900000166', sapMoveType: '311', sapSyncTime: '2025-12-03 13:40:02' }
  ],

  // ==================== 留样观察任务（按频次自动生成） ====================

  observeData: [
    { id: 'O001', sampleId: 'S002', seq: 1, total: 3, planDate: '2026-06-20', actualDate: '2026-06-22', observer: '李工',
      item: '外观、包装密封性', result: 'OK', remark: '外观完好，铝塑板密封良好，无变色', abnormalNo: '' },
    { id: 'O002', sampleId: 'S004', seq: 1, total: 6, planDate: '2026-09-08', actualDate: '2026-09-10', observer: '赵工',
      item: '外观、澄明度、安瓿完整性', result: 'NG', remark: '发现 2 支安瓿内可见少量白点，其余正常', abnormalNo: 'QA-20260910-006' },
    { id: 'O003', sampleId: 'S001', seq: 1, total: 3, planDate: '2027-06-14', actualDate: '', observer: '',
      item: '外观、包装完整性、色泽', result: '', remark: '', abnormalNo: '' },
    { id: 'O004', sampleId: 'S007', seq: 1, total: 3, planDate: '2027-09-05', actualDate: '', observer: '',
      item: '外观、包装密封性', result: '', remark: '', abnormalNo: '' },
    { id: 'O005', sampleId: 'S008', seq: 4, total: 6, planDate: '2026-12-15', actualDate: '', observer: '',
      item: '外观、澄明度、西林瓶完整性', result: '', remark: '', abnormalNo: '' },
    { id: 'O006', sampleId: 'S011', seq: 1, total: 2, planDate: '2027-08-08', actualDate: '', observer: '',
      item: '外观、包装完整性', result: '', remark: '', abnormalNo: '' },
    { id: 'O007', sampleId: 'S012', seq: 2, total: 2, planDate: '2026-12-03', actualDate: '', observer: '',
      item: '外观、结块情况', result: '', remark: '', abnormalNo: '' },
    { id: 'O008', sampleId: 'S003', seq: 2, total: 2, planDate: '2026-09-20', actualDate: '2026-09-21', observer: '王工',
      item: '外观、结块情况', result: 'OK', remark: '无结块、无变色', abnormalNo: '' },
    { id: 'O009', sampleId: 'S010', seq: 1, total: 6, planDate: '2027-01-18', actualDate: '', observer: '',
      item: '外观、澄明度', result: '', remark: '', abnormalNo: '' },
    { id: 'O010', sampleId: 'S002', seq: 2, total: 3, planDate: '2026-12-20', actualDate: '', observer: '',
      item: '外观、包装密封性', result: '', remark: '', abnormalNo: '' },
    { id: 'O011', sampleId: 'S004', seq: 2, total: 6, planDate: '2027-03-08', actualDate: '', observer: '',
      item: '外观、澄明度、安瓿完整性', result: '', remark: '', abnormalNo: '' },
    { id: 'O012', sampleId: 'S005', seq: 1, total: 3, planDate: '2025-08-05', actualDate: '2025-08-06', observer: '刘工',
      item: '外观、包装完整性、色泽', result: 'OK', remark: '外观正常，无结块', abnormalNo: '' }
  ],

  // ==================== 页面骨架（单页：留样台账） ====================

  render() {
    this.page = 1;
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">留样管理</div>
            <div style="font-size:13px;opacity:0.85;">留样登记 · 位置 · 观察 · 调用归还 · 到期销毁 · 全程追溯</div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
              onclick="RetentionSample.openRuleConfig()">留样规则</button>
            <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
              onclick="RetentionSample.openRegister()">+ 留样登记</button>
          </div>
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

  refresh() { this.init(); toast('数据已刷新'); },

  _val(id) {
    const e = document.getElementById(id);
    return e ? String(e.value || '').trim() : '';
  },

  search() { this.page = 1; this.renderTable(); this.renderPagination(); },

  resetFilter() {
    ['rsPlant', 'rsKeyword', 'rsStatus', 'rsLocation', 'rsBatch'].forEach(id => {
      const e = document.getElementById(id); if (e) e.value = '';
    });
    this.search();
  },

  toggleMore() { this.moreOpen = !this.moreOpen; this.renderFilterBar(); },

  // ==================== 筛选栏 ====================

  renderFilterBar() {
    const el = document.getElementById('rsFilterBar');
    if (!el) return;
    const plantOpts = this.plantOptions.map(p => `<option value="${p.code}">${p.code} ${p.name}</option>`).join('');
    const statOpts = this.statusFlow.map(s => `<option value="${s.code}">${s.name}</option>`).join('');
    const moreStyle = `display:${this.moreOpen ? 'flex' : 'none'};flex-wrap:wrap;gap:12px;width:100%;padding:0;border:none;background:transparent;`;

    el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
      <div class="filter-group"><label>工厂</label><select id="rsPlant"><option value="">全部</option>${plantOpts}</select></div>
      <div class="filter-group"><label>留样编号 / 物料</label><input type="text" id="rsKeyword" placeholder="如 LS-2001 或 布洛芬"></div>
      <div class="filter-group"><label>留样状态</label><select id="rsStatus">
        <option value="">全部</option>${statOpts}<option value="TO_OBSERVE">待观察</option>
      </select></div>
      <div class="filter-actions">
        <button class="btn btn-primary btn-sm" onclick="RetentionSample.search()">查询</button>
        <button class="btn btn-secondary btn-sm" onclick="RetentionSample.exportData()">导出</button>
        <button class="btn btn-secondary btn-sm" onclick="RetentionSample.refresh()">刷新</button>
        <button class="btn btn-secondary btn-sm" onclick="RetentionSample.resetFilter()">重置</button>
        <button class="btn btn-secondary btn-sm" onclick="RetentionSample.toggleMore()">${this.moreOpen ? '收起 ▴' : '更多条件 ▾'}</button>
      </div>
      <div id="rsMoreBar" style="${moreStyle}">
        <div class="filter-group"><label>留样位置</label><input type="text" id="rsLocation" placeholder="如 A-03 或 留样室A"></div>
        <div class="filter-group"><label>来源批次</label><input type="text" id="rsBatch" placeholder="SAP 批次号"></div>
      </div>
    </div>`;
  },

  // ==================== 统计卡 ====================

  _stat() {
    const today = new Date();
    let inStock = 0, expiring = 0, expired = 0, destroyed = 0, toObserve = 0;
    this.sampleData.forEach(s => {
      if (s.status === 'DESTROYED') { destroyed++; return; }
      if (s.status === 'REG') return;                     // 待入库不计入在库
      inStock++;
      const due = new Date(s.dueDate);
      if (!isNaN(due.getTime())) {
        const days = Math.round((due - today) / 86400000);
        if (days < 0) expired++;
        else if (days <= 90) expiring++;
      }
    });
    this.observeData.forEach(o => {
      if (o.actualDate) return;
      const s = this.sampleData.find(x => x.id === o.sampleId);
      if (s && s.status !== 'DESTROYED') toObserve++;
    });
    return { inStock: inStock, toObserve: toObserve, expiring: expiring, expired: expired, destroyed: destroyed };
  },

  // ==================== 台账表格 ====================

  renderTable() {
    const plant = this._val('rsPlant');
    const kw = this._val('rsKeyword').toLowerCase();
    const status = this._val('rsStatus');
    const loc = this._val('rsLocation').toLowerCase();
    const batch = this._val('rsBatch').toLowerCase();

    this.filtered = this.sampleData.filter(s => {
      if (plant && s.plant !== plant) return false;
      if (batch && (s.sourceBatch || '').toLowerCase().indexOf(batch) === -1) return false;
      if (loc && (s.location + ' ' + s.room + ' ' + s.cabinet).toLowerCase().indexOf(loc) === -1) return false;
      if (kw && (s.sampleNo + ' ' + s.materialCode + ' ' + s.materialName).toLowerCase().indexOf(kw) === -1) return false;
      if (status === 'TO_OBSERVE') return this.observeData.some(o => o.sampleId === s.id && !o.actualDate);
      if (status && s.status !== status) return false;
      return true;
    });

    const { page } = this._paged(this.filtered);
    const stat = this._stat();
    const el = document.getElementById('rsTableWrapper');
    if (!el) return;

    const cards = `
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;padding:14px 24px;background:#f8fafc;border-bottom:1px solid var(--border);">
        ${[['在库', stat.inStock, '#16a34a'], ['待观察（次）', stat.toObserve, '#6366f1'],
           ['90 天内到期', stat.expiring, '#f59e0b'], ['已到期', stat.expired, '#dc2626'], ['已销毁', stat.destroyed, '#64748b']]
          .map(c => `<div style="background:#fff;border:1px solid var(--border);border-radius:8px;padding:12px 16px;">
            <div style="font-size:12px;color:var(--text-muted);">${c[0]}</div>
            <div style="font-size:22px;font-weight:700;color:${c[2]};">${c[1]}</div>
          </div>`).join('')}
      </div>`;

    el.innerHTML = cards + `<table class="data-table" style="min-width:1180px;">
      <thead><tr>
        <th style="width:160px;">留样编号</th>
        <th style="width:190px;">物料</th>
        <th style="width:150px;">来源批次</th>
        <th style="width:130px;">留样量 / 余量</th>
        <th style="width:180px;">留样位置</th>
        <th style="width:150px;">留样到期日</th>
        <th style="width:110px;">状态</th>
        <th style="width:250px;">操作</th>
      </tr></thead>
      <tbody>${page.length ? page.map(s => this.renderRow(s)).join('')
        : `<tr><td colspan="8" class="empty-cell">暂无符合条件的留样记录</td></tr>`}</tbody>
    </table>`;
  },

  renderRow(s) {
    const m = this.getStatusMeta(s.status);
    const today = new Date();
    const due = new Date(s.dueDate);
    const days = isNaN(due.getTime()) ? null : Math.round((due - today) / 86400000);
    let dueHtml = `<span style="font-size:12px;">${esc(s.dueDate)}</span>`;
    if (days !== null && days < 0) dueHtml += `<div style="color:#dc2626;font-size:11px;">已超期 ${-days} 天</div>`;
    else if (days !== null && days <= 90) dueHtml += `<div style="color:#f59e0b;font-size:11px;">${days} 天后到期</div>`;

    const locationHtml = s.location
      ? `${esc(s.room)} / ${esc(s.cabinet)} / ${esc(s.shelf)}
         <div style="color:var(--text-muted);font-family:monospace;font-size:11px;">${esc(s.location)}</div>`
      : '<span style="color:var(--text-muted);">未入库</span>';

    return `<tr${s.status === 'DESTROYED' ? ' style="opacity:0.62;"' : ''}>
      <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(s.sampleNo)}</td>
      <td>${esc(s.materialName)}
        <div style="color:var(--text-muted);font-family:monospace;font-size:11px;">${esc(s.materialCode)}</div></td>
      <td style="font-family:monospace;font-size:12px;">${esc(s.sourceBatch || '—')}</td>
      <td style="font-size:12px;">${esc(s.sampleQty)} / <b>${esc(s.remainQty)}</b> ${esc(s.unit)}</td>
      <td style="font-size:12px;">${locationHtml}</td>
      <td>${dueHtml}</td>
      <td><span class="badge ${m.badge}">${esc(m.name)}</span></td>
      <td><div class="table-actions">${this.getRowActions(s)}</div></td>
    </tr>`;
  },

  // 行操作：终态（已销毁）只留「查看」，其余固定 4 个按钮（不适用的置灰）
  getRowActions(s) {
    if (s.status === 'DESTROYED') {
      return `<button class="btn btn-blue btn-sm" onclick="RetentionSample.openDetail('${s.id}')">查看</button>`;
    }
    const off = 'disabled style="opacity:0.45;cursor:not-allowed;"';
    const gray = (label, color) => `<button class="btn btn-sm" style="background:${color};color:#fff;" ${off}>${label}</button>`;

    // 第一个按钮：待入库→入库；调用中→归还；其余→调用
    let first;
    if (s.status === 'REG') {
      first = `<button class="btn btn-primary btn-sm" onclick="RetentionSample.openPutaway('${s.id}')">入库</button>`;
    } else if (s.status === 'CALLED') {
      first = `<button class="btn btn-success btn-sm" onclick="RetentionSample.openReturn('${s.id}')">归还</button>`;
    } else {
      first = `<button class="btn btn-sm" style="background:#6366f1;color:#fff;" onclick="RetentionSample.openCall('${s.id}')">调用</button>`;
    }
    const obsBtn = s.status === 'REG'
      ? gray('观察', '#0ea5e9')
      : `<button class="btn btn-sm" style="background:#0ea5e9;color:#fff;" onclick="RetentionSample.openObserve('${s.id}')">观察</button>`;
    const desBtn = s.status === 'REG'
      ? `<button class="btn btn-danger btn-sm" ${off}>销毁</button>`
      : `<button class="btn btn-danger btn-sm" onclick="RetentionSample.openDestroy('${s.id}')">销毁</button>`;
    return first + obsBtn + desBtn
      + `<button class="btn btn-blue btn-sm" onclick="RetentionSample.openDetail('${s.id}')">查看</button>`;
  },

  _paged(list) {
    const pages = Math.max(1, Math.ceil(list.length / this.pageSize));
    if (this.page > pages) this.page = pages;
    const start = (this.page - 1) * this.pageSize;
    return { page: list.slice(start, start + this.pageSize), start: start };
  },

  // ==================== 留样登记（SAP 311） ====================

  openRegister() {
    const plantOpts = this.plantOptions.map(p => `<option value="${p.code}">${p.code} ${p.name}</option>`).join('');
    const batchOpts = this.sampleData.slice(0, 8).map(s =>
      `<option value="${s.id}">${s.inspectBatchNo || '—'} · ${s.materialName}</option>`).join('');

    showModal('留样登记', `
      <div style="padding:4px 0;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#1e293b;">
          登记后按留样规则带出留样量、保存条件与到期日，并向 SAP 发起 <b>移动类型 311</b> 库存转储（生产/仓库库位 → 留样室库位），过账成功后回写物料凭证号。
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>工厂 <span class="req">*</span></label><select id="rgPlant">${plantOpts}</select></div>
          <div class="form-group"><label>关联检验批 <span class="req">*</span></label><select id="rgBatch">${batchOpts}</select></div>
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
    const due = new Date(new Date(validDate).getTime() + 365 * 86400000);
    const seq = String(this.sampleData.length + 1).padStart(3, '0');

    const rec = {
      id: 'S' + (900 + this.sampleData.length),
      sampleNo: 'LS-' + plant + '-26' + seq,
      plant: plant,
      materialCode: src ? src.materialCode : 'MAT-NEW',
      materialName: src ? src.materialName : '待确认物料',
      sourceBatch: src ? src.sourceBatch : '',
      inspectBatchNo: src ? (src.inspectBatchNo || '') : '',
      sampleQty: qty, remainQty: qty, unit: src ? src.unit : 'KG',
      storageCondition: (document.getElementById('rgCondition') || {}).value || '',
      keepRule: (document.getElementById('rgKeepRule') || {}).value || '',
      room: '', cabinet: '', shelf: '', location: '',
      registerBy: (window.currentUser && window.currentUser.name) || '当前用户',
      registerTime: this._now(), putawayTime: '',
      validDate: validDate, dueDate: due.toISOString().substring(0, 10),
      observeFreq: (document.getElementById('rgFreq') || {}).value || '',
      nextObserveDate: due.toISOString().substring(0, 10), status: 'REG',
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

  // ==================== 入库上架 ====================

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
        s.putawayTime = RetentionSample._now();
        s.status = 'STORED';
        closeModal(); RetentionSample.init();
        toast('入库完成，留样状态更新为「在库」');
      } }
    ], 'modal-md');
  },

  // ==================== 调用 / 归还（只登记结果，无审批） ====================

  openCall(sid) {
    const s = this.sampleData.find(x => x.id === sid);
    if (!s) return;
    showModal('留样调用登记', `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          ${esc(s.sampleNo)} · ${esc(s.materialName)} · 当前余量 <b>${esc(s.remainQty)} ${esc(s.unit)}</b>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>取用人 <span class="req">*</span></label><input type="text" id="clBy" value="孙工"></div>
          <div class="form-group"><label>部门</label><input type="text" id="clDept" value="质量部"></div>
          <div class="form-group"><label>用途 <span class="req">*</span></label><select id="clPurpose">
            <option>客户投诉复验</option><option>偏差/OOS 调查</option><option>稳定性对比</option><option>注册申报</option><option>其他</option>
          </select></div>
          <div class="form-group"><label>取用数量 <span class="req">*</span></label><input type="text" id="clQty" value="0.100"></div>
        </div>
        <div class="form-group" style="margin-top:14px;"><label>说明</label><input type="text" id="clRemark" placeholder="如 投诉单号 / 调查单号"></div>
        <div style="margin-top:12px;font-size:12px;color:var(--text-muted);">调用只登记台账，不做 SAP 库存移动；审批在纸质 / eQMS 完成。</div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '登记调用', cls: 'btn-primary', action: () => {
        const by = (document.getElementById('clBy') || {}).value;
        const qty = Number((document.getElementById('clQty') || {}).value || 0);
        if (!by) return toast('请填写取用人');
        if (qty <= 0) return toast('请填写取用数量');
        if (qty > Number(s.remainQty)) return toast('取用数量不能大于当前余量');
        s.calls = s.calls || [];
        const remark = (document.getElementById('clRemark') || {}).value;
        s.calls.push({
          callNo: 'CALL-20261023-' + String(s.calls.length + 1).padStart(2, '0'),
          by: by,
          dept: (document.getElementById('clDept') || {}).value || '',
          purpose: (document.getElementById('clPurpose') || {}).value + (remark ? '（' + remark + '）' : ''),
          qty: String(qty), unit: s.unit, time: RetentionSample._now(),
          returnTime: '', returnBy: '', returnCond: ''
        });
        s.remainQty = (Number(s.remainQty) - qty).toFixed(3);
        s.status = 'CALLED';
        closeModal(); RetentionSample.init();
        toast('调用已登记，留样状态更新为「调用中」');
      } }
    ], 'modal-md');
  },

  openReturn(sid) {
    const s = this.sampleData.find(x => x.id === sid);
    if (!s) return;
    showModal('留样归还登记', `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          ${esc(s.sampleNo)} · ${esc(s.materialName)} · 当前余量 ${esc(s.remainQty)} ${esc(s.unit)}
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;">
          <div class="form-group"><label>归还人</label><input type="text" id="rtBy" value="孙工"></div>
          <div class="form-group"><label>归还时间</label><input type="text" id="rtTime" value="${esc(RetentionSample._now())}"></div>
        </div>
        <div class="form-group" style="margin-top:14px;"><label>样品状态确认</label><select id="rtCond">
          <option value="OK">完好，可继续留样</option>
          <option value="NG">破损 / 污染，转待销毁</option>
        </select></div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '登记归还', cls: 'btn-primary', action: () => {
        const last = (s.calls || []).filter(c => !c.returnTime).pop();
        const cond = (document.getElementById('rtCond') || {}).value;
        if (last) {
          last.returnTime = (document.getElementById('rtTime') || {}).value || '';
          last.returnBy = (document.getElementById('rtBy') || {}).value || '';
          last.returnCond = cond;
        }
        s.status = cond === 'NG' ? 'EXPIRED' : 'STORED';
        closeModal(); RetentionSample.init();
        toast(cond === 'NG' ? '已归还并标记异常，留样转为「已到期」待销毁' : '归还完成，留样状态回到「在库」');
      } }
    ], 'modal-sm');
  },

  // ==================== 留样观察（计划 + 录入，同一弹窗） ====================

  openObserve(sid) {
    const s = this.sampleData.find(x => x.id === sid);
    if (!s) return;
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
        <div class="form-group"><label>观察人</label><input type="text" id="obBy" value="李工"></div>
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
          ${esc(s.materialName)} · ${esc(s.observeFreq)} · 共 ${tasks.length ? tasks[0].total : 0} 次 · 下次 ${esc(s.nextObserveDate || '—')}
        </div>
        ${rows}
        ${form}
      </div>`, [
      { text: '关闭', cls: 'btn-secondary', action: closeModal },
      pending ? { text: '保存观察', cls: 'btn-primary', action: () => {
        const result = (document.getElementById('obResult') || {}).value;
        pending.actualDate = (document.getElementById('obDate') || {}).value || '';
        pending.observer = (document.getElementById('obBy') || {}).value || '';
        pending.result = result;
        pending.remark = (document.getElementById('obRemark') || {}).value || '';
        if (result === 'NG' && (document.getElementById('obRaise') || {}).checked && !pending.abnormalNo) {
          pending.abnormalNo = 'QA-20261023-011';
        }
        const next = RetentionSample.observeData
          .filter(o => o.sampleId === sid && !o.actualDate).sort((a, b) => a.seq - b.seq)[0];
        s.nextObserveDate = next ? next.planDate : '—';
        closeModal(); RetentionSample.init();
        toast(result === 'NG'
          ? ('观察已记录为异常' + (pending.abnormalNo ? '，已发起质量异常 ' + pending.abnormalNo : ''))
          : '观察记录已保存');
      } } : null
    ].filter(Boolean), 'modal-lg');
  },

  // ==================== 销毁登记（SAP 551，无审批） ====================

  openDestroy(sid) {
    const s = this.sampleData.find(x => x.id === sid);
    if (!s) return;

    // 已销毁：只读展示销毁记录
    if (s.status === 'DESTROYED') {
      showModal('销毁记录 — ' + s.sampleNo, `
        <div style="padding:4px 0;font-size:13px;">
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px 24px;padding:14px 16px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;">
            <div><span style="color:var(--text-muted);">销毁单号：</span>${esc(s.destroyNo || '—')}</div>
            <div><span style="color:var(--text-muted);">销毁日期：</span>${esc(s.destroyDate || '—')}</div>
            <div><span style="color:var(--text-muted);">销毁方式：</span>${esc(RetentionSample.getMethodName(s.destroyMethod))}</div>
            <div><span style="color:var(--text-muted);">销毁数量：</span>${esc(s.destroyQty || '—')} ${esc(s.unit)}</div>
            <div><span style="color:var(--text-muted);">执行人：</span>${esc(s.destroyBy1 || '—')} / ${esc(s.destroyBy2 || '—')}</div>
            <div><span style="color:var(--text-muted);">见证人：</span>${esc(s.witness || '—')}</div>
            <div><span style="color:var(--text-muted);">销毁原因：</span>${esc(s.destroyReason || '—')}</div>
            <div style="grid-column:span 2;"><span style="color:var(--text-muted);">SAP 报废凭证：</span>
              ${esc(s.sapDestroyDoc || '—')}（移动类型 ${esc(s.sapDestroyMoveType || '551')}）</div>
          </div>
        </div>`, [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-md');
      return;
    }

    showModal('销毁登记 — ' + s.sampleNo, `
      <div style="padding:4px 0;">
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          ${esc(s.materialName)} · 剩余 ${esc(s.remainQty)} ${esc(s.unit)} · 留样到期日 ${esc(s.dueDate)}。
          登记后向 SAP 发起 <b>移动类型 551</b> 报废过账，台账转为「已销毁」、余量清零。
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>销毁单号</label><input type="text" id="dyNo" value="DS-20261023-0${this.sampleData.length + 8}"></div>
          <div class="form-group"><label>销毁日期 <span class="req">*</span></label><input type="date" id="dyDate" value="${new Date().toISOString().substring(0, 10)}"></div>
          <div class="form-group"><label>销毁方式</label><select id="dyMethod">
            ${this.destroyMethodOptions.map(m => `<option value="${m.code}">${m.name}</option>`).join('')}
          </select></div>
          <div class="form-group"><label>销毁数量</label><input type="text" id="dyQty" value="${esc(s.remainQty)}"></div>
          <div class="form-group"><label>执行人 1 <span class="req">*</span></label><input type="text" id="dyBy1" value="刘工"></div>
          <div class="form-group"><label>执行人 2 <span class="req">*</span></label><input type="text" id="dyBy2" value="孙工"></div>
          <div class="form-group"><label>见证人</label><input type="text" id="dyWitness" value="QA经理"></div>
          <div class="form-group"><label>销毁原因</label><select id="dyReason">
            <option value="留样到期">留样到期</option>
            <option value="包装破损/污染">包装破损 / 污染</option>
            <option value="观察异常">观察异常</option>
            <option value="考察/调查结束">考察 / 调查结束</option>
          </select></div>
        </div>
        <div style="margin-top:12px;font-size:12px;color:var(--text-muted);">销毁审批在纸质 / eQMS 完成，此处只登记最终结果。</div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认销毁', cls: 'btn-danger', action: () => {
        const by1 = (document.getElementById('dyBy1') || {}).value;
        const by2 = (document.getElementById('dyBy2') || {}).value;
        if (!by1 || !by2) return toast('销毁须登记双执行人');
        s.destroyNo = (document.getElementById('dyNo') || {}).value || '';
        s.destroyDate = (document.getElementById('dyDate') || {}).value || '';
        s.destroyMethod = (document.getElementById('dyMethod') || {}).value || '';
        s.destroyQty = (document.getElementById('dyQty') || {}).value || s.remainQty;
        s.destroyReason = (document.getElementById('dyReason') || {}).value || '';
        s.destroyBy1 = by1;
        s.destroyBy2 = by2;
        s.witness = (document.getElementById('dyWitness') || {}).value || '';
        s.sapDestroyDoc = '5510000' + String(470 + RetentionSample.sampleData.length);
        s.sapDestroyMoveType = '551';
        s.status = 'DESTROYED';
        s.remainQty = '0.000';
        closeModal(); RetentionSample.init();
        toast(`销毁登记完成 · SAP 物料凭证 ${s.sapDestroyDoc}（移动类型 551）`);
      } }
    ], 'modal-md');
  },

  // ==================== 详情：操作流水 / 分类明细 双视图 ====================

  openDetail(sid, view) {
    const s = this.sampleData.find(x => x.id === sid);
    if (!s) return;
    this.detailView = view || this.detailView || 'timeline';

    const tabBtn = (code, label) => `<button class="btn btn-sm ${this.detailView === code ? 'btn-primary' : 'btn-secondary'}"
      onclick="RetentionSample.openDetail('${sid}','${code}')">${label}</button>`;
    const body = this.detailView === 'timeline' ? this._detailTimeline(s) : this._detailBlocks(s);
    const foot = s.status === 'DESTROYED' ? '' : `
      <div style="margin-top:18px;padding-top:14px;border-top:1px solid var(--border);display:flex;gap:10px;">
        ${s.status === 'REG'
          ? `<button class="btn btn-primary btn-sm" onclick="closeModal();RetentionSample.openPutaway('${sid}')">入库上架</button>` : ''}
        ${s.status === 'CALLED'
          ? `<button class="btn btn-success btn-sm" onclick="closeModal();RetentionSample.openReturn('${sid}')">登记归还</button>`
          : (s.status === 'REG' ? '' : `<button class="btn btn-sm" style="background:#6366f1;color:#fff;" onclick="closeModal();RetentionSample.openCall('${sid}')">登记调用</button>`)}
        ${s.status === 'REG' ? '' : `<button class="btn btn-sm" style="background:#0ea5e9;color:#fff;" onclick="closeModal();RetentionSample.openObserve('${sid}')">留样观察</button>`}
        ${s.status === 'REG' ? '' : `<button class="btn btn-danger btn-sm" onclick="closeModal();RetentionSample.openDestroy('${sid}')">销毁登记</button>`}
      </div>`;

    showModal('留样详情 — ' + s.sampleNo, `
      <div style="padding:4px 0;font-size:13px;">
        <div style="display:flex;gap:8px;margin-bottom:12px;">
          ${tabBtn('timeline', '操作流水')}${tabBtn('blocks', '分类明细')}
        </div>
        ${body}
        ${foot}
      </div>`, [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-lg');
  },

  // 视图一：操作流水（倒序时间线）
  _detailTimeline(s) {
    const ev = this._events(s);
    if (!ev.length) return '<div style="color:var(--text-muted);">暂无操作记录</div>';
    const dot = { 登记: '#2563eb', 入库上架: '#0ea5e9', 留样观察: '#6366f1', 留样调用: '#f59e0b', 留样归还: '#16a34a', 留样销毁: '#dc2626' };
    return `<div style="padding:4px 6px;">
      ${ev.map((e, i) => `
        <div style="display:flex;gap:12px;">
          <div style="display:flex;flex-direction:column;align-items:center;width:14px;flex-shrink:0;">
            <div style="width:10px;height:10px;border-radius:50%;background:${dot[e.title] || '#94a3b8'};margin-top:4px;"></div>
            ${i < ev.length - 1 ? '<div style="flex:1;width:2px;background:#e2e8f0;margin:4px 0;"></div>' : ''}
          </div>
          <div style="padding-bottom:16px;flex:1;">
            <div style="display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;">
              <span style="font-weight:600;">${esc(e.title)}</span>
              <span style="color:var(--text-muted);font-size:12px;">${esc(e.time || '—')}</span>
              <span style="color:var(--text-muted);font-size:12px;">· ${esc(e.who || '—')}</span>
            </div>
            <div style="font-size:12.5px;color:var(--text-secondary);margin-top:3px;">${esc(e.desc)}</div>
          </div>
        </div>`).join('')}
    </div>`;
  },

  // 操作事件（用于时间线）
  _events(s) {
    const ev = [];
    ev.push({
      time: s.registerTime, title: '登记', who: s.registerBy,
      desc: `留样 ${s.sampleQty} ${s.unit} · 保存条件 ${s.storageCondition} · 期限规则 ${s.keepRule} · 到期 ${s.dueDate} · SAP 311 凭证 ${s.sapDocNo}`
    });
    if (s.location) {
      ev.push({
        time: s.putawayTime || s.registerTime, title: '入库上架', who: s.registerBy,
        desc: `${s.room} / ${s.cabinet} / ${s.shelf}（${s.location}）· 条码 ${s.labelNo}`
      });
    }
    this.observeData.filter(o => o.sampleId === s.id && o.actualDate).forEach(o => {
      ev.push({
        time: o.actualDate, title: '留样观察', who: o.observer,
        desc: `第 ${o.seq}/${o.total} 次 · ${o.item} · ${o.result === 'OK' ? '正常' : '异常'}`
          + (o.remark ? ' · ' + o.remark : '') + (o.abnormalNo ? ' · 异常单 ' + o.abnormalNo : '')
      });
    });
    (s.calls || []).forEach(c => {
      ev.push({
        time: c.time, title: '留样调用', who: c.by,
        desc: `${c.dept || '—'} · ${c.purpose} · 取用 ${c.qty} ${c.unit}`
      });
      if (c.returnTime) {
        ev.push({
          time: c.returnTime, title: '留样归还', who: c.returnBy,
          desc: `归还 ${c.qty} ${c.unit}` + (c.returnCond === 'NG' ? ' · 样品破损/污染，转待销毁' : ' · 样品完好')
        });
      }
    });
    if (s.status === 'DESTROYED') {
      ev.push({
        time: s.destroyDate, title: '留样销毁', who: (s.destroyBy1 || '—') + ' / ' + (s.destroyBy2 || '—'),
        desc: `${this.getMethodName(s.destroyMethod)} · ${s.destroyQty || '—'} ${s.unit} · 见证 ${s.witness || '—'}`
          + (s.destroyReason ? ' · 原因：' + s.destroyReason : '') + ` · SAP 551 凭证 ${s.sapDestroyDoc || '—'}`
      });
    }
    const key = e => ((e.time || '').length === 10 ? (e.time + ' 00:00') : (e.time || ''));
    return ev.sort((a, b) => key(b).localeCompare(key(a)));
  },

  // 视图二：分类明细（基础信息 + 调用表 + 观察表）
  _detailBlocks(s) {
    const m = this.getStatusMeta(s.status);
    const calls = (s.calls || []).length
      ? `<table class="data-table">
          <thead><tr><th>调用单号</th><th>取用人</th><th>用途</th><th>数量</th><th>取用时间</th><th>归还</th></tr></thead>
          <tbody>${s.calls.map(c => `<tr>
            <td style="font-family:monospace;font-size:12px;">${esc(c.callNo)}</td>
            <td>${esc(c.by)}${c.dept ? '（' + esc(c.dept) + '）' : ''}</td>
            <td style="font-size:12px;">${esc(c.purpose)}</td>
            <td>${esc(c.qty)} ${esc(c.unit)}</td>
            <td style="font-size:12px;">${esc(c.time)}</td>
            <td style="font-size:12px;">${c.returnTime ? esc(c.returnTime) + ' · ' + esc(c.returnBy) : '<span style="color:#dc2626;">未归还</span>'}</td>
          </tr>`).join('')}</tbody></table>`
      : '<div style="color:var(--text-muted);font-size:12px;margin-top:6px;">暂无调用记录</div>';
    const obs = this.observeData.filter(o => o.sampleId === s.id).sort((a, b) => a.seq - b.seq);
    const obsHtml = obs.length
      ? `<table class="data-table">
          <thead><tr><th>观察次序</th><th>计划日期</th><th>实际观察</th><th>观察人</th><th>结果</th><th>观察记录</th></tr></thead>
          <tbody>${obs.map(o => `<tr>
            <td style="font-size:12px;">第 ${o.seq} / ${o.total} 次</td>
            <td style="font-size:12px;">${esc(o.planDate)}</td>
            <td style="font-size:12px;">${esc(o.actualDate || '—')}</td>
            <td style="font-size:12px;">${esc(o.observer || '—')}</td>
            <td>${o.result === 'OK' ? '<span class="badge badge-green">正常</span>' : o.result === 'NG' ? '<span class="badge badge-red">异常</span>' : '<span class="badge badge-gray">待观察</span>'}</td>
            <td style="font-size:12px;">${esc(o.remark || '—')}${o.abnormalNo ? '<div style="color:#dc2626;font-size:11px;">异常单 ' + esc(o.abnormalNo) + '</div>' : ''}</td>
          </tr>`).join('')}</tbody></table>`
      : '<div style="color:var(--text-muted);font-size:12px;margin-top:6px;">暂无观察任务</div>';

    return `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px 24px;padding:14px 16px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;">
        <div><span style="color:var(--text-muted);">状态：</span><span class="badge ${m.badge}">${esc(m.name)}</span></div>
        <div><span style="color:var(--text-muted);">工厂：</span>${esc(s.plant)} ${esc(this.getPlantName(s.plant))}</div>
        <div><span style="color:var(--text-muted);">留样编号：</span>${esc(s.sampleNo)}</div>
        <div><span style="color:var(--text-muted);">物料：</span>${esc(s.materialCode)} ${esc(s.materialName)}</div>
        <div><span style="color:var(--text-muted);">来源批次：</span>${esc(s.sourceBatch || '—')}</div>
        <div><span style="color:var(--text-muted);">关联检验批：</span>${esc(s.inspectBatchNo || '—')}</div>
        <div><span style="color:var(--text-muted);">留样量：</span>${esc(s.sampleQty)} ${esc(s.unit)}（余 ${esc(s.remainQty)}）</div>
        <div><span style="color:var(--text-muted);">保存条件：</span>${esc(s.storageCondition)}</div>
        <div><span style="color:var(--text-muted);">期限规则：</span>${esc(s.keepRule)}</div>
        <div><span style="color:var(--text-muted);">位置：</span>${s.location ? esc(s.room) + ' / ' + esc(s.cabinet) + ' / ' + esc(s.shelf) + '（' + esc(s.location) + '）' : '未入库'}</div>
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
      ${obsHtml}`;
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
          按物料 / 产品设置是否留样、留样量、保存条件、保存期限规则（有效期后若干年或放行后若干年）与观察频次。留样登记时自动带出并计算到期日。
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
    const head = ['留样编号', '工厂', '物料编码', '物料名称', '来源批次', '关联检验批', '留样量', '余量', '单位',
      '留样室', '柜', '层', '位置编码', '登记人', '登记时间', '有效期', '留样到期日', '观察频次', '下次观察', '状态',
      'SAP 登记凭证', '销毁单号', '销毁日期', '销毁方式', 'SAP 报废凭证'];
    const lines = this.filtered.map(s => [
      s.sampleNo, s.plant, s.materialCode, s.materialName, s.sourceBatch, s.inspectBatchNo,
      s.sampleQty, s.remainQty, s.unit, s.room || '—', s.cabinet || '—', s.shelf || '—', s.location || '—',
      s.registerBy, s.registerTime, s.validDate, s.dueDate, s.observeFreq, s.nextObserveDate || '—',
      this.getStatusMeta(s.status).name, s.sapDocNo + '（' + s.sapMoveType + '）',
      s.destroyNo || '—', s.destroyDate || '—', s.destroyNo ? this.getMethodName(s.destroyMethod) : '—',
      s.sapDestroyDoc ? s.sapDestroyDoc + '（' + s.sapDestroyMoveType + '）' : '—'
    ]);
    const csv = '\uFEFF' + [head.join(',')].concat(lines.map(r => r.map(c => {
      const v = String(c == null ? '' : c);
      return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(','))).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = '留样台账_' + new Date().toISOString().substring(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('已导出 ' + lines.length + ' 条');
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
  changePageSize(n) { this.pageSize = Number(n); this.page = 1; this.renderTable(); this.renderPagination(); }
};
