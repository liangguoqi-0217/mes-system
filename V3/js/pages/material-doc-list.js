/* ==================== 物料凭证清单 ====================
 * 汇总 MES 已落库的 SAP 物料凭证（库存记账 / 入库单 / 预留过账），
 * 按 SAP MB51 口径以清单形式展示，支持按凭证状态过滤。
 *
 * 业务规则：MES 调用 SAP 过账接口，SAP 返回物料凭证号后 MES 才落库，
 * 因此清单中每一行都必然已取得 SAP 物料凭证号。
 *
 * 凭证类别（docCategory）：
 *   NORMAL   有效凭证（未冲销）
 *   REVERSED 被冲销的原凭证（status=已冲销）
 *   REVERSAL 冲销凭证（由被冲销凭证的 reversalDocNo 反推生成）
 * 默认仅展示 NORMAL，可通过「凭证状态」手工切换。
 *
 * 数据源（依赖 sp-* 页面脚本先加载）：
 *   spStockPostData（库存记账）/ spReceiptData（入库单）/ spReservationData（预留过账）
 * ============================================================ */

/* 移动类型文案（与 SAP 标准一致，冲销页 MOVE_TYPE_TEXT 同名常量在全局，此处独立命名避免冲突） */
const MDL_MOVE_TYPE_TEXT = {
  '101': '收货', '102': '冲销收货',
  '201': '成本中心发料', '202': '冲销成本中心发料',
  '261': '内部订单发料', '262': '冲销内部订单发料',
  '311': '库内转移', '312': '冲销库内转移',
  '551': '报废', '552': '冲销报废',
  '561': '期初/盘盈', '562': '冲销期初/盘盈'
};
/* 移动类型 -> 反向冲销移动类型 */
const MDL_REVERSE_MAP = {
  '101': '102', '201': '202', '261': '262',
  '311': '312', '551': '552', '561': '562'
};
/* 工厂描述 */
const MDL_PLANT_TEXT = { '1000': '山东步长制药工厂', '2001': '陕西步长制药工厂' };

/* 清单列定义（字段严格对齐 SAP 物料凭证清单原型） */
const MDL_COLUMNS = [
  { key: 'materialDocNo', label: '物料凭证', width: 140, mono: true },
  { key: 'orderNo', label: '订单/网络', width: 110 },
  { key: 'moveType', label: '移动类型', width: 100 },
  { key: 'plant', label: '工厂', width: 70 },
  { key: 'plantText', label: '工厂描述', width: 150 },
  { key: 'issueLocation', label: '发货仓位', width: 110 },
  { key: 'receiveType', label: '收货类型', width: 90 },
  { key: 'matCode', label: '物料号', width: 110, mono: true },
  { key: 'matName', label: '物料描述', width: 170 },
  { key: 'batch', label: '批次', width: 100 },
  { key: 'receiverBatch', label: '接收者批次', width: 110 },
  { key: 'qty', label: '数量', width: 85, align: 'right' },
  { key: 'unit', label: '单位', width: 60 },
  { key: 'reservationNo', label: '预留号', width: 110, mono: true },
  { key: 'costCenter', label: '成本中心', width: 100 },
  { key: 'wbs', label: 'WBS编号', width: 110 },
  { key: 'activityNo', label: '活动号', width: 80 },
  { key: 'specialStock', label: '特殊库存', width: 90 },
  { key: 'customer', label: '客户', width: 90 },
  { key: 'cancelled', label: '已取消', width: 70, align: 'center' },
  { key: 'postDate', label: '过账日期', width: 100 },
  { key: 'operator', label: '操作员', width: 80 }
];

const MaterialDocList = {
  _version: '1.0-20260923',
  page: 1, pageSize: 10,
  flatRows: [],
  filtered: [],
  moreOpen: false,

  /* ==================== 数据汇总 ==================== */

  // 统一补全行字段，缺省值统一为 '-'
  _mk(o) {
    return {
      materialDocNo: o.materialDocNo || '',
      docCategory: o.docCategory || 'NORMAL',
      orderNo: o.orderNo || '',
      moveType: o.moveType || '',
      plant: o.plant || '1000',
      plantText: MDL_PLANT_TEXT[o.plant] || (o.plant || ''),
      issueLocation: o.issueLocation || '',
      receiveType: o.receiveType || '',
      matCode: o.matCode || '',
      matName: o.matName || '',
      batch: o.batch || '',
      receiverBatch: o.receiverBatch || '',
      qty: o.qty,
      unit: o.unit || '',
      reservationNo: o.reservationNo || '',
      costCenter: o.costCenter || '',
      wbs: o.wbs || '',
      activityNo: o.activityNo || '',
      specialStock: o.specialStock || '',
      customer: o.customer || '',
      cancelled: o.cancelled || '',
      postDate: o.postDate || '',
      operator: o.operator || '',
      status: o.status || '',
      docNo: o.docNo || '',
      sourceType: o.sourceType || '',
      reversalDocNo: o.reversalDocNo || '',
      reversedDocNo: o.reversedDocNo || '',
      notes: o.notes || ''
    };
  },

  flattenData() {
    const rows = [];
    const self = this;

    // 被冲销的凭证 -> 反向生成一条「冲销凭证」行
    function pushReversal(d, l) {
      if (!d.reversalDocNo) return;
      rows.push(self._mk({
        materialDocNo: d.reversalDocNo,
        docCategory: 'REVERSAL',
        orderNo: d.internalOrderNo || d.processOrderNo || '',
        moveType: MDL_REVERSE_MAP[d.moveType] || '',
        plant: d.plant || d.sourcePlant || '1000',
        issueLocation: d.location || d.sourceLocation || '',
        receiveType: '',
        matCode: l.matCode, matName: l.matName,
        batch: l.batch || '', receiverBatch: '',
        qty: l.qty, unit: l.unit || '',
        reservationNo: d.reservationNo || '',
        costCenter: d.costCenter || '',
        cancelled: '',
        postDate: d.postDate || d.receiptDate || d.createDate || '',
        operator: d.applicant || '',
        status: '已过账',
        docNo: d.docNo, sourceType: d.sourceType,
        reversedDocNo: d.materialDocNo,
        notes: d.notes || ''
      }));
    }

    // 1. 库存记账
    (typeof spStockPostData !== 'undefined' ? spStockPostData : []).forEach(d => {
      if (!d.materialDocNo) return;
      const reversed = d.status === '已冲销';
      (d.lines || []).forEach(l => {
        rows.push(this._mk({
          materialDocNo: d.materialDocNo,
          docCategory: reversed ? 'REVERSED' : 'NORMAL',
          orderNo: d.internalOrderNo || '',
          moveType: d.moveType,
          plant: d.plant || '1000',
          issueLocation: d.location || '',
          matCode: l.matCode, matName: l.matName,
          batch: l.batch || '', qty: l.qty, unit: l.unit || '',
          costCenter: d.costCenter || '',
          cancelled: reversed ? 'X' : '',
          postDate: d.postDate || '',
          operator: d.applicant || '',
          status: d.status || '',
          docNo: d.docNo, sourceType: '库存记账',
          reversalDocNo: d.reversalDocNo || '',
          notes: d.notes || ''
        }));
        if (reversed) pushReversal(d, l);
      });
    });

    // 2. 入库单
    (typeof spReceiptData !== 'undefined' ? spReceiptData : []).forEach(d => {
      if (!d.materialDocNo) return;
      const reversed = d.status === '已冲销';
      (d.lines || []).forEach(l => {
        rows.push(this._mk({
          materialDocNo: d.materialDocNo,
          docCategory: reversed ? 'REVERSED' : 'NORMAL',
          orderNo: d.processOrderNo || '',
          moveType: '101',
          plant: '1000',
          issueLocation: d.targetLocation || '',
          receiveType: '采购收货',
          matCode: l.matCode, matName: l.matName,
          batch: l.batch || '', qty: l.qty, unit: l.unit || '',
          cancelled: reversed ? 'X' : '',
          postDate: d.receiptDate || '',
          operator: d.applicant || '',
          status: d.status || '',
          docNo: d.docNo, sourceType: '入库单',
          reversalDocNo: d.reversalDocNo || '',
          notes: d.notes || ''
        }));
        if (reversed) pushReversal(d, l);
      });
    });

    // 3. 预留过账
    (typeof spReservationData !== 'undefined' ? spReservationData : []).forEach(d => {
      if (!d.materialDocNo) return;
      const reversed = d.status === '已冲销';
      (d.lines || []).forEach(l => {
        rows.push(this._mk({
          materialDocNo: d.materialDocNo,
          docCategory: reversed ? 'REVERSED' : 'NORMAL',
          moveType: d.moveType,
          plant: d.sourcePlant || '1000',
          issueLocation: d.sourceLocation || '',
          matCode: l.matCode, matName: l.matName,
          batch: l.batch || '', qty: l.qty, unit: l.unit || '',
          reservationNo: d.reservationNo || '',
          cancelled: reversed ? 'X' : '',
          postDate: d.createDate || '',
          operator: d.applicant || '',
          status: d.status || '',
          docNo: d.docNo, sourceType: '预留过账',
          reversalDocNo: d.reversalDocNo || '',
          notes: d.notes || ''
        }));
        if (reversed) pushReversal(d, l);
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
      <div class="mdl-page" style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">物料凭证清单</div>
            <div style="font-size:13px;opacity:0.8;">库存管理 → 库存记账 → 物料凭证清单</div>
          </div>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.25);" onclick="MaterialDocList.refresh()">🔄 刷新数据</button>
        </div>

        <div id="mdlFilterBar" style="flex-shrink:0;"></div>
        <div id="mdlStats" style="flex-shrink:0;"></div>
        <div class="table-wrapper" style="flex:1;overflow:auto;" id="mdlTableWrapper"></div>
        <div id="mdlPagination" style="flex-shrink:0;"></div>
        <div id="mdlModalContainer"></div>
      </div>`;
  },

  init() {
    // 查询变式：进入页面自动回填（默认变式 > 上次查询条件），不自动执行查询
    if (window.QueryVariant) {
      QueryVariant.mount('material-doc-list');
      QueryVariant.restore('material-doc-list');
      QueryVariant.bindRecent('material-doc-list');
    }
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
    const el = document.getElementById('mdlFilterBar');
    if (!el) return;
    const moveOpts = Object.keys(MDL_MOVE_TYPE_TEXT)
      .map(k => `<option value="${k}">${k} ${MDL_MOVE_TYPE_TEXT[k]}</option>`).join('');
    const plantOpts = Object.keys(MDL_PLANT_TEXT)
      .map(k => `<option value="${k}">${k} ${MDL_PLANT_TEXT[k]}</option>`).join('');

    el.innerHTML = `
      <div class="filter-bar">
        <div class="filter-group"><label>物料凭证号</label><input type="text" id="mdlDocNo" placeholder="如 4900000101"></div>
        <div class="filter-group"><label>过账日期 起</label><input type="date" id="mdlDateFrom"></div>
        <div class="filter-group"><label>过账日期 止</label><input type="date" id="mdlDateTo"></div>
        <div class="filter-group"><label>物料号</label><input type="text" id="mdlMatCode" placeholder="编码"></div>
        <div class="filter-group"><label>移动类型</label><select id="mdlMoveType"><option value="">全部</option>${moveOpts}</select></div>
        <div class="filter-group"><label>工厂</label><select id="mdlPlant"><option value="">全部</option>${plantOpts}</select></div>
        <div class="filter-group"><label>凭证状态</label><select id="mdlDocStatus">
          <option value="valid">仅有效凭证</option>
          <option value="all">全部凭证</option>
          <option value="reversed">仅被冲销凭证</option>
          <option value="reversal">仅冲销凭证</option>
        </select></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="MaterialDocList.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="MaterialDocList.resetFilter()">重置</button>
          <button class="btn btn-secondary btn-sm" id="mdlMoreBtn" onclick="MaterialDocList.toggleMore()">${this.moreOpen ? '收起 ▴' : '更多条件 ▾'}</button>
        </div>
      </div>
      <div class="filter-bar mdl-more-bar" id="mdlMoreBar" style="display:${this.moreOpen ? 'flex' : 'none'};background:#fff;border-top:1px dashed var(--border);">
        <div class="filter-group"><label>订单/网络</label><input type="text" id="mdlOrderNo" placeholder="内部订单/流程订单"></div>
        <div class="filter-group"><label>预留号</label><input type="text" id="mdlResNo" placeholder="如 0000000111"></div>
        <div class="filter-group"><label>WBS编号</label><input type="text" id="mdlWbs" placeholder="WBS 元素"></div>
        <div class="filter-group"><label>成本中心</label><input type="text" id="mdlCostCenter" placeholder="如 CC-1002"></div>
        <div class="filter-group"><label>操作员</label><input type="text" id="mdlOperator" placeholder="过账人"></div>
      </div>`;
  },

  toggleMore() {
    this.moreOpen = !this.moreOpen;
    const bar = document.getElementById('mdlMoreBar');
    if (bar) bar.style.display = this.moreOpen ? 'flex' : 'none';
    // 用 id 定位：查询变式的「我的变式」按钮也会被插到 filter-actions 末尾，不能用 :last-child
    const btn = document.getElementById('mdlMoreBtn');
    if (btn) btn.textContent = this.moreOpen ? '收起 ▴' : '更多条件 ▾';
  },

  renderStats() {
    const el = document.getElementById('mdlStats');
    if (!el) return;
    const normal = this.flatRows.filter(r => r.docCategory === 'NORMAL').length;
    const reversed = this.flatRows.filter(r => r.docCategory === 'REVERSED').length;
    const reversal = this.flatRows.filter(r => r.docCategory === 'REVERSAL').length;
    el.innerHTML = `<div class="stats-row" style="margin:10px 24px 0;">
      <div class="stat-card"><div class="stat-value">${this.flatRows.length}</div><div class="stat-label">物料凭证行</div></div>
      <div class="stat-card"><div class="stat-value" style="color:var(--primary);">${normal}</div><div class="stat-label">有效凭证</div></div>
      <div class="stat-card"><div class="stat-value" style="color:var(--danger);">${reversed}</div><div class="stat-label">被冲销凭证</div></div>
      <div class="stat-card"><div class="stat-value" style="color:var(--warning);">${reversal}</div><div class="stat-label">冲销凭证</div></div>
    </div>`;
  },

  _val(id) {
    const e = document.getElementById(id);
    return e ? String(e.value || '').trim() : '';
  },

  search() {
    this.page = 1;
    this.renderTable();
    this.renderPagination();

    // 查询变式：保存"上次查询条件"并记录手工字段的最近输入
    if (window.QueryVariant) {
      QueryVariant.saveAuto('material-doc-list');
      QueryVariant.recordUsed('material-doc-list');
    }
  },

  resetFilter() {
    ['mdlDocNo', 'mdlDateFrom', 'mdlDateTo', 'mdlMatCode', 'mdlMoveType', 'mdlPlant',
      'mdlOrderNo', 'mdlResNo', 'mdlWbs', 'mdlCostCenter', 'mdlOperator'].forEach(id => {
      const e = document.getElementById(id); if (e) e.value = '';
    });
    const st = document.getElementById('mdlDocStatus'); if (st) st.value = 'valid';
    this.search();

    // 查询变式：重置时解除变式选中并清除"上次查询条件"
    if (window.QueryVariant) QueryVariant.resetSelection('material-doc-list');
  },

  /* ==================== 表格 ==================== */

  renderTable() {
    const docNo = this._val('mdlDocNo');
    const dateFrom = this._val('mdlDateFrom');
    const dateTo = this._val('mdlDateTo');
    const matCode = this._val('mdlMatCode').toLowerCase();
    const moveType = this._val('mdlMoveType');
    const plant = this._val('mdlPlant');
    const docStatus = this._val('mdlDocStatus') || 'valid';
    const orderNo = this._val('mdlOrderNo').toLowerCase();
    const resNo = this._val('mdlResNo');
    const wbs = this._val('mdlWbs').toLowerCase();
    const costCenter = this._val('mdlCostCenter').toLowerCase();
    const operator = this._val('mdlOperator');

    // 凭证状态下拉值 -> 行内 docCategory
    const catMap = { valid: 'NORMAL', reversed: 'REVERSED', reversal: 'REVERSAL' };

    this.filtered = this.flatRows.filter(r => {
      // 凭证状态过滤（默认 valid：仅有效凭证，排除被冲销凭证与冲销凭证）
      if (docStatus !== 'all' && r.docCategory !== catMap[docStatus]) return false;
      if (docNo && r.materialDocNo.indexOf(docNo) === -1) return false;
      if (dateFrom && r.postDate && r.postDate < dateFrom) return false;
      if (dateTo && r.postDate && r.postDate > dateTo) return false;
      if (matCode && r.matCode.toLowerCase().indexOf(matCode) === -1 &&
          r.matName.toLowerCase().indexOf(matCode) === -1) return false;
      if (moveType && r.moveType !== moveType) return false;
      if (plant && r.plant !== plant) return false;
      if (orderNo && r.orderNo.toLowerCase().indexOf(orderNo) === -1) return false;
      if (resNo && r.reservationNo.indexOf(resNo) === -1) return false;
      if (wbs && r.wbs.toLowerCase().indexOf(wbs) === -1) return false;
      if (costCenter && r.costCenter.toLowerCase().indexOf(costCenter) === -1) return false;
      if (operator && r.operator.indexOf(operator) === -1) return false;
      return true;
    });

    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const el = document.getElementById('mdlTableWrapper');
    if (!el) return;

    const th = MDL_COLUMNS.map(c =>
      `<th style="width:${c.width}px;${c.align ? 'text-align:' + c.align + ';' : ''}">${c.label}</th>`).join('');
    const td = page.length
      ? page.map((r, i) => this.renderRow(r, start + i + 1)).join('')
      : `<tr><td colspan="${MDL_COLUMNS.length + 2}" class="empty-cell">暂无符合条件的物料凭证</td></tr>`;

    el.innerHTML = `<table class="data-table" style="min-width:2180px;">
      <thead><tr><th style="width:50px;">序号</th>${th}<th style="width:80px;">操作</th></tr></thead>
      <tbody>${td}</tbody>
    </table>`;
  },

  renderRow(r, idx) {
    const catBadge = this.getCategoryBadge(r.docCategory);
    const tds = MDL_COLUMNS.map(c => {
      let v = r[c.key];
      if (c.key === 'materialDocNo') {
        return `<td style="font-family:monospace;font-size:12px;font-weight:600;color:#2563eb;">${esc(v)}<div style="margin-top:2px;">${catBadge}</div></td>`;
      }
      if (c.key === 'moveType') {
        return `<td style="font-family:monospace;font-size:12px;font-weight:600;">${esc(v)}<div style="font-size:11px;color:var(--text-muted);">${esc(MDL_MOVE_TYPE_TEXT[v] || '')}</div></td>`;
      }
      if (c.key === 'cancelled') {
        return `<td style="text-align:center;">${v === 'X' ? '<span style="color:var(--danger);font-weight:700;">X</span>' : ''}</td>`;
      }
      if (v === '' || v === null || v === undefined) v = '-';
      const align = c.align ? `text-align:${c.align};` : '';
      const mono = c.mono ? 'font-family:monospace;font-size:12px;' : '';
      return `<td style="${align}${mono}">${esc(v)}</td>`;
    }).join('');

    return `<tr>
      <td>${idx}</td>${tds}
      <td><button class="btn btn-blue btn-sm" onclick="MaterialDocList.openViewModal('${r.materialDocNo}','${r.docCategory}','${r.docNo}','${r.matCode}')">查看</button></td>
    </tr>`;
  },

  getCategoryBadge(cat) {
    if (cat === 'REVERSED') return '<span class="badge badge-red badge-sm">被冲销</span>';
    if (cat === 'REVERSAL') return '<span class="badge badge-yellow badge-sm">冲销凭证</span>';
    return '<span class="badge badge-green badge-sm">有效</span>';
  },

  /* ==================== 分页 ==================== */

  renderPagination() {
    const el = document.getElementById('mdlPagination');
    if (!el) return;
    const total = this.filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.page > totalPages) this.page = totalPages;
    el.innerHTML = `<div class="pagination">
      <span style="color:var(--text-muted);font-size:12px;margin-right:12px;">共 ${total} 行</span>
      <button class="pagination-btn" onclick="MaterialDocList.prevPage()" ${this.page <= 1 ? 'disabled' : ''}>‹</button>
      <span class="pagination-info">第 ${this.page} / ${totalPages} 页</span>
      <button class="pagination-btn" onclick="MaterialDocList.nextPage()" ${this.page >= totalPages ? 'disabled' : ''}>›</button>
      <select class="page-size-select" onchange="MaterialDocList.changePageSize(this.value)">
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

  openViewModal(materialDocNo, docCategory, docNo, matCode) {
    const row = this.flatRows.find(r =>
      r.materialDocNo === materialDocNo && r.docCategory === docCategory &&
      r.docNo === docNo && r.matCode === matCode);
    if (!row) return;
    // 同一凭证的全部行项目
    const lines = this.flatRows.filter(r => r.materialDocNo === materialDocNo && r.docNo === docNo);

    const item = (dt, dd) => `<div class="detail-item"><dt>${dt}</dt><dd>${dd}</dd></div>`;
    const cont = document.getElementById('mdlModalContainer');
    if (!cont) return;
    cont.innerHTML = `
      <div class="modal-backdrop" id="mdlModalBackdrop" onclick="MaterialDocList.closeModal()">
        <div class="modal" style="width:96vw;max-width:96vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">物料凭证 <span style="font-family:monospace;color:#2563eb;">${esc(materialDocNo)}</span>
              <span style="margin-left:8px;">${this.getCategoryBadge(docCategory)}</span>
              <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">${esc(MDL_MOVE_TYPE_TEXT[row.moveType] || '')} · ${esc(row.sourceType)}</span>
            </div>
            <button class="modal-close" onclick="MaterialDocList.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            <div class="form-section">
              <div class="form-section-title">凭证信息</div>
              <div class="detail-grid" style="grid-template-columns:repeat(6,minmax(0,1fr));">
                ${item('物料凭证', `<strong style="font-family:monospace;">${esc(row.materialDocNo)}</strong>`)}
                ${item('凭证类别', this.getCategoryBadge(row.docCategory))}
                ${item('移动类型', esc(row.moveType) + '（' + esc(MDL_MOVE_TYPE_TEXT[row.moveType] || '-') + '）')}
                ${item('订单/网络', esc(row.orderNo || '-'))}
                ${item('工厂', esc(row.plant) + ' ' + esc(row.plantText))}
                ${item('发货仓位', esc(row.issueLocation || '-'))}
                ${item('收货类型', esc(row.receiveType || '-'))}
                ${item('预留号', esc(row.reservationNo || '-'))}
                ${item('成本中心', esc(row.costCenter || '-'))}
                ${item('WBS编号', esc(row.wbs || '-'))}
                ${item('活动号', esc(row.activityNo || '-'))}
                ${item('特殊库存', esc(row.specialStock || '-'))}
                ${item('客户', esc(row.customer || '-'))}
                ${item('已取消', row.cancelled === 'X' ? '<span style="color:var(--danger);font-weight:700;">X</span>' : '-')}
                ${item('过账日期', esc(row.postDate || '-'))}
                ${item('操作员', esc(row.operator || '-'))}
                ${item('来源单据', esc(row.docNo || '-'))}
                ${item('来源类型', esc(row.sourceType || '-'))}
                ${row.reversalDocNo ? item('冲销凭证号', `<strong style="color:var(--danger);font-family:monospace;">${esc(row.reversalDocNo)}</strong>`) : ''}
                ${row.reversedDocNo ? item('被冲销凭证', `<strong style="color:var(--warning);font-family:monospace;">${esc(row.reversedDocNo)}</strong>`) : ''}
              </div>
            </div>
            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">行项目</div>
              <table class="data-table data-table-compact" style="min-width:900px;">
                <thead><tr>
                  <th style="width:60px;text-align:center;">序号</th>
                  <th>物料号</th><th>物料描述</th><th>批次</th>
                  <th style="text-align:right;">数量</th><th style="width:60px;">单位</th>
                  <th>接收者批次</th>
                </tr></thead>
                <tbody>
                  ${lines.map((l, i) => `<tr>
                    <td style="text-align:center;">${i + 1}</td>
                    <td style="font-family:monospace;font-size:12px;">${esc(l.matCode)}</td>
                    <td>${esc(l.matName)}</td>
                    <td>${esc(l.batch || '-')}</td>
                    <td style="text-align:right;">${l.qty}</td>
                    <td>${esc(l.unit || '-')}</td>
                    <td>${esc(l.receiverBatch || '-')}</td>
                  </tr>`).join('')}
                </tbody>
              </table>
            </div>
            ${row.notes ? `<div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">备注</div>
              <div style="font-size:13px;color:var(--text-secondary);padding:4px 2px;">${esc(row.notes)}</div>
            </div>` : ''}
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="MaterialDocList.closeModal()">关闭</button>
          </div>
        </div>
      </div>`;
  },

  closeModal() {
    const b = document.getElementById('mdlModalBackdrop');
    if (b && b.parentNode) b.parentNode.removeChild(b);
    const c = document.getElementById('mdlModalContainer');
    if (c) c.innerHTML = '';
  }
};

// ===== 查询变式注册（通用模块 V3/js/core/query-variant.js）=====
if (window.QueryVariant) {
  QueryVariant.register({
    pageId: 'material-doc-list',
    fields: ['mdlDocNo', 'mdlDateFrom', 'mdlDateTo', 'mdlMatCode', 'mdlMoveType', 'mdlPlant',
      'mdlDocStatus', 'mdlOrderNo', 'mdlResNo', 'mdlWbs', 'mdlCostCenter', 'mdlOperator'],
    textFields: ['mdlDocNo', 'mdlMatCode', 'mdlOrderNo', 'mdlResNo', 'mdlWbs', 'mdlCostCenter', 'mdlOperator'],
    labels: {
      mdlDocNo: '物料凭证号', mdlDateFrom: '过账日期起', mdlDateTo: '过账日期止',
      mdlMatCode: '物料号', mdlMoveType: '移动类型', mdlPlant: '工厂',
      mdlDocStatus: '凭证状态', mdlOrderNo: '订单/网络', mdlResNo: '预留号',
      mdlWbs: 'WBS编号', mdlCostCenter: '成本中心', mdlOperator: '操作员'
    },
    onApply: function () { MaterialDocList.search(); }
  });
}
