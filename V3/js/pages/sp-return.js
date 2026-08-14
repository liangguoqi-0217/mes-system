/* ============================================================
 * sp-return.js — 退料单（预留单据 · 库存管理）
 * ------------------------------------------------------------
 * 创建方式（3 种）：
 *   ① return-internal-order  从内部订单退料 (移动类型 262)
 *   ② return-cost-center     从成本中心退料 (移动类型 202)
 *   ③ return-stock           基于现有库存退料 (移动类型 262)
 * 业务规则：退料单创建同样走 SAP 预留接口，SAP 反馈成功并返回
 * 预留编号后，MES 才将数据写入本地自建表。
 * ============================================================ */
const RETURN_TYPE_MAP = {
  'return-internal-order': { label: '从内部订单退料', desc: '创建移动类型 262 预留，退回至内部订单', moveType: '262', icon: '↩' },
  'return-cost-center':    { label: '从成本中心退料', desc: '创建移动类型 202 预留，退回至成本中心', moveType: '202', icon: '⇠' },
  'return-stock':          { label: '基于现有库存退料', desc: '基于现有库存直接退料回仓，不关联订单/成本中心', moveType: '262', icon: '⇥' }
};

const RETURN_DEPT_OPTIONS = ['生产一部', '生产二部', '生产三部', '质量部', '设备部'];
const RETURN_LOCATION_OPTIONS = ['A01原料仓', 'A02辅料仓', 'A03包装材料仓', 'B01线边仓', 'B02线边仓', 'C01暂存间', 'C02成品暂存间'];

const SpReturn = {
  page: 1, pageSize: 20, flatRows: [], filteredFlat: [],
  editMode: false, editId: null, formType: '',

  getTypeInfo(type) { return RETURN_TYPE_MAP[type] || { label: type, desc: '', moveType: '', icon: '' }; },

  getStatusBadge(s) {
    const c = { '草稿': 'badge-gray', '待同步': 'badge-yellow', '已同步': 'badge-green', '部分过账': 'badge-blue', '已完成': 'badge-green' };
    return `<span class="badge ${c[s] || 'badge-gray'}">${esc(s)}</span>`;
  },
  getTypeBadge(t) {
    return `<span class="badge" style="background:rgba(30,58,95,0.08);color:var(--primary);">${esc(this.getTypeInfo(t).label)}</span>`;
  },

  flattenData() {
    const rows = [];
    spReturnData.forEach(d => {
      if (!d.lines || !d.lines.length) return;
      d.lines.forEach(line => {
        rows.push({
          _doc: d, _line: line,
          docNo: d.docNo, itemNo: line.itemNo,
          returnType: d.returnType, returnTypeLabel: this.getTypeInfo(d.returnType).label,
          moveType: d.moveType, reservationNo: d.reservationNo || '',
          returnLocation: d.returnLocation, refDocNo: d.refDocNo || '',
          internalOrderNo: d.internalOrderNo || '', costCenter: d.costCenter || '',
          returnDept: d.returnDept, applicant: d.applicant, returnDate: d.returnDate,
          matCode: line.matCode || '', matName: line.matName || '',
          qty: line.qty, unit: line.unit || '', batch: line.batch || '',
          status: d.status, notes: d.notes || ''
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
          <div><div style="font-size:18px;font-weight:700;">退料单</div><div style="font-size:13px;opacity:0.8;">领料部分消耗后退回，支持 3 种退料方式，单据同步 SAP 预留</div></div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="btn btn-blue" onclick="SpReturn.openNewModal()"><span style="font-weight:700;font-size:16px;">+</span> 创建退料单</button>
          </div>
        </div>
        <div class="filter-bar filter-bar-nowrap" style="flex-shrink:0;">
          <div class="filter-group"><label>退料单号</label><input type="text" id="retDocNo" placeholder="单号"></div>
          <div class="filter-group"><label>退料方式</label><select id="retType">
            <option value="">全部</option>
            ${Object.keys(RETURN_TYPE_MAP).map(k => `<option value="${k}">${esc(RETURN_TYPE_MAP[k].label)}</option>`).join('')}
          </select></div>
          <div class="filter-group"><label>退回库位</label><input type="text" id="retLoc" placeholder="库位"></div>
          <div class="filter-group"><label>退料部门</label><input type="text" id="retDept" placeholder="部门"></div>
          <div class="filter-group"><label>状态</label><select id="retStatus">
            <option value="">全部</option>
            <option value="草稿">草稿</option><option value="待同步">待同步</option>
            <option value="已同步">已同步</option><option value="部分过账">部分过账</option><option value="已完成">已完成</option>
          </select></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="SpReturn.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="SpReturn.reset()">重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table data-table-compact" style="min-width:1250px;">
            <thead><tr>
              <th>退料单号</th><th>退料方式</th><th style="width:55px;text-align:center;">行项目</th>
              <th>物料</th><th>物料描述</th><th style="text-align:right;">数量</th><th style="width:38px;">单位</th>
              <th>退回库位</th><th>内部订单/成本中心</th><th>关联领料单</th>
              <th>退料部门</th><th>退料人</th><th>退料日期</th>
              <th style="width:80px;text-align:center;">状态</th><th style="width:76px;">操作</th>
            </tr></thead>
            <tbody id="retTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info">
            <span class="list-count" id="retCount">共 ${this.flatRows.length} 行</span>
            <span style="color:var(--text-muted);font-size:12px;">(共 ${spReturnData.length} 张退料单)</span>
          </div>
          <div class="pagination">
            <button class="pagination-btn" id="retPrev" disabled onclick="SpReturn.prevPage()">‹</button>
            <span class="pagination-info" id="retPageInfo">第 ${this.page} / ${Math.ceil(Math.max(this.flatRows.length,1)/this.pageSize)} 页</span>
            <button class="pagination-btn" id="retNext" onclick="SpReturn.nextPage()">›</button>
            <select class="page-size-select" id="retPageSizeSel" onchange="SpReturn.changePageSize()"><option value="20">20条</option><option value="40">40条</option><option value="80">80条</option></select>
          </div>
        </div>
      </div>
      <div id="retModalContainer"></div>`;
  },

  init() {
    this.renderRows();
    const el = document.getElementById('retDocNo');
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') this.search(); });
  },

  renderRows() {
    const body = document.getElementById('retTableBody');
    if (!body) return;
    const start = (this.page - 1) * this.pageSize;
    const rows = this.filteredFlat.slice(start, start + this.pageSize);
    if (!rows.length) {
      body.innerHTML = `<tr><td colspan="15" class="empty-cell">暂无符合条件的退料单</td></tr>`;
    } else {
      body.innerHTML = rows.map(r => `
        <tr>
          <td><strong>${esc(r.docNo)}</strong><div style="font-size:11px;color:var(--text-muted);">预留号: ${esc(r.reservationNo || '-')}</div></td>
          <td>${this.getTypeBadge(r.returnType)}</td>
          <td style="text-align:center;">${r.itemNo}</td>
          <td>${esc(r.matCode || '-')}</td>
          <td>${esc(r.matName || '-')}</td>
          <td style="text-align:right;">${r.qty}</td>
          <td>${esc(r.unit)}</td>
          <td>${esc(r.returnLocation)}</td>
          <td>${esc(r.internalOrderNo || r.costCenter || '-')}</td>
          <td>${esc(r.refDocNo || '-')}</td>
          <td>${esc(r.returnDept)}</td>
          <td>${esc(r.applicant)}</td>
          <td>${esc(r.returnDate)}</td>
          <td style="text-align:center;">${this.getStatusBadge(r.status)}</td>
          <td><button class="btn btn-blue btn-sm" onclick="SpReturn.openViewModal('${r.docNo}')">查看</button></td>
        </tr>`).join('');
    }
    const prev = document.getElementById('retPrev'), next = document.getElementById('retNext');
    const totalPages = Math.ceil(Math.max(this.filteredFlat.length, 1) / this.pageSize);
    if (prev) prev.disabled = this.page <= 1;
    if (next) next.disabled = this.page >= totalPages;
    const info = document.getElementById('retPageInfo');
    if (info) info.textContent = `第 ${this.page} / ${totalPages} 页`;
  },

  search() {
    const qDoc = (document.getElementById('retDocNo').value || '').trim().toLowerCase();
    const qType = document.getElementById('retType').value;
    const qLoc = (document.getElementById('retLoc').value || '').trim().toLowerCase();
    const qDept = (document.getElementById('retDept').value || '').trim().toLowerCase();
    const qStatus = document.getElementById('retStatus').value;
    this.filteredFlat = this.flatRows.filter(r =>
      (!qDoc || r.docNo.toLowerCase().includes(qDoc)) &&
      (!qType || r.returnType === qType) &&
      (!qLoc || r.returnLocation.toLowerCase().includes(qLoc)) &&
      (!qDept || r.returnDept.toLowerCase().includes(qDept)) &&
      (!qStatus || r.status === qStatus)
    );
    this.page = 1;
    this.renderRows();
    const c = document.getElementById('retCount'); if (c) c.textContent = `共 ${this.filteredFlat.length} 行`;
  },
  reset() {
    ['retDocNo', 'retLoc', 'retDept'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    ['retType', 'retStatus'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    this.filteredFlat = [...this.flatRows];
    this.page = 1;
    this.renderRows();
    const c = document.getElementById('retCount'); if (c) c.textContent = `共 ${this.filteredFlat.length} 行`;
  },
  prevPage() { if (this.page > 1) { this.page--; this.renderRows(); } },
  nextPage() { if (this.page < Math.ceil(this.filteredFlat.length / this.pageSize)) { this.page++; this.renderRows(); } },
  changePageSize() { this.pageSize = +document.getElementById('retPageSizeSel').value; this.page = 1; this.renderRows(); },

  openNewModal() {
    const cards = Object.entries(RETURN_TYPE_MAP).map(([k, v]) => `
      <div class="new-type-card" onclick="SpReturn.openForm('${k}')">
        <div class="new-type-icon">${v.icon}</div>
        <div class="new-type-name">${esc(v.label)}</div>
        <div class="new-type-desc">${esc(v.desc)}</div>
        <div class="new-type-move">移动类型 ${v.moveType}</div>
      </div>`).join('');
    showModal('创建退料单 — 请选择退料方式', `
      <div style="padding:4px 2px 12px;">
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:14px;">退料单创建后自动调用 SAP 创建预留接口，SAP 返回预留编号后单据方生效。</div>
        <div class="new-type-grid">${cards}</div>
      </div>`, [{ text: '取消', cls: 'btn-secondary', action: closeModal }], 'modal-xl');
  },

  _renderTypeFields(type, d) {
    d = d || {};
    const inputStyle = 'width:100%;border:none;background:transparent;font-size:14px;font-weight:600;color:inherit;padding:0;outline:none;';
    const byType = {
      'return-internal-order': `
        <div class="detail-item"><dt><span class="req">*</span> 内部订单号</dt><dd><input type="text" id="retFInternalOrder" placeholder="如 IO-2026-0101" value="${esc(d.internalOrderNo || '')}" style="${inputStyle}"></dd></div>`,
      'return-cost-center': `
        <div class="detail-item"><dt><span class="req">*</span> 成本中心</dt><dd><input type="text" id="retFCostCenter" placeholder="如 CC-1001" value="${esc(d.costCenter || '')}" style="${inputStyle}"></dd></div>`,
      'return-stock': ``
    };
    return (byType[type] || '') + `
      <div class="detail-item"><dt>关联领料单号</dt><dd><input type="text" id="retFRefDoc" placeholder="选填，如 PL-20260701-001" value="${esc(d.refDocNo || '')}" style="${inputStyle}"></dd></div>`;
  },

  getFormModalHTML(type, d) {
    d = d || {};
    const info = this.getTypeInfo(type);
    const isEdit = this.editMode;
    const lines = (d.lines && d.lines.length ? d.lines : [{ itemNo: 10, matCode: '', matName: '', qty: '', unit: 'KG', batch: '' }]);
    const today = new Date().toISOString().slice(0, 10);
    const inputStyle = 'width:100%;border:none;background:transparent;font-size:14px;font-weight:600;color:inherit;padding:0;outline:none;';
    return `
      <div class="modal-backdrop" id="retModalBackdrop" onclick="SpReturn.closeModal()">
        <div class="modal" style="width:98vw;max-width:98vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">${isEdit ? '修改' : '新建'}退料单 - ${esc(d.docNo || '(自动生成)')} <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">${esc(info.label)} · 移动类型 ${info.moveType}${d.reservationNo ? ' · 预留号 ' + d.reservationNo : ''}</span></div>
            <button class="modal-close" onclick="SpReturn.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            <div class="form-section">
              <div class="form-section-title">抬头信息</div>
              <div class="detail-grid" style="grid-template-columns:repeat(8,minmax(0,1fr));">
                <div class="detail-item"><dt>退料单号</dt><dd><strong>${esc(d.docNo || '(自动生成)')}</strong><input type="hidden" id="retFDocNo" value="${esc(d.docNo || '')}"></dd></div>
                <div class="detail-item"><dt>退料方式</dt><dd>${esc(info.label)}<input type="hidden" id="retFType" value="${type}"></dd></div>
                <div class="detail-item"><dt>移动类型</dt><dd>${info.moveType}</dd></div>
                <div class="detail-item"><dt>工厂</dt><dd><select id="retFPlant" style="${inputStyle}"><option value="1000">1000 - 山东步长制药工厂</option></select></dd></div>
                <div class="detail-item"><dt><span class="req">*</span> 退料日期</dt><dd><input type="date" id="retFDate" value="${esc(d.returnDate || today)}" style="${inputStyle}"></dd></div>
                <div class="detail-item"><dt><span class="req">*</span> 退料部门</dt><dd><select id="retFDept" style="${inputStyle}">${[''].concat(RETURN_DEPT_OPTIONS).map(o => `<option value="${o}"${d.returnDept===o?' selected':''}>${o || '请选择'}</option>`).join('')}</select></dd></div>
                <div class="detail-item"><dt><span class="req">*</span> 退料人</dt><dd><input type="text" id="retFApplicant" value="${esc(d.applicant || window.currentUserId || '')}" style="${inputStyle}"></dd></div>
                <div class="detail-item"><dt><span class="req">*</span> 退回库位</dt><dd><select id="retFLoc" style="${inputStyle}">${RETURN_LOCATION_OPTIONS.map(o => `<option value="${o}"${d.returnLocation===o?' selected':''}>${o}</option>`).join('')}</select></dd></div>
                ${this._renderTypeFields(type, d)}
              </div>
            </div>

            <div class="form-section" style="margin-top:14px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <div class="form-section-title" style="margin-bottom:0;">行项目</div>
                <button class="btn btn-sm btn-outline" onclick="SpReturn.addLineRow()" style="padding:4px 12px;font-size:12px;">+ 添加行</button>
              </div>
              <div style="overflow-x:auto;">
                <table class="data-table data-table-compact" style="min-width:1000px;">
                  <thead><tr>
                    <th style="width:60px;text-align:center;">行项目</th>
                    <th style="min-width:130px;"><span class="req">*</span> 物料编码</th>
                    <th style="min-width:200px;"><span class="req">*</span> 物料描述</th>
                    <th style="min-width:100px;text-align:right;"><span class="req">*</span> 数量</th>
                    <th style="width:80px;">单位</th>
                    <th style="min-width:100px;">批次</th>
                    <th style="width:60px;text-align:center;"></th>
                  </tr></thead>
                  <tbody id="retLinesBody">
                    ${lines.map(l => SpReturn.renderLineRow(l)).join('')}
                  </tbody>
                </table>
              </div>
              <div style="margin-top:8px;font-size:12px;color:var(--text-secondary);">提示：点击 "+" 可添加多行物料；物料编码/描述/数量为必填。</div>
            </div>

            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">备注</div>
              <div class="detail-grid" style="grid-template-columns:repeat(2,minmax(0,1fr));">
                <div class="detail-item"><dt>备注</dt><dd><textarea id="retFNotes" rows="2" placeholder="选填">${esc(d.notes || '')}</textarea></dd></div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="SpReturn.closeModal()">取消</button>
            <button class="btn btn-primary" onclick="SpReturn.submitForm()">提交</button>
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
      <td><input type="text" data-field="batch" value="${esc(line.batch || '')}" placeholder="批次(选填)" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="text-align:center;"><button class="btn btn-danger btn-sm" onclick="SpReturn.removeLineRow(this)" style="padding:2px 8px;font-size:12px;">删除</button></td>
    </tr>`;
  },

  addLineRow() {
    const body = document.getElementById('retLinesBody');
    if (!body) return;
    const lastItemNo = Math.max(0, ...Array.from(body.querySelectorAll('tr')).map(tr => {
      const c = tr.querySelector('td'); return c ? parseInt(c.textContent, 10) || 0 : 0;
    }));
    const tr = document.createElement('tr');
    tr.innerHTML = `<td style="text-align:center;">${lastItemNo + 10}</td>
      <td><input type="text" data-field="matCode" placeholder="物料编码" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input type="text" data-field="matName" placeholder="物料描述" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input type="number" data-field="qty" min="0.001" step="0.001" placeholder="数量" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;text-align:right;"></td>
      <td><input type="text" data-field="unit" value="KG" placeholder="单位" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input type="text" data-field="batch" placeholder="批次(选填)" style="width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="text-align:center;"><button class="btn btn-danger btn-sm" onclick="SpReturn.removeLineRow(this)" style="padding:2px 8px;font-size:12px;">删除</button></td>`;
    body.appendChild(tr);
  },

  removeLineRow(btn) {
    const tr = btn.closest('tr');
    const body = tr.parentNode;
    if (body.querySelectorAll('tr').length <= 1) return;
    tr.remove();
  },

  openForm(type) {
    this.editMode = false;
    this.editId = null;
    this.formType = type;
    const cont = document.getElementById('retModalContainer');
    cont.innerHTML = this.getFormModalHTML(type, {});
    document.getElementById('retModalBackdrop').classList.remove('hidden');
  },

  openEditModal(docNo) {
    const d = spReturnData.find(x => x.docNo === docNo);
    if (!d) return;
    this.editMode = true;
    this.editId = docNo;
    this.formType = d.returnType;
    const cont = document.getElementById('retModalContainer');
    cont.innerHTML = this.getFormModalHTML(d.returnType, d);
    document.getElementById('retModalBackdrop').classList.remove('hidden');
  },

  closeModal() { closeModal(); },

  _collectForm() {
    const lines = [];
    document.querySelectorAll('#retLinesBody tr').forEach(tr => {
      const cells = tr.querySelectorAll('input');
      const line = {
        itemNo: parseInt(tr.children[0].textContent, 10) || 10,
        matCode: cells[0].value.trim(),
        matName: cells[1].value.trim(),
        qty: parseFloat(cells[2].value),
        unit: cells[3].value.trim(),
        batch: cells[4].value.trim()
      };
      if (line.matCode || line.matName || line.qty) lines.push(line);
    });
    return {
      plant: document.getElementById('retFPlant').value,
      returnDate: document.getElementById('retFDate').value,
      returnDept: document.getElementById('retFDept').value,
      applicant: document.getElementById('retFApplicant').value.trim(),
      returnLocation: document.getElementById('retFLoc').value,
      internalOrderNo: (document.getElementById('retFInternalOrder') || {}).value || '',
      costCenter: (document.getElementById('retFCostCenter') || {}).value || '',
      refDocNo: (document.getElementById('retFRefDoc') || {}).value || '',
      notes: document.getElementById('retFNotes').value.trim(),
      lines
    };
  },

  _validate(data) {
    if (!data.returnDate) return '请选择退料日期';
    if (!data.returnDept) return '请选择退料部门';
    if (!data.applicant) return '请填写退料人';
    if (!data.returnLocation) return '请选择退回库位';
    if (this.formType === 'return-internal-order' && !data.internalOrderNo) return '请填写内部订单号';
    if (this.formType === 'return-cost-center' && !data.costCenter) return '请填写成本中心';
    if (!data.lines.length) return '请至少填写一行物料';
    for (const l of data.lines) {
      if (!l.matCode) return '物料编码不能为空';
      if (!l.matName) return '物料描述不能为空';
      if (!l.qty || l.qty <= 0) return '数量必须大于 0';
    }
    return '';
  },

  submitForm() {
    const data = this._collectForm();
    const err = this._validate(data);
    if (err) { toast(err); return; }
    const info = this.getTypeInfo(this.formType);
    const payload = Object.assign({}, data, {
      moveType: info.moveType,
      reservationNo: this.editMode ? this._getEditResNo() : ''
    });

    const doSync = () => {
      SAP_MOCK.showLoading(this.editMode ? '正在调用 SAP 修改退料预留…' : '正在调用 SAP 创建退料预留…');
      const call = this.editMode
        ? SAP_MOCK.updateReservation(payload.reservationNo, payload)
        : SAP_MOCK.createReservation(payload);
      call.then(res => {
        SAP_MOCK.hideLoading();
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        if (this.editMode) {
          const d = spReturnData.find(x => x.docNo === this.editId);
          if (d) Object.assign(d, this._toDoc(data, payload, d.docNo, d.reservationNo, d.status));
        } else {
          const seq = spReturnData.length + 1;
          const docNo = 'RT-' + dateStr + '-' + String(seq).padStart(3, '0');
          spReturnData.unshift(this._toDoc(data, payload, docNo, res.reservationNo, '已同步'));
        }
        toast(this.editMode ? '修改已同步至 SAP 预留 ' + (payload.reservationNo || '') : '创建成功，SAP 返回预留号：' + res.reservationNo);
        this.closeModal();
        this.flatRows = this.flattenData();
        this.filteredFlat = [...this.flatRows];
        this.page = 1;
        this.renderRows();
        const c = document.getElementById('retCount'); if (c) c.textContent = `共 ${this.filteredFlat.length} 行`;
      }).catch(e => {
        SAP_MOCK.hideLoading();
        if (confirm((e && e.message ? e.message : 'SAP 同步失败') + '\n\n点击「确定」重试，点击「取消」放弃。')) {
          doSync();
        }
      });
    };
    doSync();
  },

  _getEditResNo() {
    const d = spReturnData.find(x => x.docNo === this.editId);
    return d ? d.reservationNo : '';
  },

  _toDoc(data, payload, docNo, reservationNo, status) {
    return {
      docNo,
      returnType: this.formType,
      moveType: payload.moveType,
      reservationNo,
      plant: data.plant,
      returnLocation: data.returnLocation,
      internalOrderNo: data.internalOrderNo,
      costCenter: data.costCenter,
      refDocNo: data.refDocNo,
      returnDept: data.returnDept,
      applicant: data.applicant,
      returnDate: data.returnDate,
      status,
      notes: data.notes,
      lines: data.lines
    };
  },

  openViewModal(docNo) {
    const d = spReturnData.find(x => x.docNo === docNo);
    if (!d) return;
    const info = this.getTypeInfo(d.returnType);
    const acc = d.internalOrderNo ? `内部订单: ${esc(d.internalOrderNo)}` : (d.costCenter ? `成本中心: ${esc(d.costCenter)}` : '-');
    const cont = document.getElementById('retModalContainer');
    cont.innerHTML = `
      <div class="modal-backdrop" id="retModalBackdrop" onclick="SpReturn.closeModal()">
        <div class="modal" style="width:96vw;max-width:96vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">退料单 ${esc(d.docNo)} <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">${esc(info.label)} · 移动类型 ${info.moveType}</span></div>
            <button class="modal-close" onclick="SpReturn.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            <div class="form-section">
              <div class="form-section-title">抬头信息</div>
              <div class="detail-grid" style="grid-template-columns:repeat(6,minmax(0,1fr));">
                <div class="detail-item"><dt>退料单号</dt><dd><strong>${esc(d.docNo)}</strong></dd></div>
                <div class="detail-item"><dt>状态</dt><dd>${this.getStatusBadge(d.status)}</dd></div>
                <div class="detail-item"><dt>SAP 预留号</dt><dd>${esc(d.reservationNo || '-')}</dd></div>
                <div class="detail-item"><dt>移动类型</dt><dd>${esc(d.moveType)}</dd></div>
                <div class="detail-item"><dt>工厂</dt><dd>${esc(d.plant)}</dd></div>
                <div class="detail-item"><dt>退料日期</dt><dd>${esc(d.returnDate)}</dd></div>
                <div class="detail-item"><dt>退料部门</dt><dd>${esc(d.returnDept)}</dd></div>
                <div class="detail-item"><dt>退料人</dt><dd>${esc(d.applicant)}</dd></div>
                <div class="detail-item"><dt>退回库位</dt><dd>${esc(d.returnLocation)}</dd></div>
                <div class="detail-item"><dt>成本对象</dt><dd>${acc}</dd></div>
                <div class="detail-item"><dt>关联领料单</dt><dd>${esc(d.refDocNo || '-')}</dd></div>
              </div>
            </div>
            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">行项目</div>
              <table class="data-table data-table-compact" style="min-width:800px;">
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
            <button class="btn btn-secondary" onclick="SpReturn.closeModal()">关闭</button>
            ${d.status === '已完成' ? '' : `<button class="btn btn-primary" onclick="SpReturn.openEditModal('${d.docNo}')">编辑</button>`}
          </div>
        </div>
      </div>`;
  }
};

/* ---------------- 模拟数据 ---------------- */
const spReturnData = [
  {
    docNo: 'RT-20260715-001', returnType: 'return-internal-order', moveType: '262', reservationNo: '0000000511',
    plant: '1000', returnLocation: 'A01原料仓',
    internalOrderNo: 'IO-2026-0101', costCenter: '', refDocNo: 'PL-20260701-001',
    returnDept: '生产一部', applicant: '张伟', returnDate: '2026-07-15', status: '已完成',
    notes: '内部订单结项，剩余物料退回。',
    lines: [
      { itemNo: 10, matCode: 'M10001', matName: '黄芩提取物', qty: 120, unit: 'KG', batch: 'B260601' },
      { itemNo: 20, matCode: 'M10012', matName: '药用淀粉', qty: 50, unit: 'KG', batch: 'B260602' }
    ]
  },
  {
    docNo: 'RT-20260722-002', returnType: 'return-cost-center', moveType: '202', reservationNo: '0000000619',
    plant: '1000', returnLocation: 'A02辅料仓',
    internalOrderNo: '', costCenter: 'CC-1001', refDocNo: 'PL-20260705-002',
    returnDept: '设备部', applicant: '李强', returnDate: '2026-07-22', status: '已同步',
    notes: '',
    lines: [
      { itemNo: 10, matCode: 'M20008', matName: '工业润滑油', qty: 10, unit: 'L', batch: '' }
    ]
  },
  {
    docNo: 'RT-20260728-003', returnType: 'return-stock', moveType: '262', reservationNo: '0000000722',
    plant: '1000', returnLocation: 'A03包装材料仓',
    internalOrderNo: '', costCenter: '', refDocNo: 'PL-20260712-003',
    returnDept: '生产二部', applicant: '王芳', returnDate: '2026-07-28', status: '部分过账',
    notes: '包材备料剩余退回。',
    lines: [
      { itemNo: 10, matCode: 'M30001', matName: '铝箔复合膜', qty: 500, unit: 'M', batch: '' },
      { itemNo: 20, matCode: 'M30005', matName: '药用纸盒', qty: 800, unit: 'PCS', batch: '' }
    ]
  }
];
