/* ==================== 系统管理 · 定时JOB ====================
 * 统一管理所有轮询 SAP 的后台定时 Job：
 *   JOB清单 —— 定义 Job（选 SAP 接口并逐项设置查询条件）、暂停/终止、
 *               修改查询条件、手工立即执行
 *   注：接口的「查询条件参数模板」由 SAP_INTERFACES 维护（元数据驱动），
 *       不同接口查询条件不同，新增接口只需在该数组登记字段
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
      { key: 'BUDAT', label: '过账日期', type: 'date', required: true, def: '',
        help: '留空时按「增量水位」自动推算。手工补拉时选「介于」并填起止日期，例如查前天就填 前天 ~ 前天' },
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
      { key: 'ERSDAT', label: '创建日期', type: 'date', required: true, def: '' },
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
      { key: 'BADAT', label: '申请日期', type: 'date', required: true, def: '' },
      { key: 'WERKS', label: '工厂', type: 'select', def: '全部',
        options: ['全部', '1000-上海工厂', '2000-苏州工厂'] },
      { key: 'EKGRP', label: '采购组', type: 'text', def: '', help: 'SAP 采购组编码，留空不限' },
      { key: 'ONLY_OPEN', label: '仅拉取未关闭单据', type: 'switch', def: true },
      { key: 'MAXROWS', label: '单次最大条数', type: 'number', def: '2000' }
    ]
  }
];

/* ==================== 2. JOB 定义（定时JOB 实例） ==================== */
/* 统一展示格式：接口编号-接口描述，如 PP0004-查询SAP物料凭证接口 */
function ifaceLabel(code) {
  const i = SAP_INTERFACES.find(x => x.code === code);
  return i ? (i.code + '-' + i.name) : (code || '');
}

const JOB_DEFS = [
  {
    id: 'JOB-0001', code: 'JOB_PP0004_001', name: 'SAP物料凭证同步（10分钟）',
    iface: 'PP0004', cron: '*/10 * * * *', cronText: '每 10 分钟',
    cronConf: { type: 'interval', interval: 10, unit: 'minute' },
    status: '运行中', createdAt: '2026-03-12 09:20',
    params: {
      WERKS: { mode: 'EQ', value: '1000', value2: '' },
      BUDAT: { mode: 'BT', value: '', value2: '' },
      MATNR: { mode: 'EQ', value: '', value2: '' },
      BWART: { mode: 'EQ', value: '101,102,201,261,311,551,561', value2: '' },
      WATERMARK: { mode: 'EQ', value: '20260909103000', value2: '' },
      MAXROWS: { mode: 'EQ', value: '5000', value2: '' }
    },
    remark: '主同步 JOB，按增量水位每 10 分钟拉取一次'
  },
  {
    id: 'JOB-0002', code: 'JOB_PP0032_001', name: 'SAP采购申请状态同步（每日）',
    iface: 'PP0032', cron: '0 8 * * *', cronText: '每天 08:00',
    cronConf: { type: 'daily', time: '08:00' },
    status: '运行中', createdAt: '2026-05-06 14:05',
    params: {
      BANFN: { mode: 'EQ', value: '', value2: '' },
      BSART: { mode: 'EQ', value: '全部', value2: '' },
      BADAT: { mode: 'BT', value: '', value2: '' },
      WERKS: { mode: 'EQ', value: '全部', value2: '' },
      EKGRP: { mode: 'EQ', value: '', value2: '' },
      ONLY_OPEN: { mode: 'EQ', value: true, value2: '' },
      MAXROWS: { mode: 'EQ', value: '2000', value2: '' }
    },
    remark: '每天上班前同步一次昨日申请状态'
  },
  {
    id: 'JOB-0003', code: 'JOB_PP0011_001', name: 'SAP库存同步（工作时间每10分钟）',
    iface: 'PP0011', cron: '*/10 8-16 * * *', cronExtra: '0 17 * * *',
    cronText: '每天 08:00–17:00 期间每 10 分钟',
    cronConf: { type: 'window', interval: 10, unit: 'minute', time: '08:00', timeTo: '17:00' },
    status: '运行中', createdAt: '2026-06-18 10:40',
    params: {
      WERKS: { mode: 'EQ', value: '1000', value2: '' },
      LGORT: { mode: 'EQ', value: '', value2: '' },
      MATNR: { mode: 'EQ', value: '', value2: '' },
      CHARG: { mode: 'EQ', value: '', value2: '' },
      ONLY_NONZERO: { mode: 'EQ', value: true, value2: '' }
    },
    remark: '该接口近期有超时情况，需关注'
  },
  {
    id: 'JOB-0004', code: 'JOB_PP0004_002', name: '物料凭证历史补拉（每日）',
    iface: 'PP0004', cron: '0 2 * * *', cronText: '每天 02:00',
    cronConf: { type: 'daily', time: '02:00' },
    status: '已暂停', createdAt: '2026-04-02 11:10',
    params: {
      WERKS: { mode: 'EQ', value: '1000', value2: '' },
      BUDAT: { mode: 'BT', value: '2026-09-07', value2: '2026-09-07' },
      MATNR: { mode: 'EQ', value: '', value2: '' },
      BWART: { mode: 'EQ', value: '', value2: '' },
      WATERMARK: { mode: 'EQ', value: '', value2: '' },
      MAXROWS: { mode: 'EQ', value: '5000', value2: '' }
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
  type: 'list',
  currentJobId: '',
  viewTab: 'overview',
  editMode: false,
  _editDraft: null,
  _runParams: null,
  _runMode: 'once',

  listFilter: { iface: '', status: '', keyword: '', page: 1, pageSize: 10 },

  setType(t) {
    if (t === 'list') this.type = t;
  },

  /* ==================== 渲染入口 ==================== */
  render() {
    if (!isJobAdmin()) {
      return '<div style="padding:60px 20px;text-align:center;color:var(--text-secondary);">'
        + '<div style="font-size:44px;margin-bottom:12px;">🔒</div>'
        + '<div style="font-size:18px;font-weight:700;color:var(--text);">无访问权限</div>'
        + '<div style="font-size:13px;margin-top:6px;">定时JOB管理仅对系统管理员开放。</div></div>';
    }
    return this.renderListPage();
  },

  init() {
    this.bindList();
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

  /* ==================== 一、JOB清单 ==================== */
  renderListPage() {
    return `
    <div style="padding:20px 24px 0;background:#f6f8fb;min-height:calc(100vh - 56px);display:flex;flex-direction:column;">
      <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;flex:1;">
        <div class="list-toolbar">
          <div class="list-info"><span class="list-count" id="jobListCount">共 0 条</span></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary btn-sm" id="jobBtnCreate">+ 新建定时JOB</button>
          </div>
        </div>

        <div class="table-wrapper" id="jobTableWrap">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width:210px;">JOB编码</th>
                <th style="width:280px;">JOB名称</th>
                <th style="width:200px;">SAP 接口</th>
                <th style="width:160px;">执行周期</th>
                <th style="width:110px;">状态</th>
                <th style="width:100px;">操作</th>
              </tr>
            </thead>
            <tbody id="jobTableBody"></tbody>
          </table>
        </div>

      </div>

      <div style="background:#fff;border:1px solid var(--border);border-top:2px solid var(--border);border-radius:0 0 var(--radius) var(--radius);margin-top:-1px;padding:10px 20px;display:flex;align-items:center;justify-content:space-between;">
        <div class="list-info"><span class="list-count" id="jobListCount">共 0 条</span></div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="pagination-info" id="jobPageInfo">第 1 页</span>
          <div class="pagination" id="jobPagination"></div>
          <select class="page-size-select" onchange="ScheduledJob.setPageSize(this.value)">
            <option value="10" ${this.listFilter.pageSize === 10 ? 'selected' : ''}>10条/页</option>
            <option value="20" ${this.listFilter.pageSize === 20 ? 'selected' : ''}>20条/页</option>
            <option value="50" ${this.listFilter.pageSize === 50 ? 'selected' : ''}>50条/页</option>
          </select>
        </div>
      </div>
    </div>`;
  },

  bindList() {
    const self = this;
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
          <td>${esc(j.cronText)}</td>
          <td>${self.jobStatusBadge(j.status)}</td>
          <td><div class="table-actions"><button class="btn btn-blue btn-sm" onclick="ScheduledJob.openJobView('${j.id}')">查看</button></div></td>
        </tr>`;
      }).join('') : '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted);">没有符合条件的定时JOB</td></tr>';
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

  setPageSize(v) {
    this.listFilter.pageSize = parseInt(v, 10) || 10;
    this.listFilter.page = 1;
    this.renderListTable();
  },

  /* ==================== 二、定时JOB 查看大弹窗 ==================== */
  openJobView(jobId) {
    this.currentJobId = jobId;
    this.viewTab = 'overview';
    this.editMode = false;
    this._editDraft = null;
    this.renderJobView(jobId);
  },

  renderJobView(jobId) {
    const job = JOB_DEFS.find(j => j.id === jobId);
    if (!job) return;
    const iface = SAP_INTERFACES.find(i => i.code === job.iface) || {};
    const edit = this.editMode && job.status !== '已终止';
    const body = `
      <div style="min-height:60vh;">
        ${this.renderOverviewTab(job, iface, edit)}
      </div>`;

    const footer = [];
    if (job.status === '已终止') {
      footer.push({ text: '已终止，不可编辑', cls: 'btn-secondary', action: closeModal });
    } else if (edit) {
      footer.push({ text: '取消编辑', cls: 'btn-secondary', action: new Function("ScheduledJob.cancelEdit()") });
      footer.push({ text: '保存', cls: 'btn-primary', action: new Function("ScheduledJob.saveJobEdit('" + jobId + "')") });
    } else {
      const nextStatus = job.status === '运行中' ? '已暂停' : '运行中';
      footer.push({ text: job.status === '运行中' ? '暂停JOB' : '启用JOB', cls: 'btn-secondary', action: new Function("ScheduledJob.setJobStatus('" + jobId + "', '" + nextStatus + "')") });
      footer.push({ text: '终止JOB', cls: 'btn-secondary', action: new Function("ScheduledJob.terminateJob('" + jobId + "')") });
      footer.push({ text: '立即执行', cls: 'btn-secondary', action: new Function("ScheduledJob.runJob('" + jobId + "', 'once')") });
      footer.push({ text: '编辑', cls: 'btn-primary', action: new Function("ScheduledJob.startEdit('" + jobId + "')") });
    }

    showModal('定时JOB详情 · ' + esc(job.name), body, footer, 'modal-xxl');
  },

  startEdit(jobId) {
    this.editMode = true;
    this._editDraft = null;
    this.renderJobView(jobId);
  },

  cancelEdit() {
    this.editMode = false;
    this._editDraft = null;
    this.renderJobView(this.currentJobId);
  },

  /* 进入编辑前把当前界面上的输入暂存，避免重绘丢失 */
  collectEditDraft() {
    const job = JOB_DEFS.find(j => j.id === this.currentJobId);
    if (!job || !this.editMode) return;
    const nameEl = document.getElementById('editJobName');
    const statusEl = document.getElementById('editJobStatus');
    const remarkEl = document.getElementById('editJobRemark');
    const d = this._editDraft || {};
    this._editDraft = {
      name: nameEl ? nameEl.value : (d.name !== undefined ? d.name : job.name),
      status: statusEl ? statusEl.value : (d.status !== undefined ? d.status : job.status),
      remark: remarkEl ? remarkEl.value : (d.remark !== undefined ? d.remark : job.remark),
      params: document.getElementById('jobParamsForm') ? this.readParamsForm(job) : (d.params || job.params)
    };
  },

  saveJobEdit(jobId) {
    const job = JOB_DEFS.find(j => j.id === jobId);
    if (!job) return;
    this.collectEditDraft();
    const d = this._editDraft || {};
    job.name = (d.name || '').trim() || job.name;
    job.status = d.status || job.status;
    job.remark = d.remark || '';
    job.params = d.params || job.params;
    this.editMode = false;
    this._editDraft = null;
    toast('JOB 已保存');
    this.renderJobView(jobId);
    this.renderListTable();
  },

  renderOverviewTab(job, iface, edit) {
    const d = this._editDraft || {};
    const val = (key, fallback) => (d[key] !== undefined ? d[key] : fallback);
    const viewField = (label, valueHtml, full) => `
      <div class="form-group${full ? ' full' : ''}">
        <label>${label}</label>
        <div style="padding:9px 0;font-size:13.5px;font-weight:600;color:#1f2937;">${valueHtml}</div>
      </div>`;
    const editField = (label, ctrlHtml, full) => `
      <div class="form-group${full ? ' full' : ''}">
        <label>${label}</label>${ctrlHtml}
      </div>`;

    const cronBlock = `
      <div class="form-group full">
        <label>执行周期 ${edit ? '<button type="button" class="btn btn-secondary btn-sm" style="margin-left:8px;padding:3px 10px;" onclick="ScheduledJob.collectEditDraft();ScheduledJob.openCronPicker(\'' + job.id + '\')">设置</button>' : ''}</label>
        <div style="padding:9px 0;font-size:13.5px;font-weight:600;color:#1f2937;">
          ${esc(job.cronText)}
        </div>
      </div>`;

    /* 字段顺序与新建定时JOB 保持一致：SAP 接口 / JOB编码 / JOB名称 / 状态 / 执行周期(整行) / 备注(整行) */
    const basic = edit
      ? viewField('SAP 接口', esc(ifaceLabel(job.iface)))
        + viewField('JOB编码', esc(job.code))
        + editField('JOB名称', `<input id="editJobName" value="${esc(val('name', job.name))}">`)
        + editField('状态', `<select id="editJobStatus">
            <option value="运行中" ${val('status', job.status) === '运行中' ? 'selected' : ''}>运行中</option>
            <option value="已暂停" ${val('status', job.status) === '已暂停' ? 'selected' : ''}>已暂停</option>
          </select>`)
        + cronBlock
        + editField('备注', `<input id="editJobRemark" value="${esc(val('remark', job.remark))}" placeholder="选填">`, true)
      : viewField('SAP 接口', esc(ifaceLabel(job.iface)))
        + viewField('JOB编码', esc(job.code))
        + viewField('JOB名称', esc(job.name))
        + viewField('状态', this.jobStatusBadge(job.status))
        + cronBlock
        + viewField('备注', esc(job.remark || '—'), true);

    /* 查询条件：查看态用与新建/编辑一致的布局，控件只读 */
    const condBlock = this.renderParamsForm(iface, val('params', job.params), false, !edit);

    return `
      <div class="form-section">
        <div class="form-section-title">基本信息${edit ? '（编辑中）' : ''}</div>
        <div class="form-grid">${basic}</div>
      </div>
      <div class="form-section">
        <div class="form-section-title">查询条件</div>
        ${edit ? `<div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:var(--radius-sm);padding:12px 16px;margin-bottom:16px;font-size:12.5px;color:var(--text-secondary);line-height:1.7;">
            条件由接口 <strong>${esc(ifaceLabel(job.iface))}</strong> 的参数模板生成。每个条件可选比较方式：<strong>等于（单值）</strong>、<strong>不等于</strong>、<strong>介于</strong>、<strong>不属于区间</strong>。
          </div>` : ''}
        <div${edit ? ' id="jobParamsForm"' : ''}>${condBlock}</div>
      </div>`;
  },

  /* ==================== 执行周期设置器 ==================== */
  /* 周期类型：interval 固定频率 / daily 每天 / window 时间窗内频率 / weekly 每周 / monthly 每月 */
  defaultCronConf() {
    return { type: 'interval', interval: 10, unit: 'minute', time: '08:00', timeTo: '17:00', days: [1], dayOfMonth: 1 };
  },

  buildCron(c) {
    const n = parseInt(c.interval, 10) || 1;
    const WEEK = { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' };
    if (c.type === 'interval') {
      if (c.unit === 'hour') return { cron: '0 */' + n + ' * * *', cronExtra: '', cronText: '每 ' + n + ' 小时' };
      if (c.unit === 'day') return { cron: '0 0 */' + n + ' * *', cronExtra: '', cronText: '每 ' + n + ' 天' };
      return { cron: '*/' + n + ' * * * *', cronExtra: '', cronText: '每 ' + n + ' 分钟' };
    }
    if (c.type === 'daily') {
      const p = (c.time || '08:00').split(':');
      return { cron: Number(p[1]) + ' ' + Number(p[0]) + ' * * *', cronExtra: '', cronText: '每天 ' + c.time };
    }
    if (c.type === 'window') {
      const h1 = Number((c.time || '08:00').split(':')[0]);
      const h2 = Number((c.timeTo || '17:00').split(':')[0]);
      const lastHour = Math.max(h1, h2 - 1);
      const unitTxt = c.unit === 'hour' ? '小时' : '分钟';
      const cron = (c.unit === 'hour' ? '0 ' : '*/' + n + ' ') + h1 + '-' + lastHour + ' * * *';
      return {
        cron: cron,
        cronExtra: '0 ' + h2 + ' * * *',
        cronText: '每天 ' + c.time + '–' + c.timeTo + ' 期间每 ' + n + ' ' + unitTxt
      };
    }
    if (c.type === 'weekly') {
      const p = (c.time || '08:00').split(':');
      const days = (c.days || []).slice().sort();
      return {
        cron: Number(p[1]) + ' ' + Number(p[0]) + ' * * ' + days.join(','),
        cronExtra: '',
        cronText: '每周 ' + (days.map(d => WEEK[d]).join('、') || '—') + ' ' + c.time
      };
    }
    const pm = (c.time || '08:00').split(':');
    return {
      cron: Number(pm[1]) + ' ' + Number(pm[0]) + ' ' + (c.dayOfMonth || 1) + ' * *',
      cronExtra: '',
      cronText: '每月 ' + (c.dayOfMonth || 1) + ' 日 ' + (c.time || '08:00')
    };
  },

  /* 打开周期设置器：target = 'new' 表示新建表单，或传入 jobId 表示修改该 JOB */
  openCronPicker(target) {
    this._cronTarget = target;
    let conf = this.defaultCronConf();
    if (target !== 'new') {
      const job = JOB_DEFS.find(j => j.id === target);
      if (job && job.cronConf) conf = Object.assign(this.defaultCronConf(), job.cronConf);
    }
    this._cronDraft = conf;

    const body = `
      <div class="form-section">
        <div class="form-group">
          <label>周期类型</label>
          <select id="cronTypeSel" onchange="ScheduledJob.onCronTypeChange(this.value)">
            <option value="interval" ${conf.type === 'interval' ? 'selected' : ''}>固定频率（全天循环）</option>
            <option value="daily" ${conf.type === 'daily' ? 'selected' : ''}>每天固定时间</option>
            <option value="window" ${conf.type === 'window' ? 'selected' : ''}>时间窗内固定频率（如 08:00–17:00 每 10 分钟）</option>
            <option value="weekly" ${conf.type === 'weekly' ? 'selected' : ''}>每周指定日</option>
            <option value="monthly" ${conf.type === 'monthly' ? 'selected' : ''}>每月指定日</option>
          </select>
        </div>
      </div>
      <div class="form-section" id="cronOptionArea">${this.renderCronOptions(conf)}</div>
      <div class="form-section">
        <div class="form-section-title">预览</div>
        <div id="cronPreview" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:var(--radius-sm);padding:12px 16px;font-size:13px;"></div>
      </div>`;

    showModal('设置执行周期', body, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '确定', cls: 'btn-primary', action: new Function("ScheduledJob.applyCron()") }
    ], 'modal-md');

    this.renderCronPreview();
  },

  renderCronOptions(c) {
    const num = n => `<input type="number" id="cronInterval" value="${n}" min="1" style="width:90px;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);">`;
    const unitSel = u => `<select id="cronUnit" onchange="ScheduledJob.renderCronPreview()" style="padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);">
        <option value="minute" ${u === 'minute' ? 'selected' : ''}>分钟</option>
        <option value="hour" ${u === 'hour' ? 'selected' : ''}>小时</option>
        <option value="day" ${u === 'day' ? 'selected' : ''}>天</option>
      </select>`;
    const timeInput = (id, v) => `<input type="time" id="${id}" value="${esc(v)}" onchange="ScheduledJob.renderCronPreview()" style="padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);">`;
    const row = (html) => `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">${html}</div>`;

    if (c.type === 'interval') {
      return row(`每 ${num(c.interval)} ${unitSel(c.unit)} 执行一次`);
    }
    if (c.type === 'daily') {
      return row(`每天 ${timeInput('cronTime', c.time)} 执行一次`);
    }
    if (c.type === 'window') {
      return `<div style="display:flex;flex-direction:column;gap:12px;">
        <div>${row(`开始时间 ${timeInput('cronTime', c.time)} &nbsp;&nbsp; 结束时间 ${timeInput('cronTimeTo', c.timeTo)}`)}</div>
        <div>${row(`期间每 ${num(c.interval)} ${unitSel(c.unit)} 执行一次`)}</div>
      </div>`;
    }
    if (c.type === 'weekly') {
      const WEEK = [[1, '周一'], [2, '周二'], [3, '周三'], [4, '周四'], [5, '周五'], [6, '周六'], [0, '周日']];
      const boxes = WEEK.map(w => `<label style="display:flex;align-items:center;gap:5px;font-size:13px;margin:0;cursor:pointer;">
          <input type="checkbox" class="cronDay" value="${w[0]}" ${(c.days || []).indexOf(w[0]) >= 0 ? 'checked' : ''} onchange="ScheduledJob.renderCronPreview()" style="width:15px;height:15px;">${w[1]}
        </label>`).join('');
      return `<div style="display:flex;flex-direction:column;gap:12px;">
        <div>${row(boxes)}</div>
        <div>${row(`${timeInput('cronTime', c.time)} 执行`)}</div>
      </div>`;
    }
    return row(`每月 <input type="number" id="cronDayOfMonth" value="${c.dayOfMonth || 1}" min="1" max="31" style="width:90px;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);"> 日 ${timeInput('cronTime', c.time)} 执行`);
  },

  onCronTypeChange(type) {
    const area = document.getElementById('cronOptionArea');
    const conf = Object.assign(this._cronDraft || this.defaultCronConf(), { type: type });
    this._cronDraft = conf;
    if (area) area.innerHTML = this.renderCronOptions(conf);
    this.renderCronPreview();
  },

  readCronConf() {
    const typeEl = document.getElementById('cronTypeSel');
    const conf = Object.assign(this._cronDraft || this.defaultCronConf(), { type: typeEl ? typeEl.value : 'interval' });
    const iv = document.getElementById('cronInterval');
    if (iv) conf.interval = parseInt(iv.value, 10) || 1;
    const un = document.getElementById('cronUnit');
    if (un) conf.unit = un.value;
    const t = document.getElementById('cronTime');
    if (t) conf.time = t.value || conf.time;
    const t2 = document.getElementById('cronTimeTo');
    if (t2) conf.timeTo = t2.value || conf.timeTo;
    const dom = document.getElementById('cronDayOfMonth');
    if (dom) conf.dayOfMonth = parseInt(dom.value, 10) || 1;
    const days = [];
    document.querySelectorAll('.cronDay').forEach(el => { if (el.checked) days.push(parseInt(el.value, 10)); });
    if (days.length) conf.days = days;
    return conf;
  },

  renderCronPreview() {
    const conf = this.readCronConf();
    this._cronDraft = conf;
    const r = this.buildCron(conf);
    const el = document.getElementById('cronPreview');
    if (el) {
      el.innerHTML = '<div><strong>' + esc(r.cronText) + '</strong></div>';
    }
  },

  applyCron() {
    const conf = this.readCronConf();
    const r = this.buildCron(conf);
    if (this._cronTarget === 'new') {
      this._newCron = { cron: r.cron, cronExtra: r.cronExtra, cronText: r.cronText, cronConf: conf };
      const el = document.getElementById('newJobCronText');
      if (el) el.value = r.cronText;
      closeModal();
    } else {
      const job = JOB_DEFS.find(j => j.id === this._cronTarget);
      if (job) {
        job.cron = r.cron;
        job.cronExtra = r.cronExtra;
        job.cronText = r.cronText;
        job.cronConf = conf;
      }
      closeModal();
      toast('执行周期已更新：' + r.cronText);
      this.renderJobView(this._cronTarget);
    }
  },

  /* ---------- 动态参数表单 ---------- */
  /* 比较方式：EQ 等于(单值) / NE 不等于 / BT 介于(区间) / NB 不属于区间 */
  isRangeMode(mode) { return mode === 'BT' || mode === 'NB'; },

  normParamValue(p, raw) {
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      if (raw.from !== undefined || raw.to !== undefined) {
        return { mode: 'BT', value: raw.from || '', value2: raw.to || '' };
      }
      return {
        mode: raw.mode || 'EQ',
        value: raw.value === undefined ? '' : raw.value,
        value2: raw.value2 === undefined ? '' : raw.value2
      };
    }
    const base = (raw === undefined || raw === null) ? (p.def === undefined ? '' : p.def) : raw;
    return { mode: 'EQ', value: base, value2: '' };
  },

  modeOptions() {
    return [
      { v: 'EQ', t: '等于（单值）' },
      { v: 'NE', t: '不等于' },
      { v: 'BT', t: '介于' },
      { v: 'NB', t: '不属于区间' }
    ];
  },

  valueCtrl(p, val, part, show, readonly) {
    const key = esc(p.key);
    const v = part === 1 ? val.value : val.value2;
    const base = 'flex:1;min-width:0;padding:8px 12px;border:1px solid #d1d5db;border-radius:var(--radius-sm);'
      + 'font-size:13.5px;height:38px;box-sizing:border-box;'
      + (readonly ? 'background:#f1f5f9;color:#334155;border-color:#e2e8f0;' : 'background:#fff;');
    const style = base + (show ? '' : 'display:none;');
    const ro = readonly ? ' disabled' : '';
    if (p.type === 'select') {
      return `<select data-pkey="${key}" data-part="v${part}" style="${style}"${ro}>
        <option value="">— 请选择 —</option>
        ${(p.options || []).map(o => `<option value="${esc(o)}" ${String(v) === String(o) ? 'selected' : ''}>${esc(o)}</option>`).join('')}
      </select>`;
    }
    if (p.type === 'date') {
      return `<input type="date" data-pkey="${key}" data-part="v${part}" value="${esc(v || '')}" style="${style}"${ro}>`;
    }
    if (p.type === 'number') {
      return `<input type="number" data-pkey="${key}" data-part="v${part}" value="${esc(v || '')}" placeholder="请输入数值" style="${style}"${ro}>`;
    }
    return `<input type="text" data-pkey="${key}" data-part="v${part}" value="${esc(v || '')}" placeholder="留空不限" style="${style}"${ro}>`;
  },

  renderParamsForm(iface, values, selectable, readonly) {
    const list = (iface && iface.params) || [];
    if (!list.length) return '<div class="form-help">该接口未定义参数模板，请联系系统管理员维护。</div>';
    const self = this;
    const head = `
      <div style="display:flex;align-items:center;gap:14px;padding:0 16px 6px;font-size:12px;color:var(--text-muted);font-weight:600;">
        <div style="width:170px;flex-shrink:0;">查询字段</div>
        <div style="width:150px;flex-shrink:0;">比较方式</div>
        <div style="flex:1;">取值</div>
      </div>`;
    return head + list.map((p, i) => {
      const val = this.normParamValue(p, (values && values[p.key] !== undefined) ? values[p.key] : p.def);
      const range = this.isRangeMode(val.mode);
      const req = p.required ? '<span class="req" style="color:#dc2626;">*</span>' : '';
      const helpTip = p.help
        ? `<span title="${esc(p.help)}" style="margin-left:6px;color:#94a3b8;font-size:12px;cursor:help;">ⓘ</span>`
        : '';

      /* 值区：开关型 → 勾选框；其余 → 值1 [至] 值2 */
      let valueArea = '';
      if (p.type === 'switch') {
        valueArea = `<label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text);margin:0;">
            <input type="checkbox" data-pkey="${esc(p.key)}" data-part="v1" ${val.value ? 'checked' : ''} ${readonly ? 'disabled' : ''} style="width:16px;height:16px;"> 是
          </label>`;
      } else {
        valueArea = `<div style="flex:1;display:flex;align-items:center;gap:10px;">`
          + self.valueCtrl(p, val, 1, true, readonly)
          + `<span data-sep="${esc(p.key)}" style="color:#64748b;font-size:13px;flex-shrink:0;${range ? '' : 'display:none;'}">至</span>`
          + self.valueCtrl(p, val, 2, range, readonly)
          + `</div>`;
      }

      /* 比较方式：所有字段统一 4 种（开关型不涉及） */
      const modeSel = (p.type === 'switch') ? '' : `
        <select data-mode="${esc(p.key)}" ${readonly ? 'disabled' : "onchange=\"ScheduledJob.toggleMode('" + esc(p.key) + "')\""}
                style="width:150px;flex-shrink:0;padding:8px 10px;border:1px solid #d1d5db;border-radius:var(--radius-sm);font-size:13px;height:38px;box-sizing:border-box;${readonly ? 'background:#f1f5f9;color:#334155;border-color:#e2e8f0;' : 'background:#fff;'}">
          ${this.modeOptions().map(m => `<option value="${m.v}" ${val.mode === m.v ? 'selected' : ''}>${m.t}</option>`).join('')}
        </select>`;

      const condBox = selectable
        ? `<label style="display:flex;align-items:center;gap:5px;font-size:12px;color:var(--text-secondary);flex-shrink:0;margin:0;cursor:pointer;">
             <input type="checkbox" data-cond="${esc(p.key)}" checked onchange="ScheduledJob.toggleCond('${esc(p.key)}')" style="width:15px;height:15px;">作为条件
           </label>`
        : '';

      return `<div class="job-cond-row" style="display:flex;align-items:center;gap:14px;padding:12px 16px;margin-bottom:8px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:var(--radius-sm);">
        <div style="width:170px;flex-shrink:0;font-size:13.5px;font-weight:600;color:#1f2937;">
          <span style="display:inline-block;width:16px;color:#94a3b8;font-weight:400;">${i + 1}</span>${esc(p.label)}${req}${helpTip}
        </div>
        ${modeSel}
        ${valueArea}
        ${condBox}
      </div>`;
    }).join('');
  },

  /* 切换比较方式：单值 / 区间 */
  toggleMode(key) {
    const sel = document.querySelector('[data-mode="' + key + '"]');
    const range = sel ? this.isRangeMode(sel.value) : false;
    const v1 = document.querySelector('[data-pkey="' + key + '"][data-part="v1"]');
    const v2 = document.querySelector('[data-pkey="' + key + '"][data-part="v2"]');
    const sep = document.querySelector('[data-sep="' + key + '"]');
    if (v1) v1.style.flex = range ? '1' : '1';
    if (v2) v2.style.display = range ? 'block' : 'none';
    if (sep) sep.style.display = range ? 'inline' : 'none';
  },

  readParamsForm(job, selectable) {
    const iface = SAP_INTERFACES.find(i => i.code === job.iface) || {};
    const out = {};
    const self = this;
    (iface.params || []).forEach(p => {
      if (selectable) {
        const box = document.querySelector('[data-cond="' + p.key + '"]');
        if (box && !box.checked) {
          out[p.key] = { mode: 'EQ', value: p.type === 'switch' ? false : '', value2: '' };
          return;
        }
      }
      const v1 = document.querySelector('[data-pkey="' + p.key + '"][data-part="v1"]');
      if (!v1) {
        out[p.key] = self.normParamValue(p, (job.params && job.params[p.key] !== undefined) ? job.params[p.key] : p.def);
        return;
      }
      if (p.type === 'switch') {
        out[p.key] = { mode: 'EQ', value: v1.checked, value2: '' };
        return;
      }
      const modeEl = document.querySelector('[data-mode="' + p.key + '"]');
      const v2 = document.querySelector('[data-pkey="' + p.key + '"][data-part="v2"]');
      out[p.key] = {
        mode: modeEl ? modeEl.value : 'EQ',
        value: v1.value,
        value2: v2 ? v2.value : ''
      };
    });
    return out;
  },

  paramsSummary(iface, values) {
    const list = (iface && iface.params) || [];
    if (!list.length) return '—';
    return '<table style="width:100%;border-collapse:collapse;">' + list.map(p => {
      const val = this.normParamValue(p, (values && values[p.key] !== undefined) ? values[p.key] : p.def);
      let txt;
      if (p.type === 'switch') {
        txt = val.value ? '是' : '否';
      } else if (val.mode === 'BT') {
        txt = '介于 ' + (val.value || '不限') + ' ~ ' + (val.value2 || '不限');
      } else if (val.mode === 'NB') {
        txt = '不属于 ' + (val.value || '不限') + ' ~ ' + (val.value2 || '不限');
      } else {
        const empty = (val.value === '' || val.value === undefined || val.value === null);
        txt = empty ? '不限' : ((val.mode === 'NE' ? '≠ ' : '') + val.value);
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
    toast(status === '运行中' ? 'JOB 已启用' : 'JOB 已暂停');
    this.renderJobView(jobId);
    this.renderListTable();
  },

  terminateJob(jobId) {
    const job = JOB_DEFS.find(j => j.id === jobId);
    if (!job) return;
    const body = `
      <div>
        <div style="font-size:14px;line-height:1.8;margin-bottom:12px;">确定要终止定时JOB <strong>${esc(job.name)}</strong>（${esc(job.code)}）吗？</div>
        <div style="font-size:13px;color:#991b1b;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:10px 12px;">
          终止后该 JOB 不再被调度，且不可恢复；如需继续使用请新建定时JOB。
        </div>
      </div>`;
    showModal('终止定时JOB', body, [
      { text: '取消', cls: 'btn-secondary', action: new Function("ScheduledJob.renderJobView('" + jobId + "')") },
      { text: '确认终止', cls: 'btn-primary', action: new Function("ScheduledJob.doTerminate('" + jobId + "')") }
    ], 'modal-sm');
  },

  doTerminate(jobId) {
    const job = JOB_DEFS.find(j => j.id === jobId);
    if (!job) return;
    job.status = '已终止';
    closeModal();
    toast('JOB 已终止：' + job.name);
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
      ? '<span class="badge badge-blue badge-sm">仅本次执行</span> 用当前填写的条件临时跑一次，不改动 JOB 配置'
      : '<span class="badge badge-green badge-sm">保存并立即执行</span> 条件已保存，后续定时执行同样生效';

    const body = `
      <div>
        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:var(--radius-sm);padding:14px 16px;margin-bottom:16px;">
          <div style="font-size:13px;margin-bottom:6px;"><strong>定时JOB：</strong>${esc(job.name)}（${esc(job.code)}）</div>
          <div style="font-size:13px;margin-bottom:6px;"><strong>接口：</strong>${esc(ifaceLabel(job.iface))} · ${esc(iface.protocol || '')} · ${esc(iface.direction || '')}</div>
          <div style="font-size:13px;"><strong>执行方式：</strong>${modeText}</div>
        </div>
        <div class="form-section-title" style="font-size:14px;">本次将使用的查询条件</div>
        <div style="font-size:13px;line-height:1.9;background:#fff;border:1px solid #e5e7eb;border-radius:var(--radius-sm);padding:12px 16px;">
          ${this.paramsSummary(iface, params)}
        </div>
        <div class="form-help" style="margin-top:14px;">执行完成后会提示本次结果（拉取 / 新增 / 更新条数与耗时）。</div>
      </div>`;

    showModal('确认执行', body, [
      { text: '取消', cls: 'btn-secondary', action: new Function("ScheduledJob.cancelRun()") },
      { text: '确认执行', cls: 'btn-primary', action: new Function("ScheduledJob.doRun('" + jobId + "')") }
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
      message: this._runMode === 'once' ? '临时参数手工触发（不改动 JOB 配置）' : '保存条件后手工触发',
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
    showModal('JOB 执行中', body, [], 'modal-md');
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
  },

  /* ==================== 三、新建定时JOB ==================== */
  openCreate() {
    this._newCron = { cron: '*/10 * * * *', cronExtra: '', cronText: '每 10 分钟', cronConf: this.defaultCronConf() };
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
          <div class="form-group"><label>JOB编码</label>
            <input id="newJobCode" value="选择接口后自动生成" readonly style="background:#f8fafc;color:var(--text-secondary);">
            <div class="form-help">按「JOB_接口编号_序号」自动编号，如 JOB_PP0004_001</div></div>
          <div class="form-group"><label>JOB名称<span class="req">*</span></label>
            <input id="newJobName" placeholder="如 SAP物料凭证同步（10分钟）"></div>
          <div class="form-group"><label>状态</label>
            <select id="newJobStatus"><option value="运行中">运行中</option><option value="已暂停">已暂停</option></select></div>
          <div class="form-group full"><label>执行周期<span class="req">*</span></label>
            <div style="display:flex;align-items:center;gap:10px;">
              <input id="newJobCronText" value="${this._newCron ? esc(this._newCron.cronText) : '每 10 分钟'}" readonly style="flex:1;background:#f8fafc;color:#1f2937;">
              <button type="button" class="btn btn-secondary btn-sm" style="flex-shrink:0;" onclick="ScheduledJob.openCronPicker('new')">设置</button>
            </div>
            <div class="form-help">支持固定频率、每天固定时间、时间窗内频率（如 08:00–17:00 每 10 分钟）、每周/每月</div></div>
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

    showModal('新建定时JOB', body, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '保存', cls: 'btn-primary', action: new Function("ScheduledJob.saveNewJob()") }
    ], 'modal-xxl');
  },

  /* JOB编码自动生成：JOB_接口编号_序号（同一接口内递增） */
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
        area.innerHTML = '<div class="form-help">该接口未定义参数模板，请联系系统管理员维护。</div>';
      } else {
        area.innerHTML = this.renderParamsForm(iface, defs, true);
      }
    }
  },

  /* 勾选/取消某个入参作为查询条件 */
  toggleCond(key) {
    const box = document.querySelector('[data-cond="' + key + '"]');
    const els = document.querySelectorAll('[data-pkey="' + key + '"]');
    const modeEl = document.querySelector('[data-mode="' + key + '"]');
    const on = box ? box.checked : true;
    els.forEach(el => { el.disabled = !on; });
    if (modeEl) modeEl.disabled = !on;
    const group = box ? box.closest('.job-cond-row') : null;
    if (group) group.style.opacity = on ? '1' : '0.45';
  },

  saveNewJob() {
    const ifaceEl = document.getElementById('newJobIface');
    const ifaceCode = ifaceEl ? ifaceEl.value : '';
    if (!ifaceCode) { toast('请先选择 SAP 接口'); return; }
    const nameEl = document.getElementById('newJobName');
    const name = nameEl ? nameEl.value.trim() : '';
    if (!name) { toast('JOB名称为必填项'); return; }
    const code = this.nextJobCode(ifaceCode);

    const cronSet = this._newCron || { cron: '*/10 * * * *', cronExtra: '', cronText: '每 10 分钟', cronConf: this.defaultCronConf() };
    const cron = cronSet.cron;
    const cronExtra = cronSet.cronExtra || '';
    const cronText = cronSet.cronText;
    const cronConf = cronSet.cronConf;
    const status = (document.getElementById('newJobStatus') || {}).value || '运行中';

    const tmpJob = { iface: ifaceCode, params: {} };
    const params = this.readParamsForm(tmpJob, true);

    const maxId = JOB_DEFS.reduce(function (m, j) {
      const n = parseInt(String(j.id).replace('JOB-', ''), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);

    JOB_DEFS.push({
      id: 'JOB-' + String(maxId + 1).padStart(4, '0'),
      code: code, name: name, iface: ifaceCode,
      cron: cron, cronExtra: cronExtra, cronText: cronText, cronConf: cronConf,
      status: status, createdAt: jobHMStr(new Date()), params: params,
      remark: (document.getElementById('newJobRemark') || {}).value || ''
    });

    closeModal();
    toast('JOB 已创建：' + name + '（' + code + '）');
    this._newCron = null;
    this.setType('list');
    this.renderListTable();
  }
};
