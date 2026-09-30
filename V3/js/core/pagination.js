/**
 * 公共分页组件
 *
 * 只做三件事：算分页状态、切当前页数据、渲染分页条（样式复用 common.css 的 .pagination 系列）。
 * 页面对象只要提供 page / pageSize、一个 totalRows() 和一个 renderTable()，再挂三个薄壳方法即可：
 *
 *   page: 1, pageSize: 20,
 *   totalRows() { return this.xxx.length; },
 *   prevPage()      { Pagination.go(this, -1); },
 *   nextPage()      { Pagination.go(this, 1); },
 *   changePageSize(v) { Pagination.setSize(this, v); },
 *
 * 渲染时：
 *   const pg = Pagination.slice(list, this.page, this.pageSize);
 *   this.page = pg.stat.page;                       // 页码越界时纠正回来
 *   Pagination.render('容器id', '页面对象名', pg.stat, { total: list.length, unit: '单' });
 */
window.Pagination = {
  // 每页条数候选（与采购申请页保持一致）
  SIZES: [20, 40, 80],

  // 分页状态：页码小于 1 / 大于总页数时自动纠正，避免删数据后停在空白页
  stat(total, page, pageSize) {
    const size = parseInt(pageSize, 10) || this.SIZES[0];
    const totalPages = Math.max(1, Math.ceil((total || 0) / size));
    let p = parseInt(page, 10) || 1;
    if (p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    const start = (p - 1) * size;
    return {
      page: p,
      pageSize: size,
      totalPages: totalPages,
      start: start,
      end: Math.min(start + size, total || 0)
    };
  },

  // 当前页切片：返回 { rows, stat }（rows 可能为空数组，调用方自行处理空态）
  slice(list, page, pageSize) {
    const arr = list || [];
    const s = this.stat(arr.length, page, pageSize);
    return { rows: arr.slice(s.start, s.start + s.pageSize), stat: s };
  },

  // 分页条 HTML（‹ 上一页 / 第 N / M 页 / 下一页 › / 每页条数）
  html(host, s, opts) {
    opts = opts || {};
    const sizeOpts = this.SIZES.map(n =>
      '<option value="' + n + '"' + (n === s.pageSize ? ' selected' : '') + '>' + n + '条</option>').join('');
    return '<div class="list-toolbar" style="flex-shrink:0;padding:8px 16px;">' +
      '<div class="list-info">' +
      '<span class="list-count">共 ' + (opts.total || 0) + ' ' + (opts.unit || '行') + '</span>' +
      (opts.extra || '') +
      '</div>' +
      '<div class="pagination">' +
      '<button class="pagination-btn"' + (s.page <= 1 ? ' disabled' : '') +
      ' title="上一页" onclick="' + host + '.prevPage()">‹</button>' +
      '<span class="pagination-info">第 ' + s.page + ' / ' + s.totalPages + ' 页</span>' +
      '<button class="pagination-btn"' + (s.page >= s.totalPages ? ' disabled' : '') +
      ' title="下一页" onclick="' + host + '.nextPage()">›</button>' +
      '<select class="page-size-select" title="每页条数" onchange="' + host + '.changePageSize(this.value)">' +
      sizeOpts + '</select>' +
      '</div></div>';
  },

  // 把分页条写进容器
  render(containerId, host, s, opts) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = this.html(host, s, opts);
  },

  // 翻页：delta 为 -1 / +1，越界不动；翻完由页面自己的 renderTable() 重绘
  go(host, delta) {
    const s = this.stat(host.totalRows(), host.page, host.pageSize);
    const next = s.page + delta;
    if (next < 1 || next > s.totalPages) return;
    host.page = next;
    host.renderTable();
  },

  // 改每页条数：回到第一页
  setSize(host, size) {
    host.pageSize = parseInt(size, 10) || this.SIZES[0];
    host.page = 1;
    host.renderTable();
  }
};
