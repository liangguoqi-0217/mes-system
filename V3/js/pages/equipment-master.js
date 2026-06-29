// ===== Equipment Master Page =====
const EquipmentMaster = {
  page: 1, pageSize: 10, filtered: [],

  render() {
    const data = equipmentData;
    this.filtered = [...data];
    this.page = 1;
    return `
      <div class="eq-master" style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">设备主数据管理</div><div style="font-size:13px;opacity:0.8;">设备台账</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary" style="background:rgba(255,255,255,0.15);color:white;" onclick="EquipmentMaster.showStatsPanel()">统计分析</button>
            <button class="btn btn-blue" onclick="EquipmentMaster.addModal()">+ 新增设备</button>
          </div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>工厂</label><select id="eqFactory"><option value="">全部</option><option value="1000">1000-山东步长制药工厂</option><option value="2001">2001-陕西步长制药工厂</option><option value="2002">2002-山东丹红制药工厂</option><option value="2003">2003-山东神州制药工厂</option><option value="2004">2004-山东康爱制药工厂</option><option value="2005">2005-通化谷红制药工厂</option></select></div>
          <div class="filter-group"><label>功能位置</label><input type="text" id="eqLocation" placeholder="模糊查询"></div>
          <div class="filter-group"><label>设备类型</label><select id="eqType"><option value="">全部</option>${eqTypeOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>运行状态</label><select id="eqStatus"><option value="">全部</option>${eqStatusOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>设备编码</label><input type="text" id="eqCode" placeholder="模糊查询"></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="EquipmentMaster.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="EquipmentMaster.reset()">重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table">
            <thead><tr><th>设备编码</th><th>设备名称</th><th>规格型号</th><th>制造商</th><th>功能位置</th><th>类型</th><th>状态</th><th>操作</th></tr></thead>
            <tbody id="eqTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info"><span class="list-count" id="eqCount">共 ${this.filtered.length} 条</span></div>
          <div class="pagination">
            <button class="pagination-btn" id="eqPrev" disabled onclick="EquipmentMaster.prevPage()">‹</button>
            <span class="pagination-info" id="eqPageInfo">第 1 / ${Math.ceil(this.filtered.length/this.pageSize)} 页</span>
            <button class="pagination-btn" id="eqNext" onclick="EquipmentMaster.nextPage()">›</button>
            <select class="page-size-select" id="eqPageSizeSel" onchange="EquipmentMaster.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
          </div>
        </div>
      </div>`;
  },

  init() {
    this.filtered = [...equipmentData];
    this.page = 1;
    this.renderTable();
  },

  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;
    document.getElementById('eqCount').textContent = `共 ${this.filtered.length} 条`;
    document.getElementById('eqPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('eqPrev').disabled = this.page <= 1;
    document.getElementById('eqNext').disabled = this.page >= totalPages;
    document.getElementById('eqPageSizeSel').value = this.pageSize;
    document.getElementById('eqTableBody').innerHTML = page.map(eq => `
      <tr>
        <td><span style="color:#2563eb;cursor:pointer;text-decoration:underline;font-weight:600;" onclick="EquipmentMaster.viewEquipmentPhotos('${eq.id}')" title="点击查看设备照片">${esc(eq.code)}</span></td><td>${esc(eq.name)}</td><td>${esc(eq.model)}</td><td>${esc(eq.manufacturer)}</td>
        <td><span style="color:var(--primary-lighter);cursor:pointer;text-decoration:underline;" onclick="EquipmentMaster.showLocation('${eq.location}')">${esc(eq.locationName)}</span></td>
        <td>${esc(eq.typeName)}</td><td>${getStatusBadge(eq.status)}</td>
        <td class="table-actions">
          <button class="btn btn-blue btn-sm" onclick="EquipmentMaster.maintain('${eq.id}')">${eq.status==='scrapped'?'查看':'维护'}</button>
          <button class="btn btn-success btn-sm" onclick="EquipmentMaster.goBOM('${eq.id}')">BOM</button>
          <button class="btn btn-warning btn-sm" onclick="EquipmentMaster.goMeasurementPoint('${eq.id}')" style="background:var(--warning);color:white;border:none;">测量点</button>
        </td>
      </tr>`).join('');
  },

  search() {
    const factory = document.getElementById('eqFactory').value;
    const location = document.getElementById('eqLocation').value.trim();
    const type = document.getElementById('eqType').value;
    const status = document.getElementById('eqStatus').value;
    const code = document.getElementById('eqCode').value.trim();
    this.filtered = equipmentData.filter(eq => {
      if (factory && !eq.location.startsWith(factory)) return false;
      if (location && !eq.locationName.includes(location)) return false;
      if (type && eq.type !== type) return false;
      if (status && eq.status !== status) return false;
      if (code && !eq.code.includes(code)) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
  },

  reset() {
    document.getElementById('eqFactory').value = '';
    document.getElementById('eqLocation').value = '';
    document.getElementById('eqType').value = '';
    document.getElementById('eqStatus').value = '';
    document.getElementById('eqCode').value = '';
    this.filtered = [...equipmentData];
    this.page = 1;
    this.renderTable();
  },

  showStatsPanel() {
    const total = equipmentData.length;
    const running = equipmentData.filter(e => e.status === 'running').length;
    const standby = equipmentData.filter(e => e.status === 'standby').length;
    const fault = equipmentData.filter(e => e.status === 'fault').length;
    const maint = equipmentData.filter(e => e.status === 'maintenance').length;
    const offline = total - running - standby - fault - maint;
    const pct = v => total > 0 ? ((v / total) * 100).toFixed(1) : '0.0';

    const makeCard = (status, label, icon, iconStyle, colorBar) => {
      const cnt = status === 'all' ? total : status === 'offline' ? offline
        : equipmentData.filter(e => e.status === status).length;
      const pctVal = pct(cnt);
      return `<div class="stat-card" style="cursor:pointer;transition:all .2s;min-width:0;"
        onclick="EquipmentMaster.filterByStatus('${status}')"
        onmouseenter="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 25px rgba(0,0,0,.12)';"
        onmouseleave="this.style.transform='';this.style.boxShadow='';">
        <div style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;${iconStyle}">${icon}</div>
        <div style="flex:1;"><div class="stat-label">${label}</div><div class="stat-value">${cnt}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
          <div style="flex:1;height:4px;background:#e5e7eb;border-radius:2px;overflow:hidden;">
            <div style="height:100%;width:${pctVal}%;${colorBar}border-radius:2px;transition:width .4s ease;"></div>
          </div>
          <span style="font-size:11px;color:var(--text-secondary);white-space:nowrap;">${pctVal}%</span>
        </div></div></div>`;
    };

    const cards = [
      makeCard('all', '设备总数', '&#128202;', 'background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;', 'background:linear-gradient(90deg,#667eea,#764ba2);'),
      makeCard('running', '运行中', '&#9989;', '', 'background:var(--success);'),
      makeCard('standby', '待机', '&#9208;', '', 'background:var(--primary-lighter);'),
      makeCard('fault', '故障', '&#9888;', '', 'background:var(--danger);'),
      makeCard('maintenance', '维修中', '&#128295;', '', 'background:var(--warning);'),
      makeCard('offline', '离线/其他', '&#10060;', 'background:rgba(107,114,128,.1);color:#6b7280;', 'background:#6b7280;')
    ].join('');

    const body = `<div style="padding:4px 0;">
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;">${cards}</div>
      <div style="margin-top:18px;padding:12px 16px;background:#f0f9ff;border-radius:8px;border:1px solid #bae6fd;font-size:13px;color:var(--text-secondary);text-align:center;">
        &#128161; 点击任意指标卡片，即可快速筛选下方设备列表
      </div></div>`;

    showModal('设备统计分析', body, [
      { text:'关闭', cls:'btn-secondary', action: closeModal }
    ], 'modal-lg');
  },

  filterByStatus(status) {
    closeModal();
    if (status === 'all') {
      this.filtered = [...equipmentData];
      if (document.getElementById('eqStatus')) document.getElementById('eqStatus').value = '';
    } else if (status === 'offline') {
      this.filtered = equipmentData.filter(e => !['running','standby','fault','maintenance'].includes(e.status));
      if (document.getElementById('eqStatus')) document.getElementById('eqStatus').value = '';
    } else {
      this.filtered = equipmentData.filter(e => e.status === status);
      if (document.getElementById('eqStatus')) document.getElementById('eqStatus').value = status;
    }
    this.page = 1;
    this.renderTable();
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() { if (this.page < Math.ceil(this.filtered.length/this.pageSize)) { this.page++; this.renderTable(); } },
  changePageSize() { this.pageSize = parseInt(document.getElementById('eqPageSizeSel').value); this.page = 1; this.renderTable(); },

  showLocation(locId) {
    const loc = locationData[locId];
    if (!loc) return;
    const typeMap = { factory:'工厂',line:'生产线',workstation:'工位' };
    showModal('功能位置详情', `
      <div class="detail-grid">
        <div class="detail-item"><dt>编码</dt><dd>${esc(loc.id)}</dd></div>
        <div class="detail-item"><dt>名称</dt><dd>${esc(loc.name)}</dd></div>
        <div class="detail-item"><dt>类型</dt><dd>${typeMap[loc.type]||loc.type}</dd></div>
        <div class="detail-item"><dt>描述</dt><dd>${esc(loc.description)}</dd></div>
      </div>`);
  },

  detail(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) return;
    this.detailEditingId = eqId;
    this.detailEditData = { ...eq };
    this.detailViewMode = 'view';
    this.detailActiveTab = 'general';

    const body = this._buildDetailBody();
    const footer = this._buildDetailFooter();

    showModal(`设备详情 - ${eq.name}`, body, footer, 'modal-lg');
  },

  _readonlyCell(label, value) {
    return `<div class="detail-item"><dt>${label}</dt><dd>${esc(value || '-')}</dd></div>`;
  },

  _editableCell(label, value, field, inputStyle) {
    const s = inputStyle || 'width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:13px;outline:none;';
    return `<div class="detail-item"><dt>${label}</dt><dd><input value="${esc(value||'')}" onchange="EquipmentMaster.updateDetailField('${field}',this.value)" placeholder="-" style="${s}" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'"></dd></div>`;
  },

  _buildDetailBody() {
    const d = this.detailEditData;
    const isView = this.detailViewMode === 'view';
    const cell = isView ? this._readonlyCell.bind(this) : this._editableCell.bind(this);

    const logs = eqStatusLogs[this.detailEditingId] || [];
    const logsHtml = logs.length ? logs.map(l => `
      <div style="padding:12px;background:#f8fafc;border-radius:6px;margin-bottom:8px;border-left:3px solid var(--primary);">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><strong>${esc(l.status)}</strong><span style="font-size:12px;color:var(--text-secondary);">${esc(l.time)}</span></div>
        <div style="font-size:13px;">${esc(l.description)}</div><div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">操作人：${esc(l.operator)}</div>
      </div>`).join('') : '<p style="color:var(--text-muted);text-align:center;padding:20px;">暂无记录</p>';

    return `
      <div style="margin-bottom:20px;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;">
        <div style="flex:1;">
          ${isView
            ? `<div style="font-size:20px;font-weight:700;color:var(--text);">${esc(d.name)}</div>`
            : `<input id="detailEqName" value="${esc(d.name)}" onchange="EquipmentMaster.updateDetailField('name',this.value)" style="font-size:20px;font-weight:700;border:1px solid var(--border);border-radius:6px;padding:6px 10px;width:100%;max-width:360px;outline:none;color:var(--text);" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">`
          }
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">
            编码：<strong>${esc(d.code)}</strong>
            &nbsp;|&nbsp;型号：${isView ? esc(d.model) : `<input value="${esc(d.model)}" onchange="EquipmentMaster.updateDetailField('model',this.value)" style="border:1px solid var(--border);border-radius:3px;padding:2px 6px;width:120px;font-size:12px;outline:none;" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">`}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;flex-shrink:0;">
          ${getStatusBadge(d.status)}
          ${isView && d.status !== 'scrapped'
            ? `<button class="btn btn-warning" onclick="EquipmentMaster.switchToEditMode();EquipmentMaster._refreshDetailModal();" style="font-size:13px;">✏️ 编辑</button>`
            : (isView ? '' : `<button class="btn btn-secondary btn-sm" onclick="EquipmentMaster.switchToViewMode();EquipmentMaster._refreshDetailModal();" style="font-size:12px;">↩ 返回查看</button>`)
          }
        </div>
      </div>
      <div class="form-tabs-bar" style="display:flex;border-bottom:2px solid var(--border);margin-bottom:0;flex-shrink:0;">
        <div class="form-tab ${this.detailActiveTab==='general'?'active':''}" onclick="EquipmentMaster.switchDetailTab(event,'general')">一般</div>
        <div class="form-tab ${this.detailActiveTab==='location'?'active':''}" onclick="EquipmentMaster.switchDetailTab(event,'location')">位置</div>
        <div class="form-tab ${this.detailActiveTab==='org'?'active':''}" onclick="EquipmentMaster.switchDetailTab(event,'org')">组织结构</div>
        <div class="form-tab ${this.detailActiveTab==='structure'?'active':''}" onclick="EquipmentMaster.switchDetailTab(event,'structure')">结构</div>
        <div class="form-tab ${this.detailActiveTab==='classification'?'active':''}" onclick="EquipmentMaster.switchDetailTab(event,'classification')">分类</div>
        <div class="form-tab ${this.detailActiveTab==='acceptance'?'active':''}" onclick="EquipmentMaster.switchDetailTab(event,'acceptance')">交付验收</div>
        <div class="form-tab ${this.detailActiveTab==='attachment'?'active':''}" onclick="EquipmentMaster.switchDetailTab(event,'attachment')">附件</div>
      </div>
      <div id="detailTabContainer" style="max-height:55vh;overflow-y:auto;padding:16px 0 0 0;">
        ${this._buildDetailTabContent(this.detailActiveTab)}
      </div>`;
  },

  _buildDetailFooter() {
    if (this.detailViewMode === 'view') {
      return [{ text:'关闭', cls:'btn-secondary', action: closeModal }];
    }
    return [
      { text:'取消', cls:'btn-secondary', action: ()=>{ EquipmentMaster.switchToViewMode(); EquipmentMaster._refreshDetailModal(); } },
      { text:'保存修改', cls:'btn-primary', action: ()=>{ EquipmentMaster.saveDetail(); } }
    ];
  },

  switchToEditMode() { this.detailViewMode = 'edit'; },
  switchToViewMode() { this.detailViewMode = 'view'; },

  _refreshDetailModal() {
    const modalBody = document.querySelector('.modal-backdrop:not(.hidden) .modal-body');
    const modalFooter = document.querySelector('.modal-backdrop:not(.hidden) .modal-footer');
    const modalTitle = document.querySelector('.modal-backdrop:not(.hidden) .modal-title');
    const d = this.detailEditData;
    if (modalBody) modalBody.innerHTML = this._buildDetailBody();
    if (modalFooter) modalFooter.innerHTML = this._buildDetailFooter().map(b => `<button class="btn ${b.cls||'btn-secondary'}" id="footerBtn_0">${b.text}</button>`).join('');
    if (modalTitle && d) modalTitle.textContent = '设备详情 - ' + d.name;

    const btns = this._buildDetailFooter();
    const actualBtns = modalFooter ? modalFooter.querySelectorAll('button') : [];
    actualBtns.forEach((btn, i) => {
      if (btns[i]) { btn.onclick = btns[i].action; btn.className = 'btn ' + (btns[i].cls||'btn-secondary'); btn.textContent = btns[i].text; }
    });
  },

  updateDetailField(field, value) {
    if (!this.detailEditData) return;
    this.detailEditData[field] = value;
    if (field === 'name') {
      const titleEl = document.querySelector('.modal-backdrop:not(.hidden) .modal-title');
      if (titleEl) titleEl.textContent = '设备详情 - ' + value;
    }
  },

  saveDetail() {
    if (!this.detailEditingId || !this.detailEditData) return;
    const idx = equipmentData.findIndex(e => e.id === this.detailEditingId);
    if (idx === -1) return;
    Object.assign(equipmentData[idx], this.detailEditData);
    toast('设备信息已保存！');
    this.detailViewMode = 'view';
    this._refreshDetailModal();
    this.renderTable();
  },

  _viewDetailPhoto(eqId, idx) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq || !eq.photos || !eq.photos[idx]) return;
    const photo = eq.photos[idx];
    showModal('设备照片 - ' + photo.name, `
      <div style="text-align:center;">
        <img src="${photo.dataUrl}" alt="${esc(photo.name)}" style="max-width:100%;max-height:70vh;border-radius:8px;">
      </div>`, [{ text:'关闭', cls:'btn-secondary', action: closeModal }], 'modal-lg');
  },

  viewEquipmentPhotos(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) { toast('设备不存在'); return; }

    // 判断是否有照片：优先用设备的photos，否则显示默认占位
    const hasCustomPhotos = eq.photos && eq.photos.length > 0;
    const displayPhotos = hasCustomPhotos ? eq.photos : [{ name: '设备外观照.png', dataUrl: 'images/equipment-photo.png', isDefault: true }];

    const photosHtml = displayPhotos.map((p, i) => `
      <div style="display:inline-block;margin:6px;border:1px solid var(--border);border-radius:8px;overflow:hidden;cursor:pointer;transition:transform .15s;width:220px;"
           onclick="EquipmentMaster._viewDetailPhotoFromList('${eqId}',${i})"
           onmouseenter="this.style.transform='scale(1.03)'" onmouseleave="this.style.transform='scale(1)'">
        <img src="${p.dataUrl}" alt="${esc(p.name)}" style="width:220px;height:165px;object-fit:cover;display:block;" onerror="this.onerror=null;this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 220 165%22><rect fill=%22%23f0f0f0%22 width=%22220%22 height=%22165%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2214%22>暂无图片</text></svg>'">
        <div style="padding:6px 10px;font-size:12px;color:var(--text-secondary);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:#fafbfc;">
          ${esc(p.name)} ${p.isDefault ? '<span style="color:var(--primary);font-size:11px;">(默认)</span>' : ''}
        </div>
      </div>`).join('');

    const hasQR = eq.qrCode && eq.qrCode.generated;

    showModal('设备照片 - ' + esc(eq.code), `
      <div style="padding:16px;">
        <div style="margin-bottom:16px;font-size:14px;color:var(--text-secondary);">
          设备编码：<strong>${esc(eq.code)}</strong> &nbsp;|&nbsp; 设备名称：<strong>${esc(eq.name)}</strong> &nbsp;|&nbsp; 共 <strong>${displayPhotos.length}</strong> 张照片
        </div>
        <div id="eqPhotoGallery" style="display:flex;flex-wrap:wrap;justify-content:center;max-height:55vh;overflow-y:auto;">
          ${photosHtml}
        </div>
      </div>
    `, [
      { text:'关闭', cls:'btn-secondary', action: closeModal },
      { text: hasQR ? '\uD83D\uDCE6 打印二维码' : '\uD83DCDF0 生成二维码', cls: hasQR ? 'btn-primary' : 'btn-warning', action: () => EquipmentMaster._handleQRCode(eqId) }
    ], 'modal-lg');
  },

  _viewDetailPhotoFromList(eqId, idx) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq || !eq.photos || !eq.photos[idx]) return;
    const photo = (eq.photos && eq.photos[idx]) || { name: '设备外观照.png', dataUrl: 'images/equipment-photo.png' };
    if (idx >= (eq.photos || []).length) photo = { name: '设备外观照.png', dataUrl: 'images/equipment-photo.png' };

    const actualPhoto = (eq.photos && eq.photos[idx]) ? eq.photos[idx] : { name: '设备外观照.png', dataUrl: 'images/equipment-photo.png' };

    const hasQR = eq.qrCode && eq.qrCode.generated;
    showModal('设备照片 - ' + (actualPhoto.name || '照片'), `
      <div style="text-align:center;">
        <img src="${actualPhoto.dataUrl}" alt="${esc(actualPhoto.name)}" style="max-width:100%;max-height:65vh;border-radius:8px;" onerror="this.onerror=null;this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22><rect fill=%22%23f0f0f0%22 width=%22400%22 height=%22300%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2216%22>暂无图片</text></svg>'">
        <div style="margin-top:8px;font-size:13px;color:var(--text-secondary);">${(eq.photos ? idx + 1 : 1)} / ${(eq.photos ? eq.photos.length : 1)}</div>
      </div>
    `, [
      { text:'关闭', cls:'btn-secondary', action: closeModal },
      { text: hasQR ? '\uD83D\uDCE6 打印二维码' : '\uD83DCDF0 生成二维码', cls: hasQR ? 'btn-primary' : 'btn-warning', action: () => { closeModal(); EquipmentMaster.viewEquipmentPhotos(eqId); setTimeout(() => EquipmentMaster._handleQRCode(eqId), 300); } }
    ], 'modal-lg');
  },

  // ---- 二维码生成与打印 ----
  _handleQRCode(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) { toast('设备不存在'); return; }

    // 如果已生成过二维码，直接展示（不可变）
    if (eq.qrCode && eq.qrCode.generated) {
      this._showQRCodeModal(eq);
      return;
    }

    // 首次生成：基于设备编码+名称+首次生成时间戳，确保唯一且不可变
    const qrContent = JSON.stringify({
      type: 'EQUIPMENT',
      id: eq.id,
      code: eq.code,
      name: eq.name,
      model: eq.model || '',
      location: eq.locationName || '',
      generatedAt: new Date().toISOString(),
      system: 'PM-Master'
    });

    // 生成二维码SVG
    const qrSvg = this._generateQRSVG(qrContent);

    // 保存到设备数据（一旦生成就不可变）
    eq.qrCode = {
      generated: true,
      content: qrContent,
      svg: qrSvg,
      generatedTime: new Date().toISOString().substring(0, 19).replace('T', ' ')
    };

    toast('设备二维码已生成！生成后不可更改');
    this._showQRCodeModal(eq);
  },

  _showQRCodeModal(eq) {
    const qc = eq.qrCode;
    if (!qc || !qc.generated) return;

    const printWin = () => {
      const win = window.open('', '_blank', 'width=500,height=700');
      win.document.write(`
<!DOCTYPE html><html><head><meta charset="utf-8"><title>设备二维码 - ${esc(eq.code)}</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:-apple-system,"Microsoft YaHei",sans-serif;display:flex;flex-direction:column;align-items:center;padding:40px 20px;background:#fff;}
.card{border:2px solid #e5e7eb;border-radius:12px;padding:32px;text-align:center;width:380px;}
.title{font-size:18px;font-weight:700;color:#111827;margin-bottom:4px;}.subtitle{font-size:13px;color:#6b7280;margin-bottom:20px;}
.qr-wrap{display:inline-block;padding:12px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:16px;}
.info{font-size:12px;color:#374151;line-height:2;text-align:left;background:#f9fafb;padding:12px;border-radius:6px;}
.info-row{display:flex;justify-content:space-between;}.label{color:#6b7280;}.value{font-weight:600;color:#111827;}
.footer{font-size:10px;color:#9ca3af;margin-top:16px;}@media print{body{padding:0;}}</style></head><body>
<div class="card">
  <div class="title">${esc(eq.name)}</div>
  <div class="subtitle">${esc(eq.code)} | ${esc(eq.model||'--')}</div>
  <div class="qr-wrap">${qc.svg}</div>
  <div class="info">
    <div class="info-row"><span class="label">设备编码</span><span class="value">${esc(eq.code)}</span></div>
    <div class="info-row"><span class="label">设备名称</span><span class="value">${esc(eq.name)}</span></div>
    <div class="info-row"><span class="label">型号</span><span class="value">${esc(eq.model||'--')}</span></div>
    <div class="info-row"><span class="label">位置</span><span class="value">${esc(eq.locationName||'--')}</span></div>
    <div class="info-row"><span class="label">生成时间</span><span class="value">${esc(qc.generatedTime)}</span></div>
  </div>
  <div class="footer">扫描二维码查看设备详细信息</div>
</div>
<script>window.onload=function(){window.print();}</script>
</body></html>`);
      win.document.close();
    };

    showModal(`设备二维码 - ${esc(eq.code)}`, `
      <div style="text-align:center;padding:20px;">
        <div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:4px;">${esc(eq.name)}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:20px;">${esc(eq.code)} &nbsp;|&nbsp; ${esc(eq.model||'--')}</div>

        <div id="qrDisplay" style="display:inline-block;padding:16px;background:#fff;border:2px solid var(--border);border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          ${qc.svg}
        </div>

        <div style="margin-top:16px;font-size:13px;color:var(--text-secondary);line-height:1.8;">
          设备编码：<strong>${esc(eq.code)}</strong><br>
          生成时间：<strong>${esc(qc.generatedTime)}</strong>
        </div>

        <div style="margin-top:14px;padding:10px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;font-size:12px;color:#166534;">
          &#9989; 二维码已锁定，不可修改。打印后可贴于设备机身用于扫码巡检。
        </div>
      </div>
    `, [
      { text:'关闭', cls:'btn-secondary', action: closeModal },
      { text:'\uD83D\uDCE6 打印二维码', cls:'btn-primary', action: () => { closeModal(); setTimeout(printWin, 200); } }
    ], 'modal-md');
  },

  // ---- 轻量级 QR Code SVG 生成器（纯JS，无依赖）----
  _generateQRSVG(text, size) {
    size = size || 5;
    const qr = _qrgen(text, size);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${qr.moduleCount} ${qr.moduleCount}" style="width:${Math.min(200, qr.moduleCount * 8)}px;height:${Math.min(200, qr.moduleCount * 8)}px;" shape-rendering="crispEdges"><path fill="#FFF" d="M0 0h${qr.moduleCount}v${qr.moduleCount}H0z"/><path fill="#111827" d="${qr.paths}"/></svg>`;
  },

  switchDetailTab(event, tabName) {
    this.detailActiveTab = tabName;
    const modal = event.target.closest('.modal');
    if (!modal) return;
    modal.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    const container = modal.querySelector('#detailTabContainer');
    if (container) container.innerHTML = this._buildDetailTabContent(tabName);
  },

  _buildDetailTabContent(tabName) {
    const d = this.detailEditData;
    const isView = this.detailViewMode === 'view';
    const cell = isView ? this._readonlyCell.bind(this) : this._editableCell.bind(this);

    const logs = eqStatusLogs[this.detailEditingId] || [];
    const logsHtml = logs.length ? logs.map(l => `
      <div style="padding:12px;background:#f8fafc;border-radius:6px;margin-bottom:8px;border-left:3px solid var(--primary);">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><strong>${esc(l.status)}</strong><span style="font-size:12px;color:var(--text-secondary);">${esc(l.time)}</span></div>
        <div style="font-size:13px;">${esc(l.description)}</div><div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">操作人：${esc(l.operator)}</div>
      </div>`).join('') : '<p style="color:var(--text-muted);text-align:center;padding:20px;">暂无记录</p>';

    const ap = d.acceptancePersonnel;
    const apVal = Array.isArray(ap) ? ap.join('、') : (ap || '');

    switch (tabName) {
      case 'general':
        return `<div class="detail-grid">${cell('出厂日期', d.factoryDate, 'factoryDate')}${cell('采购日期', d.purchaseDate, 'purchaseDate')}${cell('质保到期', d.warrantyEnd, 'warrantyEnd')}</div>
          <div style="margin-top:16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <div><strong style="font-size:14px;">状态变更记录</strong><div style="font-size:12px;color:var(--text-secondary);">实时展示设备运行状态变更</div></div>
            ${getStatusBadge(d.status)}
          </div>
          <div style="background:#f8fafc;border-radius:8px;padding:14px;">${logsHtml}</div>`;

      case 'location':
        return `<div class="detail-grid"><div class="detail-item"><dt>功能位置</dt><dd>${esc(d.locationName)}</dd></div></div>`;

      case 'org':
        return `<div class="detail-grid">${cell('负责人', d.leader, 'leader')}${cell('维保班组', d.teamName, 'teamName')}</div>`;

      case 'structure':
        return `<div class="detail-grid">${cell('序列号', d.serialNo, 'serialNo')}${cell('制造商', d.manufacturer, 'manufacturer')}</div>`;

      case 'classification':
        return `<div style="display:flex;gap:16px;flex-wrap:wrap;">
          <div style="flex:1;min-width:200px;background:#f8fafc;border-radius:8px;padding:14px;">
            <div style="font-weight:700;color:var(--primary);margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid var(--primary);">设备分类</div>
            ${cell('分类', d.category, 'category')}<div style="margin-top:8px;">${cell('组别', d.group, 'group')}</div><div style="margin-top:8px;">${cell('GMP管控', d.gmpClass, 'gmpClass')}</div>
          </div>
          <div style="flex:1;min-width:200px;background:#f8fafc;border-radius:8px;padding:14px;">
            <div style="font-weight:700;color:var(--primary);margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid var(--primary);">技术参数</div>
            ${cell('功率', d.power, 'power')}<div style="margin-top:8px;">${cell('电压', d.voltage, 'voltage')}</div><div style="margin-top:8px;">${cell('容量', d.capacity, 'capacity')}</div><div style="margin-top:8px;">${cell('材质', d.material, 'material')}</div><div style="margin-top:8px;">${cell('洁净等级', d.cleanLevel, 'cleanLevel')}</div>
          </div></div>`;

      case 'acceptance':
        return `<div class="detail-grid">
          ${cell('OA流程ID', d.oaProcessId, 'oaProcessId')}${cell('到货日期', d.arrivalDate, 'arrivalDate')}${cell('安装完成日期', d.installDate, 'installDate')}${cell('试运行时长', d.commissioningDuration, 'commissioningDuration')}${cell('调试负责人', d.commissioningManager, 'commissioningManager')}${cell('接收部门', d.receivingDept, 'receivingDept')}${cell('接收负责人', d.receiverPerson, 'receiverPerson')}${cell('移交说明', d.handoverNote, 'handoverNote')}${cell('交接意见', d.handoverOpinion, 'handoverOpinion')}${cell('验收人员', apVal, 'acceptancePersonnel')}</div>`;

      case 'attachment':
        return `<div style="margin-bottom:16px;"><strong style="font-size:14px;">设备照片</strong>
          <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:8px;">
            ${(d.photos && d.photos.length) ? d.photos.map((p, i) => `
              <div style="width:120px;height:120px;border:1px solid var(--border);border-radius:6px;overflow:hidden;cursor:pointer;position:relative;" onclick="EquipmentMaster._viewDetailPhoto('${esc(d.id)}',${i})">
                <img src="${esc(p.dataUrl)}" alt="${esc(p.name)}" style="width:100%;height:100%;object-fit:cover;">
                <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);color:white;font-size:10px;padding:2px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(p.name)}</div>
              </div>`).join('') : '<span style="color:var(--text-muted);font-size:13px;">暂无照片</span>'}
          </div></div>
        <div><strong style="font-size:14px;">电子文档</strong>
          <div style="margin-top:8px;">
            ${(d.documents && d.documents.length) ? d.documents.map(doc => `
              <div style="display:flex;align-items:center;padding:8px 12px;background:#f8fafc;border-radius:6px;margin-bottom:6px;border:1px solid var(--border);">
                <span style="font-size:16px;margin-right:8px;">&#128196;</span>
                <span style="font-size:13px;">${esc(doc.name)}</span>
                <span style="margin-left:auto;font-size:11px;color:var(--text-secondary);">${doc.size ? (doc.size < 1024 ? doc.size+'B' : (doc.size/1024).toFixed(1)+'KB') : ''}</span>
              </div>`).join('') : '<span style="color:var(--text-muted);font-size:13px;">暂无文档</span>'}
          </div></div>`;

      default: return '';
    }
  },

  // 分类-特性动态联动配置
  eqCategoryCharMap: {
    'motor': { name:'电机类', fields: [
      { id:'ratedPower', label:'额定功率', unit:'kW', type:'text' },
      { id:'ratedVoltage', label:'额定电压', unit:'V', type:'text' },
      { id:'ratedCurrent', label:'额定电流', unit:'A', type:'text' },
      { id:'ratedSpeed', label:'转速', unit:'rpm', type:'text' },
      { id:'protectionLevel', label:'防护等级', unit:'', type:'select', options:['IP23','IP44','IP54','IP55','IP65','IP66'] }
    ]},
    'pump': { name:'泵类', fields: [
      { id:'flowRate', label:'流量', unit:'m³/h', type:'text' },
      { id:'head', label:'扬程', unit:'m', type:'text' },
      { id:'pumpPower', label:'功率', unit:'kW', type:'text' },
      { id:'pumpSpeed', label:'转速', unit:'rpm', type:'text' },
      { id:'inletDiameter', label:'进口径', unit:'mm', type:'text' },
      { id:'outletDiameter', label:'出口径', unit:'mm', type:'text' }
    ]},
    'compressor': { name:'压缩机类', fields: [
      { id:'displacement', label:'排气量', unit:'m³/min', type:'text' },
      { id:'exhaustPressure', label:'排气压力', unit:'MPa', type:'text' },
      { id:'compPower', label:'功率', unit:'kW', type:'text' },
      { id:'coolingMethod', label:'冷却方式', unit:'', type:'select', options:['风冷','水冷','油冷'] }
    ]},
    'fan': { name:'风机类', fields: [
      { id:'airVolume', label:'风量', unit:'m³/h', type:'text' },
      { id:'airPressure', label:'风压', unit:'Pa', type:'text' },
      { id:'fanPower', label:'功率', unit:'kW', type:'text' },
      { id:'fanSpeed', label:'转速', unit:'rpm', type:'text' }
    ]},
    'valve': { name:'阀门类', fields: [
      { id:'nominalDiameter', label:'公称通径', unit:'mm', type:'select', options:['DN15','DN25','DN40','DN50','DN80','DN100','DN150','DN200'] },
      { id:'nominalPressure', label:'公称压力', unit:'MPa', type:'select', options:['1.0','1.6','2.5','4.0','6.4','10.0'] },
      { id:'connectionType', label:'连接方式', unit:'', type:'select', options:['法兰','螺纹','焊接','卡箍'] },
      { id:'valveMaterial', label:'阀体材质', unit:'', type:'select', options:['碳钢','304不锈钢','316L不锈钢','铸铁','黄铜'] }
    ]},
    'vessel': { name:'容器类', fields: [
      { id:'volume', label:'容积', unit:'L', type:'text' },
      { id:'designPressure', label:'设计压力', unit:'MPa', type:'text' },
      { id:'designTemp', label:'设计温度', unit:'°C', type:'text' },
      { id:'vesselMaterial', label:'主体材质', unit:'', type:'select', options:['Q245R','Q345R','304不锈钢','316L不锈钢','搪玻璃'] }
    ]},
    'heatex': { name:'换热器类', fields: [
      { id:'heatArea', label:'换热面积', unit:'m²', type:'text' },
      { id:'hexDesignPressure', label:'设计压力', unit:'MPa', type:'text' },
      { id:'hexDesignTemp', label:'设计温度', unit:'°C', type:'text' },
      { id:'hexMaterial', label:'主体材质', unit:'', type:'select', options:['304不锈钢','316L不锈钢','钛材','碳钢'] }
    ]}
  },

  addModal() {
    this.createActiveTab = 'general';
    this.createFormData = {};
    this.createCharValues = {};
    this.createPhotoFiles = [];
    this.createDocFiles = [];
    showModal('新增设备', this._buildCreateForm(), [
      { text:'取消',cls:'btn-secondary',action:()=>{ EquipmentMaster.createPhotoFiles=[]; EquipmentMaster.createDocFiles=[]; closeModal(); }},
      { text:'保存',cls:'btn-primary',action:()=>{ EquipmentMaster.submitCreate(); }}
    ], 'modal-xl');
  },

  _buildCreateForm() {
    return `<div class="form-tabs-bar" style="display:flex;border-bottom:2px solid var(--border);margin-bottom:0;flex-shrink:0;">
      <div class="form-tab active" onclick="EquipmentMaster.switchCreateTab(event,'general')">一般</div>
      <div class="form-tab" onclick="EquipmentMaster.switchCreateTab(event,'location')">位置</div>
      <div class="form-tab" onclick="EquipmentMaster.switchCreateTab(event,'org')">组织结构</div>
      <div class="form-tab" onclick="EquipmentMaster.switchCreateTab(event,'structure')">结构</div>
      <div class="form-tab" onclick="EquipmentMaster.switchCreateTab(event,'classification')">分类</div>
      <div class="form-tab" onclick="EquipmentMaster.switchCreateTab(event,'acceptance')">交付验收</div>
      <div class="form-tab" onclick="EquipmentMaster.switchCreateTab(event,'attachment')">附件</div>
    </div>
    <div id="createTabContainer" style="max-height:55vh;overflow-y:auto;padding:16px 0 0 0;">
      ${this._buildCreateGeneralTab()}
    </div>`;
  },

  _buildCreateGeneralTab() {
    const factoryOpts = FL_FACTORIES.map(f => `<option value="${esc(f.code)}">${esc(f.name)}</option>`).join('');
    return `<div id="create-tab-general" class="tab-panel active">
      <div class="form-section"><div class="form-section-title">基础信息</div>
      <div class="form-grid">
        <div class="form-group"><label>所属工厂<span class="req">*</span></label><select id="eqCreateFactory" onchange="EquipmentMaster._onFactoryChange()"><option value="">请选择</option>${factoryOpts}</select></div>
        <div class="form-group"><label>设备编号<span class="req">*</span></label><input type="text" id="eqCreateCode" placeholder="如 EQ-1000-001"></div>
        <div class="form-group"><label>设备描述<span class="req">*</span></label><input type="text" id="eqCreateName" placeholder="设备名称/描述"></div>
        <div class="form-group"><label>开始日期</label><input type="date" id="eqCreateStartDate"></div>
        <div class="form-group"><label>设备种类<span class="req">*</span></label><select id="eqCreateKind">
          <option value="">请选择</option>
          <option value="M">M - 动设备</option>
          <option value="S">S - 静设备</option>
          <option value="E">E - 电气</option>
          <option value="I">I - 仪表</option>
          <option value="O">O - 其它</option>
        </select></div>
        <div class="form-group"><label>序列号</label><input type="text" id="eqCreateSerialNo" placeholder="出厂序列号（选填）"></div>
        <div class="form-group"><label>制造商/型号</label><input type="text" id="eqCreateModel" placeholder="制造商名称/型号"></div>
      </div></div>
    </div>`;
  },

  _buildCreateLocationTab() {
    return `<div id="create-tab-location" class="tab-panel active">
      <div class="form-section"><div class="form-section-title">位置信息</div>
      <div class="form-grid">
        <div class="form-group"><label>位置</label><input type="text" id="eqCreateLocation" placeholder="如 固体制剂车间1层东侧"></div>
        <div class="form-group"><label>ABC标识<span class="req">*</span></label><select id="eqCreateAbc">
          <option value="">请选择</option>
          <option value="A">A - 关键设备</option>
          <option value="B">B - 主要设备</option>
          <option value="C">C - 一般设备</option>
        </select></div>
      </div></div>
    </div>`;
  },

  _buildCreateOrgTab() {
    return `<div id="create-tab-org" class="tab-panel active">
      <div class="form-section"><div class="form-section-title">组织结构信息</div>
      <div class="form-grid">
        <div class="form-group"><label>业务范围</label><input type="text" id="eqCreateBusinessArea" placeholder="如 固体制剂生产业务"></div>
        <div class="form-group"><label>资产编号</label><input type="text" id="eqCreateAssetNo" placeholder="如 AS-2024-001"></div>
        <div class="form-group"><label>成本中心</label><input type="text" id="eqCreateCostCenter" placeholder="如 CC-1000"></div>
        <div class="form-group"><label>WBS元素</label><input type="text" id="eqCreateWbs" placeholder="如 WBS-1000-001"></div>
        <div class="form-group"><label>计划人员组</label><select id="eqCreatePlannerGroup">
          <option value="">请选择</option>
          <option value="mechanical">机械组</option>
          <option value="electrical">电气组</option>
          <option value="instrument">仪表组</option>
          <option value="general">综合组</option>
        </select></div>
      </div></div>
    </div>`;
  },

  _buildCreateStructureTab() {
    // 构建功能位置树形选项
    const buildFLTree = (nodes, depth) => {
      let h = '';
      nodes.forEach(n => {
        const prefix = '\u00A0\u00A0'.repeat(depth);
        h += `<option value="${esc(n.id)}" data-code="${esc(n.code)}">${prefix}${esc(n.name)} (${esc(n.code)})</option>`;
        if (n.children && n.children.length) h += buildFLTree(n.children, depth + 1);
      });
      return h;
    };
    const flOpts = buildFLTree(flMockData.tree, 0);

    // 构建已有设备选项
    const eqOpts = equipmentData.map(eq => 
      `<option value="${esc(eq.id)}">${esc(eq.name)} (${esc(eq.code)})</option>`
    ).join('');

    return `<div id="create-tab-structure" class="tab-panel active">
      <div class="form-section"><div class="form-section-title">结构信息</div>
      <div class="form-grid">
        <div class="form-group"><label>功能位置</label><select id="eqCreateFL" style="max-width:100%;"><option value="">请选择</option>${flOpts}</select>
          <span style="font-size:11px;color:var(--text-muted);margin-top:2px;">选择设备安装的功能位置</span></div>
        <div class="form-group"><label>上一级设备</label><select id="eqCreateParentEq"><option value="">无（顶级设备）</option>${eqOpts}</select>
          <span style="font-size:11px;color:var(--text-muted);margin-top:2px;">选择设备归属的上级设备</span></div>
      </div></div>
    </div>`;
  },

  _buildCreateClassificationTab() {
    const catOpts = Object.entries(this.eqCategoryCharMap).map(([k,v]) => 
      `<option value="${k}">${v.name}</option>`
    ).join('');

    return `<div id="create-tab-classification" class="tab-panel active">
      <div class="form-section"><div class="form-section-title">设备分类</div>
      <div class="form-grid">
        <div class="form-group"><label>类别</label><select id="eqCreateCategory" onchange="EquipmentMaster._onCategoryChange()"><option value="">请选择</option>${catOpts}</select></div>
      </div></div>
      <div class="form-section" style="margin-top:12px;"><div class="form-section-title">特性参数</div>
      <div id="eqCreateCharFields" class="form-grid" style="padding:12px;background:#f8fafc;border-radius:8px;min-height:80px;">
        <div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">请先选择设备类别，特性参数将自动带出</div>
      </div></div>
    </div>`;
  },

  _buildCreateAcceptanceTab() {
    return `<div id="create-tab-acceptance" class="tab-panel active">
      <div class="form-section"><div class="form-section-title">流程与交付</div>
      <div class="form-grid">
        <div class="form-group"><label>OA流程ID</label><input type="text" id="eqCreateOaProcessId" placeholder="OA审批流程编号"></div>
        <div class="form-group"><label>到货日期</label><input type="date" id="eqCreateArrivalDate"></div>
        <div class="form-group"><label>安装完成日期</label><input type="date" id="eqCreateInstallDate"></div>
        <div class="form-group"><label>试运行时长</label><input type="text" id="eqCreateCommissioningDur" placeholder="如 72 小时"></div>
        <div class="form-group"><label>调试负责人</label><input type="text" id="eqCreateCommissioningMgr" placeholder="调试负责人姓名"></div>
        <div class="form-group"><label>接收部门</label><input type="text" id="eqCreateReceivingDept" placeholder="如 固体制剂车间"></div>
        <div class="form-group"><label>接收负责人</label><input type="text" id="eqCreateReceiverPerson" placeholder="接收负责人姓名"></div>
      </div></div>
      <div class="form-section" style="margin-top:12px;"><div class="form-section-title">移交与验收</div>
      <div class="form-grid">
        <div class="form-group full"><label>移交说明</label><textarea id="eqCreateHandoverNote" rows="2" placeholder="设备移交时的备注说明"></textarea></div>
        <div class="form-group full"><label>交接意见</label><textarea id="eqCreateHandoverOpinion" rows="2" placeholder="交接验收意见/结论"></textarea></div>
        <div class="form-group full"><label>验收人员</label>
          <div id="eqCreateAcceptancePersonnel" style="display:flex;flex-wrap:wrap;gap:8px;padding:8px 0;">
            ${['张工','李工','王工','赵工','陈工','刘工','周工','吴工'].map(p =>
              `<label style="display:inline-flex;align-items:center;gap:4px;font-size:13px;cursor:pointer;padding:4px 10px;border:1px solid var(--border);border-radius:4px;transition:all .15s;background:white;" class="acceptance-personnel-item">
                <input type="checkbox" value="${p}" style="margin:0;" onchange="EquipmentMaster._onAcceptancePersonnelChange(this)">${p}
              </label>`
            ).join('')}
          </div>
        </div>
      </div></div>
    </div>`;
  },

  _buildCreateAttachmentTab() {
    return `<div id="create-tab-attachment" class="tab-panel active">
      <div class="form-section"><div class="form-section-title">设备照片</div>
        <div class="form-group full">
          <label>上传设备外观照片</label>
          <input type="file" id="eqCreatePhotoInput" accept="image/*" multiple onchange="EquipmentMaster._onPhotoSelected(this)" style="padding:8px;font-size:13px;">
          <span style="font-size:11px;color:var(--text-muted);margin-top:4px;">支持 JPG、PNG、GIF、WEBP 格式，可多选</span>
          <div id="eqCreatePhotoPreview" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;min-height:60px;">
            <div style="width:100%;text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">暂无照片</div>
          </div>
        </div>
      </div>
      <div class="form-section" style="margin-top:12px;"><div class="form-section-title">操作电子文档</div>
        <div class="form-group full">
          <label>上传设备相关电子文档</label>
          <input type="file" id="eqCreateDocInput" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar" multiple onchange="EquipmentMaster._onDocumentSelected(this)" style="padding:8px;font-size:13px;">
          <span style="font-size:11px;color:var(--text-muted);margin-top:4px;">支持 PDF、Word、Excel、TXT、ZIP 等格式，可多选</span>
          <div id="eqCreateDocList" style="margin-top:10px;min-height:40px;">
            <div style="width:100%;text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">暂无文档</div>
          </div>
        </div>
      </div>
    </div>`;
  },

  _onAcceptancePersonnelChange(cb) {
    const label = cb.closest('.acceptance-personnel-item');
    if (label) {
      label.style.background = cb.checked ? '#eff6ff' : 'white';
      label.style.borderColor = cb.checked ? 'var(--primary-lighter)' : 'var(--border)';
      label.style.color = cb.checked ? 'var(--primary-lighter)' : '';
    }
  },

  _onPhotoSelected(input) {
    this.createPhotoFiles = this.createPhotoFiles || [];
    const container = document.getElementById('eqCreatePhotoPreview');
    if (!container) return;

    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.createPhotoFiles.push({ name: file.name, dataUrl: e.target.result });
        this._renderPhotoPreviews();
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  },

  _renderPhotoPreviews() {
    const container = document.getElementById('eqCreatePhotoPreview');
    if (!container) return;
    if (!this.createPhotoFiles || this.createPhotoFiles.length === 0) {
      container.innerHTML = '<div style="width:100%;text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">暂无照片</div>';
      return;
    }
    container.innerHTML = this.createPhotoFiles.map((f, i) => `
      <div style="position:relative;display:inline-block;border:1px solid var(--border);border-radius:6px;overflow:hidden;width:100px;height:100px;">
        <img src="${f.dataUrl}" alt="${esc(f.name)}" style="width:100%;height:100%;object-fit:cover;cursor:pointer;" onclick="EquipmentMaster._viewPhoto(${i})" title="点击查看大图">
        <button type="button" style="position:absolute;top:2px;right:2px;background:rgba(220,38,38,0.85);color:white;border:none;border-radius:50%;width:20px;height:20px;font-size:12px;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center;" onclick="event.stopPropagation();EquipmentMaster._removePhoto(${i})">&times;</button>
        <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);color:white;font-size:10px;padding:2px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(f.name)}</div>
      </div>`).join('');
  },

  _viewPhoto(idx) {
    if (!this.createPhotoFiles || !this.createPhotoFiles[idx]) return;
    const photo = this.createPhotoFiles[idx];
    showModal('设备照片 - ' + photo.name, `
      <div style="text-align:center;">
        <img src="${photo.dataUrl}" alt="${esc(photo.name)}" style="max-width:100%;max-height:70vh;border-radius:8px;">
      </div>`, [{ text:'关闭', cls:'btn-secondary', action: closeModal }], 'modal-lg');
  },

  _removePhoto(idx) {
    this.createPhotoFiles.splice(idx, 1);
    this._renderPhotoPreviews();
  },

  _onDocumentSelected(input) {
    this.createDocFiles = this.createDocFiles || [];
    const container = document.getElementById('eqCreateDocList');
    if (!container) return;

    Array.from(input.files).forEach(file => {
      this.createDocFiles.push({ name: file.name, size: file.size, file: file });
    });
    this._renderDocList();
    input.value = '';
  },

  _renderDocList() {
    const container = document.getElementById('eqCreateDocList');
    if (!container) return;
    if (!this.createDocFiles || this.createDocFiles.length === 0) {
      container.innerHTML = '<div style="width:100%;text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">暂无文档</div>';
      return;
    }
    const formatSize = (bytes) => bytes < 1024 ? bytes + ' B' : bytes < 1048576 ? (bytes / 1024).toFixed(1) + ' KB' : (bytes / 1048576).toFixed(1) + ' MB';
    container.innerHTML = this.createDocFiles.map((f, i) => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#f8fafc;border-radius:6px;margin-bottom:6px;border:1px solid var(--border);">
        <div style="display:flex;align-items:center;gap:8px;overflow:hidden;">
          <span style="font-size:18px;">&#128196;</span>
          <div style="overflow:hidden;">
            <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(f.name)}</div>
            <div style="font-size:11px;color:var(--text-secondary);">${formatSize(f.size)}</div>
          </div>
        </div>
        <button type="button" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:16px;padding:2px 6px;" onclick="EquipmentMaster._removeDoc(${i})">&times;</button>
      </div>`).join('');
  },

  _removeDoc(idx) {
    this.createDocFiles.splice(idx, 1);
    this._renderDocList();
  },

  switchCreateTab(event, tabName) {
    this.createActiveTab = tabName;
    const modal = event.target.closest('.modal');
    if (!modal) return;

    // 切换标签样式
    modal.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    // 构建对应面板内容并替换
    const container = modal.querySelector('#createTabContainer');
    if (!container) return;

    const tabBuilders = {
      general: this._buildCreateGeneralTab.bind(this),
      location: this._buildCreateLocationTab.bind(this),
      org: this._buildCreateOrgTab.bind(this),
      structure: this._buildCreateStructureTab.bind(this),
      classification: this._buildCreateClassificationTab.bind(this),
      acceptance: this._buildCreateAcceptanceTab.bind(this),
      attachment: this._buildCreateAttachmentTab.bind(this)
    };

    if (tabBuilders[tabName]) {
      // 在切换前保存当前面板中的表单数据
      this._saveCreateFormState();
      container.innerHTML = tabBuilders[tabName]();
      this._restoreCreateFormState();
    }
  },

  _saveCreateFormState() {
    // 保存当前可见表单字段的值
    this.createFormData = {};
    const container = document.getElementById('createTabContainer');
    if (!container) return;
    container.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.id && el.id.startsWith('eqCreate')) {
        this.createFormData[el.id] = el.type === 'checkbox' ? el.checked : el.value;
      }
    });
    // 保存验收人员多选状态
    const personnelContainer = document.getElementById('eqCreateAcceptancePersonnel');
    if (personnelContainer) {
      this._savedAcceptancePersonnel = Array.from(
        personnelContainer.querySelectorAll('input[type="checkbox"]:checked')
      ).map(cb => cb.value);
    }
  },

  _restoreCreateFormState() {
    Object.entries(this.createFormData).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) {
        if (el.type === 'checkbox') el.checked = val;
        else el.value = val || '';
      }
    });
    // 恢复分类特性值
    const charContainer = document.getElementById('eqCreateCharFields');
    if (charContainer && Object.keys(this.createCharValues).length > 0) {
      charContainer.querySelectorAll('input, select').forEach(el => {
        if (el.id && this.createCharValues[el.id] !== undefined) {
          el.value = this.createCharValues[el.id] || '';
        }
      });
    }
    // 恢复验收人员多选状态
    if (this._savedAcceptancePersonnel) {
      const personnelContainer = document.getElementById('eqCreateAcceptancePersonnel');
      if (personnelContainer) {
        personnelContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          const checked = this._savedAcceptancePersonnel.includes(cb.value);
          cb.checked = checked;
          this._onAcceptancePersonnelChange(cb);
        });
      }
      this._savedAcceptancePersonnel = null;
    }
  },

  _onFactoryChange() {
    // 工厂变更时提示用户将影响结构页签选项
  },

  _onCategoryChange() {
    const catEl = document.getElementById('eqCreateCategory');
    const catKey = catEl ? catEl.value : '';
    const container = document.getElementById('eqCreateCharFields');
    if (!container) return;

    if (!catKey || !this.eqCategoryCharMap[catKey]) {
      container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">请先选择设备类别，特性参数将自动带出</div>`;
      return;
    }

    const fields = this.eqCategoryCharMap[catKey].fields;
    let html = '';
    fields.forEach(f => {
      if (f.type === 'select' && f.options) {
        const opts = f.options.map(o => `<option value="${o}">${o}</option>`).join('');
        html += `<div class="form-group"><label>${esc(f.label)}${f.unit ? ' ('+f.unit+')' : ''}</label><select id="eqCreateChar_${f.id}"><option value="">请选择</option>${opts}</select></div>`;
      } else {
        html += `<div class="form-group"><label>${esc(f.label)}${f.unit ? ' ('+f.unit+')' : ''}</label><input type="text" id="eqCreateChar_${f.id}" placeholder="请输入${esc(f.label)}"></div>`;
      }
    });
    container.innerHTML = html;
  },

  submitCreate() {
    // 从当前活动的tab面板中收集所有字段值
    const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };

    // 先合并之前保存的表单状态
    const allData = { ...this.createFormData };
    const container = document.getElementById('createTabContainer');
    if (container) {
      container.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.id && el.id.startsWith('eqCreate')) {
          allData[el.id] = el.type === 'checkbox' ? el.checked : el.value;
        }
      });
    }

    const factory = getVal('eqCreateFactory');
    const code = getVal('eqCreateCode');
    const name = getVal('eqCreateName');
    const kind = getVal('eqCreateKind');
    const abc = getVal('eqCreateAbc');

    // 必填校验
    if (!factory) { toast('请选择所属工厂！'); return; }
    if (!code) { toast('请输入设备编号！'); return; }
    if (!name) { toast('请输入设备描述！'); return; }
    if (!kind) { toast('请选择设备种类！'); return; }
    if (!abc) { toast('请选择ABC标识！'); return; }

    // 编码唯一性校验
    if (equipmentData.some(e => e.code === code)) { toast('设备编号已存在，请更换！'); return; }

    const kindMap = { 'M':'动设备', 'S':'静设备', 'E':'电气', 'I':'仪表', 'O':'其它' };
    const catKey = getVal('eqCreateCategory');
    const catName = catKey && this.eqCategoryCharMap[catKey] ? this.eqCategoryCharMap[catKey].name : '';

    // 收集分类特性参数值
    const charContainer = document.getElementById('eqCreateCharFields');
    const charValues = {};
    if (charContainer) {
      charContainer.querySelectorAll('input, select').forEach(el => {
        if (el.id && el.id.startsWith('eqCreateChar_')) {
          const fieldId = el.id.replace('eqCreateChar_', '');
          charValues[fieldId] = el.value.trim();
        }
      });
    }

    // 收集验收人员多选
    const personnelEls = document.querySelectorAll('#eqCreateAcceptancePersonnel input[type="checkbox"]:checked');
    const acceptancePersonnel = Array.from(personnelEls).map(cb => cb.value);

    // 收集照片和文档（数据存储为引用，实际存储dataUrl）
    const photos = (this.createPhotoFiles || []).map(f => ({ name: f.name, dataUrl: f.dataUrl }));
    const docs = (this.createDocFiles || []).map(f => ({ name: f.name, size: f.size }));

    // 获取功能位置信息
    const flId = getVal('eqCreateFL');
    let flName = '', flCode = '';
    if (flId) {
      const found = this._findFLNode(flMockData.tree, flId);
      if (found) { flName = found.name; flCode = found.code; }
    }

    // 获取功能位置对应的工厂前缀（用于生成location字段）
    const locationVal = flId || factory;

    // 生成新ID
    const maxId = equipmentData.reduce((max, e) => {
      const num = parseInt(e.id.replace('EQ', ''));
      return num > max ? num : max;
    }, 0);
    const newId = 'EQ' + String(maxId + 1).padStart(3, '0');

    const newEq = {
      id: newId,
      code: code,
      name: name,
      model: getVal('eqCreateModel') || '-',
      manufacturer: getVal('eqCreateModel') || '-',
      serialNo: getVal('eqCreateSerialNo') || '-',
      type: kind,
      typeName: kindMap[kind] || kind,
      location: locationVal,
      locationName: flName || getVal('eqCreateLocation') || factory,
      workCenter: '',
      workCenterName: '',
      status: 'running',
      statusName: '运行中',
      power: charValues.ratedPower || charValues.pumpPower || charValues.compPower || '-',
      cleanLevel: '-',
      gmpClass: abc === 'A' ? '关键设备' : abc === 'B' ? '主要设备' : '一般设备',
      factoryDate: getVal('eqCreateStartDate') || '-',
      purchaseDate: '-',
      warrantyEnd: '-',
      leader: '-',
      team: '',
      teamName: '',
      category: catName || '-',
      group: kindMap[kind] || '-',
      priority: abc === 'A' ? '高' : abc === 'B' ? '中' : '低',
      maintenanceStrategy: abc === 'A' ? '月保养' : '季度保养',
      voltage: charValues.ratedVoltage || '-',
      capacity: charValues.flowRate || charValues.volume || '-',
      material: charValues.vesselMaterial || charValues.hexMaterial || charValues.valveMaterial || '-',
      envReq: '-',
      // 已有扩展字段
      eqKind: kind,
      abcIndicator: abc,
      businessArea: getVal('eqCreateBusinessArea') || '',
      assetNumber: getVal('eqCreateAssetNo') || '',
      costCenter: getVal('eqCreateCostCenter') || '',
      wbsElement: getVal('eqCreateWbs') || '',
      plannerGroup: getVal('eqCreatePlannerGroup') || '',
      functionalLocation: flId,
      functionalLocationCode: flCode,
      parentEquipmentId: getVal('eqCreateParentEq') || '',
      eqCategory: catKey,
      eqCategoryName: catName,
      characteristics: charValues,
      // 交付验收字段
      oaProcessId: getVal('eqCreateOaProcessId') || '',
      arrivalDate: getVal('eqCreateArrivalDate') || '',
      installDate: getVal('eqCreateInstallDate') || '',
      commissioningDuration: getVal('eqCreateCommissioningDur') || '',
      commissioningManager: getVal('eqCreateCommissioningMgr') || '',
      receivingDept: getVal('eqCreateReceivingDept') || '',
      receiverPerson: getVal('eqCreateReceiverPerson') || '',
      handoverNote: getVal('eqCreateHandoverNote') || '',
      handoverOpinion: getVal('eqCreateHandoverOpinion') || '',
      acceptancePersonnel: acceptancePersonnel,
      // 附件
      photos: photos,
      documents: docs,
      // 报废相关字段
      assetNo: '',
      disposalDate: null,
      disposalReason: null,
      disposalApprovalNo: null,
      disposalAttachment: null
    };

    equipmentData.push(newEq);
    // 清理临时状态
    this.createPhotoFiles = [];
    this.createDocFiles = [];
    toast('设备创建成功！编号：' + newEq.code);
    closeModal();
    this.renderTable();
  },

  _findFLNode(nodes, id) {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children && n.children.length) {
        const found = this._findFLNode(n.children, id);
        if (found) return found;
      }
    }
    return null;
  },

  goBOM(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) return;

    let bom = bomListData.find(b => b.eqCode === eq.code || b.eqCode === eqId);
    let isNew = false;

    if (!bom) {
      const maxId = bomListData.reduce((max, b) => {
        const num = parseInt(b.id.replace('BOM', ''));
        return num > max ? num : max;
      }, 0);
      const newId = 'BOM' + String(maxId + 1).padStart(3, '0');
      bom = {
        id: newId, eqCode: eq.code, eqName: eq.name, version: 'V1.0',
        status: 'draft', creator: '当前用户',
        createTime: new Date().toLocaleString('zh-CN'), syncTime: '-', syncStatus: 'pending'
      };
      bomListData.push(bom);
      bomDetailData[newId] = { eqCode: eq.code, eqName: eq.name, version: 'V1.0', status: 'draft', items: [] };
      if (!bomLogs[newId]) bomLogs[newId] = [];
      isNew = true;
    }

    const detail = bomDetailData[bom.id];
    this.bomEditingId = bom.id;
    this.bomEditingItems = (detail && detail.items) ? detail.items.map(item => ({ ...item })) : [];

    const logs = bomLogs[bom.id] || [];
    const statusMap = { published: '已发布', draft: '草稿', cancelled: '已作废' };

    const logsHtml = logs.length ? logs.map(l => `
      <div style="padding:10px;background:#f8fafc;border-radius:6px;margin-bottom:6px;border-left:3px solid var(--primary);">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
          <span class="badge badge-blue" style="font-size:11px;">${esc(l.version)} ${esc(l.action)}</span>
          <span style="font-size:11px;color:var(--text-secondary);">${esc(l.time)}</span>
        </div>
        <div style="font-size:12px;">${esc(l.content)}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:3px;">操作人：${esc(l.user)}</div>
      </div>`).join('') : '<p style="color:var(--text-muted);text-align:center;padding:16px;">暂无版本记录</p>';

    const body = `
      <div style="margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:18px;font-weight:700;">${esc(eq.name)}</div>
          <div style="font-size:12px;color:var(--text-secondary);">设备编码：${esc(eq.code)} | BOM版本：${esc(bom.version)}${isNew ? ' <span class="badge badge-yellow" style="margin-left:4px;font-size:11px;">新建</span>' : ''}</div>
        </div>
        <div><span class="badge ${bom.status === 'published' ? 'badge-green' : bom.status === 'draft' ? 'badge-yellow' : 'badge-red'}">${statusMap[bom.status] || bom.status}</span></div>
      </div>
      <div class="detail-grid" style="margin-bottom:16px;">
        <div class="detail-item"><dt>BOM编号</dt><dd>${esc(bom.id)}</dd></div>
        <div class="detail-item"><dt>设备编码</dt><dd>${esc(bom.eqCode)}</dd></div>
        <div class="detail-item"><dt>设备名称</dt><dd>${esc(bom.eqName)}</dd></div>
        <div class="detail-item"><dt>版本</dt><dd>${esc(bom.version)}</dd></div>
        <div class="detail-item"><dt>创建人</dt><dd>${esc(bom.creator)}</dd></div>
        <div class="detail-item"><dt>创建时间</dt><dd>${esc(bom.createTime)}</dd></div>
      </div>
      <div class="tabs" style="margin-bottom:16px;">
        <div class="tab active" onclick="EquipmentMaster.switchBomTab(event,'items')">BOM物料清单</div>
        <div class="tab" onclick="EquipmentMaster.switchBomTab(event,'logs')">版本日志</div>
      </div>
      <div id="bom-tab-items" class="tab-panel active">
        <div id="bomEditTableContainer">${this.renderBomEditTable()}</div>
      </div>
      <div id="bom-tab-logs" class="tab-panel">${logsHtml}</div>`;

    showModal(`BOM - ${eq.name}`, body, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '保存', cls: 'btn-primary', action: () => { EquipmentMaster.saveBom(); } }
    ], 'modal-lg');
  },

  // ===== 测量点弹窗（类似BOM） =====
  goMeasurementPoint(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) return;

    const eqPoints = measurementPointData.filter(mp => mp.equipmentId === eqId);
    this.mpEditingEqId = eqId;
    this.mpEditMode = 'view';
    this.mpActiveTab = 'list';

    const body = `
      <div style="margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:20px;font-weight:700;">${esc(eq.name)} - 测量点定义</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">设备编码：${esc(eq.code)} | 共 <strong>${eqPoints.length}</strong> 个测量点</div>
        </div>
        ${this.mpEditMode === 'view' ? `<button class="btn btn-blue btn-sm" onclick="EquipmentMaster.mpSwitchMode('edit'); EquipmentMaster.refreshMpModal();">✏ 编辑</button>` : ''}
      </div>
      <div class="tabs" style="margin-bottom:18px;">
        <div class="tab ${this.mpActiveTab==='list'?'active':''}" onclick="EquipmentMaster.switchMpTab(event,'list')">📋 测量点列表</div>
      </div>
      <div id="mp-tab-list" class="tab-panel active">
        ${this.renderMpList(eqPoints, eq)}
      </div>`;

    showModal(`测量点 - ${eq.name}`, body, [
      { text:'关闭', cls:'btn-secondary', action: closeModal },
      { text:'保存', cls:'btn-primary', action: () => { EquipmentMaster.saveMp(); } }
    ], 'modal-xl mp-modal');
  },

  renderMpList(points, eq) {
    if (points.length === 0) {
      return `<div style="text-align:center;padding:40px;color:var(--text-muted);">
        <div style="font-size:44px;margin-bottom:12px;">📐</div>
        <div style="font-size:14px;margin-bottom:14px;">该设备暂未配置测量点</div>
        <button class="btn btn-blue btn-sm" onclick="EquipmentMaster.addMpRow()">+ 新增测量点</button>
      </div>`;
    }

    let html = `<div style="overflow-x:auto;"><table class="data-table" style="font-size:13px;">
      <thead><tr>
        <th style="width:44px;">#</th>
        <th>编码</th>
        <th>名称</th>
        <th>类型</th>
        <th>单位</th>
        <th>阈值上限</th>
        <th>阈值下限</th>
        <th>报警</th>
        <th>计数器</th>
        <th>状态</th>
        <th style="width:100px;">操作</th>
      </tr></thead><tbody>`;

    points.forEach((mp, idx) => {
      html += `<tr style="height:42px;">
        <td style="text-align:center;color:var(--text-secondary);">${idx + 1}</td>
        <td><strong>${esc(mp.code)}</strong></td>
        <td>${esc(mp.name)}</td>
        <td><span class="badge ${mp.type==='QTY'?'badge-blue':'badge-purple'}">${mp.typeName}</span></td>
        <td>${esc(mp.unit || '-')}</td>
        <td>${esc(mp.upperLimit !== null ? mp.upperLimit : '-')}</td>
        <td>${esc(mp.lowerLimit !== null ? mp.lowerLimit : '-')}</td>
        <td>${mp.alarmEnabled ? '<span style="color:var(--danger);">● 开启</span>' : '<span style="color:var(--text-muted);">○ 关闭</span>'}</td>
        <td>${mp.isCounter ? '<span style="color:var(--warning);font-weight:bold;">⏱ 计数器</span>' : '-'}</td>
        <td><span class="badge ${mp.status==='active'?'badge-green':'badge-gray'}">${mp.statusName}</span></td>
        <td>
          ${this.mpEditMode === 'edit' ? `
            <button class="btn btn-sm" style="background:#dbeafe;color:#2563eb;border:none;padding:4px 10px;font-size:12px;cursor:pointer;border-radius:4px;" onclick="EquipmentMaster.editMp(${idx})">编辑</button>
            <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 10px;font-size:12px;cursor:pointer;border-radius:4px;" onclick="EquipmentMaster.deleteMp(${idx})">删除</button>
          ` : '-'}
        </td>
      </tr>`;
    });

    html += `</tbody></table></div>`;
    
    if (this.mpEditMode === 'edit') {
      html += `<div style="text-align:center;margin-top:14px;padding-top:14px;border-top:1px dashed var(--border);">
        <button class="btn btn-blue btn-sm" onclick="EquipmentMaster.addMpRow()">+ 新增测量点</button>
        <span style="margin-left:10px;font-size:13px;color:var(--text-muted);">共 ${points.length} 个测量点</span>
      </div>`;
    }

    return html;
  },

  mpSwitchMode(mode) {
    this.mpEditMode = mode;
  },

  switchMpTab(event, name) {
    const modal = document.querySelector('.modal-backdrop:not(.hidden) .modal');
    if (!modal) return;
    modal.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    modal.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const target = modal.querySelector(`#mp-tab-${name}`);
    if (target) target.classList.add('active');
  },

  refreshMpModal() {
    const modalBody = document.querySelector('.modal-backdrop:not(.hidden) .modal-body');
    if (!modalBody) return;

    const eqId = this.mpEditingEqId;
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) return;

    const eqPoints = measurementPointData.filter(mp => mp.equipmentId === eqId);

    modalBody.innerHTML = `
      <div style="margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:20px;font-weight:700;">${esc(eq.name)} - 测量点定义</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">设备编码：${esc(eq.code)} | 共 <strong>${eqPoints.length}</strong> 个测量点</div>
        </div>
        ${this.mpEditMode === 'view' ? `<button class="btn btn-blue btn-sm" onclick="EquipmentMaster.mpSwitchMode('edit'); EquipmentMaster.refreshMpModal();">✏ 编辑</button>` : 
          `<button class="btn btn-secondary btn-sm" onclick="EquipmentMaster.mpSwitchMode('view'); EquipmentMaster.refreshMpModal();">↩ 返回查看</button>`}
      </div>
      <div class="tabs" style="margin-bottom:18px;">
        <div class="tab ${this.mpActiveTab==='list'?'active':''}" onclick="EquipmentMaster.switchMpTab(event,'list')">📋 测量点列表</div>
      </div>
      <div id="mp-tab-list" class="tab-panel active">
        ${this.renderMpList(eqPoints, eq)}
      </div>`;

    // 刷新footer按钮可见性
    const footer = document.querySelector('.modal-backdrop:not(.hidden) .modal-footer');
    if (footer) {
      footer.style.display = this.mpEditMode === 'edit' ? '' : 'none';
    }
  },

  addMpRow() {
    const eq = equipmentData.find(e => e.id === this.mpEditingEqId);
    if (!eq) return;

    const maxNum = measurementPointData.reduce((max, mp) => {
      const num = parseInt(mp.id.replace('MP', ''));
      return num > max ? num : max;
    }, 0);
    const newId = 'MP' + String(maxNum + 1).padStart(3, '0');

    const newPoint = {
      id: newId,
      code: 'MP-' + eq.code + '-' + String(measurementPointData.filter(mp=>mp.equipmentId===this.mpEditingEqId).length + 1).padStart(3,'0'),
      name: '',
      equipmentId: this.mpEditingEqId,
      equipmentCode: eq.code,
      equipmentName: eq.name,
      bomComponentId: '',
      bomComponentName: '设备整体',
      type: 'QTY',
      typeName: '定量',
      unit: '',
      upperLimit: null,
      lowerLimit: null,
      alarmEnabled: false,
      qualitativeCodeGroup: '',
      alarmCodes: '',
      isCounter: false,
      initialCounter: null,
      yearlyEstimate: null,
      status: 'active',
      statusName: '启用',
      remark: '',
      createdBy: '当前用户',
      createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN')
    };

    measurementPointData.push(newPoint);
    toast('已添加新测量点，请在下方填写详细信息');
    this.refreshMpModal();

    // 自动滚动到底部并聚焦到最后一行的name输入框
    setTimeout(() => {
      const rows = document.querySelectorAll('#mp-tab-list table tbody tr');
      const lastRow = rows[rows.length - 1];
      if (lastRow) {
        lastRow.style.background = '#fef9c3';
        setTimeout(() => { lastRow.style.background = ''; }, 2000);
      }
    }, 100);
  },

  editMp(idx) {
    const eqPoints = measurementPointData.filter(mp => mp.equipmentId === this.mpEditingEqId);
    const mp = eqPoints[idx];
    if (!mp) return;

    const eq = equipmentData.find(e => e.id === this.mpEditingEqId);
    const codeGroupsHtml = Object.entries(qualitativeCodeGroups).map(([key, cg]) =>
      `<option value="${key}">${esc(cg.name)}</option>`
    ).join('');

    const unitOptions = ['mm/s','bar','℃','h','km','件','kN','mg','件/分钟','MPa','rpm','%','m³/h','Pa','m','L','m²','kg','t','V','A','Hz'].map(u=>
      `<option value="${u}" ${(mp.unit===u)?'selected':''}>${u}</option>`
    ).join('');

    showModal('编辑测量点', `
      <div style="margin-bottom:14px;padding:10px;background:#f0f9ff;border-radius:6px;font-size:13px;color:var(--text-secondary);">
        设备：<strong>${esc(eq?eq.name:'')}</strong> (${esc(eq?eq.code:'')})
      </div>
      <div class="form-grid">
        <div class="form-group"><label>测量点编码<span class="req">*</span></label><input id="mpEditCode" value="${esc(mp.code)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;"></div>
        <div class="form-group"><label>测量点名称<span class="req">*</span></label><input id="mpEditName" value="${esc(mp.name)}" placeholder="如 驱动端轴承振动"></div>
        <div class="form-group"><label>测量类型<span class="req">*</span></label>
          <select id="mpEditType" onchange="EquipmentMaster.onMpTypeChange()">
            <option value="QTY" ${mp.type==='QTY'?'selected':''}>定量 (QTY)</option>
            <option value="QLTY" ${mp.type==='QLTY'?'selected':''}>定性 (QLTY)</option>
          </select>
        </div>
        <div class="form-group"><label>单位</label>
          <select id="mpEditUnit"><option value="">请选择</option>${unitOptions}</select>
        </div>
        <div class="form-group"><label>阈值上限</label><input type="number" step="any" id="mpEditUpper" value="${mp.upperLimit!==null?mp.upperLimit:''}" placeholder="不填则无限制"></div>
        <div class="form-group"><label>阈值下限</label><input type="number" step="any" id="mpEditLower" value="${mp.lowerLimit!==null?mp.lowerLimit:''}" placeholder="不填则无限制"></div>
        <div class="form-group"><label>阈值报警</label>
          <select id="mpEditAlarm"><option value="true" ${mp.alarmEnabled?'selected':''}>开启</option><option value="false" ${!mp.alarmEnabled?'selected':''}>关闭</option></select>
        </div>
        <div class="form-group"><label>设为计数器</label>
          <select id="mpEditCounter"><option value="true" ${mp.isCounter?'selected':''}>是</option><option value="false" ${!mp.isCounter?'selected':''}>否</option></select>
        </div>
      </div>
      
      <div id="mpQualitativeSection" style="display:${mp.type==='QLTY'?'block':'none'};margin-top:14px;padding:14px;background:#faf5ff;border-radius:8px;border:1px solid #ddd6fe;">
        <div style="font-weight:600;color:#7c3aed;margin-bottom:10px;font-size:14px;">定性配置</div>
        <div class="form-grid">
          <div class="form-group"><label>代码组<span class="req">*</span></label>
            <select id="mpEditCodeGroup"><option value="">请选择</option>${codeGroupsHtml}</select>
          </div>
          <div class="form-group"><label>报警值</label><input id="mpEditAlarmCodes" value="${esc(mp.alarmCodes)}" placeholder="选中的代码视为报警，如 abnormal"></div>
        </div>
      </div>

      <div id="mpCounterSection" style="display:${mp.isCounter?'block':'none'};margin-top:14px;padding:14;background:#fffbeb;border-radius:8px;border:1px solid #fde68a;">
        <div style="font-weight:600;color:#d97706;margin-bottom:10px;font-size:14px;">计数器配置</div>
        <div class="form-grid">
          <div class="form-group"><label>初始读数</label><input type="number" id="mpEditInitialCounter" value="${mp.initialCounter!==null?mp.initialCounter:''}" placeholder="首次基准读数"></div>
          <div class="form-group"><label>年估算值</label><input type="number" id="mpEditYearlyEstimate" value="${mp.yearlyEstimate!==null?mp.yearlyEstimate:''}" placeholder="如 6000"></div>
        </div>
      </div>

      <div style="margin-top:14px;">
        <div class="form-group full"><label>备注</label><textarea id="mpEditRemark" rows="2" placeholder="可选备注说明">${esc(mp.remark)}</textarea></div>
      </div>

      <div style="margin-top:14px;padding:10px;background:#f8fafc;border-radius:6px;font-size:12px;color:var(--text-secondary);">
        状态：<select id="mpEditStatus" style="padding:4px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;">
          <option value="active" ${mp.status==='active'?'selected':''}>启用</option>
          <option value="inactive" ${mp.status==='inactive'?'selected':''}>停用</option>
        </select>
      </div>
    `, [
      { text:'取消',cls:'btn-secondary',action:closeModal },
      { text:'保存',cls:'btn-primary',action:()=>{ EquipmentMaster.saveMpEdit(mp.id); } }
    ]);
  },

  onMpTypeChange() {
    const typeEl = document.getElementById('mpEditType');
    const qualSec = document.getElementById('mpQualitativeSection');
    if (typeEl && qualSec) {
      qualSec.style.display = typeEl.value === 'QLTY' ? 'block' : 'none';
    }
  },

  saveMpEdit(mpId) {
    const mp = measurementPointData.find(m => m.id === mpId);
    if (!mp) return;

    const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const code = getVal('mpEditCode');
    const name = getVal('mpEditName');
    const type = getVal('mpEditType');

    if (!code) { toast('请填写测量点编码！'); return; }
    if (!name) { toast('请填写测量点名称！'); return; }

    // 编码唯一性校验（排除自身）
    if (measurementPointData.some(m => m.code === code && m.id !== mpId)) {
      toast('该编码已存在，请更换！'); return;
    }

    mp.code = code;
    mp.name = name;
    mp.type = type;
    mp.typeName = type === 'QTY' ? '定量' : '定性';
    mp.unit = getVal('mpEditUnit');
    mp.upperLimit = document.getElementById('mpEditUpper').value !== '' ? parseFloat(document.getElementById('mpEditUpper').value) : null;
    mp.lowerLimit = document.getElementById('mpEditLower').value !== '' ? parseFloat(document.getElementById('mpEditLower').value) : null;
    mp.alarmEnabled = getVal('mpEditAlarm') === 'true';
    mp.qualitativeCodeGroup = getVal('mpEditCodeGroup');
    mp.alarmCodes = getVal('mpEditAlarmCodes');
    mp.isCounter = getVal('mpEditCounter') === 'true';
    mp.initialCounter = document.getElementById('mpEditInitialCounter').value !== '' ? parseFloat(document.getElementById('mpEditInitialCounter').value) : null;
    mp.yearlyEstimate = document.getElementById('mpEditYearlyEstimate').value !== '' ? parseFloat(document.getElementById('mpEditYearlyEstimate').value) : null;
    mp.remark = getVal('mpEditRemark');
    mp.status = getVal('mpEditStatus');
    mp.statusName = mp.status === 'active' ? '启用' : '停用';
    mp.updatedAt = new Date().toLocaleString('zh-CN');

    toast('测量点保存成功！');
    closeModal();
    this.refreshMpModal();
  },

  deleteMp(idx) {
    const eqPoints = measurementPointData.filter(mp => mp.equipmentId === this.mpEditingEqId);
    const mp = eqPoints[idx];
    if (!mp) return;

    // 检查是否有测量记录
    const hasRecords = measurementRecordData.some(r => r.measurementPointId === mp.id);
    if (hasRecords) {
      toast('该测量点已有测量记录，无法删除！（可先停用）');
      return;
    }

    if (!confirm(`确认删除测量点「${mp.name}」？此操作不可撤销。`)) return;

    const dataIdx = measurementPointData.findIndex(m => m.id === mp.id);
    if (dataIdx >= 0) measurementPointData.splice(dataIdx, 1);

    toast('测量点已删除');
    this.refreshMpModal();
  },

  saveMp() {
    toast('测量点数据已保存！');
    closeModal();
  },

  renderBomEditTable() {
    const items = this.bomEditingItems || [];
    if (items.length === 0) {
      return `<div style="text-align:center;padding:30px;color:var(--text-muted);">
        <div style="font-size:40px;margin-bottom:8px;">&#128203;</div>
        <div style="font-size:13px;">暂无BOM组件，请点击下方按钮添加</div>
      </div>
      <div style="text-align:center;margin-top:12px;">
        <button class="btn btn-blue btn-sm" onclick="EquipmentMaster.addBomRow()">+ 添加组件</button>
      </div>`;
    }
    let html = `<div style="overflow-x:auto;"><table class="data-table" style="font-size:12px;">
      <thead><tr>
        <th style="width:30px;">#</th>
        <th>物料编码 <span style="color:#ef4444;">*</span></th>
        <th>物料名称 <span style="color:#ef4444;">*</span></th>
        <th style="width:80px;">单位</th>
        <th style="width:80px;">数量</th>
        <th>供应商</th>
        <th>备注</th>
        <th style="width:60px;">操作</th>
      </tr></thead><tbody>`;

    items.forEach((item, idx) => {
      html += `<tr>
        <td style="text-align:center;color:var(--text-secondary);">${idx + 1}</td>
        <td><input value="${esc(item.code)}" onchange="EquipmentMaster.updateBomItem(${idx},'code',this.value)" style="width:100%;padding:5px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;" placeholder="编码"></td>
        <td><input value="${esc(item.name)}" onchange="EquipmentMaster.updateBomItem(${idx},'name',this.value)" style="width:100%;padding:5px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;" placeholder="名称"></td>
        <td><input value="${esc(item.unit)}" onchange="EquipmentMaster.updateBomItem(${idx},'unit',this.value)" style="width:80px;padding:5px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;"></td>
        <td><input type="number" value="${item.qty}" onchange="EquipmentMaster.updateBomItem(${idx},'qty',parseFloat(this.value)||0)" style="width:70px;padding:5px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;" min="0" step="1"></td>
        <td><input value="${esc(item.supplier)}" onchange="EquipmentMaster.updateBomItem(${idx},'supplier',this.value)" style="width:100%;padding:5px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;" placeholder="供应商"></td>
        <td><input value="${esc(item.remark || '')}" onchange="EquipmentMaster.updateBomItem(${idx},'remark',this.value)" style="width:100%;padding:5px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;" placeholder="备注"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;cursor:pointer;border-radius:4px;" onclick="EquipmentMaster.deleteBomRow(${idx})">&#10005; 删除</button></td>
      </tr>`;
    });

    html += `</tbody></table></div>
    <div style="text-align:center;margin-top:12px;padding-top:12px;border-top:1px dashed var(--border);">
      <button class="btn btn-blue btn-sm" onclick="EquipmentMaster.addBomRow()">+ 添加组件</button>
      <span style="margin-left:8px;font-size:12px;color:var(--text-muted);">共 ${items.length} 个组件</span>
    </div>`;
    return html;
  },

  addBomRow() {
    if (!this.bomEditingItems) this.bomEditingItems = [];
    this.bomEditingItems.push({
      id: '', parentId: null, level: 0,
      code: '', name: '', unit: '个', qty: 1, supplier: '', remark: ''
    });
    this.refreshBomEditTable();
  },

  deleteBomRow(idx) {
    if (!this.bomEditingItems) return;
    this.bomEditingItems.splice(idx, 1);
    this.refreshBomEditTable();
  },

  updateBomItem(idx, field, value) {
    if (!this.bomEditingItems || !this.bomEditingItems[idx]) return;
    this.bomEditingItems[idx][field] = value;
  },

  refreshBomEditTable() {
    const container = document.getElementById('bomEditTableContainer');
    if (container) container.innerHTML = this.renderBomEditTable();
  },

  saveBom() {
    const bomId = this.bomEditingId;
    if (!bomId) return;
    const detail = bomDetailData[bomId];
    if (!detail) return;

    const items = this.bomEditingItems || [];
    const valid = items.every(it => it.code.trim() && it.name.trim());
    if (!valid) {
      toast('请完善所有组件的物料编码和物料名称！');
      return;
    }

    items.forEach((item, idx) => {
      if (!item.id) item.id = bomId + '-' + String(idx + 1).padStart(3, '0');
    });
    detail.items = [...items];

    if (!bomLogs[bomId]) bomLogs[bomId] = [];
    bomLogs[bomId].push({
      version: detail.version, action: '编辑',
      time: new Date().toLocaleString('zh-CN'), user: '当前用户',
      content: '更新BOM物料清单，共' + items.length + '个组件'
    });

    toast('BOM保存成功！');
    closeModal();
  },

  switchBomTab(event, name) {
    const modal = document.querySelector('.modal-backdrop:not(.hidden) .modal');
    if (!modal) return;
    modal.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    modal.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const target = modal.querySelector(`#bom-tab-${name}`);
    if (target) target.classList.add('active');
  },

  // ===== 设备维护/报废入口 =====
  maintain(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) { toast('设备不存在'); return; }

    // 已报废设备直接查看，不弹出菜单
    if (eq.status === 'scrapped') {
      this.detail(eqId);
      return;
    }

    const body = `
      <div style="padding:8px 0;">
        <div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe;margin-bottom:20px;">
          <span style="font-size:22px;flex-shrink:0;">🔧</span>
          <div style="font-size:13px;line-height:1.6;">
            <div style="font-weight:600;">请选择要执行的操作</div>
            <div style="color:var(--text-secondary);margin-top:2px;">设备：${esc(eq.code)} — ${esc(eq.name)}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <!-- 维护模块 -->
          <div id="maintain-option-maintenance" onclick="EquipmentMaster.detail('${eqId}')" 
               style="cursor:pointer;padding:24px 20px;border:2px solid var(--border);border-radius:12px;text-align:center;transition:all 0.2s;background:#fff;"
               onmouseover="this.style.borderColor='var(--primary)';this.style.boxShadow='0 4px 16px rgba(37,99,235,0.12)';this.style.transform='translateY(-2px)';"
               onmouseout="this.style.borderColor='var(--border)';this.style.boxShadow='none';this.style.transform='none';">
            <div style="font-size:36px;margin-bottom:10px;">🛠️</div>
            <div style="font-weight:700;font-size:15px;color:var(--text);margin-bottom:6px;">维护</div>
            <div style="font-size:12px;color:var(--text-muted);line-height:1.5;">查看/编辑设备详细信息<br>管理设备参数与档案</div>
          </div>

          <!-- 报废模块 -->
          <div id="maintain-option-disposal" onclick="EquipmentMaster.retire('${eqId}')" 
               style="cursor:pointer;padding:24px 20px;border:2px solid var(--border);border-radius:12px;text-align:center;transition:all 0.2s;background:#fff;"
               onmouseover="this.style.borderColor='#ef4444';this.style.boxShadow='0 4px 16px rgba(239,68,68,0.12)';this.style.transform='translateY(-2px)';"
               onmouseout="this.style.borderColor='var(--border)';this.style.boxShadow='none';this.style.transform='none';">
            <div style="font-size:36px;margin-bottom:10px;">🗑️</div>
            <div style="font-weight:700;font-size:15px;color:#dc2626;margin-bottom:6px;">报废</div>
            <div style="font-size:12px;color:var(--text-muted);line-height:1.5;">执行设备报废审批后操作<br>解绑位置并标记报废状态</div>
          </div>
        </div>
      </div>`;

    showModal('设备维护 — 选择操作',
      body,
      [{ text:'取消', cls:'btn-secondary', action: closeModal }],
      'modal-md');
  },

  // ===== 设备报废功能 =====
  retire(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) { toast('设备不存在'); return; }
    if (eq.status === 'scrapped') { toast('该设备已报废，无需重复操作'); return; }

    closeModal();
    this._openDisposalForm(eqId);
  },

  /* ========== 报废信息登记（完整表单） ========== */
  _openDisposalForm(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) return;

    const today = new Date().toISOString().split('T')[0];

    const body = `
    <div style="padding:2px 0;max-height:72vh;overflow-y:auto;padding-right:4px;" class="custom-scrollbar">

      <!-- 设备概览卡片 -->
      <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:linear-gradient(135deg,#fef2f2,#fee2e2);border-radius:10px;border:1px solid #fca5a5;margin-bottom:20px;">
        <div style="font-size:28px;">🗑️</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;font-size:15px;color:#991b1b;">设备报废登记</div>
          <div style="font-size:12.5px;color:#7f1d1d;margin-top:3px;">${esc(eq.code)} — ${esc(eq.name)} &nbsp;|&nbsp; ${esc(eq.locationName)}</div>
        </div>
        <span style="flex-shrink:0;font-size:11px;padding:4px 10px;background:white;border-radius:6px;color:#dc2626;font-weight:600;border:1px solid #fecaca;">此操作不可逆</span>
      </div>

      <!-- ===== 分组一：基础信息 ===== -->
      <fieldset style="border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:14px;">
        <legend style="font-weight:700;font-size:13.5px;color:var(--text);padding:0 8px;margin-left:12px;">📋 基础信息</legend>
        <div class="form-grid">
          <div class="form-group"><label>申请单号<span class="req">*</span></label><input id="dspApplyNo" placeholder="全局唯一编号，线下单据编号可录入系统备查"></div>
          <div class="form-group"><label>申请日期<span class="req">*</span></label><input type="date" id="dspApplyDate" value="${today}"></div>
          <div class="form-group"><label>申请人<span class="req">*</span></label><input id="dspApplicant" value="当前用户" placeholder="申请人姓名"></div>
          <div class="form-group"><label>设备编码 / 名称</label><input id="dspEqInfo" value="${esc(eq.code)} / ${esc(eq.name)}" readonly style="background:#f9fafb;"></div>
          <div class="form-group"><label>所属部门</label><input id="dspDept" value="${esc(eq.teamName||eq.workCenterName||'')}" placeholder="明确设备归属地"></div>
          <div class="form-group"><label>安装位置</label><input id="dspInstallLoc" value="${esc(eq.locationName)}" readonly style="background:#f9fafb;"></div>
        </div>
      </fieldset>

      <!-- ===== 分组二：设备关键追溯信息 ===== -->
      <fieldset style="border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:14px;">
        <legend style="font-weight:700;font-size:13.5px;color:var(--text);padding:0 8px;margin-left:12px;">🔍 设备关键追溯信息</legend>
        <div class="form-grid">
          <div class="form-group"><label>关键性评估</label>
            <select id="dspCriticality">
              <option value="">请选择</option>
              <option value="是">是 — 直接影响产品质量的关键设备</option>
              <option value="否">非关键设备</option>
            </select></div>
          <div class="form-group"><label>上一次验证/校准日期</label>
            <input type="date" id="dspLastValidDate" placeholder="确认设备在报废前是否处于受控状态"></div>
          <div class="form-group full"><label>涉及产品/品种</label>
            <textarea id="dspProducts" rows="2" placeholder="该设备用于生产过哪些药品/产品？影响批次范围评估（多行可换行）"></textarea></div>
        </div>
      </fieldset>

      <!-- ===== 分组三：报废原因与鉴定 ===== -->
      <fieldset style="border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:14px;">
        <legend style="font-weight:700;font-size:13.5px;color:var(--text);padding:0 8px;margin-left:12px;">📝 报废原因与鉴定</legend>
        <div class="form-grid">
          <div class="form-group"><label>报废原因分类<span class="req">*</span></label>
            <select id="dspReasonCat">
              <option value="">请选择</option>
              <option value="不可修复的故障">不可修复的故障</option>
              <option value="精度丧失无法恢复">精度丧失无法恢复</option>
              <option value="法规淘汰/不符合现行标准">法规淘汰 / 不符合现行标准</option>
              <option value="达到设计使用寿命">达到设计使用寿命</option>
              <option value="技术落后产能不足">技术落后 / 产能不足</option>
              <option value="环保要求不达标">环保要求不达标</option>
              <option value="安全事故损坏">安全事故损坏</option>
              <option value="其他">其他（请在下方补充说明）</option>
            </select></div>
          <div class="form-group"><label>鉴定人</label><input id="dspAppraiser" placeholder="签字确认，明确责任"></div>
          <div class="form-group"><label>鉴定日期<span class="req">*</span></label><input type="date" id="dspAppraisalDate" value="${today}"></div>
          <div class="form-group full"><label>技术鉴定结论</label>
            <textarea id="dspTechConclusion" rows="3" placeholder="设备部/工程部的专业评估，含关键指标数据（如转速、压力达不到工艺要求等）"></textarea>
            <span class="form-help">含关键指标数据及专业判断依据</span></div>
        </div>
      </fieldset>

      <!-- ===== 分组四：质量与合规影响 ===== -->
      <fieldset style="border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:14px;">
        <legend style="font-weight:700;font-size:13.5px;color:var(--text);padding:0 8px;margin-left:12px;">🛡️ 质量与合规影响</legend>
        <div class="form-grid">
          <div class="form-group"><label>质量评估结论</label>
            <select id="dspQualityConclusion">
              <option value="">请选择</option>
              <option value="无影响">无影响 — 不影响已生产产品质量</option>
              <option value="需追溯">需追溯 — 需对相关批次进行回顾性评估</option>
              <option value="有风险">有风险 — 可能影响已生产产品质量</option>
            </select></div>
          <div class="form-group"><label>变更控制编号</label><input id="dspChangeControlNo" placeholder="重大设备报废需启动变更控制流程"></div>
          <div class="form-group full"><label>涉及文件/记录</label>
            <textarea id="dspRelatedDocs" rows="2" placeholder="需同步撤销或修订的操作SOP、设备台账、验证文件清单等（多行可换行）"></textarea>
            <span class="form-help">列出需要同步处理的文件清单</span></div>
        </div>
      </fieldset>

      <!-- ===== 分组五：财务信息 ===== -->
      <fieldset style="border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:14px;">
        <legend style="font-weight:700;font-size:13.5px;color:var(--text);padding:0 8px;margin-left:12px;">💰 财务信息</legend>
        <div class="form-grid">
          <div class="form-group"><label>资产原值（元）</label><input id="dspAssetOriginal" type="number" placeholder="0.00" min="0" step="0.01"></div>
          <div class="form-group"><label>净值（元）</label><input id="dspAssetNet" type="number" placeholder="0.00" min="0" step="0.01"></div>
          <div class="form-group"><label>已提折旧（元）</label><input id="dspDepreciation" type="number" placeholder="0.00" min="0" step="0.01"></div>
          <div class="form-group"><label>处置方式<span class="req">*</span></label>
            <select id="dspDisposeMethod">
              <option value="">请选择</option>
              <option value="变卖">变卖</option>
              <option value="销毁">销毁</option>
              <option value="拆解留用">拆解留用</option>
              <option value="退回供应商">退回供应商</option>
              <option value="捐赠">捐赠</option>
              <option value="封存待处">封存待处理</option>
              <option value="其他">其他</option>
            </select></div>
        </div>
      </fieldset>

      <!-- ===== 审批附件 ===== -->
      <div style="background:#fafafa;border:1px dashed var(--border);border-radius:10px;padding:14px 16px;margin-bottom:14px;">
        <div style="font-weight:600;font-size:13px;color:var(--text);margin-bottom:8px;display:flex;align-items:center;gap:6px;"><span>📎</span> 审批附件</div>
        <input type="file" id="dspAttachment" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
               style="font-size:13px;display:block;width:100%;padding:6px 0;">
        <span class="form-help" style="margin-top:4px;">支持上传审批单扫描件、技术鉴定报告等，最大 10MB</span>
      </div>

      <!-- 进度区域 -->
      <div id="disposalProgress" style="display:none;padding:12px 16px;background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe;font-size:13px;">
        <div style="font-weight:600;margin-bottom:6px;">⏳ 处理进度</div>
        <div id="disposalSteps" style="line-height:1.8;"></div>
      </div>
      <div id="disposalResult" style="display:none;"></div>

    </div>`;

    EquipmentMaster._pendingDisposalEqId = eqId;
    showModal(`🗑️ 设备报废登记 — ${eq.name}`, body, [
      { text:'取消', cls:'btn-secondary', action: closeModal },
      { text:'确认报废', cls:'btn-primary', action: ()=>{ EquipmentMaster._executeDisposal(EquipmentMaster._pendingDisposalEqId); } }
    ], 'modal-xl');
  },

  _executeDisposal(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) { toast('设备不存在'); return; }

    // 收集所有字段
    const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const applyNo     = v('dspApplyNo');
    const applyDate   = v('dspApplyDate');
    const applicant   = v('dspApplicant');
    const dept        = v('dspDept');
    const criticality = v('dspCriticality');
    const lastValidDt = v('dspLastValidDate');
    const products    = v('dspProducts');
    const reasonCat   = v('dspReasonCat');
    const appraiser   = v('dspAppraiser');
    const appraisalDt = v('dspAppraisalDate');
    const techConcl   = v('dspTechConclusion');
    const qualityConcl= v('dspQualityConclusion');
    const changeCtrlNo= v('dspChangeControlNo');
    const relatedDocs = v('dspRelatedDocs');
    const assetOrig   = v('dspAssetOriginal');
    const assetNet    = v('dspAssetNet');
    const depreciatn  = v('dspDepreciation');
    const disposeMtd  = v('dspDisposeMethod');

    const fileInput = document.getElementById('dspAttachment');
    const attachedFile = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0].name : null;

    // 校验必填项
    if (!applyNo)     { toast('请填写申请单号！'); return; }
    if (!applyDate)   { toast('请选择申请日期！'); return; }
    if (!applicant)   { toast('请填写申请人！'); return; }
    if (!reasonCat)   { toast('请选择报废原因分类！'); return; }
    if (!appraisalDt) { toast('请选择鉴定日期！'); return; }
    if (!disposeMtd)  { toast('请选择处置方式！'); return; }

    // 禁用按钮防重复提交
    document.querySelectorAll('.modal-backdrop:not(.hidden) .modal-footer button').forEach(b => {
      if (b.textContent.includes('确认')) b.disabled = true;
    });

    const progressEl = document.getElementById('disposalProgress');
    const stepsEl    = document.getElementById('disposalSteps');
    const resultEl   = document.getElementById('disposalResult');
    if (progressEl) progressEl.style.display = 'block';

    let html = '';

    setTimeout(() => {
      const oldLocName = eq.locationName, oldLocCode = eq.location;
      eq.location = ''; eq.locationName = '—（已拆除）';
      html += '<div style="color:var(--success);font-weight:500;">✅ Step 1/3 — 设备已从功能位置「' + esc(oldLocName) + '」拆除</div>';
      if (stepsEl) stepsEl.innerHTML = html;

      setTimeout(() => {
        eq.status = 'scrapped'; eq.statusName = '报废'; eq.syncStatus = 'pending';

        // 存储所有报废字段到设备对象
        Object.assign(eq, {
          disposalDate: applyDate,
          disposalReason: reasonCat,
          disposalApplyNo: applyNo,
          disposalApplicant: applicant,
          disposalDept: dept,
          disposalCriticality: criticality,
          disposalLastValidDate: lastValidDt,
          disposalProducts: products,
          disposalAppraiser: appraiser,
          disposalAppraisalDate: appraisalDt,
          disposalTechConclusion: techConcl,
          disposalQualityConclusion: qualityConcl,
          disposalChangeControlNo: changeCtrlNo,
          disposalRelatedDocs: relatedDocs,
          disposalAssetOriginal: assetOrig,
          disposalAssetNet: assetNet,
          disposalDepreciation: depreciatn,
          disposalMethod: disposeMtd,
          disposalAttachment: attachedFile
        });

        html += '<div style="color:var(--success);font-weight:500;">✅ Step 2/3 — 报废状态已标记，全部字段已保存至设备档案</div>';
        if (stepsEl) stepsEl.innerHTML = html;

        setTimeout(() => {
          if (resultEl) {
            resultEl.style.display = 'block';
            resultEl.innerHTML = `
            <div style="padding:16px;background:#f0fdf4;border-radius:10px;border:1px solid #86efac;">
              <div style="font-weight:700;color:#166534;font-size:15px;margin-bottom:12px;display:flex;align-items:center;gap:8px;">✅ 设备报废登记完成</div>
              <table style="width:100%;font-size:12.5px;line-height:2;">
                <tr><td style="color:var(--text-muted);white-space:nowrap;">设备</td><td><strong>${esc(eq.code)}</strong> — ${esc(eq.name)}</td></tr>
                <tr><td style="color:var(--text-muted);">申请单号</td><td>${esc(applyNo)}</td></tr>
                <tr><td style="color:var(--text-muted);">报废原因</td><td>${esc(reasonCat)}</td></tr>
                <tr><td style="color:var(--text-muted);">处置方式</td><td><strong>${esc(disposeMtd)}</strong></td></tr>
                <tr><td style="color:var(--text-muted);">鉴定人 / 日期</td><td>${esc(apraiser||'—')} / ${esc(appraisalDt)}</td></tr>
                ${assetOrig ? `<tr><td style="color:var(--text-muted);">资产原值 → 净值</td><td>¥${assetOrig} → ¥${assetNet||'0'} （折旧 ¥${depreciatn||'0'}）</td></tr>` : ''}
                ${attachedFile ? `<tr><td style="color:var(--text-muted);">附件</td><td>${esc(attachedFile)}</td></tr>` : ''}
              </table>
            </div>`;
          }

          const footer = document.querySelector('.modal-backdrop:not(.hidden) .modal-footer');
          if (footer) footer.innerHTML = '<button class="btn btn-primary" onclick="closeModal();EquipmentMaster.renderTable();">关闭</button>';

          // 日志记录
          if (!eqStatusLogs[eqId]) eqStatusLogs[eqId] = [];
          eqStatusLogs[eqId].push({
            time: new Date().toLocaleString('zh-CN'), status: '报废', operator: applicant,
            description: `设备报废登记完成 | 原因：${reasonCat} | 处置方式：${disposeMtd}${changeCtrlNo ? ' | 变更控制号：' + changeCtrlNo : ''}`
          });

          toast('设备报废登记完成！');
        }, 550);
      }, 550);
    }, 400);
  }
};

// ===== 轻量级 QR Code 生成器（纯JS实现，无外部依赖） =====
// 基于 QR Code 规范，支持 Byte 模式，使用 Reed-Solomon 纠错
function _qrgen(text, ecl) {
  ecl = ecl || 1; // 1=L(7%), 2=M(15%), 3=Q(25%), 4=H(30%)
  var _pad = [0xEC,0x11],_ec = ['111011111000100','111001001000100','111110011111000','111111110101000'],
    _al = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:',_gexp=[],_glog=[];
  for(var i=0;i<256;i++){_gexp[i]=i<8?1<<i:(_gexp[i-4]^_gexp[i-5]^_gexp[i-6]^_gexp[i-8])&255;_glog[_gexp[i]]=i;}
  function _rs(n,ec){var d=[];for(var i=0;i<n;i++)d.push(0);for(var i=0;i<n.length;i++){var e=d[0]^n[i];d.splice(0,1);d.push(0);for(var j=0;j<d.length;j++)d[j]^=_glog[e]<127?_gexp[(_glog[d[j]]+_glog[e])%255]:0;}return d;}
  var _mt=[[0,0,0,0,0],[1,0,0,0,0],[1,1,0,0,0],[1,1,1,0,0],[1,1,1,1,0]],
    _ft=[[[6,18],[6,22],[6,26],[6,30]],[[6,16,18],[6,22,26],[6,24,28],[6,26,30]],
          [[6,19,22],[6,18,26],[6,20,28],[6,24,32]],[[6,16,22,26],[6,22,26,30],[6,24,28,32],[6,26,28,34]]];
  function _getLenBits(ver,mode){return mode===1?ver<10?9:11:mode===2?ver<10?10:12:mode===4?ver<10?8:16:mode===8?8:0;}
  function _enc(mode,data){if(mode===1){var r='';data.split('').forEach(function(c){r+=('00000'+_al.indexOf(c).toString(2)).slice(-_al.indexOf(c)<10?4:5)});return r}
    if(mode===8){var r='';for(var i=0;i<data.length;i++)r+=('00000000'+data.charCodeAt(i).toString(2)).slice(-8);return r}return''}
  function _findVersion(ecl,text){
    for(var v=1;v<=40;v++){
      if(v<=9){var c=[17,32,53,78,106,134,154,192,230][v-1]}else if(v<=26){c=[276,322,370,428,461,523,583,644,718,792,858,929][v-10]}
      else{c=[1003,1091,1171,1273,1367,1465,1528,1628,1732,1840,1952,2068,2188,2303,2431,2563][v-27]}
      var lbits=_getLenBits(v,8),ml=text.length;
      if((lbits+ml*8+4)<=c*8-ecl*8-(_ft[v>26?3:v>9?2:0||0][ecl-1].reduce(function(a,b){return a+b},0))*8)return v}return 40}
  function _makeData(ver,ecl,text){
    var dlen=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3368,3537][ver],
      eccl=[0,[7,10,13,17],[10,16,22,28],[15,26,36,44],[20,36,52,68]][ecl],rblocks=[0,[1,1,1,1],[1,1,1,1],[1,1,2,2],[1,2,2,4]][ecl];
    var blocks=[],totalEcc=0;
    (function(){var n=rblocks[ecl],dl=dlen-ver;if(ver>=2&&ecl>0){if(ver<7){var gs=[0,0,1,1][ecl]}else if(ver<14){gs=[0,0,2,4][ecl]}else if(ver<21){gs=[0,0,2,4][ecl]}else if(ver<27){gs=[0,0,3,6][ecl]}else{gs=[0,0,3,7][ecl]}
      var bl=Math.floor((dl-gs*(n-1))/n),rem=dl-bl*n-gs*(n-1);
      for(var i=0;i<n;i++)blocks.push(bl+gs+(i<n-rem?0:1))}else{blocks.push(dl)}})();
    var dataStr='',padded;dataStr+=('0100')+('000'+text.length.toString(2)).slice(-_getLenBits(ver,8));
    dataStr+=_enc(8,text);while(dataStr.length%8)dataStr+='0';
    padded=dataStr;while(padded.length<dlen*8-padded.length/8)padded+=String.fromCharCode(parseInt(_pad.join('').substr((padded.length/8)%_pad.length,2),16)).charCodeAt(0).toString(2)?'':'';
    while(padded.length<dlen*8)padded+='00001111';while(padded.length>dlen*8)padded=padded.substr(0,padded.length-8);
    var dataWords=[];for(var i=0;i<padded.length;i+=8)dataWords.push(parseInt(padded.substr(i,8),2));
    var blockData=[],pos=0;blocks.forEach(function(bl){blockData.push(dataWords.slice(pos,pos+bl));pos+=bl});
    var eccBlocks=blockData.map(function(d,i){return _rs(d.concat(new Array(eccl[ecl]).fill(0)),eccl[ecl])});
    var result=[],maxL=Math.max.apply(null,blocks);
    for(var i=0;i<maxL;i++)blockData.forEach(function(b,d){if(i<b.length)result.push(b[i])});
    for(var i=0;i<eccl[ecl];i++)eccBlocks.forEach(function(b){result.push(b[i])});return result}
  function _placeFinder(m,r,c){for(var dr=-1;dr<=1;dr++)for(var dc=-1;dc<=1;dc++)
    if(!(dr===0&&dc===0))m[r+dr][c+dc]=1;m[r][c]=1;
    for(var i=-2;i<=2;i++){m[r][c+i]=m[r+i][c]=1;if(Math.abs(i)<2)m[r-2][c+i]=m[r+2][c+i]=m[r+i][c-2]=m[r+i][c+2]=1}}
  function _placeAlign(m,v){var p=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,32,54],[6,28,58],[6,26,62],[6,26,66],[6,30,70],[6,28,74],[6,32,78],[6,28,82],[6,28,86],[6,30,90],[6,28,94],[6,28,98],[6,30,102],[6,28,106],[6,30,110],[6,28,114],[6,28,118],[6,28,122],[6,26,124,128],[6,30,132,136],[6,28,140,144]][v];
    if(!p[v])return;p[v].forEach(function(pos){if(pos===6)return;for(var r=pos-2;r<=pos+2;r++)for(var c=pos-2;c<=pos+2;c++)m[r][c]=!(Math.abs(r-pos)<=1&&Math.abs(c-pos)<=1)})}
  function _placeTiming(m,s){for(var i=8;i<s-8;i++){m[6][i]=m[i][6]=i%2==0}}
  function _reserve(m,v){for(var i=0;i<8;i++){m[8][i]=m[i][8]=(i%2==0);m[8][s-1-i]=m[s-1-i][8]=(i%2==0)}
    m[8][8]=false;m[8][6]=m[6][8]=m[s-8][8]=m[8][s-8]=true;if(v>=7){m[s-11][8]=m[8][s-11]=m[s-10][8]=m[8][s-10]=m[s-9][8]=m[8][s-9]=m[s-8][8]=m[8][s-8]=m[s-7][8]=m[8][s-7]=m[s-6][8]=m[8][s-6]=m[s-5][8]=m[8][s-5]=m[s-4][8]=m[8][s-4]=m[s-3][8]=m[8][s-3]=!((s-11)%2==0)}}
  function _mask(m,s,f){var r,c;for(r=1;r<s-1;r++)for(c=1;c<s-1;c++){
    if(m[r][c]===undefined)switch(f){case 0:m[r][c]=(r+c)%2;break;case 1:m[r][c]=r%2;break;case 2:m[r][c]=c%3;break;case 3:m[r][c]=(r+c)%3;break;case 4:m[r][c]=(Math.floor(r/2)+Math.floor(c/3))%2;break;case 5:m[r][c]=(r*c)%2+(r*c)%3;break;case 6:m[r][c]=((r*c)%2+(r*c)%3)%2;break;default:m[r][c]=((r+c)%3+(r*c)%2)%2}}}
  function _fmt(f,ecl){var bits=(ecl<<3|f)<<10;for(var k=0;k<10;k++)bits=(bits<<1)^(bits&0x400?0x537:0);return(((ecl<<3|f)<<10)|bits)^0x5412}
  var ver=_findVersion(ecl,text),size=ver*4+17+((ver>1?1:0)*0),matrix=[];
  for(var i=0;i<size;i++)matrix.push(new Array(size).fill(undefined));
  _placeFinder(matrix,0,0);_placeFinder(matrix,size-7,0);_placeFinder(matrix,0,size-7);_placeAlign(matrix,ver);_placeTiming(matrix,size);_reserve(matrix,ver);
  var data=_makeData(ver,ecl,text),di=0,up=true,col=size-1,row=size-1;
  while(col>0){if(col===6)col--;for(var i=0;i<size;i++){for(var j=0;j<2;j++){if(matrix[row][col-j]===undefined){matrix[row][col-j]=data[di++]}}}
    row+=(up?-1:1);if(row<0||row>=size){row-=up?-1:1;col-=2;up=!up}}var minPenalty=Infinity,bestMask=0,bestMatrix;
  for(var msk=0;msk<8;msk++){var cp=matrix.map(function(r){return r.slice()});_mask(cp,size,msk);
    var penalty=0;for(var r=0;r<size;r++){var cnt=0;for(var c=0;c<size;c++){if(cp[r][c]){cnt++;penalty=cnt>=5?penalty+3+(cnt-5):penalty}else cnt=0}}
    for(var c=0;c<size;c++){var cnt=0;for(var r=0;r<size;r++){if(cp[r][c]){cnt++;penalty=cnt>=5?penalty+3+(cnt-5):penalty}else cnt=0}}
    for(var r=0;r<size-1;r++)for(var c=0;c<size-1;c++)if(cp[r][c]===cp[r][c+1]&&cp[r][c]===cp[r+1][c]&&cp[r][c]===cp[r+1][c+1])penalty+=3;
    var dark=0;for(var r=0;r<size;r++)for(var c=0;c<size;c++)dark+=cp[r][c]?1:0;penalty+=Math.abs(Math.round(dark/(size*size)/10*10)-5)*10;
    if(penalty<minPenalty){minPenalty=penalty;bestMask=msk;bestMatrix=cp}}
  var fmtInfo=_fmt(bestMask,ecl);for(var i=0;i<15;i++){var bit=(fmtInfo>>i)&1;
    if(i<8){if(bit)bestMatrix[Math.floor(i/3)][i%3+8]=1;else bestMatrix[Math.floor(i/3)][i%3+8]=0}else{if(bit)bestMatrix[size-1-(i-8)%8][Math.floor((i-8)/3)]=1;else bestMatrix[size-1-(i-8)%8][Math.floor((i-8)/3)]=0}}
  var paths='';for(var r=0;r<size;r++)for(var c=0;c<size;c++)if(bestMatrix[r][c])paths+='M'+c+' '+r+'h1v1h-1z ';
  return {moduleCount:size,paths:paths};
}
