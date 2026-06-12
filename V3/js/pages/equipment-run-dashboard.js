// ===== 设备运行总看板 =====
const EquipmentRunDashboard = {
  selectedLocation: '',
  filteredData: [],
  alertChecked: false,

  render() {
    const total = eqRunStatusData.length;
    const running = eqRunStatusData.filter(d => d.currentStatus === 'running').length;
    const standby = eqRunStatusData.filter(d => d.currentStatus === 'standby').length;
    const fault = eqRunStatusData.filter(d => d.currentStatus === 'fault_downtime').length;
    const maintenance = eqRunStatusData.filter(d => d.currentStatus === 'planned_maintenance').length;
    const disabled = eqRunStatusData.filter(d => d.currentStatus === 'temp_disabled' || d.currentStatus === 'sealed').length;

    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="padding:10px 20px;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;flex-shrink:0;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-size:15px;font-weight:700;">设备运行总看板</div>
              <div style="font-size:12px;opacity:0.7;">实时状态监控 · 数据刷新：${new Date().toLocaleTimeString('zh-CN')}</div>
            </div>
            <div style="display:flex;gap:8px;">
              <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="EquipmentRunDashboard.refresh()">刷新</button>
              <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="EquipmentRunDashboard.exportReport()">导出报表</button>
            </div>
          </div>
        </div>
        <div style="padding:12px 20px;background:white;border-bottom:1px solid var(--border);display:flex;gap:8px;flex-shrink:0;overflow-x:auto;flex-wrap:wrap;">
          <div class="stat-card" style="min-width:110px;box-shadow:none;border:1px solid var(--border);padding:8px 10px;cursor:pointer;" onclick="EquipmentRunDashboard.filterByStatus('')">
            <div><div class="stat-label">总设备数</div><div class="stat-value" style="font-size:18px;color:var(--text);">${total}</div></div></div>
          <div class="stat-card" style="min-width:110px;box-shadow:none;border:1px solid var(--border);padding:8px 10px;border-left:3px solid #10B981;cursor:pointer;" onclick="EquipmentRunDashboard.filterByStatus('running')">
            <div><div class="stat-label">运行中</div><div class="stat-value" style="font-size:18px;color:#10B981;">${running}</div></div></div>
          <div class="stat-card" style="min-width:110px;box-shadow:none;border:1px solid var(--border);padding:8px 10px;border-left:3px solid #F59E0B;cursor:pointer;" onclick="EquipmentRunDashboard.filterByStatus('standby')">
            <div><div class="stat-label">待机</div><div class="stat-value" style="font-size:18px;color:#F59E0B;">${standby}</div></div></div>
          <div class="stat-card" style="min-width:110px;box-shadow:none;border:1px solid var(--border);padding:8px 10px;border-left:3px solid #DC2626;cursor:pointer;" onclick="EquipmentRunDashboard.filterByStatus('fault_downtime')">
            <div><div class="stat-label">故障停机</div><div class="stat-value" style="font-size:18px;color:#DC2626;">${fault}</div></div></div>
          <div class="stat-card" style="min-width:110px;box-shadow:none;border:1px solid var(--border);padding:8px 10px;border-left:3px solid #3B82F6;cursor:pointer;" onclick="EquipmentRunDashboard.filterByStatus('planned_maintenance')">
            <div><div class="stat-label">维保停机</div><div class="stat-value" style="font-size:18px;color:#3B82F6;">${maintenance}</div></div></div>
          <div class="stat-card" style="min-width:110px;box-shadow:none;border:1px solid var(--border);padding:8px 10px;border-left:3px solid #6B7280;cursor:pointer;" onclick="EquipmentRunDashboard.filterByStatus('disabled')">
            <div><div class="stat-label">停用/封存</div><div class="stat-value" style="font-size:18px;color:#6B7280;">${disabled}</div></div></div>
        </div>
        <div class="two-panel" style="flex:1;min-height:0;">
          <div class="left-panel">
            <div class="left-panel-header">
              <div class="left-panel-title">功能位置树</div>
              <button class="btn btn-sm btn-outline" onclick="EquipmentRunDashboard.clearLocation()">全部</button>
            </div>
            <div class="left-panel-body" id="dashboardTreeBody"></div>
          </div>
          <div class="right-panel" style="display:flex;flex-direction:column;background:white;">
            <div style="padding:10px 16px;border-bottom:1px solid var(--border);font-size:13px;color:var(--text-secondary);flex-shrink:0;" id="dashboardRightTitle">
              全部设备 · 共 <strong id="dashboardListCount">${total}</strong> 台
            </div>
            <div class="table-wrapper" style="flex:1;" id="dashboardTableWrapper">
              <table class="data-table">
                <thead><tr>
                  <th>设备编码</th><th>设备名称</th><th>功能位置</th><th>当前状态</th><th>累计运行(h)</th><th>今日运行(h)</th><th>最近停机</th><th>当班操作人</th><th>操作</th>
                </tr></thead>
                <tbody id="dashboardTbody"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`;
  },

  init() {
    this.selectedLocation = '';
    this.filteredData = [...eqRunStatusData];
    this.renderTree();
    this.renderTable();
    this.checkAlerts();
  },

  refresh() {
    // 模拟刷新数据
    const el = document.getElementById('contentArea');
    el.innerHTML = this.render();
    this.init();
    toast('数据已刷新');
  },

  renderTree() {
    const body = document.getElementById('dashboardTreeBody');
    let html = '';
    Object.values(locationTreeData).filter(n => n.type === 'factory').forEach(factory => {
      html += this._renderTreeNode(factory, 0);
    });
    body.innerHTML = html || '<div style="padding:20px;text-align:center;color:var(--text-muted);">暂无数据</div>';
  },

  _renderTreeNode(node, depth) {
    const hasChildren = node.children && node.children.length > 0;
    const isActive = this.selectedLocation === node.id;
    const eqCount = eqRunStatusData.filter(d => {
      if (node.type === 'factory') return d.locationId && d.locationId.startsWith(node.id);
      if (node.type === 'line') return d.locationId && d.locationId.startsWith(node.id);
      return d.locationId === node.id;
    }).length;

    let html = `<div class="tree-node ${isActive?'active':''}" style="padding-left:${10 + depth * 18}px;" onclick="EquipmentRunDashboard.selectLocation('${node.id}')">`;
    if (hasChildren) {
      html += `<span class="tree-expand" onclick="event.stopPropagation();EquipmentRunDashboard.toggleTreeNode('${node.id}')">&#9654;</span>`;
    } else {
      html += `<span style="width:16px;"></span>`;
    }
    const dotColor = eqCount > 0 ? '#10B981' : '#D1D5DB';
    html += `<span class="tree-dot active" style="background:${dotColor};"></span>`;
    html += `<span class="tree-name">${esc(node.name)}</span>`;
    html += `<span style="font-size:11px;color:var(--text-muted);">${eqCount}台</span>`;
    html += `</div>`;

    if (hasChildren) {
      html += `<div class="tree-children" id="tree-children-${node.id}" style="display:${isActive||this._isParentOfSelected(node)?'block':'none'};">`;
      node.children.forEach(childId => {
        const child = locationTreeData[childId];
        if (child) html += this._renderTreeNode(child, depth + 1);
      });
      html += `</div>`;
    }
    return html;
  },

  _isParentOfSelected(node) {
    if (!this.selectedLocation) return false;
    let current = locationTreeData[this.selectedLocation];
    while (current && current.parent) {
      if (current.parent === node.id) return true;
      current = locationTreeData[current.parent];
    }
    return false;
  },

  toggleTreeNode(nodeId) {
    const el = document.getElementById('tree-children-' + nodeId);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  },

  selectLocation(locationId) {
    this.selectedLocation = this.selectedLocation === locationId ? '' : locationId;
    this.applyFilter();
    this.renderTree();
  },

  clearLocation() {
    this.selectedLocation = '';
    this.applyFilter();
    this.renderTree();
  },

  filterByStatus(status) {
    this._statusFilter = this._statusFilter === status ? '' : status;
    this.applyFilter();
  },

  applyFilter() {
    let data = [...eqRunStatusData];

    if (this.selectedLocation) {
      const node = locationTreeData[this.selectedLocation];
      if (node) {
        if (node.type === 'factory') {
          data = data.filter(d => d.locationId && d.locationId.startsWith(this.selectedLocation));
        } else if (node.type === 'line') {
          data = data.filter(d => {
            const locNode = locationTreeData[d.locationId];
            return d.locationId === this.selectedLocation || (locNode && locNode.parent === this.selectedLocation);
          });
        } else {
          data = data.filter(d => d.locationId === this.selectedLocation);
        }
      }
    }

    if (this._statusFilter) {
      if (this._statusFilter === 'disabled') {
        data = data.filter(d => d.currentStatus === 'temp_disabled' || d.currentStatus === 'sealed');
      } else {
        data = data.filter(d => d.currentStatus === this._statusFilter);
      }
    }

    this.filteredData = data;
    document.getElementById('dashboardListCount').textContent = data.length;
    const nodeName = this.selectedLocation ? locationTreeData[this.selectedLocation]?.name || '' : '全部设备';
    document.getElementById('dashboardRightTitle').innerHTML = `${esc(nodeName)} · 共 <strong id="dashboardListCount">${data.length}</strong> 台`;
    this.renderTable();
  },

  renderTable() {
    const tbody = document.getElementById('dashboardTbody');
    if (!tbody) return;
    if (this.filteredData.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--text-muted);">暂无匹配的设备</td></tr>';
      return;
    }
    tbody.innerHTML = this.filteredData.map(d => {
      const sCls = eqRunStatusCls[d.currentStatus] || 'badge-gray';
      const sName = eqRunStatusMap[d.currentStatus] || d.currentStatus;
      const isFault = d.currentStatus === 'fault_downtime';
      const isStopped = d.currentStatus === 'planned_maintenance' || d.currentStatus === 'temp_disabled' || d.currentStatus === 'sealed';
      return `<tr style="${isFault?'background:#fef2f2;':''}${isStopped?'background:#f8fafc;':''}">
        <td><span style="font-weight:600;">${esc(d.equipmentCode)}</span></td>
        <td>${esc(d.equipmentName)}</td>
        <td><span style="font-size:12px;color:var(--text-muted);">${esc(d.locationName)}</span></td>
        <td><span class="badge ${sCls}">${sName}</span></td>
        <td>${d.runHours} h</td>
        <td>${d.todayRunHours > 0 ? d.todayRunHours + ' h' : '<span style="color:var(--text-muted);">-</span>'}</td>
        <td><span style="font-size:12px;">${d.lastDowntimeAt !== '-' ? d.lastDowntimeAt : '<span style="color:var(--text-muted);">无</span>'}</span></td>
        <td>${esc(d.currentOperator || '-')}</td>
        <td style="min-width:140px;">
          <div class="dash-actions">
            ${isFault ? `<span class="dash-action-link danger" onclick="EquipmentRunDashboard.reportDowntime('${d.equipmentId}')" title="登记故障停机">登记停机</span>` : ''}
            ${d.currentStatus === 'running' && !isFault ? `<span class="dash-action-link warn" onclick="EquipmentRunDashboard.reportFault('${d.equipmentId}')" title="快速上报故障">报故障</span>` : ''}
            ${d.currentStatus === 'temp_disabled' || d.currentStatus === 'sealed' ? `<span class="dash-action-link info" onclick="EquipmentRunDashboard.viewDetail('${d.equipmentId}')" title="查看详情及封存原因">查看</span>` : `<span class="dash-action-link primary" onclick="EquipmentRunDashboard.viewDetail('${d.equipmentId}')" title="查看设备运行详情">详情</span>`}
          </div>
        </td>
      </tr>`;
    }).join('');
  },

  reportDowntime(eqId) {
    const eq = this.filteredData.find(d => d.equipmentId === eqId);
    if (!eq) return;
    const body = `
      <div class="form-section">
        <div class="form-section-title">故障停机登记</div>
        <div class="form-grid">
          <div class="form-group"><label>设备</label><input value="${esc(eq.equipmentCode)} ${esc(eq.equipmentName)}" disabled></div>
          <div class="form-group"><label>操作人</label><input id="downtimeOp" value="${esc(eq.currentOperator)}" disabled></div>
          <div class="form-group full"><label>停机原因 <span class="req">*</span></label><input id="downtimeReason" placeholder="描述停机具体原因"></div>
          <div class="form-group"><label>停机开始时间 <span class="req">*</span></label><input type="datetime-local" id="downtimeStart"></div>
          <div class="form-group"><label>处置措施</label><input id="downtimeMeasure" placeholder="初步处置措施"></div>
        </div>
      </div>`;
    showModal('故障停机登记', body, [
      { text:'取消', cls:'btn-secondary', action: closeModal },
      { text:'上报停机', cls:'btn-blue', action: () => {
        const reason = document.getElementById('downtimeReason').value;
        const start = document.getElementById('downtimeStart').value;
        if (!reason) { toast('请填写停机原因'); return; }
        eq.currentStatus = 'fault_downtime';
        eq.currentStatusName = '故障停机';
        eq.lastDowntimeAt = start ? start.replace('T',' ') + ':00' : new Date().toLocaleString('sv-SE').replace('T',' ');
        toast('故障停机已上报，已自动通知维修班组');
        closeModal();
        const el = document.getElementById('contentArea');
        el.innerHTML = EquipmentRunDashboard.render();
        EquipmentRunDashboard.init();
      }}
    ]);
    // 设置默认时间
    setTimeout(() => {
      const input = document.getElementById('downtimeStart');
      if (input) input.value = new Date().toISOString().slice(0, 16);
    }, 100);
  },

  reportFault(eqId) {
    const eq = this.filteredData.find(d => d.equipmentId === eqId);
    if (!eq) return;
    const body = `
      <div class="form-section">
        <div class="form-section-title">快速上报故障</div>
        <div class="form-grid">
          <div class="form-group full"><label>设备</label><input value="${esc(eq.equipmentCode)} ${esc(eq.equipmentName)}" disabled></div>
          <div class="form-group full"><label>故障描述 <span class="req">*</span></label><textarea id="faultDesc" rows="3" placeholder="描述设备故障现象、影响范围"></textarea></div>
          <div class="form-group"><label>紧急程度</label><select id="faultUrgency"><option value="normal">一般</option><option value="urgent">紧急</option><option value="critical">特急</option></select></div>
          <div class="form-group"><label>上报人</label><input value="${esc(eq.currentOperator || '系统用户')}" disabled></div>
        </div>
      </div>`;
    showModal('快速上报故障', body, [
      { text:'取消', cls:'btn-secondary', action: closeModal },
      { text:'确认上报', cls:'btn-blue', action: () => {
        const desc = document.getElementById('faultDesc').value;
        const urgency = document.getElementById('faultUrgency').value;
        if (!desc) { toast('请填写故障描述'); return; }
        eq.currentStatus = 'fault_downtime';
        eq.currentStatusName = '故障停机';
        eq.lastDowntimeAt = new Date().toLocaleString('sv-SE').replace('T',' ');
        toast('故障已上报' + (urgency === 'critical' ? '（特急），维修工单已自动创建' : '，维修工单已自动创建'));
        closeModal();
        const el = document.getElementById('contentArea');
        el.innerHTML = EquipmentRunDashboard.render();
        EquipmentRunDashboard.init();
      }}
    ]);
  },

  viewDetail(eqId) {
    const eq = this.filteredData.find(d => d.equipmentId === eqId);
    if (!eq) return;
    const sCls = eqRunStatusCls[eq.currentStatus] || 'badge-gray';
    const sName = eqRunStatusMap[eq.currentStatus] || eq.currentStatus;
    const logs = eqRunLogData.filter(l => l.equipmentId === eqId).slice(0, 5);

    const body = `
      <div class="detail-grid" style="margin-bottom:16px;">
        <div class="detail-item"><dt>设备编码</dt><dd>${esc(eq.equipmentCode)}</dd></div>
        <div class="detail-item"><dt>设备名称</dt><dd>${esc(eq.equipmentName)}</dd></div>
        <div class="detail-item"><dt>功能位置</dt><dd>${esc(eq.locationName)}</dd></div>
        <div class="detail-item"><dt>当前状态</dt><dd><span class="badge ${sCls}">${sName}</span></dd></div>
        <div class="detail-item"><dt>累计运行(h)</dt><dd>${eq.runHours} h</dd></div>
        <div class="detail-item"><dt>今日运行(h)</dt><dd>${eq.todayRunHours > 0 ? eq.todayRunHours + ' h' : '-'}</dd></div>
        <div class="detail-item"><dt>当班操作人</dt><dd>${esc(eq.currentOperator || '-')}</dd></div>
        <div class="detail-item"><dt>最近停机</dt><dd style="font-size:12px;">${eq.lastDowntimeAt !== '-' ? eq.lastDowntimeAt : '无'}</dd></div>
        <div class="detail-item"><dt>下次计划维保</dt><dd>${eq.nextPlannedMaintenance !== '-' ? eq.nextPlannedMaintenance : '无'}</dd></div>
        ${eq.sealReason ? `<div class="detail-item" style="grid-column:1/-1;"><dt>停用/封存原因</dt><dd>${esc(eq.sealReason)}</dd></div>` : ''}
      </div>
      <div class="form-section-title">最近运行记录</div>
      <table class="data-table">
        <thead><tr><th>时间</th><th>班次</th><th>状态</th><th>停机类型</th><th>操作人</th><th>关联工单</th></tr></thead>
        <tbody>
          ${logs.length === 0 ? '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">暂无记录</td></tr>' :
            logs.map(l => `<tr>
              <td style="font-size:12px;">${l.recordedTime}</td>
              <td>${esc(l.shift)}</td>
              <td><span class="badge ${eqRunStatusCls[l.runStatus]||'badge-gray'}">${eqRunStatusMap[l.runStatus]||l.runStatus}</span></td>
              <td>${l.downtimeTypeName || '-'}</td>
              <td>${esc(l.operator)}</td>
              <td>${l.relatedWorkOrder || '-'}</td>
            </tr>`).join('')
          }
        </tbody>
      </table>`;

    showModal('设备运行详情 - ' + eq.equipmentCode, body, [
      { text:'关闭', cls:'btn-secondary', action: closeModal },
      { text:'查看完整台账', cls:'btn-blue', action: () => {
        closeModal();
        App.navigateTo('equipment','lc-status','lc-status-log','设备运行&停机台账');
      }}
    ], 'modal-lg');
  },

  checkAlerts() {
    if (this.alertChecked) return;
    this.alertChecked = true;
    const longDowntime = eqRunStatusData.filter(d => {
      if (d.currentStatus === 'fault_downtime' && d.lastDowntimeAt !== '-') {
        const dt = new Date(d.lastDowntimeAt);
        const now = new Date();
        return (now - dt) > 24 * 60 * 60 * 1000;
      }
      return false;
    });
    if (longDowntime.length > 0) {
      const names = longDowntime.map(d => d.equipmentName).join('、');
      toast('【异常预警】以下设备停机超过24小时未恢复：' + names + '，请尽快处理！');
    }
  },

  exportReport() {
    toast('运行报表导出功能：支持导出为Excel格式，包含设备状态汇总、运行时长统计等信息。\n\n（当前为演示模式，实际对接后端导出接口）');
  }
};
