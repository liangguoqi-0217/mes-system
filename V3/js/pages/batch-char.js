/* ==================== 批次特性管理 ====================
 * 双 Tab 页面：
 *   Tab1「批次特性修改」：输入 工厂 + 物料 + 批次 → 查询 → 读取该批次特性
 *                          → 直接修改特性值 → 提交（返回成功/失败）
 *   Tab2「修改记录」：查询修改历史（原值→新值）
 * 架构：MES 全程不涉及数据库增删查改，仅做前端展示与接口调用，
 *       批次特性数据由核心系统（SAP）统一维护。
 * 接口：SAP_MOCK.getBatchChars / SAP_MOCK.changeBatchChar / SAP_MOCK.getBatchCharLogs
 */
const BatchChar = {
  _version: '1.2-20260825',
  activeTab: 'modify', // 'modify' | 'log'
  page: 1, pageSize: 10,
  // Tab1 状态
  query: null,          // { factory, materialCode, batchNo }
  current: null,        // 当前批次（抬头 + 行项目特性）
  charsSnapshot: [],    // 原始特性快照（用于比对变更）
  submitting: false,
  // Tab2 状态
  logData: [],
  logTotal: 0,

  factoryOptions: [
    { code: '1000', name: '山东步长制药工厂' },
    { code: '2001', name: '陕西步长制药工厂' },
    { code: '2002', name: '山东丹红制药工厂' }
  ],

  getFactoryName(code) {
    const f = this.factoryOptions.find(x => x.code === code);
    return f ? f.name : (code || '-');
  },

  // ==================== 渲染页面 ====================

  render() {
    this.page = 1;
    return `
      <div class="bc-page" style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <!-- 顶部标题栏 -->
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">批次特性</div>
            <div style="font-size:13px;opacity:0.8;">库存管理 → 物料主数据 → 批次特性</div>
          </div>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.25);" onclick="BatchChar.refresh()">刷新数据</button>
        </div>

        <!-- Tabs -->
        <div class="tabs" style="margin:0;padding:0 24px;background:white;border-bottom:1px solid var(--border);flex-shrink:0;">
          <div class="tab ${this.activeTab==='modify'?'active':''}" id="bcTabModify" onclick="BatchChar.switchTab('modify')">批次特性修改</div>
          <div class="tab ${this.activeTab==='log'?'active':''}" id="bcTabLog" onclick="BatchChar.switchTab('log')">修改记录 <span class="badge badge-gray badge-sm" id="bcLogCount" style="margin-left:4px;">0</span></div>
        </div>

        <!-- 筛选栏 -->
        <div id="bcFilterBar" style="flex-shrink:0;"></div>

        <!-- 结果区（Tab1：批次特性编辑；Tab2：记录表格） -->
        <div id="bcResultArea" style="flex:1;overflow:auto;padding:16px 20px;"></div>

        <!-- 底部工具栏（Tab2 分页） -->
        <div id="bcFooterBar" style="flex-shrink:0;"></div>
      </div>`;
  },

  init() {
    this.renderFilterBar();
    const footer = document.getElementById('bcFooterBar');
    if (this.activeTab === 'modify') {
      if (footer) footer.innerHTML = '';
      this.renderResultArea();
    } else {
      this.loadLogs();
    }
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.page = 1;
    document.getElementById('bcTabModify').className = 'tab' + (tab === 'modify' ? ' active' : '');
    document.getElementById('bcTabLog').className = 'tab' + (tab === 'log' ? ' active' : '');
    this.init();
  },

  refresh() {
    this.init();
    toast('数据已刷新');
  },

  // ==================== 筛选栏 ====================

  renderFilterBar() {
    const el = document.getElementById('bcFilterBar');
    if (!el) return;

    if (this.activeTab === 'modify') {
      el.innerHTML = `<div class="filter-bar">
        <div class="filter-group"><label>工厂 <span style="color:#dc2626;">*</span></label><select id="bcFactory">
          <option value="">请选择</option>
          ${this.factoryOptions.map(f => `<option value="${f.code}">${f.name}</option>`).join('')}
        </select></div>
        <div class="filter-group"><label>物料号 <span style="color:#dc2626;">*</span></label><input type="text" id="bcMaterial" placeholder="物料号"></div>
        <div class="filter-group"><label>批次 <span style="color:#dc2626;">*</span></label><input type="text" id="bcBatch" placeholder="批次号"></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="BatchChar.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="BatchChar.resetFilter()">重置</button>
        </div>
      </div>`;
    } else {
      el.innerHTML = `<div class="filter-bar">
        <div class="filter-group"><label>批次号</label><input type="text" id="bcLogBatch" placeholder="模糊查询"></div>
        <div class="filter-group"><label>特性</label><input type="text" id="bcLogChar" placeholder="特性名称模糊查询"></div>
        <div class="filter-group"><label>修改人</label><input type="text" id="bcLogBy" placeholder="模糊查询"></div>
        <div class="filter-group"><label>修改日期</label><input type="date" id="bcLogDate"></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="BatchChar.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="BatchChar.resetFilter()">重置</button>
        </div>
      </div>`;
    }
  },

  search() {
    if (this.activeTab === 'modify') this.queryBatch();
    else this.loadLogs();
  },

  resetFilter() {
    if (this.activeTab === 'modify') {
      ['bcFactory', 'bcMaterial', 'bcBatch'].forEach(id => { const e = document.getElementById(id); if (e) e.value = ''; });
      this.query = null;
      this.current = null;
      this.charsSnapshot = [];
      const footer = document.getElementById('bcFooterBar');
      if (footer) footer.innerHTML = '';
      this.renderResultArea();
    } else {
      ['bcLogBatch', 'bcLogChar', 'bcLogBy', 'bcLogDate'].forEach(id => { const e = document.getElementById(id); if (e) e.value = ''; });
      this.loadLogs();
    }
  },

  // ==================== Tab1：查询批次 ====================

  queryBatch() {
    const factory = document.getElementById('bcFactory')?.value || '';
    const materialCode = document.getElementById('bcMaterial')?.value.trim() || '';
    const batchNo = document.getElementById('bcBatch')?.value.trim() || '';
    if (!factory) { toast('请选择工厂'); return; }
    if (!materialCode) { toast('请输入物料号'); return; }
    if (!batchNo) { toast('请输入批次号'); return; }
    this.query = { factory, materialCode, batchNo };
    this.current = null;
    this.charsSnapshot = [];
    this.renderResultArea('loading');
    SAP_MOCK.showLoading('正在查询批次特性，请稍候…');
    SAP_MOCK.getBatchChars(this.query).then(res => {
      SAP_MOCK.hideLoading();
      this.current = res.data || null;
      this.charsSnapshot = this.current ? this.current.chars.map(c => ({ charCode: c.charCode, charValue: c.charValue })) : [];
      this.renderResultArea();
    }).catch(err => {
      SAP_MOCK.hideLoading();
      this.renderResultArea('error', (err && err.message) ? err.message : '查询失败，请稍后重试');
    });
  },

  renderResultArea(state, errMsg) {
    const el = document.getElementById('bcResultArea');
    if (!el) return;
    if (state === 'loading') {
      el.innerHTML = this._centerHint('正在查询批次特性…');
      return;
    }
    if (!this.query) {
      el.innerHTML = this._centerHint('请输入 工厂 + 物料号 + 批次 后点击「查询」', '查询后将展示该批次的特性数据，可直接编辑并提交', false, true);
      return;
    }
    if (state === 'error' || !this.current) {
      el.innerHTML = this._centerHint(errMsg || '未查询到该物料批次的特性数据，请检查工厂/物料/批次后重试。', '可修改查询条件后重新查询，或点击下方按钮查看示例', true, true);
      return;
    }
    el.innerHTML = this._resultHtml(this.current);
  },

  // 填入示例数据并自动查询（便于快速查看原型效果）
  fillDemo() {
    const f = document.getElementById('bcFactory');
    const m = document.getElementById('bcMaterial');
    const b = document.getElementById('bcBatch');
    if (f) f.value = '1000';
    if (m) m.value = 'M10001';
    if (b) b.value = 'B260601';
    this.queryBatch();
  },

  _centerHint(title, sub, isError, showDemo) {
    return `<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-muted);text-align:center;">
      <div style="font-size:15px;font-weight:600;color:${isError ? '#dc2626' : 'var(--text-secondary)'};">${title}</div>
      ${sub ? `<div style="margin-top:8px;font-size:12px;">${sub}</div>` : ''}
      ${showDemo ? `<button class="btn btn-primary btn-sm" style="margin-top:20px;" onclick="BatchChar.fillDemo()">填入示例数据并查询</button>` : ''}
    </div>`;
  },

  _resultHtml(d) {
    return `
      <div class="form-section" style="background:#fff;border:1px solid var(--border);border-radius:8px;padding:16px;">
        <div class="form-section-title">批次信息</div>
        <div class="detail-grid" style="grid-template-columns:repeat(3,minmax(0,1fr));">
          <div class="detail-item"><dt>工厂</dt><dd>${esc(this.getFactoryName(d.factory))}</dd></div>
          <div class="detail-item"><dt>物料号</dt><dd style="font-family:monospace;font-size:12px;">${esc(d.materialCode)}</dd></div>
          <div class="detail-item"><dt>批次</dt><dd><strong style="color:#2563eb;font-family:monospace;font-size:12px;">${esc(d.batchNo)}</strong></dd></div>
        </div>
      </div>

      <div class="form-section" style="background:#fff;border:1px solid var(--border);border-radius:8px;padding:16px;margin-top:14px;">
        <div class="form-section-title">批次特性（可直接编辑，提交后写回）</div>
        <table class="data-table data-table-compact" style="min-width:900px;">
          <thead><tr>
            <th style="width:90px;">特性编码</th>
            <th style="width:180px;">特性名称</th>
            <th style="width:90px;">单位</th>
            <th style="width:220px;">当前值（可编辑）</th>
            <th style="width:150px;">原值</th>
            <th style="width:110px;">修改状态</th>
          </tr></thead>
          <tbody>
            ${d.chars.map(c => this._charEditRow(d, c)).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-top:16px;display:flex;justify-content:flex-end;gap:10px;">
        <button class="btn btn-secondary" onclick="BatchChar.queryBatch()">重新查询</button>
        <button class="btn btn-primary" id="bcSubmitBtn" onclick="BatchChar.saveChanges()">提交修改</button>
      </div>`;
  },

  _charEditRow(d, c) {
    return `<tr id="bcRow_${c.charCode}">
      <td style="font-family:monospace;font-size:12px;">${esc(c.charCode)}</td>
      <td>${esc(c.charName)}</td>
      <td>${esc(c.unit || '-')}</td>
      <td><input type="text" id="bcChar_${c.charCode}" value="${esc(c.charValue)}" oninput="BatchChar.onCharInput('${c.charCode}')" style="width:160px;font-weight:600;color:#2563eb;border:1px solid var(--border);border-radius:4px;padding:4px 8px;"></td>
      <td style="font-size:12px;color:var(--text-secondary);">${esc(c.charValue)}</td>
      <td><span id="bcBadge_${c.charCode}"><span class="badge badge-gray">未修改</span></span></td>
    </tr>`;
  },

  onCharInput(charCode) {
    const el = document.getElementById('bcChar_' + charCode);
    const row = document.getElementById('bcRow_' + charCode);
    const badgeEl = document.getElementById('bcBadge_' + charCode);
    if (!el || !badgeEl) return;
    const snap = this.charsSnapshot.find(s => s.charCode === charCode);
    const changed = el.value.trim() !== (snap ? snap.charValue : '');
    badgeEl.innerHTML = changed ? '<span class="badge badge-yellow">已修改</span>' : '<span class="badge badge-gray">未修改</span>';
    if (row) row.style.background = changed ? '#fffbeb' : '';
  },

  saveChanges() {
    if (this.submitting) return;
    const d = this.current;
    if (!d) return;
    // 收集变更项（与原始快照比对）
    const changed = [];
    d.chars.forEach(c => {
      const el = document.getElementById('bcChar_' + c.charCode);
      const snap = this.charsSnapshot.find(s => s.charCode === c.charCode);
      const oldValue = snap ? snap.charValue : c.charValue;
      const newValue = el ? el.value.trim() : c.charValue;
      if (newValue !== oldValue) {
        changed.push({ charCode: c.charCode, charName: c.charName, unit: c.unit, oldValue, newValue });
      }
    });
    if (!changed.length) { toast('没有修改任何特性值'); return; }

    this.submitting = true;
    const btn = document.getElementById('bcSubmitBtn');
    if (btn) { btn.disabled = true; btn.textContent = '提交中…'; }
    SAP_MOCK.showLoading('正在提交修改，请稍候…');
    SAP_MOCK.changeBatchChar({
      factory: this.query.factory,
      batchNo: d.batchNo,
      materialCode: d.materialCode,
      materialName: d.materialName,
      changes: changed
    }).then(res => {
      SAP_MOCK.hideLoading();
      this.submitting = false;
      toast(`修改成功：${res.changedCount} 项特性已更新`);
      // 重新查询，展示最新值
      this.queryBatch();
    }).catch(err => {
      SAP_MOCK.hideLoading();
      this.submitting = false;
      const btn2 = document.getElementById('bcSubmitBtn');
      if (btn2) { btn2.disabled = false; btn2.textContent = '提交修改'; }
      toast((err && err.message) ? err.message : '提交失败，请重试');
    });
  },

  // ==================== Tab2：修改记录 ====================

  loadLogs() {
    this.page = 1;
    const batch = document.getElementById('bcLogBatch')?.value.trim() || '';
    const ch = document.getElementById('bcLogChar')?.value.trim() || '';
    const by = document.getElementById('bcLogBy')?.value.trim() || '';
    const date = document.getElementById('bcLogDate')?.value || '';
    const el = document.getElementById('bcResultArea');
    if (el) el.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;padding:60px 0;color:var(--text-muted);font-size:13px;">正在查询修改记录…</div>`;
    SAP_MOCK.showLoading('正在查询修改记录…');
    SAP_MOCK.getBatchCharLogs({ batch, char: ch, by, date }).then(res => {
      SAP_MOCK.hideLoading();
      this.logData = res.list || [];
      this.logTotal = (typeof res.total === 'number') ? res.total : this.logData.length;
      const countEl = document.getElementById('bcLogCount');
      if (countEl) countEl.textContent = this.logTotal;
      this.renderTable();
      this.renderPagination();
    }).catch(err => {
      SAP_MOCK.hideLoading();
      toast((err && err.message) ? err.message : '查询失败，请重试');
    });
  },

  // ==================== 表格（Tab2 修改记录） ====================

  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.logData.slice(start, start + this.pageSize);
    const el = document.getElementById('bcResultArea');
    if (!el) return;

    el.innerHTML = `<table class="data-table" style="min-width:1300px;">
      <thead><tr>
        <th style="width:60px;">序号</th>
        <th style="width:150px;">记录号</th>
        <th style="width:140px;">批次号</th>
        <th style="width:110px;">物料号</th>
        <th style="width:150px;">特性</th>
        <th style="width:200px;">原值 → 新值</th>
        <th style="width:90px;">修改人</th>
        <th style="width:150px;">修改时间</th>
        <th>修改原因</th>
      </tr></thead>
      <tbody>${page.length ? page.map((r, i) => this.renderLogRow(r, start + i + 1)).join('') : `<tr><td colspan="9" class="empty-cell">暂无修改记录</td></tr>`}</tbody>
    </table>`;
  },

  renderLogRow(r, idx) {
    return `<tr>
      <td>${idx}</td>
      <td style="font-family:monospace;font-size:12px;">${esc(r.logNo)}</td>
      <td style="color:#2563eb;font-weight:600;font-family:monospace;font-size:12px;">${esc(r.batchNo)}</td>
      <td style="font-family:monospace;font-size:12px;">${esc(r.materialCode)}</td>
      <td>${esc(r.charName)}</td>
      <td><span style="color:#9ca3af;text-decoration:line-through;">${esc(r.oldValue)}</span> <span style="color:#10b981;font-weight:600;">→ ${esc(r.newValue)}</span>${r.unit ? ` <span style="color:var(--text-muted);font-size:11px;">${esc(r.unit)}</span>` : ''}</td>
      <td>${esc(r.changeBy)}</td>
      <td style="font-size:12px;">${r.changeTime}</td>
      <td>${esc(r.reason || '-')}</td>
    </tr>`;
  },

  // ==================== 分页 ====================

  renderPagination() {
    const el = document.getElementById('bcFooterBar');
    if (!el) return;
    const total = this.logData.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.page > totalPages) this.page = totalPages;

    el.innerHTML = `<div class="pagination">
      <span style="color:var(--text-muted);font-size:12px;margin-right:12px;">共 ${total} 条</span>
      <button class="pagination-btn" onclick="BatchChar.prevPage()" ${this.page <= 1 ? 'disabled' : ''}>‹</button>
      <span class="pagination-info">第 ${this.page} / ${totalPages} 页</span>
      <button class="pagination-btn" onclick="BatchChar.nextPage()" ${this.page >= totalPages ? 'disabled' : ''}>›</button>
      <select class="page-size-select" onchange="BatchChar.changePageSize(this.value)">
        ${[10, 20, 50].map(s => `<option value="${s}" ${s === this.pageSize ? 'selected' : ''}>${s}条/页</option>`).join('')}
      </select>
    </div>`;
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); this.renderPagination(); } },

  nextPage() {
    const totalPages = Math.ceil(Math.max(this.logData.length, 1) / this.pageSize);
    if (this.page < totalPages) { this.page++; this.renderTable(); this.renderPagination(); }
  },

  changePageSize(v) { this.pageSize = Number(v); this.page = 1; this.renderTable(); this.renderPagination(); }
};
