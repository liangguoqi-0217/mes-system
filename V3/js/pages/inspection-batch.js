// ===== 检验批管理页面 =====
// PRD v1.0 - 质量管理 → 质量检验 → 检验批管理
// ✨ v2.2 - 2026-07-07: 移除跨工厂检验协同功能（协同按钮/弹窗/生成确认）
const InspectionBatch = {
  _version: '2.1-20260617',
  activeTab: 'pending', // 'pending' | 'list'
  page: 1, pageSize: 10,
  filtered: [],

  // ==================== 模拟数据 ====================

  // 待生成检验批的物料凭证（从 SAP 抽取）
  pendingDocs: [
    { id:'MD001', docNo:'4900000123', year:'2026', materialCode:'MAT-10001', materialName:'阿莫西林原料药', sapBatch:'SAP-BT-20260601', supplierBatch:'AM2026H14', movementType:'101', movementName:'采购收货', quantity:'500.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', storageLocation:'SL01', storageName:'原材料仓库', receiptDate:'2026-06-14', status:'INIT' },
    { id:'MD002', docNo:'4900000124', year:'2026', materialCode:'MAT-10002', materialName:'淀粉辅料', sapBatch:'SAP-BT-20260602', supplierBatch:'DF2606I14', movementType:'101', movementName:'采购收货', quantity:'1000.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', storageLocation:'SL01', storageName:'原材料仓库', receiptDate:'2026-06-14', status:'INIT' },
    { id:'MD003', docNo:'4900000125', year:'2026', materialCode:'MAT-10003', materialName:'硬脂酸镁', sapBatch:'SAP-BT-20260603', supplierBatch:'YM2606J15', movementType:'101', movementName:'采购收货', quantity:'25.000', unit:'KG', plant:'2001', plantName:'陕西步长制药工厂', storageLocation:'SL01', storageName:'原材料仓库', receiptDate:'2026-06-15', status:'INIT' },
    { id:'MD004', docNo:'4900000126', year:'2026', materialCode:'MAT-20001', materialName:'胶囊壳#0', sapBatch:'SAP-BT-20260604', supplierBatch:'JN2026K15', movementType:'101', movementName:'采购收货', quantity:'500000.000', unit:'EA', plant:'1000', plantName:'山东步长制药工厂', storageLocation:'SL02', storageName:'包材仓库', receiptDate:'2026-06-15', status:'INIT' },
    { id:'MD005', docNo:'4900000127', year:'2026', materialCode:'MAT-10004', materialName:'对乙酰氨基酚', sapBatch:'SAP-BT-20260605', supplierBatch:'DA2606L16', movementType:'101', movementName:'采购收货', quantity:'300.000', unit:'KG', plant:'2002', plantName:'山东丹红制药工厂', storageLocation:'SL01', storageName:'原材料仓库', receiptDate:'2026-06-16', status:'INIT' }
  ],

  // 已生成的检验批
  batchData: [
    { id:'B001', batchNo:'1000-2606-001', docNo:'4900000100', materialCode:'MAT-10005', materialName:'布洛芬原料药', sapBatch:'SAP-BT-20260501', supplierBatch:'BT202606A1', quantity:'200.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-001', purposeCode:'QC-01', purposeName:'来料检验', status:'CRTD', statusName:'已创建', createTime:'2026-06-14 09:00:00', createBy:'张工', updateTime:'2026-06-14 09:00:00' },
    { id:'B002', batchNo:'1000-2606-002', docNo:'4900000101', materialCode:'MAT-10006', materialName:'维生素C原料', sapBatch:'SAP-BT-20260502', supplierBatch:'AK2606B02', quantity:'150.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-002', purposeCode:'QC-01', purposeName:'来料检验', status:'SAMP', statusName:'取样中', createTime:'2026-06-14 10:30:00', createBy:'李工', updateTime:'2026-06-14 14:00:00' },
    { id:'B003', batchNo:'1000-2606-003', docNo:'4900000102', materialCode:'MAT-10007', materialName:'葡萄糖原料', sapBatch:'SAP-BT-20260510', supplierBatch:'GL2026C05', quantity:'800.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-001', purposeCode:'QC-01', purposeName:'来料检验', status:'INSP', statusName:'检验中', createTime:'2026-06-15 08:15:00', createBy:'张工', updateTime:'2026-06-16 09:00:00' },
    { id:'B004', batchNo:'2001-2606-001', docNo:'4900000103', materialCode:'MAT-10008', materialName:'盐酸克林霉素', sapBatch:'SAP-BT-20260512', supplierBatch:'YK2606D08', quantity:'50.000', unit:'KG', plant:'2001', plantName:'陕西步长制药工厂', planNo:'IP-2001-001', purposeCode:'QC-02', purposeName:'中间品检验', status:'DONE', statusName:'检验完成', createTime:'2026-06-16 11:00:00', createBy:'王工', updateTime:'2026-06-17 08:30:00',
    inspectionVerdict:'passed', inspectionResults:[
      { micCode:'2001-MIC-001', micName:'外观', micType:'qualitative', methodName:'目视检查法', unit:'', lowerSpec:'—', upperSpec:'合格', value:'合格', verdict:'合格' },
      { micCode:'2001-MIC-002', micName:'pH值', micType:'quantitative', methodName:'pH值测定法', unit:'pH', lowerSpec:'3.5', upperSpec:'5.5', value:'4.62', verdict:'合格' },
      { micCode:'2001-MIC-003', micName:'含量测定', micType:'quantitative', methodName:'HPLC法', unit:'%', lowerSpec:'95.0', upperSpec:'105.0', value:'99.1', verdict:'合格' },
      { micCode:'2001-MIC-004', micName:'水分', micType:'quantitative', methodName:'干燥失重法', unit:'%', lowerSpec:'0', upperSpec:'2.0', value:'1.3', verdict:'合格' },
      { micCode:'2001-MIC-005', micName:'有关物质', micType:'quantitative', methodName:'HPLC法', unit:'%', lowerSpec:'0', upperSpec:'1.0', value:'0.82', verdict:'合格' }
    ] },
    { id:'B005', batchNo:'2002-2606-001', docNo:'4900000104', materialCode:'MAT-20002', materialName:'注射用水', sapBatch:'SAP-BT-20260515', supplierBatch:'ZS2606E10', quantity:'2000.000', unit:'L', plant:'2002', plantName:'山东丹红制药工厂', planNo:'IP-2002-001', purposeCode:'QC-03', purposeName:'成品检验', status:'DEC', statusName:'已决策', createTime:'2026-06-13 07:00:00', createBy:'赵工', updateTime:'2026-06-14 16:00:00', decision:'release', decisionBy:'QA经理', decisionTime:'2026-06-14 16:00:00' },
    { id:'B006', batchNo:'1000-2606-004', docNo:'4900000105', materialCode:'MAT-10009', materialName:'甘露醇辅料', sapBatch:'SAP-BT-20260518', supplierBatch:'GL2606F12', quantity:'100.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-001', purposeCode:'QC-01', purposeName:'来料检验', status:'CLSD', statusName:'已关闭', createTime:'2026-06-12 09:30:00', createBy:'张工', updateTime:'2026-06-13 17:00:00', decision:'release', decisionBy:'QA经理', decisionTime:'2026-06-13 10:00:00', closeTime:'2026-06-13 17:00:00' },
    { id:'B007', batchNo:'1000-2606-005', docNo:'4900000106', materialCode:'MAT-10010', materialName:'微晶纤维素', sapBatch:'SAP-BT-20260520', supplierBatch:'WX2026G13', quantity:'300.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-002', purposeCode:'QC-01', purposeName:'来料检验', status:'CANC', statusName:'已取消', createTime:'2026-06-11 10:00:00', createBy:'李工', updateTime:'2026-06-12 08:00:00', cancelReason:'SAP 凭证冲销，自动取消' },
    // 其他工厂检验批数据（演示用）
    { id:'B008', batchNo:'2001-2606-008', docNo:'4900000180', materialCode:'MAT-10001', materialName:'阿莫西林原料药', sapBatch:'SAP-BT-20260601', supplierBatch:'AM2026H14', quantity:'500.000', unit:'KG', plant:'2001', plantName:'陕西步长制药工厂', planNo:'2001-IP-00001', purposeCode:'QC-01', purposeName:'来料检验', status:'DONE', statusName:'检验完成', createTime:'2026-06-15 08:00:00', createBy:'刘工', updateTime:'2026-06-17 14:00:00',
      decision:'pending', decisionBy:'', decisionTime:'', inspectionVerdict:'passed', inspectionRemark:'所有项目均合格',
      crossPlantOps: [
        { opNum:'0010', opType:'sampling', opTypeName:'取样', workCenterName:'取样组', description:'按常规取样方案', status:'done', sampledBy:'王工', sampleTime:'2026-06-16 09:30', sampleQty:'5.000', samplingPlanName:'SP-001 常规取样方案' },
        { opNum:'0020', opType:'inspection', opTypeName:'理化检验', workCenterName:'理化实验室', description:'理化项目检验', status:'done', doneBy:'孙工', doneTime:'2026-06-16 16:00',
          results: [
            { micCode:'2001-MIC-001', micName:'pH值', micType:'quantitative', methodName:'pH值测定法', unit:'pH', lowerSpec:'5.0', upperSpec:'7.0', value:'6.58', verdict:'合格' },
            { micCode:'2001-MIC-002', micName:'水分含量', micType:'quantitative', methodName:'干燥失重法', unit:'%', lowerSpec:'0', upperSpec:'5.0', value:'2.1', verdict:'合格' },
            { micCode:'2001-MIC-003', micName:'外观', micType:'qualitative', methodName:'目视检查法', defaultCode:'合格', value:'合格', verdict:'合格' }
          ]
        },
        { opNum:'0030', opType:'inspection', opTypeName:'含量检测', workCenterName:'仪器分析室', description:'含量及相关物质', status:'done', doneBy:'孙工', doneTime:'2026-06-17 10:00',
          results: [
            { micCode:'2001-MIC-004', micName:'含量测定', micType:'quantitative', methodName:'HPLC法', unit:'%', lowerSpec:'95.0', upperSpec:'105.0', value:'99.3', verdict:'合格' },
            { micCode:'2001-MIC-005', micName:'重金属', micType:'quantitative', methodName:'原子吸收法', unit:'ppm', lowerSpec:'0', upperSpec:'20', value:'8.2', verdict:'合格' }
          ]
        },
        { opNum:'0040', opType:'inspection', opTypeName:'微生物限度', workCenterName:'微生物实验室', description:'微生物限度检查', status:'done', doneBy:'赵工', doneTime:'2026-06-17 14:00',
          results: [
            { micCode:'2001-MIC-006', micName:'需氧菌总数', micType:'quantitative', methodName:'薄膜过滤法', unit:'CFU/g', lowerSpec:'0', upperSpec:'1000', value:'120', verdict:'合格' },
            { micCode:'2001-MIC-007', micName:'霉菌酵母菌总数', micType:'quantitative', methodName:'薄膜过滤法', unit:'CFU/g', lowerSpec:'0', upperSpec:'100', value:'<10', verdict:'合格' },
            { micCode:'2001-MIC-008', micName:'大肠埃希菌', micType:'qualitative', methodName:'薄膜过滤法', defaultCode:'未检出', value:'未检出', verdict:'合格' }
          ]
        }
      ]
    },
    { id:'B009', batchNo:'2002-2606-003', docNo:'4900000185', materialCode:'MAT-10002', materialName:'淀粉辅料', sapBatch:'SAP-BT-20260602', supplierBatch:'DF2606I14', quantity:'1000.000', unit:'KG', plant:'2002', plantName:'山东丹红制药工厂', planNo:'2002-IP-00001', purposeCode:'QC-01', purposeName:'来料检验', status:'INSP', statusName:'检验中', createTime:'2026-06-14 09:00:00', createBy:'陈工', updateTime:'2026-06-17 11:00:00',
      crossPlantOps: [
        { opNum:'0010', opType:'sampling', opTypeName:'取样', workCenterName:'取样组', description:'按取样方案执行', status:'done', sampledBy:'周工', sampleTime:'2026-06-15 14:00', sampleQty:'3.000', samplingPlanName:'SP-002 辅料取样方案' },
        { opNum:'0020', opType:'inspection', opTypeName:'理化检验', workCenterName:'理化实验室', description:'理化项目检验', status:'done', doneBy:'吴工', doneTime:'2026-06-16 11:00',
          results: [
            { micCode:'2002-MIC-001', micName:'pH值', micType:'quantitative', methodName:'pH值测定法', unit:'pH', lowerSpec:'4.5', upperSpec:'7.0', value:'5.82', verdict:'合格' },
            { micCode:'2002-MIC-002', micName:'干燥失重', micType:'quantitative', methodName:'干燥失重法', unit:'%', lowerSpec:'0', upperSpec:'14.0', value:'11.5', verdict:'合格' }
          ]
        },
        { opNum:'0030', opType:'inspection', opTypeName:'微生物限度', workCenterName:'微生物实验室', description:'微生物限度检查', status:'pending', results: [
          { micCode:'2002-MIC-003', micName:'需氧菌总数', micType:'quantitative', methodName:'薄膜过滤法', unit:'CFU/g', lowerSpec:'0', upperSpec:'1000', value:'', verdict:'' },
          { micCode:'2002-MIC-004', micName:'大肠埃希菌', micType:'qualitative', methodName:'薄膜过滤法', defaultCode:'未检出', value:'', verdict:'' }
        ]}
      ]
    }
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

    el.innerHTML = `<table class="data-table" style="min-width:1550px;">
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
        <th style="width:290px;">操作</th>
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
    // 解析计划以获取取样工序编号
    const plan = this._resolvePlan(b);
    const ops = (plan && plan.operations) ? plan.operations : [
      { opNum:'0010', opType:'sampling' },
      { opNum:'0020', opType:'inspection' }
    ];
    const samplingOp = ops.find(o => o.opType === 'sampling');
    const samplingOpNum = samplingOp ? samplingOp.opNum : '0010';

    return `<div class="table-actions">
      <button class="btn btn-sm" style="background:#f59e0b;color:#fff;" onclick="InspectionBatch.openSamplingForm('${b.id}','${samplingOpNum}')" title="执行取样">取样</button>
      <button class="btn btn-sm" style="background:#6366f1;color:#fff;" onclick="InspectionBatch.selectOpForResult('${b.id}')" title="选择工序录入检验结果">结果录入</button>
      <button class="btn btn-success btn-sm" onclick="InspectionBatch.openDecision('${b.id}')" title="使用决策">使用决策</button>
      <button class="btn btn-blue btn-sm" onclick="InspectionBatch.openDetail('${b.id}')" title="检验批详情">详情</button>
    </div>`;
  },

  _executeGenerate(docId) {
    const doc = this.pendingDocs.find(d => d.id === docId);
    if (!doc) return;

    const planNo = document.getElementById('ibGenPlan')?.value;
    const purpose = document.getElementById('ibGenPurpose')?.value;
    const remark = document.getElementById('ibGenRemark')?.value||'';

    // 校验 SAP 凭证冲销
    if (Math.random() < 0.05) {
      toast('该凭证已被冲销，无法生成检验批');
      return;
    }

    if (!planNo) { toast('请选择检验计划'); return; }

    // 生成检验批号
    const today = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const yy = today.slice(2,4);
    const mm = today.slice(4,6);
    const count = this.batchData.filter(b => b.plant===doc.plant).length + 1;
    const batchNo = `${doc.plant}-${yy}${mm}-${String(count).padStart(3,'0')}`;

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
    this.pendingDocs = this.pendingDocs.filter(d => d.id !== docId);

    closeModal();
    toast(`检验批 ${batchNo} 已生成！${refHist ? '历史结果已引用，请核对确认。' : ''}`);
    this.init();
  },

  doGenerate(docId) {
    const doc = this.pendingDocs.find(d => d.id === docId);
    if (!doc) {
      toast('该凭证已不存在（可能已生成检验批），请刷新页面重试');
      return;
    }

    const planNo = document.getElementById('ibGenPlan')?.value;
    const purpose = document.getElementById('ibGenPurpose')?.value;
    const remark = document.getElementById('ibGenRemark')?.value||'';

    // 校验 SAP 凭证冲销（模拟实时校验）
    if (Math.random() < 0.05) {
      toast('该凭证已被冲销，无法生成检验批');
      return;
    }

    if (!planNo) { toast('请选择检验计划'); return; }

    this._executeGenerate(docId);
  },

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
    const hasSamplingOp = ops.some(o => o.opType === 'sampling');




    const bodyHtml = `<div style="padding:4px 0;">
      <!-- 头部信息条 -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap;">
        <span style="font-size:18px;font-weight:700;color:var(--text);">${esc(b.batchNo)}</span>
        <div>${statusBadge}</div>
        <span style="color:#d1d5db;">|</span>
        <span style="font-size:13px;color:var(--text-secondary);">计划：<span style="font-family:monospace;">${esc(b.planNo)}</span></span>
        <span style="font-size:13px;color:var(--text-secondary);">${esc(b.purposeName)}</span>
        <span style="font-size:13px;color:var(--text-secondary);">${esc(b.plantName)}</span>
      </div>

      <!-- 顶部标签页（方案A：基本信息 / 取样记录 / 结果录入 / 使用决策 / 操作流水） -->
      <div style="display:flex;gap:4px;border-bottom:2px solid var(--border);margin-bottom:16px;">
        <div class="form-tab active" data-ibtab="base" onclick="InspectionBatch._switchIbTab(this)">基本信息</div>
        <div class="form-tab" data-ibtab="sample" onclick="InspectionBatch._switchIbTab(this)">取样记录</div>
        <div class="form-tab" data-ibtab="result" onclick="InspectionBatch._switchIbTab(this)">结果录入</div>
        <div class="form-tab" data-ibtab="decision" onclick="InspectionBatch._switchIbTab(this)">使用决策</div>
        <div class="form-tab" data-ibtab="flow" onclick="InspectionBatch._switchIbTab(this)">操作流水</div>
      </div>

      <div class="ib-tab-panel active" data-ibpanel="base">${this._renderBaseTab(b, ops)}</div>
      <div class="ib-tab-panel" data-ibpanel="sample">${this._renderSamplingTab(b)}</div>
      <div class="ib-tab-panel" data-ibpanel="result">${this._renderResultTab(b)}</div>
      <div class="ib-tab-panel" data-ibpanel="decision">${this._renderDecisionTab(b)}</div>
      <div class="ib-tab-panel" data-ibpanel="flow">${this._renderFlowTab(b)}</div>
    </div>`;

    // 底部全局操作按钮：仅保留「关闭」
    const footerBtns = [
      { text:'关闭', cls:'btn-secondary', action: closeModal }
    ];

    showModal(`检验批详情 — ${b.batchNo}`, bodyHtml, footerBtns, 'modal-xl');
  },

  // ==================== 方案A：查看弹窗标签页内容 ====================

  _switchIbTab(el) {
    const wrap = el.closest('.modal-body') || document;
    const tabs = wrap.querySelectorAll('.form-tab');
    const panels = wrap.querySelectorAll('.ib-tab-panel');
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    const panel = wrap.querySelector('.ib-tab-panel[data-ibpanel="' + el.dataset.ibtab + '"]');
    if (panel) panel.classList.add('active');
  },

  _now() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  },

  // 提取取样记录（统一从 crossPlantOps 或状态推导）
  _getSamplingRecords(b) {
    const recs = [];
    (b.crossPlantOps || []).filter(o => o.opType === 'sampling').forEach((o, i) => {
      recs.push({ id: 'samp_' + i, qty: o.sampleQty, by: o.sampledBy, time: o.sampleTime, plan: o.samplingPlanName, status: o.status === 'done' ? 'valid' : 'pending' });
    });
    if (recs.length === 0 && ['SAMP', 'INSP', 'DONE', 'DEC', 'CLSD'].includes(b.status)) {
      recs.push({ id: 'samp_0', qty: (parseFloat(b.quantity || '0') * 0.01).toFixed(3), by: b.createBy || '质检员', time: b.createTime, plan: '默认取样方案', status: 'valid' });
    }
    return recs;
  },

  // 提取结果录入（检验特性逐行）
  _getResultRecords(b) {
    const recs = [];
    (b.inspectionResults || []).forEach((r, i) => {
      const isQuant = r.micType === 'quantitative';
      const spec = isQuant ? (r.lowerSpec + ' ~ ' + r.upperSpec + ' ' + (r.unit || '')) : (r.defaultCode || '—');
      recs.push({ id: 'res_' + i, name: r.micName, spec: spec, value: r.value, by: b.createBy || '质检员', time: b.updateTime, status: 'valid' });
    });
    (b.crossPlantOps || []).filter(o => o.opType === 'inspection').forEach((o, oi) => {
      (o.results || []).forEach((r, ri) => {
        const isQuant = r.micType === 'quantitative';
        const spec = isQuant ? (r.lowerSpec + ' ~ ' + r.upperSpec + ' ' + (r.unit || '')) : (r.defaultCode || '—');
        recs.push({ id: 'res_c' + oi + '_' + ri, name: r.micName, spec: spec, value: r.value || '待录入', by: o.doneBy || '—', time: o.doneTime || '—', status: r.value ? 'valid' : 'pending' });
      });
    });
    return recs;
  },

  _getDecision(b) {
    return { decision: b.decision, by: b.decisionBy, time: b.decisionTime, remarks: b.decisionRemarks, score: b.qualityScore };
  },

  _renderBaseTab(b, ops) {
    ops = ops || [];

    // 工序清单：商务层级表（风格2）—— 工序主行可展开，检验类展开特性子行
    const opRows = ops.map((op, i) => {
      const isSamp = op.opType === 'sampling';
      const typeName = esc(op.opTypeName || (isSamp ? '取样' : '检验'));
      const chars = op.chars || [];
      const key = isSamp
        ? `取样方案：${esc(op.samplingPlanName || '—')}`
        : `检测项：${chars.length}（定量 ${chars.filter(c => c.micType === 'quantitative').length} / 定性 ${chars.filter(c => c.micType === 'qualitative').length}）`;
      const grp = 'chgrp_' + i;
      let detail;
      if (isSamp) {
        detail = `<tr class="ch-row hide ${grp}"><td colspan="4" class="muted">工序描述：${esc(op.description || '—')}</td></tr>`;
      } else {
        detail = chars.map(c => {
          const isQ = c.micType === 'quantitative';
          const spec = isQ
            ? `规格 <span class="accent">${esc(c.lowerSpec || '—')} ~ ${esc(c.upperSpec || '—')}</span> ${esc(c.unit || '')}`
            : `判定 <span class="accent">${esc(c.defaultCode || '—')}</span>${c.codeGroup ? ` · ${esc(c.codeGroup)}` : ''}`;
          return `<tr class="ch-row hide ${grp}">
            <td colspan="2"><span class="code">${esc(c.micCode)}</span>${esc(c.micName)}</td>
            <td class="muted">${esc(c.methodName || '—')}</td>
            <td>${spec}</td>
          </tr>`;
        }).join('');
      }
      return `<tr class="op-row" onclick="this.classList.toggle('open');document.querySelectorAll('.${grp}').forEach(r=>r.classList.toggle('hide'))">
        <td><span class="caret">▸</span><span class="opn">${esc(op.opNum)}</span></td>
        <td><span class="tw">${typeName}</span></td>
        <td>${esc(op.workCenterName || '—')}</td>
        <td>${key}</td>
      </tr>${detail}`;
    }).join('');

    return `
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
      <div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:10px;">检验工序清单 <span style="font-size:12px;font-weight:400;color:var(--text-muted);">（来源：检验计划 ${esc(b.planNo)} · 点击工序展开特性）</span></div>
      ${ops.length ? `<table class="ib-ops-table"><thead><tr><th style="width:230px;">工序</th><th style="width:160px;">类型</th><th>工作中心</th><th>关键信息</th></tr></thead><tbody>${opRows}</tbody></table>` : '<div style="color:var(--text-muted);font-size:13px;">暂无工序数据</div>'}
      <div style="margin-top:18px;padding:12px 16px;border:1px dashed #d1d5db;border-radius:8px;background:#fffbfb;">
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text);cursor:pointer;">
          <input type="checkbox" id="ibDelFlag_${b.id}" ${b._deleteFlag ? 'checked' : ''} onchange="InspectionBatch._toggleDeleteFlag('${b.id}', this.checked)" />
          <span>🗑️ 删除标记（勾选后，系统将依据此标记处理该检验批）</span>
        </label>
      </div>
    `;
  },

  _toggleDeleteFlag(batchId, checked) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b) return;
    b._deleteFlag = checked;
    toast(checked ? '已勾选删除标记' : '已取消删除标记');
  },


  _renderSamplingTab(b) {
    const recs = this._getSamplingRecords(b);
    const rev = (b._reversed && b._reversed.sampling) || [];
    const rows = recs.map((r, i) => {
      const isRev = rev.includes(r.id);
      const btn = isRev
        ? `<button class="btn btn-danger btn-sm" disabled>冲销</button>`
        : `<button class="btn btn-danger btn-sm" onclick="InspectionBatch._reverseRecord('${b.id}','sampling','${r.id}',this)">冲销</button>`;
      return `<tr class="${isRev ? 'reversed' : ''}">
        <td>${i + 1}</td>
        <td>${esc(r.qty)} ${esc(b.unit || '')}</td>
        <td>${esc(r.by)}</td>
        <td>${esc(r.time) || '—'}</td>
        <td class="table-actions">${btn}</td>
      </tr>`;
    }).join('');
    return `<table class="data-table"><thead><tr><th>序号</th><th>取样量</th><th>取样人</th><th>取样时间</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table>`;
  },

  _renderResultTab(b) {
    const recs = this._getResultRecords(b);
    const rev = (b._reversed && b._reversed.result) || [];
    const rows = recs.map(r => {
      const isRev = rev.includes(r.id);
      const btn = isRev
        ? `<button class="btn btn-danger btn-sm" disabled>冲销</button>`
        : `<button class="btn btn-danger btn-sm" onclick="InspectionBatch._reverseRecord('${b.id}','result','${r.id}',this)">冲销</button>`;
      return `<tr class="${isRev ? 'reversed' : ''}">
        <td>${esc(r.name)}</td>
        <td>${esc(r.spec)}</td>
        <td>${esc(r.value)}</td>
        <td>${esc(r.by)}</td>
        <td>${esc(r.time) || '—'}</td>
        <td class="table-actions">${btn}</td>
      </tr>`;
    }).join('');
    return `<table class="data-table"><thead><tr><th>检验特性</th><th>标准值</th><th>录入值</th><th>录入人</th><th>录入时间</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table>`;
  },

  _renderDecisionTab(b) {
    const d = this._getDecision(b);
    const decRev = b._decisionReversed;
    const statusBadge = decRev ? '<span class="badge badge-gray">已冲销</span>' : (d.time ? '<span class="badge badge-green">已决策</span>' : '<span class="badge badge-gray">尚未决策</span>');
    let html = `<div class="clean-info-card card-active"><h5>使用决策 ${statusBadge}</h5>
      <div class="ro-info-grid">
        <div class="ro-info-field"><span class="ro-info-label">决策结果</span><span class="ro-info-value">${d.decision ? esc(d.decision) : '<span class="empty">— 待录入 —</span>'}</span></div>
        <div class="ro-info-field"><span class="ro-info-label">决策人</span><span class="ro-info-value">${d.by ? esc(d.by) : '—'}</span></div>
        <div class="ro-info-field"><span class="ro-info-label">决策时间</span><span class="ro-info-value">${d.time ? esc(d.time) : '—'}</span></div>
        <div class="ro-info-field"><span class="ro-info-label">说明</span><span class="ro-info-value">${d.remarks ? esc(d.remarks) : '—'}</span></div>
      </div></div>`;
    if (d.time && !decRev) {
      html += `<button class="btn btn-danger btn-sm" onclick="InspectionBatch._reverseRecord('${b.id}','decision',null,this)">冲销决策</button>`;
    }
    return html;
  },

  _renderFlowTab(b) {
    let html = `<div style="background:#f8fafc;border-radius:8px;padding:14px 16px;">
      <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:8px;">📅 操作流水（审计轨迹）</div>
      <div style="font-size:13px;">`;
    html += `<div style="display:flex;gap:12px;padding:6px 0;"><div style="width:8px;height:8px;border-radius:50%;background:#22c55e;margin-top:6px;flex-shrink:0;"></div><div><span style="color:var(--text-muted);">${esc(b.createTime)}</span> — 创建检验批（${esc(b.createBy)}）</div></div>`;
    if (b.status !== 'CRTD') html += `<div style="display:flex;gap:12px;padding:6px 0;"><div style="width:8px;height:8px;border-radius:50%;background:#eab308;margin-top:6px;flex-shrink:0;"></div><div><span style="color:var(--text-muted);">${esc(b.updateTime)}</span> — 状态更新为"${esc(b.statusName)}"</div></div>`;
    if (b.decisionTime) html += `<div style="display:flex;gap:12px;padding:6px 0;"><div style="width:8px;height:8px;border-radius:50%;background:${(b.decision || '').startsWith('A') ? '#22c55e' : '#dc2626'};margin-top:6px;flex-shrink:0;"></div><div><span style="color:var(--text-muted);">${esc(b.decisionTime)}</span> — 决策：<strong>${esc(b.decision || '')} ${esc(b.decisionDesc || '')}</strong>（${esc(b.decisionBy || '')}）${b.qualityScore != null ? ` — 得分：${b.qualityScore}分` : ''}</div></div>`;
    if (b.closeTime) html += `<div style="display:flex;gap:12px;padding:6px 0;"><div style="width:8px;height:8px;border-radius:50%;background:#6b7280;margin-top:6px;flex-shrink:0;"></div><div><span style="color:var(--text-muted);">${esc(b.closeTime)}</span> — 已关闭归档</div></div>`;
    if (b.cancelReason) html += `<div style="display:flex;gap:12px;padding:6px 0;"><div style="width:8px;height:8px;border-radius:50%;background:#dc2626;margin-top:6px;flex-shrink:0;"></div><div><span style="color:var(--text-muted);">${esc(b.updateTime)}</span> — ${esc(b.cancelReason)}</div></div>`;
    (b._auditLog || []).forEach(l => {
      const label = l.kind === 'sampling' ? '取样' : l.kind === 'result' ? '检验特性' : l.kind === 'decision' ? '使用决策' : '记录';
      html += `<div style="display:flex;gap:12px;padding:6px 0;"><div style="width:8px;height:8px;border-radius:50%;background:#dc2626;margin-top:6px;flex-shrink:0;"></div><div><span style="color:var(--text-muted);">${esc(l.time)}</span> — <span style="color:#dc2626;">冲销${label}（原因：${esc(l.reason)}）</span></div></div>`;
    });
    html += `</div></div>`;
    return html;
  },

  // 单行/单条冲销：弹原因确认框 → 标记已冲销 + 生成反向流水 → 重绘弹窗
  _reverseRecord(batchId, kind, recId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b) return;
    const kindLabel = kind === 'sampling' ? '本次取样记录' : kind === 'result' ? '该检验特性' : '使用决策';
    showModal('冲销确认',
      `<div style="padding:4px 0;">
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">确认冲销${kindLabel}？冲销后将保留原记录并标记「已冲销」，同时生成反向流水。</p>
        <div class="form-group"><label>冲销原因 <span class="req">*</span></label>
          <select id="ibRevReason"><option>录入错误</option><option>取样器具污染</option><option>重复录入</option><option>其他原因</option></select>
        </div>
        <div class="form-group"><label>备注说明</label><textarea id="ibRevRemark" placeholder="可选，补充说明冲销背景"></textarea></div>
      </div>`,
      [
        { text: '取消', cls: 'btn-secondary', action: closeModal },
        { text: '确认冲销', cls: 'btn-danger', action: () => {
            const reason = (document.getElementById('ibRevReason') && document.getElementById('ibRevReason').value) || '录入错误';
            b._reversed = b._reversed || { sampling: [], result: [] };
            b._auditLog = b._auditLog || [];
            if (kind === 'sampling') b._reversed.sampling.push(recId);
            else if (kind === 'result') b._reversed.result.push(recId);
            else if (kind === 'decision') b._decisionReversed = true;
            b._auditLog.push({ time: this._now(), kind: kind, recId: recId, reason: reason });
            closeModal();
            this.openDetail(batchId);
            toast('已冲销并生成反向流水');
          }
        }
      ]
    );
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
        { text:'取消', cls:'btn-secondary', action: ()=>{ InspectionBatch.openDetail(batchId); } },
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
    this.init();
    InspectionBatch.openDetail(batchId);
  },

  // ==================== 检验结果录入弹窗 ====================

  // 用户选择要录入结果的检验工序
  selectOpForResult(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b) return toast('检验批未找到');
    if (['CANC','CLSD'].includes(b.status)) return toast('当前状态不允许录入结果');

    const plan = this._resolvePlan(b);
    const allOps = (plan && plan.operations) ? plan.operations : [
      { opNum:'0010', opType:'sampling', opTypeName:'取样', workCenterName:'QC取样室', description:'按取样方案执行取样' },
      { opNum:'0020', opType:'inspection', opTypeName:'检验', workCenterName:'QC实验室', description:'外观、含量、pH值等' }
    ];

    // 只筛选检验类型的工序
    const inspectionOps = allOps.filter(o => o.opType !== 'sampling');

    if (inspectionOps.length === 0) {
      toast('该检验计划暂无检验工序，请检查检验计划配置');
      return;
    }

    // 如果只有一个检验工序，直接进入录入
    if (inspectionOps.length === 1) {
      this.openResultEntry(batchId, inspectionOps[0].opNum);
      return;
    }

    const opCards = inspectionOps.map((op, i) => {
      const hasChars = op.chars && op.chars.length > 0;
      const charCount = hasChars ? op.chars.length : 0;
      return `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div style="min-width:0;flex:1;">
          <div style="font-weight:600;font-size:14px;color:var(--text);display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span style="font-family:monospace;color:#6366f1;">${esc(op.opNum)}</span>
            <span>${esc(op.opTypeName)}</span>
            <span class="badge badge-sm" style="background:#eef2ff;color:#4338ca;">${esc(op.workCenterName)}</span>
          </div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">
            ${esc(op.description||'—')}
            ${hasChars
              ? `<span style="margin-left:8px;color:#059669;">· ${charCount} 个检验特性</span>`
              : '<span style="margin-left:8px;color:#ef4444;">· 无检验特性</span>'}
          </div>
        </div>
        <button class="btn btn-sm" style="background:#6366f1;color:#fff;flex-shrink:0;" onclick="closeModal();InspectionBatch.openResultEntry('${batchId}','${op.opNum}');">
          录入结果
        </button>
      </div>`;
    }).join('');

    showModal(
      `选择检验工序 — ${esc(b.batchNo)}`,
      `<div style="padding:4px 0;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          <div style="font-weight:600;margin-bottom:4px;">📋 ${esc(b.batchNo)}</div>
          <div style="color:var(--text-secondary);">物料：${esc(b.materialCode)} ${esc(b.materialName)} | 计划：${esc(b.planNo)}</div>
        </div>
        <div style="margin-bottom:8px;font-size:13px;color:var(--text-secondary);">请选择要录入结果的检验工序：</div>
        <div style="display:flex;flex-direction:column;gap:10px;max-height:50vh;overflow-y:auto;">
          ${opCards}
        </div>
      </div>`,
      [{ text:'取消', cls:'btn-outline', action: closeModal }],
      'modal-lg'
    );
  },

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
            <th style="width:190px;">实测值</th>
          </tr></thead>
          <tbody>${charRows}</tbody>
        </table>
        <div class="form-group full" style="margin-top:12px;">
          <label>备注</label>
          <input type="text" id="ibResultRemark" placeholder="可选填写备注" style="width:100%;">
        </div>
      </div>`,
      [
        { text:'取消', cls:'btn-secondary', action: ()=>{ InspectionBatch.openDetail(batchId); } },
        { text:'保存草稿', cls:'btn-secondary', action: ()=>{ toast('草稿已保存'); InspectionBatch.openDetail(batchId); } },
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
    this.init();
    InspectionBatch.openDetail(batchId);
  },

  // ==================== 使用决策 ====================

  // 决策代码配置（对应 PRD 4.2.3 字段1）
  decisionCodes: [
    { code:'A1', description:'合格（接收）', suggestedAction:'放行至可用库存', targetStock:'可用库存' },
    { code:'A2', description:'让步接收', suggestedAction:'放行至可用库存，并记录偏差', targetStock:'可用库存' },
    { code:'R1', description:'拒收', suggestedAction:'转移至冻结库存，触发退货流程', targetStock:'冻结库存' },
    { code:'R2', description:'报废', suggestedAction:'转移至冻结库存，触发报废流程', targetStock:'冻结库存' }
  ],

  // 提取检验结果（统一处理 inspectionResults 和 crossPlantOps）
  _getInspectionResults(b) {
    if (b.inspectionResults && b.inspectionResults.length > 0) {
      return b.inspectionResults;
    }
    // 从工序数据中提取
    if (b.crossPlantOps) {
      const results = [];
      b.crossPlantOps.forEach(op => {
        if (op.opType === 'inspection' && op.status === 'done' && op.results) {
          op.results.forEach(r => results.push(r));
        }
      });
      if (results.length > 0) return results;
    }
    return [];
  },

  openDecision(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b || b.status !== 'DONE') return toast('只有检验完成的批次才能执行决策');

    const results = this._getInspectionResults(b);
    const totalQty = parseFloat(b.quantity) || 0;
    const failCount = results.filter(r => r.verdict === '不合格').length;
    const passCount = results.length - failCount;
    // 自动计算质量得分
    const autoScore = results.length > 0 ? Math.round((passCount / results.length) * 100) : 100;
    const verdictText = failCount > 0 ? '不合格' : '合格';

    // ============ 决策依据概览表格 ============
    let resultsTableHtml = '';
    if (results.length > 0) {
      const rows = results.map((r, i) => {
        const isQuant = r.micType === 'quantitative';
        const isPass = r.verdict === '合格';
        const specRange = isQuant
          ? `${r.lowerSpec||'—'} ~ ${r.upperSpec||'—'} ${r.unit||''}`
          : (r.upperSpec || r.defaultCode || '—');
        const valueCell = r.value || '—';
        return `<tr class="${isPass ? '' : 'dc-fail-row'}" style="${isPass ? '' : 'background:#fef2f2;'}">
          <td style="font-size:12px;">${i + 1}</td>
          <td style="font-weight:500;font-size:13px;">${esc(r.micName)}</td>
          <td style="font-family:monospace;font-size:11px;color:var(--text-secondary);">${specRange}</td>
          <td style="font-family:monospace;font-weight:600;font-size:13px;${isPass?'color:#15803d;':'color:#dc2626;'}">${esc(valueCell)} ${isQuant?esc(r.unit||''):''}</td>
          <td><span class="badge ${isPass?'badge-green':'badge-red'} badge-sm">${esc(r.verdict)}</span></td>
        </tr>`;
      }).join('');

      resultsTableHtml = `<table class="data-table" style="width:100%;font-size:13px;">
        <thead><tr>
          <th style="width:40px;">#</th><th>特性描述</th><th style="width:140px;">规格范围</th><th style="width:130px;">实测值</th><th style="width:70px;">判定</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
    } else {
      resultsTableHtml = `<div style="text-align:center;padding:20px;color:var(--text-muted);">暂无检验结果数据</div>`;
    }

    // ============ 决策代码选项 ============
    const codeOptions = this.decisionCodes.map(dc =>
      `<option value="${dc.code}">${dc.code} — ${esc(dc.description)}</option>`
    ).join('');

    // ============ 完整弹窗 HTML ============
    const bodyHtml = `<div style="padding:4px 0;max-height:72vh;overflow-y:auto;">
      <!-- 区域1：上下文信息区（PRD 4.2.1） -->
      <div style="background:#f0f9ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px 18px;margin-bottom:16px;">
        <div style="font-size:13px;font-weight:700;color:#1d4ed8;margin-bottom:10px;">📋 上下文信息</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px 24px;font-size:13px;">
          <div><span style="color:var(--text-muted);">检验批号：</span><strong style="font-family:monospace;color:#2563eb;">${esc(b.batchNo)}</strong></div>
          <div><span style="color:var(--text-muted);">物料号：</span><strong style="font-family:monospace;">${esc(b.materialCode)}</strong></div>
          <div><span style="color:var(--text-muted);">物料描述：</span><strong>${esc(b.materialName)}</strong></div>
          <div><span style="color:var(--text-muted);">供应商批次：</span><strong style="color:#2563eb;">${esc(b.supplierBatch)}</strong></div>
          <div><span style="color:var(--text-muted);">工厂：</span>${esc(b.plantName)}</div>
          <div><span style="color:var(--text-muted);">检验类型：</span>${esc(b.purposeName)}</div>
          <div><span style="color:var(--text-muted);">SAP批次：</span><span style="font-family:monospace;font-size:12px;">${esc(b.sapBatch)}</span></div>
          <div><span style="color:var(--text-muted);">数量：</span><strong>${b.quantity} ${esc(b.unit)}</strong></div>
          <div></div>
        </div>
      </div>

      <!-- 区域2：决策依据概览区（PRD 4.2.2） -->
      <div style="background:${failCount>0?'#fff5f5':'#f0fdf4'};border:1px solid ${failCount>0?'#fecaca':'#bbf7d0'};border-radius:10px;padding:14px 18px;margin-bottom:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="font-size:13px;font-weight:700;color:${failCount>0?'#dc2626':'#15803d'};">🔍 决策依据概览 — 检验结果汇总</div>
          <div style="font-size:12px;">
            <span class="badge ${failCount>0?'badge-red':'badge-green'}">综合判定：${verdictText}</span>
            <span style="margin-left:8px;color:var(--text-muted);">${passCount}/${results.length} 项合格</span>
            ${failCount>0 ? `<span style="margin-left:4px;color:#dc2626;font-weight:600;">${failCount} 项不合格</span>` : ''}
          </div>
        </div>
        ${resultsTableHtml}
      </div>

      <!-- 区域3：决策录入区（PRD 4.2.3 — 核心操作区） -->
      <div style="background:#fff;border:2px solid #6366f1;border-radius:10px;padding:18px;margin-bottom:16px;">
        <div style="font-size:13px;font-weight:700;color:#4338ca;margin-bottom:14px;">✍️ 决策录入</div>

        <!-- 字段1：决策代码（必填） -->
        <div class="form-group" style="margin-bottom:14px;">
          <label style="font-weight:600;">决策代码 <span style="color:#dc2626;">*</span></label>
          <select id="dcCode" onchange="InspectionBatch._onDecisionCodeChange('${batchId}')" style="width:100%;font-size:14px;padding:10px;">
            <option value="">— 请选择决策代码 —</option>
            ${codeOptions}
          </select>
          <div id="dcSuggestedAction" style="font-size:12px;color:var(--text-muted);margin-top:6px;min-height:18px;"></div>
        </div>

        <!-- 字段2：质量得分（可选，自动计算 + 可手动调整） -->
        <div class="form-group" style="margin-bottom:14px;">
          <label style="font-weight:600;">质量得分 <span style="font-size:12px;color:var(--text-muted);">（0-100，可选）</span></label>
          <div style="display:flex;align-items:center;gap:10px;">
            <input type="range" id="dcScoreRange" min="0" max="100" value="${autoScore}" style="flex:1;"
              oninput="document.getElementById('dcScore').value=this.value">
            <input type="number" id="dcScore" value="${autoScore}" min="0" max="100" style="width:70px;text-align:center;font-weight:600;font-size:16px;"
              oninput="var v=parseInt(this.value)||0; if(v>100)v=100; if(v<0)v=0; this.value=v; document.getElementById('dcScoreRange').value=v;">
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">
            系统建议：<strong>${autoScore}</strong> 分（基于 ${passCount}/${results.length} 合格率）
          </div>
        </div>

        <!-- 字段3：库存过账（条件必填） -->
        <div style="background:#f8fafc;border-radius:8px;padding:14px;margin-bottom:14px;">
          <div style="font-weight:600;font-size:13px;margin-bottom:10px;">📦 库存过账 <span style="font-size:12px;color:var(--text-muted);">（条件必填）</span></div>
          <table class="data-table" style="width:100%;font-size:13px;">
            <thead><tr>
              <th>库存类型</th><th style="width:100px;">当前数量</th><th style="width:120px;">合格品数量</th><th style="width:120px;">不合格品数量</th>
            </tr></thead>
            <tbody>
              <tr>
                <td><span class="badge badge-yellow badge-sm">待检库存</span></td>
                <td style="font-weight:600;">${b.quantity} ${esc(b.unit)}</td>
                <td><input type="number" id="dcQtyOk" step="any" min="0" max="${totalQty}" value="0" style="width:100px;"
                  onchange="InspectionBatch._onQtyChange('${batchId}')"></td>
                <td><input type="number" id="dcQtyNg" step="any" min="0" max="${totalQty}" value="0" style="width:100px;"
                  onchange="InspectionBatch._onQtyChange('${batchId}')"></td>
              </tr>
            </tbody>
          </table>
          <div id="dcStockInfo" style="font-size:12px;color:var(--text-muted);margin-top:8px;"></div>
        </div>

        <!-- 字段4：备注/决策原因（可选） -->
        <div class="form-group">
          <label style="font-weight:600;">备注 / 决策原因 <span style="font-size:12px;color:var(--text-muted);">（可选）</span></label>
          <textarea id="dcRemarks" rows="3" style="width:100%;resize:vertical;" placeholder="请输入决策原因或补充说明..."></textarea>
        </div>
      </div>

      <!-- 区域4：操作与提交区（PRD 4.2.4） -->
      <div style="display:flex;gap:12px;justify-content:flex-end;padding:8px 0 0;">
        <button class="btn btn-secondary" onclick="closeModal()" style="padding:10px 28px;">取消</button>
        <button class="btn btn-primary" onclick="InspectionBatch._doDecisionSave('${batchId}')" style="padding:10px 28px;font-size:15px;">
          保存决策
        </button>
      </div>
    </div>`;

    showModal(
      `使用决策 — ${esc(b.batchNo)}`,
      bodyHtml,
      [],  // 底部按钮内置在 body 中
      'modal-xl'
    );
  },

  // 决策代码变更 → 联动更新建议动作、库存目标
  _onDecisionCodeChange(batchId) {
    const code = document.getElementById('dcCode')?.value || '';
    const dc = this.decisionCodes.find(d => d.code === code);
    const actionEl = document.getElementById('dcSuggestedAction');
    const stockInfoEl = document.getElementById('dcStockInfo');
    const qtyOkEl = document.getElementById('dcQtyOk');
    const qtyNgEl = document.getElementById('dcQtyNg');

    if (!dc) {
      if (actionEl) actionEl.innerHTML = '';
      if (stockInfoEl) stockInfoEl.innerHTML = '';
      if (qtyOkEl) qtyOkEl.value = 0;
      if (qtyNgEl) qtyNgEl.value = 0;
      return;
    }

    const b = this.batchData.find(x => x.id === batchId);
    const totalQty = parseFloat(b?.quantity) || 0;

    if (actionEl) {
      actionEl.innerHTML = `<span style="color:#2563eb;">📌 建议跟进动作：<strong>${esc(dc.suggestedAction)}</strong></span>`;
    }

    // 根据决策代码自动填充库存过账
    if (dc.code === 'A1' || dc.code === 'A2') {
      // 接收类：全部 → 可用库存
      if (qtyOkEl) qtyOkEl.value = totalQty;
      if (qtyNgEl) qtyNgEl.value = 0;
      if (stockInfoEl) stockInfoEl.innerHTML = `<span style="color:#059669;">✅ 建议：将全部 <strong>${totalQty} ${esc(b?.unit||'')}</strong> 从「待检库存」转移至「<strong>${esc(dc.targetStock)}</strong>」${dc.code==='A2'?'（需记录偏差）':''}</span>`;
    } else {
      // 拒绝类：全部 → 冻结库存
      if (qtyOkEl) qtyOkEl.value = 0;
      if (qtyNgEl) qtyNgEl.value = totalQty;
      if (stockInfoEl) stockInfoEl.innerHTML = `<span style="color:#dc2626;">🚫 建议：将全部 <strong>${totalQty} ${esc(b?.unit||'')}</strong> 从「待检库存」转移至「<strong>${esc(dc.targetStock)}</strong>」</span>`;
    }
  },

  // 库存数量变更 → 校验总数
  _onQtyChange(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    const totalQty = parseFloat(b?.quantity) || 0;
    const ok = parseFloat(document.getElementById('dcQtyOk')?.value) || 0;
    const ng = parseFloat(document.getElementById('dcQtyNg')?.value) || 0;
    const sum = ok + ng;
    const stockInfoEl = document.getElementById('dcStockInfo');
    if (stockInfoEl) {
      if (sum > totalQty) {
        stockInfoEl.innerHTML = `<span style="color:#dc2626;">⚠️ 合格品 + 不合格品数量超过总量 ${totalQty} ${esc(b?.unit||'')}，请调整</span>`;
      } else {
        stockInfoEl.innerHTML = `<span style="color:var(--text-muted);">已分配：${ok} 合格 + ${ng} 不合格 = ${sum} ${esc(b?.unit||'')}${sum < totalQty ? `（剩余 ${(totalQty - sum).toFixed(3)} 未分配）` : ' ✓'}</span>`;
      }
    }
  },

  // 保存决策（含二次确认对话框）
  _doDecisionSave(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b || b.status !== 'DONE') return;

    // ========== 必填项校验 ==========
    const code = document.getElementById('dcCode')?.value || '';
    if (!code) { toast('请选择决策代码'); return; }

    const dc = this.decisionCodes.find(d => d.code === code);
    const qtyOk = parseFloat(document.getElementById('dcQtyOk')?.value) || 0;
    const qtyNg = parseFloat(document.getElementById('dcQtyNg')?.value) || 0;
    const totalQty = parseFloat(b.quantity) || 0;
    const score = parseInt(document.getElementById('dcScore')?.value) || 0;
    const remarks = (document.getElementById('dcRemarks')?.value || '').trim();
    const sum = qtyOk + qtyNg;

    if (sum <= 0) { toast('请至少填写合格品或不格品数量'); return; }
    if (sum > totalQty + 0.001) { toast(`合格品+不合格品(${sum})超过检验批总量(${totalQty})，请调整`); return; }

    // ========== 二次确认对话框 ==========
    const actionText = code.startsWith('A') ? '接收' : '拒绝';
    const confirmHtml = `<div style="padding:8px 0;">
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px;margin-bottom:16px;text-align:center;">
        <div style="font-size:32px;margin-bottom:8px;">⚠️</div>
        <div style="font-size:16px;font-weight:700;color:#92400e;">确认执行使用决策</div>
        <div style="font-size:13px;color:#a16207;margin-top:6px;">此操作将完成检验批并触发后续动作，是否确认？</div>
      </div>
      <table style="width:100%;font-size:13px;border-collapse:collapse;">
        <tr><td style="padding:6px 12px;color:var(--text-muted);width:90px;">检验批号</td><td style="padding:6px 12px;font-weight:600;font-family:monospace;color:#2563eb;">${esc(b.batchNo)}</td></tr>
        <tr><td style="padding:6px 12px;color:var(--text-muted);">决策代码</td><td style="padding:6px 12px;"><span class="badge ${code.startsWith('A')?'badge-green':'badge-red'}">${esc(code)} — ${esc(dc?.description||'')}</span></td></tr>
        <tr><td style="padding:6px 12px;color:var(--text-muted);">跟进动作</td><td style="padding:6px 12px;color:#2563eb;font-weight:500;">${esc(dc?.suggestedAction||'')}</td></tr>
        <tr><td style="padding:6px 12px;color:var(--text-muted);">质量得分</td><td style="padding:6px 12px;font-weight:600;">${score} 分</td></tr>
        <tr><td style="padding:6px 12px;color:var(--text-muted);">合格品数量</td><td style="padding:6px 12px;color:#059669;font-weight:600;">${qtyOk} ${esc(b.unit)} → 可用库存</td></tr>
        <tr><td style="padding:6px 12px;color:var(--text-muted);">不合格品数量</td><td style="padding:6px 12px;color:#dc2626;font-weight:600;">${qtyNg > 0 ? qtyNg + ' ' + esc(b.unit) + ' → 冻结库存' : '—'}</td></tr>
        ${remarks ? `<tr><td style="padding:6px 12px;color:var(--text-muted);">备注</td><td style="padding:6px 12px;">${esc(remarks)}</td></tr>` : ''}
        <tr><td style="padding:6px 12px;color:var(--text-muted);">决策人</td><td style="padding:6px 12px;">质量工程师（当前用户）</td></tr>
      </table>
    </div>`;

    showModal(
      '二次确认 — 使用决策',
      confirmHtml,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal },
        { text:'✅ 确认执行', cls:'btn-primary', action: function() {
          closeModal();
          InspectionBatch._doDecisionConfirm(batchId, code, dc, qtyOk, qtyNg, score, remarks);
        }}
      ],
      'modal-md'
    );
  },

  // 最终执行决策
  _doDecisionConfirm(batchId, code, dc, qtyOk, qtyNg, score, remarks) {
    // PRD 4.1: 决策前实时校验冲销
    if (Math.random() < 0.03) {
      toast('该检验批对应的 SAP 收货凭证已被冲销，无法执行决策');
      this.doCancelBatch(batchId, 'SAP 凭证冲销，自动取消');
      return;
    }

    const b = this.batchData.find(x => x.id === batchId);
    if (!b || b.status !== 'DONE') return;

    const now = new Date().toISOString().replace('T',' ').slice(0,19);
    b.status = 'DEC';
    b.statusName = '已决策';
    b.decision = code;
    b.decisionDesc = dc.description;
    b.decisionBy = '质量工程师';
    b.decisionTime = now;
    b.updateTime = now;
    b.qualityScore = score;
    b.qtyOk = qtyOk;
    b.qtyNg = qtyNg;
    b.decisionRemarks = remarks;
    b.decisionAction = dc.suggestedAction;
    b.targetStock = dc.targetStock;

    toast(`使用决策「${code} — ${dc.description}」已执行！检验批 ${b.batchNo} 状态已更新为"已决策"${remarks ? '，备注已记录' : ''}`);
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
  }

};
