// 检验批 - 基本信息页签 demo 共享模拟数据（取自检验计划主数据）
window.IB_DEMO = {
  batch: {
    batchNo: 'IL-2026-001234',
    planNo: 'IP-2001',
    materialCode: 'RM-2001',
    materialName: '注射用头孢曲松钠',
    quantity: 500,
    unit: 'kg',
    supplierBatch: 'SUP-20260615-A',
    sapBatch: 'CH-00012345',
    docNo: 'GR-20260615-008',
    purposeName: '进货检验',
    plantName: '上海工厂'
  },
  // 工序（来源：检验计划 operations）
  ops: [
    {
      opNum: '0010', opType: 'sampling', opTypeName: '取样',
      workCenterName: 'QC 取样室',
      description: '按常规取样方案取样',
      samplingPlanName: 'SP-001 常规取样方案（n=20）',
      chars: []
    },
    {
      opNum: '0020', opType: 'inspection', opTypeName: '检验',
      workCenterName: 'QC 实验室',
      description: '理化指标检验',
      samplingPlanName: '',
      chars: [
        { micCode: '2001-MIC-001', micName: 'pH值', micType: 'quantitative', methodName: 'pH值测定法', lowerSpec: '5.0', upperSpec: '7.0', unit: '', defaultCode: '', codeGroup: '' },
        { micCode: '2001-MIC-002', micName: '水分含量', micType: 'quantitative', methodName: '水分测定法（卡尔费休法）', lowerSpec: '0', upperSpec: '3.0', unit: '%', defaultCode: '', codeGroup: '' },
        { micCode: '2001-MIC-003', micName: '外观', micType: 'qualitative', methodName: '目视检查法', lowerSpec: '', upperSpec: '', unit: '', defaultCode: '合格', codeGroup: 'CG001-外观缺陷' }
      ]
    },
    {
      opNum: '0030', opType: 'inspection', opTypeName: '检验',
      workCenterName: 'QC 实验室',
      description: '含量测定',
      samplingPlanName: '',
      chars: [
        { micCode: '2001-MIC-004', micName: '含量（主成分）', micType: 'quantitative', methodName: '高效液相色谱法测定含量', lowerSpec: '90.0', upperSpec: '110.0', unit: '%', defaultCode: '', codeGroup: '' }
      ]
    }
  ]
};
