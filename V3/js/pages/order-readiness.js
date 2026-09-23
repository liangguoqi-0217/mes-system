/* ==================== 生产管理 → 订单齐套检查 ====================
 * 业务背景：SAP 将流程订单下发 MES，车间用户受权限控制只能查看本车间的订单。
 * 本页按「计划开始日」筛选订单，拆解订单预留（BOM）计算未清需求，
 * 与可用库存对比，判断物料是否齐套。
 *
 * 已确认口径：
 *   1. BOM 随订单下发生成 = 订单预留（components）
 *   2. 库存口径：单个工厂、全库位合计
 *   3. 需求口径：未清需求 = 需求数量 - 已投料数量（扣减已投料）
 *   4. 多车间竞争：A 方案 —— 同时展示「本车间需求」与「全厂总需求」，不做扣减分配
 *   5. 日期基准：订单计划开始日 startDate（今日 / 本周 / 本月 / 自定义）
 *   6. 可用库存 = 非限制库存 + 质检库存
 *
 * 权限：车间视角锁定 workCenter，仅汇总本车间订单；全厂视角可查看全部车间。
 *       车间视角下「全厂总需求」仅展示汇总数字，不暴露其他车间订单明细。
 * ============================================================ */

/* ---------- 主数据 ---------- */

const OR_WORKCENTER_TEXT = {
  'WC-PROD-01': '制剂车间',
  'WC-PROD-02': '压片车间',
  'WC-PROD-03': '包装车间',
  'WC-WT-01': '水系统车间'
};

const OR_PLANT_TEXT = { '1000': '山东步长制药工厂', '2001': '陕西步长制药工厂' };

// 当前登录用户（权限模拟）。isPlantLevel=false 时锁定本车间。
const OR_CURRENT_USER = {
  name: '车间用户A',
  plant: '1000',
  workCenter: 'WC-PROD-01',
  isPlantLevel: false
};

/* ---------- 日期工具（以运行当天为基准，保证「今日/本周/本月」始终有数据） ---------- */

function orFmt(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + m + '-' + day;
}
function orAddDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return orFmt(d); }
function orRangeToday() { const t = orFmt(new Date()); return { from: t, to: t }; }
function orRangeWeek() {
  const d = new Date();
  const wd = d.getDay() === 0 ? 7 : d.getDay();
  const mon = new Date(d); mon.setDate(d.getDate() - (wd - 1));
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  return { from: orFmt(mon), to: orFmt(sun) };
}
function orRangeMonth() {
  const d = new Date();
  return { from: orFmt(new Date(d.getFullYear(), d.getMonth(), 1)), to: orFmt(new Date(d.getFullYear(), d.getMonth() + 1, 0)) };
}

/* ---------- 流程订单（含预留 BOM，原型 mock 数据） ---------- */

const OR_ORDERS = [
  {
    no: '3000000123', name: '阿莫西林颗粒制剂', plant: '1000', workCenter: 'WC-PROD-01',
    startDate: orAddDays(0), endDate: orAddDays(8), qty: '1200', unit: 'KG', status: 'REL', statusName: '已下达',
    components: [
      { mat: 'MAT-10001', name: '阿莫西林原料药', reqQty: 600, unit: 'KG', issuedQty: 0 },
      { mat: 'MAT-10002', name: '淀粉辅料', reqQty: 300, unit: 'KG', issuedQty: 0 },
      { mat: 'MAT-10003', name: '硬脂酸镁', reqQty: 5, unit: 'KG', issuedQty: 0 },
      { mat: 'MAT-10005', name: '胶囊壳#0', reqQty: 500000, unit: 'EA', issuedQty: 0 }
    ]
  },
  {
    no: '3000000145', name: '维生素C片', plant: '1000', workCenter: 'WC-PROD-02',
    startDate: orAddDays(0), endDate: orAddDays(6), qty: '800', unit: 'KG', status: 'REL', statusName: '已下达',
    components: [
      { mat: 'MAT-10004', name: '维生素C原料', reqQty: 150, unit: 'KG', issuedQty: 0 },
      { mat: 'MAT-10002', name: '淀粉辅料', reqQty: 200, unit: 'KG', issuedQty: 0 }
    ]
  },
  {
    no: '3000000167', name: '阿莫西林胶囊包装', plant: '1000', workCenter: 'WC-PROD-01',
    startDate: orAddDays(2), endDate: orAddDays(9), qty: '500', unit: 'KG', status: 'REL', statusName: '已下达',
    components: [
      { mat: 'MAT-10005', name: '胶囊壳#0', reqQty: 300000, unit: 'EA', issuedQty: 0 },
      { mat: 'MAT-10001', name: '阿莫西林原料药', reqQty: 400, unit: 'KG', issuedQty: 100 }
    ]
  },
  {
    no: '3000000189', name: '注射用水配制', plant: '1000', workCenter: 'WC-WT-01',
    startDate: orAddDays(3), endDate: orAddDays(5), qty: '5000', unit: 'L', status: 'REL', statusName: '已下达',
    components: [
      { mat: 'MAT-20001', name: '注射用水', reqQty: 5000, unit: 'L', issuedQty: 0 }
    ]
  },
  {
    no: '3000000192', name: '维生素C片（第二批）', plant: '1000', workCenter: 'WC-PROD-02',
    startDate: orAddDays(7), endDate: orAddDays(13), qty: '900', unit: 'KG', status: 'CRTD', statusName: '已创建',
    components: [
      { mat: 'MAT-10004', name: '维生素C原料', reqQty: 230, unit: 'KG', issuedQty: 0 }
    ]
  }
];

/* ---------- 库存（单工厂全库位合计：非限制 + 质检 = 可用） ---------- */

const OR_STOCK = {
  '1000|MAT-10001': { name: '阿莫西林原料药', unit: 'KG', unrestricted: 800, quality: 200 },
  '1000|MAT-10002': { name: '淀粉辅料', unit: 'KG', unrestricted: 400, quality: 50 },
  '1000|MAT-10003': { name: '硬脂酸镁', unit: 'KG', unrestricted: 3, quality: 0 },
  '1000|MAT-10004': { name: '维生素C原料', unit: 'KG', unrestricted: 100, quality: 0 },
  '1000|MAT-10005': { name: '胶囊壳#0', unit: 'EA', unrestricted: 600000, quality: 0 },
  '1000|MAT-20001': { name: '注射用水', unit: 'L', unrestricted: 3000, quality: 200 }
};

/* ==================== 页面对象 ==================== */

const OrderReadiness = {
  page: 1, pageSize: 10,
  view: 'mat',              // mat=物料维度（主视图） / order=订单维度（辅视图）
  moreOpen: false,
  rangeKind: 'week',
  matRows: [], orderRows: [],

  /* ==================== 渲染 ==================== */

  render() {
    const viewTip = OR_CURRENT_USER.isPlantLevel
      ? '全厂用户'
      : OR_WORKCENTER_TEXT[OR_CURRENT_USER.workCenter] + '（' + OR_CURRENT_USER.name + '）';
    return `
      <div class="or-page" style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">订单齐套检查</div>
            <div style="font-size:12px;opacity:0.85;margin-top:2px;">
              当前视角：<b id="orViewTip">${esc(viewTip)}</b>
              <span style="opacity:0.7;"> · 可用库存 = 非限制 + 质检（单工厂全库位合计）</span>
            </div>
          </div>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.25);" onclick="OrderReadiness.toggleView()">切换视角</button>
        </div>

        <div id="orFilterBar" style="flex-shrink:0;"></div>

        <style>
          #orTableWrapper { scrollbar-width: thin; scrollbar-color: rgba(203,213,225,0.6) transparent; }
          #orTableWrapper::-webkit-scrollbar { width: 6px; height: 0; }
          #orTableWrapper::-webkit-scrollbar-thumb { background: rgba(203,213,225,0.6); border-radius: 3px; }
          #orTableWrapper::-webkit-scrollbar-track { background: transparent; }
          .or-tabs { display:flex;align-items:center;gap:2px;padding:0 24px;background:#fff;border-bottom:1px solid var(--border);flex-shrink:0; }
          .or-tab { padding:8px 16px;font-size:13px;cursor:pointer;color:var(--text-secondary);border-bottom:2px solid transparent; }
          .or-tab.active { color:var(--primary);font-weight:600;border-bottom-color:var(--primary); }
          .or-detail { background:#fafbfc; }
        </style>

        <div class="or-tabs" id="orTabs"></div>
        <div class="table-wrapper" style="flex:1;overflow:auto;width:100%;min-width:0;" id="orTableWrapper"></div>
        <div id="orPagination" style="flex-shrink:0;"></div>
      </div>`;
  },

  init() {
    this.renderFilterBar();
    if (window.QueryVariant) {
      QueryVariant.mount('order-readiness');
      QueryVariant.restore('order-readiness');
      QueryVariant.bindRecent('order-readiness');
    }
    // 变式未回填日期时才用默认范围，避免覆盖用户保存的条件
    if (!this._val('orDateFrom')) this.setRange('week', true);
    this.search();
  },

  /* ==================== 筛选栏 ==================== */

  renderFilterBar() {
    const el = document.getElementById('orFilterBar');
    if (!el) return;
    const isPlant = OR_CURRENT_USER.isPlantLevel;
    const plantOpts = Object.keys(OR_PLANT_TEXT)
      .map(k => '<option value="' + k + '">' + k + ' ' + OR_PLANT_TEXT[k] + '</option>').join('');
    const wcOpts = Object.keys(OR_WORKCENTER_TEXT)
      .map(k => '<option value="' + k + '">' + OR_WORKCENTER_TEXT[k] + '</option>').join('');

    el.innerHTML = `
      <div class="filter-bar" style="flex-wrap:wrap;">
        <div class="filter-group"><label>工厂</label>
          <select id="orPlant"${isPlant ? '' : ' disabled'}>
            ${isPlant ? plantOpts : '<option value="' + OR_CURRENT_USER.plant + '">' + OR_CURRENT_USER.plant + ' ' + OR_PLANT_TEXT[OR_CURRENT_USER.plant] + '</option>'}
          </select>
        </div>
        <div class="filter-group"><label>计划开始日</label>
          <div style="display:flex;align-items:center;gap:4px;">
            <input type="date" id="orDateFrom"><span style="color:var(--text-muted);">~</span><input type="date" id="orDateTo">
          </div>
        </div>
        <div class="filter-group"><label>快捷范围</label>
          <div style="display:flex;gap:4px;">
            <button class="btn btn-secondary btn-sm" id="orQuick_today" onclick="OrderReadiness.setRange('today')">今日</button>
            <button class="btn btn-secondary btn-sm" id="orQuick_week" onclick="OrderReadiness.setRange('week')">本周</button>
            <button class="btn btn-secondary btn-sm" id="orQuick_month" onclick="OrderReadiness.setRange('month')">本月</button>
          </div>
        </div>
        <div class="filter-group"><label>齐套状态</label>
          <select id="orGapStatus">
            <option value="all">全部</option>
            <option value="short">仅缺料</option>
            <option value="ok">仅齐套</option>
          </select>
        </div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="OrderReadiness.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="OrderReadiness.exportData()">导出</button>
          <button class="btn btn-secondary btn-sm" onclick="OrderReadiness.refresh()">刷新</button>
          <button class="btn btn-secondary btn-sm" onclick="OrderReadiness.resetFilter()">重置</button>
          <button class="btn btn-secondary btn-sm" id="orMoreBtn" onclick="OrderReadiness.toggleMore()">${this.moreOpen ? '收起 ▴' : '更多条件 ▾'}</button>
        </div>
        <div id="orMoreBar" style="display:${this.moreOpen ? 'flex' : 'none'};flex-wrap:wrap;gap:12px;width:100%;padding:0;border:none;background:transparent;">
          <div class="filter-group"><label>流程订单号</label><input type="text" id="orOrderNo" placeholder="如 3000000123"></div>
          <div class="filter-group"><label>物料号/描述</label><input type="text" id="orMatCode" placeholder="物料编码或名称"></div>
          <div class="filter-group"><label>车间</label>
            <select id="orWorkCenter"${isPlant ? '' : ' disabled'}>
              ${isPlant
                ? '<option value="">全部车间</option>' + wcOpts
                : '<option value="' + OR_CURRENT_USER.workCenter + '">' + OR_WORKCENTER_TEXT[OR_CURRENT_USER.workCenter] + '</option>'}
            </select>
          </div>
          <div class="filter-group"><label>订单状态</label>
            <select id="orOrderStatus">
              <option value="">全部</option>
              <option value="REL">已下达</option>
              <option value="CRTD">已创建</option>
              <option value="TECO">技术性完成</option>
            </select>
          </div>
        </div>
      </div>`;
  },

  toggleMore() {
    this.moreOpen = !this.moreOpen;
    const bar = document.getElementById('orMoreBar');
    if (bar) bar.style.display = this.moreOpen ? 'flex' : 'none';
    const btn = document.getElementById('orMoreBtn');
    if (btn) btn.textContent = this.moreOpen ? '收起 ▴' : '更多条件 ▾';
  },

  setRange(kind, silent) {
    this.rangeKind = kind;
    let r;
    if (kind === 'today') r = orRangeToday();
    else if (kind === 'month') r = orRangeMonth();
    else r = orRangeWeek();
    const f = document.getElementById('orDateFrom');
    const t = document.getElementById('orDateTo');
    if (f) f.value = r.from;
    if (t) t.value = r.to;
    ['today', 'week', 'month'].forEach(k => {
      const b = document.getElementById('orQuick_' + k);
      if (b) b.className = 'btn btn-sm ' + (k === kind ? 'btn-primary' : 'btn-secondary');
    });
    if (!silent) this.search();
  },

  _val(id) {
    const e = document.getElementById(id);
    return e ? String(e.value || '').trim() : '';
  },

  /* ==================== 核心计算 ==================== */

  search() {
    this.page = 1;
    this.compute();
    this.renderTabs();
    this.renderTable();
    this.renderPagination();
  },

  compute() {
    const plant = this._val('orPlant') || OR_CURRENT_USER.plant;
    const from = this._val('orDateFrom');
    const to = this._val('orDateTo');
    const orderKey = this._val('orOrderNo').toLowerCase();
    const matKey = this._val('orMatCode').toLowerCase();
    const statusSel = this._val('orOrderStatus');
    const gapSel = this._val('orGapStatus') || 'all';
    const wcSel = this._val('orWorkCenter');

    // 权限：车间视角锁定本车间；全厂视角按下拉（空=全部车间）
    const isPlant = OR_CURRENT_USER.isPlantLevel;
    const myWc = isPlant ? (wcSel || '') : OR_CURRENT_USER.workCenter;

    // 1. 工厂 + 日期 + 订单号 + 状态过滤
    const inRange = OR_ORDERS.filter(o => {
      if (o.plant !== plant) return false;
      if (from && o.startDate < from) return false;
      if (to && o.startDate > to) return false;
      if (orderKey && (o.no + o.name).toLowerCase().indexOf(orderKey) === -1) return false;
      if (statusSel && o.status !== statusSel) return false;
      return true;
    });

    // 2. 权限过滤：本车间订单
    const myOrders = myWc ? inRange.filter(o => o.workCenter === myWc) : inRange;

    // 3. 需求汇总：未清需求 = 需求 - 已投料
    const myMap = new Map();
    const allMap = new Map();
    const push = (map, o, c, withRef) => {
      const open = (c.reqQty || 0) - (c.issuedQty || 0);
      if (open <= 0) return;
      const cur = map.get(c.mat) || { open: 0, refs: [] };
      cur.open += open;
      if (withRef) cur.refs.push({ no: o.no, name: o.name, wc: o.workCenter, req: c.reqQty, issued: c.issuedQty || 0, open: open });
      map.set(c.mat, cur);
    };
    myOrders.forEach(o => o.components.forEach(c => push(myMap, o, c, true)));
    inRange.forEach(o => o.components.forEach(c => push(allMap, o, c, false)));

    const stockOf = (mat) => {
      const s = OR_STOCK[plant + '|' + mat];
      if (!s) return { stock: 0, unrestricted: 0, quality: 0, unit: '', name: '' };
      return {
        stock: (s.unrestricted || 0) + (s.quality || 0),
        unrestricted: s.unrestricted || 0,
        quality: s.quality || 0,
        unit: s.unit || '',
        name: s.name || ''
      };
    };

    // 4. 物料维度行
    let rows = [];
    myMap.forEach((d, mat) => {
      const st = stockOf(mat);
      const gap = d.open - st.stock;   // >0 表示缺料
      rows.push({
        mat: mat,
        name: (d.refs[0] && d.refs[0].name) || st.name || '',
        unit: (d.refs[0] && d.refs[0].unit) || st.unit || '',
        myDemand: d.open,
        allDemand: allMap.has(mat) ? allMap.get(mat).open : d.open,
        stock: st.stock,
        unrestricted: st.unrestricted,
        quality: st.quality,
        gap: gap,
        status: gap > 0 ? 'short' : 'ok',
        refs: d.refs
      });
    });

    if (matKey) rows = rows.filter(r => (r.mat + r.name).toLowerCase().indexOf(matKey) !== -1);
    if (gapSel === 'short') rows = rows.filter(r => r.status === 'short');
    if (gapSel === 'ok') rows = rows.filter(r => r.status === 'ok');
    // 缺料优先，缺口大的优先
    rows.sort((a, b) => {
      if (a.status !== b.status) return a.status === 'short' ? -1 : 1;
      return b.gap - a.gap;
    });
    this.matRows = rows;

    // 5. 订单维度行（库存取全量，不做跨订单分配 —— A 方案）
    this.orderRows = myOrders.map(o => {
      const items = o.components.map(c => {
        const open = (c.reqQty || 0) - (c.issuedQty || 0);
        const st = stockOf(c.mat);
        return {
          mat: c.mat, name: c.name, unit: c.unit,
          req: c.reqQty || 0, issued: c.issuedQty || 0, open: open,
          stock: st.stock, gap: open - st.stock
        };
      });
      const shortCount = items.filter(i => i.gap > 0).length;
      return {
        no: o.no, name: o.name, plant: o.plant, workCenter: o.workCenter,
        startDate: o.startDate, endDate: o.endDate, qty: o.qty, unit: o.unit,
        statusName: o.statusName, items: items,
        total: items.length, shortCount: shortCount, okCount: items.length - shortCount,
        status: shortCount === 0 ? 'ok' : 'short'
      };
    });
    this.orderRows.sort((a, b) => {
      if (a.status !== b.status) return a.status === 'short' ? -1 : 1;
      return b.shortCount - a.shortCount;
    });
  },

  /* ==================== 视图切换 ==================== */

  renderTabs() {
    const el = document.getElementById('orTabs');
    if (!el) return;
    el.innerHTML = `
      <div class="or-tab ${this.view === 'mat' ? 'active' : ''}" onclick="OrderReadiness.switchView('mat')">
        物料维度<span class="badge badge-gray" style="margin-left:6px;">${this.matRows.length}</span></div>
      <div class="or-tab ${this.view === 'order' ? 'active' : ''}" onclick="OrderReadiness.switchView('order')">
        订单维度<span class="badge badge-gray" style="margin-left:6px;">${this.orderRows.length}</span></div>
      <div style="margin-left:auto;font-size:12px;color:var(--text-muted);">
        ${this.view === 'mat'
          ? '按物料汇总：本车间需求 vs 可用库存；「全厂总需求」用于判断跨车间竞争'
          : '按订单查看：逐项对比组件需求与可用库存'}
      </div>`;
  },

  switchView(v) {
    this.view = v;
    this.page = 1;
    this.renderTabs();
    this.renderTable();
    this.renderPagination();
  },

  renderTable() {
    const el = document.getElementById('orTableWrapper');
    if (!el) return;
    el.innerHTML = this.view === 'order' ? this._orderTable() : this._matTable();
  },

  _fmt(n) {
    if (n === null || n === undefined || n === '') return '-';
    return Number(n).toLocaleString('zh-CN', { maximumFractionDigits: 3 });
  },

  /* ==================== 物料维度（主视图） ==================== */

  _matTable() {
    const rows = this.matRows;
    if (!rows.length) {
      return '<div style="padding:40px;text-align:center;color:var(--text-muted);">当前条件下没有需要检查的物料</div>';
    }
    const start = (this.page - 1) * this.pageSize;
    const page = rows.slice(start, start + this.pageSize);

    const body = page.map((r, i) => {
      const idx = start + i + 1;
      const short = r.status === 'short';
      const gapCell = short
        ? '<span style="color:var(--danger);font-weight:700;">-' + this._fmt(r.gap) + '</span>'
        : '<span style="color:var(--text-muted);">0</span>';
      const detailId = 'orRef_' + idx;
      return `
      <tr>
        <td>${idx}</td>
        <td style="font-family:monospace;font-size:12px;">${esc(r.mat)}</td>
        <td>${esc(r.name)}</td>
        <td>${esc(r.unit)}</td>
        <td style="text-align:right;">${this._fmt(r.myDemand)}</td>
        <td style="text-align:right;color:var(--text-secondary);">${this._fmt(r.allDemand)}</td>
        <td style="text-align:right;" title="非限制 ${this._fmt(r.unrestricted)} + 质检 ${this._fmt(r.quality)}">${this._fmt(r.stock)}</td>
        <td style="text-align:right;">${gapCell}</td>
        <td style="text-align:center;">${short ? '<span class="badge badge-red badge-sm">缺料</span>' : '<span class="badge badge-green badge-sm">齐套</span>'}</td>
        <td style="text-align:center;"><span style="color:var(--primary);cursor:pointer;" onclick="OrderReadiness.toggleRef('${detailId}')">${r.refs.length} 单 ▸</span></td>
      </tr>
      <tr class="or-detail" id="${detailId}" style="display:none;">
        <td colspan="10" style="padding:8px 16px;">
          <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">本车间订单需求明细（未清需求 = 需求 − 已投料）</div>
          <table class="data-table data-table-compact">
            <thead><tr>
              <th>流程订单号</th><th>订单名称</th><th>车间</th>
              <th style="text-align:right;">需求</th><th style="text-align:right;">已投料</th><th style="text-align:right;">未清需求</th>
            </tr></thead>
            <tbody>${r.refs.map(f => '<tr>' +
              '<td style="font-family:monospace;font-size:12px;">' + esc(f.no) + '</td>' +
              '<td>' + esc(f.name) + '</td>' +
              '<td>' + esc(OR_WORKCENTER_TEXT[f.wc] || f.wc) + '</td>' +
              '<td style="text-align:right;">' + this._fmt(f.req) + '</td>' +
              '<td style="text-align:right;">' + this._fmt(f.issued) + '</td>' +
              '<td style="text-align:right;font-weight:600;">' + this._fmt(f.open) + '</td>' +
            '</tr>').join('')}</tbody>
          </table>
        </td>
      </tr>`;
    }).join('');

    return `<table class="data-table">
      <thead><tr>
        <th style="width:50px;">序号</th>
        <th>物料号</th><th>物料描述</th><th style="width:60px;">单位</th>
        <th style="text-align:right;" title="当前视角车间订单对该物料的未清需求合计">本车间需求量</th>
        <th style="text-align:right;" title="该工厂全部车间订单的未清需求合计，用于判断跨车间竞争">全厂总需求</th>
        <th style="text-align:right;" title="可用库存 = 非限制 + 质检（单工厂全库位合计）">可用库存 <span style="color:#94a3b8;cursor:help;">ⓘ</span></th>
        <th style="text-align:right;">缺口</th>
        <th style="width:90px;text-align:center;">状态</th>
        <th style="width:100px;text-align:center;">关联订单</th>
      </tr></thead>
      <tbody>${body}</tbody>
    </table>`;
  },

  /* ==================== 订单维度（辅视图） ==================== */

  _orderTable() {
    const rows = this.orderRows;
    if (!rows.length) {
      return '<div style="padding:40px;text-align:center;color:var(--text-muted);">当前条件下没有流程订单</div>';
    }
    const start = (this.page - 1) * this.pageSize;
    const page = rows.slice(start, start + this.pageSize);

    const body = page.map((o, i) => {
      const idx = start + i + 1;
      const short = o.status === 'short';
      const detailId = 'orOrder_' + o.no;
      return `
      <tr>
        <td>${idx}</td>
        <td style="font-family:monospace;font-size:12px;font-weight:600;color:#2563eb;">${esc(o.no)}</td>
        <td>${esc(o.name)}</td>
        <td>${esc(OR_WORKCENTER_TEXT[o.workCenter] || o.workCenter)}</td>
        <td>${esc(o.startDate)}</td>
        <td style="text-align:right;">${esc(o.qty)} ${esc(o.unit)}</td>
        <td style="text-align:center;">${o.okCount} / ${o.total}</td>
        <td style="text-align:center;">${short ? '<span style="color:var(--danger);font-weight:700;">' + o.shortCount + '</span>' : '<span style="color:var(--text-muted);">0</span>'}</td>
        <td style="text-align:center;">${short ? '<span class="badge badge-red badge-sm">缺料</span>' : '<span class="badge badge-green badge-sm">齐套</span>'}</td>
        <td style="text-align:center;"><span style="color:var(--primary);cursor:pointer;" onclick="OrderReadiness.toggleRef('${detailId}')">明细 ▸</span></td>
      </tr>
      <tr class="or-detail" id="${detailId}" style="display:none;">
        <td colspan="10" style="padding:8px 16px;">
          <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">组件（预留）逐项对比 —— 未清需求 = 需求 − 已投料；可用库存 = 非限制 + 质检</div>
          <table class="data-table data-table-compact">
            <thead><tr>
              <th>物料号</th><th>物料描述</th>
              <th style="text-align:right;">需求</th><th style="text-align:right;">已投料</th>
              <th style="text-align:right;">未清需求</th><th style="text-align:right;">可用库存</th>
              <th style="text-align:right;">缺口</th><th style="text-align:center;">状态</th>
            </tr></thead>
            <tbody>${o.items.map(it => '<tr>' +
              '<td style="font-family:monospace;font-size:12px;">' + esc(it.mat) + '</td>' +
              '<td>' + esc(it.name) + '</td>' +
              '<td style="text-align:right;">' + this._fmt(it.req) + '</td>' +
              '<td style="text-align:right;">' + this._fmt(it.issued) + '</td>' +
              '<td style="text-align:right;font-weight:600;">' + this._fmt(it.open) + '</td>' +
              '<td style="text-align:right;">' + this._fmt(it.stock) + '</td>' +
              '<td style="text-align:right;">' + (it.gap > 0 ? '<span style="color:var(--danger);font-weight:700;">-' + this._fmt(it.gap) + '</span>' : '<span style="color:var(--text-muted);">0</span>') + '</td>' +
              '<td style="text-align:center;">' + (it.gap > 0 ? '<span class="badge badge-red badge-sm">缺料</span>' : '<span class="badge badge-green badge-sm">齐套</span>') + '</td>' +
            '</tr>').join('')}</tbody>
          </table>
        </td>
      </tr>`;
    }).join('');

    return `<table class="data-table">
      <thead><tr>
        <th style="width:50px;">序号</th>
        <th>流程订单号</th><th>订单名称</th><th>车间</th><th>计划开始日</th>
        <th style="text-align:right;">订单数量</th>
        <th style="text-align:center;">齐套项/总项</th>
        <th style="text-align:center;">缺料项</th>
        <th style="width:90px;text-align:center;">状态</th>
        <th style="width:90px;text-align:center;">组件明细</th>
      </tr></thead>
      <tbody>${body}</tbody>
    </table>`;
  },

  toggleRef(id) {
    const tr = document.getElementById(id);
    if (tr) tr.style.display = tr.style.display === 'none' ? '' : 'none';
  },

  /* ==================== 分页 ==================== */

  renderPagination() {
    const el = document.getElementById('orPagination');
    if (!el) return;
    const total = this.view === 'order' ? this.orderRows.length : this.matRows.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.page > totalPages) this.page = totalPages;
    el.innerHTML = `<div class="pagination">
      <span style="color:var(--text-muted);font-size:12px;margin-right:12px;">共 ${total} 行</span>
      <button class="pagination-btn" onclick="OrderReadiness.prevPage()"${this.page <= 1 ? ' disabled' : ''}>‹</button>
      <span class="pagination-info">第 ${this.page} / ${totalPages} 页</span>
      <button class="pagination-btn" onclick="OrderReadiness.nextPage()"${this.page >= totalPages ? ' disabled' : ''}>›</button>
      <select class="page-size-select" onchange="OrderReadiness.changePageSize(this.value)">
        ${[10, 20, 50].map(s => '<option value="' + s + '"' + (s === this.pageSize ? ' selected' : '') + '>' + s + '条/页</option>').join('')}
      </select>
    </div>`;
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); this.renderPagination(); } },

  nextPage() {
    const total = this.view === 'order' ? this.orderRows.length : this.matRows.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.page < totalPages) { this.page++; this.renderTable(); this.renderPagination(); }
  },

  changePageSize(v) { this.pageSize = Number(v); this.page = 1; this.renderTable(); this.renderPagination(); },

  /* ==================== 操作 ==================== */

  resetFilter() {
    ['orOrderNo', 'orMatCode', 'orOrderStatus'].forEach(id => {
      const e = document.getElementById(id); if (e) e.value = '';
    });
    const g = document.getElementById('orGapStatus'); if (g) g.value = 'all';
    const wc = document.getElementById('orWorkCenter');
    if (wc && OR_CURRENT_USER.isPlantLevel) wc.value = '';
    this.setRange('week', true);
    this.search();
    if (window.QueryVariant) QueryVariant.resetSelection('order-readiness');
  },

  refresh() {
    this.search();
    toast('齐套检查结果已刷新');
  },

  // 视角切换（演示权限控制：车间视角仅本车间，全厂视角可看全部）
  toggleView() {
    OR_CURRENT_USER.isPlantLevel = !OR_CURRENT_USER.isPlantLevel;
    this.renderFilterBar();
    if (!this._val('orDateFrom')) this.setRange(this.rangeKind || 'week', true);
    const tip = document.getElementById('orViewTip');
    if (tip) {
      tip.textContent = OR_CURRENT_USER.isPlantLevel
        ? '全厂用户'
        : OR_WORKCENTER_TEXT[OR_CURRENT_USER.workCenter] + '（' + OR_CURRENT_USER.name + '）';
    }
    this.search();
    toast(OR_CURRENT_USER.isPlantLevel ? '已切换为全厂视角，可查看全部车间' : '已切换为车间视角，仅能查看本车间订单');
  },

  exportData() {
    const rows = this.view === 'order' ? this.orderRows : this.matRows;
    if (!rows.length) return toast('无数据可导出');
    const lines = [];
    if (this.view === 'mat') {
      lines.push(['序号', '物料号', '物料描述', '单位', '本车间需求量', '全厂总需求', '可用库存', '缺口', '状态'].join(','));
      rows.forEach((r, i) => {
        lines.push([
          i + 1, r.mat, r.name, r.unit, r.myDemand, r.allDemand, r.stock,
          r.gap > 0 ? -r.gap : 0, r.status === 'short' ? '缺料' : '齐套'
        ].join(','));
      });
    } else {
      lines.push(['序号', '流程订单号', '订单名称', '车间', '计划开始日', '齐套项', '缺料项', '状态'].join(','));
      rows.forEach((o, i) => {
        lines.push([
          i + 1, o.no, o.name, OR_WORKCENTER_TEXT[o.workCenter] || o.workCenter,
          o.startDate, o.okCount + '/' + o.total, o.shortCount, o.status === 'short' ? '缺料' : '齐套'
        ].join(','));
      });
    }
    const csv = '\uFEFF' + lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '订单齐套检查_' + (this.view === 'mat' ? '物料维度' : '订单维度') + '.csv';
    a.click();
    toast('已导出 ' + rows.length + ' 行');
  }
};

// ===== 查询变式注册（通用模块 V3/js/core/query-variant.js）=====
if (window.QueryVariant) {
  QueryVariant.register({
    pageId: 'order-readiness',
    fields: ['orPlant', 'orDateFrom', 'orDateTo', 'orGapStatus', 'orOrderNo', 'orMatCode', 'orWorkCenter', 'orOrderStatus'],
    textFields: ['orOrderNo', 'orMatCode'],
    labels: {
      orPlant: '工厂', orDateFrom: '计划开始日(起)', orDateTo: '计划开始日(止)',
      orGapStatus: '齐套状态', orOrderNo: '流程订单号', orMatCode: '物料号/描述',
      orWorkCenter: '车间', orOrderStatus: '订单状态'
    },
    onApply: function () { OrderReadiness.search(); }
  });
}
