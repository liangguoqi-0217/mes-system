// ===== 生产管理 → 成本对象 =====
// 业务规则（车间用户视角）：
//   流程订单：查看(基本信息/工序信息/物料清单) · 投料(单笔+Excel批导) · 报工(单笔+Excel批导) · 收货 · 技术性完成
//   内部订单：查看 · 投料
//   成本中心：查看 · 投料
//   项目：    查看 · 投料
//   所有成本对象：可查看「操作记录」，并支持对已完成操作进行「冲销」。
// 设计遵循 _STANDARD：导航按业务对象收敛、图标克制、查看弹窗内承载操作、删除/冲销采用标记而非物理删除。
const CostObject = {
  _version: '2.0-20260722',
  page: 1, pageSize: 10,
  filtered: [],
  activeType: 'process',
  defaultType: 'process',

  setType(t) { if (t) { this.activeType = t; } },


  // 各成本对象支持的操作定义
  opDef: {
    process: {
      name: '流程订单',
      noLabel: '流程订单编号',
      noPh: '如 3000000123',
      ops: [
        { key:'issue',    name:'投料', modes:['single','batch'] },
        { key:'confirm',  name:'报工', modes:['single','batch'] },
        { key:'receipt',  name:'收货', modes:['single'] },
        { key:'techcomp', name:'技术性完成', modes:['single'] }
      ]
    },
    internal: { name: '内部订单', noLabel: '内部订单编号', noPh: '如 5000000008', ops: [ { key:'issue', name:'投料', modes:['single','batch'] } ] },
    costc:    { name: '成本中心', noLabel: '成本中心编号', noPh: '如 9000-1000-01', ops: [ { key:'issue', name:'投料', modes:['single','batch'] } ] },
    project:  { name: '项目',     noLabel: '项目编号', noPh: '如 R-2026-007', ops: [ { key:'issue', name:'投料', modes:['single','batch'] } ] }
  },

  // 模拟成本对象数据
  data: [
    { id:'PO001', type:'process', no:'3000000123', name:'阿莫西林颗粒制剂', plant:'1000', plantName:'山东步长制药工厂', qty:'1200.000', unit:'KG', status:'REL', statusName:'已下达', basic:{ batch:'BT-202606-01', material:'MAT-10001 阿莫西林原料药', workCenter:'WC-PROD-01 制剂线', startDate:'2026-06-20', endDate:'2026-06-28', prodVer:'PV-001' }, ops:[] },
    { id:'PO002', type:'process', no:'3000000145', name:'维生素C片', plant:'1000', plantName:'山东步长制药工厂', qty:'800.000', unit:'KG', status:'REL', statusName:'已下达', basic:{ batch:'BT-202606-02', material:'MAT-10002 维生素C原料', workCenter:'WC-PROD-02 压片线', startDate:'2026-06-22', endDate:'2026-07-01', prodVer:'PV-002' }, ops:[] },
    { id:'PO003', type:'process', no:'2001000033', name:'注射用水配制', plant:'2001', plantName:'陕西步长制药工厂', qty:'5000.000', unit:'L', status:'CRTD', statusName:'已创建', basic:{ batch:'BT-202606-03', material:'MAT-20001 注射用水', workCenter:'WC-WT-01 水系统', startDate:'2026-06-25', endDate:'2026-06-30', prodVer:'PV-003' }, ops:[] },
    { id:'IO001', type:'internal', no:'5000000008', name:'车间设备年度校准', plant:'1000', plantName:'山东步长制药工厂', qty:'1.000', unit:'次', status:'REL', statusName:'已下达', basic:{ batch:'—', material:'—', workCenter:'WC-MNT-01 维修组', startDate:'2026-06-18', endDate:'2026-07-10', prodVer:'—' }, ops:[] },
    { id:'IO002', type:'internal', no:'5000000011', name:'洁净区空调系统维护', plant:'2001', plantName:'陕西步长制药工厂', qty:'1.000', unit:'次', status:'REL', statusName:'已下达', basic:{ batch:'—', material:'—', workCenter:'WC-MNT-02 设施组', startDate:'2026-06-19', endDate:'2026-07-05', prodVer:'—' }, ops:[] },
    { id:'CC001', type:'costc', no:'9000-1000-01', name:'制剂车间公用能耗', plant:'1000', plantName:'山东步长制药工厂', qty:'1.000', unit:'月', status:'REL', statusName:'已下达', basic:{ batch:'—', material:'—', workCenter:'WC-UTIL-01 公用工程', startDate:'2026-06-01', endDate:'2026-06-30', prodVer:'—' }, ops:[] },
    { id:'CC002', type:'costc', no:'9000-2001-02', name:'质检中心能耗', plant:'2001', plantName:'陕西步长制药工厂', qty:'1.000', unit:'月', status:'REL', statusName:'已下达', basic:{ batch:'—', material:'—', workCenter:'WC-UTIL-02 公用工程', startDate:'2026-06-01', endDate:'2026-06-30', prodVer:'—' }, ops:[] },
    { id:'PJ001', type:'project', no:'R-2026-007', name:'新剂型中试项目', plant:'1000', plantName:'山东步长制药工厂', qty:'1.000', unit:'项', status:'REL', statusName:'已下达', basic:{ batch:'—', material:'—', workCenter:'WC-RD-01 研发中试', startDate:'2026-06-10', endDate:'2026-09-30', prodVer:'—' }, ops:[] },
    { id:'PJ002', type:'project', no:'R-2026-009', name:'工艺优化验证项目', plant:'2002', plantName:'山东丹红制药工厂', qty:'1.000', unit:'项', status:'CRTD', statusName:'已创建', basic:{ batch:'—', material:'—', workCenter:'WC-RD-02 研发验证', startDate:'2026-06-15', endDate:'2026-10-15', prodVer:'—' }, ops:[] }
  ],

  // 库存清单（投料时按 工厂+物料+库位 查询可用批次），演示数据
  inventory: [
    { plant:'1000', material:'MAT-10001 阿莫西林原料药', batch:'BT-202606-01-01', stockLoc:'1000-A-01', qty:'800.000', unit:'KG', mfgDate:'2026-05-10', expDate:'2027-05-09' },
    { plant:'1000', material:'MAT-10001 阿莫西林原料药', batch:'BT-202606-15-A', stockLoc:'1000-A-01', qty:'500.000', unit:'KG', mfgDate:'2026-06-01', expDate:'2027-05-30' },
    { plant:'1000', material:'MAT-10001 阿莫西林原料药', batch:'BT-202607-02-B', stockLoc:'1000-A-02', qty:'300.000', unit:'KG', mfgDate:'2026-06-25', expDate:'2027-06-24' },
    { plant:'1000', material:'MAT-10002 淀粉辅料', batch:'BT-202606-01-02', stockLoc:'1000-B-01', qty:'600.000', unit:'KG', mfgDate:'2026-05-20', expDate:'2028-05-19' },
    { plant:'1000', material:'MAT-10002 淀粉辅料', batch:'BT-202607-08-C', stockLoc:'1000-B-01', qty:'250.000', unit:'KG', mfgDate:'2026-06-28', expDate:'2028-06-27' },
    { plant:'2001', material:'MAT-20001 注射用水', batch:'BT-202606-03', stockLoc:'2001-W-01', qty:'3200.000', unit:'L', mfgDate:'2026-06-24', expDate:'2026-07-24' },
    { plant:'1000', material:'MAT-30001 校准耗材包', batch:'BT-CAL-06', stockLoc:'1000-T-01', qty:'12.000', unit:'个', mfgDate:'2026-04-15', expDate:'2027-04-14' }
  ],

  // 预置一些操作记录，演示"已做操作 + 冲销"
  _seedOps() {
    if (this._seeded) return;
    const po1 = this.data.find(d => d.id === 'PO001');
    if (po1 && po1.ops.length === 0) {
      po1.ops = [
        { id:'OP001', type:'issue', typeName:'投料', qty:'600.000', unit:'KG', material:'MAT-10001 阿莫西林原料药', batch:'BT-202606-01-01', postDate:'2026-06-20', by:'车间用户A', reversed:false },
        { id:'OP002', type:'issue', typeName:'投料', qty:'400.000', unit:'KG', material:'MAT-10002 淀粉辅料', batch:'BT-202606-01-02', postDate:'2026-06-21', by:'车间用户A', reversed:false },
        { id:'OP003', type:'confirm', typeName:'报工', qty:'1200.000', unit:'KG', op:'0020 混合制粒', hours:'3.5', worker:'王师傅', postDate:'2026-06-22', by:'车间用户B', reversed:false },
        { id:'OP004', type:'receipt', typeName:'收货', qty:'1180.000', unit:'KG', stockLoc:'1000-A-01', postDate:'2026-06-28', by:'车间用户C', reversed:false }
      ];
    }
    const io1 = this.data.find(d => d.id === 'IO001');
    if (io1 && io1.ops.length === 0) {
      io1.ops = [ { id:'OP005', type:'issue', typeName:'投料', qty:'1.000', unit:'次', material:'MAT-30001 校准耗材包', batch:'BT-CAL-06', postDate:'2026-06-18', by:'车间用户A', reversed:false } ];
    }
    this._seeded = true;
  },

  // ==================== 渲染 ====================
  render() {
    this._seedOps();
    this._applyFilter();
    const def = this.opDef[this.activeType] || {};
    const typeName = def.name || '成本对象';
    const noLabel = def.noLabel || '对象编号';
    const noPh = def.noPh || '如 3000000123';
    const total = this.filtered.length;
    const totalPages = Math.ceil(total / this.pageSize) || 1;
    let html = `
      <div class="co-master" style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">{{TYPE_NAME}}</div>
            <div style="font-size:13px;opacity:0.8;">生产管理 · 成本对象 · {{TYPE_NAME}}</div>
          </div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>工厂</label><select id="coPlant"><option value="">全部</option><option>1000 山东步长制药工厂</option><option>2001 陕西步长制药工厂</option><option>2002 山东丹红制药工厂</option></select></div>
          <div class="filter-group"><label>{{NO_LABEL}}</label><input type="text" id="coNo" placeholder="{{NO_PH}}"></div>
          <div class="filter-group"><label>名称</label><input type="text" id="coName" placeholder="模糊查询"></div>
          <div class="filter-group"><label>状态</label><select id="coStatus"><option value="">全部</option><option value="REL">已下达</option><option value="CRTD">已创建</option><option value="TECO">技术性完成</option></select></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="CostObject.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="CostObject.reset()">重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;overflow-x:auto;">
          <table class="data-table" style="min-width:1000px;">
            <thead><tr>
              <th style="width:56px;">序号</th>
              <th>{{NO_LABEL}}</th>
              <th>名称</th>
              <th>工厂</th>
              <th>数量</th>
              <th>状态</th>
              <th style="width:240px;text-align:center;">操作</th>
            </tr></thead>
            <tbody id="coTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info"><span class="list-count" id="coCount">共 {{TOTAL}} 条</span></div>
          <div class="pagination">
            <button class="pagination-btn" id="coPrev" disabled onclick="CostObject.prevPage()">‹</button>
            <span class="pagination-info" id="coPageInfo">第 1 / {{TOTALPAGES}} 页</span>
            <button class="pagination-btn" id="coNext" onclick="CostObject.nextPage()">›</button>
            <select class="page-size-select" id="coPageSizeSel" onchange="CostObject.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
          </div>
        </div>
      </div>`;
    return html
      .replace(/{{TYPE_NAME}}/g, typeName)
      .replace(/{{NO_LABEL}}/g, noLabel)
      .replace(/{{NO_PH}}/g, noPh)
      .replace(/{{TOTAL}}/g, total)
      .replace(/{{TOTALPAGES}}/g, totalPages);
  },

  // 行操作：每个操作类型只保留一个主按钮，点击后按需弹出「方式选择」（单笔/批导）
  _rowOps(d) {
    const def = this.opDef[d.type] || {};
    let html = `<button class="btn btn-blue btn-sm" onclick="CostObject.openView('${d.id}')">查看</button>`;
    (def.ops || []).forEach(op => {
      html += `<button class="btn btn-primary btn-sm" onclick="CostObject.startOp('${d.id}','${op.key}')">${op.name}</button>`;
    });
    return html;
  },

  // 点击操作主按钮：若该操作支持多种方式（单笔/批导），先弹出方式选择弹窗；否则直接进单笔
  startOp(id, opKey) {
    const d = this.data.find(x => x.id === id);
    if (!d) return;
    const def = this.opDef[d.type] || {};
    const op = (def.ops || []).find(o => o.key === opKey);
    if (!op) return;
    const opName = op.name;
    // 仅单笔：直接进入
    if (!op.modes || op.modes.indexOf('batch') < 0) { this.doOp(id, opKey, 'single'); return; }
    // 多方式：弹出选择
    const body = `
      <div style="display:flex;flex-direction:column;gap:12px;padding:4px 0;">
        <div style="font-size:13px;color:var(--text-secondary);">请选择「${opName}」的录入方式：</div>
        <div role="button" onclick="closeModal();CostObject.doOp('${id}','${opKey}','single')" style="cursor:pointer;border:1px solid var(--border);border-radius:8px;padding:14px 16px;display:flex;flex-direction:column;gap:2px;transition:background .15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='#fff'">
          <div style="font-weight:600;color:var(--text);">单笔录入</div>
          <div style="font-size:12px;color:var(--text-muted);">逐条填写表单提交${opKey==='issue'?'（支持多批次行项目）':''}</div>
        </div>
        <div role="button" onclick="closeModal();CostObject.doOp('${id}','${opKey}','batch')" style="cursor:pointer;border:1px solid var(--border);border-radius:8px;padding:14px 16px;display:flex;flex-direction:column;gap:2px;transition:background .15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='#fff'">
          <div style="font-weight:600;color:var(--text);">Excel 批导</div>
          <div style="font-size:12px;color:var(--text-muted);">下载模板批量填写后导入${opKey==='issue'?'（可含多批次多行）':''}</div>
        </div>
      </div>`;
    showModal(opName + ' - 选择方式', body, [{ text:'取消', cls:'btn-secondary', action:closeModal }], 'modal-sm');
  },

  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const pageRows = this.filtered.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;
    const cnt = document.getElementById('coCount'); if (cnt) cnt.textContent = '共 ' + this.filtered.length + ' 条';
    const info = document.getElementById('coPageInfo'); if (info) info.textContent = '第 ' + this.page + ' / ' + totalPages + ' 页';
    const prev = document.getElementById('coPrev'); if (prev) prev.disabled = this.page <= 1;
    const next = document.getElementById('coNext'); if (next) next.disabled = this.page >= totalPages;
    const sel = document.getElementById('coPageSizeSel'); if (sel) sel.value = this.pageSize;
    const body = document.getElementById('coTableBody');
    if (!body) return;
    if (pageRows.length === 0) {
      body.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">暂无符合条件的数据</td></tr>`;
      return;
    }
    body.innerHTML = pageRows.map((d, i) => {
      const st = { REL:'badge-blue', CRTD:'badge-yellow', TECO:'badge-green' }[d.status] || 'badge-gray';
      return `<tr>
        <td>${start + i + 1}</td>
        <td style="color:var(--primary-lighter);font-weight:600;">${esc(d.no)}</td>
        <td>${esc(d.name)}</td>
        <td>${esc(d.plantName)}</td>
        <td>${d.qty} ${d.unit}</td>
        <td><span class="badge ${st}">${d.statusName}</span></td>
        <td style="text-align:center;white-space:nowrap;"><div style="display:inline-flex;gap:6px;flex-wrap:wrap;justify-content:center;">${this._rowOps(d)}</div></td>
      </tr>`;
    }).join('');
  },

  _applyFilter() {
    let list = this.data.slice();
    if (this.activeType !== 'all') list = list.filter(d => d.type === this.activeType);
    this.filtered = list;
  },

  search() {
    const no = (document.getElementById('coNo') || {}).value || '';
    const plant = (document.getElementById('coPlant') || {}).value || '';
    const name = (document.getElementById('coName') || {}).value || '';
    const status = (document.getElementById('coStatus') || {}).value || '';
    this._applyFilter();
    this.filtered = this.filtered.filter(d =>
      (!no || d.no.indexOf(no) >= 0) &&
      (!plant || d.plantName.indexOf(plant.replace(/^\d+\s*/,'')) >= 0) &&
      (!name || d.name.indexOf(name) >= 0) &&
      (!status || d.status === status)
    );
    this.page = 1;
    this.renderTable();
  },
  reset() {
    const n = document.getElementById('coNo'); if (n) n.value = '';
    const p = document.getElementById('coPlant'); if (p) p.value = '';
    const nm = document.getElementById('coName'); if (nm) nm.value = '';
    const s = document.getElementById('coStatus'); if (s) s.value = '';
    this._applyFilter();
    this.page = 1;
    this.renderTable();
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() { if (this.page < Math.ceil(this.filtered.length / this.pageSize)) { this.page++; this.renderTable(); } },
  changePageSize() { this.pageSize = parseInt(document.getElementById('coPageSizeSel').value); this.page = 1; this.renderTable(); },

  refresh() { this.renderTable(); },

  // ==================== 查看弹窗（大） ====================
  openView(id) {
    const d = this.data.find(x => x.id === id);
    if (!d) return;
    const def = this.opDef[d.type] || {};
    const typeName = def.name || d.type;

    const body = `
      <div style="display:flex;flex-direction:column;height:78vh;">
        <!-- 上下文条（性冷淡浅灰，无蓝色块） -->
        <div style="background:#f8fafc;border:1px solid var(--border);border-radius:8px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
          <div style="font-size:14px;color:var(--text);"><strong>${esc(d.no)}</strong> · ${esc(d.name)}</div>
          <div style="font-size:13px;color:var(--text-secondary);">${typeName} · ${esc(d.plantName)}</div>
        </div>

        <!-- Tabs（行操作列已承载投料/报工等功能入口，查看弹窗内不再重复） -->
        <div id="coTabsBar" style="display:flex;gap:4px;border-bottom:1px solid var(--border);flex-shrink:0;">
          ${this._tabs(d)}
        </div>
        <div style="flex:1;overflow:auto;padding:16px 4px;" id="coTabBody">${this._tabContent(d, 'basic')}</div>
      </div>`;

    showModal('成本对象详情', body, [{ text:'关闭', cls:'btn-secondary', action:closeModal }], 'modal-xl');
    // 用事件委托绑定 tab 切换（避免 showModal 重写 DOM 后丢失监听器）
    const tabsBar = document.getElementById('coTabsBar');
    if (tabsBar && !tabsBar._bound) {
      tabsBar._bound = true;
      tabsBar.addEventListener('click', (e) => {
        const el = e.target.closest('[data-co-tab]');
        if (!el) return;
        const t = el.getAttribute('data-co-tab');
        const d2 = CostObject.data.find(x => x.id === window._coCurrent);
        if (!d2) return;
        tabsBar.querySelectorAll('[data-co-tab]').forEach(x => {
          const on = x.getAttribute('data-co-tab') === t;
          x.classList.toggle('active', on);
          x.style.color = on ? 'var(--primary)' : 'var(--text-secondary)';
          x.style.borderBottomColor = on ? 'var(--primary)' : 'transparent';
          x.style.fontWeight = on ? '600' : '400';
        });
        const bd = document.getElementById('coTabBody');
        if (bd) bd.innerHTML = CostObject._tabContent(d2, t);
        if (t === 'ops') setTimeout(() => CostObject._bindOpsSub(), 0);
      });
    }
    window._coCurrent = d.id;
  },

  _tabs(d) {
    const tabs = [ {k:'basic',n:'基本信息'}, {k:'ops',n:'操作记录'} ];
    if (d.type === 'process') {
      tabs.splice(1, 0, {k:'routing',n:'工序信息'}, {k:'bom',n:'物料清单'});
    }
    return tabs.map((t, i) => `<div data-co-tab="${t.k}" class="co-tab ${i===0?'active':''}" style="padding:10px 16px;font-size:13px;cursor:pointer;border-bottom:2px solid transparent;${i===0?'color:var(--primary);border-bottom-color:var(--primary);font-weight:600;':'color:var(--text-secondary);'}">${t.n}</div>`).join('');
  },

  _tabContent(d, tab) {
    if (tab === 'basic') return this._basicTab(d);
    if (tab === 'routing') return this._routingTab(d);
    if (tab === 'bom') return this._bomTab(d);
    if (tab === 'ops') return this._opsTab(d);
    return '';
  },

  _basicTab(d) {
    const b = d.basic || {};
    const typeName = (this.opDef[d.type]||{}).name || d.type;
    const noLabel = (this.opDef[d.type]||{}).noLabel || '对象编号';
    const rows = [
      [noLabel, d.no], ['成本对象类型', typeName],
      ['名称', d.name], ['工厂', d.plantName],
      ['批次', b.batch], ['关联物料', b.material],
      ['工作中心', b.workCenter], ['生产版本', b.prodVer],
      ['开始日期', b.startDate], ['结束日期', b.endDate],
      ['数量', d.qty + ' ' + d.unit], ['状态', d.statusName]
    ];
    return `<dl class="detail-grid">
      ${rows.map(r => `<div class="detail-item"><dt>${r[0]}</dt><dd>${esc(r[1]||'—')}</dd></div>`).join('')}
    </dl>`;
  },

  _routingTab(d) {
    const ops = [
      { op:'0010', name:'粉碎过筛', wc:'WC-PROD-01', std:'2.0 h', status:'已确认' },
      { op:'0020', name:'混合制粒', wc:'WC-PROD-01', std:'3.5 h', status:'已确认' },
      { op:'0030', name:'干燥', wc:'WC-PROD-03', std:'4.0 h', status:'部分确认' },
      { op:'0040', name:'总混', wc:'WC-PROD-01', std:'1.5 h', status:'未确认' },
      { op:'0050', name:'压片', wc:'WC-PROD-02', std:'5.0 h', status:'未确认' }
    ];
    return `<table class="data-table" style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead><tr style="background:#f8fafc;text-align:left;color:var(--text-secondary);">
        <th style="padding:10px 14px;">工序</th><th style="padding:10px 14px;">工序名称</th>
        <th style="padding:10px 14px;">工作中心</th><th style="padding:10px 14px;">标准工时</th>
        <th style="padding:10px 14px;">报工状态</th></tr></thead>
      <tbody>${ops.map(o => `<tr style="border-top:1px solid var(--border);">
        <td style="padding:10px 14px;">${o.op}</td><td style="padding:10px 14px;">${o.name}</td>
        <td style="padding:10px 14px;">${o.wc}</td><td style="padding:10px 14px;">${o.std}</td>
        <td style="padding:10px 14px;">${o.status}</td></tr>`).join('')}</tbody>
    </table>`;
  },

  _bomTab(d) {
    const items = [
      { mat:'MAT-10001', name:'阿莫西林原料药', qty:'600.000', unit:'KG', pos:'0010' },
      { mat:'MAT-10002', name:'淀粉辅料', qty:'300.000', unit:'KG', pos:'0020' },
      { mat:'MAT-10003', name:'硬脂酸镁', qty:'5.000', unit:'KG', pos:'0030' },
      { mat:'MAT-20001', name:'胶囊壳#0', qty:'500000.000', unit:'EA', pos:'0040' }
    ];
    return `<table class="data-table" style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead><tr style="background:#f8fafc;text-align:left;color:var(--text-secondary);">
        <th style="padding:10px 14px;">项次</th><th style="padding:10px 14px;">物料编码</th>
        <th style="padding:10px 14px;">物料名称</th><th style="padding:10px 14px;">需求数量</th></tr></thead>
      <tbody>${items.map(i => `<tr style="border-top:1px solid var(--border);">
        <td style="padding:10px 14px;">${i.pos}</td><td style="padding:10px 14px;">${i.mat}</td>
        <td style="padding:10px 14px;">${i.name}</td><td style="padding:10px 14px;">${i.qty} ${i.unit}</td></tr>`).join('')}</tbody>
    </table>`;
  },

  // 操作记录：拆成「投料 / 报工 / 收货 / 技术性完成」四个子页签，各自独立展示，避免信息揉在一起眼花缭乱
  _opsTab(d) {
    if (!d.ops || d.ops.length === 0) {
      return `<div style="padding:40px;text-align:center;color:var(--text-muted);font-size:14px;">该成本对象暂无操作记录</div>`;
    }
    const groups = [ 'issue', 'confirm', 'receipt', 'techcomp' ];
    const titles = { issue:'投料', confirm:'报工', receipt:'收货', techcomp:'技术性完成' };
    const counts = {};
    groups.forEach(g => counts[g] = d.ops.filter(o => o.type === g).length);
    const subBar = groups.map((g, i) => `
      <div data-co-ops="${g}" class="co-ops-tab ${i===0?'active':''}" style="padding:8px 16px;font-size:13px;cursor:pointer;border-bottom:2px solid ${i===0?'var(--primary)':'transparent'};color:${i===0?'var(--primary)':'var(--text-secondary)'};font-weight:${i===0?'600':'400'};">
        ${titles[g]} <span class="badge ${counts[g]?'badge-blue':'badge-gray'}" style="margin-left:4px;">${counts[g]}</span>
      </div>`).join('');
    const first = groups[0];
    return `
      <div id="coOpsSub" style="display:flex;gap:4px;border-bottom:1px solid var(--border);margin-bottom:12px;">
        ${subBar}
      </div>
      <div id="coOpsBody">${this._opsTable(first, d.ops.filter(o => o.type === first), d)}</div>`;
  },

  // 操作记录子页签切换（事件委托）
  _bindOpsSub() {
    const bar = document.getElementById('coOpsSub');
    if (!bar || bar._bound) return;
    bar._bound = true;
    bar.addEventListener('click', (e) => {
      const el = e.target.closest('[data-co-ops]');
      if (!el) return;
      const g = el.getAttribute('data-co-ops');
      const d = CostObject.data.find(x => x.id === window._coCurrent);
      if (!d) return;
      bar.querySelectorAll('[data-co-ops]').forEach(x => {
        const on = x.getAttribute('data-co-ops') === g;
        x.style.color = on ? 'var(--primary)' : 'var(--text-secondary)';
        x.style.borderBottomColor = on ? 'var(--primary)' : 'transparent';
        x.style.fontWeight = on ? '600' : '400';
      });
      const bd = document.getElementById('coOpsBody');
      if (bd) bd.innerHTML = CostObject._opsTable(g, d.ops.filter(o => o.type === g), d);
    });
  },

  _opsTable(type, rows, d) {
    let head = '', body = '';
    const reversed = (o) => o.reversed ? `<span class="badge badge-gray">已冲销</span>` : `<span class="badge badge-green">有效</span>`;
    const revBtn = (o) => o.reversed ? '—' : `<button class="btn btn-ghost btn-sm" onclick="CostObject.reverseOp('${d.id}','${o.id}')">冲销</button>`;
    const strike = (o) => o.reversed ? 'color:var(--text-muted);text-decoration:line-through;' : '';

    if (type === 'issue') {
      head = `<th style="padding:10px 14px;">物料</th><th style="padding:10px 14px;">批次</th><th style="padding:10px 14px;">投料数量</th><th style="padding:10px 14px;">单位</th><th style="padding:10px 14px;">过账日期</th><th style="padding:10px 14px;">操作人</th><th style="padding:10px 14px;">状态</th><th style="padding:10px 14px;text-align:center;">操作</th>`;
      body = rows.map(o => `<tr style="border-top:1px solid var(--border);${strike(o)}">
        <td style="padding:10px 14px;">${esc(o.material||'—')}</td><td style="padding:10px 14px;">${esc(o.batch||'—')}</td>
        <td style="padding:10px 14px;">${o.qty}</td><td style="padding:10px 14px;">${o.unit}</td>
        <td style="padding:10px 14px;">${esc(o.postDate||'—')}</td><td style="padding:10px 14px;">${esc(o.by)}</td>
        <td style="padding:10px 14px;">${reversed(o)}</td><td style="padding:10px 14px;text-align:center;">${revBtn(o)}</td></tr>`).join('');
    } else if (type === 'confirm') {
      head = `<th style="padding:10px 14px;">工序</th><th style="padding:10px 14px;">报工数量</th><th style="padding:10px 14px;">单位</th><th style="padding:10px 14px;">工时(h)</th><th style="padding:10px 14px;">人工</th><th style="padding:10px 14px;">过账日期</th><th style="padding:10px 14px;">操作人</th><th style="padding:10px 14px;">状态</th><th style="padding:10px 14px;text-align:center;">操作</th>`;
      body = rows.map(o => `<tr style="border-top:1px solid var(--border);${strike(o)}">
        <td style="padding:10px 14px;">${esc(o.op||'—')}</td><td style="padding:10px 14px;">${o.qty}</td><td style="padding:10px 14px;">${o.unit}</td>
        <td style="padding:10px 14px;">${o.hours||'—'}</td><td style="padding:10px 14px;">${esc(o.worker||'—')}</td>
        <td style="padding:10px 14px;">${esc(o.postDate||'—')}</td><td style="padding:10px 14px;">${esc(o.by)}</td>
        <td style="padding:10px 14px;">${reversed(o)}</td><td style="padding:10px 14px;text-align:center;">${revBtn(o)}</td></tr>`).join('');
    } else if (type === 'receipt') {
      head = `<th style="padding:10px 14px;">收货数量</th><th style="padding:10px 14px;">单位</th><th style="padding:10px 14px;">库位</th><th style="padding:10px 14px;">过账日期</th><th style="padding:10px 14px;">操作人</th><th style="padding:10px 14px;">状态</th><th style="padding:10px 14px;text-align:center;">操作</th>`;
      body = rows.map(o => `<tr style="border-top:1px solid var(--border);${strike(o)}">
        <td style="padding:10px 14px;">${o.qty}</td><td style="padding:10px 14px;">${o.unit}</td>
        <td style="padding:10px 14px;">${esc(o.stockLoc||'—')}</td><td style="padding:10px 14px;">${esc(o.postDate||'—')}</td>
        <td style="padding:10px 14px;">${esc(o.by)}</td><td style="padding:10px 14px;">${reversed(o)}</td>
        <td style="padding:10px 14px;text-align:center;">${revBtn(o)}</td></tr>`).join('');
    } else if (type === 'techcomp') {
      head = `<th style="padding:10px 14px;">完成日期</th><th style="padding:10px 14px;">操作人</th><th style="padding:10px 14px;">状态</th><th style="padding:10px 14px;text-align:center;">操作</th>`;
      body = rows.map(o => `<tr style="border-top:1px solid var(--border);${strike(o)}">
        <td style="padding:10px 14px;">${esc(o.postDate||'—')}</td><td style="padding:10px 14px;">${esc(o.by)}</td>
        <td style="padding:10px 14px;">${reversed(o)}</td><td style="padding:10px 14px;text-align:center;">${revBtn(o)}</td></tr>`).join('');
    }
    if (!rows || rows.length === 0) {
      return `<div style="padding:30px;text-align:center;color:var(--text-muted);font-size:13px;background:#f8fafc;border:1px solid var(--border);border-radius:8px;">暂无该类型操作记录</div>`;
    }
    return `<table class="data-table" style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead><tr style="background:#f8fafc;text-align:left;color:var(--text-secondary);">${head}</tr></thead>
      <tbody>${body}</tbody></table>`;
  },


  // ==================== 操作执行（单笔 / 批导） ====================
  doOp(id, opKey, mode) {
    const d = this.data.find(x => x.id === id);
    if (!d) return;
    const def = this.opDef[d.type] || {};
    const op = def.ops.find(o => o.key === opKey);
    const opName = op ? op.name : opKey;

    if (mode === 'batch') {
      // Excel 批导：演示弹窗（下载模板 + 上传占位）
      let tpl = '每行一条记录；通用列：过账日期、操作人。';
      if (opKey === 'issue') tpl = '投料模板列（每行一个批次）：批次号、库位、投用数量、单位。可包含多行表示多批次投料。';
      else if (opKey === 'confirm') tpl = '报工模板列：工序、报工数量、工时(h)、人工。';
      else if (opKey === 'receipt') tpl = '收货模板列：收货数量、单位、库位。';
      else if (opKey === 'techcomp') tpl = '技术性完成模板列：完成日期、操作人。';
      const body = `
        <div style="font-size:14px;color:var(--text);line-height:1.8;">
          <p>通过 Excel 批量导入「${opName}」数据。请先下载模板，按格式填写后上传。</p>
          <div style="background:#f8fafc;border:1px solid var(--border);border-radius:8px;padding:12px;margin:12px 0;font-size:13px;color:var(--text-secondary);">
            <strong>模板格式：</strong>${tpl}
          </div>
          <div style="display:flex;gap:10px;margin-top:16px;">
            <button class="btn btn-ghost btn-sm" onclick="toast('模板下载中（演示）')">下载模板</button>
            <label class="btn btn-primary btn-sm" style="cursor:pointer;">
              选择文件<input type="file" accept=".xlsx,.xls" style="display:none;" onchange="CostObject._onBatchFile(this,'${id}','${opKey}','${opName}')">
            </label>
          </div>
          <div id="coBatchHint" style="margin-top:14px;font-size:13px;color:var(--text-secondary);"></div>
        </div>`;
      showModal(opName + ' - Excel批导', body, [
        { text:'关闭', cls:'btn-secondary', action:closeModal },
        { text:'确认导入', cls:'btn-primary', action:() => CostObject._confirmBatch(id, opKey, opName) }
      ], 'modal-md');
      return;
    }

    // 单笔：录入表单（不同操作类型，字段不同）
    let extra = `
      <label style="color:var(--text-secondary);">过账日期</label>
      <input id="coOpDate" class="form-input" type="date" value="2026-07-14">`;
    if (opKey === 'issue') {
      const mat = d.basic.material && d.basic.material !== '—' ? d.basic.material : '';
      extra = `
        <label style="color:var(--text-secondary);">物料</label>
        <input id="coOpMaterial" class="form-input" placeholder="如 MAT-10001 阿莫西林原料药" value="${esc(mat)}">
        <label style="color:var(--text-secondary);">过账日期</label>
        <input id="coOpDate" class="form-input" type="date" value="2026-07-14">
        <div style="grid-column:1 / -1;margin:6px 0 2px;display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:13px;color:var(--text);font-weight:600;">投料行项目（可多个批次）</span>
          <div style="display:flex;gap:8px;">
            <button type="button" class="btn btn-ghost btn-sm" onclick="CostObject._openStockPicker('${id}')">从库存选择批次</button>
            <button type="button" class="btn btn-ghost btn-sm" onclick="CostObject._addIssueRow()">手动新增行</button>
          </div>
        </div>
        <div id="coIssueRows" style="grid-column:1 / -1;border:1px solid var(--border);border-radius:8px;overflow:hidden;"></div>
        <input type="hidden" id="coIssueData">`;
    } else if (opKey === 'confirm') {
      extra = `
        <label style="color:var(--text-secondary);">工序</label>
        <input id="coOpOp" class="form-input" placeholder="如 0020 混合制粒">
        <label style="color:var(--text-secondary);">工时(h)</label>
        <input id="coOpHours" class="form-input" placeholder="如 3.5">
        <label style="color:var(--text-secondary);">人工</label>
        <input id="coOpWorker" class="form-input" placeholder="如 王师傅">
        <label style="color:var(--text-secondary);">过账日期</label>
        <input id="coOpDate" class="form-input" type="date" value="2026-07-14">`;
    } else if (opKey === 'receipt') {
      extra = `
        <label style="color:var(--text-secondary);">库位</label>
        <input id="coOpLoc" class="form-input" placeholder="如 1000-A-01">
        <label style="color:var(--text-secondary);">过账日期</label>
        <input id="coOpDate" class="form-input" type="date" value="2026-07-14">`;
    }
    const body = `
      <div style="font-size:14px;color:var(--text);">
        <div style="display:grid;grid-template-columns:120px 1fr;gap:12px;align-items:center;margin-bottom:14px;">
          <label style="color:var(--text-secondary);">${opName}数量</label>
          <input id="coOpQty" class="form-input" placeholder="请输入数量" value="${d.qty}">
          <label style="color:var(--text-secondary);">单位</label>
          <input id="coOpUnit" class="form-input" value="${d.unit}" readonly>
          ${extra}
        </div>
      </div>`;
    showModal(opName + ' - 单笔录入', body, [
      { text:'取消', cls:'btn-secondary', action:closeModal },
      { text:'确认提交', cls:'btn-primary', action:() => CostObject._submitSingle(id, opKey, opName) }
    ], 'modal-md');
    if (opKey === 'issue') {
      // 默认预填一行空白行项目，方便直接录入
      window._coIssueRows = [];
      CostObject._renderIssueRows();
    }
  },

  // 投料 - 从库存选择批次：弹窗列出可用库存，每行可填「本次投用数量」，可多选多行
  _openStockPicker(id) {
    const d = this.data.find(x => x.id === id);
    if (!d) return;
    const material = (document.getElementById('coOpMaterial') || {}).value || '';
    if (!material.trim()) { toast('请先在投料表单填写物料'); return; }

    // 按 工厂+物料 过滤库存（库位作为清单内可见列，不强制过滤）
    const kw = material.replace(/^\S+\s/, '').trim();
    const rows = this.inventory.filter(s =>
      (!d.plant || s.plant === d.plant) &&
      (s.material.indexOf(kw) >= 0 || s.material.indexOf(material) >= 0)
    );
    const list = rows.length ? rows : this.inventory;

    const body = `
      <div style="font-size:13px;color:var(--text-secondary);margin-bottom:10px;">筛选条件：工厂 ${esc(d.plant||'—')} ＋ 物料「${esc(material)}」。勾选批次并在「本次投用数量」填写数量，可同时选择多个批次。</div>
      <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;max-height:340px;overflow:auto;">
        <table class="data-table" style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead><tr style="background:#f8fafc;text-align:left;color:var(--text-secondary);position:sticky;top:0;">
            <th style="padding:9px 12px;width:42px;text-align:center;">选</th>
            <th style="padding:9px 12px;">批次</th><th style="padding:9px 12px;">库位</th>
            <th style="padding:9px 12px;">可用数量</th><th style="padding:9px 12px;">生产日期</th>
            <th style="padding:9px 12px;">有效期至</th>
            <th style="padding:9px 12px;">本次投用数量</th>
          </tr></thead>
          <tbody>${list.map((s, i) => `<tr style="border-top:1px solid var(--border);">
            <td style="padding:9px 12px;text-align:center;"><input type="checkbox" class="co-stk-chk" data-i="${i}"></td>
            <td style="padding:9px 12px;">${esc(s.batch)}</td>
            <td style="padding:9px 12px;">${esc(s.stockLoc)}</td>
            <td style="padding:9px 12px;">${s.qty} ${s.unit}</td>
            <td style="padding:9px 12px;">${esc(s.mfgDate)}</td>
            <td style="padding:9px 12px;">${esc(s.expDate)}</td>
            <td style="padding:9px 12px;"><input type="number" class="form-input co-stk-qty" data-i="${i}" placeholder="投用数量" style="width:110px;"></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>`;
    showModal('库存清单 - 选择投料批次', body, [
      { text:'取消', cls:'btn-secondary', action:closeModal },
      { text:'确认选择', cls:'btn-primary', action:() => CostObject._confirmStockPick(id, list) }
    ], 'modal-lg');
  },

  // 从库存清单确认选择：把勾选批次+数量作为行项目带入投料
  _confirmStockPick(id, list) {
    const box = document.getElementById('coIssueRows');
    if (!box) { closeModal(); return; }
    const chkEls = document.querySelectorAll('.co-stk-chk');
    const qtyEls = document.querySelectorAll('.co-stk-qty');
    const qtyMap = {};
    qtyEls.forEach(el => { qtyMap[el.getAttribute('data-i')] = el.value; });
    let added = 0;
    chkEls.forEach(el => {
      if (!el.checked) return;
      const i = +el.getAttribute('data-i');
      const s = list[i];
      if (!s) return;
      const qty = (qtyMap[i] || '').trim();
      if (!qty) { toast('批次 ' + s.batch + ' 未填写投用数量，已跳过'); return; }
      window._coIssueRows.push({ batch:s.batch, stockLoc:s.stockLoc, qty:qty, unit:s.unit });
      added++;
    });
    closeModal();
    if (added === 0) { toast('未选择任何批次'); return; }
    CostObject._renderIssueRows();
    toast('已带入 ' + added + ' 个批次行项目');
  },

  // 手动新增一个空白投料行
  _addIssueRow() {
    window._coIssueRows = window._coIssueRows || [];
    window._coIssueRows.push({ batch:'', stockLoc:'', qty:'', unit:'' });
    CostObject._renderIssueRows();
  },

  // 删除某一行
  _removeIssueRow(idx) {
    window._coIssueRows = window._coIssueRows || [];
    window._coIssueRows.splice(idx, 1);
    CostObject._renderIssueRows();
  },

  // 渲染投料行项目表格
  _renderIssueRows() {
    const box = document.getElementById('coIssueRows');
    if (!box) return;
    const rows = window._coIssueRows || [];
    if (rows.length === 0) {
      box.innerHTML = `<div style="padding:18px;text-align:center;color:var(--text-muted);font-size:13px;">暂无投料行项目，可「从库存选择批次」或「手动新增行」</div>`;
      return;
    }
    box.innerHTML = `
      <table class="data-table" style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead><tr style="background:#f8fafc;text-align:left;color:var(--text-secondary);">
          <th style="padding:9px 12px;">批次</th><th style="padding:9px 12px;">库位</th>
          <th style="padding:9px 12px;">投用数量</th><th style="padding:9px 12px;">单位</th>
          <th style="padding:9px 12px;width:60px;text-align:center;">操作</th>
        </tr></thead>
        <tbody>${rows.map((r, i) => `<tr style="border-top:1px solid var(--border);">
          <td style="padding:6px 12px;"><input class="form-input co-iss-batch" data-i="${i}" value="${esc(r.batch)}" style="width:160px;"></td>
          <td style="padding:6px 12px;"><input class="form-input co-iss-loc" data-i="${i}" value="${esc(r.stockLoc)}" style="width:110px;"></td>
          <td style="padding:6px 12px;"><input class="form-input co-iss-qty" data-i="${i}" value="${esc(r.qty)}" style="width:100px;"></td>
          <td style="padding:6px 12px;"><input class="form-input co-iss-unit" data-i="${i}" value="${esc(r.unit||'')}" style="width:70px;"></td>
          <td style="padding:6px 12px;text-align:center;"><button class="btn btn-ghost btn-sm" onclick="CostObject._removeIssueRow(${i})">删除</button></td>
        </tr>`).join('')}</tbody>
      </table>`;
    // 行内输入即时回写
    box.querySelectorAll('input').forEach(el => {
      el.addEventListener('input', () => {
        const i = +el.getAttribute('data-i');
        const cls = el.className;
        if (cls.indexOf('co-iss-batch') >= 0) rows[i].batch = el.value;
        else if (cls.indexOf('co-iss-loc') >= 0) rows[i].stockLoc = el.value;
        else if (cls.indexOf('co-iss-qty') >= 0) rows[i].qty = el.value;
        else if (cls.indexOf('co-iss-unit') >= 0) rows[i].unit = el.value;
      });
    });
  },

  _onBatchFile(input, id, opKey, opName) {
    if (!input.files || !input.files[0]) return;
    const f = input.files[0];
    window._coBatchFile = f;
    const hint = document.getElementById('coBatchHint');
    if (hint) hint.textContent = '已选择文件：' + f.name + '（演示环境按模板解析为示例数据）。点击「确认导入」生成操作记录。';
    toast('已读取文件：' + f.name + '（演示环境，未真正解析）');
  },

  // 确认导入：演示环境下按模板生成示例记录（投料为多批次多行）
  _confirmBatch(id, opKey, opName) {
    const f = window._coBatchFile;
    if (!f) { toast('请先选择 Excel 文件'); return; }
    const d = this.data.find(x => x.id === id);
    if (!d) { closeModal(); return; }
    let n = 0;
    if (opKey === 'issue') {
      // 模拟 Excel 中两行不同批次的投料
      const demoRows = [
        { batch:'BT-202606-01-01', stockLoc:'1000-A-01', qty:'120.000', unit:'KG' },
        { batch:'BT-202606-15-A', stockLoc:'1000-A-01', qty:'80.000', unit:'KG' }
      ];
      demoRows.forEach(r => d.ops.push({
        id:'OP'+Date.now()+'_'+Math.floor(Math.random()*1000),
        type:opKey, typeName:opName, material:d.basic.material,
        batch:r.batch, stockLoc:r.stockLoc, qty:r.qty, unit:r.unit,
        postDate:'2026-07-14', by:'车间用户A', reversed:false
      }));
      n = demoRows.length;
    } else {
      const rec = { id:'OP'+Date.now(), type:opKey, typeName:opName, qty:d.qty, unit:d.unit, postDate:'2026-07-14', by:'车间用户A', reversed:false };
      if (opKey === 'confirm') { rec.op = '0010'; rec.hours = '2.0'; rec.worker = '王师傅'; }
      if (opKey === 'receipt') { rec.stockLoc = '1000-A-01'; }
      d.ops.push(rec);
      n = 1;
    }
    window._coBatchFile = null;
    closeModal();
    this.renderTable();
    toast(opName + '批导完成，共生成 ' + n + ' 条记录');
  },

  _submitSingle(id, opKey, opName) {
    const d = this.data.find(x => x.id === id);
    if (!d) return;
    const qty = (document.getElementById('coOpQty') || {}).value || d.qty;
    const unit = (document.getElementById('coOpUnit') || {}).value || d.unit;
    const postDate = (document.getElementById('coOpDate') || {}).value || '2026-07-14';
    const rec = { id:'OP'+Date.now(), type:opKey, typeName:opName, qty:qty, unit:unit, postDate:postDate, by:'车间用户A', reversed:false };
    if (opKey === 'issue') {
      const material = (document.getElementById('coOpMaterial') || {}).value || d.basic.material || '—';
      const rows = window._coIssueRows || [];
      if (rows.length === 0) { toast('请至少添加一个投料行项目'); return; }
      const valid = rows.filter(r => r.batch && r.qty);
      if (valid.length === 0) { toast('投料行项目需填写批次与数量'); return; }
      valid.forEach(r => {
        d.ops.push({
          id:'OP'+Date.now()+'_'+Math.floor(Math.random()*1000),
          type:opKey, typeName:opName,
          material:material, batch:r.batch, stockLoc:r.stockLoc || '—',
          qty:r.qty, unit:r.unit || d.unit, postDate:postDate, by:'车间用户A', reversed:false
        });
      });
      if (valid.length < rows.length) toast('已忽略 ' + (rows.length - valid.length) + ' 行未填完整的投料');
      closeModal();
      toast(opName + '已提交（' + valid.length + ' 个批次）');
      window._coIssueRows = [];
      this.openView(id);
      return;
    } else if (opKey === 'confirm') {
      rec.op = (document.getElementById('coOpOp') || {}).value || '—';
      rec.hours = (document.getElementById('coOpHours') || {}).value || '—';
      rec.worker = (document.getElementById('coOpWorker') || {}).value || '—';
    } else if (opKey === 'receipt') {
      rec.stockLoc = (document.getElementById('coOpLoc') || {}).value || '—';
    }
    d.ops.push(rec);
    if (opKey === 'techcomp') { d.status = 'TECO'; d.statusName = '技术性完成'; }
    closeModal();
    toast(opName + '已提交');
    this.openView(id); // 重新打开查看弹窗，刷新操作记录
  },


  // ==================== 冲销操作 ====================
  reverseOp(id, opId) {
    const d = this.data.find(x => x.id === id);
    if (!d) return;
    const op = d.ops.find(o => o.id === opId);
    if (!op || op.reversed) return;
    const body = `
      <div style="font-size:14px;color:var(--text);line-height:1.7;">
        <p>将对以下操作执行冲销：</p>
        <div style="background:#f8fafc;border:1px solid var(--border);border-radius:8px;padding:12px;margin:12px 0;font-size:13px;">
          <div><strong>操作：</strong>${op.typeName}</div>
          <div><strong>数量：</strong>${op.qty} ${op.unit}</div>
          <div><strong>日期：</strong>${op.postDate || '—'}</div>
        </div>
        <label style="display:block;color:var(--text-secondary);font-size:13px;margin-bottom:4px;">冲销原因（必填）</label>
        <textarea id="coRevReason" class="form-input" rows="3" placeholder="请填写冲销原因" style="width:100%;"></textarea>
      </div>`;
    showModal('冲销确认', body, [
      { text:'取消', cls:'btn-secondary', action:closeModal },
      { text:'确认冲销', cls:'btn-danger', action:() => CostObject._confirmReverse(id, opId) }
    ], 'modal-md');
  },

  _confirmReverse(id, opId) {
    const reason = (document.getElementById('coRevReason') || {}).value || '';
    if (!reason.trim()) { toast('请填写冲销原因'); return; }
    const d = this.data.find(x => x.id === id);
    if (!d) return;
    const op = d.ops.find(o => o.id === opId);
    if (op) { op.reversed = true; op.reverseReason = reason; op.reverseTime = '2026-07-14 11:00'; }
    closeModal();
    toast('已冲销，操作记录已标记');
    this.openView(id);
  },

  init() { this.page = 1; this.renderTable(); }
};
