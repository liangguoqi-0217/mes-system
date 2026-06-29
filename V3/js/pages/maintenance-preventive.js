// ===== 2.1 预防性维护计划 (合并旧3.1+3.2+3.3) =====
const MaintPreventive = {
  tab: 'plan', // plan | schedule | auto | calendar
  page: 1, pageSize: 10,
  // Plan filters
  pFilter: { code: '', name: '', planType: '', status: '' },
  // Schedule filters
  sFilter: { code: '', planName: '', triggerType: '', status: '' },
  // Auto-gen filters
  aFilter: { scheduleId: '', eqInfo: '', result: '' },
  // Calendar state
  calYear: 2026, calMonth: 6,

  render() {
    return `<div class="page-container" style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div><div style="font-size:18px;font-weight:700;">预防性维护计划</div><div style="font-size:13px;opacity:0.8;">维修流程 → 预防性维护计划 | 策略配置 · 计划调度 · 工单生成 · 执行日历</div></div>
        <div style="display:flex;gap:8px;">
          ${this.tab==='plan'?`<button class="btn btn-blue" onclick="MaintPreventive.createPlan()">+ 新增维护计划</button>`:''}
          ${this.tab==='schedule'?`<button class="btn btn-blue" onclick="MaintPreventive.createSchedule()">+ 新增调度方案</button><button class="btn" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.4);" onclick="MaintPreventive.runDailyAutoGen()">🔍 一键扫描生成</button>`:''}
          ${this.tab==='auto'?`<button class="btn btn-blue" onclick="MaintPreventive.manualGen()">手动触发生成</button><button class="btn" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.4);" onclick="MaintPreventive.runDailyAutoGen()">🔍 一键扫描生成</button>`:''}
        </div>
      </div>
      <div style="display:flex;gap:0;padding:0 24px;background:white;border-bottom:2px solid var(--border);flex-shrink:0;">
        ${['plan','schedule','auto','calendar'].map(t=>{
          const labels={plan:'维护计划列表',schedule:'计划调度',auto:'工单生成日志',calendar:'计划执行日历'};
          const active=this.tab===t;
          return `<button onclick="MaintPreventive.switchTab('${t}')" style="padding:10px 18px;border:none;background:transparent;color:${active?'var(--primary)':'var(--text-secondary)'};font-size:13px;font-weight:${active?'600':'400'};cursor:pointer;border-bottom:${active?'2px solid var(--primary)':'2px solid transparent'};margin-bottom:-2px;transition:all .15s;">${labels[t]}</button>`;
        }).join('')}
      </div>
      <div style="flex:1;overflow-y:auto;" id="pvTabContent">
        ${this._renderCurrentTab()}
      </div>
    </div>`;
  },

  _renderCurrentTab() {
    if (this.tab === 'plan') return this._renderPlanTab();
    if (this.tab === 'schedule') return this._renderScheduleTab();
    if (this.tab === 'auto') return this._renderAutoTab();
    if (this.tab === 'calendar') return this._renderCalendarTab();
    return '';
  },

  init() { this.tab = 'plan'; this.page = 1; },

  switchTab(t) {
    this.tab = t; this.page = 1;
    const ca = document.getElementById('contentArea');
    if (ca) ca.innerHTML = this.render();
  },

  goPage(p) { this.page = Math.max(1, p); this._refreshContent(); },

  _refreshContent() {
    const el = document.getElementById('pvTabContent');
    if (el) el.innerHTML = this._renderCurrentTab();
  },

  // ======================== TAB 1: 维护计划列表 ========================
  _renderPlanTab() {
    const f = this.pFilter;
    let data = [...pmPlanData];
    if (f.code) data = data.filter(d => d.code.toLowerCase().includes(f.code.toLowerCase()));
    if (f.name) data = data.filter(d => d.name.toLowerCase().includes(f.name.toLowerCase()));
    if (f.planType) data = data.filter(d => d.planType === f.planType);
    if (f.status) data = data.filter(d => d.status === f.status);
    const total = data.length, totalPages = Math.ceil(total / this.pageSize);
    const start = (this.page - 1) * this.pageSize, pageData = data.slice(start, start + this.pageSize);
    const typeOpts = [
      { value:'counter',label:'基于计数器' },
      { value:'time',label:'基于时间' }
    ].map(o => `<option value="${o.value}" ${f.planType===o.value?'selected':''}>${o.label}</option>`).join('');
    const statusOpts = pmPlanStatusOptions.map(o => `<option value="${o.value}" ${f.status===o.value?'selected':''}>${o.label}</option>`).join('');
    const pagerHtml = this._renderPagination(total, totalPages);

    return `<div style="padding:16px 24px;display:flex;flex-direction:column;height:100%;">
      <div class="filter-bar">
        <div class="filter-group"><label>计划编码</label><input type="text" value="${esc(f.code)}" onchange="MaintPreventive.pFilter.code=this.value;MaintPreventive.searchPlan()" placeholder="计划编码"></div>
        <div class="filter-group"><label>计划名称</label><input type="text" value="${esc(f.name)}" onchange="MaintPreventive.pFilter.name=this.value;MaintPreventive.searchPlan()" placeholder="计划名称"></div>
        <div class="filter-group"><label>策略类型</label><select onchange="MaintPreventive.pFilter.planType=this.value;MaintPreventive.searchPlan()"><option value="">全部类型</option>${typeOpts}</select></div>
        <div class="filter-group"><label>状态</label><select onchange="MaintPreventive.pFilter.status=this.value;MaintPreventive.searchPlan()"><option value="">全部状态</option>${statusOpts}</select></div>
        <div class="filter-actions"><button class="btn btn-primary btn-sm" onclick="MaintPreventive.searchPlan()">查询</button><button class="btn btn-secondary btn-sm" onclick="MaintPreventive.resetPlanFilter()">重置</button></div>
      </div>
      <div class="table-wrapper" style="flex:1;overflow:auto;margin-top:12px;"><table class="data-table"><thead><tr>
        <th>计划编码</th><th>计划描述</th><th>策略类型</th><th>周期</th><th>设备/位置</th><th>工作中心</th><th>版本</th><th>状态</th><th>操作</th>
      </tr></thead><tbody>${pageData.map(d => {
        const s = pmPlanStatusOptions.find(o => o.value === d.status);
        const strategyLabel = d.planType === 'counter' ? '基于计数器' : d.planType === 'time' ? '基于时间' : '--';
        const stCls = d.planType === 'counter' ? 'badge-purple' : 'badge-blue';
        const cycleText = d.cycleValue ? `${d.cycleValue} ${d.cycleUnit||''}` : '--';
        const eqName = (d.devices && d.devices.length > 0) ? esc(d.devices[0].eqName) : (d.flInfo ? esc(d.flInfo.flName) : '--');
        return `<tr>
          <td><strong>${esc(d.code)}</strong></td>
          <td>${esc(d.name)}</td>
          <td><span class="badge badge-sm ${stCls}">${strategyLabel}</span></td>
          <td style="font-size:12px;">${cycleText}</td>
          <td style="font-size:12px;">${eqName}</td>
          <td style="font-size:12px;">${esc(d.workCenterName)}</td>
          <td>${esc(d.version)}</td>
          <td><span class="badge ${s?s.cls:'badge-gray'}">${s?s.label:d.status}</span></td>
          <td class="table-actions">${this._planRowActions(d)}</td>
        </tr>`;
      }).join('')}</tbody></table></div>
      ${pagerHtml}
    </div>`;
  },

  _planRowActions(d) {
    return `<button class="btn btn-blue btn-sm" onclick="MaintPreventive.viewPlan('${d.id}')">查看</button>`;
  },

  searchPlan() { this.page = 1; this._refreshContent(); },
  resetPlanFilter() { this.pFilter = { code: '', name: '', planType: '', status: '' }; this.page = 1; this._refreshContent(); },

  createPlan() {
    const eqOpts = equipmentData.map(e => `<option value="${e.id}">${esc(e.code)} | ${esc(e.name)}</option>`).join('');
    const flOpts = Object.values(locationData).map(l => `<option value="${l.id}">${esc(l.id)} | ${esc(l.name)}</option>`).join('');
    const wcOpts = (wcMockData || []).map(w => `<option value="${w.id}">${esc(w.name)}</option>`).join('');
    const publishedTaskLists = (taskListMockData || []).filter(t => t.PLNST === '已发布');
    const tlOpts = publishedTaskLists.map(t => `<option value="${t.id}">${esc(t.PLNNR)} | ${esc(t.PLTXT)}</option>`).join('');

    const now = new Date();
    const todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

    showModal('新建维护计划', `
      <div class="plan-create-single" style="max-height:70vh;overflow-y:auto;padding-right:4px;">

        <!-- 计划描述 -->
        <div style="margin-bottom:18px;">
          <label style="font-weight:600;font-size:14px;display:block;margin-bottom:6px;">计划描述 <span class="req">*</span></label>
          <input type="text" id="pvPlanDesc" placeholder="如：每2000h例行保养" style="width:100%;padding:10px 12px;font-size:14px;border:1px solid var(--border);border-radius:6px;">
        </div>

        <!-- 基础信息 -->
        <div style="font-size:13px;font-weight:700;color:var(--text-secondary);padding:8px 0;margin-bottom:8px;border-bottom:1px dashed var(--border);">基础信息</div>
        <div class="form-grid">
          <div class="form-group">
            <label>设备 <span class="req">*</span></label>
            <select id="pvPlanEq" onchange="MaintPreventive._planOnEqChange()">
              <option value="">搜索/选择设备...</option>${eqOpts}
            </select>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">也可选择功能位置，二选一必填</div>
          </div>
          <div class="form-group">
            <label>功能位置</label>
            <select id="pvPlanFL" onchange="MaintPreventive._planOnFLChange()">
              <option value="">搜索/选择功能位置...</option>${flOpts}
            </select>
          </div>
          <div class="form-group">
            <label>设备/位置名称</label>
            <input type="text" id="pvPlanEqName" readonly style="background:#f9fafb;" placeholder="自动带出（只读）">
          </div>
          <div class="form-group">
            <label>策略类型 <span class="req">*</span></label>
            <select id="pvPlanStrategy" onchange="MaintPreventive._planOnStrategyChange()">
              <option value="counter">基于计数器</option>
              <option value="time">基于时间</option>
            </select>
          </div>
          <div class="form-group">
            <label>状态</label>
            <select id="pvPlanStatus">
              <option value="active">活跃</option>
              <option value="inactive">停用</option>
            </select>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">新建默认活跃，可停用</div>
          </div>
        </div>

        <!-- 策略参数（动态区域） -->
        <div style="font-size:13px;font-weight:700;color:var(--text-secondary);padding:8px 0;margin-bottom:8px;margin-top:4px;border-bottom:1px dashed var(--border);">策略参数</div>
        <div id="pvStrategyArea" style="margin-bottom:4px;"></div>

        <!-- 维护内容 -->
        <div style="font-size:13px;font-weight:700;color:var(--text-secondary);padding:8px 0;margin-bottom:8px;border-bottom:1px dashed var(--border);">维护内容</div>
        <div class="form-grid">
          <div class="form-group">
            <label>关联任务清单</label>
            <select id="pvPlanTaskList" onchange="MaintPreventive._planOnTaskListChange()">
              <option value="">搜索/选择任务清单...（可选）</option>${tlOpts}
            </select>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">可选，已发布的任务清单。选择后自动带出清单描述</div>
          </div>
          <div class="form-group">
            <label>任务清单描述</label>
            <input type="text" id="pvPlanTLDesc" readonly style="background:#f9fafb;" placeholder="自动带出（只读）">
          </div>
          <div class="form-group">
            <label>主要工作中心 <span class="req">*</span></label>
            <select id="pvPlanWC">
              <option value="">请选择工作中心</option>${wcOpts}
            </select>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">优先级：任务清单工作中心 > 设备主数据班组 > 手动选择</div>
          </div>
          <div class="form-group">
            <label>优先级</label>
            <select id="pvPlanPriority">
              <option value="normal">一般</option>
              <option value="important" selected>中</option>
              <option value="critical">高</option>
            </select>
          </div>
          <div class="form-group">
            <label>提前生成天数</label>
            <div style="display:flex;align-items:center;gap:8px;">
              <input type="number" id="pvPlanEarlyDays" value="7" min="0" max="90" style="width:80px;text-align:center;">
              <span style="font-size:13px;color:var(--text-secondary);">天</span>
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">到期前多少天自动生成工单，默认7天。仅基于时间的计划有效</div>
          </div>
        </div>

        <!-- 补充信息 -->
        <div style="font-size:13px;font-weight:700;color:var(--text-secondary);padding:8px 0;margin-bottom:8px;border-bottom:1px dashed var(--border);">补充信息</div>
        <div class="form-grid">
          <div class="form-group" style="grid-column:1/-1;">
            <label>长文本</label>
            <textarea id="pvPlanLongText" rows="3" placeholder="详细说明、特殊要求等" style="width:100%;resize:vertical;"></textarea>
          </div>
          <div class="form-group" style="grid-column:1/-1;">
            <label>附件</label>
            <div style="border:2px dashed var(--border);border-radius:8px;padding:16px;text-align:center;background:#fafbfc;">
              <span style="color:var(--text-muted);font-size:13px;">拖拽文件到此处或 <a href="javascript:void(0)" style="color:var(--primary);" onclick="MaintPreventive._planUploadFile()">点击上传</a></span>
            </div>
          </div>
        </div>

      </div>
    `, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '保存', cls: 'btn-primary', action: () => MaintPreventive._doCreatePlan() }
    ], 'modal-lg');

    // 初始化策略参数区域（默认基于计数器）
    this._planRenderStrategyCounter();
  },

  // ---- 策略类型切换 ----
  _planOnStrategyChange() {
    const type = document.getElementById('pvPlanStrategy').value;
    if (type === 'counter') {
      this._planRenderStrategyCounter();
    } else {
      this._planRenderStrategyTime();
    }
  },

  // ---- 渲染"基于时间"策略参数 ----
  _planRenderStrategyTime() {
    const today = new Date();
    // 默认下次到期日 = 当前日期 + 30天
    const defaultDue = new Date(today);
    defaultDue.setDate(defaultDue.getDate() + 30);
    const dueStr = defaultDue.getFullYear() + '-' + String(defaultDue.getMonth() + 1).padStart(2, '0') + '-' + String(defaultDue.getDate()).padStart(2, '0');

    const area = document.getElementById('pvStrategyArea');
    if (area) area.innerHTML = `
      <div class="form-grid">
        <div class="form-group">
          <label>周期类型 <span class="req">*</span></label>
          <select id="pvTimeCycleType">
            <option value="天">天</option>
            <option value="周">周</option>
            <option value="月" selected>月</option>
            <option value="年">年</option>
          </select>
        </div>
        <div class="form-group">
          <label>周期值 <span class="req">*</span></label>
          <input type="number" id="pvTimeCycleVal" value="3" min="1" style="width:100%;" placeholder="如：3">
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">如"每3个月"</div>
        </div>
        <div class="form-group">
          <label>下次到期日 <span class="req">*</span></label>
          <input type="date" id="pvTimeNextDue" value="${dueStr}">
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">系统自动计算：当前日期+周期，可修改</div>
        </div>
      </div>
      <div style="padding:8px 12px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;font-size:12px;color:#0369a1;margin-top:4px;">
        触发逻辑：到期前"提前生成天数"生成工单
      </div>
    `;
  },

  // ---- 渲染"基于计数器"策略参数 ----
  _planRenderStrategyCounter() {
    const eqId = document.getElementById('pvPlanEq').value;
    // 过滤该设备下类型为计数器的测量点
    let counterMPs = [];
    if (eqId) {
      counterMPs = measurementPointData.filter(mp => mp.equipmentId === eqId && mp.isCounter === true);
    }
    const mpOpts = counterMPs.map(mp => `<option value="${mp.id}" data-unit="${esc(mp.unit||'h')}">${esc(mp.code)} | ${esc(mp.name)} (${esc(mp.unit||'h')})</option>`).join('');

    const area = document.getElementById('pvStrategyArea');
    if (area) area.innerHTML = `
      <div class="form-grid">
        <div class="form-group">
          <label>计数器测量点 <span class="req">*</span></label>
          <select id="pvCounterMP" onchange="MaintPreventive._planOnCounterMPChange()">
            <option value="">选择测量点...</option>${mpOpts}
          </select>
          <div style="font-size:11px;color:${eqId?'var(--text-muted)':'var(--danger)'};margin-top:2px;">
            ${eqId ? (counterMPs.length > 0 ? '仅显示该设备下类型为"计数器"的测量点' : '该设备下暂无计数器测量点') : '请先选择设备'}
          </div>
        </div>
        <div class="form-group">
          <label>维护间隔 <span class="req">*</span></label>
          <div style="display:flex;align-items:center;gap:8px;">
            <input type="number" id="pvCounterInterval" value="2000" min="1" style="flex:1;" placeholder="数值">
            <select id="pvCounterUnit" style="width:100px;">
              <option value="h">小时</option>
              <option value="件">件</option>
              <option value="次">次</option>
            </select>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">填写数值，单位从测量点带出或手动选</div>
        </div>
        <div class="form-group">
          <label>当前累计读数</label>
          <input type="text" id="pvCounterCurrent" readonly style="background:#f9fafb;" placeholder="选择测量点后自动显示">
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">实时从系统读取计数器当前值，展示参考</div>
        </div>
        <div class="form-group">
          <label>上次维护读数</label>
          <input type="text" id="pvCounterLastMaint" readonly style="background:#f9fafb;" placeholder="上次工单完成时记录">
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">上次工单完成时记录的计数器读数</div>
        </div>
      </div>
      <div style="padding:8px 12px;background:#fefce8;border:1px solid #fef08a;border-radius:6px;font-size:12px;color:#854d0e;margin-top:4px;">
        触发逻辑：后台定期比对"当前累计读数 - 上次维护读数 ≥ 维护间隔"时，生成工单
      </div>
    `;
  },

  // ---- 设备选择变更 ----
  _planOnEqChange() {
    const eqId = document.getElementById('pvPlanEq').value;
    const nameInput = document.getElementById('pvPlanEqName');
    const flSelect = document.getElementById('pvPlanFL');
    // 选设备时清除功能位置选择
    if (eqId) {
      const eq = equipmentData.find(e => e.id === eqId);
      if (eq) {
        nameInput.value = eq.name;
        // 自动带出工作中心
        const wcSelect = document.getElementById('pvPlanWC');
        if (wcSelect && !wcSelect.value) {
          let wc = null;
          if (eq.team) wc = (wcMockData || []).find(w => w.name === eq.team);
          if (!wc && eq.workCenter) wc = (wcMockData || []).find(w => w.id === eq.workCenter);
          if (wc) wcSelect.value = wc.id;
        }
      }
      if (flSelect) flSelect.value = '';
    } else {
      nameInput.value = '';
    }
    // 如果策略类型是计数器，刷新计数器测量点列表
    const strategy = document.getElementById('pvPlanStrategy');
    if (strategy && strategy.value === 'counter') {
      this._planRenderStrategyCounter();
    }
  },

  // ---- 功能位置选择变更 ----
  _planOnFLChange() {
    const flId = document.getElementById('pvPlanFL').value;
    const nameInput = document.getElementById('pvPlanEqName');
    const eqSelect = document.getElementById('pvPlanEq');
    if (flId) {
      const loc = locationData[flId];
      if (loc) { nameInput.value = loc.name; }
      if (eqSelect) eqSelect.value = '';
    } else {
      nameInput.value = '';
    }
  },

  // ---- 计数器测量点选择变更 ----
  _planOnCounterMPChange() {
    const mpId = document.getElementById('pvCounterMP').value;
    const currentInput = document.getElementById('pvCounterCurrent');
    const lastMaintInput = document.getElementById('pvCounterLastMaint');
    const unitSelect = document.getElementById('pvCounterUnit');
    if (mpId) {
      const mp = measurementPointData.find(m => m.id === mpId);
      if (mp) {
        // 获取最新测量记录
        const latestRec = (measurementRecordData || [])
          .filter(r => r.measurementPointId === mpId && r.quantitativeValue !== null && r.quantitativeValue !== undefined)
          .sort((a, b) => new Date(b.recordTime) - new Date(a.recordTime))[0];
        if (latestRec) currentInput.value = latestRec.quantitativeValue;
        else currentInput.value = mp.initialCounter || '';
        // 上次维护读数：从计划扩展数据中查找匹配设备
        const matchingPlans = pmPlanData.filter(p => {
          const devs = p.devices || [];
          return devs.some(dd => dd.eqId === mp.equipmentId);
        });
        if (matchingPlans.length > 0) {
          const p = matchingPlans[0];
          lastMaintInput.value = (p.lastReading !== null && p.lastReading !== undefined) ? p.lastReading : '--';
        } else {
          lastMaintInput.value = '--';
        }
        // 自动设置单位
        if (unitSelect && mp.unit) {
          for (let i = 0; i < unitSelect.options.length; i++) {
            if (unitSelect.options[i].value === mp.unit) { unitSelect.selectedIndex = i; break; }
          }
        }
      }
    } else {
      currentInput.value = '';
      lastMaintInput.value = '';
    }
  },

  // ---- 任务清单选择变更 ----
  _planOnTaskListChange() {
    const tlId = document.getElementById('pvPlanTaskList').value;
    const descInput = document.getElementById('pvPlanTLDesc');
    const wcSelect = document.getElementById('pvPlanWC');
    if (tlId) {
      const tl = (taskListMockData || []).find(t => t.id === tlId);
      if (tl) {
        descInput.value = tl.PLTXT || '';
        // 自动带出工作中心：多级匹配
        if (wcSelect && !wcSelect.value) {
          let foundWc = null;
          // 1. 直接匹配 ARBPL 与 wcMockData.code
          if (tl.ARBPL) foundWc = (wcMockData || []).find(w => w.code === tl.ARBPL);
          // 2. 通过关联设备匹配：查找设备的 workCenter 或 team
          if (!foundWc && tl.associatedObj) {
            const eq = equipmentData.find(e => e.code === tl.associatedObj);
            if (eq) {
              if (eq.workCenter) foundWc = (wcMockData || []).find(w => w.id === eq.workCenter);
              if (!foundWc && eq.team) foundWc = (wcMockData || []).find(w => w.name === eq.team);
            }
          }
          if (foundWc) wcSelect.value = foundWc.id;
        }
      }
    } else {
      descInput.value = '';
    }
  },

  // ---- 附件上传 ----
  _planUploadFile() {
    toast('文件上传功能（可扩展对接OSS/本地存储）');
  },

  // ---- 保存计划 ----
  _doCreatePlan() {
    const desc = document.getElementById('pvPlanDesc').value.trim();
    const eqId = document.getElementById('pvPlanEq').value;
    const flId = document.getElementById('pvPlanFL').value;
    const strategy = document.getElementById('pvPlanStrategy').value;
    const status = document.getElementById('pvPlanStatus').value;
    const wcId = document.getElementById('pvPlanWC').value;
    const priority = document.getElementById('pvPlanPriority').value;
    const earlyDays = parseInt(document.getElementById('pvPlanEarlyDays').value) || 7;
    const longText = document.getElementById('pvPlanLongText').value.trim();

    // 必填项校验
    if (!desc) { toast('请输入计划描述！'); return; }
    if (!eqId && !flId) { toast('请选择设备或功能位置（二选一必填）！'); return; }
    if (!wcId) { toast('请选择主要工作中心！'); return; }

    // 策略参数校验
    let planType, cycleValue, cycleUnit, nextDueDate;
    if (strategy === 'counter') {
      const mpId = document.getElementById('pvCounterMP').value;
      const interval = document.getElementById('pvCounterInterval').value;
      const unit = document.getElementById('pvCounterUnit').value;
      if (!mpId) { toast('请选择计数器测量点！'); return; }
      if (!interval || parseInt(interval) <= 0) { toast('请输入有效的维护间隔！'); return; }
      planType = 'counter';
      cycleValue = parseInt(interval);
      cycleUnit = unit;
    } else {
      const cycleType = document.getElementById('pvTimeCycleType').value;
      const cycleVal = document.getElementById('pvTimeCycleVal').value;
      const nextDue = document.getElementById('pvTimeNextDue').value;
      if (!cycleVal || parseInt(cycleVal) <= 0) { toast('请输入有效的周期值！'); return; }
      if (!nextDue) { toast('请选择下次到期日！'); return; }
      planType = 'time';
      cycleValue = parseInt(cycleVal);
      cycleUnit = cycleType;
      nextDueDate = nextDue;
    }

    // 构建设备/位置信息
    let eqInfo = null, flInfo = null;
    let eqCategory = '', eqGroup = '', eqName = '';
    if (eqId) {
      const eq = equipmentData.find(e => e.id === eqId);
      if (eq) {
        eqInfo = { eqId: eq.id, eqCode: eq.code, eqName: eq.name, location: eq.location, locationName: eq.locationName, bindTime: new Date().toISOString().substring(0, 19).replace('T', ' ') };
        eqCategory = eq.category || '';
        eqGroup = eq.group || '';
        eqName = eq.name;
      }
    } else if (flId) {
      const loc = locationData[flId];
      if (loc) {
        flInfo = { flId: loc.id, flName: loc.name, flType: loc.type };
        eqName = loc.name;
      }
    }

    // 关联任务清单
    const tlId = document.getElementById('pvPlanTaskList').value;
    let ops = [], parts = [], associatedTaskList = null;
    if (tlId) {
      const tl = (taskListMockData || []).find(t => t.id === tlId);
      if (tl) {
        associatedTaskList = { id: tl.id, PLNNR: tl.PLNNR, PLNAL: tl.PLNAL };
        // 从任务清单复制工序
        if (tl.operations) {
          ops = tl.operations.map((o, i) => ({
            seq: String(i + 1), content: o.LTXA1 || o.content || '', guide: o.guide || '', safety: o.safety || '',
            gmp: o.gmp || '', stdHours: String(o.ARBEIT || o.stdHours || '0.5'), operator: o.operator || '维修工'
          }));
        }
        // 从任务清单复制物料（顶层 materials 或工序内嵌 components）
        const allMaterials = [];
        if (tl.materials && tl.materials.length > 0) {
          allMaterials.push(...tl.materials.map(m => ({ MATNR: m.matCode || '', MAKTX: m.matName || m.name || '', BDMNG: m.planQty || 1, MEINS: m.unit || '个' })));
        }
        if (tl.operations) {
          tl.operations.forEach(op => {
            if (op.components && op.components.length > 0) {
              allMaterials.push(...op.components);
            }
          });
        }
        // 去重（按 MATNR）
        const seen = new Set();
        const uniqueMaterials = allMaterials.filter(m => {
          const key = m.MATNR || '';
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        if (uniqueMaterials.length > 0) {
          parts = uniqueMaterials.map(m => ({
            matCode: m.MATNR || '', matName: m.MAKTX || '', spec: '', unit: m.MEINS || '个',
            planQty: m.BDMNG || 1, isKey: false, replaceCycle: '', remark: ''
          }));
        }
      }
    }

    // 工作中心
    const wc = (wcMockData || []).find(w => w.id === wcId);
    const wcName = wc ? wc.name : '';

    // 优先级映射
    const prioMap = { normal: '一般', important: '中', critical: '高' };
    const statusMap = { active: '已生效', inactive: '已失效' };

    // 生成计划编码
    const d = new Date();
    const code = 'JH-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + (pmPlanData.length + 1).toString().padStart(3, '0');
    const newId = 'PL' + String(pmPlanData.length + 1).padStart(3, '0');

    // 构建设备列表
    const devices = eqInfo ? [eqInfo] : [];

    // 获取当前计数器和上次维护读数
    let lastReading = null, currentReading = null;
    if (strategy === 'counter') {
      const mpId = document.getElementById('pvCounterMP').value;
      if (mpId) {
        const mp = measurementPointData.find(m => m.id === mpId);
        const currentVal = document.getElementById('pvCounterCurrent').value;
        currentReading = currentVal ? parseInt(currentVal) : (mp ? mp.initialCounter : null);
        const lastVal = document.getElementById('pvCounterLastMaint').value;
        lastReading = (lastVal && lastVal !== '--') ? parseInt(lastVal) : null;
      }
    }

    // 上次维护日期
    const lastMaintenanceDate = nextDueDate || '';

    // 推入数据
    pmPlanData.push({
      id: newId, code, name: desc,
      maintenanceType: 'monthly', maintenanceTypeName: '月保养',
      eqCategory, eqGroup,
      workCenter: wcId, workCenterName: wcName,
      stdHours: '4',
      priority,
      priorityName: prioMap[priority] || '中',
      version: 'V1.0',
      effectiveDate: d.toISOString().substring(0, 10),
      expireDate: '',
      creator: '当前用户',
      creatorTime: d.toISOString().substring(0, 19).replace('T', ' '),
      reviewer: '', reviewTime: '',
      status, statusName: statusMap[status] || '已生效',
      syncSAP: false,
      remark: longText,
      ops, parts, devices, attachments: [],
      // 扩展字段
      planType, cycleValue, cycleUnit, lastMaintenanceDate, lastReading, currentReading,
      associatedTaskList,
      estimatedDuration: '0.5天',
      nextDueDate: nextDueDate || '',
      earlyGenDays: earlyDays,
      flInfo: flInfo || null
    });

    toast('维护计划已创建：' + code);
    closeModal();
    this._refreshContent();
  },

  viewPlan(id) {
    const d = pmPlanData.find(x => x.id === id); if (!d) return;
    const s = pmPlanStatusOptions.find(o => o.value === d.status);
    const ops = d.ops || [], parts = d.parts || [], devs = d.devices || [];
    const strategyLabel = d.planType === 'counter' ? '基于计数器' : d.planType === 'time' ? '基于时间' : '--';
    const cycleText = d.cycleValue ? `${d.cycleValue} ${d.cycleUnit||''}` : '--';
    const tlText = d.associatedTaskList ? `${d.associatedTaskList.PLNNR||''}` : '未关联';
    showModal(`维护计划 ${esc(d.code)}`, `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border);">
        <div>
          <div style="font-size:20px;font-weight:700;color:var(--text);">${esc(d.name||d.code)}</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">${esc(d.code)} · <span class="badge ${s?s.cls:'badge-gray'}" style="font-size:12px;">${s?s.label:d.status}</span> · <span class="badge badge-sm ${d.planType==='counter'?'badge-purple':'badge-blue'}">${strategyLabel}</span></div>
        </div>
        <div style="display:flex;gap:8px;">${d.status==='active'?`<button class="btn btn-sm" style="background:#fef3c7;color:#92400e;border:none;" onclick="MaintPreventive.disablePlan('${d.id}');closeModal();">失效</button>`:d.status==='inactive'?`<button class="btn btn-sm" style="background:#d1fae5;color:#065f46;border:none;" onclick="MaintPreventive.enablePlan('${d.id}');closeModal();">生效</button>`:''}</div>
      </div>
      <div class="detail-grid">
        <div class="detail-item"><dt>计划编码</dt><dd>${esc(d.code)}</dd></div>
        <div class="detail-item"><dt>计划描述</dt><dd>${esc(d.name)}</dd></div>
        <div class="detail-item"><dt>策略类型</dt><dd>${strategyLabel}</dd></div>
        <div class="detail-item"><dt>维护周期</dt><dd>${cycleText}</dd></div>
        <div class="detail-item"><dt>设备/位置</dt><dd>${devs.length>0?esc(devs[0].eqName):(d.flInfo?esc(d.flInfo.flName):'--')}</dd></div>
        <div class="detail-item"><dt>工作中心</dt><dd>${esc(d.workCenterName)}</dd></div>
        <div class="detail-item"><dt>关联任务清单</dt><dd>${tlText}</dd></div>
        <div class="detail-item"><dt>优先级</dt><dd>${esc(d.priorityName||d.priority)}</dd></div>
        <div class="detail-item"><dt>提前生成天数</dt><dd>${d.earlyGenDays||7} 天</dd></div>
        <div class="detail-item"><dt>版本</dt><dd>${esc(d.version)}</dd></div>
        <div class="detail-item"><dt>创建人</dt><dd>${esc(d.creator)}</dd></div>
        <div class="detail-item"><dt>创建时间</dt><dd>${esc(d.creatorTime)}</dd></div>
      </div>
      ${d.remark?`<div style="margin-top:12px;background:#f8fafc;border-radius:8px;padding:16px;"><div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--text-secondary);">长文本</div><div style="font-size:13px;line-height:1.6;">${esc(d.remark)}</div></div>`:''}
      ${ops.length>0?`
        <div style="margin-top:14px;"><div style="font-weight:600;font-size:13px;margin-bottom:8px;">作业工序 (${ops.length})</div>
        <table class="data-table" style="font-size:12px;"><thead><tr><th>#</th><th>工序内容</th><th>标准工时</th><th>操作人</th></tr></thead>
        <tbody>${ops.map((o,i)=>`<tr><td>${i+1}</td><td>${esc(o.content)}</td><td>${esc(o.stdHours)}h</td><td>${esc(o.operator||'维修工')}</td></tr>`).join('')}</tbody></table></div>`:''}
      ${parts.length>0?`
        <div style="margin-top:14px;"><div style="font-weight:600;font-size:13px;margin-bottom:8px;">所需备件 (${parts.length})</div>
        <table class="data-table" style="font-size:12px;"><thead><tr><th>物料编码</th><th>名称</th><th>数量</th></tr></thead>
        <tbody>${parts.map(p=>`<tr><td>${esc(p.matCode)}</td><td>${esc(p.matName)}</td><td>${esc(p.planQty)} ${esc(p.unit)}</td></tr>`).join('')}</tbody></table></div>`:''}
    `, [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-lg');
  },

  enablePlan(id) {
    showModal('生效计划', '确定生效该维护计划？生效后可用于调度配置。', [
      { text: '取消', action: closeModal, cls: 'btn-secondary' },
      { text: '确认生效', action: () => { closeModal(); const p = pmPlanData.find(x => x.id === id); if (p) { p.status = 'active'; p.statusName = '已生效'; } this._refreshContent(); toast('计划已生效'); }, cls: 'btn-primary' }
    ]);
  },

  disablePlan(id) {
    showModal('失效计划', '失效后关联的调度方案将不生成新工单，确定失效？', [
      { text: '取消', action: closeModal, cls: 'btn-secondary' },
      { text: '确认失效', action: () => { closeModal(); const p = pmPlanData.find(x => x.id === id); if (p) { p.status = 'inactive'; p.statusName = '已失效'; } this._refreshContent(); toast('计划已失效'); }, cls: 'btn-primary' }
    ]);
  },

  copyPlan(id) {
    const src = pmPlanData.find(x => x.id === id); if (!src) return;
    const d = new Date();
    const code = 'JH-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + (pmPlanData.length + 1).toString().padStart(3, '0');
    const n = JSON.parse(JSON.stringify(src));
    n.id = 'PL' + (pmPlanData.length + 1).toString().padStart(3, '0'); n.code = code; n.name = src.name + '（副本）';
    n.status = 'active'; n.statusName = '已生效'; n.version = 'V1.0'; n.creator = '当前用户';
    n.creatorTime = d.toISOString().substring(0, 19).replace('T', ' ');
    pmPlanData.push(n);
    toast('已复制为新计划：' + code); this._refreshContent();
  },

  // ======================== TAB 2: 计划调度 ========================
  _renderScheduleTab() {
    const f = this.sFilter;
    let data = [...pmScheduleData];
    if (f.code) data = data.filter(d => d.code.toLowerCase().includes(f.code.toLowerCase()));
    if (f.planName) data = data.filter(d => d.planName.toLowerCase().includes(f.planName.toLowerCase()));
    if (f.triggerType) data = data.filter(d => d.triggerType === f.triggerType);
    if (f.status) data = data.filter(d => d.status === f.status);
    const total = data.length, totalPages = Math.ceil(total / this.pageSize);
    const start = (this.page - 1) * this.pageSize, pageData = data.slice(start, start + this.pageSize);
    const trigOpts = pmTriggerTypes.map(o => `<option value="${o.value}" ${f.triggerType===o.value?'selected':''}>${o.label}</option>`).join('');
    const sOpts = pmScheduleStatusOptions.map(o => `<option value="${o.value}" ${f.status===o.value?'selected':''}>${o.label}</option>`).join('');
    const pagerHtml = this._renderPagination(total, totalPages);

    return `<div style="padding:16px 24px;display:flex;flex-direction:column;height:100%;">
      <div class="filter-bar">
        <div class="filter-group"><label>调度编码</label><input type="text" value="${esc(f.code)}" onchange="MaintPreventive.sFilter.code=this.value;MaintPreventive.searchSchedule()" placeholder="调度编码"></div>
        <div class="filter-group"><label>关联计划</label><input type="text" value="${esc(f.planName)}" onchange="MaintPreventive.sFilter.planName=this.value;MaintPreventive.searchSchedule()" placeholder="计划名称"></div>
        <div class="filter-group"><label>触发类型</label><select onchange="MaintPreventive.sFilter.triggerType=this.value;MaintPreventive.searchSchedule()"><option value="">全部</option>${trigOpts}</select></div>
        <div class="filter-group"><label>状态</label><select onchange="MaintPreventive.sFilter.status=this.value;MaintPreventive.searchSchedule()"><option value="">全部</option>${sOpts}</select></div>
        <div class="filter-actions"><button class="btn btn-primary btn-sm" onclick="MaintPreventive.searchSchedule()">查询</button><button class="btn btn-secondary btn-sm" onclick="MaintPreventive.resetScheduleFilter()">重置</button></div>
      </div>
      <div class="table-wrapper" style="flex:1;overflow:auto;margin-top:12px;"><table class="data-table"><thead><tr>
        <th>调度编码</th><th>关联维护计划</th><th>触发类型</th><th>执行频率</th><th>覆盖设备</th><th>状态</th><th>最近生成</th><th>下次预计</th><th>操作</th>
      </tr></thead><tbody>${pageData.map(d => {
        const s = pmScheduleStatusOptions.find(o => o.value === d.status);
        const tt = pmTriggerTypes.find(o => o.value === d.triggerType);
        let freqText = d.frequency || '-';
        if (d.triggerType === 'hours') freqText = '每 ' + d.runHours + ' 小时';
        else if (d.triggerType === 'counter') freqText = '累计 ' + d.triggerCount + ' 次';
        else if (d.triggerType === 'combined') freqText = d.frequency + ' + ' + d.runHours + 'h';
        return `<tr>
          <td><strong>${esc(d.code)}</strong></td>
          <td style="font-size:12px;">${esc(d.planName)}<br><span style="color:var(--text-muted);">${esc(d.planCode)}</span></td>
          <td><span class="badge badge-sm ${d.triggerType==='time'?'badge-blue':d.triggerType==='hours'?'badge-green':d.triggerType==='counter'?'badge-purple':'badge-orange'}">${tt?tt.label:d.triggerType}</span></td>
          <td style="font-size:12px;">${freqText}</td>
          <td>${d.deviceCount} 台</td>
          <td><span class="badge ${s?s.cls:'badge-gray'}">${s?s.label:d.status}</span></td>
          <td style="font-size:12px;">${d.lastGenTime?d.lastGenTime.substring(0,10):'-'}</td>
          <td style="font-size:12px;">${d.nextGenTime?d.nextGenTime.substring(0,10):'-'}</td>
          <td class="table-actions">${this._scheduleRowActions(d)}</td>
        </tr>`;
      }).join('')}</tbody></table></div>
      ${pagerHtml}
    </div>`;
  },

  _scheduleRowActions(d) {
    return `<button class="btn btn-blue btn-sm" onclick="MaintPreventive.viewSchedule('${d.id}')">查看</button>`;
  },

  searchSchedule() { this.page = 1; this._refreshContent(); },
  resetScheduleFilter() { this.sFilter = { code: '', planName: '', triggerType: '', status: '' }; this.page = 1; this._refreshContent(); },

  createSchedule() {
    const planOpts = pmPlanData.filter(p => p.status === 'active').map(p => `<option value="${p.id}">${p.code} | ${p.name}</option>`).join('');
    showModal('新增调度方案', `
      <div class="form-grid">
        <div class="form-group"><label>关联维护计划<span class="req">*</span></label><select id="pvSchedPlan">${planOpts||'<option>暂无生效计划</option>'}</select></div>
        <div class="form-group"><label>调度名称<span class="req">*</span></label><input type="text" id="pvSchedName" placeholder="便于区分管理"></div>
        <div class="form-group"><label>触发类型</label><select id="pvSchedTrig">${pmTriggerTypes.map(o=>'<option value="'+o.value+'">'+o.label+'</option>').join('')}</select></div>
        <div class="form-group"><label>执行周期</label><input type="text" id="pvSchedFreq" value="每月" placeholder="如：每月、每季度"></div>
        <div class="form-group"><label>执行日期(号)</label><input type="number" id="pvSchedDay" value="1" min="1" max="31"></div>
        <div class="form-group"><label>执行时间</label><input type="time" id="pvSchedTime" value="08:00"></div>
        <div class="form-group"><label>允许提前(天)</label><input type="number" id="pvSchedEarly" value="3" min="0"></div>
        <div class="form-group"><label>允许延后(天)</label><input type="number" id="pvSchedLate" value="2" min="0"></div>
        <div class="form-group"><label>负责人</label><input type="text" id="pvSchedOwner" value="孙部长"></div>
        <div class="form-group"><label>部门</label><input type="text" id="pvSchedDept" value="设备部"></div>
      </div>
    `, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '创建', cls: 'btn-primary', action: () => {
        const planId = document.getElementById('pvSchedPlan').value;
        const name = document.getElementById('pvSchedName').value.trim();
        if (!planId || !name) { toast('请选择维护计划并输入调度名称！'); return; }
        const plan = pmPlanData.find(p => p.id === planId);
        pmScheduleData.push({
          id: 'SC' + String(pmScheduleData.length + 1).padStart(3, '0'),
          code: 'DD-' + new Date().toISOString().substring(0, 10).replace(/-/g, '') + '-' + String(pmScheduleData.length + 1).padStart(3, '0'),
          planId, planCode: plan ? plan.code : '', planName: plan ? plan.name : '', planType: plan ? plan.maintenanceType : 'monthly',
          scheduleName: name, triggerType: document.getElementById('pvSchedTrig').value, triggerTypeName: document.getElementById('pvSchedTrig').selectedOptions[0].text,
          frequency: document.getElementById('pvSchedFreq').value, execDay: parseInt(document.getElementById('pvSchedDay').value),
          execTime: document.getElementById('pvSchedTime').value, allowEarlyDays: parseInt(document.getElementById('pvSchedEarly').value),
          allowLateDays: parseInt(document.getElementById('pvSchedLate').value), deviceCount: 0, status: 'draft', statusName: '草稿',
          lastGenTime: '', nextGenTime: '', startDate: '', endDate: '', owner: document.getElementById('pvSchedOwner').value,
          dept: document.getElementById('pvSchedDept').value, autoDispatch: true, autoPickRemind: true
        });
        toast('调度方案已创建');
        closeModal(); this._refreshContent();
      }}
    ]);
  },

  activateSchedule(id) {
    showModal('启用调度', '确定启用该调度方案？启用后将按规则自动生成工单。', [
      { text: '取消', action: closeModal, cls: 'btn-secondary' },
      { text: '确认启用', action: () => { closeModal(); const s = pmScheduleData.find(x => x.id === id); if (s) { s.status = 'active'; s.statusName = '已启用'; } this._refreshContent(); toast('调度已启用'); }, cls: 'btn-primary' }
    ]);
  },

  pauseSchedule(id) {
    showModal('暂停调度', '暂停后不再自动生成工单，可随时恢复。', [
      { text: '取消', action: closeModal, cls: 'btn-secondary' },
      { text: '确认暂停', action: () => { closeModal(); const s = pmScheduleData.find(x => x.id === id); if (s) { s.status = 'paused'; s.statusName = '已暂停'; } this._refreshContent(); toast('调度已暂停'); }, cls: 'btn-primary' }
    ]);
  },

  stopSchedule(id) {
    showModal('终止调度', '终止后永久停止，无法恢复。确定终止？', [
      { text: '取消', action: closeModal, cls: 'btn-secondary' },
      { text: '确认终止', action: () => { closeModal(); const s = pmScheduleData.find(x => x.id === id); if (s) { s.status = 'stopped'; s.statusName = '已终止'; } this._refreshContent(); toast('调度已终止'); }, cls: 'btn-primary' }
    ]);
  },

  viewScheduleLog(id) {
    this.switchTab('auto');
  },

  // ======================== TAB 3: 工单生成日志 ========================
  _renderAutoTab() {
    // Stats
    const pendingCount = pmGenLogData.filter(d => d.result === 'pending').length;
    const successCount = pmGenLogData.filter(d => d.result === 'success').length;
    const failedCount = pmGenLogData.filter(d => d.result === 'failed').length;
    const todayPending = pmGenLogData.filter(d => d.result === 'pending' && d.planGenTime && d.planGenTime.substring(0, 10) <= new Date().toISOString().substring(0, 10)).length;

    const f = this.aFilter;
    let data = [...pmGenLogData];
    if (f.scheduleId) data = data.filter(d => d.scheduleId === f.scheduleId);
    if (f.eqInfo) data = data.filter(d => d.eqCode.toLowerCase().includes(f.eqInfo.toLowerCase()) || d.eqName.toLowerCase().includes(f.eqInfo.toLowerCase()));
    if (f.result) data = data.filter(d => d.result === f.result);
    const total = data.length, totalPages = Math.ceil(total / this.pageSize);
    const start = (this.page - 1) * this.pageSize, pageData = data.slice(start, start + this.pageSize);

    const schedOpts = pmScheduleData.map(s => `<option value="${s.id}" ${f.scheduleId===s.id?'selected':''}>${s.scheduleName}</option>`).join('');
    const resOpts = pmGenStatusOptions.map(o => `<option value="${o.value}" ${f.result===o.value?'selected':''}>${o.label}</option>`).join('');
    const pagerHtml = this._renderPagination(total, totalPages);

    return `<div style="padding:16px 24px;display:flex;flex-direction:column;height:100%;">
      <div class="stats-row" style="margin-bottom:16px;display:flex;gap:16px;">
        <div class="stat-card" style="flex:1;padding:16px;background:white;border:1px solid var(--border);border-radius:10px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#3B82F6;">${todayPending}</div><div style="font-size:12px;color:var(--text-secondary);">今日待生成</div></div>
        <div class="stat-card" style="flex:1;padding:16px;background:white;border:1px solid var(--border);border-radius:10px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#10B981;">${successCount}</div><div style="font-size:12px;color:var(--text-secondary);">已成功生成</div></div>
        <div class="stat-card" style="flex:1;padding:16px;background:white;border:1px solid var(--border);border-radius:10px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#DC2626;">${failedCount}</div><div style="font-size:12px;color:var(--text-secondary);">生成失败</div></div>
        <div class="stat-card" style="flex:1;padding:16px;background:white;border:1px solid var(--border);border-radius:10px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#F59E0B;">${pendingCount}</div><div style="font-size:12px;color:var(--text-secondary);">待补单数量</div></div>
      </div>
      <div class="filter-bar">
        <div class="filter-group"><label>调度方案</label><select onchange="MaintPreventive.aFilter.scheduleId=this.value;MaintPreventive.searchAuto()"><option value="">全部方案</option>${schedOpts}</select></div>
        <div class="filter-group"><label>设备</label><input type="text" value="${esc(f.eqInfo)}" onchange="MaintPreventive.aFilter.eqInfo=this.value;MaintPreventive.searchAuto()" placeholder="编码/名称"></div>
        <div class="filter-group"><label>生成状态</label><select onchange="MaintPreventive.aFilter.result=this.value;MaintPreventive.searchAuto()"><option value="">全部</option>${resOpts}</select></div>
        <div class="filter-actions"><button class="btn btn-primary btn-sm" onclick="MaintPreventive.searchAuto()">查询</button><button class="btn btn-secondary btn-sm" onclick="MaintPreventive.resetAutoFilter()">重置</button></div>
      </div>
      <div class="table-wrapper" style="flex:1;overflow:auto;margin-top:12px;"><table class="data-table"><thead><tr>
        <th>调度方案</th><th>设备</th><th>计划生成时间</th><th>实际生成时间</th><th>生成结果</th><th>工单编号</th><th>失败原因</th><th>操作</th>
      </tr></thead><tbody>${pageData.map(d => {
        const rs = pmGenStatusOptions.find(o => o.value === d.result);
        return `<tr>
          <td style="font-size:12px;">${esc(d.scheduleName)}<br><span style="color:var(--text-muted);">${esc(d.scheduleCode)}</span></td>
          <td style="font-size:12px;">${esc(d.eqCode)}<br><span style="color:var(--text-muted);">${esc(d.eqName)}</span></td>
          <td style="font-size:12px;">${d.planGenTime?d.planGenTime.substring(0,10):'-'}</td>
          <td style="font-size:12px;">${d.actualGenTime?d.actualGenTime.substring(0,16):'-'}</td>
          <td><span class="badge ${rs?rs.cls:'badge-gray'}">${rs?rs.label:d.result}</span></td>
          <td>${d.orderCode?`<strong style="color:var(--primary-lighter);cursor:pointer;" onclick="App.navigateTo('maintenance-flow','mf-workorder','mf-workorder','维修工单管理')">${esc(d.orderCode)}</strong>`:'<span style="color:var(--text-muted);">-</span>'}</td>
          <td style="font-size:11px;color:var(--danger);max-width:200px;">${esc(d.failReason||'-')}</td>
          <td class="table-actions">${d.result==='failed'?`<button class="btn btn-blue btn-sm" onclick="MaintPreventive.retryGen('${d.id}')">重试</button>`:d.result==='pending'?`<button class="btn btn-sm" style="background:#d1fae5;color:#065f46;border:none;" onclick="MaintPreventive.triggerGen('${d.id}')">触发生成</button>`:`<span style="color:var(--text-muted);">-</span>`}</td>
        </tr>`;
      }).join('')}</tbody></table></div>
      ${pagerHtml}
    </div>`;
  },

  searchAuto() { this.page = 1; this._refreshContent(); },
  resetAutoFilter() { this.aFilter = { scheduleId: '', eqInfo: '', result: '' }; this.page = 1; this._refreshContent(); },

  manualGen() {
    const schedOpts = pmScheduleData.filter(s => s.status === 'active').map(s => `<option value="${s.id}">${s.scheduleName} (${s.planCode})</option>`).join('');
    if (!schedOpts) { toast('没有可用的调度方案，请先启用调度！'); return; }
    showModal('手动批量生成工单', `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div class="form-group"><label>选择调度方案<span class="req">*</span></label><select id="mgSchedule">${schedOpts}</select></div>
        <div class="form-group"><label>生成范围</label><select id="mgScope"><option value="all">全部设备</option><option value="selected">指定设备</option></select></div>
        <div class="form-group"><label>生成周期</label><select id="mgPeriod"><option value="current">本次单次补单</option><option value="backlog">补全往期漏单</option></select></div>
      </div>
      <div style="margin-top:12px;padding:8px 12px;background:#f0fdf4;border-radius:6px;font-size:13px;color:#166534;">
        ⏳ 系统将根据调度方案的触发规则，自动生成对应设备的预防性维护工单（状态：编辑中）。
      </div>
    `, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '执行生成', cls: 'btn-primary', action: () => {
        const sid = document.getElementById('mgSchedule').value;
        const sched = pmScheduleData.find(s => s.id === sid);
        if (!sched) return;
        const plan = pmPlanData.find(p => p.id === sched.planId);
        if (!plan) { toast('未找到关联的维护计划！'); return; }
        const result = this._createPMWorkOrder(plan, sched, true, false);
        if (result.success) {
          toast(`✅ 工单 ${result.AUFNR} 已生成！（计划：${plan.name}，设备：${result.eqName}）`);
        } else if (result.blocked) {
          toast(`⚠ 该计划已有工单 ${result.AUFNR}，如需强制生成请从计划列表操作`);
        } else {
          toast(`❌ 生成失败：${result.msg}`);
        }
        closeModal(); this._refreshContent();
      }}
    ]);
  },

  batchReplenish() {
    // 批量补单：扫描所有漏单 -> 使用自动扫描逻辑
    this.runDailyAutoGen();
  },
  retryGen(id) {
    const log = pmGenLogData.find(x => x.id === id);
    if (!log) return;
    const sched = pmScheduleData.find(s => s.id === log.scheduleId);
    const plan = pmPlanData.find(p => p.id === (sched ? sched.planId : ''));
    if (!plan && sched) {
      toast('未找到关联的维护计划！'); return;
    }
    const result = this._createPMWorkOrder(plan, sched, true, true);
    if (result.success) {
      log.result = 'success'; log.resultName = '生成成功';
      log.orderCode = result.AUFNR; log.orderId = result.id;
      log.actualGenTime = new Date().toISOString().substring(0, 19).replace('T', ' ');
      log.failReason = '';
      toast(`✅ 重新生成成功！工单 ${result.AUFNR}`);
    } else {
      toast(`❌ 重新生成失败：${result.msg}`);
    }
    this._refreshContent();
  },
  triggerGen(id) {
    const log = pmGenLogData.find(x => x.id === id);
    if (!log) return;
    const sched = pmScheduleData.find(s => s.id === log.scheduleId);
    const plan = sched ? pmPlanData.find(p => p.id === sched.planId) : null;
    if (!plan) { toast('未找到关联的维护计划！'); return; }
    const result = this._createPMWorkOrder(plan, sched, true, false);
    if (result.success) {
      log.result = 'success'; log.resultName = '生成成功';
      log.orderCode = result.AUFNR; log.orderId = result.id;
      log.actualGenTime = new Date().toISOString().substring(0, 19).replace('T', ' ');
      log.operator = '当前用户';
      toast(`✅ 工单 ${result.AUFNR} 已生成！`);
    } else if (result.blocked) {
      toast(`⚠ 该计划已有工单 ${result.AUFNR}`);
    } else {
      toast(`❌ 生成失败：${result.msg}`);
    }
    this._refreshContent();
  },

  // ======================== 配置 & 工单生成引擎 (PRD §2~§3) ========================
  _genConfig: {
    earlyGenDays: 7,        // 时间型提前生成天数，默认7天
    defaultStatus: 'REL',   // REL=已审批待执行, APPR=待审批
    defaultPriority: '2-中', // 默认优先级
    creatorId: '系统自动',   // 自动生成时的创建人
  },

  /* ---- 防重检查 (PRD §2.1) ----
   * 检查同一计划是否已有未关闭的 PM01 工单
   * 返回：{ blocked: bool, existingAUFNR, reason }
   */
  _checkDuplicateOrder(planId) {
    const plan = pmPlanData.find(p => p.id === planId);
    if (!plan) return { blocked: false };
    // 查找该计划已生成且未关闭的工单（非 CLSD 状态即为未关闭）
    const existing = workOrderV2Data.find(wo =>
      wo.AUART === 'PM01' &&
      wo.sourceNo === plan.code &&
      wo.STAT !== 'CLSD'
    );
    if (existing) {
      return { blocked: true, existingAUFNR: existing.AUFNR, existingId: existing.id,
        reason: `维护计划 ${plan.code} 已有未关闭工单 ${existing.AUFNR}（状态：${existing.STAT_TXT}）` };
    }
    return { blocked: false };
  },

  /* ---- 判断时间型调度是否应生成 (PRD §2.1) ----
   * 下次到期日 ≤ 今天 + 提前生成天数
   */
  _shouldGenByTime(schedule) {
    const cfg = this._genConfig;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const deadline = new Date(today);
    deadline.setDate(deadline.getDate() + cfg.earlyGenDays);
    if (!schedule.nextGenTime) return false;
    const nextGen = new Date(schedule.nextGenTime);
    return nextGen <= deadline;
  },

  /* ---- 判断计数器型调度是否应生成 (PRD §2.1) ----
   * 当前计数器读数 ≥ 上次维护完成时的读数 + 维护间隔
   * 从测量点数据中获取当前计数器值
   */
  _shouldGenByCounter(schedule, plan) {
    if (!schedule.runHours || !schedule.currentHours) return false;
    // 上次维护完成时的读数：从上次成功生成的日志推算
    const lastGenLog = pmGenLogData
      .filter(g => g.scheduleId === schedule.id && g.result === 'success')
      .sort((a, b) => new Date(b.genTime) - new Date(a.genTime))[0];
    const lastCounter = lastGenLog ? (lastGenLog._lastCounterValue || schedule.initHours) : schedule.initHours;
    // 当前计数器值
    const devs = plan.devices || [];
    let currentCounter = schedule.currentHours;
    if (devs.length > 0) {
      // 尝试从测量记录获取最新计数器读数
      const eqId = devs[0].eqId;
      const counterMp = measurementPointData.find(mp =>
        mp.equipmentId === eqId && mp.isCounter === true);
      if (counterMp) {
        const lastRec = measurementRecordData
          .filter(r => r.measurementPointId === counterMp.id)
          .sort((a, b) => new Date(b.recordTime) - new Date(a.recordTime))[0];
        if (lastRec && lastRec.quantitativeValue !== null && lastRec.quantitativeValue !== undefined) {
          currentCounter = lastRec.quantitativeValue;
        }
      }
    }
    return (currentCounter - lastCounter) >= schedule.runHours;
  },

  /* ---- 核心：生成 PM01 工单 (PRD §3) ----
   * 参数：
   *   plan    - pmPlanData 项
   *   schedule - pmScheduleData 项（可为 null，手动生成时无调度）
   *   isManual - 是否手动触发
   *   force    - 是否强制生成（忽略防重）
   * 返回：{ success, AUFNR, id, msg }
   */
  _createPMWorkOrder(plan, schedule, isManual, force) {
    const cfg = this._genConfig;
    const now = new Date();
    const nowStr = now.toLocaleString('zh-CN');

    // 1) 防重检查（非强制时）
    if (!force) {
      const dup = this._checkDuplicateOrder(plan.id);
      if (dup.blocked) return { success: false, AUFNR: dup.existingAUFNR, msg: dup.reason, blocked: true };
    }

    // 2) 确定设备
    const devs = plan.devices || [];
    if (devs.length === 0) return { success: false, msg: '计划未关联任何设备，无法生成工单' };
    const dev = devs[0];
    const eq = equipmentData.find(e => e.id === dev.eqId);
    if (!eq) return { success: false, msg: `未找到设备 ${dev.eqCode}` };

    // 3) 生成工单号
    const maxNum = workOrderV2Data.reduce((max, wo) => {
      const n = parseInt(wo.AUFNR.replace('O', ''));
      return n > max ? n : max;
    }, 0);
    const AUFNR = 'O' + String(maxNum + 1).padStart(7, '0');
    const woId = 'WO' + String(workOrderV2Data.length + 1).padStart(5, '0');

    // 4) 计算计划日期
    const startDate = schedule && schedule.nextGenTime
      ? new Date(schedule.nextGenTime)
      : new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); // 默认明天
    const stdHours = parseFloat(plan.stdHours) || 4;
    const endDate = new Date(startDate.getTime() + Math.ceil(stdHours / 8) * 24 * 60 * 60 * 1000);
    const fmt = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' +
      String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    const startStr = fmt(startDate);
    const endStr = fmt(endDate);

    // 5) 构建描述
    const desc = `[${plan.name}] - ${eq.name}`;
    const priority = plan.priority === 'critical' ? '1-高' : plan.priority === 'important' ? '2-中' : cfg.defaultPriority;

    // 6) 确定任务清单号
    const taskListNo = plan.ops && plan.ops.length > 0 ? ('TL' + String(parseInt(plan.code.replace(/[^0-9]/g, '').substring(0, 6) || '1')).padStart(4, '0')) : '';

    // 7) 状态映射
    const orderStatus = isManual ? 'APPR' : cfg.defaultStatus; // 手动生成→待审批，自动→配置项
    const statLabel = orderStatus === 'APPR' ? '待审批' : '已审批/待执行';

    // 8) 推入数据
    workOrderV2Data.push({
      id: woId, AUFNR, AUART: 'PM01', AUART_TXT: 'PM01 - 预防性维护工单',
      EQUNR: eq.code, EQKTX: eq.name,
      KURZTEXT: desc, PRIOK: priority, STAT: orderStatus, STAT_TXT: statLabel,
      GSTRP: startStr, GLTRP: endStr, PERNR: isManual ? '当前用户' : '',
      sourceNo: plan.code, taskListNo,
      faultPhenomenon: '', faultCause: '', solution: '',
      safetyMeasures: '',
      acceptancePerson: '', acceptanceTime: '', acceptanceResult: '',
      createdBy: isManual ? '当前用户' : cfg.creatorId,
      createdAt: nowStr, updatedAt: nowStr,
      // 扩展字段
      _planId: plan.id, _scheduleId: schedule ? schedule.id : '',
      _planCode: plan.code, _planName: plan.name
    });

    // 9) 如果计划有工序，复制到 operationV2Data
    if (plan.ops && plan.ops.length > 0) {
      plan.ops.forEach(op => {
        operationV2Data.push({
          orderId: woId, VORNR: String(op.seq).padStart(4, '0'),
          LTXA1: op.content, ARBPL: plan.workCenterName || '维修一班',
          ARBEIT: parseFloat(op.stdHours) || 1.0, ISMNW: '',
          status: 'pending', feedback: ''
        });
      });
    }

    // 10) 记录生成日志
    const logId = 'GL' + String(pmGenLogData.length + 1).padStart(3, '0');
    pmGenLogData.push({
      id: logId, scheduleId: schedule ? schedule.id : '', scheduleCode: schedule ? schedule.code : '',
      scheduleName: schedule ? schedule.scheduleName : '手动生成',
      genType: isManual ? 'manual' : 'auto', genTypeName: isManual ? '手动' : '自动',
      eqCode: eq.code, eqName: eq.name,
      planGenTime: schedule && schedule.nextGenTime ? schedule.nextGenTime : startStr,
      actualGenTime: startStr, result: 'success', resultName: '生成成功',
      orderCode: AUFNR, orderId: woId, failReason: '',
      operator: isManual ? '当前用户' : cfg.creatorId, genTime: now.toISOString().substring(0, 19).replace('T', ' ')
    });

    // 11) 更新调度 lastGenTime
    if (schedule) {
      schedule.lastGenTime = now.toISOString().substring(0, 19).replace('T', ' ');
    }

    // 12) 推送待办通知
    if (window.App && App.notifications) {
      App.notifications.unshift({
        id: Date.now(),
        type: 'info', icon: '🔧',
        title: `维护计划 ${plan.code} 已${isManual ? '手动' : '自动'}生成工单 ${AUFNR}`,
        desc: `设备：${eq.name}，计划：${plan.name}`,
        time: nowStr.substring(0, 16),
        read: false
      });
      App._updateNotifyBadge();
    }

    return { success: true, AUFNR, id: woId, logId, eqName: eq.name, eqCode: eq.code };
  },

  /* ---- 手动生成工单 (PRD §2.2 + §4.2) ---- */
  manualGenOrder(planId) {
    const plan = pmPlanData.find(p => p.id === planId);
    if (!plan) return;
    if (plan.status !== 'active') { toast('只有"已生效"的计划可以生成工单！'); return; }

    // 找到关联调度
    const sched = pmScheduleData.find(s => s.planId === planId && s.status === 'active');

    // 防重检查
    const dup = this._checkDuplicateOrder(planId);
    const cfg = this._genConfig;

    // 设备信息
    const devs = plan.devices || [];
    const eq = devs.length > 0 ? equipmentData.find(e => e.id === devs[0].eqId) : null;

    // 预览信息
    const startDate = sched && sched.nextGenTime ? sched.nextGenTime.substring(0, 10) : new Date(Date.now() + 86400000).toISOString().substring(0, 10);
    const priority = plan.priority === 'critical' ? '1-高' : plan.priority === 'important' ? '2-中' : cfg.defaultPriority;

    showModal('生成预防性维护工单', `
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px;margin-bottom:16px;">
        <div style="font-size:14px;font-weight:700;margin-bottom:8px;">📋 工单预览</div>
        <table style="width:100%;font-size:13px;">
          <tr><td style="padding:4px 8px;color:var(--text-secondary);width:80px;">类型</td><td style="font-weight:600;">PM01 - 预防性维护工单</td></tr>
          <tr><td style="padding:4px 8px;color:var(--text-secondary);">计划</td><td>${esc(plan.code)} ${esc(plan.name)}</td></tr>
          <tr><td style="padding:4px 8px;color:var(--text-secondary);">设备</td><td>${eq ? esc(eq.code) + ' | ' + esc(eq.name) : '（未关联设备）'}</td></tr>
          <tr><td style="padding:4px 8px;color:var(--text-secondary);">优先级</td><td><span class="badge ${priority==='1-高'?'badge-red':'badge-yellow'}">${priority}</span></td></tr>
          <tr><td style="padding:4px 8px;color:var(--text-secondary);">工序数</td><td>${(plan.ops||[]).length} 道工序</td></tr>
          <tr><td style="padding:4px 8px;color:var(--text-secondary);">状态</td><td><span class="badge badge-yellow">APPR - 待审批</span></td></tr>
          <tr><td style="padding:4px 8px;color:var(--text-secondary);">描述</td><td style="font-size:12px;">[${esc(plan.name)}] - ${eq ? esc(eq.name) : '未知设备'}</td></tr>
        </table>
      </div>
      ${dup.blocked ? `
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px;margin-bottom:12px;">
        <div style="font-size:13px;color:#991b1b;">⚠ ${esc(dup.reason)}</div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-secondary);">您仍可强制生成新工单，但不建议重复操作。</div>
      </div>` : `
      <div style="color:var(--text-secondary);font-size:12px;margin-bottom:12px;">确认后将立即生成工单，附带计划中配置的工序及备件清单。</div>`}
    `, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: dup.blocked ? '强制生成' : '确认生成', cls: 'btn-primary',
        action: () => {
          const result = this._createPMWorkOrder(plan, sched, true, dup.blocked);
          if (result.success) {
            toast(`✅ 工单 ${result.AUFNR} 已生成！（计划：${plan.name}，设备：${result.eqName}）`);
          } else if (result.blocked) {
            toast(`⚠ 该计划已有工单 ${result.AUFNR}，生成被阻止`);
          } else {
            toast(`❌ 生成失败：${result.msg}`);
          }
          closeModal(); this._refreshContent();
        }
      }
    ]);
  },

  /* ---- 自动扫描：从单个调度判断并生成 (PRD §2.1) ---- */
  _autoGenFromSchedule(schedule) {
    const plan = pmPlanData.find(p => p.id === schedule.planId);
    if (!plan || plan.status !== 'active') return null;
    if (schedule.status !== 'active') return null;

    let shouldGen = false;
    if (schedule.triggerType === 'time') {
      shouldGen = this._shouldGenByTime(schedule);
    } else if (schedule.triggerType === 'hours') {
      shouldGen = this._shouldGenByCounter(schedule, plan);
    } else if (schedule.triggerType === 'combined') {
      shouldGen = this._shouldGenByTime(schedule) && this._shouldGenByCounter(schedule, plan);
    }

    if (!shouldGen) return { action: 'skipped', reason: '未到达生成条件' };

    // 防重
    const dup = this._checkDuplicateOrder(plan.id);
    if (dup.blocked) return { action: 'skipped', reason: dup.reason };

    const result = this._createPMWorkOrder(plan, schedule, false, false);
    return result;
  },

  /* ---- 一键扫描：对所有活跃调度执行自动生成 ---- */
  runDailyAutoGen() {
    const activeSchedules = pmScheduleData.filter(s => s.status === 'active');
    if (activeSchedules.length === 0) { toast('没有活跃的调度方案！'); return; }

    let created = 0, skipped = 0, failed = 0;
    const results = [];

    activeSchedules.forEach(schedule => {
      const r = this._autoGenFromSchedule(schedule);
      if (!r) return;
      results.push(r);
      if (r.success) created++;
      else if (r.action === 'skipped') skipped++;
      else failed++;
    });

    let msg = `扫描完成：${activeSchedules.length} 个调度方案`;
    if (created > 0) msg += `\n✅ 已生成 ${created} 条新工单`;
    if (skipped > 0) msg += `\n⏭ 跳过 ${skipped} 条（不满足条件或已存在未关闭工单）`;
    if (failed > 0) msg += `\n❌ 失败 ${failed} 条`;
    if (created === 0 && failed === 0) msg += '\n📭 当前无符合条件的计划';

    showModal('一键扫描生成结果', `
      <div style="padding:8px 0;">
        ${results.map(r => `
          <div style="padding:8px 12px;margin-bottom:6px;border-radius:6px;font-size:13px;
            background:${r.success?'#f0fdf4':r.action==='skipped'?'#f8fafc':'#fef2f2'};
            border:1px solid ${r.success?'#bbf7d0':r.action==='skipped'?'#e2e8f0':'#fecaca'};">
            ${r.success
              ? `✅ <b>${r.AUFNR}</b> — ${esc(r.eqName)}（${esc(r.eqCode)}）`
              : r.action === 'skipped'
              ? `⏭ ${esc(r.reason||'已跳过')}`
              : `❌ ${esc(r.msg||'生成失败')}`}
          </div>`).join('')}
      </div>
    `, [
      { text: '关闭', cls: 'btn-secondary', action: () => { closeModal(); this._refreshContent(); } }
    ]);
  },

  // ======================== TAB 4: 计划执行日历 ========================
  _renderCalendarTab() {
    const year = this.calYear, month = this.calMonth;
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const weekLabels = ['日', '一', '二', '三', '四', '五', '六'];

    // Gather schedule events
    const events = [];
    pmScheduleData.filter(s => s.status === 'active').forEach(s => {
      const nextDate = s.nextGenTime ? new Date(s.nextGenTime) : null;
      if (nextDate && nextDate.getFullYear() === year && nextDate.getMonth() === month - 1) {
        events.push({ day: nextDate.getDate(), type: 'schedule', label: s.scheduleName, plan: s.planName, trigger: s.triggerTypeName });
      }
    });
    // Gather pending gen logs
    pmGenLogData.filter(g => g.result === 'pending').forEach(g => {
      const genDate = g.planGenTime ? new Date(g.planGenTime) : null;
      if (genDate && genDate.getFullYear() === year && genDate.getMonth() === month - 1) {
        events.push({ day: genDate.getDate(), type: 'pending', label: g.scheduleName, equip: g.eqName });
      }
    });
    // Gather generated work orders (PRD §4.3: show work order icon)
    workOrderV2Data.filter(wo => wo.AUART === 'PM01' && wo.EQUNR).forEach(wo => {
      const woDate = wo.GSTRP ? new Date(wo.GSTRP) : null;
      if (woDate && woDate.getFullYear() === year && woDate.getMonth() === month - 1) {
        events.push({ day: woDate.getDate(), type: 'workorder', label: `🔧 ${wo.AUFNR}`, equip: wo.EQKTX, aufnr: wo.AUFNR, status: wo.STAT_TXT });
      }
    });

    let calHtml = '';
    // Add empty cells for days before 1st
    for (let i = 0; i < firstDay; i++) {
      calHtml += '<div style="min-height:80px;background:#f9fafb;border:1px solid var(--border);"></div>';
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEvents = events.filter(e => e.day === d);
      const isToday = year === new Date().getFullYear() && month === new Date().getMonth() + 1 && d === new Date().getDate();
      calHtml += `<div style="min-height:80px;border:1px solid var(--border);padding:6px 8px;cursor:pointer;${isToday?'background:#eff6ff;border-color:#3b82f6;':''}" onclick="MaintPreventive._calendarDayClick(${year},${month},${d})">
        <div style="font-weight:${isToday?'700':'500'};font-size:13px;color:${isToday?'var(--primary)':'var(--text)'};margin-bottom:4px;">${d}</div>
        ${dayEvents.slice(0, 3).map(e => {
          let bg, fg, icon = '';
          if (e.type === 'schedule') { bg = '#dbeafe'; fg = '#1e40af'; }
          else if (e.type === 'workorder') { bg = '#d1fae5'; fg = '#065f46'; icon = '🔧 '; }
          else { bg = '#fef3c7'; fg = '#92400e'; }
          return `<div style="font-size:10px;padding:2px 4px;border-radius:3px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:${bg};color:${fg};" title="${esc(e.label)} ${e.status||''}">${icon}${esc(e.label.substring(0, 14))}</div>`;
        }).join('')}
        ${dayEvents.length > 3 ? `<div style="font-size:10px;color:var(--text-muted);">+${dayEvents.length-3}项</div>` : ''}
      </div>`;
    }

    return `<div style="padding:16px 24px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <button class="btn btn-sm btn-outline" onclick="MaintPreventive.calYear--;MaintPreventive._refreshContent()">&lt;&lt;</button>
          <button class="btn btn-sm btn-outline" onclick="MaintPreventive.calMonth=Math.max(1,MaintPreventive.calMonth-1);if(MaintPreventive.calMonth===0){MaintPreventive.calMonth=12;MaintPreventive.calYear--;}MaintPreventive._refreshContent()">&lt;</button>
          <span style="font-size:16px;font-weight:700;min-width:120px;text-align:center;">${year}年 ${monthLabels[month-1]}</span>
          <button class="btn btn-sm btn-outline" onclick="MaintPreventive.calMonth=Math.min(12,MaintPreventive.calMonth+1);if(MaintPreventive.calMonth===13){MaintPreventive.calMonth=1;MaintPreventive.calYear++;}MaintPreventive._refreshContent()">&gt;</button>
          <button class="btn btn-sm btn-outline" onclick="MaintPreventive.calYear++;MaintPreventive._refreshContent()">&gt;&gt;</button>
        </div>
        <button class="btn btn-sm btn-outline" onclick="MaintPreventive.calYear=2026;MaintPreventive.calMonth=6;MaintPreventive._refreshContent()">今天</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:0;border-top:1px solid var(--border);border-left:1px solid var(--border);">
        ${weekLabels.map(w => `<div style="text-align:center;padding:8px;font-weight:600;font-size:12px;color:var(--text-secondary);background:#f8fafc;border-right:1px solid var(--border);border-bottom:1px solid var(--border);">${w}</div>`).join('')}
        ${calHtml}
      </div>
      <div style="display:flex;gap:20px;margin-top:16px;font-size:12px;color:var(--text-secondary);">
        <div><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:#dbeafe;margin-right:6px;"></span>调度执行日</div>
        <div><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:#fef3c7;margin-right:6px;"></span>待生成工单</div>
        <div><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:#d1fae5;margin-right:6px;"></span>已生成工单 (PM01)</div>
      </div>
    </div>`;
  },

  _calendarDayClick(year, month, day) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    toast(`查看 ${dateStr} 的维护计划详情`);
  },

  // ======================== Shared utils ========================
  _renderPagination(total, totalPages) {
    return `<div class="list-toolbar" style="flex-shrink:0;">
      <div class="list-info"><span class="list-count">共 ${total} 条</span></div>
      <div class="pagination">
        <button class="pagination-btn" ${this.page<=1?'disabled':''} onclick="MaintPreventive.goPage(${this.page-1})">‹</button>
        <span class="pagination-info">第 ${this.page} / ${totalPages||1} 页</span>
        <button class="pagination-btn" ${this.page>=totalPages?'disabled':''} onclick="MaintPreventive.goPage(${this.page+1})">›</button>
        <select class="page-size-select" onchange="MaintPreventive.pageSize=parseInt(this.value);MaintPreventive.page=1;MaintPreventive._refreshContent()">
          ${[10,20,50].map(n=>'<option '+(this.pageSize===n?'selected':'')+'>'+n+'条</option>').join('')}</select>
      </div></div>`;
  }
};
