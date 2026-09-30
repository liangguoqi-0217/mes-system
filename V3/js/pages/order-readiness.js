/* ==================== 生产管理 → 可用性检查 ====================
 * 业务背景：工作中心用户每天打开本页，勾选本工作中心本周要生产的流程订单，让系统逐项对比
 *          订单组件的未清需求与供给，回答"缺不缺料"。
 *
 * 两套计算逻辑，进页面后由用户在顶部切换（二选一，不同时展示）：
 *   逻辑一 · 现有库存对比（静态）：未清需求 vs 现有库存（非限制 + 质检）
 *            —— 不计在途、不扣其他订单占用、不看需求日期；直观，但不保证开工那天仍够
 *   逻辑二 · SAP ATP 可用性检查（动态）：
 *            —— 计入在途采购 / 在制订单 / 调拨在途，扣减其他订单占用与安全库存，
 *               并按组件需求日期在时间轴上校验；缺料行可展开查看判定依据
 *
 * 切换逻辑会连带改变：查询条件（ATP 多出 检查规则 / 供给范围 / 扣减项）、
 *                     表格列、判定口径、导出内容、调用的 SAP 接口。
 *
 * 数据全部由 SAP 现算（不落表）：
 *   · 库存  → SAP 库存查询接口（复用现有接口，取 非限制 + 质检）
 *   · ATP   → SAP 批量可用性检查接口（一次传入订单清单，SAP 内部批量算，一次返回）
 *
 * 不落表：每次点「执行可用性检查」由 SAP 现算，结果只存在于当前页面。
 *
 * 交互：勾选订单 → 执行可用性检查 → 订单结果直接显示在「检查结果」列；
 *       点订单行展开，看该订单的组件明细（内嵌表，独立表头）
 *       ATP 模式下，缺料行可展开查看「判定依据」（供给构成）
 *
 * 权限：工作中心用户锁定 workCenter，仅能看到本工作中心订单；全厂用户可看全部工作中心。
 *       页面不提供手动切换视角的入口（真实环境权限由登录用户决定，不能由用户自己放开）。
 *       原型里改 OR_CURRENT_USER.isPlantLevel 即可模拟不同登录身份。
 * ============================================================ */

/* ---------- 主数据 ---------- */

const OR_WORKCENTER_TEXT = {
  'WC-PROD-01': '制剂车间',
  'WC-PROD-02': '压片车间',
  'WC-PROD-03': '包装车间',
  'WC-WT-01': '水系统车间'
};

const OR_PLANT_TEXT = { '1000': '山东步长制药工厂', '2001': '陕西步长制药工厂' };

// 订单列表列数：勾选 + 流程订单号 + 产品编码 + 产品描述 + 计划开始/结束日期
//              + 组件数 + 检查结果 + 展开（工作中心在组件层，订单可跨工作中心）
const OR_ORDER_COLS = 9;

// 当前登录用户（权限模拟）。isPlantLevel=false 时锁定本工作中心。
const OR_CURRENT_USER = {
  name: '工作中心用户A',
  plant: '1000',
  workCenter: 'WC-PROD-01',
  isPlantLevel: false
};

/* ---------- 日期工具（以运行当天为基准，保证「今日/本周/本月」始终有数据） ---------- */

function orFmt(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + m + '-' + day;
}
function orNum(v) { const n = Number(v); return isNaN(n) ? String(v) : n.toLocaleString('en-US'); }
function orAddDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return orFmt(d); }
function orRangeToday() { const t = orFmt(new Date()); return { from: t, to: t }; }
function orRangeWeek() {
  const d = new Date();
  const wd = d.getDay() === 0 ? 7 : d.getDay();
  const mon = new Date(d); mon.setDate(d.getDate() - (wd - 1));
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  return { from: orFmt(mon), to: orFmt(sun) };
}
function orRangeMonth() {
  const d = new Date();
  return { from: orFmt(new Date(d.getFullYear(), d.getMonth(), 1)), to: orFmt(new Date(d.getFullYear(), d.getMonth() + 1, 0)) };
}

/* ---------- 流程订单（原型 mock：订单与组件需求来自 SAP 下发） ----------
 * reqDate = 组件需求日期（对应 SAP 预留 RESB-BDTER），ATP 按此日期校验，不是订单开始日
 */

const OR_ORDERS = [
  {
    no: '3000000123', mat: 'FG-100001', name: '阿莫西林颗粒制剂', plant: '1000', workCenter: 'WC-PROD-01',
    startDate: orAddDays(0), endDate: orAddDays(8), qty: '1200', unit: 'KG', status: 'REL', statusName: '已下达',
    components: [
      { mat: 'MAT-10001', name: '阿莫西林原料药', unit: 'KG', reqQty: 600, issuedQty: 0, reqDate: orAddDays(0) },
      { mat: 'MAT-10002', name: '淀粉辅料', unit: 'KG', reqQty: 300, issuedQty: 0, reqDate: orAddDays(1) },
      { mat: 'MAT-10003', name: '硬脂酸镁', unit: 'KG', reqQty: 5, issuedQty: 0, reqDate: orAddDays(1) },
      { mat: 'MAT-10005', name: '胶囊壳#0', unit: 'EA', reqQty: 500000, issuedQty: 0, reqDate: orAddDays(2) },
      { mat: 'MAT-10009', name: '蔗糖', unit: 'KG', reqQty: 120, issuedQty: 0, reqDate: orAddDays(2) },
      { mat: 'MAT-10011', name: '纯化水', unit: 'L', reqQty: 800, issuedQty: 0, reqDate: orAddDays(0), wc: 'WC-WT-01' }
    ]
  },
  {
    no: '3000000167', mat: 'FG-100002', name: '阿莫西林胶囊包装', plant: '1000', workCenter: 'WC-PROD-01',
    startDate: orAddDays(2), endDate: orAddDays(9), qty: '500', unit: 'KG', status: 'REL', statusName: '已下达',
    components: [
      { mat: 'MAT-10005', name: '胶囊壳#0', unit: 'EA', reqQty: 300000, issuedQty: 0, reqDate: orAddDays(2), wc: 'WC-PROD-02' },
      { mat: 'MAT-10001', name: '阿莫西林原料药', unit: 'KG', reqQty: 400, issuedQty: 100, reqDate: orAddDays(2) },
      { mat: 'MAT-10010', name: '药用铝箔', unit: 'KG', reqQty: 80, issuedQty: 0, reqDate: orAddDays(3) }
    ]
  },
  {
    no: '3000000201', mat: 'FG-100003', name: '布洛芬片（第一批）', plant: '1000', workCenter: 'WC-PROD-01',
    startDate: orAddDays(1), endDate: orAddDays(4), qty: '600', unit: 'KG', status: 'REL', statusName: '已下达',
    components: [
      { mat: 'MAT-10004', name: '布洛芬原料', unit: 'KG', reqQty: 200, issuedQty: 0, reqDate: orAddDays(1) },
      { mat: 'MAT-10002', name: '淀粉辅料', unit: 'KG', reqQty: 100, issuedQty: 0, reqDate: orAddDays(1) }
    ]
  },
  {
    no: '3000000145', mat: 'FG-100004', name: '维生素C片', plant: '1000', workCenter: 'WC-PROD-02',
    startDate: orAddDays(0), endDate: orAddDays(6), qty: '800', unit: 'KG', status: 'REL', statusName: '已下达',
    components: [
      { mat: 'MAT-10004', name: '维生素C原料', unit: 'KG', reqQty: 150, issuedQty: 0, reqDate: orAddDays(0) },
      { mat: 'MAT-10002', name: '淀粉辅料', unit: 'KG', reqQty: 200, issuedQty: 0, reqDate: orAddDays(0) }
    ]
  },
  {
    no: '3000000189', mat: 'FG-200001', name: '注射用水配制', plant: '1000', workCenter: 'WC-WT-01',
    startDate: orAddDays(3), endDate: orAddDays(5), qty: '5000', unit: 'L', status: 'REL', statusName: '已下达',
    components: [
      { mat: 'MAT-20001', name: '注射用水', unit: 'L', reqQty: 5000, issuedQty: 0, reqDate: orAddDays(3) }
    ]
  },
  {
    no: '3000000192', mat: 'FG-100004', name: '维生素C片（第二批）', plant: '1000', workCenter: 'WC-PROD-02',
    startDate: orAddDays(7), endDate: orAddDays(13), qty: '900', unit: 'KG', status: 'CRTD', statusName: '已创建',
    components: [
      { mat: 'MAT-10004', name: '维生素C原料', unit: 'KG', reqQty: 230, issuedQty: 0, reqDate: orAddDays(7) }
    ]
  }
];

/* ---------- SAP 接口返回数据（原型 mock） ----------
 * 真实环境由两个接口返回，见下方 OrSapApi。
 */

// 库存接口：工厂+物料 → 非限制 / 质检
const OR_STOCK_DB = {
  '1000|MAT-10001': { unrestricted: 800, quality: 200 },
  '1000|MAT-10002': { unrestricted: 400, quality: 50 },
  '1000|MAT-10003': { unrestricted: 3, quality: 0 },
  '1000|MAT-10004': { unrestricted: 500, quality: 0 },
  '1000|MAT-10005': { unrestricted: 600000, quality: 0 },
  '1000|MAT-10009': { unrestricted: 150, quality: 0 },
  '1000|MAT-10010': { unrestricted: 50, quality: 150 },
  '1000|MAT-10011': { unrestricted: 1200, quality: 0 },
  '1000|MAT-20001': { unrestricted: 6000, quality: 200 }
};

// ATP 元素类型值域（业务名）。本公司口径：现有库存与质检库存都算供应，固定不可配
const OR_ATP_ELEMENT = {
  STOCK: '现有库存',
  QI: '质检库存',
  PO: '采购订单',
  PR: '采购申请',
  PRD: '在制订单',
  TR: '调拨在途',
  RESB: '预留',
  SAFETY: '安全库存'
};

// ATP 接口：工厂+物料 → 可用量/缺料量/可用日期 + 供给元素与需求元素明细
//   supply  供应元素：按到达日期排序。本公司固定口径——现有库存与质检库存都算供应（counted 均为 true）
//   demand  需求元素：按需求日期排序，是本订单之外先占用库存的部分（预留 / 安全库存）
//   口径：需求日可用量 = Σ供应（需求日及之前）− Σ需求；可用日期 = 合计由负转正的日期
const OR_ATP_DB = {
  '1000|MAT-10001': {
    atpQty: 420, shortQty: 180, availDate: orAddDays(6),
    supply: [
      { type: 'STOCK', doc: '', date: orAddDays(0), qty: 800, counted: true },
      { type: 'QI', doc: '', date: orAddDays(0), qty: 200, counted: true },
      { type: 'PO', doc: '4500018765', date: orAddDays(6), qty: 420, counted: true }
    ],
    demand: [
      { type: 'RESB', doc: '3000000111', date: orAddDays(-2), qty: 200 },
      { type: 'RESB', doc: '3000000118', date: orAddDays(-1), qty: 180 },
      { type: 'RESB', doc: '3000000120', date: orAddDays(0), qty: 200 }
    ]
  },
  '1000|MAT-10002': {
    atpQty: 250, shortQty: 50, availDate: orAddDays(3),
    supply: [
      { type: 'STOCK', doc: '', date: orAddDays(0), qty: 400, counted: true },
      { type: 'QI', doc: '', date: orAddDays(0), qty: 50, counted: true },
      { type: 'PRD', doc: '3000000255', date: orAddDays(3), qty: 150, counted: true }
    ],
    demand: [
      { type: 'RESB', doc: '3000000150', date: orAddDays(-1), qty: 100 },
      { type: 'RESB', doc: '3000000160', date: orAddDays(0), qty: 100 }
    ]
  },
  '1000|MAT-10003': {
    atpQty: 3, shortQty: 2, availDate: '',
    supply: [{ type: 'STOCK', doc: '', date: orAddDays(0), qty: 3, counted: true }],
    demand: []
  },
  '1000|MAT-10004': {
    atpQty: 400, shortQty: 0, availDate: '',
    supply: [{ type: 'STOCK', doc: '', date: orAddDays(0), qty: 500, counted: true }],
    demand: [{ type: 'RESB', doc: '3000000170', date: orAddDays(0), qty: 100 }]
  },
  '1000|MAT-10005': {
    atpQty: 300000, shortQty: 200000, availDate: orAddDays(1),
    supply: [
      { type: 'STOCK', doc: '', date: orAddDays(0), qty: 600000, counted: true },
      { type: 'PO', doc: '4500018790', date: orAddDays(1), qty: 400000, counted: true }
    ],
    demand: [
      { type: 'RESB', doc: '3000000130', date: orAddDays(0), qty: 200000 },
      { type: 'RESB', doc: '3000000140', date: orAddDays(0), qty: 100000 }
    ]
  },
  '1000|MAT-10009': {
    atpQty: 100, shortQty: 20, availDate: '',
    supply: [{ type: 'STOCK', doc: '', date: orAddDays(0), qty: 150, counted: true }],
    demand: [{ type: 'SAFETY', doc: '', date: '', qty: 50 }]
  },
  '1000|MAT-10010': {
    atpQty: 200, shortQty: 0, availDate: '',
    supply: [
      { type: 'STOCK', doc: '', date: orAddDays(0), qty: 50, counted: true },
      { type: 'QI', doc: '', date: orAddDays(0), qty: 150, counted: true },
      { type: 'TR', doc: '4900000122', date: orAddDays(2), qty: 100, counted: true }
    ],
    demand: []
  },
  '1000|MAT-10011': {
    atpQty: 900, shortQty: 0, availDate: '',
    supply: [{ type: 'STOCK', doc: '', date: orAddDays(0), qty: 1200, counted: true }],
    demand: [{ type: 'RESB', doc: '3000000180', date: orAddDays(0), qty: 300 }]
  },
  '1000|MAT-20001': {
    atpQty: 5700, shortQty: 0, availDate: '',
    supply: [
      { type: 'STOCK', doc: '', date: orAddDays(0), qty: 6000, counted: true },
      { type: 'QI', doc: '', date: orAddDays(0), qty: 200, counted: true }
    ],
    demand: [{ type: 'RESB', doc: '3000000190', date: orAddDays(0), qty: 500 }]
  }
};

/* ---------- SAP 接口层 ----------
 * 原型用 setTimeout 模拟；接真实环境时只替换这两个方法体，页面其余部分不用动。
 *   getStock → 复用现有「MES 查询 SAP 库存」接口
 *   getAtp   → SAP 侧新增批量 RFC：ZMES_PP_ATP_CHECK（一次传订单清单，SAP 内批量算，一次返回）
 */

const OrSapApi = {
  // 库存：入参 工厂 + 物料清单，出参 { '物料编码': {unrestricted, quality} }
  getStock(plant, mats) {
    const out = {};
    mats.forEach(m => { out[m] = OR_STOCK_DB[plant + '|' + m] || { unrestricted: 0, quality: 0 }; });
    return new Promise(resolve => setTimeout(() => resolve(out), 400));
  },
  // ATP：入参 工厂 + 订单号清单，出参 { '物料编码': {atpQty, shortQty, availDate, ...} }
  getAtp(plant, orderNos) {
    const mats = new Set();
    OR_ORDERS.forEach(o => {
      if (orderNos.indexOf(o.no) === -1) return;
      o.components.forEach(c => mats.add(c.mat));
    });
    const out = {};
    mats.forEach(m => {
      const a = OR_ATP_DB[plant + '|' + m] || { atpQty: 0, shortQty: 0, availDate: '', safety: 0, po: 0, prd: 0, tr: 0, resbOther: 0, resbOtherCnt: 0, qiIncluded: false, poDoc: '', prdDoc: '' };
      // ATP 结果一并带回库存构成，用于说明"判定依据"（非限制 / 质检）
      const s = OR_STOCK_DB[plant + '|' + m] || { unrestricted: 0, quality: 0 };
      out[m] = Object.assign({}, a, { unrestricted: s.unrestricted, quality: s.quality });
    });
    return new Promise(resolve => setTimeout(() => resolve(out), 900));
  }
};

/* ==================== 页面对象 ==================== */

const OrderReadiness = {
  mode: 'atp',         // stock=现有库存对比 / atp=SAP ATP 可用性检查
  moreOpen: false,
  rangeKind: 'week',
  orders: [],          // 当前筛选出的订单
  selected: [],        // 勾选的订单号
  collapsed: [],       // 折叠的订单号
  checked: false,      // 是否已执行 SAP 检查
  checking: false,
  onlyProblem: true,
  stockMap: {},
  atpMap: {},

  /* ==================== 渲染 ==================== */

  render() {
    return `
      <div class="or-page" style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:14px 24px;flex-shrink:0;">
          <div style="font-size:18px;font-weight:700;">可用性检查</div>
          <div style="font-size:12px;opacity:0.85;margin-top:3px;">
            勾选本工作中心要生产的流程订单，逐项检查组件是否缺料。检查逻辑在下方「检查逻辑」中选择。
          </div>
        </div>

        <div id="orFilterBar" style="flex-shrink:0;"></div>
        <div id="orSummary" style="flex-shrink:0;"></div>

        <style>
          #orTableWrap { scrollbar-width: thin; scrollbar-color: rgba(203,213,225,0.6) transparent; }
          #orTableWrap::-webkit-scrollbar { width: 6px; height: 0; }
          #orTableWrap::-webkit-scrollbar-thumb { background: rgba(203,213,225,0.6); border-radius: 3px; }
          #orTableWrap::-webkit-scrollbar-track { background: transparent; }
          /* 订单列表行（订单层字段） */
          .or-orderrow td { font-size: 13px; cursor: pointer; padding: 9px 10px; }
          .or-orderrow:hover td { background: #f8fafc; }
          .or-orderrow-sel td { background: #f5f9ff; }
          .or-orderrow-sel:hover td { background: #eef4ff; }
          /* 展开区：组件明细内嵌表 —— 缩进 + 左侧主色竖线，表达「订单 → 组件」的层级 */
          .or-detailrow > td { padding: 0; background: #fbfcfd; border-top: none; }
          .or-cmpwrap { margin: 0 16px 12px 40px; padding-left: 10px; border-left: 3px solid var(--primary); }
          /* 组件行（item）：比订单行更紧凑 */
          .or-comptable { background: #fff; border: 1px solid var(--border); }
          .or-comptable th { padding: 5px 8px; font-size: 11px; }
          .or-comptable td { padding: 5px 8px; font-size: 12px; }
          /* 展开箭头：加粗 SVG，hover 变色、展开时旋转 */
          .or-caret { display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:4px; color: var(--text-secondary); transition: transform .15s ease, background .15s ease, color .15s ease; }
          .or-orderrow:hover .or-caret { background:#e2e8f0; color: var(--primary); }
          .or-caret-open { transform: rotate(90deg); color: var(--primary); }
          .or-orderno { font-family: monospace; font-size: 12px; font-weight: 700; color: var(--primary); }
          .or-comp td { font-size: 13px; }
          .or-num { text-align: right; font-variant-numeric: tabular-nums; }
          .or-sub { display:block; font-size: 11px; color: var(--text-muted); margin-top: 1px; }
          .or-reasonbtn { color: var(--text-muted); cursor: pointer; font-size: 13px; margin-left: 4px; }
          .or-reasonbtn:hover { color: var(--primary); }
          /* 需要强调的数字 / 日期用下划线，不用 ⚠ 之类图标 */
          .or-underline { text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 3px; }
          /* 判定依据弹窗：固定尺寸，元素多时表格在弹窗内部滚动 */
          .or-modal { width: 1180px; height: 760px; max-width: 96vw; max-height: 94vh; }
          .or-modal .modal-body { max-height: none; padding: 22px 26px; }
          .or-mask { padding: 60px; text-align: center; color: var(--text-muted); font-size: 13px; }
        </style>

        <div id="orTableWrap" style="flex:1;overflow-y:auto;overflow-x:auto;width:100%;min-width:0;background:#fff;"></div>
        <div id="orModalContainer"></div>
      </div>`;
  },

  init() {
    this.renderFilterBar();
    if (window.QueryVariant) {
      QueryVariant.mount('order-readiness');
      QueryVariant.restore('order-readiness');
      QueryVariant.bindRecent('order-readiness');
    }
    if (!this._val('orDateFrom')) this.setRange('week', true);
    this.query();
  },

  /* ==================== 检查逻辑（切换会重绘筛选栏，条件自动保留） ==================== */

  modeTip(k) {
    return {
      stock: '只与仓库现有量比（非限制 + 质检）—— 不计在途、不扣其他订单占用、不看需求日期；直观，但不保证开工那天仍够',
      atp: '可用量 = 现有库存 + 在途采购 + 在制订单 − 安全库存 − 其他订单占用，按组件需求日期在时间轴上校验；口径由系统固定，不可调整。缺料行可展开看判定依据'
    }[k || this.mode];
  },

  // 按钮与遮罩文案固定，不随检查逻辑变化
  checkBtnText() {
    return '计算是否缺料';
  },

  checkingText() {
    return 'SAP 正在计算是否缺料…';
  },

  setMode(k) {
    if (this.mode === k) return;
    // 切换逻辑会重绘筛选栏，先把已录入的条件存下来，重绘后回填
    const keep = {};
    ['orDateFrom', 'orDateTo', 'orOrderStatus', 'orOrderNo', 'orMatCode', 'orWorkCenter'].forEach(id => {
      keep[id] = this._val(id);
    });
    this.mode = k;
    this.checked = false;
    this.stockMap = {};
    this.atpMap = {};
    this.collapsed = this.orders.map(o => o.no);
    this.renderFilterBar();
    Object.keys(keep).forEach(id => {
      const e = document.getElementById(id);
      if (e && keep[id]) e.value = keep[id];
    });
    if (window.QueryVariant) QueryVariant.mount('order-readiness');
    this.renderSummary();
    this.renderTable();
  },

  /* ==================== 筛选栏 ==================== */

  renderFilterBar() {
    const el = document.getElementById('orFilterBar');
    if (!el) return;
    const isPlant = OR_CURRENT_USER.isPlantLevel;
    const plantOpts = Object.keys(OR_PLANT_TEXT)
      .map(k => '<option value="' + k + '">' + k + ' ' + OR_PLANT_TEXT[k] + '</option>').join('');
    const wcOpts = Object.keys(OR_WORKCENTER_TEXT)
      .map(k => '<option value="' + k + '">' + OR_WORKCENTER_TEXT[k] + '</option>').join('');

    const isAtp = this.mode === 'atp';
    const dateLabel = isAtp ? '计划开始日期' : '计划开始日期（仅圈定范围）';

    el.innerHTML = `
      <div class="filter-bar">
        <div class="filter-group"><label>工厂</label>
          <select id="orPlant"${isPlant ? '' : ' disabled'}>
            ${isPlant ? plantOpts : '<option value="' + OR_CURRENT_USER.plant + '">' + OR_CURRENT_USER.plant + ' ' + OR_PLANT_TEXT[OR_CURRENT_USER.plant] + '</option>'}
          </select>
        </div>
        <div class="filter-group"><label>工作中心</label>
          <select id="orWorkCenter"${isPlant ? '' : ' disabled'}>
            ${isPlant
              ? '<option value="">全部工作中心</option>' + wcOpts
              : '<option value="' + OR_CURRENT_USER.workCenter + '">' + OR_WORKCENTER_TEXT[OR_CURRENT_USER.workCenter] + '</option>'}
          </select>
        </div>
        <div class="filter-group"><label>检查逻辑
          <span style="cursor:help;color:var(--text-muted);font-weight:400;" title="${esc(this.modeTip())}">ⓘ</span></label>
          <select id="orCheckLogic" style="width:150px;" title="${esc(this.modeTip())}" onchange="OrderReadiness.setMode(this.value)">
            <option value="atp"${this.mode === 'atp' ? ' selected' : ''}>1-考虑时间因素等</option>
            <option value="stock"${this.mode === 'stock' ? ' selected' : ''}>2-仅看现有库存</option>
          </select>
        </div>
        <div class="filter-group"><label>产品编码</label><input type="text" id="orProductCode" placeholder="如 FG-100001"></div>
        <div class="filter-group"><label>${dateLabel}</label>
          <div style="display:flex;align-items:center;gap:4px;">
            <input type="date" id="orDateFrom"><span style="color:var(--text-muted);">~</span><input type="date" id="orDateTo">
          </div>
        </div>
        <div class="filter-actions" style="flex-shrink:0;">
          <button class="btn btn-primary btn-sm" onclick="OrderReadiness.query()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="OrderReadiness.exportData()">导出</button>
          <button class="btn btn-secondary btn-sm" onclick="OrderReadiness.refresh()">刷新</button>
          <button class="btn btn-secondary btn-sm" onclick="OrderReadiness.resetFilter()">重置</button>
          <button class="btn btn-secondary btn-sm" id="orMoreBtn" onclick="OrderReadiness.toggleMore()">${this.moreOpen ? '收起 ▴' : '更多条件 ▾'}</button>
        </div>
        <div id="orMoreBar" style="display:${this.moreOpen ? 'flex' : 'none'};flex-wrap:wrap;gap:12px;width:100%;padding:0;border:none;background:transparent;">
          <div class="filter-group"><label>流程订单号</label><input type="text" id="orOrderNo" placeholder="如 3000000123"></div>
          <div class="filter-group"><label>订单状态</label>
            <select id="orOrderStatus">
              <option value="">全部</option>
              <option value="REL">已下达</option>
              <option value="CRTD">已创建</option>
              <option value="TECO">技术性完成</option>
            </select>
          </div>
          <div class="filter-group"><label>物料编码/描述</label><input type="text" id="orMatCode" placeholder="物料编码或名称"></div>
          <!-- 供给范围与扣减项由系统固定（现有库存 + 在途 + 在制，扣安全库存与其他订单占用），不提供可配置开关 -->
        </div>
      </div>`;
  },

  toggleMore() {
    this.moreOpen = !this.moreOpen;
    const bar = document.getElementById('orMoreBar');
    if (bar) bar.style.display = this.moreOpen ? 'flex' : 'none';
    const btn = document.getElementById('orMoreBtn');
    if (btn) btn.textContent = this.moreOpen ? '收起 ▴' : '更多条件 ▾';
  },

  // 填充默认日期区间（本周）。快捷按钮已取消，仅用于进页面与重置时自动填充，日期区间仍可手动改
  setRange(kind, silent) {
    this.rangeKind = kind;
    let r;
    if (kind === 'today') r = orRangeToday();
    else if (kind === 'month') r = orRangeMonth();
    else r = orRangeWeek();
    const f = document.getElementById('orDateFrom');
    const t = document.getElementById('orDateTo');
    if (f) f.value = r.from;
    if (t) t.value = r.to;
    if (!silent) this.query();
  },

  _val(id) {
    const e = document.getElementById(id);
    return e ? String(e.value || '').trim() : '';
  },

  /* ==================== 查询：只按条件列出订单，不调 SAP ==================== */

  query() {
    const plant = this._val('orPlant') || OR_CURRENT_USER.plant;
    const from = this._val('orDateFrom');
    const to = this._val('orDateTo');
    const orderKey = this._val('orOrderNo').toLowerCase();
    const prodKey = this._val('orProductCode').toLowerCase();
    const matKey = this._val('orMatCode').toLowerCase();
    const statusSel = this._val('orOrderStatus');
    const wcSel = this._val('orWorkCenter');
    const isPlant = OR_CURRENT_USER.isPlantLevel;
    const myWc = isPlant ? (wcSel || '') : OR_CURRENT_USER.workCenter;

    this.orders = OR_ORDERS.filter(o => {
      if (o.plant !== plant) return false;
      if (from && o.startDate < from) return false;
      if (to && o.startDate > to) return false;
      if (statusSel && o.status !== statusSel) return false;
      if (orderKey && (o.no + o.name).toLowerCase().indexOf(orderKey) === -1) return false;
      if (prodKey && (o.mat || '').toLowerCase().indexOf(prodKey) === -1) return false;
      if (myWc && o.workCenter !== myWc) return false;
      if (matKey && !o.components.some(c => (c.mat + c.name).toLowerCase().indexOf(matKey) !== -1)) return false;
      return true;
    });

    // 重新查询后：默认全选、全部折叠、清空上次检查结果
    this.selected = this.orders.map(o => o.no);
    this.collapsed = this.orders.map(o => o.no);
    this.checked = false;
    this.stockMap = {};
    this.atpMap = {};

    this.renderSummary();
    this.renderTable();
  },

  /* ==================== 执行可用性检查：调 SAP 现算 ==================== */

  runCheck() {
    if (this.checking) return;
    const sel = this.selected;
    if (!sel.length) return toast('请先勾选要检查的订单');

    const plant = this._val('orPlant') || OR_CURRENT_USER.plant;
    const mats = [];
    this.orders.forEach(o => {
      if (sel.indexOf(o.no) === -1) return;
      o.components.forEach(c => { if (mats.indexOf(c.mat) === -1) mats.push(c.mat); });
    });

    this.checking = true;
    this.renderSummary();
    this.renderTable();

    // 现有库存对比只调库存接口；ATP 调批量可用性检查接口（结果自带库存构成）
    const isAtp = this.mode === 'atp';
    Promise.all([
      isAtp ? OrSapApi.getAtp(plant, sel) : OrSapApi.getStock(plant, mats)
    ]).then(res => {
      if (isAtp) { this.atpMap = res[0]; this.stockMap = res[0]; }
      else { this.stockMap = res[0]; this.atpMap = {}; }
      this.checked = true;
      this.checking = false;
      // 检查完成后：有问题的订单自动展开，齐套的保持折叠
      this.collapsed = this.orders.filter(o => !this._orderHasProblem(o)).map(o => o.no);
      this.renderSummary();
      this.renderTable();
      toast('SAP 可用性检查完成');
    });
  },

  _openQty(c) { return Math.max(0, (c.reqQty || 0) - (c.issuedQty || 0)); },

  _cell(c) {
    const open = this._openQty(c);
    const st = this.stockMap[c.mat];
    const atp = this.atpMap[c.mat];
    const shopStock = st ? (st.unrestricted + st.quality) : null;
    const shopGap = shopStock === null ? null : open - shopStock;
    const shopShort = shopGap !== null && shopGap > 0;
    const sapShort = atp ? atp.shortQty > 0 : false;
    // 当前检查逻辑下，该组件是否判缺
    const bad = this.mode === 'atp' ? sapShort : shopShort;
    return { open: open, st: st, atp: atp, shopStock: shopStock, shopGap: shopGap, shopShort: shopShort, sapShort: sapShort, bad: bad };
  },

  _orderHasProblem(o) {
    if (!this.checked) return false;
    return o.components.some(c => this._cell(c).bad);
  },

  /* ==================== 汇总条 ==================== */

  renderSummary() {
    const el = document.getElementById('orSummary');
    if (!el) return;
    const selOrders = this.orders.filter(o => this.selected.indexOf(o.no) !== -1);
    const isAtp = this.mode === 'atp';
    let compTotal = 0, badCnt = 0, fillableCnt = 0;
    selOrders.forEach(o => {
      compTotal += o.components.length;
      if (this.checked) {
        o.components.forEach(c => {
          const x = this._cell(c);
          if (!x.bad) return;
          badCnt++;
          if (x.atp && x.atp.availDate) fillableCnt++;
        });
      }
    });

    const btnText = this.checking ? '处理中…' : this.checkBtnText();
    const btn = this.checking
      ? '<button class="btn btn-secondary btn-sm" disabled>' + btnText + '</button>'
      : '<button class="btn btn-primary btn-sm" onclick="OrderReadiness.runCheck()">' + btnText + '</button>';

    const stat = this.checking
      ? '<span style="font-size:12px;color:var(--text-secondary);">' + this.checkingText() + '</span>'
      : (this.checked
        ? `<span style="font-size:12px;">${isAtp ? '可用性检查判定' : '按现有库存对比'}缺料 <b style="color:var(--danger);">${badCnt}</b> 项` +
          (isAtp && fillableCnt ? `，其中 <b>${fillableCnt}</b> 项有预计可满足日期` : '') +
          (badCnt ? '' : '，全部齐套') + '</span>'
        : `<span style="font-size:12px;color:var(--text-muted);">勾选订单后点击「${btnText}」，由 SAP 现算</span>`);

    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:16px;padding:8px 24px;background:#fff;border-bottom:1px solid var(--border);flex-wrap:wrap;">
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;">
          <input type="checkbox" ${this.orders.length && this.selected.length === this.orders.length ? 'checked' : ''} onclick="OrderReadiness.selectAll(this.checked)">
          已选 <b>${this.selected.length}</b> / ${this.orders.length} 单
        </label>
        <span style="font-size:12px;color:var(--text-secondary);">组件 ${compTotal} 项</span>
        <span style="width:1px;height:16px;background:var(--border);"></span>
        ${stat}
        <div style="margin-left:auto;display:flex;align-items:center;gap:12px;">
          <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;">
            <input type="checkbox" ${this.onlyProblem ? 'checked' : ''} onchange="OrderReadiness.toggleOnlyProblem(this.checked)">
            只看有问题的
          </label>
          ${btn}
        </div>
      </div>`;
  },

  toggleOnlyProblem(v) {
    this.onlyProblem = v;
    this.renderTable();
  },

  selectAll(v) {
    this.selected = v ? this.orders.map(o => o.no) : [];
    this.checked = false;
    this.stockMap = {};
    this.atpMap = {};
    this.renderSummary();
    this.renderTable();
  },

  toggleSelect(no) {
    const i = this.selected.indexOf(no);
    if (i === -1) this.selected.push(no); else this.selected.splice(i, 1);
    this.checked = false;
    this.stockMap = {};
    this.atpMap = {};
    this.renderSummary();
    this.renderTable();
  },

  toggleGroup(no) {
    const i = this.collapsed.indexOf(no);
    if (i === -1) this.collapsed.push(no); else this.collapsed.splice(i, 1);
    this.renderTable();
  },

  /* ==================== 表格：按订单分组 ==================== */

  renderTable() {
    const el = document.getElementById('orTableWrap');
    if (!el) return;
    if (this.checking) {
      el.innerHTML = '<div class="or-mask">' + this.checkingText() + '</div>';
      return;
    }
    if (!this.orders.length) {
      el.innerHTML = '<div class="or-mask">当前条件下没有流程订单，请调整筛选条件</div>';
      return;
    }

    const body = this.orders.map(o => {
      const sel = this.selected.indexOf(o.no) !== -1;
      const open = this.collapsed.indexOf(o.no) === -1;
      const cells = o.components.map(c => this._cell(c));
      const badge = this._orderBadge(o, cells);
      return `
        <tr class="or-orderrow${sel ? ' or-orderrow-sel' : ''}" onclick="OrderReadiness.toggleGroup('${o.no}')">
          <td style="text-align:center;" onclick="event.stopPropagation()">
            <input type="checkbox" ${sel ? 'checked' : ''} onclick="event.stopPropagation();OrderReadiness.toggleSelect('${o.no}')">
          </td>
          <td class="or-orderno">${esc(o.no)}</td>
          <td style="font-family:monospace;font-size:12px;">${esc(o.mat || '—')}</td>
          <td style="font-weight:600;">${esc(o.name)}</td>
          <td>${esc(o.startDate)}</td>
          <td>${esc(o.endDate)}</td>
          <td class="or-num">${o.components.length}</td>
          <td>${badge}</td>
          <td style="text-align:center;"><span class="or-caret${open ? ' or-caret-open' : ''}"><svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M6 3.5l4.5 4.5L6 12.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
        </tr>
        <tr class="or-detailrow"${open ? '' : ' style="display:none;"'}>
          <td colspan="${OR_ORDER_COLS}" style="padding:0;">${this._detailHtml(o, cells)}</td>
        </tr>`;
    }).join('');

    el.innerHTML = `<table class="data-table or-ordertable" style="min-width:1080px;">
      <thead>${this._orderHeadHtml()}</thead>
      <tbody>${body}</tbody>
    </table>`;
  },

  // 订单列表表头：只放订单层字段，组件列在展开区的内嵌表里
  _orderCols() {
    return [
      { w: 'width:36px;', t: '' },
      { w: 'width:130px;', t: '流程订单号' },
      { w: 'width:110px;', t: '产品编码' },
      { w: '', t: '产品描述' },
      { w: 'width:112px;', t: '计划开始日期' },
      { w: 'width:112px;', t: '计划结束日期' },
      { w: 'width:64px;text-align:right;', t: '组件数' },
      { w: 'width:110px;', t: '检查结果' },
      { w: 'width:44px;', t: '' }
    ];
  },

  _orderHeadHtml() {
    return '<tr>' + this._orderCols().map(c => '<th style="' + c.w + '">' + c.t + '</th>').join('') + '</tr>';
  },

  // 展开区：组件明细内嵌表（自己的表头），未执行可用性检查时给提示
  _detailHtml(o, cells) {
    if (!this.checked) {
      return '<div style="padding:10px 16px 14px 40px;color:var(--text-muted);font-size:12px;">尚未执行可用性检查 —— 勾选订单后点击「' +
        this.checkBtnText() + '」，由 SAP 现算</div>';
    }
    let shown = 0;
    let rows = '';
    o.components.forEach((c, i) => {
      const x = cells[i];
      if (this.onlyProblem && !x.bad) return;
      shown++;
      rows += this._compRow(o, c, x, i);
    });
    if (!shown) {
      return '<div style="padding:10px 16px 14px 40px;color:var(--text-muted);font-size:12px;">' +
        (this.onlyProblem ? '该订单全部组件齐套，无缺料项' : '无组件') + '</div>';
    }
    return `<div class="or-cmpwrap">
      <table class="data-table or-comptable" style="min-width:${this.mode === 'atp' ? 1120 : 1000}px;">
        <thead>${this._headHtml()}</thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  },

  // 组件明细（item）列。工作中心在组件层——同一张订单的组件可能分属不同工作中心
  // 列随检查逻辑变化：现有库存对比 10 列；SAP ATP 11 列（多出 ATP 可用量 / 缺口 / 可用日期）
  _cols() {
    const base = [
      { w: 'width:120px;', t: '组件' },
      { w: '', t: '组件描述' },
      { w: 'width:104px;', t: '工作中心编码' },
      { w: 'width:104px;', t: '工作中心描述' },
      { w: 'width:96px;text-align:right;', t: '需求数量' },
      { w: 'width:104px;', t: '需求日期', tip: '组件需求日期（SAP 预留 RESB-BDTER），ATP 按此日期在时间轴上校验' },
      { w: 'width:96px;text-align:right;', t: '已投料量', tip: 'SAP 已发数量' },
      { w: 'width:100px;text-align:right;', t: '未清数量', tip: '需求数量 − 已投料量' }
    ];
    if (this.mode === 'atp') {
      return base.concat([
        { w: 'width:104px;text-align:right;', t: 'ATP 可用量', tip: '现有库存 + 在途 + 在制 − 安全库存 − 其他订单占用' },
        { w: 'width:96px;text-align:right;', t: 'ATP 缺口', tip: '未清数量 − ATP 可用量，有负数即缺料' },
        { w: 'width:120px;', t: '可用日期', tip: 'SAP 可用日期：时间轴上累计供给能覆盖缺口的日期；空白表示齐套或长期空缺（无可补足来源）' }
      ]);
    }
    return base.concat([
      { w: 'width:104px;text-align:right;', t: '现有库存', tip: 'SAP 库存接口：非限制 + 质检' },
      { w: 'width:120px;text-align:right;', t: '现有库存缺口', tip: '未清数量 − 现有库存（非限制+质检）；不计在途、不扣其他订单占用、不看需求日期' }
    ]);
  },

  _colCount() { return this._cols().length; },

  _headHtml() {
    return '<tr>' + this._cols().map(c =>
      '<th style="' + c.w + '"' + (c.tip ? ' title="' + c.tip + '"' : '') + '>' + c.t + '</th>'
    ).join('') + '</tr>';
  },

  _orderBadge(o, cells, hasProblem) {
    if (this.selected.indexOf(o.no) === -1) return '<span class="badge badge-gray badge-sm">未勾选</span>';
    if (!this.checked) return '<span class="badge badge-gray badge-sm">未检查</span>';
    const bad = cells.filter(x => x.bad).length;
    if (!bad) return '<span class="badge badge-green badge-sm">齐套</span>';
    return '<span class="badge badge-red badge-sm">缺 ' + bad + ' 项</span>';
  },

  _fmt(n) {
    if (n === null || n === undefined || n === '') return '-';
    return Number(n).toLocaleString('zh-CN', { maximumFractionDigits: 3 });
  },

  _compRow(o, c, x, i) {
    // 工作中心取组件自己的；未指定则继承订单的（同一张订单的组件可能分属不同工作中心）
    const wc = c.wc || o.workCenter;
    const head = '<td style="font-family:monospace;font-size:12px;">' + esc(c.mat) + '</td>' +
      '<td>' + esc(c.name) + '</td>' +
      '<td style="font-family:monospace;font-size:11px;">' + esc(wc) + '</td>' +
      '<td>' + esc(OR_WORKCENTER_TEXT[wc] || wc) + '</td>' +
      '<td class="or-num">' + this._fmt(c.reqQty) + ' <span style="color:var(--text-muted);font-size:11px;">' + esc(c.unit) + '</span></td>' +
      '<td style="color:var(--text-secondary);">' + esc(c.reqDate) + '</td>' +
      '<td class="or-num">' + this._fmt(c.issuedQty) + '</td>' +
      '<td class="or-num">' + this._fmt(x.open) + '</td>';

    if (this.mode !== 'atp') {
      const stockCell = x.st
        ? '<span title="非限制 ' + this._fmt(x.st.unrestricted) + ' + 质检 ' + this._fmt(x.st.quality) + '">' + this._fmt(x.shopStock) + '</span>'
        : '<span style="color:var(--text-muted);">—</span>';
      let gapCell = '<span style="color:var(--text-muted);">—</span>';
      if (x.shopGap !== null) {
        gapCell = x.shopGap > 0
          ? '<span style="color:var(--danger);font-weight:700;">-' + this._fmt(x.shopGap) + '</span>'
          : '<span style="color:var(--text-muted);">0</span>';
      }
      return '<tr class="or-comp">' + head +
        '<td class="or-num">' + stockCell + '</td>' +
        '<td class="or-num">' + gapCell + '</td>' +
        '</tr>';
    }

    const atp = x.atp;
    const availCell = atp ? this._fmt(atp.atpQty) : '<span style="color:var(--text-muted);">—</span>';
    // 依据按钮：齐套行也能点开看供给/需求构成
    const reasonBtn = atp
      ? '<span class="or-reasonbtn" title="查看供需明细" onclick="event.stopPropagation();OrderReadiness.openAtpDetail(\'' + o.no + '\',\'' + c.mat + '\')">ⓘ</span>'
      : '';

    // 缺口列只放数字，不再堆叠多行（日期挪到「可用日期」列）
    let gapCell = '<span style="color:var(--text-muted);">—</span>';
    if (atp) {
      gapCell = atp.shortQty > 0
        ? '<span class="or-underline" style="color:var(--danger);font-weight:700;" title="未清数量 − ATP 可用量">-' + this._fmt(atp.shortQty) + '</span>' + reasonBtn
        : '<span style="color:var(--text-muted);">0</span>' + reasonBtn;
    }

    // 可用日期（SAP 可用日期）：只有 SAP 给出日期时才显示；齐套或长期空缺（无可补足来源）留空
    let dateCell = '';
    if (atp && atp.shortQty > 0 && atp.availDate) {
      // 晚于需求日：不再加 ⚠，改为橙字加下划线表示「注意」
      const late = atp.availDate > c.reqDate;
      dateCell = '<span class="' + (late ? 'or-underline ' : '') + '" style="color:' + (late ? 'var(--warning)' : 'var(--text-secondary)') + ';' +
        (late ? 'font-weight:600;' : '') + '" title="' + (late ? '晚于需求日期 ' + esc(c.reqDate) : '可满足') + '">' +
        esc(atp.availDate) + '</span>';
    }

    let row = '<tr class="or-comp">' + head +
      '<td class="or-num">' + availCell + '</td>' +
      '<td class="or-num">' + gapCell + '</td>' +
      '<td>' + dateCell + '</td>' +
      '</tr>';

    return row;
  },

  // ATP 判定依据（导出用的文字版）：由 SAP ATP 返回的供给/需求元素拼出
  _reasons(c, x) {
    const out = [];
    const u = esc(c.unit);
    const atp = x.atp;
    if (!atp) return out;

    (atp.supply || []).forEach(s => {
      if (s.counted) {
        out.push(`${OR_ATP_ELEMENT[s.type] || s.type} <b>${this._fmt(s.qty)}</b> ${u}` +
          (s.doc ? `（凭证 ${esc(s.doc)}，${esc(s.date)}）` : ''));
      } else {
        out.push(`${OR_ATP_ELEMENT[s.type] || s.type} <b>${this._fmt(s.qty)}</b> ${u} <b>未计入可用</b>`);
      }
    });
    (atp.demand || []).forEach(d => {
      out.push(`已扣减${OR_ATP_ELEMENT[d.type] || d.type} <b>${this._fmt(d.qty)}</b> ${u}` +
        (d.doc ? `（订单 ${esc(d.doc)}，${esc(d.date)}）` : ''));
    });
    out.push(`判定：可用量 <b>${this._fmt(atp.atpQty)}</b> ${u} ` +
      (atp.shortQty > 0 ? '<b>不足</b>' : '已覆盖') + `未清需求 <b>${this._fmt(x.open)}</b> ${u}`);
    if (atp.shortQty > 0) {
      out.push(atp.availDate
        ? `需求日 <b>${esc(c.reqDate)}</b> 不足，可用日期 <b>${esc(atp.availDate)}</b> 可补齐`
        : `需求日 <b>${esc(c.reqDate)}</b> 不足，<b>暂无可用日期</b>（无采购订单 / 在制订单可补足，需采购或计划介入）`);
    }
    return out;
  },

  /* ==================== ATP 判定依据弹窗：供给元素 / 需求元素 ==================== */

  openAtpDetail(orderNo, mat) {
    const o = this.orders.filter(k => k.no === orderNo)[0];
    if (!o) return;
    const c = o.components.filter(k => k.mat === mat)[0];
    if (!c) return;
    const x = this._cell(c);
    const atp = x.atp;
    if (!atp) return;

    const u = esc(c.unit);
    const wc = c.wc || o.workCenter;
    const cont = document.getElementById('orModalContainer');
    if (!cont) return;

    // 供应与需求合并成一条时间轴：日期 | 元素类型 | 元素单据 | 需求/供应 | 数量 | 合计
    // 排序：库存（期初）最前 → 其余按日期升序 → 同一天需求在前、供应在后 → 本单需求排最后
    const rows = [];
    (atp.supply || []).forEach(s => {
      rows.push({
        date: s.date, isStock: (s.type === 'STOCK' || s.type === 'QI'),
        type: OR_ATP_ELEMENT[s.type] || s.type, doc: s.doc, dir: 'S', qty: s.qty, counted: s.counted
      });
    });
    (atp.demand || []).forEach(d => {
      rows.push({
        date: d.date, isStock: false,
        type: OR_ATP_ELEMENT[d.type] || d.type, doc: d.doc, dir: 'D', qty: -d.qty, counted: true
      });
    });
    rows.push({
      date: c.reqDate, isStock: false, type: '本单需求', doc: o.no, dir: 'D', qty: -x.open, counted: true, self: true
    });
    rows.sort((a, b) => {
      if (a.isStock !== b.isStock) return a.isStock ? -1 : 1;
      const ad = a.date || '9999', bd = b.date || '9999';
      if (ad !== bd) return ad.localeCompare(bd);
      if (!!a.self !== !!b.self) return a.self ? 1 : -1;
      if (a.dir !== b.dir) return a.dir === 'D' ? -1 : 1;
      return 0;
    });

    let sum = 0;
    const body = rows.map(r => {
      const isD = r.dir === 'D';
      if (r.counted) sum += r.qty;
      const color = isD ? 'var(--danger)' : '#16a34a';
      const qtyTxt = (isD ? '−' : '+') + this._fmt(Math.abs(r.qty)) + ' ' + u;
      const sumTxt = r.counted ? (sum < 0 ? '−' : '+') + this._fmt(Math.abs(sum)) + ' ' + u : '未计入';
      return `<tr${r.self ? ' style="background:#f5f9ff;"' : ''}>
        <td>${r.isStock ? '期初' : (r.date ? esc(r.date) : '—')}</td>
        <td>${r.self ? '<b>' + r.type + '</b>' : r.type}</td>
        <td style="font-family:monospace;font-size:12px;">${r.doc ? esc(r.doc) : '—'}</td>
        <td style="color:${color};">${isD ? '需求' : '供应'}</td>
        <td class="or-num" style="color:${color};">${qtyTxt}</td>
        <td class="or-num" style="font-weight:600;color:${sum < 0 ? 'var(--danger)' : 'var(--text)'};">${sumTxt}</td>
      </tr>`;
    }).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">无供需元素</td></tr>';

    const short = atp.shortQty > 0;
    cont.innerHTML = `
      <div class="modal-backdrop" onclick="OrderReadiness.closeModal()">
        <div class="modal or-modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">判定依据 · <span style="font-family:monospace;color:var(--primary);">${esc(c.mat)}</span> ${esc(c.name)}</div>
            <button class="modal-close" onclick="OrderReadiness.closeModal()">✕</button>
          </div>
          <div class="modal-body">
            <div class="detail-grid" style="grid-template-columns:repeat(4,minmax(0,1fr));">
              <div class="detail-item"><dt>流程订单</dt><dd style="font-family:monospace;">${esc(o.no)}</dd></div>
              <div class="detail-item"><dt>工作中心</dt><dd>${esc(wc)} ${esc(OR_WORKCENTER_TEXT[wc] || '')}</dd></div>
              <div class="detail-item"><dt>需求日期</dt><dd>${esc(c.reqDate)}</dd></div>
              <div class="detail-item"><dt>未清数量</dt><dd><b>${this._fmt(x.open)} ${u}</b>（需求 ${this._fmt(c.reqQty)} − 已投料 ${this._fmt(c.issuedQty)}）</dd></div>
            </div>
            <div class="form-section">
              <div class="form-section-title">供需明细（按日期排序，同日需求在前）</div>
              <table class="data-table" style="width:100%;">
                <thead><tr>
                  <th style="width:110px;">日期</th><th style="width:120px;">元素类型</th><th style="width:130px;">元素单据</th>
                  <th style="width:80px;">需求/供应</th><th style="text-align:right;">数量</th>
                  <th style="width:120px;text-align:right;">合计</th>
                </tr></thead>
                <tbody>${body}</tbody>
              </table>
            </div>
            <div style="padding:12px 14px;border-radius:var(--radius-sm);background:${short ? '#fef2f2' : '#f0fdf4'};border:1px solid ${short ? '#fecaca' : '#bbf7d0'};">
              <div style="font-size:13px;">需求日可用量 <b>${this._fmt(atp.atpQty)} ${u}</b>　未清需求 <b>${this._fmt(x.open)} ${u}</b>　${
                short ? `缺口 <b style="color:var(--danger);">−${this._fmt(atp.shortQty)} ${u}</b>` : '<b style="color:#16a34a;">齐套</b>'}</div>
              <div style="font-size:13px;margin-top:4px;color:var(--text-secondary);">${
                short
                  ? (atp.availDate
                    ? `可用日期 <b>${esc(atp.availDate)}</b> —— 该日有供应元素到货，合计由负转正`
                    : '<b style="color:var(--danger);">暂无可用日期</b> —— 无采购订单 / 在制订单可补足，需采购或计划介入')
                  : '需求日即可满足，无需等待后续供应'}</div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="OrderReadiness.closeModal()">关闭</button>
          </div>
        </div>
      </div>`;
  },

  closeModal() {
    const cont = document.getElementById('orModalContainer');
    if (cont) cont.innerHTML = '';
  },

  /* ==================== 操作 ==================== */

  resetFilter() {
    ['orOrderNo', 'orProductCode', 'orMatCode', 'orOrderStatus'].forEach(id => {
      const e = document.getElementById(id); if (e) e.value = '';
    });
    const wc = document.getElementById('orWorkCenter');
    if (wc && OR_CURRENT_USER.isPlantLevel) wc.value = '';
    this.setRange('week', true);
    this.query();
    if (window.QueryVariant) QueryVariant.resetSelection('order-readiness');
  },

  refresh() {
    if (!this.checked) return this.query();
    this.runCheck();
  },

  exportData() {
    const isAtp = this.mode === 'atp';
    const rows = [];
    this.orders.forEach(o => {
      if (this.selected.indexOf(o.no) === -1) return;
      o.components.forEach(c => {
        const x = this._cell(c);
        if (this.onlyProblem && !x.bad) return;
        const wc = c.wc || o.workCenter;
        const base = [
          o.no, o.mat || '', o.name, o.startDate, o.endDate,
          c.mat, c.name, wc, OR_WORKCENTER_TEXT[wc] || wc, c.unit, c.reqQty, c.reqDate, c.issuedQty, x.open
        ];
        if (isAtp) {
          rows.push(base.concat([
            x.atp ? x.atp.atpQty : '', x.atp ? x.atp.shortQty : '', x.atp ? x.atp.availDate : '',
            x.sapShort ? '缺料' : (this.checked ? '齐套' : ''),
            x.atp ? this._reasons(c, x).join('；').replace(/<[^>]+>/g, '') : ''
          ]).join(','));
        } else {
          rows.push(base.concat([
            x.st ? x.st.unrestricted : '', x.st ? x.st.quality : '', x.shopStock === null ? '' : x.shopStock,
            x.shopGap === null ? '' : (x.shopGap > 0 ? -x.shopGap : 0),
            x.shopShort ? '缺料' : (this.checked ? '齐套' : '')
          ]).join(','));
        }
      });
    });
    if (!rows.length) return toast('无数据可导出');
    const baseHead = [
      '流程订单号', '产品编码', '产品描述', '计划开始日期', '计划结束日期',
      '组件', '组件描述', '组件工作中心编码', '组件工作中心描述', '单位', '需求数量', '需求日期', '已投料量', '未清数量'
    ];
    const head = isAtp
      ? baseHead.concat(['ATP可用量', 'ATP缺口', '可用日期', 'ATP结论', '判定依据']).join(',')
      : baseHead.concat(['非限制库存', '质检库存', '现有库存合计', '现有库存缺口', '结论']).join(',');
    const csv = '\uFEFF' + head + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '可用性检查_' + (this.mode === 'atp' ? 'ATP' : '现有库存对比') + '.csv';
    a.click();
    toast('已导出 ' + rows.length + ' 行');
  }
};

// ===== 查询变式注册（通用模块 V3/js/core/query-variant.js）=====
if (window.QueryVariant) {
  QueryVariant.register({
    pageId: 'order-readiness',
    fields: ['orPlant', 'orDateFrom', 'orDateTo', 'orOrderStatus', 'orOrderNo', 'orMatCode', 'orWorkCenter'],
    textFields: ['orOrderNo', 'orMatCode'],
    labels: {
      orPlant: '工厂', orDateFrom: '计划开始日期(起)', orDateTo: '计划开始日期(止)',
      orOrderStatus: '订单状态', orOrderNo: '流程订单号', orProductCode: '产品编码', orMatCode: '物料编码/描述', orWorkCenter: '工作中心'
    },
    onApply: function () { OrderReadiness.query(); }
  });
}
