// ===== 4.3 设备改造/升级 =====
const EquipmentRetrofit = {
  mode:'list', page:1, pageSize:10, filtered:[], formId:null, formData:null, formTab:'tab1',

  // ===== 主渲染入口 =====
  render() {
    if (this.mode==='form'||this.mode==='detail') return this.renderForm();
    return this.renderList();
  },
  init() {
    if (this.mode==='form'||this.mode==='detail') { this.renderFormInit(); return; }
    this.filtered=[...eqRetrofitData]; this.page=1; this.renderTable();
  },

  // ===== 1. 列表页 =====
  renderList() {
    return `<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="padding:10px 20px;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;flex-shrink:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div><div style="font-size:15px;font-weight:700;">设备改造 / 升级项目管理</div><div style="font-size:12px;opacity:0.7;">技术改造 · 部件升级 · 性能优化 · GMP合规改造</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="EquipmentRetrofit.exportAll()">导出</button>
            <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;" onclick="EquipmentRetrofit.newDoc()">+ 新增改造项目</button>
          </div>
        </div>
      </div>
      <div class="filter-bar" style="flex-shrink:0;">
        <div class="filter-group"><label>项目编号</label><input type="text" id="rfDocNo" placeholder="模糊查询"></div>
        <div class="filter-group"><label>设备信息</label><input type="text" id="rfEqInfo" placeholder="编码/名称"></div>
        <div class="filter-group"><label>改造类型</label><select id="rfRetrofitType">${eqRetrofitTypeOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>项目状态</label><select id="rfStatus">${eqRetrofitStatusOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>负责人</label><input type="text" id="rfLeader" placeholder="模糊查询"></div>
        <div class="filter-actions"><button class="btn btn-primary btn-sm" onclick="EquipmentRetrofit.search()">查询</button><button class="btn btn-outline btn-sm" onclick="EquipmentRetrofit.reset()">重置</button></div>
      </div>
      <div class="table-wrapper" style="flex:1;"><table class="data-table"><thead><tr>
        <th>项目编号</th><th>设备信息</th><th>改造类型</th><th>立项日期</th><th>状态</th><th>负责人</th><th>操作</th>
      </tr></thead><tbody id="rfTableBody"></tbody></table></div>
      <div class="list-toolbar" style="flex-shrink:0;">
        <div class="list-info"><span class="list-count" id="rfCount">共 ${this.filtered.length} 条</span></div>
        <div class="pagination">
          <button class="pagination-btn" id="rfPrev" disabled onclick="EquipmentRetrofit.prevPage()">‹</button>
          <span class="pagination-info" id="rfPageInfo">第 1 / ${Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)} 页</span>
          <button class="pagination-btn" id="rfNext" onclick="EquipmentRetrofit.nextPage()">›</button>
          <select class="page-size-select" id="rfPageSizeSel" onchange="EquipmentRetrofit.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
        </div>
      </div>
    </div>`;
  },
  renderTable() {
    const start=(this.page-1)*this.pageSize;
    const page=this.filtered.slice(start,start+this.pageSize);
    const totalPages=Math.ceil(this.filtered.length/this.pageSize)||1;
    document.getElementById('rfCount').textContent=`共 ${this.filtered.length} 条`;
    document.getElementById('rfPageInfo').textContent=`第 ${this.page} / ${totalPages} 页`;
    document.getElementById('rfPrev').disabled=this.page<=1;
    document.getElementById('rfNext').disabled=this.page>=totalPages;
    document.getElementById('rfPageSizeSel').value=this.pageSize;
    document.getElementById('rfTableBody').innerHTML=page.map(d=>{
      const s=eqRetrofitStatusOptions.find(o=>o.value===d.projStatus);
      const t=eqRetrofitTypeOptions.find(o=>o.value===d.retrofitType);
      return `<tr>
        <td><strong style="color:var(--primary);">${esc(d.docNo)}</strong></td>
        <td>${esc(d.equipmentInfo)}</td>
        <td>${t?t.label:d.retrofitTypeName}</td>
        <td>${esc(d.createdAt||'-')}</td>
        <td><span class="badge ${s?s.cls:'badge-gray'}">${s?s.label:d.projStatusName}</span></td>
        <td>${esc(d.leader||'-')}</td>
        <td class="table-actions">
          <button class="btn btn-sm btn-outline" onclick="EquipmentRetrofit.viewDetail('${d.id}')">查看</button>
        </td>
      </tr>`;
    }).join('');
  },
  search() {
    const docNo=(document.getElementById('rfDocNo')?.value||'').toLowerCase();
    const eqInfo=(document.getElementById('rfEqInfo')?.value||'').toLowerCase();
    const type=document.getElementById('rfRetrofitType')?.value||'';
    const status=document.getElementById('rfStatus')?.value||'';
    const leader=(document.getElementById('rfLeader')?.value||'').toLowerCase();
    this.filtered=eqRetrofitData.filter(d=>
      (!docNo||d.docNo.toLowerCase().includes(docNo)) &&
      (!eqInfo||d.equipmentInfo.toLowerCase().includes(eqInfo)) &&
      (!type||d.retrofitType===type) &&
      (!status||d.projStatus===status) &&
      (!leader||d.leader.toLowerCase().includes(leader))
    );
    this.page=1; this.renderTable();
  },
  reset() { ['rfDocNo','rfEqInfo','rfRetrofitType','rfStatus','rfLeader'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; }); this.filtered=[...eqRetrofitData]; this.page=1; this.renderTable(); },
  prevPage(){ if(this.page>1){this.page--;this.renderTable();} },
  nextPage(){ if(this.page<Math.ceil(this.filtered.length/this.pageSize)){this.page++;this.renderTable();} },
  changePageSize(){ this.pageSize=parseInt(document.getElementById('rfPageSizeSel').value); this.page=1; this.renderTable(); },
  newDoc(){ this.formId=null; this.formData=null; this.formTab='tab1'; this.mode='form'; this.render(); this.renderFormInit(); },
  viewDetail(id){ const d=eqRetrofitData.find(x=>x.id===id); if(!d)return; this.formId=id; this.formData={...d}; this.formTab='tab1'; this.mode='detail'; this.render(); this.renderFormInit(); },
  editDoc(id){ const d=eqRetrofitData.find(x=>x.id===id); if(!d||d.projStatus!=='draft')return; this.formId=id; this.formData={...d}; this.formTab='tab1'; this.mode='form'; this.render(); this.renderFormInit(); },
  exportAll(){ alert('批量导出功能已触发（模拟）'); },

  submitApproval(id) {
    const d=eqRetrofitData.find(x=>x.id===id); if(!d)return;
    d.projStatus='pending_approval'; d.projStatusName='待立项审批';
    d.log.push({time:new Date().toISOString().replace('T',' ').substring(0,19),action:'提交审批',user:d.leader,detail:'提交改造项目立项审批'});
    alert('已提交立项审批！'); this.init();
  },
  withdraw(id) {
    const d=eqRetrofitData.find(x=>x.id===id); if(!d)return;
    if(confirm('确定要撤回该项目吗？')){ d.projStatus='draft'; d.projStatusName='草稿'; d.log.push({time:new Date().toISOString().replace('T',' ').substring(0,19),action:'撤回',user:d.leader,detail:'撤回审批申请'}); alert('已撤回'); this.init(); }
  },
  approve(id) {
    const d=eqRetrofitData.find(x=>x.id===id); if(!d)return;
    if(confirm('确认审批通过该项目立项吗？')){ d.projStatus='pending_approval'; d.projStatusName='待立项审批'; d.log.push({time:new Date().toISOString().replace('T',' ').substring(0,19),action:'审批通过',user:'孙部长',detail:'同意立项'}); alert('已审批通过'); this.init(); }
  },
  startConstruction(id) {
    const d=eqRetrofitData.find(x=>x.id===id); if(!d)return;
    if(confirm('确认开始施工吗？施工时间将自动记录当前时间。')){ d.projStatus='construction'; d.projStatusName='施工中'; d.constructionStart=new Date().toISOString().replace('T',' ').substring(0,10); d.log.push({time:new Date().toISOString().replace('T',' ').substring(0,19),action:'开始施工',user:d.leader,detail:'项目正式进入施工阶段'}); alert('已开始施工'); this.init(); }
  },
  submitAcceptance(id) {
    const d=eqRetrofitData.find(x=>x.id===id); if(!d)return;
    d.projStatus='acceptance'; d.projStatusName='待验收';
    d.constructionEnd=new Date().toISOString().replace('T',' ').substring(0,10);
    d.log.push({time:new Date().toISOString().replace('T',' ').substring(0,19),action:'提交验收',user:d.leader,detail:'施工完成，提交验收'});
    alert('已提交验收！'); this.init();
  },
  accept(id) {
    const d=eqRetrofitData.find(x=>x.id===id); if(!d)return;
    if(confirm('确认验收完成？设备档案将自动更新。')){ d.projStatus='completed'; d.projStatusName='已完成'; d.acceptDate=new Date().toISOString().replace('T',' ').substring(0,10); d.log.push({time:new Date().toISOString().replace('T',' ').substring(0,19),action:'验收通过',user:d.acceptor||'联合验收组',detail:'联合验收合格，项目完成'}); alert('验收完成！设备档案已更新。'); this.init(); }
  },

  // ===== 2. 单据页（4标签） =====
  renderForm() {
    const d=this.formData||{};
    const isDetail=this.mode==='detail';
    const disabled=isDetail?'disabled':'';
    const readonly=isDetail?'readonly':'';
    return `<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="padding:10px 20px;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;flex-shrink:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:16px;">
            <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="EquipmentRetrofit.backToList()">← 返回列表</button>
            <div><div style="font-size:15px;font-weight:700;">${isDetail?'改造项目详情':'新建改造项目'}</div><div style="font-size:12px;opacity:0.7;">${esc(d.docNo||'新项目')} | ${esc(d.equipmentInfo||'-')}</div></div>
          </div>
          <div style="display:flex;gap:6px;">
            <span class="badge badge-sm" style="background:rgba(255,255,255,0.2);">${isDetail?'只读':'编辑模式'}</span>
          </div>
        </div>
      </div>
      <\x2d\x2d 标签栏 -->
      <div style="flex-shrink:0;display:flex;border-bottom:2px solid var(--border);background:white;">
        ${[{id:'tab1',label:'① 立项 & 基础信息'},{id:'tab2',label:'② 改造方案 & 施工信息'},{id:'tab3',label:'③ 验收信息'},{id:'tab4',label:'④ 档案变更 & 附件'}].map(t=>`
          <div class="form-tab ${this.formTab===t.id?'active':''}" onclick="EquipmentRetrofit.switchTab('${t.id}')">${t.label}</div>
        `).join('')}
      </div>
      <\x2d\x2d 标签内容 -->
      <div style="flex:1;overflow-y:auto;">
        <div class="form-container" id="rfTabContent"></div>
      </div>
      <\x2d\x2d 底部操作栏 -->
      <div class="form-bottom-bar" style="flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:white;border-top:1px solid var(--border);">
        <div style="display:flex;gap:8px;">
          ${!isDetail?`<button class="btn btn-outline btn-sm" onclick="EquipmentRetrofit.saveDraft()">保存草稿</button>`:''}
          ${!isDetail&&this.formId?`<button class="btn btn-blue btn-sm" onclick="EquipmentRetrofit.submitFromForm()">提交立项审批</button>`:''}
          ${!isDetail?`<button class="btn btn-danger-outline btn-sm" onclick="EquipmentRetrofit.withdrawFromForm()">撤回</button>`:''}
          <button class="btn btn-outline btn-sm" onclick="EquipmentRetrofit.print()">打印</button>
          <button class="btn btn-outline btn-sm" onclick="EquipmentRetrofit.exportDoc()">导出</button>
        </div>
        <div><button class="btn btn-sm" style="background:var(--primary);color:white;" onclick="EquipmentRetrofit.backToList()">完成 / 返回</button></div>
      </div>
    </div>`;
  },
  renderFormInit(){
    const d=this.formData||{};
    const isDetail=this.mode==='detail';
    this.renderTabContent(d,isDetail);
  },
  switchTab(tabId){ this.formTab=tabId; const d=this.formData||{}; const isDetail=this.mode==='detail'; this.renderTabContent(d,isDetail); },
  backToList(){ this.mode='list'; this.formId=null; this.formData=null; this.render(); this.init(); },
  saveDraft(){ alert('草稿已保存（模拟）'); },
  submitFromForm(){ if(this.formId)EquipmentRetrofit.submitApproval(this.formId); },
  withdrawFromForm(){ if(this.formId)EquipmentRetrofit.withdraw(this.formId); },
  print(){ window.print(); },
  exportDoc(){ alert('导出功能已触发（模拟）'); },

  renderTabContent(d,isDetail){
    const disabled=isDetail?'disabled':'';
    const readonly=isDetail?'readonly':'';
    let html='';
    if(this.formTab==='tab1'){
      html=`<div class="form-section"><div class="section-title">立项基础信息</div>
        <div class="form-grid col-2">
          <div class="form-group"><label>项目编号</label><input type="text" value="${esc(d.docNo||'自动生成')}" readonly style="background:#f1f5f9;"></div>
          <div class="form-group"><label>设备编码 / 名称</label><input type="text" value="${esc(d.equipmentInfo||'')}" ${readonly} style="min-width:300px;"></div>
          <div class="form-group"><label>改造类型</label><select ${disabled}>${eqRetrofitTypeOptions.filter(o=>o.value).map(o=>`<option value="${o.value}" ${d.retrofitType===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>
          <div class="form-group"><label>立项人</label><input type="text" value="${esc(d.leader||'')}" ${readonly}></div>
          <div class="form-group"><label>所属部门</label><input type="text" value="${esc(d.leaderDept||'')}" ${readonly}></div>
          <div class="form-group"><label>立项日期</label><input type="text" value="${esc(d.createdAt||'')}" readonly style="background:#f1f5f9;"></div>
        </div>
        <div class="form-grid col-1">
          <div class="form-group"><label>改造原因</label><textarea ${disabled} rows="2">${esc(d.reason||'')}</textarea></div>
          <div class="form-group"><label>改造目标</label><textarea ${disabled} rows="2">${esc(d.goal||'')}</textarea></div>
          <div class="form-group"><label>预期效果</label><textarea ${disabled} rows="2">${esc(d.expectedEffect||'')}</textarea></div>
        </div>
        <div class="form-grid col-2">
          <div class="form-group"><label>预估工期</label><input type="text" value="${esc(d.estimatedDuration||'')}" ${readonly}></div>
          <div class="form-group"><label>预估费用（元）</label><input type="text" value="${esc(d.estimatedCost||'')}" ${readonly} style="font-family:monospace;"></div>
          <div class="form-group"><label>预算科目</label><input type="text" value="${esc(d.budgetSubject||'')}" ${readonly}></div>
        </div>
      </div>`;
    } else if(this.formTab==='tab2'){
      html=`<div class="form-section"><div class="section-title">改造方案 & 施工信息</div>
        <div class="form-grid col-1">
          <div class="form-group"><label>详细改造方案</label><textarea ${disabled} rows="4">${esc(d.planDetail||'')}</textarea></div>
          <div class="form-group"><label>安全 / GMP 管控要求</label><textarea ${disabled} rows="3">${esc(d.gmpRequirement||'')}</textarea></div>
        </div>
        <div class="form-grid col-2">
          <div class="form-group"><label>施工班组 / 外部服务商</label><input type="text" value="${esc(d.constructionTeam||'')}" ${readonly}></div>
          <div class="form-group"><label>开工时间</label><input type="text" value="${esc(d.constructionStart||'')}" ${readonly}></div>
          <div class="form-group"><label>计划完工时间</label><input type="text" value="${esc(d.constructionEnd||'')}" ${readonly}></div>
          <div class="form-group"><label>影响产线</label><input type="text" value="${esc(d.impactLine||'')}" ${readonly}></div>
        </div>
        <div class="section-title" style="margin-top:16px;">改造涉及零部件（设备BOM变更）</div>
        <table class="data-table"><thead><tr><th>部件编码</th><th>部件名称</th><th>操作</th><th>新部件编码</th><th>新部件名称</th></tr></thead><tbody>
          ${(d.bomChanges||[]).length===0?'<tr><td colspan="5" style="text-align:center;color:var(--text-muted);">暂无BOM变更记录</td></tr>':(d.bomChanges||[]).map(bc=>`<tr>
            <td>${esc(bc.partCode||'')}</td><td>${esc(bc.partName||'')}</td>
            <td><span class="badge ${bc.action==='replace'?'badge-yellow':bc.action==='add'?'badge-green':'badge-red'}">${bc.action==='replace'?'替换':bc.action==='add'?'新增':'取消'}</span></td>
            <td>${esc(bc.newPartCode||'')}</td><td>${esc(bc.newPartName||'')}</td>
          </tr>`).join('')}
        </tbody></table>
      </div>`;
    } else if(this.formTab==='tab3'){
      html=`<div class="form-section"><div class="section-title">验收信息</div>
        <div class="form-grid col-2">
          <div class="form-group"><label>完工时间</label><input type="text" value="${esc(d.actualDuration||d.constructionEnd||'')}" readonly style="background:#f1f5f9;"></div>
          <div class="form-group"><label>实际工期</label><input type="text" value="${esc(d.actualDuration||'')}" readonly style="background:#f1f5f9;"></div>
          <div class="form-group"><label>实际费用（元）</label><input type="text" value="${esc(d.actualCost||'')}" readonly style="background:#f1f5f9;font-family:monospace;"></div>
          <div class="form-group"><label>验收日期</label><input type="text" value="${esc(d.acceptDate||'')}" readonly style="background:#f1f5f9;"></div>
        </div>
        <div style="margin-top:12px;background:#f8fafc;border-radius:8px;padding:16px;">
          <div style="font-weight:600;margin-bottom:8px;">改造前后技术参数对比</div>
          <table class="data-table"><thead><tr><th>参数项</th><th>改造前</th><th>改造后</th></tr></thead><tbody>
            ${(d.techBefore&&d.techAfter)?Object.keys(d.techBefore).map(k=>`<tr><td><strong>${k}</strong></td><td>${esc(d.techBefore[k]||'-')}</td><td>${esc((d.techAfter&&d.techAfter[k])||'-')}</td></tr>`).join(''):'<tr><td colspan="3" style="text-align:center;color:var(--text-muted);">暂无参数对比</td></tr>'}
          </tbody></table>
        </div>
        <div class="form-grid col-1" style="margin-top:12px;">
          <div class="form-group"><label>现场验收结论</label><textarea ${disabled} rows="2">${esc(d.acceptResult||'')}</textarea></div>
          <div class="form-group"><label>质量QA验收结论</label><textarea ${disabled} rows="2">${esc(d.qaConclusion||'')}</textarea></div>
          <div class="form-group"><label>遗留问题及整改要求</label><textarea ${disabled} rows="2">${esc(d.remainIssues||'')}</textarea></div>
        </div>
        <div class="form-grid col-2" style="margin-top:12px;">
          <div class="form-group"><label>验收人（联合验收）</label><input type="text" value="${esc(d.acceptor||'')}" ${readonly}></div>
        </div>
      </div>`;
    } else if(this.formTab==='tab4'){
      html=`<div class="form-section"><div class="section-title">档案变更 & 附件管理</div>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:16px;">
          <div style="font-weight:600;color:#166534;margin-bottom:8px;">✓ 自动触发项（项目完成后自动执行）</div>
          <ul style="margin:0;padding-left:20px;color:#15803d;font-size:13px;line-height:2;">
            <li>更新设备主数据技术参数</li>
            <li>更新设备 BOM 版本 → 生成新版设备 BOM</li>
            <li>更新维护任务清单 / 维保标准</li>
            <li>同步至 SAP PM 设备数据</li>
          </ul>
        </div>
        <div class="section-title">附件列表</div>
        ${(d.attachmentList||[]).length===0?'<div style="color:var(--text-muted);font-size:13px;padding:12px;">暂无附件</div>':(d.attachmentList||[]).map(a=>`<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;margin:4px 0;background:#f8fafc;border-radius:6px;border:1px solid var(--border);"><span style="color:var(--primary);">📎</span><span style="font-size:13px;">${esc(a)}</span></div>`).join('')}
        ${!isDetail?`<div style="margin-top:8px;"><button class="btn btn-sm btn-outline">+ 上传附件</button></div>`:''}
        <div class="section-title" style="margin-top:20px;">历史版本对比（改造前后档案差异）</div>
        <table class="data-table"><thead><tr><th>档案要素</th><th>改造前</th><th>改造后</th><th>版本</th></tr></thead><tbody>
          ${(d.techBefore&&d.techAfter)?Object.keys(d.techBefore).map(k=>`<tr><td><strong>技术参数: ${k}</strong></td><td>${esc(d.techBefore[k]||'-')}</td><td>${esc((d.techAfter&&d.techAfter[k])||'（待更新）')}</td><td><span class="badge badge-green">V2</span></td></tr>`).join(''):'<tr><td colspan="4" style="text-align:center;color:var(--text-muted);">暂无版本对比数据</td></tr>'}
        </tbody></table>
        <div class="section-title" style="margin-top:20px;">项目操作日志</div>
        <table class="data-table"><thead><tr><th>时间</th><th>操作</th><th>操作人</th><th>说明</th></tr></thead><tbody>
          ${(d.log||[]).length===0?'<tr><td colspan="4" style="text-align:center;color:var(--text-muted);">暂无日志</td></tr>':(d.log||[]).map(l=>`<tr><td>${esc(l.time||'')}</td><td>${esc(l.action||'')}</td><td>${esc(l.user||'')}</td><td>${esc(l.detail||'')}</td></tr>`).join('')}
        </tbody></table>
      </div>`;
    }
    document.getElementById('rfTabContent').innerHTML=html;
  }
};