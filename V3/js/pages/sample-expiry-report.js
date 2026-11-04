// ===== 样品到期报表页面 =====
// 质量管理 → 样品管理 → 样品到期报表
//
// 设计原则：
//   1. 聚合样品台账（validDate）+ 留样台账（dueDate）的只读视图，不建第三份数据；
//   2. 到期不做主动推送，用本页展示；剩余天数分档高亮：≤30 天红 / ≤90 天黄 / 其余灰；
//   3. 筛选 + 打印（PrintHelper）+ 导出 CSV，遵循 FilterActions 五键规范；
//   4. 依赖 script 加载顺序：sample-locations.js → sample-ledger.js → retention-sample.js → 本页。

const SampleExpiryReport = {
  page: 1, pageSize: 10,
  filtered: [],

  bucketOptions: [
    { code: '', name: '全部' },
    { code: 'EXPIRED', name: '已过期' },
    { code: 'D30', name: '≤30 天' },
    { code: 'D90', name: '≤90 天' }
  ],

  _val(id) {
    const e = document.getElementById(id);
    return e ? String(e.value || '').trim() : '';
  },

  // ==================== 数据聚合 ====================

  _rows() {
    const rows = [];
    if (window.SampleLedger) {
      SampleLedger.data.forEach(r => {
        if (!r.validDate || r.validDate === '—') return;
        rows.push({
          src: 'ledger', srcName: '检验样品',
          no: r.sampleNo, plant: r.plant,
          materialCode: r.materialCode, materialName: r.materialName,
          dueDate: r.validDate, status: SampleLedger.getStatusMeta(r.status).name,
          locCode: r.locCode || '',
          bucket: this._bucket(r.validDate)
        });
      });
    }
    if (window.RetentionSample) {
      RetentionSample.sampleData.forEach(r => {
        if (!r.dueDate) return;
        rows.push({
          src: 'retention', srcName: '留样',
          no: r.sampleNo, plant: r.plant,
          materialCode: r.materialCode, materialName: r.materialName,
          dueDate: r.dueDate, status: RetentionSample.getStatusMeta(r.status).name,
          locCode: RetentionSample.locOf(r) || '',
          bucket: this._bucket(r.dueDate)
        });
      });
    }
    return rows.sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
  },

  _bucket(dueDate) {
    const days = this._days(dueDate);
    if (days === null) return '';
    if (days < 0) return 'EXPIRED';
    if (days <= 30) return 'D30';
    if (days <= 90) return 'D90';
    return '';
  },

  _days(dueDate) {
    const due = new Date(dueDate);
    if (isNaN(due.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((due - today) / 86400000);
  },

  // ==================== 页面骨架 ====================

  render() {
    this.page = 1;
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">样品到期报表</div>
            <div style="font-size:13px;opacity:0.85;">检验样品 + 留样到期统一展示 · 不做主动推送 · 支持打印 / 导出</div>
          </div>
        </div>

        <div id="seFilterBar" style="flex-shrink:0;"></div>
        <div class="table-wrapper" id="seTableWrapper" style="flex:1;overflow:auto;width:100%;min-width:0;"></div>
        <div id="sePagination" style="flex-shrink:0;"></div>
      </div>`;
  },

  init() {
    this.renderFilterBar();
    if (window.QueryVariant) {
      QueryVariant.mount('sample-expiry-report');
      QueryVariant.restore('sample-expiry-report');
      QueryVariant.bindRecent('sample-expiry-report');
    }
    this.renderTable();
    this.renderPagination();
  },

  search() { this.page = 1; this.renderTable(); this.renderPagination(); },

  // ==================== 筛选栏 ====================

  renderFilterBar() {
    const el = document.getElementById('seFilterBar');
    if (!el) return;
    const plantOpts = window.SampleLedger
      ? SampleLedger.plantOptions.map(p => `<option value="${p.code}">${p.code} ${p.name}</option>`).join('')
      : '';
    const bucketOpts = this.bucketOptions.map(b => `<option value="${b.code}">${b.name}</option>`).join('');

    el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
      <div class="filter-group"><label>工厂</label><select id="sePlant"><option value="">全部</option>${plantOpts}</select></div>
      <div class="filter-group"><label>来源</label><select id="seSource">
        <option value="">全部</option><option value="ledger">检验样品</option><option value="retention">留样</option>
      </select></div>
      <div class="filter-group"><label>剩余天数</label><select id="seBucket">${bucketOpts}</select></div>
      <div class="filter-group"><label>编号 / 物料</label><input type="text" id="seKeyword" placeholder="如 LS-2001 或 当归"></div>
      ${FilterActions.render({ pageId: 'sample-expiry-report', scope: 'SampleExpiryReport', onExport: 'exportData' })}
    </div>`;
  },

  // ==================== 报表表格 ====================

  renderTable() {
    const plant = this._val('sePlant');
    const source = this._val('seSource');
    const bucket = this._val('seBucket');
    const kw = this._val('seKeyword').toLowerCase();

    this.filtered = this._rows().filter(r => {
      if (plant && r.plant !== plant) return false;
      if (source && r.src !== source) return false;
      if (bucket && r.bucket !== bucket) return false;
      if (kw && (r.no + ' ' + r.materialCode + ' ' + r.materialName).toLowerCase().indexOf(kw) === -1) return false;
      return true;
    });

    const { page } = this._paged(this.filtered);
    const el = document.getElementById('seTableWrapper');
    if (!el) return;

    el.innerHTML = `<table class="data-table" style="min-width:1100px;">
      <thead><tr>
        <th style="width:170px;">编号</th>
        <th style="width:90px;">来源</th>
        <th style="width:80px;">工厂</th>
        <th style="width:200px;">物料</th>
        <th style="width:120px;">到期日</th>
        <th style="width:120px;">剩余天数</th>
        <th style="width:90px;">状态</th>
        <th>当前位置</th>
      </tr></thead>
      <tbody>${page.length ? page.map(r => this.renderRow(r)).join('')
        : `<tr><td colspan="8" class="empty-cell">暂无符合条件的到期记录</td></tr>`}</tbody>
    </table>`;
  },

  renderRow(r) {
    const days = this._days(r.dueDate);
    let daysHtml = '<span style="color:var(--text-muted);">—</span>';
    if (days !== null) {
      if (days < 0) daysHtml = `<span style="color:#dc2626;font-weight:700;">已过期 ${-days} 天</span>`;
      else if (days <= 30) daysHtml = `<span style="color:#dc2626;font-weight:700;">${days} 天</span>`;
      else if (days <= 90) daysHtml = `<span style="color:#b45309;font-weight:600;">${days} 天</span>`;
      else daysHtml = `<span style="color:var(--text-muted);">${days} 天</span>`;
    }
    return `<tr${days !== null && days < 0 ? ' style="background:#fef2f2;"' : ''}>
      <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(r.no)}</td>
      <td><span class="badge ${r.src === 'retention' ? 'badge-purple' : 'badge-blue'}" style="font-size:11px;">${r.srcName}</span></td>
      <td style="font-size:12px;">${esc(r.plant)}</td>
      <td>${esc(r.materialName)}
        <div style="color:var(--text-muted);font-family:monospace;font-size:11px;">${esc(r.materialCode)}</div></td>
      <td style="font-size:12px;">${esc(r.dueDate)}</td>
      <td style="font-size:12px;">${daysHtml}</td>
      <td><span class="badge badge-gray" style="font-size:11px;">${esc(r.status)}</span></td>
      <td style="font-size:12px;">${r.locCode ? SampleLocations.breadcrumbHtml(r.locCode) : '<span style="color:var(--text-muted);">未入库</span>'}</td>
    </tr>`;
  },

  _paged(list) {
    const pages = Math.max(1, Math.ceil(list.length / this.pageSize));
    if (this.page > pages) this.page = pages;
    const start = (this.page - 1) * this.pageSize;
    return { page: list.slice(start, start + this.pageSize), start: start };
  },

  // ==================== 导出 ====================

  exportData() {
    if (!this.filtered || !this.filtered.length) return toast('无数据可导出');
    const head = ['编号', '来源', '工厂', '物料编码', '物料名称', '到期日', '剩余天数', '状态', '位置编码', '位置路径'];
    const lines = this.filtered.map(r => [
      r.no, r.srcName, r.plant, r.materialCode, r.materialName, r.dueDate,
      this._days(r.dueDate), r.status, r.locCode || '—',
      r.locCode ? SampleLocations.breadcrumbText(r.locCode) : '—'
    ]);
    const csv = '\uFEFF' + [head.join(',')].concat(lines.map(r => r.map(c => {
      const v = String(c == null ? '' : c);
      return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(','))).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = '样品到期报表_' + new Date().toISOString().substring(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('已导出 ' + lines.length + ' 条');
  },

  // ==================== 分页 ====================

  renderPagination() {
    const el = document.getElementById('sePagination');
    if (!el) return;
    const total = this.filtered.length;
    const pages = Math.max(1, Math.ceil(total / this.pageSize));
    el.innerHTML = `<div class="pagination">
      <span style="color:var(--text-muted);font-size:12px;margin-right:12px;">共 ${total} 条</span>
      <button class="pagination-btn" onclick="SampleExpiryReport.prevPage()" ${this.page <= 1 ? 'disabled' : ''}>‹</button>
      <span class="pagination-info">第 ${this.page} / ${pages} 页</span>
      <button class="pagination-btn" onclick="SampleExpiryReport.nextPage()" ${this.page >= pages ? 'disabled' : ''}>›</button>
      <select class="page-size-select" onchange="SampleExpiryReport.changePageSize(this.value)">
        ${[10, 20, 50].map(n => `<option value="${n}" ${n === this.pageSize ? 'selected' : ''}>${n}条/页</option>`).join('')}
      </select>
    </div>`;
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); this.renderPagination(); } },
  nextPage() {
    const pages = Math.ceil(Math.max(this.filtered.length, 1) / this.pageSize);
    if (this.page < pages) { this.page++; this.renderTable(); this.renderPagination(); }
  },
  changePageSize(n) { this.pageSize = Number(n); this.page = 1; this.renderTable(); this.renderPagination(); }
};

// 查询变式注册
if (window.QueryVariant) {
  QueryVariant.register({
    pageId: 'sample-expiry-report',
    fields: ['sePlant', 'seSource', 'seBucket', 'seKeyword'],
    textFields: ['seKeyword'],
    labels: { sePlant: '工厂', seSource: '来源', seBucket: '剩余天数', seKeyword: '编号/物料' },
    onApply: function () { SampleExpiryReport.search(); }
  });
}
