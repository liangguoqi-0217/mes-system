// ===== Spare Parts Stock Query Page =====
const SparePartsStock = {
  page: 1, pageSize: 15, filtered: [],

  render() {
    this.filtered = [...sparePartsStockData];
    this.page = 1;
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
            <option value="1000">1000 (山东寿光)</option>
            <option value="2000">2000 (江苏南通)</option>
            <option value="3000">3000 (浙江台州)</option>
          </select></div>
          <div class="filter-group"><label>库位</label><select id="spStorageLoc">
            <option value="">全部</option>
            <option value="1001">1001 (综合库-成品库)</option>
            <option value="1002">1002 (综合库-原材料库)</option>
            <option value="1003">1003 (综合库-包材库)</option>
            <option value="1004">1004 (冷库-冷链库)</option>
          </select></div>
          <div class="filter-group"><label>显示类型</label><select id="spDisplayType">
            <option value="summary" selected>显示汇总库存</option>
            <option value="batch">显示批次库存</option>
          </select></div>
          <div class="filter-group"><label>WBS编号</label><input type="text" id="spWbsNo" placeholder="WBS编号"></div>
          <div class="filter-group"><label>物料号</label><input type="text" id="spMatCode" placeholder="物料号"></div>
          <div class="filter-group"><label>库存类型</label><select id="spStockType">
            <option value="">全部库存</option>
            <option value="unrestricted">非限制使用</option>
            <option value="quality">质检中</option>
            <option value="blocked">冻结</option>
          </select></div>
          <div class="filter-group"><label>批次</label><input type="text" id="spBatch" placeholder="批次"></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="SparePartsStock.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="SparePartsStock.reset()">重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table">
            <thead id="spTableHead"><tr>
              <th>工厂</th><th>库位</th><th>物料号</th><th>物料描述</th><th>批次</th>
              <th>非限制库存</th><th>质检库存</th><th>冻结库存</th><th>单位</th>
              <th>WBS编号</th><th>特殊库存</th><th>客户</th><th>供应商</th>
              <th>供应商批次</th><th>生产日期</th><th>有效期至</th>
            </tr></thead>
            <tbody id="spTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info"><span class="list-count" id="spCount">共 ${this.filtered.length} 条</span></div>
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
    this.filtered = [...sparePartsStockData];
    this.page = 1;
    const displayType = document.getElementById('spDisplayType').value;
    if (displayType === 'summary') this._aggregate();
    this.renderTable();
  },

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

  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;
    const displayType = document.getElementById('spDisplayType').value;
    const isSummary = displayType === 'summary';

    document.getElementById('spCount').textContent = `共 ${this.filtered.length} 条`;
    document.getElementById('spPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('spPrev').disabled = this.page <= 1;
    document.getElementById('spNext').disabled = this.page >= totalPages;
    document.getElementById('spPageSizeSel').value = this.pageSize;

    // Update table head based on display type
    document.getElementById('spTableHead').innerHTML = isSummary
      ? `<tr>
          <th>工厂</th><th>库位</th><th>物料号</th><th>物料描述</th>
          <th>非限制库存</th><th>质检库存</th><th>冻结库存</th><th>单位</th>
          <th>WBS编号</th><th>特殊库存</th><th>客户</th>
        </tr>`
      : `<tr>
          <th>工厂</th><th>库位</th><th>物料号</th><th>物料描述</th><th>批次</th>
          <th>非限制库存</th><th>质检库存</th><th>冻结库存</th><th>单位</th>
          <th>WBS编号</th><th>特殊库存</th><th>客户</th><th>供应商</th>
          <th>供应商批次</th><th>生产日期</th><th>有效期至</th>
        </tr>`;

    const fmtNum = n => n != null && n !== '' ? Number(n).toLocaleString() : '';
    document.getElementById('spTableBody').innerHTML = page.map(row => isSummary
      ? `<tr>
          <td>${esc(row.factory)}</td>
          <td>${esc(row.storageLoc)}</td>
          <td><strong style="color:var(--primary);">${esc(row.matCode)}</strong></td>
          <td>${esc(row.matDesc)}</td>
          <td style="text-align:right;color:#16a34a;">${fmtNum(row.unrestrictedQty)}</td>
          <td style="text-align:right;color:#ca8a04;">${fmtNum(row.qualityQty)}</td>
          <td style="text-align:right;color:#dc2626;">${fmtNum(row.blockedQty)}</td>
          <td style="text-align:center;">${esc(row.unit)}</td>
          <td>${esc(row.wbsNo||'-')}</td>
          <td>${esc(row.specialStock||'-')}</td>
          <td>${esc(row.customer||'-')}</td>
        </tr>`
      : `<tr>
          <td>${esc(row.factory)}</td>
          <td>${esc(row.storageLoc)}</td>
          <td><strong style="color:var(--primary);">${esc(row.matCode)}</strong></td>
          <td>${esc(row.matDesc)}</td>
          <td>${esc(row.batch)}</td>
          <td style="text-align:right;color:#16a34a;">${fmtNum(row.unrestrictedQty)}</td>
          <td style="text-align:right;color:#ca8a04;">${fmtNum(row.qualityQty)}</td>
          <td style="text-align:right;color:#dc2626;">${fmtNum(row.blockedQty)}</td>
          <td style="text-align:center;">${esc(row.unit)}</td>
          <td>${esc(row.wbsNo||'-')}</td>
          <td>${esc(row.specialStock||'-')}</td>
          <td>${esc(row.customer||'-')}</td>
          <td>${esc(row.vendor||'-')}</td>
          <td>${esc(row.vendorBatch||'-')}</td>
          <td style="white-space:nowrap;">${esc(row.prodDate||'-')}</td>
          <td style="white-space:nowrap;${row.isExpiringSoon ? 'color:#dc2626;font-weight:700;' : ''}">${esc(row.expiryDate||'-')}</td>
        </tr>`
    ).join('');
  },

  search() {
    const factory = document.getElementById('spFactory').value;
    const storageLoc = document.getElementById('spStorageLoc').value;
    const displayType = document.getElementById('spDisplayType').value;
    const wbsNo = document.getElementById('spWbsNo').value.trim();
    const matCode = document.getElementById('spMatCode').value.trim();
    const stockType = document.getElementById('spStockType').value;
    const batch = document.getElementById('spBatch').value.trim();

    this.filtered = sparePartsStockData.filter(row => {
      if (factory && row.factory !== factory) return false;
      if (storageLoc && row.storageLoc !== storageLoc) return false;
      if (wbsNo && !(row.wbsNo || '').includes(wbsNo)) return false;
      if (matCode && !row.matCode.includes(matCode)) return false;
      if (batch && !row.batch.includes(batch)) return false;
      // Stock type filter
      if (stockType === 'unrestricted' && (!row.unrestrictedQty || row.unrestrictedQty <= 0)) return false;
      if (stockType === 'quality' && (!row.qualityQty || row.qualityQty <= 0)) return false;
      if (stockType === 'blocked' && (!row.blockedQty || row.blockedQty <= 0)) return false;
      return true;
    });

    // Summary mode: aggregate by matCode + storageLoc + factory
    if (displayType === 'summary') this._aggregate();

    this.page = 1;
    this.renderTable();
  },

  reset() {
    document.getElementById('spFactory').value = '';
    document.getElementById('spStorageLoc').value = '';
    document.getElementById('spDisplayType').value = 'summary';
    document.getElementById('spWbsNo').value = '';
    document.getElementById('spMatCode').value = '';
    document.getElementById('spStockType').value = '';
    document.getElementById('spBatch').value = '';
    this.filtered = [...sparePartsStockData];
    this._aggregate();
    this.page = 1;
    this.renderTable();
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
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260304', unrestrictedQty:23280, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-10', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260305', unrestrictedQty:40800, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-19', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260305H', unrestrictedQty:120, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-10', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260306', unrestrictedQty:41160, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-25', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260307', unrestrictedQty:40680, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-26', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260308', unrestrictedQty:40800, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-28', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260308H', unrestrictedQty:120, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-26', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260401', unrestrictedQty:40920, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-04-07', expiryDate:'2028-03', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260402', unrestrictedQty:40680, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-04-08', expiryDate:'2028-03', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260403', unrestrictedQty:40800, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-04-09', expiryDate:'2028-03', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000010', matDesc:'阿莫西林胶囊-0.25g*24粒/盒', batch:'260201', unrestrictedQty:15000, qualityQty:500, blockedQty:200, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'山东鲁抗医药', vendorBatch:'LA-260201-01', prodDate:'2026-02-15', expiryDate:'2027-12', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000010', matDesc:'阿莫西林胶囊-0.25g*24粒/盒', batch:'260205', unrestrictedQty:28000, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'山东鲁抗医药', vendorBatch:'LA-260205-01', prodDate:'2026-02-20', expiryDate:'2028-01', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000010', matDesc:'阿莫西林胶囊-0.25g*24粒/盒', batch:'260301', unrestrictedQty:25000, qualityQty:1000, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'华北制药', vendorBatch:'HB-260301-01', prodDate:'2026-03-05', expiryDate:'2028-01', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000011', matDesc:'头孢克肟分散片-0.1g*6片/盒', batch:'260110', unrestrictedQty:8500, qualityQty:300, blockedQty:150, unit:'盒', wbsNo:'PRJ-2026-001', specialStock:'E', customer:'', vendor:'白云山制药', vendorBatch:'BY-260110', prodDate:'2026-01-20', expiryDate:'2027-10', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000011', matDesc:'头孢克肟分散片-0.1g*6片/盒', batch:'260210', unrestrictedQty:12000, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'白云山制药', vendorBatch:'BY-260210', prodDate:'2026-02-18', expiryDate:'2027-11', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000011', matDesc:'头孢克肟分散片-0.1g*6片/盒', batch:'260315', unrestrictedQty:9600, qualityQty:400, blockedQty:null, unit:'盒', wbsNo:'PRJ-2026-002', specialStock:'E', customer:'', vendor:'白云山制药', vendorBatch:'BY-260315', prodDate:'2026-03-15', expiryDate:'2027-12', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1002-综合库-原材料库', matCode:'20000001', matDesc:'淀粉（药用级）-25kg/袋', batch:'250901', unrestrictedQty:500, qualityQty:null, blockedQty:50, unit:'袋', wbsNo:'', specialStock:'', customer:'', vendor:'山东西王集团', vendorBatch:'XW-250901', prodDate:'2025-09-10', expiryDate:'2027-09', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1002-综合库-原材料库', matCode:'20000001', matDesc:'淀粉（药用级）-25kg/袋', batch:'251101', unrestrictedQty:800, qualityQty:null, blockedQty:null, unit:'袋', wbsNo:'', specialStock:'', customer:'', vendor:'山东西王集团', vendorBatch:'XW-251101', prodDate:'2025-11-05', expiryDate:'2027-11', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1002-综合库-原材料库', matCode:'20000002', matDesc:'微晶纤维素 PH102-20kg/袋', batch:'260105', unrestrictedQty:200, qualityQty:50, blockedQty:null, unit:'袋', wbsNo:'', specialStock:'', customer:'', vendor:'安徽山河药辅', vendorBatch:'SH-260105', prodDate:'2026-01-15', expiryDate:'2028-01', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1002-综合库-原材料库', matCode:'20000002', matDesc:'微晶纤维素 PH102-20kg/袋', batch:'260220', unrestrictedQty:350, qualityQty:null, blockedQty:null, unit:'袋', wbsNo:'', specialStock:'', customer:'', vendor:'安徽山河药辅', vendorBatch:'SH-260220', prodDate:'2026-02-28', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1002-综合库-原材料库', matCode:'20000003', matDesc:'硬脂酸镁-10kg/桶', batch:'251208', unrestrictedQty:120, qualityQty:null, blockedQty:10, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'湖南尔康制药', vendorBatch:'EK-251208', prodDate:'2025-12-08', expiryDate:'2027-12', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1002-综合库-原材料库', matCode:'20000004', matDesc:'PVP K30-15kg/袋', batch:'260305', unrestrictedQty:180, qualityQty:20, blockedQty:null, unit:'袋', wbsNo:'', specialStock:'', customer:'', vendor:'巴斯夫中国', vendorBatch:'BF-260305', prodDate:'2026-03-05', expiryDate:'2028-03', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1003-综合库-包材库', matCode:'30000001', matDesc:'铝塑泡罩包装膜-PVC/PVDC复合膜-1200m/卷', batch:'260210', unrestrictedQty:45, qualityQty:5, blockedQty:null, unit:'卷', wbsNo:'', specialStock:'', customer:'', vendor:'江苏中金玛泰', vendorBatch:'ZJ-260210', prodDate:'2026-02-10', expiryDate:'2029-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1003-综合库-包材库', matCode:'30000001', matDesc:'铝塑泡罩包装膜-PVC/PVDC复合膜-1200m/卷', batch:'260318', unrestrictedQty:60, qualityQty:null, blockedQty:null, unit:'卷', wbsNo:'', specialStock:'', customer:'', vendor:'江苏中金玛泰', vendorBatch:'ZJ-260318', prodDate:'2026-03-18', expiryDate:'2029-03', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1003-综合库-包材库', matCode:'30000002', matDesc:'口服固体药用高密度聚乙烯瓶-100ml-500个/箱', batch:'260115', unrestrictedQty:200, qualityQty:null, blockedQty:10, unit:'箱', wbsNo:'', specialStock:'', customer:'', vendor:'江苏华鼎新材', vendorBatch:'HD-260115', prodDate:'2026-01-15', expiryDate:'2030-01', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1003-综合库-包材库', matCode:'30000002', matDesc:'口服固体药用高密度聚乙烯瓶-100ml-500个/箱', batch:'260308', unrestrictedQty:350, qualityQty:20, blockedQty:null, unit:'箱', wbsNo:'', specialStock:'', customer:'', vendor:'江苏华鼎新材', vendorBatch:'HD-260308', prodDate:'2026-03-08', expiryDate:'2030-03', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1003-综合库-包材库', matCode:'30000003', matDesc:'药品说明书纸-80g双胶纸-10000张/捆', batch:'260225', unrestrictedQty:80, qualityQty:null, blockedQty:5, unit:'捆', wbsNo:'', specialStock:'', customer:'', vendor:'山东太阳纸业', vendorBatch:'TY-260225', prodDate:'2026-02-25', expiryDate:'2030-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1004-冷库-冷链库', matCode:'40000001', matDesc:'人血白蛋白-12.5g(25%,50ml)/瓶', batch:'260108', unrestrictedQty:200, qualityQty:50, blockedQty:10, unit:'瓶', wbsNo:'', specialStock:'', customer:'', vendor:'成都蓉生药业', vendorBatch:'RS-260108', prodDate:'2026-01-08', expiryDate:'2027-07', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1004-冷库-冷链库', matCode:'40000001', matDesc:'人血白蛋白-12.5g(25%,50ml)/瓶', batch:'260215', unrestrictedQty:300, qualityQty:null, blockedQty:null, unit:'瓶', wbsNo:'', specialStock:'', customer:'', vendor:'成都蓉生药业', vendorBatch:'RS-260215', prodDate:'2026-02-15', expiryDate:'2027-08', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1004-冷库-冷链库', matCode:'40000002', matDesc:'重组人干扰素α2b注射液-18μg:0.3ml/支', batch:'260320', unrestrictedQty:1500, qualityQty:200, blockedQty:50, unit:'支', wbsNo:'', specialStock:'', customer:'', vendor:'安徽安科生物', vendorBatch:'AK-260320', prodDate:'2026-03-20', expiryDate:'2027-06', isExpiringSoon:true },
  { factory:'2000', storageLoc:'2001-原料仓库-A区', matCode:'50000001', matDesc:'7-氨基头孢烷酸(7-ACA)-1kg/桶', batch:'260118', unrestrictedQty:85, qualityQty:5, blockedQty:2, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'健康元海滨制药', vendorBatch:'JK-260118', prodDate:'2026-01-18', expiryDate:'2027-01', isExpiringSoon:true },
  { factory:'2000', storageLoc:'2001-原料仓库-A区', matCode:'50000001', matDesc:'7-氨基头孢烷酸(7-ACA)-1kg/桶', batch:'260303', unrestrictedQty:120, qualityQty:null, blockedQty:null, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'健康元海滨制药', vendorBatch:'JK-260303', prodDate:'2026-03-03', expiryDate:'2027-03', isExpiringSoon:false },
  { factory:'2000', storageLoc:'2001-原料仓库-A区', matCode:'50000002', matDesc:'青霉素G钾工业盐-25kg/桶', batch:'260212', unrestrictedQty:60, qualityQty:3, blockedQty:1, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'河南新乡华星', vendorBatch:'HX-260212', prodDate:'2026-02-12', expiryDate:'2027-08', isExpiringSoon:true },
  { factory:'2000', storageLoc:'2002-中间体库-B区', matCode:'60000001', matDesc:'头孢克肟活性酯-5kg/桶', batch:'260228', unrestrictedQty:35, qualityQty:2, blockedQty:1, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'浙江昂利康', vendorBatch:'AL-260228', prodDate:'2026-02-28', expiryDate:'2027-02', isExpiringSoon:true },
  { factory:'2000', storageLoc:'2002-中间体库-B区', matCode:'60000001', matDesc:'头孢克肟活性酯-5kg/桶', batch:'260310', unrestrictedQty:42, qualityQty:null, blockedQty:null, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'浙江昂利康', vendorBatch:'AL-260310', prodDate:'2026-03-10', expiryDate:'2027-03', isExpiringSoon:false }
];
