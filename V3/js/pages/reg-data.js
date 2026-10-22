/* ==================== 法规情报 · 共享数据与样式 ====================
 * 法规情报（Regulatory Intelligence）模块的数据层，四个页面共用：
 *   法规清单 RegDocList      —— 采集结果一览
 *   适用性判定 RegApplicability —— 由 RA/QA 做出「适用 / 不适用」结论
 *   分发台账 RegDistribution —— 谁收到了、谁读了、谁签了回执
 *   法规源管理 RegSource     —— 监控哪些站点、怎么采、多久采一次
 *
 * 说明：全部为原型演示数据（mock），文号、人名、时限均为虚构示例，
 *       真实上线时由后台采集任务写入表 reg_source / reg_document / reg_distribution。
 * ================================================================ */

/* ---------- 1. 模块样式（注入一次，风格：极简商务 · 中性灰 + 深蓝单一强调色） ---------- */
(function injectRegIntelStyle() {
  if (document.getElementById('regIntelCommonStyle')) return;
  const style = document.createElement('style');
  style.id = 'regIntelCommonStyle';
  style.textContent = `
    .ri-wrap { display:flex; flex-direction:column; min-height:calc(100vh - 56px); background:#f6f8fb; }
    .ri-header {
      background:linear-gradient(135deg,var(--primary),var(--primary-light));
      padding:13px 24px; display:flex; align-items:center; justify-content:space-between; gap:16px; flex-shrink:0;
    }
    .ri-header h2 { font-size:17px; font-weight:700; color:#fff; letter-spacing:.5px; }
    .ri-header-sub { font-size:12px; color:rgba(255,255,255,.72); margin-top:3px; }
    .ri-header-actions { display:flex; gap:8px; flex-shrink:0; }
    .ri-header-actions .btn-primary { background:rgba(255,255,255,.16); border:1px solid rgba(255,255,255,.28); }
    .ri-header-actions .btn-primary:hover { background:rgba(255,255,255,.26); }

    .ri-toolbar {
      display:flex; align-items:center; justify-content:space-between; gap:12px;
      padding:9px 20px; background:#fff; border-bottom:1px solid var(--border); flex-shrink:0;
    }
    .ri-toolbar-left { display:flex; align-items:center; gap:14px; min-width:0; flex-wrap:wrap; }
    .ri-body { flex:1; display:flex; min-height:0; }
    .ri-filter {
      width:258px; flex-shrink:0; background:#fff; border-right:1px solid var(--border);
      padding:16px; overflow-y:auto;
    }
    .ri-filter::-webkit-scrollbar, .ri-scroll::-webkit-scrollbar { width:6px; }
    .ri-filter::-webkit-scrollbar-thumb, .ri-scroll::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }
    .ri-filter-title { font-size:12px; font-weight:700; color:var(--text-secondary); letter-spacing:.5px; margin-bottom:12px; }
    .ri-fgroup { margin-bottom:12px; }
    .ri-fgroup label { display:block; font-size:12px; font-weight:600; color:var(--text-secondary); margin-bottom:5px; }
    .ri-fgroup input, .ri-fgroup select, .ri-fgroup textarea {
      width:100%; padding:7px 10px; border:1px solid var(--border); border-radius:var(--radius-sm);
      font-size:13px; background:#fff; box-sizing:border-box;
    }
    .ri-fgroup input:focus, .ri-fgroup select:focus {
      outline:none; border-color:var(--primary); box-shadow:0 0 0 3px rgba(30,58,95,.08);
    }
    .ri-filter-actions { display:flex; gap:8px; flex-wrap:wrap; padding-top:4px; }
    .ri-content { flex:1; min-width:0; display:flex; flex-direction:column; overflow:hidden; }
    .ri-scroll { flex:1; overflow-y:auto; padding:14px 20px; }
    /* 表格区域：只保留纵向滚动条；横向滚动能力保留（Shift+滚轮 / 触控板），横向滚动条本身隐藏 */
    .ri-table-wrap { overflow-x:auto; overflow-y:auto; -ms-overflow-style:none; scrollbar-width:none; }
    .ri-table-wrap::-webkit-scrollbar { width:6px; height:0; }
    .ri-table-wrap::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }
    .ri-table-wrap::-webkit-scrollbar-thumb:hover { background:var(--text-muted); }

    .ri-stat-row { display:flex; gap:10px; margin-bottom:12px; }
    .ri-stat {
      flex:1; min-width:0; background:#fff; border:1px solid var(--border); border-radius:var(--radius); padding:9px 14px;
    }
    .ri-stat-label { font-size:12px; color:var(--text-secondary); display:flex; align-items:center; gap:5px; }
    .ri-stat-value { font-size:21px; font-weight:700; color:var(--primary); line-height:1.3; }
    .ri-stat-value.warn { color:var(--warning); }
    .ri-stat-value.danger { color:var(--danger); }
    .ri-stat-hint { font-size:11px; color:var(--text-muted); }

    .ri-card {
      background:#fff; border:1px solid var(--border); border-left:3px solid transparent;
      border-radius:var(--radius); padding:13px 16px; margin-bottom:10px; transition:box-shadow .15s,border-color .15s;
    }
    .ri-card:hover { box-shadow:var(--shadow-md); }
    .ri-card-pending { border-left-color:var(--primary); }
    .ri-card-overdue { border-left-color:var(--danger); }
    .ri-card-done { border-left-color:var(--success); }
    .ri-card-na { border-left-color:var(--border); }
    .ri-card-head { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; }
    .ri-card-title { font-size:14.5px; font-weight:700; color:var(--text); line-height:1.55; cursor:pointer; }
    .ri-card-title:hover { color:var(--primary-light); }
    .ri-card-right { text-align:right; flex-shrink:0; width:96px; }
    .ri-card-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-size:12px; color:var(--text-secondary); margin-top:7px; }
    .ri-card-summary { font-size:13px; color:var(--text-secondary); line-height:1.75; margin-top:9px; }
    .ri-card-foot { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:11px; }
    .ri-chips { display:flex; gap:6px; flex-wrap:wrap; }
    .ri-chip {
      background:#f1f5f9; color:#475569; padding:2px 8px; border-radius:4px; font-size:11.5px; line-height:1.6;
    }
    .ri-chip-hl { background:rgba(30,58,95,.08); color:var(--primary); }
    .ri-score-num { font-size:16px; font-weight:700; color:var(--primary); }
    .ri-score-bar { height:4px; background:#e5e7eb; border-radius:2px; overflow:hidden; margin-top:3px; }
    .ri-score-bar > i { display:block; height:100%; background:var(--primary); }

    .ri-kv-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:10px; }
    .ri-kv { padding:11px 14px; background:#f8fafc; border:1px solid #f1f5f9; border-radius:var(--radius-sm); }
    .ri-kv dt { font-size:12px; color:var(--text-secondary); margin-bottom:3px; }
    .ri-kv dd { font-size:13.5px; font-weight:600; color:var(--text); line-height:1.5; word-break:break-all; }
    .ri-section { margin-bottom:22px; }
    .ri-section:last-child { margin-bottom:0; }
    .ri-section-title {
      font-size:14px; font-weight:700; color:var(--primary); margin-bottom:12px;
      padding-bottom:7px; border-bottom:2px solid var(--primary); display:flex; align-items:center; gap:8px;
    }
    .ri-sub-title { font-size:13px; font-weight:700; color:var(--text); margin-bottom:8px; }
    .ri-para { font-size:13px; line-height:1.85; color:var(--text-secondary); }
    .ri-list { font-size:13px; line-height:1.9; color:var(--text-secondary); padding-left:18px; }
    .ri-attach {
      display:flex; align-items:center; gap:12px; border:1px solid var(--border);
      border-radius:var(--radius); padding:12px 14px; background:#f8fafc;
    }
    .ri-attach-icon { font-size:22px; flex-shrink:0; }
    .ri-note {
      background:#fffbeb; border:1px solid #fde68a; color:#92400e; padding:10px 12px;
      border-radius:var(--radius-sm); font-size:12.5px; line-height:1.75;
    }
    .ri-note-info { background:#f8fafc; border-color:var(--border); color:var(--text-secondary); }
    .ri-timeline { border-left:2px solid var(--border); padding-left:16px; }
    .ri-tl-item { position:relative; padding-bottom:14px; font-size:13px; line-height:1.7; }
    .ri-tl-item:last-child { padding-bottom:0; }
    .ri-tl-item::before {
      content:''; position:absolute; left:-21px; top:5px; width:8px; height:8px; border-radius:50%;
      background:var(--primary-light); box-shadow:0 0 0 2px #fff;
    }
    .ri-tl-time { font-size:12px; color:var(--text-muted); }
    .ri-tl-actor { font-weight:600; color:var(--text); }
    .ri-inline-form { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .ri-progress { height:6px; background:#e5e7eb; border-radius:3px; overflow:hidden; }
    .ri-progress > i { display:block; height:100%; background:var(--success); }
    .ri-mono { font-family:'Consolas','Monaco',monospace; font-size:12.5px; }
    .ri-link { color:var(--primary-light); text-decoration:none; word-break:break-all; }
    .ri-link:hover { text-decoration:underline; }
    .ri-empty { padding:60px 20px; text-align:center; color:var(--text-muted); font-size:13px; }
    .ri-empty-icon { font-size:40px; margin-bottom:10px; opacity:.5; }
  `;
  (document.head || document.documentElement).appendChild(style);
})();

/* ---------- 2. 枚举与展示映射 ---------- */
const RI_LEVELS = ['法律', '行政法规', '部门规章', '规范性文件', '技术标准', '工作文件', '征求意见稿', '国际指南'];
const RI_TOPICS = ['GMP管理', '数据完整性', '药典标准', '检验方法', '中药材/饮片', '标签说明书', '药物警戒', 'EHS/安环', '注册申报', '生产管理'];
const RI_STATUSES = ['pending', 'applicable', 'na', 'distributed', 'archived'];
const RI_STATUS_TEXT = {
  pending: '待判定', applicable: '已判定·适用', na: '已判定·不适用',
  distributed: '已分发闭环', archived: '已归档'
};
const RI_STATUS_CLS = {
  pending: 'badge-yellow', applicable: 'badge-blue', na: 'badge-gray',
  distributed: 'badge-green', archived: 'badge-gray'
};
const RI_PRIORITY_CLS = { 高: 'badge-red', 中: 'badge-yellow', 低: 'badge-gray' };

/* ---------- 3. 法规源（RegSource 页数据） ---------- */
const RI_SOURCES = [
  {
    id: 'SRC-001', code: 'NMPA-FGWJ', name: '国家药品监督管理局 · 法规文件',
    siteType: '药监官方网站', column: '政务公开 › 法规文件',
    url: 'https://www.nmpa.gov.cn/directory/web/nmpa/xxgk/fgwj/index.html',
    method: '网页采集', frequency: '每日 08:00', topics: ['GMP管理', '注册申报', '生产管理'],
    owner: '注册部 · 孙宁', status: '启用', health: '正常',
    lastRun: '2026-10-22 08:03', nextRun: '2026-10-23 08:00', monthCount: 26, thisCount: 3,
    note: '官网未提供 robots.txt 声明，按低频、非峰值策略访问；发现站点声明反爬时立即停用并转人工登记。',
    logs: [
      { at: '2026-10-22 08:03', result: '成功', count: 3, note: '新增 3 条，其中 1 条 AI 判定高相关' },
      { at: '2026-10-21 08:02', result: '成功', count: 1, note: '无命中高相关' },
      { at: '2026-10-20 08:02', result: '成功', count: 5, note: '含 1 条部门规章' }
    ]
  },
  {
    id: 'SRC-002', code: 'NMPA-GGTT', name: '国家药品监督管理局 · 公告通告',
    siteType: '药监官方网站', column: '政务公开 › 公告通告',
    url: 'https://www.nmpa.gov.cn/xxgk/ggtg/index.html',
    method: '网页采集', frequency: '每日 08:10', topics: ['GMP管理', '标签说明书', '药物警戒'],
    owner: '注册部 · 孙宁', status: '启用', health: '正常',
    lastRun: '2026-10-22 08:10', nextRun: '2026-10-23 08:10', monthCount: 41, thisCount: 2,
    note: '更新频率最高，建议与法规文件栏目去重后再入清单。',
    logs: [
      { at: '2026-10-22 08:10', result: '成功', count: 2, note: '去重后入清单 2 条' },
      { at: '2026-10-21 08:10', result: '成功', count: 7, note: '去重后入清单 4 条' }
    ]
  },
  {
    id: 'SRC-003', code: 'CHP-STD', name: '国家药典委员会 · 标准动态',
    siteType: '标准机构', column: '标准发布 › 通则与品种',
    url: 'https://www.chp.org.cn/#/standardDynamic',
    method: '网页采集', frequency: '每周一 09:00', topics: ['药典标准', '检验方法'],
    owner: 'QC · 张莉', status: '启用', health: '待核对',
    lastRun: '2026-10-19 09:05', nextRun: '2026-10-26 09:00', monthCount: 6, thisCount: 1,
    note: '页面为前端渲染，采集脚本依赖容器渲染完成，近两次抓取条数为 0，需人工核对选择器是否失效。',
    logs: [
      { at: '2026-10-19 09:05', result: '异常', count: 0, note: '未解析到列表节点，疑似站点改版' },
      { at: '2026-10-12 09:04', result: '成功', count: 1, note: '《中国药典》四部通则增补本' }
    ]
  },
  {
    id: 'SRC-004', code: 'CDE-GUIDE', name: '国家药品审评中心 · 指导原则',
    siteType: '药监官方网站', column: '指导原则 › 已发布',
    url: 'https://www.cde.org.cn/main/xxgk/listpage/9f9c74c73e0f8f56a8bfbc646055026d',
    method: '网页采集', frequency: '每周三 09:00', topics: ['注册申报', '检验方法'],
    owner: '注册部 · 孙宁', status: '启用', health: '正常',
    lastRun: '2026-10-21 09:02', nextRun: '2026-10-28 09:00', monthCount: 12, thisCount: 0,
    note: '以化药/生物药为主，中成药相关度低，相关度阈值设 60 以上再入「待判定」。',
    logs: [
      { at: '2026-10-21 09:02', result: '成功', count: 0, note: '本周无新增' },
      { at: '2026-10-14 09:01', result: '成功', count: 2, note: '均为化药相关' }
    ]
  },
  {
    id: 'SRC-005', code: 'PROV-MPA', name: '省药品监督管理局 · 通知公告',
    siteType: '地方药监', column: '通知公告',
    url: 'https://mpa.shandong.gov.cn/col/colxxxxx/index.html',
    method: '网页采集', frequency: '每周一 10:00', topics: ['GMP管理', '生产管理', '中药材/饮片'],
    owner: 'QA · 李敏', status: '启用', health: '正常',
    lastRun: '2026-10-19 10:04', nextRun: '2026-10-26 10:00', monthCount: 9, thisCount: 1,
    note: '属地监管要求优先处理，命中后建议直接提升为「高」优先级。',
    logs: [
      { at: '2026-10-19 10:04', result: '成功', count: 1, note: '受托生产监管通知，已提为高优先级' },
      { at: '2026-10-12 10:03', result: '成功', count: 2, note: '无高相关' }
    ]
  },
  {
    id: 'SRC-006', code: 'SAMR-GZ', name: '国家市场监督管理总局 · 规章文件',
    siteType: '政府门户', column: '政务公开 › 规章',
    url: 'https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/fgwj/',
    method: 'RSS订阅', frequency: '每周五 09:00', topics: ['标签说明书', '生产管理'],
    owner: 'QA · 李敏', status: '启用', health: '正常',
    lastRun: '2026-10-16 09:00', nextRun: '2026-10-23 09:00', monthCount: 5, thisCount: 0,
    note: '优先走官方 RSS；RSS 不可用时再降级为网页采集。',
    logs: [{ at: '2026-10-16 09:00', result: '成功', count: 1, note: '保健食品相关，判定不适用' }]
  },
  {
    id: 'SRC-007', code: 'MEM-EHS', name: '应急管理部 · 标准与通知',
    siteType: '政府门户', column: '政务公开 › 政策文件',
    url: 'https://www.mem.gov.cn/gk/zfxxgkpt/fdzdgknr/',
    method: '网页采集', frequency: '每周二 09:00', topics: ['EHS/安环'],
    owner: 'EHS · 赵鹏', status: '启用', health: '正常',
    lastRun: '2026-10-20 09:06', nextRun: '2026-10-27 09:00', monthCount: 7, thisCount: 1,
    note: 'EHS 相关法规直接分发至安环、生产、仓储条线。',
    logs: [{ at: '2026-10-20 09:06', result: '成功', count: 1, note: '危化品仓库储存安全技术要求' }]
  },
  {
    id: 'SRC-008', code: 'ICH-GUIDE', name: 'ICH · Guidelines（国际人用药品注册技术协调会）',
    siteType: '国际组织', column: 'Quality Guidelines',
    url: 'https://www.ich.org/page/quality-guidelines',
    method: '人工登记', frequency: '每月初核对', topics: ['检验方法', '注册申报'],
    owner: 'QC · 张莉', status: '启用', health: '正常',
    lastRun: '2026-10-08 14:20', nextRun: '2026-11-02 09:00', monthCount: 2, thisCount: 0,
    note: '英文源，采集接口不稳定，暂由负责人工登记并附原文 PDF。',
    logs: [{ at: '2026-10-08 14:20', result: '成功', count: 0, note: '本月无新增，人工核对完成' }]
  },
  {
    id: 'SRC-009', code: 'NHC-WJ', name: '国家卫生健康委 · 规范性文件',
    siteType: '政府门户', column: '政务公开 › 文件发布',
    url: 'https://www.nhc.gov.cn/wjw/index.shtml',
    method: '网页采集', frequency: '每周五 10:00', topics: ['生产管理'],
    owner: 'QA · 李敏', status: '停用', health: '已停用',
    lastRun: '2026-08-28 10:02', nextRun: '—', monthCount: 0, thisCount: 0,
    note: '半年内无命中本厂业务的相关文件，已按季度复核策略停用，2027 年 Q1 重新评估。',
    logs: [{ at: '2026-08-28 10:02', result: '成功', count: 0, note: '连续三期无命中，转入停用' }]
  }
];

/* ---------- 4. 法规条目（RegDocList / RegApplicability 数据） ---------- */
const RI_DOCS = [
  {
    id: 'REG-2026-0421',
    title: '关于《中国药典》2025年版四部通则增补本（第二批）的公告',
    sourceId: 'SRC-003', level: '技术标准', docNo: '2026年第74号',
    publishDate: '2026-10-18', effectiveDate: '2027-01-01', deadline: '',
    url: 'https://www.chp.org.cn/#/standardDynamic',
    attach: { name: '中国药典2025年版四部通则增补本（第二批）.pdf', pages: 46, size: '3.2 MB' },
    summary: '发布 12 项通则增补内容，涉及微生物限度检查、溶出度测定与中药材农药残留测定方法调整。QC 现有检验方法需逐项比对，凡引用被替代通则的检验 SOP 应在实施日期前完成换版。',
    aiPoints: [
      '新增通则 0842 替代原通则 0821，涉及中药材农药残留测定前处理',
      '微生物计数法培养基适用性判定标准收严',
      '实施日期 2027-01-01，过渡期交付质量负责人统一排期'
    ],
    tags: ['药典标准', '检验方法', '中药材/饮片'], impactAreas: ['QC检验方法', '质量放行标准', '中药材入厂检验'],
    aiScore: 96, priority: '高', status: 'pending', dueDate: '2026-10-25',
    captureMode: '网页采集', capturedAt: '2026-10-18 09:06', owner: '未指派',
    history: [
      { at: '2026-10-18 09:06', actor: '采集任务', action: '自动采集', note: '来源：国家药典委员会 · 标准动态' },
      { at: '2026-10-18 09:07', actor: 'AI 初筛', action: '生成摘要与适用性建议', note: '相关度 96，命中关键词：通则、农残、微生物限度' }
    ]
  },
  {
    id: 'REG-2026-0418',
    title: '药品记录与数据管理要求（修订征求意见稿）',
    sourceId: 'SRC-001', level: '征求意见稿', docNo: '药监综函〔2026〕112号',
    publishDate: '2026-10-15', effectiveDate: '', deadline: '2026-11-15',
    url: 'https://www.nmpa.gov.cn/directory/web/nmpa/xxgk/zhqyj/index.html',
    attach: { name: '药品记录与数据管理要求（征求意见稿）.pdf', pages: 28, size: '1.4 MB' },
    summary: '对电子记录、审计追踪、电子签名、数据完整性（ALCOA+）提出更细化的合规要求，明确计算机化系统清单与分级举证规则。征求意见期内需评估现有 MES/LIMS/QMS 的差距并形成反馈意见。',
    aiPoints: [
      '明确计算机化系统须按风险分级确定验证深度与举证材料',
      '审计追踪须纳入定期审阅，审阅记录需留存',
      '电子签名不得使用共享账号，需可追溯到自然人'
    ],
    tags: ['数据完整性', 'GMP管理'], impactAreas: ['CSV计算机化系统验证', '批记录管理', 'QC电子数据'],
    aiScore: 93, priority: '高', status: 'pending', dueDate: '2026-10-24',
    captureMode: '网页采集', capturedAt: '2026-10-15 08:04', owner: '信息中心 · 吴凡',
    history: [
      { at: '2026-10-15 08:04', actor: '采集任务', action: '自动采集', note: '来源：国家药品监督管理局 · 法规文件' },
      { at: '2026-10-15 08:05', actor: 'AI 初筛', action: '生成摘要与适用性建议', note: '相关度 93，影响范围含计算机化系统验证' },
      { at: '2026-10-16 09:20', actor: '系统', action: '分派责任人', note: '按主题标签「数据完整性」自动指派信息中心' }
    ]
  },
  {
    id: 'REG-2026-0415',
    title: '关于进一步加强药品受托生产监督管理工作的通知',
    sourceId: 'SRC-005', level: '规范性文件', docNo: '鲁药监发〔2026〕63号',
    publishDate: '2026-10-10', effectiveDate: '2026-12-01', deadline: '',
    url: 'https://mpa.shandong.gov.cn/col/colxxxxx/index.html',
    attach: { name: '关于进一步加强药品受托生产监督管理工作的通知.pdf', pages: 9, size: '620 KB' },
    summary: '属地省局要求受托生产方在受托协议、共线风险评估、批放行职责界面上进行自查并提交书面报告，含明确的时间节点与资料清单。',
    aiPoints: [
      '自查报告需在 2026-12-01 前提交属地检查局',
      '需提供受托产品的共线风险评估与清洁验证汇总',
      '明确受托方与委托方在放行记录上的职责界面'
    ],
    tags: ['GMP管理', '生产管理'], impactAreas: ['受托生产管理', '质量协议', '放行职责'],
    aiScore: 85, priority: '高', status: 'pending', dueDate: '2026-10-17',
    captureMode: '网页采集', capturedAt: '2026-10-10 10:11', owner: 'QA · 李敏',
    history: [
      { at: '2026-10-10 10:11', actor: '采集任务', action: '自动采集', note: '来源：省药品监督管理局 · 通知公告' },
      { at: '2026-10-10 10:12', actor: 'AI 初筛', action: '生成摘要与适用性建议', note: '相关度 85，属地文件自动提升为高优先级' },
      { at: '2026-10-18 08:30', actor: '系统', action: '超期提醒', note: '判定时限已过 5 天，仍未提交适用性结论' }
    ]
  },
  {
    id: 'REG-2026-0412',
    title: '药品生产质量管理规范（2010年修订）无菌药品附录（2026年修订）',
    sourceId: 'SRC-001', level: '部门规章', docNo: '2026年第58号',
    publishDate: '2026-10-09', effectiveDate: '2027-03-01', deadline: '',
    url: 'https://www.nmpa.gov.cn/directory/web/nmpa/xxgk/fgwj/index.html',
    attach: { name: 'GMP无菌药品附录（2026年修订）.pdf', pages: 34, size: '2.1 MB' },
    summary: '对无菌产品生产的洁净区分级监测、培养基模拟灌装频次、无菌工艺风险控制提出新要求。涉及冻干线、无菌灌装线的 SOP、环境监测计划与年度回顾方案换版。',
    aiPoints: [
      '洁净区悬浮粒子与微生物监测频次提高，需更新环境监测计划',
      '培养基模拟灌装试验由每半年调整为每半年且覆盖全部班次',
      '无菌工艺偏差须在批次放行前完成闭环'
    ],
    tags: ['GMP管理', '生产管理'], impactAreas: ['无菌生产管理', '洁净区监测', 'SOP换版'],
    aiScore: 88, priority: '高', status: 'applicable', dueDate: '2026-10-20',
    captureMode: '网页采集', capturedAt: '2026-10-09 08:02', owner: 'QA · 李敏',
    judgment: {
      result: '适用', by: 'QA · 李敏', at: '2026-10-13 15:40',
      reason: '公司冻干二期、无菌灌装线属于适用范围，附录修订直接影响洁净区监测频次与年度回顾方案。',
      actions: ['修订洁净区环境监测管理规程', '修订培养基模拟灌装方案', '更新年度产品质量回顾模板'],
      needChange: true, changeNo: 'CC-2026-018', completeDate: '2027-01-31'
    },
    history: [
      { at: '2026-10-09 08:02', actor: '采集任务', action: '自动采集', note: '来源：国家药品监督管理局 · 法规文件' },
      { at: '2026-10-09 08:03', actor: 'AI 初筛', action: '生成摘要与适用性建议', note: '相关度 88' },
      { at: '2026-10-13 15:40', actor: 'QA · 李敏', action: '适用性判定', note: '结论：适用；触发变更控制 CC-2026-018' },
      { at: '2026-10-13 16:05', actor: '系统', action: '生成分发任务草稿', note: '待分发至 QA、生产部、冻干线班组长' }
    ]
  },
  {
    id: 'REG-2026-0408',
    title: '中药材生产质量管理规范（GAP）监督检查要点（第二批）',
    sourceId: 'SRC-001', level: '规范性文件', docNo: '药监综〔2026〕77号',
    publishDate: '2026-10-02', effectiveDate: '2026-12-01', deadline: '',
    url: 'https://www.nmpa.gov.cn/directory/web/nmpa/xxgk/fgwj/index.html',
    attach: { name: '中药材GAP监督检查要点（第二批）.pdf', pages: 21, size: '1.1 MB' },
    summary: '增加对中药材供应商审计、基地现场核查、农残与重金属留样复核的要求。采购部需更新中药材供应商审计清单与年度现场核查计划。',
    aiPoints: [
      '中药材供应商审计覆盖率与频次要求提高',
      '需留存基地土壤与灌溉水检测记录',
      '入厂检验增加重金属复核批次比例'
    ],
    tags: ['中药材/饮片', 'GMP管理'], impactAreas: ['供应商管理', '中药材入厂检验'],
    aiScore: 82, priority: '中', status: 'applicable', dueDate: '2026-10-16',
    captureMode: '网页采集', capturedAt: '2026-10-02 08:05', owner: 'QA · 李敏',
    judgment: {
      result: '适用', by: 'QA · 李敏', at: '2026-10-08 11:20',
      reason: '公司中药材投料品种覆盖该批次清单，采购与仓储环节需同步调整。',
      actions: ['更新中药材供应商审计计划', '修订中药材入厂取样方案'],
      needChange: false, changeNo: '', completeDate: '2026-12-20'
    },
    history: [
      { at: '2026-10-02 08:05', actor: '采集任务', action: '自动采集', note: '来源：国家药品监督管理局 · 法规文件' },
      { at: '2026-10-08 11:20', actor: 'QA · 李敏', action: '适用性判定', note: '结论：适用，需修订供应商审计计划' },
      { at: '2026-10-14 09:30', actor: '注册部 · 孙宁', action: '发起分发', note: '分发至采购部、质量保证部、仓储部共 10 人' }
    ]
  },
  {
    id: 'REG-2026-0401',
    title: '药品说明书和标签管理规定（修订征求意见稿）',
    sourceId: 'SRC-002', level: '征求意见稿', docNo: '2026年第61号',
    publishDate: '2026-09-26', effectiveDate: '', deadline: '2026-10-26',
    url: 'https://www.nmpa.gov.cn/xxgk/ggtg/index.html',
    attach: { name: '药品说明书和标签管理规定（征求意见稿）.pdf', pages: 18, size: '980 KB' },
    summary: '对说明书【禁忌】【注意事项】项的格式、标签最小包装标示内容提出统一格式要求，涉及在产包装版面核对与已备案标签的改版。',
    aiPoints: [
      '内标签字数下限提高，需核实现有中盒与小盒版面',
      '已备案标签可在过渡期内消耗完毕',
      '说明书版本号需与注册平台保持一致'
    ],
    tags: ['标签说明书', '注册申报'], impactAreas: ['包装标签管理', '注册档案'],
    aiScore: 71, priority: '中', status: 'pending', dueDate: '2026-10-23',
    captureMode: '网页采集', capturedAt: '2026-09-26 08:11', owner: '未指派',
    history: [
      { at: '2026-09-26 08:11', actor: '采集任务', action: '自动采集', note: '来源：国家药品监督管理局 · 公告通告' },
      { at: '2026-09-26 08:12', actor: 'AI 初筛', action: '生成摘要与适用性建议', note: '相关度 71' },
      { at: '2026-10-21 08:30', actor: '系统', action: '到期提醒', note: '判定时限将至（2026-10-23）' }
    ]
  },
  {
    id: 'REG-2026-0395',
    title: '药物警戒委托管理相关工作指引（试行）',
    sourceId: 'SRC-001', level: '工作文件', docNo: '药监综函〔2026〕88号',
    publishDate: '2026-09-18', effectiveDate: '2026-10-01', deadline: '',
    url: 'https://www.nmpa.gov.cn/directory/web/nmpa/xxgk/fgwj/index.html',
    attach: { name: '药物警戒委托管理相关工作指引（试行）.pdf', pages: 12, size: '540 KB' },
    summary: '规范药物警戒工作的委托管理形式与受托方资质要求，明确委托协议必备条款。',
    aiPoints: ['适用于存在 PV 委托合作的持有人', '需建立受托方资质档案'],
    tags: ['药物警戒'], impactAreas: [],
    aiScore: 45, priority: '低', status: 'na', dueDate: '2026-09-30',
    captureMode: '网页采集', capturedAt: '2026-09-18 08:03', owner: '注册部 · 孙宁',
    judgment: {
      result: '不适用', by: '注册部 · 孙宁', at: '2026-09-19 10:15',
      reason: '公司无药物警戒委托合作安排，警戒工作由质量部自行承担。',
      actions: [], needChange: false, changeNo: '', completeDate: ''
    },
    history: [
      { at: '2026-09-18 08:03', actor: '采集任务', action: '自动采集', note: '来源：国家药品监督管理局 · 法规文件' },
      { at: '2026-09-19 10:15', actor: '注册部 · 孙宁', action: '适用性判定', note: '结论：不适用' }
    ]
  },
  {
    id: 'REG-2026-0388',
    title: '医疗器械网络销售质量管理规范现场检查指南',
    sourceId: 'SRC-002', level: '规范性文件', docNo: '械监〔2026〕44号',
    publishDate: '2026-09-10', effectiveDate: '2026-10-01', deadline: '',
    url: 'https://www.nmpa.gov.cn/xxgk/ggtg/index.html',
    attach: { name: '医疗器械网络销售质量管理规范现场检查指南.pdf', pages: 15, size: '760 KB' },
    summary: '面向医疗器械网络销售经营者的现场检查要点与不合格项判定原则。',
    aiPoints: ['仅适用于医疗器械经营企业'],
    tags: [], impactAreas: [],
    aiScore: 12, priority: '低', status: 'na', dueDate: '2026-09-24',
    captureMode: '网页采集', capturedAt: '2026-09-10 08:09', owner: '注册部 · 孙宁',
    judgment: {
      result: '不适用', by: '注册部 · 孙宁', at: '2026-09-11 09:40',
      reason: '公司经营范围不含医疗器械，AI 初筛已判定低相关。',
      actions: [], needChange: false, changeNo: '', completeDate: ''
    },
    history: [
      { at: '2026-09-10 08:09', actor: '采集任务', action: '自动采集', note: '来源：国家药品监督管理局 · 公告通告' },
      { at: '2026-09-11 09:40', actor: '注册部 · 孙宁', action: '适用性判定', note: '结论：不适用' }
    ]
  },
  {
    id: 'REG-2026-0379',
    title: '危险化学品仓库储存安全技术要求（GB 15603 修订版）',
    sourceId: 'SRC-007', level: '技术标准', docNo: 'GB 15603-2026',
    publishDate: '2026-08-28', effectiveDate: '2027-02-01', deadline: '',
    url: 'https://www.mem.gov.cn/gk/zfxxgkpt/fdzdgknr/',
    attach: { name: 'GB 15603-2026 危险化学品仓库储存安全技术要求.pdf', pages: 40, size: '2.8 MB' },
    summary: '调整危险化学品仓库的分类储存距离、通风与报警配置要求，涉及现有危化库的改造评估与管理制度换版。',
    aiPoints: [
      '禁忌物料储存间距要求提高，需重新核算库区布局',
      '可燃气体报警装置需联网并留存报警记录',
      '改造方案须在实施日前完成评审'
    ],
    tags: ['EHS/安环'], impactAreas: ['危化品仓库管理', '安全设施配置'],
    aiScore: 64, priority: '中', status: 'distributed', dueDate: '2026-09-10',
    captureMode: '网页采集', capturedAt: '2026-08-28 09:08', owner: 'EHS · 赵鹏',
    judgment: {
      result: '适用', by: 'EHS · 赵鹏', at: '2026-09-02 14:20',
      reason: '公司乙醇、丙酮储罐区与危化库在适用范围内，需做布局符合性评估。',
      actions: ['完成危化库布局符合性评估', '更新危化品储存管理制度'],
      needChange: true, changeNo: 'CC-2026-011', completeDate: '2027-01-15'
    },
    history: [
      { at: '2026-08-28 09:08', actor: '采集任务', action: '自动采集', note: '来源：应急管理部 · 政策文件' },
      { at: '2026-09-02 14:20', actor: 'EHS · 赵鹏', action: '适用性判定', note: '结论：适用；触发变更控制 CC-2026-011' },
      { at: '2026-09-05 10:00', actor: 'EHS · 赵鹏', action: '发起分发', note: '分发至 EHS、仓储、生产部共 8 人' },
      { at: '2026-09-25 17:30', actor: '系统', action: '回执汇总', note: '阅读 8/8，回执 6/8，2 人逾期未确认' }
    ]
  },
  {
    id: 'REG-2026-0344',
    title: 'ICH Q2(R2) 分析方法验证与 Q14 分析方法开发',
    sourceId: 'SRC-008', level: '国际指南', docNo: 'ICH-Q2(R2)/Q14',
    publishDate: '2026-07-15', effectiveDate: '', deadline: '',
    url: 'https://www.ich.org/page/quality-guidelines',
    attach: { name: 'ICH_Q2(R2)_Q14_Final.pdf', pages: 52, size: '4.5 MB' },
    summary: '更新分析方法验证参数与可接受标准，引入分析方法生命周期管理与 ATP（分析目标概况）概念，用于指导 QC 新方法验证与既有方法再验证。',
    aiPoints: [
      '精度、准确度验证方案需按 ATP 重新设计',
      '既有方法在有变更时进行再验证而非全量验证',
      '需建立分析方法性能历史数据库'
    ],
    tags: ['检验方法', '注册申报'], impactAreas: ['QC分析方法验证', '检验 SOP'],
    aiScore: 76, priority: '中', status: 'applicable', dueDate: '2026-08-10',
    captureMode: '人工登记', capturedAt: '2026-07-16 14:10', owner: 'QC · 张莉',
    judgment: {
      result: '适用', by: 'QC · 张莉', at: '2026-07-25 09:30',
      reason: 'QC 新建方法需按 ATP 设计验证方案，年内涉及 3 个品种方法转移。',
      actions: ['修订分析方法验证管理规程', '修订方法转移方案模板'],
      needChange: false, changeNo: '', completeDate: '2026-12-15'
    },
    history: [
      { at: '2026-07-16 14:10', actor: 'QC · 张莉', action: '人工登记入清单', note: '来源：ICH · Quality Guidelines' },
      { at: '2026-07-25 09:30', actor: 'QC · 张莉', action: '适用性判定', note: '结论：适用' },
      { at: '2026-08-20 09:15', actor: 'QC · 张莉', action: '发起分发', note: '分发至 QC、研发、注册部共 12 人' }
    ]
  },
  {
    id: 'REG-2026-0320',
    title: '药品生产质量管理规范（2010年修订）生物制品附录',
    sourceId: 'SRC-001', level: '部门规章', docNo: '2026年第37号',
    publishDate: '2026-06-20', effectiveDate: '2026-09-01', deadline: '',
    url: 'https://www.nmpa.gov.cn/directory/web/nmpa/xxgk/fgwj/index.html',
    attach: { name: 'GMP生物制品附录（2026年修订）.pdf', pages: 26, size: '1.6 MB' },
    summary: '针对生物制品生产的批定义、病毒去除灭活验证、原液与制剂的生产周期提出专门要求。',
    aiPoints: ['仅适用于生物制品生产企业'],
    tags: ['GMP管理'], impactAreas: [],
    aiScore: 35, priority: '低', status: 'archived', dueDate: '2026-07-10',
    captureMode: '网页采集', capturedAt: '2026-06-20 08:07', owner: 'QA · 李敏',
    judgment: {
      result: '不适用', by: 'QA · 李敏', at: '2026-06-24 10:05',
      reason: '公司产品为口服固体与中成药制剂，不含生物制品，归档留痕备查。',
      actions: [], needChange: false, changeNo: '', completeDate: ''
    },
    history: [
      { at: '2026-06-20 08:07', actor: '采集任务', action: '自动采集', note: '来源：国家药品监督管理局 · 法规文件' },
      { at: '2026-06-24 10:05', actor: 'QA · 李敏', action: '适用性判定', note: '结论：不适用' },
      { at: '2026-09-30 16:40', actor: '系统', action: '季度归档', note: '纳入法规历史档案，保留期 10 年' }
    ]
  }
];

/* ---------- 5. 分发记录（RegDistribution 页数据） ---------- */
const RI_DISTRIBUTIONS = [
  {
    id: 'DIS-2026-0034', docId: 'REG-2026-0408',
    distributeAt: '2026-10-14 09:30', by: '注册部 · 孙宁', channels: ['邮件', '企业微信'],
    dueDate: '2026-10-21', status: '已完成', requirement: '阅读并完成回执确认',
    recipients: [
      { dept: '采购部', role: '采购主管', name: '刘洋', readAt: '2026-10-14 10:05', ackAt: '2026-10-14 10:40', comment: '已核对中药材供应商清单，11 月完成现场核查排期' },
      { dept: '质量保证部', role: 'QA主管', name: '李敏', readAt: '2026-10-14 09:48', ackAt: '2026-10-14 11:12', comment: '已纳入年度审计计划' },
      { dept: '仓储部', role: '仓储主管', name: '陈刚', readAt: '2026-10-15 08:20', ackAt: '2026-10-15 08:35', comment: '已调整中药材取样区域标识' },
      { dept: '质量控制部', role: 'QC经理', name: '张莉', readAt: '2026-10-14 14:02', ackAt: '2026-10-20 16:00', comment: '已确认重金属复核比例，待方法确认' },
      { dept: '生产部', role: '车间主任', name: '王强', readAt: '2026-10-16 09:15', ackAt: '2026-10-18 10:22', comment: '已通知前处理班组' },
      { dept: '注册部', role: '注册专员', name: '孙宁', readAt: '2026-10-14 09:31', ackAt: '2026-10-14 09:35', comment: '已同步品种清单' },
      { dept: '质量保证部', role: '验证工程师', name: '郑霞', readAt: '2026-10-17 11:00', ackAt: '2026-10-20 15:30', comment: '无清洁验证影响' },
      { dept: '采购部', role: '供应商管理员', name: '何倩', readAt: '2026-10-14 10:30', ackAt: '2026-10-21 09:05', comment: '已补充基地资质档案清单' }
    ]
  },
  {
    id: 'DIS-2026-0031', docId: 'REG-2026-0379',
    distributeAt: '2026-09-05 10:00', by: 'EHS · 赵鹏', channels: ['邮件', '企业微信', '班组会'],
    dueDate: '2026-09-25', status: '回执逾期', requirement: '阅读、完成回执并反馈库区符合性自查结果',
    recipients: [
      { dept: '安环部', role: 'EHS主管', name: '赵鹏', readAt: '2026-09-05 10:02', ackAt: '2026-09-05 10:10', comment: '已启动库区符合性评估' },
      { dept: '仓储部', role: '仓储主管', name: '陈刚', readAt: '2026-09-05 11:20', ackAt: '2026-09-08 09:00', comment: '禁忌物料间距已现场标注' },
      { dept: '生产部', role: '车间主任', name: '王强', readAt: '2026-09-06 08:40', ackAt: '2026-09-10 14:30', comment: '班组已完成宣贯' },
      { dept: '设备部', role: '设备主管', name: '周涛', readAt: '2026-09-05 13:15', ackAt: '', comment: '可燃气体报警联网改造尚未报价' },
      { dept: '质量保证部', role: 'QA主管', name: '李敏', readAt: '2026-09-05 10:45', ackAt: '2026-09-12 16:20', comment: '纳入年度质量回顾输入' },
      { dept: '信息中心', role: 'IT工程师', name: '吴凡', readAt: '2026-09-05 15:00', ackAt: '', comment: '报警联网需评估接口方案' },
      { dept: '生产部', role: '安全员', name: '马超', readAt: '2026-09-07 09:10', ackAt: '2026-09-20 11:00', comment: '已张贴标准摘要于危化库' },
      { dept: '仓储部', role: '库管员', name: '钱磊', readAt: '2026-09-09 08:05', ackAt: '2026-09-22 17:40', comment: '已完成储存台账自查' }
    ]
  },
  {
    id: 'DIS-2026-0028', docId: 'REG-2026-0344',
    distributeAt: '2026-08-20 09:15', by: 'QC · 张莉', channels: ['邮件'],
    dueDate: '2026-09-30', status: '逾期未完成', requirement: '阅读、完成回执；QC 全体需参加季度培训考核',
    recipients: [
      { dept: '质量控制部', role: 'QC经理', name: '张莉', readAt: '2026-08-20 09:20', ackAt: '2026-08-20 09:35', comment: '已安排季度培训' },
      { dept: '质量控制部', role: '理化检验组长', name: '陈曦', readAt: '2026-08-21 10:00', ackAt: '2026-08-25 14:00', comment: '已按 ATP 模板修订方法验证方案' },
      { dept: '质量控制部', role: '仪器分析员', name: '李彤', readAt: '2026-08-24 09:30', ackAt: '', comment: '未回执' },
      { dept: '质量控制部', role: '理化检验员', name: '王芳', readAt: '2026-08-22 13:20', ackAt: '2026-09-28 17:10', comment: '已参加培训' },
      { dept: '研发部', role: '分析方法主管', name: '黄凯', readAt: '2026-08-26 15:40', ackAt: '', comment: '未回执' },
      { dept: '注册部', role: '注册专员', name: '孙宁', readAt: '2026-08-20 11:00', ackAt: '2026-09-15 10:20', comment: '评估报告已归档' },
      { dept: '质量控制部', role: '微生物检验员', name: '周颖', readAt: '2026-08-28 08:50', ackAt: '2026-09-30 16:05', comment: '已参加考核' },
      { dept: '质量保证部', role: '文件管理员', name: '郑霞', readAt: '2026-08-30 10:10', ackAt: '', comment: '未回执' },
      { dept: '生产部', role: '工艺员', name: '高原', readAt: '', ackAt: '', comment: '未查看' },
      { dept: '质量控制部', role: '留样管理员', name: '徐静', readAt: '2026-09-02 09:00', ackAt: '2026-09-29 15:30', comment: '已完成' },
      { dept: '研发部', role: '研究员', name: '毕磊', readAt: '2026-09-05 14:00', ackAt: '', comment: '未回执' },
      { dept: '信息中心', role: 'IT工程师', name: '吴凡', readAt: '2026-09-08 10:30', ackAt: '2026-09-26 09:00', comment: '已协助建立方法性能台账' }
    ]
  },
  {
    id: 'DIS-2026-0025', docId: 'REG-2026-0412',
    distributeAt: '', by: 'QA · 李敏', channels: [], dueDate: '2026-10-31',
    status: '待分发', requirement: '阅读、完成回执；涉及换版文件需参加培训',
    recipients: [
      { dept: '质量保证部', role: 'QA主管', name: '李敏', readAt: '', ackAt: '', comment: '' },
      { dept: '生产部', role: '车间主任', name: '王强', readAt: '', ackAt: '', comment: '' },
      { dept: '质量保证部', role: '环境监控员', name: '刘蕊', readAt: '', ackAt: '', comment: '' },
      { dept: '生产部', role: '冻干线班组长', name: '宋磊', readAt: '', ackAt: '', comment: '' },
      { dept: '质量控制部', role: '微生物检验员', name: '周颖', readAt: '', ackAt: '', comment: '' },
      { dept: '质量保证部', role: '验证工程师', name: '郑霞', readAt: '', ackAt: '', comment: '' },
      { dept: '设备部', role: '设备主管', name: '周涛', readAt: '', ackAt: '', comment: '' },
      { dept: '生产部', role: '工艺员', name: '高原', readAt: '', ackAt: '', comment: '' }
    ]
  },
  {
    id: 'DIS-2026-0019', docId: 'REG-2026-0320',
    distributeAt: '2026-06-30 14:00', by: 'QA · 李敏', channels: ['邮件'],
    dueDate: '2026-07-15', status: '已完成', requirement: '知悉并归档（不适用）',
    recipients: [
      { dept: '质量保证部', role: 'QA主管', name: '李敏', readAt: '2026-06-30 14:05', ackAt: '2026-06-30 14:20', comment: '归档备查' },
      { dept: '注册部', role: '注册专员', name: '孙宁', readAt: '2026-07-01 09:30', ackAt: '2026-07-02 10:00', comment: '知悉' }
    ]
  }
];

/* ---------- 6. 通用工具 ---------- */
const RegIntel = {
  today: '2026-10-22',

  source(id) {
    return RI_SOURCES.find(s => s.id === id) || null;
  },
  sourceName(id) {
    const s = this.source(id);
    return s ? s.name : id;
  },
  doc(id) {
    return RI_DOCS.find(d => d.id === id) || null;
  },
  dist(id) {
    return RI_DISTRIBUTIONS.find(d => d.id === id) || null;
  },
  distByDoc(docId) {
    return RI_DISTRIBUTIONS.filter(d => d.docId === docId);
  },

  statusBadge(s) {
    return '<span class="badge ' + (RI_STATUS_CLS[s] || 'badge-gray') + '">' + esc(RI_STATUS_TEXT[s] || s || '—') + '</span>';
  },
  priorityBadge(p) {
    if (!p) return '—';
    return '<span class="badge ' + (RI_PRIORITY_CLS[p] || 'badge-gray') + '">' + esc(p) + '</span>';
  },
  healthBadge(h) {
    if (h === '正常') return '<span class="badge badge-green">正常</span>';
    if (h === '待核对') return '<span class="badge badge-yellow">待核对</span>';
    if (h === '异常') return '<span class="badge badge-red">异常</span>';
    return '<span class="badge badge-gray">' + esc(h || '—') + '</span>';
  },
  distStatusBadge(s) {
    const cls = {
      '已完成': 'badge-green', '待分发': 'badge-gray', '进行中': 'badge-blue',
      '回执逾期': 'badge-yellow', '逾期未完成': 'badge-red'
    }[s] || 'badge-gray';
    return '<span class="badge ' + cls + '">' + esc(s) + '</span>';
  },

  // 相关度分值与色带
  scoreBlock(score) {
    return '<div class="ri-card-right">'
      + '<div style="font-size:11px;color:var(--text-muted);">AI 相关度</div>'
      + '<div class="ri-score-num">' + (score || 0) + '</div>'
      + '<div class="ri-score-bar"><i style="width:' + (score || 0) + '%;"></i></div>'
      + '</div>';
  },

  // 是否超期：待判定且判定时限已过今天
  isOverdue(doc) {
    return doc.status === 'pending' && !!doc.dueDate && this.diffDays(doc.dueDate) < 0;
  },
  // 距离到期天数（负数=已超期）
  diffDays(dateStr) {
    if (!dateStr) return 999;
    const a = new Date(String(dateStr).replace(/-/g, '/'));
    const b = new Date(this.today.replace(/-/g, '/'));
    return Math.round((a - b) / 86400000);
  },
  dueText(doc) {
    if (doc.status !== 'pending' || !doc.dueDate) return '';
    const d = this.diffDays(doc.dueDate);
    if (d < 0) return '<span style="color:var(--danger);font-weight:600;">判定逾 ' + Math.abs(d) + ' 天</span>';
    if (d === 0) return '<span style="color:var(--warning);font-weight:600;">今日到期</span>';
    if (d <= 3) return '<span style="color:var(--warning);font-weight:600;">剩 ' + d + ' 天</span>';
    return '<span>剩 ' + d + ' 天</span>';
  },

  // 分发台账：阅读 / 回执进度
  ackStats(dist) {
    const total = (dist.recipients || []).length;
    const read = (dist.recipients || []).filter(r => r.readAt).length;
    const ack = (dist.recipients || []).filter(r => r.ackAt).length;
    return { total: total, read: read, ack: ack, readPct: total ? Math.round(read / total * 100) : 0, ackPct: total ? Math.round(ack / total * 100) : 0 };
  },

  nextId(prefix, list) {
    const year = this.today.slice(0, 4);
    let max = 0;
    (list || []).forEach(function (x) {
      const n = parseInt(String(x.id).replace(/[^\d]/g, '').slice(-4), 10);
      if (!isNaN(n) && n > max) max = n;
    });
    return prefix + '-' + year + '-' + String(max + 1).padStart(4, '0');
  }
};
