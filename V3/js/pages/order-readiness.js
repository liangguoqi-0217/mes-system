/* ==================== 生产管理 → 订单齐套检查 ====================
 * 业务背景：车间用户每天打开本页，勾选自己车间本周要生产的订单，让系统逐项对比
 *          订单组件的未清需求与供给，回答"缺不缺料"。
 *
 * 两套计算逻辑并列对照（差异很大，不是同一套算法的两个角度）：
 *   逻辑一 · 现有库存对比（静态）：未清需求 vs 现有库存（非限制 + 质检）
 *            —— 不计在途、不扣其他订单占用、不看需求日期；车间用户熟悉的心智模型
 *   逻辑二 · SAP ATP 可用性检查（动态）：
 *            —— 计入在途采购 / 在制订单 / 调拨在途，扣减其他订单占用与安全库存，
 *               并按组件需求日期在时间轴上校验
 *
 * 两套逻辑的数据全部来自 SAP，且同一时刻取数，保证同源可比（不会出现两套库存打架）：
 *   · 库存  → SAP 库存查询接口（复用现有接口，取 非限制 + 质检）
 *   · ATP   → SAP 批量可用性检查接口（一次传入订单清单，SAP 内部批量算，一次返回）
 *
 * 不落表：每次点「检查齐套」由 SAP 现算，结果只存在于当前页面。
 *
 * 交互：勾选订单 → 检查齐套 → 按订单分组展示组件，齐套的订单默认折叠
 *       两套结论不一致的行标记「差异」，可展开查看 SAP 为什么这么判
 *
 * 权限：车间用户锁定 workCenter，仅能看到本车间订单；全厂用户可看全部车间。
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

// 当前登录用户（权限模拟）。isPlantLevel=false 时锁定本车间。
const OR_CURRENT_USER = {
  name: '车间用户A',
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
    no: '3000000123', name: '阿莫西林颗粒制剂', plant: '1000', workCenter: 'WC-PROD-01',
    startDate: orAddDays(0), endDate: orAddDays(8), qty: '1200', unit: 'KG', status: 'REL', statusName: '已下达',
    components: [
      { mat: 'MAT-10001', name: '阿莫西林原料药', unit: 'KG', reqQty: 600, issuedQty: 0, reqDate: orAddDays(0) },
      { mat: 'MAT-10002', name: '淀粉辅料', unit: 'KG', reqQty: 300, issuedQty: 0, reqDate: orAddDays(1) },
      { mat: 'MAT-10003', name: '硬脂酸镁', unit: 'KG', reqQty: 5, issuedQty: 0, reqDate: orAddDays(1) },
      { mat: 'MAT-10005', name: '胶囊壳#0', unit: 'EA', reqQty: 500000, issuedQty: 0, reqDate: orAddDays(2) },
      { mat: 'MAT-10009', name: '蔗糖', unit: 'KG', reqQty: 120, issuedQty: 0, reqDate: orAddDays(2) },
      { mat: 'MAT-10011', name: '纯化水', unit: 'L', reqQty: 800, issuedQty: 0, reqDate: orAddDays(0) }
    ]
  },
  {
    no: '3000000167', name: '阿莫西林胶囊包装', plant: '1000', workCenter: 'WC-PROD-01',
    startDate: orAddDays(2), endDate: orAddDays(9), qty: '500', unit: 'KG', status: 'REL', statusName: '已下达',
    components: [
      { mat: 'MAT-10005', name: '胶囊壳#0', unit: 'EA', reqQty: 300000, issuedQty: 0, reqDate: orAddDays(2) },
      { mat: 'MAT-10001', name: '阿莫西林原料药', unit: 'KG', reqQty: 400, issuedQty: 100, reqDate: orAddDays(2) },
      { mat: 'MAT-10010', name: '药用铝箔', unit: 'KG', reqQty: 80, issuedQty: 0, reqDate: orAddDays(3) }
    ]
  },
  {
    no: '3000000201', name: '布洛芬片（第一批）', plant: '1000', workCenter: 'WC-PROD-01',
    startDate: orAddDays(1), endDate: orAddDays(4), qty: '600', unit: 'KG', status: 'REL', statusName: '已下达',
    components: [
      { mat: 'MAT-10004', name: '布洛芬原料', unit: 'KG', reqQty: 200, issuedQty: 0, reqDate: orAddDays(1) },
      { mat: 'MAT-10002', name: '淀粉辅料', unit: 'KG', reqQty: 100, issuedQty: 0, reqDate: orAddDays(1) }
    ]
  },
  {
    no: '3000000145', name: '维生素C片', plant: '1000', workCenter: 'WC-PROD-02',
    startDate: orAddDays(0), endDate: orAddDays(6), qty: '800', unit: 'KG', status: 'REL', statusName: '已下达',
    components: [
      { mat: 'MAT-10004', name: '维生素C原料', unit: 'KG', reqQty: 150, issuedQty: 0, reqDate: orAddDays(0) },
      { mat: 'MAT-10002', name: '淀粉辅料', unit: 'KG', reqQty: 200, issuedQty: 0, reqDate: orAddDays(0) }
    ]
  },
  {
    no: '3000000189', name: '注射用水配制', plant: '1000', workCenter: 'WC-WT-01',
    startDate: orAddDays(3), endDate: orAddDays(5), qty: '5000', unit: 'L', status: 'REL', statusName: '已下达',
    components: [
      { mat: 'MAT-20001', name: '注射用水', unit: 'L', reqQty: 5000, issuedQty: 0, reqDate: orAddDays(3) }
    ]
  },
  {
    no: '3000000192', name: '维生素C片（第二批）', plant: '1000', workCenter: 'WC-PROD-02',
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
  '1000|MAT-20001': { unrestricted: 3000, quality: 200 }
};

// ATP 接口：工厂+物料 → 可用量/缺料量/可满足日 + 构成明细（构成明细用于生成差异原因）
//   resbOther   被其他订单预留占用（现有库存对比不扣，SAP 扣）
//   qiIncluded  质检库存是否计入可用（GMP 下未放行不计入）
//   po/prd/tr   在途采购 / 在制订单 / 调拨在途（现有库存对比不含，SAP 算作供给）
//   safety      扣减的安全库存
const OR_ATP_DB = {
  '1000|MAT-10001': { atpQty: 220, shortQty: 380, availDate: orAddDays(6), safety: 0, po: 300, prd: 0, tr: 0, resbOther: 580, resbOtherCnt: 3, qiIncluded: false, poDoc: '4500018765', prdDoc: '' },
  '1000|MAT-10002': { atpQty: 200, shortQty: 100, availDate: orAddDays(3), safety: 0, po: 0, prd: 150, tr: 0, resbOther: 200, resbOtherCnt: 2, qiIncluded: false, poDoc: '', prdDoc: '3000000255' },
  '1000|MAT-10003': { atpQty: 3, shortQty: 2, availDate: '', safety: 0, po: 0, prd: 0, tr: 0, resbOther: 0, resbOtherCnt: 0, qiIncluded: false, poDoc: '', prdDoc: '' },
  '1000|MAT-10004': { atpQty: 400, shortQty: 0, availDate: '', safety: 0, po: 0, prd: 0, tr: 0, resbOther: 100, resbOtherCnt: 1, qiIncluded: false, poDoc: '', prdDoc: '' },
  '1000|MAT-10005': { atpQty: 300000, shortQty: 200000, availDate: orAddDays(1), safety: 0, po: 400000, prd: 0, tr: 0, resbOther: 300000, resbOtherCnt: 2, qiIncluded: false, poDoc: '4500018790', prdDoc: '' },
  '1000|MAT-10009': { atpQty: 100, shortQty: 20, availDate: '', safety: 50, po: 0, prd: 0, tr: 0, resbOther: 0, resbOtherCnt: 0, qiIncluded: false, poDoc: '', prdDoc: '' },
  '1000|MAT-10010': { atpQty: 50, shortQty: 30, availDate: orAddDays(2), safety: 0, po: 0, prd: 0, tr: 100, resbOther: 0, resbOtherCnt: 0, qiIncluded: false, poDoc: '', prdDoc: '' },
  '1000|MAT-10011': { atpQty: 1200, shortQty: 0, availDate: '', safety: 0, po: 0, prd: 0, tr: 0, resbOther: 300, resbOtherCnt: 1, qiIncluded: false, poDoc: '', prdDoc: '' },
  '1000|MAT-20001': { atpQty: 3000, shortQty: 0, availDate: '', safety: 0, po: 0, prd: 0, tr: 0, resbOther: 500, resbOtherCnt: 1, qiIncluded: false, poDoc: '', prdDoc: '' }
};

/* ---------- SAP 接口层 ----------
 * 原型用 setTimeout 模拟；接真实环境时只替换这两个方法体，页面其余部分不用动。
 *   getStock → 复用现有「MES 查询 SAP 库存」接口
 *   getAtp   → SAP 侧新增批量 RFC：ZMES_PP_ATP_CHECK（一次传订单清单，SAP 内批量算，一次返回）
 */

const OrSapApi = {
  // 库存：入参 工厂 + 物料清单，出参 { '物料号': {unrestricted, quality} }
  getStock(plant, mats) {
    const out = {};
    mats.forEach(m => { out[m] = OR_STOCK_DB[plant + '|' + m] || { unrestricted: 0, quality: 0 }; });
    return new Promise(resolve => setTimeout(() => resolve(out), 400));
  },
  // ATP：入参 工厂 + 订单号清单，出参 { '物料号': {atpQty, shortQty, availDate, ...} }
  getAtp(plant, orderNos) {
    const mats = new Set();
    OR_ORDERS.forEach(o => {
      if (orderNos.indexOf(o.no) === -1) return;
      o.components.forEach(c => mats.add(c.mat));
    });
    const out = {};
    mats.forEach(m => {
      out[m] = OR_ATP_DB[plant + '|' + m] || { atpQty: 0, shortQty: 0, availDate: '', safety: 0, po: 0, prd: 0, tr: 0, resbOther: 0, resbOtherCnt: 0, qiIncluded: false, poDoc: '', prdDoc: '' };
    });
    return new Promise(resolve => setTimeout(() => resolve(out), 900));
  }
};

/* ==================== 页面对象 ==================== */

const OrderReadiness = {
  moreOpen: false,
  rangeKind: 'week',
  orders: [],          // 当前筛选出的订单
  selected: [],        // 勾选的订单号
  collapsed: [],       // 折叠的订单号
  checked: false,      // 是否已执行 SAP 检查
  checking: false,
  onlyProblem: false,
  stockMap: {},
  atpMap: {},

  /* ==================== 渲染 ==================== */

  render() {
    return `
      <div class="or-page" style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:14px 24px;flex-shrink:0;">
          <div style="font-size:18px;font-weight:700;">订单齐套检查</div>
          <div style="font-size:12px;opacity:0.85;margin-top:3px;line-height:1.75;">
            组件未清需求按两套不同的计算逻辑分别校验，结果并列对照：<br>
            ① <b>现有库存对比</b> —— 只与仓库现有量比（非限制 + 质检），<b>不计在途、不扣其他订单占用、不看需求日期</b>；<br>
            ② <b>SAP ATP 可用性检查</b> —— 计入在途采购 / 在制订单 / 调拨在途，扣减其他订单占用与安全库存，并<b>按组件需求日期校验</b>。<br>
            两套数据均由 SAP 现算；结论不一致的行标记「差异」，展开可查看原因。
          </div>
        </div>

        <div id="orFilterBar" style="flex-shrink:0;"></div>
        <div id="orSummary" style="flex-shrink:0;"></div>

        <style>
          #orTableWrap { scrollbar-width: thin; scrollbar-color: rgba(203,213,225,0.6) transparent; }
          #orTableWrap::-webkit-scrollbar { width: 6px; height: 0; }
          #orTableWrap::-webkit-scrollbar-thumb { background: rgba(203,213,225,0.6); border-radius: 3px; }
          #orTableWrap::-webkit-scrollbar-track { background: transparent; }
          .or-group td { background: #f8fafc; font-size: 13px; cursor: pointer; }
          .or-group:hover td { background: #f1f5f9; }
          .or-caret { display:inline-block; width:14px; color: var(--text-muted); font-size:11px; }
          .or-orderno { font-family: monospace; font-size: 12px; font-weight: 700; color: var(--primary); }
          .or-comp td { font-size: 13px; }
          .or-num { text-align: right; font-variant-numeric: tabular-nums; }
          .or-sub { display:block; font-size: 11px; color: var(--text-muted); margin-top: 1px; }
          .or-diffrow td { background: #fcfcfd; }
          .or-diffrow td:first-child { border-left: 2px solid var(--warning); }
          .or-diffbtn { color: #92400e; cursor: pointer; font-size: 12px; }
          .or-reason { font-size: 12px; color: var(--text-secondary); line-height: 1.9; }
          .or-reason li { margin: 0; }
          .or-mask { padding: 60px; text-align: center; color: var(--text-muted); font-size: 13px; }
        </style>

        <div id="orTableWrap" style="flex:1;overflow-y:auto;overflow-x:auto;width:100%;min-width:0;background:#fff;"></div>
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

  /* ==================== 筛选栏 ==================== */

  renderFilterBar() {
    const el = document.getElementById('orFilterBar');
    if (!el) return;
    const isPlant = OR_CURRENT_USER.isPlantLevel;
    const plantOpts = Object.keys(OR_PLANT_TEXT)
      .map(k => '<option value="' + k + '">' + k + ' ' + OR_PLANT_TEXT[k] + '</option>').join('');
    const wcOpts = Object.keys(OR_WORKCENTER_TEXT)
      .map(k => '<option value="' + k + '">' + OR_WORKCENTER_TEXT[k] + '</option>').join('');

    el.innerHTML = `
      <div class="filter-bar" style="flex-wrap:wrap;">
        <div class="filter-group"><label>工厂</label>
          <select id="orPlant"${isPlant ? '' : ' disabled'}>
            ${isPlant ? plantOpts : '<option value="' + OR_CURRENT_USER.plant + '">' + OR_CURRENT_USER.plant + ' ' + OR_PLANT_TEXT[OR_CURRENT_USER.plant] + '</option>'}
          </select>
        </div>
        <div class="filter-group"><label>计划开始日</label>
          <div style="display:flex;align-items:center;gap:4px;">
            <input type="date" id="orDateFrom"><span style="color:var(--text-muted);">~</span><input type="date" id="orDateTo">
          </div>
        </div>
        <div class="filter-group"><label>订单状态</label>
          <select id="orOrderStatus">
            <option value="">全部</option>
            <option value="REL">已下达</option>
            <option value="CRTD">已创建</option>
            <option value="TECO">技术性完成</option>
          </select>
        </div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="OrderReadiness.query()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="OrderReadiness.exportData()">导出</button>
          <button class="btn btn-secondary btn-sm" onclick="OrderReadiness.refresh()">刷新</button>
          <button class="btn btn-secondary btn-sm" onclick="OrderReadiness.resetFilter()">重置</button>
          <button class="btn btn-secondary btn-sm" id="orMoreBtn" onclick="OrderReadiness.toggleMore()">${this.moreOpen ? '收起 ▴' : '更多条件 ▾'}</button>
        </div>
        <div id="orMoreBar" style="display:${this.moreOpen ? 'flex' : 'none'};flex-wrap:wrap;gap:12px;width:100%;padding:0;border:none;background:transparent;">
          <div class="filter-group"><label>流程订单号</label><input type="text" id="orOrderNo" placeholder="如 3000000123"></div>
          <div class="filter-group"><label>物料号/描述</label><input type="text" id="orMatCode" placeholder="物料编码或名称"></div>
          <div class="filter-group"><label>车间</label>
            <select id="orWorkCenter"${isPlant ? '' : ' disabled'}>
              ${isPlant
                ? '<option value="">全部车间</option>' + wcOpts
                : '<option value="' + OR_CURRENT_USER.workCenter + '">' + OR_WORKCENTER_TEXT[OR_CURRENT_USER.workCenter] + '</option>'}
            </select>
          </div>
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

  /* ==================== 检查齐套：调 SAP 现算 ==================== */

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

    Promise.all([
      OrSapApi.getStock(plant, mats),
      OrSapApi.getAtp(plant, sel)
    ]).then(res => {
      this.stockMap = res[0];
      this.atpMap = res[1];
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
    const sapShort = atp ? atp.shortQty > 0 : null;
    // 两套逻辑都有结果时才判定差异
    const diff = shopStock !== null && !!atp && shopShort !== sapShort;
    return { open: open, st: st, atp: atp, shopStock: shopStock, shopGap: shopGap, shopShort: shopShort, sapShort: sapShort, diff: diff };
  },

  _orderHasProblem(o) {
    if (!this.checked) return false;
    return o.components.some(c => {
      const x = this._cell(c);
      return x.shopShort || x.sapShort || x.diff;
    });
  },

  /* ==================== 汇总条 ==================== */

  renderSummary() {
    const el = document.getElementById('orSummary');
    if (!el) return;
    const selOrders = this.orders.filter(o => this.selected.indexOf(o.no) !== -1);
    let compTotal = 0, shopShort = 0, sapShort = 0, diffCnt = 0;
    selOrders.forEach(o => {
      compTotal += o.components.length;
      if (this.checked) {
        o.components.forEach(c => {
          const x = this._cell(c);
          if (x.shopShort) shopShort++;
          if (x.sapShort) sapShort++;
          if (x.diff) diffCnt++;
        });
      }
    });

    const btn = this.checking
      ? '<button class="btn btn-secondary btn-sm" disabled>检查中…</button>'
      : '<button class="btn btn-primary btn-sm" onclick="OrderReadiness.runCheck()">检查齐套</button>';

    const stat = this.checking
      ? '<span style="font-size:12px;color:var(--text-secondary);">SAP 正在执行可用性检查…</span>'
      : (this.checked
        ? `<span style="font-size:12px;">按现有库存对比缺 <b style="color:var(--danger);">${shopShort}</b> 项
             · 按 ATP 可用性检查缺 <b style="color:var(--danger);">${sapShort}</b> 项
             · 两者结论不一致 <b style="color:#92400e;">${diffCnt}</b> 项</span>`
        : '<span style="font-size:12px;color:var(--text-muted);">勾选订单后点击「检查齐套」，由 SAP 现算</span>');

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
      el.innerHTML = '<div class="or-mask">SAP 正在执行可用性检查…</div>';
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
      const hasProblem = this._orderHasProblem(o);
      const badge = this._orderBadge(o, cells, hasProblem);
      let rows = `
        <tr class="or-group" onclick="OrderReadiness.toggleGroup('${o.no}')">
          <td colspan="8" style="padding:9px 14px;">
            <span class="or-caret">${open ? '▾' : '▸'}</span>
            <input type="checkbox" ${sel ? 'checked' : ''} style="margin-right:8px;" onclick="event.stopPropagation();OrderReadiness.toggleSelect('${o.no}')">
            <span class="or-orderno">${esc(o.no)}</span>
            <span style="margin-left:8px;font-weight:600;">${esc(o.name)}</span>
            <span style="margin-left:12px;color:var(--text-secondary);">${esc(o.startDate)} 开工</span>
            <span style="margin-left:8px;color:var(--text-muted);">${o.components.length} 项组件</span>
            <span style="margin-left:12px;">${badge}</span>
          </td>
        </tr>`;
      if (open) {
        if (!this.checked) {
          rows += '<tr><td colspan="8" style="padding:6px 14px 10px 40px;color:var(--text-muted);font-size:12px;">尚未执行 SAP 检查 —— 点击「检查齐套」，由 SAP 现算两套逻辑的结果</td></tr>';
        } else {
          let shown = 0;
          o.components.forEach((c, i) => {
            const x = cells[i];
            if (this.onlyProblem && !(x.shopShort || x.sapShort || x.diff)) return;
            shown++;
            rows += this._compRow(o, c, x, i);
          });
          if (!shown) {
            rows += '<tr><td colspan="8" style="padding:6px 14px 10px 40px;color:var(--text-muted);font-size:12px;">' +
              (this.onlyProblem ? '该订单全部组件齐套，无问题项' : '无组件') + '</td></tr>';
          }
        }
      }
      return rows;
    }).join('');

    el.innerHTML = `<table class="data-table" style="min-width:1080px;">
      <thead><tr>
        <th style="width:130px;">物料号</th>
        <th>物料描述</th>
        <th style="width:110px;text-align:right;" title="需求数量 − 已投料数量">未清需求</th>
        <th style="width:130px;text-align:right;" title="SAP 库存接口：非限制 + 质检">现有库存 <span style="color:#94a3b8;">ⓘ</span></th>
        <th style="width:130px;text-align:right;" title="现有库存对比：未清需求 − 现有库存（非限制+质检），不计在途、不扣其他订单占用、不看需求日期">现有库存缺口</th>
        <th style="width:110px;text-align:right;" title="SAP ATP 可用量：计入在途/在制/调拨，扣减其他订单占用与安全库存">ATP 可用量</th>
        <th style="width:130px;text-align:right;" title="SAP ATP 缺料量与可满足日期（按组件需求日期校验）">ATP 缺口</th>
        <th style="width:100px;text-align:center;">逻辑差异</th>
      </tr></thead>
      <tbody>${body}</tbody>
    </table>`;
  },

  _orderBadge(o, cells, hasProblem) {
    if (this.selected.indexOf(o.no) === -1) return '<span class="badge badge-gray badge-sm">未勾选</span>';
    if (!this.checked) return '<span class="badge badge-gray badge-sm">未检查</span>';
    const shop = cells.filter(x => x.shopShort).length;
    const sap = cells.filter(x => x.sapShort).length;
    const diff = cells.filter(x => x.diff).length;
    if (!shop && !sap) return '<span class="badge badge-green badge-sm">齐套</span>';
    let s = '';
    if (shop) s += '<span class="badge badge-red badge-sm">库存缺 ' + shop + '</span> ';
    if (sap) s += '<span class="badge badge-red badge-sm">ATP 缺 ' + sap + '</span> ';
    if (diff) s += '<span class="badge badge-yellow badge-sm">差异 ' + diff + '</span>';
    return s;
  },

  _fmt(n) {
    if (n === null || n === undefined || n === '') return '-';
    return Number(n).toLocaleString('zh-CN', { maximumFractionDigits: 3 });
  },

  _compRow(o, c, x, i) {
    const diffId = 'orDiff_' + o.no + '_' + i;

    const stockCell = x.st
      ? `<span title="非限制 ${this._fmt(x.st.unrestricted)} + 质检 ${this._fmt(x.st.quality)}">${this._fmt(x.shopStock)}</span>`
      : '<span style="color:var(--text-muted);">—</span>';

    let shopCell = '<span style="color:var(--text-muted);">—</span>';
    if (x.shopGap !== null) {
      shopCell = x.shopGap > 0
        ? '<span style="color:var(--danger);font-weight:700;">-' + this._fmt(x.shopGap) + '</span>'
        : '<span style="color:var(--text-muted);">0</span>';
    }

    let atpCell = '<span style="color:var(--text-muted);">—</span>';
    let gapCell = '<span style="color:var(--text-muted);">—</span>';
    if (x.atp) {
      atpCell = this._fmt(x.atp.atpQty);
      gapCell = x.atp.shortQty > 0
        ? '<span style="color:var(--danger);font-weight:700;">-' + this._fmt(x.atp.shortQty) + '</span>'
          + (x.atp.availDate
            ? '<span class="or-sub">' + esc(x.atp.availDate) + ' 可满足</span>'
            : '<span class="or-sub" style="color:var(--danger);">无可补足来源</span>')
        : '<span style="color:var(--text-muted);">0</span>';
    }

    const diffCell = x.diff
      ? '<span class="or-diffbtn" onclick="OrderReadiness.toggleDiff(\'' + diffId + '\')">⚠ 有差异</span>'
      : '<span style="color:var(--text-muted);">—</span>';

    let row = `<tr class="or-comp">
        <td style="padding-left:40px;font-family:monospace;font-size:12px;">${esc(c.mat)}</td>
        <td>${esc(c.name)}</td>
        <td class="or-num">${this._fmt(x.open)} <span style="color:var(--text-muted);font-size:11px;">${esc(c.unit)}</span></td>
        <td class="or-num">${stockCell}</td>
        <td class="or-num">${shopCell}</td>
        <td class="or-num">${atpCell}</td>
        <td class="or-num">${gapCell}</td>
        <td style="text-align:center;">${diffCell}</td>
      </tr>`;

    if (x.diff) {
      row += `<tr class="or-diffrow" id="${diffId}" style="display:none;">
        <td colspan="8" style="padding:8px 14px 12px 40px;">
          <div class="or-reason">
            <div style="font-weight:600;color:#92400e;margin-bottom:2px;">⚠ 两套计算逻辑结论不一致 —— ATP 为什么这么判：</div>
            <ul style="margin:0;padding-left:18px;">${this._reasons(c, x).map(r => '<li>' + r + '</li>').join('')}</ul>
          </div>
        </td>
      </tr>`;
    }
    return row;
  },

  // 差异原因：用 SAP ATP 返回的构成明细，逐条说明两套计算逻辑差在哪
  _reasons(c, x) {
    const out = [];
    const u = esc(c.unit);
    const st = x.st, atp = x.atp;
    if (!st || !atp) return out;

    if (atp.resbOther > 0) {
      out.push(`现有库存 <b>${this._fmt(x.shopStock)}</b> ${u} 中，<b>${this._fmt(atp.resbOther)}</b> ${u} 已被其他 <b>${atp.resbOtherCnt}</b> 张订单预留占用（现有库存对比不扣占用，SAP 扣）`);
    }
    if (!atp.qiIncluded && st.quality > 0) {
      out.push(`其中 <b>${this._fmt(st.quality)}</b> ${u} 处于质检状态未放行，SAP 未计入可用（GMP 下不可投料）`);
    }
    if (atp.safety > 0) {
      out.push(`已扣减安全库存 <b>${this._fmt(atp.safety)}</b> ${u}（现有库存对比不扣）`);
    }
    if (atp.po > 0) {
      out.push(`采购订单 <b>${esc(atp.poDoc)}</b> 在途 <b>${this._fmt(atp.po)}</b> ${u}（现有库存对比不含在途）`);
    }
    if (atp.prd > 0) {
      out.push(`在制订单 <b>${esc(atp.prdDoc)}</b> 预计产出 <b>${this._fmt(atp.prd)}</b> ${u}`);
    }
    if (atp.tr > 0) {
      out.push(`调拨在途 <b>${this._fmt(atp.tr)}</b> ${u}`);
    }
    if (atp.shortQty > 0) {
      out.push(atp.availDate
        ? `需求日 <b>${esc(c.reqDate)}</b> 不足，预计 <b>${esc(atp.availDate)}</b> 可补齐`
        : `需求日 <b>${esc(c.reqDate)}</b> 不足，且 <b>无可补足来源</b>（无在途采购、无在制订单）`);
    }
    if (x.shopShort && !x.sapShort) {
      out.push(`现有库存对比判缺、ATP 判不缺：差异来自上述供给项计入后，ATP 可用量 <b>${this._fmt(atp.atpQty)}</b> ${u} 已覆盖未清需求 <b>${this._fmt(x.open)}</b> ${u}`);
    }
    return out;
  },

  toggleDiff(id) {
    const tr = document.getElementById(id);
    if (tr) tr.style.display = tr.style.display === 'none' ? '' : 'none';
  },

  /* ==================== 操作 ==================== */

  resetFilter() {
    ['orOrderNo', 'orMatCode', 'orOrderStatus'].forEach(id => {
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
    const rows = [];
    this.orders.forEach(o => {
      if (this.selected.indexOf(o.no) === -1) return;
      o.components.forEach(c => {
        const x = this._cell(c);
        if (this.onlyProblem && !(x.shopShort || x.sapShort || x.diff)) return;
        rows.push([
          o.no, o.name, o.startDate, c.mat, c.name, c.unit,
          c.reqQty, c.issuedQty, x.open, c.reqDate,
          x.st ? x.st.unrestricted : '', x.st ? x.st.quality : '', x.shopStock === null ? '' : x.shopStock,
          x.shopGap === null ? '' : (x.shopGap > 0 ? -x.shopGap : 0), x.shopShort ? '缺料' : (this.checked ? '齐套' : ''),
          x.atp ? x.atp.atpQty : '', x.atp ? x.atp.shortQty : '', x.atp ? x.atp.availDate : '',
          x.sapShort ? '缺料' : (this.checked ? '齐套' : ''),
          x.diff ? '有差异' : '',
          x.diff ? this._reasons(c, x).join('；').replace(/<[^>]+>/g, '') : ''
        ].join(','));
      });
    });
    if (!rows.length) return toast('无数据可导出');
    const head = ['流程订单号', '订单名称', '计划开始日', '物料号', '物料描述', '单位', '需求数量', '已投料', '未清需求', '需求日期',
      '非限制库存', '质检库存', '现有库存合计', '现有库存对比缺口', '现有库存对比结论',
      'ATP可用量', 'ATP缺料量', 'ATP可满足日期', 'ATP结论', '逻辑差异', '差异原因'].join(',');
    const csv = '\uFEFF' + head + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '订单齐套检查.csv';
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
      orPlant: '工厂', orDateFrom: '计划开始日(起)', orDateTo: '计划开始日(止)',
      orOrderStatus: '订单状态', orOrderNo: '流程订单号', orMatCode: '物料号/描述', orWorkCenter: '车间'
    },
    onApply: function () { OrderReadiness.query(); }
  });
}
