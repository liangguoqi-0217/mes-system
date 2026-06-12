// ===== 3.3 自动生成预防性工单 =====
const PMAutoGen = {
  mode:'monitor', page:1, pageSize:10,
  genFilter:{scheduleId:'',eqInfo:'',dateRange:'',result:''},
  logFilter:{scheduleCode:'',dateRange:'',operator:'',genStatus:''},

  render(){
    if(this.mode==='log') return this.renderLog();
    return this.renderMonitor();
  },

  // ===== 监控总览页 =====
  renderMonitor(){
    const f=this.genFilter;
    let data=[...pmGenLogData];
    if(f.scheduleId) data=data.filter(d=>d.scheduleId===f.scheduleId);
    if(f.eqInfo) data=data.filter(d=>d.eqCode.toLowerCase().includes(f.eqInfo.toLowerCase())||d.eqName.toLowerCase().includes(f.eqInfo.toLowerCase()));
    if(f.result) data=data.filter(d=>d.result===f.result);
    const total=data.length, totalPages=Math.ceil(total/this.pageSize);
    const start=(this.page-1)*this.pageSize, pageData=data.slice(start,start+this.pageSize);

    const pendingCount=pmGenLogData.filter(d=>d.result==='pending').length;
    const successCount=pmGenLogData.filter(d=>d.result==='success').length;
    const failedCount=pmGenLogData.filter(d=>d.result==='failed').length;
    const todayPending=pmGenLogData.filter(d=>d.result==='pending'&&d.planGenTime&&d.planGenTime.substring(0,10)<=new Date().toISOString().substring(0,10)).length;

    const schedOpts=pmScheduleData.map(s=>'<option value="'+s.id+'" '+(f.scheduleId===s.id?'selected':'')+'>'+s.scheduleName+'</option>').join('');
    const resOpts=pmGenStatusOptions.map(o=>'<option value="'+o.value+'" '+(f.result===o.value?'selected':'')+'>'+o.label+'</option>').join('');

    let html='<div class="page-container">'+
      '<div class="page-header"><div class="page-title">自动生成预防性工单</div><div class="page-actions">'+
        '<button class="btn btn-secondary" onclick="PMAutoGen.resetGenFilter()">刷新</button>'+
        '<button class="btn btn-blue" onclick="PMAutoGen.manualGen()">手动触发生成</button>'+
        '<button class="btn btn-outline" onclick="PMAutoGen.batchReplenish()">批量补单</button>'+
        '<button class="btn btn-outline" onclick="PMAutoGen.mode=\'log\';PMAutoGen.renderTo()">生成日志</button>'+
        '<button class="btn btn-outline" onclick="PMAutoGen.exportLog()">导出日志</button>'+
      '</div></div>'+
      // 统计卡片
      '<div class="stats-row" style="margin-bottom:12px;">'+
        '<div class="stat-card"><div class="stat-icon" style="background:#eff6ff;color:#3B82F6;">\u23F3</div><div class="stat-value">'+todayPending+'</div><div class="stat-label">今日待生成工单</div></div>'+
        '<div class="stat-card"><div class="stat-icon" style="background:#f0fdf4;color:#10B981;">\u2705</div><div class="stat-value">'+successCount+'</div><div class="stat-label">已成功生成</div></div>'+
        '<div class="stat-card"><div class="stat-icon" style="background:#fef2f2;color:#DC2626;">\u274C</div><div class="stat-value">'+failedCount+'</div><div class="stat-label">生成失败</div></div>'+
        '<div class="stat-card"><div class="stat-icon" style="background:#fffbeb;color:#F59E0B;">\uD83D\uDCCB</div><div class="stat-value">'+pendingCount+'</div><div class="stat-label">待补单数量</div></div>'+
      '</div>'+
      // 筛选
      '<div class="filter-bar">'+
        '<div class="filter-group"><label>调度方案</label><select onchange="PMAutoGen.genFilter.scheduleId=this.value;PMAutoGen.searchGen()"><option value="" '+(f.scheduleId?'':'selected')+'>全部方案</option>'+schedOpts+'</select></div>'+
        '<div class="filter-group"><label>设备</label><input value="'+esc(f.eqInfo)+'" onchange="PMAutoGen.genFilter.eqInfo=this.value;PMAutoGen.searchGen()" placeholder="编码/名称"></div>'+
        '<div class="filter-group"><label>生成状态</label><select onchange="PMAutoGen.genFilter.result=this.value;PMAutoGen.searchGen()"><option value="" '+(f.result?'':'selected')+'>全部状态</option>'+resOpts+'</select></div>'+
        '<div class="filter-actions"><button class="btn btn-primary btn-sm" onclick="PMAutoGen.searchGen()">查询</button><button class="btn btn-secondary btn-sm" onclick="PMAutoGen.resetGenFilter()">重置</button></div>'+
      '</div>'+
      // 表格
      '<div class="table-wrapper" style="margin-top:12px;"><table class="data-table"><thead><tr><th>调度方案</th><th>设备</th><th>计划生成时间</th><th>实际生成时间</th><th>生成结果</th><th>工单编号</th><th>失败原因</th><th>操作</th></tr></thead>'+
      '<tbody>'+pageData.map(d=>{
        const rs=pmGenStatusOptions.find(o=>o.value===d.result);
        return '<tr>'+
          '<td style="font-size:12px;">'+esc(d.scheduleName)+'<br><span style="color:var(--text-muted);">'+esc(d.scheduleCode)+'</span></td>'+
          '<td style="font-size:12px;">'+esc(d.eqCode)+'<br><span style="color:var(--text-muted);">'+esc(d.eqName)+'</span></td>'+
          '<td style="font-size:12px;">'+(d.planGenTime?d.planGenTime.substring(0,10):'-')+'</td>'+
          '<td style="font-size:12px;">'+(d.actualGenTime?d.actualGenTime.substring(0,16):'-')+'</td>'+
          '<td><span class="badge '+(rs?rs.cls:'badge-gray')+'">'+(rs?rs.label:d.result)+'</span></td>'+
          '<td>'+(d.orderCode?'<strong style="color:var(--primary-lighter);cursor:pointer;" onclick="PMAutoGen.viewOrder(\''+d.orderId+'\')">'+esc(d.orderCode)+'</strong>':'<span style="color:var(--text-muted);">-</span>')+'</td>'+
          '<td style="font-size:11px;color:var(--danger);max-width:200px;">'+esc(d.failReason||'-')+'</td>'+
          '<td>'+this._genRowActions(d)+'</td></tr>';
      }).join('')+'</tbody></table></div>'+
      '<div class="pagination-bar"><span style="font-size:12px;color:var(--text-secondary);">共 '+total+' 条</span>'+
      '<div style="display:flex;gap:4px;"><button class="pagination-btn" '+(this.page<=1?'disabled':'')+' onclick="PMAutoGen.goGenPage('+(this.page-1)+')">\u2039</button>'+
      '<span style="padding:0 8px;font-size:13px;line-height:30px;">'+this.page+' / '+(totalPages||1)+'</span>'+
      '<button class="pagination-btn" '+(this.page>=totalPages?'disabled':'')+' onclick="PMAutoGen.goGenPage('+(this.page+1)+')">\u203a</button></div></div></div>';
    return html;
  },

  _genRowActions(d){
    let btns='';
    if(d.result==='failed') btns+='<button class="btn btn-sm btn-blue" onclick="PMAutoGen.retryGen(\''+d.id+'\')">重新生成</button>';
    if(d.result==='pending') btns+='<button class="btn btn-sm btn-green" onclick="PMAutoGen.triggerGen(\''+d.id+'\')">触发生成</button>';
    btns+=' <button class="btn btn-sm btn-outline" onclick="PMAutoGen.viewLogDetail(\''+d.id+'\')">详情</button>';
    return btns?'<div class="table-actions">'+btns+'</div>':'<span style="color:var(--text-muted);">-</span>';
  },

  goGenPage(p){ this.page=Math.max(1,p); this.renderTo(); },
  searchGen(){ this.page=1; this.renderTo(); },
  resetGenFilter(){ this.genFilter={scheduleId:'',eqInfo:'',dateRange:'',result:''}; this.page=1; this.renderTo(); },

  // ===== 生成日志页 =====
  renderLog(){
    const f=this.logFilter;
    let data=[...pmGenLogData];
    if(f.scheduleCode) data=data.filter(d=>d.scheduleCode.toLowerCase().includes(f.scheduleCode.toLowerCase()));
    if(f.genStatus) data=data.filter(d=>d.result===f.genStatus);
    const total=data.length, totalPages=Math.ceil(total/this.pageSize);
    const start=(this.page-1)*this.pageSize, pageData=data.slice(start,start+this.pageSize);
    const sOpts=pmGenStatusOptions.map(o=>'<option value="'+o.value+'" '+(f.genStatus===o.value?'selected':'')+'>'+o.label+'</option>').join('');

    return '<div class="page-container"><div class="page-header"><div class="page-title">生成日志</div><div class="page-actions">'+
      '<button class="btn btn-outline" onclick="PMAutoGen.mode=\'monitor\';PMAutoGen.page=1;PMAutoGen.renderTo()">\u2190 返回监控总览</button>'+
      '<button class="btn btn-secondary" onclick="PMAutoGen.resetLogFilter()">刷新</button>'+
      '<button class="btn btn-outline" onclick="PMAutoGen.exportLog()">导出日志</button>'+
    '</div></div>'+
    '<div class="filter-bar">'+
      '<div class="filter-group"><label>调度编码</label><input value="'+esc(f.scheduleCode)+'" onchange="PMAutoGen.logFilter.scheduleCode=this.value;PMAutoGen.searchLog()" placeholder="调度编码"></div>'+
      '<div class="filter-group"><label>生成状态</label><select onchange="PMAutoGen.logFilter.genStatus=this.value;PMAutoGen.searchLog()"><option value="" '+(f.genStatus?'':'selected')+'>全部状态</option>'+sOpts+'</select></div>'+
      '<div class="filter-actions"><button class="btn btn-primary btn-sm" onclick="PMAutoGen.searchLog()">查询</button><button class="btn btn-secondary btn-sm" onclick="PMAutoGen.resetLogFilter()">重置</button></div>'+
    '</div>'+
    '<div class="table-wrapper" style="margin-top:12px;"><table class="data-table"><thead><tr><th>日志编号</th><th>调度方案</th><th>生成类型</th><th>涉及设备</th><th>生成结果</th><th>失败原因</th><th>操作人</th><th>操作时间</th><th>操作</th></tr></thead>'+
    '<tbody>'+pageData.map(d=>{
      const rs=pmGenStatusOptions.find(o=>o.value===d.result);
      return '<tr>'+
        '<td>'+esc(d.id)+'</td>'+
        '<td style="font-size:12px;">'+esc(d.scheduleName)+'</td>'+
        '<td><span class="badge badge-sm '+(d.genType==='auto'?'badge-blue':'badge-yellow')+'">'+(d.genType==='auto'?'自动':'手动')+'</span></td>'+
        '<td style="font-size:12px;">'+esc(d.eqCode)+' | '+esc(d.eqName)+'</td>'+
        '<td><span class="badge '+(rs?rs.cls:'badge-gray')+'">'+(rs?rs.label:d.result)+'</span></td>'+
        '<td style="font-size:11px;max-width:200px;">'+esc(d.failReason||'-')+'</td>'+
        '<td>'+esc(d.operator||'系统自动')+'</td>'+
        '<td style="font-size:12px;">'+(d.genTime?d.genTime.substring(0,16):(d.planGenTime?d.planGenTime.substring(0,10)+' (计划)':'-'))+'</td>'+
        '<td><div class="table-actions"><button class="btn btn-sm btn-outline" onclick="PMAutoGen.viewLogDetail(\''+d.id+'\')">查看明细</button></div></td></tr>';
    }).join('')+'</tbody></table></div>'+
    '<div class="pagination-bar"><span style="font-size:12px;color:var(--text-secondary);">共 '+total+' 条</span>'+
    '<div style="display:flex;gap:4px;"><button class="pagination-btn" '+(this.page<=1?'disabled':'')+' onclick="PMAutoGen.goLogPage('+(this.page-1)+')">\u2039</button>'+
    '<span style="padding:0 8px;font-size:13px;line-height:30px;">'+this.page+' / '+(totalPages||1)+'</span>'+
    '<button class="pagination-btn" '+(this.page>=totalPages?'disabled':'')+' onclick="PMAutoGen.goLogPage('+(this.page+1)+')">\u203a</button></div></div></div>';
  },

  goLogPage(p){ this.page=Math.max(1,p); this.renderTo(); },
  searchLog(){ this.page=1; this.renderTo(); },
  resetLogFilter(){ this.logFilter={scheduleCode:'',dateRange:'',operator:'',genStatus:''}; this.page=1; this.renderTo(); },

  renderTo(){
    const ca=document.getElementById('contentArea');
    if(ca) ca.innerHTML=this.render();
  },

  // ===== 手动生成弹窗 =====
  manualGen(){
    const schedOpts=pmScheduleData.filter(s=>s.status==='active').map(s=>'<option value="'+s.id+'">'+s.scheduleName+' ('+s.planCode+')</option>').join('');
    const body='<div style="display:flex;flex-direction:column;gap:12px;">'+
      '<div class="form-group"><label>选择调度方案 <span class="req">*</span></label><select id="mgSchedule" style="width:100%;padding:8px;">'+schedOpts+'</select></div>'+
      '<div class="form-group"><label>生成范围</label><select id="mgScope" style="width:100%;padding:8px;"><option value="all">全部设备</option><option value="selected">指定设备</option></select></div>'+
      '<div class="form-group"><label>生成周期</label><select id="mgPeriod" style="width:100%;padding:8px;"><option value="current">本次单次补单</option><option value="backlog">补全往期漏单</option></select></div>'+
      '<div id="mgResult" style="display:none;background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:12px;font-size:13px;"></div>'+
    '</div>';
    showModal('手动批量生成工单',body,[
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'执行生成',cls:'btn-blue',action:function(){
        const sid=document.getElementById('mgSchedule').value;
        const sched=pmScheduleData.find(s=>s.id===sid);
        const resultEl=document.getElementById('mgResult');
        resultEl.style.display='block';
        resultEl.innerHTML='<strong>\u2705 生成完成！</strong><br>成功：1 条工单已生成<br>失败：0 条<br><br><span style="color:var(--primary-lighter);cursor:pointer;">\uD83D\uDCC4 工单编号：PM01-2026-06001</span>';
        setTimeout(function(){closeModal(); PMAutoGen.renderTo();},2500);
      }}
    ]);
  },

  batchReplenish(){ toast('批量补单：正在扫描所有漏单...'); },
  retryGen(id){ toast('重新生成日志 #'+id); },
  triggerGen(id){ toast('触发生成 #'+id); },
  viewOrder(id){ App.navigateTo('maintenance-flow','mf-order','mf-order','维修工单'); },
  viewLogDetail(id){
    const d=pmGenLogData.find(x=>x.id===id); if(!d) return;
    const rs=pmGenStatusOptions.find(o=>o.value===d.result);
    openSidePanel('生成日志详情',d.id,
      '<div style="padding:12px;"><table class="data-table"><thead><tr><th>字段</th><th>内容</th></tr></thead><tbody>'+
        '<tr><td>日志编号</td><td>'+esc(d.id)+'</td></tr>'+
        '<tr><td>调度方案</td><td>'+esc(d.scheduleName)+'</td></tr>'+
        '<tr><td>生成类型</td><td>'+esc(d.genTypeName)+'</td></tr>'+
        '<tr><td>设备</td><td>'+esc(d.eqCode)+' | '+esc(d.eqName)+'</td></tr>'+
        '<tr><td>计划生成时间</td><td>'+esc(d.planGenTime||'-')+'</td></tr>'+
        '<tr><td>实际生成时间</td><td>'+esc(d.actualGenTime||'-')+'</td></tr>'+
        '<tr><td>生成结果</td><td><span class="badge '+(rs?rs.cls:'badge-gray')+'">'+(rs?rs.label:d.result)+'</span></td></tr>'+
        '<tr><td>工单编号</td><td>'+(d.orderCode?esc(d.orderCode):'-')+'</td></tr>'+
        '<tr><td>失败原因</td><td style="color:'+(d.failReason?'var(--danger)':'var(--text-muted)')+';">'+esc(d.failReason||'无')+'</td></tr>'+
        '<tr><td>操作人</td><td>'+esc(d.operator||'系统自动')+'</td></tr>'+
        '<tr><td>操作时间</td><td>'+esc(d.genTime||'-')+'</td></tr>'+
      '</tbody></table></div>');
  },
  exportLog(){ toast('导出日志功能开发中'); },

  init(){}
};