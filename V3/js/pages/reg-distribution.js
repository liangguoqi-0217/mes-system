/* ==================== 法规情报 · 分发台账 ====================
 * 闭环的最后一段，也是检查时被翻的记录：
 *   谁在什么时间收到、看了没有、什么时候签的回执、没签的是谁。
 *
 * 设计口径：宣贯不是「发个群消息」就算完成，必须落到这里的可举证记录；
 *          阅读与回执的时点由系统自动记录，不能事后补录。
 * 数据源：js/pages/reg-data.js
 * ================================================================ */

const RegDistribution = {
  page: 1, pageSize: 20,
  filtered: [],
  tab: 'all',

  render() {
    return `
    <div class="ri-wrap">
      <div class="ri-header">
        <div>
          <h2>分发台账</h2>
          <div class="ri-header-sub">记录每一次法规宣贯的分发对象、阅读时间与回执确认，作为培训与宣贯的可举证记录</div>
        </div>
        <div class="ri-header-actions">
          <button class="btn btn-secondary btn-sm" onclick="RegDistribution.remindAll()">一键催办</button>
          <button class="btn btn-primary btn-sm" onclick="RegDistribution.exportList()">导出台账</button>
        </div>
      </div>

      <div class="ri-toolbar">
        <div class="ri-toolbar-left">
          <span class="list-count" id="regDistCount">共 0 条</span>
          <div style="display:flex;gap:4px;" id="regDistTabs">${this.tabsHtml()}</div>
        </div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="RegDistribution.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="RegDistribution.exportList()">导出</button>
          <button class="btn btn-secondary btn-sm" onclick="RegDistribution.refresh()">刷新</button>
          <button class="btn btn-secondary btn-sm" onclick="RegDistribution.reset()">重置</button>
        </div>
      </div>

      <div class="ri-body">
        <div class="ri-filter">
          <div class="ri-filter-title">筛选条件</div>
          <div class="ri-fgroup">
            <label>关键词</label>
            <input id="d2Keyword" placeholder="分发单号 / 文件标题 / 接收人">
          </div>
          <div class="ri-fgroup">
            <label>分发日期（起）</label>
            <input type="date" id="d2From">
          </div>
          <div class="ri-fgroup">
            <label>分发日期（止）</label>
            <input type="date" id="d2To">
          </div>
          <div class="ri-fgroup">
            <label>接收部门</label>
            <select id="d2Dept">
              <option value="">全部部门</option>
              ${this.allDepts().map(d => '<option value="' + esc(d) + '">' + esc(d) + '</option>').join('')}
            </select>
          </div>
          <div class="ri-fgroup">
            <label>分发渠道</label>
            <select id="d2Channel">
              <option value="">全部渠道</option>
              <option value="邮件">邮件</option>
              <option value="企业微信">企业微信</option>
              <option value="班组会">班组会</option>
            </select>
          </div>
          <div class="ri-fgroup">
            <label>回执情况</label>
            <select id="d2Ack">
              <option value="">全部</option>
              <option value="read">全部已阅读</option>
              <option value="unread">存在未阅读</option>
              <option value="unack">存在未回执</option>
            </select>
          </div>
          <div class="ri-note ri-note-info" style="margin-top:14px;">
            阅读与回执时点由系统自动采集，原则上不允许事后补录；确有例外须登记理由并经 QA 确认。
          </div>
        </div>

        <div class="ri-content">
          <div class="ri-scroll" id="regDistScroll">
            <div class="ri-stat-row" id="regDistStats"></div>
            <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;">
              <div class="ri-table-wrap" style="max-height:calc(100vh - 320px);">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th style="width:130px;">分发单号</th>
                      <th style="min-width:260px;">法规文件</th>
                      <th style="width:130px;">分发时间</th>
                      <th style="width:120px;">分发人</th>
                      <th style="width:130px;">渠道</th>
                      <th style="width:150px;">阅读进度</th>
                      <th style="width:150px;">回执进度</th>
                      <th style="width:110px;">要求完成日</th>
                      <th style="width:110px;">状态</th>
                      <th style="width:80px;">操作</th>
                    </tr>
                  </thead>
                  <tbody id="regDistBody"></tbody>
                </table>
              </div>
            </div>
          </div>
          <div id="regDistPager"></div>
        </div>
      </div>
    </div>`;
  },

  allDepts() {
    const set = {};
    RI_DISTRIBUTIONS.forEach(d => (d.recipients || []).forEach(r => { if (r.dept) set[r.dept] = 1; }));
    return Object.keys(set).sort();
  },

  tabsHtml() {
    return [['all', '全部'], ['待分发', '待分发'], ['进行中', '进行中'], ['回执逾期', '回执逾期'], ['已完成', '已完成']]
      .map(t => '<button class="btn ' + (this.tab === t[0] ? 'btn-primary' : 'btn-secondary') + ' btn-sm"'
        + ' onclick="RegDistribution.switchTab(\'' + t[0] + '\')">' + t[1] + '</button>').join('');
  },

  switchTab(t) {
    this.tab = t;
    this.page = 1;
    const tabs = document.getElementById('regDistTabs');
    if (tabs) tabs.innerHTML = this.tabsHtml();
    this.renderTable();
  },

  init() {
    QueryVariant.mount('reg-distribution');
    QueryVariant.bindRecent('reg-distribution');
    QueryVariant.restore('reg-distribution');
    this.renderTable();
  },

  readFilter() {
    const v = id => { const e = document.getElementById(id); return e ? e.value : ''; };
    return { keyword: v('d2Keyword'), from: v('d2From'), to: v('d2To'), dept: v('d2Dept'), channel: v('d2Channel'), ack: v('d2Ack') };
  },

  search() {
    this.page = 1;
    QueryVariant.saveAuto('reg-distribution');
    QueryVariant.recordUsed('reg-distribution');
    this.renderTable();
  },

  reset() {
    ['d2Keyword', 'd2From', 'd2To', 'd2Dept', 'd2Channel', 'd2Ack'].forEach(id => {
      const e = document.getElementById(id); if (e) e.value = '';
    });
    QueryVariant.resetSelection('reg-distribution');
    this.page = 1;
    this.renderTable();
    toast('筛选条件已重置');
  },

  refresh() { this.renderTable(); toast('分发台账已刷新'); },

  exportList() { toast('已导出发放台账（演示：含阅读/回执明细，实际由后台生成）'); },

  remindAll() {
    const overdue = RI_DISTRIBUTIONS.filter(d => {
      const s = RegIntel.ackStats(d);
      return d.distributeAt && s.ack < s.total;
    });
    if (!overdue.length) { toast('当前没有未完成回执的分发记录'); return; }
    const n = overdue.reduce((sum, d) => sum + (RegIntel.ackStats(d).total - RegIntel.ackStats(d).ack), 0);
    toast('已向 ' + overdue.length + ' 条分发记录中的 ' + n + ' 名未回执人员发送催办提醒');
  },

  applyFilter() {
    const f = this.readFilter();
    const kw = (f.keyword || '').trim().toLowerCase();
    let rows = RI_DISTRIBUTIONS.filter(d => {
      if (this.tab !== 'all' && d.status !== this.tab) return false;
      if (f.from && (d.distributeAt || '') < f.from) return false;
      if (f.to && (d.distributeAt || '') > f.to) return false;
      if (f.dept && !(d.recipients || []).some(r => r.dept === f.dept)) return false;
      if (f.channel && (d.channels || []).indexOf(f.channel) < 0) return false;
      if (f.ack) {
        const s = RegIntel.ackStats(d);
        if (f.ack === 'read' && s.read < s.total) return false;
        if (f.ack === 'unread' && s.read >= s.total) return false;
        if (f.ack === 'unack' && s.ack >= s.total) return false;
      }
      if (kw) {
        const doc = RegIntel.doc(d.docId) || {};
        const hay = (d.id + ' ' + (doc.title || '') + ' ' + (d.recipients || []).map(r => r.name + r.dept).join(' ')).toLowerCase();
        if (hay.indexOf(kw) < 0) return false;
      }
      return true;
    });
    rows.sort((a, b) => String(b.distributeAt || '9999').localeCompare(String(a.distributeAt || '9999')));
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

    const body = document.getElementById('regDistBody');
    if (body) {
      body.innerHTML = pg.rows.length ? pg.rows.map(d => {
        const doc = RegIntel.doc(d.docId) || {};
        const s = RegIntel.ackStats(d);
        const depts = [...new Set((d.recipients || []).map(r => r.dept))];
        return `
        <tr>
          <td class="ri-mono">${esc(d.id)}</td>
          <td>
            <div style="font-weight:600;color:var(--text);cursor:pointer;line-height:1.5;" onclick="RegDistribution.openView('${d.id}')">${esc(doc.title || d.docId)}</div>
            <div style="font-size:11.5px;color:var(--text-muted);margin-top:2px;">${esc(d.docId)} · ${esc(doc.level || '')}</div>
          </td>
          <td>${d.distributeAt ? esc(d.distributeAt) : '<span style="color:var(--text-muted);">未发送</span>'}</td>
          <td>${esc(d.by)}</td>
          <td style="font-size:12px;">${(d.channels || []).length ? d.channels.map(c => esc(c)).join('、') : '<span style="color:var(--text-muted);">待设定</span>'}</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="ri-progress" style="flex:1;"><i style="width:${s.readPct}%;background:${s.read === s.total ? 'var(--success)' : 'var(--primary-light)'};"></i></div>
              <span style="font-size:12px;font-weight:600;white-space:nowrap;">${s.read}/${s.total}</span>
            </div>
          </td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="ri-progress" style="flex:1;"><i style="width:${s.ackPct}%;background:${s.ack === s.total ? 'var(--success)' : (RegIntel.diffDays(d.dueDate) < 0 ? 'var(--danger)' : 'var(--warning)')};"></i></div>
              <span style="font-size:12px;font-weight:600;white-space:nowrap;">${s.ack}/${s.total}</span>
            </div>
          </td>
          <td>${d.dueDate ? esc(d.dueDate) : '—'}</td>
          <td>${RegIntel.distStatusBadge(d.status)}</td>
          <td><div class="table-actions"><button class="btn btn-blue btn-sm" onclick="RegDistribution.openView('${d.id}')">查看</button></div></td>
        </tr>`;
      }).join('') : '<tr><td colspan="10" style="text-align:center;padding:36px;color:var(--text-muted);">没有符合条件的分发记录</td></tr>';
    }

    const cnt = document.getElementById('regDistCount');
    if (cnt) cnt.textContent = '共 ' + rows.length + ' 条';
    Pagination.render('regDistPager', 'RegDistribution', pg.stat, { total: rows.length, unit: '条' });
  },

  renderStats() {
    const el = document.getElementById('regDistStats');
    if (!el) return;
    let totalRecv = 0, totalAck = 0, overdue = 0, draft = 0;
    RI_DISTRIBUTIONS.forEach(d => {
      const s = RegIntel.ackStats(d);
      totalRecv += s.total;
      totalAck += s.ack;
      if (d.distributeAt && s.ack < s.total && RegIntel.diffDays(d.dueDate) < 0) overdue++;
      if (!d.distributeAt) draft++;
    });
    const rate = totalRecv ? Math.round(totalAck / totalRecv * 100) : 0;
    el.innerHTML = [
      { label: '待分发草稿', value: draft, cls: draft ? 'warn' : '', hint: '判定为适用但未发送' },
      { label: '回执逾期', value: overdue, cls: overdue ? 'danger' : '', hint: '超过要求完成日仍未回执' },
      { label: '累计接收人次', value: totalRecv, cls: '', hint: '含全部渠道的分发对象' },
      { label: '回执完成率', value: rate + '%', cls: rate >= 90 ? '' : 'warn', hint: '已回执 ' + totalAck + ' / ' + totalRecv + ' 人次' }
    ].map(s => `
      <div class="ri-stat">
        <div class="ri-stat-label">${esc(s.label)}</div>
        <div class="ri-stat-value ${s.cls}">${esc(String(s.value))}</div>
        <div class="ri-stat-hint">${esc(s.hint)}</div>
      </div>`).join('');
  },

  /* ==================== 分发详情（含阅读/回执明细） ==================== */
  openView(id) {
    const d = RegIntel.dist(id);
    if (!d) return;
    const doc = RegIntel.doc(d.docId) || {};
    const s = RegIntel.ackStats(d);
    const body = `
      <div class="ri-section">
        <div class="ri-kv-grid">
          <dl class="ri-kv"><dt>分发单号</dt><dd class="ri-mono">${esc(d.id)}</dd></dl>
          <dl class="ri-kv"><dt>法规文件</dt><dd>${esc(doc.title || d.docId)}</dd></dl>
          <dl class="ri-kv"><dt>分发时间</dt><dd>${d.distributeAt ? esc(d.distributeAt) : '未发送（草稿）'}</dd></dl>
          <dl class="ri-kv"><dt>分发人</dt><dd>${esc(d.by)}</dd></dl>
          <dl class="ri-kv"><dt>分发渠道</dt><dd>${(d.channels || []).length ? esc(d.channels.join('、')) : '待设定'}</dd></dl>
          <dl class="ri-kv"><dt>要求完成日</dt><dd>${esc(d.dueDate || '—')}</dd></dl>
          <dl class="ri-kv"><dt>宣贯要求</dt><dd>${esc(d.requirement || '—')}</dd></dl>
          <dl class="ri-kv"><dt>状态</dt><dd>${RegIntel.distStatusBadge(d.status)}</dd></dl>
        </div>
      </div>

      <div class="ri-section">
        <div class="ri-section-title">回执情况</div>
        <div class="ri-kv-grid" style="grid-template-columns:repeat(3,1fr);">
          <dl class="ri-kv">
            <dt>阅读进度</dt>
            <dd>${s.read} / ${s.total}
              <div class="ri-progress" style="margin-top:6px;"><i style="width:${s.readPct}%;"></i></div>
            </dd>
          </dl>
          <dl class="ri-kv">
            <dt>回执进度</dt>
            <dd>${s.ack} / ${s.total}
              <div class="ri-progress" style="margin-top:6px;"><i style="width:${s.ackPct}%;background:${s.ack === s.total ? 'var(--success)' : 'var(--warning)'}"></i></div>
            </dd>
          </dl>
          <dl class="ri-kv">
            <dt>涉及部门</dt>
            <dd>${[...new Set((d.recipients || []).map(r => r.dept))].map(x => '<span class="ri-chip" style="margin-right:4px;">' + esc(x) + '</span>').join('') || '—'}</dd>
          </dl>
        </div>
      </div>

      <div class="ri-section">
        <div class="ri-section-title">接收人明细（${d.recipients.length} 人）</div>
        <div class="ri-table-wrap" style="max-height:340px;">
          <table class="data-table data-table-compact">
            <thead>
              <tr>
                <th style="width:130px;">部门</th>
                <th style="width:140px;">岗位</th>
                <th style="width:90px;">姓名</th>
                <th style="width:150px;">阅读时间</th>
                <th style="width:150px;">回执时间</th>
                <th style="width:90px;">状态</th>
                <th>回执备注</th>
              </tr>
            </thead>
            <tbody>
              ${d.recipients.map(r => {
      const st = r.ackAt ? '<span class="badge badge-green">已回执</span>'
        : r.readAt ? '<span class="badge badge-yellow">已读未回执</span>'
          : d.distributeAt ? '<span class="badge badge-red">未查看</span>'
            : '<span class="badge badge-gray">待发送</span>';
      return `
                <tr>
                  <td>${esc(r.dept)}</td>
                  <td>${esc(r.role)}</td>
                  <td>${esc(r.name)}</td>
                  <td class="ri-mono">${r.readAt ? esc(r.readAt) : '—'}</td>
                  <td class="ri-mono">${r.ackAt ? esc(r.ackAt) : '—'}</td>
                  <td>${st}</td>
                  <td style="font-size:12px;color:var(--text-secondary);">${esc(r.comment || '—')}</td>
                </tr>`;
    }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;

    const footer = [];
    if (!d.distributeAt) {
      footer.push({ text: '发送分发', cls: 'btn-primary', action: new Function("RegDistribution.sendDraft('" + id + "')") });
    } else {
      footer.push({ text: '催办未回执', cls: 'btn-secondary', action: new Function("RegDistribution.remind('" + id + "')") });
    }
    footer.push({ text: '导出回执明细', cls: 'btn-secondary', action: new Function("RegDistribution.exportAck('" + id + "')") });
    footer.push({ text: '关闭', cls: 'btn-secondary', action: closeModal });

    showModal('分发详情 · ' + esc(d.id), body, footer, 'modal-xxl');
  },

  sendDraft(id) {
    const d = RegIntel.dist(id);
    if (!d) return;
    if (!window.confirm('确认向 ' + d.recipients.length + ' 名接收人发送分发通知？\n发送后系统开始记录阅读与回执时点。')) return;
    d.distributeAt = this.nowStr();
    d.status = '进行中';
    if (!d.channels.length) d.channels = ['邮件', '企业微信'];
    if (!d.dueDate) d.dueDate = RegIntel.today;
    const doc = RegIntel.doc(d.docId);
    if (doc) {
      doc.status = 'distributed';
      doc.history.push({ at: d.distributeAt, actor: d.by, action: '发起分发', note: '渠道：' + d.channels.join('、') + '；接收 ' + d.recipients.length + ' 人' });
    }
    closeModal();
    toast('已发送分发至 ' + d.recipients.length + ' 人');
    this.renderTable();
  },

  remind(id) {
    const d = RegIntel.dist(id);
    if (!d) return;
    const list = d.recipients.filter(r => !r.ackAt);
    if (!list.length) { toast('该分发记录回执已全部完成'); return; }
    toast('已催办 ' + list.length + ' 人：' + list.map(r => r.name).join('、'));
  },

  exportAck(id) {
    const d = RegIntel.dist(id);
    toast('已导出回执明细：' + (d ? d.id : '—') + '\n（演示：含阅读/回执时间与备注）');
  },

  nowStr() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
};

QueryVariant.register({
  pageId: 'reg-distribution',
  fields: ['d2From', 'd2To', 'd2Dept', 'd2Channel', 'd2Ack'],
  textFields: ['d2Keyword'],
  labels: {
    d2Keyword: '关键词', d2From: '分发日期起', d2To: '分发日期止',
    d2Dept: '接收部门', d2Channel: '分发渠道', d2Ack: '回执情况'
  },
  onApply: function () { RegDistribution.search(); },
  onRestore: function () { RegDistribution.search(); }
});
