/* ==================== 法规情报 · 适用性判定 ====================
 * 清单不做结论，结论在这里做：由 RA / QA 逐条出具「适用 / 部分适用 / 不适用」，
 * 并绑定——涉及哪些部门、要换哪些文件、要不要开变更控制单、谁负责、什么时候完成。
 *
 * 列表行操作只保留「查看」，判定、影响范围、文件换版等动作全部在查看弹窗内完成。
 * 数据源：js/pages/reg-data.js
 * ================================================================ */

const RegApplicability = {
  page: 1, pageSize: 20,
  filtered: [],
  tab: 'pending',

  render() {
    return `
    <div class="ri-wrap">
      <div class="ri-header">
        <div>
          <h2>适用性判定</h2>
          <div class="ri-header-sub">由责任人对每条入清单的法规出具结论：适用与否、涉及范围、需换文件、是否触发变更控制</div>
        </div>
        <div class="ri-header-actions">
          <button class="btn btn-secondary btn-sm" onclick="RegApplicability.exportList()">导出判定台账</button>
        </div>
      </div>

      <div class="ri-toolbar">
        <div class="ri-toolbar-left">
          <span class="list-count" id="regAppCount">共 0 条</span>
          <div style="display:flex;gap:4px;" id="regAppTabs">${this.tabsHtml()}</div>
        </div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="RegApplicability.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="RegApplicability.exportList()">导出</button>
          <button class="btn btn-secondary btn-sm" onclick="RegApplicability.refresh()">刷新</button>
          <button class="btn btn-secondary btn-sm" onclick="RegApplicability.reset()">重置</button>
        </div>
      </div>

      <div class="ri-body">
        <div class="ri-filter">
          <div class="ri-filter-title">筛选条件</div>
          <div class="ri-fgroup">
            <label>关键词</label>
            <input id="aKeyword" placeholder="标题 / 文号">
          </div>
          <div class="ri-fgroup">
            <label>数据来源</label>
            <select id="aSource"><option value="">全部来源</option>${RI_SOURCES.map(s => '<option value="' + esc(s.id) + '">' + esc(s.name) + '</option>').join('')}</select>
          </div>
          <div class="ri-fgroup">
            <label>建议影响范围</label>
            <select id="aImpact">
              <option value="">全部</option>
              <option value="无菌生产管理">无菌生产管理</option>
              <option value="洁净区监测">洁净区监测</option>
              <option value="QC检验方法">QC检验方法</option>
              <option value="中药材入厂检验">中药材入厂检验</option>
              <option value="CSV计算机化系统验证">CSV计算机化系统验证</option>
              <option value="EHS/安环">EHS/安环</option>
            </select>
          </div>
          <div class="ri-fgroup">
            <label>责任人</label>
            <select id="aOwner">
              <option value="">全部</option>
              <option value="未指派">未指派</option>
              <option value="QA · 李敏">QA · 李敏</option>
              <option value="注册部 · 孙宁">注册部 · 孙宁</option>
              <option value="QC · 张莉">QC · 张莉</option>
              <option value="EHS · 赵鹏">EHS · 赵鹏</option>
            </select>
          </div>
          <div class="ri-fgroup">
            <label>是否触发变更控制</label>
            <select id="aChange">
              <option value="">全部</option>
              <option value="是">是</option>
              <option value="否">否</option>
            </select>
          </div>
          <div class="ri-fgroup">
            <label>AI 相关度</label>
            <select id="aScore">
              <option value="0">全部</option>
              <option value="90">90 分以上</option>
              <option value="80">80 分以上</option>
              <option value="60">60 分以上</option>
            </select>
          </div>
          <div class="ri-note ri-note-info" style="margin-top:14px;">
            判定时限自采集入清单次日起算，超期未判定的条目在清单置顶并进入质量月度回顾的输入。
          </div>
        </div>

        <div class="ri-content">
          <div class="ri-scroll" id="regAppScroll">
            <div class="ri-stat-row" id="regAppStats"></div>
            <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;">
              <div class="ri-table-wrap" style="max-height:calc(100vh - 320px);">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th style="width:130px;">文件编号</th>
                      <th style="min-width:280px;">文件标题</th>
                      <th style="width:180px;">数据来源</th>
                      <th style="width:80px;">相关度</th>
                      <th style="width:70px;">优先级</th>
                      <th style="width:130px;">判定责任人</th>
                      <th style="width:110px;">时限</th>
                      <th style="width:110px;">状态</th>
                      <th style="width:80px;">操作</th>
                    </tr>
                  </thead>
                  <tbody id="regAppBody"></tbody>
                </table>
              </div>
            </div>
          </div>
          <div id="regAppPager"></div>
        </div>
      </div>
    </div>`;
  },

  init() {
    QueryVariant.mount('reg-applicability');
    QueryVariant.bindRecent('reg-applicability');
    QueryVariant.restore('reg-applicability');
    this.renderTable();
  },

  tabsHtml() {
    return [['pending', '待判定'], ['applicable', '已判定适用'], ['na', '不适用'], ['all', '全部']].map(t =>
      '<button class="btn ' + (this.tab === t[0] ? 'btn-primary' : 'btn-secondary') + ' btn-sm"'
      + ' onclick="RegApplicability.switchTab(\'' + t[0] + '\')">' + t[1] + '</button>').join('');
  },

  switchTab(t) {
    this.tab = t;
    this.page = 1;
    const tabs = document.getElementById('regAppTabs');
    if (tabs) tabs.innerHTML = this.tabsHtml();
    this.renderTable();
  },

  readFilter() {
    const v = id => { const e = document.getElementById(id); return e ? e.value : ''; };
    return {
      keyword: v('aKeyword'), source: v('aSource'), impact: v('aImpact'),
      owner: v('aOwner'), change: v('aChange'), score: parseInt(v('aScore'), 10) || 0
    };
  },

  search() {
    this.page = 1;
    QueryVariant.saveAuto('reg-applicability');
    QueryVariant.recordUsed('reg-applicability');
    this.renderTable();
  },

  reset() {
    ['aKeyword', 'aSource', 'aImpact', 'aOwner', 'aChange', 'aScore'].forEach(id => {
      const e = document.getElementById(id); if (e) e.value = '';
    });
    QueryVariant.resetSelection('reg-applicability');
    this.page = 1;
    this.renderTable();
    toast('筛选条件已重置');
  },

  refresh() { this.renderTable(); toast('判定队列已刷新'); },

  exportList() { toast('已导出适用性判定台账（演示：实际导出由后台生成）'); },

  applyFilter() {
    const f = this.readFilter();
    const kw = (f.keyword || '').trim().toLowerCase();
    let rows = RI_DOCS.filter(d => {
      if (this.tab !== 'all' && d.status !== this.tab) return false;
      if (f.source && d.sourceId !== f.source) return false;
      if (f.impact && (d.impactAreas || []).indexOf(f.impact) < 0) return false;
      if (f.owner && d.owner !== f.owner) return false;
      if (f.change === '是' && !(d.judgment && d.judgment.needChange)) return false;
      if (f.change === '否' && (d.judgment && d.judgment.needChange)) return false;
      if (f.score && (d.aiScore || 0) < f.score) return false;
      if (kw && (d.title + ' ' + d.docNo).toLowerCase().indexOf(kw) < 0) return false;
      return true;
    });
    rows.sort((a, b) => {
      const ao = RegIntel.isOverdue(a) ? 1 : 0, bo = RegIntel.isOverdue(b) ? 1 : 0;
      if (ao !== bo) return bo - ao;
      return String(a.dueDate || '9999').localeCompare(String(b.dueDate || '9999'));
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

    const body = document.getElementById('regAppBody');
    if (body) {
      body.innerHTML = pg.rows.length ? pg.rows.map(d => `
        <tr>
          <td class="ri-mono">${esc(d.id)}</td>
          <td>
            <div style="font-weight:600;color:var(--text);cursor:pointer;line-height:1.5;" onclick="RegApplicability.openJudge('${d.id}')">${esc(d.title)}</div>
            <div style="font-size:11.5px;color:var(--text-muted);margin-top:2px;">${esc(d.docNo || '')} · ${esc(d.level)}</div>
          </td>
          <td style="font-size:12px;">${esc(RegIntel.sourceName(d.sourceId))}</td>
          <td><span style="font-weight:700;color:var(--primary);">${d.aiScore}</span></td>
          <td>${RegIntel.priorityBadge(d.priority)}</td>
          <td>${esc(d.owner || '未指派')}</td>
          <td>${d.dueDate ? esc(d.dueDate) + '<br>' + RegIntel.dueText(d) : '—'}</td>
          <td>${RegIntel.statusBadge(d.status)}</td>
          <td><div class="table-actions"><button class="btn btn-blue btn-sm" onclick="RegApplicability.openJudge('${d.id}')">查看</button></div></td>
        </tr>`).join('') : '<tr><td colspan="9" style="text-align:center;padding:36px;color:var(--text-muted);">没有符合条件的法规文件</td></tr>';
    }

    const cnt = document.getElementById('regAppCount');
    if (cnt) cnt.textContent = '共 ' + rows.length + ' 条';
    Pagination.render('regAppPager', 'RegApplicability', pg.stat, { total: rows.length, unit: '条' });
  },

  renderStats() {
    const el = document.getElementById('regAppStats');
    if (!el) return;
    const pending = RI_DOCS.filter(d => d.status === 'pending').length;
    const overdue = RI_DOCS.filter(d => RegIntel.isOverdue(d)).length;
    const applicable = RI_DOCS.filter(d => d.status === 'applicable').length;
    const changeHit = RI_DOCS.filter(d => d.judgment && d.judgment.needChange).length;
    el.innerHTML = [
      { label: '待判定', value: pending, cls: pending ? '' : '', hint: '等待 RA/QA 出具结论' },
      { label: '判定逾期', value: overdue, cls: overdue ? 'danger' : '', hint: '需在月度回顾中说明' },
      { label: '适用（待闭环）', value: applicable, cls: applicable ? 'warn' : '', hint: '已出结论，待分发与回执' },
      { label: '已触发变更控制', value: changeHit, cls: '', hint: '关联至变更管理流程' }
    ].map(s => `
      <div class="ri-stat">
        <div class="ri-stat-label">${esc(s.label)}</div>
        <div class="ri-stat-value ${s.cls}">${s.value}</div>
        <div class="ri-stat-hint">${esc(s.hint)}</div>
      </div>`).join('');
  },

  /* ==================== 判定工作弹窗 ==================== */
  openJudge(id) {
    const d = RegIntel.doc(id);
    if (!d) return;
    const body = this.judgeBody(d);
    const footer = [
      { text: '指派责任人', cls: 'btn-secondary', action: new Function("RegApplicability.assignOwner('" + id + "')") },
      { text: '保存判定', cls: 'btn-primary', action: new Function("RegApplicability.saveJudgment('" + id + "')") },
      { text: '保存并生成分发草稿', cls: 'btn-teal', action: new Function("RegApplicability.saveAndDraft('" + id + "')") },
      { text: '关闭', cls: 'btn-secondary', action: closeModal }
    ];
    showModal('适用性判定 · ' + esc(d.id), body, footer, 'modal-xxl');
  },

  judgeBody(d) {
    const j = d.judgment;
    const SOP_LIST = [
      'SOP-QA-012 洁净区环境监测管理规程', 'SOP-QA-031 批记录审核与放行管理规程',
      'SOP-QC-007 分析方法验证管理规程', 'SOP-QC-019 中药材取样与留样管理规程',
      'SOP-PR-024 无菌工艺模拟灌装方案', 'SOP-EHS-003 危险化学品储存管理制度',
      'SOP-IT-009 计算机化系统清单与分级管理规程', 'SOP-PR-015 供应商审计与现场核查管理规程'
    ];
    return `
      <div style="display:grid;grid-template-columns:1.05fr 1fr;gap:26px;">
        <!-- 左：法规与 AI 建议 -->
        <div>
          <div class="ri-section">
            <div class="ri-section-title">法规文件</div>
            <div class="ri-kv-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr));">
              <dl class="ri-kv"><dt>发文字号</dt><dd>${esc(d.docNo || '—')}</dd></dl>
              <dl class="ri-kv"><dt>文件层级</dt><dd>${esc(d.level)}</dd></dl>
              <dl class="ri-kv"><dt>数据来源</dt><dd>${esc(RegIntel.sourceName(d.sourceId))}</dd></dl>
              <dl class="ri-kv"><dt>发布日期</dt><dd>${esc(d.publishDate)}</dd></dl>
              <dl class="ri-kv"><dt>生效日期</dt><dd>${esc(d.effectiveDate || '—')}</dd></dl>
              <dl class="ri-kv"><dt>采集时间</dt><dd>${esc(d.capturedAt)}</dd></dl>
            </div>
            <div style="margin-top:14px;font-size:14px;font-weight:700;color:var(--text);line-height:1.6;">${esc(d.title)}</div>
          </div>

          <div class="ri-section">
            <div class="ri-section-title">AI 初筛建议</div>
            <div class="ri-note ri-note-info" style="margin-bottom:10px;">
              相关度 <strong>${d.aiScore}</strong> · 建议优先级 ${esc(d.priority)} · 命中主题 ${(d.tags || []).map(t => esc(t)).join('、') || '—'}
            </div>
            <div class="ri-para">${esc(d.summary)}</div>
            <div class="ri-sub-title" style="margin-top:12px;">主要变化点</div>
            <ul class="ri-list">${(d.aiPoints || []).map(p => '<li>' + esc(p) + '</li>').join('') || '<li>—</li>'}</ul>
          </div>

          <div class="ri-section">
            <div class="ri-section-title">处理轨迹</div>
            <div class="ri-timeline">
              ${(d.history || []).map(h => `
                <div class="ri-tl-item">
                  <span class="ri-tl-time">${esc(h.at)}</span><span class="ri-tl-actor"> · ${esc(h.actor)}</span>
                  <span> · ${esc(h.action)}</span>
                  <div style="color:var(--text-secondary);font-size:12.5px;">${esc(h.note)}</div>
                </div>`).join('')}
            </div>
          </div>
        </div>

        <!-- 右：判定表单 -->
        <div>
          <div class="ri-section">
            <div class="ri-section-title">适用性结论<span style="font-size:11px;font-weight:400;color:var(--text-muted);">（人工结论，机器不得代签）</span></div>
            <div class="ri-inline-form">
              <div class="form-group">
                <label>判定结论<span class="req">*</span></label>
                <select id="ajResult">
                  <option value="">请选择</option>
                  <option value="适用" ${j && j.result === '适用' ? 'selected' : ''}>适用</option>
                  <option value="部分适用" ${j && j.result === '部分适用' ? 'selected' : ''}>部分适用</option>
                  <option value="不适用" ${j && j.result === '不适用' ? 'selected' : ''}>不适用</option>
                </select>
              </div>
              <div class="form-group">
                <label>判定责任人<span class="req">*</span></label>
                <select id="ajOwner">
                  <option value="">请选择</option>
                  ${['QA · 李敏', '注册部 · 孙宁', 'QC · 张莉', 'EHS · 赵鹏', '信息中心 · 吴凡'].map(o =>
      '<option value="' + esc(o) + '"' + (d.owner === o ? ' selected' : '') + '>' + esc(o) + '</option>').join('')}
                </select>
              </div>
              <div class="form-group">
                <label>判定时限</label>
                <input type="date" id="ajDue" value="${esc(d.dueDate || '')}">
              </div>
              <div class="form-group">
                <label>要求完成日</label>
                <input type="date" id="ajComplete" value="${esc(j ? j.completeDate : '')}">
              </div>
              <div class="form-group full">
                <label>判定理由（适用范围 / 不涉及的须写明依据）</label>
                <textarea id="ajReason" rows="4">${esc(j ? j.reason : '')}</textarea>
              </div>
            </div>
          </div>

          <div class="ri-section">
            <div class="ri-section-title">影响范围与跟进动作</div>
            <div class="ri-sub-title">涉及部门（按影响范围勾选，用于自动生成分发名单）</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px 12px;font-size:13px;margin-bottom:14px;">
              ${['质量保证部', '质量控制部', '生产部', '设备部', '仓储部', '采购部', '注册部', '研发部', '安环部', '信息中心']
        .map(dept => {
          const on = (d.impactAreas || []).length && (d.judgment || {}) && (d.status !== 'na');
          return '<label style="display:flex;align-items:center;gap:6px;margin:0;cursor:pointer;">'
            + '<input type="checkbox" class="ajDept" value="' + esc(dept) + '"' + (on ? ' checked' : '') + ' style="width:15px;height:15px;">'
            + esc(dept) + '</label>';
        }).join('')}
            </div>
            <div class="form-group" style="margin-bottom:14px;">
              <label>需跟进动作（每行一条）</label>
              <textarea id="ajActions" rows="3">${esc(j ? (j.actions || []).join('\n') : '')}</textarea>
            </div>
            <div class="ri-sub-title">需同步换版的文件（从现行有效清单中勾选）</div>
            <div style="display:grid;grid-template-columns:1fr;gap:5px;font-size:13px;">
              ${SOP_LIST.map(s => '<label style="display:flex;align-items:center;gap:6px;margin:0;cursor:pointer;">'
        + '<input type="checkbox" class="ajSop" value="' + esc(s) + '" style="width:15px;height:15px;">' + esc(s) + '</label>').join('')}
            </div>
          </div>

          <div class="ri-section">
            <div class="ri-section-title">变更控制</div>
            <div class="ri-inline-form">
              <div class="form-group">
                <label>是否触发变更控制</label>
                <select id="ajChange">
                  <option value="否" ${!j || !j.needChange ? 'selected' : ''}>否</option>
                  <option value="是" ${j && j.needChange ? 'selected' : ''}>是</option>
                </select>
              </div>
              <div class="form-group">
                <label>关联变更单号</label>
                <input id="ajChangeNo" value="${esc(j ? j.changeNo : '')}" placeholder="如 CC-2026-018">
              </div>
            </div>
            <div class="ri-note" style="margin-top:12px;">
              判定结论直接影响文件体系与验证状态：选择「是」时必须关联变更单，否则 QMS 侧无法闭环。
            </div>
          </div>
        </div>
      </div>`;
  },

  saveJudgment(id, andDraft) {
    const d = RegIntel.doc(id);
    if (!d) return;
    const v = i => { const e = document.getElementById(i); return e ? String(e.value).trim() : ''; };
    const result = v('ajResult');
    const owner = v('ajOwner');
    if (!result) { toast('请选择判定结论'); return; }
    if (!owner) { toast('请指定判定责任人'); return; }
    const needChange = v('ajChange') === '是';
    const changeNo = v('ajChangeNo');
    if (needChange && !changeNo) { toast('已选择触发变更控制，请填写关联变更单号'); return; }

    const actions = v('ajActions').split('\n').map(s => s.trim()).filter(Boolean);
    const depts = Array.prototype.slice.call(document.querySelectorAll('.ajDept:checked')).map(b => b.value);
    const sops = Array.prototype.slice.call(document.querySelectorAll('.ajSop:checked')).map(b => b.value);
    sops.forEach(s => actions.push('文件换版：' + s));

    const at = this.nowStr();
    d.judgment = {
      result: result, by: owner, at: at,
      reason: v('ajReason'), actions: actions,
      needChange: needChange, changeNo: changeNo, completeDate: v('ajComplete'),
      depts: depts, sops: sops
    };
    d.owner = owner;
    d.dueDate = v('ajDue') || d.dueDate;
    d.status = result === '不适用' ? 'na' : 'applicable';
    d.history.push({
      at: at, actor: owner, action: '适用性判定',
      note: '结论：' + result + (needChange ? '；变更单 ' + changeNo : '') + (depts.length ? '；涉及 ' + depts.length + ' 个部门' : '')
    });

    if (result !== '不适用' && !RegIntel.distByDoc(d.id).length) {
      RegDocList.createDraftDistribution(d);
      // 草稿名单以本次勾选的部门为准重算
      const dist = RegIntel.distByDoc(d.id)[0];
      if (dist && depts.length) {
        const keep = dist.recipients.filter(r => depts.indexOf(r.dept) >= 0);
        dist.recipients = keep.length ? keep : RegDocList.suggestRecipients(d);
      }
    }

    closeModal();
    toast('适用性判定已保存：' + result + (andDraft ? '\n已生成分发任务草稿，请到「分发台账」确认后发送' : ''));
    this.renderTable();
  },

  saveAndDraft(id) { this.saveJudgment(id, true); },

  assignOwner(id) {
    const d = RegIntel.doc(id);
    if (!d) return;
    const body = `
      <div class="ri-inline-form">
        <div class="form-group full">
          <label>指派判定责任人</label>
          <select id="aoOwner">
            ${['QA · 李敏', '注册部 · 孙宁', 'QC · 张莉', 'EHS · 赵鹏', '信息中心 · 吴凡'].map(o =>
      '<option value="' + esc(o) + '"' + (d.owner === o ? ' selected' : '') + '>' + esc(o) + '</option>').join('')}
          </select>
        </div>
        <div class="form-group">
          <label>判定时限</label>
          <input type="date" id="aoDue" value="${esc(d.dueDate || '')}">
        </div>
        <div class="form-group">
          <label>优先级</label>
          <select id="aoPriority">
            ${['高', '中', '低'].map(o => '<option value="' + o + '"' + (d.priority === o ? ' selected' : '') + '>' + o + '</option>').join('')}
          </select>
        </div>
      </div>`;
    showModal('指派判定责任人 · ' + esc(d.id), body, [
      { text: '取消', cls: 'btn-secondary', action: new Function("RegApplicability.openJudge('" + id + "')") },
      { text: '确定', cls: 'btn-primary', action: new Function("RegApplicability.doAssign('" + id + "')") }
    ], 'modal-sm');
  },

  doAssign(id) {
    const d = RegIntel.doc(id);
    if (!d) return;
    const v = i => { const e = document.getElementById(i); return e ? String(e.value).trim() : ''; };
    const owner = v('aoOwner');
    const due = v('aoDue');
    const prio = v('aoPriority');
    if (!owner) { toast('请选择责任人'); return; }
    d.owner = owner;
    d.dueDate = due || d.dueDate;
    d.priority = prio || d.priority;
    d.history.push({ at: this.nowStr(), actor: '系统', action: '指派责任人', note: owner + ' · 判定时限 ' + (d.dueDate || '—') });
    closeModal();
    toast('已指派责任人：' + owner + '，判定时限 ' + (d.dueDate || '—'));
    this.renderTable();
  },

  nowStr() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
};

QueryVariant.register({
  pageId: 'reg-applicability',
  fields: ['aSource', 'aImpact', 'aOwner', 'aChange', 'aScore'],
  textFields: ['aKeyword'],
  labels: {
    aKeyword: '关键词', aSource: '数据来源', aImpact: '影响范围', aOwner: '责任人',
    aChange: '触发变更控制', aScore: 'AI相关度'
  },
  onApply: function () { RegApplicability.search(); },
  onRestore: function () { RegApplicability.search(); }
});
