// ===== 2.2 通知单管理 V3 — 两种创建方式可视化入口 =====
// 改进：点击"新建通知单"弹出选择面板，明确展示人工录入 / 状态监测报警两种方式
const MaintenanceNotificationV3 = {
  page:1, pageSize:10, filtered:[],
  _searchQmnum:'', _searchEqunr:'', _searchQmart:'', _searchStat:'', _searchPriok:'',

  _typeBadge(t) {
    if (t === 'M1') return '<span class="badge badge-sm" style="background:#fee2e2;color:#dc2626;">M1-故障报告</span>';
    if (t === 'M2') return '<span class="badge badge-sm" style="background:#dbeafe;color:#2563eb;">M2-维护请求</span>';
    return '<span class="badge badge-sm">'+esc(t)+'</span>';
  },

  /* ========== Render ========== */
  render() {
    return `
    <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <!-- 顶部标题栏 -->
      <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div>
          <div style="font-size:18px;font-weight:700;">通知单管理</div>
          <div style="font-size:13px;opacity:0.8;margin-top:2px;">来源：人工录入 / 状态监测报警自动生成</div>
        </div>
        <button class="btn btn-blue" style="padding:10px 20px;font-size:14px;font-weight:600;border-radius:8px;"
          onclick="MaintenanceNotificationV3.showCreatePicker()">+ 新建通知单</button>
      </div>

      <!-- 筛选栏 -->
      <div class="filter-bar" style="flex-shrink:0;">
        <div class="filter-group"><label>通知单号</label><input type="text" id="nfV3QMNUM" placeholder="如 N0000001" value="${esc(this._searchQmnum)}"></div>
        <div class="filter-group"><label>设备编码</label><input type="text" id="nfV3EQUNR" placeholder="模糊查询" value="${esc(this._searchEqunr)}"></div>
        <div class="filter-group"><label>类型</label><select id="nfV3QMART">${notificationV2TypeOpts.map(o=>`<option value="${o.value}" ${this._searchQmart===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>状态</label><select id="nfV3STAT">${notificationV2StatusOpts.map(o=>`<option value="${o.value}" ${this._searchStat===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>优先级</label><select id="nfV3PRIOK">${notificationV2PriorityOpts.map(o=>`<option value="${o.value}" ${this._searchPriok===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="MaintenanceNotificationV3.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="MaintenanceNotificationV3.reset()">重置</button>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrapper" style="flex:1;">
        <table class="data-table">
          <thead><tr><th>通知单号</th><th>类型</th><th>设备编码</th><th>设备名称</th><th>故障描述</th><th>来源</th><th>优先级</th><th>状态</th><th>发现时间</th><th>操作</th></tr></thead>
          <tbody id="nfV3TableBody"></tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="list-toolbar" style="flex-shrink:0;">
        <div class="list-info"><span class="list-count" id="nfV3Count">共 0 条</span></div>
        <div class="pagination">
          <button class="pagination-btn" id="nfV3Prev" disabled onclick="MaintenanceNotificationV3.prevPage()">‹</button>
          <span class="pagination-info" id="nfV3PageInfo">第 1 / 1 页</span>
          <button class="pagination-btn" id="nfV3Next" onclick="MaintenanceNotificationV3.nextPage()">›</button>
          <select class="page-size-select" id="nfV3PageSize" onchange="MaintenanceNotificationV3.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
        </div>
      </div>
    </div>`;
  },

  init() { this.filtered=[...notificationV2Data]; this.page=1; this.renderTable(); },

  /* ========== 表格渲染 ========== */
  renderTable() {
    const start=(this.page-1)*this.pageSize;
    const page=this.filtered.slice(start,start+this.pageSize);
    const totalPages=Math.ceil(this.filtered.length/this.pageSize)||1;
    document.getElementById('nfV3Count').textContent=`共 ${this.filtered.length} 条`;
    document.getElementById('nfV3PageInfo').textContent=`第 ${this.page} / ${totalPages} 页`;
    document.getElementById('nfV3Prev').disabled=this.page<=1;
    document.getElementById('nfV3Next').disabled=this.page>=totalPages;
    document.getElementById('nfV3PageSize').value=this.pageSize;

    const statusBadge=s=>{
      if(s==='CRTE') return '<span class="badge badge-yellow">CRTE-待处理</span>';
      if(s==='ORDP') return '<span class="badge badge-blue">ORDP-已转工单</span>';
      if(s==='NOCO') return '<span class="badge badge-gray">NOCO-已关闭</span>';
      return '<span class="badge">'+esc(s)+'</span>';
    };
    const prioBadge=p=>{
      if(p==='1-高') return '<span style="color:var(--danger);font-weight:bold;">'+esc(p)+'</span>';
      if(p==='2-中') return '<span style="color:var(--warning);font-weight:bold;">'+esc(p)+'</span>';
      return '<span style="color:var(--text-secondary);">'+esc(p)+'</span>';
    };
    const sourceTag=n=>{
      if(n.createdBy==='系统自动') return '<span class="badge badge-sm" style="background:#dbeafe;color:#1e40af;">🔔 系统报警</span>';
      return '<span class="badge badge-sm" style="background:#f0fdf4;color:#166534;">👤 人工</span>';
    };

    document.getElementById('nfV3TableBody').innerHTML=page.map(n=>`
      <tr>
        <td><strong style="color:var(--primary-lighter);cursor:pointer;" onclick="MaintenanceNotificationV3.detail('${n.id}')">${esc(n.QMNUM)}</strong></td>
        <td>${MaintenanceNotificationV3._typeBadge(n.QMART)}</td>
        <td>${esc(n.EQUNR)}</td>
        <td>${esc(n.EQKTX)}</td>
        <td style="max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(n.FENAM)}">${esc(n.FENAM)}</td>
        <td>${sourceTag(n)}</td>
        <td>${prioBadge(n.PRIOK)}</td>
        <td>${statusBadge(n.STAT)}</td>
        <td>${esc(n.QMDAT)}</td>
        <td class="table-actions">
          <button class="btn btn-outline btn-sm" onclick="MaintenanceNotificationV3.detail('${n.id}')">查看</button>
          ${n.STAT==='CRTE'?`
            <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;" onclick="MaintenanceNotificationV3.closeNotify('${n.id}')">关闭</button>
          `:''}
        </td>
      </tr>`).join('');
  },

  /* ========== 搜索与分页 ========== */
  search() {
    this._searchQmnum=document.getElementById('nfV3QMNUM').value.trim();
    this._searchEqunr=document.getElementById('nfV3EQUNR').value.trim();
    this._searchQmart=document.getElementById('nfV3QMART').value;
    this._searchStat=document.getElementById('nfV3STAT').value;
    this._searchPriok=document.getElementById('nfV3PRIOK').value;
    this.filtered=notificationV2Data.filter(n=>{
      if(this._searchQmnum&&!n.QMNUM.includes(this._searchQmnum))return false;
      if(this._searchEqunr&&!n.EQUNR.includes(this._searchEqunr))return false;
      if(this._searchQmart&&n.QMART!==this._searchQmart)return false;
      if(this._searchStat&&n.STAT!==this._searchStat)return false;
      if(this._searchPriok&&n.PRIOK!==this._searchPriok)return false;
      return true;
    });
    this.page=1; this.renderTable();
  },

  reset() {
    document.getElementById('nfV3QMNUM').value='';
    document.getElementById('nfV3EQUNR').value='';
    document.getElementById('nfV3QMART').value='';
    document.getElementById('nfV3STAT').value='';
    document.getElementById('nfV3PRIOK').value='';
    this._searchQmnum='';this._searchEqunr='';this._searchQmart='';this._searchStat='';this._searchPriok='';
    this.filtered=[...notificationV2Data]; this.page=1; this.renderTable();
  },

  prevPage(){if(this.page>1){this.page--;this.renderTable();}},
  nextPage(){if(this.page<Math.ceil(this.filtered.length/this.pageSize)){this.page++;this.renderTable();}},
  changePageSize(){this.pageSize=parseInt(document.getElementById('nfV3PageSize').value);this.page=1;this.renderTable();},

  /* ====================================
     🎯 核心改进：创建方式选择面板
     ==================================== */
  showCreatePicker() {
    const body = `
    <div style="padding:8px 0;">
      <div style="font-size:14px;color:var(--text-secondary);margin-bottom:20px;text-align:center;">
        请选择以下两种方式之一创建通知单
      </div>

      <div style="display:flex;gap:16px;margin-bottom:8px;">

        <!-- 卡片一：手工录入 -->
        <div onclick="closeModal();MaintenanceNotificationV3.createManual()" style="flex:1;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:2px solid #bbf7d0;border-radius:12px;padding:28px 20px;cursor:pointer;transition:all .25s;text-align:center;"
          onmouseenter="this.style.borderColor='#22c55e';this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 25px rgba(34,197,94,.15)'"
          onmouseleave="this.style.borderColor='#bbf7d0';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:44px;margin-bottom:14px;">👤</div>
          <div style="font-size:16px;font-weight:700;color:#166534;margin-bottom:6px;">手工录入</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.5;">现场人员发现故障或提出维护请求时，手动填写通知单信息，包括设备、类型、故障描述等</div>
          <div style="margin-top:14px;display:inline-block;padding:6px 20px;background:#22c55e;color:white;border-radius:20px;font-size:12px;font-weight:600;">开始录入 →</div>
        </div>

        <!-- 卡片二：模拟报警自动生成 -->
        <div onclick="closeModal();MaintenanceNotificationV3.createAlarm()" style="flex:1;background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #bfdbfe;border-radius:12px;padding:28px 20px;cursor:pointer;transition:all .25s;text-align:center;"
          onmouseenter="this.style.borderColor='#3b82f6';this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 25px rgba(59,130,246,.15)'"
          onmouseleave="this.style.borderColor='#bfdbfe';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:44px;margin-bottom:14px;">🔔</div>
          <div style="font-size:16px;font-weight:700;color:#1e40af;margin-bottom:6px;">模拟报警生成</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.5;">模拟状态监测系统自动触发报警，自动选择设备、匹配报警模板，生成高优先级通知单</div>
          <div style="margin-top:14px;display:inline-block;padding:6px 20px;background:#3b82f6;color:white;border-radius:20px;font-size:12px;font-weight:600;">模拟报警 →</div>
        </div>
      </div>
    </div>`;

    showModal('📌 选择通知单创建方式', body, [
      { text: '取消', cls: 'btn-secondary', action: closeModal }
    ], 'modal-lg');
  },

  /* ========== 方式一：手工录入 ========== */
  createManual() {
    const eqOpts = equipmentData.filter(e => e.status !== 'disposed')
      .map(e => `<option value="${esc(e.code)}">${esc(e.name)} (${esc(e.code)})</option>`).join('');
    const typeOpts = `<option value="">请选择</option>
      <option value="M1">M1 - 故障报告（设备已发生异常，需维修介入）</option>
      <option value="M2">M2 - 维护请求（预防性/改善性需求，非紧急）</option>`;

    // 目录A代码组选项（级联第一级）
    const catAGroups = faultCatalog.A.groups;
    const groupOpts = '<option value="">请选择代码组</option>' + catAGroups.map(g => `<option value="${g.code}">${g.code} — ${g.name}</option>`).join('');

    const now = new Date();
    const nowStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0')
      + 'T' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');

    const secStyle = 'font-size:13px;font-weight:600;color:var(--text);padding-bottom:10px;border-bottom:2px solid var(--primary);margin-bottom:2px;display:flex;align-items:center;gap:8px;';

    showModal('📋 新建通知单', `
      <!-- ====== 类型选择（顶部突出） ====== -->
      <div style="margin-bottom:20px;">
        <div class="form-group" style="max-width:440px;">
          <label style="font-weight:600;">通知单类型 <span style="color:var(--danger);">*</span></label>
          <select id="nfV3CreateType" onchange="MaintenanceNotificationV3._onTypeChange()" style="font-size:14px;font-weight:500;">${typeOpts}</select>
          <span style="font-size:11px;color:var(--text-muted);margin-top:3px;display:block;" id="nfV3CreateTypeHint">选择后部分字段联动变化，保存后类型不可修改</span>
        </div>
      </div>

      <!-- ====== 基本信息 ====== -->
      <div style="${secStyle}">📋 基本信息</div>
      <div class="form-grid" style="margin-top:14px;">

        <div class="form-group">
          <label style="font-weight:600;">设备 <span style="color:var(--danger);">*</span></label>
          <div style="display:flex;gap:6px;">
            <select id="nfV3CreateEq" onchange="MaintenanceNotificationV3._onEqChange()" style="flex:1;"><option value="">搜索/选择设备...</option>${eqOpts}</select>
            <button type="button" onclick="toast('扫码功能需移动端支持')" style="padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:white;cursor:pointer;font-size:18px;" title="扫码选择设备">📷</button>
          </div>
        </div>

        <div class="form-group"><label style="font-weight:600;">功能位置</label><input id="nfV3CreateLoc" readonly style="background:#f9fafb;color:var(--text-secondary);" placeholder="选择设备后自动带出"></div>
        <div class="form-group"><label style="font-weight:600;">设备名称</label><input id="nfV3CreateEqName" readonly style="background:#f9fafb;color:var(--text-secondary);" placeholder="选择设备后自动带出"></div>

        <div id="nfV3CreateFaultPhen" class="form-group full" style="display:none;">
          <label style="font-weight:600;">故障现象 <span style="color:var(--danger);">*</span></label>
          <div style="display:flex;gap:8px;">
            <select id="nfV3CreateFaultGroup" onchange="MaintenanceNotificationV3._onCreateGroupChange()" style="flex:1;min-width:0;">${groupOpts}</select>
            <select id="nfV3CreateFaultCode" onchange="MaintenanceNotificationV3._onCreateFaultCodeChange()" style="flex:1;min-width:0;"><option value="">请先选择代码组</option></select>
          </div>
          <span style="font-size:11px;color:var(--text-muted);margin-top:3px;display:block;">目录类型A — 从标准故障代码体系选择</span>
        </div>

        <div class="form-group full">
          <label style="font-weight:600;" id="nfV3CreateDescLabel">故障描述 <span style="color:var(--danger);">*</span></label>
          <textarea id="nfV3CreateDesc" rows="4" placeholder="请详细描述故障现象、发生时间、影响范围等"></textarea>
          <span style="font-size:11px;color:var(--text-muted);margin-top:2px;">建议不超过200字</span>
        </div>

        <div class="form-group">
          <label style="font-weight:600;">优先级 <span style="color:var(--danger);">*</span></label>
          <select id="nfV3CreatePrio">
            <option value="1-高">1 - 高（紧急处理）</option>
            <option value="2-中" selected>2 - 中（尽快处理）</option>
            <option value="3-低">3 - 低（计划处理）</option>
          </select>
        </div>
      </div>

      <!-- ====== 补充信息（可折叠） ====== -->
      <div style="margin-top:24px;">
        <div onclick="
          const p=document.getElementById('nfV3SupplPanel');
          const a=document.getElementById('nfV3SupplArrow');
          p.style.display=p.style.display==='none'?'block':'none';
          a.textContent=p.style.display==='none'?'▶':'▼';
        " style="${secStyle}cursor:pointer;user-select:none;">
          <span id="nfV3SupplArrow">▶</span> 补充信息（选填）
        </div>
        <div id="nfV3SupplPanel" style="display:none;margin-top:14px;">
          <div class="form-grid">
            <div class="form-group"><label style="font-weight:600;">发现时间</label><input type="datetime-local" id="nfV3CreateTime" value="${nowStr}"></div>
            <div class="form-group"><label style="font-weight:600;">发现人</label><input id="nfV3CreateFinder" value="当前用户" placeholder="当前用户"></div>
            <div id="nfV3CreateExpectedDateWrap" class="form-group" style="display:none;"><label style="font-weight:600;">期望完成日期</label><input type="date" id="nfV3CreateExpectedDate"></div>
            <div class="form-group"><label style="font-weight:600;">附件</label>
              <div style="border:2px dashed var(--border);border-radius:8px;padding:16px;text-align:center;cursor:pointer;transition:all .15s;"
                onclick="toast('附件上传功能将在后续版本实现')"
                onmouseenter="this.style.borderColor='var(--primary)';this.style.background='#f8fafc';"
                onmouseleave="this.style.borderColor='var(--border)';this.style.background='white';">
                <div style="font-size:28px;margin-bottom:4px;">📎</div>
                <div style="font-size:12px;color:var(--text-muted);">点击上传图片/视频</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'保存',cls:'btn-primary',action:()=>{MaintenanceNotificationV3._saveManual();}}
    ], 'modal-lg');
    // 初始化M1状态联动
    this._onTypeChange();
  },

  _onTypeChange() {
    const type = document.getElementById('nfV3CreateType')?.value;
    const fPhen = document.getElementById('nfV3CreateFaultPhen');
    const expWrap = document.getElementById('nfV3CreateExpectedDateWrap');
    const descEl = document.getElementById('nfV3CreateDesc');
    const descLabel = document.getElementById('nfV3CreateDescLabel');
    const prioEl = document.getElementById('nfV3CreatePrio');
    const hint = document.getElementById('nfV3CreateTypeHint');

    if (type === 'M1') {
      if (fPhen) fPhen.style.display = '';
      if (expWrap) expWrap.style.display = 'none';
      if (descLabel) descLabel.innerHTML = '故障描述 <span style="color:var(--danger);">*</span>';
      if (descEl) descEl.placeholder = '请详细描述故障现象、发生时间、影响范围等（选择故障现象后自动填充描述）';
      if (prioEl && prioEl.value !== '1-高') prioEl.value = '1-高';
      if (hint) hint.textContent = 'M1 故障报告：记录已发生的设备故障/异常，保存后可转维修工单';
    } else if (type === 'M2') {
      if (fPhen) fPhen.style.display = 'none';
      if (expWrap) expWrap.style.display = '';
      if (descLabel) descLabel.innerHTML = '维护需求描述 <span style="color:var(--danger);">*</span>';
      if (descEl) descEl.placeholder = '请描述维护/改善需求，包括背景、期望效果等';
      if (prioEl && prioEl.value !== '2-中' && prioEl.value !== '3-低') prioEl.value = '2-中';
      if (hint) hint.textContent = 'M2 维护请求：预防性/改善性需求，不要求关联故障现象';
    }
  },

  _onEqChange() {
    const code = document.getElementById('nfV3CreateEq')?.value;
    const eq = equipmentData.find(e => e.code === code);
    const locEl = document.getElementById('nfV3CreateLoc');
    const nameEl = document.getElementById('nfV3CreateEqName');
    if (eq) {
      if (locEl) locEl.value = eq.locationName || '';
      if (nameEl) nameEl.value = eq.name || '';
    } else {
      if (locEl) locEl.value = '';
      if (nameEl) nameEl.value = '';
    }
  },

  _onCreateGroupChange() {
    const groupCode = document.getElementById('nfV3CreateFaultGroup')?.value;
    const codeEl = document.getElementById('nfV3CreateFaultCode');
    if (!codeEl) return;

    if (!groupCode) {
      codeEl.innerHTML = '<option value="">请先选择代码组</option>';
      return;
    }

    const catAGroups = faultCatalog.A.groups;
    const grp = catAGroups.find(g => g.code === groupCode);
    if (!grp) { codeEl.innerHTML = '<option value="">无可用代码</option>'; return; }

    let opts = '<option value="">请选择故障现象</option>';
    for (const sg of grp.subGroups) {
      for (const c of sg.codes) {
        opts += `<option value="${c.code}" data-name="${esc(c.name)}" data-full="${esc(sg.name + ' → ' + c.name)}">${c.code} — ${esc(sg.name)} → ${esc(c.name)}</option>`;
      }
    }
    codeEl.innerHTML = opts;
  },

  _onCreateFaultCodeChange() {
    const codeEl = document.getElementById('nfV3CreateFaultCode');
    const descEl = document.getElementById('nfV3CreateDesc');
    if (!codeEl || !descEl) return;
    const sel = codeEl.options[codeEl.selectedIndex];
    if (!sel || !sel.value) return;
    const fullName = sel.getAttribute('data-full') || sel.textContent;
    descEl.value = fullName;
  },

  _saveManual() {
    const qmart = document.getElementById('nfV3CreateType').value;
    const eqCode = document.getElementById('nfV3CreateEq').value;
    const prio = document.getElementById('nfV3CreatePrio').value;
    const desc = document.getElementById('nfV3CreateDesc').value.trim();

    if (!qmart) { toast('请选择通知单类型！'); return; }
    if (!eqCode) { toast('请选择关联设备！'); return; }
    if (!desc) { toast('请填写描述！'); return; }

    // M1 类型校验故障现象
    let faultCode = '';
    if (qmart === 'M1') {
      faultCode = document.getElementById('nfV3CreateFaultCode')?.value || '';
      if (!faultCode) { toast('请选择故障现象！'); return; }
    }

    const eq = equipmentData.find(e => e.code === eqCode);
    const maxNum = notificationV2Data.reduce((max, n) => {
      const num = parseInt(n.QMNUM.replace('N', ''));
      return num > max ? num : max;
    }, 0);
    const newQMNUM = 'N' + String(maxNum + 1).padStart(7, '0');
    const newId = 'NOTIF' + String(notificationV2Data.length + 1).padStart(3, '0');
    const qmartTxt = qmart === 'M1' ? 'M1 - 故障报告' : 'M2 - 维护请求';

    const finder = document.getElementById('nfV3CreateFinder')?.value?.trim() || '当前用户';
    const timeVal = document.getElementById('nfV3CreateTime')?.value || '';

    notificationV2Data.push({
      id: newId, QMNUM: newQMNUM, QMART: qmart, QMART_TXT: qmartTxt,
      EQUNR: eqCode, EQKTX: eq ? eq.name : '',
      FENAM: desc, PRIOK: prio, STAT: 'CRTE', STAT_TXT: '待处理',
      faultPhenomenonCode: faultCode, faultCauseCode: '', faultSolutionCode: '',
      QMNAM: finder, QMDAT: timeVal || new Date().toLocaleString('zh-CN'),
      relatedOrder: '', closeReason: '', attachments: [],
      expectedDate: document.getElementById('nfV3CreateExpectedDate')?.value || '',
      background: '',
      createdBy: finder, createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN')
    });

    toast('通知单创建成功！编号：' + newQMNUM);
    closeModal();
    this.filtered = [...notificationV2Data];
    this.renderTable();
  },

  /* ========== 方式二：模拟报警自动生成 ========== */
  createAlarm() {
    const eqOpts=equipmentData.map(e=>`<option value="${esc(e.code)}">${esc(e.name)} (${esc(e.code)})</option>`).join('');
    const alarmTemplates = [
      { id:'over-temp', label:'温度越上限', desc:'温度传感器读数超出上限阈值', template:'[{measurePoint}] 读数 {value}℃ 超出 [上限] {limit}℃' },
      { id:'over-vibration', label:'振动越限', desc:'振动传感器读数超出允许范围', template:'[{measurePoint}] 振动值 {value}mm/s 超出 [上限] {limit}mm/s' },
      { id:'over-pressure', label:'压力异常', desc:'压力传感器读数偏离正常范围', template:'[{measurePoint}] 读数 {value}MPa 超出 [上限] {limit}MPa' },
      { id:'abnormal-noise', label:'异常噪音', desc:'设备运行噪音超出正常范围', template:'[{measurePoint}] 噪音值 {value}dB 超出 [上限] {limit}dB，轴承/齿轮可能存在异常' },
      { id:'freq-alarm', label:'变频器报警', desc:'变频器故障代码触发报警', template:'[{measurePoint}] 变频器 {alarmCode} 报警，设备自动停运' },
      { id:'current-spike', label:'电流异常', desc:'电流表读数突变或持续偏高', template:'[{measurePoint}] 电流值 {value}A 超出 [上限] {limit}A，可能负载异常' }
    ];

    const alarmCards = alarmTemplates.map((a, i) => `
      <div onclick="document.querySelectorAll('#nfV3AlarmCards>div').forEach(d=>d.style.borderColor='var(--border)');this.style.borderColor='#3b82f6';this.style.background='#eff6ff';window._nfV3AlarmIdx=${i};" style="padding:12px;border:2px solid var(--border);border-radius:8px;cursor:pointer;transition:all .15s;margin-bottom:8px;"
        onmouseenter="if(window._nfV3AlarmIdx!==${i}){this.style.background='#f8fafc';}" onmouseleave="if(window._nfV3AlarmIdx!==${i}){this.style.background='white';}">
        <div style="font-size:14px;font-weight:600;color:var(--text);">⚠️ ${esc(a.label)}</div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">${esc(a.desc)}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;font-family:monospace;">模板：${esc(a.template)}</div>
      </div>`).join('');

    showModal('🔔 模拟状态监测报警', `
      <div style="margin-bottom:14px;padding:10px 14px;background:#fef3c7;border-radius:6px;font-size:13px;color:#92400e;border-left:3px solid #f59e0b;">
        💡 模拟方式：系统将根据您选择的设备和报警类型，自动填充故障描述并以"系统自动"身份创建通知单
      </div>
      <div class="form-grid" style="margin-bottom:16px;">
        <div class="form-group"><label>触发设备<span class="req">*</span></label><select id="nfV3AlarmEq"><option value="">请选择</option>${eqOpts}</select></div>
      </div>
      <div style="font-size:13px;font-weight:600;margin-bottom:8px;color:var(--text);">选择报警类型（点击高亮）：</div>
      <div id="nfV3AlarmCards" style="max-height:300px;overflow-y:auto;">${alarmCards}</div>
    `, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'生成报警通知单',cls:'btn-primary',action:()=>{
        const eqCode=document.getElementById('nfV3AlarmEq').value;
        if(!eqCode){toast('请选择触发设备！');return;}
        if(window._nfV3AlarmIdx===undefined||window._nfV3AlarmIdx<0){toast('请选择报警类型（点击卡片高亮）！');return;}
        const alarm=alarmTemplates[window._nfV3AlarmIdx];
        MaintenanceNotificationV3._saveAlarm(eqCode, alarm);
        window._nfV3AlarmIdx=undefined;
      }}
    ]);
  },

  _saveAlarm(eqCode, alarm) {
    const eq=equipmentData.find(e=>e.code===eqCode);
    const now=new Date().toLocaleString('zh-CN');

    // 生成模拟测量值
    const randomValue=()=>(Math.random()*50+120).toFixed(1);
    const alarmDesc = alarm.template
      .replace('{measurePoint}', eq?eq.name:'未知设备')
      .replace('{value}', randomValue())
      .replace('{limit}', alarm.id==='over-temp'?'150':alarm.id==='over-vibration'?'7.0':alarm.id==='over-pressure'?'1.0':alarm.id==='abnormal-noise'?'72':alarm.id==='current-spike'?'45':'--')
      .replace('{alarmCode}', 'F0'+(Math.floor(Math.random()*7)+1));

    // 根据报警类型自动匹配故障现象代码
    const alarmToFaultCode = {
      'over-temp': 'A04-1-01', 'over-vibration': 'A01-1-01', 'over-pressure': 'A04-1-02',
      'abnormal-noise': 'A01-1-01', 'freq-alarm': 'A02-1-02', 'current-spike': 'A02-1-01'
    };
    const faultCode = alarmToFaultCode[alarm.id] || '';

    const maxNum=notificationV2Data.reduce((max,n)=>{
      const num=parseInt(n.QMNUM.replace('N',''));
      return num>max?num:max;
    },0);
    const newQMNUM='N'+String(maxNum+1).padStart(7,'0');
    const newId='NOTIF'+String(notificationV2Data.length+1).padStart(3,'0');

    notificationV2Data.push({
      id:newId,QMNUM:newQMNUM,QMART:'M1',QMART_TXT:'M1 - 故障报告',
      EQUNR:eqCode,EQKTX:eq?eq.name:'',
      FENAM:`[${alarm.label}] ${alarmDesc}`,
      faultPhenomenonCode:faultCode, faultCauseCode:'', faultSolutionCode:'',
      PRIOK:'1-高',STAT:'CRTE',STAT_TXT:'待处理',
      QMNAM:'系统自动',QMDAT:now,
      relatedOrder:'',closeReason:'',attachments:[],
      expectedDate:'',background:'',
      createdBy:'系统自动',createdAt:now,updatedAt:now
    });

    toast('报警通知单已生成！编号：'+newQMNUM+'（来源：状态监测报警）');
    closeModal();
    this.filtered=[...notificationV2Data];
    this.renderTable();
  },

  /* ========== 详情 ========== */
  detail(id) {
    const n=notificationV2Data.find(x=>x.id===id);
    if(!n)return;
    const eq=equipmentData.find(e=>e.code===n.EQUNR);
    const wo=workOrderV2Data.find(w=>w.sourceNo===n.QMNUM);
    const statusColor=n.STAT==='CRTE'?'var(--warning)':n.STAT==='ORDP'?'var(--primary-lighter)':'var(--text-muted)';

    const srcTag=n.createdBy==='系统自动'?'<span class="badge" style="background:#dbeafe;color:#1e40af;">🔔 状态监测报警自动生成</span>':'<span class="badge" style="background:#f0fdf4;color:#166534;">👤 人工录入</span>';

    showModal(`通知单 ${esc(n.QMNUM)}`, `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border);">
        <div>
          <div style="font-size:20px;font-weight:700;color:var(--text);">通知单 ${esc(n.QMNUM)}</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">状态：<span style="color:${statusColor};font-weight:600;">${esc(n.STAT_TXT)}</span> | ${srcTag}</div>
        </div>
        <div style="display:flex;gap:8px;">
          ${n.STAT==='CRTE'?`
            <button class="btn btn-success btn-sm" onclick="MaintenanceNotificationV3.convertToOrder('${n.id}');closeModal();">转工单</button>
            <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;" onclick="MaintenanceNotificationV3.closeNotify('${n.id}')">关闭通知单</button>
          `:''}
        </div>
      </div>
      <div class="detail-grid" style="margin-bottom:16px;">
        <div class="detail-item"><dt>通知单类型</dt><dd>${MaintenanceNotificationV3._typeBadge(n.QMART)}</dd></div>
        <div class="detail-item"><dt>设备编码</dt><dd>${esc(n.EQUNR)}</dd></div>
        <div class="detail-item"><dt>设备名称</dt><dd>${esc(n.EQKTX)}</dd></div>
        <div class="detail-item"><dt>功能位置</dt><dd>${eq?esc(eq.locationName):'-'}</dd></div>
        <div class="detail-item"><dt>优先级</dt><dd>${esc(n.PRIOK)}</dd></div>
        <div class="detail-item"><dt>发现人</dt><dd>${esc(n.QMNAM)}</dd></div>
        <div class="detail-item"><dt>发现时间</dt><dd>${esc(n.QMDAT)}</dd></div>
        <div class="detail-item"><dt>来源</dt><dd>${srcTag}</dd></div>
        ${wo?`<div class="detail-item"><dt>关联工单</dt><dd><span style="color:var(--primary-lighter);font-weight:600;">${esc(wo.AUFNR)} (${esc(wo.STAT_TXT)})</span></dd></div>`:''}
        ${n.closeReason?`<div class="detail-item"><dt>关闭原因</dt><dd style="color:var(--text-muted);">${esc(n.closeReason)}</dd></div>`:''}
      </div>
      <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:16px;">
        <div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--text-secondary);">描述</div>
        <div style="font-size:14px;line-height:1.7;color:var(--text);white-space:pre-wrap;">${esc(n.FENAM)}</div>
      </div>
      ${n.faultPhenomenonCode || n.faultCauseCode || n.faultSolutionCode ? `
        <div style="background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:8px;padding:16px;margin-bottom:16px;">
          <div style="font-weight:600;font-size:13px;margin-bottom:10px;color:var(--primary-lighter);display:flex;align-items:center;gap:6px;">🔍 故障分析链（现象 → 原因 → 措施）</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
            <div style="background:white;border-radius:6px;padding:10px;text-align:center;">
              <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">故障现象（目录A）</div>
              <div style="font-size:13px;font-weight:600;color:#dc2626;">${n.faultPhenomenonCode ? esc(getCatalogFullName('A', n.faultPhenomenonCode)) : '<span style="color:var(--text-muted);">—</span>'}</div>
              ${n.faultPhenomenonCode ? `<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;font-family:monospace;">${esc(n.faultPhenomenonCode)}</div>` : ''}
            </div>
            <div style="background:white;border-radius:6px;padding:10px;text-align:center;">
              <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">故障原因（目录B）</div>
              <div style="font-size:13px;font-weight:600;color:#d97706;">${n.faultCauseCode ? esc(getCatalogFullName('B', n.faultCauseCode)) : '<span style="color:var(--text-muted);">— 待维修工补充 —</span>'}</div>
              ${n.faultCauseCode ? `<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;font-family:monospace;">${esc(n.faultCauseCode)}</div>` : ''}
            </div>
            <div style="background:white;border-radius:6px;padding:10px;text-align:center;">
              <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">解决措施（目录C）</div>
              <div style="font-size:13px;font-weight:600;color:#059669;">${n.faultSolutionCode ? esc(getCatalogFullName('C', n.faultSolutionCode)) : '<span style="color:var(--text-muted);">— 待维修工补充 —</span>'}</div>
              ${n.faultSolutionCode ? `<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;font-family:monospace;">${esc(n.faultSolutionCode)}</div>` : ''}
            </div>
          </div>
        </div>` : ''}
      ${n.attachments&&n.attachments.length?`
        <div style="margin-bottom:16px;">
          <div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--text-secondary);">附件 (${n.attachments.length})</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">${n.attachments.map(a=>`<span style="padding:4px 12px;background:var(--bg);border-radius:4px;font-size:12px;">📎 ${esc(a)}</span>`).join('')}</div>
        </div>`:''}
      <div style="font-size:12px;color:var(--text-muted);border-top:1px solid var(--border);padding-top:12px;">
        创建人：${esc(n.createdBy)} | 创建时间：${esc(n.createdAt)} | 更新时间：${esc(n.updatedAt)}
      </div>
    `);
  },

  /* ========== 转工单（委托到工单模块新版弹窗） ========== */
  convertToOrder(id) {
    MaintenanceWorkOrderV3._convertNotification(id);
  },

  /* ========== 关闭通知单 ========== */
  closeNotify(id) {
    const n=notificationV2Data.find(x=>x.id===id);
    if(!n)return;
    showModal('关闭通知单', `
      <div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);">
        通知单号：<strong>${esc(n.QMNUM)}</strong> | 设备：<strong>${esc(n.EQUNR)} ${esc(n.EQKTX)}</strong>
      </div>
      <div class="form-group"><label>关闭类型<span class="req">*</span></label>
        <select id="nfV3CloseType" onchange="document.getElementById('nfV3CloseReason').value=this.value" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;margin-bottom:8px;">
          <option value="">--- 请选择 ---</option>
          <option value="误报 - 经现场确认非设备故障">误报 - 非设备故障</option>
          <option value="已现场处理 - 无需生成工单">已现场处理 - 无需工单</option>
          <option value="重复通知 - 同一故障已有通知单处理中">重复通知 - 已有处理</option>
          <option value="其他原因（请在下方补充）">其他原因</option>
        </select></div>
      <div class="form-group"><label>关闭原因详述<span class="req">*</span></label>
        <textarea id="nfV3CloseReason" rows="3" placeholder="请填写关闭原因（如误报、无需处理等）"></textarea></div>
    `, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'确认关闭',cls:'btn-primary',action:()=>{
        const reason=document.getElementById('nfV3CloseReason').value.trim();
        if(!reason){toast('请填写关闭原因！');return;}
        n.STAT='NOCO';
        n.STAT_TXT='已关闭';
        n.closeReason=reason;
        n.updatedAt=new Date().toLocaleString('zh-CN');
        toast('通知单已关闭');
        closeModal();
        this.filtered=[...notificationV2Data];
        this.renderTable();
      }}
    ]);
  }
};
