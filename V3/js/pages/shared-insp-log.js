// ===== 共享放行日志 =====
const sharedInspLogData=[
  {id:'LG001',logTime:'2025-06-05 15:00:30',batchNo:'B202506001',materialName:'盐酸二甲双胍',actionType:'放行',operator:'张主管',companyName:'山东丹红制药',detail:'共享引用山东步长 B202501001 检验结果，全面放行',result:'成功',sourceType:'共享匹配'},
  {id:'LG002',logTime:'2025-06-05 16:30:15',batchNo:'B202506001',materialName:'盐酸二甲双胍',actionType:'放行',operator:'张主管',companyName:'山东步长制药',detail:'自主检验完成，SAP放行 SAP-QM-2025-06002',result:'成功',sourceType:'自主检验'},
  {id:'LG003',logTime:'2025-06-06 09:00:45',batchNo:'B202506002',materialName:'阿莫西林',actionType:'条件放行',operator:'李主管',companyName:'通化天实制药',detail:'供应商不一致，仅引用理化数据，SAP放行 SAP-QM-2025-06003',result:'成功',sourceType:'共享匹配'},
  {id:'LG004',logTime:'2025-06-06 14:20:10',batchNo:'B202506004',materialName:'铝塑包装膜',actionType:'退货',operator:'张主管',companyName:'梅河口步长制药',detail:'外观、厚度、热合强度不合格，退货处理 SAP-QM-2025-04001',result:'成功',sourceType:'自主检验'},
  {id:'LG005',logTime:'2025-06-07 08:30:00',batchNo:'B202506005',materialName:'盐酸二甲双胍',actionType:'查询',operator:'系统',companyName:'吉林天成制药',detail:'发起共享查询，匹配到山东步长 B202501001 结果（匹配度91%）',result:'成功',sourceType:'共享匹配'},
  {id:'LG006',logTime:'2025-06-07 10:00:22',batchNo:'B202506005',materialName:'盐酸二甲双胍',actionType:'放行',operator:'李主管',companyName:'吉林天成制药',detail:'共享引用山东步长 B202501001 结果，全面放行 SAP-QM-2025-06004',result:'成功',sourceType:'共享匹配'},
  {id:'LG007',logTime:'2025-06-08 13:20:05',batchNo:'B202506007',materialName:'盐酸二甲双胍',actionType:'查询',operator:'系统',companyName:'邛崃天银制药',detail:'发起共享查询，匹配到山东步长 B202501001 结果（匹配度93%），但共享结果已超过3个月',result:'待审核',sourceType:'共享匹配'},
  {id:'LG008',logTime:'2025-06-10 15:00:18',batchNo:'B202506008',materialName:'阿莫西林',actionType:'查询',operator:'系统',companyName:'保定天浩制药',detail:'发起共享查询，部分匹配（85%），供应商不一致',result:'待审核',sourceType:'共享匹配'},
  {id:'LG009',logTime:'2025-06-01 09:30:00',batchNo:'B202506001',materialName:'盐酸二甲双胍',actionType:'查询',operator:'系统',companyName:'山东丹红制药',detail:'发起共享查询，精准匹配山东步长 B202501001（匹配度95%）',result:'成功',sourceType:'共享匹配'},
  {id:'LG010',logTime:'2025-06-03 10:15:12',batchNo:'B202506003',materialName:'微晶纤维素',actionType:'查询',operator:'系统',companyName:'辽宁奥达制药',detail:'发起共享查询，部分匹配通化谷红 B202503001（匹配度72%）',result:'部分匹配',sourceType:'共享匹配'}
];

const SharedInspLog={
  page:1,pageSize:10,filtered:[],

  render(){ this.filtered=[...sharedInspLogData]; this.page=1;
    return`<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="padding:10px 20px;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;flex-shrink:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div><div style="font-size:15px;font-weight:700;">共享放行日志</div><div style="font-size:12px;opacity:0.7;">记录所有共享查询、放行、退货等操作的完整审计日志</div></div>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;" onclick="SharedInspLog.exportLog()">📥 导出日志</button>
        </div>
      </div>
      <div class="filter-bar" style="flex-shrink:0;">
        <div class="filter-group"><label>批次号</label><input type="text" id="silBatchNo" placeholder="模糊查询"></div>
        <div class="filter-group"><label>物料名称</label><input type="text" id="silMaterial" placeholder="模糊查询"></div>
        <div class="filter-group"><label>操作类型</label><select id="silAction"><option value="">全部</option><option value="查询">查询</option><option value="放行">放行</option><option value="条件放行">条件放行</option><option value="退货">退货</option></select></div>
        <div class="filter-group"><label>结果</label><select id="silResult"><option value="">全部</option><option value="成功">成功</option><option value="待审核">待审核</option><option value="部分匹配">部分匹配</option></select></div>
        <div class="filter-group"><label>操作人/公司</label><input type="text" id="silOperator" placeholder="模糊查询"></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="SharedInspLog.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="SharedInspLog.reset()">重置</button>
        </div>
      </div>
      <div class="table-wrapper" style="flex:1;overflow-x:auto;">
        <table class="data-table" style="min-width:1200px;"><thead><tr>
          <th>时间</th><th>批次号</th><th>物料名称</th><th>操作类型</th><th>操作人</th><th>公司</th><th>操作详情</th><th>结果</th><th>来源</th>
        </tr></thead><tbody id="silTableBody"></tbody></table>
      </div>
      <div class="list-toolbar" style="flex-shrink:0;">
        <div class="list-info"><span class="list-count" id="silCount">共 ${this.filtered.length} 条</span></div>
        <div class="pagination">
          <button class="pagination-btn" id="silPrev" disabled onclick="SharedInspLog.prevPage()">‹</button>
          <span class="pagination-info" id="silPageInfo">第 1 / ${Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)} 页</span>
          <button class="pagination-btn" id="silNext" onclick="SharedInspLog.nextPage()">›</button>
          <select class="page-size-select" id="silPageSizeSel" onchange="SharedInspLog.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
        </div>
      </div>
    </div>`;
  },

  init(){ this.filtered=[...sharedInspLogData]; this.page=1; this.renderTable(); },

  renderTable(){
    const start=(this.page-1)*this.pageSize, page=this.filtered.slice(start,start+this.pageSize);
    const totalPages=Math.ceil(Math.max(this.filtered.length,1)/this.pageSize);
    document.getElementById('silCount').textContent='共 '+this.filtered.length+' 条';
    document.getElementById('silPageInfo').textContent='第 '+this.page+' / '+totalPages+' 页';
    document.getElementById('silPrev').disabled=this.page<=1;
    document.getElementById('silNext').disabled=this.page>=totalPages;
    document.getElementById('silPageSizeSel').value=this.pageSize;
    const tbody=document.getElementById('silTableBody'); if(!tbody) return;
    if(!page.length){ tbody.innerHTML='<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--text-muted);">暂无匹配的日志</td></tr>'; return; }
    const actionBadges={'查询':'<span class="badge badge-blue">查询</span>','放行':'<span class="badge badge-green">放行</span>','条件放行':'<span class="badge badge-yellow">条件放行</span>','退货':'<span class="badge badge-red">退货</span>'};
    const resultBadges={'成功':'<span class="badge badge-green">成功</span>','待审核':'<span class="badge badge-yellow">待审核</span>','部分匹配':'<span class="badge badge-blue">部分匹配</span>'};
    tbody.innerHTML=page.map(d=>`<tr>
      <td style="font-size:12px;white-space:nowrap;">${d.logTime}</td>
      <td style="color:#2563eb;font-weight:600;">${esc(d.batchNo)}</td>
      <td>${esc(d.materialName)}</td>
      <td>${actionBadges[d.actionType]||d.actionType}</td>
      <td>${esc(d.operator)}</td>
      <td>${esc(d.companyName)}</td>
      <td style="font-size:12px;max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${esc(d.detail)}">${esc(d.detail)}</td>
      <td>${resultBadges[d.result]||d.result}</td>
      <td>${d.sourceType==='共享匹配'?'<span class="badge badge-blue">共享</span>':'<span class="badge badge-gray">自主</span>'}</td>
    </tr>`).join('');
  },

  search(){
    const batchNo=(document.getElementById('silBatchNo').value||'').trim().toLowerCase();
    const material=(document.getElementById('silMaterial').value||'').trim().toLowerCase();
    const action=document.getElementById('silAction').value;
    const result=document.getElementById('silResult').value;
    const operator=(document.getElementById('silOperator').value||'').trim().toLowerCase();
    this.filtered=sharedInspLogData.filter(d=>{
      if(batchNo&&!d.batchNo.toLowerCase().includes(batchNo)) return false;
      if(material&&!d.materialName.toLowerCase().includes(material)) return false;
      if(action&&d.actionType!==action) return false;
      if(result&&d.result!==result) return false;
      if(operator&&!d.operator.toLowerCase().includes(operator)&&!d.companyName.toLowerCase().includes(operator)) return false;
      return true;
    });
    this.page=1; this.renderTable();
  },

  reset(){
    document.getElementById('silBatchNo').value=''; document.getElementById('silMaterial').value='';
    document.getElementById('silAction').value=''; document.getElementById('silResult').value='';
    document.getElementById('silOperator').value='';
    this.filtered=[...sharedInspLogData]; this.page=1; this.renderTable();
  },

  prevPage(){ if(this.page>1){ this.page--; this.renderTable(); } },
  nextPage(){ if(this.page<Math.ceil(Math.max(this.filtered.length,1)/this.pageSize)){ this.page++; this.renderTable(); } },
  changePageSize(){ this.pageSize=parseInt(document.getElementById('silPageSizeSel').value); this.page=1; this.renderTable(); },

  exportLog(){
    const csv='时间,批次号,物料名称,操作类型,操作人,公司,操作详情,结果,来源\n'
      +sharedInspLogData.map(d=>`${d.logTime},${d.batchNo},${d.materialName},${d.actionType},${d.operator},${d.companyName},"${d.detail}",${d.result},${d.sourceType}`).join('\n');
    toast('导出日志（演示模式）：\n共 '+sharedInspLogData.length+' 条日志\n实际可通过设置菜单导出JSON文件');
  }
};
