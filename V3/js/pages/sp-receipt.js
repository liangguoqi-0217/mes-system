/* ============================================================
 * sp-receipt.js — 入库单（预留单据 · 库存管理）
 * 场景：成品按生产订单入库，走 SAP 直接过账（移动类型 101），
 * SAP 返回物料凭证号后 MES 才写入本地自建表。
 * ============================================================ */
const RECEIPT_LOCATION_OPTIONS = ['C02成品暂存间', 'A03包装材料仓', 'C01暂存间'];
const RECEIPT_DEPT_OPTIONS = ['生产一部', '生产二部', '生产三部', '质量部'];

const SpReceipt = {
  page: 1, pageSize: 20, flatRows: [], filteredFlat: [],
  editMode: false, editId: null,

  getStatusBadge(s) {
    const c = { '草稿': 'badge-gray', '待同步': 'badge-yellow', '已过账': 'badge-green', '已冲销': 'badge-red' };
    return `<span class="badge ${c[s] || 'badge-gray'}">${esc(s)}</span>`;
  },

  flattenData() {
    const rows = [];
    spReceiptData.forEach(d => {
      if (!d.lines || !d.lines.length) return;
      d.lines.forEach(line => {
        rows.push({
          _doc: d, _line: line,
          docNo: d.docNo, itemNo: line.itemNo,
          processOrderNo: d.processOrderNo,
          matCode: line.matCode || '', matName: line.matName || '',
          qty: line.qty, unit: line.unit || '', batch: line.batch || '',
          targetLocation: d.targetLocation,
          createDept: d.createDept, applicant: d.applicant, receiptDate: d.receiptDate,
          status: d.status, materialDocNo: d.materialDocNo || '', notes: d.notes || ''
        });
      });
    });
    return rows;
  },

  render() {
    this.flatRows = this.flattenData();
    this.filteredFlat = [...this.flatRows];
    this.page = 1;
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">入库单</div><div style="font-size:13px;opacity:0.8;">成品按生产订单入库，走 SAP 直接过账（移动类型 101）</div></div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="btn btn-blue" onclick="SpReceipt.openForm()"><span style="font-weight:700;font-size:16px;">+</span> 创建入库单</button>
          </div>
        </div>
        <div class="filter-bar filter-bar-nowrap" style="flex-shrink:0;">
          <div class="filter-group"><label>入库单号</label><input type="text" id="rcDocNo" placeholder="单号"></div>
          <div class="filter-group"><label>生产订单号</label><input type="text" id="rcPoNo" placeholder="生产订单"></div>
          <div class="filter-group"><label>目标库位</label><input type="text" id="rcLoc" placeholder="库位"></div>
          <div class="filter-group"><label>状态</label><select id="rcStatus">
            <option value="">全部</option>
            <option value="草稿">草稿</option><option value="待同步">待同步</option>
            <option value="已过账">已过账</option><option value="已冲销">已冲销</option>
          </select></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="SpReceipt.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="SpReceipt.reset()">重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table data-table-compact" style="min-width:1150px;">
            <thead><tr>
              <th>入库单号</th><th>生产订单号</th><th style="width:55px;text-align:center;">行项目</th>
              <th>物料</th><th>物料描述</th><th style="text-align:right;">数量</th><th style="width:38px;">单位</th>
              <th>批次</th><th>目标库位</th><th>入库部门</th><th>入库人</th><th>入库日期</th>
              <th style="width:80px;text-align:center;">状态</th><th style="width:76px;">操作</th>
            </tr></thead>
            <tbody id="rcTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info">
            <span class="list-count" id="rcCount">共 ${this.flatRows.length} 行</span>
            <span style="color:var(--text-muted);font-size:12px;">(共 ${spReceiptData.length} 张入库单)</span>
          </div>
          <div class="pagination">
            <button class="pagination-btn" id="rcPrev" disabled onclick="SpReceipt.prevPage()">‹</button>
            <span class="pagination-info" id="rcPageInfo">第 ${this.page} / ${Math.ceil(Math.max(this.flatRows.length,1)/this.pageSize)} 页</span>
            <button class="pagination-btn" id="rcNext" onclick="SpReceipt.nextPage()">›</button>
            <select class="page-size-select" id="rcPageSizeSel" onchange="SpReceipt.changePageSize()"><option value="20">20条</option><option value="40">40条</option><option value="80">80条</option></select>
          </div>
        </div>
      </div>
      <div id="rcModalContainer"></div>`;
  },

  init() {
    this.renderRows();
    const el = document.getElementById('rcDocNo');
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') this.search(); });
  },

  renderRows() {
    const body = document.getElementById('rcTableBody');
    if (!body) return;
    const start = (this.page - 1) * this.pageSize;
    const rows = this.filteredFlat.slice(start, start + this.pageSize);
    if (!rows.length) {
      body.innerHTML = `<tr><td colspan="14" class="empty-cell">暂无符合条件的入库单</td></tr>`;
    } else {
      body.innerHTML = rows.map(r => `
        <tr>
          <td><strong>${esc(r.docNo)}</strong><div style="font-size:11px;color:var(--text-muted);">物料凭证: ${esc(r.materialDocNo || '-')}</div></td>
          <td>${esc(r.processOrderNo)}</td>
          <td style="text-align:center;">${r.itemNo}</td>
          <td>${esc(r.matCode || '-')}</td>
          <td>${esc(r.matName || '-')}</td>
          <td style="text-align:right;">${r.qty}</td>
          <td>${esc(r.unit)}</td>
          <td>${esc(r.batch || '-')}</td>
          <td>${esc(r.targetLocation)}</td>
          <td>${esc(r.createDept)}</td>
          <td>${esc(r.applicant)}</td>
          <td>${esc(r.receiptDate)}</td>
          <td style="text-align:center;">${this.getStatusBadge(r.status)}</td>
          <td><button class="btn btn-blue btn-sm" onclick="SpReceipt.openViewModal('${r.docNo}')">查看</button></td>
        </tr>`).join('');
    }
    const prev = document.getElementById('rcPrev'), next = document.getElementById('rcNext');
    const totalPages = Math.ceil(Math.max(this.filteredFlat.length, 1) / this.pageSize);
    if (prev) prev.disabled = this.page <= 1;
    if (next) next.disabled = this.page >= totalPages;
    const info = document.getElementById('rcPageInfo');
    if (info) info.textContent = `第 ${this.page} / ${totalPages} 页`;
  },

  search() {
    const qDoc = (document.getElementById('rcDocNo').value || '').trim().toLowerCase();
    const qPo = (document.getElementById('rcPoNo').value || '').trim().toLowerCase();
    const qLoc = (document.getElementById('rcLoc').value || '').trim().toLowerCase();
    const qStatus = document.getElementById('rcStatus').value;
    this.filteredFlat = this.flatRows.filter(r =>
      (!qDoc || r.docNo.toLowerCase().includes(qDoc)) &&
      (!qPo || r.processOrderNo.toLowerCase().includes(qPo)) &&
      (!qLoc || r.targetLocation.toLowerCase().includes(qLoc)) &&
      (!qStatus || r.status === qStatus)
    );
    this.page = 1;
    this.renderRows();
    const c = document.getElementById('rcCount'); if (c) c.textContent = `共 ${this.filteredFlat.length} 行`;
  },
  reset() {
    ['rcDocNo', 'rcPoNo', 'rcLoc'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const s = document.getElementById('rcStatus'); if (s) s.value = '';
    this.filteredFlat = [...this.flatRows];
    this.page = 1;
    this.renderRows();
    const c = document.getElementById('rcCount'); if (c) c.textContent = `共 ${this.filteredFlat.length} 行`;
  },
  prevPage() { if (this.page > 1) { this.page--; this.renderRows(); } },
  nextPage() { if (this.page < Math.ceil(this.filteredFlat.length / this.pageSize)) { this.page++; this.renderRows(); } },
  changePageSize() { this.pageSize = +document.getElementById('rcPageSizeSel').value; this.page = 1; this.renderRows(); },

  getFormModalHTML(d) {
    d = d || {};
    const isEdit = this.editMode;
    const lines = (d.lines && d.lines.length ? d.lines : [{ itemNo: 10, matCode: '', matName: '', qty: '', unit: 'BOX', batch: '' }]);
    const today = new Date().toISOString().slice(0, 10);
    const inputStyle = 'width:100%;border:none;background:transparent;font-size:14px;font-weight:600;color:inherit;padding:0;outline:none;';
    return `
      <div class="modal-backdrop" id="rcModalBackdrop" onclick="SpReceipt.closeModal()">
        <div class="modal" style="width:98vw;max-width:98vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">${isEdit ? '修改' : '新建'}入库单 - ${esc(d.docNo || '(自动生成)')} <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">成品入库 · 移动类型 101${d.materialDocNo ? ' · 物料凭证 ' + d.materialDocNo : ''}</span></div>
            <button class="modal-close" onclick="SpReceipt.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            <div class="form-section">
              <div class="form-section-title">抬头信息</div>
              <div class="detail-grid" style="grid-template-columns:repeat(8,minmax(0,1fr));">
                <div class="detail-item"><dt>入库单号</dt><dd><strong>${esc(d.docNo || '(自动生成)')}</strong><input type="hidden" id="rcFDocNo" value="${esc(d.docNo || '')}"></dd></div>
                <div class="detail-item"><dt><span class="req">*</span> 生产订单号</dt><dd><input type="text" id="rcFPoNo" placeholder="如 6000001234" value="${esc(d.processOrderNo || '')}" style="${inputStyle}"></dd></div>
                <div class="detail-item"><dt><span class="req">*</span> 目标库位</dt><dd><select id="rcFLoc" style="${inputStyle}">${RECEIPT_LOCATION_OPTIONS.map(o => `<option value="${o}"${d.targetLocation===o?' selected':''}>${o}</option>`).join('')}</select></dd></div>
                <div class="detail-item"><dt><span class="req">*</span> 入库日期</dt><dd><input type="date" id="rcFDate" value="${esc(d.receiptDate || today)}" style="${inputStyle}"></dd></div>
                <div class="detail-item"><dt><span class="req">*</span> 入库部门</dt><dd><select id="rcFDept" style="${inputStyle}">${[''].concat(RECEIPT_DEPT_OPTIONS).map(o => `<option value="${o}"${d.createDept===o?' selected':''}>${o || '请选择'}</option>`).join('')}</select></dd></div>
                <div class="detail-item"><dt><span class="req">*</span> 入库人</dt><dd><input type="text" id="rcFApplicant" value="${esc(d.applicant || window.currentUserId || '')}" style="${inputStyle}"></dd></div>
              </div>
            </div>

            <div class="form-section" style="margin-top:14px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <div class="form-section-title" style="margin-bottom:0;">行项目</div>
                <button class="btn btn-sm btn-outline" onclick="SpReceipt.addLineRow()" style="padding:4px 12px;font-size:12px;">+ 添加行</button>
              </div>
              <div style="overflow-x:auto;">
                <table class="data-table data-table-compact" style="min-width:1000px;">
                  <thead><tr>
                    <th style="width:60px;text-align:center;">行项目</th>
                    <th style="min-width:130px;"><span class="req">*</span> 物料编码</th>
                    <th style="min-width:200px;"><span class="req">*</span> 物料描述</th>
                    <th style="min-width:100px;text-align:right;"><span class="req">*</span> 数量</th>
                    <th style="width:80px;">单位</th>
                    <th style="min-width:120px;"><span class="req">*</span> 批次</th>
                    <th style="width:60px;text-align:center;"></th>
                  </tr></thead>
                  <tbody id="rcLinesBody">
                    ${lines.map(l => SpReceipt.renderLineRow(l)).join('')}
                  </tbody>
                </table>
              </div>
              <div style="margin-top:8px;font-size:12px;color:var(--text-secondary);">提示：成品入库建议填写批次；物料编码/描述/数量/批次为必填。</div>
            </div>

            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">备注</div>
              <div class="detail-grid" style="grid-template-columns:repeat(2,minmax(0,1fr));">
                <div class="detail-item"><dt>备注</dt><dd><textarea id="rcFNotes" rows="2" placeholder="选填">${esc(d.notes || '')}</textarea></dd></div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="SpReceipt.closeModal()">取消</button>
            <button class="btn btn-primary" onclick="SpReceipt.submitForm()">提交</button>
          </div>
        </div>
      </div>`;
  },

  renderLineRow(line) {
    return `<tr>
      <td style="text-align:center;">${line.itemNo}</td>
      <td><input type="text" data-field="matCode" value="${esc(line.matCode || '')}" placeholder="物料编码" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input type="text" data-field="matName" value="${esc(line.matName || '')}" placeholder="物料描述" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input type="number" data-field="qty" value="${line.qty === '' ? '' : line.qty}" min="0.001" step="0.001" placeholder="数量" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;text-align:right;"></td>
      <td><input type="text" data-field="unit" value="${esc(line.unit || '')}" placeholder="单位" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input type="text" data-field="batch" value="${esc(line.batch || '')}" placeholder="批次" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="text-align:center;"><button class="btn btn-danger btn-sm" onclick="SpReceipt.removeLineRow(this)" style="padding:2px 8px;font-size:12px;">删除</button></td>
    </tr>`;
  },

  addLineRow() {
    const body = document.getElementById('rcLinesBody');
    if (!body) return;
    const lastItemNo = Math.max(0, ...Array.from(body.querySelectorAll('tr')).map(tr => {
      const c = tr.querySelector('td'); return c ? parseInt(c.textContent, 10) || 0 : 0;
    }));
    const tr = document.createElement('tr');
    tr.innerHTML = `<td style="text-align:center;">${lastItemNo + 10}</td>
      <td><input type="text" data-field="matCode" placeholder="物料编码" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input type="text" data-field="matName" placeholder="物料描述" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input type="number" data-field="qty" min="0.001" step="0.001" placeholder="数量" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;text-align:right;"></td>
      <td><input type="text" data-field="unit" value="BOX" placeholder="单位" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input type="text" data-field="batch" placeholder="批次" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="text-align:center;"><button class="btn btn-danger btn-sm" onclick="SpReceipt.removeLineRow(this)" style="padding:2px 8px;font-size:12px;">删除</button></td>`;
    body.appendChild(tr);
  },

  removeLineRow(btn) {
    const tr = btn.closest('tr');
    const body = tr.parentNode;
    if (body.querySelectorAll('tr').length <= 1) return;
    tr.remove();
  },

  openForm() {
    this.editMode = false;
    this.editId = null;
    const cont = document.getElementById('rcModalContainer');
    cont.innerHTML = this.getFormModalHTML({});
    document.getElementById('rcModalBackdrop').classList.remove('hidden');
  },

  openEditModal(docNo) {
    const d = spReceiptData.find(x => x.docNo === docNo);
    if (!d) return;
    this.editMode = true;
    this.editId = docNo;
    const cont = document.getElementById('rcModalContainer');
    cont.innerHTML = this.getFormModalHTML(d);
    document.getElementById('rcModalBackdrop').classList.remove('hidden');
  },

  closeModal() { closeModal(); },

  _collectForm() {
    const lines = [];
    document.querySelectorAll('#rcLinesBody tr').forEach(tr => {
      const cells = tr.querySelectorAll('input');
      const line = {
        itemNo: parseInt(tr.children[0].textContent, 10) || 10,
        matCode: cells[0].value.trim(),
        matName: cells[1].value.trim(),
        qty: parseFloat(cells[2].value),
        unit: cells[3].value.trim(),
        batch: cells[4].value.trim()
      };
      if (line.matCode || line.matName || line.qty || line.batch) lines.push(line);
    });
    return {
      processOrderNo: document.getElementById('rcFPoNo').value.trim(),
      targetLocation: document.getElementById('rcFLoc').value,
      receiptDate: document.getElementById('rcFDate').value,
      createDept: document.getElementById('rcFDept').value,
      applicant: document.getElementById('rcFApplicant').value.trim(),
      notes: document.getElementById('rcFNotes').value.trim(),
      lines
    };
  },

  _validate(data) {
    if (!data.processOrderNo) return '请填写生产订单号';
    if (!data.targetLocation) return '请选择目标库位';
    if (!data.receiptDate) return '请选择入库日期';
    if (!data.createDept) return '请选择入库部门';
    if (!data.applicant) return '请填写入库人';
    if (!data.lines.length) return '请至少填写一行物料';
    for (const l of data.lines) {
      if (!l.matCode) return '物料编码不能为空';
      if (!l.matName) return '物料描述不能为空';
      if (!l.qty || l.qty <= 0) return '数量必须大于 0';
      if (!l.batch) return '成品入库必须填写批次';
    }
    return '';
  },

  submitForm() {
    const data = this._collectForm();
    const err = this._validate(data);
    if (err) { toast(err); return; }
    const payload = Object.assign({}, data, { moveType: '101' });

    const doSync = () => {
      SAP_MOCK.showLoading(this.editMode ? '正在调用 SAP 修改入库过账…' : '正在调用 SAP 成品入库过账…');
      SAP_MOCK.postGoodsMovement(payload).then(res => {
        SAP_MOCK.hideLoading();
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        if (this.editMode) {
          const d = spReceiptData.find(x => x.docNo === this.editId);
          if (d) Object.assign(d, this._toDoc(data, d.docNo, d.materialDocNo, d.status));
        } else {
          const seq = spReceiptData.length + 1;
          const docNo = 'RC-' + dateStr + '-' + String(seq).padStart(3, '0');
          spReceiptData.unshift(this._toDoc(data, docNo, res.materialDocNo, '已过账'));
        }
        toast('入库过账成功，SAP 物料凭证号：' + res.materialDocNo);
        this.closeModal();
        this.flatRows = this.flattenData();
        this.filteredFlat = [...this.flatRows];
        this.page = 1;
        this.renderRows();
        const c = document.getElementById('rcCount'); if (c) c.textContent = `共 ${this.filteredFlat.length} 行`;
      }).catch(e => {
        SAP_MOCK.hideLoading();
        if (confirm((e && e.message ? e.message : 'SAP 过账失败') + '\n\n点击「确定」重试，点击「取消」放弃。')) {
          doSync();
        }
      });
    };
    doSync();
  },

  _toDoc(data, docNo, materialDocNo, status) {
    return {
      docNo,
      processOrderNo: data.processOrderNo,
      targetLocation: data.targetLocation,
      receiptDate: data.receiptDate,
      createDept: data.createDept,
      applicant: data.applicant,
      status,
      materialDocNo,
      notes: data.notes,
      lines: data.lines
    };
  },

  openViewModal(docNo) {
    const d = spReceiptData.find(x => x.docNo === docNo);
    if (!d) return;
    const cont = document.getElementById('rcModalContainer');
    cont.innerHTML = `
      <div class="modal-backdrop" id="rcModalBackdrop" onclick="SpReceipt.closeModal()">
        <div class="modal" style="width:96vw;max-width:96vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">入库单 ${esc(d.docNo)} <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">成品入库 · 移动类型 101</span></div>
            <button class="modal-close" onclick="SpReceipt.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            <div class="form-section">
              <div class="form-section-title">抬头信息</div>
              <div class="detail-grid" style="grid-template-columns:repeat(6,minmax(0,1fr));">
                <div class="detail-item"><dt>入库单号</dt><dd><strong>${esc(d.docNo)}</strong></dd></div>
                <div class="detail-item"><dt>状态</dt><dd>${this.getStatusBadge(d.status)}</dd></div>
                <div class="detail-item"><dt>SAP 物料凭证</dt><dd>${esc(d.materialDocNo || '-')}</dd></div>
                <div class="detail-item"><dt>生产订单号</dt><dd>${esc(d.processOrderNo)}</dd></div>
                <div class="detail-item"><dt>目标库位</dt><dd>${esc(d.targetLocation)}</dd></div>
                <div class="detail-item"><dt>入库日期</dt><dd>${esc(d.receiptDate)}</dd></div>
                <div class="detail-item"><dt>入库部门</dt><dd>${esc(d.createDept)}</dd></div>
                <div class="detail-item"><dt>入库人</dt><dd>${esc(d.applicant)}</dd></div>
              </div>
            </div>
            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">行项目</div>
              <table class="data-table data-table-compact" style="min-width:700px;">
                <thead><tr>
                  <th style="width:60px;text-align:center;">行项目</th>
                  <th>物料编码</th><th>物料描述</th>
                  <th style="text-align:right;">数量</th><th style="width:50px;">单位</th><th>批次</th>
                </tr></thead>
                <tbody>
                  ${d.lines.map(l => `<tr>
                    <td style="text-align:center;">${l.itemNo}</td>
                    <td>${esc(l.matCode)}</td><td>${esc(l.matName)}</td>
                    <td style="text-align:right;">${l.qty}</td><td>${esc(l.unit)}</td><td>${esc(l.batch || '-')}</td>
                  </tr>`).join('')}
                </tbody>
              </table>
            </div>
            ${d.notes ? `<div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">备注</div>
              <div style="font-size:13px;color:var(--text-secondary);padding:4px 2px;">${esc(d.notes)}</div>
            </div>` : ''}
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="SpReceipt.closeModal()">关闭</button>
            ${d.status === '已冲销' ? '' : `<button class="btn btn-primary" onclick="SpReceipt.openEditModal('${d.docNo}')">编辑</button>`}
          </div>
        </div>
      </div>`;
  }
};

/* ---------------- 模拟数据 ---------------- */
const spReceiptData = [
  {
    docNo: 'RC-20260710-001', processOrderNo: '6000001234', targetLocation: 'C02成品暂存间',
    receiptDate: '2026-07-10', createDept: '生产一部', applicant: '张伟',
    status: '已过账', materialDocNo: '4900000101',
    notes: '第一批成品入库。',
    lines: [
      { itemNo: 10, matCode: 'F50001', matName: '脑心通胶囊 0.4g*36粒', qty: 5000, unit: 'BOX', batch: 'P260610' },
      { itemNo: 20, matCode: 'F50012', matName: '丹红注射液 10ml', qty: 3000, unit: 'BOX', batch: 'P260611' }
    ]
  },
  {
    docNo: 'RC-20260718-002', processOrderNo: '6000005678', targetLocation: 'C02成品暂存间',
    receiptDate: '2026-07-18', createDept: '生产二部', applicant: '王芳',
    status: '已过账', materialDocNo: '4900000208',
    notes: '',
    lines: [
      { itemNo: 10, matCode: 'F50021', matName: '稳心颗粒 5g*9袋', qty: 8000, unit: 'BOX', batch: 'P260618' }
    ]
  },
  {
    docNo: 'RC-20260725-003', processOrderNo: '6000009012', targetLocation: 'C01暂存间',
    receiptDate: '2026-07-25', createDept: '生产三部', applicant: '赵磊',
    status: '草稿', materialDocNo: '',
    notes: '待质量放行后正式入库。',
    lines: [
      { itemNo: 10, matCode: 'F50033', matName: '冠心舒通胶囊 0.3g*24粒', qty: 4000, unit: 'BOX', batch: 'P260625' }
    ]
  }
];
