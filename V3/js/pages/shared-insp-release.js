// ===== 检验执行与SAP放行 =====
const sharedInspReleaseData=[
  {id:'RL001',batchNo:'B202506001',materialCode:'RAW-001',materialName:'盐酸二甲双胍',supplier:'山东新华制药',lotNo:'L2025064',sourceType:'共享匹配',sourceBatch:'B202501001',sourceCompany:'山东步长制药',releaseType:'full_release',releaseDate:'2025-06-05 15:00',releaseBy:'张主管',releaseResult:'放行',sapDocNo:'SAP-QM-2025-06001',sapStatus:'released',comment:'引用山东步长已放行结果，直接放行'},
  {id:'RL002',batchNo:'B202506001',materialCode:'RAW-001',materialName:'盐酸二甲双胍',supplier:'山东新华制药',lotNo:'L2025064',sourceType:'自主检验',sourceBatch:'B202506001',sourceCompany:'山东丹红制药',releaseType:'full_release',releaseDate:'2025-06-05 16:30',releaseBy:'张主管',releaseResult:'放行',sapDocNo:'SAP-QM-2025-06002',sapStatus:'released',comment:'自主检验合格，条件放行'},
  {id:'RL003',batchNo:'B202506002',materialCode:'RAW-002',materialName:'阿莫西林',supplier:'华北制药',lotNo:'L2025065',sourceType:'共享匹配',sourceBatch:'B202502001',sourceCompany:'山东步长制药',releaseType:'conditional',releaseDate:'2025-06-06 09:00',releaseBy:'李主管',releaseResult:'条件放行',sapDocNo:'SAP-QM-2025-06003',sapStatus:'released',comment:'供应商不一致，仅引用理化检测数据'},
  {id:'RL004',batchNo:'B202506003',materialCode:'AUX-001',materialName:'微晶纤维素',supplier:'安徽山河药辅',lotNo:'L2025066',sourceType:'自主检验',sourceBatch:'B202506003',sourceCompany:'辽宁奥达制药',releaseType:'pending',releaseDate:'-',releaseBy:'-',releaseResult:'待放行',sapDocNo:'-',sapStatus:'pending',comment:'检验进行中'},
  {id:'RL005',batchNo:'B202506004',materialCode:'PACK-001',materialName:'铝塑包装膜',supplier:'江苏中金玛泰',lotNo:'L2025042',sourceType:'自主检验',sourceBatch:'IR004',sourceCompany:'梅河口步长制药',releaseType:'reject',releaseDate:'2025-04-02 14:00',releaseBy:'张主管',releaseResult:'退货',sapDocNo:'SAP-QM-2025-04001',sapStatus:'blocked',comment:'外观、厚度、热合强度不合格'},
  {id:'RL006',batchNo:'B202506005',materialCode:'RAW-001',materialName:'盐酸二甲双胍',supplier:'山东新华制药',lotNo:'L2025067',sourceType:'共享匹配',sourceBatch:'B202501001',sourceCompany:'山东步长制药',releaseType:'full_release',releaseDate:'2025-06-07 10:00',releaseBy:'李主管',releaseResult:'放行',sapDocNo:'SAP-QM-2025-06004',sapStatus:'released',comment:'共享引用放行'},
  {id:'RL007',batchNo:'B202506007',materialCode:'RAW-001',materialName:'盐酸二甲双胍',supplier:'山东新华制药',lotNo:'L2025068',sourceType:'共享匹配',sourceBatch:'B202501001',sourceCompany:'山东步长制药',releaseType:'need_review',releaseDate:'-',releaseBy:'-',releaseResult:'待审核',sapDocNo:'-',sapStatus:'pending',comment:'共享结果已超过3个月，需审核'},
  {id:'RL008',batchNo:'B202506008',materialCode:'RAW-002',materialName:'阿莫西林',supplier:'石药集团',lotNo:'L2025069',sourceType:'共享匹配',sourceBatch:'B202502001',sourceCompany:'山东步长制药',releaseType:'pending',releaseDate:'-',releaseBy:'-',releaseResult:'待审核',sapDocNo:'-',sapStatus:'pending',comment:'供应商不一致且部分匹配'}
];

const SharedInspRelease={
  page:1,pageSize:10,filtered:[],activeTab:'all',
  render(){ this.filtered=[...sharedInspReleaseData]; this.page=1;
    return`<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="padding:10px 20px;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;flex-shrink:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div><div style="font-size:15px;font-weight:700;">检验执行与SAP放行</div><div style="font-size:12px;opacity:0.7;">来料检验结果确认、放行决策与SAP系统集成</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="SharedInspRelease.batchRelease()">📋 批量放行</button>
          </div>
        </div>
      </div>
      <div class="filter-bar" style="flex-shrink:0;">
        <div class="filter-group"><label>批次号</label><input type="text" id="sirBatchNo" placeholder="模糊查询"></div>
        <div class="filter-group"><label>物料信息</label><input type="text" id="sirMaterial" placeholder="物料号/名称"></div>
        <div class="filter-group"><label>来源类型</label><select id="sirSource"><option value="">全部</option><option value="共享匹配">共享匹配</option><option value="自主检验">自主检验</option></select></div>
        <div class="filter-group"><label>放行结果</label><select id="sirResult"><option value="">全部</option><option value="放行">放行</option><option value="条件放行">条件放行</option><option value="退货">退货</option><option value="待放行">待放行</option><option value="待审核">待审核</option></select></div>
        <div class="filter-group"><label>SAP状态</label><select id="sirSapStatus"><option value="">全部</option><option value="released">已放行</option><option value="blocked">已冻结</option><option value="pending">待处理</option></select></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="SharedInspRelease.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="SharedInspRelease.reset()">重置</button>
        </div>
      </div>
      <div style="padding:8px 16px 0;display:flex;gap:8px;flex-shrink:0;">
        <button class="btn btn-sm ${this.activeTab==='all'?'btn-primary':'btn-outline'}" onclick="SharedInspRelease.switchTab('all')">全部 (${sharedInspReleaseData.length})</button>
        <button class="btn btn-sm ${this.activeTab==='pending_sap'?'btn-primary':'btn-outline'}" onclick="SharedInspRelease.switchTab('pending_sap')">待推送SAP (${sharedInspReleaseData.filter(d=>d.sapStatus==='pending'&&d.releaseResult==='放行').length})</button>
        <button class="btn btn-sm ${this.activeTab==='blocked'?'btn-primary':'btn-outline'}" onclick="SharedInspRelease.switchTab('blocked')">冻结/退货 (${sharedInspReleaseData.filter(d=>d.sapStatus==='blocked'||d.releaseResult==='退货').length})</button>
      </div>
      <div class="table-wrapper" style="flex:1;overflow-x:auto;">
        <table class="data-table" style="min-width:1500px;"><thead><tr>
          <th>批次号</th><th>物料</th><th>供应商</th><th>来源类型</th><th>来源批次/公司</th><th>放行类型</th><th>放行日期</th><th>放行人</th><th>放行结果</th><th>SAP单据</th><th>SAP状态</th><th>操作</th>
        </tr></thead><tbody id="sirTableBody"></tbody></table>
      </div>
      <div class="list-toolbar" style="flex-shrink:0;">
        <div class="list-info"><span class="list-count" id="sirCount">共 ${this.filtered.length} 条</span></div>
        <div class="pagination">
          <button class="pagination-btn" id="sirPrev" disabled onclick="SharedInspRelease.prevPage()">‹</button>
          <span class="pagination-info" id="sirPageInfo">第 1 / ${Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)} 页</span>
          <button class="pagination-btn" id="sirNext" onclick="SharedInspRelease.nextPage()">›</button>
          <select class="page-size-select" id="sirPageSizeSel" onchange="SharedInspRelease.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
        </div>
      </div>
    </div>`;
  },
  init(){ this.applyTabFilter(); this.page=1; this.renderTable(); },
  switchTab(tab){ this.activeTab=tab; this.applyTabFilter(); this.page=1; document.getElementById('contentArea').innerHTML=this.render(); this.init(); },
  applyTabFilter(){
    if(this.activeTab==='all') this.filtered=[...sharedInspReleaseData];
    else if(this.activeTab==='pending_sap') this.filtered=sharedInspReleaseData.filter(d=>d.sapStatus==='pending'&&d.releaseResult==='放行');
    else if(this.activeTab==='blocked') this.filtered=sharedInspReleaseData.filter(d=>d.sapStatus==='blocked'||d.releaseResult==='退货');
    else this.filtered=[...sharedInspReleaseData];
  },
  renderTable(){
    const start=(this.page-1)*this.pageSize, page=this.filtered.slice(start,start+this.pageSize);
    const totalPages=Math.ceil(Math.max(this.filtered.length,1)/this.pageSize);
    document.getElementById('sirCount').textContent='共 '+this.filtered.length+' 条';
    document.getElementById('sirPageInfo').textContent='第 '+this.page+' / '+totalPages+' 页';
    document.getElementById('sirPrev').disabled=this.page<=1;
    document.getElementById('sirNext').disabled=this.page>=totalPages;
    document.getElementById('sirPageSizeSel').value=this.pageSize;
    const tbody=document.getElementById('sirTableBody'); if(!tbody) return;
    if(!page.length){ tbody.innerHTML='<tr><td colspan="12" style="text-align:center;padding:40px;color:var(--text-muted);">暂无匹配的数据</td></tr>'; return; }
    const resultBadges={'放行':'<span class="badge badge-green">放行</span>','条件放行':'<span class="badge badge-blue">条件放行</span>','退货':'<span class="badge badge-red">退货</span>','待放行':'<span class="badge badge-yellow">待放行</span>','待审核':'<span class="badge badge-yellow">待审核</span>'};
    const sapBadges={released:'<span class="badge badge-green">已放行</span>',blocked:'<span class="badge badge-red">已冻结</span>',pending:'<span class="badge badge-gray">待处理</span>'};
    tbody.innerHTML=page.map(d=>`<tr>
      <td style="color:#2563eb;font-weight:600;">${esc(d.batchNo)}</td>
      <td><div style="font-weight:600;">${esc(d.materialName)}</div><div style="font-size:11px;color:var(--text-muted);">${esc(d.materialCode)}</div></td>
      <td>${esc(d.supplier)}</td>
      <td>${d.sourceType==='共享匹配'?'<span class="badge badge-blue">共享匹配</span>':'<span class="badge badge-gray">自主检验</span>'}</td>
      <td style="font-size:11px;">${esc(d.sourceBatch)} / ${esc(d.sourceCompany)}</td>
      <td>${d.releaseType==='full_release'?'全面放行':d.releaseType==='conditional'?'条件放行':d.releaseType==='reject'?'退货':d.releaseType==='need_review'?'待审核':'待放行'}</td>
      <td style="font-size:12px;">${esc(d.releaseDate)}</td><td>${esc(d.releaseBy)}</td>
      <td>${resultBadges[d.releaseResult]||d.releaseResult}</td>
      <td style="font-size:11px;">${esc(d.sapDocNo)}</td>
      <td>${sapBadges[d.sapStatus]||d.sapStatus}</td>
      <td><div class="table-actions">
        <button class="btn btn-sm btn-outline" onclick="SharedInspRelease.detail('${d.id}')">查看</button>
        ${d.releaseResult==='待放行'?`<button class="btn btn-sm btn-success" onclick="SharedInspRelease.releaseAction('${d.id}')">放行</button>`:''}
        ${d.releaseResult==='待审核'?`<button class="btn btn-sm btn-blue" onclick="SharedInspRelease.reviewAction('${d.id}')">审核</button>`:''}
        ${d.sapStatus==='pending'&&d.releaseResult==='放行'?`<button class="btn btn-sm btn-blue" onclick="SharedInspRelease.pushSap('${d.id}')">推送SAP</button>`:''}
        ${d.releaseResult==='放行'?`<button class="btn btn-sm btn-outline" onclick="SharedInspRelease.printLabel('${d.id}')">打印标签</button>`:''}
      </div></td></tr>`).join('');
  },
  search(){
    const batchNo=(document.getElementById('sirBatchNo').value||'').trim().toLowerCase();
    const material=(document.getElementById('sirMaterial').value||'').trim().toLowerCase();
    const source=document.getElementById('sirSource').value;
    const result=document.getElementById('sirResult').value;
    const sapStatus=document.getElementById('sirSapStatus').value;
    this.applyTabFilter();
    this.filtered=this.filtered.filter(d=>{
      if(batchNo&&!d.batchNo.toLowerCase().includes(batchNo)) return false;
      if(material&&!d.materialCode.toLowerCase().includes(material)&&!d.materialName.toLowerCase().includes(material)) return false;
      if(source&&d.sourceType!==source) return false;
      if(result&&d.releaseResult!==result) return false;
      if(sapStatus&&d.sapStatus!==sapStatus) return false;
      return true;
    });
    this.page=1; this.renderTable();
  },
  reset(){ document.getElementById('sirBatchNo').value='';document.getElementById('sirMaterial').value='';document.getElementById('sirSource').value='';document.getElementById('sirResult').value='';document.getElementById('sirSapStatus').value='';this.applyTabFilter();this.page=1;this.renderTable(); },
  prevPage(){ if(this.page>1){ this.page--; this.renderTable(); } },
  nextPage(){ if(this.page<Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)){ this.page++; this.renderTable(); } },
  changePageSize(){ this.pageSize=parseInt(document.getElementById('sirPageSizeSel').value); this.page=1; this.renderTable(); },
  detail(id){
    const d=sharedInspReleaseData.find(x=>x.id===id); if(!d) return;
    const body=`<div class="detail-grid">
      <div class="detail-item"><dt>批次号</dt><dd style="font-weight:600;">${esc(d.batchNo)}</dd></div>
      <div class="detail-item"><dt>物料</dt><dd>${esc(d.materialCode)} ${esc(d.materialName)}</dd></div>
      <div class="detail-item"><dt>供应商/批号</dt><dd>${esc(d.supplier)} / ${esc(d.lotNo)}</dd></div>
      <div class="detail-item"><dt>来源类型</dt><dd>${d.sourceType}</dd></div>
      <div class="detail-item"><dt>来源信息</dt><dd>${esc(d.sourceBatch)} / ${esc(d.sourceCompany)}</dd></div>
      <div class="detail-item"><dt>放行结果</dt><dd style="font-weight:700;">${esc(d.releaseResult)}</dd></div>
      <div class="detail-item"><dt>放行日期</dt><dd>${esc(d.releaseDate)}</dd></div>
      <div class="detail-item"><dt>放行人</dt><dd>${esc(d.releaseBy)}</dd></div>
      <div class="detail-item"><dt>SAP单据</dt><dd>${esc(d.sapDocNo)}</dd></div>
      <div class="detail-item"><dt>SAP状态</dt><dd>${d.sapStatus==='released'?'已放行':d.sapStatus==='blocked'?'已冻结':'待处理'}</dd></div>
      <div class="detail-item" style="grid-column:1/-1;"><dt>备注</dt><dd>${esc(d.comment)}</dd></div></div>`;
    showModal('放行详情',body,[{text:'关闭',cls:'btn-secondary',action:closeModal}],'modal-lg');
  },
  releaseAction(id){
    const d=sharedInspReleaseData.find(x=>x.id===id); if(!d) return;
    showModal('确认放行 - '+d.batchNo,`<p>物料：${esc(d.materialName)} | 来源：${d.sourceType} → ${esc(d.sourceCompany)}</p><div class="form-group"><label>放行类型</label><select id="sirReleaseType"><option value="full_release">全面放行</option><option value="conditional">条件放行</option></select></div><div class="form-group"><label>备注</label><textarea id="sirReleaseComment" rows="2"></textarea></div>`,
      [{text:'取消',cls:'btn-secondary',action:closeModal},{text:'确认放行',cls:'btn-success',action:()=>{
        d.releaseType=document.getElementById('sirReleaseType').value;
        d.releaseResult=d.releaseType==='full_release'?'放行':'条件放行';
        d.releaseDate=new Date().toISOString().slice(0,19).replace('T',' ');
        d.releaseBy='当前用户';d.comment=document.getElementById('sirReleaseComment').value.trim()||d.comment;
        closeModal();this.init();document.getElementById('contentArea').innerHTML=this.render();this.init();
        toast('批次 '+d.batchNo+' 已'+d.releaseResult);
      }}],'modal-lg');
  },
  reviewAction(id){
    const d=sharedInspReleaseData.find(x=>x.id===id); if(!d) return;
    showModal('放行审核 - '+d.batchNo,`<p>原因：${esc(d.comment)}</p><div class="form-group"><label>审核意见</label><textarea id="sirReviewComment" rows="2"></textarea></div>`,
      [{text:'驳回',cls:'btn-warning',action:()=>{d.releaseResult='待放行';d.releaseType='pending';closeModal();this.init();document.getElementById('contentArea').innerHTML=this.render();this.init();toast('审核驳回');}},
       {text:'审核通过',cls:'btn-primary',action:()=>{d.releaseResult='放行';d.releaseType='full_release';d.releaseDate=new Date().toISOString().slice(0,19).replace('T',' ');d.releaseBy='质量负责人';closeModal();this.init();document.getElementById('contentArea').innerHTML=this.render();this.init();toast('审核通过，已放行');}}],'modal-lg');
  },
  pushSap(id){
    const d=sharedInspReleaseData.find(x=>x.id===id); if(!d) return;
    d.sapDocNo='SAP-QM-'+new Date().getFullYear()+'-'+String(Math.floor(Math.random()*90000)+10000).padStart(5,'0');
    d.sapStatus='released';this.init();document.getElementById('contentArea').innerHTML=this.render();this.init();
    toast('SAP推送成功！\n单据号：'+d.sapDocNo);
  },
  batchRelease(){
    const pending=sharedInspReleaseData.filter(d=>d.releaseResult==='待放行');
    if(!pending.length){ toast('没有待放行的批次'); return; }
    showModal('批量放行',`<p>以下 ${pending.length} 个批次将被批量放行：</p>`+pending.map(d=>`<p style="font-size:13px;">• ${esc(d.batchNo)} - ${esc(d.materialName)}</p>`).join(''),
      [{text:'取消',cls:'btn-secondary',action:closeModal},{text:'确认批量放行',cls:'btn-success',action:()=>{
        const now=new Date().toISOString().slice(0,19).replace('T',' ');
        pending.forEach(d=>{d.releaseResult='放行';d.releaseType='full_release';d.releaseDate=now;d.releaseBy='批量操作';});
        closeModal();this.init();document.getElementById('contentArea').innerHTML=this.render();this.init();
        toast('已批量放行 '+pending.length+' 个批次');
      }}]);
  },
  printLabel(id){ const d=sharedInspReleaseData.find(x=>x.id===id); if(!d) return; toast('打印标签：'+d.batchNo+' '+d.materialName+' - '+d.releaseResult+'\n（演示模式）'); }
};
