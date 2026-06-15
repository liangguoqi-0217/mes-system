// ===== 主检验特性 (MIC) Page =====
// 对应 SAP QS21，工厂级别质量主数据 | PRD V2.0

// ---- 常量选项 ----
const micFactoryOptions = [
  { value:'2001', label:'2001（山东步长）' },
  { value:'2002', label:'2002（天津基地）' },
  { value:'2003', label:'2003（菏泽分厂）' }
];
const micUnitOptions = ['%','pH','℃','g','mg','mL','L','kg','mm','cm','μm','mPa·s','cfu/g','个/mL','N','min'];
const micCodeGroupOptions = [
  'CG001-外观缺陷','CG002-颜色偏差','CG003-尺寸异常',
  'CG004-气味异常','CG005-硬度异常','CG006-崩解异常'
];
const micDefaultCodeOptions = { '':['（无默认）'],
  'CG001-外观缺陷':['合格','不合格','有裂纹','有斑点','有变色','有异物'],
  'CG002-颜色偏差':['合格','不合格','偏黄','偏白','偏深'],
  'CG003-尺寸异常':['合格','不合格','偏大','偏小'],
  'CG004-气味异常':['合格','不合格','有异臭','气味偏淡'],
  'CG005-硬度异常':['合格','不合格','过硬','过软'],
  'CG006-崩解异常':['合格','不合格','未崩解','部分崩解']
};
const micDefaultMethodOptions = [
  'MET-01 目视检查法','MET-02 pH计测定法','MET-03 烘箱干燥法',
  'MET-04 HPLC含量测定','MET-05 滴定法','MET-06 熔点测定法'
];

// ---- Mock 数据 ----
const micData = [
  { id:'MIC001', code:'2001-MIC-001', factory:'2001', factoryName:'2001（山东步长）',
    micType:'quantitative', micTypeName:'定量', mode:'copy', modeName:'完全复制',
    shortText:'pH值', longText:'采用pH计在25±1℃下测定，取三次测定平均值',
    unit:'pH', decimal:2, targetValue:'', upperSpec:'', lowerSpec:'', upperReal:'', lowerReal:'', unitText:'',
    codeGroup:'', defaultCode:'', samplingProc:'必须', defaultMethod:'MET-02 pH计测定法',
    status:'active', createdBy:'张工', createdDate:'2025-01-15', changedBy:'', changedDate:'' },
  { id:'MIC002', code:'2001-MIC-002', factory:'2001', factoryName:'2001（山东步长）',
    micType:'quantitative', micTypeName:'定量', mode:'copy', modeName:'完全复制',
    shortText:'水分含量', longText:'卡尔费休法测定水分，限值≤3.0%',
    unit:'%', decimal:2, targetValue:'0', upperSpec:'3.0', lowerSpec:'0', upperReal:'5.0', lowerReal:'0', unitText:'% (w/w)',
    codeGroup:'', defaultCode:'', samplingProc:'必须', defaultMethod:'MET-03 烘箱干燥法',
    status:'active', createdBy:'张工', createdDate:'2025-01-15', changedBy:'', changedDate:'' },
  { id:'MIC003', code:'2001-MIC-003', factory:'2001', factoryName:'2001（山东步长）',
    micType:'qualitative', micTypeName:'定性', mode:'reference', modeName:'引用模式',
    shortText:'外观', longText:'目视检查片剂外观，不得有裂纹、斑点、变色',
    unit:'', decimal:0, targetValue:'', upperSpec:'', lowerSpec:'', upperReal:'', lowerReal:'', unitText:'',
    codeGroup:'CG001-外观缺陷', defaultCode:'合格', samplingProc:'必须', defaultMethod:'MET-01 目视检查法',
    status:'active', createdBy:'张工', createdDate:'2025-01-15', changedBy:'', changedDate:'' },
  { id:'MIC004', code:'2001-MIC-004', factory:'2001', factoryName:'2001（山东步长）',
    micType:'quantitative', micTypeName:'定量', mode:'copy', modeName:'完全复制',
    shortText:'含量（主成分）', longText:'HPLC法测定主成分含量，应为标示量的90.0%~110.0%',
    unit:'%', decimal:1, targetValue:'100', upperSpec:'110.0', lowerSpec:'90.0', upperReal:'120.0', lowerReal:'80.0', unitText:'% (标示量)',
    codeGroup:'', defaultCode:'', samplingProc:'必须', defaultMethod:'MET-04 HPLC含量测定',
    status:'active', createdBy:'张工', createdDate:'2025-01-20', changedBy:'', changedDate:'' },
  { id:'MIC005', code:'2001-MIC-005', factory:'2001', factoryName:'2001（山东步长）',
    micType:'qualitative', micTypeName:'定性', mode:'copy', modeName:'完全复制',
    shortText:'颜色', longText:'与标准比色液目视比对',
    unit:'', decimal:0, targetValue:'', upperSpec:'', lowerSpec:'', upperReal:'', lowerReal:'', unitText:'',
    codeGroup:'CG002-颜色偏差', defaultCode:'合格', samplingProc:'必须', defaultMethod:'MET-01 目视检查法',
    status:'disabled', createdBy:'张工', createdDate:'2025-01-18', changedBy:'李经理', changedDate:'2025-03-10' },
  { id:'MIC006', code:'2002-MIC-001', factory:'2002', factoryName:'2002（天津基地）',
    micType:'quantitative', micTypeName:'定量', mode:'copy', modeName:'完全复制',
    shortText:'崩解时限', longText:'按药典规定方法测定，应≤15分钟',
    unit:'min', decimal:0, targetValue:'', upperSpec:'15', lowerSpec:'0', upperReal:'30', lowerReal:'0', unitText:'',
    codeGroup:'', defaultCode:'', samplingProc:'必须', defaultMethod:'',
    status:'active', createdBy:'王质检', createdDate:'2025-02-01', changedBy:'', changedDate:'' },
  { id:'MIC007', code:'2002-MIC-002', factory:'2002', factoryName:'2002（天津基地）',
    micType:'quantitative', micTypeName:'定量', mode:'reference', modeName:'引用模式',
    shortText:'硬度', longText:'YPD-300硬度仪测定，范围30~80N',
    unit:'N', decimal:1, targetValue:'55', upperSpec:'80', lowerSpec:'30', upperReal:'100', lowerReal:'10', unitText:'牛顿',
    codeGroup:'', defaultCode:'', samplingProc:'必须', defaultMethod:'',
    status:'active', createdBy:'王质检', createdDate:'2025-02-01', changedBy:'', changedDate:'' },
  { id:'MIC008', code:'2003-MIC-001', factory:'2003', factoryName:'2003（菏泽分厂）',
    micType:'quantitative', micTypeName:'定量', mode:'copy', modeName:'完全复制',
    shortText:'微生物限度', longText:'TAMC ≤1000cfu/g，TYMC ≤100cfu/g',
    unit:'cfu/g', decimal:0, targetValue:'', upperSpec:'1000', lowerSpec:'0', upperReal:'', lowerReal:'', unitText:'',
    codeGroup:'', defaultCode:'', samplingProc:'必须', defaultMethod:'',
    status:'active', createdBy:'赵经理', createdDate:'2025-03-05', changedBy:'', changedDate:'' },
  { id:'MIC009', code:'2003-MIC-002', factory:'2003', factoryName:'2003（菏泽分厂）',
    micType:'qualitative', micTypeName:'定性', mode:'copy', modeName:'完全复制',
    shortText:'气味', longText:'应具有本品特有气味，无异味',
    unit:'', decimal:0, targetValue:'', upperSpec:'', lowerSpec:'', upperReal:'', lowerReal:'', unitText:'',
    codeGroup:'CG004-气味异常', defaultCode:'合格', samplingProc:'可选', defaultMethod:'MET-01 目视检查法',
    status:'deleted', createdBy:'赵经理', createdDate:'2025-03-05', changedBy:'赵经理', changedDate:'2025-06-01' },
  { id:'MIC010', code:'2001-MIC-006', factory:'2001', factoryName:'2001（山东步长）',
    micType:'quantitative', micTypeName:'定量', mode:'copy', modeName:'完全复制',
    shortText:'粒度分布', longText:'激光粒度仪测定，D90≤100μm',
    unit:'μm', decimal:1, targetValue:'', upperSpec:'100', lowerSpec:'', upperReal:'200', lowerReal:'', unitText:'',
    codeGroup:'', defaultCode:'', samplingProc:'可选', defaultMethod:'',
    status:'active', createdBy:'张工', createdDate:'2025-04-01', changedBy:'', changedDate:'' },
];

const InspectionChar = {
  page: 1, pageSize: 10, filtered: [],

  // ---- 权限 ----
  isQAManager() { return window.currentUserRole === 'admin'; },

  // ---- 渲染主页面（UI 对齐设备主数据风格）----
  render() {
    this.initFilters();
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <!-- 顶部标题栏：与设备主数据一致 -->
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">主检验特性（MIC）</div><div style="font-size:13px;opacity:0.8;">定义"检什么"，质量检验的最小单元 · 工厂级别主数据</div></div>
          ${this.isQAManager() ? `<button class="btn btn-blue" onclick="InspectionChar.openCreate()">+ 新建主检验特性</button>` : ''}
        </div>
        <!-- 筛选栏 -->
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>所属工厂</label><select id="micFactory"><option value="">全部</option>${micFactoryOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>特性类型</label><select id="micType"><option value="">全部</option><option value="quantitative">定量</option><option value="qualitative">定性</option></select></div>
          <div class="filter-group"><label>状态</label><select id="micStatus"><option value="">全部</option><option value="active">启用</option><option value="disabled">停用</option><option value="deleted">已删除标记</option></select></div>
          <div class="filter-group"><label>搜索</label><input type="text" id="micSearch" placeholder="特性编码 / 短文本"></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="InspectionChar.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="InspectionChar.reset()">重置</button>
          </div>
        </div>
        <!-- 数据表格 -->
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table">
            <thead><tr>
              <th style="width:50px;">序号</th>
              <th>主检验特性编码</th>
              <th>短文本</th>
              <th>特性类型</th>
              <th>所属工厂</th>
              <th>状态</th>
              <th>创建人</th>
              <th>创建日期</th>
              <th style="width:80px;">操作</th>
            </tr></thead>
            <tbody id="micTableBody"></tbody>
          </table>
        </div>
        <!-- 分页 -->
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info"><span class="list-count" id="micCount">共 ${this.filtered.length} 条</span></div>
          <div class="pagination">
            <button class="pagination-btn" id="micPrev" disabled onclick="InspectionChar.prevPage()">‹</button>
            <span class="pagination-info" id="micPageInfo">第 1 / ${Math.ceil(this.filtered.length/this.pageSize)||1} 页</span>
            <button class="pagination-btn" id="micNext" onclick="InspectionChar.nextPage()">›</button>
            <select class="page-size-select" id="micPageSizeSel" onchange="InspectionChar.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
          </div>
        </div>
      </div>`;
  },

  // ---- 初始化 ----
  initFilters() {
    if (!this.isQAManager()) {
      this.filtered = micData.filter(m => m.factory === '2001');
    } else {
      this.filtered = [...micData];
    }
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

    const cntEl = document.getElementById('micCount');
    const piEl = document.getElementById('micPageInfo');
    const prevEl = document.getElementById('micPrev');
    const nextEl = document.getElementById('micNext');
    const psEl = document.getElementById('micPageSizeSel');
    const tbEl = document.getElementById('micTableBody');
    if (!tbEl) return;

    if (cntEl) cntEl.textContent = `共 ${this.filtered.length} 条`;
    if (piEl) piEl.textContent = `第 ${this.page} / ${totalPages} 页`;
    if (prevEl) prevEl.disabled = this.page <= 1;
    if (nextEl) nextEl.disabled = this.page >= totalPages;
    if (psEl) psEl.value = String(this.pageSize);

    const canEdit = this.isQAManager();

    const statusBadge = (s) => {
      if (s==='active') return '<span class="badge badge-green">启用</span>';
      if (s==='disabled') return '<span class="badge badge-yellow">停用</span>';
      return '<span class="badge badge-red">已删除</span>';
    };

    tbEl.innerHTML = page.map((m, i) => {
      const typeBadge = m.micType==='quantitative'
        ? '<span class="badge badge-blue">定量</span>'
        : '<span class="badge badge-gray">定性</span>';

      const viewBtn = canEdit && m.status!=='deleted'
        ? `<button class="btn btn-blue btn-sm" onclick="InspectionChar.openView('${m.id}')">查看</button>`
        : (m.status==='deleted' ? '-' : '');

      return `<tr>
        <td>${start+i+1}</td>
        <td><span style="color:#2563eb;font-weight:600;">${esc(m.code)}</span></td>
        <td>${esc(m.shortText)}</td>
        <td>${typeBadge}</td>
        <td>${esc(m.factoryName)}</td>
        <td>${statusBadge(m.status)}</td>
        <td>${esc(m.createdBy)}</td>
        <td>${m.createdDate}</td>
        <td>${viewBtn||'-'}</td>
      </tr>`;
    }).join('');
  },

  // ---- 筛选/分页 ----
  search() {
    const factory = document.getElementById('micFactory').value;
    const type = document.getElementById('micType').value;
    const status = document.getElementById('micStatus').value;
    const kw = document.getElementById('micSearch').value.trim().toLowerCase();
    this.filtered = micData.filter(m => {
      if (factory && m.factory!==factory) return false;
      if (type && m.micType!==type) return false;
      if (status && m.status!==status) return false;
      if (kw && !m.code.toLowerCase().includes(kw) && !m.shortText.toLowerCase().includes(kw)) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
  },

  reset() {
    const els = ['micFactory','micType','micStatus','micSearch'];
    els.forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
    this.initFilters();
    this.renderTable();
  },

  prevPage() { if(this.page>1){this.page--;this.renderTable();} },
  nextPage() { const tp = Math.ceil(this.filtered.length/this.pageSize); if(this.page<tp){this.page++;this.renderTable();} },
  changePageSize() { const s = document.getElementById('micPageSizeSel'); if(s){this.pageSize=parseInt(s.value);this.page=1;this.renderTable();} },

  // ============= 表单生成 =============

  // ---- 新建弹窗 ----
  openCreate() {
    const html = this.buildForm('create', {});
    showModal('新建主检验特性', html, [
      { text:'取消', cls:'btn-secondary', action: closeModal },
      { text:'保存', cls:'btn-primary', action: ()=>{ InspectionChar.save(); } }
    ], 'modal-xl');
    setTimeout(() => {
      const facEl = document.getElementById('micFormFactory');
      if (facEl && micFactoryOptions.length) facEl.value = micFactoryOptions[0].value;
      this.onFactoryChange();
    }, 50);
  },

  // ---- 编辑弹窗 ----
  openEdit(id) {
    const m = micData.find(d => d.id===id);
    if (!m) { toast('数据不存在'); return; }
    const html = this.buildForm('edit', m);
    showModal('编辑主检验特性', html, [
      { text:'取消', cls:'btn-secondary', action: closeModal },
      { text:'保存修改', cls:'btn-primary', action: ()=>{ InspectionChar.save(); } }
    ], 'modal-xl');
  },

  // ---- 构建表单 HTML ----
  buildForm(mode, m) {
    const isEdit = mode === 'edit';
    const facSel = micFactoryOptions.map(o =>
      `<option value="${o.value}" ${isEdit && o.value===m.factory?'selected':''}>${o.label}</option>`
    ).join('');

    const quantStyle = (m.micType==='qualitative' || (!isEdit)) ? 'display:none;' : '';
    const qualStyle = (m.micType!=='qualitative') ? 'display:none;' : '';

    // 定量字段值
    const q = isEdit ? m : { unit:'', decimal:2, targetValue:'', upperSpec:'', lowerSpec:'', upperReal:'', lowerReal:'', unitText:'' };

    // 定性代码组选项
    const cgSel = micCodeGroupOptions.map(cg =>
      `<option value="${cg}" ${isEdit && m.codeGroup===cg?'selected':''}>${cg}</option>`
    ).join('');

    // 默认代码（根据当前代码组动态变化，编辑时用 selectedCodeGroup）
    const selCodeGrp = isEdit ? m.codeGroup : '';
    const dcOptions = this.getDefaultCodeOptions(selCodeGrp, isEdit ? m.defaultCode : '');

    return `<form id="micForm" onsubmit="return false;" style="display:flex;flex-direction:column;gap:16px;max-height:70vh;overflow-y:auto;padding-right:4px;">

      <!-- ===== 基本数据 ===== -->
      <fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">基本数据</legend>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          <div class="form-group">
            <label>所属工厂<span class="required">*</span></label>
            <select id="micFormFactory" required onchange="InspectionChar.onFactoryChange()"><option value="">请选择</option>${facSel}</select>
          </div>
          <div class="form-group">
            <label>主检验特性编码<span class="required">*</span></label>
            <input type="text" id="micFormCode" readonly style="background:#f1f5f9;color:#94a3b8;" value="${isEdit?esc(m.code):'保存后自动生成'}" />
          </div>
          <div class="form-group">
            <label>特性类型<span class="required">*</span></label>
            <div style="display:flex;gap:16px;padding-top:6px;">
              <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-weight:400;">
                <input type="radio" name="micFormType" value="quantitative" ${(!isEdit||m.micType==='quantitative')?'checked':''} onchange="InspectionChar.onTypeChange()"> 定量
              </label>
              <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-weight:400;">
                <input type="radio" name="micFormType" value="qualitative" ${(isEdit&&m.micType==='qualitative')?'checked':''} onchange="InspectionChar.onTypeChange()"> 定性
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>短文本<span class="required">*</span></label>
            <input type="text" id="micFormShortText" placeholder="如：pH值、外观" required value="${isEdit?esc(m.shortText):''}" />
          </div>
          <div class="form-group">
            <label>采样过程<span class="required">*</span></label>
            <select id="micFormSampling">
              <option value="必须" ${(!isEdit||m.samplingProc==='必须')?'selected':''}>必须</option>
              <option value="不必" ${(isEdit&&m.samplingProc==='不必')?'selected':''}>不必</option>
              <option value="可选" ${(isEdit&&m.samplingProc==='可选')?'selected':''}>可选</option>
            </select>
          </div>
          <div class="form-group">
            <label>状态<span class="required">*</span></label>
            <div style="display:flex;gap:12px;padding-top:6px;">
              <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-weight:400;font-size:13px;">
                <input type="radio" name="micFormStatus" value="active" ${(!isEdit||m.status==='active')?'checked':''}> 启用
              </label>
              <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-weight:400;font-size:13px;">
                <input type="radio" name="micFormStatus" value="disabled" ${(isEdit&&m.status==='disabled')?'checked':''}> 停用
              </label>
            </div>
          </div>
        </div>
        <div class="form-group" style="margin-top:8px;">
          <label>长文本</label>
          <textarea id="micFormLongText" rows="2" placeholder="详细说明、适用范围等" style="width:100%;">${isEdit?esc(m.longText):''}</textarea>
        </div>
      </fieldset>

      <!-- ===== 定量特性（联动展开） ===== -->
      <fieldset id="micQuantSection" style="border:1px solid var(--border);border-radius:8px;padding:16px;${quantStyle}">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">定量特性</legend>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          <div class="form-group">
            <label>计量单位<span class="required">*</span></label>
            <select id="micFormUnit"><option value="">请选择单位</option>${micUnitOptions.map(u=>`<option value="${u}" ${q.unit===u?'selected':''}>${u}</option>`).join('')}</select>
          </div>
          <div class="form-group">
            <label>小数位数<span class="required">*</span></label>
            <input type="number" id="micFormDecimal" value="${q.decimal}" min="0" max="6" />
          </div>
          <div class="form-group">
            <label>目标值</label>
            <input type="text" id="micFormTargetValue" value="${esc(q.targetValue)}" placeholder="期望标准值" />
          </div>
          <div class="form-group">
            <label>单位文本</label>
            <input type="text" id="micFormUnitText" value="${esc(q.unitText)}" placeholder="如：% (w/w)" />
          </div>
        </div>
        <div style="font-size:12px;color:var(--text-secondary);margin:8px 0 4px;font-weight:600;">规格限（合格判定范围）</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          <div class="form-group"><label>上规格限</label><input type="text" id="micFormUpperSpec" value="${esc(q.upperSpec)}" placeholder="合格上限" /></div>
          <div class="form-group"><label>下规格限</label><input type="text" id="micFormLowerSpec" value="${esc(q.lowerSpec)}" placeholder="合格下限" /></div>
        </div>
        <div style="font-size:12px;color:var(--text-secondary);margin:8px 0 4px;font-weight:600;">实际值限（方法有效范围）</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          <div class="form-group"><label>实际值上限</label><input type="text" id="micFormUpperReal" value="${esc(q.upperReal)}" placeholder="量程上限" /></div>
          <div class="form-group"><label>实际值下限</label><input type="text" id="micFormLowerReal" value="${esc(q.lowerReal)}" placeholder="量程下限" /></div>
        </div>
      </fieldset>

      <!-- ===== 定性特性（联动展开） ===== -->
      <fieldset id="micQualSection" style="border:1px solid var(--border);border-radius:8px;padding:16px;${qualStyle}">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">定性特性</legend>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          <div class="form-group">
            <label>定性代码组<span class="required">*</span></label>
            <select id="micFormCodeGroup" onchange="InspectionChar.onCodeGroupChange()"><option value="">请选择代码组</option>${cgSel}</select>
          </div>
          <div class="form-group">
            <label>默认代码</label>
            <select id="micFormDefaultCode">${dcOptions}</select>
          </div>
        </div>
      </fieldset>

      <!-- ===== 默认值 ===== -->
      <fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">默认值</legend>
        <div class="form-group" style="max-width:400px;">
          <label>默认检验方法</label>
          <select id="micFormDefaultMethod">
            <option value="">（可留空）</option>
            ${micDefaultMethodOptions.map(dm=>`<option value="${dm}" ${isEdit&&m.defaultMethod===dm?'selected':''}>${dm}</option>`).join('')}
          </select>
        </div>
      </fieldset>

      <input type="hidden" id="micFormId" value="${isEdit?m.id:''}" />
      <input type="hidden" id="micFormEditMode" value="${mode}" />
    </form>`;
  },

  // ---- 获取默认代码选项（根据代码组动态变化）----
  getDefaultCodeOptions(codeGroup, selectedCode) {
    const codes = micDefaultCodeOptions[codeGroup] || ['（无默认）'];
    return codes.map(c => `<option value="${c}" ${selectedCode===c?'selected':''}>${c}</option>`).join('');
  },

  // ============= 联动 =============

  onFactoryChange() {
    const facEl = document.getElementById('micFormFactory');
    const codeEl = document.getElementById('micFormCode');
    const editMode = document.getElementById('micFormEditMode')?.value;
    if (!facEl || !codeEl || editMode==='edit') return;
    const fac = facEl.value;
    if (fac) {
      const seq = micData.filter(m => m.factory===fac).length + 1;
      codeEl.value = fac + '-MIC-' + String(seq).padStart(4,'0');
    }
  },

  onTypeChange() {
    const radios = document.getElementsByName('micFormType');
    let typeVal = '';
    for (const r of radios) { if (r.checked) { typeVal = r.value; break; } }
    const quant = document.getElementById('micQuantSection');
    const qual = document.getElementById('micQualSection');
    if (quant) quant.style.display = typeVal==='quantitative' ? '' : 'none';
    if (qual) qual.style.display = typeVal==='qualitative' ? '' : 'none';
  },

  onCodeGroupChange() {
    const cgEl = document.getElementById('micFormCodeGroup');
    const dcEl = document.getElementById('micFormDefaultCode');
    if (!cgEl || !dcEl) return;
    dcEl.innerHTML = this.getDefaultCodeOptions(cgEl.value, '');
  },

  // ============= 保存 =============

  save() {
    const editMode = document.getElementById('micFormEditMode').value;
    const isEdit = editMode === 'edit';

    // 基本数据
    const factory = document.getElementById('micFormFactory').value;
    const shortText = document.getElementById('micFormShortText').value.trim();
    const longText = document.getElementById('micFormLongText').value.trim();

    const typeRadios = document.getElementsByName('micFormType');
    let micType = ''; for (const r of typeRadios) { if (r.checked) { micType = r.value; break; } }

    const statusRadios = document.getElementsByName('micFormStatus');
    let statusVal = ''; for (const r of statusRadios) { if (r.checked) { statusVal = r.value; break; } }

    const samplingProc = document.getElementById('micFormSampling').value;
    const defaultMethod = document.getElementById('micFormDefaultMethod').value;

    // 验证必填
    if (!factory) { toast('请选择所属工厂'); return; }
    if (!micType) { toast('请选择特性类型'); return; }
    if (!shortText) { toast('请填写短文本'); return; }
    if (!statusVal) { toast('请选择状态'); return; }

    if (micType==='quantitative') {
      const unit = document.getElementById('micFormUnit').value;
      const decimal = document.getElementById('micFormDecimal').value;
      if (!unit) { toast('请选择计量单位'); return; }
      if (decimal===''||decimal===null) { toast('请填写小数位数'); return; }
    } else {
      const cg = document.getElementById('micFormCodeGroup').value;
      if (!cg) { toast('请选择定性代码组'); return; }
    }

    const now = new Date().toISOString().slice(0, 10);
    const user = window.currentUserId || '系统';

    if (!isEdit) {
      // 新建
      const seq = micData.filter(m => m.factory===factory).length + 1;
      const code = factory + '-MIC-' + String(seq).padStart(4,'0');
      const facObj = micFactoryOptions.find(f => f.value===factory);
      const newMic = {
        id: 'MIC' + String(micData.length+1).padStart(3,'0'),
        code, factory, factoryName: facObj ? facObj.label : factory,
        micType, micTypeName: micType==='quantitative'?'定量':'定性',
        mode: 'copy', modeName: '完全复制',
        shortText, longText,
        unit: micType==='quantitative' ? (document.getElementById('micFormUnit').value||'') : '',
        decimal: micType==='quantitative' ? parseInt(document.getElementById('micFormDecimal').value)||2 : 0,
        targetValue: micType==='quantitative' ? document.getElementById('micFormTargetValue').value.trim() : '',
        upperSpec: micType==='quantitative' ? document.getElementById('micFormUpperSpec').value.trim() : '',
        lowerSpec: micType==='quantitative' ? document.getElementById('micFormLowerSpec').value.trim() : '',
        upperReal: micType==='quantitative' ? document.getElementById('micFormUpperReal').value.trim() : '',
        lowerReal: micType==='quantitative' ? document.getElementById('micFormLowerReal').value.trim() : '',
        unitText: micType==='quantitative' ? document.getElementById('micFormUnitText').value.trim() : '',
        codeGroup: micType==='qualitative' ? (document.getElementById('micFormCodeGroup').value||'') : '',
        defaultCode: micType==='qualitative' ? (document.getElementById('micFormDefaultCode').value||'') : '',
        samplingProc, defaultMethod,
        status: statusVal,
        createdBy: user, createdDate: now, changedBy: '', changedDate: ''
      };
      micData.push(newMic);
      toast('主检验特性创建成功');
    } else {
      // 编辑
      const id = document.getElementById('micFormId').value;
      const m = micData.find(d => d.id===id);
      if (!m) { toast('数据不存在'); return; }

      m.factory = factory;
      const facObj = micFactoryOptions.find(f => f.value===factory);
      if (facObj) m.factoryName = facObj.label;
      m.micType = micType;
      m.micTypeName = micType==='quantitative'?'定量':'定性';
      m.shortText = shortText;
      m.longText = longText;
      m.samplingProc = samplingProc;
      m.defaultMethod = defaultMethod;
      m.status = statusVal;
      m.changedBy = user;
      m.changedDate = now;

      if (micType==='quantitative') {
        m.unit = document.getElementById('micFormUnit').value||'';
        m.decimal = parseInt(document.getElementById('micFormDecimal').value)||2;
        m.targetValue = document.getElementById('micFormTargetValue').value.trim();
        m.upperSpec = document.getElementById('micFormUpperSpec').value.trim();
        m.lowerSpec = document.getElementById('micFormLowerSpec').value.trim();
        m.upperReal = document.getElementById('micFormUpperReal').value.trim();
        m.lowerReal = document.getElementById('micFormLowerReal').value.trim();
        m.unitText = document.getElementById('micFormUnitText').value.trim();
        m.codeGroup = ''; m.defaultCode = '';
      } else {
        m.unit = ''; m.decimal = 0;
        m.targetValue = ''; m.upperSpec = ''; m.lowerSpec = '';
        m.upperReal = ''; m.lowerReal = ''; m.unitText = '';
        m.codeGroup = document.getElementById('micFormCodeGroup').value||'';
        m.defaultCode = document.getElementById('micFormDefaultCode').value||'';
      }
      toast('主检验特性修改成功');
    }
    closeModal();
    this.init();
  },

  // ============= 查看详情 =============

  openView(id) {
    const m = micData.find(d => d.id===id);
    if (!m) { toast('数据不存在'); return; }

    // 只读字段渲染器（与 buildForm 的 2 列网格保持一致）
    const roField = (label, val) => `<div class="form-group">
      <label>${label}</label>
      <div style="padding-top:6px;font-size:14px;font-weight:500;min-height:22px;">${val||'-'}</div>
    </div>`;

    const typeName = m.micType==='quantitative' ? '定量' : '定性';

    const statusBadge = m.status==='active'
      ? '<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;background:#dcfce7;color:#16a34a;">启用</span>'
      : m.status==='disabled'
        ? '<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;background:#fef3c7;color:#b45309;">停用</span>'
        : '<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;background:#fee2e2;color:#ef4444;">已删除标记</span>';

    // 定量特性 section（结构与 buildForm 一致）
    let quantSection = '';
    if (m.micType==='quantitative') {
      quantSection = `<fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">定量特性</legend>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          ${roField('计量单位', m.unit)}${roField('小数位数', m.decimal)}
          ${roField('目标值', m.targetValue)}${roField('单位文本', m.unitText)}
        </div>
        <div style="font-size:12px;color:var(--text-secondary);margin:8px 0 4px;font-weight:600;">规格限（合格判定范围）</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          ${roField('上规格限', m.upperSpec)}${roField('下规格限', m.lowerSpec)}
        </div>
        <div style="font-size:12px;color:var(--text-secondary);margin:8px 0 4px;font-weight:600;">实际值限（方法有效范围）</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          ${roField('实际值上限', m.upperReal)}${roField('实际值下限', m.lowerReal)}
        </div>
      </fieldset>`;
    }

    // 定性特性 section（结构与 buildForm 一致）
    let qualSection = '';
    if (m.micType==='qualitative') {
      qualSection = `<fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">定性特性</legend>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          ${roField('定性代码组', m.codeGroup)}${roField('默认代码', m.defaultCode)}
        </div>
      </fieldset>`;
    }

    const isQA = this.isQAManager();
    const hasEdit = isQA && m.status!=='deleted';

    const scrollBody = `
      <!-- 基本数据（与表单布局一致） -->
      <fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">基本数据</legend>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
          ${roField('所属工厂', m.factoryName)}
          ${roField('主检验特性编码', m.code)}
          ${roField('特性类型', typeName)}
          ${roField('短文本', m.shortText)}
          ${roField('采样过程', m.samplingProc)}
          <div class="form-group">
            <label>状态</label>
            <div style="padding-top:6px;">${statusBadge}</div>
          </div>
        </div>
        <div class="form-group" style="margin-top:8px;">
          <label>长文本</label>
          <div style="padding-top:6px;font-size:14px;font-weight:500;min-height:22px;">${m.longText||'-'}</div>
        </div>
      </fieldset>

      ${quantSection}${qualSection}

      <!-- 默认值（与表单布局一致） -->
      <fieldset style="border:1px solid var(--border);border-radius:8px;padding:16px;">
        <legend style="font-size:14px;font-weight:700;color:var(--primary);padding:0 8px;">默认值</legend>
        <div class="form-group" style="max-width:400px;">
          <label>默认检验方法</label>
          <div style="padding-top:6px;font-size:14px;font-weight:500;">${m.defaultMethod||'-'}</div>
        </div>
      </fieldset>

      <!-- 其他信息（额外展示） -->
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
          ${hasEdit ? `<button class="btn btn-blue" onclick="InspectionChar.openEdit('${m.id}')">编辑</button>` : ''}
          <button class="btn btn-secondary" onclick="closeModal()">关闭</button>
        </div>
      </div>
    </div>`;

    showModal(`主检验特性详情 · ${esc(m.code)}`, html, [], 'modal-xl');
  },

  // ============= 状态操作 =============

  // 停用
  toggleDisable(id) {
    const m = micData.find(d => d.id===id);
    if (!m) return;
    closeModal();
    showModal('确认停用',
      `<p>确定要停用主检验特性 <strong>${esc(m.code)} - ${esc(m.shortText)}</strong> 吗？</p>
       <p style="color:var(--text-secondary);font-size:13px;">停用后，新建检验计划时不可选择此特性，但已引用的历史数据不受影响。</p>`,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal },
        { text:'确认停用', cls:'btn-warning', action: ()=>{
          m.status = 'disabled';
          m.changedBy = window.currentUserId || '系统';
          m.changedDate = new Date().toISOString().slice(0, 10);
          closeModal();
          this.init();
          toast(`MIC ${m.code} 已停用`);
        }}
      ]
    );
  },

  // 启用
  toggleEnable(id) {
    const m = micData.find(d => d.id===id);
    if (!m) return;
    closeModal();
    m.status = 'active';
    m.changedBy = window.currentUserId || '系统';
    m.changedDate = new Date().toISOString().slice(0, 10);
    this.init();
    toast(`MIC ${m.code} 已重新启用`);
  },

  // 删除（不可逆）
  confirmDelete(id) {
    const m = micData.find(d => d.id===id);
    if (!m) return;
    closeModal();
    showModal('确认删除',
      `<p>确定要删除主检验特性 <strong>${esc(m.code)} - ${esc(m.shortText)}</strong> 吗？</p>
       <p style="color:#ef4444;font-size:13px;">⚠ 删除后状态将变为"已删除标记"，该操作不可恢复，仅保留历史记录以供审计。</p>`,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal },
        { text:'确认删除', cls:'btn-primary', style:'background:#ef4444;', action: ()=>{
          m.status = 'deleted';
          m.changedBy = window.currentUserId || '系统';
          m.changedDate = new Date().toISOString().slice(0, 10);
          closeModal();
          this.init();
          toast(`MIC ${m.code} 已标记删除（不可恢复）`);
        }}
      ]
    );
  }
};
