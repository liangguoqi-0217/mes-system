// ===== 位置管理页面 =====
// 质量管理 → 质量主数据 → 位置管理（样品位置树公共主数据）
//
// 设计原则：
//   1. 位置树是样品台账与留样台账共用的公共主数据，core 逻辑在 js/core/sample-locations.js；
//   2. 本页只做树形维护：新增子位置 / 编辑 / 停用（校验占用）/ 启用 / 按位置反查样品；
//   3. 位置结构（怎么分区、编码几位、冰箱怎么编）由 QC 自定，系统只提供层级模型；
//   4. 每个节点显示在库占用数，停用前校验"含子孙节点无在库样品"。

const SampleLocationPage = {
  expanded: {},          // 展开状态 { code: true }
  keyword: '',
  selected: '',          // 当前选中节点

  // ==================== 页面骨架 ====================

  render() {
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">位置管理</div>
            <div style="font-size:13px;opacity:0.85;">样品位置树 · 房间 → 冰箱/柜 → 层 → 盒 · 样品台账与留样台账共用</div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
              onclick="SampleLocationPage.openEdit('', null)">+ 新增样品间/留样室</button>
          </div>
        </div>

        <div style="flex:1;display:flex;overflow:hidden;">
          <div style="width:340px;flex-shrink:0;border-right:1px solid var(--border);display:flex;flex-direction:column;background:#fff;">
            <div style="padding:12px 14px;border-bottom:1px solid var(--border);">
              <input type="text" id="slTreeKeyword" placeholder="搜索位置名称 / 编码，回车搜索"
                style="width:100%;" onkeydown="if(event.key==='Enter')SampleLocationPage.searchTree()">
            </div>
            <div id="slTreePanel" style="flex:1;overflow:auto;padding:8px 6px;"></div>
          </div>
          <div id="slNodeDetail" style="flex:1;overflow:auto;padding:20px 24px;background:#f8fafc;"></div>
        </div>
      </div>`;
  },

  init() {
    this.renderTree();
    if (this.selected && SampleLocations.getNode(this.selected)) {
      this.renderDetail(this.selected);
    } else {
      this.renderDetailEmpty();
    }
  },

  searchTree() {
    this.keyword = (document.getElementById('slTreeKeyword') || {}).value || '';
    this.renderTree();
  },

  // ==================== 树渲染 ====================

  renderTree() {
    const el = document.getElementById('slTreePanel');
    if (!el) return;
    const kw = this.keyword.trim().toLowerCase();
    // 搜索时自动展开匹配节点的祖先
    const mustExpand = {};
    if (kw) {
      SampleLocations.tree.forEach(n => {
        if ((n.name + ' ' + n.code).toLowerCase().indexOf(kw) !== -1) {
          let p = n.parentCode;
          while (p) { mustExpand[p] = true; const pn = SampleLocations.getNode(p); p = pn ? pn.parentCode : ''; }
        }
      });
      Object.assign(this.expanded, mustExpand);
    }
    const roots = SampleLocations.getRoots().filter(r => !kw ||
      (r.name + ' ' + r.code).toLowerCase().indexOf(kw) !== -1 ||
      this._hasMatchDescendant(r.code, kw));
    el.innerHTML = roots.map(r => this._treeNodeHtml(r, 0, kw)).join('') ||
      '<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:13px;">未找到匹配位置</div>';
  },

  _hasMatchDescendant(code, kw) {
    return SampleLocations.getChildren(code).some(c =>
      (c.name + ' ' + c.code).toLowerCase().indexOf(kw) !== -1 || this._hasMatchDescendant(c.code, kw));
  },

  _treeNodeHtml(node, depth, kw) {
    const children = SampleLocations.getChildren(node.code);
    const isOpen = this.expanded[node.code] || !!kw;
    const showChildren = isOpen && (!kw || children.some(c =>
      (c.name + ' ' + c.code).toLowerCase().indexOf(kw) !== -1 || this._hasMatchDescendant(c.code, kw)));
    const occ = SampleLocations.occupancyDeep(node.code);
    const inactive = node.status === 'inactive';
    const selectedCls = this.selected === node.code ? 'background:#eff6ff;border-radius:6px;' : '';
    const arrow = children.length
      ? `<span onclick="event.stopPropagation();SampleLocationPage.toggleExpand('${node.code}')"
           style="display:inline-flex;width:16px;justify-content:center;cursor:pointer;color:var(--text-muted);font-size:10px;">${isOpen ? '▼' : '▶'}</span>`
      : '<span style="display:inline-flex;width:16px;justify-content:center;color:#d1d5db;font-size:10px;">•</span>';

    let html = `
      <div onclick="SampleLocationPage.selectNode('${node.code}')"
        style="display:flex;align-items:center;gap:4px;padding:5px 6px;cursor:pointer;${selectedCls}${inactive ? 'opacity:.5;' : ''}"
        onmouseover="this.style.background='${this.selected === node.code ? '#eff6ff' : '#f8fafc'}'"
        onmouseout="this.style.background='${this.selected === node.code ? '#eff6ff' : 'transparent'}'">
        ${arrow}
        <span style="font-size:13px;${node.code === this.selected ? 'font-weight:700;color:#1E3A5F;' : ''}">${esc(node.name)}</span>
        ${occ > 0 ? `<span class="badge badge-blue" style="font-size:10px;padding:0 6px;">${occ}</span>` : ''}
        ${inactive ? '<span class="badge badge-gray" style="font-size:10px;padding:0 6px;">停用</span>' : ''}
      </div>`;
    if (showChildren) {
      const kids = children.filter(c => !kw ||
        (c.name + ' ' + c.code).toLowerCase().indexOf(kw) !== -1 || this._hasMatchDescendant(c.code, kw));
      html += '<div style="padding-left:' + (depth * 14 + 14) + 'px;">' +
        kids.map(c => this._treeNodeHtml(c, depth + 1, kw)).join('') + '</div>';
    }
    return html;
  },

  toggleExpand(code) {
    this.expanded[code] = !this.expanded[code];
    this.renderTree();
  },

  selectNode(code) {
    this.selected = code;
    this.expanded[code] = true;
    this.renderTree();
    this.renderDetail(code);
  },

  // ==================== 节点详情 ====================

  renderDetailEmpty() {
    const el = document.getElementById('slNodeDetail');
    if (el) el.innerHTML = `
      <div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-muted);">
        <div style="font-size:40px;margin-bottom:10px;">🗂</div>
        <div style="font-size:14px;">点击左侧位置查看与维护</div>
        <div style="font-size:12px;margin-top:6px;">位置结构由 QC 自定，系统只提供层级模型</div>
      </div>`;
  },

  renderDetail(code) {
    const el = document.getElementById('slNodeDetail');
    const n = SampleLocations.getNode(code);
    if (!el || !n) return;
    const children = SampleLocations.getChildren(code);
    const occ = SampleLocations.occupancy(code);
    const occDeep = SampleLocations.occupancyDeep(code);
    const tz = SampleLocations.tempZoneMeta(n.tempZone);
    const inactive = n.status === 'inactive';

    const childRows = children.length ? `
      <div style="margin-top:20px;">
        <div style="font-size:14px;font-weight:700;margin-bottom:10px;">下级位置（${children.length}）</div>
        <table class="data-table">
          <thead><tr><th style="width:150px;">编码</th><th>名称</th><th style="width:110px;">类型</th><th style="width:110px;">在库样品</th><th style="width:90px;">状态</th><th style="width:170px;">操作</th></tr></thead>
          <tbody>${children.map(c => `<tr>
            <td style="font-family:monospace;font-size:12px;">${esc(c.code)}</td>
            <td style="font-size:13px;">${esc(c.name)}</td>
            <td style="font-size:12px;">${esc(SampleLocations.typeName(c.type))}</td>
            <td style="font-size:12px;">${SampleLocations.occupancy(c.code) || '—'}</td>
            <td>${c.status === 'inactive' ? '<span class="badge badge-gray">停用</span>' : '<span class="badge badge-green">启用</span>'}</td>
            <td><button class="btn btn-blue btn-sm" onclick="SampleLocationPage.selectNode('${c.code}')">查看</button></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>` : '';

    el.innerHTML = `
      <div style="max-width:960px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;">
          <div>
            <div style="font-size:20px;font-weight:700;color:#1E3A5F;">${esc(n.name)}
              ${inactive ? '<span class="badge badge-gray" style="margin-left:8px;">已停用</span>' : ''}</div>
            <div style="margin-top:6px;">${SampleLocations.breadcrumbHtml(code, 'font-size:13px;color:var(--text-secondary);')}</div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-blue btn-sm" onclick="SampleLocationPage.openUsage('${code}')">反查样品</button>
            <button class="btn btn-primary btn-sm" onclick="SampleLocationPage.openEdit('${code}', null)">+ 新增下级位置</button>
            <button class="btn btn-sm" onclick="SampleLocationPage.openEdit('${SampleLocations.getNode(code).parentCode || ''}', '${code}')">编辑</button>
            <button class="btn ${inactive ? 'btn-primary' : 'btn-danger'} btn-sm" onclick="SampleLocationPage.toggleStatus('${code}')">${inactive ? '启用' : '停用'}</button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px 24px;background:#fff;border:1px solid var(--border);border-radius:10px;padding:16px 20px;">
          <div><span style="color:var(--text-muted);font-size:12px;">位置编码</span>
            <div style="font-family:monospace;font-weight:600;color:#1E3A5F;">${esc(n.code)}</div></div>
          <div><span style="color:var(--text-muted);font-size:12px;">类型</span>
            <div>${esc(SampleLocations.typeName(n.type))}</div></div>
          <div><span style="color:var(--text-muted);font-size:12px;">温区</span>
            <div><span class="badge ${tz.badge}">${esc(tz.name)}</span></div></div>
          <div><span style="color:var(--text-muted);font-size:12px;">本级在库样品</span>
            <div style="font-weight:700;">${occ}</div></div>
          <div><span style="color:var(--text-muted);font-size:12px;">含下级在库样品</span>
            <div style="font-weight:700;">${occDeep}</div></div>
          <div><span style="color:var(--text-muted);font-size:12px;">容量（盒位参考）</span>
            <div>${n.capacity ? esc(n.capacity) + ' 位' : '—'}</div></div>
        </div>
        ${childRows}
      </div>`;
  },

  // ==================== 新增 / 编辑 ====================

  // parentCode 为空表示新增根级（样品间/留样室）；editCode 非空表示编辑该节点
  openEdit(parentCode, editCode) {
    const parent = parentCode ? SampleLocations.getNode(parentCode) : null;
    const editing = editCode ? SampleLocations.getNode(editCode) : null;
    const typeOpts = SampleLocations.NODE_TYPES
      .map(t => `<option value="${t.code}" ${editing && editing.type === t.code ? 'selected' : ''}>${t.name}</option>`).join('');
    const tzOpts = SampleLocations.TEMP_ZONES
      .map(t => `<option value="${t.code}" ${editing && editing.tempZone === t.code ? 'selected' : ''}>${t.name}</option>`).join('');

    showModal(editing ? '编辑位置 — ' + editing.name : (parent ? '新增下级位置 — ' + parent.name : '新增样品间 / 留样室'), `
      <div style="padding:4px 0;">
        ${parent ? `<div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:10px 16px;margin-bottom:14px;font-size:13px;">
          上级位置：${SampleLocations.breadcrumbHtml(parent.code)}</div>` : ''}
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>位置编码 <span class="req">*</span></label>
            <input type="text" id="sleCode" value="${editing ? esc(editing.code) : ''}" ${editing ? 'readonly style="background:#f3f4f6;"' : 'placeholder="如 FRZ-01-L1-A"'}></div>
          <div class="form-group"><label>名称 <span class="req">*</span></label>
            <input type="text" id="sleName" value="${editing ? esc(editing.name) : ''}" placeholder="如 B盒"></div>
          <div class="form-group"><label>类型 <span class="req">*</span></label><select id="sleType">${typeOpts}</select></div>
          <div class="form-group"><label>温区</label><select id="sleTz">${tzOpts}</select></div>
          <div class="form-group"><label>容量（选填）</label>
            <input type="text" id="sleCap" value="${editing && editing.capacity ? editing.capacity : ''}" placeholder="如 30"></div>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-muted);">编码全局唯一，创建后不可修改；位置结构由 QC 自定。</div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: editing ? '保存修改' : '确认新增', cls: 'btn-primary', action: () =>
        SampleLocationPage.submitEdit(parentCode, editCode) }
    ], 'modal-md');
  },

  submitEdit(parentCode, editCode) {
    const code = ((document.getElementById('sleCode') || {}).value || '').trim();
    const name = ((document.getElementById('sleName') || {}).value || '').trim();
    if (!name) return toast('请填写名称');
    if (editCode) {
      const r = SampleLocations.updateNode(editCode, {
        name: name,
        type: (document.getElementById('sleType') || {}).value,
        tempZone: (document.getElementById('sleTz') || {}).value,
        capacity: Number((document.getElementById('sleCap') || {}).value) || undefined
      });
      if (!r) return toast('位置不存在');
      closeModal(); this.renderTree(); this.renderDetail(editCode);
      toast('位置已更新');
    } else {
      if (!code) return toast('请填写位置编码');
      if (SampleLocations.getNode(code)) return toast('位置编码已存在：' + code);
      SampleLocations.addChild(parentCode || '', {
        code: code,
        name: name,
        type: (document.getElementById('sleType') || {}).value,
        tempZone: (document.getElementById('sleTz') || {}).value,
        capacity: Number((document.getElementById('sleCap') || {}).value) || undefined,
        status: 'active'
      });
      closeModal();
      this.expanded[code] = true;
      if (parentCode) this.expanded[parentCode] = true;
      this.selected = code;
      this.renderTree(); this.renderDetail(code);
      toast('位置已新增：' + name);
    }
  },

  toggleStatus(code) {
    const n = SampleLocations.getNode(code);
    if (!n) return;
    const target = n.status === 'inactive' ? 'active' : 'inactive';
    const r = SampleLocations.setStatus(code, target);
    if (!r.ok) return toast(r.msg);
    this.renderTree(); this.renderDetail(code);
    toast(target === 'inactive' ? '位置已停用' : '位置已启用');
  },

  // ==================== 按位置反查样品 ====================

  openUsage(code) {
    const hits = SampleLocations.findByLocation(code);
    const rows = hits.length ? hits.map(h => {
      const r = h.record || h;
      const src = h.source === 'retention' ? '留样' : (h.source === 'ledger' ? '检验样品' : '');
      return `<tr>
        <td style="font-family:monospace;font-size:12px;color:#1E3A5F;font-weight:600;">${esc(r.sampleNo)}</td>
        <td><span class="badge ${h.source === 'retention' ? 'badge-purple' : 'badge-blue'}" style="font-size:11px;">${src}</span></td>
        <td>${esc(r.materialName || '—')}<div style="color:var(--text-muted);font-family:monospace;font-size:11px;">${esc(r.materialCode || '')}</div></td>
        <td style="font-size:12px;">${esc(r.remainQty != null ? r.remainQty + ' ' + (r.unit || '') : '—')}</td>
        <td style="font-size:12px;">${esc(r.statusName || r.status || '')}</td>
      </tr>`;
    }).join('') : `<tr><td colspan="5" class="empty-cell">该位置（含下级）暂无在库样品</td></tr>`;

    showModal('位置反查样品 — ' + SampleLocations.getNode(code).name, `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:10px 16px;margin-bottom:14px;font-size:13px;">
          ${SampleLocations.breadcrumbHtml(code)} · 共 ${hits.length} 个在库样品
        </div>
        <table class="data-table">
          <thead><tr><th style="width:170px;">样品编号</th><th style="width:90px;">来源</th><th>物料</th><th style="width:120px;">余量</th><th style="width:100px;">状态</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`, [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-lg');
  }
};
