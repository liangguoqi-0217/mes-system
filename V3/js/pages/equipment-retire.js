// ===== 4.4 设备退役/报废 =====
const EquipmentRetire = {
  mode:'list', page:1, pageSize:10, filtered:[], formId:null, formData:null, formSection:'sec1',

  // ===== 主渲染入口 =====
  render() {
    if (this.mode==='form'||this.mode==='detail') return this.renderForm();
    return this.renderList();
  },
  init() {
    if (this.mode==='form'||this.mode==='detail') { this.renderFormInit(); return; }
    this.filtered=[...eqRetireData]; this.page=1; this.renderTable();
  },

  // ===== 1. 列表页 =====
  renderList() {
    return `<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="padding:10px 20px;background:linear-gradient(135deg,#DC2626,#991B1B);color:white;flex-shrink:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div><div style="font-size:15px;font-weight:700;">设备退役 / 报废管理</div><div style="font-size:12px;opacity:0.7;">退役评估 · 报废审批 · 拆机处置 · 资产销账 · 档案封存</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="EquipmentRetire.exportAll()">批量导出</button>
            <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;" onclick="EquipmentRetire.newDoc()">+ 新增报废单据</button>
          </div>
        </div>
      </div>
      <div class="filter-bar" style="flex-shrink:0;">
        <div class="filter-group"><label>单据编号</label><input type="text" id="rtDocNo" placeholder="模糊查询"></div>
        <div class="filter-group"><label>设备信息</label><input type="text" id="rtEqInfo" placeholder="编码/名称"></div>
        <div class="filter-group"><label>报废类型</label><select id="rtRetireType">${eqRetireTypeOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>单据状态</label><select id="rtStatus">${eqRetireStatusOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>申请人</label><input type="text" id="rtApplicant" placeholder="模糊查询"></div>
        <div class="filter-actions"><button class="btn btn-primary btn-sm" onclick="EquipmentRetire.search()">查询</button><button class="btn btn-outline btn-sm" onclick="EquipmentRetire.reset()">重置</button></div>
      </div>
      <div class="table-wrapper" style="flex:1;"><table class="data-table"><thead><tr>
        <th>单据编号</th><th>设备信息</th><th>报废类型</th><th>资产编号</th><th>申请日期</th><th>状态</th><th>申请人</th><th>操作</th>
      </tr></thead><tbody id="rtTableBody"></tbody></table></div>
      <div class="list-toolbar" style="flex-shrink:0;">
        <div class="list-info"><span class="list-count" id="rtCount">共 ${this.filtered.length} 条</span></div>
        <div class="pagination">
          <button class="pagination-btn" id="rtPrev" disabled onclick="EquipmentRetire.prevPage()">‹</button>
          <span class="pagination-info" id="rtPageInfo">第 1 / ${Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)} 页</span>
          <button class="pagination-btn" id="rtNext" onclick="EquipmentRetire.nextPage()">›</button>
          <select class="page-size-select" id="rtPageSizeSel" onchange="EquipmentRetire.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
        </div>
      </div>
    </div>`;
  },
  renderTable() {
    const start=(this.page-1)*this.pageSize;
    const page=this.filtered.slice(start,start+this.pageSize);
    const totalPages=Math.ceil(this.filtered.length/this.pageSize)||1;
    document.getElementById('rtCount').textContent=`共 ${this.filtered.length} 条`;
    document.getElementById('rtPageInfo').textContent=`第 ${this.page} / ${totalPages} 页`;
    document.getElementById('rtPrev').disabled=this.page<=1;
    document.getElementById('rtNext').disabled=this.page>=totalPages;
    document.getElementById('rtPageSizeSel').value=this.pageSize;
    document.getElementById('rtTableBody').innerHTML=page.map(d=>{
      const s=eqRetireStatusOptions.find(o=>o.value===d.disposalStatus);
      const t=eqRetireTypeOptions.find(o=>o.value===d.retireType);
      return `<tr>
        <td><strong style="color:#DC2626;">${esc(d.docNo)}</strong></td>
        <td>${esc(d.equipmentCode)} / ${esc(d.equipmentName)}</td>
        <td>${t?t.label:d.retireTypeName}</td>
        <td><span style="font-family:monospace;font-size:12px;">${esc(d.assetNo||'-')}</span></td>
        <td>${esc(d.createdAt||'-')}</td>
        <td><span class="badge ${s?s.cls:'badge-gray'}">${s?s.label:d.disposalStatusName}</span></td>
        <td>${esc(d.applicant||'-')}</td>
        <td class="table-actions">
          <button class="btn btn-sm btn-outline" onclick="EquipmentRetire.viewDetail('${d.id}')">查看</button>
          ${d.disposalStatus==='draft'?`<button class="btn btn-sm btn-primary" onclick="EquipmentRetire.editDoc('${d.id}')">编辑</button>`:''}
          ${d.disposalStatus==='draft'?`<button class="btn btn-sm btn-yellow" onclick="EquipmentRetire.submitEval('${d.id}')">提交评估</button>`:''}
          ${d.disposalStatus==='pending_eval'?`<button class="btn btn-sm btn-blue" onclick="EquipmentRetire.submitEvalFromList('${d.id}')">进入审批</button>`:''}
          ${d.disposalStatus==='pending_approval'?`<button class="btn btn-sm btn-purple" onclick="EquipmentRetire.startDisposal('${d.id}')">开始拆机</button>`:''}
          ${d.disposalStatus==='pending_disposal'?`<button class="btn btn-sm btn-green" onclick="EquipmentRetire.completeDisposal('${d.id}')">完成处置</button>`:''}
          ${['draft','pending_eval','pending_approval'].includes(d.disposalStatus)?`<button class="btn btn-sm btn-danger-outline" onclick="EquipmentRetire.withdrawDoc('${d.id}')">撤销</button>`:''}
        </td>
      </tr>`;
    }).join('');
  },
  search() {
    const docNo=(document.getElementById('rtDocNo')?.value||'').toLowerCase();
    const eqInfo=(document.getElementById('rtEqInfo')?.value||'').toLowerCase();
    const type=document.getElementById('rtRetireType')?.value||'';
    const status=document.getElementById('rtStatus')?.value||'';
    const applicant=(document.getElementById('rtApplicant')?.value||'').toLowerCase();
    this.filtered=eqRetireData.filter(d=>
      (!docNo||d.docNo.toLowerCase().includes(docNo)) &&
      (!eqInfo||(d.equipmentCode+' '+d.equipmentName).toLowerCase().includes(eqInfo)) &&
      (!type||d.retireType===type) &&
      (!status||d.disposalStatus===status) &&
      (!applicant||d.applicant.toLowerCase().includes(applicant))
    );
    this.page=1; this.renderTable();
  },
  reset() { ['rtDocNo','rtEqInfo','rtRetireType','rtStatus','rtApplicant'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; }); this.filtered=[...eqRetireData]; this.page=1; this.renderTable(); },
  prevPage(){ if(this.page>1){this.page--;this.renderTable();} },
  nextPage(){ if(this.page<Math.ceil(this.filtered.length/this.pageSize)){this.page++;this.renderTable();} },
  changePageSize(){ this.pageSize=parseInt(document.getElementById('rtPageSizeSel').value); this.page=1; this.renderTable(); },
  exportAll(){ alert('批量导出功能已触发（模拟）'); },
  newDoc(){ this.formId=null; this.formData=null; this.formSection='sec1'; this.mode='form'; this.render(); this.renderFormInit(); },
  viewDetail(id){ const d=eqRetireData.find(x=>x.id===id); if(!d)return; this.formId=id; this.formData={...d}; this.formSection='sec1'; this.mode='detail'; this.render(); this.renderFormInit(); },
  editDoc(id){ const d=eqRetireData.find(x=>x.id===id); if(!d||d.disposalStatus!=='draft')return; this.formId=id; this.formData={...d}; this.formSection='sec1'; this.mode='form'; this.render(); this.renderFormInit(); },

  submitEval(id) {
    const d=eqRetireData.find(x=>x.id===id); if(!d)return;
    if(confirm('确认提交评估吗？')){ d.disposalStatus='pending_eval'; d.disposalStatusName='待评估'; d.log.push({time:new Date().toISOString().replace('T',' ').substring(0,19),action:'提交评估',user:d.applicant,detail:'提交专业评估申请'}); alert('已提交评估！'); this.init(); }
  },
  submitEvalFromList(id) {
    const d=eqRetireData.find(x=>x.id===id); if(!d||d.disposalStatus!=='pending_eval')return;
    if(confirm('确认评估通过，进入审批流程？')){ d.disposalStatus='pending_approval'; d.disposalStatusName='待审批'; d.log.push({time:new Date().toISOString().replace('T',' ').substring(0,19),action:'评估通过',user:'评估组',detail:'专业评估通过，进入审批流程'}); alert('已进入审批流程！'); this.init(); }
  },
  startDisposal(id) {
    const d=eqRetireData.find(x=>x.id===id); if(!d||d.disposalStatus!=='pending_approval')return;
    if(confirm('确认开始拆机处置？')){ d.disposalStatus='pending_disposal'; d.disposalStatusName='待拆机处置'; d.disassemblyStart=new Date().toISOString().replace('T',' ').substring(0,10); d.log.push({time:new Date().toISOString().replace('T',' ').substring(0,19),action:'开始拆机',user:'处置班组',detail:'拆机处置正式开始'}); alert('已开始拆机处置！'); this.init(); }
  },
  completeDisposal(id) {
    const d=eqRetireData.find(x=>x.id===id); if(!d||d.disposalStatus!=='pending_disposal')return;
    if(confirm('确认完成处置？完成处置后设备将永久报废封存，不可恢复。')){ d.disposalStatus='completed'; d.disposalStatusName='已报废封存'; d.disassemblyEnd=new Date().toISOString().replace('T',' ').substring(0,10); d.log.push({time:new Date().toISOString().replace('T',' ').substring(0,19),action:'处置完成',user:'处置班组',detail:'拆机处置完成，设备已报废封存'}); alert('处置完成！设备已报废封存，档案永久归档。'); this.init(); }
  },
  withdrawDoc(id) {
    const d=eqRetireData.find(x=>x.id===id); if(!d)return;
    if(confirm('确定撤销该报废单据吗？')){ d.disposalStatus='cancelled'; d.disposalStatusName='已撤销'; d.log.push({time:new Date().toISOString().replace('T',' ').substring(0,19),action:'撤销',user:d.applicant,detail:'撤销报废单据'}); alert('已撤销'); this.init(); }
  },

  // ===== 2. 单据编辑页 =====
  renderForm() {
    const d=this.formData||{};
    const isDetail=this.mode==='detail';
    return `<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="padding:10px 20px;background:linear-gradient(135deg,#DC2626,#991B1B);color:white;flex-shrink:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:16px;">
            <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="EquipmentRetire.backToList()">← 返回列表</button>
            <div><div style="font-size:15px;font-weight:700;">${isDetail?'报废单据详情':'报废/退役单据'}</div><div style="font-size:12px;opacity:0.7;">${esc(d.docNo||'新单据')} | ${esc(d.equipmentName||'-')}</div></div>
          </div>
          <div><span class="badge badge-sm" style="background:rgba(255,255,255,0.2);">${isDetail?'只读':'编辑模式'}</span></div>
        </div>
      </div>
      <div style="flex-shrink:0;display:flex;border-bottom:2px solid var(--border);background:white;overflow-x:auto;">
        ${[{id:'sec1',label:'① 基础信息'},{id:'sec2',label:'② 评估信息'},{id:'sec3',label:'③ 拆机 & 物资处置'},{id:'sec4',label:'④ 审批 & 财务'},{id:'sec5',label:'⑤ 附件 & 备注'}].map(s=>`
          <div class="form-tab ${this.formSection===s.id?'active':''}" onclick="EquipmentRetire.switchSection('${s.id}')" style="white-space:nowrap;">${s.label}</div>
        `).join('')}
      </div>
      <div style="flex:1;overflow-y:auto;"><div class="form-container" id="rtSectionContent"></div></div>
      <div class="form-bottom-bar" style="flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:white;border-top:1px solid var(--border);">
        <div style="display:flex;gap:8px;">
          ${!isDetail?`<button class="btn btn-outline btn-sm" onclick="EquipmentRetire.saveDraft()">保存草稿</button>`:''}
          ${!isDetail?`<button class="btn btn-yellow btn-sm" onclick="EquipmentRetire.submitEvalFromForm()">提交评估</button>`:''}
          ${!isDetail?`<button class="btn btn-blue btn-sm" onclick="EquipmentRetire.submitApprovalFromForm()">提交审批</button>`:''}
          ${!isDetail?`<button class="btn btn-danger-outline btn-sm" onclick="EquipmentRetire.withdrawFromForm()">撤回</button>`:''}
          ${!isDetail?`<button class="btn btn-purple btn-sm" onclick="EquipmentRetire.completeDisposalFromForm()">完成拆机处置</button>`:''}
          <button class="btn btn-outline btn-sm" onclick="EquipmentRetire.print()">打印</button>
          <button class="btn btn-outline btn-sm" onclick="EquipmentRetire.exportDoc()">导出</button>
        </div>
        <div><button class="btn btn-sm" style="background:#DC2626;color:white;" onclick="EquipmentRetire.backToList()">完成 / 返回</button></div>
      </div>
    </div>`;
  },
  renderFormInit(){ const d=this.formData||{}; const isDetail=this.mode==='detail'; this.renderSectionContent(d,isDetail); },
  switchSection(secId){ this.formSection=secId; const d=this.formData||{}; const isDetail=this.mode==='detail'; this.renderSectionContent(d,isDetail); },
  backToList(){ this.mode='list'; this.formId=null; this.formData=null; this.render(); this.init(); },
  saveDraft(){ alert('草稿已保存（模拟）'); },
  submitEvalFromForm(){ if(this.formId)EquipmentRetire.submitEval(this.formId); else alert('请先保存草稿'); },
  submitApprovalFromForm(){ if(this.formId){ const d=eqRetireData.find(x=>x.id===this.formId); if(d&&d.disposalStatus==='pending_eval')EquipmentRetire.submitEvalFromList(this.formId); else alert('需先完成评估'); } },
  withdrawFromForm(){ if(this.formId)EquipmentRetire.withdrawDoc(this.formId); },
  completeDisposalFromForm(){ if(this.formId)EquipmentRetire.completeDisposal(this.formId); },
  print(){ window.print(); },
  exportDoc(){ alert('导出功能已触发（模拟）'); },

  renderSectionContent(d,isDetail){
    const disabled=isDetail?'disabled':'';
    const readonly=isDetail?'readonly':'';
    let html='';
    if(this.formSection==='sec1'){
      const ts=eqRetireTypeOptions.find(o=>o.value===d.retireType);
      html=`<div class="form-section"><div class="section-title">基础信息区</div>
        <div class="form-grid col-2">
          <div class="form-group"><label>单据编号</label><input type="text" value="${esc(d.docNo||'自动生成')}" readonly style="background:#f1f5f9;"></div>
          <div class="form-group"><label>设备编码</label><input type="text" value="${esc(d.equipmentCode||'')}" readonly style="background:#f1f5f9;"></div>
          <div class="form-group"><label>设备名称</label><input type="text" value="${esc(d.equipmentName||'')}" readonly style="background:#f1f5f9;"></div>
          <div class="form-group"><label>序列号</label><input type="text" value="${esc(d.serialNo||'')}" readonly style="background:#f1f5f9;"></div>
        </div>
        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:16px;margin:12px 0;">
          <div style="font-weight:600;color:#9a3412;margin-bottom:8px;">SAP 资产同步信息（自动读取，只读）</div>
          <div class="form-grid col-3">
            <div class="form-group"><label>资产编号（SAP）</label><input type="text" value="${esc(d.assetNo||'')}" readonly style="background:#fff7ed;"></div>
            <div class="form-group"><label>设备原值（元）</label><input type="text" value="${esc(d.originalValue||'')}" readonly style="background:#fff7ed;font-family:monospace;"></div>
            <div class="form-group"><label>累计折旧（元）</label><input type="text" value="${esc(d.accumulatedDepreciation||'')}" readonly style="background:#fff7ed;font-family:monospace;"></div>
            <div class="form-group"><label>已使用年限</label><input type="text" value="${esc(d.usedYears||'')+' 年'}" readonly style="background:#fff7ed;"></div>
            <div class="form-group"><label>账面净值（元）</label><input type="text" value="${esc(String(parseInt(d.originalValue||0)-parseInt(d.accumulatedDepreciation||0)))}" readonly style="background:#fff7ed;font-family:monospace;font-weight:600;"></div>
          </div>
        </div>
        <div class="form-grid col-2">
          <div class="form-group"><label>报废类型</label><select ${disabled}>${eqRetireTypeOptions.filter(o=>o.value).map(o=>`<option value="${o.value}" ${d.retireType===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>
          <div class="form-group"><label>申请日期</label><input type="text" value="${esc(d.createdAt||'')}" readonly style="background:#f1f5f9;"></div>
          <div class="form-group"><label>申请人</label><input type="text" value="${esc(d.applicant||'')}" ${readonly}></div>
          <div class="form-group"><label>所属车间/部门</label><input type="text" value="${esc(d.applicantDept||'')}" ${readonly}></div>
        </div>
      </div>`;
    } else if(this.formSection==='sec2'){
      html=`<div class="form-section"><div class="section-title">评估信息区</div>
        <div class="form-grid col-1">
          <div class="form-group"><label>报废原因详细描述</label><textarea ${disabled} rows="3">${esc(d.reason||'')}</textarea></div>
          <div class="form-group"><label>故障现状</label><textarea ${disabled} rows="3">${esc(d.faultDescribe||'')}</textarea></div>
          <div class="form-group"><label>评估结论</label><textarea ${disabled} rows="3">${esc(d.evaluationConclusion||'')}</textarea></div>
        </div>
        <div class="form-grid col-2">
          <div class="form-group"><label>评估人（设备/工艺/质量）</label><input type="text" value="${esc(d.evaluators||'')}" ${readonly}></div>
          <div class="form-group"><label>评估日期</label><input type="text" value="${esc(d.evaluationDate||'')}" ${readonly}></div>
          <div class="form-group"><label>评估意见</label><input type="text" value="${esc(d.evaluationOpinion||'')}" ${readonly}></div>
        </div>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin-top:12px;">
          <div style="font-weight:600;color:#1e40af;margin-bottom:8px;">风险评估</div>
          <textarea ${disabled} rows="3" style="background:white;">${esc(d.riskAssessment||'')}</textarea>
        </div>
      </div>`;
    } else if(this.formSection==='sec3'){
      const dm=eqRetireDisposalOptions.find(o=>o.value===d.disposalMethod);
      html=`<div class="form-section"><div class="section-title">拆机 & 物资处置区（联动设备 BOM）</div>
        <div class="form-grid col-2">
          <div class="form-group"><label>拆机方案</label><textarea ${disabled} rows="2">${esc(d.disassemblyPlan||'')}</textarea></div>
          <div class="form-group"><label>拆机起止时间</label><input type="text" value="${esc(d.disassemblyStart||'')+' ~ '+esc(d.disassemblyEnd||'')}" ${readonly}></div>
          <div class="form-group"><label>执行班组</label><input type="text" value="${esc(d.execTeam||'')}" ${readonly}></div>
          <div class="form-group"><label>处置方式</label><select ${disabled}>${eqRetireDisposalOptions.map(o=>`<option value="${o.value}" ${d.disposalMethod===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>
        </div>
        <div class="section-title" style="margin-top:16px;">零部件处置清单（基于设备 BOM）</div>
        <table class="data-table"><thead><tr><th>部件编码</th><th>部件名称</th><th>处置方式</th><th>备注</th></tr></thead><tbody>
          ${(d.partDisposalList||[]).length===0?'<tr><td colspan="4" style="text-align:center;color:var(--text-muted);">暂无零部件清单</td></tr>':(d.partDisposalList||[]).map(pd=>`<tr>
            <td><span style="font-family:monospace;">${esc(pd.partCode||'')}</span></td>
            <td>${esc(pd.partName||'')}</td>
            <td><span class="badge ${pd.disposal==='reuse'?'badge-green':pd.disposal==='scrap'?'badge-red':'badge-yellow'}">${pd.disposal==='reuse'?'可利旧 → 办理入库':pd.disposal==='scrap'?'直接报废':'危废/特殊处理'}</span></td>
            <td>${esc(pd.remark||'')}</td>
          </tr>`).join('')}
        </tbody></table>
      </div>`;
    } else if(this.formSection==='sec4'){
      html=`<div class="form-section"><div class="section-title">审批 & 财务区</div>
        <div class="section-title" style="font-size:14px;">多级审批记录</div>
        ${(d.approvalLevels||[]).length===0?'<div style="color:var(--text-muted);font-size:13px;padding:12px;">暂无审批记录</div>':(d.approvalLevels||[]).map(al=>`<div style="background:#f8fafc;border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span class="badge badge-blue">${esc(al.level||'')}</span>
            <span style="font-weight:600;">${esc(al.approver||'')}</span>
            <span style="font-size:12px;color:var(--text-muted);">${esc(al.time||'')}</span>
            ${al.financeConfirmed==='true'?`<span class="badge badge-green" style="margin-left:auto;">财务已确认</span>`:''}
          </div>
          <div style="font-size:13px;color:var(--text-secondary);">${esc(al.opinion||'')}</div>
        </div>`).join('')}
        ${d.approvalLevels&&d.approvalLevels.some(al=>al.financeConfirmed==='true')?`<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-top:12px;">
          <div style="font-weight:600;color:#166534;margin-bottom:8px;">SAP 资产报废确认</div>
          <div style="font-size:13px;color:#15803d;">资产销账已完成 | 残值金额：¥${esc(d.approvalLevels.find(al=>al.financeConfirmed==='true')?.residualValue||'-')} | 已同步 SAP 资产模块</div>
        </div>`:''}
      </div>`;
    } else if(this.formSection==='sec5'){
      html=`<div class="form-section"><div class="section-title">附件 & 备注区</div>
        <div class="section-title" style="font-size:14px;">附件列表</div>
        ${(d.attachmentList||[]).length===0?'<div style="color:var(--text-muted);font-size:13px;padding:12px;">暂无附件</div>':(d.attachmentList||[]).map(a=>`<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;margin:4px 0;background:#f8fafc;border-radius:6px;border:1px solid var(--border);"><span style="color:var(--primary);">📎</span><span style="font-size:13px;">${esc(a)}</span></div>`).join('')}
        ${!isDetail?`<div style="margin-top:8px;"><button class="btn btn-sm btn-outline">+ 上传附件</button></div>`:''}
        <div class="form-grid col-1" style="margin-top:12px;">
          <div class="form-group"><label>整体备注</label><textarea ${disabled} rows="3">${esc(d.overallRemark||'')}</textarea></div>
        </div>
        <div class="section-title" style="margin-top:20px;">操作日志</div>
        <table class="data-table"><thead><tr><th>时间</th><th>操作</th><th>操作人</th><th>说明</th></tr></thead><tbody>
          ${(d.log||[]).length===0?'<tr><td colspan="4" style="text-align:center;color:var(--text-muted);">暂无日志</td></tr>':(d.log||[]).map(l=>`<tr><td>${esc(l.time||'')}</td><td>${esc(l.action||'')}</td><td>${esc(l.user||'')}</td><td>${esc(l.detail||'')}</td></tr>`).join('')}
        </tbody></table>
      </div>`;
    }
    document.getElementById('rtSectionContent').innerHTML=html;
  }
};