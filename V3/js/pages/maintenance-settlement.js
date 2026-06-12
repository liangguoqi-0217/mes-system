// ===== 2.4 工单结算 & 关闭 =====
const MfSettlement = {
  page:1, pageSize:10,
  filter:{docNo:'',orderType:'',eqInfo:''},
  currentId:'', currentView:'list',

  render(){
    if(this.currentView==='detail')return this.renderDetail();
    let data=mfOrderData.filter(d=>d.orderStatus==='settlement'||d.orderStatus==='closed'||d.orderStatus==='acceptance');
    const f=this.filter;
    if(f.docNo)data=data.filter(d=>d.docNo.toLowerCase().includes(f.docNo.toLowerCase()));
    if(f.orderType)data=data.filter(d=>d.orderType===f.orderType);
    if(f.eqInfo)data=data.filter(d=>d.eqCode.toLowerCase().includes(f.eqInfo.toLowerCase())||d.eqName.toLowerCase().includes(f.eqInfo.toLowerCase()));
    const total=data.length,totalPages=Math.ceil(total/this.pageSize),start=(this.page-1)*this.pageSize;
    const pageData=data.slice(start,start+this.pageSize);
    const typeOpts=mfOrderTypeOptions.map(o=>`<option value="${o.value}" ${f.orderType===o.value?'selected':''}>${o.label}</option>`).join('');

    return `<div class="page-container">
      <div class="page-header"><div class="page-title">工单结算 & 关闭</div><div class="page-actions"><button class="btn btn-secondary" onclick="MfSettlement.refresh()">刷新</button><button class="btn btn-outline btn-sm" onclick="MfSettlement.exportReport()">导出结算报表</button></div></div>
      <div class="filter-bar">
        <div class="filter-group"><label>工单编号</label><input value="${esc(f.docNo)}" onchange="MfSettlement.filter.docNo=this.value;MfSettlement.refresh()"></div>
        <div class="filter-group"><label>类型</label><select onchange="MfSettlement.filter.orderType=this.value;MfSettlement.refresh()">${typeOpts}</select></div>
        <div class="filter-group"><label>设备</label><input value="${esc(f.eqInfo)}" onchange="MfSettlement.filter.eqInfo=this.value;MfSettlement.refresh()"></div>
        <div class="filter-actions"><button class="btn btn-primary btn-sm" onclick="MfSettlement.search()">查询</button><button class="btn btn-secondary btn-sm" onclick="MfSettlement.reset()">重置</button></div>
      </div>
      <div class="table-wrapper" style="margin-top:12px;"><table class="data-table">
        <thead><tr><th>工单编号</th><th>类型</th><th>设备</th><th>完工时间</th><th>验收</th><th>计划/实际工时</th><th>计划/实际用料</th><th>总成本</th><th>结算状态</th><th>操作</th></tr></thead>
        <tbody>${pageData.map(d=>{
          const s=d.settlement||{};
          return `<tr>
            <td><strong>${esc(d.docNo)}</strong></td>
            <td><span class="badge badge-sm ${d.orderType==='PM03'?'badge-red':'badge-blue'}">${d.orderTypeName}</span></td>
            <td>${esc(d.eqName)}</td>
            <td style="font-size:12px;">${d.actualEnd?d.actualEnd.substring(0,10):'-'}</td>
            <td><span class="badge badge-sm ${d.acceptResult==='合格'?'badge-green':'badge-yellow'}">${d.acceptResult||'待验收'}</span></td>
            <td style="font-size:12px;">${s.planHours||'-'}h / ${s.actualHours||'-'}h</td>
            <td style="font-size:12px;">¥${(s.planMaterialCost||0).toLocaleString()} / ¥${(s.actualMaterialCost||0).toLocaleString()}</td>
            <td style="font-weight:700;color:${(s.totalCost||0)>500?'var(--danger)':'var(--text)'};">¥${(s.totalCost||0).toLocaleString()}</td>
            <td><span class="badge ${d.orderStatus==='settlement'?'badge-yellow':'badge-green'}">${d.orderStatus==='settlement'?'待结算':'已关闭'}</span></td>
            <td>${this._rowActions(d)}</td>
          </tr>`;
        }).join('')||'<tr><td colspan="10" style="text-align:center;padding:40px;color:var(--text-muted);">暂无待结算工单</td>'}</tbody>
      </table></div>
      <div class="pagination-bar">${this._renderPagination(total,totalPages)}</div></div>`;
  },

  _rowActions(d){
    let btns=`<button class="btn btn-sm btn-outline" onclick="MfSettlement.viewDetail('${d.id}')">查看</button>`;
    if(d.orderStatus==='settlement')btns+=` <button class="btn btn-sm btn-green" onclick="MfSettlement.settle('${d.id}')">结算</button>`;
    if(d.orderStatus==='acceptance')btns+=` <button class="btn btn-sm btn-blue" onclick="MfSettlement.acceptAndSettle('${d.id}')">验收&结算</button>`;
    return `<div class="table-actions">${btns}</div>`;
  },

  _renderPagination(total,totalPages){
    return `<span style="font-size:12px;color:var(--text-secondary);">共 ${total} 条 / ${totalPages} 页</span>
    <div style="display:flex;gap:4px;">
      <button class="pagination-btn" ${this.page<=1?'disabled':''} onclick="MfSettlement.goPage(${this.page-1})">‹</button>
      <span style="padding:0 8px;font-size:13px;line-height:30px;">${this.page} / ${totalPages||1}</span>
      <button class="pagination-btn" ${this.page>=totalPages?'disabled':''} onclick="MfSettlement.goPage(${this.page+1})">›</button>
    </div>`;
  },

  // ========== SETTLEMENT DETAIL ==========
  renderDetail(){
    const d=mfOrderData.find(x=>x.id===this.currentId);
    if(!d){this.currentView='list';return this.render();}
    const s=d.settlement||{};
    const isClosed=d.orderStatus==='closed';

    return `<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="padding:10px 20px;background:linear-gradient(135deg,#7C3AED,#8B5CF6);color:white;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div><div style="font-size:15px;font-weight:700;">工单结算详情 - ${esc(d.docNo)}</div><div style="font-size:12px;opacity:0.7;">${esc(d.eqName)} | ${d.orderStatus==='closed'?'已关闭归档':'待结算'}</div></div>
        <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="MfSettlement.backToList()">← 返回列表</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:20px;background:var(--bg);">

        <\x2d\x2d 验收信息 -->
        <div class="section-title">完工验收</div>
        <div class="form-grid col-2">
          <div class="form-group"><label>验收人</label><input value="${esc(d.acceptor||'-')}" disabled></div>
          <div class="form-group"><label>验收时间</label><input value="${esc(d.acceptDate||'-')}" disabled></div>
          <div class="form-group"><label>验收结论</label><input value="${esc(d.acceptResult||'-')}" disabled style="font-weight:700;color:${d.acceptResult==='合格'?'var(--success)':'var(--danger)'};"></div>
          <div class="form-group full"><label>验收意见</label><textarea disabled rows="2">${esc(d.acceptOpinion||'-')}</textarea></div>
        </div>

        <\x2d\x2d 工时对比 -->
        <div class="section-title" style="margin-top:16px;">工时差异对比</div>
        <table class="data-table"><thead><tr><th>指标</th><th>标准工时</th><th>计划工时</th><th>实际工时</th><th>差异</th><th>差异原因</th></tr></thead>
        <tbody><tr>
          <td>作业工时 (h)</td>
          <td>${(d.ops||[]).reduce((a,o)=>a+parseFloat(o.stdHours||0),0)}</td>
          <td>${s.planHours||'-'}</td>
          <td>${s.actualHours||'-'}</td>
          <td style="color:${(s.hourDiff||0)>0?'var(--danger)':'var(--success)'};">${(s.hourDiff||0)>0?'+'+s.hourDiff:s.hourDiff||0}h</td>
          <td style="font-size:12px;">${esc(s.hourDiffReason||'-')}</td>
        </tr></tbody></table>

        <\x2d\x2d 物料消耗对比 -->
        <div class="section-title" style="margin-top:16px;">物料消耗对比</div>
        <table class="data-table"><thead><tr><th>物料编码</th><th>名称</th><th>计划领用</th><th>实领数量</th><th>退料</th><th>实际消耗</th><th>差异</th></tr></thead>
        <tbody>${(d.parts||[]).map(p=>`<tr>
          <td>${esc(p.matCode)}</td><td>${esc(p.matName)}</td><td>${p.planQty} ${p.unit}</td><td>${p.actualQty} ${p.unit}</td>
          <td>${Math.max(0,p.actualQty-p.planQty)}</td><td>${p.actualQty}</td>
          <td style="color:${p.actualQty>p.planQty?'var(--danger)':p.actualQty<p.planQty?'var(--success)':'var(--text)'};">${p.actualQty-p.planQty>0?'+':''}${p.actualQty-p.planQty}</td>
        </tr>`).join('')||'<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">无物料消耗</td>'}</tbody></table>
        <div class="form-grid col-2" style="margin-top:12px;">
          <div class="form-group"><label>计划物料费(¥)</label><input value="${(s.planMaterialCost||0).toLocaleString()}" disabled></div>
          <div class="form-group"><label>实际物料费(¥)</label><input value="${(s.actualMaterialCost||0).toLocaleString()}" disabled></div>
          <div class="form-group full"><label>物料差异说明</label><input value="${esc(s.materialDiffReason||'-')}" disabled></div>
        </div>

        <\x2d\x2d 额外费用 -->
        <div class="section-title" style="margin-top:16px;">额外费用</div>
        <div class="form-grid col-2">
          <div class="form-group"><label>外委服务费(¥)</label><input id="settleExtra" value="${s.extraCost||0}" ${isClosed?'disabled':''}></div>
          <div class="form-group"><label>费用说明</label><input id="settleExtraDesc" value="${esc(s.extraCostDesc||'')}" ${isClosed?'disabled':''}></div>
          <div class="form-group"><label>成本科目</label><input value="${esc(s.costSubject||'维修费')}" ${isClosed?'disabled':''} id="settleCostSubject"></div>
        </div>

        <\x2d\x2d 结算结论 -->
        <div style="margin-top:16px;padding:16px;border:2px solid ${isClosed?'var(--success)':'var(--warning)'};border-radius:8px;background:${isClosed?'#f0fdf4':'#fffbeb'};">
          <div style="font-size:15px;font-weight:700;color:${isClosed?'var(--success)':'var(--warning)'};">${isClosed?'✅ 已结算关闭':'⏳ 待结算'}</div>
          <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;">
            <div>备件费: <strong>¥${(s.actualMaterialCost||0).toLocaleString()}</strong></div>
            <div>人工费: <strong>¥${((s.actualHours||0)*80).toLocaleString()}</strong> <span style="font-size:11px;color:var(--text-muted);">(¥80/h)</span></div>
            <div>额外费: <strong>¥${(s.extraCost||0).toLocaleString()}</strong></div>
            <div>总成本: <strong style="font-size:16px;color:var(--danger);">¥${(s.totalCost||0).toLocaleString()}</strong></div>
          </div>
          ${s.settlementTime?`<div style="margin-top:8px;font-size:12px;color:var(--text-muted);">结算时间：${s.settlementTime} | 结算人：${esc(s.settledBy)}</div>`:''}
        </div>

        <\x2d\x2d 操作日志 -->
        <div class="section-title" style="margin-top:16px;">操作日志</div>
        <div>${(d.log||[]).map(l=>`<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:12px;display:flex;gap:10px;"><span style="color:var(--text-muted);">${l.time}</span><span style="font-weight:600;">${esc(l.action)}</span><span>${esc(l.user)}</span><span style="color:var(--text-secondary);">${esc(l.detail)}</span></div>`).join('')}</div>

      </div>
      <div class="form-bottom-bar" style="background:white;border-top:1px solid var(--border);padding:10px 20px;display:flex;justify-content:space-between;">
        <div><button class="btn btn-secondary" onclick="MfSettlement.backToList()">返回</button></div>
        <div>
          ${!isClosed?`<button class="btn btn-purple" onclick="MfSettlement.settleFromDetail()">结算确认</button>
          <button class="btn btn-green" style="margin-left:8px;" onclick="MfSettlement.closeOrder()">结算并关闭工单</button>`:''}
          ${isClosed?`<button class="btn btn-outline btn-sm" onclick="MfSettlement.print(${d.id})">打印</button>
          <button class="btn btn-outline btn-sm" style="margin-left:6px;" onclick="MfSettlement.exportReport()">导出</button>`:''}
        </div>
      </div></div>`;
  },

  // ========== ACTIONS ==========
  init(){this.renderTo();},
  renderTo(){document.getElementById('contentArea').innerHTML=this.render();},
  search(){this.page=1;this.renderTo();},
  reset(){this.filter={docNo:'',orderType:'',eqInfo:''};this.page=1;this.renderTo();},
  refresh(){this.renderTo();},
  goPage(p){const tp=Math.ceil(mfOrderData.filter(d=>d.orderStatus==='settlement'||d.orderStatus==='closed').length/this.pageSize)||1;if(p>=1&&p<=tp){this.page=p;this.renderTo();}},

  viewDetail(id){this.currentId=id;this.currentView='detail';this.renderTo();},
  backToList(){this.currentView='list';this.currentId='';this.renderTo();},

  acceptAndSettle(id){
    const d=mfOrderData.find(x=>x.id===id);
    if(d){d.orderStatus='settlement';d.orderStatusName='待结算';d.acceptDate=new Date().toLocaleString('sv-SE').replace('T',' ');d.acceptor='当前用户';d.acceptResult='合格';d.acceptOpinion='验收通过';d.log.push({time:d.acceptDate,action:'验收',user:'当前用户',detail:'验收合格'});toast('验收完成，进入结算');}
    this.renderTo();
  },

  settle(id){
    const d=mfOrderData.find(x=>x.id===id||this.currentId);
    if(!d)return;
    const now=new Date().toLocaleString('sv-SE').replace('T',' ');
    const matCost=(d.parts||[]).reduce((a,p)=>a+p.actualQty*30,0);
    const labCost=((d.execLog?.actualHours?.normal||0)+(d.execLog?.actualHours?.overtime||0))*80;
    d.settlement={stdHours:(d.ops||[]).reduce((a,o)=>a+parseFloat(o.stdHours||0),0),planHours:d.settlement?.planHours||0,actualHours:d.settlement?.actualHours||d.execLog?.actualHours?.normal||0,hourDiff:d.settlement?.hourDiff||0,hourDiffReason:d.settlement?.hourDiffReason||'',planMaterialCost:d.settlement?.planMaterialCost||0,actualMaterialCost:matCost,materialDiff:matCost-(d.settlement?.planMaterialCost||0),materialDiffReason:d.settlement?.materialDiffReason||'',extraCost:parseFloat(document.getElementById('settleExtra')?.value)||0,extraCostDesc:document.getElementById('settleExtraDesc')?.value||'',totalCost:matCost+labCost+(parseFloat(document.getElementById('settleExtra')?.value)||0),costSubject:document.getElementById('settleCostSubject')?.value||'维修费',settlementTime:now,settledBy:'马会计'};
    d.log.push({time:now,action:'结算',user:'马会计',detail:'财务结算完成，总成本¥'+d.settlement.totalCost.toLocaleString()});
    toast('结算完成');
    this.renderTo();
  },

  closeOrder(){
    const d=mfOrderData.find(x=>x.id===this.currentId);
    if(!d)return;
    if(d.orderStatus!=='settlement'){this.settle(this.currentId);}
    d.orderStatus='closed';d.orderStatusName='已关闭';
    d.closedAt=new Date().toLocaleString('sv-SE').replace('T',' ');
    d.syncedSAP=true;
    d.log.push({time:d.closedAt,action:'关闭',user:'管理员',detail:'工单关闭归档，同步SAP完成'});
    toast('工单已关闭，归档至设备档案');
    this.backToList();
  },

  settleFromDetail(){this.settle(this.currentId);},

  print(id){const d=mfOrderData.find(x=>x.id===id)||{};toast('打印结算单：'+(d.docNo||'')+'（演示模式）');},
  exportReport(){toast('导出结算报表（演示模式，导出结算数据汇总为Excel）');}
};
