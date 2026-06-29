// ===== 任务清单（标准作业模板）模块 =====
// 对齐SAP PM任务清单主数据管理
const MaintenanceTasklist = {
  page: 1, pageSize: 10, filtered: [],
  _editingId: null,       // 编辑中的任务清单ID（新建为null）
  _editingIsRevise: false, // 是否为修订模式
  _activeTab: 'header',    // 编辑弹窗当前页签
  _editData: null,         // 编辑态临时数据

  _isAdmin() {
    return (window.currentUserRole || 'admin') === 'admin';
  },

  /* ========== Render ========== */
  render() {
    const createBtn = this._isAdmin()
      ? '<button class="btn btn-blue" onclick="MaintenanceTasklist.createModal()">+ 新建任务清单</button>'
      : '';
    return `
    <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div><div style="font-size:18px;font-weight:700;">任务清单</div><div style="font-size:13px;opacity:0.8;">设备主数据 → 任务清单 | 标准作业模板（Task List）</div></div>
        <div style="display:flex;gap:8px;">${createBtn}</div>
      </div>
      <div class="filter-bar" style="flex-shrink:0;">
        <div class="filter-group"><label>任务清单编码</label><input type="text" id="tlPLNNR" placeholder="模糊查询"></div>
        <div class="filter-group"><label>描述</label><input type="text" id="tlPLTXT" placeholder="模糊查询"></div>
        <div class="filter-group"><label>类型</label><select id="tlPLNTY">
          <option value="">全部</option><option value="E">E-设备任务清单</option><option value="T">T-功能位置任务清单</option><option value="G">G-通用任务清单</option>
        </select></div>
        <div class="filter-group"><label>用途</label><select id="tlPLNAW">
          <option value="">全部</option><option value="M01">M01-维修</option><option value="M02">M02-检查</option><option value="M03">M03-润滑</option>
        </select></div>
        <div class="filter-group"><label>工作中心</label><input type="text" id="tlARBPL" placeholder="模糊查询"></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="MaintenanceTasklist.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="MaintenanceTasklist.reset()">重置</button>
        </div>
      </div>
      <div class="table-wrapper" style="flex:1;">
        <table class="data-table">
          <thead><tr>
            <th>任务清单编码</th><th>组计数器</th><th>描述</th><th>类型</th><th>用途</th><th>工作中心</th><th>状态</th><th>创建人/日期</th><th>操作</th>
          </tr></thead>
          <tbody id="tlTableBody"></tbody>
        </table>
      </div>
      <div class="list-toolbar" style="flex-shrink:0;">
        <div class="list-info"><span class="list-count" id="tlCount">共 0 条</span></div>
        <div class="pagination">
          <button class="pagination-btn" id="tlPrev" disabled onclick="MaintenanceTasklist.prevPage()">‹</button>
          <span class="pagination-info" id="tlPageInfo">第 1 / 1 页</span>
          <button class="pagination-btn" id="tlNext" onclick="MaintenanceTasklist.nextPage()">›</button>
          <select class="page-size-select" id="tlPageSize" onchange="MaintenanceTasklist.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
        </div>
      </div>
    </div>`;
  },

  /* ========== Init ========== */
  init() { this.filtered = [...taskListMockData]; this.page = 1; this.renderTable(); },

  /* ========== Render Table ========== */
  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;

    document.getElementById('tlCount').textContent = `共 ${this.filtered.length} 条`;
    document.getElementById('tlPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('tlPrev').disabled = this.page <= 1;
    document.getElementById('tlNext').disabled = this.page >= totalPages;
    document.getElementById('tlPageSize').value = this.pageSize;

    const typeText = { E: '设备任务清单', T: '功能位置任务清单', G: '通用任务清单' };
    const usageText = { M01: '维修', M02: '检查', M03: '润滑' };
    const statusCls = s => s === '已发布' ? 'badge-green' : 'badge-gray';

    document.getElementById('tlTableBody').innerHTML = page.map(tl => `
      <tr>
        <td><strong style="color:var(--primary-lighter);cursor:pointer;" onclick="MaintenanceTasklist.viewDetail('${tl.id}')">${esc(tl.PLNNR)}</strong></td>
        <td><span style="font-family:monospace;font-size:12px;">${esc(tl.PLNAL)}</span></td>
        <td>${esc(tl.PLTXT)}</td>
        <td><span style="font-size:12px;">${typeText[tl.PLNTY] || tl.PLNTY}</span></td>
        <td><span style="font-size:12px;">${usageText[tl.PLNAW] || tl.PLNAW}</span></td>
        <td>${esc(tl.ARBPL)}</td>
        <td><span class="badge ${statusCls(tl.PLNST)}">${esc(tl.PLNST)}</span></td>
        <td style="font-size:12px;">${esc(tl.ERNAM)} / ${esc(tl.ERDAT)}</td>
        <td class="table-actions">
          <button class="btn btn-outline btn-sm" onclick="MaintenanceTasklist.viewDetail('${tl.id}')">查看</button>
        </td>
      </tr>`).join('');
  },

  /* ========== Search / Filter ========== */
  search() {
    const plnnr = document.getElementById('tlPLNNR').value.trim();
    const pltxt = document.getElementById('tlPLTXT').value.trim();
    const plnty = document.getElementById('tlPLNTY').value;
    const plnaw = document.getElementById('tlPLNAW').value;
    const arbpl = document.getElementById('tlARBPL').value.trim();

    this.filtered = taskListMockData.filter(tl => {
      if (plnnr && !tl.PLNNR.includes(plnnr)) return false;
      if (pltxt && !tl.PLTXT.includes(pltxt)) return false;
      if (plnty && tl.PLNTY !== plnty) return false;
      if (plnaw && tl.PLNAW !== plnaw) return false;
      if (arbpl && !tl.ARBPL.includes(arbpl)) return false;
      return true;
    });
    this.page = 1; this.renderTable();
  },

  reset() {
    document.getElementById('tlPLNNR').value = '';
    document.getElementById('tlPLTXT').value = '';
    document.getElementById('tlPLNTY').value = '';
    document.getElementById('tlPLNAW').value = '';
    document.getElementById('tlARBPL').value = '';
    this.filtered = [...taskListMockData]; this.page = 1; this.renderTable();
  },

  prevPage(){ if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage(){ if (this.page < Math.ceil(this.filtered.length / this.pageSize)) { this.page++; this.renderTable(); } },
  changePageSize(){ this.pageSize = parseInt(document.getElementById('tlPageSize').value); this.page = 1; this.renderTable(); },

  /* ========== View Detail (Tabbed - same style as Edit) ========== */
  viewDetail(id) {
    const tl = taskListMockData.find(x => x.id === id);
    if (!tl) return;
    this._viewData = tl;
    this._viewActiveTab = 'header';
    this._showViewModal();
  },

  _showViewModal() {
    const d = this._viewData;
    const title = `任务清单 ${esc(d.PLNNR)}`;
    this._viewActiveTab = 'header';

    const bodyHtml = `
      <div style="display:flex;border-bottom:2px solid var(--border);margin-bottom:20px;gap:0;" id="tlViewTabs">
        <div class="tab ${this._viewActiveTab==='header'?'active':''}" onclick="MaintenanceTasklist._switchViewTab('header')" style="margin-bottom:-2px;">📋 抬头数据</div>
        <div class="tab ${this._viewActiveTab==='operations'?'active':''}" onclick="MaintenanceTasklist._switchViewTab('operations')" style="margin-bottom:-2px;">🔧 工序列表</div>
        <div class="tab ${this._viewActiveTab==='components'?'active':''}" onclick="MaintenanceTasklist._switchViewTab('components')" style="margin-bottom:-2px;">📦 物料组件</div>
        <div class="tab ${this._viewActiveTab==='tools'?'active':''}" onclick="MaintenanceTasklist._switchViewTab('tools')" style="margin-bottom:-2px;">🛠 工具/工装</div>
      </div>
      <div id="tlViewTabContent">
        ${this._renderViewHeaderTab(d)}
      </div>
    `;

    const isAdmin = this._isAdmin();
    const footerBtns = [
      { text: '关闭', cls: 'btn-secondary', action: closeModal }
    ];
    if (isAdmin && d.PLNST === '已发布') {
      footerBtns.push({ text: '编辑', cls: 'btn-primary', action: `()=>{ closeModal(); MaintenanceTasklist.startEdit('${d.id}'); }` });
    }

    showModal(title, bodyHtml, footerBtns, 'modal-xl');
  },

  _switchViewTab(tab) {
    this._viewActiveTab = tab;
    const d = this._viewData;

    const tabEl = document.getElementById('tlViewTabs');
    if (tabEl) {
      tabEl.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      const targetTab = tabEl.querySelector(`.tab[onclick*="${tab}"]`);
      if (targetTab) targetTab.classList.add('active');
    }

    const contentEl = document.getElementById('tlViewTabContent');
    if (contentEl) {
      contentEl.innerHTML = tab === 'header' ? this._renderViewHeaderTab(d)
        : tab === 'operations' ? this._renderViewOperationsTab(d)
        : tab === 'components' ? this._renderViewComponentsTab(d)
        : this._renderViewToolsTab(d);
    }
  },

  _renderViewHeaderTab(d) {
    const typeText = { E: '设备任务清单', T: '功能位置任务清单', G: '通用任务清单' };
    const usageText = { M01: '维修', M02: '检查', M03: '润滑' };

    return `
      <div class="form-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border);">
          <div>
            <div style="font-size:17px;font-weight:700;">${esc(d.PLTXT)}</div>
            <div style="font-size:13px;color:var(--text-secondary);margin-top:3px;">编码：${esc(d.PLNNR)} · 版本：${esc(d.PLNAL)} · ${typeText[d.PLNTY]||d.PLNTY}</div>
            <div style="font-size:13px;margin-top:2px;">删除标记：<span style="${d.DEL_FLAG ? 'color:#dc2626;font-weight:600;' : 'color:var(--text-secondary);'}">${d.DEL_FLAG ? '✓ 已标记' : '未标记'}</span></div>
          </div>
          <span class="badge ${d.PLNST==='已发布'?'badge-green':'badge-gray'}">${esc(d.PLNST)}</span>
        </div>
        <div class="detail-grid">
          <div class="detail-item"><dt>任务清单编码</dt><dd>${esc(d.PLNNR)}</dd></div>
          <div class="detail-item"><dt>组计数器（版本）</dt><dd>${esc(d.PLNAL)}</dd></div>
          <div class="detail-item"><dt>类型</dt><dd>${typeText[d.PLNTY]||d.PLNTY}</dd></div>
          <div class="detail-item"><dt>用途</dt><dd>${usageText[d.PLNAW]||d.PLNAW}</dd></div>
          <div class="detail-item"><dt>工作中心</dt><dd>${esc(d.ARBPL)}</dd></div>
          <div class="detail-item"><dt>创建人 / 日期</dt><dd>${esc(d.ERNAM)} / ${esc(d.ERDAT)}</dd></div>
          ${d.associatedObj ? `<div class="detail-item"><dt>关联对象</dt><dd>${esc(d.associatedObj)}</dd></div>` : ''}
        </div>
        ${d.longText ? `
          <div class="detail-grid" style="margin-top:14px;">
            <div class="detail-item" style="grid-column:1/-1;"><dt>长文本（作业指导说明）</dt><dd style="white-space:pre-wrap;line-height:1.7;">${esc(d.longText)}</dd></div>
          </div>` : ''}
      </div>`;
  },

  _renderViewOperationsTab(d) {
    const ops = d.operations || [];
    if (ops.length === 0) {
      return `<div class="form-section"><div style="text-align:center;padding:40px;color:var(--text-muted);"><div style="font-size:32px;margin-bottom:8px;">🔧</div><div style="font-size:13px;">暂无工序</div></div></div>`;
    }
    const steusText = { '人工工时': '人工工时', '机器工时': '机器工时', '准备工时': '准备工时' };
    const rows = ops.map((op, i) => `
      <tr>
        <td><span style="font-family:monospace;font-size:12px;">${esc(op.VORNR)}</span></td>
        <td>${esc(op.ARBPL)}</td>
        <td>${esc(op.LTXA1)}</td>
        <td><span style="font-size:12px;">${esc(op.STEUS)}</span></td>
        <td>${op.ARBEIT} h</td>
        <td style="font-size:12px;color:var(--text-secondary);">物料 ${(op.components||[]).length} 项 / 工具 ${(op.tools||[]).length} 项</td>
      </tr>`).join('');

    return `
      <div class="form-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-size:14px;font-weight:600;color:var(--text);">工序列表（${ops.length} 道）</span>
        </div>
        <div class="table-wrapper"><table class="data-table">
          <thead><tr><th>工序号</th><th>工作中心</th><th>工序描述</th><th>工时类型</th><th>计划工时</th><th>子资源</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
        ${ops.some(op => (op.components&&op.components.length) || (op.tools&&op.tools.length)) ? `
          <div style="margin-top:16px;">
            <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:8px;">工序子资源明细</div>
            ${ops.map((op, i) => {
              let parts = '';
              if (op.components && op.components.length) {
                parts += `<div style="margin-bottom:6px;"><span style="font-size:12px;color:var(--text-secondary);">工序${op.VORNR}物料：</span>${op.components.map(c => `<span class="badge badge-sm" style="background:#dbeafe;color:#1e40af;margin:2px;font-size:11px;">${esc(c.MATNR)} ×${c.BDMNG}${esc(c.MEINS)}</span>`).join('')}</div>`;
              }
              if (op.tools && op.tools.length) {
                parts += `<div style="margin-bottom:6px;"><span style="font-size:12px;color:var(--text-secondary);">工序${op.VORNR}工具：</span>${op.tools.map(t => `<span class="badge badge-sm" style="background:#fef3c7;color:#92400e;margin:2px;font-size:11px;">${esc(t.WRKTX||t.WRKCT||'工具')} ×${t.MGEIN||1}</span>`).join('')}</div>`;
              }
              return parts;
            }).filter(Boolean).join('')}
          </div>` : ''}
      </div>`;
  },

  _renderViewComponentsTab(d) {
    const comps = d.components || [];
    if (comps.length === 0) {
      return `<div class="form-section"><div style="text-align:center;padding:40px;color:var(--text-muted);"><div style="font-size:32px;margin-bottom:8px;">📦</div><div style="font-size:13px;">暂无计划备件</div></div></div>`;
    }
    const rows = comps.map(c => `
      <tr>
        <td>${esc(c.MATNR)}</td>
        <td>${esc(c.MAKTX)}</td>
        <td>${c.BDMNG}</td>
        <td>${esc(c.MEINS)}</td>
        <td><span style="font-size:12px;">${c.PTYPE==='stock'?'库存':'非库存'}</span></td>
      </tr>`).join('');

    return `
      <div class="form-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-size:14px;font-weight:600;color:var(--text);">计划备件（物料组件）</span>
          <span style="font-size:12px;color:var(--text-secondary);">共 ${comps.length} 项</span>
        </div>
        <div class="table-wrapper"><table class="data-table">
          <thead><tr><th>物料编码</th><th>物料描述</th><th>需求数量</th><th>单位</th><th>条目类别</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
      </div>`;
  },

  _renderViewToolsTab(d) {
    const tools = d.tools || [];
    if (tools.length === 0) {
      return `<div class="form-section"><div style="text-align:center;padding:40px;color:var(--text-muted);"><div style="font-size:32px;margin-bottom:8px;">🛠</div><div style="font-size:13px;">暂无工具配置</div></div></div>`;
    }
    const rows = tools.map(t => `
      <tr>
        <td>${esc(t.WRKCT||'-')}</td>
        <td>${esc(t.WRKTX||'-')}</td>
        <td>${t.MGEIN||'-'}</td>
      </tr>`).join('');

    return `
      <div class="form-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-size:14px;font-weight:600;color:var(--text);">工具/工装</span>
          <span style="font-size:12px;color:var(--text-secondary);">共 ${tools.length} 项</span>
        </div>
        <div class="table-wrapper"><table class="data-table">
          <thead><tr><th>工具编号</th><th>工具描述</th><th>数量</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
      </div>`;
  },

  /* ========== Create Modal ========== */
  createModal() {
    if (!this._isAdmin()) { toast('无操作权限，仅设备部主管可创建'); return; }
    this._editingId = null;
    this._editingIsRevise = false;
    this._initBlankEditData();
    this._showEditModal('新建任务清单');
  },

  /* ===== Start Edit (from view detail) ===== */
  startEdit(id) {
    const tl = taskListMockData.find(x => x.id === id);
    if (!tl) return;
    this._editingId = id;
    this._editingIsRevise = true;
    this._editData = JSON.parse(JSON.stringify(tl));
    this._showEditModal('编辑任务清单');
  },

  /* ===== Edit Data Management ===== */
  _initBlankEditData() {
    this._editData = {
      PLNNR: '', PLNAL: '', PLNTY: '', PLNAW: 'M01',
      PLTXT: '', longText: '', ARBPL: '', associatedObj: '',
      PLNST: '', DEL_FLAG: false, ERNAM: '当前用户', ERDAT: new Date().toISOString().slice(0, 10),
      operations: [],
      components: [],
      tools: []
    };
  },

  /* ========== Edit Modal UI ========== */
  _showEditModal(title) {
    const d = this._editData;
    this._activeTab = 'header';

    const typeOpts = [
      { v: '', l: '请选择' }, { v: 'E', l: 'E-设备任务清单' }, { v: 'T', l: 'T-功能位置任务清单' }, { v: 'G', l: 'G-通用任务清单' }
    ];
    const usageOpts = [
      { v: 'M01', l: 'M01-维修' }, { v: 'M02', l: 'M02-检查' }, { v: 'M03', l: 'M03-润滑' }
    ];
    const steusOpts = ['人工工时', '机器工时', '准备工时'];

    const makeSel = (value, opts) => opts.map(o =>
      `<option value="${esc(o.v||o)}" ${(o.v||o) === value ? 'selected' : ''}>${esc(o.l||o)}</option>`
    ).join('');

    const isReadonly = d.PLNNR && this._editingIsRevise;
    const plnnrDisplay = d.PLNNR ? d.PLNNR : '发布后由 SAP 自动生成';
    const plnalDisplay = d.PLNAL || '发布后由 SAP 返回';

    const bodyHtml = `
      <div style="display:flex;border-bottom:2px solid var(--border);margin-bottom:20px;gap:0;" id="tlEditTabs">
        <div class="tab ${this._activeTab === 'header' ? 'active' : ''}" onclick="MaintenanceTasklist._switchEditTab('header')" style="margin-bottom:-2px;">📋 抬头数据</div>
        <div class="tab ${this._activeTab === 'operations' ? 'active' : ''}" onclick="MaintenanceTasklist._switchEditTab('operations')" style="margin-bottom:-2px;">🔧 工序列表</div>
        <div class="tab ${this._activeTab === 'components' ? 'active' : ''}" onclick="MaintenanceTasklist._switchEditTab('components')" style="margin-bottom:-2px;">📦 物料组件</div>
        <div class="tab ${this._activeTab === 'tools' ? 'active' : ''}" onclick="MaintenanceTasklist._switchEditTab('tools')" style="margin-bottom:-2px;">🛠 工具/工装</div>
      </div>

      <div id="tlEditTabContent">
        ${this._renderHeaderTab(d, plnnrDisplay, plnalDisplay, typeOpts, usageOpts, isReadonly)}
      </div>
    `;

    const footerBtns = isReadonly ? [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '发布新版本', cls: 'btn-primary', action: `()=>{ MaintenanceTasklist._publish(); }` }
    ] : [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '发布', cls: 'btn-primary', action: `()=>{ MaintenanceTasklist._publish(); }` }
    ];

    showModal(title, bodyHtml, footerBtns, d.operations.length > 3 || d.components.length > 2 ? 'modal-xl' : 'modal-lg');
  },

  _switchEditTab(tab) {
    this._activeTab = tab;
    // Read current values from DOM before switching
    this._syncEditDataFromDOM();

    const d = this._editData;
    const isReadonly = d.PLNNR && this._editingIsRevise;
    const typeOpts = [
      { v: '', l: '请选择' }, { v: 'E', l: 'E-设备任务清单' }, { v: 'T', l: 'T-功能位置任务清单' }, { v: 'G', l: 'G-通用任务清单' }
    ];
    const usageOpts = [
      { v: 'M01', l: 'M01-维修' }, { v: 'M02', l: 'M02-检查' }, { v: 'M03', l: 'M03-润滑' }
    ];
    const plnnrDisplay = d.PLNNR ? d.PLNNR : '发布后由 SAP 自动生成';
    const plnalDisplay = d.PLNAL || '发布后由 SAP 返回';

    // Update tabs
    const tabEl = document.getElementById('tlEditTabs');
    if (tabEl) {
      tabEl.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      const targetTab = tabEl.querySelector(`.tab[onclick*="${tab}"]`);
      if (targetTab) targetTab.classList.add('active');
    }

    // Update content
    const contentEl = document.getElementById('tlEditTabContent');
    if (contentEl) {
      contentEl.innerHTML = tab === 'header' ? this._renderHeaderTab(d, plnnrDisplay, plnalDisplay, typeOpts, usageOpts, isReadonly)
        : tab === 'operations' ? this._renderOperationsTab(d)
        : tab === 'components' ? this._renderComponentsTab(d)
        : this._renderToolsTab(d);
    }
  },

  _syncEditDataFromDOM() {
    // Sync header fields
    const getVal = id => { const el = document.getElementById(id); return el ? el.value : ''; };
    this._editData.PLNTY = getVal('tlFldPLNTY') || this._editData.PLNTY;
    this._editData.PLNAW = getVal('tlFldPLNAW') || this._editData.PLNAW;
    this._editData.PLTXT = getVal('tlFldPLTXT') || this._editData.PLTXT;
    this._editData.longText = getVal('tlFldLongText') || this._editData.longText;
    this._editData.ARBPL = getVal('tlFldARBPL') || this._editData.ARBPL;
    this._editData.associatedObj = getVal('tlFldAssocObj') || this._editData.associatedObj;
    this._editData.DEL_FLAG = getVal('tlFldDelFlag') === 'true';
  },

  _renderHeaderTab(d, plnnrDisplay, plnalDisplay, typeOpts, usageOpts, isReadonly) {
    const makeSel = (value, opts) => opts.map(o =>
      `<option value="${esc(o.v||o)}" ${(o.v||o) === value ? 'selected' : ''}>${esc(o.l||o)}</option>`
    ).join('');

    return `
      <div class="form-section">
        <div class="form-grid">
          <div class="form-group">
            <label>任务清单编码</label>
            <input value="${esc(plnnrDisplay)}" readonly disabled style="background:#f9fafb;color:var(--text-secondary);">
          </div>
          <div class="form-group">
            <label>组计数器（版本）</label>
            <input value="${esc(plnalDisplay)}" readonly disabled style="background:#f9fafb;color:var(--text-secondary);">
          </div>
          <div class="form-group">
            <label>类型<span class="req">*</span></label>
            <select id="tlFldPLNTY" ${isReadonly&&d.PLNTY?'disabled':''}>${makeSel(d.PLNTY, typeOpts)}</select>
          </div>
          <div class="form-group">
            <label>用途<span class="req">*</span></label>
            <select id="tlFldPLNAW">${makeSel(d.PLNAW, usageOpts)}</select>
          </div>
          <div class="form-group">
            <label>描述<span class="req">*</span></label>
            <input id="tlFldPLTXT" value="${esc(d.PLTXT)}" placeholder="简要描述作业模板">
          </div>
          <div class="form-group">
            <label>工作中心<span class="req">*</span></label>
            <input id="tlFldARBPL" value="${esc(d.ARBPL)}" placeholder="如 WC-F001-001">
          </div>
          <div class="form-group">
            <label>关联对象</label>
            <input id="tlFldAssocObj" value="${esc(d.associatedObj||'')}" placeholder="${d.PLNTY==='E'?'设备编码（可多选，逗号分隔）':d.PLNTY==='T'?'功能位置编号':'G-通用无需选择'}">
          </div>
          <div class="form-group">
            <label>删除标记</label>
            <select id="tlFldDelFlag">
              <option value="false" ${!d.DEL_FLAG ? 'selected' : ''}>未标记</option>
              <option value="true" ${d.DEL_FLAG ? 'selected' : ''}>已标记</option>
            </select>
          </div>
          <div class="form-group full">
            <label>长文本（作业指导说明）</label>
            <textarea id="tlFldLongText" rows="3" placeholder="详细的作业步骤说明、安全注意事项等">${esc(d.longText||'')}</textarea>
          </div>
        </div>
      </div>`;
  },

  _renderOperationsTab(d) {
    const steusOpts = ['人工工时', '机器工时', '准备工时'];
    const makeSteusSel = (val) => steusOpts.map(s =>
      `<option value="${s}" ${s === val ? 'selected' : ''}>${s}</option>`
    ).join('');

    const opRows = (d.operations || []).map((op, i) => `
      <div style="background:#fafbfc;border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:12px;" id="tlOpRow${i}">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <span style="font-weight:600;font-size:13px;">工序 #${i + 1}：${esc(op.LTXA1 || '新工序')}</span>
          <div style="display:flex;gap:6px;">
            ${i > 0 ? `<button class="btn btn-sm btn-secondary" onclick="MaintenanceTasklist._moveOp(${i},-1)" title="上移">↑</button>` : ''}
            ${i < (d.operations||[]).length - 1 ? `<button class="btn btn-sm btn-secondary" onclick="MaintenanceTasklist._moveOp(${i},1)" title="下移">↓</button>` : ''}
            <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;" onclick="MaintenanceTasklist._removeOp(${i})" title="删除">✕</button>
          </div>
        </div>
        <div class="form-grid" style="gap:10px;">
          <div class="form-group">
            <label>工序号<span class="req">*</span></label>
            <input value="${esc(op.VORNR)}" onchange="MaintenanceTasklist._updateOpField(${i},'VORNR',this.value)" placeholder="如 0010" style="font-size:13px;">
          </div>
          <div class="form-group">
            <label>工作中心<span class="req">*</span></label>
            <input value="${esc(op.ARBPL)}" onchange="MaintenanceTasklist._updateOpField(${i},'ARBPL',this.value)" placeholder="继承抬头工作中心">
          </div>
          <div class="form-group">
            <label>工时类型</label>
            <select onchange="MaintenanceTasklist._updateOpField(${i},'STEUS',this.value)">${makeSteusSel(op.STEUS)}</select>
          </div>
          <div class="form-group">
            <label>计划工时 (h)</label>
            <input type="number" value="${op.ARBEIT}" onchange="MaintenanceTasklist._updateOpField(${i},'ARBEIT',parseFloat(this.value)||0)" step="0.5" min="0">
          </div>
        </div>
        <div class="form-group full" style="margin-top:8px;">
          <label>工序描述<span class="req">*</span></label>
          <input value="${esc(op.LTXA1)}" onchange="MaintenanceTasklist._updateOpField(${i},'LTXA1',this.value)" placeholder="描述该工序的作业内容">
        </div>
        <!-- Inline sub-resources -->
        <div style="margin-top:10px;display:flex;gap:10px;">
          <button class="btn btn-sm btn-blue" onclick="MaintenanceTasklist._addOpComponent(${i})">+ 添加物料</button>
          <button class="btn btn-sm btn-blue" onclick="MaintenanceTasklist._addOpTool(${i})">+ 添加工具</button>
        </div>
        ${(op.components && op.components.length) ? `
          <div style="margin-top:8px;">
            <span style="font-size:12px;font-weight:600;color:var(--text-secondary);">物料：</span>
            ${op.components.map((c, ci) => `<span class="badge badge-sm" style="background:#dbeafe;color:#1e40af;margin:2px;font-size:11px;cursor:pointer;" title="点击删除" onclick="MaintenanceTasklist._removeOpComponent(${i},${ci})">${esc(c.MATNR)} ×${c.BDMNG} ✕</span>`).join('')}
          </div>` : ''}
        ${(op.tools && op.tools.length) ? `
          <div style="margin-top:4px;">
            <span style="font-size:12px;font-weight:600;color:var(--text-secondary);">工具：</span>
            ${op.tools.map((t, ti) => `<span class="badge badge-sm" style="background:#fef3c7;color:#92400e;margin:2px;font-size:11px;cursor:pointer;" title="点击删除" onclick="MaintenanceTasklist._removeOpTool(${i},${ti})">${esc(t.WRKTX||t.WRKCT||'工具')} ✕</span>`).join('')}
          </div>` : ''}
      </div>`).join('');

    return `
      <div class="form-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-size:14px;font-weight:600;color:var(--text);">工序列表（至少 1 道）</span>
          <button class="btn btn-blue btn-sm" onclick="MaintenanceTasklist._addOp()">+ 添加工序</button>
        </div>
        ${opRows || '<div style="text-align:center;padding:40px;color:var(--text-muted);"><div style="font-size:32px;margin-bottom:8px;">🔧</div><div style="font-size:13px;">暂无工序，请点击上方按钮添加</div></div>'}
      </div>`;
  },

  _renderComponentsTab(d) {
    const rows = (d.components || []).map((c, i) => `
      <tr>
        <td><input value="${esc(c.MATNR)}" onchange="MaintenanceTasklist._updateCompField(${i},'MATNR',this.value)" placeholder="物料编码" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input value="${esc(c.MAKTX)}" onchange="MaintenanceTasklist._updateCompField(${i},'MAKTX',this.value)" placeholder="自动带出" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input type="number" value="${c.BDMNG}" onchange="MaintenanceTasklist._updateCompField(${i},'BDMNG',parseFloat(this.value)||0)" step="0.1" min="0" style="width:80px;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input value="${esc(c.MEINS)}" onchange="MaintenanceTasklist._updateCompField(${i},'MEINS',this.value)" placeholder="单位" style="width:70px;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td>
          <select onchange="MaintenanceTasklist._updateCompField(${i},'PTYPE',this.value)" style="padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;">
            <option value="stock" ${c.PTYPE==='stock'?'selected':''}>库存</option>
            <option value="nonstock" ${c.PTYPE==='nonstock'?'selected':''}>非库存</option>
          </select>
        </td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;" onclick="MaintenanceTasklist._removeComp(${i})">✕</button></td>
      </tr>`).join('');

    return `
      <div class="form-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-size:14px;font-weight:600;color:var(--text);">计划备件（物料组件）</span>
          <button class="btn btn-blue btn-sm" onclick="MaintenanceTasklist._addComp()">+ 添加物料</button>
        </div>
        ${rows ? `
          <div class="table-wrapper"><table class="data-table">
            <thead><tr><th>物料编码</th><th>物料描述</th><th style="width:90px;">需求数量</th><th style="width:80px;">单位</th><th>条目类别</th><th style="width:50px;"></th></tr></thead>
            <tbody>${rows}</tbody>
          </table></div>` : '<div style="text-align:center;padding:40px;color:var(--text-muted);"><div style="font-size:32px;margin-bottom:8px;">📦</div><div style="font-size:13px;">暂无计划备件</div></div>'}
      </div>`;
  },

  _renderToolsTab(d) {
    const rows = (d.tools || []).map((t, i) => `
      <tr>
        <td><input value="${esc(t.WRKCT||'')}" onchange="MaintenanceTasklist._updateToolField(${i},'WRKCT',this.value)" placeholder="如 PRT-001" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input value="${esc(t.WRKTX||'')}" onchange="MaintenanceTasklist._updateToolField(${i},'WRKTX',this.value)" placeholder="自由文本描述" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input type="number" value="${t.MGEIN||''}" onchange="MaintenanceTasklist._updateToolField(${i},'MGEIN',parseInt(this.value)||0)" min="0" style="width:80px;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;" onclick="MaintenanceTasklist._removeTool(${i})">✕</button></td>
      </tr>`).join('');

    return `
      <div class="form-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-size:14px;font-weight:600;color:var(--text);">工具/工装</span>
          <button class="btn btn-blue btn-sm" onclick="MaintenanceTasklist._addTool()">+ 添加工具</button>
        </div>
        ${rows ? `
          <div class="table-wrapper"><table class="data-table">
            <thead><tr><th>工具编号</th><th>工具描述</th><th style="width:90px;">数量</th><th style="width:50px;"></th></tr></thead>
            <tbody>${rows}</tbody>
          </table></div>` : '<div style="text-align:center;padding:40px;color:var(--text-muted);"><div style="font-size:32px;margin-bottom:8px;">🛠</div><div style="font-size:13px;">暂无工具配置</div></div>'}
      </div>`;
  },

  /* ========== Operation CRUD ========== */
  _addOp() {
    const ops = this._editData.operations || [];
    const nextNo = String((ops.length + 1) * 10).padStart(4, '0');
    ops.push({
      VORNR: nextNo, ARBPL: this._editData.ARBPL || '',
      LTXA1: '', STEUS: '人工工时', ARBEIT: 1,
      components: [], tools: []
    });
    this._editData.operations = ops;
    this._refreshEditTab();
  },

  _removeOp(idx) {
    this._editData.operations.splice(idx, 1);
    // Re-number operations
    this._editData.operations.forEach((op, i) => {
      op.VORNR = String((i + 1) * 10).padStart(4, '0');
    });
    this._refreshEditTab();
  },

  _moveOp(idx, dir) {
    const ops = this._editData.operations;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= ops.length) return;
    [ops[idx], ops[newIdx]] = [ops[newIdx], ops[idx]];
    ops.forEach((op, i) => { op.VORNR = String((i + 1) * 10).padStart(4, '0'); });
    this._editData.operations = ops;
    this._refreshEditTab();
  },

  _updateOpField(idx, field, value) {
    if (this._editData.operations && this._editData.operations[idx]) {
      this._editData.operations[idx][field] = value;
    }
  },

  /* ========== Operation Sub-Resources ========== */
  _addOpComponent(opIdx) {
    const op = this._editData.operations[opIdx];
    if (!op.components) op.components = [];
    const matCode = prompt('物料编码：', 'MAT-');
    if (!matCode) return;
    op.components.push({ MATNR: matCode, MAKTX: '', BDMNG: 1, MEINS: 'PC' });
    this._editData.operations[opIdx] = op;
    this._refreshEditTab();
  },

  _removeOpComponent(opIdx, compIdx) {
    if (confirm('确定删除该物料组件？')) {
      this._editData.operations[opIdx].components.splice(compIdx, 1);
      this._refreshEditTab();
    }
  },

  _addOpTool(opIdx) {
    const op = this._editData.operations[opIdx];
    if (!op.tools) op.tools = [];
    const toolName = prompt('工具描述：', '');
    if (!toolName) return;
    op.tools.push({ WRKCT: '', WRKTX: toolName, MGEIN: 1 });
    this._editData.operations[opIdx] = op;
    this._refreshEditTab();
  },

  _removeOpTool(opIdx, toolIdx) {
    if (confirm('确定删除该工具？')) {
      this._editData.operations[opIdx].tools.splice(toolIdx, 1);
      this._refreshEditTab();
    }
  },

  /* ========== Component CRUD (Header-level) ========== */
  _addComp() {
    if (!this._editData.components) this._editData.components = [];
    const matCode = prompt('物料编码：', 'MAT-');
    if (!matCode) return;
    this._editData.components.push({ MATNR: matCode, MAKTX: '', BDMNG: 1, MEINS: 'PC', PTYPE: 'stock' });
    this._refreshEditTab();
  },

  _removeComp(idx) {
    if (confirm('确定删除该物料组件？')) {
      this._editData.components.splice(idx, 1);
      this._refreshEditTab();
    }
  },

  _updateCompField(idx, field, value) {
    if (this._editData.components && this._editData.components[idx]) {
      this._editData.components[idx][field] = value;
    }
  },

  /* ========== Tool CRUD (Header-level) ========== */
  _addTool() {
    if (!this._editData.tools) this._editData.tools = [];
    const toolName = prompt('工具描述：', '');
    if (!toolName) return;
    this._editData.tools.push({ WRKCT: '', WRKTX: toolName, MGEIN: 1 });
    this._refreshEditTab();
  },

  _removeTool(idx) {
    if (confirm('确定删除该工具？')) {
      this._editData.tools.splice(idx, 1);
      this._refreshEditTab();
    }
  },

  _updateToolField(idx, field, value) {
    if (this._editData.tools && this._editData.tools[idx]) {
      this._editData.tools[idx][field] = value;
    }
  },

  _refreshEditTab() {
    this._syncEditDataFromDOM();
    this._switchEditTab(this._activeTab);
  },

  /* ========== Publish ========== */
  _publish() {
    // Sync full data from DOM first
    this._syncEditDataFromDOM();
    const d = this._editData;

    // Validate
    if (!d.PLNTY) { toast('请选择任务清单类型'); return; }
    if (!d.PLTXT.trim()) { toast('请输入任务清单描述'); return; }
    if (!d.ARBPL.trim()) { toast('请输入工作中心'); return; }
    if (!d.operations || d.operations.length === 0) { toast('至少需要一道工序'); return; }
    // Validate each operation
    for (const op of d.operations) {
      if (!op.LTXA1.trim()) { toast(`工序 ${op.VORNR} 缺少描述`); return; }
      if (!op.ARBPL.trim()) { toast(`工序 ${op.VORNR} 缺少工作中心`); return; }
    }

    closeModal();

    if (this._editingIsRevise) {
      // Edit existing: update in-place
      const oldTl = taskListMockData.find(x => x.id === this._editingId);
      if (oldTl) {
        const delFlag = d.DEL_FLAG || false;
        Object.assign(oldTl, d);
        oldTl.id = this._editingId;
        oldTl.PLNST = delFlag ? '已停用' : '已发布';
        oldTl.LAST_SYNC = new Date().toISOString().slice(0,10);
        toast(`任务清单 ${d.PLNNR} 已更新！${delFlag ? '（已标记删除）' : ''}`);
      }
    } else {
      // New: simulate SAP returning PLNNR and PLNAL
      const newNo = String(taskListMockData.length + 1).padStart(7, '0');
      d.PLNNR = 'TL' + newNo.slice(-4);
      d.PLNAL = '1';
      d.PLNST = '已发布';
      d.ERNAM = '设备部主管';
      d.ERDAT = new Date().toISOString().slice(0, 10);
      d.LAST_SYNC = d.ERDAT;
      d.id = 'TL' + String(taskListMockData.length + 1).padStart(3, '0');
      taskListMockData.push(JSON.parse(JSON.stringify(d)));
      toast(`任务清单 ${d.PLNNR} 已发布！编码由 SAP 生成`);
    }

    this._editingId = null;
    this._editingIsRevise = false;
    this._editData = null;
    this.filtered = [...taskListMockData];
    this.page = 1;
    this.renderTable();
  }
};
