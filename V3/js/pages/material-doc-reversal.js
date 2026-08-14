/* ==================== 物料凭证冲销 ====================
 * 汇总所有已过账来源（库存记账/入库单/预留过账）的物料凭证，
 * 查看凭证详情后执行冲销（冲销原因必填、移动类型自动映射反向），
 * 冲销后同步回写源单据状态为「已冲销」。
 *
 * 数据源（依赖 sp-* 页面脚本先加载）：
 *   spStockPostData（库存记账） / spReceiptData（入库单） / spReservationData（预留过账）
 * 接口：SAP_MOCK.reverseGoodsMovement
 */
/* 移动类型冲销映射（SAP 标准，自动带出不可手工修改） */
const MOVE_TYPE_REVERSE_MAP = {
  '101': '102', // 采购收货 → 冲销采购收货
  '201': '202', // 成本中心发料 → 冲销成本中心发料
  '261': '262', // 内部订单发料 → 冲销内部订单发料
  '311': '312', // 库内转移 → 冲销库内转移
  '551': '552', // 报废 → 冲销报废
  '561': '562'  // 期初/盘盈 → 冲销期初/盘盈
};
const MOVE_TYPE_TEXT = {
  '101': '收货', '102': '冲销收货',
  '201': '成本中心发料', '202': '冲销成本中心发料',
  '261': '内部订单发料', '262': '冲销内部订单发料',
  '311': '库内转移', '312': '冲销库内转移',
  '551': '报废', '552': '冲销报废',
  '561': '期初/盘盈', '562': '冲销期初/盘盈'
};

const MaterialDocReversal = {
  _version: '1.0-20260814',
  page: 1, pageSize: 10,
  flatRows: [],
  filtered: [],
  editingMaterialDocNo: '',

  getSourceBadge(sourceType) {
    const cls = sourceType === '库存记账' ? 'badge-blue' : (sourceType === '入库单' ? 'badge-green' : 'badge-yellow');
    return `<span class="badge ${cls}">${sourceType}</span>`;
  },

  getStatusBadge(status) {
    if (status === '已冲销') return '<span class="badge badge-red">已冲销</span>';
    if (status === '部分过账') return '<span class="badge badge-blue">部分过账</span>';
    if (status === '已过账') return '<span class="badge badge-green">已过账</span>';
    if (status === '待同步' || status === '待过账' || status === '草稿') return '<span class="badge badge-gray">' + status + '</span>';
    return `<span class="badge badge-gray">${status}</span>`;
  },

  /* ==================== 数据汇总（一次性构建扁平行） ==================== */

  flattenData() {
    const rows = [];
    // 1. 库存记账（sp-stock-post.js）
    (typeof spStockPostData !== 'undefined' ? spStockPostData : []).forEach(d => {
      if (!d.materialDocNo) return;
      (d.lines || []).forEach(l => {
        rows.push({
          docNo: d.docNo, sourceType: '库存记账', materialDocNo: d.materialDocNo,
          moveType: d.moveType, matCode: l.matCode, matName: l.matName,
          qty: l.qty, unit: l.unit || '', batch: l.batch || '',
          factory: d.plant || '1000', location: d.location || '',
          postDate: d.postDate || '', status: d.status || '', reversalDocNo: d.reversalDocNo || '',
          notes: d.notes || '', applicant: d.applicant || ''
        });
      });
    });
    // 2. 入库单（sp-receipt.js）
    (typeof spReceiptData !== 'undefined' ? spReceiptData : []).forEach(d => {
      if (!d.materialDocNo) return;
      (d.lines || []).forEach(l => {
        rows.push({
          docNo: d.docNo, sourceType: '入库单', materialDocNo: d.materialDocNo,
          moveType: '101', matCode: l.matCode, matName: l.matName,
          qty: l.qty, unit: l.unit || '', batch: l.batch || '',
          factory: '1000', location: d.targetLocation || '',
          postDate: d.receiptDate || '', status: d.status || '', reversalDocNo: d.reversalDocNo || '',
          notes: d.notes || '', applicant: d.applicant || ''
        });
      });
    });
    // 3. 预留过账（sp-reservation-post.js）
    (typeof spReservationData !== 'undefined' ? spReservationData : []).forEach(d => {
      if (!d.materialDocNo) return;
      (d.lines || []).forEach(l => {
        rows.push({
          docNo: d.docNo, sourceType: '预留过账', materialDocNo: d.materialDocNo,
          moveType: d.moveType, matCode: l.matCode, matName: l.matName,
          qty: l.qty, unit: l.unit || '', batch: l.batch || '',
          factory: d.sourcePlant || '1000', location: (d.sourceLocation || '') + ' → ' + (d.targetLocation || ''),
          postDate: d.createDate || '', status: d.status || '', reversalDocNo: d.reversalDocNo || '',
          notes: d.notes || '', applicant: d.applicant || ''
        });
      });
    });
    return rows;
  },

  /* ==================== 渲染页面 ==================== */

  render() {
    this.flatRows = this.flattenData();
    this.filtered = this.flatRows.slice();
    this.page = 1;
    return `
      <div class="mdr-page" style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <!-- 顶部标题栏 -->
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">物料凭证冲销</div>
            <div style="font-size:13px;opacity:0.8;">库存管理 → 库存记账 → 物料凭证冲销</div>
          </div>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.25);" onclick="MaterialDocReversal.refresh()">🔄 刷新数据</button>
        </div>

        <!-- 筛选栏 -->
        <div id="mdrFilterBar" style="flex-shrink:0;"></div>

        <!-- 统计栏 -->
        <div id="mdrStats" style="flex-shrink:0;"></div>

        <!-- 表格区域 -->
        <div class="table-wrapper" style="flex:1;overflow:auto;" id="mdrTableWrapper"></div>

        <!-- 底部分页 -->
        <div id="mdrPagination" style="flex-shrink:0;"></div>

        <!-- 弹窗容器 -->
        <div id="mdrModalContainer"></div>
      </div>`;
  },

  init() {
    this.renderFilterBar();
    this.renderStats();
    this.renderTable();
    this.renderPagination();
  },

  refresh() {
    this.flatRows = this.flattenData();
    this.init();
    toast('数据已刷新');
  },

  /* ==================== 筛选栏 ==================== */

  renderFilterBar() {
    const el = document.getElementById('mdrFilterBar');
    if (!el) return;
    el.innerHTML = `<div class="filter-bar">
      <div class="filter-group"><label>物料凭证号</label><input type="text" id="mdrDoc" placeholder="如 4900000101"></div>
      <div class="filter-group"><label>来源单据号</label><input type="text" id="mdrSourceDoc" placeholder="模糊查询"></div>
      <div class="filter-group"><label>来源类型</label><select id="mdrSourceType">
        <option value="">全部</option>
        <option value="库存记账">库存记账</option>
        <option value="入库单">入库单</option>
        <option value="预留过账">预留过账</option>
      </select></div>
      <div class="filter-group"><label>物料</label><input type="text" id="mdrMaterial" placeholder="编码/名称模糊查询"></div>
      <div class="filter-group"><label>状态</label><select id="mdrStatus">
        <option value="">全部</option>
        <option value="已过账">已过账</option>
        <option value="部分过账">部分过账</option>
        <option value="已冲销">已冲销</option>
      </select></div>
      <div class="filter-actions">
        <button class="btn btn-primary btn-sm" onclick="MaterialDocReversal.search()">查询</button>
        <button class="btn btn-secondary btn-sm" onclick="MaterialDocReversal.resetFilter()">重置</button>
      </div>
    </div>`;
  },

  renderStats() {
    const el = document.getElementById('mdrStats');
    if (!el) return;
    const total = this.flatRows.length;
    const posted = this.flatRows.filter(r => r.status === '已过账' && !r.reversalDocNo).length;
    const reversed = this.flatRows.filter(r => r.status === '已冲销' || r.reversalDocNo).length;
    const partial = this.flatRows.filter(r => r.status === '部分过账' && !r.reversalDocNo).length;
    el.innerHTML = `<div class="stats-row" style="margin:10px 24px 0;">
      <div class="stat-card"><div class="stat-value">${total}</div><div class="stat-label">物料凭证行</div></div>
      <div class="stat-card"><div class="stat-value">${posted}</div><div class="stat-label">可冲销（已过账）</div></div>
      <div class="stat-card"><div class="stat-value">${partial}</div><div class="stat-label">部分过账</div></div>
      <div class="stat-card"><div class="stat-value" style="color:var(--danger);">${reversed}</div><div class="stat-label">已冲销</div></div>
    </div>`;
  },

  search() {
    this.page = 1;
    this.renderTable();
    this.renderPagination();
  },

  resetFilter() {
    ['mdrDoc', 'mdrSourceDoc', 'mdrSourceType', 'mdrMaterial', 'mdrStatus'].forEach(id => {
      const e = document.getElementById(id); if (e) e.value = '';
    });
    this.search();
  },

  /* ==================== 表格 ==================== */

  renderTable() {
    const doc = document.getElementById('mdrDoc')?.value.trim() || '';
    const sourceDoc = document.getElementById('mdrSourceDoc')?.value.trim() || '';
    const sourceType = document.getElementById('mdrSourceType')?.value || '';
    const material = document.getElementById('mdrMaterial')?.value.trim() || '';
    const status = document.getElementById('mdrStatus')?.value || '';
    this.filtered = this.flatRows.filter(r => {
      if (doc && !r.materialDocNo.includes(doc)) return false;
      if (sourceDoc && !r.docNo.includes(sourceDoc)) return false;
      if (sourceType && r.sourceType !== sourceType) return false;
      if (material && !(r.matCode.includes(material) || r.matName.includes(material))) return false;
      if (status && r.status !== status) return false;
      return true;
    });

    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const el = document.getElementById('mdrTableWrapper');
    if (!el) return;

    el.innerHTML = `<table class="data-table" style="min-width:1400px;">
      <thead><tr>
        <th style="width:60px;">序号</th>
        <th style="width:130px;">物料凭证号</th>
        <th style="width:130px;">来源单据</th>
        <th style="width:90px;">来源类型</th>
        <th style="width:90px;">移动类型</th>
        <th style="width:110px;">物料编码</th>
        <th style="width:150px;">物料名称</th>
        <th style="width:90px;text-align:right;">数量</th>
        <th style="width:60px;">单位</th>
        <th style="width:100px;">批次</th>
        <th>工厂 / 库位</th>
        <th style="width:110px;">过账日期</th>
        <th style="width:90px;">状态</th>
        <th style="width:80px;">操作</th>
      </tr></thead>
      <tbody>${page.length ? page.map((r, i) => this.renderRow(r, start + i + 1)).join('') : `<tr><td colspan="14" class="empty-cell">暂无符合条件的物料凭证</td></tr>`}</tbody>
    </table>`;
  },

  renderRow(r, idx) {
    return `<tr>
      <td>${idx}</td>
      <td style="color:#2563eb;font-weight:600;font-family:monospace;font-size:12px;">${esc(r.materialDocNo)}</td>
      <td>${esc(r.docNo)}</td>
      <td>${this.getSourceBadge(r.sourceType)}</td>
      <td><span style="font-family:monospace;font-size:12px;font-weight:600;">${esc(r.moveType)}</span><div style="font-size:11px;color:var(--text-muted);">${esc(MOVE_TYPE_TEXT[r.moveType] || '')}</div></td>
      <td style="font-family:monospace;font-size:12px;">${esc(r.matCode)}</td>
      <td>${esc(r.matName)}</td>
      <td style="text-align:right;">${r.qty}</td>
      <td>${esc(r.unit)}</td>
      <td>${esc(r.batch || '-')}</td>
      <td>${esc(r.factory)} / ${esc(r.location)}</td>
      <td style="font-size:12px;">${r.postDate}</td>
      <td>${this.getStatusBadge(r.status)}</td>
      <td><button class="btn btn-blue btn-sm" onclick="MaterialDocReversal.openViewModal('${r.materialDocNo}','${r.sourceType}','${r.docNo}')">查看</button></td>
    </tr>`;
  },

  /* ==================== 分页 ==================== */

  renderPagination() {
    const el = document.getElementById('mdrPagination');
    if (!el) return;
    const total = this.filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.page > totalPages) this.page = totalPages;
    el.innerHTML = `<div class="pagination">
      <span style="color:var(--text-muted);font-size:12px;margin-right:12px;">共 ${total} 行</span>
      <button class="pagination-btn" onclick="MaterialDocReversal.prevPage()" ${this.page <= 1 ? 'disabled' : ''}>‹</button>
      <span class="pagination-info">第 ${this.page} / ${totalPages} 页</span>
      <button class="pagination-btn" onclick="MaterialDocReversal.nextPage()" ${this.page >= totalPages ? 'disabled' : ''}>›</button>
      <select class="page-size-select" onchange="MaterialDocReversal.changePageSize(this.value)">
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

  /* ==================== 查看弹窗 ==================== */

  openViewModal(materialDocNo, sourceType, docNo) {
    const row = this.flatRows.find(r => r.materialDocNo === materialDocNo && r.sourceType === sourceType && r.docNo === docNo);
    if (!row) return;
    this.editingMaterialDocNo = materialDocNo;
    // 汇总同一凭证的行项目
    const lines = this.flatRows.filter(r => r.materialDocNo === materialDocNo && r.sourceType === sourceType && r.docNo === docNo);
    const first = lines[0];
    const isReversed = !!(first.reversalDocNo || first.status === '已冲销');

    const cont = document.getElementById('mdrModalContainer');
    cont.innerHTML = `
      <div class="modal-backdrop" id="mdrModalBackdrop" onclick="MaterialDocReversal.closeModal()">
        <div class="modal" style="width:96vw;max-width:96vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">物料凭证 <span style="font-family:monospace;color:#2563eb;">${esc(materialDocNo)}</span> <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">${this.getSourceBadge(sourceType)}</span></div>
            <button class="modal-close" onclick="MaterialDocReversal.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            <div class="form-section">
              <div class="form-section-title">凭证信息</div>
              <div class="detail-grid" style="grid-template-columns:repeat(6,minmax(0,1fr));">
                <div class="detail-item"><dt>SAP 物料凭证</dt><dd><strong>${esc(materialDocNo)}</strong></dd></div>
                <div class="detail-item"><dt>来源单据</dt><dd>${esc(first.docNo)}</dd></div>
                <div class="detail-item"><dt>状态</dt><dd>${this.getStatusBadge(first.status)}</dd></div>
                <div class="detail-item"><dt>移动类型</dt><dd>${esc(first.moveType)}（${esc(MOVE_TYPE_TEXT[first.moveType] || '')}）</dd></div>
                <div class="detail-item"><dt>工厂</dt><dd>${esc(first.factory)}</dd></div>
                <div class="detail-item"><dt>过账日期</dt><dd>${esc(first.postDate)}</dd></div>
                <div class="detail-item"><dt>库位</dt><dd>${esc(first.location)}</dd></div>
                <div class="detail-item"><dt>申请人</dt><dd>${esc(first.applicant || '-')}</dd></div>
                ${isReversed ? `<div class="detail-item"><dt>冲销凭证号</dt><dd><strong style="color:var(--danger);">${esc(first.reversalDocNo)}</strong></dd></div>` : ''}
              </div>
            </div>
            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">行项目</div>
              <table class="data-table data-table-compact" style="min-width:900px;">
                <thead><tr>
                  <th style="width:60px;text-align:center;">序号</th>
                  <th>物料编码</th><th>物料描述</th>
                  <th style="text-align:right;">数量</th><th style="width:60px;">单位</th><th>批次</th>
                </tr></thead>
                <tbody>
                  ${lines.map((l, i) => `<tr>
                    <td style="text-align:center;">${i + 1}</td>
                    <td>${esc(l.matCode)}</td><td>${esc(l.matName)}</td>
                    <td style="text-align:right;">${l.qty}</td><td>${esc(l.unit)}</td><td>${esc(l.batch || '-')}</td>
                  </tr>`).join('')}
                </tbody>
              </table>
            </div>
            ${first.notes ? `<div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">备注</div>
              <div style="font-size:13px;color:var(--text-secondary);padding:4px 2px;">${esc(first.notes)}</div>
            </div>` : ''}
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="MaterialDocReversal.closeModal()">关闭</button>
            ${isReversed ? '' : `<button class="btn btn-primary" onclick="MaterialDocReversal.openReverseModal('${materialDocNo}','${sourceType}','${docNo}')">↩️ 执行冲销</button>`}
          </div>
        </div>
      </div>`;
  },

  /* ==================== 冲销弹窗 ==================== */

  openReverseModal(materialDocNo, sourceType, docNo) {
    const lines = this.flatRows.filter(r => r.materialDocNo === materialDocNo && r.sourceType === sourceType && r.docNo === docNo);
    if (!lines.length) return;
    const first = lines[0];
    const reverseMoveType = MOVE_TYPE_REVERSE_MAP[first.moveType] || ('99' + first.moveType);
    const totalQty = lines.reduce((s, l) => s + (Number(l.qty) || 0), 0);

    const cont = document.getElementById('mdrModalContainer');
    cont.innerHTML = `
      <div class="modal-backdrop" id="mdrModalBackdrop" onclick="MaterialDocReversal.closeModal()">
        <div class="modal" style="width:96vw;max-width:96vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">冲销物料凭证 <span style="font-family:monospace;color:#2563eb;">${esc(materialDocNo)}</span></div>
            <button class="modal-close" onclick="MaterialDocReversal.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            <div class="form-section">
              <div class="form-section-title">冲销信息（SAP 自动生成）</div>
              <div class="detail-grid" style="grid-template-columns:repeat(6,minmax(0,1fr));">
                <div class="detail-item"><dt>原物料凭证</dt><dd><strong>${esc(materialDocNo)}</strong></dd></div>
                <div class="detail-item"><dt>来源单据</dt><dd>${esc(first.docNo)}</dd></div>
                <div class="detail-item"><dt>原移动类型</dt><dd>${esc(first.moveType)}（${esc(MOVE_TYPE_TEXT[first.moveType] || '')}）</dd></div>
                <div class="detail-item"><dt>冲销移动类型</dt><dd><strong style="color:#2563eb;">${esc(reverseMoveType)}</strong>（${esc(MOVE_TYPE_TEXT[reverseMoveType] || '自动映射')}）</dd></div>
                <div class="detail-item"><dt>冲销数量</dt><dd><strong>${totalQty}</strong> ${esc(first.unit)}</dd></div>
                <div class="detail-item"><dt>冲销日期</dt><dd>${new Date().toISOString().slice(0, 10)}</dd></div>
              </div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:8px;padding:8px 10px;background:#f1f5f9;border-radius:6px;">冲销移动类型由 SAP 按原移动类型自动映射，不允许手工修改。冲销成功后，源单据状态将更新为「已冲销」。</div>
            </div>
            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">冲销原因（必填）</div>
              <select id="mdrReason" style="width:100%;">
                <option value="">请选择冲销原因</option>
                <option value="记账错误">记账错误</option>
                <option value="数量错误">数量错误</option>
                <option value="物料错误">物料错误</option>
                <option value="库位错误">库位错误</option>
                <option value="质量不合格退回">质量不合格退回</option>
                <option value="其他原因">其他原因</option>
              </select>
            </div>
            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">冲销说明（可选）</div>
              <textarea id="mdrNote" rows="2" style="width:100%;" placeholder="补充说明冲销原因，如：过账时批次选择错误，需冲销后重新过账。"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="MaterialDocReversal.closeModal()">取消</button>
            <button class="btn btn-primary" onclick="MaterialDocReversal.doReverse('${materialDocNo}','${sourceType}','${docNo}')">✓ 确认冲销</button>
          </div>
        </div>
      </div>`;
  },

  doReverse(materialDocNo, sourceType, docNo) {
    const lines = this.flatRows.filter(r => r.materialDocNo === materialDocNo && r.sourceType === sourceType && r.docNo === docNo);
    if (!lines.length) return;
    const first = lines[0];
    const reason = document.getElementById('mdrReason')?.value;
    if (!reason) { toast('请选择冲销原因'); return; }
    const note = document.getElementById('mdrNote')?.value.trim() || '';
    const reverseMoveType = MOVE_TYPE_REVERSE_MAP[first.moveType] || ('99' + first.moveType);

    SAP_MOCK.showLoading();
    SAP_MOCK.reverseGoodsMovement({
      materialDocNo,
      sourceType,
      sourceDocNo: docNo,
      reverseMoveType,
      materialCode: first.matCode,
      materialName: first.matName,
      qty: lines.reduce((s, l) => s + (Number(l.qty) || 0), 0),
      unit: first.unit,
      batch: first.batch,
      factory: first.factory,
      location: first.location,
      reason: reason + (note ? '（' + note + '）' : '')
    }).then(res => {
      SAP_MOCK.hideLoading();
      // 回写源单据数组状态为「已冲销」并记录冲销凭证号
      this.markReversed(materialDocNo, sourceType, docNo, res.reversalDocNo);
      // 更新冲销页 flatRows
      this.flatRows = this.flattenData();
      this.init();
      toast(`冲销成功，SAP 冲销凭证号：${res.reversalDocNo}（${reverseMoveType}）`);
      this.closeModal();
    }).catch(err => {
      SAP_MOCK.hideLoading();
      toast(err && err.message ? err.message : '冲销失败，请重试');
    });
  },

  markReversed(materialDocNo, sourceType, docNo, reversalDocNo) {
    const patch = { status: '已冲销', reversalDocNo };
    if (sourceType === '库存记账' && typeof spStockPostData !== 'undefined') {
      spStockPostData.forEach(d => {
        if (d.materialDocNo === materialDocNo && d.docNo === docNo) Object.assign(d, patch);
      });
    } else if (sourceType === '入库单' && typeof spReceiptData !== 'undefined') {
      spReceiptData.forEach(d => {
        if (d.materialDocNo === materialDocNo && d.docNo === docNo) Object.assign(d, patch);
      });
    } else if (sourceType === '预留过账' && typeof spReservationData !== 'undefined') {
      spReservationData.forEach(d => {
        if (d.materialDocNo === materialDocNo && d.docNo === docNo) Object.assign(d, patch);
      });
    }
  },

  /* ==================== 弹窗通用 ==================== */

  closeModal() {
    const cont = document.getElementById('mdrModalContainer');
    if (cont) cont.innerHTML = '';
  }
};
