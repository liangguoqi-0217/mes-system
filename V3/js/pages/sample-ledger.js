// ===== 样品台账页面 =====
// 质量管理 → 样品管理 → 样品台账
//
// 设计原则（与留样台账 v2 同频，见 样品管理PRD.md）：
//   1. 检验批管"结果与进度"，本页只管"物理位置与保管"——检验进度不进本台账，禁止双头状态；
//   2. MES 只做事实与结果录入，不做任何审批；检毕处置（返还/消耗/销毁）直接登记结果；
//   3. 不接条码/硬件：定位靠键盘输入样品编号 → 位置面包屑；样品标识照旧纸质样品签；
//   4. 不做 SAP 过账——检验样品不是库存；留样的 311/551 属于留样台账，与本页无关；
//   5. 状态机五态：待入库 → 在库 →（调用中）→ 已消耗 / 已销毁（终态只读）；
//   6. 列表行项目只留「查看」；登记/流转操作全部在查看弹窗内；
//   7. 登记存在两种方式（从检验批带出 / 手动登记）→ 先弹方式选择弹窗；
//   8. 编号规则：类别代码-年-月-流水号（如 YF-2026-05-018），自动生成且唯一；
//   9. 位置引用公共位置树（js/core/sample-locations.js），路径以面包屑展示。

const SampleLedger = {
  _version: '1.0-20261104',
  page: 1, pageSize: 10,
  filtered: [],
  moreOpen: false,

  // ==================== 字典 ====================

  plantOptions: [
    { code: '1000', name: '山东步长制药工厂' },
    { code: '2001', name: '陕西步长制药工厂' },
    { code: '2002', name: '山东丹红制药工厂' }
  ],

  // 14 类类别代码（同受控文件样品编号规则，见 qc-sample-flow.html）
  typeOptions: [
    { code: 'YC', name: '中药材及饮片' },
    { code: 'YF', name: '原辅料' },
    { code: 'NBC', name: '内包材' },
    { code: 'WBC', name: '外包材' },
    { code: 'CP', name: '成品' },
    { code: 'ZJ', name: '中间产品' },
    { code: 'WD', name: '稳定性样' },
    { code: 'GS', name: '工艺用水' },
    { code: 'KQ', name: '压缩空气' },
    { code: 'HJ', name: '环境监测' },
    { code: 'YZ', name: '验证类' },
    { code: 'WT', name: '外部委托' },
    { code: 'KY', name: '科研' },
    { code: 'QT', name: '其他' }
  ],

  statusFlow: [
    { code: 'REG', name: '待入库', badge: 'badge-yellow', desc: '已登记，待从位置树指定存放位置' },
    { code: 'STORED', name: '在库', badge: 'badge-green', desc: '已按位置树落位' },
    { code: 'CALLED', name: '调用中', badge: 'badge-purple', desc: '被复测/调查取用，待归还' },
    { code: 'CONSUMED', name: '已消耗', badge: 'badge-gray', desc: '检验用完，余量清零（终态）' },
    { code: 'DESTROYED', name: '已处置', badge: 'badge-gray', desc: '已返还送检方或销毁登记完成（终态）' }
  ],

  // 检验批 mock（登记"从检验批带出"用；实际接入时来自检验批管理）
  inspectBatchOptions: [
    { no: '100000013780', materialCode: 'MAT-10011', materialName: '硬脂酸镁', batch: 'SAP-BT-20261022', type: 'YF', unit: 'KG' },
    { no: '100000013755', materialCode: 'MAT-20006', materialName: '当归饮片', batch: 'SAP-BT-20261028', type: 'YC', unit: 'KG' },
    { no: '100000013742', materialCode: 'MAT-20010', materialName: '铝塑板', batch: 'SAP-BT-20261030', type: 'NBC', unit: '㎡' },
    { no: '100000013736', materialCode: 'MAT-30002', materialName: '丹红注射液', batch: 'SAP-BT-20261101', type: 'CP', unit: '支' },
    { no: '100000013721', materialCode: 'MAT-90001', materialName: '纯化水', batch: 'SAP-BT-20261103', type: 'GS', unit: 'L' }
  ],

  getStatusMeta(code) {
    return this.statusFlow.find(s => s.code === code) || { code: code, name: code, badge: 'badge-gray', desc: '—' };
  },
  getTypeName(code) {
    const t = this.typeOptions.find(x => x.code === code);
    return t ? t.name : code;
  },
  getPlantName(code) {
    const p = this.plantOptions.find(x => x.code === code);
    return p ? p.name : code;
  },

  // ==================== 样品台账数据（内存 mock） ====================

  data: [
    { id: 'P001', sampleNo: 'YF-2026-05-018', type: 'YF', plant: '2001',
      materialCode: 'MAT-10005', materialName: '布洛芬原料药',
      sourceBatch: 'SAP-BT-20260501', inspectBatchNo: '100000012301',
      qty: '0.500', remainQty: '0.350', unit: 'KG',
      storageCondition: '阴凉干燥处（≤25℃）', validDate: '2028-05-31',
      locCode: 'CAB-01-L2',
      registerBy: '张工', registerTime: '2026-05-18 09:20', putawayTime: '2026-05-18 09:40',
      status: 'STORED',
      moves: [{ time: '2026-05-18 09:40', from: '', to: 'CAB-01-L2', by: '张工', reason: '入库上架' }],
      calls: [{ callNo: 'CALL-20260902-01', by: '孙工', dept: '质量控制部', purpose: 'OOS 调查复测（QA-20260902-018）',
        qty: '0.150', unit: 'KG', time: '2026-09-02 10:10', returnTime: '', returnBy: '' }] },

    { id: 'P002', sampleNo: 'YC-2026-04-102', type: 'YC', plant: '2001',
      materialCode: 'MAT-20004', materialName: '当归饮片',
      sourceBatch: 'SAP-BT-20260415', inspectBatchNo: '100000012102',
      qty: '1.000', remainQty: '0.800', unit: 'KG',
      storageCondition: '密闭、阴凉干燥处', validDate: '2027-04-15',
      locCode: 'DR-01-T1',
      registerBy: '李工', registerTime: '2026-04-20 14:00', putawayTime: '2026-04-20 14:20',
      status: 'STORED',
      moves: [{ time: '2026-04-20 14:20', from: '', to: 'DR-01-T1', by: '李工', reason: '入库上架' }],
      calls: [] },

    { id: 'P003', sampleNo: 'NBC-2026-06-045', type: 'NBC', plant: '2001',
      materialCode: 'MAT-20010', materialName: '铝塑板',
      sourceBatch: 'SAP-BT-20260612', inspectBatchNo: '100000012418',
      qty: '2.000', remainQty: '2.000', unit: '㎡',
      storageCondition: '常温干燥处', validDate: '2027-06-12',
      locCode: 'CAB-01-L1',
      registerBy: '王工', registerTime: '2026-06-15 10:30', putawayTime: '2026-06-15 10:50',
      status: 'STORED',
      moves: [], calls: [] },

    { id: 'P004', sampleNo: 'CP-2026-09-021', type: 'CP', plant: '2002',
      materialCode: 'MAT-30002', materialName: '丹红注射液',
      sourceBatch: 'SAP-BT-20260908', inspectBatchNo: '100000013012',
      qty: '12.000', remainQty: '10.000', unit: '支',
      storageCondition: '避光、阴凉处（2~8℃）', validDate: '2027-09-08',
      locCode: 'FRZ-01-L2-A',
      registerBy: '赵工', registerTime: '2026-09-10 08:40', putawayTime: '2026-09-10 09:00',
      status: 'STORED',
      moves: [], calls: [] },

    { id: 'P005', sampleNo: 'GS-2026-11-007', type: 'GS', plant: '2001',
      materialCode: 'MAT-90001', materialName: '纯化水',
      sourceBatch: '—', inspectBatchNo: '100000013690',
      qty: '0.500', remainQty: '0.500', unit: 'L',
      storageCondition: '冷藏（取样后 8h 内检验）', validDate: '2026-11-11',
      locCode: 'FRZ-01-L1-A',
      registerBy: '陈工', registerTime: '2026-11-04 07:50', putawayTime: '2026-11-04 08:05',
      status: 'STORED',
      moves: [], calls: [] },

    { id: 'P006', sampleNo: 'YF-2026-11-021', type: 'YF', plant: '2001',
      materialCode: 'MAT-10009', materialName: '甘露醇辅料',
      sourceBatch: 'SAP-BT-20261102', inspectBatchNo: '100000013705',
      qty: '0.300', remainQty: '0.300', unit: 'KG',
      storageCondition: '密闭、干燥处', validDate: '2027-11-02',
      locCode: '',
      registerBy: '周工', registerTime: '2026-11-03 15:30', putawayTime: '',
      status: 'REG',
      moves: [], calls: [] },

    { id: 'P007', sampleNo: 'ZJ-2026-10-033', type: 'ZJ', plant: '2001',
      materialCode: 'MAT-50001', materialName: '脑心通胶囊混合粉',
      sourceBatch: 'SAP-BT-20261005', inspectBatchNo: '100000013351',
      qty: '0.200', remainQty: '0.120', unit: 'KG',
      storageCondition: '密封、阴凉处', validDate: '2026-12-05',
      locCode: 'FRZ-02-D1',
      registerBy: '钱工', registerTime: '2026-10-06 16:00', putawayTime: '2026-10-06 16:20',
      status: 'CALLED',
      moves: [{ time: '2026-10-06 16:20', from: '', to: 'FRZ-02-D1', by: '钱工', reason: '入库上架' }],
      calls: [{ callNo: 'CALL-20261103-01', by: '吴工', dept: '质量部', purpose: '偏差调查取样（DEV-20261101-007）',
        qty: '0.080', unit: 'KG', time: '2026-11-03 09:30', returnTime: '', returnBy: '' }] },

    { id: 'P008', sampleNo: 'WBC-2026-08-012', type: 'WBC', plant: '2001',
      materialCode: 'MAT-60002', materialName: '纸盒（12袋装）',
      sourceBatch: 'SAP-BT-20260810', inspectBatchNo: '100000012866',
      qty: '6.000', remainQty: '0.000', unit: '个',
      storageCondition: '常温', validDate: '—',
      locCode: 'CAB-01-L3',
      registerBy: '刘工', registerTime: '2026-08-12 11:00', putawayTime: '2026-08-12 11:15',
      status: 'CONSUMED',
      moves: [],
      calls: [],
      disposal: { mode: 'CONSUME', date: '2026-09-18', by: '刘工', remark: '检验项目全部消耗' } },

    { id: 'P009', sampleNo: 'YC-2026-09-088', type: 'YC', plant: '2002',
      materialCode: 'MAT-20007', materialName: '黄芪饮片',
      sourceBatch: 'SAP-BT-20260901', inspectBatchNo: '100000013018',
      qty: '0.500', remainQty: '0.000', unit: 'KG',
      storageCondition: '密闭、阴凉干燥处', validDate: '2027-09-01',
      locCode: 'DR-01-T1',
      registerBy: '孙工', registerTime: '2026-09-03 09:10', putawayTime: '2026-09-03 09:30',
      status: 'DESTROYED',
      moves: [],
      calls: [],
      disposal: { mode: 'DESTROY', date: '2026-10-28', by: '孙工 / 王工', method: '手撕、剪碎（不可重复利用）', remark: '检验完成后多余样品' } },

    { id: 'P010', sampleNo: 'HJ-2026-11-004', type: 'HJ', plant: '2001',
      materialCode: '—', materialName: '洁净区沉降菌（D级 车间二）',
      sourceBatch: '—', inspectBatchNo: '100000013712',
      qty: '3.000', remainQty: '3.000', unit: '皿',
      storageCondition: '冷藏（培养后观察）', validDate: '2026-11-08',
      locCode: 'CAB-02-L1',
      registerBy: '陈工', registerTime: '2026-11-04 08:30', putawayTime: '2026-11-04 08:45',
      status: 'STORED',
      moves: [], calls: [] }
  ],

  // 注册到位置树占用统计（含下级反查共用）；只注册一次
  _registerProvider() {
    if (window.SampleLocations && !this._providerAdded) {
      this._providerAdded = true;
      SampleLocations.addProvider(() => this.data
        .filter(r => r.locCode && r.status !== 'DESTROYED' && r.status !== 'CONSUMED')
        .map(r => ({ source: 'ledger', locCode: r.locCode,
          record: Object.assign({}, r, { statusName: this.getStatusMeta(r.status).name }) })));
    }
  },

  // ==================== 页面骨架 ====================

  render() {
    this.page = 1;
    this._registerProvider();
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">样品台账</div>
            <div style="font-size:13px;opacity:0.85;">检验样品登记 · 位置定位 · 调用归还 · 检毕处置 · 全程追溯（检验进度见检验批管理）</div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
              onclick="App.navigateTo('quality-management','sample-location','sample-location','位置管理')">位置管理</button>
            <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
              onclick="SampleLedger.openRegisterChoice()">+ 样品登记</button>
          </div>
        </div>

        <div id="sdFilterBar" style="flex-shrink:0;"></div>
        <div class="table-wrapper" id="sdTableWrapper" style="flex:1;overflow:auto;width:100%;min-width:0;"></div>
        <div id="sdPagination" style="flex-shrink:0;"></div>
      </div>`;
  },

  init() {
    this.renderFilterBar();
    if (window.QueryVariant) {
      QueryVariant.mount('sample-ledger');
      QueryVariant.restore('sample-ledger');
      QueryVariant.bindRecent('sample-ledger');
    }
    this.renderTable();
    this.renderPagination();
  },

  _val(id) {
    const e = document.getElementById(id);
    return e ? String(e.value || '').trim() : '';
  },

  search() { this.page = 1; this.renderTable(); this.renderPagination(); },

  toggleMore() { this.moreOpen = !this.moreOpen; this.renderFilterBar(); },

  // ==================== 筛选栏 ====================

  renderFilterBar() {
    const el = document.getElementById('sdFilterBar');
    if (!el) return;
    const plantOpts = this.plantOptions.map(p => `<option value="${p.code}">${p.code} ${p.name}</option>`).join('');
    const statOpts = this.statusFlow.map(s => `<option value="${s.code}">${s.name}</option>`).join('');
    const moreStyle = `display:${this.moreOpen ? 'flex' : 'none'};flex-wrap:wrap;gap:12px;width:100%;padding:0;border:none;background:transparent;`;

    el.innerHTML = `<div class="filter-bar" style="flex-wrap:wrap;">
      <div class="filter-group"><label>工厂</label><select id="sdPlant"><option value="">全部</option>${plantOpts}</select></div>
      <div class="filter-group"><label>样品编号 / 物料</label><input type="text" id="sdKeyword" placeholder="如 YF-2026 或 当归"></div>
      <div class="filter-group"><label>样品状态</label><select id="sdStatus"><option value="">全部</option>${statOpts}</select></div>
      ${FilterActions.render({ pageId: 'sample-ledger', scope: 'SampleLedger', onExport: 'exportData', onMore: 'toggleMore', moreOpen: this.moreOpen })}
      <div id="sdMoreBar" style="${moreStyle}">
        <div class="filter-group"><label>存放位置</label><input type="text" id="sdLoc" placeholder="如 3号冰箱 或 FRZ-01"></div>
        <div class="filter-group"><label>检验批号</label><input type="text" id="sdBatch" placeholder="如 100000013"></div>
        <div class="filter-group"><label>登记日期从</label><input type="date" id="sdDateFrom"></div>
        <div class="filter-group"><label>至</label><input type="date" id="sdDateTo"></div>
      </div>
    </div>`;
  },

  // ==================== 台账表格 ====================

  renderTable() {
    const plant = this._val('sdPlant');
    const kw = this._val('sdKeyword').toLowerCase();
    const status = this._val('sdStatus');
    const loc = this._val('sdLoc').toLowerCase();
    const batch = this._val('sdBatch').toLowerCase();
    const dFrom = this._val('sdDateFrom');
    const dTo = this._val('sdDateTo');

    this.filtered = this.data.filter(s => {
      if (plant && s.plant !== plant) return false;
      if (batch && (s.inspectBatchNo || '').toLowerCase().indexOf(batch) === -1) return false;
      if (dFrom && s.registerTime.substring(0, 10) < dFrom) return false;
      if (dTo && s.registerTime.substring(0, 10) > dTo) return false;
      if (loc) {
        const locText = (s.locCode ? SampleLocations.breadcrumbText(s.locCode) + ' ' + s.locCode : '').toLowerCase();
        if (locText.indexOf(loc) === -1) return false;
      }
      if (kw && (s.sampleNo + ' ' + s.materialCode + ' ' + s.materialName + ' ' + this.getTypeName(s.type)).toLowerCase().indexOf(kw) === -1) return false;
      if (status && s.status !== status) return false;
      return true;
    });

    const { page } = this._paged(this.filtered);
    const el = document.getElementById('sdTableWrapper');
    if (!el) return;

    el.innerHTML = `<table class="data-table" style="min-width:1180px;">
      <thead><tr>
        <th style="width:160px;">样品编号</th>
        <th style="width:100px;">类别</th>
        <th style="width:190px;">物料</th>
        <th style="width:150px;">批次 / 检验批</th>
        <th style="width:110px;">登记量 / 余量</th>
        <th style="width:200px;">存放位置</th>
        <th style="width:140px;">登记人 / 时间</th>
        <th style="width:90px;">状态</th>
        <th style="width:70px;">操作</th>
      </tr></thead>
      <tbody>${page.length ? page.map(s => this.renderRow(s)).join('')
        : `<tr><td colspan="9" class="empty-cell">暂无符合条件的样品记录</td></tr>`}</tbody>
    </table>`;
  },

  renderRow(s) {
    const m = this.getStatusMeta(s.status);
    const typeHtml = `<span class="badge badge-blue" style="font-size:11px;">${esc(s.type)}</span>
      <div style="color:var(--text-muted);font-size:11px;margin-top:2px;">${esc(this.getTypeName(s.type))}</div>`;
    const batchHtml = `<div style="font-family:monospace;font-size:12px;">${esc(s.sourceBatch || '—')}</div>
      <div style="color:var(--text-muted);font-family:monospace;font-size:11px;">检验批 ${esc(s.inspectBatchNo || '—')}</div>`;
    const locHtml = s.locCode
      ? SampleLocations.breadcrumbHtml(s.locCode) +
        `<div style="color:var(--text-muted);font-family:monospace;font-size:11px;">${esc(s.locCode)}</div>`
      : '<span style="color:var(--text-muted);">未入库</span>';

    return `<tr>
      <td style="font-family:monospace;font-size:12px;font-weight:600;color:#1E3A5F;">${esc(s.sampleNo)}</td>
      <td>${typeHtml}</td>
      <td>${esc(s.materialName)}
        <div style="color:var(--text-muted);font-family:monospace;font-size:11px;">${esc(s.materialCode)}</div></td>
      <td>${batchHtml}</td>
      <td style="font-size:12px;">${esc(s.qty)} / <b>${esc(s.remainQty)}</b> ${esc(s.unit)}</td>
      <td style="font-size:12px;">${locHtml}</td>
      <td style="font-size:12px;">${esc(s.registerBy)}
        <div style="color:var(--text-muted);font-size:11px;">${esc(s.registerTime)}</div></td>
      <td><span class="badge ${m.badge}">${esc(m.name)}</span></td>
      <td><div class="table-actions">
        <button class="btn btn-blue btn-sm" onclick="SampleLedger.openDetail('${s.id}')">查看</button>
      </div></td>
    </tr>`;
  },

  _paged(list) {
    const pages = Math.max(1, Math.ceil(list.length / this.pageSize));
    if (this.page > pages) this.page = pages;
    const start = (this.page - 1) * this.pageSize;
    return { page: list.slice(start, start + this.pageSize), start: start };
  },

  // ==================== 样品登记（两种方式 → 先弹选择弹窗） ====================

  openRegisterChoice() {
    const cards = [
      { key: 'batch', title: '从检验批带出', emoji: '📋',
        desc: '选择检验批，物料 / 批次 / 检验批号自动带入<br>适用于取样送检的常规检验样品',
        call: 'SampleLedger.openRegisterFromBatch()',
        bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '#bfdbfe', hover: '#3b82f6',
        titleColor: '#1e40af', shadow: 'rgba(59,130,246,.12)',
        pill: '<span class="badge badge-blue" style="padding:6px 18px;border-radius:16px;font-size:12px;cursor:pointer;">开始登记 →</span>' },
      { key: 'manual', title: '手动登记', emoji: '✍️',
        desc: '手工填写物料与来源信息<br>适用于环境监测、验证样等无请验单样品',
        call: 'SampleLedger.openRegisterManual()',
        bg: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', border: '#cbd5e1', hover: '#64748b',
        titleColor: '#334155', shadow: 'rgba(100,116,139,.12)',
        pill: '<span class="badge badge-gray" style="padding:6px 18px;border-radius:16px;font-size:12px;background:#64748b;color:#fff;cursor:pointer;">开始登记 →</span>' }
    ];
    const card = c => `
      <div onclick="closeModal();${c.call}"
        style="background:${c.bg};border:1.5px solid ${c.border};border-radius:12px;padding:24px 14px;cursor:pointer;transition:all .22s;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:190px;"
        onmouseenter="this.style.borderColor='${c.hover}';this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 14px ${c.shadow}'"
        onmouseleave="this.style.borderColor='${c.border}';this.style.transform='translateY(0)';this.style.boxShadow='none'">
        <div style="font-size:40px;margin-bottom:8px;">${c.emoji}</div>
        <div style="font-size:16px;font-weight:700;color:${c.titleColor};margin-bottom:6px;">${c.title}</div>
        <div style="font-size:12px;color:#4b5563;line-height:1.5;">${c.desc}</div>
        <div style="margin-top:14px;">${c.pill}</div>
      </div>`;

    showModal('📌 选择登记方式', `
      <div style="padding:8px 0;">
        <div style="font-size:14px;color:var(--text-secondary);margin-bottom:4px;text-align:center;">
          请选择样品登记方式（样品编号按「类别代码-年-月-流水号」自动生成）
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;text-align:center;">
          登记后状态为「待入库」，需在查看弹窗中完成入库上架定位
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;">
          ${cards.map(card).join('')}
        </div>
      </div>`, [{ text: '取消', cls: 'btn-secondary', action: closeModal }], 'modal-md');
  },

  _typeOpts(selected) {
    return this.typeOptions.map(t =>
      `<option value="${t.code}" ${selected === t.code ? 'selected' : ''}>${t.code} ${t.name}</option>`).join('');
  },
  _plantOpts(selected) {
    return this.plantOptions.map(p =>
      `<option value="${p.code}" ${selected === p.code ? 'selected' : ''}>${p.code} ${p.name}</option>`).join('');
  },

  openRegisterFromBatch() {
    const batchOpts = this.inspectBatchOptions.map(b =>
      `<option value="${b.no}" data-type="${b.type}" data-mc="${b.materialCode}" data-mn="${b.materialName}"
        data-batch="${b.batch}" data-unit="${b.unit}">${b.no} · ${b.materialName} · ${b.batch}</option>`).join('');

    showModal('样品登记 — 从检验批带出', `
      <div style="padding:4px 0;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          选择检验批后物料、批次自动带入；登记后状态为「待入库」，SAP 不做过账（检验样品不是库存）。
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>关联检验批 <span class="req">*</span></label>
            <select id="rgBatch" onchange="SampleLedger._onBatchChange()">${batchOpts}</select></div>
          <div class="form-group"><label>样品类别 <span class="req">*</span></label>
            <select id="rgType">${this._typeOpts('YF')}</select></div>
          <div class="form-group"><label>物料</label><input type="text" id="rgMaterial" readonly style="background:#f3f4f6;"></div>
          <div class="form-group"><label>来源批次</label><input type="text" id="rgSourceBatch" readonly style="background:#f3f4f6;"></div>
          <div class="form-group"><label>样品数量 <span class="req">*</span></label><input type="text" id="rgQty" value="0.500"></div>
          <div class="form-group"><label>保存条件</label><input type="text" id="rgCondition" placeholder="如 阴凉干燥处（≤25℃）"></div>
          <div class="form-group"><label>有效期 / 保存期限</label><input type="date" id="rgValid"></div>
        </div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认登记', cls: 'btn-primary', action: () => SampleLedger.submitRegister('batch') }
    ], 'modal-md');

    this._onBatchChange();
  },

  _onBatchChange() {
    const sel = document.getElementById('rgBatch');
    if (!sel) return;
    const opt = sel.options[sel.selectedIndex];
    if (!opt) return;
    const d = opt.dataset;
    const mat = document.getElementById('rgMaterial');
    const sb = document.getElementById('rgSourceBatch');
    const tp = document.getElementById('rgType');
    if (mat) mat.value = (d.mc || '') + ' ' + (d.mn || '');
    if (sb) sb.value = d.batch || '';
    if (tp && d.type) tp.value = d.type;
  },

  openRegisterManual() {
    showModal('样品登记 — 手动登记', `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          物料从主数据口径手工填写（环境监测 / 验证样等无请验单样品）；登记后状态为「待入库」。
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>工厂 <span class="req">*</span></label>
            <select id="rmPlant">${this._plantOpts('2001')}</select></div>
          <div class="form-group"><label>样品类别 <span class="req">*</span></label>
            <select id="rmType">${this._typeOpts('HJ')}</select></div>
          <div class="form-group"><label>物料编码</label><input type="text" id="rmMaterialCode" placeholder="无则填 —"></div>
          <div class="form-group"><label>物料 / 样品名称 <span class="req">*</span></label><input type="text" id="rmMaterialName" placeholder="如 洁净区沉降菌（D级 车间一）"></div>
          <div class="form-group"><label>来源批次</label><input type="text" id="rmSourceBatch" placeholder="如 —"></div>
          <div class="form-group"><label>检验批号</label><input type="text" id="rmInspectBatch" placeholder="可空"></div>
          <div class="form-group"><label>样品数量 <span class="req">*</span></label><input type="text" id="rmQty" value="1.000"></div>
          <div class="form-group"><label>单位</label><input type="text" id="rmUnit" value="皿"></div>
          <div class="form-group"><label>保存条件</label><input type="text" id="rmCondition" placeholder="如 冷藏"></div>
          <div class="form-group"><label>有效期 / 保存期限</label><input type="date" id="rmValid"></div>
        </div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认登记', cls: 'btn-primary', action: () => SampleLedger.submitRegister('manual') }
    ], 'modal-md');
  },

  submitRegister(mode) {
    const now = this._now();
    let rec;
    if (mode === 'batch') {
      const sel = document.getElementById('rgBatch');
      const opt = sel.options[sel.selectedIndex];
      const d = opt ? opt.dataset : {};
      const qty = ((document.getElementById('rgQty') || {}).value || '').trim();
      if (!qty || Number(qty) <= 0) return toast('请填写样品数量');
      rec = {
        id: 'P' + String(900 + this.data.length),
        plant: '2001',
        type: ((document.getElementById('rgType') || {}).value) || d.type || 'QT',
        materialCode: d.mc || '—', materialName: d.mn || '待确认样品',
        sourceBatch: d.batch || '', inspectBatchNo: d.no || '',
        qty: qty, remainQty: qty, unit: d.unit || '',
        storageCondition: ((document.getElementById('rgCondition') || {}).value || '').trim(),
        validDate: ((document.getElementById('rgValid') || {}).value) || '—',
        locCode: '', registerBy: this._user(), registerTime: now, putawayTime: '',
        status: 'REG', moves: [], calls: []
      };
    } else {
      const name = ((document.getElementById('rmMaterialName') || {}).value || '').trim();
      if (!name) return toast('请填写物料 / 样品名称');
      const qty = ((document.getElementById('rmQty') || {}).value || '').trim();
      if (!qty || Number(qty) <= 0) return toast('请填写样品数量');
      rec = {
        id: 'P' + String(900 + this.data.length),
        plant: ((document.getElementById('rmPlant') || {}).value) || '2001',
        type: ((document.getElementById('rmType') || {}).value) || 'QT',
        materialCode: ((document.getElementById('rmMaterialCode') || {}).value || '—').trim(),
        materialName: name,
        sourceBatch: ((document.getElementById('rmSourceBatch') || {}).value || '—').trim(),
        inspectBatchNo: ((document.getElementById('rmInspectBatch') || {}).value || '').trim(),
        qty: qty, remainQty: qty,
        unit: ((document.getElementById('rmUnit') || {}).value || '').trim(),
        storageCondition: ((document.getElementById('rmCondition') || {}).value || '').trim(),
        validDate: ((document.getElementById('rmValid') || {}).value) || '—',
        locCode: '', registerBy: this._user(), registerTime: now, putawayTime: '',
        status: 'REG', moves: [], calls: []
      };
    }
    rec.sampleNo = this._genSampleNo(rec.type);
    this.data.unshift(rec);
    closeModal();
    this.init();
    toast(`登记成功：${rec.sampleNo}（待入库），请在「查看」中完成入库上架`);
  },

  // 编号规则：类别代码-年-月-流水号（按类别+年月递增）
  _genSampleNo(type) {
    const d = new Date();
    const ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    const prefix = type + '-' + ym + '-';
    const seq = this.data.filter(r => (r.sampleNo || '').indexOf(prefix) === 0).length + 1;
    return prefix + String(seq).padStart(3, '0');
  },

  _user() {
    return (window.currentUser && window.currentUser.name) || '当前用户';
  },

  _now() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  },

  // ==================== 流转操作（均在查看弹窗内触发） ====================

  // 入库上架 / 位置变更：共用位置树选择弹窗
  openPutaway(sid) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    const isMove = s.status !== 'REG';
    SampleLocations.pick({
      title: (isMove ? '位置变更 — ' : '入库上架 — ') + s.sampleNo,
      currentNode: s.locCode || '',
      onPick: (code) => {
        if (isMove && code === s.locCode) return toast('新位置与当前位置相同');
        const from = s.locCode || '';
        s.locCode = code;
        if (!isMove) s.putawayTime = this._now();
        s.moves = s.moves || [];
        s.moves.push({ time: this._now(), from: from, to: code, by: this._user(),
          reason: isMove ? '位置变更' : '入库上架' });
        s.status = isMove ? s.status : 'STORED';
        this.init();
        if (this._openDetailSilently) this.openDetail(sid);
        toast((isMove ? '位置已变更：' : '入库完成，状态更新为「在库」：') + SampleLocations.breadcrumbText(code));
      }
    });
  },

  openCall(sid) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    showModal('调用登记 — ' + s.sampleNo, `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          ${esc(s.sampleNo)} · ${esc(s.materialName)} · 当前余量 <b>${esc(s.remainQty)} ${esc(s.unit)}</b>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>领用人 <span class="req">*</span></label><input type="text" id="clBy" value="${esc(this._user())}"></div>
          <div class="form-group"><label>部门</label><input type="text" id="clDept" value="质量控制部"></div>
          <div class="form-group"><label>用途 <span class="req">*</span></label><select id="clPurpose">
            <option>复测 / OOS 调查</option><option>偏差调查取样</option><option>客户投诉复验</option>
            <option>验证 / 方法确认</option><option>其他</option>
          </select></div>
          <div class="form-group"><label>领用数量 <span class="req">*</span></label><input type="text" id="clQty" value="0.050"></div>
        </div>
        <div class="form-group" style="margin-top:6px;"><label>说明（单号 / 备注）</label><input type="text" id="clRemark" placeholder="如 QA-20261101-003"></div>
        <label style="display:flex;align-items:center;gap:8px;margin-top:8px;font-size:13px;">
          <input type="checkbox" id="clConsume" checked> 取用后不再归还（检验消耗）
        </label>
        <div style="margin-top:10px;font-size:12px;color:var(--text-muted);">调用只登记台账，不做 SAP 库存移动；审批在纸质 / eQMS 完成。</div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '登记调用', cls: 'btn-primary', action: () => {
        const by = ((document.getElementById('clBy') || {}).value || '').trim();
        const qty = Number((document.getElementById('clQty') || {}).value || 0);
        if (!by) return toast('请填写领用人');
        if (qty <= 0) return toast('请填写领用数量');
        if (qty > Number(s.remainQty)) return toast('领用数量不能大于当前余量');
        const remark = ((document.getElementById('clRemark') || {}).value || '').trim();
        s.calls = s.calls || [];
        s.calls.push({
          callNo: 'CALL-' + new Date().toISOString().substring(0, 10).replace(/-/g, '') + '-' + String(s.calls.length + 1).padStart(2, '0'),
          by: by,
          dept: ((document.getElementById('clDept') || {}).value || '').trim(),
          purpose: ((document.getElementById('clPurpose') || {}).value) + (remark ? '（' + remark + '）' : ''),
          qty: String(qty), unit: s.unit, time: this._now(), returnTime: '', returnBy: ''
        });
        s.remainQty = (Number(s.remainQty) - qty).toFixed(3);
        const consume = (document.getElementById('clConsume') || {}).checked;
        if (consume && Number(s.remainQty) <= 0) {
          s.status = 'CONSUMED';
          s.disposal = { mode: 'CONSUME', date: this._now().substring(0, 10), by: by, remark: '调用消耗，余量清零' };
          toast('调用已登记，余量清零，样品转为「已消耗」（终态）');
        } else {
          s.status = 'CALLED';
          toast('调用已登记，样品状态更新为「调用中」');
        }
        closeModal(); this.init();
      } }
    ], 'modal-md');
  },

  openReturn(sid) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    showModal('归还登记 — ' + s.sampleNo, `
      <div style="padding:4px 0;">
        <div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          ${esc(s.sampleNo)} · ${esc(s.materialName)} · 当前余量 ${esc(s.remainQty)} ${esc(s.unit)}
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;">
          <div class="form-group"><label>归还人</label><input type="text" id="rtBy" value="${esc(this._user())}"></div>
          <div class="form-group"><label>归还时间</label><input type="text" id="rtTime" value="${esc(this._now())}"></div>
        </div>
        <div class="form-group" style="margin-top:6px;"><label>样品状态确认</label><select id="rtCond">
          <option value="OK">完好，继续在库</option>
          <option value="NG">破损 / 污染，需检毕处置</option>
        </select></div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '登记归还', cls: 'btn-primary', action: () => {
        const last = (s.calls || []).filter(c => !c.returnTime).pop();
        const cond = (document.getElementById('rtCond') || {}).value;
        if (last) {
          last.returnTime = ((document.getElementById('rtTime') || {}).value) || '';
          last.returnBy = ((document.getElementById('rtBy') || {}).value) || '';
          last.returnCond = cond;
        }
        s.status = 'STORED';
        closeModal(); this.init();
        toast(cond === 'NG'
          ? '归还已登记；样品有异常，请在「检毕处置」中登记销毁'
          : '归还完成，样品状态回到「在库」');
      } }
    ], 'modal-sm');
  },

  // 检毕处置：三种方式选择弹窗（返还 / 消耗 / 销毁），直接登记结果，无审批
  openDisposal(sid) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    const cards = [
      { key: 'RETURN', title: '返还送检方', emoji: '↩️',
        desc: '样品退还请验单位 / 供应商<br>登记返还对象与日期',
        bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '#bfdbfe', hover: '#3b82f6',
        titleColor: '#1e40af', shadow: 'rgba(59,130,246,.12)',
        pill: '<span class="badge badge-blue" style="padding:6px 18px;border-radius:16px;font-size:12px;cursor:pointer;">登记返还 →</span>' },
      { key: 'CONSUME', title: '检验消耗', emoji: '🧪',
        desc: '剩余样品在检验中用完<br>余量清零，转「已消耗」',
        bg: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', border: '#c7d2fe', hover: '#6366f1',
        titleColor: '#4338ca', shadow: 'rgba(99,102,241,.12)',
        pill: '<span class="badge" style="padding:6px 18px;border-radius:16px;font-size:12px;background:#6366f1;color:#fff;cursor:pointer;">登记消耗 →</span>' },
      { key: 'DESTROY', title: '销毁登记', emoji: '🗑️',
        desc: '销毁方式使其不可重复利用<br>登记方式 / 执行人 / 日期',
        bg: 'linear-gradient(135deg,#fef2f2,#fee2e2)', border: '#fecaca', hover: '#dc2626',
        titleColor: '#991b1b', shadow: 'rgba(220,38,38,.12)',
        pill: '<span class="badge" style="padding:6px 18px;border-radius:16px;font-size:12px;background:#dc2626;color:#fff;cursor:pointer;">登记销毁 →</span>' }
    ];
    const card = c => `
      <div onclick="closeModal();SampleLedger.openDisposalForm('${sid}','${c.key}')"
        style="background:${c.bg};border:1.5px solid ${c.border};border-radius:12px;padding:22px 14px;cursor:pointer;transition:all .22s;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:170px;"
        onmouseenter="this.style.borderColor='${c.hover}';this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 14px ${c.shadow}'"
        onmouseleave="this.style.borderColor='${c.border}';this.style.transform='translateY(0)';this.style.boxShadow='none'">
        <div style="font-size:36px;margin-bottom:8px;">${c.emoji}</div>
        <div style="font-size:15px;font-weight:700;color:${c.titleColor};margin-bottom:6px;">${c.title}</div>
        <div style="font-size:12px;color:#4b5563;line-height:1.5;">${c.desc}</div>
        <div style="margin-top:12px;">${c.pill}</div>
      </div>`;

    showModal('📌 检毕处置 — ' + s.sampleNo, `
      <div style="padding:8px 0;">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:14px;text-align:center;">
          ${esc(s.materialName)} · 余量 ${esc(s.remainQty)} ${esc(s.unit)} · MES 只登记事实，不做审批
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
          ${cards.map(card).join('')}
        </div>
      </div>`, [{ text: '取消', cls: 'btn-secondary', action: closeModal }], 'modal-md');
  },

  openDisposalForm(sid, mode) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    let body = '';
    if (mode === 'RETURN') {
      body = `
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>返还对象 <span class="req">*</span></label>
            <input type="text" id="dpTarget" placeholder="如 物流部库房 / 供应商"></div>
          <div class="form-group"><label>返还日期 <span class="req">*</span></label>
            <input type="date" id="dpDate" value="${new Date().toISOString().substring(0, 10)}"></div>
          <div class="form-group" style="grid-column:span 2;"><label>返还数量</label>
            <input type="text" id="dpQty" value="${esc(s.remainQty)}"></div>
        </div>`;
    } else if (mode === 'CONSUME') {
      body = `
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>消耗日期 <span class="req">*</span></label>
            <input type="date" id="dpDate" value="${new Date().toISOString().substring(0, 10)}"></div>
          <div class="form-group"><label>经办人 <span class="req">*</span></label>
            <input type="text" id="dpBy" value="${esc(this._user())}"></div>
          <div class="form-group" style="grid-column:span 2;"><label>说明</label>
            <input type="text" id="dpRemark" value="检验项目全部消耗"></div>
        </div>`;
    } else {
      body = `
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>销毁日期 <span class="req">*</span></label>
            <input type="date" id="dpDate" value="${new Date().toISOString().substring(0, 10)}"></div>
          <div class="form-group"><label>销毁数量</label><input type="text" id="dpQty" value="${esc(s.remainQty)}"></div>
          <div class="form-group"><label>销毁方式 <span class="req">*</span></label><select id="dpMethod">
            <option>手撕、剪碎（不可重复利用）</option><option>混合破坏</option>
            <option>交 EHS 统一处置</option><option>退回供应商</option>
          </select></div>
          <div class="form-group"><label>执行人 <span class="req">*</span></label>
            <input type="text" id="dpBy" value="${esc(this._user())}"></div>
          <div class="form-group" style="grid-column:span 2;"><label>说明</label>
            <input type="text" id="dpRemark" placeholder="销毁审批在纸质 / eQMS 完成，此处登记结果"></div>
        </div>`;
    }
    const titleMap = { RETURN: '返还登记', CONSUME: '消耗登记', DESTROY: '销毁登记' };

    showModal(titleMap[mode] + ' — ' + s.sampleNo, `<div style="padding:4px 0;">${body}</div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确认登记', cls: mode === 'DESTROY' ? 'btn-danger' : 'btn-primary', action: () => {
        const date = ((document.getElementById('dpDate') || {}).value) || '';
        const by = ((document.getElementById('dpBy') || {}).value) || this._user();
        if (!date) return toast('请填写日期');
        s.disposal = {
          mode: mode, date: date, by: by,
          target: mode === 'RETURN' ? ((document.getElementById('dpTarget') || {}).value || '').trim() : '',
          method: mode === 'DESTROY' ? ((document.getElementById('dpMethod') || {}).value || '') : '',
          qty: mode !== 'CONSUME' ? ((document.getElementById('dpQty') || {}).value || s.remainQty) : s.remainQty,
          remark: ((document.getElementById('dpRemark') || {}).value || '').trim()
        };
        if (mode === 'RETURN' && !s.disposal.target) return toast('请填写返还对象');
        if (mode === 'DESTROY' && !s.disposal.method) return toast('请填写销毁方式');
        s.status = mode === 'CONSUME' ? 'CONSUMED' : 'DESTROYED';
        s.remainQty = mode === 'RETURN' ? s.remainQty : '0.000';
        closeModal(); this.init();
        toast(titleMap[mode] + '完成，样品转入终态（只读）');
      } }
    ], 'modal-md');
  },

  // ==================== 详情弹窗（四页签 + 顶部操作区） ====================

  _openDetailSilently: true,

  openDetail(sid) {
    const s = this.data.find(x => x.id === sid);
    if (!s) return;
    const m = this.getStatusMeta(s.status);
    const terminal = s.status === 'CONSUMED' || s.status === 'DESTROYED';

    // 顶部操作区：按状态给动作（终态无动作）
    const actions = [];
    if (s.status === 'REG') actions.push(`<button class="btn btn-primary btn-sm" onclick="closeModal();SampleLedger.openPutaway('${sid}')">📥 入库上架</button>`);
    if (s.status === 'STORED') {
      actions.push(`<button class="btn btn-sm" style="background:#0ea5e9;color:#fff;" onclick="closeModal();SampleLedger.openCall('${sid}')">📤 调用登记</button>`);
      actions.push(`<button class="btn btn-sm" onclick="closeModal();SampleLedger.openPutaway('${sid}')">📍 位置变更</button>`);
    }
    if (s.status === 'CALLED') {
      actions.push(`<button class="btn btn-primary btn-sm" onclick="closeModal();SampleLedger.openReturn('${sid}')">🔄 归还登记</button>`);
      actions.push(`<button class="btn btn-sm" onclick="closeModal();SampleLedger.openCall('${sid}')">📤 再次调用</button>`);
    }
    if (!terminal) actions.push(`<button class="btn btn-danger btn-sm" onclick="closeModal();SampleLedger.openDisposal('${sid}')">检毕处置</button>`);

    // 位置显著展示（本模块最具辨识度的元素）
    const locBanner = s.locCode
      ? `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px 16px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;">
           <div><span style="font-size:12px;color:var(--text-muted);">存放位置</span>
             <div style="margin-top:2px;">${SampleLocations.breadcrumbHtml(s.locCode, 'font-size:14px;font-weight:600;color:#1E3A5F;')}</div></div>
           <div style="font-family:monospace;font-size:12px;color:var(--text-muted);">${esc(s.locCode)}</div>
         </div>`
      : `<div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:10px 16px;margin-bottom:14px;font-size:13px;color:#b45309;">
           该样品尚未入库定位，请通过「入库上架」从位置树选择存放位置。</div>`;

    showModal('样品详情 — ' + s.sampleNo, `
      <div style="padding:4px 0;font-size:13px;">
        ${locBanner}
        <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;">
          ${actions.join('')}
          ${terminal ? '<span class="badge badge-gray" style="align-self:center;">终态只读，不可再操作</span>' : ''}
        </div>
        <div style="display:flex;gap:4px;border-bottom:2px solid var(--border);margin-bottom:16px;">
          <div class="form-tab active" data-sltab="base" onclick="SampleLedger._switchTab(this)">基本信息</div>
          <div class="form-tab" data-sltab="move" onclick="SampleLedger._switchTab(this)">位置与移动</div>
          <div class="form-tab" data-sltab="call" onclick="SampleLedger._switchTab(this)">调用记录</div>
          <div class="form-tab" data-sltab="disposal" onclick="SampleLedger._switchTab(this)">处置记录</div>
        </div>
        <div class="ib-tab-panel active" data-slpanel="base">${this._tabBase(s)}</div>
        <div class="ib-tab-panel" data-slpanel="move">${this._tabMove(s)}</div>
        <div class="ib-tab-panel" data-slpanel="call">${this._tabCall(s)}</div>
        <div class="ib-tab-panel" data-slpanel="disposal">${this._tabDisposal(s)}</div>
      </div>`, [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-lg');
  },

  _switchTab(el) {
    const wrap = el.closest('.modal-body') || document;
    wrap.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
    wrap.querySelectorAll('.ib-tab-panel').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    const panel = wrap.querySelector('.ib-tab-panel[data-slpanel="' + el.dataset.sltab + '"]');
    if (panel) panel.classList.add('active');
  },

  _tabBase(s) {
    const m = this.getStatusMeta(s.status);
    return `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px 24px;padding:14px 16px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;">
        <div><span style="color:var(--text-muted);">样品编号：</span><span style="font-family:monospace;font-weight:600;color:#1E3A5F;">${esc(s.sampleNo)}</span></div>
        <div><span style="color:var(--text-muted);">状态：</span><span class="badge ${m.badge}">${esc(m.name)}</span></div>
        <div><span style="color:var(--text-muted);">类别：</span>${esc(s.type)} ${esc(this.getTypeName(s.type))}</div>
        <div><span style="color:var(--text-muted);">工厂：</span>${esc(s.plant)} ${esc(this.getPlantName(s.plant))}</div>
        <div><span style="color:var(--text-muted);">物料：</span>${esc(s.materialCode)} ${esc(s.materialName)}</div>
        <div><span style="color:var(--text-muted);">来源批次：</span>${esc(s.sourceBatch || '—')}</div>
        <div><span style="color:var(--text-muted);">关联检验批：</span>${esc(s.inspectBatchNo || '—')}</div>
        <div><span style="color:var(--text-muted);">登记量：</span>${esc(s.qty)} ${esc(s.unit)}（余 ${esc(s.remainQty)}）</div>
        <div><span style="color:var(--text-muted);">保存条件：</span>${esc(s.storageCondition || '—')}</div>
        <div><span style="color:var(--text-muted);">有效期 / 保存期限：</span>${esc(s.validDate || '—')}</div>
        <div><span style="color:var(--text-muted);">登记：</span>${esc(s.registerBy)} ${esc(s.registerTime)}</div>
        <div><span style="color:var(--text-muted);">入库上架：</span>${esc(s.putawayTime || '—')}</div>
      </div>
      <div style="margin-top:10px;font-size:12px;color:var(--text-muted);">
        检验进度与结果请在「检验批管理」（检验批号 ${esc(s.inspectBatchNo || '—')}）中查看，本台账只管样品实物。
      </div>`;
  },

  _tabMove(s) {
    if (!s.locCode && !(s.moves || []).length) {
      return '<div style="color:var(--text-muted);font-size:12px;">尚未入库，无位置记录</div>';
    }
    const rows = (s.moves || []).map(mv => `<tr>
      <td style="font-size:12px;">${esc(mv.time)}</td>
      <td style="font-size:12px;">${mv.from ? SampleLocations.breadcrumbHtml(mv.from) : '<span style="color:var(--text-muted);">—（登记）</span>'}</td>
      <td style="font-size:12px;">${mv.to ? SampleLocations.breadcrumbHtml(mv.to) : '—'}</td>
      <td>${esc(mv.by)}</td>
      <td style="font-size:12px;">${esc(mv.reason || '—')}</td>
    </tr>`).join('');
    return `<table class="data-table">
      <thead><tr><th style="width:150px;">时间</th><th>原位置</th><th>新位置</th><th style="width:90px;">操作人</th><th style="width:110px;">原因</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="5" class="empty-cell">无位置变更记录</td></tr>'}</tbody>
    </table>`;
  },

  _tabCall(s) {
    const calls = s.calls || [];
    if (!calls.length) return '<div style="color:var(--text-muted);font-size:12px;">暂无调用记录</div>';
    return `<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">共 ${calls.length} 条调用记录</div>
      <table class="data-table">
        <thead><tr><th>调用单号</th><th>领用人</th><th>用途</th><th>数量</th><th>领用时间</th><th>归还时间 / 归还人</th></tr></thead>
        <tbody>${calls.map(c => `<tr>
          <td style="font-family:monospace;font-size:12px;">${esc(c.callNo)}</td>
          <td>${esc(c.by)}${c.dept ? '（' + esc(c.dept) + '）' : ''}</td>
          <td style="font-size:12px;">${esc(c.purpose)}</td>
          <td>${esc(c.qty)} ${esc(c.unit)}</td>
          <td style="font-size:12px;">${esc(c.time)}</td>
          <td style="font-size:12px;">${c.returnTime ? esc(c.returnTime) + ' · ' + esc(c.returnBy) : '<span style="color:#dc2626;">未归还</span>'}</td>
        </tr>`).join('')}</tbody></table>`;
  },

  _tabDisposal(s) {
    if (!s.disposal) {
      const terminal = s.status === 'CONSUMED' || s.status === 'DESTROYED';
      return `<div style="padding:24px 16px;text-align:center;color:var(--text-muted);background:#f8fafc;border:1px dashed var(--border);border-radius:8px;">
        ${terminal ? '该样品已终态，但缺少处置明细（历史数据）' : '该样品尚未处置（检毕后在顶部「检毕处置」中登记）'}
      </div>`;
    }
    const d = s.disposal;
    const modeName = d.mode === 'RETURN' ? '返还送检方' : d.mode === 'CONSUME' ? '检验消耗' : '销毁';
    const modeBadge = d.mode === 'RETURN' ? 'badge-blue' : d.mode === 'CONSUME' ? 'badge-purple' : 'badge-red';
    return `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px 24px;padding:14px 16px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;">
        <div><span style="color:var(--text-muted);">处置方式：</span><span class="badge ${modeBadge}">${modeName}</span></div>
        <div><span style="color:var(--text-muted);">处置日期：</span>${esc(d.date || '—')}</div>
        <div><span style="color:var(--text-muted);">经办 / 执行：</span>${esc(d.by || '—')}</div>
        ${d.target ? `<div><span style="color:var(--text-muted);">返还对象：</span>${esc(d.target)}</div>` : ''}
        ${d.method ? `<div><span style="color:var(--text-muted);">销毁方式：</span>${esc(d.method)}</div>` : ''}
        ${d.qty ? `<div><span style="color:var(--text-muted);">数量：</span>${esc(d.qty)} ${esc(s.unit)}</div>` : ''}
        ${d.remark ? `<div style="grid-column:span 3;"><span style="color:var(--text-muted);">说明：</span>${esc(d.remark)}</div>` : ''}
      </div>
      <div style="margin-top:10px;font-size:12px;color:var(--text-muted);">处置审批在纸质 / eQMS 完成，MES 只登记最终结果。</div>`;
  },

  // ==================== 导出 ====================

  exportData() {
    if (!this.filtered || !this.filtered.length) return toast('无数据可导出');
    const head = ['样品编号', '类别', '类别名称', '工厂', '物料编码', '物料名称', '来源批次', '检验批号',
      '登记量', '余量', '单位', '位置编码', '位置路径', '保存条件', '有效期', '登记人', '登记时间', '入库时间', '状态',
      '处置方式', '处置日期', '处置经办'];
    const modeName = m => ({ RETURN: '返还送检方', CONSUME: '检验消耗', DESTROY: '销毁' }[m] || '—');
    const lines = this.filtered.map(s => [
      s.sampleNo, s.type, this.getTypeName(s.type), s.plant, s.materialCode, s.materialName,
      s.sourceBatch, s.inspectBatchNo, s.qty, s.remainQty, s.unit,
      s.locCode || '—', s.locCode ? SampleLocations.breadcrumbText(s.locCode) : '—',
      s.storageCondition || '—', s.validDate || '—', s.registerBy, s.registerTime, s.putawayTime || '—',
      this.getStatusMeta(s.status).name,
      s.disposal ? modeName(s.disposal.mode) : '—', s.disposal ? s.disposal.date || '—' : '—',
      s.disposal ? s.disposal.by || '—' : '—'
    ]);
    const csv = '\uFEFF' + [head.join(',')].concat(lines.map(r => r.map(c => {
      const v = String(c == null ? '' : c);
      return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(','))).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = '样品台账_' + new Date().toISOString().substring(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('已导出 ' + lines.length + ' 条');
  },

  // ==================== 分页 ====================

  renderPagination() {
    const el = document.getElementById('sdPagination');
    if (!el) return;
    const total = this.filtered.length;
    const pages = Math.max(1, Math.ceil(total / this.pageSize));
    el.innerHTML = `<div class="pagination">
      <span style="color:var(--text-muted);font-size:12px;margin-right:12px;">共 ${total} 条</span>
      <button class="pagination-btn" onclick="SampleLedger.prevPage()" ${this.page <= 1 ? 'disabled' : ''}>‹</button>
      <span class="pagination-info">第 ${this.page} / ${pages} 页</span>
      <button class="pagination-btn" onclick="SampleLedger.nextPage()" ${this.page >= pages ? 'disabled' : ''}>›</button>
      <select class="page-size-select" onchange="SampleLedger.changePageSize(this.value)">
        ${[10, 20, 50].map(n => `<option value="${n}" ${n === this.pageSize ? 'selected' : ''}>${n}条/页</option>`).join('')}
      </select>
    </div>`;
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); this.renderPagination(); } },
  nextPage() {
    const pages = Math.ceil(Math.max(this.filtered.length, 1) / this.pageSize);
    if (this.page < pages) { this.page++; this.renderTable(); this.renderPagination(); }
  },
  changePageSize(n) { this.pageSize = Number(n); this.page = 1; this.renderTable(); this.renderPagination(); }
};

// 查询变式注册：「我的变式」按钮由 FilterActions 统一渲染，这里提供条件字段与回填入口
if (window.QueryVariant) {
  QueryVariant.register({
    pageId: 'sample-ledger',
    fields: ['sdPlant', 'sdKeyword', 'sdStatus', 'sdLoc', 'sdBatch', 'sdDateFrom', 'sdDateTo'],
    textFields: ['sdKeyword', 'sdLoc', 'sdBatch', 'sdDateFrom', 'sdDateTo'],
    labels: { sdPlant: '工厂', sdKeyword: '样品编号/物料', sdStatus: '样品状态', sdLoc: '存放位置', sdBatch: '检验批号', sdDateFrom: '登记日期从', sdDateTo: '登记日期至' },
    onApply: function () { SampleLedger.search(); }
  });
}
