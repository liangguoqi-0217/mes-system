// ===== 设备运行&停机台账 =====
const EquipmentRunLog = {
  page: 1,
  pageSize: 15,
  filtered: [],

  render() {
    const eqOptions = '<option value="">全部设备</option>' + eqRunStatusData.map(e => `<option value="${e.equipmentId}">${esc(e.equipmentCode)} ${esc(e.equipmentName)}</option>`).join('');

    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="padding:10px 20px;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;flex-shrink:0;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-size:15px;font-weight:700;">设备运行 &amp; 停机台账</div>
              <div style="font-size:12px;opacity:0.7;">全周期运行流水记录 · 按时间倒序</div>
            </div>
            <div style="display:flex;gap:8px;">
              <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="EquipmentRunLog.exportLog()">导出台账</button>
              <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="EquipmentRunLog.statistics()">统计分析</button>
            </div>
          </div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>设备</label><select id="logEq">${eqOptions}</select></div>
          <div class="filter-group"><label>班次</label>
            <select id="logShift">${shiftOptions.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}</select>
          </div>
          <div class="filter-group"><label>停机类型</label>
            <select id="logDownType">${downtimeTypeOptions.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}</select>
          </div>
          <div class="filter-group"><label>开始日期</label><input type="date" id="logDateFrom"></div>
          <div class="filter-group"><label>结束日期</label><input type="date" id="logDateTo"></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="EquipmentRunLog.search()">查询</button>
            <button class="btn btn-outline btn-sm" onclick="EquipmentRunLog.reset()">重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table">
            <thead><tr>
              <th>记录时间</th><th>设备</th><th>班次</th><th>运行状态</th><th>累计运行(h)</th><th>停机类型</th><th>停机原因</th><th>停机起止</th><th>处置措施</th><th>操作人</th><th>关联工单</th>
            </tr></thead>
            <tbody id="logTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info"><span class="list-count" id="logCount">共 ${this.filtered.length} 条</span></div>
          <div class="pagination">
            <button class="pagination-btn" id="logPrev" disabled onclick="EquipmentRunLog.prevPage()">‹</button>
            <span class="pagination-info" id="logPageInfo">第 1 / ${Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)} 页</span>
            <button class="pagination-btn" id="logNext" onclick="EquipmentRunLog.nextPage()">›</button>
            <select class="page-size-select" id="logPageSizeSel" onchange="EquipmentRunLog.changePageSize()">
              <option value="15">15条</option><option value="30">30条</option><option value="50">50条</option>
            </select>
          </div>
        </div>
      </div>`;
  },

  init() {
    this.filtered = [...eqRunLogData].sort((a, b) => new Date(b.recordedTime) - new Date(a.recordedTime));
    this.page = 1;
    this.renderTable();
  },

  search() {
    const eqId = document.getElementById('logEq').value;
    const shift = document.getElementById('logShift').value;
    const downType = document.getElementById('logDownType').value;
    const dateFrom = document.getElementById('logDateFrom').value;
    const dateTo = document.getElementById('logDateTo').value;

    this.filtered = eqRunLogData.filter(d => {
      if (eqId && d.equipmentId !== eqId) return false;
      if (shift && d.shift !== shift) return false;
      if (downType && d.downtimeType !== downType) return false;
      if (dateFrom && d.recordedTime < dateFrom + ' 00:00:00') return false;
      if (dateTo && d.recordedTime > dateTo + ' 23:59:59') return false;
      return true;
    }).sort((a, b) => new Date(b.recordedTime) - new Date(a.recordedTime));

    this.page = 1;
    this.renderTable();
  },

  reset() {
    document.getElementById('logEq').value = '';
    document.getElementById('logShift').value = '';
    document.getElementById('logDownType').value = '';
    document.getElementById('logDateFrom').value = '';
    document.getElementById('logDateTo').value = '';
    this.filtered = [...eqRunLogData].sort((a, b) => new Date(b.recordedTime) - new Date(a.recordedTime));
    this.page = 1;
    this.renderTable();
  },

  renderTable() {
    const tbody = document.getElementById('logTableBody');
    if (!tbody) return;
    const start = (this.page - 1) * this.pageSize;
    const rows = this.filtered.slice(start, start + this.pageSize);
    document.getElementById('logCount').textContent = '共 ' + this.filtered.length + ' 条';
    document.getElementById('logPageInfo').textContent = '第 ' + this.page + ' / ' + Math.ceil(Math.max(this.filtered.length, 1) / this.pageSize) + ' 页';

    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;padding:40px;color:var(--text-muted);">暂无匹配的记录</td></tr>';
      return;
    }

    tbody.innerHTML = rows.map(d => {
      const statusCls = eqRunStatusCls[d.runStatus] || 'badge-gray';
      const statusName = eqRunStatusMap[d.runStatus] || d.runStatus;
      const isDowntime = d.downtimeType !== '';
      const downtimeTime = isDowntime ?
        (d.downtimeStart ? d.downtimeStart.slice(5, 16) : '-') + ' ~ ' + (d.downtimeEnd ? d.downtimeEnd.slice(5, 16) : '至今') :
        '-';

      return `<tr style="${isDowntime?'background:#fff7ed;':''}">
        <td style="font-size:11px;white-space:nowrap;">${d.recordedTime}</td>
        <td>
          <div style="font-weight:600;font-size:12px;">${esc(d.equipmentName)}</div>
          <div style="font-size:10px;color:var(--text-muted);">${esc(d.equipmentCode)}</div>
        </td>
        <td>${esc(d.shift)}</td>
        <td><span class="badge ${statusCls}">${statusName}</span></td>
        <td>${d.cumulativeRunHours} h</td>
        <td>${isDowntime ? `<span class="badge badge-red">${esc(d.downtimeTypeName)}</span>` : '<span style="color:var(--text-muted);">-</span>'}</td>
        <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;" title="${esc(d.downtimeReason)}">${isDowntime ? esc(d.downtimeReason) : '-'}</td>
        <td style="font-size:11px;white-space:nowrap;">${downtimeTime}</td>
        <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;" title="${esc(d.measures)}">${d.measures ? esc(d.measures) : '-'}</td>
        <td>${esc(d.operator)}</td>
        <td>${d.relatedWorkOrder ? `<span style="font-size:11px;color:var(--primary-lighter);">${esc(d.relatedWorkOrder)}</span>` : '-'}</td>
      </tr>`;
    }).join('');
    this.updatePagination();
  },

  updatePagination() {
    const totalPages = Math.ceil(Math.max(this.filtered.length, 1) / this.pageSize);
    document.getElementById('logPrev').disabled = this.page <= 1;
    document.getElementById('logNext').disabled = this.page >= totalPages;
    document.getElementById('logPageInfo').textContent = '第 ' + this.page + ' / ' + totalPages + ' 页';
    document.getElementById('logPageSizeSel').value = this.pageSize;
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() {
    const maxPage = Math.ceil(Math.max(this.filtered.length, 1) / this.pageSize);
    if (this.page < maxPage) { this.page++; this.renderTable(); }
  },
  changePageSize() {
    this.pageSize = parseInt(document.getElementById('logPageSizeSel').value);
    this.page = 1;
    this.renderTable();
  },

  exportLog() {
    toast('台账导出功能：支持按当前筛选条件导出为Excel格式，用于报表和审计。\n\n导出字段：记录时间、设备、班次、运行状态、累计运行时长、停机类型、停机原因、停机起止时间、处置措施、操作人、关联工单\n\n（当前为演示模式，实际对接后端导出接口）');
  },

  statistics() {
    const totalRecords = this.filtered.length;
    const faultRecords = this.filtered.filter(d => d.downtimeType === 'fault').length;
    const maintenanceRecords = this.filtered.filter(d => d.downtimeType === 'maintenance').length;
    const runningRecords = this.filtered.filter(d => d.downtimeType === '').length;

    const body = `
      <div class="stats-row" style="margin-bottom:20px;">
        <div class="stat-card">
          <div><div class="stat-label">总记录数</div><div class="stat-value" style="font-size:22px;">${totalRecords}</div></div></div>
        <div class="stat-card">
          <div><div class="stat-label">故障停机记录</div><div class="stat-value" style="font-size:22px;color:#DC2626;">${faultRecords}</div></div></div>
        <div class="stat-card">
          <div><div class="stat-label">维保停机记录</div><div class="stat-value" style="font-size:22px;color:#3B82F6;">${maintenanceRecords}</div></div></div>
        <div class="stat-card">
          <div><div class="stat-label">正常运行记录</div><div class="stat-value" style="font-size:22px;color:#10B981;">${runningRecords}</div></div></div>
      </div>
      <div style="padding:20px;text-align:center;color:var(--text-muted);border:1px dashed var(--border);border-radius:var(--radius);">
        <div style="font-size:14px;font-weight:600;margin-bottom:8px;">停机分类统计</div>
        <div style="display:flex;gap:16px;justify-content:center;font-size:13px;">
          ${downtimeTypeOptions.filter(o => o.value).map(o => {
            const count = this.filtered.filter(d => d.downtimeType === o.value).length;
            const pct = totalRecords > 0 ? (count / totalRecords * 100).toFixed(1) : 0;
            return `<div style="text-align:center;"><div style="font-weight:700;font-size:18px;">${count}</div><div>${o.label}</div><div style="font-size:11px;color:var(--text-muted);">${pct}%</div></div>`;
          }).join('')}
        </div>
      </div>`;
    showModal('台账统计分析', body, [
      { text:'关闭', cls:'btn-secondary', action: closeModal }
    ], 'modal-lg');
  }
};
