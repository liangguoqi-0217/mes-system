// ===== 检验方法 Page =====
// 质量主数据三级目录 · 各工厂独立维护 · PRD V1.0

// ---- 工厂选项（与主检验特性共用）----
const imFactoryOptions = [
  { value:'1000', label:'1000（山东步长）' },
  { value:'2001', label:'2001（陕西步长）' },
  { value:'2002', label:'2002（山东丹红）' },
  { value:'2003', label:'2003（神州步长）' }
];

// ---- 版本管理辅助函数 ----
function imGenerateVersion(prevVer) {
  if (!prevVer) return 'V1.0';
  const m = prevVer.match(/^V(\d+)\.(\d+)$/);
  if (m) return `V${m[1]}.${parseInt(m[2]) + 1}`;
  return prevVer + '-V1.0';
}

// ---- Mock 数据 ----
const imData = [
  { id:'IM001', code:'2001-METHOD-0001', factory:'2001', factoryName:'2001（陕西步长）',
    name:'高效液相色谱法测定含量', refStandard:'《中国药典》2025版通则0512',
    currentVersion:'V2.0', status:'active',
    instruments:'Agilent 1260 HPLC 色谱仪\nC18色谱柱 (4.6×250mm, 5μm)',
    reagents:'甲醇（色谱纯）\n乙腈（色谱纯）\n磷酸二氢钾（分析纯）',
    procedures:'1. 制备流动相：取磷酸二氢钾6.8g，加水1000mL溶解，用磷酸调节pH至3.0，与乙腈按85:15混合，超声脱气。\n2. 供试品溶液制备：取本品20片，精密称定，研细，精密称取适量（约相当于主成分50mg），置50mL量瓶中，加流动相40mL，超声处理15分钟，放冷，用流动相稀释至刻度，摇匀，滤过。\n3. 色谱条件：检测波长254nm，流速1.0mL/min，柱温30℃，进样量10μL。\n4. 测定：精密量取供试品溶液和对照品溶液各10μL，注入液相色谱仪，记录色谱图，按外标法以峰面积计算含量。',
    formula:'含量% = (A样 × C对 × 稀释倍数) / (A对 × 标示量) × 100%',
    sopUrl:'https://sop.pharm.com/doc/SOP-QC-0012',
    createdBy:'张工', createdDate:'2025-01-15', changedBy:'李经理', changedDate:'2025-06-01',
    versions: [
      { ver:'V1.0', createdBy:'张工', createdDate:'2025-01-15', changedBy:'张工', changedDate:'2025-01-15', status:'history',
        name:'高效液相色谱法测定含量', refStandard:'《中国药典》2020版通则0512',
        instruments:'Agilent 1200 HPLC 色谱仪\nC18色谱柱 (4.6×250mm, 5μm)',
        reagents:'甲醇（色谱纯）\n乙腈（色谱纯）\n磷酸二氢钾（分析纯）',
        procedures:'1. 制备流动相：取磷酸二氢钾6.8g，加水1000mL溶解，用磷酸调节pH至3.0，与乙腈按85:15混合。\n2. 供试品溶液制备：取本品20片，精密称定，研细，精密称取适量，置50mL量瓶中，加流动相溶解，稀释至刻度，摇匀，滤过。\n3. 色谱条件：检测波长254nm，流速1.0mL/min，柱温30℃，进样量10μL。\n4. 测定：按外标法以峰面积计算含量。',
        formula:'含量% = (A样 × C对) / (A对 × 标示量) × 100%',
        sopUrl:'' }
    ]
  },
  { id:'IM002', code:'2001-METHOD-0002', factory:'2001', factoryName:'2001（陕西步长）',
    name:'pH值测定法', refStandard:'《中国药典》2025版通则0631',
    currentVersion:'V1.0', status:'active',
    instruments:'Mettler Toledo SevenCompact pH计\n复合电极',
    reagents:'pH标准缓冲液（pH 4.01、6.86、9.18）\n纯化水',
    procedures:'1. 校正：使用pH 4.01和pH 6.86标准缓冲液进行两点校正，斜率应在95%~105%之间。\n2. 供试品溶液制备：取供试品适量，加水适量，搅拌使溶解，制成每1mL含10mg的溶液。\n3. 测定：取供试品溶液，在25±1℃条件下测定pH值，连续测定三次，取平均值。\n4. 每次测定后用纯化水冲洗电极，用滤纸吸干。',
    formula:'pH = 三次测定平均值',
    sopUrl:'https://sop.pharm.com/doc/SOP-QC-0008',
    createdBy:'张工', createdDate:'2025-01-15', changedBy:'', changedDate:'',
    versions: [
      { ver:'V1.0', createdBy:'张工', createdDate:'2025-01-15', changedBy:'张工', changedDate:'2025-01-15', status:'active',
        name:'pH值测定法', refStandard:'《中国药典》2025版通则0631',
        instruments:'Mettler Toledo SevenCompact pH计\n复合电极',
        reagents:'pH标准缓冲液（pH 4.01、6.86、9.18）\n纯化水',
        procedures:'1. 校正：使用pH 4.01和pH 6.86标准缓冲液进行两点校正，斜率应在95%~105%之间。\n2. 供试品溶液制备：取供试品适量，加水适量，搅拌使溶解，制成每1mL含10mg的溶液。\n3. 测定：取供试品溶液，在25±1℃条件下测定pH值，连续测定三次，取平均值。\n4. 每次测定后用纯化水冲洗电极，用滤纸吸干。',
        formula:'pH = 三次测定平均值',
        sopUrl:'https://sop.pharm.com/doc/SOP-QC-0008' }
    ]
  },
  { id:'IM003', code:'2002-METHOD-0001', factory:'2002', factoryName:'2002（山东丹红）',
    name:'水分测定法（卡尔费休法）', refStandard:'《中国药典》2025版通则0832',
    currentVersion:'V1.0', status:'active',
    instruments:'Mettler Toledo V30S 卡尔费休水分测定仪',
    reagents:'卡尔费休试剂（容量法）\n无水甲醇',
    procedures:'1. 标定：使用纯水标定卡尔费休试剂的滴定度，连续三次标定RSD≤2.0%。\n2. 供试品测定：精密称取供试品约100mg，加入滴定杯中，用卡尔费休试剂滴定至终点。\n3. 计算：按滴定度和消耗体积计算水分含量。',
    formula:'水分% = (V × F) / W × 100%',
    sopUrl:'',
    createdBy:'王质检', createdDate:'2025-02-01', changedBy:'', changedDate:'',
    versions: [
      { ver:'V1.0', createdBy:'王质检', createdDate:'2025-02-01', changedBy:'王质检', changedDate:'2025-02-01', status:'active',
        name:'水分测定法（卡尔费休法）', refStandard:'《中国药典》2025版通则0832',
        instruments:'Mettler Toledo V30S 卡尔费休水分测定仪',
        reagents:'卡尔费休试剂（容量法）\n无水甲醇',
        procedures:'1. 标定：使用纯水标定卡尔费休试剂的滴定度，连续三次标定RSD≤2.0%。\n2. 供试品测定：精密称取供试品约100mg，加入滴定杯中，用卡尔费休试剂滴定至终点。\n3. 计算：按滴定度和消耗体积计算水分含量。',
        formula:'水分% = (V × F) / W × 100%',
        sopUrl:'' }
    ]
  },
  { id:'IM004', code:'2001-METHOD-0003', factory:'2001', factoryName:'2001（陕西步长）',
    name:'目视检查法', refStandard:'《中国药典》2025版通则0901',
    currentVersion:'V1.0', status:'active',
    instruments:'标准光源灯箱（D65光源）\n放大镜（10×）',
    reagents:'标准比色液',
    procedures:'1. 外观检查：取供试品20片，置白色背景上，在标准光源下（D65，照度1000Lux）目视观察片剂外观。\n2. 颜色比对：取供试品与标准比色液在相同光源下进行目视比对。\n3. 记录：记录任何缺陷（裂纹、斑点、变色、异物等）。',
    formula:'',
    sopUrl:'https://sop.pharm.com/doc/SOP-QC-0005',
    createdBy:'张工', createdDate:'2025-01-15', changedBy:'', changedDate:'',
    versions: [
      { ver:'V1.0', createdBy:'张工', createdDate:'2025-01-15', changedBy:'张工', changedDate:'2025-01-15', status:'active',
        name:'目视检查法', refStandard:'《中国药典》2025版通则0901',
        instruments:'标准光源灯箱（D65光源）\n放大镜（10×）',
        reagents:'标准比色液',
        procedures:'1. 外观检查：取供试品20片，置白色背景上，在标准光源下（D65，照度1000Lux）目视观察片剂外观。\n2. 颜色比对：取供试品与标准比色液在相同光源下进行目视比对。\n3. 记录：记录任何缺陷（裂纹、斑点、变色、异物等）。',
        formula:'',
        sopUrl:'https://sop.pharm.com/doc/SOP-QC-0005' }
    ]
  },
  { id:'IM005', code:'2003-METHOD-0001', factory:'2003', factoryName:'2003（神州步长）',
    name:'微生物限度检查法', refStandard:'《中国药典》2025版通则1105',
    currentVersion:'V1.0', status:'active',
    instruments:'生物安全柜（Class II）\n恒温培养箱（30-35℃）\n恒温培养箱（20-25℃）\n菌落计数器',
    reagents:'胰酪大豆胨琼脂培养基（TSA）\n沙氏葡萄糖琼脂培养基（SDA）\npH 7.0无菌氯化钠-蛋白胨缓冲液',
    procedures:'1. 供试液制备：取供试品10g，加pH 7.0无菌氯化钠-蛋白胨缓冲液至100mL，制成1:10供试液。\n2. 需氧菌总数：取供试液1mL，用TSA培养基，采用平皿法，30-35℃培养3-5天，计数。\n3. 霉菌和酵母菌总数：取供试液1mL，用SDA培养基，采用平皿法，20-25℃培养5-7天，计数。\n4. 阴性对照：取稀释液1mL，同法操作。',
    formula:'需氧菌总数 (cfu/g) = 平均菌落数 × 稀释倍数\n霉菌酵母菌总数 (cfu/g) = 平均菌落数 × 稀释倍数',
    sopUrl:'https://sop.pharm.com/doc/SOP-QC-0015',
    createdBy:'赵经理', createdDate:'2025-03-05', changedBy:'', changedDate:'',
    versions: [
      { ver:'V1.0', createdBy:'赵经理', createdDate:'2025-03-05', changedBy:'赵经理', changedDate:'2025-03-05', status:'active',
        name:'微生物限度检查法', refStandard:'《中国药典》2025版通则1105',
        instruments:'生物安全柜（Class II）\n恒温培养箱（30-35℃）\n恒温培养箱（20-25℃）\n菌落计数器',
        reagents:'胰酪大豆胨琼脂培养基（TSA）\n沙氏葡萄糖琼脂培养基（SDA）\npH 7.0无菌氯化钠-蛋白胨缓冲液',
        procedures:'1. 供试液制备：取供试品10g，加pH 7.0无菌氯化钠-蛋白胨缓冲液至100mL，制成1:10供试液。\n2. 需氧菌总数：取供试液1mL，用TSA培养基，采用平皿法，30-35℃培养3-5天，计数。\n3. 霉菌和酵母菌总数：取供试液1mL，用SDA培养基，采用平皿法，20-25℃培养5-7天，计数。\n4. 阴性对照：取稀释液1mL，同法操作。',
        formula:'需氧菌总数 (cfu/g) = 平均菌落数 × 稀释倍数\n霉菌酵母菌总数 (cfu/g) = 平均菌落数 × 稀释倍数',
        sopUrl:'https://sop.pharm.com/doc/SOP-QC-0015' }
    ]
  },
  { id:'IM006', code:'2002-METHOD-0002', factory:'2002', factoryName:'2002（山东丹红）',
    name:'崩解时限检查法', refStandard:'《中国药典》2025版通则0921',
    currentVersion:'V1.0', status:'disabled',
    instruments:'ZB-1E智能崩解仪\n秒表',
    reagents:'纯化水（37±1℃）\n人工胃液',
    procedures:'1. 调试：崩解仪水浴温度设为37±1℃。\n2. 测定：取供试品6片，分别置吊篮的玻璃管中，加入挡板，启动崩解仪。\n3. 观察：记录每片完全崩解通过筛网的时间。\n4. 判定：6片均应在15分钟内完全崩解。',
    formula:'',
    sopUrl:'https://sop.pharm.com/doc/SOP-QC-0010',
    createdBy:'王质检', createdDate:'2025-02-10', changedBy:'王质检', changedDate:'2025-04-15',
    versions: [
      { ver:'V1.0', createdBy:'王质检', createdDate:'2025-02-10', changedBy:'王质检', changedDate:'2025-02-10', status:'active',
        name:'崩解时限检查法', refStandard:'《中国药典》2025版通则0921',
        instruments:'ZB-1E智能崩解仪\n秒表',
        reagents:'纯化水（37±1℃）\n人工胃液',
        procedures:'1. 调试：崩解仪水浴温度设为37±1℃。\n2. 测定：取供试品6片，分别置吊篮的玻璃管中，加入挡板，启动崩解仪。\n3. 观察：记录每片完全崩解通过筛网的时间。\n4. 判定：6片均应在15分钟内完全崩解。',
        formula:'',
        sopUrl:'https://sop.pharm.com/doc/SOP-QC-0010' }
    ]
  },
  { id:'IM007', code:'2001-METHOD-0004', factory:'2001', factoryName:'2001（陕西步长）',
    name:'粒度分布测定法', refStandard:'《中国药典》2025版通则0982',
    currentVersion:'V1.0', status:'deleted',
    instruments:'Malvern Mastersizer 3000 激光粒度仪',
    reagents:'纯化水（分散介质）',
    procedures:'1. 开机预热：开启激光粒度仪，预热30分钟。\n2. 分散介质测量：测量纯化水背景。\n3. 样品测定：取供试品适量，加入分散单元，使遮光度在10%~20%范围内。\n4. 记录D10、D50、D90值。',
    formula:'',
    sopUrl:'',
    createdBy:'张工', createdDate:'2025-04-01', changedBy:'张工', changedDate:'2025-05-01',
    versions: [
      { ver:'V1.0', createdBy:'张工', createdDate:'2025-04-01', changedBy:'张工', changedDate:'2025-04-01', status:'active',
        name:'粒度分布测定法', refStandard:'《中国药典》2025版通则0982',
        instruments:'Malvern Mastersizer 3000 激光粒度仪',
        reagents:'纯化水（分散介质）',
        procedures:'1. 开机预热：开启激光粒度仪，预热30分钟。\n2. 分散介质测量：测量纯化水背景。\n3. 样品测定：取供试品适量，加入分散单元，使遮光度在10%~20%范围内。\n4. 记录D10、D50、D90值。',
        formula:'',
        sopUrl:'' }
    ]
  }
];

const InspectionMethod = {
  page: 1, pageSize: 10, filtered: [],

  // ---- 权限 ----
  isQAManager() { return window.currentUserRole === 'admin'; },

  // ---- 渲染主页面 ----
  render() {
    this.initFilters();
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <!-- 顶部标题栏 -->
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">检验方法</div><div style="font-size:13px;opacity:0.8;">定义"怎么检"，统一的检验操作标准 · 工厂级别主数据</div></div>
          ${this.isQAManager() ? `<button class="btn btn-blue" onclick="InspectionMethod.openCreate()">+ 新建检验方法</button>` : ''}
        </div>
        <!-- 筛选栏 -->
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>方法编码</label><input type="text" id="imCode" placeholder="如 HPLC-001"></div>
          <div class="filter-group"><label>方法名称</label><input type="text" id="imName" placeholder="模糊搜索"></div>
          <div class="filter-group"><label>状态</label><select id="imStatus"><option value="">全部</option><option value="active">启用</option><option value="disabled">停用</option></select></div>
          <div class="filter-group"><label>引用标准</label><input type="text" id="imStandard" placeholder="如《中国药典》"></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="InspectionMethod.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="InspectionMethod.reset()">重置</button>
          </div>
        </div>
        <!-- 数据表格 -->
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table">
            <thead><tr>
              <th style="width:50px;">序号</th>
              <th>方法编码</th>
              <th>方法名称</th>
              <th>当前版本</th>
              <th>引用标准</th>
              <th>状态</th>
              <th>创建人</th>
              <th>创建日期</th>
              <th style="width:140px;">操作</th>
            </tr></thead>
            <tbody id="imTableBody"></tbody>
          </table>
        </div>
        <!-- 分页 -->
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info"><span class="list-count" id="imCount">共 ${this.filtered.length} 条</span></div>
          <div class="pagination">
            <button class="pagination-btn" id="imPrev" disabled onclick="InspectionMethod.prevPage()">‹</button>
            <span class="pagination-info" id="imPageInfo">第 1 / ${Math.ceil(this.filtered.length/this.pageSize)||1} 页</span>
            <button class="pagination-btn" id="imNext" onclick="InspectionMethod.nextPage()">›</button>
            <select class="page-size-select" id="imPageSizeSel" onchange="InspectionMethod.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
          </div>
        </div>
      </div>`;
  },

  // ---- 初始化 ----
  initFilters() {
    this.filtered = imData.filter(m => m.status !== 'deleted');
    this.page = 1;
  },

  init() {
    this.initFilters();
    this.renderTable();
  },

  // ---- 表格 ----
  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;

    const cntEl = document.getElementById('imCount');
    const piEl = document.getElementById('imPageInfo');
    const prevEl = document.getElementById('imPrev');
    const nextEl = document.getElementById('imNext');
    const psEl = document.getElementById('imPageSizeSel');
    const tbEl = document.getElementById('imTableBody');
    if (!tbEl) return;

    if (cntEl) cntEl.textContent = `共 ${this.filtered.length} 条`;
    if (piEl) piEl.textContent = `第 ${this.page} / ${totalPages} 页`;
    if (prevEl) prevEl.disabled = this.page <= 1;
    if (nextEl) nextEl.disabled = this.page >= totalPages;
    if (psEl) psEl.value = String(this.pageSize);

    const statusBadge = (s) => {
      if (s==='active') return '<span class="badge badge-green">启用</span>';
      if (s==='disabled') return '<span class="badge badge-yellow">停用</span>';
      return '<span class="badge badge-red">已删除</span>';
    };

    const canEdit = this.isQAManager();

    tbEl.innerHTML = page.map((m, i) => {
      let actions = '';
      if (canEdit) {
        actions += `<button class="btn btn-outline btn-sm" onclick="InspectionMethod.openView('${m.id}')">查看</button>`;
        if (m.status==='active') {
          actions += `<button class="btn btn-sm" style="background:#fef3c7;color:#b45309;border:1px solid #fcd34d;" onclick="InspectionMethod.toggleDisable('${m.id}')">停用</button>`;
        } else if (m.status==='disabled') {
          actions += `<button class="btn btn-sm" style="background:#dcfce7;color:#16a34a;border:1px solid #86efac;" onclick="InspectionMethod.toggleEnable('${m.id}')">启用</button>`;
        }
      }

      return `<tr>
        <td>${start+i+1}</td>
        <td><span style="color:#2563eb;font-weight:600;">${esc(m.code)}</span></td>
        <td>${esc(m.name)}</td>
        <td><span class="badge badge-blue">${esc(m.currentVersion)}</span></td>
        <td>${esc(m.refStandard)||'-'}</td>
        <td>${statusBadge(m.status)}</td>
        <td>${esc(m.createdBy)}</td>
        <td>${m.createdDate}</td>
        <td style="display:flex;gap:4px;flex-wrap:wrap;">${actions||'-'}</td>
      </tr>`;
    }).join('');
  },

  // ---- 筛选/分页 ----
  search() {
    const code = document.getElementById('imCode').value.trim().toLowerCase();
    const name = document.getElementById('imName').value.trim().toLowerCase();
    const status = document.getElementById('imStatus').value;
    const standard = document.getElementById('imStandard').value.trim().toLowerCase();
    this.filtered = imData.filter(m => {
      if (m.status==='deleted') return false;
      if (code && !m.code.toLowerCase().includes(code)) return false;
      if (name && !m.name.toLowerCase().includes(name)) return false;
      if (status && m.status!==status) return false;
      if (standard && (!m.refStandard||!m.refStandard.toLowerCase().includes(standard))) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
  },

  reset() {
    const els = ['imCode','imName','imStatus','imStandard'];
    els.forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
    this.initFilters();
    this.renderTable();
  },

  prevPage() { if(this.page>1){this.page--;this.renderTable();} },
  nextPage() { const tp = Math.ceil(this.filtered.length/this.pageSize); if(this.page<tp){this.page++;this.renderTable();} },
  changePageSize() { const s = document.getElementById('imPageSizeSel'); if(s){this.pageSize=parseInt(s.value);this.page=1;this.renderTable();} },

  // ========== 新建弹窗 ==========
  openCreate() {
    const html = this.buildForm('create', {});
    showModal('新建检验方法', html, [
      { text:'取消', cls:'btn-secondary', action: closeModal },
      { text:'保存', cls:'btn-primary', action: ()=>{ InspectionMethod.save(); } }
    ], 'modal-xl');
    setTimeout(() => {
      const facEl = document.getElementById('imFormFactory');
      if (facEl && imFactoryOptions.length) facEl.value = imFactoryOptions[0].value;
      this.onFactoryChange();
    }, 50);
  },

  // ========== 编辑弹窗 ==========
  openEdit(id) {
    const m = imData.find(d => d.id===id);
    if (!m) { toast('数据不存在'); return; }
    const html = this.buildForm('edit', m);
    showModal('编辑检验方法', html, [
      { text:'取消', cls:'btn-secondary', action: closeModal },
      { text:'保存修改', cls:'btn-primary', action: ()=>{ InspectionMethod.save(); } }
    ], 'modal-xl');
  },

  // ========== 新建版本弹窗 ==========
  openNewVersion(id) {
    const m = imData.find(d => d.id===id);
    if (!m) { toast('数据不存在'); return; }
    const html = this.buildForm('newVersion', m);
    const newVer = imGenerateVersion(m.currentVersion);
    showModal(`新建版本 · ${esc(m.code)} → ${newVer}`, html, [
      { text:'取消', cls:'btn-secondary', action: closeModal },
      { text:'保存新版本', cls:'btn-primary', action: ()=>{ InspectionMethod.save(); } }
    ], 'modal-xl');
    // 填充版本号只读展示
    setTimeout(() => {
      const verEl = document.getElementById('imFormNewVersion');
      if (verEl) verEl.value = newVer;
    }, 50);
  },

  // ========== 构建表单 HTML ==========
  buildForm(mode, m) {
    const isEdit = mode === 'edit';
    const isNewVer = mode === 'newVersion';
    const isReadonly = false; // 新建/编辑都可以编辑全部字段

    const facSel = imFactoryOptions.map(o =>
      `<option value="${o.value}" ${(isEdit||isNewVer) && o.value===m.factory?'selected':''}>${o.label}</option>`
    ).join('');

    const statusActive = (!isEdit && !isNewVer) || (m.status==='active');
    const statusDisabled = (isEdit||isNewVer) && m.status==='disabled';

    const codeVal = (isEdit||isNewVer) ? esc(m.code) : '保存后自动生成';

    return `<form id="imForm" onsubmit="return false;" style="display:flex;flex-direction:column;gap:16px;max-height:70vh;overflow-y:auto;padding-right:4px;">

      <input type="hidden" id="imFormId" value="${(isEdit||isNewVer)?m.id:''}" />
      <input type="hidden" id="imFormMode" value="${mode}" />

      <!-- ===== 基本信息 ===== -->
      <fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">基本信息</legend>
        ${isNewVer ? `<div class="form-group" style="margin-bottom:12px;"><label>新版本号</label><input type="text" id="imFormNewVersion" readonly style="background:#f1f5f9;color:#94a3b8;max-width:200px;" /></div>` : ''}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          <div class="form-group">
            <label>工厂<span class="required">*</span></label>
            <select id="imFormFactory" required ${isNewVer?'disabled':''} onchange="InspectionMethod.onFactoryChange()"><option value="">请选择</option>${facSel}</select>
          </div>
          <div class="form-group">
            <label>方法编码<span class="required">*</span></label>
            <input type="text" id="imFormCode" readonly style="background:#f1f5f9;color:#94a3b8;" value="${codeVal}" />
          </div>
          <div class="form-group">
            <label>方法名称<span class="required">*</span></label>
            <input type="text" id="imFormName" placeholder="如：高效液相色谱法测定含量" required value="${(isEdit||isNewVer)?esc(m.name):''}" />
          </div>
          <div class="form-group">
            <label>引用标准</label>
            <input type="text" id="imFormStandard" placeholder="如《中国药典》2025版通则0512" value="${(isEdit||isNewVer)?esc(m.refStandard||''):''}" />
          </div>
          <div class="form-group">
            <label>状态<span class="required">*</span></label>
            <div style="display:flex;gap:12px;padding-top:6px;">
              <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-weight:400;font-size:13px;">
                <input type="radio" name="imFormStatus" value="active" ${statusActive?'checked':''}> 启用
              </label>
              <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-weight:400;font-size:13px;">
                <input type="radio" name="imFormStatus" value="disabled" ${statusDisabled?'checked':''}> 停用
              </label>
            </div>
          </div>
        </div>
      </fieldset>

      <!-- ===== 操作步骤 ===== -->
      <fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">操作步骤</legend>
        <div class="form-group">
          <label>操作步骤</label>
          <textarea id="imFormProcedures" rows="8" placeholder="详细描述实验操作流程，支持编号列表、加粗等（暂用文本格式）" style="width:100%;font-family:monospace;font-size:13px;">${(isEdit||isNewVer)?esc(m.procedures||''):''}</textarea>
        </div>
      </fieldset>

      <!-- ===== 资源需求 ===== -->
      <fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">资源需求</legend>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          <div class="form-group">
            <label>仪器设备</label>
            <textarea id="imFormInstruments" rows="3" placeholder="需要的仪器设备清单\neg: Agilent 1260 HPLC 色谱仪" style="width:100%;font-size:13px;">${(isEdit||isNewVer)?esc(m.instruments||''):''}</textarea>
          </div>
          <div class="form-group">
            <label>试剂耗材</label>
            <textarea id="imFormReagents" rows="3" placeholder="需要的试剂和耗材清单\neg: 甲醇（色谱纯）" style="width:100%;font-size:13px;">${(isEdit||isNewVer)?esc(m.reagents||''):''}</textarea>
          </div>
        </div>
      </fieldset>

      <!-- ===== 计算与参考 ===== -->
      <fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">计算与参考</legend>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          <div class="form-group">
            <label>计算公式</label>
            <input type="text" id="imFormFormula" placeholder="如 含量% = (A样/A对)×100%" value="${(isEdit||isNewVer)?esc(m.formula||''):''}" />
          </div>
          <div class="form-group">
            <label>关联 SOP</label>
            <input type="text" id="imFormSopUrl" placeholder="URL链接或文档路径" value="${(isEdit||isNewVer)?esc(m.sopUrl||''):''}" />
          </div>
        </div>
      </fieldset>

    </form>`;
  },

  // ========== 联动 ==========
  onFactoryChange() {
    const facEl = document.getElementById('imFormFactory');
    const codeEl = document.getElementById('imFormCode');
    const mode = document.getElementById('imFormMode')?.value;
    if (!facEl || !codeEl || mode==='edit' || mode==='newVersion') return;
    const fac = facEl.value;
    if (fac) {
      const seq = imData.filter(m => m.factory===fac).length + 1;
      codeEl.value = fac + '-METHOD-' + String(seq).padStart(4,'0');
    }
  },

  // ========== 保存 ==========
  save() {
    const mode = document.getElementById('imFormMode').value;
    const isEdit = mode === 'edit';
    const isNewVer = mode === 'newVersion';

    const factory = document.getElementById('imFormFactory').value;
    const name = document.getElementById('imFormName').value.trim();
    const refStandard = document.getElementById('imFormStandard').value.trim();
    const procedures = document.getElementById('imFormProcedures').value.trim();
    const instruments = document.getElementById('imFormInstruments').value.trim();
    const reagents = document.getElementById('imFormReagents').value.trim();
    const formula = document.getElementById('imFormFormula').value.trim();
    const sopUrl = document.getElementById('imFormSopUrl').value.trim();

    const statusRadios = document.getElementsByName('imFormStatus');
    let statusVal = 'active';
    for (const r of statusRadios) { if (r.checked) { statusVal = r.value; break; } }

    // 验证必填
    if (!factory) { toast('请选择工厂'); return; }
    if (!name) { toast('请填写方法名称'); return; }

    const now = new Date().toISOString().slice(0, 10);
    const user = window.currentUserId || '系统';

    if (!isEdit && !isNewVer) {
      // ===== 新建 =====
      const seq = imData.filter(m => m.factory===factory).length + 1;
      const code = factory + '-METHOD-' + String(seq).padStart(4,'0');
      const facObj = imFactoryOptions.find(f => f.value===factory);
      const ver = 'V1.0';

      // 创建版本快照
      const versionSnapshot = {
        ver, createdBy: user, createdDate: now,
        changedBy: user, changedDate: now, status: 'active',
        name, refStandard, instruments, reagents, procedures, formula, sopUrl
      };

      const newMethod = {
        id: 'IM' + String(imData.length+1).padStart(3,'0'),
        code, factory, factoryName: facObj ? facObj.label : factory,
        name, refStandard, currentVersion: ver,
        instruments, reagents, procedures, formula, sopUrl,
        status: 'active',
        createdBy: user, createdDate: now, changedBy: '', changedDate: '',
        versions: [versionSnapshot]
      };
      imData.push(newMethod);
      toast('检验方法创建成功');
    } else if (isNewVer) {
      // ===== 新建版本 =====
      const id = document.getElementById('imFormId').value;
      const m = imData.find(d => d.id===id);
      if (!m) { toast('数据不存在'); return; }

      // 旧版本改为历史版本
      if (m.versions.length) {
        m.versions.forEach(v => {
          if (v.status==='active') v.status = 'history';
        });
      }

      const newVer = imGenerateVersion(m.currentVersion);
      const versionSnapshot = {
        ver: newVer, createdBy: user, createdDate: now,
        changedBy: user, changedDate: now, status: 'active',
        name, refStandard, instruments, reagents, procedures, formula, sopUrl
      };

      m.versions.push(versionSnapshot);
      m.currentVersion = newVer;
      m.name = name;
      m.refStandard = refStandard;
      m.instruments = instruments;
      m.reagents = reagents;
      m.procedures = procedures;
      m.formula = formula;
      m.sopUrl = sopUrl;
      m.changedBy = user;
      m.changedDate = now;
      // 新建版本后自动启用
      m.status = 'active';
      toast(`新版本 ${newVer} 创建成功，已自动启用`);
    } else {
      // ===== 编辑 =====
      const id = document.getElementById('imFormId').value;
      const m = imData.find(d => d.id===id);
      if (!m) { toast('数据不存在'); return; }

      m.name = name;
      m.refStandard = refStandard;
      m.instruments = instruments;
      m.reagents = reagents;
      m.procedures = procedures;
      m.formula = formula;
      m.sopUrl = sopUrl;
      m.status = statusVal;
      m.changedBy = user;
      m.changedDate = now;

      // 同步当前版本快照
      const activeVer = m.versions.find(v => v.status==='active');
      if (activeVer) {
        activeVer.name = name;
        activeVer.refStandard = refStandard;
        activeVer.instruments = instruments;
        activeVer.reagents = reagents;
        activeVer.procedures = procedures;
        activeVer.formula = formula;
        activeVer.sopUrl = sopUrl;
        activeVer.changedBy = user;
        activeVer.changedDate = now;
      }
      toast('检验方法修改成功');
    }
    closeModal();
    this.init();
  },

  // ========== 查看详情 ==========
  openView(id) {
    const m = imData.find(d => d.id===id);
    if (!m) { toast('数据不存在'); return; }

    const roField = (label, val) => `<div class="form-group">
      <label>${label}</label>
      <div style="padding-top:6px;font-size:14px;font-weight:500;min-height:22px;white-space:pre-wrap;">${val||'-'}</div>
    </div>`;

    const statusBadge = m.status==='active'
      ? '<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;background:#dcfce7;color:#16a34a;">启用</span>'
      : m.status==='disabled'
        ? '<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;background:#fef3c7;color:#b45309;">停用</span>'
        : '<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;background:#fee2e2;color:#ef4444;">已删除标记</span>';

    const isQA = this.isQAManager();
    const canManage = isQA && m.status!=='deleted';

    // 版本历史
    let verHistory = '';
    if (m.versions && m.versions.length) {
      const rows = m.versions.map(v => `<tr>
        <td>${esc(v.ver)}</td>
        <td><span class="badge ${v.status==='active'?'badge-green':'badge-gray'}">${v.status==='active'?'当前':'历史'}</span></td>
        <td>${esc(v.createdBy)}</td>
        <td>${v.createdDate}</td>
        <td>${esc(v.changedBy||'-')}</td>
        <td>${v.changedDate||'-'}</td>
      </tr>`).join('');
      verHistory = `
        <fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
          <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">版本历史</legend>
          <table class="data-table"><thead><tr><th>版本</th><th>状态</th><th>创建人</th><th>创建日期</th><th>修改人</th><th>修改日期</th></tr></thead><tbody>${rows}</tbody></table>
        </fieldset>`;
    }

    const scrollBody = `
      <!-- 基本信息 -->
      <fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">基本信息</legend>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          ${roField('工厂', m.factoryName)}
          ${roField('方法编码', m.code)}
          ${roField('方法名称', m.name)}
          ${roField('当前版本', m.currentVersion)}
          ${roField('引用标准', m.refStandard)}
          <div class="form-group"><label>状态</label><div style="padding-top:6px;">${statusBadge}</div></div>
        </div>
      </fieldset>

      <!-- 操作步骤 -->
      <fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">操作步骤</legend>
        ${roField('操作步骤', m.procedures)}
      </fieldset>

      <!-- 资源需求 -->
      <fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">资源需求</legend>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          ${roField('仪器设备', m.instruments)}
          ${roField('试剂耗材', m.reagents)}
        </div>
      </fieldset>

      <!-- 计算与参考 -->
      <fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">计算与参考</legend>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          ${roField('计算公式', m.formula)}
          ${roField('关联 SOP', m.sopUrl ? `<a href="${esc(m.sopUrl)}" target="_blank" style="color:var(--primary);">${esc(m.sopUrl)}</a>` : '')}
        </div>
      </fieldset>

      ${verHistory}

      <!-- 其他信息 -->
      <fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">其他信息</legend>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          ${roField('创建人', m.createdBy)}${roField('创建日期', m.createdDate)}
          ${roField('最后修改人', m.changedBy||'-')}${roField('最后修改日期', m.changedDate||'-')}
        </div>
      </fieldset>`;

    const html = `<div style="display:flex;flex-direction:column;max-height:70vh;">
      <div style="flex:1;overflow-y:auto;padding-right:4px;">${scrollBody}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;margin-top:12px;border-top:1px solid var(--border);flex-shrink:0;">
        <span></span>
        <div style="display:flex;gap:8px;">
          ${canManage ? `<button class="btn btn-blue" onclick="InspectionMethod.openEdit('${m.id}')">编辑</button>` : ''}
          ${canManage ? `<button class="btn btn-sm" style="background:#dbeafe;color:#1d4ed8;border:1px solid #93c5fd;" onclick="InspectionMethod.openNewVersion('${m.id}')">新建版本</button>` : ''}
          ${canManage && m.status==='active' ? `<button class="btn btn-sm" style="background:#fef3c7;color:#b45309;border:1px solid #fcd34d;" onclick="InspectionMethod.toggleDisable('${m.id}')">停用</button>` : ''}
          ${canManage && m.status==='disabled' ? `<button class="btn btn-sm" style="background:#dcfce7;color:#16a34a;border:1px solid #86efac;" onclick="InspectionMethod.toggleEnable('${m.id}')">启用</button>` : ''}
          <button class="btn btn-secondary" onclick="closeModal()">关闭</button>
        </div>
      </div>
    </div>`;

    showModal(`检验方法详情 · ${esc(m.code)}`, html, [], 'modal-xl');
  },

  // ========== 停用 ==========
  toggleDisable(id) {
    const m = imData.find(d => d.id===id);
    if (!m) return;
    closeModal();
    showModal('确认停用',
      `<p>确定要停用检验方法 <strong>${esc(m.code)} - ${esc(m.name)}</strong> 吗？</p>
       <p style="color:var(--text-secondary);font-size:13px;">停用后，新建检验计划时不可选择此方法，但已引用的历史数据不受影响。</p>`,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal },
        { text:'确认停用', cls:'btn-warning', action: ()=>{
          m.status = 'disabled';
          m.changedBy = window.currentUserId || '系统';
          m.changedDate = new Date().toISOString().slice(0, 10);
          closeModal();
          this.init();
          toast(`方法 ${m.code} 已停用`);
        }}
      ]
    );
  },

  // ========== 启用 ==========
  toggleEnable(id) {
    const m = imData.find(d => d.id===id);
    if (!m) return;
    closeModal();
    m.status = 'active';
    m.changedBy = window.currentUserId || '系统';
    m.changedDate = new Date().toISOString().slice(0, 10);
    this.init();
    toast(`方法 ${m.code} 已重新启用`);
  },

  // ========== 删除 ==========
  confirmDelete(id) {
    const m = imData.find(d => d.id===id);
    if (!m) return;
    closeModal();
    showModal('确认删除',
      `<p>确定要删除检验方法 <strong>${esc(m.code)} - ${esc(m.name)}</strong> 吗？</p>
       <p style="color:#ef4444;font-size:13px;">⚠ 删除后状态将变为"已删除标记"，该操作不可恢复，仅保留历史记录以供审计。</p>`,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal },
        { text:'确认删除', cls:'btn-primary', style:'background:#ef4444;', action: ()=>{
          m.status = 'deleted';
          m.changedBy = window.currentUserId || '系统';
          m.changedDate = new Date().toISOString().slice(0, 10);
          closeModal();
          this.init();
          toast(`方法 ${m.code} 已标记删除（不可恢复）`);
        }}
      ]
    );
  }
};
