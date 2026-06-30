// ===== 3.2 计划调度 =====
const MaintSchedule = {
  mode:'list', page:1, pageSize:10,
  filter:{code:'',planName:'',triggerType:'',status:'',dateRange:''},
  formId:'', formMode:'create', formTriggerType:'time',

  render(){
    if(this.mode==='form') return this.renderForm();
    let data=[...pmScheduleData];
    const f=this.filter;
    if(f.code) data=data.filter(d=>d.code.toLowerCase().includes(f.code.toLowerCase()));
    if(f.planName) data=data.filter(d=>d.planName.toLowerCase().includes(f.planName.toLowerCase()));
    if(f.triggerType) data=data.filter(d=>d.triggerType===f.triggerType);
    if(f.status) data=data.filter(d=>d.status===f.status);
    const total=data.length, totalPages=Math.ceil(total/this.pageSize);
    const start=(this.page-1)*this.pageSize, pageData=data.slice(start,start+this.pageSize);
    const trigOpts=pmTriggerTypes.map(o=>'<option value="'+o.value+'" '+(f.triggerType===o.value?'selected':'')+'>'+o.label+'</option>').join('');
    const sOpts=pmScheduleStatusOptions.map(o=>'<option value="'+o.value+'" '+(f.status===o.value?'selected':'')+'>'+o.label+'</option>').join('');
    return '<div class="page-container"><div class="page-header"><div class="page-title">计划调度</div><div class="page-actions"><button class="btn btn-secondary" onclick="MaintSchedule.reset()">刷新</button><button class="btn btn-outline" onclick="MaintSchedule.batchEnable()">批量启用</button><button class="btn btn-outline" onclick="MaintSchedule.batchPause()">批量暂停</button><button class="btn btn-outline" onclick="MaintSchedule.batchRecalc()">批量重算周期</button><button class="btn btn-blue" onclick="MaintSchedule.create()">+ 新增调度方案</button></div></div>'+
    '<div class="filter-bar">'+
      '<div class="filter-group"><label>调度编码</label><input value="'+esc(f.code)+'" onchange="MaintSchedule.filter.code=this.value;MaintSchedule.search()" placeholder="调度编码"></div>'+
      '<div class="filter-group"><label>维护计划</label><input value="'+esc(f.planName)+'" onchange="MaintSchedule.filter.planName=this.value;MaintSchedule.search()" placeholder="关联维护计划"></div>'+
      '<div class="filter-group"><label>触发类型</label><select onchange="MaintSchedule.filter.triggerType=this.value;MaintSchedule.search()"><option value="" '+(f.triggerType?'':'selected')+'>全部类型</option>'+trigOpts+'</select></div>'+
      '<div class="filter-group"><label>状态</label><select onchange="MaintSchedule.filter.status=this.value;MaintSchedule.search()"><option value="" '+(f.status?'':'selected')+'>全部状态</option>'+sOpts+'</select></div>'+
      '<div class="filter-actions"><button class="btn btn-primary btn-sm" onclick="MaintSchedule.search()">查询</button><button class="btn btn-secondary btn-sm" onclick="MaintSchedule.reset()">重置</button></div>'+
    '</div>'+
    '<div class="table-wrapper" style="margin-top:12px;"><table class="data-table"><thead><tr><th>调度编码</th><th>关联维护计划</th><th>触发类型</th><th>执行频率</th><th>覆盖设备</th><th>状态</th><th>最近生成</th><th>下次预计</th><th>操作</th></tr></thead>'+
    '<tbody>'+pageData.map(d=>{
      const s=pmScheduleStatusOptions.find(o=>o.value===d.status);
      const tt=pmTriggerTypes.find(o=>o.value===d.triggerType);
      let freqText=d.frequency||'-';
      if(d.triggerType==='hours') freqText='每 '+d.runHours+' 小时';
      else if(d.triggerType==='counter') freqText='累计 '+d.triggerCount+' 次';
      else if(d.triggerType==='combined') freqText=d.frequency+' + '+d.runHours+'h';
      return '<tr>'+
        '<td><strong>'+esc(d.code)+'</strong></td>'+
        '<td style="font-size:12px;">'+esc(d.planName)+'<br><span style="color:var(--text-muted);">'+esc(d.planCode)+'</span></td>'+
        '<td><span class="badge badge-sm '+(d.triggerType==='time'?'badge-blue':d.triggerType==='hours'?'badge-green':d.triggerType==='counter'?'badge-purple':'badge-orange')+'">'+(tt?tt.label:d.triggerType)+'</span></td>'+
        '<td style="font-size:12px;">'+freqText+'</td>'+
        '<td>'+d.deviceCount+' 台</td>'+
        '<td><span class="badge '+(s?s.cls:'badge-gray')+'">'+(s?s.label:d.status)+'</span></td>'+
        '<td style="font-size:12px;">'+(d.lastGenTime?d.lastGenTime.substring(0,10):'-')+'</td>'+
        '<td style="font-size:12px;">'+(d.nextGenTime?d.nextGenTime.substring(0,10):'-')+'</td>'+
        '<td>'+this._rowActions(d)+'</td></tr>';
    }).join('')+'</tbody></table></div>'+
    '<div class="pagination-bar"><span style="font-size:12px;color:var(--text-secondary);">共 '+total+' 条 / '+totalPages+' 页</span>'+
    '<div style="display:flex;gap:4px;"><button class="pagination-btn" '+(this.page<=1?'disabled':'')+' onclick="MaintSchedule.goPage('+(this.page-1)+')">\u2039</button>'+
    '<span style="padding:0 8px;font-size:13px;line-height:30px;">'+this.page+' / '+(totalPages||1)+'</span>'+
    '<button class="pagination-btn" '+(this.page>=totalPages?'disabled':'')+' onclick="MaintSchedule.goPage('+(this.page+1)+')">\u203a</button></div></div></div>';
  },

  _rowActions(d){
    let btns='<button class="btn btn-sm btn-outline" onclick="MaintSchedule.edit(\''+d.id+'\')">编辑</button>';
    if(d.status==='active') btns+=' <button class="btn btn-sm btn-yellow" onclick="MaintSchedule.pause(\''+d.id+'\')">暂停</button>';
    if(d.status==='active') btns+=' <button class="btn btn-sm btn-red" onclick="MaintSchedule.stop(\''+d.id+'\')">终止</button>';
    if(d.status==='paused') btns+=' <button class="btn btn-sm btn-green" onclick="MaintSchedule.activate(\''+d.id+'\')">启用</button>';
    btns+=' <button class="btn btn-sm btn-outline" onclick="MaintSchedule.recalc(\''+d.id+'\')">重算周期</button>';
    btns+=' <button class="btn btn-sm btn-outline" onclick="MaintSchedule.viewLog(\''+d.id+'\')">生成日志</button>';
    return '<div class="table-actions">'+btns+'</div>';
  },

  goPage(p){ this.page=Math.max(1,p); this.renderTo(); },
  search(){ this.page=1; this.renderTo(); },
  reset(){ this.filter={code:'',planName:'',triggerType:'',status:'',dateRange:''}; this.page=1; this.renderTo(); },
  renderTo(){
    const ca=document.getElementById('contentArea');
    if(ca) ca.innerHTML=this.render();
  },

  create(){
    this.formId=''; this.formMode='create'; this.formTriggerType='time'; this.mode='form'; this.renderTo();
  },
  edit(id){
    const d=pmScheduleData.find(x=>x.id===id);
    this.formId=id; this.formMode='edit'; this.formTriggerType=d?d.triggerType:'time'; this.mode='form'; this.renderTo();
  },
  backToList(){ this.mode='list'; this.page=1; this.renderTo(); },
  switchTrigger(t){ this.formTriggerType=t; this.renderTo(); },

  activate(id){
    showModal('启用调度','确定启用该调度方案？启用后将按规则自动生成工单。',[
      {text:'取消',action:closeModal,cls:'btn-secondary'},
      {text:'确认启用',action:function(){closeModal();const s=pmScheduleData.find(x=>x.id===id);if(s){s.status='active';s.statusName='已启用'} MaintSchedule.renderTo(); toast('调度已启用')},cls:'btn-green'}
    ], 'modal-sm');
  },
  pause(id){
    showModal('暂停调度','暂停后不再自动生成工单，可随时恢复。',[
      {text:'取消',action:closeModal,cls:'btn-secondary'},
      {text:'确认暂停',action:function(){closeModal();const s=pmScheduleData.find(x=>x.id===id);if(s){s.status='paused';s.statusName='已暂停'} MaintSchedule.renderTo(); toast('调度已暂停')},cls:'btn-yellow'}
    ], 'modal-sm');
  },
  stop(id){
    showModal('终止调度','终止后永久停止，无法恢复。确定终止？',[
      {text:'取消',action:closeModal,cls:'btn-secondary'},
      {text:'确认终止',action:function(){closeModal();const s=pmScheduleData.find(x=>x.id===id);if(s){s.status='stopped';s.statusName='已终止'} MaintSchedule.renderTo(); toast('调度已终止')},cls:'btn-red'}
    ], 'modal-sm');
  },

  recalc(id){
    const s=pmScheduleData.find(x=>x.id===id); if(!s) return;
    toast('已重算下次执行时间，查看更新结果');
  },

  viewLog(id){
    const s=pmScheduleData.find(x=>x.id===id); if(!s) return;
    App.navigateTo('pm','pm-auto','pm-auto','自动生成预防性工单');
  },

  batchEnable(){ toast('批量启用功能'); },
  batchPause(){ toast('批量暂停功能'); },
  batchRecalc(){ toast('批量重算周期功能'); },

  // ========== FORM ==========
  renderForm(){
    const d=this.formMode==='create'?{}:pmScheduleData.find(x=>x.id===this.formId)||{};
    const planOpts=pmPlanData.filter(p=>p.status==='active').map(p=>'<option value="'+p.id+'" '+(d.planId===p.id?'selected':'')+'>'+p.code+' | '+p.name+'</option>').join('');
    return '<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">'+
      '<div style="padding:10px 20px;background:linear-gradient(135deg,#0F766E,#14B8A6);color:white;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">'+
        '<div><div style="font-size:15px;font-weight:700;">'+(this.formMode==='create'?'新增调度方案':'编辑调度方案')+'</div><div style="font-size:12px;opacity:0.7;">编号：'+(d.code||'自动生成')+'</div></div>'+
        '<button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="MaintSchedule.backToList()">\u2190 返回列表</button></div>'+
      '<div style="flex:1;overflow-y:auto;background:var(--bg);"><div class="form-container">'+
        // 头部关联信息
        '<div class="section-title">\uD83D\uDCCB 头部关联信息</div>'+
        '<div class="form-grid col-2">'+
          '<div class="form-group"><label>调度编码</label><input value="'+(d.code||'(自动生成)')+'" disabled style="background:#f9fafb;"></div>'+
          '<div class="form-group"><label>关联维护计划 <span class="req">*</span></label><select>'+planOpts+'</select></div>'+
          '<div class="form-group"><label>调度名称 <span class="req">*</span></label><input value="'+esc(d.scheduleName||'')+'" placeholder="便于区分管理"></div>'+
          '<div class="form-group"><label>所属部门</label><input value="'+esc(d.dept||'设备部')+'"></div>'+
          '<div class="form-group"><label>负责人</label><input value="'+esc(d.owner||'')+'"></div>'+
          '<div class="form-group"><label></label></div>'+
          '<div class="form-group"><label>生效时间</label><input type="date" value="'+esc(d.startDate||'')+'"></div>'+
          '<div class="form-group"><label>终止时间</label><input type="date" value="'+esc(d.endDate||'')+'"></div>'+
        '</div>'+
        // 触发规则配置
        '<div class="section-title">\u23F0 触发规则配置</div>'+
        '<div style="display:flex;gap:0;margin-bottom:16px;border-bottom:2px solid var(--border);">'+
          pmTriggerTypes.map(t=>'<div class="form-tab '+(this.formTriggerType===t.value?'active':'')+'" style="cursor:pointer;" onclick="MaintSchedule.switchTrigger(\''+t.value+'\')">'+t.label+'</div>').join('')+'</div>'+
        this._renderTriggerConfig(d)+
        // 执行参数
        '<div class="section-title">\u2699 执行参数配置</div>'+
        '<div class="form-grid col-2">'+
          '<div class="form-group"><label>工单计划开始偏移（天）</label><input type="number" value="0" placeholder="生成后延后N天执行"></div>'+
          '<div class="form-group"><label>单次最大生成数量</label><input type="number" value="'+esc(d.maxBatchQty||10)+'" placeholder="限制批量生成上限"></div>'+
          '<div class="form-group"><label>自动派工</label><select><option value="1" '+(d.autoDispatch?'selected':'')+'>开启 - 工单生成后自动派工</option><option value="0" '+(!d.autoDispatch?'selected':'')+'>关闭 - 停留在待派工状态</option></select></div>'+
          '<div class="form-group"><label>自动领料提醒</label><select><option value="1" '+(d.autoPickRemind?'selected':'')+'>开启 - 缺料自动推送到采购/仓库</option><option value="0" '+(!d.autoPickRemind?'selected':'')+'>关闭</option></select></div>'+
        '</div>'+
        // 例外管控
        '<div class="section-title">\uD83D\uDCC5 例外 &amp; 节假日管控</div>'+
        '<div class="form-grid col-2">'+
          '<div class="form-group"><label>节假日跳过</label><select><option value="1" '+(d.holidaySkip?'selected':'')+'>是 - 节假日不生成，顺延</option><option value="0" '+(!d.holidaySkip?'selected':'')+'>否 - 照常生成</option></select></div>'+
          '<div class="form-group"><label>设备停机豁免</label><select><option value="1" '+(d.equipStopExempt?'selected':'')+'>是 - 停用/封存/故障设备暂不生成</option><option value="0" '+(!d.equipStopExempt?'selected':'')+'>否</option></select></div>'+
          '<div class="form-group col-1"><label>临时排除设备</label><textarea rows="2" placeholder="从本调度中临时剔除的设备编码，多个用逗号分隔">'+(d.excludedDevices||[]).join(',')+'</textarea></div>'+
          '<div class="form-group col-1"><label>备注</label><textarea rows="2">'+esc(d.remark||'')+'</textarea></div>'+
        '</div>'+
      '</div></div>'+
      '<div style="padding:10px 20px;background:white;border-top:2px solid var(--border);display:flex;gap:8px;justify-content:flex-end;flex-shrink:0;">'+
        '<button class="btn btn-primary" onclick="MaintSchedule.saveDraft()">保存草稿</button>'+
        '<button class="btn btn-green" onclick="MaintSchedule.saveAndActivate()">保存并启用</button>'+
        '<button class="btn btn-secondary" onclick="MaintSchedule.backToList()">返回列表</button></div></div>';
  },

  _renderTriggerConfig(d){
    const f=this.formTriggerType;
    let html='';
    // Type 1: Time-based
    html+='<div '+(f!=='time'?'style="display:none;"':'')+'><div class="form-grid col-2">'+
      '<div class="form-group"><label>周期单位 <span class="req">*</span></label><select><option value="day">日</option><option value="week" selected>周</option><option value="month">月</option><option value="quarter">季度</option><option value="year">年</option></select></div>'+
      '<div class="form-group"><label>执行间隔</label><input type="number" value="'+esc(d.interval||1)+'" placeholder="每N个周期"></div>'+
      '<div class="form-group"><label>执行日期</label><input type="number" value="'+esc(d.execDay||1)+'" placeholder="每月几号（按周：周几）"></div>'+
      '<div class="form-group"><label>执行时间</label><input type="time" value="'+esc(d.execTime||'08:00')+'"></div>'+
      '<div class="form-group"><label>首次执行日期 <span class="req">*</span></label><input type="date" value="'+esc(d.firstExecDate||'')+'"></div>'+
      '<div class="form-group"><label></label></div>'+
      '<div class="form-group"><label>允许提前天数</label><input type="number" value="'+esc(d.allowEarlyDays||0)+'" min="0" placeholder="GMP严格场景设为0"></div>'+
      '<div class="form-group"><label>允许延后天数</label><input type="number" value="'+esc(d.allowLateDays||0)+'" min="0" placeholder="GMP严格场景设为0"></div>'+
      '<div class="form-group col-1" style="background:#f0fdf4;padding:12px;border-radius:8px;font-size:12px;color:#166534;">\uD83D\uDCA1 应用场景：日常点检、定期润滑、季度合规检查（固定日历执行）</div>'+
    '</div></div>';
    // Type 2: Hours-based
    html+='<div '+(f!=='hours'?'style="display:none;"':'')+'><div class="form-grid col-2">'+
      '<div class="form-group"><label>触发运行小时 <span class="req">*</span></label><input type="number" value="'+esc(d.runHours||'')+'" placeholder="累计运行XX小时触发"><span style="font-size:11px;color:var(--text-muted);">小时</span></div>'+
      '<div class="form-group"><label>当前累计运行小时</label><input value="'+esc(d.currentHours||'-')+'" disabled style="background:#f9fafb;"><span style="font-size:11px;color:var(--text-muted);">只读，自动回填</span></div>'+
      '<div class="form-group"><label>初始基准小时</label><input value="'+esc(d.initHours||'-')+'" disabled style="background:#f9fafb;"></div>'+
      '<div class="form-group"><label>预警提前小时</label><input type="number" value="'+esc(d.warnHours||'')+'" placeholder="临近触发节点提前提醒"><span style="font-size:11px;color:var(--text-muted);">小时</span></div>'+
      '<div class="form-group col-1" style="background:#eff6ff;padding:12px;border-radius:8px;font-size:12px;color:#1e40af;">\uD83D\uDCA1 应用场景：泵、风机、电机、压缩机等连续运转设备（按实际负荷执行）<br>\u2139 数据来源：自动同步设备运行台账、SAP运行计数器</div>'+
    '</div></div>';
    // Type 3: Counter-based
    html+='<div '+(f!=='counter'?'style="display:none;"':'')+'><div class="form-grid col-2">'+
      '<div class="form-group"><label>触发计数值 <span class="req">*</span></label><input type="number" value="'+esc(d.triggerCount||'')+'" placeholder="累计XX次触发"></div>'+
      '<div class="form-group"><label>当前计数器数值</label><input value="'+esc(d.currentCounter||'-')+'" disabled style="background:#f9fafb;"><span style="font-size:11px;color:var(--text-muted);">只读</span></div>'+
      '<div class="form-group"><label>计数器类型</label><select><option>启停次数</option><option>生产批次</option><option>动作次数</option></select></div>'+
      '<div class="form-group"><label>预警提前次数</label><input type="number" placeholder="临近节点提醒"><span style="font-size:11px;color:var(--text-muted);">次</span></div>'+
      '<div class="form-group col-1" style="background:#faf5ff;padding:12px;border-radius:8px;font-size:12px;color:#7e22ce;">\uD83D\uDCA1 应用场景：包装设备、往复式设备、批次生产设备（按动作/批次执行）</div>'+
    '</div></div>';
    // Type 4: Combined
    html+='<div '+(f!=='combined'?'style="display:none;"':'')+'><div class="form-grid col-2">'+
      '<div class="form-group"><label>时间周期频率</label><input value="'+esc(d.frequency||'')+'" disabled style="background:#f9fafb;"></div>'+
      '<div class="form-group"><label>运行小时条件</label><input type="number" value="'+esc(d.runHours||3000)+'" placeholder="同时满足的运行小时数"><span style="font-size:11px;color:var(--text-muted);">小时</span></div>'+
      '<div class="form-group"><label>当前累计运行小时</label><input value="'+esc(d.currentHours||'-')+'" disabled style="background:#f9fafb;"></div>'+
      '<div class="form-group"><label>预警提前小时</label><input type="number" value="'+esc(d.warnHours||'')+'"><span style="font-size:11px;color:var(--text-muted);">小时</span></div>'+
      '<div class="form-group col-1" style="background:#fff7ed;padding:12px;border-radius:8px;font-size:12px;color:#9a3412;">\uD83D\uDCA1 应用场景：关键高负荷设备，同时满足「时间到期 + 运行时长达标」才生成工单<br>\u26A0 当前该方案处于暂停状态，优先使用运行小时调度</div>'+
    '</div></div>';
    return html;
  },

  saveDraft(){ toast('已保存为草稿'); },
  saveAndActivate(){ toast('保存并启用调度'); },

  init(){}
};