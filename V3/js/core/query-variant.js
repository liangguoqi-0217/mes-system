// ===== Query Variant Service（查询变式 + 字段最近输入）=====
// 存储层：localStorage（数据结构 1:1 对应未来后端表 mes_query_variant / mes_field_recent_value）
// 迁移后端时只需把 _read/_write 换成接口调用，页面代码零改动。
//
// 页面接入方式：
//   1. init() 里调用 QueryVariant.mount(pageId)（自动把「我的变式」按钮插到"查询"按钮之后）
//                   + QueryVariant.restore(pageId)（回填默认变式/上次条件，不自动查询）
//                   + QueryVariant.bindRecent(pageId)（文本字段绑定最近输入下拉）
//   2. search() 末尾调用 QueryVariant.saveAuto(pageId) + QueryVariant.recordUsed(pageId)
//   3. reset() 末尾调用 QueryVariant.resetSelection(pageId)
//   4. 文件末尾调用 QueryVariant.register({pageId, fields, textFields, labels, onApply, onRestore})

window.QueryVariant = (function () {
  'use strict';

  const PREFIX = 'pm_v2_';
  const MAX_VARIANTS = 20;   // 每人每页变式上限
  const MAX_RECENT = 5;      // 每个字段最近输入保留条数
  const SCHEMA_VERSION = 1;  // conditions_json 结构版本
  const AUTO_FLAG = '__AUTO__';
  const AUTO_CODE = '__LAST__';

  const _reg = {};    // pageId -> 页面注册配置
  const _state = {};  // pageId -> { currentId }

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
  // 条件对象 -> 可读摘要（用于列表与保存预览）
  function _condText(pageId, cond, sep) {
    const keys = Object.keys(cond || {});
    if (!keys.length) return '无条件';
    return keys.map(k => _label(pageId, k) + '：' + _esc(_display(pageId, k, cond[k]))).join(sep || '；');
  }

  /* ================= 变式数据层 ================= */

  function _all(pageId) { return _read(_vKey(pageId)); }

  // 用户可见变式（排除系统自动保存的"上次条件"与软删记录）
  function _variants(pageId) {
    return _all(pageId)
      .filter(v => v.source !== 'AUTO' && !v.deleted_at)
      .sort((a, b) => (a.sort_no || 0) - (b.sort_no || 0));
  }
  function _auto(pageId) {
    return _all(pageId).find(v => v.source === 'AUTO' && !v.deleted_at) || null;
  }
  function _find(pageId, id) { return _all(pageId).find(v => v.id === id) || null; }

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
    const arr = _read(_rKey(pageId)).filter(r => !(r.field_id === fid && r.input_value === value));
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

  /* ================= 入口按钮 ================= */

  // 在筛选栏操作区插入「我的变式」按钮，紧跟在"查询/搜索"按钮之后（即 查询 · 我的变式 · 重置）
  function mount(pageId) {
    if (!_cfg(pageId)) return;
    hideRecent();
    _close('qvManageBackdrop');               // 页面重绘/切换时清理遗留弹窗
    const actions = document.querySelector('.filter-actions');
    if (!actions) return;
    if (_el('qvOpenBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'qvOpenBtn';
    btn.className = 'btn btn-secondary btn-sm';
    btn.textContent = '我的变式';
    btn.title = '查看并应用已保存的查询条件，或保存当前条件';
    btn.onclick = function () { openManage(pageId); };
    const btns = actions.querySelectorAll('button');
    let anchor = null;
    for (let i = 0; i < btns.length; i++) {
      const t = (btns[i].textContent || '').trim();
      if (t.indexOf('查询') > -1 || t.indexOf('搜索') > -1 || t.indexOf('筛选') > -1) { anchor = btns[i]; break; }
    }
    if (anchor && anchor.parentNode === actions && anchor.nextSibling) {
      actions.insertBefore(btn, anchor.nextSibling);
    } else {
      actions.appendChild(btn);
    }
  }

  /* ================= 进入页面 / 查询后 / 重置 ================= */

  // 进入页面：回填 默认变式 > 上次条件 > 空；不自动执行查询
  function restore(pageId) {
    const def = _variants(pageId).find(v => v.is_default);
    if (def) {
      _applyValues(pageId, def.conditions_json);
      _markApplied(pageId, def.id);
      _state[pageId] = { currentId: def.id };
      return;
    }
    const a = _auto(pageId);
    if (a) {
      _applyValues(pageId, a.conditions_json);
      _state[pageId] = { currentId: AUTO_FLAG };
      return;
    }
    _state[pageId] = { currentId: null };
  }

  // 重置页面时：解除变式选中并清除"上次条件"
  function resetSelection(pageId) {
    const arr = _all(pageId);
    const i = arr.findIndex(v => v.source === 'AUTO');
    if (i > -1) arr.splice(i, 1);
    _write(_vKey(pageId), arr);
    _state[pageId] = { currentId: null };
  }

  // 查询执行后：自动保存"上次条件"（下次进入页面可回填）
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

  /* ================= 我的变式弹窗 ================= */

  function _close(id) {
    const b = _el(id);
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }

  function _listHtml(pageId) {
    const items = _variants(pageId);
    if (!items.length) {
      return '<div class="qv-empty">还没有保存任何变式。<br>先在筛选栏填好常用条件，再在右侧输入名称保存。</div>';
    }
    const curId = (_state[pageId] && _state[pageId].currentId) || '';
    return items.map(v => {
      const active = v.id === curId;
      return '<div class="qv-card' + (active ? ' active' : '') + '" ' +
        'onclick="QueryVariant.applyOne(\'' + pageId + '\',\'' + v.id + '\')">' +
        '<div class="qv-card-top">' +
        '<span class="qv-card-name">' + _esc(v.variant_name) +
        (v.is_default ? ' <span class="qv-tag">默认</span>' : '') +
        (active ? ' <span class="qv-tag qv-tag-now">当前</span>' : '') + '</span>' +
        '<span class="qv-card-ops">' +
        (v.is_default
          ? '<span class="qv-ops-disabled">已默认</span>'
          : '<button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();QueryVariant.setDefault(\'' + pageId + '\',\'' + v.id + '\')">设为默认</button>') +
        '<button class="btn btn-danger btn-sm" onclick="event.stopPropagation();QueryVariant.remove(\'' + pageId + '\',\'' + v.id + '\')">删除</button>' +
        '</span></div>' +
        '<div class="qv-card-cond">' + _condText(pageId, v.conditions_json, '；') + '</div>' +
        '</div>';
    }).join('');
  }

  function openManage(pageId) {
    hideRecent();
    _close('qvManageBackdrop');
    const cond = _collect(pageId);
    const preview = Object.keys(cond).length
      ? _condText(pageId, cond, '<br>')
      : '（当前没有填写任何筛选条件）';

    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.id = 'qvManageBackdrop';
    wrap.innerHTML =
      '<div class="modal modal-lg" onclick="event.stopPropagation()">' +
      '<div class="modal-header"><div class="modal-title">我的查询变式</div>' +
      '<button class="modal-close" onclick="QueryVariant.closeManage()">×</button></div>' +
      '<div class="modal-body">' +
      '<div class="qv-split">' +
      '<div class="qv-split-main">' +
      '<div class="qv-sec-title">已保存的变式<span class="qv-sec-hint">点击卡片即可应用并查询</span></div>' +
      '<div id="qvListWrap">' + _listHtml(pageId) + '</div>' +
      '</div>' +
      '<div class="qv-split-side">' +
      '<div class="qv-sec-title">保存当前条件为新变式</div>' +
      '<div class="form-group"><label>变式名称</label>' +
      '<input type="text" id="qvSaveName" maxlength="50" placeholder="如：周一备件盘库"></div>' +
      '<label class="qv-check"><input type="checkbox" id="qvSaveDefault"> 设为该页面的默认变式</label>' +
      '<div class="qv-preview"><div class="qv-preview-title">将保存以下条件</div>' + preview + '</div>' +
      '<div class="qv-tip">置灰或隐藏的字段不会被保存；条件为空的字段也不会保存。</div>' +
      '<button class="btn btn-primary" style="width:100%;margin-top:16px;padding:9px 20px;" ' +
      'onclick="QueryVariant.confirmSave(\'' + pageId + '\')">保存为新变式</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="modal-footer">' +
      '<button class="btn btn-secondary" onclick="QueryVariant.closeManage()">关闭</button>' +
      '</div></div>';
    wrap.addEventListener('click', e => { if (e.target === wrap) closeManage(); });
    document.body.appendChild(wrap);
    setTimeout(() => { const i = _el('qvSaveName'); if (i) i.focus(); }, 60);
  }

  function closeManage() {
    _close('qvManageBackdrop');
    hideRecent();
  }

  function _refreshList(pageId) {
    const wrap = _el('qvListWrap');
    if (wrap) wrap.innerHTML = _listHtml(pageId);
  }

  // 点击卡片：应用该变式并立即查询
  function applyOne(pageId, id) {
    const v = _find(pageId, id);
    if (!v) return;
    _applyValues(pageId, v.conditions_json);
    _markApplied(pageId, id);
    _state[pageId] = { currentId: id };
    closeManage();
    const c = _cfg(pageId);
    if (c && c.onApply) c.onApply();
  }

  function setDefault(pageId, id) {
    const arr = _all(pageId);
    arr.forEach(v => { v.is_default = (v.id === id) ? 1 : null; });
    _write(_vKey(pageId), arr);
    _state[pageId] = { currentId: id };
    _refreshList(pageId);
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
    _refreshList(pageId);
  }

  function confirmSave(pageId) {
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
    const rec = {
      id: _newId(), user_id: _uid(), page_id: pageId,
      variant_name: name, source: 'USER', scope: 'PERSONAL',
      is_default: isDefault ? 1 : null, auto_run: 0, sort_no: alive.length,
      use_count: 0, last_used_at: null,
      conditions_json: _collect(pageId), schema_version: SCHEMA_VERSION,
      created_at: _now(), updated_at: _now(), deleted_at: null
    };
    arr.push(rec);
    _write(_vKey(pageId), arr);
    _state[pageId] = { currentId: rec.id };
    // 清空输入并刷新列表
    if (nameInput) nameInput.value = '';
    if (defEl) defEl.checked = false;
    _refreshList(pageId);
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
    mount: mount,
    restore: restore,
    resetSelection: resetSelection,
    bindRecent: bindRecent,
    saveAuto: saveAuto,
    recordUsed: recordUsed,
    openManage: openManage,
    closeManage: closeManage,
    applyOne: applyOne,
    setDefault: setDefault,
    remove: remove,
    confirmSave: confirmSave,
    removeRecent: removeRecent,
    showRecent: showRecent,
    hideRecent: hideRecent,
    // 调试/迁移用
    _collect: _collect,
    _all: _all
  };
})();
