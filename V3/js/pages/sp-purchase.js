// ===== Spare Parts Purchase Requisition Page =====

// ---- 配置常量 ----
const PURCHASE_TYPE_OPTIONS = [
  { value: 'Z01', label: 'Z01-生产性采购申请' },
  { value: 'Z02', label: 'Z02-非生产性采购申请' }
];
const ACCT_ASS_CATEGORY_OPTIONS = [
  { value: 'K', label: 'K-成本中心' }
  // 预留扩展
];
const COST_CENTER_OPTIONS = [
  { value: '100101', label: '100101-生产设备成本中心' },
  { value: '100201', label: '100201-质量检测成本中心' },
  { value: '100301', label: '100301-生产能耗成本中心' },
  { value: '100401', label: '100401-维修保养成本中心' },
  { value: '100501', label: '100501-行政管理成本中心' },
  { value: '100601', label: '100601-研发试制成本中心' }
];
const PURCHASE_GROUP_OPTIONS = [
  { value: 'Z001', label: '原辅包采购组' },
  { value: 'Z002', label: '非生产型采购组' },
  { value: 'Z003', label: '费用化采购组' }
];
const MAT_GROUP_OPTIONS = [
  { value: '600', label: '600-过滤器类' },
  { value: '601', label: '601-密封件类' },
  { value: '602', label: '602-接头管件类' },
  { value: '603', label: '603-仪表仪器类' },
  { value: '604', label: '604-电器类' },
  { value: '605', label: '605-不锈钢制品类' },
  { value: '606', label: '606-实验室用品类' },
  { value: '607', label: '607-通用工具类' },
  { value: '608', label: '608-备品备件类' }
];

// ---- 物料主数据 Mock（供 Z01 自动带出用）----
const materialMasterMock = [
  { matCode: '60001018', shortText: '高效过滤器-MIIPDF-635*520*93-27-AAF', matGroup: '600', storageLocation: 'A01', price: 850.00 },
  { matCode: '60001019', shortText: '高效过滤器-MIIPDF-635*762*93-27-AAF', matGroup: '600', storageLocation: 'A01', price: 920.00 },
  { matCode: '60001020', shortText: '高效过滤器-MIIPDF-416*416*93-27-AAF', matGroup: '600', storageLocation: 'A02', price: 680.00 },
  { matCode: '60001021', shortText: '高效过滤器-MIIPDF-635*1030*93-27-AAF', matGroup: '600', storageLocation: 'A01', price: 1050.00 },
  { matCode: '60001022', shortText: '高效过滤器-GSF-LS-631*516*95-01/22-康斐尔', matGroup: '600', storageLocation: 'A01', price: 750.00 },
  { matCode: '60001023', shortText: '高效过滤器-GSF-LS-631*758*95-01/22-康斐尔', matGroup: '600', storageLocation: 'A01', price: 820.00 },
  { matCode: '60001024', shortText: '高效过滤器-GSF-LS-412*412*95-01/22-康斐尔', matGroup: '600', storageLocation: 'A02', price: 620.00 },
  { matCode: '60001025', shortText: '高效过滤器-GSF-LS-1026*631*95-01/22-康斐尔', matGroup: '600', storageLocation: 'A01', price: 1100.00 },
  { matCode: '60001026', shortText: '高效过滤器-GSF-LS-762*631*95-01/22-康斐尔', matGroup: '600', storageLocation: 'A01', price: 960.00 },
  { matCode: '60001012', shortText: '耐湿高效过滤器-GKYS-305*30*150', matGroup: '600', storageLocation: 'A02', price: 580.00 },
  { matCode: '60001086', shortText: 'O型圈-Φ360*5.7-材质:氟橡胶', matGroup: '601', storageLocation: 'B01', price: 65.00 },
  { matCode: '60001087', shortText: 'O型圈-Φ506*6.99-材质:氟橡胶', matGroup: '601', storageLocation: 'B01', price: 85.00 },
  { matCode: '60001088', shortText: 'O型圈-Φ399.5*8.4-材质:氟橡胶', matGroup: '601', storageLocation: 'B01', price: 78.00 },
  { matCode: '60001089', shortText: 'O型圈-Φ44*3-材质:氟橡胶', matGroup: '601', storageLocation: 'B02', price: 8.00 },
  { matCode: '60001090', shortText: 'O型圈-Φ13.94*2.62-材质:氟橡胶', matGroup: '601', storageLocation: 'B02', price: 3.50 },
  { matCode: '60001146', shortText: '隔膜阀膜片-尺寸:DN15-材质:PTFE/EPDM-宝帝', matGroup: '601', storageLocation: 'B03', price: 180.00 },
  { matCode: '60001147', shortText: '隔膜阀膜片-尺寸:DN25-材质:PTFE/EPDM-宝帝', matGroup: '601', storageLocation: 'B03', price: 220.00 },
  { matCode: '60000655', shortText: 'LED灯泡-30W', matGroup: '604', storageLocation: 'C01', price: 25.00 },
  { matCode: '60000656', shortText: 'LED灯泡-60W', matGroup: '604', storageLocation: 'C01', price: 35.00 },
  { matCode: '60000657', shortText: 'LED灯泡-100W', matGroup: '604', storageLocation: 'C01', price: 45.00 },
  { matCode: '60001128', shortText: '初效过滤器-592*592*360-G4-袋式', matGroup: '600', storageLocation: 'A03', price: 95.00 },
  { matCode: '60001129', shortText: '初效过滤器-286*592*360-G4-袋式', matGroup: '600', storageLocation: 'A03', price: 75.00 },
  { matCode: '60001131', shortText: '初效过滤器-286*286*360-G4-袋式', matGroup: '600', storageLocation: 'A03', price: 55.00 },
  { matCode: '60001132', shortText: '中效过滤器-592*592*600-M5-袋式', matGroup: '600', storageLocation: 'A04', price: 120.00 },
  { matCode: '60001238', shortText: '宝塔式气路接头-管子直径10mm-螺纹口1/4', matGroup: '602', storageLocation: 'D01', price: 8.00 },
  { matCode: '60001271', shortText: '304不锈钢培养皿架-90mm培养皿-放40个-带可翻转提手', matGroup: '605', storageLocation: 'E01', price: 380.00 },
  { matCode: '60001272', shortText: '304不锈钢培养皿架-90mm培养皿-放80个-带可翻转提手', matGroup: '605', storageLocation: 'E01', price: 520.00 },
  { matCode: '60001249', shortText: '宝塔头-外径25mm-内径9.6mm-30700-60', matGroup: '602', storageLocation: 'D02', price: 18.00 },
  { matCode: '60001207', shortText: '砝码-F1等级 1000g', matGroup: '603', storageLocation: 'F01', price: 680.00 },
  { matCode: '60001281', shortText: '压力表-0-2.5MPa', matGroup: '603', storageLocation: 'F02', price: 85.00 }
];

const SpPurchase = {
  page: 1, pageSize: 20, flatRows: [],
  viewMode: 'doc', // 'doc' = 按申请单聚合, 'line' = 平铺行项目
  docRows: [], filteredDocs: [],
  editMode: false, editId: null,

  // Aggregate data: one row per purchase requisition document
  aggregateData() {
    return spPurchaseData.map(pr => {
      const lineCount = pr.lines ? pr.lines.length : 0;
      const totalValue = pr.lines ? pr.lines.reduce((s, l) => s + (l.totalValue || 0), 0) : 0;
      const statuses = pr.lines ? [...new Set(pr.lines.map(l => l.status).filter(Boolean))] : [];
      let statusLabel = 'N-未编辑';
      if (statuses.includes('B')) statusLabel = 'B-已创建采购订单';
      return {
        docNo: pr.docNo, plant: pr.plant, dept: pr.dept,
        applyDate: pr.applyDate, notes: pr.notes || '',
        lineCount, totalValue, statusLabel,
        statuses, _pr: pr
      };
    });
  },

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
          orderQty: line.orderQty || 0, deliveryDate: line.deliveryDate || '',
          applicant: line.applicant || '', poNo: line.poNo || '',
          requiredDate: line.requiredDate || '',
          deliveryDate2: line.deliveryDate2 || '',
          price: line.price || 0, totalValue: line.totalValue || 0,
          plant: pr.plant, dept: pr.dept, status: line.status || 'N',
          applyDate: pr.applyDate, notes: pr.notes || ''
        });
      });
    });
    return rows;
  },

  render() {
    // Prepare data for both views
    this.flatRows = this.flattenData();
    this.docRows = this.aggregateData();
    if (this.viewMode === 'doc') {
      this.filteredDocs = [...this.docRows];
    } else {
      this.filteredFlat = [...this.flatRows];
    }
    this.page = 1;

    const isDoc = this.viewMode === 'doc';
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">采购申请提报</div><div style="font-size:13px;opacity:0.8;">支持手工填写和模板批导两种方式创建采购申请</div></div>
          <div style="display:flex;gap:8px;align-items:center;">
            <div style="display:flex;gap:2px;background:rgba(255,255,255,0.18);border-radius:8px;padding:3px;">
              <button class="btn btn-sm" style="border-radius:6px;padding:5px 14px;font-size:12px;${isDoc?'background:white;color:var(--primary);font-weight:700;':'background:transparent;color:rgba(255,255,255,0.85);'}" onclick="SpPurchase.switchView('doc')">按申请单</button>
              <button class="btn btn-sm" style="border-radius:6px;padding:5px 14px;font-size:12px;${!isDoc?'background:white;color:var(--primary);font-weight:700;':'background:transparent;color:rgba(255,255,255,0.85);'}" onclick="SpPurchase.switchView('line')">行项目视图</button>
            </div>
            <button class="btn btn-blue" onclick="SpPurchase.openNewModal()"><span style="font-weight:700;font-size:16px;">+</span> 新建申请</button>
          </div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>采购申请</label><input type="text" id="prDocNo" placeholder="申请编号"></div>
          <div class="filter-group"><label>申请部门</label><select id="prDept">
            <option value="">全部</option>
            <option value="生产部">生产部</option>
            <option value="设备部">设备部</option>
            <option value="质量部">质量部</option>
            <option value="仓储物流部">仓储物流部</option>
          </select></div>
          <div class="filter-group"><label>状态</label><select id="prStatus">
            <option value="">全部</option>
            <option value="B">B-已创建采购订单</option>
            <option value="N">N-未编辑</option>
          </select></div>
          ${isDoc ? '' : '<div class="filter-group"><label>物料号</label><input type="text" id="prMatCode" placeholder="物料号"></div>'}
          <div class="filter-group"><label>申请日期</label><input type="date" id="prDateFrom" style="padding:6px 10px;"></div>
          <div class="filter-group"><label>至</label><input type="date" id="prDateTo" style="padding:6px 10px;"></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="SpPurchase.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="SpPurchase.reset()">重置</button>
            <button class="btn btn-outline btn-sm" onclick="SpPurchase.printList()">打印</button>
            <button class="btn btn-outline btn-sm" onclick="SpPurchase.exportData()">导出</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table" style="min-width:${isDoc ? '900px' : '1400px'};">
            <thead><tr>
              ${isDoc ? `
              <th>采购申请</th><th>工厂</th><th>部门</th><th style="width:72px;text-align:center;">状态</th><th style="text-align:center;">行项目</th><th style="text-align:right;">总金额</th><th>申请日期</th><th style="width:160px;">操作</th>
              ` : `
              <th>工厂</th><th>采购申请</th><th style="width:55px;text-align:center;">请求<br/>项目</th>
              <th>物料</th><th>短文本</th><th style="text-align:right;">申请数量</th><th style="width:38px;">单位</th>
              <th style="text-align:right;">订货数量</th><th style="width:72px;text-align:center;">状态</th><th>交货日期</th><th>申请人</th>
              <th>需求日期</th><th>交货日期</th><th style="text-align:right;">评价价格</th><th style="text-align:right;font-weight:800;color:var(--danger);">总价值</th>
              <th style="width:90px;">操作</th>
              `}
            </tr></thead>
            <tbody id="prTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info">
            <span class="list-count" id="prCount">${isDoc ? `共 ${this.docRows.length} 张申请单` : `共 ${this.flatRows.length} 行`}</span>
            <span style="color:var(--text-muted);font-size:12px;">${isDoc ? '' : `(共 ${spPurchaseData.length} 张申请单)`}</span>
          </div>
          <div class="pagination">
            <button class="pagination-btn" id="prPrev" disabled onclick="SpPurchase.prevPage()">‹</button>
            <span class="pagination-info" id="prPageInfo">第 ${this.page} / ${Math.ceil(Math.max((isDoc ? this.docRows.length : this.flatRows.length),1)/this.pageSize)} 页</span>
            <button class="pagination-btn" id="prNext" onclick="SpPurchase.nextPage()">›</button>
            <select class="page-size-select" id="prPageSizeSel" onchange="SpPurchase.changePageSize()"><option value="20">20条</option><option value="40">40条</option><option value="80">80条</option></select>
          </div>
        </div>
      </div>
      <div id="prModalContainer"></div>`;
  },

  init() {
    this.flatRows = this.flattenData();
    this.docRows = this.aggregateData();
    this.filteredFlat = [...this.flatRows];
    this.filteredDocs = [...this.docRows];
    this.page = 1;
    // Full render: the caller should set innerHTML of the container to this.render()
    // For backward compatibility, if table body already exists, just render table
    if (document.getElementById('prTableBody')) {
      this.renderTable();
    }
  },

  renderTable() {
    const isDoc = this.viewMode === 'doc';
    if (isDoc) {
      this._renderDocTable();
    } else {
      this._renderLineTable();
    }
  },

  _renderDocTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filteredDocs.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filteredDocs.length / this.pageSize) || 1;
    const countEl = document.getElementById('prCount');
    if (countEl) countEl.textContent = `共 ${this.filteredDocs.length} 张申请单`;
    const pageInfo = document.getElementById('prPageInfo');
    if (pageInfo) pageInfo.textContent = `第 ${this.page} / ${totalPages} 页`;
    const prevBtn = document.getElementById('prPrev');
    if (prevBtn) prevBtn.disabled = this.page <= 1;
    const nextBtn = document.getElementById('prNext');
    if (nextBtn) nextBtn.disabled = this.page >= totalPages;
    const sizeSel = document.getElementById('prPageSizeSel');
    if (sizeSel) sizeSel.value = this.pageSize;

    const statusBadge = label => {
      const map = { 'B-已创建采购订单':'badge-green','N-未编辑':'badge-gray' };
      return `<span class="badge ${map[label]||'badge-gray'}">${esc(label)}</span>`;
    };

    document.getElementById('prTableBody').innerHTML = page.map(doc => `
      <tr style="cursor:pointer;" ondblclick="SpPurchase.viewDetail('${doc.docNo}')">
        <td><strong style="color:var(--primary);">${esc(doc.docNo)}</strong></td>
        <td style="white-space:nowrap;">${esc(doc.plant)}</td>
        <td>${esc(doc.dept)}</td>
        <td style="text-align:center;white-space:nowrap;">${statusBadge(doc.statusLabel)}</td>
        <td style="text-align:center;font-weight:600;">${doc.lineCount}</td>
        <td style="text-align:right;font-weight:700;color:var(--danger);">¥ ${Number(doc.totalValue).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
        <td style="white-space:nowrap;">${esc(doc.applyDate)}</td>
        <td>
          <button class="btn btn-blue btn-sm" onclick="SpPurchase.viewDetail('${doc.docNo}')">查看</button>
        </td>
      </tr>`).join('');
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

    const statusBadge = s => {
      const map = { 'B':'badge-green','N':'badge-gray' };
      const label = { 'B':'B-已创建采购订单','N':'N-未编辑' };
      return `<span class="badge ${map[s]||'badge-gray'}">${esc(label[s]||s)}</span>`;
    };

    let lastDoc = '';
    document.getElementById('prTableBody').innerHTML = page.map(row => {
      const isNewGroup = row.docNo !== lastDoc;
      lastDoc = row.docNo;
      let actions = '';
      if (isNewGroup) {
        actions += `<button class="btn btn-blue btn-sm" onclick="SpPurchase.viewDetail('${row.docNo}')">查看</button>`;
      }
      return `<tr>
        <td style="white-space:nowrap;">${isNewGroup ? esc(row.plant) : ''}</td>
        <td><strong style="color:var(--primary);">${isNewGroup ? esc(row.docNo) : ''}</strong></td>
        <td style="text-align:center;font-weight:600;">${row.itemNo}</td>
        <td><strong>${esc(row.matCode)}</strong></td>
        <td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(row.shortText)}">${esc(row.shortText)}</td>
        <td style="text-align:right;">${Number(row.reqQty).toLocaleString()}</td>
        <td style="text-align:center;">${esc(row.unit)}</td>
        <td style="text-align:right;color:var(--text-secondary);">${Number(row.orderQty).toLocaleString()}</td>
        <td style="text-align:center;white-space:nowrap;">${statusBadge(row.status)}</td>
        <td style="white-space:nowrap;">${esc(row.deliveryDate)}</td>
        <td>${esc(row.applicant)}</td>
        <td style="white-space:nowrap;">${esc(row.requiredDate)}</td>
        <td style="white-space:nowrap;">${esc(row.deliveryDate2)}</td>
        <td style="text-align:right;">${Number(row.price).toFixed(2)}</td>
        <td style="text-align:right;font-weight:700;color:var(--danger);">${Number(row.totalValue).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
        <td>${actions}</td>
      </tr>`;
    }).join('');
  },

  switchView(mode) {
    if (this.viewMode === mode) return;
    this.viewMode = mode;
    this.page = 1;
    if (mode === 'doc') {
      this.docRows = this.aggregateData();
      this.filteredDocs = [...this.docRows];
    } else {
      this.flatRows = this.flattenData();
      this.filteredFlat = [...this.flatRows];
    }
    // Re-render the whole page in contentArea
    const container = document.getElementById('contentArea');
    if (container) {
      container.innerHTML = this.render();
      this.renderTable();
    }
  },

  search() {
    const docNo = document.getElementById('prDocNo').value.trim();
    const dept = document.getElementById('prDept').value;
    const status = document.getElementById('prStatus').value;
    const matCode = document.getElementById('prMatCode') ? document.getElementById('prMatCode').value.trim() : '';
    const dateFrom = document.getElementById('prDateFrom').value;
    const dateTo = document.getElementById('prDateTo').value;

    if (this.viewMode === 'doc') {
      this.filteredDocs = this.docRows.filter(doc => {
        if (docNo && !doc.docNo.includes(docNo)) return false;
        if (dept && doc.dept !== dept) return false;
        if (status && !doc.statuses.includes(status)) return false;
        if (dateFrom && doc.applyDate < dateFrom) return false;
        if (dateTo && doc.applyDate > dateTo) return false;
        return true;
      });
    } else {
      this.filteredFlat = this.flatRows.filter(row => {
        if (docNo && !row.docNo.includes(docNo)) return false;
        if (dept && row.dept !== dept) return false;
        if (status && row.status !== status) return false;
        if (matCode && !(row.matCode||'').includes(matCode)) return false;
        if (dateFrom && row.applyDate < dateFrom) return false;
        if (dateTo && row.applyDate > dateTo) return false;
        return true;
      });
    }
    this.page = 1;
    this.renderTable();
  },

  reset() {
    document.getElementById('prDocNo').value = '';
    document.getElementById('prDept').value = '';
    document.getElementById('prStatus').value = '';
    if (document.getElementById('prMatCode')) document.getElementById('prMatCode').value = '';
    document.getElementById('prDateFrom').value = '';
    document.getElementById('prDateTo').value = '';
    if (this.viewMode === 'doc') {
      this.filteredDocs = [...this.docRows];
    } else {
      this.filteredFlat = [...this.flatRows];
    }
    this.page = 1;
    this.renderTable();
  },

  prevPage() {
    if (this.page > 1) { this.page--; this.renderTable(); }
  },
  nextPage() {
    const total = this.viewMode === 'doc' ? this.filteredDocs.length : this.filteredFlat.length;
    const tp = Math.ceil(total / this.pageSize) || 1;
    if (this.page < tp) { this.page++; this.renderTable(); }
  },
  changePageSize() {
    this.pageSize = parseInt(document.getElementById('prPageSizeSel').value);
    this.page = 1;
    this.renderTable();
  },

  // ---- 新建采购申请：选择创建方式弹窗（对齐维修工单风格）----
  openNewModal() {
    const body = `
    <div style="padding:4px 0;">
      <div style="font-size:14px;color:var(--text-secondary);margin-bottom:16px;text-align:center;">
        请选择一种方式创建采购申请
      </div>

      <!-- 1×2 网格布局 -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">

        <!-- 卡片一：手工填写 -->
        <div onclick="closeModal();SpPurchase.openManualForm()"
          style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #bfdbfe;border-radius:12px;padding:20px 16px;cursor:pointer;transition:all .22s;text-align:center;"
          onmouseenter="this.style.borderColor='#3b82f6';this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(59,130,246,.15)'"
          onmouseleave="this.style.borderColor='#bfdbfe';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:36px;margin-bottom:8px;">📝</div>
          <div style="font-size:15px;font-weight:700;color:#1e40af;margin-bottom:4px;">手工填写</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.45;">逐项填写物料信息，适合单次少量采购申请</div>
          <div style="margin-top:12px;"><span class="badge badge-blue" style="padding:5px 16px;border-radius:16px;font-size:12px;cursor:pointer;">开始填写 →</span></div>
        </div>

        <!-- 卡片二：模板批导 -->
        <div onclick="closeModal();SpPurchase.openBatchImportModal()"
          style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #86efac;border-radius:12px;padding:20px 16px;cursor:pointer;transition:all .22s;text-align:center;"
          onmouseenter="this.style.borderColor='#10b981';this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(16,185,129,.15)'"
          onmouseleave="this.style.borderColor='#86efac';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:36px;margin-bottom:8px;">📋</div>
          <div style="font-size:15px;font-weight:700;color:#065f46;margin-bottom:4px;">模板批导</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.45;">下载模板批量填写后上传，适合大批量采购申请</div>
          <div style="margin-top:12px;"><span class="badge" style="padding:5px 16px;border-radius:16px;font-size:12px;background:#10b981;color:#fff;cursor:pointer;">开始批导 →</span></div>
        </div>

      </div>

      <div style="margin-top:14px;padding:8px 12px;background:#f9fafb;border-radius:8px;font-size:12px;color:var(--text-muted);text-align:center;border:1px dashed var(--border);">
        💡 提示：也可从已有采购申请复制创建
      </div>
    </div>`;

    showModal('📌 选择创建方式', body, [
      { text: '取消', cls: 'btn-secondary', action: closeModal }
    ], 'modal-xl');
  },

  // ---- 手工填写表单（原逻辑）----
  openManualForm() {
    this.editMode = false;
    this.editId = null;
    this._batchImport = false;
    const emptyPr = {
      docNo: '', applyDate: new Date().toISOString().slice(0,10),
      plant: '1000', dept: '',
      notes: '',
      purchaseType: 'Z01', purchaseGroup: '',
      lines: [{ itemNo:10, matCode:'', shortText:'', applicant:window.currentUserId||'admin', poNo:'', reqQty:'', unit:'个', orderQty:0, deliveryDate:'', requiredDate:'', deliveryDate2:'', price:0, totalValue:0, status:'N', acctAssCategory:'', matGroup:'', storageLocation:'', costCenter:'' }]
    };
    document.getElementById('prModalContainer').innerHTML = this.getFormModalHTML(emptyPr);
  },

  // ---- 模板批导弹框 ----
  openBatchImportModal() {
    this._batchImport = true;
    this._batchRawData = [];
    document.getElementById('prModalContainer').innerHTML = `
      <div class="modal-backdrop" onclick="SpPurchase.closeModal()">
        <div class="modal" style="max-width:960px;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">模板批导 - 批量导入采购申请</div>
            <button class="modal-close" onclick="SpPurchase.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:calc(85vh-140px);">
            <!-- Step 1: 下载模板并填写 -->
            <div class="form-section">
              <div class="form-section-title">第一步：下载模板并填写</div>
              <div style="display:flex;align-items:center;gap:12px;padding:12px 0;">
                <button class="btn btn-primary" onclick="SpPurchase.downloadTemplate()" style="display:flex;align-items:center;gap:6px;">
                  <span style="font-size:18px;">⬇</span> 下载CSV模板
                </button>
                <span style="font-size:12px;color:var(--text-muted);">模板包含表头行和示例，请严格按照模板格式填写数据</span>
              </div>
            </div>

            <!-- Step 2: 上传文件 -->
            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">第二步：上传填好的文件</div>
              <div id="batchUploadArea" style="border:2px dashed var(--border);border-radius:10px;padding:28px;text-align:center;cursor:pointer;transition:all 0.2s;"
                onclick="document.getElementById('batchFileInput').click()"
                ondragover="this.style.borderColor='var(--primary)';this.style.background='#eff6ff';"
                ondragleave="this.style.borderColor='var(--border)';this.style.background='transparent';"
                ondrop="event.preventDefault();this.style.borderColor='var(--border)';this.style.background='transparent';SpPurchase.handleBatchFileDrop(event)">
                <div style="font-size:40px;margin-bottom:8px;">📂</div>
                <div style="font-weight:600;color:var(--text-primary);">点击选择文件或拖拽文件到此处</div>
                <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">支持 .csv 文件，编码 UTF-8</div>
                <input type="file" id="batchFileInput" accept=".csv" style="display:none;" onchange="SpPurchase.handleBatchFileSelect(event)">
              </div>
              <div id="batchUploadInfo" style="margin-top:10px;font-size:13px;"></div>
            </div>

            <!-- Step 3: 预览数据 -->
            <div id="batchPreviewSection" class="form-section" style="margin-top:14px;display:none;">
              <div class="form-section-title">第三步：预览数据（共 <span id="batchRowCount">0</span> 行）</div>
              <div style="overflow-x:auto;max-height:320px;">
                <table class="data-table" style="min-width:900px;font-size:12px;">
                  <thead><tr>
                    <th>#</th><th>物料</th><th>短文本</th><th>申请人</th><th style="text-align:right;">数量</th><th>单位</th>
                    <th>交货日期</th><th>需求日期</th><th style="text-align:right;">价格</th>
                    <th style="text-align:right;">总价值</th>
                  </tr></thead>
                  <tbody id="batchPreviewBody"></tbody>
                </table>
              </div>
            </div>

            <!-- 表头信息 -->
            <div class="form-section" style="margin-top:14px;">
              <div class="form-section-title">表头信息（统一应用于所有行）</div>
              <div class="form-grid">
                <div class="form-group"><label><span class="req">*</span> 部门</label><select id="prFDept"><option value="">请选择</option><option value="设备部">设备部</option><option value="生产部">生产部</option><option value="质量部">质量部</option><option value="仓储物流部">仓储物流部</option></select></div>
                <div class="form-group"><label>工厂</label><select id="prFPlant">
                  <option value="1000">1000 - 山东步长制药工厂</option>
                  <option value="2001">2001 - 陕西步长制药工厂</option>
                  <option value="2002">2002 - 山东丹红制药工厂</option>
                  <option value="2003">2003 - 山东神州制药工厂</option>
                  <option value="2004">2004 - 山东康爱制药工厂</option>
                  <option value="2005">2005 - 通化谷红制药工厂</option>
                  <option value="2006">2006 - 吉林天成制药工厂</option>
                  <option value="2007">2007 - 通化天实制药工厂</option>
                  <option value="2008">2008 - 梅河口步长制药工厂</option>
                  <option value="2009">2009 - 辽宁奥达制药工厂</option>
                  <option value="2010">2010 - 保定天浩制药工厂</option>
                  <option value="2011">2011 - 邛崃天银制药工厂</option>
                  <option value="2012">2012 - 陕西步长高新制药工厂</option>
                  <option value="2013">2013 - 杨凌步长制药工厂</option>
                </select></div>
                <div class="form-group"><label>申请日期</label><input type="date" id="prFApplyDate" value="${new Date().toISOString().slice(0,10)}"></div>

              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="SpPurchase.closeModal()">取消</button>
            <button class="btn btn-primary" id="batchSubmitBtn" disabled onclick="SpPurchase.submitBatchImport()">确认导入</button>
          </div>
        </div>
      </div>`;
  },

  openEditModal(docNo) {
    const pr = spPurchaseData.find(r => r.docNo === docNo);
    if (!pr) return;
    this.editMode = true;
    this.editId = docNo;
    document.getElementById('prModalContainer').innerHTML = this.getFormModalHTML(JSON.parse(JSON.stringify(pr)));
    // Trigger type change to set proper field state
    setTimeout(() => this.onPurchaseTypeChange(), 50);
  },

  // ---- 下载CSV模板 ----
  downloadTemplate() {
    const headers = ['物料号','短文本(物料描述)','申请人','申请数量','单位','交货日期(YYYYMMDD)','需求日期(YYYY.MM.DD)','评价价格'];
    const exampleRow = ['60001018','高效过滤器-MIIPDF-635*520*93','李君','48','个','20260715','2026.06.20','850.00'];
    const instructionsRow = ['# 说明：请保留表头行，按格式填写数据；物料号和申请人为必填；采购订单号由系统自动返回，无需填写；单位可选：个/KG/套/袋/件/台/支/桶/组/箱/卷/瓶/盒/方/张'];
    const csvContent = '\uFEFF' + [headers.join(','), exampleRow.join(','), instructionsRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '采购申请模板.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('模板已下载，请按格式填写后上传');
  },

  // ---- 文件拖拽处理 ----
  handleBatchFileDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) this._parseBatchCSV(file);
  },

  handleBatchFileSelect(e) {
    const file = e.target.files[0];
    if (file) this._parseBatchCSV(file);
    e.target.value = '';
  },

  // ---- 解析CSV文件 ----
  _parseBatchCSV(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(l => l.trim() && !l.trim().startsWith('#'));
      if (lines.length < 2) { toast('文件内容为空或格式不正确'); return; }

      const headers = this._parseCSVLine(lines[0]);
      if (headers.length < 8) { toast('表头列数与模板不符，请使用下载的模板'); return; }

      const dataRows = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = this._parseCSVLine(lines[i]);
        if (cols.length < 7) continue;
        const matCode = (cols[0] || '').trim();
        const shortText = (cols[1] || '').trim();
        const applicant = (cols[2] || '').trim();
        const reqQty = parseFloat(cols[3]) || 0;
        if (!matCode || !shortText || !applicant || reqQty <= 0) continue;
        const price = parseFloat(cols[7]) || 0;
        dataRows.push({
          matCode, shortText, applicant, poNo:'', reqQty,
          unit: (cols[4] || '个').trim(),
          deliveryDate: (cols[6] || '').trim(),
          requiredDate: (cols[7] || '').trim(),
          price, totalValue: reqQty * price
        });
      }

      if (!dataRows.length) { toast('未解析到有效数据行，请检查文件内容'); return; }

      this._batchRawData = dataRows;
      this._renderBatchPreview(dataRows);

      const info = document.getElementById('batchUploadInfo');
      if (info) info.innerHTML = '<span style="color:#16a34a;font-weight:600;">✅ 已成功解析 ' + dataRows.length + ' 行物料数据（文件名：' + esc(file.name) + '）</span>';
      const section = document.getElementById('batchPreviewSection');
      if (section) section.style.display = 'block';
      const btn = document.getElementById('batchSubmitBtn');
      if (btn) btn.disabled = false;
    };
    reader.readAsText(file, 'UTF-8');
  },

  _parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  },

  _renderBatchPreview(rows) {
    const tbody = document.getElementById('batchPreviewBody');
    const countEl = document.getElementById('batchRowCount');
    if (!tbody) return;
    if (countEl) countEl.textContent = rows.length;
    tbody.innerHTML = rows.map((r, i) => `<tr>
      <td style="text-align:center;">${i + 1}</td>
      <td><strong>${esc(r.matCode)}</strong></td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(r.shortText)}">${esc(r.shortText)}</td>
      <td>${esc(r.applicant)}</td>
      <td style="font-size:12px;color:var(--primary-lighter);">${esc(r.poNo)}</td>
      <td style="text-align:right;">${Number(r.reqQty).toLocaleString()}</td>
      <td style="text-align:center;">${esc(r.unit)}</td>
      <td style="white-space:nowrap;">${esc(r.deliveryDate || '-')}</td>
      <td style="white-space:nowrap;">${esc(r.requiredDate || '-')}</td>
      <td style="text-align:right;">${Number(r.price).toFixed(2)}</td>
      <td style="text-align:right;font-weight:700;color:var(--danger);">${Number(r.totalValue).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
    </tr>`).join('');
  },

  // ---- 批量导入提交 ----
  submitBatchImport() {
    const f = id => document.getElementById(id)?.value ?? '';
    const dept = f('prFDept');

    if (!dept) { toast('请填写必填字段：部门'); return; }
    if (!this._batchRawData || !this._batchRawData.length) { toast('未解析到物料数据，请先上传文件'); return; }

    const prData = {
      docNo: '21' + String(Math.floor(Math.random() * 900000000 + 100000000)),
      applyDate: f('prFApplyDate') || new Date().toISOString().slice(0, 10),
      plant: f('prFPlant') || '1000',
      dept,
      notes: '',
      purchaseType: 'Z01',
      purchaseGroup: 'Z001',
      lines: this._batchRawData.map((r, i) => ({
        itemNo: (i + 1) * 10,
        matCode: r.matCode,
        shortText: r.shortText,
        applicant: r.applicant,
        poNo: r.poNo,
        reqQty: r.reqQty,
        unit: r.unit,
        orderQty: r.reqQty,
        deliveryDate: r.deliveryDate,
        requiredDate: r.requiredDate,
        deliveryDate2: r.deliveryDate,
        price: r.price,
        totalValue: r.totalValue,
        status: 'N',
        acctAssCategory: '',
        matGroup: '',
        storageLocation: ''
      }))
    };

    spPurchaseData.unshift(prData);
    toast('批量导入成功！已创建采购申请 ' + prData.docNo + '（' + prData.lines.length + ' 行物料）');

    this.closeModal();
    this.flatRows = this.flattenData();
    this.filteredFlat = [...this.flatRows];
    this.page = 1;
    this.renderTable();
  },

  closeModal() { document.getElementById('prModalContainer').innerHTML = ''; },

  submitForm() {
    const f = id => document.getElementById(id)?.value ?? '';
    const purchaseType = f('prFPurchaseType') || 'Z01';
    const purchaseGroup = f('prFPurchaseGroup');
    const isZ01 = purchaseType === 'Z01';
    const isZ02 = purchaseType === 'Z02';

    // Header
    const prData = {
      docNo: this.editMode ? this.editId : ('21' + String(Math.floor(Math.random()*900000000+100000000))),
      applyDate: f('prFApplyDate'),
      plant: f('prFPlant'),
      dept: f('prFDept'),
      notes: f('prFNotes'),
      purchaseType,
      purchaseGroup,
      lines: []
    };

    if (!prData.dept) { toast('请填写必填字段：申请部门'); return; }
    if (!prData.purchaseGroup) { toast('请选择采购组'); return; }

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
      const applicant = getVal('applicant');
      const poNo = getVal('poNo');
      const q = parseFloat(getVal('reqQty')) || 0;
      const u = getSel('unit');
      const p = parseFloat(getVal('price')) || 0;
      const acct = getSel('acctAssCategory');
      const costCtr = getSel('costCenter');
      const mg = isZ01 ? row.querySelector('[data-field="matGroup"]')?.textContent?.trim() || '' : getSel('matGroup');

      // Skip empty rows
      if (!mc && !st && !q) continue;

      // Z01 validation
      if (isZ01) {
        if (!mc) { toast(`第 ${i+1} 行：物料号必填（Z01-生产性采购申请）`); return; }
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

      hasValidLine = true;
      prData.lines.push({
        itemNo: (i + 1) * 10,
        matCode: mc, shortText: st, applicant, poNo, reqQty: q, unit: u || '个',
        orderQty: parseFloat(getVal('orderQty')) || 0,
        deliveryDate: row.querySelector('input[placeholder="YYYYMMDD"]')?.value || '',
        requiredDate: row.querySelector('input[placeholder="YYYY.MM.DD"]')?.value || '',
        deliveryDate2: row.querySelectorAll('input[placeholder="YYYY.MM.DD"]')[1]?.value || '',
        price: p, totalValue: q * p, status: 'N',
        acctAssCategory: acct, matGroup: mg, storageLocation: '', costCenter: costCtr
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

  viewDetail(docNo) {
    const pr = spPurchaseData.find(r => r.docNo === docNo); if (!pr) return;
    const sb = s => {
      const m = { 'B':'badge-green','N':'badge-gray' };
      const label = { 'B':'B-已创建采购订单','N':'N-未编辑' };
      return `<span class="badge ${m[s]||'badge-gray'}">${esc(label[s]||s)}</span>`;
    };
    const ptLabel = PURCHASE_TYPE_OPTIONS.find(o=>o.value===pr.purchaseType);
    const pgLabel = PURCHASE_GROUP_OPTIONS.find(o=>o.value===pr.purchaseGroup);
    const isZ01 = pr.purchaseType === 'Z01';
    const isZ02 = pr.purchaseType === 'Z02';
    const grandTotal = pr.lines.reduce((s,l)=>s+(l.totalValue||0),0);
    const html = `
      <div class="modal-backdrop" id="prDetailBackdrop" onclick="SpPurchase.closeDetail()">
        <div class="modal" style="max-width:96vw;width:${isZ02?'1200px':'1400px'};" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">采购申请详情 - ${esc(pr.docNo)} <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-left:8px;">${esc(ptLabel?ptLabel.label:'')}</span></div>
            <button class="modal-close" onclick="SpPurchase.closeDetail()">✕</button>
          </div>
          <div class="modal-body" style="max-height:calc(92vh-100px);">
            <div class="form-section">
              <div class="form-section-title">表头信息</div>
              <div class="detail-grid">
                <div class="detail-item"><dt>采购申请类型</dt><dd><strong>${esc(ptLabel?ptLabel.label:pr.purchaseType||'-')}</strong></dd></div>
                <div class="detail-item"><dt>申请编号</dt><dd><strong>${esc(pr.docNo)}</strong></dd></div>
                <div class="detail-item"><dt>申请日期</dt><dd>${esc(pr.applyDate)}</dd></div>
                <div class="detail-item"><dt>工厂</dt><dd>${esc(pr.plant)}</dd></div>
                <div class="detail-item"><dt>部门</dt><dd>${esc(pr.dept)}</dd></div>
                <div class="detail-item"><dt>采购组</dt><dd>${esc(pgLabel?pgLabel.label:pr.purchaseGroup||'-')}</dd></div>

              </div>
              <div style="margin-top:10px;padding:10px;background:#f8fafc;border-radius:6px;display:grid;grid-template-columns:auto 1fr;gap:6px 16px;font-size:13px;">

                <dt style="color:var(--text-secondary);">备注</dt><dd>${esc(pr.notes||'-')}</dd>
              </div>
            </div>
            <div class="form-section" style="margin-top:16px;">
              <div class="form-section-title">行项目 (${pr.lines.length} 项，合计 ¥ ${grandTotal.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})})</div>
              <table class="data-table" style="min-width:${isZ02?'1000px':'1280px'};">
                <thead><tr>
                  <th>项次</th>${isZ01?'<th>物料</th>':''}<th>短文本</th>${isZ02?'<th>科目分配类别</th>':''}${isZ02?'<th>成本中心</th>':''}<th>物料组</th><th>申请人</th><th>采购订单</th><th style="text-align:right;">申请数量</th><th>单位</th>
                  <th style="text-align:right;">订货数量</th><th style="width:72px;text-align:center;">状态</th><th>交货日期</th><th>需求日期</th><th>交货日期</th><th style="text-align:right;">评价价格</th><th style="text-align:right;font-weight:800;color:var(--danger);">总价值</th>
                </tr></thead>
                <tbody>${pr.lines.map((l,i)=>{
                  const acctLabel = ACCT_ASS_CATEGORY_OPTIONS.find(o=>o.value===l.acctAssCategory);
                  const mgLabel = MAT_GROUP_OPTIONS.find(o=>o.value===l.matGroup);
                  return `<tr>
                  <td style="text-align:center;">${l.itemNo}</td>
                  ${isZ01?`<td><strong>${esc(l.matCode)}</strong></td>`:''}
                  <td>${esc(l.shortText)}</td>
                  ${isZ02?`<td>${esc(acctLabel?acctLabel.label:l.acctAssCategory||'-')}</td>`:''}${isZ02?`<td>${esc(l.costCenter||'-')}</td>`:''}
                  <td>${esc(mgLabel?mgLabel.label:l.matGroup||'-')}</td>
                  <td>${esc(l.applicant||'-')}</td>
                  <td>${esc(l.poNo||'-')}</td>
                  <td style="text-align:right;">${Number(l.reqQty).toLocaleString()}</td>
                  <td style="text-align:center;">${esc(l.unit)}</td>
                  <td style="text-align:right;color:var(--text-secondary);">${Number(l.orderQty).toLocaleString()}</td>
                  <td style="text-align:center;">${sb(l.status||'N')}</td>
                  <td style="white-space:nowrap;">${esc(l.deliveryDate||'-')}</td>
                  <td style="white-space:nowrap;">${esc(l.requiredDate||'-')}</td>
                  <td style="white-space:nowrap;">${esc(l.deliveryDate2||'-')}</td>
                  <td style="text-align:right;">${Number(l.price).toFixed(2)}</td>
                  <td style="text-align:right;font-weight:700;color:var(--danger);">${Number(l.totalValue).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                </tr>`;
                }).join('')}
                </tbody>
                <tfoot><tr style="background:#fef3f2;border-top:3px solid var(--border);">
                  <td colspan="${isZ02?'15':'14'}" style="text-align:right;font-weight:700;">合计：</td>
                  <td style="text-align:right;font-weight:800;color:var(--danger);font-size:15px;">¥ ${grandTotal.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                </tr></tfoot>
              </table>
            </div>
          </div>
          <div class="modal-footer" style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;gap:8px;align-items:center;">
              <button class="btn btn-secondary" onclick="SpPurchase.closeDetail()">关闭</button>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
              <button class="btn btn-primary btn-sm" onclick="SpPurchase.closeDetail();SpPurchase.openEditModal('${pr.docNo}')">编辑</button>
              <button class="btn btn-danger btn-sm" onclick="SpPurchase.closeDetail();SpPurchase.deleteReq('${pr.docNo}')">删除</button>
              <button class="btn btn-outline btn-sm" onclick="SpPurchase.printSingle('${pr.docNo}')">打印</button>
              <button class="btn btn-outline btn-sm" onclick="SpPurchase.exportData()">导出</button>
            </div>
          </div>
        </div>
      </div>`;
    document.getElementById('prModalContainer').innerHTML = html;
  },

  closeDetail() { document.getElementById('prModalContainer').innerHTML = ''; },

  // ---- Modal Form ----
  getFormModalHTML(pr) {
    const purchaseType = pr.purchaseType || 'Z01';
    const linesHTML = pr.lines.map((l, i) => SpPurchase.renderLineRow(l, i, purchaseType)).join('');
    return `
      <div class="modal-backdrop" id="prModalBackdrop" onclick="SpPurchase.closeModal()">
        <div class="modal modal-lg" style="max-width:${purchaseType==='Z02'?'1300px':'1400px'};" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">${this.editMode?'修改':'新建'}采购申请 ${this.editMode?('-'+pr.docNo):''}</div>
            <button class="modal-close" onclick="SpPurchase.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:calc(92vh-140px);">
            <${''}!-- Header ${''}-->
            <div class="form-section">
              <div class="form-section-title">表头信息</div>
              <div class="form-grid">
                <div class="form-group"><label><span class="req">*</span> 采购申请类型</label><select id="prFPurchaseType" onchange="SpPurchase.onPurchaseTypeChange()">${PURCHASE_TYPE_OPTIONS.map(o=>`<option value="${o.value}"${pr.purchaseType===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select></div>
                <div class="form-group"><label>采购申请编号</label><input type="text" value="${esc(pr.docNo||'(自动生成)')}" disabled style="background:#f8fafc;"></div>
                <div class="form-group"><label><span class="req">*</span> 部门</label><select id="prFDept"><option value="">请选择</option><option value="设备部"${pr.dept==='设备部'?' selected':''}>设备部</option><option value="生产部"${pr.dept==='生产部'?' selected':''}>生产部</option><option value="质量部"${pr.dept==='质量部'?' selected':''}>质量部</option><option value="仓储物流部"${pr.dept==='仓储物流部'?' selected':''}>仓储物流部</option></select></div>
                <div class="form-group"><label><span class="req">*</span> 采购组</label><select id="prFPurchaseGroup"><option value="">请选择</option>${PURCHASE_GROUP_OPTIONS.map(o=>`<option value="${o.value}"${pr.purchaseGroup===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select></div>
                <div class="form-group"><label>工厂</label><select id="prFPlant">
                  <option value="1000"${pr.plant==='1000'?' selected':''}>1000 - 山东步长制药工厂</option>
                  <option value="2001"${pr.plant==='2001'?' selected':''}>2001 - 陕西步长制药工厂</option>
                  <option value="2002"${pr.plant==='2002'?' selected':''}>2002 - 山东丹红制药工厂</option>
                  <option value="2003"${pr.plant==='2003'?' selected':''}>2003 - 山东神州制药工厂</option>
                  <option value="2004"${pr.plant==='2004'?' selected':''}>2004 - 山东康爱制药工厂</option>
                  <option value="2005"${pr.plant==='2005'?' selected':''}>2005 - 通化谷红制药工厂</option>
                  <option value="2006"${pr.plant==='2006'?' selected':''}>2006 - 吉林天成制药工厂</option>
                  <option value="2007"${pr.plant==='2007'?' selected':''}>2007 - 通化天实制药工厂</option>
                  <option value="2008"${pr.plant==='2008'?' selected':''}>2008 - 梅河口步长制药工厂</option>
                  <option value="2009"${pr.plant==='2009'?' selected':''}>2009 - 辽宁奥达制药工厂</option>
                  <option value="2010"${pr.plant==='2010'?' selected':''}>2010 - 保定天浩制药工厂</option>
                  <option value="2011"${pr.plant==='2011'?' selected':''}>2011 - 邛崃天银制药工厂</option>
                  <option value="2012"${pr.plant==='2012'?' selected':''}>2012 - 陕西步长高新制药工厂</option>
                  <option value="2013"${pr.plant==='2013'?' selected':''}>2013 - 杨凌步长制药工厂</option>
                </select></div>
                <div class="form-group"><label>申请日期</label><input type="date" id="prFApplyDate" value="${esc(pr.applyDate)}"></div>

                <div class="form-group full"><label>备注</label><textarea id="prFNotes" rows="2" placeholder="补充说明">${esc(pr.notes||'')}</textarea></div>
              </div>
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
                <table class="data-table" id="prLinesTable" style="min-width:1480px;">
                  <thead><tr>
                    <th style="width:36px;text-align:center;">#</th>
                    <th style="min-width:100px;" id="prThMatCode"><span class="req">*</span> 物料</th>
                    <th style="min-width:200px;" id="prThShortText"><span class="req">*</span> 短文本</th>
                    <th style="min-width:70px;">申请人</th>
                    <th style="min-width:90px;display:none;" id="prThPoNo">采购订单</th>
                    <th style="min-width:80px;" id="prThAcctAss">科目分配类别</th>
                    <th style="min-width:90px;" id="prThCostCenter">成本中心</th>
                    <th style="min-width:80px;" id="prThMatGroup">物料组</th>
                    <th style="min-width:75px;text-align:right;"><span class="req">*</span> 申请数量</th>
                    <th style="width:52px;">单位</th>
                    <th style="min-width:70px;text-align:right;">订货数量</th>
                    <th style="min-width:95px;">交货日期</th>
                    <th style="min-width:95px;">需求日期</th>
                    <th style="min-width:95px;">交货日期</th>
                    <th style="min-width:70px;text-align:right;" id="prThPrice">评价价格</th>
                    <th style="min-width:90px;text-align:right;font-weight:700;color:var(--danger);">总价值</th>
                    <th style="width:42px;"></th>
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
            <button class="btn btn-primary" onclick="SpPurchase.submitForm()">提交</button>
          </div>
        </div>
      </div>`;
  },

  renderLineRow(line, idx, purchaseType) {
    const pt = purchaseType || 'Z01';
    const isZ01 = pt === 'Z01';
    const isZ02 = pt === 'Z02';

    // MatCode cell
    const matCodeCell = isZ01
      ? `<td><input type="text" data-field="matCode" value="${esc(line.matCode||'')}" placeholder="物料号" style="padding:5px 8px;width:100%;border:1px solid var(--border);border-radius:4px;font-size:12px;" onblur="SpPurchase.onMatCodeBlur(this)" oninput="SpPurchase.recalcTotal()"></td>`
      : `<td style="padding:5px;color:var(--text-muted);font-size:11px;text-align:center;">-</td>`;

    // ShortText cell
    const shortTextCell = isZ01
      ? `<td><input type="text" data-field="shortText" value="${esc(line.shortText||'')}" placeholder="物料描述" readonly style="padding:5px 8px;width:100%;border:1px solid #e2e8f0;border-radius:4px;font-size:12px;background:#f1f5f9;color:#64748b;" oninput="SpPurchase.recalcTotal()"></td>`
      : `<td><input type="text" data-field="shortText" value="${esc(line.shortText||'')}" placeholder="费用性采购内容描述" style="padding:5px 8px;width:100%;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#fffbe6;" oninput="SpPurchase.recalcTotal()" required></td>`;

    // AcctAssCategory cell
    const acctAssCell = isZ01
      ? `<td style="padding:5px;"><span style="color:var(--text-muted);font-size:11px;">-</span></td>`
      : `<td style="padding:5px;"><select data-field="acctAssCategory" style="width:100%;padding:4px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:#fffbe6;" required>${ACCT_ASS_CATEGORY_OPTIONS.map(o=>`<option value="${o.value}"${(line.acctAssCategory||'K')===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select></td>`;

    // MatGroup cell
    let matGroupCell;
    if (isZ01) {
      const groupLabel = MAT_GROUP_OPTIONS.find(o => o.value === line.matGroup);
      matGroupCell = `<td style="padding:5px;"><span data-field="matGroup" style="font-size:12px;color:#64748b;">${esc((groupLabel?groupLabel.label:'')||'')}</span></td>`;
    } else {
      matGroupCell = `<td style="padding:5px;"><select data-field="matGroup" style="width:100%;padding:4px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:#fffbe6;" required><option value="">请选择</option>${MAT_GROUP_OPTIONS.map(o=>`<option value="${o.value}"${line.matGroup===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select></td>`;
    }

    // CostCenter cell (Z02 only, always show column for alignment)
    const costCenterCell = isZ01
      ? `<td style="padding:5px;"><span style="color:var(--text-muted);font-size:11px;">-</span></td>`
      : `<td style="padding:5px;"><select data-field="costCenter" style="width:100%;padding:4px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:#fffbe6;"><option value="">请选择</option>${COST_CENTER_OPTIONS.map(o=>`<option value="${o.value}"${line.costCenter===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select></td>`;

    // Price cell
    const priceCell = isZ01
      ? `<td style="padding:5px;"><input type="number" data-field="price" value="${line.price||''}" min="0" step="0.01" readonly style="width:68px;text-align:right;padding:5px 6px;border:1px solid #e2e8f0;border-radius:4px;font-size:12px;background:#f1f5f9;color:#64748b;" oninput="SpPurchase.recalcTotal()"></td>`
      : `<td style="padding:5px;"><input type="number" data-field="price" value="${line.price||''}" min="0" step="0.01" style="width:68px;text-align:right;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#fffbe6;" oninput="SpPurchase.recalcTotal()" required></td>`;

    return `<tr data-row="${idx}">
      <td style="text-align:center;color:var(--text-muted);font-weight:600;">${idx+1}</td>
      ${matCodeCell}
      ${shortTextCell}
      <td style="padding:5px;"><input type="text" data-field="applicant" value="${esc(line.applicant||'')}" placeholder="申请人" style="width:66px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:5px;display:none;"><input type="text" data-field="poNo" value="${esc(line.poNo||'')}" placeholder="采购订单号" style="width:88px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      ${acctAssCell}
      ${costCenterCell}
      ${matGroupCell}
      <td style="padding:5px;"><input type="number" data-field="reqQty" value="${line.reqQty||''}" min="0" step="any" style="width:72px;text-align:right;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;" oninput="SpPurchase.recalcTotal()" required></td>
      <td style="padding:5px;"><select data-field="unit" style="width:48px;padding:4px 4px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:#f0f9ff;" onchange="SpPurchase.recalcTotal()">
        <option value="个"${line.unit==='个'?' selected':''}>个</option><option value="KG"${line.unit==='KG'?' selected':''}>KG</option><option value="套"${line.unit==='套'?' selected':''}>套</option><option value="袋"${line.unit==='袋'?' selected':''}>袋</option><option value="件"${line.unit==='件'?' selected':''}>件</option><option value="台"${line.unit==='台'?' selected':''}>台</option><option value="支"${line.unit==='支'?' selected':''}>支</option><option value="桶"${line.unit==='桶'?' selected':''}>桶</option><option value="组"${line.unit==='组'?' selected':''}>组</option><option value="箱"${line.unit==='箱'?' selected':''}>箱</option><option value="卷"${line.unit==='卷'?' selected':''}>卷</option><option value="瓶"${line.unit==='瓶'?' selected':''}>瓶</option><option value="盒"${line.unit==='盒'?' selected':''}>盒</option><option value="方"${line.unit==='方'?' selected':''}>方</option><option value="张"${line.unit==='张'?' selected':''}>张</option>
      </select></td>
      <td style="padding:5px;"><input type="number" data-field="orderQty" value="${line.orderQty||''}" min="0" style="width:68px;text-align:right;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:5px;"><input type="text" value="${esc(line.deliveryDate||'')}" placeholder="YYYYMMDD" style="width:88px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:5px;"><input type="text" value="${esc(line.requiredDate||'')}" placeholder="YYYY.MM.DD" style="width:94px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:5px;"><input type="text" value="${esc(line.deliveryDate2||'')}" placeholder="YYYY.MM.DD" style="width:94px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      ${priceCell}
      <td style="text-align:right;font-weight:700;color:var(--danger);padding:6px 4px;" class="line-total">${(Number(line.totalValue||0)).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
      <td style="padding:4px;"><button class="btn btn-sm" style="padding:3px 8px;font-size:18px;line-height:1;color:var(--danger);background:none;border:1px solid transparent;" onclick="SpPurchase.removeLineRow(this)" title="删除此行">&times;</button></td>
    </tr>`;
  },

  addLineRow() {
    const tbody = document.getElementById('prLinesBody');
    const idx = tbody.rows.length;
    const purchaseType = document.getElementById('prFPurchaseType')?.value || 'Z01';
    const tr = document.createElement('tr');
    tr.innerHTML = this.renderLineRow({ itemNo:(idx+1)*10, matCode:'', shortText:'', applicant:window.currentUserId||'admin', poNo:'', reqQty:'', unit:'个', orderQty:0, deliveryDate:'', requiredDate:'', deliveryDate2:'', price:0, totalValue:0, acctAssCategory:'K', matGroup:'', storageLocation:'', costCenter:'' }, idx, purchaseType);
    tbody.appendChild(tr);
    this.reindexRows();
  },

  removeLineRow(btn) {
    const tr = btn.closest('tr');
    if (document.getElementById('prLinesBody').rows.length <= 1) {
      toast('至少保留一行');
      return;
    }
    tr.remove();
    this.reindexRows();
    this.recalcTotal();
  },

  reindexRows() {
    const rows = document.querySelectorAll('#prLinesBody tr');
    rows.forEach((r,i) => { r.querySelector('td:first-child').textContent = i+1; });
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
      if (thMatCode) thMatCode.innerHTML = '<span class="req">*</span> 物料';
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
      const opts = { matCode:'', shortText:'', applicant:window.currentUserId||'admin', poNo:'', reqQty:'', unit:'个', orderQty:0, price:0, acctAssCategory:'K', matGroup:'', costCenter:'' };
      ['matCode','shortText','applicant','poNo','reqQty','unit','orderQty','price','acctAssCategory','matGroup','costCenter'].forEach(f => {
        const el = getEl(f);
        if (el) opts[f] = el.value || el.textContent || opts[f];
      });
      opts.totalValue = (parseFloat(opts.reqQty)||0) * (parseFloat(opts.price)||0);
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

      // Auto-fill matGroup
      const mgEl = row.querySelector('[data-field="matGroup"]');
      if (mgEl && mgEl.tagName === 'SPAN') {
        const label = MAT_GROUP_OPTIONS.find(o => o.value === master.matGroup);
        mgEl.textContent = label ? label.label : master.matGroup;
        mgEl.style.color = '#16a34a';
        setTimeout(() => { mgEl.style.color = '#64748b'; }, 800);
      }

      // Auto-fill price
      const prEl = row.querySelector('[data-field="price"]');
      if (prEl) { prEl.value = master.price; prEl.style.background = '#dcfce7'; setTimeout(() => { prEl.style.background = '#f1f5f9'; }, 800); }

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

  printList() { toast('打印功能开发中...'); },
  printSingle(docNo) { toast('打印申请单 ' + docNo + ' ...'); },
  exportData() { toast('导出功能开发中...'); }
};

// ===== Demo Data for Purchase Requisition (real factory codes & material codes) =====
const spPurchaseData = [
  {
    docNo:'2100002651', applyDate:'2026-05-06', plant:'1000 - 山东步长制药工厂', dept:'设备部',notes:'原厂康斐尔/AAF品牌',
    purchaseType:'Z01', purchaseGroup:'Z001',
    lines:[
      {itemNo:10,matCode:'60001018',shortText:'高效过滤器-MIIPDF-635*520*93-27-AAF', reqQty:48,unit:'个',orderQty:48,deliveryDate:'20260715',requiredDate:'20260620',deliveryDate2:'20260715',price:850.00,totalValue:40800,applicant:'李君',poNo:'4100014248',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:20,matCode:'60001019',shortText:'高效过滤器-MIIPDF-635*762*93-27-AAF', reqQty:36,unit:'个',orderQty:36,deliveryDate:'20260715',requiredDate:'20260620',deliveryDate2:'20260715',price:920.00,totalValue:33120,applicant:'李君',poNo:'4100014248',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:30,matCode:'60001020',shortText:'高效过滤器-MIIPDF-416*416*93-27-AAF', reqQty:24,unit:'个',orderQty:24,deliveryDate:'20260715',requiredDate:'20260620',deliveryDate2:'20260715',price:680.00,totalValue:16320,applicant:'李君',poNo:'4100014248',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:40,matCode:'60001021',shortText:'高效过滤器-MIIPDF-635*1030*93-27-AAF', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260715',requiredDate:'20260620',deliveryDate2:'20260715',price:1050.00,totalValue:21000,applicant:'李君',poNo:'4100014248',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:50,matCode:'60001022',shortText:'高效过滤器-GSF-LS-631*516*95-01/22-康斐尔', reqQty:32,unit:'个',orderQty:32,deliveryDate:'20260720',requiredDate:'20260625',deliveryDate2:'20260720',price:750.00,totalValue:24000,applicant:'李君',poNo:'4100014248',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:60,matCode:'60001023',shortText:'高效过滤器-GSF-LS-631*758*95-01/22-康斐尔', reqQty:24,unit:'个',orderQty:24,deliveryDate:'20260720',requiredDate:'20260625',deliveryDate2:'20260720',price:820.00,totalValue:19680,applicant:'李君',poNo:'4100014248',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:70,matCode:'60001024',shortText:'高效过滤器-GSF-LS-412*412*95-01/22-康斐尔', reqQty:16,unit:'个',orderQty:16,deliveryDate:'20260720',requiredDate:'20260625',deliveryDate2:'20260720',price:620.00,totalValue:9920,applicant:'李君',poNo:'4100014248',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:80,matCode:'60001025',shortText:'高效过滤器-GSF-LS-1026*631*95-01/22-康斐尔', reqQty:12,unit:'个',orderQty:12,deliveryDate:'20260720',requiredDate:'20260625',deliveryDate2:'20260720',price:1100.00,totalValue:13200,applicant:'李君',poNo:'4100014248',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:90,matCode:'60001026',shortText:'高效过滤器-GSF-LS-762*631*95-01/22-康斐尔', reqQty:12,unit:'个',orderQty:12,deliveryDate:'20260720',requiredDate:'20260625',deliveryDate2:'20260720',price:960.00,totalValue:11520,applicant:'李君',poNo:'4100014248',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:100,matCode:'60001012',shortText:'耐湿高效过滤器-GKYS-305*30*150', reqQty:8,unit:'个',orderQty:8,deliveryDate:'20260720',requiredDate:'20260625',deliveryDate2:'20260720',price:580.00,totalValue:4640,applicant:'李君',poNo:'4100014248',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''}
    ]
  },
  {
    docNo:'2100002752', applyDate:'2026-05-07', plant:'2001 - 陕西步长制药工厂', dept:'设备部',notes:'要求氟橡胶材质，需提供材质证明',
    purchaseType:'Z01', purchaseGroup:'Z001',
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
    docNo:'2100002873', applyDate:'2026-05-09', plant:'2002 - 山东丹红制药工厂', dept:'设备部',notes:'宝帝原厂膜片，需随货附合格证',
    purchaseType:'Z01', purchaseGroup:'Z001',
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
    docNo:'2100002984', applyDate:'2026-05-12', plant:'2003 - 山东神州制药工厂', dept:'生产部',notes:'',
    purchaseType:'Z01', purchaseGroup:'Z001',
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
    docNo:'2100003105', applyDate:'2026-05-14', plant:'1000 - 山东步长制药工厂', dept:'设备部',notes:'含安装服务',
    purchaseType:'Z01', purchaseGroup:'Z001',
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
    docNo:'2100003206', applyDate:'2026-05-16', plant:'2006 - 吉林天成制药工厂', dept:'设备部',notes:'需重新确认规格型号',
    purchaseType:'Z01', purchaseGroup:'Z001',
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
    docNo:'2100003307', applyDate:'2026-05-18', plant:'2010 - 保定天浩制药工厂', dept:'质量部',notes:'补充设备使用年限说明后重新提交',
    purchaseType:'Z01', purchaseGroup:'Z001',
    lines:[
      {itemNo:10,matCode:'60001271',shortText:'304不锈钢培养皿架-90mm培养皿-放40个-带可翻转提手', reqQty:6,unit:'个',orderQty:6,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:380.00,totalValue:2280,applicant:'赵雪梅',poNo:'4100015300',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:20,matCode:'60001272',shortText:'304不锈钢培养皿架-90mm培养皿-放80个-带可翻转提手', reqQty:4,unit:'个',orderQty:4,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:520.00,totalValue:2080,applicant:'赵雪梅',poNo:'4100015300',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:30,matCode:'60001273',shortText:'不锈钢试管架-40孔/个-孔径21mm', reqQty:10,unit:'个',orderQty:10,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:120.00,totalValue:1200,applicant:'赵雪梅',poNo:'4100015300',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:40,matCode:'60001293',shortText:'贴壁式不锈钢置物架-304不锈钢-30cm*15cm*12cm', reqQty:8,unit:'个',orderQty:8,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:160.00,totalValue:1280,applicant:'赵雪梅',poNo:'4100015300',status:'N',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''}
    ]
  },
  {
    docNo:'2100003408', applyDate:'2026-05-20', plant:'1000 - 山东步长制药工厂', dept:'设备部',notes:'需304不锈钢材质',
    purchaseType:'Z01', purchaseGroup:'Z001',
    lines:[
      {itemNo:10,matCode:'60001249',shortText:'宝塔头-外径25mm-内径9.6mm-30700-60', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:18.00,totalValue:360,applicant:'王海涛',poNo:'4100017356',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:20,matCode:'60001250',shortText:'宝塔头-外径50mm-内径9.6mm-30700-49', reqQty:15,unit:'个',orderQty:15,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:25.00,totalValue:375,applicant:'王海涛',poNo:'4100017356',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:30,matCode:'60001251',shortText:'卡箍-25mm-30800-75-304L不锈钢', reqQty:40,unit:'个',orderQty:40,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:10.00,totalValue:400,applicant:'王海涛',poNo:'4100017356',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:40,matCode:'60001252',shortText:'卡箍-50mm-30800-76-304L不锈钢', reqQty:30,unit:'个',orderQty:30,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:15.00,totalValue:450,applicant:'王海涛',poNo:'4100017356',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:50,matCode:'60001278',shortText:'管路直角接头-φ51mm', reqQty:25,unit:'个',orderQty:25,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:12.00,totalValue:300,applicant:'王海涛',poNo:'4100017356',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:60,matCode:'60001274',shortText:'气管直通变径接头-PG8-6-接头φP15mm-接头总长39.5mm', reqQty:35,unit:'个',orderQty:35,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:6.50,totalValue:227.50,applicant:'王海涛',poNo:'4100017356',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:70,matCode:'60001122',shortText:'不锈钢快装直通过滤器-20"226-插口(K50.5)-304不锈钢-226', reqQty:5,unit:'个',orderQty:5,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:350.00,totalValue:1750,applicant:'王海涛',poNo:'4100017356',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:80,matCode:'60001112',shortText:'Y型过滤器滤网-长460mm*宽18mm-材质:304不锈钢-DN15', reqQty:10,unit:'个',orderQty:10,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:65.00,totalValue:650,applicant:'王海涛',poNo:'4100017356',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''}
    ]
  },
  {
    docNo:'2100003509', applyDate:'2026-05-22', plant:'2013 - 杨凌步长制药工厂', dept:'质量部',notes:'需提供第三方检定证书',
    purchaseType:'Z01', purchaseGroup:'Z001',
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
    purchaseType:'Z01', purchaseGroup:'Z001',
    lines:[
      {itemNo:10,matCode:'60001154',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径25*内径9', reqQty:100,unit:'个',orderQty:100,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:3.50,totalValue:350,applicant:'陈永刚',poNo:'4100017892',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:20,matCode:'60001155',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径25*内径16', reqQty:100,unit:'个',orderQty:100,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:4.00,totalValue:400,applicant:'陈永刚',poNo:'4100017892',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:30,matCode:'60001156',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径34*内径19', reqQty:80,unit:'个',orderQty:80,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:5.50,totalValue:440,applicant:'陈永刚',poNo:'4100017892',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:40,matCode:'60001157',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径40*内径25', reqQty:80,unit:'个',orderQty:80,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:6.00,totalValue:480,applicant:'陈永刚',poNo:'4100017892',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:50,matCode:'60001158',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径50.5*内径22', reqQty:60,unit:'个',orderQty:60,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:7.50,totalValue:450,applicant:'陈永刚',poNo:'4100017892',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:60,matCode:'60001159',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径50.5*内径29', reqQty:60,unit:'个',orderQty:60,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:8.00,totalValue:480,applicant:'陈永刚',poNo:'4100017892',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:70,matCode:'60001160',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径50.5*内径35', reqQty:60,unit:'个',orderQty:60,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:8.50,totalValue:510,applicant:'陈永刚',poNo:'4100017892',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:80,matCode:'60001104',shortText:'卡盘垫片-尺寸:4″-PTFE-卡盘外径:119mm-卡盘内径:97.4mm', reqQty:30,unit:'个',orderQty:30,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:18.00,totalValue:540,applicant:'陈永刚',poNo:'4100017892',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:90,matCode:'60001151',shortText:'氟橡胶垫片FKM-材质:氟胶-尺寸:外径50.5*内径23.5', reqQty:40,unit:'个',orderQty:40,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:6.00,totalValue:240,applicant:'陈永刚',poNo:'4100017892',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''},
      {itemNo:100,matCode:'60001152',shortText:'氟橡胶垫片FKM-材质:氟胶-尺寸:外径50.5*内径30', reqQty:40,unit:'个',orderQty:40,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:6.50,totalValue:260,applicant:'陈永刚',poNo:'4100017892',status:'B',acctAssCategory:'',matGroup:'',storageLocation:'',costCenter:''}
    ]
  },
  {
    docNo:'2100003701', applyDate:'2026-05-26', plant:'2012 - 陕西步长高新制药工厂', dept:'设备部',notes:'部分压力表损坏需更换',
    purchaseType:'Z01', purchaseGroup:'Z001',
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
    purchaseType:'Z02', purchaseGroup:'Z003',
    lines:[
      {itemNo:10,matCode:'',shortText:'空调节能改造技术方案咨询-现场勘查与方案设计', reqQty:1,unit:'个',orderQty:1,deliveryDate:'20260715',requiredDate:'20260630',deliveryDate2:'20260715',price:28000.00,totalValue:28000,applicant:'李君',poNo:'4100019001',status:'N',acctAssCategory:'K',matGroup:'608',storageLocation:'',costCenter:'100401'},
      {itemNo:20,matCode:'',shortText:'节能方案实施监理服务-全过程监理', reqQty:1,unit:'个',orderQty:1,deliveryDate:'20260801',requiredDate:'20260715',deliveryDate2:'20260801',price:15000.00,totalValue:15000,applicant:'李君',poNo:'4100019001',status:'N',acctAssCategory:'K',matGroup:'608',storageLocation:'',costCenter:'100401'}
    ]
  },
  {
    docNo:'2100003903', applyDate:'2026-06-02', plant:'2001 - 陕西步长制药工厂', dept:'质量部',
    notes:'需具备CMA/CNAS资质',
    purchaseType:'Z02', purchaseGroup:'Z003',
    lines:[
      {itemNo:10,matCode:'',shortText:'高效液相色谱柱清洗与维护服务-安捷伦1260系列全年维护', reqQty:1,unit:'套',orderQty:1,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:12000.00,totalValue:12000,applicant:'赵雪梅',poNo:'4100019002',status:'N',acctAssCategory:'K',matGroup:'606',storageLocation:'',costCenter:'100601'},
      {itemNo:20,matCode:'',shortText:'实验室废弃物处理服务-化学废液/废试剂瓶合规处置', reqQty:12,unit:'次',orderQty:12,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:3500.00,totalValue:42000,applicant:'赵雪梅',poNo:'4100019002',status:'N',acctAssCategory:'K',matGroup:'606',storageLocation:'',costCenter:'100601'},
      {itemNo:30,matCode:'',shortText:'仪器校准服务-30台分析仪器年度校准', reqQty:1,unit:'批',orderQty:1,deliveryDate:'20260715',requiredDate:'20260630',deliveryDate2:'20260715',price:25000.00,totalValue:25000,applicant:'赵雪梅',poNo:'4100019002',status:'N',acctAssCategory:'K',matGroup:'603',storageLocation:'',costCenter:'100601'}
    ]
  },
  {
    docNo:'2100004004', applyDate:'2026-06-05', plant:'2010 - 保定天浩制药工厂', dept:'生产部',
    notes:'需有制药企业服务经验',
    purchaseType:'Z02', purchaseGroup:'Z002',
    lines:[
      {itemNo:10,matCode:'',shortText:'洁净区专业保洁服务-洁净区2000㎡月度保洁', reqQty:6,unit:'次',orderQty:6,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:8600.00,totalValue:51600,applicant:'陈永刚',poNo:'4100019003',status:'N',acctAssCategory:'K',matGroup:'608',storageLocation:'',costCenter:'100401'},
      {itemNo:20,matCode:'',shortText:'GMP安全生产培训-全员培训含考核认证', reqQty:1,unit:'批',orderQty:1,deliveryDate:'20260715',requiredDate:'20260630',deliveryDate2:'20260715',price:18000.00,totalValue:18000,applicant:'陈永刚',poNo:'4100019003',status:'N',acctAssCategory:'K',matGroup:'608',storageLocation:'',costCenter:'100501'}
    ]
  }
];
