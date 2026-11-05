/* ==================== 法规情报 · 法规动态 ====================
 * 整个模块就这一个页面：登录进来扫一眼标题，知道有什么新法规。
 * 点「查看」看摘要、下载原文——仅此而已。
 *
 * 说明：
 *   1. 行操作只保留「查看」（btn-blue），查看弹窗只读 + 下载原文。
 *   2. 筛选栏走 FilterActions 固定五键（查询/打印/导出/我的变式/更多条件）。
 *   3. 列表默认按发布日期倒序，最新法规在最上面。
 * 数据源：js/pages/reg-data.js（RI_DOCS / RI_SOURCES）
 * ================================================================ */

const RegDocList = {
  page: 1, pageSize: 20,
  filtered: [],
  moreOpen: false,

  /* ==================== 生命周期 ==================== */
  render() {
    this.page = 1;
    this.filtered = [];
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <!-- 标题栏 -->
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-shrink:0;flex-wrap:wrap;">
          <div>
            <div style="font-size:18px;font-weight:700;">法规动态</div>
            <div style="font-size:13px;opacity:0.85;">药监、药典委等官方渠道每日自动采集的最新法规与公告</div>
          </div>
          <div style="font-size:12px;opacity:0.75;">最近采集：2026-10-22 08:10 · 共 9 个监测源</div>
        </div>

        <div id="rgFilterBar" style="flex-shrink:0;"></div>

        <style>
          #rgTableWrapper { scrollbar-width: thin; scrollbar-color: rgba(203,213,225,0.6) transparent; }
          #rgTableWrapper::-webkit-scrollbar { width: 6px; height: 0; }
          #rgTableWrapper::-webkit-scrollbar-thumb { background: rgba(203,213,225,0.6); border-radius: 3px; }
          #rgTableWrapper::-webkit-scrollbar-track { background: transparent; }
          .ri-chip { display:inline-block;background:#f1f5f9;color:#475569;border-radius:4px;padding:2px 8px;font-size:11.5px;line-height:1.6;white-space:nowrap; }
          .ri-kv-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px; }
          .ri-kv { padding:11px 14px;background:#f8fafc;border:1px solid #f1f5f9;border-radius:var(--radius-sm);margin:0; }
          .ri-kv dt { font-size:12px;color:var(--text-secondary);margin-bottom:3px; }
          .ri-kv dd { font-size:13.5px;font-weight:600;color:var(--text);margin:0;line-height:1.5;word-break:break-all; }
          .ri-link { color:var(--primary-light);text-decoration:none;word-break:break-all; }
          .ri-link:hover { text-decoration:underline; }
        </style>
        <div class="table-wrapper" id="rgTableWrapper" style="flex:1;overflow:auto;width:100%;min-width:0;"></div>
        <div id="rgPagination" style="flex-shrink:0;"></div>
      </div>`;
  },

  init() {
    this.renderFilterBar();
    if (window.QueryVariant) {
      QueryVariant.mount('reg-doc-list');
      QueryVariant.restore('reg-doc-list');
      QueryVariant.bindRecent('reg-doc-list');
    }
    this.renderTable();
    this.renderPagination();
  },

  /* ==================== 筛选栏 ==================== */
  renderFilterBar() {
    const el = document.getElementById('rgFilterBar');
    if (!el) return;

    const srcOpts = RI_SOURCES.map(s => '<option value="' + esc(s.id) + '">' + esc(s.name) + '</option>').join('');
    const lvOpts = ['法律', '行政法规', '部门规章', '规范性文件', '技术标准', '工作文件', '征求意见稿', '国际指南']
      .map(t => '<option value="' + esc(t) + '">' + esc(t) + '</option>').join('');

    el.innerHTML = `
      <div class="filter-bar" style="flex-wrap:wrap;">
        <div class="filter-group"><label>标题 / 文号</label><input type="text" id="rgKeyword" placeholder="如 药典 或 2026年第58号"></div>
        <div class="filter-group"><label>发文单位</label><select id="rgSource"><option value="">全部</option>${srcOpts}</select></div>
        ${FilterActions.render({ pageId: 'reg-doc-list', scope: 'RegDocList', onMore: 'toggleMore', moreBtnId: 'rgMoreBtn', moreOpen: this.moreOpen })}
        <div id="rgMoreBar" style="display:${this.moreOpen ? 'flex' : 'none'};flex-wrap:wrap;gap:12px;width:100%;padding:0;border:none;background:transparent;">
          <div class="filter-group"><label>文件层级</label><select id="rgLevel"><option value="">全部</option>${lvOpts}</select></div>
          <div class="filter-group"><label>发布日期（起）</label><input type="date" id="rgFrom"></div>
          <div class="filter-group"><label>发布日期（止）</label><input type="date" id="rgTo"></div>
        </div>
      </div>`;
  },

  toggleMore() {
    this.moreOpen = !this.moreOpen;
    const bar = document.getElementById('rgMoreBar');
    if (bar) bar.style.display = this.moreOpen ? 'flex' : 'none';
    const btn = document.getElementById('rgMoreBtn');
    if (btn) btn.textContent = this.moreOpen ? '收起 ▴' : '更多条件 ▾';
  },

  _val(id) {
    const e = document.getElementById(id);
    return e ? String(e.value || '').trim() : '';
  },

  /* ==================== 查询 / 分页 ==================== */
  search() {
    this.page = 1;
    if (window.QueryVariant) {
      QueryVariant.saveAuto('reg-doc-list');
      QueryVariant.recordUsed('reg-doc-list');
    }
    this.renderTable();
    this.renderPagination();
  },

  applyFilter() {
    const kw = this._val('rgKeyword').toLowerCase();
    const src = this._val('rgSource');
    const lv = this._val('rgLevel');
    const from = this._val('rgFrom');
    const to = this._val('rgTo');

    const rows = RI_DOCS.filter(d => {
      if (src && d.sourceId !== src) return false;
      if (lv && d.level !== lv) return false;
      if (from && d.publishDate < from) return false;
      if (to && d.publishDate > to) return false;
      if (kw && (d.title + ' ' + d.docNo).toLowerCase().indexOf(kw) < 0) return false;
      return true;
    });

    rows.sort((a, b) => String(b.publishDate).localeCompare(String(a.publishDate)));
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

    const wrap = document.getElementById('rgTableWrapper');
    if (wrap) {
      wrap.innerHTML = pg.rows.length ? `
        <table class="data-table" style="width:100%;">
          <thead>
            <tr>
              <th style="min-width:340px;">文件标题</th>
              <th style="width:260px;">发文单位</th>
              <th style="width:120px;">层级</th>
              <th style="width:120px;">发布日期</th>
              <th style="width:80px;">操作</th>
            </tr>
          </thead>
          <tbody>
            ${pg.rows.map(d => `
              <tr>
                <td>
                  <div style="font-weight:600;color:var(--text);cursor:pointer;line-height:1.5;" onclick="RegDocList.openView('${d.id}')">${esc(d.title)}</div>
                  <div style="font-size:11.5px;color:var(--text-muted);margin-top:2px;">${esc(d.docNo || '')}</div>
                </td>
                <td style="font-size:12.5px;">${esc(RegIntel.sourceName(d.sourceId))}</td>
                <td><span class="ri-chip">${esc(d.level)}</span></td>
                <td>${esc(d.publishDate)}</td>
                <td><div class="table-actions"><button class="btn btn-blue btn-sm" onclick="RegDocList.openView('${d.id}')">查看</button></div></td>
              </tr>`).join('')}
          </tbody>
        </table>` : '<div style="padding:60px;text-align:center;color:var(--text-muted);font-size:13px;">没有符合条件的法规</div>';
    }

    const cnt = document.getElementById('rgCount');
    if (cnt) cnt.textContent = '共 ' + rows.length + ' 条';

    Pagination.render('rgPagination', 'RegDocList', pg.stat, { total: rows.length, unit: '条' });
  },

  renderPagination() {
    // 分页条由 renderTable 统一渲染；此处保留空实现以兼容 init 调用
  },

  /* ==================== 查看弹窗（只读） ==================== */
  openView(id) {
    const d = RegIntel.doc(id);
    if (!d) return;
    const body = `
      <div class="ri-kv-grid">
        <dl class="ri-kv"><dt>发文单位</dt><dd>${esc(RegIntel.sourceName(d.sourceId))}</dd></dl>
        <dl class="ri-kv"><dt>发文字号</dt><dd>${esc(d.docNo || '—')}</dd></dl>
        <dl class="ri-kv"><dt>文件层级</dt><dd>${esc(d.level)}</dd></dl>
        <dl class="ri-kv"><dt>发布日期</dt><dd>${esc(d.publishDate)}</dd></dl>
        <dl class="ri-kv"><dt>生效日期</dt><dd>${esc(d.effectiveDate || (d.deadline ? '征集截止 ' + d.deadline : '—'))}</dd></dl>
        <dl class="ri-kv"><dt>采集时间</dt><dd>${esc(d.capturedAt)}</dd></dl>
        <dl class="ri-kv" style="grid-column:1/-1;"><dt>原文地址</dt><dd style="font-weight:400;font-size:13px;"><a class="ri-link" href="javascript:void(0)" onclick="RegDocList.openSource('${d.id}')">${esc(d.url || '—')}</a></dd></dl>
      </div>

      <div style="margin-top:20px;">
        <div style="font-size:13px;font-weight:700;color:var(--primary);padding-bottom:7px;border-bottom:2px solid var(--primary);margin-bottom:12px;">内容摘要</div>
        <div style="font-size:13.5px;line-height:1.9;color:var(--text-secondary);">${esc(d.summary)}</div>
      </div>

      <div style="margin-top:20px;display:flex;align-items:center;gap:12px;border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;background:#f8fafc;">
        <div style="font-size:22px;">📄</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13.5px;font-weight:600;color:var(--text);word-break:break-all;">${esc(d.attach ? d.attach.name : '—')}</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:3px;">PDF · ${d.attach ? d.attach.pages : 0} 页 · ${esc(d.attach ? d.attach.size : '')}</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="RegDocList.download('${d.id}')">下载原文</button>
      </div>`;

    showModal('法规详情 · ' + esc(d.title), body, [
      { text: '下载原文', cls: 'btn-primary', action: new Function("RegDocList.download('" + id + "')") },
      { text: '关闭', cls: 'btn-secondary', action: closeModal }
    ], 'modal-lg');
  },

  download(id) {
    const d = RegIntel.doc(id);
    toast('已下载原文：' + (d && d.attach ? d.attach.name : '—') + '\n（演示：上线后从受控文档库取原文 PDF）');
  },

  openSource(id) {
    const d = RegIntel.doc(id);
    toast('原文地址：' + (d ? d.url : '—'));
  }
};

QueryVariant.register({
  pageId: 'reg-doc-list',
  fields: ['rgSource', 'rgLevel', 'rgFrom', 'rgTo'],
  textFields: ['rgKeyword'],
  labels: {
    rgKeyword: '标题/文号', rgSource: '发文单位',
    rgLevel: '文件层级', rgFrom: '发布日期起', rgTo: '发布日期止'
  },
  onApply: function () { RegDocList.search(); },
  onRestore: function () { RegDocList.search(); }
});
