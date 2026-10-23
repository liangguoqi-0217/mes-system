/* ==================== 目录类型管理（SAP QM Catalog） ====================
 * SAP 目录（QM-PT-BD-CAT）层级：目录类型 → 代码组 → 代码 → 选择集（工厂级）
 *   目录类型 TQ15/TQ15T（集团级）  代码组 QPGR/QPGT（集团级）
 *   代码     QPCD/QPCDT（集团级）  选择集 QPAM/QPAS（工厂级 plant-wide）
 *
 * 本页为只读清单：数据由后台定时从 SAP 导入（QS41/QS51），页面不提供任何写操作。
 * 导入范围：仅质量相关目录类型 1/2/3/5/6/8/9/E（SAP 标准 12 类中的 8 类，
 *   排除 PM 侧的 A 活动(PM) / B 对象零件 / C 损坏概览 / D 编码）。
 *
 * 权限：目录类型/代码组/代码为集团级，全员可见；选择集为工厂级，按用户工厂授权隔离。
 *   管理员可见全部工厂选择集，普通用户仅可见本厂选择集。
 *   隔离粒度采用「① 列级过滤」：一代码一行，目录所有代码均展示，
 *   选择集列只渲染当前用户有权限工厂的选择集，无则显示「—」。
 *   注：真实环境过滤必须在后端 SQL 完成，此处前端过滤仅用于原型演示。
 * ==================================================================== */

/* ---------- 常量：工厂 ---------- */
const DC_PLANTS = {
  '2001': '陕西步长制药',
  '2002': '山东丹红制药',
  '2003': '山东神州制药'
};

/* ---------- 常量：已导入的质量相关目录类型（SAP TQ15） ---------- */
const DC_CATALOG_TYPES = [
  { code: '1', text: '特性属性' },
  { code: '2', text: '任务' },
  { code: '3', text: '使用决策' },
  { code: '5', text: '原因' },
  { code: '6', text: '缺陷结果' },
  { code: '8', text: '活动（QM）' },
  { code: '9', text: '缺陷类型' },
  { code: 'E', text: '缺陷位置' }
];

/* ---------- Mock：代码组 + 代码（后台自 SAP 导入，导入的均为生效数据） ---------- */
const DC_GROUPS = [
  { type: '9', group: 'QM-DF-01', text: '片剂外观缺陷', codes: [
    ['001', '裂纹'], ['002', '黑点/斑点'], ['003', '变色'], ['004', '缺角/碎片'],
    ['005', '粘连'], ['006', '麻点'] ] },
  { type: '9', group: 'QM-DF-02', text: '含量与溶出缺陷', codes: [
    ['001', '含量偏低'], ['002', '含量偏高'], ['003', '溶出度不合格'],
    ['004', '含量均匀度超标'], ['005', '有关物质超标'] ] },
  { type: '9', group: 'QM-DF-03', text: '包装缺陷', codes: [
    ['001', '铝箔破损'], ['002', '批号漏印/错印'], ['003', '装量不足'],
    ['004', '说明书缺失'], ['005', '封口不严'] ] },
  { type: '9', group: 'QM-DF-04', text: '注射剂可见异物', codes: [
    ['001', '玻璃屑'], ['002', '纤维'], ['003', '白块'], ['004', '焦屑'] ] },
  { type: '9', group: 'QM-DF-05', text: '微生物缺陷', codes: [
    ['001', '菌落总数超标'], ['002', '检出控制菌'], ['003', '细菌内毒素超标'] ] },

  { type: '3', group: 'QM-UD-01', text: '使用决策（放行类）', codes: [
    ['A1', '放行'], ['A2', '让步接收'], ['A3', '返工'], ['A5', '报废/销毁'],
    ['A6', '降级使用'], ['A7', '重新加工'] ] },
  { type: '3', group: 'QM-UD-02', text: '使用决策（拒收类）', codes: [
    ['R1', '拒收退回供应商'], ['R2', '隔离待处理'], ['R3', '待复检'] ] },

  { type: '5', group: 'QM-CA-01', text: '设备类原因', codes: [
    ['001', '设备参数漂移'], ['002', '模具/冲头磨损'], ['003', '计量器具失准'] ] },
  { type: '5', group: 'QM-CA-02', text: '物料类原因', codes: [
    ['001', '原辅料含量波动'], ['002', '辅料批次差异'], ['003', '原料受潮结块'] ] },
  { type: '5', group: 'QM-CA-03', text: '人员与环境类原因', codes: [
    ['001', '操作未按SOP执行'], ['002', '培训不足'], ['003', '环境温湿度超标'], ['004', '清场不彻底'] ] },
  { type: '5', group: 'QM-CA-04', text: '工艺类原因', codes: [
    ['001', '工艺参数超出范围'], ['002', '混合时间不足'], ['003', '干燥温度异常'] ] },

  { type: 'E', group: 'QM-DL-01', text: '固体制剂缺陷位置', codes: [
    ['001', '片芯'], ['002', '包衣层'], ['003', '铝塑板'], ['004', '外箱'], ['005', '标签'] ] },
  { type: 'E', group: 'QM-DL-02', text: '注射剂缺陷位置', codes: [
    ['001', '安瓿瓶身'], ['002', '胶塞'], ['003', '瓶口'], ['004', '托盘包装'] ] },

  { type: '1', group: 'QM-AT-01', text: '外观属性', codes: [
    ['01', '符合规定'], ['02', '不符合规定'], ['03', '有裂纹'], ['04', '有斑点'] ] },
  { type: '1', group: 'QM-AT-02', text: '气味与味道属性', codes: [
    ['01', '无异味'], ['02', '有异臭'], ['03', '气味偏淡'] ] },

  { type: '2', group: 'QM-TK-01', text: '质量通知任务', codes: [
    ['001', '通知质量负责人'], ['002', '启动偏差调查'], ['003', '通知生产车间'],
    ['004', '通知供应商'], ['005', '隔离同批次产品'] ] },

  { type: '6', group: 'QM-DR-01', text: '不合格处置结果', codes: [
    ['001', '返工后合格'], ['002', '报废'], ['003', '降级销售'],
    ['004', '退回供应商'], ['005', '让步放行'] ] },

  { type: '8', group: 'QM-AC-01', text: '纠正与预防措施', codes: [
    ['001', '调整工艺参数'], ['002', '更换模具/冲头'], ['003', '加强中控检测'],
    ['004', '修订SOP'], ['005', '追加培训'] ] }
];

/* ---------- Mock：选择集（工厂级，收录代码） ---------- */
const DC_SETS = [
  { plant: '2001', type: '9', set: 'SET-DF-TAB', text: '片剂车间缺陷集', members: [
    'QM-DF-01|001', 'QM-DF-01|002', 'QM-DF-01|003', 'QM-DF-01|004', 'QM-DF-01|005',
    'QM-DF-02|001', 'QM-DF-02|002', 'QM-DF-02|003', 'QM-DF-02|005',
    'QM-DF-03|001', 'QM-DF-03|002', 'QM-DF-03|003' ] },
  { plant: '2001', type: '9', set: 'SET-DF-PKG', text: '包装线缺陷集', members: [
    'QM-DF-03|001', 'QM-DF-03|002', 'QM-DF-03|003', 'QM-DF-03|004', 'QM-DF-03|005', 'QM-DF-01|004' ] },
  { plant: '2001', type: '3', set: 'SET-UD-01', text: '固体制剂使用决策', members: [
    'QM-UD-01|A1', 'QM-UD-01|A2', 'QM-UD-01|A3', 'QM-UD-01|A5', 'QM-UD-01|A6',
    'QM-UD-02|R2', 'QM-UD-02|R3' ] },
  { plant: '2001', type: 'E', set: 'SET-DL-01', text: '片剂缺陷位置集', members: [
    'QM-DL-01|001', 'QM-DL-01|002', 'QM-DL-01|003', 'QM-DL-01|004', 'QM-DL-01|005' ] },
  { plant: '2001', type: '5', set: 'SET-CA-TAB', text: '片剂偏差原因集', members: [
    'QM-CA-01|001', 'QM-CA-01|002', 'QM-CA-02|001', 'QM-CA-03|001', 'QM-CA-04|001', 'QM-CA-04|002' ] },

  { plant: '2002', type: '9', set: 'SET-DF-INJ', text: '注射剂缺陷集', members: [
    'QM-DF-04|001', 'QM-DF-04|002', 'QM-DF-04|003', 'QM-DF-04|004',
    'QM-DF-05|001', 'QM-DF-05|002', 'QM-DF-05|003', 'QM-DF-01|002', 'QM-DF-01|003' ] },
  { plant: '2002', type: '3', set: 'SET-UD-02', text: '注射剂使用决策', members: [
    'QM-UD-01|A1', 'QM-UD-01|A3', 'QM-UD-01|A5', 'QM-UD-02|R1', 'QM-UD-02|R2', 'QM-UD-02|R3' ] },
  { plant: '2002', type: 'E', set: 'SET-DL-02', text: '注射剂缺陷位置集', members: [
    'QM-DL-02|001', 'QM-DL-02|002', 'QM-DL-02|003', 'QM-DL-02|004' ] },

  { plant: '2003', type: '9', set: 'SET-DF-MIC', text: '微生物缺陷集', members: [
    'QM-DF-05|001', 'QM-DF-05|002', 'QM-DF-05|003', 'QM-DF-02|005' ] },
  { plant: '2003', type: '5', set: 'SET-CA-01', text: '偏差原因集', members: [
    'QM-CA-01|001', 'QM-CA-03|001', 'QM-CA-03|003', 'QM-CA-03|004' ] },
  { plant: '2003', type: '8', set: 'SET-AC-01', text: 'CAPA活动集', members: [
    'QM-AC-01|001', 'QM-AC-01|003', 'QM-AC-01|004', 'QM-AC-01|005' ] }
];

/* ---------- 展开为扁平行：一代码一条 ---------- */
const DC_CODES = (function () {
  const typeText = {};
  DC_CATALOG_TYPES.forEach(t => { typeText[t.code] = t.text; });

  // 选择集成员反查：目录类型|代码组|代码 -> [{plant,set,setText}]
  const belong = {};
  DC_SETS.forEach(s => {
    s.members.forEach(m => {
      const parts = m.split('|');
      const key = s.type + '|' + parts[0] + '|' + parts[1];
      (belong[key] = belong[key] || []).push({ plant: s.plant, set: s.set, setText: s.text });
    });
  });

  const rows = [];
  DC_GROUPS.forEach(g => {
    g.codes.forEach(c => {
      const key = g.type + '|' + g.group + '|' + c[0];
      rows.push({
        id: key,
        catalogType: g.type,
        catalogTypeText: typeText[g.type] || '',
        codeGroup: g.group,
        codeGroupText: g.text,
        code: c[0],
        codeText: c[1],
        selectedSets: belong[key] || []
      });
    });
  });
  return rows;
})();

/* ---------- 页面对象 ---------- */
const DefectCode = {
  page: 1,
  pageSize: 20,
  filtered: [],
  moreOpen: false,

  /* ==================== 权限 ==================== */

  isAdmin() {
    return (window.currentUserId === 'admin') || (window.currentUserRole === 'admin');
  },

  // 当前用户所属工厂
  userFactory() { return (window.currentUser && window.currentUser.factory) || '2001'; },

  // 当前可见工厂（管理员：全部或筛选指定；普通用户：仅本厂）
  visiblePlants() {
    if (this.isAdmin()) {
      const p = this._val('dcPlant');
      return p ? [p] : Object.keys(DC_PLANTS);
    }
    return [this.userFactory()];
  },

  // 当前视角可见的选择集（供下拉与统计用）
  visibleSets() {
    const plants = this.visiblePlants();
    return DC_SETS.filter(s => plants.indexOf(s.plant) !== -1);
  },

  /* ==================== 渲染 ==================== */

  render() {
    this.page = 1;
    this.filtered = [];
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <!-- 标题栏 -->
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-shrink:0;flex-wrap:wrap;">
          <div>
            <div style="font-size:18px;font-weight:700;">目录类型管理</div>
            <div style="font-size:13px;opacity:0.85;">查询质量相关的目录与代码</div>
          </div>
        </div>

        <div id="dcFilterBar" style="flex-shrink:0;"></div>

        <style>
          #dcTableWrapper { scrollbar-width: thin; scrollbar-color: rgba(203,213,225,0.6) transparent; }
          #dcTableWrapper::-webkit-scrollbar { width: 6px; height: 0; }
          #dcTableWrapper::-webkit-scrollbar-thumb { background: rgba(203,213,225,0.6); border-radius: 3px; }
          #dcTableWrapper::-webkit-scrollbar-track { background: transparent; }
          .dc-chip { display:inline-block;background:#f1f5f9;color:#1E3A5F;border:1px solid #e2e8f0;border-radius:4px;padding:2px 8px;font-size:11px;margin:2px 6px 2px 0;white-space:nowrap;line-height:1.6; }
          /* 目录网格：全边框 + 层级分隔线，便于看清 目录类型 → 代码组 → 代码 的归属关系 */
          #dcTableWrapper .data-table { border-collapse: collapse; }
          #dcTableWrapper .data-table th,
          #dcTableWrapper .data-table td { border: 1px solid #e5e7eb; }
          #dcTableWrapper .data-table tr.dc-group-start td { border-top: 1px solid #cbd5e1; }
          #dcTableWrapper .data-table tr.dc-type-start td { border-top: 2px solid #94a3b8; }
        </style>
        <div class="table-wrapper" id="dcTableWrapper" style="flex:1;overflow:auto;width:100%;min-width:0;"></div>
        <div id="dcPagination" style="flex-shrink:0;"></div>
      </div>`;
  },

  init() {
    this.renderFilterBar();
    if (window.QueryVariant) {
      QueryVariant.mount('defect-code');
      QueryVariant.restore('defect-code');
      QueryVariant.bindRecent('defect-code');
    }
    this.renderTable();
    this.renderPagination();
  },

  refresh() {
    this.page = 1;
    this.renderTable();
    this.renderPagination();
    toast('数据已刷新');
  },

  /* ==================== 筛选栏 ==================== */

  renderFilterBar() {
    const el = document.getElementById('dcFilterBar');
    if (!el) return;

    const typeOpts = DC_CATALOG_TYPES
      .map(t => `<option value="${t.code}">${t.code} ${t.text}</option>`).join('');
    const groupOpts = DC_GROUPS
      .map(g => `<option value="${g.group}">${g.group} ${g.text}</option>`).join('');

    // 选择集下拉仅列本视角可见的选择集（权限过滤）
    const setOpts = this.visibleSets()
      .map(s => `<option value="${s.plant}|${s.set}">${s.plant} ${s.set} ${s.text}</option>`).join('');

    // 工厂：管理员可选全部/指定；普通用户锁定本厂（只读）
    const plants = this.isAdmin() ? Object.keys(DC_PLANTS) : [this.userFactory()];
    const plantOpts = this.isAdmin()
      ? `<option value="">全部工厂</option>` + plants.map(p => `<option value="${p}">${p} ${DC_PLANTS[p]}</option>`).join('')
      : plants.map(p => `<option value="${p}" selected>${p} ${DC_PLANTS[p]}</option>`).join('');

    el.innerHTML = `
      <div class="filter-bar" style="flex-wrap:wrap;">
        <div class="filter-group"><label>工厂</label><select id="dcPlant" ${this.isAdmin() ? '' : 'disabled'}>${plantOpts}</select></div>
        <div class="filter-group"><label>目录类型</label><select id="dcCatalogType"><option value="">全部</option>${typeOpts}</select></div>
        <div class="filter-group"><label>代码组</label><select id="dcCodeGroup"><option value="">全部</option>${groupOpts}</select></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="DefectCode.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="DefectCode.exportData()">导出</button>
          <button class="btn btn-secondary btn-sm" onclick="DefectCode.refresh()">刷新</button>
          <button class="btn btn-secondary btn-sm" onclick="DefectCode.resetFilter()">重置</button>
          <button class="btn btn-secondary btn-sm" id="dcMoreBtn" onclick="DefectCode.toggleMore()">${this.moreOpen ? '收起 ▴' : '更多条件 ▾'}</button>
        </div>
        <div id="dcMoreBar" style="display:${this.moreOpen ? 'flex' : 'none'};flex-wrap:wrap;gap:12px;width:100%;padding:0;border:none;background:transparent;">
          <div class="filter-group"><label>代码 / 代码描述</label><input type="text" id="dcKeyword" placeholder="如 001 或 裂纹"></div>
          <div class="filter-group"><label>代码组描述</label><input type="text" id="dcGroupDesc" placeholder="如 外观"></div>
          <div class="filter-group"><label>选择集</label><select id="dcSelectedSet"><option value="">全部</option>${setOpts}</select></div>
        </div>
      </div>`;
  },

  toggleMore() {
    this.moreOpen = !this.moreOpen;
    const bar = document.getElementById('dcMoreBar');
    if (bar) bar.style.display = this.moreOpen ? 'flex' : 'none';
    const btn = document.getElementById('dcMoreBtn');
    if (btn) btn.textContent = this.moreOpen ? '收起 ▴' : '更多条件 ▾';
  },

  _val(id) {
    const e = document.getElementById(id);
    return e ? String(e.value || '').trim() : '';
  },

  search() {
    this.page = 1;
    this.renderTable();
    this.renderPagination();
    if (window.QueryVariant) {
      QueryVariant.saveAuto('defect-code');
      QueryVariant.recordUsed('defect-code');
    }
  },

  resetFilter() {
    ['dcCatalogType', 'dcCodeGroup', 'dcKeyword', 'dcGroupDesc', 'dcSelectedSet'].forEach(id => {
      const e = document.getElementById(id); if (e) e.value = '';
    });
    const pl = document.getElementById('dcPlant');
    if (pl && this.isAdmin()) pl.value = '';
    this.search();
    if (window.QueryVariant) QueryVariant.resetSelection('defect-code');
  },

  /* ==================== 表格 ==================== */

  // 某代码在当前视角下可见的选择集
  _visibleSetsOf(r) {
    const plants = this.visiblePlants();
    return (r.selectedSets || []).filter(s => plants.indexOf(s.plant) !== -1);
  },

  // 基础行：一代码一行，选择集列只带当前用户有权查看的部分
  // 排序：目录类型（SAP 定义顺序）→ 代码组 → 代码，保证相同值相邻，供合并单元格使用
  _baseRows() {
    const order = {};
    DC_CATALOG_TYPES.forEach((t, i) => { order[t.code] = i; });
    return DC_CODES
      .map(r => Object.assign({}, r, { _sets: this._visibleSetsOf(r) }))
      .sort(function (a, b) {
        const oa = order[a.catalogType] == null ? 99 : order[a.catalogType];
        const ob = order[b.catalogType] == null ? 99 : order[b.catalogType];
        if (oa !== ob) return oa - ob;
        if (a.codeGroup !== b.codeGroup) return a.codeGroup < b.codeGroup ? -1 : 1;
        return a.code < b.code ? -1 : (a.code > b.code ? 1 : 0);
      });
  },

  renderTable() {
    const type = this._val('dcCatalogType');
    const group = this._val('dcCodeGroup');
    const kw = this._val('dcKeyword').toLowerCase();
    const setKey = this._val('dcSelectedSet');
    const groupDesc = this._val('dcGroupDesc').toLowerCase();

    this.filtered = this._baseRows().filter(r => {
      if (type && r.catalogType !== type) return false;
      if (group && r.codeGroup !== group) return false;
      if (groupDesc && r.codeGroupText.toLowerCase().indexOf(groupDesc) === -1) return false;
      if (kw && r.code.toLowerCase().indexOf(kw) === -1 &&
          r.codeText.toLowerCase().indexOf(kw) === -1) return false;
      if (setKey && !r._sets.some(s => (s.plant + '|' + s.set) === setKey)) return false;
      return true;
    });

    const totalPages = Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
    if (this.page > totalPages) this.page = totalPages;
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);

    const el = document.getElementById('dcTableWrapper');
    if (!el) return;

    const head = `
      <tr>
        <th style="width:56px;">序号</th>
        <th style="width:90px;">目录类型</th>
        <th style="width:130px;">目录类型描述</th>
        <th style="width:120px;">代码组</th>
        <th style="width:180px;">代码组描述</th>
        <th style="width:90px;">代码</th>
        <th style="width:200px;">代码描述</th>
        <th style="min-width:280px;">选择集</th>
      </tr>`;

    const spans = this._mergeSpans(page);
    const body = page.length
      ? page.map((r, i) => this.renderRow(r, start + i + 1, spans[i])).join('')
      : `<tr><td colspan="8" class="empty-cell">暂无符合条件的目录记录</td></tr>`;

    el.innerHTML = `<table class="data-table"><thead>${head}</thead><tbody>${body}</tbody></table>`;
  },

  // 当前页内计算合并跨度：目录类型 / 目录类型描述 / 代码组 / 代码组描述 四列
  // 返回每行的 {type, typeText, group, groupText}；为 0 表示该格被上方合并掉，不输出 td
  // 注：合并在当前页内进行，跨页不合并（分页表格的常规做法）
  _mergeSpans(rows) {
    const cols = [
      { k: 'type', get: function (r) { return r.catalogType; } },
      { k: 'typeText', get: function (r) { return r.catalogTypeText; } },
      { k: 'group', get: function (r) { return r.codeGroup; } },
      { k: 'groupText', get: function (r) { return r.codeGroupText; } }
    ];
    const spans = rows.map(function () { return {}; });
    cols.forEach(function (col) {
      let i = 0;
      while (i < rows.length) {
        let j = i + 1;
        while (j < rows.length && col.get(rows[j]) === col.get(rows[i])) j++;
        spans[i][col.k] = j - i;
        for (let m = i + 1; m < j; m++) spans[m][col.k] = 0;
        i = j;
      }
    });
    return spans;
  },

  renderRow(r, idx, span) {
    span = span || {};
    const cell = function (n, html, style) {
      if (n === 0) return '';                       // 被上方合并，不渲染
      if (n == null) n = 1;
      const rs = n > 1 ? ` rowspan="${n}"` : '';
      return `<td${rs} style="${style || ''}vertical-align:middle;">${html}</td>`;
    };

    // 选择集单元格：只渲染本视角可见的选择集，超过 3 个折叠为 +N
    let setCell;
    if (r._sets.length === 0) {
      setCell = `<span style="color:var(--text-muted);">—</span>`;
    } else {
      const shown = r._sets.slice(0, 3).map(s => this._chip(s)).join('');
      const rest = r._sets.length - 3;
      setCell = shown + (rest > 0 ? `<span class="dc-chip" title="${esc(r._sets.slice(3).map(s => s.plant + ' ' + s.set + ' ' + s.setText).join('；'))}">+${rest}</span>` : '');
    }

    // 层级分隔：新目录类型 / 新代码组的起始行加粗分隔线
    const cls = (span.group > 0 ? ' dc-group-start' : '') + (span.type > 0 ? ' dc-type-start' : '');

    return `<tr class="${cls.trim()}">
      <td>${idx}</td>
      ${cell(span.type, esc(r.catalogType), 'font-family:monospace;font-size:12px;font-weight:600;')}
      ${cell(span.typeText, esc(r.catalogTypeText), '')}
      ${cell(span.group, esc(r.codeGroup), 'font-family:monospace;font-size:12px;font-weight:600;')}
      ${cell(span.groupText, esc(r.codeGroupText), '')}
      <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(r.code)}</td>
      <td>${esc(r.codeText)}</td>
      <td>${setCell}</td>
    </tr>`;
  },

  _chip(s) {
    if (!s) return '';
    return `<span class="dc-chip">${esc(s.plant)} · ${esc(s.set)} ${esc(s.setText)}</span>`;
  },

  renderPagination() {
    const el = document.getElementById('dcPagination');
    if (!el) return;
    const total = this.filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    el.innerHTML = `<div class="pagination">
      <span style="color:var(--text-muted);font-size:12px;margin-right:12px;">共 ${total} 行</span>
      <button class="pagination-btn" onclick="DefectCode.prevPage()" ${this.page <= 1 ? 'disabled' : ''}>‹</button>
      <span class="pagination-info">第 ${this.page} / ${totalPages} 页</span>
      <button class="pagination-btn" onclick="DefectCode.nextPage()" ${this.page >= totalPages ? 'disabled' : ''}>›</button>
      <select class="page-size-select" onchange="DefectCode.changePageSize(this.value)">
        ${[20, 50, 100].map(s => `<option value="${s}" ${s === this.pageSize ? 'selected' : ''}>${s}条/页</option>`).join('')}
      </select>
    </div>`;
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); this.renderPagination(); } },
  nextPage() {
    const totalPages = Math.ceil(Math.max(this.filtered.length, 1) / this.pageSize);
    if (this.page < totalPages) { this.page++; this.renderTable(); this.renderPagination(); }
  },
  changePageSize(v) { this.pageSize = Number(v); this.page = 1; this.renderTable(); this.renderPagination(); },

  /* ==================== 导出（只读：仅导出当前查询结果） ==================== */

  exportData() {
    if (!this.filtered || this.filtered.length === 0) return toast('无数据可导出');
    const head = ['序号', '目录类型', '目录类型描述', '代码组', '代码组描述', '代码', '代码描述', '选择集（工厂）'];
    const lines = [head.join(',')];
    this.filtered.forEach((r, i) => {
      const sets = (r._sets || []).map(s => s.plant + ' ' + s.set + ' ' + s.setText).join(' / ');
      const cells = [String(i + 1), r.catalogType, r.catalogTypeText, r.codeGroup, r.codeGroupText,
        r.code, r.codeText, sets];
      lines.push(cells.map(v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"').join(','));
    });
    const csv = '\uFEFF' + lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '目录类型管理_' + new Date().toISOString().substring(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('导出成功（共 ' + this.filtered.length + ' 行）');
  }
};

/* ===== 查询变式注册（通用模块 V3/js/core/query-variant.js）===== */
if (window.QueryVariant) {
  QueryVariant.register({
    pageId: 'defect-code',
    fields: ['dcPlant', 'dcCatalogType', 'dcCodeGroup', 'dcKeyword', 'dcGroupDesc', 'dcSelectedSet'],
    textFields: ['dcKeyword', 'dcGroupDesc'],
    labels: {
      dcPlant: '工厂', dcCatalogType: '目录类型', dcCodeGroup: '代码组',
      dcKeyword: '代码/代码描述', dcGroupDesc: '代码组描述', dcSelectedSet: '选择集'
    },
    onApply: function () { DefectCode.search(); }
  });
}
