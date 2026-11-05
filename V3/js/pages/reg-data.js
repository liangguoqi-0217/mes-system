/* ==================== 法规情报 · 数据层（法规动态页） ====================
 * 只服务一个页面：法规动态（reg-doc-list）。
 * 她每天扫一眼标题就知道有什么新法规；点「查看」看摘要、下载原文。
 *
 * 说明：全部为原型演示数据（mock），文号、日期均为虚构示例。
 *       真实上线时由后台定时采集任务写入，采集源清单作为后台配置管理，
 *       不在界面上做源管理页。
 * ================================================================ */

/* ---------- 发文单位（采集源） ---------- */
const RI_SOURCES = [
  { id: 'SRC-001', code: 'NMPA-FGWJ', name: '国家药品监督管理局 · 法规文件' },
  { id: 'SRC-002', code: 'NMPA-GGTT', name: '国家药品监督管理局 · 公告通告' },
  { id: 'SRC-003', code: 'CHP-STD', name: '国家药典委员会 · 标准动态' },
  { id: 'SRC-004', code: 'CDE-GUIDE', name: '国家药品审评中心 · 指导原则' },
  { id: 'SRC-005', code: 'PROV-MPA', name: '省药品监督管理局 · 通知公告' },
  { id: 'SRC-006', code: 'SAMR-GZ', name: '国家市场监督管理总局 · 规章文件' },
  { id: 'SRC-007', code: 'MEM-EHS', name: '应急管理部 · 政策文件' },
  { id: 'SRC-008', code: 'ICH-GUIDE', name: 'ICH · Guidelines' },
  { id: 'SRC-009', code: 'NHC-WJ', name: '国家卫生健康委 · 文件发布' }
];

/* ---------- 法规条目 ---------- */
const RI_DOCS = [
  {
    id: 'REG-2026-0421',
    title: '关于《中国药典》2025年版四部通则增补本（第二批）的公告',
    sourceId: 'SRC-003', level: '技术标准', docNo: '2026年第74号',
    publishDate: '2026-10-18', effectiveDate: '2027-01-01',
    url: 'https://www.chp.org.cn/#/standardDynamic',
    attach: { name: '中国药典2025年版四部通则增补本（第二批）.pdf', pages: 46, size: '3.2 MB' },
    summary: '发布 12 项通则增补内容，涉及微生物限度检查、溶出度测定与中药材农药残留测定方法调整。QC 现有检验方法需逐项比对，凡引用被替代通则的检验 SOP 应在实施日期前完成换版。',
    capturedAt: '2026-10-22 08:06'
  },
  {
    id: 'REG-2026-0418',
    title: '药品记录与数据管理要求（修订征求意见稿）',
    sourceId: 'SRC-001', level: '征求意见稿', docNo: '药监综函〔2026〕112号',
    publishDate: '2026-10-15', effectiveDate: '', deadline: '2026-11-15',
    url: 'https://www.nmpa.gov.cn/directory/web/nmpa/xxgk/zhqyj/index.html',
    attach: { name: '药品记录与数据管理要求（征求意见稿）.pdf', pages: 28, size: '1.4 MB' },
    summary: '对电子记录、审计追踪、电子签名、数据完整性（ALCOA+）提出更细化的合规要求，明确计算机化系统清单与分级举证规则。征求意见期内需评估现有 MES/LIMS/QMS 的差距。',
    capturedAt: '2026-10-22 08:04'
  },
  {
    id: 'REG-2026-0415',
    title: '关于进一步加强药品受托生产监督管理工作的通知',
    sourceId: 'SRC-005', level: '规范性文件', docNo: '鲁药监发〔2026〕63号',
    publishDate: '2026-10-10', effectiveDate: '2026-12-01',
    url: 'https://mpa.shandong.gov.cn/col/colxxxxx/index.html',
    attach: { name: '关于进一步加强药品受托生产监督管理工作的通知.pdf', pages: 9, size: '620 KB' },
    summary: '属地省局要求受托生产方在受托协议、共线风险评估、批放行职责界面上进行自查并提交书面报告，含明确的时间节点与资料清单。',
    capturedAt: '2026-10-22 08:11'
  },
  {
    id: 'REG-2026-0412',
    title: '药品生产质量管理规范（2010年修订）无菌药品附录（2026年修订）',
    sourceId: 'SRC-001', level: '部门规章', docNo: '2026年第58号',
    publishDate: '2026-10-09', effectiveDate: '2027-03-01',
    url: 'https://www.nmpa.gov.cn/directory/web/nmpa/xxgk/fgwj/index.html',
    attach: { name: 'GMP无菌药品附录（2026年修订）.pdf', pages: 34, size: '2.1 MB' },
    summary: '对无菌产品生产的洁净区分级监测、培养基模拟灌装频次、无菌工艺风险控制提出新要求。涉及无菌灌装线的 SOP、环境监测计划与年度回顾方案换版。',
    capturedAt: '2026-10-09 08:02'
  },
  {
    id: 'REG-2026-0408',
    title: '中药材生产质量管理规范（GAP）监督检查要点（第二批）',
    sourceId: 'SRC-001', level: '规范性文件', docNo: '药监综〔2026〕77号',
    publishDate: '2026-10-02', effectiveDate: '2026-12-01',
    url: 'https://www.nmpa.gov.cn/directory/web/nmpa/xxgk/fgwj/index.html',
    attach: { name: '中药材GAP监督检查要点（第二批）.pdf', pages: 21, size: '1.1 MB' },
    summary: '增加对中药材供应商审计、基地现场核查、农残与重金属留样复核的要求。采购部需更新中药材供应商审计清单与年度现场核查计划。',
    capturedAt: '2026-10-02 08:05'
  },
  {
    id: 'REG-2026-0401',
    title: '药品说明书和标签管理规定（修订征求意见稿）',
    sourceId: 'SRC-002', level: '征求意见稿', docNo: '2026年第61号',
    publishDate: '2026-09-26', effectiveDate: '', deadline: '2026-10-26',
    url: 'https://www.nmpa.gov.cn/xxgk/ggtg/index.html',
    attach: { name: '药品说明书和标签管理规定（征求意见稿）.pdf', pages: 18, size: '980 KB' },
    summary: '对说明书【禁忌】【注意事项】项的格式、标签最小包装标示内容提出统一格式要求，涉及在产包装版面核对与已备案标签的改版。',
    capturedAt: '2026-09-26 08:11'
  },
  {
    id: 'REG-2026-0395',
    title: '药物警戒委托管理相关工作指引（试行）',
    sourceId: 'SRC-001', level: '工作文件', docNo: '药监综函〔2026〕88号',
    publishDate: '2026-09-18', effectiveDate: '2026-10-01',
    url: 'https://www.nmpa.gov.cn/directory/web/nmpa/xxgk/fgwj/index.html',
    attach: { name: '药物警戒委托管理相关工作指引（试行）.pdf', pages: 12, size: '540 KB' },
    summary: '规范药物警戒工作的委托管理形式与受托方资质要求，明确委托协议必备条款。',
    capturedAt: '2026-09-18 08:03'
  },
  {
    id: 'REG-2026-0388',
    title: '医疗器械网络销售质量管理规范现场检查指南',
    sourceId: 'SRC-002', level: '规范性文件', docNo: '械监〔2026〕44号',
    publishDate: '2026-09-10', effectiveDate: '2026-10-01',
    url: 'https://www.nmpa.gov.cn/xxgk/ggtg/index.html',
    attach: { name: '医疗器械网络销售质量管理规范现场检查指南.pdf', pages: 15, size: '760 KB' },
    summary: '面向医疗器械网络销售经营者的现场检查要点与不合格项判定原则。',
    capturedAt: '2026-09-10 08:09'
  },
  {
    id: 'REG-2026-0379',
    title: '危险化学品仓库储存安全技术要求（GB 15603 修订版）',
    sourceId: 'SRC-007', level: '技术标准', docNo: 'GB 15603-2026',
    publishDate: '2026-08-28', effectiveDate: '2027-02-01',
    url: 'https://www.mem.gov.cn/gk/zfxxgkpt/fdzdgknr/',
    attach: { name: 'GB 15603-2026 危险化学品仓库储存安全技术要求.pdf', pages: 40, size: '2.8 MB' },
    summary: '调整危险化学品仓库的分类储存距离、通风与报警配置要求，涉及现有危化库的改造评估与管理制度换版。',
    capturedAt: '2026-08-28 09:08'
  },
  {
    id: 'REG-2026-0344',
    title: 'ICH Q2(R2) 分析方法验证与 Q14 分析方法开发',
    sourceId: 'SRC-008', level: '国际指南', docNo: 'ICH-Q2(R2)/Q14',
    publishDate: '2026-07-15', effectiveDate: '',
    url: 'https://www.ich.org/page/quality-guidelines',
    attach: { name: 'ICH_Q2(R2)_Q14_Final.pdf', pages: 52, size: '4.5 MB' },
    summary: '更新分析方法验证参数与可接受标准，引入分析方法生命周期管理与 ATP（分析目标概况）概念，用于指导 QC 新方法验证与既有方法再验证。',
    capturedAt: '2026-07-16 14:10'
  },
  {
    id: 'REG-2026-0320',
    title: '药品生产质量管理规范（2010年修订）生物制品附录',
    sourceId: 'SRC-001', level: '部门规章', docNo: '2026年第37号',
    publishDate: '2026-06-20', effectiveDate: '2026-09-01',
    url: 'https://www.nmpa.gov.cn/directory/web/nmpa/xxgk/fgwj/index.html',
    attach: { name: 'GMP生物制品附录（2026年修订）.pdf', pages: 26, size: '1.6 MB' },
    summary: '针对生物制品生产的批定义、病毒去除灭活验证、原液与制剂的生产周期提出专门要求。',
    capturedAt: '2026-06-20 08:07'
  }
];

/* ---------- 工具 ---------- */
const RegIntel = {
  source(id) {
    return RI_SOURCES.find(s => s.id === id) || null;
  },
  sourceName(id) {
    const s = this.source(id);
    return s ? s.name : id;
  },
  doc(id) {
    return RI_DOCS.find(d => d.id === id) || null;
  }
};
