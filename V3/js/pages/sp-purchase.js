// ===== Spare Parts Purchase Requisition Page =====

// ---- 配置常量 ----
const PURCHASE_TYPE_OPTIONS = [
  { value: 'Z01', label: 'Z01-生产性采购申请' },
  { value: 'Z02', label: 'Z02-非生产性采购申请' }
];
const ACCT_ASS_CATEGORY_OPTIONS = [
  { value: '', label: '空-正常物料采购' },
  { value: 'K', label: 'K-费用化采购（成本中心）' },
  { value: 'F', label: 'F-订单采购' }
];
const COST_CENTER_OPTIONS = [
  { value: '100101', label: '100101-生产设备成本中心' },
  { value: '100201', label: '100201-质量检测成本中心' },
  { value: '100301', label: '100301-生产能耗成本中心' },
  { value: '100401', label: '100401-维修保养成本中心' },
  { value: '100501', label: '100501-行政管理成本中心' },
  { value: '100601', label: '100601-研发试制成本中心' }
];
const MAT_GROUP_OPTIONS = [
  { value: '60401', label: '60401-备品备件-五金' },
  { value: '60402', label: '60402-备品备件-电料' },
  { value: '60403', label: '60403-备品备件-水暖管件' },
  { value: '60404', label: '60404-备品备件-工具' },
  { value: '60405', label: '60405-备品备件-设备备件' },
  { value: '60406', label: '60406-备品备件-检验辅助用料' },
  { value: '60407', label: '60407-备品备件-其他' },
  { value: '605', label: '605-劳保用品' },
  { value: '406', label: '406-生产性材料-气体' },
  { value: '502', label: '502-包装材料-外包材' }
];

// ---- 系统登录用户 → 部门 映射（接入真实用户体系前维护于此）----
const USER_DEPT_MAP = {
  admin: '设备部',
  '赵志强': '设备部',
  '张工': '设备部',
  '李君': '设备部'
};
function currentUserDept() {
  const u = window.currentUserId || 'admin';
  return USER_DEPT_MAP[u] || '';
}

// ---- 批量导入模板的列定义 ----
const BATCH_TEMPLATE_HEADER = ['物料编号','短文本(物料描述)','申请数量','单位','评价价格','交货日期','物料组','成本中心','采购原因','使用/库存','预算出处','备注'];
// Excel 列名 → 行项目字段
const BATCH_COL_FIELD = {
  '物料编号':'matCode','短文本':'shortText','申请数量':'reqQty','单位':'unit','评价价格':'price',
  '交货日期':'deliveryDate','物料组':'matGroup','成本中心':'costCenter','采购原因':'purchaseReason',
  '使用/库存':'usageType','预算出处':'budgetSource','备注':'notes'
};

// ---- 日期工具：内部数据格式 YYYYMMDD <-> 日期控件 YYYY-MM-DD ----
function toDateInputValue(v) {
  if (!v) return '';
  const s = String(v).replace(/[-/]/g, '').trim();
  return /^\d{8}$/.test(s) ? `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}` : '';
}
function fromDateInputValue(v) {
  if (!v) return '';
  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s.replace(/-/g, '');
  return /^\d{8}$/.test(s) ? s : '';
}

// ---- 物料主数据 Mock（供 Z01 自动带出用）----
const materialMasterMock = [
  { matCode: '60001018', shortText: '高效过滤器-MIIPDF-635*520*93-27-AAF', matGroup: '60405', storageLocation: '5004', price: 850.00 },
  { matCode: '60001019', shortText: '高效过滤器-MIIPDF-635*762*93-27-AAF', matGroup: '60405', storageLocation: '5004', price: 920.00 },
  { matCode: '60001020', shortText: '高效过滤器-MIIPDF-416*416*93-27-AAF', matGroup: '60405', storageLocation: '5004', price: 680.00 },
  { matCode: '60001021', shortText: '高效过滤器-MIIPDF-635*1030*93-27-AAF', matGroup: '60405', storageLocation: '5004', price: 1050.00 },
  { matCode: '60001022', shortText: '高效过滤器-GSF-LS-631*516*95-01/22-康斐尔', matGroup: '60405', storageLocation: '5004', price: 750.00 },
  { matCode: '60001023', shortText: '高效过滤器-GSF-LS-631*758*95-01/22-康斐尔', matGroup: '60405', storageLocation: '5004', price: 820.00 },
  { matCode: '60001024', shortText: '高效过滤器-GSF-LS-412*412*95-01/22-康斐尔', matGroup: '60405', storageLocation: '5004', price: 620.00 },
  { matCode: '60001025', shortText: '高效过滤器-GSF-LS-1026*631*95-01/22-康斐尔', matGroup: '60405', storageLocation: '5004', price: 1100.00 },
  { matCode: '60001026', shortText: '高效过滤器-GSF-LS-762*631*95-01/22-康斐尔', matGroup: '60405', storageLocation: '5004', price: 960.00 },
  { matCode: '60001012', shortText: '耐湿高效过滤器-GKYS-305*30*150', matGroup: '60405', storageLocation: '5004', price: 580.00 },
  { matCode: '60001086', shortText: 'O型圈-Φ360*5.7-材质:氟橡胶', matGroup: '60405', storageLocation: '5004', price: 65.00 },
  { matCode: '60001087', shortText: 'O型圈-Φ506*6.99-材质:氟橡胶', matGroup: '60405', storageLocation: '5004', price: 85.00 },
  { matCode: '60001088', shortText: 'O型圈-Φ399.5*8.4-材质:氟橡胶', matGroup: '60405', storageLocation: '5004', price: 78.00 },
  { matCode: '60001089', shortText: 'O型圈-Φ44*3-材质:氟橡胶', matGroup: '60405', storageLocation: '5004', price: 8.00 },
  { matCode: '60001090', shortText: 'O型圈-Φ13.94*2.62-材质:氟橡胶', matGroup: '60405', storageLocation: '5004', price: 3.50 },
  { matCode: '60001146', shortText: '隔膜阀膜片-尺寸:DN15-材质:PTFE/EPDM-宝帝', matGroup: '60405', storageLocation: '5004', price: 180.00 },
  { matCode: '60001147', shortText: '隔膜阀膜片-尺寸:DN25-材质:PTFE/EPDM-宝帝', matGroup: '60405', storageLocation: '5004', price: 220.00 },
  { matCode: '60000655', shortText: 'LED灯泡-30W', matGroup: '60402', storageLocation: '5004', price: 25.00 },
  { matCode: '60000656', shortText: 'LED灯泡-60W', matGroup: '60402', storageLocation: '5004', price: 35.00 },
  { matCode: '60000657', shortText: 'LED灯泡-100W', matGroup: '60402', storageLocation: '5004', price: 45.00 },
  { matCode: '60001128', shortText: '初效过滤器-592*592*360-G4-袋式', matGroup: '60405', storageLocation: '5004', price: 95.00 },
  { matCode: '60001129', shortText: '初效过滤器-286*592*360-G4-袋式', matGroup: '60405', storageLocation: '5004', price: 75.00 },
  { matCode: '60001131', shortText: '初效过滤器-286*286*360-G4-袋式', matGroup: '60405', storageLocation: '5004', price: 55.00 },
  { matCode: '60001132', shortText: '中效过滤器-592*592*600-M5-袋式', matGroup: '60405', storageLocation: '5004', price: 120.00 },
  { matCode: '60001238', shortText: '宝塔式气路接头-管子直径10mm-螺纹口1/4', matGroup: '60403', storageLocation: '5004', price: 8.00 },
  { matCode: '60001271', shortText: '304不锈钢培养皿架-90mm培养皿-放40个-带可翻转提手', matGroup: '60406', storageLocation: '5004', price: 380.00 },
  { matCode: '60001272', shortText: '304不锈钢培养皿架-90mm培养皿-放80个-带可翻转提手', matGroup: '60406', storageLocation: '5004', price: 520.00 },
  { matCode: '60001249', shortText: '宝塔头-外径25mm-内径9.6mm-30700-60', matGroup: '60403', storageLocation: '5004', price: 18.00 },
  { matCode: '60001207', shortText: '砝码-F1等级 1000g', matGroup: '60406', storageLocation: '5004', price: 680.00 },
  { matCode: '60001281', shortText: '压力表-0-2.5MPa', matGroup: '60405', storageLocation: '5004', price: 85.00 }
];

// ---- 轻量 Tooltip 组件：body 级单例 + 事件委托，跨浏览器兼容，不受表格 overflow 裁剪 ----
function initGlobalTooltip() {
  if (window.__tooltipInited) return;
  window.__tooltipInited = true;

  const tip = document.createElement('div');
  tip.className = 'ui-tooltip';
  tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip);

  let currentAnchor = null;
  let hideTimer = null;
  const raf = window.requestAnimationFrame || (fn => setTimeout(fn, 16));

  function positionTip(anchor) {
    const r = anchor.getBoundingClientRect();
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    const gap = 10, margin = 8;
    let x = r.left + r.width / 2 - tw / 2;
    x = Math.max(margin, Math.min(x, window.innerWidth - tw - margin));
    const placeBelow = r.top - th - gap < margin;
    tip.classList.toggle('below', placeBelow);
    tip.classList.toggle('above', !placeBelow);
    tip.style.left = x + 'px';
    tip.style.top = (placeBelow ? r.bottom + gap : r.top - th - gap) + 'px';
  }

  function show(anchor) {
    const text = (anchor.getAttribute('data-tip') || '').trim();
    if (!text) return;
    currentAnchor = anchor;
    tip.textContent = text;
    tip.classList.remove('show', 'above', 'below');
    tip.style.display = 'block';
    positionTip(anchor);
    clearTimeout(hideTimer);
    raf(() => tip.classList.add('show'));
  }

  function hide() {
    currentAnchor = null;
    tip.classList.remove('show');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { if (!tip.classList.contains('show')) tip.style.display = 'none'; }, 150);
  }

  document.addEventListener('mouseover', e => {
    const anchor = e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
    if (anchor) show(anchor);
    else if (currentAnchor) hide();
  });

  document.addEventListener('mouseout', e => {
    const anchor = e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
    if (!anchor || !anchor.contains(e.relatedTarget)) hide();
  });

  // 滚动/缩放时跟随锚点重新定位（capture 阶段捕获所有滚动容器）
  let pending = false;
  const reposition = () => {
    if (currentAnchor) {
      if (!pending) {
        pending = true;
        raf(() => { pending = false; positionTip(currentAnchor); });
      }
    }
  };
  window.addEventListener('scroll', reposition, true);
  window.addEventListener('resize', reposition);
}

const SpPurchase = {
  page: 1, pageSize: 20, flatRows: [], filteredFlat: [],
  editMode: false, editId: null,

  // Flatten data: each line item becomes one row for display
  flattenData() {
    const rows = [];
    spPurchaseData.forEach(pr => {
      if (!pr.lines || !pr.lines.length) return;
      pr.lines.forEach(line => {
        rows.push({
          _pr: pr, _line: line,
          docNo: pr.docNo, itemNo: line.itemNo,
          matCode: line.matCode || '', shortText: line.shortText || '',
          reqQty: line.reqQty, unit: line.unit || '',
          orderQty: line.orderQty || 0, deliveredQty: line.deliveredQty !== undefined && line.deliveredQty !== null ? line.deliveredQty : (line.status === 'B' ? (line.orderQty||0) : 0), deliveryDate: line.deliveryDate || '',
          applicant: line.applicant || '', poNo: line.poNo || '',
          price: line.price || 0,
          plant: pr.plant, dept: pr.dept, status: line.status || 'N',
          applyDate: pr.applyDate, notes: pr.notes || '',
          storageLocation: line.storageLocation || '',
          acctAssCategory: line.acctAssCategory || '',
          costCenter: line.costCenter || '',
          poLineItem: line.poLineItem || (line.poNo ? line.itemNo : ''),
          isSettled: line.isSettled || (line.poNo ? 'Y' : 'N'),
          createDate: pr.createDate || pr.applyDate
        });
      });
    });
    return rows;
  },

  render() {
    // Prepare line-item view data
    this.flatRows = this.flattenData();
    this.filteredFlat = [...this.flatRows];
    this.page = 1;

    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">采购申请提报</div><div style="font-size:13px;opacity:0.8;">支持手工填写和模板批导两种方式创建采购申请</div></div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="btn btn-blue" onclick="SpPurchase.openNewModal()"><span style="font-weight:700;font-size:16px;">+</span> 新建申请</button>
          </div>
        </div>
        <div class="filter-bar filter-bar-nowrap" style="flex-shrink:0;">
          <div class="filter-group"><label>工厂</label><input type="text" id="prPlant" placeholder="工厂"></div>
          <div class="filter-group"><label>采购申请号</label><input type="text" id="prDocNo" placeholder="申请编号"></div>
          <div class="filter-group"><label>物料</label><input type="text" id="prMatCode" placeholder="物料号"></div>
          <div class="filter-group"><label>创建月份</label><input type="month" id="prCreateMonth"></div>
          <div class="filter-group"><label>申请人</label><input type="text" id="prApplicant" placeholder="申请人"></div>
          <div class="filter-group"><label>是否结算</label><select id="prIsSettled">
            <option value="">全部</option>
            <option value="Y">已结算</option>
          </select></div>
          <div class="filter-group"><label>处理状态</label><select id="prStatus">
            <option value="">全部</option>
            <option value="N">未编辑</option>
            <option value="B">已创建采购订单</option>
          </select></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="SpPurchase.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="SpPurchase.reset()">重置</button>
            <button class="btn btn-outline btn-sm" onclick="SpPurchase.exportData()">导出</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table data-table-compact" style="min-width:1500px;">
            <thead><tr>
              <th>工厂</th><th>采购申请号</th><th style="width:55px;text-align:center;">行项目</th>
              <th>物料</th><th>短文本</th><th>申请人</th><th>创建日期</th>
              <th>交货日期</th><th style="text-align:right;">数量</th><th style="width:38px;">单位</th>
              <th style="text-align:right;">评估价格</th><th style="text-align:right;">预估总金额</th>
              <th style="width:100px;text-align:center;">处理状态</th><th style="width:72px;text-align:center;">已结算</th>
              <th style="width:190px;">操作</th>
            </tr></thead>
            <tbody id="prTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info">
            <span class="list-count" id="prCount">共 ${this.flatRows.length} 行</span>
            <span style="color:var(--text-muted);font-size:12px;">(共 ${spPurchaseData.length} 张申请单)</span>
          </div>
          <div class="pagination">
            <button class="pagination-btn" id="prPrev" disabled onclick="SpPurchase.prevPage()">‹</button>
            <span class="pagination-info" id="prPageInfo">第 ${this.page} / ${Math.ceil(Math.max(this.flatRows.length,1)/this.pageSize)} 页</span>
            <button class="pagination-btn" id="prNext" onclick="SpPurchase.nextPage()">›</button>
            <select class="page-size-select" id="prPageSizeSel" onchange="SpPurchase.changePageSize()"><option value="20">20条</option><option value="40">40条</option><option value="80">80条</option></select>
          </div>
        </div>
      </div>
      <div id="prModalContainer"></div>`;
  },

  init() {
    initGlobalTooltip();
    this.flatRows = this.flattenData();
    this.filteredFlat = [...this.flatRows];
    this.page = 1;
    // Full render: the caller should set innerHTML of the container to this.render()
    // For backward compatibility, if table body already exists, just render table
    if (document.getElementById('prTableBody')) {
      this.renderTable();
    }
  },

  renderTable() {
    this._renderLineTable();
  },

  _renderLineTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filteredFlat.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filteredFlat.length / this.pageSize) || 1;
    const countEl = document.getElementById('prCount');
    if (countEl) countEl.textContent = `共 ${this.filteredFlat.length} 行`;
    const pageInfo = document.getElementById('prPageInfo');
    if (pageInfo) pageInfo.textContent = `第 ${this.page} / ${totalPages} 页`;
    const prevBtn = document.getElementById('prPrev');
    if (prevBtn) prevBtn.disabled = this.page <= 1;
    const nextBtn = document.getElementById('prNext');
    if (nextBtn) nextBtn.disabled = this.page >= totalPages;
    const sizeSel = document.getElementById('prPageSizeSel');
    if (sizeSel) sizeSel.value = this.pageSize;

    let lastDoc = '';
    document.getElementById('prTableBody').innerHTML = page.map(row => {
      const isNewGroup = row.docNo !== lastDoc;
      lastDoc = row.docNo;
      let actions = '';
      if (isNewGroup) {
        actions = `<div class="table-actions">
          <button class="btn btn-blue btn-sm" onclick="SpPurchase.viewDetail('${row.docNo}')">查看</button>
          <button class="btn btn-teal btn-sm" onclick="SpPurchase.refreshPurchaseProgress('${row.docNo}', this)">刷新采购进度</button>
        </div>`;
      }
      return `<tr>
        <td style="white-space:nowrap;">${isNewGroup ? esc(row.plant) : ''}</td>
        <td><strong style="color:var(--primary);">${isNewGroup ? esc(row.docNo) : ''}</strong></td>
        <td style="text-align:center;font-weight:600;">${row.itemNo}</td>
        <td><strong>${esc(row.matCode)}</strong></td>
        <td style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(row.shortText)}">${esc(row.shortText)}</td>
        <td>${esc(row.applicant)}</td>
        <td style="white-space:nowrap;">${esc(row.createDate)}</td>
        <td style="white-space:nowrap;">${esc(row.deliveryDate)}</td>
        <td style="text-align:right;">${Number(row.reqQty).toLocaleString()}</td>
        <td style="text-align:center;">${esc(row.unit)}</td>
        <td style="text-align:right;"><span class="price-cell" data-tip="需求部门填写的预估单价，供采购人员参考">${Number(row.price).toFixed(2)}</span></td>
        <td style="text-align:right;color:#1f2937;">${((Number(row.reqQty)||0)*(Number(row.price)||0)).toFixed(2)}</td>
        <td style="text-align:center;">${this.statusBadge(row.status)}</td>
        <td style="text-align:center;">${row.isSettled === 'Y' ? '<span class="badge badge-green">是</span>' : '<span class="badge badge-gray">否</span>'}</td>
        <td style="white-space:nowrap;">${actions}</td>
      </tr>`;
    }).join('');
  },

  statusBadge(status) {
    const s = status || 'N';
    if (s === 'B') return '<span class="badge badge-blue">已创建采购订单</span>';
    if (s === 'Y') return '<span class="badge badge-green">已下达</span>';
    return '<span class="badge badge-gray">未编辑</span>';
  },

  search() {
    const plant = document.getElementById('prPlant')?.value.trim() || '';
    const docNo = document.getElementById('prDocNo').value.trim();
    const matCode = document.getElementById('prMatCode')?.value.trim() || '';
    const createMonth = document.getElementById('prCreateMonth')?.value || '';
    const isSettled = document.getElementById('prIsSettled')?.value || '';
    const status = document.getElementById('prStatus')?.value || '';
    const applicant = document.getElementById('prApplicant')?.value.trim() || '';

    this.filteredFlat = this.flatRows.filter(row => {
      if (plant && !row.plant.includes(plant)) return false;
      if (docNo && !row.docNo.includes(docNo)) return false;
      if (matCode && !(row.matCode||'').includes(matCode)) return false;
      if (createMonth && !(row.createDate || '').replace(/-/g, '').startsWith(createMonth.replace(/-/g, ''))) return false;
      if (isSettled && row.isSettled !== isSettled) return false;
      if (status && (row.status || 'N') !== status) return false;
      if (applicant && row.applicant !== applicant) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
  },

  reset() {
    const ids = ['prPlant','prDocNo','prMatCode','prCreateMonth','prApplicant'];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const selIds = ['prIsSettled','prStatus'];
    selIds.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    this.filteredFlat = [...this.flatRows];
    this.page = 1;
    this.renderTable();
  },

  prevPage() {
    if (this.page > 1) { this.page--; this.renderTable(); }
  },
  nextPage() {
    const total = this.filteredFlat.length;
    const tp = Math.ceil(total / this.pageSize) || 1;
    if (this.page < tp) { this.page++; this.renderTable(); }
  },
  changePageSize() {
    this.pageSize = parseInt(document.getElementById('prPageSizeSel').value);
    this.page = 1;
    this.renderTable();
  },

  // ---- 新建采购申请：选择创建方式弹窗 ----
  openNewModal() {
    const body = `
    <div style="padding:8px 0;">
      <div style="font-size:14px;color:var(--text-secondary);margin-bottom:16px;text-align:center;">
        请选择一种方式创建采购申请
      </div>

      <!-- 1×2 网格：放大卡片，减少空白 -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:680px;margin:0 auto;">

        <!-- 卡片一：手工填写 -->
        <div onclick="closeModal();SpPurchase.openManualForm()"
          style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1.5px solid #bfdbfe;border-radius:12px;padding:28px 20px;cursor:pointer;transition:all .22s;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px;"
          onmouseenter="this.style.borderColor='#3b82f6';this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 14px rgba(59,130,246,.12)'"
          onmouseleave="this.style.borderColor='#bfdbfe';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:40px;margin-bottom:8px;">📝</div>
          <div style="font-size:16px;font-weight:700;color:#1e40af;margin-bottom:6px;">手工填写</div>
          <div style="font-size:12px;color:#4b5563;line-height:1.5;">逐项填写物料信息<br>适合单次少量采购申请</div>
          <div style="margin-top:14px;"><span class="badge badge-blue" style="padding:6px 18px;border-radius:16px;font-size:12px;cursor:pointer;">开始填写 →</span></div>
        </div>

        <!-- 卡片二：模板批导 -->
        <div onclick="closeModal();SpPurchase.openBatchImportModal()"
          style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:1.5px solid #86efac;border-radius:12px;padding:28px 20px;cursor:pointer;transition:all .22s;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px;"
          onmouseenter="this.style.borderColor='#10b981';this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 14px rgba(16,185,129,.12)'"
          onmouseleave="this.style.borderColor='#86efac';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:40px;margin-bottom:8px;">📋</div>
          <div style="font-size:16px;font-weight:700;color:#065f46;margin-bottom:6px;">模板批导</div>
          <div style="font-size:12px;color:#4b5563;line-height:1.5;">下载模板批量填写后上传<br>适合大批量采购申请</div>
          <div style="margin-top:14px;"><span class="badge" style="padding:6px 18px;border-radius:16px;font-size:12px;background:#10b981;color:#fff;cursor:pointer;">开始批导 →</span></div>
        </div>

      </div>
    </div>`;

    showModal('📌 选择创建方式', body, [
      { text: '取消', cls: 'btn-secondary', action: closeModal }
    ], 'modal-md');
  },

  // ---- 手工填写表单（原逻辑）----
  // ---- 手工填写表单 ----
  // prefill 可选：{ plant, dept, purchaseType, lines, fromBatch }，用于模板批导预填行项目与抬头
  openManualForm(prefill) {
    this.editMode = false;
    this.editId = null;
    this._batchImport = false;
    const today = new Date().toISOString().slice(0, 10);
    const plant = (prefill && prefill.plant) || '1000';
    const purchaseType = (prefill && prefill.purchaseType) || 'Z01';
    const dept = (prefill && prefill.dept) || currentUserDept();
    const hasBatchErrors = !!(prefill && prefill.hasBatchErrors);
    const batchErrorSummary = (prefill && prefill.batchErrorSummary) || null;

    const lineSeed = () => ({
      itemNo: 0, matCode: '', shortText: '', applicant: window.currentUserId || 'admin',
      poNo: '', reqQty: '', unit: '个', orderQty: 0, deliveryDate: '', requiredDate: '',
      deliveryDate2: '', price: 0, totalValue: 0, status: 'N',
      acctAssCategory: purchaseType === 'Z02' ? 'K' : '',
      matGroup: '', storageLocation: '', costCenter: '',
      purchaseReason: '', usageType: '', budgetSource: '', notes: '', photos: []
    });

    const lines = (prefill && prefill.lines && prefill.lines.length)
      ? prefill.lines.map((l, i) => {
          const q = Number(l.reqQty) || 0;
          const p = Number(l.price) || 0;
          const seed = lineSeed();
          return Object.assign(seed, {
            itemNo: (i + 1) * 10,
            matCode: l.matCode || '',
            shortText: l.shortText || '',
            reqQty: q > 0 ? q : '',
            unit: l.unit || seed.unit,
            deliveryDate: l.deliveryDate || '',
            deliveryDate2: (l.deliveryDate || ''),
            price: p,
            totalValue: q * p,
            matGroup: l.matGroup || '',
            costCenter: l.costCenter || '',
            purchaseReason: l.purchaseReason || '',
            usageType: l.usageType || '',
            budgetSource: l.budgetSource || '',
            notes: l.notes || '',
            _batchErrors: l._batchErrors || []
          });
        })
      : Array.from({ length: 10 }, (_, i) => Object.assign(lineSeed(), { itemNo: (i + 1) * 10 }));

    const pr = {
      docNo: '', applyDate: today, createDate: today,
      plant, dept, notes: '',
      purchaseType,
      lines,
      hasBatchErrors,
      batchErrorSummary
    };
    document.getElementById('prModalContainer').innerHTML = this.getFormModalHTML(pr);
    if (purchaseType !== 'Z01') setTimeout(() => this.onPurchaseTypeChange(), 50);
    if (prefill && prefill.fromBatch) {
      if (hasBatchErrors) {
        toast(`已从 Excel 导入 ${prefill.lines.length} 行数据，其中 ${batchErrorSummary.errCount} 行存在错误，请修正后提交`);
      } else {
        toast(`已从 Excel 导入 ${prefill.lines.length} 行数据，请核对抬头与行项目后提交`);
      }
    }
  },

  // ---- 模板批导弹框 ----
  openBatchImportModal() {
    this._batchImport = true;
    this._batchRawData = [];
    document.getElementById('prModalContainer').innerHTML = `
      <div class="modal-backdrop" onclick="SpPurchase.closeModal()">
        <div class="modal" style="max-width:700px;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">模板批导 - 批量导入采购申请</div>
            <button class="modal-close" onclick="SpPurchase.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:calc(85vh-140px);">
            <!-- 第一步：下载模板 -->
            <div class="form-section">
              <div class="form-section-title">第一步：下载 Excel 模板并填写</div>
              <div style="display:flex;align-items:flex-start;gap:16px;padding:12px 0;">
                <button class="btn btn-primary" onclick="SpPurchase.downloadTemplate()" style="display:flex;align-items:center;gap:6px;white-space:nowrap;">
                  <span style="font-size:18px;">⬇</span> 下载 Excel 模板
                </button>
                <div style="font-size:12px;color:var(--text-muted);line-height:1.8;">
                  模板中需填写：<strong>申请人、工厂、采购申请凭证类型</strong>（表头区）以及<strong>行项目明细</strong>；<br>
                  部门、申请日期由系统按当前用户自动带出，无需填写。
                </div>
              </div>
              <div style="margin-top:4px;padding:10px 0 6px;border-top:1px dashed var(--border);font-size:12px;color:var(--text-muted);line-height:1.9;">
                暂无真实数据想快速体验？可下载
                <a href="javascript:;" onclick="SpPurchase.downloadDemoData('ok')" style="color:var(--primary);font-weight:600;text-decoration:underline;">规范演示数据</a>
                （上传即可体验导入全流程），或下载
                <a href="javascript:;" onclick="SpPurchase.downloadDemoData('error')" style="color:var(--primary);font-weight:600;text-decoration:underline;">含错误演示数据</a>
                （查看系统校验拦截与错误提示）。
              </div>
            </div>

            <!-- 第二步：上传文件 -->
            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">第二步：上传填好的 Excel 文件</div>
              <div id="batchUploadArea" style="border:2px dashed var(--border);border-radius:10px;padding:24px;text-align:center;cursor:pointer;transition:all 0.2s;"
                onclick="document.getElementById('batchFileInput').click()"
                ondragover="this.style.borderColor='var(--primary)';this.style.background='#eff6ff';"
                ondragleave="this.style.borderColor='var(--border)';this.style.background='transparent';"
                ondrop="event.preventDefault();this.style.borderColor='var(--border)';this.style.background='transparent';SpPurchase.handleBatchFileDrop(event)">
                <div style="font-size:38px;margin-bottom:6px;">📂</div>
                <div style="font-weight:600;color:var(--text-primary);">点击选择文件或拖拽文件到此处</div>
                <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">支持 .xlsx / .xls 文件（请使用下载的模板填写）</div>
                <input type="file" id="batchFileInput" accept=".xlsx,.xls" style="display:none;" onchange="SpPurchase.handleBatchFileSelect(event)">
              </div>
              <div id="batchUploadInfo" style="margin-top:10px;font-size:13px;"></div>
              <div id="batchErrorBox" style="margin-top:10px;display:none;"></div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="SpPurchase.closeModal()">取消</button>
          </div>
        </div>
      </div>`;
  },

  openEditModal(docNo) {
    const pr = spPurchaseData.find(r => r.docNo === docNo);
    if (!pr) return;
    this.editMode = true;
    this.editId = docNo;
    const prClone = JSON.parse(JSON.stringify(pr));
    prClone.lines = prClone.lines.map(l => { l.status = l.status || (l.poNo ? 'B' : 'N'); return l; });
    document.getElementById('prModalContainer').innerHTML = this.getFormModalHTML(prClone);
    setTimeout(() => this.onPurchaseTypeChange(), 50);
  },

  // ---- SheetJS 通用保存：数据 sheet + 可选的填写说明 sheet ----
  _saveBatchXlsx(fileName, dataAoa, descAoa) {
    if (typeof XLSX === 'undefined') { toast('Excel 组件未加载，请刷新页面后重试'); return; }
    const ws = XLSX.utils.aoa_to_sheet(dataAoa);
    ws['!cols'] = BATCH_TEMPLATE_HEADER.map((_, i) => ({ wch: i === 1 ? 40 : (i === 9 || i === 11 ? 24 : 15) }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '采购申请模板');
    if (descAoa && descAoa.length) {
      const wsDesc = XLSX.utils.aoa_to_sheet(descAoa);
      wsDesc['!cols'] = [{ wch: 110 }];
      XLSX.utils.book_append_sheet(wb, wsDesc, '填写说明');
    }
    XLSX.writeFile(wb, fileName);
  },

  // ---- 下载 Excel 模板 ----
  downloadTemplate() {
    const currentUser = window.currentUserId || 'admin';
    const today = new Date().toISOString().slice(0, 10);

    const aoa = [
      ['采购申请批量导入模板'],
      ['申请人', currentUser, '工厂', '1000', '采购申请凭证类型', 'Z01 - 生产性采购申请'],
      ['部门', '（系统自动带出，无需填写）', '申请日期', today, '（系统自动取当天，无需填写）'],
      [],
      BATCH_TEMPLATE_HEADER.slice(),
      ['60001018', '高效过滤器-MIIPDF-635*520*93-27-AAF', '48', '个', '850.00', '2026-09-15', '60405', '', '', '', '', '← 示例行，上传前请删除'],
      ['60001023', '高效过滤器-GSF-LS-631*758*95-01/22-康斐尔', '24', '个', '820.00', '2026-09-20', '60405', '', '过滤器到寿更换', '使用', '年度设备维修预算', '← 示例行，上传前请删除']
    ];
    const descAoa = [
      ['填写说明'],
      [''],
      ['1. 抬头区（第2~3行）需填写：申请人、工厂、采购申请凭证类型；部门、申请日期由系统按当前用户自动确定，无需填写。'],
      ['2. 一个物料占一行，从第5行表头下面开始填写；不要修改表头行文字。'],
      ['3. 必填校验：物料编号（须存在于物料主数据）、短文本、申请数量（大于 0 的数字）。'],
      ['4. 日期格式：2026-09-15 或 20260915；评价价格为非负数字，不填默认 0。'],
      ['5. 采购原因 / 使用库存 / 预算出处 / 备注为自由文本；成本中心仅费用性采购需要。'],
      ['6. 第6~7行为示例（行末有“示例”标识），上传前请删除；系统也会自动忽略含“示例”标识的行。'],
      ['7. 系统校验不通过时不会创建申请，会列出问题行号与原因，请修改 Excel 后重新上传。'],
      ['8. 校验通过后将打开采购申请表单（与手工填写一致），核对抬头与行项目后点【提交】即可创建。']
    ];
    this._saveBatchXlsx('采购申请导入模板.xlsx', aoa, descAoa);
    toast('Excel 模板已下载，请按模板填写后上传');
  },

  // ---- 下载演示数据（原型演示用；数据均取自系统内物料主数据）----
  downloadDemoData(kind) {
    const currentUser = window.currentUserId || 'admin';
    const today = new Date().toISOString().slice(0, 10);
    const head = [
      ['采购申请批量导入 - 演示数据'],
      ['申请人', currentUser, '工厂', '1000', '采购申请凭证类型', 'Z01 - 生产性采购申请'],
      ['部门', '（系统自动带出，无需填写）', '申请日期', today, '（系统自动取当天，无需填写）'],
      [],
      BATCH_TEMPLATE_HEADER.slice()
    ];

    if (kind === 'ok') {
      // 规范演示数据：全部校验通过，可直接上传体验导入流程
      const rows = [
        ['60001018', '高效过滤器-MIIPDF-635*520*93-27-AAF', '48', '个', '850.00', '2026-09-15', '60405', '', '车间高效过滤器到寿更换', '使用', '年度设备维修预算', '计划9月中旬净化车间停产检修期间更换'],
        ['60001023', '高效过滤器-GSF-LS-631*758*95-01/22-康斐尔', '24', '个', '820.00', '2026-09-20', '60405', '', '送排风系统高效过滤器压差报警更换', '库存', '年度设备维修预算', '同批次4套同时到寿，需一次性领用'],
        ['60001146', '隔膜阀膜片-尺寸:DN15-材质:PTFE/EPDM-宝帝', '6', '个', '180.00', '2026-09-12', '60405', '', '纯化水循环间隔膜阀维修备件', '库存', '备件采购预算', '制水间3台隔膜阀各备2片'],
        ['60001089', 'O型圈-Φ44*3-材质:氟橡胶', '50', '个', '8.00', '2026-09-10', '60405', '', '灌装机密封件周期性更换', '库存', '备件采购预算', ''],
        ['60000657', 'LED灯泡-100W', '10', '个', '45.00', '2026-09-18', '60402', '', '洁净区照明灯具故障更换', '使用', '年度零星维修预算', '含洁净区天花灯具内更换安装'],
        ['60001281', '压力表-0-2.5MPa', '4', '个', '85.00', '2026-09-25', '60405', '', '纯化水分配系统压力表年度校验更换', '使用', '计量器具更新预算', '随货需附检定证书']
      ];
      this._saveBatchXlsx('采购申请-演示数据-规范版.xlsx', head.concat(rows), null);
      toast('已下载规范演示数据，直接上传即可体验完整导入流程');
    } else {
      // 含错误演示数据：展示系统逐行校验与错误清单拦截（不会创建申请）
      const rows = [
        ['60001999', '演示：不存在的物料编号', '2', '个', '100.00', '2026-09-10', '60405', '', '', '', '', ''],
        ['', '演示：缺少物料编号的行', '5', '个', '50.00', '2026-09-11', '', '', '', '', '', ''],
        ['60001020', '演示：数量填成负数的行', '-8', '个', '680.00', '2026-09-12', '60405', '', '', '', '', ''],
        ['60001086', '演示：价格填成文字的行', '10', '个', '待询价', '2026-09-13', '60405', '', '', '', '', ''],
        ['60001022', '演示：日期格式错误的行', '6', '个', '750.00', '2026年9月1日', '60405', '', '', '', '', ''],
        ['60001025', '高效过滤器-MIIPDF-635*1030*93-27-AAF', '12', '个', '1100.00', '2026-09-20', '60405', '', '正常行（供对照）', '库存', '年度设备维修预算', '修复以上错误行后整单方可导入']
      ];
      this._saveBatchXlsx('采购申请-演示数据-含错误版.xlsx', head.concat(rows), null);
      toast('已下载含错误演示数据，上传可查看系统校验拦截与错误提示');
    }
  },

  // ---- 文件拖拽/选择 ----
  handleBatchFileDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) this._openBatchExcel(file);
  },

  handleBatchFileSelect(e) {
    const file = e.target.files[0];
    if (file) this._openBatchExcel(file);
    e.target.value = '';
  },

  // ---- 读取 Excel 文件（SheetJS）----
  _openBatchExcel(file) {
    if (typeof XLSX === 'undefined') { toast('Excel 组件未加载，请刷新页面后重试'); return; }
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!['xlsx', 'xls'].includes(ext)) { toast('文件格式不支持，请上传 .xlsx 或 .xls 文件'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(new Uint8Array(ev.target.result), { type: 'array', cellDates: true });
        this._parseBatchExcel(wb, file);
      } catch (err) {
        console.error(err);
        toast('Excel 读取失败：文件可能已损坏或不是有效的 Excel 文件');
      }
    };
    reader.readAsArrayBuffer(file);
  },

  // ---- 解析 Excel：读取抬头区 + 定位表头行 + 逐行校验 ----
  _parseBatchExcel(wb, file) {
    const ws = wb.Sheets[wb.SheetNames[0]];
    if (!ws) { this._showBatchErrorMsg('Excel 中没有可读取的工作表'); return; }
    const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

    // 1) 读取模板抬头区（前几行的 名称/值 对）
    const meta = {};
    for (let i = 0; i < Math.min(6, aoa.length); i++) {
      const row = aoa[i] || [];
      const key = String(row[0] || '').trim();
      if (['申请人', '工厂', '采购申请凭证类型', '部门'].includes(key)) meta[key] = String(row[1] ?? '').trim();
    }
    let purchaseType = 'Z01';
    if ((meta['采购申请凭证类型'] || '').toUpperCase().includes('Z02')) purchaseType = 'Z02';
    const plantMatch = (meta['工厂'] || '').match(/^\s*(\d+)/);
    const plant = plantMatch ? plantMatch[1] : '1000';

    // 2) 定位数据表头行并建立 列名→列号 映射
    let headerIdx = -1;
    const colMap = {};
    for (let i = 0; i < aoa.length; i++) {
      const row = aoa[i] || [];
      if (row.some(c => String(c || '').trim() === '物料编号')) {
        headerIdx = i;
        Object.keys(BATCH_COL_FIELD).forEach(name => {
          const norm = name.replace(/[\s()*]/g, '');
          const ci = row.findIndex(c => String(c || '').trim().replace(/[\s()*]/g, '') === norm);
          if (ci >= 0) colMap[name] = ci;
        });
        break;
      }
    }
    if (headerIdx < 0) { this._showBatchErrorMsg('未找到「物料编号」表头行，请使用下载的 Excel 模板填写后上传。'); return; }

    const cell = (row, name) => (colMap[name] === undefined ? '' : (row[colMap[name]] ?? ''));
    const lines = [];
    const rowReports = []; // 逐行校验结果（每行一个状态，错误一次性列全）

    // 3) 逐行解析 + 校验
    for (let i = headerIdx + 1; i < aoa.length; i++) {
      const row = aoa[i] || [];
      if (!row.some(c => String(c ?? '').trim() !== '')) continue; // 整行为空的行跳过
      const rn = i + 1;
      const matCode = String(cell(row, 'matCode')).trim();
      const reqQtyStr = String(cell(row, 'reqQty') ?? '').trim();
      const shortText = String(cell(row, 'shortText')).trim();
      const notes = String(cell(row, 'notes')).trim();

      // 示例行：系统自动忽略，不参与校验
      if (notes.includes('示例') || shortText.includes('示例') || matCode.includes('示例')) {
        rowReports.push({
          rn, matCode, shortText: shortText || '（示例行）', sample: true, issues: [],
          reqQty: String(cell(row, 'reqQty') ?? '').trim(),
          unit: String(cell(row, 'unit')).trim() || '个',
          price: String(cell(row, 'price') ?? '').trim(),
          deliveryDate: cell(row, 'deliveryDate') || ''
        });
        continue;
      }

      const issues = [];
      let qty = NaN, mat = null, effShortText = '', price = 0, deliveryDate = '';

      // 数量：留空或非正数均报错
      if (reqQtyStr === '') issues.push('申请数量未填写');
      else {
        qty = parseFloat(reqQtyStr.replace(/,/g, ''));
        if (Number.isNaN(qty) || !(qty > 0)) issues.push(`申请数量「${reqQtyStr}」必须为大于 0 的数字`);
      }

      // 物料：Z01 必填且须存在于物料主数据；Z02 费用化可不填物料
      if (purchaseType !== 'Z02' && !matCode) issues.push('物料编号未填写（凭证类型 Z01 必填）');
      else if (matCode) {
        mat = findMatMaster(matCode);
        if (!mat) issues.push(`物料编号「${matCode}」不存在于物料主数据`);
      }

      // 短文本（物料描述）
      effShortText = shortText || (mat ? mat.shortText : '');
      if (!effShortText) issues.push('短文本（物料描述）未填写');

      // 价格（允许留空，默认 0）
      const priceRaw = String(cell(row, 'price') ?? '').replace(/,/g, '').trim();
      if (priceRaw !== '') {
        if (!/^-?\d*\.?\d+$/.test(priceRaw)) issues.push(`评价价格「${priceRaw}」不是有效数字`);
        else {
          price = parseFloat(priceRaw);
          if (price < 0) issues.push(`评价价格「${priceRaw}」不能为负数`);
        }
      }

      // 交货日期（允许留空）
      const rawDate = cell(row, 'deliveryDate');
      if (rawDate !== '' && rawDate !== null && rawDate !== undefined) {
        let ds = '';
        if (rawDate instanceof Date && !isNaN(rawDate.getTime())) {
          ds = `${rawDate.getFullYear()}-${String(rawDate.getMonth() + 1).padStart(2, '0')}-${String(rawDate.getDate()).padStart(2, '0')}`;
        } else {
          const s = String(rawDate).trim();
          let m = null;
          if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(s)) m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
          else if (/^\d{8}$/.test(s)) m = [null, s.slice(0, 4), s.slice(4, 6), s.slice(6, 8)];
          else if (/^\d{4}\.\d{1,2}\.\d{1,2}$/.test(s)) m = s.match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/);
          if (!m) issues.push(`「交货日期」格式不正确（示例：2026-07-15，实际：${esc(s)}）`);
          else {
            const yy = +m[1], mo = +m[2], dd = +m[3];
            if (mo < 1 || mo > 12 || dd < 1 || dd > 31) issues.push(`「交货日期」${yy}-${mo}-${dd} 无效`);
            else ds = `${String(yy).padStart(4, '0')}-${String(mo).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
          }
        }
        deliveryDate = ds;
      }

      rowReports.push({
        rn, matCode, shortText: effShortText || '（未填写）', sample: false, issues,
        reqQty: reqQtyStr,
        unit: String(cell(row, 'unit')).trim() || '个',
        price: priceRaw,
        deliveryDate
      });
      if (issues.length) continue; // 该行存在问题，不计入可导入行
      lines.push({
        rn,
        matCode,
        shortText: effShortText,
        reqQty: qty,
        unit: String(cell(row, 'unit')).trim() || '个',
        price: price,
        deliveryDate,
        matGroup: String(cell(row, 'matGroup')).trim() || (mat ? mat.matGroup : ''),
        costCenter: String(cell(row, 'costCenter')).trim(),
        purchaseReason: String(cell(row, 'purchaseReason')).trim(),
        usageType: String(cell(row, 'usageType')).trim(),
        budgetSource: String(cell(row, 'budgetSource')).trim(),
        notes
      });
    }

    // 汇总所有非空非示例行（包括校验通过和未通过的），统一打开采购申请表单
    const lineByRn = new Map();
    lines.forEach(l => lineByRn.set(l.rn, l));
    const allLines = rowReports
      .filter(r => !r.sample)
      .map(r => {
        const matched = lineByRn.get(r.rn);
        if (matched) {
          const { rn, ...rest } = matched;
          return { ...rest, _batchErrors: [] };
        }
        const q = Number(String(r.reqQty).replace(/,/g, '')) || 0;
        const pRaw = String(r.price ?? '').replace(/,/g, '').trim();
        const p = pRaw !== '' ? parseFloat(pRaw) : 0;
        return {
          matCode: r.matCode === '（未填写）' ? '' : r.matCode,
          shortText: r.shortText === '（未填写）' ? '' : r.shortText,
          reqQty: q > 0 ? q : '',
          unit: r.unit || '个',
          price: p,
          deliveryDate: r.deliveryDate,
          matGroup: '', costCenter: '', purchaseReason: '',
          usageType: '', budgetSource: '', notes: '',
          _batchErrors: r.issues
        };
      });
    const hasBatchErrors = allLines.some(l => l._batchErrors && l._batchErrors.length);
    const okCount = allLines.filter(l => !l._batchErrors.length).length;
    const errCount = allLines.filter(l => l._batchErrors.length).length;

    this.closeModal();
    this.openManualForm({
      plant,
      purchaseType,
      lines: allLines,
      fromBatch: true,
      hasBatchErrors,
      batchErrorSummary: { okCount, errCount }
    });
  },

  // ---- 打开校验结果弹窗（关闭旧弹窗后在新弹窗展示逐行结果）----
  _openBatchResultModal(rows, fileName, extra) {
    const okCount = rows.filter(r => !r.sample && !r.issues.length).length;
    const errCount = rows.filter(r => !r.sample && r.issues.length).length;
    const skipCount = rows.filter(r => r.sample).length;
    const hasError = errCount > 0;
    const noData = !!(extra && extra.noData);

    const shown = rows.slice(0, 100);
    const tbody = shown.map(r => {
      const statusBadge = r.sample
        ? `<span class="badge" style="background:#e5e7eb;color:#4b5563;font-size:11px;">自动忽略</span>`
        : (r.issues.length
          ? `<span class="badge" style="background:#fee2e2;color:#b91c1c;font-size:11px;">✗ 校验未通过</span>`
          : `<span class="badge" style="background:#dcfce7;color:#166534;font-size:11px;">✓ 校验正确</span>`);
      const issueText = r.sample
        ? '<span style="color:#6b7280;font-size:12px;">示例行，已自动忽略</span>'
        : (r.issues.length
          ? `<div style="color:#b91c1c;font-size:12px;line-height:1.5;">${r.issues.map(t => `• ${esc(t)}`).join('<br>')}</div>`
          : '<span style="color:#9ca3af;font-size:12px;">-</span>');
      return `<tr>
        <td style="text-align:center;font-size:12px;color:#64748b;font-weight:600;">${r.rn}</td>
        <td style="font-size:12px;">${esc(r.matCode || '')}</td>
        <td style="font-size:12px;">${esc(r.shortText)}</td>
        <td style="text-align:right;font-size:12px;">${esc(r.reqQty || '')}</td>
        <td style="text-align:center;font-size:12px;color:#6b7280;">${esc(r.unit || '')}</td>
        <td style="text-align:right;font-size:12px;">${esc(r.price || '')}</td>
        <td style="text-align:center;font-size:12px;">${r.deliveryDate ? esc(String(r.deliveryDate)) : '<span style="color:#9ca3af;">-</span>'}</td>
        <td style="text-align:center;">${statusBadge}</td>
        <td style="min-width:180px;">${issueText}</td>
      </tr>`;
    }).join('');

    let notice = '';
    if (noData) {
      notice = `<div style="font-size:12px;color:#92400e;background:#fef3c7;border:1px solid #fde68a;border-radius:6px;padding:8px 10px;margin:6px 0 8px;line-height:1.7;">
        ⚠️ 未能识别到可导入的数据行，请检查：① 数据需写在含「物料编号」表头行的<strong>下方</strong>；② 每行至少填写「物料编号」与「申请数量」；③ 不要修改表头文字，上传后如示例行未删除会被系统自动忽略。</div>`;
    } else if (hasError) {
      notice = `<div style="font-size:12px;color:#7f1d1d;margin-bottom:8px;">存在未通过的行，本次<strong>未创建任何申请</strong>。请按下方逐行状态修正后重新上传。</div>`;
    }

    const bodyHtml = `
      <div style="font-size:14px;font-weight:700;color:#1f2937;margin-bottom:4px;">📋 逐行校验结果</div>
      <div style="font-size:12px;color:#374151;margin:6px 0 4px;">
        共识别 <strong>${rows.length}</strong> 行数据：
        ✓ 数据校验正确 <strong style="color:#166534;">${okCount}</strong> 行 ｜
        ✗ 校验未通过 <strong style="color:#b91c1c;">${errCount}</strong> 行${skipCount ? ` ｜ 自动忽略（示例行）<strong>${skipCount}</strong> 行` : ''}
      </div>
      ${notice}
      <div style="max-height:60vh;overflow:auto;border:1px solid #e5e7eb;border-radius:6px;background:#fff;">
        <table class="data-table data-table-compact" style="min-width:900px;margin:0;">
          <thead>
            <tr>
              <th style="width:60px;text-align:center;">Excel 行号</th>
              <th style="min-width:100px;">物料编号</th>
              <th style="min-width:140px;">短文本</th>
              <th style="width:55px;text-align:right;">数量</th>
              <th style="width:45px;text-align:center;">单位</th>
              <th style="width:75px;text-align:right;">评价价格</th>
              <th style="width:90px;text-align:center;">交货日期</th>
              <th style="width:100px;text-align:center;">校验状态</th>
              <th style="min-width:180px;">错误说明</th>
            </tr>
          </thead>
          <tbody>${tbody || '<tr><td colspan="9" style="text-align:center;color:#6b7280;font-size:12px;padding:16px;">未识别到任何数据行。</td></tr>'}</tbody>
        </table>
      </div>
      ${rows.length > shown.length ? `<div style="color:#6b7280;font-size:12px;margin-top:4px;">…… 其余 ${rows.length - shown.length} 行未展示</div>` : ''}
    `;

    showModal('📋 批量导入校验结果', bodyHtml, [
      { text: '关闭', cls: 'btn-secondary', action: closeModal },
      { text: '重新上传', cls: 'btn-primary', action: () => { closeModal(); SpPurchase.openBatchImportModal(); } }
    ], 'modal-xl');
  },

  // ---- 通用错误提示（关闭旧弹窗后在新弹窗提示）----
  _showBatchErrorMsg(msg) {
    this.closeModal();
    showModal('⚠️ 导入失败', `<div style="font-size:14px;color:#b91c1c;line-height:1.7;">${esc(msg)}</div>`, [
      { text: '关闭', cls: 'btn-secondary', action: closeModal },
      { text: '重新上传', cls: 'btn-primary', action: () => { closeModal(); SpPurchase.openBatchImportModal(); } }
    ], 'modal-md');
  },

  closeModal() { document.getElementById('prModalContainer').innerHTML = ''; },

  submitForm() {
    const f = id => document.getElementById(id)?.value ?? '';
    const purchaseType = f('prFPurchaseType') || 'Z01';
    const isZ01 = purchaseType === 'Z01';
    const isZ02 = purchaseType === 'Z02';

    // Header
    const prData = {
      docNo: this.editMode ? this.editId : ('21' + String(Math.floor(Math.random()*900000000+100000000))),
      applyDate: f('prFCreateDate') || new Date().toISOString().slice(0, 10),
      createDate: f('prFCreateDate') || new Date().toISOString().slice(0, 10),
      createTime: this.editMode ? (spPurchaseData.find(r => r.docNo === this.editId)?.createTime || '') : new Date().toTimeString().slice(0, 5),
      applicant: window.currentUserId || 'admin',
      plant: f('prFPlant'),
      dept: f('prFDept'),
      notes: '',
      purchaseType,
      lines: []
    };

    if (!prData.dept) { toast('请填写必填字段：申请部门'); return; }

    // Collect lines using data-field attributes
    const tbody = document.getElementById('prLinesBody');
    if (!tbody || !tbody.rows.length) { toast('请至少添加一行物料'); return; }
    let hasValidLine = false;
    for (let i = 0; i < tbody.rows.length; i++) {
      const row = tbody.rows[i];
      const getVal = field => { const el = row.querySelector(`[data-field="${field}"]`); return el ? (el.value||'').trim() : ''; };
      const getSel = field => { const el = row.querySelector(`[data-field="${field}"]`); return el ? (el.value||'') : ''; };

      const mc = getVal('matCode');
      const st = getVal('shortText');
      const q = parseFloat(getVal('reqQty')) || 0;
      const u = getSel('unit');
      const p = parseFloat(getVal('price')) || 0;
      const acct = getSel('acctAssCategory');
      const costCtr = getSel('costCenter');
      const mgEl = row.querySelector('[data-field="matGroup"]');
      const mg = mgEl ? (mgEl.value !== undefined ? mgEl.value : ((mgEl.textContent||'').trim())) : '';
      const notes = getVal('notes');
      const applicant = getVal('applicant');
      const deliveryDate = fromDateInputValue(getVal('deliveryDate'));
      const purchaseReason = getVal('purchaseReason');
      const usageType = getVal('usageType');
      const budgetSource = getVal('budgetSource');

      // Skip empty rows
      if (!mc && !st && !q) continue;

      // 申请人姓名必填（下沉到行项目后每个行项目都必须填写）
      if (!applicant) { toast(`第 ${i+1} 行：申请人姓名必填`); return; }

      // Z01 validation（KNTTP=K 费用化采购：物料号置灰，物料组与短文本必填；其余：物料号必填）
      if (isZ01) {
        if (acct === 'K') {
          if (!mg) { toast(`第 ${i+1} 行：物料组必选（费用化采购）`); return; }
          if (!costCtr) { toast(`第 ${i+1} 行：成本中心必选（费用化采购）`); return; }
          if (!st) { toast(`第 ${i+1} 行：短文本必填（费用化采购，请描述采购内容）`); return; }
        } else {
          if (!mc) { toast(`第 ${i+1} 行：物料号必填（Z01-生产性采购申请）`); return; }
        }
        if (!q) { toast(`第 ${i+1} 行：申请数量必填`); return; }
      }

      // Z02 validation
      if (isZ02) {
        if (!acct) { toast(`第 ${i+1} 行：科目分配类别必选（Z02-费用性采购申请）`); return; }
        if (!mg) { toast(`第 ${i+1} 行：物料组必选（Z02-费用性采购申请）`); return; }
        if (!costCtr) { toast(`第 ${i+1} 行：成本中心必选（Z02-费用性采购申请）`); return; }
        if (!st) { toast(`第 ${i+1} 行：短文本必填（Z02-费用性采购申请，请描述采购内容）`); return; }
        if (!p && p !== 0) { toast(`第 ${i+1} 行：评价价格必填（Z02-费用性采购申请）`); return; }
        if (!q) { toast(`第 ${i+1} 行：申请数量必填`); return; }
      } else {
        // Z01 also needs shortText (should be auto-filled)
        if (!st) { toast(`第 ${i+1} 行：短文本缺失，请先输入物料号`); return; }
      }

      const isSettled = row.querySelector('[data-field="isSettled"]')?.checked ? 'Y' : 'N';

      // In edit mode, preserve existing line status and PO data
      let lineStatus = 'N';
      let existingPoData = null;
      if (this.editMode) {
        const existing = spPurchaseData.find(r => r.docNo === this.editId);
        if (existing && existing.lines[i]) {
          lineStatus = existing.lines[i].status || 'N';
          existingPoData = { poNo: existing.lines[i].poNo, poLineItem: existing.lines[i].poLineItem,
            orderQty: existing.lines[i].orderQty,
            deliveredQty: existing.lines[i].deliveredQty,
            _pos: existing.lines[i]._pos };
        }
      }

      hasValidLine = true;
      prData.lines.push({
        itemNo: (i + 1) * 10,
        matCode: mc, shortText: st, applicant,
        poNo: existingPoData?.poNo || '',
        poLineItem: existingPoData?.poLineItem || '',
        reqQty: q, unit: u || '个',
        orderQty: existingPoData?.orderQty || parseFloat(getVal('orderQty')) || 0,
        deliveredQty: existingPoData?.deliveredQty,
        deliveryDate: deliveryDate,
        price: p, totalValue: q * p, status: lineStatus, isSettled,
        acctAssCategory: acct, matGroup: mg, costCenter: costCtr, notes: notes,
        purchaseReason: purchaseReason, usageType: usageType, budgetSource: budgetSource,
        photos: this._getRowPhotos(row),
        _pos: existingPoData?._pos || []
      });
    }
    if (!hasValidLine) { toast('请至少添加一行有效物料信息'); return; }

    if (this.editMode) {
      const idx = spPurchaseData.findIndex(r => r.docNo === this.editId);
      if (idx >= 0) {
        prData.docNo = this.editId;
        spPurchaseData[idx] = prData;
        toast('修改成功');
      }
    } else {
      spPurchaseData.unshift(prData);
      toast('采购申请已创建');
    }

    this.closeModal();
    this.flatRows = this.flattenData();
    this.filteredFlat = [...this.flatRows];
    this.page = 1;
    this.renderTable();
  },

  deleteReq(docNo) {
    if (confirm('确定要删除采购申请 ' + docNo + ' 及其所有行项目吗？')) {
      const idx = spPurchaseData.findIndex(r => r.docNo === docNo);
      if (idx >= 0) { spPurchaseData.splice(idx, 1); }
      this.flatRows = this.flattenData(); this.filteredFlat = [...this.flatRows]; this.page=1; this.renderTable();
      toast('已删除');
    }
  },

  // ---- 刷新采购进度：调用 SAP 接口查询该采购申请最新进度 ----
  // 模拟接口：对接真实后端时，将 _fetchSAPPurchaseProgress 替换为实际 fetch/AJAX 调用即可，
  // 成功/失败分支已就绪。
  _fetchSAPPurchaseProgress(docNo) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = spPurchaseData.find(r => r.docNo === docNo);
        if (found) {
          resolve({ docNo });
        } else {
          reject(new Error('单据不存在'));
        }
      }, 600); // 模拟网络延迟
    });
  },

  refreshPurchaseProgress(docNo, btn) {
    if (btn) { btn.disabled = true; }
    this._fetchSAPPurchaseProgress(docNo)
      .then(() => { toast('采购进度已获取'); })
      .catch(() => { toast('数据调取失败'); })
      .finally(() => { if (btn) { btn.disabled = false; } });
  },

  viewDetail(docNo) {
    const pr = spPurchaseData.find(r => r.docNo === docNo); if (!pr) return;
    const ptLabel = PURCHASE_TYPE_OPTIONS.find(o=>o.value===pr.purchaseType);
    const isZ01 = pr.purchaseType === 'Z01';
    const isZ02 = pr.purchaseType === 'Z02';
    const grandTotal = pr.lines.reduce((s,l)=>s+(l.totalValue||0),0);
    // build PO sub-records from line data
    const linesWithPO = pr.lines.map(l => {
      const pos = [];
      if (l.poNo) {
        // 已收货数量：优先取行数据 deliveredQty，缺省时 B(已创建采购订单)=orderQty、N=0
        const dQty = (l.deliveredQty !== undefined && l.deliveredQty !== null) ? l.deliveredQty : (l.status === 'B' ? (l.orderQty||0) : 0);
        pos.push({ poNo:l.poNo, poLineItem:l.poLineItem||(l.poNo?l.itemNo:''), poDate:l.applyDate||pr.applyDate, orderQty:l.orderQty||0, deliveredQty:dQty, poDeliveryDate:l.deliveryDate||'' });
        // simulate multiple POs for first item of first doc as demo
        if (pr.docNo==='2100002651' && l.itemNo<=20 && l.poNo==='4100014248') {
          pos.push({ poNo:'4100014290', poLineItem:l.itemNo, poDate:'20260520', orderQty:Math.round(l.orderQty/2), deliveredQty:Math.round(dQty/2), poDeliveryDate:l.deliveryDate });
        }
      }
      return { ...l, _pos:pos };
    });

    const createDate = pr.createDate || pr.applyDate;

    const html = `
      <div class="modal-backdrop" id="prDetailBackdrop" onclick="SpPurchase.closeDetail()">
        <div class="modal" style="width:98vw;max-width:98vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">采购申请详情 - ${esc(pr.docNo)} <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">${esc(ptLabel?ptLabel.label:'')}</span></div>
            <button class="modal-close" onclick="SpPurchase.closeDetail()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            <!-- 抬头信息 -->
            <div class="form-section">
              <div class="form-section-title">抬头信息</div>
              <div class="detail-grid" style="grid-template-columns:repeat(8,minmax(0,1fr));">
                <div class="detail-item"><dt>工厂</dt><dd>${esc(pr.plant)}</dd></div>
                <div class="detail-item"><dt>采购申请</dt><dd><strong>${esc(pr.docNo)}</strong></dd></div>
                <div class="detail-item"><dt>采购申请凭证类型</dt><dd>${esc(ptLabel?ptLabel.label:pr.purchaseType||'-')}</dd></div>
                <div class="detail-item"><dt>创建日期</dt><dd>${esc(createDate)}</dd></div>
                <div class="detail-item"><dt>部门</dt><dd>${esc(pr.dept)}</dd></div>
              </div>
            </div>
            <!-- 行项目 -->
            <div class="form-section" style="margin-top:16px;">
              <div class="form-section-title">行项目 (${pr.lines.length} 项，合计 ¥${grandTotal.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})})</div>
              <table class="data-table data-table-compact" style="min-width:${isZ02?'1500px':'1800px'};">
                <thead><tr>
                  <th style="width:60px;text-align:center;">行项目</th>
                  <th>科目分配类别</th>
                  <th>物料编号</th>
                  <th>短文本</th>
                  <th>申请人</th>
                  <th style="text-align:right;">数量</th>
                  <th style="width:42px;">单位</th>
                  <th style="text-align:right;">评价价格</th>
                  <th style="text-align:right;">预估总金额</th>
                  <th>物料组</th>
                  <th>交货日期</th>
                  <th>成本中心</th>
                  <th>采购原因</th>
                  <th>使用/库存</th>
                  <th>预算出处</th>
                  <th style="width:100px;text-align:center;">处理状态</th>
                  <th style="width:60px;text-align:center;">已结算</th>
                  <th style="width:110px;text-align:center;">图片</th>
                  <th>备注</th>
                  <th style="width:50px;text-align:center;">操作</th>
                </tr></thead>
                <tbody>${linesWithPO.map((l, i) => {
                  const acctLabel = ACCT_ASS_CATEGORY_OPTIONS.find(o=>o.value===(l.acctAssCategory||''));
                  const mgLabel = MAT_GROUP_OPTIONS.find(o=>o.value===l.matGroup);
                  const settled = l.isSettled || (l.poNo ? 'Y' : 'N');
                  const hasPO = l._pos && l._pos.length > 0;
                  return `<tr class="pr-line-row" onclick="SpPurchase.togglePOLine(this,'po_${pr.docNo}_${l.itemNo}')" style="cursor:pointer;" title="点击展开/收起采购订单详情">
                  <td style="text-align:center;">${l.itemNo}</td>
                  <td>${esc(acctLabel?acctLabel.label:l.acctAssCategory||'-')}</td>
                  <td><strong>${esc(l.matCode)}</strong></td>
                  <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(l.shortText)}">${esc(l.shortText)}</td>
                  <td>${esc(l.applicant||'-')}</td>
                  <td style="text-align:right;">${Number(l.reqQty).toLocaleString()}</td>
                  <td style="text-align:center;">${esc(l.unit)}</td>
                  <td style="text-align:right;"><span class="price-cell" data-tip="需求部门填写的预估单价，供采购人员参考">${Number(l.price).toFixed(2)}</span></td>
                  <td style="text-align:right;color:#1f2937;">${((Number(l.reqQty)||0)*(Number(l.price)||0)).toFixed(2)}</td>
                  <td>${esc(mgLabel?mgLabel.label:l.matGroup||'-')}</td>
                  <td style="white-space:nowrap;">${esc(l.deliveryDate||'-')}</td>
                  <td>${esc(l.costCenter||'-')}</td>
                  <td title="${esc(l.purchaseReason||'')}">${esc(l.purchaseReason||'-')}</td>
                  <td title="${esc(l.usageType||'')}">${esc(l.usageType||'-')}</td>
                  <td title="${esc(l.budgetSource||'')}">${esc(l.budgetSource||'-')}</td>
                  <td style="text-align:center;"><span class="badge ${hasPO?'badge-blue':'badge-gray'}">${hasPO?'B-已创建采购订单':'N-未编辑'}</span></td>
                  <td style="text-align:center;"><span class="badge ${settled==='Y'?'badge-green':'badge-gray'}">${settled==='Y'?'是':'否'}</span></td>
                  <td style="text-align:center;">${this._detailPhotoHTML(l.photos||[], pr.docNo, l.itemNo)}</td>
                  <td style="max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(l.notes||'')}">${esc(l.notes||'-')}</td>
                  <td style="text-align:center;">${hasPO ? '<span class="po-toggle-arrow" style="font-size:10px;color:var(--primary);cursor:pointer;display:inline-block;padding:2px 6px;border-radius:4px;background:#eff6ff;">▼</span>' : '<span style="color:var(--text-muted);font-size:11px;">-</span>'}</td>
                </tr>
                ${hasPO ? `<tr class="po-detail-row" id="po_${pr.docNo}_${l.itemNo}" style="display:none;">
                  <td colspan="21" style="padding:4px 0;">
                    <div style="margin:4px 10px;">
                      <table style="width:100%;border-collapse:collapse;font-size:12px;background:#f0f4f8;border-radius:6px;overflow:hidden;">
                        <thead><tr style="background:#e2e8f0;">
                          <th style="padding:6px 10px;text-align:left;font-size:11px;color:#475569;">采购订单号</th>
                          <th style="padding:6px 10px;text-align:left;font-size:11px;color:#475569;">PO行项目</th>
                          <th style="padding:6px 10px;text-align:left;font-size:11px;color:#475569;">采购订单日期</th>
                          <th style="padding:6px 10px;text-align:right;font-size:11px;color:#475569;">订货数量</th>
                          <th style="padding:6px 10px;text-align:right;font-size:11px;color:#475569;">已收货数量</th>
                          <th style="padding:6px 10px;text-align:left;font-size:11px;color:#475569;">PO交货日期</th>
                        </tr></thead>
                        <tbody>${l._pos.map(po=>`<tr>
                          <td style="padding:5px 10px;font-weight:600;">${esc(po.poNo)}</td>
                          <td style="padding:5px 10px;">${po.poLineItem}</td>
                          <td style="padding:5px 10px;">${esc(po.poDate||'-')}</td>
                          <td style="padding:5px 10px;text-align:right;">${Number(po.orderQty||0).toLocaleString()}</td>
                          <td style="padding:5px 10px;text-align:right;color:#1e3a5f;font-weight:600;">${Number(po.deliveredQty||0).toLocaleString()}</td>
                          <td style="padding:5px 10px;">${esc(po.poDeliveryDate||'-')}</td>
                        </tr>`).join('')}</tbody>
                      </table>
                    </div>
                  </td>
                </tr>` : ''}`;
                }).join('')}
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer" style="display:flex;justify-content:flex-end;flex-wrap:wrap;gap:8px;">
            <button class="btn btn-primary btn-sm" onclick="SpPurchase.openEditModal('${pr.docNo}')">编辑</button>
          </div>
        </div>
      </div>`;
    document.getElementById('prModalContainer').innerHTML = html;
  },

  togglePOLine(rowEl, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const isHidden = target.style.display === 'none';
    target.style.display = isHidden ? '' : 'none';
    const arrow = rowEl.querySelector('.po-toggle-arrow');
    if (arrow) arrow.textContent = isHidden ? '▲' : '▼';
  },

  closeDetail() { document.getElementById('prModalContainer').innerHTML = ''; },

  // ---- Modal Form ----
  getFormModalHTML(pr) {
    const purchaseType = pr.purchaseType || 'Z01';
    const isNew = !this.editMode;
    const showBatchCol = !!pr.hasBatchErrors;
    const linesHTML = pr.lines.map((l, i) => SpPurchase.renderLineRow(l, i, purchaseType, isNew, showBatchCol)).join('');
    const ptLabel = PURCHASE_TYPE_OPTIONS.find(o => o.value === purchaseType);
    const createDate = pr.createDate || pr.applyDate || new Date().toISOString().slice(0,10);
    const plantOptions = `<option value="1000"${pr.plant==='1000'?' selected':''}>1000 - 山东步长制药工厂</option>
                  <option value="2001"${pr.plant==='2001'?' selected':''}>2001 - 陕西步长制药工厂</option>
                  <option value="2002"${pr.plant==='2002'?' selected':''}>2002 - 山东丹红制药工厂</option>
                  <option value="2003"${pr.plant==='2003'?' selected':''}>2003 - 山东神州制药工厂</option>
                  <option value="2004"${pr.plant==='2004'?' selected':''}>2004 - 山东康爱制药工厂</option>
                  <option value="2005"${pr.plant==='2005'?' selected':''}>2005 - 通化谷红制药工厂</option>
                  <option value="2006"${pr.plant==='2006'?' selected':''}>2006 - 吉林天成制药工厂</option>
                  <option value="2007"${pr.plant==='2007'?' selected':''}>2007 - 通化天实制药工厂</option>
                  <option value="2009"${pr.plant==='2009'?' selected':''}>2009 - 辽宁奥达制药工厂</option>
                  <option value="2010"${pr.plant==='2010'?' selected':''}>2010 - 保定天浩制药工厂</option>
                  <option value="2011"${pr.plant==='2011'?' selected':''}>2011 - 邛崃天银制药工厂</option>
                  <option value="2012"${pr.plant==='2012'?' selected':''}>2012 - 陕西步长高新制药工厂</option>
                  <option value="2013"${pr.plant==='2013'?' selected':''}>2013 - 杨凌步长制药工厂</option>
                  <option value="2014"${pr.plant==='2014'?' selected':''}>2014 - 重庆市医济堂生物制品工厂</option>
                  <option value="3001"${pr.plant==='3001'?' selected':''}>3001 - 泸州步长生物工厂</option>`;
    const deptOptions = `<option value="">请选择</option><option value="设备部"${pr.dept==='设备部'?' selected':''}>设备部</option><option value="生产部"${pr.dept==='生产部'?' selected':''}>生产部</option><option value="质量部"${pr.dept==='质量部'?' selected':''}>质量部</option><option value="仓储物流部"${pr.dept==='仓储物流部'?' selected':''}>仓储物流部</option>`;
    // 编辑模式：抬头与查看弹窗完全一致（纯文本展示），值通过 hidden input 保留以便提交
    // 新建模式：抬头为可编辑控件
    const headerHTML = this.editMode ? `
      <div class="detail-grid" style="grid-template-columns:repeat(8,minmax(0,1fr));">
        <div class="detail-item"><dt>工厂</dt><dd>${esc(pr.plant)}<input type="hidden" id="prFPlant" value="${esc(pr.plant)}"></dd></div>
        <div class="detail-item"><dt>采购申请</dt><dd><strong>${esc(pr.docNo)}</strong><input type="hidden" id="prFDocNo" value="${esc(pr.docNo||'')}"></dd></div>
        <div class="detail-item"><dt>采购申请凭证类型</dt><dd>${esc(ptLabel?ptLabel.label:pr.purchaseType||'-')}<input type="hidden" id="prFPurchaseType" value="${esc(purchaseType)}"></dd></div>
        <div class="detail-item"><dt>创建日期</dt><dd>${esc(createDate)}<input type="hidden" id="prFCreateDate" value="${esc(createDate)}"></dd></div>
        <div class="detail-item"><dt>部门</dt><dd>${esc(pr.dept)}<input type="hidden" id="prFDept" value="${esc(pr.dept)}"></dd></div>
      </div>` : `
      <div class="detail-grid" style="grid-template-columns:repeat(8,minmax(0,1fr));">
        <div class="detail-item"><dt>工厂</dt><dd><select id="prFPlant" style="width:100%;border:none;background:transparent;font-size:14px;font-weight:600;color:inherit;padding:0;outline:none;">${plantOptions}</select></dd></div>
        <div class="detail-item"><dt>采购申请</dt><dd><strong>${esc(pr.docNo||'(自动生成)')}</strong><input type="hidden" id="prFDocNo" value="${esc(pr.docNo||'')}"></dd></div>
        <div class="detail-item"><dt>采购申请凭证类型</dt><dd><select id="prFPurchaseType" onchange="SpPurchase.onPurchaseTypeChange()" style="width:100%;border:none;background:transparent;font-size:14px;font-weight:600;color:inherit;padding:0;outline:none;">${PURCHASE_TYPE_OPTIONS.map(o=>`<option value="${o.value}"${purchaseType===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select></dd></div>
        <div class="detail-item"><dt>创建日期</dt><dd><input type="date" id="prFCreateDate" value="${esc(createDate)}" style="width:100%;border:none;background:transparent;font-size:14px;font-weight:600;color:inherit;padding:0;outline:none;"></dd></div>
        <div class="detail-item"><dt>部门</dt><dd><select id="prFDept" style="width:100%;border:none;background:transparent;font-size:14px;font-weight:600;color:inherit;padding:0;outline:none;">${deptOptions}</select></dd></div>
      </div>`;
    const batchErrorBanner = (pr.hasBatchErrors && pr.batchErrorSummary)
      ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:13px;color:#991b1b;">
           <span style="font-weight:700;">⚠️ 数据校验未通过：</span>共 ${pr.batchErrorSummary.okCount + pr.batchErrorSummary.errCount} 行，其中 <strong style="color:#dc2626;">${pr.batchErrorSummary.errCount}</strong> 行存在错误，请修正后提交。
         </div>`
      : '';
    return `
      <div class="modal-backdrop" id="prModalBackdrop" onclick="SpPurchase.closeModal()">
        <div class="modal" style="width:98vw;max-width:98vw;max-height:98vh;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">${this.editMode?'修改':'新建'}采购申请 - ${esc(pr.docNo||'(自动生成)')} <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">${esc(ptLabel?ptLabel.label:'')}</span></div>
            <button class="modal-close" onclick="SpPurchase.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:none;">
            ${batchErrorBanner}
            <${''}!-- Header ${''}-->
            <div class="form-section">
              <div class="form-section-title">抬头信息</div>
              ${headerHTML}
            </div>

            <${''}!-- Line Items ${''}-->
            <div class="form-section" style="margin-top:14px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <div class="form-section-title" style="margin-bottom:0;">行项目 <span id="prPurchaseTypeHint" style="font-size:12px;color:var(--primary);margin-left:8px;">${purchaseType==='Z02'?'— 费用性采购（无物料号）':''}</span></div>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-sm btn-outline" onclick="SpPurchase.addLineRow()" style="padding:4px 12px;font-size:12px;">+ 添加行</button>
                </div>
              </div>
              <div style="overflow-x:auto;">
                <table class="data-table data-table-compact" id="prLinesTable" style="min-width:${purchaseType==='Z02'?'1500px':'1800px'};">
                  <thead><tr>
                    ${showBatchCol ? '<th style="min-width:200px;">校验说明</th>' : ''}
                    <th style="width:60px;text-align:center;">行项目</th>
                    <th style="min-width:80px;" id="prThAcctAss">科目分配类别</th>
                    <th style="min-width:100px;" id="prThMatCode"><span class="req">*</span> 物料编号</th>
                    <th style="min-width:180px;" id="prThShortText"><span class="req">*</span> 短文本</th>
                    <th style="min-width:80px;"><span class="req">*</span> 申请人</th>
                    <th style="min-width:75px;text-align:right;"><span class="req">*</span> 数量</th>
                    <th style="width:52px;">单位</th>
                    <th style="min-width:80px;text-align:right;" id="prThPrice">评价价格</th>
                    <th style="min-width:110px;text-align:right;">预估总金额</th>
                    <th style="min-width:85px;" id="prThMatGroup">物料组</th>
                    <th style="min-width:95px;">交货日期</th>
                    <th style="min-width:90px;" id="prThCostCenter">成本中心</th>
                    <th style="min-width:100px;">采购原因</th>
                    <th style="min-width:85px;">使用/库存</th>
                    <th style="min-width:105px;">预算出处</th>
                    ${isNew ? '' : '<th style="width:100px;text-align:center;">处理状态</th><th style="width:60px;text-align:center;">已结算</th>'}
                    <th style="min-width:110px;text-align:center;">图片</th>
                    <th style="min-width:70px;">备注</th>
                  </tr></thead>
                  <tbody id="prLinesBody">${linesHTML}</tbody>
                </table>
              </div>
              <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--text-secondary);">
                <span>提示：点击 "+" 可添加多行物料；留空的行将被忽略</span>
                <span id="prGrandTotal" style="font-weight:700;color:var(--danger);font-size:15px;">合计: ¥ 0.00</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="SpPurchase.closeModal()">取消</button>
            <button class="btn btn-primary" ${pr.hasBatchErrors ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} onclick="SpPurchase.submitForm()">提交</button>
          </div>
        </div>
      </div>`;
  },

  renderLineRow(line, idx, purchaseType, isNew, showBatchCol) {
    if (showBatchCol === undefined) showBatchCol = false;
    const pt = purchaseType || 'Z01';
    const isZ01 = pt === 'Z01';
    const isZ02 = pt === 'Z02';
    // 新建模式不显示「处理状态」「已结算」两列
    if (isNew === undefined) isNew = !this.editMode;
    // 处理状态：B=已创建采购订单（整行锁定，所有字段不可编辑）；N=未编辑（所有字段可编辑）
    const lineStatus = line.status || (line.poNo ? 'B' : 'N');
    const locked = this.editMode && lineStatus === 'B';
    const batchErrors = line._batchErrors || [];
    const hasBatchErrors = batchErrors.length > 0;
    const rowClass = locked ? ' class="locked"' : (hasBatchErrors ? ' class="batch-error-row"' : '');
    const rowStyle = hasBatchErrors ? ' style="background:#fef2f2;border-left:3px solid #dc2626;"' : '';
    const dis = locked ? ' disabled' : '';
    const batchCol = showBatchCol
      ? (hasBatchErrors
        ? `<td style="padding:5px;"><div style="color:#b91c1c;font-size:12px;line-height:1.6;" title="${batchErrors.length > 1 ? esc(batchErrors.join('；')) : ''}">${batchErrors.length > 1 ? `${esc(batchErrors[0])}（等 ${batchErrors.length} 项）` : `• ${esc(batchErrors[0])}`}</div></td>`
        : `<td style="padding:5px;"><span style="color:#166534;font-size:12px;">✓ 校验正确</span></td>`)
      : '';

    // 科目分配类别（KNTTP）：空=正常物料采购 K=费用化采购 F=订单采购；Z01 默认空，Z02 默认 K
    const knttp = (line.acctAssCategory !== undefined && line.acctAssCategory !== null) ? line.acctAssCategory : (isZ01 ? '' : 'K');
    const knttpK = knttp === 'K';

    // MatCode cell（Z01：KNTTP=K 时物料号置灰不可填写，其余可填写）
    const matCodeCell = isZ01
      ? `<td><input type="text" data-field="matCode" value="${esc(line.matCode||'')}" placeholder="物料号"${dis} ${knttpK?'readonly':''} style="padding:5px 8px;width:100%;border:1px solid var(--border);border-radius:4px;font-size:12px;${knttpK?'background:#f1f5f9;color:#64748b;':''}" onblur="SpPurchase.onMatCodeBlur(this)" oninput="SpPurchase.recalcTotal()"></td>`
      : `<td style="padding:5px;color:var(--text-muted);font-size:11px;text-align:center;">-</td>`;

    // ShortText cell（Z01：KNTTP=空时由物料主数据带出只读，K/F 手动描述可编辑；Z02：始终手动输入）
    const stEditable = !isZ01 || knttp !== '';
    const shortTextCell = stEditable
      ? `<td><input type="text" data-field="shortText" value="${esc(line.shortText||'')}" placeholder="费用性采购内容描述"${dis} style="padding:5px 8px;width:100%;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#fffbe6;" oninput="SpPurchase.recalcTotal()" required></td>`
      : `<td><input type="text" data-field="shortText" value="${esc(line.shortText||'')}" placeholder="物料描述" readonly${dis} style="padding:5px 8px;width:100%;border:1px solid #e2e8f0;border-radius:4px;font-size:12px;background:#f1f5f9;color:#64748b;" oninput="SpPurchase.recalcTotal()"></td>`;

    // Applicant cell（申请人姓名，必填）
    const applicantCell = `<td style="padding:5px;"><input type="text" data-field="applicant" value="${esc(line.applicant||'')}" placeholder="申请人姓名"${dis} style="width:90px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#fffbe6;" required></td>`;

    // AcctAssCategory cell（Z01/Z02 均可下拉选择；锁定行 disabled）
    const acctAssCell = `<td style="padding:5px;"><select data-field="acctAssCategory"${dis} onchange="SpPurchase.onAcctAssChange(this)" style="width:100%;padding:4px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:#fffbe6;">${ACCT_ASS_CATEGORY_OPTIONS.map(o=>`<option value="${o.value}"${knttp===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select></td>`;

    // MatGroup cell（Z01：KNTTP=K 时下拉必选，否则物料主数据带出只读；Z02：始终下拉）
    let matGroupCell;
    if (isZ01 && knttpK) {
      matGroupCell = `<td style="padding:5px;"><select data-field="matGroup"${dis} style="width:100%;padding:4px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:#fffbe6;" required><option value="">请选择</option>${MAT_GROUP_OPTIONS.map(o=>`<option value="${o.value}"${line.matGroup===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select></td>`;
    } else if (isZ01) {
      const groupLabel = MAT_GROUP_OPTIONS.find(o => o.value === line.matGroup);
      matGroupCell = `<td style="padding:5px;"><span data-field="matGroup" data-value="${esc(line.matGroup||'')}" style="font-size:12px;color:#64748b;">${esc((groupLabel?groupLabel.label:'')||'')}</span></td>`;
    } else {
      matGroupCell = `<td style="padding:5px;"><select data-field="matGroup"${dis} style="width:100%;padding:4px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:#fffbe6;" required><option value="">请选择</option>${MAT_GROUP_OPTIONS.map(o=>`<option value="${o.value}"${line.matGroup===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select></td>`;
    }

    // CostCenter cell (Z01: KNTTP=K 费用化采购时下拉必选；Z02: 始终下拉；否则显示 - )
    const costCenterCell = (isZ01 && !knttpK)
      ? `<td style="padding:5px;"><span style="color:var(--text-muted);font-size:11px;">-</span></td>`
      : `<td style="padding:5px;"><select data-field="costCenter"${dis}${knttpK?' required':''} style="width:100%;padding:4px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:#fffbe6;"><option value="">请选择</option>${COST_CENTER_OPTIONS.map(o=>`<option value="${o.value}"${line.costCenter===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select></td>`;

    // Price cell (评估价格始终可编辑，不受处理状态锁定)
    const priceCell = `<td style="padding:5px;"><input type="number" data-field="price" value="${line.price||''}" min="0" step="0.01"${isZ01?'':' required'} style="width:68px;text-align:right;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#fffbe6;" oninput="SpPurchase.recalcTotal()"></td>`;

    return `<tr${rowClass}${rowStyle} data-row="${idx}">
      ${batchCol}
      <td style="text-align:center;color:var(--text-muted);font-weight:600;" title="${hasBatchErrors ? esc(batchErrors.join('；')) : ''}">
        ${hasBatchErrors ? `<span style="color:#dc2626;font-size:14px;">●</span> ` : ''}${line.itemNo || ((idx+1)*10)}</td>
      ${acctAssCell}
      ${matCodeCell}
      ${shortTextCell}
      ${applicantCell}
      <td style="padding:5px;"><input type="number" data-field="reqQty" value="${line.reqQty||''}" min="0" step="any"${dis} style="width:72px;text-align:right;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;" oninput="SpPurchase.recalcTotal()" required></td>
      <td style="padding:5px;"><select data-field="unit"${dis} style="width:48px;padding:4px 4px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:#f0f9ff;" onchange="SpPurchase.recalcTotal()">
        <option value="个"${line.unit==='个'?' selected':''}>个</option><option value="KG"${line.unit==='KG'?' selected':''}>KG</option><option value="套"${line.unit==='套'?' selected':''}>套</option><option value="袋"${line.unit==='袋'?' selected':''}>袋</option><option value="件"${line.unit==='件'?' selected':''}>件</option><option value="台"${line.unit==='台'?' selected':''}>台</option><option value="支"${line.unit==='支'?' selected':''}>支</option><option value="桶"${line.unit==='桶'?' selected':''}>桶</option><option value="组"${line.unit==='组'?' selected':''}>组</option><option value="箱"${line.unit==='箱'?' selected':''}>箱</option><option value="卷"${line.unit==='卷'?' selected':''}>卷</option><option value="瓶"${line.unit==='瓶'?' selected':''}>瓶</option><option value="盒"${line.unit==='盒'?' selected':''}>盒</option><option value="张"${line.unit==='张'?' selected':''}>张</option>
      </select></td>
      ${priceCell}
      <td style="padding:5px;text-align:right;"><span class="line-total" style="color:#1f2937;font-size:12px;">${((Number(line.reqQty)||0)*(Number(line.price)||0)).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</span></td>
      ${matGroupCell}
      <td style="padding:5px;"><input type="date" data-field="deliveryDate" value="${esc(toDateInputValue(line.deliveryDate))}"${dis} style="width:130px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      ${costCenterCell}
      <td style="padding:5px;"><input type="text" data-field="purchaseReason" value="${esc(line.purchaseReason||'')}" placeholder="采购原因"${dis} title="${esc(line.purchaseReason||'')}" style="width:94px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:5px;"><input type="text" data-field="usageType" value="${esc(line.usageType||'')}" placeholder="使用/库存"${dis} title="${esc(line.usageType||'')}" style="width:80px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:5px;"><input type="text" data-field="budgetSource" value="${esc(line.budgetSource||'')}" placeholder="预算出处"${dis} title="${esc(line.budgetSource||'')}" style="width:98px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      ${isNew ? '' : '<td style="text-align:center;padding:5px;"><span class="badge ' + (locked?'badge-blue':'badge-gray') + '" style="font-size:11px;">' + (locked?'B-已创建采购订单':'N-未编辑') + '</span></td>'}
      ${isNew ? '' : '<td style="padding:4px;text-align:center;"><input type="checkbox" data-field="isSettled" ' + (line.isSettled==='Y'?'checked':'') + ' style="width:16px;height:16px;cursor:pointer;" title="勾选表示此行已结算"></td>'}
      ${this._photoCellHTML(line.photos||[], idx, locked)}
      <td style="padding:5px;"><input type="text" data-field="notes" value="${esc(line.notes||'')}" placeholder="备注"${dis} style="width:80px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
    </tr>`;
  },

  // ---- 行项目图片（每个行项目可上传多张图片） ----

  /** 从行 DOM 读回图片数组 */
  _getRowPhotos(tr) {
    if (!tr) return [];
    return Array.from(tr.querySelectorAll('img.line-photo-img')).map(img => ({ name: img.dataset.name || '', dataUrl: img.src }));
  },

  /** 定位表单行 */
  _getLineRowTr(rowIdx) {
    const tbody = document.getElementById('prLinesBody');
    return (tbody && tbody.rows[rowIdx]) ? tbody.rows[rowIdx] : null;
  },

  /** 生成行内图片单元格 */
  _photoCellHTML(photos, idx, locked) {
    const list = photos || [];
    const n = list.length;
    const thumbs = list.slice(0, 4).map(p =>
      `<img class="line-photo-img" data-name="${esc(p.name||'')}" src="${p.dataUrl}" title="${esc(p.name||'')}" style="width:34px;height:34px;object-fit:cover;border-radius:4px;cursor:pointer;border:1px solid var(--border);flex-shrink:0;" onclick="event.stopPropagation();SpPurchase.openLinePhotoModal(${idx})">`).join('');
    const more = n > 4 ? `<span style="font-size:11px;color:var(--text-muted);font-weight:600;">+${n-4}</span>` : '';
    const btn = locked
      ? (n ? '' : '<span style="color:var(--text-muted);font-size:11px;">-</span>')
      : `<button type="button" class="btn btn-sm btn-outline" style="padding:2px 8px;font-size:11px;flex-shrink:0;" onclick="event.stopPropagation();SpPurchase.openLinePhotoModal(${idx})">📷 图片${n?`(${n})`:''}</button>`;
    return `<td class="line-photo-cell" style="padding:5px;min-width:110px;">
      <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;">${btn}${thumbs}${more}</div>
    </td>`;
  },

  /** 打开行项目图片管理弹窗 */
  openLinePhotoModal(rowIdx) {
    const tr = this._getLineRowTr(rowIdx);
    if (!tr) return;
    if (document.getElementById('prLinePhotoBackdrop')) return;
    const locked = tr.classList.contains('locked');
    const matCode = (tr.querySelector('[data-field="matCode"]')?.value || '').trim();
    const shortText = (tr.querySelector('[data-field="shortText"]')?.value || '').trim();
    const itemNo = ((rowIdx + 1) * 10);
    const titleInfo = ['第 ' + itemNo + ' 行', matCode ? '物料 ' + matCode : '', shortText ? shortText : ''].filter(Boolean).join(' · ');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'prLinePhotoBackdrop';
    backdrop.style.zIndex = '1200';
    backdrop.addEventListener('click', () => this._closeLinePhotoModal());
    backdrop.innerHTML = `
      <div class="modal" style="width:90vw;max-width:1200px;max-height:92vh;display:flex;flex-direction:column;" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">行项目图片 <span id="prLinePhotoTitle" style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">· ${esc(titleInfo)}</span><span id="prLinePhotoCount" style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">共 0 张</span></div>
          <button class="modal-close" onclick="SpPurchase._closeLinePhotoModal()">×</button>
        </div>
        <div class="modal-body" id="prLinePhotoBody" style="max-height:none;overflow-y:auto;flex:1;"></div>
        <div class="modal-footer" style="justify-content:flex-end;">
          <button class="btn btn-primary" onclick="SpPurchase._closeLinePhotoModal()">完成</button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    this._renderLinePhotoModal(rowIdx);
  },

  _closeLinePhotoModal() {
    const bd = document.getElementById('prLinePhotoBackdrop');
    if (bd) bd.remove();
  },

  /** 渲染弹窗内容：grid=图片网格，preview=大图预览 */
  _renderLinePhotoModal(rowIdx, mode) {
    const tr = this._getLineRowTr(rowIdx);
    const body = document.getElementById('prLinePhotoBody');
    const countEl = document.getElementById('prLinePhotoCount');
    if (!tr || !body) return;
    const photos = this._getRowPhotos(tr);
    const locked = tr.classList.contains('locked');
    if (countEl) countEl.textContent = '共 ' + photos.length + ' 张';
    if (mode === 'preview') {
      const p = photos[this._photoModalPreviewIdx];
      if (p) {
        body.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:10px;">
            <div style="font-size:13px;color:var(--text-secondary);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(p.name||'')}</div>
            <img src="${p.dataUrl}" style="max-width:100%;max-height:66vh;object-fit:contain;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.12);">
            <button class="btn btn-sm btn-outline" onclick="SpPurchase._renderLinePhotoModal(${rowIdx})">← 返回列表</button>
          </div>`;
        return;
      }
    }
    const gridHTML = photos.length ? photos.map((p, i) => `
      <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;background:#fff;display:flex;flex-direction:column;">
        <div style="flex:1;display:flex;align-items:center;justify-content:center;background:#f8fafc;padding:6px;cursor:pointer;" onclick="SpPurchase._previewLinePhoto(${rowIdx},${i})" title="点击查看大图">
          <img src="${p.dataUrl}" style="width:100%;height:120px;object-fit:contain;">
        </div>
        <div style="padding:6px 8px;display:flex;align-items:center;justify-content:space-between;gap:6px;border-top:1px solid #f3f4f6;">
          <span style="font-size:11px;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(p.name||'')}">${esc(p.name||'未命名')}</span>
          ${locked ? '' : `<button type="button" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:13px;line-height:1;flex-shrink:0;" title="删除" onclick="SpPurchase._removeLinePhoto(${rowIdx},${i})">✕</button>`}
        </div>
      </div>`).join('')
      : '<div style="grid-column:1/-1;text-align:center;padding:40px 0;color:var(--text-muted);font-size:13px;border:1px dashed var(--border);border-radius:8px;">该行项目暂无图片，点击上方按钮上传</div>';
    body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:10px;">
        ${locked ? '<span style="font-size:12px;color:var(--text-muted);">该行已创建采购订单，图片为只读查看</span>' : `
        <label class="btn btn-primary" style="cursor:pointer;margin:0;display:inline-flex;align-items:center;gap:6px;">
          + 上传图片（可多选）
          <input type="file" accept="image/*" multiple style="display:none;" onchange="SpPurchase._onLinePhotoSelected(this, ${rowIdx})">
        </label>`}
        <span style="font-size:12px;color:var(--text-muted);">支持 JPG / PNG / WEBP / GIF，自动压缩；点击缩略图可查看大图</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;">${gridHTML}</div>`;
  },

  /** 选择图片文件 → 压缩 → 追加到该行图片列表 */
  _onLinePhotoSelected(input, rowIdx) {
    const files = Array.from(input.files || []);
    if (input) input.value = '';
    if (!files.length) return;
    const tr = this._getLineRowTr(rowIdx);
    if (!tr || tr.classList.contains('locked')) return;
    const photos = this._getRowPhotos(tr);
    let pending = files.length;
    files.forEach(file => {
      if (!file.type || !file.type.startsWith('image/')) { pending--; return; }
      this._compressImage(file, (dataUrl, name) => {
        photos.push({ name, dataUrl });
        if (--pending <= 0) {
          this._applyRowPhotos(rowIdx, photos);
          this._renderLinePhotoModal(rowIdx);
        }
      });
    });
  },

  /** 将图片数组写回行 DOM 并刷新行内缩略图 */
  _applyRowPhotos(rowIdx, photos) {
    const tr = this._getLineRowTr(rowIdx);
    if (!tr) return;
    const cell = tr.querySelector('.line-photo-cell');
    if (cell) cell.outerHTML = this._photoCellHTML(photos, rowIdx, tr.classList.contains('locked'));
  },

  _removeLinePhoto(rowIdx, photoIdx) {
    const tr = this._getLineRowTr(rowIdx);
    if (!tr || tr.classList.contains('locked')) return;
    const photos = this._getRowPhotos(tr);
    photos.splice(photoIdx, 1);
    this._applyRowPhotos(rowIdx, photos);
    this._renderLinePhotoModal(rowIdx);
  },

  _previewLinePhoto(rowIdx, photoIdx) {
    this._photoModalPreviewIdx = photoIdx;
    this._renderLinePhotoModal(rowIdx, 'preview');
  },

  /** canvas 压缩图片：最长边 1280、JPEG 质量 0.85；GIF 动图保持原样 */
  _compressImage(file, cb) {
    const reader = new FileReader();
    reader.onload = e => {
      if (file.type === 'image/gif') { cb(e.target.result, file.name); return; }
      const img = new Image();
      img.onload = () => {
        const MAX = 1280;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          const r = Math.min(MAX / width, MAX / height);
          width = Math.round(width * r);
          height = Math.round(height * r);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        cb(canvas.toDataURL('image/jpeg', 0.85), file.name);
      };
      img.onerror = () => cb(e.target.result, file.name);
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  /** 查看弹窗内：行项目图片单元格（缩略图，点击查看大图） */
  _detailPhotoHTML(photos, docNo, itemNo) {
    const list = photos || [];
    if (!list.length) return '<span style="color:var(--text-muted);font-size:11px;">-</span>';
    const imgs = list.slice(0, 4).map((p, i) =>
      `<img src="${p.dataUrl}" data-name="${esc(p.name||'')}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;cursor:pointer;border:1px solid var(--border);" title="${esc(p.name||'')}" onclick="event.stopPropagation();SpPurchase._viewDetailPhoto('${docNo}','${itemNo}',${i})">`).join('');
    const more = list.length > 4 ? `<span style="font-size:11px;color:var(--text-muted);font-weight:600;">+${list.length-4}</span>` : '';
    return `<div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;justify-content:center;">${imgs}${more}</div>`;
  },

  /** 查看弹窗内：点击缩略图查看大图 */
  _viewDetailPhoto(docNo, itemNo, photoIdx) {
    const pr = spPurchaseData.find(r => String(r.docNo) === String(docNo));
    if (!pr) return;
    const line = pr.lines.find(l => String(l.itemNo) === String(itemNo));
    const p = line && line.photos ? line.photos[photoIdx] : null;
    if (!p) return;
    showModal(`图片 - ${esc(line.matCode||'')} ${esc(line.shortText||'')}`,
      `<img src="${p.dataUrl}" style="max-width:100%;max-height:70vh;display:block;margin:0 auto;border-radius:6px;">`,
      [{ text:'关闭', cls:'btn-secondary', action: closeModal }]);
  },

  // ---- 科目分配类别（KNTTP）变化：按 PRD 4.3 联动规则重渲染该行 ----
  onAcctAssChange(selectEl) {
    const tr = selectEl.closest('tr');
    const tbody = document.getElementById('prLinesBody');
    if (!tr || !tbody) return;
    const idx = Array.prototype.indexOf.call(tbody.rows, tr);
    if (idx < 0) return;
    const purchaseType = document.getElementById('prFPurchaseType')?.value || 'Z01';
    const newAcct = selectEl.value;
    const getEl = f => tr.querySelector(`[data-field="${f}"]`);
    const opts = { matCode:'', shortText:'', reqQty:'', unit:'个', price:0, acctAssCategory:'', matGroup:'', costCenter:'', isSettled:'N', notes:'', deliveryDate:'', purchaseReason:'', usageType:'', budgetSource:'' };
    ['matCode','shortText','reqQty','unit','price','acctAssCategory','matGroup','costCenter','isSettled','notes','deliveryDate','purchaseReason','usageType','budgetSource'].forEach(f => {
      const el = getEl(f);
      if (el) {
        let v = (el.type==='checkbox' ? (el.checked?'Y':'N') : (el.value !== undefined ? el.value : (el.dataset && el.dataset.value !== undefined ? el.dataset.value : el.textContent)));
        if (f === 'deliveryDate') v = fromDateInputValue(v);
        opts[f] = v || opts[f];
      }
    });
    // KNTTP 为 K/F（费用化/订单采购）时物料编号默认为空
    if (newAcct === 'K' || newAcct === 'F') opts.matCode = '';
    opts.photos = this._getRowPhotos(tr);
    opts.status = tr.classList.contains('locked') ? 'B' : 'N';
    opts.totalValue = (parseFloat(opts.reqQty)||0) * (parseFloat(opts.price)||0);
    const itemNoCell = tr.querySelector('td:first-child');
    if (itemNoCell) opts.itemNo = parseInt((itemNoCell.textContent||'').replace(/\D/g,''),10) || ((idx+1)*10);
    tr.outerHTML = this.renderLineRow(opts, idx, purchaseType);
    this.recalcTotal();
  },

  addLineRow() {
    const tbody = document.getElementById('prLinesBody');
    const idx = tbody.rows.length;
    const purchaseType = document.getElementById('prFPurchaseType')?.value || 'Z01';
    const tr = document.createElement('tr');
    tr.innerHTML = this.renderLineRow({ itemNo:(idx+1)*10, matCode:'', shortText:'', applicant: window.currentUserId || '', reqQty:'', unit:'个', deliveryDate:'', price:0, acctAssCategory: purchaseType === 'Z02' ? 'K' : '', matGroup:'', costCenter:'', isSettled:'N', notes:'', purchaseReason:'', usageType:'', budgetSource:'' }, idx, purchaseType);
    tbody.appendChild(tr);
    this.reindexRows();
  },

  reindexRows() {
    const rows = document.querySelectorAll('#prLinesBody tr');
    rows.forEach((r,i) => { r.querySelector('td:first-child').textContent = (i+1)*10; });
  },

  // ---- 采购申请类型切换 ----
  onPurchaseTypeChange() {
    const sel = document.getElementById('prFPurchaseType');
    if (!sel) return;
    const purchaseType = sel.value;
    const tbody = document.getElementById('prLinesBody');
    if (!tbody) return;

    // Update hint
    const hint = document.getElementById('prPurchaseTypeHint');
    if (hint) hint.textContent = purchaseType === 'Z02' ? '— 费用性采购（无物料号）' : '';

    // Update table thead indicators
    const thMatCode = document.getElementById('prThMatCode');
    const thShortText = document.getElementById('prThShortText');
    const thAcctAss = document.getElementById('prThAcctAss');
    const thMatGroup = document.getElementById('prThMatGroup');
    const thPrice = document.getElementById('prThPrice');

    const thCostCenter = document.getElementById('prThCostCenter');
    if (purchaseType === 'Z01') {
      if (thMatCode) thMatCode.innerHTML = '<span class="req">*</span> 物料编号';
      if (thShortText) thShortText.innerHTML = '短文本';
      if (thAcctAss) { thAcctAss.style.display = ''; thAcctAss.innerHTML = '科目分配类别'; }
      if (thMatGroup) thMatGroup.innerHTML = '物料组';
      if (thPrice) thPrice.innerHTML = '评价价格';
      if (thCostCenter) thCostCenter.innerHTML = '成本中心';
    } else {
      if (thMatCode) thMatCode.innerHTML = '物料';
      if (thShortText) thShortText.innerHTML = '<span class="req">*</span> 短文本';
      if (thAcctAss) { thAcctAss.style.display = ''; thAcctAss.innerHTML = '<span class="req">*</span> 科目分配类别'; }
      if (thMatGroup) thMatGroup.innerHTML = '<span class="req">*</span> 物料组';
      if (thPrice) thPrice.innerHTML = '<span class="req">*</span> 评价价格';
      if (thCostCenter) thCostCenter.innerHTML = '<span class="req">*</span> 成本中心';
    }

    // Rerender all line rows with new purchase type
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((tr, i) => {
      // Collect existing data via data-field
      const getEl = field => tr.querySelector(`[data-field="${field}"]`);
      const opts = { matCode:'', shortText:'', reqQty:'', unit:'个', price:0, acctAssCategory: purchaseType === 'Z02' ? 'K' : '', matGroup:'', costCenter:'', isSettled:'N', notes:'', deliveryDate:'', purchaseReason:'', usageType:'', budgetSource:'' };
      ['matCode','shortText','reqQty','unit','price','acctAssCategory','matGroup','costCenter','isSettled','notes','deliveryDate','purchaseReason','usageType','budgetSource'].forEach(f => {
        const el = getEl(f);
        if (el) {
          let v = (el.type==='checkbox' ? (el.checked?'Y':'N') : (el.value !== undefined ? el.value : (el.dataset && el.dataset.value !== undefined ? el.dataset.value : el.textContent)));
          if (f === 'deliveryDate') v = fromDateInputValue(v);
          opts[f] = v || opts[f];
        }
      });
      // 科目分配类别为 K/F 时物料编号默认为空
      if (opts.acctAssCategory === 'K' || opts.acctAssCategory === 'F') opts.matCode = '';
      opts.photos = this._getRowPhotos(tr);
      opts.status = tr.classList.contains('locked') ? 'B' : 'N';
      opts.totalValue = (parseFloat(opts.reqQty)||0) * (parseFloat(opts.price)||0);
      const itemNoCell = tr.querySelector('td:first-child');
      if (itemNoCell) opts.itemNo = parseInt((itemNoCell.textContent||'').replace(/\D/g,''),10) || ((i+1)*10);
      tr.outerHTML = this.renderLineRow(opts, i, purchaseType);
    });

    this.recalcTotal();
  },

  // ---- 物料号输入框失去焦点，自动带出物料主数据 ----
  onMatCodeBlur(inputEl) {
    const matCode = (inputEl.value || '').trim();
    if (!matCode) return;
    const row = inputEl.closest('tr');
    if (!row) return;

    const master = materialMasterMock.find(m => m.matCode === matCode);
    if (master) {
      // Auto-fill shortText
      const stEl = row.querySelector('[data-field="shortText"]');
      if (stEl) { stEl.value = master.shortText; stEl.style.background = '#dcfce7'; setTimeout(() => { stEl.style.background = '#f1f5f9'; }, 800); }

      // Auto-fill matGroup（物料号有值时，物料组始终带出：下拉选中 / 只读展示）
      const mgEl = row.querySelector('[data-field="matGroup"]');
      if (mgEl) {
        const label = MAT_GROUP_OPTIONS.find(o => o.value === master.matGroup);
        if (mgEl.tagName === 'SELECT') {
          mgEl.value = master.matGroup;
          mgEl.style.background = '#dcfce7';
          setTimeout(() => { mgEl.style.background = '#fffbe6'; }, 800);
        } else if (mgEl.tagName === 'SPAN') {
          mgEl.textContent = label ? label.label : master.matGroup;
          mgEl.style.color = '#16a34a';
          setTimeout(() => { mgEl.style.color = '#64748b'; }, 800);
        }
      }

      // Auto-fill price
      const prEl = row.querySelector('[data-field="price"]');
      if (prEl) { prEl.value = master.price; prEl.style.background = '#dcfce7'; setTimeout(() => { prEl.style.background = '#fffbe6'; }, 800); }

      this.recalcTotal();
    } else {
      toast(`未找到物料号 "${matCode}" 的主数据`);
      inputEl.style.borderColor = '#ef4444';
      setTimeout(() => { inputEl.style.borderColor = 'var(--border)'; }, 1500);
    }
  },

  recalcTotal() {
    const rows = document.querySelectorAll('#prLinesBody tr');
    let grand = 0;
    rows.forEach(tr => {
      const qtyEl = tr.querySelector('[data-field="reqQty"]');
      const priceEl = tr.querySelector('[data-field="price"]');
      const qty = parseFloat(qtyEl?.value) || 0;
      const price = parseFloat(priceEl?.value) || 0;
      const val = qty * price;
      const td = tr.querySelector('.line-total');
      if (td) td.textContent = val.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
      grand += val;
    });
    const gt = document.getElementById('prGrandTotal');
    if (gt) gt.textContent = '合计: ¥ ' + grand.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  },

  exportData() { toast('导出功能开发中...'); },

};

// ===== Demo Data for Purchase Requisition (real factory codes & material codes) =====
const spPurchaseData = [
  {
    docNo:'2100002651', applyDate:'2026-05-06', createDate:'2026-05-06', createTime:'09:15:30', applicant:'李君',
    plant:'1000 - 山东步长制药工厂', dept:'设备部',notes:'原厂康斐尔/AAF品牌',
    purchaseType:'Z01',
    lines:[
      {itemNo:10,matCode:'60001018',shortText:'高效过滤器-MIIPDF-635*520*93-27-AAF', reqQty:48,unit:'个',orderQty:48,deliveryDate:'20260715',requiredDate:'20260620',deliveryDate2:'20260715',price:850.00,totalValue:40800,applicant:'李君',poNo:'4100014248',poLineItem:10,isSettled:'Y',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:'',supplier:'康斐尔贸易(上海)有限公司',supplierMatCode:'CAM-MIIPDF-635'},
      {itemNo:20,matCode:'60001019',shortText:'高效过滤器-MIIPDF-635*762*93-27-AAF', reqQty:36,unit:'个',orderQty:36,deliveryDate:'20260715',requiredDate:'20260620',deliveryDate2:'20260715',price:920.00,totalValue:33120,applicant:'李君',poNo:'4100014248',poLineItem:20,isSettled:'Y',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:'',supplier:'康斐尔贸易(上海)有限公司',supplierMatCode:'CAM-MIIPDF-762'},
      {itemNo:30,matCode:'60001020',shortText:'高效过滤器-MIIPDF-416*416*93-27-AAF', reqQty:24,unit:'个',orderQty:24,deliveryDate:'20260715',requiredDate:'20260620',deliveryDate2:'20260715',price:680.00,totalValue:16320,applicant:'李君',poNo:'4100014248',poLineItem:30,isSettled:'Y',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:'',supplier:'康斐尔贸易(上海)有限公司',supplierMatCode:'CAM-MIIPDF-416'},
      {itemNo:40,matCode:'60001021',shortText:'高效过滤器-MIIPDF-635*1030*93-27-AAF', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260715',requiredDate:'20260620',deliveryDate2:'20260715',price:1050.00,totalValue:21000,applicant:'李君',poNo:'4100014248',poLineItem:40,isSettled:'Y',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:'',supplier:'康斐尔贸易(上海)有限公司',supplierMatCode:'CAM-MIIPDF-1030'},
      {itemNo:50,matCode:'60001022',shortText:'高效过滤器-GSF-LS-631*516*95-01/22-康斐尔', reqQty:32,unit:'个',orderQty:32,deliveryDate:'20260720',requiredDate:'20260625',deliveryDate2:'20260720',price:750.00,totalValue:24000,applicant:'李君',poNo:'4100014248',poLineItem:50,isSettled:'Y',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:'',supplier:'AAF国际公司',supplierMatCode:'AAF-GSF-516'},
      {itemNo:60,matCode:'60001023',shortText:'高效过滤器-GSF-LS-631*758*95-01/22-康斐尔', reqQty:24,unit:'个',orderQty:0,deliveryDate:'20260720',requiredDate:'',deliveryDate2:'',price:820.00,totalValue:19680,applicant:'李君',isSettled:'N',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:70,matCode:'60001024',shortText:'高效过滤器-GSF-LS-412*412*95-01/22-康斐尔', reqQty:16,unit:'个',orderQty:0,deliveryDate:'20260720',requiredDate:'',deliveryDate2:'',price:620.00,totalValue:9920,applicant:'李君',isSettled:'N',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:80,matCode:'60001025',shortText:'高效过滤器-GSF-LS-1026*631*95-01/22-康斐尔', reqQty:12,unit:'个',orderQty:0,deliveryDate:'20260720',requiredDate:'',deliveryDate2:'',price:1100.00,totalValue:13200,applicant:'李君',isSettled:'N',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:90,matCode:'60001026',shortText:'高效过滤器-GSF-LS-762*631*95-01/22-康斐尔', reqQty:12,unit:'个',orderQty:0,deliveryDate:'20260720',requiredDate:'',deliveryDate2:'',price:960.00,totalValue:11520,applicant:'李君',isSettled:'N',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:100,matCode:'60001012',shortText:'耐湿高效过滤器-GKYS-305*30*150', reqQty:8,unit:'个',orderQty:0,deliveryDate:'20260720',requiredDate:'',deliveryDate2:'',price:580.00,totalValue:4640,applicant:'李君',isSettled:'N',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''}
    ]
  },
  {
    docNo:'2100002752', applyDate:'2026-05-07', createDate:'2026-05-07', createTime:'10:30:00', applicant:'王海涛', plant:'2001 - 陕西步长制药工厂', dept:'设备部',notes:'要求氟橡胶材质，需提供材质证明',
    purchaseType:'Z01',
    lines:[
      {itemNo:10,matCode:'60001086',shortText:'O型圈-Φ360*5.7-材质:氟橡胶', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:65.00,totalValue:1300,applicant:'王海涛',poNo:'4100015321',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:20,matCode:'60001087',shortText:'O型圈-Φ506*6.99-材质:氟橡胶', reqQty:15,unit:'个',orderQty:15,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:85.00,totalValue:1275,applicant:'王海涛',poNo:'4100015321',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:30,matCode:'60001088',shortText:'O型圈-Φ399.5*8.4-材质:氟橡胶', reqQty:15,unit:'个',orderQty:15,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:78.00,totalValue:1170,applicant:'王海涛',poNo:'4100015321',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:40,matCode:'60001089',shortText:'O型圈-Φ44*3-材质:氟橡胶', reqQty:50,unit:'个',orderQty:50,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:8.00,totalValue:400,applicant:'王海涛',poNo:'4100015321',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:50,matCode:'60001090',shortText:'O型圈-Φ13.94*2.62-材质:氟橡胶', reqQty:100,unit:'个',orderQty:100,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:3.50,totalValue:350,applicant:'王海涛',poNo:'4100015321',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:60,matCode:'60001091',shortText:'O型圈-Φ6*2-材质:氟橡胶', reqQty:100,unit:'个',orderQty:100,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:2.00,totalValue:200,applicant:'王海涛',poNo:'4100015321',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:70,matCode:'60001092',shortText:'O型圈-Φ42*2.5-材质:氟橡胶', reqQty:80,unit:'个',orderQty:80,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:7.50,totalValue:600,applicant:'王海涛',poNo:'4100015321',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:80,matCode:'60001093',shortText:'O型圈-Φ7.6*2.62-材质:氟橡胶', reqQty:120,unit:'个',orderQty:120,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:2.50,totalValue:300,applicant:'王海涛',poNo:'4100015321',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:90,matCode:'60001094',shortText:'O型圈-Φ59.92*3.53-材质:氟橡胶', reqQty:60,unit:'个',orderQty:60,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:12.00,totalValue:720,applicant:'王海涛',poNo:'4100015321',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:100,matCode:'60001095',shortText:'O型圈-Φ10.77*2.62-材质:氟橡胶', reqQty:150,unit:'个',orderQty:150,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:3.00,totalValue:450,applicant:'王海涛',poNo:'4100015321',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''}
    ]
  },
  {
    docNo:'2100002873', applyDate:'2026-05-09', createDate:'2026-05-09', createTime:'14:20:00', applicant:'张建国', plant:'2002 - 山东丹红制药工厂', dept:'设备部',notes:'宝帝原厂膜片，需随货附合格证',
    purchaseType:'Z01',
    lines:[
      {itemNo:10,matCode:'60001146',shortText:'隔膜阀膜片-尺寸:DN15-材质:PTFE/EPDM-宝帝', reqQty:30,unit:'个',orderQty:30,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:180.00,totalValue:5400,applicant:'张建国',poNo:'4100014655',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:20,matCode:'60001147',shortText:'隔膜阀膜片-尺寸:DN25-材质:PTFE/EPDM-宝帝', reqQty:24,unit:'个',orderQty:24,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:220.00,totalValue:5280,applicant:'张建国',poNo:'4100014655',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:30,matCode:'60001148',shortText:'隔膜阀膜片-尺寸:DN40-材质:PTFE/EPDM-宝帝', reqQty:16,unit:'个',orderQty:16,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:280.00,totalValue:4480,applicant:'张建国',poNo:'4100014655',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:40,matCode:'60001149',shortText:'隔膜阀膜片-尺寸:DN50-材质:PTFE/EPDM-宝帝', reqQty:12,unit:'个',orderQty:12,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:350.00,totalValue:4200,applicant:'张建国',poNo:'4100014655',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:50,matCode:'60001150',shortText:'隔膜阀膜片-尺寸:DN65-材质:PTFE/EPDM-宝帝', reqQty:8,unit:'个',orderQty:8,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:480.00,totalValue:3840,applicant:'张建国',poNo:'4100014655',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:60,matCode:'60001103',shortText:'法兰垫片-DN100-材质:PTFE', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:25.00,totalValue:500,applicant:'张建国',poNo:'4100014655',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:70,matCode:'60001107',shortText:'金属缠绕石墨垫-DN50', reqQty:30,unit:'个',orderQty:30,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:15.00,totalValue:450,applicant:'张建国',poNo:'4100014655',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:80,matCode:'60001108',shortText:'金属缠绕石墨垫-DN80', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:22.00,totalValue:440,applicant:'张建国',poNo:'4100014655',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''}
    ]
  },
  {
    docNo:'2100002984', applyDate:'2026-05-12', createDate:'2026-05-12', createTime:'08:45:00', applicant:'陈永刚', plant:'2003 - 山东神州制药工厂', dept:'生产部',notes:'',
    purchaseType:'Z01',
    lines:[
      {itemNo:10,matCode:'60000655',shortText:'LED灯泡-30W', reqQty:50,unit:'个',orderQty:50,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:25.00,totalValue:1250,applicant:'陈永刚',poNo:'4100014901',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:20,matCode:'60000656',shortText:'LED灯泡-60W', reqQty:30,unit:'个',orderQty:30,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:35.00,totalValue:1050,applicant:'陈永刚',poNo:'4100014901',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:30,matCode:'60000657',shortText:'LED灯泡-100W', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:45.00,totalValue:900,applicant:'陈永刚',poNo:'4100014901',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:40,matCode:'60000667',shortText:'插排-3插位', reqQty:15,unit:'个',orderQty:15,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:18.00,totalValue:270,applicant:'陈永刚',poNo:'4100014901',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:50,matCode:'60000668',shortText:'插排-6插位', reqQty:10,unit:'个',orderQty:10,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:32.00,totalValue:320,applicant:'陈永刚',poNo:'4100014901',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:60,matCode:'60001205',shortText:'插线板-6插位-3米', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:28.00,totalValue:560,applicant:'陈永刚',poNo:'4100014901',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:70,matCode:'60001297',shortText:'插线板-8插位', reqQty:10,unit:'个',orderQty:10,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:38.00,totalValue:380,applicant:'陈永刚',poNo:'4100014901',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:80,matCode:'60001298',shortText:'公牛插线板-4插位-5米', reqQty:8,unit:'个',orderQty:8,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:42.00,totalValue:336,applicant:'陈永刚',poNo:'4100014901',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''}
    ]
  },
  {
    docNo:'2100003105', applyDate:'2026-05-14', createDate:'2026-05-14', createTime:'11:00:00', applicant:'李君', plant:'1000 - 山东步长制药工厂', dept:'设备部',notes:'含安装服务',
    purchaseType:'Z01',
    lines:[
      {itemNo:10,matCode:'60001128',shortText:'初效过滤器-592*592*360-G4-袋式', reqQty:60,unit:'个',orderQty:60,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:95.00,totalValue:5700,applicant:'李君',poNo:'4100016742',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:20,matCode:'60001129',shortText:'初效过滤器-286*592*360-G4-袋式', reqQty:40,unit:'个',orderQty:40,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:75.00,totalValue:3000,applicant:'李君',poNo:'4100016742',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:30,matCode:'60001130',shortText:'初效过滤器-592*286*360-G4-袋式', reqQty:40,unit:'个',orderQty:40,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:75.00,totalValue:3000,applicant:'李君',poNo:'4100016742',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:40,matCode:'60001131',shortText:'初效过滤器-286*286*360-G4-袋式', reqQty:30,unit:'个',orderQty:30,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:55.00,totalValue:1650,applicant:'李君',poNo:'4100016742',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:50,matCode:'60001132',shortText:'中效过滤器-592*592*600-M5-袋式', reqQty:48,unit:'个',orderQty:48,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:120.00,totalValue:5760,applicant:'李君',poNo:'4100016742',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:60,matCode:'60001133',shortText:'中效过滤器-286*592*600-M5-袋式', reqQty:32,unit:'个',orderQty:32,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:100.00,totalValue:3200,applicant:'李君',poNo:'4100016742',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:70,matCode:'60001134',shortText:'中效过滤器-592*286*600-M5-袋式', reqQty:32,unit:'个',orderQty:32,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:100.00,totalValue:3200,applicant:'李君',poNo:'4100016742',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:80,matCode:'60001036',shortText:'中效过滤器-286*286 效率 M5铝合金框-袋长600-分6P', reqQty:24,unit:'个',orderQty:24,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:82.00,totalValue:1968,applicant:'李君',poNo:'4100016742',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''}
    ]
  },
  {
    docNo:'2100003206', applyDate:'2026-05-16', createDate:'2026-05-16', createTime:'09:20:00', applicant:'刘志强', plant:'2006 - 吉林天成制药工厂', dept:'设备部',notes:'需重新确认规格型号',
    purchaseType:'Z01',
    lines:[
      {itemNo:10,matCode:'60001238',shortText:'宝塔式气路接头-管子直径10mm-螺纹口1/4', reqQty:50,unit:'个',orderQty:50,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:8.00,totalValue:400,applicant:'刘志强',poNo:'4100015200',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:20,matCode:'60001242',shortText:'T型接头-3/8"-10个/包-ZD-30703-77 PVDF', reqQty:10,unit:'个',orderQty:100,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:15.00,totalValue:150,applicant:'刘志强',poNo:'4100015200',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:30,matCode:'60001243',shortText:'T型接头-1/2"-10个/包-ZD-30703-78 PVDF', reqQty:10,unit:'个',orderQty:100,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:18.00,totalValue:180,applicant:'刘志强',poNo:'4100015200',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:40,matCode:'60001256',shortText:'直型接头-1/8"-10个/包-ZD-40703-02 PVDF', reqQty:15,unit:'个',orderQty:150,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:12.00,totalValue:180,applicant:'刘志强',poNo:'4100015200',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:50,matCode:'60001257',shortText:'直型接头-3/8"-10个/包-ZD-30703-07 PVDF', reqQty:15,unit:'个',orderQty:150,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:14.00,totalValue:210,applicant:'刘志强',poNo:'4100015200',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:60,matCode:'60001258',shortText:'直型接头-1/2"-10个/包-ZD-30703-08 PVDF', reqQty:15,unit:'个',orderQty:150,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:16.00,totalValue:240,applicant:'刘志强',poNo:'4100015200',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:70,matCode:'60001105',shortText:'气管变径-12mm变10mm', reqQty:30,unit:'个',orderQty:30,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:5.00,totalValue:150,applicant:'刘志强',poNo:'4100015200',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:80,matCode:'60001106',shortText:'气管三通-12mm三通', reqQty:40,unit:'个',orderQty:40,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:4.50,totalValue:180,applicant:'刘志强',poNo:'4100015200',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''}
    ]
  },
  {
    docNo:'2100003307', applyDate:'2026-05-18', createDate:'2026-05-18', createTime:'15:10:00', applicant:'赵雪梅', plant:'2010 - 保定天浩制药工厂', dept:'质量部',notes:'补充设备使用年限说明后重新提交',
    purchaseType:'Z01',
    lines:[
      {itemNo:10,matCode:'60001271',shortText:'304不锈钢培养皿架-90mm培养皿-放40个-带可翻转提手', reqQty:6,unit:'个',orderQty:6,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:380.00,totalValue:2280,applicant:'赵雪梅',poNo:'4100015300',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:20,matCode:'60001272',shortText:'304不锈钢培养皿架-90mm培养皿-放80个-带可翻转提手', reqQty:4,unit:'个',orderQty:4,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:520.00,totalValue:2080,applicant:'赵雪梅',poNo:'4100015300',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:30,matCode:'60001273',shortText:'不锈钢试管架-40孔/个-孔径21mm', reqQty:10,unit:'个',orderQty:10,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:120.00,totalValue:1200,applicant:'赵雪梅',poNo:'4100015300',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:40,matCode:'60001293',shortText:'贴壁式不锈钢置物架-304不锈钢-30cm*15cm*12cm', reqQty:8,unit:'个',orderQty:8,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:160.00,totalValue:1280,applicant:'赵雪梅',poNo:'4100015300',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''}
    ]
  },
  {
    docNo:'2100003408', applyDate:'2026-05-20', createDate:'2026-05-20', createTime:'16:05:00', applicant:'王海涛', plant:'1000 - 山东步长制药工厂', dept:'设备部',notes:'需304不锈钢材质',
    purchaseType:'Z01',
    lines:[
      {itemNo:10,matCode:'60001249',shortText:'宝塔头-外径25mm-内径9.6mm-30700-60', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:18.00,totalValue:360,applicant:'王海涛',poNo:'4100017356',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:20,matCode:'60001250',shortText:'宝塔头-外径50mm-内径9.6mm-30700-49', reqQty:15,unit:'个',orderQty:15,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:25.00,totalValue:375,applicant:'王海涛',poNo:'4100017356',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:30,matCode:'60001251',shortText:'卡箍-25mm-30800-75-304L不锈钢', reqQty:40,unit:'个',orderQty:40,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:10.00,totalValue:400,applicant:'王海涛',poNo:'4100017356',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:40,matCode:'60001252',shortText:'卡箍-50mm-30800-76-304L不锈钢', reqQty:30,unit:'个',orderQty:30,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:15.00,totalValue:450,applicant:'王海涛',poNo:'4100017356',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:50,matCode:'60001278',shortText:'管路直角接头-φ51mm', reqQty:25,unit:'个',orderQty:0,deliveryDate:'20260705',requiredDate:'',deliveryDate2:'',price:12.00,totalValue:300,applicant:'王海涛',isSettled:'N',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:60,matCode:'60001274',shortText:'气管直通变径接头-PG8-6-接头φP15mm-接头总长39.5mm', reqQty:35,unit:'个',orderQty:0,deliveryDate:'20260705',requiredDate:'',deliveryDate2:'',price:6.50,totalValue:227.50,applicant:'王海涛',isSettled:'N',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:70,matCode:'60001122',shortText:'不锈钢快装直通过滤器-20"226-插口(K50.5)-304不锈钢-226', reqQty:5,unit:'个',orderQty:0,deliveryDate:'20260705',requiredDate:'',deliveryDate2:'',price:350.00,totalValue:1750,applicant:'王海涛',isSettled:'N',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:80,matCode:'60001112',shortText:'Y型过滤器滤网-长460mm*宽18mm-材质:304不锈钢-DN15', reqQty:10,unit:'个',orderQty:0,deliveryDate:'20260705',requiredDate:'',deliveryDate2:'',price:65.00,totalValue:650,applicant:'王海涛',isSettled:'N',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''}
    ]
  },
  {
    docNo:'2100003509', applyDate:'2026-05-22', plant:'2013 - 杨凌步长制药工厂', dept:'质量部',notes:'需提供第三方检定证书',
    purchaseType:'Z01',
    lines:[
      {itemNo:10,matCode:'60001207',shortText:'砝码-F1等级 1000g', reqQty:2,unit:'个',orderQty:2,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:680.00,totalValue:1360,applicant:'赵雪梅',poNo:'4100015400',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:20,matCode:'60001202',shortText:'温湿度计-GJWS-A1', reqQty:5,unit:'个',orderQty:5,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:85.00,totalValue:425,applicant:'赵雪梅',poNo:'4100015400',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:30,matCode:'60001294',shortText:'电子数显温湿度表-黑白色-带背光', reqQty:8,unit:'个',orderQty:8,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:68.00,totalValue:544,applicant:'赵雪梅',poNo:'4100015400',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:40,matCode:'60001229',shortText:'仪表加温度探头', reqQty:4,unit:'个',orderQty:4,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:350.00,totalValue:1400,applicant:'赵雪梅',poNo:'4100015400',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:50,matCode:'60001259',shortText:'红外测温仪--50~600℃', reqQty:2,unit:'个',orderQty:2,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:420.00,totalValue:840,applicant:'赵雪梅',poNo:'4100015400',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''}
    ]
  },
  {
    docNo:'2100003600', applyDate:'2026-05-24', plant:'2005 - 通化谷红制药工厂', dept:'生产部',notes:'需食品级硅胶/PTFE材质',
    purchaseType:'Z01',
    lines:[
      {itemNo:10,matCode:'60001154',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径25*内径9', reqQty:100,unit:'个',orderQty:100,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:3.50,totalValue:350,applicant:'陈永刚',poNo:'4100017892',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:20,matCode:'60001155',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径25*内径16', reqQty:100,unit:'个',orderQty:100,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:4.00,totalValue:400,applicant:'陈永刚',poNo:'4100017892',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:30,matCode:'60001156',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径34*内径19', reqQty:80,unit:'个',orderQty:80,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:5.50,totalValue:440,applicant:'陈永刚',poNo:'4100017892',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:40,matCode:'60001157',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径40*内径25', reqQty:80,unit:'个',orderQty:80,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:6.00,totalValue:480,applicant:'陈永刚',poNo:'4100017892',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:50,matCode:'60001158',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径50.5*内径22', reqQty:60,unit:'个',orderQty:60,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:7.50,totalValue:450,applicant:'陈永刚',poNo:'4100017892',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:60,matCode:'60001159',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径50.5*内径29', reqQty:60,unit:'个',orderQty:0,deliveryDate:'20260620',requiredDate:'',deliveryDate2:'',price:8.00,totalValue:480,applicant:'陈永刚',isSettled:'N',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:70,matCode:'60001160',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径50.5*内径35', reqQty:60,unit:'个',orderQty:0,deliveryDate:'20260620',requiredDate:'',deliveryDate2:'',price:8.50,totalValue:510,applicant:'陈永刚',isSettled:'N',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:80,matCode:'60001104',shortText:'卡盘垫片-尺寸:4″-PTFE-卡盘外径:119mm-卡盘内径:97.4mm', reqQty:30,unit:'个',orderQty:0,deliveryDate:'20260620',requiredDate:'',deliveryDate2:'',price:18.00,totalValue:540,applicant:'陈永刚',isSettled:'N',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:90,matCode:'60001151',shortText:'氟橡胶垫片FKM-材质:氟胶-尺寸:外径50.5*内径23.5', reqQty:40,unit:'个',orderQty:0,deliveryDate:'20260620',requiredDate:'',deliveryDate2:'',price:6.00,totalValue:240,applicant:'陈永刚',isSettled:'N',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:100,matCode:'60001152',shortText:'氟橡胶垫片FKM-材质:氟胶-尺寸:外径50.5*内径30', reqQty:40,unit:'个',orderQty:0,deliveryDate:'20260620',requiredDate:'',deliveryDate2:'',price:6.50,totalValue:260,applicant:'陈永刚',isSettled:'N',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''}
    ]
  },
  {
    docNo:'2100003701', applyDate:'2026-05-26', plant:'2012 - 陕西步长高新制药工厂', dept:'设备部',notes:'部分压力表损坏需更换',
    purchaseType:'Z01',
    lines:[
      {itemNo:10,matCode:'60001281',shortText:'压力表-0-2.5MPa', reqQty:15,unit:'个',orderQty:15,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:85.00,totalValue:1275,applicant:'刘志强',poNo:'4100018125',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:20,matCode:'60001282',shortText:'压力表-0-40', reqQty:10,unit:'个',orderQty:10,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:75.00,totalValue:750,applicant:'刘志强',poNo:'4100018125',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:30,matCode:'60001283',shortText:'压力表-0-1.6MPa', reqQty:12,unit:'个',orderQty:12,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:78.00,totalValue:936,applicant:'刘志强',poNo:'4100018125',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:40,matCode:'60001284',shortText:'压力表-0-1MPa', reqQty:12,unit:'个',orderQty:12,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:78.00,totalValue:936,applicant:'刘志强',poNo:'4100018125',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''}
    ]
  },
  // Z02 demo entries (费用性采购申请 - 无物料号)
  {
    docNo:'2100003802', applyDate:'2026-05-28', plant:'1000 - 山东步长制药工厂', dept:'设备部',
    notes:'需提供节能方案报告',
    purchaseType:'Z02',
    lines:[
      {itemNo:10,matCode:'',shortText:'空调节能改造技术方案咨询-现场勘查与方案设计', reqQty:1,unit:'个',orderQty:1,deliveryDate:'20260715',requiredDate:'20260630',deliveryDate2:'20260715',price:28000.00,totalValue:28000,applicant:'李君',poNo:'4100019001',status:'N',acctAssCategory:'K',matGroup:'608',storageLocation:'',costCenter:'100401'},
      {itemNo:20,matCode:'',shortText:'节能方案实施监理服务-全过程监理', reqQty:1,unit:'个',orderQty:1,deliveryDate:'20260801',requiredDate:'20260715',deliveryDate2:'20260801',price:15000.00,totalValue:15000,applicant:'李君',poNo:'4100019001',status:'N',acctAssCategory:'K',matGroup:'608',storageLocation:'',costCenter:'100401'}
    ]
  },
  {
    docNo:'2100003903', applyDate:'2026-06-02', plant:'2001 - 陕西步长制药工厂', dept:'质量部',
    notes:'需具备CMA/CNAS资质',
    purchaseType:'Z02',
    lines:[
      {itemNo:10,matCode:'',shortText:'高效液相色谱柱清洗与维护服务-安捷伦1260系列全年维护', reqQty:1,unit:'套',orderQty:1,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:12000.00,totalValue:12000,applicant:'赵雪梅',poNo:'4100019002',status:'N',acctAssCategory:'K',matGroup:'606',storageLocation:'',costCenter:'100601'},
      {itemNo:20,matCode:'',shortText:'实验室废弃物处理服务-化学废液/废试剂瓶合规处置', reqQty:12,unit:'次',orderQty:12,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:3500.00,totalValue:42000,applicant:'赵雪梅',poNo:'4100019002',status:'N',acctAssCategory:'K',matGroup:'606',storageLocation:'',costCenter:'100601'},
      {itemNo:30,matCode:'',shortText:'仪器校准服务-30台分析仪器年度校准', reqQty:1,unit:'批',orderQty:1,deliveryDate:'20260715',requiredDate:'20260630',deliveryDate2:'20260715',price:25000.00,totalValue:25000,applicant:'赵雪梅',poNo:'4100019002',status:'N',acctAssCategory:'K',matGroup:'603',storageLocation:'',costCenter:'100601'}
    ]
  },
  {
    docNo:'2100004004', applyDate:'2026-06-05', plant:'2010 - 保定天浩制药工厂', dept:'生产部',
    notes:'需有制药企业服务经验',
    purchaseType:'Z02',
    lines:[
      {itemNo:10,matCode:'',shortText:'洁净区专业保洁服务-洁净区2000㎡月度保洁', reqQty:6,unit:'次',orderQty:6,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:8600.00,totalValue:51600,applicant:'陈永刚',poNo:'4100019003',status:'N',acctAssCategory:'K',matGroup:'608',storageLocation:'',costCenter:'100401'},
      {itemNo:20,matCode:'',shortText:'GMP安全生产培训-全员培训含考核认证', reqQty:1,unit:'批',orderQty:1,deliveryDate:'20260715',requiredDate:'20260630',deliveryDate2:'20260715',price:18000.00,totalValue:18000,applicant:'陈永刚',poNo:'4100019003',status:'N',acctAssCategory:'K',matGroup:'608',storageLocation:'',costCenter:'100501'}
    ]
  }
];
