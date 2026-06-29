// ===== 2.2 维修工单 =====
const MfOrder = {
  mode:'list', page:1, pageSize:10,
  filter:{docNo:'',orderType:'',eqInfo:'',location:'',workCenter:'',execStatus:'',planStart:'',planEnd:''},
  formId:'', formMode:'create', formType:'PM02', formTab:'basic',

  render(){
    if(this.mode==='form')return this.renderForm();
    let data=[...mfOrderData];
    const f=this.filter;
    if(f.docNo)data=data.filter(d=>d.docNo.toLowerCase().includes(f.docNo.toLowerCase()));
    if(f.orderType)data=data.filter(d=>d.orderType===f.orderType);
    if(f.eqInfo)data=data.filter(d=>d.eqCode.toLowerCase().includes(f.eqInfo.toLowerCase())||d.eqName.toLowerCase().includes(f.eqInfo.toLowerCase()));
    if(f.location)data=data.filter(d=>d.locationName.includes(f.location));
    if(f.workCenter)data=data.filter(d=>d.workCenterName.includes(f.workCenter));
    if(f.execStatus)data=data.filter(d=>d.orderStatus===f.execStatus);
    const total=data.length,totalPages=Math.ceil(total/this.pageSize),start=(this.page-1)*this.pageSize;
    const pageData=data.slice(start,start+this.pageSize);
    const typeOpts=mfOrderTypeOptions.map(o=>`<option value="${o.value}" ${f.orderType===o.value?'selected':''}>${o.label}</option>`).join('');
    const sOpts=mfOrderStatusOptions.map(o=>`<option value="${o.value}" ${f.execStatus===o.value?'selected':''}>${o.label}</option>`).join('<option value="" '+(!f.execStatus?'selected':'')+'>全部状态</option>');

    return `<div class="page-container"><div class="page-header"><div class="page-title">维修工单</div><div class="page-actions"><button class="btn btn-secondary" onclick="MfOrder.reset()">刷新</button><button class="btn btn-blue" onclick="MfOrder.create()">+ 新增工单</button></div></div>
    <div class="filter-bar">
      <div class="filter-group"><label>工单编号</label><input value="${esc(f.docNo)}" onchange="MfOrder.filter.docNo=this.value;MfOrder.refresh()" placeholder="工单编号"></div>
      <div class="filter-group"><label>类型</label><select onchange="MfOrder.filter.orderType=this.value;MfOrder.refresh()">${typeOpts}</select></div>
      <div class="filter-group"><label>设备</label><input value="${esc(f.eqInfo)}" onchange="MfOrder.filter.eqInfo=this.value;MfOrder.refresh()" placeholder="编码/名称"></div>
      <div class="filter-group"><label>工作中心</label><input value="${esc(f.workCenter)}" onchange="MfOrder.filter.workCenter=this.value;MfOrder.refresh()" placeholder="维修班组"></div>
      <div class="filter-group"><label>状态</label><select onchange="MfOrder.filter.execStatus=this.value;MfOrder.refresh()">${sOpts}</select></div>
      <div class="filter-actions"><button class="btn btn-primary btn-sm" onclick="MfOrder.search()">查询</button><button class="btn btn-secondary btn-sm" onclick="MfOrder.reset()">重置</button></div>
    </div>
    <div class="table-wrapper" style="margin-top:12px;"><table class="data-table">
      <thead><tr><th>工单编号</th><th>类型</th><th>设备</th><th>位置</th><th>关联通知单</th><th>计划时间</th><th>执行状态</th><th>负责人</th><th>操作</th></tr></thead>
      <tbody>${pageData.map(d=>{
        const s=mfOrderStatusOptions.find(o=>o.value===d.orderStatus);
        const typeColors={PM01:'badge-green',PM02:'badge-blue',PM03:'badge-red',PM04:'badge-purple'};
        return `<tr style="${d.orderType==='PM03'?'background:#fef2f2;':''}">
          <td><strong>${esc(d.docNo)}</strong></td>
          <td><span class="badge badge-sm ${typeColors[d.orderType]||'badge-gray'}">${d.orderTypeName}</span></td>
          <td>${esc(d.eqCode)}<br><span style="font-size:11px;color:var(--text-muted);">${esc(d.eqName)}</span></td>
          <td style="font-size:12px;">${esc(d.locationName)}</td>
          <td>${d.sourceNo?`<span style="color:var(--primary-lighter);cursor:pointer;text-decoration:underline;" onclick="MfOrder.viewSource('${d.sourceNo}')">${esc(d.sourceNo)}</span>`:'<span style="color:var(--text-muted);">手动创建</span>'}</td>
          <td style="font-size:12px;">${d.planStart?d.planStart.substring(0,10):'-'}<br>~${d.planEnd?d.planEnd.substring(0,10):'-'}</td>
          <td><span class="badge ${s?s.cls:'badge-gray'}">${s?s.label:d.orderStatus}</span></td>
          <td>${esc(d.assignTo||'-')}</td>
          <td>${this._rowActions(d)}</td>
        </tr>`;
      }).join('')}</tbody>
    </table></div>
    <div class="pagination-bar">${this._renderPagination(total,totalPages)}</div></div>`;
  },

  _rowActions(d){
    return `<div class="table-actions"><button class="btn btn-sm btn-outline" onclick="MfOrder.detail('${d.id}')">详情</button></div>`;
  },

  _renderPagination(total,totalPages){
    return `<span style="font-size:12px;color:var(--text-secondary);">共 ${total} 条 / ${totalPages} 页</span>
    <div style="display:flex;gap:4px;">
      <button class="pagination-btn" ${this.page<=1?'disabled':''} onclick="MfOrder.goPage(${this.page-1})">‹</button>
      <span style="padding:0 8px;font-size:13px;line-height:30px;">${this.page} / ${totalPages||1}</span>
      <button class="pagination-btn" ${this.page>=totalPages?'disabled':''} onclick="MfOrder.goPage(${this.page+1})">›</button>
      <select class="page-size-select" onchange="MfOrder.pageSize=parseInt(this.value);MfOrder.page=1;MfOrder.renderTo()">${[10,20,50].map(n=>`<option ${this.pageSize===n?'selected':''}>${n}条</option>`).join('')}</select>
    </div>`;
  },

  // ========== FORM ==========
  renderForm(){
    const d=this.formMode==='create'?{}:mfOrderData.find(x=>x.id===this.formId)||{};
    const isView=this.formMode==='view';
    const ot=this.formType;
    const orderTypes=[{v:'PM01',l:'预防性工单'},{v:'PM02',l:'故障维修工单'},{v:'PM03',l:'紧急抢修工单'},{v:'PM04',l:'大修改造工单'}];
    const eqD=eqData.find(x=>x.id===d.eqId);

    let html=`<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="padding:10px 20px;background:linear-gradient(135deg,#B45309,#D97706);color:white;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div><div style="font-size:15px;font-weight:700;">${this.formMode==='create'?'新增工单':(isView?'查看工单':'编辑工单')}</div><div style="font-size:12px;opacity:0.7;">编号：${d.docNo||'自动生成'} | ${this.formType}</div></div>
        <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="MfOrder.backToList()">← 返回列表</button>
      </div>
      <div style="background:white;padding:0 20px;border-bottom:2px solid var(--border);display:flex;gap:0;position:sticky;top:0;z-index:5;">
        ${['basic','ops','parts','dispatch','extra'].map(t=>`<div class="form-tab ${this.formTab===t?'active':''}" onclick="MfOrder.switchTab('${t}')">${t==='basic'?'基础信息':t==='ops'?'作业工序':t==='parts'?'所需备件':t==='dispatch'?'派工信息':'附件备注'}</div>`).join('')}
      </div>
      <div style="flex:1;overflow-y:auto;background:var(--bg);">
        <div class="form-container">`;

    if(this.formTab==='basic'){
      html+=`<div class="section-title">基础信息</div>
        <div class="form-grid col-2">
          <div class="form-group"><label>工单编号</label><input value="${d.docNo||'(自动生成)'}" disabled style="background:#f9fafb;"></div>
          <div class="form-group"><label>工单类型 <span class="req">*</span></label><select id="moType" ${isView?'disabled':''} onchange="MfOrder.changeType(this.value)">${orderTypes.map(t=>`<option value="${t.v}" ${ot===t.v?'selected':''}>${t.l}</option>`).join('')}</select></div>
          <div class="form-group"><label>工单标题</label><input id="moTitle" value="${esc(d.title||'')}" ${isView?'disabled':''}></div>
          <div class="form-group"><label>关联来源</label><input value="${d.sourceType==='notification'?'通知单'+esc(d.sourceNo||''):d.sourceType==='schedule'?'策略自动生成':'手动创建'}" disabled style="background:#f9fafb;"></div>
          <div class="form-group"><label>计划开始时间 <span class="req">*</span></label><input type="datetime-local" id="moPlanStart" value="${(d.planStart||'').substring(0,16)}" ${isView?'disabled':''}></div>
          <div class="form-group"><label>计划结束时间 <span class="req">*</span></label><input type="datetime-local" id="moPlanEnd" value="${(d.planEnd||'').substring(0,16)}" ${isView?'disabled':''}></div>
          <div class="form-group"><label>优先级</label><select id="moPriority" ${isView?'disabled':''}><option value="critical" ${d.priority==='critical'?'selected':''}>特急</option><option value="high" ${d.priority==='high'?'selected':''}>高</option><option value="normal" ${d.priority==='normal'?'selected':''}>一般</option></select></div>
          <div class="form-group"><label>设备编码</label><input value="${esc(d.eqCode||eqD?.equipmentCode||'')}" disabled style="background:#f9fafb;"></div>
          <div class="form-group"><label>设备名称</label><input value="${esc(d.eqName||eqD?.equipmentName||'')}" disabled style="background:#f9fafb;"></div>
          <div class="form-group"><label>功能位置</label><input value="${esc(d.locationName||'')}" disabled style="background:#f9fafb;"></div>
          <div class="form-group"><label>工作中心</label><input value="${esc(d.workCenterName||'')}" disabled style="background:#f9fafb;"></div>
          <div class="form-group full"><label>维修简述</label><textarea id="moDesc" rows="2" ${isView?'disabled':''}>${esc(d.desc||'')}</textarea></div>
          <div class="form-group full"><label>合规要求</label><textarea id="moGmpReq" rows="2" ${isView?'disabled':''}>${esc(d.gmpReq||'')}</textarea></div>
        </div>`;
    }

    if(this.formTab==='ops'){
      const ops=d.ops||[];
      html+=`<div class="section-title">作业工序 (${ops.length} 道) ${ot==='PM01'?'<span style="font-size:12px;color:var(--danger);">*预防性工单工序不可删减</span>':''}</div>
        <div style="margin-bottom:12px;display:flex;gap:6px;">${!isView?`<button class="btn btn-sm btn-outline" onclick="MfOrder.addOp()">+ 新增工序</button><button class="btn btn-sm btn-outline">加载标准工序</button>`:''}</div>
        <table class="data-table"><thead><tr><th>序号</th><th>工序内容</th><th>标准工时(h)</th><th>计划工时(h)</th><th>作业要求</th><th>安全提示</th>${!isView?'<th>操作</th>':''}</tr></thead>
        <tbody>${ops.map((o,i)=>`<tr><td>${o.seq}</td><td>${esc(o.content)}</td><td>${o.stdHours}</td><td>${o.planHours}</td><td style="font-size:12px;">${esc(o.require||'')}</td><td style="font-size:12px;color:var(--danger);">${esc(o.safetyTip||'')}</td>${!isView?`<td><button class="btn btn-sm btn-danger-outline" onclick="MfOrder.removeOp(${i})">删除</button></td>`:''}</tr>`).join('')}</tbody></table>`;
    }

    if(this.formTab==='parts'){
      const parts=d.parts||[];
      html+=`<div class="section-title">所需备件 (${parts.length} 项)</div>
        <div style="margin-bottom:12px;display:flex;gap:6px;">${!isView?`<button class="btn btn-sm btn-outline">从BOM导入</button><button class="btn btn-sm btn-outline">+ 手动添加</button>`:''}</div>
        <table class="data-table"><thead><tr><th>物料编码</th><th>名称</th><th>规格</th><th>单位</th><th>计划数量</th><th>实际领用</th><th>库存</th><th>仓库</th></tr></thead>
        <tbody>${parts.map(p=>`<tr><td>${esc(p.matCode)}</td><td>${esc(p.matName)}</td><td>${esc(p.spec)}</td><td>${esc(p.unit)}</td><td>${p.planQty}</td><td>${p.actualQty}</td><td style="color:${p.stock<p.planQty?'var(--danger)':'var(--success)'};">${p.stock}</td><td>${esc(p.warehouse)}</td></tr>`).join('')||'<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:20px;">暂无需备件</td>'}</tbody></table>`;
    }

    if(this.formTab==='dispatch'){
      html+=`<div class="section-title">派工信息</div>
        <div class="form-grid col-2">
          <div class="form-group"><label>派工班组</label><input value="${esc(d.assignTeam||'')}" ${isView?'disabled':''}></div>
          <div class="form-group"><label>执行人</label><input value="${esc(d.assignTo||'')}" ${isView?'disabled':''}></div>
          <div class="form-group"><label>派工时间</label><input value="${esc(d.assignTime||'')}" disabled style="background:#f9fafb;"></div>
          <div class="form-group"><label>计划出勤工时(h)</label><input value="${esc(d.execLog?.actualHours?.normal||'')}" ${isView?'disabled':''}></div>
          <div class="form-group full"><label>派工意见</label><textarea rows="2" ${isView?'disabled':''}>${esc(d.remark||'')}</textarea></div>
        </div>
        ${d.orderStatus==='executing'||d.orderStatus==='acceptance'?`
        <div class="section-title" style="margin-top:16px;">执行记录</div>
        <div class="form-grid col-2">
          <div class="form-group"><label>实际开始时间</label><input value="${esc(d.execLog?.actualStart||d.actualStart||'')}" disabled style="background:#f9fafb;"></div>
          <div class="form-group"><label>实际结束时间</label><input value="${esc(d.execLog?.actualEnd||d.actualEnd||'')}" disabled style="background:#f9fafb;"></div>
          <div class="form-group full"><label>根因分析</label><input value="${esc(d.execLog?.rootCause||'')}" disabled style="background:#f9fafb;"></div>
        </div>
        <div style="margin-top:8px;font-size:12px;">${(d.execLog?.steps||[]).map(s=>`<div style="padding:6px 0;border-bottom:1px solid var(--border);"><strong>${esc(s.step)}：</strong>${esc(s.content)}${s.issue?` <span style="color:var(--danger);">[异常：${esc(s.issue)}→${esc(s.dispose)}]</span>`:''}</div>`).join('')}</div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-secondary);">参与人员：${(d.execLog?.participants||[]).join('、')} | 正常工时：${d.execLog?.actualHours?.normal||0}h 加班：${d.execLog?.actualHours?.overtime||0}h</div>`:''}
        ${d.acceptDate?`
        <div class="section-title" style="margin-top:16px;">验收信息</div>
        <div class="form-grid col-2">
          <div class="form-group"><label>验收人</label><input value="${esc(d.acceptor||'')}" disabled style="background:#f9fafb;"></div>
          <div class="form-group"><label>验收时间</label><input value="${esc(d.acceptDate||'')}" disabled style="background:#f9fafb;"></div>
          <div class="form-group"><label>验收结论</label><input value="${esc(d.acceptResult||'')}" disabled></div>
          <div class="form-group full"><label>验收意见</label><input value="${esc(d.acceptOpinion||'')}" disabled></div>
        </div>`:''}`;
    }

    if(this.formTab==='extra'){
      html+=`<div class="section-title">附件</div>
        <div style="padding:12px;border:1px dashed var(--border);border-radius:6px;">${(d.attachments||[]).length?d.attachments.map(a=>`<div style="padding:2px 0;color:var(--primary-lighter);font-size:12px;">📎 ${esc(a)}</div>`).join(''):'<span style="color:var(--text-muted);font-size:12px;">暂无附件</span>'}</div>
        <div class="section-title" style="margin-top:16px;">备注</div>
        <textarea rows="3" style="width:100%;" ${isView?'disabled':''}>${esc(d.remark||'')}</textarea>
        ${d.settlement?`<div class="section-title" style="margin-top:16px;">结算信息</div>
        <div class="form-grid col-2">
          <div class="form-group"><label>计划工时</label><input value="${d.settlement.planHours}h" disabled></div>
          <div class="form-group"><label>实际工时</label><input value="${d.settlement.actualHours}h" disabled></div>
          <div class="form-group"><label>物料成本</label><input value="¥${(d.settlement.actualMaterialCost||0).toLocaleString()}" disabled></div>
          <div class="form-group"><label>额外费用</label><input value="¥${(d.settlement.extraCost||0).toLocaleString()}" disabled></div>
          <div class="form-group"><label>总成本</label><input value="¥${(d.settlement.totalCost||0).toLocaleString()}" disabled style="font-weight:700;color:var(--danger);"></div>
          <div class="form-group"><label>结算人</label><input value="${esc(d.settlement.settledBy||'')}" disabled></div>
        </div>`:''}
        <div class="section-title" style="margin-top:16px;">操作日志</div>
        <div>${(d.log||[]).map(l=>`<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:12px;display:flex;gap:10px;"><span style="color:var(--text-muted);">${l.time}</span><span style="font-weight:600;">${esc(l.action)}</span><span>${esc(l.user)}</span><span style="color:var(--text-secondary);">${esc(l.detail)}</span></div>`).join('')}</div>`;
    }

    html+=`</div></div>
      <div class="form-bottom-bar" style="background:white;border-top:1px solid var(--border);padding:10px 20px;display:flex;justify-content:space-between;">
        <div>${this._formBtns(d,isView)}</div>
        <div><button class="btn btn-outline btn-sm" onclick="MfOrder.print('${d.id}')">打印</button><button class="btn btn-outline btn-sm" style="margin-left:6px;" onclick="MfOrder.exportDoc('${d.id}')">导出</button></div>
      </div></div>`;
    return html;
  },

  _formBtns(d,isView){
    let b='<button class="btn btn-sm" style="background:#B45309;color:white;" onclick="MfOrder.backToList()">返回列表</button>';
    if(!isView&&!d.id)b=`<button class="btn btn-sm btn-outline" onclick="MfOrder.saveDraft()">保存草稿</button> <button class="btn btn-sm btn-blue" onclick="MfOrder.submit()">下达工单</button>`;
    if(d.orderStatus==='dispatched')b+=` <button class="btn btn-sm btn-green" onclick="MfOrder.startExec('${d.id}')">开始执行</button>`;
    if(d.orderStatus==='executing')b+=` <button class="btn btn-sm btn-purple" onclick="MfOrder.finishExec('${d.id}')">完工报工</button>`;
    if(d.orderStatus==='acceptance')b+=` <button class="btn btn-sm btn-green" onclick="MfOrder.accept('${d.id}')">验收</button>`;
    return b;
  },

  // ========== ACTIONS ==========
  init(){this.renderTo();},
  renderTo(){document.getElementById('contentArea').innerHTML=this.render();},
  search(){this.page=1;this.renderTo();},
  reset(){this.filter={docNo:'',orderType:'',eqInfo:'',location:'',workCenter:'',execStatus:'',planStart:'',planEnd:''};this.page=1;this.renderTo();},
  refresh(){this.renderTo();},
  goPage(p){const tp=Math.ceil(mfOrderData.length/this.pageSize)||1;if(p>=1&&p<=tp){this.page=p;this.renderTo();}},
  switchTab(t){this.formTab=t;this.renderTo();},
  changeType(t){this.formType=t;this.renderTo();},

  create(){this.mode='form';this.formMode='create';this.formType='PM02';this.formId='';this.formTab='basic';this.renderTo();},
  edit(id){this.mode='form';this.formMode='edit';this.formId=id;this.formTab='basic';const d=mfOrderData.find(x=>x.id===id);if(d)this.formType=d.orderType;this.renderTo();},
  detail(id){this.mode='form';this.formMode='view';this.formId=id;this.formTab='basic';const d=mfOrderData.find(x=>x.id===id);if(d)this.formType=d.orderType;this.renderTo();},
  backToList(){this.mode='list';this.formId='';this.renderTo();},

  saveDraft(){
    const id='MO00'+(mfOrderData.length+1).toString().padStart(1,'');
    const now=new Date().toLocaleString('sv-SE').replace('T',' ');
    mfOrderData.unshift({id,docNo:'GD02-2026-0'+Math.floor(Math.random()*1000),orderType:this.formType,orderTypeName:'故障维修工单',sourceType:'manual',sourceNo:'',eqId:'EQ001',eqCode:'EQ-F001-001',eqName:'CNC加工中心',location:'F001-01',locationName:'片剂生产线A压片工位',workCenter:'W001',workCenterName:'维修一班',planStart:'',planEnd:'',actualStart:'',actualEnd:'',priority:'normal',priorityName:'一般',title:'',desc:'',gmpReq:'','orderStatus':'draft','orderStatusName':'草稿',assignTo:'',assignTeam:'',assignTime:'',executor:'','execStatus':'',taskListId:'',ops:[],parts:[],pickedAt:'',execLog:null,acceptDate:'',acceptor:'',acceptResult:'',acceptOpinion:'',settlement:null,closedAt:'',syncedSAP:false,attachments:[],remark:'',createdBy:'当前用户',updatedAt:now,log:[{time:now,action:'创建草稿',user:'当前用户',detail:'创建工单草稿'}]});
    toast('草稿已保存');
    this.formId=id;this.renderTo();
  },

  submit(){const d=mfOrderData.find(x=>x.id===this.formId);if(d){d.orderStatus='released';d.orderStatusName='已下达/待派工';d.log.push({time:new Date().toLocaleString('sv-SE').replace('T',' '),action:'下达',user:'当前用户',detail:'工单已下达'});}toast('工单已下达');this.backToList();},

  dispatch(id){const d=mfOrderData.find(x=>x.id===id);if(d&&(d.orderStatus==='released'||d.orderStatus==='draft')){d.orderStatus='dispatched';d.orderStatusName='已派工';d.assignTime=new Date().toLocaleString('sv-SE').replace('T',' ');d.assignTo=d.assignTo||'张工';d.log.push({time:d.assignTime,action:'派工',user:'管理员',detail:'派工至维修班组'});toast('已派工');}this.renderTo();},

  startExec(id){const d=mfOrderData.find(x=>x.id===id);if(d&&d.orderStatus==='dispatched'){d.orderStatus='executing';d.orderStatusName='执行中';d.actualStart=new Date().toLocaleString('sv-SE').replace('T',' ');d.log.push({time:d.actualStart,action:'开始执行',user:d.assignTo||'维修员',detail:'开始维修作业'});toast('已开始执行');}this.renderTo();},

  finishExec(id){const d=mfOrderData.find(x=>x.id===id);if(d&&d.orderStatus==='executing'){d.orderStatus='acceptance';d.orderStatusName='待验收';d.actualEnd=new Date().toLocaleString('sv-SE').replace('T',' ');d.log.push({time:d.actualEnd,action:'完工报工',user:d.assignTo||'维修员',detail:'维修完成，提交验收'});if(!d.execLog)d.execLog={actualStart:d.actualStart,actualEnd:d.actualEnd,steps:[],photos:[],rootCause:'',actualHours:{normal:2,overtime:0,auxiliary:0},participants:[d.assignTo||'维修员'],workReport:'完工',selfCheck:'合格',remainIssue:''};toast('已完工，待验收');}this.renderTo();},

  accept(id){const d=mfOrderData.find(x=>x.id===id);if(d&&d.orderStatus==='acceptance'){showModal('工单验收 - '+d.docNo,`<div class="form-section"><div class="form-grid"><div class="form-group"><label>验收结论</label><select id="moAccResult"><option value="合格">合格</option><option value="不合格返工">不合格返工</option></select></div><div class="form-group full"><label>验收意见</label><textarea id="moAccOpinion">维修质量符合要求，同意验收。</textarea></div></div></div>`,[{text:'取消',cls:'btn-secondary',action:closeModal},{text:'确认验收',cls:'btn-green',action:()=>{const r=document.getElementById('moAccResult').value;const op=document.getElementById('moAccOpinion').value;if(r==='不合格返工'){d.orderStatus='executing';d.orderStatusName='执行中';toast('已驳回，需返工');}else{d.orderStatus='settlement';d.orderStatusName='待结算';d.acceptDate=new Date().toLocaleString('sv-SE').replace('T',' ');d.acceptor='当前用户';d.acceptResult=r;d.acceptOpinion=op;toast('验收通过，进入结算');}d.log.push({time:new Date().toLocaleString('sv-SE').replace('T',' '),action:'验收',user:'当前用户',detail:r});closeModal();this.renderTo();}}]);}},

  addOp(){const d=mfOrderData.find(x=>x.id===this.formId);if(d){const ops=d.ops||[];ops.push({seq:String(ops.length+1),content:'新工序',stdHours:'1',planHours:'1',require:'',safetyTip:''});d.ops=ops;this.renderTo();}},

  removeOp(i){const d=mfOrderData.find(x=>x.id===this.formId);if(d&&d.ops){d.ops.splice(i,1);this.renderTo();}},

  viewSource(no){toast('跳转至通知单：'+no+'（演示模式，可穿透查询）');},

  print(id){const d=mfOrderData.find(x=>x.id===id)||{};toast('打印工单：'+(d.docNo||'')+'（演示模式）');},
  exportDoc(id){const d=mfOrderData.find(x=>x.id===id)||{};toast('导出工单：'+(d.docNo||'')+'（演示模式，导出PDF/Excel）');}
};
