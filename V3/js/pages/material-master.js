// ===== Material Master Page =====
const MaterialMaster = {
  page: 1, pageSize: 10, filtered: [],

  render() {
    const data = materialData;
    this.filtered = [...data];
    this.page = 1;
    return `
      <div class="mat-master" style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">物料主数据管理</div><div style="font-size:13px;opacity:0.8;">物料台账</div></div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>工厂</label><select id="matFactory"><option value="">全部</option>${materialFactoryOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>MRP控制者</label><select id="matMrpCtrl"><option value="">全部</option>${materialMrpCtrlOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>批次管理</label><select id="matWholesale"><option value="">全部</option>${materialBatchMgmtOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>采购类型</label><select id="matProcType"><option value="">全部</option>${materialProcTypeOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>物料类型</label><select id="matType"><option value="">全部</option>${materialTypeOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>物料号</label><input type="text" id="matCode" placeholder="模糊查询"></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="MaterialMaster.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="MaterialMaster.reset()">重置</button>
          </div>
        </div>
        <div style="flex-shrink:0;display:flex;justify-content:flex-end;padding:4px 16px 0;">
          <button class="btn btn-sm" style="background:#f1f5f9;color:#475569;border:1px solid var(--border);" onclick="MaterialMaster.export()">导出</button>
        </div>
        <div class="table-wrapper" style="flex:1;overflow-x:auto;">
          <table class="data-table" style="min-width:1600px;">
            <thead><tr>
              <th style="width:50px;">序号</th>
              <th>工厂</th>
              <th>物料号</th>
              <th>物料描述</th>
              <th>物料类型</th>
              <th>物料类型描述</th>
              <th>物料组</th>
              <th>物料组描述</th>
              <th>基本单位</th>
              <th>计划交货时间</th>
              <th>原始值</th>
              <th>删除标识</th>
              <th>MRP类型</th>
              <th>MRP控制者</th>
              <th>采购类型</th>
              <th>批次管理</th>
              <th>允许未计划交货</th>
            </tr></thead>
            <tbody id="matTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info"><span class="list-count" id="matCount">共 ${this.filtered.length} 条</span></div>
          <div class="pagination">
            <button class="pagination-btn" id="matPrev" disabled onclick="MaterialMaster.prevPage()">‹</button>
            <span class="pagination-info" id="matPageInfo">第 1 / ${Math.ceil(this.filtered.length/this.pageSize)} 页</span>
            <button class="pagination-btn" id="matNext" onclick="MaterialMaster.nextPage()">›</button>
            <select class="page-size-select" id="matPageSizeSel" onchange="MaterialMaster.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
          </div>
        </div>
      </div>`;
  },

  init() {
    this.filtered = [...materialData];
    this.page = 1;
    this.renderTable();
  },

  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;
    document.getElementById('matCount').textContent = `共 ${this.filtered.length} 条`;
    document.getElementById('matPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('matPrev').disabled = this.page <= 1;
    document.getElementById('matNext').disabled = this.page >= totalPages;
    document.getElementById('matPageSizeSel').value = this.pageSize;

    if (!document.getElementById('matTableBody')) return;
    document.getElementById('matTableBody').innerHTML = page.map((m, i) => `
      <tr>
        <td>${start + i + 1}</td>
        <td>${esc(m.factoryName)}</td>
        <td style="color:#2563eb;font-weight:600;">${esc(m.code)}</td>
        <td>${esc(m.description)}</td>
        <td>${esc(m.materialType)}</td>
        <td>${esc(m.materialTypeName)}</td>
        <td>${esc(m.materialGroup)}</td>
        <td>${esc(m.materialGroupName)}</td>
        <td>${esc(m.baseUnit)}</td>
        <td>${m.plannedDeliveryTime ? m.plannedDeliveryTime + '天' : ''}</td>
        <td>${m.originalValue !== undefined && m.originalValue !== '' ? m.originalValue : ''}</td>
        <td>${m.deleteFlag === 'D' ? '<span class="badge badge-red">D</span>' : ''}</td>
        <td>${esc(m.mrpType)}</td>
        <td>${esc(m.mrpController)}</td>
        <td>${m.procurementType === 'external' ? '外购' : m.procurementType === 'internal' ? '自制' : esc(m.procurementType)}</td>
        <td>${m.batchManagement === 'Y' ? '<span class="badge badge-green">已启用</span>' : '<span class="badge badge-gray">未启用</span>'}</td>
        <td>${m.allowUnplanned === 'Y' ? '允许' : '不允许'}</td>
      </tr>`).join('');
  },

  search() {
    const factory = document.getElementById('matFactory').value;
    const mrpCtrl = document.getElementById('matMrpCtrl').value;
    const wholesale = document.getElementById('matWholesale').value;
    const procType = document.getElementById('matProcType').value;
    const matType = document.getElementById('matType').value;
    const code = document.getElementById('matCode').value.trim();
    this.filtered = materialData.filter(m => {
      if (factory && m.factory !== factory) return false;
      if (mrpCtrl && m.mrpController !== mrpCtrl) return false;
      if (wholesale && m.batchManagement !== wholesale) return false;
      if (procType && m.procurementType !== procType) return false;
      if (matType && m.materialType !== matType) return false;
      if (code && !m.code.includes(code)) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
  },

  reset() {
    document.getElementById('matFactory').value = '';
    document.getElementById('matMrpCtrl').value = '';
    document.getElementById('matWholesale').value = '';
    document.getElementById('matProcType').value = '';
    document.getElementById('matType').value = '';
    document.getElementById('matCode').value = '';
    this.filtered = [...materialData];
    this.page = 1;
    this.renderTable();
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() { if (this.page < Math.ceil(this.filtered.length/this.pageSize)) { this.page++; this.renderTable(); } },
  changePageSize() { this.pageSize = parseInt(document.getElementById('matPageSizeSel').value); this.page = 1; this.renderTable(); },

  export() {
    toast('导出功能开发中');
  },

  addModal() {
    showModal(
      '新增物料',
      `<form id="matAddForm" onsubmit="return false;" style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
        <div class="form-group"><label>工厂<span class="required">*</span></label><select id="addMatFactory" required><option value="">请选择</option>${materialFactoryOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="form-group"><label>物料号<span class="required">*</span></label><input type="text" id="addMatCode" placeholder="请输入物料号" required /></div>
        <div class="form-group"><label>物料描述<span class="required">*</span></label><input type="text" id="addMatDesc" placeholder="请输入物料描述" required /></div>
        <div class="form-group"><label>物料类型<span class="required">*</span></label><select id="addMatType" required><option value="">请选择</option>${materialTypeOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="form-group"><label>物料组<span class="required">*</span></label><input type="text" id="addGroup" placeholder="请输入物料组" required /></div>
        <div class="form-group"><label>基本单位<span class="required">*</span></label><select id="addBaseUnit" required><option value="">请选择</option><option value="件">件</option><option value="套">套</option><option value="个">个</option><option value="kg">kg</option><option value="L">L</option><option value="箱">箱</option><option value="包">包</option></select></div>
        <div class="form-group"><label>MRP类型</label><select id="addMrpType"><option value="ND">ND（无）</option><option value="PD">PD（计划驱动）</option><option value="VM">VM（VMI）</option></select></div>
        <div class="form-group"><label>MRP控制者</label><select id="addMrpCtrl"><option value="">请选择</option>${materialMrpCtrlOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="form-group"><label>采购类型</label><select id="addProcType"><option value="external">外购</option><option value="internal">自制</option></select></div>
        <div class="form-group"><label>计划交货时间(天)</label><input type="number" id="addPlannedDeliv" placeholder="例如：7" min="0" /></div>
        <div class="form-group"><label>批次管理</label><select id="addBatchMgmt"><option value="N">未启用</option><option value="Y">已启用</option></select></div>
        <div class="form-group"><label>允许未计划交货</label><select id="addAllowUnplanned"><option value="N">不允许</option><option value="Y">允许</option></select></div>
      </form>`,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal },
        { text:'确认新增', cls:'btn-primary', action: ()=>{ MaterialMaster.saveNew(); } }
      ],
      'modal-xl'
    );
  },

  saveNew() {
    const code = document.getElementById('addMatCode').value.trim();
    const desc = document.getElementById('addMatDesc').value.trim();
    const factoryVal = document.getElementById('addMatFactory').value;
    const typeVal = document.getElementById('addMatType').value;
    const group = document.getElementById('addGroup').value.trim();
    const baseUnit = document.getElementById('addBaseUnit').value;

    if (!code || !desc || !factoryVal || !typeVal || !group || !baseUnit) { toast('请填写必填项'); return; }

    const factoryOpt = materialFactoryOptions.find(f => f.value === factoryVal);
    const typeOpt = materialTypeOptions.find(t => t.value === typeVal);

    const n = {
      id: 'MAT' + String(materialData.length + 1).padStart(3,'0'),
      code: code,
      description: desc,
      factory: factoryVal,
      factoryName: factoryOpt ? factoryOpt.label : factoryVal,
      materialType: typeVal,
      materialTypeName: typeOpt ? typeOpt.label : typeVal,
      materialGroup: group,
      materialGroupName: '',
      baseUnit: baseUnit,
      plannedDeliveryTime: parseInt(document.getElementById('addPlannedDeliv').value) || null,
      originalValue: '',
      deleteFlag: '',
      overviewScreen: '',
      mrpType: document.getElementById('addMrpType').value,
      mrpController: document.getElementById('addMrpCtrl').value,
      procurementType: document.getElementById('addProcType').value,
      batchManagement: document.getElementById('addBatchMgmt').value,
      allowUnplanned: document.getElementById('addAllowUnplanned').value
    };
    materialData.push(n);
    closeModal();
    this.init();
    toast('物料新增成功');
  }
};
