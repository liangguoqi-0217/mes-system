// ===== 检验结果录入（项目级） =====
const sharedInspResultData = [
  { id:'IR001', batchNo:'B202501001', materialCode:'RAW-001', materialName:'盐酸二甲双胍', supplier:'山东新华制药', lotNo:'L2025001', receivedQty:'500kg', sampleQty:'200g', inspectStdCode:'STD-MET-001', inspectStdName:'二甲双胍原料检验标准', projectCode:'P2025-001', projectName:'二甲双胍片2025年生产项目', resultDate:'2025-01-20', inspector:'王检验员', reviewBy:'李主管', status:'completed', conclusion:'合格', sapPosted:true, results:[{item:'外观',spec:'白色结晶性粉末',value:'白色结晶性粉末',result:'合格'},{item:'含量',spec:'98.0%~102.0%',value:'99.5%',result:'合格'},{item:'有关物质',spec:'≤0.5%',value:'0.12%',result:'合格'},{item:'干燥失重',spec:'≤0.5%',value:'0.23%',result:'合格'},{item:'重金属',spec:'≤20ppm',value:'<5ppm',result:'合格'},{item:'微生物限度',spec:'≤100 CFU/g',value:'<10 CFU/g',result:'合格'}] },
  { id:'IR002', batchNo:'B202502001', materialCode:'RAW-002', materialName:'阿莫西林', supplier:'华北制药', lotNo:'L2025020', receivedQty:'300kg', sampleQty:'150g', inspectStdCode:'STD-AMX-001', inspectStdName:'阿莫西林原料检验标准', projectCode:'P2025-001', projectName:'二甲双胍片2025年生产项目', resultDate:'2025-02-10', inspector:'赵检验员', reviewBy:'李主管', status:'completed', conclusion:'合格', sapPosted:true, results:[{item:'外观',spec:'白色或类白色粉末',value:'白色粉末',result:'合格'},{item:'含量',spec:'≥95.0%',value:'98.2%',result:'合格'},{item:'水分',spec:'≤12.0%',value:'11.5%',result:'合格'},{item:'pH值',spec:'3.5-5.5',value:'4.2',result:'合格'}] },
  { id:'IR003', batchNo:'B202503001', materialCode:'AUX-001', materialName:'微晶纤维素', supplier:'安徽山河药辅', lotNo:'L2025031', receivedQty:'200kg', sampleQty:'100g', inspectStdCode:'STD-MCC-001', inspectStdName:'微晶纤维素检验标准', projectCode:'P2025-001', projectName:'二甲双胍片2025年生产项目', resultDate:'2025-03-05', inspector:'王检验员', reviewBy:'张组长', status:'pending_review', conclusion:'待复核', sapPosted:false, results:[{item:'外观',spec:'白色或类白色粉末',value:'白色粉末',result:'合格'},{item:'粒度分布',spec:'通过60目>=99%',value:'99.5%',result:'合格'},{item:'干燥失重',spec:'≤7.0%',value:'5.2%',result:'合格'},{item:'pH值',spec:'5.0-7.5',value:'6.3',result:'合格'}] },
  { id:'IR004', batchNo:'B202504001', materialCode:'PACK-001', materialName:'铝塑包装膜', supplier:'江苏中金玛泰', lotNo:'L2025042', receivedQty:'100卷', sampleQty:'3卷', inspectStdCode:'STD-ALM-001', inspectStdName:'铝塑包装膜检验标准', projectCode:'P2025-002', projectName:'阿莫西林胶囊2025年生产项目', resultDate:'2025-04-01', inspector:'赵检验员', reviewBy:'李主管', status:'completed', conclusion:'不合格', sapPosted:true, results:[{item:'外观',spec:'表面平整、无气泡',value:'有轻微气泡',result:'不合格'},{item:'厚度',spec:'0.15±0.02mm',value:'0.14mm',result:'不合格'},{item:'热合强度',spec:'≥5.0 N/15mm',value:'4.8 N/15mm',result:'不合格'}] },
  { id:'IR005', batchNo:'B202505001', materialCode:'AUX-002', materialName:'硬脂酸镁', supplier:'湖州展望药业', lotNo:'L2025053', receivedQty:'50kg', sampleQty:'50g', inspectStdCode:'STD-MGS-001', inspectStdName:'硬脂酸镁检验标准', projectCode:'P2025-002', projectName:'阿莫西林胶囊2025年生产项目', resultDate:'2025-05-15', inspector:'王检验员', reviewBy:'张组长', status:'draft', conclusion:'-', sapPosted:false, results:[{item:'外观',spec:'白色细腻粉末',value:'-',result:'待检'},{item:'含量',spec:'4.0%~5.0%',value:'-',result:'待检'},{item:'干燥失重',spec:'≤4.0%',value:'-',result:'待检'}] },
  { id:'IR006', batchNo:'B202506001', materialCode:'RAW-001', materialName:'盐酸二甲双胍', supplier:'山东新华制药', lotNo:'L2025064', receivedQty:'600kg', sampleQty:'200g', inspectStdCode:'STD-MET-001', inspectStdName:'二甲双胍原料检验标准', projectCode:'P2025-003', projectName:'二甲双胍缓释片2025项目', resultDate:'2025-06-05', inspector:'赵检验员', reviewBy:'李主管', status:'completed', conclusion:'合格', sapPosted:false, results:[{item:'外观',spec:'白色结晶性粉末',value:'白色结晶性粉末',result:'合格'},{item:'含量',spec:'98.0%~102.0%',value:'99.8%',result:'合格'},{item:'有关物质',spec:'≤0.5%',value:'0.08%',result:'合格'},{item:'干燥失重',spec:'≤0.5%',value:'0.19%',result:'合格'}] }
];

const sharedInspProjectOptions = [
  {value:'P2025-001',label:'二甲双胍片2025年生产项目'},
  {value:'P2025-002',label:'阿莫西林胶囊2025年生产项目'},
  {value:'P2025-003',label:'二甲双胍缓释片2025项目'}
];

const SharedInspResultEntry = {
  page:1, pageSize:10, filtered:[],

  render(){ this.filtered=[...sharedInspResultData]; this.page=1;
    return `<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="padding:10px 20px;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;flex-shrink:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div><div style="font-size:15px;font-weight:700;">检验结果录入（项目级）</div><div style="font-size:12px;opacity:0.7;">按项目维度录入来料检验结果，支持子表逐项录入</div></div>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="SharedInspResultEntry.addModal()">+ 新建检验记录</button>
        </div>
      </div>
      <div class="filter-bar" style="flex-shrink:0;">
        <div class="filter-group"><label>批次号</label><input type="text" id="sireBatchNo" placeholder="模糊查询"></div>
        <div class="filter-group"><label>物料信息</label><input type="text" id="sireMaterial" placeholder="物料号/名称"></div>
        <div class="filter-group"><label>关联项目</label><select id="sireProject"><option value="">全部</option>${sharedInspProjectOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>状态</label><select id="sireStatus"><option value="">全部</option><option value="draft">草稿</option><option value="pending_review">待复核</option><option value="completed">已完成</option></select></div>
        <div class="filter-group"><label>判定结论</label><select id="sireConclusion"><option value="">全部</option><option value="合格">合格</option><option value="不合格">不合格</option></select></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="SharedInspResultEntry.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="SharedInspResultEntry.reset()">重置</button>
        </div>
      </div>
      <div class="table-wrapper" style="flex:1;overflow-x:auto;">
        <table class="data-table" style="min-width:1200px;"><thead><tr>
          <th>批次号</th><th>物料号</th><th>物料名称</th><th>供应商</th><th>到货量</th><th>检验标准</th><th>关联项目</th><th>检验日期</th><th>检验员</th><th>状态</th><th>结论</th><th>SAP</th><th>操作</th>
        </tr></thead><tbody id="sireTableBody"></tbody></table>
      </div>
      <div class="list-toolbar" style="flex-shrink:0;">
        <div class="list-info"><span class="list-count" id="sireCount">共 ${this.filtered.length} 条</span></div>
        <div class="pagination">
          <button class="pagination-btn" id="sirePrev" disabled onclick="SharedInspResultEntry.prevPage()">‹</button>
          <span class="pagination-info" id="sirePageInfo">第 1 / ${Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)} 页</span>
          <button class="pagination-btn" id="sireNext" onclick="SharedInspResultEntry.nextPage()">›</button>
          <select class="page-size-select" id="sirePageSizeSel" onchange="SharedInspResultEntry.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
        </div>
      </div>
    </div>`;
  },

  init(){ this.filtered=[...sharedInspResultData]; this.page=1; this.renderTable(); },

  renderTable(){
    const start=(this.page-1)*this.pageSize, page=this.filtered.slice(start,start+this.pageSize);
    const totalPages=Math.ceil(Math.max(this.filtered.length,1)/this.pageSize);
    document.getElementById('sireCount').textContent='共 '+this.filtered.length+' 条';
    document.getElementById('sirePageInfo').textContent='第 '+this.page+' / '+totalPages+' 页';
    document.getElementById('sirePrev').disabled=this.page<=1;
    document.getElementById('sireNext').disabled=this.page>=totalPages;
    document.getElementById('sirePageSizeSel').value=this.pageSize;
    const tbody=document.getElementById('sireTableBody'); if(!tbody) return;
    if(!page.length){ tbody.innerHTML='<tr><td colspan="13" style="text-align:center;padding:40px;color:var(--text-muted);">暂无匹配的数据</td></tr>'; return; }
    const statusBadges={draft:'<span class="badge badge-blue">草稿</span>',pending_review:'<span class="badge badge-yellow">待复核</span>',completed:'<span class="badge badge-green">已完成</span>'};
    tbody.innerHTML=page.map(d=>{
      const projOpt=sharedInspProjectOptions.find(o=>o.value===d.projectCode);
      return `<tr>
        <td style="color:#2563eb;font-weight:600;">${esc(d.batchNo)}</td>
        <td>${esc(d.materialCode)}</td><td>${esc(d.materialName)}</td>
        <td>${esc(d.supplier)}</td><td>${esc(d.receivedQty)}</td>
        <td title="${esc(d.inspectStdName)}">${esc(d.inspectStdCode)}</td>
        <td style="font-size:12px;">${projOpt?projOpt.label:d.projectCode}</td>
        <td style="font-size:12px;">${d.resultDate}</td><td>${esc(d.inspector)}</td>
        <td>${statusBadges[d.status]||d.status}</td>
        <td>${d.conclusion==='合格'?'<span class="badge badge-green">合格</span>':d.conclusion==='不合格'?'<span class="badge badge-red">不合格</span>':d.conclusion==='待复核'?'<span class="badge badge-yellow">待复核</span>':'<span class="badge badge-gray">-</span>'}</td>
        <td>${d.sapPosted?'<span class="badge badge-green">已传</span>':'<span class="badge badge-gray">未传</span>'}</td>
        <td><div class="table-actions">
          <button class="btn btn-sm btn-outline" onclick="SharedInspResultEntry.detail('${d.id}')">查看</button>
          ${d.status==='draft'?`<button class="btn btn-sm btn-blue" onclick="SharedInspResultEntry.editResult('${d.id}')">录入结果</button>`:''}
          ${d.status==='pending_review'?`<button class="btn btn-sm btn-success" onclick="SharedInspResultEntry.review('${d.id}')">复核</button>`:''}
          ${d.status==='completed'&&!d.sapPosted?`<button class="btn btn-sm btn-blue" onclick="SharedInspResultEntry.postSap('${d.id}')">传SAP</button>`:''}
        </div></td>
      </tr>`;
    }).join('');
  },

  search(){
    const batchNo=(document.getElementById('sireBatchNo').value||'').trim().toLowerCase();
    const material=(document.getElementById('sireMaterial').value||'').trim().toLowerCase();
    const project=document.getElementById('sireProject').value;
    const status=document.getElementById('sireStatus').value;
    const conclusion=document.getElementById('sireConclusion').value;
    this.filtered=sharedInspResultData.filter(d=>{
      if(batchNo && !d.batchNo.toLowerCase().includes(batchNo)) return false;
      if(material && !d.materialCode.toLowerCase().includes(material) && !d.materialName.toLowerCase().includes(material)) return false;
      if(project && d.projectCode!==project) return false;
      if(status && d.status!==status) return false;
      if(conclusion && d.conclusion!==conclusion) return false;
      return true;
    });
    this.page=1; this.renderTable();
  },

  reset(){
    document.getElementById('sireBatchNo').value='';
    document.getElementById('sireMaterial').value='';
    document.getElementById('sireProject').value='';
    document.getElementById('sireStatus').value='';
    document.getElementById('sireConclusion').value='';
    this.filtered=[...sharedInspResultData]; this.page=1; this.renderTable();
  },

  prevPage(){ if(this.page>1){ this.page--; this.renderTable(); } },
  nextPage(){ if(this.page<Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)){ this.page++; this.renderTable(); } },
  changePageSize(){ this.pageSize=parseInt(document.getElementById('sirePageSizeSel').value); this.page=1; this.renderTable(); },

  addModal(){
    showModal('新建检验记录',
      `<form id="sireAddForm" onsubmit="return false;" style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
        <div class="form-group"><label>批次号<span class="required">*</span></label><input type="text" id="sireAddBatchNo" placeholder="如：B2025XXXXXX" required></div>
        <div class="form-group"><label>物料号<span class="required">*</span></label><input type="text" id="sireAddMatCode" placeholder="如：RAW-001" required></div>
        <div class="form-group"><label>物料名称<span class="required">*</span></label><input type="text" id="sireAddMatName" placeholder="请输入物料名称" required></div>
        <div class="form-group"><label>供应商<span class="required">*</span></label><input type="text" id="sireAddSupplier" placeholder="请输入供应商" required></div>
        <div class="form-group"><label>供应商批号</label><input type="text" id="sireAddLotNo" placeholder="供应商批次号"></div>
        <div class="form-group"><label>到货数量</label><input type="text" id="sireAddReceivedQty" placeholder="如：500kg"></div>
        <div class="form-group"><label>取样数量</label><input type="text" id="sireAddSampleQty" placeholder="如：200g"></div>
        <div class="form-group"><label>检验标准编号<span class="required">*</span></label><input type="text" id="sireAddStdCode" placeholder="如：STD-XXX-001" required></div>
        <div class="form-group"><label>关联项目<span class="required">*</span></label><select id="sireAddProject" required><option value="">请选择</option>${sharedInspProjectOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="form-group"><label>检验员<span class="required">*</span></label><input type="text" id="sireAddInspector" placeholder="检验员姓名" required></div>
        <div class="form-group"><label>检验日期</label><input type="date" id="sireAddDate"></div>
      </form>`,
      [{text:'取消',cls:'btn-secondary',action:closeModal},
       {text:'确认创建',cls:'btn-primary',action:()=>{ SharedInspResultEntry.saveNew(); }}],'modal-xl');
    setTimeout(()=>{ const el=document.getElementById('sireAddDate'); if(el) el.value=new Date().toISOString().slice(0,10); },50);
  },

  saveNew(){
    const batchNo=document.getElementById('sireAddBatchNo').value.trim();
    const matCode=document.getElementById('sireAddMatCode').value.trim();
    const matName=document.getElementById('sireAddMatName').value.trim();
    if(!batchNo||!matCode||!matName){ toast('请填写必填项'); return; }
    const n={
      id:'IR'+String(sharedInspResultData.length+1).padStart(3,'0'),
      batchNo:batchNo, materialCode:matCode, materialName:matName,
      supplier:document.getElementById('sireAddSupplier').value.trim(),
      lotNo:document.getElementById('sireAddLotNo').value.trim()||'-',
      receivedQty:document.getElementById('sireAddReceivedQty').value.trim()||'-',
      sampleQty:document.getElementById('sireAddSampleQty').value.trim()||'-',
      inspectStdCode:document.getElementById('sireAddStdCode').value.trim()||'-',
      inspectStdName:'待引用',
      projectCode:document.getElementById('sireAddProject').value,
      projectName:(sharedInspProjectOptions.find(o=>o.value===document.getElementById('sireAddProject').value)||{}).label||'',
      resultDate:document.getElementById('sireAddDate').value||new Date().toISOString().slice(0,10),
      inspector:document.getElementById('sireAddInspector').value.trim()||'-',
      reviewBy:'', status:'draft', conclusion:'-', sapPosted:false, results:[]
    };
    sharedInspResultData.push(n); closeModal(); this.init();
    document.getElementById('contentArea').innerHTML=this.render(); this.init();
    toast('检验记录已创建，请录入具体检验结果');
  },

  detail(id){
    const d=sharedInspResultData.find(x=>x.id===id); if(!d) return;
    const projOpt=sharedInspProjectOptions.find(o=>o.value===d.projectCode);
    let resultsHtml='';
    if(d.results && d.results.length>0){
      resultsHtml=`<div style="margin-top:16px;"><div class="form-section-title">检验结果明细</div>
        <table style="width:100%;border-collapse:collapse;margin-top:8px;"><thead><tr style="background:#f8fafc;">
          <th style="padding:8px;border:1px solid var(--border);text-align:left;font-size:12px;">检验项目</th>
          <th style="padding:8px;border:1px solid var(--border);text-align:left;font-size:12px;">标准规格</th>
          <th style="padding:8px;border:1px solid var(--border);text-align:left;font-size:12px;">实测值</th>
          <th style="padding:8px;border:1px solid var(--border);text-align:left;font-size:12px;">判定</th>
        </tr></thead><tbody>${d.results.map(r=>`<tr>
          <td style="padding:6px 8px;border:1px solid var(--border);font-size:12px;">${esc(r.item)}</td>
          <td style="padding:6px 8px;border:1px solid var(--border);font-size:12px;">${esc(r.spec)}</td>
          <td style="padding:6px 8px;border:1px solid var(--border);font-size:12px;font-weight:600;">${esc(r.value)}</td>
          <td style="padding:6px 8px;border:1px solid var(--border);font-size:12px;">${r.result==='合格'?'<span class="badge badge-green">合格</span>':r.result==='不合格'?'<span class="badge badge-red">不合格</span>':r.result==='待检'?'<span class="badge badge-gray">待检</span>':esc(r.result)}</td>
        </tr>`).join('')}</tbody></table></div>`;
    }
    const statusBadges={draft:'<span class="badge badge-blue">草稿</span>',pending_review:'<span class="badge badge-yellow">待复核</span>',completed:'<span class="badge badge-green">已完成</span>'};
    const body=`<div class="detail-grid">
      <div class="detail-item"><dt>批次号</dt><dd style="font-weight:600;">${esc(d.batchNo)}</dd></div>
      <div class="detail-item"><dt>物料信息</dt><dd>${esc(d.materialCode)} ${esc(d.materialName)}</dd></div>
      <div class="detail-item"><dt>供应商</dt><dd>${esc(d.supplier)} (批号:${esc(d.lotNo)})</dd></div>
      <div class="detail-item"><dt>到货/取样量</dt><dd>${esc(d.receivedQty)} / ${esc(d.sampleQty)}</dd></div>
      <div class="detail-item"><dt>检验标准</dt><dd>${esc(d.inspectStdCode)}</dd></div>
      <div class="detail-item"><dt>关联项目</dt><dd>${projOpt?projOpt.label:d.projectCode}</dd></div>
      <div class="detail-item"><dt>检验日期</dt><dd>${d.resultDate}</dd></div>
      <div class="detail-item"><dt>检验员 / 复核人</dt><dd>${esc(d.inspector)} / ${esc(d.reviewBy||'-')}</dd></div>
      <div class="detail-item"><dt>状态</dt><dd>${statusBadges[d.status]||d.status}</dd></div>
      <div class="detail-item"><dt>判定结论</dt><dd>${d.conclusion==='合格'?'<span class="badge badge-green">合格</span>':d.conclusion==='不合格'?'<span class="badge badge-red">不合格</span>':'<span class="badge badge-gray">-</span>'}</dd></div>
    </div>${resultsHtml}`;
    showModal('检验记录详情 - '+d.batchNo,body,[{text:'关闭',cls:'btn-secondary',action:closeModal}],'modal-xl');
  },

  editResult(id){
    const d=sharedInspResultData.find(x=>x.id===id); if(!d) return;
    let templateItems='';
    if(d.results.length===0){
      templateItems='<p style="font-size:13px;color:var(--text-secondary);margin-bottom:8px;">暂未设置检验项目，请依据检验标准手动添加：</p>'
        +'<div id="sireResultItems"><div style="display:grid;grid-template-columns:1fr 1fr 1fr 80px;gap:8px;align-items:end;margin-bottom:8px;">'
        +'<div class="form-group" style="margin:0;"><label>检验项目</label><input type="text" placeholder="如：外观"></div>'
        +'<div class="form-group" style="margin:0;"><label>标准规格</label><input type="text" placeholder="如：白色粉末"></div>'
        +'<div class="form-group" style="margin:0;"><label>实测值</label><input type="text" placeholder="实测结果"></div>'
        +'<div class="form-group" style="margin:0;"><label>判定</label><select><option value="合格">合格</option><option value="不合格">不合格</option></select></div></div></div>'
        +'<button class="btn btn-sm btn-outline" style="margin-top:8px;" onclick="SharedInspResultEntry._addItemRow()">+ 添加检验项目</button>';
    }
    showModal('录入检验结果 - '+d.batchNo,
      `<form id="sireEditForm" onsubmit="return false;">
        <div class="form-section-title">检验结果逐项录入</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">物料：${esc(d.materialName)} | 检验标准：${esc(d.inspectStdCode)}</div>
        ${templateItems||''}
        ${d.results.length>0?`<div id="sireResultItems">${d.results.map((r,i)=>`<div style="display:grid;grid-template-columns:1fr 1fr 1fr 80px;gap:8px;align-items:end;margin-bottom:8px;">
          <div class="form-group" style="margin:0;"><label>检验项目</label><input type="text" value="${esc(r.item)}" data-idx="${i}" class="sire-item-name"></div>
          <div class="form-group" style="margin:0;"><label>标准规格</label><input type="text" value="${esc(r.spec)}" data-idx="${i}" class="sire-item-spec"></div>
          <div class="form-group" style="margin:0;"><label>实测值</label><input type="text" value="${esc(r.value)}" data-idx="${i}" class="sire-item-value" placeholder="请输入实测值"></div>
          <div class="form-group" style="margin:0;"><label>判定</label><select data-idx="${i}" class="sire-item-result"><option value="合格" ${r.result==='合格'?'selected':''}>合格</option><option value="不合格" ${r.result==='不合格'?'selected':''}>不合格</option></select></div>
        </div>`).join('')}</div>`:''}
      </form>`,
      [{text:'保存草稿',cls:'btn-secondary',action:()=>{ closeModal(); toast('检验结果已保存为草稿'); }},
       {text:'提交复核',cls:'btn-primary',action:()=>{
        const items=document.querySelectorAll('#sireResultItems > div');
        d.results=[];
        items.forEach(div=>{
          const name=div.querySelector('.sire-item-name'); 
          const spec=div.querySelector('.sire-item-spec');
          const value=div.querySelector('.sire-item-value');
          const result=div.querySelector('.sire-item-result');
          if(name&&value){
            const val=value.value.trim();
            const res=result?result.value:'-';
            d.results.push({item:name.value.trim()||'-',spec:spec?spec.value.trim():'-',value:val||'-',result:res});
          }
        });
        const allPass=d.results.every(r=>r.result==='合格'||r.result==='待检');
        d.conclusion=allPass?'合格':'不合格'; d.status='pending_review';
        d.resultDate=new Date().toISOString().slice(0,10);
        closeModal(); this.init();
        document.getElementById('contentArea').innerHTML=this.render(); this.init();
        toast('检验结果已提交复核，判定结论：'+d.conclusion);
      }}],'modal-xl');
  },

  _addItemRow(){
    const container=document.getElementById('sireResultItems');
    if(!container) return;
    const div=document.createElement('div');
    div.style.cssText='display:grid;grid-template-columns:1fr 1fr 1fr 80px;gap:8px;align-items:end;margin-bottom:8px;';
    div.innerHTML=`<div class="form-group" style="margin:0;"><label>检验项目</label><input type="text" placeholder="项目名称" class="sire-item-name"></div>
      <div class="form-group" style="margin:0;"><label>标准规格</label><input type="text" placeholder="规格要求" class="sire-item-spec"></div>
      <div class="form-group" style="margin:0;"><label>实测值</label><input type="text" placeholder="实测结果" class="sire-item-value"></div>
      <div class="form-group" style="margin:0;"><label>判定</label><select class="sire-item-result"><option value="合格">合格</option><option value="不合格">不合格</option></select></div>`;
    container.appendChild(div);
  },

  review(id){
    const d=sharedInspResultData.find(x=>x.id===id); if(!d) return;
    showModal('复核检验结果 - '+d.batchNo,
      `<div><div class="form-section-title">复核确认</div>
        <p style="font-size:13px;color:var(--text-secondary);">批次号：${esc(d.batchNo)} | 物料：${esc(d.materialName)} | 判定结论：<strong>${d.conclusion}</strong></p>
        <div class="form-group"><label>复核意见</label><textarea id="sireReviewComment" rows="2" placeholder="输入复核意见"></textarea></div>
        <div class="form-group"><label>复核人</label><input type="text" id="sireReviewBy" value="李主管"></div>
      </div>`,
      [{text:'驳回',cls:'btn-warning',action:()=>{
        d.status='draft'; d.reviewBy=document.getElementById('sireReviewBy').value.trim();
        closeModal(); this.init(); document.getElementById('contentArea').innerHTML=this.render(); this.init();
        toast('检验记录已驳回，请重新录入');
      }},
       {text:'复核通过',cls:'btn-primary',action:()=>{
        d.status='completed'; d.reviewBy=document.getElementById('sireReviewBy').value.trim();
        closeModal(); this.init(); document.getElementById('contentArea').innerHTML=this.render(); this.init();
        toast('复核通过，检验记录已完成');
      }}],'modal-lg');
  },

  postSap(id){
    const d=sharedInspResultData.find(x=>x.id===id); if(!d) return;
    d.sapPosted=true;
    this.init(); document.getElementById('contentArea').innerHTML=this.render(); this.init();
    toast('SAP传输成功：批次 '+d.batchNo+' 检验结果已传至SAP QM模块');
  }
};
