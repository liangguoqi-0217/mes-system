// ===== 2.3 工单执行（领料/施工/报工）=====
const MfExecution = {
  page:1, pageSize:10,
  filter:{docNo:'',status:'executing'},
  currentOrder:null,currentView:'list',

  render(){
    if(this.currentView==='pick')return this.renderPick();
    if(this.currentView==='exec')return this.renderExec();
    return this.renderList();
  },

  renderList(){
    let data=mfOrderData.filter(d=>d.orderStatus==='dispatched'||d.orderStatus==='executing'||d.orderStatus==='paused');
    const f=this.filter;
    if(f.docNo)data=data.filter(d=>d.docNo.toLowerCase().includes(f.docNo.toLowerCase()));
    const total=data.length;
    const notPicked=data.filter(d=>d.orderStatus==='dispatched').length;
    const executing=data.filter(d=>d.orderStatus==='executing').length;
    const paused=data.filter(d=>d.orderStatus==='paused').length;

    return `<div class="page-container">
      <div class="page-header"><div class="page-title">工单执行工作台</div><div class="page-actions"><button class="btn btn-secondary" onclick="MfExecution.refresh()">刷新</button></div></div>
      <div class="stats-row" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px;">
        <div class="stat-card" style="cursor:pointer;" onclick="MfExecution.filter.status='';MfExecution.refresh()">
          <div class="stat-label">待处理工单</div><div class="stat-value" style="font-size:22px;color:var(--text);">${total}</div></div>
        <div class="stat-card" style="cursor:pointer;border-left:3px solid #F59E0B;" onclick="MfExecution.filter.status='dispatched';MfExecution.refresh()">
          <div class="stat-icon yellow"></div><div><div class="stat-label">待领料</div><div class="stat-value" style="font-size:22px;color:#F59E0B;">${notPicked}</div></div></div>
        <div class="stat-card" style="cursor:pointer;border-left:3px solid #3B82F6;" onclick="MfExecution.filter.status='executing';MfExecution.refresh()">
          <div class="stat-icon blue"></div><div><div class="stat-label">施工中</div><div class="stat-value" style="font-size:22px;color:#3B82F6;">${executing}</div></div></div>
        <div class="stat-card" style="cursor:pointer;border-left:3px solid #6B7280;" onclick="MfExecution.filter.status='paused';MfExecution.refresh()">
          <div class="stat-icon gray"></div><div><div class="stat-label">暂停</div><div class="stat-value" style="font-size:22px;color:#6B7280;">${paused}</div></div></div>
      </div>
      <div class="table-wrapper"><table class="data-table">
        <thead><tr><th>工单编号</th><th>类型</th><th>设备</th><th>计划时间</th><th>当前环节</th><th>负责人</th><th>操作</th></tr></thead>
        <tbody>${data.map(d=>`<tr>
          <td><strong>${esc(d.docNo)}</strong></td>
          <td>${esc(d.orderTypeName)}</td><td>${esc(d.eqName)}<br><span style="font-size:11px;color:var(--text-muted);">${esc(d.eqCode)}</span></td>
          <td style="font-size:12px;">${d.planStart?d.planStart.substring(0,10):'-'}</td>
          <td><span class="badge ${d.orderStatus==='executing'?'badge-blue':'badge-yellow'}">${d.orderStatus==='dispatched'?'待领料':(d.orderStatus==='executing'?'施工中':'暂停')}</span></td>
          <td>${esc(d.assignTo||'-')}</td>
          <td><div class="table-actions">
            ${d.orderStatus==='dispatched'?`<button class="btn btn-sm btn-blue" onclick="MfExecution.goPick('${d.id}')">去领料</button>`:''}
            ${d.orderStatus==='executing'?`<button class="btn btn-sm btn-green" onclick="MfExecution.goExec('${d.id}')">施工报工</button>`:''}
            ${d.orderStatus==='dispatched'?`<button class="btn btn-sm btn-outline" onclick="MfExecution.startDirect('${d.id}')">跳过领料施工</button>`:''}
            <button class="btn btn-sm btn-outline" onclick="MfExecution.viewOrder('${d.id}')">查看工单</button>
          </div></td>
        </tr>`).join('')||'<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">暂无待执行工单</td>'}</tbody>
      </table></div></div>`;
  },

  // ========== PICK PAGE ==========
  renderPick(){
    const d=mfOrderData.find(x=>x.id===this.currentOrder);
    if(!d){this.currentView='list';return this.renderList();}
    const parts=d.parts||[];
    return `<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="padding:10px 20px;background:linear-gradient(135deg,#065F46,#059669);color:white;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div><div style="font-size:15px;font-weight:700;">备件领料 - ${esc(d.docNo)}</div><div style="font-size:12px;opacity:0.7;">${esc(d.eqName)} | ${esc(d.locationName)} | 领料人：${esc(d.assignTo||'-')}</div></div>
        <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="MfExecution.backToList()">← 返回工作台</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:20px;background:var(--bg);">
        <div class="section-title">领料清单 (${parts.length} 项)</div>
        <table class="data-table"><thead><tr><th>物料编码</th><th>名称</th><th>规格</th><th>单位</th><th>计划数量</th><th>实领数量</th><th>库存</th><th>批次号</th><th>仓库</th><th>状态</th></tr></thead>
        <tbody>${parts.map(p=>`<tr>
          <td>${esc(p.matCode)}</td><td>${esc(p.matName)}</td><td>${esc(p.spec)}</td><td>${esc(p.unit)}</td>
          <td style="font-weight:600;">${p.planQty}</td>
          <td><input value="${p.actualQty}" style="width:60px;text-align:center;border:1px solid var(--border);border-radius:4px;padding:4px;" onchange="MfExecution.updatePickQty('${p.matCode}',this.value)"></td>
          <td style="color:${p.stock<p.planQty?'var(--danger)':'var(--success)'};">${p.stock}</td>
          <td><input value="${esc(p.batch||'')}" placeholder="GMP强制" style="width:80px;border:1px solid var(--border);border-radius:4px;padding:4px;font-size:12px;"></td>
          <td>${esc(p.warehouse)}</td>
          <td>${p.actualQty>=p.planQty?'<span style="color:var(--success);">✓ 足额</span>':p.actualQty>0?'<span style="color:var(--warning);">部分领料</span>':'<span style="color:var(--text-muted);">待领</span>'}</td>
        </tr>`).join('')||'<tr><td colspan="10" style="text-align:center;padding:20px;color:var(--text-muted);">该工单无需备件</td>'}</tbody></table>
        <div style="margin-top:12px;font-size:12px;color:var(--text-muted);">* GMP合规要求：关键备件需录入批次号，实现全追溯。</div>
      </div>
      <div class="form-bottom-bar" style="background:white;border-top:1px solid var(--border);padding:10px 20px;display:flex;justify-content:space-between;">
        <div><button class="btn btn-secondary" onclick="MfExecution.backToList()">取消</button></div>
        <div><button class="btn btn-outline btn-sm" onclick="MfExecution.savePick()">保存</button><button class="btn btn-green" style="margin-left:8px;" onclick="MfExecution.confirmPick()">确认领料 & 开始施工</button></div>
      </div></div>`;
  },

  updatePickQty(matCode,val){
    const d=mfOrderData.find(x=>x.id===this.currentOrder);
    if(d){const p=d.parts.find(x=>x.matCode===matCode);if(p){p.actualQty=parseInt(val)||0;this.renderTo();}}
  },

  savePick(){toast('领料信息已保存');},
  confirmPick(){
    const d=mfOrderData.find(x=>x.id===this.currentOrder);
    if(d){d.pickedAt=new Date().toLocaleString('sv-SE').replace('T',' ');d.orderStatus='executing';d.orderStatusName='执行中';d.log.push({time:d.pickedAt,action:'完成领料',user:d.assignTo||'维修员',detail:'备件已领用'});toast('领料确认，开始施工');}
    this.goExec(this.currentOrder);
  },

  // ========== EXEC PAGE ==========
  renderExec(){
    const d=mfOrderData.find(x=>x.id===this.currentOrder);
    if(!d){this.currentView='list';return this.renderList();}
    const ops=d.ops||[];
    const steps=d.execLog?.steps||[];

    return `<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="padding:10px 20px;background:linear-gradient(135deg,#1D4ED8,#3B82F6);color:white;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div><div style="font-size:15px;font-weight:700;">施工 & 报工 - ${esc(d.docNo)}</div><div style="font-size:12px;opacity:0.7;">${esc(d.eqName)} | ${esc(d.locationName)} | 执行人：${esc(d.assignTo||'-')}</div></div>
        <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="MfExecution.backToList()">← 返回工作台</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:20px;background:var(--bg);">
        <div class="section-title">施工过程记录</div>
        <div class="form-grid col-2">
          <div class="form-group"><label>实际开始时间</label><input id="execActualStart" value="${d.actualStart?d.actualStart.substring(0,16):new Date().toISOString().substring(0,16)}" type="datetime-local"></div>
          <div class="form-group"><label>实际结束时间</label><input id="execActualEnd" value="${d.actualEnd?d.actualEnd.substring(0,16):''}" type="datetime-local"></div>
        </div>

        <div style="margin-top:12px;">
          <div style="font-size:13px;font-weight:600;margin-bottom:8px;">分步施工记录 (${ops.length} 道工序)</div>
          ${ops.map((o,i)=>{const st=steps.find(s=>s.step===o.content.substring(0,4))||{};return `
          <div style="background:white;border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:8px;">
            <div style="font-weight:700;font-size:13px;">工序${o.seq}：${esc(o.content)} <span style="color:var(--text-muted);font-size:11px;">计划${o.planHours}h</span></div>
            <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div><label style="font-size:11px;color:var(--text-secondary);">执行情况</label><textarea rows="2" style="width:100%;font-size:12px;" placeholder="填写执行情况">${esc(st.content||'')}</textarea></div>
              <div><label style="font-size:11px;color:var(--text-secondary);">异常问题</label><textarea rows="2" style="width:100%;font-size:12px;" placeholder="异常描述（如有）">${esc(st.issue||'')}</textarea></div>
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">${o.safetyTip?'⚠ 安全提示：'+esc(o.safetyTip):''} ${o.require?'📋 要求：'+esc(o.require):''}</div>
          </div>`}).join('')}
        </div>

        ${d.orderType==='PM02'?`<div class="section-title" style="margin-top:12px;">故障根因分析</div>
        <div class="form-grid col-1"><div class="form-group"><textarea id="execRootCause" rows="2" style="width:100%;" placeholder="分析故障根本原因（故障工单必填）">${esc(d.execLog?.rootCause||'')}</textarea></div></div>`:''}

        <div class="section-title" style="margin-top:12px;">多媒体留证</div>
        <div style="padding:12px;border:1px dashed var(--border);border-radius:6px;text-align:center;font-size:13px;color:var(--text-muted);">
          + 上传施工前后照片/视频（点击上传）<br>${(d.execLog?.photos||[]).map(p=>`<span style="color:var(--primary-lighter);">📷 ${esc(p)}</span> `).join('')}
        </div>

        <div class="section-title" style="margin-top:12px;">工时报工</div>
        <div class="form-grid col-3">
          <div class="form-group"><label>正常作业工时(h)</label><input id="execNormalHours" value="${d.execLog?.actualHours?.normal||0}" style="text-align:center;"></div>
          <div class="form-group"><label>加班工时(h)</label><input id="execOvertime" value="${d.execLog?.actualHours?.overtime||0}" style="text-align:center;"></div>
          <div class="form-group"><label>辅助工时(h)</label><input id="execAuxHours" value="${d.execLog?.actualHours?.auxiliary||0}" style="text-align:center;"></div>
          <div class="form-group full"><label>参与人员 & 工时分摊</label><input id="execParticipants" value="${(d.execLog?.participants||[]).join('、')}" placeholder="例：张工(3h)、李工(1.5h)"></div>
          <div class="form-group full"><label>工时说明</label><textarea id="execHoursRemark" rows="2">${esc(d.execLog?.workReport||'')}</textarea></div>
        </div>

        <div class="section-title" style="margin-top:12px;">完工确认</div>
        <div class="form-grid col-2">
          <div class="form-group"><label>自检结果</label><select id="execSelfCheck"><option value="合格">合格</option><option value="需复检">需复检</option></select></div>
          <div class="form-group full"><label>遗留问题</label><input id="execRemainIssue" value="${esc(d.execLog?.remainIssue||'')}" placeholder="记录遗留问题（如有）"></div>
        </div>
      </div>
      <div class="form-bottom-bar" style="background:white;border-top:1px solid var(--border);padding:10px 20px;display:flex;justify-content:space-between;">
        <div><button class="btn btn-secondary" onclick="MfExecution.backToList()">取消</button> <button class="btn btn-outline btn-sm" onclick="MfExecution.saveProgress()">保存进度</button></div>
        <div><button class="btn btn-purple btn-lg" onclick="MfExecution.submitFinish()">提交完工</button></div>
      </div></div>`;
  },

  // ========== ACTIONS ==========
  init(){this.renderTo();},
  renderTo(){document.getElementById('contentArea').innerHTML=this.render();},
  refresh(){this.renderTo();},

  goPick(id){this.currentOrder=id;this.currentView='pick';this.renderTo();},
  goExec(id){this.currentOrder=id;this.currentView='exec';this.renderTo();},
  backToList(){this.currentView='list';this.currentOrder=null;this.renderTo();},

  startDirect(id){
    const d=mfOrderData.find(x=>x.id===id);
    if(d){d.orderStatus='executing';d.orderStatusName='执行中';d.actualStart=new Date().toLocaleString('sv-SE').replace('T',' ');d.log.push({time:d.actualStart,action:'开始施工(跳过领料)',user:d.assignTo||'维修员',detail:'无备件需求，直接施工'});toast('已开始施工');}
    this.renderTo();
  },

  saveProgress(){toast('进度已保存');},

  submitFinish(){
    const d=mfOrderData.find(x=>x.id===this.currentOrder);
    if(!d)return;
    const now=new Date().toLocaleString('sv-SE').replace('T',' ');
    d.orderStatus='acceptance';d.orderStatusName='待验收';
    d.actualEnd=document.getElementById('execActualEnd')?.value?.replace('T',' ')+':00'||now;
    d.execLog={actualStart:d.actualStart||now,actualEnd:d.actualEnd,steps:[],photos:[],rootCause:document.getElementById('execRootCause')?.value||'',actualHours:{normal:parseFloat(document.getElementById('execNormalHours')?.value)||0,overtime:parseFloat(document.getElementById('execOvertime')?.value)||0,auxiliary:parseFloat(document.getElementById('execAuxHours')?.value)||0},participants:(document.getElementById('execParticipants')?.value||'').split('、').filter(Boolean),workReport:document.getElementById('execHoursRemark')?.value||'',selfCheck:document.getElementById('execSelfCheck')?.value||'合格',remainIssue:document.getElementById('execRemainIssue')?.value||''};
    d.log.push({time:now,action:'完工报工',user:d.assignTo||'维修员',detail:'提交完工，流转至验收'});
    toast('完工已提交，工单已流转至待验收');
    this.backToList();
  },

  viewOrder(id){const d=mfOrderData.find(x=>x.id===id);if(d){toast('查看工单：'+d.docNo+'（跳转到工单详情页）');}}
};
