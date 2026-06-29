// ===== Work Center Page =====
const WorkCenter = {
  selectedNode: null,
  expandedNodes: new Set(),
  orgTree: wcOrgTree,
  searchTerm: '',
  searchResults: null,
  searchFilters: { factory: '', code: '', name: '' },

  _isAdmin() {
    return (window.currentUserRole || 'admin') === 'admin';
  },

  render() {
    const createBtn = this._isAdmin()
      ? '<button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3);" onclick="WorkCenter.addModal()">+ 新增工作中心</button>'
      : '';
    return `
      <div class="two-panel">
        <div class="left-panel">
          <div class="left-panel-header">
            <div class="left-panel-title">组织架构</div>
          </div>
          <div class="left-panel-body" id="wcTreeContainer">
            ${this.renderOrgTree()}
          </div>
        </div>
        <div class="right-panel">
          <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
            <div><div style="font-size:16px;font-weight:700;">工作中心管理</div><div style="font-size:12px;opacity:0.8;">维修组织架构与能力管理</div></div>
            ${createBtn}
          </div>
          <div class="filter-bar" style="flex-shrink:0;">
            <div class="filter-group"><label>所属工厂</label><select id="wcFilterFactory">
              <option value="">全部</option>
              ${this._renderFactoryOptions()}
            </select></div>
            <div class="filter-group"><label>工作中心编码</label><input type="text" id="wcFilterCode" placeholder="模糊查询"></div>
            <div class="filter-group"><label>工作中心名称</label><input type="text" id="wcFilterName" placeholder="模糊查询"></div>
            <div class="filter-actions">
              <button class="btn btn-primary btn-sm" onclick="WorkCenter.search()">查询</button>
              <button class="btn btn-secondary btn-sm" onclick="WorkCenter.reset()">重置</button>
            </div>
          </div>
          <div style="flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-muted);" id="wcPlaceholder">
            <div style="text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;color:#cbd5e1;">&#9776;</div>
              <div style="font-size:15px;">请从左侧选择一个工厂或车间查看工作中心</div>
            </div>
          </div>
          <div id="wcTablePanel" style="flex:1;overflow:hidden;display:none;"></div>
        </div>
      </div>`;
  },

  init() {
    this.searchFilters = { factory: '', code: '', name: '' };
    this.expandedNodes = new Set();
    this.orgTree.forEach(n => this.expandedNodes.add(n.id));
    this.renderOrgTree();
    // 默认加载第一个根节点（工厂），展示所有工作中心
    if (this.orgTree.length > 0) {
      this.selectedNode = this.orgTree[0];
      this.renderOrgTree();
      this.showTable(this.orgTree[0]);
    }
  },

  _renderFactoryOptions() {
    return this.orgTree.map(n => `<option value="${esc(n.id)}">${esc(n.name)}</option>`).join('');
  },

  _getAllDescendants(node) {
    const result = [];
    const walk = (nodes) => {
      if (!nodes || !nodes.length) return;
      nodes.forEach(n => {
        if (n.type === 'workcenter') {
          const wc = wcMockData.find(w => w.id === n.id);
          if (wc) result.push(wc);
        }
        if (n.children) walk(n.children);
      });
    };
    if (node.type === 'workcenter') {
      const wc = wcMockData.find(w => w.id === node.id);
      if (wc) result.push(wc);
    }
    walk(node.children || []);
    result.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
    return result;
  },

  search() {
    const factoryEl = document.getElementById('wcFilterFactory');
    const codeEl = document.getElementById('wcFilterCode');
    const nameEl = document.getElementById('wcFilterName');
    const factory = factoryEl ? factoryEl.value : '';
    const code = codeEl ? codeEl.value.trim() : '';
    const name = nameEl ? nameEl.value.trim() : '';

    this.searchFilters = { factory, code, name };
    this.searchTerm = [factory, code, name].filter(Boolean).join('|');

    if (!this.selectedNode) return;

    let descendants = this._getAllDescendants(this.selectedNode);

    if (factory || code || name) {
      this.searchResults = descendants.filter(wc => {
        let match = true;
        if (factory) match = match && this._wcBelongsToFactory(wc, factory);
        if (code) match = match && wc.code.toUpperCase().includes(code.toUpperCase());
        if (name) match = match && wc.name.includes(name);
        return match;
      });
    } else {
      this.searchResults = null;
      this.searchTerm = '';
    }

    if (this.searchResults && this.searchResults.length === 0 && this.searchTerm) {
      this._showTable(descendants, 'empty');
    } else if (this.searchResults) {
      this._showTable(this.searchResults);
    } else {
      this._showTable(descendants);
    }
  },

  reset() {
    const factoryEl = document.getElementById('wcFilterFactory');
    const codeEl = document.getElementById('wcFilterCode');
    const nameEl = document.getElementById('wcFilterName');
    if (factoryEl) factoryEl.value = '';
    if (codeEl) codeEl.value = '';
    if (nameEl) nameEl.value = '';
    this.searchFilters = { factory: '', code: '', name: '' };
    this.searchTerm = '';
    this.searchResults = null;
    if (this.selectedNode) { this.showTable(this.selectedNode); }
  },

  _wcBelongsToFactory(wc, factoryId) {
    // Walk the tree to check if wc belongs to the given factory
    const factoryNode = this.findNode(this.orgTree, factoryId);
    if (!factoryNode) return false;
    const descendants = this._getDescendantIds(factoryNode);
    return descendants.has(wc.id);
  },

  _getDescendantIds(node) {
    const ids = new Set();
    const walk = (n) => {
      ids.add(n.id);
      if (n.children) n.children.forEach(c => walk(c));
    };
    walk(node);
    return ids;
  },

  renderOrgTree() {
    const container = document.getElementById('wcTreeContainer');
    if (!container) return '';
    let html = '';
    if (this.searchTerm && this.searchResults && this.searchResults.length === 0) {
      html = '<div style="text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">未找到匹配的工作中心</div>';
    } else {
      this.orgTree.forEach((n, i) => html += this.renderTreeNode(n, 0, i === this.orgTree.length - 1));
    }
    container.innerHTML = html;
  },

  highlightText(text) {
    if (!this.searchTerm) return esc(text);
    const escaped = esc(text);
    const terms = this.searchTerm.split('|').filter(Boolean);
    let result = escaped;
    terms.forEach(t => {
      const escapedTerm = esc(t);
      const regex = new RegExp(`(${escapedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      result = result.replace(regex, '<mark style="background:#fde68a;color:#92400e;padding:0 1px;border-radius:2px;">$1</mark>');
    });
    return result;
  },

  renderTreeNode(node, depth, isLast) {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = this.expandedNodes.has(node.id);
    const isSelected = this.selectedNode && this.selectedNode.id === node.id;
    const label = node.type === 'factory' ? '工厂' : node.type === 'workshop' ? '车间' : '工作中心';

    let prefix = '';
    if (depth > 0) {
      prefix = `<span style="display:inline-block;width:${depth*20}px;position:relative;">`;
      for (let i = 0; i < depth; i++) {
        prefix += `<span style="position:absolute;left:${i*20+9}px;top:0;bottom:0;width:0;border-left:1px solid #e2e8f0;"></span>`;
      }
      prefix += `</span>`;
    }

    const toggleArrow = hasChildren
      ? `<span class="tree-toggle" onclick="WorkCenter.toggleNode(event,'${node.id}')" style="cursor:pointer;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;color:#94a3b8;flex-shrink:0;border-radius:3px;background:#f1f5f9;">${isExpanded ? '&#9660;' : '&#9654;'}</span>`
      : `<span style="width:18px;flex-shrink:0;"></span>`;

    const dotColor = node.type === 'factory' ? '#3b82f6' : node.type === 'workshop' ? '#8b5cf6' : '#22c55e';

    let html = `<div class="tree-row ${isSelected?'tree-row-active':''}" onclick="WorkCenter.selectNode('${node.id}')" style="display:flex;align-items:center;gap:4px;padding:6px 8px 6px 4px;cursor:pointer;border-radius:4px;margin:1px 0;transition:background .15s;font-size:13px;">
      ${prefix}
      ${toggleArrow}
      <span style="width:6px;height:6px;border-radius:50%;background:${dotColor};flex-shrink:0;margin:0 4px;"></span>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${this.highlightText(node.name)}</span>
      <span style="font-size:10px;color:#94a3b8;flex-shrink:0;">${label}</span>
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
    this.renderOrgTree();
  },

  selectNode(nodeId) {
    const found = this.findNode(this.orgTree, nodeId);
    if (found) {
      this.selectedNode = found;
      this.renderOrgTree();
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

  showTable(node) {
    const descendants = this._getAllDescendants(node);
    const statusMap = { active:'正常启用', disabled:'临时停用', cancelled:'永久作废' };
    const statusCls = { active:'badge-green', disabled:'badge-yellow', cancelled:'badge-red' };
    const typeMap = { internal:'内部班组', outsourced:'外包服务商' };

    this._showTable(descendants);
  },

  _showTable(items, state) {
    const statusMap = { active:'正常启用', disabled:'临时停用', cancelled:'永久作废' };
    const statusCls = { active:'badge-green', disabled:'badge-yellow', cancelled:'badge-red' };
    const typeMap = { internal:'内部班组', outsourced:'外包服务商' };

    const tableHtml = (items && items.length)
      ? `
      <div class="table-wrapper" style="flex:1;overflow:auto;">
        <table class="data-table">
          <thead><tr>
            <th>工作中心编码</th>
            <th>名称</th>
            <th>所属工厂</th>
            <th>类型</th>
            <th>状态</th>
            <th>负责人</th>
            <th>操作</th>
          </tr></thead>
          <tbody>
            ${items.map(wc => `
              <tr>
                <td><span style="font-size:12px;">${esc(wc.code)}</span></td>
                <td>${esc(wc.name)}</td>
                <td>${esc(wc.factoryName)}</td>
                <td>${typeMap[wc.type]||wc.type}</td>
                <td><span class="badge ${statusCls[wc.status]||'badge-gray'}">${statusMap[wc.status]||wc.status}</span></td>
                <td>${esc(wc.leader)}</td>
                <td><button class="btn btn-outline btn-sm" onclick="WorkCenter.viewDetail('${wc.id}')">查看</button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`
      : `<div style="text-align:center;padding:60px 20px;color:var(--text-muted);"><div style="font-size:40px;margin-bottom:10px;">&#128203;</div><div>${state === 'empty' ? '未找到匹配的工作中心' : '该层级下暂无工作中心'}</div></div>`;

    const labelMap = { factory:'工厂', workshop:'车间', workcenter:'工作中心' };
    const headerHtml = `
      <div style="padding:14px 20px;background:white;border-bottom:1px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <span style="font-size:15px;font-weight:700;">${esc(this.selectedNode ? this.selectedNode.name : '')}</span>
          <span style="font-size:12px;color:var(--text-secondary);margin-left:8px;">${labelMap[this.selectedNode ? this.selectedNode.type : '']||''}</span>
        </div>
        <span style="font-size:12px;color:var(--text-muted);">共 <strong>${items ? items.length : 0}</strong> 个工作中心</span>
      </div>`;

    const panel = document.getElementById('wcTablePanel');
    const placeholder = document.getElementById('wcPlaceholder');
    if (panel) {
      panel.innerHTML = headerHtml + tableHtml;
      panel.style.display = 'flex';
      panel.style.flexDirection = 'column';
    }
    if (placeholder) placeholder.style.display = 'none';
  },

  viewDetail(wcId) {
    const wc = wcMockData.find(w => w.id === wcId);
    if (!wc) return;

    const statusMap = { active:'正常启用', disabled:'临时停用', cancelled:'永久作废' };
    const statusCls = { active:'badge-green', disabled:'badge-yellow', cancelled:'badge-red' };
    const typeMap = { internal:'内部班组', outsourced:'外包服务商' };
    const specMap = { mechanical:'机械维修', electrical:'电气维修', general:'综合维修', instrument:'仪表维修', hvac:'暖通空调' };

    const isAdmin = this._isAdmin();
    const footerBtns = isAdmin
      ? [
          { text:'关闭',cls:'btn-secondary',action:closeModal },
          { text:'编辑',cls:'btn-primary',action:`()=>{ closeModal(); WorkCenter.editModal('${wc.id}'); }` }
        ]
      : [{ text:'关闭',cls:'btn-secondary',action:closeModal }];

    showModal('工作中心详情', `
      <div style="padding:28px 32px 20px;background:white;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border);">
          <div>
            <div style="font-size:20px;font-weight:700;color:var(--text-primary);">${esc(wc.name)}</div>
            <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">编码：${esc(wc.code)}</div>
          </div>
          <span class="badge ${statusCls[wc.status]||'badge-gray'}" style="font-size:13px;padding:6px 14px;border-radius:8px;">${statusMap[wc.status]||wc.status}</span>
        </div>
        <div class="detail-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:18px 28px;">
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">工作中心编码</dt><dd style="font-size:14px;color:var(--text-primary);">${esc(wc.code)}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">类型</dt><dd style="font-size:14px;color:var(--text-primary);">${typeMap[wc.type]||wc.type}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;grid-column:span 2;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">工作中心描述</dt><dd style="font-size:14px;color:var(--text-primary);line-height:1.6;">${esc(wc.description || '暂无描述')}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">所属工厂</dt><dd style="font-size:14px;color:var(--text-primary);">${esc(wc.factoryName)}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">专业方向</dt><dd style="font-size:14px;color:var(--text-primary);">${specMap[wc.specialty]||wc.specialty}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">负责人/所属部门</dt><dd style="font-size:14px;color:var(--text-primary);">${esc(wc.leader)}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">联系电话</dt><dd style="font-size:14px;color:var(--text-primary);">${esc(wc.phone)}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">成本中心</dt><dd style="font-size:14px;color:var(--text-primary);">${esc(wc.costCenter || '-')}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">额定人数</dt><dd style="font-size:14px;color:var(--text-primary);">${wc.capacity} 人</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">在岗人数</dt><dd style="font-size:14px;color:var(--text-primary);">${wc.staffCount} 人</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">班次</dt><dd style="font-size:14px;color:var(--text-primary);">${wc.shift} 班</dd></div>
        </div>
      </div>`, footerBtns, 'modal-lg');
  },

  addModal() {
    if (!this._isAdmin()) { toast('无操作权限，仅管理员可创建'); return; }
    const factoryOpts = this.orgTree.map(n => `<option value="${esc(n.id)}">${esc(n.name)}</option>`).join('');
    showModal('新增工作中心', `
      <div class="form-grid" style="padding:8px 0;">
        <div class="form-group"><label>工厂<span class="req">*</span></label>
          <select id="wcFormFactory"><option value="">请选择工厂</option>${factoryOpts}</select>
        </div>
        <div class="form-group"><label>工作中心编码<span class="req">*</span></label><input id="wcFormCode" placeholder="如 WC-F001-005"></div>
        <div class="form-group" style="grid-column:span 2;"><label>工作中心描述</label><textarea id="wcFormDesc" rows="2" placeholder="工作中心详细描述"></textarea></div>
        <div class="form-group"><label>负责人/所属部门<span class="req">*</span></label><input id="wcFormLeader" placeholder="如 张建国"></div>
        <div class="form-group"><label>联系电话</label><input id="wcFormPhone" placeholder="如 13800138000"></div>
        <div class="form-group"><label>成本中心</label><input id="wcFormCostCenter" placeholder="如 CC-1000-W01"></div>
        <div class="form-group"><label>类型</label>
          <select id="wcFormType"><option value="internal">内部班组</option><option value="outsourced">外包服务商</option></select>
        </div>
        <div class="form-group"><label>专业方向</label>
          <select id="wcFormSpec">
            <option value="mechanical">机械维修</option><option value="electrical">电气维修</option>
            <option value="general">综合维修</option><option value="instrument">仪表维修</option>
            <option value="hvac">暖通空调</option>
          </select>
        </div>
        <div class="form-group"><label>额定人数</label><input id="wcFormCap" type="number" value="5"></div>
        <div class="form-group"><label>班次</label><input id="wcFormShift" type="number" value="2"></div>
      </div>`, [
        { text:'取消',cls:'btn-secondary',action:closeModal },
        { text:'保存',cls:'btn-primary',action:()=>{ toast('工作中心已新增！'); closeModal(); } }
      ]);
  },

  editModal(wcId) {
    if (!this._isAdmin()) { toast('无操作权限，仅管理员可编辑'); return; }
    const wc = wcMockData.find(w => w.id === wcId);
    if (!wc) return;
    const factoryOpts = this.orgTree.map(n => `<option value="${esc(n.id)}"${n.id===wc.factory?' selected':''}>${esc(n.name)}</option>`).join('');
    const typeSel = v => `value="${esc(v)}"${wc.type===v?' selected':''}`;
    const specSel = v => `value="${esc(v)}"${wc.specialty===v?' selected':''}`;

    showModal('编辑工作中心', `
      <div class="form-grid" style="padding:8px 0;">
        <div class="form-group"><label>工作中心编码<span class="req">*</span></label><input value="${esc(wc.code)}" readonly style="background:#f9fafb;"></div>
        <div class="form-group"><label>名称</label><input id="wcEditName" value="${esc(wc.name)}"></div>
        <div class="form-group" style="grid-column:span 2;"><label>工作中心描述</label><textarea id="wcEditDesc" rows="2" placeholder="工作中心详细描述">${esc(wc.description||'')}</textarea></div>
        <div class="form-group"><label>负责人/所属部门</label><input id="wcEditLeader" value="${esc(wc.leader)}"></div>
        <div class="form-group"><label>联系电话</label><input id="wcEditPhone" value="${esc(wc.phone)}"></div>
        <div class="form-group"><label>成本中心</label><input id="wcEditCostCenter" value="${esc(wc.costCenter||'')}"></div>
        <div class="form-group"><label>类型</label>
          <select id="wcEditType"><option ${typeSel('internal')}>内部班组</option><option ${typeSel('outsourced')}>外包服务商</option></select>
        </div>
        <div class="form-group"><label>专业方向</label>
          <select id="wcEditSpec"><option ${specSel('mechanical')}>机械维修</option><option ${specSel('electrical')}>电气维修</option><option ${specSel('general')}>综合维修</option><option ${specSel('instrument')}>仪表维修</option><option ${specSel('hvac')}>暖通空调</option></select>
        </div>
        <div class="form-group"><label>额定人数</label><input id="wcEditCap" type="number" value="${wc.capacity}"></div>
        <div class="form-group"><label>班次</label><input id="wcEditShift" type="number" value="${wc.shift}"></div>
      </div>`, [
        { text:'取消',cls:'btn-secondary',action:closeModal },
        { text:'保存',cls:'btn-primary',action:()=>{ toast('更新成功！'); closeModal(); if(WorkCenter.selectedNode){ WorkCenter.showTable(WorkCenter.selectedNode); } } }
      ]);
  }
};
