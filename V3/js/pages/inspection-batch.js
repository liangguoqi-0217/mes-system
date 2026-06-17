// ===== 检验批管理页面 =====
// PRD v1.0 - 质量管理 → 质量检验 → 检验批管理
const InspectionBatch = {
  activeTab: 'pending', // 'pending' | 'list'
  page: 1, pageSize: 10,
  filtered: [],

  // ==================== 模拟数据 ====================

  // 待生成检验批的物料凭证（从 SAP 抽取）
  pendingDocs: [
    { id:'MD001', docNo:'4900000123', year:'2026', materialCode:'MAT-10001', materialName:'阿莫西林原料药', sapBatch:'SAP-BT-20260601', supplierBatch:'SUP-LOT-20260614-001', movementType:'101', movementName:'采购收货', quantity:'500.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', storageLocation:'SL01', storageName:'原材料仓库', receiptDate:'2026-06-14', status:'INIT' },
    { id:'MD002', docNo:'4900000124', year:'2026', materialCode:'MAT-10002', materialName:'淀粉辅料', sapBatch:'SAP-BT-20260602', supplierBatch:'SUP-LOT-20260614-002', movementType:'101', movementName:'采购收货', quantity:'1000.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', storageLocation:'SL01', storageName:'原材料仓库', receiptDate:'2026-06-14', status:'INIT' },
    { id:'MD003', docNo:'4900000125', year:'2026', materialCode:'MAT-10003', materialName:'硬脂酸镁', sapBatch:'SAP-BT-20260603', supplierBatch:'SUP-LOT-20260615-001', movementType:'101', movementName:'采购收货', quantity:'25.000', unit:'KG', plant:'2001', plantName:'陕西步长制药工厂', storageLocation:'SL01', storageName:'原材料仓库', receiptDate:'2026-06-15', status:'INIT' },
    { id:'MD004', docNo:'4900000126', year:'2026', materialCode:'MAT-20001', materialName:'胶囊壳#0', sapBatch:'SAP-BT-20260604', supplierBatch:'SUP-LOT-20260615-002', movementType:'101', movementName:'采购收货', quantity:'500000.000', unit:'EA', plant:'1000', plantName:'山东步长制药工厂', storageLocation:'SL02', storageName:'包材仓库', receiptDate:'2026-06-15', status:'INIT' },
    { id:'MD005', docNo:'4900000127', year:'2026', materialCode:'MAT-10004', materialName:'对乙酰氨基酚', sapBatch:'SAP-BT-20260605', supplierBatch:'SUP-LOT-20260616-001', movementType:'101', movementName:'采购收货', quantity:'300.000', unit:'KG', plant:'2002', plantName:'山东丹红制药工厂', storageLocation:'SL01', storageName:'原材料仓库', receiptDate:'2026-06-16', status:'INIT' }
  ],

  // 已生成的检验批
  batchData: [
    { id:'B001', batchNo:'1000-IL-20260614-001', docNo:'4900000100', materialCode:'MAT-10005', materialName:'布洛芬原料药', sapBatch:'SAP-BT-20260501', supplierBatch:'SUP-LOT-20260601-001', quantity:'200.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-001', purposeCode:'QC-01', purposeName:'来料检验', status:'CRTD', statusName:'已创建', createTime:'2026-06-14 09:00:00', createBy:'张工', updateTime:'2026-06-14 09:00:00' },
    { id:'B002', batchNo:'1000-IL-20260614-002', docNo:'4900000101', materialCode:'MAT-10006', materialName:'维生素C原料', sapBatch:'SAP-BT-20260502', supplierBatch:'SUP-LOT-20260602-002', quantity:'150.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-002', purposeCode:'QC-01', purposeName:'来料检验', status:'SAMP', statusName:'取样中', createTime:'2026-06-14 10:30:00', createBy:'李工', updateTime:'2026-06-14 14:00:00' },
    { id:'B003', batchNo:'1000-IL-20260615-001', docNo:'4900000102', materialCode:'MAT-10007', materialName:'葡萄糖原料', sapBatch:'SAP-BT-20260510', supplierBatch:'SUP-LOT-20260605-003', quantity:'800.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-001', purposeCode:'QC-01', purposeName:'来料检验', status:'INSP', statusName:'检验中', createTime:'2026-06-15 08:15:00', createBy:'张工', updateTime:'2026-06-16 09:00:00' },
    { id:'B004', batchNo:'2001-IL-20260616-001', docNo:'4900000103', materialCode:'MAT-10008', materialName:'盐酸克林霉素', sapBatch:'SAP-BT-20260512', supplierBatch:'SUP-LOT-20260608-004', quantity:'50.000', unit:'KG', plant:'2001', plantName:'陕西步长制药工厂', planNo:'IP-2001-001', purposeCode:'QC-02', purposeName:'中间品检验', status:'DONE', statusName:'检验完成', createTime:'2026-06-16 11:00:00', createBy:'王工', updateTime:'2026-06-17 08:30:00' },
    { id:'B005', batchNo:'2002-IL-20260613-001', docNo:'4900000104', materialCode:'MAT-20002', materialName:'注射用水', sapBatch:'SAP-BT-20260515', supplierBatch:'SUP-LOT-20260610-005', quantity:'2000.000', unit:'L', plant:'2002', plantName:'山东丹红制药工厂', planNo:'IP-2002-001', purposeCode:'QC-03', purposeName:'成品检验', status:'DEC', statusName:'已决策', createTime:'2026-06-13 07:00:00', createBy:'赵工', updateTime:'2026-06-14 16:00:00', decision:'release', decisionBy:'QA经理', decisionTime:'2026-06-14 16:00:00' },
    { id:'B006', batchNo:'1000-IL-20260612-001', docNo:'4900000105', materialCode:'MAT-10009', materialName:'甘露醇辅料', sapBatch:'SAP-BT-20260518', supplierBatch:'SUP-LOT-20260612-006', quantity:'100.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-001', purposeCode:'QC-01', purposeName:'来料检验', status:'CLSD', statusName:'已关闭', createTime:'2026-06-12 09:30:00', createBy:'张工', updateTime:'2026-06-13 17:00:00', decision:'release', decisionBy:'QA经理', decisionTime:'2026-06-13 10:00:00', closeTime:'2026-06-13 17:00:00' },
    { id:'B007', batchNo:'1000-IL-20260611-001', docNo:'4900000106', materialCode:'MAT-10010', materialName:'微晶纤维素', sapBatch:'SAP-BT-20260520', supplierBatch:'SUP-LOT-20260613-007', quantity:'300.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-002', purposeCode:'QC-01', purposeName:'来料检验', status:'CANC', statusName:'已取消', createTime:'2026-06-11 10:00:00', createBy:'李工', updateTime:'2026-06-12 08:00:00', cancelReason:'SAP 凭证冲销，自动取消' }
  ],

  // 检验计划选项（从 ipData 动态构建）
  getPlanOptions(materialCode) {
    // 优先匹配当前物料，其余排在后面
    const all = (typeof ipData !== 'undefined' ? ipData : []).filter(p => p.status === 'active');
    const matched = all.filter(p => p.materialCode === materialCode);
    const others = all.filter(p => p.materialCode !== materialCode);
    return [...matched, ...others].map(p => ({ no: p.code, name: p.materialName + ' - ' + p.purposeName, plan: p }));
  },

  // 用途代码选项
  purposeOptions: [
    { code:'QC-01', name:'来料检验' },
    { code:'QC-02', name:'中间品检验' },
    { code:'QC-03', name:'成品检验' },
    { code:'QC-04', name:'稳定性考察' }
  ],

  // 工厂选项
  factoryOptions: [
    { code:'1000', name:'山东步长制药工厂' },
    { code:'2001', name:'陕西步长制药工厂' },
    { code:'2002', name:'山东丹红制药工厂' }
  ],

  // ==================== 渲染页面 ====================

  render() {
    this.page = 1;
    return `
      <div class="ib-page" style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <!-- 顶部标题栏 -->
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">检验批管理</div>
            <div style="font-size:13px;opacity:0.8;">质量管理 → 质量检验 → 检验批管理</div>
          </div>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.25);" onclick="InspectionBatch.refresh()">🔄 刷新数据</button>
        </div>

        <!-- Tabs -->
        <div class="tabs" style="margin:0;padding:0 24px;background:white;border-bottom:1px solid var(--border);flex-shrink:0;">
          <div class="tab ${this.activeTab==='pending'?'active':''}" id="ibTabPending" onclick="InspectionBatch.switchTab('pending')">⏳ 待生成检验批 <span class="badge badge-yellow badge-sm" style="margin-left:4px;">${this.pendingDocs.length}</span></div>
          <div class="tab ${this.activeTab==='list'?'active':''}" id="ibTabList" onclick="InspectionBatch.switchTab('list')">📋 检验批列表</div>
        </div>

        <!-- 统计卡片（仅列表tab显示） -->
        <div id="ibStatsRow" style="flex-shrink:0;${this.activeTab==='list'?'':'display:none;'}"></div>

        <!-- 筛选栏 -->
        <div id="ibFilterBar" style="flex-shrink:0;"></div>

        <!-- 表格区域 -->
        <div class="table-wrapper" style="flex:1;overflow:auto;" id="ibTableWrapper"></div>

        <!-- 底部分页 -->
        <div id="ibPagination" style="flex-shrink:0;"></div>
      </div>`;
  },

  init() {
    this.renderStats();
    this.renderFilterBar();
    this.renderTable();
    this.renderPagination();
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.page = 1;
    document.getElementById('ibTabList').className = 'tab' + (tab==='list'?' active':'');
    document.getElementById('ibTabPending').className = 'tab' + (tab==='pending'?' active':'');
    document.getElementById('ibStatsRow').style.display = tab==='list'?'':'none';
    this.init();
  },

  refresh() {
    this.init();
    toast('数据已刷新');
  },

  // ==================== 统计卡片 ====================

  renderStats() {
    const stats = this.getStats();
    const el = document.getElementById('ibStatsRow');
    if (!el) return;
    el.innerHTML = stats;
  },

  getStats() {
    const d = this.batchData;
    const total = d.length;
    const crtd = d.filter(b => b.status==='CRTD').length;
    const samp = d.filter(b => b.status==='SAMP'||b.status==='INSP').length;
    const done = d.filter(b => b.status==='DONE').length;
    const today = d.filter(b => b.createTime && b.createTime.startsWith('2026-06-17')).length;

    return `<div class="stats-row" style="padding:12px 24px 0;">
      <div class="stat-card"><div class="stat-icon blue">📊</div><div><div class="stat-label">检验批总数</div><div class="stat-value">${total}</div></div></div>
      <div class="stat-card"><div class="stat-icon yellow">⏳</div><div><div class="stat-label">待处理</div><div class="stat-value">${crtd+samp}</div></div></div>
      <div class="stat-card"><div class="stat-icon green">✅</div><div><div class="stat-label">已完成</div><div class="stat-value">${done}</div></div></div>
      <div class="stat-card"><div class="stat-icon blue">📅</div><div><div class="stat-label">今日新增</div><div class="stat-value">${today}</div></div></div>
    </div>`;
  },

  // ==================== 筛选栏 ====================

  renderFilterBar() {
    const el = document.getElementById('ibFilterBar');
    if (!el) return;

    if (this.activeTab === 'list') {
      el.innerHTML = `<div class="filter-bar">
        <div class="filter-group"><label>工厂</label><select id="ibFactory">
          <option value="">全部</option>
          ${this.factoryOptions.map(f => `<option value="${f.code}">${f.name}</option>`).join('')}
        </select></div>
        <div class="filter-group"><label>物料编码</label><input type="text" id="ibMaterial" placeholder="模糊查询"></div>
        <div class="filter-group"><label>供应商批次号</label><input type="text" id="ibSuppBatch" placeholder="模糊查询"></div>
        <div class="filter-group"><label>SAP批次号</label><input type="text" id="ibSapBatch" placeholder="模糊查询"></div>
        <div class="filter-group"><label>状态</label><select id="ibStatus">
          <option value="">全部</option>
          <option value="CRTD">已创建</option>
          <option value="SAMP">取样中</option>
          <option value="INSP">检验中</option>
          <option value="DONE">检验完成</option>
          <option value="DEC">已决策</option>
          <option value="CLSD">已关闭</option>
          <option value="CANC">已取消</option>
        </select></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="InspectionBatch.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="InspectionBatch.resetFilter()">重置</button>
        </div>
      </div>`;
    } else {
      el.innerHTML = `<div class="filter-bar">
        <div class="filter-group"><label>工厂</label><select id="ibPendFactory">
          <option value="">全部</option>
          ${this.factoryOptions.map(f => `<option value="${f.code}">${f.name}</option>`).join('')}
        </select></div>
        <div class="filter-group"><label>物料编码</label><input type="text" id="ibPendMaterial" placeholder="模糊查询"></div>
        <div class="filter-group"><label>供应商批次号</label><input type="text" id="ibPendSuppBatch" placeholder="模糊查询"></div>
        <div class="filter-group"><label>SAP批次号</label><input type="text" id="ibPendSapBatch" placeholder="模糊查询"></div>
        <div class="filter-group"><label>过账日期</label><input type="date" id="ibPendReceiptDate"></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="InspectionBatch.searchPending()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="InspectionBatch.resetPendingFilter()">重置</button>
        </div>
      </div>`;
    }
  },

  search() {
    const factory = document.getElementById('ibFactory')?.value||'';
    const material = (document.getElementById('ibMaterial')?.value||'').trim();
    const suppBatch = (document.getElementById('ibSuppBatch')?.value||'').trim();
    const sapBatch = (document.getElementById('ibSapBatch')?.value||'').trim();
    const status = document.getElementById('ibStatus')?.value||'';

    this.filtered = this.batchData.filter(b => {
      if (factory && b.plant !== factory) return false;
      if (material && !b.materialCode.includes(material) && !b.materialName.includes(material)) return false;
      if (suppBatch && !b.supplierBatch.toLowerCase().includes(suppBatch.toLowerCase())) return false;
      if (sapBatch && !b.sapBatch.toLowerCase().includes(sapBatch.toLowerCase())) return false;
      if (status && b.status !== status) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
    this.renderPagination();
  },

  resetFilter() {
    ['ibMaterial','ibSuppBatch','ibSapBatch'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const s = document.getElementById('ibStatus'); if (s) s.value = '';
    const f = document.getElementById('ibFactory'); if (f) f.value = '';
    this.filtered = [...this.batchData];
    this.page = 1;
    this.renderTable();
    this.renderPagination();
  },

  // ==================== 检验批表格 ====================

  renderTable() {
    if (this.activeTab === 'list') {
      this.filtered = [...this.batchData];
      this.renderBatchTable();
    } else {
      this.renderPendingTable();
    }
  },

  renderBatchTable() {
    const start = (this.page-1)*this.pageSize;
    const page = this.filtered.slice(start, start+this.pageSize);
    const el = document.getElementById('ibTableWrapper');
    if (!el) return;

    el.innerHTML = `<table class="data-table" style="min-width:1400px;">
      <thead><tr>
        <th style="width:50px;">序号</th>
        <th style="width:200px;">检验批号</th>
        <th style="width:150px;">供应商批次号</th>
        <th style="width:120px;">物料编码</th>
        <th style="width:140px;">物料名称</th>
        <th style="width:100px;">检验计划</th>
        <th style="width:80px;">数量</th>
        <th style="width:80px;">状态</th>
        <th style="width:100px;">工厂</th>
        <th style="width:80px;">创建人</th>
        <th style="width:140px;">创建时间</th>
        <th style="width:140px;">更新时间</th>
        <th style="width:160px;">操作</th>
      </tr></thead>
      <tbody>${page.map((b,i) => this.renderBatchRow(b, start+i+1)).join('')}</tbody>
    </table>`;
  },

  renderBatchRow(b, idx) {
    const statusBadge = this.getStatusBadgeHtml(b.status);
    return `<tr>
      <td>${idx}</td>
      <td style="color:#2563eb;font-weight:600;font-family:monospace;font-size:12px;">${esc(b.batchNo)}</td>
      <td style="font-weight:700;font-size:13px;">${esc(b.supplierBatch)}</td>
      <td style="font-family:monospace;font-size:12px;">${esc(b.materialCode)}</td>
      <td>${esc(b.materialName)}</td>
      <td style="font-family:monospace;font-size:11px;">${esc(b.planNo)}</td>
      <td>${b.quantity} ${esc(b.unit)}</td>
      <td>${statusBadge}</td>
      <td>${esc(b.plantName)}</td>
      <td>${esc(b.createBy)}</td>
      <td style="font-size:12px;">${b.createTime||'—'}</td>
      <td style="font-size:12px;">${b.updateTime||'—'}</td>
      <td><div class="table-actions">${this.getBatchActions(b)}</div></td>
    </tr>`;
  },

  getStatusBadgeHtml(status) {
    const map = {
      CRTD: { cls:'badge-blue', label:'已创建' },
      SAMP: { cls:'badge-yellow', label:'取样中' },
      INSP: { cls:'badge-purple', label:'检验中' },
      DONE: { cls:'badge-green', label:'检验完成' },
      DEC:  { cls:'badge-blue', label:'已决策' },
      CLSD: { cls:'badge-gray', label:'已关闭' },
      CANC: { cls:'badge-red', label:'已取消' }
    };
    const m = map[status] || { cls:'badge-gray', label:status };
    return `<span class="badge ${m.cls}">${m.label}</span>`;
  },

  getBatchActions(b) {
    return `<button class="btn btn-sm btn-outline" onclick="InspectionBatch.openDetail('${b.id}')" title="查看详情">查看</button>`;
  },

  // ==================== 待生成检验批表格 ====================

  renderPendingTable() {
    this.pendingFiltered = [...this.pendingDocs];
    this.pendingPage = 1;
    this.doRenderPendingTable();
  },

  doRenderPendingTable() {
    const start = (this.pendingPage-1)*this.pageSize;
    const page = this.pendingFiltered.slice(start, start+this.pageSize);
    const el = document.getElementById('ibTableWrapper');
    if (!el) return;

    el.innerHTML = `<table class="data-table" style="min-width:1200px;">
      <thead><tr>
        <th style="width:50px;">序号</th>
        <th style="width:140px;">物料凭证号</th>
        <th style="width:150px;">供应商批次号</th>
        <th style="width:120px;">物料编码</th>
        <th style="width:140px;">物料名称</th>
        <th style="width:100px;">数量</th>
        <th style="width:80px;">移动类型</th>
        <th style="width:100px;">工厂</th>
        <th style="width:80px;">库存地点</th>
        <th style="width:100px;">收货日期</th>
        <th style="width:120px;">操作</th>
      </tr></thead>
      <tbody>${page.map((d,i) => this.renderPendingRow(d, start+i+1)).join('')}</tbody>
    </table>`;

    this.renderPendingPagination();
  },

  renderPendingRow(d, idx) {
    return `<tr>
      <td>${idx}</td>
      <td style="color:#2563eb;font-weight:600;font-family:monospace;">${esc(d.docNo)}</td>
      <td style="font-weight:700;font-size:13px;">${esc(d.supplierBatch)}</td>
      <td style="font-family:monospace;font-size:12px;">${esc(d.materialCode)}</td>
      <td>${esc(d.materialName)}</td>
      <td>${d.quantity} ${esc(d.unit)}</td>
      <td><span class="badge badge-blue">${esc(d.movementName)}</span></td>
      <td>${esc(d.plantName)}</td>
      <td>${esc(d.storageName)}</td>
      <td>${d.receiptDate}</td>
      <td><button class="btn btn-sm btn-blue" onclick="InspectionBatch.openGenerateModal('${d.id}')">生成检验批</button></td>
    </tr>`;
  },

  // ==================== 待生成 - 筛选 ====================

  pendingFiltered: [],
  pendingPage: 1,

  searchPending() {
    const factory = document.getElementById('ibPendFactory')?.value||'';
    const material = (document.getElementById('ibPendMaterial')?.value||'').trim();
    const suppBatch = (document.getElementById('ibPendSuppBatch')?.value||'').trim();
    const sapBatch = (document.getElementById('ibPendSapBatch')?.value||'').trim();
    const receiptDate = document.getElementById('ibPendReceiptDate')?.value||'';

    this.pendingFiltered = this.pendingDocs.filter(d => {
      if (factory && d.plant !== factory) return false;
      if (material && !d.materialCode.includes(material) && !d.materialName.includes(material)) return false;
      if (suppBatch && !d.supplierBatch.toLowerCase().includes(suppBatch.toLowerCase())) return false;
      if (sapBatch && !d.sapBatch.toLowerCase().includes(sapBatch.toLowerCase())) return false;
      if (receiptDate && d.receiptDate !== receiptDate) return false;
      return true;
    });
    this.pendingPage = 1;
    this.doRenderPendingTable();
  },

  resetPendingFilter() {
    ['ibPendMaterial','ibPendSuppBatch','ibPendSapBatch'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const f = document.getElementById('ibPendFactory'); if (f) f.value = '';
    const r = document.getElementById('ibPendReceiptDate'); if (r) r.value = '';
    this.pendingFiltered = [...this.pendingDocs];
    this.pendingPage = 1;
    this.doRenderPendingTable();
  },

  // ==================== 分页 ====================

  renderPagination() {
    const total = this.filtered.length;
    const totalPages = Math.ceil(total/this.pageSize)||1;
    const el = document.getElementById('ibPagination');
    if (!el) return;

    el.innerHTML = `<div class="list-toolbar">
      <div class="list-info"><span class="list-count">共 ${total} 条</span></div>
      <div class="pagination">
        <button class="pagination-btn" ${this.page<=1?'disabled':''} onclick="InspectionBatch.prevPage()">‹</button>
        <span class="pagination-info">第 ${this.page} / ${totalPages} 页</span>
        <button class="pagination-btn" ${this.page>=totalPages?'disabled':''} onclick="InspectionBatch.nextPage()">›</button>
        <select class="page-size-select" onchange="InspectionBatch.changePageSize()">
          <option value="10" ${this.pageSize===10?'selected':''}>10条</option>
          <option value="20" ${this.pageSize===20?'selected':''}>20条</option>
          <option value="50" ${this.pageSize===50?'selected':''}>50条</option>
        </select>
      </div>
    </div>`;
  },

  renderPendingPagination() {
    const total = this.pendingFiltered.length;
    const totalPages = Math.ceil(total/this.pageSize)||1;

    document.getElementById('ibPagination').innerHTML = `<div class="list-toolbar">
      <div class="list-info"><span class="list-count">共 ${total} 条待处理凭证</span></div>
      <div class="pagination">
        <button class="pagination-btn" ${this.pendingPage<=1?'disabled':''} onclick="InspectionBatch.prevPendingPage()">‹</button>
        <span class="pagination-info">第 ${this.pendingPage} / ${totalPages} 页</span>
        <button class="pagination-btn" ${this.pendingPage>=totalPages?'disabled':''} onclick="InspectionBatch.nextPendingPage()">›</button>
        <select class="page-size-select" onchange="InspectionBatch.changePendingPageSize()">
          <option value="10" ${this.pageSize===10?'selected':''}>10条</option>
          <option value="20" ${this.pageSize===20?'selected':''}>20条</option>
          <option value="50" ${this.pageSize===50?'selected':''}>50条</option>
        </select>
      </div>
    </div>`;
  },

  prevPage() { if (this.page>1) { this.page--; this.renderBatchTable(); this.renderPagination(); } },
  nextPage() { if (this.page<Math.ceil(this.filtered.length/this.pageSize)) { this.page++; this.renderBatchTable(); this.renderPagination(); } },
  changePageSize() {
    const sel = document.querySelector('#ibPagination .page-size-select');
    if (sel) { this.pageSize = parseInt(sel.value); this.page = 1; this.renderBatchTable(); this.renderPagination(); }
  },

  prevPendingPage() { if (this.pendingPage>1) { this.pendingPage--; this.doRenderPendingTable(); } },
  nextPendingPage() { if (this.pendingPage<Math.ceil(this.pendingFiltered.length/this.pageSize)) { this.pendingPage++; this.doRenderPendingTable(); } },
  changePendingPageSize() {
    const sel = document.querySelector('#ibPagination .page-size-select');
    if (sel) { this.pageSize = parseInt(sel.value); this.pendingPage = 1; this.doRenderPendingTable(); }
  },

  // ==================== 生成检验批弹窗 ====================

  openGenerateModal(docId) {
    const doc = this.pendingDocs.find(d => d.id === docId);
    if (!doc) return toast('凭证未找到');

    // 获取该物料可用的检验计划
    const planOptions = this.getPlanOptions(doc.materialCode);
    const planSelectOpts = planOptions.map(p => `<option value="${p.no}">${p.no} — ${p.name}</option>`).join('');

    // 历史检验批检测
    const histBatches = this.batchData.filter(b =>
      b.supplierBatch === doc.supplierBatch && b.status === 'CANC'
    );
    const histNote = histBatches.length > 0
      ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px;margin-bottom:16px;font-size:13px;">
          <strong>⚠️ 发现历史记录：</strong>该供应商批次号 <em style="font-weight:700;">${esc(doc.supplierBatch)}</em> 在近期存在已取消的检验批 <strong>${esc(histBatches[0].batchNo)}</strong>，是否引用其检验结果？
          <div style="margin-top:8px;">
            <label style="cursor:pointer;"><input type="checkbox" id="ibRefHist"> 引用历史检验结果（需逐项核对确认）</label>
          </div>
        </div>`
      : '';

    showModal(
      '生成检验批',
      `<div style="padding:4px 0;">
        ${histNote}
        <div style="background:#f8fafc;border-radius:8px;padding:12px 16px;margin-bottom:16px;">
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:8px;">物料凭证信息</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px 24px;font-size:13px;">
            <div><span style="color:var(--text-muted);">凭证号：</span><strong>${esc(doc.docNo)}</strong></div>
            <div><span style="color:var(--text-muted);">移动类型：</span>${esc(doc.movementName)}</div>
            <div><span style="color:var(--text-muted);">数量：</span>${doc.quantity} ${esc(doc.unit)}</div>
            <div><span style="color:var(--text-muted);">物料编码：</span><strong>${esc(doc.materialCode)}</strong></div>
            <div><span style="color:var(--text-muted);">物料名称：</span>${esc(doc.materialName)}</div>
            <div><span style="color:var(--text-muted);">工厂：</span>${esc(doc.plantName)}</div>
            <div><span style="color:var(--text-muted);">供应商批次号：</span><strong style="color:#2563eb;">${esc(doc.supplierBatch)}</strong></div>
            <div><span style="color:var(--text-muted);">SAP批次号：</span><span style="font-family:monospace;">${esc(doc.sapBatch)}</span></div>
            <div></div>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group"><label>用途代码<span class="req">*</span></label><select id="ibGenPurpose">
            ${this.purposeOptions.map(p => `<option value="${p.code}">${p.code} - ${p.name}</option>`).join('')}
          </select></div>
          <div class="form-group"><label>检验计划<span class="req">*</span></label><select id="ibGenPlan" onchange="InspectionBatch.onPlanChange()">
            <option value="">请选择</option>
            ${planSelectOpts || '<option value="" disabled>暂无匹配的检验计划</option>'}
          </select></div>
        </div>
        <!-- 检验计划详情预览 -->
        <div id="ibPlanPreview" style="margin-top:16px;"></div>
        <div class="form-group full" style="margin-top:12px;">
          <label>备注</label>
          <textarea id="ibGenRemark" placeholder="可选填写备注信息" rows="2" style="width:100%;"></textarea>
        </div>
      </div>`,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal },
        { text:'确认生成', cls:'btn-primary', action: ()=>{ InspectionBatch.doGenerate(docId); } }
      ],
      'modal-xl'
    );

    // 存储当前 docId 和 planOptions 引用，供 onPlanChange 使用
    this._genDocId = docId;
    this._genPlanOptions = planOptions;
  },

  // 检验计划选择变更 → 展示计划详情
  onPlanChange() {
    const selVal = document.getElementById('ibGenPlan')?.value;
    const previewEl = document.getElementById('ibPlanPreview');
    if (!previewEl) return;

    if (!selVal) {
      previewEl.innerHTML = '';
      return;
    }

    const plan = (typeof ipData !== 'undefined' ? ipData : []).find(p => p.code === selVal);
    if (!plan) {
      previewEl.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:12px;background:#f8fafc;border-radius:8px;">未找到该计划的详细数据</div>';
      return;
    }

    previewEl.innerHTML = this.renderPlanPreview(plan);
  },

  // 渲染检验计划详情预览 — 折叠式卡片布局
  renderPlanPreview(plan) {
    // 工序卡片（折叠式）
    const opCards = plan.operations.map((op, i) => {
      const isSampling = op.opType === 'sampling';
      const uid = 'opp' + i + '_' + Date.now();
      const hasChars = !isSampling && op.chars && op.chars.length > 0;

      // MIC 详情（默认折叠）
      let charsPanel = '';
      if (hasChars) {
        const maxCols = Math.min(op.chars.length, 2);
        charsPanel = `<div id="${uid}" style="display:none;margin-top:10px;padding-top:10px;border-top:1px dashed #d1d5db;">
          <div style="display:grid;grid-template-columns:repeat(${maxCols},1fr);gap:8px 16px;">
            ${op.chars.map(c => {
              const specRange = c.micType === 'quantitative'
                ? `${c.lowerSpec||'—'} ~ ${c.upperSpec||'—'} ${c.unit||''}`
                : (c.defaultCode||'—');
              const isQuant = c.micType === 'quantitative';
              return `<div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;font-size:13px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                  <span style="font-family:monospace;font-size:11px;color:#2563eb;font-weight:600;">${esc(c.micCode)}</span>
                  <span class="badge ${isQuant?'badge-blue':'badge-purple'} badge-sm" style="font-size:10px;">${isQuant?'定量':'定性'}</span>
                </div>
                <div style="font-weight:500;color:var(--text);margin-bottom:4px;">${esc(c.micName)}</div>
                <div style="display:flex;flex-wrap:wrap;gap:4px 12px;font-size:12px;color:var(--text-secondary);">
                  <span>方法：${esc(c.methodName)||'—'}</span>
                  <span style="font-weight:500;color:var(--text);">规格：${specRange}</span>
                  ${c.samplingPlanName ? `<span>取样：${esc(c.samplingPlanName)}</span>` : ''}
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }

      const typeCls = isSampling ? 'badge-blue' : 'badge-green';
      const typeLabel = isSampling ? '取样' : '检验';
      const icon = isSampling ? '🔬' : '🧪';
      const stepNum = i + 1;

      return `<div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;background:#fff;${i > 0 ? 'margin-top:8px;' : ''}">
        <div style="display:flex;align-items:center;gap:10px;min-height:32px;">
          <div style="background:${isSampling?'#dbeafe':'#dcfce7'};color:${isSampling?'#1d4ed8':'#15803d'};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">${stepNum}</div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span style="font-size:14px;font-weight:600;color:var(--text);">${esc(op.opNum)}</span>
              <span class="badge ${typeCls} badge-sm">${typeLabel}</span>
              <span style="color:var(--text-muted);font-size:13px;">· ${esc(op.workCenterName)}</span>
              ${op.description ? `<span style="color:var(--text-secondary);font-size:13px;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">— ${esc(op.description)}</span>` : ''}
            </div>
            ${isSampling ? `<div style="font-size:12px;color:var(--text-muted);margin-top:3px;">取样方案：${esc(op.samplingPlanName) || '—'}</div>` : ''}
          </div>
          ${hasChars ? `<button onclick="InspectionBatch._toggleOpChars('${uid}',this)" style="background:none;border:1px solid #d1d5db;border-radius:6px;padding:4px 10px;font-size:12px;color:var(--text-secondary);cursor:pointer;white-space:nowrap;flex-shrink:0;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='none'">
            <span class="_expandLabel">展开</span> ${op.chars.length} 项特性 ▾
          </button>` : ''}
        </div>
        ${charsPanel}
      </div>`;
    }).join('');

    // 工序间箭头连接
    const flowHtml = `<div style="display:flex;align-items:center;gap:0;font-size:12px;color:#9ca3af;padding:0 14px;margin-bottom:4px;">
      ${plan.operations.map((_,i) => {
        if (i === 0) return `<span style="flex-shrink:0;width:48px;text-align:center;">开始</span>`;
        return `<span style="flex-shrink:0;width:48px;text-align:center;">↓</span>`;
      }).join('')}
    </div>`;

    return `<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px 18px;">
      <!-- 计划基本信息（紧凑） -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap;">
        <span style="font-size:15px;font-weight:700;color:var(--text);">📋 ${esc(plan.code)}</span>
        <span class="badge badge-green">已启用</span>
        <span style="color:#d1d5db;">|</span>
        <span style="font-size:13px;color:var(--text-secondary);"><strong>${esc(plan.materialCode)}</strong> ${esc(plan.materialName)}</span>
        <span style="font-size:13px;color:var(--text-muted);">· ${esc(plan.purposeName)}</span>
        <span style="font-size:13px;color:var(--text-muted);">· ${esc(plan.factoryName)}</span>
        <span style="font-size:13px;color:var(--text-muted);">· ${plan.operations.length} 道工序</span>
      </div>
      <!-- 工序卡片列表 -->
      ${opCards}
    </div>`;
  },

  // 折叠/展开工序的 MIC 特性
  _toggleOpChars(uid, btn) {
    const panel = document.getElementById(uid);
    const label = btn.querySelector('._expandLabel');
    if (!panel) return;
    if (panel.style.display === 'none') {
      panel.style.display = 'block';
      if (label) label.textContent = '收起';
      btn.innerHTML = btn.innerHTML.replace('▾', '▴');
    } else {
      panel.style.display = 'none';
      if (label) label.textContent = '展开';
      btn.innerHTML = btn.innerHTML.replace('▴', '▾');
    }
  },

  doGenerate(docId) {
    const doc = this.pendingDocs.find(d => d.id === docId);
    if (!doc) return;

    const planNo = document.getElementById('ibGenPlan').value;
    const purpose = document.getElementById('ibGenPurpose').value;
    const remark = document.getElementById('ibGenRemark')?.value||'';

    // 校验 SAP 凭证冲销（模拟实时校验）
    // PRD 3.3-1: 实时校验冲销状态
    if (Math.random() < 0.05) { // 5% 概率模拟冲销
      toast('该凭证已被冲销，无法生成检验批');
      return;
    }

    if (!planNo) { toast('请选择检验计划'); return; }

    // 生成检验批号：工厂-IL-日期-流水
    const today = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const count = this.batchData.filter(b => b.plant===doc.plant).length + 1;
    const batchNo = `${doc.plant}-IL-${today}-${String(count).padStart(3,'0')}`;

    const plan = (this._genPlanOptions || []).find(p => p.no === planNo);
    const purposeObj = this.purposeOptions.find(p => p.code === purpose);

    const refHist = document.getElementById('ibRefHist')?.checked;
    const now = new Date().toISOString().replace('T',' ').slice(0,19);

    const newBatch = {
      id: 'B' + String(this.batchData.length+1).padStart(3,'0'),
      batchNo,
      docNo: doc.docNo,
      materialCode: doc.materialCode,
      materialName: doc.materialName,
      sapBatch: doc.sapBatch,
      supplierBatch: doc.supplierBatch,
      quantity: doc.quantity,
      unit: doc.unit,
      plant: doc.plant,
      plantName: doc.plantName,
      planNo: planNo,
      planName: plan?.name||'',
      purposeCode: purpose,
      purposeName: purposeObj?.name||'',
      status: 'CRTD',
      statusName: '已创建',
      createTime: now,
      createBy: '张工',
      updateTime: now,
      remark: remark || (refHist ? '已引用历史检验结果，待逐项核对' : ''),
      refHistBatch: refHist ? (this.batchData.filter(b=>b.supplierBatch===doc.supplierBatch&&b.status==='CANC')[0]?.batchNo||'') : ''
    };

    this.batchData.unshift(newBatch);
    // 移除已生成的待处理凭证
    this.pendingDocs = this.pendingDocs.filter(d => d.id !== docId);

    closeModal();
    toast(`检验批 ${batchNo} 已生成！${refHist ? '历史结果已引用，请核对确认。' : ''}`);
    this.init();
  },

  // ==================== 检验批详情（弹窗模式） ====================

  // 根据 planNo 解析计划数据（含 fallback）
  _resolvePlan(b) {
    const plans = (typeof ipData !== 'undefined' ? ipData : []);
    let plan = plans.find(p => p.code === b.planNo);
    if (!plan) plan = plans.find(p => p.materialCode === b.materialCode);
    if (!plan) plan = plans[0]; // 最后的 fallback
    return plan || null;
  },

  openDetail(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b) return toast('检验批未找到');

    const plan = this._resolvePlan(b);
    const ops = (plan && plan.operations) ? plan.operations : [
      { opNum:'0010', opType:'sampling', opTypeName:'取样', workCenterName:'QC取样室', description:'按取样方案执行取样', samplingPlanName:'—', chars:[] },
      { opNum:'0020', opType:'inspection', opTypeName:'检验', workCenterName:'QC实验室', description:'外观、含量、pH值等', samplingPlanName:'', chars:[] }
    ];

    const statusBadge = this.getStatusBadgeHtml(b.status);
    const isActive = ['CRTD','SAMP','INSP','DONE'].includes(b.status);
    const hasSamplingOp = ops.some(o => o.opType === 'sampling');

    // 工序行渲染
    const opRows = ops.map((op, i) => {
      const isSampling = op.opType === 'sampling';
      const typeBadge = isSampling
        ? '<span class="badge badge-yellow badge-sm">取样</span>'
        : '<span class="badge badge-purple badge-sm">检验</span>';

      // 工序状态
      let opStatus = '';
      if (isSampling) {
        opStatus = b.status === 'CRTD'
          ? '<span class="badge badge-gray">待执行</span>'
          : b.status === 'SAMP'
          ? '<span class="badge badge-yellow">进行中</span>'
          : '<span class="badge badge-green">已完成</span>';
      } else {
        opStatus = ['CRTD','SAMP'].includes(b.status)
          ? '<span class="badge badge-gray">待执行</span>'
          : b.status === 'INSP'
          ? '<span class="badge badge-purple">进行中</span>'
          : '<span class="badge badge-green">已完成</span>';
      }

      // 操作按钮
      let opBtn = '';
      if (isSampling && b.status === 'CRTD') {
        opBtn = `<button class="btn btn-sm btn-blue" onclick="InspectionBatch.openSamplingForm('${b.id}','${op.opNum}');closeModal();">取样</button>`;
      } else if (!isSampling && ['SAMP','INSP'].includes(b.status)) {
        opBtn = `<button class="btn btn-sm btn-blue" onclick="InspectionBatch.openResultEntry('${b.id}','${op.opNum}');closeModal();">录入结果</button>`;
      } else if (!isSampling && !['CANC','CLSD'].includes(b.status)) {
        opBtn = `<button class="btn btn-sm btn-blue" onclick="InspectionBatch.openResultEntry('${b.id}','${op.opNum}');closeModal();">录入结果</button>`;
      } else {
        opBtn = '<span style="color:var(--text-muted);font-size:12px;">—</span>';
      }

      return `<tr>
        <td style="font-family:monospace;font-weight:600;">${esc(op.opNum)}</td>
        <td>${typeBadge}</td>
        <td>${esc(op.workCenterName)}</td>
        <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(op.description||'')}">${esc(op.description||'—')}</td>
        <td>${opStatus}</td>
        <td style="text-align:center;">${opBtn}</td>
      </tr>`;
    }).join('');

    // 时间线
    const timelineHtml = `<div style="display:flex;gap:12px;padding:6px 0;align-items:flex-start;">
        <div style="width:8px;height:8px;border-radius:50%;background:#22c55e;margin-top:6px;flex-shrink:0;"></div>
        <div><span style="color:var(--text-muted);">${b.createTime}</span> — 创建检验批（${esc(b.createBy)}）</div>
      </div>
      ${b.status!=='CRTD'?`<div style="display:flex;gap:12px;padding:6px 0;align-items:flex-start;">
        <div style="width:8px;height:8px;border-radius:50%;background:#eab308;margin-top:6px;flex-shrink:0;"></div>
        <div><span style="color:var(--text-muted);">${b.updateTime}</span> — 状态更新为"${b.statusName}"</div>
      </div>`:''}
      ${b.decisionTime?`<div style="display:flex;gap:12px;padding:6px 0;align-items:flex-start;">
        <div style="width:8px;height:8px;border-radius:50%;background:${b.decision==='release'?'#22c55e':'#dc2626'};margin-top:6px;flex-shrink:0;"></div>
        <div><span style="color:var(--text-muted);">${b.decisionTime}</span> — ${b.decision==='release'?'放行':'冻结'}（${esc(b.decisionBy||'')}）</div>
      </div>`:''}
      ${b.closeTime?`<div style="display:flex;gap:12px;padding:6px 0;align-items:flex-start;">
        <div style="width:8px;height:8px;border-radius:50%;background:#6b7280;margin-top:6px;flex-shrink:0;"></div>
        <div><span style="color:var(--text-muted);">${b.closeTime}</span> — 已关闭归档</div>
      </div>`:''}
      ${b.cancelReason?`<div style="display:flex;gap:12px;padding:6px 0;align-items:flex-start;">
        <div style="width:8px;height:8px;border-radius:50%;background:#dc2626;margin-top:6px;flex-shrink:0;"></div>
        <div><span style="color:var(--text-muted);">${b.updateTime}</span> — ${esc(b.cancelReason)}</div>
      </div>`:''}`;

    const bodyHtml = `<div style="padding:4px 0;">
      <!-- 基本信息（紧凑两行） -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
        <span style="font-size:18px;font-weight:700;color:var(--text);">${esc(b.batchNo)}</span>
        <div>${statusBadge}</div>
        <span style="color:#d1d5db;">|</span>
        <span style="font-size:13px;color:var(--text-secondary);">计划：<span style="font-family:monospace;">${esc(b.planNo)}</span></span>
        <span style="font-size:13px;color:var(--text-secondary);">${esc(b.purposeName)}</span>
        <span style="font-size:13px;color:var(--text-secondary);">${esc(b.plantName)}</span>
      </div>

      <!-- 物料与批次（网格） -->
      <div style="background:#f8fafc;border-radius:8px;padding:14px 16px;margin-bottom:16px;">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px 20px;font-size:13px;">
          <div><span style="color:var(--text-muted);">物料编码：</span><span style="font-family:monospace;">${esc(b.materialCode)}</span></div>
          <div><span style="color:var(--text-muted);">物料名称：</span><strong>${esc(b.materialName)}</strong></div>
          <div><span style="color:var(--text-muted);">数量：</span>${b.quantity} ${esc(b.unit)}</div>
          <div><span style="color:var(--text-muted);">供应商批次：</span><strong style="color:#2563eb;">${esc(b.supplierBatch)}</strong></div>
          <div><span style="color:var(--text-muted);">SAP批次：</span><span style="font-family:monospace;font-size:12px;">${esc(b.sapBatch)}</span></div>
          <div><span style="color:var(--text-muted);">凭证号：</span><span style="font-family:monospace;">${esc(b.docNo)}</span></div>
        </div>
      </div>

      <!-- 检验工序表格 -->
      <div style="margin-bottom:16px;">
        <div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:10px;">🔬 检验任务 · ${ops.length} 道工序</div>
        <table class="data-table" style="min-width:100%;">
          <thead><tr>
            <th style="width:60px;">工序号</th>
            <th style="width:60px;">类型</th>
            <th>工作中心</th>
            <th>工序描述</th>
            <th style="width:80px;">状态</th>
            <th style="width:90px;text-align:center;">操作</th>
          </tr></thead>
          <tbody>${opRows}</tbody>
        </table>
      </div>

      <!-- 时间线 -->
      <div style="background:#f8fafc;border-radius:8px;padding:14px 16px;margin-bottom:16px;">
        <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:8px;">📅 操作记录</div>
        <div style="font-size:13px;">${timelineHtml}</div>
      </div>
    </div>`;

    // 底部全局操作按钮
    const footerBtns = [
      { text:'关闭', cls:'btn-outline', action: closeModal }
    ];
    if (b.status === 'DONE') {
      footerBtns.unshift({ text:'使用决策', cls:'btn-success', action: ()=>{ closeModal(); InspectionBatch.openDecision(batchId); } });
    }
    if (b.status === 'DEC') {
      footerBtns.unshift({ text:'关闭归档', cls:'btn-secondary', action: ()=>{ closeModal(); InspectionBatch.closeBatch(batchId); } });
    }
    if (isActive) {
      footerBtns.unshift({ text:'取消检验批', cls:'btn-red', action: ()=>{ closeModal(); InspectionBatch.cancelBatch(batchId); } });
    }

    showModal(`检验批详情 — ${b.batchNo}`, bodyHtml, footerBtns, 'modal-xl');
  },

  // ==================== 取样表单弹窗 ====================

  openSamplingForm(batchId, opNum) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b || b.status !== 'CRTD') return toast('当前状态不允许取样');

    showModal(
      `取样 — ${b.batchNo}`,
      `<div style="padding:4px 0;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          <div style="font-weight:600;margin-bottom:4px;">工序 ${esc(opNum)} · 取样</div>
          <div style="color:var(--text-secondary);">检验批号：${esc(b.batchNo)} | 物料：${esc(b.materialCode)} ${esc(b.materialName)}</div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>取样量<span class="req">*</span></label>
            <input type="number" id="ibSampleQty" step="0.001" placeholder="请输入取样量" min="0">
            <span style="font-size:12px;color:var(--text-muted);">单位：${esc(b.unit)}</span>
          </div>
          <div class="form-group">
            <label>过账日期<span class="req">*</span></label>
            <input type="date" id="ibPostDate" value="${new Date().toISOString().slice(0,10)}">
          </div>
        </div>
        <div class="form-group full" style="margin-top:8px;">
          <label>备注</label>
          <input type="text" id="ibSampleRemark" placeholder="可选填写备注" style="width:100%;">
        </div>
      </div>`,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal },
        { text:'确认取样', cls:'btn-primary', action: ()=>{ InspectionBatch.submitSampling(batchId); } }
      ],
      'modal-md'
    );
  },

  submitSampling(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b || b.status !== 'CRTD') return toast('当前状态不允许取样');

    // PRD 4.1: 实时校验冲销
    if (Math.random() < 0.03) {
      closeModal();
      this.doCancelBatch(batchId, 'SAP 收货凭证已被冲销，无法执行取样');
      return;
    }

    const qty = parseFloat(document.getElementById('ibSampleQty')?.value);
    const postDate = document.getElementById('ibPostDate')?.value;
    const remark = (document.getElementById('ibSampleRemark')?.value||'').trim();

    if (!qty || qty <= 0) { toast('请输入有效的取样量'); return; }
    if (!postDate) { toast('请选择过账日期'); return; }

    b.status = 'SAMP';
    b.statusName = '取样中';
    b.updateTime = new Date().toISOString().replace('T',' ').slice(0,19);
    b.sampleQty = qty;
    b.postDate = postDate;
    b.sampleRemark = remark;
    toast(`取样已确认！取样量 ${qty} ${b.unit}，检验批 ${b.batchNo} 进入"取样中"`);
    closeModal();
    this.init();
  },

  // ==================== 检验结果录入弹窗 ====================

  openResultEntry(batchId, opNum) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b) return toast('检验批未找到');
    if (['CANC','CLSD'].includes(b.status)) return toast('当前状态不允许录入结果');

    const plan = this._resolvePlan(b);
    const op = (plan && plan.operations)
      ? plan.operations.find(o => o.opNum === opNum)
      : null;

    const chars = (op && op.chars && op.chars.length > 0) ? op.chars : [];

    if (chars.length === 0) {
      toast('该检验工序暂无检验特性，请检查检验计划配置');
      return;
    }

    const charRows = chars.map((c, i) => {
      const isQuant = c.micType === 'quantitative';
      const typeBadge = isQuant
        ? '<span class="badge badge-blue badge-sm">定量</span>'
        : '<span class="badge badge-purple badge-sm">定性</span>';
      const specText = isQuant
        ? `${c.lowerSpec||'—'} ~ ${c.upperSpec||'—'} ${c.unit||''}`
        : (c.defaultCode||'合格');

      let inputHtml = '';
      if (isQuant) {
        inputHtml = `<div style="display:flex;align-items:center;gap:8px;">
          <input type="number" id="ibCharVal_${i}" step="any" placeholder="实测值" style="width:120px;">
          <span style="font-size:12px;color:var(--text-muted);">${c.unit||''}</span>
        </div>`;
      } else {
        inputHtml = `<select id="ibCharVal_${i}" style="width:160px;">
          <option value="">请选择</option>
          <option value="合格">合格</option>
          <option value="不合格">不合格</option>
        </select>`;
      }

      return `<tr>
        <td><span style="font-family:monospace;font-size:11px;color:#2563eb;font-weight:500;">${esc(c.micCode)}</span></td>
        <td><strong>${esc(c.micName)}</strong> ${typeBadge}</td>
        <td style="font-size:12px;">${esc(c.methodName)||'—'}</td>
        <td style="font-family:monospace;font-size:12px;">${specText}</td>
        <td>${inputHtml}</td>
      </tr>`;
    }).join('');

    showModal(
      `录入检验结果 — ${b.batchNo}`,
      `<div style="padding:4px 0;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          <div style="font-weight:600;margin-bottom:4px;">工序 ${esc(opNum)} · ${esc(op?op.opTypeName:'检验')} · ${esc(op?op.workCenterName:'—')}</div>
          <div style="color:var(--text-secondary);">检验批号：${esc(b.batchNo)} | 物料：${esc(b.materialCode)} ${esc(b.materialName)} | 计划：${esc(b.planNo)}</div>
        </div>
        <table class="data-table" style="min-width:100%;">
          <thead><tr>
            <th style="width:130px;">MIC编码</th>
            <th>MIC名称</th>
            <th style="width:140px;">检验方法</th>
            <th style="width:130px;">规格范围</th>
            <th style="width:170px;">实测值</th>
          </tr></thead>
          <tbody>${charRows}</tbody>
        </table>
        <div class="form-group full" style="margin-top:12px;">
          <label>备注</label>
          <input type="text" id="ibResultRemark" placeholder="可选填写备注" style="width:100%;">
        </div>
      </div>`,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal },
        { text:'保存草稿', cls:'btn-outline', action: ()=>{ toast('草稿已保存'); closeModal(); } },
        { text:'提交结果', cls:'btn-primary', action: ()=>{ InspectionBatch.submitResult(batchId, opNum); } }
      ],
      'modal-lg'
    );
  },

  submitResult(batchId, opNum) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b || ['CANC','CLSD'].includes(b.status)) return;

    // PRD: 校验冲销
    if (Math.random() < 0.03) {
      closeModal();
      this.doCancelBatch(batchId, 'SAP 凭证冲销，自动取消');
      return;
    }

    const plan = this._resolvePlan(b);
    const op = (plan && plan.operations)
      ? plan.operations.find(o => o.opNum === opNum)
      : null;
    const chars = (op && op.chars) ? op.chars : [];
    const remark = (document.getElementById('ibResultRemark')?.value||'').trim();

    // 收集结果
    let allValid = true;
    const results = chars.map((c, i) => {
      const valEl = document.getElementById('ibCharVal_' + i);
      const val = valEl ? (valEl.value||'').trim() : '';
      if (!val) { allValid = false; }
      const verdict = c.micType === 'quantitative'
        ? (parseFloat(val) >= parseFloat(c.lowerSpec) && parseFloat(val) <= parseFloat(c.upperSpec) ? '合格' : '不合格')
        : (val === '合格' ? '合格' : '不合格');
      return { micCode: c.micCode, micName: c.micName, value: val, verdict };
    });

    if (!allValid) { toast('请填写所有检验特性的实测值'); return; }

    // 判定是否有不合格项
    const hasFail = results.some(r => r.verdict === '不合格');

    // 更新批次状态
    b.status = 'DONE';
    b.statusName = '检验完成';
    b.updateTime = new Date().toISOString().replace('T',' ').slice(0,19);
    b.inspectionResults = results;
    b.inspectionVerdict = hasFail ? 'failed' : 'passed';
    b.inspectionRemark = remark;

    const failNote = hasFail ? ' 发现不合格项，请关注决策！' : '';
    toast(`检验结果已提交！判定：${hasFail ? '不合格' : '合格'}${failNote}`);
    closeModal();
    this.init();
  },

  // ==================== 使用决策 ====================

  openDecision(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b || b.status !== 'DONE') return toast('只有检验完成的批次才能执行决策');

    showModal(
      '使用决策',
      `<div style="padding:4px 0;">
        <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:16px;">
          <div style="font-size:14px;font-weight:700;margin-bottom:8px;">检验批信息</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:13px;">
            <div><span style="color:var(--text-muted);">检验批号：</span><strong>${esc(b.batchNo)}</strong></div>
            <div><span style="color:var(--text-muted);">物料：</span>${esc(b.materialName)}</div>
            <div><span style="color:var(--text-muted);">供应商批次号：</span><strong style="color:#2563eb;">${esc(b.supplierBatch)}</strong></div>
            <div><span style="color:var(--text-muted);">数量：</span>${b.quantity} ${esc(b.unit)}</div>
          </div>
        </div>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px;margin-bottom:16px;font-size:13px;">
          <strong>✅ 检验判定汇总：</strong>全部检验项目合格，可以进行使用决策。
        </div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">
          请选择使用决策，系统将自动同步 SAP 库存移动：
        </div>
        <div style="display:flex;gap:12px;">
          <button class="btn btn-success" style="flex:1;padding:14px;font-size:15px;" onclick="InspectionBatch.doDecision('${batchId}','release')">
            ✅ 放行<br><span style="font-size:12px;font-weight:400;opacity:0.8;">移动类型 321 → 非限制库存</span>
          </button>
          <button class="btn btn-red" style="flex:1;padding:14px;font-size:15px;" onclick="InspectionBatch.doDecision('${batchId}','freeze')">
            🚫 冻结<br><span style="font-size:12px;font-weight:400;opacity:0.8;">移动类型 331 → 冻结库存</span>
          </button>
        </div>
      </div>`,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal }
      ],
      'modal-md'
    );
  },

  doDecision(batchId, type) {
    // PRD 4.1: 决策前实时校验冲销
    if (Math.random() < 0.03) {
      toast('该检验批对应的 SAP 收货凭证已被冲销，无法执行决策');
      closeModal();
      this.doCancelBatch(batchId, 'SAP 凭证冲销，自动取消');
      return;
    }

    const b = this.batchData.find(x => x.id === batchId);
    if (!b || b.status !== 'DONE') return;

    const decisionLabel = type === 'release' ? '放行' : '冻结';
    const movType = type === 'release' ? '321' : '331';

    if (!confirm(`确认执行"${decisionLabel}"决策？\n\nSAP 将执行移动类型 ${movType}，不可撤销。`)) return;

    // 模拟 SAP 接口调用
    const now = new Date().toISOString().replace('T',' ').slice(0,19);
    b.status = 'DEC';
    b.statusName = '已决策';
    b.decision = type;
    b.decisionBy = 'QA经理';
    b.decisionTime = now;
    b.updateTime = now;

    closeModal();
    toast(`使用决策"${decisionLabel}"已执行，SAP 移动类型 ${movType} 同步成功，检验批状态已更新`);
    this.init();
  },

  // ==================== 关闭/取消 ====================

  closeBatch(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b || b.status !== 'DEC') return toast('只有已决策的批次才能关闭');

    if (!confirm(`确认关闭检验批 ${b.batchNo}？关闭后将归档，不可修改。`)) return;

    const now = new Date().toISOString().replace('T',' ').slice(0,19);
    b.status = 'CLSD';
    b.statusName = '已关闭';
    b.closeTime = now;
    b.updateTime = now;

    toast(`检验批 ${b.batchNo} 已关闭归档`);
    this.init();
  },

  cancelBatch(batchId) {
    if (!confirm('确认取消该检验批？取消后将标记为已取消状态。')) return;
    this.doCancelBatch(batchId, '手动取消');
  },

  doCancelBatch(batchId, reason) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b) return;

    const now = new Date().toISOString().replace('T',' ').slice(0,19);
    b.status = 'CANC';
    b.statusName = '已取消';
    b.cancelReason = reason;
    b.updateTime = now;

    toast(`检验批 ${b.batchNo} 已取消：${reason}`);
    this.init();
  }

};
