// ===== 设备状态变更单 =====
const EquipmentStatusChange = {
  page: 1,
  pageSize: 10,
  filtered: [],

  render() {
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="padding:10px 20px;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;flex-shrink:0;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-size:15px;font-weight:700;">设备状态变更单</div>
              <div style="font-size:12px;opacity:0.7;">计划性停机 / 临时停用 / 封存等正式状态切换</div>
            </div>
            <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="EquipmentStatusChange.addModal()">+ 新建变更单</button>
          </div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>单据编号</label><input type="text" id="scDocNo" placeholder="模糊查询"></div>
          <div class="filter-group"><label>设备信息</label><input type="text" id="scEqInfo" placeholder="编码/名称"></div>
          <div class="filter-group"><label>变更类型</label>
            <select id="scChangeType">
              <option value="">全部类型</option>
              ${eqStatusChangeTypeOptions.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group"><label>单据状态</label>
            <select id="scStatus">
              <option value="">全部状态</option>
              ${eqStatusChangeStatusOptions.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
            </select>
          </div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="EquipmentStatusChange.search()">查询</button>
            <button class="btn btn-outline btn-sm" onclick="EquipmentStatusChange.reset()">重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table">
            <thead><tr>
              <th>单据编号</th><th>设备信息</th><th>变更类型</th><th>生效时间</th><th>预计恢复</th><th>申请人</th><th>状态</th><th>操作</th>
            </tr></thead>
            <tbody id="scTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info"><span class="list-count" id="scCount">共 ${this.filtered.length} 条</span></div>
          <div class="pagination">
            <button class="pagination-btn" id="scPrev" disabled onclick="EquipmentStatusChange.prevPage()">‹</button>
            <span class="pagination-info" id="scPageInfo">第 1 / ${Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)} 页</span>
            <button class="pagination-btn" id="scNext" onclick="EquipmentStatusChange.nextPage()">›</button>
            <select class="page-size-select" id="scPageSizeSel" onchange="EquipmentStatusChange.changePageSize()">
              <option value="10">10条</option><option value="20">20条</option><option value="50">50条</option>
            </select>
          </div>
        </div>
      </div>`;
  },

  init() {
    this.filtered = [...eqStatusChangeData];
    this.page = 1;
    this.renderTable();
  },

  search() {
    const docNo = document.getElementById('scDocNo').value.trim().toLowerCase();
    const eqInfo = document.getElementById('scEqInfo').value.trim().toLowerCase();
    const changeType = document.getElementById('scChangeType').value;
    const status = document.getElementById('scStatus').value;

    this.filtered = eqStatusChangeData.filter(d => {
      if (docNo && !d.docNo.toLowerCase().includes(docNo)) return false;
      if (eqInfo && !d.equipmentCode.toLowerCase().includes(eqInfo) && !d.equipmentName.toLowerCase().includes(eqInfo)) return false;
      if (changeType && d.changeType !== changeType) return false;
      if (status && d.status !== status) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
    this.updatePagination();
  },

  reset() {
    document.getElementById('scDocNo').value = '';
    document.getElementById('scEqInfo').value = '';
    document.getElementById('scChangeType').value = '';
    document.getElementById('scStatus').value = '';
    this.filtered = [...eqStatusChangeData];
    this.page = 1;
    this.renderTable();
    this.updatePagination();
  },

  renderTable() {
    const tbody = document.getElementById('scTableBody');
    if (!tbody) return;
    const start = (this.page - 1) * this.pageSize;
    const rows = this.filtered.slice(start, start + this.pageSize);
    document.getElementById('scCount').textContent = '共 ' + this.filtered.length + ' 条';
    document.getElementById('scPageInfo').textContent = '第 ' + this.page + ' / ' + Math.ceil(Math.max(this.filtered.length, 1) / this.pageSize) + ' 页';

    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-muted);">暂无匹配的数据</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(d => {
      const stOpt = eqStatusChangeStatusOptions.find(o => o.value === d.status);
      const statusBadge = stOpt ? `<span class="badge ${stOpt.cls}">${stOpt.label}</span>` : d.statusName;
      return `<tr>
        <td><span style="font-weight:600;color:var(--primary);cursor:pointer;" onclick="EquipmentStatusChange.detail('${d.id}')">${esc(d.docNo)}</span></td>
        <td>
          <div style="font-weight:600;">${esc(d.equipmentName)}</div>
          <div style="font-size:11px;color:var(--text-muted);">${esc(d.equipmentCode)}</div>
        </td>
        <td><span class="badge badge-blue">${esc(d.changeTypeName)}</span></td>
        <td style="font-size:12px;">${d.effectiveTime}</td>
        <td style="font-size:12px;">${d.expectedRecoveryTime !== '-' ? d.expectedRecoveryTime : '<span style="color:var(--text-muted);">-</span>'}</td>
        <td>${esc(d.applicant)}</td>
        <td>${statusBadge}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-outline" onclick="EquipmentStatusChange.detail('${d.id}')">查看</button>
            ${d.status === 'draft' ? `<button class="btn btn-sm btn-blue" onclick="EquipmentStatusChange.submit('${d.id}')">提交</button>` : ''}
            ${d.status === 'pending' ? `<button class="btn btn-sm btn-success" onclick="EquipmentStatusChange.approve('${d.id}')">审批</button>` : ''}
            <button class="btn btn-sm btn-outline" onclick="EquipmentStatusChange.print('${d.id}')">打印</button>
          </div>
        </td>
      </tr>`;
    }).join('');
    this.updatePagination();
  },

  updatePagination() {
    const totalPages = Math.ceil(Math.max(this.filtered.length, 1) / this.pageSize);
    document.getElementById('scPrev').disabled = this.page <= 1;
    document.getElementById('scNext').disabled = this.page >= totalPages;
    document.getElementById('scPageInfo').textContent = '第 ' + this.page + ' / ' + totalPages + ' 页';
    document.getElementById('scPageSizeSel').value = this.pageSize;
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() {
    const maxPage = Math.ceil(Math.max(this.filtered.length, 1) / this.pageSize);
    if (this.page < maxPage) { this.page++; this.renderTable(); }
  },
  changePageSize() {
    this.pageSize = parseInt(document.getElementById('scPageSizeSel').value);
    this.page = 1;
    this.renderTable();
  },

  addModal() {
    const eqOptions = eqRunStatusData.map(e => `<option value="${e.equipmentId}">${esc(e.equipmentCode)} ${esc(e.equipmentName)}</option>`).join('');
    const body = `
      <div class="form-section">
        <div class="form-section-title">基本信息</div>
        <div class="form-grid">
          <div class="form-group"><label>选择设备 <span class="req">*</span></label><select id="scNewEq">${eqOptions}</select></div>
          <div class="form-group"><label>变更类型 <span class="req">*</span></label>
            <select id="scNewType">${eqStatusChangeTypeOptions.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}</select>
          </div>
          <div class="form-group full"><label>变更原因 <span class="req">*</span></label><textarea id="scNewReason" rows="2" placeholder="描述状态变更的具体原因"></textarea></div>
          <div class="form-group"><label>生效时间 <span class="req">*</span></label><input type="datetime-local" id="scNewEffTime"></div>
          <div class="form-group"><label>预计恢复时间</label><input type="datetime-local" id="scNewRecTime"></div>
          <div class="form-group full"><label>停机范围</label><input id="scNewScope" placeholder="如：单台设备 / 整条产线 / 区域"></div>
          <div class="form-group full"><label>影响产线/工序</label><input id="scNewLines" placeholder="受影响的产线或工序"></div>
        </div>
      </div>
      <div class="form-section" style="margin-top:16px;">
        <div class="form-section-title">风险评估</div>
        <div class="form-grid">
          <div class="form-group full"><label>风险说明（GMP生产影响评估）</label><textarea id="scNewRisk" rows="3" placeholder="描述潜在风险及GMP影响评估"></textarea></div>
          <div class="form-group full"><label>GMP影响</label><input id="scNewGmp" placeholder="如：A级洁净区 / C级 / 无影响"></div>
        </div>
      </div>`;
    showModal('新建状态变更单', body, [
      { text:'取消', cls:'btn-secondary', action: closeModal },
      { text:'保存草稿', cls:'btn-outline', action: () => {
        toast('变更单草稿已保存');
        closeModal();
      }},
      { text:'保存并提交', cls:'btn-blue', action: () => {
        const eqId = document.getElementById('scNewEq').value;
        const changeType = document.getElementById('scNewType').value;
        const reason = document.getElementById('scNewReason').value;
        if (!reason) { toast('请填写变更原因'); return; }
        const eq = eqRunStatusData.find(d => d.equipmentId === eqId);
        const newId = 'SC' + String(eqStatusChangeData.length + 1).padStart(3, '0');
        eqStatusChangeData.unshift({
          id: newId, docNo: 'BG-' + new Date().getFullYear() + '-' + String(eqStatusChangeData.length + 1).padStart(5, '0'),
          equipmentId: eqId, equipmentCode: eq?.equipmentCode || '', equipmentName: eq?.equipmentName || '',
          changeType, changeTypeName: eqStatusChangeTypeOptions.find(o => o.value === changeType)?.label || changeType,
          reason, effectiveTime: document.getElementById('scNewEffTime').value?.replace('T',' ') + ':00' || '',
          expectedRecoveryTime: document.getElementById('scNewRecTime').value?.replace('T',' ') + ':00' || '-',
          scope: document.getElementById('scNewScope').value || '-',
          impactLines: document.getElementById('scNewLines').value || '-',
          riskDesc: document.getElementById('scNewRisk').value || '-',
          gmpImpact: document.getElementById('scNewGmp').value || '-',
          applicant: '当前用户', applicantDept: '设备管理部',
          deptApprover: '', approvalOpinion: '',
          status: 'pending', statusName: '待审批',
          attachments: [],
          createdBy: '当前用户', createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '), updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
        });
        toast('变更单已提交审批');
        closeModal();
        EquipmentStatusChange.init();
        const el = document.getElementById('contentArea');
        el.innerHTML = EquipmentStatusChange.render();
        EquipmentStatusChange.init();
      }}
    ], 'modal-lg');
    // 设置默认时间
    setTimeout(() => {
      const input = document.getElementById('scNewEffTime');
      if (input) input.value = new Date().toISOString().slice(0, 16);
    }, 100);
  },

  detail(id) {
    const d = eqStatusChangeData.find(item => item.id === id);
    if (!d) return;
    const stOpt = eqStatusChangeStatusOptions.find(o => o.value === d.status);
    const statusBadge = stOpt ? `<span class="badge ${stOpt.cls}">${stOpt.label}</span>` : d.statusName;

    const body = `
      <div class="detail-grid">
        <div class="detail-item"><dt>单据编号</dt><dd>${esc(d.docNo)}</dd></div>
        <div class="detail-item"><dt>设备编码</dt><dd>${esc(d.equipmentCode)}</dd></div>
        <div class="detail-item"><dt>设备名称</dt><dd>${esc(d.equipmentName)}</dd></div>
        <div class="detail-item"><dt>单据状态</dt><dd>${statusBadge}</dd></div>
        <div class="detail-item"><dt>变更类型</dt><dd><span class="badge badge-blue">${esc(d.changeTypeName)}</span></dd></div>
        <div class="detail-item"><dt>生效时间</dt><dd>${esc(d.effectiveTime)}</dd></div>
        <div class="detail-item"><dt>预计恢复时间</dt><dd>${esc(d.expectedRecoveryTime)}</dd></div>
        <div class="detail-item"><dt>申请人</dt><dd>${esc(d.applicant)}</dd></div>
        <div class="detail-item"><dt>申请人部门</dt><dd>${esc(d.applicantDept)}</dd></div>
        <div class="detail-item"><dt>审批人</dt><dd>${esc(d.deptApprover || '-')}</dd></div>
        ${d.approvalOpinion ? `<div class="detail-item" style="grid-column:1/-1;"><dt>审批意见</dt><dd>${esc(d.approvalOpinion)}</dd></div>` : ''}
        <div class="detail-item" style="grid-column:1/-1;"><dt>变更原因</dt><dd>${esc(d.reason)}</dd></div>
        <div class="detail-item"><dt>停机范围</dt><dd>${esc(d.scope)}</dd></div>
        <div class="detail-item"><dt>创建时间</dt><dd style="font-size:12px;">${esc(d.createdAt)}</dd></div>
      </div>
      <div style="margin-top:16px;">
        <div class="form-section-title">影响评估</div>
        <div class="detail-grid">
          <div class="detail-item" style="grid-column:1/-1;"><dt>影响产线/工序</dt><dd>${esc(d.impactLines)}</dd></div>
          <div class="detail-item" style="grid-column:1/-1;"><dt>风险说明</dt><dd style="font-size:13px;line-height:1.6;">${esc(d.riskDesc)}</dd></div>
          <div class="detail-item" style="grid-column:1/-1;"><dt>GMP影响</dt><dd>${esc(d.gmpImpact)}</dd></div>
        </div>
      </div>
      ${d.attachments.length > 0 ? `
      <div style="margin-top:16px;">
        <div class="form-section-title">附件</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">${d.attachments.map(a => `<span style="padding:4px 12px;background:var(--bg);border-radius:var(--radius-sm);font-size:12px;">📎 ${esc(a)}</span>`).join('')}</div>
      </div>` : ''}`;

    const footerBtns = [{ text:'关闭', cls:'btn-secondary', action: closeModal }];
    if (d.status === 'draft') {
      footerBtns.unshift({ text:'提交审批', cls:'btn-blue', action: () => {
        d.status = 'pending'; d.statusName = '待审批';
        toast('已提交审批');
        closeModal();
        EquipmentStatusChange.init();
        const el = document.getElementById('contentArea');
        el.innerHTML = EquipmentStatusChange.render();
        EquipmentStatusChange.init();
      }});
    }
    if (d.status === 'pending') {
      footerBtns.unshift({ text:'审批通过', cls:'btn-success', action: () => {
        d.status = 'approved'; d.statusName = '已审批';
        d.deptApprover = '孙部长'; d.approvalOpinion = '同意变更';
        d.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        toast('已审批通过');
        closeModal();
        EquipmentStatusChange.init();
        const el = document.getElementById('contentArea');
        el.innerHTML = EquipmentStatusChange.render();
        EquipmentStatusChange.init();
      }});
      footerBtns.unshift({ text:'驳回', cls:'btn-warning', action: () => {
        d.status = 'rejected'; d.statusName = '已驳回'; d.approvalOpinion = '驳回：需补充材料';
        toast('已驳回');
        closeModal();
        EquipmentStatusChange.init();
        const el = document.getElementById('contentArea');
        el.innerHTML = EquipmentStatusChange.render();
        EquipmentStatusChange.init();
      }});
    }

    showModal('状态变更单详情 - ' + d.docNo, body, footerBtns, 'modal-lg');
  },

  submit(id) {
    const d = eqStatusChangeData.find(item => item.id === id);
    if (!d) return;
    d.status = 'pending'; d.statusName = '待审批';
    d.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    toast('变更单 ' + d.docNo + ' 已提交审批');
    this.init();
    const el = document.getElementById('contentArea');
    el.innerHTML = EquipmentStatusChange.render();
    EquipmentStatusChange.init();
  },

  approve(id) {
    this.detail(id);
  },

  retract(id) {
    const d = eqStatusChangeData.find(item => item.id === id);
    if (!d) return;
    d.status = 'draft'; d.statusName = '草稿';
    d.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    toast('变更单 ' + d.docNo + ' 已撤回');
    this.init();
    const el = document.getElementById('contentArea');
    el.innerHTML = EquipmentStatusChange.render();
    EquipmentStatusChange.init();
  },

  print(id) {
    const d = eqStatusChangeData.find(item => item.id === id);
    if (!d) return;
    toast('打印功能：正在生成「' + d.docNo + '」变更单打印预览...\n\n（当前为演示模式，实际对接打印服务）');
  }
};
