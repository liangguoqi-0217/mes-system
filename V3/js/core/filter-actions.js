/**
 * 公共筛选操作区组件（FilterActions）
 *
 * 全站列表页的筛选栏右侧按钮区统一由本组件渲染，固定 5 个按钮：
 *   查询(primary) → 重置 → 导出 → 我的变式 → 更多条件 ▾/▴
 * 页面专属按钮（如「批量重试」）通过 extra 追加在末尾。
 *
 * 约定：
 *   1. 不再有「刷新」按钮，重新取数用「查询 / 重置」。
 *   2. 「更多条件」始终显示；页面没有折叠条件时点击提示「该页面暂无更多条件」。
 *   3. 「我的变式」由本组件渲染（id 固定 qvOpenBtn），QueryVariant.mount 检测到后不再重复插入。
 *   4. 容器样式（靠右、不换行、不被挤走）统一由 common.css 的 .filter-actions 提供，
 *      页面不要再写内联 style。
 *
 * 用法（页面 renderFilterBar 内直接插值）：
 *   ${FilterActions.render({
 *     pageId:   'inspection-batch',        // 查询变式 id（取自 QueryVariant.register 的 pageId）
 *     scope:    'InspectionBatch',         // 页面对象名
 *     onSearch: 'search',                  // 默认 search
 *     onReset:  'resetFilter',             // 默认 reset
 *     onExport: 'exportData',              // 不传则走「导出功能开发中」提示
 *     onMore:   'toggleMore',              // 不传则点击提示「该页面暂无更多条件」
 *     moreOpen: this.moreOpen,             // 控制 ▾ / ▴
 *     moreBtnId:'ibMoreToggle',            // 页面需要在 toggleMore 里改文案时给 id
 *     extra:    [{ text:'批量重试', onclick:'InspectionBatch.retryAllFailed()' }]
 *   })}
 *
 * 非模板字符串（字符串拼接）页面同样适用，直接把返回值拼进表达式即可：
 *   '...</div>' + FilterActions.render({ ... }) + '<div>...'
 */
window.FilterActions = (function () {
  'use strict';

  var BTN = 'btn btn-secondary btn-sm';
  var BTN_PRIMARY = 'btn btn-primary btn-sm';

  function _esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  // 拼 scope.method() 调用串；fn 为空时用兜底调用；fn 已是完整调用（结尾 ()）时原样返回
  function _call(scope, fn, fallback) {
    if (!fn) return fallback || '';
    if (/\)\s*$/.test(fn)) return fn;
    return scope ? scope + '.' + fn + '()' : fn + '()';
  }

  /**
   * 渲染筛选操作区
   * @param {Object} cfg 见文件头说明
   * @returns {string} <div class="filter-actions">…</div>
   */
  function render(cfg) {
    cfg = cfg || {};
    var scope = cfg.scope || '';
    var pageId = cfg.pageId || '';
    var moreOpen = !!cfg.moreOpen;

    var html = '';

    // 1 查询
    html += '<button class="' + BTN_PRIMARY + '" onclick="' +
      _esc(_call(scope, cfg.onSearch || 'search')) + '">查询</button>';

    // 2 重置
    html += '<button class="' + BTN + '" onclick="' +
      _esc(_call(scope, cfg.onReset || 'reset')) + '">重置</button>';

    // 3 导出（未接入时给统一提示）
    html += '<button class="' + BTN + '" onclick="' +
      _esc(_call(scope, cfg.onExport, 'FilterActions.exportTodo()')) + '">导出</button>';

    // 4 我的变式（未注册查询变式的页面点击给提示）
    html += '<button class="' + BTN + '" id="qvOpenBtn" data-qv-page="' + _esc(pageId) +
      '" onclick="FilterActions.openVariant(\'' + _esc(pageId) + '\')">我的变式</button>';

    // 5 更多条件（始终显示；无折叠条件时点击给提示）
    html += '<button class="' + BTN + '"' + (cfg.moreBtnId ? ' id="' + _esc(cfg.moreBtnId) + '"' : '') +
      ' onclick="' + _esc(_call(scope, cfg.onMore, 'FilterActions.noMore()')) + '">' +
      (moreOpen ? '收起 ▴' : '更多条件 ▾') + '</button>';

    // 6 页面专属按钮（追加在末尾）
    (cfg.extra || []).forEach(function (b) {
      if (!b) return;
      html += '<button class="' + _esc(b.cls || BTN) + '" onclick="' + _esc(b.onclick || '') + '">' +
        _esc(b.text || '') + '</button>';
    });

    return '<div class="filter-actions">' + html + '</div>';
  }

  return {
    render: render,

    // 页面没有可折叠的附加条件
    noMore: function () {
      if (window.toast) toast('该页面暂无更多条件');
    },

    // 页面未接入导出
    exportTodo: function () {
      if (window.toast) toast('导出功能开发中...');
    },

    // 打开查询变式弹窗；未启用查询变式的页面给提示
    openVariant: function (pageId) {
      if (window.QueryVariant && pageId) {
        QueryVariant.openManage(pageId);
      } else {
        if (window.toast) toast('该页面未启用查询变式');
      }
    }
  };
})();
