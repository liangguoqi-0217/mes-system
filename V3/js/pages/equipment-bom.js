// ===== Equipment BOM Page =====
const EquipmentBOM = {
  page: 1, pageSize: 10, filtered: [],

  render() {
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">设备BOM管理</div><div style="font-size:13px;opacity:0.8;">物料清单</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary" style="background:rgba(255,255,255,0.15);color:white;" onclick="EquipmentBOM.reset()">🔄 刷新</button>
            <button class="btn btn-blue" onclick="EquipmentBOM.addModal()">+ 新增BOM</button>
          </div>
        </div>
        <div style="padding:12px 20px;background:white;border-bottom:1px solid var(--border);display:flex;gap:12px;flex-shrink:0;overflow-x:auto;">
          <div class="stat-card" style="min-width:140px;box-shadow:none;border:1px solid var(--border);padding:10px 14px;">
            <div class="stat-icon blue">📋</div><div><div class="stat-label">BOM总数</div><div class="stat-value" style="font-size:22px;">${bomListData.length}</div></div></div>
          <div class="stat-card" style="min-width:140px;box-shadow:none;border:1px solid var(--border);padding:10px 14px;">
            <div class="stat-icon green">✅</div><div><div class="stat-label">已发布</div><div class="stat-value" style="font-size:22px;">${bomListData.filter(b=>b.status==='published').length}</div></div></div>
          <div class="stat-card" style="min-width:140px;box-shadow:none;border:1px solid var(--border);padding:10px 14px;">
            <div class="stat-icon yellow">📝</div><div><div class="stat-label">草稿</div><div class="stat-value" style="font-size:22px;">${bomListData.filter(b=>b.status==='draft').length}</div></div></div>
          <div class="stat-card" style="min-width:140px;box-shadow:none;border:1px solid var(--border);padding:10px 14px;">
            <div class="stat-icon red">❌</div><div><div class="stat-label">已作废</div><div class="stat-value" style="font-size:22px;">${bomListData.filter(b=>b.status==='cancelled').length}</div></div></div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>设备编码</label><input type="text" id="bomEqCode" placeholder="模糊查询"></div>
          <div class="filter-group"><label>设备名称</label><input type="text" id="bomEqName" placeholder="模糊查询"></div>
          <div class="filter-group"><label>状态</label>
            <select id="bomStatus"><option value="">全部</option><option value="published">已发布</option><option value="draft">草稿</option><option value="cancelled">已作废</option></select>
          </div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="EquipmentBOM.search()">🔍 查询</button>
            <button class="btn btn-secondary btn-sm" onclick="EquipmentBOM.reset()">↺ 重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table">
            <thead><tr><th>BOM编号</th><th>设备编码</th><th>设备名称</th><th>版本</th><th>状态</th><th>创建人</th><th>创建时间</th><th>SAP</th><th>操作</th></tr></thead>
            <tbody id="bomTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info"><span class="list-count" id="bomCount">共 ${this.filtered.length} 条</span></div>
          <div class="pagination">
            <button class="pagination-btn" id="bomPrev" disabled onclick="EquipmentBOM.prevPage()">‹</button>
            <span class="pagination-info" id="bomPageInfo">第 1 / ${Math.ceil(this.filtered.length/this.pageSize)} 页</span>
            <button class="pagination-btn" id="bomNext" onclick="EquipmentBOM.nextPage()">›</button>
            <select class="page-size-select" id="bomPageSizeSel" onchange="EquipmentBOM.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
          </div>
        </div>
      </div>`;
  },

  init() {
    this.filtered = [...bomListData];
    this.page = 1;
    this.renderTable();
  },

  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;
    document.getElementById('bomCount').textContent = `共 ${this.filtered.length} 条`;
    document.getElementById('bomPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('bomPrev').disabled = this.page <= 1;
    document.getElementById('bomNext').disabled = this.page >= totalPages;
    document.getElementById('bomPageSizeSel').value = this.pageSize;

    const statusMap = { published:'已发布', draft:'草稿', cancelled:'已作废' };
    const statusCls = { published:'badge-green', draft:'badge-yellow', cancelled:'badge-red' };

    document.getElementById('bomTableBody').innerHTML = page.map(b => `
      <tr>
        <td><strong>${esc(b.id)}</strong></td>
        <td>${esc(b.eqCode)}</td>
        <td>${esc(b.eqName)}</td>
        <td>${esc(b.version)}</td>
        <td><span class="badge ${statusCls[b.status]||'badge-gray'}">${statusMap[b.status]||b.status}</span></td>
        <td>${esc(b.creator)}</td>
        <td>${esc(b.createTime)}</td>
        <td>${getSyncBadge(b.syncStatus)}</td>
        <td class="table-actions">
          <button class="btn btn-blue btn-sm" onclick="EquipmentBOM.detail('${b.id}')">👁 详情</button>
          <button class="btn btn-warning btn-sm" onclick="EquipmentBOM.edit('${b.id}')">✏ 编辑</button>
        </td>
      </tr>`).join('');
  },

  search() {
    const eqCode = document.getElementById('bomEqCode').value.trim();
    const eqName = document.getElementById('bomEqName').value.trim();
    const status = document.getElementById('bomStatus').value;
    this.filtered = bomListData.filter(b => {
      if (eqCode && !b.eqCode.includes(eqCode)) return false;
      if (eqName && !b.eqName.includes(eqName)) return false;
      if (status && b.status !== status) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
  },

  reset() {
    document.getElementById('bomEqCode').value = '';
    document.getElementById('bomEqName').value = '';
    document.getElementById('bomStatus').value = '';
    this.filtered = [...bomListData];
    this.page = 1;
    this.renderTable();
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() { if (this.page < Math.ceil(this.filtered.length/this.pageSize)) { this.page++; this.renderTable(); } },
  changePageSize() { this.pageSize = parseInt(document.getElementById('bomPageSizeSel').value); this.page = 1; this.renderTable(); },

  detail(bomId) {
    const bom = bomListData.find(b => b.id === bomId);
    if (!bom) return;
    const detail = bomDetailData[bomId];
    const logs = bomLogs[bomId] || [];

    const statusMap = { published:'已发布', draft:'草稿', cancelled:'已作废' };
    const logsHtml = logs.length ? logs.map(l => `
      <div style="padding:10px;background:#f8fafc;border-radius:6px;margin-bottom:6px;border-left:3px solid var(--primary);">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
          <span class="badge badge-blue" style="font-size:11px;">${esc(l.version)} ${esc(l.action)}</span>
          <span style="font-size:11px;color:var(--text-secondary);">${esc(l.time)}</span>
        </div>
        <div style="font-size:12px;">${esc(l.content)}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:3px;">操作人：${esc(l.user)}</div>
      </div>`).join('') : '<p style="color:var(--text-muted);text-align:center;padding:16px;">暂无版本记录</p>';

    let itemsHtml = '';
    if (detail && detail.items) {
      itemsHtml = `
        <table class="data-table" style="margin-top:8px;">
          <thead><tr><th>物料编码</th><th>物料名称</th><th>层级</th><th>单位</th><th>数量</th><th>供应商</th><th>备注</th></tr></thead>
          <tbody>${detail.items.map(item => `
            <tr>
              <td><strong>${esc(item.code)}</strong></td>
              <td style="padding-left:${item.level*20+12}px;">${item.level > 0 ? '├ ' : ''}${esc(item.name)}</td>
              <td>${item.level}</td>
              <td>${esc(item.unit)}</td>
              <td>${item.qty}</td>
              <td>${esc(item.supplier)}</td>
              <td style="font-size:12px;color:var(--text-secondary);">${esc(item.remark||'-')}</td>
            </tr>`).join('')}</tbody>
        </table>`;
    } else {
      itemsHtml = '<p style="color:var(--text-muted);text-align:center;padding:20px;">暂无BOM明细数据</p>';
    }

    openSidePanel(bom.eqName, `BOM: ${bom.id} | 版本: ${bom.version}`, `
      <div class="detail-grid" style="margin-bottom:20px;">
        <div class="detail-item"><dt>BOM编号</dt><dd>${esc(bom.id)}</dd></div>
        <div class="detail-item"><dt>设备编码</dt><dd>${esc(bom.eqCode)}</dd></div>
        <div class="detail-item"><dt>设备名称</dt><dd>${esc(bom.eqName)}</dd></div>
        <div class="detail-item"><dt>版本</dt><dd>${esc(bom.version)}</dd></div>
        <div class="detail-item"><dt>状态</dt><dd><span class="badge ${bom.status==='published'?'badge-green':bom.status==='draft'?'badge-yellow':'badge-red'}">${statusMap[bom.status]}</span></dd></div>
        <div class="detail-item"><dt>创建人</dt><dd>${esc(bom.creator)}</dd></div>
        <div class="detail-item"><dt>创建时间</dt><dd>${esc(bom.createTime)}</dd></div>
        <div class="detail-item"><dt>SAP同步</dt><dd>${getSyncBadge(bom.syncStatus)}</dd></div>
      </div>
      <div class="tabs" style="margin-bottom:16px;">
        <div class="tab active" onclick="EquipmentBOM.switchBomTab(event,'items')">📦 BOM物料清单</div>
        <div class="tab" onclick="EquipmentBOM.switchBomTab(event,'logs')">📋 版本日志</div>
      </div>
      <div id="bom-tab-items" class="tab-panel active">${itemsHtml}</div>
      <div id="bom-tab-logs" class="tab-panel">${logsHtml}</div>`);
  },

  switchBomTab(event, name) {
    const panel = document.getElementById('sidePanel');
    panel.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    panel.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const target = panel.querySelector(`#bom-tab-${name}`);
    if (target) target.classList.add('active');
  },

  edit(bomId) {
    const bom = bomListData.find(b => b.id === bomId);
    if (!bom) return;
    showModal('编辑BOM', `
      <div class="form-grid">
        <div class="form-group"><label>BOM编号</label><input value="${esc(bom.id)}" readonly style="background:#f9fafb;"></div>
        <div class="form-group"><label>设备编码</label><input value="${esc(bom.eqCode)}" readonly style="background:#f9fafb;"></div>
        <div class="form-group"><label>设备名称</label><input value="${esc(bom.eqName)}"></div>
        <div class="form-group"><label>版本</label><input value="${esc(bom.version)}"></div>
      </div>`, [
        { text:'取消',cls:'btn-secondary',action:closeModal },
        { text:'保存',cls:'btn-primary',action:()=>{ toast('BOM更新成功！'); closeModal(); } }
      ]);
  },

  addModal() {
    showModal('新增BOM', `
      <div class="form-grid">
        <div class="form-group"><label>设备编码<span class="req">*</span></label><input id="bomFormEqCode" placeholder="如 EQ007"></div>
        <div class="form-group"><label>设备名称<span class="req">*</span></label><input id="bomFormEqName" placeholder="如 新设备"></div>
        <div class="form-group"><label>版本</label><input id="bomFormVer" value="V1.0"></div>
        <div class="form-group"><label>创建人</label><input id="bomFormCreator" value="管理员"></div>
      </div>`, [
        { text:'取消',cls:'btn-secondary',action:closeModal },
        { text:'保存',cls:'btn-primary',action:()=>{ toast('BOM已新增！'); closeModal(); } }
      ]);
  }
};
