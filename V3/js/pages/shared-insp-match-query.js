// ===== 共享查询与智能匹配 =====
const sharedInspMatchData = [
  { id:'MQ001', queryTime:'2025-06-01 09:30', materialCode:'RAW-001', materialName:'盐酸二甲双胍', batchNo:'B202506001', requestCompany:'山东丹红制药', requestDept:'质量部', matchCompany:'山东步长制药', matchBatchNo:'B202501001', matchDate:'2025-01-20', matchScore:'95%', matchConclusion:'合格', sharedInspectStd:'STD-MET-001', matchStatus:'matched', matchedBy:'系统自动', requireVendorMatch:false },
  { id:'MQ002', queryTime:'2025-06-02 14:00', materialCode:'RAW-002', materialName:'阿莫西林', batchNo:'B202506002', requestCompany:'通化天实制药', requestDept:'质量部', matchCompany:'山东步长制药', matchBatchNo:'B202502001', matchDate:'2025-02-10', matchScore:'88%', matchConclusion:'合格', sharedInspectStd:'STD-AMX-001', matchStatus:'matched', matchedBy:'系统自动', requireVendorMatch:false },
  { id:'MQ003', queryTime:'2025-06-03 10:15', materialCode:'AUX-001', materialName:'微晶纤维素', batchNo:'B202506003', requestCompany:'辽宁奥达制药', requestDept:'QC实验室', matchCompany:'通化谷红制药', matchBatchNo:'B202503001', matchDate:'2025-03-05', matchScore:'72%', matchConclusion:'待复核', sharedInspectStd:'STD-MCC-001', matchStatus:'partial_match', matchedBy:'系统推荐', requireVendorMatch:false },
  { id:'MQ004', queryTime:'2025-06-04 16:30', materialCode:'PACK-001', materialName:'铝塑包装膜', batchNo:'B202506004', requestCompany:'梅河口步长制药', requestDept:'质量部', matchCompany:'-', matchBatchNo:'-', matchDate:'-', matchScore:'-', matchConclusion:'-', sharedInspectStd:'STD-ALM-001', matchStatus:'no_match', matchedBy:'-', requireVendorMatch:true },
  { id:'MQ005', queryTime:'2025-06-05 08:00', materialCode:'RAW-001', materialName:'盐酸二甲双胍', batchNo:'B202506005', requestCompany:'吉林天成制药', requestDept:'质量部', matchCompany:'山东步长制药', matchBatchNo:'B202501001', matchDate:'2025-01-20', matchScore:'91%', matchConclusion:'合格', sharedInspectStd:'STD-MET-001', matchStatus:'matched', matchedBy:'系统自动', requireVendorMatch:true },
  { id:'MQ006', queryTime:'2025-06-06 11:45', materialCode:'AUX-002', materialName:'硬脂酸镁', batchNo:'B202506006', requestCompany:'杨凌步长制药', requestDept:'QC实验室', matchCompany:'-', matchBatchNo:'-', matchDate:'-', matchScore:'-', matchConclusion:'-', sharedInspectStd:'STD-MGS-001', matchStatus:'no_match', matchedBy:'-', requireVendorMatch:true },
  { id:'MQ007', queryTime:'2025-06-08 13:20', materialCode:'RAW-001', materialName:'盐酸二甲双胍', batchNo:'B202506007', requestCompany:'邛崃天银制药', requestDept:'质量部', matchCompany:'山东步长制药', matchBatchNo:'B202501001', matchDate:'2025-01-20', matchScore:'93%', matchConclusion:'合格', sharedInspectStd:'STD-MET-001', matchStatus:'matched', matchedBy:'系统自动', requireVendorMatch:true },
  { id:'MQ008', queryTime:'2025-06-10 15:00', materialCode:'RAW-002', materialName:'阿莫西林', batchNo:'B202506008', requestCompany:'保定天浩制药', requestDept:'质量部', matchCompany:'山东步长制药', matchBatchNo:'B202502001', matchDate:'2025-02-10', matchScore:'85%', matchConclusion:'合格', sharedInspectStd:'STD-AMX-001', matchStatus:'partial_match', matchedBy:'系统推荐', requireVendorMatch:false }
];

const SharedInspMatchQuery = {
  page:1, pageSize:10, filtered:[],
  activeTab:'all',

  render(){ this.filtered=[...sharedInspMatchData]; this.page=1;
    return `<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="padding:10px 20px;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;flex-shrink:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div><div style="font-size:15px;font-weight:700;">共享查询与智能匹配</div><div style="font-size:12px;opacity:0.7;">跨公司查询检验结果，智能匹配共享数据，减少重复检验</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="SharedInspMatchQuery.openQueryModal()">🔍 发起查询</button>
            <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="SharedInspMatchQuery.statsPanel()">📊 统计分析</button>
          </div>
        </div>
      </div>
      <div class="filter-bar" style="flex-shrink:0;">
        <div class="filter-group"><label>物料号/名称</label><input type="text" id="simqMaterial" placeholder="模糊查询"></div>
        <div class="filter-group"><label>请求公司</label><select id="simqReqCompany"><option value="">全部</option>${sharedInspCompanyOptions.map(o=>`<option value="${o.label}">${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>匹配状态</label><select id="simqMatchStatus"><option value="">全部</option><option value="matched">精准匹配</option><option value="partial_match">部分匹配</option><option value="no_match">无匹配</option></select></div>
        <div class="filter-group"><label>供应商一致性</label><select id="simqVendor"><option value="">全部</option><option value="true">要求一致</option><option value="false">不要求</option></select></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="SharedInspMatchQuery.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="SharedInspMatchQuery.reset()">重置</button>
        </div>
      </div>
      <div style="padding:8px 16px 0;display:flex;gap:8px;flex-shrink:0;">
        <button class="btn btn-sm ${this.activeTab==='all'?'btn-primary':'btn-outline'}" onclick="SharedInspMatchQuery.switchTab('all')">全部 (${sharedInspMatchData.length})</button>
        <button class="btn btn-sm ${this.activeTab==='matched'?'btn-primary':'btn-outline'}" onclick="SharedInspMatchQuery.switchTab('matched')">精准匹配 (${sharedInspMatchData.filter(d=>d.matchStatus==='matched').length})</button>
        <button class="btn btn-sm ${this.activeTab==='partial_match'?'btn-primary':'btn-outline'}" onclick="SharedInspMatchQuery.switchTab('partial_match')">部分匹配 (${sharedInspMatchData.filter(d=>d.matchStatus==='partial_match').length})</button>
        <button class="btn btn-sm ${this.activeTab==='no_match'?'btn-primary':'btn-outline'}" onclick="SharedInspMatchQuery.switchTab('no_match')">无匹配 (${sharedInspMatchData.filter(d=>d.matchStatus==='no_match').length})</button>
      </div>
      <div class="table-wrapper" style="flex:1;overflow-x:auto;">
        <table class="data-table" style="min-width:1500px;"><thead><tr>
          <th>查询时间</th><th>物料号</th><th>物料名称</th><th>请求公司</th><th>匹配公司</th><th>匹配批次</th><th>匹配日期</th><th>匹配度</th><th>共享结论</th><th>检验标准</th><th>供应商一致</th><th>匹配状态</th><th>操作</th>
        </tr></thead><tbody id="simqTableBody"></tbody></table>
      </div>
      <div class="list-toolbar" style="flex-shrink:0;">
        <div class="list-info"><span class="list-count" id="simqCount">共 ${this.filtered.length} 条</span></div>
        <div class="pagination">
          <button class="pagination-btn" id="simqPrev" disabled onclick="SharedInspMatchQuery.prevPage()">‹</button>
          <span class="pagination-info" id="simqPageInfo">第 1 / ${Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)} 页</span>
          <button class="pagination-btn" id="simqNext" onclick="SharedInspMatchQuery.nextPage()">›</button>
          <select class="page-size-select" id="simqPageSizeSel" onchange="SharedInspMatchQuery.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
        </div>
      </div>
    </div>`;
  },

  init(){ this.filtered=[...sharedInspMatchData]; this.page=1; this.renderTable(); },

  switchTab(tab){
    this.activeTab=tab;
    this.filtered=tab==='all'?[...sharedInspMatchData]:sharedInspMatchData.filter(d=>d.matchStatus===tab);
    this.page=1;
    document.getElementById('contentArea').innerHTML=this.render(); this.init();
  },

  renderTable(){
    const start=(this.page-1)*this.pageSize, page=this.filtered.slice(start,start+this.pageSize);
    const totalPages=Math.ceil(Math.max(this.filtered.length,1)/this.pageSize);
    document.getElementById('simqCount').textContent='共 '+this.filtered.length+' 条';
    document.getElementById('simqPageInfo').textContent='第 '+this.page+' / '+totalPages+' 页';
    document.getElementById('simqPrev').disabled=this.page<=1;
    document.getElementById('simqNext').disabled=this.page>=totalPages;
    document.getElementById('simqPageSizeSel').value=this.pageSize;
    const tbody=document.getElementById('simqTableBody'); if(!tbody) return;
    if(!page.length){ tbody.innerHTML='<tr><td colspan="13" style="text-align:center;padding:40px;color:var(--text-muted);">暂无匹配的数据</td></tr>'; return; }
    const matchBadges={matched:'<span class="badge badge-green">精准匹配</span>',partial_match:'<span class="badge badge-blue">部分匹配</span>',no_match:'<span class="badge badge-red">无匹配</span>'};
    tbody.innerHTML=page.map(d=>{
      const scoreColor=d.matchScore&&parseFloat(d.matchScore)>=90?'color:#16a34a;':d.matchScore&&parseFloat(d.matchScore)>=75?'color:#d97706;':'color:#dc2626;';
      return `<tr>
        <td style="font-size:12px;">${d.queryTime}</td>
        <td style="color:#2563eb;font-weight:600;">${esc(d.materialCode)}</td>
        <td>${esc(d.materialName)}</td>
        <td>${esc(d.requestCompany)}</td>
        <td style="${d.matchCompany!=='-'?'font-weight:600;':''}">${esc(d.matchCompany)}</td>
        <td style="color:#2563eb;">${esc(d.matchBatchNo)}</td>
        <td style="font-size:12px;">${esc(d.matchDate)}</td>
        <td style="font-weight:700;${d.matchScore!=='-'?scoreColor:''}">${esc(d.matchScore)}</td>
        <td>${d.matchConclusion==='合格'?'<span class="badge badge-green">合格</span>':d.matchConclusion==='-'?'-':'<span class="badge badge-yellow">待复核</span>'}</td>
        <td style="font-size:11px;">${esc(d.sharedInspectStd)}</td>
        <td>${d.requireVendorMatch?'<span class="badge badge-blue">要求</span>':'<span class="badge badge-gray">不要求</span>'}</td>
        <td>${matchBadges[d.matchStatus]||d.matchStatus}</td>
        <td><div class="table-actions">
          <button class="btn btn-sm btn-outline" onclick="SharedInspMatchQuery.detail('${d.id}')">查看</button>
          ${d.matchStatus==='matched'?`<button class="btn btn-sm btn-success" onclick="SharedInspMatchQuery.applyResult('${d.id}')">引用结果</button>`:''}
          ${d.matchStatus==='partial_match'?`<button class="btn btn-sm btn-blue" onclick="SharedInspMatchQuery.partialApply('${d.id}')">部分引用</button>`:''}
          ${d.matchStatus==='no_match'?`<button class="btn btn-sm btn-warning" onclick="SharedInspMatchQuery.createInspection('${d.id}')">发起检验</button>`:''}
        </div></td>
      </tr>`;
    }).join('');
  },

  search(){
    const material=(document.getElementById('simqMaterial').value||'').trim().toLowerCase();
    const reqCompany=document.getElementById('simqReqCompany').value;
    const matchStatus=document.getElementById('simqMatchStatus').value;
    const vendor=document.getElementById('simqVendor').value;
    let base=this.activeTab==='all'?[...sharedInspMatchData]:sharedInspMatchData.filter(d=>d.matchStatus===this.activeTab);
    this.filtered=base.filter(d=>{
      if(material && !d.materialCode.toLowerCase().includes(material) && !d.materialName.toLowerCase().includes(material)) return false;
      if(reqCompany && d.requestCompany!==reqCompany) return false;
      if(matchStatus && d.matchStatus!==matchStatus) return false;
      if(vendor==='true' && !d.requireVendorMatch) return false;
      if(vendor==='false' && d.requireVendorMatch) return false;
      return true;
    });
    this.page=1; this.renderTable();
  },

  reset(){
    document.getElementById('simqMaterial').value='';
    document.getElementById('simqReqCompany').value='';
    document.getElementById('simqMatchStatus').value='';
    document.getElementById('simqVendor').value='';
    this.filtered=this.activeTab==='all'?[...sharedInspMatchData]:sharedInspMatchData.filter(d=>d.matchStatus===this.activeTab);
    this.page=1; this.renderTable();
  },

  prevPage(){ if(this.page>1){ this.page--; this.renderTable(); } },
  nextPage(){ if(this.page<Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)){ this.page++; this.renderTable(); } },
  changePageSize(){ this.pageSize=parseInt(document.getElementById('simqPageSizeSel').value); this.page=1; this.renderTable(); },

  openQueryModal(){
    showModal('发起共享查询',
      `<form id="simqQueryForm" onsubmit="return false;" style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
        <div class="form-group"><label>物料号<span class="required">*</span></label><input type="text" id="simqQueryMatCode" placeholder="如：RAW-001" required></div>
        <div class="form-group"><label>物料名称<span class="required">*</span></label><input type="text" id="simqQueryMatName" placeholder="请输入物料名称" required></div>
        <div class="form-group"><label>批次号<span class="required">*</span></label><input type="text" id="simqQueryBatchNo" placeholder="当前批次号" required></div>
        <div class="form-group"><label>请求公司<span class="required">*</span></label><select id="simqQueryCompany" required><option value="">请选择</option>${sharedInspCompanyOptions.map(o=>`<option value="${o.label}">${o.label}</option>`).join('')}</select></div>
        <div class="form-group"><label>检验标准编号</label><input type="text" id="simqQueryStd" placeholder="如：STD-XXX-001"></div>
        <div class="form-group" style="display:flex;align-items:center;gap:8px;"><label>要求供应商一致性</label><input type="checkbox" id="simqQueryVendor" checked style="width:18px;height:18px;"></div>
      </form>`,
      [{text:'取消',cls:'btn-secondary',action:closeModal},
       {text:'开始查询',cls:'btn-primary',action:()=>{
        const matCode=document.getElementById('simqQueryMatCode').value.trim();
        const matName=document.getElementById('simqQueryMatName').value.trim();
        const batchNo=document.getElementById('simqQueryBatchNo').value.trim();
        const company=document.getElementById('simqQueryCompany').value;
        if(!matCode||!matName||!batchNo||!company){ toast('请填写必填项'); return; }
        const requireVendor=document.getElementById('simqQueryVendor').checked;
        // Simulate matching
        const existing=sharedInspResultData.filter(r=>r.materialCode===matCode && r.status==='completed');
        let matchStatus='no_match', matchCompany='-', matchBatch='-', matchDate='-', matchScore='-', matchConclusion='-';
        if(existing.length>0){
          matchStatus='matched'; matchCompany='山东步长制药'; matchBatch=existing[0].batchNo;
          matchDate=existing[0].resultDate; matchScore='95%'; matchConclusion=existing[0].conclusion;
        }
        const n={
          id:'MQ'+String(sharedInspMatchData.length+1).padStart(3,'0'),
          queryTime:new Date().toISOString().slice(0,19).replace('T',' '),
          materialCode:matCode, materialName:matName, batchNo:batchNo,
          requestCompany:company, requestDept:'质量部',
          matchCompany:matchCompany, matchBatchNo:matchBatch, matchDate:matchDate,
          matchScore:matchScore, matchConclusion:matchConclusion,
          sharedInspectStd:document.getElementById('simqQueryStd').value.trim()||'-',
          matchStatus:matchStatus, matchedBy:matchStatus==='matched'?'系统自动':'-',
          requireVendorMatch:requireVendor
        };
        sharedInspMatchData.unshift(n);
        closeModal(); this.init();
        document.getElementById('contentArea').innerHTML=this.render(); this.init();
        toast(matchStatus==='matched'?'查询完成！找到 '+existing.length+' 条匹配记录':'未找到匹配记录，请发起独立检验');
      }}],'modal-lg');
  },

  detail(id){
    const d=sharedInspMatchData.find(x=>x.id===id); if(!d) return;
    const matchBadges={matched:'<span class="badge badge-green">精准匹配</span>',partial_match:'<span class="badge badge-blue">部分匹配</span>',no_match:'<span class="badge badge-red">无匹配</span>'};
    const body=`<div class="detail-grid">
      <div class="detail-item"><dt>查询时间</dt><dd>${d.queryTime}</dd></div>
      <div class="detail-item"><dt>物料信息</dt><dd>${esc(d.materialCode)} ${esc(d.materialName)}</dd></div>
      <div class="detail-item"><dt>查询批次</dt><dd>${esc(d.batchNo)}</dd></div>
      <div class="detail-item"><dt>请求公司</dt><dd>${esc(d.requestCompany)} / ${esc(d.requestDept)}</dd></div>
      <div class="detail-item"><dt>匹配公司</dt><dd style="font-weight:600;">${esc(d.matchCompany)}</dd></div>
      <div class="detail-item"><dt>匹配批次</dt><dd style="color:#2563eb;font-weight:600;">${esc(d.matchBatchNo)}</dd></div>
      <div class="detail-item"><dt>匹配日期</dt><dd>${esc(d.matchDate)}</dd></div>
      <div class="detail-item"><dt>匹配度</dt><dd style="font-weight:700;font-size:18px;">${esc(d.matchScore)}</dd></div>
      <div class="detail-item"><dt>匹配状态</dt><dd>${matchBadges[d.matchStatus]}</dd></div>
      <div class="detail-item"><dt>共享结论</dt><dd>${d.matchConclusion==='合格'?'<span class="badge badge-green">合格</span>':d.matchConclusion==='-'?'-':d.matchConclusion}</dd></div>
      <div class="detail-item"><dt>检验标准</dt><dd>${esc(d.sharedInspectStd)}</dd></div>
      <div class="detail-item"><dt>供应商一致性要求</dt><dd>${d.requireVendorMatch?'<span class="badge badge-blue">要求</span>':'<span class="badge badge-gray">不要求</span>'}</dd></div>
    </div>`;
    showModal('共享匹配详情',body,[{text:'关闭',cls:'btn-secondary',action:closeModal}],'modal-lg');
  },

  applyResult(id){
    const d=sharedInspMatchData.find(x=>x.id===id); if(!d) return;
    toast('已引用共享检验结果：批次 '+d.matchBatchNo+' → 批次 '+d.batchNo+'\n检验结论已自动关联，无需重复检验');
  },

  partialApply(id){
    const d=sharedInspMatchData.find(x=>x.id===id); if(!d) return;
    showModal('部分引用确认',
      `<p style="font-size:14px;color:var(--text-secondary);">匹配度：<strong style="color:#d97706;">${d.matchScore}</strong></p>
       <p style="font-size:13px;color:var(--text-muted);">建议：引用已有结论部分，对未覆盖项目补充检验</p>
       <div class="form-group"><label>引用说明</label><textarea id="simqPartialComment" rows="2" placeholder="说明引用范围及需要补充检验的项目"></textarea></div>`,
      [{text:'取消',cls:'btn-secondary',action:closeModal},
       {text:'确认部分引用',cls:'btn-primary',action:()=>{
        closeModal(); toast('已部分引用共享结果，请对未匹配项目发起补充检验');
      }}],'modal-lg');
  },

  createInspection(id){
    const d=sharedInspMatchData.find(x=>x.id===id); if(!d) return;
    toast('已为物料 '+d.materialName+' 创建独立检验任务\n请前往「检验结果录入」页面录入结果');
  },

  statsPanel(){
    const total=sharedInspMatchData.length;
    const matched=sharedInspMatchData.filter(d=>d.matchStatus==='matched').length;
    const partial=sharedInspMatchData.filter(d=>d.matchStatus==='partial_match').length;
    const noMatch=sharedInspMatchData.filter(d=>d.matchStatus==='no_match').length;
    showModal('共享匹配统计分析',
      `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#16a34a;">${total}</div><div style="font-size:12px;color:#15803d;margin-top:4px;">总查询次数</div></div>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#2563eb;">${matched}</div><div style="font-size:12px;color:#1d4ed8;margin-top:4px;">精准匹配</div></div>
        <div style="background:#fefce8;border:1px solid #fef08a;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#ca8a04;">${partial}</div><div style="font-size:12px;color:#a16207;margin-top:4px;">部分匹配</div></div>
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#dc2626;">${noMatch}</div><div style="font-size:12px;color:#991b1b;margin-top:4px;">无匹配</div></div>
      </div>
      <div style="background:#f8fafc;border-radius:8px;padding:16px;">
        <div style="font-size:13px;font-weight:600;margin-bottom:8px;">匹配率：${total>0?Math.round(matched/total*100):0}%</div>
        <div style="background:#e2e8f0;border-radius:4px;height:24px;overflow:hidden;">
          <div style="background:linear-gradient(90deg,#16a34a,#2563eb);height:100%;width:${total>0?Math.round((matched+partial)/total*100):0}%;border-radius:4px;transition:width .5s ease;"></div>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">有效匹配（含部分）占比</div>
      </div>`,
      [{text:'关闭',cls:'btn-secondary',action:closeModal}]);
  }
};
