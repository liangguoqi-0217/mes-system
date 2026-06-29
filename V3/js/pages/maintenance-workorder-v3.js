// ===== 2.3 维修工单管理 V3 — 三种创建方式可视化入口 =====
// 改进：用户进入页面即可明确看到三种工单创建方式
const MaintenanceWorkOrderV3 = {
  page:1, pageSize:10, filtered:[],
  // 筛选缓存
  _searchAufnr:'', _searchEqunr:'', _searchAuart:'', _searchStat:'', _searchPriok:'',

  _typeBadge(t) {
    if(t==='PM01')return '<span class="badge badge-sm" style="background:#dbeafe;color:#2563eb;">PM01-预防性</span>';
    if(t==='PM02')return '<span class="badge badge-sm" style="background:#fee2e2;color:#dc2626;">PM02-纠正性</span>';
    if(t==='PM03')return '<span class="badge badge-sm" style="background:#fef3c7;color:#92400e;">PM03-改造</span>';
    if(t==='ZI02')return '<span class="badge badge-sm" style="background:#f3e8ff;color:#7c3aed;">ZI02-拆卸</span>';
    return '<span class="badge badge-sm">'+esc(t)+'</span>';
  },

  /* ========== Render ========== */
  render() {
    return `
    <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <!-- 顶部标题栏 -->
      <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;flex-shrink:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-size:18px;font-weight:700;">维修工单管理</div>
            <div style="font-size:13px;opacity:0.8;margin-top:2px;">来源：手工创建 / 通知单转化 / 任务清单引用 / 引用维护计划</div>
          </div>
          <button class="btn btn-blue" style="padding:10px 20px;font-size:14px;font-weight:600;border-radius:8px;"
            onclick="MaintenanceWorkOrderV3.showCreatePicker()">+ 新建工单</button>
        </div>

      </div>

      <!-- 筛选栏 -->
      <div class="filter-bar" style="flex-shrink:0;">
        <div class="filter-group"><label>工单号</label><input type="text" id="wo3AUFNR" placeholder="如 O0000001" value="${esc(this._searchAufnr)}"></div>
        <div class="filter-group"><label>设备编码</label><input type="text" id="wo3EQUNR" placeholder="模糊查询" value="${esc(this._searchEqunr)}"></div>
        <div class="filter-group"><label>类型</label><select id="wo3AUART">${workOrderV2TypeOpts.map(o=>`<option value="${o.value}" ${this._searchAuart===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>状态</label><select id="wo3STAT">${workOrderV2StatusOpts.map(o=>`<option value="${o.value}" ${this._searchStat===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>优先级</label><select id="wo3PRIOK">${notificationV2PriorityOpts.map(o=>`<option value="${o.value}" ${this._searchPriok===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="MaintenanceWorkOrderV3.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="MaintenanceWorkOrderV3.reset()">重置</button>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrapper" style="flex:1;">
        <table class="data-table">
          <thead><tr>
            <th style="width:100px;">工单号</th>
            <th style="width:100px;">类型</th>
            <th style="width:80px;">设备编码</th>
            <th style="width:240px;">描述</th>
            <th style="width:70px;">优先级</th>
            <th style="width:60px;">来源</th>
            <th style="width:110px;">计划开始</th>
            <th style="width:80px;">负责人</th>
            <th style="width:180px;">操作</th>
          </tr></thead>
          <tbody id="wo3TableBody"></tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="list-toolbar" style="flex-shrink:0;">
        <div class="list-info"><span class="list-count" id="wo3Count">共 0 条</span></div>
        <div class="pagination">
          <button class="pagination-btn" id="wo3Prev" disabled onclick="MaintenanceWorkOrderV3.prevPage()">‹</button>
          <span class="pagination-info" id="wo3PageInfo">第 1 / 1 页</span>
          <button class="pagination-btn" id="wo3Next" onclick="MaintenanceWorkOrderV3.nextPage()">›</button>
          <select class="page-size-select" id="wo3PageSize" onchange="MaintenanceWorkOrderV3.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
        </div>
      </div>
    </div>`;
  },

  /* ========== Init ========== */
  init() {
    this.filtered=[...workOrderV2Data]; this.page=1;
    this._searchAufnr='';this._searchEqunr='';this._searchAuart='';this._searchStat='';this._searchPriok='';
    this.renderTable();
  },

  /* ========== Render Table ========== */
  renderTable() {
    const start=(this.page-1)*this.pageSize;
    const page=this.filtered.slice(start,start+this.pageSize);
    const tp=Math.ceil(this.filtered.length/this.pageSize)||1;
    document.getElementById('wo3Count').textContent='共 '+this.filtered.length+' 条';
    document.getElementById('wo3PageInfo').textContent='第 '+this.page+' / '+tp+' 页';
    document.getElementById('wo3Prev').disabled=this.page<=1;
    document.getElementById('wo3Next').disabled=this.page>=tp;
    document.getElementById('wo3PageSize').value=this.pageSize;

    const prioBadge=p=>{
      if(p==='1-高')return '<span style="color:var(--danger);font-weight:bold;">'+esc(p)+'</span>';
      if(p==='2-中')return '<span style="color:var(--warning);font-weight:bold;">'+esc(p)+'</span>';
      return esc(p);
    };
    const srcBadge = w => {
      if (w.planSource) return '<span class="badge badge-sm" style="background:#dcfce7;color:#166534;" title="来源维护计划: '+esc(w.planSource)+'">🔧 计划</span>';
      if (w.taskListNo) return '<span class="badge badge-sm" style="background:#f3e8ff;color:#7c3aed;" title="来源任务清单: '+esc(w.taskListNo)+'">📑 模板</span>';
      if (w.sourceNo) return '<span class="badge badge-sm" style="background:#dbeafe;color:#2563eb;" title="来源通知单: '+esc(w.sourceNo)+'">📋 通知单</span>';
      return '<span class="badge badge-sm" style="background:#e5e7eb;color:#6b7280;">✍️ 手工</span>';
    };

    document.getElementById('wo3TableBody').innerHTML=page.map(w=>`
      <tr>
        <td><strong style="color:var(--primary-lighter);cursor:pointer;" onclick="MaintenanceWorkOrderV3.detail('${w.id}')">${esc(w.AUFNR)}</strong></td>
        <td>${MaintenanceWorkOrderV3._typeBadge(w.AUART)}</td>
        <td>${esc(w.EQUNR)}</td>
        <td style="width:240px;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(w.KURZTEXT)}">${esc(w.KURZTEXT)}</td>
        <td>${prioBadge(w.PRIOK)}</td>
        <td>${srcBadge(w)}</td>
        <td style="font-size:12px;">${esc(w.GSTRP)}</td>
        <td>${esc(w.PERNR)}</td>
        <td class="table-actions">
          <button class="btn btn-blue btn-sm" onclick="MaintenanceWorkOrderV3.detail('${w.id}')">详情</button>
        </td>
      </tr>`).join('');
  },

  /* ========== 搜索与分页 ========== */
  search() {
    this._searchAufnr=document.getElementById('wo3AUFNR').value.trim();
    this._searchEqunr=document.getElementById('wo3EQUNR').value.trim();
    this._searchAuart=document.getElementById('wo3AUART').value;
    this._searchStat=document.getElementById('wo3STAT').value;
    this._searchPriok=document.getElementById('wo3PRIOK').value;
    this.filtered=workOrderV2Data.filter(w=>{
      if(this._searchAufnr&&!w.AUFNR.includes(this._searchAufnr))return false;
      if(this._searchEqunr&&!w.EQUNR.includes(this._searchEqunr))return false;
      if(this._searchAuart&&w.AUART!==this._searchAuart)return false;
      if(this._searchStat&&w.STAT!==this._searchStat)return false;
      if(this._searchPriok&&w.PRIOK!==this._searchPriok)return false;
      return true;
    });
    this.page=1; this.renderTable();
  },

  reset() {
    document.getElementById('wo3AUFNR').value='';
    document.getElementById('wo3EQUNR').value='';
    document.getElementById('wo3AUART').value='';
    document.getElementById('wo3STAT').value='';
    document.getElementById('wo3PRIOK').value='';
    this._searchAufnr='';this._searchEqunr='';this._searchAuart='';this._searchStat='';this._searchPriok='';
    this.filtered=[...workOrderV2Data]; this.page=1; this.renderTable();
  },

  prevPage(){if(this.page>1){this.page--;this.renderTable();}},
  nextPage(){if(this.page<Math.ceil(this.filtered.length/this.pageSize)){this.page++;this.renderTable();}},
  changePageSize(){this.pageSize=parseInt(document.getElementById('wo3PageSize').value);this.page=1;this.renderTable();},

  /* ====================================
     🎯 核心改进：创建方式选择面板
     ==================================== */
  showCreatePicker() {
    const crteNotifications = notificationV2Data.filter(n => n.STAT === 'CRTE');
    const publishedTaskLists = (typeof taskListMockData !== 'undefined' ? taskListMockData : []).filter(t => t.PLNST === '已发布');

    const activePlans = pmPlanData.filter(p => p.status === 'active');
    const body = `
    <div style="padding:4px 0;">
      <div style="font-size:14px;color:var(--text-secondary);margin-bottom:16px;text-align:center;">
        请选择一种方式来创建维修工单
      </div>

      <!-- 2×2 网格布局 -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">

        <!-- 卡片一：手工创建 -->
        <div onclick="closeModal();MaintenanceWorkOrderV3.createManual()"
          style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #bfdbfe;border-radius:12px;padding:20px 16px;cursor:pointer;transition:all .22s;text-align:center;"
          onmouseenter="this.style.borderColor='#3b82f6';this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(59,130,246,.15)'"
          onmouseleave="this.style.borderColor='#bfdbfe';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:36px;margin-bottom:8px;">✍️</div>
          <div style="font-size:15px;font-weight:700;color:#1e40af;margin-bottom:4px;">手工创建</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.45;">从零填写工单类型、设备、描述等信息，适合临时维修任务</div>
          <div style="margin-top:12px;"><span class="badge badge-blue" style="padding:5px 16px;border-radius:16px;font-size:12px;cursor:pointer;">开始创建 →</span></div>
        </div>

        <!-- 卡片二：引用通知单 -->
        <div onclick="closeModal();MaintenanceWorkOrderV3.createFromNotification()"
          style="background:linear-gradient(135deg,#fef3c7,#fef9c3);border:2px solid #fde68a;border-radius:12px;padding:20px 16px;cursor:pointer;transition:all .22s;text-align:center;"
          onmouseenter="this.style.borderColor='#f59e0b';this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(245,158,11,.15)'"
          onmouseleave="this.style.borderColor='#fde68a';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:36px;margin-bottom:8px;">📋</div>
          <div style="font-size:15px;font-weight:700;color:#92400e;margin-bottom:4px;">引用通知单</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.45;">从待处理通知单快速生成工单，自动带入设备和故障信息</div>
          <div style="margin-top:12px;display:flex;align-items:center;justify-content:center;gap:8px;">
            <span class="badge" style="padding:5px 16px;border-radius:16px;font-size:12px;background:#f59e0b;color:#fff;cursor:pointer;">选择通知单 →</span>
            ${crteNotifications.length > 0 ? `<span style="font-size:11px;padding:3px 10px;background:#fff7ed;color:#b45309;border-radius:10px;font-weight:600;">${crteNotifications.length} 条待处理</span>` : '<span style="font-size:11px;color:#d1d5db;">暂无待处理</span>'}
          </div>
        </div>

        <!-- 卡片三：引用任务清单 -->
        <div onclick="closeModal();MaintenanceWorkOrderV3.createFromTaskList()"
          style="background:linear-gradient(135deg,#f3e8ff,#ede9fe);border:2px solid #c4b5fd;border-radius:12px;padding:20px 16px;cursor:pointer;transition:all .22s;text-align:center;"
          onmouseenter="this.style.borderColor='#7c3aed';this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(124,58,237,.15)'"
          onmouseleave="this.style.borderColor='#c4b5fd';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:36px;margin-bottom:8px;">📑</div>
          <div style="font-size:15px;font-weight:700;color:#6d28d9;margin-bottom:4px;">引用任务清单</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.45;">引用标准作业模板，自动带入工序、物料和工具</div>
          <div style="margin-top:12px;display:flex;align-items:center;justify-content:center;gap:8px;">
            <span class="badge" style="padding:5px 16px;border-radius:16px;font-size:12px;background:#7c3aed;color:#fff;cursor:pointer;">选择模板 →</span>
            ${publishedTaskLists.length > 0 ? `<span style="font-size:11px;padding:3px 10px;background:#ede9fe;color:#6d28d9;border-radius:10px;font-weight:600;">${publishedTaskLists.length} 个已发布</span>` : '<span style="font-size:11px;color:#d1d5db;">暂无已发布</span>'}
          </div>
        </div>

        <!-- 卡片四：引用维护计划 -->
        <div onclick="closeModal();MaintenanceWorkOrderV3.createFromPlan()"
          style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #86efac;border-radius:12px;padding:20px 16px;cursor:pointer;transition:all .22s;text-align:center;"
          onmouseenter="this.style.borderColor='#10b981';this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(16,185,129,.15)'"
          onmouseleave="this.style.borderColor='#86efac';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:36px;margin-bottom:8px;">🔧</div>
          <div style="font-size:15px;font-weight:700;color:#065f46;margin-bottom:4px;">引用维护计划</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.45;">引用预防性维护计划，自动带入设备、工序和备件</div>
          <div style="margin-top:12px;display:flex;align-items:center;justify-content:center;gap:8px;">
            <span class="badge" style="padding:5px 16px;border-radius:16px;font-size:12px;background:#10b981;color:#fff;cursor:pointer;">选择计划 →</span>
            ${activePlans.length > 0 ? `<span style="font-size:11px;padding:3px 10px;background:#dcfce7;color:#166534;border-radius:10px;font-weight:600;">${activePlans.length} 个已生效</span>` : '<span style="font-size:11px;color:#d1d5db;">暂无已生效</span>'}
          </div>
        </div>

      </div>

      <div style="margin-top:14px;padding:8px 12px;background:#f9fafb;border-radius:8px;font-size:12px;color:var(--text-muted);text-align:center;border:1px dashed var(--border);">
        💡 提示：也可直接点击页面右上角「+ 新建工单」按钮快速创建
      </div>
    </div>`;

    showModal('📌 选择工单创建方式', body, [
      { text: '取消', cls: 'btn-secondary', action: closeModal }
    ], 'modal-xl');
  },

  /* ========== Mock 备件数据（用于页签2物料搜索） ========== */
  _spareParts() {
    return [
      { code:'100001',name:'深沟球轴承 6205-2RS',unit:'PC',spec:'6205-2RS' },
      { code:'100002',name:'圆柱滚子轴承 NU208',unit:'PC',spec:'NU208' },
      { code:'100003',name:'机械密封 MG1-80',unit:'SET',spec:'MG1-80' },
      { code:'100004',name:'O型圈套装 NBR',unit:'SET',spec:'NBR' },
      { code:'100005',name:'锂基润滑脂 3#',unit:'KG',spec:'3#' },
      { code:'100006',name:'液压油 46#抗磨',unit:'L',spec:'ISO VG46' },
      { code:'100007',name:'V带 SPB-2500',unit:'PC',spec:'SPB 2500' },
      { code:'100008',name:'滤芯 HX-63/10',unit:'PC',spec:'HX-63/10' },
      { code:'100009',name:'接触器 LC1D25M7C',unit:'PC',spec:'AC3 25A' },
      { code:'100010',name:'传感器 PT100',unit:'PC',spec:'PT100 -50~200℃' },
      { code:'100011',name:'螺栓套装 M12x50 8.8级',unit:'SET',spec:'M12x50' },
      { code:'100012',name:'密封垫片 DN80 石墨',unit:'PC',spec:'DN80' }
    ];
  },

  /* ========== 方式一：手工创建 ========== */
  createManual() {
    const eqOpts = equipmentData.filter(e => e.status !== 'disposed' && e.status !== 'scrapped')
      .map(e => `<option value="${esc(e.code)}">${esc(e.name)} (${esc(e.code)})</option>`).join('');
    const typeOpts = `<option value="">请选择</option>
      <option value="PM02" selected>PM02 - 维修工单（纠正性）</option>
      <option value="PM01">PM01 - 预防性维护工单</option>
      <option value="PM03">PM03 - 改造/项目工单</option>`;
    const wcOpts = '<option value="">请选择工作中心</option>' + wcMockData.filter(w => w.status === 'active')
      .map(w => `<option value="${esc(w.code)}">${esc(w.code)} — ${esc(w.name)}</option>`).join('');

    const now = new Date();
    const todayStr = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
    const secStyle = 'font-size:13px;font-weight:600;color:var(--text);padding-bottom:8px;border-bottom:2px solid var(--primary);margin-bottom:2px;display:flex;align-items:center;gap:8px;';

    showModal('🔧 新建维修工单', `
      <!-- ====== 工单类型（顶部突出） ====== -->
      <div style="margin-bottom:18px;">
        <div class="form-group" style="max-width:480px;">
          <label style="font-weight:600;">工单类型 <span style="color:var(--danger);">*</span></label>
          <select id="woNewType" onchange="MaintenanceWorkOrderV3._woOnTypeChange()" style="font-size:14px;font-weight:500;">${typeOpts}</select>
          <span style="font-size:11px;color:var(--text-muted);margin-top:3px;display:block;" id="woTypeHint">PM02：纠正性维修 | PM01：预防性 | PM03：改造项目（需填结算对象）</span>
        </div>
      </div>

      <!-- ====== 抬头信息 ====== -->
      <div style="${secStyle}">📋 抬头信息</div>
      <div class="form-grid" style="margin-top:12px;">

        <div class="form-group">
          <label style="font-weight:600;">设备 <span style="color:var(--danger);">*</span></label>
          <div style="display:flex;gap:6px;">
            <select id="woNewEq" onchange="MaintenanceWorkOrderV3._woOnEqChange()" style="flex:1;"><option value="">搜索/选择设备...</option>${eqOpts}</select>
            <button type="button" onclick="toast('扫码功能需移动端支持')" style="padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:white;cursor:pointer;font-size:18px;" title="扫码选择设备">📷</button>
          </div>
        </div>

        <div class="form-group"><label style="font-weight:600;">功能位置</label><input id="woNewLoc" readonly style="background:#f9fafb;color:var(--text-secondary);" placeholder="选择设备后自动带出"></div>
        <div class="form-group"><label style="font-weight:600;">设备名称</label><input id="woNewEqName" readonly style="background:#f9fafb;color:var(--text-secondary);" placeholder="选择设备后自动带出"></div>

        <div class="form-group">
          <label style="font-weight:600;">工作中心 <span style="color:var(--danger);" id="woNewWcReq">*</span></label>
          <select id="woNewWC">${wcOpts}</select>
        </div>

        <div class="form-group full">
          <label style="font-weight:600;">工单描述 <span style="color:var(--danger);" id="woNewDescReq">*</span></label>
          <input id="woNewDesc" placeholder="简要概括本次维修内容，如"更换驱动端轴承并重新对中"" maxlength="100">
          <span style="font-size:11px;color:var(--text-muted);">不超过100字</span>
        </div>

        <div class="form-group">
          <label style="font-weight:600;">优先级</label>
          <select id="woNewPrio">
            <option value="2-中" selected>2 - 中（尽快处理）</option>
            <option value="1-高">1 - 高（紧急处理）</option>
            <option value="3-低">3 - 低（计划处理）</option>
          </select>
        </div>

        <div class="form-group" style="display:flex;gap:10px;">
          <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
            <label style="font-weight:600;font-size:13px;">计划开始</label>
            <input type="date" id="woNewGstrp" style="padding:8px 10px;">
          </div>
          <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
            <label style="font-weight:600;font-size:13px;">计划完成</label>
            <input type="date" id="woNewGltrp" style="padding:8px 10px;">
          </div>
        </div>

        <div id="woNewSettleWrap" class="form-group" style="display:none;">
          <label style="font-weight:600;">结算对象 <span style="color:var(--danger);">*</span></label>
          <input id="woNewSettleObj" placeholder="内部订单号 / WBS元素" maxlength="30">
          <span style="font-size:11px;color:var(--text-muted);">PM03改造项目必须指定结算对象</span>
        </div>
      </div>

      <!-- ====== 页签区域 ====== -->
      <div style="margin-top:22px;">
        <div class="tabs" style="margin-bottom:2px;">
          <div class="tab active" id="woTabBtn1" onclick="MaintenanceWorkOrderV3._woSwitchTab('1')">工序</div>
          <div class="tab" id="woTabBtn2" onclick="MaintenanceWorkOrderV3._woSwitchTab('2')">物料组件</div>
          <div class="tab" id="woTabBtn3" onclick="MaintenanceWorkOrderV3._woSwitchTab('3')">安全措施</div>
          <div class="tab" id="woTabBtn4" onclick="MaintenanceWorkOrderV3._woSwitchTab('4')">附件</div>
        </div>

        <!-- 页签1：工序 -->
        <div class="tab-panel active" id="woTabPanel1" style="padding-top:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-size:12px;color:var(--text-secondary);">工序列表（至少一道方可保存）</span>
            <div style="display:flex;gap:6px;">
              <button class="btn btn-sm" style="background:#f0fdf4;color:#166534;border:1px solid #86efac;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woShowCommonOps()" title="从常用工序库快速添加">📋 常用工序库</button>
              <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddOperationRow()">+ 添加工序</button>
            </div>
          </div>
          <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
            <table class="data-table" style="font-size:12px;margin:0;" id="woOpsTable">
              <thead><tr>
                <th style="width:60px;">序号</th><th>工作描述 <span style="color:var(--danger);">*</span></th><th style="width:130px;">工作中心</th><th style="width:80px;">工时(h)</th><th style="width:50px;">操作</th>
              </tr></thead>
              <tbody id="woOpsBody">
                <tr id="woOpsRow1">
                  <td class="wo-op-seq">0010</td>
                  <td><input class="wo-op-desc" placeholder="如：切断电源上锁挂牌" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
                  <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;"><option value="">继承抬头</option>${wcOpts}</select></td>
                  <td><input class="wo-op-hrs" type="number" step="0.5" min="0" placeholder="0.5" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
                  <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 页签2：物料组件 -->
        <div class="tab-panel" id="woTabPanel2" style="padding-top:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-size:12px;color:var(--text-secondary);">物料需求列表（选填）</span>
            <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddMaterialRow()">+ 添加物料</button>
          </div>
          <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
            <table class="data-table" style="font-size:12px;margin:0;">
              <thead><tr><th style="width:120px;">物料编码</th><th>物料名称</th><th style="width:80px;">需求数量</th><th style="width:60px;">单位</th><th style="width:50px;">操作</th></tr></thead>
              <tbody id="woMatBody">
                <tr style="color:var(--text-muted);"><td colspan="5" style="text-align:center;padding:24px;font-size:12px;">暂无物料需求，点击上方按钮添加</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 页签3：安全措施 -->
        <div class="tab-panel" id="woTabPanel3" style="padding-top:12px;">
          <div class="form-group">
            <label style="font-weight:600;font-size:13px;">安全措施（选填）</label>
            <textarea id="woNewSafety" rows="5" placeholder="记录隔离、锁定、防护要求等，如：&#10;1. 关闭泵进出口阀门，确认管道排空&#10;2. 断电并执行LOTO程序&#10;3. 作业区域设置警示带，配备灭火器" style="resize:vertical;min-height:100px;"></textarea>
          </div>
        </div>

        <!-- 页签4：附件 -->
        <div class="tab-panel" id="woTabPanel4" style="padding-top:12px;">
          <div style="border:2px dashed var(--border);border-radius:8px;padding:24px;text-align:center;cursor:pointer;transition:all .15s;"
            onclick="toast('附件上传功能将在后续版本实现')"
            onmouseenter="this.style.borderColor='var(--primary)';this.style.background='#f8fafc';"
            onmouseleave="this.style.borderColor='var(--border)';this.style.background='white';">
            <div style="font-size:32px;margin-bottom:6px;">📎</div>
            <div style="font-size:13px;color:var(--text-secondary);">点击上传附件</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">支持图片、文档（故障照片、参考图纸等）</div>
          </div>
        </div>
      </div>
    `, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'保存为草稿',cls:'btn-secondary',style:'background:#f3f4f6;color:#374151;border:1px solid #d1d5db;',action:()=>{ MaintenanceWorkOrderV3._saveManual('draft'); }},
      {text:'保存',cls:'btn-primary',action:()=>{ MaintenanceWorkOrderV3._saveManual('full'); }}
    ], 'modal-xl');

    // 初始化类型联动
    this._woOnTypeChange();
  },

  /* ----- 工单类型联动（手工创建用） ----- */
  _woOnTypeChange() {
    const type = document.getElementById('woNewType')?.value;
    const settleWrap = document.getElementById('woNewSettleWrap');
    const wcReq = document.getElementById('woNewWcReq');
    const descReq = document.getElementById('woNewDescReq');
    const hint = document.getElementById('woTypeHint');
    if (settleWrap) settleWrap.style.display = type === 'PM03' ? '' : 'none';
    if (hint) {
      if (type === 'PM03') hint.textContent = 'PM03：改造/项目工单 — 需指定结算对象（内部订单号/WBS元素）';
      else if (type === 'PM01') hint.textContent = 'PM01：预防性维护 | PM02：纠正性维修 | PM03：改造项目';
      else hint.textContent = 'PM02：纠正性维修 | PM01：预防性 | PM03：改造项目';
    }
  },

  /* ----- 工单类型联动（通知单转化用） ----- */
  _woOnConvTypeChange() {
    const type = document.getElementById('woConvType')?.value;
    const settleWrap = document.getElementById('woConvSettleWrap');
    if (settleWrap) settleWrap.style.display = type === 'PM03' ? '' : 'none';
  },

  /* ----- 设备选择联动 ----- */
  _woOnEqChange() {
    const code = document.getElementById('woNewEq')?.value;
    const eq = equipmentData.find(e => e.code === code);
    const locEl = document.getElementById('woNewLoc');
    const nameEl = document.getElementById('woNewEqName');
    if (eq) {
      if (locEl) locEl.value = eq.locationName || '';
      if (nameEl) nameEl.value = eq.name || '';
    } else {
      if (locEl) locEl.value = '';
      if (nameEl) nameEl.value = '';
    }
  },

  /* ----- 页签切换 ----- */
  _woSwitchTab(tabId) {
    for (let i = 1; i <= 5; i++) {
      const btn = document.getElementById('woTabBtn'+i);
      const panel = document.getElementById('woTabPanel'+i);
      if (!btn) break;
      btn.classList.toggle('active', i === +tabId);
      if (panel) panel.classList.toggle('active', i === +tabId);
    }
  },

  /* ----- 工序行管理 ----- */
  _woAddOperationRow() {
    const body = document.getElementById('woOpsBody');
    if (!body) return;
    const rows = body.querySelectorAll('tr');
    const seq = String((rows.length) * 10).padStart(4, '0');
    const wcOpts = '<option value="">继承抬头</option>' + wcMockData.filter(w => w.status === 'active')
      .map(w => `<option value="${esc(w.code)}">${esc(w.name)}</option>`).join('');
    const tr = document.createElement('tr');
    tr.id = 'woOpsRow' + (rows.length + 1);
    tr.innerHTML = `<td class="wo-op-seq">${seq}</td>
      <td><input class="wo-op-desc" placeholder="如：拆卸电机地脚螺栓" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;">${wcOpts}</select></td>
      <td><input class="wo-op-hrs" type="number" step="0.5" min="0" placeholder="0.5" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>`;
    body.appendChild(tr);
    // 重新编排序号
    this._woRenumberOps();
  },

  _woRemoveOpRow(btn) {
    const tr = btn.closest('tr');
    if (!tr) return;
    const body = document.getElementById('woOpsBody');
    // 至少保留一行
    if (body && body.querySelectorAll('tr').length <= 1) {
      // 清空内容而非删除
      const inputs = tr.querySelectorAll('input');
      inputs.forEach(inp => { inp.value = ''; });
      return;
    }
    tr.remove();
    this._woRenumberOps();
  },

  _woRenumberOps() {
    const seqs = document.querySelectorAll('#woOpsBody .wo-op-seq');
    seqs.forEach((el, i) => { el.textContent = String((i + 1) * 10).padStart(4, '0'); });
  },

  _woCollectOperations() {
    const rows = document.querySelectorAll('#woOpsBody tr');
    const ops = [];
    rows.forEach((row, i) => {
      const desc = row.querySelector('.wo-op-desc')?.value?.trim();
      if (!desc) return;
      const wc = row.querySelector('.wo-op-wc')?.value || '';
      const hrs = parseFloat(row.querySelector('.wo-op-hrs')?.value) || 0;
      ops.push({ VORNR: String((i + 1) * 10).padStart(4, '0'), LTXA1: desc, ARBPL: wc, ARBEIT: hrs });
    });
    return ops;
  },

  /* ----- 常用工序库（支持手工创建 + 通知单转化两种场景） ----- */
  _woShowCommonOps() {
    const eqCode = document.getElementById('woNewEq')?.value || document.getElementById('woConvEqCode')?.value || '';
    const eq = equipmentData.find(e => e.code === eqCode);
    const eqTypeName = eq ? eq.typeName || eq.name : '';

    const cards = commonOperationLibrary.map(co => {
      const match = co.equipmentTypes.some(t => eqTypeName.includes(t) || t === '所有设备');
      const highlightStyle = match ? 'border-left:3px solid #10b981;' : 'opacity:0.65;';
      return `<div onclick="closeModal();MaintenanceWorkOrderV3._woInsertCommonOps('${co.id}')"
        style="padding:10px 12px;border:1px solid var(--border);border-radius:6px;cursor:pointer;margin-bottom:6px;transition:all .15s;${highlightStyle}"
        onmouseenter="this.style.background='#f0fdf4';this.style.borderColor='#86efac';"
        onmouseleave="this.style.background='white';this.style.borderColor='var(--border)';">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:600;font-size:13px;">🔧 ${esc(co.description)}</span>
          <span style="font-size:11px;background:#f3f4f6;padding:2px 8px;border-radius:10px;color:var(--text-secondary);">${esc(co.category)} · ${co.avgHours}h</span>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">${co.ops.slice(0,3).map(o=>esc(o)).join(' → ')}${co.ops.length>3?' …':''}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">适用设备：${esc(co.equipmentTypes.join('、'))} | 使用${co.useCount}次</div>
      </div>`;
    }).join('');

    showModal('📋 常用工序库', `
      <div style="margin-bottom:10px;font-size:13px;color:var(--text-secondary);">
        选择常用工序模板，自动填入工序页签。${eqTypeName ? `<span style="color:#10b981;font-weight:600;">绿色高亮</span>为匹配「${esc(eqTypeName)}」的模板。` : ''}
      </div>
      <div style="max-height:420px;overflow-y:auto;">${cards}</div>
    `, [{text:'关闭',cls:'btn-secondary',action:closeModal}], 'modal-lg');
  },

  _woInsertCommonOps(coId) {
    const co = commonOperationLibrary.find(c => c.id === coId);
    if (!co) return;
    // 先清空现有工序（保留一行）
    const body = document.getElementById('woOpsBody');
    if (!body) return;
    body.innerHTML = '';

    const wcOpts = '<option value="">继承抬头</option>' + wcMockData.filter(w => w.status === 'active')
      .map(w => `<option value="${esc(w.code)}">${esc(w.name)}</option>`).join('');

    co.ops.forEach((opDesc, i) => {
      const seq = String((i + 1) * 10).padStart(4, '0');
      const tr = document.createElement('tr');
      tr.id = 'woOpsRow' + (i + 1);
      tr.innerHTML = `<td class="wo-op-seq">${seq}</td>
        <td><input class="wo-op-desc" value="${esc(opDesc)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;">${wcOpts}</select></td>
        <td><input class="wo-op-hrs" type="number" step="0.5" min="0" value="${(co.avgHours/co.ops.length).toFixed(1)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>`;
      body.appendChild(tr);
    });
    // 切换到工序页签
    this._woSwitchTab('1');
    toast('已导入 ' + co.description + '（' + co.ops.length + ' 道工序）');
  },

  /* ----- 物料行管理 ----- */
  _woAddMaterialRow() {
    const body = document.getElementById('woMatBody');
    if (!body) return;
    // 移除空状态提示行
    const placeholder = body.querySelector('tr[data-placeholder]');
    if (placeholder) placeholder.remove();

    const partOpts = '<option value="">搜索物料...</option>' + this._spareParts()
      .map(p => `<option value="${esc(p.code)}" data-name="${esc(p.name)}" data-unit="${esc(p.unit)}">${esc(p.code)} — ${esc(p.name)}</option>`).join('');

    const idx = body.querySelectorAll('tr:not([data-placeholder])').length + 1;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>
      <select class="wo-mat-code" onchange="MaintenanceWorkOrderV3._woOnMatSelect(this)" style="width:100%;padding:6px 4px;font-size:11px;">${partOpts}</select></td>
      <td><input class="wo-mat-name" readonly style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f9fafb;" placeholder="选择物料后自动填充"></td>
      <td><input class="wo-mat-qty" type="number" step="0.1" min="0.1" value="1" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input class="wo-mat-unit" readonly style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f9fafb;text-align:center;" placeholder="-"></td>
      <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveMatRow(this)">×</button></td>`;
    body.appendChild(tr);
  },

  _woRemoveMatRow(btn) {
    const tr = btn.closest('tr');
    if (!tr) return;
    tr.remove();
    const body = document.getElementById('woMatBody');
    if (body && body.querySelectorAll('tr').length === 0) {
      body.innerHTML = '<tr data-placeholder><td colspan="5" style="text-align:center;padding:24px;font-size:12px;color:var(--text-muted);">暂无物料需求，点击上方按钮添加</td></tr>';
    }
  },

  _woOnMatSelect(sel) {
    const tr = sel.closest('tr');
    if (!tr) return;
    const opt = sel.options[sel.selectedIndex];
    const nameEl = tr.querySelector('.wo-mat-name');
    const unitEl = tr.querySelector('.wo-mat-unit');
    if (nameEl) nameEl.value = opt ? (opt.getAttribute('data-name') || '') : '';
    if (unitEl) unitEl.value = opt ? (opt.getAttribute('data-unit') || '') : '';
  },

  _woCollectMaterials() {
    const rows = document.querySelectorAll('#woMatBody tr:not([data-placeholder])');
    const mats = [];
    rows.forEach(row => {
      const code = row.querySelector('.wo-mat-code')?.value;
      if (!code) return;
      const name = row.querySelector('.wo-mat-name')?.value || '';
      const qty = parseFloat(row.querySelector('.wo-mat-qty')?.value) || 0;
      const unit = row.querySelector('.wo-mat-unit')?.value || '';
      if (qty > 0) mats.push({ MATNR: code, MATKTX: name, BDMNG: qty, MEINS: unit });
    });
    return mats;
  },

  /* ----- 工具/工装行管理（任务清单引用专用） ----- */
  _woAddToolRow(code, name, qty) {
    const body = document.getElementById('woToolBody');
    if (!body) return;
    const placeholder = body.querySelector('tr[data-placeholder]');
    if (placeholder) placeholder.remove();
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><input class="wo-tool-code" value="${esc(code||'')}" placeholder="工具编号" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input class="wo-tool-name" value="${esc(name||'')}" placeholder="工具/工装名称" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input class="wo-tool-qty" type="number" step="1" min="1" value="${qty||1}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;text-align:center;"></td>
      <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveToolRow(this)">×</button></td>`;
    body.appendChild(tr);
  },

  _woRemoveToolRow(btn) {
    const tr = btn.closest('tr');
    if (!tr) return;
    tr.remove();
    const body = document.getElementById('woToolBody');
    if (body && body.querySelectorAll('tr').length === 0) {
      body.innerHTML = '<tr data-placeholder><td colspan="4" style="text-align:center;padding:24px;font-size:12px;color:var(--text-muted);">暂无工装工具需求，点击上方按钮添加</td></tr>';
    }
  },

  _woCollectTools() {
    const body = document.getElementById('woToolBody');
    if (!body) return [];
    const rows = body.querySelectorAll('tr:not([data-placeholder])');
    const tools = [];
    rows.forEach(row => {
      const code = (row.querySelector('.wo-tool-code')?.value || '').trim();
      const name = (row.querySelector('.wo-tool-name')?.value || '').trim();
      const qty = parseInt(row.querySelector('.wo-tool-qty')?.value) || 1;
      if (code || name) tools.push({ WRKCT: code || '', WRKTX: name || '', MGEIN: qty });
    });
    return tools;
  },

  /* ----- 保存逻辑 ----- */
  _saveManual(mode) {
    const auart = document.getElementById('woNewType').value;
    const eqCode = document.getElementById('woNewEq').value;
    const desc = document.getElementById('woNewDesc').value.trim();
    const wc = document.getElementById('woNewWC').value;
    const prio = document.getElementById('woNewPrio').value;
    const gstrp = document.getElementById('woNewGstrp').value;
    const gltrp = document.getElementById('woNewGltrp').value;
    const settleObj = document.getElementById('woNewSettleObj')?.value.trim() || '';
    const safety = document.getElementById('woNewSafety')?.value.trim() || '';

    // 基础校验——草稿和完整都需要
    if (!auart) { toast('请选择工单类型！'); return; }
    if (!eqCode) { toast('请选择关联设备！'); return; }

    if (mode === 'full') {
      // 完整保存：校验工作中心、描述、至少一道工序、PM03结算对象
      if (!wc) { toast('请选择工作中心！'); return; }
      if (!desc) { toast('请填写工单描述！'); return; }
      if (auart === 'PM03' && !settleObj) { toast('PM03 改造/项目工单必须填写结算对象！'); return; }
      const ops = this._woCollectOperations();
      if (ops.length === 0) { toast('请至少填写一道工序！'); return; }
    }

    const eq = equipmentData.find(e => e.code === eqCode);
    const maxNum = workOrderV2Data.reduce((max, w) => Math.max(max, parseInt(w.AUFNR.replace('O', ''))), 0);
    const newAUFNR = 'O' + String(maxNum + 1).padStart(7, '0');
    const newId = 'WO' + String(workOrderV2Data.length + 1).padStart(5, '0');

    const auartMap = { PM01:'PM01 - 预防性维护工单', PM02:'PM02 - 维修工单', PM03:'PM03 - 改造/项目工单', ZI02:'ZI02 - 拆卸回收工单' };
    const statTxt = mode === 'draft' ? '草稿' : '编辑中';

    const newOrder = {
      id: newId, AUFNR: newAUFNR, AUART: auart, AUART_TXT: auartMap[auart] || '',
      EQUNR: eqCode, EQKTX: eq ? eq.name : '',
      KURZTEXT: desc || '(草稿)', PRIOK: prio,
      STAT: 'CRTE', STAT_TXT: statTxt,
      GSTRP: gstrp || (new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2,'0')+'-'+String(new Date().getDate()).padStart(2,'0')), GLTRP: gltrp || '',
      PERNR: '当前用户',
      sourceNo: '', taskListNo: '',
      faultPhenomenon: '', faultCause: '', solution: '',
      faultPhenomenonCode: '', faultCauseCode: '', faultSolutionCode: '',
      safetyMeasures: safety,
      acceptancePerson: '', acceptanceTime: '', acceptanceResult: '',
      createdBy: '当前用户', createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN'),
      settlementObject: settleObj
    };
    workOrderV2Data.push(newOrder);

    // 保存工序数据
    const ops = this._woCollectOperations();
    if (ops.length > 0) {
      if (typeof operationV2Data === 'undefined') window.operationV2Data = [];
      ops.forEach(op => {
        operationV2Data.push({
          orderId: newId, VORNR: op.VORNR, LTXA1: op.LTXA1,
          ARBPL: op.ARBPL || wc, ARBEIT: op.ARBEIT, ISMNW: 0,
          status: 'pending', feedback: ''
        });
      });
    }

    // 保存物料数据
    const mats = this._woCollectMaterials();
    if (mats.length > 0) {
      if (typeof materialComponentV2Data === 'undefined') window.materialComponentV2Data = [];
      mats.forEach(m => {
        materialComponentV2Data.push({
          orderId: newId, MATNR: m.MATNR, MATKTX: m.MATKTX,
          BDMNG: m.BDMNG, MEINS: m.MEINS, ENMNG: 0, remark: ''
        });
      });
    }

    const msg = mode === 'draft' ? '草稿已保存！' : '工单已创建！';
    toast(msg + ' 编号：' + newAUFNR);
    closeModal();
    this.filtered = [...workOrderV2Data];
    this.renderTable();
  },

  /* ========== 方式二：从通知单转化 ========== */
  createFromNotification() {
    const crteNotifications = notificationV2Data.filter(n => n.STAT === 'CRTE');

    if (crteNotifications.length === 0) {
      showModal('📋 引用通知单',
        '<div style="text-align:center;padding:40px;"><div style="font-size:48px;margin-bottom:16px;">📭</div><div style="font-size:14px;color:var(--text-secondary);">当前没有待处理的通知单</div><div style="font-size:12px;color:var(--text-muted);margin-top:8px;">所有通知单已转工单或已关闭</div></div>',
        [{text:'关闭',cls:'btn-secondary',action:closeModal}]);
      return;
    }

    const rows = crteNotifications.map(n => {
      const prioColor = n.PRIOK==='1-高'?'#dc2626':n.PRIOK==='2-中'?'#d97706':'#6b7280';
      return `<tr style="cursor:pointer;" onclick="closeModal();MaintenanceWorkOrderV3._convertNotification('${n.id}')"
        onmouseenter="this.style.background='#f0f9ff'" onmouseleave="this.style.background='white'">
        <td><strong style="color:var(--primary-lighter);">${esc(n.QMNUM)}</strong></td>
        <td>${esc(n.QMART_TXT)}</td>
        <td>${esc(n.EQUNR)} ${esc(n.EQKTX)}</td>
        <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(n.FENAM)}">${esc(n.FENAM)}</td>
        <td><span style="color:${prioColor};font-weight:600;">${esc(n.PRIOK)}</span></td>
        <td>${esc(n.QMDAT)}</td>
      </tr>`;
    }).join('');

    const body = `
    <div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);">
      以下为当前<span style="font-weight:700;color:var(--warning);">待处理</span>的通知单，点击选择要转为工单的通知单：
    </div>
    <div style="max-height:360px;overflow-y:auto;">
      <table class="data-table" style="font-size:13px;">
        <thead><tr><th>通知单号</th><th>类型</th><th>设备</th><th>故障描述</th><th>优先级</th><th>创建日期</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

    showModal('📋 选择通知单转为工单', body, [{text:'取消',cls:'btn-secondary',action:closeModal}], 'modal-lg');
  },

  /* ========== 方式二：从通知单转化 — 优化版（确认+补充+页签） ========== */
  _convertNotification(notifId) {
    const n=notificationV2Data.find(x=>x.id===notifId);
    if(!n)return;

    const eq=equipmentData.find(e=>e.code===n.EQUNR);
    const defaultAUART = n.QMART==='M2'?'PM01':'PM02';
    const defaultWC = eq ? eq.workCenter : '';
    const defaultWCName = eq ? (eq.workCenterName || eq.teamName || '') : '';

    // 工单类型选项
    const typeOpts = `<option value="PM02" ${defaultAUART==='PM02'?'selected':''}>PM02 - 维修工单（纠正性）</option>
      <option value="PM01" ${defaultAUART==='PM01'?'selected':''}>PM01 - 预防性维护工单</option>
      <option value="PM03" ${defaultAUART==='PM03'?'selected':''}>PM03 - 改造/项目工单</option>`;

    // 工作中心选项
    const wcOpts = '<option value="">请选择工作中心</option>' + wcMockData.filter(w=>w.status==='active')
      .map(w=>`<option value="${esc(w.code)}" ${w.code===defaultWC?'selected':''}>${esc(w.code)} — ${esc(w.name)}</option>`).join('');

    // 自动生成工单描述：故障现象描述 - 设备名称
    let autoDesc = '';
    if (n.faultPhenomenonCode) {
      autoDesc = esc(getCatalogFullName('A', n.faultPhenomenonCode)) + ' - ' + esc(n.EQKTX||n.EQUNR);
    } else if (n.FENAM) {
      autoDesc = esc(n.FENAM) + ' - ' + esc(n.EQKTX||n.EQUNR);
    } else {
      autoDesc = esc(n.EQKTX||n.EQUNR) + '维修';
    }

    // 故障现象展示文本
    let faultPhenDisplay = '';
    if (n.faultPhenomenonCode) {
      faultPhenDisplay = esc(getCatalogFullName('A', n.faultPhenomenonCode));
    } else if (n.QMART === 'M1' && n.FENAM) {
      faultPhenDisplay = esc(n.FENAM);
    } else {
      faultPhenDisplay = '—（M2维护请求不要求故障现象）';
    }

    // 常用工序推荐提示
    let commonOpsHint = '';
    if (n.faultPhenomenonCode && eq) {
      const eqTypeName = eq.typeName || eq.name || '';
      const matchingOps = commonOperationLibrary.filter(co =>
        co.equipmentTypes.some(t => eqTypeName.includes(t) || t === '所有设备')
      );
      if (matchingOps.length > 0) {
        commonOpsHint = `<div style="margin-top:8px;padding:10px 14px;background:#fffbeb;border-radius:8px;font-size:12px;color:#92400e;border:1px solid #fde68a;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
          <span>💡 该故障现象常用的解决措施包括：<strong>${matchingOps.slice(0,3).map(co=>esc(co.description)).join('、')}</strong>${matchingOps.length>3?' 等'+(matchingOps.length-3)+'项':''}。是否从常用工序库引用？</span>
          <button class="btn btn-sm" style="background:#f59e0b;color:#fff;border:none;padding:5px 14px;font-size:12px;font-weight:600;border-radius:16px;white-space:nowrap;" onclick="MaintenanceWorkOrderV3._woShowCommonOps()">引用常用工序 →</button>
        </div>`;
      }
    }

    // M2通知单的期望完成日期（用于默认计划完成日期）
    const defaultGltrp = n.expectedDate || '';

    const secStyle = 'font-size:13px;font-weight:600;color:var(--text);padding-bottom:8px;border-bottom:2px solid var(--primary);margin-bottom:2px;display:flex;align-items:center;gap:8px;';

    showModal('📋 从通知单创建工单', `
      <!-- 顶部：通知单号 + 查看详情 -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:10px 14px;background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:8px;border:1px solid #bfdbfe;">
        <div style="font-size:14px;font-weight:700;color:#1e40af;">📋 从通知单创建工单</div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:13px;color:var(--text-secondary);">通知单号：<strong style="color:var(--primary-lighter);">${esc(n.QMNUM)}</strong></span>
          <button class="btn btn-sm" style="background:white;color:#2563eb;border:1px solid #93c5fd;padding:4px 12px;font-size:11px;font-weight:600;border-radius:14px;" onclick="closeModal();MaintenanceNotificationV3.detail('${n.id}')">查看通知单详情</button>
        </div>
      </div>

      <!-- ====== 通知单信息区（只读，自动带入） ====== -->
      <div style="${secStyle}">📋 通知单信息（自动带入，只读）</div>
      <div class="form-grid" style="margin-top:12px;margin-bottom:20px;">
        <div class="form-group">
          <label style="font-size:11px;color:var(--text-muted);">通知单类型</label>
          <input value="${esc(n.QMART_TXT)}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
        </div>
        <div class="form-group">
          <label style="font-size:11px;color:var(--text-muted);">设备</label>
          <input value="${esc(n.EQUNR)} ${esc(n.EQKTX)}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
        </div>
        <div class="form-group">
          <label style="font-size:11px;color:var(--text-muted);">功能位置</label>
          <input value="${eq?esc(eq.locationName):'—'}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
        </div>
        <div class="form-group">
          <label style="font-size:11px;color:var(--text-muted);">优先级</label>
          <input value="${esc(n.PRIOK)}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;font-weight:600;color:${n.PRIOK==='1-高'?'#dc2626':n.PRIOK==='2-中'?'#d97706':'#6b7280'};">
        </div>
        <div class="form-group full">
          <label style="font-size:11px;color:var(--text-muted);">故障现象</label>
          <input value="${faultPhenDisplay}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
        </div>
        <div class="form-group full">
          <label style="font-size:11px;color:var(--text-muted);">故障描述</label>
          <textarea readonly rows="2" style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;resize:none;">${esc(n.FENAM)}</textarea>
        </div>
      </div>

      <!-- ====== 工单补充信息区（需用户填写） ====== -->
      <div style="${secStyle}">📝 工单补充信息（需填写）</div>
      <div class="form-grid" style="margin-top:12px;margin-bottom:20px;">
        <div class="form-group">
          <label style="font-weight:600;">工单类型 <span style="color:var(--danger);">*</span></label>
          <select id="woConvType" onchange="MaintenanceWorkOrderV3._woOnConvTypeChange()" style="font-size:14px;font-weight:500;">${typeOpts}</select>
          <span style="font-size:11px;color:var(--text-muted);margin-top:3px;display:block;">${defaultAUART==='PM02'?'M1默认建议PM02（纠正性维修）':'M2默认建议PM01（预防性维护）'} | PM03需填写结算对象</span>
        </div>

        <div class="form-group full">
          <label style="font-weight:600;">工单描述 <span style="color:var(--danger);">*</span></label>
          <input id="woConvDesc" value="${autoDesc}" maxlength="100" placeholder="自动拼接生成，可修改">
          <span style="font-size:11px;color:var(--text-muted);">自动拼接：故障现象 + 设备名称，可手动修改</span>
        </div>

        <div class="form-group">
          <label style="font-weight:600;">主要工作中心 <span style="color:var(--danger);">*</span></label>
          <select id="woConvWC">${wcOpts}</select>
          ${defaultWC?`<span style="font-size:11px;color:var(--text-muted);">从设备主数据带出：${esc(defaultWCName)}</span>`:'<span style="font-size:11px;color:var(--text-muted);">设备未配置默认班组，请手动选择</span>'}
        </div>

        <div class="form-group" style="display:flex;gap:10px;">
          <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
            <label style="font-weight:600;font-size:13px;">计划开始</label>
            <input type="date" id="woConvGstrp" style="padding:8px 10px;">
          </div>
          <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
            <label style="font-weight:600;font-size:13px;">计划完成</label>
            <input type="date" id="woConvGltrp" value="${defaultGltrp}" style="padding:8px 10px;">
            ${n.QMART==='M2'&&defaultGltrp?'<span style="font-size:11px;color:var(--text-muted);">来自通知单期望完成日期</span>':''}
          </div>
        </div>

        <div id="woConvSettleWrap" class="form-group" style="display:none;">
          <label style="font-weight:600;">结算对象 <span style="color:var(--danger);">*</span></label>
          <input id="woConvSettleObj" placeholder="内部订单号 / WBS元素" maxlength="30">
          <span style="font-size:11px;color:var(--text-muted);">PM03改造项目必须指定结算对象</span>
        </div>

        <input type="hidden" id="woConvNotifId" value="${esc(notifId)}">
        <input type="hidden" id="woConvEqCode" value="${esc(n.EQUNR)}">
      </div>

      <!-- ====== 页签区域 ====== -->
      <div style="margin-top:4px;">
        <div class="tabs" style="margin-bottom:2px;">
          <div class="tab active" id="woTabBtn1" onclick="MaintenanceWorkOrderV3._woSwitchTab('1')">工序</div>
          <div class="tab" id="woTabBtn2" onclick="MaintenanceWorkOrderV3._woSwitchTab('2')">物料组件</div>
          <div class="tab" id="woTabBtn3" onclick="MaintenanceWorkOrderV3._woSwitchTab('3')">安全措施</div>
          <div class="tab" id="woTabBtn4" onclick="MaintenanceWorkOrderV3._woSwitchTab('4')">附件</div>
        </div>

        <!-- 页签1：工序 -->
        <div class="tab-panel active" id="woTabPanel1" style="padding-top:12px;">
          ${commonOpsHint}
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-size:12px;color:var(--text-secondary);">工序列表（至少一道方可保存）</span>
            <div style="display:flex;gap:6px;">
              <button class="btn btn-sm" style="background:#f0fdf4;color:#166534;border:1px solid #86efac;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woShowCommonOps()" title="从常用工序库快速添加">📋 常用工序库</button>
              <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddOperationRow()">+ 添加工序</button>
            </div>
          </div>
          <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
            <table class="data-table" style="font-size:12px;margin:0;" id="woOpsTable">
              <thead><tr>
                <th style="width:60px;">序号</th><th>工作描述 <span style="color:var(--danger);">*</span></th><th style="width:130px;">工作中心</th><th style="width:80px;">工时(h)</th><th style="width:50px;">操作</th>
              </tr></thead>
              <tbody id="woOpsBody">
                <tr id="woOpsRow1">
                  <td class="wo-op-seq">0010</td>
                  <td><input class="wo-op-desc" placeholder="如：切断电源上锁挂牌" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
                  <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;"><option value="">继承抬头</option>${wcOpts}</select></td>
                  <td><input class="wo-op-hrs" type="number" step="0.5" min="0" placeholder="0.5" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
                  <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 页签2：物料组件 -->
        <div class="tab-panel" id="woTabPanel2" style="padding-top:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-size:12px;color:var(--text-secondary);">物料需求列表（选填）</span>
            <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddMaterialRow()">+ 添加物料</button>
          </div>
          <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
            <table class="data-table" style="font-size:12px;margin:0;">
              <thead><tr><th style="width:120px;">物料编码</th><th>物料名称</th><th style="width:80px;">需求数量</th><th style="width:60px;">单位</th><th style="width:50px;">操作</th></tr></thead>
              <tbody id="woMatBody">
                <tr data-placeholder style="color:var(--text-muted);"><td colspan="5" style="text-align:center;padding:24px;font-size:12px;">暂无物料需求，点击上方按钮添加</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 页签3：安全措施 -->
        <div class="tab-panel" id="woTabPanel3" style="padding-top:12px;">
          <div class="form-group">
            <label style="font-weight:600;font-size:13px;">安全措施（选填）</label>
            <textarea id="woConvSafety" rows="5" placeholder="记录隔离、锁定、防护要求等，如：&#10;1. 关闭泵进出口阀门，确认管道排空&#10;2. 断电并执行LOTO程序&#10;3. 作业区域设置警示带，配备灭火器" style="resize:vertical;min-height:100px;"></textarea>
          </div>
        </div>

        <!-- 页签4：附件 -->
        <div class="tab-panel" id="woTabPanel4" style="padding-top:12px;">
          <div style="border:2px dashed var(--border);border-radius:8px;padding:24px;text-align:center;cursor:pointer;transition:all .15s;"
            onclick="toast('附件上传功能将在后续版本实现')"
            onmouseenter="this.style.borderColor='var(--primary)';this.style.background='#f8fafc';"
            onmouseleave="this.style.borderColor='var(--border)';this.style.background='white';">
            <div style="font-size:32px;margin-bottom:6px;">📎</div>
            <div style="font-size:13px;color:var(--text-secondary);">点击上传附件</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">支持图片、文档（故障照片、参考图纸等）</div>
          </div>
        </div>
      </div>
    `, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'保存为草稿',cls:'btn-secondary',style:'background:#f3f4f6;color:#374151;border:1px solid #d1d5db;',action:()=>{ MaintenanceWorkOrderV3._doConvertNotification('${notifId}','draft'); }},
      {text:'保存',cls:'btn-primary',action:()=>{ MaintenanceWorkOrderV3._doConvertNotification('${notifId}','full'); }}
    ], 'modal-xl');

    // 初始化PM03联动
    this._woOnConvTypeChange();
  },

  /* ----- 执行通知单→工单转换（支持草稿/完整模式） ----- */
  _doConvertNotification(notifId, mode) {
    const n=notificationV2Data.find(x=>x.id===notifId);
    if(!n)return;

    const auart=document.getElementById('woConvType')?.value;
    const desc=document.getElementById('woConvDesc')?.value.trim();
    const wc=document.getElementById('woConvWC')?.value;
    const gstrp=document.getElementById('woConvGstrp')?.value;
    const gltrp=document.getElementById('woConvGltrp')?.value;
    const settleObj=document.getElementById('woConvSettleObj')?.value.trim()||'';
    const safety=document.getElementById('woConvSafety')?.value.trim()||'';

    // 基础校验——草稿和完整都需要
    if(!auart){toast('请选择工单类型！');return;}
    // 设备从通知单自动带入，不需要单独校验（已在来源中确认）

    if(mode==='full'){
      // 完整保存校验
      if(!wc){toast('请选择主要工作中心！');return;}
      if(!desc){toast('请填写工单描述！');return;}
      if(auart==='PM03'&&!settleObj){toast('PM03 改造/项目工单必须填写结算对象！');return;}
      const ops=this._woCollectOperations();
      if(ops.length===0){toast('请至少填写一道工序！');return;}
    }

    const eq=equipmentData.find(e=>e.code===n.EQUNR);
    const maxNum=workOrderV2Data.reduce((max,w)=>Math.max(max,parseInt(w.AUFNR.replace('O',''))),0);
    const newAUFNR='O'+String(maxNum+1).padStart(7,'0');
    const newId='WO'+String(workOrderV2Data.length+1).padStart(5,'0');

    const auartMap={PM01:'PM01 - 预防性维护工单',PM02:'PM02 - 维修工单',PM03:'PM03 - 改造/项目工单',ZI02:'ZI02 - 拆卸回收工单'};
    const statTxt=mode==='draft'?'草稿':'编辑中';

    const newOrder={
      id:newId,AUFNR:newAUFNR,AUART:auart,AUART_TXT:auartMap[auart]||'',
      EQUNR:n.EQUNR,EQKTX:n.EQKTX,KURZTEXT:desc||(n.EQKTX||'维修'),
      PRIOK:n.PRIOK||'2-中',
      STAT:'CRTE',STAT_TXT:statTxt,
      GSTRP:gstrp||(new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2,'0')+'-'+String(new Date().getDate()).padStart(2,'0')),
      GLTRP:gltrp||'',
      PERNR:eq?(eq.leader||'当前用户'):'当前用户',
      sourceNo:n.QMNUM,taskListNo:'',
      faultPhenomenon:n.FENAM,faultCause:'',solution:'',
      faultPhenomenonCode:n.faultPhenomenonCode||'',faultCauseCode:'',faultSolutionCode:'',
      safetyMeasures:safety,acceptancePerson:'',acceptanceTime:'',acceptanceResult:'',
      createdBy:'当前用户',createdAt:new Date().toLocaleString('zh-CN'),
      updatedAt:new Date().toLocaleString('zh-CN'),
      settlementObject:settleObj
    };
    workOrderV2Data.push(newOrder);

    // 保存工序数据
    const ops=this._woCollectOperations();
    if(ops.length>0){
      if(typeof operationV2Data==='undefined')window.operationV2Data=[];
      ops.forEach(op=>{
        operationV2Data.push({
          orderId:newId,VORNR:op.VORNR,LTXA1:op.LTXA1,
          ARBPL:op.ARBPL||wc,ARBEIT:op.ARBEIT,ISMNW:0,
          status:'pending',feedback:''
        });
      });
    }

    // 保存物料数据
    const mats=this._woCollectMaterials();
    if(mats.length>0){
      if(typeof materialComponentV2Data==='undefined')window.materialComponentV2Data=[];
      mats.forEach(m=>{
        materialComponentV2Data.push({
          orderId:newId,MATNR:m.MATNR,MATKTX:m.MATKTX,
          BDMNG:m.BDMNG,MEINS:m.MEINS,ENMNG:0,remark:''
        });
      });
    }

    // 通知单状态联动 → ORDP（已转工单）
    n.relatedOrder=newAUFNR;
    n.STAT='ORDP';
    n.STAT_TXT='已转工单';
    n.updatedAt=new Date().toLocaleString('zh-CN');

    const msg=mode==='draft'?'草稿已保存！':'工单已生成！';
    toast(msg+' 编号：'+newAUFNR+(n.QMNUM?' (来源通知单: '+n.QMNUM+')':''));
    closeModal();
    this.filtered=[...workOrderV2Data];
    this.renderTable();
  },

  /* ========== 方式三：从任务清单引用 ========== */
  createFromTaskList() {
    const publishedTL = (typeof taskListMockData !== 'undefined' ? taskListMockData : []).filter(t => t.PLNST === '已发布');

    if (publishedTL.length === 0) {
      showModal('📑 引用任务清单',
        '<div style="text-align:center;padding:40px;"><div style="font-size:48px;margin-bottom:16px;">📭</div><div style="font-size:14px;color:var(--text-secondary);">当前没有已发布的任务清单</div><div style="font-size:12px;color:var(--text-muted);margin-top:8px;">请先在"设备主数据 → 任务清单"中创建并发布</div></div>',
        [{text:'关闭',cls:'btn-secondary',action:closeModal}]);
      return;
    }

    const typeText = { E:'设备', T:'功能位置', G:'通用' };
    const rows = publishedTL.map(tl => `
      <tr style="cursor:pointer;" onclick="closeModal();MaintenanceWorkOrderV3._selectTaskList('${tl.id}')"
        onmouseenter="this.style.background='#f5f3ff'" onmouseleave="this.style.background='white'">
        <td><strong style="color:#7c3aed;">${esc(tl.PLNNR)}</strong></td>
        <td>${esc(tl.PLTXT)}</td>
        <td><span class="badge badge-sm" style="background:#f3e8ff;color:#6d28d9;">${typeText[tl.PLNTY]||esc(tl.PLNTY)}</span></td>
        <td>${esc(tl.ARBPL)}</td>
        <td style="font-family:monospace;font-size:12px;">${esc(tl.PLNAL)}</td>
        <td>${(tl.operations||[]).length} 道工序</td>
      </tr>`).join('');

    const body = `
    <div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);">
      以下为已发布的<span style="font-weight:700;color:#7c3aed;">标准作业模板</span>，选择后将自动带入工序、物料与工具：
    </div>
    <div style="max-height:360px;overflow-y:auto;">
      <table class="data-table" style="font-size:13px;">
        <thead><tr><th>编码</th><th>描述</th><th>类型</th><th>工作中心</th><th>版本</th><th>工序数</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

    showModal('📑 选择任务清单模板', body, [{text:'取消',cls:'btn-secondary',action:closeModal}], 'modal-lg');
  },

  _selectTaskList(tlId) {
    const tl = (typeof taskListMockData !== 'undefined' ? taskListMockData : []).find(t => t.id === tlId);
    if (!tl) return;

    // 清单类型描述
    const tlTypeName = tl.PLNTY==='E'?'设备任务清单':tl.PLNTY==='T'?'功能位置任务清单':'通用任务清单';
    const tlUsageName = tl.PLNAW==='M01'?'维修':tl.PLNAW==='M02'?'检查':tl.PLNAW==='M03'?'润滑':esc(tl.PLNAW);

    // 根据清单用途默认工单类型
    const defaultAUART = (tl.PLNAW==='M01'||tl.PLNAW==='M02')?'PM01':'PM02';
    const typeOpts = `<option value="PM01" ${defaultAUART==='PM01'?'selected':''}>PM01 - 预防性维护工单</option>
      <option value="PM02" ${defaultAUART==='PM02'?'selected':''}>PM02 - 维修工单（纠正性）</option>
      <option value="PM03">PM03 - 改造/项目工单</option>`;

    // 设备：E类型自动带入关联设备（只读），G/T类型手动选择
    const isEqReadonly = tl.PLNTY === 'E' && tl.associatedObj;
    const defaultEq = isEqReadonly ? tl.associatedObj : '';
    const defaultEqInfo = defaultEq ? equipmentData.find(e => e.code === defaultEq) : null;

    const eqOpts = '<option value="">请选择设备</option>' + equipmentData.map(e =>
      `<option value="${esc(e.code)}" ${e.code===defaultEq?'selected':''}>${esc(e.name)} (${esc(e.code)})</option>`
    ).join('');

    // 工作中心选项
    const defaultWC = tl.ARBPL || '';
    const wcOpts = '<option value="">请选择工作中心</option>' + wcMockData.filter(w=>w.status==='active')
      .map(w => `<option value="${esc(w.code)}" ${w.code===defaultWC?'selected':''}>${esc(w.code)} — ${esc(w.name)}</option>`).join('');

    // 自动生成工单描述：任务清单描述 + 设备名称
    let autoDesc = esc(tl.PLTXT);
    if (defaultEqInfo) autoDesc = esc(tl.PLTXT) + ' - ' + esc(defaultEqInfo.name);

    const secStyle = 'font-size:13px;font-weight:600;color:var(--text);padding-bottom:8px;border-bottom:2px solid var(--primary);margin-bottom:2px;display:flex;align-items:center;gap:8px;';

    // ====== 预填充 HTML ======
    // 工序表行
    const opsRows = (tl.operations||[]).map((op, i) => `
      <tr id="woOpsRow${i+1}">
        <td class="wo-op-seq">${esc(op.VORNR)}</td>
        <td><input class="wo-op-desc" value="${esc(op.LTXA1)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;"><option value="">继承抬头</option>${wcOpts.replace(new RegExp(`value="${esc(op.ARBPL)}"`), `value="${esc(op.ARBPL)}" selected`)}</select></td>
        <td><input class="wo-op-hrs" type="number" step="0.5" min="0" value="${esc(op.ARBEIT)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>
      </tr>`).join('') || `<tr id="woOpsRow1">
      <td class="wo-op-seq">0010</td>
      <td><input class="wo-op-desc" placeholder="如：关闭阀门并排空" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;"><option value="">继承抬头</option>${wcOpts}</select></td>
      <td><input class="wo-op-hrs" type="number" step="0.5" min="0" placeholder="0.5" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>
    </tr>`;

    // 物料表行（收集工序级+工单级物料去重）
    const allMats = [];
    const matSeen = new Set();
    (tl.operations||[]).forEach(op => {
      (op.components||[]).forEach(c => {
        if (!matSeen.has(c.MATNR)) { matSeen.add(c.MATNR); allMats.push(c); }
      });
    });
    (tl.components||[]).forEach(c => {
      if (!matSeen.has(c.MATNR)) { matSeen.add(c.MATNR); allMats.push(c); }
    });
    const matBodyHtml = allMats.length > 0 ? allMats.map((c, i) => `
      <tr>
        <td><select class="wo-mat-code" onchange="MaintenanceWorkOrderV3._woOnMatSelect(this)" style="width:100%;padding:6px 4px;font-size:11px;">
          <option value="${esc(c.MATNR)}" data-name="${esc(c.MAKTX||'')}" data-unit="${esc(c.MEINS)}" selected>${esc(c.MATNR)} — ${esc(c.MAKTX||'')}</option></select></td>
        <td><input class="wo-mat-name" readonly value="${esc(c.MAKTX||'')}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f9fafb;"></td>
        <td><input class="wo-mat-qty" type="number" step="0.1" min="0.1" value="${esc(c.BDMNG)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input class="wo-mat-unit" readonly value="${esc(c.MEINS)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f9fafb;text-align:center;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveMatRow(this)">×</button></td>
      </tr>`).join('') : '<tr data-placeholder style="color:var(--text-muted);"><td colspan="5" style="text-align:center;padding:24px;font-size:12px;">暂无物料需求，点击上方按钮添加</td></tr>';

    // 工具表行（收集工序级+工单级工具去重）
    const allTools = [];
    const toolSeen = new Set();
    (tl.operations||[]).forEach(op => {
      (op.tools||[]).forEach(t => {
        const key = t.WRKCT || t.WRKTX;
        if (!toolSeen.has(key)) { toolSeen.add(key); allTools.push(t); }
      });
    });
    (tl.tools||[]).forEach(t => {
      const key = t.WRKCT || t.WRKTX;
      if (!toolSeen.has(key)) { toolSeen.add(key); allTools.push(t); }
    });
    const toolBodyHtml = allTools.length > 0 ? allTools.map(t => `
      <tr>
        <td><input class="wo-tool-code" value="${esc(t.WRKCT||'')}" placeholder="工具编号" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input class="wo-tool-name" value="${esc(t.WRKTX||'')}" placeholder="工具/工装名称" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input class="wo-tool-qty" type="number" step="1" min="1" value="${t.MGEIN||1}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;text-align:center;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveToolRow(this)">×</button></td>
      </tr>`).join('') : '<tr data-placeholder style="color:var(--text-muted);"><td colspan="4" style="text-align:center;padding:24px;font-size:12px;">暂无工装工具需求，点击上方按钮添加</td></tr>';

    const body = `
    <!-- 任务清单信息卡（确认源头） -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:10px 14px;background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-radius:8px;border:1px solid #c4b5fd;">
      <div>
        <div style="font-size:14px;font-weight:700;color:#5b21b6;">📑 从任务清单创建工单</div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">
          编码：<strong>${esc(tl.PLNNR)}</strong> | 版本：<strong>${esc(tl.PLNAL)}</strong> | ${tlTypeName} · ${tlUsageName}
          <span style="margin-left:10px;">| 清单描述：<strong>${esc(tl.PLTXT)}</strong></span>
        </div>
      </div>
      <button class="btn btn-sm" style="background:white;color:#5b21b6;border:1px solid #c4b5fd;padding:4px 12px;font-size:11px;font-weight:600;border-radius:14px;" onclick="closeModal();MaintenanceTasklist&&MaintenanceTasklist.detail?MaintenanceTasklist.detail('${tl.id}'):toast('请先打开任务清单模块')">查看任务清单详情</button>
    </div>

    <!-- ====== 任务清单只读信息 ====== -->
    <div style="${secStyle}">📋 任务清单信息（自动带入，只读）</div>
    <div class="form-grid" style="margin-top:10px;margin-bottom:18px;">
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">清单类型</label>
        <input value="${tlTypeName}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">清单用途</label>
        <input value="${tlUsageName}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">抬头工作中心</label>
        <input value="${esc(tl.ARBPL)}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">关联对象</label>
        <input value="${tl.associatedObj||'—（通用清单未绑定）'}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
    </div>

    <!-- ====== 工单抬头信息 ====== -->
    <div style="${secStyle}">📝 工单抬头信息（需确认/补充）</div>
    <div class="form-grid" style="margin-top:12px;margin-bottom:20px;">
      <div class="form-group">
        <label style="font-weight:600;">工单类型 <span style="color:var(--danger);">*</span></label>
        <select id="tlWoType" onchange="MaintenanceWorkOrderV3._tlOnTypeChange()" style="font-size:14px;font-weight:500;">${typeOpts}</select>
        <span style="font-size:11px;color:var(--text-muted);margin-top:3px;display:block;">${defaultAUART==='PM01'?'任务清单用途映射为PM01（预防性）':'默认PM02'} | PM03需填写结算对象</span>
      </div>

      <div class="form-group">
        <label style="font-weight:600;">设备 <span style="color:var(--danger);">*</span></label>
        ${isEqReadonly
          ? `<input value="${esc(defaultEq)} ${esc(defaultEqInfo?defaultEqInfo.name:'')}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;"><input type="hidden" id="tlWoEq" value="${esc(defaultEq)}"><span style="font-size:11px;color:var(--text-muted);">设备任务清单自动带入关联设备，只读</span>`
          : `<select id="tlWoEq" onchange="MaintenanceWorkOrderV3._tlOnEqChange()">${eqOpts}</select><span style="font-size:11px;color:var(--text-muted);">${tl.PLNTY==='G'?'通用清单需手动选择设备':tl.PLNTY==='T'?'请选择该功能位置下的设备':''}</span>`
        }
      </div>

      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">功能位置</label>
        <input id="tlWoLocation" value="${defaultEqInfo?esc(defaultEqInfo.locationName):'—'}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>

      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">设备名称</label>
        <input id="tlWoEqName" value="${defaultEqInfo?esc(defaultEqInfo.name):'—'}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>

      <div class="form-group full">
        <label style="font-weight:600;">工单描述 <span style="color:var(--danger);">*</span></label>
        <input id="tlWoDesc" value="${autoDesc}" maxlength="100" placeholder="自动填充任务清单描述，可修改">
        <span style="font-size:11px;color:var(--text-muted);">自动填充：任务清单描述 + 设备名称，可手动修改</span>
      </div>

      <div class="form-group">
        <label style="font-weight:600;">主要工作中心 <span style="color:var(--danger);">*</span></label>
        <select id="tlWoWC">${wcOpts}</select>
        ${defaultWC?`<span style="font-size:11px;color:var(--text-muted);">从任务清单抬头带出</span>`:'<span style="font-size:11px;color:var(--text-muted);">请选择工作中心</span>'}
      </div>

      <div class="form-group">
        <label style="font-weight:600;font-size:13px;">优先级</label>
        <select id="tlWoPrio"><option value="1-高">1-高</option><option value="2-中" selected>2-中</option><option value="3-低">3-低</option></select>
      </div>

      <div class="form-group" style="display:flex;gap:10px;">
        <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
          <label style="font-weight:600;font-size:13px;">计划开始</label>
          <input type="date" id="tlWoGstrp" style="padding:8px 10px;">
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
          <label style="font-weight:600;font-size:13px;">计划完成</label>
          <input type="date" id="tlWoGltrp" style="padding:8px 10px;">
        </div>
      </div>

      <div id="tlWoSettleWrap" class="form-group" style="display:none;">
        <label style="font-weight:600;">结算对象 <span style="color:var(--danger);">*</span></label>
        <input id="tlWoSettleObj" placeholder="内部订单号 / WBS元素" maxlength="30">
        <span style="font-size:11px;color:var(--text-muted);">PM03改造项目必须指定结算对象</span>
      </div>

      <input type="hidden" id="tlHiddenId" value="${esc(tl.id)}">
      <input type="hidden" id="tlHiddenEQUNR" value="${esc(defaultEq)}">
    </div>

    <!-- ====== 页签区域（从任务清单预填充，可编辑） ====== -->
    <div style="margin-top:4px;">
      <div class="tabs" style="margin-bottom:2px;">
        <div class="tab active" id="woTabBtn1" onclick="MaintenanceWorkOrderV3._woSwitchTab('1')">工序</div>
        <div class="tab" id="woTabBtn2" onclick="MaintenanceWorkOrderV3._woSwitchTab('2')">物料组件</div>
        <div class="tab" id="woTabBtn3" onclick="MaintenanceWorkOrderV3._woSwitchTab('3')">工具/工装</div>
        <div class="tab" id="woTabBtn4" onclick="MaintenanceWorkOrderV3._woSwitchTab('4')">安全措施</div>
        <div class="tab" id="woTabBtn5" onclick="MaintenanceWorkOrderV3._woSwitchTab('5')">附件</div>
      </div>

      <!-- 页签1：工序 -->
      <div class="tab-panel active" id="woTabPanel1" style="padding-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:12px;color:var(--text-secondary);">已从任务清单带入 <strong>${(tl.operations||[]).length}</strong> 道工序，可自由增删改</span>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddOperationRow()">+ 添加工序</button>
          </div>
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <table class="data-table" style="font-size:12px;margin:0;" id="woOpsTable">
            <thead><tr>
              <th style="width:60px;">序号</th><th>工作描述 <span style="color:var(--danger);">*</span></th><th style="width:130px;">工作中心</th><th style="width:80px;">工时(h)</th><th style="width:50px;">操作</th>
            </tr></thead>
            <tbody id="woOpsBody">${opsRows}</tbody>
          </table>
        </div>
      </div>

      <!-- 页签2：物料组件 -->
      <div class="tab-panel" id="woTabPanel2" style="padding-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:12px;color:var(--text-secondary);">已从任务清单带入 <strong>${allMats.length}</strong> 条物料，可自由增删改</span>
          <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddMaterialRow()">+ 添加物料</button>
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <table class="data-table" style="font-size:12px;margin:0;">
            <thead><tr><th style="width:120px;">物料编码</th><th>物料名称</th><th style="width:80px;">需求数量</th><th style="width:60px;">单位</th><th style="width:50px;">操作</th></tr></thead>
            <tbody id="woMatBody">${matBodyHtml}</tbody>
          </table>
        </div>
      </div>

      <!-- 页签3：工具/工装 -->
      <div class="tab-panel" id="woTabPanel3" style="padding-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:12px;color:var(--text-secondary);">已从任务清单带入 <strong>${allTools.length}</strong> 条工装工具，可自由增删改</span>
          <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddToolRow()">+ 添加工具</button>
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <table class="data-table" style="font-size:12px;margin:0;">
            <thead><tr><th style="width:120px;">工具编号</th><th>工具/工装名称</th><th style="width:80px;">数量</th><th style="width:50px;">操作</th></tr></thead>
            <tbody id="woToolBody">${toolBodyHtml}</tbody>
          </table>
        </div>
      </div>

      <!-- 页签4：安全措施 -->
      <div class="tab-panel" id="woTabPanel4" style="padding-top:12px;">
        <div class="form-group">
          <label style="font-weight:600;font-size:13px;">安全措施（选填）</label>
          <textarea id="tlWoSafety" rows="5" placeholder="记录隔离、锁定、防护要求等&#10;（任务清单通常不含安全措施，请手动填写）" style="resize:vertical;min-height:100px;"></textarea>
        </div>
      </div>

      <!-- 页签5：附件 -->
      <div class="tab-panel" id="woTabPanel5" style="padding-top:12px;">
        <div style="border:2px dashed var(--border);border-radius:8px;padding:24px;text-align:center;cursor:pointer;transition:all .15s;"
          onclick="toast('附件上传功能将在后续版本实现')"
          onmouseenter="this.style.borderColor='var(--primary)';this.style.background='#f8fafc';"
          onmouseleave="this.style.borderColor='var(--border)';this.style.background='white';">
          <div style="font-size:32px;margin-bottom:6px;">📎</div>
          <div style="font-size:13px;color:var(--text-secondary);">点击上传附件</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">支持图片、文档（作业指导书、参考图纸等）</div>
        </div>
      </div>
    </div>`;

    showModal('📑 从任务清单创建工单', body, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'保存为草稿',cls:'btn-secondary',style:'background:#f3f4f6;color:#374151;border:1px solid #d1d5db;',action:()=>{ MaintenanceWorkOrderV3._doCreateFromTaskList('${tl.id}','draft'); }},
      {text:'保存',cls:'btn-primary',action:()=>{ MaintenanceWorkOrderV3._doCreateFromTaskList('${tl.id}','full'); }}
    ], 'modal-xl');

    // 初始化PM03联动
    this._tlOnTypeChange();
  },

  _doCreateFromTaskList(tlId, mode) {
    const tl = (typeof taskListMockData !== 'undefined' ? taskListMockData : []).find(t => t.id === tlId);
    if (!tl) return;

    const eqCode = document.getElementById('tlWoEq')?.value || document.getElementById('tlHiddenEQUNR')?.value;
    if (!eqCode) { toast('请选择/确认关联设备！'); return; }

    const auart = document.getElementById('tlWoType')?.value;
    const desc = document.getElementById('tlWoDesc')?.value?.trim() || tl.PLTXT;
    const wc = document.getElementById('tlWoWC')?.value;
    const prio = document.getElementById('tlWoPrio')?.value || '2-中';
    const gstrp = document.getElementById('tlWoGstrp')?.value || '';
    const gltrp = document.getElementById('tlWoGltrp')?.value || '';
    const settleObj = document.getElementById('tlWoSettleObj')?.value?.trim() || '';
    const safety = document.getElementById('tlWoSafety')?.value?.trim() || '';

    if (!auart) { toast('请选择工单类型！'); return; }

    if (mode === 'full') {
      if (!wc) { toast('请选择主要工作中心！'); return; }
      if (!desc) { toast('请填写工单描述！'); return; }
      if (auart === 'PM03' && !settleObj) { toast('PM03 改造/项目工单必须填写结算对象！'); return; }
      const ops = this._woCollectOperations();
      if (ops.length === 0) { toast('请至少保留一道工序！'); return; }
    }

    const eq = equipmentData.find(e => e.code === eqCode);
    const maxNum = workOrderV2Data.reduce((max, w) => Math.max(max, parseInt(w.AUFNR.replace('O', ''))), 0);
    const newAUFNR = 'O' + String(maxNum + 1).padStart(7, '0');
    const newId = 'WO' + String(workOrderV2Data.length + 1).padStart(5, '0');

    const auartMap = { PM01: 'PM01 - 预防性维护工单', PM02: 'PM02 - 维修工单', PM03: 'PM03 - 改造/项目工单' };
    const statTxt = mode === 'draft' ? '草稿' : '编辑中';
    const today = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()).padStart(2, '0');

    // 创建工单
    workOrderV2Data.push({
      id: newId, AUFNR: newAUFNR, AUART: auart, AUART_TXT: auartMap[auart] || '',
      EQUNR: eqCode, EQKTX: eq ? eq.name : '', KURZTEXT: desc,
      PRIOK: prio, STAT: 'CRTE', STAT_TXT: statTxt,
      GSTRP: gstrp || today, GLTRP: gltrp || '',
      PERNR: eq ? (eq.leader || '当前用户') : '当前用户',
      sourceNo: '', taskListNo: tl.PLNNR, planSource: '',
      faultPhenomenon: '', faultCause: '', solution: '',
      faultPhenomenonCode: '', faultCauseCode: '', faultSolutionCode: '',
      safetyMeasures: safety, acceptancePerson: '', acceptanceTime: '', acceptanceResult: '',
      createdBy: '当前用户', createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN'),
      settlementObject: settleObj
    });

    // 保存工序（从表单收集，而非直接复制模板）
    const ops = this._woCollectOperations();
    if (ops.length > 0) {
      if (typeof operationV2Data === 'undefined') window.operationV2Data = [];
      ops.forEach(op => {
        operationV2Data.push({
          orderId: newId, VORNR: op.VORNR, LTXA1: op.LTXA1,
          ARBPL: op.ARBPL || wc, ARBEIT: op.ARBEIT, ISMNW: 0,
          status: 'pending', feedback: ''
        });
      });
    }

    // 保存物料（从表单收集）
    const mats = this._woCollectMaterials();
    if (mats.length > 0) {
      if (typeof materialComponentV2Data === 'undefined') window.materialComponentV2Data = [];
      mats.forEach(m => {
        materialComponentV2Data.push({
          orderId: newId, MATNR: m.MATNR, MATKTX: m.MATKTX,
          BDMNG: m.BDMNG, MEINS: m.MEINS, ENMNG: 0, remark: '来源模板: ' + tl.PLNNR
        });
      });
    }

    // 保存工具/工装（从表单收集）
    const tools = this._woCollectTools();
    if (tools.length > 0) {
      if (typeof toolComponentV2Data === 'undefined') window.toolComponentV2Data = [];
      tools.forEach(t => {
        toolComponentV2Data.push({
          orderId: newId, WRKCT: t.WRKCT, WRKTX: t.WRKTX,
          MGEIN: t.MGEIN, remark: '来源模板: ' + tl.PLNNR
        });
      });
    }

    const totalOps = operationV2Data.filter(o => o.orderId === newId).length;
    const totalMats = materialComponentV2Data.filter(m => m.orderId === newId).length;
    const totalTools = (typeof toolComponentV2Data !== 'undefined' ? toolComponentV2Data : []).filter(t => t.orderId === newId).length;

    const msg = mode === 'draft' ? '草稿已保存！' : '工单已生成！';
    toast(msg + ' 编号：' + newAUFNR + ' | 已带入 ' + totalOps + ' 道工序、' + totalMats + ' 条物料' + (totalTools > 0 ? '、' + totalTools + ' 件工具' : ''));
    closeModal();
    this.filtered = [...workOrderV2Data];
    this.renderTable();
  },

  /* ----- 任务清单引用辅助：工单类型联动 ----- */
  _tlOnTypeChange() {
    const type = document.getElementById('tlWoType')?.value;
    const settleWrap = document.getElementById('tlWoSettleWrap');
    if (settleWrap) settleWrap.style.display = type === 'PM03' ? '' : 'none';
  },

  /* ----- 任务清单引用辅助：设备选择联动 ----- */
  _tlOnEqChange() {
    const eqCode = document.getElementById('tlWoEq')?.value;
    const eq = equipmentData.find(e => e.code === eqCode);
    const locEl = document.getElementById('tlWoLocation');
    const nameEl = document.getElementById('tlWoEqName');
    const descEl = document.getElementById('tlWoDesc');
    if (locEl) locEl.value = eq ? eq.locationName : '—';
    if (nameEl) nameEl.value = eq ? eq.name : '—';
    // 自动更新工单描述
    if (descEl && eq) {
      const tl = (typeof taskListMockData !== 'undefined' ? taskListMockData : []).find(t => t.id === document.getElementById('tlHiddenId')?.value);
      if (tl) descEl.value = esc(tl.PLTXT) + ' - ' + esc(eq.name);
    }
  },

  /* ========== 方式四：引用维护计划 ========== */
  createFromPlan() {
    const activePlans = pmPlanData.filter(p => p.status === 'active');

    if (activePlans.length === 0) {
      showModal('🔧 引用维护计划',
        '<div style="text-align:center;padding:40px;"><div style="font-size:48px;margin-bottom:16px;">📭</div><div style="font-size:14px;color:var(--text-secondary);">当前没有已生效的维护计划</div><div style="font-size:12px;color:var(--text-muted);margin-top:8px;">请先在"预防性维护计划"中创建并启用计划</div></div>',
        [{text:'关闭',cls:'btn-secondary',action:closeModal}]);
      return;
    }

    const devNameMap = {};
    equipmentData.forEach(e => { devNameMap[e.id] = e.name + ' (' + e.code + ')'; });

    const rows = activePlans.map(p => {
      const devs = p.devices || [];
      const eqInfo = devs.length > 0
        ? (devNameMap[devs[0].eqId] || devs[0].eqCode || '未关联设备')
        : '未关联设备';
      const opsCount = (p.ops || []).length;
      const prio = p.priority === 'critical' ? '1-高' : p.priority === 'important' ? '2-中' : '3-低';
      const planTypeLabel = p.planType === 'counter'
        ? '基于计数器（'+esc(p.cycleUnit)+'）' : '基于时间（每'+p.cycleValue+p.cycleUnit+'）';
      const tlInfo = p.associatedTaskList
        ? `<span style="color:#7c3aed;font-size:11px;">📑 ${esc(p.associatedTaskList.PLNNR)}</span>`
        : '<span style="color:var(--text-muted);font-size:11px;">—</span>';
      return `<tr style="cursor:pointer;" onclick="closeModal();MaintenanceWorkOrderV3._selectPlan('${p.id}')"
        onmouseenter="this.style.background='#f0fdf4'" onmouseleave="this.style.background='white'">
        <td><strong style="color:#065f46;">${esc(p.code)}</strong></td>
        <td>${esc(p.name)}</td>
        <td style="font-size:12px;">${esc(eqInfo)}</td>
        <td>${esc(p.maintenanceTypeName)}</td>
        <td style="font-size:11px;">${planTypeLabel}</td>
        <td>${tlInfo}</td>
        <td>${opsCount} 道工序</td>
      </tr>`;
    }).join('');

    const body = `
    <div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);">
      以下为<span style="font-weight:700;color:#065f46;">已生效</span>的预防性维护计划，点击选择要生成工单的计划：
    </div>
    <div style="max-height:360px;overflow-y:auto;">
      <table class="data-table" style="font-size:13px;">
        <thead><tr><th>计划编号</th><th>计划名称</th><th>关联设备</th><th>维保类型</th><th>触发条件</th><th>关联清单</th><th>工序数</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

    showModal('🔧 选择维护计划生成工单', body, [{text:'取消',cls:'btn-secondary',action:closeModal}], 'modal-lg');
  },

  /* ----- _selectPlan：维护计划信息确认 + 工单补充 + 多页签 ----- */
  _selectPlan(planId) {
    const plan = pmPlanData.find(p => p.id === planId);
    if (!plan) return;

    // 设备（自动带入，不可修改）
    const devs = plan.devices || [];
    const eq = devs.length > 0 ? equipmentData.find(e => e.id === devs[0].eqId) : null;
    const eqCode = eq ? eq.code : (devs.length > 0 ? devs[0].eqCode || '' : '');
    const eqName = eq ? eq.name : (devs.length > 0 ? devs[0].eqName || '未知设备' : '未知设备');
    const eqLocation = eq ? eq.locationName : (devs.length > 0 ? devs[0].locationName || '—' : '—');
    if (!eqCode) { toast('该计划未关联有效设备，无法生成工单！'); return; }

    // 计划类型描述
    const planTypeDesc = plan.planType === 'counter'
      ? '基于计数器（' + (plan.cycleUnit || '运行小时') + '）'
      : '基于时间';
    const triggerDesc = plan.planType === 'counter'
      ? '每运行 ' + plan.cycleValue + ' ' + (plan.cycleUnit || '小时')
      : '每 ' + plan.cycleValue + ' ' + (plan.cycleUnit || '天');

    // 上次维护信息
    const lastMaint = plan.lastMaintenanceDate
      ? plan.lastMaintenanceDate + (plan.lastReading ? '（累计 ' + plan.lastReading + 'h）' : '')
      : '无记录';
    const currentReadingInfo = plan.planType === 'counter' && plan.currentReading
      ? plan.currentReading + 'h' : '—';

    // 关联任务清单
    const tl = plan.associatedTaskList
      ? ((typeof taskListMockData !== 'undefined' ? taskListMockData : []).find(t => t.id === plan.associatedTaskList.id))
      : null;

    // 工单类型（固定PM01，只读）
    const typeOpts = `<option value="PM01" selected>PM01 - 预防性维护工单</option>`;

    // 工作中心选项
    const defaultWC = tl ? tl.ARBPL : (eq ? eq.workCenter : (plan.workCenter || ''));
    const defaultWCName = tl
      ? (wcMockData.find(w => w.code === tl.ARBPL)?.name || '')
      : (eq ? eq.team : (plan.workCenterName || ''));
    const wcOpts = '<option value="">请选择工作中心</option>' + wcMockData.filter(w => w.status === 'active')
      .map(w => `<option value="${esc(w.code)}" ${w.code === defaultWC ? 'selected' : ''}>${esc(w.code)} — ${esc(w.name)}</option>`).join('');

    // 自动生成工单描述
    const autoDesc = esc(plan.name) + ' - ' + esc(eqName);

    // 日期推算
    let defaultGstrp = '';
    if (plan.planType === 'time' && plan.lastMaintenanceDate && plan.cycleValue) {
      // 时间型：上次维护 + 周期
      const d = new Date(plan.lastMaintenanceDate);
      d.setDate(d.getDate() + plan.cycleValue);
      defaultGstrp = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    } else {
      // 计数型：取当前日期
      const now = new Date();
      defaultGstrp = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    }

    // 预估完工日期：开始日期 + 预估工期
    let defaultGltrp = '';
    const estDays = parseFloat(plan.estimatedDuration) || parseFloat(plan.stdHours) / 8 || 0;
    if (defaultGstrp && estDays > 0) {
      const d = new Date(defaultGstrp);
      d.setDate(d.getDate() + Math.ceil(estDays));
      defaultGltrp = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    const secStyle = 'font-size:13px;font-weight:600;color:var(--text);padding-bottom:8px;border-bottom:2px solid var(--primary);margin-bottom:2px;display:flex;align-items:center;gap:8px;';

    // ====== 预填充 HTML（根据是否关联任务清单） ======
    const hasTL = !!tl;

    // 工序表行
    const opsFromTL = hasTL ? (tl.operations || []) : [];
    const opsFromPlan = !hasTL ? (plan.ops || []).map((op, i) => ({
      VORNR: String((i + 1) * 10).padStart(4, '0'),
      LTXA1: op.content,
      ARBPL: plan.workCenter || '',
      ARBEIT: parseFloat(op.stdHours) || 0.5
    })) : [];

    const opsToPreFill = hasTL ? opsFromTL : opsFromPlan;
    const opsCount = opsToPreFill.length;

    const opsRows = opsCount > 0 ? opsToPreFill.map((op, i) => `
      <tr id="woOpsRow${i+1}">
        <td class="wo-op-seq">${esc(op.VORNR)}</td>
        <td><input class="wo-op-desc" value="${esc(op.LTXA1)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;"><option value="">继承抬头</option>${wcOpts.replace(new RegExp(`value="${esc(op.ARBPL||defaultWC)}"`), `value="${esc(op.ARBPL||defaultWC)}" selected`)}</select></td>
        <td><input class="wo-op-hrs" type="number" step="0.5" min="0" value="${esc(op.ARBEIT||0.5)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>
      </tr>`).join('') : `<tr id="woOpsRow1">
      <td class="wo-op-seq">0010</td>
      <td><input class="wo-op-desc" placeholder="如：拆卸电机地脚螺栓" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;"><option value="">继承抬头</option>${wcOpts}</select></td>
      <td><input class="wo-op-hrs" type="number" step="0.5" min="0" placeholder="0.5" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>
    </tr>`;

    // 物料表行
    let matsToPreFill = [];
    if (hasTL) {
      const allMats = [];
      const matSeen = new Set();
      (tl.operations || []).forEach(op => {
        (op.components || []).forEach(c => {
          if (!matSeen.has(c.MATNR)) { matSeen.add(c.MATNR); allMats.push(c); }
        });
      });
      (tl.components || []).forEach(c => {
        if (!matSeen.has(c.MATNR)) { matSeen.add(c.MATNR); allMats.push(c); }
      });
      matsToPreFill = allMats;
    } else {
      // 从计划的 parts 转换为物料格式
      matsToPreFill = (plan.parts || []).map(p => ({
        MATNR: p.matCode, MAKTX: p.matName, BDMNG: p.planQty, MEINS: p.unit
      }));
    }
    const matBodyHtml = matsToPreFill.length > 0 ? matsToPreFill.map((c, i) => `
      <tr>
        <td><select class="wo-mat-code" onchange="MaintenanceWorkOrderV3._woOnMatSelect(this)" style="width:100%;padding:6px 4px;font-size:11px;">
          <option value="${esc(c.MATNR)}" data-name="${esc(c.MAKTX||'')}" data-unit="${esc(c.MEINS)}" selected>${esc(c.MATNR)} — ${esc(c.MAKTX||'')}</option></select></td>
        <td><input class="wo-mat-name" readonly value="${esc(c.MAKTX||'')}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f9fafb;"></td>
        <td><input class="wo-mat-qty" type="number" step="0.1" min="0.1" value="${esc(c.BDMNG)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input class="wo-mat-unit" readonly value="${esc(c.MEINS)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f9fafb;text-align:center;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveMatRow(this)">×</button></td>
      </tr>`).join('') : '<tr data-placeholder style="color:var(--text-muted);"><td colspan="5" style="text-align:center;padding:24px;font-size:12px;">暂无物料需求，点击上方按钮添加</td></tr>';

    // 工具表行
    let toolsToPreFill = [];
    if (hasTL) {
      const allTools = [];
      const toolSeen = new Set();
      (tl.operations || []).forEach(op => {
        (op.tools || []).forEach(t => {
          const key = t.WRKCT || t.WRKTX;
          if (!toolSeen.has(key)) { toolSeen.add(key); allTools.push(t); }
        });
      });
      (tl.tools || []).forEach(t => {
        const key = t.WRKCT || t.WRKTX;
        if (!toolSeen.has(key)) { toolSeen.add(key); allTools.push(t); }
      });
      toolsToPreFill = allTools;
    } else {
      toolsToPreFill = (plan.tools || []);
    }
    const toolBodyHtml = toolsToPreFill.length > 0 ? toolsToPreFill.map(t => `
      <tr>
        <td><input class="wo-tool-code" value="${esc(t.WRKCT||'')}" placeholder="工具编号" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input class="wo-tool-name" value="${esc(t.WRKTX||'')}" placeholder="工具/工装名称" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input class="wo-tool-qty" type="number" step="1" min="1" value="${t.MGEIN||1}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;text-align:center;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveToolRow(this)">×</button></td>
      </tr>`).join('') : '<tr data-placeholder style="color:var(--text-muted);"><td colspan="4" style="text-align:center;padding:24px;font-size:12px;">暂无工装工具需求，点击上方按钮添加</td></tr>';

    // 物料/工具来源提示
    const matSourceHint = hasTL
      ? `已从任务清单 <strong>${esc(tl.PLNNR)}</strong> 带入 <strong>${matsToPreFill.length}</strong> 条物料`
      : (matsToPreFill.length > 0 ? '已从计划备件带入 <strong>'+matsToPreFill.length+'</strong> 条物料' : '暂无物料需求');
    const toolSourceHint = hasTL
      ? `已从任务清单 <strong>${esc(tl.PLNNR)}</strong> 带入 <strong>${toolsToPreFill.length}</strong> 件工装工具`
      : (toolsToPreFill.length > 0 ? '已带入 <strong>'+toolsToPreFill.length+'</strong> 件工装工具' : '暂无工装工具需求');

    const body = `
    <!-- 计划信息卡 -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:10px 14px;background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-radius:8px;border:1px solid #6ee7b7;">
      <div>
        <div style="font-size:14px;font-weight:700;color:#065f46;">🔧 从维护计划生成工单</div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">
          计划编号：<strong>${esc(plan.code)}</strong> | 版本：<strong>${esc(plan.version)}</strong> | ${esc(plan.maintenanceTypeName)} · ${planTypeDesc}
        </div>
      </div>
      <button class="btn btn-sm" style="background:white;color:#065f46;border:1px solid #6ee7b7;padding:4px 12px;font-size:11px;font-weight:600;border-radius:14px;" onclick="closeModal();MaintPreventive&&MaintPreventive.detail?MaintPreventive.detail('${plan.id}'):toast('请先打开预防性维护计划模块')">查看计划详情</button>
    </div>

    <!-- ====== 维护计划信息区（只读） ====== -->
    <div style="${secStyle}">📋 维护计划信息（自动带入，只读）</div>
    <div class="form-grid" style="margin-top:10px;margin-bottom:18px;">
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">计划描述</label>
        <input value="${esc(plan.name)}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">计划类型</label>
        <input value="${planTypeDesc}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">触发条件</label>
        <input value="${triggerDesc}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">设备</label>
        <input value="${esc(eqName)} (${esc(eqCode)})" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">功能位置</label>
        <input value="${esc(eqLocation)}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">上次维护</label>
        <input value="${lastMaint}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      ${plan.planType === 'counter' ? `
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">当前读数</label>
        <input value="${currentReadingInfo}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>` : ''}
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">关联任务清单</label>
        <input value="${hasTL ? esc(tl.PLNNR)+'（已发布版本'+esc(tl.PLNAL)+'）' : '未关联任务清单'}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
    </div>

    <!-- ====== 工单补充信息区 ====== -->
    <div style="${secStyle}">📝 工单补充信息（需确认/填写）</div>
    <div class="form-grid" style="margin-top:12px;margin-bottom:20px;">
      <div class="form-group">
        <label style="font-weight:600;">工单类型 <span style="color:var(--danger);">*</span></label>
        <select id="plWoType" onchange="MaintenanceWorkOrderV3._plOnTypeChange()" style="font-size:14px;font-weight:500;background:#f1f5f9;" disabled>${typeOpts}</select>
        <span style="font-size:11px;color:var(--text-muted);margin-top:3px;display:block;">从维护计划生成固定为 PM01（预防性），不可更改</span>
      </div>

      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">设备</label>
        <input value="${esc(eqName)} (${esc(eqCode)})" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
        <input type="hidden" id="plWoEq" value="${esc(eqCode)}">
        <span style="font-size:11px;color:var(--text-muted);">从维护计划自动带入，只读</span>
      </div>

      <div class="form-group full">
        <label style="font-weight:600;">工单描述 <span style="color:var(--danger);">*</span></label>
        <input id="plWoDesc" value="${autoDesc}" maxlength="100" placeholder="自动填充计划描述，可修改">
        <span style="font-size:11px;color:var(--text-muted);">自动填充：计划描述 + 设备名称，可手动修改</span>
      </div>

      <div class="form-group">
        <label style="font-weight:600;">主要工作中心 <span style="color:var(--danger);">*</span></label>
        <select id="plWoWC">${wcOpts}</select>
        <span style="font-size:11px;color:var(--text-muted);">${hasTL?'从关联任务清单抬头带出':(eq&&eq.team?'从设备主数据带出：'+esc(eq.team):'请选择工作中心')}</span>
      </div>

      <div class="form-group">
        <label style="font-weight:600;font-size:13px;">优先级</label>
        <select id="plWoPrio"><option value="1-高">1-高</option><option value="2-中" selected>2-中</option><option value="3-低">3-低</option></select>
        <span style="font-size:11px;color:var(--text-muted);">默认"中"，可根据实际调整</span>
      </div>

      <div class="form-group" style="display:flex;gap:10px;">
        <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
          <label style="font-weight:600;font-size:13px;">计划开始</label>
          <input type="date" id="plWoGstrp" value="${defaultGstrp}" style="padding:8px 10px;">
          <span style="font-size:10px;color:var(--text-muted);">${plan.planType==='time'?'到期日自动推算':'默认当前日期'}</span>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
          <label style="font-weight:600;font-size:13px;">计划完成</label>
          <input type="date" id="plWoGltrp" value="${defaultGltrp}" style="padding:8px 10px;">
          <span style="font-size:10px;color:var(--text-muted);">预估工期 ${plan.estimatedDuration||(plan.stdHours+'h')}</span>
        </div>
      </div>

      <div id="plWoSettleWrap" class="form-group" style="display:none;">
        <label style="font-weight:600;">结算对象 <span style="color:var(--danger);">*</span></label>
        <input id="plWoSettleObj" placeholder="内部订单号 / WBS元素" maxlength="30">
        <span style="font-size:11px;color:var(--text-muted);">PM03改造项目必须指定结算对象</span>
      </div>

      <input type="hidden" id="plHiddenId" value="${esc(plan.id)}">
      <input type="hidden" id="plHiddenEq" value="${esc(eqCode)}">
    </div>

    <!-- ====== 页签区域 ====== -->
    <div style="margin-top:4px;">
      <div class="tabs" style="margin-bottom:2px;">
        <div class="tab active" id="woTabBtn1" onclick="MaintenanceWorkOrderV3._woSwitchTab('1')">工序</div>
        <div class="tab" id="woTabBtn2" onclick="MaintenanceWorkOrderV3._woSwitchTab('2')">物料组件</div>
        <div class="tab" id="woTabBtn3" onclick="MaintenanceWorkOrderV3._woSwitchTab('3')">工具/工装</div>
        <div class="tab" id="woTabBtn4" onclick="MaintenanceWorkOrderV3._woSwitchTab('4')">安全措施</div>
        <div class="tab" id="woTabBtn5" onclick="MaintenanceWorkOrderV3._woSwitchTab('5')">附件</div>
      </div>

      <!-- 页签1：工序 -->
      <div class="tab-panel active" id="woTabPanel1" style="padding-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:12px;color:var(--text-secondary);">${hasTL?'已从任务清单带入 <strong>'+opsCount+'</strong> 道工序':'已从维护计划带入 <strong>'+opsCount+'</strong> 道工序'}，可自由增删改</span>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddOperationRow()">+ 添加工序</button>
          </div>
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <table class="data-table" style="font-size:12px;margin:0;" id="woOpsTable">
            <thead><tr>
              <th style="width:60px;">序号</th><th>工作描述 <span style="color:var(--danger);">*</span></th><th style="width:130px;">工作中心</th><th style="width:80px;">工时(h)</th><th style="width:50px;">操作</th>
            </tr></thead>
            <tbody id="woOpsBody">${opsRows}</tbody>
          </table>
        </div>
      </div>

      <!-- 页签2：物料组件 -->
      <div class="tab-panel" id="woTabPanel2" style="padding-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:12px;color:var(--text-secondary);">${matSourceHint}，可自由增删改</span>
          <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddMaterialRow()">+ 添加物料</button>
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <table class="data-table" style="font-size:12px;margin:0;">
            <thead><tr><th style="width:120px;">物料编码</th><th>物料名称</th><th style="width:80px;">需求数量</th><th style="width:60px;">单位</th><th style="width:50px;">操作</th></tr></thead>
            <tbody id="woMatBody">${matBodyHtml}</tbody>
          </table>
        </div>
      </div>

      <!-- 页签3：工具/工装 -->
      <div class="tab-panel" id="woTabPanel3" style="padding-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:12px;color:var(--text-secondary);">${toolSourceHint}，可自由增删改</span>
          <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddToolRow()">+ 添加工具</button>
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <table class="data-table" style="font-size:12px;margin:0;">
            <thead><tr><th style="width:120px;">工具编号</th><th>工具/工装名称</th><th style="width:80px;">数量</th><th style="width:50px;">操作</th></tr></thead>
            <tbody id="woToolBody">${toolBodyHtml}</tbody>
          </table>
        </div>
      </div>

      <!-- 页签4：安全措施 -->
      <div class="tab-panel" id="woTabPanel4" style="padding-top:12px;">
        <div class="form-group">
          <label style="font-weight:600;font-size:13px;">安全措施（选填）</label>
          <textarea id="plWoSafety" rows="5" placeholder="记录隔离、锁定、防护要求等&#10;（维护计划通常不含安全措施，请手动填写）" style="resize:vertical;min-height:100px;"></textarea>
        </div>
      </div>

      <!-- 页签5：附件 -->
      <div class="tab-panel" id="woTabPanel5" style="padding-top:12px;">
        <div style="border:2px dashed var(--border);border-radius:8px;padding:24px;text-align:center;cursor:pointer;transition:all .15s;"
          onclick="toast('附件上传功能将在后续版本实现')"
          onmouseenter="this.style.borderColor='var(--primary)';this.style.background='#f8fafc';"
          onmouseleave="this.style.borderColor='var(--border)';this.style.background='white';">
          <div style="font-size:32px;margin-bottom:6px;">📎</div>
          <div style="font-size:13px;color:var(--text-secondary);">点击上传附件</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">支持图片、文档（作业指导书、参考图纸等）</div>
        </div>
      </div>
    </div>`;

    showModal('🔧 从维护计划创建工单', body, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'保存为草稿',cls:'btn-secondary',style:'background:#f3f4f6;color:#374151;border:1px solid #d1d5db;',action:()=>{ MaintenanceWorkOrderV3._doCreateFromPlan('${plan.id}','draft'); }},
      {text:'保存',cls:'btn-primary',action:()=>{ MaintenanceWorkOrderV3._doCreateFromPlan('${plan.id}','full'); }}
    ], 'modal-xl');

    // 初始化PM03联动
    this._plOnTypeChange();
  },

  /* ----- _doCreateFromPlan：草稿/完整保存双模式 ----- */
  _doCreateFromPlan(planId, mode) {
    const plan = pmPlanData.find(p => p.id === planId);
    if (!plan) return;

    const eqCode = document.getElementById('plWoEq')?.value || document.getElementById('plHiddenEq')?.value;
    if (!eqCode) { toast('未获取到关联设备！'); return; }

    const auart = document.getElementById('plWoType')?.value || 'PM01';
    const desc = document.getElementById('plWoDesc')?.value?.trim() || (plan.name + ' - ' + (equipmentData.find(e => e.code === eqCode)?.name || ''));
    const wc = document.getElementById('plWoWC')?.value;
    const prio = document.getElementById('plWoPrio')?.value || '2-中';
    const gstrp = document.getElementById('plWoGstrp')?.value || '';
    const gltrp = document.getElementById('plWoGltrp')?.value || '';
    const settleObj = document.getElementById('plWoSettleObj')?.value?.trim() || '';
    const safety = document.getElementById('plWoSafety')?.value?.trim() || '';

    // 校验
    if (!auart) { toast('请确认工单类型！'); return; }

    if (mode === 'full') {
      if (!wc) { toast('请选择主要工作中心！'); return; }
      if (!desc) { toast('请填写工单描述！'); return; }
      if (auart === 'PM03' && !settleObj) { toast('PM03 改造/项目工单必须填写结算对象！'); return; }
      const ops = this._woCollectOperations();
      if (ops.length === 0) { toast('请至少保留一道工序！'); return; }
    }

    const eq = equipmentData.find(e => e.code === eqCode);
    const maxNum = workOrderV2Data.reduce((max, w) => Math.max(max, parseInt(w.AUFNR.replace('O', ''))), 0);
    const newAUFNR = 'O' + String(maxNum + 1).padStart(7, '0');
    const newId = 'WO' + String(workOrderV2Data.length + 1).padStart(5, '0');

    const auartMap = { PM01: 'PM01 - 预防性维护工单', PM02: 'PM02 - 维修工单', PM03: 'PM03 - 改造/项目工单' };
    const statTxt = mode === 'draft' ? '草稿' : '编辑中';
    const today = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()).padStart(2, '0');

    // 关联的任务清单号
    const tlNo = plan.associatedTaskList ? plan.associatedTaskList.PLNNR : '';

    // 创建工单
    workOrderV2Data.push({
      id: newId, AUFNR: newAUFNR, AUART: auart, AUART_TXT: auartMap[auart] || '',
      EQUNR: eqCode, EQKTX: eq ? eq.name : '', KURZTEXT: desc,
      PRIOK: prio, STAT: 'CRTE', STAT_TXT: statTxt,
      GSTRP: gstrp || today, GLTRP: gltrp || '',
      PERNR: eq ? (eq.leader || '当前用户') : '当前用户',
      sourceNo: '', taskListNo: tlNo,
      planSource: plan.code,   // 标记来源为维护计划
      faultPhenomenon: '', faultCause: '', solution: '',
      faultPhenomenonCode: '', faultCauseCode: '', faultSolutionCode: '',
      safetyMeasures: safety, acceptancePerson: '', acceptanceTime: '', acceptanceResult: '',
      createdBy: '当前用户', createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN'),
      settlementObject: settleObj
    });

    // 保存工序（从表单收集）
    const ops = this._woCollectOperations();
    if (ops.length > 0) {
      if (typeof operationV2Data === 'undefined') window.operationV2Data = [];
      ops.forEach(op => {
        operationV2Data.push({
          orderId: newId, VORNR: op.VORNR, LTXA1: op.LTXA1,
          ARBPL: op.ARBPL || wc, ARBEIT: op.ARBEIT, ISMNW: 0,
          status: 'pending', feedback: ''
        });
      });
    }

    // 保存物料（从表单收集）
    const mats = this._woCollectMaterials();
    if (mats.length > 0) {
      if (typeof materialComponentV2Data === 'undefined') window.materialComponentV2Data = [];
      mats.forEach(m => {
        materialComponentV2Data.push({
          orderId: newId, MATNR: m.MATNR, MATKTX: m.MATKTX,
          BDMNG: m.BDMNG, MEINS: m.MEINS, ENMNG: 0, remark: '来源计划: ' + plan.code
        });
      });
    }

    // 保存工具/工装（从表单收集）
    const tools = this._woCollectTools();
    if (tools.length > 0) {
      if (typeof toolComponentV2Data === 'undefined') window.toolComponentV2Data = [];
      tools.forEach(t => {
        toolComponentV2Data.push({
          orderId: newId, WRKCT: t.WRKCT, WRKTX: t.WRKTX,
          MGEIN: t.MGEIN, remark: '来源计划: ' + plan.code
        });
      });
    }

    const totalOps = operationV2Data.filter(o => o.orderId === newId).length;
    const totalMats = materialComponentV2Data.filter(m => m.orderId === newId).length;
    const totalTools = (typeof toolComponentV2Data !== 'undefined' ? toolComponentV2Data : []).filter(t => t.orderId === newId).length;

    const msg = mode === 'draft' ? '草稿已保存！' : '工单已生成！';
    toast(msg + ' 编号：' + newAUFNR + ' | 来源计划：' + plan.code + ' | 已带入 ' + totalOps + ' 道工序、' + totalMats + ' 条物料' + (totalTools > 0 ? '、' + totalTools + ' 件工具' : ''));
    closeModal();
    this.filtered = [...workOrderV2Data];
    this.renderTable();
  },

  /* ----- 维护计划引用辅助：工单类型联动（PM03结算对象） ----- */
  _plOnTypeChange() {
    const type = document.getElementById('plWoType')?.value;
    const settleWrap = document.getElementById('plWoSettleWrap');
    if (settleWrap) settleWrap.style.display = type === 'PM03' ? '' : 'none';
  },

  /* ====================================
     详情弹窗（多页签，与 v2 一致）
     ==================================== */
  detail(id) {
    const wo=workOrderV2Data.find(w=>w.id===id);
    if(!wo)return;
    this._detailId=id;
    this._detailTab='header';

    const eq=equipmentData.find(e=>e.code===wo.EQUNR);
    const ops=operationV2Data.filter(o=>o.orderId===id);
    const mats=materialComponentV2Data.filter(m=>m.orderId===id);
    const srcNotif=notificationV2Data.find(n=>n.QMNUM===wo.sourceNo);
    const srcTL = wo.taskListNo ? ((typeof taskListMockData !== 'undefined' ? taskListMockData : []).find(t=>t.PLNNR===wo.taskListNo)) : null;

    const body=this._buildDetailBody(wo,eq,ops,mats,srcNotif,srcTL);
    showModal('工单 '+esc(wo.AUFNR)+' - '+esc(wo.KURZTEXT), body, [
      {text:'关闭',cls:'btn-secondary',action:closeModal},
      {text:'保存',cls:'btn-primary',action:()=>{MaintenanceWorkOrderV3._saveDetail(wo.id);closeModal();}}
    ], 'modal-xl');
  },

  _buildDetailBody(wo,eq,ops,mats,srcNotif,srcTL) {
    const statColor={CRTE:'var(--warning)',APPR:'#f97316',REL:'var(--primary-lighter)',EXEC:'#7c3aed',COMP:'var(--success)',CLSD:'var(--text-muted)'};
    const statSteps=['CRTE','APPR','REL','EXEC','COMP','CLSD'];
    const stepLabels={CRTE:'编辑中',APPR:'待审批',REL:'已审批',EXEC:'执行中',COMP:'已完工',CLSD:'已关闭'};
    const currentStep=statSteps.indexOf(wo.STAT);

    let sourceInfo = '手动创建';
    if (srcTL) sourceInfo = '📑 任务清单: '+esc(srcTL.PLNNR)+' — '+esc(srcTL.PLTXT);
    else if (srcNotif) sourceInfo = '📋 通知单: '+esc(srcNotif.QMNUM);

    return `
    <div style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div>
          <div style="font-size:18px;font-weight:700;">工单 ${esc(wo.AUFNR)}</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">${esc(wo.EQUNR)} ${esc(wo.EQKTX)} | 来源：${sourceInfo}</div>
        </div>
        <div>
          <span class="badge" style="background:${statColor[wo.STAT]||'#6b7280'};color:white;font-size:13px;padding:4px 12px;">${esc(wo.STAT_TXT)}</span>
        </div>
      </div>
      <div style="display:flex;gap:4px;align-items:center;margin-top:8px;">
        ${statSteps.map((s,i)=>`
          <div style="flex:1;text-align:center;position:relative;">
            <div style="width:24px;height:24px;border-radius:50%;margin:0 auto 4px;background:${i<=currentStep?statColor[wo.STAT]:'#e5e7eb'};color:${i<=currentStep?'white':'#9ca3af'};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;">${i<=currentStep?'✓':i+1}</div>
            <div style="font-size:10px;color:${i<=currentStep?'var(--text)':'var(--text-muted)'};">${stepLabels[s]}</div>
            ${i<statSteps.length-1?`<div style="position:absolute;top:10px;left:60%;width:80%;height:2px;background:${i<currentStep?statColor[wo.STAT]:'#e5e7eb'};"></div>`:''}
          </div>
        `).join('')}
      </div>
    </div>

    <div class="tabs" style="margin-bottom:16px;border-bottom:2px solid var(--border);">
      <div class="tab ${this._detailTab==='header'?'active':''}" onclick="MaintenanceWorkOrderV3._switchTab(event,'header')">抬头数据</div>
      <div class="tab ${this._detailTab==='operations'?'active':''}" onclick="MaintenanceWorkOrderV3._switchTab(event,'operations')">工序 (${ops.length})</div>
      <div class="tab ${this._detailTab==='materials'?'active':''}" onclick="MaintenanceWorkOrderV3._switchTab(event,'materials')">物料组件 (${mats.length})</div>
      <div class="tab ${this._detailTab==='safety'?'active':''}" onclick="MaintenanceWorkOrderV3._switchTab(event,'safety')">安全措施</div>
      <div class="tab ${this._detailTab==='feedback'?'active':''}" onclick="MaintenanceWorkOrderV3._switchTab(event,'feedback')">执行反馈与关闭</div>
    </div>

    <div id="wo3DetailTabContent" style="max-height:50vh;overflow-y:auto;padding:4px 0;">
      ${this._buildTabContent(wo,eq,ops,mats,srcNotif,srcTL)}
    </div>`;
  },

  _switchTab(event,name) {
    this._detailTab=name;
    const wo=workOrderV2Data.find(w=>w.id===this._detailId);
    if(!wo)return;
    const eq=equipmentData.find(e=>e.code===wo.EQUNR);
    const ops=operationV2Data.filter(o=>o.orderId===this._detailId);
    const mats=materialComponentV2Data.filter(m=>m.orderId===this._detailId);
    const srcNotif=notificationV2Data.find(n=>n.QMNUM===wo.sourceNo);
    const srcTL = wo.taskListNo ? ((typeof taskListMockData !== 'undefined' ? taskListMockData : []).find(t=>t.PLNNR===wo.taskListNo)) : null;

    const modal=event.target.closest('.modal');
    if(modal){
      modal.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      event.target.classList.add('active');
    }
    const container=document.getElementById('wo3DetailTabContent');
    if(container)container.innerHTML=this._buildTabContent(wo,eq,ops,mats,srcNotif,srcTL);
  },

  _buildTabContent(wo,eq,ops,mats,srcNotif,srcTL) {
    switch(this._detailTab) {
      case 'header': return this._buildHeaderTab(wo,eq,srcNotif,srcTL);
      case 'operations': return this._buildOperationsTab(wo,ops);
      case 'materials': return this._buildMaterialsTab(wo,mats);
      case 'safety': return this._buildSafetyTab(wo);
      case 'feedback': return this._buildFeedbackTab(wo,ops);
      default: return '';
    }
  },

  _buildHeaderTab(wo,eq,srcNotif,srcTL) {
    let sourceLine='-';
    if(srcTL)sourceLine='📑 任务清单: '+esc(srcTL.PLNNR)+' — '+esc(srcTL.PLTXT);
    else if(srcNotif)sourceLine='📋 通知单: '+esc(srcNotif.QMNUM);
    else sourceLine='✍️ 手工创建';

    // Build fault chain display
    const hasFaultChain = wo.faultPhenomenonCode || wo.faultCauseCode || wo.faultSolutionCode;
    let faultChainHtml = '';
    if (hasFaultChain) {
      faultChainHtml = `
      <div style="grid-column:1/-1;background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:8px;padding:14px;">
        <div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--primary-lighter);">🔍 故障分析链</div>
        <div style="display:flex;align-items:center;gap:8px;font-size:12px;">
          <span style="padding:4px 10px;background:#fee2e2;border-radius:4px;color:#dc2626;">${wo.faultPhenomenonCode ? esc(getCatalogFullName('A', wo.faultPhenomenonCode)) : '—'}</span>
          <span style="color:var(--text-muted);">→</span>
          <span style="padding:4px 10px;background:#fef3c7;border-radius:4px;color:#d97706;">${wo.faultCauseCode ? esc(getCatalogFullName('B', wo.faultCauseCode)) : '—'}</span>
          <span style="color:var(--text-muted);">→</span>
          <span style="padding:4px 10px;background:#dcfce7;border-radius:4px;color:#059669;">${wo.faultSolutionCode ? esc(getCatalogFullName('C', wo.faultSolutionCode)) : '—'}</span>
        </div>
      </div>`;
    } else if (srcNotif && srcNotif.faultPhenomenonCode) {
      faultChainHtml = `
      <div style="grid-column:1/-1;background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:8px;padding:14px;">
        <div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--primary-lighter);">🔍 故障分析链（来自通知单）</div>
        <div style="display:flex;align-items:center;gap:8px;font-size:12px;">
          <span style="padding:4px 10px;background:#fee2e2;border-radius:4px;color:#dc2626;">${esc(getCatalogFullName('A', srcNotif.faultPhenomenonCode))}</span>
          <span style="color:var(--text-muted);">→</span>
          <span style="padding:4px 10px;background:#fef3c7;border-radius:4px;color:#d97706;">${srcNotif.faultCauseCode ? esc(getCatalogFullName('B', srcNotif.faultCauseCode)) : '待补充'}</span>
          <span style="color:var(--text-muted);">→</span>
          <span style="padding:4px 10px;background:#dcfce7;border-radius:4px;color:#059669;">${srcNotif.faultSolutionCode ? esc(getCatalogFullName('C', srcNotif.faultSolutionCode)) : '待补充'}</span>
        </div>
      </div>`;
    }

    return `<div class="detail-grid" style="margin-bottom:16px;">
      <div class="detail-item"><dt>工单类型</dt><dd>${MaintenanceWorkOrderV3._typeBadge(wo.AUART)}</dd></div>
      <div class="detail-item"><dt>设备编码</dt><dd>${esc(wo.EQUNR)}</dd></div>
      <div class="detail-item"><dt>设备名称</dt><dd>${esc(wo.EQKTX)}</dd></div>
      <div class="detail-item"><dt>功能位置</dt><dd>${eq?esc(eq.locationName):'-'}</dd></div>
      <div class="detail-item"><dt>优先级</dt><dd>${esc(wo.PRIOK)}</dd></div>
      <div class="detail-item"><dt>计划开始</dt><dd>${esc(wo.GSTRP)}</dd></div>
      <div class="detail-item"><dt>计划完成</dt><dd>${esc(wo.GLTRP)}</dd></div>
      <div class="detail-item"><dt>负责人</dt><dd>${esc(wo.PERNR)}</dd></div>
      <div class="detail-item"><dt>创建方式</dt><dd>${sourceLine}</dd></div>
      <div class="detail-item" style="grid-column:1/-1;"><dt>工单描述</dt><dd style="white-space:pre-wrap;">${esc(wo.KURZTEXT)}</dd></div>
      ${faultChainHtml}
      <div style="grid-column:1/-1;padding:12px 0;border-top:1px solid var(--border);margin-top:4px;">
        <div style="font-weight:600;font-size:13px;margin-bottom:8px;">状态变更</div>
        <div style="display:flex;gap:6px;">
          ${wo.STAT==='CRTE'?`<button class="btn btn-warning btn-sm" style="background:#f97316;color:white;border:none;" onclick="MaintenanceWorkOrderV3.changeStatus('${wo.id}','APPR');MaintenanceWorkOrderV3._refreshDetail();">提交审批 → APPR</button>`:''}
          ${wo.STAT==='APPR'?`<button class="btn btn-success btn-sm" onclick="MaintenanceWorkOrderV3.changeStatus('${wo.id}','REL');MaintenanceWorkOrderV3._refreshDetail();">审批通过 → REL</button><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;" onclick="MaintenanceWorkOrderV3.changeStatus('${wo.id}','CRTE');MaintenanceWorkOrderV3._refreshDetail();">审批退回 → CRTE</button>`:''}
          ${wo.STAT==='REL'?`<button class="btn btn-warning btn-sm" style="background:var(--warning);color:white;border:none;" onclick="MaintenanceWorkOrderV3.changeStatus('${wo.id}','EXEC');MaintenanceWorkOrderV3._refreshDetail();">开始执行 → EXEC</button>`:''}
          ${wo.STAT==='EXEC'?`<button class="btn btn-sm" style="background:#059669;color:white;border:none;" onclick="MaintenanceWorkOrderV3.changeStatus('${wo.id}','COMP');MaintenanceWorkOrderV3._refreshDetail();">完工验收 → COMP</button>`:''}
          ${wo.STAT==='COMP'?`<button class="btn btn-blue btn-sm" onclick="MaintenanceWorkOrderV3.changeStatus('${wo.id}','CLSD');MaintenanceWorkOrderV3._refreshDetail();">关闭归档 → CLSD</button>`:''}
        </div>
      </div>
    </div>`;
  },

  _buildOperationsTab(wo,ops) {
    const isEditable=wo.STAT==='CRTE'||wo.STAT==='REL';
    if(ops.length===0) {
      return `<div style="text-align:center;padding:40px;color:var(--text-muted);">
        <div style="font-size:36px;margin-bottom:8px;">🛠️</div><div style="font-size:13px;margin-bottom:12px;">暂无工序</div>
        ${isEditable?`<button class="btn btn-blue btn-sm" onclick="MaintenanceWorkOrderV3._addOperation('${wo.id}')">+ 添加工序</button>`:''}
      </div>`;
    }
    let html=`<div style="overflow-x:auto;"><table class="data-table" style="font-size:13px;">
      <thead><tr><th style="width:50px;">工序号</th><th>描述</th><th>工作中心</th><th>计划工时(h)</th><th>实际工时(h)</th><th>状态</th>${isEditable?`<th style="width:60px;">操作</th>`:''}</tr></thead><tbody>`;
    ops.forEach((o,idx)=>{
      const statusBadge=o.status==='completed'?'<span class="badge badge-green">✓ 完成</span>':
        o.status==='in_progress'?'<span class="badge badge-blue">▶ 进行中</span>':
        '<span class="badge badge-gray">○ 待执行</span>';
      html+=`<tr>
        <td style="text-align:center;">${esc(o.VORNR)}</td><td>${esc(o.LTXA1)}</td><td>${esc(o.ARBPL)}</td>
        <td>${esc(o.ARBEIT)}</td><td>${esc(o.ISMNW||'-')}</td><td>${statusBadge}</td>
        ${isEditable?`<td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:2px 6px;font-size:11px;cursor:pointer;" onclick="MaintenanceWorkOrderV3._removeOperation('${wo.id}',${idx})">删除</button></td>`:''}
      </tr>`;
    });
    html+=`</tbody></table></div>`;
    // 常见工序库
    html+=`<div style="margin-top:16px;padding:14px;background:#f0f9ff;border-radius:8px;border:1px solid #bae6fd;">
      <div style="font-weight:600;font-size:13px;color:var(--primary-lighter);margin-bottom:10px;">💡 常见工序库（点击快速引用）</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        ${commonOperationLibrary.map(cl=>`
          <button onclick="MaintenanceWorkOrderV3._useCommonOps('${wo.id}','${cl.keyword}')" style="padding:5px 12px;border:1px solid #93c5fd;background:white;border-radius:20px;cursor:pointer;font-size:12px;transition:all .15s;"
            onmouseenter="this.style.background='#eff6ff';this.style.borderColor='#3b82f6';"
            onmouseleave="this.style.background='white';this.style.borderColor='#93c5fd';">
            ${esc(cl.description)}</button>
        `).join('')}
      </div></div>`;
    if(isEditable){
      html+=`<div style="text-align:center;margin-top:12px;"><button class="btn btn-blue btn-sm" onclick="MaintenanceWorkOrderV3._addOperation('${wo.id}')">+ 添加工序</button></div>`;
    }
    return html;
  },

  _buildMaterialsTab(wo,mats) {
    const isEditable=wo.STAT==='CRTE'||wo.STAT==='REL';
    if(mats.length===0){
      return `<div style="text-align:center;padding:40px;color:var(--text-muted);">
        <div style="font-size:36px;margin-bottom:8px;">📦</div><div style="font-size:13px;margin-bottom:12px;">暂无物料组件</div>
        ${isEditable?`<button class="btn btn-blue btn-sm" onclick="MaintenanceWorkOrderV3._addMaterial('${wo.id}')">+ 添加物料</button>`:''}
      </div>`;
    }
    let html=`<table class="data-table" style="font-size:13px;">
      <thead><tr><th>物料编码</th><th>名称</th><th>需求数量</th><th>单位</th><th>实际领用</th><th>备注</th>${isEditable?'<th style="width:60px;">操作</th>':''}</tr></thead><tbody>`;
    mats.forEach((m,idx)=>{
      html+=`<tr>
        <td><strong>${esc(m.MATNR)}</strong></td><td>${esc(m.MATKTX)}</td><td>${esc(m.BDMNG)}</td>
        <td>${esc(m.MEINS)}</td><td>${esc(m.ENMNG||'-')}</td><td>${esc(m.remark||'')}</td>
        ${isEditable?`<td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:2px 6px;font-size:11px;cursor:pointer;" onclick="MaintenanceWorkOrderV3._removeMaterial('${wo.id}',${idx})">删除</button></td>`:''}
      </tr>`;
    });
    html+=`</tbody></table>`;
    if(isEditable) html+=`<div style="text-align:center;margin-top:12px;"><button class="btn btn-blue btn-sm" onclick="MaintenanceWorkOrderV3._addMaterial('${wo.id}')">+ 添加物料</button></div>`;
    return html;
  },

  _buildSafetyTab(wo) {
    const isEditable=wo.STAT!=='CLSD';
    return `<div style="padding:8px 0;">
      <div style="font-weight:600;font-size:14px;margin-bottom:12px;color:var(--danger);">⚠ 安全措施</div>
      <textarea id="wo3SafetyMeasures" rows="6" placeholder="记录隔离、锁定、挂牌、危险警示、个人防护装备(PPE)等信息..."
        style="width:100%;padding:12px;border:1px solid var(--border);border-radius:8px;font-size:13px;line-height:1.6;resize:vertical;" ${isEditable?'':'readonly'}>${esc(wo.safetyMeasures||'')}</textarea>
      ${isEditable?`<button class="btn btn-primary btn-sm" style="margin-top:10px;" onclick="MaintenanceWorkOrderV3._saveSafety('${wo.id}')">保存安全措施</button>`:''}
      <div style="margin-top:14px;padding:12px;background:#fffbeb;border-radius:8px;border:1px solid #fde68a;">
        <div style="font-weight:600;font-size:13px;color:#d97706;margin-bottom:4px;">安全提示</div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
          ✓ 作业前必须执行LOTO（上锁挂牌）<br>✓ 确认能源隔离完成后方可作业<br>✓ 涉及密闭空间的需进行气体检测<br>✓ 高处作业佩戴安全带
        </div></div></div>`;
  },

  _buildFeedbackTab(wo,ops) {
    const isExecutable=wo.STAT==='EXEC'||wo.STAT==='COMP';
    return `<div style="padding:8px 0;">
      <div style="font-weight:600;font-size:14px;margin-bottom:10px;">工序反馈</div>
      <div style="max-height:200px;overflow-y:auto;margin-bottom:16px;">
        ${ops.map((o,idx)=>{
          const opIdx=operationV2Data.indexOf(o);
          return `<div style="display:flex;align-items:center;padding:8px 12px;background:${o.status==='completed'?'#f0fdf4':'#f8fafc'};border-radius:6px;margin-bottom:6px;gap:10px;border:1px solid ${o.status==='completed'?'#bbf7d0':'var(--border)'};">
            <input type="checkbox" ${o.status==='completed'?'checked':''} ${isExecutable?'':'disabled'} onchange="MaintenanceWorkOrderV3._toggleOpStatus(${opIdx},this.checked)">
            <div style="flex:1;font-size:13px;"><strong>${esc(o.VORNR)}</strong> ${esc(o.LTXA1)}</div>
            <input placeholder="实际工时(h)" value="${esc(o.ISMNW||'')}" style="width:90px;padding:4px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;" ${isExecutable?'':'readonly'} onchange="MaintenanceWorkOrderV3._updateOpHours(${opIdx},this.value)">
            <input placeholder="备注" value="${esc(o.feedback||'')}" style="width:160px;padding:4px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;" ${isExecutable?'':'readonly'} onchange="MaintenanceWorkOrderV3._updateOpFeedback(${opIdx},this.value)">
          </div>`;
        }).join('')}
      </div>
      <div style="font-weight:600;font-size:14px;margin-bottom:10px;">故障信息</div>
      <div style="padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:16px;border:1px solid var(--border);">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div class="form-group">
            <label style="font-weight:600;">故障现象（目录A · 通知单已记录）</label>
            <input value="${esc(wo.faultPhenomenonCode ? getCatalogFullName('A', wo.faultPhenomenonCode) : wo.faultPhenomenon||'')}" readonly style="background:#f0fdf4;border-color:#bbf7d0;color:#166534;width:100%;padding:6px 8px;border-radius:4px;font-size:12px;">
          </div>
          <div class="form-group">
            <label style="font-weight:600;">故障原因（目录B）<span class="req">*</span></label>
            ${isExecutable ? `<select id="wo3FaultCauseCode" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;">${buildCatalogOptions('B', true, wo.faultCauseCode)}</select><textarea id="wo3FaultCause" rows="1" placeholder="或手动补充原因..." style="width:100%;margin-top:6px;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;">${esc(wo.faultCause||'')}</textarea>`
              : `<input value="${esc(wo.faultCauseCode ? getCatalogFullName('B', wo.faultCauseCode) : wo.faultCause||'')}" readonly style="width:100%;padding:6px 8px;border-radius:4px;font-size:12px;background:var(--bg);">`}
          </div>
        </div>
        <div class="form-group full" style="margin-top:10px;">
          <label style="font-weight:600;">解决措施（目录C）<span class="req">*</span></label>
          ${isExecutable ? `<select id="wo3FaultSolutionCode" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;">${buildCatalogOptions('C', true, wo.faultSolutionCode)}</select><textarea id="wo3Solution" rows="2" placeholder="或手动补充措施..." style="width:100%;margin-top:6px;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;">${esc(wo.solution||'')}</textarea>`
            : `<textarea id="wo3Solution" rows="2" readonly style="width:100%;padding:6px 8px;background:var(--bg);border-radius:4px;font-size:12px;">${esc(wo.faultSolutionCode ? getCatalogFullName('C', wo.faultSolutionCode) : wo.solution||'')}</textarea>`}
        </div>
      </div>
      <div style="font-weight:600;font-size:14px;margin-bottom:10px;">验收信息</div>
      <div class="detail-grid" style="margin-bottom:16px;">
        <div class="form-group"><label>验收人</label><input id="wo3Acceptor" value="${esc(wo.acceptancePerson||'')}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;" ${wo.STAT==='EXEC'?'':'readonly'}></div>
        <div class="form-group"><label>验收时间</label><input type="datetime-local" id="wo3AcceptTime" value="${esc(wo.acceptanceTime||'')}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;" ${wo.STAT==='EXEC'?'':'readonly'}></div>
        <div class="form-group full"><label>验收结论</label><textarea id="wo3AcceptResult" rows="2" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;" ${wo.STAT==='EXEC'?'':'readonly'}>${esc(wo.acceptanceResult||'')}</textarea></div>
      </div>
      ${isExecutable?`<button class="btn btn-primary btn-sm" onclick="MaintenanceWorkOrderV3._saveFeedback('${wo.id}')">保存反馈</button>`:''}
      <div style="margin-top:12px;font-size:12px;color:var(--text-muted);">创建人：${esc(wo.createdBy)} | 创建：${esc(wo.createdAt)} | 更新：${esc(wo.updatedAt)}</div></div>`;
  },

  /* ========== 辅助方法 ========== */
  _addOperation(orderId) {
    const maxVornr=operationV2Data.filter(o=>o.orderId===orderId).reduce((max,o)=>Math.max(max,parseInt(o.VORNR)),0);
    const newVornr=String(maxVornr+10).padStart(4,'0');
    operationV2Data.push({orderId,VORNR:newVornr,LTXA1:'新工序',ARBPL:'维修一班',ARBEIT:1,ISMNW:'',status:'pending',feedback:''});
    toast('工序已添加'); this._refreshDetail();
  },
  _removeOperation(orderId,idx){
    const ops=operationV2Data.filter(o=>o.orderId===orderId);
    if(idx>=0&&idx<ops.length){const di=operationV2Data.indexOf(ops[idx]);if(di>=0)operationV2Data.splice(di,1);}
    toast('工序已删除'); this._refreshDetail();
  },
  _useCommonOps(orderId,keyword){
    const lib=commonOperationLibrary.find(cl=>cl.keyword===keyword);if(!lib)return;
    const existing=operationV2Data.filter(o=>o.orderId===orderId);
    const startVornr=existing.reduce((max,o)=>Math.max(max,parseInt(o.VORNR)),0);
    lib.ops.forEach((op,idx)=>{operationV2Data.push({orderId,VORNR:String(startVornr+(idx+1)*10).padStart(4,'0'),LTXA1:op,ARBPL:'维修一班',ARBEIT:1,ISMNW:'',status:'pending',feedback:''});});
    toast('已引用「'+lib.description+'」的 '+lib.ops.length+' 道工序'); this._refreshDetail();
  },

  _addMaterial(orderId) {
    showModal('添加物料', `
      <div class="form-grid">
        <div class="form-group"><label>物料编码<span class="req">*</span></label><input id="mat3MATNR" placeholder="如 MAT-SEAL-001"></div>
        <div class="form-group"><label>物料名称<span class="req">*</span></label><input id="mat3MATKTX" placeholder="物料名称"></div>
        <div class="form-group"><label>需求数量</label><input type="number" id="mat3BDMNG" value="1" min="1"></div>
        <div class="form-group"><label>单位</label><input id="mat3MEINS" value="个"></div>
        <div class="form-group full"><label>备注</label><input id="mat3Remark" placeholder="选填"></div>
      </div>`, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'添加',cls:'btn-primary',action:()=>{
        const MATNR=document.getElementById('mat3MATNR').value.trim();
        const MATKTX=document.getElementById('mat3MATKTX').value.trim();
        if(!MATNR||!MATKTX){toast('请完善物料编码和名称！');return;}
        materialComponentV2Data.push({orderId,MATNR,MATKTX,BDMNG:parseFloat(document.getElementById('mat3BDMNG').value)||1,MEINS:document.getElementById('mat3MEINS').value||'个',ENMNG:'',remark:document.getElementById('mat3Remark').value});
        toast('物料已添加'); closeModal(); this._refreshDetail();
      }}]);
  },
  _removeMaterial(orderId,idx){
    const mats=materialComponentV2Data.filter(m=>m.orderId===orderId);
    if(idx>=0&&idx<mats.length){const di=materialComponentV2Data.indexOf(mats[idx]);if(di>=0)materialComponentV2Data.splice(di,1);}
    toast('物料已删除'); this._refreshDetail();
  },

  _toggleOpStatus(opIdx,checked){if(opIdx>=0&&opIdx<operationV2Data.length){operationV2Data[opIdx].status=checked?'completed':'pending';this._refreshDetail();}},
  _updateOpHours(opIdx,value){if(opIdx>=0&&opIdx<operationV2Data.length)operationV2Data[opIdx].ISMNW=value||'';},
  _updateOpFeedback(opIdx,value){if(opIdx>=0&&opIdx<operationV2Data.length)operationV2Data[opIdx].feedback=value||'';},

  _saveSafety(orderId){
    const wo=workOrderV2Data.find(w=>w.id===orderId);if(!wo)return;
    wo.safetyMeasures=document.getElementById('wo3SafetyMeasures').value;
    wo.updatedAt=new Date().toLocaleString('zh-CN'); toast('安全措施已保存！');
  },
  _saveFeedback(orderId){
    const wo=workOrderV2Data.find(w=>w.id===orderId);if(!wo)return;
    const cauCode=document.getElementById('wo3FaultCauseCode');if(cauCode)wo.faultCauseCode=cauCode.value;
    const solCode=document.getElementById('wo3FaultSolutionCode');if(solCode)wo.faultSolutionCode=solCode.value;
    const cau=document.getElementById('wo3FaultCause');if(cau)wo.faultCause=cau.value;
    const sol=document.getElementById('wo3Solution');if(sol)wo.solution=sol.value;
    const acc=document.getElementById('wo3Acceptor');if(acc)wo.acceptancePerson=acc.value;
    const ati=document.getElementById('wo3AcceptTime');if(ati)wo.acceptanceTime=ati.value;
    const ars=document.getElementById('wo3AcceptResult');if(ars)wo.acceptanceResult=ars.value;
    wo.updatedAt=new Date().toLocaleString('zh-CN'); toast('反馈已保存！');
    // Write-back to linked notification if applicable
    if (wo.sourceNo) {
      const n = notificationV2Data.find(x => x.QMNUM === wo.sourceNo);
      if (n) {
        if (wo.faultCauseCode) n.faultCauseCode = wo.faultCauseCode;
        if (wo.faultSolutionCode) n.faultSolutionCode = wo.faultSolutionCode;
        if (wo.faultCause) n.faultCause = wo.faultCause;
        if (wo.solution) n.faultSolution = wo.solution;
      }
    }
  },

  changeStatus(orderId,newStatus) {
    const wo=workOrderV2Data.find(w=>w.id===orderId);if(!wo)return;
    const statusMap={CRTE:{STAT_TXT:'编辑中',color:'var(--warning)'},APPR:{STAT_TXT:'待审批',color:'#f97316'},REL:{STAT_TXT:'已审批/待执行',color:'var(--primary-lighter)'},EXEC:{STAT_TXT:'执行中',color:'#7c3aed'},COMP:{STAT_TXT:'已完工',color:'var(--success)'},CLSD:{STAT_TXT:'已关闭',color:'var(--text-muted)'}};
    const confirmText=wo.STAT==='CRTE'&&newStatus==='APPR'?'确认提交线下审批？工单将变为待审批状态。':
      wo.STAT==='APPR'&&newStatus==='REL'?'确认线下审批已通过？工单将进入待执行状态。':
      wo.STAT==='APPR'&&newStatus==='CRTE'?'确认退回？工单将回到编辑中状态。':
      wo.STAT==='REL'&&newStatus==='EXEC'?'确认开始执行？':wo.STAT==='EXEC'&&newStatus==='COMP'?'确认维修已完工？':
      wo.STAT==='COMP'&&newStatus==='CLSD'?'确认关闭归档？关闭后不可更改。':'确认变更状态？';
    if(!confirm(confirmText))return;
    wo.STAT=newStatus;wo.STAT_TXT=statusMap[newStatus].STAT_TXT;wo.updatedAt=new Date().toLocaleString('zh-CN');

    // Write-back: when COMP or CLSD, push fault cause/solution codes to linked notification
    if ((newStatus === 'COMP' || newStatus === 'CLSD') && wo.sourceNo) {
      const n = notificationV2Data.find(x => x.QMNUM === wo.sourceNo);
      if (n) {
        if (wo.faultCauseCode) n.faultCauseCode = wo.faultCauseCode;
        if (wo.faultSolutionCode) n.faultSolutionCode = wo.faultSolutionCode;
        if (wo.faultCause) n.faultCause = wo.faultCause;
        if (wo.solution) n.faultSolution = wo.solution;
        n.updatedAt = new Date().toLocaleString('zh-CN');
      }
    }

    toast('工单状态已变更为：'+wo.STAT_TXT);
    const tbody=document.getElementById('wo3TableBody');if(tbody)this.renderTable();
  },

  _saveDetail(id){
    const wo=workOrderV2Data.find(w=>w.id===id);if(!wo)return;
    this._saveFeedback(id);
    const safetyEl=document.getElementById('wo3SafetyMeasures');if(safetyEl)wo.safetyMeasures=safetyEl.value;
    toast('工单已保存！');
  },
  _refreshDetail(){
    const wo=workOrderV2Data.find(w=>w.id===this._detailId);if(!wo)return;
    const eq=equipmentData.find(e=>e.code===wo.EQUNR);
    const ops=operationV2Data.filter(o=>o.orderId===this._detailId);
    const mats=materialComponentV2Data.filter(m=>m.orderId===this._detailId);
    const srcNotif=notificationV2Data.find(n=>n.QMNUM===wo.sourceNo);
    const srcTL=wo.taskListNo?((typeof taskListMockData!=='undefined'?taskListMockData:[]).find(t=>t.PLNNR===wo.taskListNo)):null;
    const modalBody=document.querySelector('.modal-backdrop:not(.hidden) .modal-body');
    if(modalBody)modalBody.innerHTML=this._buildDetailBody(wo,eq,ops,mats,srcNotif,srcTL);
  }
};
