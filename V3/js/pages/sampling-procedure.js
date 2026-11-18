/**
 * 取样程序（SamplingProcedure）— 质量管理 → 质量主数据 → 取样程序
 *
 * 设计口径（2026-11-17 定稿）：
 * - 以「取样程序」为主对象（SAP 中被检验特性引用的挂靠单元），取样方案降级为程序内嵌的规则子表，不单独建页；
 * - 取样类型三种：固定样本数 / 100% 检验 / 引用取样方案（√N+1 规则）；
 * - 百分比取样等 SAP 深水配置不承接（药企不按百分比取样）；
 * - 消费者：主检验特性（挂靠点）→ 检验计划带出 → 检验批取样弹窗带默认取样量（固定样本数类型可带数）；
 * - 验证类（混合均一性）对应 100% 检验模式：一个请验单 N 袋样、每袋独立标签、逐袋取样逐袋出结果，
 *   点位对应关系维护在验证方案中，对应 SAP 物理样品检验点。
 *
 * √N+1 规则：n = ⌊√N⌋ + 1（N = 批总包装件数，N ≤ 3 全取）——原辅料按件取样的行业惯例。
 */

const SamplingProcedure = {

  // ==================== Mock 数据 ====================
  data: [
    {
      id:'SP001', code:'2001-SPC-01', name:'原辅料取样程序', factory:'2001',
      type:'scheme', sampleQty:'', unit:'件',
      scheme:{
        code:'2001-SPH-01', name:'原辅料取样方案（√N+1）',
        basis:'《药品生产质量管理规范》取样原则',
        ruleDesc:'按批总包装件数 N 计算取样件数 n = ⌊√N⌋ + 1；N ≤ 3 件时全取。随机抽取，抽件混合后按四分法缩分至检验量。',
        rows:[
          { from:'1',   to:'3',    sample:'全取' },
          { from:'4',   to:'8',    sample:'3 件' },
          { from:'9',   to:'15',   sample:'4 件' },
          { from:'16',  to:'24',   sample:'5 件' },
          { from:'25',  to:'35',   sample:'6 件' },
          { from:'36',  to:'48',   sample:'7 件' },
          { from:'49',  to:'63',   sample:'8 件' },
          { from:'64',  to:'80',   sample:'9 件' },
          { from:'81',  to:'99',   sample:'10 件' },
          { from:'100', to:'以上',  sample:'11 件起' }
        ]
      },
      micRefs:[
        { code:'2001-MIC-002', name:'水分含量' },
        { code:'2001-MIC-004', name:'含量（主成分）' }
      ],
      status:'active', version:'V2', createdBy:'张工', createdDate:'2025-03-05',
      remark:'适用于原辅料入库检验。取样后 331 过账（消耗性），留样部分 311 转储留样库位。'
    },
    {
      id:'SP002', code:'2001-SPC-02', name:'成品口服液取样程序', factory:'2001',
      type:'fixed', sampleQty:'9', unit:'瓶', scheme:null,
      micRefs:[ { code:'2001-MIC-003', name:'外观' } ],
      status:'active', version:'V1', createdBy:'张工', createdDate:'2025-02-20',
      remark:'每批随机取 9 瓶：3 瓶全检、3 瓶留样、3 瓶仲裁备用（参照咳露口服液口径：留样量 = 全检量 2 倍）。'
    },
    {
      id:'SP003', code:'2001-SPC-03', name:'微生物限度取样程序', factory:'2001',
      type:'fixed', sampleQty:'5', unit:'袋', scheme:null,
      micRefs:[ { code:'2003-MIC-001', name:'微生物限度' } ],
      status:'active', version:'V1', createdBy:'李经理', createdDate:'2025-04-10',
      remark:'无菌区域取样由车间质量员按 SOP-202 执行，样袋单独密封转运至微生物实验室。'
    },
    {
      id:'SP004', code:'2002-SPC-01', name:'验证取样程序（混合均一性）', factory:'2002',
      type:'full', sampleQty:'', unit:'袋', scheme:null,
      micRefs:[],
      status:'active', version:'V1', createdBy:'王质检', createdDate:'2025-06-12',
      remark:'工艺验证/混合均一性批：一个请验单 N 袋样、每袋独立标签（内部批号 + 样品序号），逐袋取样、逐袋出结果；点位对应关系维护在验证方案中。对应 SAP 物理样品检验点模式。'
    },
    {
      id:'SP005', code:'2001-SPC-04', name:'破坏性检验取样程序', factory:'2001',
      type:'fixed', sampleQty:'3', unit:'件', scheme:null,
      micRefs:[],
      status:'disabled', version:'V1', createdBy:'张工', createdDate:'2025-01-15',
      remark:'硬度、崩解等破坏性项目：取 3 件合并检验，样本量按最小检验需求给定。已停用，仅保留历史引用。'
    }
  ],

  typeMeta: {
    fixed:  { label:'固定样本数',   cls:'badge-blue' },
    full:   { label:'100% 检验',   cls:'badge-purple' },
    scheme: { label:'引用取样方案', cls:'badge-green' }
  },

  statusMeta: {
    active:   { label:'启用', cls:'badge-green' },
    disabled: { label:'停用', cls:'badge-gray' }
  },

  // ==================== 对外接口 ====================
  // 按编号取启用的取样程序（供 MIC / 检验计划 / 取样弹窗带默认值）
  findByCode(code) {
    return this.data.find(p => p.code === code && p.status === 'active') || null;
  },

  // √N+1 计算（原辅料按件取样的核心规则，预览卡用）
  calcSampleQty(n) {
    if (!Number.isFinite(n) || n <= 0) return null;
    if (n <= 3) return n;                 // N ≤ 3 全取
    return Math.floor(Math.sqrt(n)) + 1;  // n = ⌊√N⌋ + 1
  },

  // ==================== 页面骨架 ====================
  render() {
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">取样程序</div>
            <div style="font-size:13px;opacity:0.8;">取样的挂靠单元：固定样本数 / 100% 检验 / 引用取样方案（√N+1）· 供检验特性引用并带出默认取样量</div>
          </div>
          <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
            onclick="SamplingProcedure.openEdit('')">+ 新增程序</button>
        </div>
        <div id="spFilterBar" style="flex-shrink:0;"></div>
        <div class="table-wrapper" id="spTableWrapper" style="flex:1;overflow:auto;width:100%;min-width:0;"></div>
      </div>`;
  },

  init() {
    this.renderFilterBar();
    if (window.QueryVariant) {
      QueryVariant.mount('sampling-procedure');
      QueryVariant.restore('sampling-procedure');
      QueryVariant.bindRecent('sampling-procedure');
    }
    this.renderTable();
  },

  _val(id) {
    const e = document.getElementById(id);
    return e ? String(e.value || '').trim() : '';
  },

  search() { this.renderTable(); },

  renderFilterBar() {
    const el = document.getElementById('spFilterBar');
    if (!el) return;
    const typeOpts = Object.entries(this.typeMeta).map(([k, m]) => `<option value="${k}">${m.label}</option>`).join('');
    el.innerHTML = `<div class="filter-bar">
      <div class="filter-group"><label>取样类型</label><select id="spFType"><option value="">全部</option>${typeOpts}</select></div>
      <div class="filter-group"><label>状态</label><select id="spFStatus">
        <option value="">全部</option><option value="active">启用</option><option value="disabled">停用</option>
      </select></div>
      <div class="filter-group"><label>程序</label><input type="text" id="spFKeyword" placeholder="编号或名称"></div>
      ${FilterActions.render({ pageId: 'sampling-procedure', scope: 'SamplingProcedure' })}
    </div>`;
  },

  filtered() {
    const type = this._val('spFType');
    const status = this._val('spFStatus');
    const kw = this._val('spFKeyword').toLowerCase();
    return this.data.filter(p => {
      if (type && p.type !== type) return false;
      if (status && p.status !== status) return false;
      if (kw && (p.code + ' ' + p.name).toLowerCase().indexOf(kw) === -1) return false;
      return true;
    });
  },

  renderTable() {
    const el = document.getElementById('spTableWrapper');
    if (!el) return;
    const list = this.filtered();
    const planCell = p => {
      if (p.type === 'fixed') return `n = ${esc(p.sampleQty)} ${esc(p.unit || '')}`;
      if (p.type === 'full') return '每袋取样（逐袋）';
      return `${esc(p.scheme ? p.scheme.name : '')}`;
    };
    el.innerHTML = `<table class="data-table" style="min-width:1050px;">
      <thead><tr>
        <th style="width:130px;">程序编号</th>
        <th style="width:200px;">程序名称</th>
        <th style="width:110px;">取样类型</th>
        <th style="width:220px;">方案 / 样本量</th>
        <th style="width:90px;">引用MIC</th>
        <th style="width:70px;">版本</th>
        <th style="width:70px;">状态</th>
        <th style="width:100px;">维护人</th>
        <th style="width:70px;">操作</th>
      </tr></thead>
      <tbody>${list.length ? list.map(p => this.renderRow(p)).join('')
        : '<tr><td colspan="9" class="empty-cell">暂无符合条件的取样程序</td></tr>'}</tbody>
    </table>`;
  },

  renderRow(p) {
    const tm = this.typeMeta[p.type] || {};
    const sm = this.statusMeta[p.status] || {};
    return `<tr>
      <td style="font-family:monospace;font-size:12px;">${esc(p.code)}</td>
      <td>${esc(p.name)}</td>
      <td><span class="badge ${tm.cls || 'badge-gray'}">${esc(tm.label || p.type)}</span></td>
      <td style="font-size:12px;">${this._planSummary(p)}</td>
      <td style="font-size:12px;">${(p.micRefs || []).length ? (p.micRefs.length + ' 个') : '—'}</td>
      <td style="font-size:12px;">${esc(p.version)}</td>
      <td><span class="badge ${sm.cls || 'badge-gray'}">${esc(sm.label || p.status)}</span></td>
      <td style="font-size:12px;">${esc(p.createdBy)}</td>
      <td><div class="table-actions">
        <button class="btn btn-blue btn-sm" onclick="SamplingProcedure.openView('${p.id}')">查看</button>
      </div></td>
    </tr>`;
  },

  _planSummary(p) {
    if (p.type === 'fixed') return `固定样本量 n = ${esc(p.sampleQty)} ${esc(p.unit || '')}`;
    if (p.type === 'full') return '100% 检验：每袋独立取样、逐袋出结果';
    if (p.scheme) return `${esc(p.scheme.name)} · 规则 ${esc((p.scheme.ruleDesc || '').slice(0, 18))}…`;
    return '—';
  },

  // ==================== 共用表单：查看=只读 / 新建·编辑=可填，界面完全一致 ====================
  buildForm(p, readonly) {
    const dis = readonly ? ' disabled' : '';
    const v = k => (p ? p[k] : '');
    const sc = (p && p.scheme) || { code:'', name:'', basis:'', ruleDesc:'', rows:[{from:'',to:'',sample:''}] };
    const type = p ? p.type : 'fixed';
    const pId = p ? p.id : '';

    const typeRadio = (val, label) => `
      <label style="display:inline-flex;align-items:center;gap:4px;font-weight:600;cursor:pointer;">
        <input type="radio" name="spType" value="${val}" ${type === val ? 'checked' : ''} ${dis}
          onchange="SamplingProcedure._onTypeChange('${val}')"> ${label}
      </label>`;

    const schemeRowsHtml = (sc.rows || []).map(r => `
      <div class="sp-scheme-row" style="display:grid;grid-template-columns:1fr 1fr 1fr ${readonly ? '0px' : '60px'};gap:10px;margin-bottom:8px;">
        <input type="text" class="spRowFrom" value="${esc(r.from)}" placeholder="批量从（件）"${dis}>
        <input type="text" class="spRowTo" value="${esc(r.to)}" placeholder="批量到（件）"${dis}>
        <input type="text" class="spRowSample" value="${esc(r.sample)}" placeholder="取样件数，如 3 件 / 全取"${dis}>
        ${readonly ? '' : '<button class="btn-danger btn-xs" onclick="this.parentNode.remove()">删除</button>'}
      </div>`).join('');

    // 抬头元信息：查看/新建都展示，位置一致（新建时留空）
    const statusOpts = ['active','disabled'].map(s =>
      `<option value="${s}" ${p && p.status === s ? 'selected' : (!p && s === 'active' ? 'selected' : '')}>${this.statusMeta[s].label}</option>`).join('');

    // 反向引用：两个模式同一位置展示
    const micChips = ((p && p.micRefs) || []).length
      ? p.micRefs.map(m => `<span class="clean-tag" style="font-size:12px;">${esc(m.code)} ${esc(m.name)}</span>`).join('')
      : `<span style="font-size:12px;color:var(--text-muted);">${readonly ? '暂无 MIC 引用（验证类取样挂在验证方案，不挂 MIC）' : '保存后可与主检验特性建立引用'}</span>`;

    return `
      <div style="padding:4px 0;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;">
          <div class="form-group"><label>程序编号 <span class="req">*</span></label>
            <input type="text" id="spECode" value="${esc(v('code'))}" placeholder="如 2001-SPC-05"${dis}></div>
          <div class="form-group"><label>程序名称 <span class="req">*</span></label>
            <input type="text" id="spEName" value="${esc(v('name'))}" placeholder="如 原辅料取样程序"${dis}></div>
          <div class="form-group"><label>状态</label><select id="spEStatus"${dis}>${statusOpts}</select></div>
          <div class="form-group"><label>工厂 / 版本</label>
            <input type="text" value="${esc(v('factory'))} · ${esc(v('version'))}" disabled></div>
          <div class="form-group"><label>维护人 / 日期</label>
            <input type="text" value="${esc(v('createdBy'))} · ${esc(v('createdDate'))}" disabled></div>
        </div>
        <div class="form-group" style="margin-top:4px;">
          <label>取样类型</label>
          <div style="display:flex;gap:20px;padding-top:6px;">
            ${typeRadio('fixed', '固定样本数')}
            ${typeRadio('full', '100% 检验')}
            ${typeRadio('scheme', '引用取样方案')}
          </div>
        </div>

        <div id="spSecFixed" style="display:none;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;">
            <div class="form-group"><label>固定样本量</label><input type="text" id="spEQty" value="${esc(v('sampleQty'))}" placeholder="如 9"${dis}></div>
            <div class="form-group"><label>单位</label><input type="text" id="spEUnit" value="${esc(v('unit'))}" placeholder="如 瓶 / 袋 / 件"${dis}></div>
          </div>
        </div>

        <div id="spSecFull" style="display:none;">
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;font-size:12px;color:var(--text-secondary);">
            100% 检验：不设样本量字段，每袋独立取样、逐袋出结果（工艺验证 / 混合均一性场景，对应 SAP 物理样品检验点）。
          </div>
        </div>

        <div id="spSecScheme" style="display:none;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;">
            <div class="form-group"><label>方案编号</label><input type="text" id="spEScCode" value="${esc(sc.code)}" placeholder="如 2001-SPH-01"${dis}></div>
            <div class="form-group"><label>方案名称</label><input type="text" id="spEScName" value="${esc(sc.name)}" placeholder="如 原辅料取样方案（√N+1）"${dis}></div>
            <div class="form-group"><label>依据标准</label><input type="text" id="spEScBasis" value="${esc(sc.basis)}" placeholder="如 《药品生产质量管理规范》取样原则"${dis}></div>
            <div class="form-group"><label>规则说明</label><input type="text" id="spEScRule" value="${esc(sc.ruleDesc)}" placeholder="如 n = ⌊√N⌋ + 1；N ≤ 3 全取"${dis}></div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin:8px 0 6px;">
            <label style="font-size:13px;font-weight:600;">批量区间 → 取样件数</label>
            ${readonly ? '' : '<button class="btn-add btn-xs" onclick="SamplingProcedure._addSchemeRow()">+ 添加区间</button>'}
          </div>
          <div id="spSchemeRows">${schemeRowsHtml}</div>
          <div style="margin-top:14px;padding:12px 14px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span style="font-size:13px;font-weight:600;color:#1e40af;">√N+1 实时预览</span>
            <span style="font-size:13px;color:var(--text-secondary);">批量件数 N =</span>
            <input type="number" id="spPrevN" min="1" placeholder="如 40" style="width:110px;"
              oninput="SamplingProcedure._preview('${pId}')">
            <span id="spPrevOut" style="font-size:13px;color:var(--text-muted);">输入批量后自动计算取样件数</span>
          </div>
        </div>

        <div style="margin-top:14px;">
          <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:6px;">被以下主检验特性引用（计划引用 MIC 时自动带出）</div>
          <div class="clean-tag-row">${micChips}</div>
        </div>

        <div class="form-group full" style="margin-top:8px;">
          <label>程序说明</label>
          <textarea id="spERemark" rows="3" style="width:100%;" placeholder="取样方式、转运要求、与留样规则的关系等"${dis}>${esc(v('remark') || '')}</textarea>
        </div>
      </div>`;
  },

  // ==================== 查看弹窗（与新建同一套界面，仅字段只读） ====================
  openView(id) {
    const p = this.data.find(x => x.id === id);
    if (!p) return;
    showModal(`查看取样程序 · ${esc(p.code)}`, this.buildForm(p, true), [
      { text: '编辑', cls: 'btn-primary', action: () => { SamplingProcedure.openEdit(p.id); } },
      { text: '关闭', cls: 'btn-secondary', action: closeModal }
    ], 'modal-xl');
  },

  // √N+1 实时预览（引用方案类型）
  _preview(id) {
    const p = this.data.find(x => x.id === id);
    const out = document.getElementById('spPrevOut');
    if (!out) return;
    const raw = this._val('spPrevN');
    if (!raw) { out.textContent = '输入批量后自动计算取样件数'; out.style.color = 'var(--text-muted)'; return; }
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n) || n <= 0) {
      out.textContent = '请输入有效的批量件数';
      out.style.color = '#dc2626';
      return;
    }
    const q = this.calcSampleQty(n);
    let hit = '';
    if (p && p.scheme && p.scheme.rows) {
      const row = p.scheme.rows.find(r => {
        const from = parseInt(r.from, 10) || 0;
        if (r.to === '以上') return n >= from;
        const to = parseInt(r.to, 10);
        return n >= from && n <= to;
      });
      if (row) hit = `，命中区间 ${row.from} ~ ${row.to}`;
    }
    out.innerHTML = n <= 3
      ? `<b style="color:var(--primary);">全取 ${n} 件</b>（N ≤ 3 全取${hit}）`
      : `<b style="color:var(--primary);">取样 ${q} 件</b>（⌊√${n}⌋ + 1 = ${q}${hit}）`;
    out.style.color = 'var(--text)';
  },

  // ==================== 新增 / 编辑（与查看同一套界面） ====================
  openEdit(id) {
    const p = id ? this.data.find(x => x.id === id) : null;
    showModal(p ? '编辑取样程序' : '新增取样程序', this.buildForm(p, false), [
      { text: '取消', cls: 'btn-secondary', action: () => {
          if (p) { SamplingProcedure.openView(p.id); } else { closeModal(); }
        } },
      { text: '保存', cls: 'btn-primary', action: () => { SamplingProcedure._save(p ? p.id : ''); } }
    ], 'modal-xl');

    this._onTypeChange(p ? p.type : 'fixed');
  },

  _onTypeChange(t) {
    const show = (id, on) => { const e = document.getElementById(id); if (e) e.style.display = on ? '' : 'none'; };
    show('spSecFixed', t === 'fixed');
    show('spSecFull', t === 'full');
    show('spSecScheme', t === 'scheme');
  },

  _addSchemeRow() {
    const box = document.getElementById('spSchemeRows');
    if (!box) return;
    const div = document.createElement('div');
    div.className = 'sp-scheme-row';
    div.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr 60px;gap:10px;margin-bottom:8px;';
    div.innerHTML = `
      <input type="text" class="spRowFrom" placeholder="批量从（件）">
      <input type="text" class="spRowTo" placeholder="批量到（件）">
      <input type="text" class="spRowSample" placeholder="取样件数，如 3 件 / 全取">
      <button class="btn-danger btn-xs" onclick="this.parentNode.remove()">删除</button>`;
    box.appendChild(div);
  },

  _save(id) {
    const val = id2 => ((document.getElementById(id2) || {}).value || '').trim();
    const code = val('spECode');
    const name = val('spEName');
    const typeEl = document.querySelector('input[name="spType"]:checked');
    const type = typeEl ? typeEl.value : 'fixed';

    if (!code) return toast('请填写程序编号');
    if (!name) return toast('请填写程序名称');

    let scheme = null;
    if (type === 'scheme') {
      const rows = [];
      document.querySelectorAll('#spSchemeRows .sp-scheme-row').forEach(row => {
        const from = (row.querySelector('.spRowFrom') || {}).value || '';
        const to = (row.querySelector('.spRowTo') || {}).value || '';
        const sample = (row.querySelector('.spRowSample') || {}).value || '';
        if (from || to || sample) rows.push({ from: from.trim(), to: to.trim(), sample: sample.trim() });
      });
      if (!rows.length) return toast('引用取样方案类型至少需要一条批量区间');
      scheme = {
        code: val('spEScCode'), name: val('spEScName'),
        basis: val('spEScBasis'), ruleDesc: val('spEScRule'), rows
      };
    }

    const fields = {
      code, name, type,
      status: val('spEStatus') || 'active',
      sampleQty: type === 'fixed' ? val('spEQty') : '',
      unit: val('spEUnit'),
      scheme,
      remark: val('spERemark')
    };

    if (id) {
      const p = this.data.find(x => x.id === id);
      if (!p) return;
      Object.assign(p, fields);
      toast('取样程序已更新');
    } else {
      this.data.push({
        id: 'SP' + String(this.data.length + 1).padStart(3, '0'),
        factory: '2001',
        micRefs: [],
        status: 'active',
        version: 'V1',
        createdBy: (window.currentUser && window.currentUser.name) || '当前用户',
        createdDate: new Date().toISOString().slice(0, 10),
        ...fields
      });
      toast('取样程序已创建');
    }

    this.renderTable();
    this.openView(id || this.data[this.data.length - 1].id);
  }
};
