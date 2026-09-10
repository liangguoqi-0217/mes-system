/* ==================== 系统管理 · 定时任务 ====================
 * 统一管理所有轮询 SAP 的后台定时 Job：
 *   1) 任务清单 —— 有哪些 Job、跑的什么接口、查询条件、周期、最近结果
 *   2) 执行日志 —— 每次执行的触发方式/参数快照/耗时/成功失败/条数
 *   3) 接口注册 —— SAP 接口目录及其「查询条件参数模板」（元数据驱动，
 *                  不同接口查询条件不同，新增接口只需在此登记字段）
 * 权限：仅管理员可见（菜单与路由双重控制，见 js/main.js）
 * 数据：纯 mock，存放于内存数组，刷新页面后重置
 * ============================================================ */

/* ---------- 权限 ---------- */
function isJobAdmin() {
  return (window.currentUserId === 'admin') || (window.currentUserRole === 'admin');
}

/* ---------- 通用小工具 ---------- */
function jobPad(n) { return String(n).padStart(2, '0'); }
function jobNowStr(d) {
  const dt = d || new Date();
  return dt.getFullYear() + '-' + jobPad(dt.getMonth() + 1) + '-' + jobPad(dt.getDate())
    + ' ' + jobPad(dt.getHours()) + ':' + jobPad(dt.getMinutes()) + ':' + jobPad(dt.getSeconds());
}
function jobHMStr(d) {
  const dt = d || new Date();
  return dt.getFullYear() + '-' + jobPad(dt.getMonth() + 1) + '-' + jobPad(dt.getDate())
    + ' ' + jobPad(dt.getHours()) + ':' + jobPad(dt.getMinutes());
}
function jobDateStr(d) {
  const dt = d || new Date();
  return dt.getFullYear() + '-' + jobPad(dt.getMonth() + 1) + '-' + jobPad(dt.getDate());
}
function jobAddMinutes(base, mins) {
  const d = base ? new Date(String(base).replace(/-/g, '/')) : new Date();
  d.setMinutes(d.getMinutes() + mins);
  return d;
}

/* ==================== 1. SAP 接口注册表（参数模板 = 元数据核心） ==================== */
const SAP_INTERFACES = [
  {
    code: 'PP0004',
    name: '查询SAP物料凭证接口',
    protocol: 'RFC',
    direction: 'SAP → MES（拉）',
    biz: '库存管理',
    enabled: true,
    desc: '按工厂 + 过账日期增量拉取 SAP 物料凭证（MKPF/MSEG），写入 MES 镜像库，供库存查询、领退料、凭证冲销使用。',
    params: [
      { key: 'WERKS', label: '工厂', type: 'select', required: true, def: '1000',
        options: ['1000-上海工厂', '2000-苏州工厂'], help: 'SAP 工厂代码' },
      { key: 'BUDAT', label: '过账日期区间', type: 'daterange', required: true, def: { from: '', to: '' },
        help: '留空时按「增量水位」自动推算。手工补拉时填区间，例如查前天就填 前天 ~ 前天' },
      { key: 'MATNR', label: '物料编号', type: 'text', def: '', help: '留空表示不限' },
      { key: 'BWART', label: '移动类型', type: 'text', def: '101,102,201,261,311,551,561',
        help: '多个以英文逗号分隔，留空表示不限' },
      { key: 'WATERMARK', label: '增量水位（时间戳）', type: 'text', def: '20260909103000',
        help: '上次成功同步的时间点；清空后按日期区间全量拉取' },
      { key: 'MAXROWS', label: '单次最大条数', type: 'number', def: '5000', help: '防止单次拉取过大拖垮接口' }
    ]
  },
  {
    code: 'PP0011',
    name: '查询SAP库存接口',
    protocol: 'RFC',
    direction: 'SAP → MES（拉）',
    biz: '库存管理',
    enabled: true,
    desc: '按工厂/库存地点/物料/批次查询 SAP 当前库存（MM-BE），定时刷新 MES 库存镜像与库存红绿灯。',
    params: [
      { key: 'WERKS', label: '工厂', type: 'select', required: true, def: '1000',
        options: ['1000-上海工厂', '2000-苏州工厂'], help: 'SAP 工厂代码' },
      { key: 'LGORT', label: '库存地点', type: 'text', def: '', help: '留空表示全部库存地点' },
      { key: 'MATNR', label: '物料编号', type: 'text', def: '', help: '留空表示不限' },
      { key: 'CHARG', label: '批次', type: 'text', def: '', help: '留空表示不限' },
      { key: 'ONLY_NONZERO', label: '仅查非零库存', type: 'switch', def: true }
    ]
  },
  {
    code: 'PP0019',
    name: '查看SAP预留信息接口',
    protocol: 'RFC',
    direction: 'SAP → MES（拉）',
    biz: '库存管理',
    enabled: true,
    desc: '查看 SAP 预留单信息，同步预留状态与领料进度到 MES 预留单据。',
    params: [
      { key: 'RSNUM', label: '预留编号', type: 'text', def: '', help: '指定单号时忽略日期区间' },
      { key: 'WERKS', label: '工厂', type: 'select', def: '全部',
        options: ['全部', '1000-上海工厂', '2000-苏州工厂'] },
      { key: 'ERSDAT', label: '创建日期区间', type: 'daterange', required: true, def: { from: '', to: '' } },
      { key: 'ONLY_OPEN', label: '仅查未清预留', type: 'switch', def: true }
    ]
  },
  {
    code: 'PP0024',
    name: '特性查询接口',
    protocol: 'RFC',
    direction: 'SAP → MES（拉）',
    biz: '质量管理',
    enabled: true,
    desc: '查询 SAP 批次特性（分类视图），供 MES 批次特性页面展示。',
    params: [
      { key: 'MATNR', label: '物料编号', type: 'text', def: '', help: '留空表示不限' },
      { key: 'CHARG', label: '批次编号', type: 'text', def: '', help: '留空表示不限' },
      { key: 'WERKS', label: '工厂', type: 'select', def: '1000',
        options: ['1000-上海工厂', '2000-苏州工厂'] },
      { key: 'MAXROWS', label: '单次最大条数', type: 'number', def: '2000' }
    ]
  },
  {
    code: 'PP0032',
    name: '查看SAP采购申请信息接口',
    protocol: 'RFC',
    direction: 'SAP → MES（拉）',
    biz: '采购申请',
    enabled: true,
    desc: '查看 SAP 采购申请信息（EBAN），同步审批状态与转单进度到 MES 采购申请单据。',
    params: [
      { key: 'BANFN', label: '申请编号', type: 'text', def: '', help: '指定单号时忽略日期区间' },
      { key: 'BSART', label: '申请类型', type: 'select', required: true, def: '全部',
        options: ['全部', 'Z01-生产性采购申请', 'Z02-非生产性采购申请'] },
      { key: 'BADAT', label: '申请日期区间', type: 'daterange', required: true, def: { from: '', to: '' } },
      { key: 'WERKS', label: '工厂', type: 'select', def: '全部',
        options: ['全部', '1000-上海工厂', '2000-苏州工厂'] },
      { key: 'EKGRP', label: '采购组', type: 'text', def: '', help: 'SAP 采购组编码，留空不限' },
      { key: 'ONLY_OPEN', label: '仅拉取未关闭单据', type: 'switch', def: true },
      { key: 'MAXROWS', label: '单次最大条数', type: 'number', def: '2000' }
    ]
  }
];

/* ==================== 2. 任务定义（Job 实例） ==================== */
/* 统一展示格式：接口编号-接口描述，如 PP0004-查询SAP物料凭证接口 */
function ifaceLabel(code) {
  const i = SAP_INTERFACES.find(x => x.code === code);
  return i ? (i.code + '-' + i.name) : (code || '');
}

const JOB_DEFS = [
  {
    id: 'JOB-0001', code: 'JOB_PP0004_001', name: 'SAP物料凭证同步（10分钟）',
    iface: 'PP0004', cron: '*/10 * * * *', cronText: '每 10 分钟',
    status: '运行中', owner: '系统管理员', createdAt: '2026-03-12 09:20',
    params: {
      WERKS: '1000', BUDAT: { from: '', to: '' }, MATNR: '',
      BWART: '101,102,201,261,311,551,561', WATERMARK: '20260909103000', MAXROWS: '5000'
    },
    remark: '主同步任务，按增量水位每 10 分钟拉取一次'
  },
  {
    id: 'JOB-0002', code: 'JOB_PP0032_001', name: 'SAP采购申请状态同步（每日）',
    iface: 'PP0032', cron: '0 8 * * *', cronText: '每天 08:00',
    status: '运行中', owner: '系统管理员', createdAt: '2026-05-06 14:05',
    params: {
      BANFN: '', BSART: '全部', BADAT: { from: '', to: '' }, WERKS: '全部',
      EKGRP: '', ONLY_OPEN: true, MAXROWS: '2000'
    },
    remark: '每天上班前同步一次昨日申请状态'
  },
  {
    id: 'JOB-0003', code: 'JOB_PP0011_001', name: 'SAP库存同步（30分钟）',
    iface: 'PP0011', cron: '*/30 * * * *', cronText: '每 30 分钟',
    status: '运行中', owner: '系统管理员', createdAt: '2026-06-18 10:40',
    params: {
      WERKS: '1000', LGORT: '', MATNR: '', CHARG: '', ONLY_NONZERO: true
    },
    remark: '该接口近期有超时情况，需关注'
  },
  {
    id: 'JOB-0004', code: 'JOB_PP0004_002', name: '物料凭证历史补拉（每日）',
    iface: 'PP0004', cron: '0 2 * * *', cronText: '每天 02:00',
    status: '已暂停', owner: '系统管理员', createdAt: '2026-04-02 11:10',
    params: {
      WERKS: '1000', BUDAT: { from: '2026-09-07', to: '2026-09-07' }, MATNR: '',
      BWART: '', WATERMARK: '', MAXROWS: '5000'
    },
    remark: '已暂停：用于补拉历史凭证，按需手工触发即可'
  }
];

/* ==================== 3. 执行日志（mock） ==================== */
let JOB_LOG_SEQ = 2000;

function mkLog(jobId, trigger, startAt, durSec, status, fetched, inserted, updated, operator, message) {
  const job = JOB_DEFS.find(j => j.id === jobId) || {};
  const start = new Date(String(startAt).replace(/-/g, '/'));
  const end = new Date(start.getTime() + durSec * 1000);
  JOB_LOG_SEQ += 1;
  return {
    runId: 'RUN' + JOB_LOG_SEQ,
    jobId: jobId, jobName: job.name || '', iface: job.iface || '',
    trigger: trigger,
    startAt: jobNowStr(start), endAt: jobNowStr(end),
    duration: durSec.toFixed(1) + 's',
    status: status, fetched: fetched, inserted: inserted, updated: updated,
    operator: operator, message: message || '',
    errorMsg: status === '失败' ? (message || '接口返回异常') : '',
    paramsSnapshot: JSON.parse(JSON.stringify(job.params || {})),
    request: 'POST /api/sap/' + (job.iface || '') + '  params=' + JSON.stringify(job.params || {}),
    response: status === '失败'
      ? '{"RETURN":"E","MESSAGE":"' + (message || '接口返回异常') + '"}'
      : '{"RETURN":"S","TOTAL":' + fetched + ',"INSERTED":' + inserted + ',"UPDATED":' + updated + '}'
  };
}

const JOB_RUN_LOGS = [
  mkLog('JOB-0001', '定时', '2026-09-09 10:30:00', 6.4, '成功', 128, 96, 32, '系统', ''),
  mkLog('JOB-0001', '定时', '2026-09-09 10:20:00', 5.9, '成功', 96, 70, 26, '系统', ''),
  mkLog('JOB-0001', '手动', '2026-09-09 10:12:31', 7.8, '成功', 210, 188, 22, 'admin', '临时补拉 09-07 ~ 09-08 凭证'),
  mkLog('JOB-0001', '定时', '2026-09-09 10:10:00', 6.1, '成功', 88, 60, 28, '系统', ''),
  mkLog('JOB-0001', '定时', '2026-09-09 10:00:00', 30.0, '失败', 0, 0, 0, '系统', 'SAP 连接超时：RFC PP0004 在 30000ms 内未响应'),
  mkLog('JOB-0002', '定时', '2026-09-09 08:00:00', 12.1, '成功', 46, 8, 38, '系统', ''),
  mkLog('JOB-0002', '手动', '2026-09-08 16:22:05', 9.6, '成功', 33, 4, 29, 'admin', '临时查询 Z01 类型申请状态'),
  mkLog('JOB-0003', '定时', '2026-09-09 10:00:00', 30.0, '失败', 0, 0, 0, '系统', 'SAP 连接超时：CPIC 通信失败，错误码 RFC_COMMUNICATION_FAILURE'),
  mkLog('JOB-0003', '定时', '2026-09-09 09:30:00', 8.2, '成功', 64, 12, 52, '系统', ''),
  mkLog('JOB-0003', '手动', '2026-09-08 14:05:44', 7.5, '成功', 51, 9, 42, 'admin', '指定供应商 100023 核验'),
  mkLog('JOB-0004', '定时', '2026-09-09 02:00:00', 48.7, '成功', 512, 512, 0, '系统', ''),
  mkLog('JOB-0004', '定时', '2026-09-08 02:00:00', 44.2, '成功', 486, 486, 0, '系统', ''),
  mkLog('JOB-0004', '手动', '2026-09-07 15:30:12', 52.3, '成功', 631, 631, 0, 'admin', '补拉 09-05 全天凭证'),
  mkLog('JOB-0002', '定时', '2026-09-08 08:00:00', 11.4, '成功', 40, 6, 34, '系统', ''),
  mkLog('JOB-0001', '定时', '2026-09-08 23:50:00', 6.0, '成功', 102, 74, 28, '系统', '')
];

/* ==================== 页面对象 ==================== */
const ScheduledJob = {
  _version: '1.0-20260909',
  type: 'list',            // list | log | interface
  currentJobId: '',
  viewTab: 'overview',     // overview | params | logs
  _runParams: null,
  _runMode: 'once',

  listFilter: { iface: '', status: '', keyword: '', page: 1, pageSize: 10 },
  logFilter: { jobId: '', status: '', trigger: '', keyword: '', page: 1, pageSize: 10 },
  ifaceFilter: { keyword: '', status: '' },

  setType(t) {
    if (t === 'log' || t === 'interface' || t === 'list') this.type = t;
  },

  /* ==================== 渲染入口 ==================== */
  render() {
    if (!isJobAdmin()) {
      return '<div style="padding:60px 20px;text-align:center;color:var(--text-secondary);">'
        + '<div style="font-size:44px;margin-bottom:12px;">🔒</div>'
        + '<div style="font-size:18px;font-weight:700;color:var(--text);">无访问权限</div>'
        + '<div style="font-size:13px;margin-top:6px;">定时任务管理仅对系统管理员开放。</div></div>';
    }
    if (this.type === 'log') return this.renderLogPage();
    if (this.type === 'interface') return this.renderIfacePage();
    return this.renderListPage();
  },

  init() {
    if (this.type === 'log') this.bindLog();
    else if (this.type === 'interface') this.bindIface();
    else this.bindList();
  },

  statusBadge(status) {
    if (status === '成功') return '<span class="badge badge-green">成功</span>';
    if (status === '失败') return '<span class="badge badge-red">失败</span>';
    if (status === '执行中') return '<span class="badge badge-blue">执行中</span>';
    return '<span class="badge badge-gray">' + (status || '未执行') + '</span>';
  },

  jobStatusBadge(status) {
    if (status === '运行中') return '<span class="badge badge-green">运行中</span>';
    if (status === '已暂停') return '<span class="badge badge-gray">已暂停</span>';
    if (status === '已终止') return '<span class="badge badge-red">已终止</span>';
    return '<span class="badge badge-gray">' + (status || '—') + '</span>';
  },

  /* ==================== 一、任务清单 ==================== */
  renderListPage() {
    return `
    <div style="padding:20px 24px;background:#f6f8fb;min-height:calc(100vh - 56px);">
      <div style="padding:0 4px 10px;font-size:12px;color:var(--text-muted);">
        提示：点击「查看」进入任务详情，可在弹窗内修改查询条件、立即执行、暂停或终止任务。
      </div>
      <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;">
        <div class="filter-bar">
          <div class="filter-group">
            <label>SAP 接口</label>
            <select id="jobFltIface">
              <option value="">全部接口</option>
              ${SAP_INTERFACES.map(i => `<option value="${esc(i.code)}" ${this.listFilter.iface === i.code ? 'selected' : ''}>${esc(ifaceLabel(i.code))}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <label>任务状态</label>
            <select id="jobFltStatus">
              <option value="">全部</option>
              <option value="运行中" ${this.listFilter.status === '运行中' ? 'selected' : ''}>运行中</option>
              <option value="已暂停" ${this.listFilter.status === '已暂停' ? 'selected' : ''}>已暂停</option>
              <option value="已终止" ${this.listFilter.status === '已终止' ? 'selected' : ''}>已终止</option>
            </select>
          </div>
          <div class="filter-group" style="min-width:220px;">
            <label>关键字</label>
            <input id="jobFltKeyword" placeholder="任务编码 / 名称" value="${esc(this.listFilter.keyword)}">
          </div>
          <div class="filter-actions">
            <button class="btn btn-secondary btn-sm" id="jobBtnReset">重置</button>
            <button class="btn btn-primary btn-sm" id="jobBtnQuery">查询</button>
          </div>
        </div>

        <div class="list-toolbar">
          <div class="list-info"><span class="list-count" id="jobListCount">共 0 条</span></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary btn-sm" id="jobBtnRefresh">刷新</button>
            <button class="btn btn-primary btn-sm" id="jobBtnCreate">+ 新建任务</button>
          </div>
        </div>

        <div class="table-wrapper" id="jobTableWrap">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width:210px;">任务编码</th>
                <th style="width:280px;">任务名称</th>
                <th style="width:200px;">SAP 接口</th>
                <th style="width:160px;">执行周期</th>
                <th style="width:110px;">状态</th>
                <th style="width:100px;">操作</th>
              </tr>
            </thead>
            <tbody id="jobTableBody"></tbody>
          </table>
        </div>

        <div class="list-toolbar" style="border-bottom:none;border-top:1px solid var(--border);">
          <div class="list-info"><span class="pagination-info" id="jobPageInfo">第 1 页</span></div>
          <div class="pagination" id="jobPagination"></div>
        </div>
      </div>
    </div>`;
  },

  bindList() {
    const self = this;
    const q = document.getElementById('jobBtnQuery');
    const r = document.getElementById('jobBtnReset');
    const kw = document.getElementById('jobFltKeyword');
    if (q) q.addEventListener('click', function () { self.listFilter.keyword = (kw ? kw.value : ''); self.listFilter.page = 1; self.renderListTable(); });
    if (r) r.addEventListener('click', function () {
      self.listFilter = { iface: '', status: '', keyword: '', page: 1, pageSize: 10 };
      const ca = document.getElementById('contentArea');
      if (ca) { ca.innerHTML = self.renderListPage(); self.bindList(); }
    });
    if (kw) kw.addEventListener('keydown', function (e) { if (e.key === 'Enter' && q) q.click(); });
    const ifc = document.getElementById('jobFltIface');
    const st = document.getElementById('jobFltStatus');
    if (ifc) ifc.addEventListener('change', function () { self.listFilter.iface = this.value; self.listFilter.page = 1; self.renderListTable(); });
    if (st) st.addEventListener('change', function () { self.listFilter.status = this.value; self.listFilter.page = 1; self.renderListTable(); });
    const refresh = document.getElementById('jobBtnRefresh');
    if (refresh) refresh.addEventListener('click', function () { self.renderListTable(); toast('已刷新'); });
    const create = document.getElementById('jobBtnCreate');
    if (create) create.addEventListener('click', function () { self.openCreate(); });
    this.renderListTable();
  },

  filteredJobs() {
    const f = this.listFilter;
    const kw = (f.keyword || '').trim().toLowerCase();
    return JOB_DEFS.filter(function (j) {
      if (f.iface && j.iface !== f.iface) return false;
      if (f.status && j.status !== f.status) return false;
      if (kw && (j.code + j.name).toLowerCase().indexOf(kw) < 0) return false;
      return true;
    });
  },

  renderListTable() {
    const self = this;
    const rows = this.filteredJobs();
    const total = rows.length;
    const pageSize = this.listFilter.pageSize;
    const maxPage = Math.max(1, Math.ceil(total / pageSize));
    if (this.listFilter.page > maxPage) this.listFilter.page = maxPage;
    const page = this.listFilter.page;
    const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);

    const body = document.getElementById('jobTableBody');
    if (body) {
      body.innerHTML = pageRows.length ? pageRows.map(function (j) {
        return `
        <tr>
          <td style="font-family:monospace;font-size:12px;">${esc(j.code)}</td>
          <td>${esc(j.name)}</td>
          <td style="font-size:12px;">${esc(ifaceLabel(j.iface))}</td>
          <td>${esc(j.cronText)}<div style="font-size:11px;color:var(--text-muted);font-family:monospace;">${esc(j.cron)}</div></td>
          <td>${self.jobStatusBadge(j.status)}</td>
          <td><div class="table-actions"><button class="btn btn-blue btn-sm" onclick="ScheduledJob.openJobView('${j.id}')">查看</button></div></td>
        </tr>`;
      }).join('') : '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted);">没有符合条件的定时任务</td></tr>';
    }

    const cnt = document.getElementById('jobListCount');
    if (cnt) cnt.textContent = '共 ' + total + ' 条';
    const pinfo = document.getElementById('jobPageInfo');
    if (pinfo) pinfo.textContent = '第 ' + page + ' / ' + maxPage + ' 页';
    const pager = document.getElementById('jobPagination');
    if (pager) {
      let html = '<button class="pagination-btn" ' + (page <= 1 ? 'disabled' : '') + ' onclick="ScheduledJob.goListPage(' + (page - 1) + ')">‹</button>';
      for (let p = 1; p <= maxPage; p++) {
        if (maxPage > 7 && p > 2 && p < maxPage - 1 && Math.abs(p - page) > 1) {
          if (p === 3) html += '<span class="pagination-info">…</span>';
          continue;
        }
        html += '<button class="pagination-btn ' + (p === page ? 'active' : '') + '" onclick="ScheduledJob.goListPage(' + p + ')">' + p + '</button>';
      }
      html += '<button class="pagination-btn" ' + (page >= maxPage ? 'disabled' : '') + ' onclick="ScheduledJob.goListPage(' + (page + 1) + ')">›</button>';
      pager.innerHTML = html;
    }
  },

  goListPage(p) { this.listFilter.page = p; this.renderListTable(); },

  /* ==================== 二、任务查看大弹窗 ==================== */
  openJobView(jobId) {
    this.currentJobId = jobId;
    this.viewTab = 'overview';
    this.renderJobView(jobId);
  },

  renderJobView(jobId) {
    const job = JOB_DEFS.find(j => j.id === jobId);
    if (!job) return;
    const iface = SAP_INTERFACES.find(i => i.code === job.iface) || {};
    const body = `
      <div style="min-height:60vh;">
        ${this.renderOverviewTab(job, iface)}
      </div>`;

    const footer = [];
    if (job.status === '已终止') {
      footer.push({ text: '已终止，不可操作', cls: 'btn-secondary', action: closeModal });
    } else {
      footer.push({ text: job.status === '运行中' ? '暂停任务' : '启用任务', cls: 'btn-secondary', action: new Function('ScheduledJob.setJobStatus("' + jobId + '", "' + (job.status === '运行中' ? '已暂停' : '运行中') + '")') });
      footer.push({ text: '终止任务', cls: 'btn-secondary', action: new Function('ScheduledJob.terminateJob("' + jobId + '")') });
      footer.push({ text: '保存查询条件', cls: 'btn-secondary', action: new Function('ScheduledJob.saveParams("' + jobId + '", false)') });
      footer.push({ text: '立即执行', cls: 'btn-primary', action: new Function('ScheduledJob.runJob("' + jobId + '", "once")') });
    }
    footer.push({ text: '关闭', cls: 'btn-secondary', action: closeModal });

    showModal('定时任务详情 · ' + esc(job.name), body, footer, 'modal-xxl');
  },

  renderOverviewTab(job, iface) {
    const rows = [
      ['任务编码', job.code], ['任务名称', job.name],
      ['SAP 接口', ifaceLabel(job.iface)],
      ['接口协议 / 方向', (iface.protocol || '—') + ' · ' + (iface.direction || '—')],
      ['所属业务', iface.biz || '—'],
      ['执行周期', job.cronText + '（' + job.cron + '）'],
      ['任务状态', job.status || '—'],
      ['负责人', job.owner], ['创建时间', job.createdAt]
    ];
    return `
      <div class="form-section">
        <div class="detail-grid">
          ${rows.map(r => `<div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">${esc(r[0])}</div><div style="font-size:13.5px;font-weight:600;">${esc(String(r[1]))}</div></div>`).join('')}
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">接口说明</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">${esc(iface.desc || '—')}</div>
      </div>
      <div class="form-section">
        <div class="form-section-title">查询条件</div>
        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:var(--radius-sm);padding:12px 16px;margin-bottom:16px;font-size:12.5px;color:var(--text-secondary);line-height:1.7;">
          条件由接口 <strong>${esc(ifaceLabel(job.iface))}</strong> 的参数模板生成，可直接修改。<br>
          点「保存查询条件」→ 后续定时执行按新条件；点「立即执行」→ 用当前填写的条件立刻跑一次（不保存则仅本次生效）。
        </div>
        <div class="form-grid col-1" id="jobParamsForm">${this.renderParamsForm(iface, job.params)}</div>
      </div>
      <div class="form-section">
        <div class="form-section-title">备注</div>
        <div style="font-size:13px;color:var(--text-secondary);">${esc(job.remark || '—')}</div>
      </div>`;
  },

  /* ---------- 动态参数表单 ---------- */
  renderParamsForm(iface, values, selectable) {
    const list = (iface && iface.params) || [];
    if (!list.length) return '<div class="form-help">该接口未定义参数模板，请先到「接口注册」维护。</div>';
    return list.map(p => {
      const condBox = selectable
        ? `<span style="display:flex;align-items:center;gap:5px;margin-left:auto;font-weight:400;font-size:12px;color:var(--text-secondary);">
             <input type="checkbox" data-cond="${esc(p.key)}" checked onchange="ScheduledJob.toggleCond('${esc(p.key)}')" style="width:14px;height:14px;">作为条件
           </span>`
        : '';
      const v = (values && values[p.key] !== undefined) ? values[p.key] : p.def;
      const req = p.required ? '<span class="req">*</span>' : '';
      const help = p.help ? '<div class="form-help">' + esc(p.help) + '</div>' : '';
      const full = (p.type === 'daterange') ? ' full' : '';
      let ctrl = '';
      if (p.type === 'select') {
        ctrl = `<select data-pkey="${esc(p.key)}">
          ${(p.options || []).map(o => `<option value="${esc(o)}" ${String(v) === String(o) ? 'selected' : ''}>${esc(o)}</option>`).join('')}
        </select>`;
      } else if (p.type === 'daterange') {
        const from = (v && v.from) || '';
        const to = (v && v.to) || '';
        ctrl = `<div style="display:flex;align-items:center;gap:10px;">
            <input type="date" data-pkey="${esc(p.key)}" data-part="from" value="${esc(from)}" style="flex:1;">
            <span style="color:var(--text-muted);">至</span>
            <input type="date" data-pkey="${esc(p.key)}" data-part="to" value="${esc(to)}" style="flex:1;">
          </div>`;
      } else if (p.type === 'switch') {
        ctrl = `<label style="display:flex;align-items:center;gap:8px;font-weight:400;font-size:13px;">
            <input type="checkbox" data-pkey="${esc(p.key)}" ${v ? 'checked' : ''} style="width:16px;height:16px;"> 启用
          </label>`;
      } else if (p.type === 'number') {
        ctrl = `<input type="number" data-pkey="${esc(p.key)}" value="${esc(v)}">`;
      } else {
        ctrl = `<input type="text" data-pkey="${esc(p.key)}" value="${esc(v)}" placeholder="留空不限">`;
      }
      return `<div class="form-group${full}"><label>${esc(p.label)}${req}${condBox}</label>${ctrl}${help}</div>`;
    }).join('');
  },

  readParamsForm(job, selectable) {
    const iface = SAP_INTERFACES.find(i => i.code === job.iface) || {};
    const out = {};
    (iface.params || []).forEach(p => {
      if (selectable) {
        const box = document.querySelector('[data-cond="' + p.key + '"]');
        if (box && !box.checked) {
          out[p.key] = p.type === 'daterange' ? { from: '', to: '' } : (p.type === 'switch' ? false : '');
          return;
        }
      }
      const els = document.querySelectorAll('[data-pkey="' + p.key + '"]');
      if (!els.length) { out[p.key] = (job.params && job.params[p.key] !== undefined) ? job.params[p.key] : p.def; return; }
      if (p.type === 'daterange') {
        let from = '', to = '';
        els.forEach(el => { if (el.dataset.part === 'from') from = el.value; else to = el.value; });
        out[p.key] = { from: from, to: to };
      } else if (p.type === 'switch') {
        out[p.key] = els[0].checked;
      } else {
        out[p.key] = els[0].value;
      }
    });
    return out;
  },

  paramsSummary(iface, values) {
    const list = (iface && iface.params) || [];
    if (!list.length) return '—';
    return '<table style="width:100%;border-collapse:collapse;">' + list.map(p => {
      const v = (values && values[p.key] !== undefined) ? values[p.key] : p.def;
      let txt;
      if (p.type === 'daterange') {
        const f = (v && v.from) || '', t = (v && v.to) || '';
        txt = (f || t) ? ((f || '不限') + ' ~ ' + (t || '不限')) : '不限（按增量水位自动推算）';
      } else if (p.type === 'switch') {
        txt = v ? '是' : '否';
      } else {
        txt = (v === '' || v === undefined || v === null) ? '不限' : String(v);
      }
      return `<tr><td style="padding:4px 0;width:200px;color:var(--text-secondary);">${esc(p.label)}</td>
        <td style="padding:4px 0;font-weight:600;">${esc(txt)}</td></tr>`;
    }).join('') + '</table>';
  },

  /* ---------- 保存 / 启停 ---------- */
  saveParams(jobId, runAfter) {
    const job = JOB_DEFS.find(j => j.id === jobId);
    if (!job) return;
    job.params = this.readParamsForm(job);
    if (runAfter) {
      this.runJob(jobId, 'saved', job.params);
    } else {
      toast('查询条件已保存，将在下次定时执行时生效。');
      this.viewTab = 'overview';
      this.renderJobView(jobId);
      this.renderListTable();
    }
  },

  setJobStatus(jobId, status) {
    const job = JOB_DEFS.find(j => j.id === jobId);
    if (!job) return;
    job.status = status;
    toast(status === '运行中' ? '任务已启用' : '任务已暂停');
    this.renderJobView(jobId);
    this.renderListTable();
  },

  terminateJob(jobId) {
    const job = JOB_DEFS.find(j => j.id === jobId);
    if (!job) return;
    const body = `
      <div>
        <div style="font-size:14px;line-height:1.8;margin-bottom:12px;">确定要终止任务 <strong>${esc(job.name)}</strong>（${esc(job.code)}）吗？</div>
        <div style="font-size:13px;color:#991b1b;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:10px 12px;">
          终止后任务不再被调度，且不可恢复；如需继续使用请新建任务。
        </div>
      </div>`;
    showModal('终止任务', body, [
      { text: '取消', cls: 'btn-secondary', action: new Function('ScheduledJob.renderJobView("' + jobId + '")') },
      { text: '确认终止', cls: 'btn-primary', action: new Function('ScheduledJob.doTerminate("' + jobId + '")') }
    ], 'modal-sm');
  },

  doTerminate(jobId) {
    const job = JOB_DEFS.find(j => j.id === jobId);
    if (!job) return;
    job.status = '已终止';
    closeModal();
    toast('任务已终止：' + job.name);
    this.renderJobView(jobId);
    this.renderListTable();
  },

  /* ---------- 手工执行 ---------- */
  runJob(jobId, mode, presetParams) {
    const job = JOB_DEFS.find(j => j.id === jobId);
    if (!job) return;
    let params = presetParams;
    if (!params) {
      const form = document.getElementById('jobParamsForm');
      params = form ? this.readParamsForm(job) : (job.params || {});
    }
    this._runParams = params;
    this._runMode = mode || 'once';
    this.openRunConfirm(jobId, this._runMode);
  },

  openRunConfirm(jobId, mode) {
    const job = JOB_DEFS.find(j => j.id === jobId);
    if (!job) return;
    const iface = SAP_INTERFACES.find(i => i.code === job.iface) || {};
    const params = this._runParams || job.params || {};
    const modeText = mode === 'once'
      ? '<span class="badge badge-blue badge-sm">仅本次执行</span> 用当前填写的条件临时跑一次，不改动任务配置'
      : '<span class="badge badge-green badge-sm">保存并立即执行</span> 条件已保存，后续定时执行同样生效';

    const body = `
      <div>
        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:var(--radius-sm);padding:14px 16px;margin-bottom:16px;">
          <div style="font-size:13px;margin-bottom:6px;"><strong>任务：</strong>${esc(job.name)}（${esc(job.code)}）</div>
          <div style="font-size:13px;margin-bottom:6px;"><strong>接口：</strong>${esc(ifaceLabel(job.iface))} · ${esc(iface.protocol || '')} · ${esc(iface.direction || '')}</div>
          <div style="font-size:13px;"><strong>执行方式：</strong>${modeText}</div>
        </div>
        <div class="form-section-title" style="font-size:14px;">本次将使用的查询条件</div>
        <div style="font-size:13px;line-height:1.9;background:#fff;border:1px solid #e5e7eb;border-radius:var(--radius-sm);padding:12px 16px;">
          ${this.paramsSummary(iface, params)}
        </div>
        <div class="form-help" style="margin-top:14px;">执行过程会在「执行日志」中留痕，包含参数快照、耗时与结果。</div>
      </div>`;

    showModal('确认执行', body, [
      { text: '取消', cls: 'btn-secondary', action: new Function('ScheduledJob.cancelRun()') },
      { text: '确认执行', cls: 'btn-primary', action: new Function('ScheduledJob.doRun("' + jobId + '")') }
    ], 'modal-md');
  },

  cancelRun() {
    this._runParams = null;
    closeModal();
    if (this.currentJobId) this.renderJobView(this.currentJobId);
  },

  doRun(jobId) {
    const job = JOB_DEFS.find(j => j.id === jobId);
    if (!job) return;
    const params = this._runParams || job.params || {};
    const self = this;
    const startAt = new Date();
    JOB_LOG_SEQ += 1;
    const runId = 'RUN' + JOB_LOG_SEQ;

    const log = {
      runId: runId, jobId: jobId, jobName: job.name, iface: job.iface,
      trigger: '手动', startAt: jobNowStr(startAt), endAt: '—', duration: '—',
      status: '执行中', fetched: 0, inserted: 0, updated: 0,
      operator: window.currentUserId || 'admin',
      message: this._runMode === 'once' ? '临时参数手工触发（不改动任务配置）' : '保存条件后手工触发',
      errorMsg: '', paramsSnapshot: JSON.parse(JSON.stringify(params)),
      request: 'POST /api/sap/' + job.iface + '  params=' + JSON.stringify(params),
      response: ''
    };
    JOB_RUN_LOGS.unshift(log);

    this._runParams = null;

    closeModal();
    this.currentJobId = jobId;
    this.viewTab = 'overview';
    this.renderJobView(jobId);
    this.renderListTable();
    this.showRunning(jobId, runId);

    const durSec = 1.6 + Math.random();
    setTimeout(function () { self.finishRun(jobId, runId, startAt, durSec); }, durSec * 1000);
  },

  showRunning(jobId, runId) {
    const job = JOB_DEFS.find(j => j.id === jobId);
    const iface = SAP_INTERFACES.find(i => i.code === (job ? job.iface : '')) || {};
    const body = `
      <div style="text-align:center;padding:24px 10px;">
        <div style="font-size:15px;font-weight:700;margin-bottom:6px;">${esc(job ? job.name : '')}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:18px;">正在调用 SAP 接口 ${esc(job ? job.iface : '')}（${esc(iface.protocol || '')}），请稍候…</div>
        <div id="jobRunBar" style="height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;">
          <div style="height:100%;width:0%;background:#1E3A5F;transition:width .3s ease;" id="jobRunBarInner"></div>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-muted);" id="jobRunTip">执行编号 ${esc(runId)} · 已提交调度</div>
      </div>`;
    showModal('任务执行中', body, [], 'modal-md');
    let pct = 10;
    const bar = document.getElementById('jobRunBarInner');
    const tip = document.getElementById('jobRunTip');
    const timer = setInterval(function () {
      pct += 15;
      if (bar) bar.style.width = Math.min(pct, 95) + '%';
      if (tip && pct < 60) tip.textContent = '执行编号 ' + runId + ' · 正在读取 SAP 数据…';
      if (pct >= 95) { clearInterval(timer); }
    }, 300);
  },

  finishRun(jobId, runId, startAt, durSec) {
    const job = JOB_DEFS.find(j => j.id === jobId);
    const log = JOB_RUN_LOGS.find(l => l.runId === runId);
    if (!job || !log) return;

    const ok = Math.random() > 0.15;
    const end = new Date(startAt.getTime() + durSec * 1000);
    const fetched = ok ? Math.floor(80 + Math.random() * 400) : 0;
    const inserted = ok ? Math.floor(fetched * 0.7) : 0;

    log.endAt = jobNowStr(end);
    log.duration = durSec.toFixed(1) + 's';
    log.status = ok ? '成功' : '失败';
    log.fetched = fetched;
    log.inserted = inserted;
    log.updated = ok ? fetched - inserted : 0;
    log.errorMsg = ok ? '' : 'SAP 连接超时：接口在 30000ms 内未响应（RFC_COMMUNICATION_FAILURE）';
    log.message = ok ? log.message : '执行失败，请稍后重试或调整查询条件';
    log.response = ok
      ? '{"RETURN":"S","TOTAL":' + fetched + ',"INSERTED":' + inserted + ',"UPDATED":' + log.updated + '}'
      : '{"RETURN":"E","MESSAGE":"' + log.errorMsg + '"}';

    closeModal();
    toast(log.status === '成功'
      ? '执行成功：拉取 ' + fetched + ' 条，新增 ' + inserted + ' 条，更新 ' + log.updated + ' 条（耗时 ' + log.duration + '）'
      : '执行失败：' + log.errorMsg);

    if (this.currentJobId === jobId) this.renderJobView(jobId);
    this.renderListTable();
    if (this.type === 'log') this.renderLogTable();
  },

  /* ==================== 三、新建任务 ==================== */
  openCreate() {
    const options = SAP_INTERFACES.filter(i => i.enabled)
      .map(i => `<option value="${esc(i.code)}">${esc(ifaceLabel(i.code))}</option>`).join('');

    const body = `
      <div class="form-section">
        <div class="form-section-title">基本信息</div>
        <div class="form-grid">
          <div class="form-group"><label>SAP 接口<span class="req">*</span></label>
            <select id="newJobIface" onchange="ScheduledJob.onSelectIface(this.value)">
              <option value="">请选择要轮询的 SAP 接口</option>
              ${options}
            </select>
            <div class="form-help" id="newJobIfaceDesc">选择接口后，下方会自动带出该接口的全部入参，可逐项勾选并设置条件。</div>
          </div>
          <div class="form-group"><label>执行周期<span class="req">*</span></label>
            <select id="newJobCron">
              <option value="每 10 分钟|*/10 * * * *">每 10 分钟</option>
              <option value="每 30 分钟|*/30 * * * *">每 30 分钟</option>
              <option value="每小时|0 * * * *">每小时</option>
              <option value="每天 02:00|0 2 * * *">每天 02:00</option>
              <option value="每天 08:00|0 8 * * *">每天 08:00</option>
            </select></div>
          <div class="form-group"><label>任务编码</label>
            <input id="newJobCode" value="选择接口后自动生成" readonly style="background:#f8fafc;color:var(--text-secondary);">
            <div class="form-help">按「JOB_接口编号_序号」自动编号，如 JOB_PP0004_001</div></div>
          <div class="form-group"><label>任务名称<span class="req">*</span></label>
            <input id="newJobName" placeholder="如 SAP物料凭证同步（10分钟）"></div>
          <div class="form-group"><label>创建后状态</label>
            <select id="newJobStatus"><option value="运行中">运行中</option><option value="已暂停">已暂停</option></select></div>
          <div class="form-group"><label>负责人</label><input id="newJobOwner" value="${esc(window.currentUserId || 'admin')}"></div>
          <div class="form-group full"><label>备注</label><input id="newJobRemark" placeholder="选填"></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">查询条件（按所选接口动态生成）</div>
        <div id="newJobParams">
          <div style="padding:28px;text-align:center;color:var(--text-muted);font-size:13px;border:1px dashed var(--border);border-radius:var(--radius-sm);">
            请先在上方选择 SAP 接口，选择后此处自动展示该接口的入参
          </div>
        </div>
      </div>`;

    showModal('新建定时任务', body, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '保存', cls: 'btn-primary', action: new Function('ScheduledJob.saveNewJob()') }
    ], 'modal-xxl');
  },

  /* 任务编码自动生成：JOB_接口编号_序号（同一接口内递增） */
  nextJobCode(ifaceCode) {
    const prefix = 'JOB_' + ifaceCode + '_';
    let max = 0;
    JOB_DEFS.forEach(function (j) {
      if (String(j.code).indexOf(prefix) === 0) {
        const n = parseInt(String(j.code).slice(prefix.length), 10);
        if (!isNaN(n) && n > max) max = n;
      }
    });
    let code = prefix + String(max + 1).padStart(3, '0');
    while (JOB_DEFS.some(j => j.code === code)) {
      max += 1;
      code = prefix + String(max + 1).padStart(3, '0');
    }
    return code;
  },

  /* 选中接口后，局部刷新入参区域（不关闭弹窗） */
  onSelectIface(code) {
    const area = document.getElementById('newJobParams');
    const desc = document.getElementById('newJobIfaceDesc');
    if (!code) {
      if (desc) desc.textContent = '选择接口后，下方会自动带出该接口的全部入参，可逐项勾选并设置条件。';
      if (area) {
        area.innerHTML = '<div style="padding:28px;text-align:center;color:var(--text-muted);font-size:13px;border:1px dashed var(--border);border-radius:var(--radius-sm);">请先在上方选择 SAP 接口，选择后此处自动展示该接口的入参</div>';
      }
      return;
    }
    const iface = SAP_INTERFACES.find(i => i.code === code);
    if (!iface) return;
    if (desc) {
      desc.textContent = (iface.protocol || '') + ' · ' + (iface.direction || '') + ' · ' + (iface.desc || '');
    }
    const codeEl = document.getElementById('newJobCode');
    if (codeEl) codeEl.value = this.nextJobCode(code);
    const defs = {};
    (iface.params || []).forEach(p => { defs[p.key] = p.def; });
    if (area) {
      if (!iface.params.length) {
        area.innerHTML = '<div class="form-help">该接口未定义参数模板，请先到「接口注册」维护。</div>';
      } else {
        area.innerHTML = '<div class="form-grid col-1">' + this.renderParamsForm(iface, defs, true) + '</div>';
      }
    }
  },

  /* 勾选/取消某个入参作为查询条件 */
  toggleCond(key) {
    const box = document.querySelector('[data-cond="' + key + '"]');
    const els = document.querySelectorAll('[data-pkey="' + key + '"]');
    const on = box ? box.checked : true;
    els.forEach(el => { el.disabled = !on; });
    const group = box ? box.closest('.form-group') : null;
    if (group) group.style.opacity = on ? '1' : '0.45';
  },

  saveNewJob() {
    const ifaceEl = document.getElementById('newJobIface');
    const ifaceCode = ifaceEl ? ifaceEl.value : '';
    if (!ifaceCode) { toast('请先选择 SAP 接口'); return; }
    const nameEl = document.getElementById('newJobName');
    const name = nameEl ? nameEl.value.trim() : '';
    if (!name) { toast('任务名称为必填项'); return; }
    const code = this.nextJobCode(ifaceCode);

    const cronSel = document.getElementById('newJobCron');
    const cronVal = cronSel ? cronSel.value : '每 10 分钟|*/10 * * * *';
    const cronText = cronVal.split('|')[0];
    const cron = cronVal.split('|')[1];
    const status = (document.getElementById('newJobStatus') || {}).value || '运行中';

    const tmpJob = { iface: ifaceCode, params: {} };
    const params = this.readParamsForm(tmpJob, true);

    const maxId = JOB_DEFS.reduce(function (m, j) {
      const n = parseInt(String(j.id).replace('JOB-', ''), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);

    JOB_DEFS.push({
      id: 'JOB-' + String(maxId + 1).padStart(4, '0'),
      code: code, name: name, iface: ifaceCode, cron: cron, cronText: cronText,
      status: status, owner: (document.getElementById('newJobOwner') || {}).value || 'admin',
      createdAt: jobHMStr(new Date()), params: params,
      remark: (document.getElementById('newJobRemark') || {}).value || ''
    });

    closeModal();
    toast('任务已创建：' + name + '（' + code + '）');
    if (this.type === 'list') { this.renderListTable(); }
    else {
      const ca = document.getElementById('contentArea');
      if (ca) { this.setType('list'); ca.innerHTML = this.renderListPage(); this.bindList(); }
    }
  },

  /* ==================== 四、执行日志明细弹窗 ==================== */
  openLogDetail(runId) {
    const l = JOB_RUN_LOGS.find(x => x.runId === runId);
    if (!l) return;
    const iface = SAP_INTERFACES.find(i => i.code === l.iface) || {};
    const body = `
      <div style="min-height:52vh;">
        <div class="detail-grid" style="margin-bottom:20px;">
          <div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);">执行编号</div><div style="font-weight:600;">${esc(l.runId)}</div></div>
          <div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);">任务</div><div style="font-weight:600;">${esc(l.jobName)}</div></div>
          <div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);">触发方式</div><div style="font-weight:600;">${l.trigger === '手动' ? '手工触发' : '定时调度'}</div></div>
          <div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);">执行结果</div><div style="font-weight:600;">${this.statusBadge(l.status)}</div></div>
          <div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);">开始时间</div><div style="font-weight:600;">${esc(l.startAt)}</div></div>
          <div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);">结束时间</div><div style="font-weight:600;">${esc(l.endAt)}</div></div>
          <div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);">耗时</div><div style="font-weight:600;">${esc(l.duration)}</div></div>
          <div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);">操作人</div><div style="font-weight:600;">${esc(l.operator)}</div></div>
          <div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);">拉取 / 新增 / 更新</div><div style="font-weight:600;">${l.fetched} / ${l.inserted} / ${l.updated}</div></div>
        </div>

        <div class="form-section">
          <div class="form-section-title">本次执行的参数快照</div>
          <div style="font-size:13px;line-height:1.9;background:#f8fafc;border:1px solid #e5e7eb;border-radius:var(--radius-sm);padding:14px 16px;">
            ${this.paramsSummary(iface, l.paramsSnapshot)}
          </div>
        </div>

        ${l.message ? `<div class="form-section"><div class="form-section-title">说明</div><div style="font-size:13px;color:var(--text-secondary);">${esc(l.message)}</div></div>` : ''}

        ${l.errorMsg ? `<div class="form-section"><div class="form-section-title" style="color:var(--danger);border-color:var(--danger);">错误信息</div>
          <div style="font-size:13px;color:#991b1b;background:#fef2f2;border:1px solid #fecaca;border-radius:var(--radius-sm);padding:12px 14px;">${esc(l.errorMsg)}</div></div>` : ''}

        <div class="form-section">
          <div class="form-section-title">接口报文</div>
          <div style="font-size:12px;font-family:monospace;background:#0f1b2d;color:#cbd5e1;border-radius:var(--radius-sm);padding:14px 16px;white-space:pre-wrap;word-break:break-all;line-height:1.7;">请求：${esc(l.request)}

响应：${esc(l.response || '—')}</div>
        </div>
      </div>`;

    showModal('执行日志明细 · ' + esc(l.runId), body, [
      { text: '关闭', cls: 'btn-secondary', action: new Function('ScheduledJob.closeLogDetail()') }
    ], 'modal-xxl');
  },

  closeLogDetail() {
    closeModal();
    if (this.currentJobId) this.renderJobView(this.currentJobId);
  },

  /* ==================== 五、执行日志子页 ==================== */
  openLogPage(jobId) {
    this.logFilter.jobId = jobId || '';
    this.logFilter.page = 1;
    if (typeof App !== 'undefined' && App.navigateGItem) {
      App.navigateGItem('system-management', 'job-log', 'job-log', '执行日志');
    }
  },

  renderLogPage() {
    return `
    <div style="padding:20px 24px;background:#f6f8fb;min-height:calc(100vh - 56px);">
      <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;">
        <div class="filter-bar">
          <div class="filter-group">
            <label>定时任务</label>
            <select id="logFltJob">
              <option value="">全部任务</option>
              ${JOB_DEFS.map(j => `<option value="${esc(j.id)}" ${this.logFilter.jobId === j.id ? 'selected' : ''}>${esc(j.name)}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <label>执行结果</label>
            <select id="logFltStatus">
              <option value="">全部</option>
              <option value="成功" ${this.logFilter.status === '成功' ? 'selected' : ''}>成功</option>
              <option value="失败" ${this.logFilter.status === '失败' ? 'selected' : ''}>失败</option>
              <option value="执行中" ${this.logFilter.status === '执行中' ? 'selected' : ''}>执行中</option>
            </select>
          </div>
          <div class="filter-group">
            <label>触发方式</label>
            <select id="logFltTrigger">
              <option value="">全部</option>
              <option value="定时" ${this.logFilter.trigger === '定时' ? 'selected' : ''}>定时调度</option>
              <option value="手动" ${this.logFilter.trigger === '手动' ? 'selected' : ''}>手工触发</option>
            </select>
          </div>
          <div class="filter-group" style="min-width:180px;">
            <label>关键字</label>
            <input id="logFltKeyword" placeholder="执行编号 / 操作人" value="${esc(this.logFilter.keyword)}">
          </div>
          <div class="filter-actions">
            <button class="btn btn-secondary btn-sm" id="logBtnReset">重置</button>
            <button class="btn btn-primary btn-sm" id="logBtnQuery">查询</button>
          </div>
        </div>

        <div class="list-toolbar">
          <div class="list-info"><span class="list-count" id="logListCount">共 0 条</span></div>
          <button class="btn btn-secondary btn-sm" id="logBtnRefresh">刷新</button>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width:110px;">执行编号</th>
                <th style="width:200px;">任务名称</th>
                <th style="width:150px;">SAP 接口</th>
                <th style="width:100px;">触发方式</th>
                <th style="width:160px;">开始时间</th>
                <th style="width:90px;">耗时</th>
                <th style="width:90px;">结果</th>
                <th style="width:150px;">拉取 / 新增 / 更新</th>
                <th style="width:100px;">操作人</th>
                <th style="width:100px;">操作</th>
              </tr>
            </thead>
            <tbody id="logTableBody"></tbody>
          </table>
        </div>

        <div class="list-toolbar" style="border-bottom:none;border-top:1px solid var(--border);">
          <div class="list-info"><span class="pagination-info" id="logPageInfo">第 1 页</span></div>
          <div class="pagination" id="logPagination"></div>
        </div>
      </div>
    </div>`;
  },

  bindLog() {
    const self = this;
    const q = document.getElementById('logBtnQuery');
    const kw = document.getElementById('logFltKeyword');
    if (q) q.addEventListener('click', function () { self.logFilter.keyword = kw ? kw.value : ''; self.logFilter.page = 1; self.renderLogTable(); });
    if (kw) kw.addEventListener('keydown', function (e) { if (e.key === 'Enter' && q) q.click(); });
    const r = document.getElementById('logBtnReset');
    if (r) r.addEventListener('click', function () {
      self.logFilter = { jobId: '', status: '', trigger: '', keyword: '', page: 1, pageSize: 10 };
      const ca = document.getElementById('contentArea');
      if (ca) { ca.innerHTML = self.renderLogPage(); self.bindLog(); }
    });
    ['logFltJob', 'logFltStatus', 'logFltTrigger'].forEach(function (id, idx) {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', function () {
        const key = idx === 0 ? 'jobId' : (idx === 1 ? 'status' : 'trigger');
        self.logFilter[key] = this.value;
        self.logFilter.page = 1;
        self.renderLogTable();
      });
    });
    const refresh = document.getElementById('logBtnRefresh');
    if (refresh) refresh.addEventListener('click', function () { self.renderLogTable(); toast('已刷新'); });
    this.renderLogTable();
  },

  filteredLogs() {
    const f = this.logFilter;
    const kw = (f.keyword || '').trim().toLowerCase();
    return JOB_RUN_LOGS.filter(function (l) {
      if (f.jobId && l.jobId !== f.jobId) return false;
      if (f.status && l.status !== f.status) return false;
      if (f.trigger && l.trigger !== f.trigger) return false;
      if (kw && (l.runId + l.operator).toLowerCase().indexOf(kw) < 0) return false;
      return true;
    });
  },

  renderLogTable() {
    const rows = this.filteredLogs();
    const total = rows.length;
    const pageSize = this.logFilter.pageSize;
    const maxPage = Math.max(1, Math.ceil(total / pageSize));
    if (this.logFilter.page > maxPage) this.logFilter.page = maxPage;
    const page = this.logFilter.page;
    const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);

    const body = document.getElementById('logTableBody');
    if (body) {
      body.innerHTML = pageRows.length ? pageRows.map(l => {
        return `
        <tr>
          <td style="font-family:monospace;font-size:12px;">${esc(l.runId)}</td>
          <td>${esc(l.jobName)}</td>
          <td style="font-size:12px;">${esc(ifaceLabel(l.iface))}</td>
          <td>${l.trigger === '手动' ? '<span class="badge badge-blue badge-sm">手工</span>' : '<span class="badge badge-gray badge-sm">定时</span>'}</td>
          <td style="font-size:12px;">${esc(l.startAt)}</td>
          <td style="font-size:12px;">${esc(l.duration)}</td>
          <td>${this.statusBadge(l.status)}</td>
          <td style="font-size:12px;">${l.fetched} / ${l.inserted} / ${l.updated}</td>
          <td style="font-size:12px;">${esc(l.operator)}</td>
          <td><div class="table-actions"><button class="btn btn-blue btn-sm" onclick="ScheduledJob.openLogDetail('${l.runId}')">查看</button></div></td>
        </tr>`;
      }).join('') : '<tr><td colspan="10" style="text-align:center;padding:40px;color:var(--text-muted);">没有符合条件的执行日志</td></tr>';
    }

    const cnt = document.getElementById('logListCount');
    if (cnt) cnt.textContent = '共 ' + total + ' 条';
    const pinfo = document.getElementById('logPageInfo');
    if (pinfo) pinfo.textContent = '第 ' + page + ' / ' + maxPage + ' 页';
    const pager = document.getElementById('logPagination');
    if (pager) {
      let html = '<button class="pagination-btn" ' + (page <= 1 ? 'disabled' : '') + ' onclick="ScheduledJob.goLogPage(' + (page - 1) + ')">‹</button>';
      for (let p = 1; p <= maxPage; p++) {
        if (maxPage > 7 && p > 2 && p < maxPage - 1 && Math.abs(p - page) > 1) {
          if (p === 3) html += '<span class="pagination-info">…</span>';
          continue;
        }
        html += '<button class="pagination-btn ' + (p === page ? 'active' : '') + '" onclick="ScheduledJob.goLogPage(' + p + ')">' + p + '</button>';
      }
      html += '<button class="pagination-btn" ' + (page >= maxPage ? 'disabled' : '') + ' onclick="ScheduledJob.goLogPage(' + (page + 1) + ')">›</button>';
      pager.innerHTML = html;
    }
  },

  goLogPage(p) { this.logFilter.page = p; this.renderLogTable(); },

  /* ==================== 六、接口注册子页 ==================== */
  renderIfacePage() {
    const rows = SAP_INTERFACES.filter(i => {
      const kw = (this.ifaceFilter.keyword || '').trim().toLowerCase();
      if (this.ifaceFilter.status === 'enabled' && !i.enabled) return false;
      if (this.ifaceFilter.status === 'disabled' && i.enabled) return false;
      if (kw && (i.code + i.name + i.biz).toLowerCase().indexOf(kw) < 0) return false;
      return true;
    });

    return `
    <div style="padding:20px 24px;background:#f6f8fb;min-height:calc(100vh - 56px);">
      <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:var(--radius-sm);padding:12px 16px;margin-bottom:16px;font-size:12.5px;color:var(--text-secondary);line-height:1.7;">
        接口注册用于维护「SAP 接口目录 + 查询条件参数模板」。任务的查询条件完全由所选接口的参数模板动态生成，
        因此未来新增一个轮询接口（如生产订单、供应商主数据）时，只需在此登记接口与字段，即可在「任务清单」中直接创建任务，无需开发改前端。
      </div>

      <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;">
        <div class="filter-bar">
          <div class="filter-group">
            <label>启用状态</label>
            <select id="ifFltStatus">
              <option value="">全部</option>
              <option value="enabled" ${this.ifaceFilter.status === 'enabled' ? 'selected' : ''}>已启用</option>
              <option value="disabled" ${this.ifaceFilter.status === 'disabled' ? 'selected' : ''}>未启用</option>
            </select>
          </div>
          <div class="filter-group" style="min-width:220px;">
            <label>关键字</label>
            <input id="ifFltKeyword" placeholder="接口编码 / 名称 / 业务" value="${esc(this.ifaceFilter.keyword)}">
          </div>
          <div class="filter-actions">
            <button class="btn btn-secondary btn-sm" id="ifBtnReset">重置</button>
            <button class="btn btn-primary btn-sm" id="ifBtnQuery">查询</button>
          </div>
        </div>

        <div class="list-toolbar">
          <div class="list-info"><span class="list-count" id="ifListCount">共 ${rows.length} 条</span></div>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width:200px;">接口编码</th>
                <th style="width:200px;">接口名称</th>
                <th style="width:100px;">协议</th>
                <th style="width:180px;">方向</th>
                <th style="width:130px;">所属业务</th>
                <th style="width:130px;">参数模板字段</th>
                <th style="width:120px;">关联任务</th>
                <th style="width:90px;">状态</th>
                <th style="width:100px;">操作</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(i => `
                <tr>
                  <td style="font-family:monospace;font-size:12px;">${esc(i.code)}</td>
                  <td>${esc(i.name)}</td>
                  <td><span class="badge badge-gray badge-sm">${esc(i.protocol)}</span></td>
                  <td style="font-size:12px;">${esc(i.direction)}</td>
                  <td>${esc(i.biz)}</td>
                  <td>${i.params.length} 个</td>
                  <td>${JOB_DEFS.filter(j => j.iface === i.code).length} 个</td>
                  <td>${i.enabled ? '<span class="badge badge-green">已启用</span>' : '<span class="badge badge-gray">未启用</span>'}</td>
                  <td><div class="table-actions"><button class="btn btn-blue btn-sm" onclick="ScheduledJob.openIfaceView('${esc(i.code)}')">查看</button></div></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  },

  bindIface() {
    const self = this;
    const q = document.getElementById('ifBtnQuery');
    const kw = document.getElementById('ifFltKeyword');
    if (q) q.addEventListener('click', function () {
      self.ifaceFilter.keyword = kw ? kw.value : '';
      const ca = document.getElementById('contentArea');
      if (ca) { ca.innerHTML = self.renderIfacePage(); self.bindIface(); }
    });
    if (kw) kw.addEventListener('keydown', function (e) { if (e.key === 'Enter' && q) q.click(); });
    const st = document.getElementById('ifFltStatus');
    if (st) st.addEventListener('change', function () {
      self.ifaceFilter.status = this.value;
      const ca = document.getElementById('contentArea');
      if (ca) { ca.innerHTML = self.renderIfacePage(); self.bindIface(); }
    });
    const r = document.getElementById('ifBtnReset');
    if (r) r.addEventListener('click', function () {
      self.ifaceFilter = { keyword: '', status: '' };
      const ca = document.getElementById('contentArea');
      if (ca) { ca.innerHTML = self.renderIfacePage(); self.bindIface(); }
    });
  },

  openIfaceView(code, editMode) {
    const iface = SAP_INTERFACES.find(i => i.code === code);
    if (!iface) return;
    const jobs = JOB_DEFS.filter(j => j.iface === code);
    const edit = !!editMode;

    const info = `
      <div class="form-section">
        <div class="detail-grid">
          <div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);">接口编码</div><div style="font-weight:600;">${esc(iface.code)}</div></div>
          <div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);">接口名称</div><div style="font-weight:600;">${esc(iface.name)}</div></div>
          <div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);">协议 / 方向</div><div style="font-weight:600;">${esc(iface.protocol)} · ${esc(iface.direction)}</div></div>
          <div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);">所属业务</div><div style="font-weight:600;">${esc(iface.biz)}</div></div>
          <div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);">启用状态</div><div style="font-weight:600;">${iface.enabled ? '<span class="badge badge-green">已启用</span>' : '<span class="badge badge-gray">未启用</span>'}</div></div>
          <div class="detail-item"><div style="font-size:12px;color:var(--text-secondary);">关联任务</div><div style="font-weight:600;">${jobs.length} 个</div></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">接口说明</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">${esc(iface.desc || '—')}</div>
      </div>`;

    const paramTable = `
      <div class="form-section">
        <div class="form-section-title">查询条件参数模板${edit ? '（编辑中）' : ''}</div>
        <div class="table-wrapper">
          <table class="data-table data-table-compact" id="ifaceParamTable">
            <thead>
              <tr>
                <th style="width:60px;">序号</th>
                <th style="width:180px;">字段名称</th>
                <th style="width:160px;">字段键</th>
                <th style="width:150px;">控件类型</th>
                <th style="width:80px;">必填</th>
                <th style="width:180px;">默认值</th>
                <th>选项 / 说明</th>
                ${edit ? '<th style="width:80px;">操作</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${iface.params.map((p, idx) => this.paramRow(iface, p, idx, edit)).join('')}
            </tbody>
          </table>
        </div>
      </div>`;

    const body = `<div style="min-height:56vh;">${info}${paramTable}</div>`;

    const footer = edit ? [
      { text: '+ 新增字段', cls: 'btn-outline', action: new Function('ScheduledJob.addParamField("' + code + '")') },
      { text: '取消', cls: 'btn-secondary', action: new Function('ScheduledJob.openIfaceView("' + code + '", false)') },
      { text: '保存模板', cls: 'btn-primary', action: new Function('ScheduledJob.saveIfaceTemplate("' + code + '")') }
    ] : [
      { text: iface.enabled ? '停用接口' : '启用接口', cls: 'btn-secondary', action: new Function('ScheduledJob.toggleIface("' + code + '")') },
      { text: '编辑参数模板', cls: 'btn-primary', action: new Function('ScheduledJob.openIfaceView("' + code + '", true)') },
      { text: '关闭', cls: 'btn-secondary', action: closeModal }
    ];

    showModal('SAP 接口详情 · ' + esc(iface.name), body, footer, 'modal-xxl');
  },

  paramRow(iface, p, idx, edit) {
    const typeOpts = ['text', 'number', 'daterange', 'select', 'switch'];
    const typeText = { text: '文本', number: '数字', daterange: '日期区间', select: '下拉选择', switch: '开关' };
    if (!edit) {
      let opt = p.help || '';
      if (p.type === 'select') opt = (p.options || []).join(' / ');
      return `<tr>
        <td>${idx + 1}</td>
        <td>${esc(p.label)}</td>
        <td style="font-family:monospace;font-size:12px;">${esc(p.key)}</td>
        <td>${esc(typeText[p.type] || p.type)}</td>
        <td>${p.required ? '<span class="badge badge-red badge-sm">必填</span>' : '<span class="badge badge-gray badge-sm">选填</span>'}</td>
        <td>${esc(this.paramDefText(p))}</td>
        <td style="font-size:12px;color:var(--text-secondary);">${esc(opt)}</td>
      </tr>`;
    }
    return `<tr data-idx="${idx}">
      <td>${idx + 1}</td>
      <td><input data-f="label" value="${esc(p.label)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input data-f="key" value="${esc(p.key)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;font-family:monospace;"></td>
      <td><select data-f="type" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;">
        ${typeOpts.map(t => `<option value="${t}" ${p.type === t ? 'selected' : ''}>${typeText[t]}</option>`).join('')}
      </select></td>
      <td><input type="checkbox" data-f="required" ${p.required ? 'checked' : ''} style="width:16px;height:16px;"></td>
      <td><input data-f="def" value="${esc(this.paramDefText(p))}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input data-f="help" value="${esc(p.type === 'select' ? (p.options || []).join(',') : (p.help || ''))}" placeholder="select 类型填选项，逗号分隔；其余填说明" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><button class="btn btn-secondary btn-sm" onclick="ScheduledJob.removeParamField('${esc(iface.code)}', ${idx})">删除</button></td>
    </tr>`;
  },

  paramDefText(p) {
    if (p.type === 'daterange') {
      return ((p.def && p.def.from) || '') + ((p.def && (p.def.from || p.def.to)) ? ' ~ ' : '') + ((p.def && p.def.to) || '');
    }
    if (p.type === 'switch') return p.def ? '是' : '否';
    return (p.def === undefined || p.def === null) ? '' : String(p.def);
  },

  addParamField(code) {
    const iface = SAP_INTERFACES.find(i => i.code === code);
    if (!iface) return;
    iface.params.push({ key: 'field_' + (iface.params.length + 1), label: '新字段', type: 'text', required: false, def: '', help: '' });
    this.openIfaceView(code, true);
  },

  removeParamField(code, idx) {
    const iface = SAP_INTERFACES.find(i => i.code === code);
    if (!iface) return;
    iface.params.splice(idx, 1);
    this.openIfaceView(code, true);
  },

  toggleIface(code) {
    const iface = SAP_INTERFACES.find(i => i.code === code);
    if (!iface) return;
    iface.enabled = !iface.enabled;
    toast(iface.enabled ? '接口已启用' : '接口已停用');
    this.openIfaceView(code, false);
    const ca = document.getElementById('contentArea');
    if (ca && this.type === 'interface') { ca.innerHTML = this.renderIfacePage(); this.bindIface(); }
  },

  saveIfaceTemplate(code) {
    const iface = SAP_INTERFACES.find(i => i.code === code);
    if (!iface) return;
    const table = document.getElementById('ifaceParamTable');
    if (!table) return;
    const rows = table.querySelectorAll('tbody tr');
    const params = [];
    rows.forEach(tr => {
      const get = f => { const el = tr.querySelector('[data-f="' + f + '"]'); return el ? el.value : ''; };
      const type = get('type');
      const helpRaw = get('help');
      const p = {
        key: get('key') || ('field_' + (params.length + 1)),
        label: get('label') || '未命名字段',
        type: type,
        required: (tr.querySelector('[data-f="required"]') || {}).checked || false,
        def: type === 'switch' ? (get('def') === '是' || get('def') === 'true')
          : (type === 'daterange' ? this.parseRange(get('def')) : get('def')),
        help: type === 'select' ? '' : helpRaw
      };
      if (type === 'select') p.options = helpRaw.split(',').map(s => s.trim()).filter(Boolean);
      params.push(p);
    });
    iface.params = params;
    toast('参数模板已保存，新建或修改任务时将按新模板生成查询条件。');
    this.openIfaceView(code, false);
    const ca = document.getElementById('contentArea');
    if (ca && this.type === 'interface') { ca.innerHTML = this.renderIfacePage(); this.bindIface(); }
  },

  parseRange(s) {
    const t = String(s || '').trim();
    if (!t) return { from: '', to: '' };
    const parts = t.split('~');
    return { from: (parts[0] || '').trim(), to: (parts[1] || '').trim() };
  }
};

