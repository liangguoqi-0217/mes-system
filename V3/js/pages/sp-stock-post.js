/* ============================================================
 * sp-stock-post.js — 库存记账（库存管理）
 * ------------------------------------------------------------
 * 合并原 6 个独立入口：库内管理 / 库存报废 / 库存差异调整 /
 * 客供料管理 / 内部订单投料 / 成本中心投料。
 * 业务特征：车间基于本车间库存地点直接对库存记账（MIGO 直接
 * 过账，不建预留单），SAP 返回物料凭证号后 MES 才写本地。
 * ============================================================ */
const STOCK_POST_TYPE_MAP = {
  'stock-transfer':       { label: '库位转移', desc: '同一库存地点内 A 库位 → B 库位转移', moveType: '311', icon: '⇄' },
  'stock-scrap':          { label: '库存报废', desc: '物料报废记账', moveType: '551', icon: '✕' },
  'stock-adjustment':     { label: '库存差异调整', desc: '盘点差异、手工调整（盘盈/盘亏）', moveType: '561/562', icon: '±' },
  'consignment':          { label: '客供料收发', desc: '客供料收料 / 消耗记账', moveType: 'K', icon: '◫' },
  'internal-order-issue': { label: '内部订单投料', desc: '直接消耗到内部订单', moveType: '261', icon: '▣' },
  'cost-center-issue':    { label: '成本中心投料', desc: '直接消耗到成本中心', moveType: '201', icon: '◆' }
};

const STOCK_POST_DEPT_OPTIONS = ['生产一部', '生产二部', '生产三部', '质量部', '设备部'];
const STOCK_POST_LOCATION_OPTIONS = ['A01原料仓', 'A02辅料仓', 'A03包装材料仓', 'B01线边仓', 'B02线边仓', 'C01暂存间', 'C02成品暂存间'];

const SpStockPost = {
  page: 1, pageSize: 20, flatRows: [], filteredFlat: [],
  editMode: false, editId: null, formType: '',

  getTypeInfo(type) { return STOCK_POST_TYPE_MAP[type] || { label: type, desc: '', moveType: '', icon: '' }; },

  getStatusBadge(s) {
    const c = { '草稿': 'badge-gray', '待同步': 'badge-yellow', '已过账': 'badge-green', '已冲销': 'badge-red' };
    return `<span class="badge ${c[s] || 'badge-gray'}">${esc(s)}</span>`;
  },
  getTypeBadge(t) {
    return `<span class="badge" style="background:rgba(30,58,95,0.08);color:var(--primary);">${esc(this.getTypeInfo(t).label)}</span>`;
  },

  flattenData() {
    const rows = [];
    spStockPostData.forEach(d => {
      if (!d.lines || !d.lines.length) return;
      d.lines.forEach(line => {
        rows.push({
          _doc: d, _line: line,
          docNo: d.docNo, itemNo: line.itemNo,
          postType: d.postType, postTypeLabel: this.getTypeInfo(d.postType).label,
          moveType: d.moveType,
          location: d.location, targetLocation: d.targetLocation || '',
          internalOrderNo: d.internalOrderNo || '', costCenter: d.costCenter || '',
          adjustDir: d.adjustDir || '', scrapReason: d.scrapReason || '', consignDir: d.consignDir || '',
          postDept: d.postDept, applicant: d.applicant, postDate: d.postDate,
          matCode: line.matCode || '', matName: line.matName || '',
          qty: line.qty, unit: line.unit || '', batch: line.batch || '',
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
          <div><div style="font-size:18px;font-weight:700;">库存记账</div><div style="font-size:13px;opacity:0.8;">基于本车间库存直接记账（MIGO 过账），支持 6 种记账类型，不建预留</div></div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="btn btn-blue" onclick="SpStockPost.openNewModal()"><span style="font-weight:700;font-size:16px;">+</span> 新建记账</button>
          </div>
        </div>
        <div class="filter-bar filter-bar-nowrap" style="flex-shrink:0;">
          <div class="filter-group"><label>记账单号</label><input type="text" id="spDocNo" placeholder="单号"></div>
          <div class="filter-group"><label>记账类型</label><select id="spType">
            <option value="">全部</option>
            ${Object.keys(STOCK_POST_TYPE_MAP).map(k => `<option value="${k}">${esc(STOCK_POST_TYPE_MAP[k].label)}</option>`).join('')}
          </select></div>
          <div class="filter-group"><label>库存地点</label><input type="text" id="spLoc" placeholder="库位"></div>
          <div class="filter-group"><label>记账部门</label><input type="text" id="spDept" placeholder="部门"></div>
          <div class="filter-group"><label>状态</label><select id="spStatus">
            <option value="">全部</option>
            <option value="草稿">草稿</option><option value="待同步">待同步</option>
            <option value="已过账">已过账</option><option value="已冲销">已冲销</option>
          </select></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="SpStockPost.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="SpStockPost.reset()">重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table data-table-compact" style="min-width:1300px;">
            <thead><tr>
              <th>记账单号</th><th>记账类型</th><th style="width:55px;text-align:center;">行项目</th>
              <th>物料</th><th>物料描述</th><th style="text-align:right;">数量</th><th style="width:38px;">单位</th>
              <th>库存地点</th><th>目标库位</th><th>内部订单/成本中心/差异方向</th>
              <th>记账部门</th><th>记账人</th><th>记账日期</th>
              <th style="width:80px;text-align:center;">状态</th><th style="width:76px;">操作</th>
            </tr></thead>
            <tbody id="spTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info">
            <span class="list-count" id="spCount">共 ${this.flatRows.length} 行</span>
            <span style="color:var(--text-muted);font-size:12px;">(共 ${spStockPostData.length} 张记账单)</span>
          </div>
          <div class="pagination">
            <button class="pagination-btn" id="spPrev" disabled onclick="SpStockPost.prevPage()">‹</button>
            <span class="pagination-info" id="spPageInfo">第 ${this.page} / ${Math.ceil(Math.max(this.flatRows.length,1)/this.pageSize)} 页</span>
            <button class="pagination-btn" id="spNext" onclick="SpStockPost.nextPage()">›</button>
            <select class="page-size-select" id="spPageSizeSel" onchange="SpStockPost.changePageSize()"><option value="20">20条</option><option value="40">40条</option><option value="80">80条</option></select>
          </div>
        </div>
      </div>
      <div id="spModalContainer"></div>`;
  },

  init() {
    this.renderRows();
    const el = document.getElementById('spDocNo');
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') this.search(); });
  },

  renderRows() {
    const body = document.getElementById('spTableBody');
    if (!body) return;
    const start = (this.page - 1) * this.pageSize;
    const rows = this.filteredFlat.slice(start, start + this.pageSize);
    if (!rows.length) {
      body.innerHTML = `<tr><td colspan="15" class="empty-cell">暂无符合条件的记账记录</td></tr>`;
    } else {
      body.innerHTML = rows.map(r => `
        <tr>
          <td><strong>${esc(r.docNo)}</strong><div style="font-size:11px;color:var(--text-muted);">物料凭证: ${esc(r.materialDocNo || '-')}</div></td>
          <td>${this.getTypeBadge(r.postType)}</td>
          <td style="text-align:center;">${r.itemNo}</td>
          <td>${esc(r.matCode || '-')}</td>
          <td>${esc(r.matName || '-')}</td>
          <td style="text-align:right;">${r.qty}</td>
          <td>${esc(r.unit)}</td>
          <td>${esc(r.location)}</td>
          <td>${esc(r.targetLocation || '-')}</td>
          <td>${esc(r.internalOrderNo || r.costCenter || (r.adjustDir ? (r.adjustDir === 'gain' ? '盘盈' : '盘亏') : '') || '-')}</td>
          <td>${esc(r.postDept)}</td>
          <td>${esc(r.applicant)}</td>
          <td>${esc(r.postDate)}</td>
          <td style="text-align:center;">${this.getStatusBadge(r.status)}</td>
          <td><button class="btn btn-blue btn-sm" onclick="SpStockPost.openViewModal('${r.docNo}')">查看</button></td>
        </tr>`).join('');
    }
    const prev = document.getElementById('spPrev'), next = document.getElementById('spNext');
    const totalPages = Math.ceil(Math.max(this.filteredFlat.length, 1) / this.pageSize);
    if (prev) prev.disabled = this.page <= 1;
    if (next) next.disabled = this.page >= totalPages;
    const info = document.getElementById('spPageInfo');
    if (info) info.textContent = `第 ${this.page} / ${totalPages} 页`;
  },

  search() {
    const qDoc = (document.getElementById('spDocNo').value || '').trim().toLowerCase();
    const qType = document.getElementById('spType').value;
    const qLoc = (document.getElementById('spLoc').value || '').trim().toLowerCase();
    const qDept = (document.getElementById('spDept').value || '').trim().toLowerCase();
    const qStatus = document.getElementById('spStatus').value;
    this.filteredFlat = this.flatRows.filter(r =>
      (!qDoc || r.docNo.toLowerCase().includes(qDoc)) &&
      (!qType || r.postType === qType) &&
      (!qLoc || r.location.toLowerCase().includes(qLoc) || (r.targetLocation || '').toLowerCase().includes(qLoc)) &&
      (!qDept || r.postDept.toLowerCase().includes(qDept)) &&
      (!qStatus || r.status === qStatus)
    );
    this.page = 1;
    this.renderRows();
    const c = document.getElementById('spCount'); if (c) c.textContent = `共 ${this.filteredFlat.length} 行`;
  },
  reset() {
    ['spDocNo', 'spLoc', 'spDept'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    ['spType', 'spStatus'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    this.filteredFlat = [...this.flatRows];
    this.page = 1;
    this.renderRows();
    const c = document.getElementById('spCount'); if (c) c.textContent = `共 ${this.filteredFlat.length} 行`;
  },
  prevPage() { if (this.page > 1) { this.page--; this.renderRows(); } },
  nextPage() { if (this.page < Math.ceil(this.filteredFlat.length / this.pageSize)) { this.page++; this.renderRows(); } },
  changePageSize() { this.pageSize = +document.getElementById('spPageSizeSel').value; this.page = 1; this.renderRows(); },

  /* ---------------- 创建方式选择弹窗 ---------------- */
  openNewModal() {
    const cards = Object.entries(STOCK_POST_TYPE_MAP).map(([k, v]) => `
      <div class="new-type-card" onclick="SpStockPost.openForm('${k}')">
        <div class="new-type-icon">${v.icon}</div>
        <div class="new-type-name">${esc(v.label)}</div>
        <div class="new-type-desc">${esc(v.desc)}</div>
        <div class="new-type-move">移动类型 ${v.moveType}</div>
      </div>`).join('');
    showModal('新建库存记账 — 请选择记账类型', `
      <div style="padding:4px 2px 12px;">
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:14px;">库存记账为直接过账（不建预留单），保存后自动调用 SAP 过账接口，返回物料凭证号后生效。</div>
        <div class="new-type-grid" style="grid-template-columns:repeat(3,minmax(0,1fr));">${cards}</div>
      </div>`, [{ text: '取消', cls: 'btn-secondary', action: closeModal }], 'modal-xl');
  },

  _renderTypeFields(type, d) {
    d = d || {};
    const base = `
      <div class="detail-item"><dt><span class="req">*</span> 库存地点</dt><dd><select id="spFLoc">${STOCK_POST_LOCATION_OPTIONS.map(o => `<option value="${o}"${d.location===o?' selected':''}>${o}</option>`).join('')}</select></dd></div>`;
    const byType = {
      'stock-transfer': `
        <div class="detail-item"><dt><span class="req">*</span> 目标库位</dt><dd><select id="spFTargetLoc">${STOCK_POST_LOCATION_OPTIONS.map(o => `<option value="${o}"${d.targetLocation===o?' selected':''}>${o}</option>`).join('')}</select></dd></div>`,
      'stock-scrap': `
        <div class="detail-item"><dt><span class="req">*</span> 报废原因</dt><dd><select id="spFScrapReason">
          <option value="">请选择</option>
          ${['质量不合格', '过期失效', '包装破损', '生产损耗'].map(o => `<option value="${o}"${d.scrapReason===o?' selected':''}>${o}</option>`).join('')}
        </select></dd></div>`,
      'stock-adjustment': `
        <div class="detail-item"><dt><span class="req">*</span> 差异方向</dt><dd><select id="spFAdjustDir">
          <option value="gain"${d.adjustDir==='gain'?' selected':''}>盘盈（增加库存）</option>
          <option value="loss"${d.adjustDir==='loss'?' selected':''}>盘亏（减少库存）</option>
        </select></dd></div>
        <div class="detail-item"><dt>差异原因</dt><dd><input type="text" id="spFAdjustReason" placeholder="选填" value="${esc(d.adjustReason || '')}"></dd></div>`,
      'consignment': `
        <div class="detail-item"><dt><span class="req">*</span> 收发方向</dt><dd><select id="spFConsignDir">
          <option value="receive"${d.consignDir==='receive'?' selected':''}>客供料收货</option>
          <option value="issue"${d.consignDir==='issue'?' selected':''}>客供料消耗</option>
        </select></dd></div>`,
      'internal-order-issue': `
        <div class="detail-item"><dt><span class="req">*</span> 内部订单号</dt><dd><input type="text" id="spFInternalOrder" placeholder="如 IO-2026-0101" value="${esc(d.internalOrderNo || '')}"></dd></div>`,
      'cost-center-issue': `
        <div class="detail-item"><dt><span class="req">*</span> 成本中心</dt><dd><input type="text" id="spFCostCenter" placeholder="如 CC-1001" value="${esc(d.costCenter || '')}"></dd></div>`
    };
    return base + (byType[type] || '');
  },

  getFormModalHTML(type, d) {
    d = d || {};
    const info = this.getTypeInfo(type);
    const isEdit = this.editMode;
    const lines = (d.lines && d.lines.length ? d.lines : [{ itemNo: 10, matCode: '', matName: '', qty: '', unit: 'KG', batch: '' }]);
    const today = new Date().toISOString().slice(0, 10);
    return `
      <div class="modal-backdrop" id="spModalBackdrop" onclick="SpStockPost.closeModal()">
        <div class="modal" style="width:96vw;max-width:96vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">${isEdit ? '修改' : '新建'}库存记账 <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">${esc(info.label)} · 移动类型 ${info.moveType}${d.materialDocNo ? ' · 物料凭证 ' + d.materialDocNo : ''}</span></div>
            <button class="modal-close" onclick="SpStockPost.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            <div class="form-section">
              <div class="form-section-title">抬头信息</div>
              <div class="detail-grid" style="grid-template-columns:repeat(6,minmax(0,1fr));">
                <div class="detail-item"><dt>记账单号</dt><dd><strong>${esc(d.docNo || '(自动生成)')}</strong><input type="hidden" id="spFDocNo" value="${esc(d.docNo || '')}"></dd></div>
                <div class="detail-item"><dt>记账类型</dt><dd>${esc(info.label)}<input type="hidden" id="spFType" value="${type}"></dd></div>
                <div class="detail-item"><dt>移动类型</dt><dd>${info.moveType}</dd></div>
                <div class="detail-item"><dt>工厂</dt><dd><select id="spFPlant"><option value="1000">1000 - 山东步长制药工厂</option></select></dd></div>
                <div class="detail-item"><dt><span class="req">*</span> 记账日期</dt><dd><input type="date" id="spFDate" value="${esc(d.postDate || today)}"></dd></div>
                <div class="detail-item"><dt><span class="req">*</span> 记账部门</dt><dd><select id="spFDept">${[''].concat(STOCK_POST_DEPT_OPTIONS).map(o => `<option value="${o}"${d.postDept===o?' selected':''}>${o || '请选择'}</option>`).join('')}</select></dd></div>
                <div class="detail-item"><dt><span class="req">*</span> 记账人</dt><dd><input type="text" id="spFApplicant" value="${esc(d.applicant || window.currentUserId || '')}"></dd></div>
              </div>
            </div>

            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">记账信息（按类型）</div>
              <div class="detail-grid" style="grid-template-columns:repeat(4,minmax(0,1fr));">
                ${this._renderTypeFields(type, d)}
              </div>
            </div>

            <div class="form-section" style="margin-top:14px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <div class="form-section-title" style="margin-bottom:0;">行项目</div>
                <button class="btn btn-sm btn-outline" onclick="SpStockPost.addLineRow()" style="padding:4px 12px;font-size:12px;">+ 添加行</button>
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
                  <tbody id="spLinesBody">
                    ${lines.map(l => SpStockPost.renderLineRow(l)).join('')}
                  </tbody>
                </table>
              </div>
              <div style="margin-top:8px;font-size:12px;color:var(--text-secondary);">提示：点击 "+" 可添加多行物料；物料编码/描述/数量为必填。</div>
            </div>

            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">备注</div>
              <div class="detail-grid" style="grid-template-columns:repeat(2,minmax(0,1fr));">
                <div class="detail-item"><dt>备注</dt><dd><textarea id="spFNotes" rows="2" placeholder="选填">${esc(d.notes || '')}</textarea></dd></div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="SpStockPost.closeModal()">取消</button>
            <button class="btn btn-primary" onclick="SpStockPost.submitForm()">${isEdit ? '保存修改（同步 SAP）' : '提交并同步 SAP'}</button>
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
      <td style="text-align:center;"><button class="btn btn-danger btn-sm" onclick="SpStockPost.removeLineRow(this)" style="padding:2px 8px;font-size:12px;">删除</button></td>
    </tr>`;
  },

  addLineRow() {
    const body = document.getElementById('spLinesBody');
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
      <td style="text-align:center;"><button class="btn btn-danger btn-sm" onclick="SpStockPost.removeLineRow(this)" style="padding:2px 8px;font-size:12px;">删除</button></td>`;
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
    const cont = document.getElementById('spModalContainer');
    cont.innerHTML = this.getFormModalHTML(type, {});
    document.getElementById('spModalBackdrop').classList.remove('hidden');
  },

  openEditModal(docNo) {
    const d = spStockPostData.find(x => x.docNo === docNo);
    if (!d) return;
    this.editMode = true;
    this.editId = docNo;
    this.formType = d.postType;
    const cont = document.getElementById('spModalContainer');
    cont.innerHTML = this.getFormModalHTML(d.postType, d);
    document.getElementById('spModalBackdrop').classList.remove('hidden');
  },

  closeModal() { closeModal(); },

  _collectForm() {
    const lines = [];
    document.querySelectorAll('#spLinesBody tr').forEach(tr => {
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
      plant: document.getElementById('spFPlant').value,
      postDate: document.getElementById('spFDate').value,
      postDept: document.getElementById('spFDept').value,
      applicant: document.getElementById('spFApplicant').value.trim(),
      location: document.getElementById('spFLoc').value,
      targetLocation: (document.getElementById('spFTargetLoc') || {}).value || '',
      internalOrderNo: (document.getElementById('spFInternalOrder') || {}).value || '',
      costCenter: (document.getElementById('spFCostCenter') || {}).value || '',
      adjustDir: (document.getElementById('spFAdjustDir') || {}).value || '',
      adjustReason: (document.getElementById('spFAdjustReason') || {}).value || '',
      scrapReason: (document.getElementById('spFScrapReason') || {}).value || '',
      consignDir: (document.getElementById('spFConsignDir') || {}).value || '',
      notes: document.getElementById('spFNotes').value.trim(),
      lines
    };
  },

  _validate(data) {
    if (!data.postDate) return '请选择记账日期';
    if (!data.postDept) return '请选择记账部门';
    if (!data.applicant) return '请填写记账人';
    if (!data.location) return '请选择库存地点';
    if (this.formType === 'stock-transfer' && !data.targetLocation) return '请选择目标库位';
    if (this.formType === 'stock-scrap' && !data.scrapReason) return '请选择报废原因';
    if (this.formType === 'internal-order-issue' && !data.internalOrderNo) return '请填写内部订单号';
    if (this.formType === 'cost-center-issue' && !data.costCenter) return '请填写成本中心';
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
      moveType: info.moveType === '561/562' ? (data.adjustDir === 'gain' ? '561' : '562') : info.moveType
    });

    const doSync = () => {
      SAP_MOCK.showLoading(this.editMode ? '正在调用 SAP 修改过账…' : '正在调用 SAP 过账接口…');
      SAP_MOCK.postGoodsMovement(payload).then(res => {
        SAP_MOCK.hideLoading();
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        if (this.editMode) {
          const d = spStockPostData.find(x => x.docNo === this.editId);
          if (d) Object.assign(d, this._toDoc(data, payload, d.docNo, d.materialDocNo, d.status));
        } else {
          const seq = spStockPostData.length + 1;
          const docNo = 'SP-' + dateStr + '-' + String(seq).padStart(3, '0');
          spStockPostData.unshift(this._toDoc(data, payload, docNo, res.materialDocNo, '已过账'));
        }
        toast('记账过账成功，SAP 物料凭证号：' + res.materialDocNo);
        this.closeModal();
        this.flatRows = this.flattenData();
        this.filteredFlat = [...this.flatRows];
        this.page = 1;
        this.renderRows();
        const c = document.getElementById('spCount'); if (c) c.textContent = `共 ${this.filteredFlat.length} 行`;
      }).catch(e => {
        SAP_MOCK.hideLoading();
        if (confirm((e && e.message ? e.message : 'SAP 过账失败') + '\n\n点击「确定」重试，点击「取消」放弃。')) {
          doSync();
        }
      });
    };
    doSync();
  },

  _toDoc(data, payload, docNo, materialDocNo, status) {
    return {
      docNo,
      postType: this.formType,
      moveType: payload.moveType,
      plant: data.plant,
      location: data.location,
      targetLocation: data.targetLocation,
      internalOrderNo: data.internalOrderNo,
      costCenter: data.costCenter,
      adjustDir: data.adjustDir,
      adjustReason: data.adjustReason,
      scrapReason: data.scrapReason,
      consignDir: data.consignDir,
      postDept: data.postDept,
      applicant: data.applicant,
      postDate: data.postDate,
      status,
      materialDocNo,
      notes: data.notes,
      lines: data.lines
    };
  },

  openViewModal(docNo) {
    const d = spStockPostData.find(x => x.docNo === docNo);
    if (!d) return;
    const info = this.getTypeInfo(d.postType);
    const extra = d.internalOrderNo
      ? `内部订单: ${esc(d.internalOrderNo)}`
      : (d.costCenter
          ? `成本中心: ${esc(d.costCenter)}`
          : (d.adjustDir
              ? ((d.adjustDir === 'gain' ? '盘盈' : '盘亏') + (d.adjustReason ? '（' + esc(d.adjustReason) + '）' : ''))
              : (d.scrapReason
                  ? '报废原因: ' + esc(d.scrapReason)
                  : (d.consignDir
                      ? (d.consignDir === 'receive' ? '客供料收货' : '客供料消耗')
                      : '-'))));
    const cont = document.getElementById('spModalContainer');
    cont.innerHTML = `
      <div class="modal-backdrop" id="spModalBackdrop" onclick="SpStockPost.closeModal()">
        <div class="modal" style="width:96vw;max-width:96vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">库存记账 ${esc(d.docNo)} <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">${esc(info.label)} · 移动类型 ${esc(d.moveType)}</span></div>
            <button class="modal-close" onclick="SpStockPost.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            <div class="form-section">
              <div class="form-section-title">抬头信息</div>
              <div class="detail-grid" style="grid-template-columns:repeat(6,minmax(0,1fr));">
                <div class="detail-item"><dt>记账单号</dt><dd><strong>${esc(d.docNo)}</strong></dd></div>
                <div class="detail-item"><dt>状态</dt><dd>${this.getStatusBadge(d.status)}</dd></div>
                <div class="detail-item"><dt>SAP 物料凭证</dt><dd>${esc(d.materialDocNo || '-')}</dd></div>
                <div class="detail-item"><dt>移动类型</dt><dd>${esc(d.moveType)}</dd></div>
                <div class="detail-item"><dt>工厂</dt><dd>${esc(d.plant)}</dd></div>
                <div class="detail-item"><dt>记账日期</dt><dd>${esc(d.postDate)}</dd></div>
                <div class="detail-item"><dt>记账部门</dt><dd>${esc(d.postDept)}</dd></div>
                <div class="detail-item"><dt>记账人</dt><dd>${esc(d.applicant)}</dd></div>
                <div class="detail-item"><dt>库存地点</dt><dd>${esc(d.location)}</dd></div>
                <div class="detail-item"><dt>目标库位</dt><dd>${esc(d.targetLocation || '-')}</dd></div>
                <div class="detail-item"><dt>记账属性</dt><dd>${extra}</dd></div>
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
            <button class="btn btn-secondary" onclick="SpStockPost.closeModal()">关闭</button>
            ${d.status === '已冲销' ? '' : `<button class="btn btn-primary" onclick="SpStockPost.openEditModal('${d.docNo}')">编辑</button>`}
          </div>
        </div>
      </div>`;
  }
};

/* ---------------- 模拟数据 ---------------- */
const spStockPostData = [
  {
    docNo: 'SP-20260702-001', postType: 'stock-transfer', moveType: '311',
    plant: '1000', location: 'A01原料仓', targetLocation: 'B01线边仓',
    internalOrderNo: '', costCenter: '', adjustDir: '', scrapReason: '', consignDir: '',
    postDept: '生产一部', applicant: '张伟', postDate: '2026-07-02',
    status: '已过账', materialDocNo: '4900000201',
    notes: '产前备料库位转移。',
    lines: [
      { itemNo: 10, matCode: 'M10001', matName: '黄芩提取物', qty: 300, unit: 'KG', batch: 'B260601' }
    ]
  },
  {
    docNo: 'SP-20260708-002', postType: 'stock-scrap', moveType: '551',
    plant: '1000', location: 'A02辅料仓', targetLocation: '',
    internalOrderNo: '', costCenter: '', adjustDir: '', scrapReason: '过期失效', consignDir: '',
    postDept: '生产二部', applicant: '王芳', postDate: '2026-07-08',
    status: '已过账', materialDocNo: '4900000303',
    notes: '过期辅料报废。',
    lines: [
      { itemNo: 10, matCode: 'M20015', matName: '乳糖（药用）', qty: 45, unit: 'KG', batch: 'B250812' }
    ]
  },
  {
    docNo: 'SP-20260715-003', postType: 'stock-adjustment', moveType: '561',
    plant: '1000', location: 'A03包装材料仓', targetLocation: '',
    internalOrderNo: '', costCenter: '', adjustDir: 'gain', adjustReason: '月度盘点差异', scrapReason: '', consignDir: '',
    postDept: '质量部', applicant: '刘敏', postDate: '2026-07-15',
    status: '已过账', materialDocNo: '4900000404',
    notes: '盘点盘盈调整。',
    lines: [
      { itemNo: 10, matCode: 'M30005', matName: '药用纸盒', qty: 120, unit: 'PCS', batch: '' }
    ]
  },
  {
    docNo: 'SP-20260720-004', postType: 'internal-order-issue', moveType: '261',
    plant: '1000', location: 'B01线边仓', targetLocation: '',
    internalOrderNo: 'IO-2026-0202', costCenter: '', adjustDir: '', scrapReason: '', consignDir: '',
    postDept: '生产三部', applicant: '赵磊', postDate: '2026-07-20',
    status: '已过账', materialDocNo: '4900000505',
    notes: '车间直接投料至内部订单。',
    lines: [
      { itemNo: 10, matCode: 'M10001', matName: '黄芩提取物', qty: 200, unit: 'KG', batch: 'B260607' }
    ]
  },
  {
    docNo: 'SP-20260726-005', postType: 'cost-center-issue', moveType: '201',
    plant: '1000', location: 'B02线边仓', targetLocation: '',
    internalOrderNo: '', costCenter: 'CC-1002', adjustDir: '', scrapReason: '', consignDir: '',
    postDept: '设备部', applicant: '李强', postDate: '2026-07-26',
    status: '待同步', materialDocNo: '',
    notes: '',
    lines: [
      { itemNo: 10, matCode: 'M20008', matName: '工业润滑油', qty: 20, unit: 'L', batch: '' }
    ]
  }
];
