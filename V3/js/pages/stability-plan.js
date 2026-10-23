// ===== 稳定性方案与计划页面 =====
// 质量管理 → 质量检验 → 稳定性方案与计划
//
// 职责：稳定性方案维护、考察批次登记、时间点计划（按起始日期自动生成、到期预警、超期警示）、
//       到点取样出箱并自动生成 89 型检验批。
// 边界：结果录入与使用决策复用「检验批管理」；偏差 / OOS 调查属于 eQMS，本页只落单号关联；
//       稳定性样品不走 SAP 库存（与留样管理的 311/551 不同）。
//
// 三个页签：稳定性方案 / 考察批次 / 时间点计划
const StabilityPlan = {
  _version: '1.0-20261023',
  activeTab: 'protocol', // protocol | batch | schedule
  page: 1, pageSize: 10,
  filtered: [],
  moreOpen: false,

  // ==================== 字典 ====================

  typeOptions: [
    { code: 'CONTINUOUS', name: '持续稳定性' },
    { code: 'PREMARKET', name: '上市前考察' },
    { code: 'POSTCHANGE', name: '变更后考察' }
  ],

  condOptions: [
    { code: 'LT', name: '长期 25℃/60%RH' },
    { code: 'AC', name: '加速 40℃/75%RH' }
  ],

  itemOptions: ['含量测定', '有关物质', '水分', '溶出度', '微生物限度', '外观'],

  protoStatusMeta: {
    ACTIVE: { name: '执行中', badge: 'badge-green' },
    CLOSED: { name: '已关闭', badge: 'badge-gray' }
  },

  batchStatusMeta: {
    ONGOING: { name: '进行中', badge: 'badge-blue' },
    COMPLETED: { name: '已完成', badge: 'badge-green' },
    TERMINATED: { name: '已终止', badge: 'badge-gray' }
  },

  schStatusMeta: {
    WAIT: { name: '待取样', badge: 'badge-blue' },
    OVERDUE: { name: '已超期', badge: 'badge-red' },
    TESTING: { name: '检验中', badge: 'badge-purple' },
    DONE: { name: '已完成', badge: 'badge-green' }
  },

  getTypeName(code) {
    const t = this.typeOptions.find(x => x.code === code);
    return t ? t.name : code;
  },
  getTypeBadge(code) {
    const map = { CONTINUOUS: 'badge-blue', PREMARKET: 'badge-purple', POSTCHANGE: 'badge-yellow' };
    return `<span class="badge ${map[code] || 'badge-gray'} badge-sm">${esc(this.getTypeName(code))}</span>`;
  },
  getCondName(code) {
    const c = this.condOptions.find(x => x.code === code);
    return c ? c.name : code;
  },
  getSchMeta(code) {
    return this.schStatusMeta[code] || { name: code, badge: 'badge-gray' };
  },

  // ==================== 稳定性方案 ====================

  protocolData: [
    { id: 'P001', protoNo: 'ST-P-2025-001', name: '布洛芬缓释胶囊持续稳定性考察方案', type: 'CONTINUOUS', plant: '2001',
      materialCode: 'MAT-20002', materialName: '布洛芬缓释胶囊', conds: ['LT', 'AC'],
      points: [0, 3, 6, 9, 12, 18, 24, 36], items: ['含量测定', '有关物质', '水分', '溶出度', '外观'],
      qtyPerPoint: '6 盒', status: 'ACTIVE', createBy: 'QA经理', createTime: '2025-06-01', remark: '商业化年度持续考察' },
    { id: 'P002', protoNo: 'ST-P-2023-003', name: '维生素C原料上市前稳定性考察方案', type: 'PREMARKET', plant: '1000',
      materialCode: 'MAT-10006', materialName: '维生素C原料', conds: ['LT'],
      points: [0, 3, 6, 9, 12, 18, 24], items: ['含量测定', '有关物质', '水分', '外观'],
      qtyPerPoint: '200 g', status: 'CLOSED', createBy: '研发部 陈工', createTime: '2023-05-20', remark: '支持注册申报确定有效期，注册获批后关闭' },
    { id: 'P003', protoNo: 'ST-P-2026-003', name: '冠心宁注射液变更后稳定性考察方案', type: 'POSTCHANGE', plant: '2002',
      materialCode: 'MAT-30005', materialName: '冠心宁注射液', conds: ['LT'],
      points: [0, 3, 6, 12, 24], items: ['含量测定', '有关物质', 'pH值', '外观', '澄明度'],
      qtyPerPoint: '10 支', status: 'ACTIVE', createBy: 'QA经理', createTime: '2026-07-10', remark: '关联变更单 CHG-2026-021（包材供应商变更）' },
    { id: 'P004', protoNo: 'ST-P-2026-004', name: '丹红注射液持续稳定性考察方案', type: 'CONTINUOUS', plant: '2002',
      materialCode: 'MAT-30002', materialName: '丹红注射液', conds: ['LT', 'AC'],
      points: [0, 6, 12, 24, 36], items: ['含量测定', '有关物质', 'pH值', '外观'],
      qtyPerPoint: '8 支', status: 'ACTIVE', createBy: 'QA经理', createTime: '2026-02-15', remark: '' },
    { id: 'P005', protoNo: 'ST-P-2026-005', name: '稳心颗粒持续稳定性考察方案', type: 'CONTINUOUS', plant: '2001',
      materialCode: 'MAT-20003', materialName: '稳心颗粒', conds: ['LT'],
      points: [0, 3, 6, 9, 12], items: ['含量测定', '有关物质', '水分', '溶出度'],
      qtyPerPoint: '4 袋', status: 'ACTIVE', createBy: '质量部 周工', createTime: '2026-04-28', remark: '' }
  ],

  // ==================== 考察批次 ====================

  batchData: [
    { id: 'B01', studyNo: 'STB-26001', protoId: 'P001', protoNo: 'ST-P-2025-001', plant: '2001',
      materialCode: 'MAT-20002', materialName: '布洛芬缓释胶囊', prodBatch: 'SAP-BT-20250610',
      startDate: '2025-06-20', packSpec: '铝塑泡罩 10 板 × 2 粒 / 盒', qty: '长期 12 盒 · 加速 12 盒',
      chamber: 'STB-X01 / STB-X02', status: 'ONGOING', registerBy: '李工', registerTime: '2025-06-20 15:30' },
    { id: 'B02', studyNo: 'STB-25902', protoId: 'P002', protoNo: 'ST-P-2023-003', plant: '1000',
      materialCode: 'MAT-10006', materialName: '维生素C原料', prodBatch: 'SAP-BT-20230601',
      startDate: '2023-06-15', packSpec: '铝箔袋 500g', qty: '长期 1.4 kg',
      chamber: 'STB-X03', status: 'COMPLETED', registerBy: '陈工', registerTime: '2023-06-15 10:00',
      remark: '注册获批（有效期 24 个月），考察关闭' },
    { id: 'B03', studyNo: 'STB-26003', protoId: 'P003', protoNo: 'ST-P-2026-003', plant: '2002',
      materialCode: 'MAT-30005', materialName: '冠心宁注射液', prodBatch: 'SAP-BT-20260715',
      startDate: '2026-07-18', packSpec: '安瓿 2ml × 10 支 / 盒', qty: '长期 10 支',
      chamber: 'STB-X01', status: 'ONGOING', registerBy: '钱工', registerTime: '2026-07-18 14:30' },
    { id: 'B04', studyNo: 'STB-26004', protoId: 'P004', protoNo: 'ST-P-2026-004', plant: '2002',
      materialCode: 'MAT-30002', materialName: '丹红注射液', prodBatch: 'SAP-BT-20260305',
      startDate: '2026-03-10', packSpec: '安瓿 10ml × 6 支 / 盒', qty: '长期 8 支 · 加速 8 支',
      chamber: 'STB-X01 / STB-X02', status: 'ONGOING', registerBy: '赵工', registerTime: '2026-03-10 09:40' },
    { id: 'B05', studyNo: 'STB-26005', protoId: 'P005', protoNo: 'ST-P-2026-005', plant: '2001',
      materialCode: 'MAT-20003', materialName: '稳心颗粒', prodBatch: 'SAP-BT-20260420',
      startDate: '2026-05-10', packSpec: '复合膜袋 9g × 10 袋 / 盒', qty: '长期 20 袋',
      chamber: 'STB-X01', status: 'ONGOING', registerBy: '周工', registerTime: '2026-05-10 09:20' }
  ],

  // ==================== 时间点计划（批次 × 条件 × 时间点） ====================

  scheduleData: [
    // STB-26001 布洛芬 长期：0-12 月完成，12 月 OOT；18/24/36 待取样
    { id: 'SC01', studyId: 'B01', studyNo: 'STB-26001', cond: 'LT', point: 0,  planDate: '2025-06-20', status: 'DONE',    inspBatch: '100000013101', actualDate: '2025-06-21', verdict: 'PASS', note: '' },
    { id: 'SC02', studyId: 'B01', studyNo: 'STB-26001', cond: 'LT', point: 3,  planDate: '2025-09-20', status: 'DONE',    inspBatch: '100000013102', actualDate: '2025-09-22', verdict: 'PASS', note: '' },
    { id: 'SC03', studyId: 'B01', studyNo: 'STB-26001', cond: 'LT', point: 6,  planDate: '2025-12-20', status: 'DONE',    inspBatch: '100000013103', actualDate: '2025-12-21', verdict: 'PASS', note: '' },
    { id: 'SC04', studyId: 'B01', studyNo: 'STB-26001', cond: 'LT', point: 9,  planDate: '2026-03-20', status: 'DONE',    inspBatch: '100000013104', actualDate: '2026-03-21', verdict: 'PASS', note: '' },
    { id: 'SC05', studyId: 'B01', studyNo: 'STB-26001', cond: 'LT', point: 12, planDate: '2026-06-20', status: 'DONE',    inspBatch: '100000013105', actualDate: '2026-06-22', verdict: 'OOT',  note: '有关物质 0.32%→0.61% 趋势上移，已启动趋势评估 TREND-EVA-2026-006' },
    { id: 'SC06', studyId: 'B01', studyNo: 'STB-26001', cond: 'LT', point: 18, planDate: '2026-12-20', status: 'WAIT',    inspBatch: '', actualDate: '', verdict: '', note: '' },
    { id: 'SC07', studyId: 'B01', studyNo: 'STB-26001', cond: 'LT', point: 24, planDate: '2027-06-20', status: 'WAIT',    inspBatch: '', actualDate: '', verdict: '', note: '' },
    { id: 'SC08', studyId: 'B01', studyNo: 'STB-26001', cond: 'LT', point: 36, planDate: '2028-06-20', status: 'WAIT',    inspBatch: '', actualDate: '', verdict: '', note: '' },
    // STB-26001 布洛芬 加速：0-9 月完成（9 月接近限值，纳入趋势关注）
    { id: 'SC09', studyId: 'B01', studyNo: 'STB-26001', cond: 'AC', point: 0, planDate: '2025-06-20', status: 'DONE',  inspBatch: '100000013111', actualDate: '2025-06-21', verdict: 'PASS', note: '' },
    { id: 'SC10', studyId: 'B01', studyNo: 'STB-26001', cond: 'AC', point: 3, planDate: '2025-09-20', status: 'DONE',  inspBatch: '100000013112', actualDate: '2025-09-22', verdict: 'PASS', note: '' },
    { id: 'SC11', studyId: 'B01', studyNo: 'STB-26001', cond: 'AC', point: 6, planDate: '2025-12-20', status: 'DONE',  inspBatch: '100000013113', actualDate: '2025-12-21', verdict: 'PASS', note: '' },
    { id: 'SC12', studyId: 'B01', studyNo: 'STB-26001', cond: 'AC', point: 9, planDate: '2026-03-20', status: 'DONE',  inspBatch: '100000013114', actualDate: '2026-03-20', verdict: 'PASS', note: '加速 9 月有关物质 0.94%，接近限值 1.0%，纳入趋势关注' },
    // STB-25902 维生素C 上市前：全部完成
    { id: 'SC13', studyId: 'B02', studyNo: 'STB-25902', cond: 'LT', point: 0,  planDate: '2023-06-15', status: 'DONE', inspBatch: '100000008801', actualDate: '2023-06-16', verdict: 'PASS', note: '' },
    { id: 'SC14', studyId: 'B02', studyNo: 'STB-25902', cond: 'LT', point: 3,  planDate: '2023-09-15', status: 'DONE', inspBatch: '100000009105', actualDate: '2023-09-18', verdict: 'PASS', note: '' },
    { id: 'SC15', studyId: 'B02', studyNo: 'STB-25902', cond: 'LT', point: 6,  planDate: '2023-12-15', status: 'DONE', inspBatch: '100000009406', actualDate: '2023-12-16', verdict: 'PASS', note: '' },
    { id: 'SC16', studyId: 'B02', studyNo: 'STB-25902', cond: 'LT', point: 9,  planDate: '2024-03-15', status: 'DONE', inspBatch: '100000009902', actualDate: '2024-03-18', verdict: 'PASS', note: '' },
    { id: 'SC17', studyId: 'B02', studyNo: 'STB-25902', cond: 'LT', point: 12, planDate: '2024-06-15', status: 'DONE', inspBatch: '100000010403', actualDate: '2024-06-17', verdict: 'PASS', note: '' },
    { id: 'SC18', studyId: 'B02', studyNo: 'STB-25902', cond: 'LT', point: 18, planDate: '2024-12-15', status: 'DONE', inspBatch: '100000011208', actualDate: '2024-12-16', verdict: 'PASS', note: '' },
    { id: 'SC19', studyId: 'B02', studyNo: 'STB-25902', cond: 'LT', point: 24, planDate: '2025-06-15', status: 'DONE', inspBatch: '100000011906', actualDate: '2025-06-16', verdict: 'PASS', note: '全时间点合格，报告已用于注册申报' },
    // STB-26003 冠心宁 变更后：0 月完成，3 月点已超期（警示场景）
    { id: 'SC20', studyId: 'B03', studyNo: 'STB-26003', cond: 'LT', point: 0, planDate: '2026-07-18', status: 'DONE',   inspBatch: '100000014001', actualDate: '2026-07-18', verdict: 'PASS', note: '' },
    { id: 'SC21', studyId: 'B03', studyNo: 'STB-26003', cond: 'LT', point: 3, planDate: '2026-10-18', status: 'OVERDUE', inspBatch: '', actualDate: '', verdict: '', note: '已过计划日期，请尽快安排取样' },
    { id: 'SC22', studyId: 'B03', studyNo: 'STB-26003', cond: 'LT', point: 6,  planDate: '2027-01-18', status: 'WAIT',   inspBatch: '', actualDate: '', verdict: '', note: '' },
    { id: 'SC23', studyId: 'B03', studyNo: 'STB-26003', cond: 'LT', point: 12, planDate: '2027-07-18', status: 'WAIT',   inspBatch: '', actualDate: '', verdict: '', note: '' },
    { id: 'SC24', studyId: 'B03', studyNo: 'STB-26003', cond: 'LT', point: 24, planDate: '2028-07-18', status: 'WAIT',   inspBatch: '', actualDate: '', verdict: '', note: '' },
    // STB-26004 丹红：0 月完成，6 月点检验中（长期 OOS 场景）
    { id: 'SC25', studyId: 'B04', studyNo: 'STB-26004', cond: 'LT', point: 0,  planDate: '2026-03-10', status: 'DONE',    inspBatch: '100000014101', actualDate: '2026-03-11', verdict: 'PASS', note: '' },
    { id: 'SC26', studyId: 'B04', studyNo: 'STB-26004', cond: 'LT', point: 6,  planDate: '2026-09-10', status: 'TESTING', inspBatch: '100000014208', actualDate: '2026-09-12', verdict: 'OOS',  note: '有关物质 1.12% 超限（≤1.0%），关联偏差 DEV-20260915-002' },
    { id: 'SC27', studyId: 'B04', studyNo: 'STB-26004', cond: 'LT', point: 12, planDate: '2027-03-10', status: 'WAIT',    inspBatch: '', actualDate: '', verdict: '', note: '' },
    { id: 'SC28', studyId: 'B04', studyNo: 'STB-26004', cond: 'LT', point: 24, planDate: '2028-03-10', status: 'WAIT',    inspBatch: '', actualDate: '', verdict: '', note: '' },
    { id: 'SC29', studyId: 'B04', studyNo: 'STB-26004', cond: 'LT', point: 36, planDate: '2029-03-10', status: 'WAIT',    inspBatch: '', actualDate: '', verdict: '', note: '' },
    { id: 'SC30', studyId: 'B04', studyNo: 'STB-26004', cond: 'AC', point: 0,  planDate: '2026-03-10', status: 'DONE',    inspBatch: '100000014102', actualDate: '2026-03-11', verdict: 'PASS', note: '' },
    { id: 'SC31', studyId: 'B04', studyNo: 'STB-26004', cond: 'AC', point: 6,  planDate: '2026-09-10', status: 'TESTING', inspBatch: '100000014209', actualDate: '2026-09-12', verdict: '',     note: '' },
    { id: 'SC32', studyId: 'B04', studyNo: 'STB-26004', cond: 'AC', point: 12, planDate: '2027-03-10', status: 'WAIT',    inspBatch: '', actualDate: '', verdict: '', note: '' },
    { id: 'SC33', studyId: 'B04', studyNo: 'STB-26004', cond: 'AC', point: 24, planDate: '2028-03-10', status: 'WAIT',    inspBatch: '', actualDate: '', verdict: '', note: '' },
    // STB-26005 稳心颗粒：0/3 月完成，6 月点 30 天内到期（预警场景）
    { id: 'SC34', studyId: 'B05', studyNo: 'STB-26005', cond: 'LT', point: 0, planDate: '2026-05-10', status: 'DONE', inspBatch: '100000014301', actualDate: '2026-05-11', verdict: 'PASS', note: '' },
    { id: 'SC35', studyId: 'B05', studyNo: 'STB-26005', cond: 'LT', point: 3, planDate: '2026-08-10', status: 'DONE', inspBatch: '100000014305', actualDate: '2026-08-11', verdict: 'PASS', note: '' },
    { id: 'SC36', studyId: 'B05', studyNo: 'STB-26005', cond: 'LT', point: 6, planDate: '2026-11-10', status: 'WAIT', inspBatch: '', actualDate: '', verdict: '', note: '' },
    { id: 'SC37', studyId: 'B05', studyNo: 'STB-26005', cond: 'LT', point: 9, planDate: '2027-02-10', status: 'WAIT', inspBatch: '', actualDate: '', verdict: '', note: '' },
    { id: 'SC38', studyId: 'B05', studyNo: 'STB-26005', cond: 'LT', point: 12, planDate: '2027-05-10', status: 'WAIT', inspBatch: '', actualDate: '', verdict: '', note: '' }
  ],

  // ==================== 页面骨架 ====================

  render() {
    this.page = 1;
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">稳定性方案与计划</div>
            <div style="font-size:13px;opacity:0.85;">方案 · 批次登记 · 时间点计划与取样 · 到期自动生成 89 型检验批</div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
              onclick="StabilityPlan.activeTab==='protocol' ? StabilityPlan.openProtoCreate() : (StabilityPlan.activeTab==='batch' ? StabilityPlan.openBatchRegister() : toast('请到「考察批次」页签登记批次'))"
              >${this.activeTab === 'batch' ? '+ 批次登记' : '+ 新建方案'}</button>
          </div>
        </div>

        <div class="tabs" style="margin:0;padding:0 24px;background:white;border-bottom:1px solid var(--border);flex-shrink:0;">
          <div class="tab ${this.activeTab === 'protocol' ? 'active' : ''}" onclick="StabilityPlan.switchTab('protocol')">稳定性方案</div>
          <div class="tab ${this.activeTab === 'batch' ? 'active' : ''}" onclick="StabilityPlan.switchTab('batch')">考察批次</div>
          <div class="tab ${this.activeTab === 'schedule' ? 'active' : ''}" onclick="StabilityPlan.switchTab('schedule')">时间点计划</div>
        </div>

        <div id="spFilterBar" style="flex-shrink:0;"></div>
        <div class="table-wrapper" id="spTableWrapper" style="flex:1;overflow:auto;width:100%;min-width:0;"></div>
        <div id="spPagination" style="flex-shrink:0;"></div>
      </div>`;
  },

  init() {
    if (window.QueryVariant) {
      QueryVariant.mount('stability-plan');
      QueryVariant.restore('stability-plan');
      QueryVariant.bindRecent('stability-plan');
    }
    this.renderFilterBar();
    this.renderTable();
    this.renderPagination();
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.page = 1;
    this.moreOpen = false;
    const ca = document.getElementById('contentArea');
    if (ca) { ca.innerHTML = this.render(); this.init(); }
  },

  refresh() { this.init(); toast('数据已刷新'); },

  _val(id) {
    const e = document.getElementById(id);
    return e ? String(e.value || '').trim() : '';
  },

  search() { this.page = 1; this.renderTable(); this.renderPagination(); },

  resetFilter() {
    ['spType', 'spKeyword', 'spStatus', 'spProto', 'spCond'].forEach(id => {
      const e = document.getElementById(id); if (e) e.value = '';
    });
    this.search();
  },

  toggleMore() { this.moreOpen = !this.moreOpen; this.renderFilterBar(); },

  // ==================== 筛选栏 ====================

  renderFilterBar() {
    const el = document.getElementById('spFilterBar');
    if (!el) return;
    const btn = `
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="StabilityPlan.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="StabilityPlan.exportData()">导出</button>
          <button class="btn btn-secondary btn-sm" onclick="StabilityPlan.refresh()">刷新</button>
          <button class="btn btn-secondary btn-sm" onclick="StabilityPlan.resetFilter()">重置</button>
        </div>`;

    if (this.activeTab === 'protocol') {
      const typeOpts = this.typeOptions.map(t => `<option value="${t.code}">${t.name}</option>`).join('');
      el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
        <div class="filter-group"><label>方案类型</label><select id="spType"><option value="">全部</option>${typeOpts}</select></div>
        <div class="filter-group"><label>方案编号 / 名称 / 产品</label><input type="text" id="spKeyword" placeholder="如 ST-P-2026 或 布洛芬"></div>
        <div class="filter-group"><label>状态</label><select id="spStatus">
          <option value="">全部</option><option value="ACTIVE">执行中</option><option value="CLOSED">已关闭</option>
        </select></div>
        ${btn}
      </div>`;
      return;
    }

    if (this.activeTab === 'batch') {
      const protoOpts = this.protocolData.filter(p => p.status === 'ACTIVE')
        .map(p => `<option value="${p.id}">${p.protoNo} ${p.name}</option>`).join('');
      el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
        <div class="filter-group"><label>方案</label><select id="spProto"><option value="">全部</option>${protoOpts}</select></div>
        <div class="filter-group"><label>考察编号 / 生产批次 / 物料</label><input type="text" id="spKeyword" placeholder="如 STB-26 或 SAP-BT"></div>
        <div class="filter-group"><label>状态</label><select id="spStatus">
          <option value="">全部</option><option value="ONGOING">进行中</option><option value="COMPLETED">已完成</option><option value="TERMINATED">已终止</option>
        </select></div>
        ${btn}
      </div>`;
      return;
    }

    const condOpts = this.condOptions.map(c => `<option value="${c.code}">${c.name}</option>`).join('');
    el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
      <div class="filter-group"><label>考察条件</label><select id="spCond"><option value="">全部</option>${condOpts}</select></div>
      <div class="filter-group"><label>考察编号 / 物料 / 检验批</label><input type="text" id="spKeyword" placeholder="如 STB-26001 或 100000014208"></div>
      <div class="filter-group"><label>状态</label><select id="spStatus">
        <option value="">全部</option><option value="WAIT">待取样</option><option value="TESTING">检验中</option>
        <option value="DONE">已完成</option><option value="OVERDUE">已超期</option>
      </select></div>
      ${btn}
    </div>`;
  },

  // ==================== 表格分发 ====================

  renderTable() {
    if (this.activeTab === 'protocol') this.renderProtoTable();
    else if (this.activeTab === 'batch') this.renderBatchTable();
    else this.renderScheduleTable();
  },

  _paged(list) {
    const pages = Math.max(1, Math.ceil(list.length / this.pageSize));
    if (this.page > pages) this.page = pages;
    const start = (this.page - 1) * this.pageSize;
    return { page: list.slice(start, start + this.pageSize), start: start };
  },

  // ---------- 页签一：稳定性方案 ----------

  renderProtoTable() {
    const type = this._val('spType');
    const status = this._val('spStatus');
    const kw = this._val('spKeyword').toLowerCase();

    this.filtered = this.protocolData.filter(p => {
      if (type && p.type !== type) return false;
      if (status && p.status !== status) return false;
      if (kw && (p.protoNo + ' ' + p.name + ' ' + p.materialCode + ' ' + p.materialName).toLowerCase().indexOf(kw) === -1) return false;
      return true;
    });

    const { page } = this._paged(this.filtered);
    const el = document.getElementById('spTableWrapper');
    if (!el) return;

    el.innerHTML = `<table class="data-table" style="min-width:1780px;">
      <thead><tr>
        <th style="width:150px;">方案编号</th>
        <th style="width:260px;">方案名称</th>
        <th style="width:110px;">类型</th>
        <th style="width:110px;">工厂</th>
        <th style="width:180px;">产品</th>
        <th style="width:170px;">考察条件</th>
        <th style="width:190px;">时间点（月）</th>
        <th style="width:220px;">检验项目</th>
        <th style="width:110px;">每点样品量</th>
        <th style="width:100px;">状态</th>
        <th style="width:110px;">操作</th>
      </tr></thead>
      <tbody>${page.length ? page.map(p => `<tr>
        <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(p.protoNo)}</td>
        <td>${esc(p.name)}</td>
        <td>${this.getTypeBadge(p.type)}</td>
        <td>${esc(p.plant)}</td>
        <td style="font-size:12px;">${esc(p.materialCode)}<div>${esc(p.materialName)}</div></td>
        <td style="font-size:12px;">${p.conds.map(c => esc(this.getCondName(c))).join('<br>')}</td>
        <td style="font-family:monospace;font-size:12px;">${p.points.join(' / ')}</td>
        <td style="font-size:12px;">${p.items.join('、')}</td>
        <td style="font-size:12px;">${esc(p.qtyPerPoint)}</td>
        <td><span class="badge ${this.protoStatusMeta[p.status].badge}">${esc(this.protoStatusMeta[p.status].name)}</span></td>
        <td><div class="table-actions">
          <button class="btn btn-blue btn-sm" onclick="StabilityPlan.openProtoDetail('${p.id}')">查看</button>
        </div></td>
      </tr>`).join('') : `<tr><td colspan="11" class="empty-cell">暂无符合条件的方案</td></tr>`}</tbody>
    </table>`;
  },

  openProtoDetail(pid) {
    const p = this.protocolData.find(x => x.id === pid);
    if (!p) return;
    showModal('稳定性方案 — ' + p.protoNo, `
      <div style="padding:4px 0;font-size:13px;">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px 24px;padding:14px 16px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;">
          <div><span style="color:var(--text-muted);">方案名称：</span>${esc(p.name)}</div>
          <div><span style="color:var(--text-muted);">类型：</span>${this.getTypeBadge(p.type)}</div>
          <div><span style="color:var(--text-muted);">状态：</span><span class="badge ${this.protoStatusMeta[p.status].badge}">${esc(this.protoStatusMeta[p.status].name)}</span></div>
          <div><span style="color:var(--text-muted);">工厂：</span>${esc(p.plant)}</div>
          <div><span style="color:var(--text-muted);">产品：</span>${esc(p.materialCode)} ${esc(p.materialName)}</div>
          <div><span style="color:var(--text-muted);">每点样品量：</span>${esc(p.qtyPerPoint)}</div>
          <div><span style="color:var(--text-muted);">考察条件：</span>${p.conds.map(c => esc(this.getCondName(c))).join('、')}</div>
          <div><span style="color:var(--text-muted);">时间点：</span>${p.points.join(' / ')} 月</div>
          <div><span style="color:var(--text-muted);">创建：</span>${esc(p.createBy)} ${esc(p.createTime)}</div>
          <div style="grid-column:span 3;"><span style="color:var(--text-muted);">检验项目：</span>${p.items.join('、')}</div>
          ${p.remark ? `<div style="grid-column:span 3;"><span style="color:var(--text-muted);">备注：</span>${esc(p.remark)}</div>` : ''}
        </div>
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:10px 16px;margin-top:14px;font-size:12px;color:#1e293b;">
          批次登记后，系统按「起始日期 + 时间点」自动生成各条件下的取样计划；到点取样出箱即生成 89 型检验批，结果在「检验批管理」录入。
        </div>
      </div>`, [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-md');
  },

  openProtoCreate() {
    const typeOpts = this.typeOptions.map(t => `<option value="${t.code}">${t.name}</option>`).join('');
    showModal('新建稳定性方案', `
      <div style="padding:4px 0;">
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>方案名称 <span class="req">*</span></label><input type="text" id="npName" placeholder="如 ××持续稳定性考察方案"></div>
          <div class="form-group"><label>方案类型</label><select id="npType">${typeOpts}</select></div>
          <div class="form-group"><label>工厂</label><select id="npPlant">
            <option value="1000">1000 山东步长制药工厂</option><option value="2001">2001 陕西步长制药工厂</option><option value="2002">2002 山东丹红制药工厂</option>
          </select></div>
          <div class="form-group"><label>产品编码</label><input type="text" id="npMatCode" placeholder="MAT-"></div>
          <div class="form-group"><label>产品名称</label><input type="text" id="npMatName"></div>
          <div class="form-group"><label>每点样品量</label><input type="text" id="npQty" placeholder="如 6 盒"></div>
          <div class="form-group"><label>时间点（月，逗号分隔）<span class="req">*</span></label><input type="text" id="npPoints" value="0,3,6,9,12,18,24,36"></div>
          <div class="form-group"><label>考察条件</label><span style="display:flex;gap:16px;align-items:center;height:34px;">
            <label style="display:flex;gap:6px;align-items:center;font-weight:400;"><input type="checkbox" id="npCondLT" checked> 长期 25℃/60%RH</label>
            <label style="display:flex;gap:6px;align-items:center;font-weight:400;"><input type="checkbox" id="npCondAC" checked> 加速 40℃/75%RH</label>
          </span></div>
        </div>
        <div class="form-group" style="margin-top:14px;"><label>检验项目</label><span style="display:flex;flex-wrap:wrap;gap:12px;">
          ${this.itemOptions.map((it, i) => `<label style="display:flex;gap:5px;align-items:center;font-weight:400;font-size:12px;">
            <input type="checkbox" class="npItem" value="${esc(it)}" ${i < 4 ? 'checked' : ''}> ${esc(it)}</label>`).join('')}
        </span></div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '保存方案', cls: 'btn-primary', action: () => {
        const name = (document.getElementById('npName') || {}).value || '';
        if (!name) return toast('请填写方案名称');
        const pts = ((document.getElementById('npPoints') || {}).value || '')
          .split(/[,，]/).map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 0);
        if (!pts.length) return toast('请填写有效时间点');
        const conds = [];
        if ((document.getElementById('npCondLT') || {}).checked) conds.push('LT');
        if ((document.getElementById('npCondAC') || {}).checked) conds.push('AC');
        if (!conds.length) return toast('请至少选择一个考察条件');
        const items = Array.prototype.slice.call(document.querySelectorAll('.npItem:checked')).map(c => c.value);
        const seq = String(this.protocolData.length + 1).padStart(3, '0');
        this.protocolData.unshift({
          id: 'P' + (900 + this.protocolData.length),
          protoNo: 'ST-P-2026-' + seq, name: name,
          type: (document.getElementById('npType') || {}).value || 'CONTINUOUS',
          plant: (document.getElementById('npPlant') || {}).value || '2001',
          materialCode: (document.getElementById('npMatCode') || {}).value || 'MAT-NEW',
          materialName: (document.getElementById('npMatName') || {}).value || '待确认产品',
          conds: conds, points: pts, items: items.length ? items : ['含量测定', '有关物质'],
          qtyPerPoint: (document.getElementById('npQty') || {}).value || '—',
          status: 'ACTIVE', createBy: (window.currentUser && window.currentUser.name) || '当前用户',
          createTime: this._now(), remark: ''
        });
        closeModal(); StabilityPlan.init();
        toast('方案已创建，可在「考察批次」登记批次并自动生成时间点计划');
      } }
    ], 'modal-md');
  },

  // ---------- 页签二：考察批次 ----------

  renderBatchTable() {
    const protoId = this._val('spProto');
    const status = this._val('spStatus');
    const kw = this._val('spKeyword').toLowerCase();

    this.filtered = this.batchData.filter(b => {
      if (protoId && b.protoId !== protoId) return false;
      if (status && b.status !== status) return false;
      if (kw && (b.studyNo + ' ' + b.prodBatch + ' ' + b.materialCode + ' ' + b.materialName).toLowerCase().indexOf(kw) === -1) return false;
      return true;
    });

    const { page } = this._paged(this.filtered);
    const el = document.getElementById('spTableWrapper');
    if (!el) return;

    el.innerHTML = `<table class="data-table" style="min-width:1720px;">
      <thead><tr>
        <th style="width:140px;">考察编号</th>
        <th style="width:150px;">所属方案</th>
        <th style="width:170px;">物料</th>
        <th style="width:150px;">生产批次</th>
        <th style="width:110px;">起始日期</th>
        <th style="width:190px;">包装规格</th>
        <th style="width:180px;">入箱数量</th>
        <th style="width:150px;">稳定性箱</th>
        <th style="width:100px;">状态</th>
        <th style="width:110px;">操作</th>
      </tr></thead>
      <tbody>${page.length ? page.map(b => `<tr${b.status === 'COMPLETED' ? ' style="opacity:0.62;"' : ''}>
        <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(b.studyNo)}</td>
        <td style="font-family:monospace;font-size:11px;">${esc(b.protoNo)}</td>
        <td style="font-size:12px;">${esc(b.materialName)}<div style="color:var(--text-muted);font-family:monospace;font-size:11px;">${esc(b.materialCode)}</div></td>
        <td style="font-family:monospace;font-size:12px;">${esc(b.prodBatch)}</td>
        <td style="font-size:12px;">${esc(b.startDate)}</td>
        <td style="font-size:12px;">${esc(b.packSpec)}</td>
        <td style="font-size:12px;">${esc(b.qty)}</td>
        <td style="font-size:12px;">${esc(b.chamber)}</td>
        <td><span class="badge ${this.batchStatusMeta[b.status].badge}">${esc(this.batchStatusMeta[b.status].name)}</span></td>
        <td><div class="table-actions">
          <button class="btn btn-blue btn-sm" onclick="StabilityPlan.openBatchDetail('${b.id}')">查看</button>
        </div></td>
      </tr>`).join('') : `<tr><td colspan="10" class="empty-cell">暂无符合条件的考察批次</td></tr>`}</tbody>
    </table>`;
  },

  openBatchDetail(bid) {
    const b = this.batchData.find(x => x.id === bid);
    if (!b) return;
    const rows = this.scheduleData.filter(s => s.studyId === b.id);
    const done = rows.filter(r => r.status === 'DONE').length;
    const planHtml = rows.length ? `<table class="data-table" style="margin-top:8px;">
      <thead><tr><th>条件</th><th>时间点</th><th>计划日期</th><th>状态</th><th>检验批</th><th>判定</th></tr></thead>
      <tbody>${rows.map(r => {
        const m = this.getSchMeta(r.status);
        return `<tr><td style="font-size:12px;">${esc(this.getCondName(r.cond))}</td>
          <td style="font-size:12px;">${r.point} 月</td><td style="font-size:12px;">${esc(r.planDate)}</td>
          <td><span class="badge ${m.badge}">${esc(m.name)}</span></td>
          <td style="font-family:monospace;font-size:11px;">${esc(r.inspBatch || '—')}</td>
          <td>${r.verdict ? `<span class="badge ${r.verdict === 'PASS' ? 'badge-green' : r.verdict === 'OOT' ? 'badge-yellow' : 'badge-red'}">${esc(r.verdict)}</span>` : '—'}</td>
        </tr>`;
      }).join('')}</tbody></table>` : '<div style="color:var(--text-muted);font-size:12px;margin-top:6px;">暂无时间点计划</div>';

    showModal('考察批次 — ' + b.studyNo, `
      <div style="padding:4px 0;font-size:13px;">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px 24px;padding:14px 16px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;">
          <div><span style="color:var(--text-muted);">所属方案：</span>${esc(b.protoNo)}</div>
          <div><span style="color:var(--text-muted);">工厂：</span>${esc(b.plant)}</div>
          <div><span style="color:var(--text-muted);">状态：</span><span class="badge ${this.batchStatusMeta[b.status].badge}">${esc(this.batchStatusMeta[b.status].name)}</span></div>
          <div><span style="color:var(--text-muted);">物料：</span>${esc(b.materialCode)} ${esc(b.materialName)}</div>
          <div><span style="color:var(--text-muted);">生产批次：</span>${esc(b.prodBatch)}</div>
          <div><span style="color:var(--text-muted);">起始日期：</span>${esc(b.startDate)}</div>
          <div><span style="color:var(--text-muted);">包装规格：</span>${esc(b.packSpec)}</div>
          <div><span style="color:var(--text-muted);">入箱数量：</span>${esc(b.qty)}</div>
          <div><span style="color:var(--text-muted);">稳定性箱：</span>${esc(b.chamber)}</div>
          <div><span style="color:var(--text-muted);">登记：</span>${esc(b.registerBy)} ${esc(b.registerTime)}</div>
          <div><span style="color:var(--text-muted);">进度：</span>${done} / ${rows.length} 个时间点完成</div>
          ${b.remark ? `<div style="grid-column:span 3;"><span style="color:var(--text-muted);">备注：</span>${esc(b.remark)}</div>` : ''}
        </div>
        <div style="margin-top:18px;font-weight:700;">时间点计划</div>
        ${planHtml}
      </div>`, [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-lg');
  },

  openBatchRegister() {
    const protoOpts = this.protocolData.filter(p => p.status === 'ACTIVE')
      .map(p => `<option value="${p.id}">${p.protoNo} · ${esc(p.name)}（${p.points.join('/')}月）</option>`).join('');
    if (!protoOpts) { toast('没有执行中的方案，请先新建方案'); return; }
    showModal('考察批次登记', `
      <div style="padding:4px 0;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#1e293b;">
          登记后系统按方案自动生成「条件 × 时间点」取样计划；到点取样出箱时生成 89 型检验批。
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group" style="grid-column:span 2;"><label>所属方案 <span class="req">*</span></label><select id="rbProto">${protoOpts}</select></div>
          <div class="form-group"><label>生产批次 <span class="req">*</span></label><input type="text" id="rbBatch" placeholder="SAP-BT-"></div>
          <div class="form-group"><label>起始日期 <span class="req">*</span></label><input type="date" id="rbStart" value="2026-10-23"></div>
          <div class="form-group"><label>包装规格</label><input type="text" id="rbPack" placeholder="如 铝塑泡罩 10 板 / 盒"></div>
          <div class="form-group"><label>入箱数量</label><input type="text" id="rbQty" placeholder="如 长期 12 盒 · 加速 12 盒"></div>
        </div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认登记', cls: 'btn-primary', action: () => {
        const protoId = (document.getElementById('rbProto') || {}).value;
        const p = this.protocolData.find(x => x.id === protoId);
        if (!p) return toast('请选择方案');
        const prodBatch = (document.getElementById('rbBatch') || {}).value || '';
        const start = (document.getElementById('rbStart') || {}).value || '';
        if (!prodBatch || !start) return toast('请填写生产批次与起始日期');
        const bid = 'B' + (900 + this.batchData.length);
        this.batchData.unshift({
          id: bid, studyNo: 'STB-26' + String(this.batchData.length + 10).padStart(3, '0'),
          protoId: p.id, protoNo: p.protoNo, plant: p.plant,
          materialCode: p.materialCode, materialName: p.materialName,
          prodBatch: prodBatch, startDate: start,
          packSpec: (document.getElementById('rbPack') || {}).value || '—',
          qty: (document.getElementById('rbQty') || {}).value || '—',
          chamber: 'STB-X01', status: 'ONGOING',
          registerBy: (window.currentUser && window.currentUser.name) || '当前用户',
          registerTime: this._now(), remark: ''
        });
        const n = this._genSchedule(bid, p, start);
        closeModal(); StabilityPlan.init();
        toast(`批次登记完成，已按方案自动生成 ${n} 条时间点计划`);
      } }
    ], 'modal-md');
  },

  // 按方案生成时间点计划：条件 × 时间点（按时间点正序插入）
  _genSchedule(bid, proto, start) {
    const b = this.batchData.find(x => x.id === bid);
    const add = [];
    proto.conds.forEach(cond => {
      proto.points.forEach(pt => {
        add.push({
          id: 'SC' + (900 + this.scheduleData.length + add.length),
          studyId: bid, studyNo: b.studyNo, cond: cond, point: pt,
          planDate: this._addMonths(start, pt), status: 'WAIT',
          inspBatch: '', actualDate: '', verdict: '', note: ''
        });
      });
    });
    // 各条件内部按 时间点 → 生成顺序排列后整体插到最前
    add.sort((x, y) => x.point - y.point);
    Array.prototype.splice.apply(this.scheduleData, [0, 0].concat(add));
    return add.length;
  },

  // ---------- 页签三：时间点计划 ----------

  _schStat() {
    const today = new Date();
    let wait = 0, due30 = 0, overdue = 0, testing = 0, done = 0;
    this.scheduleData.forEach(r => {
      if (r.status === 'DONE') done++;
      else if (r.status === 'TESTING') testing++;
      else if (r.status === 'OVERDUE') overdue++;
      else {
        wait++;
        const days = Math.round((new Date(r.planDate) - today) / 86400000);
        if (days >= 0 && days <= 30) due30++;
      }
    });
    return { wait: wait, due30: due30, overdue: overdue, testing: testing, done: done };
  },

  renderScheduleTable() {
    const cond = this._val('spCond');
    const status = this._val('spStatus');
    const kw = this._val('spKeyword').toLowerCase();

    this.filtered = this.scheduleData.filter(r => {
      if (cond && r.cond !== cond) return false;
      if (status && r.status !== status) return false;
      if (kw && (r.studyNo + ' ' + r.inspBatch).toLowerCase().indexOf(kw) === -1) {
        const b = this.batchData.find(x => x.id === r.studyId);
        if (!b || (b.materialName + b.prodBatch).toLowerCase().indexOf(kw) === -1) return false;
      }
      return true;
    });

    const { page } = this._paged(this.filtered);
    const stat = this._schStat();
    const today = new Date();
    const el = document.getElementById('spTableWrapper');
    if (!el) return;

    const cards = `
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;padding:14px 24px;background:#f8fafc;border-bottom:1px solid var(--border);">
        ${[['待取样', stat.wait, '#2563eb'], ['30 天内到期', stat.due30, '#f59e0b'], ['已超期', stat.overdue, '#dc2626'],
           ['检验中', stat.testing, '#6366f1'], ['已完成', stat.done, '#16a34a']]
          .map(c => `<div style="background:#fff;border:1px solid var(--border);border-radius:8px;padding:12px 16px;">
            <div style="font-size:12px;color:var(--text-muted);">${c[0]}</div>
            <div style="font-size:22px;font-weight:700;color:${c[2]};">${c[1]}</div>
          </div>`).join('')}
      </div>`;

    el.innerHTML = cards + `<table class="data-table" style="min-width:1760px;">
      <thead><tr>
        <th style="width:140px;">考察编号</th>
        <th style="width:180px;">物料</th>
        <th style="width:140px;">条件</th>
        <th style="width:100px;">时间点</th>
        <th style="width:160px;">计划日期</th>
        <th style="width:110px;">状态</th>
        <th style="width:140px;">检验批</th>
        <th style="width:100px;">判定</th>
        <th style="width:280px;">备注</th>
        <th style="width:150px;">操作</th>
      </tr></thead>
      <tbody>${page.length ? page.map(r => {
        const b = this.batchData.find(x => x.id === r.studyId) || {};
        const m = this.getSchMeta(r.status);
        const days = Math.round((new Date(r.planDate) - today) / 86400000);
        let dateHtml = `<span style="font-size:12px;">${esc(r.planDate)}</span>`;
        if (r.status === 'OVERDUE') dateHtml += `<div style="color:#dc2626;font-size:11px;">已超期 ${-days} 天</div>`;
        else if (r.status === 'WAIT' && days >= 0 && days <= 30) dateHtml += `<div style="color:#f59e0b;font-size:11px;">${days} 天内到期</div>`;
        const acts = [];
        if (r.status === 'WAIT' || r.status === 'OVERDUE') {
          acts.push(`<button class="btn btn-primary btn-sm" onclick="StabilityPlan.openSampling('${r.id}')">取样出箱</button>`);
        }
        if (r.status === 'TESTING') {
          acts.push(`<button class="btn btn-sm" style="background:#6366f1;color:#fff;" onclick="toast('请到「检验批管理」打开检验批 ${r.inspBatch} 录入结果')">录入结果</button>`);
        }
        acts.push(`<button class="btn btn-blue btn-sm" onclick="StabilityPlan.openSchDetail('${r.id}')">查看</button>`);
        return `<tr>
          <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(r.studyNo)}</td>
          <td style="font-size:12px;">${esc(b.materialName || '—')}</td>
          <td style="font-size:12px;">${esc(this.getCondName(r.cond))}</td>
          <td style="font-size:12px;">${r.point} 月</td>
          <td>${dateHtml}</td>
          <td><span class="badge ${m.badge}">${esc(m.name)}</span></td>
          <td style="font-family:monospace;font-size:11px;">${esc(r.inspBatch || '—')}</td>
          <td>${r.verdict ? `<span class="badge ${r.verdict === 'PASS' ? 'badge-green' : r.verdict === 'OOT' ? 'badge-yellow' : 'badge-red'}">${esc(r.verdict)}</span>` : '—'}</td>
          <td style="font-size:12px;">${esc(r.note || '—')}</td>
          <td><div class="table-actions">${acts.join('')}</div></td>
        </tr>`;
      }).join('') : `<tr><td colspan="10" class="empty-cell">暂无符合条件的时间点计划</td></tr>`}</tbody>
    </table>`;
  },

  openSchDetail(rowId) {
    const r = this.scheduleData.find(x => x.id === rowId);
    if (!r) return;
    const b = this.batchData.find(x => x.id === r.studyId) || {};
    const p = this.protocolData.find(x => x.id === b.protoId) || {};
    const m = this.getSchMeta(r.status);
    showModal('时间点计划 — ' + r.studyNo + ' ' + r.point + '月', `
      <div style="padding:4px 0;font-size:13px;">
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px 24px;padding:14px 16px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;">
          <div><span style="color:var(--text-muted);">考察编号：</span>${esc(r.studyNo)}</div>
          <div><span style="color:var(--text-muted);">状态：</span><span class="badge ${m.badge}">${esc(m.name)}</span></div>
          <div><span style="color:var(--text-muted);">物料：</span>${esc(b.materialName || '—')}</div>
          <div><span style="color:var(--text-muted);">生产批次：</span>${esc(b.prodBatch || '—')}</div>
          <div><span style="color:var(--text-muted);">条件：</span>${esc(this.getCondName(r.cond))}</div>
          <div><span style="color:var(--text-muted);">时间点：</span>${r.point} 月（计划 ${esc(r.planDate)}）</div>
          <div><span style="color:var(--text-muted);">取样日期：</span>${esc(r.actualDate || '—')}</div>
          <div><span style="color:var(--text-muted);">检验批：</span>${esc(r.inspBatch || '—')}</div>
          <div><span style="color:var(--text-muted);">本点样品量：</span>${esc(p.qtyPerPoint || '—')}</div>
          <div><span style="color:var(--text-muted);">判定：</span>${r.verdict ? esc(r.verdict) : '—'}</div>
          ${r.note ? `<div style="grid-column:span 2;"><span style="color:var(--text-muted);">备注：</span>${esc(r.note)}</div>` : ''}
        </div>
      </div>`, [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-md');
  },

  // 取样出箱：生成 89 型检验批
  openSampling(rowId) {
    const r = this.scheduleData.find(x => x.id === rowId);
    if (!r) return;
    const b = this.batchData.find(x => x.id === r.studyId) || {};
    const p = this.protocolData.find(x => x.id === b.protoId) || {};
    showModal('取样出箱 — ' + r.studyNo + ' ' + r.point + '月', `
      <div style="padding:4px 0;">
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          ${esc(b.materialName || '')} · 批次 ${esc(b.prodBatch || '')} · ${esc(this.getCondName(r.cond))} · ${r.point} 月点
          ${r.status === 'OVERDUE' ? '<br><span style="color:#dc2626;font-weight:600;">该点已超期（' + esc(r.planDate) + '），取样时请记录超期原因。</span>' : ''}
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>计划日期</label><input type="text" value="${esc(r.planDate)}" disabled></div>
          <div class="form-group"><label>取样日期</label><input type="date" id="smDate" value="${new Date().toISOString().substring(0, 10)}"></div>
          <div class="form-group"><label>取样数量</label><input type="text" id="smQty" value="${esc(p.qtyPerPoint || '')}"></div>
          <div class="form-group"><label>取样人 <span class="req">*</span></label><input type="text" id="smBy" value="${(window.currentUser && window.currentUser.name) || '当前用户'}"></div>
        </div>
        <div class="form-group" style="margin-top:14px;"><label>备注（超期原因等）</label><input type="text" id="smRemark" placeholder="选填"></div>
        <div style="margin-top:12px;font-size:12px;color:var(--text-muted);">确认后将出箱并自动创建 89 型手工检验批，检验项目按方案带出：${(p.items || []).join('、')}</div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认取样', cls: 'btn-primary', action: () => {
        const by = (document.getElementById('smBy') || {}).value;
        if (!by) return toast('请填写取样人');
        r.status = 'TESTING';
        r.actualDate = (document.getElementById('smDate') || {}).value || new Date().toISOString().substring(0, 10);
        r.inspBatch = '100000015' + String(100 + this.scheduleData.indexOf(r));
        const remark = (document.getElementById('smRemark') || {}).value || '';
        if (remark) r.note = remark;
        closeModal(); StabilityPlan.init();
        toast(`已出箱取样（${by}），生成 89 型检验批 ${r.inspBatch}，请到「检验批管理」录入结果`);
      } }
    ], 'modal-md');
  },

  // ==================== 工具与导出 ====================

  _now() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  },

  _addMonths(dateStr, m) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    d.setMonth(d.getMonth() + m);
    if (d.getDate() < day) d.setDate(0);   // 月末溢出回退到当月最后一天
    return d.toISOString().substring(0, 10);
  },

  exportData() {
    if (!this.filtered || !this.filtered.length) return toast('无数据可导出');
    let head, lines = [];
    if (this.activeTab === 'protocol') {
      head = ['方案编号', '方案名称', '类型', '工厂', '产品编码', '产品名称', '考察条件', '时间点', '检验项目', '每点样品量', '状态'];
      this.filtered.forEach(p => lines.push([p.protoNo, p.name, this.getTypeName(p.type), p.plant, p.materialCode, p.materialName,
        p.conds.map(c => this.getCondName(c)).join(' / '), p.points.join('/'), p.items.join('、'), p.qtyPerPoint, this.protoStatusMeta[p.status].name]));
    } else if (this.activeTab === 'batch') {
      head = ['考察编号', '方案编号', '工厂', '物料编码', '物料名称', '生产批次', '起始日期', '包装规格', '入箱数量', '稳定性箱', '状态'];
      this.filtered.forEach(b => lines.push([b.studyNo, b.protoNo, b.plant, b.materialCode, b.materialName, b.prodBatch,
        b.startDate, b.packSpec, b.qty, b.chamber, this.batchStatusMeta[b.status].name]));
    } else {
      head = ['考察编号', '物料名称', '生产批次', '条件', '时间点', '计划日期', '状态', '检验批', '判定', '备注'];
      this.filtered.forEach(r => {
        const b = this.batchData.find(x => x.id === r.studyId) || {};
        lines.push([r.studyNo, b.materialName || '', b.prodBatch || '', this.getCondName(r.cond), r.point + '月',
          r.planDate, this.getSchMeta(r.status).name, r.inspBatch || '—', r.verdict || '—', r.note || '—']);
      });
    }
    const csv = '\uFEFF' + [head.join(',')].concat(lines.map(r => r.map(c => {
      const v = String(c == null ? '' : c);
      return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(','))).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const names = { protocol: '稳定性方案', batch: '考察批次', schedule: '时间点计划' };
    a.download = names[this.activeTab] + '_' + new Date().toISOString().substring(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('已导出 ' + lines.length + ' 条');
  },

  // ==================== 分页 ====================

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
  changePageSize(n) { this.pageSize = Number(n); this.page = 1; this.renderTable(); this.renderPagination(); }
};
