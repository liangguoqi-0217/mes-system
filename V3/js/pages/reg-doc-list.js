/* ==================== 法规情报 · 法规清单 ====================
 * 采集结果的总入口：
 *   左侧 —— 筛选条件（数据来源 / 层级 / 状态 / 主题 / 发布区间 / 相关度）
 *   右侧 —— 统计条 + 卡片式法规流 + 分页
 *
 * 设计口径：
 *   1. 清单只做「感知」，不做「结论」；判定动作在查看弹窗内完成，由 RA/QA 签字负责。
 *   2. 行（卡片）操作只保留「查看」，下载、判定、分发等动作全部收进查看弹窗。
 *   3. AI 相关度只是排序建议，不得直接作为适用性结论；超期未判定的条目置顶并标红。
 * 数据源：js/pages/reg-data.js（RegIntel + RI_DOCS / RI_SOURCES）
 * ================================================================ */

const RegDocList = {
  page: 1, pageSize: 20,
  filtered: [],
  sortKey: 'date',

  /* ==================== 生命周期 ==================== */
  render() {
    return `
    <div class="ri-wrap">
      <div class="ri-header">
        <div>
          <h2>法规清单</h2>
          <div class="ri-header-sub">法规情报 · 每日自动采集去重，AI 初筛后由责任人做出适用性判定并分发闭环</div>
        </div>
        <div class="ri-header-actions">
          <button class="btn btn-secondary btn-sm" onclick="RegDocList.runCollection()">立即采集</button>
          <button class="btn btn-primary btn-sm" onclick="RegDocList.openManual()">+ 手工登记</button>
        </div>
      </div>

      <div class="ri-toolbar">
        <div class="ri-toolbar-left">
          <span class="list-count" id="regDocCount">共 0 条</span>
          <select id="regDocSort" onchange="RegDocList.changeSort(this.value)" style="padding:5px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:12px;">
            <option value="date" ${this.sortKey === 'date' ? 'selected' : ''}>按发布日期排序</option>
            <option value="score" ${this.sortKey === 'score' ? 'selected' : ''}>按 AI 相关度排序</option>
            <option value="due" ${this.sortKey === 'due' ? 'selected' : ''}>按判定时限排序</option>
          </select>
          <span style="font-size:12px;color:var(--text-muted);">采集任务：每日 08:00 / 08:10 · 最近一次 2026-10-22 08:10</span>
        </div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="RegDocList.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="RegDocList.exportList()">导出</button>
          <button class="btn btn-secondary btn-sm" onclick="RegDocList.refresh()">刷新</button>
          <button class="btn btn-secondary btn-sm" onclick="RegDocList.reset()">重置</button>
        </div>
      </div>

      <div class="ri-body">
        <div class="ri-filter">
          <div class="ri-filter-title">筛选条件</div>
          <div class="ri-fgroup">
            <label>关键词</label>
            <input id="fKeyword" placeholder="标题 / 文号 / 摘要">
          </div>
          <div class="ri-fgroup">
            <label>数据来源</label>
            <select id="fSource"><option value="">全部来源</option>${RI_SOURCES.map(s => '<option value="' + esc(s.id) + '">' + esc(s.name) + '</option>').join('')}</select>
          </div>
          <div class="ri-fgroup">
            <label>文件层级</label>
            <select id="fLevel"><option value="">全部层级</option>${RI_LEVELS.map(t => '<option value="' + esc(t) + '">' + esc(t) + '</option>').join('')}</select>
          </div>
          <div class="ri-fgroup">
            <label>处理状态</label>
            <select id="fStatus">
              <option value="">全部状态</option>
              <option value="pending">待判定</option>
              <option value="applicable">已判定·适用</option>
              <option value="na">已判定·不适用</option>
              <option value="distributed">已分发闭环</option>
              <option value="archived">已归档</option>
            </select>
          </div>
          <div class="ri-fgroup">
            <label>主题标签</label>
            <select id="fTopic"><option value="">全部主题</option>${RI_TOPICS.map(t => '<option value="' + esc(t) + '">' + esc(t) + '</option>').join('')}</select>
          </div>
          <div class="ri-fgroup">
            <label>发布日期（起）</label>
            <input type="date" id="fDateFrom">
          </div>
          <div class="ri-fgroup">
            <label>发布日期（止）</label>
            <input type="date" id="fDateTo">
          </div>
          <div class="ri-fgroup">
            <label>AI 相关度</label>
            <select id="fScore">
              <option value="0">全部</option>
              <option value="90">90 分以上（强相关）</option>
              <option value="80">80 分以上</option>
              <option value="60">60 分以上</option>
            </select>
          </div>
          <div class="ri-fgroup">
            <label>责任人</label>
            <select id="fOwner">
              <option value="">全部</option>
              <option value="未指派">未指派</option>
              <option value="QA · 李敏">QA · 李敏</option>
              <option value="注册部 · 孙宁">注册部 · 孙宁</option>
              <option value="QC · 张莉">QC · 张莉</option>
              <option value="EHS · 赵鹏">EHS · 赵鹏</option>
            </select>
          </div>
          <div class="ri-note ri-note-info" style="margin-top:14px;">
            AI 相关度仅为排序建议，适用性结论必须由 RA / QA 人工判定并签字，系统不自动给出合规结论。
          </div>
        </div>

        <div class="ri-content">
          <div class="ri-scroll" id="regDocScroll">
            <div class="ri-stat-row" id="regDocStats"></div>
            <div id="regDocCards"></div>
          </div>
          <div id="regDocPager"></div>
        </div>
      </div>
    </div>`;
  },

  init() {
    QueryVariant.mount('reg-doc-list');
    QueryVariant.bindRecent('reg-doc-list');
    QueryVariant.restore('reg-doc-list');
    this.renderTable();
  },

  /* ==================== 查询 / 分页 ==================== */
  readFilter() {
    const v = id => { const e = document.getElementById(id); return e ? e.value : ''; };
    return {
      keyword: v('fKeyword'), source: v('fSource'), level: v('fLevel'), status: v('fStatus'),
      topic: v('fTopic'), dateFrom: v('fDateFrom'), dateTo: v('fDateTo'),
      score: parseInt(v('fScore'), 10) || 0, owner: v('fOwner')
    };
  },

  search() {
    this.page = 1;
    QueryVariant.saveAuto('reg-doc-list');
    QueryVariant.recordUsed('reg-doc-list');
    this.renderTable();
  },

  reset() {
    ['fKeyword', 'fSource', 'fLevel', 'fStatus', 'fTopic', 'fDateFrom', 'fDateTo', 'fScore', 'fOwner']
      .forEach(id => { const e = document.getElementById(id); if (e) e.value = ''; });
    QueryVariant.resetSelection('reg-doc-list');
    this.page = 1;
    this.renderTable();
    toast('筛选条件已重置');
  },

  refresh() {
    this.renderTable();
    toast('清单已刷新');
  },

  exportList() {
    toast('已按当前筛选条件导出 Excel（演示：实际导出由后台生成）');
  },

  changeSort(k) { this.sortKey = k; this.page = 1; this.renderTable(); },

  applyFilter() {
    const f = this.readFilter();
    const kw = (f.keyword || '').trim().toLowerCase();
    let rows = RI_DOCS.filter(d => {
      if (f.source && d.sourceId !== f.source) return false;
      if (f.level && d.level !== f.level) return false;
      if (f.status && d.status !== f.status) return false;
      if (f.topic && (d.tags || []).indexOf(f.topic) < 0) return false;
      if (f.dateFrom && d.publishDate < f.dateFrom) return false;
      if (f.dateTo && d.publishDate > f.dateTo) return false;
      if (f.score && (d.aiScore || 0) < f.score) return false;
      if (f.owner && d.owner !== f.owner) return false;
      if (kw) {
        const hay = (d.title + ' ' + d.docNo + ' ' + d.summary + ' ' + (d.tags || []).join(' ')).toLowerCase();
        if (hay.indexOf(kw) < 0) return false;
      }
      return true;
    });

    rows.sort((a, b) => {
      // 待判定且超期的恒在最前
      const ao = RegIntel.isOverdue(a) ? 1 : 0, bo = RegIntel.isOverdue(b) ? 1 : 0;
      if (ao !== bo) return bo - ao;
      if (this.sortKey === 'score') return (b.aiScore || 0) - (a.aiScore || 0);
      if (this.sortKey === 'due') return String(a.dueDate || '9999').localeCompare(String(b.dueDate || '9999'));
      return String(b.publishDate).localeCompare(String(a.publishDate));
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

    this.renderStats(rows);

    const cards = document.getElementById('regDocCards');
    if (cards) {
      cards.innerHTML = pg.rows.length
        ? pg.rows.map(d => this.cardHtml(d)).join('')
        : '<div class="ri-empty"><div class="ri-empty-icon">📭</div>没有符合筛选条件的法规文件<br>换个条件，或点「立即采集」触发最新一轮监测</div>';
    }

    const cnt = document.getElementById('regDocCount');
    if (cnt) cnt.textContent = '共 ' + rows.length + ' 条';

    Pagination.render('regDocPager', 'RegDocList', pg.stat, { total: rows.length, unit: '条' });
  },

  renderStats(rows) {
    const el = document.getElementById('regDocStats');
    if (!el) return;
    const pending = rows.filter(d => d.status === 'pending').length;
    const overdue = rows.filter(d => RegIntel.isOverdue(d)).length;
    const applicable = rows.filter(d => d.status === 'applicable').length;
    const closed = rows.filter(d => d.status === 'distributed').length;
    el.innerHTML = [
      { label: '待判定', value: pending, cls: pending ? '' : '', hint: '需在时限内出具适用性结论' },
      { label: '判定逾期', value: overdue, cls: overdue ? 'danger' : '', hint: '已超过判定责任时限' },
      { label: '适用待闭环', value: applicable, cls: applicable ? 'warn' : '', hint: '已完成判定，待分发与回执' },
      { label: '已分发闭环', value: closed, cls: '', hint: '阅读与回执均已确认' }
    ].map(s => `
      <div class="ri-stat">
        <div class="ri-stat-label">${esc(s.label)}</div>
        <div class="ri-stat-value ${s.cls}">${s.value}</div>
        <div class="ri-stat-hint">${esc(s.hint)}</div>
      </div>`).join('');
  },

  cardHtml(d) {
    const over = RegIntel.isOverdue(d);
    const cls = over ? 'ri-card-overdue'
      : d.status === 'pending' ? 'ri-card-pending'
        : d.status === 'distributed' ? 'ri-card-done'
          : d.status === 'na' || d.status === 'archived' ? 'ri-card-na' : '';
    return `
    <div class="ri-card ${cls}">
      <div class="ri-card-head">
        <div style="min-width:0;">
          <div class="ri-card-title" onclick="RegDocList.openView('${d.id}')">${esc(d.title)}</div>
          <div class="ri-card-meta">
            <span class="ri-mono">${esc(d.docNo || '—')}</span>
            <span class="ri-chip">${esc(d.level)}</span>
            <span>${esc(RegIntel.sourceName(d.sourceId))}</span>
            <span>发布 ${esc(d.publishDate)}</span>
            ${d.deadline ? '<span>征集截止 <strong style="color:var(--danger);">' + esc(d.deadline) + '</strong></span>' : ''}
            ${d.effectiveDate ? '<span>生效 ' + esc(d.effectiveDate) + '</span>' : ''}
          </div>
        </div>
        ${RegIntel.scoreBlock(d.aiScore)}
      </div>

      <div class="ri-card-summary">${esc(d.summary)}</div>

      <div class="ri-chips" style="margin-top:9px;">
        ${(d.tags || []).map(t => '<span class="ri-chip ri-chip-hl">' + esc(t) + '</span>').join('')}
        ${(d.impactAreas || []).map(t => '<span class="ri-chip">' + esc(t) + '</span>').join('')}
      </div>

      <div class="ri-card-foot">
        <div class="ri-card-meta" style="margin-top:0;">
          ${RegIntel.statusBadge(d.status)}
          ${RegIntel.priorityBadge(d.priority)}
          <span>判定责任人：${esc(d.owner || '未指派')}</span>
          <span>采集：${esc(d.captureMode)} · ${esc(d.capturedAt)}</span>
          ${RegIntel.dueText(d)}
        </div>
        <div class="table-actions">
          <button class="btn btn-blue btn-sm" onclick="RegDocList.openView('${d.id}')">查看</button>
        </div>
      </div>
    </div>`;
  },

  /* ==================== 查看弹窗（判定 / 下载 / 分发 均在此完成） ==================== */
  openView(id) {
    const d = RegIntel.doc(id);
    if (!d) return;
    const body = this.viewBody(d);
    const footer = [
      { text: '下载原文', cls: 'btn-secondary', action: new Function("RegDocList.download('" + id + "')") },
      { text: '发起分发', cls: 'btn-teal', action: new Function("RegDocList.openDistribute('" + id + "')") },
      { text: '保存判定', cls: 'btn-primary', action: new Function("RegDocList.saveJudgment('" + id + "')") },
      { text: '关闭', cls: 'btn-secondary', action: closeModal }
    ];
    showModal('法规详情 · ' + esc(d.id), body, footer, 'modal-xxl');
  },

  viewBody(d) {
    const j = d.judgment;
    const dist = RegIntel.distByDoc(d.id)[0];
    return `
      <div class="ri-section">
        <div class="ri-section-title">基本信息</div>
        <div class="ri-kv-grid">
          <dl class="ri-kv"><dt>文件编号</dt><dd class="ri-mono">${esc(d.id)}</dd></dl>
          <dl class="ri-kv"><dt>发文字号</dt><dd>${esc(d.docNo || '—')}</dd></dl>
          <dl class="ri-kv"><dt>文件层级</dt><dd>${esc(d.level)}</dd></dl>
          <dl class="ri-kv"><dt>数据来源</dt><dd>${esc(RegIntel.sourceName(d.sourceId))}</dd></dl>
          <dl class="ri-kv"><dt>发布日期</dt><dd>${esc(d.publishDate)}</dd></dl>
          <dl class="ri-kv"><dt>生效 / 征集截止</dt><dd>${esc(d.effectiveDate || (d.deadline ? '征集截止 ' + d.deadline : '—'))}</dd></dl>
          <dl class="ri-kv"><dt>采集方式</dt><dd>${esc(d.captureMode)} · ${esc(d.capturedAt)}</dd></dl>
          <dl class="ri-kv"><dt>判定责任人</dt><dd>${esc(d.owner || '未指派')}</dd></dl>
          <dl class="ri-kv"><dt>判定责任时限</dt><dd>${esc(d.dueDate || '—')} ${RegIntel.dueText(d)}</dd></dl>
          <dl class="ri-kv"><dt>处理状态</dt><dd>${RegIntel.statusBadge(d.status)}</dd></dl>
        </div>
      </div>

      <div class="ri-section">
        <div class="ri-section-title">AI 初筛结果<span style="font-size:11px;font-weight:400;color:var(--text-muted);">（机器生成，仅供参考，不得替代人工判定）</span></div>
        <div class="ri-note ri-note-info" style="margin-bottom:12px;">
          <strong>相关度 ${d.aiScore}</strong> · 建议优先级 ${esc(d.priority)} · 命中主题：${(d.tags || []).map(t => esc(t)).join('、') || '—'}
        </div>
        <div class="ri-sub-title">内容摘要</div>
        <div class="ri-para">${esc(d.summary)}</div>
        <div class="ri-sub-title" style="margin-top:12px;">识别出的主要变化点</div>
        <ul class="ri-list">${(d.aiPoints || []).map(p => '<li>' + esc(p) + '</li>').join('')}</ul>
        <div class="ri-sub-title" style="margin-top:12px;">建议影响范围</div>
        <div class="ri-chips">${(d.impactAreas || []).length
        ? d.impactAreas.map(t => '<span class="ri-chip ri-chip-hl">' + esc(t) + '</span>').join('')
        : '<span style="font-size:13px;color:var(--text-muted);">AI 未识别到与本厂业务相关的范围</span>'}</div>
      </div>

      <div class="ri-section">
        <div class="ri-section-title">原文</div>
        <div class="ri-attach">
          <div class="ri-attach-icon">📄</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:600;color:var(--text);word-break:break-all;">${esc(d.attach ? d.attach.name : '—')}</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:3px;">
              PDF · ${d.attach ? d.attach.pages : 0} 页 · ${esc(d.attach ? d.attach.size : '')} · 下载来源：官方发布页
            </div>
            <a class="ri-link" style="font-size:12px;" href="javascript:void(0)" onclick="RegDocList.openSourcePage('${d.id}')">${esc(d.url || '')}</a>
          </div>
          <div style="display:flex;gap:8px;flex-shrink:0;">
            <button class="btn btn-secondary btn-sm" onclick="RegDocList.preview('${d.id}')">在线预览</button>
            <button class="btn btn-primary btn-sm" onclick="RegDocList.download('${d.id}')">下载</button>
          </div>
        </div>
      </div>

      <div class="ri-section">
        <div class="ri-section-title">适用性判定</div>
        <div class="ri-inline-form">
          <div class="form-group">
            <label>判定结论<span class="req">*</span></label>
            <select id="jResult">
              <option value="">待判定</option>
              <option value="适用" ${j && j.result === '适用' ? 'selected' : ''}>适用（需落地整改）</option>
              <option value="部分适用" ${j && j.result === '部分适用' ? 'selected' : ''}>部分适用</option>
              <option value="不适用" ${j && j.result === '不适用' ? 'selected' : ''}>不适用（归档留痕）</option>
            </select>
          </div>
          <div class="form-group">
            <label>判定责任人</label>
            <input id="jOwner" value="${esc(d.owner || '')}" placeholder="如 QA · 李敏">
          </div>
          <div class="form-group full">
            <label>判定理由</label>
            <textarea id="jReason" rows="3" placeholder="说明适用范围、涉及的车间/品种/系统，不涉及的须写明理由">${esc(j ? j.reason : '')}</textarea>
          </div>
          <div class="form-group full">
            <label>需跟进动作（每行一条）</label>
            <textarea id="jActions" rows="3" placeholder="如：修订洁净区环境监测管理规程">${esc(j ? (j.actions || []).join('\n') : '')}</textarea>
          </div>
          <div class="form-group">
            <label>是否触发变更控制</label>
            <select id="jChange">
              <option value="否" ${!j || !j.needChange ? 'selected' : ''}>否</option>
              <option value="是" ${j && j.needChange ? 'selected' : ''}>是</option>
            </select>
          </div>
          <div class="form-group">
            <label>关联变更单号</label>
            <input id="jChangeNo" value="${esc(j ? j.changeNo : '')}" placeholder="如 CC-2026-018">
          </div>
          <div class="form-group">
            <label>要求完成日期</label>
            <input type="date" id="jComplete" value="${esc(j ? j.completeDate : '')}">
          </div>
          <div class="form-group">
            <label>分发情况</label>
            <div style="padding:9px 0;font-size:13.5px;font-weight:600;">
              ${dist ? (dist.distributeAt
        ? esc(dist.id) + ' · ' + esc(dist.distributeAt) + ' ' + RegIntel.distStatusBadge(dist.status)
        : esc(dist.id) + ' · 草稿待分发') : '尚未发起分发'}
            </div>
          </div>
        </div>
      </div>

      <div class="ri-section">
        <div class="ri-section-title">处理轨迹</div>
        <div class="ri-timeline">
          ${(d.history || []).map(h => `
            <div class="ri-tl-item">
              <span class="ri-tl-time">${esc(h.at)}</span>
              <span class="ri-tl-actor"> · ${esc(h.actor)}</span>
              <span> · ${esc(h.action)}</span>
              <div style="color:var(--text-secondary);font-size:12.5px;">${esc(h.note)}</div>
            </div>`).join('') || '<div style="color:var(--text-muted);font-size:13px;">暂无记录</div>'}
        </div>
      </div>`;
  },

  saveJudgment(id) {
    const d = RegIntel.doc(id);
    if (!d) return;
    const v = i => { const e = document.getElementById(i); return e ? e.value.trim() : ''; };
    const result = v('jResult');
    if (!result) { toast('请先选择判定结论'); return; }
    const owner = v('jOwner');
    const reason = v('jReason');
    const actions = v('jActions').split('\n').map(s => s.trim()).filter(Boolean);
    const needChange = v('jChange') === '是';
    const changeNo = v('jChangeNo');
    const completeDate = v('jComplete');

    if (needChange && !changeNo) { toast('已选择触发变更控制，请填写关联变更单号'); return; }

    d.judgment = { result: result, by: owner || 'QA · 李敏', at: this.nowStr(), reason: reason, actions: actions, needChange: needChange, changeNo: changeNo, completeDate: completeDate };
    d.owner = owner || d.owner;
    d.status = (result === '不适用') ? 'na' : 'applicable';
    d.history.push({
      at: d.judgment.at, actor: d.judgment.by, action: '适用性判定',
      note: '结论：' + result + (needChange ? '；触发变更控制 ' + changeNo : '') + (reason ? '；' + reason : '')
    });

    // 判定为适用时，自动生成分发任务草稿，闭环才不断在这
    if (result !== '不适用' && !RegIntel.distByDoc(d.id).length) {
      this.createDraftDistribution(d);
    }

    closeModal();
    toast('适用性判定已保存：' + result);
    this.renderTable();
  },

  createDraftDistribution(d) {
    const recips = this.suggestRecipients(d);
    RI_DISTRIBUTIONS.push({
      id: RegIntel.nextId('DIS', RI_DISTRIBUTIONS), docId: d.id,
      distributeAt: '', by: d.owner, channels: [], dueDate: '', status: '待分发',
      requirement: '阅读原文并完成回执确认', recipients: recips
    });
    d.history.push({ at: this.nowStr(), actor: '系统', action: '生成分发任务草稿', note: '已按影响范围预置 ' + recips.length + ' 名接收人，待确认后分发' });
  },

  // 按影响范围推导建议接收部门/岗位（上线时改为按岗位-主题订阅表生成）
  suggestRecipients(d) {
    const map = [
      { key: '无菌生产管理', list: [['质量保证部', 'QA主管', '李敏'], ['生产部', '车间主任', '王强'], ['生产部', '冻干线班组长', '宋磊'], ['质量保证部', '环境监控员', '刘蕊'], ['设备部', '设备主管', '周涛']] },
      { key: '洁净区监测', list: [['质量保证部', '环境监控员', '刘蕊'], ['质量控制部', '微生物检验员', '周颖']] },
      { key: 'QC检验方法', list: [['质量控制部', 'QC经理', '张莉'], ['质量控制部', '理化检验组长', '陈曦'], ['质量控制部', '仪器分析员', '李彤']] },
      { key: '中药材入厂检验', list: [['采购部', '采购主管', '刘洋'], ['仓储部', '仓储主管', '陈刚'], ['质量控制部', 'QC经理', '张莉']] },
      { key: '供应商管理', list: [['采购部', '采购主管', '刘洋'], ['采购部', '供应商管理员', '何倩'], ['质量保证部', 'QA主管', '李敏']] },
      { key: 'CSV计算机化系统验证', list: [['信息中心', 'IT工程师', '吴凡'], ['质量保证部', '验证工程师', '郑霞'], ['质量控制部', 'QC经理', '张莉']] },
      { key: '批记录管理', list: [['生产部', '车间主任', '王强'], ['生产部', '工艺员', '高原'], ['质量保证部', 'QA主管', '李敏']] },
      { key: 'QC电子数据', list: [['质量控制部', 'QC经理', '张莉'], ['信息中心', 'IT工程师', '吴凡']] },
      { key: '质量放行标准', list: [['质量保证部', 'QA主管', '李敏'], ['质量控制部', 'QC经理', '张莉']] },
      { key: '包装标签管理', list: [['注册部', '注册专员', '孙宁'], ['生产部', '工艺员', '高原'], ['质量保证部', 'QA主管', '李敏']] },
      { key: '注册档案', list: [['注册部', '注册专员', '孙宁']] },
      { key: '分析方法验证', list: [['质量控制部', 'QC经理', '张莉'], ['质量控制部', '理化检验组长', '陈曦'], ['研发部', '分析方法主管', '黄凯']] },
      { key: '受托生产管理', list: [['质量保证部', 'QA主管', '李敏'], ['注册部', '注册专员', '孙宁'], ['生产部', '车间主任', '王强']] },
      { key: '质量协议', list: [['质量保证部', 'QA主管', '李敏']] },
      { key: '放行职责', list: [['质量保证部', 'QA主管', '李敏'], ['质量控制部', 'QC经理', '张莉']] },
      { key: 'SOP换版', list: [['质量保证部', '文件管理员', '郑霞'], ['生产部', '工艺员', '高原']] },
      { key: '危化品仓库管理', list: [['安环部', 'EHS主管', '赵鹏'], ['仓储部', '仓储主管', '陈刚'], ['仓储部', '库管员', '钱磊'], ['生产部', '安全员', '马超']] },
      { key: '安全设施配置', list: [['安环部', 'EHS主管', '赵鹏'], ['设备部', '设备主管', '周涛'], ['信息中心', 'IT工程师', '吴凡']] }
    ];
    const seen = {};
    const out = [];
    (d.impactAreas || []).forEach(area => {
      const hit = map.find(m => m.key === area);
      (hit ? hit.list : []).forEach(r => {
        const k = r[0] + r[1] + r[2];
        if (seen[k]) return;
        seen[k] = 1;
        out.push({ dept: r[0], role: r[1], name: r[2], readAt: '', ackAt: '', comment: '' });
      });
    });
    return out.length ? out : [{ dept: '质量保证部', role: 'QA主管', name: '李敏', readAt: '', ackAt: '', comment: '' }];
  },

  /* ==================== 分发（弹窗内完成，不留清单行操作） ==================== */
  openDistribute(id) {
    const d = RegIntel.doc(id);
    if (!d) return;
    if (d.status === 'pending') { toast('请先完成适用性判定，再发起分发'); return; }
    let dist = RegIntel.distByDoc(d.id)[0];
    if (!dist) { this.createDraftDistribution(d); dist = RegIntel.distByDoc(d.id)[0]; }
    if (dist.distributeAt) { toast('该法规已分发（' + dist.distributeAt + '），详见「分发台账」'); return; }

    const body = `
      <div class="ri-note ri-note-info" style="margin-bottom:16px;">
        分发对象由「建议影响范围」自动推导，可手工增减。发送后每位接收人的<strong>阅读时间</strong>与<strong>回执确认时间</strong>会记入分发台账，作为培训与宣贯的证据。
      </div>
      <div class="ri-inline-form" style="margin-bottom:16px;">
        <div class="form-group">
          <label>分发渠道</label>
          <select id="dChannels">
            <option value="邮件">邮件</option>
            <option value="邮件,企业微信" selected>邮件 + 企业微信</option>
            <option value="邮件,企业微信,班组会">邮件 + 企业微信 + 班组会</option>
          </select>
        </div>
        <div class="form-group">
          <label>回执要求完成日期</label>
          <input type="date" id="dDue" value="${esc(d.judgment && d.judgment.completeDate ? d.judgment.completeDate : RegIntel.today)}">
        </div>
        <div class="form-group full">
          <label>宣贯要求</label>
          <textarea id="dRequire" rows="2">阅读原文并完成回执确认</textarea>
        </div>
      </div>
      <div class="ri-section-title" style="font-size:13px;">接收人（${dist.recipients.length} 人）</div>
      <div style="max-height:280px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--radius-sm);">
        <table class="data-table" style="min-width:0;">
          <thead><tr><th style="width:60px;">含</th><th style="width:120px;">部门</th><th style="width:150px;">岗位</th><th>姓名</th></tr></thead>
          <tbody>
            ${dist.recipients.map((r, i) => `
              <tr>
                <td><input type="checkbox" class="dRcp" data-idx="${i}" checked style="width:15px;height:15px;"></td>
                <td>${esc(r.dept)}</td><td>${esc(r.role)}</td><td>${esc(r.name)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

    showModal('发起分发 · ' + esc(d.title), body, [
      { text: '取消', cls: 'btn-secondary', action: new Function("RegDocList.openView('" + id + "')") },
      { text: '确认分发', cls: 'btn-primary', action: new Function("RegDocList.confirmDistribute('" + id + "')") }
    ], 'modal-lg');
  },

  confirmDistribute(id) {
    const d = RegIntel.doc(id);
    const dist = RegIntel.distByDoc(id)[0];
    if (!d || !dist) return;
    const chEl = document.getElementById('dChannels');
    const dueEl = document.getElementById('dDue');
    const reqEl = document.getElementById('dRequire');
    const boxes = Array.prototype.slice.call(document.querySelectorAll('.dRcp'));
    const keep = boxes.filter(b => b.checked).map(b => parseInt(b.dataset.idx, 10));
    if (!keep.length) { toast('请至少保留一名接收人'); return; }

    dist.recipients = keep.map(i => dist.recipients[i]);
    dist.channels = chEl ? chEl.value.split(',') : ['邮件'];
    dist.dueDate = dueEl ? dueEl.value : '';
    dist.requirement = reqEl ? reqEl.value : '';
    dist.distributeAt = this.nowStr();
    dist.status = '进行中';
    d.status = 'distributed';
    d.history.push({
      at: dist.distributeAt, actor: dist.by, action: '发起分发',
      note: '渠道：' + dist.channels.join('、') + '；接收 ' + dist.recipients.length + ' 人；回执期限 ' + dist.dueDate
    });

    closeModal();
    toast('已分发至 ' + dist.recipients.length + ' 人，回执期限 ' + dist.dueDate);
    this.renderTable();
  },

  /* ==================== 其它动作 ==================== */
  download(id) {
    const d = RegIntel.doc(id);
    toast('已下载原文：' + (d && d.attach ? d.attach.name : '—') + '\n（演示：上线后从受控文档库取原文 PDF）');
  },
  preview(id) {
    const d = RegIntel.doc(id);
    toast('在线预览：' + (d && d.attach ? d.attach.name : '—') + '\n（演示：上线后调用受控文档库在线阅读）');
  },
  openSourcePage(id) {
    const d = RegIntel.doc(id);
    toast('原文地址：' + (d ? d.url : '—'));
  },

  runCollection() {
    toast('已触发采集任务：9 个数据源，约 3 分钟后写入清单');
  },

  openManual() {
    const body = `
      <div class="ri-inline-form">
        <div class="form-group full">
          <label>文件标题<span class="req">*</span></label>
          <input id="mTitle" placeholder="如：药品生产质量管理规范附录（某某）修订">
        </div>
        <div class="form-group">
          <label>发文字号</label>
          <input id="mDocNo" placeholder="如 2026年第XX号">
        </div>
        <div class="form-group">
          <label>文件层级</label>
          <select id="mLevel">${RI_LEVELS.map(t => '<option value="' + esc(t) + '">' + esc(t) + '</option>').join('')}</select>
        </div>
        <div class="form-group">
          <label>数据来源</label>
          <select id="mSource">${RI_SOURCES.map(s => '<option value="' + esc(s.id) + '">' + esc(s.name) + '</option>').join('')}</select>
        </div>
        <div class="form-group">
          <label>发布日期</label>
          <input type="date" id="mDate" value="${RegIntel.today}">
        </div>
        <div class="form-group full">
          <label>内容摘要</label>
          <textarea id="mSummary" rows="3" placeholder="简述对本厂可能产生影响的条款"></textarea>
        </div>
        <div class="form-group full">
          <label>建议影响范围（逗号分隔）</label>
          <input id="mImpact" placeholder="如 无菌生产管理,洁净区监测">
        </div>
      </div>
      <div class="ri-note" style="margin-top:16px;">
        手工登记的条目同样进入待判定队列，须按责任时限出具适用性结论，并留存登记人，保证来源可追溯。
      </div>`;
    showModal('手工登记法规文件', body, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '保存', cls: 'btn-primary', action: new Function("RegDocList.saveManual()") }
    ], 'modal-md');
  },

  saveManual() {
    const v = i => { const e = document.getElementById(i); return e ? String(e.value).trim() : ''; };
    const title = v('mTitle');
    if (!title) { toast('文件标题为必填项'); return; }
    const id = RegIntel.nextId('REG', RI_DOCS);
    const impact = v('mImpact').split(/[,，]/).map(s => s.trim()).filter(Boolean);
    const now = this.nowStr();
    RI_DOCS.unshift({
      id: id, title: title, sourceId: v('mSource') || 'SRC-001', level: v('mLevel') || '规范性文件',
      docNo: v('mDocNo'), publishDate: v('mDate') || RegIntel.today, effectiveDate: '', deadline: '',
      url: '', attach: null, summary: v('mSummary') || '（手工登记，暂无 AI 摘要）',
      aiPoints: [], tags: [], impactAreas: impact, aiScore: 0, priority: '中',
      status: 'pending', dueDate: '', captureMode: '人工登记', capturedAt: now, owner: '未指派',
      history: [{ at: now, actor: window.currentUserId || '当前用户', action: '手工登记入清单', note: '来源：' + RegIntel.sourceName(v('mSource') || 'SRC-001') }]
    });
    closeModal();
    toast('已登记：' + title + '\n请到「适用性判定」指派责任人与时限');
    this.renderTable();
  },

  nowStr() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
};

QueryVariant.register({
  pageId: 'reg-doc-list',
  fields: ['fSource', 'fLevel', 'fStatus', 'fTopic', 'fDateFrom', 'fDateTo', 'fScore', 'fOwner'],
  textFields: ['fKeyword'],
  labels: {
    fKeyword: '关键词', fSource: '数据来源', fLevel: '文件层级', fStatus: '处理状态',
    fTopic: '主题标签', fDateFrom: '发布日期起', fDateTo: '发布日期止', fScore: 'AI相关度', fOwner: '责任人'
  },
  onApply: function () { RegDocList.search(); },
  onRestore: function () { RegDocList.search(); }
});
