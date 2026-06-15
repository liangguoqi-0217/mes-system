// ===== 主检验特性 (MIC) Page =====
// 对应 SAP QS21，工厂级别主数据

// ---- Mock Data ----
const factoryOptions = [
  { value:'2001', label:'2001（山东步长）' },
  { value:'2002', label:'2002（天津基地）' },
  { value:'2003', label:'2003（菏泽分厂）' }
];
const unitOptions = ['%','pH','℃','g','mg','mL','L','kg','mm','cm','μm','mPa·s','cfu/g','个/mL'];

// 定性代码组（后续从缺陷代码目录加载）
const codeGroupOptions = [
  'CG001-外观缺陷', 'CG002-颜色偏差', 'CG003-尺寸异常',
  'CG004-气味异常', 'CG005-硬度异常', 'CG006-崩解异常'
];

// 默认检验方法（后续从检验方法库加载）
const defaultMethodOptions = [
  'MET-01 目视检查法', 'MET-02 pH计测定法', 'MET-03 烘箱干燥法',
  'MET-04 HPLC含量测定', 'MET-05 滴定法', 'MET-06 熔点测定法'
];

// ---- MIC 数据 ----
const micData = [
  { id:'MIC001', code:'2001-MIC-001', factory:'2001', factoryName:'2001（山东步长）', micType:'quantitative', micTypeName:'定量',
    shortText:'pH值', longText:'采用pH计在25±1℃下测定，取三次测定平均值',
    unit:'pH', decimal:2, codeGroup:'', samplingProc:'必须', defaultMethod:'MET-02 pH计测定法',
    status:'active', createdBy:'张工', createdDate:'2025-01-15', changedBy:'', changedDate:'' },
  { id:'MIC002', code:'2001-MIC-002', factory:'2001', factoryName:'2001（山东步长）', micType:'quantitative', micTypeName:'定量',
    shortText:'水分含量', longText:'卡尔费休法测定水分，限值≤3.0%',
    unit:'%', decimal:2, codeGroup:'', samplingProc:'必须', defaultMethod:'MET-03 烘箱干燥法',
    status:'active', createdBy:'张工', createdDate:'2025-01-15', changedBy:'', changedDate:'' },
  { id:'MIC003', code:'2001-MIC-003', factory:'2001', factoryName:'2001（山东步长）', micType:'qualitative', micTypeName:'定性',
    shortText:'外观', longText:'目视检查片剂外观，不得有裂纹、斑点、变色',
    unit:'', decimal:0, codeGroup:'CG001-外观缺陷', samplingProc:'必须', defaultMethod:'MET-01 目视检查法',
    status:'active', createdBy:'张工', createdDate:'2025-01-15', changedBy:'', changedDate:'' },
  { id:'MIC004', code:'2001-MIC-004', factory:'2001', factoryName:'2001（山东步长）', micType:'quantitative', micTypeName:'定量',
    shortText:'含量（主成分）', longText:'HPLC法测定主成分含量，应为标示量的90.0%~110.0%',
    unit:'%', decimal:1, codeGroup:'', samplingProc:'必须', defaultMethod:'MET-04 HPLC含量测定',
    status:'active', createdBy:'张工', createdDate:'2025-01-20', changedBy:'', changedDate:'' },
  { id:'MIC005', code:'2001-MIC-005', factory:'2001', factoryName:'2001（山东步长）', micType:'qualitative', micTypeName:'定性',
    shortText:'颜色', longText:'与标准比色液目视比对',
    unit:'', decimal:0, codeGroup:'CG002-颜色偏差', samplingProc:'必须', defaultMethod:'MET-01 目视检查法',
    status:'deleted', createdBy:'张工', createdDate:'2025-01-18', changedBy:'李经理', changedDate:'2025-03-10' },
  { id:'MIC006', code:'2002-MIC-001', factory:'2002', factoryName:'2002（天津基地）', micType:'quantitative', micTypeName:'定量',
    shortText:'崩解时限', longText:'按药典规定方法测定，应≤15分钟',
    unit:'min', decimal:0, codeGroup:'', samplingProc:'必须', defaultMethod:'',
    status:'active', createdBy:'王质检', createdDate:'2025-02-01', changedBy:'', changedDate:'' },
  { id:'MIC007', code:'2002-MIC-002', factory:'2002', factoryName:'2002（天津基地）', micType:'quantitative', micTypeName:'定量',
    shortText:'硬度', longText:'YPD-300硬度仪测定，范围30~80N',
    unit:'N', decimal:1, codeGroup:'', samplingProc:'必须', defaultMethod:'',
    status:'active', createdBy:'王质检', createdDate:'2025-02-01', changedBy:'', changedDate:'' },
  { id:'MIC008', code:'2003-MIC-001', factory:'2003', factoryName:'2003（菏泽分厂）', micType:'quantitative', micTypeName:'定量',
    shortText:'微生物限度', longText:'TAMC ≤1000cfu/g，TYMC ≤100cfu/g',
    unit:'cfu/g', decimal:0, codeGroup:'', samplingProc:'必须', defaultMethod:'',
    status:'active', createdBy:'赵经理', createdDate:'2025-03-05', changedBy:'', changedDate:'' },
  { id:'MIC009', code:'2003-MIC-002', factory:'2003', factoryName:'2003（菏泽分厂）', micType:'qualitative', micTypeName:'定性',
    shortText:'气味', longText:'应具有本品特有气味，无异味',
    unit:'', decimal:0, codeGroup:'CG004-气味异常', samplingProc:'可选', defaultMethod:'MET-01 目视检查法',
    status:'active', createdBy:'赵经理', createdDate:'2025-03-05', changedBy:'', changedDate:'' },
  { id:'MIC010', code:'2001-MIC-006', factory:'2001', factoryName:'2001（山东步长）', micType:'quantitative', micTypeName:'定量',
    shortText:'粒度分布', longText:'激光粒度仪测定，D90≤100μm',
    unit:'μm', decimal:1, codeGroup:'', samplingProc:'可选', defaultMethod:'',
    status:'active', createdBy:'张工', createdDate:'2025-04-01', changedBy:'', changedDate:'' },
];

const InspectionChar = {
  page: 1, pageSize: 10, filtered: [],

  // ---- 权限判断 ----
  isQAManager() {
    return window.currentUserRole === 'admin';
  },

  // ---- 渲染主页面 ----
  render() {
    this.initFilters();
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">主检验特性（MIC）</div>
            <div style="font-size:13px;opacity:0.8;">定义"检什么"，质量检验的最小单元 · 工厂级别主数据</div>
          </div>
          ${this.isQAManager() ? `<button class="btn btn-primary" onclick="InspectionChar.openCreate()">+ 新建主检验特性</button>` : ''}
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>所属工厂</label><select id="micFactory"><option value="">全部</option>${factoryOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>特性类型</label><select id="micType"><option value="">全部</option><option value="quantitative">定量</option><option value="qualitative">定性</option></select></div>
          <div class="filter-group"><label>状态</label><select id="micStatus"><option value="">全部</option><option value="active">启用</option><option value="deleted">已删除标记</option></select></div>
          <div class="filter-group"><label>搜索</label><input type="text" id="micSearch" placeholder="特性编码 / 短文本"></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="InspectionChar.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="InspectionChar.reset()">重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;overflow-x:auto;">
          <table class="data-table" style="min-width:1100px;">
            <thead><tr>
              <th style="width:50px;">序号</th>
              <th>特性编码</th>
              <th>短文本</th>
              <th>特性类型</th>
              <th>单位</th>
              <th>所属工厂</th>
              <th>状态</th>
              <th>创建人</th>
              <th>创建日期</th>
              <th style="width:160px;">操作</th>
            </tr></thead>
            <tbody id="micTableBody"></tbody>
          </table>
        </div>
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
    // 非 QA 经理默认只看本工厂（2001）
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

  // ---- 表格渲染 ----
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

    tbEl.innerHTML = page.map((m, i) => {
      const statusBadge = m.status === 'active'
        ? '<span class="badge badge-green">启用</span>'
        : '<span class="badge badge-red">已删除</span>';
      const typeBadge = m.micType === 'quantitative'
        ? '<span class="badge badge-blue">定量</span>'
        : '<span class="badge badge-gray">定性</span>';

      let actions = '';
      if (canEdit) {
        actions = `<button class="btn btn-xs" style="color:#1890ff;border:1px solid #1890ff;margin-right:4px;" onclick="InspectionChar.openEdit('${m.id}')">编辑</button>`;
        if (m.status === 'active') {
          actions += `<button class="btn btn-xs" style="color:#ef4444;border:1px solid #ef4444;" onclick="InspectionChar.confirmDelete('${m.id}')">删除</button>`;
        } else {
          actions += `<button class="btn btn-xs" style="color:#22c55e;border:1px solid #22c55e;" onclick="InspectionChar.restore('${m.id}')">恢复</button>`;
        }
      }

      return `<tr>
        <td>${start + i + 1}</td>
        <td style="color:#2563eb;font-weight:600;">${esc(m.code)}</td>
        <td>${esc(m.shortText)}</td>
        <td>${typeBadge}</td>
        <td>${esc(m.unit) || '-'}</td>
        <td>${esc(m.factoryName)}</td>
        <td>${statusBadge}</td>
        <td>${esc(m.createdBy)}</td>
        <td>${m.createdDate}</td>
        <td>${actions || '-'}</td>
      </tr>`;
    }).join('');
  },

  // ---- 筛选与分页 ----
  search() {
    const factory = document.getElementById('micFactory').value;
    const type = document.getElementById('micType').value;
    const status = document.getElementById('micStatus').value;
    const kw = document.getElementById('micSearch').value.trim().toLowerCase();

    this.filtered = micData.filter(m => {
      if (factory && m.factory !== factory) return false;
      if (type && m.micType !== type) return false;
      if (status && m.status !== status) return false;
      if (kw && !m.code.toLowerCase().includes(kw) && !m.shortText.toLowerCase().includes(kw)) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
  },

  reset() {
    const factoryEl = document.getElementById('micFactory');
    const typeEl = document.getElementById('micType');
    const statusEl = document.getElementById('micStatus');
    const searchEl = document.getElementById('micSearch');
    if (factoryEl) factoryEl.value = '';
    if (typeEl) typeEl.value = '';
    if (statusEl) statusEl.value = '';
    if (searchEl) searchEl.value = '';
    this.initFilters();
    this.renderTable();
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() { if (this.page < Math.ceil(this.filtered.length / this.pageSize)) { this.page++; this.renderTable(); } },
  changePageSize() {
    const sel = document.getElementById('micPageSizeSel');
    if (sel) { this.pageSize = parseInt(sel.value); this.page = 1; this.renderTable(); }
  },

  // ---- 新建弹窗 ----
  openCreate() {
    const factorySel = factoryOptions.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
    showModal(
      '新建主检验特性',
      `<form id="micForm" onsubmit="return false;" style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
        <div class="form-group"><label>所属工厂<span class="required">*</span></label><select id="micFormFactory" required onchange="InspectionChar.onFactoryChange()"><option value="">请选择</option>${factorySel}</select></div>
        <div class="form-group"><label>特性编码<span class="required">*</span></label><input type="text" id="micFormCode" readonly style="background:#f1f5f9;color:#94a3b8;" value="保存后自动生成" /></div>
        <div class="form-group"><label>特性类型<span class="required">*</span></label><select id="micFormType" required onchange="InspectionChar.onTypeChange()"><option value="">请选择</option><option value="quantitative">定量</option><option value="qualitative">定性</option></select></div>
        <div class="form-group"><label>短文本<span class="required">*</span></label><input type="text" id="micFormShortText" placeholder="如：pH值、外观" required /></div>
        <div style="grid-column:1/-1;" class="form-group"><label>长文本</label><textarea id="micFormLongText" rows="3" placeholder="详细说明、适用范围等" style="width:100%;"></textarea></div>

        <!-- 定量特性字段 -->
        <div id="micQuantFields" style="grid-column:1/-1;display:none;border-top:1px dashed var(--border);padding-top:12px;">
          <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">定量特性字段</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
            <div class="form-group"><label>单位<span class="required">*</span></label><select id="micFormUnit"><option value="">请选择单位</option>${unitOptions.map(u=>`<option value="${u}">${u}</option>`).join('')}</select></div>
            <div class="form-group"><label>小数位数<span class="required">*</span></label><input type="number" id="micFormDecimal" value="2" min="0" max="6" /></div>
          </div>
        </div>

        <!-- 定性特性字段 -->
        <div id="micQualFields" style="grid-column:1/-1;display:none;border-top:1px dashed var(--border);padding-top:12px;">
          <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">定性特性字段</div>
          <div class="form-group" style="width:50%;"><label>定性代码组<span class="required">*</span></label><select id="micFormCodeGroup"><option value="">请选择代码组</option>${codeGroupOptions.map(cg=>`<option value="${cg}">${cg}</option>`).join('')}</select></div>
        </div>

        <!-- 可选字段 -->
        <div style="grid-column:1/-1;border-top:1px dashed var(--border);padding-top:12px;margin-top:4px;">
          <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">可选字段</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
            <div class="form-group"><label>采样过程</label><select id="micFormSampling"><option value="必须">必须</option><option value="不必">不必</option><option value="可选">可选</option></select></div>
            <div class="form-group"><label>默认检验方法</label><select id="micFormMethod"><option value="">（可留空）</option>${defaultMethodOptions.map(dm=>`<option value="${dm}">${dm}</option>`).join('')}</select></div>
          </div>
        </div>

        <input type="hidden" id="micFormId" value="" />
        <input type="hidden" id="micFormMode" value="create" />
      </form>`,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal },
        { text:'保存', cls:'btn-primary', action: ()=>{ InspectionChar.save(); } }
      ],
      'modal-xl'
    );
    // 默认选中第一个工厂
    setTimeout(() => {
      const facEl = document.getElementById('micFormFactory');
      if (facEl && factoryOptions.length > 0) facEl.value = factoryOptions[0].value;
    }, 50);
  },

  // ---- 编辑弹窗 ----
  openEdit(id) {
    const m = micData.find(d => d.id === id);
    if (!m) { toast('数据不存在'); return; }
    const factorySel = factoryOptions.map(o => `<option value="${o.value}" ${o.value===m.factory?'selected':''}>${o.label}</option>`).join('');
    showModal(
      '编辑主检验特性',
      `<form id="micForm" onsubmit="return false;" style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
        <div class="form-group"><label>所属工厂<span class="required">*</span></label><select id="micFormFactory" required>${factorySel}</select></div>
        <div class="form-group"><label>特性编码</label><input type="text" value="${esc(m.code)}" readonly style="background:#f1f5f9;color:#94a3b8;" /></div>
        <div class="form-group"><label>特性类型<span class="required">*</span></label><select id="micFormType" required onchange="InspectionChar.onTypeChange()"><option value="">请选择</option><option value="quantitative" ${m.micType==='quantitative'?'selected':''}>定量</option><option value="qualitative" ${m.micType==='qualitative'?'selected':''}>定性</option></select></div>
        <div class="form-group"><label>短文本<span class="required">*</span></label><input type="text" id="micFormShortText" value="${esc(m.shortText)}" required /></div>
        <div style="grid-column:1/-1;" class="form-group"><label>长文本</label><textarea id="micFormLongText" rows="3" style="width:100%;">${esc(m.longText)}</textarea></div>

        <div id="micQuantFields" style="grid-column:1/-1;${m.micType==='quantitative'?'':'display:none;'}border-top:1px dashed var(--border);padding-top:12px;">
          <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">定量特性字段</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
            <div class="form-group"><label>单位<span class="required">*</span></label><select id="micFormUnit"><option value="">请选择单位</option>${unitOptions.map(u=>`<option value="${u}" ${u===m.unit?'selected':''}>${u}</option>`).join('')}</select></div>
            <div class="form-group"><label>小数位数<span class="required">*</span></label><input type="number" id="micFormDecimal" value="${m.decimal}" min="0" max="6" /></div>
          </div>
        </div>

        <div id="micQualFields" style="grid-column:1/-1;${m.micType==='qualitative'?'':'display:none;'}border-top:1px dashed var(--border);padding-top:12px;">
          <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">定性特性字段</div>
          <div class="form-group" style="width:50%;"><label>定性代码组<span class="required">*</span></label><select id="micFormCodeGroup"><option value="">请选择代码组</option>${codeGroupOptions.map(cg=>`<option value="${cg}" ${cg===m.codeGroup?'selected':''}>${cg}</option>`).join('')}</select></div>
        </div>

        <div style="grid-column:1/-1;border-top:1px dashed var(--border);padding-top:12px;margin-top:4px;">
          <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">可选字段</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
            <div class="form-group"><label>采样过程</label><select id="micFormSampling"><option value="必须" ${m.samplingProc==='必须'?'selected':''}>必须</option><option value="不必" ${m.samplingProc==='不必'?'selected':''}>不必</option><option value="可选" ${m.samplingProc==='可选'?'selected':''}>可选</option></select></div>
            <div class="form-group"><label>默认检验方法</label><select id="micFormMethod"><option value="">（可留空）</option>${defaultMethodOptions.map(dm=>`<option value="${dm}" ${dm===m.defaultMethod?'selected':''}>${dm}</option>`).join('')}</select></div>
          </div>
        </div>

        <input type="hidden" id="micFormId" value="${m.id}" />
        <input type="hidden" id="micFormMode" value="edit" />
      </form>`,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal },
        { text:'保存修改', cls:'btn-primary', action: ()=>{ InspectionChar.save(); } }
      ],
      'modal-xl'
    );
  },

  // ---- 联动：工厂切换 ----
  onFactoryChange() {
    const fac = document.getElementById('micFormFactory').value;
    const codeEl = document.getElementById('micFormCode');
    if (fac && codeEl) {
      const seq = micData.filter(m => m.factory === fac).length + 1;
      codeEl.value = fac + '-MIC-' + String(seq).padStart(3, '0');
    }
  },

  // ---- 联动：特性类型切换 ----
  onTypeChange() {
    const type = document.getElementById('micFormType').value;
    const quant = document.getElementById('micQuantFields');
    const qual = document.getElementById('micQualFields');
    if (quant) quant.style.display = type === 'quantitative' ? '' : 'none';
    if (qual) qual.style.display = type === 'qualitative' ? '' : 'none';
  },

  // ---- 保存（新建/编辑） ----
  save() {
    const mode = document.getElementById('micFormMode').value;
    const factory = document.getElementById('micFormFactory').value;
    const micType = document.getElementById('micFormType').value;
    const shortText = document.getElementById('micFormShortText').value.trim();
    const longText = document.getElementById('micFormLongText').value.trim();
    const samplingProc = document.getElementById('micFormSampling')?.value || '必须';
    const defaultMethod = document.getElementById('micFormMethod')?.value || '';

    if (!factory) { toast('请选择所属工厂'); return; }
    if (!micType) { toast('请选择特性类型'); return; }
    if (!shortText) { toast('请填写短文本'); return; }

    if (micType === 'quantitative') {
      const unit = document.getElementById('micFormUnit')?.value;
      const decimal = document.getElementById('micFormDecimal')?.value;
      if (!unit) { toast('请选择单位'); return; }
      if (decimal === '' || decimal === null) { toast('请填写小数位数'); return; }
    } else if (micType === 'qualitative') {
      const cg = document.getElementById('micFormCodeGroup')?.value;
      if (!cg) { toast('请选择定性代码组'); return; }
    }

    if (mode === 'create') {
      // 生成编码
      const seq = micData.filter(m => m.factory === factory).length + 1;
      const code = factory + '-MIC-' + String(seq).padStart(3, '0');

      const factoryObj = factoryOptions.find(f => f.value === factory);
      const now = new Date().toISOString().slice(0, 10);
      const newMic = {
        id: 'MIC' + String(micData.length + 1).padStart(3, '0'),
        code: code,
        factory: factory,
        factoryName: factoryObj ? factoryObj.label : factory,
        micType: micType,
        micTypeName: micType === 'quantitative' ? '定量' : '定性',
        shortText: shortText,
        longText: longText,
        unit: micType === 'quantitative' ? (document.getElementById('micFormUnit')?.value || '') : '',
        decimal: micType === 'quantitative' ? parseInt(document.getElementById('micFormDecimal')?.value) || 2 : 0,
        codeGroup: micType === 'qualitative' ? (document.getElementById('micFormCodeGroup')?.value || '') : '',
        samplingProc: samplingProc,
        defaultMethod: defaultMethod,
        status: 'active',
        createdBy: window.currentUserId || '系统',
        createdDate: now,
        changedBy: '',
        changedDate: ''
      };
      micData.push(newMic);
      closeModal();
      toast('主检验特性创建成功');
    } else {
      // 编辑
      const id = document.getElementById('micFormId').value;
      const m = micData.find(d => d.id === id);
      if (!m) { toast('数据不存在'); return; }

      m.factory = factory;
      const facObj = factoryOptions.find(f => f.value === factory);
      if (facObj) m.factoryName = facObj.label;
      m.micType = micType;
      m.micTypeName = micType === 'quantitative' ? '定量' : '定性';
      m.shortText = shortText;
      m.longText = longText;
      m.samplingProc = samplingProc;
      m.defaultMethod = defaultMethod;
      m.changedBy = window.currentUserId || '系统';
      m.changedDate = new Date().toISOString().slice(0, 10);
      if (micType === 'quantitative') {
        m.unit = document.getElementById('micFormUnit')?.value || '';
        m.decimal = parseInt(document.getElementById('micFormDecimal')?.value) || 2;
        m.codeGroup = '';
      } else {
        m.unit = '';
        m.decimal = 0;
        m.codeGroup = document.getElementById('micFormCodeGroup')?.value || '';
      }
      closeModal();
      toast('主检验特性修改成功');
    }
    this.init();
  },

  // ---- 软删除 ----
  confirmDelete(id) {
    const m = micData.find(d => d.id === id);
    if (!m) return;
    showModal(
      '确认删除',
      `<p>确定要删除主检验特性 <strong>${esc(m.code)} - ${esc(m.shortText)}</strong> 吗？</p>
       <p style="color:var(--text-secondary);font-size:13px;">删除后状态将变为"已删除标记"，不会物理删除数据。已删除的 MIC 在新建检验计划时不可选用，但历史引用仍保留。</p>`,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal },
        { text:'确认删除', cls:'btn-primary', style:'background:#ef4444;', action: ()=>{
          m.status = 'deleted';
          m.changedBy = window.currentUserId || '系统';
          m.changedDate = new Date().toISOString().slice(0, 10);
          closeModal();
          this.init();
          toast(`MIC ${m.code} 已标记删除`);
        }}
      ]
    );
  },

  // ---- 恢复 ----
  restore(id) {
    const m = micData.find(d => d.id === id);
    if (!m) return;
    m.status = 'active';
    m.changedBy = window.currentUserId || '系统';
    m.changedDate = new Date().toISOString().slice(0, 10);
    this.init();
    toast(`MIC ${m.code} 已恢复启用`);
  }
};
