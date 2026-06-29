// ===== Functional Location Page =====
const FunctionalLocation = {
  selectedNode: null,
  expandedNodes: new Set(),
  treeData: flMockData.tree,
  searchTerm: '',
  searchResults: null,
  searchFilters: { factory: '', code: '', level: '' },
  levelOptions: [
    { value:'1', label:'1 - 工厂' },
    { value:'2', label:'2 - 车间' },
    { value:'3', label:'3 - 产线' },
    { value:'4', label:'4 - 工位' }
  ],

  _isAdmin() {
    return (window.currentUserRole || 'admin') === 'admin';
  },

  render() {
    const createBtn = this._isAdmin()
      ? '<button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3);" onclick="FunctionalLocation.createModal()">+ 创建功能位置</button>'
      : '';
    return `
      <div class="two-panel">
        <div class="left-panel">
          <div class="left-panel-header">
            <div class="left-panel-title">功能位置结构</div>
          </div>
          <div class="left-panel-body" id="flTreeContainer">
            ${this.renderTree()}
          </div>
        </div>
        <div class="right-panel">
          <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
            <div><div style="font-size:16px;font-weight:700;">功能位置管理</div><div style="font-size:12px;opacity:0.8;">位置层级结构管理</div></div>
            ${createBtn}
          </div>
          <div class="filter-bar" style="flex-shrink:0;">
            <div class="filter-group"><label>所属工厂</label><select id="flFilterFactory">
              <option value="">全部</option>
              ${this._renderFactoryOptions()}
            </select></div>
            <div class="filter-group"><label>功能位置编码</label><input type="text" id="flFilterCode" placeholder="模糊查询"></div>
            <div class="filter-group"><label>层级</label><select id="flFilterLevel">
              <option value="">全部</option>
              ${this.levelOptions.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
            </select></div>
            <div class="filter-actions">
              <button class="btn btn-primary btn-sm" onclick="FunctionalLocation.search()">查询</button>
              <button class="btn btn-secondary btn-sm" onclick="FunctionalLocation.reset()">重置</button>
            </div>
          </div>
          <div style="flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-muted);" id="flPlaceholder">
            <div style="text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;color:#cbd5e1;">&#9776;</div>
              <div style="font-size:15px;">请从左侧选择一个功能位置查看其下层级</div>
            </div>
          </div>
          <div id="flTablePanel" style="flex:1;overflow:hidden;display:none;"></div>
        </div>
      </div>`;
  },

  init() {
    this.searchFilters = { factory: '', code: '', level: '' };
    this.expandedNodes = new Set();
    this.treeData.forEach(n => {
      if (n.children && n.children.length > 0) this.expandedNodes.add(n.id);
    });
    this.renderTree();
    // 默认加载第一个根节点（工厂），展示所有功能位置
    if (this.treeData.length > 0) {
      this.selectedNode = this.treeData[0];
      this.renderTree();
      this.showTable(this.treeData[0]);
    }
  },

  _renderFactoryOptions() {
    return this.treeData.map(n => `<option value="${esc(n.code)}">${esc(n.name)}</option>`).join('');
  },

  search() {
    const factoryEl = document.getElementById('flFilterFactory');
    const codeEl = document.getElementById('flFilterCode');
    const levelEl = document.getElementById('flFilterLevel');
    const factory = factoryEl ? factoryEl.value : '';
    const code = codeEl ? codeEl.value.trim() : '';
    const level = levelEl ? levelEl.value : '';

    this.searchFilters = { factory, code, level };
    this.searchTerm = [factory, code, level].filter(Boolean).join('|');

    if (!factory && !code && !level) {
      this.searchResults = null;
      this.searchTerm = '';
      if (this.selectedNode) { this.showTable(this.selectedNode); }
      this.renderTree();
      return;
    }

    const results = [];
    const walk = (nodes, path) => {
      nodes.forEach(n => {
        let match = true;
        if (factory) match = match && (n.code === factory || n.code.startsWith(factory + '-'));
        if (code) match = match && n.code.toUpperCase().includes(code.toUpperCase());
        if (level) match = match && String(n.level) === level;
        if (match) results.push({ node: n, path: [...path, n.id] });
        if (n.children) walk(n.children, [...path, n.id]);
      });
    };
    walk(this.treeData, []);
    this.searchResults = results;
    if (results.length > 0) {
      results.forEach(r => { r.path.forEach(id => this.expandedNodes.add(id)); });
      this.selectedNode = results[0].node;
      this.showTable(results[0].node);
    } else {
      this.selectedNode = null;
      const placeholder = document.getElementById('flPlaceholder');
      const panel = document.getElementById('flTablePanel');
      if (placeholder) placeholder.style.display = 'flex';
      if (panel) panel.style.display = 'none';
    }
    this.renderTree();
  },

  reset() {
    const factoryEl = document.getElementById('flFilterFactory');
    const codeEl = document.getElementById('flFilterCode');
    const levelEl = document.getElementById('flFilterLevel');
    if (factoryEl) factoryEl.value = '';
    if (codeEl) codeEl.value = '';
    if (levelEl) levelEl.value = '';
    this.searchFilters = { factory: '', code: '', level: '' };
    this.searchTerm = '';
    this.searchResults = null;
    if (this.selectedNode) { this.showTable(this.selectedNode); }
    this.renderTree();
  },

  renderTree() {
    const container = document.getElementById('flTreeContainer');
    if (!container) return '';
    let html = '';
    if (this.searchTerm && this.searchResults && this.searchResults.length === 0) {
      html = '<div style="text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">未找到匹配的功能位置</div>';
    } else {
      this.treeData.forEach((n, i) => html += this.renderTreeNode(n, 0, i === this.treeData.length - 1));
    }
    container.innerHTML = html;
  },

  highlightText(text) {
    if (!this.searchTerm) return esc(text);
    const escaped = esc(text);
    const term = esc(this.searchTerm);
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escaped.replace(regex, '<mark style="background:#fde68a;color:#92400e;padding:0 1px;border-radius:2px;">$1</mark>');
  },

  renderTreeNode(node, depth, isLast) {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = this.expandedNodes.has(node.id);
    const isSelected = this.selectedNode && this.selectedNode.id === node.id;
    const typeLabel = { plant:'厂区', workshop:'车间', production_line:'产线', workstation:'工位', auxiliary:'辅助区' };
    const eqCount = node.equipmentCount != null && node.equipmentCount > 0 ? ` <span style="font-size:11px;color:#94a3b8;">(${node.equipmentCount})</span>` : '';

    let prefix = '';
    if (depth > 0) {
      prefix = `<span style="display:inline-block;width:${depth*20}px;position:relative;">`;
      for (let i = 0; i < depth; i++) {
        prefix += `<span style="position:absolute;left:${i*20+9}px;top:0;bottom:0;width:0;border-left:1px solid #e2e8f0;"></span>`;
      }
      prefix += `</span>`;
    }

    const toggleArrow = hasChildren
      ? `<span class="tree-toggle" onclick="FunctionalLocation.toggleNode(event,'${node.id}')" style="cursor:pointer;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;color:#94a3b8;flex-shrink:0;border-radius:3px;background:#f1f5f9;">${isExpanded ? '&#9660;' : '&#9654;'}</span>`
      : `<span style="width:18px;flex-shrink:0;"></span>`;

    const statusColor = node.status === 'active' ? '#22c55e' : node.status === 'disabled' ? '#eab308' : '#ef4444';

    let html = `<div class="tree-row ${isSelected?'tree-row-active':''}" onclick="FunctionalLocation.selectNode('${node.id}')" style="display:flex;align-items:center;gap:4px;padding:6px 8px 6px 4px;cursor:pointer;border-radius:4px;margin:1px 0;transition:background .15s;font-size:13px;">
      ${prefix}
      ${toggleArrow}
      <span style="width:6px;height:6px;border-radius:50%;background:${statusColor};flex-shrink:0;margin:0 4px;"></span>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${this.highlightText(node.name)}</span>
      <span style="font-size:10px;color:#94a3b8;flex-shrink:0;">${typeLabel[node.type]||node.type}</span>
      ${eqCount}
    </div>`;

    if (hasChildren && isExpanded) {
      node.children.forEach((child, i) => {
        html += this.renderTreeNode(child, depth + 1, i === node.children.length - 1);
      });
    }
    return html;
  },

  toggleNode(e, nodeId) {
    e.stopPropagation();
    if (this.expandedNodes.has(nodeId)) {
      this.expandedNodes.delete(nodeId);
    } else {
      this.expandedNodes.add(nodeId);
    }
    this.renderTree();
  },

  selectNode(nodeId) {
    const found = this.findNode(this.treeData, nodeId);
    if (found) {
      this.selectedNode = found;
      this.renderTree();
      this.showTable(found);
    }
  },

  findNode(nodes, id) {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) {
        const found = this.findNode(n.children, id);
        if (found) return found;
      }
    }
    return null;
  },

  _getAllDescendants(node) {
    const result = [];
    const walk = (children) => {
      if (!children || !children.length) return;
      children.forEach(c => {
        result.push(c);
        walk(c.children);
      });
    };
    walk(node.children);
    result.sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return (a.code || '').localeCompare(b.code || '');
    });
    return result;
  },

  showTable(node) {
    const descendants = this._getAllDescendants(node);
    const typeLabel = { plant:'厂区', workshop:'车间', production_line:'产线', workstation:'工位', auxiliary:'辅助区' };
    const categoryMap = { production:'生产类', building:'建筑类', technical:'技术类' };

    const tableHtml = descendants.length ? `
      <div class="table-wrapper" style="flex:1;overflow:auto;">
        <table class="data-table">
          <thead><tr>
            <th>功能位置编码</th>
            <th>名称</th>
            <th>层级</th>
            <th>状态</th>
            <th>类别</th>
            <th>操作</th>
          </tr></thead>
          <tbody>
            ${descendants.map(d => `
              <tr>
                <td><span style="font-family:monospace;font-size:12px;">${esc(d.code)}</span></td>
                <td>${esc(d.name)}</td>
                <td>${d.level || '-'} - ${typeLabel[d.type]||d.type||'-'}</td>
                <td>${getFLStatusBadge(d.status)}</td>
                <td>${categoryMap[d.category]||d.category||'-'}</td>
                <td><button class="btn btn-outline btn-sm" onclick="FunctionalLocation.viewDetail('${d.id}')">查看</button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>` : `<div style="text-align:center;padding:60px 20px;color:var(--text-muted);"><div style="font-size:40px;margin-bottom:10px;">&#128203;</div><div>该层级下暂无功能位置</div></div>`;

    const headerHtml = `
      <div style="padding:14px 20px;background:white;border-bottom:1px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <span style="font-size:15px;font-weight:700;">${esc(node.name)}</span>
          <span style="font-size:12px;color:var(--text-secondary);margin-left:8px;">${esc(node.code)}</span>
        </div>
        <span style="font-size:12px;color:var(--text-muted);">共 <strong>${descendants.length}</strong> 个下级功能位置</span>
      </div>`;

    const panel = document.getElementById('flTablePanel');
    const placeholder = document.getElementById('flPlaceholder');
    if (panel) {
      panel.innerHTML = headerHtml + tableHtml;
      panel.style.display = 'flex';
      panel.style.flexDirection = 'column';
    }
    if (placeholder) placeholder.style.display = 'none';
  },

  viewDetail(nodeId) {
    const node = this.findNode(this.treeData, nodeId);
    if (!node) return;

    const categoryMap = { production:'生产类', building:'建筑类', technical:'技术类' };
    const plannerMap = { mechanical:'机械组', electrical:'电气组', instrument:'仪表组', general:'综合组' };
    const levelLabel = (lvl) => { const o = this.levelOptions.find(l => l.value === String(lvl)); return o ? o.label : lvl; };
    const parentName = this._getParentName(node);
    const validPeriod = (node.validFrom || node.validTo)
      ? `${esc(node.validFrom||'-')} ~ ${esc(node.validTo||'-')}`
      : '-';

    const docHtml = node.document && node.document !== '-'
      ? `<div style="display:flex;flex-wrap:wrap;gap:6px;">${node.document.split(';').filter(Boolean).map(f =>
        `<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;font-size:12px;color:#1d4ed8;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
          ${esc(f.trim())}
        </span>`).join('')}</div>`
      : '<span style="color:var(--text-muted);">暂无附件</span>';

    const isAdmin = this._isAdmin();
    const footerBtns = isAdmin
      ? [
          { text:'关闭',cls:'btn-secondary',action:closeModal },
          { text:'编辑',cls:'btn-primary',action:`()=>{ closeModal(); FunctionalLocation.editModal('${node.id}'); }` }
        ]
      : [{ text:'关闭',cls:'btn-secondary',action:closeModal }];

    showModal('功能位置详情', `
      <div style="padding:28px 32px 20px;background:white;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border);">
          <div>
            <div style="font-size:20px;font-weight:700;color:var(--text-primary);">${esc(node.name)}</div>
            <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">编码：${esc(node.code)}</div>
          </div>
          <span style="font-size:13px;color:var(--text-muted);background:#f1f5f9;padding:6px 14px;border-radius:8px;">${getFLTypeText(node.type)}</span>
        </div>
        <div class="detail-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:18px 28px;">
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">功能位置编码</dt><dd style="font-size:15px;font-weight:600;color:var(--text-primary);font-family:monospace;">${esc(node.code)}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">有效期</dt><dd style="font-size:14px;color:var(--text-primary);">${validPeriod}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;grid-column:span 2;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">功能位置描述</dt><dd style="font-size:14px;color:var(--text-primary);line-height:1.6;">${esc(node.description||'-')}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">功能位置类别</dt><dd style="font-size:14px;color:var(--text-primary);">${categoryMap[node.category]||node.category||'-'}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">层级</dt><dd style="font-size:14px;color:var(--text-primary);">${levelLabel(node.level)}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">功能位置状态</dt><dd style="font-size:14px;">${getFLStatusBadge(node.status)}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">工厂</dt><dd style="font-size:14px;color:var(--text-primary);">${esc(node.factory||'-')}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">成本中心</dt><dd style="font-size:14px;color:var(--text-primary);">${esc(node.costCenter||'-')}<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">用于维修费归集，且专属别墅</div></dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">计划员组</dt><dd style="font-size:14px;color:var(--text-primary);">${plannerMap[node.plannerGroup]||node.plannerGroup||'-'}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">上级功能位置</dt><dd style="font-size:14px;color:var(--text-primary);">${parentName}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">安装允许</dt><dd style="font-size:14px;">${node.allowInstall ? '<span class="badge badge-green">是</span> — 允许安装特种设备' : '<span class="badge badge-gray">否</span> — 不允许安装特种设备'}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;grid-column:span 2;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">地址</dt><dd style="font-size:14px;color:var(--text-primary);line-height:1.6;">${esc(node.address||'-')}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;grid-column:span 2;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">文档</dt><dd>${docHtml}</dd></div>
        </div>
      </div>`, footerBtns, 'modal-lg');
  },

  _getParentName(node) {
    if (!node.parentId) return '无（顶级位置）';
    const parent = this.findNode(this.treeData, node.parentId);
    return parent ? `${parent.name} (${parent.code})` : node.parentId;
  },

  createModal() {
    if (!this._isAdmin()) { toast('无操作权限，仅管理员可创建功能位置'); return; }
    const factoryOpts = this.treeData.map(n => `<option value="${esc(n.code)}">${esc(n.name)}</option>`).join('');
    const parentVal = this.selectedNode ? this.selectedNode.id : '';
    showModal('创建功能位置', `
      <div class="form-grid" style="padding:8px 0;">
        <div class="form-group"><label>功能位置编码<span class="req">*</span></label><input id="flFormCode" placeholder="如 FL1000-W01-L01"></div>
        <div class="form-group"><label>层级<span class="req">*</span></label>
          <select id="flFormLevel"><option value="">请选择层级</option>${this.levelOptions.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>有效期</label><input id="flFormValidFrom" type="date"> ~ <input id="flFormValidTo" type="date" style="margin-top:4px;"></div>
        <div class="form-group" style="grid-column:span 2;"><label>功能位置描述</label><textarea id="flFormDesc" rows="2" placeholder="功能位置详细描述"></textarea></div>
        <div class="form-group"><label>功能位置类别<span class="req">*</span></label>
          <select id="flFormCategory"><option value="">请选择</option><option value="production">生产类</option><option value="building">建筑类</option><option value="technical">技术类</option></select>
        </div>
        <div class="form-group"><label>功能位置状态</label>
          <select id="flFormStatus"><option value="active">正常启用</option><option value="disabled">临时停用</option><option value="invalid">永久作废</option></select>
        </div>
        <div class="form-group"><label>工厂<span class="req">*</span></label>
          <select id="flFormFactory"><option value="">请选择工厂</option>${factoryOpts}</select>
        </div>
        <div class="form-group"><label>成本中心</label><input id="flFormCostCenter" placeholder="如 CC-1000-W01"><div style="font-size:11px;color:var(--text-muted);">用于维修费归集，且专属别墅</div></div>
        <div class="form-group"><label>计划员组</label>
          <select id="flFormPlanner"><option value="">请选择</option><option value="mechanical">机械组</option><option value="electrical">电气组</option><option value="instrument">仪表组</option><option value="general">综合组</option></select>
        </div>
        <div class="form-group"><label>上级功能位置</label>
          <select id="flFormParent"><option value="">无（顶级位置）</option>${this._renderFlatOptions()}</select>
        </div>
        <div class="form-group"><label>安装允许</label>
          <select id="flFormAllowInstall"><option value="1">是 — 允许安装特种设备</option><option value="0">否 — 不允许安装特种设备</option></select>
        </div>
        <div class="form-group" style="grid-column:span 2;"><label>地址</label><input id="flFormAddress" placeholder="车间具体地址"></div>
        <div class="form-group" style="grid-column:span 2;">
          <label>文档附件</label>
          <div style="border:2px dashed #d1d5db;border-radius:10px;padding:20px;text-align:center;background:#fafbfc;cursor:pointer;" onclick="document.getElementById('flFormDocFile').click();">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="display:block;margin:0 auto 8px;"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <div style="font-size:13px;color:#64748b;">点击或拖拽文件到此处上传</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:4px;">支持 PDF、Word、DWG 等格式，单个文件不超过 50MB</div>
            <input id="flFormDocFile" type="file" multiple accept=".pdf,.doc,.docx,.dwg,.xlsx,.xls" onchange="FunctionalLocation._onFileSelect(this,'flFormDocList')" style="display:none;">
            <div id="flFormDocList" style="margin-top:10px;display:none;"></div>
          </div>
        </div>
      </div>`, [
        { text:'取消',cls:'btn-secondary',action:closeModal },
        { text:'保存',cls:'btn-primary',action:()=>{ toast('功能位置已创建！'); closeModal(); } }
      ], 'modal-lg');
    if (parentVal) {
      setTimeout(() => { const sel = document.getElementById('flFormParent'); if (sel) sel.value = parentVal; }, 50);
    }
  },

  _onFileSelect(input, listId) {
    const files = input.files;
    const container = document.getElementById(listId);
    if (!container) return;
    if (files && files.length > 0) {
      let html = '<div style="display:flex;flex-direction:column;gap:4px;margin-top:8px;">';
      for (let i = 0; i < files.length; i++) {
        html += `<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:white;border:1px solid #e2e8f0;border-radius:6px;font-size:12px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
          <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(files[i].name)}</span>
          <span style="color:var(--text-muted);">${(files[i].size/1024/1024).toFixed(1)}MB</span>
        </div>`;
      }
      html += '</div>';
      container.innerHTML = html;
      container.style.display = 'block';
    } else {
      container.innerHTML = '';
      container.style.display = 'none';
    }
  },

  _renderFlatOptions() {
    const opts = [];
    const walk = (nodes, depth) => {
      nodes.forEach(n => {
        const prefix = '\u00A0\u00A0'.repeat(depth);
        opts.push(`<option value="${esc(n.id)}">${prefix}${esc(n.name)} (${esc(n.code)})</option>`);
        if (n.children && n.children.length) walk(n.children, depth + 1);
      });
    };
    walk(this.treeData, 0);
    return opts.join('');
  },

  editModal(nodeId) {
    if (!this._isAdmin()) { toast('无操作权限，仅管理员可编辑'); return; }
    const node = this.findNode(this.treeData, nodeId);
    if (!node) return;

    const parentName = this._getParentName(node);
    const catSel = v => `value="${esc(v)}"${node.category===v?' selected':''}`;
    const stsSel = v => `value="${esc(v)}"${node.status===v?' selected':''}`;
    const plnSel = v => `value="${esc(v)}"${node.plannerGroup===v?' selected':''}`;
    const aiSel = v => `value="${esc(v)}"${node.allowInstall===(v==='1')?' selected':''}`;
    const lvlSel = v => `value="${esc(v)}"${String(node.level)===v?' selected':''}`;

    showModal('编辑功能位置', `
      <div class="form-grid" style="padding:8px 0;">
        <div class="form-group"><label>功能位置编码<span class="req">*</span></label><input value="${esc(node.code)}" readonly style="background:#f9fafb;"></div>
        <div class="form-group"><label>层级<span class="req">*</span></label>
          <select id="flEditLevel">${this.levelOptions.map(o => `<option ${lvlSel(o.value)}>${o.label}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>有效期</label><input id="flEditValidFrom" type="date" value="${esc(node.validFrom||'')}"> ~ <input id="flEditValidTo" type="date" value="${esc(node.validTo||'')}" style="margin-top:4px;"></div>
        <div class="form-group" style="grid-column:span 2;"><label>功能位置描述</label><textarea id="flEditDesc" rows="2">${esc(node.description||'')}</textarea></div>
        <div class="form-group"><label>功能位置类别<span class="req">*</span></label>
          <select id="flEditCategory"><option ${catSel('production')}>生产类</option><option ${catSel('building')}>建筑类</option><option ${catSel('technical')}>技术类</option></select>
        </div>
        <div class="form-group"><label>功能位置状态</label>
          <select id="flEditStatus"><option ${stsSel('active')}>正常启用</option><option ${stsSel('disabled')}>临时停用</option><option ${stsSel('invalid')}>永久作废</option></select>
        </div>
        <div class="form-group"><label>工厂</label><input value="${esc(node.factory||'')}" readonly style="background:#f9fafb;"></div>
        <div class="form-group"><label>成本中心</label><input id="flEditCostCenter" value="${esc(node.costCenter||'')}"><div style="font-size:11px;color:var(--text-muted);">用于维修费归集，且专属别墅</div></div>
        <div class="form-group"><label>计划员组</label>
          <select id="flEditPlanner"><option ${plnSel('mechanical')}>机械组</option><option ${plnSel('electrical')}>电气组</option><option ${plnSel('instrument')}>仪表组</option><option ${plnSel('general')}>综合组</option></select>
        </div>
        <div class="form-group"><label>上级功能位置</label><input value="${parentName}" readonly style="background:#f9fafb;"></div>
        <div class="form-group"><label>安装允许</label>
          <select id="flEditAllowInstall"><option ${aiSel('1')}>是 — 允许安装特种设备</option><option ${aiSel('0')}>否 — 不允许安装特种设备</option></select>
        </div>
        <div class="form-group" style="grid-column:span 2;"><label>地址</label><input id="flEditAddress" value="${esc(node.address||'')}"></div>
        <div class="form-group" style="grid-column:span 2;">
          <label>文档附件</label>
          <div style="border:2px dashed #d1d5db;border-radius:10px;padding:20px;text-align:center;background:#fafbfc;cursor:pointer;" onclick="document.getElementById('flEditDocFile').click();">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="display:block;margin:0 auto 8px;"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <div style="font-size:13px;color:#64748b;">点击或拖拽文件到此处上传</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:4px;">支持 PDF、Word、DWG 等格式，单个文件不超过 50MB</div>
            <input id="flEditDocFile" type="file" multiple accept=".pdf,.doc,.docx,.dwg,.xlsx,.xls" onchange="FunctionalLocation._onFileSelect(this,'flEditDocList')" style="display:none;">
            <div id="flEditDocList">
              ${node.document && node.document !== '-' ? `<div style="margin-top:10px;"><div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;">已有文件：</div>` + node.document.split(';').filter(Boolean).map(f => `
                <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:white;border:1px solid #e2e8f0;border-radius:6px;font-size:12px;margin-bottom:4px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
                  <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(f.trim())}</span>
                </div>`).join('') + '</div>' : ''}
            </div>
          </div>
        </div>
      </div>`, [
        { text:'取消',cls:'btn-secondary',action:closeModal },
        { text:'保存',cls:'btn-primary',action:()=>{ toast('更新成功！'); closeModal(); if(FunctionalLocation.selectedNode){ FunctionalLocation.showTable(FunctionalLocation.selectedNode); } } }
      ]);
  }
};
