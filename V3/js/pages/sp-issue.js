/* ============================================================
 * sp-issue.js — 领料单（预留单据 · 库存管理）
 * ------------------------------------------------------------
 * 创建方式（4 种）：
 *   ① consume-internal-order  领取即消耗-内部订单   (移动类型 261)
 *   ② consume-cost-center     领取即消耗-成本中心   (移动类型 201)
 *   ③ staging-move            领至暂存间（A→B 库位）(移动类型 311)
 *   ④ staging-process-order   按生产指令领至暂存间   (移动类型 311)
 * 业务规则：创建/修改均先调 SAP 预留接口，SAP 反馈成功并返回
 * 预留编号后，MES 才将数据写入本地自建表。
 * ============================================================ */
const ISSUE_TYPE_MAP = {
  'consume-internal-order': { label: '领取即消耗-内部订单', desc: '创建移动类型 261 预留，消耗到内部订单', moveType: '261', icon: '◈' },
  'consume-cost-center':    { label: '领取即消耗-成本中心', desc: '创建移动类型 201 预留，消耗到成本中心', moveType: '201', icon: '◇' },
  'staging-move':           { label: '领至暂存间', desc: '库位间转移预留（A 库位 → B 库位），不关联流程订单', moveType: '311', icon: '⇄' },
  'staging-process-order':  { label: '按生产指令领至暂存间', desc: '按流程订单领料至暂存间，需填写流程订单编号', moveType: '311', icon: '⚙' }
};

const ISSUE_DEPT_OPTIONS = ['生产一部', '生产二部', '生产三部', '质量部', '设备部'];
const LOCATION_OPTIONS = ['A01原料仓', 'A02辅料仓', 'A03包装材料仓', 'B01线边仓', 'B02线边仓', 'C01暂存间', 'C02成品暂存间'];

const SpIssue = {
  page: 1, pageSize: 20, flatRows: [], filteredFlat: [],
  editMode: false, editId: null, formType: '',

  /* ---------------- 工具 ---------------- */
  getTypeInfo(type) { return ISSUE_TYPE_MAP[type] || { label: type, desc: '', moveType: '', icon: '' }; },

  getStatusBadge(s) {
    const c = { '草稿': 'badge-gray', '待同步': 'badge-yellow', '已同步': 'badge-green', '部分过账': 'badge-blue', '已完成': 'badge-green' };
    return `<span class="badge ${c[s] || 'badge-gray'}">${esc(s)}</span>`;
  },
  getTypeBadge(t) {
    return `<span class="badge" style="background:rgba(30,58,95,0.08);color:var(--primary);">${esc(this.getTypeInfo(t).label)}</span>`;
  },

  flattenData() {
    const rows = [];
    spIssueData.forEach(d => {
      if (!d.lines || !d.lines.length) return;
      d.lines.forEach(line => {
        rows.push({
          _doc: d, _line: line,
          docNo: d.docNo, itemNo: line.itemNo,
          issueType: d.issueType, issueTypeLabel: this.getTypeInfo(d.issueType).label,
          moveType: d.moveType, reservationNo: d.reservationNo || '',
          issueLocation: d.issueLocation, targetLocation: d.targetLocation || '',
          internalOrderNo: d.internalOrderNo || '', costCenter: d.costCenter || '', processOrderNo: d.processOrderNo || '',
          issueDept: d.issueDept, applicant: d.applicant, issueDate: d.issueDate,
          matCode: line.matCode || '', matName: line.matName || '',
          qty: line.qty, unit: line.unit || '', batch: line.batch || '',
          status: d.status, notes: d.notes || ''
        });
      });
    });
    return rows;
  },

  /* ---------------- 页面渲染 ---------------- */
  render() {
    this.flatRows = this.flattenData();
    this.filteredFlat = [...this.flatRows];
    this.page = 1;
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">领料单</div><div style="font-size:13px;opacity:0.8;">车间从仓库/其他车间领料，支持 4 种领料方式，单据同步 SAP 预留</div></div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="btn btn-blue" onclick="SpIssue.openNewModal()"><span style="font-weight:700;font-size:16px;">+</span> 创建领料单</button>
          </div>
        </div>
        <div class="filter-bar filter-bar-nowrap" style="flex-shrink:0;">
          <div class="filter-group"><label>预留号</label><input type="text" id="issueDocNo" placeholder="号码"></div>
          <div class="filter-group"><label>领料方式</label><select id="issueType">
            <option value="">全部</option>
            ${Object.keys(ISSUE_TYPE_MAP).map(k => `<option value="${k}">${esc(ISSUE_TYPE_MAP[k].label)}</option>`).join('')}
          </select></div>
          <div class="filter-group"><label>发出库位</label><input type="text" id="issueLoc" placeholder="库位"></div>
          <div class="filter-group"><label>请领部门</label><input type="text" id="issueDept" placeholder="部门"></div>
          <div class="filter-group"><label>状态</label><select id="issueStatus">
            <option value="">全部</option>
            <option value="草稿">草稿</option><option value="待同步">待同步</option>
            <option value="已同步">已同步</option><option value="部分过账">部分过账</option><option value="已完成">已完成</option>
          </select></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="SpIssue.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="SpIssue.reset()">重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table data-table-compact" style="min-width:1400px;">
            <thead><tr>
              <th>预留号</th><th>领料方式</th><th style="width:55px;text-align:center;">行项目</th>
              <th>物料</th><th>物料描述</th><th style="text-align:right;">数量</th><th style="width:38px;">单位</th>
              <th>发出库位</th><th>目标库位</th><th>内部订单/成本中心/流程订单</th>
              <th>请领部门</th><th>申请人</th><th>领料日期</th>
              <th style="width:80px;text-align:center;">状态</th><th style="width:76px;">操作</th>
            </tr></thead>
            <tbody id="issueTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info">
            <span class="list-count" id="issueCount">共 ${this.flatRows.length} 行</span>
            <span style="color:var(--text-muted);font-size:12px;">(共 ${spIssueData.length} 张领料单)</span>
          </div>
          <div class="pagination">
            <button class="pagination-btn" id="issuePrev" disabled onclick="SpIssue.prevPage()">‹</button>
            <span class="pagination-info" id="issuePageInfo">第 ${this.page} / ${Math.ceil(Math.max(this.flatRows.length,1)/this.pageSize)} 页</span>
            <button class="pagination-btn" id="issueNext" onclick="SpIssue.nextPage()">›</button>
            <select class="page-size-select" id="issuePageSizeSel" onchange="SpIssue.changePageSize()"><option value="20">20条</option><option value="40">40条</option><option value="80">80条</option></select>
          </div>
        </div>
      </div>
      <div id="issueModalContainer"></div>`;
  },

  init() {
    this.renderRows();
    const el = document.getElementById('issueDocNo');
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') this.search(); });
  },

  renderRows() {
    const body = document.getElementById('issueTableBody');
    if (!body) return;
    const start = (this.page - 1) * this.pageSize;
    const rows = this.filteredFlat.slice(start, start + this.pageSize);
    if (!rows.length) {
      body.innerHTML = `<tr><td colspan="15" class="empty-cell">暂无符合条件的领料单</td></tr>`;
    } else {
      body.innerHTML = rows.map(r => `
        <tr>
          <td><strong>${esc(r.reservationNo || '-')}</strong></td>
          <td>${this.getTypeBadge(r.issueType)}</td>
          <td style="text-align:center;">${r.itemNo}</td>
          <td>${esc(r.matCode || '-')}</td>
          <td>${esc(r.matName || '-')}</td>
          <td style="text-align:right;">${r.qty}</td>
          <td>${esc(r.unit)}</td>
          <td>${esc(r.issueLocation)}</td>
          <td>${esc(r.targetLocation || '-')}</td>
          <td>${esc(r.internalOrderNo || r.costCenter || r.processOrderNo || '-')}</td>
          <td>${esc(r.issueDept)}</td>
          <td>${esc(r.applicant)}</td>
          <td>${esc(r.issueDate)}</td>
          <td style="text-align:center;">${this.getStatusBadge(r.status)}</td>
          <td><button class="btn btn-blue btn-sm" onclick="SpIssue.openViewModal('${r.docNo}')">查看</button></td>
        </tr>`).join('');
    }
    const prev = document.getElementById('issuePrev'), next = document.getElementById('issueNext');
    const totalPages = Math.ceil(Math.max(this.filteredFlat.length, 1) / this.pageSize);
    if (prev) prev.disabled = this.page <= 1;
    if (next) next.disabled = this.page >= totalPages;
    const info = document.getElementById('issuePageInfo');
    if (info) info.textContent = `第 ${this.page} / ${totalPages} 页`;
  },

  /* ---------------- 筛选 / 分页 ---------------- */
  search() {
    const qDoc = (document.getElementById('issueDocNo').value || '').trim().toLowerCase();
    const qType = document.getElementById('issueType').value;
    const qLoc = (document.getElementById('issueLoc').value || '').trim().toLowerCase();
    const qDept = (document.getElementById('issueDept').value || '').trim().toLowerCase();
    const qStatus = document.getElementById('issueStatus').value;
    this.filteredFlat = this.flatRows.filter(r =>
      (!qDoc || (r.reservationNo || '').toLowerCase().includes(qDoc) || r.docNo.toLowerCase().includes(qDoc)) &&
      (!qType || r.issueType === qType) &&
      (!qLoc || r.issueLocation.toLowerCase().includes(qLoc) || (r.targetLocation || '').toLowerCase().includes(qLoc)) &&
      (!qDept || r.issueDept.toLowerCase().includes(qDept)) &&
      (!qStatus || r.status === qStatus)
    );
    this.page = 1;
    this.renderRows();
    const c = document.getElementById('issueCount'); if (c) c.textContent = `共 ${this.filteredFlat.length} 行`;
  },
  reset() {
    ['issueDocNo', 'issueLoc', 'issueDept'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    ['issueType', 'issueStatus'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    this.filteredFlat = [...this.flatRows];
    this.page = 1;
    this.renderRows();
    const c = document.getElementById('issueCount'); if (c) c.textContent = `共 ${this.filteredFlat.length} 行`;
  },
  prevPage() { if (this.page > 1) { this.page--; this.renderRows(); } },
  nextPage() { if (this.page < Math.ceil(this.filteredFlat.length / this.pageSize)) { this.page++; this.renderRows(); } },
  changePageSize() { this.pageSize = +document.getElementById('issuePageSizeSel').value; this.page = 1; this.renderRows(); },

  /* ---------------- 创建方式选择弹窗 ---------------- */
  openNewModal() {
    const typeList = Object.entries(ISSUE_TYPE_MAP).map(([k, v]) => ({ key: k, ...v }));
    const gridCols = typeList.length <= 3 ? '1fr 1fr 1fr' : '1fr 1fr';
    const cards = typeList.map((t, i) => {
      const num = String(i + 1).padStart(2, '0');
      return `
        <div onclick="closeModal();SpIssue.openForm('${t.key}')"
          style="background:#f8fafc;border:1px solid var(--border);border-left:3px solid var(--primary);border-radius:8px;padding:18px 16px;cursor:pointer;transition:all .22s;text-align:left;"
          onmouseenter="this.style.borderColor='var(--primary)';this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 18px rgba(30,58,95,.10)'"
          onmouseleave="this.style.borderColor='var(--border)';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:#94a3b8;margin-bottom:6px;">${num}</div>
          <div style="font-size:15px;font-weight:700;color:var(--primary);margin-bottom:4px;">${esc(t.label)}</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.45;">${esc(t.desc)}</div>
          <div style="margin-top:12px;text-align:right;"><span class="badge" style="padding:5px 16px;border-radius:16px;font-size:12px;background:var(--primary);color:#fff;cursor:pointer;">开始填写 →</span></div>
        </div>`;
    }).join('');
    const body = `
      <div style="padding:4px 0;">
        <div style="font-size:14px;color:var(--text-secondary);margin-bottom:16px;text-align:center;">
          请选择一种领料方式
        </div>
        <div style="display:grid;grid-template-columns:${gridCols};gap:14px;">
          ${cards}
        </div>
        <div style="margin-top:14px;padding:8px 12px;background:#f9fafb;border-radius:8px;font-size:12px;color:var(--text-muted);text-align:center;border:1px dashed var(--border);">
          💡 提示：领料单创建后自动调用 SAP 创建预留接口，返回预留编号后单据方生效
        </div>
      </div>`;
    showModal('📌 选择领料方式', body, [{ text: '取消', cls: 'btn-secondary', action: closeModal }], 'modal-xl');
  },

  /* ---------------- 表单弹窗 ---------------- */
  _renderTypeFields(type, d) {
    d = d || {};
    const inputStyle = 'width:100%;border:none;background:transparent;font-size:14px;font-weight:600;color:inherit;padding:0;outline:none;';
    const base = `
      <div class="detail-item"><dt><span class="req">*</span> 发出库位</dt><dd><select id="issueFLoc" style="${inputStyle}">${LOCATION_OPTIONS.map(o => `<option value="${o}"${d.issueLocation===o?' selected':''}>${o}</option>`).join('')}</select></dd></div>`;
    const byType = {
      'consume-internal-order': `
        <div class="detail-item"><dt><span class="req">*</span> 内部订单号</dt><dd><input type="text" id="issueFInternalOrder" placeholder="如 IO-2026-0101" value="${esc(d.internalOrderNo || '')}" style="${inputStyle}"></dd></div>`,
      'consume-cost-center': `
        <div class="detail-item"><dt><span class="req">*</span> 成本中心</dt><dd><input type="text" id="issueFCostCenter" placeholder="如 CC-1001" value="${esc(d.costCenter || '')}" style="${inputStyle}"></dd></div>`,
      'staging-move': `
        <div class="detail-item"><dt><span class="req">*</span> 目标库位（暂存间）</dt><dd><select id="issueFTargetLoc" style="${inputStyle}">${LOCATION_OPTIONS.map(o => `<option value="${o}"${d.targetLocation===o?' selected':''}>${o}</option>`).join('')}</select></dd></div>`,
      'staging-process-order': `
        <div class="detail-item"><dt><span class="req">*</span> 流程订单号</dt><dd><input type="text" id="issueFProcessOrder" placeholder="如 6000001234" value="${esc(d.processOrderNo || '')}" style="${inputStyle}"></dd></div>
        <div class="detail-item"><dt><span class="req">*</span> 目标库位（暂存间）</dt><dd><select id="issueFTargetLoc" style="${inputStyle}">${LOCATION_OPTIONS.map(o => `<option value="${o}"${d.targetLocation===o?' selected':''}>${o}</option>`).join('')}</select></dd></div>`
    };
    return base + (byType[type] || '');
  },

  getFormModalHTML(type, d) {
    d = d || {};
    const info = this.getTypeInfo(type);
    const isEdit = this.editMode;
    const lines = (d.lines && d.lines.length ? d.lines : [{ itemNo: 10, matCode: '', matName: '', qty: '', unit: 'KG', batch: '' }]);
    const today = new Date().toISOString().slice(0, 10);
    const inputStyle = 'width:100%;border:none;background:transparent;font-size:14px;font-weight:600;color:inherit;padding:0;outline:none;';
    return `
      <div class="modal-backdrop" id="issueModalBackdrop" onclick="SpIssue.closeModal()">
        <div class="modal" style="width:98vw;max-width:98vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">${isEdit ? '修改' : '新建'}领料单 - ${esc(d.docNo || '(自动生成)')} <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">${esc(info.label)} · 移动类型 ${info.moveType}${d.reservationNo ? ' · 预留号 ' + d.reservationNo : ''}</span></div>
            <button class="modal-close" onclick="SpIssue.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            <div class="form-section">
              <div class="form-section-title">抬头信息</div>
              <div class="detail-grid" style="grid-template-columns:repeat(8,minmax(0,1fr));">
                <div class="detail-item"><dt>领料单号</dt><dd><strong>${esc(d.docNo || '(自动生成)')}</strong><input type="hidden" id="issueFDocNo" value="${esc(d.docNo || '')}"></dd></div>
                <div class="detail-item"><dt>领料方式</dt><dd>${esc(info.label)}<input type="hidden" id="issueFType" value="${type}"></dd></div>
                <div class="detail-item"><dt>移动类型</dt><dd>${info.moveType}</dd></div>
                <div class="detail-item"><dt>工厂</dt><dd><select id="issueFPlant" style="${inputStyle}"><option value="1000">1000 - 山东步长制药工厂</option></select></dd></div>
                <div class="detail-item"><dt><span class="req">*</span> 领料日期</dt><dd><input type="date" id="issueFDate" value="${esc(d.issueDate || today)}" style="${inputStyle}"></dd></div>
                <div class="detail-item"><dt><span class="req">*</span> 请领部门</dt><dd><select id="issueFDept" style="${inputStyle}">${[''].concat(ISSUE_DEPT_OPTIONS).map(o => `<option value="${o}"${d.issueDept===o?' selected':''}>${o || '请选择'}</option>`).join('')}</select></dd></div>
                <div class="detail-item"><dt><span class="req">*</span> 申请人</dt><dd><input type="text" id="issueFApplicant" value="${esc(d.applicant || window.currentUserId || '')}" style="${inputStyle}"></dd></div>
                ${this._renderTypeFields(type, d)}
              </div>
            </div>

            <div class="form-section" style="margin-top:14px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <div class="form-section-title" style="margin-bottom:0;">行项目</div>
                <button class="btn btn-sm btn-outline" onclick="SpIssue.addLineRow()" style="padding:4px 12px;font-size:12px;">+ 添加行</button>
              </div>
              <div style="overflow-x:auto;">
                <table class="data-table data-table-compact" style="min-width:1100px;">
                  <thead><tr>
                    <th style="width:60px;text-align:center;">行项目</th>
                    <th style="min-width:130px;"><span class="req">*</span> 物料编码</th>
                    <th style="min-width:200px;"><span class="req">*</span> 物料描述</th>
                    <th style="min-width:100px;text-align:right;"><span class="req">*</span> 数量</th>
                    <th style="width:80px;">单位</th>
                    <th style="min-width:100px;">批次</th>
                    <th style="width:60px;text-align:center;"></th>
                  </tr></thead>
                  <tbody id="issueLinesBody">
                    ${lines.map((l, i) => SpIssue.renderLineRow(l, i)).join('')}
                  </tbody>
                </table>
              </div>
              <div style="margin-top:8px;font-size:12px;color:var(--text-secondary);">提示：点击 "+" 可添加多行物料；物料编码/描述/数量为必填。</div>
            </div>

            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">备注</div>
              <div class="detail-grid" style="grid-template-columns:repeat(2,minmax(0,1fr));">
                <div class="detail-item"><dt>备注</dt><dd><textarea id="issueFNotes" rows="2" placeholder="选填">${esc(d.notes || '')}</textarea></dd></div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="SpIssue.closeModal()">取消</button>
            <button class="btn btn-primary" onclick="SpIssue.submitForm()">提交</button>
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
      <td style="text-align:center;"><button class="btn btn-danger btn-sm" onclick="SpIssue.removeLineRow(this)" style="padding:2px 8px;font-size:12px;">删除</button></td>
    </tr>`;
  },

  addLineRow() {
    const body = document.getElementById('issueLinesBody');
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
      <td style="text-align:center;"><button class="btn btn-danger btn-sm" onclick="SpIssue.removeLineRow(this)" style="padding:2px 8px;font-size:12px;">删除</button></td>`;
    body.appendChild(tr);
  },

  removeLineRow(btn) {
    const tr = btn.closest('tr');
    const body = tr.parentNode;
    if (body.querySelectorAll('tr').length <= 1) return;
    tr.remove();
  },

  /* ---------------- 打开表单 ---------------- */
  openForm(type) {
    this.editMode = false;
    this.editId = null;
    this.formType = type;
    const cont = document.getElementById('issueModalContainer');
    cont.innerHTML = this.getFormModalHTML(type, {});
    document.getElementById('issueModalBackdrop').classList.remove('hidden');
  },

  openEditModal(docNo) {
    const d = spIssueData.find(x => x.docNo === docNo);
    if (!d) return;
    this.editMode = true;
    this.editId = docNo;
    this.formType = d.issueType;
    const cont = document.getElementById('issueModalContainer');
    cont.innerHTML = this.getFormModalHTML(d.issueType, d);
    document.getElementById('issueModalBackdrop').classList.remove('hidden');
  },

  closeModal() { closeModal(); },

  /* ---------------- 提交（SAP 预留同步） ---------------- */
  _collectForm() {
    const lines = [];
    document.querySelectorAll('#issueLinesBody tr').forEach(tr => {
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
      plant: document.getElementById('issueFPlant').value,
      issueDate: document.getElementById('issueFDate').value,
      issueDept: document.getElementById('issueFDept').value,
      applicant: document.getElementById('issueFApplicant').value.trim(),
      issueLocation: document.getElementById('issueFLoc').value,
      targetLocation: (document.getElementById('issueFTargetLoc') || {}).value || '',
      internalOrderNo: (document.getElementById('issueFInternalOrder') || {}).value || '',
      costCenter: (document.getElementById('issueFCostCenter') || {}).value || '',
      processOrderNo: (document.getElementById('issueFProcessOrder') || {}).value || '',
      notes: document.getElementById('issueFNotes').value.trim(),
      lines
    };
  },

  _validate(data) {
    if (!data.issueDate) return '请选择领料日期';
    if (!data.issueDept) return '请选择请领部门';
    if (!data.applicant) return '请填写申请人';
    if (!data.issueLocation) return '请选择发出库位';
    if (this.formType === 'consume-internal-order' && !data.internalOrderNo) return '请填写内部订单号';
    if (this.formType === 'consume-cost-center' && !data.costCenter) return '请填写成本中心';
    if (this.formType === 'staging-move' && !data.targetLocation) return '请选择目标库位';
    if (this.formType === 'staging-process-order' && !data.processOrderNo) return '请填写流程订单号';
    if (this.formType === 'staging-process-order' && !data.targetLocation) return '请选择目标库位';
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
      SAP_MOCK.showLoading(this.editMode ? '正在调用 SAP 修改预留单…' : '正在调用 SAP 创建预留单…');
      const call = this.editMode
        ? SAP_MOCK.updateReservation(payload.reservationNo, payload)
        : SAP_MOCK.createReservation(payload);
      call.then(res => {
        SAP_MOCK.hideLoading();
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        if (this.editMode) {
          const d = spIssueData.find(x => x.docNo === this.editId);
          if (d) Object.assign(d, this._toDoc(data, payload, d.docNo, d.reservationNo, d.status));
        } else {
          const seq = spIssueData.length + 1;
          const docNo = 'PL-' + dateStr + '-' + String(seq).padStart(3, '0');
          spIssueData.unshift(this._toDoc(data, payload, docNo, res.reservationNo, '已同步'));
        }
        toast(this.editMode ? '修改已同步至 SAP 预留 ' + (payload.reservationNo || '') : '创建成功，SAP 返回预留号：' + res.reservationNo);
        this.closeModal();
        this.flatRows = this.flattenData();
        this.filteredFlat = [...this.flatRows];
        this.page = 1;
        this.renderRows();
        const c = document.getElementById('issueCount'); if (c) c.textContent = `共 ${this.filteredFlat.length} 行`;
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
    const d = spIssueData.find(x => x.docNo === this.editId);
    return d ? d.reservationNo : '';
  },

  _toDoc(data, payload, docNo, reservationNo, status) {
    return {
      docNo,
      issueType: this.formType,
      moveType: payload.moveType,
      reservationNo,
      plant: data.plant,
      issueLocation: data.issueLocation,
      targetLocation: data.targetLocation,
      internalOrderNo: data.internalOrderNo,
      costCenter: data.costCenter,
      processOrderNo: data.processOrderNo,
      issueDept: data.issueDept,
      applicant: data.applicant,
      issueDate: data.issueDate,
      status,
      notes: data.notes,
      lines: data.lines
    };
  },

  /* ---------------- 查看弹窗（内含编辑入口） ---------------- */
  openViewModal(docNo) {
    const d = spIssueData.find(x => x.docNo === docNo);
    if (!d) return;
    const info = this.getTypeInfo(d.issueType);
    const acc = d.internalOrderNo ? `内部订单: ${esc(d.internalOrderNo)}` : (d.costCenter ? `成本中心: ${esc(d.costCenter)}` : (d.processOrderNo ? `流程订单: ${esc(d.processOrderNo)}` : '-'));
    const cont = document.getElementById('issueModalContainer');
    cont.innerHTML = `
      <div class="modal-backdrop" id="issueModalBackdrop" onclick="SpIssue.closeModal()">
        <div class="modal" style="width:96vw;max-width:96vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">领料单 ${esc(d.docNo)} <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">${esc(info.label)} · 移动类型 ${info.moveType}</span></div>
            <button class="modal-close" onclick="SpIssue.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            <div class="form-section">
              <div class="form-section-title">抬头信息</div>
              <div class="detail-grid" style="grid-template-columns:repeat(6,minmax(0,1fr));">
                <div class="detail-item"><dt>领料单号</dt><dd><strong>${esc(d.docNo)}</strong></dd></div>
                <div class="detail-item"><dt>状态</dt><dd>${this.getStatusBadge(d.status)}</dd></div>
                <div class="detail-item"><dt>SAP 预留号</dt><dd>${esc(d.reservationNo || '-')}</dd></div>
                <div class="detail-item"><dt>移动类型</dt><dd>${esc(d.moveType)}</dd></div>
                <div class="detail-item"><dt>工厂</dt><dd>${esc(d.plant)}</dd></div>
                <div class="detail-item"><dt>领料日期</dt><dd>${esc(d.issueDate)}</dd></div>
                <div class="detail-item"><dt>请领部门</dt><dd>${esc(d.issueDept)}</dd></div>
                <div class="detail-item"><dt>申请人</dt><dd>${esc(d.applicant)}</dd></div>
                <div class="detail-item"><dt>发出库位</dt><dd>${esc(d.issueLocation)}</dd></div>
                <div class="detail-item"><dt>目标库位</dt><dd>${esc(d.targetLocation || '-')}</dd></div>
                <div class="detail-item"><dt>成本对象</dt><dd>${acc}</dd></div>
              </div>
            </div>
            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">行项目</div>
              <table class="data-table data-table-compact" style="min-width:900px;">
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
            <button class="btn btn-secondary" onclick="SpIssue.closeModal()">关闭</button>
            ${d.status === '已完成' ? '' : `<button class="btn btn-primary" onclick="SpIssue.openEditModal('${d.docNo}')">编辑</button>`}
          </div>
        </div>
      </div>`;
  }
};

/* ---------------- 模拟数据 ---------------- */
const spIssueData = [
  {
    docNo: 'PL-20260701-001', issueType: 'consume-internal-order', moveType: '261', reservationNo: '0000000111',
    plant: '1000', issueLocation: 'A01原料仓', targetLocation: '',
    internalOrderNo: 'IO-2026-0101', costCenter: '', processOrderNo: '',
    issueDept: '生产一部', applicant: '张伟', issueDate: '2026-07-01', status: '部分过账',
    notes: '本月第一批原料领用，已消耗至内部订单。',
    lines: [
      { itemNo: 10, matCode: 'M10001', matName: '黄芩提取物', qty: 1200, unit: 'KG', batch: 'B260601' },
      { itemNo: 20, matCode: 'M10012', matName: '药用淀粉', qty: 800, unit: 'KG', batch: 'B260602' }
    ]
  },
  {
    docNo: 'PL-20260705-002', issueType: 'consume-cost-center', moveType: '201', reservationNo: '0000000213',
    plant: '1000', issueLocation: 'A02辅料仓', targetLocation: '',
    internalOrderNo: '', costCenter: 'CC-1001', processOrderNo: '',
    issueDept: '设备部', applicant: '李强', issueDate: '2026-07-05', status: '已同步',
    notes: '设备润滑油脂领用，消耗至成本中心。',
    lines: [
      { itemNo: 10, matCode: 'M20008', matName: '工业润滑油', qty: 60, unit: 'L', batch: '' }
    ]
  },
  {
    docNo: 'PL-20260712-003', issueType: 'staging-move', moveType: '311', reservationNo: '0000000316',
    plant: '1000', issueLocation: 'A03包装材料仓', targetLocation: 'C01暂存间',
    internalOrderNo: '', costCenter: '', processOrderNo: '',
    issueDept: '生产二部', applicant: '王芳', issueDate: '2026-07-12', status: '已完成',
    notes: '包材提前备料至暂存间，待生产使用。',
    lines: [
      { itemNo: 10, matCode: 'M30001', matName: '铝箔复合膜', qty: 3000, unit: 'M', batch: '' },
      { itemNo: 20, matCode: 'M30005', matName: '药用纸盒', qty: 5000, unit: 'PCS', batch: '' }
    ]
  },
  {
    docNo: 'PL-20260720-004', issueType: 'staging-process-order', moveType: '311', reservationNo: '0000000428',
    plant: '1000', issueLocation: 'A01原料仓', targetLocation: 'B01线边仓',
    internalOrderNo: '', costCenter: '', processOrderNo: '6000001234',
    issueDept: '生产三部', applicant: '赵磊', issueDate: '2026-07-20', status: '已同步',
    notes: '按流程订单 6000001234 领料至线边仓。',
    lines: [
      { itemNo: 10, matCode: 'M10001', matName: '黄芩提取物', qty: 600, unit: 'KG', batch: 'B260607' },
      { itemNo: 20, matCode: 'M10018', matName: '硬脂酸镁', qty: 150, unit: 'KG', batch: 'B260608' }
    ]
  }
];
