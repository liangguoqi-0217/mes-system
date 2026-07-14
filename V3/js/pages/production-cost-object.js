// ===== 生产管理 → 成本对象 =====
// 业务规则（车间用户视角）：
//   流程订单：查看(基本信息/工序信息/物料清单) · 投料(单笔+Excel批导) · 报工(单笔+Excel批导) · 收货 · 技术性完成
//   内部订单：查看 · 投料
//   成本中心：查看 · 投料
//   项目：    查看 · 投料
//   所有成本对象：可查看「操作记录」，并支持对已完成操作进行「逆向」。
// 设计遵循 _STANDARD：导航按业务对象收敛、图标克制、查看弹窗内承载操作、删除/逆向采用标记而非物理删除。
const CostObject = {
  _version: '1.1-20260714',
  page: 1, pageSize: 12,
  filtered: [],
  activeType: 'process',
  defaultType: 'process',

  setType(t) { if (t) { this.activeType = t; } },


  // 各成本对象支持的操作定义
  opDef: {
    process: {
      name: '流程订单',
      ops: [
        { key:'issue',    name:'投料', modes:['single','batch'] },
        { key:'confirm',  name:'报工', modes:['single','batch'] },
        { key:'receipt',  name:'收货', modes:['single'] },
        { key:'techcomp', name:'技术性完成', modes:['single'] }
      ]
    },
    internal: { name: '内部订单', ops: [ { key:'issue', name:'投料', modes:['single','batch'] } ] },
    costc:    { name: '成本中心', ops: [ { key:'issue', name:'投料', modes:['single','batch'] } ] },
    project:  { name: '项目',     ops: [ { key:'issue', name:'投料', modes:['single','batch'] } ] }
  },

  // 模拟成本对象数据
  data: [
    { id:'PO001', type:'process', no:'3000000123', name:'阿莫西林颗粒制剂', plant:'1000', plantName:'山东步长制药工厂', qty:'1200.000', unit:'KG', status:'REL', statusName:'已下达', basic:{ batch:'BT-202606-01', material:'MAT-10001 阿莫西林原料药', workCenter:'WC-PROD-01 制剂线', startDate:'2026-06-20', endDate:'2026-06-28', prodVer:'PV-001' }, ops:[] },
    { id:'PO002', type:'process', no:'3000000145', name:'维生素C片', plant:'1000', plantName:'山东步长制药工厂', qty:'800.000', unit:'KG', status:'REL', statusName:'已下达', basic:{ batch:'BT-202606-02', material:'MAT-10002 维生素C原料', workCenter:'WC-PROD-02 压片线', startDate:'2026-06-22', endDate:'2026-07-01', prodVer:'PV-002' }, ops:[] },
    { id:'PO003', type:'process', no:'2001000033', name:'注射用水配制', plant:'2001', plantName:'陕西步长制药工厂', qty:'5000.000', unit:'L', status:'CRTD', statusName:'已创建', basic:{ batch:'BT-202606-03', material:'MAT-20001 注射用水', workCenter:'WC-WT-01 水系统', startDate:'2026-06-25', endDate:'2026-06-30', prodVer:'PV-003' }, ops:[] },
    { id:'IO001', type:'internal', no:'5000000008', name:'车间设备年度校准', plant:'1000', plantName:'山东步长制药工厂', qty:'1.000', unit:'次', status:'REL', statusName:'已下达', basic:{ batch:'—', material:'—', workCenter:'WC-MNT-01 维修组', startDate:'2026-06-18', endDate:'2026-07-10', prodVer:'—' }, ops:[] },
    { id:'IO002', type:'internal', no:'5000000011', name:'洁净区空调系统维护', plant:'2001', plantName:'陕西步长制药工厂', qty:'1.000', unit:'次', status:'REL', statusName:'已下达', basic:{ batch:'—', material:'—', workCenter:'WC-MNT-02 设施组', startDate:'2026-06-19', endDate:'2026-07-05', prodVer:'—' }, ops:[] },
    { id:'CC001', type:'costc', no:'9000-1000-01', name:'制剂车间公用能耗', plant:'1000', plantName:'山东步长制药工厂', qty:'1.000', unit:'月', status:'REL', statusName:'已下达', basic:{ batch:'—', material:'—', workCenter:'WC-UTIL-01 公用工程', startDate:'2026-06-01', endDate:'2026-06-30', prodVer:'—' }, ops:[] },
    { id:'CC002', type:'costc', no:'9000-2001-02', name:'质检中心能耗', plant:'2001', plantName:'陕西步长制药工厂', qty:'1.000', unit:'月', status:'REL', statusName:'已下达', basic:{ batch:'—', material:'—', workCenter:'WC-UTIL-02 公用工程', startDate:'2026-06-01', endDate:'2026-06-30', prodVer:'—' }, ops:[] },
    { id:'PJ001', type:'project', no:'R-2026-007', name:'新剂型中试项目', plant:'1000', plantName:'山东步长制药工厂', qty:'1.000', unit:'项', status:'REL', statusName:'已下达', basic:{ batch:'—', material:'—', workCenter:'WC-RD-01 研发中试', startDate:'2026-06-10', endDate:'2026-09-30', prodVer:'—' }, ops:[] },
    { id:'PJ002', type:'project', no:'R-2026-009', name:'工艺优化验证项目', plant:'2002', plantName:'山东丹红制药工厂', qty:'1.000', unit:'项', status:'CRTD', statusName:'已创建', basic:{ batch:'—', material:'—', workCenter:'WC-RD-02 研发验证', startDate:'2026-06-15', endDate:'2026-10-15', prodVer:'—' }, ops:[] }
  ],

  // 预置一些操作记录，演示"已做操作 + 逆向"
  _seedOps() {
    if (this._seeded) return;
    const po1 = this.data.find(d => d.id === 'PO001');
    if (po1 && po1.ops.length === 0) {
      po1.ops = [
        { id:'OP001', type:'issue',   typeName:'投料',  qty:'600.000', unit:'KG', time:'2026-06-20 09:30', by:'车间用户A', reversed:false },
        { id:'OP002', type:'issue',   typeName:'投料',  qty:'400.000', unit:'KG', time:'2026-06-21 10:15', by:'车间用户A', reversed:false },
        { id:'OP003', type:'confirm', typeName:'报工',  qty:'1200.000', unit:'KG', time:'2026-06-22 16:40', by:'车间用户B', reversed:false }
      ];
    }
    const io1 = this.data.find(d => d.id === 'IO001');
    if (io1 && io1.ops.length === 0) {
      io1.ops = [ { id:'OP004', type:'issue', typeName:'投料', qty:'1.000', unit:'次', time:'2026-06-18 13:00', by:'车间用户A', reversed:false } ];
    }
    this._seeded = true;
  },

  // ==================== 渲染 ====================
  render() {
    this._seedOps();
    this._applyFilter();
    const typeName = (this.opDef[this.activeType] || {}).name || '成本对象';
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:var(--bg);border-bottom:1px solid var(--border);padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;color:var(--text);">${typeName}</div>
            <div style="font-size:13px;color:var(--text-secondary);margin-top:2px;">生产管理 → 成本对象 → ${typeName}</div>
          </div>
        </div>

        <!-- 查询区 -->
        <div style="background:#fff;padding:14px 24px;border-bottom:1px solid var(--border);flex-shrink:0;">
          <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;">
            <div><label style="display:block;font-size:12px;color:var(--text-secondary);margin-bottom:4px;">对象编号</label><input id="coNo" class="form-input" style="width:160px;" placeholder="如 3000000123"></div>
            <div><label style="display:block;font-size:12px;color:var(--text-secondary);margin-bottom:4px;">工厂</label><select id="coPlant" class="form-input" style="width:180px;"><option value="">全部</option><option>1000 山东步长制药工厂</option><option>2001 陕西步长制药工厂</option><option>2002 山东丹红制药工厂</option></select></div>
            <div><label style="display:block;font-size:12px;color:var(--text-secondary);margin-bottom:4px;">状态</label><select id="coStatus" class="form-input" style="width:140px;"><option value="">全部</option><option value="REL">已下达</option><option value="CRTD">已创建</option><option value="TECO">技术性完成</option></select></div>
            <button class="btn btn-primary btn-sm" onclick="CostObject.search()">查询</button>
            <button class="btn btn-ghost btn-sm" onclick="CostObject.reset()">重置</button>
          </div>
        </div>

        <!-- 列表 -->
        <div style="flex:1;overflow:auto;padding:16px 24px;background:var(--bg);">
          <div style="background:#fff;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
            <table class="data-table" style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#f8fafc;text-align:left;font-size:13px;color:var(--text-secondary);">
                  <th style="padding:10px 14px;">成本对象编号</th>
                  <th style="padding:10px 14px;">名称</th><th style="padding:10px 14px;">工厂</th>
                  <th style="padding:10px 14px;">数量</th><th style="padding:10px 14px;">状态</th>
                  <th style="padding:10px 14px;text-align:center;">操作</th>
                </tr>
              </thead>
              <tbody>${this._rows()}</tbody>
            </table>
            ${this.filtered.length === 0 ? '<div style="padding:40px;text-align:center;color:var(--text-muted);font-size:14px;">暂无符合条件的成本对象</div>' : ''}
          </div>
        </div>
      </div>`;
  },

  // 行操作：查看在左，其右侧依次放出该成本对象支持的功能按钮
  _rowOps(d) {
    const def = this.opDef[d.type] || {};
    let html = `<button class="btn btn-blue btn-sm" onclick="CostObject.openView('${d.id}')">查看</button>`;
    (def.ops || []).forEach(op => {
      if (op.key === 'issue')   html += `<button class="btn btn-primary btn-sm" onclick="CostObject.doOp('${d.id}','${op.key}','single')">投料</button>`;
      if (op.key === 'confirm') html += `<button class="btn btn-primary btn-sm" onclick="CostObject.doOp('${d.id}','${op.key}','single')">报工</button>`;
      if (op.key === 'receipt') html += `<button class="btn btn-primary btn-sm" onclick="CostObject.doOp('${d.id}','${op.key}','single')">收货</button>`;
      if (op.key === 'techcomp')html += `<button class="btn btn-primary btn-sm" onclick="CostObject.doOp('${d.id}','${op.key}','single')">技术性完成</button>`;
    });
    return html;
  },

  _rows() {
    return this.filtered.map(d => {
      const st = { REL:'badge-blue', CRTD:'badge-yellow', TECO:'badge-green' }[d.status] || 'badge-gray';
      return `<tr style="border-top:1px solid var(--border);font-size:13px;">
        <td style="padding:10px 14px;font-weight:600;color:var(--text);">${esc(d.no)}</td>
        <td style="padding:10px 14px;color:var(--text);">${esc(d.name)}</td>
        <td style="padding:10px 14px;color:var(--text-secondary);">${esc(d.plantName)}</td>
        <td style="padding:10px 14px;color:var(--text);">${d.qty} ${d.unit}</td>
        <td style="padding:10px 14px;"><span class="badge ${st}">${d.statusName}</span></td>
        <td style="padding:10px 14px;text-align:center;white-space:nowrap;">
          <div style="display:inline-flex;gap:6px;">${this._rowOps(d)}</div>
        </td>
      </tr>`;
    }).join('');
  },


  _applyFilter() {
    let list = this.data.slice();
    if (this.activeType !== 'all') list = list.filter(d => d.type === this.activeType);
    this.filtered = list;
  },

  search() {
    const no = (document.getElementById('coNo') || {}).value || '';
    const plant = (document.getElementById('coPlant') || {}).value || '';
    const status = (document.getElementById('coStatus') || {}).value || '';
    this._applyFilter();
    this.filtered = this.filtered.filter(d =>
      (!no || d.no.indexOf(no) >= 0) &&
      (!plant || d.plantName.indexOf(plant.replace(/^\d+\s*/,'')) >= 0) &&
      (!status || d.status === status)
    );
    this.refresh();
  },
  reset() {
    const n = document.getElementById('coNo'); if (n) n.value = '';
    const p = document.getElementById('coPlant'); if (p) p.value = '';
    const s = document.getElementById('coStatus'); if (s) s.value = '';
    this.search();
  },

  refresh() {
    const ca = document.getElementById('contentArea');
    if (ca) { ca.innerHTML = this.render(); }
  },

  // ==================== 查看弹窗（大） ====================
  openView(id) {
    const d = this.data.find(x => x.id === id);
    if (!d) return;
    const def = this.opDef[d.type] || {};
    const typeName = def.name || d.type;

    const body = `
      <div style="display:flex;flex-direction:column;height:78vh;">
        <!-- 上下文条（性冷淡浅灰，无蓝色块） -->
        <div style="background:#f8fafc;border:1px solid var(--border);border-radius:8px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
          <div style="font-size:14px;color:var(--text);"><strong>${esc(d.no)}</strong> · ${esc(d.name)}</div>
          <div style="font-size:13px;color:var(--text-secondary);">${typeName} · ${esc(d.plantName)}</div>
        </div>

        <!-- 操作入口（按类型显示） -->
        <div style="display:flex;gap:8px;flex-wrap:wrap;padding:14px 0;flex-shrink:0;border-bottom:1px solid var(--border);">
          ${def.ops.map(op => this._opButtons(d, op)).join('')}
        </div>

        <!-- Tabs -->
        <div style="display:flex;gap:4px;border-bottom:1px solid var(--border);flex-shrink:0;">
          ${this._tabs(d)}
        </div>
        <div style="flex:1;overflow:auto;padding:16px 4px;" id="coTabBody">${this._tabContent(d, 'basic')}</div>
      </div>`;

    showModal('成本对象详情', body, [{ text:'关闭', cls:'btn-secondary', action:closeModal }], 'modal-xl');
    // 绑定 tab 切换
    window._coCurrent = d.id;
    document.querySelectorAll('[data-co-tab]').forEach(el => {
      el.addEventListener('click', () => {
        const t = el.getAttribute('data-co-tab');
        document.querySelectorAll('[data-co-tab]').forEach(x => x.classList.remove('active'));
        el.classList.add('active');
        const bd = document.getElementById('coTabBody');
        if (bd) bd.innerHTML = CostObject._tabContent(d, t);
      });
    });
  },

  _opButtons(d, op) {
    let html = `<div style="font-size:13px;color:var(--text-secondary);align-self:center;margin-right:2px;">${op.name}</div>`;
    html += `<button class="btn btn-primary btn-sm" onclick="CostObject.doOp('${d.id}','${op.key}','single')">单笔</button>`;
    if (op.modes.indexOf('batch') >= 0) {
      html += `<button class="btn btn-ghost btn-sm" onclick="CostObject.doOp('${d.id}','${op.key}','batch')">Excel批导</button>`;
    }
    return html;
  },

  _tabs(d) {
    const tabs = [ {k:'basic',n:'基本信息'}, {k:'ops',n:'操作记录'} ];
    if (d.type === 'process') {
      tabs.splice(1, 0, {k:'routing',n:'工序信息'}, {k:'bom',n:'物料清单'});
    }
    return tabs.map((t, i) => `<div data-co-tab="${t.k}" class="co-tab ${i===0?'active':''}" style="padding:10px 16px;font-size:13px;cursor:pointer;border-bottom:2px solid transparent;${i===0?'color:var(--primary);border-bottom-color:var(--primary);font-weight:600;':'color:var(--text-secondary);'}">${t.n}</div>`).join('');
  },

  _tabContent(d, tab) {
    if (tab === 'basic') return this._basicTab(d);
    if (tab === 'routing') return this._routingTab(d);
    if (tab === 'bom') return this._bomTab(d);
    if (tab === 'ops') return this._opsTab(d);
    return '';
  },

  _basicTab(d) {
    const b = d.basic || {};
    const rows = [
      ['成本对象编号', d.no], ['成本对象类型', (this.opDef[d.type]||{}).name || d.type],
      ['对象名称', d.name], ['工厂', d.plantName],
      ['批次', b.batch], ['关联物料', b.material],
      ['工作中心', b.workCenter], ['生产版本', b.prodVer],
      ['开始日期', b.startDate], ['结束日期', b.endDate],
      ['数量', d.qty + ' ' + d.unit], ['状态', d.statusName]
    ];
    return `<div style="display:grid;grid-template-columns:140px 1fr;gap:1px;background:var(--border);border:1px solid var(--border);border-radius:8px;overflow:hidden;font-size:13px;">
      ${rows.map(r => `<div style="background:#f8fafc;padding:10px 14px;color:var(--text-secondary);">${r[0]}</div><div style="background:#fff;padding:10px 14px;color:var(--text);">${esc(r[1]||'—')}</div>`).join('')}
    </div>`;
  },

  _routingTab(d) {
    const ops = [
      { op:'0010', name:'粉碎过筛', wc:'WC-PROD-01', std:'2.0 h', status:'已确认' },
      { op:'0020', name:'混合制粒', wc:'WC-PROD-01', std:'3.5 h', status:'已确认' },
      { op:'0030', name:'干燥', wc:'WC-PROD-03', std:'4.0 h', status:'部分确认' },
      { op:'0040', name:'总混', wc:'WC-PROD-01', std:'1.5 h', status:'未确认' },
      { op:'0050', name:'压片', wc:'WC-PROD-02', std:'5.0 h', status:'未确认' }
    ];
    return `<table class="data-table" style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead><tr style="background:#f8fafc;text-align:left;color:var(--text-secondary);">
        <th style="padding:10px 14px;">工序</th><th style="padding:10px 14px;">工序名称</th>
        <th style="padding:10px 14px;">工作中心</th><th style="padding:10px 14px;">标准工时</th>
        <th style="padding:10px 14px;">报工状态</th></tr></thead>
      <tbody>${ops.map(o => `<tr style="border-top:1px solid var(--border);">
        <td style="padding:10px 14px;">${o.op}</td><td style="padding:10px 14px;">${o.name}</td>
        <td style="padding:10px 14px;">${o.wc}</td><td style="padding:10px 14px;">${o.std}</td>
        <td style="padding:10px 14px;">${o.status}</td></tr>`).join('')}</tbody>
    </table>`;
  },

  _bomTab(d) {
    const items = [
      { mat:'MAT-10001', name:'阿莫西林原料药', qty:'600.000', unit:'KG', pos:'0010' },
      { mat:'MAT-10002', name:'淀粉辅料', qty:'300.000', unit:'KG', pos:'0020' },
      { mat:'MAT-10003', name:'硬脂酸镁', qty:'5.000', unit:'KG', pos:'0030' },
      { mat:'MAT-20001', name:'胶囊壳#0', qty:'500000.000', unit:'EA', pos:'0040' }
    ];
    return `<table class="data-table" style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead><tr style="background:#f8fafc;text-align:left;color:var(--text-secondary);">
        <th style="padding:10px 14px;">项次</th><th style="padding:10px 14px;">物料编码</th>
        <th style="padding:10px 14px;">物料名称</th><th style="padding:10px 14px;">需求数量</th></tr></thead>
      <tbody>${items.map(i => `<tr style="border-top:1px solid var(--border);">
        <td style="padding:10px 14px;">${i.pos}</td><td style="padding:10px 14px;">${i.mat}</td>
        <td style="padding:10px 14px;">${i.name}</td><td style="padding:10px 14px;">${i.qty} ${i.unit}</td></tr>`).join('')}</tbody>
    </table>`;
  },

  // 操作记录：列出已做操作 + 逆向入口
  _opsTab(d) {
    if (!d.ops || d.ops.length === 0) {
      return `<div style="padding:40px;text-align:center;color:var(--text-muted);font-size:14px;">该成本对象暂无操作记录</div>`;
    }
    return `<table class="data-table" style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead><tr style="background:#f8fafc;text-align:left;color:var(--text-secondary);">
        <th style="padding:10px 14px;">操作</th><th style="padding:10px 14px;">数量</th>
        <th style="padding:10px 14px;">操作时间</th><th style="padding:10px 14px;">操作人</th>
        <th style="padding:10px 14px;">状态</th><th style="padding:10px 14px;text-align:center;">操作</th></tr></thead>
      <tbody>${d.ops.map(op => this._opRow(d, op)).join('')}</tbody>
    </table>`;
  },

  _opRow(d, op) {
    if (op.reversed) {
      return `<tr style="border-top:1px solid var(--border);color:var(--text-muted);text-decoration:line-through;">
        <td style="padding:10px 14px;">${op.typeName}</td><td style="padding:10px 14px;">${op.qty} ${op.unit}</td>
        <td style="padding:10px 14px;">${op.time}</td><td style="padding:10px 14px;">${esc(op.by)}</td>
        <td style="padding:10px 14px;"><span class="badge badge-gray">已逆向</span></td>
        <td style="padding:10px 14px;text-align:center;">—</td></tr>`;
    }
    return `<tr style="border-top:1px solid var(--border);">
      <td style="padding:10px 14px;">${op.typeName}</td><td style="padding:10px 14px;">${op.qty} ${op.unit}</td>
      <td style="padding:10px 14px;">${op.time}</td><td style="padding:10px 14px;">${esc(op.by)}</td>
      <td style="padding:10px 14px;"><span class="badge badge-green">有效</span></td>
      <td style="padding:10px 14px;text-align:center;"><button class="btn btn-ghost btn-sm" onclick="CostObject.reverseOp('${d.id}','${op.id}')">逆向</button></td></tr>`;
  },

  // ==================== 操作执行（单笔 / 批导） ====================
  doOp(id, opKey, mode) {
    const d = this.data.find(x => x.id === id);
    if (!d) return;
    const def = this.opDef[d.type] || {};
    const op = def.ops.find(o => o.key === opKey);
    const opName = op ? op.name : opKey;

    if (mode === 'batch') {
      // Excel 批导：演示弹窗（下载模板 + 上传占位）
      const body = `
        <div style="font-size:14px;color:var(--text);line-height:1.8;">
          <p>通过 Excel 批量导入「${opName}」数据。请先下载模板，按格式填写后上传。</p>
          <div style="display:flex;gap:10px;margin-top:16px;">
            <button class="btn btn-ghost btn-sm" onclick="toast('模板下载中（演示）')">下载模板</button>
            <label class="btn btn-primary btn-sm" style="cursor:pointer;">
              选择文件<input type="file" accept=".xlsx,.xls" style="display:none;" onchange="CostObject._onBatchFile(this,'${id}','${opKey}','${opName}')">
            </label>
          </div>
          <div id="coBatchHint" style="margin-top:14px;font-size:13px;color:var(--text-secondary);"></div>
        </div>`;
      showModal(opName + ' - Excel批导', body, [{ text:'关闭', cls:'btn-secondary', action:closeModal }], 'modal-md');
      return;
    }

    // 单笔：录入表单
    const body = `
      <div style="font-size:14px;color:var(--text);">
        <div style="display:grid;grid-template-columns:120px 1fr;gap:12px;align-items:center;margin-bottom:14px;">
          <label style="color:var(--text-secondary);">${opName}数量</label>
          <input id="coOpQty" class="form-input" placeholder="请输入数量" value="${d.qty}">
          <label style="color:var(--text-secondary);">单位</label>
          <input id="coOpUnit" class="form-input" value="${d.unit}" readonly>
          ${opKey==='techcomp' ? '' : `
          <label style="color:var(--text-secondary);">过账日期</label>
          <input id="coOpDate" class="form-input" type="date" value="2026-07-14">
          <label style="color:var(--text-secondary);">备注</label>
          <input id="coOpRemark" class="form-input" placeholder="可选">`}
        </div>
      </div>`;
    showModal(opName + ' - 单笔录入', body, [
      { text:'取消', cls:'btn-secondary', action:closeModal },
      { text:'确认提交', cls:'btn-primary', action:() => CostObject._submitSingle(id, opKey, opName) }
    ], 'modal-md');
  },

  _onBatchFile(input, id, opKey, opName) {
    if (!input.files || !input.files[0]) return;
    const f = input.files[0];
    const hint = document.getElementById('coBatchHint');
    if (hint) hint.textContent = '已选择文件：' + f.name + '，解析后共 0 行（演示）。点击确认后将批量生成操作记录。';
    toast('已读取文件：' + f.name + '（演示环境，未真正解析）');
    // 演示：直接生成一条批导记录
    const d = this.data.find(x => x.id === id);
    if (d) {
      d.ops.push({ id:'OP'+Date.now(), type:opKey, typeName:opName, qty:d.qty, unit:d.unit, time:'2026-07-14 10:00', by:'车间用户A', reversed:false });
    }
  },

  _submitSingle(id, opKey, opName) {
    const d = this.data.find(x => x.id === id);
    if (!d) return;
    const qty = (document.getElementById('coOpQty') || {}).value || d.qty;
    const unit = (document.getElementById('coOpUnit') || {}).value || d.unit;
    d.ops.push({ id:'OP'+Date.now(), type:opKey, typeName:opName, qty:qty, unit:unit, time:'2026-07-14 10:00', by:'车间用户A', reversed:false });
    if (opKey === 'techcomp') { d.status = 'TECO'; d.statusName = '技术性完成'; }
    closeModal();
    toast(opName + '已提交');
    this.openView(id); // 重新打开查看弹窗，刷新操作记录
  },

  // ==================== 逆向操作 ====================
  reverseOp(id, opId) {
    const d = this.data.find(x => x.id === id);
    if (!d) return;
    const op = d.ops.find(o => o.id === opId);
    if (!op || op.reversed) return;
    const body = `
      <div style="font-size:14px;color:var(--text);line-height:1.7;">
        <p>将对以下操作执行逆向：</p>
        <div style="background:#f8fafc;border:1px solid var(--border);border-radius:8px;padding:12px;margin:12px 0;font-size:13px;">
          <div><strong>操作：</strong>${op.typeName}</div>
          <div><strong>数量：</strong>${op.qty} ${op.unit}</div>
          <div><strong>时间：</strong>${op.time}</div>
        </div>
        <label style="display:block;color:var(--text-secondary);font-size:13px;margin-bottom:4px;">逆向原因（必填）</label>
        <textarea id="coRevReason" class="form-input" rows="3" placeholder="请填写逆向原因" style="width:100%;"></textarea>
      </div>`;
    showModal('逆向确认', body, [
      { text:'取消', cls:'btn-secondary', action:closeModal },
      { text:'确认逆向', cls:'btn-danger', action:() => CostObject._confirmReverse(id, opId) }
    ], 'modal-md');
  },

  _confirmReverse(id, opId) {
    const reason = (document.getElementById('coRevReason') || {}).value || '';
    if (!reason.trim()) { toast('请填写逆向原因'); return; }
    const d = this.data.find(x => x.id === id);
    if (!d) return;
    const op = d.ops.find(o => o.id === opId);
    if (op) { op.reversed = true; op.reverseReason = reason; op.reverseTime = '2026-07-14 11:00'; }
    closeModal();
    toast('已逆向，操作记录已标记');
    this.openView(id);
  },

  init() {}
};
