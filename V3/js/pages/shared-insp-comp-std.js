// ===== 公司级标准映射 =====
const sharedInspCompStdData = [
  { id:'CS001', companyCode:'1000', companyName:'山东步长制药', usageCode:'USG-API', usageName:'原料药生产', groupStdCode:'STD-MET-001', groupStdName:'二甲双胍原料检验标准', mappedStdCode:'BUCH-API-MET-001', mappedStdName:'步长-二甲双胍原料检验标准', mappingDate:'2025-01-15', mappingBy:'山东步长质量部', differences:'增加厂内对重金属的加严要求（从20ppm→10ppm）', status:'active', sapSyncStatus:'synced' },
  { id:'CS002', companyCode:'2001', companyName:'陕西步长制药', usageCode:'USG-API', usageName:'原料药生产', groupStdCode:'STD-MET-001', groupStdName:'二甲双胍原料检验标准', mappedStdCode:'SXBC-API-MET-001', mappedStdName:'陕西步长-二甲双胍原料检验标准', mappingDate:'2025-01-20', mappingBy:'陕西步长质量部', differences:'额外增加残留溶剂检测项', status:'active', sapSyncStatus:'synced' },
  { id:'CS003', companyCode:'2003', companyName:'山东神州制药', usageCode:'USG-API', usageName:'原料药生产', groupStdCode:'STD-MET-001', groupStdName:'二甲双胍原料检验标准', mappedStdCode:'SZSZ-API-MET-001', mappedStdName:'神州-二甲双胍原料检验标准', mappingDate:'2025-02-01', mappingBy:'神州质量部', differences:'无差异，直接引用集团标准', status:'active', sapSyncStatus:'synced' },
  { id:'CS004', companyCode:'1000', companyName:'山东步长制药', usageCode:'USG-FORM', usageName:'制剂原料', groupStdCode:'STD-AMX-001', groupStdName:'阿莫西林原料检验标准', mappedStdCode:'BUCH-FORM-AMX-001', mappedStdName:'步长-阿莫西林原料检验标准', mappingDate:'2025-03-10', mappingBy:'山东步长质量部', differences:'增加细菌内毒素检测', status:'active', sapSyncStatus:'pending' },
  { id:'CS005', companyCode:'2001', companyName:'陕西步长制药', usageCode:'USG-FORM', usageName:'制剂原料', groupStdCode:'STD-AMX-001', groupStdName:'阿莫西林原料检验标准', mappedStdCode:'SXBC-FORM-AMX-001', mappedStdName:'陕西步长-阿莫西林原料检验标准', mappingDate:'2025-03-15', mappingBy:'陕西步长质量部', differences:'无差异，直接引用集团标准', status:'active', sapSyncStatus:'synced' },
  { id:'CS006', companyCode:'2005', companyName:'通化谷红制药', usageCode:'USG-EXC', usageName:'辅料', groupStdCode:'STD-MCC-001', groupStdName:'微晶纤维素检验标准', mappedStdCode:'THGH-EXC-MCC-001', mappedStdName:'谷红-微晶纤维素检验标准', mappingDate:'2025-04-05', mappingBy:'谷红质量部', differences:'增加微生物限度加严标准', status:'active', sapSyncStatus:'synced' },
  { id:'CS007', companyCode:'2010', companyName:'保定天浩制药', usageCode:'USG-EXC', usageName:'辅料', groupStdCode:'STD-MCC-001', groupStdName:'微晶纤维素检验标准', mappedStdCode:'BDTH-EXC-MCC-001', mappedStdName:'天浩-微晶纤维素检验标准', mappingDate:'2025-04-20', mappingBy:'天浩质量部', differences:'无差异，直接引用集团标准', status:'active', sapSyncStatus:'failed' },
  { id:'CS008', companyCode:'1000', companyName:'山东步长制药', usageCode:'USG-PACK', usageName:'内包材', groupStdCode:'STD-ALM-001', groupStdName:'铝塑包装膜检验标准', mappedStdCode:'BUCH-PACK-ALM-001', mappedStdName:'步长-铝塑包装膜检验标准', mappingDate:'2025-05-10', mappingBy:'山东步长质量部', differences:'增加外观缺陷判定标准细化', status:'inactive', sapSyncStatus:'synced' }
];

const sharedInspCompanyOptions = [
  {value:'1000',label:'山东步长制药'},{value:'2001',label:'陕西步长制药'},{value:'2002',label:'山东丹红制药'},
  {value:'2003',label:'山东神州制药'},{value:'2004',label:'山东康爱制药'},{value:'2005',label:'通化谷红制药'},
  {value:'2006',label:'吉林天成制药'},{value:'2007',label:'通化天实制药'},{value:'2008',label:'梅河口步长制药'},
  {value:'2009',label:'辽宁奥达制药'},{value:'2010',label:'保定天浩制药'},{value:'2011',label:'邛崃天银制药'},
  {value:'2012',label:'陕西步长高新制药'},{value:'2013',label:'杨凌步长制药'}
];

const SharedInspCompStd = {
  page:1, pageSize:10, filtered:[],

  render(){ this.filtered=[...sharedInspCompStdData]; this.page=1;
    return `<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="padding:10px 20px;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;flex-shrink:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div><div style="font-size:15px;font-weight:700;">公司级标准映射</div><div style="font-size:12px;opacity:0.7;">将集团检验标准映射到各分子公司本地标准</div></div>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="SharedInspCompStd.addModal()">+ 新建映射</button>
        </div>
      </div>
      <div class="filter-bar" style="flex-shrink:0;">
        <div class="filter-group"><label>公司</label><select id="sicsCompany"><option value="">全部</option>${sharedInspCompanyOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>维护用途</label><select id="sicsUsage"><option value="">全部</option>${sharedInspUsageOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>集团标准编号</label><input type="text" id="sicsGroupStd" placeholder="模糊查询"></div>
        <div class="filter-group"><label>状态</label><select id="sicsStatus"><option value="">全部</option><option value="active">生效中</option><option value="inactive">已停用</option></select></div>
        <div class="filter-group"><label>SAP同步状态</label><select id="sicsSapStatus"><option value="">全部</option><option value="synced">已同步</option><option value="pending">待同步</option><option value="failed">失败</option></select></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="SharedInspCompStd.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="SharedInspCompStd.reset()">重置</button>
        </div>
      </div>
      <div class="table-wrapper" style="flex:1;overflow-x:auto;">
        <table class="data-table" style="min-width:1400px;"><thead><tr>
          <th>公司</th><th>集团标准编号</th><th>集团标准名称</th><th>用途</th><th>本地标准编号</th><th>本地标准名称</th><th>映射日期</th><th>差异说明</th><th>状态</th><th>SAP同步</th><th>操作</th>
        </tr></thead><tbody id="sicsTableBody"></tbody></table>
      </div>
      <div class="list-toolbar" style="flex-shrink:0;">
        <div class="list-info"><span class="list-count" id="sicsCount">共 ${this.filtered.length} 条</span></div>
        <div class="pagination">
          <button class="pagination-btn" id="sicsPrev" disabled onclick="SharedInspCompStd.prevPage()">‹</button>
          <span class="pagination-info" id="sicsPageInfo">第 1 / ${Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)} 页</span>
          <button class="pagination-btn" id="sicsNext" onclick="SharedInspCompStd.nextPage()">›</button>
          <select class="page-size-select" id="sicsPageSizeSel" onchange="SharedInspCompStd.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
        </div>
      </div>
    </div>`;
  },

  init(){ this.filtered=[...sharedInspCompStdData]; this.page=1; this.renderTable(); },

  renderTable(){
    const start=(this.page-1)*this.pageSize, page=this.filtered.slice(start,start+this.pageSize);
    const totalPages=Math.ceil(Math.max(this.filtered.length,1)/this.pageSize);
    document.getElementById('sicsCount').textContent='共 '+this.filtered.length+' 条';
    document.getElementById('sicsPageInfo').textContent='第 '+this.page+' / '+totalPages+' 页';
    document.getElementById('sicsPrev').disabled=this.page<=1;
    document.getElementById('sicsNext').disabled=this.page>=totalPages;
    document.getElementById('sicsPageSizeSel').value=this.pageSize;
    const tbody=document.getElementById('sicsTableBody'); if(!tbody) return;
    if(!page.length){ tbody.innerHTML='<tr><td colspan="11" style="text-align:center;padding:40px;color:var(--text-muted);">暂无匹配的数据</td></tr>'; return; }
    const sapBadges={synced:'<span class="badge badge-green">已同步</span>',pending:'<span class="badge badge-blue">待同步</span>',failed:'<span class="badge badge-red">失败</span>'};
    tbody.innerHTML=page.map(d=>{
      const statusBadge=d.status==='active'?'<span class="badge badge-green">生效中</span>':'<span class="badge badge-gray">已停用</span>';
      return `<tr>
        <td><div style="font-weight:600;">${esc(d.companyName)}</div><div style="font-size:11px;color:var(--text-muted);">${esc(d.companyCode)}</div></td>
        <td style="color:#2563eb;font-weight:600;">${esc(d.groupStdCode)}</td>
        <td>${esc(d.groupStdName)}</td>
        <td>${esc(d.usageName)}</td>
        <td style="font-weight:600;">${esc(d.mappedStdCode)}</td>
        <td>${esc(d.mappedStdName)}</td>
        <td style="font-size:12px;">${d.mappingDate}</td>
        <td style="font-size:11px;max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${esc(d.differences)}">${esc(d.differences)}</td>
        <td>${statusBadge}</td>
        <td>${sapBadges[d.sapSyncStatus]||d.sapSyncStatus}</td>
        <td><div class="table-actions">
          <button class="btn btn-sm btn-outline" onclick="SharedInspCompStd.detail('${d.id}')">查看</button>
          <button class="btn btn-sm btn-outline" onclick="SharedInspCompStd.editModal('${d.id}')">编辑</button>
          ${d.sapSyncStatus==='pending'?`<button class="btn btn-sm btn-blue" onclick="SharedInspCompStd.syncSap('${d.id}')">推送SAP</button>`:''}
          ${d.sapSyncStatus==='failed'?`<button class="btn btn-sm btn-warning" onclick="SharedInspCompStd.syncSap('${d.id}')">重推SAP</button>`:''}
        </div></td>
      </tr>`;
    }).join('');
  },

  search(){
    const company=document.getElementById('sicsCompany').value;
    const usage=document.getElementById('sicsUsage').value;
    const groupStd=(document.getElementById('sicsGroupStd').value||'').trim().toLowerCase();
    const status=document.getElementById('sicsStatus').value;
    const sapStatus=document.getElementById('sicsSapStatus').value;
    this.filtered=sharedInspCompStdData.filter(d=>{
      if(company && d.companyCode!==company) return false;
      if(usage && d.usageCode!==usage) return false;
      if(groupStd && !d.groupStdCode.toLowerCase().includes(groupStd)) return false;
      if(status && d.status!==status) return false;
      if(sapStatus && d.sapSyncStatus!==sapStatus) return false;
      return true;
    });
    this.page=1; this.renderTable();
  },

  reset(){
    document.getElementById('sicsCompany').value='';
    document.getElementById('sicsUsage').value='';
    document.getElementById('sicsGroupStd').value='';
    document.getElementById('sicsStatus').value='';
    document.getElementById('sicsSapStatus').value='';
    this.filtered=[...sharedInspCompStdData]; this.page=1; this.renderTable();
  },

  prevPage(){ if(this.page>1){ this.page--; this.renderTable(); } },
  nextPage(){ if(this.page<Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)){ this.page++; this.renderTable(); } },
  changePageSize(){ this.pageSize=parseInt(document.getElementById('sicsPageSizeSel').value); this.page=1; this.renderTable(); },

  addModal(){
    showModal('新建公司标准映射',
      `<form id="sicsAddForm" onsubmit="return false;" style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
        <div class="form-group"><label>子公司<span class="required">*</span></label><select id="sicsAddCompany" required><option value="">请选择</option>${sharedInspCompanyOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="form-group"><label>用途<span class="required">*</span></label><select id="sicsAddUsage" required><option value="">请选择</option>${sharedInspUsageOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="form-group"><label>集团标准编号<span class="required">*</span></label><input type="text" id="sicsAddGroupStd" placeholder="如：STD-XXX-001" required></div>
        <div class="form-group"><label>集团标准名称<span class="required">*</span></label><input type="text" id="sicsAddGroupStdName" placeholder="请输入集团标准名称" required></div>
        <div class="form-group"><label>本地标准编号<span class="required">*</span></label><input type="text" id="sicsAddMappedStd" placeholder="如：BUCH-API-XXX-001" required></div>
        <div class="form-group"><label>本地标准名称<span class="required">*</span></label><input type="text" id="sicsAddMappedStdName" placeholder="请输入本地标准名称" required></div>
        <div class="form-group full"><label>差异说明</label><textarea id="sicsAddDiff" rows="2" placeholder="描述与集团标准的差异项，如无差异填"无"></textarea></div>
        <div class="form-group"><label>映射日期</label><input type="date" id="sicsAddDate"></div>
      </form>`,
      [{text:'取消',cls:'btn-secondary',action:closeModal},
       {text:'确认新建',cls:'btn-primary',action:()=>{ SharedInspCompStd.saveNew(); }}],'modal-xl');
    setTimeout(()=>{ const el=document.getElementById('sicsAddDate'); if(el) el.value=new Date().toISOString().slice(0,10); },50);
  },

  saveNew(){
    const company=document.getElementById('sicsAddCompany').value;
    const usage=document.getElementById('sicsAddUsage').value;
    const groupStd=document.getElementById('sicsAddGroupStd').value.trim();
    const groupStdName=document.getElementById('sicsAddGroupStdName').value.trim();
    const mappedStd=document.getElementById('sicsAddMappedStd').value.trim();
    const mappedStdName=document.getElementById('sicsAddMappedStdName').value.trim();
    if(!company||!usage||!groupStd||!groupStdName||!mappedStd||!mappedStdName){ toast('请填写必填项'); return; }
    const companyOpt=sharedInspCompanyOptions.find(o=>o.value===company);
    const usageOpt=sharedInspUsageOptions.find(o=>o.value===usage);
    const n={
      id:'CS'+String(sharedInspCompStdData.length+1).padStart(3,'0'),
      companyCode:company, companyName:companyOpt?companyOpt.label:company,
      usageCode:usage, usageName:usageOpt?usageOpt.label:usage,
      groupStdCode:groupStd, groupStdName:groupStdName,
      mappedStdCode:mappedStd, mappedStdName:mappedStdName,
      mappingDate:document.getElementById('sicsAddDate').value||new Date().toISOString().slice(0,10),
      mappingBy:'当前用户',
      differences:document.getElementById('sicsAddDiff').value.trim()||'无差异，直接引用集团标准',
      status:'active', sapSyncStatus:'pending'
    };
    sharedInspCompStdData.push(n); closeModal(); this.init();
    document.getElementById('contentArea').innerHTML=this.render(); this.init();
    toast('标准映射已创建，待推送SAP');
  },

  detail(id){
    const d=sharedInspCompStdData.find(x=>x.id===id); if(!d) return;
    const sapBadges={synced:'<span class="badge badge-green">已同步</span>',pending:'<span class="badge badge-blue">待同步</span>',failed:'<span class="badge badge-red">失败</span>'};
    const body=`<div class="detail-grid">
      <div class="detail-item"><dt>子公司</dt><dd>${esc(d.companyName)} (${esc(d.companyCode)})</dd></div>
      <div class="detail-item"><dt>用途</dt><dd>${esc(d.usageName)}</dd></div>
      <div class="detail-item"><dt>集团标准编号</dt><dd style="font-weight:600;">${esc(d.groupStdCode)}</dd></div>
      <div class="detail-item"><dt>集团标准名称</dt><dd>${esc(d.groupStdName)}</dd></div>
      <div class="detail-item"><dt>本地标准编号</dt><dd style="font-weight:600;color:#2563eb;">${esc(d.mappedStdCode)}</dd></div>
      <div class="detail-item"><dt>本地标准名称</dt><dd>${esc(d.mappedStdName)}</dd></div>
      <div class="detail-item"><dt>映射日期</dt><dd>${d.mappingDate}</dd></div>
      <div class="detail-item"><dt>映射人</dt><dd>${esc(d.mappingBy)}</dd></div>
      <div class="detail-item"><dt>状态</dt><dd>${d.status==='active'?'<span class="badge badge-green">生效中</span>':'<span class="badge badge-gray">已停用</span>'}</dd></div>
      <div class="detail-item"><dt>SAP同步状态</dt><dd>${sapBadges[d.sapSyncStatus]||d.sapSyncStatus}</dd></div>
      <div class="detail-item" style="grid-column:1/-1;"><dt>差异说明</dt><dd>${esc(d.differences)}</dd></div>
    </div>`;
    showModal('标准映射详情',body,[{text:'关闭',cls:'btn-secondary',action:closeModal}],'modal-lg');
  },

  editModal(id){
    const d=sharedInspCompStdData.find(x=>x.id===id); if(!d) return;
    showModal('编辑公司标准映射',
      `<form id="sicsEditForm" onsubmit="return false;" style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
        <div class="form-group"><label>本地标准编号</label><input type="text" id="sicsEditMappedStd" value="${esc(d.mappedStdCode)}"></div>
        <div class="form-group"><label>本地标准名称</label><input type="text" id="sicsEditMappedStdName" value="${esc(d.mappedStdName)}"></div>
        <div class="form-group full"><label>差异说明</label><textarea id="sicsEditDiff" rows="2">${esc(d.differences)}</textarea></div>
      </form>`,
      [{text:'取消',cls:'btn-secondary',action:closeModal},
       {text:'保存修改',cls:'btn-primary',action:()=>{
        d.mappedStdCode=document.getElementById('sicsEditMappedStd').value.trim()||d.mappedStdCode;
        d.mappedStdName=document.getElementById('sicsEditMappedStdName').value.trim()||d.mappedStdName;
        d.differences=document.getElementById('sicsEditDiff').value.trim()||d.differences;
        d.sapSyncStatus='pending';
        closeModal(); this.init();
        document.getElementById('contentArea').innerHTML=this.render(); this.init();
        toast('映射已更新，请重新推送SAP');
      }}],'modal-lg');
  },

  syncSap(id){
    const d=sharedInspCompStdData.find(x=>x.id===id); if(!d) return;
    const prevStatus=d.sapSyncStatus;
    d.sapSyncStatus='synced';
    this.init();
    document.getElementById('contentArea').innerHTML=this.render(); this.init();
    toast('SAP同步成功：('+d.companyName+') '+d.mappedStdCode+(prevStatus==='failed'?' 已修复重推':''));
  }
};
