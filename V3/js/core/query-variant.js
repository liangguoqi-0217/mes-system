// ===== Query Variant Service（查询变式 + 字段最近输入）=====
// 存储层：localStorage（数据结构 1:1 对应未来后端表 mes_query_variant / mes_field_recent_value）
// 迁移后端时只需把 _read/_write 换成接口调用，页面代码零改动。
//
// 页面接入方式（3 步）：
//   1. render() 的筛选区内插入 QueryVariant.barHtml(pageId)
//   2. init() 里调用 QueryVariant.restore(pageId) + QueryVariant.bindRecent(pageId)
//   3. search() 末尾调用 QueryVariant.saveAuto(pageId) + QueryVariant.recordUsed(pageId)
//   4. 文件末尾调用 QueryVariant.register({pageId, fields, textFields, labels, onApply, onRestore})

window.QueryVariant = (function () {
  'use strict';

  const PREFIX = 'pm_v2_';
  const MAX_VARIANTS = 20;   // 每人每页变式上限
  const MAX_RECENT = 5;      // 每个字段最近输入保留条数
  const SCHEMA_VERSION = 1;  // conditions_json 结构版本
  const AUTO_FLAG = '__AUTO__';
  const AUTO_NAME = '上次查询条件';
  const AUTO_CODE = '__LAST__';

  const _reg = {};    // pageId -> 页面注册配置
  const _state = {};  // pageId -> { currentId }
  let _pendingSave = null;

  /* ================= 基础工具 ================= */

  function _uid() { return window.currentUserId || 'admin'; }
  function _vKey(p) { return PREFIX + _uid() + '_queryVariant_' + p; }
  function _rKey(p) { return PREFIX + _uid() + '_fieldRecent_' + p; }

  function _read(key) {
    try {
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function _write(key, arr) {
    try { localStorage.setItem(key, JSON.stringify(arr)); }
    catch (e) { console.warn('[QueryVariant] 写入失败:', e && e.message); }
  }
  function _now() { return new Date().toISOString(); }
  function _newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function _el(id) { return document.getElementById(id); }
  function _esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, m =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
  function _cfg(pageId) { return _reg[pageId] || null; }
  function _label(pageId, fid) {
    const c = _cfg(pageId);
    return (c && c.labels && c.labels[fid]) || fid;
  }
  // 把存储值转成可读文本（下拉框取 option 文案）
  function _display(pageId, fid, val) {
    const e = _el(fid);
    if (e && e.tagName === 'SELECT') {
      for (let i = 0; i < e.options.length; i++) {
        if (e.options[i].value === val) return e.options[i].textContent.trim();
      }
    }
    return val;
  }

  /* ================= 变式数据层 ================= */

  function _all(pageId) { return _read(_vKey(pageId)); }

  // 用户可见变式（排除系统自动保存的"上次条件"与软删记录）
  function _variants(pageId) {
    return _all(pageId)
      .filter(v => v.source !== 'AUTO' && !v.deleted_at)
      .sort((a, b) =>
        (a.sort_no || 0) - (b.sort_no || 0) ||
        String(b.last_used_at || '').localeCompare(String(a.last_used_at || '')));
  }
  function _auto(pageId) {
    return _all(pageId).find(v => v.source === 'AUTO' && !v.deleted_at) || null;
  }
  function _find(pageId, id) {
    return _all(pageId).find(v => v.id === id) || null;
  }
  function _markApplied(pageId, id) {
    const arr = _all(pageId);
    const v = arr.find(x => x.id === id);
    if (!v) return;
    v.use_count = (v.use_count || 0) + 1;
    v.last_used_at = _now();
    _write(_vKey(pageId), arr);
  }

  /* ================= 序列化 / 回填 ================= */

  // 采集当前筛选条件：跳过空值、置灰字段、被隐藏字段
  function _collect(pageId) {
    const c = _cfg(pageId);
    const out = {};
    if (!c) return out;
    c.fields.forEach(fid => {
      const e = _el(fid);
      if (!e || e.disabled) return;                                  // 置灰字段不存
      const group = e.closest ? e.closest('.filter-group') : null;
      if (group && group.style.display === 'none') return;            // 隐藏字段不存
      const v = String(e.value == null ? '' : e.value).trim();
      if (v === '') return;                                           // 空值不存
      out[fid] = v;
    });
    return out;
  }

  // 回填条件（未出现在变式里的字段一律清空）
  function _applyValues(pageId, cond) {
    const c = _cfg(pageId);
    if (!c) return;
    c.fields.forEach(fid => {
      const e = _el(fid);
      if (!e) return;
      e.value = (cond && cond[fid] !== undefined && cond[fid] !== null) ? cond[fid] : '';
    });
    if (c.onRestore) c.onRestore();
  }

  function _clearFields(pageId) { _applyValues(pageId, {}); }

  /* ================= 最近输入 ================= */

  // 点查询时记录：只记录手工文本字段的非空值，随后按字段滚动淘汰到 MAX_RECENT 条
  function recordUsed(pageId) {
    const c = _cfg(pageId);
    if (!c || !c.textFields) return;
    const arr = _read(_rKey(pageId));
    const t = _now();
    c.textFields.forEach(fid => {
      const e = _el(fid);
      if (!e || e.disabled) return;
      const v = String(e.value == null ? '' : e.value).trim();
      if (!v || v.length > 200) return;
      const hit = arr.find(r => r.field_id === fid && r.input_value === v);
      if (hit) {
        hit.use_count = (hit.use_count || 0) + 1;
        hit.last_used_at = t;
      } else {
        arr.push({ field_id: fid, input_value: v, use_count: 1, last_used_at: t, created_at: t });
      }
    });
    c.textFields.forEach(fid => {
      const list = arr.filter(r => r.field_id === fid)
        .sort((a, b) => String(b.last_used_at || '').localeCompare(String(a.last_used_at || '')));
      list.slice(MAX_RECENT).forEach(r => {
        const i = arr.indexOf(r);
        if (i > -1) arr.splice(i, 1);
      });
    });
    _write(_rKey(pageId), arr);
  }

  function _recentList(pageId, fid) {
    return _read(_rKey(pageId))
      .filter(r => r.field_id === fid)
      .sort((a, b) => String(b.last_used_at || '').localeCompare(String(a.last_used_at || '')))
      .slice(0, MAX_RECENT);
  }

  /* ================= 变式栏 UI ================= */

  function _optionsHtml(pageId, selectedId) {
    const items = _variants(pageId);
    const opts = ['<option value="">— 未使用 —</option>'];
    if (_auto(pageId)) opts.push('<option value="' + AUTO_FLAG + '">' + AUTO_NAME + '</option>');
    items.forEach(v => {
      opts.push('<option value="' + _esc(v.id) + '">' +
        _esc(v.variant_name + (v.is_default ? '（默认）' : '')) + '</option>');
    });
    const html = opts.join('');
    const sel = _el('qvSelect');
    if (sel) {
      sel.innerHTML = html;
      sel.value = selectedId || '';
    }
    return html;
  }

  // 插入筛选区的变式栏 HTML
  function barHtml(pageId) {
    if (!_cfg(pageId)) return '';
    // 页面重绘（含切换页面）时清理遗留的下拉与弹窗
    hideRecent();
    _close('qvSaveBackdrop');
    _close('qvManageBackdrop');
    return '<div class="filter-group" style="min-width:230px;">' +
      '<label>查询变式</label>' +
      '<div class="qv-bar">' +
      '<select id="qvSelect" style="flex:1;min-width:0;" onchange="QueryVariant.onSelect(\'' + pageId + '\')">' +
      _optionsHtml(pageId, '') +
      '</select>' +
      '<button class="btn btn-secondary btn-sm" style="padding:5px 8px;" title="将当前条件保存为变式" onclick="QueryVariant.openSave(\'' + pageId + '\')">☆</button>' +
      '<button class="btn btn-secondary btn-sm" style="padding:5px 8px;" title="管理变式" onclick="QueryVariant.openManage(\'' + pageId + '\')">管理</button>' +
      '</div></div>';
  }

  // 用户主动选择：立即执行查询
  function onSelect(pageId) {
    const sel = _el('qvSelect');
    const v = sel ? sel.value : '';
    hideRecent();
    if (!v) {
      _clearFields(pageId);
      _state[pageId] = { currentId: null };
    } else if (v === AUTO_FLAG) {
      const a = _auto(pageId);
      _applyValues(pageId, a ? a.conditions_json : {});
      _state[pageId] = { currentId: AUTO_FLAG };
    } else {
      const item = _find(pageId, v);
      if (!item) return;
      _applyValues(pageId, item.conditions_json);
      _markApplied(pageId, v);
      _state[pageId] = { currentId: v };
    }
    const c = _cfg(pageId);
    if (c && c.onApply) c.onApply();
  }

  // 进入页面：回填默认变式 > 上次条件 > 空；不自动执行查询
  function restore(pageId) {
    const def = _variants(pageId).find(v => v.is_default);
    if (def) {
      _applyValues(pageId, def.conditions_json);
      _markApplied(pageId, def.id);
      _optionsHtml(pageId, def.id);
      _state[pageId] = { currentId: def.id };
      return;
    }
    const a = _auto(pageId);
    if (a) {
      _applyValues(pageId, a.conditions_json);
      _optionsHtml(pageId, AUTO_FLAG);
      _state[pageId] = { currentId: AUTO_FLAG };
      return;
    }
    _optionsHtml(pageId, '');
    _state[pageId] = { currentId: null };
  }

  // 刷新下拉选项并尽量保持当前选中项（查询后新增"上次查询条件"时使用）
  function syncOptions(pageId) {
    const sel = _el('qvSelect');
    const cur = sel ? sel.value : ((_state[pageId] && _state[pageId].currentId) || '');
    _optionsHtml(pageId, cur);
  }

  // 重置页面时：解除变式选中并清除"上次条件"
  function resetSelection(pageId) {
    const arr = _all(pageId);
    const i = arr.findIndex(v => v.source === 'AUTO');
    if (i > -1) arr.splice(i, 1);
    _write(_vKey(pageId), arr);
    _optionsHtml(pageId, '');
    _state[pageId] = { currentId: null };
  }

  // 查询执行后：自动保存"上次条件"
  function saveAuto(pageId) {
    const cond = _collect(pageId);
    const arr = _all(pageId);
    const i = arr.findIndex(v => v.source === 'AUTO');
    if (i > -1) arr.splice(i, 1);
    if (Object.keys(cond).length) {
      arr.push({
        id: _newId(), user_id: _uid(), page_id: pageId,
        variant_name: AUTO_CODE, source: 'AUTO', scope: 'PERSONAL',
        is_default: null, auto_run: 0, sort_no: 0,
        use_count: 0, last_used_at: _now(),
        conditions_json: cond, schema_version: SCHEMA_VERSION,
        created_at: _now(), updated_at: _now(), deleted_at: null
      });
    }
    _write(_vKey(pageId), arr);
  }

  /* ================= 最近输入下拉 ================= */

  function showRecent(inputEl, pageId, fid) {
    hideRecent();
    const list = _recentList(pageId, fid);
    if (!list.length) return;
    const box = document.createElement('div');
    box.id = 'qvRecentBox';
    box.className = 'qv-recent';
    box.innerHTML = list.map(r =>
      '<div class="qv-recent-item" data-v="' + _esc(r.input_value) + '">' +
      '<span>' + _esc(r.input_value) + '</span>' +
      '<span class="qv-recent-del" data-del="' + _esc(r.input_value) + '" title="删除这条记录">×</span>' +
      '</div>').join('');
    document.body.appendChild(box);
    const rect = inputEl.getBoundingClientRect();
    box.style.left = rect.left + 'px';
    box.style.top = (rect.bottom + 3) + 'px';
    box.style.minWidth = Math.max(rect.width, 160) + 'px';
    box.addEventListener('mousedown', e => e.preventDefault());
    box.addEventListener('click', e => {
      const del = e.target.closest ? e.target.closest('.qv-recent-del') : null;
      if (del) {
        removeRecent(pageId, fid, del.getAttribute('data-del'));
        hideRecent();
        return;
      }
      const item = e.target.closest ? e.target.closest('.qv-recent-item') : null;
      if (item) {
        inputEl.value = item.getAttribute('data-v');
        hideRecent();
      }
    });
    inputEl.addEventListener('blur', _onBlurRecent);
  }

  function _onBlurRecent() { setTimeout(hideRecent, 150); }

  function hideRecent() {
    const box = _el('qvRecentBox');
    if (box && box.parentNode) box.parentNode.removeChild(box);
  }

  function removeRecent(pageId, fid, value) {
    const arr = _read(_rKey(pageId)).filter(r =>
      !(r.field_id === fid && r.input_value === value));
    _write(_rKey(pageId), arr);
  }

  function bindRecent(pageId) {
    const c = _cfg(pageId);
    if (!c || !c.textFields) return;
    c.textFields.forEach(fid => {
      const e = _el(fid);
      if (!e || e._qvBound) return;
      e._qvBound = true;
      e.addEventListener('focus', () => showRecent(e, pageId, fid));
    });
  }

  /* ================= 保存弹窗 ================= */

  function _close(id) {
    const b = _el(id);
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }

  function openSave(pageId) {
    hideRecent();
    _close('qvSaveBackdrop');
    const cond = _collect(pageId);
    const keys = Object.keys(cond);
    _pendingSave = { pageId: pageId, conditions: cond };
    const preview = keys.length
      ? keys.map(k => _label(pageId, k) + '：' + _esc(_display(pageId, k, cond[k]))).join('<br>')
      : '（当前没有填写任何筛选条件）';

    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.id = 'qvSaveBackdrop';
    wrap.innerHTML =
      '<div class="modal modal-sm" onclick="event.stopPropagation()">' +
      '<div class="modal-header"><div class="modal-title">保存为查询变式</div>' +
      '<button class="modal-close" onclick="QueryVariant.closeSave()">×</button></div>' +
      '<div class="modal-body">' +
      '<div class="form-group"><label>变式名称</label>' +
      '<input type="text" id="qvSaveName" maxlength="50" placeholder="如：周一备件盘库"></div>' +
      '<label style="display:flex;align-items:center;gap:6px;font-size:13px;margin-top:12px;">' +
      '<input type="checkbox" id="qvSaveDefault"> 设为该页面的默认变式</label>' +
      '<div class="qv-preview"><div style="font-weight:600;color:var(--text);margin-bottom:4px;">将保存以下条件</div>' +
      preview + '</div>' +
      '<div class="qv-tip">置灰或隐藏的字段不会被保存；条件为空的字段也不会保存。</div>' +
      '</div>' +
      '<div class="modal-footer">' +
      '<button class="btn btn-secondary" onclick="QueryVariant.closeSave()">取消</button>' +
      '<button class="btn btn-primary" onclick="QueryVariant.confirmSave()">保存</button>' +
      '</div></div>';
    wrap.addEventListener('click', e => { if (e.target === wrap) closeSave(); });
    document.body.appendChild(wrap);
    setTimeout(() => { const i = _el('qvSaveName'); if (i) i.focus(); }, 50);
  }

  function closeSave() { _pendingSave = null; _close('qvSaveBackdrop'); }

  function confirmSave() {
    if (!_pendingSave) return;
    const pageId = _pendingSave.pageId;
    const nameInput = _el('qvSaveName');
    const name = nameInput ? String(nameInput.value || '').trim() : '';
    if (!name) { alert('请输入变式名称'); return; }
    const arr = _all(pageId);
    const alive = arr.filter(v => v.source !== 'AUTO' && !v.deleted_at);
    if (alive.some(v => v.variant_name === name)) { alert('已存在同名变式，请换一个名称'); return; }
    if (alive.length >= MAX_VARIANTS) {
      alert('每个页面最多保存 ' + MAX_VARIANTS + ' 个变式，请先删除不用的');
      return;
    }
    const defEl = _el('qvSaveDefault');
    const isDefault = !!(defEl && defEl.checked);
    if (isDefault) arr.forEach(v => { v.is_default = null; });
    arr.push({
      id: _newId(), user_id: _uid(), page_id: pageId,
      variant_name: name, source: 'USER', scope: 'PERSONAL',
      is_default: isDefault ? 1 : null, auto_run: 0, sort_no: 0,
      use_count: 0, last_used_at: null,
      conditions_json: _pendingSave.conditions, schema_version: SCHEMA_VERSION,
      created_at: _now(), updated_at: _now(), deleted_at: null
    });
    _write(_vKey(pageId), arr);
    _optionsHtml(pageId, arr[arr.length - 1].id);
    _state[pageId] = { currentId: arr[arr.length - 1].id };
    closeSave();
  }

  /* ================= 管理弹窗 ================= */

  function openManage(pageId) {
    hideRecent();
    _close('qvManageBackdrop');
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.id = 'qvManageBackdrop';
    wrap.innerHTML =
      '<div class="modal modal-md" onclick="event.stopPropagation()">' +
      '<div class="modal-header"><div class="modal-title">管理查询变式</div>' +
      '<button class="modal-close" onclick="QueryVariant.closeManage()">×</button></div>' +
      '<div class="modal-body" id="qvManageBody">' + _manageBody(pageId) + '</div>' +
      '<div class="modal-footer">' +
      '<button class="btn btn-secondary" onclick="QueryVariant.closeManage()">关闭</button>' +
      '</div></div>';
    wrap.addEventListener('click', e => { if (e.target === wrap) closeManage(); });
    document.body.appendChild(wrap);
  }

  function _manageBody(pageId) {
    const items = _variants(pageId);
    if (!items.length) {
      return '<div class="qv-empty">还没有保存任何查询变式。<br>先在筛选栏填好常用条件，再点「☆」保存。</div>';
    }
    return items.map((v, idx) => {
      const keys = Object.keys(v.conditions_json || {});
      const cond = keys.length
        ? keys.map(k => _label(pageId, k) + '：' + _esc(_display(pageId, k, v.conditions_json[k]))).join('；')
        : '无条件';
      const used = v.use_count ? ('用过 ' + v.use_count + ' 次') : '未使用过';
      const last = v.last_used_at ? String(v.last_used_at).slice(0, 10) : '—';
      return '<div class="qv-row">' +
        '<div class="qv-row-name">' + _esc(v.variant_name) +
        (v.is_default ? ' <span class="qv-tag">默认</span>' : '') + '</div>' +
        '<div class="qv-row-cond">' + cond + '</div>' +
        '<div class="qv-row-meta">' + used + ' / ' + last + '</div>' +
        '<div class="qv-row-ops">' +
        (v.is_default ? '<span class="qv-ops-disabled">已默认</span>'
          : '<button class="btn btn-secondary btn-sm" onclick="QueryVariant.setDefault(\'' + pageId + '\',\'' + v.id + '\')">设为默认</button>') +
        '<button class="btn btn-secondary btn-sm" onclick="QueryVariant.updateOne(\'' + pageId + '\',\'' + v.id + '\')">更新</button>' +
        '<button class="btn btn-secondary btn-sm" onclick="QueryVariant.rename(\'' + pageId + '\',\'' + v.id + '\')">重命名</button>' +
        (idx > 0 ? '<button class="btn btn-secondary btn-sm" onclick="QueryVariant.moveUp(\'' + pageId + '\',\'' + v.id + '\')">↑</button>' : '') +
        '<button class="btn btn-danger btn-sm" onclick="QueryVariant.remove(\'' + pageId + '\',\'' + v.id + '\')">删除</button>' +
        '</div></div>';
    }).join('');
  }

  function _refreshManage(pageId) {
    const body = _el('qvManageBody');
    if (body) body.innerHTML = _manageBody(pageId);
    _optionsHtml(pageId, (_state[pageId] && _state[pageId].currentId) || '');
  }

  function closeManage() {
    _close('qvManageBackdrop');
    hideRecent();
  }

  function setDefault(pageId, id) {
    const arr = _all(pageId);
    arr.forEach(v => { v.is_default = (v.id === id) ? 1 : null; });
    _write(_vKey(pageId), arr);
    _refreshManage(pageId);
  }

  // 用当前筛选条件覆盖该变式
  function updateOne(pageId, id) {
    const arr = _all(pageId);
    const v = arr.find(x => x.id === id);
    if (!v) return;
    const cond = _collect(pageId);
    if (!Object.keys(cond).length && !confirm('当前没有填写任何筛选条件，确定要保存为空条件吗？')) return;
    v.conditions_json = cond;
    v.schema_version = SCHEMA_VERSION;
    v.updated_at = _now();
    _write(_vKey(pageId), arr);
    _refreshManage(pageId);
  }

  function rename(pageId, id) {
    const arr = _all(pageId);
    const v = arr.find(x => x.id === id);
    if (!v) return;
    const name = prompt('修改变式名称', v.variant_name);
    if (name == null) return;
    const t = String(name).trim();
    if (!t) { alert('名称不能为空'); return; }
    if (arr.some(x => x.id !== id && x.source !== 'AUTO' && !x.deleted_at && x.variant_name === t)) {
      alert('已存在同名变式'); return;
    }
    v.variant_name = t;
    v.updated_at = _now();
    _write(_vKey(pageId), arr);
    _refreshManage(pageId);
  }

  function moveUp(pageId, id) {
    const arr = _all(pageId);
    const items = arr.filter(v => v.source !== 'AUTO' && !v.deleted_at)
      .sort((a, b) => (a.sort_no || 0) - (b.sort_no || 0));
    const i = items.findIndex(v => v.id === id);
    if (i <= 0) return;
    const tmp = items[i - 1];
    items[i - 1] = items[i];
    items[i] = tmp;
    items.forEach((v, idx) => { v.sort_no = idx; });
    _write(_vKey(pageId), arr);
    _refreshManage(pageId);
  }

  function remove(pageId, id) {
    const arr = _all(pageId);
    const v = arr.find(x => x.id === id);
    if (!v) return;
    if (!confirm('确定删除变式「' + v.variant_name + '」吗？')) return;
    v.deleted_at = _now();          // 软删
    v.is_default = null;
    _write(_vKey(pageId), arr);
    if (_state[pageId] && _state[pageId].currentId === id) _state[pageId] = { currentId: null };
    _refreshManage(pageId);
  }

  /* ================= 注册 ================= */

  function register(cfg) {
    if (!cfg || !cfg.pageId) return;
    _reg[cfg.pageId] = cfg;
  }

  // 全局兜底：点击页面其他位置关闭"最近输入"下拉（输入框自身与下拉内部除外）
  document.addEventListener('click', function (e) {
    const t = e.target;
    if (t && t.closest && t.closest('.qv-recent')) return;
    if (t && t._qvBound) return;
    hideRecent();
  });

  return {
    register: register,
    barHtml: barHtml,
    restore: restore,
    resetSelection: resetSelection,
    bindRecent: bindRecent,
    syncOptions: syncOptions,
    saveAuto: saveAuto,
    recordUsed: recordUsed,
    onSelect: onSelect,
    openSave: openSave,
    closeSave: closeSave,
    confirmSave: confirmSave,
    openManage: openManage,
    closeManage: closeManage,
    setDefault: setDefault,
    updateOne: updateOne,
    rename: rename,
    moveUp: moveUp,
    remove: remove,
    removeRecent: removeRecent,
    showRecent: showRecent,
    hideRecent: hideRecent,
    // 调试/迁移用
    _collect: _collect,
    _all: _all
  };
})();
