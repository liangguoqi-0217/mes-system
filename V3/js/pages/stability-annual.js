// ===== 年度考察计划 =====
// 质量管理 → 稳定性管理 → 年度考察计划
//
// 定位：年度考察计划回答"这一年该做几批稳定性考察"，本身不是研究，是研究的来源清单。
//   · 一行 = 一个品种在某一年的考察要求（计划批数 N 批）；
//   · 每一批立项后生成一张「稳定性研究」主单，所以一行可以挂 N 张研究单；
//   · 状态由立项进度派生：未立项 → 部分立项 → 已立项；关联研究全部完成 → 已完成。
//
// 边界：
//   · 计划编号规则 AP-YYYY-NN，年度计划每年初由 QA 维护，MES 不做审批；
//   · 立项动作只做"预填一张研究草稿"，方案批准文号仍在研究单里登记；
//   · 计划取消必须填原因（如品种停产），已立项的研究不受影响，各自走研究单的状态机。
const StabilityAnnual = {
  page: 1,
  pageSize: 10,
  filtered: [],
  moreOpen: false,
  _ctx: {},

  statusMeta: {
    OPEN:      { name: '未立项',   badge: 'badge-gray' },
    PARTIAL:   { name: '部分立项', badge: 'badge-yellow' },
    CREATED:   { name: '已立项',   badge: 'badge-green' },
    CLOSED:    { name: '已完成',   badge: 'badge-gray' },
    CANCELLED: { name: '已取消',   badge: 'badge-red' }
  },

  typeMeta: {
    CONTINUOUS: { name: '持续考察' },
    POSTCHANGE: { name: '变更后' },
    PREMARKET:  { name: '上市前' }
  },

  plans: [
    { id: 'AP-2026-01', year: '2026', plant: '2001', materialCode: 'MAT-20002', materialName: '布洛芬缓释胶囊',
      spec: '0.3g', packSpec: '铝塑泡罩 12 粒/盒', type: 'CONTINUOUS', template: 'T1',
      conds: ['LT', 'AC'], months: [0, 3, 6, 9, 12, 18, 24, 36], batchCount: 3,
      startMonth: '2026-06', owner: '李工', studyNos: ['STB-26001', 'STB-26009'],
      remark: '第 1 批沿用 2025 年批次跨年取样，2026 年新立第 2 批，第 3 批待立项' },
    { id: 'AP-2026-02', year: '2026', plant: '2002', materialCode: 'MAT-30002', materialName: '丹红注射液',
      spec: '10ml', packSpec: '安瓿瓶 10 支/盒', type: 'CONTINUOUS', template: 'T2',
      conds: ['LT'], months: [0, 3, 6, 9, 12, 18, 24], batchCount: 2,
      startMonth: '2026-03', owner: '钱工', studyNos: [],
      remark: '2026 年度持续考察' },
    { id: 'AP-2026-03', year: '2026', plant: '2001', materialCode: 'MAT-20003', materialName: '稳心颗粒',
      spec: '9g', packSpec: '复合膜 9 袋/盒', type: 'CONTINUOUS', template: 'T1',
      conds: ['LT', 'AC'], months: [0, 3, 6, 9, 12, 18, 24], batchCount: 3,
      startMonth: '2026-05', owner: '周工', studyNos: [],
      remark: '' },
    { id: 'AP-2026-04', year: '2026', plant: '2002', materialCode: 'MAT-30005', materialName: '冠心宁注射液',
      spec: '2ml', packSpec: '安瓿瓶 10 支/盒', type: 'CONTINUOUS', template: 'T2',
      conds: ['LT'], months: [0, 3, 6, 9, 12, 18, 24], batchCount: 2,
      startMonth: '2026-04', owner: '钱工', studyNos: [], cancelled: true,
      cancelReason: '该品种 2026 年停产，年度考察取消（变更单 CHG-2026-0117）' },
    { id: 'AP-2026-05', year: '2026', plant: '2001', materialCode: 'MAT-20005', materialName: '脑心通胶囊',
      spec: '0.4g', packSpec: '铝塑泡罩 36 粒/盒', type: 'CONTINUOUS', template: 'T1',
      conds: ['LT', 'AC'], months: [0, 3, 6, 9, 12, 18, 24, 36], batchCount: 3,
      startMonth: '2026-08', owner: '李工', studyNos: [], remark: '' },
    { id: 'AP-2026-06', year: '2026', plant: '2003', materialCode: 'MAT-20006', materialName: '香菊胶囊',
      spec: '0.3g', packSpec: '铝塑泡罩 24 粒/盒', type: 'CONTINUOUS', template: 'T1',
      conds: ['LT'], months: [0, 3, 6, 9, 12, 18, 24], batchCount: 2,
      startMonth: '2026-09', owner: '赵工', studyNos: [], remark: '' },
    { id: 'AP-2026-07', year: '2026', plant: '2004', materialCode: 'MAT-20007', materialName: '盐酸二甲双胍缓释片',
      spec: '0.5g', packSpec: '铝塑泡罩 30 片/盒', type: 'CONTINUOUS', template: 'T1',
      conds: ['LT', 'AC'], months: [0, 3, 6, 9, 12, 18, 24], batchCount: 2,
      startMonth: '2026-10', owner: '孙工', studyNos: [], remark: '' },
    { id: 'AP-2026-08', year: '2026', plant: '2002', materialCode: 'MAT-30002', materialName: '丹红注射液',
      spec: '10ml', packSpec: '安瓿瓶 10 支/盒', type: 'POSTCHANGE', template: 'T2',
      conds: ['LT', 'AC'], months: [0, 3, 6, 9, 12, 18, 24, 36], batchCount: 3,
      startMonth: '2026-11', owner: '钱工', studyNos: [],
      remark: '变更后稳定性研究（新增包装规格），3 批' },
    { id: 'AP-2025-01', year: '2025', plant: '2001', materialCode: 'MAT-20002', materialName: '布洛芬缓释胶囊',
      spec: '0.3g', packSpec: '铝塑泡罩 12 粒/盒', type: 'CONTINUOUS', template: 'T1',
      conds: ['LT', 'AC'], months: [0, 3, 6, 9, 12, 18, 24, 36], batchCount: 2,
      startMonth: '2025-06', owner: '李工', studyNos: ['STB-25001'], closed: true, remark: '' },
    { id: 'AP-2025-02', year: '2025', plant: '2002', materialCode: 'MAT-30002', materialName: '丹红注射液',
      spec: '10ml', packSpec: '安瓿瓶 10 支/盒', type: 'CONTINUOUS', template: 'T2',
      conds: ['LT'], months: [0, 3, 6, 9, 12, 18, 24], batchCount: 2,
      startMonth: '2025-04', owner: '钱工', studyNos: ['STB-25006'], closed: true, remark: '' },
    { id: 'AP-2027-01', year: '2027', plant: '2001', materialCode: 'MAT-20003', materialName: '稳心颗粒',
      spec: '9g', packSpec: '复合膜 9 袋/盒', type: 'CONTINUOUS', template: 'T1',
      conds: ['LT', 'AC'], months: [0, 3, 6, 9, 12, 18, 24, 36], batchCount: 3,
      startMonth: '2027-03', owner: '周工', studyNos: [], remark: '次年计划，待 QA 确认批数' },
    { id: 'AP-2027-02', year: '2027', plant: '2002', materialCode: 'MAT-30005', materialName: '冠心宁注射液',
      spec: '2ml', packSpec: '安瓿瓶 10 支/盒', type: 'CONTINUOUS', template: 'T2',
      conds: ['LT'], months: [0, 3, 6, 9, 12, 18, 24], batchCount: 2,
      startMonth: '2027-05', owner: '钱工', studyNos: [], remark: '' }
  ],

  // ==================== 页面骨架 ====================

  render() {
    this.page = 1;
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div style="font-size:18px;font-weight:700;">年度考察计划</div>
          <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
            onclick="StabilityAnnual.openCreate()">+ 新增计划</button>
        </div>
        <div id="saFilterBar" style="flex-shrink:0;"></div>
        <div class="table-wrapper" id="saTableWrapper" style="flex:1;overflow:auto;width:100%;min-width:0;"></div>
        <div id="saPagination" style="flex-shrink:0;"></div>
      </div>`;
  },

  init() {
    this.renderFilterBar();
    if (window.QueryVariant) {
      QueryVariant.mount('stability-annual');
      QueryVariant.restore('stability-annual');
      QueryVariant.bindRecent('stability-annual');
    }
    this.renderTable();
    this.renderPagination();
  },

  refresh() {
    if (!document.getElementById('saTableWrapper')) return;
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
    if (window.QueryVariant) { QueryVariant.saveAuto('stability-annual'); QueryVariant.recordUsed('stability-annual'); }
  },

  toggleMore() { this.moreOpen = !this.moreOpen; this.renderFilterBar(); },

  plantName(code) {
    const p = (typeof StabilityPlan !== 'undefined' ? StabilityPlan.plantOptions : []).find(x => x.code === code);
    return p ? p.name : '';
  },

  condName(code) {
    const c = (typeof StabilityPlan !== 'undefined' ? StabilityPlan.condOptions : []).find(x => x.code === code);
    return c ? c.name : code;
  },

  get(id) { return this.plans.find(p => p.id === id); },

  // ==================== 状态派生 ====================

  statusOf(p) {
    if (p.cancelled) return 'CANCELLED';
    if (p.closed) return 'CLOSED';
    const n = (p.studyNos || []).length;
    if (n === 0) return 'OPEN';
    if (n >= p.batchCount) return 'CREATED';
    return 'PARTIAL';
  },

  // 关联研究全部完成 → 计划视为已完成（正常退出，不依赖手工标记）
  _syncedStatus(p) {
    const st = this.statusOf(p);
    if (st !== 'CREATED' || typeof StabilityPlan === 'undefined') return st;
    const all = (p.studyNos || []).map(no => StabilityPlan.studies.find(s => s.no === no)).filter(Boolean);
    if (all.length && all.every(s => s.status === 'COMPLETED' || s.status === 'CANCELLED')) return 'CLOSED';
    return st;
  },

  // ==================== 筛选栏 ====================

  renderFilterBar() {
    const el = document.getElementById('saFilterBar');
    if (!el) return;

    const years = [];
    this.plans.forEach(p => { if (years.indexOf(p.year) < 0) years.push(p.year); });
    years.sort().reverse();
    const yearOpts = years.map(y => `<option value="${y}">${y} 年</option>`).join('');
    const statusOpts = Object.keys(this.statusMeta).map(k => `<option value="${k}">${this.statusMeta[k].name}</option>`).join('');
    const plantOpts = (typeof StabilityPlan !== 'undefined' ? StabilityPlan.plantOptions : [])
      .map(p => `<option value="${p.code}">${p.code} ${p.name}</option>`).join('');
    const condOpts = (typeof StabilityPlan !== 'undefined' ? StabilityPlan.condOptions.slice(0, 3) : [])
      .map(c => `<option value="${c.code}">${c.name}</option>`).join('');

    const more = this.moreOpen ? `
      <div class="filter-group"><label>负责人</label><input type="text" id="saOwner" placeholder="如 李工"></div>
      <div class="filter-group"><label>考察条件</label><select id="saCond"><option value="">全部</option>${condOpts}</select></div>
      <div class="filter-group"><label>计划启动不晚于</label><input type="month" id="saStartMonth"></div>` : '';

    el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
      <div class="filter-group"><label>物料 / 计划编号</label><input type="text" id="saKeyword" placeholder="如 布洛芬 或 AP-2026-01"></div>
      <div class="filter-group"><label>年度</label><select id="saYear"><option value="">全部</option>${yearOpts}</select></div>
      <div class="filter-group"><label>状态</label><select id="saStatus"><option value="">全部</option>${statusOpts}</select></div>
      <div class="filter-group"><label>工厂</label><select id="saPlant"><option value="">全部</option>${plantOpts}</select></div>
      ${more}
      ${FilterActions.render({
        pageId: 'stability-annual',
        scope: 'StabilityAnnual',
        onExport: 'exportData',
        onMore: 'toggleMore',
        moreOpen: this.moreOpen
      })}
    </div>`;

    const yearSel = document.getElementById('saYear');
    if (yearSel && !yearSel.value) {
      const cur = String(new Date().getFullYear());
      if (years.indexOf(cur) >= 0) yearSel.value = cur;
    }
  },

  _apply() {
    const kw = this._val('saKeyword').toLowerCase();
    const year = this._val('saYear');
    const status = this._val('saStatus');
    const plant = this._val('saPlant');
    const owner = this._val('saOwner');
    const cond = this._val('saCond');
    const startMonth = this._val('saStartMonth');

    this.filtered = this.plans.filter(p => {
      if (year && p.year !== year) return false;
      if (plant && p.plant !== plant) return false;
      if (owner && String(p.owner).indexOf(owner) < 0) return false;
      if (cond && (p.conds || []).indexOf(cond) < 0) return false;
      if (startMonth && String(p.startMonth || '') > startMonth) return false;
      if (status && this._syncedStatus(p) !== status) return false;
      if (kw) {
        const hay = [p.id, p.year, p.materialCode, p.materialName, p.owner].join(' ').toLowerCase();
        if (hay.indexOf(kw) < 0) return false;
      }
      return true;
    });
  },

  // ==================== 列表 ====================

  renderTable() {
    const el = document.getElementById('saTableWrapper');
    if (!el) return;
    this._apply();

    if (!this.filtered.length) {
      el.innerHTML = `<div style="padding:48px 0;text-align:center;color:var(--text-muted);font-size:13px;">该条件下暂无年度考察计划</div>`;
      return;
    }

    const start = (this.page - 1) * this.pageSize;
    const rows = this.filtered.slice(start, start + this.pageSize);

    el.innerHTML = `<table class="data-table" style="min-width:1500px;">
      <thead><tr>
        <th style="width:50px;">序号</th>
        <th style="width:120px;">计划编号</th>
        <th style="width:70px;">年度</th>
        <th style="width:230px;">物料</th>
        <th style="width:110px;">研究类型</th>
        <th style="width:160px;">工厂</th>
        <th style="width:90px;">计划批次</th>
        <th style="width:140px;">考察条件</th>
        <th style="width:150px;">计划时间点</th>
        <th style="width:90px;">计划启动</th>
        <th style="width:90px;">负责人</th>
        <th style="width:110px;">状态</th>
        <th style="width:90px;">操作</th>
      </tr></thead>
      <tbody>${rows.map((p, i) => this._rowHtml(p, start + i + 1)).join('')}</tbody>
    </table>`;
  },

  _rowHtml(p, seq) {
    const st = this._syncedStatus(p);
    const sm = this.statusMeta[st];
    const done = (p.studyNos || []).length;
    const condHtml = (p.conds || []).map(c => {
      const cls = c === 'LT' ? 'badge-blue' : c === 'AC' ? 'badge-yellow' : 'badge-gray';
      return `<span class="badge ${cls} badge-sm" style="margin-right:4px;">${c}</span>`;
    }).join('');
    const months = (p.months || []).join('/');

    return `<tr>
      <td style="font-size:12px;color:var(--text-muted);">${seq}</td>
      <td style="font-family:monospace;font-size:12px;">${esc(p.id)}</td>
      <td style="font-size:12px;">${esc(p.year)}</td>
      <td style="font-size:13px;">${esc(p.materialName)}
        <div style="font-family:monospace;font-size:11px;color:var(--text-muted);">${esc(p.materialCode)}</div></td>
      <td style="font-size:12px;">${esc((this.typeMeta[p.type] || {}).name || p.type)}</td>
      <td style="font-size:12px;">${esc(p.plant)} ${esc(this.plantName(p.plant))}</td>
      <td style="font-size:12px;">${p.batchCount} 批${done ? `<div style="font-size:11px;color:var(--text-muted);">已立 ${done} 批</div>` : ''}</td>
      <td>${condHtml}</td>
      <td style="font-size:11.5px;color:var(--text-secondary);">${months} 月</td>
      <td style="font-size:12px;">${esc(p.startMonth || '—')}</td>
      <td style="font-size:12px;">${esc(p.owner)}</td>
      <td><span class="badge ${sm.badge}">${esc(sm.name)}</span></td>
      <td><button class="btn btn-blue btn-sm" onclick="StabilityAnnual.openDetail('${p.id}')">查看</button></td>
    </tr>`;
  },

  renderPagination() {
    const el = document.getElementById('saPagination');
    if (!el) return;
    const total = this.filtered.length;
    const pages = Math.max(1, Math.ceil(total / this.pageSize));
    let planBatches = 0, doneBatches = 0;
    this.filtered.forEach(p => {
      const st = this._syncedStatus(p);
      if (st === 'CANCELLED') return;
      planBatches += p.batchCount;
      doneBatches += (p.studyNos || []).length;
    });

    el.innerHTML = `<div class="pagination">
      <span style="color:var(--text-muted);font-size:12px;margin-right:12px;">共 ${total} 条 · 计划 ${planBatches} 批 · 已立项 ${doneBatches} 批</span>
      <button class="pagination-btn" onclick="StabilityAnnual.prevPage()" ${this.page <= 1 ? 'disabled' : ''}>‹</button>
      <span class="pagination-info">第 ${this.page} / ${pages} 页</span>
      <button class="pagination-btn" onclick="StabilityAnnual.nextPage()" ${this.page >= pages ? 'disabled' : ''}>›</button>
      <select class="page-size-select" onchange="StabilityAnnual.changePageSize(this.value)">
        ${[10, 20, 50].map(n => `<option value="${n}" ${n === this.pageSize ? 'selected' : ''}>${n}条/页</option>`).join('')}
      </select>
    </div>`;
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); this.renderPagination(); } },
  nextPage() {
    const pages = Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
    if (this.page < pages) { this.page++; this.renderTable(); this.renderPagination(); }
  },
  changePageSize(n) {
    this.pageSize = Number(n) || 10;
    this.page = 1;
    this.renderTable();
    this.renderPagination();
  },

  // ==================== 查看 ====================

  openDetail(id) {
    const p = this.get(id);
    if (!p) return;
    const st = this._syncedStatus(p);
    const sm = this.statusMeta[st];
    const done = (p.studyNos || []).length;
    this._ctx = { id: id };

    const studies = (p.studyNos || []).map(no => {
      const s = (typeof StabilityPlan !== 'undefined') ? StabilityPlan.studies.find(x => x.no === no) : null;
      const sst = s ? (StabilityPlan.masterStatusMeta[s.status] || {}).name || s.status : '历史研究（未在本系统）';
      return `<tr>
        <td style="font-family:monospace;font-size:12px;">${esc(no)}</td>
        <td style="font-size:12px;">${esc(s ? s.name : '—')}</td>
        <td style="font-size:12px;">${esc(s ? s.batchNo : '—')}</td>
        <td style="font-size:12px;">${esc(sst)}</td>
        <td>${s ? `<button class="btn btn-outline btn-sm" onclick="closeModal();StabilityPlan.openDetail('${s.id}')">打开研究</button>` : '—'}</td>
      </tr>`;
    }).join('');

    const body = `<div style="padding:2px 0;">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px 20px;">
        ${this._kv('计划编号', p.id)}
        ${this._kv('年度', p.year + ' 年')}
        ${this._kv('状态', `<span class="badge ${sm.badge}">${sm.name}</span>${done ? ` <span style="font-size:12px;color:var(--text-muted);">已立 ${done}/${p.batchCount} 批</span>` : ''}`)}
        ${this._kv('物料编码', p.materialCode)}
        ${this._kv('物料名称', p.materialName)}
        ${this._kv('工厂', p.plant + ' ' + this.plantName(p.plant))}
        ${this._kv('规格', p.spec || '—')}
        ${this._kv('上市包装', p.packSpec || '—')}
        ${this._kv('研究类型', (this.typeMeta[p.type] || {}).name || p.type)}
        ${this._kv('考察条件', (p.conds || []).map(c => this.condName(c)).join('、'))}
        ${this._kv('计划时间点', (p.months || []).join(' / ') + ' 月')}
        ${this._kv('计划启动', p.startMonth || '—')}
        ${this._kv('计划批次', p.batchCount + ' 批')}
        ${this._kv('负责人', p.owner)}
        ${this._kv('创建', '王计划 / 2025-12-18')}
      </div>

      ${p.cancelled ? `<div style="margin-top:14px;padding:10px 12px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;font-size:12.5px;color:#b91c1c;">
        取消原因：${esc(p.cancelReason || '—')}</div>` : ''}

      <div style="font-size:13px;font-weight:600;margin:18px 0 8px;">关联研究</div>
      ${studies ? `<table class="data-table" style="min-width:800px;">
        <thead><tr><th style="width:130px;">研究编号</th><th>研究名称</th><th style="width:150px;">生产批次</th><th style="width:100px;">状态</th><th style="width:110px;">操作</th></tr></thead>
        <tbody>${studies}</tbody></table>`
        : `<div style="padding:18px 0;text-align:center;color:var(--text-muted);font-size:12.5px;">尚未立项</div>`}

      ${p.remark ? `<div style="margin-top:14px;font-size:12.5px;color:var(--text-secondary);">计划说明：${esc(p.remark)}</div>` : ''}
    </div>`;

    showModal('年度考察计划 — ' + p.id, body, this._detailFooter(p, st), 'modal-lg');
  },

  _kv(label, valueHtml) {
    return `<div><div style="font-size:11.5px;color:var(--text-muted);margin-bottom:3px;">${esc(label)}</div>
      <div style="font-size:13px;">${valueHtml}</div></div>`;
  },

  _detailFooter(p, st) {
    const btns = [];
    if (st === 'OPEN' || st === 'PARTIAL') {
      btns.push({ text: '立项（第 ' + ((p.studyNos || []).length + 1) + ' 批）', cls: 'btn-primary',
        action: () => { closeModal(); StabilityPlan.openCreateForm('annual', p.id); } });
    }
    if (st !== 'CANCELLED' && st !== 'CLOSED') {
      btns.push({ text: '取消计划', cls: 'btn-secondary', action: () => { StabilityAnnual.openCancel(p.id); } });
    }
    btns.push({ text: '关闭', cls: 'btn-secondary', action: closeModal });
    return btns;
  },

  openCancel(id) {
    const p = this.get(id);
    if (!p) return;
    showModal('取消年度计划 — ' + p.id, `
      <div style="padding:4px 0;font-size:13px;color:var(--text-secondary);margin-bottom:12px;">
        取消后该计划不再参与立项统计，已生成的研究单不受影响。
      </div>
      <div class="form-group"><label>取消原因 <span class="req">*</span></label>
        <textarea id="saCancelReason" rows="3" placeholder="如 该品种停产 / 年度考察调整，注明依据的变更单号"></textarea></div>`,
    [
      { text: '返回', cls: 'btn-secondary', action: () => { closeModal(); StabilityAnnual.openDetail(id); } },
      { text: '确认取消', cls: 'btn-primary', action: () => {
        const reason = StabilityAnnual._val('saCancelReason');
        if (!reason) return toast('请填写取消原因');
        p.cancelled = true;
        p.cancelReason = reason;
        closeModal();
        StabilityAnnual.renderTable();
        StabilityAnnual.renderPagination();
        toast('计划已取消');
      } }
    ], 'modal-md');
  },

  // ==================== 新增计划 ====================

  openCreate() {
    const plantOpts = StabilityPlan.plantOptions.map(p => `<option value="${p.code}">${p.code} ${p.name}</option>`).join('');
    const typeOpts = Object.keys(this.typeMeta).map(k => `<option value="${k}" ${k === 'CONTINUOUS' ? 'selected' : ''}>${this.typeMeta[k].name}</option>`).join('');
    const tplOpts = StabilityPlan.templates.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    const condRows = StabilityPlan.condOptions.map(c => `<label style="display:flex;align-items:center;gap:6px;font-size:13px;margin-right:16px;">
      <input type="checkbox" name="apCond" value="${c.code}" ${c.code === 'LT' || c.code === 'AC' ? 'checked' : ''}> ${esc(c.name)}
    </label>`).join('');
    const monthChips = [0, 3, 6, 9, 12, 18, 24, 36].map(m => `<label style="display:inline-flex;align-items:center;gap:4px;border:1px solid #e5e7eb;border-radius:12px;padding:3px 10px;font-size:12px;margin-right:6px;">
      <input type="checkbox" name="apMonth" value="${m}" ${[0, 3, 6, 9, 12, 18, 24, 36].indexOf(m) >= 0 ? 'checked' : ''}> ${m} 月
    </label>`).join('');

    showModal('新增年度考察计划', `<div style="padding:2px 0;">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px 20px;margin-bottom:16px;">
        <div class="form-group"><label>年度 <span class="req">*</span></label>
          <select id="apYear">${['2026', '2027', '2028'].map(y => `<option value="${y}">${y} 年</option>`).join('')}</select></div>
        <div class="form-group"><label>计划启动 <span class="req">*</span></label><input type="month" id="apStartMonth" value="2026-06"></div>
        <div class="form-group"><label>负责人</label><input type="text" id="apOwner" value="李工"></div>
        <div class="form-group"><label>工厂 <span class="req">*</span></label><select id="apPlant">${plantOpts}</select></div>
        <div class="form-group"><label>物料编码 <span class="req">*</span></label><input type="text" id="apMatCode" placeholder="如 MAT-20002"></div>
        <div class="form-group"><label>物料名称 <span class="req">*</span></label><input type="text" id="apMatName"></div>
        <div class="form-group"><label>规格</label><input type="text" id="apSpec"></div>
        <div class="form-group"><label>上市包装</label><input type="text" id="apPack"></div>
        <div class="form-group"><label>研究类型</label><select id="apType">${typeOpts}</select></div>
        <div class="form-group"><label>计划批次 <span class="req">*</span></label><input type="number" id="apBatchCount" value="3" min="1"></div>
        <div class="form-group" style="grid-column:span 2;"><label>剂型模板（带出时间点与检验项目）</label><select id="apTemplate">${tplOpts}</select></div>
      </div>
      <div style="font-size:13px;font-weight:600;margin-bottom:8px;">考察条件</div>
      <div style="margin-bottom:16px;">${condRows}</div>
      <div style="font-size:13px;font-weight:600;margin-bottom:8px;">计划时间点（月）</div>
      <div style="margin-bottom:16px;">${monthChips}</div>
      <div class="form-group"><label>计划说明</label><input type="text" id="apRemark" placeholder="如 变更后稳定性研究，或品种停产需说明"></div>
    </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '保存', cls: 'btn-primary', action: () => { StabilityAnnual.save(); } }
    ], 'modal-xl');
  },

  save() {
    const year = this._val('apYear');
    const matCode = this._val('apMatCode');
    const matName = this._val('apMatName');
    const startMonth = this._val('apStartMonth');
    const conds = Array.prototype.slice.call(document.querySelectorAll('input[name="apCond"]:checked')).map(x => x.value);
    const months = Array.prototype.slice.call(document.querySelectorAll('input[name="apMonth"]:checked'))
      .map(x => Number(x.value)).sort((a, b) => a - b);

    if (!matCode || !matName) return toast('请填写物料编码与名称');
    if (!startMonth) return toast('请填写计划启动月份');
    if (!conds.length) return toast('请至少选择一个考察条件');
    if (!months.length) return toast('请至少选择一个时间点');

    const seq = this.plans.filter(p => p.year === year).length + 1;
    const plan = {
      id: 'AP-' + year + '-' + String(seq).padStart(2, '0'),
      year: year, plant: this._val('apPlant'),
      materialCode: matCode, materialName: matName,
      spec: this._val('apSpec'), packSpec: this._val('apPack'),
      type: this._val('apType'), template: this._val('apTemplate'),
      conds: conds, months: months,
      batchCount: Number(this._val('apBatchCount')) || 1,
      startMonth: startMonth, owner: this._val('apOwner'),
      studyNos: [], remark: this._val('apRemark')
    };

    this.plans.unshift(plan);
    closeModal();
    this.moreOpen = false;
    this.search();
    toast('年度计划已创建：' + plan.id);
  },

  // ==================== 对外：立项回写 ====================

  // 由稳定性研究 saveCreate 调用：把新研究挂回计划
  addStudy(planId, studyNo) {
    const p = this.get(planId);
    if (!p || !studyNo) return;
    p.studyNos = p.studyNos || [];
    if (p.studyNos.indexOf(studyNo) < 0) p.studyNos.push(studyNo);
    if (typeof this.refresh === 'function') this.refresh();
  },

  // 供稳定性研究的「从年度考察计划」选择：只出未立满的计划
  openPlans() {
    return this.plans.filter(p => {
      const st = this._syncedStatus(p);
      return st === 'OPEN' || st === 'PARTIAL';
    });
  },

  // ==================== 导出 ====================

  exportData() {
    this._apply();
    const head = ['计划编号', '年度', '物料编码', '物料名称', '工厂', '研究类型', '计划批次', '已立项批次', '考察条件', '计划时间点', '计划启动', '负责人', '状态'];
    const lines = [head.join(',')];
    this.filtered.forEach(p => {
      const st = this._syncedStatus(p);
      lines.push([p.id, p.year, p.materialCode, p.materialName, this.plantName(p.plant),
        (this.typeMeta[p.type] || {}).name || p.type, p.batchCount, (p.studyNos || []).length,
        (p.conds || []).join('/'), (p.months || []).join('/'), p.startMonth, p.owner, this.statusMeta[st].name]
        .map(v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"').join(','));
    });
    const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '年度考察计划_' + new Date().toISOString().substring(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    toast('已导出 ' + this.filtered.length + ' 条');
  }
};

// ==================== 查询变式 ====================

if (window.QueryVariant) {
  QueryVariant.register({
    pageId: 'stability-annual',
    fields: ['saKeyword', 'saYear', 'saStatus', 'saPlant', 'saOwner', 'saCond', 'saStartMonth'],
    textFields: ['saKeyword', 'saOwner'],
    labels: {
      saKeyword: '物料/计划编号', saYear: '年度', saStatus: '状态', saPlant: '工厂',
      saOwner: '负责人', saCond: '考察条件', saStartMonth: '计划启动'
    },
    onApply: function () { StabilityAnnual.search(); }
  });
}
