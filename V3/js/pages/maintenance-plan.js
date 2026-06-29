// ===== 3.1 维护计划定义 =====
// 注：此功能已被 MaintPreventive.js 替代，前台使用后者，此文件整文件注释
/* 原代码已注释
const MaintPlan = {
  mode:'list', page:1, pageSize:10,
  filter:{code:'',name:'',maintenanceType:'',eqCategory:'',status:'',effectiveDate:''},
  formId:'', formMode:'create', formTab:'basic',

  render(){
    if(this.mode==='form') return this.renderForm();
    let data=[...pmPlanData];
    const f=this.filter;
    if(f.code) data=data.filter(d=>d.code.toLowerCase().includes(f.code.toLowerCase()));
    if(f.name) data=data.filter(d=>d.name.toLowerCase().includes(f.name.toLowerCase()));
    if(f.maintenanceType) data=data.filter(d=>d.maintenanceType===f.maintenanceType);
    if(f.eqCategory) data=data.filter(d=>d.eqCategory.includes(f.eqCategory));
    if(f.status) data=data.filter(d=>d.status===f.status);
    const total=data.length, totalPages=Math.ceil(total/this.pageSize);
    const start=(this.page-1)*this.pageSize, pageData=data.slice(start,start+this.pageSize);
    const typeOpts=pmMaintenanceTypes.map(o=>'<option value="'+o.value+'" '+(f.maintenanceType===o.value?'selected':'')+'>'+o.label+'</option>').join('');
    const statusOpts=pmPlanStatusOptions.map(o=>'<option value="'+o.value+'" '+(f.status===o.value?'selected':'')+'>'+o.label+'</option>').join('');
    return '<div class="page-container"><div class="page-header"><div class="page-title">维护计划定义</div><div class="page-actions"><button class="btn btn-secondary" onclick="MaintPlan.reset()">刷新</button><button class="btn btn-blue" onclick="MaintPlan.batchEnable()">批量启用</button><button class="btn btn-outline" onclick="MaintPlan.batchDisable()">批量停用</button><button class="btn btn-outline" onclick="MaintPlan.batchExport()">批量导出</button><button class="btn btn-blue" onclick="MaintPlan.create()">+ 新增维护计划</button></div></div>'+
    '<div class="filter-bar">'+
      '<div class="filter-group"><label>计划编码</label><input value="'+esc(f.code)+'" onchange="MaintPlan.filter.code=this.value;MaintPlan.search()" placeholder="计划编码"></div>'+
      '<div class="filter-group"><label>计划名称</label><input value="'+esc(f.name)+'" onchange="MaintPlan.filter.name=this.value;MaintPlan.search()" placeholder="计划名称"></div>'+
      '<div class="filter-group"><label>维保类型</label><select onchange="MaintPlan.filter.maintenanceType=this.value;MaintPlan.search()"><option value="" '+(f.maintenanceType?'':'selected')+'>全部类型</option>'+typeOpts+'</select></div>'+
      '<div class="filter-group"><label>设备分类</label><input value="'+esc(f.eqCategory)+'" onchange="MaintPlan.filter.eqCategory=this.value;MaintPlan.search()" placeholder="设备分类"></div>'+
      '<div class="filter-group"><label>状态</label><select onchange="MaintPlan.filter.status=this.value;MaintPlan.search()"><option value="" '+(f.status?'':'selected')+'>全部状态</option>'+statusOpts+'</select></div>'+
      '<div class="filter-actions"><button class="btn btn-primary btn-sm" onclick="MaintPlan.search()">查询</button><button class="btn btn-secondary btn-sm" onclick="MaintPlan.reset()">重置</button></div>'+
    '</div>'+
    '<div class="table-wrapper" style="margin-top:12px;"><table class="data-table"><thead><tr><th>计划编码</th><th>计划名称</th><th>维保类型</th><th>设备分类</th><th>工作中心</th><th>版本</th><th>状态</th><th>创建人</th><th>生效日期</th><th>操作</th></tr></thead>'+
    '<tbody>'+pageData.map(d=>{
      const s=pmPlanStatusOptions.find(o=>o.value===d.status);
      const typeColors={daily:'badge-blue',weekly:'badge-purple',monthly:'badge-green',quarterly:'badge-yellow','semi-annual':'badge-orange',annual:'badge-red',special:'badge-blue'};
      const mt=pmMaintenanceTypes.find(o=>o.value===d.maintenanceType);
      return '<tr>'+
        '<td><strong>'+esc(d.code)+'</strong></td>'+
        '<td>'+esc(d.name)+'</td>'+
        '<td><span class="badge badge-sm '+(typeColors[d.maintenanceType]||'badge-gray')+'">'+(mt?mt.label:d.maintenanceType)+'</span></td>'+
        '<td style="font-size:12px;">'+esc(d.eqCategory)+'<br><span style="color:var(--text-muted);">'+esc(d.eqGroup)+'</span></td>'+
        '<td style="font-size:12px;">'+esc(d.workCenterName)+'</td>'+
        '<td>'+esc(d.version)+'</td>'+
        '<td><span class="badge '+(s?s.cls:'badge-gray')+'">'+(s?s.label:d.status)+'</span></td>'+
        '<td>'+esc(d.creator)+'</td>'+
        '<td style="font-size:12px;">'+esc(d.effectiveDate)+'</td>'+
        '<td>'+this._rowActions(d)+'</td></tr>';
    }).join('')+'</tbody></table></div>'+
    '<div class="pagination-bar">'+this._renderPagination(total,totalPages)+'</div></div>';
  },

  _rowActions(d){
    let btns='<button class="btn btn-sm btn-outline" onclick="MaintPlan.view(\''+d.id+'\')">查看</button>';
    if(d.status==='draft') btns+=' <button class="btn btn-sm btn-outline" onclick="MaintPlan.edit(\''+d.id+'\')">编辑</button>';
    if(d.status==='draft') btns+=' <button class="btn btn-sm btn-blue" onclick="MaintPlan.submitReview(\''+d.id+'\')">提交审核</button>';
    if(d.status==='active') btns+=' <button class="btn btn-sm btn-yellow" onclick="MaintPlan.disable(\''+d.id+'\')">停用</button>';
    if(d.status==='disabled') btns+=' <button class="btn btn-sm btn-green" onclick="MaintPlan.enable(\''+d.id+'\')">启用</button>';
    btns+=' <button class="btn btn-sm btn-outline" onclick="MaintPlan.copy(\''+d.id+'\')">复制</button>';
    btns+=' <button class="btn btn-sm btn-outline" onclick="MaintPlan.versionLog(\''+d.id+'\')">版本日志</button>';
    return '<div class="table-actions">'+btns+'</div>';
  },

  _renderPagination(total,totalPages){
    return '<span style="font-size:12px;color:var(--text-secondary);">共 '+total+' 条 / '+totalPages+' 页</span>'+
    '<div style="display:flex;gap:4px;">'+
      '<button class="pagination-btn" '+(this.page<=1?'disabled':'')+' onclick="MaintPlan.goPage('+(this.page-1)+')">\u2039</button>'+
      '<span style="padding:0 8px;font-size:13px;line-height:30px;">'+this.page+' / '+(totalPages||1)+'</span>'+
      '<button class="pagination-btn" '+(this.page>=totalPages?'disabled':'')+' onclick="MaintPlan.goPage('+(this.page+1)+')">\u203a</button>'+
      '<select class="page-size-select" onchange="MaintPlan.pageSize=parseInt(this.value);MaintPlan.page=1;MaintPlan.renderTo()">'+[10,20,50].map(n=>'<option '+(this.pageSize===n?'selected':'')+'>'+n+'条</option>').join('')+'</select></div>';
  },

  goPage(p){ this.page=Math.max(1,p); this.renderTo(); },
  search(){ this.page=1; this.renderTo(); },
  reset(){ this.filter={code:'',name:'',maintenanceType:'',eqCategory:'',status:'',effectiveDate:''}; this.page=1; this.renderTo(); },
  renderTo(){
    const ca=document.getElementById('contentArea');
    if(ca) ca.innerHTML=this.render();
    if(typeof this.init==='function') this.init();
  },

  create(){ this.formId=''; this.formMode='create'; this.formTab='basic'; this.mode='form'; this.renderTo(); },
  view(id){ this.formId=id; this.formMode='view'; this.formTab='basic'; this.mode='form'; this.renderTo(); },
  edit(id){ this.formId=id; this.formMode='edit'; this.formTab='basic'; this.mode='form'; this.renderTo(); },
  backToList(){ this.mode='list'; this.page=1; this.renderTo(); },
  switchTab(t){ this.formTab=t; this.renderTo(); },

  submitReview(id){
    const plan=pmPlanData.find(p=>p.id===id);
    if(plan&&plan.ops&&plan.ops.length===0){ toast('作业工序不可为空，无法提交审核！'); return; }
    showModal('提交审核','确定提交计划 "'+(plan?plan.name:'')+'" 至审核流程？',[
      {text:'取消',action:closeModal,cls:'btn-secondary'},
      {text:'确认提交',action:function(){closeModal();if(plan){plan.status='pending_review';plan.statusName='待审核'} MaintPlan.renderTo(); toast('已提交审核')},cls:'btn-blue'}
    ]);
  },

  enable(id){
    showModal('启用计划','确定启用该维护计划？启用后可用于调度配置。',[
      {text:'取消',action:closeModal,cls:'btn-secondary'},
      {text:'确认启用',action:function(){closeModal();const p=pmPlanData.find(x=>x.id===id);if(p){p.status='active';p.statusName='已生效'} MaintPlan.renderTo(); toast('计划已启用')},cls:'btn-green'}
    ]);
  },

  disable(id){
    showModal('停用计划','停用后关联的调度方案将不生成新工单，确定停用？',[
      {text:'取消',action:closeModal,cls:'btn-secondary'},
      {text:'确认停用',action:function(){closeModal();const p=pmPlanData.find(x=>x.id===id);if(p){p.status='disabled';p.statusName='已停用'} MaintPlan.renderTo(); toast('计划已停用')},cls:'btn-yellow'}
    ]);
  },

  copy(id){
    const src=pmPlanData.find(x=>x.id===id); if(!src) return;
    const d=new Date(); const code='JH-'+d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'-'+(pmPlanData.length+1).toString().padStart(3,'0');
    const n=JSON.parse(JSON.stringify(src)); n.id='PL'+(pmPlanData.length+1).toString().padStart(3,'0'); n.code=code; n.name=src.name+'（副本）'; n.status='draft'; n.statusName='草稿'; n.version='V1.0'; n.creator='当前用户'; n.creatorTime=new Date().toISOString().substring(0,19).replace('T',' '); pmPlanData.push(n);
    toast('已复制为新计划：'+code); this.renderTo();
  },

  versionLog(id){
    const plan=pmPlanData.find(x=>x.id===id); if(!plan) return;
    openSidePanel('版本日志',plan.code+' | '+plan.name,
      '<div style="padding:12px;"><table class="data-table"><thead><tr><th>版本</th><th>变更时间</th><th>变更人</th><th>变更内容</th><th>备注</th></tr></thead>'+
      '<tbody><tr><td>'+esc(plan.version)+'</td><td>'+esc(plan.creatorTime)+'</td><td>'+esc(plan.creator)+'</td><td>初始创建</td><td>-</td></tr></tbody></table></div>');
  },

  batchEnable(){ toast('批量启用功能：请勾选需要启用的计划'); },
  batchDisable(){ toast('批量停用功能：请勾选需要停用的计划'); },
  batchExport(){ toast('批量导出功能开发中'); },

  // ========== FORM ==========
  renderForm(){
    const d=this.formMode==='create'?{}:pmPlanData.find(x=>x.id===this.formId)||{};
    const isView=this.formMode==='view';
    const disabled=isView?'disabled':'';
    const tabs=[{id:'basic',label:'基础信息'},{id:'ops',label:'作业工序'},{id:'parts',label:'所需备件'},{id:'devices',label:'关联设备'},{id:'files',label:'附件&规范'}];
    let html='<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">'+
      '<div style="padding:10px 20px;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">'+
        '<div><div style="font-size:15px;font-weight:700;">'+(this.formMode==='create'?'新增维护计划':(isView?'查看维护计划':'编辑维护计划'))+'</div><div style="font-size:12px;opacity:0.7;">编号：'+(d.code||'自动生成')+' | 版本：'+(d.version||'V1.0')+'</div></div>'+
        '<button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="MaintPlan.backToList()">\u2190 返回列表</button></div>'+
      '<div style="background:white;padding:0 20px;border-bottom:2px solid var(--border);display:flex;gap:0;position:sticky;top:0;z-index:5;">'+
        tabs.map(t=>'<div class="form-tab '+(this.formTab===t.id?'active':'')+'" onclick="MaintPlan.switchTab(\''+t.id+'\')">'+t.label+'</div>').join('')+'</div>'+
      '<div style="flex:1;overflow-y:auto;background:var(--bg);"><div class="form-container">';

    if(this.formTab==='basic') html+=this._renderTabBasic(d,isView);
    else if(this.formTab==='ops') html+=this._renderTabOps(d,isView);
    else if(this.formTab==='parts') html+=this._renderTabParts(d,isView);
    else if(this.formTab==='devices') html+=this._renderTabDevices(d,isView);
    else if(this.formTab==='files') html+=this._renderTabFiles(d,isView);

    html+='</div></div><div style="padding:10px 20px;background:white;border-top:2px solid var(--border);display:flex;gap:8px;justify-content:flex-end;flex-shrink:0;">';
    if(!isView&&this.formMode!=='view'){
      html+='<button class="btn btn-primary" onclick="MaintPlan.saveDraft()">保存草稿</button>';
      html+='<button class="btn btn-blue" onclick="MaintPlan.saveAndSubmit()">保存并提交审核</button>';
    }
    html+='<button class="btn btn-secondary" onclick="MaintPlan.backToList()">返回列表</button></div></div>';
    return html;
  },

  _renderTabBasic(d,isView){
    const dis=isView?'disabled':'';
    const typeOpts=pmMaintenanceTypes.map(o=>'<option value="'+o.value+'" '+(d.maintenanceType===o.value?'selected':'')+'>'+o.label+'</option>').join('');
    const priOpts=pmPriorityOptions.map(o=>'<option value="'+o.value+'" '+(d.priority===o.value?'selected':'')+'>'+o.label+'</option>').join('');
    const wcOpts=(wcMockData||[]).map(w=>'<option value="'+w.id+'" '+(d.workCenter===w.id?'selected':'')+'>'+w.name+'</option>').join('');
    return '<div class="section-title">\u2b50 基础信息</div>'+
    '<div class="form-grid col-2">'+
      '<div class="form-group"><label>计划编码</label><input value="'+(d.code||'(自动生成)')+'" disabled style="background:#f9fafb;"></div>'+
      '<div class="form-group"><label>计划名称 <span class="req">*</span></label><input value="'+esc(d.name||'')+'" '+dis+' placeholder="例：离心泵月度保养计划"></div>'+
      '<div class="form-group"><label>维保类型 <span class="req">*</span></label><select '+dis+'>'+typeOpts+'</select></div>'+
      '<div class="form-group"><label>设备分类</label><input value="'+esc(d.eqCategory||'')+'" '+dis+' placeholder="联动设备主数据分类"></div>'+
      '<div class="form-group"><label>归属工作中心</label><select '+dis+'>'+wcOpts+'</select></div>'+
      '<div class="form-group"><label>标准作业时长（小时）</label><input type="number" value="'+esc(d.stdHours||'')+'" '+dis+' placeholder="标准工时"></div>'+
      '<div class="form-group"><label>优先级</label><select '+dis+'>'+priOpts+'</select></div>'+
      '<div class="form-group"><label>版本号</label><input value="'+(d.version||'V1.0')+'" disabled style="background:#f9fafb;"></div>'+
      '<div class="form-group"><label>生效日期</label><input type="date" value="'+esc(d.effectiveDate||'')+'" '+dis+'></div>'+
      '<div class="form-group"><label>失效日期</label><input type="date" value="'+esc(d.expireDate||'')+'" '+dis+'></div>'+
      '<div class="form-group"><label>编制人</label><input value="'+(d.creator||'当前用户')+'" disabled style="background:#f9fafb;"></div>'+
      '<div class="form-group"><label>编制时间</label><input value="'+(d.creatorTime||'')+'" disabled style="background:#f9fafb;"></div>'+
      '<div class="form-group col-1"><label>备注</label><textarea '+dis+' rows="3">'+esc(d.remark||'')+'</textarea></div>'+
    '</div>';
  },

  _renderTabOps(d,isView){
    const ops=d.ops||[];
    const dis=isView?'disabled':'';
    return '<div class="section-title">\u2699 作业工序</div>'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">'+
      '<span style="font-size:12px;color:var(--text-muted);">基于标准化作业流程编制，工单将直接复用该工序。共 '+ops.length+' 条工序</span>'+
      (isView?'':'<div style="display:flex;gap:6px;"><button class="btn btn-sm btn-outline" onclick="MaintPlan.addOpRow()">+ 新增工序</button><button class="btn btn-sm btn-outline" onclick="MaintPlan.importOps()">批量导入</button></div>')+
    '</div>'+
    '<div class="table-wrapper"><table class="data-table"><thead><tr><th style="width:50px;">#</th><th>工序内容</th><th>作业指导</th><th>安全要求</th><th>GMP管控</th><th style="width:80px;">工时</th><th style="width:80px;">操作人</th>'+(isView?'':'<th style="width:80px;">操作</th>')+'</tr></thead>'+
    '<tbody>'+(ops.length===0?'<tr><td colspan="'+(isView?'7':'8')+'" style="text-align:center;color:var(--text-muted);padding:30px;">暂无工序，请点击"新增工序"添加</td></tr>':
      ops.map((o,i)=>'<tr>'+
        '<td>'+(i+1)+'</td>'+
        '<td style="max-width:160px;">'+esc(o.content)+'</td>'+
        '<td style="max-width:160px;font-size:12px;">'+esc(o.guide||'-')+'</td>'+
        '<td style="max-width:120px;font-size:12px;color:'+(o.safety?'var(--danger)':'var(--text-muted)')+';">'+esc(o.safety||'无特殊要求')+'</td>'+
        '<td style="max-width:120px;font-size:12px;color:'+(o.gmp?'var(--primary-lighter)':'var(--text-muted)')+';">'+esc(o.gmp||'无')+'</td>'+
        '<td>'+esc(o.stdHours)+'h</td>'+
        '<td style="font-size:12px;">'+esc(o.operator||'维修工')+'</td>'+
        (isView?'':'<td><div class="table-actions"><button class="btn btn-sm btn-outline" onclick="MaintPlan.editOp('+i+')">编辑</button><button class="btn btn-sm btn-outline" style="color:var(--danger);" onclick="MaintPlan.delOp('+i+')">删除</button></div></td>')+
      '</tr>').join(''))+
    '</tbody></table></div>';
  },

  _renderTabParts(d,isView){
    const parts=d.parts||[];
    const dis=isView?'disabled':'';
    return '<div class="section-title">\uD83D\uDD27 所需备件</div>'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">'+
      '<span style="font-size:12px;color:var(--text-muted);">维保过程需要更换、加注的配件、耗材、润滑油等。共 '+parts.length+' 种物料</span>'+
      (isView?'':'<div style="display:flex;gap:6px;"><button class="btn btn-sm btn-outline" onclick="MaintPlan.importFromBOM()">从设备BOM导入</button><button class="btn btn-sm btn-outline" onclick="MaintPlan.addPartRow()">+ 手动添加</button><button class="btn btn-sm btn-outline" onclick="MaintPlan.partBatchImport()">批量导入</button></div>')+
    '</div>'+
    '<div class="table-wrapper"><table class="data-table"><thead><tr><th>物料编码</th><th>物料名称</th><th>规格</th><th>单位</th><th>单次数量</th><th>关键件</th><th>更换周期</th><th>备注</th>'+(isView?'':'<th style="width:80px;">操作</th>')+'</tr></thead>'+
    '<tbody>'+(parts.length===0?'<tr><td colspan="'+(isView?'8':'9')+'" style="text-align:center;color:var(--text-muted);padding:30px;">暂未添加备件</td></tr>':
      parts.map((p,i)=>'<tr>'+
        '<td>'+esc(p.matCode)+'</td>'+
        '<td>'+esc(p.matName)+'</td>'+
        '<td>'+esc(p.spec||'-')+'</td>'+
        '<td>'+esc(p.unit)+'</td>'+
        '<td>'+esc(p.planQty)+'</td>'+
        '<td>'+(p.isKey?'<span class="badge badge-red badge-sm">关键件</span>':'<span class="badge badge-gray badge-sm">普通</span>')+'</td>'+
        '<td style="font-size:12px;">'+esc(p.replaceCycle||'-')+'</td>'+
        '<td style="font-size:12px;">'+esc(p.remark||'-')+'</td>'+
        (isView?'':'<td><div class="table-actions"><button class="btn btn-sm btn-outline" onclick="MaintPlan.editPart('+i+')">编辑</button><button class="btn btn-sm btn-outline" style="color:var(--danger);" onclick="MaintPlan.delPart('+i+')">删除</button></div></td>')+
      '</tr>').join(''))+
    '</tbody></table></div>';
  },

  _renderTabDevices(d,isView){
    const devs=d.devices||[];
    return '<div class="section-title">\uD83D\uDDA5 关联设备</div>'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">'+
      '<span style="font-size:12px;color:var(--text-muted);">绑定该套维护计划作用的设备清单。共 '+devs.length+' 台设备</span>'+
      (isView?'':'<div style="display:flex;gap:6px;"><button class="btn btn-sm btn-blue" onclick="MaintPlan.selectDevice()">+ 选择设备</button><button class="btn btn-sm btn-outline" onclick="MaintPlan.batchBindCategory()">按分类批量绑定</button></div>')+
    '</div>'+
    '<div class="table-wrapper"><table class="data-table"><thead><tr><th>设备编码</th><th>设备名称</th><th>功能位置</th><th>设备状态</th><th>绑定时间</th>'+(isView?'':'<th style="width:80px;">操作</th>')+'</tr></thead>'+
    '<tbody>'+(devs.length===0?'<tr><td colspan="'+(isView?'5':'6')+'" style="text-align:center;color:var(--text-muted);padding:30px;">暂未绑定设备，请选择设备</td></tr>':
      devs.map((dd,i)=>{
        const eq=equipmentData.find(e=>e.id===dd.eqId);
        return '<tr>'+
          '<td>'+esc(dd.eqCode)+'</td>'+
          '<td>'+esc(dd.eqName)+'</td>'+
          '<td style="font-size:12px;">'+esc(dd.locationName||dd.location)+'</td>'+
          '<td>'+(eq?getStatusBadge(eq.status):'<span class="badge badge-gray">未知</span>')+'</td>'+
          '<td style="font-size:12px;">'+esc(dd.bindTime||'-')+'</td>'+
          (isView?'':'<td><div class="table-actions"><button class="btn btn-sm btn-outline" style="color:var(--danger);" onclick="MaintPlan.removeDevice('+i+')">移除</button></div></td>')+
        '</tr>';
      }).join(''))+
    '</tbody></table></div>';
  },

  _renderTabFiles(d,isView){
    const files=d.attachments||[];
    return '<div class="section-title">\uD83D\uDCCE 附件 &amp; 规范</div><div class="form-grid col-1">'+
      '<div class="form-group"><label>作业指导书 / SOP / 图纸 / 合规检查表</label>'+
      '<div style="border:2px dashed var(--border);border-radius:8px;padding:30px;text-align:center;background:#fafbfc;margin-bottom:8px;">'+
        '<div style="font-size:32px;color:#cbd5e1;margin-bottom:8px;">\uD83D\uDCE4</div>'+
        '<div style="color:var(--text-muted);font-size:13px;">拖拽文件到此处或点击上传</div>'+
        '<div style="color:var(--text-muted);font-size:11px;margin-top:4px;">支持 PDF、Word、Excel、图片等格式</div>'+
        (isView?'':'<button class="btn btn-outline btn-sm" style="margin-top:8px;" onclick="MaintPlan.uploadFile()">选择文件</button>')+
      '</div></div>'+
    '</div>'+
    '<div class="table-wrapper"><table class="data-table"><thead><tr><th>文件名</th><th>大小</th><th>上传时间</th></tr></thead>'+
    '<tbody>'+(files.length===0?'<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:20px;">暂无附件</td></tr>':
      files.map(f=>'<tr><td><span style="color:var(--primary-lighter);cursor:pointer;">\uD83D\uDCC4 '+esc(f.name)+'</span></td><td>'+esc(f.size)+'</td><td>'+esc(f.uploadTime)+'</td></tr>').join(''))+
    '</tbody></table></div>'+
    '<div class="form-group col-1" style="margin-top:12px;"><label>整体备注</label><textarea '+(isView?'disabled':'')+' rows="3" placeholder="特殊维保要求、历史变更说明">'+esc(d.remark||'')+'</textarea></div>';
  },

  // Placeholder actions
  addOpRow(){ toast('新增工序弹窗'); },
  editOp(i){ toast('编辑工序 #'+(i+1)); },
  delOp(i){ toast('删除工序 #'+(i+1)); },
  importOps(){ toast('批量导入工序'); },
  importFromBOM(){ toast('从设备BOM导入备件'); },
  addPartRow(){ toast('手动添加备件'); },
  partBatchImport(){ toast('批量导入备件'); },
  editPart(i){ toast('编辑备件 #'+(i+1)); },
  delPart(i){ toast('删除备件 #'+(i+1)); },
  selectDevice(){ toast('选择设备弹窗'); },
  batchBindCategory(){ toast('按分类批量绑定'); },
  removeDevice(i){ toast('移除设备 #'+(i+1)); },
  uploadFile(){ toast('文件上传功能'); },
  saveDraft(){ toast('已保存为草稿'); },
  saveAndSubmit(){ toast('保存并提交审核'); },

  init(){}
};
*/