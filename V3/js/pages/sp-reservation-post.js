/* ============================================================
 * sp-reservation-post.js — 预留过账（预留单据 · 库存管理）
 * ------------------------------------------------------------
 * 场景：A 车间创建领料单（预留），B 车间对 A 车间预留执行过账。
 * 流程：待过账预留列表 → 选择预留 → 过账执行弹窗 → 调 SAP 过账
 * 接口 → 返回物料凭证号 → 本地状态更新为已过账。
 * ============================================================ */
const RESERVATION_TYPE_MAP = {
  'consume-internal-order': '领取即消耗-内部订单',
  'consume-cost-center': '领取即消耗-成本中心',
  'staging-move': '领至暂存间',
  'staging-process-order': '按生产指令领至暂存间'
};
const RESERVATION_STATUS_FILTER = ['待过账', '部分过账', '已过账'];

const SpReservationPost = {
  page: 1, pageSize: 20, flatRows: [], filteredFlat: [],
  postResNo: '',

  getStatusBadge(s) {
    const c = { '待过账': 'badge-yellow', '部分过账': 'badge-blue', '已过账': 'badge-green' };
    return `<span class="badge ${c[s] || 'badge-gray'}">${esc(s)}</span>`;
  },

  getTypeText(t) { return RESERVATION_TYPE_MAP[t] || t; },

  flattenData() {
    const rows = [];
    spReservationData.forEach(d => {
      if (!d.lines || !d.lines.length) return;
      d.lines.forEach(line => {
        rows.push({
          _doc: d, _line: line,
          reservationNo: d.reservationNo, docNo: d.docNo, itemNo: line.itemNo,
          issueType: d.issueType, issueTypeText: this.getTypeText(d.issueType),
          sourcePlant: d.sourcePlant, sourceLocation: d.sourceLocation,
          targetPlant: d.targetPlant, targetLocation: d.targetLocation,
          sourceDept: d.sourceDept, targetDept: d.targetDept,
          matCode: line.matCode || '', matName: line.matName || '',
          qty: line.qty, postedQty: line.postedQty || 0, unit: line.unit || '', batch: line.batch || '',
          createDate: d.createDate, status: d.status,
          materialDocNo: d.materialDocNo || '', applicant: d.applicant, notes: d.notes || ''
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
          <div><div style="font-size:18px;font-weight:700;">预留过账</div><div style="font-size:13px;opacity:0.8;">A 车间创建预留，B 车间对本车间需发出的预留执行过账</div></div>
          <div style="display:flex;gap:8px;align-items:center;">
            <span style="font-size:12px;opacity:0.85;margin-right:4px;">当前车间：<strong>${esc(window.currentUserRole || 'B02线边仓')}</strong></span>
          </div>
        </div>
        <div class="filter-bar filter-bar-nowrap" style="flex-shrink:0;">
          <div class="filter-group"><label>预留号</label><input type="text" id="rspResNo" placeholder="预留号"></div>
          <div class="filter-group"><label>关联领料单</label><input type="text" id="rspDocNo" placeholder="领料单号"></div>
          <div class="filter-group"><label>发出车间</label><input type="text" id="rspSource" placeholder="发出车间"></div>
          <div class="filter-group"><label>收货车间</label><input type="text" id="rspTarget" placeholder="收货车间"></div>
          <div class="filter-group"><label>状态</label><select id="rspStatus">
            <option value="">全部</option>
            ${RESERVATION_STATUS_FILTER.map(s => `<option value="${s}">${s}</option>`).join('')}
          </select></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="SpReservationPost.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="SpReservationPost.reset()">重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table data-table-compact" style="min-width:1350px;">
            <thead><tr>
              <th>预留号</th><th>关联领料单</th><th>领料方式</th><th>发出车间</th><th>发出库位</th>
              <th>收货车间</th><th>目标库位</th><th style="width:55px;text-align:center;">行</th>
              <th>物料</th><th>物料描述</th><th style="text-align:right;">预留数量</th>
              <th style="text-align:right;">已过账</th><th style="width:38px;">单位</th><th>创建日期</th>
              <th style="width:80px;text-align:center;">状态</th><th style="width:76px;">操作</th>
            </tr></thead>
            <tbody id="rspTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info">
            <span class="list-count" id="rspCount">共 ${this.flatRows.length} 行</span>
            <span style="color:var(--text-muted);font-size:12px;">(共 ${spReservationData.length} 条预留)</span>
          </div>
          <div class="pagination">
            <button class="pagination-btn" id="rspPrev" disabled onclick="SpReservationPost.prevPage()">‹</button>
            <span class="pagination-info" id="rspPageInfo">第 ${this.page} / ${Math.ceil(Math.max(this.flatRows.length,1)/this.pageSize)} 页</span>
            <button class="pagination-btn" id="rspNext" onclick="SpReservationPost.nextPage()">›</button>
            <select class="page-size-select" id="rspPageSizeSel" onchange="SpReservationPost.changePageSize()"><option value="20">20条</option><option value="40">40条</option><option value="80">80条</option></select>
          </div>
        </div>
      </div>
      <div id="rspModalContainer"></div>`;
  },

  init() {
    this.renderRows();
    const el = document.getElementById('rspResNo');
    if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') this.search(); });
  },

  renderRows() {
    const body = document.getElementById('rspTableBody');
    if (!body) return;
    const start = (this.page - 1) * this.pageSize;
    const rows = this.filteredFlat.slice(start, start + this.pageSize);
    if (!rows.length) {
      body.innerHTML = `<tr><td colspan="16" class="empty-cell">暂无待过账预留</td></tr>`;
    } else {
      body.innerHTML = rows.map(r => `
        <tr>
          <td><strong>${esc(r.reservationNo)}</strong><div style="font-size:11px;color:var(--text-muted);">${r.postedQty > 0 ? '物料凭证: ' + esc(r.materialDocNo || '-') : '&nbsp;'}</div></td>
          <td>${esc(r.docNo)}</td>
          <td>${esc(r.issueTypeText)}</td>
          <td>${esc(r.sourceDept)}</td>
          <td>${esc(r.sourceLocation)}</td>
          <td>${esc(r.targetDept)}</td>
          <td>${esc(r.targetLocation)}</td>
          <td style="text-align:center;">${r.itemNo}</td>
          <td>${esc(r.matCode || '-')}</td>
          <td>${esc(r.matName || '-')}</td>
          <td style="text-align:right;">${r.qty}</td>
          <td style="text-align:right;">${r.postedQty}</td>
          <td>${esc(r.unit)}</td>
          <td>${esc(r.createDate)}</td>
          <td style="text-align:center;">${this.getStatusBadge(r.status)}</td>
          <td><button class="btn btn-blue btn-sm" onclick="SpReservationPost.openViewModal('${r.reservationNo}')">查看</button></td>
        </tr>`).join('');
    }
    const prev = document.getElementById('rspPrev'), next = document.getElementById('rspNext');
    const totalPages = Math.ceil(Math.max(this.filteredFlat.length, 1) / this.pageSize);
    if (prev) prev.disabled = this.page <= 1;
    if (next) next.disabled = this.page >= totalPages;
    const info = document.getElementById('rspPageInfo');
    if (info) info.textContent = `第 ${this.page} / ${totalPages} 页`;
  },

  search() {
    const qRes = (document.getElementById('rspResNo').value || '').trim().toLowerCase();
    const qDoc = (document.getElementById('rspDocNo').value || '').trim().toLowerCase();
    const qSrc = (document.getElementById('rspSource').value || '').trim().toLowerCase();
    const qTgt = (document.getElementById('rspTarget').value || '').trim().toLowerCase();
    const qStatus = document.getElementById('rspStatus').value;
    this.filteredFlat = this.flatRows.filter(r =>
      (!qRes || r.reservationNo.toLowerCase().includes(qRes)) &&
      (!qDoc || r.docNo.toLowerCase().includes(qDoc)) &&
      (!qSrc || r.sourceDept.toLowerCase().includes(qSrc) || r.sourceLocation.toLowerCase().includes(qSrc)) &&
      (!qTgt || r.targetDept.toLowerCase().includes(qTgt) || r.targetLocation.toLowerCase().includes(qTgt)) &&
      (!qStatus || r.status === qStatus)
    );
    this.page = 1;
    this.renderRows();
    const c = document.getElementById('rspCount'); if (c) c.textContent = `共 ${this.filteredFlat.length} 行`;
  },
  reset() {
    ['rspResNo', 'rspDocNo', 'rspSource', 'rspTarget'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const s = document.getElementById('rspStatus'); if (s) s.value = '';
    this.filteredFlat = [...this.flatRows];
    this.page = 1;
    this.renderRows();
    const c = document.getElementById('rspCount'); if (c) c.textContent = `共 ${this.filteredFlat.length} 行`;
  },
  prevPage() { if (this.page > 1) { this.page--; this.renderRows(); } },
  nextPage() { if (this.page < Math.ceil(this.filteredFlat.length / this.pageSize)) { this.page++; this.renderRows(); } },
  changePageSize() { this.pageSize = +document.getElementById('rspPageSizeSel').value; this.page = 1; this.renderRows(); },

  /* ---------------- 查看弹窗（内含过账入口） ---------------- */
  openViewModal(resNo) {
    const d = spReservationData.find(x => x.reservationNo === resNo);
    if (!d) return;
    const cont = document.getElementById('rspModalContainer');
    const canPost = d.status === '待过账' || d.status === '部分过账';
    cont.innerHTML = `
      <div class="modal-backdrop" id="rspModalBackdrop" onclick="SpReservationPost.closeModal()">
        <div class="modal" style="width:96vw;max-width:96vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">预留过账 ${esc(d.reservationNo)} <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">${esc(this.getTypeText(d.issueType))} · 关联领料单 ${esc(d.docNo)}</span></div>
            <button class="modal-close" onclick="SpReservationPost.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            <div class="form-section">
              <div class="form-section-title">预留信息</div>
              <div class="detail-grid" style="grid-template-columns:repeat(6,minmax(0,1fr));">
                <div class="detail-item"><dt>SAP 预留号</dt><dd><strong>${esc(d.reservationNo)}</strong></dd></div>
                <div class="detail-item"><dt>状态</dt><dd>${this.getStatusBadge(d.status)}</dd></div>
                <div class="detail-item"><dt>关联领料单</dt><dd>${esc(d.docNo)}</dd></div>
                <div class="detail-item"><dt>领料方式</dt><dd>${esc(this.getTypeText(d.issueType))}</dd></div>
                <div class="detail-item"><dt>发出车间</dt><dd>${esc(d.sourceDept)}（${esc(d.sourceLocation)}）</dd></div>
                <div class="detail-item"><dt>收货车间</dt><dd>${esc(d.targetDept)}（${esc(d.targetLocation)}）</dd></div>
                <div class="detail-item"><dt>创建日期</dt><dd>${esc(d.createDate)}</dd></div>
                <div class="detail-item"><dt>申请人</dt><dd>${esc(d.applicant)}</dd></div>
              </div>
            </div>
            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">行项目</div>
              <table class="data-table data-table-compact" style="min-width:900px;">
                <thead><tr>
                  <th style="width:60px;text-align:center;">行项目</th>
                  <th>物料编码</th><th>物料描述</th>
                  <th style="text-align:right;">预留数量</th>
                  <th style="text-align:right;">已过账数量</th><th style="width:50px;">单位</th><th>批次</th>
                </tr></thead>
                <tbody>
                  ${d.lines.map(l => `<tr>
                    <td style="text-align:center;">${l.itemNo}</td>
                    <td>${esc(l.matCode)}</td><td>${esc(l.matName)}</td>
                    <td style="text-align:right;">${l.qty}</td>
                    <td style="text-align:right;">${l.postedQty || 0}</td>
                    <td>${esc(l.unit)}</td><td>${esc(l.batch || '-')}</td>
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
            <button class="btn btn-secondary" onclick="SpReservationPost.closeModal()">关闭</button>
            ${canPost ? `<button class="btn btn-primary" onclick="SpReservationPost.openPostModal('${d.reservationNo}')">执行过账</button>` : ''}
          </div>
        </div>
      </div>`;
  },

  closeModal() { closeModal(); },

  /* ---------------- 过账执行弹窗 ---------------- */
  openPostModal(resNo) {
    const d = spReservationData.find(x => x.reservationNo === resNo);
    if (!d) return;
    this.postResNo = resNo;
    const cont = document.getElementById('rspModalContainer');
    const linesHTML = d.lines.map(l => {
      const remain = l.qty - (l.postedQty || 0);
      return `
        <div class="detail-item" style="border:1px solid var(--border);border-radius:6px;padding:10px 12px;background:var(--bg-card,#fff);">
          <dt>${esc(l.matCode)} - ${esc(l.matName)} <span style="color:var(--text-muted);font-weight:400;">（预留 ${l.qty} ${esc(l.unit)}，可过账 ${remain} ${esc(l.unit)}）</span></dt>
          <dd style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
            <label style="font-size:12px;color:var(--text-secondary);">本次过账数量</label>
            <input type="number" class="rsp-post-qty" data-res-line="${l.itemNo}" value="${remain}" min="0" max="${remain}" step="0.001" style="width:120px;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:13px;">
            <span style="font-size:12px;color:var(--text-muted);">${esc(l.unit)}</span>
          </dd>
        </div>`;
    }).join('');
    cont.innerHTML = `
      <div class="modal-backdrop" id="rspModalBackdrop" onclick="SpReservationPost.closeModal()">
        <div class="modal" style="width:96vw;max-width:96vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">预留过账 — ${esc(d.reservationNo)} <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">${esc(d.sourceDept)} → ${esc(d.targetDept)}</span></div>
            <button class="modal-close" onclick="SpReservationPost.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            <div class="form-section">
              <div class="form-section-title">过账信息</div>
              <div class="detail-grid" style="grid-template-columns:repeat(4,minmax(0,1fr));">
                <div class="detail-item"><dt>预留号</dt><dd><strong>${esc(d.reservationNo)}</strong></dd></div>
                <div class="detail-item"><dt>移动类型</dt><dd>${d.moveType || '-'}</dd></div>
                <div class="detail-item"><dt>发出库位</dt><dd>${esc(d.sourceLocation)}</dd></div>
                <div class="detail-item"><dt>收货库位</dt><dd>${esc(d.targetLocation)}</dd></div>
                <div class="detail-item"><dt>过账日期</dt><dd><input type="date" id="rspPostDate" value="${new Date().toISOString().slice(0,10)}"></dd></div>
                <div class="detail-item"><dt>过账人</dt><dd><input type="text" id="rspPostUser" value="${esc(window.currentUserId || '')}"></dd></div>
              </div>
            </div>
            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">本次过账明细</div>
              <div class="detail-grid" style="grid-template-columns:repeat(2,minmax(0,1fr));">${linesHTML}</div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="SpReservationPost.openViewModal('${d.reservationNo}')">返回</button>
            <button class="btn btn-primary" onclick="SpReservationPost.confirmPost()">确认过账（同步 SAP）</button>
          </div>
        </div>
      </div>`;
  },

  confirmPost() {
    const d = spReservationData.find(x => x.reservationNo === this.postResNo);
    if (!d) return;
    const postDate = document.getElementById('rspPostDate').value;
    const postUser = document.getElementById('rspPostUser').value.trim();
    if (!postDate) { toast('请选择过账日期'); return; }
    if (!postUser) { toast('请填写过账人'); return; }
    let totalQty = 0;
    const items = [];
    let valid = true;
    document.querySelectorAll('.rsp-post-qty').forEach(input => {
      const q = parseFloat(input.value);
      if (q < 0) { valid = false; return; }
      const max = parseFloat(input.max) || 0;
      if (q > max) { valid = false; return; }
      totalQty += q;
      items.push({ itemNo: parseInt(input.dataset.resLine, 10) || 10, qty: q });
    });
    if (!valid) { toast('过账数量不能超过可过账数量'); return; }
    if (totalQty <= 0) { toast('请至少填写一行过账数量'); return; }

    const payload = {
      reservationNo: d.reservationNo,
      moveType: d.moveType || '311',
      sourceLocation: d.sourceLocation,
      targetLocation: d.targetLocation,
      postDate, postUser,
      items
    };

    const doSync = () => {
      SAP_MOCK.showLoading('正在调用 SAP 过账接口…');
      SAP_MOCK.postGoodsMovement(payload).then(res => {
        SAP_MOCK.hideLoading();
        // 回写本地：累加过账数量、更新状态与物料凭证号
        let allPosted = true;
        d.lines.forEach(l => {
          const it = items.find(x => x.itemNo === l.itemNo);
          if (it && it.qty > 0) {
            l.postedQty = (l.postedQty || 0) + it.qty;
          }
          if ((l.postedQty || 0) < l.qty) allPosted = false;
        });
        d.materialDocNo = res.materialDocNo;
        d.status = allPosted ? '已过账' : '部分过账';
        toast('过账成功，SAP 物料凭证号：' + res.materialDocNo);
        this.closeModal();
        this.flatRows = this.flattenData();
        this.filteredFlat = [...this.flatRows];
        this.page = 1;
        this.renderRows();
        const c = document.getElementById('rspCount'); if (c) c.textContent = `共 ${this.filteredFlat.length} 行`;
      }).catch(e => {
        SAP_MOCK.hideLoading();
        if (confirm((e && e.message ? e.message : 'SAP 过账失败') + '\n\n点击「确定」重试，点击「取消」放弃。')) {
          doSync();
        }
      });
    };
    doSync();
  },

};

/* ---------------- 模拟数据 ---------------- */
const spReservationData = [
  {
    reservationNo: '0000000111', docNo: 'PL-20260701-001', issueType: 'consume-internal-order', moveType: '261',
    sourcePlant: '1000', sourceLocation: 'A01原料仓', sourceDept: '生产一部',
    targetPlant: '1000', targetLocation: 'B01线边仓', targetDept: '生产二部',
    createDate: '2026-07-01', status: '已过账', materialDocNo: '4900000101', applicant: '张伟',
    notes: '跨车间预留，已全部过账。',
    lines: [
      { itemNo: 10, matCode: 'M10001', matName: '黄芩提取物', qty: 1200, postedQty: 1200, unit: 'KG', batch: 'B260601' },
      { itemNo: 20, matCode: 'M10012', matName: '药用淀粉', qty: 800, postedQty: 800, unit: 'KG', batch: 'B260602' }
    ]
  },
  {
    reservationNo: '0000000428', docNo: 'PL-20260720-004', issueType: 'staging-process-order', moveType: '311',
    sourcePlant: '1000', sourceLocation: 'A01原料仓', sourceDept: '生产一部',
    targetPlant: '1000', targetLocation: 'B02线边仓', targetDept: '生产二部',
    createDate: '2026-07-20', status: '待过账', materialDocNo: '', applicant: '赵磊',
    notes: '按流程订单 6000001234 领料，等待收货车间过账。',
    lines: [
      { itemNo: 10, matCode: 'M10001', matName: '黄芩提取物', qty: 600, postedQty: 0, unit: 'KG', batch: 'B260607' },
      { itemNo: 20, matCode: 'M10018', matName: '硬脂酸镁', qty: 150, postedQty: 0, unit: 'KG', batch: 'B260608' }
    ]
  },
  {
    reservationNo: '0000000316', docNo: 'PL-20260712-003', issueType: 'staging-move', moveType: '311',
    sourcePlant: '1000', sourceLocation: 'A03包装材料仓', sourceDept: '生产二部',
    targetPlant: '1000', targetLocation: 'C01暂存间', targetDept: '生产三部',
    createDate: '2026-07-12', status: '部分过账', materialDocNo: '4900000302', applicant: '王芳',
    notes: '包材备料，已过账部分。',
    lines: [
      { itemNo: 10, matCode: 'M30001', matName: '铝箔复合膜', qty: 3000, postedQty: 1500, unit: 'M', batch: '' },
      { itemNo: 20, matCode: 'M30005', matName: '药用纸盒', qty: 5000, postedQty: 2000, unit: 'PCS', batch: '' }
    ]
  }
];
