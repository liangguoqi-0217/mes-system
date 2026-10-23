// ===== 稳定性数据与报告页面 =====
// 质量管理 → 质量检验 → 稳定性数据与报告
//
// 职责：稳定性箱与样品出入箱台账、多时间点结果汇总与趋势图（OOT/OOS 标记）、
//       阶段报告 / 年度汇总 / 异常评估报告。
// 边界：趋势图为自研 SVG（标准报表不适合做 OOT 趋势分析）；报告生成后为草稿，
//       正式发布走文件服务与审批流（演示只到草稿）。
//
// 三个页签：样品位置 / 结果与趋势 / 报告
const StabilityData = {
  _version: '1.0-20261023',
  activeTab: 'chamber', // chamber | trend | report
  page: 1, pageSize: 10,
  filtered: [],
  moreOpen: false,

  // ==================== 字典 ====================

  chamberStatusMeta: {
    RUNNING: { name: '运行中', badge: 'badge-green' },
    FAULT: { name: '故障停机', badge: 'badge-red' },
    STANDBY: { name: '待机', badge: 'badge-gray' }
  },

  logTypeMeta: {
    IN: { name: '入箱', badge: 'badge-blue' },
    OUT: { name: '出箱取样', badge: 'badge-purple' },
    MOVE: { name: '转移', badge: 'badge-yellow' },
    DESTROY: { name: '出箱销毁', badge: 'badge-gray' }
  },

  reportTypeMeta: {
    STAGE: { name: '阶段报告', badge: 'badge-blue' },
    ANNUAL: { name: '年度汇总报告', badge: 'badge-purple' },
    REG: { name: '注册申报报告', badge: 'badge-green' },
    ABN: { name: '异常评估报告', badge: 'badge-red' }
  },

  reportStatusMeta: {
    DRAFT: { name: '草稿', badge: 'badge-gray' },
    PUBLISHED: { name: '已发布', badge: 'badge-green' }
  },

  // 趋势图项目规格限（演示口径）
  itemMeta: {
    assay: { name: '含量测定', lower: 95.0, upper: 105.0, unit: '%' },
    related: { name: '有关物质', lower: null, upper: 1.0, unit: '%' },
    moisture: { name: '水分', lower: null, upper: 5.0, unit: '%' },
    dissolve: { name: '溶出度', lower: 80, upper: null, unit: '%' }
  },

  condName: { LT: '长期 25℃/60%RH', AC: '加速 40℃/75%RH' },

  // ==================== 稳定性箱 ====================

  chamberData: [
    { id: 'X01', no: 'STB-X01', cond: 'LT', setTemp: '25℃', setHum: '60%RH', capacity: 200, used: 132, status: 'RUNNING', lastCheck: '2026-10-20', remark: '' },
    { id: 'X02', no: 'STB-X02', cond: 'AC', setTemp: '40℃', setHum: '75%RH', capacity: 120, used: 96, status: 'RUNNING', lastCheck: '2026-10-20', remark: '' },
    { id: 'X03', no: 'STB-X03', cond: 'LT', setTemp: '25℃', setHum: '60%RH', capacity: 200, used: 44, status: 'STANDBY', lastCheck: '2026-10-18', remark: '备用箱' },
    { id: 'X04', no: 'STB-X04', cond: 'AC', setTemp: '40℃', setHum: '75%RH', capacity: 120, used: 18, status: 'FAULT', lastCheck: '2026-10-09', remark: '压缩机故障维修中，样品已转移至 STB-X02' }
  ],

  // 出入箱流水
  inOutLog: [
    { id: 'L01', time: '2026-10-09 11:00', type: 'MOVE', chamber: 'STB-X02', studyNo: 'STB-26004', cond: 'AC', qty: '12 支', by: '赵工', remark: 'STB-X04 故障，样品转移' },
    { id: 'L02', time: '2026-09-12 09:40', type: 'OUT', chamber: 'STB-X01', studyNo: 'STB-26004', cond: 'LT', qty: '8 支', by: '赵工', remark: '6月点取样，送检 100000014208' },
    { id: 'L03', time: '2026-09-12 09:45', type: 'OUT', chamber: 'STB-X02', studyNo: 'STB-26004', cond: 'AC', qty: '8 支', by: '赵工', remark: '6月点取样，送检 100000014209' },
    { id: 'L04', time: '2026-08-10 10:00', type: 'OUT', chamber: 'STB-X01', studyNo: 'STB-26005', cond: 'LT', qty: '4 袋', by: '周工', remark: '3月点取样' },
    { id: 'L05', time: '2026-07-18 14:30', type: 'IN', chamber: 'STB-X01', studyNo: 'STB-26003', cond: 'LT', qty: '10 支', by: '钱工', remark: '考察入箱（变更后考察）' },
    { id: 'L06', time: '2026-06-22 15:10', type: 'OUT', chamber: 'STB-X01', studyNo: 'STB-26001', cond: 'LT', qty: '6 盒', by: '李工', remark: '12月点取样（含 OOT 复测样）' },
    { id: 'L07', time: '2026-05-10 09:20', type: 'IN', chamber: 'STB-X01', studyNo: 'STB-26005', cond: 'LT', qty: '20 袋', by: '周工', remark: '考察入箱' },
    { id: 'L08', time: '2026-03-20 16:00', type: 'OUT', chamber: 'STB-X02', studyNo: 'STB-26001', cond: 'AC', qty: '6 盒', by: '李工', remark: '加速 9 月点取样，加速考察结束' },
    { id: 'L09', time: '2025-06-20 10:00', type: 'IN', chamber: 'STB-X01', studyNo: 'STB-26001', cond: 'LT', qty: '12 盒', by: '李工', remark: '考察入箱（长期）' },
    { id: 'L10', time: '2025-06-20 10:20', type: 'IN', chamber: 'STB-X02', studyNo: 'STB-26001', cond: 'AC', qty: '12 盒', by: '李工', remark: '考察入箱（加速）' }
  ],

  // ==================== 结果汇总（批次 × 条件 × 时间点） ====================

  resultData: [
    // STB-26001 布洛芬缓释胶囊 长期：有关物质趋势上移（OOT 场景）
    { id: 'R01', studyNo: 'STB-26001', cond: 'LT', point: 0,  planDate: '2025-06-20', actualDate: '2025-06-21', inspBatch: '100000013101', assay: '99.2', related: '0.32', moisture: '1.8', dissolve: '92.5', verdict: 'PASS', note: '' },
    { id: 'R02', studyNo: 'STB-26001', cond: 'LT', point: 3,  planDate: '2025-09-20', actualDate: '2025-09-22', inspBatch: '100000013102', assay: '99.0', related: '0.38', moisture: '1.9', dissolve: '92.1', verdict: 'PASS', note: '' },
    { id: 'R03', studyNo: 'STB-26001', cond: 'LT', point: 6,  planDate: '2025-12-20', actualDate: '2025-12-21', inspBatch: '100000013103', assay: '98.8', related: '0.41', moisture: '1.9', dissolve: '91.8', verdict: 'PASS', note: '' },
    { id: 'R04', studyNo: 'STB-26001', cond: 'LT', point: 9,  planDate: '2026-03-20', actualDate: '2026-03-21', inspBatch: '100000013104', assay: '98.6', related: '0.48', moisture: '2.0', dissolve: '91.2', verdict: 'PASS', note: '' },
    { id: 'R05', studyNo: 'STB-26001', cond: 'LT', point: 12, planDate: '2026-06-20', actualDate: '2026-06-22', inspBatch: '100000013105', assay: '98.2', related: '0.61', moisture: '2.1', dissolve: '90.4', verdict: 'OOT',  note: '有关物质 0.32%→0.61% 趋势上移，启动趋势评估 TREND-EVA-2026-006' },
    // STB-26001 加速
    { id: 'R06', studyNo: 'STB-26001', cond: 'AC', point: 0, planDate: '2025-06-20', actualDate: '2025-06-21', inspBatch: '100000013111', assay: '99.1', related: '0.35', moisture: '1.8', dissolve: '92.3', verdict: 'PASS', note: '' },
    { id: 'R07', studyNo: 'STB-26001', cond: 'AC', point: 3, planDate: '2025-09-20', actualDate: '2025-09-22', inspBatch: '100000013112', assay: '98.7', related: '0.52', moisture: '2.0', dissolve: '91.0', verdict: 'PASS', note: '' },
    { id: 'R08', studyNo: 'STB-26001', cond: 'AC', point: 6, planDate: '2025-12-20', actualDate: '2025-12-21', inspBatch: '100000013113', assay: '98.3', related: '0.78', moisture: '2.2', dissolve: '89.6', verdict: 'PASS', note: '' },
    { id: 'R09', studyNo: 'STB-26001', cond: 'AC', point: 9, planDate: '2026-03-20', actualDate: '2026-03-20', inspBatch: '100000013114', assay: '97.9', related: '0.94', moisture: '2.4', dissolve: '88.5', verdict: 'PASS', note: '加速 9 月有关物质 0.94%，接近限值 1.0%，纳入趋势关注' },
    // STB-26004 丹红 长期：6 月点 OOS（偏差场景）
    { id: 'R10', studyNo: 'STB-26004', cond: 'LT', point: 0, planDate: '2026-03-10', actualDate: '2026-03-11', inspBatch: '100000014101', assay: '99.5', related: '0.28', moisture: '', dissolve: '', verdict: 'PASS', note: '' },
    { id: 'R11', studyNo: 'STB-26004', cond: 'LT', point: 6, planDate: '2026-09-10', actualDate: '2026-09-12', inspBatch: '100000014208', assay: '98.1', related: '1.12', moisture: '', dissolve: '', verdict: 'OOS',  note: '有关物质超出限度（≤1.0%），发起偏差 DEV-20260915-002，评估市售产品影响' },
    // STB-26003 冠心宁 变更后
    { id: 'R12', studyNo: 'STB-26003', cond: 'LT', point: 0, planDate: '2026-07-18', actualDate: '2026-07-18', inspBatch: '100000014001', assay: '99.6', related: '0.25', moisture: '', dissolve: '', verdict: 'PASS', note: '' },
    // STB-26005 稳心颗粒
    { id: 'R13', studyNo: 'STB-26005', cond: 'LT', point: 0, planDate: '2026-05-10', actualDate: '2026-05-11', inspBatch: '100000014301', assay: '99.4', related: '0.30', moisture: '3.2', dissolve: '95.0', verdict: 'PASS', note: '' },
    { id: 'R14', studyNo: 'STB-26005', cond: 'LT', point: 3, planDate: '2026-08-10', actualDate: '2026-08-11', inspBatch: '100000014305', assay: '99.2', related: '0.34', moisture: '3.3', dissolve: '94.6', verdict: 'PASS', note: '' },
    // STB-25902 维生素C 上市前（已完成，0/12/24 月）
    { id: 'R15', studyNo: 'STB-25902', cond: 'LT', point: 0,  planDate: '2023-06-15', actualDate: '2023-06-16', inspBatch: '100000008801', assay: '99.3', related: '0.30', moisture: '2.1', dissolve: '', verdict: 'PASS', note: '' },
    { id: 'R16', studyNo: 'STB-25902', cond: 'LT', point: 12, planDate: '2024-06-15', actualDate: '2024-06-17', inspBatch: '100000010403', assay: '99.0', related: '0.36', moisture: '2.3', dissolve: '', verdict: 'PASS', note: '' },
    { id: 'R17', studyNo: 'STB-25902', cond: 'LT', point: 24, planDate: '2025-06-15', actualDate: '2025-06-16', inspBatch: '100000011906', assay: '98.6', related: '0.42', moisture: '2.5', dissolve: '', verdict: 'PASS', note: '全时间点合格，报告用于注册申报' }
  ],

  // ==================== 报告 ====================

  reportData: [
    { id: 'RP01', no: 'SR-2026-020', type: 'ABN', studyNo: 'STB-26004', title: '丹红注射液长期 6 月有关物质 OOS 评估报告',
      period: '2026-09 ~ 2026-10', status: 'DRAFT', by: '质量部 赵工', time: '2026-10-15',
      conclusion: '关联偏差 DEV-20260915-002，市售批次影响评估进行中' },
    { id: 'RP02', no: 'SR-2026-018', type: 'ANNUAL', studyNo: '—', title: '2026 年度稳定性考察汇总报告（草案）',
      period: '2026-01 ~ 2026-10', status: 'DRAFT', by: '质量部', time: '2026-10-20', conclusion: '' },
    { id: 'RP03', no: 'SR-2026-012', type: 'STAGE', studyNo: 'STB-26001', title: '布洛芬缓释胶囊长期 12 月阶段报告',
      period: '2025-06 ~ 2026-06', status: 'PUBLISHED', by: '质量部 李工', time: '2026-07-05',
      conclusion: '12 月点有关物质 OOT（0.61%），在规格内呈上升趋势；维持考察并加强趋势监测' },
    { id: 'RP04', no: 'SR-2025-006', type: 'REG', studyNo: 'STB-25902', title: '维生素C原料上市稳定性考察报告（0-24 月）',
      period: '2023-06 ~ 2025-06', status: 'PUBLISHED', by: '注册部 吴工', time: '2025-07-10',
      conclusion: '各时间点均符合规格，支持有效期 24 个月，注册申报已提交' }
  ],

  // ==================== 页面骨架 ====================

  render() {
    this.page = 1;
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">稳定性数据与报告</div>
            <div style="font-size:13px;opacity:0.85;">样品位置 · 多时间点结果汇总与 OOT 趋势 · 阶段与年度报告</div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
              onclick="StabilityData.openTrend()">📈 趋势图</button>
            <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
              onclick="StabilityData.openReportCreate()">+ 生成报告</button>
          </div>
        </div>

        <div class="tabs" style="margin:0;padding:0 24px;background:white;border-bottom:1px solid var(--border);flex-shrink:0;">
          <div class="tab ${this.activeTab === 'chamber' ? 'active' : ''}" onclick="StabilityData.switchTab('chamber')">样品位置</div>
          <div class="tab ${this.activeTab === 'trend' ? 'active' : ''}" onclick="StabilityData.switchTab('trend')">结果与趋势</div>
          <div class="tab ${this.activeTab === 'report' ? 'active' : ''}" onclick="StabilityData.switchTab('report')">报告</div>
        </div>

        <div id="sdFilterBar" style="flex-shrink:0;"></div>
        <div class="table-wrapper" id="sdTableWrapper" style="flex:1;overflow:auto;width:100%;min-width:0;"></div>
        <div id="sdPagination" style="flex-shrink:0;"></div>
      </div>`;
  },

  init() {
    if (window.QueryVariant) {
      QueryVariant.mount('stability-data');
      QueryVariant.restore('stability-data');
      QueryVariant.bindRecent('stability-data');
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
    ['sdCond', 'sdKeyword', 'sdStatus', 'sdVerdict', 'sdType'].forEach(id => {
      const e = document.getElementById(id); if (e) e.value = '';
    });
    this.search();
  },

  // ==================== 筛选栏 ====================

  renderFilterBar() {
    const el = document.getElementById('sdFilterBar');
    if (!el) return;
    const btn = `
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="StabilityData.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="StabilityData.exportData()">导出</button>
          <button class="btn btn-secondary btn-sm" onclick="StabilityData.refresh()">刷新</button>
          <button class="btn btn-secondary btn-sm" onclick="StabilityData.resetFilter()">重置</button>
        </div>`;
    const condOpts = `<option value="">全部</option><option value="LT">长期 25℃/60%RH</option><option value="AC">加速 40℃/75%RH</option>`;

    if (this.activeTab === 'chamber') {
      el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
        <div class="filter-group"><label>考察条件</label><select id="sdCond">${condOpts}</select></div>
        <div class="filter-group"><label>箱号 / 考察编号</label><input type="text" id="sdKeyword" placeholder="如 STB-X01 或 STB-26001"></div>
        <div class="filter-group"><label>运行状态</label><select id="sdStatus">
          <option value="">全部</option><option value="RUNNING">运行中</option><option value="FAULT">故障停机</option><option value="STANDBY">待机</option>
        </select></div>
        ${btn}
      </div>`;
      return;
    }

    if (this.activeTab === 'trend') {
      el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
        <div class="filter-group"><label>考察条件</label><select id="sdCond">${condOpts}</select></div>
        <div class="filter-group"><label>考察编号 / 检验批</label><input type="text" id="sdKeyword" placeholder="如 STB-26001 或 100000013105"></div>
        <div class="filter-group"><label>结果判定</label><select id="sdVerdict">
          <option value="">全部</option><option value="PASS">PASS</option><option value="OOT">OOT</option><option value="OOS">OOS</option>
        </select></div>
        ${btn}
      </div>`;
      return;
    }

    const typeOpts = Object.keys(this.reportTypeMeta)
      .map(k => `<option value="${k}">${this.reportTypeMeta[k].name}</option>`).join('');
    el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
      <div class="filter-group"><label>报告类型</label><select id="sdType"><option value="">全部</option>${typeOpts}</select></div>
      <div class="filter-group"><label>报告编号 / 标题 / 考察编号</label><input type="text" id="sdKeyword" placeholder="如 SR-2026 或 布洛芬"></div>
      <div class="filter-group"><label>状态</label><select id="sdStatus">
        <option value="">全部</option><option value="DRAFT">草稿</option><option value="PUBLISHED">已发布</option>
      </select></div>
      ${btn}
    </div>`;
  },

  // ==================== 表格分发 ====================

  renderTable() {
    if (this.activeTab === 'chamber') this.renderChamberTable();
    else if (this.activeTab === 'trend') this.renderResultTable();
    else this.renderReportTable();
  },

  _paged(list) {
    const pages = Math.max(1, Math.ceil(list.length / this.pageSize));
    if (this.page > pages) this.page = pages;
    const start = (this.page - 1) * this.pageSize;
    return { page: list.slice(start, start + this.pageSize), start: start };
  },

  // ---------- 页签一：样品位置 ----------

  renderChamberTable() {
    const cond = this._val('sdCond');
    const status = this._val('sdStatus');
    const kw = this._val('sdKeyword').toLowerCase();

    const chambers = this.chamberData.filter(c => {
      if (cond && c.cond !== cond) return false;
      if (status && c.status !== status) return false;
      if (kw && (c.no + ' ' + c.remark).toLowerCase().indexOf(kw) === -1) {
        const hitLog = this.inOutLog.some(l => (l.studyNo + ' ' + l.chamber).toLowerCase().indexOf(kw) !== -1);
        if (!hitLog) return false;
      }
      return true;
    });
    this.filtered = this.inOutLog.filter(l => {
      if (cond && l.cond !== cond) return false;
      if (kw && (l.studyNo + ' ' + l.chamber + ' ' + l.remark).toLowerCase().indexOf(kw) === -1) return false;
      if (status) {
        const c = this.chamberData.find(x => x.no === l.chamber);
        if (!c || c.status !== status) return false;
      }
      return true;
    });

    const { page } = this._paged(this.filtered);
    const el = document.getElementById('sdTableWrapper');
    if (!el) return;

    el.innerHTML = `
      <div style="padding:14px 24px 4px;font-weight:700;font-size:13px;">稳定性箱</div>
      <table class="data-table" style="min-width:1200px;">
        <thead><tr>
          <th style="width:130px;">箱号</th>
          <th style="width:160px;">设定条件</th>
          <th style="width:110px;">容量 / 已用</th>
          <th style="width:130px;">使用率</th>
          <th style="width:110px;">运行状态</th>
          <th style="width:130px;">最近巡检</th>
          <th style="min-width:220px;">备注</th>
        </tr></thead>
        <tbody>${chambers.length ? chambers.map(c => {
          const pct = Math.round(c.used / c.capacity * 100);
          const m = this.chamberStatusMeta[c.status];
          return `<tr${c.status === 'FAULT' ? ' style="background:#fef2f2;"' : ''}>
            <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(c.no)}</td>
            <td style="font-size:12px;">${esc(c.setTemp)} / ${esc(c.setHum)}（${c.cond === 'LT' ? '长期' : '加速'}）</td>
            <td style="font-size:12px;">${c.capacity} / ${c.used}</td>
            <td><div style="background:#e2e8f0;border-radius:4px;height:8px;width:100px;">
              <div style="background:${pct > 85 ? '#dc2626' : '#2563eb'};height:8px;border-radius:4px;width:${pct}%;"></div>
            </div><span style="font-size:11px;color:var(--text-muted);">${pct}%</span></td>
            <td><span class="badge ${m.badge}">${esc(m.name)}</span></td>
            <td style="font-size:12px;">${esc(c.lastCheck)}</td>
            <td style="font-size:12px;">${esc(c.remark || '—')}</td>
          </tr>`;
        }).join('') : `<tr><td colspan="7" class="empty-cell">暂无符合条件的稳定性箱</td></tr>`}</tbody>
      </table>
      <div style="display:flex;align-items:center;gap:12px;padding:18px 24px 4px;">
        <span style="font-weight:700;font-size:13px;">样品出入箱流水</span>
        <button class="btn btn-secondary btn-sm" onclick="StabilityData.openLogCreate()">+ 出入箱登记</button>
      </div>
      <table class="data-table" style="min-width:1200px;">
        <thead><tr>
          <th style="width:150px;">时间</th>
          <th style="width:110px;">类型</th>
          <th style="width:120px;">箱号</th>
          <th style="width:130px;">考察编号</th>
          <th style="width:100px;">条件</th>
          <th style="width:110px;">数量</th>
          <th style="width:100px;">经办人</th>
          <th style="min-width:260px;">说明</th>
        </tr></thead>
        <tbody>${page.length ? page.map(l => `<tr>
          <td style="font-size:12px;">${esc(l.time)}</td>
          <td><span class="badge ${this.logTypeMeta[l.type].badge}">${esc(this.logTypeMeta[l.type].name)}</span></td>
          <td style="font-family:monospace;font-size:12px;">${esc(l.chamber)}</td>
          <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(l.studyNo)}</td>
          <td style="font-size:12px;">${l.cond ? esc(this.condName[l.cond]) : '—'}</td>
          <td style="font-size:12px;">${esc(l.qty)}</td>
          <td style="font-size:12px;">${esc(l.by)}</td>
          <td style="font-size:12px;">${esc(l.remark || '—')}</td>
        </tr>`).join('') : `<tr><td colspan="8" class="empty-cell">暂无出入箱记录</td></tr>`}</tbody>
      </table>`;
  },

  openLogCreate() {
    const chamberOpts = this.chamberData.filter(c => c.status !== 'FAULT')
      .map(c => `<option value="${c.no}">${c.no}（${c.cond === 'LT' ? '长期' : '加速'} ${c.setTemp}/${c.setHum}）</option>`).join('');
    const studyNos = [...new Set(this.inOutLog.map(l => l.studyNo))]
      .map(s => `<option value="${s}">${s}</option>`).join('');
    showModal('出入箱登记', `
      <div style="padding:4px 0;">
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>类型 <span class="req">*</span></label><select id="lgType">
            <option value="IN">入箱</option><option value="OUT">出箱取样</option>
            <option value="MOVE">转移</option><option value="DESTROY">出箱销毁</option>
          </select></div>
          <div class="form-group"><label>稳定性箱</label><select id="lgChamber">${chamberOpts}</select></div>
          <div class="form-group"><label>考察编号</label><select id="lgStudy">${studyNos}</select></div>
          <div class="form-group"><label>数量</label><input type="text" id="lgQty" placeholder="如 6 盒"></div>
          <div class="form-group"><label>经办人</label><input type="text" id="lgBy" value="${(window.currentUser && window.currentUser.name) || '当前用户'}"></div>
          <div class="form-group"><label>日期</label><input type="date" id="lgDate" value="${new Date().toISOString().substring(0, 10)}"></div>
        </div>
        <div class="form-group" style="margin-top:14px;"><label>说明</label><input type="text" id="lgRemark" placeholder="如 6月点取样，送检批号"></div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '保存', cls: 'btn-primary', action: () => {
        const d = (document.getElementById('lgDate') || {}).value || new Date().toISOString().substring(0, 10);
        this.inOutLog.unshift({
          id: 'L' + (900 + this.inOutLog.length),
          time: d + ' 10:00',
          type: (document.getElementById('lgType') || {}).value || 'IN',
          chamber: (document.getElementById('lgChamber') || {}).value || '',
          studyNo: (document.getElementById('lgStudy') || {}).value || '',
          cond: '', qty: (document.getElementById('lgQty') || {}).value || '—',
          by: (document.getElementById('lgBy') || {}).value || '',
          remark: (document.getElementById('lgRemark') || {}).value || ''
        });
        closeModal(); StabilityData.init();
        toast('出入箱记录已登记');
      } }
    ], 'modal-md');
  },

  // ---------- 页签二：结果与趋势 ----------

  renderResultTable() {
    const cond = this._val('sdCond');
    const verdict = this._val('sdVerdict');
    const kw = this._val('sdKeyword').toLowerCase();

    this.filtered = this.resultData.filter(r => {
      if (cond && r.cond !== cond) return false;
      if (verdict && r.verdict !== verdict) return false;
      if (kw && (r.studyNo + ' ' + r.inspBatch).toLowerCase().indexOf(kw) === -1) return false;
      return true;
    });

    const { page } = this._paged(this.filtered);
    const el = document.getElementById('sdTableWrapper');
    if (!el) return;

    const cell = (v, warn) => v === '' || v == null
      ? '<span style="color:var(--text-muted);">—</span>'
      : `<span${warn ? ' style="color:#dc2626;font-weight:700;"' : ''}>${esc(v)}</span>`;
    const vBadge = v => v === 'PASS' ? '<span class="badge badge-green">PASS</span>'
      : v === 'OOT' ? '<span class="badge badge-yellow">OOT</span>'
      : v === 'OOS' ? '<span class="badge badge-red">OOS</span>' : '—';

    el.innerHTML = `<table class="data-table" style="min-width:1820px;">
      <thead><tr>
        <th style="width:140px;">考察编号</th>
        <th style="width:150px;">条件</th>
        <th style="width:100px;">时间点</th>
        <th style="width:150px;">取样日期</th>
        <th style="width:140px;">检验批</th>
        <th style="width:120px;">含量 %<br><span style="font-weight:400;color:var(--text-muted);">95.0~105.0</span></th>
        <th style="width:120px;">有关物质 %<br><span style="font-weight:400;color:var(--text-muted);">≤1.0</span></th>
        <th style="width:110px;">水分 %<br><span style="font-weight:400;color:var(--text-muted);">≤5.0</span></th>
        <th style="width:110px;">溶出 %<br><span style="font-weight:400;color:var(--text-muted);">≥80</span></th>
        <th style="width:100px;">判定</th>
        <th style="min-width:300px;">备注</th>
      </tr></thead>
      <tbody>${page.length ? page.map(r => `<tr${r.verdict === 'OOS' ? ' style="background:#fef2f2;"' : r.verdict === 'OOT' ? ' style="background:#fffbeb;"' : ''}>
        <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(r.studyNo)}</td>
        <td style="font-size:12px;">${esc(this.condName[r.cond])}</td>
        <td style="font-size:12px;">${r.point} 月</td>
        <td style="font-size:12px;">${esc(r.actualDate)}</td>
        <td style="font-family:monospace;font-size:11px;">${esc(r.inspBatch)}</td>
        <td style="font-size:12px;">${cell(r.assay, Number(r.assay) < 95 || Number(r.assay) > 105)}</td>
        <td style="font-size:12px;">${cell(r.related, Number(r.related) > 1.0)}</td>
        <td style="font-size:12px;">${cell(r.moisture, Number(r.moisture) > 5.0)}</td>
        <td style="font-size:12px;">${cell(r.dissolve, Number(r.dissolve) < 80)}</td>
        <td>${vBadge(r.verdict)}</td>
        <td style="font-size:12px;">${esc(r.note || '—')}</td>
      </tr>`).join('') : `<tr><td colspan="11" class="empty-cell">暂无符合条件的检验结果</td></tr>`}</tbody>
    </table>`;
  },

  // 趋势图弹窗（SVG 折线 + 规格限）
  openTrend() {
    const studyNos = [...new Set(this.resultData.map(r => r.studyNo))];
    const studyOpts = studyNos.map(s => `<option value="${s}">${s}</option>`).join('');
    const itemOpts = Object.keys(this.itemMeta)
      .map(k => `<option value="${k}">${this.itemMeta[k].name}</option>`).join('');
    showModal('稳定性趋势分析', `
      <div style="padding:4px 0;">
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px;">
          <div class="filter-group" style="margin:0;"><label>考察编号</label>
            <select id="sdTrStudy" onchange="StabilityData.drawTrend()">${studyOpts}</select></div>
          <div class="filter-group" style="margin:0;"><label>条件</label>
            <select id="sdTrCond" onchange="StabilityData.drawTrend()">
              <option value="LT">长期 25℃/60%RH</option><option value="AC">加速 40℃/75%RH</option>
            </select></div>
          <div class="filter-group" style="margin:0;"><label>检验项目</label>
            <select id="sdTrItem" onchange="StabilityData.drawTrend()">${itemOpts}</select></div>
        </div>
        <div id="sdTrendBox"></div>
      </div>`, [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-lg');
    this.drawTrend();
  },

  drawTrend() {
    const box = document.getElementById('sdTrendBox');
    if (!box) return;
    const studyNo = this._val('sdTrStudy') || this.resultData[0].studyNo;
    const cond = this._val('sdTrCond') || 'LT';
    const itemKey = this._val('sdTrItem') || 'related';
    box.innerHTML = this._trendSvg(studyNo, cond, itemKey);
  },

  _trendSvg(studyNo, cond, itemKey) {
    const meta = this.itemMeta[itemKey];
    const rows = this.resultData
      .filter(r => r.studyNo === studyNo && r.cond === cond && r[itemKey] !== '' && r[itemKey] != null)
      .sort((a, b) => a.point - b.point);
    if (!rows.length) {
      return `<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:13px;">${esc(studyNo)}（${esc(this.condName[cond])}）暂无「${esc(meta.name)}」数据</div>`;
    }
    const vals = rows.map(r => Number(r[itemKey]));
    const lo = Math.min.apply(null, vals.concat(meta.lower != null ? [meta.lower] : []));
    const hi = Math.max.apply(null, vals.concat(meta.upper != null ? [meta.upper] : []));
    const pad = (hi - lo) * 0.18 || Math.abs(hi) * 0.1 || 1;
    const yMin = lo - pad, yMax = hi + pad;
    const W = 640, H = 300, L = 62, R = 30, T = 26, B = 46;
    const n = rows.length;
    const xi = i => L + (n === 1 ? (W - L - R) / 2 : i * (W - L - R) / (n - 1));
    const yi = v => T + (yMax - v) / (yMax - yMin) * (H - T - B);
    const out = v => (meta.upper != null && v > meta.upper) || (meta.lower != null && v < meta.lower);

    let g = '';
    // 纵轴网格与刻度
    for (let k = 0; k <= 4; k++) {
      const v = yMin + (yMax - yMin) * k / 4;
      g += `<line x1="${L}" y1="${yi(v)}" x2="${W - R}" y2="${yi(v)}" stroke="#e2e8f0" stroke-width="1"/>`
        + `<text x="${L - 8}" y="${yi(v) + 4}" text-anchor="end" font-size="11" fill="#64748b">${v.toFixed(2)}</text>`;
    }
    // 规格限虚线
    if (meta.upper != null) {
      g += `<line x1="${L}" y1="${yi(meta.upper)}" x2="${W - R}" y2="${yi(meta.upper)}" stroke="#dc2626" stroke-width="1.2" stroke-dasharray="6,4"/>`
        + `<text x="${W - R}" y="${yi(meta.upper) - 5}" text-anchor="end" font-size="11" fill="#dc2626">上限 ${meta.upper}${meta.unit}</text>`;
    }
    if (meta.lower != null) {
      g += `<line x1="${L}" y1="${yi(meta.lower)}" x2="${W - R}" y2="${yi(meta.lower)}" stroke="#dc2626" stroke-width="1.2" stroke-dasharray="6,4"/>`
        + `<text x="${W - R}" y="${yi(meta.lower) + 14}" text-anchor="end" font-size="11" fill="#dc2626">下限 ${meta.lower}${meta.unit}</text>`;
    }
    // 横轴标签（时间点）
    rows.forEach((r, i) => {
      g += `<text x="${xi(i)}" y="${H - B + 20}" text-anchor="middle" font-size="11" fill="#64748b">${r.point}月</text>`;
    });
    // 折线与数据点
    const pts = rows.map((r, i) => `${xi(i)},${yi(Number(r[itemKey]))}`).join(' ');
    g += `<polyline points="${pts}" fill="none" stroke="#2563eb" stroke-width="2.2"/>`;
    rows.forEach((r, i) => {
      const v = Number(r[itemKey]);
      const bad = out(v);
      g += `<circle cx="${xi(i)}" cy="${yi(v)}" r="4.5" fill="${bad ? '#dc2626' : '#2563eb'}" stroke="#fff" stroke-width="1.5"/>`
        + `<text x="${xi(i)}" y="${yi(v) - 10}" text-anchor="middle" font-size="11" font-weight="600" fill="${bad ? '#dc2626' : '#1e293b'}">${v}</text>`;
    });
    // 坐标轴
    g += `<line x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}" stroke="#94a3b8" stroke-width="1.5"/>`
      + `<line x1="${L}" y1="${T}" x2="${L}" y2="${H - B}" stroke="#94a3b8" stroke-width="1.5"/>`;

    const badCount = vals.filter(out).length;
    const trendNote = rows.length >= 2 && (vals[vals.length - 1] - vals[0]) > 0 && itemKey === 'related'
      ? ' ・ 逐点上行，关注趋势外推'
      : '';
    const summary = `${esc(studyNo)}（${esc(this.condName[cond])}）· ${esc(meta.name)}：${n} 个时间点，范围 ${Math.min.apply(null, vals)}~${Math.max.apply(null, vals)}${meta.unit}`
      + (badCount ? ` ・ <span style="color:#dc2626;font-weight:700;">${badCount} 个点超出规格限</span>` : '')
      + `<span>${trendNote}</span>`;

    return `<div style="border:1px solid var(--border);border-radius:8px;padding:8px;">
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;">${g}</svg>
      </div>
      <div style="margin-top:10px;font-size:12.5px;color:var(--text-secondary);">${summary}</div>`;
  },

  // ---------- 页签三：报告 ----------

  renderReportTable() {
    const type = this._val('sdType');
    const status = this._val('sdStatus');
    const kw = this._val('sdKeyword').toLowerCase();

    this.filtered = this.reportData.filter(r => {
      if (type && r.type !== type) return false;
      if (status && r.status !== status) return false;
      if (kw && (r.no + ' ' + r.title + ' ' + r.studyNo).toLowerCase().indexOf(kw) === -1) return false;
      return true;
    });

    const { page } = this._paged(this.filtered);
    const el = document.getElementById('sdTableWrapper');
    if (!el) return;

    el.innerHTML = `<table class="data-table" style="min-width:1560px;">
      <thead><tr>
        <th style="width:140px;">报告编号</th>
        <th style="width:130px;">报告类型</th>
        <th style="width:320px;">报告标题</th>
        <th style="width:130px;">关联考察</th>
        <th style="width:180px;">覆盖期间</th>
        <th style="width:150px;">编制人 / 时间</th>
        <th style="width:110px;">状态</th>
        <th style="min-width:240px;">结论</th>
        <th style="width:110px;">操作</th>
      </tr></thead>
      <tbody>${page.length ? page.map(r => `<tr>
        <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(r.no)}</td>
        <td><span class="badge ${this.reportTypeMeta[r.type].badge}">${esc(this.reportTypeMeta[r.type].name)}</span></td>
        <td style="font-size:12.5px;">${esc(r.title)}</td>
        <td style="font-family:monospace;font-size:12px;">${esc(r.studyNo)}</td>
        <td style="font-size:12px;">${esc(r.period)}</td>
        <td style="font-size:12px;">${esc(r.by)}<div style="color:var(--text-muted);font-size:11px;">${esc(r.time)}</div></td>
        <td><span class="badge ${this.reportStatusMeta[r.status].badge}">${esc(this.reportStatusMeta[r.status].name)}</span></td>
        <td style="font-size:12px;">${esc(r.conclusion || '—')}</td>
        <td><div class="table-actions">
          <button class="btn btn-blue btn-sm" onclick="StabilityData.openReportDetail('${r.id}')">查看</button>
        </div></td>
      </tr>`).join('') : `<tr><td colspan="9" class="empty-cell">暂无符合条件的报告</td></tr>`}</tbody>
    </table>`;
  },

  openReportDetail(rid) {
    const r = this.reportData.find(x => x.id === rid);
    if (!r) return;
    const rows = r.studyNo !== '—' ? this.resultData.filter(x => x.studyNo === r.studyNo) : [];
    const dataHtml = rows.length ? `<div style="margin-top:18px;font-weight:700;">关联数据（${r.studyNo}）</div>
      <table class="data-table" style="margin-top:8px;">
        <thead><tr><th>条件</th><th>时间点</th><th>取样日期</th><th>含量 %</th><th>有关物质 %</th><th>判定</th></tr></thead>
        <tbody>${rows.map(x => `<tr>
          <td style="font-size:12px;">${esc(this.condName[x.cond])}</td><td style="font-size:12px;">${x.point} 月</td>
          <td style="font-size:12px;">${esc(x.actualDate)}</td><td style="font-size:12px;">${esc(x.assay || '—')}</td>
          <td style="font-size:12px;">${esc(x.related || '—')}</td>
          <td>${x.verdict === 'PASS' ? '<span class="badge badge-green">PASS</span>' : x.verdict === 'OOT' ? '<span class="badge badge-yellow">OOT</span>' : '<span class="badge badge-red">OOS</span>'}</td>
        </tr>`).join('')}</tbody></table>` : '';
    showModal('稳定性报告 — ' + r.no, `
      <div style="padding:4px 0;font-size:13px;">
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px 24px;padding:14px 16px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;">
          <div style="grid-column:span 2;"><span style="color:var(--text-muted);">标题：</span>${esc(r.title)}</div>
          <div><span style="color:var(--text-muted);">报告类型：</span><span class="badge ${this.reportTypeMeta[r.type].badge}">${esc(this.reportTypeMeta[r.type].name)}</span></div>
          <div><span style="color:var(--text-muted);">状态：</span><span class="badge ${this.reportStatusMeta[r.status].badge}">${esc(this.reportStatusMeta[r.status].name)}</span></div>
          <div><span style="color:var(--text-muted);">关联考察：</span>${esc(r.studyNo)}</div>
          <div><span style="color:var(--text-muted);">覆盖期间：</span>${esc(r.period)}</div>
          <div><span style="color:var(--text-muted);">编制：</span>${esc(r.by)} ${esc(r.time)}</div>
          <div style="grid-column:span 2;"><span style="color:var(--text-muted);">结论：</span>${esc(r.conclusion || '—')}</div>
        </div>
        ${dataHtml}
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:10px 16px;margin-top:14px;font-size:12px;color:#1e293b;">
          正式报告文件由文档服务生成并走审批流发布；本页维护报告台账与关联数据。
        </div>
      </div>`, [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-lg');
  },

  openReportCreate() {
    const typeOpts = Object.keys(this.reportTypeMeta)
      .map(k => `<option value="${k}">${this.reportTypeMeta[k].name}</option>`).join('');
    const studyOpts = [...new Set(this.resultData.map(r => r.studyNo))]
      .map(s => `<option value="${s}">${s}</option>`).join('');
    showModal('生成稳定性报告', `
      <div style="padding:4px 0;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#1e293b;">
          系统按考察编号汇总各时间点结果生成报告草稿，含趋势描述与 OOT/OOS 说明；正式发布走审批流。
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>报告类型</label><select id="rpType">${typeOpts}</select></div>
          <div class="form-group"><label>关联考察</label><select id="rpStudy">${studyOpts}</select></div>
          <div class="form-group"><label>覆盖期间</label><input type="text" id="rpPeriod" placeholder="如 2025-06 ~ 2026-06"></div>
          <div class="form-group"><label>编制人</label><input type="text" id="rpBy" value="${(window.currentUser && window.currentUser.name) || '当前用户'}"></div>
        </div>
        <div class="form-group" style="margin-top:14px;"><label>报告标题 <span class="req">*</span></label>
          <input type="text" id="rpTitle" placeholder="如 ××注射液长期 12 月阶段报告"></div>
        <div class="form-group" style="margin-top:14px;"><label>结论摘要</label>
          <textarea id="rpConclusion" rows="3" placeholder="趋势描述、OOT/OOS 说明、有效期评价建议"></textarea></div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '生成草稿', cls: 'btn-primary', action: () => {
        const title = (document.getElementById('rpTitle') || {}).value || '';
        if (!title) return toast('请填写报告标题');
        this.reportData.unshift({
          id: 'RP' + (900 + this.reportData.length),
          no: 'SR-2026-0' + (this.reportData.length + 21),
          type: (document.getElementById('rpType') || {}).value || 'STAGE',
          studyNo: (document.getElementById('rpStudy') || {}).value || '—',
          title: title,
          period: (document.getElementById('rpPeriod') || {}).value || '—',
          status: 'DRAFT',
          by: (document.getElementById('rpBy') || {}).value || '当前用户',
          time: this._now().substring(0, 10),
          conclusion: (document.getElementById('rpConclusion') || {}).value || ''
        });
        closeModal(); StabilityData.switchTab('report');
        toast('报告草稿已生成，发布需走审批流');
      } }
    ], 'modal-md');
  },

  // ==================== 工具与导出 ====================

  _now() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  },

  exportData() {
    if (!this.filtered || !this.filtered.length) return toast('无数据可导出');
    let head, lines = [];
    if (this.activeTab === 'chamber') {
      head = ['时间', '类型', '箱号', '考察编号', '条件', '数量', '经办人', '说明'];
      this.filtered.forEach(l => lines.push([l.time, this.logTypeMeta[l.type].name, l.chamber, l.studyNo,
        l.cond ? this.condName[l.cond] : '—', l.qty, l.by, l.remark || '—']));
    } else if (this.activeTab === 'trend') {
      head = ['考察编号', '条件', '时间点', '计划日期', '取样日期', '检验批', '含量%', '有关物质%', '水分%', '溶出%', '判定', '备注'];
      this.filtered.forEach(r => lines.push([r.studyNo, this.condName[r.cond], r.point + '月', r.planDate, r.actualDate,
        r.inspBatch, r.assay || '—', r.related || '—', r.moisture || '—', r.dissolve || '—', r.verdict || '—', r.note || '—']));
    } else {
      head = ['报告编号', '报告类型', '标题', '关联考察', '覆盖期间', '编制人', '时间', '状态', '结论'];
      this.filtered.forEach(r => lines.push([r.no, this.reportTypeMeta[r.type].name, r.title, r.studyNo,
        r.period, r.by, r.time, this.reportStatusMeta[r.status].name, r.conclusion || '—']));
    }
    const csv = '\uFEFF' + [head.join(',')].concat(lines.map(r => r.map(c => {
      const v = String(c == null ? '' : c);
      return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(','))).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const names = { chamber: '样品出入箱', trend: '稳定性结果汇总', report: '稳定性报告' };
    a.download = names[this.activeTab] + '_' + new Date().toISOString().substring(0, 10) + '.csv';
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
      <button class="pagination-btn" onclick="StabilityData.prevPage()" ${this.page <= 1 ? 'disabled' : ''}>‹</button>
      <span class="pagination-info">第 ${this.page} / ${pages} 页</span>
      <button class="pagination-btn" onclick="StabilityData.nextPage()" ${this.page >= pages ? 'disabled' : ''}>›</button>
      <select class="page-size-select" onchange="StabilityData.changePageSize(this.value)">
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
