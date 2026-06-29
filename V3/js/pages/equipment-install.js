// ===== 设备安装/移交 页面模块 =====
const EquipmentInstall = {
  mode: 'list', page: 1, pageSize: 10, filtered: [],
  formId: null, formData: null,

  // ===== 主渲染入口 =====
  render() {
    if (this.mode === 'form' || this.mode === 'detail') return this.renderForm();
    return this.renderList();
  },
  init() {
    if (this.mode === 'form' || this.mode === 'detail') { this.renderFormInit(); return; }
    this.filtered = [...installDocsData];
    this.page = 1;
    this.renderTable();
  },

  // ===== 1. 单据列表页 =====
  renderList() {
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">设备安装 / 移交管理</div><div style="font-size:13px;opacity:0.8;">设备到货验收 · 安装调试 · 资产移交</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary" style="background:rgba(255,255,255,0.15);color:white;" onclick="EquipmentInstall.refresh()"><span>&#8635;</span> 刷新</button>
            <button class="btn btn-blue" onclick="EquipmentInstall.newDoc()">+ 新增单据</button>
          </div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>单据编号</label><input type="text" id="instDocNo" placeholder="模糊查询"></div>
          <div class="filter-group"><label>设备编码/名称</label><input type="text" id="instEqInfo" placeholder="模糊查询"></div>
          <div class="filter-group"><label>单据类型</label><select id="instDocType"><option value="">全部</option>${installDocTypeOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>状态</label><select id="instStatus"><option value="">全部</option>${installDocStatusOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>经办人</label><input type="text" id="instHandler" placeholder="模糊查询"></div>
          <div class="filter-group"><label>所属车间</label><select id="instDept"><option value="">全部</option><option value="设备管理部">设备管理部</option><option value="生产一部">生产一部</option><option value="原料药车间">原料药车间</option></select></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="EquipmentInstall.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="EquipmentInstall.reset()">重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table">
            <thead><tr><th>单据编号</th><th>单据类型</th><th>设备信息</th><th>到货日期</th><th>状态</th><th>经办人</th><th>操作</th></tr></thead>
            <tbody id="instTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info"><span class="list-count" id="instCount">共 ${this.filtered.length} 条</span></div>
          <div class="pagination">
            <button class="pagination-btn" id="instPrev" disabled onclick="EquipmentInstall.prevPage()">&#8249;</button>
            <span class="pagination-info" id="instPageInfo">第 1 / ${Math.ceil(this.filtered.length/this.pageSize)||1} 页</span>
            <button class="pagination-btn" id="instNext" onclick="EquipmentInstall.nextPage()">&#8250;</button>
            <select class="page-size-select" id="instPageSizeSel" onchange="EquipmentInstall.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
          </div>
        </div>
      </div>`;
  },
  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;
    document.getElementById('instCount').textContent = `共 ${this.filtered.length} 条`;
    document.getElementById('instPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('instPrev').disabled = this.page <= 1;
    document.getElementById('instNext').disabled = this.page >= totalPages;
    document.getElementById('instPageSizeSel').value = this.pageSize;
    document.getElementById('instTableBody').innerHTML = page.map(d => {
      const s = installDocStatusOptions.find(o => o.value === d.status);
      const t = installDocTypeOptions.find(o => o.value === d.docType);
      const eqInfo = d.eqName ? `${esc(d.eqCode||'-')} / ${esc(d.eqName)}` : (d.eqCode || '-');
      const canEdit = d.status === 'draft' || d.status === 'pending_accept' || d.status === 'accept_rejected' || d.status === 'pending_rectify';
      const canWithdraw = d.status === 'pending_accept' || d.status === 'pending_handover';
      return `<tr>
        <td><strong style="color:var(--primary);">${esc(d.docNo)}</strong></td>
        <td>${t ? t.label : d.docTypeName}</td>
        <td>${eqInfo}</td>
        <td>${esc(d.arriveDate||'-')}</td>
        <td><span class="badge ${s? s.cls : 'badge-gray'}">${s? s.label : d.statusName}</span></td>
        <td>${esc(d.handler||'-')}</td>
        <td class="table-actions">
          <button class="btn btn-outline btn-sm" onclick="EquipmentInstall.viewDoc('${d.id}')">查看</button>
          ${canEdit ? `<button class="btn btn-blue btn-sm" onclick="EquipmentInstall.editDoc('${d.id}')">编辑</button>` : ''}
          ${canWithdraw ? `<button class="btn btn-warning btn-sm" onclick="EquipmentInstall.withdrawDoc('${d.id}')">撤回</button>` : ''}
          <button class="btn btn-outline btn-sm" style="color:var(--text-muted);" onclick="EquipmentInstall.showLog('${d.id}')">日志</button>
        </td>
      </tr>`;
    }).join('');
  },
  search() {
    const docNo = document.getElementById('instDocNo').value.trim();
    const eqInfo = document.getElementById('instEqInfo').value.trim();
    const docType = document.getElementById('instDocType').value;
    const status = document.getElementById('instStatus').value;
    const handler = document.getElementById('instHandler').value.trim();
    const dept = document.getElementById('instDept').value;
    this.filtered = installDocsData.filter(d => {
      if (docNo && !d.docNo.includes(docNo)) return false;
      if (eqInfo && !(d.eqCode||'').includes(eqInfo) && !(d.eqName||'').includes(eqInfo)) return false;
      if (docType && d.docType !== docType) return false;
      if (status && d.status !== status) return false;
      if (handler && !(d.handler||'').includes(handler)) return false;
      if (dept && !(d.handlerDept||'').includes(dept)) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
  },
  reset() {
    document.getElementById('instDocNo').value = '';
    document.getElementById('instEqInfo').value = '';
    document.getElementById('instDocType').value = '';
    document.getElementById('instStatus').value = '';
    document.getElementById('instHandler').value = '';
    document.getElementById('instDept').value = '';
    this.filtered = [...installDocsData];
    this.page = 1;
    this.renderTable();
  },
  refresh() { this.reset(); },
  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() { const tp = Math.ceil(this.filtered.length/this.pageSize); if (this.page < tp) { this.page++; this.renderTable(); } },
  changePageSize() { this.pageSize = parseInt(document.getElementById('instPageSizeSel').value); this.page = 1; this.renderTable(); },

  // ===== 日志查看 =====
  showLog(docId) {
    const doc = installDocsData.find(d => d.id === docId);
    const logs = installDocLogs[docId] || [];
    const logsHtml = logs.length ? logs.map(l => `
      <div style="padding:10px;background:#f8fafc;border-radius:6px;margin-bottom:6px;border-left:3px solid var(--primary);">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
          <span class="badge badge-blue" style="font-size:11px;">${esc(l.action)}</span>
          <span style="font-size:11px;color:var(--text-secondary);">${esc(l.time)}</span>
        </div>
        <div style="font-size:13px;">${esc(l.detail)}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:3px;">操作人：${esc(l.user)}</div>
      </div>`).join('') : '<p style="color:var(--text-muted);text-align:center;padding:20px;">暂无操作日志</p>';
    showModal(`操作日志 - ${doc ? esc(doc.docNo) : docId}`, `
      <div style="max-height:400px;overflow-y:auto;">${logsHtml}</div>
    `, [{ text:'关闭', cls:'btn-secondary', action:closeModal }]);
  },

  // ===== 2. 验收+移交一体化编辑表单 =====
  newDoc() {
    const maxId = installDocsData.reduce((m, d) => { const n = parseInt(d.id.replace('INST','')); return n > m ? n : m; }, 0);
    const newId = 'INST' + String(maxId + 1).padStart(3, '0');
    const newDocNo = 'YS-' + new Date().getFullYear() + '-' + String(maxId + 1).padStart(5, '0');
    this.formId = newId;
    this.formData = {
      id: newId, docNo: newDocNo, docType: 'new_equipment', docTypeName: '新设备验收',
      status: 'draft', statusName: '草稿',
      eqCode:'', eqName:'', model:'', serialNo:'', factoryNo:'',
      factoryDate:'', arriveDate:new Date().toISOString().slice(0,10), planCompleteDate:'',
      handler:'当前用户', handlerDept:'设备管理部',
      purchaseReqNo:'', purchaseOrderNo:'', supplier:'', contractNo:'', arriveQty:1,
      packageCheck:'', packageCheckNote:'', appearanceCheck:'', appearanceCheckNote:'',
      partsCheck:'', partsCheckNote:'', techParamRated:'', techParamActual:'', techParamConclusion:'',
      acceptConclusion:'', acceptor:'', acceptDate:'', acceptOpinion:'',
      installLocation:'', installLocationName:'', workCenter:'', workCenterName:'',
      installProvider:'', installTeam:'',
      debugContent:'', debugResult:'', trialDuration:'', trialStatus:'',
      installCompleteDate:'', debugPerson:'',
      recvDept:'', recvPerson:'', recvPhone:'', assetOwner:'', assetNo:'',
      handoverNote:'', handoverOpinion:'',
      remarks:'', attachments:[],
      createdBy:'当前用户', createdAt:new Date().toLocaleString('zh-CN'), updatedAt:new Date().toLocaleString('zh-CN')
    };
    this.mode = 'form';
    App.navigateTo('equipment', 'lc-install', 'lc-install', '设备安装/移交 - 新增单据');
  },
  editDoc(docId) {
    const doc = installDocsData.find(d => d.id === docId);
    if (!doc) return;
    this.formId = docId;
    this.formData = JSON.parse(JSON.stringify(doc));
    this.mode = 'form';
    App.navigateTo('equipment', 'lc-install', 'lc-install', '设备安装/移交 - 编辑单据');
  },
  viewDoc(docId) {
    const doc = installDocsData.find(d => d.id === docId);
    if (!doc) return;
    this.formId = docId;
    this.formData = JSON.parse(JSON.stringify(doc));
    this.mode = 'detail';
    App.navigateTo('equipment', 'lc-install', 'lc-install', '设备安装/移交 - 查看单据');
  },
  backToList() {
    this.mode = 'list';
    this.filtered = [...installDocsData];
    this.page = 1;
    App.navigateTo('equipment', 'lc-install', 'lc-install', '设备安装/移交');
  },

  renderForm() {
    const d = this.formData;
    const isView = this.mode === 'detail';
    const isDraft = d.status === 'draft';
    const isAcceptRejected = d.status === 'accept_rejected';

    // state badge helper
    const stateBdg = (() => {
      const s = installDocStatusOptions.find(o => o.value === d.status);
      return s ? `<span class="badge ${s.cls}" style="font-size:13px;">${s.label}</span>` : `<span class="badge badge-gray" style="font-size:13px;">${d.statusName||d.status}</span>`;
    })();

    // Readonly vs editable input helper
    const inp = (value, attrs, key, style) => {
      if (isView) return esc(value || '-');
      return `<input value="${esc(value||'')}" onchange="EquipmentInstall.setField('${key}',this.value)" ${attrs||''} style="${style||'width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:4px;font-size:13px;outline:none;'}" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">`;
    };
    const sel = (value, options, key) => {
      if (isView) {
        const o = options.find(opt => opt.value === value);
        return esc((o ? o.label : value) || '-');
      }
      return `<select onchange="EquipmentInstall.setField('${key}',this.value)" style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:4px;font-size:13px;outline:none;">${options.map(o => `<option value="${o.value}" ${value===o.value?'selected':''}>${o.label}</option>`).join('')}</select>`;
    };
    const tex = (value, key, rows) => {
      if (isView) return `<div style="white-space:pre-wrap;font-size:13px;">${esc(value||'-')}</div>`;
      return `<textarea onchange="EquipmentInstall.setField('${key}',this.value)" rows="${rows||3}" style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:4px;font-size:13px;outline:none;resize:vertical;" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">${esc(value||'')}</textarea>`;
    };

    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <\x2d\x2d Top bar -->
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:12px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div style="display:flex;align-items:center;gap:12px;">
            <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;border:none;" onclick="EquipmentInstall.backToList()">&#8592; 返回</button>
            <div><div style="font-size:16px;font-weight:700;">${isView ? '查看单据' : (this.formId && installDocsData.find(x => x.id === this.formId) ? '编辑单据' : '新增单据')}</div><div style="font-size:12px;opacity:0.8;">单据编号：${esc(d.docNo)}  ${stateBdg}</div></div>
          </div>
          <div style="display:flex;gap:6px;">
            ${isView ? `<button class="btn btn-warning btn-sm" onclick="EquipmentInstall.editDoc('${d.id}')">✏️ 编辑</button>` : ''}
            <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;border:none;" onclick="EquipmentInstall.showLog('${d.id}')">📋 日志</button>
          </div>
        </div>

        <\x2d\x2d Scrollable form body -->
        <div style="flex:1;overflow-y:auto;padding:20px;background:var(--bg);">
          <div style="max-width:1100px;margin:0 auto;">

            <\x2d\x2d 1. 头部基础信息区 -->
            <div style="background:white;border-radius:8px;padding:20px;margin-bottom:16px;box-shadow:var(--shadow);">
              <div class="form-section-title">📋 基础信息</div>
              <div class="form-grid">
                <div class="form-group"><label>单据编号</label><div style="padding:9px 12px;background:#f9fafb;border:1px solid var(--border);border-radius:4px;font-size:13px;color:var(--text-secondary);">${esc(d.docNo)}</div></div>
                <div class="form-group"><label>单据类型 <span class="req">*</span></label>${sel(d.docType, installDocTypeOptions, 'docType')}</div>
                <div class="form-group"><label>关联采购申请</label>${inp(d.purchaseReqNo, 'placeholder="点击选择..."', 'purchaseReqNo')}</div>
                <div class="form-group"><label>关联采购订单</label>${inp(d.purchaseOrderNo, 'placeholder="点击选择..."', 'purchaseOrderNo')}</div>
                <div class="form-group"><label>供货厂商</label>${inp(d.supplier, '', 'supplier')}</div>
                <div class="form-group"><label>合同号</label>${inp(d.contractNo, '', 'contractNo')}</div>
                <div class="form-group"><label>到货数量</label>${inp(d.arriveQty, 'type="number" min="0"', 'arriveQty')}</div>
                <div class="form-group"><label>设备编码</label>${inp(d.eqCode, 'placeholder="手动录入或弹窗选择"', 'eqCode')}</div>
                <div class="form-group"><label>设备名称 <span class="req">*</span></label>${inp(d.eqName, 'placeholder="必填"', 'eqName')}</div>
                <div class="form-group"><label>规格型号 <span class="req">*</span></label>${inp(d.model, 'placeholder="必填（GMP追溯）"', 'model')}</div>
                <div class="form-group"><label>序列号 <span class="req">*</span></label>${inp(d.serialNo, 'placeholder="必填（GMP追溯）"', 'serialNo')}</div>
                <div class="form-group"><label>出厂编号</label>${inp(d.factoryNo, '', 'factoryNo')}</div>
                <div class="form-group"><label>出厂日期</label>${inp(d.factoryDate, 'type="date"', 'factoryDate', 'width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:4px;font-size:13px;')}</div>
                <div class="form-group"><label>到货日期 <span class="req">*</span></label>${inp(d.arriveDate, 'type="date"', 'arriveDate', 'width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:4px;font-size:13px;')}</div>
                <div class="form-group"><label>预计安装完成</label>${inp(d.planCompleteDate, 'type="date"', 'planCompleteDate', 'width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:4px;font-size:13px;')}</div>
                <div class="form-group"><label>经办人 <span class="req">*</span></label>${inp(d.handler, '', 'handler')}</div>
                <div class="form-group"><label>所属部门 <span class="req">*</span></label>${inp(d.handlerDept, '', 'handlerDept')}</div>
              </div>
            </div>

            <\x2d\x2d 2. 开箱 & 质量验收区 -->
            <div style="background:white;border-radius:8px;padding:20px;margin-bottom:16px;box-shadow:var(--shadow);">
              <div class="form-section-title" style="border-bottom-color:#ef4444;">🔍 开箱 & 质量验收（GMP重点）</div>
              <div class="form-grid">
                <div class="form-group"><label>外包装检查 <span class="req">*</span></label>${sel(d.packageCheck, installPackageCheckOptions, 'packageCheck')}</div>
                <div class="form-group full"><label>包装问题描述</label>${inp(d.packageCheckNote, 'placeholder="如外包装破损、受潮等"', 'packageCheckNote')}</div>
                <div class="form-group"><label>外观/配件核对</label>${inp(d.appearanceCheck, 'placeholder="合格/不合格"', 'appearanceCheck')}</div>
                <div class="form-group full"><label>外观/配件备注</label>${inp(d.appearanceCheckNote, 'placeholder="对照BOM清点零部件、随机工具、资料"', 'appearanceCheckNote')}</div>
                <div class="form-group"><label>BOM配件核对</label>${inp(d.partsCheck, 'placeholder="齐全/缺失"', 'partsCheck')}</div>
                <div class="form-group full"><label>配件核对备注</label>${inp(d.partsCheckNote, 'placeholder="逐件清点结果说明"', 'partsCheckNote')}</div>
                <div class="form-group"><label>额定技术参数</label>${inp(d.techParamRated, 'placeholder="如功率、转速等"', 'techParamRated')}</div>
                <div class="form-group"><label>实测技术参数</label>${inp(d.techParamActual, 'placeholder="实际测量值"', 'techParamActual')}</div>
                <div class="form-group full"><label>技术参数判定</label>${inp(d.techParamConclusion, 'placeholder="是否符合技术协议"', 'techParamConclusion')}</div>
                <div class="form-group"><label>验收结论 <span class="req">*</span></label>${sel(d.acceptConclusion, installAcceptConclusionOptions, 'acceptConclusion')}</div>
                <div class="form-group"><label>验收人 <span class="req">*</span></label>${inp(d.acceptor, '', 'acceptor')}</div>
                <div class="form-group"><label>验收日期</label>${inp(d.acceptDate, 'type="date"', 'acceptDate', 'width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:4px;font-size:13px;')}</div>
                <div class="form-group full"><label>验收意见</label>${tex(d.acceptOpinion, 'acceptOpinion', 2)}</div>
              </div>
            </div>

            <\x2d\x2d 3. 安装调试区 -->
            <div style="background:white;border-radius:8px;padding:20px;margin-bottom:16px;box-shadow:var(--shadow);">
              <div class="form-section-title" style="border-bottom-color:#3B82F6;">🔧 安装调试信息</div>
              <div class="form-grid">
                <div class="form-group"><label>安装位置</label>${inp(d.installLocationName||d.installLocation, 'placeholder="弹窗选择功能位置"', 'installLocationName')}</div>
                <div class="form-group"><label>归属工作中心</label>${inp(d.workCenterName||d.workCenter, 'placeholder="下拉选择工作中心"', 'workCenterName')}</div>
                <div class="form-group"><label>安装服务商</label>${inp(d.installProvider, 'placeholder="外部服务商"', 'installProvider')}</div>
                <div class="form-group"><label>内部班组</label>${inp(d.installTeam, 'placeholder="内部执行班组"', 'installTeam')}</div>
                <div class="form-group full"><label>调试内容</label>${tex(d.debugContent, 'debugContent', 4)}</div>
                <div class="form-group"><label>调试结果</label>${inp(d.debugResult, 'placeholder="合格/不合格"', 'debugResult')}</div>
                <div class="form-group"><label>试运行时长</label>${inp(d.trialDuration, 'placeholder="如 48小时"', 'trialDuration')}</div>
                <div class="form-group"><label>试运行状态</label>${inp(d.trialStatus, 'placeholder="正常/异常"', 'trialStatus')}</div>
                <div class="form-group"><label>安装完成时间</label>${inp(d.installCompleteDate, 'type="date"', 'installCompleteDate', 'width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:4px;font-size:13px;')}</div>
                <div class="form-group"><label>调试负责人</label>${inp(d.debugPerson, '', 'debugPerson')}</div>
              </div>
            </div>

            <\x2d\x2d 4. 资产移交区 -->
            <div style="background:white;border-radius:8px;padding:20px;margin-bottom:16px;box-shadow:var(--shadow);">
              <div class="form-section-title" style="border-bottom-color:#10B981;">📦 资产移交信息</div>
              <div class="form-grid">
                <div class="form-group"><label>接收车间</label>${inp(d.recvDept, '', 'recvDept')}</div>
                <div class="form-group"><label>接收负责人</label>${inp(d.recvPerson, '', 'recvPerson')}</div>
                <div class="form-group"><label>联系电话</label>${inp(d.recvPhone, '', 'recvPhone')}</div>
                <div class="form-group"><label>资产归属</label>${inp(d.assetOwner, '', 'assetOwner')}</div>
                <div class="form-group"><label>资产编号（SAP）</label>${inp(d.assetNo, 'placeholder="同步SAP资产卡片"', 'assetNo')}</div>
                <div class="form-group full"><label>移交说明</label>${tex(d.handoverNote, 'handoverNote', 2)}</div>
                <div class="form-group full"><label>交接意见</label>${tex(d.handoverOpinion, 'handoverOpinion', 2)}</div>
              </div>
            </div>

            <\x2d\x2d 5. 附件 & 备注区 -->
            <div style="background:white;border-radius:8px;padding:20px;margin-bottom:16px;box-shadow:var(--shadow);">
              <div class="form-section-title" style="border-bottom-color:#8b5cf6;">📎 附件 & 备注</div>
              <div style="margin-bottom:16px;">
                <div style="font-size:13px;font-weight:600;margin-bottom:8px;color:var(--text);">附件上传（GMP强制归档）</div>
                ${isView ? 
                  `<div style="font-size:13px;color:var(--text-muted);padding:12px;border:1px dashed var(--border);border-radius:6px;text-align:center;">暂无附件</div>`
                  : `<div style="border:2px dashed var(--border);border-radius:8px;padding:24px;text-align:center;color:var(--text-muted);cursor:pointer;" onclick="toast('附件上传功能开发中')">
                    <div style="font-size:32px;margin-bottom:8px;">📤</div>
                    <div style="font-size:13px;">点击或拖拽上传</div>
                    <div style="font-size:11px;margin-top:4px;">支持：送货单、合格证、说明书、图纸、验收报告、检测证书</div>
                  </div>`
                }
              </div>
              <div class="form-group full"><label>整体备注</label>${tex(d.remarks, 'remarks', 3)}</div>
            </div>

          </div>
        </div>

        <\x2d\x2d 底部操作按钮 -->
        <div style="background:white;border-top:1px solid var(--border);padding:14px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;gap:8px;flex-wrap:wrap;">
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary" onclick="EquipmentInstall.backToList()">返回列表</button>
            ${isView ? '' : `<button class="btn btn-outline" onclick="EquipmentInstall.saveDraft()">保存草稿</button>`}
          </div>
          <div style="display:flex;gap:8px;">
            ${isView ? '' : `
              ${(d.status === 'draft' || d.status === 'accept_rejected' || d.status === 'pending_rectify') ? `<button class="btn btn-primary" onclick="EquipmentInstall.submitAccept()">📋 提交验收</button>` : ''}
              ${d.status === 'pending_accept' ? `<button class="btn btn-primary" onclick="EquipmentInstall.submitHandover()">📦 提交移交</button>` : ''}
              ${d.status === 'pending_handover' ? `<button class="btn btn-success" onclick="EquipmentInstall.completeHandover()">✅ 确认移交完成</button>` : ''}
              ${(d.status === 'pending_accept' || d.status === 'pending_handover') ? `<button class="btn btn-warning" onclick="EquipmentInstall.withdrawDoc('${d.id}')">↩ 撤回</button>` : ''}
              ${(d.status === 'draft' || d.status === 'accept_rejected') ? `<button class="btn btn-outline" style="color:var(--danger);" onclick="EquipmentInstall.cancelDoc('${d.id}')">作废</button>` : ''}
            `}
          </div>
        </div>
      </div>`;
  },

  renderFormInit() {
    // No additional init needed for form since DOM uses inline event handlers
  },

  setField(field, value) {
    if (!this.formData) return;
    if (field === 'docType') {
      const t = installDocTypeOptions.find(o => o.value === value);
      this.formData.docType = value;
      this.formData.docTypeName = t ? t.label : value;
    } else {
      this.formData[field] = value;
    }
  },

  // ===== 单据操作 =====
  saveDraft() {
    if (!this.formData || !this.formData.eqName.trim()) { toast('请填写设备名称'); return; }
    if (!this.formData.model.trim()) { toast('请填写规格型号（GMP追溯）'); return; }
    if (!this.formData.serialNo.trim()) { toast('请填写序列号（GMP追溯）'); return; }

    const existing = installDocsData.find(d => d.id === this.formId);
    this.formData.updatedAt = new Date().toLocaleString('zh-CN');
    if (existing) {
      Object.assign(existing, this.formData);
      if (!installDocLogs[this.formId]) installDocLogs[this.formId] = [];
      installDocLogs[this.formId].push({ time: this.formData.updatedAt, action:'编辑', user:'当前用户', detail:'保存草稿，更新单据信息' });
    } else {
      installDocsData.push({ ...this.formData });
      installDocLogs[this.formId] = [{ time: this.formData.updatedAt, action:'创建', user:'当前用户', detail:'创建验收单草稿' }];
    }
    toast('草稿已保存！');
  },

  submitAccept() {
    if (!this.formData) return;
    if (!this.formData.eqName.trim()) { toast('请填写设备名称'); return; }
    if (!this.formData.model.trim() || !this.formData.serialNo.trim()) { toast('请完善设备信息（规格型号、序列号）'); return; }
    if (!this.formData.arriveDate) { toast('请填写到货日期'); return; }
    if (!this.formData.handler.trim() || !this.formData.handlerDept.trim()) { toast('请填写经办人与所属部门'); return; }

    const existing = installDocsData.find(d => d.id === this.formId);
    this.formData.status = 'pending_accept';
    this.formData.statusName = '待验收';
    this.formData.updatedAt = new Date().toLocaleString('zh-CN');
    if (existing) {
      Object.assign(existing, this.formData);
    }
    if (!installDocLogs[this.formId]) installDocLogs[this.formId] = [];
    installDocLogs[this.formId].push({ time: this.formData.updatedAt, action:'提交', user:'当前用户', detail:'提交验收申请' });
    toast('已提交验收，等待验收人审核！');
    this.backToList();
  },

  submitHandover() {
    if (!this.formData) return;
    if (this.formData.acceptConclusion !== '验收合格') { toast('验收结论为"验收合格"时才能提交移交'); return; }
    if (!this.formData.acceptor.trim() || !this.formData.acceptDate) { toast('请完善验收人及验收日期'); return; }
    if (!this.formData.installLocationName && !this.formData.installLocation) { toast('请选择安装位置'); return; }

    const existing = installDocsData.find(d => d.id === this.formId);
    this.formData.status = 'pending_handover';
    this.formData.statusName = '待移交';
    this.formData.updatedAt = new Date().toLocaleString('zh-CN');
    if (existing) Object.assign(existing, this.formData);
    if (!installDocLogs[this.formId]) installDocLogs[this.formId] = [];
    installDocLogs[this.formId].push({ time: this.formData.updatedAt, action:'提交', user:'当前用户', detail:'提交移交申请' });
    toast('已提交移交申请！');
    this.backToList();
  },

  completeHandover() {
    if (!this.formData) return;
    if (!this.formData.recvPerson.trim()) { toast('请填写接收负责人'); return; }
    if (!this.formData.assetNo.trim()) { toast('请填写资产编号（SAP）'); return; }

    const existing = installDocsData.find(d => d.id === this.formId);
    this.formData.status = 'completed';
    this.formData.statusName = '已完成';
    this.formData.updatedAt = new Date().toLocaleString('zh-CN');
    if (existing) Object.assign(existing, this.formData);
    if (!installDocLogs[this.formId]) installDocLogs[this.formId] = [];
    installDocLogs[this.formId].push({ time: this.formData.updatedAt, action:'移交', user:'当前用户', detail:'确认接收，设备正式投用' });

    // 联动：验收完成后激活对应设备主数据
    if (this.formData.eqCode && this.formData.eqName) {
      const eq = equipmentData.find(e => e.code === this.formData.eqCode);
      if (eq) {
        eq.status = 'running';
        eq.statusName = '运行中';
        eq.location = this.formData.installLocation || eq.location;
        eq.locationName = this.formData.installLocationName || eq.locationName;
        eq.syncStatus = 'synced';
      }
    }
    toast('移交完成，设备已正式投用！设备主数据已同步激活。');
    this.backToList();
  },

  withdrawDoc(docId) {
    if (!confirm('确认撤回该单据？')) return;
    const doc = installDocsData.find(d => d.id === docId);
    if (!doc) return;
    doc.status = 'draft';
    doc.statusName = '草稿';
    doc.updatedAt = new Date().toLocaleString('zh-CN');
    if (!installDocLogs[docId]) installDocLogs[docId] = [];
    installDocLogs[docId].push({ time: doc.updatedAt, action:'撤回', user:'当前用户', detail:'撤回单据至草稿状态' });
    if (this.mode === 'form' || this.mode === 'detail') this.backToList();
    else { this.reset(); }
    toast('单据已撤回至草稿！');
  },

  cancelDoc(docId) {
    if (!confirm('确认作废该单据？此操作不可撤销。')) return;
    const doc = installDocsData.find(d => d.id === docId);
    if (!doc) return;
    doc.status = 'cancelled';
    doc.statusName = '已作废';
    doc.updatedAt = new Date().toLocaleString('zh-CN');
    if (!installDocLogs[docId]) installDocLogs[docId] = [];
    installDocLogs[docId].push({ time: doc.updatedAt, action:'作废', user:'当前用户', detail:'单据作废' });
    if (this.mode === 'form' || this.mode === 'detail') this.backToList();
    else { this.reset(); }
    toast('单据已作废！');
  }
};
