// ===== 物料-用途-检验标准库（集团主数据） =====
const sharedInspMatUseStdData = [
  { id:'MS001', materialCode:'RAW-001', materialName:'盐酸二甲双胍', spec:'USP42', usage:'原料药生产', usageCode:'USG-API', inspectStdCode:'STD-MET-001', inspectStdName:'二甲双胍原料检验标准', inspectItems:'外观,含量,有关物质,干燥失重,炽灼残渣,重金属,微生物限度', sampleMethod:'GB/T 2828.1', aqlLevel:'AQL=0.65', validFrom:'2025-01-01', validTo:'2027-12-31', status:'active', createdBy:'集团质量部', updatedAt:'2025-12-20 14:30' },
  { id:'MS002', materialCode:'RAW-002', materialName:'阿莫西林', spec:'CP2020', usage:'制剂原料', usageCode:'USG-FORM', inspectStdCode:'STD-AMX-001', inspectStdName:'阿莫西林原料检验标准', inspectItems:'外观,含量,有关物质,水分,比旋度,pH值,微生物限度', sampleMethod:'GB/T 2828.1', aqlLevel:'AQL=0.65', validFrom:'2025-03-01', validTo:'2027-03-01', status:'active', createdBy:'集团质量部', updatedAt:'2025-11-15 09:20' },
  { id:'MS003', materialCode:'AUX-001', materialName:'微晶纤维素', spec:'CP2020', usage:'辅料', usageCode:'USG-EXC', inspectStdCode:'STD-MCC-001', inspectStdName:'微晶纤维素检验标准', inspectItems:'外观,粒度分布,堆积密度,干燥失重,炽灼残渣,pH值,微生物限度', sampleMethod:'GB/T 2828.1', aqlLevel:'AQL=1.0', validFrom:'2025-04-01', validTo:'2027-04-01', status:'active', createdBy:'集团质量部', updatedAt:'2025-10-08 16:45' },
  { id:'MS004', materialCode:'AUX-002', materialName:'硬脂酸镁', spec:'CP2020', usage:'辅料', usageCode:'USG-EXC', inspectStdCode:'STD-MGS-001', inspectStdName:'硬脂酸镁检验标准', inspectItems:'外观,含量,干燥失重,氯化物,硫酸盐,重金属,微生物限度', sampleMethod:'GB/T 2828.1', aqlLevel:'AQL=1.0', validFrom:'2025-04-15', validTo:'2027-04-15', status:'active', createdBy:'集团质量部', updatedAt:'2025-09-22 10:00' },
  { id:'MS005', materialCode:'PACK-001', materialName:'铝塑包装膜', spec:'YBB00202005', usage:'内包材', usageCode:'USG-PACK', inspectStdCode:'STD-ALM-001', inspectStdName:'铝塑包装膜检验标准', inspectItems:'外观,厚度,热合强度,水蒸气透过率,氧气透过率,残留溶剂,微生物限度', sampleMethod:'GB/T 2828.1', aqlLevel:'AQL=0.65', validFrom:'2025-05-01', validTo:'2027-05-01', status:'active', createdBy:'集团质量部', updatedAt:'2025-08-18 11:30' },
  { id:'MS006', materialCode:'FIN-001', materialName:'盐酸二甲双胍片', spec:'USP42', usage:'成品', usageCode:'USG-FIN', inspectStdCode:'STD-MET-TAB-001', inspectStdName:'二甲双胍片成品检验标准', inspectItems:'外观,含量,含量均匀度,溶出度,有关物质,微生物限度', sampleMethod:'GB/T 2828.1', aqlLevel:'AQL=0.4', validFrom:'2025-02-01', validTo:'2027-02-01', status:'active', createdBy:'集团质量部', updatedAt:'2025-11-01 14:00' },
  { id:'MS007', materialCode:'RAW-003', materialName:'阿司匹林', spec:'USP42', usage:'原料药生产', usageCode:'USG-API', inspectStdCode:'STD-ASP-001', inspectStdName:'阿司匹林原料检验标准', inspectItems:'外观,含量,有关物质,游离水杨酸,干燥失重,重金属,微生物限度', sampleMethod:'GB/T 2828.1', aqlLevel:'AQL=0.65', validFrom:'2025-06-01', validTo:'2027-06-01', status:'inactive', createdBy:'陕西步长质量部', updatedAt:'2025-07-10 08:30' },
  { id:'MS008', materialCode:'AUX-003', materialName:'交联聚维酮', spec:'CP2020', usage:'辅料', usageCode:'USG-EXC', inspectStdCode:'STD-CPV-001', inspectStdName:'交联聚维酮检验标准', inspectItems:'外观,水分,炽灼残渣,重金属,过氧化物,粒度分布', sampleMethod:'GB/T 2828.1', aqlLevel:'AQL=1.0', validFrom:'2025-07-01', validTo:'2027-07-01', status:'active', createdBy:'集团质量部', updatedAt:'2025-12-01 13:20' }
];

const sharedInspUsageOptions = [
  { value:'USG-API', label:'原料药生产' },
  { value:'USG-FORM', label:'制剂原料' },
  { value:'USG-EXC', label:'辅料' },
  { value:'USG-PACK', label:'内包材' },
  { value:'USG-FIN', label:'成品' },
  { value:'USG-INT', label:'中间体' }
];

const SharedInspMatUseStd = {
  page:1, pageSize:10, filtered:[],

  render(){ this.filtered=[...sharedInspMatUseStdData]; this.page=1;
    return `<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="padding:10px 20px;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;flex-shrink:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div><div style="font-size:15px;font-weight:700;">物料-用途-检验标准库</div><div style="font-size:12px;opacity:0.7;">集团主数据 · 定义物料、用途与检验标准的统一映射关系</div></div>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="SharedInspMatUseStd.addModal()">+ 新增标准</button>
        </div>
      </div>
      <div class="filter-bar" style="flex-shrink:0;">
        <div class="filter-group"><label>物料号</label><input type="text" id="simusMaterialId" placeholder="模糊查询"></div>
        <div class="filter-group"><label>物料名称</label><input type="text" id="simusMaterialName" placeholder="模糊查询"></div>
        <div class="filter-group"><label>用途</label><select id="simusUsage"><option value="">全部</option>${sharedInspUsageOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>状态</label><select id="simusStatus"><option value="">全部</option><option value="active">生效中</option><option value="inactive">已停用</option></select></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="SharedInspMatUseStd.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="SharedInspMatUseStd.reset()">重置</button>
        </div>
      </div>
      <div class="table-wrapper" style="flex:1;overflow-x:auto;">
        <table class="data-table" style="min-width:1400px;"><thead><tr>
          <th>物料号</th><th>物料名称</th><th>规格标准</th><th>用途</th><th>检验标准编号</th><th>检验标准名称</th><th>检验项目</th><th>取样方法</th><th>AQL等级</th><th>有效期</th><th>状态</th><th>操作</th>
        </tr></thead><tbody id="simusTableBody"></tbody></table>
      </div>
      <div class="list-toolbar" style="flex-shrink:0;">
        <div class="list-info"><span class="list-count" id="simusCount">共 ${this.filtered.length} 条</span></div>
        <div class="pagination">
          <button class="pagination-btn" id="simusPrev" disabled onclick="SharedInspMatUseStd.prevPage()">‹</button>
          <span class="pagination-info" id="simusPageInfo">第 1 / ${Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)} 页</span>
          <button class="pagination-btn" id="simusNext" onclick="SharedInspMatUseStd.nextPage()">›</button>
          <select class="page-size-select" id="simusPageSizeSel" onchange="SharedInspMatUseStd.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
        </div>
      </div>
    </div>`;
  },

  init(){ this.filtered=[...sharedInspMatUseStdData]; this.page=1; this.renderTable(); },

  renderTable(){
    const start=(this.page-1)*this.pageSize, page=this.filtered.slice(start,start+this.pageSize);
    const totalPages=Math.ceil(Math.max(this.filtered.length,1)/this.pageSize);
    document.getElementById('simusCount').textContent='共 '+this.filtered.length+' 条';
    document.getElementById('simusPageInfo').textContent='第 '+this.page+' / '+totalPages+' 页';
    document.getElementById('simusPrev').disabled=this.page<=1;
    document.getElementById('simusNext').disabled=this.page>=totalPages;
    document.getElementById('simusPageSizeSel').value=this.pageSize;
    const tbody=document.getElementById('simusTableBody'); if(!tbody) return;
    if(!page.length){ tbody.innerHTML='<tr><td colspan="12" style="text-align:center;padding:40px;color:var(--text-muted);">暂无匹配的数据</td></tr>'; return; }
    tbody.innerHTML=page.map(d=>{
      const statusBadge=d.status==='active'?'<span class="badge badge-green">生效中</span>':'<span class="badge badge-gray">已停用</span>';
      const usageOpt=sharedInspUsageOptions.find(o=>o.value===d.usageCode);
      return `<tr>
        <td style="color:#2563eb;font-weight:600;">${esc(d.materialCode)}</td>
        <td>${esc(d.materialName)}</td><td>${esc(d.spec)}</td>
        <td>${usageOpt?usageOpt.label:d.usageCode}</td>
        <td style="font-weight:600;">${esc(d.inspectStdCode)}</td><td>${esc(d.inspectStdName)}</td>
        <td style="font-size:11px;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${esc(d.inspectItems)}">${esc(d.inspectItems)}</td>
        <td>${esc(d.sampleMethod)}</td><td>${esc(d.aqlLevel)}</td>
        <td style="font-size:11px;">${d.validFrom} ~ ${d.validTo}</td>
        <td>${statusBadge}</td>
        <td><div class="table-actions">
          <button class="btn btn-sm btn-outline" onclick="SharedInspMatUseStd.detail('${d.id}')">查看</button>
          <button class="btn btn-sm btn-outline" onclick="SharedInspMatUseStd.editModal('${d.id}')">编辑</button>
          <button class="btn btn-sm ${d.status==='active'?'btn-warning':'btn-success'}" onclick="SharedInspMatUseStd.toggleStatus('${d.id}')">${d.status==='active'?'停用':'启用'}</button>
        </div></td>
      </tr>`;
    }).join('');
  },

  search(){
    const matId=(document.getElementById('simusMaterialId').value||'').trim().toLowerCase();
    const matName=(document.getElementById('simusMaterialName').value||'').trim().toLowerCase();
    const usage=document.getElementById('simusUsage').value;
    const status=document.getElementById('simusStatus').value;
    this.filtered=sharedInspMatUseStdData.filter(d=>{
      if(matId && !d.materialCode.toLowerCase().includes(matId)) return false;
      if(matName && !d.materialName.toLowerCase().includes(matName)) return false;
      if(usage && d.usageCode!==usage) return false;
      if(status && d.status!==status) return false;
      return true;
    });
    this.page=1; this.renderTable();
  },

  reset(){
    document.getElementById('simusMaterialId').value='';
    document.getElementById('simusMaterialName').value='';
    document.getElementById('simusUsage').value='';
    document.getElementById('simusStatus').value='';
    this.filtered=[...sharedInspMatUseStdData]; this.page=1; this.renderTable();
  },

  prevPage(){ if(this.page>1){ this.page--; this.renderTable(); } },
  nextPage(){ if(this.page<Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)){ this.page++; this.renderTable(); } },
  changePageSize(){ this.pageSize=parseInt(document.getElementById('simusPageSizeSel').value); this.page=1; this.renderTable(); },

  addModal(){
    showModal('新增检验标准',
      `<form id="simusAddForm" onsubmit="return false;" style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
        <div class="form-group"><label>物料号<span class="required">*</span></label><input type="text" id="simusAddMatCode" placeholder="请输入物料号" required></div>
        <div class="form-group"><label>物料名称<span class="required">*</span></label><input type="text" id="simusAddMatName" placeholder="请输入物料名称" required></div>
        <div class="form-group"><label>规格标准<span class="required">*</span></label><input type="text" id="simusAddSpec" placeholder="如：USP42 / CP2020" required></div>
        <div class="form-group"><label>用途<span class="required">*</span></label><select id="simusAddUsage" required><option value="">请选择</option>${sharedInspUsageOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="form-group"><label>检验标准编号<span class="required">*</span></label><input type="text" id="simusAddStdCode" placeholder="如：STD-XXX-001" required></div>
        <div class="form-group"><label>检验标准名称<span class="required">*</span></label><input type="text" id="simusAddStdName" placeholder="请输入检验标准名称" required></div>
        <div class="form-group full"><label>检验项目<span class="required">*</span></label><input type="text" id="simusAddItems" placeholder="逗号分隔多个项目" required></div>
        <div class="form-group"><label>取样方法<span class="required">*</span></label><select id="simusAddSample"><option value="GB/T 2828.1">GB/T 2828.1</option><option value="ISO 2859-1">ISO 2859-1</option><option value="全检">全检</option></select></div>
        <div class="form-group"><label>AQL等级<span class="required">*</span></label><select id="simusAddAql"><option value="AQL=0.4">AQL=0.4</option><option value="AQL=0.65">AQL=0.65</option><option value="AQL=1.0">AQL=1.0</option><option value="AQL=1.5">AQL=1.5</option></select></div>
        <div class="form-group"><label>生效日期<span class="required">*</span></label><input type="date" id="simusAddValidFrom" required></div>
        <div class="form-group"><label>截止日期<span class="required">*</span></label><input type="date" id="simusAddValidTo" required></div>
      </form>`,
      [{text:'取消',cls:'btn-secondary',action:closeModal},
       {text:'确认新增',cls:'btn-primary',action:()=>{ SharedInspMatUseStd.saveNew(); }}],'modal-xl');
    const today=new Date().toISOString().slice(0,10);
    setTimeout(()=>{ const el=document.getElementById('simusAddValidFrom'); if(el) el.value=today; },50);
  },

  saveNew(){
    const matCode=document.getElementById('simusAddMatCode').value.trim();
    const matName=document.getElementById('simusAddMatName').value.trim();
    const spec=document.getElementById('simusAddSpec').value.trim();
    const usage=document.getElementById('simusAddUsage').value;
    const stdCode=document.getElementById('simusAddStdCode').value.trim();
    const stdName=document.getElementById('simusAddStdName').value.trim();
    const items=document.getElementById('simusAddItems').value.trim();
    if(!matCode||!matName||!spec||!usage||!stdCode||!stdName||!items){ toast('请填写必填项'); return; }
    const n={
      id:'MS'+String(sharedInspMatUseStdData.length+1).padStart(3,'0'),
      materialCode:matCode, materialName:matName, spec:spec,
      usage:usage, usageCode:usage,
      inspectStdCode:stdCode, inspectStdName:stdName, inspectItems:items,
      sampleMethod:document.getElementById('simusAddSample').value,
      aqlLevel:document.getElementById('simusAddAql').value,
      validFrom:document.getElementById('simusAddValidFrom').value,
      validTo:document.getElementById('simusAddValidTo').value,
      status:'active', createdBy:'当前用户',
      updatedAt:new Date().toISOString().slice(0,19).replace('T',' ')
    };
    sharedInspMatUseStdData.push(n); closeModal(); this.init();
    document.getElementById('contentArea').innerHTML=this.render(); this.init();
    toast('检验标准新增成功');
  },

  detail(id){
    const d=sharedInspMatUseStdData.find(x=>x.id===id); if(!d) return;
    const usageOpt=sharedInspUsageOptions.find(o=>o.value===d.usageCode);
    const body=`<div class="detail-grid">
      <div class="detail-item"><dt>物料号</dt><dd>${esc(d.materialCode)}</dd></div>
      <div class="detail-item"><dt>物料名称</dt><dd>${esc(d.materialName)}</dd></div>
      <div class="detail-item"><dt>规格标准</dt><dd>${esc(d.spec)}</dd></div>
      <div class="detail-item"><dt>用途</dt><dd>${usageOpt?usageOpt.label:d.usageCode}</dd></div>
      <div class="detail-item"><dt>检验标准编号</dt><dd style="font-weight:600;">${esc(d.inspectStdCode)}</dd></div>
      <div class="detail-item"><dt>检验标准名称</dt><dd>${esc(d.inspectStdName)}</dd></div>
      <div class="detail-item" style="grid-column:1/-1;"><dt>检验项目</dt><dd>${esc(d.inspectItems)}</dd></div>
      <div class="detail-item"><dt>取样方法</dt><dd>${esc(d.sampleMethod)}</dd></div>
      <div class="detail-item"><dt>AQL等级</dt><dd>${esc(d.aqlLevel)}</dd></div>
      <div class="detail-item"><dt>有效期</dt><dd>${d.validFrom} ~ ${d.validTo}</dd></div>
      <div class="detail-item"><dt>状态</dt><dd>${d.status==='active'?'<span class="badge badge-green">生效中</span>':'<span class="badge badge-gray">已停用</span>'}</dd></div>
      <div class="detail-item"><dt>创建人</dt><dd>${esc(d.createdBy)}</dd></div>
      <div class="detail-item"><dt>更新时间</dt><dd style="font-size:12px;">${esc(d.updatedAt)}</dd></div>
    </div>`;
    showModal('检验标准详情',body,[{text:'关闭',cls:'btn-secondary',action:closeModal}],'modal-lg');
  },

  editModal(id){
    const d=sharedInspMatUseStdData.find(x=>x.id===id); if(!d) return;
    showModal('编辑检验标准',
      `<form id="simusEditForm" onsubmit="return false;" style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
        <div class="form-group"><label>检验标准名称</label><input type="text" id="simusEditStdName" value="${esc(d.inspectStdName)}"></div>
        <div class="form-group"><label>检验标准编号</label><input type="text" id="simusEditStdCode" value="${esc(d.inspectStdCode)}"></div>
        <div class="form-group full"><label>检验项目</label><input type="text" id="simusEditItems" value="${esc(d.inspectItems)}"></div>
        <div class="form-group"><label>取样方法</label><select id="simusEditSample">${['GB/T 2828.1','ISO 2859-1','全检'].map(o=>`<option value="${o}" ${d.sampleMethod===o?'selected':''}>${o}</option>`).join('')}</select></div>
        <div class="form-group"><label>AQL等级</label><select id="simusEditAql">${['AQL=0.4','AQL=0.65','AQL=1.0','AQL=1.5'].map(o=>`<option value="${o}" ${d.aqlLevel===o?'selected':''}>${o}</option>`).join('')}</select></div>
        <div class="form-group"><label>生效日期</label><input type="date" id="simusEditValidFrom" value="${d.validFrom}"></div>
        <div class="form-group"><label>截止日期</label><input type="date" id="simusEditValidTo" value="${d.validTo}"></div>
      </form>`,
      [{text:'取消',cls:'btn-secondary',action:closeModal},
       {text:'保存修改',cls:'btn-primary',action:()=>{
        d.inspectStdName=document.getElementById('simusEditStdName').value.trim()||d.inspectStdName;
        d.inspectStdCode=document.getElementById('simusEditStdCode').value.trim()||d.inspectStdCode;
        d.inspectItems=document.getElementById('simusEditItems').value.trim()||d.inspectItems;
        d.sampleMethod=document.getElementById('simusEditSample').value;
        d.aqlLevel=document.getElementById('simusEditAql').value;
        d.validFrom=document.getElementById('simusEditValidFrom').value||d.validFrom;
        d.validTo=document.getElementById('simusEditValidTo').value||d.validTo;
        d.updatedAt=new Date().toISOString().slice(0,19).replace('T',' ');
        closeModal(); this.init();
        document.getElementById('contentArea').innerHTML=this.render(); this.init();
        toast('检验标准已更新');
      }}],'modal-lg');
  },

  toggleStatus(id){
    const d=sharedInspMatUseStdData.find(x=>x.id===id); if(!d) return;
    d.status=d.status==='active'?'inactive':'active';
    d.updatedAt=new Date().toISOString().slice(0,19).replace('T',' ');
    this.init();
    document.getElementById('contentArea').innerHTML=this.render(); this.init();
    toast(d.status==='active'?'标准已启用':'标准已停用');
  }
};
