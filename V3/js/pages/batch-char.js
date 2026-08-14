/* ==================== 批次特性管理 ====================
 * 双 Tab 页面：
 *   Tab1「批次特性修改」：按工厂/物料/批次查询批次，查看弹窗内编辑特性值并保存（自动写入修改记录）
 *   Tab2「修改记录」：按批次/特性/修改人/日期查询修改历史（原值→新值、修改原因）
 * 数据：batchCharData（批次特性主数据）、batchCharLogData（修改记录）
 * 接口：SAP_MOCK.changeBatchChar
 */
const BatchChar = {
  _version: '1.0-20260814',
  activeTab: 'modify', // 'modify' | 'log'
  page: 1, pageSize: 10,
  filtered: [],
  editingBatchNo: '',

  factoryOptions: [
    { code: '1000', name: '山东步长制药工厂' },
    { code: '2001', name: '陕西步长制药工厂' },
    { code: '2002', name: '山东丹红制药工厂' }
  ],

  // 工厂编码 → 名称映射
  getFactoryName(code) {
    const f = this.factoryOptions.find(x => x.code === code);
    return f ? f.name : (code || '-');
  },

  getStatusBadge() {
    return `<span class="badge badge-blue">已生效</span>`;
  },

  getChangedBadge(n) {
    if (!n) return '<span class="badge badge-gray">未修改</span>';
    return `<span class="badge badge-yellow">修改 ${n} 项</span>`;
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
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.25);" onclick="BatchChar.refresh()">🔄 刷新数据</button>
        </div>

        <!-- Tabs -->
        <div class="tabs" style="margin:0;padding:0 24px;background:white;border-bottom:1px solid var(--border);flex-shrink:0;">
          <div class="tab ${this.activeTab==='modify'?'active':''}" id="bcTabModify" onclick="BatchChar.switchTab('modify')">✏️ 批次特性修改 <span class="badge badge-blue badge-sm" style="margin-left:4px;">${batchCharData.length}</span></div>
          <div class="tab ${this.activeTab==='log'?'active':''}" id="bcTabLog" onclick="BatchChar.switchTab('log')">📋 修改记录 <span class="badge badge-gray badge-sm" style="margin-left:4px;">${batchCharLogData.length}</span></div>
        </div>

        <!-- 筛选栏 -->
        <div id="bcFilterBar" style="flex-shrink:0;"></div>

        <!-- 表格区域 -->
        <div class="table-wrapper" style="flex:1;overflow:auto;" id="bcTableWrapper"></div>

        <!-- 底部分页 -->
        <div id="bcPagination" style="flex-shrink:0;"></div>

        <!-- 弹窗容器 -->
        <div id="bcModalContainer"></div>
      </div>`;
  },

  init() {
    this.renderFilterBar();
    this.renderTable();
    this.renderPagination();
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
        <div class="filter-group"><label>工厂</label><select id="bcFactory">
          <option value="">全部</option>
          ${this.factoryOptions.map(f => `<option value="${f.code}">${f.name}</option>`).join('')}
        </select></div>
        <div class="filter-group"><label>物料编码</label><input type="text" id="bcMaterial" placeholder="模糊查询"></div>
        <div class="filter-group"><label>批次号</label><input type="text" id="bcBatch" placeholder="模糊查询"></div>
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
    this.page = 1;
    this.renderTable();
    this.renderPagination();
  },

  resetFilter() {
    const ids = ['bcFactory', 'bcMaterial', 'bcBatch', 'bcLogBatch', 'bcLogChar', 'bcLogBy', 'bcLogDate'];
    ids.forEach(id => { const e = document.getElementById(id); if (e) e.value = ''; });
    this.search();
  },

  // ==================== 表格 ====================

  renderTable() {
    if (this.activeTab === 'modify') {
      this.filtered = this.filterModifyRows();
      this.renderModifyTable();
    } else {
      this.filtered = this.filterLogRows();
      this.renderLogTable();
    }
  },

  filterModifyRows() {
    const factory = document.getElementById('bcFactory')?.value || '';
    const material = document.getElementById('bcMaterial')?.value.trim() || '';
    const batch = document.getElementById('bcBatch')?.value.trim() || '';
    return batchCharData.filter(d => {
      if (factory && d.factory !== factory) return false;
      if (material && !(d.materialCode.includes(material) || d.materialName.includes(material))) return false;
      if (batch && !d.batchNo.includes(batch)) return false;
      return true;
    });
  },

  filterLogRows() {
    const batch = document.getElementById('bcLogBatch')?.value.trim() || '';
    const ch = document.getElementById('bcLogChar')?.value.trim() || '';
    const by = document.getElementById('bcLogBy')?.value.trim() || '';
    const date = document.getElementById('bcLogDate')?.value || '';
    return batchCharLogData.filter(r => {
      if (batch && !r.batchNo.includes(batch)) return false;
      if (ch && !(r.charName.includes(ch) || r.charCode.includes(ch))) return false;
      if (by && !r.changeBy.includes(by)) return false;
      if (date && !r.changeTime.startsWith(date)) return false;
      return true;
    });
  },

  renderModifyTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const el = document.getElementById('bcTableWrapper');
    if (!el) return;

    el.innerHTML = `<table class="data-table" style="min-width:1200px;">
      <thead><tr>
        <th style="width:50px;">序号</th>
        <th style="width:150px;">批次号</th>
        <th style="width:110px;">物料编码</th>
        <th style="width:150px;">物料名称</th>
        <th style="width:170px;">工厂</th>
        <th style="width:110px;">库位</th>
        <th style="width:90px;">特性数</th>
        <th style="width:100px;">最近修改人</th>
        <th style="width:150px;">最近修改时间</th>
        <th style="width:80px;">操作</th>
      </tr></thead>
      <tbody>${page.length ? page.map((d, i) => this.renderModifyRow(d, start + i + 1)).join('') : `<tr><td colspan="10" class="empty-cell">暂无符合条件的批次</td></tr>`}</tbody>
    </table>`;
  },

  renderModifyRow(d, idx) {
    const log = batchCharLogData.filter(l => l.batchNo === d.batchNo).length;
    return `<tr>
      <td>${idx}</td>
      <td style="color:#2563eb;font-weight:600;font-family:monospace;font-size:12px;">${esc(d.batchNo)}</td>
      <td style="font-family:monospace;font-size:12px;">${esc(d.materialCode)}</td>
      <td>${esc(d.materialName)}</td>
      <td>${esc(this.getFactoryName(d.factory))}</td>
      <td>${esc(d.location)}</td>
      <td>${d.chars.length}</td>
      <td>${esc(d.updateBy || '-')}</td>
      <td style="font-size:12px;">${d.updateTime || '—'}</td>
      <td><button class="btn btn-blue btn-sm" onclick="BatchChar.openViewModal('${d.batchNo}')">查看</button></td>
    </tr>`;
  },

  renderLogTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const el = document.getElementById('bcTableWrapper');
    if (!el) return;

    el.innerHTML = `<table class="data-table" style="min-width:1300px;">
      <thead><tr>
        <th style="width:60px;">序号</th>
        <th style="width:140px;">记录号</th>
        <th style="width:140px;">批次号</th>
        <th style="width:110px;">物料编码</th>
        <th style="width:140px;">特性</th>
        <th style="width:180px;">原值 → 新值</th>
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
    const el = document.getElementById('bcPagination');
    if (!el) return;
    const total = this.filtered.length;
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
    const totalPages = Math.ceil(Math.max(this.filtered.length, 1) / this.pageSize);
    if (this.page < totalPages) { this.page++; this.renderTable(); this.renderPagination(); }
  },

  changePageSize(v) { this.pageSize = Number(v); this.page = 1; this.renderTable(); this.renderPagination(); },

  // ==================== 查看弹窗（Tab1：特性修改） ====================

  openViewModal(batchNo) {
    const d = batchCharData.find(x => x.batchNo === batchNo);
    if (!d) return;
    this.editingBatchNo = batchNo;
    const cont = document.getElementById('bcModalContainer');
    cont.innerHTML = `
      <div class="modal-backdrop" id="bcModalBackdrop" onclick="BatchChar.closeModal()">
        <div class="modal" style="width:96vw;max-width:96vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">批次特性 <span style="font-family:monospace;color:#2563eb;">${esc(d.batchNo)}</span> <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">${esc(d.materialCode)} · ${esc(d.materialName)}</span></div>
            <button class="modal-close" onclick="BatchChar.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            <div class="form-section">
              <div class="form-section-title">批次信息</div>
              <div class="detail-grid" style="grid-template-columns:repeat(6,minmax(0,1fr));">
                <div class="detail-item"><dt>批次号</dt><dd><strong>${esc(d.batchNo)}</strong></dd></div>
                <div class="detail-item"><dt>状态</dt><dd>${this.getStatusBadge()}</dd></div>
                <div class="detail-item"><dt>物料编码</dt><dd>${esc(d.materialCode)}</dd></div>
                <div class="detail-item"><dt>物料名称</dt><dd>${esc(d.materialName)}</dd></div>
                <div class="detail-item"><dt>工厂</dt><dd>${esc(this.getFactoryName(d.factory))}</dd></div>
                <div class="detail-item"><dt>库位</dt><dd>${esc(d.location)}</dd></div>
                <div class="detail-item"><dt>最近修改人</dt><dd>${esc(d.updateBy || '-')}</dd></div>
                <div class="detail-item"><dt>最近修改时间</dt><dd>${esc(d.updateTime || '-')}</dd></div>
              </div>
            </div>
            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">特性值（可直接编辑修改）</div>
              <table class="data-table data-table-compact" style="min-width:900px;">
                <thead><tr>
                  <th style="width:80px;">特性编码</th>
                  <th style="width:160px;">特性名称</th>
                  <th style="width:120px;">单位</th>
                  <th>当前值</th>
                  <th style="width:200px;">修改记录</th>
                </tr></thead>
                <tbody>
                  ${d.chars.map(c => this.renderCharEditRow(d, c)).join('')}
                </tbody>
              </table>
            </div>
            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">修改原因（必填）</div>
              <input type="text" id="bcReason" placeholder="请填写本次修改的原因，如：复检结果更新 / 批次放行调整等" style="width:100%;">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="BatchChar.closeModal()">关闭</button>
            <button class="btn btn-primary" onclick="BatchChar.saveChanges()">💾 保存修改</button>
          </div>
        </div>
      </div>`;
  },

  renderCharEditRow(d, c) {
    const logs = batchCharLogData
      .filter(l => l.batchNo === d.batchNo && l.charCode === c.charCode)
      .slice(0, 3)
      .map(l => `${esc(l.oldValue)} → ${esc(l.newValue)}（${esc(l.changeBy)} ${l.changeTime.slice(0, 10)}）`)
      .join('<br>');
    return `<tr>
      <td style="font-family:monospace;font-size:12px;">${esc(c.charCode)}</td>
      <td>${esc(c.charName)}</td>
      <td>${esc(c.unit || '-')}</td>
      <td><input type="text" id="bcChar_${esc(c.charCode)}" value="${esc(c.charValue)}" style="width:140px;font-weight:600;color:#2563eb;"></td>
      <td style="font-size:11px;color:var(--text-secondary);">${logs || '<span class="badge badge-gray">未修改</span>'}</td>
    </tr>`;
  },

  saveChanges() {
    const d = batchCharData.find(x => x.batchNo === this.editingBatchNo);
    if (!d) return;
    const reason = document.getElementById('bcReason')?.value.trim();
    if (!reason) { toast('请填写修改原因'); return; }

    // 收集变更项
    const changed = [];
    d.chars.forEach(c => {
      const el = document.getElementById('bcChar_' + c.charCode);
      if (el && el.value.trim() !== c.charValue) {
        changed.push({ charCode: c.charCode, charName: c.charName, unit: c.unit, oldValue: c.charValue, newValue: el.value.trim() });
      }
    });
    if (!changed.length) { toast('没有修改任何特性值'); return; }

    SAP_MOCK.showLoading();
    SAP_MOCK.changeBatchChar({
      batchNo: d.batchNo,
      materialCode: d.materialCode,
      reason,
      changes: changed
    }).then(res => {
      SAP_MOCK.hideLoading();
      // 回写主数据
      changed.forEach(ch => {
        const c = d.chars.find(x => x.charCode === ch.charCode);
        if (c) c.charValue = ch.newValue;
      });
      const now = res.changeTime;
      d.updateBy = res.changeBy;
      d.updateTime = now;
      // 写入修改记录
      changed.forEach(ch => {
        batchCharLogData.unshift({
          logNo: res.logNo + '-' + String(batchCharLogData.length + 1).padStart(3, '0'),
          batchNo: d.batchNo,
          materialCode: d.materialCode,
          charCode: ch.charCode,
          charName: ch.charName,
          unit: ch.unit || '',
          oldValue: ch.oldValue,
          newValue: ch.newValue,
          changeBy: res.changeBy,
          changeTime: now,
          reason
        });
      });
      toast(`批次特性修改成功，SAP 记录号：${res.logNo}`);
      this.closeModal();
      this.renderTable();
      this.renderPagination();
      // 更新 Tab 徽标
      const e1 = document.getElementById('bcTabLog');
      if (e1) e1.innerHTML = `📋 修改记录 <span class="badge badge-gray badge-sm" style="margin-left:4px;">${batchCharLogData.length}</span>`;
    }).catch(err => {
      SAP_MOCK.hideLoading();
      toast(err && err.message ? err.message : '修改失败，请重试');
    });
  },

  // ==================== 弹窗通用 ====================

  closeModal() {
    const cont = document.getElementById('bcModalContainer');
    if (cont) cont.innerHTML = '';
  }
};

/* ---------------- 模拟数据：批次特性主数据 ---------------- */
const batchCharData = [
  {
    batchNo: 'B260601', materialCode: 'M10001', materialName: '黄芩提取物',
    factory: '1000', location: 'A01原料仓',
    updateBy: '刘敏', updateTime: '2026-07-03 10:26',
    chars: [
      { charCode: 'CHAR01', charName: '黄芩苷含量', charValue: '92.5', unit: '%' },
      { charCode: 'CHAR02', charName: '水分', charValue: '4.2', unit: '%' },
      { charCode: 'CHAR03', charName: '粒度（通过100目）', charValue: '96.0', unit: '%' },
      { charCode: 'CHAR04', charName: '性状', charValue: '棕黄色粉末', unit: '' },
      { charCode: 'CHAR05', charName: '灰分', charValue: '3.1', unit: '%' }
    ]
  },
  {
    batchNo: 'B260602', materialCode: 'M10012', materialName: '药用淀粉',
    factory: '1000', location: 'A01原料仓',
    updateBy: '王芳', updateTime: '2026-07-05 14:02',
    chars: [
      { charCode: 'CHAR01', charName: '干燥失重', charValue: '11.8', unit: '%' },
      { charCode: 'CHAR02', charName: 'pH值', charValue: '5.6', unit: '' },
      { charCode: 'CHAR03', charName: '粒度', charValue: '合格', unit: '' },
      { charCode: 'CHAR04', charName: '性状', charValue: '白色粉末', unit: '' }
    ]
  },
  {
    batchNo: 'B260607', materialCode: 'M10001', materialName: '黄芩提取物',
    factory: '1000', location: 'B01线边仓',
    updateBy: '赵磊', updateTime: '2026-07-21 09:15',
    chars: [
      { charCode: 'CHAR01', charName: '黄芩苷含量', charValue: '91.8', unit: '%' },
      { charCode: 'CHAR02', charName: '水分', charValue: '4.5', unit: '%' },
      { charCode: 'CHAR03', charName: '粒度（通过100目）', charValue: '95.2', unit: '%' },
      { charCode: 'CHAR04', charName: '性状', charValue: '棕黄色粉末', unit: '' },
      { charCode: 'CHAR05', charName: '灰分', charValue: '3.4', unit: '%' }
    ]
  },
  {
    batchNo: 'B260608', materialCode: 'M10018', materialName: '硬脂酸镁',
    factory: '2001', location: 'A02辅料仓',
    updateBy: '张伟', updateTime: '2026-07-10 16:40',
    chars: [
      { charCode: 'CHAR01', charName: '含量', charValue: '98.6', unit: '%' },
      { charCode: 'CHAR02', charName: '干燥失重', charValue: '3.8', unit: '%' },
      { charCode: 'CHAR03', charName: '粒度（通过200目）', charValue: '92.0', unit: '%' },
      { charCode: 'CHAR04', charName: '性状', charValue: '白色疏松粉末', unit: '' }
    ]
  },
  {
    batchNo: 'B250812', materialCode: 'M20015', materialName: '乳糖（药用）',
    factory: '1000', location: 'A02辅料仓',
    updateBy: '刘敏', updateTime: '2026-07-08 11:20',
    chars: [
      { charCode: 'CHAR01', charName: '含量', charValue: '99.2', unit: '%' },
      { charCode: 'CHAR02', charName: '水分', charValue: '4.9', unit: '%' },
      { charCode: 'CHAR03', charName: '比旋度', charValue: '+52.3', unit: '°' },
      { charCode: 'CHAR04', charName: '性状', charValue: '白色结晶性粉末', unit: '' }
    ]
  },
  {
    batchNo: 'P260610', materialCode: 'F50001', materialName: '脑心通胶囊 0.4g*36粒',
    factory: '1000', location: 'C02成品暂存间',
    updateBy: '王芳', updateTime: '2026-07-11 15:30',
    chars: [
      { charCode: 'CHAR01', charName: '含量测定', charValue: '98.7', unit: '%' },
      { charCode: 'CHAR02', charName: '崩解时限', charValue: '18', unit: 'min' },
      { charCode: 'CHAR03', charName: '装量差异', charValue: '合格', unit: '' },
      { charCode: 'CHAR04', charName: '微生物限度', charValue: '合格', unit: '' },
      { charCode: 'CHAR05', charName: '性状', charValue: '内容物为棕黄色粉末', unit: '' }
    ]
  },
  {
    batchNo: 'P260618', materialCode: 'F50021', materialName: '稳心颗粒 5g*9袋',
    factory: '2002', location: 'C01暂存间',
    updateBy: '赵磊', updateTime: '2026-07-19 10:05',
    chars: [
      { charCode: 'CHAR01', charName: '含量测定', charValue: '99.1', unit: '%' },
      { charCode: 'CHAR02', charName: '粒度', charValue: '合格', unit: '' },
      { charCode: 'CHAR03', charName: '溶化性', charValue: '合格', unit: '' },
      { charCode: 'CHAR04', charName: '微生物限度', charValue: '合格', unit: '' },
      { charCode: 'CHAR05', charName: '性状', charValue: '棕黄色颗粒', unit: '' }
    ]
  }
];

/* ---------------- 模拟数据：批次特性修改记录 ---------------- */
const batchCharLogData = [
  {
    logNo: 'BCL-20260703-001', batchNo: 'B260601', materialCode: 'M10001',
    charCode: 'CHAR01', charName: '黄芩苷含量', unit: '%',
    oldValue: '91.8', newValue: '92.5', changeBy: '刘敏', changeTime: '2026-07-03 10:26',
    reason: '复检结果更新'
  },
  {
    logNo: 'BCL-20260705-001', batchNo: 'B260602', materialCode: 'M10012',
    charCode: 'CHAR02', charName: 'pH值', unit: '',
    oldValue: '5.8', newValue: '5.6', changeBy: '王芳', changeTime: '2026-07-05 14:02',
    reason: '检验数据修正'
  },
  {
    logNo: 'BCL-20260708-001', batchNo: 'B250812', materialCode: 'M20015',
    charCode: 'CHAR02', charName: '水分', unit: '%',
    oldValue: '5.2', newValue: '4.9', changeBy: '刘敏', changeTime: '2026-07-08 11:20',
    reason: '仓库复检结果更新'
  },
  {
    logNo: 'BCL-20260710-001', batchNo: 'B260608', materialCode: 'M10018',
    charCode: 'CHAR03', charName: '粒度（通过200目）', unit: '%',
    oldValue: '90.5', newValue: '92.0', changeBy: '张伟', changeTime: '2026-07-10 16:40',
    reason: '第三方检测报告确认'
  },
  {
    logNo: 'BCL-20260711-001', batchNo: 'P260610', materialCode: 'F50001',
    charCode: 'CHAR01', charName: '含量测定', unit: '%',
    oldValue: '98.2', newValue: '98.7', changeBy: '王芳', changeTime: '2026-07-11 15:30',
    reason: '成品检验放行数据'
  },
  {
    logNo: 'BCL-20260719-001', batchNo: 'P260618', materialCode: 'F50021',
    charCode: 'CHAR02', charName: '粒度', unit: '',
    oldValue: '不合格', newValue: '合格', changeBy: '赵磊', changeTime: '2026-07-19 10:05',
    reason: '重新取样检验合格'
  }
];
