// ===== Spare Parts Stock Query Page =====
// 安全库存静态主数据（按 工厂+物料号 维度设置），与安全库存预警页共享同一数据源
const SAFETY_STOCK_MAP = {
  '1000': {
    '60001018': 50, '60001019': 60, '60001020': 40, '60001021': 30, '60001022': 45,
    '60001023': 50, '60001024': 35, '60001025': 55, '60001026': 48,
    '60001012': 20, '60001086': 100, '60001087': 80, '60001088': 90, '60001089': 500,
    '60001090': 1000, '60001146': 30, '60001147': 25,
    '60000655': 200, '60000656': 150, '60000657': 100,
    '60001128': 80, '60001129': 60, '60001131': 40, '60001132': 70,
    '60001238': 300, '60001271': 20, '60001272': 15, '60001249': 150, '60001207': 10, '60001281': 50,
    '10000009': 5000, '10000010': 3000, '10000011': 2000,
    '20000001': 100, '20000002': 80, '20000003': 60, '20000004': 50,
    '30000001': 20, '30000002': 100, '30000003': 40,
    '40000001': 100, '40000002': 500
  },
  '2001': {
    '50000001': 30, '50000002': 20, '60000001': 15
  }
};
const getSafetyStock = (factory, matCode) =>
  (SAFETY_STOCK_MAP[factory] && SAFETY_STOCK_MAP[factory][matCode]) || 0;

// ===== 物料类型映射（SAP 物料主数据标准类型）=====
const MAT_TYPE_MAP = {
  '10000009': 'FERT', '10000010': 'FERT', '10000011': 'FERT',
  '20000001': 'ROH', '20000002': 'ROH', '20000003': 'ROH', '20000004': 'ROH',
  '30000001': 'VERP', '30000002': 'VERP', '30000003': 'VERP',
  '40000001': 'FERT', '40000002': 'FERT',
  '50000001': 'HALB', '50000002': 'ROH',
  '60000001': 'HALB',
  '60001018': 'ERSA', '60001019': 'ERSA', '60001021': 'ERSA',
  '60001146': 'ERSA', '60001147': 'ERSA',
  '60000655': 'ERSA', '60000656': 'ERSA', '60001271': 'ERSA',
  '60001207': 'ERSA', '60001128': 'ERSA', '60001131': 'ERSA'
};
const getMatType = matCode => MAT_TYPE_MAP[matCode] || '';

const SparePartsStock = {
  page: 1, pageSize: 15, filtered: [],
  showExtCols: false,

  render() {
    this.filtered = sparePartsStockData.filter(r => !this._isConfidential(r.factory, r.storageLoc));
    this.page = 1;
    const locOptionsHtml = this._getLocOptionsHtml();
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">库存查询</div><div style="font-size:13px;opacity:0.8;">实时查看备品备件库存状态</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary" style="background:rgba(255,255,255,0.15);color:white;" onclick="SparePartsStock.reset()">刷新</button>
            <button class="btn btn-blue" onclick="SparePartsStock.exportData()">+ 导出</button>
          </div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>工厂</label><select id="spFactory">
            <option value="">全部</option>
            <option value="1000">1000 (山东步长制药工厂)</option>
            <option value="2001">2001 (陕西步长制药工厂)</option>
            <option value="2002">2002 (山东丹红制药工厂)</option>
            <option value="2003">2003 (山东神州制药工厂)</option>
            <option value="2004">2004 (山东康爱制药工厂)</option>
            <option value="2005">2005 (通化谷红制药工厂)</option>
            <option value="2006">2006 (吉林天成制药工厂)</option>
            <option value="2007">2007 (通化天实制药工厂)</option>
          </select></div>
          <div class="filter-group"><label>库位</label><select id="spStorageLoc">
            ${locOptionsHtml}
          </select></div>
          <div class="filter-group"><label>显示类型</label><select id="spDisplayType" onchange="SparePartsStock.onDisplayTypeChange()">
            <option value="" selected>空 - 明细</option>
            <option value="1">1 - 批次汇总</option>
            <option value="2">2 - 库位汇总</option>
          </select></div>
          <div class="filter-group" id="spWbsGroup"><label>WBS编号</label><input type="text" id="spWbsNo" placeholder="WBS编号"></div>
          <div class="filter-group"><label>物料类型</label><select id="spMatType">
            <option value="">全部</option>
            <option value="FERT">FERT - 成品</option>
            <option value="HALB">HALB - 半成品</option>
            <option value="ROH">ROH - 原材料</option>
            <option value="VERP">VERP - 包装材料</option>
            <option value="ERSA">ERSA - 备件</option>
          </select></div>
          <div class="filter-group"><label>物料号</label><input type="text" id="spMatCode" placeholder="物料号"></div>
          <div class="filter-group" id="spBatchGroup"><label>批次</label><input type="text" id="spBatch" placeholder="批次"></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="SparePartsStock.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="SparePartsStock.reset()">重置</button>
          </div>
        </div>
        <div id="spLegendBar" style="flex-shrink:0;display:none;align-items:center;gap:16px;padding:10px 20px 0;font-size:12px;color:#64748b;flex-wrap:wrap;">
          <span style="display:inline-flex;align-items:center;gap:5px;"><span style="width:8px;height:8px;border-radius:50%;background:#16a34a;display:inline-block;"></span>绿灯 = 可用库存 ≥ 安全库存</span>
          <span style="display:inline-flex;align-items:center;gap:5px;"><span style="width:8px;height:8px;border-radius:50%;background:#dc2626;display:inline-block;"></span>红灯 = 可用库存 &lt; 安全库存</span>
          <span style="color:#94a3b8;">安全库存为物料主数据静态设置值，不随库存变动</span>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table">
            <thead id="spTableHead"></thead>
            <tbody id="spTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info"><span class="list-count" id="spCount">共 ${this.filtered.length} 条</span>
            <button id="spToggleExt" class="btn btn-secondary btn-sm" onclick="SparePartsStock.toggleExtCols()">展开次要字段</button>
          </div>
          <div class="pagination">
            <button class="pagination-btn" id="spPrev" disabled onclick="SparePartsStock.prevPage()">‹</button>
            <span class="pagination-info" id="spPageInfo">第 1 / ${Math.ceil(this.filtered.length/this.pageSize)} 页</span>
            <button class="pagination-btn" id="spNext" onclick="SparePartsStock.nextPage()">›</button>
            <select class="page-size-select" id="spPageSizeSel" onchange="SparePartsStock.changePageSize()"><option value="15">15条</option><option value="30">30条</option><option value="50">50条</option></select>
          </div>
        </div>
      </div>`;
  },

  init() {
    this.filtered = sparePartsStockData.filter(r => !this._isConfidential(r.factory, r.storageLoc));
    this.page = 1;
    const displayType = document.getElementById('spDisplayType').value;
    if (displayType === '1') this._aggregate();
    else if (displayType === '2') this._aggregateByPlant();
    this.renderTable();
    this._syncFilterStates();
  },

  // 保密库位判断（factory|storageLoc 与 CONFIDENTIAL_STORAGE_LOCS 匹配）
  _isConfidential(factory, storageLoc) {
    return CONFIDENTIAL_STORAGE_LOCS.includes(factory + '|' + storageLoc);
  },

  // 生成库位下拉选项 HTML（过滤保密库位；STORAGE_LOC_OPTIONS 来自 data.js 主数据全量生成）
  _getLocOptionsHtml() {
    return ['<option value="">全部</option>']
      .concat(STORAGE_LOC_OPTIONS
        .filter(o => !this._isConfidential(o.value.split('|')[0], o.value.split('|')[1]))
        .map(o => `<option value="${o.value}">${o.label}</option>`))
      .join('');
  },

  // 批次汇总档（库位层级）：按 工厂|库位|物料号|WBS|特殊库存|客户 聚合，不展示安全库存
  _aggregate() {
    const aggMap = new Map();
    this.filtered.forEach(row => {
      const key = `${row.factory}|${row.storageLoc}|${row.matCode}|${row.wbsNo||''}|${row.specialStock||''}|${row.customer||''}`;
      if (!aggMap.has(key)) {
        aggMap.set(key, { ...row, unrestrictedQty: 0, qualityQty: 0, blockedQty: 0 });
      }
      const agg = aggMap.get(key);
      agg.unrestrictedQty = (agg.unrestrictedQty || 0) + (row.unrestrictedQty || 0);
      agg.qualityQty = (agg.qualityQty || 0) + (row.qualityQty || 0);
      agg.blockedQty = (agg.blockedQty || 0) + (row.blockedQty || 0);
    });
    this.filtered = [...aggMap.values()];
  },

  // 工厂汇总档：按 工厂|物料号 聚合（跨库位合计），安全库存按工厂级判断红绿灯
  _aggregateByPlant() {
    const aggMap = new Map();
    this.filtered.forEach(row => {
      const key = `${row.factory}|${row.matCode}`;
      if (!aggMap.has(key)) {
        aggMap.set(key, { ...row, unrestrictedQty: 0, qualityQty: 0, blockedQty: 0 });
      }
      const agg = aggMap.get(key);
      agg.unrestrictedQty = (agg.unrestrictedQty || 0) + (row.unrestrictedQty || 0);
      agg.qualityQty = (agg.qualityQty || 0) + (row.qualityQty || 0);
      agg.blockedQty = (agg.blockedQty || 0) + (row.blockedQty || 0);
    });
    this.filtered = [...aggMap.values()].map(r => {
      // 工厂级安全库存对比：可用库存 = 非限制 + 质检（工厂全库位合计）；可用 >= 安全库存 = 绿灯，否则红灯
      r.safetyStock = getSafetyStock(r.factory, r.matCode);
      r.availableQty = (r.unrestrictedQty || 0) + (r.qualityQty || 0);
      r.status = r.safetyStock > 0 && r.availableQty < r.safetyStock ? 'red' : 'green';
      return r;
    });
  },

  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;
    const displayType = document.getElementById('spDisplayType').value;
    const isSummary = displayType === '1';
    const isPlant = displayType === '2';
    const showExt = this.showExtCols;
    const locDesc = (f, l) => { const k = T001L_STORAGE_LOCATIONS[f+'|'+l]; return k ? k.lgort+' - '+k.desc : l; };

    document.getElementById('spCount').textContent = `共 ${this.filtered.length} 条`;
    document.getElementById('spPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('spPrev').disabled = this.page <= 1;
    document.getElementById('spNext').disabled = this.page >= totalPages;
    document.getElementById('spPageSizeSel').value = this.pageSize;
    this._syncToggleBtn();
    // 红绿灯图例只在工厂汇总档展示；展开按钮在工厂汇总档隐藏（无次要字段）
    const legendBar = document.getElementById('spLegendBar');
    if (legendBar) legendBar.style.display = isPlant ? 'flex' : 'none';
    const toggleBtn = document.getElementById('spToggleExt');
    if (toggleBtn) toggleBtn.style.display = isPlant ? 'none' : '';

    const fmtNum = n => n != null && n !== '' ? Number(n).toLocaleString() : '';
    const extTd = row => `${showExt
      ? `<td style="color:#64748b;">${esc(row.wbsNo||'-')}</td><td style="color:#64748b;">${esc(row.specialStock||'-')}</td><td style="color:#64748b;">${esc(row.customer||'-')}</td>`
      : ''}`;

    if (isSummary) {
      // 批次汇总档（库位层级）：不展示安全库存，红绿灯判断见工厂汇总档
      document.getElementById('spTableHead').innerHTML = `<tr>
        <th>工厂</th><th>库位</th><th>物料号</th><th>物料描述</th>
        <th>非限制库存</th><th>质检库存</th><th>冻结库存</th><th>单位</th>
        ${showExt ? '<th>WBS编号</th><th>特殊库存</th><th>客户</th>' : ''}
      </tr>`;
      document.getElementById('spTableBody').innerHTML = page.map(row => `
        <tr>
          <td>${esc(row.factory)}</td>
          <td>${esc(locDesc(row.factory, row.storageLoc))}</td>
          <td><strong style="color:var(--primary);">${esc(row.matCode)}</strong></td>
          <td>${esc(row.matDesc)}</td>
          <td style="text-align:right;color:#16a34a;font-weight:500;">${fmtNum(row.unrestrictedQty)}</td>
          <td style="text-align:right;color:#ca8a04;font-weight:500;">${fmtNum(row.qualityQty)}</td>
          <td style="text-align:right;color:#dc2626;font-weight:500;">${fmtNum(row.blockedQty)}</td>
          <td style="text-align:center;">${esc(row.unit)}</td>
          ${extTd(row)}
        </tr>`).join('');
    } else if (isPlant) {
      // 工厂汇总档：按 工厂+物料 聚合，红绿灯按工厂级安全库存判断
      document.getElementById('spTableHead').innerHTML = `<tr>
        <th>工厂</th><th>物料号</th><th>物料描述</th>
        <th>非限制库存</th><th>质检库存</th><th>冻结库存</th><th>单位</th>
        <th title="工厂级物料主数据中预先设置的静态安全库存值，不随库存变动">安全库存 <span style="color:#94a3b8;cursor:help;">ⓘ</span></th><th title="可用库存 = 非限制库存 + 质检库存（工厂全库位合计）；可用 ≥ 安全库存为绿灯，否则红灯">库存安全线状态 <span style="color:#94a3b8;cursor:help;">ⓘ</span></th>
      </tr>`;
      document.getElementById('spTableBody').innerHTML = page.map(row => {
        const isRed = row.status === 'red';
        return `<tr style="${isRed ? 'background:#fef2f2;' : ''}">
          <td>${esc(row.factory)}</td>
          <td><strong style="color:var(--primary);">${esc(row.matCode)}</strong></td>
          <td>${esc(row.matDesc)}</td>
          <td style="text-align:right;color:#16a34a;font-weight:500;">${fmtNum(row.unrestrictedQty)}</td>
          <td style="text-align:right;color:#ca8a04;font-weight:500;">${fmtNum(row.qualityQty)}</td>
          <td style="text-align:right;color:#dc2626;font-weight:500;">${fmtNum(row.blockedQty)}</td>
          <td style="text-align:center;">${esc(row.unit)}</td>
          <td style="text-align:right;font-weight:600;${isRed ? 'color:#dc2626;' : 'color:#16a34a;'}">${fmtNum(row.safetyStock)}</td>
          <td style="text-align:center;">${this._getStatusHtml(row.status)}</td>
        </tr>`;
      }).join('');
    } else {
      // 批次模式：主列固定，次要字段按需展开
      document.getElementById('spTableHead').innerHTML = `<tr>
        <th>工厂</th><th>库位</th><th>物料号</th><th>物料描述</th><th>批次</th>
        <th>非限制库存</th><th>质检库存</th><th>冻结库存</th><th>单位</th>
        ${showExt ? '<th>WBS编号</th><th>特殊库存</th><th>客户</th><th>供应商</th><th>供应商批次</th><th>生产日期</th><th>有效期至</th>' : ''}
      </tr>`;
      document.getElementById('spTableBody').innerHTML = page.map(row => `
        <tr>
          <td>${esc(row.factory)}</td>
          <td>${esc(locDesc(row.factory, row.storageLoc))}</td>
          <td><strong style="color:var(--primary);">${esc(row.matCode)}</strong></td>
          <td>${esc(row.matDesc)}</td>
          <td>${esc(row.batch)}</td>
          <td style="text-align:right;color:#16a34a;font-weight:500;">${fmtNum(row.unrestrictedQty)}</td>
          <td style="text-align:right;color:#ca8a04;font-weight:500;">${fmtNum(row.qualityQty)}</td>
          <td style="text-align:right;color:#dc2626;font-weight:500;">${fmtNum(row.blockedQty)}</td>
          <td style="text-align:center;">${esc(row.unit)}</td>
          ${showExt
            ? `<td style="color:#64748b;">${esc(row.wbsNo||'-')}</td><td style="color:#64748b;">${esc(row.specialStock||'-')}</td><td style="color:#64748b;">${esc(row.customer||'-')}</td><td style="color:#64748b;">${esc(row.vendor||'-')}</td>
               <td style="color:#64748b;">${esc(row.vendorBatch||'-')}</td><td style="color:#64748b;white-space:nowrap;">${esc(row.prodDate||'-')}</td>
               <td style="color:#64748b;white-space:nowrap;${row.isExpiringSoon ? 'color:#dc2626;font-weight:700;' : ''}">${esc(row.expiryDate||'-')}</td>`
            : ''}
        </tr>`).join('');
    }
  },

  _getStatusHtml(status) {
    if (status === 'green') {
      return '<span style="display:inline-flex;align-items:center;gap:4px;color:#16a34a;font-weight:600;"><span style="width:8px;height:8px;background:#16a34a;border-radius:50%;display:inline-block;"></span> 绿灯</span>';
    }
    return '<span style="display:inline-flex;align-items:center;gap:4px;color:#dc2626;font-weight:600;"><span style="width:8px;height:8px;background:#dc2626;border-radius:50%;display:inline-block;animation:pulse 1.5s infinite;"></span> 红灯</span>';
  },

  toggleExtCols() {
    this.showExtCols = !this.showExtCols;
    this.renderTable();
  },

  _syncToggleBtn() {
    const btn = document.getElementById('spToggleExt');
    if (btn) btn.textContent = this.showExtCols ? '收起次要字段' : '展开次要字段';
  },

  // 显示类型联动：工厂层级档隐藏 WBS编号/批次、置灰库存地点；其余档位恢复
  _syncFilterStates() {
    const isPlant = document.getElementById('spDisplayType').value === '2';
    const locSel = document.getElementById('spStorageLoc');
    const wbsGroup = document.getElementById('spWbsGroup');
    const batchGroup = document.getElementById('spBatchGroup');
    if (locSel) locSel.disabled = isPlant;
    if (wbsGroup) wbsGroup.style.display = isPlant ? 'none' : '';
    if (batchGroup) batchGroup.style.display = isPlant ? 'none' : '';
  },

  // 切换显示类型：切到工厂层级时清空无效筛选值，避免残留值参与查询
  onDisplayTypeChange() {
    if (document.getElementById('spDisplayType').value === '2') {
      document.getElementById('spStorageLoc').value = '';
      document.getElementById('spWbsNo').value = '';
      document.getElementById('spBatch').value = '';
    }
    this._syncFilterStates();
  },

  search() {
    const factory = document.getElementById('spFactory').value;
    const storageLoc = document.getElementById('spStorageLoc').value;
    const displayType = document.getElementById('spDisplayType').value;
    const wbsNo = document.getElementById('spWbsNo').value.trim();
    const matType = document.getElementById('spMatType').value;
    const matCode = document.getElementById('spMatCode').value.trim();
    const batch = document.getElementById('spBatch').value.trim();

    this.filtered = sparePartsStockData.filter(row => {
      if (this._isConfidential(row.factory, row.storageLoc)) return false;
      if (factory && row.factory !== factory) return false;
      if (storageLoc && (row.factory+'|'+row.storageLoc) !== storageLoc) return false;
      if (wbsNo && !(row.wbsNo || '').includes(wbsNo)) return false;
      if (matType && getMatType(row.matCode) !== matType) return false;
      if (matCode && !row.matCode.includes(matCode)) return false;
      if (batch && !row.batch.includes(batch)) return false;
      return true;
    });

    // 库位层级/工厂层级：按不同颗粒度聚合
    if (displayType === '1') this._aggregate();
    else if (displayType === '2') this._aggregateByPlant();

    this.page = 1;
    this.renderTable();
  },

  reset() {
    document.getElementById('spFactory').value = '';
    document.getElementById('spStorageLoc').value = '';
    document.getElementById('spDisplayType').value = '';
    document.getElementById('spWbsNo').value = '';
    document.getElementById('spMatType').value = '';
    document.getElementById('spMatCode').value = '';
    document.getElementById('spBatch').value = '';
    this.filtered = sparePartsStockData.filter(r => !this._isConfidential(r.factory, r.storageLoc));
    this._aggregate();
    this.page = 1;
    this.renderTable();
    this._syncFilterStates();
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() { if (this.page < Math.ceil(this.filtered.length/this.pageSize)) { this.page++; this.renderTable(); } },
  changePageSize() { this.pageSize = parseInt(document.getElementById('spPageSizeSel').value); this.page = 1; this.renderTable(); },

  exportData() {
    toast('数据导出功能开发中...');
  }
};

// ===== Demo Data for Spare Parts Stock =====
const sparePartsStockData = [
  { factory:'1000', storageLoc:'1001', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260304', unrestrictedQty:23280, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-10', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260305', unrestrictedQty:40800, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-19', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260305H', unrestrictedQty:120, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-10', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260306', unrestrictedQty:41160, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-25', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260307', unrestrictedQty:40680, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-26', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260308', unrestrictedQty:40800, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-28', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260308H', unrestrictedQty:120, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-26', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260401', unrestrictedQty:40920, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-04-07', expiryDate:'2028-03', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1001', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260402', unrestrictedQty:40680, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-04-08', expiryDate:'2028-03', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260403', unrestrictedQty:40800, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-04-09', expiryDate:'2028-03', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001', matCode:'10000010', matDesc:'阿莫西林胶囊-0.25g*24粒/盒', batch:'260201', unrestrictedQty:15000, qualityQty:500, blockedQty:200, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'山东鲁抗医药', vendorBatch:'LA-260201-01', prodDate:'2026-02-15', expiryDate:'2027-12', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1001', matCode:'10000010', matDesc:'阿莫西林胶囊-0.25g*24粒/盒', batch:'260205', unrestrictedQty:28000, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'山东鲁抗医药', vendorBatch:'LA-260205-01', prodDate:'2026-02-20', expiryDate:'2028-01', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001', matCode:'10000010', matDesc:'阿莫西林胶囊-0.25g*24粒/盒', batch:'260301', unrestrictedQty:25000, qualityQty:1000, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'华北制药', vendorBatch:'HB-260301-01', prodDate:'2026-03-05', expiryDate:'2028-01', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001', matCode:'10000011', matDesc:'头孢克肟分散片-0.1g*6片/盒', batch:'260110', unrestrictedQty:8500, qualityQty:300, blockedQty:150, unit:'盒', wbsNo:'PRJ-2026-001', specialStock:'E', customer:'', vendor:'白云山制药', vendorBatch:'BY-260110', prodDate:'2026-01-20', expiryDate:'2027-10', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1001', matCode:'10000011', matDesc:'头孢克肟分散片-0.1g*6片/盒', batch:'260210', unrestrictedQty:12000, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'白云山制药', vendorBatch:'BY-260210', prodDate:'2026-02-18', expiryDate:'2027-11', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1001', matCode:'10000011', matDesc:'头孢克肟分散片-0.1g*6片/盒', batch:'260315', unrestrictedQty:9600, qualityQty:400, blockedQty:null, unit:'盒', wbsNo:'PRJ-2026-002', specialStock:'E', customer:'', vendor:'白云山制药', vendorBatch:'BY-260315', prodDate:'2026-03-15', expiryDate:'2027-12', isExpiringSoon:false },
  { factory:'1000', storageLoc:'3001', matCode:'20000001', matDesc:'淀粉（药用级）-25kg/袋', batch:'250901', unrestrictedQty:500, qualityQty:null, blockedQty:50, unit:'袋', wbsNo:'', specialStock:'', customer:'', vendor:'山东西王集团', vendorBatch:'XW-250901', prodDate:'2025-09-10', expiryDate:'2027-09', isExpiringSoon:true },
  { factory:'1000', storageLoc:'3001', matCode:'20000001', matDesc:'淀粉（药用级）-25kg/袋', batch:'251101', unrestrictedQty:800, qualityQty:null, blockedQty:null, unit:'袋', wbsNo:'', specialStock:'', customer:'', vendor:'山东西王集团', vendorBatch:'XW-251101', prodDate:'2025-11-05', expiryDate:'2027-11', isExpiringSoon:false },
  { factory:'1000', storageLoc:'3001', matCode:'20000002', matDesc:'微晶纤维素 PH102-20kg/袋', batch:'260105', unrestrictedQty:200, qualityQty:50, blockedQty:null, unit:'袋', wbsNo:'', specialStock:'', customer:'', vendor:'安徽山河药辅', vendorBatch:'SH-260105', prodDate:'2026-01-15', expiryDate:'2028-01', isExpiringSoon:false },
  { factory:'1000', storageLoc:'3001', matCode:'20000002', matDesc:'微晶纤维素 PH102-20kg/袋', batch:'260220', unrestrictedQty:350, qualityQty:null, blockedQty:null, unit:'袋', wbsNo:'', specialStock:'', customer:'', vendor:'安徽山河药辅', vendorBatch:'SH-260220', prodDate:'2026-02-28', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'3001', matCode:'20000003', matDesc:'硬脂酸镁-10kg/桶', batch:'251208', unrestrictedQty:120, qualityQty:null, blockedQty:10, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'湖南尔康制药', vendorBatch:'EK-251208', prodDate:'2025-12-08', expiryDate:'2027-12', isExpiringSoon:false },
  { factory:'1000', storageLoc:'3001', matCode:'20000004', matDesc:'PVP K30-15kg/袋', batch:'260305', unrestrictedQty:180, qualityQty:20, blockedQty:null, unit:'袋', wbsNo:'', specialStock:'', customer:'', vendor:'巴斯夫中国', vendorBatch:'BF-260305', prodDate:'2026-03-05', expiryDate:'2028-03', isExpiringSoon:false },
  { factory:'1000', storageLoc:'4001', matCode:'30000001', matDesc:'铝塑泡罩包装膜-PVC/PVDC复合膜-1200m/卷', batch:'260210', unrestrictedQty:45, qualityQty:5, blockedQty:null, unit:'卷', wbsNo:'', specialStock:'', customer:'', vendor:'江苏中金玛泰', vendorBatch:'ZJ-260210', prodDate:'2026-02-10', expiryDate:'2029-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'4001', matCode:'30000001', matDesc:'铝塑泡罩包装膜-PVC/PVDC复合膜-1200m/卷', batch:'260318', unrestrictedQty:60, qualityQty:null, blockedQty:null, unit:'卷', wbsNo:'', specialStock:'', customer:'', vendor:'江苏中金玛泰', vendorBatch:'ZJ-260318', prodDate:'2026-03-18', expiryDate:'2029-03', isExpiringSoon:false },
  { factory:'1000', storageLoc:'4002', matCode:'30000002', matDesc:'口服固体药用高密度聚乙烯瓶-100ml-500个/箱', batch:'260115', unrestrictedQty:200, qualityQty:null, blockedQty:10, unit:'箱', wbsNo:'', specialStock:'', customer:'', vendor:'江苏华鼎新材', vendorBatch:'HD-260115', prodDate:'2026-01-15', expiryDate:'2030-01', isExpiringSoon:false },
  { factory:'1000', storageLoc:'4002', matCode:'30000002', matDesc:'口服固体药用高密度聚乙烯瓶-100ml-500个/箱', batch:'260308', unrestrictedQty:350, qualityQty:20, blockedQty:null, unit:'箱', wbsNo:'', specialStock:'', customer:'', vendor:'江苏华鼎新材', vendorBatch:'HD-260308', prodDate:'2026-03-08', expiryDate:'2030-03', isExpiringSoon:false },
  { factory:'1000', storageLoc:'4002', matCode:'30000003', matDesc:'药品说明书纸-80g双胶纸-10000张/捆', batch:'260225', unrestrictedQty:80, qualityQty:null, blockedQty:5, unit:'捆', wbsNo:'', specialStock:'', customer:'', vendor:'山东太阳纸业', vendorBatch:'TY-260225', prodDate:'2026-02-25', expiryDate:'2030-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'2018', matCode:'40000001', matDesc:'人血白蛋白-12.5g(25%,50ml)/瓶', batch:'260108', unrestrictedQty:200, qualityQty:50, blockedQty:10, unit:'瓶', wbsNo:'', specialStock:'', customer:'', vendor:'成都蓉生药业', vendorBatch:'RS-260108', prodDate:'2026-01-08', expiryDate:'2027-07', isExpiringSoon:true },
  { factory:'1000', storageLoc:'2018', matCode:'40000001', matDesc:'人血白蛋白-12.5g(25%,50ml)/瓶', batch:'260215', unrestrictedQty:300, qualityQty:null, blockedQty:null, unit:'瓶', wbsNo:'', specialStock:'', customer:'', vendor:'成都蓉生药业', vendorBatch:'RS-260215', prodDate:'2026-02-15', expiryDate:'2027-08', isExpiringSoon:true },
  { factory:'1000', storageLoc:'2018', matCode:'40000002', matDesc:'重组人干扰素α2b注射液-18μg:0.3ml/支', batch:'260320', unrestrictedQty:1500, qualityQty:200, blockedQty:50, unit:'支', wbsNo:'', specialStock:'', customer:'', vendor:'安徽安科生物', vendorBatch:'AK-260320', prodDate:'2026-03-20', expiryDate:'2027-06', isExpiringSoon:true },
  { factory:'2001', storageLoc:'1001', matCode:'50000001', matDesc:'7-氨基头孢烷酸(7-ACA)-1kg/桶', batch:'260118', unrestrictedQty:85, qualityQty:5, blockedQty:2, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'健康元海滨制药', vendorBatch:'JK-260118', prodDate:'2026-01-18', expiryDate:'2027-01', isExpiringSoon:true },
  { factory:'2001', storageLoc:'1001', matCode:'50000001', matDesc:'7-氨基头孢烷酸(7-ACA)-1kg/桶', batch:'260303', unrestrictedQty:120, qualityQty:null, blockedQty:null, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'健康元海滨制药', vendorBatch:'JK-260303', prodDate:'2026-03-03', expiryDate:'2027-03', isExpiringSoon:false },
  { factory:'2001', storageLoc:'1001', matCode:'50000002', matDesc:'青霉素G钾工业盐-25kg/桶', batch:'260212', unrestrictedQty:60, qualityQty:3, blockedQty:1, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'河南新乡华星', vendorBatch:'HX-260212', prodDate:'2026-02-12', expiryDate:'2027-08', isExpiringSoon:true },
  { factory:'2001', storageLoc:'6001', matCode:'60000001', matDesc:'头孢克肟活性酯-5kg/桶', batch:'260228', unrestrictedQty:35, qualityQty:2, blockedQty:1, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'浙江昂利康', vendorBatch:'AL-260228', prodDate:'2026-02-28', expiryDate:'2027-02', isExpiringSoon:true },
  { factory:'2001', storageLoc:'6001', matCode:'60000001', matDesc:'头孢克肟活性酯-5kg/桶', batch:'260310', unrestrictedQty:42, qualityQty:null, blockedQty:null, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'浙江昂利康', vendorBatch:'AL-260310', prodDate:'2026-03-10', expiryDate:'2027-03', isExpiringSoon:false },
  // ===== 红灯 Demo 数据（库存不足，触发安全库存预警）=====
  { factory:'1000', storageLoc:'5004', matCode:'60001018', matDesc:'高效过滤器-MIIPDF-635*520*93-27-AAF', batch:'251101', unrestrictedQty:8, qualityQty:2, blockedQty:null, unit:'个', wbsNo:'', specialStock:'', customer:'', vendor:'AAF国际', vendorBatch:'AAF-251101', prodDate:'2025-11-10', expiryDate:'2027-11', isExpiringSoon:false },
  { factory:'1000', storageLoc:'5004', matCode:'60001019', matDesc:'高效过滤器-MIIPDF-635*762*93-27-AAF', batch:'251201', unrestrictedQty:5, qualityQty:3, blockedQty:null, unit:'个', wbsNo:'', specialStock:'', customer:'', vendor:'AAF国际', vendorBatch:'AAF-251201', prodDate:'2025-12-05', expiryDate:'2027-12', isExpiringSoon:false },
  { factory:'1000', storageLoc:'5004', matCode:'60001021', matDesc:'高效过滤器-MIIPDF-635*1030*93-27-AAF', batch:'260101', unrestrictedQty:3, qualityQty:null, blockedQty:1, unit:'个', wbsNo:'', specialStock:'', customer:'', vendor:'AAF国际', vendorBatch:'AAF-260101', prodDate:'2026-01-08', expiryDate:'2028-01', isExpiringSoon:false },
  { factory:'1000', storageLoc:'5004', matCode:'60001146', matDesc:'隔膜阀膜片-尺寸:DN15-材质:PTFE/EPDM-宝帝', batch:'250801', unrestrictedQty:4, qualityQty:1, blockedQty:null, unit:'个', wbsNo:'', specialStock:'', customer:'', vendor:'宝帝流体', vendorBatch:'BD-250801', prodDate:'2025-08-15', expiryDate:'2027-08', isExpiringSoon:true },
  { factory:'1000', storageLoc:'5004', matCode:'60001147', matDesc:'隔膜阀膜片-尺寸:DN25-材质:PTFE/EPDM-宝帝', batch:'251001', unrestrictedQty:2, qualityQty:null, blockedQty:null, unit:'个', wbsNo:'', specialStock:'', customer:'', vendor:'宝帝流体', vendorBatch:'BD-251001', prodDate:'2025-10-20', expiryDate:'2027-10', isExpiringSoon:false },
  { factory:'1000', storageLoc:'5004', matCode:'60000655', matDesc:'LED灯泡-30W', batch:'260106', unrestrictedQty:35, qualityQty:10, blockedQty:null, unit:'个', wbsNo:'', specialStock:'', customer:'', vendor:'佛山照明', vendorBatch:'FS-260106', prodDate:'2026-01-06', expiryDate:'2029-01', isExpiringSoon:false },
  { factory:'1000', storageLoc:'5004', matCode:'60000656', matDesc:'LED灯泡-60W', batch:'260102', unrestrictedQty:20, qualityQty:null, blockedQty:5, unit:'个', wbsNo:'', specialStock:'', customer:'', vendor:'佛山照明', vendorBatch:'FS-260102', prodDate:'2026-01-02', expiryDate:'2029-01', isExpiringSoon:false },
  { factory:'1000', storageLoc:'5004', matCode:'60001271', matDesc:'304不锈钢培养皿架-90mm培养皿-放40个-带可翻转提手', batch:'251201', unrestrictedQty:2, qualityQty:null, blockedQty:null, unit:'个', wbsNo:'', specialStock:'', customer:'', vendor:'上海精密仪器', vendorBatch:'SP-251201', prodDate:'2025-12-18', expiryDate:'2030-12', isExpiringSoon:false },
  { factory:'1000', storageLoc:'5004', matCode:'60001207', matDesc:'砝码-F1等级 1000g', batch:'250601', unrestrictedQty:1, qualityQty:null, blockedQty:null, unit:'个', wbsNo:'', specialStock:'', customer:'', vendor:'赛多利斯', vendorBatch:'SL-250601', prodDate:'2025-06-15', expiryDate:'2030-06', isExpiringSoon:false },
  { factory:'1000', storageLoc:'5004', matCode:'60001128', matDesc:'初效过滤器-592*592*360-G4-袋式', batch:'251201', unrestrictedQty:12, qualityQty:3, blockedQty:null, unit:'个', wbsNo:'', specialStock:'', customer:'', vendor:'康斐尔', vendorBatch:'CF-251201', prodDate:'2025-12-28', expiryDate:'2027-12', isExpiringSoon:false },
  { factory:'1000', storageLoc:'5004', matCode:'60001131', matDesc:'初效过滤器-286*286*360-G4-袋式', batch:'260101', unrestrictedQty:5, qualityQty:null, blockedQty:null, unit:'个', wbsNo:'', specialStock:'', customer:'', vendor:'康斐尔', vendorBatch:'CF-260101', prodDate:'2026-01-20', expiryDate:'2028-01', isExpiringSoon:false }
];
