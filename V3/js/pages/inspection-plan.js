// ===== 检验计划 Page =====
// 质量主数据三级目录 · 连接物料、MIC、检验方法的桥梁 · PRD V1.0

// ---- 工厂选项（全局共用）----
const ipFactoryOptions = [
  { value:'1000', label:'1000（山东步长）' },
  { value:'2001', label:'2001（陕西步长）' },
  { value:'2002', label:'2002（山东丹红）' },
  { value:'2003', label:'2003（神州步长）' }
];

// ---- 用途代码主数据 ----
const ipPurposeOptions = [
  { code:'ORAL', name:'口服制剂' },
  { code:'INJ', name:'注射剂' },
  { code:'TOPICAL', name:'外用制剂' },
  { code:'API', name:'原料药' },
  { code:'INTER', name:'中间体' }
];

// ---- 工作中心主数据 ----
const ipWorkCenterOptions = [
  { value:'WC-SAMP-01', label:'取样组' },
  { value:'WC-LAB-01', label:'理化实验室' },
  { value:'WC-LAB-02', label:'仪器分析室' },
  { value:'WC-LAB-03', label:'微生物实验室' },
  { value:'WC-LAB-04', label:'无菌检查室' }
];

// ---- 取样方案主数据（Mock）----
const ipSamplingOptions = [
  { value:'SP-001', label:'SP-001 常规取样方案（n=20）' },
  { value:'SP-002', label:'SP-002 减量取样方案（n=10）' },
  { value:'SP-003', label:'SP-003 无菌取样方案（n=5）' },
  { value:'SP-004', label:'SP-004 微生物限度取样方案（n=5）' }
];

// ---- Mock 物料数据 ----
const ipMaterialOptions = [
  { code:'MAT-10001', name:'阿莫西林胶囊（0.25g）' },
  { code:'MAT-10002', name:'布洛芬片（0.2g）' },
  { code:'MAT-10003', name:'维生素C片（0.1g）' },
  { code:'MAT-10004', name:'头孢拉定胶囊（0.25g）' },
  { code:'MAT-10005', name:'对乙酰氨基酚片（0.5g）' },
  { code:'MAT-10006', name:'盐酸二甲双胍片（0.5g）' },
  { code:'MAT-10007', name:'阿托伐他汀钙片（10mg）' }
];

// ---- 工具函数 ----
function ipGenPlanCode(factory) {
  const existing = ipData.filter(p => p.factory === factory);
  const maxNum = existing.reduce((max, p) => {
    const m = p.code.match(/IP-(\d{5})$/);
    return m ? Math.max(max, parseInt(m[1])) : max;
  }, 0);
  return `${factory}-IP-${String(maxNum + 1).padStart(5, '0')}`;
}

function ipGenOpNum(ops) {
  const maxNum = ops.reduce((max, o) => Math.max(max, parseInt(o.opNum) || 0), 0);
  return String(maxNum + 10).padStart(4, '0');
}

function esc(str) { return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ---- Mock 检验计划数据 ----
const ipData = [
  {
    id:'IP001', code:'2001-IP-00001', factory:'2001', factoryName:'2001（陕西步长）',
    materialCode:'MAT-10001', materialName:'阿莫西林胶囊（0.25g）',
    purposeCode:'ORAL', purposeName:'口服制剂',
    status:'active',
    createdBy:'张工', createdDate:'2025-02-01',
    operations: [
      {
        opNum:'0010', opType:'sampling', opTypeName:'取样',
        workCenter:'WC-SAMP-01', workCenterName:'取样组',
        description:'按常规取样方案取样',
        samplingPlan:'SP-001', samplingPlanName:'SP-001 常规取样方案（n=20）',
        chars: []
      },
      {
        opNum:'0020', opType:'inspection', opTypeName:'检验',
        workCenter:'WC-LAB-01', workCenterName:'理化实验室',
        description:'理化项目检验',
        samplingPlan:'',
        chars: [
          {
            micId:'MIC001', micCode:'2001-MIC-001', micName:'pH值', micType:'quantitative',
            methodId:'IM002', methodCode:'2001-METHOD-0002', methodName:'pH值测定法',
            samplingPlan:'', samplingPlanName:'',
            unit:'pH', decimal:2,
            upperSpec:'7.0', lowerSpec:'5.0',
            codeGroup:'', defaultCode:''
          },
          {
            micId:'MIC002', micCode:'2001-MIC-002', micName:'水分含量', micType:'quantitative',
            methodId:'IM003', methodCode:'2002-METHOD-0001', methodName:'水分测定法（卡尔费休法）',
            samplingPlan:'', samplingPlanName:'',
            unit:'%', decimal:2,
            upperSpec:'3.0', lowerSpec:'0',
            codeGroup:'', defaultCode:''
          },
          {
            micId:'MIC003', micCode:'2001-MIC-003', micName:'外观', micType:'qualitative',
            methodId:'IM004', methodCode:'2001-METHOD-0003', methodName:'目视检查法',
            samplingPlan:'', samplingPlanName:'',
            unit:'', decimal:0,
            upperSpec:'', lowerSpec:'',
            codeGroup:'CG001-外观缺陷', defaultCode:'合格'
          }
        ]
      },
      {
        opNum:'0030', opType:'inspection', opTypeName:'检验',
        workCenter:'WC-LAB-02', workCenterName:'仪器分析室',
        description:'含量测定',
        samplingPlan:'',
        chars: [
          {
            micId:'MIC004', micCode:'2001-MIC-004', micName:'含量（主成分）', micType:'quantitative',
            methodId:'IM001', methodCode:'2001-METHOD-0001', methodName:'高效液相色谱法测定含量',
            samplingPlan:'', samplingPlanName:'',
            unit:'%', decimal:1,
            upperSpec:'110.0', lowerSpec:'90.0',
            codeGroup:'', defaultCode:''
          }
        ]
      }
    ]
  },
  {
    id:'IP002', code:'2001-IP-00002', factory:'2001', factoryName:'2001（陕西步长）',
    materialCode:'MAT-10002', materialName:'布洛芬片（0.2g）',
    purposeCode:'ORAL', purposeName:'口服制剂',
    status:'active',
    createdBy:'张工', createdDate:'2025-02-15',
    operations: [
      {
        opNum:'0010', opType:'sampling', opTypeName:'取样',
        workCenter:'WC-SAMP-01', workCenterName:'取样组',
        description:'按常规取样方案取样',
        samplingPlan:'SP-001', samplingPlanName:'SP-001 常规取样方案（n=20）',
        chars: []
      },
      {
        opNum:'0020', opType:'inspection', opTypeName:'检验',
        workCenter:'WC-LAB-01', workCenterName:'理化实验室',
        description:'理化项目检验',
        samplingPlan:'',
        chars: [
          {
            micId:'MIC001', micCode:'2001-MIC-001', micName:'pH值', micType:'quantitative',
            methodId:'IM002', methodCode:'2001-METHOD-0002', methodName:'pH值测定法',
            samplingPlan:'', samplingPlanName:'',
            unit:'pH', decimal:2,
            upperSpec:'6.5', lowerSpec:'5.5',
            codeGroup:'', defaultCode:''
          },
          {
            micId:'MIC002', micCode:'2001-MIC-002', micName:'水分含量', micType:'quantitative',
            methodId:'IM003', methodCode:'2002-METHOD-0001', methodName:'水分测定法（卡尔费休法）',
            samplingPlan:'', samplingPlanName:'',
            unit:'%', decimal:2,
            upperSpec:'2.0', lowerSpec:'0',
            codeGroup:'', defaultCode:''
          }
        ]
      }
    ]
  },
  {
    id:'IP003', code:'2001-IP-00003', factory:'2001', factoryName:'2001（陕西步长）',
    materialCode:'MAT-10006', materialName:'盐酸二甲双胍片（0.5g）',
    purposeCode:'ORAL', purposeName:'口服制剂',
    status:'active',
    createdBy:'李经理', createdDate:'2025-03-01',
    operations: [
      {
        opNum:'0010', opType:'sampling', opTypeName:'取样',
        workCenter:'WC-SAMP-01', workCenterName:'取样组',
        description:'取样',
        samplingPlan:'SP-001', samplingPlanName:'SP-001 常规取样方案（n=20）',
        chars: []
      },
      {
        opNum:'0020', opType:'inspection', opTypeName:'检验',
        workCenter:'WC-LAB-01', workCenterName:'理化实验室',
        description:'理化检验',
        samplingPlan:'',
        chars: [
          {
            micId:'MIC001', micCode:'2001-MIC-001', micName:'pH值', micType:'quantitative',
            methodId:'IM002', methodCode:'2001-METHOD-0002', methodName:'pH值测定法',
            samplingPlan:'', samplingPlanName:'',
            unit:'pH', decimal:2,
            upperSpec:'7.0', lowerSpec:'6.0',
            codeGroup:'', defaultCode:''
          },
          {
            micId:'MIC003', micCode:'2001-MIC-003', micName:'外观', micType:'qualitative',
            methodId:'IM004', methodCode:'2001-METHOD-0003', methodName:'目视检查法',
            samplingPlan:'', samplingPlanName:'',
            unit:'', decimal:0,
            upperSpec:'', lowerSpec:'',
            codeGroup:'CG001-外观缺陷', defaultCode:'合格'
          }
        ]
      }
    ]
  },
  {
    id:'IP004', code:'2002-IP-00001', factory:'2002', factoryName:'2002（山东丹红）',
    materialCode:'MAT-10003', materialName:'维生素C片（0.1g）',
    purposeCode:'ORAL', purposeName:'口服制剂',
    status:'active',
    createdBy:'王质检', createdDate:'2025-03-10',
    operations: [
      {
        opNum:'0010', opType:'sampling', opTypeName:'取样',
        workCenter:'WC-SAMP-01', workCenterName:'取样组',
        description:'取样',
        samplingPlan:'SP-002', samplingPlanName:'SP-002 减量取样方案（n=10）',
        chars: []
      },
      {
        opNum:'0020', opType:'inspection', opTypeName:'检验',
        workCenter:'WC-LAB-01', workCenterName:'理化实验室',
        description:'理化检验',
        samplingPlan:'',
        chars: [
          {
            micId:'MIC006', micCode:'2002-MIC-001', micName:'崩解时限', micType:'quantitative',
            methodId:'IM006', methodCode:'2002-METHOD-0002', methodName:'崩解时限检查法',
            samplingPlan:'', samplingPlanName:'',
            unit:'min', decimal:0,
            upperSpec:'15', lowerSpec:'0',
            codeGroup:'', defaultCode:''
          },
          {
            micId:'MIC007', micCode:'2002-MIC-002', micName:'硬度', micType:'quantitative',
            methodId:'', methodCode:'', methodName:'',
            samplingPlan:'', samplingPlanName:'',
            unit:'N', decimal:1,
            upperSpec:'80', lowerSpec:'30',
            codeGroup:'', defaultCode:''
          }
        ]
      }
    ]
  },
  {
    id:'IP005', code:'2001-IP-00004', factory:'2001', factoryName:'2001（陕西步长）',
    materialCode:'MAT-10004', materialName:'头孢拉定胶囊（0.25g）',
    purposeCode:'ORAL', purposeName:'口服制剂',
    status:'disabled',
    createdBy:'张工', createdDate:'2025-04-01',
    operations: [
      {
        opNum:'0010', opType:'sampling', opTypeName:'取样',
        workCenter:'WC-SAMP-01', workCenterName:'取样组',
        description:'取样',
        samplingPlan:'SP-001', samplingPlanName:'SP-001 常规取样方案（n=20）',
        chars: []
      },
      {
        opNum:'0020', opType:'inspection', opTypeName:'检验',
        workCenter:'WC-LAB-03', workCenterName:'微生物实验室',
        description:'微生物限度',
        samplingPlan:'',
        chars: [
          {
            micId:'MIC004', micCode:'2001-MIC-004', micName:'含量（主成分）', micType:'quantitative',
            methodId:'IM001', methodCode:'2001-METHOD-0001', methodName:'高效液相色谱法测定含量',
            samplingPlan:'', samplingPlanName:'',
            unit:'%', decimal:1,
            upperSpec:'110.0', lowerSpec:'90.0',
            codeGroup:'', defaultCode:''
          }
        ]
      }
    ]
  },
  {
    id:'IP006', code:'2003-IP-00001', factory:'2003', factoryName:'2003（神州步长）',
    materialCode:'MAT-10005', materialName:'对乙酰氨基酚片（0.5g）',
    purposeCode:'ORAL', purposeName:'口服制剂',
    status:'deleted',
    createdBy:'赵经理', createdDate:'2025-05-01',
    operations: [
      {
        opNum:'0010', opType:'sampling', opTypeName:'取样',
        workCenter:'WC-SAMP-01', workCenterName:'取样组',
        description:'取样',
        samplingPlan:'SP-001', samplingPlanName:'SP-001 常规取样方案（n=20）',
        chars: []
      },
      {
        opNum:'0020', opType:'inspection', opTypeName:'检验',
        workCenter:'WC-LAB-01', workCenterName:'理化实验室',
        description:'理化检验',
        samplingPlan:'',
        chars: [
          {
            micId:'MIC008', micCode:'2003-MIC-001', micName:'微生物限度', micType:'quantitative',
            methodId:'IM005', methodCode:'2003-METHOD-0001', methodName:'微生物限度检查法',
            samplingPlan:'', samplingPlanName:'',
            unit:'cfu/g', decimal:0,
            upperSpec:'1000', lowerSpec:'0',
            codeGroup:'', defaultCode:''
          }
        ]
      }
    ]
  },
  {
    id:'IP007', code:'1000-IP-00001', factory:'1000', factoryName:'1000（山东步长）',
    materialCode:'MAT-10007', materialName:'阿托伐他汀钙片（10mg）',
    purposeCode:'ORAL', purposeName:'口服制剂',
    status:'active',
    createdBy:'陈主管', createdDate:'2025-06-01',
    operations: [
      {
        opNum:'0010', opType:'sampling', opTypeName:'取样',
        workCenter:'WC-SAMP-01', workCenterName:'取样组',
        description:'取样',
        samplingPlan:'SP-001', samplingPlanName:'SP-001 常规取样方案（n=20）',
        chars: []
      },
      {
        opNum:'0020', opType:'inspection', opTypeName:'检验',
        workCenter:'WC-LAB-01', workCenterName:'理化实验室',
        description:'理化检验',
        samplingPlan:'',
        chars: [
          {
            micId:'MIC010', micCode:'2001-MIC-006', micName:'粒度分布', micType:'quantitative',
            methodId:'', methodCode:'', methodName:'',
            samplingPlan:'', samplingPlanName:'',
            unit:'μm', decimal:1,
            upperSpec:'100', lowerSpec:'',
            codeGroup:'', defaultCode:''
          }
        ]
      }
    ]
  }
];

const InspectionPlan = {
  page: 1, pageSize: 10, filtered: [],
  editId: null, // 当前编辑/新建的临时数据
  formOps: [],   // 表单中的工序列表
  currentFactory: '2001',

  // ---- 权限 ----
  isQAManager() { return window.currentUserRole === 'admin'; },

  // ---- 渲染主页面 ----
  render() {
    this.currentFactory = (window.currentUser && window.currentUser.factory) || '2001';
    this.initFilters();
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <!-- 顶部标题栏 -->
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">检验计划</div><div style="font-size:13px;opacity:0.8;">连接物料、MIC与检验标准的桥梁 · 定义"从取样到判定"的完整流程</div></div>
          ${this.isQAManager() ? `<button class="btn btn-blue" onclick="InspectionPlan.openCreate()">+ 新建检验计划</button>` : ''}
        </div>
        <!-- 筛选栏 -->
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>物料编码/名称</label><input type="text" id="ipMaterial" placeholder="搜索物料"></div>
          <div class="filter-group"><label>用途代码</label><select id="ipPurpose"><option value="">全部</option>${ipPurposeOptions.map(p=>`<option value="${p.code}">${p.code}（${p.name}）</option>`).join('')}</select></div>
          <div class="filter-group"><label>状态</label><select id="ipStatus"><option value="">全部</option><option value="active">启用</option><option value="disabled">停用</option></select></div>
          <div class="filter-actions">
            <button class="btn btn-gray" onclick="InspectionPlan.search()" style="margin-left:8px;">查询</button>
            <button class="btn btn-gray" onclick="InspectionPlan.reset()">重置</button>
          </div>
        </div>
        <!-- 表格区域 -->
        <div style="flex:1;overflow:auto;padding:0 16px 16px;">
          <div style="background:white;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,.08);">
            <table class="data-table" style="width:100%;border-collapse:collapse;">
              <thead><tr>
                <th style="width:50px;">序号</th>
                <th>检验计划编号</th>
                <th>物料编码</th>
                <th>物料名称</th>
                <th>用途代码</th>
                <th>用途名称</th>
                <th>工序数</th>
                <th>状态</th>
                <th>创建人</th>
                <th>创建日期</th>
                <th style="width:140px;">操作</th>
              </tr></thead>
              <tbody id="ipTbody"></tbody>
            </table>
            <div id="ipEmpty" style="display:none;"></div>
            <div id="ipPagination"></div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    this.renderTable();
    this.renderPagination();
  },

  // ---- 筛选 ----
  initFilters() {
    this.filtered = ipData.filter(m => m.status !== 'deleted');
    this.page = 1;
  },

  search() {
    const material = (document.getElementById('ipMaterial').value||'').trim().toLowerCase();
    const purpose = document.getElementById('ipPurpose').value;
    const status = document.getElementById('ipStatus').value;
    this.filtered = ipData.filter(m => {
      if (m.status === 'deleted') return false;
      if (material && !m.materialCode.toLowerCase().includes(material) && !m.materialName.toLowerCase().includes(material)) return false;
      if (purpose && m.purposeCode !== purpose) return false;
      if (status && m.status !== status) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
    this.renderPagination();
  },

  reset() {
    const els = ['ipMaterial','ipPurpose','ipStatus'];
    els.forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
    this.initFilters();
    this.renderTable();
    this.renderPagination();
  },

  // ---- 表格渲染 ----
  renderTable() {
    const tb = document.getElementById('ipTbody');
    const empty = document.getElementById('ipEmpty');
    if (!tb) return;
    const canEdit = this.isQAManager();
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);

    if (page.length === 0) {
      tb.innerHTML = '';
      if (empty) { empty.style.display = 'block'; empty.innerHTML = this.renderEmptyState(); }
      return;
    }
    if (empty) empty.style.display = 'none';

    const statusBadge = (s) => {
      if (s==='active') return '<span class="badge badge-green">启用</span>';
      if (s==='disabled') return '<span class="badge badge-yellow">停用</span>';
      return '<span class="badge badge-red">已删除</span>';
    };

    tb.innerHTML = page.map((m, i) => {
      const opCount = (m.operations || []).length;
      let btns = `<button class="btn btn-blue btn-sm" onclick="InspectionPlan.openView('${m.id}')">查看</button>`;
      if (canEdit && m.status !== 'deleted') {
        btns += ` <button class="btn btn-gray btn-sm" onclick="InspectionPlan.openEdit('${m.id}')">编辑</button>`;
        if (m.status === 'active') {
          btns += ` <button class="btn btn-yellow btn-sm" onclick="InspectionPlan.toggleStatus('${m.id}')">停用</button>`;
        } else {
          btns += ` <button class="btn btn-green btn-sm" onclick="InspectionPlan.toggleStatus('${m.id}')">启用</button>`;
        }
        btns += ` <button class="btn btn-red btn-sm" onclick="InspectionPlan.markDelete('${m.id}')">删除</button>`;
      }
      return `<tr>
        <td>${start+i+1}</td>
        <td><span style="color:#2563eb;font-weight:600;">${esc(m.code)}</span></td>
        <td>${esc(m.materialCode)}</td>
        <td>${esc(m.materialName)}</td>
        <td>${esc(m.purposeCode)}</td>
        <td>${esc(m.purposeName)}</td>
        <td>${opCount}</td>
        <td>${statusBadge(m.status)}</td>
        <td>${esc(m.createdBy)}</td>
        <td>${m.createdDate}</td>
        <td>${btns}</td>
      </tr>`;
    }).join('');
  },

  renderEmptyState() {
    return `<div style="text-align:center;padding:48px 24px;color:#94a3b8;">
      <div style="font-size:48px;margin-bottom:12px;">📋</div>
      <div style="font-size:16px;font-weight:600;margin-bottom:4px;">暂无检验计划</div>
      <div style="font-size:13px;">${this.isQAManager() ? '点击上方按钮创建第一个检验计划' : '暂无数据'}</div>
    </div>`;
  },

  renderPagination() {
    const pg = document.getElementById('ipPagination');
    if (!pg) return;
    const total = Math.ceil(this.filtered.length / this.pageSize);
    if (total <= 1) { pg.innerHTML = ''; return; }
    let html = '<div style="display:flex;gap:6px;justify-content:flex-end;padding:12px 16px;align-items:center;">';
    html += `<span style="font-size:13px;color:#64748b;margin-right:8px;">共 ${this.filtered.length} 条</span>`;
    html += `<button class="btn btn-gray btn-sm" ${this.page<=1?'disabled':''} onclick="InspectionPlan.goPage(${this.page-1})">上一页</button>`;
    for (let i = 1; i <= total; i++) {
      html += `<button class="btn btn-sm ${i===this.page?'btn-blue':'btn-gray'}" onclick="InspectionPlan.goPage(${i})">${i}</button>`;
    }
    html += `<button class="btn btn-gray btn-sm" ${this.page>=total?'disabled':''} onclick="InspectionPlan.goPage(${this.page+1})">下一页</button>`;
    html += '</div>';
    pg.innerHTML = html;
  },

  goPage(p) {
    this.page = p;
    this.renderTable();
    this.renderPagination();
  },

  // ---- 打开新建 ----
  openCreate() {
    this.editId = '';
    this.formOps = [
      { opNum:'0010', opType:'sampling', opTypeName:'取样', workCenter:'WC-SAMP-01', workCenterName:'取样组', description:'', samplingPlan:'SP-001', samplingPlanName:'SP-001 常规取样方案（n=20）', chars:[] },
      { opNum:'0020', opType:'inspection', opTypeName:'检验', workCenter:'WC-LAB-01', workCenterName:'理化实验室', description:'', samplingPlan:'', chars:[] }
    ];
    showModal('新建检验计划', this.buildForm(), [
      { text:'取消', cls:'btn-secondary', action: ()=>{ InspectionPlan.closeModal(); } },
      { text:'保存', cls:'btn-primary', action: ()=>{ InspectionPlan.save(); } }
    ], 'modal-xl');
    this.bindModalEvents();
  },

  // ---- 打开编辑 ----
  openEdit(id) {
    const p = ipData.find(m => m.id === id);
    if (!p) return;
    this.editId = id;
    this.formOps = JSON.parse(JSON.stringify(p.operations));
    showModal('编辑检验计划', this.buildForm(p), [
      { text:'取消', cls:'btn-secondary', action: ()=>{ InspectionPlan.closeModal(); } },
      { text:'保存修改', cls:'btn-primary', action: ()=>{ InspectionPlan.save(); } }
    ], 'modal-xl');
    this.bindModalEvents();
  },

  // ---- 打开查看 ----
  openView(id) {
    const p = ipData.find(m => m.id === id);
    if (!p) return;
    this.editId = '';
    this.formOps = JSON.parse(JSON.stringify(p.operations));
    showModal('查看检验计划', this.buildForm(p, true), [
      { text:'关闭', cls:'btn-secondary', action: ()=>{ InspectionPlan.closeModal(); } }
    ], 'modal-xl');
  },

  // ---- 绑定弹窗内事件（DOM 渲染后执行）----
  bindModalEvents() {
    setTimeout(() => {
      const bc = document.getElementById('modalBackdrop');
      if (!bc) return;
      bc.querySelectorAll('.ip-mic-select').forEach(sel => {
        sel.addEventListener('change', (e) => this.onMicChange(e.target));
      });
      bc.querySelectorAll('.ip-optype').forEach(radio => {
        radio.addEventListener('change', (e) => this.onOpTypeChange(e.target));
      });
    }, 50);
  },

  closeModal() {
    closeModal();
    this.editId = null;
    this.formOps = [];
  },

  // ---- 构建表单（清爽表格型）----
  buildForm(data, readonly) {
    const p = data || {};
    const ro = readonly ? 'disabled' : '';
    const fac = p.factory || this.currentFactory;
    const planCode = p.code || ipGenPlanCode(fac);

    // 选项数据
    const availMic = (typeof micData !== 'undefined' ? micData : []).filter(m => m.factory === fac && m.status === 'active');
    const availMethod = (typeof imData !== 'undefined' ? imData : []).filter(m => m.status === 'active');
    const matOpts = ipMaterialOptions.map(m => `<option value="${m.code}">${m.code}（${m.name}）</option>`).join('');
    const purposeOpts = ipPurposeOptions.map(pp => `<option value="${pp.code}">${pp.code}（${pp.name}）</option>`).join('');
    const wcOpts = ipWorkCenterOptions.map(w => `<option value="${w.value}">${w.label}</option>`).join('');
    const spOpts = ipSamplingOptions.map(s => `<option value="${s.value}">${s.label}</option>`).join('');
    const micOpts = availMic.map(m => `<option value="${m.id}" data-mic-type="${m.micType}" data-mic-unit="${m.unit||''}" data-mic-decimal="${m.decimal||0}" data-mic-method="${m.defaultMethod||''}" data-mic-codegroup="${m.codeGroup||''}" data-mic-defaultcode="${m.defaultCode||''}">${m.code}（${m.shortText}）</option>`).join('');
    const methodOpts = availMethod.map(m => `<option value="${m.id}">${m.code}（${m.name}）</option>`).join('');
    const roField = (label, val) => `<div class="form-group"><label>${label}</label><div class="ro-value">${esc(val||'—')}</div></div>`;

    return `
      <!-- 抬头信息 -->
      <div class="clean-section">
        <h4>抬头信息</h4>
        <div class="clean-grid-3">
          ${ro ? roField('检验计划编号', planCode) : `<div class="form-group"><label>检验计划编号</label><input type="text" class="form-input" value="${esc(planCode)}" disabled></div>`}
          <div class="form-group">
            <label>工厂</label>
            ${ro ? `<div class="ro-value">${esc(p.factoryName||ipFactoryOptions.find(f=>f.value===fac)?.label||fac)}</div>` : `<input type="text" class="form-input" value="${esc(ipFactoryOptions.find(f=>f.value===fac)?.label||fac)}" disabled>`}
          </div>
          <div class="form-group">
            <label>状态</label>
            ${ro ? `<div class="ro-value">${p.status==='active'?'启用':(p.status==='disabled'?'停用':'已删除')}</div>`
              : `<div style="display:flex;gap:12px;padding-top:4px;">
                <label style="display:inline-flex;align-items:center;gap:4px;margin-bottom:0;font-weight:600;"><input type="radio" name="ipF_status" value="active" ${p.status!=='disabled'?'checked':''}> 启用</label>
                <label style="display:inline-flex;align-items:center;gap:4px;margin-bottom:0;font-weight:600;"><input type="radio" name="ipF_status" value="disabled" ${p.status==='disabled'?'checked':''}> 停用</label>
              </div>`
            }
          </div>
        </div>
        <div class="clean-grid-2" style="margin-top:12px;">
          <div class="form-group">
            <label>物料编码<span class="req">*</span></label>
            ${ro ? `<div class="ro-value">${esc(p.materialCode||'—')}</div>` : `<select class="form-input" id="ipF_materialCode" onchange="InspectionPlan.onMaterialChange()"><option value="">— 请选择 —</option>${matOpts}</select>`}
          </div>
          ${ro ? roField('物料名称', p.materialName) : `<div class="form-group"><label>物料名称</label><input type="text" class="form-input" id="ipF_materialName" value="${esc(p.materialName||'')}" readonly></div>`}
          <div class="form-group">
            <label>用途代码<span class="req">*</span></label>
            ${ro ? `<div class="ro-value">${esc(p.purposeCode||'—')}（${esc(p.purposeName||'')}）</div>` : `<select class="form-input" id="ipF_purposeCode" onchange="InspectionPlan.onPurposeChange()"><option value="">— 请选择 —</option>${purposeOpts}</select>`}
          </div>
          ${ro ? roField('用途名称', p.purposeName) : `<div class="form-group"><label>用途名称</label><input type="text" class="form-input" id="ipF_purposeName" value="${esc(p.purposeName||'')}" readonly></div>`}
        </div>
      </div>

      <!-- 工序表格 -->
      <div class="clean-section">
        <h4>工序与检验特性${!ro ? `<button class="btn-add btn-xs" type="button" onclick="InspectionPlan.addOperation()" style="margin-left:12px;">+ 添加工序</button>` : ''}</h4>
        <div style="overflow-x:auto;">
          <table class="clean-op-table">
            <thead><tr>
              <th style="width:60px;">工序号</th>
              <th style="width:80px;">类型</th>
              <th>工作中心</th>
              <th>描述</th>
              <th style="width:200px;">取样方案</th>
              <th>检验特性</th>
              <th style="width:50px;"></th>
            </tr></thead>
            <tbody id="ipOpsContainer">
              ${this.formOps.map((op, oi) => this.buildOpRow(op, oi, ro, wcOpts, spOpts)).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 检验特性详情区 -->
      ${!ro && this.formOps.some(op => op.opType === 'inspection') ? `<div class="clean-section"><h4>检验特性详情</h4><div id="ipCharsArea">${this.renderAllChars(ro, micOpts, methodOpts, spOpts)}</div></div>` : ''}
      ${!ro && !this.formOps.some(op => op.opType === 'inspection') ? `<div class="clean-section"><h4>检验特性详情</h4><div id="ipCharsArea" class="clean-empty-chars">暂无检验工序，切换工序类型为"检验"后可配置特性</div></div>` : ''}
      ${ro ? `<div class="clean-section"><h4>检验特性详情</h4>${this.renderAllChars(ro, micOpts, methodOpts, spOpts)}</div>` : ''}
    `;
  },

  // ---- 渲染所有检验工序的特性区 ----
  renderAllChars(ro, micOpts, methodOpts, spOpts) {
    return this.formOps.map((op, oi) => {
      if (op.opType !== 'inspection') return '';
      const wcName = ipWorkCenterOptions.find(w => w.value === op.workCenter);
      return `<div data-op-chars="${oi}" style="margin-bottom:6px;">` +
        `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;font-size:13px;">` +
          `<span><span class="badge badge-blue" style="margin-right:6px;">${esc(op.opNum)}</span>${esc(wcName?wcName.label:op.workCenter)}</span>` +
          `${!ro ? `<button class="btn-add btn-xs" type="button" onclick="InspectionPlan.addChar(${oi})">+ 添加特性</button>` : ''}` +
        `</div>` +
        `${(op.chars||[]).map((ch, ci) => this.buildCharCard(ch, oi, ci, ro, micOpts, methodOpts, spOpts)).join('')}` +
        `${(op.chars||[]).length === 0 ? `<div class="clean-empty-chars">暂无检验特性，点击上方按钮添加</div>` : ''}` +
        `</div>`;
    }).join('');
  },

  // ---- 构建工序表格行 ----
  buildOpRow(op, oi, ro, wcOpts, spOpts) {
    const isSampling = op.opType === 'sampling';
    const isInspection = op.opType === 'inspection';
    const wcObj = ipWorkCenterOptions.find(w => w.value === op.workCenter);

    let charsCell = '';
    if (isInspection && op.chars && op.chars.length > 0) {
      charsCell = `<div class="clean-tag-row">` +
        op.chars.map((ch, ci) => {
          const cls = ch.micType === 'qualitative' ? 'clean-tag qual' : 'clean-tag';
          return `<span class="${cls}" data-op-idx="${oi}" data-char-idx="${ci}" title="${esc(ch.micName||'未命名')}">${esc(ch.micName||'未命名')}</span>`;
        }).join('') +
        `${!ro ? `<button class="btn-add btn-xs" onclick="InspectionPlan.addChar(${oi})">+</button>` : ''}` +
        `</div>`;
    } else if (isInspection) {
      charsCell = `<span class="badge badge-gray" style="margin-right:4px;">— 无 —</span>${!ro ? `<button class="btn-add btn-xs" onclick="InspectionPlan.addChar(${oi})">+</button>` : ''}`;
    } else {
      charsCell = `<span class="badge badge-gray">— 不适用 —</span>`;
    }

    return `<tr data-op-idx="${oi}">
      <td><span class="badge badge-blue">${esc(op.opNum)}</span></td>
      <td style="white-space:nowrap;">
        ${ro ? `<span class="badge ${isSampling?'badge-green':'badge-purple'}">${esc(op.opTypeName)}</span>`
          : `<label style="display:inline-flex;align-items:center;gap:3px;font-size:11px;margin-bottom:0;font-weight:600;margin-right:8px;cursor:pointer;">
              <input type="radio" class="ip-optype" name="ipOpType_${oi}" value="sampling" ${isSampling?'checked':''} data-op-idx="${oi}"> 取样
            </label>
            <label style="display:inline-flex;align-items:center;gap:3px;font-size:11px;margin-bottom:0;font-weight:600;cursor:pointer;">
              <input type="radio" class="ip-optype" name="ipOpType_${oi}" value="inspection" ${isInspection?'checked':''} data-op-idx="${oi}"> 检验
            </label>`
        }
      </td>
      <td>${ro ? `<span class="ro-value">${esc(op.workCenterName||op.workCenter)}</span>` : `<select class="ip-wc" data-op-idx="${oi}">${wcOpts}</select>`}</td>
      <td>${ro ? `<span class="ro-value">${esc(op.description||'—')}</span>` : `<input type="text" class="ip-opdesc" value="${esc(op.description||'')}" placeholder="（可选）" data-op-idx="${oi}">`}</td>
      <td>
        ${isSampling
          ? (ro ? `<span class="ro-value">${esc(op.samplingPlanName||op.samplingPlan||'—')}</span>` : `<select class="ip-sp" data-op-idx="${oi}"><option value="">— 请选择 —</option>${spOpts}</select>`)
          : `<span class="badge badge-gray">— 不适用 —</span>`}
      </td>
      <td>${charsCell}</td>
      <td>${!ro ? `<button class="btn-danger btn-xs" type="button" onclick="InspectionPlan.removeOperation(${oi})">删除</button>` : ''}</td>
    </tr>`;
  },

  // ---- 构建检验特性编辑卡片 ----
  buildCharCard(ch, oi, ci, ro, micOpts, methodOpts, spOpts) {
    const isQuant = ch.micType === 'quantitative';
    const isQual = ch.micType === 'qualitative';
    const codeGroupMap = (typeof micDefaultCodeOptions !== 'undefined' ? micDefaultCodeOptions : {});
    const cgCodes = codeGroupMap[ch.codeGroup] || [];

    return `<div class="clean-info-card ip-char-item" data-op-idx="${oi}" data-char-idx="${ci}">
      <h5>
        <span class="clean-char-meta">
          ${esc(ch.micName||'新特性')}
          <span class="badge ${isQuant?'badge-blue':'badge-purple'} badge-sm">${isQuant?'定量':'定性'}</span>
        </span>
        ${!ro ? `<button class="btn-danger btn-xs" type="button" onclick="InspectionPlan.removeChar(${oi},${ci})">删除</button>` : ''}
      </h5>
      <div class="clean-grid-3">
        <div class="form-group">
          <label>主检验特性（MIC）<span class="req">*</span></label>
          ${ro ? `<div class="ro-value">${esc(ch.micCode)}（${esc(ch.micName)}）</div>` : `<select class="form-input ip-mic-select" data-op-idx="${oi}" data-char-idx="${ci}"><option value="">— 请选择 —</option>${micOpts}</select>`}
        </div>
        <div class="form-group">
          <label>检验方法</label>
          ${ro ? `<div class="ro-value">${ch.methodCode ? esc(ch.methodCode)+'（'+esc(ch.methodName)+'）' : '—'}</div>` : `<select class="form-input ip-method" data-op-idx="${oi}" data-char-idx="${ci}"><option value="">— 可选 —</option>${methodOpts}</select>`}
        </div>
        <div class="form-group">
          <label>取样方案</label>
          ${ro ? `<div class="ro-value">${ch.samplingPlanName||ch.samplingPlan||'—'}</div>` : `<select class="form-input ip-char-sp" data-op-idx="${oi}" data-char-idx="${ci}"><option value="">— 可选 —</option>${spOpts}</select>`}
        </div>
      </div>
      <!-- 定量 -->
      <div class="ip-quant-fields" data-op-idx="${oi}" data-char-idx="${ci}" style="${isQuant?'':'display:none;'} display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-top:10px;">
        <div class="form-group">
          <label>单位</label>
          ${ro ? `<div class="ro-value">${ch.unit||'—'}</div>` : `<input type="text" class="form-input ip-char-unit" value="${esc(ch.unit||'')}">`}
        </div>
        <div class="form-group">
          <label>小数位数</label>
          ${ro ? `<div class="ro-value">${ch.decimal||0}</div>` : `<input type="number" class="form-input ip-char-decimal" value="${ch.decimal||0}" min="0" max="6">`}
        </div>
        <div class="form-group">
          <label>上规格限<span class="req">*</span></label>
          ${ro ? `<div class="ro-value">${ch.upperSpec||'—'}</div>` : `<input type="text" class="form-input ip-char-upper" value="${esc(ch.upperSpec||'')}" placeholder="如 7.0">`}
        </div>
        <div class="form-group">
          <label>下规格限<span class="req">*</span></label>
          ${ro ? `<div class="ro-value">${ch.lowerSpec||'—'}</div>` : `<input type="text" class="form-input ip-char-lower" value="${esc(ch.lowerSpec||'')}" placeholder="如 5.0">`}
        </div>
      </div>
      <!-- 定性 -->
      <div class="ip-qual-fields" data-op-idx="${oi}" data-char-idx="${ci}" style="${isQual?'':'display:none;'} display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px;">
        <div class="form-group">
          <label>代码组</label>
          ${ro ? `<div class="ro-value">${ch.codeGroup||'—'}</div>` : `<input type="text" class="form-input ip-char-codegroup" value="${esc(ch.codeGroup||'')}" readonly>`}
        </div>
        <div class="form-group">
          <label>默认代码</label>
          ${ro ? `<div class="ro-value">${ch.defaultCode||'—'}</div>` : `<select class="form-input ip-char-defaultcode"><option value="">— 可选 —</option>${cgCodes.map(c=>`<option value="${c}">${c}</option>`).join('')}</select>`}
        </div>
      </div>
    </div>`;
  }

  // ---- MIC 选择变更 ----
  onMicChange(sel) {
    const opIdx = parseInt(sel.dataset.opIdx);
    const charIdx = parseInt(sel.dataset.charIdx);
    const opt = sel.selectedOptions[0];
    if (!opt || !opt.value) {
      // 清空
      const card = document.querySelector(`.ip-char-item[data-op-idx="${opIdx}"][data-char-idx="${charIdx}"]`);
      if (card) {
        const qf = card.querySelector('.ip-quant-fields'); if (qf) qf.style.display = 'none';
        const qlf = card.querySelector('.ip-qual-fields'); if (qlf) qlf.style.display = 'none';
      }
      return;
    }
    const micType = opt.dataset.micType;
    const card = document.querySelector(`.ip-char-item[data-op-idx="${opIdx}"][data-char-idx="${charIdx}"]`);
    if (!card) return;

    const quantFields = card.querySelector('.ip-quant-fields');
    const qualFields = card.querySelector('.ip-qual-fields');
    if (micType === 'quantitative') {
      if (quantFields) quantFields.style.display = 'grid';
      if (qualFields) qualFields.style.display = 'none';
      // 自动填入 MIC 默认值
      const unitEl = card.querySelector('.ip-char-unit');
      const decEl = card.querySelector('.ip-char-decimal');
      if (unitEl) unitEl.value = opt.dataset.micUnit || '';
      if (decEl) decEl.value = opt.dataset.micDecimal || '0';
    } else {
      if (quantFields) quantFields.style.display = 'none';
      if (qualFields) qualFields.style.display = 'grid';
      const cgEl = card.querySelector('.ip-char-codegroup');
      if (cgEl) cgEl.value = opt.dataset.micCodegroup || '';
      // 刷新默认代码选项
      const dcEl = card.querySelector('.ip-char-defaultcode');
      if (dcEl) {
        const cg = opt.dataset.micCodegroup || '';
        const codeGroupMap = (typeof micDefaultCodeOptions !== 'undefined' ? micDefaultCodeOptions : {});
        const codes = codeGroupMap[cg] || [];
        dcEl.innerHTML = '<option value="">— 可选 —</option>' + codes.map(c => `<option value="${c}">${c}</option>`).join('');
        dcEl.value = opt.dataset.micDefaultcode || '';
      }
    }
    // 自动填入 MIC 的默认方法
    const methodEl = card.querySelector('.ip-method');
    if (methodEl && opt.dataset.micMethod) {
      // 尝试匹配方法名到方法ID
      const methodName = opt.dataset.micMethod;
      const availMethod = (typeof imData !== 'undefined' ? imData : []).filter(m => m.status === 'active');
      const found = availMethod.find(m => m.name === methodName);
      if (found) methodEl.value = found.id;
    }
  },

  // ---- 工序类型变更 ----
  onOpTypeChange(radio) {
    const opIdx = parseInt(radio.dataset.opIdx);
    this.formOps[opIdx].opType = radio.value;
    this.formOps[opIdx].opTypeName = radio.value === 'sampling' ? '取样' : '检验';
    // 切换类型后重建表格和特性区
    this.rebuildOpSection();
  },

  // ---- 添加/删除工序 ----
  addOperation() {
    const newNum = ipGenOpNum(this.formOps);
    this.formOps.push({
      opNum: newNum, opType:'inspection', opTypeName:'检验',
      workCenter:'WC-LAB-01', workCenterName:'理化实验室',
      description:'', samplingPlan:'', chars:[]
    });
    this.rebuildOpSection();
  },

  removeOperation(idx) {
    if (this.formOps.length <= 1) { alert('至少保留一道工序'); return; }
    this.formOps.splice(idx, 1);
    this.rebuildOpSection();
  },

  rebuildOpSection() {
    // 1. 重建表格体
    const tbody = document.getElementById('ipOpsContainer');
    if (!tbody) return;
    const ro = (this.editId === '' && this.editId !== null) ? '' : '';
    const wcOpts = ipWorkCenterOptions.map(w => `<option value="${w.value}">${w.label}</option>`).join('');
    const spOpts = ipSamplingOptions.map(s => `<option value="${s.value}">${s.label}</option>`).join('');
    // 选项（用于 chars 区）
    const fac = this.currentFactory;
    const availMic = (typeof micData !== 'undefined' ? micData : []).filter(m => m.factory === fac && m.status === 'active');
    const micOpts = availMic.map(m => `<option value="${m.id}" data-mic-type="${m.micType}" data-mic-unit="${m.unit||''}" data-mic-decimal="${m.decimal||0}" data-mic-method="${m.defaultMethod||''}" data-mic-codegroup="${m.codeGroup||''}" data-mic-defaultcode="${m.defaultCode||''}">${m.code}（${m.shortText}）</option>`).join('');
    const availMethod = (typeof imData !== 'undefined' ? imData : []).filter(m => m.status === 'active');
    const methodOpts = availMethod.map(m => `<option value="${m.id}">${m.code}（${m.name}）</option>`).join('');

    // 重建表格行
    tbody.innerHTML = this.formOps.map((op, oi) => this.buildOpRow(op, oi, ro, wcOpts, spOpts)).join('');

    // 重建检验特性区
    const charsArea = document.getElementById('ipCharsArea');
    if (charsArea) {
      charsArea.innerHTML = this.renderAllChars(ro, micOpts, methodOpts, spOpts);
    }

    // 绑定事件
    const bc = document.getElementById('modalBackdrop');
    if (!bc) return;
    bc.querySelectorAll('.ip-mic-select').forEach(sel => {
      sel.addEventListener('change', (e) => this.onMicChange(e.target));
    });
    bc.querySelectorAll('.ip-optype').forEach(radio => {
      radio.addEventListener('change', (e) => this.onOpTypeChange(e.target));
    });

    // 恢复表单选中值
    this.formOps.forEach((op, oi) => {
      const tr = tbody.querySelector(`tr[data-op-idx="${oi}"]`);
      if (!tr) return;
      const wcEl = tr.querySelector('.ip-wc');
      if (wcEl) wcEl.value = op.workCenter;
      const spEl = tr.querySelector('.ip-sp');
      if (spEl) spEl.value = op.samplingPlan || '';
      const descEl = tr.querySelector('.ip-opdesc');
      if (descEl) descEl.value = op.description || '';
    });
    // 恢复特性区选中值
    if (charsArea) {
      this.formOps.forEach((op, oi) => {
        (op.chars||[]).forEach((ch, ci) => {
          const charItem = charsArea.querySelector(`.ip-char-item[data-op-idx="${oi}"][data-char-idx="${ci}"]`);
          if (!charItem) return;
          const micEl = charItem.querySelector('.ip-mic-select');
          if (micEl) micEl.value = ch.micId || '';
          const methodEl = charItem.querySelector('.ip-method');
          if (methodEl) methodEl.value = ch.methodId || '';
          const charSpEl = charItem.querySelector('.ip-char-sp');
          if (charSpEl) charSpEl.value = ch.samplingPlan || '';
          const unitEl = charItem.querySelector('.ip-char-unit');
          if (unitEl) unitEl.value = ch.unit || '';
          const decEl = charItem.querySelector('.ip-char-decimal');
          if (decEl) decEl.value = ch.decimal || 0;
          const upperEl = charItem.querySelector('.ip-char-upper');
          if (upperEl) upperEl.value = ch.upperSpec || '';
          const lowerEl = charItem.querySelector('.ip-char-lower');
          if (lowerEl) lowerEl.value = ch.lowerSpec || '';
          const cgEl = charItem.querySelector('.ip-char-codegroup');
          if (cgEl) cgEl.value = ch.codeGroup || '';
          const dcEl = charItem.querySelector('.ip-char-defaultcode');
          if (dcEl) dcEl.value = ch.defaultCode || '';
        });
      });
    }
  },

  // ---- 添加/删除检验特性 ----
  addChar(opIdx) {
    if (!this.formOps[opIdx].chars) this.formOps[opIdx].chars = [];
    this.formOps[opIdx].chars.push({
      micId:'', micCode:'', micName:'', micType:'quantitative',
      methodId:'', methodCode:'', methodName:'',
      samplingPlan:'', samplingPlanName:'',
      unit:'', decimal:0, upperSpec:'', lowerSpec:'',
      codeGroup:'', defaultCode:''
    });
    this.rebuildOpSection();
  },

  removeChar(opIdx, charIdx) {
    this.formOps[opIdx].chars.splice(charIdx, 1);
    this.rebuildOpSection();
  },

  // ---- 物料变更 ----
  onMaterialChange() {
    const sel = document.getElementById('ipF_materialCode');
    const nameEl = document.getElementById('ipF_materialName');
    if (!sel || !nameEl) return;
    const opt = ipMaterialOptions.find(m => m.code === sel.value);
    nameEl.value = opt ? opt.name : '';
  },

  // ---- 用途变更 ----
  onPurposeChange() {
    const sel = document.getElementById('ipF_purposeCode');
    const nameEl = document.getElementById('ipF_purposeName');
    if (!sel || !nameEl) return;
    const opt = ipPurposeOptions.find(p => p.code === sel.value);
    nameEl.value = opt ? opt.name : '';
  },

  // ---- 收集表单数据 ----
  collectFormData() {
    const ops = [];
    const tbody = document.getElementById('ipOpsContainer');
    const charsArea = document.getElementById('ipCharsArea');
    if (!tbody) return ops;

    const rows = tbody.querySelectorAll('tr[data-op-idx]');
    rows.forEach((tr) => {
      const oi = parseInt(tr.dataset.opIdx);
      const opTypeRadio = tr.querySelector(`input[name="ipOpType_${oi}"]:checked`);
      const opType = opTypeRadio ? opTypeRadio.value : this.formOps[oi]?.opType || 'inspection';
      const wcEl = tr.querySelector('.ip-wc');
      const wcVal = wcEl ? wcEl.value : '';
      const wcObj = ipWorkCenterOptions.find(w => w.value === wcVal);
      const descEl = tr.querySelector('.ip-opdesc');
      const spEl = tr.querySelector('.ip-sp');
      const spVal = spEl ? spEl.value : '';
      const spObj = ipSamplingOptions.find(s => s.value === spVal);

      const chars = [];
      if (opType === 'inspection' && charsArea) {
        const charItems = charsArea.querySelectorAll(`.ip-char-item[data-op-idx="${oi}"]`);
        charItems.forEach((charItem) => {
          const micEl = charItem.querySelector('.ip-mic-select');
          const micVal = micEl ? micEl.value : '';
          const micObj = (typeof micData !== 'undefined' ? micData : []).find(m => m.id === micVal);
          const methodEl = charItem.querySelector('.ip-method');
          const methodVal = methodEl ? methodEl.value : '';
          const methodObj = (typeof imData !== 'undefined' ? imData : []).find(m => m.id === methodVal);
          const charSpEl = charItem.querySelector('.ip-char-sp');
          const charSpVal = charSpEl ? charSpEl.value : '';
          const charSpObj = ipSamplingOptions.find(s => s.value === charSpVal);
          const unitEl = charItem.querySelector('.ip-char-unit');
          const decEl = charItem.querySelector('.ip-char-decimal');
          const upperEl = charItem.querySelector('.ip-char-upper');
          const lowerEl = charItem.querySelector('.ip-char-lower');
          const cgEl = charItem.querySelector('.ip-char-codegroup');
          const dcEl = charItem.querySelector('.ip-char-defaultcode');

          if (!micVal) return;
          chars.push({
            micId: micVal,
            micCode: micObj ? micObj.code : '',
            micName: micObj ? micObj.shortText : '',
            micType: micObj ? micObj.micType : 'quantitative',
            methodId: methodVal,
            methodCode: methodObj ? methodObj.code : '',
            methodName: methodObj ? methodObj.name : '',
            samplingPlan: charSpVal,
            samplingPlanName: charSpObj ? charSpObj.label : '',
            unit: unitEl ? unitEl.value : '',
            decimal: decEl ? parseInt(decEl.value)||0 : 0,
            upperSpec: upperEl ? upperEl.value : '',
            lowerSpec: lowerEl ? lowerEl.value : '',
            codeGroup: cgEl ? cgEl.value : '',
            defaultCode: dcEl ? dcEl.value : ''
          });
        });
      }

      ops.push({
        opNum: String((ops.length + 1) * 10).padStart(4, '0'),
        opType: opType,
        opTypeName: opType === 'sampling' ? '取样' : '检验',
        workCenter: wcVal,
        workCenterName: wcObj ? wcObj.label : wcVal,
        description: descEl ? descEl.value : '',
        samplingPlan: spVal,
        samplingPlanName: spObj ? spObj.label : '',
        chars: chars
      });
    });
    return ops;
  },

  // ---- 保存 ----
  save() {
    const fac = this.currentFactory;
    const matCode = document.getElementById('ipF_materialCode')?.value || '';
    const purCode = document.getElementById('ipF_purposeCode')?.value || '';
    const statusRadio = document.querySelector('input[name="ipF_status"]:checked');
    const status = statusRadio ? statusRadio.value : 'active';

    // 校验抬头
    if (!matCode) { toast('请选择物料编码'); return; }
    if (!purCode) { toast('请选择用途代码'); return; }

    // 收集工序数据
    const ops = this.collectFormData();

    // 校验工序
    if (ops.length === 0) { toast('请至少添加一道工序'); return; }
    const hasSampling = ops.some(o => o.opType === 'sampling');
    const hasInspection = ops.some(o => o.opType === 'inspection');

    // 取样工序校验
    for (const o of ops) {
      if (o.opType === 'sampling' && !o.samplingPlan) {
        toast(`工序 ${o.opNum} 为取样类型，请选择取样方案`); return;
      }
    }

    // 检验工序必须有检验特性
    for (const o of ops) {
      if (o.opType === 'inspection' && o.chars.length === 0) {
        toast(`检验工序 ${o.opNum} 必须至少添加一个检验特性`); return;
      }
    }

    // 定量特性必须有上下限
    for (const o of ops) {
      for (const ch of (o.chars||[])) {
        if (ch.micType === 'quantitative') {
          if (!ch.upperSpec && !ch.lowerSpec) {
            toast(`工序 ${o.opNum} 中定量特性 "${ch.micName}" 必须至少填写上规格限或下规格限`); return;
          }
        }
      }
    }

    const matObj = ipMaterialOptions.find(m => m.code === matCode);
    const purObj = ipPurposeOptions.find(p => p.code === purCode);
    const facObj = ipFactoryOptions.find(f => f.value === fac);
    const now = new Date().toISOString().slice(0,10);

    if (this.editId) {
      // 编辑模式
      const idx = ipData.findIndex(m => m.id === this.editId);
      if (idx >= 0) {
        ipData[idx].materialCode = matCode;
        ipData[idx].materialName = matObj ? matObj.name : '';
        ipData[idx].purposeCode = purCode;
        ipData[idx].purposeName = purObj ? purObj.name : '';
        ipData[idx].status = status;
        ipData[idx].operations = ops;
        ipData[idx].changedDate = now;
      }
    } else {
      // 新建模式
      const planCode = ipGenPlanCode(fac);
      ipData.push({
        id: 'IP' + String(ipData.length + 1).padStart(3,'0'),
        code: planCode,
        factory: fac,
        factoryName: facObj ? facObj.label : fac,
        materialCode: matCode,
        materialName: matObj ? matObj.name : '',
        purposeCode: purCode,
        purposeName: purObj ? purObj.name : '',
        status: status,
        createdBy: (window.currentUser && window.currentUser.name) || '当前用户',
        createdDate: now,
        operations: ops
      });
    }

    const wasEdit = !!this.editId;
    this.closeModal();
    this.initFilters();
    this.renderTable();
    this.renderPagination();
    toast(wasEdit ? '检验计划修改成功' : '检验计划创建成功');
  },

  // ---- 停用/启用 ----
  toggleStatus(id) {
    const p = ipData.find(m => m.id === id);
    if (!p) return;
    if (p.status === 'active') {
      p.status = 'disabled';
      toast('已停用检验计划');
    } else if (p.status === 'disabled') {
      p.status = 'active';
      toast('已启用检验计划');
    }
    this.initFilters();
    this.renderTable();
    this.renderPagination();
  },

  // ---- 删除标记 ----
  markDelete(id) {
    if (!confirm('确定要删除此检验计划吗？删除后状态变为"已删除标记"，不可被新业务引用，但历史数据保留。')) return;
    const p = ipData.find(m => m.id === id);
    if (p) { p.status = 'deleted'; }
    this.initFilters();
    this.renderTable();
    this.renderPagination();
    toast('检验计划已删除');
  }
};
