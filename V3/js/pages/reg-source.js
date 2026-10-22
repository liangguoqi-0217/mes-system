/* ==================== 法规情报 · 法规源管理 ====================
 * 决定「盯哪些站点、按什么频率、谁来盯」——这是整个模块唯一真正的前置条件，
 * 源清单不对，后面采集与判定都是空转。
 *
 * 处理口径：
 *   1. 优先官方订阅 / RSS，其次网页采集，最后才人工登记。
 *   2. 采集频率贴近人工浏览强度，不突破站点技术防护措施；
 *      站点一旦声明反爬或 robots 变更，立即停用该源并转人工登记。
 *   3. 每个源必须有业务 Owner，不能挂在 IT 名下。
 * 数据源：js/pages/reg-data.js
 * ================================================================ */

const RegSource = {
  page: 1, pageSize: 20,
  filtered: [],

  render() {
    return `
    <div class="ri-wrap">
      <div class="ri-header">
        <div>
          <h2>法规源管理</h2>
          <div class="ri-header-sub">维护需要持续监测的站点与栏目、采集方式与频率，以及每个源的业务责任人</div>
        </div>
        <div class="ri-header-actions">
          <button class="btn btn-secondary btn-sm" onclick="RegSource.checkAll()">健康检查</button>
          <button class="btn btn-primary btn-sm" onclick="RegSource.openCreate()">+ 新增法规源</button>
        </div>
      </div>

      <div class="ri-toolbar">
        <div class="ri-toolbar-left">
          <span class="list-count" id="regSrcCount">共 0 个监测源</span>
          <span style="font-size:12px;color:var(--text-muted);">启用中 ${RI_SOURCES.filter(s => s.status === '启用').length} 个 · 停用 ${RI_SOURCES.filter(s => s.status === '停用').length} 个</span>
        </div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="RegSource.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="RegSource.exportList()">导出</button>
          <button class="btn btn-secondary btn-sm" onclick="RegSource.refresh()">刷新</button>
          <button class="btn btn-secondary btn-sm" onclick="RegSource.reset()">重置</button>
        </div>
      </div>

      <div class="ri-body">
        <div class="ri-filter">
          <div class="ri-filter-title">筛选条件</div>
          <div class="ri-fgroup">
            <label>关键词</label>
            <input id="sKeyword" placeholder="源编码 / 名称 / 栏目">
          </div>
          <div class="ri-fgroup">
            <label>采集方式</label>
            <select id="sMethod">
              <option value="">全部</option>
              <option value="RSS订阅">RSS订阅</option>
              <option value="网页采集">网页采集</option>
              <option value="人工登记">人工登记</option>
            </select>
          </div>
          <div class="ri-fgroup">
            <label>健康状态</label>
            <select id="sHealth">
              <option value="">全部</option>
              <option value="正常">正常</option>
              <option value="待核对">待核对</option>
              <option value="异常">异常</option>
            </select>
          </div>
          <div class="ri-fgroup">
            <label>启用状态</label>
            <select id="sStatus">
              <option value="">全部</option>
              <option value="启用">启用</option>
              <option value="停用">停用</option>
            </select>
          </div>
          <div class="ri-fgroup">
            <label>业务责任人</label>
            <select id="sOwner">
              <option value="">全部</option>
              ${[...new Set(RI_SOURCES.map(s => s.owner))].map(o => '<option value="' + esc(o) + '">' + esc(o) + '</option>').join('')}
            </select>
          </div>
          <div class="ri-fgroup">
            <label>主题标签</label>
            <select id="sTopic">
              <option value="">全部</option>
              ${RI_TOPICS.map(t => '<option value="' + esc(t) + '">' + esc(t) + '</option>').join('')}
            </select>
          </div>
          <div class="ri-note" style="margin-top:14px;">
            采集合规边界：低频访问、不绕过技术防护措施、不转售官方原始数据。发现站点声明反爬或 robots 变更，立即停用并转人工登记。
          </div>
        </div>

        <div class="ri-content">
          <div class="ri-scroll" id="regSrcScroll">
            <div class="ri-stat-row" id="regSrcStats"></div>
            <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;">
              <div class="ri-table-wrap" style="max-height:calc(100vh - 320px);">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th style="width:120px;">源编码</th>
                      <th style="min-width:230px;">站点 / 栏目</th>
                      <th style="width:150px;">主题标签</th>
                      <th style="width:100px;">采集方式</th>
                      <th style="width:110px;">采集频率</th>
                      <th style="width:130px;">最近采集</th>
                      <th style="width:130px;">下次计划</th>
                      <th style="width:80px;">本月</th>
                      <th style="width:90px;">健康状态</th>
                      <th style="width:120px;">业务责任人</th>
                      <th style="width:70px;">状态</th>
                      <th style="width:80px;">操作</th>
                    </tr>
                  </thead>
                  <tbody id="regSrcBody"></tbody>
                </table>
              </div>
            </div>
          </div>
          <div id="regSrcPager"></div>
        </div>
      </div>
    </div>`;
  },

  init() {
    QueryVariant.mount('reg-source');
    QueryVariant.bindRecent('reg-source');
    QueryVariant.restore('reg-source');
    this.renderTable();
  },

  readFilter() {
    const v = id => { const e = document.getElementById(id); return e ? e.value : ''; };
    return { keyword: v('sKeyword'), method: v('sMethod'), health: v('sHealth'), status: v('sStatus'), owner: v('sOwner'), topic: v('sTopic') };
  },

  search() {
    this.page = 1;
    QueryVariant.saveAuto('reg-source');
    QueryVariant.recordUsed('reg-source');
    this.renderTable();
  },

  reset() {
    ['sKeyword', 'sMethod', 'sHealth', 'sStatus', 'sOwner', 'sTopic'].forEach(id => {
      const e = document.getElementById(id); if (e) e.value = '';
    });
    QueryVariant.resetSelection('reg-source');
    this.page = 1;
    this.renderTable();
    toast('筛选条件已重置');
  },

  refresh() { this.renderTable(); toast('法规源清单已刷新'); },
  exportList() { toast('已导出法规源清单（演示：实际导出由后台生成）'); },

  applyFilter() {
    const f = this.readFilter();
    const kw = (f.keyword || '').trim().toLowerCase();
    const rows = RI_SOURCES.filter(s => {
      if (f.method && s.method !== f.method) return false;
      if (f.health && s.health !== f.health) return false;
      if (f.status && s.status !== f.status) return false;
      if (f.owner && s.owner !== f.owner) return false;
      if (f.topic && (s.topics || []).indexOf(f.topic) < 0) return false;
      if (kw && (s.code + ' ' + s.name + ' ' + s.column).toLowerCase().indexOf(kw) < 0) return false;
      return true;
    });
    this.filtered = rows;
    return rows;
  },

  totalRows() { return this.filtered.length; },
  prevPage() { Pagination.go(this, -1); },
  nextPage() { Pagination.go(this, 1); },
  changePageSize(v) { Pagination.setSize(this, v); },

  renderTable() {
    const rows = this.applyFilter();
    const pg = Pagination.slice(rows, this.page, this.pageSize);
    this.page = pg.stat.page;

    this.renderStats();

    const body = document.getElementById('regSrcBody');
    if (body) {
      body.innerHTML = pg.rows.length ? pg.rows.map(s => `
        <tr>
          <td class="ri-mono">${esc(s.code)}</td>
          <td>
            <div style="font-weight:600;color:var(--text);cursor:pointer;line-height:1.5;" onclick="RegSource.openView('${s.id}')">${esc(s.name)}</div>
            <div style="font-size:11.5px;color:var(--text-muted);margin-top:2px;">${esc(s.column)}</div>
          </td>
          <td><div class="ri-chips">${(s.topics || []).map(t => '<span class="ri-chip ri-chip-hl">' + esc(t) + '</span>').join('')}</div></td>
          <td>${esc(s.method)}</td>
          <td style="font-size:12px;">${esc(s.frequency)}</td>
          <td class="ri-mono">${esc(s.lastRun)}</td>
          <td class="ri-mono">${esc(s.nextRun || '—')}</td>
          <td><span style="font-weight:700;color:var(--primary);">${s.monthCount}</span></td>
          <td>${RegIntel.healthBadge(s.health)}</td>
          <td style="font-size:12px;">${esc(s.owner)}</td>
          <td>${s.status === '启用' ? '<span class="badge badge-green">启用</span>' : '<span class="badge badge-gray">停用</span>'}</td>
          <td><div class="table-actions"><button class="btn btn-blue btn-sm" onclick="RegSource.openView('${s.id}')">查看</button></div></td>
        </tr>`).join('') : '<tr><td colspan="12" style="text-align:center;padding:36px;color:var(--text-muted);">没有符合条件的法规源</td></tr>';
    }

    const cnt = document.getElementById('regSrcCount');
    if (cnt) cnt.textContent = '共 ' + rows.length + ' 个监测源';
    Pagination.render('regSrcPager', 'RegSource', pg.stat, { total: rows.length, unit: '个' });
  },

  renderStats() {
    const el = document.getElementById('regSrcStats');
    if (!el) return;
    const total = RI_SOURCES.length;
    const on = RI_SOURCES.filter(s => s.status === '启用').length;
    const warn = RI_SOURCES.filter(s => s.health === '待核对' || s.health === '异常').length;
    const month = RI_SOURCES.reduce((sum, s) => sum + (s.monthCount || 0), 0);
    const rss = RI_SOURCES.filter(s => s.method === 'RSS订阅').length;
    el.innerHTML = [
      { label: '监测源总数', value: total, cls: '', hint: '启用 ' + on + ' 个 / 停用 ' + (total - on) + ' 个' },
      { label: '本月采集条数', value: month, cls: '', hint: '去重前原始抓取量' },
      { label: '需人工核对', value: warn, cls: warn ? 'danger' : '', hint: '抓取异常或待确认' },
      { label: '官方订阅覆盖率', value: Math.round(rss / total * 100) + '%', cls: '', hint: 'RSS 优先，网页采集为补充' }
    ].map(s => `
      <div class="ri-stat">
        <div class="ri-stat-label">${esc(s.label)}</div>
        <div class="ri-stat-value ${s.cls}">${esc(String(s.value))}</div>
        <div class="ri-stat-hint">${esc(s.hint)}</div>
      </div>`).join('');
  },

  /* ==================== 查看 / 编辑 ==================== */
  formHtml(s) {
    const ed = !!s;
    return `
      <div class="ri-inline-form">
        <div class="form-group">
          <label>源编码</label>
          <input id="scCode" value="${ed ? esc(s.code) : ''}" placeholder="如 NMPA-FGWJ" ${ed ? '' : ''}>
        </div>
        <div class="form-group">
          <label>站点类型</label>
          <select id="scType">
            ${['药监官方网站', '地方药监', '标准机构', '政府门户', '国际组织', '行业协会'].map(t =>
      '<option value="' + esc(t) + '"' + (ed && s.siteType === t ? ' selected' : '') + '>' + esc(t) + '</option>').join('')}
          </select>
        </div>
        <div class="form-group full">
          <label>站点 / 栏目名称<span class="req">*</span></label>
          <input id="scName" value="${ed ? esc(s.name) : ''}" placeholder="如 国家药品监督管理局 · 法规文件">
        </div>
        <div class="form-group full">
          <label>栏目页地址<span class="req">*</span></label>
          <input id="scUrl" value="${ed ? esc(s.url) : ''}" placeholder="https://...">
        </div>
        <div class="form-group">
          <label>采集方式</label>
          <select id="scMethod">
            ${['RSS订阅', '网页采集', '人工登记'].map(t =>
      '<option value="' + esc(t) + '"' + (ed && s.method === t ? ' selected' : '') + '>' + esc(t) + '</option>').join('')}
          </select>
        </div>
        <div class="form-group">
          <label>采集频率</label>
          <select id="scFreq">
            ${['每日 08:00', '每周一 09:00', '每周二 09:00', '每周三 09:00', '每周五 09:00', '每月初核对'].map(t =>
      '<option value="' + esc(t) + '"' + (ed && s.frequency === t ? ' selected' : '') + '>' + esc(t) + '</option>').join('')}
          </select>
        </div>
        <div class="form-group">
          <label>业务责任人<span class="req">*</span></label>
          <input id="scOwner" value="${ed ? esc(s.owner) : ''}" placeholder="如 QA · 李敏，须为业务条线人员">
        </div>
        <div class="form-group">
          <label>启用状态</label>
          <select id="scStatus">
            <option value="启用" ${ed && s.status === '启用' ? 'selected' : ''}>启用</option>
            <option value="停用" ${ed && s.status === '停用' ? 'selected' : ''}>停用</option>
          </select>
        </div>
        <div class="form-group full">
          <label>关注主题标签（逗号分隔）</label>
          <input id="scTopics" value="${ed ? esc((s.topics || []).join('、')) : ''}" placeholder="如 GMP管理,生产管理">
        </div>
        <div class="form-group full">
          <label>采集策略与备注</label>
          <textarea id="scNote" rows="3">${ed ? esc(s.note) : ''}</textarea>
        </div>
      </div>`;
  },

  readForm() {
    const v = i => { const e = document.getElementById(i); return e ? String(e.value).trim() : ''; };
    return {
      code: v('scCode'), siteType: v('scType'), name: v('scName'), url: v('scUrl'),
      method: v('scMethod'), frequency: v('scFreq'), owner: v('scOwner'), status: v('scStatus'),
      column: v('scColumn'), note: v('scNote'),
      topics: v('scTopics').split(/[、,，]/).map(s => s.trim()).filter(Boolean)
    };
  },

  openView(id) {
    const s = RI_SOURCES.find(x => x.id === id);
    if (!s) return;
    const counts = RI_DOCS.filter(d => d.sourceId === id).length;
    const body = `
      <div style="display:grid;grid-template-columns:1.1fr 1fr;gap:26px;">
        <div>
          <div class="ri-section">
            <div class="ri-section-title">源信息</div>
            <div class="ri-kv-grid" style="grid-template-columns:repeat(auto-fill,minmax(190px,1fr));">
              <dl class="ri-kv"><dt>源编码</dt><dd class="ri-mono">${esc(s.code)}</dd></dl>
              <dl class="ri-kv"><dt>站点类型</dt><dd>${esc(s.siteType)}</dd></dl>
              <dl class="ri-kv"><dt>采集方式</dt><dd>${esc(s.method)}</dd></dl>
              <dl class="ri-kv"><dt>采集频率</dt><dd>${esc(s.frequency)}</dd></dl>
              <dl class="ri-kv"><dt>最近采集</dt><dd class="ri-mono">${esc(s.lastRun)}</dd></dl>
              <dl class="ri-kv"><dt>下次计划</dt><dd class="ri-mono">${esc(s.nextRun || '—')}</dd></dl>
              <dl class="ri-kv"><dt>本月采集</dt><dd>${s.monthCount} 条</dd></dl>
              <dl class="ri-kv"><dt>健康状态</dt><dd>${RegIntel.healthBadge(s.health)}</dd></dl>
              <dl class="ri-kv"><dt>业务责任人</dt><dd>${esc(s.owner)}</dd></dl>
              <dl class="ri-kv"><dt>启用状态</dt><dd>${s.status === '启用' ? '<span class="badge badge-green">启用</span>' : '<span class="badge badge-gray">停用</span>'}</dd></dl>
              <dl class="ri-kv" style="grid-column:1/-1;"><dt>栏目页地址</dt><dd><a class="ri-link" href="javascript:void(0)">${esc(s.url)}</a></dd></dl>
              <dl class="ri-kv" style="grid-column:1/-1;"><dt>关注主题</dt><dd>${(s.topics || []).map(t => '<span class="ri-chip ri-chip-hl" style="margin-right:4px;">' + esc(t) + '</span>').join('') || '—'}</dd></dl>
              <dl class="ri-kv" style="grid-column:1/-1;"><dt>采集策略与备注</dt><dd style="font-weight:400;font-size:13px;line-height:1.8;">${esc(s.note)}</dd></dl>
            </div>
          </div>
        </div>
        <div>
          <div class="ri-section">
            <div class="ri-section-title">采集日志（最近 ${Math.min(5, s.logs.length)} 次）</div>
            <table class="data-table data-table-compact" style="min-width:0;">
              <thead><tr><th style="width:130px;">时间</th><th style="width:80px;">结果</th><th style="width:70px;">条数</th><th>说明</th></tr></thead>
              <tbody>
                ${s.logs.slice(0, 5).map(l => `
                  <tr>
                    <td class="ri-mono">${esc(l.at)}</td>
                    <td>${l.result === '成功' ? '<span class="badge badge-green">成功</span>' : '<span class="badge badge-red">' + esc(l.result) + '</span>'}</td>
                    <td>${l.count}</td>
                    <td style="font-size:12px;color:var(--text-secondary);">${esc(l.note)}</td>
                  </tr>`).join('') || ''}
              </tbody>
            </table>
            <div class="ri-note ri-note-info" style="margin-top:14px;">
              该源已进入法规清单 <strong>${counts}</strong> 条，其中待判定 ${RI_DOCS.filter(d => d.sourceId === id && d.status === 'pending').length} 条。
            </div>
          </div>
        </div>
      </div>`;

    const footer = [
      { text: s.status === '启用' ? '停用此源' : '启用此源', cls: 'btn-secondary', action: new Function("RegSource.toggleStatus('" + id + "')") },
      { text: '立即采集', cls: 'btn-secondary', action: new Function("RegSource.runOnce('" + id + "')") },
      { text: '编辑', cls: 'btn-primary', action: new Function("RegSource.openEdit('" + id + "')") },
      { text: '关闭', cls: 'btn-secondary', action: closeModal }
    ];
    showModal('法规源详情 · ' + esc(s.code), body, footer, 'modal-xxl');
  },

  openEdit(id) {
    const s = RI_SOURCES.find(x => x.id === id);
    if (!s) return;
    const body = this.formHtml(s)
      + '<input type="hidden" id="scColumn" value="' + esc(s.column) + '">';
    showModal('编辑法规源 · ' + esc(s.code), body, [
      { text: '取消', cls: 'btn-secondary', action: new Function("RegSource.openView('" + id + "')") },
      { text: '保存', cls: 'btn-primary', action: new Function("RegSource.saveEdit('" + id + "')") }
    ], 'modal-lg');
  },

  saveEdit(id) {
    const s = RI_SOURCES.find(x => x.id === id);
    if (!s) return;
    const f = this.readForm();
    if (!f.name) { toast('站点/栏目名称为必填项'); return; }
    if (!f.owner) { toast('必须指定业务责任人，法规源不能挂在 IT 名下'); return; }
    Object.assign(s, {
      code: f.code || s.code, siteType: f.siteType, name: f.name, url: f.url,
      column: f.column || s.column, method: f.method, frequency: f.frequency,
      topics: f.topics, owner: f.owner, status: f.status, note: f.note
    });
    closeModal();
    toast('法规源已保存：' + s.name);
    this.renderTable();
  },

  openCreate() {
    const body = this.formHtml(null)
      + '<input type="hidden" id="scColumn" value="">'
      + '<div class="ri-note" style="margin-top:16px;">新增前请确认：该栏目是否为官方发布渠道、是否存在官方订阅方式、业务责任人是否已确认。</div>';
    showModal('新增法规源', body, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '保存', cls: 'btn-primary', action: new Function("RegSource.saveCreate()") }
    ], 'modal-lg');
  },

  saveCreate() {
    const f = this.readForm();
    if (!f.name || !f.url) { toast('站点/栏目名称与栏目页地址为必填项'); return; }
    if (!f.owner) { toast('必须指定业务责任人，法规源不能挂在 IT 名下'); return; }
    const maxId = RI_SOURCES.reduce((m, s) => {
      const n = parseInt(String(s.id).replace(/\D/g, ''), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    const now = this.nowStr();
    RI_SOURCES.push({
      id: 'SRC-' + String(maxId + 1).padStart(3, '0'), code: f.code || ('SRC' + String(maxId + 1).padStart(3, '0')),
      name: f.name, siteType: f.siteType, column: f.column || '待补充', url: f.url,
      method: f.method, frequency: f.frequency, topics: f.topics, owner: f.owner,
      status: f.status, health: '待核对', lastRun: '—', nextRun: '—', monthCount: 0, thisCount: 0,
      note: f.note || '新增源，待首次运行后确认健康状态。',
      logs: [{ at: now, result: '成功', count: 0, note: '源登记，等待首次采集' }]
    });
    closeModal();
    toast('已新增法规源：' + f.name + '\n建议先执行一次「立即采集」验证抓取结果');
    this.renderTable();
  },

  toggleStatus(id) {
    const s = RI_SOURCES.find(x => x.id === id);
    if (!s) return;
    s.status = s.status === '启用' ? '停用' : '启用';
    s.nextRun = s.status === '启用' ? '待调度' : '—';
    s.health = s.status === '启用' ? '待核对' : '已停用';
    closeModal();
    toast((s.status === '启用' ? '已启用：' : '已停用：') + s.name);
    this.renderTable();
  },

  runOnce(id) {
    const s = RI_SOURCES.find(x => x.id === id);
    if (!s) return;
    if (s.status !== '启用') { toast('该源已停用，请先在详情中启用'); return; }
    const n = Math.floor(Math.random() * 4);
    s.lastRun = this.nowStr();
    s.monthCount += n;
    s.logs.unshift({ at: s.lastRun, result: n ? '成功' : '异常', count: n, note: n ? '手工触发采集，去重后入清单 ' + n + ' 条' : '未解析到列表节点，请核对选择器' });
    if (!n) s.health = '待核对';
    toast('采集完成：' + s.name + '\n本次抓取 ' + n + ' 条，去重后进入法规清单');
    this.renderTable();
  },

  checkAll() {
    const bad = RI_SOURCES.filter(s => s.status === '启用' && s.health !== '正常');
    if (!bad.length) { toast('所有启用的法规源健康检查通过'); return; }
    toast('发现 ' + bad.length + ' 个源需要核对：\n' + bad.map(s => '· ' + s.code + ' ' + s.name + '（' + s.health + '）').join('\n'));
  },

  nowStr() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
};

QueryVariant.register({
  pageId: 'reg-source',
  fields: ['sMethod', 'sHealth', 'sStatus', 'sOwner', 'sTopic'],
  textFields: ['sKeyword'],
  labels: {
    sKeyword: '关键词', sMethod: '采集方式', sHealth: '健康状态',
    sStatus: '启用状态', sOwner: '业务责任人', sTopic: '主题标签'
  },
  onApply: function () { RegSource.search(); },
  onRestore: function () { RegSource.search(); }
});
