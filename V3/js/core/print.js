/**
 * 打印工具（PrintHelper）
 *
 * 作用：把当前列表页「筛选条件 + 表格」整理成 A4 打印视图，避免直接 window.print()
 *       把侧边栏、顶栏、筛选按钮、分页一起打进纸里。
 *
 * 用法：
 *   1) 通用列表打印（零配置，FilterActions 的「打印」按钮默认调它）：
 *        PrintHelper.printCurrentTable();
 *   2) 需要精确控制列/数据的页面：
 *        PrintHelper.printTable({
 *          title: '检验批台账',
 *          columns: ['检验批号', '物料编码', '状态'],
 *          rows: [['IB-2026-001', '100000014208', '检验中']],
 *          filters: ['工厂：1000', '状态：检验中']
 *        });
 *
 * 约定：打印列自动剔除「操作」列；单元格内按钮/输入框/下拉只输出文本。
 */
window.PrintHelper = (function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  function txt(el) {
    if (!el) return '';
    return String(el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  // 采集当前筛选栏的条件摘要（只收集有值的）
  function collectFilters() {
    var out = [];
    var bar = document.querySelector('.filter-bar');
    if (!bar) return out;
    var groups = bar.querySelectorAll('.filter-group');
    for (var i = 0; i < groups.length; i++) {
      var g = groups[i];
      var label = txt(g.querySelector('label')).replace(/[:：]\s*$/, '');
      var val = '';
      var sel = g.querySelector('select');
      var inp = g.querySelector('input');
      if (sel && sel.value) val = txt(sel.options[sel.selectedIndex]);
      else if (inp && inp.value) val = inp.value;
      if (label && val) out.push(label + '：' + val);
    }
    return out;
  }

  // 当前可见的数据表格（页面上可能有多张，取可见的第一张）
  function currentTable() {
    var tables = document.querySelectorAll('table.data-table');
    for (var i = 0; i < tables.length; i++) {
      if (tables[i].offsetParent !== null) return tables[i];
    }
    return tables[0] || null;
  }

  // 从 DOM 采集表格数据，剔除「操作」列与空行
  function buildFromTable(table) {
    var title = txt(document.getElementById('topbarTitle')) || document.title || '打印';
    var heads = Array.prototype.slice.call(table.querySelectorAll('thead th'));
    var drop = [];
    heads.forEach(function (th, i) { if (txt(th) === '操作') drop.push(i); });

    var cols = [];
    heads.forEach(function (th, i) { if (drop.indexOf(i) < 0 && txt(th)) cols.push(txt(th)); });

    var rows = [];
    var trs = table.querySelectorAll('tbody tr');
    for (var r = 0; r < trs.length; r++) {
      var tds = trs[r].querySelectorAll('td');
      if (!tds.length) continue;
      if (tds.length === 1 && tds[0].getAttribute('colspan')) continue;   // 空数据行
      var vals = [];
      for (var c = 0; c < tds.length; c++) {
        if (drop.indexOf(c) >= 0) continue;
        vals.push(txt(tds[c]));
      }
      if (vals.length) rows.push(vals);
    }
    return {
      title: title,
      columns: cols,
      rows: rows,
      filters: collectFilters(),
      time: new Date().toLocaleString('zh-CN', { hour12: false })
    };
  }

  function docHtml(d) {
    var cols = d.columns || [];
    var rows = d.rows || [];
    var filters = d.filters || [];
    var head = cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('');
    var body = rows.map(function (r) {
      return '<tr>' + r.map(function (v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>';
    }).join('');

    return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><title>' + esc(d.title) + '</title>'
      + '<style>'
      + '@page{size:A4 landscape;margin:12mm;}'
      + 'body{font-family:"Microsoft YaHei","PingFang SC",Arial,sans-serif;color:#111;margin:0;}'
      + 'h1{font-size:16px;text-align:center;margin:0 0 6px;letter-spacing:1px;}'
      + '.meta{font-size:10.5px;color:#555;text-align:center;margin-bottom:8px;line-height:1.6;}'
      + 'table{width:100%;border-collapse:collapse;font-size:10.5px;}'
      + 'th,td{border:1px solid #999;padding:4px 6px;text-align:left;vertical-align:top;word-break:break-all;}'
      + 'th{background:#f1f5f9;font-weight:600;}'
      + 'tbody tr:nth-child(even) td{background:#fafafa;}'
      + 'thead{display:table-header-group;}'
      + '.foot{margin-top:8px;font-size:10px;color:#666;display:flex;justify-content:space-between;}'
      + '</style></head><body>'
      + '<h1>' + esc(d.title) + '</h1>'
      + '<div class="meta">' + (filters.length ? esc(filters.join('　|　')) : '全部数据')
      + '　|　打印时间：' + esc(d.time) + '</div>'
      + '<table><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table>'
      + '<div class="foot"><span>共 ' + rows.length + ' 行（当前页/当前筛选结果）</span><span>MES 系统</span></div>'
      + '</body></html>';
  }

  function open(d) {
    var w = window.open('', '_blank', 'width=1000,height=760');
    if (!w) {
      if (window.toast) toast('请允许浏览器弹出窗口后重试');
      return;
    }
    w.document.open();
    w.document.write(docHtml(d));
    w.document.close();
    w.focus();
    setTimeout(function () { w.print(); }, 350);
  }

  return {
    // 通用：打印当前页可见表格（默认由筛选栏「打印」按钮调用）
    printCurrentTable: function () {
      var t = currentTable();
      if (!t) { if (window.toast) toast('当前页面没有可打印的表格'); return; }
      var d = buildFromTable(t);
      if (!d.rows.length) { if (window.toast) toast('没有可打印的数据'); return; }
      open(d);
    },

    // 自定义：列与数据由页面自己给
    printTable: function (cfg) {
      cfg = cfg || {};
      var rows = cfg.rows || [];
      if (!rows.length) { if (window.toast) toast('没有可打印的数据'); return; }
      open({
        title: cfg.title || txt(document.getElementById('topbarTitle')) || '打印',
        columns: cfg.columns || [],
        rows: rows,
        filters: cfg.filters || [],
        time: new Date().toLocaleString('zh-CN', { hour12: false })
      });
    },

    // 供页面自行拼装（例如二维码/标签打印）
    open: open
  };
})();
