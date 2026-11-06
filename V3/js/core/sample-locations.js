/**
 * 样品位置树（SampleLocations）——样品管理公共主数据
 *
 * 服务于：样品台账（sample-ledger）、留样台账（retention-sample）、到期报表、位置管理页。
 *
 * 层级模型（结构由 QC 自定，系统只定层级）：
 *   房间/样品间(room) → 存储设备(fridge/cabinet) → 层/搁架(shelf) → 盒(box) → 位(slot，可选)
 *
 * 职责：
 *   1. 树数据与查询（getNode / getChildren / pathSegments / breadcrumb）
 *   2. 占用统计（供应商模式：各台账注册 provider 返回 [{locCode}]，core 只聚合不依赖页面）
 *   3. 级联位置选择器（cascadeHtml + bindCascade）与位置选择弹窗（pick）
 *   4. 面包屑渲染（breadcrumbHtml / breadcrumbText）
 */
window.SampleLocations = (function () {
  'use strict';

  /* ==================== 字典 ==================== */

  const NODE_TYPES = [
    { code: 'room',    name: '房间/样品间' },
    { code: 'fridge',  name: '冰箱/冰柜' },
    { code: 'cabinet', name: '柜/干燥器' },
    { code: 'chamber', name: '稳定性箱' },
    { code: 'shelf',   name: '层/搁架/抽屉' },
    { code: 'box',     name: '盒' },
    { code: 'slot',    name: '行列位' }
  ];

  const TEMP_ZONES = [
    { code: 'RT',     name: '常温', badge: 'badge-gray' },
    { code: 'COOL',   name: '阴凉', badge: 'badge-blue' },
    { code: 'COLD',   name: '冷藏 2~8℃', badge: 'badge-yellow' },
    { code: 'FREEZE', name: '冷冻', badge: 'badge-purple' }
  ];

  /* ==================== 树数据（内存 mock） ==================== */

  // type: room|fridge|cabinet|shelf|box|slot; capacity 仅展示用
  let tree = [
    // ---- 样品间1（检验样品区） ----
    { code: 'S-01', name: '样品间1', type: 'room', tempZone: 'RT', parentCode: '', status: 'active' },
    { code: 'FRZ-01', name: '3号冰箱', type: 'fridge', tempZone: 'COLD', parentCode: 'S-01', status: 'active' },
    { code: 'FRZ-01-L1', name: '1层', type: 'shelf', tempZone: 'COLD', parentCode: 'FRZ-01', status: 'active' },
    { code: 'FRZ-01-L1-A', name: 'A盒', type: 'box', tempZone: 'COLD', parentCode: 'FRZ-01-L1', status: 'active', capacity: 30 },
    { code: 'FRZ-01-L1-B', name: 'B盒', type: 'box', tempZone: 'COLD', parentCode: 'FRZ-01-L1', status: 'active', capacity: 30 },
    { code: 'FRZ-01-L2', name: '2层', type: 'shelf', tempZone: 'COLD', parentCode: 'FRZ-01', status: 'active' },
    { code: 'FRZ-01-L2-A', name: 'A盒', type: 'box', tempZone: 'COLD', parentCode: 'FRZ-01-L2', status: 'active', capacity: 30 },
    { code: 'FRZ-01-L3', name: '3层', type: 'shelf', tempZone: 'COLD', parentCode: 'FRZ-01', status: 'active' },
    { code: 'DR-01', name: '干燥器1号', type: 'cabinet', tempZone: 'RT', parentCode: 'S-01', status: 'active' },
    { code: 'DR-01-T1', name: '托盘1', type: 'shelf', tempZone: 'RT', parentCode: 'DR-01', status: 'active' },
    { code: 'CAB-01', name: '检验样品柜', type: 'cabinet', tempZone: 'RT', parentCode: 'S-01', status: 'active' },
    { code: 'CAB-01-L1', name: '1层', type: 'shelf', tempZone: 'RT', parentCode: 'CAB-01', status: 'active' },
    { code: 'CAB-01-L2', name: '2层', type: 'shelf', tempZone: 'RT', parentCode: 'CAB-01', status: 'active' },
    { code: 'CAB-01-L3', name: '3层', type: 'shelf', tempZone: 'RT', parentCode: 'CAB-01', status: 'active' },

    // ---- 样品间2（微生物 / 冷冻） ----
    { code: 'S-02', name: '样品间2', type: 'room', tempZone: 'RT', parentCode: '', status: 'active' },
    { code: 'FRZ-02', name: '冷冻冰柜', type: 'fridge', tempZone: 'FREEZE', parentCode: 'S-02', status: 'active' },
    { code: 'FRZ-02-D1', name: '抽屉1', type: 'shelf', tempZone: 'FREEZE', parentCode: 'FRZ-02', status: 'active' },
    { code: 'FRZ-02-D2', name: '抽屉2', type: 'shelf', tempZone: 'FREEZE', parentCode: 'FRZ-02', status: 'active' },
    { code: 'CAB-02', name: '微生物样品柜', type: 'cabinet', tempZone: 'COLD', parentCode: 'S-02', status: 'active' },
    { code: 'CAB-02-L1', name: '1层', type: 'shelf', tempZone: 'COLD', parentCode: 'CAB-02', status: 'active' },

    // ---- 稳定性考察室（对接稳定性研究：条件 = 箱，位置到层/盒） ----
    { code: 'S-03', name: '稳定性考察室', type: 'room', tempZone: 'RT', parentCode: '', status: 'active' },
    { code: 'STB-X01', name: '稳定性箱 X01（25℃/60%RH）', type: 'chamber', tempZone: 'RT', parentCode: 'S-03', status: 'active' },
    { code: 'STB-X01-L1', name: '1层', type: 'shelf', tempZone: 'RT', parentCode: 'STB-X01', status: 'active' },
    { code: 'STB-X01-L1-A', name: 'A盒', type: 'box', tempZone: 'RT', parentCode: 'STB-X01-L1', status: 'active', capacity: 60 },
    { code: 'STB-X01-L1-B', name: 'B盒', type: 'box', tempZone: 'RT', parentCode: 'STB-X01-L1', status: 'active', capacity: 60 },
    { code: 'STB-X01-L2', name: '2层', type: 'shelf', tempZone: 'RT', parentCode: 'STB-X01', status: 'active' },
    { code: 'STB-X01-L2-A', name: 'A盒', type: 'box', tempZone: 'RT', parentCode: 'STB-X01-L2', status: 'active', capacity: 40 },
    { code: 'STB-X01-L2-B', name: 'B盒', type: 'box', tempZone: 'RT', parentCode: 'STB-X01-L2', status: 'active', capacity: 40 },
    { code: 'STB-X02', name: '稳定性箱 X02（40℃/75%RH）', type: 'chamber', tempZone: 'RT', parentCode: 'S-03', status: 'active' },
    { code: 'STB-X02-L1', name: '1层', type: 'shelf', tempZone: 'RT', parentCode: 'STB-X02', status: 'active' },
    { code: 'STB-X02-L1-A', name: 'A盒', type: 'box', tempZone: 'RT', parentCode: 'STB-X02-L1', status: 'active', capacity: 40 },
    { code: 'STB-X02-L1-B', name: 'B盒', type: 'box', tempZone: 'RT', parentCode: 'STB-X02-L1', status: 'active', capacity: 40 },
    { code: 'STB-X03', name: '稳定性箱 X03（25℃/60%RH，备用）', type: 'chamber', tempZone: 'RT', parentCode: 'S-03', status: 'active' },
    { code: 'STB-X03-L1', name: '1层', type: 'shelf', tempZone: 'RT', parentCode: 'STB-X03', status: 'active' },
    { code: 'STB-X03-L1-A', name: 'A盒', type: 'box', tempZone: 'RT', parentCode: 'STB-X03-L1', status: 'active', capacity: 60 },
    { code: 'STB-X04', name: '稳定性箱 X04（40℃/75%RH，维修中）', type: 'chamber', tempZone: 'RT', parentCode: 'S-03', status: 'active' },
    { code: 'STB-X04-L1', name: '1层', type: 'shelf', tempZone: 'RT', parentCode: 'STB-X04', status: 'active' },
    { code: 'STB-X04-L1-A', name: 'A盒', type: 'box', tempZone: 'RT', parentCode: 'STB-X04-L1', status: 'active', capacity: 40 },

    // ---- 留样区（对接留样台账历史数据：留样室A/B/C） ----
    { code: 'LYA', name: '留样室A', type: 'room', tempZone: 'COOL', parentCode: '', status: 'active' },
    { code: 'LYA-A01', name: 'A-01柜', type: 'cabinet', tempZone: 'COOL', parentCode: 'LYA', status: 'active' },
    { code: 'LYA-A01-L1', name: '1层', type: 'shelf', tempZone: 'COOL', parentCode: 'LYA-A01', status: 'active' },
    { code: 'LYA-A03', name: 'A-03柜', type: 'cabinet', tempZone: 'COOL', parentCode: 'LYA', status: 'active' },
    { code: 'LYA-A03-L2', name: '2层', type: 'shelf', tempZone: 'COOL', parentCode: 'LYA-A03', status: 'active' },
    { code: 'LYA-B01', name: 'B-01柜', type: 'cabinet', tempZone: 'COOL', parentCode: 'LYA', status: 'active' },
    { code: 'LYA-B01-L1', name: '1层', type: 'shelf', tempZone: 'COOL', parentCode: 'LYA-B01', status: 'active' },
    { code: 'LYA-B04', name: 'B-04柜', type: 'cabinet', tempZone: 'COOL', parentCode: 'LYA', status: 'active' },
    { code: 'LYA-B04-L2', name: '2层', type: 'shelf', tempZone: 'COOL', parentCode: 'LYA-B04', status: 'active' },
    { code: 'LYA-C01', name: 'C-01柜', type: 'cabinet', tempZone: 'COOL', parentCode: 'LYA', status: 'active' },
    { code: 'LYA-C01-L1', name: '1层', type: 'shelf', tempZone: 'COOL', parentCode: 'LYA-C01', status: 'active' },
    { code: 'LYA-C02', name: 'C-02柜', type: 'cabinet', tempZone: 'COOL', parentCode: 'LYA', status: 'active' },
    { code: 'LYA-C02-L3', name: '3层', type: 'shelf', tempZone: 'COOL', parentCode: 'LYA-C02', status: 'active' },
    { code: 'LYA-C03', name: 'C-03柜', type: 'cabinet', tempZone: 'COOL', parentCode: 'LYA', status: 'active' },
    { code: 'LYA-C03-L1', name: '1层', type: 'shelf', tempZone: 'COOL', parentCode: 'LYA-C03', status: 'active' },

    { code: 'LYB', name: '留样室B', type: 'room', tempZone: 'COOL', parentCode: '', status: 'active' },
    { code: 'LYB-A01', name: 'A-01柜', type: 'cabinet', tempZone: 'COOL', parentCode: 'LYB', status: 'active' },
    { code: 'LYB-A01-L1', name: '1层', type: 'shelf', tempZone: 'COOL', parentCode: 'LYB-A01', status: 'active' },
    { code: 'LYB-A02', name: 'A-02柜', type: 'cabinet', tempZone: 'COOL', parentCode: 'LYB', status: 'active' },
    { code: 'LYB-A02-L2', name: '2层', type: 'shelf', tempZone: 'COOL', parentCode: 'LYB-A02', status: 'active' },
    { code: 'LYB-B02', name: 'B-02柜', type: 'cabinet', tempZone: 'COOL', parentCode: 'LYB', status: 'active' },
    { code: 'LYB-B02-L1', name: '1层', type: 'shelf', tempZone: 'COOL', parentCode: 'LYB-B02', status: 'active' },

    { code: 'LYC', name: '留样室C', type: 'room', tempZone: 'COOL', parentCode: '', status: 'active' },
    { code: 'LYC-B01', name: 'B-01柜', type: 'cabinet', tempZone: 'COOL', parentCode: 'LYC', status: 'active' },
    { code: 'LYC-B01-L3', name: '3层', type: 'shelf', tempZone: 'COOL', parentCode: 'LYC-B01', status: 'active' }
  ];

  /* ==================== 查询 API ==================== */

  function getNode(code) {
    return tree.find(n => n.code === code) || null;
  }

  function getChildren(code) {
    return tree.filter(n => n.parentCode === code);
  }

  function getRoots() {
    return tree.filter(n => !n.parentCode);
  }

  // 从根到该节点的链路 [{code,name,type,tempZone}]
  function pathSegments(code) {
    const segs = [];
    let node = getNode(code);
    while (node) {
      segs.unshift(node);
      node = node.parentCode ? getNode(node.parentCode) : null;
    }
    return segs;
  }

  function breadcrumbText(code) {
    const node = getNode(code);
    if (!node) return '';
    return pathSegments(code).map(s => s.name).join(' / ');
  }

  function breadcrumbHtml(code, style) {
    const node = getNode(code);
    if (!node) return '<span style="color:var(--text-muted);">—</span>';
    const st = style || 'font-size:12px;color:#1E3A5F;';
    // 各段名称单独 esc；分隔符 span 不能再整体 esc（会把标签转义成文本）
    return '<span style="' + st + '">' +
      pathSegments(code).map(s => esc(s.name)).join(' <span style="color:#c4cbd4;">/</span> ') +
      '</span>';
  }

  // 该节点的全部子孙 code（含自身）
  function descendants(code) {
    const out = [code];
    const walk = c => getChildren(c).forEach(ch => { out.push(ch.code); walk(ch.code); });
    walk(code);
    return out;
  }

  function typeName(code) {
    const t = NODE_TYPES.find(x => x.code === code);
    return t ? t.name : code;
  }

  function tempZoneMeta(code) {
    return TEMP_ZONES.find(x => x.code === code) || { code: code, name: code || '—', badge: 'badge-gray' };
  }

  /* ==================== 占用统计（供应商模式） ==================== */

  // 各台账注册 provider: () => [{ locCode }]，core 不依赖任何页面对象
  const _providers = [];
  function addProvider(fn) {
    if (typeof fn === 'function' && _providers.indexOf(fn) === -1) _providers.push(fn);
  }

  function _usageMap() {
    const map = {};
    _providers.forEach(fn => {
      let records = [];
      try { records = fn() || []; } catch (e) { /* 页面未加载时忽略 */ }
      records.forEach(r => {
        if (r && r.locCode) map[r.locCode] = (map[r.locCode] || 0) + 1;
      });
    });
    return map;
  }

  // 节点自身占用量
  function occupancy(code) {
    return _usageMap()[code] || 0;
  }

  // 节点含子孙的占用量（停用校验用）
  function occupancyDeep(code) {
    const map = _usageMap();
    return descendants(code).reduce((sum, c) => sum + (map[c] || 0), 0);
  }

  // 按位置（含子孙）反查在库样品：返回 [{ source, record }]
  function findByLocation(code) {
    const codes = {};
    descendants(code).forEach(c => { codes[c] = true; });
    const hits = [];
    _providers.forEach(fn => {
      let records = [];
      try { records = fn() || []; } catch (e) { /* ignore */ }
      records.forEach(r => {
        if (r && r.locCode && codes[r.locCode]) hits.push(r);
      });
    });
    return hits;
  }

  /* ==================== 写操作 ==================== */

  function addChild(parentCode, node) {
    tree.push(Object.assign({ status: 'active' }, node, { parentCode: parentCode || '' }));
    return getNode(node.code);
  }

  function updateNode(code, patch) {
    const node = getNode(code);
    if (!node) return null;
    Object.assign(node, patch);
    return node;
  }

  function setStatus(code, status) {
    const node = getNode(code);
    if (!node) return { ok: false, msg: '位置不存在' };
    if (status === 'inactive' && occupancyDeep(code) > 0) {
      return { ok: false, msg: '该位置（含下层）仍有 ' + occupancyDeep(code) + ' 个在库样品占用，不能停用' };
    }
    node.status = status;
    return { ok: true };
  }

  // 编辑节点名称后，重算全树 path 冗余字段（当前数据用 pathSegments 即时计算，此处留作后端化预留）
  function rebuildPaths() { /* breadcrumb 即时计算，无需冗余字段；接口保留 */ }

  /* ==================== 级联选择器 ==================== */

  // 渲染级联选择器容器（自顶向下逐级出现）
  function cascadeHtml(containerId) {
    return '<div id="' + esc(containerId) + '" data-sl-cascade="1"></div>';
  }

  function _selHtml(level, children, selected) {
    // 标签按子级实际类型自适应（样品间下可能是冰箱也可能是柜）
    const label = children.length ? typeName(children[0].type) : '位置';
    const opts = ['<option value="">— 请选择 —</option>']
      .concat(children.map(n => {
        const occ = occupancy(n.code);
        const tag = occ > 0 ? '（' + occ + ' 样）' : '';
        return '<option value="' + esc(n.code) + '"' + (selected === n.code ? ' selected' : '') + '>' +
          esc(n.name) + tag + '</option>';
      })).join('');
    return '<div class="form-group" style="margin-bottom:10px;"><label>' + esc(label) + '</label>' +
      '<select data-sl-level="' + level + '">' + opts + '</select></div>';
  }

  // 绑定级联行为：containerId 内每次选择追加下一级 select；当前选中叶子 code 写入 box.dataset.slValue
  // initCode：回显已选位置（沿链路逐级预选）
  function bindCascade(containerId, onReady, initCode) {
    const box = document.getElementById(containerId);
    if (!box) return;
    let current = ''; // 当前最深层选中 code
    const segs = initCode ? pathSegments(initCode) : [];

    function renderLevel(parentCode, level, preselect) {
      const children = parentCode ? getChildren(parentCode).filter(n => n.status === 'active') : getRoots().filter(n => n.status === 'active');
      // 移除更深级别的 select
      box.querySelectorAll('select[data-sl-level]').forEach(s => {
        if (Number(s.dataset.slLevel) > level) s.closest('.form-group').remove();
      });
      if (!children.length) {
        box.dataset.slValue = current || parentCode || '';
        if (onReady) onReady(box.dataset.slValue);
        return;
      }
      if (box.querySelector('select[data-sl-level="' + level + '"]')) return; // 已存在
      box.insertAdjacentHTML('beforeend', _selHtml(level, children, preselect || ''));
      const sel = box.querySelector('select[data-sl-level="' + level + '"]');
      sel.addEventListener('change', function () {
        if (!this.value) {
          current = '';
          box.dataset.slValue = current;
          box.querySelectorAll('select[data-sl-level]').forEach(s => {
            if (Number(s.dataset.slLevel) > level) s.closest('.form-group').remove();
          });
          if (onReady) onReady('');
          return;
        }
        current = this.value;
        box.dataset.slValue = current;
        renderLevel(current, level + 1, '');
        if (onReady) onReady(current);
      });
      if (preselect) {
        current = preselect;
        box.dataset.slValue = preselect;
        renderLevel(preselect, level + 1, segs[level + 1] ? segs[level + 1].code : '');
        if (onReady) onReady(preselect);
      }
    }

    box.innerHTML = '';
    box.dataset.slValue = '';
    renderLevel('', 0, segs[0] ? segs[0].code : '');
  }

  /* ==================== 位置选择弹窗 ==================== */

  /**
   * 通用位置选择弹窗
   * @param {Object} opts  { title, currentNode（当前已选，可空）, onPick(code) }
   */
  function pick(opts) {
    opts = opts || {};
    const cid = 'slCascadeBox';
    showModal(opts.title || '选择存放位置', `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:10px 16px;margin-bottom:14px;font-size:13px;">
          逐级选择到存放位置（盒 / 层级均可作为位置）；括号内为当前占用样品数。
        </div>
        ${cascadeHtml(cid)}
        <div class="form-group" style="margin-top:12px;">
          <label>已选位置路径</label>
          <div id="slPickPreview" style="min-height:22px;">${breadcrumbHtml(opts.currentNode || '')}</div>
        </div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认选择', cls: 'btn-primary', action: () => {
        const code = (document.getElementById(cid) || {}).dataset ? document.getElementById(cid).dataset.slValue : '';
        if (!code) { toast('请先选择存放位置'); return; }
        closeModal();
        if (opts.onPick) opts.onPick(code);
      } }
    ], 'modal-md');

    bindCascade(cid, function (code) {
      const prev = document.getElementById('slPickPreview');
      if (prev) prev.innerHTML = breadcrumbHtml(code);
    }, opts.currentNode || '');
  }

  /* ==================== 工具 ==================== */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, m =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
  }

  return {
    NODE_TYPES, TEMP_ZONES,
    get tree() { return tree; },
    getNode, getChildren, getRoots, pathSegments, breadcrumbText, breadcrumbHtml,
    descendants, typeName, tempZoneMeta,
    addProvider, occupancy, occupancyDeep, findByLocation,
    addChild, updateNode, setStatus, rebuildPaths,
    cascadeHtml, bindCascade, pick
  };
})();
