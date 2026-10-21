// ===== 检验批管理页面 =====
// PRD v2.0 - 质量管理 → 质量检验 → 检验批管理
// v2.2 - 2026-07-07: 移除跨工厂检验协同功能（协同按钮/弹窗/生成确认）
// ✨ v3.0 - 2026-10-20: 重构检验批生成模式
//    · 01/02/03/04/05/06/08：SAP 自动生成检验批，MES 定时抓取后落库（拉取型）
//    · 89：MES 手工创建，调用 SAP 接口取得检验批号后落库（推送型）
//    · 使用决策（UD）在 MES 执行；检验结果实时回传 SAP
const InspectionBatch = {
  _version: '3.0-20261020',
  activeTab: 'list', // 'list' | 'sync'
  page: 1, pageSize: 10,
  filtered: [],

  // ==================== 检验批状态机 ====================
  // 主线：CRTD 已创建 → SAMP 取样中 → INSP 检验中 → DONE 检验完成 → DEC 已决策 → CLSD 已关闭
  // 旁路：非终态均可 → CANC 已取消（如 SAP 凭证冲销）
  // next/nextLabel 决定详情页底部该出现哪个推进按钮；终态为 null 则不再出现按钮
  statusFlow: [
    { code:'CRTD', name:'已创建',   badge:'badge-blue',   desc:'SAP 生成或 MES 手工创建后落地，尚未取样，可暂存草稿',   next:'SAMP', nextLabel:'提交检验' },
    { code:'SAMP', name:'取样中',   badge:'badge-yellow', desc:'已提交检验，按取样方案取样，样品待送实验室',           next:'INSP', nextLabel:'送检并开始录入' },
    { code:'INSP', name:'检验中',   badge:'badge-purple', desc:'样品已接收，检验特性逐项检测与录入中',                 next:'DONE', nextLabel:'完成检验' },
    { code:'DONE', name:'检验完成', badge:'badge-green',  desc:'全部检验特性已录入并自动判定，等待 QA 使用决策',       next:'DEC',  nextLabel:'使用决策' },
    { code:'DEC',  name:'已决策',   badge:'badge-blue',   desc:'QA 已作出使用决策，待库存过账后关闭',                 next:'CLSD', nextLabel:'关闭检验批' },
    { code:'CLSD', name:'已关闭',   badge:'badge-gray',   desc:'检验批已关闭归档，数据只读不可修改',                   next:null,   nextLabel:'' },
    { code:'CANC', name:'已取消',   badge:'badge-red',    desc:'检验批已取消（如 SAP 凭证冲销），不再执行',            next:null,   nextLabel:'' }
  ],

  getStatusMeta(code) {
    return this.statusFlow.find(s => s.code === code)
      || { code: code, name: code, badge: 'badge-gray', desc: '—', next: null, nextLabel: '' };
  },

  // 是否为终态（终态不出现推进按钮）
  _isFinalStatus(code) {
    const m = this.getStatusMeta(code);
    return !m.next;
  },

  // ==================== 检验类型与生成模式 ====================

  // 检验类型：01/02/03/04/05/06/08 由 SAP 自动生成，MES 定时抓取；89 由 MES 创建并回 SAP 取号
  inspectTypeOptions: [
    { code:'01', name:'采购收货检验', createMode:'SAP_AUTO',   sourceDocType:'MAT_DOC',    bindObject:'物料+批次' },
    { code:'02', name:'生产入库检验', createMode:'SAP_AUTO',   sourceDocType:'PROD_ORDER', bindObject:'物料+批次' },
    { code:'03', name:'生产过程检验', createMode:'SAP_AUTO',   sourceDocType:'PROD_ORDER', bindObject:'订单+工序' },
    { code:'04', name:'其他收货检验', createMode:'SAP_AUTO',   sourceDocType:'MAT_DOC',    bindObject:'物料+批次' },
    { code:'05', name:'发货检验',     createMode:'SAP_AUTO',   sourceDocType:'DELIVERY',   bindObject:'物料+批次' },
    { code:'06', name:'库存转储检验', createMode:'SAP_AUTO',   sourceDocType:'MAT_DOC',    bindObject:'物料+批次' },
    { code:'08', name:'复检',         createMode:'SAP_AUTO',   sourceDocType:'NONE',      bindObject:'物料+批次' },
    { code:'89', name:'手工检验批',   createMode:'MES_MANUAL', sourceDocType:'NONE',       bindObject:'物料+批次' }
  ],

  createModeOptions: [
    { code:'SAP_AUTO',   name:'SAP 自动生成' },
    { code:'MES_MANUAL', name:'MES 手工创建' }
  ],

  syncStatusOptions: [
    { code:'SYNCED',  name:'已同步'   },
    { code:'PENDING', name:'同步中'   },
    { code:'FAILED',  name:'同步失败' }
  ],

  sourceDocTypeOptions: [
    { code:'MAT_DOC',    name:'物料凭证' },
    { code:'PROD_ORDER', name:'生产订单' },
    { code:'DELIVERY',   name:'交货单'   },
    { code:'NONE',       name:'无来源'   }
  ],

  getInspectTypeName(code) {
    const t = this.inspectTypeOptions.find(x => x.code === code);
    return t ? `${code} ${t.name}` : code;
  },

  // ==================== 模拟数据 ====================

  // 同步任务日志（MES 定时抓取 SAP 检验批）
  syncLogData: [
    { id:'J001', jobId:'JOB-20261020-001', jobName:'SAP 检验批定时抓取', execTime:'2026-10-20 00:00:05', range:'2026-10-19 23:55:00 ~ 2026-10-20 00:00:00', total:12, success:12, failed:0, status:'SUCCESS', duration:'3.2s' },
    { id:'J002', jobId:'JOB-20261020-002', jobName:'SAP 检验批状态同步', execTime:'2026-10-20 00:05:00', range:'2026-10-19 00:00:00 ~ 2026-10-20 00:00:00', total:8, success:8, failed:0, status:'SUCCESS', duration:'1.8s' },
    { id:'J003', jobId:'JOB-20261020-003', jobName:'SAP 检验批定时抓取', execTime:'2026-10-20 00:10:00', range:'2026-10-20 00:05:00 ~ 2026-10-20 00:10:00', total:9, success:7, failed:2, status:'PARTIAL', duration:'4.1s', failReason:'接口超时（2 条）' },
    { id:'J004', jobId:'JOB-20261019-001', jobName:'复检到期批量生成', execTime:'2026-10-19 00:00:00', range:'复检到期日 <= 2026-10-19', total:5, success:5, failed:0, status:'SUCCESS', duration:'2.6s' },
    { id:'J005', jobId:'JOB-20261019-002', jobName:'SAP 检验批定时抓取', execTime:'2026-10-19 23:55:00', range:'2026-10-19 23:50:00 ~ 2026-10-19 23:55:00', total:6, success:0, failed:6, status:'FAILED', duration:'—', failReason:'SAP 接口连接失败' }
  ],

  // 检验批主表（SAP 抓取入库 / MES 手工创建）
  batchData: [
    { id:'B001', batchNo:'100000012301', sapLotNo:'100000012301', inspectType:'01', createMode:'SAP_AUTO', sourceDocType:'MAT_DOC', sourceDocNo:'4900000100', materialCode:'MAT-10005', materialName:'布洛芬原料药', sapBatch:'SAP-BT-20260501', supplierBatch:'BT202606A1', quantity:'200.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-001', purposeCode:'QC-01', purposeName:'来料检验', status:'CRTD', statusName:'已创建', createTime:'2026-06-14 09:00:00', createBy:'张工', updateTime:'2026-06-14 09:00:00', syncStatus:'SYNCED', syncTime:'2026-06-14 00:00:12', syncJobId:'JOB-20260614-001' },
    { id:'B002', batchNo:'100000012302', sapLotNo:'100000012302', inspectType:'01', createMode:'SAP_AUTO', sourceDocType:'MAT_DOC', sourceDocNo:'4900000101', materialCode:'MAT-10006', materialName:'维生素C原料', sapBatch:'SAP-BT-20260502', supplierBatch:'AK2606B02', quantity:'150.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-002', purposeCode:'QC-01', purposeName:'来料检验', status:'SAMP', statusName:'取样中', createTime:'2026-06-14 10:30:00', createBy:'李工', updateTime:'2026-06-14 14:00:00', syncStatus:'SYNCED', syncTime:'2026-06-14 00:00:12', syncJobId:'JOB-20260614-001' },
    { id:'B003', batchNo:'100000012303', sapLotNo:'100000012303', inspectType:'01', createMode:'SAP_AUTO', sourceDocType:'MAT_DOC', sourceDocNo:'4900000102', materialCode:'MAT-10007', materialName:'葡萄糖原料', sapBatch:'SAP-BT-20260510', supplierBatch:'GL2026C05', quantity:'800.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-001', purposeCode:'QC-01', purposeName:'来料检验', status:'INSP', statusName:'检验中', createTime:'2026-06-15 08:15:00', createBy:'张工', updateTime:'2026-06-16 09:00:00', syncStatus:'SYNCED', syncTime:'2026-06-15 00:00:08', syncJobId:'JOB-20260615-001' },
    { id:'B004', batchNo:'100000012304', sapLotNo:'100000012304', inspectType:'02', createMode:'SAP_AUTO', sourceDocType:'PROD_ORDER', sourceDocNo:'6000000121', materialCode:'MAT-10008', materialName:'盐酸克林霉素', sapBatch:'SAP-BT-20260512', supplierBatch:'YK2606D08', quantity:'50.000', unit:'KG', plant:'2001', plantName:'陕西步长制药工厂', planNo:'IP-2001-001', purposeCode:'QC-02', purposeName:'中间品检验', status:'DONE', statusName:'检验完成', createTime:'2026-06-16 11:00:00', createBy:'王工', updateTime:'2026-06-17 08:30:00', syncStatus:'SYNCED', syncTime:'2026-06-16 00:10:22', syncJobId:'JOB-20260616-001',
    inspectionVerdict:'passed', inspectionResults:[
      { micCode:'2001-MIC-001', micName:'外观', micType:'qualitative', methodName:'目视检查法', unit:'', lowerSpec:'—', upperSpec:'合格', value:'合格', verdict:'合格' },
      { micCode:'2001-MIC-002', micName:'pH值', micType:'quantitative', methodName:'pH值测定法', unit:'pH', lowerSpec:'3.5', upperSpec:'5.5', value:'4.62', verdict:'合格' },
      { micCode:'2001-MIC-003', micName:'含量测定', micType:'quantitative', methodName:'HPLC法', unit:'%', lowerSpec:'95.0', upperSpec:'105.0', value:'99.1', verdict:'合格' },
      { micCode:'2001-MIC-004', micName:'水分', micType:'quantitative', methodName:'干燥失重法', unit:'%', lowerSpec:'0', upperSpec:'2.0', value:'1.3', verdict:'合格' },
      { micCode:'2001-MIC-005', micName:'有关物质', micType:'quantitative', methodName:'HPLC法', unit:'%', lowerSpec:'0', upperSpec:'1.0', value:'0.82', verdict:'合格' }
    ] },
    { id:'B005', batchNo:'100000012305', sapLotNo:'100000012305', inspectType:'02', createMode:'SAP_AUTO', sourceDocType:'PROD_ORDER', sourceDocNo:'6000000122', materialCode:'MAT-20002', materialName:'注射用水', sapBatch:'SAP-BT-20260515', supplierBatch:'ZS2606E10', quantity:'2000.000', unit:'L', plant:'2002', plantName:'山东丹红制药工厂', planNo:'IP-2002-001', purposeCode:'QC-03', purposeName:'成品检验', status:'DEC', statusName:'已决策', createTime:'2026-06-13 07:00:00', createBy:'赵工', updateTime:'2026-06-14 16:00:00', decision:'release', decisionBy:'QA经理', decisionTime:'2026-06-14 16:00:00', syncStatus:'SYNCED', syncTime:'2026-06-14 00:05:00', syncJobId:'JOB-20260614-001' },
    { id:'B006', batchNo:'100000012306', sapLotNo:'100000012306', inspectType:'01', createMode:'SAP_AUTO', sourceDocType:'MAT_DOC', sourceDocNo:'4900000105', materialCode:'MAT-10009', materialName:'甘露醇辅料', sapBatch:'SAP-BT-20260518', supplierBatch:'GL2606F12', quantity:'100.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-001', purposeCode:'QC-01', purposeName:'来料检验', status:'CLSD', statusName:'已关闭', createTime:'2026-06-12 09:30:00', createBy:'张工', updateTime:'2026-06-13 17:00:00', decision:'release', decisionBy:'QA经理', decisionTime:'2026-06-13 10:00:00', closeTime:'2026-06-13 17:00:00', syncStatus:'SYNCED', syncTime:'2026-06-13 00:05:00', syncJobId:'JOB-20260613-001' },
    { id:'B007', batchNo:'100000012307', sapLotNo:'100000012307', inspectType:'01', createMode:'SAP_AUTO', sourceDocType:'MAT_DOC', sourceDocNo:'4900000106', materialCode:'MAT-10010', materialName:'微晶纤维素', sapBatch:'SAP-BT-20260520', supplierBatch:'WX2026G13', quantity:'300.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-002', purposeCode:'QC-01', purposeName:'来料检验', status:'CANC', statusName:'已取消', createTime:'2026-06-11 10:00:00', createBy:'李工', updateTime:'2026-06-12 08:00:00', cancelReason:'SAP 凭证冲销，自动取消', syncStatus:'SYNCED', syncTime:'2026-06-12 00:05:00', syncJobId:'JOB-20260612-001' },
    // 其他工厂检验批数据（演示用）
    { id:'B008', batchNo:'100000012308', sapLotNo:'100000012308', inspectType:'03', createMode:'SAP_AUTO', sourceDocType:'PROD_ORDER', sourceDocNo:'6000000231', materialCode:'MAT-10001', materialName:'阿莫西林原料药', sapBatch:'SAP-BT-20260601', supplierBatch:'AM2026H14', quantity:'500.000', unit:'KG', plant:'2001', plantName:'陕西步长制药工厂', planNo:'2001-IP-00001', purposeCode:'QC-01', purposeName:'来料检验', status:'DONE', statusName:'检验完成', createTime:'2026-06-15 08:00:00', createBy:'刘工', updateTime:'2026-06-17 14:00:00', syncStatus:'SYNCED', syncTime:'2026-06-15 00:00:22', syncJobId:'JOB-20260615-002',
      decision:'pending', decisionBy:'', decisionTime:'', inspectionVerdict:'passed', inspectionRemark:'所有项目均合格',
      crossPlantOps: [
        { opNum:'0010', opType:'sampling', opTypeName:'取样', workCenterName:'取样组', description:'按常规取样方案', status:'done', sampledBy:'王工', sampleTime:'2026-06-16 09:30', sampleQty:'5.000', samplingPlanName:'SP-001 常规取样方案' },
        { opNum:'0020', opType:'inspection', opTypeName:'理化检验', workCenterName:'理化实验室', description:'理化项目检验', status:'done', doneBy:'孙工', doneTime:'2026-06-16 16:00',
          results: [
            { micCode:'2001-MIC-001', micName:'pH值', micType:'quantitative', methodName:'pH值测定法', unit:'pH', lowerSpec:'5.0', upperSpec:'7.0', value:'6.58', verdict:'合格' },
            { micCode:'2001-MIC-002', micName:'水分含量', micType:'quantitative', methodName:'干燥失重法', unit:'%', lowerSpec:'0', upperSpec:'5.0', value:'2.1', verdict:'合格' },
            { micCode:'2001-MIC-003', micName:'外观', micType:'qualitative', methodName:'目视检查法', defaultCode:'合格', value:'合格', verdict:'合格' }
          ]
        },
        { opNum:'0030', opType:'inspection', opTypeName:'含量检测', workCenterName:'仪器分析室', description:'含量及相关物质', status:'done', doneBy:'孙工', doneTime:'2026-06-17 10:00',
          results: [
            { micCode:'2001-MIC-004', micName:'含量测定', micType:'quantitative', methodName:'HPLC法', unit:'%', lowerSpec:'95.0', upperSpec:'105.0', value:'99.3', verdict:'合格' },
            { micCode:'2001-MIC-005', micName:'重金属', micType:'quantitative', methodName:'原子吸收法', unit:'ppm', lowerSpec:'0', upperSpec:'20', value:'8.2', verdict:'合格' }
          ]
        },
        { opNum:'0040', opType:'inspection', opTypeName:'微生物限度', workCenterName:'微生物实验室', description:'微生物限度检查', status:'done', doneBy:'赵工', doneTime:'2026-06-17 14:00',
          results: [
            { micCode:'2001-MIC-006', micName:'需氧菌总数', micType:'quantitative', methodName:'薄膜过滤法', unit:'CFU/g', lowerSpec:'0', upperSpec:'1000', value:'120', verdict:'合格' },
            { micCode:'2001-MIC-007', micName:'霉菌酵母菌总数', micType:'quantitative', methodName:'薄膜过滤法', unit:'CFU/g', lowerSpec:'0', upperSpec:'100', value:'<10', verdict:'合格' },
            { micCode:'2001-MIC-008', micName:'大肠埃希菌', micType:'qualitative', methodName:'薄膜过滤法', defaultCode:'未检出', value:'未检出', verdict:'合格' }
          ]
        }
      ]
    },
    { id:'B009', batchNo:'100000012309', sapLotNo:'100000012309', inspectType:'89', createMode:'MES_MANUAL', sourceDocType:'NONE', sourceDocNo:'', materialCode:'MAT-10002', materialName:'淀粉辅料', sapBatch:'SAP-BT-20260602', supplierBatch:'DF2606I14', quantity:'1000.000', unit:'KG', plant:'2002', plantName:'山东丹红制药工厂', planNo:'2002-IP-00001', purposeCode:'QC-01', purposeName:'来料检验', status:'INSP', statusName:'检验中', createTime:'2026-06-14 09:00:00', createBy:'陈工', updateTime:'2026-06-17 11:00:00', syncStatus:'SYNCED', syncTime:'2026-06-14 09:00:00', syncJobId:'—',
      crossPlantOps: [
        { opNum:'0010', opType:'sampling', opTypeName:'取样', workCenterName:'取样组', description:'按取样方案执行', status:'done', sampledBy:'周工', sampleTime:'2026-06-15 14:00', sampleQty:'3.000', samplingPlanName:'SP-002 辅料取样方案' },
        { opNum:'0020', opType:'inspection', opTypeName:'理化检验', workCenterName:'理化实验室', description:'理化项目检验', status:'done', doneBy:'吴工', doneTime:'2026-06-16 11:00',
          results: [
            { micCode:'2002-MIC-001', micName:'pH值', micType:'quantitative', methodName:'pH值测定法', unit:'pH', lowerSpec:'4.5', upperSpec:'7.0', value:'5.82', verdict:'合格' },
            { micCode:'2002-MIC-002', micName:'干燥失重', micType:'quantitative', methodName:'干燥失重法', unit:'%', lowerSpec:'0', upperSpec:'14.0', value:'11.5', verdict:'合格' }
          ]
        },
        { opNum:'0030', opType:'inspection', opTypeName:'微生物限度', workCenterName:'微生物实验室', description:'微生物限度检查', status:'pending', results: [
          { micCode:'2002-MIC-003', micName:'需氧菌总数', micType:'quantitative', methodName:'薄膜过滤法', unit:'CFU/g', lowerSpec:'0', upperSpec:'1000', value:'', verdict:'' },
          { micCode:'2002-MIC-004', micName:'大肠埃希菌', micType:'qualitative', methodName:'薄膜过滤法', defaultCode:'未检出', value:'', verdict:'' }
        ]}
      ]
    },
    // ============ 以下为新增演示数据：覆盖 08 复检 / 04 其他 / 05 发货 / 06 转储 ============
    { id:'B010', batchNo:'100000012310', sapLotNo:'100000012310', inspectType:'08', createMode:'SAP_AUTO', sourceDocType:'NONE', sourceDocNo:'', materialCode:'MAT-10005', materialName:'布洛芬原料药', sapBatch:'SAP-BT-20261001', supplierBatch:'BT2026J20', quantity:'200.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-001', purposeCode:'QC-01', purposeName:'来料检验', status:'CRTD', statusName:'已创建', createTime:'2026-10-19 00:00:00', createBy:'复检JOB', updateTime:'2026-10-19 00:00:00', syncStatus:'SYNCED', syncTime:'2026-10-19 00:00:00', syncJobId:'JOB-20261019-001' },
    { id:'B011', batchNo:'100000012311', sapLotNo:'100000012311', inspectType:'04', createMode:'SAP_AUTO', sourceDocType:'MAT_DOC', sourceDocNo:'4900000501', materialCode:'MAT-30001', materialName:'中转辅料-白砂糖', sapBatch:'SAP-BT-20261015', supplierBatch:'', quantity:'500.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-003', purposeCode:'QC-01', purposeName:'来料检验', status:'CRTD', statusName:'已创建', createTime:'2026-10-18 10:00:00', createBy:'张工', updateTime:'2026-10-18 10:00:00', syncStatus:'FAILED', syncTime:'2026-10-18 00:00:00', syncJobId:'JOB-20261018-002' },
    { id:'B012', batchNo:'100000012312', sapLotNo:'100000012312', inspectType:'05', createMode:'SAP_AUTO', sourceDocType:'DELIVERY', sourceDocNo:'8800000123', materialCode:'MAT-10006', materialName:'维生素C原料', sapBatch:'SAP-BT-20260502', supplierBatch:'', quantity:'150.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-002', purposeCode:'QC-03', purposeName:'成品检验', status:'CRTD', statusName:'已创建', createTime:'2026-10-17 14:30:00', createBy:'李工', updateTime:'2026-10-17 14:30:00', syncStatus:'SYNCED', syncTime:'2026-10-17 14:35:00', syncJobId:'JOB-20261017-003' },
    { id:'B013', batchNo:'100000012313', sapLotNo:'100000012313', inspectType:'06', createMode:'SAP_AUTO', sourceDocType:'MAT_DOC', sourceDocNo:'4900000301', materialCode:'MAT-10009', materialName:'甘露醇辅料', sapBatch:'SAP-BT-20261012', supplierBatch:'', quantity:'100.000', unit:'KG', plant:'1000', plantName:'山东步长制药工厂', planNo:'IP-1000-001', purposeCode:'QC-01', purposeName:'来料检验', status:'CRTD', statusName:'已创建', createTime:'2026-10-16 11:00:00', createBy:'王工', updateTime:'2026-10-16 11:00:00', syncStatus:'SYNCED', syncTime:'2026-10-16 11:05:00', syncJobId:'JOB-20261016-002' }
  ],

  // 检验计划选项（从 ipData 动态构建）
  getPlanOptions(materialCode) {
    // 优先匹配当前物料，其余排在后面
    const all = (typeof ipData !== 'undefined' ? ipData : []).filter(p => p.status === 'active');
    const matched = all.filter(p => p.materialCode === materialCode);
    const others = all.filter(p => p.materialCode !== materialCode);
    return [...matched, ...others].map(p => ({ no: p.code, name: p.materialName + ' - ' + p.purposeName, plan: p }));
  },

  // 用途代码选项
  purposeOptions: [
    { code:'QC-01', name:'来料检验' },
    { code:'QC-02', name:'中间品检验' },
    { code:'QC-03', name:'成品检验' },
    { code:'QC-04', name:'稳定性考察' }
  ],

  // 工厂选项
  factoryOptions: [
    { code:'1000', name:'山东步长制药工厂' },
    { code:'2001', name:'陕西步长制药工厂' },
    { code:'2002', name:'山东丹红制药工厂' }
  ],

  // ==================== 检验批状态机 ====================
  // 正向流转：CRTD 已创建 → SAMP 取样中 → INSP 检验中 → DONE 检验完成 → DEC 已决策 → CLSD 已关闭
  // 旁路终态：CANC 已取消（任意非终态可取消）
  // next = 允许的下一步；nextLabel = 详情弹窗底部推进按钮文案；desc = 给操作用户看的状态说明
  statusFlow: [
    { code:'CRTD', name:'已创建',   badge:'badge-gray',   desc:'检验批已生成，等待取样', next:'SAMP', nextLabel:'提交检验' },
    { code:'SAMP', name:'取样中',   badge:'badge-blue',   desc:'已下达取样任务，等待现场取样完成', next:'INSP', nextLabel:'开始检验' },
    { code:'INSP', name:'检验中',   badge:'badge-yellow', desc:'样品已送达，检验特性正在逐项检测', next:'DONE', nextLabel:'完成检验' },
    { code:'DONE', name:'检验完成', badge:'badge-purple', desc:'全部检验特性已出结果，等待质量判定', next:'DEC',  nextLabel:'使用决策' },
    { code:'DEC',  name:'已决策',   badge:'badge-green',  desc:'已完成使用决策（放行/让步/退回/报废），待关闭归档', next:'CLSD', nextLabel:'关闭检验批' },
    { code:'CLSD', name:'已关闭',   badge:'badge-gray',   desc:'检验批已关闭，数据归档，不可再修改', next:null,   nextLabel:'' },
    { code:'CANC', name:'已取消',   badge:'badge-red',    desc:'检验批已取消（如 SAP 凭证冲销），流程终止', next:null, nextLabel:'' }
  ],

  // 取状态元数据（容错：未知状态返回灰色兜底）
  getStatusMeta(status) {
    return this.statusFlow.find(s => s.code === status)
      || { code: status, name: status || '未知', badge: 'badge-gray', desc: '—', next: null, nextLabel: '' };
  },

  // 该状态下允许出现的操作（用于列表行按钮的显隐控制）
  getAllowedActions(b) {
    const acts = [];
    if (b.status === 'CRTD') acts.push('sampling');
    if (b.status === 'SAMP') acts.push('sampling', 'result');
    if (b.status === 'INSP') acts.push('result');
    if (b.status === 'DONE') acts.push('decision');
    return acts;
  },

  // ==================== 渲染页面 ====================

  render() {
    this.page = 1;
    return `
      <div class="ib-page" style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <!-- 顶部标题栏 -->
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div>
            <div style="font-size:18px;font-weight:700;">检验批管理</div>
            <div style="font-size:13px;opacity:0.8;">质量管理 → 质量检验 → 检验批管理</div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
              onclick="InspectionBatch.syncNow()" title="手动触发一次 SAP 检验批抓取">立即同步</button>
            <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
              onclick="InspectionBatch.openManualCreate()" title="创建 89 型手工检验批（调用 SAP 接口取号）">+ 手工创建</button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs" style="margin:0;padding:0 24px;background:white;border-bottom:1px solid var(--border);flex-shrink:0;">
          <div class="tab ${this.activeTab==='list'?'active':''}" id="ibTabList" onclick="InspectionBatch.switchTab('list')">📋 检验批列表</div>
          <div class="tab ${this.activeTab==='sync'?'active':''}" id="ibTabSync" onclick="InspectionBatch.switchTab('sync')">🔄 同步任务</div>
        </div>

        <!-- 筛选栏 -->
        <div id="ibFilterBar" style="flex-shrink:0;"></div>

        <!-- 表格区域 -->
        <div class="table-wrapper" style="flex:1;overflow:auto;" id="ibTableWrapper"></div>

        <!-- 底部分页 -->
        <div id="ibPagination" style="flex-shrink:0;"></div>
      </div>`;
  },

  init() {
    // 补全检验类型 → 生成方式 / 来源单据 / 同步信息的派生字段
    this._normalize();

    // 查询变式：进入页面自动回填（默认变式 > 上次查询条件），不自动执行查询
    if (window.QueryVariant) {
      QueryVariant.mount('inspection-batch');
      QueryVariant.restore('inspection-batch');
      QueryVariant.bindRecent('inspection-batch');
    }

    this.renderFilterBar();
    this.renderTable();
    // 同步任务页签的分页由 doRenderSyncTable 自行渲染
    if (this.activeTab === 'list') this.renderPagination();
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.page = 1;
    const listEl = document.getElementById('ibTabList');
    const syncEl = document.getElementById('ibTabSync');
    if (listEl) listEl.className = 'tab' + (tab==='list'?' active':'');
    if (syncEl) syncEl.className = 'tab' + (tab==='sync'?' active':'');
    this.init();
  },

  refresh() {
    this.init();
    toast('数据已刷新');
  },

  // ==================== 生成模式与同步 ====================

  // 数据归一化：根据检验类型补全生成模式、来源单据类型、同步信息
  _normalize() {
    this.batchData.forEach(b => {
      const t = this.inspectTypeOptions.find(x => x.code === b.inspectType);
      b.inspectTypeName = t ? t.name : '未定义';
      b.createMode = b.createMode || (t ? t.createMode : 'SAP_AUTO');
      b.sourceDocType = b.sourceDocType || (t ? t.sourceDocType : 'NONE');
      if (b.sourceDocNo === undefined) b.sourceDocNo = '';
      if (b.sapLotNo === undefined) b.sapLotNo = b.batchNo;
      if (!b.syncStatus) b.syncStatus = 'SYNCED';
      if (!b.syncTime) b.syncTime = b.createTime;
      if (!b.syncJobId) b.syncJobId = '—';
    });
  },

  // 同步失败的检验批条数（需要人工重试）
  _failedSyncCount() {
    return this.batchData.filter(b => b.syncStatus === 'FAILED').length;
  },

  // 单个重试
  retrySync(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b) return;
    b.syncStatus = 'PENDING';
    this.init();
    toast(`检验批 ${b.batchNo} 正在重新同步...`);
    setTimeout(() => {
      b.syncStatus = 'SYNCED';
      b.syncTime = this._now() + ':00';
      b.syncJobId = 'JOB-MANUAL-' + Date.now().toString().slice(-6);
      this.init();
      toast(`检验批 ${b.batchNo} 同步成功`);
    }, 800);
  },

  // 批量重试全部失败项
  retryAllFailed() {
    const failed = this.batchData.filter(b => b.syncStatus === 'FAILED');
    if (!failed.length) { toast('当前没有同步失败的记录'); return; }
    failed.forEach(b => { b.syncStatus = 'PENDING'; });
    this.init();
    toast(`正在重试 ${failed.length} 条同步失败记录...`);
    setTimeout(() => {
      failed.forEach(b => {
        b.syncStatus = 'SYNCED';
        b.syncTime = this._now() + ':00';
        b.syncJobId = 'JOB-BATCH-' + Date.now().toString().slice(-6);
      });
      this.init();
      toast(`${failed.length} 条记录同步成功`);
    }, 1000);
  },

  // 立即同步（手动触发抓取 JOB）
  syncNow() {
    toast('已触发 SAP 检验批抓取任务，正在后台执行...');
    setTimeout(() => {
      const n = 3 + Math.floor(Math.random() * 5);
      const jobId = 'JOB-MANUAL-' + Date.now().toString().slice(-6);
      this.syncLogData.unshift({
        id: 'J' + (this.syncLogData.length + 1),
        jobId,
        jobName: 'SAP 检验批定时抓取（手动）',
        execTime: this._now(),
        range: '增量：最近 5 分钟',
        total: n, success: n, failed: 0,
        status: 'SUCCESS', duration: (1 + Math.random() * 3).toFixed(1) + 's'
      });
      this.init();
      toast(`同步完成，新增 ${n} 条检验批`);
    }, 1200);
  },

  // ==================== 手工创建检验批（89 型）====================

  openManualCreate() {
    const planOptions = this.getPlanOptions('');
    const planSelectOpts = planOptions.map(p => `<option value="${p.no}">${p.no} — ${p.name}</option>`).join('');

    showModal(
      '手工创建检验批（类型 89）',
      `<div style="padding:4px 0;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#1e293b;">
          <div style="font-weight:600;margin-bottom:4px;">📌 创建说明</div>
          <div style="color:var(--text-secondary);line-height:1.6;">
            类型 89 的检验批由 MES 发起创建。提交后将<strong>调用 SAP 接口生成检验批号</strong>，
            SAP 返回批号后 MES 落库；检验结果保存时<strong>实时回传 SAP</strong>。
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>工厂<span class="req">*</span></label>
            <select id="ibMcFactory">
              <option value="">请选择</option>
              ${this.factoryOptions.map(f => `<option value="${f.code}">${f.code} — ${f.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>物料编码<span class="req">*</span></label>
            <input type="text" id="ibMcMaterial" placeholder="如 MAT-10001">
          </div>
          <div class="form-group">
            <label>SAP 批次号<span class="req">*</span></label>
            <input type="text" id="ibMcSapBatch" placeholder="如 SAP-BT-20261001">
          </div>
          <div class="form-group">
            <label>供应商批次号</label>
            <input type="text" id="ibMcSuppBatch" placeholder="可选">
          </div>
          <div class="form-group">
            <label>检验数量<span class="req">*</span></label>
            <input type="number" id="ibMcQty" step="0.001" min="0" placeholder="如 500.000">
          </div>
          <div class="form-group">
            <label>单位<span class="req">*</span></label>
            <select id="ibMcUnit">
              <option value="KG">KG</option>
              <option value="G">G</option>
              <option value="L">L</option>
              <option value="EA">EA</option>
            </select>
          </div>
          <div class="form-group">
            <label>用途代码<span class="req">*</span></label>
            <select id="ibMcPurpose">
              ${this.purposeOptions.map(p => `<option value="${p.code}">${p.code} - ${p.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>检验计划<span class="req">*</span></label>
            <select id="ibMcPlan" onchange="InspectionBatch.onPlanChange()">
              <option value="">请选择</option>
              ${planSelectOpts}
            </select>
          </div>
        </div>
        <div id="ibMcPlanPreview" style="margin-top:16px;"></div>
        <div class="form-group full" style="margin-top:12px;">
          <label>备注</label>
          <textarea id="ibMcRemark" placeholder="可选填写备注信息" rows="2" style="width:100%;"></textarea>
        </div>
      </div>`,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal },
        { text:'提交并取号', cls:'btn-primary', action: ()=>{ InspectionBatch.submitManualCreate(); } }
      ],
      'modal-xl'
    );

    this._genPlanOptions = planOptions;
  },

  submitManualCreate() {
    const plant = document.getElementById('ibMcFactory')?.value || '';
    const material = (document.getElementById('ibMcMaterial')?.value || '').trim();
    const sapBatch = (document.getElementById('ibMcSapBatch')?.value || '').trim();
    const suppBatch = (document.getElementById('ibMcSuppBatch')?.value || '').trim();
    const qty = document.getElementById('ibMcQty')?.value || '';
    const unit = document.getElementById('ibMcUnit')?.value || '';
    const purpose = document.getElementById('ibMcPurpose')?.value || '';
    const planNo = document.getElementById('ibMcPlan')?.value || '';
    const remark = (document.getElementById('ibMcRemark')?.value || '').trim();

    if (!plant) { toast('请选择工厂'); return; }
    if (!material) { toast('请填写物料编码'); return; }
    if (!sapBatch) { toast('请填写 SAP 批次号'); return; }
    if (!qty || parseFloat(qty) <= 0) { toast('请填写有效的检验数量'); return; }
    if (!planNo) { toast('请选择检验计划'); return; }

    const purposeObj = this.purposeOptions.find(p => p.code === purpose);
    const now = this._now() + ':00';

    // 模拟调用 SAP 取号接口
    const sapLotNo = String(100000012300 + Math.floor(Math.random() * 900));

    const newBatch = {
      id: 'B' + String(this.batchData.length + 1).padStart(3, '0'),
      batchNo: sapLotNo,
      sapLotNo: sapLotNo,
      inspectType: '89',
      inspectTypeName: '手工检验批',
      createMode: 'MES_MANUAL',
      sourceDocType: 'NONE',
      sourceDocNo: '',
      materialCode: material,
      materialName: material,
      sapBatch,
      supplierBatch: suppBatch,
      quantity: qty,
      unit,
      plant,
      plantName: (this.factoryOptions.find(f => f.code === plant) || {}).name || '',
      planNo,
      purposeCode: purpose,
      purposeName: purposeObj ? purposeObj.name : '',
      status: 'CRTD',
      statusName: '已创建',
      createTime: now,
      createBy: '当前用户',
      updateTime: now,
      syncStatus: 'SYNCED',
      syncTime: now,
      syncJobId: '—',
      remark
    };

    this.batchData.unshift(newBatch);
    closeModal();
    toast(`检验批 ${sapLotNo} 已创建（SAP 返回批号）`);
    this.init();
  },

  // 查看生成来源信息
  renderSourceInfo(b) {
    const modeBadge = b.createMode === 'MES_MANUAL'
      ? `<span class="badge badge-purple badge-sm">MES 手工创建</span>`
      : `<span class="badge badge-blue badge-sm">SAP 自动生成</span>`;
    return `<div style="background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:12px 16px;margin-bottom:14px;">
      <div style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">生成来源</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px 20px;font-size:13px;">
        <div><span style="color:var(--text-muted);">检验类型：</span><strong>${esc(this.getInspectTypeName(b.inspectType)||'')}</strong></div>
        <div><span style="color:var(--text-muted);">生成方式：</span>${modeBadge}</div>
        <div><span style="color:var(--text-muted);">来源单据：</span>${esc(b.sourceDocNo||'—')}${b.sourceDocType&&b.sourceDocType!=='NONE'?` <span style="font-size:12px;color:var(--text-muted);">(${esc(b.sourceDocType)})</span>`:''}</div>
        <div><span style="color:var(--text-muted);">绑定对象：</span>${esc((this.inspectTypeOptions.find(x=>x.code===b.inspectType)||{}).bindObject||'—')}</div>
        <div><span style="color:var(--text-muted);">同步时间：</span>${esc(b.syncTime||'—')}</div>
        <div><span style="color:var(--text-muted);">同步任务：</span><span style="font-family:monospace;font-size:12px;">${esc(b.syncJobId||'—')}</span></div>
      </div>
    </div>`;
  },

  // ==================== 筛选栏 ====================

  renderFilterBar() {
    const el = document.getElementById('ibFilterBar');
    if (!el) return;

    if (this.activeTab === 'list') {
      el.innerHTML = `<div class="filter-bar" style="display:flex;flex-wrap:wrap;gap:12px 16px;align-items:flex-end;">
        <div class="filter-group"><label>工厂</label><select id="ibFactory">
          <option value="">全部</option>
          ${this.factoryOptions.map(f => `<option value="${f.code}">${f.name}</option>`).join('')}
        </select></div>
        <div class="filter-group"><label>物料编码</label><input type="text" id="ibMaterial" placeholder="模糊查询"></div>
        <div class="filter-group"><label>检验类型</label><select id="ibInspectType">
          <option value="">全部</option>
          ${this.inspectTypeOptions.map(t => `<option value="${t.code}">${t.code} - ${t.name}</option>`).join('')}
        </select></div>
        <div class="filter-group"><label>生成方式</label><select id="ibCreateMode">
          <option value="">全部</option>
          ${this.createModeOptions.map(c => `<option value="${c.code}">${c.name}</option>`).join('')}
        </select></div>
        <div class="filter-actions" style="margin-left:auto;display:flex;gap:8px;flex-shrink:0;">
          <button class="btn btn-primary btn-sm" onclick="InspectionBatch.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="InspectionBatch.exportData()">导出</button>
          <button class="btn btn-secondary btn-sm" onclick="InspectionBatch.refresh()">刷新</button>
          <button class="btn btn-secondary btn-sm" onclick="InspectionBatch.toggleMore()" id="ibMoreToggle">更多条件 ▾</button>
          <button class="btn btn-secondary btn-sm" onclick="InspectionBatch.resetFilter()">重置</button>
        </div>
        <!-- 更多条件：与上方条件同容器、同底色、无分隔线，独占一整行 -->
        <div id="ibMorePanel" style="display:none;width:100%;flex-wrap:wrap;gap:12px 16px;align-items:flex-end;">
          <div class="filter-group"><label>供应商批次号</label><input type="text" id="ibSuppBatch" placeholder="模糊查询"></div>
          <div class="filter-group"><label>SAP批次号</label><input type="text" id="ibSapBatch" placeholder="模糊查询"></div>
          <div class="filter-group"><label>同步状态</label><select id="ibSyncStatus">
            <option value="">全部</option>
            ${this.syncStatusOptions.map(s => `<option value="${s.code}">${s.name}</option>`).join('')}
          </select></div>
          <div class="filter-group"><label>状态</label><select id="ibStatus">
            <option value="">全部</option>
            <option value="CRTD">已创建</option>
            <option value="SAMP">取样中</option>
            <option value="INSP">检验中</option>
            <option value="DONE">检验完成</option>
            <option value="DEC">已决策</option>
            <option value="CLSD">已关闭</option>
            <option value="CANC">已取消</option>
          </select></div>
        </div>
      </div>`;
    } else {
      el.innerHTML = `<div class="filter-bar" style="display:flex;flex-wrap:wrap;gap:12px 16px;align-items:flex-end;">
        <div class="filter-group"><label>任务名称</label><select id="ibSyncJob">
          <option value="">全部</option>
          <option value="SAP 检验批定时抓取">SAP 检验批定时抓取</option>
          <option value="SAP 检验批状态同步">SAP 检验批状态同步</option>
          <option value="复检到期批量生成">复检到期批量生成</option>
        </select></div>
        <div class="filter-group"><label>执行结果</label><select id="ibSyncResult">
          <option value="">全部</option>
          <option value="SUCCESS">成功</option>
          <option value="PARTIAL">部分成功</option>
          <option value="FAILED">失败</option>
        </select></div>
        <div class="filter-group"><label>执行日期</label><input type="date" id="ibSyncDate"></div>
        <div class="filter-actions" style="margin-left:auto;display:flex;gap:8px;flex-shrink:0;">
          <button class="btn btn-primary btn-sm" onclick="InspectionBatch.searchSyncLog()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="InspectionBatch.exportData()">导出</button>
          <button class="btn btn-secondary btn-sm" onclick="InspectionBatch.refresh()">刷新</button>
          <button class="btn btn-secondary btn-sm" onclick="InspectionBatch.retryAllFailed()">批量重试</button>
          <button class="btn btn-secondary btn-sm" onclick="InspectionBatch.resetSyncFilter()">重置</button>
        </div>
      </div>`;
    }
  },

  toggleMore() {
    const p = document.getElementById('ibMorePanel');
    const b = document.getElementById('ibMoreToggle');
    if (!p) return;
    const show = p.style.display === 'none';
    if (show) {
      p.style.display = 'flex';
      if (b) b.textContent = '更多条件 ▴';
    } else {
      p.style.display = 'none';
      if (b) b.textContent = '更多条件 ▾';
    }
  },

  searchSyncLog() {
    const job = document.getElementById('ibSyncJob')?.value || '';
    const result = document.getElementById('ibSyncResult')?.value || '';
    const date = document.getElementById('ibSyncDate')?.value || '';

    this.syncFiltered = this.syncLogData.filter(l => {
      if (job && l.jobName !== job) return false;
      if (result && l.status !== result) return false;
      if (date && !(l.execTime || '').startsWith(date)) return false;
      return true;
    });
    this.syncPage = 1;
    this.doRenderSyncTable();
  },

  resetSyncFilter() {
    ['ibSyncJob', 'ibSyncResult', 'ibSyncDate'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    this.syncFiltered = [...this.syncLogData];
    this.syncPage = 1;
    this.doRenderSyncTable();
  },

  syncFiltered: [],
  syncPage: 1,

  doRenderSyncTable() {
    this.syncFiltered = this.syncFiltered && this.syncFiltered.length ? this.syncFiltered : [...this.syncLogData];
    const start = (this.syncPage - 1) * this.pageSize;
    const page = this.syncFiltered.slice(start, start + this.pageSize);
    const el = document.getElementById('ibTableWrapper');
    if (!el) return;

    const statusMap = {
      SUCCESS: { cls: 'badge-green',   label: '成功'     },
      PARTIAL: { cls: 'badge-yellow', label: '部分成功' },
      FAILED:  { cls: 'badge-red',    label: '失败'     }
    };



    el.innerHTML = `<table class="data-table" style="min-width:1200px;">
      <thead><tr>
        <th style="width:50px;">序号</th>
        <th style="width:180px;">任务编号</th>
        <th style="width:220px;">任务名称</th>
        <th style="width:300px;">抓取区间</th>
        <th style="width:80px;">总数</th>
        <th style="width:80px;">成功</th>
        <th style="width:80px;">失败</th>
        <th style="width:100px;">结果</th>
        <th style="width:90px;">耗时</th>
        <th style="width:150px;">执行时间</th>
        <th style="width:130px;">操作</th>
      </tr></thead>
      <tbody>${page.map((l, i) => {
        const s = statusMap[l.status] || { cls: 'badge-gray', label: l.status };
        return `<tr>
          <td>${start + i + 1}</td>
          <td style="font-family:monospace;font-size:12px;">${esc(l.jobId)}</td>
          <td>${esc(l.jobName)}</td>
          <td style="font-size:12px;color:var(--text-secondary);">${esc(l.range)}</td>
          <td>${l.total}</td>
          <td style="color:#15803d;font-weight:600;">${l.success}</td>
          <td style="color:${l.failed > 0 ? '#dc2626' : 'inherit'};font-weight:${l.failed > 0 ? 600 : 400};">${l.failed}</td>
          <td><span class="badge ${s.cls} badge-sm">${s.label}</span></td>
          <td style="font-size:12px;">${esc(l.duration)}</td>
          <td style="font-size:12px;">${esc(l.execTime)}</td>
          <td><button class="btn btn-blue btn-sm" onclick="InspectionBatch.openSyncDetail('${l.id}')">查看</button></td>
        </tr>`;
      }).join('')}
    </table>`;

    this.renderSyncPagination();
  },

  renderSyncPagination() {
    const total = this.syncFiltered.length;
    const totalPages = Math.ceil(total / this.pageSize) || 1;
    const el = document.getElementById('ibPagination');
    if (!el) return;
    el.innerHTML = `<div class="list-toolbar">
      <div class="list-info"><span class="list-count">共 ${total} 条同步记录</span></div>
      <div class="pagination">
        <button class="pagination-btn" ${this.syncPage <= 1 ? 'disabled' : ''} onclick="InspectionBatch.prevSyncPage()">‹</button>
        <span class="pagination-info">第 ${this.syncPage} / ${totalPages} 页</span>
        <button class="pagination-btn" ${this.syncPage >= totalPages ? 'disabled' : ''} onclick="InspectionBatch.nextSyncPage()">›</button>
        <select class="page-size-select" onchange="InspectionBatch.changeSyncPageSize()">
          <option value="10" ${this.pageSize === 10 ? 'selected' : ''}>10条</option>
          <option value="20" ${this.pageSize === 20 ? 'selected' : ''}>20条</option>
          <option value="50" ${this.pageSize === 50 ? 'selected' : ''}>50条</option>
        </select>
      </div>
    </div>`;
  },

  openSyncDetail(logId) {
    const l = this.syncLogData.find(x => x.id === logId);
    if (!l) return toast('同步记录未找到');
    showModal(
      `同步任务明细 — ${l.jobId}`,
      `<div style="padding:4px 0;font-size:13px;">
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px 24px;padding:14px 16px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;margin-bottom:16px;">
          <div><span style="color:var(--text-muted);">任务编号：</span><strong style="font-family:monospace;">${esc(l.jobId)}</strong></div>
          <div><span style="color:var(--text-muted);">任务名称：</span><strong>${esc(l.jobName)}</strong></div>
          <div><span style="color:var(--text-muted);">抓取区间：</span><strong>${esc(l.range)}</strong></div>
          <div><span style="color:var(--text-muted);">执行时间：</span><strong>${esc(l.execTime)}</strong></div>
          <div><span style="color:var(--text-muted);">处理总数：</span><strong>${l.total}</strong></div>
          <div><span style="color:var(--text-muted);">成功 / 失败：</span><strong>${l.success} / ${l.failed}</strong></div>
          <div><span style="color:var(--text-muted);">耗时：</span><strong>${esc(l.duration)}</strong></div>
          <div><span style="color:var(--text-muted);">失败原因：</span><strong>${esc(l.failReason || '—')}</strong></div>
        </div>
        <div style="font-size:12px;color:var(--text-muted);line-height:1.7;">
          · 自动抓取型（01/02/03/04/05/06/08）由 SAP 生成检验批，MES 通过定时任务增量拉取后落库<br/>
          · 抓取失败的记录会标记为「同步失败」，可在列表行内点击「重试同步」重新拉取<br/>
          · 所有同步记录保留任务编号与执行时间，作为审计追踪依据
        </div>
      </div>`,
      [{ text:'关闭', cls:'btn-secondary', action: closeModal }],
      'modal-lg'
    );
  },

  search() {
    const factory = document.getElementById('ibFactory')?.value||'';
    const material = (document.getElementById('ibMaterial')?.value||'').trim();
    const suppBatch = (document.getElementById('ibSuppBatch')?.value||'').trim();
    const sapBatch = (document.getElementById('ibSapBatch')?.value||'').trim();
    const status = document.getElementById('ibStatus')?.value||'';
    const inspectType = document.getElementById('ibInspectType')?.value||'';
    const createMode = document.getElementById('ibCreateMode')?.value||'';
    const syncStatus = document.getElementById('ibSyncStatus')?.value||'';

    this.filtered = this.batchData.filter(b => {
      if (factory && b.plant !== factory) return false;
      if (material && !b.materialCode.includes(material) && !b.materialName.includes(material)) return false;
      if (suppBatch && !(b.supplierBatch||'').toLowerCase().includes(suppBatch.toLowerCase())) return false;
      if (sapBatch && !(b.sapBatch||'').toLowerCase().includes(sapBatch.toLowerCase())) return false;
      if (status && b.status !== status) return false;
      if (inspectType && b.inspectType !== inspectType) return false;
      if (createMode && b.createMode !== createMode) return false;
      if (syncStatus && b.syncStatus !== syncStatus) return false;
      return true;
    });
    this.page = 1;
    this.renderBatchTable();
    this.renderPagination();

    // 查询变式：保存"上次查询条件"并记录手工字段的最近输入
    if (window.QueryVariant) {
      QueryVariant.saveAuto('inspection-batch');
      QueryVariant.recordUsed('inspection-batch');
    }
  },

  resetFilter() {
    ['ibMaterial','ibSuppBatch','ibSapBatch'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    ['ibStatus','ibFactory','ibInspectType','ibCreateMode','ibSyncStatus'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    this.filtered = [...this.batchData];
    this.page = 1;
    this.renderBatchTable();
    this.renderPagination();

    // 查询变式：重置时解除变式选中并清除"上次查询条件"
    if (window.QueryVariant) QueryVariant.resetSelection('inspection-batch');
  },

  exportData() { toast('导出功能开发中...'); },

  // ==================== 检验批表格 ====================

  renderTable() {
    if (this.activeTab === 'list') {
      this.filtered = [...this.batchData];
      this.renderBatchTable();
    } else {
      this.doRenderSyncTable();
    }
  },

  // 生成方式徽章
  getCreateModeBadge(mode) {
    return mode === 'MES_MANUAL'
      ? '<span class="badge badge-purple badge-sm">MES 手工</span>'
      : '<span class="badge badge-blue badge-sm">SAP 自动</span>';
  },

  // 同步状态徽章
  getSyncStatusBadge(status) {
    const map = {
      SYNCED: { cls:'badge-green',  label:'已同步'   },
      PENDING:{ cls:'badge-blue',   label:'同步中'   },
      FAILED: { cls:'badge-red',    label:'同步失败' }
    };
    const m = map[status] || { cls:'badge-gray', label:status || '—' };
    return `<span class="badge ${m.cls} badge-sm">${m.label}</span>`;
  },

  renderBatchTable() {
    const start = (this.page-1)*this.pageSize;
    const page = this.filtered.slice(start, start+this.pageSize);
    const el = document.getElementById('ibTableWrapper');
    if (!el) return;

    el.innerHTML = `<table class="data-table" style="min-width:2100px;">
      <thead><tr>
        <th style="width:50px;">序号</th>
        <th style="width:160px;">检验批号</th>
        <th style="width:150px;">检验类型</th>
        <th style="width:110px;">生成方式</th>
        <th style="width:130px;">来源单据</th>
        <th style="width:150px;">供应商批次号</th>
        <th style="width:120px;">物料编码</th>
        <th style="width:140px;">物料名称</th>
        <th style="width:110px;">检验计划</th>
        <th style="width:90px;">数量</th>
        <th style="width:90px;">状态</th>
        <th style="width:110px;">同步状态</th>
        <th style="width:140px;">工厂</th>
        <th style="width:90px;">创建人</th>
        <th style="width:140px;">创建时间</th>
        <th style="width:140px;">更新时间</th>
        <th style="width:290px;">操作</th>
      </tr></thead>
      <tbody>${page.map((b,i) => this.renderBatchRow(b, start+i+1)).join('')}</tbody>
    </table>`;
  },

  renderBatchRow(b, idx) {
    const statusBadge = this.getStatusBadgeHtml(b.status);
    const modeBadge = this.getCreateModeBadge(b.createMode);
    const syncBadge = this.getSyncStatusBadge(b.syncStatus);
    return `<tr>
      <td>${idx}</td>
      <td style="color:#2563eb;font-weight:600;font-family:monospace;font-size:12px;">${esc(b.batchNo)}</td>
      <td><span class="badge badge-gray badge-sm" style="font-family:monospace;">${esc(this.getInspectTypeName(b.inspectType)||'')}</span></td>
      <td>${modeBadge}</td>
      <td style="font-family:monospace;font-size:12px;color:var(--text-secondary);">${esc(b.sourceDocNo||'—')}</td>
      <td style="font-weight:700;font-size:13px;">${esc(b.supplierBatch||'—')}</td>
      <td style="font-family:monospace;font-size:12px;">${esc(b.materialCode)}</td>
      <td>${esc(b.materialName)}</td>
      <td style="font-family:monospace;font-size:11px;">${esc(b.planNo)}</td>
      <td>${b.quantity} ${esc(b.unit)}</td>
      <td>${statusBadge}</td>
      <td>${syncBadge}</td>
      <td>${esc(b.plantName)}</td>
      <td>${esc(b.createBy)}</td>
      <td style="font-size:12px;">${b.createTime||'—'}</td>
      <td style="font-size:12px;">${b.updateTime||'—'}</td>
      <td><div class="table-actions">${this.getBatchActions(b)}</div></td>
    </tr>`;
  },

  // 状态徽章：统一从状态机 statusFlow 取色与名称，保证列表与详情一致
  getStatusBadgeHtml(status) {
    const m = this.getStatusMeta(status);
    return `<span class="badge ${m.badge}">${esc(m.name)}</span>`;
  },

  getBatchActions(b) {
    // 解析计划以获取取样工序编号
    const plan = this._resolvePlan(b);
    const ops = (plan && plan.operations) ? plan.operations : [
      { opNum:'0010', opType:'sampling' },
      { opNum:'0020', opType:'inspection' }
    ];
    const samplingOp = ops.find(o => o.opType === 'sampling');
    const samplingOpNum = samplingOp ? samplingOp.opNum : '0010';

    const retryBtn = b.syncStatus === 'FAILED'
      ? `<button class="btn btn-danger btn-sm" onclick="InspectionBatch.retrySync('${b.id}')" title="重新从 SAP 拉取该检验批">重试同步</button>`
      : '';

    // 终态（已关闭 / 已取消）：数据只读，不再出现取样、结果录入、使用决策等动作按钮
    if (this._isFinalStatus(b.status)) {
      return `<div class="table-actions">
        <button class="btn btn-blue btn-sm" onclick="InspectionBatch.openDetail('${b.id}')" title="检验批详情">查看</button>
        ${retryBtn}
      </div>`;
    }

    return `<div class="table-actions">
      <button class="btn btn-sm" style="background:#f59e0b;color:#fff;" onclick="InspectionBatch.openSamplingForm('${b.id}','${samplingOpNum}')" title="执行取样">取样</button>
      <button class="btn btn-sm" style="background:#6366f1;color:#fff;" onclick="InspectionBatch.selectOpForResult('${b.id}')" title="选择工序录入检验结果">结果录入</button>
      <button class="btn btn-success btn-sm" onclick="InspectionBatch.openDecision('${b.id}')" title="使用决策">使用决策</button>
      <button class="btn btn-blue btn-sm" onclick="InspectionBatch.openDetail('${b.id}')" title="检验批详情">查看</button>
      ${retryBtn}
    </div>`;
  },

  prevSyncPage() { if (this.syncPage>1) { this.syncPage--; this.doRenderSyncTable(); } },
  nextSyncPage() { if (this.syncPage<Math.ceil(this.syncFiltered.length/this.pageSize)) { this.syncPage++; this.doRenderSyncTable(); } },
  changeSyncPageSize() {
    const sel = document.querySelector('#ibPagination .page-size-select');
    if (sel) { this.pageSize = parseInt(sel.value); this.syncPage = 1; this.doRenderSyncTable(); }
  },

  // ==================== 分页 ====================

  renderPagination() {
    const total = this.filtered.length;
    const totalPages = Math.ceil(total/this.pageSize)||1;
    const el = document.getElementById('ibPagination');
    if (!el) return;

    el.innerHTML = `<div class="list-toolbar">
      <div class="list-info"><span class="list-count">共 ${total} 条</span></div>
      <div class="pagination">
        <button class="pagination-btn" ${this.page<=1?'disabled':''} onclick="InspectionBatch.prevPage()">‹</button>
        <span class="pagination-info">第 ${this.page} / ${totalPages} 页</span>
        <button class="pagination-btn" ${this.page>=totalPages?'disabled':''} onclick="InspectionBatch.nextPage()">›</button>
        <select class="page-size-select" onchange="InspectionBatch.changePageSize()">
          <option value="10" ${this.pageSize===10?'selected':''}>10条</option>
          <option value="20" ${this.pageSize===20?'selected':''}>20条</option>
          <option value="50" ${this.pageSize===50?'selected':''}>50条</option>
        </select>
      </div>
    </div>`;
  },

  prevPage() { if (this.page>1) { this.page--; this.renderBatchTable(); this.renderPagination(); } },
  nextPage() { if (this.page<Math.ceil(this.filtered.length/this.pageSize)) { this.page++; this.renderBatchTable(); this.renderPagination(); } },
  changePageSize() {
    const sel = document.querySelector('#ibPagination .page-size-select');
    if (sel) { this.pageSize = parseInt(sel.value); this.page = 1; this.renderBatchTable(); this.renderPagination(); }
  },

  // 检验计划选择变更 → 展示计划详情
  onPlanChange() {
    const selVal = document.getElementById('ibMcPlan')?.value;
    const previewEl = document.getElementById('ibMcPlanPreview');
    if (!previewEl) return;

    if (!selVal) {
      previewEl.innerHTML = '';
      return;
    }

    const plan = (typeof ipData !== 'undefined' ? ipData : []).find(p => p.code === selVal);
    if (!plan) {
      previewEl.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:12px;background:#f8fafc;border-radius:8px;">未找到该计划的详细数据</div>';
      return;
    }

    previewEl.innerHTML = this.renderPlanPreview(plan);
  },

  // 渲染检验计划详情预览 — 折叠式卡片布局
  renderPlanPreview(plan) {
    // 工序卡片（折叠式）
    const opCards = plan.operations.map((op, i) => {
      const isSampling = op.opType === 'sampling';
      const uid = 'opp' + i + '_' + Date.now();
      const hasChars = !isSampling && op.chars && op.chars.length > 0;

      // MIC 详情（默认折叠）
      let charsPanel = '';
      if (hasChars) {
        const maxCols = Math.min(op.chars.length, 2);
        charsPanel = `<div id="${uid}" style="display:none;margin-top:10px;padding-top:10px;border-top:1px dashed #d1d5db;">
          <div style="display:grid;grid-template-columns:repeat(${maxCols},1fr);gap:8px 16px;">
            ${op.chars.map(c => {
              const specRange = c.micType === 'quantitative'
                ? `${c.lowerSpec||'—'} ~ ${c.upperSpec||'—'} ${c.unit||''}`
                : (c.defaultCode||'—');
              const isQuant = c.micType === 'quantitative';
              return `<div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;font-size:13px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                  <span style="font-family:monospace;font-size:11px;color:#2563eb;font-weight:600;">${esc(c.micCode)}</span>
                  <span class="badge ${isQuant?'badge-blue':'badge-purple'} badge-sm" style="font-size:10px;">${isQuant?'定量':'定性'}</span>
                </div>
                <div style="font-weight:500;color:var(--text);margin-bottom:4px;">${esc(c.micName)}</div>
                <div style="display:flex;flex-wrap:wrap;gap:4px 12px;font-size:12px;color:var(--text-secondary);">
                  <span>方法：${esc(c.methodName)||'—'}</span>
                  <span style="font-weight:500;color:var(--text);">规格：${specRange}</span>
                  ${c.samplingPlanName ? `<span>取样：${esc(c.samplingPlanName)}</span>` : ''}
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }

      const typeCls = isSampling ? 'badge-blue' : 'badge-green';
      const typeLabel = isSampling ? '取样' : '检验';
      const icon = isSampling ? '🔬' : '🧪';
      const stepNum = i + 1;

      return `<div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;background:#fff;${i > 0 ? 'margin-top:8px;' : ''}">
        <div style="display:flex;align-items:center;gap:10px;min-height:32px;">
          <div style="background:${isSampling?'#dbeafe':'#dcfce7'};color:${isSampling?'#1d4ed8':'#15803d'};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">${stepNum}</div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span style="font-size:14px;font-weight:600;color:var(--text);">${esc(op.opNum)}</span>
              <span class="badge ${typeCls} badge-sm">${typeLabel}</span>
              <span style="color:var(--text-muted);font-size:13px;">· ${esc(op.workCenterName)}</span>
              ${op.description ? `<span style="color:var(--text-secondary);font-size:13px;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">— ${esc(op.description)}</span>` : ''}
            </div>
            ${isSampling ? `<div style="font-size:12px;color:var(--text-muted);margin-top:3px;">取样方案：${esc(op.samplingPlanName) || '—'}</div>` : ''}
          </div>
          ${hasChars ? `<button onclick="InspectionBatch._toggleOpChars('${uid}',this)" style="background:none;border:1px solid #d1d5db;border-radius:6px;padding:4px 10px;font-size:12px;color:var(--text-secondary);cursor:pointer;white-space:nowrap;flex-shrink:0;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='none'">
            <span class="_expandLabel">展开</span> ${op.chars.length} 项特性 ▾
          </button>` : ''}
        </div>
        ${charsPanel}
      </div>`;
    }).join('');

    // 工序间箭头连接
    const flowHtml = `<div style="display:flex;align-items:center;gap:0;font-size:12px;color:#9ca3af;padding:0 14px;margin-bottom:4px;">
      ${plan.operations.map((_,i) => {
        if (i === 0) return `<span style="flex-shrink:0;width:48px;text-align:center;">开始</span>`;
        return `<span style="flex-shrink:0;width:48px;text-align:center;">↓</span>`;
      }).join('')}
    </div>`;

    return `<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px 18px;">
      <!-- 计划基本信息（紧凑） -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap;">
        <span style="font-size:15px;font-weight:700;color:var(--text);">📋 ${esc(plan.code)}</span>
        <span class="badge badge-green">已启用</span>
        <span style="color:#d1d5db;">|</span>
        <span style="font-size:13px;color:var(--text-secondary);"><strong>${esc(plan.materialCode)}</strong> ${esc(plan.materialName)}</span>
        <span style="font-size:13px;color:var(--text-muted);">· ${esc(plan.purposeName)}</span>
        <span style="font-size:13px;color:var(--text-muted);">· ${esc(plan.factoryName)}</span>
        <span style="font-size:13px;color:var(--text-muted);">· ${plan.operations.length} 道工序</span>
      </div>
      <!-- 工序卡片列表 -->
      ${opCards}
    </div>`;
  },

  // ==================== 检验批详情（弹窗模式） ====================

  // 根据 planNo 解析计划数据（含 fallback）
  _resolvePlan(b) {
    const plans = (typeof ipData !== 'undefined' ? ipData : []);
    let plan = plans.find(p => p.code === b.planNo);
    if (!plan) plan = plans.find(p => p.materialCode === b.materialCode);
    if (!plan) plan = plans[0]; // 最后的 fallback
    return plan || null;
  },

  openDetail(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b) return toast('检验批未找到');

    const plan = this._resolvePlan(b);
    const ops = (plan && plan.operations) ? plan.operations : [
      { opNum:'0010', opType:'sampling', opTypeName:'取样', workCenterName:'QC取样室', description:'按取样方案执行取样', samplingPlanName:'—', chars:[] },
      { opNum:'0020', opType:'inspection', opTypeName:'检验', workCenterName:'QC实验室', description:'外观、含量、pH值等', samplingPlanName:'', chars:[] }
    ];

    const statusBadge = this.getStatusBadgeHtml(b.status);
    const hasSamplingOp = ops.some(o => o.opType === 'sampling');




    const bodyHtml = `<div style="padding:4px 0;">
      <!-- 头部信息条 -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap;">
        <span style="font-size:18px;font-weight:700;color:var(--text);">${esc(b.batchNo)}</span>
        <div>${statusBadge}</div>
        <span style="color:#d1d5db;">|</span>
        <span style="font-size:13px;color:var(--text-secondary);">计划：<span style="font-family:monospace;">${esc(b.planNo)}</span></span>
        <span style="font-size:13px;color:var(--text-secondary);">${esc(b.purposeName)}</span>
        <span style="font-size:13px;color:var(--text-secondary);">${esc(b.plantName)}</span>
      </div>

      <!-- 状态追踪：当前状态 / 流转进度 / 下一步 -->
      ${this.renderStatusTrack(b)}

      <!-- 顶部标签页（方案A：基本信息 / 取样记录 / 结果录入 / 使用决策 / 操作流水） -->
      <div style="display:flex;gap:4px;border-bottom:2px solid var(--border);margin-bottom:16px;">
        <div class="form-tab active" data-ibtab="base" onclick="InspectionBatch._switchIbTab(this)">基本信息</div>
        <div class="form-tab" data-ibtab="sample" onclick="InspectionBatch._switchIbTab(this)">取样记录</div>
        <div class="form-tab" data-ibtab="result" onclick="InspectionBatch._switchIbTab(this)">结果录入</div>
        <div class="form-tab" data-ibtab="decision" onclick="InspectionBatch._switchIbTab(this)">使用决策</div>
        <div class="form-tab" data-ibtab="flow" onclick="InspectionBatch._switchIbTab(this)">操作流水</div>
      </div>

      <div class="ib-tab-panel active" data-ibpanel="base">${this._renderBaseTab(b, ops)}</div>
      <div class="ib-tab-panel" data-ibpanel="sample">${this._renderSamplingTab(b)}</div>
      <div class="ib-tab-panel" data-ibpanel="result">${this._renderResultTab(b)}</div>
      <div class="ib-tab-panel" data-ibpanel="decision">${this._renderDecisionTab(b)}</div>
      <div class="ib-tab-panel" data-ibpanel="flow">${this._renderFlowTab(b)}</div>
    </div>`;

    // 底部操作按钮：按当前状态决定该出现哪些
    // CRTD 已创建 → 暂存 + 提交检验；其余非终态 → 该状态对应的推进动作；CLSD/CANC 终态 → 仅关闭
    const footerBtns = [];
    const statusMeta = this.getStatusMeta(b.status);
    if (b.status === 'CRTD') {
      footerBtns.push({ text:'暂存', cls:'btn-secondary', action: () => { InspectionBatch.saveDraft(batchId); } });
    }
    if (statusMeta.next) {
      footerBtns.push({
        text: (b.status === 'CRTD' ? '提交检验' : statusMeta.nextLabel),
        cls: 'btn-primary',
        action: () => { InspectionBatch.advanceStatus(batchId); }
      });
    }
    footerBtns.push({ text:'关闭', cls:'btn-secondary', action: closeModal });

    showModal(`检验批详情 — ${b.batchNo}`, bodyHtml, footerBtns, 'modal-xl');
  },

  // ==================== 状态追踪与状态推进 ====================

  // 状态追踪：当前状态徽章 + 流转进度条 + 状态说明与下一步
  renderStatusTrack(b) {
    const meta = this.getStatusMeta(b.status);
    const cancelled = b.status === 'CANC';
    const steps = this.statusFlow.filter(s => s.code !== 'CANC');
    const curIdx = steps.findIndex(s => s.code === b.status);

    const nodes = steps.map((s, i) => {
      const done = !cancelled && i < curIdx;
      const cur  = !cancelled && i === curIdx;
      const dotBg = done ? '#f0fdf4' : cur ? '#eff6ff' : '#f8fafc';
      const dotBd = done ? '#16a34a' : cur ? 'var(--primary)' : '#e5e7eb';
      const dotFg = done ? '#15803d' : cur ? 'var(--primary)' : '#9ca3af';
      const lineL = i === 0 ? 'transparent' : ((!cancelled && i <= curIdx) ? '#16a34a' : '#e5e7eb');
      const lineR = i === steps.length - 1 ? 'transparent' : ((!cancelled && i < curIdx) ? '#16a34a' : '#e5e7eb');
      return `<div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;">
          <div style="flex:1;height:2px;background:${lineL};"></div>
          <div style="width:26px;height:26px;border-radius:50%;background:${dotBg};border:2px solid ${dotBd};color:${dotFg};font-size:12px;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${done ? '✓' : (i + 1)}</div>
          <div style="flex:1;height:2px;background:${lineR};"></div>
        </div>
        <div style="margin-top:6px;text-align:center;font-size:12px;color:${dotFg};font-weight:${cur ? 600 : 400};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(s.name)}</div>
      </div>`;
    }).join('');

    return `<div style="border:1px solid var(--border);border-radius:8px;padding:14px 16px;margin-bottom:16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:13px;color:var(--text-muted);">当前状态</span>
          <span class="badge ${meta.badge}" style="font-size:13px;padding:3px 10px;">${esc(b.statusName || meta.name)}</span>
          ${b.status === 'CRTD' ? '<span style="font-size:12px;color:var(--text-muted);">草稿，可暂存</span>' : ''}
        </div>
        <div style="font-size:12px;color:var(--text-muted);">最近更新：${esc(b.updateTime || '—')}</div>
      </div>
      ${cancelled ? '' : `<div style="display:flex;align-items:flex-start;">${nodes}</div>`}
      <div style="margin-top:14px;padding:8px 12px;background:#f8fafc;border-radius:6px;font-size:12px;color:var(--text-secondary);line-height:1.6;">
        ${esc(meta.desc)}
        ${meta.next
          ? `<span style="color:var(--text-muted);">　→　下一步：</span><strong>${esc(meta.nextLabel)}</strong><span style="color:var(--text-muted);">（${esc(this.getStatusMeta(meta.next).name)}）</span>`
          : '<span style="color:var(--text-muted);">　该检验批已处于终态，不可再推进，数据只读。</span>'}
      </div>
    </div>`;
  },

  // 按状态机推进到下一状态
  advanceStatus(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b) return;
    const meta = this.getStatusMeta(b.status);
    if (!meta.next) { toast('该检验批已处于终态，无法继续推进'); return; }

    // 使用决策与关闭走各自的既有流程（都会再开弹窗，需先关闭当前详情）
    if (meta.next === 'DEC')  { closeModal(); this.openDecision(batchId); return; }
    if (meta.next === 'CLSD') { closeModal(); this.closeBatch(batchId);   return; }

    const nextMeta = this.getStatusMeta(meta.next);
    const now = this._now() + ':00';
    b.statusLog = b.statusLog || [];
    b.statusLog.push({ from: meta.name, to: nextMeta.name, by: '当前用户', time: now });
    b.status = nextMeta.code;
    b.statusName = nextMeta.name;
    b.updateTime = now;

    closeModal();
    toast(`检验批 ${b.batchNo} 已推进，状态更新为「${nextMeta.name}」`);
    this.init();
  },

  // 暂存草稿：状态保持不变（仍为「已创建」），仅记录时间戳
  saveDraft(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b) return;
    b.updateTime = this._now() + ':00';
    closeModal();
    toast(`检验批 ${b.batchNo} 已暂存，状态仍为「${this.getStatusMeta(b.status).name}」，可继续编辑`);
    this.init();
  },

  // ==================== 方案A：查看弹窗标签页内容 ====================

  _switchIbTab(el) {
    const wrap = el.closest('.modal-body') || document;
    const tabs = wrap.querySelectorAll('.form-tab');
    const panels = wrap.querySelectorAll('.ib-tab-panel');
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    const panel = wrap.querySelector('.ib-tab-panel[data-ibpanel="' + el.dataset.ibtab + '"]');
    if (panel) panel.classList.add('active');
  },

  _now() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  },

  // 提取取样记录（统一从 crossPlantOps 或状态推导）
  _getSamplingRecords(b) {
    const recs = [];
    (b.crossPlantOps || []).filter(o => o.opType === 'sampling').forEach((o, i) => {
      recs.push({ id: 'samp_' + i, qty: o.sampleQty, by: o.sampledBy, time: o.sampleTime, plan: o.samplingPlanName, status: o.status === 'done' ? 'valid' : 'pending' });
    });
    if (recs.length === 0 && ['SAMP', 'INSP', 'DONE', 'DEC', 'CLSD'].includes(b.status)) {
      recs.push({ id: 'samp_0', qty: (parseFloat(b.quantity || '0') * 0.01).toFixed(3), by: b.createBy || '质检员', time: b.createTime, plan: '默认取样方案', status: 'valid' });
    }
    return recs;
  },

  // 提取结果录入（检验特性逐行）
  _getResultRecords(b) {
    const recs = [];
    (b.inspectionResults || []).forEach((r, i) => {
      const isQuant = r.micType === 'quantitative';
      const spec = isQuant ? (r.lowerSpec + ' ~ ' + r.upperSpec + ' ' + (r.unit || '')) : (r.defaultCode || '—');
      recs.push({ id: 'res_' + i, name: r.micName, spec: spec, value: r.value, by: b.createBy || '质检员', time: b.updateTime, status: 'valid' });
    });
    (b.crossPlantOps || []).filter(o => o.opType === 'inspection').forEach((o, oi) => {
      (o.results || []).forEach((r, ri) => {
        const isQuant = r.micType === 'quantitative';
        const spec = isQuant ? (r.lowerSpec + ' ~ ' + r.upperSpec + ' ' + (r.unit || '')) : (r.defaultCode || '—');
        recs.push({ id: 'res_c' + oi + '_' + ri, name: r.micName, spec: spec, value: r.value || '待录入', by: o.doneBy || '—', time: o.doneTime || '—', status: r.value ? 'valid' : 'pending' });
      });
    });
    return recs;
  },

  _getDecision(b) {
    return { decision: b.decision, by: b.decisionBy, time: b.decisionTime, remarks: b.decisionRemarks, score: b.qualityScore };
  },

  _renderBaseTab(b, ops) {
    ops = ops || [];

    // 工序清单：商务层级表（风格2）—— 工序主行可展开，检验类展开特性子行
    const opRows = ops.map((op, i) => {
      const isSamp = op.opType === 'sampling';
      const typeName = esc(op.opTypeName || (isSamp ? '取样' : '检验'));
      const chars = op.chars || [];
      const key = isSamp
        ? `取样方案：${esc(op.samplingPlanName || '—')}`
        : `检测项：${chars.length}（定量 ${chars.filter(c => c.micType === 'quantitative').length} / 定性 ${chars.filter(c => c.micType === 'qualitative').length}）`;
      const grp = 'chgrp_' + i;
      let detail;
      if (isSamp) {
        detail = `<tr class="ch-row hide ${grp}"><td colspan="4" class="muted">工序描述：${esc(op.description || '—')}</td></tr>`;
      } else {
        detail = chars.map(c => {
          const isQ = c.micType === 'quantitative';
          const spec = isQ
            ? `规格 <span class="accent">${esc(c.lowerSpec || '—')} ~ ${esc(c.upperSpec || '—')}</span> ${esc(c.unit || '')}`
            : `判定 <span class="accent">${esc(c.defaultCode || '—')}</span>${c.codeGroup ? ` · ${esc(c.codeGroup)}` : ''}`;
          return `<tr class="ch-row hide ${grp}">
            <td colspan="2"><span class="code">${esc(c.micCode)}</span>${esc(c.micName)}</td>
            <td class="muted">${esc(c.methodName || '—')}</td>
            <td>${spec}</td>
          </tr>`;
        }).join('');
      }
      return `<tr class="op-row" onclick="this.classList.toggle('open');document.querySelectorAll('.${grp}').forEach(r=>r.classList.toggle('hide'))">
        <td><span class="caret">▸</span><span class="opn">${esc(op.opNum)}</span></td>
        <td><span class="tw">${typeName}</span></td>
        <td>${esc(op.workCenterName || '—')}</td>
        <td>${key}</td>
      </tr>${detail}`;
    }).join('');

    return `
      ${this.renderSourceInfo(b)}
      <div style="background:#f8fafc;border-radius:8px;padding:14px 16px;margin-bottom:16px;">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px 20px;font-size:13px;">
          <div><span style="color:var(--text-muted);">物料编码：</span><span style="font-family:monospace;">${esc(b.materialCode)}</span></div>
        <div><span style="color:var(--text-muted);">物料名称：</span><strong>${esc(b.materialName)}</strong></div>
          <div><span style="color:var(--text-muted);">数量：</span>${b.quantity} ${esc(b.unit)}</div>
          <div><span style="color:var(--text-muted);">供应商批次：</span><strong style="color:#2563eb;">${esc(b.supplierBatch || '—')}</strong></div>
          <div><span style="color:var(--text-muted);">SAP批次：</span><span style="font-family:monospace;font-size:12px;">${esc(b.sapBatch)}</span></div>
          <div><span style="color:var(--text-muted);">来源单据：</span><span style="font-family:monospace;">${esc(b.sourceDocNo || '—')}</span></div>
        </div>
      </div>
      <div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:10px;">检验工序清单 <span style="font-size:12px;font-weight:400;color:var(--text-muted);">（来源：检验计划 ${esc(b.planNo)} · 点击工序展开特性）</span></div>
      ${ops.length ? `<table class="ib-ops-table"><thead><tr><th style="width:230px;">工序</th><th style="width:160px;">类型</th><th>工作中心</th><th>关键信息</th></tr></thead><tbody>${opRows}</tbody></table>` : '<div style="color:var(--text-muted);font-size:13px;">暂无工序数据</div>'}
      <div style="margin-top:18px;padding:10px 16px;border:1px dashed #d1d5db;border-radius:8px;background:#fffbfb;display:flex;align-items:center;justify-content:space-between;">
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text);">
          <input type="checkbox" id="ibDelFlag_${b.id}" ${b._deleteFlag ? 'checked' : ''} disabled onchange="InspectionBatch._toggleDeleteFlag('${b.id}', this.checked)" />
          <span>删除标记</span>
        </label>
        <button class="btn btn-ghost btn-sm" id="ibEditDel_${b.id}" onclick="InspectionBatch._toggleDelFlagEdit('${b.id}')">编辑</button>
      </div>
    `;
  },

  _toggleDeleteFlag(batchId, checked) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b) return;
    b._deleteFlag = checked;
    toast(checked ? '已勾选删除标记' : '已取消删除标记');
  },

  // 基本信息页签：删除标记需先点「编辑」才能勾选，再点「完成」锁回
  _toggleDelFlagEdit(batchId) {
    const cb = document.getElementById('ibDelFlag_' + batchId);
    const btn = document.getElementById('ibEditDel_' + batchId);
    if (!cb || !btn) return;
    if (cb.disabled) {
      cb.disabled = false;
      btn.textContent = '完成';
      cb.focus();
      toast('已开启编辑，可修改删除标记');
    } else {
      cb.disabled = true;
      btn.textContent = '编辑';
      toast('已锁定删除标记');
    }
  },


  _renderSamplingTab(b) {
    const recs = this._getSamplingRecords(b);
    const rev = (b._reversed && b._reversed.sampling) || [];
    const rows = recs.map((r, i) => {
      const isRev = rev.includes(r.id);
      const btn = isRev
        ? `<button class="btn btn-danger btn-sm" disabled>冲销</button>`
        : `<button class="btn btn-danger btn-sm" onclick="InspectionBatch._reverseRecord('${b.id}','sampling','${r.id}',this)">冲销</button>`;
      return `<tr class="${isRev ? 'reversed' : ''}">
        <td>${i + 1}</td>
        <td>${esc(r.qty)} ${esc(b.unit || '')}</td>
        <td>${esc(r.by)}</td>
        <td>${esc(r.time) || '—'}</td>
        <td class="table-actions">${btn}</td>
      </tr>`;
    }).join('');
    return `<table class="data-table"><thead><tr><th>序号</th><th>取样量</th><th>取样人</th><th>取样时间</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table>`;
  },

  _renderResultTab(b) {
    const recs = this._getResultRecords(b);
    const rev = (b._reversed && b._reversed.result) || [];
    const rows = recs.map(r => {
      const isRev = rev.includes(r.id);
      const btn = isRev
        ? `<button class="btn btn-danger btn-sm" disabled>冲销</button>`
        : `<button class="btn btn-danger btn-sm" onclick="InspectionBatch._reverseRecord('${b.id}','result','${r.id}',this)">冲销</button>`;
      return `<tr class="${isRev ? 'reversed' : ''}">
        <td>${esc(r.name)}</td>
        <td>${esc(r.spec)}</td>
        <td>${esc(r.value)}</td>
        <td>${esc(r.by)}</td>
        <td>${esc(r.time) || '—'}</td>
        <td class="table-actions">${btn}</td>
      </tr>`;
    }).join('');
    return `<table class="data-table"><thead><tr><th>检验特性</th><th>标准值</th><th>录入值</th><th>录入人</th><th>录入时间</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table>`;
  },

  _renderDecisionTab(b) {
    const d = this._getDecision(b);
    const decRev = b._decisionReversed;
    const statusBadge = decRev ? '<span class="badge badge-gray">已冲销</span>' : (d.time ? '<span class="badge badge-green">已决策</span>' : '<span class="badge badge-gray">尚未决策</span>');
    let html = `<div class="clean-info-card card-active"><h5>使用决策 ${statusBadge}</h5>
      <div class="ro-info-grid">
        <div class="ro-info-field"><span class="ro-info-label">决策结果</span><span class="ro-info-value">${d.decision ? esc(d.decision) : '<span class="empty">— 待录入 —</span>'}</span></div>
        <div class="ro-info-field"><span class="ro-info-label">决策人</span><span class="ro-info-value">${d.by ? esc(d.by) : '—'}</span></div>
        <div class="ro-info-field"><span class="ro-info-label">决策时间</span><span class="ro-info-value">${d.time ? esc(d.time) : '—'}</span></div>
        <div class="ro-info-field"><span class="ro-info-label">说明</span><span class="ro-info-value">${d.remarks ? esc(d.remarks) : '—'}</span></div>
      </div></div>`;
    if (d.time && !decRev) {
      html += `<button class="btn btn-danger btn-sm" onclick="InspectionBatch._reverseRecord('${b.id}','decision',null,this)">冲销决策</button>`;
    }
    return html;
  },

  _renderFlowTab(b) {
    let html = `<div style="background:#f8fafc;border-radius:8px;padding:14px 16px;">
      <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:8px;">📅 操作流水（审计轨迹）</div>
      <div style="font-size:13px;">`;
    html += `<div style="display:flex;gap:12px;padding:6px 0;"><div style="width:8px;height:8px;border-radius:50%;background:#22c55e;margin-top:6px;flex-shrink:0;"></div><div><span style="color:var(--text-muted);">${esc(b.createTime)}</span> — 创建检验批（${esc(b.createBy)}）</div></div>`;
    if ((b.statusLog || []).length) {
      b.statusLog.forEach(l => {
        html += `<div style="display:flex;gap:12px;padding:6px 0;"><div style="width:8px;height:8px;border-radius:50%;background:#2563eb;margin-top:6px;flex-shrink:0;"></div><div><span style="color:var(--text-muted);">${esc(l.time)}</span> — 状态流转：<strong>${esc(l.from)} → ${esc(l.to)}</strong>（${esc(l.by || '当前用户')}）</div></div>`;
      });
    } else if (b.status !== 'CRTD') {
      html += `<div style="display:flex;gap:12px;padding:6px 0;"><div style="width:8px;height:8px;border-radius:50%;background:#eab308;margin-top:6px;flex-shrink:0;"></div><div><span style="color:var(--text-muted);">${esc(b.updateTime)}</span> — 状态更新为"${esc(b.statusName)}"</div></div>`;
    }
    if (b.decisionTime) html += `<div style="display:flex;gap:12px;padding:6px 0;"><div style="width:8px;height:8px;border-radius:50%;background:${(b.decision || '').startsWith('A') ? '#22c55e' : '#dc2626'};margin-top:6px;flex-shrink:0;"></div><div><span style="color:var(--text-muted);">${esc(b.decisionTime)}</span> — 决策：<strong>${esc(b.decision || '')} ${esc(b.decisionDesc || '')}</strong>（${esc(b.decisionBy || '')}）${b.qualityScore != null ? ` — 得分：${b.qualityScore}分` : ''}</div></div>`;
    if (b.closeTime) html += `<div style="display:flex;gap:12px;padding:6px 0;"><div style="width:8px;height:8px;border-radius:50%;background:#6b7280;margin-top:6px;flex-shrink:0;"></div><div><span style="color:var(--text-muted);">${esc(b.closeTime)}</span> — 已关闭归档</div></div>`;
    if (b.cancelReason) html += `<div style="display:flex;gap:12px;padding:6px 0;"><div style="width:8px;height:8px;border-radius:50%;background:#dc2626;margin-top:6px;flex-shrink:0;"></div><div><span style="color:var(--text-muted);">${esc(b.updateTime)}</span> — ${esc(b.cancelReason)}</div></div>`;
    (b._auditLog || []).forEach(l => {
      const label = l.kind === 'sampling' ? '取样' : l.kind === 'result' ? '检验特性' : l.kind === 'decision' ? '使用决策' : '记录';
      html += `<div style="display:flex;gap:12px;padding:6px 0;"><div style="width:8px;height:8px;border-radius:50%;background:#dc2626;margin-top:6px;flex-shrink:0;"></div><div><span style="color:var(--text-muted);">${esc(l.time)}</span> — <span style="color:#dc2626;">冲销${label}（原因：${esc(l.reason)}）</span></div></div>`;
    });
    html += `</div></div>`;
    return html;
  },

  // 单行/单条冲销：弹原因确认框 → 标记已冲销 + 生成反向流水 → 重绘弹窗
  _reverseRecord(batchId, kind, recId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b) return;
    const kindLabel = kind === 'sampling' ? '本次取样记录' : kind === 'result' ? '该检验特性' : '使用决策';
    showModal('冲销确认',
      `<div style="padding:4px 0;">
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">确认冲销${kindLabel}？冲销后将保留原记录并标记「已冲销」，同时生成反向流水。</p>
        <div class="form-group"><label>冲销原因 <span class="req">*</span></label>
          <select id="ibRevReason"><option>录入错误</option><option>取样器具污染</option><option>重复录入</option><option>其他原因</option></select>
        </div>
        <div class="form-group"><label>备注说明</label><textarea id="ibRevRemark" placeholder="可选，补充说明冲销背景"></textarea></div>
      </div>`,
      [
        { text: '取消', cls: 'btn-secondary', action: closeModal },
        { text: '确认冲销', cls: 'btn-danger', action: () => {
            const reason = (document.getElementById('ibRevReason') && document.getElementById('ibRevReason').value) || '录入错误';
            b._reversed = b._reversed || { sampling: [], result: [] };
            b._auditLog = b._auditLog || [];
            if (kind === 'sampling') b._reversed.sampling.push(recId);
            else if (kind === 'result') b._reversed.result.push(recId);
            else if (kind === 'decision') b._decisionReversed = true;
            b._auditLog.push({ time: this._now(), kind: kind, recId: recId, reason: reason });
            closeModal();
            this.openDetail(batchId);
            toast('已冲销并生成反向流水');
          }
        }
      ]
    );
  },

  // ==================== 取样表单弹窗 ====================

  openSamplingForm(batchId, opNum) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b || b.status !== 'CRTD') return toast('当前状态不允许取样');

    showModal(
      `取样 — ${b.batchNo}`,
      `<div style="padding:4px 0;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          <div style="font-weight:600;margin-bottom:4px;">工序 ${esc(opNum)} · 取样</div>
          <div style="color:var(--text-secondary);">检验批号：${esc(b.batchNo)} | 物料：${esc(b.materialCode)} ${esc(b.materialName)}</div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>取样量<span class="req">*</span></label>
            <input type="number" id="ibSampleQty" step="0.001" placeholder="请输入取样量" min="0">
            <span style="font-size:12px;color:var(--text-muted);">单位：${esc(b.unit)}</span>
          </div>
          <div class="form-group">
            <label>过账日期<span class="req">*</span></label>
            <input type="date" id="ibPostDate" value="${new Date().toISOString().slice(0,10)}">
          </div>
        </div>
        <div class="form-group full" style="margin-top:8px;">
          <label>备注</label>
          <input type="text" id="ibSampleRemark" placeholder="可选填写备注" style="width:100%;">
        </div>
      </div>`,
      [
        { text:'取消', cls:'btn-secondary', action: ()=>{ InspectionBatch.openDetail(batchId); } },
        { text:'确认取样', cls:'btn-primary', action: ()=>{ InspectionBatch.submitSampling(batchId); } }
      ],
      'modal-md'
    );
  },

  submitSampling(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b || b.status !== 'CRTD') return toast('当前状态不允许取样');

    // PRD 4.1: 实时校验冲销
    if (Math.random() < 0.03) {
      closeModal();
      this.doCancelBatch(batchId, 'SAP 收货凭证已被冲销，无法执行取样');
      return;
    }

    const qty = parseFloat(document.getElementById('ibSampleQty')?.value);
    const postDate = document.getElementById('ibPostDate')?.value;
    const remark = (document.getElementById('ibSampleRemark')?.value||'').trim();

    if (!qty || qty <= 0) { toast('请输入有效的取样量'); return; }
    if (!postDate) { toast('请选择过账日期'); return; }

    b.status = 'SAMP';
    b.statusName = '取样中';
    b.updateTime = new Date().toISOString().replace('T',' ').slice(0,19);
    b.sampleQty = qty;
    b.postDate = postDate;
    b.sampleRemark = remark;
    toast(`取样已确认！取样量 ${qty} ${b.unit}，检验批 ${b.batchNo} 进入"取样中"`);
    this.init();
    InspectionBatch.openDetail(batchId);
  },

  // ==================== 检验结果录入弹窗 ====================

  // 用户选择要录入结果的检验工序
  selectOpForResult(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b) return toast('检验批未找到');
    if (['CANC','CLSD'].includes(b.status)) return toast('当前状态不允许录入结果');

    const plan = this._resolvePlan(b);
    const allOps = (plan && plan.operations) ? plan.operations : [
      { opNum:'0010', opType:'sampling', opTypeName:'取样', workCenterName:'QC取样室', description:'按取样方案执行取样' },
      { opNum:'0020', opType:'inspection', opTypeName:'检验', workCenterName:'QC实验室', description:'外观、含量、pH值等' }
    ];

    // 只筛选检验类型的工序
    const inspectionOps = allOps.filter(o => o.opType !== 'sampling');

    if (inspectionOps.length === 0) {
      toast('该检验计划暂无检验工序，请检查检验计划配置');
      return;
    }

    // 如果只有一个检验工序，直接进入录入
    if (inspectionOps.length === 1) {
      this.openResultEntry(batchId, inspectionOps[0].opNum);
      return;
    }

    const opCards = inspectionOps.map((op, i) => {
      const hasChars = op.chars && op.chars.length > 0;
      const charCount = hasChars ? op.chars.length : 0;
      return `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div style="min-width:0;flex:1;">
          <div style="font-weight:600;font-size:14px;color:var(--text);display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span style="font-family:monospace;color:#6366f1;">${esc(op.opNum)}</span>
            <span>${esc(op.opTypeName)}</span>
            <span class="badge badge-sm" style="background:#eef2ff;color:#4338ca;">${esc(op.workCenterName)}</span>
          </div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">
            ${esc(op.description||'—')}
            ${hasChars
              ? `<span style="margin-left:8px;color:#059669;">· ${charCount} 个检验特性</span>`
              : '<span style="margin-left:8px;color:#ef4444;">· 无检验特性</span>'}
          </div>
        </div>
        <button class="btn btn-sm" style="background:#6366f1;color:#fff;flex-shrink:0;" onclick="closeModal();InspectionBatch.openResultEntry('${batchId}','${op.opNum}');">
          录入结果
        </button>
      </div>`;
    }).join('');

    showModal(
      `选择检验工序 — ${esc(b.batchNo)}`,
      `<div style="padding:4px 0;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          <div style="font-weight:600;margin-bottom:4px;">📋 ${esc(b.batchNo)}</div>
          <div style="color:var(--text-secondary);">物料：${esc(b.materialCode)} ${esc(b.materialName)} | 计划：${esc(b.planNo)}</div>
        </div>
        <div style="margin-bottom:8px;font-size:13px;color:var(--text-secondary);">请选择要录入结果的检验工序：</div>
        <div style="display:flex;flex-direction:column;gap:10px;max-height:50vh;overflow-y:auto;">
          ${opCards}
        </div>
      </div>`,
      [{ text:'取消', cls:'btn-outline', action: closeModal }],
      'modal-lg'
    );
  },

  openResultEntry(batchId, opNum) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b) return toast('检验批未找到');
    if (['CANC','CLSD'].includes(b.status)) return toast('当前状态不允许录入结果');

    const plan = this._resolvePlan(b);
    const op = (plan && plan.operations)
      ? plan.operations.find(o => o.opNum === opNum)
      : null;

    const chars = (op && op.chars && op.chars.length > 0) ? op.chars : [];

    if (chars.length === 0) {
      toast('该检验工序暂无检验特性，请检查检验计划配置');
      return;
    }

    const charRows = chars.map((c, i) => {
      const isQuant = c.micType === 'quantitative';
      const typeBadge = isQuant
        ? '<span class="badge badge-blue badge-sm">定量</span>'
        : '<span class="badge badge-purple badge-sm">定性</span>';
      const specText = isQuant
        ? `${c.lowerSpec||'—'} ~ ${c.upperSpec||'—'} ${c.unit||''}`
        : (c.defaultCode||'合格');

      let inputHtml = '';
      if (isQuant) {
        inputHtml = `<div style="display:flex;align-items:center;gap:8px;">
          <input type="number" id="ibCharVal_${i}" step="any" placeholder="实测值" style="width:120px;">
          <span style="font-size:12px;color:var(--text-muted);">${c.unit||''}</span>
        </div>`;
      } else {
        inputHtml = `<select id="ibCharVal_${i}" style="width:160px;">
          <option value="">请选择</option>
          <option value="合格">合格</option>
          <option value="不合格">不合格</option>
        </select>`;
      }

      return `<tr>
        <td><span style="font-family:monospace;font-size:11px;color:#2563eb;font-weight:500;">${esc(c.micCode)}</span></td>
        <td><strong>${esc(c.micName)}</strong> ${typeBadge}</td>
        <td style="font-size:12px;">${esc(c.methodName)||'—'}</td>
        <td style="font-family:monospace;font-size:12px;">${specText}</td>
        <td>${inputHtml}</td>
      </tr>`;
    }).join('');

    showModal(
      `录入检验结果 — ${b.batchNo}`,
      `<div style="padding:4px 0;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
          <div style="font-weight:600;margin-bottom:4px;">工序 ${esc(opNum)} · ${esc(op?op.opTypeName:'检验')} · ${esc(op?op.workCenterName:'—')}</div>
          <div style="color:var(--text-secondary);">检验批号：${esc(b.batchNo)} | 物料：${esc(b.materialCode)} ${esc(b.materialName)} | 计划：${esc(b.planNo)}</div>
        </div>
        <table class="data-table" style="min-width:100%;">
          <thead><tr>
            <th style="width:130px;">MIC编码</th>
            <th>MIC名称</th>
            <th style="width:140px;">检验方法</th>
            <th style="width:130px;">规格范围</th>
            <th style="width:190px;">实测值</th>
          </tr></thead>
          <tbody>${charRows}</tbody>
        </table>
        <div class="form-group full" style="margin-top:12px;">
          <label>备注</label>
          <input type="text" id="ibResultRemark" placeholder="可选填写备注" style="width:100%;">
        </div>
      </div>`,
      [
        { text:'取消', cls:'btn-secondary', action: ()=>{ InspectionBatch.openDetail(batchId); } },
        { text:'保存草稿', cls:'btn-secondary', action: ()=>{ toast('草稿已保存'); InspectionBatch.openDetail(batchId); } },
        { text:'提交结果', cls:'btn-primary', action: ()=>{ InspectionBatch.submitResult(batchId, opNum); } }
      ],
      'modal-lg'
    );
  },

  submitResult(batchId, opNum) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b || ['CANC','CLSD'].includes(b.status)) return;

    // PRD: 校验冲销
    if (Math.random() < 0.03) {
      closeModal();
      this.doCancelBatch(batchId, 'SAP 凭证冲销，自动取消');
      return;
    }

    const plan = this._resolvePlan(b);
    const op = (plan && plan.operations)
      ? plan.operations.find(o => o.opNum === opNum)
      : null;
    const chars = (op && op.chars) ? op.chars : [];
    const remark = (document.getElementById('ibResultRemark')?.value||'').trim();

    // 收集结果
    let allValid = true;
    const results = chars.map((c, i) => {
      const valEl = document.getElementById('ibCharVal_' + i);
      const val = valEl ? (valEl.value||'').trim() : '';
      if (!val) { allValid = false; }
      const verdict = c.micType === 'quantitative'
        ? (parseFloat(val) >= parseFloat(c.lowerSpec) && parseFloat(val) <= parseFloat(c.upperSpec) ? '合格' : '不合格')
        : (val === '合格' ? '合格' : '不合格');
      return { micCode: c.micCode, micName: c.micName, value: val, verdict };
    });

    if (!allValid) { toast('请填写所有检验特性的实测值'); return; }

    // 判定是否有不合格项
    const hasFail = results.some(r => r.verdict === '不合格');

    // 更新批次状态
    b.status = 'DONE';
    b.statusName = '检验完成';
    b.updateTime = new Date().toISOString().replace('T',' ').slice(0,19);
    b.inspectionResults = results;
    b.inspectionVerdict = hasFail ? 'failed' : 'passed';
    b.inspectionRemark = remark;

    const failNote = hasFail ? ' 发现不合格项，请关注决策！' : '';
    toast(`检验结果已提交！判定：${hasFail ? '不合格' : '合格'}${failNote}`);
    this.init();
    InspectionBatch.openDetail(batchId);
  },

  // ==================== 使用决策 ====================

  // 决策代码配置（对应 PRD 4.2.3 字段1）
  decisionCodes: [
    { code:'A1', description:'合格（接收）', suggestedAction:'放行至可用库存', targetStock:'可用库存' },
    { code:'A2', description:'让步接收', suggestedAction:'放行至可用库存，并记录偏差', targetStock:'可用库存' },
    { code:'R1', description:'拒收', suggestedAction:'转移至冻结库存，触发退货流程', targetStock:'冻结库存' },
    { code:'R2', description:'报废', suggestedAction:'转移至冻结库存，触发报废流程', targetStock:'冻结库存' }
  ],

  // 提取检验结果（统一处理 inspectionResults 和 crossPlantOps）
  _getInspectionResults(b) {
    if (b.inspectionResults && b.inspectionResults.length > 0) {
      return b.inspectionResults;
    }
    // 从工序数据中提取
    if (b.crossPlantOps) {
      const results = [];
      b.crossPlantOps.forEach(op => {
        if (op.opType === 'inspection' && op.status === 'done' && op.results) {
          op.results.forEach(r => results.push(r));
        }
      });
      if (results.length > 0) return results;
    }
    return [];
  },

  openDecision(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b || b.status !== 'DONE') return toast('只有检验完成的批次才能执行决策');

    const results = this._getInspectionResults(b);
    const totalQty = parseFloat(b.quantity) || 0;
    const failCount = results.filter(r => r.verdict === '不合格').length;
    const passCount = results.length - failCount;
    // 自动计算质量得分
    const autoScore = results.length > 0 ? Math.round((passCount / results.length) * 100) : 100;
    const verdictText = failCount > 0 ? '不合格' : '合格';

    // ============ 决策依据概览表格 ============
    let resultsTableHtml = '';
    if (results.length > 0) {
      const rows = results.map((r, i) => {
        const isQuant = r.micType === 'quantitative';
        const isPass = r.verdict === '合格';
        const specRange = isQuant
          ? `${r.lowerSpec||'—'} ~ ${r.upperSpec||'—'} ${r.unit||''}`
          : (r.upperSpec || r.defaultCode || '—');
        const valueCell = r.value || '—';
        return `<tr class="${isPass ? '' : 'dc-fail-row'}" style="${isPass ? '' : 'background:#f8fafc;'}">
          <td style="font-size:12px;">${i + 1}</td>
          <td style="font-weight:500;font-size:13px;">${esc(r.micName)}</td>
          <td style="font-family:monospace;font-size:11px;color:var(--text-secondary);">${specRange}</td>
          <td style="font-family:monospace;font-weight:600;font-size:13px;color:#1e293b;">${esc(valueCell)} ${isQuant?esc(r.unit||''):''}</td>
          <td><span class="badge ${isPass?'badge-green':'badge-red'} badge-sm">${esc(r.verdict)}</span></td>
        </tr>`;
      }).join('');

      resultsTableHtml = `<table class="data-table" style="width:100%;font-size:13px;">
        <thead><tr>
          <th style="width:40px;">#</th><th>特性描述</th><th style="width:140px;">规格范围</th><th style="width:130px;">实测值</th><th style="width:70px;">判定</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
    } else {
      resultsTableHtml = `<div style="text-align:center;padding:20px;color:var(--text-muted);">暂无检验结果数据</div>`;
    }

    // ============ 决策代码选项 ============
    const codeOptions = this.decisionCodes.map(dc =>
      `<option value="${dc.code}">${dc.code} — ${esc(dc.description)}</option>`
    ).join('');

    // ============ 完整弹窗 HTML ============
    const bodyHtml = `<div style="font-size:13px;color:var(--text);">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px 28px;padding:14px 16px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;margin-bottom:18px;">
        <div><div style="font-size:12px;color:var(--text-secondary);margin-bottom:2px;">检验批号</div><div style="font-family:monospace;font-weight:600;font-size:13px;">${esc(b.batchNo)}</div></div>
        <div><div style="font-size:12px;color:var(--text-secondary);margin-bottom:2px;">物料号</div><div style="font-family:monospace;font-weight:600;font-size:13px;">${esc(b.materialCode)}</div></div>
        <div><div style="font-size:12px;color:var(--text-secondary);margin-bottom:2px;">物料描述</div><div style="font-weight:600;font-size:13px;">${esc(b.materialName)}</div></div>
        <div><div style="font-size:12px;color:var(--text-secondary);margin-bottom:2px;">供应商批次</div><div style="font-weight:600;font-size:13px;">${esc(b.supplierBatch)}</div></div>
        <div><div style="font-size:12px;color:var(--text-secondary);margin-bottom:2px;">工厂</div><div style="font-size:13px;">${esc(b.plantName)}</div></div>
        <div><div style="font-size:12px;color:var(--text-secondary);margin-bottom:2px;">检验类型</div><div style="font-size:13px;">${esc(b.purposeName)}</div></div>
        <div><div style="font-size:12px;color:var(--text-secondary);margin-bottom:2px;">SAP批次</div><div style="font-family:monospace;font-size:12px;">${esc(b.sapBatch)}</div></div>
        <div><div style="font-size:12px;color:var(--text-secondary);margin-bottom:2px;">数量</div><div style="font-weight:600;font-size:13px;">${b.quantity} ${esc(b.unit)}</div></div>
      </div>

      <div style="padding-bottom:16px;margin-bottom:16px;border-bottom:1px solid #eef1f4;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="font-size:13px;font-weight:700;color:#1f2937;padding-left:10px;border-left:3px solid #1E3A5F;line-height:1.3;">决策依据概览 · 检验结果汇总</div>
          <div style="font-size:12px;">
            <span class="badge ${failCount>0?'badge-red':'badge-green'}">综合判定：${verdictText}</span>
            <span style="margin-left:8px;color:var(--text-muted);">${passCount}/${results.length} 项合格</span>
            ${failCount>0 ? `<span style="margin-left:4px;color:#dc2626;font-weight:600;">${failCount} 项不合格</span>` : ''}
          </div>
        </div>
        ${resultsTableHtml}
      </div>

      <div style="padding-bottom:16px;margin-bottom:16px;border-bottom:1px solid #eef1f4;">
        <div style="font-size:13px;font-weight:700;color:#1f2937;padding-left:10px;border-left:3px solid #1E3A5F;line-height:1.3;margin-bottom:14px;">决策录入</div>

        <div style="margin-bottom:14px;">
          <label style="display:block;font-weight:600;font-size:12.5px;">决策代码 <span style="color:#dc2626;">*</span></label>
          <select id="dcCode" onchange="InspectionBatch._onDecisionCodeChange('${batchId}')" style="width:100%;font-size:14px;padding:9px;margin-top:6px;border:1px solid #d1d5db;border-radius:6px;background:#fff;">
            <option value="">— 请选择决策代码 —</option>
            ${codeOptions}
          </select>
          <div id="dcSuggestedAction" style="font-size:12px;color:var(--text-muted);margin-top:5px;min-height:16px;"></div>
        </div>

        <div style="margin-bottom:14px;">
          <label style="display:block;font-weight:600;font-size:12.5px;">质量得分 <span style="font-size:12px;color:var(--text-muted);font-weight:400;">（0-100，可选）</span></label>
          <div style="display:flex;align-items:center;gap:10px;margin-top:6px;">
            <input type="range" id="dcScoreRange" min="0" max="100" value="${autoScore}" style="flex:1;"
              oninput="document.getElementById('dcScore').value=this.value">
            <input type="number" id="dcScore" value="${autoScore}" min="0" max="100" style="width:70px;text-align:center;font-weight:600;font-size:16px;border:1px solid #d1d5db;border-radius:6px;padding:6px;"
              oninput="var v=parseInt(this.value)||0; if(v>100)v=100; if(v<0)v=0; this.value=v; document.getElementById('dcScoreRange').value=v;">
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">
            系统建议：<strong>${autoScore}</strong> 分（基于 ${passCount}/${results.length} 合格率）
          </div>
        </div>

        <div style="margin-bottom:14px;background:#f8fafc;border-radius:6px;padding:10px 12px;">
          <div style="font-weight:600;font-size:12.5px;margin-bottom:8px;color:#1f2937;">库存过账 <span style="font-size:12px;color:var(--text-muted);font-weight:400;">（条件必填）</span></div>
          <table class="data-table" style="width:100%;font-size:13px;">
            <thead><tr>
              <th>库存类型</th><th style="width:100px;">当前数量</th><th style="width:120px;">合格品数量</th><th style="width:120px;">不合格品数量</th>
            </tr></thead>
            <tbody>
              <tr>
                <td><span class="badge badge-yellow badge-sm">待检库存</span></td>
                <td style="font-weight:600;">${b.quantity} ${esc(b.unit)}</td>
                <td><input type="number" id="dcQtyOk" step="any" min="0" max="${totalQty}" value="0" style="width:100px;border:1px solid #d1d5db;border-radius:6px;padding:6px;"
                  onchange="InspectionBatch._onQtyChange('${batchId}')"></td>
                <td><input type="number" id="dcQtyNg" step="any" min="0" max="${totalQty}" value="0" style="width:100px;border:1px solid #d1d5db;border-radius:6px;padding:6px;"
                  onchange="InspectionBatch._onQtyChange('${batchId}')"></td>
              </tr>
            </tbody>
          </table>
          <div id="dcStockInfo" style="font-size:12px;color:var(--text-muted);margin-top:6px;"></div>
        </div>

        <div>
          <label style="display:block;font-weight:600;font-size:12.5px;">备注 / 决策原因 <span style="font-size:12px;color:var(--text-muted);font-weight:400;">（可选）</span></label>
          <textarea id="dcRemarks" rows="3" style="width:100%;resize:vertical;margin-top:6px;border:1px solid #d1d5db;border-radius:6px;padding:8px;font-family:inherit;font-size:13px;" placeholder="请输入决策原因或补充说明..."></textarea>
        </div>
      </div>

      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button class="btn btn-secondary" onclick="closeModal()" style="padding:9px 24px;">取消</button>
        <button class="btn btn-primary" onclick="InspectionBatch._doDecisionSave('${batchId}')" style="padding:9px 24px;font-size:14px;">
          保存决策
        </button>
      </div>
    </div>`;

    showModal(
      `使用决策 — ${esc(b.batchNo)}`,
      bodyHtml,
      [],  // 底部按钮内置在 body 中
      'modal-decision'
    );
  },

  // 决策代码变更 → 联动更新建议动作、库存目标
  _onDecisionCodeChange(batchId) {
    const code = document.getElementById('dcCode')?.value || '';
    const dc = this.decisionCodes.find(d => d.code === code);
    const actionEl = document.getElementById('dcSuggestedAction');
    const stockInfoEl = document.getElementById('dcStockInfo');
    const qtyOkEl = document.getElementById('dcQtyOk');
    const qtyNgEl = document.getElementById('dcQtyNg');

    if (!dc) {
      if (actionEl) actionEl.innerHTML = '';
      if (stockInfoEl) stockInfoEl.innerHTML = '';
      if (qtyOkEl) qtyOkEl.value = 0;
      if (qtyNgEl) qtyNgEl.value = 0;
      return;
    }

    const b = this.batchData.find(x => x.id === batchId);
    const totalQty = parseFloat(b?.quantity) || 0;

    if (actionEl) {
      actionEl.innerHTML = `<span style="color:#1E3A5F;">建议跟进动作：<strong>${esc(dc.suggestedAction)}</strong></span>`;
    }

    // 根据决策代码自动填充库存过账
    if (dc.code === 'A1' || dc.code === 'A2') {
      // 接收类：全部 → 可用库存
      if (qtyOkEl) qtyOkEl.value = totalQty;
      if (qtyNgEl) qtyNgEl.value = 0;
      if (stockInfoEl) stockInfoEl.innerHTML = `<span style="color:#1E3A5F;">建议：将全部 <strong>${totalQty} ${esc(b?.unit||'')}</strong> 从「待检库存」转移至「<strong>${esc(dc.targetStock)}</strong>」${dc.code==='A2'?'（需记录偏差）':''}</span>`;
    } else {
      // 拒绝类：全部 → 冻结库存
      if (qtyOkEl) qtyOkEl.value = 0;
      if (qtyNgEl) qtyNgEl.value = totalQty;
      if (stockInfoEl) stockInfoEl.innerHTML = `<span style="color:#dc2626;">建议：将全部 <strong>${totalQty} ${esc(b?.unit||'')}</strong> 从「待检库存」转移至「<strong>${esc(dc.targetStock)}</strong>」</span>`;
    }
  },

  // 库存数量变更 → 校验总数
  _onQtyChange(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    const totalQty = parseFloat(b?.quantity) || 0;
    const ok = parseFloat(document.getElementById('dcQtyOk')?.value) || 0;
    const ng = parseFloat(document.getElementById('dcQtyNg')?.value) || 0;
    const sum = ok + ng;
    const stockInfoEl = document.getElementById('dcStockInfo');
    if (stockInfoEl) {
      if (sum > totalQty) {
        stockInfoEl.innerHTML = `<span style="color:#dc2626;">合格品 + 不合格品数量超过总量 ${totalQty} ${esc(b?.unit||'')}，请调整</span>`;
      } else {
        stockInfoEl.innerHTML = `<span style="color:var(--text-muted);">已分配：${ok} 合格 + ${ng} 不合格 = ${sum} ${esc(b?.unit||'')}${sum < totalQty ? `（剩余 ${(totalQty - sum).toFixed(3)} 未分配）` : ''}</span>`;
      }
    }
  },

  // 保存决策（含二次确认对话框）
  _doDecisionSave(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b || b.status !== 'DONE') return;

    // ========== 必填项校验 ==========
    const code = document.getElementById('dcCode')?.value || '';
    if (!code) { toast('请选择决策代码'); return; }

    const dc = this.decisionCodes.find(d => d.code === code);
    const qtyOk = parseFloat(document.getElementById('dcQtyOk')?.value) || 0;
    const qtyNg = parseFloat(document.getElementById('dcQtyNg')?.value) || 0;
    const totalQty = parseFloat(b.quantity) || 0;
    const score = parseInt(document.getElementById('dcScore')?.value) || 0;
    const remarks = (document.getElementById('dcRemarks')?.value || '').trim();
    const sum = qtyOk + qtyNg;

    if (sum <= 0) { toast('请至少填写合格品或不格品数量'); return; }
    if (sum > totalQty + 0.001) { toast(`合格品+不合格品(${sum})超过检验批总量(${totalQty})，请调整`); return; }

    // ========== 二次确认对话框 ==========
    const actionText = code.startsWith('A') ? '接收' : '拒绝';
    const confirmHtml = `<div style="padding:8px 0;">
        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;padding:14px;margin-bottom:14px;text-align:center;">
          <div style="font-size:15px;font-weight:700;color:#1f2937;">确认执行使用决策</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:6px;">此操作将完成检验批并触发后续动作，是否确认？</div>
        </div>
      <table style="width:100%;font-size:13px;border-collapse:collapse;">
        <tr><td style="padding:6px 12px;color:var(--text-muted);width:90px;">检验批号</td><td style="padding:6px 12px;font-weight:600;font-family:monospace;color:#1e293b;">${esc(b.batchNo)}</td></tr>
        <tr><td style="padding:6px 12px;color:var(--text-muted);">决策代码</td><td style="padding:6px 12px;"><span class="badge ${code.startsWith('A')?'badge-green':'badge-red'}">${esc(code)} — ${esc(dc?.description||'')}</span></td></tr>
        <tr><td style="padding:6px 12px;color:var(--text-muted);">跟进动作</td><td style="padding:6px 12px;color:#1e293b;font-weight:500;">${esc(dc?.suggestedAction||'')}</td></tr>
        <tr><td style="padding:6px 12px;color:var(--text-muted);">质量得分</td><td style="padding:6px 12px;font-weight:600;">${score} 分</td></tr>
        <tr><td style="padding:6px 12px;color:var(--text-muted);">合格品数量</td><td style="padding:6px 12px;color:#1e293b;font-weight:600;">${qtyOk} ${esc(b.unit)} → 可用库存</td></tr>
        <tr><td style="padding:6px 12px;color:var(--text-muted);">不合格品数量</td><td style="padding:6px 12px;color:#1e293b;font-weight:600;">${qtyNg > 0 ? qtyNg + ' ' + esc(b.unit) + ' → 冻结库存' : '—'}</td></tr>
        ${remarks ? `<tr><td style="padding:6px 12px;color:var(--text-muted);">备注</td><td style="padding:6px 12px;">${esc(remarks)}</td></tr>` : ''}
        <tr><td style="padding:6px 12px;color:var(--text-muted);">决策人</td><td style="padding:6px 12px;">质量工程师（当前用户）</td></tr>
      </table>
    </div>`;

    showModal(
      '二次确认 — 使用决策',
      confirmHtml,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal },
        { text:'确认执行', cls:'btn-primary', action: function() {
          closeModal();
          InspectionBatch._doDecisionConfirm(batchId, code, dc, qtyOk, qtyNg, score, remarks);
        }}
      ],
      'modal-md'
    );
  },

  // 最终执行决策
  _doDecisionConfirm(batchId, code, dc, qtyOk, qtyNg, score, remarks) {
    // PRD 4.1: 决策前实时校验冲销
    if (Math.random() < 0.03) {
      toast('该检验批对应的 SAP 收货凭证已被冲销，无法执行决策');
      this.doCancelBatch(batchId, 'SAP 凭证冲销，自动取消');
      return;
    }

    const b = this.batchData.find(x => x.id === batchId);
    if (!b || b.status !== 'DONE') return;

    const now = new Date().toISOString().replace('T',' ').slice(0,19);
    b.status = 'DEC';
    b.statusName = '已决策';
    b.decision = code;
    b.decisionDesc = dc.description;
    b.decisionBy = '质量工程师';
    b.decisionTime = now;
    b.updateTime = now;
    b.qualityScore = score;
    b.qtyOk = qtyOk;
    b.qtyNg = qtyNg;
    b.decisionRemarks = remarks;
    b.decisionAction = dc.suggestedAction;
    b.targetStock = dc.targetStock;

    toast(`使用决策「${code} — ${dc.description}」已执行！检验批 ${b.batchNo} 状态已更新为"已决策"${remarks ? '，备注已记录' : ''}`);
    this.init();
  },

  // ==================== 关闭/取消 ====================

  closeBatch(batchId) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b || b.status !== 'DEC') return toast('只有已决策的批次才能关闭');

    if (!confirm(`确认关闭检验批 ${b.batchNo}？关闭后将归档，不可修改。`)) return;

    const now = new Date().toISOString().replace('T',' ').slice(0,19);
    b.status = 'CLSD';
    b.statusName = '已关闭';
    b.closeTime = now;
    b.updateTime = now;

    toast(`检验批 ${b.batchNo} 已关闭归档`);
    this.init();
  },

  cancelBatch(batchId) {
    if (!confirm('确认取消该检验批？取消后将标记为已取消状态。')) return;
    this.doCancelBatch(batchId, '手动取消');
  },

  doCancelBatch(batchId, reason) {
    const b = this.batchData.find(x => x.id === batchId);
    if (!b) return;

    const now = new Date().toISOString().replace('T',' ').slice(0,19);
    b.status = 'CANC';
    b.statusName = '已取消';
    b.cancelReason = reason;
    b.updateTime = now;

    toast(`检验批 ${b.batchNo} 已取消：${reason}`);
    this.init();
  },

  // 折叠/展开工序的 MIC 特性
  _toggleOpChars(uid, btn) {
    const panel = document.getElementById(uid);
    const label = btn.querySelector('._expandLabel');
    if (!panel) return;
    if (panel.style.display === 'none') {
      panel.style.display = 'block';
      if (label) label.textContent = '收起';
      btn.innerHTML = btn.innerHTML.replace('▾', '▴');
    } else {
      panel.style.display = 'none';
      if (label) label.textContent = '展开';
      btn.innerHTML = btn.innerHTML.replace('▴', '▾');
    }
  }

};

// ===== 查询变式注册（通用模块 V3/js/core/query-variant.js）=====
if (window.QueryVariant) {
  QueryVariant.register({
    pageId: 'inspection-batch',
    fields: ['ibFactory', 'ibMaterial', 'ibSuppBatch', 'ibSapBatch', 'ibStatus'],
    textFields: ['ibMaterial', 'ibSuppBatch', 'ibSapBatch'],
    labels: { ibFactory: '工厂', ibMaterial: '物料编码', ibSuppBatch: '供应商批次号', ibSapBatch: 'SAP批次号', ibStatus: '状态' },
    onApply: function () { InspectionBatch.search(); }
  });
}
