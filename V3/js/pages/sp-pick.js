// ===== Spare Parts Picking / Material Requisition Page =====
const SpPick = {
  page: 1, pageSize: 20,
  filteredData: [],

  render() {
    this.filteredData = [...spPickData];
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">备件领用</div><div style="font-size:13px;opacity:0.8;">维修工单备品备件领料申请与管理</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-blue" onclick="SpPick.openCreateModal()"><span style="font-weight:700;font-size:16px;">+</span> 创建领料单据</button>
          </div>
        </div>
        <${''}!-- Filter Bar ${''}-->
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>领备单号</label><input type="text" id="pickDocNo" placeholder="领料单编号"></div>
          <div class="filter-group"><label>移动类型</label><select id="pickMoveType">
            <option value="">全部</option>
            <option value="311">311-领料</option>
            <option value="312">312-退库</option>
            <option value="261">261-转储</option>
            <option value="201">201-GI</option>
          </select></div>
          <div class="filter-group"><label>请领部门</label><select id="pickDept">
            <option value="">全部</option>
            <option value="设备部">设备部</option>
            <option value="生产部">生产部</option>
            <option value="质量部">质量部</option>
            <option value="仓储物流部">仓储物流部</option>
          </select></div>
          <div class="filter-group"><label>工厂</label><select id="pickPlant">
            <option value="">全部</option>
            ${FL_FACTORIES.map(f=>`<option value="${f.code}">${f.code} - ${f.name}</option>`).join('')}
          </select></div>
          <div class="filter-group"><label>状态</label><select id="pickStatus">
            <option value="">全部</option>
            <option value="草稿">草稿</option>
            <option value="待审批">待审批</option>
            <option value="已发放">已发放</option>
            <option value="部分完成">部分完成</option>
            <option value="已完成">已完成</option>
          </select></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="SpPick.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="SpPick.reset()">重置</button>
            <button class="btn btn-outline btn-sm" onclick="SpPick.printList()">打印</button>
            <button class="btn btn-outline btn-sm" onclick="SpPick.exportData()">导出</button>
          </div>
        </div>
        <${''}!-- Table ${''}-->
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table" style="min-width:1100px;">
            <thead><tr>
              <th>领备单号</th><th>移动类型</th><th>工厂</th><th>请领部门</th><th>收货单位</th>
              <th style="text-align:right;">行项目数</th><th>领料日期</th><th>申请人</th><th>状态</th>
              <th style="width:140px;">操作</th>
            </tr></thead>
            <tbody id="pickTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info">
            <span class="list-count" id="pickCount">共 ${this.filteredData.length} 条</span>
          </div>
          <div class="pagination">
            <button class="pagination-btn" id="pickPrev" disabled onclick="SpPick.prevPage()">‹</button>
            <span class="pagination-info" id="pickPageInfo">第 ${this.page} / ${Math.ceil(Math.max(this.filteredData.length,1)/this.pageSize)} 页</span>
            <button class="pagination-btn" id="pickNext" onclick="SpPick.nextPage()">›</button>
            <select class="page-size-select" id="pickPageSizeSel" onchange="SpPick.changePageSize()"><option value="20">20条</option><option value="40">40条</option><option value="80">80条</option></select>
          </div>
        </div>
      </div>
      <div id="pickModalContainer"></div>`;
  },

  init() {
    this.filteredData = [...spPickData];
    this.page = 1;
    this.renderTable();
  },

  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filteredData.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filteredData.length / this.pageSize) || 1;
    document.getElementById('pickCount').textContent = `共 ${this.filteredData.length} 条`;
    document.getElementById('pickPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('pickPrev').disabled = this.page <= 1;
    document.getElementById('pickNext').disabled = this.page >= totalPages;

    const sb = s => {
      const m = {'草稿':'badge-gray','待审批':'badge-blue','已发放':'badge-green','部分完成':'badge-yellow','已完成':'badge-green'};
      return `<span class="badge ${m[s]||'badge-gray'}">${esc(s)}</span>`;
    };
    const mt = t => ({ '311':'311-领料','312':'312-退库','261':'261-转储','201':'201-GI' })[t]||t;

    document.getElementById('pickTableBody').innerHTML = page.map(r => `<tr>
      <td><strong style="color:var(--primary);">${esc(r.docNo)}</strong></td>
      <td>${esc(mt(r.moveType))}</td>
      <td>${esc(r.plant)}</td>
      <td>${esc(r.dept)}</td>
      <td>${esc(r.recvUnit)}</td>
      <td style="text-align:right;">${r.lines.length}</td>
      <td>${esc(r.pickDate)}</td>
      <td>${esc(r.applicant)}</td>
      <td>${sb(r.status)}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="SpPick.viewDetail('${r.docNo}')">查看</button>
      </td>
    </tr>`).join('');
  },

  search() {
    const docNo = document.getElementById('pickDocNo')?.value?.trim()||'';
    const moveType = document.getElementById('pickMoveType')?.value||'';
    const dept = document.getElementById('pickDept')?.value||'';
    const plant = document.getElementById('pickPlant')?.value||'';
    const status = document.getElementById('pickStatus')?.value||'';

    this.filteredData = spPickData.filter(r => {
      if(docNo && !r.docNo.includes(docNo)) return false;
      if(moveType && r.moveType !== moveType) return false;
      if(dept && r.dept !== dept) return false;
      if(plant && !r.plant.includes(plant)) return false;
      if(status && r.status !== status) return false;
      return true;
    });
    this.page=1; this.renderTable();
  },

  reset() {
    ['pickDocNo','pickMoveType','pickDept','pickPlant','pickStatus'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
    this.filteredData=[...spPickData]; this.page=1; this.renderTable();
  },

  prevPage(){if(this.page>1){this.page--;this.renderTable();}},
  nextPage(){const tp=Math.ceil(this.filteredData.length/this.pageSize)||1;if(this.page<tp){this.page++;this.renderTable();}},
  changePageSize(){this.pageSize=parseInt(document.getElementById('pickPageSizeSel')?.value||20);this.page=1;this.renderTable();},

  // ---- Create Modal (Screenshot 1) ----
  openCreateModal() {
    const today=new Date().toISOString().slice(0,10);
    document.getElementById('pickModalContainer').innerHTML=`
      <div class="modal-backdrop" id="pickCreateBackdrop" onclick="SpPick.closeModal()">
        <div class="modal modal-lg" style="max-width:1200px;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">创建领料单据</div>
            <button class="modal-close" onclick="SpPick.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:calc(92vh-140px);">
            <${''}!-- Header Info ${''}-->
            <div class="form-section">
              <div class="form-grid">
                <div class="form-group"><label>工厂<span class="req">*</span></label><select id="pickCFPlant">
                  ${FL_FACTORIES.map(f=>`<option value="${f.code}"${f.code==='1000'?' selected':''}>${f.code} - ${f.name}</option>`).join('')}
                </select></div>
                <div class="form-group"><label>库存状态</label><select id="pickCFStockSts">
                  <option value="非限制转存" selected>非限制转存</option>
                  <option value="限制使用">限制使用</option>
                  <option value="冻结">冻结</option>
                </select></div>
                <div class="form-group"><label>收货单位</label><input type="text" id="pickCFRecvUnit" placeholder="如 2010 脱心东区清精维"></div>
                <div class="form-group"><label>移动类型</label><select id="pickCFMoveType">
                  <option value="311" selected>311-领料</option>
                  <option value="312">312-退库</option>
                  <option value="261">261-转储</option>
                  <option value="201">201-GI</option>
                </select></div>
                <div class="form-group"><label>领料日期<span class="req">*</span></label><input type="date" id="pickCFDate" value="${today}"></div>
                <div class="form-group"><label>请领部门<span class="req">*</span></label><select id="pickCFDept">
                  <option value="">请选择</option>
                  <option value="设备部">设备部</option>
                  <option value="生产部">生产部</option>
                  <option value="质量部">质量部</option>
                  <option value="仓储物流部">仓储物流部</option>
                </select></div>
                <div class="form-group"><label>请领人</label><input type="text" id="pickCFPerson" placeholder="请领人姓名"></div>
              </div>
            </div>

            <${''}!-- Line Items Table ${''}-->
            <div class="form-section" style="margin-top:14px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
                <div class="form-section-title" style="margin-bottom:0;">物料明细</div>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-sm btn-outline" onclick="SpPick.addPickRow()" style="padding:4px 12px;font-size:12px;">+ 添加行</button>
                </div>
              </div>
              <div style="overflow-x:auto;">
                <table class="data-table" id="pickLinesTable" style="min-width:900px;">
                  <thead><tr>
                    <th style="width:40px;text-align:center;">#</th>
                    <th style="min-width:110px;"><span class="req">*</span> 物料编号</th>
                    <th style="min-width:220px;">物料描述</th>
                    <th style="min-width:75px;text-align:right;"><span class="req">*</span> 领料数量</th>
                    <th style="width:52px;">单位</th>
                    <th style="min-width:90px;">批次</th>
                    <th style="min-width:100px;"><span class="req">*</span> 需求日期</th>
                    <th style="width:42px;"></th>
                  </tr></thead>
                  <tbody id="pickLinesBody">
                    ${this.renderPickLineRow({matCode:'',shortText:'',reqQty:'',unit:'个',batch:'',needDate:today},0)}
                  </tbody>
                </table>
              </div>
              <div style="margin-top:8px;font-size:13px;color:var(--text-secondary);">
                提示：点击物料编号可输入或搜索；留空的行将被忽略
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="SpPick.closeModal()">取消</button>
            <button class="btn btn-outline" onclick="SpPick.submitCreate(true)">保存草稿</button>
            <button class="btn btn-primary" onclick="SpPick.submitCreate(false)">提交审批</button>
          </div>
        </div>
      </div>`;
  },

  renderPickLineRow(line,idx){
    return `<tr data-row="${idx}">
      <td style="text-align:center;color:var(--text-muted);font-weight:600;">${idx+1}</td>
      <td><div style="position:relative;display:flex;align-items:center;">
        <input type="text" value="${esc(line.matCode||'')}" placeholder="输入/点击查" style="padding:5px 28px 5px 8px;width:100%;border:1px solid var(--border);border-radius:4px;font-size:12px;" oninput="SpPick.onMatCodeInput(this)">
        <span style="position:absolute;right:4px;color:var(--text-muted);cursor:pointer;font-size:14px;" title="查询物料" onclick="SpPick.searchMaterial(this)">&#128269;</span>
      </div></td>
      <td><input type="text" value="${esc(line.shortText||'')}" placeholder="物料描述自动填充" readonly style="padding:5px 8px;width:100%;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f8fafc;"></td>
      <td style="padding:5px;"><input type="number" value="${line.reqQty||''}" min="0" step="any" style="width:72px;text-align:right;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:5px;"><span style="font-size:12px;display:inline-block;padding:6px 4px;">${esc(line.unit||'个')}</span></td>
      <td style="padding:5px;"><input type="text" value="${esc(line.batch||'')}" placeholder="请输入批次" style="width:84px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:5px;"><input type="date" value="${line.needDate||''}" style="width:94px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:4px;"><button class="btn btn-sm" style="padding:3px 8px;font-size:18px;line-height:1;color:var(--danger);background:none;border:1px solid transparent;" onclick="SpPick.removePickRow(this)" title="删除此行">&times;</button></td>
    </tr>`;
  },

  addPickRow(){
    const tbody=document.getElementById('pickLinesBody');
    const idx=tbody.rows.length;
    const tr=document.createElement('tr');
    tr.innerHTML=this.renderPickLineRow({matCode:'',shortText:'',reqQty:'',unit:'个',batch:'',needDate:new Date().toISOString().slice(0,10)},idx);
    tbody.appendChild(tr);
    this.reindexPickRows();
  },

  removePickRow(btn){
    const tr=btn.closest('tr');
    if(document.getElementById('pickLinesBody').rows.length<=1){toast('至少保留一行');return;}
    tr.remove();this.reindexPickRows();
  },

  reindexPickRows(){
    const rows=document.querySelectorAll('#pickLinesBody tr');
    rows.forEach((r,i)=>{r.querySelector('td:first-child').textContent=i+1;});
  },

  onMatCodeInput(input){ /* auto-fill description from material master */ },

  searchMaterial(btn){ toast('物料查询功能（对接SAP物料主数据）'); },

  submitCreate(saveOnly){
    const f=id=>document.getElementById(id)?.value??'';
    if(!f('pickCFDept')){toast('请选择请领部门');return;}

    const docNo='PK'+String(Math.floor(Math.random()*900000000+100000000));
    const req={
      docNo:docNo,
      plant:f('pickCFPlant'),
      stockStatus:f('pickCFStockSts'),
      recvUnit:f('pickCFRecvUnit'),
      moveType:f('pickCFMoveType')||'311',
      pickDate:f('pickCFDate'),
      dept:f('pickCFDept'),
      applicant:f('pickCFPerson')||'当前用户',
      status:saveOnly?'草稿':'待审批',
      createDate:new Date().toISOString().slice(0,10)+' '+new Date().toTimeString().slice(0,8),
      lines:[]
    };

    const tbody=document.getElementById('pickLinesBody');
    let hasValid=false;
    for(let i=0;i<tbody.rows.length;i++){
      const r=tbody.rows[i];
      const mc=(r.cells[1]?.querySelector('input')?.value||'').trim();
      const st=(r.cells[2]?.querySelector('input')?.value||'').trim();
      const q=parseFloat(r.cells[3]?.querySelector('input')?.value)||0;
      if(!mc&&!st&&!q)continue;
      if(!mc||!q){toast(`请完整填写第${i+1}行的物料编号和数量`);return;}
      hasValid=true;
      req.lines.push({
        matCode:mc,shortText:st,reqQty:q,unit:'个',
        batch:r.cells[4]?.nextElementSibling?.querySelector('input')?.value||'',
        needDate:r.cells[6]?.querySelector('input')?.value||'',
        issuedQty:0,completedQty:0
      });
    }
    if(!hasValid){toast('请至少添加一条有效物料');return;}

    spPickData.unshift(req);
    this.closeModal();
    this.filteredData=[...spPickData];this.page=1;this.renderTable();
    toast(saveOnly?'领料单已保存为草稿':'领料单已提交审批');
  },

  // ---- Edit Modal (Screenshot 2) ----
  openEditModal(docNo){
    const req=spPickData.find(r=>r.docNo===docNo);if(!req)return;
    this.editingId=docNo;
    const linesHTML=req.lines.map((l,i)=>this.renderEditPickLine(l,i)).join('');

    document.getElementById('pickModalContainer').innerHTML=`
      <div class="modal-backdrop" id="pickEditBackdrop" onclick="SpPick.closeModal()">
        <div class="modal modal-lg" style="max-width:1250px;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">修改领料单 - ${esc(req.docNo)} <span class="badge badge-${req.status==='草稿'?'gray':req.status==='待审批'?'blue':'green'}">${esc(req.status)}</span></div>
            <button class="modal-close" onclick="SpPick.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:calc(92vh-140px);">
            <${''}!-- Search Condition ${''}-->
            <div style="background:#f0f9ff;padding:10px 16px;border-radius:6px;margin-bottom:12px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
              <span style="font-weight:600;font-size:13px;color:var(--primary-dark,#1d4ed8);">搜索条件</span>
              <div class="filter-group" style="margin:0;"><label>领备单号</label><input type="text" value="${esc(req.docNo)}" style="padding:5px 8px;width:150px;border:1px solid var(--border);border-radius:4px;font-size:12px;" disabled></div>
              <button class="btn btn-primary btn-sm" onclick="toast('查询完成')">查询</button>
            </div>

            <${''}!-- Filter Row ${''}-->
            <div class="filter-bar" style="padding:8px 16px;margin-bottom:10px;">
              <div class="filter-group" style="margin:0;"><label>移动类型</label><select id="pickEFMoveType" style="padding:5px 8px;font-size:12px;"><option value="${req.moveType}"selected>${req.moveType}-领料</option></select></div>
              <div class="filter-group" style="margin:0;"><label>领料日期</label><input type="date" value="${req.pickDate}" id="pickEFDate" style="padding:5px 8px;font-size:12px;"></div>
              <div class="filter-group" style="margin:0;"><label>请领部门</label><input type="text" value="${esc(req.dept)}" id="pickEFDept" style="padding:5px 8px;width:120px;font-size:12px;"></div>
              <div class="filter-group" style="margin:0;"><label>创建日期</label><input type="text" value="${req.createDate}" style="padding:5px 8px;width:160px;font-size:12px;background:#f8fafc;" disabled></div>
              <div class="filter-group" style="margin:0;"><label>领料日期</label><input type="text" value="${req.pickDate}" style="padding:5px 8px;width:130px;font-size:12px;background:#f8fafc;" disabled></div>
              <div class="filter-actions" style="margin-left:auto;">
                <button class="btn btn-primary btn-sm" onclick="SpPick.submitEdit()">保存修改</button>
                <button class="btn btn-outline btn-sm" onclick="SpPick.printSingle('${req.docNo}')">打印</button>
              </div>
            </div>

            <${''}!-- Edit Lines Table ${''}-->
            <div style="overflow-x:auto;">
              <table class="data-table" style="min-width:1050px;">
                <thead><tr>
                  <th style="width:45px;text-align:center;">项目</th>
                  <th style="width:36px;">消息</th>
                  <th style="min-width:110px;"><span class="req">*</span> 物料编号</th>
                  <th style="min-width:200px;">物料描述</th>
                  <th style="min-width:70px;text-align:right;">已得数量</th>
                  <th style="min-width:75px;text-align:right;"><span class="req">*</span> 领料数量</th>
                  <th style="width:48px;">单位</th>
                  <th style="min-width:85px;">批次</th>
                  <th style="min-width:100px;"><span class="req">*</span> 需求日期</th>
                  <th style="min-width:65px;text-align:center;">已完成</th>
                  <th style="width:42px;"></th>
                </tr></thead>
                <tbody id="pickEditLinesBody">${linesHTML}</tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="SpPick.closeModal()">取消</button>
          </div>
        </div>
      </div>`;
  },

  renderEditPickLine(line,idx){
    const completed=line.completedQty>=line.reqQty?true:false;
    return `<tr data-row="${idx}">
      <td style="text-align:center;font-weight:600;color:var(--primary);">${(idx+1)*10}</td>
      <td style="text-align:center;"><input type="checkbox" ${completed?'checked':''} ${completed?'disabled':''}></td>
      <td><input type="text" value="${esc(line.matCode)}" readonly style="padding:5px 8px;width:100%;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f8fafc;"></td>
      <td><input type="text" value="${esc(line.shortText)}" readonly style="padding:5px 8px;width:100%;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f8fafc;"></td>
      <td style="text-align:right;padding:6px 4px;color:var(--text-secondary);">${Number(line.issuedQty||0).toLocaleString()}</td>
      <td style="padding:5px;"><input type="number" value="${line.reqQty}" min="0" step="any" style="width:68px;text-align:right;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;" ${completed?'disabled style="background:#f8fafc;"':''}></td>
      <td style="text-align:center;font-size:12px;">${esc(line.unit||'个')}</td>
      <td style="padding:5px;"><input type="text" value="${esc(line.batch||'')}" style="width:78px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;" ${completed?'disabled style="background:#f8fafc;"':''}></td>
      <td style="padding:5px;"><input type="date" value="${line.needDate||''}" style="width:94px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;" ${completed?'disabled style="background:#f8fafc;"':''}></td>
      <td style="text-align:center;font-weight:700;color:${completed?'var(--success,#16a34a)':'var(--text-muted)'};">${completed?'是':'否'}</td>
      <td style="padding:4px;"><button class="btn btn-sm" style="padding:3px 8px;font-size:18px;line-height:1;color:var(--danger);background:none;border:1px solid transparent;" onclick="SpPick.removeEditPickRow(this)" title="删除此行">&times;</button></td>
    </tr>`;
  },

  removeEditPickRow(btn){
    const tr=btn.closest('tr');
    if(document.getElementById('pickEditLinesBody').rows.length<=1){toast('至少保留一行');return;}
    tr.remove();
  },

  submitEdit(){
    if(!this.editingId)return;
    const req=spPickData.find(r=>r.docNo===this.editingId);if(!req)return;
    const tbody=document.getElementById('pickEditLinesBody');
    for(let i=0;i<tbody.rows.length;i++){
      const r=tbody.rows[i];
      const q=parseFloat(r.cells[5]?.querySelector('input')?.value)||0;
      const batch=r.cells[7]?.querySelector('input')?.value||'';
      const nd=r.cells[8]?.querySelector('input')?.value||'';
      if(req.lines[i]){
        req.lines[i].reqQty=q;
        req.lines[i].batch=batch;
        req.lines[i].needDate=nd;
      }
    }
    req.pickDate=document.getElementById('pickEFDate')?.value||req.pickDate;
    req.dept=document.getElementById('pickEFDept')?.value||req.dept;
    this.closeModal();
    this.filteredData=[...spPickData];this.renderTable();
    toast('领料单修改已保存');
  },

  // ---- View Detail ----
  viewDetail(docNo){
    const req=spPickData.find(r=>r.docNo===docNo);if(!req)return;
    const sb=s=>{const m={'草稿':'gray','待审批':'blue','已发放':'green','部分完成':'yellow','已完成':'green'};return `<span class="badge badge-${m[s]||'gray'}">${esc(s)}</span>`;};
    const totalReq=req.lines.reduce((s,l)=>s+(l.reqQty||0),0);

    const html=`<div class="modal-backdrop" id="pickDetailBackdrop" onclick="SpPick.closeDetail()">
      <div class="modal" style="max-width:950px;" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">领料单详情 - ${esc(req.docNo)} ${sb(req.status)}</div>
          <button class="modal-close" onclick="SpPick.closeDetail()">✕</button>
        </div>
        <div class="modal-body" style="max-height:calc(85vh-120px);">
          <div class="form-section">
            <div class="form-section-title">表头信息</div>
            <div class="detail-grid">
              <div class="detail-item"><dt>领备单号</dt><dd><strong>${esc(req.docNo)}</strong></dd></div>
              <div class="detail-item"><dt>状态</dt><dd>${sb(req.status)}</dd></div>
              <div class="detail-item"><dt>移动类型</dt><dd>${esc(req.moveType)}</dd></div>
              <div class="detail-item"><dt>工厂</dt><dd>${esc(req.plant)}</dd></div>
              <div class="detail-item"><dt>请领部门</dt><dd>${esc(req.dept)}</dd></div>
              <div class="detail-item"><dt>申请人</dt><dd>${esc(req.applicant)}</dd></div>
              <div class="detail-item"><dt>收货单位</dt><dd>${esc(req.recvUnit||'-')}</dd></div>
              <div class="detail-item"><dt>领料日期</dt><dd>${esc(req.pickDate)}</dd></div>
              <div class="detail-item"><dt>创建时间</dt><dd>${esc(req.createDate)}</dd></div>
            </div>
          </div>
          <div class="form-section" style="margin-top:16px;">
            <div class="form-section-title">行项目 (${req.lines.length} 项，合计领料 ${totalReq.toLocaleString()} )</div>
            <table class="data-table" style="min-width:850px;">
              <thead><tr>
                <th>项目</th><th>物料编号</th><th>物料描述</th><th style="text-align:right;">领料数量</th><th>单位</th>
                <th style="text-align:right;">已发数量</th><th>批次</th><th>需求日期</th><th style="text-align:center;">已完成</th>
              </tr></thead>
              <tbody>${req.lines.map((l,i)=>`<tr>
                <td style="text-align:center;">${(i+1)*10}</td>
                <td><strong>${esc(l.matCode)}</strong></td>
                <td>${esc(l.shortText)}</td>
                <td style="text-align:right;">${Number(l.reqQty).toLocaleString()}</td>
                <td style="text-align:center;">${esc(l.unit)}</td>
                <td style="text-align:right;color:var(--text-secondary);">${Number(l.issuedQty||0).toLocaleString()}</td>
                <td>${esc(l.batch||'-')}</td>
                <td>${esc(l.needDate||'-')}</td>
                <td style="text-align:center;font-weight:700;color:${l.completedQty>=l.reqQty?'var(--success,#16a34a)':'var(--text-muted)'};">${l.completedQty>=l.reqQty?'是':'否'}</td>
              </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="SpPick.closeDetail()">关闭</button>
          <button class="btn btn-outline btn-sm" onclick="SpPick.printSingle('${req.docNo}')">打印</button>
          <button class="btn btn-outline btn-sm" onclick="SpPick.exportData()">导出</button>
        </div>
      </div>
    </div>`;
    document.getElementById('pickModalContainer').innerHTML=html;
  },

  closeDetail(){document.getElementById('pickModalContainer').innerHTML='';},
  closeModal(){document.getElementById('pickModalContainer').innerHTML='';},
  deleteReq(docNo){
    if(confirm('确定要删除领料单 '+docNo+' 吗？')){
      const idx=spPickData.findIndex(r=>r.docNo===docNo);
      if(idx>=0)spPickData.splice(idx,1);
      this.filteredData=[...spPickData];this.page=1;this.renderTable();toast('已删除');
    }
  },
  printList(){toast('打印功能开发中...');},
  printSingle(docNo){toast('打印领料单 '+docNo+' ...');},
  exportData(){toast('导出功能开发中...');}
};

// ===== Demo Data for Spare Parts Pick =====
const spPickData = [
  {
    docNo:'PK260529001',moveType:'311',plant:'1000 - 山东步长制药工厂',dept:'设备部',applicant:'张建国',
    recvUnit:'2010 固体制剂车间清精维',stockStatus:'非限制转存',
    pickDate:'2026-05-29',createDate:'2026-05-29 08:15:30',status:'待审批',
    lines:[
      {matCode:'60001018',shortText:'高效过滤器-MIIPDF-635*520*93-27-AAF',reqQty:8,unit:'个',batch:'B20260501',needDate:'2026-06-01',issuedQty:0,completedQty:0},
      {matCode:'60001019',shortText:'高效过滤器-MIIPDF-635*762*93-27-AAF',reqQty:6,unit:'个',batch:'B20260502',needDate:'2026-06-01',issuedQty:0,completedQty:0},
      {matCode:'60001146',shortText:'隔膜阀膜片-DN15-材质:PTFE/EPDM-宝帝',reqQty:10,unit:'个',batch:'BM20260510',needDate:'2026-06-03',issuedQty:0,completedQty:0}
    ]
  },
  {
    docNo:'PK260528002',moveType:'311',plant:'2001 - 陕西步长制药工厂',dept:'设备部',applicant:'王海涛',
    recvUnit:'2001 发酵车间',stockStatus:'非限制转存',
    pickDate:'2026-05-28',createDate:'2026-05-28 09:20:00',status:'已发放',
    lines:[
      {matCode:'60001086',shortText:'O型圈-Φ360*5.7-材质:氟橡胶',reqQty:12,unit:'个',batch:'OR20260515',needDate:'2026-05-30',issuedQty:12,completedQty:12},
      {matCode:'60001087',shortText:'O型圈-Φ506*6.99-材质:氟橡胶',reqQty:8,unit:'个',batch:'OR20260515',needDate:'2026-05-30',issuedQty:8,completedQty:8},
      {matCode:'60001107',shortText:'金属缠绕石墨垫-DN50',reqQty:6,unit:'个',batch:'GD20260508',needDate:'2026-06-02',issuedQty:6,completedQty:6}
    ]
  },
  {
    docNo:'PK260527003',moveType:'311',plant:'1000 - 山东步长制药工厂',dept:'生产部',applicant:'李君',
    recvUnit:'1000 包装车间',stockStatus:'非限制转存',
    pickDate:'2026-05-27',createDate:'2026-05-27 14:30:00',status:'已完成',
    lines:[
      {matCode:'60001239',shortText:'插线板-10插位-5m',reqQty:5,unit:'个',batch:'EL20260420',needDate:'2026-05-28',issuedQty:5,completedQty:5},
      {matCode:'60000667',shortText:'插排-3插位',reqQty:10,unit:'个',batch:'EL20260420',needDate:'2026-05-28',issuedQty:10,completedQty:10},
      {matCode:'60000668',shortText:'插排-6插位',reqQty:8,unit:'个',batch:'EL20260421',needDate:'2026-05-28',issuedQty:8,completedQty:8},
      {matCode:'60001297',shortText:'插线板-8插位',reqQty:4,unit:'个',batch:'EL20260422',needDate:'2026-05-28',issuedQty:4,completedQty:4},
      {matCode:'60001353',shortText:'活动扳手-世达-8英寸-47250',reqQty:3,unit:'个',batch:'TOOL20260301',needDate:'2026-05-29',issuedQty:3,completedQty:3}
    ]
  },
  {
    docNo:'PK260526004',moveType:'311',plant:'2002 - 山东丹红制药工厂',dept:'设备部',applicant:'陈永刚',
    recvUnit:'2002 注射剂车间',stockStatus:'非限制转存',
    pickDate:'2026-05-26',createDate:'2026-05-26 10:00:00',status:'部分完成',
    lines:[
      {matCode:'60001170',shortText:'高效过滤器-850*850*93 H14AAF',reqQty:4,unit:'个',batch:'HF20260501',needDate:'2026-05-31',issuedQty:2,completedQty:2},
      {matCode:'60001169',shortText:'高效过滤器-575*575*93 H14AAF',reqQty:6,unit:'个',batch:'HF20260501',needDate:'2026-05-31',issuedQty:3,completedQty:3},
      {matCode:'60001171',shortText:'高效过滤器-450*850*93 H14AAF',reqQty:4,unit:'个',batch:'HF20260502',needDate:'2026-06-05',issuedQty:0,completedQty:0}
    ]
  },
  {
    docNo:'PK260525005',moveType:'311',plant:'1000 - 山东步长制药工厂',dept:'质量部',applicant:'赵雪梅',
    recvUnit:'1000 QC实验室',stockStatus:'非限制转存',
    pickDate:'2026-05-25',createDate:'2026-05-25 11:45:00',status:'已完成',
    lines:[
      {matCode:'60001207',shortText:'砝码-F1等级 1000g',reqQty:2,unit:'个',batch:'CAL20260401',needDate:'2026-05-26',issuedQty:2,completedQty:2},
      {matCode:'60001202',shortText:'温湿度计-GJWS-A1',reqQty:3,unit:'个',batch:'ENV20260415',needDate:'2026-05-26',issuedQty:3,completedQty:3},
      {matCode:'60001294',shortText:'电子数显温湿度表-黑白色-带背光',reqQty:5,unit:'个',batch:'ENV20260415',needDate:'2026-05-27',issuedQty:5,completedQty:5},
      {matCode:'60001259',shortText:'红外测温仪--50~600℃',reqQty:1,unit:'个',batch:'TM20260420',needDate:'2026-05-27',issuedQty:1,completedQty:1}
    ]
  },
  {
    docNo:'PK260524006',moveType:'312',plant:'1000 - 山东步长制药工厂',dept:'设备部',applicant:'刘志强',
    recvUnit:'1000 备件仓库',stockStatus:'非限制转存',
    pickDate:'2026-05-24',createDate:'2026-05-24 16:00:00',status:'已完成',
    lines:[
      {matCode:'60001358',shortText:'活动扳手-世达-8英寸-47250',reqQty:2,unit:'个',batch:'TOOL20260301',needDate:'2026-05-25',issuedQty:2,completedQty:2}
    ]
  },
  {
    docNo:'PK260523007',moveType:'311',plant:'2010 - 保定天浩制药工厂',dept:'设备部',applicant:'王海涛',
    recvUnit:'2010 原料药车间',stockStatus:'非限制转存',
    pickDate:'2026-05-23',createDate:'2026-05-23 09:00:00',status:'草稿',
    lines:[
      {matCode:'60001281',shortText:'压力表-0-2.5MPa',reqQty:5,unit:'个',batch:'',needDate:'2026-06-01',issuedQty:0,completedQty:0},
      {matCode:'60001282',shortText:'压力表-0-40',reqQty:3,unit:'个',batch:'',needDate:'2026-06-01',issuedQty:0,completedQty:0},
      {matCode:'60001283',shortText:'压力表-0-1.6MPa',reqQty:4,unit:'个',batch:'',needDate:'2026-06-01',issuedQty:0,completedQty:0},
      {matCode:'60001284',shortText:'压力表-0-1MPa',reqQty:4,unit:'个',batch:'',needDate:'2026-06-01',issuedQty:0,completedQty:0},
      {matCode:'60001259',shortText:'红外测温仪--50~600℃',reqQty:1,unit:'个',batch:'',needDate:'2026-06-05',issuedQty:0,completedQty:0},
      {matCode:'60001261',shortText:'投料袋支架-5L投料袋支架',reqQty:2,unit:'个',batch:'',needDate:'2026-06-10',issuedQty:0,completedQty:0},
      {matCode:'60001262',shortText:'投料袋支架-15L投料袋支架',reqQty:2,unit:'个',batch:'',needDate:'2026-06-10',issuedQty:0,completedQty:0},
      {matCode:'60001351',shortText:'乙二醇浓度计-415',reqQty:1,unit:'个',batch:'',needDate:'2026-06-15',issuedQty:0,completedQty:0}
    ]
  }
];
