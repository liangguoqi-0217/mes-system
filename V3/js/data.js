// ===== Mock Data =====
const equipmentData = [
  { id:'EQ001',code:'EQ-F001-001',name:'CNC加工中心',model:'DMG-MORI-NVX5000',manufacturer:'DMG MORI',serialNo:'SN-2024-001',type:'cnc',typeName:'CNC加工中心',location:'F001-L01-W01',locationName:'片剂生产线A-压片工位',workCenter:'WC001',workCenterName:'机械加工中心',status:'running',statusName:'运行中',power:'37 kW',cleanLevel:'C级',gmpClass:'关键设备',syncStatus:'synced',factoryDate:'2024-01-15',purchaseDate:'2023-12-20',warrantyEnd:'2026-12-20',leader:'张工',team:'维修一班',teamName:'维修一班',category:'生产设备',group:'机械加工设备',priority:'高',maintenanceStrategy:'月保养',voltage:'380V',capacity:'500kg',material:'铸铁/合金钢',envReq:'温度20-25°C, 湿度40-60%',assetNo:'AS-2024-001',disposalDate:null,disposalReason:null,disposalApprovalNo:null,disposalAttachment:null },
  { id:'EQ002',code:'EQ-F001-002',name:'注塑机',model:'HAITIAN-MA3200',manufacturer:'海天',serialNo:'SN-2024-002',type:'injection',typeName:'注塑机',location:'F001-L02-W01',locationName:'胶囊生产线B-填充工位',workCenter:'WC001',workCenterName:'机械加工中心',status:'running',statusName:'运行中',power:'55 kW',cleanLevel:'C级',gmpClass:'关键设备',syncStatus:'synced',factoryDate:'2024-02-20',purchaseDate:'2024-01-15',warrantyEnd:'2027-01-15',leader:'李工',team:'维修一班',teamName:'维修一班',category:'生产设备',group:'注塑设备',priority:'高',maintenanceStrategy:'月保养',voltage:'380V',capacity:'320吨',material:'铸铁/铝合金',envReq:'温度18-28°C, 湿度30-70%',assetNo:'AS-2024-002',disposalDate:null,disposalReason:null,disposalApprovalNo:null,disposalAttachment:null },
  { id:'EQ003',code:'EQ-F001-003',name:'空压机',model:'ATLAS-Copco-GA37',manufacturer:'阿特拉斯科普柯',serialNo:'SN-2024-003',type:'compressor',typeName:'空压机',location:'F001-L03-W01',locationName:'外包装线C-装箱工位',workCenter:'WC002',workCenterName:'电气维修中心',status:'standby',statusName:'待机',power:'37 kW',cleanLevel:'-',gmpClass:'一般设备',syncStatus:'pending',factoryDate:'2024-03-10',purchaseDate:'2024-02-28',warrantyEnd:'2027-02-28',leader:'王工',team:'维修二班',teamName:'维修二班',category:'动力设备',group:'压缩设备',priority:'中',maintenanceStrategy:'季度保养',voltage:'380V',capacity:'6.2m³/min',material:'铸铁/钢',envReq:'温度5-40°C',assetNo:'AS-2024-003',disposalDate:null,disposalReason:null,disposalApprovalNo:null,disposalAttachment:null },
  { id:'EQ004',code:'EQ-F001-004',name:'西门子系统',model:'SIEMENS S7-1500',manufacturer:'西门子',serialNo:'SN-2024-004',type:'siemens',typeName:'西门子系统',location:'F001-L01-W01',locationName:'片剂生产线A-压片工位',workCenter:'WC002',workCenterName:'电气维修中心',status:'running',statusName:'运行中',power:'5 kW',cleanLevel:'C级',gmpClass:'关键设备',syncStatus:'synced',factoryDate:'2024-01-05',purchaseDate:'2023-11-30',warrantyEnd:'2028-11-30',leader:'赵工',team:'维修二班',teamName:'维修二班',category:'控制设备',group:'PLC系统',priority:'高',maintenanceStrategy:'半年保养',voltage:'24V DC',capacity:'',material:'电子元件',envReq:'温度0-60°C',assetNo:'AS-2024-004',disposalDate:null,disposalReason:null,disposalApprovalNo:null,disposalAttachment:null },
  { id:'EQ005',code:'EQ-F001-005',name:'贴片机',model:'JUKI-JX-350',manufacturer:'JUKI',serialNo:'SN-2024-005',type:'juki',typeName:'贴片机',location:'F002-L01-W01',locationName:'合成车间-反应区',workCenter:'WC005',workCenterName:'机械加工中心',status:'fault',statusName:'故障',power:'12 kW',cleanLevel:'B级',gmpClass:'关键设备',syncStatus:'failed',factoryDate:'2024-04-01',purchaseDate:'2024-03-15',warrantyEnd:'2027-03-15',leader:'孙工',team:'维修四班',teamName:'维修四班',category:'生产设备',group:'贴片设备',priority:'高',maintenanceStrategy:'月保养',voltage:'220V',capacity:'35000CPH',material:'铝合金/电子元件',envReq:'温度20-25°C, 湿度30-60%, 洁净度Class 1000',assetNo:'AS-2024-005',disposalDate:null,disposalReason:null,disposalApprovalNo:null,disposalAttachment:null },
  { id:'EQ006',code:'EQ-F002-001',name:'反应釜',model:'ZF-5000L',manufacturer:'江苏正帆',serialNo:'SN-2024-006',type:'reactor',typeName:'反应釜',location:'F002-L01-W01',locationName:'合成车间-反应区',workCenter:'WC005',workCenterName:'机械加工中心',status:'maintenance',statusName:'维修中',power:'75 kW',cleanLevel:'A级',gmpClass:'关键设备',syncStatus:'synced',factoryDate:'2024-05-01',purchaseDate:'2024-04-15',warrantyEnd:'2027-04-15',leader:'周工',team:'仪表班',teamName:'仪表班',category:'生产设备',group:'反应设备',priority:'高',maintenanceStrategy:'季度保养',voltage:'380V',capacity:'5000L',material:'316L不锈钢',envReq:'温度-10-150°C, 洁净度Class 100',assetNo:'AS-2024-006',disposalDate:null,disposalReason:null,disposalApprovalNo:null,disposalAttachment:null },
  { id:'EQ007',code:'EQ-F003-001',name:'纯化水泵',model:'CRN-5-6',manufacturer:'格兰富',serialNo:'SN-2024-007',type:'pump',typeName:'水泵',location:'F003-L01',locationName:'原材料仓库',workCenter:'WC007',workCenterName:'仓储维修班',status:'running',statusName:'运行中',power:'4 kW',cleanLevel:'B级',gmpClass:'关键设备',syncStatus:'synced',factoryDate:'2024-06-01',purchaseDate:'2024-05-20',warrantyEnd:'2027-05-20',leader:'-',team:'仓储维修班',teamName:'仓储维修班',category:'动力设备',group:'输送设备',priority:'中',maintenanceStrategy:'季度保养',voltage:'380V',capacity:'5m³/h',material:'316L不锈钢',envReq:'温度5-40°C',assetNo:'AS-2024-007',disposalDate:null,disposalReason:null,disposalApprovalNo:null,disposalAttachment:null },
  { id:'EQ008',code:'EQ-F003-002',name:'叉车',model:'LINDE-H30',manufacturer:'林德',serialNo:'SN-2024-008',type:'forklift',typeName:'叉车',location:'F003-L02',locationName:'成品仓库',workCenter:'WC007',workCenterName:'仓储维修班',status:'running',statusName:'运行中',power:'22 kW',cleanLevel:'-',gmpClass:'一般设备',syncStatus:'synced',factoryDate:'2024-06-15',purchaseDate:'2024-06-01',warrantyEnd:'2027-06-01',leader:'-',team:'仓储维修班',teamName:'仓储维修班',category:'运输设备',group:'叉车',priority:'低',maintenanceStrategy:'半年保养',voltage:'48V',capacity:'3吨',material:'钢',envReq:'温度-10-50°C',assetNo:'AS-2024-008',disposalDate:null,disposalReason:null,disposalApprovalNo:null,disposalAttachment:null },
  { id:'EQ009',code:'EQ-F001-006',name:'包装机',model:'KHS-300',manufacturer:'KHS',serialNo:'SN-2024-009',type:'packaging',typeName:'包装机',location:'F001-L03-W01',locationName:'外包装线C-装箱工位',workCenter:'WC001',workCenterName:'机械加工中心',status:'running',statusName:'运行中',power:'15 kW',cleanLevel:'C级',gmpClass:'关键设备',syncStatus:'synced',factoryDate:'2024-07-01',purchaseDate:'2024-06-20',warrantyEnd:'2027-06-20',leader:'张工',team:'维修一班',teamName:'维修一班',category:'包装设备',group:'包装机',priority:'高',maintenanceStrategy:'月保养',voltage:'380V',capacity:'300件/分钟',material:'不锈钢/铝合金',envReq:'温度15-30°C, 湿度30-70%',assetNo:'AS-2024-009',disposalDate:null,disposalReason:null,disposalApprovalNo:null,disposalAttachment:null,
    qrCode: null, photos: [{ name: '设备外观照.png', dataUrl: 'images/equipment-photo.png', uploadTime: '2024-06-20 13:00:00' }] },
  { id:'EQ010',code:'EQ-F002-002',name:'离心机',model:'SIGMA-6K',manufacturer:'Sigma',serialNo:'SN-2024-010',type:'centrifuge',typeName:'离心机',location:'F002-L01-W01',locationName:'合成车间-反应区',workCenter:'WC006',workCenterName:'仪表班',status:'stopped',statusName:'停用',power:'45 kW',cleanLevel:'A级',gmpClass:'关键设备',syncStatus:'pending',factoryDate:'2024-08-01',purchaseDate:'2024-07-15',warrantyEnd:'2027-07-15',leader:'周工',team:'仪表班',teamName:'仪表班',category:'分离设备',group:'离心机',priority:'高',maintenanceStrategy:'季度保养',voltage:'380V',capacity:'6000rpm',material:'316L不锈钢',envReq:'温度0-40°C, 洁净度Class 100',assetNo:'AS-2024-010',disposalDate:null,disposalReason:null,disposalApprovalNo:null,disposalAttachment:null },
  { id:'EQ011',code:'EQ-F001-007',name:'混合机',model:'FRITSCH-P100',manufacturer:'Fritsch',serialNo:'SN-2024-011',type:'mixer',typeName:'混合机',location:'F001-L01-W01',locationName:'片剂生产线A-压片工位',workCenter:'WC001',workCenterName:'机械加工中心',status:'running',statusName:'运行中',power:'18.5 kW',cleanLevel:'C级',gmpClass:'关键设备',syncStatus:'synced',factoryDate:'2024-09-01',purchaseDate:'2024-08-15',warrantyEnd:'2027-08-15',leader:'张工',team:'维修一班',teamName:'维修一班',category:'混合设备',group:'混合机',priority:'中',maintenanceStrategy:'月保养',voltage:'380V',capacity:'100L',material:'不锈钢',envReq:'温度15-35°C',assetNo:'AS-2024-011',disposalDate:null,disposalReason:null,disposalApprovalNo:null,disposalAttachment:null },
  { id:'EQ012',code:'EQ-F001-008',name:'压片机',model:'FETTE-3090',manufacturer:'Fette',serialNo:'SN-2024-012',type:'tablet',typeName:'压片机',location:'F001-L01-W01',locationName:'片剂生产线A-压片工位',workCenter:'WC001',workCenterName:'机械加工中心',status:'running',statusName:'运行中',power:'22 kW',cleanLevel:'B级',gmpClass:'关键设备',syncStatus:'synced',factoryDate:'2024-10-01',purchaseDate:'2024-09-15',warrantyEnd:'2027-09-15',leader:'张工',team:'维修一班',teamName:'维修一班',category:'成型设备',group:'压片机',priority:'高',maintenanceStrategy:'周保养',voltage:'380V',capacity:'90000片/小时',material:'不锈钢',envReq:'温度18-25°C, 湿度40-60%, 洁净度Class 1000',assetNo:'AS-2024-012',disposalDate:null,disposalReason:null,disposalApprovalNo:null,disposalAttachment:null }
];

const eqStatusLogs = {
  'EQ001': [
    { time:'2024-06-20 14:30:00',status:'运行中',operator:'系统',description:'设备正常启动' },
    { time:'2024-06-19 18:00:00',status:'待机',operator:'张工',description:'生产任务完成' },
    { time:'2024-06-18 16:30:00',status:'维修中',operator:'李工',description:'定期保养维护' }
  ],
  'EQ005': [
    { time:'2024-06-20 10:15:00',status:'故障',operator:'孙工',description:'贴片头卡料' },
    { time:'2024-06-20 08:00:00',status:'运行中',operator:'孙工',description:'开始生产' }
  ],
  'EQ006': [
    { time:'2024-06-20 09:00:00',status:'维修中',operator:'周工',description:'更换密封件' }
  ]
};

const locationTreeData = {
  'F001':{id:'F001',name:'制剂工厂',type:'factory',parent:'',children:['F001-L01','F001-L02','F001-L03']},
  'F001-L01':{id:'F001-L01',name:'片剂生产线A',type:'line',parent:'F001',children:['F001-L01-W01']},
  'F001-L01-W01':{id:'F001-L01-W01',name:'压片工位',type:'workstation',parent:'F001-L01',children:[]},
  'F001-L02':{id:'F001-L02',name:'胶囊生产线B',type:'line',parent:'F001',children:['F001-L02-W01']},
  'F001-L02-W01':{id:'F001-L02-W01',name:'填充工位',type:'workstation',parent:'F001-L02',children:[]},
  'F001-L03':{id:'F001-L03',name:'外包装线C',type:'line',parent:'F001',children:['F001-L03-W01']},
  'F001-L03-W01':{id:'F001-L03-W01',name:'装箱工位',type:'workstation',parent:'F001-L03',children:[]},
  'F002':{id:'F002',name:'原料药工厂',type:'factory',parent:'',children:['F002-L01']},
  'F002-L01':{id:'F002-L01',name:'合成车间',type:'line',parent:'F002',children:['F002-L01-W01']},
  'F002-L01-W01':{id:'F002-L01-W01',name:'反应区',type:'workstation',parent:'F002-L01',children:[]},
  'F003':{id:'F003',name:'仓储中心',type:'factory',parent:'',children:['F003-L01','F003-L02']},
  'F003-L01':{id:'F003-L01',name:'原材料仓库',type:'line',parent:'F003',children:[]},
  'F003-L02':{id:'F003-L02',name:'成品仓库',type:'line',parent:'F003',children:[]}
};

const locationData = {
  'F001':{id:'F001',name:'制剂工厂',type:'factory',description:'主要生产固体制剂和液体制剂'},
  'F001-L01':{id:'F001-L01',name:'片剂生产线A',type:'line',description:'负责片剂产品的生产'},
  'F001-L01-W01':{id:'F001-L01-W01',name:'压片工位',type:'workstation',description:'片剂压片操作工位'},
  'F001-L02':{id:'F001-L02',name:'胶囊生产线B',type:'line',description:'负责胶囊产品的生产'},
  'F001-L02-W01':{id:'F001-L02-W01',name:'填充工位',type:'workstation',description:'胶囊填充操作工位'},
  'F001-L03':{id:'F001-L03',name:'外包装线C',type:'line',description:'负责产品外包装'},
  'F001-L03-W01':{id:'F001-L03-W01',name:'装箱工位',type:'workstation',description:'产品装箱操作工位'},
  'F002':{id:'F002',name:'原料药工厂',type:'factory',description:'主要生产原料药'},
  'F002-L01':{id:'F002-L01',name:'合成车间',type:'line',description:'原料药合成生产区'},
  'F002-L01-W01':{id:'F002-L01-W01',name:'反应区',type:'workstation',description:'化学反应操作区'},
  'F003':{id:'F003',name:'仓储中心',type:'factory',description:'原材料和成品仓储'},
  'F003-L01':{id:'F003-L01',name:'原材料仓库',type:'line',description:'存放生产原材料'},
  'F003-L02':{id:'F003-L02',name:'成品仓库',type:'line',description:'存放成品'}
};

const FL_FACTORIES = [
  { code:'1000', name:'山东步长制药工厂' },
  { code:'2001', name:'陕西步长制药工厂' },
  { code:'2002', name:'山东丹红制药工厂' },
  { code:'2003', name:'山东神州制药工厂' },
  { code:'2004', name:'山东康爱制药工厂' },
  { code:'2005', name:'通化谷红制药工厂' },
  { code:'2006', name:'吉林天成制药工厂' },
  { code:'2007', name:'通化天实制药工厂' },
  { code:'2008', name:'梅河口步长制药工厂' },
  { code:'2009', name:'辽宁奥达制药工厂' },
  { code:'2010', name:'保定天浩制药工厂' },
  { code:'2011', name:'邛崃天银制药工厂' },
  { code:'2012', name:'陕西步长高新制药工厂' },
  { code:'2013', name:'杨凌步长制药工厂' }
];

const flMockData = { tree: [
  { id:'FL1000',code:'FL1000',name:'山东步长制药工厂',parentId:null,factory:'1000 - 山东步长制药工厂',type:'plant',status:'active',level:1,equipmentCount:0,syncStatus:'synced',description:'固体制剂、液体制剂生产厂区',createTime:'2024-01-01 08:00:00',updateTime:'2024-01-01 08:00:00',category:'production',validFrom:'2024-01-01',validTo:'2026-12-31',costCenter:'CC-1000',plannerGroup:'general',allowInstall:true,address:'山东省济南市高新区新泷大街888号',document:'工厂总平面图/DWG; SOP/SOP-001-工厂安全管理规程.docx',locationA:'主厂区1号地块',locationB:'北区',locationC:'靠近园区主干道',children:[
    { id:'FL1000-W01',code:'FL1000-W01',name:'固体制剂车间',parentId:'FL1000',factory:'1000 - 山东步长制药工厂',type:'workshop',status:'active',level:2,equipmentCount:5,syncStatus:'synced',description:'固体制剂生产车间（压片、包衣、包装）',createTime:'2024-01-02 09:00:00',updateTime:'2024-03-15 14:30:00',category:'production',validFrom:'2024-01-02',validTo:'2026-12-31',costCenter:'CC-1000-W01',plannerGroup:'mechanical',allowInstall:true,address:'固体制剂车间1层东侧',document:'车间布局图_v2.1.pdf; SOP/SOP-002-固体制剂操作规程.docx',locationA:'主厂房1楼',locationB:'东区',locationC:'靠近货梯及物料通道',children:[
      { id:'FL1000-W01-L01',code:'FL1000-W01-L01',name:'片剂生产线A',parentId:'FL1000-W01',factory:'1000 - 山东步长制药工厂',type:'production_line',status:'active',level:3,equipmentCount:3,syncStatus:'synced',description:'片剂生产线A区',createTime:'2024-01-03 10:00:00',updateTime:'2024-05-20 16:45:00',category:'production',validFrom:'2024-01-03',validTo:'2026-12-31',costCenter:'CC-1000-W01-L01',plannerGroup:'mechanical',allowInstall:true,address:'固体制剂车间1层东侧A区',document:'生产线布局图_V3.pdf; SOP/SOP-003-压片工艺规程.docx',locationA:'主厂房1楼东区',locationB:'A线区域',locationC:'靠近参观走廊',children:[
        { id:'FL1000-W01-L01-S01',code:'FL1000-W01-L01-S01',name:'压片工位',parentId:'FL1000-W01-L01',factory:'1000 - 山东步长制药工厂',type:'workstation',status:'active',level:4,equipmentCount:1,syncStatus:'synced',description:'压片机安装位置',createTime:'2024-01-04 11:00:00',updateTime:'2024-01-04 11:00:00',category:'production',validFrom:'2024-01-04',validTo:'2026-12-31',costCenter:'CC-1000-W01-L01-S01',plannerGroup:'mechanical',allowInstall:false,address:'固体制剂车间1层东侧A区工位01',document:'压片机技术图纸.pdf',locationA:'主厂房1楼',locationB:'东区A线',locationC:'1号压片间',children:[] },
        { id:'FL1000-W01-L01-S02',code:'FL1000-W01-L01-S02',name:'包衣工位',parentId:'FL1000-W01-L01',factory:'1000 - 山东步长制药工厂',type:'workstation',status:'active',level:4,equipmentCount:1,syncStatus:'pending',description:'包衣机安装位置',createTime:'2024-01-04 11:30:00',updateTime:'2024-06-10 09:20:00',category:'production',validFrom:'2024-01-04',validTo:'2026-12-31',costCenter:'CC-1000-W01-L01-S02',plannerGroup:'mechanical',allowInstall:true,address:'固体制剂车间1层东侧A区工位02',document:'包衣机操作SOP/SOP-004.docx; 包衣技术图纸.pdf',locationA:'主厂房1楼',locationB:'东区A线',locationC:'包衣间B区',children:[] },
        { id:'FL1000-W01-L01-S03',code:'FL1000-W01-L01-S03',name:'包装工位',parentId:'FL1000-W01-L01',factory:'1000 - 山东步长制药工厂',type:'workstation',status:'disabled',level:4,equipmentCount:1,syncStatus:'synced',description:'包装机安装位置',createTime:'2024-01-04 12:00:00',updateTime:'2024-06-15 10:00:00',category:'production',validFrom:'2024-01-04',validTo:'2026-12-31',costCenter:'CC-1000-W01-L01-S03',plannerGroup:'general',allowInstall:false,address:'固体制剂车间1层东侧A区工位03',document:'包装机技术图纸.pdf; SOP/SOP-005-内包操作规程.docx',locationA:'主厂房1楼',locationB:'东区A线',locationC:'内包装间',children:[] }
      ]},
      { id:'FL1000-W01-L02',code:'FL1000-W01-L02',name:'胶囊生产线B',parentId:'FL1000-W01',factory:'1000 - 山东步长制药工厂',type:'production_line',status:'active',level:3,equipmentCount:2,syncStatus:'synced',description:'胶囊生产线B区',createTime:'2024-01-05 14:00:00',updateTime:'2024-04-20 15:30:00',category:'production',validFrom:'2024-01-05',validTo:'2026-12-31',costCenter:'CC-1000-W01-L02',plannerGroup:'general',allowInstall:true,address:'固体制剂车间1层西侧B区',document:'胶囊生产线布局图.pdf; SOP/SOP-006-胶囊填充规程.docx',locationA:'主厂房1楼',locationB:'西区B线',locationC:'靠近中间仓',children:[] }
    ]},
    { id:'FL1000-W02',code:'FL1000-W02',name:'液体制剂车间',parentId:'FL1000',factory:'1000 - 山东步长制药工厂',type:'workshop',status:'active',level:2,equipmentCount:3,syncStatus:'synced',description:'液体制剂生产车间（口服液/糖浆）',createTime:'2024-01-06 10:00:00',updateTime:'2024-02-28 11:15:00',category:'production',validFrom:'2024-01-06',validTo:'2026-12-31',costCenter:'CC-1000-W02',plannerGroup:'electrical',allowInstall:true,address:'液体制剂车间2层',document:'口服液车间布局图_V4.pdf; SOP/SOP-007-液体灌装规程.docx',locationA:'主厂房2楼',locationB:'南区',locationC:'靠近纯化水站',children:[] },
    { id:'FL1000-A01',code:'FL1000-A01',name:'公用工程区',parentId:'FL1000',factory:'1000 - 山东步长制药工厂',type:'auxiliary',status:'active',level:2,equipmentCount:4,syncStatus:'synced',description:'空调净化、压缩空气、纯水系统区域',createTime:'2024-01-07 08:00:00',updateTime:'2024-01-07 08:00:00',category:'building',validFrom:'2024-01-07',validTo:'2026-12-31',costCenter:'CC-1000-A01',plannerGroup:'general',allowInstall:false,address:'公用工程车间1层',document:'公用工程系统图.pdf; SOP/SOP-008-空调净化系统规程.docx',locationA:'主厂房1楼',locationB:'西南角',locationC:'独立辅助区域',children:[] }
  ]},
  { id:'FL2001',code:'FL2001',name:'陕西步长制药工厂',parentId:null,factory:'2001 - 陕西步长制药工厂',type:'plant',status:'active',level:1,equipmentCount:0,syncStatus:'synced',description:'原料药及中间体生产厂区',createTime:'2024-02-01 08:00:00',updateTime:'2024-02-01 08:00:00',category:'production',validFrom:'2024-02-01',validTo:'2026-12-31',costCenter:'CC-2001',plannerGroup:'mechanical',allowInstall:true,address:'陕西省西安市高新区锦业路66号',document:'工厂总平面图/DWG; SOP/SOP-009-发酵车间安全规程.docx',locationA:'厂区1号地块',locationB:'东侧',locationC:'靠近污水处理站',children:[
    { id:'FL2001-W01',code:'FL2001-W01',name:'发酵车间',parentId:'FL2001',factory:'2001 - 陕西步长制药工厂',type:'workshop',status:'active',level:2,equipmentCount:6,syncStatus:'synced',description:'发酵罐及配液系统车间',createTime:'2024-02-02 09:00:00',updateTime:'2024-05-10 14:20:00',category:'production',validFrom:'2024-02-02',validTo:'2026-12-31',costCenter:'CC-2001-W01',plannerGroup:'mechanical',allowInstall:true,address:'发酵车间1层',document:'发酵罐安装图.pdf; SOP/SOP-010-发酵工艺规程.docx',locationA:'主厂房1楼',locationB:'东区',locationC:'靠近配料区',children:[] },
    { id:'FL2001-W02',code:'FL2001-W02',name:'提取车间',parentId:'FL2001',factory:'2001 - 陕西步长制药工厂',type:'workshop',status:'invalid',level:2,equipmentCount:0,syncStatus:'failed',description:'已拆除，永久作废',createTime:'2024-02-03 10:00:00',updateTime:'2024-06-01 16:00:00',category:'technical',validFrom:'2024-02-03',validTo:'2025-12-31',costCenter:'CC-2001-W02',plannerGroup:'instrument',allowInstall:false,address:'提取车间已拆除',document:'-',locationA:'-',locationB:'-',locationC:'已拆除区域',children:[] }
  ]},
  { id:'FL2002',code:'FL2002',name:'山东丹红制药工厂',parentId:null,factory:'2002 - 山东丹红制药工厂',type:'plant',status:'active',level:1,equipmentCount:0,syncStatus:'synced',description:'注射剂及大输液生产厂区',createTime:'2024-03-01 08:00:00',updateTime:'2024-03-01 08:00:00',category:'production',validFrom:'2024-03-01',validTo:'2026-12-31',costCenter:'CC-2002',plannerGroup:'electrical',allowInstall:false,address:'山东省菏泽市开发区中华路100号',document:'工厂总平面图/DWG; SOP/SOP-011-注射剂洁净区管理规程.docx',locationA:'厂区1号地块',locationB:'北侧',locationC:'靠近动力中心',children:[
    { id:'FL2002-W01',code:'FL2002-W01',name:'注射剂车间',parentId:'FL2002',factory:'2002 - 山东丹红制药工厂',type:'workshop',status:'active',level:2,equipmentCount:4,syncStatus:'synced',description:'小容量注射剂生产线',createTime:'2024-03-10 09:00:00',updateTime:'2024-06-15 11:00:00',category:'production',validFrom:'2024-03-10',validTo:'2026-12-31',costCenter:'CC-2002-W01',plannerGroup:'electrical',allowInstall:true,address:'注射剂车间2层洁净区',document:'洁净区平面图.pdf; SOP/SOP-012-无菌灌装规程.docx',locationA:'主厂房2楼',locationB:'B级洁净区',locationC:'靠近更衣室',children:[] }
  ]}
]};

const flLogs = {
  'FL1000-W01-L01-S02': [
    { action:'新增',time:'2024-01-04 11:30:00',user:'系统管理员',content:'新增功能位置：编码=FL1000-W01-L01-S02' },
    { action:'编辑',time:'2024-06-10 09:20:00',user:'设备管理员',content:'修改位置描述' }
  ],
  'FL1000-W01-L01-S03': [
    { action:'新增',time:'2024-01-04 12:00:00',user:'系统管理员',content:'新增功能位置' },
    { action:'状态变更',time:'2024-06-15 10:00:00',user:'设备管理员',content:'正常启用 → 临时停用' }
  ]
};

const wcMockData = [
  { id:'WC001',code:'WC-1000-001',name:'维修一班',factory:'1000',factoryName:'1000 - 山东步长制药工厂',type:'internal',typeName:'内部班组',specialty:'mechanical',specialtyName:'机械维修',status:'active',statusName:'正常启用',leader:'张建国',phone:'13800138000',capacity:8,shift:3,staffCount:8 },
  { id:'WC002',code:'WC-1000-002',name:'维修二班',factory:'1000',factoryName:'1000 - 山东步长制药工厂',type:'internal',typeName:'内部班组',specialty:'electrical',specialtyName:'电气维修',status:'active',statusName:'正常启用',leader:'李君',phone:'13800138001',capacity:6,shift:2,staffCount:6 },
  { id:'WC003',code:'WC-1000-003',name:'设备保全组',factory:'1000',factoryName:'1000 - 山东步长制药工厂',type:'internal',typeName:'内部班组',specialty:'general',specialtyName:'综合维修',status:'active',statusName:'正常启用',leader:'王海涛',phone:'13800138002',capacity:4,shift:1,staffCount:4 },
  { id:'WC004',code:'WC-1000-004',name:'维修三班',factory:'1000',factoryName:'1000 - 山东步长制药工厂',type:'internal',typeName:'内部班组',specialty:'instrument',specialtyName:'仪表维修',status:'disabled',statusName:'临时停用',leader:'赵雪梅',phone:'13800138003',capacity:5,shift:2,staffCount:5 },
  { id:'OUT001',code:'OUT-1000-001',name:'外包服务商A（暖通）',factory:'1000',factoryName:'1000 - 山东步长制药工厂',type:'outsourced',typeName:'外包服务商',specialty:'hvac',specialtyName:'暖通空调',status:'active',statusName:'正常启用',leader:'刘经理',phone:'13800138004',capacity:10,shift:3,staffCount:15 },
  { id:'WC005',code:'WC-2001-001',name:'维修四班',factory:'2001',factoryName:'2001 - 陕西步长制药工厂',type:'internal',typeName:'内部班组',specialty:'mechanical',specialtyName:'机械维修',status:'active',statusName:'正常启用',leader:'陈永刚',phone:'13800138005',capacity:7,shift:3,staffCount:7 },
  { id:'WC006',code:'WC-2001-002',name:'仪表班',factory:'2001',factoryName:'2001 - 陕西步长制药工厂',type:'internal',typeName:'内部班组',specialty:'instrument',specialtyName:'仪表维修',status:'active',statusName:'正常启用',leader:'刘志强',phone:'13800138006',capacity:5,shift:2,staffCount:5 },
  { id:'WC007',code:'WC-2002-001',name:'注射剂车间维修班',factory:'2002',factoryName:'2002 - 山东丹红制药工厂',type:'internal',typeName:'内部班组',specialty:'general',specialtyName:'综合维修',status:'active',statusName:'正常启用',leader:'周工',phone:'13800138007',capacity:6,shift:2,staffCount:5 }
];

const wcOrgTree = [
  { id:'FL1000',name:'1000 - 山东步长制药工厂',type:'factory',children:[
    { id:'FL1000-W01',name:'固体制剂车间',type:'workshop',children:[
      { id:'WC001',name:'维修一班',type:'workcenter' },{ id:'WC002',name:'维修二班',type:'workcenter' },
      { id:'WC003',name:'设备保全组',type:'workcenter' },{ id:'WC004',name:'维修三班',type:'workcenter' }
    ]},
    { id:'FL1000-W02',name:'液体制剂车间',type:'workshop',children:[{ id:'OUT001',name:'外包服务商A（暖通）',type:'workcenter' }] }
  ]},
  { id:'FL2001',name:'2001 - 陕西步长制药工厂',type:'factory',children:[
    { id:'FL2001-W01',name:'发酵车间',type:'workshop',children:[{ id:'WC005',name:'维修四班',type:'workcenter' },{ id:'WC006',name:'仪表班',type:'workcenter' }] }
  ]},
  { id:'FL2002',name:'2002 - 山东丹红制药工厂',type:'factory',children:[{ id:'FL2002-W01',name:'注射剂车间',type:'workshop',children:[{ id:'WC007',name:'注射剂车间维修班',type:'workcenter' }] }]}
];

const bomListData = [
  { id:'BOM001',eqCode:'P-001',eqName:'纯化水泵（316L）',version:'V1.0',status:'published',creator:'张工',createTime:'2024-01-15 10:00:00',syncTime:'2024-06-20 14:30:00',syncStatus:'synced' },
  { id:'BOM002',eqCode:'EQ001',eqName:'CNC加工中心',version:'V2.0',status:'published',creator:'李工',createTime:'2024-02-20 09:00:00',syncTime:'2024-06-18 16:00:00',syncStatus:'synced' },
  { id:'BOM003',eqCode:'EQ002',eqName:'注塑机',version:'V1.1',status:'draft',creator:'王工',createTime:'2024-03-10 11:00:00',syncTime:'-',syncStatus:'pending' },
  { id:'BOM004',eqCode:'EQ003',eqName:'空压机',version:'V1.0',status:'published',creator:'赵工',createTime:'2024-01-20 08:30:00',syncTime:'2024-06-15 10:00:00',syncStatus:'synced' },
  { id:'BOM005',eqCode:'EQ004',eqName:'输送带系统',version:'V1.0',status:'published',creator:'孙工',createTime:'2024-02-28 14:00:00',syncTime:'2024-06-10 09:30:00',syncStatus:'synced' },
  { id:'BOM006',eqCode:'EQ005',eqName:'贴片机',version:'V1.0',status:'cancelled',creator:'周工',createTime:'2024-04-01 10:00:00',syncTime:'-',syncStatus:'failed' }
];

const bomDetailData = {
  'BOM001':{eqCode:'P-001',eqName:'纯化水泵（316L）',version:'V1.0',status:'published',items:[
    { id:'BOM001-001',parentId:null,level:0,code:'EQP-P-001',name:'纯化水泵总成',unit:'台',qty:1,supplier:'上海泵业',remark:'' },
    { id:'BOM001-002',parentId:'BOM001-001',level:1,code:'ASSY-P-001-01',name:'316L泵体总成',unit:'套',qty:1,supplier:'上海泵业',remark:'316L不锈钢' },
    { id:'BOM001-003',parentId:'BOM001-001',level:1,code:'ASSY-P-001-02',name:'5.5kW电机总成',unit:'套',qty:1,supplier:'西门子',remark:'Y2-132S1-2' },
    { id:'BOM001-004',parentId:'BOM001-001',level:1,code:'ASSY-P-001-03',name:'机械密封总成',unit:'套',qty:1,supplier:'约翰克兰',remark:'MG1-80' },
    { id:'BOM001-005',parentId:'BOM001-001',level:1,code:'ASSY-P-001-04',name:'不锈钢底座',unit:'件',qty:1,supplier:'上海泵业',remark:'碳钢喷塑' },
    { id:'BOM001-006',parentId:'BOM001-001',level:1,code:'ASSY-P-001-05',name:'叶轮组件',unit:'套',qty:1,supplier:'浙江叶轮厂',remark:'' },
    { id:'BOM001-007',parentId:'BOM001-001',level:1,code:'ASSY-P-001-06',name:'进出口法兰',unit:'套',qty:2,supplier:'温州法兰厂',remark:'DN80 PN16' }
  ]},
  'BOM002':{eqCode:'EQ001',eqName:'CNC加工中心',version:'V2.0',status:'published',items:[
    { id:'BOM002-001',parentId:null,level:0,code:'EQP-EQ001',name:'CNC加工中心总成',unit:'台',qty:1,supplier:'DMG MORI',remark:'' },
    { id:'BOM002-002',parentId:'BOM002-001',level:1,code:'ASSY-EQ001-01',name:'主轴组件',unit:'套',qty:1,supplier:'NSK',remark:'BT40' },
    { id:'BOM002-003',parentId:'BOM002-001',level:1,code:'ASSY-EQ001-02',name:'刀库组件',unit:'套',qty:1,supplier:'HAAS',remark:'24T' },
    { id:'BOM002-004',parentId:'BOM002-001',level:1,code:'ASSY-EQ001-03',name:'工作台',unit:'件',qty:1,supplier:'DMG MORI',remark:'800x500mm' },
    { id:'BOM002-005',parentId:'BOM002-001',level:1,code:'ASSY-EQ001-04',name:'冷却系统',unit:'套',qty:1,supplier:'大金',remark:'' },
    { id:'BOM002-006',parentId:'BOM002-001',level:1,code:'ASSY-EQ001-05',name:'伺服驱动',unit:'套',qty:3,supplier:'FANUC',remark:'αi系列' }
  ]}
};

const bomLogs = {
  'BOM001': [
    { version:'V1.0',action:'发布',time:'2024-01-15 10:00:00',user:'张工',content:'BOM版本V1.0发布' },
    { version:'V1.0',action:'编辑',time:'2024-03-20 14:30:00',user:'李工',content:'修改物料数量' },
    { version:'V1.0',action:'同步',time:'2024-06-20 14:30:00',user:'系统',content:'SAP同步成功' }
  ],
  'BOM002': [
    { version:'V1.0',action:'发布',time:'2024-02-20 09:00:00',user:'李工',content:'BOM版本V1.0发布' },
    { version:'V2.0',action:'发布',time:'2024-04-15 11:00:00',user:'李工',content:'升级至V2.0' }
  ]
};

const eqTypeOptions = [
  { value:'cnc',label:'CNC加工中心' },{ value:'injection',label:'注塑机' },
  { value:'compressor',label:'空压机' },{ value:'siemens',label:'西门子系统' },
  { value:'juki',label:'贴片机' },{ value:'reactor',label:'反应釜' }
];

const eqStatusOptions = [
  { value:'running',label:'运行中',cls:'badge-green' },
  { value:'standby',label:'待机',cls:'badge-blue' },
  { value:'fault',label:'故障',cls:'badge-red' },
  { value:'maintenance',label:'维修中',cls:'badge-yellow' },
  { value:'stopped',label:'停用',cls:'badge-gray' },
  { value:'scrapped',label:'报废',cls:'badge-gray' }
];

// ===== 设备安装/移交 单据数据 =====
const installDocsData = [
  {
    id:'INST001',docNo:'YS-2024-00001',docType:'new_equipment',docTypeName:'新设备验收',
    status:'completed',statusName:'已完成',
    eqCode:'EQ-F001-001',eqName:'CNC加工中心',model:'DMG-MORI-NVX5000',serialNo:'SN-2024-001',factoryNo:'FNO-2024-001',
    factoryDate:'2024-01-15',arriveDate:'2024-07-15',planCompleteDate:'2024-07-30',
    handler:'张工',handlerDept:'设备管理部',
    purchaseReqNo:'PR-2024-00123',purchaseOrderNo:'PO-2024-00456',supplier:'DMG MORI',contractNo:'CT-2024-DMG-01',arriveQty:1,
    packageCheck:'合格',packageCheckNote:'',appearanceCheck:'合格',appearanceCheckNote:'',
    partsCheck:'齐全',partsCheckNote:'对照BOM清单清点，所有配件齐全',techParamRated:'37 kW',techParamActual:'37.2 kW',techParamConclusion:'符合技术协议要求',
    acceptConclusion:'验收合格',acceptor:'李工',acceptDate:'2024-07-20',acceptOpinion:'设备外观完好、配件齐全，技术参数符合技术协议，同意验收。',
    installLocation:'F001-L01-W01',installLocationName:'片剂生产线A-压片工位',workCenter:'WC001',workCenterName:'机械加工中心',
    installProvider:'DMG MORI技术服务',installTeam:'维修一班',
    debugContent:'1.设备定位安装\n2.电气接线与联调\n3.主轴精度校准\n4.刀库换刀测试\n5.试切削验证',
    debugResult:'合格',trialDuration:'48小时',trialStatus:'正常',
    installCompleteDate:'2024-07-28',debugPerson:'王工',
    recvDept:'生产一部',recvPerson:'王主任',recvPhone:'13800138001',assetOwner:'生产一部',assetNo:'AS-F001-2024-001',
    handoverNote:'设备安装调试完成，各功能运行正常，移交生产部门正式投用。',handoverOpinion:'同意接收',
    remarks:'',attachments:[],createdBy:'张工',createdAt:'2024-07-15 09:00:00',updatedAt:'2024-07-28 16:00:00'
  },
  {
    id:'INST002',docNo:'YS-2024-00002',docType:'new_equipment',docTypeName:'新设备验收',
    status:'completed',statusName:'已完成',
    eqCode:'EQ-F001-006',eqName:'包装机',model:'KHS-300',serialNo:'SN-2024-009',factoryNo:'FNO-2024-009',
    factoryDate:'2024-07-01',arriveDate:'2024-08-10',planCompleteDate:'2024-08-25',
    handler:'刘工',handlerDept:'设备管理部',
    purchaseReqNo:'PR-2024-00145',purchaseOrderNo:'PO-2024-00512',supplier:'KHS',contractNo:'CT-2024-KHS-02',arriveQty:1,
    packageCheck:'合格',packageCheckNote:'',appearanceCheck:'合格',appearanceCheckNote:'',
    partsCheck:'齐全',partsCheckNote:'BOM配件清点完成',techParamRated:'15 kW',techParamActual:'15.1 kW',techParamConclusion:'合格',
    acceptConclusion:'验收合格',acceptor:'李工',acceptDate:'2024-08-15',acceptOpinion:'设备合格，可进入安装调试阶段。',
    installLocation:'F001-L03-W01',installLocationName:'外包装线C-装箱工位',workCenter:'WC001',workCenterName:'机械加工中心',
    installProvider:'KHS技术服务',installTeam:'维修一班',
    debugContent:'1.包装机安装定位\n2.气动与电气连接\n3.包装速度调试\n4.封口质量验证',
    debugResult:'合格',trialDuration:'36小时',trialStatus:'正常',
    installCompleteDate:'2024-08-23',debugPerson:'张工',
    recvDept:'生产一部',recvPerson:'赵班长',recvPhone:'13800138003',assetOwner:'生产一部',assetNo:'AS-F001-2024-006',
    handoverNote:'包装机调试完成，包装质量符合要求。',handoverOpinion:'同意接收',
    remarks:'',attachments:[],createdBy:'刘工',createdAt:'2024-08-10 08:30:00',updatedAt:'2024-08-23 15:00:00'
  },
  {
    id:'INST003',docNo:'YS-2024-00003',docType:'new_equipment',docTypeName:'新设备验收',
    status:'pending_handover',statusName:'待移交',
    eqCode:'EQ-F001-008',eqName:'压片机',model:'FETTE-3090',serialNo:'SN-2024-012',factoryNo:'FNO-2024-012',
    factoryDate:'2024-10-01',arriveDate:'2024-10-20',planCompleteDate:'2024-11-05',
    handler:'张工',handlerDept:'设备管理部',
    purchaseReqNo:'PR-2024-01001',purchaseOrderNo:'PO-2024-01012',supplier:'Fette',contractNo:'CT-2024-FET-05',arriveQty:1,
    packageCheck:'合格',packageCheckNote:'',appearanceCheck:'合格',appearanceCheckNote:'',
    partsCheck:'齐全',partsCheckNote:'对照BOM清单+随机工具手册齐全',techParamRated:'22 kW',techParamActual:'21.8 kW',techParamConclusion:'符合技术协议',
    acceptConclusion:'验收合格',acceptor:'李工',acceptDate:'2024-10-28',acceptOpinion:'设备及配件完整，技术参数达标。',
    installLocation:'F001-L01-W01',installLocationName:'片剂生产线A-压片工位',workCenter:'WC001',workCenterName:'机械加工中心',
    installProvider:'Fette中国',installTeam:'维修一班',
    debugContent:'1.压片机安装定位\n2.电气液压联调\n3.压片模具安装\n4.试压片验证（3批次）',
    debugResult:'合格',trialDuration:'72小时',trialStatus:'正常',
    installCompleteDate:'2024-11-03',debugPerson:'张工',
    recvDept:'生产一部',recvPerson:'王主任',recvPhone:'13800138001',assetOwner:'生产一部',assetNo:'AS-F001-2024-012',
    handoverNote:'',handoverOpinion:'',
    remarks:'等待车间负责人确认接收签字',attachments:[],createdBy:'张工',createdAt:'2024-10-20 10:00:00',updatedAt:'2024-11-03 15:30:00'
  },
  {
    id:'INST004',docNo:'YS-2024-00004',docType:'new_equipment',docTypeName:'新设备验收',
    status:'pending_accept',statusName:'待验收',
    eqCode:'EQ-F002-002',eqName:'离心机',model:'SIGMA-6K',serialNo:'SN-2024-014',factoryNo:'FNO-2024-014',
    factoryDate:'2024-11-01',arriveDate:'2024-11-12',planCompleteDate:'2024-11-30',
    handler:'周工',handlerDept:'设备管理部',
    purchaseReqNo:'PR-2024-01105',purchaseOrderNo:'PO-2024-01121',supplier:'Sigma',contractNo:'CT-2024-SIG-03',arriveQty:1,
    packageCheck:'',packageCheckNote:'',appearanceCheck:'',appearanceCheckNote:'',
    partsCheck:'',partsCheckNote:'',techParamRated:'45 kW',techParamActual:'',techParamConclusion:'',
    acceptConclusion:'',acceptor:'',acceptDate:'',acceptOpinion:'',
    installLocation:'F002-L01-W01',installLocationName:'合成车间-反应区',workCenter:'WC006',workCenterName:'仪表班',
    installProvider:'',installTeam:'仪表班',
    debugContent:'',debugResult:'',trialDuration:'',trialStatus:'',
    installCompleteDate:'',debugPerson:'',
    recvDept:'原料药车间',recvPerson:'刘主任',recvPhone:'13800138002',assetOwner:'原料药车间',assetNo:'',
    handoverNote:'',handoverOpinion:'',
    remarks:'设备已到货，待安排开箱验收',attachments:[],createdBy:'周工',createdAt:'2024-11-12 14:00:00',updatedAt:'2024-11-12 14:00:00'
  },
  {
    id:'INST005',docNo:'YS-2024-00005',docType:'spare_equipment',docTypeName:'备件设备验收',
    status:'accept_rejected',statusName:'验收驳回',
    eqCode:'',eqName:'搅拌电机备用',model:'Y2-200L-4',serialNo:'SN-2024-078',factoryNo:'FNO-2024-078',
    factoryDate:'2024-09-01',arriveDate:'2024-09-20',planCompleteDate:'2024-09-30',
    handler:'孙工',handlerDept:'设备管理部',
    purchaseReqNo:'PR-2024-00890',purchaseOrderNo:'PO-2024-00905',supplier:'南阳防爆',contractNo:'CT-2024-NY-07',arriveQty:1,
    packageCheck:'不合格',packageCheckNote:'外包装有撞击痕迹，木箱一角破损',
    appearanceCheck:'不合格',appearanceCheckNote:'电机外壳有轻微划痕，接线盒盖变形',
    partsCheck:'待确认',partsCheckNote:'随机缺少地脚螺栓4颗',techParamRated:'30 kW',techParamActual:'',techParamConclusion:'',
    acceptConclusion:'验收不合格',acceptor:'赵工',acceptDate:'2024-09-22',acceptOpinion:'外观损伤及配件缺失，建议退回厂家更换或整改后复检',
    installLocation:'',installLocationName:'',workCenter:'',workCenterName:'',
    installProvider:'',installTeam:'',
    debugContent:'',debugResult:'',trialDuration:'',trialStatus:'',
    installCompleteDate:'',debugPerson:'',
    recvDept:'',recvPerson:'',recvPhone:'',assetOwner:'',assetNo:'',
    handoverNote:'',handoverOpinion:'',
    remarks:'已联系供应商要求更换，等待回复。质量QA要求保留偏差记录。',attachments:[],createdBy:'孙工',createdAt:'2024-09-20 11:00:00',updatedAt:'2024-09-22 16:00:00'
  },
  {
    id:'INST006',docNo:'YS-2024-00006',docType:'new_equipment',docTypeName:'新设备验收',
    status:'draft',statusName:'草稿',
    eqCode:'',eqName:'冻干机',model:'LYO-20S',serialNo:'',factoryNo:'',
    factoryDate:'',arriveDate:'2024-12-01',planCompleteDate:'2024-12-25',
    handler:'张工',handlerDept:'设备管理部',
    purchaseReqNo:'PR-2024-01201',purchaseOrderNo:'PO-2024-01230',supplier:'东富龙',contractNo:'CT-2024-DFL-10',arriveQty:2,
    packageCheck:'',packageCheckNote:'',appearanceCheck:'',appearanceCheckNote:'',
    partsCheck:'',partsCheckNote:'',techParamRated:'20 kW',techParamActual:'',techParamConclusion:'',
    acceptConclusion:'',acceptor:'',acceptDate:'',acceptOpinion:'',
    installLocation:'',installLocationName:'',workCenter:'',workCenterName:'',
    installProvider:'',installTeam:'',
    debugContent:'',debugResult:'',trialDuration:'',trialStatus:'',
    installCompleteDate:'',debugPerson:'',
    recvDept:'',recvPerson:'',recvPhone:'',assetOwner:'',assetNo:'',
    handoverNote:'',handoverOpinion:'',
    remarks:'供应商已通知发货，预计12月初到货。先建单据草稿。',attachments:[],createdBy:'张工',createdAt:'2024-11-20 09:30:00',updatedAt:'2024-11-20 09:30:00'
  },
  {
    id:'INST007',docNo:'YS-2024-00007',docType:'return_equipment',docTypeName:'外借设备归还验收',
    status:'pending_accept',statusName:'待验收',
    eqCode:'EQ-F001-003',eqName:'空压机',model:'ATLAS-Copco-GA37',serialNo:'SN-2024-003',factoryNo:'FNO-2024-003',
    factoryDate:'2024-03-10',arriveDate:'2024-12-05',planCompleteDate:'2024-12-15',
    handler:'王工',handlerDept:'设备管理部',
    purchaseReqNo:'',purchaseOrderNo:'',supplier:'',contractNo:'',arriveQty:1,
    packageCheck:'',packageCheckNote:'',appearanceCheck:'',appearanceCheckNote:'',
    partsCheck:'',partsCheckNote:'',techParamRated:'37 kW',techParamActual:'',techParamConclusion:'',
    acceptConclusion:'',acceptor:'',acceptDate:'',acceptOpinion:'',
    installLocation:'F001-L03-W01',installLocationName:'外包装线C-装箱工位',workCenter:'WC002',workCenterName:'电气维修中心',
    installProvider:'',installTeam:'',
    debugContent:'',debugResult:'',trialDuration:'',trialStatus:'',
    installCompleteDate:'',debugPerson:'',
    recvDept:'',recvPerson:'',recvPhone:'',assetOwner:'',assetNo:'',
    handoverNote:'',handoverOpinion:'',
    remarks:'设备从兄弟车间外借归还，需重新验收确认性能后重新入库。',attachments:[],createdBy:'王工',createdAt:'2024-12-05 13:00:00',updatedAt:'2024-12-05 13:00:00'
  },
  {
    id:'INST008',docNo:'YS-2024-00008',docType:'new_equipment',docTypeName:'新设备验收',
    status:'cancelled',statusName:'已作废',
    eqCode:'',eqName:'全自动灯检机',model:'AL-300',serialNo:'',factoryNo:'',
    factoryDate:'',arriveDate:'2024-08-01',planCompleteDate:'2024-08-20',
    handler:'刘工',handlerDept:'设备管理部',
    purchaseReqNo:'PR-2024-00500',purchaseOrderNo:'PO-2024-00555',supplier:'楚天科技',contractNo:'CT-2024-CT-04',arriveQty:1,
    packageCheck:'',packageCheckNote:'',appearanceCheck:'',appearanceCheckNote:'',
    partsCheck:'',partsCheckNote:'',techParamRated:'',techParamActual:'',techParamConclusion:'',
    acceptConclusion:'',acceptor:'',acceptDate:'',acceptOpinion:'',
    installLocation:'',installLocationName:'',workCenter:'',workCenterName:'',
    installProvider:'',installTeam:'',
    debugContent:'',debugResult:'',trialDuration:'',trialStatus:'',
    installCompleteDate:'',debugPerson:'',
    recvDept:'',recvPerson:'',recvPhone:'',assetOwner:'',assetNo:'',
    handoverNote:'',handoverOpinion:'',
    remarks:'采购计划变更，该设备取消引进，单据作废。',attachments:[],createdBy:'刘工',createdAt:'2024-08-01 10:00:00',updatedAt:'2024-08-05 09:00:00'
  }
];

const installDocLogs = {
  'INST001': [
    { time:'2024-07-15 09:00:00',action:'创建',user:'张工',detail:'创建验收单草稿' },
    { time:'2024-07-16 14:00:00',action:'编辑',user:'张工',detail:'完善设备基础信息' },
    { time:'2024-07-18 10:00:00',action:'提交',user:'张工',detail:'提交验收' },
    { time:'2024-07-20 15:30:00',action:'验收',user:'李工',detail:'验收合格，进入安装阶段' },
    { time:'2024-07-28 14:00:00',action:'提交',user:'张工',detail:'提交移交' },
    { time:'2024-07-28 16:00:00',action:'移交',user:'王主任',detail:'确认接收，设备正式投用' }
  ],
  'INST002': [
    { time:'2024-08-10 08:30:00',action:'创建',user:'刘工',detail:'创建验收单' },
    { time:'2024-08-12 09:00:00',action:'提交',user:'刘工',detail:'提交验收' },
    { time:'2024-08-15 11:00:00',action:'验收',user:'李工',detail:'验收合格' },
    { time:'2024-08-23 15:00:00',action:'移交',user:'赵班长',detail:'确认接收' }
  ],
  'INST003': [
    { time:'2024-10-20 10:00:00',action:'创建',user:'张工',detail:'创建验收单' },
    { time:'2024-10-25 09:30:00',action:'提交',user:'张工',detail:'提交验收' },
    { time:'2024-10-28 14:00:00',action:'验收',user:'李工',detail:'验收合格，通知安装' },
    { time:'2024-11-03 15:30:00',action:'编辑',user:'张工',detail:'完善安装调试信息，提交移交' }
  ],
  'INST004': [
    { time:'2024-11-12 14:00:00',action:'创建',user:'周工',detail:'设备到货，创建验收单' }
  ],
  'INST005': [
    { time:'2024-09-20 11:00:00',action:'创建',user:'孙工',detail:'创建备件验收单' },
    { time:'2024-09-21 10:00:00',action:'提交',user:'孙工',detail:'提交验收' },
    { time:'2024-09-22 16:00:00',action:'驳回',user:'赵工',detail:'验收不合格：外观损伤及配件缺失' }
  ]
};

const installDocStatusOptions = [
  { value:'draft',label:'草稿',cls:'badge-gray' },
  { value:'pending_accept',label:'待验收',cls:'badge-blue' },
  { value:'accept_rejected',label:'验收驳回',cls:'badge-red' },
  { value:'pending_rectify',label:'整改复检',cls:'badge-yellow' },
  { value:'pending_handover',label:'待移交',cls:'badge-purple' },
  { value:'completed',label:'已完成',cls:'badge-green' },
  { value:'cancelled',label:'已作废',cls:'badge-gray' }
];

const installDocTypeOptions = [
  { value:'new_equipment',label:'新设备验收' },
  { value:'spare_equipment',label:'备件设备验收' },
  { value:'return_equipment',label:'外借设备归还验收' }
];

const installPackageCheckOptions = [
  { value:'合格',label:'合格' },
  { value:'不合格',label:'不合格' }
];

const installAcceptConclusionOptions = [
  { value:'验收合格',label:'验收合格' },
  { value:'验收不合格',label:'验收不合格' },
  { value:'整改后复检',label:'整改后复检' }
];

// ===== 设备运行状态数据 =====
const eqRunStatusData = [
  { equipmentId:'EQ001',equipmentCode:'EQ-F001-001',equipmentName:'CNC加工中心',locationId:'F001-L01-W01',locationName:'片剂生产线A-压片工位',currentStatus:'running',currentStatusName:'运行中',runHours:3420,todayRunHours:6.5,lastStatusChangeAt:'2026-05-29 08:00:00',currentShift:'白班',currentOperator:'王建国',lastDowntimeAt:'2026-05-20 16:30:00',nextPlannedMaintenance:'2026-06-15' },
  { equipmentId:'EQ002',equipmentCode:'EQ-F001-002',equipmentName:'注塑机',locationId:'F001-L02-W01',locationName:'胶囊生产线B-填充工位',currentStatus:'running',currentStatusName:'运行中',runHours:5120,todayRunHours:5.0,lastStatusChangeAt:'2026-05-29 07:30:00',currentShift:'白班',currentOperator:'李明辉',lastDowntimeAt:'2026-05-15 10:00:00',nextPlannedMaintenance:'2026-06-20' },
  { equipmentId:'EQ003',equipmentCode:'EQ-F001-003',equipmentName:'空压机',locationId:'F001-L03-W01',locationName:'外包装线C-装箱工位',currentStatus:'standby',currentStatusName:'待机',runHours:2100,todayRunHours:0,lastStatusChangeAt:'2026-05-29 11:00:00',currentShift:'白班',currentOperator:'-',lastDowntimeAt:'-',nextPlannedMaintenance:'2026-07-01' },
  { equipmentId:'EQ004',equipmentCode:'EQ-F001-004',equipmentName:'西门子系统',locationId:'F001-L01-W01',locationName:'片剂生产线A-压片工位',currentStatus:'running',currentStatusName:'运行中',runHours:8700,todayRunHours:6.5,lastStatusChangeAt:'2026-05-29 08:00:00',currentShift:'白班',currentOperator:'王建国',lastDowntimeAt:'-',nextPlannedMaintenance:'2026-11-30' },
  { equipmentId:'EQ005',equipmentCode:'EQ-F001-005',equipmentName:'贴片机',locationId:'F002-L01-W01',locationName:'合成车间-反应区',currentStatus:'fault_downtime',currentStatusName:'故障停机',runHours:1800,todayRunHours:2.0,lastStatusChangeAt:'2026-05-29 13:15:00',currentShift:'白班',currentOperator:'赵志强',lastDowntimeAt:'2026-05-29 13:15:00',nextPlannedMaintenance:'2026-06-10' },
  { equipmentId:'EQ006',equipmentCode:'EQ-F002-001',equipmentName:'反应釜',locationId:'F002-L01-W01',locationName:'合成车间-反应区',currentStatus:'planned_maintenance',currentStatusName:'计划性维保停机',runHours:6200,todayRunHours:0,lastStatusChangeAt:'2026-05-28 17:00:00',currentShift:'白班',currentOperator:'周永刚',lastDowntimeAt:'2026-05-28 17:00:00',nextPlannedMaintenance:'2026-05-28' },
  { equipmentId:'EQ007',equipmentCode:'EQ-F003-001',equipmentName:'纯化水泵',locationId:'F003-L01',locationName:'原材料仓库',currentStatus:'running',currentStatusName:'运行中',runHours:4400,todayRunHours:4.0,lastStatusChangeAt:'2026-05-29 06:00:00',currentShift:'白班',currentOperator:'陈文博',lastDowntimeAt:'2026-05-10 08:00:00',nextPlannedMaintenance:'2026-08-15' },
  { equipmentId:'EQ008',equipmentCode:'EQ-F003-002',equipmentName:'叉车',locationId:'F003-L02',locationName:'成品仓库',currentStatus:'running',currentStatusName:'运行中',runHours:890,todayRunHours:3.5,lastStatusChangeAt:'2026-05-29 08:30:00',currentShift:'白班',currentOperator:'刘大伟',lastDowntimeAt:'-',nextPlannedMaintenance:'2026-12-01' },
  { equipmentId:'EQ009',equipmentCode:'EQ-F001-006',equipmentName:'包装机',locationId:'F001-L03-W01',locationName:'外包装线C-装箱工位',currentStatus:'running',currentStatusName:'运行中',runHours:2900,todayRunHours:5.5,lastStatusChangeAt:'2026-05-29 08:00:00',currentShift:'白班',currentOperator:'张海峰',lastDowntimeAt:'2026-05-18 14:00:00',nextPlannedMaintenance:'2026-06-25' },
  { equipmentId:'EQ010',equipmentCode:'EQ-F002-002',equipmentName:'离心机',locationId:'F002-L01-W01',locationName:'合成车间-反应区',currentStatus:'temp_disabled',currentStatusName:'临时停用',runHours:4100,todayRunHours:0,lastStatusChangeAt:'2026-05-25 09:00:00',currentShift:'-',currentOperator:'-',lastDowntimeAt:'2026-05-25 09:00:00',nextPlannedMaintenance:'-',sealReason:'设备异常震动，待专业检测后确定处理方案' },
  { equipmentId:'EQ011',equipmentCode:'EQ-F001-007',equipmentName:'混合机',locationId:'F001-L01-W01',locationName:'片剂生产线A-压片工位',currentStatus:'running',currentStatusName:'运行中',runHours:1600,todayRunHours:6.0,lastStatusChangeAt:'2026-05-29 08:00:00',currentShift:'白班',currentOperator:'王建国',lastDowntimeAt:'-',nextPlannedMaintenance:'2026-06-30' },
  { equipmentId:'EQ012',equipmentCode:'EQ-F001-008',equipmentName:'压片机',locationId:'F001-L01-W01',locationName:'片剂生产线A-压片工位',currentStatus:'running',currentStatusName:'运行中',runHours:750,todayRunHours:6.5,lastStatusChangeAt:'2026-05-29 08:00:00',currentShift:'白班',currentOperator:'王建国',lastDowntimeAt:'-',nextPlannedMaintenance:'2026-05-31' }
];

const eqRunStatusMap = { running:'运行中',standby:'待机',fault_downtime:'故障停机',planned_maintenance:'计划性维保停机',temp_disabled:'临时停用',sealed:'封存' };
const eqRunStatusCls = { running:'badge-green',standby:'badge-yellow',fault_downtime:'badge-red',planned_maintenance:'badge-blue',temp_disabled:'badge-gray',sealed:'badge-gray' };
const eqRunStatusColor = { running:'#10B981',standby:'#F59E0B',fault_downtime:'#DC2626',planned_maintenance:'#3B82F6',temp_disabled:'#6B7280',sealed:'#4B5563' };
const eqRunStatusOptions = [
  { value:'running',label:'运行中',cls:'badge-green' },
  { value:'standby',label:'待机',cls:'badge-yellow' },
  { value:'fault_downtime',label:'故障停机',cls:'badge-red' },
  { value:'planned_maintenance',label:'计划性维保停机',cls:'badge-blue' },
  { value:'temp_disabled',label:'临时停用',cls:'badge-gray' },
  { value:'sealed',label:'封存',cls:'badge-gray' }
];

// ===== 设备状态变更单数据 =====
const eqStatusChangeData = [
  { id:'SC001',docNo:'BG-2026-00001',equipmentId:'EQ006',equipmentCode:'EQ-F002-001',equipmentName:'反应釜',changeType:'planned_maintenance',changeTypeName:'计划性维保停机',reason:'季度预防性维护保养，更换密封件及搅拌桨检查',effectiveTime:'2026-05-28 17:00:00',expectedRecoveryTime:'2026-05-30 17:00:00',scope:'合成车间反应区反应釜（单台）',impactLines:'合成车间反应产线（该区域仅此一台反应釜，停机期间反应工序暂停）',riskDesc:'1. 反应釜内残留物料已排空清洗；2. 维保期间相邻反应釜正常运行；3. GMP洁净区维护需严格防护',gmpImpact:'A级洁净区，维保人员需穿戴洁净服，操作完成后需环境清洁验证',applicant:'周永刚',applicantDept:'设备管理部',deptApprover:'孙部长',approvalOpinion:'同意按计划执行维保，注意洁净区操作规范，维保后提交环境检测报告',status:'approved',statusName:'已审批',attachments:['维保方案.pdf','风险评估报告.pdf'],createdBy:'周永刚',createdAt:'2026-05-25 10:00:00',updatedAt:'2026-05-26 15:00:00' },
  { id:'SC002',docNo:'BG-2026-00002',equipmentId:'EQ010',equipmentCode:'EQ-F002-002',equipmentName:'离心机',changeType:'temp_disabled',changeTypeName:'临时停用',reason:'设备运行异常震动，怀疑轴承磨损或转鼓不平衡，需专业检测后确定处理方案',effectiveTime:'2026-05-25 09:00:00',expectedRecoveryTime:'2026-06-05 09:00:00',scope:'合成车间反应区离心机（单台）',impactLines:'合成车间反应区离心分离工序（有备用离心机可临时替代）',riskDesc:'1. 异常震动可能造成转鼓结构损伤；2. 如继续运行存在安全隐患；3. GMP生产影响需评估过往批次产品质量',gmpImpact:'A级洁净区关键设备停机，需启动偏差调查（OOS/OOT），已通知QA部门进行批次追溯',applicant:'赵志强',applicantDept:'设备管理部',deptApprover:'孙部长',approvalOpinion:'同意临时停用，立即安排专业检测。通知QA启动偏差调查，同步启用备用离心机维持生产',status:'approved',statusName:'已审批',attachments:['异常振动检测报告.pdf','偏差调查报告模板.pdf'],createdBy:'赵志强',createdAt:'2026-05-24 14:00:00',updatedAt:'2026-05-25 08:30:00' },
  { id:'SC003',docNo:'BG-2026-00003',equipmentId:'EQ009',equipmentCode:'EQ-F001-006',equipmentName:'包装机',changeType:'planned_maintenance',changeTypeName:'计划性维保停机',reason:'月度定期保养：传送带张紧调节、封口加热片更换、电气柜清洁除尘',effectiveTime:'2026-06-01 08:00:00',expectedRecoveryTime:'2026-06-01 17:00:00',scope:'外包装线C-装箱工位包装机（单台）',impactLines:'外包装线C-装箱工序（单班影响约8小时）',riskDesc:'1. 传动部件及加热元件更换需断电操作；2. 恢复后需试机验证包装质量',gmpImpact:'C级洁净区一般维护，按SOP操作即可',applicant:'张海峰',applicantDept:'生产一部',deptApprover:'孙部长',approvalOpinion:'同意按保养计划执行',status:'approved',statusName:'已审批',attachments:['月度保养计划表.pdf'],createdBy:'张海峰',createdAt:'2026-05-20 09:00:00',updatedAt:'2026-05-22 10:00:00' },
  { id:'SC004',docNo:'BG-2026-00004',equipmentId:'EQ004',equipmentCode:'EQ-F001-004',equipmentName:'西门子系统',changeType:'temp_disabled',changeTypeName:'临时停用',reason:'通信模块间歇性故障报警，需停机排查Profibus通讯故障',effectiveTime:'2026-06-10 14:00:00',expectedRecoveryTime:'2026-06-11 17:00:00',scope:'片剂生产线A-压片工位西门子控制系统（单点）',impactLines:'片剂生产线A-压片工位（控制系统故障影响压片、混合等关联设备运行）',riskDesc:'1. 通讯故障导致设备联锁失效风险；2. 故障期间该产线全线停运；3. 需提前调整生产排程',gmpImpact:'C级洁净区，控制系统维护不涉及直接物料接触，按电气作业安全规范执行即可',applicant:'李明辉',applicantDept:'电气维修班',deptApprover:'孙部长',approvalOpinion:'同意停机排查，需同步通知生产调度调整排产计划',status:'pending',statusName:'待审批',attachments:['故障报警记录.pdf','停产影响评估.pdf'],createdBy:'李明辉',createdAt:'2026-05-27 11:00:00',updatedAt:'2026-05-27 11:00:00' },
  { id:'SC005',docNo:'BG-2026-00005',equipmentId:'EQ003',equipmentCode:'EQ-F001-003',equipmentName:'空压机',changeType:'sealed',changeTypeName:'封存',reason:'产线改造升级，原空压机产能不足需替换为新型号，旧设备封存待处置',effectiveTime:'2026-07-01 08:00:00',expectedRecoveryTime:'-',scope:'外包装线C-装箱工位空压机（整机）',impactLines:'外包装线C气动设备（封存前已安装临时备用空压机）',riskDesc:'1. 封存前需排空管路压力及油液；2. 进/出气口加装盲板；3. 电源切断并挂牌',gmpImpact:'C级区域一般设备，按设备封存SOP执行即可',applicant:'张海峰',applicantDept:'设备管理部',deptApprover:'孙部长',approvalOpinion:'原则上同意封存，需确认备用空压机稳定运行至少1个月后再执行',status:'draft',statusName:'草稿',attachments:['空压机替换方案.pdf'],createdBy:'张海峰',createdAt:'2026-05-28 16:00:00',updatedAt:'2026-05-28 16:00:00' }
];

const eqStatusChangeTypeOptions = [
  { value:'normal',label:'正常运行' },
  { value:'standby',label:'待机' },
  { value:'planned_maintenance',label:'计划性维保停机' },
  { value:'temp_disabled',label:'临时停用' },
  { value:'sealed',label:'封存' }
];

const eqStatusChangeStatusOptions = [
  { value:'draft',label:'草稿',cls:'badge-gray' },
  { value:'pending',label:'待审批',cls:'badge-yellow' },
  { value:'approved',label:'已审批',cls:'badge-green' },
  { value:'rejected',label:'已驳回',cls:'badge-red' },
  { value:'executed',label:'已执行',cls:'badge-blue' },
  { value:'recovered',label:'已恢复运行',cls:'badge-green' },
  { value:'cancelled',label:'已作废',cls:'badge-gray' }
];

// ===== 设备运行&停机台账数据 =====
const eqRunLogData = [
  { id:'LOG001',equipmentId:'EQ005',equipmentCode:'EQ-F001-005',equipmentName:'贴片机',recordedTime:'2026-05-29 13:15:00',shift:'白班',runStatus:'fault_downtime',cumulativeRunHours:1800,downtimeType:'fault',downtimeTypeName:'故障停机',downtimeReason:'贴片头Z轴卡料，贴装精度偏差超限',downtimeStart:'2026-05-29 13:10:00',downtimeEnd:'',measures:'已紧急停机，通知电气维修班排查Z轴伺服驱动及机械传动部件',operator:'赵志强',relatedWorkOrder:'PM02-2026-00015',remarks:'初步判断为送料器卡料导致' },
  { id:'LOG002',equipmentId:'EQ005',equipmentCode:'EQ-F001-005',equipmentName:'贴片机',recordedTime:'2026-05-29 12:00:00',shift:'白班',runStatus:'running',cumulativeRunHours:1798,downtimeType:'',downtimeTypeName:'',downtimeReason:'',downtimeStart:'',downtimeEnd:'',measures:'',operator:'赵志强',relatedWorkOrder:'',remarks:'上午运行正常，贴装速度35000CPH' },
  { id:'LOG003',equipmentId:'EQ006',equipmentCode:'EQ-F002-001',equipmentName:'反应釜',recordedTime:'2026-05-28 17:00:00',shift:'白班',runStatus:'planned_maintenance',cumulativeRunHours:6200,downtimeType:'maintenance',downtimeTypeName:'维保停机',downtimeReason:'季度预防性维护：更换机械密封件、搅拌桨检查、内壁清洗',downtimeStart:'2026-05-28 17:00:00',downtimeEnd:'',measures:'按维保方案执行，已排空物料并清洗完毕',operator:'周永刚',relatedWorkOrder:'PM01-2026-00042',remarks:'本次维保计划48小时内完成' },
  { id:'LOG004',equipmentId:'EQ006',equipmentCode:'EQ-F002-001',equipmentName:'反应釜',recordedTime:'2026-05-28 08:00:00',shift:'白班',runStatus:'running',cumulativeRunHours:6192,downtimeType:'',downtimeTypeName:'',downtimeReason:'',downtimeStart:'',downtimeEnd:'',measures:'',operator:'周永刚',relatedWorkOrder:'',remarks:'运行正常，温度120°C，压力0.3MPa' },
  { id:'LOG005',equipmentId:'EQ010',equipmentCode:'EQ-F002-002',equipmentName:'离心机',recordedTime:'2026-05-25 09:00:00',shift:'白班',runStatus:'temp_disabled',cumulativeRunHours:4100,downtimeType:'fault',downtimeTypeName:'故障停机',downtimeReason:'离心机运行时异常震动，转速波动超正常范围±15%，初步判断轴承磨损或转鼓不平衡',downtimeStart:'2026-05-25 09:00:00',downtimeEnd:'',measures:'1. 立即停机；2. 已提交临时停用变更单BG-2026-00002；3. 联系Sigma厂家安排专业检测',operator:'赵志强',relatedWorkOrder:'PM02-2026-00012',remarks:'QA已启动偏差调查，前3批次产品追溯中' },
  { id:'LOG006',equipmentId:'EQ010',equipmentCode:'EQ-F002-002',equipmentName:'离心机',recordedTime:'2026-05-24 08:00:00',shift:'白班',runStatus:'running',cumulativeRunHours:4100,downtimeType:'',downtimeTypeName:'',downtimeReason:'',downtimeStart:'',downtimeEnd:'',measures:'',operator:'赵志强',relatedWorkOrder:'',remarks:'运行中有轻微异响，已记录待观察' },
  { id:'LOG007',equipmentId:'EQ001',equipmentCode:'EQ-F001-001',equipmentName:'CNC加工中心',recordedTime:'2026-05-20 16:30:00',shift:'白班',runStatus:'fault_downtime',cumulativeRunHours:3414,downtimeType:'fault',downtimeTypeName:'故障停机',downtimeReason:'主轴冷却液泄漏，加工精度异常',downtimeStart:'2026-05-20 16:20:00',downtimeEnd:'2026-05-20 20:00:00',measures:'更换冷却液管路O型密封圈，补充冷却液，主轴精度复校',operator:'王建国',relatedWorkOrder:'PM03-2026-00008',remarks:'更换后试切3件样品，精度恢复至±0.01mm' },
  { id:'LOG008',equipmentId:'EQ009',equipmentCode:'EQ-F001-006',equipmentName:'包装机',recordedTime:'2026-05-18 14:00:00',shift:'白班',runStatus:'fault_downtime',cumulativeRunHours:2895,downtimeType:'fault',downtimeTypeName:'故障停机',downtimeReason:'封口温度传感器故障，包装封口不严密',downtimeStart:'2026-05-18 14:00:00',downtimeEnd:'2026-05-18 16:30:00',measures:'更换封口温度传感器（备件号SP-KHS-TS01），重新校准PID温控参数',operator:'张海峰',relatedWorkOrder:'PM02-2026-00018',remarks:'已恢复，后续需关注该传感器工作稳定性' },
  { id:'LOG009',equipmentId:'EQ007',equipmentCode:'EQ-F003-001',equipmentName:'纯化水泵',recordedTime:'2026-05-10 08:00:00',shift:'白班',runStatus:'fault_downtime',cumulativeRunHours:4396,downtimeType:'fault',downtimeTypeName:'故障停机',downtimeReason:'水泵出口压力异常下降，怀疑叶轮磨损或机械密封失效',downtimeStart:'2026-05-10 08:00:00',downtimeEnd:'2026-05-10 15:00:00',measures:'拆解检查发现机械密封动静环磨损，更换机械密封总成（备件号SP-PUMP-MS80），叶轮修补',operator:'陈文博',relatedWorkOrder:'PM02-2026-00010',remarks:'机械密封使用寿命到期，建议修改预防性维护周期从季度改为双月' },
  { id:'LOG010',equipmentId:'EQ012',equipmentCode:'EQ-F001-008',equipmentName:'压片机',recordedTime:'2026-05-15 10:30:00',shift:'白班',runStatus:'running',cumulativeRunHours:740,downtimeType:'',downtimeTypeName:'',downtimeReason:'',downtimeStart:'',downtimeEnd:'',measures:'',operator:'王建国',relatedWorkOrder:'',remarks:'运行正常，产量90000片/小时' },
  { id:'LOG011',equipmentId:'EQ003',equipmentCode:'EQ-F001-003',equipmentName:'空压机',recordedTime:'2026-05-08 14:00:00',shift:'白班',runStatus:'fault_downtime',cumulativeRunHours:2095,downtimeType:'fault',downtimeTypeName:'故障停机',downtimeReason:'排气温度超限报警（>110°C），散热器脏堵',downtimeStart:'2026-05-08 14:00:00',downtimeEnd:'2026-05-08 16:00:00',measures:'清洗散热器翅片，检查冷却风扇运转正常，更换进气滤芯',operator:'张海峰',relatedWorkOrder:'PM02-2026-00009',remarks:'建议增加散热器定期吹扫频率' },
  { id:'LOG012',equipmentId:'EQ004',equipmentCode:'EQ-F001-004',equipmentName:'西门子系统',recordedTime:'2026-04-28 09:00:00',shift:'白班',runStatus:'fault_downtime',cumulativeRunHours:8695,downtimeType:'fault',downtimeTypeName:'故障停机',downtimeReason:'Profibus通讯中断，ET200M从站掉线',downtimeStart:'2026-04-28 09:00:00',downtimeEnd:'2026-04-28 14:30:00',measures:'检查Profibus总线终端电阻、更换DP接头、重新配置从站地址',operator:'李明辉',relatedWorkOrder:'PM02-2026-00007',remarks:'通讯模块老化趋势明显，已申请备件采购' }
];

const downtimeTypeOptions = [
  { value:'',label:'全部停机类型' },
  { value:'fault',label:'故障停机' },
  { value:'maintenance',label:'维保停机' },
  { value:'planned_production',label:'计划停产' },
  { value:'energy_interrupt',label:'能源中断' },
  { value:'human',label:'人为停机' }
];

const shiftOptions = [
  { value:'',label:'全部班次' },
  { value:'白班',label:'白班' },
  { value:'中班',label:'中班' },
  { value:'夜班',label:'夜班' }
];

// ===== 4.3 设备改造/升级 数据 =====
const eqRetrofitData = [
  { id:'RF001',docNo:'GZ-2026-00001',equipmentIds:['EQ001'],equipmentInfo:'EQ-F001-001 / CNC加工中心',retrofitType:'performance_upgrade',retrofitTypeName:'性能升级',reason:'主轴转速偏低（现6000rpm→目标12000rpm），影响高精度模具加工效率',goal:'提升主轴最高转速至12000rpm，缩短单件加工时间30%',expectedEffect:'单件加工时间由45min缩短至30min，年产能提升约33%',estimatedDuration:'15天',estimatedCost:'650000',budgetSubject:'技改预算-2026',leader:'张工',leaderDept:'设备管理部',createdAt:'2026-03-10',projStatus:'completed',projStatusName:'已完成',scope:'CNC加工中心主轴升级（单台）',impactLine:'片剂生产线A压片工位（需停机15天）',gmpRequirement:'1. 改造后重新进行定位精度及加工精度验证；2. C级洁净区改造需采取粉尘防护措施',planDetail:'1. 更换高速电主轴（FANUC B8系列）；2. 升级伺服驱动器至最新版本；3. 主轴冷却系统同步升级；4. 改造后编程工艺参数调整',constructionTeam:'维修一班（内部）',constructionStart:'2026-03-20',constructionEnd:'2026-04-04',acceptDate:'2026-04-05',actualDuration:'15天',actualCost:'635000',techBefore:{spindleSpeed:'6000rpm',accuracy:'±0.02mm'},techAfter:{spindleSpeed:'12000rpm',accuracy:'±0.015mm'},acceptResult:'现场验收合格，试加工5件样品全部满足精度要求',qaConclusion:'符合GMP要求，C级区域粉尘检测合格',acceptor:'李工/孙部长/QA王工',remainIssues:'建议运行3个月后进行精度复校',bomChanges:[{partCode:'SP-001',partName:'电主轴（旧）',action:'replace',newPartCode:'SP-001-V2',newPartName:'高速电主轴FANUC B8'}],attachmentList:['改造技术方案.pdf','主轴采购合同.pdf','精度验证报告.pdf','QA环境检测报告.pdf'],createdBy:'张工',updatedAt:'2026-04-06 16:00:00',log:[{time:'2026-03-10 09:00:00',action:'立项创建',user:'张工',detail:'提交改造项目申请'},{time:'2026-03-11 10:00:00',action:'审批通过',user:'孙部长',detail:'同意立项，纳入技改计划'},{time:'2026-03-20 08:00:00',action:'开始施工',user:'张工',detail:'停机后开始拆卸旧主轴'},{time:'2026-04-04 17:00:00',action:'施工完成',user:'张工',detail:'安装调试完毕，试机正常'},{time:'2026-04-05 14:00:00',action:'验收通过',user:'李工',detail:'联合验收合格，恢复生产'}] },
  { id:'RF002',docNo:'GZ-2026-00002',equipmentIds:['EQ002'],equipmentInfo:'EQ-F001-002 / 注塑机',retrofitType:'gmp_compliance',retrofitTypeName:'GMP合规改造',reason:'现有机台未配备在线环境监测传感器，不满足新版GMP附录对洁净区连续环境监测要求',goal:'加装颗粒计数器和温湿度实时监控探头，实现环境数据自动记录与报警',expectedEffect:'满足新版GMP合规要求，实现环境数据自动采集、趋势分析、超限报警',estimatedDuration:'7天',estimatedCost:'280000',budgetSubject:'合规改造专项-2026',leader:'李工',leaderDept:'设备管理部',createdAt:'2026-04-01',projStatus:'construction',projStatusName:'施工中',scope:'注塑机环境监测系统加装（单台）',impactLine:'胶囊生产线B填充工位（需停机7天）',gmpRequirement:'1. 改造环境为B级洁净区，施工人员需穿戴洁净服；2. 安装完成后需进行环境清洁验证及传感器校准；3. 新装探头需经QA确认并纳入日常校验计划',planDetail:'1. 在注塑腔体旁安装颗粒计数器（MET ONE 3400+）；2. 加装温湿度变送器（VAISALA HMT330）；3. 部署数据采集网关，接入SCADA系统；4. 配置自动报警规则及历史趋势面板',constructionTeam:'仪表班 + 外部服务商（大华科技）',constructionStart:'2026-05-15',constructionEnd:'',acceptDate:'',actualDuration:'',actualCost:'',techBefore:{envMonitor:'无在线监测'},techAfter:{},acceptResult:'',qaConclusion:'',acceptor:'',remainIssues:'',bomChanges:[{partCode:'SP-SNS-001',partName:'颗粒计数器',action:'add',newPartCode:'SP-SNS-001',newPartName:'颗粒计数器MET ONE 3400+'},{partCode:'SP-SNS-002',partName:'温湿度变送器',action:'add',newPartCode:'SP-SNS-002',newPartName:'温湿度变送器VAISALA HMT330'}],attachmentList:['GMP合规评估报告.pdf','监测方案设计图.pdf','施工方案及安全保障措施.pdf'],createdBy:'李工',updatedAt:'2026-05-16 17:00:00',log:[{time:'2026-04-01 14:00:00',action:'立项创建',user:'李工',detail:'提交GMP合规改造申请'},{time:'2026-04-03 09:00:00',action:'审批通过',user:'孙部长',detail:'纳入合规改造项目，优先执行'},{time:'2026-05-15 08:00:00',action:'开始施工',user:'李工',detail:'停机后开始传感器安装'}] },
  { id:'RF003',docNo:'GZ-2026-00003',equipmentIds:['EQ009','EQ011'],equipmentInfo:'EQ-F001-006 / 包装机, EQ-F001-007 / 混合机',retrofitType:'auto_upgrade',retrofitTypeName:'自动化改造',reason:'包装线与混合机为独立操控，未联机自动协同生产、无自动换单功能，换线耗时30分钟以上',goal:'增加包装线-混合机联机控制系统，实现自动换单、一键启动',expectedEffect:'换线时间由30min缩短至5min，减少人为操作失误，OEE预计提升12%',estimatedDuration:'20天',estimatedCost:'1280000',budgetSubject:'自动化升级-2026',leader:'张海峰',leaderDept:'生产一部',createdAt:'2026-05-10',projStatus:'pending_approval',projStatusName:'待立项审批',scope:'包装机+混合机联机自动化（多设备）',impactLine:'外包装线C装箱工位+片剂线A压片工位（包装线需停机20天，混合机同步接入调试）',gmpRequirement:'1. 控制系统改造不涉及直接物料接触，按电气作业规范执行；2. PLC程序变更需进行IQ/OQ/PQ验证',planDetail:'1. 部署统一PLC主控（Siemens S7-1500），取代分别操控；2. 包装线和混合机通过Profibus组网联机；3. 开发配方管理模块，支持自动换单配方调用；4. 增加HMI触摸屏统一监控面板',constructionTeam:'电气维修班 + 西门子工程师（外部）',constructionStart:'',constructionEnd:'',acceptDate:'',actualDuration:'',actualCost:'',techBefore:{controlMode:'独立操控',changeoverTime:'30min'},techAfter:{controlMode:'联机自动',changeoverTime:'5min'},acceptResult:'',qaConclusion:'',acceptor:'',remainIssues:'',bomChanges:[{partCode:'SP-PLC-001',partName:'原PLC控制器',action:'replace',newPartCode:'SP-PLC-001-V2',newPartName:'S7-1500统一主控'},{partCode:'SP-HMI-001',partName:'原HMI触摸屏',action:'replace',newPartCode:'SP-HMI-001-V2',newPartName:'15寸工业触摸屏'}],attachmentList:['自动化改造方案.pdf','投资回收分析.pdf','西门子报价单.pdf','操作培训计划.pdf'],createdBy:'张海峰',updatedAt:'2026-05-12 15:00:00',log:[{time:'2026-05-10 10:00:00',action:'立项创建',user:'张海峰',detail:'提交多设备自动化改造立项申请'},{time:'2026-05-12 15:00:00',action:'编辑',user:'张海峰',detail:'补充投资回报分析及操作培训计划'}] },
  { id:'RF004',docNo:'GZ-2026-00004',equipmentIds:['EQ006'],equipmentInfo:'EQ-F002-001 / 反应釜',retrofitType:'parts_replacement',retrofitTypeName:'部件更换',reason:'搅拌桨桨叶磨损严重，密封件老化渗漏，需整体更换搅拌系统关键部件',goal:'恢复搅拌效率和密封性能到出厂水平',expectedEffect:'搅拌效率恢复至设计值，密封寿命延长2年',estimatedDuration:'5天',estimatedCost:'180000',budgetSubject:'维修预算-2026',leader:'周永刚',leaderDept:'设备管理部',createdAt:'2026-05-20',projStatus:'draft',projStatusName:'草稿',scope:'反应釜搅拌系统部件更换（单台）',impactLine:'合成车间反应区（需停机5天）',gmpRequirement:'A级洁净区关键设备改造，施工全程需严格洁净防护，更换后需环境清洁验证',planDetail:'1. 更换搅拌桨（材质升级为哈氏合金Hastelloy C-276）；2. 更换双端面机械密封（BURGMANN）；3. 超声波测厚及内壁检查',constructionTeam:'维修一班（内部）',constructionStart:'',constructionEnd:'',acceptDate:'',actualDuration:'',actualCost:'',techBefore:{mixingEfficiency:'78%',sealLife:'2年'},techAfter:{mixingEfficiency:'>95%'},acceptResult:'',qaConclusion:'',acceptor:'',remainIssues:'',bomChanges:[{partCode:'SP-BOM-AGI-001',partName:'搅拌桨（旧）',action:'replace',newPartCode:'SP-BOM-AGI-001-V2',newPartName:'哈氏合金搅拌桨'},{partCode:'SP-BOM-SEAL-001',partName:'机械密封（旧）',action:'replace',newPartCode:'SP-BOM-SEAL-001-V2',newPartName:'BURGMANN双端面机械密封'}],attachmentList:['搅拌系统检测报告.pdf','部件采购申请.pdf'],createdBy:'周永刚',updatedAt:'2026-05-20 16:00:00',log:[{time:'2026-05-20 16:00:00',action:'创建草稿',user:'周永刚',detail:'创建部件更换改造项目草稿'}] },
  { id:'RF005',docNo:'GZ-2026-00005',equipmentIds:['EQ007'],equipmentInfo:'EQ-F003-001 / 纯化水泵',retrofitType:'pipeline_modification',retrofitTypeName:'管线改造',reason:'纯化水回路末端压力偏低（<2.5bar），新增大容量反应釜后用水点流量不足',goal:'改造纯化水管路布局，增加增压泵，确保所有用水点压力≥3.0bar',expectedEffect:'末端压力提升至3.2bar以上，满足新增设备用水需求',estimatedDuration:'10天',estimatedCost:'350000',budgetSubject:'公用工程改造-2026',leader:'陈文博',leaderDept:'设备管理部',createdAt:'2026-04-15',projStatus:'acceptance',projStatusName:'待验收',scope:'纯化水管网末端增压改造（关联设备）',impactLine:'原材料仓库纯化水供应系统（改造期间临时供水保障）',gmpRequirement:'1. 纯化水管道改造需按洁净管道施工规范；2. 改造完成后进行水质全项检测；3. 管道钝化处理后冲洗至电导率达标',planDetail:'1. 管路优化：调整主管走向减少弯头，降低沿程阻力；2. 加装变频增压泵（GRUNDFOS CRNE-5-8）；3. 更换老旧阀门及压力传感器；4. 增加末端回水流量计',constructionTeam:'维修二班 + 外部管工（江安装备）',constructionStart:'2026-05-05',constructionEnd:'2026-05-14',acceptDate:'',actualDuration:'10天',actualCost:'342000',techBefore:{endPressure:'2.3 bar',flowRate:'4.2 m³/h'},techAfter:{endPressure:'3.4 bar',flowRate:'6.5 m³/h'},acceptResult:'',qaConclusion:'',acceptor:'',remainIssues:'新装压力传感器数据偏差约±2%，需进一步校准',bomChanges:[{partCode:'SP-PUMP-002',partName:'增压泵',action:'add',newPartCode:'SP-PUMP-002',newPartName:'GRUNDFOS CRNE-5-8 增压泵'},{partCode:'SP-VALVE-005',partName:'截止阀DN50',action:'replace',newPartCode:'SP-VALVE-005-V2',newPartName:'气动截止阀DN50'}],attachmentList:['管线改造方案及图纸.pdf','用水量分析报告.pdf','水质检测计划.pdf','施工日志.pdf'],createdBy:'陈文博',updatedAt:'2026-05-14 18:00:00',log:[{time:'2026-04-15 09:00:00',action:'立项创建',user:'陈文博',detail:'提交纯化水管线改造立项'},{time:'2026-04-18 10:00:00',action:'审批通过',user:'孙部长',detail:'同意立项，纳入公用工程改造计划'},{time:'2026-05-05 08:00:00',action:'开始施工',user:'陈文博',detail:'管路改造正式启动'},{time:'2026-05-14 17:00:00',action:'施工完成',user:'陈文博',detail:'管线改造完毕，进入验收阶段'}] },
  { id:'RF006',docNo:'GZ-2026-00006',equipmentIds:['EQ012'],equipmentInfo:'EQ-F001-008 / 压片机',retrofitType:'performance_upgrade',retrofitTypeName:'性能升级',reason:'冲头导向精度随运行时间下降，片剂重量偏差偶尔超标，需升级导向系统',goal:'升级冲头导向系统，片重RSD控制在2%以内',expectedEffect:'片重RSD由3.5%降至1.5%以下，减少废品率',estimatedDuration:'3天',estimatedCost:'95000',budgetSubject:'品质提升专项',leader:'王建国',leaderDept:'生产一部',createdAt:'2026-05-25',projStatus:'rejected',projStatusName:'已驳回',scope:'压片机冲头导向系统升级（单台）',impactLine:'片剂生产线A压片工位（需停机3天）',gmpRequirement:'B级洁净区设备改造，需严格防护',planDetail:'更换上冲导向套及下冲导轨，升级为陶瓷涂层导向件',constructionTeam:'维修一班（内部）',constructionStart:'',constructionEnd:'',acceptDate:'',actualDuration:'',actualCost:'',techBefore:{weightRSD:'3.5%',rejectRate:'2.1%'},techAfter:{weightRSD:'<1.5%'},acceptResult:'',qaConclusion:'',acceptor:'',remainIssues:'',bomChanges:[{partCode:'SP-GUIDE-001',partName:'冲头导向套（旧）',action:'replace',newPartCode:'SP-GUIDE-001-V2',newPartName:'陶瓷涂层导向套'}],attachmentList:['品质分析报告.pdf'],createdBy:'王建国',updatedAt:'2026-05-27 10:00:00',log:[{time:'2026-05-25 14:00:00',action:'立项创建',user:'王建国',detail:'提交压片机导向系统升级申请'},{time:'2026-05-27 10:00:00',action:'审批驳回',user:'孙部长',detail:'请在品质报告中补充近3个月片重趋势数据后再提交'}] },
  { id:'RF007',docNo:'GZ-2026-00007',equipmentIds:['EQ004'],equipmentInfo:'EQ-F001-004 / 西门子系统',retrofitType:'parts_replacement',retrofitTypeName:'部件更换',reason:'ET200M从站模块老化，多次出现Profibus通讯中断，需更换新一代分布式IO模块',goal:'替换老旧ET200M为ET200SP，消除通讯故障隐患',expectedEffect:'通讯中断故障彻底消除，系统MTBF提升至50000小时以上',estimatedDuration:'5天',estimatedCost:'220000',budgetSubject:'维修预算-2026',leader:'李明辉',leaderDept:'电气维修班',createdAt:'2026-05-28',projStatus:'draft',projStatusName:'草稿',scope:'西门子分布式IO模块升级（单台）',impactLine:'片剂线A压片工位（控制系统升级需全线停机5天）',gmpRequirement:'控制系统改造不涉及直接物料接触，按电气作业规范执行',planDetail:'1. 更换ET200M接口模块及8个IO模块为ET200SP系列；2. 更新TIA Portal组态及硬件配置；3. 重新测试所有IO点点位功能',constructionTeam:'电气维修班（内部）',constructionStart:'',constructionEnd:'',acceptDate:'',actualDuration:'',actualCost:'',techBefore:{ioModule:'ET200M',commStability:'间歇中断'},techAfter:{},acceptResult:'',qaConclusion:'',acceptor:'',remainIssues:'',bomChanges:[{partCode:'SP-IO-001',partName:'ET200M接口模块',action:'replace',newPartCode:'SP-IO-001-V2',newPartName:'ET200SP接口模块'},{partCode:'SP-IO-002',partName:'ET200M IO模块8个',action:'replace',newPartCode:'SP-IO-002-V2',newPartName:'ET200SP IO模块8个'}],attachmentList:['通讯故障分析报告.pdf','模块型号对照表.pdf'],createdBy:'李明辉',updatedAt:'2026-05-28 17:00:00',log:[{time:'2026-05-28 17:00:00',action:'创建草稿',user:'李明辉',detail:'创建ET200M替换改造项目草稿'}] }
];

const eqRetrofitTypeOptions = [
  { value:'',label:'全部改造类型' },
  { value:'performance_upgrade',label:'性能升级' },
  { value:'parts_replacement',label:'部件更换' },
  { value:'gmp_compliance',label:'GMP合规改造' },
  { value:'auto_upgrade',label:'自动化改造' },
  { value:'pipeline_modification',label:'管线改造' },
  { value:'other',label:'其他' }
];

const eqRetrofitStatusOptions = [
  { value:'draft',label:'草稿',cls:'badge-gray' },
  { value:'pending_approval',label:'待立项审批',cls:'badge-yellow' },
  { value:'construction',label:'施工中',cls:'badge-blue' },
  { value:'acceptance',label:'待验收',cls:'badge-purple' },
  { value:'completed',label:'已完成',cls:'badge-green' },
  { value:'rejected',label:'已驳回',cls:'badge-red' },
  { value:'terminated',label:'已终止',cls:'badge-gray' }
];

const eqRetrofitFlowMap = {
  draft:'待立项审批',
  pending_approval:'施工中',
  construction:'待验收',
  acceptance:'已完成'
};

// ===== 4.4 设备退役/报废 数据 =====
const eqRetireData = [
  { id:'RT001',docNo:'BF-2026-00001',equipmentId:'EQ010',equipmentCode:'EQ-F002-002',equipmentName:'离心机',serialNo:'SN-2024-010',assetNo:'ZC-2024-00010',originalValue:'1850000',accumulatedDepreciation:'1110000',usedYears:6,retireType:'scrap_fault',retireTypeName:'故障报废',reason:'2025年11月离心机转鼓发生结构性裂纹，经Sigma厂家现场检测判定不可修复，继续使用存在严重安全隐患。已导出历史批次生产记录，QA已完成全批次追溯确认无质量风险。',faultDescribe:'转鼓径向裂纹长度约45mm，已穿透壁厚一半以上，X射线探伤确认。厂家出具了不可修复鉴定报告。',evaluationConclusion:'经设备工程师、工艺员、质量QA三方评估：转鼓为离心机核心承压部件，裂纹无法修补且无备件更换，整机不具备继续使用条件。GEP评估结论：直接报废。',evaluators:'周永刚(设备)/赵志强(工艺)/QA张工',evaluationOpinion:'一致同意报废处置。该设备为Sigma 6K型号，已停产，配件无法采购。转鼓裂纹属材料疲劳失效，非人为操作原因。',evaluationDate:'2026-03-15',riskAssessment:'1. 转鼓运行破裂可能导致高速转子飞出，属重大安全隐患；2. GMP生产影响：上一批次产品已完成全检放行，确认无质量风险；3. 替代方案：已启用备用高速离心机维持生产',disassemblyPlan:'1. 由维修二班执行拆机；2. 安全排空制冷剂及润滑油；3. 拆解电机、控制面板、外壳等可拆解部件',disassemblyStart:'2026-05-15',disassemblyEnd:'2026-05-18',execTeam:'维修二班',partDisposalList:[{partCode:'SP-MOTOR-002',partName:'驱动电机（45kW）',disposal:'reuse',remark:'可利旧作为备用电机'},{partCode:'SP-PANEL-003',partName:'控制面板',disposal:'reuse',remark:'拆解入库备用'},{partCode:'SP-DRUM-001',partName:'转鼓总成',disposal:'scrap',remark:'含裂纹，危废处置'},{partCode:'SP-HOUSING-002',partName:'不锈钢外壳',disposal:'scrap',remark:'金属变卖'},{partCode:'SP-REFRIG-001',partName:'制冷系统',disposal:'special',remark:'含制冷剂，按危废处理'}],disposalMethod:'拆解利旧+危废处置+金属变卖',approvalLevels:[{level:'部门审批',approver:'孙部长',opinion:'同意报废处置，请财务进行资产评估',time:'2026-03-20 10:00:00'},{level:'资产审核',approver:'刘经理（资产管理员）',opinion:'资产原值185万，累计折旧111万，账面净值74万。建议优先利旧可用部件后再进行资产报废',time:'2026-03-25 14:00:00'},{level:'财务确认',approver:'马会计',opinion:'已完成资产卡片注销，残值按5万计入营业外支出，当月计提剩余折旧。已同步SAP资产模块进行报废处理。',time:'2026-05-20 09:00:00',financeConfirmed:'true',residualValue:'50000'}],disposalStatus:'completed',disposalStatusName:'已报废封存',attachmentList:['厂家不可修复鉴定报告.pdf','X射线探伤检测报告.pdf','三方联合评估报告.pdf','安全风险评估报告.pdf','拆机处置记录及照片.pdf','SAP资产报废凭证.pdf'],overallRemark:'设备于2026年5月18日完成拆机处置，利旧部件（电机、控制面板）已入库。SAP资产同步完成报废处理。',applicant:'周永刚',applicantDept:'设备管理部',createdAt:'2026-03-10 09:00:00',updatedAt:'2026-05-20 09:00:00',log:[{time:'2026-03-10 09:00:00',action:'创建',user:'周永刚',detail:'提交离心机报废申请'},{time:'2026-03-15 14:00:00',action:'完成评估',user:'周永刚/赵志强/QA张工',detail:'三方联合评估一致同意报废'},{time:'2026-03-20 10:00:00',action:'部门审批通过',user:'孙部长',detail:'同意报废处置'},{time:'2026-03-25 14:00:00',action:'资产审核',user:'刘经理',detail:'完成资产评估'},{time:'2026-05-15 08:00:00',action:'开始拆机',user:'维修二班',detail:'开始拆机处置'},{time:'2026-05-18 17:00:00',action:'拆机完成',user:'维修二班',detail:'拆解完毕，利旧件入库'},{time:'2026-05-20 09:00:00',action:'财务销账',user:'马会计',detail:'SAP资产报废处理完成'}] },
  { id:'RT002',docNo:'BF-2026-00002',equipmentId:'EQ003',equipmentCode:'EQ-F001-003',equipmentName:'空压机',serialNo:'SN-2024-003',assetNo:'ZC-2024-00003',originalValue:'420000',accumulatedDepreciation:'280000',usedYears:8,retireType:'tech_obsolete',retireTypeName:'技术淘汰',reason:'现有37kW定频空压机能效等级仅IE2，实际比功率6.8kW/(m³/min)，能耗高。公司节能减排目标要求全部动力设备升级至IE4超高效能效。已采购新型变频空压机替代，旧机停用。',faultDescribe:'设备运转正常，但能效不达标。',evaluationConclusion:'经设备工程师评估：该空压机运行正常但能效指标已无法满足公司节能降耗目标，继续使用将导致能源成本持续超标。建议技术淘汰，利旧可用部件后变卖处置。',evaluators:'王工(设备)/张海峰(工艺)',evaluationOpinion:'同意技术淘汰。新购ATLAS Copco GA37 VSD+变频空压机已到货，能效等级IE4，比功率≤6.0kW/(m³/min)。变卖旧设备残值预估3-5万元。',evaluationDate:'2026-02-20',riskAssessment:'1. 技术淘汰不涉及安全风险；2. 新旧设备切换计划已制定，生产无间断；3. 旧机中储气罐具备压力容器检验合格证明，可利旧',disassemblyPlan:'1. 关闭进/出气阀门，排空管路；2. 拆解储气罐利旧（有合格证）；3. 主机及电机变卖处置',disassemblyStart:'2026-04-10',disassemblyEnd:'2026-04-11',execTeam:'维修二班',partDisposalList:[{partCode:'SP-TANK-001',partName:'储气罐（500L）',disposal:'reuse',remark:'压力容器检验合格，利旧接入新系统'},{partCode:'SP-COMP-001',partName:'压缩机主机',disposal:'scrap',remark:'金属变卖'},{partCode:'SP-MOTOR-003',partName:'37kW电机',disposal:'scrap',remark:'金属变卖'},{partCode:'SP-PIPE-005',partName:'管路及阀门',disposal:'scrap',remark:'金属变卖'}],disposalMethod:'拆解利旧+金属变卖',approvalLevels:[{level:'部门审批',approver:'孙部长',opinion:'同意技术淘汰，支持节能升级',time:'2026-02-25 15:00:00'},{level:'资产审核',approver:'刘经理（资产管理员）',opinion:'账面净值14万，已计划在2026年度预算中处理',time:'2026-03-01 10:00:00'},{level:'财务确认',approver:'马会计',opinion:'SAP资产处置完成，残值4.5万，净损失9.5万计入损益',time:'2026-04-15 11:00:00',financeConfirmed:'true',residualValue:'45000'}],disposalStatus:'completed',disposalStatusName:'已报废封存',attachmentList:['新空压机能效对比分析.pdf','旧机资产评估报告.pdf','拆机处置交接单.pdf','SAP资产处置凭证.pdf'],overallRemark:'储气罐经压力容器定期检验合格，利旧接入新空压机系统。主机及电机变卖处理。',applicant:'王工',applicantDept:'设备管理部',createdAt:'2026-02-15 10:00:00',updatedAt:'2026-04-15 11:00:00',log:[{time:'2026-02-15 10:00:00',action:'创建',user:'王工',detail:'提交空压机技术淘汰申请'},{time:'2026-02-20 14:00:00',action:'完成评估',user:'王工/张海峰',detail:'评估同意技术淘汰'},{time:'2026-02-25 15:00:00',action:'部门审批通过',user:'孙部长',detail:'同意'},{time:'2026-03-01 10:00:00',action:'资产审核',user:'刘经理',detail:'完成资产评估'},{time:'2026-04-10 08:00:00',action:'开始拆机',user:'维修二班',detail:'旧机拆解'},{time:'2026-04-11 16:00:00',action:'拆机完成',user:'维修二班',detail:'拆解完毕，储气罐已接入新系统'},{time:'2026-04-15 11:00:00',action:'财务销账',user:'马会计',detail:'SAP资产处置完成'}] },
  { id:'RT003',docNo:'BF-2026-00003',equipmentId:'EQ005',equipmentCode:'EQ-F001-005',equipmentName:'贴片机',serialNo:'SN-2024-005',assetNo:'ZC-2024-00005',originalValue:'920000',accumulatedDepreciation:'460000',usedYears:5,retireType:'gmp_obsolete',retireTypeName:'GMP合规淘汰',reason:'现有贴片机JUKI JX-350使用年限近6年，控制软件版本过旧，不满足新版GMP附录对电子记录与电子签名的要求（21 CFR Part 11），JUKI已不再为该型号提供软件升级服务。',faultDescribe:'设备物理性能正常，控制系统软件合规性不达标。',evaluationConclusion:'经质量QA评估：该贴片机电子记录系统无法实现审计追踪、电子签名、权限分级管理，不符合21 CFR Part 11要求，GMP审计存在不符合项风险。且JUKI已停止该型号软件升级服务。建议GMP合规淘汰，采购新设备替代。',evaluators:'QA张工(质量)/赵志强(工艺)/李工(设备)',evaluationOpinion:'一致同意GMP合规淘汰。贴装精度已开始下降（±0.08mm→±0.12mm）。建议新购Hanwha HM520贴片机替代，新机满足21 CFR Part 11要求。',evaluationDate:'2026-05-10',riskAssessment:'1. GMP审计风险：如不更换，下一次FDA/EMA审计将开出重大不符合项；2. 生产替代：贴片产能可由外部代工厂临时承接，或启用备用贴片机分担产能；3. 旧机中部分电子元件可拆解利旧',disassemblyPlan:'1. 维修一班执行拆机；2. 精密光学元件单独包装防潮存放；3. 剩余的通用电子备件拆解入库',disassemblyStart:'',disassemblyEnd:'',execTeam:'',partDisposalList:[{partCode:'SP-OPTIC-001',partName:'贴片光学对中系统',disposal:'reuse',remark:'精密光学件拆解备用'},{partCode:'SP-BOARD-001',partName:'主控制板',disposal:'scrap',remark:'软件不兼容，无法利旧'},{partCode:'SP-FEEDER-005',partName:'送料器（20个）',disposal:'reuse',remark:'通用配件，入库备用'},{partCode:'SP-FRAME-001',partName:'机身框架',disposal:'scrap',remark:'金属变卖'}],disposalMethod:'拆解利旧+金属变卖',approvalLevels:[{level:'部门审批',approver:'孙部长',opinion:'GMP合规要求优先，同意淘汰。请配合采购尽快落实新机采购计划。',time:'2026-05-12 11:00:00'}],disposalStatus:'pending_eval',disposalStatusName:'待评估',attachmentList:['GMP合规差距分析报告.pdf','JUKI EOL声明.pdf','新机选型对比分析.pdf','产能替代方案.pdf'],overallRemark:'待完成评估后可进入拆机处置阶段。新机采购计划已启动。',applicant:'李工',applicantDept:'设备管理部',createdAt:'2026-05-08 09:00:00',updatedAt:'2026-05-12 11:00:00',log:[{time:'2026-05-08 09:00:00',action:'创建',user:'李工',detail:'提交贴片机GMP合规淘汰申请'},{time:'2026-05-12 11:00:00',action:'部门审批通过',user:'孙部长',detail:'同意淘汰'}] },
  { id:'RT004',docNo:'BF-2026-00004',equipmentId:'EQ008',equipmentCode:'EQ-F003-002',equipmentName:'叉车',serialNo:'SN-2024-008',assetNo:'ZC-2024-00008',originalValue:'280000',accumulatedDepreciation:'260000',usedYears:10,retireType:'life_expired',retireTypeName:'年限到期报废',reason:'叉车已使用10年，2026年5月达到强制报废年限。最近一次年检发现门架变形严重，液压系统多处泄漏，起重能力已不足额定负载的70%，存在严重安全隐患。',faultDescribe:'1. 货叉门架纵向变形约12mm，修正后仍不能达到标准；2. 液压泵异响，举升无力；3. 左后轮轮胎磨损超限（胎面花纹<1mm）',evaluationConclusion:'经设备工程师及安全管理员评估：叉车已达强制执行报废标准（使用年限10年+门架结构变形），液压系统和门架维修成本超过设备残值，不具备维修价值。建议整机报废处置。',evaluators:'设备管理部/安全科',evaluationOpinion:'一致同意强制报废。建议新能源电动叉车作为替换方案。',evaluationDate:'2026-05-15',riskAssessment:'1. 起重能力不足可能导致物料跌落，存在人身伤害风险；2. 门架变形可能导致货物倾覆；3. 建议暂停使用，等待拆机处置',disassemblyPlan:'叉车整机交专业报废回收公司处理（资质回收单位）',disassemblyStart:'',disassemblyEnd:'',execTeam:'',partDisposalList:[{partCode:'SP-BAT-003',partName:'铅酸蓄电池（48V）',disposal:'special',remark:'危废，交有资质的回收单位'},{partCode:'SP-TIRE-004',partName:'轮胎4只',disposal:'scrap',remark:'磨损严重，无利旧价值'},{partCode:'SP-FRAME-002',partName:'车身结构',disposal:'scrap',remark:'金属回收'}],disposalMethod:'整机交专业资质回收单位（含危废处置）',approvalLevels:[{level:'部门审批',approver:'孙部长',opinion:'同意报废。安全科出具安全检查意见后立即停用。',time:'2026-05-16 09:00:00'}],disposalStatus:'pending_approval',disposalStatusName:'待审批',attachmentList:['年检不合格报告.pdf','安全评估报告.pdf','强制报废标准对照表.pdf'],overallRemark:'叉车已于5月15日暂停使用，等待最终审批及拆机处置。建议同步启动新叉车采购流程。',applicant:'刘大伟',applicantDept:'仓储中心',createdAt:'2026-05-14 14:00:00',updatedAt:'2026-05-16 09:00:00',log:[{time:'2026-05-14 14:00:00',action:'创建',user:'刘大伟',detail:'提交叉车报废申请'},{time:'2026-05-15 10:00:00',action:'完成评估',user:'设备管理部/安全科',detail:'评估同意强制报废'},{time:'2026-05-16 09:00:00',action:'部门审批通过',user:'孙部长',detail:'同意报废'}] },
  { id:'RT005',docNo:'BF-2026-00005',equipmentId:'EQ011',equipmentCode:'EQ-F001-007',equipmentName:'混合机',serialNo:'SN-2024-011',assetNo:'ZC-2024-00011',originalValue:'360000',accumulatedDepreciation:'60000',usedYears:2,retireType:'idle_retire',retireTypeName:'闲置退役',reason:'由于生产配方调整，原用于湿法制粒的前置混合工序取消，该混合机已闲置6个月以上。短期内无重新启用计划，拟封存退役待后续调配使用。',faultDescribe:'设备状态良好，仅闲置未使用。',evaluationConclusion:'经评估确认：设备状态良好，无实质性故障。但因生产配方永久取消该工序，设备不再有使用场景。建议封存退役（非永久报废），保留设备档案，未来可调配至其他车间使用。',evaluators:'王建国(工艺)/张工(设备)',evaluationOpinion:'同意封存退役。设备目前性能正常，建议做好防锈润滑处理后封存。如后续新品研发需要混合工序，可重新启用。',evaluationDate:'2026-05-20',riskAssessment:'1. 闲置封存无安全风险；2. 封存前需排空残留物料并清洁消毒；3. 定期（每季度）开机空转防止零部件锈蚀卡死',disassemblyPlan:'整机原地封存，不拆解',disassemblyStart:'',disassemblyEnd:'',execTeam:'',partDisposalList:[],disposalMethod:'封存闲置（原地封存，保留档案）',approvalLevels:[{level:'部门审批',approver:'孙部长',opinion:'同意封存退役。要求设备管理部做好定期维护，防止封存期间设备损坏。',time:'2026-05-22 15:00:00'}],disposalStatus:'pending_disposal',disposalStatusName:'待拆机处置',attachmentList:['生产配方变更通知.pdf','设备闲置评估报告.pdf','封存维护计划.pdf'],overallRemark:'混合机封存退役（非永久报废），保留设备档案，可用于未来新品研发。封存期间每季度开机空转30分钟，每半年全面检查一次。',applicant:'王建国',applicantDept:'生产一部',createdAt:'2026-05-18 10:00:00',updatedAt:'2026-05-22 15:00:00',log:[{time:'2026-05-18 10:00:00',action:'创建',user:'王建国',detail:'提交混合机闲置退役申请'},{time:'2026-05-20 14:00:00',action:'完成评估',user:'王建国/张工',detail:'评估同意封存退役'},{time:'2026-05-22 15:00:00',action:'部门审批通过',user:'孙部长',detail:'同意封存退役'}] },
  { id:'RT006',docNo:'BF-2026-00006',equipmentId:'EQ002',equipmentCode:'EQ-F001-002',equipmentName:'注塑机',serialNo:'SN-2024-002',assetNo:'ZC-2024-00002',originalValue:'2580000',accumulatedDepreciation:'430000',usedYears:4,retireType:'scrap_fault',retireTypeName:'故障报废',reason:'注塑机合模系统主液压缸出现异常裂纹，厂家HAITIAN派遣工程师检测后判定为材料缺陷导致的结构失效，无法修复，需整机报废。该设备还在质保期内，已启动质保索赔流程。',faultDescribe:'合模主液压缸缸体出现贯穿性裂纹，液压油喷溅，设备完全停止运行。厂家出具质保索赔报告。',evaluationConclusion:'HAITIAN厂家确认：液压缸裂纹为材料缺陷，属质保范围。整机合模系统报废。建议启动质保索赔后报废整机。',evaluators:'李工(设备)/孙部长/HAITIAN工程师',evaluationOpinion:'确认整机报废。质保期内全额索赔或置换新机。',evaluationDate:'2026-05-25',riskAssessment:'1. 液压油喷溅造成地面污染，已完成清洁；2. GMP生产影响评估已出：暂停生产期间由OEM代工；3. 质保索赔启动中',disassemblyPlan:'待厂家质保赔付完成后由厂家回收残机',disassemblyStart:'',disassemblyEnd:'',execTeam:'',partDisposalList:[],disposalMethod:'厂家回收（质保索赔）',approvalLevels:[],disposalStatus:'draft',disposalStatusName:'草稿',attachmentList:['HAITIAN质保检测报告.pdf','合模系统裂纹照片.jpg','质保索赔申请书.pdf','停产影响评估.pdf'],overallRemark:'请优先推动厂家质保赔付后启动正式报废流程。',applicant:'李工',applicantDept:'设备管理部',createdAt:'2026-05-24 16:00:00',updatedAt:'2026-05-24 16:00:00',log:[{time:'2026-05-24 16:00:00',action:'创建',user:'李工',detail:'创建注塑机故障报废申请草稿'}] }
];

const eqRetireTypeOptions = [
  { value:'',label:'全部报废类型' },
  { value:'life_expired',label:'年限到期报废' },
  { value:'scrap_fault',label:'故障报废' },
  { value:'tech_obsolete',label:'技术淘汰' },
  { value:'gmp_obsolete',label:'GMP合规淘汰' },
  { value:'idle_retire',label:'闲置退役' }
];

const eqRetireStatusOptions = [
  { value:'draft',label:'草稿',cls:'badge-gray' },
  { value:'pending_eval',label:'待评估',cls:'badge-yellow' },
  { value:'pending_approval',label:'待审批',cls:'badge-blue' },
  { value:'pending_disposal',label:'待拆机处置',cls:'badge-purple' },
  { value:'completed',label:'已报废封存',cls:'badge-red' },
  { value:'rejected',label:'已驳回',cls:'badge-gray' },
  { value:'cancelled',label:'已撤销',cls:'badge-gray' }
];

const eqRetireDisposalOptions = [
  { value:'整机变卖',label:'整机变卖' },
  { value:'拆解利旧',label:'拆解利旧' },
  { value:'统一销毁',label:'统一销毁' },
  { value:'封存闲置',label:'封存闲置' },
  { value:'厂家回收',label:'厂家回收' }
];

// ===== 2.1 维修通知单 数据 =====
const mfNotificationData = [
  { id:'NF001',docNo:'TZ-2026-06001',notifyType:'fault',notifyTypeName:'故障通知单',eqId:'EQ009',eqCode:'EQ-F001-006',eqName:'包装机',location:'F001-06',locationName:'外包装线C装箱工位',workCenter:'W001',workCenterName:'维修一班',urgency:'urgent',urgencyName:'紧急',reporter:'赵志强',reporterDept:'生产一部',reportTime:'2026-05-22 08:15:00',expectFinishTime:'2026-05-22 18:00:00',status:'closed',statusName:'已关闭',relatedOrder:'GD02-2026-06001',faultTime:'2026-05-22 07:50:00',faultPhenomenon:'包装机封口工位气缸动作延迟，封口温度波动±8℃（标准±3℃），连续检出3件封口不严产品。PLC无报警但HMI显示气压偏低（0.42MPa，标准0.55MPa）。',faultPart:'SP-CYL-006（封口气缸）',faultPartName:'封口工位气缸',preliminaryCause:'压缩空气管路接头微漏导致气压下降，气缸响应延迟',impactScope:'停机，包装线C装箱工位全线停产','checkCount':null,'checkTask':null,'checkItems':null,'standardValue':null,'measuredValue':null,'checkLevel':null,'hazardCategory':null,'hazardRiskLevel':null,'hazardTempMeasure':null,remark:'包装车间主管赵志强现场确认故障，拍照留证。已启动应急，手动包装临时维持产能。',attachments:['故障现场照片.jpg','HMI气压曲线截图.png','不合格品统计表.xlsx'],createdBy:'赵志强',updatedAt:'2026-05-22 18:30:00',log:[{time:'2026-05-22 08:15:00',action:'上报',user:'赵志强',detail:'上报包装机封口故障通知单'},{time:'2026-05-22 08:30:00',action:'审核通过',user:'孙部长',detail:'紧急故障，立即派工'},{time:'2026-05-22 08:45:00',action:'转工单',user:'孙部长',detail:'生成故障维修工单GD02-2026-06001'},{time:'2026-05-22 18:30:00',action:'自动关闭',user:'系统',detail:'关联工单已完成，通知单自动关闭'}] },
  { id:'NF002',docNo:'TZ-2026-06002',notifyType:'check',notifyTypeName:'点检巡检通知单',eqId:'EQ006',eqCode:'EQ-F002-001',eqName:'反应釜',location:'F002-01',locationName:'合成车间反应区',workCenter:'W001',workCenterName:'维修一班',urgency:'normal',urgencyName:'一般',reporter:'巡检员小李',reporterDept:'生产一部',reportTime:'2026-05-25 10:00:00',expectFinishTime:'2026-05-26 18:00:00',status:'ordered',statusName:'已转工单',relatedOrder:'GD02-2026-06003',faultTime:'',faultPhenomenon:'',faultPart:'',faultPartName:'',preliminaryCause:'',impactScope:'','checkCount':'日点检',checkTask:'MT-PM-2026-001（反应釜日常点检计划）',checkItems:'搅拌桨振动值检测',standardValue:'≤2.8 mm/s RMS（ISO 10816-3 Ⅰ类）',measuredValue:'4.6 mm/s RMS，超出上限64%',checkLevel:'严重','hazardCategory':null,'hazardRiskLevel':null,'hazardTempMeasure':null,remark:'巡检员小李在日点检中发现反应釜搅拌桨振动值异常升高（4.6 > 2.8），出具异常点检报告。建议立即安排检查搅拌桨动平衡及轴承状态。',attachments:['点检记录表.pdf','振动分析仪读数截图.jpg'],createdBy:'巡检员小李',updatedAt:'2026-05-26 09:00:00',log:[{time:'2026-05-25 10:00:00',action:'上报',user:'巡检员小李',detail:'上报反应釜振动异常点检通知单'},{time:'2026-05-26 08:30:00',action:'审核通过',user:'张工',detail:'点检异常确认，安排预防性维修'},{time:'2026-05-26 09:00:00',action:'转工单',user:'张工',detail:'生成预防维修工单GD02-2026-06003'}] },
  { id:'NF003',docNo:'TZ-2026-06003',notifyType:'safety',notifyTypeName:'安全隐患通知单',eqId:'EQ001',eqCode:'EQ-F001-001',eqName:'CNC加工中心',location:'F001-01',locationName:'片剂生产线A压片工位',workCenter:'W003',workCenterName:'电气维修班',urgency:'critical',urgencyName:'特急',reporter:'安全员老马',reporterDept:'安全科',reportTime:'2026-05-26 14:00:00',expectFinishTime:'2026-05-26 20:00:00',status:'ordered',statusName:'已转工单',relatedOrder:'GD03-2026-06001',faultTime:'',faultPhenomenon:'',faultPart:'',faultPartName:'',preliminaryCause:'',impactScope:'','checkCount':null,'checkTask':null,'checkItems':null,'standardValue':null,'measuredValue':null,'checkLevel':null,'hazardCategory':'electrical',hazardCategoryName:'电气安全',hazardRiskLevel:'high',hazardTempMeasure:'已设置警戒线隔离区域，CNC加工中心已断电，操作人员已撤离。现场张贴警告标识。',remark:'安全员老马在日常安全检查中发现CNC加工中心控制柜内部380V电源线接线端子松动，存在电弧及短路起火风险。现场已采取紧急隔离措施。',attachments:['控制柜接线端子松动照片.jpg','安全警示标识张贴照片.jpg','安全巡检记录表.pdf'],createdBy:'安全员老马',updatedAt:'2026-05-26 16:00:00',log:[{time:'2026-05-26 14:00:00',action:'上报',user:'安全员老马',detail:'上报CNC加工中心控制柜电气隐患（特急）'},{time:'2026-05-26 14:15:00',action:'审核通过',user:'孙部长',detail:'电气安全隐患，优先处理'},{time:'2026-05-26 16:00:00',action:'转工单',user:'孙部长',detail:'生成紧急抢修工单GD03-2026-06001'}] },
  { id:'NF004',docNo:'TZ-2026-06004',notifyType:'fault',notifyTypeName:'故障通知单',eqId:'EQ007',eqCode:'EQ-F003-001',eqName:'纯化水泵',location:'F003-01',locationName:'原材料仓库纯化水供应系统',workCenter:'W002',workCenterName:'维修二班',urgency:'urgent',urgencyName:'紧急',reporter:'陈文博',reporterDept:'设备管理部',reportTime:'2026-05-27 06:30:00',expectFinishTime:'2026-05-27 16:00:00',status:'audited',statusName:'已审核',relatedOrder:'',faultTime:'2026-05-27 06:15:00',faultPhenomenon:'纯化水泵1#变频器显示过载报警（F007），自动停机，备用2#泵自动启动但出口压力偏低（2.1bar），仅能维持基础供水。需立即修复1#泵变频器故障。',faultPart:'SP-DRIVE-001',faultPartName:'GRUNDFOS变频器',preliminaryCause:'疑似变频器散热风扇故障导致IGBT模块过热保护触发',impactScope:'2#备用泵单独运行压力偏低，末端用水点受限','checkCount':null,'checkTask':null,'checkItems':null,'standardValue':null,'measuredValue':null,'checkLevel':null,'hazardCategory':null,'hazardRiskLevel':null,'hazardTempMeasure':null,remark:'纯化水为全厂公用工程设备，需尽快修复1#泵恢复双泵供水。',attachments:['变频器报警代码照片.jpg','1#2#泵运行参数记录.xlsx'],createdBy:'陈文博',updatedAt:'2026-05-27 10:00:00',log:[{time:'2026-05-27 06:30:00',action:'上报',user:'陈文博',detail:'上报纯化水泵变频器故障通知单'},{time:'2026-05-27 09:30:00',action:'审核通过',user:'孙部长',detail:'确认故障，安排电气维修班处理'}] },
  { id:'NF005',docNo:'TZ-2026-06005',notifyType:'check',notifyTypeName:'点检巡检通知单',eqId:'EQ010',eqCode:'EQ-F002-002',eqName:'离心机（备用）',location:'F002-02',locationName:'合成车间分离区',workCenter:'W001',workCenterName:'维修一班',urgency:'normal',urgencyName:'一般',reporter:'巡检员小王',reporterDept:'生产一部',reportTime:'2026-05-28 09:00:00',expectFinishTime:'2026-05-29 18:00:00',status:'rejected',statusName:'已驳回',relatedOrder:'',faultTime:'',faultPhenomenon:'',faultPart:'',faultPartName:'',preliminaryCause:'',impactScope:'','checkCount':'周点检',checkTask:'MT-PM-2026-003（离心机周点检计划）',checkItems:'转鼓平衡度测试',standardValue:'残余不平衡量 ≤ 2.5 g·mm/kg',measuredValue:'3.1 g·mm/kg',checkLevel:'轻微','hazardCategory':null,'hazardRiskLevel':null,'hazardTempMeasure':null,remark:'巡检员小王发现备用离心机转鼓平衡度略超标。审核驳回原因：该离心机为备用机，运行频率低（月均仅2次），建议后续可纳入定期保养处理，暂不需要单独维修工单。',attachments:['周点检记录表.pdf'],createdBy:'巡检员小王',updatedAt:'2026-05-29 10:00:00',log:[{time:'2026-05-28 09:00:00',action:'上报',user:'巡检员小王',detail:'上报离心机转鼓平衡度偏差'},{time:'2026-05-29 10:00:00',action:'审核驳回',user:'张工',detail:'驳回原因：备用机使用频率低，纳入下月定期保养计划即可'}] },
  { id:'NF006',docNo:'TZ-2026-06006',notifyType:'safety',notifyTypeName:'安全隐患通知单',eqId:'EQ002',eqCode:'EQ-F001-002',eqName:'注塑机',location:'F001-03',locationName:'胶囊生产线B填充工位',workCenter:'W001',workCenterName:'维修一班',urgency:'urgent',urgencyName:'紧急',reporter:'班组长刘刚',reporterDept:'生产二部',reportTime:'2026-05-28 15:00:00',expectFinishTime:'2026-05-30 18:00:00',status:'reported',statusName:'已上报',relatedOrder:'',faultTime:'',faultPhenomenon:'',faultPart:'',faultPartName:'',preliminaryCause:'',impactScope:'','checkCount':null,'checkTask':null,'checkItems':null,'standardValue':null,'measuredValue':null,'checkLevel':null,'hazardCategory':'gmp_clean',hazardCategoryName:'洁净区合规',hazardRiskLevel:'medium',hazardTempMeasure:'已暂停该注塑机使用，通知QA进行环境监测',remark:'班组长刘刚在B级洁净区巡检时发现注塑机操作面板背板密封胶条老化脱落，可能导致洁净区正压气流短路过量，影响洁净级别。',attachments:['密封胶条脱落照片.jpg'],createdBy:'班组长刘刚',updatedAt:'2026-05-28 15:00:00',log:[{time:'2026-05-28 15:00:00',action:'上报',user:'班组长刘刚',detail:'上报注塑机洁净区合规隐患'}] },
  { id:'NF007',docNo:'TZ-2026-06007',notifyType:'fault',notifyTypeName:'故障通知单',eqId:'EQ004',eqCode:'EQ-F001-004',eqName:'西门子系统',location:'F001-01',locationName:'片剂生产线A压片工位',workCenter:'W003',workCenterName:'电气维修班',urgency:'urgent',urgencyName:'紧急',reporter:'李明辉',reporterDept:'电气维修班',reportTime:'2026-05-29 11:00:00',expectFinishTime:'2026-05-29 20:00:00',status:'draft',statusName:'草稿',relatedOrder:'',faultTime:'2026-05-29 10:45:00',faultPhenomenon:'PLC控制系统ET200M从站DI模块通道3、5间歇性信号丢失，导致压片计数出现偏差，已产生2批次片数统计不准确。经万用表检测确认通道输入阻抗异常（8.2kΩ，标准10±0.5kΩ）。',faultPart:'SP-IO-002',faultPartName:'ET200M DI模块',preliminaryCause:'DI模块通道老化导致输入阻抗漂移，信号采样不稳定',impactScope:'压片计数偏差影响批记录准确性（GMP范畴），但未影响设备正常运转','checkCount':null,'checkTask':null,'checkItems':null,'standardValue':null,'measuredValue':null,'checkLevel':null,'hazardCategory':null,'hazardRiskLevel':null,'hazardTempMeasure':null,remark:'草稿状态，待补充IO模块备件库存情况后提交上报。',attachments:[],createdBy:'李明辉',updatedAt:'2026-05-29 11:00:00',log:[{time:'2026-05-29 11:00:00',action:'创建草稿',user:'李明辉',detail:'创建故障通知单草稿'}] },
  { id:'NF008',docNo:'TZ-2026-06008',notifyType:'safety',notifyTypeName:'安全隐患通知单',eqId:'EQ012',eqCode:'EQ-F001-008',eqName:'压片机',location:'F001-01',locationName:'片剂生产线A压片工位',workCenter:'W001',workCenterName:'维修一班',urgency:'critical',urgencyName:'特急',reporter:'安全员老马',reporterDept:'安全科',reportTime:'2026-05-29 13:30:00',expectFinishTime:'2026-05-29 22:00:00',status:'closed',statusName:'已关闭',relatedOrder:'GD03-2026-06002',faultTime:'',faultPhenomenon:'',faultPart:'',faultPartName:'',preliminaryCause:'',impactScope:'','checkCount':null,'checkTask':null,'checkItems':null,'standardValue':null,'measuredValue':null,'checkLevel':null,'hazardCategory':'mechanical',hazardCategoryName:'机械安全',hazardRiskLevel:'high',hazardTempMeasure:'已设置围栏隔离，压片机上冲安全门已锁定，操作人员已撤离。立即联系维修一班确认。',remark:'压片机上冲安全门联锁开关接触不良，安全回路偶尔间歇断开，安全PLC已记录12次异常触发（最近1小时）。虽未导致停机但随时可能误触发紧急停止引发模具损坏。',attachments:['安全门联锁检测照片.jpg','安全PLC日志截图.jpg'],createdBy:'安全员老马',updatedAt:'2026-05-29 20:00:00',log:[{time:'2026-05-29 13:30:00',action:'上报',user:'安全员老马',detail:'特急安全隐患上报'},{time:'2026-05-29 13:45:00',action:'审核通过',user:'孙部长',detail:'高优先级安全风险，立即派工'},{time:'2026-05-29 14:00:00',action:'转工单',user:'孙部长',detail:'生成紧急抢修工单'},{time:'2026-05-29 20:00:00',action:'自动关闭',user:'系统',detail:'关联紧急抢修工单已完成'}] }
];

const mfNotifyTypeOptions = [
  { value:'',label:'全部类型' },
  { value:'fault',label:'故障通知单' },
  { value:'check',label:'点检巡检通知单' },
  { value:'safety',label:'安全隐患通知单' }
];

const mfNotifyStatusOptions = [
  { value:'draft',label:'草稿',cls:'badge-gray' },
  { value:'reported',label:'已上报',cls:'badge-blue' },
  { value:'audited',label:'已审核',cls:'badge-yellow' },
  { value:'ordered',label:'已转工单',cls:'badge-green' },
  { value:'rejected',label:'已驳回',cls:'badge-red' },
  { value:'closed',label:'已关闭',cls:'badge-gray' },
  { value:'cancelled',label:'已作废',cls:'badge-gray' }
];

const mfNotifyUrgencyOptions = [
  { value:'',label:'全部紧急等级' },
  { value:'normal',label:'一般' },
  { value:'urgent',label:'紧急' },
  { value:'critical',label:'特急' }
];

const mfNotifyHazardCategoryOptions = [
  { value:'',label:'请选择隐患类别' },
  { value:'mechanical',label:'机械安全' },
  { value:'electrical',label:'电气安全' },
  { value:'fire',label:'消防安全' },
  { value:'gmp_clean',label:'洁净区合规' },
  { value:'gmp_risk',label:'GMP风险' },
  { value:'other',label:'其他' }
];

// ===== 2.2 维修工单 数据 =====
const mfOrderData = [
  { id:'MO001',docNo:'GD02-2026-06001',orderType:'PM02',orderTypeName:'故障维修工单',sourceType:'notification',sourceNo:'TZ-2026-06001',eqId:'EQ009',eqCode:'EQ-F001-006',eqName:'包装机',location:'F001-06',locationName:'外包装线C装箱工位',workCenter:'W001',workCenterName:'维修一班',planStart:'2026-05-22 09:00:00',planEnd:'2026-05-22 17:00:00',actualStart:'2026-05-22 09:00:00',actualEnd:'2026-05-22 16:30:00',priority:'high',priorityName:'高',title:'包装机封口工位气缸维修',desc:'修复封口工位气缸动作延迟及温度波动问题，更换压缩空气管路接头',gmpReq:'包装车间为一般生产区，注意包装材料污染防护。维修后需试机确认封口质量（连续5次合格）','orderStatus':'closed','orderStatusName':'已关闭',creator:'孙部长',creatorTime:'2026-05-22 08:45:00',assignTo:'刘建国',assignTeam:'维修一班',assignTime:'2026-05-22 08:50:00',executor:'刘建国/周永刚','execStatus':'',taskListId:'',ops:[{seq:'1',content:'压缩空气管路检漏',stdHours:'0.5',planHours:'1',require:'分段检漏所有接头',safetyTip:'先关断主气源阀门'},{seq:'2',content:'更换泄漏接头密封垫',stdHours:'1',planHours:'1',require:'使用原厂密封垫','safetyTip':'防夹手'},{seq:'3',content:'测试气缸动作时间及封口温度',stdHours:'0.5',planHours:'0.5',require:'动作延迟<0.3s，温度±3℃内',safetyTip:''},{seq:'4',content:'连续5次封口质量检测',stdHours:'0.5',planHours:'0.5',require:'密封强度>15N/cm',safetyTip:''}],parts:[{matCode:'SP-SEAL-010',matName:'接头密封垫',spec:'DN10',unit:'个',planQty:3,actualQty:2,stock:8,warehouse:'备件库A',batch:''},{matCode:'SP-CONN-001',matName:'快插接头',spec:'DN10',unit:'个',planQty:1,actualQty:0,stock:3,warehouse:'备件库A',batch:''}],pickedAt:'2026-05-22 09:15:00',execLog:{actualStart:'2026-05-22 09:00:00',actualEnd:'2026-05-22 16:30:00',steps:[{step:'管路检漏',content:'逐点检漏发现2#弯头处泄漏',issue:'密封垫老化开裂',dispose:'更换全部3个接头密封垫'},{step:'更换密封垫',content:'更换DN10蓝色密封垫3个',issue:'',dispose:''},{step:'测试',content:'气缸动作时间0.22s，温度±2.5℃，符合要求',issue:'',dispose:''}],photos:['维修前后对比照.jpg'],rootCause:'密封垫橡胶老化（使用3年），压缩空气微漏导致气压下降0.13MPa',actualHours:{normal:5,overtime:1,auxiliary:0.5},participants:['刘建国(5h)','周永刚(1.5h)'],workReport:'全部接头更换密封垫，气压恢复至0.56MPa，封口质量检测连续5次合格。',selfCheck:'合格',remainIssue:''},acceptDate:'2026-05-22 17:00:00',acceptor:'赵志强',acceptResult:'合格',acceptOpinion:'封口质量确认合格，包装线恢复正常生产。维修效率满意。',settlement:{stdHours:2.5,planHours:3.5,actualHours:6.5,hourDiff:3,hourDiffReason:'密封垫更换数量超出预期（原计划1个，实际发现3个老化）',planMaterialCost:150,actualMaterialCost:90,materialDiff:-60,materialDiffReason:'只领用密封垫2个，未使用快插接头',extraCost:0,extraCostDesc:'',totalCost:740,costSubject:'维修费-包装车间',settlementTime:'2026-05-23 09:00:00',settledBy:'马会计'},closedAt:'2026-05-23 09:30:00',syncedSAP:true,attachments:['维修报告.pdf','封口质量检测数据.xlsx'],remark:'',createdBy:'孙部长',updatedAt:'2026-05-23 09:30:00',log:[{time:'2026-05-22 08:45:00',action:'创建',user:'孙部长',detail:'由通知单TZ-2026-06001转工单'},{time:'2026-05-22 08:50:00',action:'派工',user:'孙部长',detail:'派工至维修一班刘建国'},{time:'2026-05-22 09:00:00',action:'开始施工',user:'刘建国',detail:'开始维修'},{time:'2026-05-22 16:30:00',action:'完工报工',user:'刘建国',detail:'维修完成，提交验收'},{time:'2026-05-22 17:00:00',action:'验收',user:'赵志强',detail:'验收合格'},{time:'2026-05-23 09:00:00',action:'结算',user:'马会计',detail:'财务结算完成'},{time:'2026-05-23 09:30:00',action:'关闭',user:'孙部长',detail:'工单关闭归档'}]},
  { id:'MO002',docNo:'GD03-2026-06001',orderType:'PM03',orderTypeName:'紧急抢修工单',sourceType:'notification',sourceNo:'TZ-2026-06003',eqId:'EQ001',eqCode:'EQ-F001-001',eqName:'CNC加工中心',location:'F001-01',locationName:'片剂生产线A压片工位',workCenter:'W003',workCenterName:'电气维修班',planStart:'2026-05-26 16:30:00',planEnd:'2026-05-26 20:00:00',actualStart:'2026-05-26 16:30:00',actualEnd:'2026-05-26 19:00:00',priority:'critical',priorityName:'特急',title:'CNC控制柜380V电源线接线端子修复',desc:'紧急修复控制柜接线端子松动问题，消除电弧及短路起火隐患',gmpReq:'按电气安全作业规范操作，维修前确认完全断电并挂锁','orderStatus':'closed','orderStatusName':'已关闭',creator:'孙部长',creatorTime:'2026-05-26 16:00:00',assignTo:'李明辉',assignTeam:'电气维修班',assignTime:'2026-05-26 16:15:00',executor:'李明辉/张海','execStatus':'','taskListId':'',ops:[{seq:'1',content:'控制柜完全断电并挂锁',stdHours:'0.2',planHours:'0.3',require:'确认断电后用万用表验电',safetyTip:'必须执行LOTO程序'},{seq:'2',content:'紧固接线端子并加装防松垫圈',stdHours:'0.5',planHours:'0.5',require:'所有端子力矩>=4Nm',safetyTip:'佩戴绝缘手套'},{seq:'3',content:'绝缘电阻测试',stdHours:'0.3',planHours:'0.3',require:'绝缘电阻>=20MΩ',safetyTip:''},{seq:'4',content:'通电后带载测试',stdHours:'0.5',planHours:'0.5',require:'控制柜连续运行2小时无异常',safetyTip:''}],parts:[{matCode:'SP-WASH-001',matName:'防松垫圈',spec:'M10',unit:'个',planQty:12,actualQty:12,stock:50,warehouse:'电气备件库',batch:''}],pickedAt:'2026-05-26 16:30:00',execLog:{actualStart:'2026-05-26 16:30:00',actualEnd:'2026-05-26 19:00:00',steps:[{step:'断电挂锁',content:'执行LOTO程序，确认完全断电',issue:'',dispose:''},{step:'紧固接线',content:'紧固3组380V端子，加装防松垫圈',issue:'有2个端子螺纹轻微磨损',dispose:'更换2个端子螺栓'},{step:'绝缘测试',content:'绝缘电阻32MΩ，合格',issue:'',dispose:''}],photos:['控制柜修复后照片.jpg'],rootCause:'设备安装时接线端子力矩未达到规范值（仅2.8Nm），长期振动导致松动',actualHours:{normal:2.5,overtime:0,auxiliary:0.5},participants:['李明辉(2h)','张海(1h)'],workReport:'全部接线端子紧固完成，绝缘符合要求。设备恢复运行，测试2小时无异常。','selfCheck':'合格','remainIssue':''},acceptDate:'2026-05-26 20:00:00',acceptor:'孙部长/安全员老马',acceptResult:'合格',acceptOpinion:'紧急抢修及时，消除重大安全隐患。已纳入安全巡检重点监控点位。',settlement:{stdHours:1.5,planHours:1.6,actualHours:3,hourDiff:1.4,hourDiffReason:'额外更换2个磨损端子螺栓耗时约1小时',planMaterialCost:30,actualMaterialCost:35,materialDiff:5,materialDiffReason:'增加2个端子螺栓',extraCost:0,extraCostDesc:'',totalCost:335,costSubject:'维修费-电气',settlementTime:'2026-05-27 09:00:00',settledBy:'马会计'},closedAt:'2026-05-27 09:30:00',syncedSAP:true,attachments:['LOTO程序记录.pdf','绝缘电阻测试报告.pdf','抢修完工报告.pdf'],remark:'特急工单，全流程简化。后续纳入每月电气安全巡检重点关注。',createdBy:'孙部长',updatedAt:'2026-05-27 09:30:00',log:[{time:'2026-05-26 16:00:00',action:'创建',user:'孙部长',detail:'由安全隐患通知单TZ-2026-06003转紧急抢修工单'},{time:'2026-05-26 16:15:00',action:'派工',user:'孙部长',detail:'优先派工至电气维修班'},{time:'2026-05-26 16:30:00',action:'开始施工',user:'李明辉',detail:'开始抢修'},{time:'2026-05-26 19:00:00',action:'完工报工',user:'李明辉',detail:'抢修完成'},{time:'2026-05-26 20:00:00',action:'验收',user:'孙部长/安全员老马',detail:'验收合格'},{time:'2026-05-27 09:00:00',action:'结算',user:'马会计',detail:'结算完成'},{time:'2026-05-27 09:30:00',action:'关闭',user:'孙部长',detail:'工单关闭'}] },
  { id:'MO003',docNo:'GD01-2026-06001',orderType:'PM01',orderTypeName:'预防性工单',sourceType:'schedule',sourceNo:'MT-PM-2026-001',eqId:'EQ001',eqCode:'EQ-F001-001',eqName:'CNC加工中心',location:'F001-01',locationName:'片剂生产线A压片工位',workCenter:'W001',workCenterName:'维修一班',planStart:'2026-06-05 08:00:00',planEnd:'2026-06-05 16:00:00',actualStart:'',actualEnd:'',priority:'normal',priorityName:'一般',title:'CNC加工中心月度润滑保养',desc:'按维护策略MT-PM-2026-001执行月度润滑保养：导轨润滑、主轴润滑、冷却液更换',gmpReq:'D级洁净区保养，操作人员穿戴洁净服，保养后清洁台面','orderStatus':'dispatched','orderStatusName':'已派工',creator:'系统自动',creatorTime:'2026-05-29 08:00:00',assignTo:'周永刚',assignTeam:'维修一班',assignTime:'2026-05-29 09:00:00',executor:'','execStatus':'','taskListId':'MT-PM-2026-001',ops:[{seq:'1',content:'X/Y/Z轴导轨清洁润滑',stdHours:'1',planHours:'1',require:'使用Mobil Vactra No.2导轨油',safetyTip:''},{seq:'2',content:'主轴锥孔清洁润滑',stdHours:'0.5',planHours:'0.5',require:'使用Kluber Isoflex NBU15润滑脂',safetyTip:''},{seq:'3',content:'冷却液更换及水箱清洗',stdHours:'1',planHours:'1',require:'冷却液浓度8-10%',safetyTip:'佩戴手套口罩'},{seq:'4',content:'全轴归零精度检查',stdHours:'0.5',planHours:'0.5',require:'重复定位精度<=+/-0.005mm',safetyTip:''},{seq:'5',content:'运行测试及记录',stdHours:'0.5',planHours:'0.5',require:'空运行30分钟无异常异响',safetyTip:''}],parts:[{matCode:'SP-LUBE-001',matName:'导轨油Mobil Vactra No.2',spec:'20L/桶',unit:'L',planQty:5,actualQty:0,stock:120,warehouse:'润滑品库',batch:''},{matCode:'SP-LUBE-002',matName:'润滑脂Kluber Isoflex NBU15',spec:'400g/支',unit:'g',planQty:50,actualQty:0,stock:800,warehouse:'润滑品库',batch:''},{matCode:'SP-COOL-001',matName:'切削冷却液Blaser BC',spec:'20L/桶',unit:'L',planQty:15,actualQty:0,stock:80,warehouse:'化学品库',batch:''}],pickedAt:'',execLog:null,acceptDate:'',acceptor:'',acceptResult:'',acceptOpinion:'',settlement:null,closedAt:'',syncedSAP:false,attachments:['维护策略MT-PM-2026-001.pdf'],remark:'2026年6月预防性工单，系统按季度维护计划自动生成。',createdBy:'系统自动',updatedAt:'2026-05-29 09:00:00',log:[{time:'2026-05-29 08:00:00',action:'系统生成',user:'系统',detail:'按维护策略自动生成月度润滑工单'},{time:'2026-05-29 09:00:00',action:'派工',user:'孙部长',detail:'派工至维修一班周永刚'}] },
  { id:'MO004',docNo:'GD02-2026-06002',orderType:'PM02',orderTypeName:'故障维修工单',sourceType:'notification',sourceNo:'TZ-2026-06004',eqId:'EQ007',eqCode:'EQ-F003-001',eqName:'纯化水泵',location:'F003-01',locationName:'原材料仓库纯化水供应系统',workCenter:'W003',workCenterName:'电气维修班',planStart:'2026-05-28 08:00:00',planEnd:'2026-05-28 16:00:00',actualStart:'2026-05-28 08:30:00',actualEnd:'',priority:'high',priorityName:'高',title:'纯化水泵1#变频器故障维修',desc:'检测并修复变频器F007过载报警，恢复1#2#双泵供水',gmpReq:'纯化水系统维修需按洁净操作规范执行，维修前后进行水质检测','orderStatus':'executing','orderStatusName':'执行中',creator:'孙部长/陈文博',creatorTime:'2026-05-27 10:00:00',assignTo:'李明辉',assignTeam:'电气维修班',assignTime:'2026-05-27 14:00:00',executor:'李明辉/张海','execStatus':'维修中',taskListId:'',ops:[{seq:'1',content:'变频器断电后拆机检查散热系统',stdHours:'0.5',planHours:'1',require:'记录变频器参数','safetyTip':'断电5分钟后开始操作'},{seq:'2',content:'检测IGBT模块及整流桥',stdHours:'1',planHours:'1.5',require:'使用万用表检测','safetyTip':'防止静电损坏'},{seq:'3',content:'更换散热风扇及清洁风道',stdHours:'0.5',planHours:'1',require:'使用原装散热风扇','safetyTip':''},{seq:'4',content:'恢复通电后负载测试',stdHours:'1',planHours:'1',require:'满载运行1小时无报警','safetyTip':''}],parts:[{matCode:'SP-FAN-002',matName:'变频器散热风扇',spec:'D1751S24B',unit:'个',planQty:1,actualQty:0,stock:2,warehouse:'电气备件库',batch:'B2405-001'},{matCode:'SP-PASTE-001',matName:'导热硅脂',spec:'10g',unit:'g',planQty:5,actualQty:0,stock:20,warehouse:'电气备件库',batch:''}],pickedAt:'2026-05-28 08:30:00',execLog:{actualStart:'2026-05-28 08:30:00',actualEnd:'',steps:[{step:'拆机检查',content:'确认散热风扇停转，风道积尘严重',issue:'风扇轴承卡死',dispose:'更换新风扇全部清洁风道'},{step:'IGBT模块检测',content:'IGBT模块压降正常，整流桥正常',issue:'',dispose:''}],photos:[],rootCause:'散热风扇轴承磨损卡死，导致IGBT模块温度过高触发过载保护。变频器累计运行约18000小时超风扇使用寿命（15000h）。',actualHours:{normal:3,overtime:0,auxiliary:0.5},participants:['李明辉(2.5h)','张海(1h)'],workReport:'散热风扇已更换，风道清洁完成，待通电测试。','selfCheck':'','remainIssue':''},acceptDate:'',acceptor:'',acceptResult:'',acceptOpinion:'',settlement:null,closedAt:'',syncedSAP:false,attachments:['变频器报警记录.pdf'],remark:'执行中，预计今日完成负载测试后完工。',createdBy:'孙部长/陈文博',updatedAt:'2026-05-28 16:00:00',log:[{time:'2026-05-27 10:00:00',action:'创建',user:'孙部长',detail:'由通知单TZ-2026-06004转工单'},{time:'2026-05-27 14:00:00',action:'派工',user:'孙部长',detail:'派工至电气维修班李明辉'},{time:'2026-05-28 08:30:00',action:'开始施工',user:'李明辉',detail:'开始维修作业'}] },
  { id:'MO005',docNo:'GD03-2026-06002',orderType:'PM03',orderTypeName:'紧急抢修工单',sourceType:'notification',sourceNo:'TZ-2026-06008',eqId:'EQ012',eqCode:'EQ-F001-008',eqName:'压片机',location:'F001-01',locationName:'片剂生产线A压片工位',workCenter:'W001',workCenterName:'维修一班',planStart:'2026-05-29 14:30:00',planEnd:'2026-05-29 20:00:00',actualStart:'2026-05-29 14:30:00',actualEnd:'2026-05-29 19:00:00',priority:'critical',priorityName:'特急',title:'压片机上冲安全门联锁开关修复',desc:'紧急修复安全门联锁开关接触不良问题，消除误触发紧急停止风险',gmpReq:'B级洁净区作业，穿戴洁净服','orderStatus':'acceptance',orderStatusName:'待验收',creator:'孙部长',creatorTime:'2026-05-29 14:00:00',assignTo:'刘建国',assignTeam:'维修一班',assignTime:'2026-05-29 14:15:00',executor:'刘建国/周永刚','execStatus':'完工待验收',taskListId:'',ops:[{seq:'1',content:'安全门断电后拆检联锁开关',stdHours:'0.5',planHours:'1',require:'断开安全回路电源','safetyTip':'断电后验电'},{seq:'2',content:'更换联锁开关及触点',stdHours:'0.5',planHours:'0.5',require:'使用原厂安全门联锁开关','safetyTip':'注意安装方向'},{seq:'3',content:'安全回路测试5次',stdHours:'0.5',planHours:'0.5',require:'每次开关触发安全回路均正常响应','safetyTip':''}],parts:[{matCode:'SP-SW-001',matName:'安全门联锁开关',spec:'FK-M12',unit:'个',planQty:1,actualQty:1,stock:3,warehouse:'备件库A',batch:'L2408-12'}],pickedAt:'2026-05-29 14:30:00',execLog:{actualStart:'2026-05-29 14:30:00',actualEnd:'2026-05-29 19:00:00',steps:[{step:'拆检联锁',content:'发现联锁开关触点氧化且有机械磨损',issue:'触点镀银层磨损严重',dispose:'更换新联锁开关'},{step:'更换联锁',content:'安装FK-M12新开关并调整安装位置',issue:'',dispose:''},{step:'安全回路测试',content:'10次开关测试安全回路响应均正常',issue:'',dispose:''}],photos:['旧联锁触点磨损照.jpg','新联锁安装后照片.jpg'],rootCause:'联锁开关累计动作约80万次超出使用寿命（60万次），触点镀银层磨损及氧化导致接触电阻增大',actualHours:{normal:3,overtime:1,auxiliary:0.5},participants:['刘建国(3h)','周永刚(1.5h)'],workReport:'联锁开关更换完毕，安全回路测试10次合格。确认压片机可恢复生产。','selfCheck':'合格','remainIssue':''},acceptDate:'',acceptor:'',acceptResult:'',acceptOpinion:'',settlement:null,closedAt:'',syncedSAP:false,attachments:['安全回路测试记录.xlsx'],remark:'待生产部门确认压片机可恢复生产后进行联合验收。',createdBy:'孙部长',updatedAt:'2026-05-29 19:30:00',log:[{time:'2026-05-29 14:00:00',action:'创建',user:'孙部长',detail:'由安全隐患通知单TZ-2026-06008转紧急抢修工单'},{time:'2026-05-29 14:15:00',action:'派工',user:'孙部长',detail:'派工至维修一班刘建国'},{time:'2026-05-29 14:30:00',action:'开始施工',user:'刘建国',detail:'开始抢修联锁开关'},{time:'2026-05-29 19:00:00',action:'完工报工',user:'刘建国',detail:'联锁开关更换及测试完成'}] },
  { id:'MO006',docNo:'GD04-2026-06001',orderType:'PM04',orderTypeName:'大修改造工单',sourceType:'manual',sourceNo:'',eqId:'EQ006',eqCode:'EQ-F002-001',eqName:'反应釜',location:'F002-01',locationName:'合成车间反应区',workCenter:'W001',workCenterName:'维修一班',planStart:'2026-07-01 08:00:00',planEnd:'2026-07-10 17:00:00',actualStart:'',actualEnd:'',priority:'normal',priorityName:'一般',title:'反应釜年度大修-搅拌系统整体检修及密封升级',desc:'对反应釜进行年度大修，包含搅拌桨、机械密封、轴承全面检修更换、内壁检查、管道清洗',gmpReq:'A级洁净区大修，施工全程需洁净防护，开工前完成环境隔离方案审批。大修后需进行完整IQ/OQ/PQ验证。','orderStatus':'draft',orderStatusName:'草稿',creator:'周永刚',creatorTime:'2026-05-25 10:00:00',assignTo:'',assignTeam:'维修一班',assignTime:'',executor:'','execStatus':'',taskListId:'MT-PM-2026-008',ops:[{seq:'1',content:'排空物料并进行CIP清洗',stdHours:'2',planHours:'3',require:'残留检测合格',safetyTip:''},{seq:'2',content:'拆卸搅拌桨及机械密封',stdHours:'2',planHours:'2',require:'标记安装方向',safetyTip:'防止重物坠落'},{seq:'3',content:'超声波测厚及内壁检查',stdHours:'1.5',planHours:'2',require:'壁厚减薄率<10%',safetyTip:'受限空间作业需通风'},{seq:'4',content:'更换机械密封及搅拌桨',stdHours:'3',planHours:'4',require:'安装力矩符合规范',safetyTip:''},{seq:'5',content:'更换上下轴承',stdHours:'2',planHours:'2',require:'使用指定品牌轴承','safetyTip':''},{seq:'6',content:'管路及阀门检修',stdHours:'3',planHours:'3',require:'阀门试压合格','safetyTip':''},{seq:'7',content:'整体安装及密封测试',stdHours:'2',planHours:'3',require:'48小时保压测试',safetyTip:''},{seq:'8',content:'IQ/OQ/PQ验证',stdHours:'4',planHours:'8',require:'所有验证项合格','safetyTip':''}],parts:[{matCode:'SP-AGI-001-V2',matName:'哈氏合金搅拌桨',spec:'C-276',unit:'套',planQty:1,actualQty:0,stock:0,warehouse:'定制品',batch:''},{matCode:'SP-SEAL-001-V2',matName:'BURGMANN双端面机械密封',spec:'DN80',unit:'套',planQty:1,actualQty:0,stock:0,warehouse:'定制品',batch:''},{matCode:'SP-BEAR-001',matName:'上轴承',spec:'SKF 6313',unit:'个',planQty:1,actualQty:0,stock:2,warehouse:'备件库B',batch:''},{matCode:'SP-BEAR-002',matName:'下轴承',spec:'SKF 6317',unit:'个',planQty:1,actualQty:0,stock:1,warehouse:'备件库B',batch:''},{matCode:'SP-GASKET-001',matName:'PTFE密封垫片（全规格）',spec:'各规格',unit:'套',planQty:1,actualQty:0,stock:3,warehouse:'备件库B',batch:''}],pickedAt:'',execLog:null,acceptDate:'',acceptor:'',acceptResult:'',acceptOpinion:'',settlement:null,closedAt:'',syncedSAP:false,attachments:['反应釜大修方案.pdf','机械密封安装规范.pdf','IQOQPQ验证计划.pdf'],remark:'年度大修计划项目，搅拌桨及机械密封为定制件，需提前1个月下单采购。大修预计停机10天，请生产部门协调排产。',createdBy:'周永刚',updatedAt:'2026-05-25 10:00:00',log:[{time:'2026-05-25 10:00:00',action:'创建草稿',user:'周永刚',detail:'创建年度大修工单草稿'}] }
];

const mfOrderTypeOptions = [
  { value:'',label:'全部工单类型' },
  { value:'PM01',label:'预防性工单（PM01）' },
  { value:'PM02',label:'故障维修工单（PM02）' },
  { value:'PM03',label:'紧急抢修工单（PM03）' },
  { value:'PM04',label:'大修改造工单（PM04）' }
];

const mfOrderStatusOptions = [
  { value:'draft',label:'草稿',cls:'badge-gray' },
  { value:'released',label:'已下达/待派工',cls:'badge-blue-light' },
  { value:'dispatched',label:'已派工',cls:'badge-blue' },
  { value:'executing',label:'执行中',cls:'badge-yellow' },
  { value:'paused',label:'暂停',cls:'badge-orange' },
  { value:'acceptance',label:'待验收',cls:'badge-purple' },
  { value:'settlement',label:'待结算',cls:'badge-teal' },
  { value:'closed',label:'已关闭',cls:'badge-green' },
  { value:'cancelled',label:'已作废',cls:'badge-gray' }
];

const mfOrderPriorityOptions = [
  { value:'',label:'全部优先级' },
  { value:'critical',label:'特急' },
  { value:'high',label:'高' },
  { value:'normal',label:'一般' },
  { value:'low',label:'低' }
];

const mfOrderSourceOptions = [
  { value:'',label:'全部来源' },
  { value:'notification',label:'来自维修通知单' },
  { value:'schedule',label:'维护策略自动生成' },
  { value:'manual',label:'手动创建' }
];

// ===== 3. 预防性维护 数据 =====
const pmMaintenanceTypes = [
  { value:'daily',label:'日常点检' },
  { value:'weekly',label:'周保养' },
  { value:'monthly',label:'月保养' },
  { value:'quarterly',label:'季度保养' },
  { value:'semi-annual',label:'半年保养' },
  { value:'annual',label:'年度大修' },
  { value:'special',label:'专项合规检查' }
];

const pmPlanStatusOptions = [
  { value:'active',label:'已生效',cls:'badge-green' },
  { value:'inactive',label:'已失效',cls:'badge-red' }
];

const pmPriorityOptions = [
  { value:'normal',label:'一般' },
  { value:'important',label:'重要' },
  { value:'critical',label:'关键' }
];

const pmTriggerTypes = [
  { value:'time',label:'时间周期触发' },
  { value:'hours',label:'运行小时触发' },
  { value:'counter',label:'设备计数器触发' },
  { value:'combined',label:'组合触发' }
];

const pmScheduleStatusOptions = [
  { value:'draft',label:'草稿',cls:'badge-gray' },
  { value:'active',label:'已启用',cls:'badge-green' },
  { value:'paused',label:'已暂停',cls:'badge-yellow' },
  { value:'stopped',label:'已终止',cls:'badge-red' }
];

const pmGenStatusOptions = [
  { value:'success',label:'生成成功',cls:'badge-green' },
  { value:'failed',label:'生成失败',cls:'badge-red' },
  { value:'skipped',label:'已跳过',cls:'badge-yellow' },
  { value:'pending',label:'待生成',cls:'badge-blue' }
];

// ===== 3.1 维护计划定义 数据 =====
const pmPlanData = [
  { id:'PL001',code:'JH-20260401-001',name:'离心泵月度保养计划',maintenanceType:'monthly',maintenanceTypeName:'月保养',eqCategory:'生产设备',eqGroup:'输送设备',workCenter:'WC001',workCenterName:'维修一班',stdHours:'3',priority:'important',priorityName:'重要',version:'V2.1',effectiveDate:'2026-01-01',expireDate:'2028-12-31',creator:'孙部长',creatorTime:'2026-01-01 08:00:00',reviewer:'质量负责人',reviewTime:'2026-01-03 10:00:00',status:'active',statusName:'已生效',syncSAP:true,remark:'适用于所有离心泵类设备月度保养',ops:[{seq:'1',content:'检查泵体运行振动',guide:'使用振动测量仪检测泵体、电机轴承振动值',safety:'断电后操作，确认电源已断开',gmp:'洁净区操作需穿戴洁净服',stdHours:'0.5',operator:'维修工'},{seq:'2',content:'更换机械密封',guide:'拆卸旧密封件，清洁密封腔，安装新密封件',safety:'防夹手，佩戴防护手套',gmp:'密封件更换后需验证密封性',stdHours:'1',operator:'维修工'},{seq:'3',content:'润滑油更换',guide:'排放旧油，清洗油箱，加注新润滑油至标准油位',safety:'热油烫伤风险，停机冷却后操作',gmp:'更换润滑油需记录型号及更换日期',stdHours:'1',operator:'润滑工'},{seq:'4',content:'电机绝缘检测',guide:'使用兆欧表检测电机绕组绝缘电阻',safety:'必须完全断电，执行LOTO',gmp:'绝缘电阻需≥20MΩ，记录检测值',stdHours:'0.5',operator:'电气工'}],parts:[{matCode:'SP-SEAL-020',matName:'机械密封',spec:'DN25',unit:'套',planQty:1,isKey:true,replaceCycle:'12个月',remark:'原厂密封件'},{matCode:'SP-LUBE-001',matName:'导轨油Mobil Vactra No.2',spec:'20L/桶',unit:'L',planQty:2,isKey:false,replaceCycle:'每次更换',remark:''},{matCode:'SP-FILTER-010',matName:'油滤器',spec:'10μm',unit:'个',planQty:1,isKey:false,replaceCycle:'6个月',remark:''}],devices:[{eqId:'EQ007',eqCode:'EQ-F003-001',eqName:'纯化水泵',location:'F003-L01',locationName:'原材料仓库',bindTime:'2026-01-01 08:30:00'}],attachments:[{name:'离心泵月保养SOP.pdf',size:'1.2MB',uploadTime:'2026-01-01'},{name:'机械密封更换作业指导书.docx',size:'850KB',uploadTime:'2026-01-01'}]},
  { id:'PL002',code:'JH-20260415-002',name:'CNC加工中心月度润滑保养计划',maintenanceType:'monthly',maintenanceTypeName:'月保养',eqCategory:'生产设备',eqGroup:'机械加工设备',workCenter:'WC001',workCenterName:'维修一班',stdHours:'3.5',priority:'critical',priorityName:'关键',version:'V1.0',effectiveDate:'2026-04-01',expireDate:'2028-03-31',creator:'孙部长',creatorTime:'2026-04-15 09:00:00',reviewer:'质量负责人',reviewTime:'2026-04-16 14:00:00',status:'active',statusName:'已生效',syncSAP:true,remark:'CNC加工中心定期润滑保养计划，确保设备精度',ops:[{seq:'1',content:'X/Y/Z轴导轨清洁润滑',guide:'使用Mobil Vactra No.2导轨油清洁润滑三轴导轨',safety:'操作前断电并确认停机',gmp:'D级洁净区保养，操作人员穿戴洁净服',stdHours:'1',operator:'维修工'},{seq:'2',content:'主轴锥孔清洁润滑',guide:'使用Kluber Isoflex NBU15润滑脂清洁主轴锥孔',safety:'佩戴防护眼镜',gmp:'润滑脂不可过量',stdHours:'0.5',operator:'维修工'},{seq:'3',content:'冷却液更换及水箱清洗',guide:'排放旧冷却液，清洗水箱，加注新冷却液',safety:'佩戴手套口罩',gmp:'冷却液浓度8-10%，记录浓度值',stdHours:'1',operator:'维修工'},{seq:'4',content:'全轴归零精度检查',guide:'运行回零程序，使用千分表检测重复定位精度',safety:'',gmp:'重复定位精度≤±0.005mm',stdHours:'0.5',operator:'维修工'},{seq:'5',content:'运行测试及记录',guide:'空运行30分钟，观察运行状态及异响',safety:'',gmp:'记录运行参数及检测值',stdHours:'0.5',operator:'维修工'}],parts:[{matCode:'SP-LUBE-001',matName:'导轨油Mobil Vactra No.2',spec:'20L/桶',unit:'L',planQty:5,isKey:true,replaceCycle:'每次更换',remark:''},{matCode:'SP-LUBE-002',matName:'润滑脂Kluber Isoflex NBU15',spec:'400g/支',unit:'g',planQty:50,isKey:true,replaceCycle:'每次更换',remark:''},{matCode:'SP-COOL-001',matName:'切削冷却液Blaser BC',spec:'20L/桶',unit:'L',planQty:15,isKey:false,replaceCycle:'每次更换',remark:''}],devices:[{eqId:'EQ001',eqCode:'EQ-F001-001',eqName:'CNC加工中心',location:'F001-L01-W01',locationName:'片剂生产线A-压片工位',bindTime:'2026-04-15 09:30:00'}],attachments:[{name:'维护策略MT-PM-2026-001.pdf',size:'1.5MB',uploadTime:'2026-04-15'},{name:'CNC润滑作业指导书.docx',size:'980KB',uploadTime:'2026-04-15'}]},
  { id:'PL003',code:'JH-20260510-003',name:'包装机季度保养计划',maintenanceType:'quarterly',maintenanceTypeName:'季度保养',eqCategory:'包装设备',eqGroup:'包装机',workCenter:'WC001',workCenterName:'维修一班',stdHours:'6',priority:'important',priorityName:'重要',version:'V1.2',effectiveDate:'2026-02-01',expireDate:'2028-01-31',creator:'孙部长',creatorTime:'2026-05-10 10:00:00',reviewer:'质量负责人',reviewTime:'2026-05-12 16:00:00',status:'active',statusName:'已生效',syncSAP:true,remark:'包装机季度深度保养，包含气路系统和传动系统',ops:[{seq:'1',content:'气路系统检查与清洗',guide:'检查所有气路接头、阀门、气缸，清洗滤水器、油雾器',safety:'先关断主气源阀门',gmp:'包装车间为一般生产区，注意包装材料污染防护',stdHours:'1.5',operator:'维修工'},{seq:'2',content:'传动系统润滑与皮带调整',guide:'检查同步带张力，链轮链条润滑，轴承加脂',safety:'停机后操作，防卷入',gmp:'润滑油不可滴漏到包装材料上',stdHours:'1',operator:'维修工'},{seq:'3',content:'封口质量系统校准',guide:'校准温度传感器，检查加热管电阻值',safety:'加热部件高温，冷却后操作',gmp:'校准后试封口5次合格',stdHours:'1.5',operator:'维修工'},{seq:'4',content:'电气控制柜清洁检查',guide:'清洁控制柜内部灰尘，检查接触器、继电器触点',safety:'断电后操作，验电确认',gmp:'',stdHours:'1',operator:'电气工'},{seq:'5',content:'整机联动测试',guide:'空载运行30分钟，满载测试15分钟',safety:'',gmp:'测试后产品需隔离评估',stdHours:'1',operator:'维修工'}],parts:[{matCode:'SP-SEAL-010',matName:'接头密封垫',spec:'DN10',unit:'个',planQty:6,isKey:false,replaceCycle:'每次检查更换',remark:'气路接头密封'},{matCode:'SP-BELT-001',matName:'同步带',spec:'HTD-5M-25',unit:'条',planQty:1,isKey:true,replaceCycle:'12个月',remark:'主传动同步带'},{matCode:'SP-LUBE-003',matName:'链条润滑油',spec:'500ml/瓶',unit:'ml',planQty:100,isKey:false,replaceCycle:'每次补充',remark:''},{matCode:'SP-FILTER-020',matName:'气路滤芯',spec:'5μm',unit:'个',planQty:2,isKey:true,replaceCycle:'3个月',remark:'滤水器滤芯'}],devices:[{eqId:'EQ009',eqCode:'EQ-F001-006',eqName:'包装机',location:'F001-L03-W01',locationName:'外包装线C-装箱工位',bindTime:'2026-02-01 10:00:00'}],attachments:[{name:'包装机季度保养SOP.pdf',size:'2.1MB',uploadTime:'2026-05-10'},{name:'气路系统检查表.xlsx',size:'120KB',uploadTime:'2026-05-10'}]},
  { id:'PL004',code:'JH-20260520-004',name:'压片机周保养计划',maintenanceType:'weekly',maintenanceTypeName:'周保养',eqCategory:'成型设备',eqGroup:'压片机',workCenter:'WC001',workCenterName:'维修一班',stdHours:'2',priority:'critical',priorityName:'关键',version:'V1.0',effectiveDate:'2026-05-25',expireDate:'2027-05-24',creator:'张工',creatorTime:'2026-05-20 09:00:00',reviewer:'孙部长',reviewTime:'2026-05-21 10:00:00',status:'active',statusName:'已生效',syncSAP:false,remark:'压片机周保养计划，重点检查模具磨损及润滑',ops:[{seq:'1',content:'模具磨损检查',guide:'检查上下冲头、中模磨损情况，测量间隙',safety:'停机后操作，冲头锋利注意防割伤',gmp:'B级洁净区，操作人员穿戴洁净服',stdHours:'0.5',operator:'维修工'},{seq:'2',content:'润滑系统检查',guide:'检查润滑油泵、分配器、各润滑点',safety:'',gmp:'记录润滑油品信息',stdHours:'0.5',operator:'润滑工'},{seq:'3',content:'主电机及传动检查',guide:'检查电机运行电流、传动皮带张力',safety:'断电后操作',gmp:'',stdHours:'0.5',operator:'电气工'},{seq:'4',content:'试压5批次确认',guide:'续压片5批次，检测片重差异、硬度',safety:'',gmp:'试压品单独存放，不得流入生产',stdHours:'0.5',operator:'维修工'}],parts:[{matCode:'SP-MOLD-001',matName:'冲头',spec:'φ10mm',unit:'个',planQty:2,isKey:true,replaceCycle:'按磨损情况',remark:'上冲头备用'},{matCode:'SP-LUBE-004',matName:'食品级润滑脂',spec:'400g/支',unit:'g',planQty:30,isKey:false,replaceCycle:'每次补充',remark:'H1级食品级'},{matCode:'SP-BELT-002',matName:'V型皮带',spec:'SPA-1500',unit:'条',planQty:1,isKey:false,replaceCycle:'6个月',remark:''}],devices:[{eqId:'EQ012',eqCode:'EQ-F001-008',eqName:'压片机',location:'F001-L01-W01',locationName:'片剂生产线A-压片工位',bindTime:'2026-05-20 09:30:00'}],attachments:[{name:'压片机周保养SOP.docx',size:'1.3MB',uploadTime:'2026-05-20'}]},
  { id:'PL005',code:'JH-20260525-005',name:'空压机半年保养计划',maintenanceType:'semi-annual',maintenanceTypeName:'半年保养',eqCategory:'动力设备',eqGroup:'压缩设备',workCenter:'WC002',workCenterName:'电气维修班',stdHours:'8',priority:'important',priorityName:'重要',version:'V2.0',effectiveDate:'2026-03-01',expireDate:'2028-02-28',creator:'王工',creatorTime:'2026-05-25 14:00:00',reviewer:'孙部长',reviewTime:'2026-05-26 09:00:00',status:'active',statusName:'已生效',syncSAP:true,remark:'空压机半年全面保养，含压缩机头大修',ops:[{seq:'1',content:'空气滤清器更换',guide:'更换空滤芯，清洁滤清器外壳',safety:'停机后操作',gmp:'',stdHours:'0.5',operator:'维修工'},{seq:'2',content:'油气分离器更换',guide:'排放旧油，更换油气分离器滤芯',safety:'热油烫伤风险，冷却后操作',gmp:'旧油按危废处理',stdHours:'1',operator:'维修工'},{seq:'3',content:'更换润滑油及油过滤器',guide:'排放旧油，更换油滤器，加注新润滑油',safety:'佩戴防油手套',gmp:'记录润滑油型号及更换量',stdHours:'1.5',operator:'维修工'},{seq:'4',content:'储气罐安全阀校验',guide:'拆下安全阀送检校验起跳压力',safety:'特种设备操作，由持证人员执行',gmp:'安全阀每年强制校验一次',stdHours:'2',operator:'特种设备操作员'},{seq:'5',content:'冷却器清洗',guide:'拆洗冷却器翅片，清除积尘',safety:'使用高压水枪时佩戴防护面罩',gmp:'',stdHours:'1.5',operator:'维修工'},{seq:'6',content:'控制系统检测',guide:'检查压力传感器、温度传感器、控制器参数',safety:'断电后操作',gmp:'校验压力表精度',stdHours:'1',operator:'仪表工'},{seq:'7',content:'整机试运行',guide:'加载运行2小时，记录运行参数',safety:'',gmp:'',stdHours:'0.5',operator:'维修工'}],parts:[{matCode:'SP-AIR-001',matName:'空滤芯',spec:'GA37专用',unit:'个',planQty:1,isKey:true,replaceCycle:'6个月',remark:''},{matCode:'SP-OILSEP-001',matName:'油气分离器',spec:'GA37专用',unit:'个',planQty:1,isKey:true,replaceCycle:'12个月',remark:''},{matCode:'SP-OIL-001',matName:'空压机油',spec:'20L/桶',unit:'L',planQty:20,isKey:true,replaceCycle:'每次更换',remark:'阿特拉斯专用油'},{matCode:'SP-OILFILTER-001',matName:'油过滤器',spec:'GA37专用',unit:'个',planQty:1,isKey:false,replaceCycle:'每次更换',remark:''}],devices:[{eqId:'EQ003',eqCode:'EQ-F001-003',eqName:'空压机',location:'F001-L03-W01',locationName:'外包装线C-装箱工位',bindTime:'2026-03-01 08:00:00'}],attachments:[{name:'空压机半年保养SOP.pdf',size:'3.2MB',uploadTime:'2026-05-25'},{name:'储气罐安全阀校验记录表.xlsx',size:'85KB',uploadTime:'2026-05-25'}]},
  { id:'PL006',code:'JH-20260528-006',name:'注塑机年度大修计划',maintenanceType:'annual',maintenanceTypeName:'年度大修',eqCategory:'生产设备',eqGroup:'注塑设备',workCenter:'WC003',workCenterName:'电气维修班',stdHours:'24',priority:'critical',priorityName:'关键',version:'V1.0',effectiveDate:'2026-06-15',expireDate:'2027-06-14',creator:'李工',creatorTime:'2026-05-28 09:00:00',reviewer:'',reviewTime:'',status:'active',statusName:'已生效',syncSAP:false,remark:'注塑机年度全面大修，含螺杆料筒更换评估',ops:[{seq:'1',content:'螺杆料筒磨损检查',guide:'拆卸螺杆料筒，测量间隙，评估是否需要更换',safety:'高温部件，冷却至室温后操作',gmp:'C级洁净区操作规范',stdHours:'4',operator:'维修工'},{seq:'2',content:'液压系统全面检修',guide:'更换液压油、滤芯，检查油泵、油缸、阀组',safety:'高压液压系统，泄压后操作',gmp:'旧液压油按危废处理',stdHours:'4',operator:'液压工'},{seq:'3',content:'加热系统检查与更换',guide:'测量加热圈电阻，更换老化加热圈，检查热电偶',safety:'断电后操作',gmp:'',stdHours:'3',operator:'电气工'},{seq:'4',content:'合模机构检修',guide:'检查曲臂连杆、模板平行度、锁模力校准',safety:'大型部件吊装注意安全',gmp:'',stdHours:'4',operator:'钳工'},{seq:'5',content:'电气控制系统升级',guide:'检查PLC模块、驱动器、线路老化情况',safety:'断电操作，静电防护',gmp:'记录程序版本号',stdHours:'3',operator:'电气工'},{seq:'6',content:'安全装置功能测试',guide:'测试安全门互锁、急停按钮、光幕保护',safety:'',gmp:'安全装置测试记录存档',stdHours:'2',operator:'维修工'},{seq:'7',content:'整机精度校准',guide:'校准注射量、保压时间、温度控制精度',safety:'',gmp:'校准记录存档，偏差超3%需调整',stdHours:'4',operator:'维修工'}],parts:[{matCode:'SP-SCREW-001',matName:'螺杆',spec:'MA3200专用',unit:'根',planQty:1,isKey:true,replaceCycle:'视磨损情况',remark:'根据检查结果决定是否更换'},{matCode:'SP-HYD-OIL-001',matName:'抗磨液压油',spec:'200L/桶',unit:'L',planQty:200,isKey:true,replaceCycle:'每年更换',remark:'HM46#抗磨液压油'},{matCode:'SP-HEATER-001',matName:'加热圈',spec:'φ80mm/220V/2kW',unit:'个',planQty:4,isKey:true,replaceCycle:'12个月',remark:''},{matCode:'SP-FILTER-HYD',matName:'液压油滤芯',spec:'10μm',unit:'个',planQty:2,isKey:false,replaceCycle:'每次更换',remark:''},{matCode:'SP-SEAL-KIT',matName:'密封件套件',spec:'MA3200全套',unit:'套',planQty:1,isKey:true,replaceCycle:'每年更换',remark:'OEM原厂密封套件'}],devices:[{eqId:'EQ002',eqCode:'EQ-F001-002',eqName:'注塑机',location:'F001-L02-W01',locationName:'胶囊生产线B-填充工位',bindTime:'2026-05-28 09:30:00'}],attachments:[{name:'注塑机大修技术方案.docx',size:'4.5MB',uploadTime:'2026-05-28'},{name:'MA3200维修手册.pdf',size:'8.2MB',uploadTime:'2026-05-28'}]},
  { id:'PL007',code:'JH-20260601-007',name:'纯化水系统季度点检计划',maintenanceType:'quarterly',maintenanceTypeName:'季度保养',eqCategory:'动力设备',eqGroup:'输送设备',workCenter:'WC007',workCenterName:'仓储维修班',stdHours:'4',priority:'important',priorityName:'重要',version:'V1.0',effectiveDate:'2026-06-01',expireDate:'2028-05-31',creator:'孙部长',creatorTime:'2026-06-01 08:00:00',reviewer:'质量负责人',reviewTime:'2026-06-01 10:00:00',status:'active',statusName:'已生效',syncSAP:true,remark:'纯化水输送系统季度合规点检，满足GMP水系统维保要求',ops:[{seq:'1',content:'水泵运行参数检测',guide:'检测流量、扬程、电流、温度等运行参数',safety:'',gmp:'水系统关键参数需记录并归档',stdHours:'1',operator:'维修工'},{seq:'2',content:'管路阀门密封检查',guide:'逐段检查管路接头、阀门密封性',safety:'',gmp:'密封性对水质有直接影响',stdHours:'1',operator:'维修工'},{seq:'3',content:'过滤器更换',guide:'更换精密过滤器、活性炭过滤器',safety:'佩戴手套',gmp:'过滤器更换记录追溯',stdHours:'1',operator:'维修工'},{seq:'4',content:'电导率仪校准',guide:'使用标准溶液校准在线电导率仪',safety:'',gmp:'电导率仪校验记录存档',stdHours:'1',operator:'仪表工'}],parts:[{matCode:'SP-FILTER-WATER',matName:'精密过滤器',spec:'5μm/20寸',unit:'支',planQty:2,isKey:true,replaceCycle:'季度更换',remark:'纯化水专用'},{matCode:'SP-CARBON-001',matName:'活性炭滤芯',spec:'20寸',unit:'支',planQty:1,isKey:true,replaceCycle:'季度更换',remark:''}],devices:[{eqId:'EQ007',eqCode:'EQ-F003-001',eqName:'纯化水泵',location:'F003-L01',locationName:'原材料仓库',bindTime:'2026-06-01 08:30:00'}],attachments:[{name:'纯化水系统点检SOP.pdf',size:'1.8MB',uploadTime:'2026-06-01'},{name:'水系统GMP合规检查表.xlsx',size:'95KB',uploadTime:'2026-06-01'}]}
];

// ===== 维护计划扩展字段（计划类型、周期、上次维护、关联任务清单等） =====
(function() {
  const planExt = {
    PL001: { planType:'time', cycleValue:30, cycleUnit:'天', lastMaintenanceDate:'2026-03-01', lastReading:null, currentReading:null, associatedTaskList:null, estimatedDuration:'0.5天' },
    PL002: { planType:'time', cycleValue:30, cycleUnit:'天', lastMaintenanceDate:'2026-04-01', lastReading:null, currentReading:null, associatedTaskList:{id:'TL001',PLNNR:'TL0001',PLNAL:'1'}, estimatedDuration:'0.5天' },
    PL003: { planType:'time', cycleValue:90, cycleUnit:'天', lastMaintenanceDate:'2026-02-15', lastReading:null, currentReading:null, associatedTaskList:null, estimatedDuration:'1天' },
    PL004: { planType:'time', cycleValue:7, cycleUnit:'天', lastMaintenanceDate:'2026-05-20', lastReading:null, currentReading:null, associatedTaskList:null, estimatedDuration:'0.5天' },
    PL005: { planType:'counter', cycleValue:2000, cycleUnit:'运行小时', lastMaintenanceDate:'2026-03-01', lastReading:12500, currentReading:14500, associatedTaskList:null, estimatedDuration:'1天' },
    PL006: { planType:'time', cycleValue:365, cycleUnit:'天', lastMaintenanceDate:'2026-06-15', lastReading:null, currentReading:null, associatedTaskList:{id:'TL002',PLNNR:'TL0002',PLNAL:'3'}, estimatedDuration:'3天' },
    PL007: { planType:'time', cycleValue:90, cycleUnit:'天', lastMaintenanceDate:'2026-03-01', lastReading:null, currentReading:null, associatedTaskList:{id:'TL007',PLNNR:'TL0007',PLNAL:'1'}, estimatedDuration:'0.5天' }
  };
  pmPlanData.forEach(p => { if (planExt[p.id]) Object.assign(p, planExt[p.id]); });
})();

// ===== 3.2 计划调度 数据 =====
const pmScheduleData = [
  { id:'SC001',code:'DD-20260401-001',planId:'PL001',planCode:'JH-20260401-001',planName:'离心泵月度保养计划',planType:'monthly',planTypeName:'月保养',scheduleName:'离心泵月度调度-标准',triggerType:'time',triggerTypeName:'时间周期触发',frequency:'每月',interval:1,unit:'month',execDay:25,execTime:'08:00',firstExecDate:'2026-04-25',allowEarlyDays:3,allowLateDays:2,deviceCount:1,status:'active',statusName:'已启用',lastGenTime:'2026-05-25 08:00:00',nextGenTime:'2026-06-25 08:00:00',startDate:'2026-04-01',endDate:'2028-12-31',owner:'孙部长',dept:'设备部',autoDispatch:true,autoPickRemind:true,maxBatchQty:10,holidaySkip:true,equipStopExempt:true,excludedDevices:[],remark:'标准月度调度，每月25日生成下月工单'},
  { id:'SC002',code:'DD-20260415-001',planId:'PL002',planCode:'JH-20260415-002',planName:'CNC加工中心月度润滑保养计划',planType:'monthly',planTypeName:'月保养',scheduleName:'CNC月度润滑-严格调度',triggerType:'time',triggerTypeName:'时间周期触发',frequency:'每月',interval:1,unit:'month',execDay:1,execTime:'08:00',firstExecDate:'2026-05-01',allowEarlyDays:0,allowLateDays:0,deviceCount:1,status:'active',statusName:'已启用',lastGenTime:'2026-05-01 08:00:00',nextGenTime:'2026-06-01 08:00:00',startDate:'2026-05-01',endDate:'2028-03-31',owner:'孙部长',dept:'设备部',autoDispatch:true,autoPickRemind:true,maxBatchQty:5,holidaySkip:false,equipStopExempt:true,excludedDevices:[],remark:'关键设备严格调度，不允许偏移，每月1号自动生成工单'},
  { id:'SC003',code:'DD-20260501-001',planId:'PL003',planCode:'JH-20260510-003',planName:'包装机季度保养计划',planType:'quarterly',planTypeName:'季度保养',scheduleName:'包装机季度调度',triggerType:'time',triggerTypeName:'时间周期触发',frequency:'每季度',interval:3,unit:'month',execDay:1,execTime:'08:00',firstExecDate:'2026-07-01',allowEarlyDays:5,allowLateDays:3,deviceCount:1,status:'draft',statusName:'草稿',lastGenTime:'',nextGenTime:'2026-07-01 08:00:00',startDate:'2026-07-01',endDate:'2028-01-31',owner:'孙部长',dept:'设备部',autoDispatch:false,autoPickRemind:true,maxBatchQty:5,holidaySkip:true,equipStopExempt:true,excludedDevices:[],remark:'季度调度，每季度首月1号生成工单'},
  { id:'SC004',code:'DD-20260520-001',planId:'PL004',planCode:'JH-20260520-004',planName:'压片机周保养计划',planType:'weekly',planTypeName:'周保养',scheduleName:'压片机周保养调度',triggerType:'time',triggerTypeName:'时间周期触发',frequency:'每周',interval:1,unit:'week',execDayOfWeek:1,execTime:'08:00',firstExecDate:'2026-06-01',allowEarlyDays:0,allowLateDays:0,deviceCount:1,status:'draft',statusName:'草稿',lastGenTime:'',nextGenTime:'2026-06-01 08:00:00',startDate:'2026-06-01',endDate:'2027-05-24',owner:'张工',dept:'设备部',autoDispatch:true,autoPickRemind:true,maxBatchQty:5,holidaySkip:false,equipStopExempt:true,excludedDevices:[],remark:'关键设备每周一自动生成工单，GMP严格要求不允许偏移'},
  { id:'SC005',code:'DD-20260420-001',planId:'PL005',planCode:'JH-20260525-005',planName:'空压机半年保养计划',planType:'semi-annual',planTypeName:'半年保养',scheduleName:'空压机运行时长调度',triggerType:'hours',triggerTypeName:'运行小时触发',runHours:500,initHours:3200,currentHours:3650,warnHours:50,deviceCount:1,status:'active',statusName:'已启用',lastGenTime:'2026-04-15 08:00:00',nextGenTime:'2026-10-01 08:00:00',startDate:'2026-03-01',endDate:'2028-02-28',owner:'王工',dept:'设备部',autoDispatch:true,autoPickRemind:true,maxBatchQty:5,holidaySkip:true,equipStopExempt:true,excludedDevices:[],remark:'按运行小时触发，每累计运行500小时自动生成工单'},
  { id:'SC006',code:'DD-20260515-001',planId:'PL005',planCode:'JH-20260525-005',planName:'空压机半年保养计划',planType:'semi-annual',planTypeName:'半年保养',scheduleName:'空压机时间+运行小时组合调度',triggerType:'combined',triggerTypeName:'组合触发',frequency:'每半年',interval:6,unit:'month',execDay:1,execTime:'08:00',runHours:3000,initHours:3200,currentHours:3650,warnHours:100,deviceCount:1,status:'paused',statusName:'已暂停',lastGenTime:'',nextGenTime:'',startDate:'2026-03-01',endDate:'2028-02-28',owner:'王工',dept:'设备部',autoDispatch:true,autoPickRemind:true,maxBatchQty:3,holidaySkip:true,equipStopExempt:true,excludedDevices:[],remark:'备用调度方案，同时满足时间到期和运行时长条件时才触发。当前暂停中，优先使用运行小时调度'},
  { id:'SC007',code:'DD-20260601-001',planId:'PL007',planCode:'JH-20260601-007',planName:'纯化水系统季度点检计划',planType:'quarterly',planTypeName:'季度保养',scheduleName:'纯化水系统季度调度',triggerType:'time',triggerTypeName:'时间周期触发',frequency:'每季度',interval:3,unit:'month',execDay:1,execTime:'09:00',firstExecDate:'2026-07-01',allowEarlyDays:5,allowLateDays:2,deviceCount:1,status:'active',statusName:'已启用',lastGenTime:'',nextGenTime:'2026-07-01 09:00:00',startDate:'2026-06-01',endDate:'2028-05-31',owner:'孙部长',dept:'设备部',autoDispatch:true,autoPickRemind:true,maxBatchQty:5,holidaySkip:true,equipStopExempt:true,excludedDevices:[],remark:'水系统季度合规点检调度'}
];

// ===== 3.3 自动生成预防性工单 日志数据 =====
const pmGenLogData = [
  { id:'GL001',scheduleId:'SC001',scheduleCode:'DD-20260401-001',scheduleName:'离心泵月度调度-标准',genType:'auto',genTypeName:'自动',eqCode:'EQ-F003-001',eqName:'纯化水泵',planGenTime:'2026-05-25 08:00:00',actualGenTime:'2026-05-25 08:00:02',result:'success',resultName:'生成成功',orderCode:'GD01-2026-06001',orderId:'MO003',failReason:'',operator:'系统自动',genTime:'2026-05-25 08:00:02'},
  { id:'GL002',scheduleId:'SC002',scheduleCode:'DD-20260415-001',scheduleName:'CNC月度润滑-严格调度',genType:'auto',genTypeName:'自动',eqCode:'EQ-F001-001',eqName:'CNC加工中心',planGenTime:'2026-05-01 08:00:00',actualGenTime:'2026-05-01 08:00:01',result:'success',resultName:'生成成功',orderCode:'GD01-2026-05001',orderId:'MO004',failReason:'',operator:'系统自动',genTime:'2026-05-01 08:00:01'},
  { id:'GL003',scheduleId:'SC001',scheduleCode:'DD-20260401-001',scheduleName:'离心泵月度调度-标准',genType:'auto',genTypeName:'自动',eqCode:'EQ-F003-001',eqName:'纯化水泵',planGenTime:'2026-04-25 08:00:00',actualGenTime:'2026-04-25 08:00:01',result:'success',resultName:'生成成功',orderCode:'GD01-2026-04001',orderId:'MO005',failReason:'',operator:'系统自动',genTime:'2026-04-25 08:00:01'},
  { id:'GL004',scheduleId:'SC005',scheduleCode:'DD-20260420-001',scheduleName:'空压机运行时长调度',genType:'auto',genTypeName:'自动',eqCode:'EQ-F001-003',eqName:'空压机',planGenTime:'2026-04-15 08:00:00',actualGenTime:'2026-04-15 08:00:03',result:'success',resultName:'生成成功',orderCode:'GD01-2026-04002',orderId:'MO006',failReason:'',operator:'系统自动',genTime:'2026-04-15 08:00:03'},
  { id:'GL005',scheduleId:'SC005',scheduleCode:'DD-20260420-001',scheduleName:'空压机运行时长调度',genType:'manual',genTypeName:'手动',eqCode:'EQ-F001-003',eqName:'空压机',planGenTime:'2026-04-01 08:00:00',actualGenTime:'2026-04-01 10:30:00',result:'failed',resultName:'生成失败',orderCode:'',orderId:'',failReason:'备件库存不足：空滤芯(SP-AIR-001)当前库存0，安全库存5',operator:'王工',genTime:'2026-04-01 10:30:00'},
  { id:'GL006',scheduleId:'SC002',scheduleCode:'DD-20260415-001',scheduleName:'CNC月度润滑-严格调度',genType:'manual',genTypeName:'手动',eqCode:'EQ-F001-001',eqName:'CNC加工中心',planGenTime:'2026-04-01 08:00:00',actualGenTime:'',result:'skipped',resultName:'已跳过',orderCode:'',orderId:'',failReason:'设备处于故障状态(EQ005)，自动跳过工单生成',operator:'系统自动',genTime:'2026-04-01 08:00:00'},
  { id:'GL007',scheduleId:'SC007',scheduleCode:'DD-20260601-001',scheduleName:'纯化水系统季度调度',genType:'auto',genTypeName:'自动',eqCode:'EQ-F003-001',eqName:'纯化水泵',planGenTime:'2026-07-01 09:00:00',actualGenTime:'',result:'pending',resultName:'待生成',orderCode:'',orderId:'',failReason:'',operator:'',genTime:''},
  { id:'GL008',scheduleId:'SC003',scheduleCode:'DD-20260501-001',scheduleName:'包装机季度调度',genType:'auto',genTypeName:'自动',eqCode:'EQ-F001-006',eqName:'包装机',planGenTime:'2026-07-01 08:00:00',actualGenTime:'',result:'pending',resultName:'待生成',orderCode:'',orderId:'',failReason:'',operator:'',genTime:''}
];

// ===== 6. 测量点主数据 (静态主数据) =====
const measurementPointData = [
  // P-101A 离心泵（参照PRD场景）
  { id:'MP001', code:'MP-P101A-001', name:'驱动端轴承振动', equipmentId:'EQ007', equipmentCode:'EQ-F003-001', equipmentName:'纯化水泵', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'mm/s', upperLimit:7.1, lowerLimit:null, alarmEnabled:true, qualitativeCodeGroup:'', alarmCodes:'', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'active', statusName:'启用', remark:'参照ISO 10816-3标准', createdBy:'设备管理员', createdAt:'2026-04-01 09:00:00', updatedAt:'2026-04-01 09:00:00' },
  { id:'MP002', code:'MP-P101A-002', name:'出口压力', equipmentId:'EQ007', equipmentCode:'EQ-F003-001', equipmentName:'纯化水泵', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'bar', upperLimit:8.0, lowerLimit:2.5, alarmEnabled:true, qualitativeCodeGroup:'', alarmCodes:'', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'active', statusName:'启用', remark:'工艺要求压力范围2.5-8.0bar', createdBy:'设备管理员', createdAt:'2026-04-01 09:05:00', updatedAt:'2026-04-01 09:05:00' },
  { id:'MP003', code:'MP-P101A-003', name:'润滑油状态', equipmentId:'EQ007', equipmentCode:'EQ-F003-001', equipmentName:'纯化水泵', bomComponentId:'', bomComponentName:'设备整体', type:'QLTY', typeName:'定性', unit:'', upperLimit:null, lowerLimit:null, alarmEnabled:true, qualitativeCodeGroup:'normal_abnormal', alarmCodes:'abnormal', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'active', statusName:'启用', remark:'目视检查油质及油位', createdBy:'设备管理员', createdAt:'2026-04-01 09:10:00', updatedAt:'2026-04-01 09:10:00' },
  { id:'MP004', code:'MP-P101A-004', name:'运行小时累计', equipmentId:'EQ007', equipmentCode:'EQ-F003-001', equipmentName:'纯化水泵', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'h', upperLimit:null, lowerLimit:null, alarmEnabled:false, qualitativeCodeGroup:'', alarmCodes:'', isCounter:true, initialCounter:12524, yearlyEstimate:6000, status:'active', statusName:'启用', remark:'DCS系统接口自动采集', createdBy:'设备管理员', createdAt:'2026-04-01 09:15:00', updatedAt:'2026-06-01 08:00:00' },
  // CNC加工中心
  { id:'MP005', code:'MP-CNC-001', name:'主轴振动', equipmentId:'EQ001', equipmentCode:'EQ-F001-001', equipmentName:'CNC加工中心', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'mm/s', upperLimit:4.5, lowerLimit:null, alarmEnabled:true, qualitativeCodeGroup:'', alarmCodes:'', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'active', statusName:'启用', remark:'主轴振动监测', createdBy:'设备管理员', createdAt:'2026-03-15 10:00:00', updatedAt:'2026-03-15 10:00:00' },
  { id:'MP006', code:'MP-CNC-002', name:'冷却液温度', equipmentId:'EQ001', equipmentCode:'EQ-F001-001', equipmentName:'CNC加工中心', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'℃', upperLimit:55, lowerLimit:10, alarmEnabled:true, qualitativeCodeGroup:'', alarmCodes:'', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'active', statusName:'启用', remark:'冷却液温度范围10-55℃', createdBy:'设备管理员', createdAt:'2026-03-15 10:05:00', updatedAt:'2026-03-15 10:05:00' },
  { id:'MP007', code:'MP-CNC-003', name:'累计加工件数', equipmentId:'EQ001', equipmentCode:'EQ-F001-001', equipmentName:'CNC加工中心', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'件', upperLimit:null, lowerLimit:null, alarmEnabled:false, qualitativeCodeGroup:'', alarmCodes:'', isCounter:true, initialCounter:15000, yearlyEstimate:50000, status:'active', statusName:'启用', remark:'计数器型，驱动刀具更换维护', createdBy:'设备管理员', createdAt:'2026-03-15 10:10:00', updatedAt:'2026-06-01 08:00:00' },
  // 空压机
  { id:'MP008', code:'MP-COMP-001', name:'排气压力', equipmentId:'EQ003', equipmentCode:'EQ-F001-003', equipmentName:'空压机', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'bar', upperLimit:8.5, lowerLimit:5.5, alarmEnabled:true, qualitativeCodeGroup:'', alarmCodes:'', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'active', statusName:'启用', remark:'额定排气压力7.0bar', createdBy:'设备管理员', createdAt:'2026-05-10 08:00:00', updatedAt:'2026-05-10 08:00:00' },
  { id:'MP009', code:'MP-COMP-002', name:'运行温度', equipmentId:'EQ003', equipmentCode:'EQ-F001-003', equipmentName:'空压机', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'℃', upperLimit:95, lowerLimit:null, alarmEnabled:true, qualitativeCodeGroup:'', alarmCodes:'', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'active', statusName:'启用', remark:'压缩机头温度保护', createdBy:'设备管理员', createdAt:'2026-05-10 08:05:00', updatedAt:'2026-05-10 08:05:00' },
  { id:'MP010', code:'MP-COMP-003', name:'运行小时累计', equipmentId:'EQ003', equipmentCode:'EQ-F001-003', equipmentName:'空压机', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'h', upperLimit:null, lowerLimit:null, alarmEnabled:false, qualitativeCodeGroup:'', alarmCodes:'', isCounter:true, initialCounter:3650, yearlyEstimate:5000, status:'active', statusName:'启用', remark:'DCS接口自动采集，驱动维护计划', createdBy:'设备管理员', createdAt:'2026-05-10 08:10:00', updatedAt:'2026-06-01 08:00:00' },
  // 压片机
  { id:'MP011', code:'MP-TAB-001', name:'压片压力', equipmentId:'EQ012', equipmentCode:'EQ-F001-008', equipmentName:'压片机', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'kN', upperLimit:60, lowerLimit:20, alarmEnabled:true, qualitativeCodeGroup:'', alarmCodes:'', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'active', statusName:'启用', remark:'主压力范围20-60kN', createdBy:'设备管理员', createdAt:'2026-05-15 14:00:00', updatedAt:'2026-05-15 14:00:00' },
  { id:'MP012', code:'MP-TAB-002', name:'片重差异', equipmentId:'EQ012', equipmentCode:'EQ-F001-008', equipmentName:'压片机', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'mg', upperLimit:5.0, lowerLimit:-5.0, alarmEnabled:true, qualitativeCodeGroup:'', alarmCodes:'', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'active', statusName:'启用', remark:'片重差异±5mg，超限停机', createdBy:'设备管理员', createdAt:'2026-05-15 14:05:00', updatedAt:'2026-05-15 14:05:00' },
  { id:'MP013', code:'MP-TAB-003', name:'冲头状态', equipmentId:'EQ012', equipmentCode:'EQ-F001-008', equipmentName:'压片机', bomComponentId:'', bomComponentName:'设备整体', type:'QLTY', typeName:'定性', unit:'', upperLimit:null, lowerLimit:null, alarmEnabled:true, qualitativeCodeGroup:'excellent_good_poor', alarmCodes:'poor', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'active', statusName:'启用', remark:'目视检查冲头磨损程度', createdBy:'设备管理员', createdAt:'2026-05-15 14:10:00', updatedAt:'2026-05-15 14:10:00' },
  // 包装机
  { id:'MP014', code:'MP-PKG-001', name:'封口温度', equipmentId:'EQ009', equipmentCode:'EQ-F001-006', equipmentName:'包装机', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'℃', upperLimit:180, lowerLimit:120, alarmEnabled:true, qualitativeCodeGroup:'', alarmCodes:'', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'active', statusName:'启用', remark:'热封温度120-180℃', createdBy:'设备管理员', createdAt:'2026-04-20 09:00:00', updatedAt:'2026-04-20 09:00:00' },
  { id:'MP015', code:'MP-PKG-002', name:'包装速度', equipmentId:'EQ009', equipmentCode:'EQ-F001-006', equipmentName:'包装机', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'件/分钟', upperLimit:320, lowerLimit:200, alarmEnabled:true, qualitativeCodeGroup:'', alarmCodes:'', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'active', statusName:'启用', remark:'额定速度300件/分钟', createdBy:'设备管理员', createdAt:'2026-04-20 09:05:00', updatedAt:'2026-04-20 09:05:00' },
  { id:'MP016', code:'MP-PKG-003', name:'累计产量', equipmentId:'EQ009', equipmentCode:'EQ-F001-006', equipmentName:'包装机', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'件', upperLimit:null, lowerLimit:null, alarmEnabled:false, qualitativeCodeGroup:'', alarmCodes:'', isCounter:true, initialCounter:850000, yearlyEstimate:3000000, status:'active', statusName:'启用', remark:'计数器型，驱动季度保养', createdBy:'设备管理员', createdAt:'2026-04-20 09:10:00', updatedAt:'2026-06-01 08:00:00' },
  // 反应釜
  { id:'MP017', code:'MP-RCT-001', name:'釜内温度', equipmentId:'EQ006', equipmentCode:'EQ-F002-001', equipmentName:'反应釜', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'℃', upperLimit:150, lowerLimit:-10, alarmEnabled:true, qualitativeCodeGroup:'', alarmCodes:'', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'active', statusName:'启用', remark:'反应温度范围-10~150℃', createdBy:'设备管理员', createdAt:'2026-05-01 11:00:00', updatedAt:'2026-05-01 11:00:00' },
  { id:'MP018', code:'MP-RCT-002', name:'釜内压力', equipmentId:'EQ006', equipmentCode:'EQ-F002-001', equipmentName:'反应釜', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'MPa', upperLimit:0.5, lowerLimit:-0.1, alarmEnabled:true, qualitativeCodeGroup:'', alarmCodes:'', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'active', statusName:'启用', remark:'设计压力0.5MPa', createdBy:'设备管理员', createdAt:'2026-05-01 11:05:00', updatedAt:'2026-05-01 11:05:00' },
  { id:'MP019', code:'MP-RCT-003', name:'搅拌转速', equipmentId:'EQ006', equipmentCode:'EQ-F002-001', equipmentName:'反应釜', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'rpm', upperLimit:120, lowerLimit:20, alarmEnabled:true, qualitativeCodeGroup:'', alarmCodes:'', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'active', statusName:'启用', remark:'变频调速20-120rpm', createdBy:'设备管理员', createdAt:'2026-05-01 11:10:00', updatedAt:'2026-05-01 11:10:00' },
  // 停用的测量点示例
  { id:'MP020', code:'MP-CNC-004', name:'切削液浓度（已停用）', equipmentId:'EQ001', equipmentCode:'EQ-F001-001', equipmentName:'CNC加工中心', bomComponentId:'', bomComponentName:'设备整体', type:'QTY', typeName:'定量', unit:'%', upperLimit:12, lowerLimit:5, alarmEnabled:false, qualitativeCodeGroup:'', alarmCodes:'', isCounter:false, initialCounter:null, yearlyEstimate:null, status:'inactive', statusName:'停用', remark:'已更换为在线监测系统', createdBy:'设备管理员', createdAt:'2026-02-01 10:00:00', updatedAt:'2026-04-15 16:00:00' }
];

// ===== 7. 测量数据记录 (动态业务数据) =====
const measurementRecordData = [
  // P-101A (EQ007) 纯化水泵记录
  { id:'MR001', measurementPointId:'MP001', equipmentId:'EQ007', recordTime:'2026-06-02 08:30:00', quantitativeValue:3.2, qualitativeValue:'', operator:'王工', remark:'早班巡检正常', createdAt:'2026-06-02 08:30:00' },
  { id:'MR002', measurementPointId:'MP002', equipmentId:'EQ007', recordTime:'2026-06-02 08:30:00', quantitativeValue:6.5, qualitativeValue:'', operator:'王工', remark:'', createdAt:'2026-06-02 08:30:00' },
  { id:'MR003', measurementPointId:'MP003', equipmentId:'EQ007', recordTime:'2026-06-02 08:30:00', quantitativeValue:null, qualitativeValue:'normal', operator:'王工', remark:'油质清亮，油位正常', createdAt:'2026-06-02 08:30:00' },
  { id:'MR004', measurementPointId:'MP004', equipmentId:'EQ007', recordTime:'2026-06-02 08:00:00', quantitativeValue:12548, qualitativeValue:'', operator:'DCS系统', remark:'自动采集', createdAt:'2026-06-02 08:00:00' },
  { id:'MR005', measurementPointId:'MP001', equipmentId:'EQ007', recordTime:'2026-06-01 16:00:00', quantitativeValue:7.8, qualitativeValue:'', operator:'王工', remark:'下午巡检，振动偏高', createdAt:'2026-06-01 16:00:00' },
  { id:'MR006', measurementPointId:'MP002', equipmentId:'EQ007', recordTime:'2026-06-01 16:00:00', quantitativeValue:6.3, qualitativeValue:'', operator:'王工', remark:'', createdAt:'2026-06-01 16:00:00' },
  { id:'MR007', measurementPointId:'MP003', equipmentId:'EQ007', recordTime:'2026-06-01 16:00:00', quantitativeValue:null, qualitativeValue:'abnormal', operator:'王工', remark:'目视油质发黑，建议更换', createdAt:'2026-06-01 16:00:00' },
  { id:'MR008', measurementPointId:'MP001', equipmentId:'EQ007', recordTime:'2026-06-01 08:30:00', quantitativeValue:3.5, qualitativeValue:'', operator:'王工', remark:'', createdAt:'2026-06-01 08:30:00' },
  { id:'MR009', measurementPointId:'MP002', equipmentId:'EQ007', recordTime:'2026-06-01 08:30:00', quantitativeValue:6.8, qualitativeValue:'', operator:'王工', remark:'', createdAt:'2026-06-01 08:30:00' },
  { id:'MR010', measurementPointId:'MP004', equipmentId:'EQ007', recordTime:'2026-06-01 08:00:00', quantitativeValue:12544, qualitativeValue:'', operator:'DCS系统', remark:'自动采集', createdAt:'2026-06-01 08:00:00' },
  { id:'MR011', measurementPointId:'MP001', equipmentId:'EQ007', recordTime:'2026-05-31 08:30:00', quantitativeValue:3.8, qualitativeValue:'', operator:'王工', remark:'', createdAt:'2026-05-31 08:30:00' },
  { id:'MR012', measurementPointId:'MP002', equipmentId:'EQ007', recordTime:'2026-05-31 08:30:00', quantitativeValue:6.1, qualitativeValue:'', operator:'王工', remark:'', createdAt:'2026-05-31 08:30:00' },
  // CNC加工中心 (EQ001)
  { id:'MR013', measurementPointId:'MP005', equipmentId:'EQ001', recordTime:'2026-06-02 09:00:00', quantitativeValue:2.1, qualitativeValue:'', operator:'张工', remark:'正常运行', createdAt:'2026-06-02 09:00:00' },
  { id:'MR014', measurementPointId:'MP006', equipmentId:'EQ001', recordTime:'2026-06-02 09:00:00', quantitativeValue:38.5, qualitativeValue:'', operator:'张工', remark:'', createdAt:'2026-06-02 09:00:00' },
  { id:'MR015', measurementPointId:'MP007', equipmentId:'EQ001', recordTime:'2026-06-02 09:00:00', quantitativeValue:15120, qualitativeValue:'', operator:'张工', remark:'DCS自动采集', createdAt:'2026-06-02 09:00:00' },
  { id:'MR016', measurementPointId:'MP005', equipmentId:'EQ001', recordTime:'2026-06-01 09:00:00', quantitativeValue:2.3, qualitativeValue:'', operator:'张工', remark:'', createdAt:'2026-06-01 09:00:00' },
  { id:'MR017', measurementPointId:'MP006', equipmentId:'EQ001', recordTime:'2026-06-01 09:00:00', quantitativeValue:42.0, qualitativeValue:'', operator:'张工', remark:'', createdAt:'2026-06-01 09:00:00' },
  // 空压机 (EQ003)
  { id:'MR018', measurementPointId:'MP008', equipmentId:'EQ003', recordTime:'2026-06-02 08:00:00', quantitativeValue:7.0, qualitativeValue:'', operator:'DCS系统', remark:'', createdAt:'2026-06-02 08:00:00' },
  { id:'MR019', measurementPointId:'MP009', equipmentId:'EQ003', recordTime:'2026-06-02 08:00:00', quantitativeValue:78, qualitativeValue:'', operator:'DCS系统', remark:'', createdAt:'2026-06-02 08:00:00' },
  { id:'MR020', measurementPointId:'MP010', equipmentId:'EQ003', recordTime:'2026-06-02 08:00:00', quantitativeValue:3674, qualitativeValue:'', operator:'DCS系统', remark:'累计运行小时', createdAt:'2026-06-02 08:00:00' },
  // 压片机 (EQ012)
  { id:'MR021', measurementPointId:'MP011', equipmentId:'EQ012', recordTime:'2026-06-02 08:00:00', quantitativeValue:42.5, qualitativeValue:'', operator:'李工', remark:'', createdAt:'2026-06-02 08:00:00' },
  { id:'MR022', measurementPointId:'MP012', equipmentId:'EQ012', recordTime:'2026-06-02 08:00:00', quantitativeValue:1.2, qualitativeValue:'', operator:'李工', remark:'片重差异在范围内', createdAt:'2026-06-02 08:00:00' },
  { id:'MR023', measurementPointId:'MP013', equipmentId:'EQ012', recordTime:'2026-06-02 08:00:00', quantitativeValue:null, qualitativeValue:'good', operator:'李工', remark:'冲头表面光洁', createdAt:'2026-06-02 08:00:00' },
  // 包装机 (EQ009)
  { id:'MR024', measurementPointId:'MP014', equipmentId:'EQ009', recordTime:'2026-06-02 09:00:00', quantitativeValue:155, qualitativeValue:'', operator:'赵工', remark:'', createdAt:'2026-06-02 09:00:00' },
  { id:'MR025', measurementPointId:'MP015', equipmentId:'EQ009', recordTime:'2026-06-02 09:00:00', quantitativeValue:295, qualitativeValue:'', operator:'赵工', remark:'', createdAt:'2026-06-02 09:00:00' },
  { id:'MR026', measurementPointId:'MP016', equipmentId:'EQ009', recordTime:'2026-06-02 09:00:00', quantitativeValue:852500, qualitativeValue:'', operator:'赵工', remark:'累计产量', createdAt:'2026-06-02 09:00:00' },
  // 反应釜 (EQ006) - 维修中，无最近记录
  { id:'MR027', measurementPointId:'MP017', equipmentId:'EQ006', recordTime:'2026-05-28 10:00:00', quantitativeValue:85, qualitativeValue:'', operator:'周工', remark:'维修前最后一次记录', createdAt:'2026-05-28 10:00:00' },
  { id:'MR028', measurementPointId:'MP018', equipmentId:'EQ006', recordTime:'2026-05-28 10:00:00', quantitativeValue:0.2, qualitativeValue:'', operator:'周工', remark:'', createdAt:'2026-05-28 10:00:00' }
];

// 定性代码组配置
const qualitativeCodeGroups = {
  'normal_abnormal': { name:'正常/异常', codes:['normal','abnormal'], labels:['正常','异常'] },
  'excellent_good_poor': { name:'优/良/差', codes:['excellent','good','poor'], labels:['优','良','差'] },
  'pass_fail': { name:'合格/不合格', codes:['pass','fail'], labels:['合格','不合格'] },
  'on_off': { name:'开启/关闭', codes:['on','off'], labels:['开启','关闭'] }
};

// 异常事件数据
const alertEventData = [
  { id:'AE001', equipmentId:'EQ007', measurementPointId:'MP001', recordId:'MR005', alertType:'upper_limit', description:'振动超标：驱动端轴承振动 7.8mm/s > 上限 7.1mm/s', status:'pending', statusName:'待处理', createdAt:'2026-06-01 16:00:00', handler:'' },
  { id:'AE002', equipmentId:'EQ007', measurementPointId:'MP003', recordId:'MR007', alertType:'qualitative_alarm', description:'润滑油状态异常：巡检记录为"异常"', status:'pending', statusName:'待处理', createdAt:'2026-06-01 16:00:00', handler:'' }
];

// ===== 2. 维护处理流程 V2 数据（SAP对齐）=====

// 通知单类型选项 (QMART - SAP对齐)
// ===== 三层故障代码体系 (SAP QM Catalog) =====
// 目录类型A: 故障现象 | 目录类型B: 故障原因 | 目录类型C: 解决措施
const faultCatalog = {
  A: {
    label: '故障现象',
    groups: [
      { code:'A01', name:'机械故障', subGroups:[
        { code:'A01-1', name:'旋转部件', codes:[
          { code:'A01-1-01', name:'轴承异响/振动异常' },
          { code:'A01-1-02', name:'传动部件磨损/断裂' }
        ]},
        { code:'A01-2', name:'密封与连接', codes:[
          { code:'A01-2-01', name:'密封失效/泄漏' },
          { code:'A01-2-02', name:'运动部件卡滞/变形' },
          { code:'A01-2-03', name:'紧固件松动/脱落' }
        ]}
      ]},
      { code:'A02', name:'电气故障', subGroups:[
        { code:'A02-1', name:'动力与控制', codes:[
          { code:'A02-1-01', name:'电机过载/过热/烧毁' },
          { code:'A02-1-02', name:'控制系统报警/死机' }
        ]},
        { code:'A02-2', name:'信号与线路', codes:[
          { code:'A02-2-01', name:'传感器信号异常/失效' },
          { code:'A02-2-02', name:'供电异常/跳闸' },
          { code:'A02-2-03', name:'线路接触不良/短路' }
        ]}
      ]},
      { code:'A03', name:'气动/液压故障', subGroups:[
        { code:'A03-1', name:'气动系统', codes:[
          { code:'A03-1-01', name:'气压不足/波动大' },
          { code:'A03-1-02', name:'执行器动作迟缓/不到位' }
        ]},
        { code:'A03-2', name:'液压系统', codes:[
          { code:'A03-2-01', name:'液压油温异常/泄漏' },
          { code:'A03-2-02', name:'阀体卡死/异常动作' }
        ]}
      ]},
      { code:'A04', name:'工艺参数异常', subGroups:[
        { code:'A04-1', name:'过程参数', codes:[
          { code:'A04-1-01', name:'温度偏差超限' },
          { code:'A04-1-02', name:'压力/流量偏离设定' }
        ]},
        { code:'A04-2', name:'产出质量', codes:[
          { code:'A04-2-01', name:'产出质量不达标' },
          { code:'A04-2-02', name:'速度/节拍异常' }
        ]}
      ]}
    ]
  },
  B: {
    label: '故障原因',
    groups: [
      { code:'B01', name:'自然损耗/老化', subGroups:[
        { code:'B01-1', name:'机械磨损', codes:[
          { code:'B01-1-01', name:'轴承/齿轮寿命到期' },
          { code:'B01-1-02', name:'密封件/皮带老化' }
        ]},
        { code:'B01-2', name:'润滑与电气', codes:[
          { code:'B01-2-01', name:'润滑不良/油脂干涸变质' },
          { code:'B01-2-02', name:'电气元件老化/性能衰退' }
        ]}
      ]},
      { code:'B02', name:'操作与使用不当', subGroups:[
        { code:'B02-1', name:'运行操作', codes:[
          { code:'B02-1-01', name:'超负荷/超速运行' },
          { code:'B02-1-02', name:'参数设置错误' }
        ]},
        { code:'B02-2', name:'检查与规范', codes:[
          { code:'B02-2-01', name:'未按时检查/点检遗漏' },
          { code:'B02-2-02', name:'违规操作/误触' }
        ]}
      ]},
      { code:'B03', name:'外部环境因素', subGroups:[
        { code:'B03-1', name:'供电与气候', codes:[
          { code:'B03-1-01', name:'电源波动/电网干扰' },
          { code:'B03-1-02', name:'环境温湿度超标' }
        ]},
        { code:'B03-2', name:'物料与辅助', codes:[
          { code:'B03-2-01', name:'来料异常/异物进入' },
          { code:'B03-2-02', name:'冷却/压缩空气系统异常' }
        ]}
      ]},
      { code:'B04', name:'维护管理不足', subGroups:[
        { code:'B04-1', name:'维保与备件', codes:[
          { code:'B04-1-01', name:'维保周期过长/未按时保养' },
          { code:'B04-1-02', name:'备件/材料质量不达标' }
        ]},
        { code:'B04-2', name:'设计与安装', codes:[
          { code:'B04-2-01', name:'上次维修遗留/安装缺陷' },
          { code:'B04-2-02', name:'设计/选型不合理' }
        ]}
      ]}
    ]
  },
  C: {
    label: '解决措施',
    groups: [
      { code:'C01', name:'更换部件', subGroups:[
        { code:'C01-1', name:'机械部件', codes:[
          { code:'C01-1-01', name:'更换轴承/密封件/皮带' },
          { code:'C01-1-02', name:'更换电机/泵/阀体' }
        ]},
        { code:'C01-2', name:'电气与耗材', codes:[
          { code:'C01-2-01', name:'更换电气元件/传感器/线路' },
          { code:'C01-2-02', name:'更换过滤芯/液压油/润滑脂' }
        ]}
      ]},
      { code:'C02', name:'调整与校准', subGroups:[
        { code:'C02-1', name:'机械调整', codes:[
          { code:'C02-1-01', name:'重新对中/校准/标定' },
          { code:'C02-1-02', name:'紧固松动部件/消除间隙' }
        ]},
        { code:'C02-2', name:'参数与流体', codes:[
          { code:'C02-2-01', name:'调整参数设定值' },
          { code:'C02-2-02', name:'调整气动/液压压力流量' }
        ]}
      ]},
      { code:'C03', name:'清洁与润滑', subGroups:[
        { code:'C03-1', name:'清洁保养', codes:[
          { code:'C03-1-01', name:'清洁/除垢/除锈' },
          { code:'C03-1-02', name:'清洗管路/过滤系统' }
        ]},
        { code:'C03-2', name:'润滑维护', codes:[
          { code:'C03-2-01', name:'重新润滑/加注油脂' }
        ]}
      ]},
      { code:'C04', name:'系统修复', subGroups:[
        { code:'C04-1', name:'电控修复', codes:[
          { code:'C04-1-01', name:'PLC程序修复/重置/升级' },
          { code:'C04-1-02', name:'线路修复/重新接线' }
        ]},
        { code:'C04-2', name:'管路与应急', codes:[
          { code:'C04-2-01', name:'管路/接头修复或更换' },
          { code:'C04-2-02', name:'临时措施+计划后续大修' }
        ]}
      ]}
    ]
  }
};

// 查找目录代码的全称（3级链：代码组 → 子组 → 代码）
function getCatalogFullName(catalogType, code) {
  const cat = faultCatalog[catalogType];
  if (!cat || !code) return code || '';
  for (const grp of cat.groups) {
    if (grp.code === code) return grp.name;
    for (const sg of grp.subGroups) {
      if (sg.code === code) return `${grp.name} → ${sg.name}`;
      for (const c of sg.codes) {
        if (c.code === code) return `${grp.name} → ${sg.name} → ${c.name}`;
      }
    }
  }
  return code;
}

// 构建"代码组-子组-代码"三级选择器选项
function buildCatalogOptions(catalogType, includeEmpty, selectedCode) {
  const cat = faultCatalog[catalogType];
  if (!cat) return '';
  let html = includeEmpty ? '<option value="">请选择</option>' : '';
  for (const grp of cat.groups) {
    // 代码组作为大分组（不可选），用disabled optgroup
    html += `<optgroup label="${grp.code} — ${grp.name}" style="font-weight:bold;color:var(--text);">`;
    for (const sg of grp.subGroups) {
      // 子组作为嵌套提示
      html += `<option disabled style="color:var(--text-muted);padding-left:20px;">└ ${sg.code} — ${sg.name}</option>`;
      for (const c of sg.codes) {
        const sel = selectedCode && c.code === selectedCode ? ' selected' : '';
        html += `<option value="${c.code}"${sel} style="padding-left:36px;">${c.code} ${c.name}</option>`;
      }
    }
    html += '</optgroup>';
  }
  return html;
}

// 根据代码获取所属代码组
function getCatalogGroupCode(catalogType, code) {
  const cat = faultCatalog[catalogType];
  if (!cat) return '';
  for (const grp of cat.groups) {
    for (const sg of grp.subGroups) {
      for (const c of sg.codes) {
        if (c.code === code) return grp.code;
      }
    }
  }
  return '';
}

const notificationV2TypeOpts = [
  { value:'',label:'全部类型' },
  { value:'M1',label:'M1 - 故障报告' },
  { value:'M2',label:'M2 - 维护请求' }
];

// 2.1 通知单数据 (ZNOTIF)
const notificationV2Data = [
  { id:'NOTIF001', QMNUM:'N0000001', QMART:'M1', QMART_TXT:'M1 - 故障报告', EQUNR:'EQ-F001-006', EQKTX:'包装机', FENAM:'封口工位气缸动作延迟，封口温度波动±8℃（标准±3℃），连续检出3件封口不严产品。PLC无报警但HMI显示气压偏低（0.42MPa）', faultPhenomenonCode:'A03-1-01', faultCauseCode:'B01-1-02', faultSolutionCode:'C01-1-01', PRIOK:'2-中', STAT:'ORDP', STAT_TXT:'已转工单', QMNAM:'赵志强', QMDAT:'2026-05-28 08:15', relatedOrder:'O0000001', closeReason:'', attachments:['故障现场.jpg'], createdBy:'赵志强', createdAt:'2026-05-28 08:15', updatedAt:'2026-05-28 09:00' },
  { id:'NOTIF002', QMNUM:'N0000002', QMART:'M1', QMART_TXT:'M1 - 故障报告', EQUNR:'EQ-F001-007', EQKTX:'混合机', FENAM:'主轴轴承异响，噪音值85dB（正常<72dB），振动值6.8mm/s（上限7.1mm/s接近阈值）', faultPhenomenonCode:'A01-1-01', faultCauseCode:'', faultSolutionCode:'', PRIOK:'1-高', STAT:'CRTE', STAT_TXT:'待处理', QMNAM:'张工', QMDAT:'2026-05-30 10:30', relatedOrder:'', closeReason:'', attachments:['轴承噪音录音.mp3'], createdBy:'张工', createdAt:'2026-05-30 10:30', updatedAt:'2026-05-30 10:30' },
  { id:'NOTIF003', QMNUM:'N0000003', QMART:'M1', QMART_TXT:'M1 - 故障报告', EQUNR:'EQ-F002-001', EQKTX:'反应釜', FENAM:'[MP-RT01] [反应釜温度传感器] 读数 152℃ 超出 [上限] 150℃', faultPhenomenonCode:'A04-1-01', faultCauseCode:'B02-1-02', faultSolutionCode:'C02-2-01', PRIOK:'1-高', STAT:'ORDP', STAT_TXT:'已转工单', QMNAM:'系统自动', QMDAT:'2026-05-31 14:20', relatedOrder:'O0000002', closeReason:'', attachments:[], createdBy:'系统自动', createdAt:'2026-05-31 14:20', updatedAt:'2026-05-31 14:25' },
  { id:'NOTIF004', QMNUM:'N0000004', QMART:'M1', QMART_TXT:'M1 - 故障报告', EQUNR:'EQ-F003-001', EQKTX:'纯化水泵', FENAM:'1#变频器F007过载报警，自动切换至2#泵运行，1#泵立即停运。配电柜电流表偏摆异常', faultPhenomenonCode:'A02-1-01', faultCauseCode:'', faultSolutionCode:'', PRIOK:'1-高', STAT:'CRTE', STAT_TXT:'待处理', QMNAM:'值班员', QMDAT:'2026-06-01 06:40', relatedOrder:'', closeReason:'', attachments:['配电柜照片.jpg','电流曲线.png'], createdBy:'值班员', createdAt:'2026-06-01 06:40', updatedAt:'2026-06-01 06:40' },
  { id:'NOTIF005', QMNUM:'N0000005', QMART:'M2', QMART_TXT:'M2 - 维护请求', EQUNR:'EQ-F001-002', EQKTX:'注塑机', FENAM:'合模机构锁模力不足，产品飞边严重。油温偏高（58℃），液压油已连续运行4000小时', faultPhenomenonCode:'A04-2-01', faultCauseCode:'', faultSolutionCode:'', PRIOK:'2-中', STAT:'NOCO', STAT_TXT:'已关闭', QMNAM:'李工', QMDAT:'2026-05-25 09:00', relatedOrder:'', closeReason:'误报 - 系模具排气不良所致，非设备故障', attachments:[], createdBy:'李工', createdAt:'2026-05-25 09:00', updatedAt:'2026-05-25 10:00' },
  { id:'NOTIF006', QMNUM:'N0000006', QMART:'M1', QMART_TXT:'M1 - 故障报告', EQUNR:'EQ-F001-008', EQKTX:'压片机', FENAM:'[MP-PT01] [片剂硬度检测] 读数 28N 低于 [下限] 35N', faultPhenomenonCode:'A04-2-01', faultCauseCode:'', faultSolutionCode:'', PRIOK:'1-高', STAT:'CRTE', STAT_TXT:'待处理', QMNAM:'系统自动', QMDAT:'2026-06-01 15:30', relatedOrder:'', closeReason:'', attachments:[], createdBy:'系统自动', createdAt:'2026-06-01 15:30', updatedAt:'2026-06-01 15:30' }
];

// 通知单状态选项
const notificationV2StatusOpts = [
  { value:'',label:'全部状态' },
  { value:'CRTE',label:'CRTE - 待处理' },
  { value:'ORDP',label:'ORDP - 已转工单' },
  { value:'NOCO',label:'NOCO - 已关闭' }
];

// 通知单优先级选项
const notificationV2PriorityOpts = [
  { value:'',label:'全部' },
  { value:'1-高',label:'1 - 高' },
  { value:'2-中',label:'2 - 中' },
  { value:'3-低',label:'3 - 低' }
];

// 工单类型选项 (AUART - SAP对齐)
const workOrderV2TypeOpts = [
  { value:'',label:'全部类型' },
  { value:'PM01',label:'PM01 - 预防性维护工单' },
  { value:'PM02',label:'PM02 - 维修工单（纠正性）' },
  { value:'PM03',label:'PM03 - 改造/项目工单' },
  { value:'ZI02',label:'ZI02 - 拆卸回收工单' }
];

// 2.2 工单数据 (ZORDER)
const workOrderV2Data = [
  {
    id:'WO00001', AUFNR:'O0000001', AUART:'PM02', AUART_TXT:'PM02 - 维修工单', EQUNR:'EQ-F001-006', EQKTX:'包装机',
    KURZTEXT:'包装机封口工位气缸维修', PRIOK:'2-中', STAT:'CLSD', STAT_TXT:'已关闭',
    GSTRP:'2026-05-28 09:00', GLTRP:'2026-05-28 17:00', PERNR:'刘建国',
    sourceNo:'N0000001', taskListNo:'', faultPhenomenon:'封口工位气缸动作延迟', faultCause:'压缩空气管路接头泄漏', solution:'更换接头密封垫并重新标定压力',
    faultPhenomenonCode:'A03-1-01', faultCauseCode:'B01-1-02', faultSolutionCode:'C01-1-01',
    safetyMeasures:'关断主气源阀门，泄压后作业。佩戴护目镜和手套。',
    acceptancePerson:'孙部长', acceptanceTime:'2026-05-28 16:30', acceptanceResult:'试机5次封口合格，气压恢复0.55MPa',
    createdBy:'孙部长', createdAt:'2026-05-28 09:00', updatedAt:'2026-05-28 16:30'
  },
  {
    id:'WO00002', AUFNR:'O0000002', AUART:'PM02', AUART_TXT:'PM02 - 维修工单', EQUNR:'EQ-F002-001', EQKTX:'反应釜',
    KURZTEXT:'反应釜温度传感器超温故障维修', PRIOK:'1-高', STAT:'EXEC', STAT_TXT:'执行中',
    GSTRP:'2026-05-31 15:00', GLTRP:'2026-06-01 18:00', PERNR:'周工',
    sourceNo:'N0000003', taskListNo:'', faultPhenomenon:'温度PID控制输出异常', faultCause:'', solution:'',
    faultPhenomenonCode:'A04-1-01', faultCauseCode:'', faultSolutionCode:'',
    safetyMeasures:'降温至50℃以下方可作业，穿戴隔热服，检测可燃气体浓度。',
    acceptancePerson:'', acceptanceTime:'', acceptanceResult:'',
    createdBy:'周工', createdAt:'2026-05-31 14:30', updatedAt:'2026-05-31 16:00'
  },
  {
    id:'WO00003', AUFNR:'O0000003', AUART:'PM01', AUART_TXT:'PM01 - 预防性维护工单', EQUNR:'EQ-F001-002', EQKTX:'注塑机',
    KURZTEXT:'注塑机月度预防性维护保养', PRIOK:'3-低', STAT:'REL', STAT_TXT:'已审批/待执行',
    GSTRP:'2026-06-03 09:00', GLTRP:'2026-06-03 17:00', PERNR:'李工',
    sourceNo:'', taskListNo:'TL0001', faultPhenomenon:'', faultCause:'', solution:'',
    faultPhenomenonCode:'', faultCauseCode:'', faultSolutionCode:'',
    safetyMeasures:'断电挂牌，确认模具已卸下。',
    acceptancePerson:'', acceptanceTime:'', acceptanceResult:'',
    createdBy:'张工', createdAt:'2026-06-01 08:00', updatedAt:'2026-06-01 10:00'
  },
  {
    id:'WO00004', AUFNR:'O0000004', AUART:'PM02', AUART_TXT:'PM02 - 维修工单', EQUNR:'EQ-F001-001', EQKTX:'CNC加工中心',
    KURZTEXT:'主轴异响紧急抢修', PRIOK:'1-高', STAT:'CRTE', STAT_TXT:'编辑中',
    GSTRP:'2026-06-02 08:30', GLTRP:'2026-06-02 12:00', PERNR:'张工',
    sourceNo:'', taskListNo:'', faultPhenomenon:'主轴轴承异常噪音', faultCause:'', solution:'',
    faultPhenomenonCode:'', faultCauseCode:'', faultSolutionCode:'',
    safetyMeasures:'断电并确认主轴完全停止。',
    acceptancePerson:'', acceptanceTime:'', acceptanceResult:'',
    createdBy:'张工', createdAt:'2026-06-02 08:15', updatedAt:'2026-06-02 08:15'
  }
];

// 工单状态选项 (含APPR审批中)
const workOrderV2StatusOpts = [
  { value:'',label:'全部状态' },
  { value:'CRTE',label:'CRTE - 编辑中' },
  { value:'APPR',label:'APPR - 待审批' },
  { value:'REL',label:'REL - 已审批/待执行' },
  { value:'EXEC',label:'EXEC - 执行中' },
  { value:'COMP',label:'COMP - 已完工' },
  { value:'CLSD',label:'CLSD - 已关闭' }
];

// 2.2 工序数据 (ZOPER)
const operationV2Data = [
  // O0000001 包装机维修工序
  { orderId:'WO00001', VORNR:'0010', LTXA1:'气源管路检漏', ARBPL:'维修一班', ARBEIT:1.0, ISMNW:0.8, status:'completed', feedback:'全线接头检漏完成，发现第3段接头微漏' },
  { orderId:'WO00001', VORNR:'0020', LTXA1:'更换泄漏接头密封垫', ARBPL:'维修一班', ARBEIT:1.5, ISMNW:1.2, status:'completed', feedback:'使用原厂密封垫更换完成' },
  { orderId:'WO00001', VORNR:'0030', LTXA1:'试机测试封口质量', ARBPL:'维修一班', ARBEIT:1.0, ISMNW:1.0, status:'completed', feedback:'连续5次封口测试合格，气压0.55MPa稳定' },
  // O0000002 反应釜温度传感器维修工序
  { orderId:'WO00002', VORNR:'0010', LTXA1:'拆卸温度传感器接线盒', ARBPL:'仪表班', ARBEIT:0.5, ISMNW:'', status:'completed', feedback:'接线盒已打开，无明显烧焦痕迹' },
  { orderId:'WO00002', VORNR:'0020', LTXA1:'检测PID温控器输出信号', ARBPL:'仪表班', ARBEIT:1.0, ISMNW:'', status:'in_progress', feedback:'正在用万用表逐点检测' },
  { orderId:'WO00002', VORNR:'0030', LTXA1:'校准或更换温度变送器', ARBPL:'仪表班', ARBEIT:1.5, ISMNW:'', status:'pending', feedback:'' },
  { orderId:'WO00002', VORNR:'0040', LTXA1:'系统联调及温度曲线验证', ARBPL:'仪表班', ARBEIT:1.0, ISMNW:'', status:'pending', feedback:'' },
  // O0000003 注塑机保养工序
  { orderId:'WO00003', VORNR:'0010', LTXA1:'更换液压油', ARBPL:'维修一班', ARBEIT:2.0, ISMNW:'', status:'pending', feedback:'' },
  { orderId:'WO00003', VORNR:'0020', LTXA1:'清洗油过滤器', ARBPL:'维修一班', ARBEIT:1.0, ISMNW:'', status:'pending', feedback:'' },
  { orderId:'WO00003', VORNR:'0030', LTXA1:'检查合模机构润滑', ARBPL:'维修一班', ARBEIT:1.0, ISMNW:'', status:'pending', feedback:'' },
  { orderId:'WO00003', VORNR:'0040', LTXA1:'整机功能测试', ARBPL:'维修一班', ARBEIT:0.5, ISMNW:'', status:'pending', feedback:'' }
];

// 2.2 物料组件数据 (ZCOMP)
const materialComponentV2Data = [
  { orderId:'WO00001', MATNR:'MAT-SEAL-001', MATKTX:'接头密封垫 DN15 PTFE', BDMNG:3, MEINS:'个', ENMNG:3, remark:'原厂备件' },
  { orderId:'WO00001', MATNR:'MAT-PIPE-001', MATKTX:'压缩空气管 PU 8mm', BDMNG:2, MEINS:'米', ENMNG:0, remark:'未使用' },
  { orderId:'WO00002', MATNR:'MAT-SENS-001', MATKTX:'PT100温度传感器 L=200mm', BDMNG:1, MEINS:'个', ENMNG:'', remark:'备用' },
  { orderId:'WO00003', MATNR:'MAT-OIL-001', MATKTX:'抗磨液压油 46# 200L', BDMNG:1, MEINS:'桶', ENMNG:'', remark:'' },
  { orderId:'WO00003', MATNR:'MAT-FILTER-001', MATKTX:'油过滤器滤芯 HX-100', BDMNG:1, MEINS:'个', ENMNG:'', remark:'' }
];

// ===== 2.3 故障代码体系 V2（现象→原因→措施 三层独立管理）=====

// 设备类型选项（与设备主数据同步）
const deviceTypeOpts = ['CNC加工中心','注塑机','空压机','包装机','混合机','纯化水泵','压片机','反应釜','输送带','离心泵','锅炉','热交换器','罐装设备'];

// 故障现象库
const faultPhenomenaData = [
  { id:'FP001', code:'SY-0001', description:'泵体振动超标', deviceTypes:['离心泵','纯化水泵'], status:'active', referenceCount:12, createdBy:'管理员', createdAt:'2026-01-15' },
  { id:'FP002', code:'SY-0002', description:'轴承异常噪音/温升', deviceTypes:['CNC加工中心','混合机','离心泵'], status:'active', referenceCount:18, createdBy:'管理员', createdAt:'2026-01-15' },
  { id:'FP003', code:'SY-0003', description:'密封部位泄漏', deviceTypes:['包装机','反应釜','离心泵','罐装设备'], status:'active', referenceCount:25, createdBy:'管理员', createdAt:'2026-01-15' },
  { id:'FP004', code:'SY-0004', description:'温度传感器读数异常', deviceTypes:['反应釜','注塑机','锅炉'], status:'active', referenceCount:9, createdBy:'管理员', createdAt:'2026-01-15' },
  { id:'FP005', code:'SY-0005', description:'电机过载/发热', deviceTypes:['空压机','CNC加工中心','输送带','纯化水泵'], status:'active', referenceCount:14, createdBy:'管理员', createdAt:'2026-01-15' },
  { id:'FP006', code:'SY-0006', description:'气路/液路压力不足', deviceTypes:['包装机','注塑机','空压机'], status:'active', referenceCount:7, createdBy:'管理员', createdAt:'2026-01-15' },
  { id:'FP007', code:'SY-0007', description:'传动部件卡滞/不归位', deviceTypes:['包装机','注塑机','输送带','罐装设备'], status:'active', referenceCount:11, createdBy:'管理员', createdAt:'2026-01-15' },
  { id:'FP008', code:'SY-0008', description:'变频器故障报警', deviceTypes:['空压机','CNC加工中心','混合机','纯化水泵'], status:'active', referenceCount:6, createdBy:'管理员', createdAt:'2026-01-15' },
  { id:'FP009', code:'SY-0009', description:'产品质量波动（片重/封口/含量）', deviceTypes:['包装机','压片机','罐装设备'], status:'active', referenceCount:8, createdBy:'管理员', createdAt:'2026-02-01' },
  { id:'FP010', code:'SY-0010', description:'PLC/HMI通讯中断', deviceTypes:['配置PLC的设备'], status:'active', referenceCount:4, createdBy:'管理员', createdAt:'2026-02-15' }
];

// 故障原因库（关联现象）
const faultCauseData = [
  { id:'FC001', code:'CA-0001', description:'轴承润滑不良/缺油', phenomenonCode:'SY-0002', deviceTypes:['CNC加工中心','混合机','离心泵'], referenceCount:7 },
  { id:'FC002', code:'CA-0002', description:'轴承磨损/滚动体疲劳剥落', phenomenonCode:'SY-0002', deviceTypes:['CNC加工中心','混合机','离心泵'], referenceCount:9 },
  { id:'FC003', code:'CA-0003', description:'叶轮不平衡/汽蚀', phenomenonCode:'SY-0001', deviceTypes:['离心泵','纯化水泵'], referenceCount:5 },
  { id:'FC004', code:'CA-0004', description:'地脚螺栓松动', phenomenonCode:'SY-0001', deviceTypes:['离心泵','纯化水泵'], referenceCount:3 },
  { id:'FC005', code:'CA-0005', description:'密封垫/密封圈老化', phenomenonCode:'SY-0003', deviceTypes:['包装机','反应釜','离心泵','罐装设备'], referenceCount:14 },
  { id:'FC006', code:'CA-0006', description:'密封面腐蚀/划伤', phenomenonCode:'SY-0003', deviceTypes:['反应釜','离心泵'], referenceCount:6 },
  { id:'FC007', code:'CA-0007', description:'紧固螺栓力矩衰减', phenomenonCode:'SY-0003', deviceTypes:['包装机','反应釜','罐装设备'], referenceCount:5 },
  { id:'FC008', code:'CA-0008', description:'传感器零点漂移', phenomenonCode:'SY-0004', deviceTypes:['反应釜','注塑机','锅炉'], referenceCount:5 },
  { id:'FC009', code:'CA-0009', description:'传感器供电电压异常', phenomenonCode:'SY-0004', deviceTypes:['反应釜','注塑机'], referenceCount:2 },
  { id:'FC010', code:'CA-0010', description:'PID控制参数失调', phenomenonCode:'SY-0004', deviceTypes:['反应釜','锅炉'], referenceCount:2 },
  { id:'FC011', code:'CA-0011', description:'电机绕组绝缘下降', phenomenonCode:'SY-0005', deviceTypes:['空压机','纯化水泵','CNC加工中心'], referenceCount:6 },
  { id:'FC012', code:'CA-0012', description:'电机散热风道堵塞', phenomenonCode:'SY-0005', deviceTypes:['空压机','CNC加工中心'], referenceCount:4 },
  { id:'FC013', code:'CA-0013', description:'负载侧机械卡阻导致过载', phenomenonCode:'SY-0005', deviceTypes:['CNC加工中心','输送带','纯化水泵'], referenceCount:4 },
  { id:'FC014', code:'CA-0014', description:'压缩空气管路接头泄漏', phenomenonCode:'SY-0006', deviceTypes:['包装机','注塑机'], referenceCount:4 },
  { id:'FC015', code:'CA-0015', description:'泵出口阀门开度不足', phenomenonCode:'SY-0006', deviceTypes:['空压机','纯化水泵'], referenceCount:2 },
  { id:'FC016', code:'CA-0016', description:'气缸活塞密封圈磨损', phenomenonCode:'SY-0007', deviceTypes:['包装机','注塑机'], referenceCount:5 },
  { id:'FC017', code:'CA-0017', description:'导轨/滑块润滑干涸', phenomenonCode:'SY-0007', deviceTypes:['注塑机','输送带'], referenceCount:4 },
  { id:'FC018', code:'CA-0018', description:'IGBT功率模块损坏', phenomenonCode:'SY-0008', deviceTypes:['空压机','CNC加工中心','混合机','纯化水泵'], referenceCount:2 },
  { id:'FC019', code:'CA-0019', description:'变频器散热风扇失效', phenomenonCode:'SY-0008', deviceTypes:['空压机','CNC加工中心'], referenceCount:3 },
  { id:'FC020', code:'CA-0020', description:'模具排气不良（非设备原因）', phenomenonCode:'SY-0009', deviceTypes:['注塑机'], referenceCount:2 },
  { id:'FC021', code:'CA-0021', description:'称重传感器校准偏移', phenomenonCode:'SY-0009', deviceTypes:['包装机','压片机'], referenceCount:3 },
  { id:'FC022', code:'CA-0022', description:'PROFIBUS/Profinet总线接口松动', phenomenonCode:'SY-0010', deviceTypes:['配置PLC的设备'], referenceCount:2 },
  { id:'FC023', code:'CA-0023', description:'交换机/网线物理损坏', phenomenonCode:'SY-0010', deviceTypes:['配置PLC的设备'], referenceCount:2 }
];

// 解决措施库（关联原因）
const faultMeasureData = [
  { id:'FM001', code:'MS-0001', description:'清洗轴承并加注规定牌号润滑脂', causeCode:'CA-0001', standardHours:1.5, workCenter:'WC001', workCenterName:'机械加工中心' },
  { id:'FM002', code:'MS-0002', description:'更换轴承组件（含端盖密封）', causeCode:'CA-0002', standardHours:3.0, workCenter:'WC001', workCenterName:'机械加工中心' },
  { id:'FM003', code:'MS-0003', description:'修磨轴颈并重新配装轴承', causeCode:'CA-0002', standardHours:4.5, workCenter:'WC001', workCenterName:'机械加工中心' },
  { id:'FM004', code:'MS-0004', description:'更换叶轮并做动平衡校验', causeCode:'CA-0003', standardHours:4.0, workCenter:'WC001', workCenterName:'机械加工中心' },
  { id:'FM005', code:'MS-0005', description:'清理入口滤网消除汽蚀条件', causeCode:'CA-0003', standardHours:1.0, workCenter:'WC001', workCenterName:'机械加工中心' },
  { id:'FM006', code:'MS-0006', description:'重新紧固地脚螺栓至规定扭矩', causeCode:'CA-0004', standardHours:0.5, workCenter:'WC001', workCenterName:'机械加工中心' },
  { id:'FM007', code:'MS-0007', description:'更换密封垫/密封圈（原厂备件）', causeCode:'CA-0005', standardHours:2.0, workCenter:'WC001', workCenterName:'机械加工中心' },
  { id:'FM008', code:'MS-0008', description:'研磨密封面并更换密封件', causeCode:'CA-0006', standardHours:4.0, workCenter:'WC001', workCenterName:'机械加工中心' },
  { id:'FM009', code:'MS-0009', description:'重新按力矩表对称紧固螺栓', causeCode:'CA-0007', standardHours:0.5, workCenter:'WC001', workCenterName:'机械加工中心' },
  { id:'FM010', code:'MS-0010', description:'零点标定/量程校准传感器', causeCode:'CA-0008', standardHours:1.0, workCenter:'WC002', workCenterName:'电气维修中心' },
  { id:'FM011', code:'MS-0011', description:'检查并修复24VDC供电回路', causeCode:'CA-0009', standardHours:1.5, workCenter:'WC002', workCenterName:'电气维修中心' },
  { id:'FM012', code:'MS-0012', description:'重新整定PID参数并测试', causeCode:'CA-0010', standardHours:2.0, workCenter:'WC002', workCenterName:'电气维修中心' },
  { id:'FM013', code:'MS-0013', description:'更换电机（同型号替代）', causeCode:'CA-0011', standardHours:4.0, workCenter:'WC002', workCenterName:'电气维修中心' },
  { id:'FM014', code:'MS-0014', description:'烘干绕组并重新浸漆', causeCode:'CA-0011', standardHours:8.0, workCenter:'WC002', workCenterName:'电气维修中心' },
  { id:'FM015', code:'MS-0015', description:'清理电机风罩及散热翅片', causeCode:'CA-0012', standardHours:0.5, workCenter:'WC002', workCenterName:'电气维修中心' },
  { id:'FM016', code:'MS-0016', description:'检查负载侧传动件并消除卡阻', causeCode:'CA-0013', standardHours:1.5, workCenter:'WC001', workCenterName:'机械加工中心' },
  { id:'FM017', code:'MS-0017', description:'更换泄漏管段/接头密封件', causeCode:'CA-0014', standardHours:1.5, workCenter:'WC001', workCenterName:'机械加工中心' },
  { id:'FM018', code:'MS-0018', description:'全量开启出口阀门并检查管路', causeCode:'CA-0015', standardHours:0.5, workCenter:'WC001', workCenterName:'机械加工中心' },
  { id:'FM019', code:'MS-0019', description:'更换气缸密封圈及端盖O型圈', causeCode:'CA-0016', standardHours:1.5, workCenter:'WC001', workCenterName:'机械加工中心' },
  { id:'FM020', code:'MS-0020', description:'清洁导轨并重新涂抹润滑脂', causeCode:'CA-0017', standardHours:0.5, workCenter:'WC001', workCenterName:'机械加工中心' },
  { id:'FM021', code:'MS-0021', description:'更换损坏的IGBT模块并检查驱动板', causeCode:'CA-0018', standardHours:3.5, workCenter:'WC002', workCenterName:'电气维修中心' },
  { id:'FM022', code:'MS-0022', description:'更换变频器散热风扇', causeCode:'CA-0019', standardHours:1.0, workCenter:'WC002', workCenterName:'电气维修中心' },
  { id:'FM023', code:'MS-0023', description:'清理模具排气槽', causeCode:'CA-0020', standardHours:1.0, workCenter:'WC001', workCenterName:'机械加工中心' },
  { id:'FM024', code:'MS-0024', description:'重新校准称重传感器', causeCode:'CA-0021', standardHours:1.0, workCenter:'WC002', workCenterName:'电气维修中心' },
  { id:'FM025', code:'MS-0025', description:'重新插紧总线接头并检查终端电阻', causeCode:'CA-0022', standardHours:0.5, workCenter:'WC002', workCenterName:'电气维修中心' },
  { id:'FM026', code:'MS-0026', description:'更换交换机/网线', causeCode:'CA-0023', standardHours:1.0, workCenter:'WC002', workCenterName:'电气维修中心' }
];

// 工单故障记录（业务数据，ID+文本快照）
const workOrderFaultRecords = [
  { orderId:'WO00001', AUFNR:'O0000001', phenomenonCode:'SY-0006', phenomenonSnap:'气路/液路压力不足',
    causeCode:'CA-0014', causeSnap:'压缩空气管路接头泄漏',
    measureCode:'MS-0017', measureSnap:'更换泄漏管段/接头密封件',
    customText:'第3段接头螺纹微漏，非管体破损' },
  { orderId:'WO00002', AUFNR:'O0000002', phenomenonCode:'SY-0004', phenomenonSnap:'温度传感器读数异常',
    causeCode:'', causeSnap:'',
    measureCode:'', measureSnap:'',
    customText:'正在排查PID输出信号' }
];

// 待审核的故障项（用户手动新增后进入）
const pendingFaultItems = [];

// ===== 2.3 常用工序库 V2（基于关闭工单的动态知识库）=====
const commonOperationLibrary = [
  { id:'CO001', description:'电机拆卸与更换', equipmentTypes:['CNC加工中心','空压机','纯化水泵','输送带'],
    ops:['断电挂牌确认','拆卸接线盒及电源线','拆下地脚螺栓','吊装更换电机','恢复接线','对中校准','空载试机'],
    useCount:15, avgHours:4.2, lastUsedAt:'2026-05-28', sourceOrderId:'WO00001', status:'active',
    category:'电气', keyword:'电机' },
  { id:'CO002', description:'轴承更换', equipmentTypes:['CNC加工中心','混合机','离心泵','输送带'],
    ops:['拆卸防护罩','取下旧轴承（使用拉马）','清洁轴承座及轴颈','安装新轴承（加热法或冷压法）','加注规定牌号润滑脂','装回防护罩','手动盘车检查'],
    useCount:22, avgHours:3.5, lastUsedAt:'2026-05-30', sourceOrderId:'WO00001', status:'active',
    category:'机械', keyword:'轴承' },
  { id:'CO003', description:'密封件更换', equipmentTypes:['包装机','反应釜','罐装设备','离心泵'],
    ops:['泄压/排空介质','拆卸密封压盖','取出旧密封件','清洗密封腔','安装新密封件','回装压盖并对称紧固','试漏检验'],
    useCount:18, avgHours:2.5, lastUsedAt:'2026-05-31', sourceOrderId:'WO00001', status:'active',
    category:'机械', keyword:'密封' },
  { id:'CO004', description:'传感器校准/更换', equipmentTypes:['反应釜','注塑机','锅炉','包装机'],
    ops:['断电并拆下传感器','清洁安装孔螺纹','安装新传感器或送检','接线及屏蔽层检查','上电测试输出信号','量程校准'],
    useCount:10, avgHours:1.5, lastUsedAt:'2026-05-31', sourceOrderId:'WO00002', status:'active',
    category:'仪表', keyword:'传感器' },
  { id:'CO005', description:'液压系统维保', equipmentTypes:['注塑机','CNC加工中心'],
    ops:['停机泄压','排放旧液压油','清洗油箱及滤网','更换滤芯','加注新液压油至标尺','排气并试运行','检查管路漏点'],
    useCount:8, avgHours:3.0, lastUsedAt:'2026-05-15', sourceOrderId:'WO00003', status:'active',
    category:'液压', keyword:'液压' },
  { id:'CO006', description:'设备定期润滑', equipmentTypes:['所有设备'],
    ops:['确认设备已停机','清洁加油嘴','用油枪加注规定牌号润滑脂','擦净溢出的润滑脂','手动盘车使油脂均匀分布','记录润滑时间及用量'],
    useCount:35, avgHours:0.5, lastUsedAt:'2026-06-01', sourceOrderId:'WO00003', status:'active',
    category:'机械', keyword:'润滑' },
  { id:'CO007', description:'变频器故障排查', equipmentTypes:['空压机','CNC加工中心','混合机','纯化水泵'],
    ops:['断电等待5分钟（电容放电）','打开面板查看故障代码','检查输入输出电压','检查散热风扇运转','检查制动电阻','复位试机','参数备份'],
    useCount:7, avgHours:1.8, lastUsedAt:'2026-05-20', sourceOrderId:'WO00002', status:'active',
    category:'电气', keyword:'变频器' },
  { id:'CO008', description:'气路管路检漏及修复', equipmentTypes:['包装机','注塑机','空压机'],
    ops:['关断主气源阀门','分段充气加压','使用肥皂水逐点检漏','标记泄漏点','更换泄漏段接头/管段','恢复供气','用压力表验证气密性'],
    useCount:12, avgHours:1.5, lastUsedAt:'2026-05-28', sourceOrderId:'WO00001', status:'active',
    category:'机械', keyword:'管路' },
  { id:'CO009', description:'设备对中校准', equipmentTypes:['离心泵','空压机','CNC加工中心'],
    ops:['安装百分表架','测量径向跳动与轴向窜动','计算垫片调整量','松开地脚螺栓','加/减垫片','对称紧固螺栓','复测确认对中精度≤0.05mm'],
    useCount:9, avgHours:2.5, lastUsedAt:'2026-05-22', sourceOrderId:'WO00001', status:'active',
    category:'机械', keyword:'对中' },
  { id:'CO010', description:'配电柜接线检查与维护', equipmentTypes:['所有设备'],
    ops:['断电并挂警示牌','验电确认无电压','逐点紧固接线端子','清理柜内积尘','检查母排及绝缘件','测量绝缘电阻（≥0.5MΩ）','恢复送电'],
    useCount:14, avgHours:1.0, lastUsedAt:'2026-06-01', sourceOrderId:'WO00003', status:'active',
    category:'电气', keyword:'配电柜' }
];

// ===== 1.7 故障代码知识库 V2（三层树形结构：现象A / 原因B / 措施C + 代码组）=====
const faultCodeSymptomGroups = [
  { groupId:'SG01', groupName:'振动异常', groupDesc:'与设备振动相关的故障现象，涵盖轴承、转子、联轴器等旋转部件', equipTypes:['离心泵','压缩机','风机','CNC加工中心'],
    codes:[
      { code:'VIB-01', desc:'驱动端轴承振动超标', equipTypes:['离心泵','压缩机'], refCount:23 },
      { code:'VIB-02', desc:'非驱动端轴向振动超标', equipTypes:['离心泵','压缩机','风机'], refCount:15 },
      { code:'VIB-03', desc:'叶轮不平衡', equipTypes:['离心泵','风机'], refCount:8 },
      { code:'VIB-04', desc:'联轴器不对中', equipTypes:['离心泵','压缩机','混合机'], refCount:12 }
    ]},
  { groupId:'SG02', groupName:'温度异常', groupDesc:'设备运行温度超过正常范围，包括轴承、电机、液压油等工作温度', equipTypes:['电机','反应釜','注塑机','压缩机'],
    codes:[
      { code:'TMP-01', desc:'电机绕组温度过高', equipTypes:['电机','压缩机','CNC加工中心'], refCount:18 },
      { code:'TMP-02', desc:'轴承温度异常升高', equipTypes:['离心泵','压缩机','风机'], refCount:14 },
      { code:'TMP-03', desc:'液压油温度超标', equipTypes:['注塑机'], refCount:6 }
    ]},
  { groupId:'SG03', groupName:'泄漏', groupDesc:'设备密封部位出现的介质泄漏，包括液体、气体、蒸汽等', equipTypes:['离心泵','反应釜','管道','罐装设备'],
    codes:[
      { code:'LEK-01', desc:'机械密封泄漏', equipTypes:['离心泵','反应釜'], refCount:25 },
      { code:'LEK-02', desc:'法兰连接处渗漏', equipTypes:['管道','反应釜','罐装设备'], refCount:10 },
      { code:'LEK-03', desc:'气动管路泄漏', equipTypes:['包装机','注塑机'], refCount:7 }
    ]},
  { groupId:'SG04', groupName:'电气故障', groupDesc:'电气系统相关的故障，包括控制、供电、传动等', equipTypes:['CNC加工中心','空压机','注塑机'],
    codes:[
      { code:'ELC-01', desc:'变频器故障报警', equipTypes:['空压机','CNC加工中心','纯化水泵'], refCount:11 },
      { code:'ELC-02', desc:'PLC/HMI通讯中断', equipTypes:['CNC加工中心','注塑机'], refCount:4 },
      { code:'ELC-03', desc:'电机过载跳闸', equipTypes:['空压机','CNC加工中心','输送带'], refCount:9 }
    ]},
  { groupId:'SG05', groupName:'传动故障', groupDesc:'传动系统相关故障，包括皮带、链条、齿轮等传动部件', equipTypes:['输送带','CNC加工中心','混合机'],
    codes:[
      { code:'DRV-01', desc:'传动皮带打滑/断裂', equipTypes:['输送带','CNC加工中心'], refCount:6 },
      { code:'DRV-02', desc:'链条拉伸/跳齿', equipTypes:['输送带','混合机'], refCount:4 }
    ]},
  { groupId:'SG06', groupName:'压力异常', groupDesc:'系统压力偏离正常范围，影响设备正常运行', equipTypes:['空压机','注塑机','离心泵'],
    codes:[
      { code:'PRS-01', desc:'系统压力不足', equipTypes:['空压机','注塑机'], refCount:13 },
      { code:'PRS-02', desc:'油压异常波动', equipTypes:['注塑机'], refCount:5 }
    ]}
];

const faultCodeCauseGroups = [
  { groupId:'CG01', groupName:'轴承故障', groupDesc:'与滚动轴承相关的各类失效模式', equipTypes:['离心泵','压缩机','CNC加工中心'],
    codes:[
      { code:'BRG-01', desc:'润滑脂劣化', equipTypes:['离心泵','压缩机','CNC加工中心'], refCount:12 },
      { code:'BRG-02', desc:'轴承内圈/外圈磨损', equipTypes:['离心泵','压缩机','CNC加工中心'], refCount:9 },
      { code:'BRG-03', desc:'轴承保持架断裂', equipTypes:['离心泵','压缩机'], refCount:3 },
      { code:'BRG-04', desc:'滚动体疲劳剥落', equipTypes:['离心泵','CNC加工中心'], refCount:5 }
    ]},
  { groupId:'CG02', groupName:'润滑不良', groupDesc:'设备润滑系统相关故障原因', equipTypes:['CNC加工中心','混合机','注塑机'],
    codes:[
      { code:'LUB-01', desc:'润滑油/脂牌号使用错误', equipTypes:['CNC加工中心','混合机'], refCount:4 },
      { code:'LUB-02', desc:'润滑油路堵塞', equipTypes:['注塑机','CNC加工中心'], refCount:6 },
      { code:'LUB-03', desc:'油位过低未及时补充', equipTypes:['离心泵','空压机'], refCount:7 }
    ]},
  { groupId:'CG03', groupName:'操作不当', groupDesc:'人为操作失误或违反操作规程', equipTypes:['所有设备'],
    codes:[
      { code:'OPR-01', desc:'超负荷运行', equipTypes:['空压机','CNC加工中心'], refCount:8 },
      { code:'OPR-02', desc:'启动/停机程序错误', equipTypes:['CNC加工中心','注塑机'], refCount:3 },
      { code:'OPR-03', desc:'未按规定巡检', equipTypes:['所有设备'], refCount:5 }
    ]},
  { groupId:'CG04', groupName:'密封件老化', groupDesc:'密封部件因老化、磨损导致的失效', equipTypes:['离心泵','反应釜','包装机'],
    codes:[
      { code:'SEL-01', desc:'O型密封圈老化硬化', equipTypes:['离心泵','反应釜','包装机'], refCount:10 },
      { code:'SEL-02', desc:'机械密封动静环磨损', equipTypes:['离心泵','反应釜'], refCount:8 },
      { code:'SEL-03', desc:'密封垫片压缩变形', equipTypes:['管道','反应釜'], refCount:5 }
    ]},
  { groupId:'CG05', groupName:'电气元件故障', groupDesc:'电气元件老化、损坏导致的故障原因', equipTypes:['空压机','CNC加工中心'],
    codes:[
      { code:'ELM-01', desc:'IGBT功率模块损坏', equipTypes:['空压机','CNC加工中心'], refCount:4 },
      { code:'ELM-02', desc:'接触器触头烧蚀', equipTypes:['空压机','CNC加工中心','输送带'], refCount:6 },
      { code:'ELM-03', desc:'传感器零点漂移', equipTypes:['反应釜','注塑机'], refCount:3 }
    ]},
  { groupId:'CG06', groupName:'安装/装配问题', groupDesc:'设备安装或装配过程中的缺陷', equipTypes:['离心泵','压缩机','混合机'],
    codes:[
      { code:'INS-01', desc:'地脚螺栓松动/力矩不足', equipTypes:['离心泵','压缩机'], refCount:7 },
      { code:'INS-02', desc:'联轴器对中超差', equipTypes:['离心泵','压缩机','混合机'], refCount:5 },
      { code:'INS-03', desc:'管路应力过大', equipTypes:['离心泵','管道'], refCount:3 }
    ]}
];

const faultCodeRemedyGroups = [
  { groupId:'RG01', groupName:'轴承维修', groupDesc:'针对轴承故障的维修措施', equipTypes:['离心泵','压缩机','CNC加工中心'],
    codes:[
      { code:'REP-01', desc:'清洗并更换润滑脂', equipTypes:['离心泵','压缩机','CNC加工中心'], refCount:12 },
      { code:'REP-02', desc:'更换轴承组件', equipTypes:['离心泵','压缩机','CNC加工中心'], refCount:9 },
      { code:'REP-03', desc:'修磨轴颈并配装轴承', equipTypes:['离心泵','压缩机'], refCount:3 }
    ]},
  { groupId:'RG02', groupName:'对中调试', groupDesc:'设备对中及调试相关措施', equipTypes:['离心泵','压缩机','混合机'],
    codes:[
      { code:'REP-10', desc:'重新激光对中', equipTypes:['离心泵','压缩机','混合机'], refCount:8 },
      { code:'REP-11', desc:'调整地脚垫片', equipTypes:['离心泵','压缩机'], refCount:4 }
    ]},
  { groupId:'RG03', groupName:'更换部件', groupDesc:'更换损坏的零部件', equipTypes:['所有设备'],
    codes:[
      { code:'REP-20', desc:'更换密封垫/密封圈', equipTypes:['离心泵','反应釜','包装机'], refCount:14 },
      { code:'REP-21', desc:'更换联轴器弹性体', equipTypes:['离心泵','压缩机'], refCount:6 },
      { code:'REP-22', desc:'更换IGBT模块', equipTypes:['空压机','CNC加工中心'], refCount:3 }
    ]},
  { groupId:'RG04', groupName:'电气维修', groupDesc:'电气系统的维修措施', equipTypes:['空压机','CNC加工中心','注塑机'],
    codes:[
      { code:'REP-30', desc:'传感器零点标定/量程校准', equipTypes:['反应釜','注塑机'], refCount:5 },
      { code:'REP-31', desc:'更换接触器/继电器', equipTypes:['空压机','CNC加工中心'], refCount:6 },
      { code:'REP-32', desc:'检查并修复供电回路', equipTypes:['空压机','CNC加工中心','注塑机'], refCount:4 }
    ]},
  { groupId:'RG05', groupName:'管路维修', groupDesc:'管路、阀门、接头维修措施', equipTypes:['管道','离心泵','包装机'],
    codes:[
      { code:'REP-40', desc:'更换泄漏管段/接头', equipTypes:['管道','离心泵','包装机'], refCount:7 },
      { code:'REP-41', desc:'清理管道过滤器', equipTypes:['离心泵','管道'], refCount:4 }
    ]}
];

// 暴露到 window 对象（供页面代码通过 window.xxx 访问）
window.faultCodeSymptomGroups = faultCodeSymptomGroups;
window.faultCodeCauseGroups = faultCodeCauseGroups;
window.faultCodeRemedyGroups = faultCodeRemedyGroups;

// 智能推荐数据（模拟批处理计算结果）
const faultCodeRecommendations = {
  'VIB-01': {
    causes: [
      { code:'BRG-01', desc:'润滑脂劣化', count:12, ratio:52 },
      { code:'BRG-02', desc:'轴承内圈/外圈磨损', count:6, ratio:26 },
      { code:'OPR-01', desc:'超负荷运行', count:3, ratio:13 },
      { code:'BRG-04', desc:'滚动体疲劳剥落', count:2, ratio:9 }
    ],
    remedies: [
      { code:'REP-01', desc:'清洗并更换润滑脂', count:12, ratio:52 },
      { code:'REP-02', desc:'更换轴承组件', count:6, ratio:26 },
      { code:'REP-03', desc:'修磨轴颈并配装轴承', count:3, ratio:13 },
      { code:'REP-10', desc:'重新激光对中', count:2, ratio:9 }
    ],
    totalRecords:23, calcDate:'2026-06-05'
  },
  'VIB-02': {
    causes: [
      { code:'INS-01', desc:'地脚螺栓松动/力矩不足', count:6, ratio:40 },
      { code:'BRG-01', desc:'润滑脂劣化', count:4, ratio:27 },
      { code:'INS-02', desc:'联轴器对中超差', count:3, ratio:20 },
      { code:'OPR-01', desc:'超负荷运行', count:2, ratio:13 }
    ],
    remedies: [
      { code:'REP-10', desc:'重新激光对中', count:7, ratio:47 },
      { code:'REP-01', desc:'清洗并更换润滑脂', count:5, ratio:33 },
      { code:'REP-11', desc:'调整地脚垫片', count:3, ratio:20 }
    ],
    totalRecords:15, calcDate:'2026-06-05'
  },
  'VIB-04': {
    causes: [
      { code:'INS-02', desc:'联轴器对中超差', count:5, ratio:42 },
      { code:'INS-01', desc:'地脚螺栓松动/力矩不足', count:4, ratio:33 },
      { code:'INS-03', desc:'管路应力过大', count:2, ratio:17 },
      { code:'BRG-04', desc:'滚动体疲劳剥落', count:1, ratio:8 }
    ],
    remedies: [
      { code:'REP-10', desc:'重新激光对中', count:6, ratio:50 },
      { code:'REP-21', desc:'更换联轴器弹性体', count:3, ratio:25 },
      { code:'REP-11', desc:'调整地脚垫片', count:2, ratio:17 },
      { code:'REP-02', desc:'更换轴承组件', count:1, ratio:8 }
    ],
    totalRecords:12, calcDate:'2026-06-05'
  },
  'TMP-01': {
    causes: [
      { code:'LUB-03', desc:'油位过低未及时补充', count:7, ratio:39 },
      { code:'ELM-01', desc:'IGBT功率模块损坏', count:4, ratio:22 },
      { code:'OPR-01', desc:'超负荷运行', count:4, ratio:22 },
      { code:'LUB-02', desc:'润滑油路堵塞', count:3, ratio:17 }
    ],
    remedies: [
      { code:'REP-01', desc:'清洗并更换润滑脂', count:8, ratio:44 },
      { code:'REP-31', desc:'更换接触器/继电器', count:5, ratio:28 },
      { code:'REP-22', desc:'更换IGBT模块', count:3, ratio:17 },
      { code:'REP-32', desc:'检查并修复供电回路', count:2, ratio:11 }
    ],
    totalRecords:18, calcDate:'2026-06-05'
  },
  'LEK-01': {
    causes: [
      { code:'SEL-02', desc:'机械密封动静环磨损', count:10, ratio:40 },
      { code:'SEL-01', desc:'O型密封圈老化硬化', count:8, ratio:32 },
      { code:'SEL-03', desc:'密封垫片压缩变形', count:4, ratio:16 },
      { code:'INS-03', desc:'管路应力过大', count:3, ratio:12 }
    ],
    remedies: [
      { code:'REP-20', desc:'更换密封垫/密封圈', count:14, ratio:56 },
      { code:'REP-41', desc:'清理管道过滤器', count:6, ratio:24 },
      { code:'REP-10', desc:'重新激光对中', count:3, ratio:12 },
      { code:'REP-40', desc:'更换泄漏管段/接头', count:2, ratio:8 }
    ],
    totalRecords:25, calcDate:'2026-06-05'
  },
  'ELC-01': {
    causes: [
      { code:'ELM-01', desc:'IGBT功率模块损坏', count:5, ratio:45 },
      { code:'ELM-02', desc:'接触器触头烧蚀', count:3, ratio:27 },
      { code:'OPR-01', desc:'超负荷运行', count:2, ratio:18 },
      { code:'ELM-03', desc:'传感器零点漂移', count:1, ratio:10 }
    ],
    remedies: [
      { code:'REP-22', desc:'更换IGBT模块', count:5, ratio:45 },
      { code:'REP-31', desc:'更换接触器/继电器', count:3, ratio:27 },
      { code:'REP-30', desc:'传感器零点标定/量程校准', count:2, ratio:18 },
      { code:'REP-32', desc:'检查并修复供电回路', count:1, ratio:10 }
    ],
    totalRecords:11, calcDate:'2026-06-05'
  }
};
window.faultCodeRecommendations = faultCodeRecommendations;

// 2.4 报表数据
const maintenanceReportData = {
  orderExecStats: [
    { period:'2026年1月', totalOrders:12, completed:11, avgHours:4.2, avgCost:1850 },
    { period:'2026年2月', totalOrders:8, completed:8, avgHours:3.5, avgCost:1200 },
    { period:'2026年3月', totalOrders:15, completed:14, avgHours:5.1, avgCost:2300 },
    { period:'2026年4月', totalOrders:10, completed:9, avgHours:3.8, avgCost:1500 },
    { period:'2026年5月', totalOrders:18, completed:16, avgHours:4.6, avgCost:2100 },
    { period:'2026年6月', totalOrders:8, completed:4, avgHours:5.5, avgCost:2600 }
  ],
  mttrMtbf: [
    { period:'2026年1月', MTTR:4.2, MTBF:168 },
    { period:'2026年2月', MTTR:3.5, MTBF:210 },
    { period:'2026年3月', MTTR:5.1, MTBF:145 },
    { period:'2026年4月', MTTR:3.8, MTBF:192 },
    { period:'2026年5月', MTTR:4.6, MTBF:156 },
    { period:'2026年6月', MTTR:5.5, MTBF:130 }
  ],
  top10Failures: [
    { code:'F01-01', name:'轴承磨损', count:15, pct:28 },
    { code:'F04-01', name:'管路泄漏', count:10, pct:19 },
    { code:'F02-03', name:'接触器故障', count:8, pct:15 },
    { code:'F01-02', name:'密封件老化', count:7, pct:13 },
    { code:'F03-01', name:'传感器漂移', count:5, pct:9 },
    { code:'F04-02', name:'气缸卡滞', count:3, pct:6 },
    { code:'F02-01', name:'电机过载', count:2, pct:4 },
    { code:'F01-03', name:'紧固件松动', count:2, pct:4 },
    { code:'F02-04', name:'电缆破损', count:1, pct:2 },
    { code:'F03-03', name:'变频器报警', count:1, pct:2 }
  ]
};

// ===== 任务清单（标准作业模板）Mock 数据 =====
const taskListMockData = [
  {
    id: 'TL001', PLNNR: 'TL0001', PLNAL: '1', PLNTY: 'E', PLNAW: 'M01',
    PLTXT: 'CNC加工中心月度保养标准作业', ARBPL: 'WC-F001-001',
    longText: '按月度计划执行CNC加工中心的全面保养，包括润滑系统检查、导轨清洁与润滑、冷却液更换、主轴精度检测。',
    associatedObj: 'EQ-F001-001', PLNST: '已发布', DEL_FLAG: false, ERNAM: '张主管', ERDAT: '2026-01-15', LAST_SYNC: '2026-01-15',
    operations: [
      { VORNR:'0010', ARBPL:'WC-F001-001', LTXA1:'断电并挂警示牌', STEUS:'人工工时', ARBEIT:0.5, components:[], tools:[] },
      { VORNR:'0020', ARBPL:'WC-F001-001', LTXA1:'检查并更换冷却液', STEUS:'人工工时', ARBEIT:1.5, components:[
        { MATNR:'MAT-CL-001', MAKTX:'冷却液（水基）', BDMNG:20, MEINS:'L' }
      ], tools:[{ WRKCT:'PRT-001', WRKTX:'冷却液回收桶', MGEIN:1 }]},
      { VORNR:'0030', ARBPL:'WC-F001-001', LTXA1:'导轨清洁与润滑', STEUS:'人工工时', ARBEIT:2.0, components:[
        { MATNR:'MAT-LB-001', MAKTX:'导轨润滑油 LG2', BDMNG:0.5, MEINS:'L' },
        { MATNR:'MAT-CL-002', MAKTX:'无尘擦拭布', BDMNG:10, MEINS:'PC' }
      ], tools:[]},
      { VORNR:'0040', ARBPL:'WC-F001-001', LTXA1:'主轴精度检测与校准', STEUS:'机器工时', ARBEIT:1.0, components:[], tools:[
        { WRKCT:'PRT-002', WRKTX:'千分表及支架', MGEIN:1 }
      ]},
      { VORNR:'0050', ARBPL:'WC-F001-001', LTXA1:'控制系统自检与参数备份', STEUS:'人工工时', ARBEIT:1.0, components:[], tools:[] },
      { VORNR:'0060', ARBPL:'WC-F001-001', LTXA1:'试运行验证', STEUS:'机器工时', ARBEIT:0.5, components:[], tools:[] }
    ],
    components: [], tools: []
  },
  {
    id: 'TL002', PLNNR: 'TL0002', PLNAL: '3', PLNTY: 'E', PLNAW: 'M01',
    PLTXT: '注塑机季度综合保养', ARBPL: 'WC-F001-002',
    longText: '每季度对注塑机进行全面检修，包括液压系统检查、螺杆料筒清洁、温控系统校准、安全装置测试。',
    associatedObj: 'EQ-F001-002', PLNST: '已发布', DEL_FLAG: false, ERNAM: '张主管', ERDAT: '2026-02-01', LAST_SYNC: '2026-05-10',
    operations: [
      { VORNR:'0010', ARBPL:'WC-F001-002', LTXA1:'断电锁定并确认能源隔离', STEUS:'人工工时', ARBEIT:0.5, components:[], tools:[] },
      { VORNR:'0020', ARBPL:'WC-F001-002', LTXA1:'液压油取样检测与更换', STEUS:'人工工时', ARBEIT:2.0, components:[
        { MATNR:'MAT-HO-001', MAKTX:'抗磨液压油 HM46', BDMNG:50, MEINS:'L' },
        { MATNR:'MAT-FL-002', MAKTX:'液压油滤芯', BDMNG:1, MEINS:'PC' }
      ], tools:[{ WRKCT:'PRT-003', WRKTX:'液压油抽油机', MGEIN:1 }]},
      { VORNR:'0030', ARBPL:'WC-F001-002', LTXA1:'螺杆与料筒清洁检查', STEUS:'人工工时', ARBEIT:3.0, components:[
        { MATNR:'MAT-CL-003', MAKTX:'专用清洗剂 PC-200', BDMNG:5, MEINS:'L' }
      ], tools:[{ WRKCT:'PRT-004', WRKTX:'铜刷清洁工具套装', MGEIN:1 }]},
      { VORNR:'0040', ARBPL:'WC-F001-002', LTXA1:'温控系统校准', STEUS:'人工工时', ARBEIT:1.5, components:[], tools:[
        { WRKCT:'PRT-005', WRKTX:'红外测温仪', MGEIN:1 }
      ]},
      { VORNR:'0050', ARBPL:'WC-F001-002', LTXA1:'安全门与急停装置功能测试', STEUS:'人工工时', ARBEIT:0.5, components:[], tools:[] }
    ],
    components: [], tools: []
  },
  {
    id: 'TL003', PLNNR: 'TL0003', PLNAL: '1', PLNTY: 'E', PLNAW: 'M02',
    PLTXT: '压缩机组日常巡检', ARBPL: 'WC-F001-003',
    longText: '每日巡检空压机运行状态，记录关键运行参数，发现异常及时报告。',
    associatedObj: 'EQ-F001-003', PLNST: '已发布', DEL_FLAG: false, ERNAM: '李主管', ERDAT: '2026-03-01', LAST_SYNC: '2026-03-01',
    operations: [
      { VORNR:'0010', ARBPL:'WC-F001-003', LTXA1:'外观检查与异响判断', STEUS:'人工工时', ARBEIT:0.3, components:[], tools:[] },
      { VORNR:'0020', ARBPL:'WC-F001-003', LTXA1:'记录运行压力与温度', STEUS:'人工工时', ARBEIT:0.2, components:[], tools:[
        { WRKCT:'PRT-006', WRKTX:'巡检记录表', MGEIN:1 }
      ]},
      { VORNR:'0030', ARBPL:'WC-F001-003', LTXA1:'排水检查与排污', STEUS:'人工工时', ARBEIT:0.3, components:[], tools:[] },
      { VORNR:'0040', ARBPL:'WC-F001-003', LTXA1:'冷却风扇运行确认', STEUS:'人工工时', ARBEIT:0.2, components:[], tools:[] }
    ],
    components: [], tools: []
  },
  {
    id: 'TL004', PLNNR: 'TL0004', PLNAL: '1', PLNTY: 'E', PLNAW: 'M03',
    PLTXT: '包装机周度润滑作业', ARBPL: 'WC-F001-001',
    longText: '每周对包装机各运动部件进行润滑，使用指定润滑油品，确保设备运行平稳。',
    associatedObj: 'EQ-F001-009', PLNST: '已停用', DEL_FLAG: true, ERNAM: '张主管', ERDAT: '2026-04-01', LAST_SYNC: '2026-05-20',
    operations: [
      { VORNR:'0010', ARBPL:'WC-F001-001', LTXA1:'链条与链轮润滑', STEUS:'人工工时', ARBEIT:1.0, components:[
        { MATNR:'MAT-LB-002', MAKTX:'高温链条油 HT-220', BDMNG:0.3, MEINS:'L' }
      ], tools:[] },
      { VORNR:'0020', ARBPL:'WC-F001-001', LTXA1:'轴承加注润滑脂', STEUS:'人工工时', ARBEIT:0.8, components:[
        { MATNR:'MAT-GR-001', MAKTX:'锂基润滑脂 EP2', BDMNG:0.2, MEINS:'KG' }
      ], tools:[{ WRKCT:'PRT-007', WRKTX:'黄油枪', MGEIN:1 }]},
      { VORNR:'0030', ARBPL:'WC-F001-001', LTXA1:'气动元件润滑', STEUS:'人工工时', ARBEIT:0.5, components:[
        { MATNR:'MAT-LB-003', MAKTX:'气动工具油 ISO VG32', BDMNG:0.1, MEINS:'L' }
      ], tools:[] }
    ],
    components: [], tools: []
  },
  {
    id: 'TL005', PLNNR: 'TL0005', PLNAL: '2', PLNTY: 'T', PLNAW: 'M01',
    PLTXT: '合成车间反应区年度大修', ARBPL: 'WC-F002-001',
    longText: '年度停产大修期间对反应釜及附属管道进行全面检修，包括内壁检查、搅拌器拆检、密封更换、压力容器检验。',
    associatedObj: 'F002-L01-W01', PLNST: '已发布', DEL_FLAG: false, ERNAM: '周主管', ERDAT: '2026-05-01', LAST_SYNC: '2026-05-01',
    operations: [
      { VORNR:'0010', ARBPL:'WC-F002-001', LTXA1:'停产隔离与排空清洗', STEUS:'人工工时', ARBEIT:4.0, components:[
        { MATNR:'MAT-CL-004', MAKTX:'高压水清洗机', BDMNG:1, MEINS:'PC' }
      ], tools:[] },
      { VORNR:'0020', ARBPL:'WC-F002-001', LTXA1:'反应釜内壁检查与测厚', STEUS:'人工工时', ARBEIT:3.0, components:[], tools:[
        { WRKCT:'PRT-008', WRKTX:'超声波测厚仪', MGEIN:1 },
        { WRKCT:'PRT-009', WRKTX:'内窥镜', MGEIN:1 }
      ]},
      { VORNR:'0030', ARBPL:'WC-F002-001', LTXA1:'搅拌器拆检与轴承更换', STEUS:'人工工时', ARBEIT:6.0, components:[
        { MATNR:'MAT-BR-001', MAKTX:'深沟球轴承 6312', BDMNG:2, MEINS:'PC' },
        { MATNR:'MAT-SL-001', MAKTX:'机械密封组件 DN80', BDMNG:1, MEINS:'SET' }
      ], tools:[{ WRKCT:'PRT-010', WRKTX:'液压拉马', MGEIN:1 }]},
      { VORNR:'0040', ARBPL:'WC-F002-001', LTXA1:'压力容器年检配合', STEUS:'机器工时', ARBEIT:2.0, components:[], tools:[] },
      { VORNR:'0050', ARBPL:'WC-F002-001', LTXA1:'管路试压与系统恢复', STEUS:'人工工时', ARBEIT:3.0, components:[
        { MATNR:'MAT-GK-001', MAKTX:'PTFE垫片 DN100', BDMNG:4, MEINS:'PC' }
      ], tools:[] },
      { VORNR:'0060', ARBPL:'WC-F002-001', LTXA1:'试运行与工艺验证', STEUS:'机器工时', ARBEIT:2.0, components:[], tools:[] }
    ],
    components: [
      { MATNR:'MAT-BR-001', MAKTX:'深沟球轴承 6312', BDMNG:2, MEINS:'PC', PTYPE:'stock' },
      { MATNR:'MAT-SL-001', MAKTX:'机械密封组件 DN80', BDMNG:1, MEINS:'SET', PTYPE:'stock' },
      { MATNR:'MAT-GK-001', MAKTX:'PTFE垫片 DN100', BDMNG:4, MEINS:'PC', PTYPE:'stock' }
    ],
    tools: [
      { WRKCT:'PRT-008', WRKTX:'超声波测厚仪', MGEIN:1 },
      { WRKCT:'PRT-009', WRKTX:'内窥镜', MGEIN:1 }
    ]
  },
  {
    id: 'TL006', PLNNR: 'TL0006', PLNAL: '1', PLNTY: 'G', PLNAW: 'M01',
    PLTXT: '通用电气柜安全检查', ARBPL: 'WC-F001-002',
    longText: '适用于所有类型电气柜的安全检查标准作业，包括接线紧固、绝缘测试、清洁。',
    associatedObj: '', PLNST: '已发布', DEL_FLAG: false, ERNAM: '赵工', ERDAT: '2026-04-15', LAST_SYNC: '2026-04-15',
    operations: [
      { VORNR:'0010', ARBPL:'WC-F001-002', LTXA1:'断电并验电确认无电压', STEUS:'人工工时', ARBEIT:0.5, components:[], tools:[
        { WRKCT:'PRT-011', WRKTX:'验电器', MGEIN:1 }
      ]},
      { VORNR:'0020', ARBPL:'WC-F001-002', LTXA1:'逐点紧固接线端子', STEUS:'人工工时', ARBEIT:1.5, components:[], tools:[
        { WRKCT:'PRT-012', WRKTX:'绝缘螺丝刀套装', MGEIN:1 }
      ]},
      { VORNR:'0030', ARBPL:'WC-F001-002', LTXA1:'清理柜内积尘', STEUS:'人工工时', ARBEIT:0.5, components:[], tools:[
        { WRKCT:'PRT-013', WRKTX:'防静电吸尘器', MGEIN:1 }
      ]},
      { VORNR:'0040', ARBPL:'WC-F001-002', LTXA1:'测量绝缘电阻（≥0.5MΩ）', STEUS:'人工工时', ARBEIT:0.5, components:[], tools:[
        { WRKCT:'PRT-014', WRKTX:'兆欧表 500V', MGEIN:1 }
      ]},
      { VORNR:'0050', ARBPL:'WC-F001-002', LTXA1:'恢复送电与功能验证', STEUS:'人工工时', ARBEIT:0.3, components:[], tools:[] }
    ],
    components: [],
    tools: [
      { WRKCT:'PRT-011', WRKTX:'验电器', MGEIN:1 },
      { WRKCT:'PRT-014', WRKTX:'兆欧表 500V', MGEIN:1 }
    ]
  },
  {
    id: 'TL007', PLNNR: 'TL0007', PLNAL: '1', PLNTY: 'E', PLNAW: 'M02',
    PLTXT: '纯化水泵季度检查', ARBPL: 'WC-F003-001',
    longText: '每季度对纯化水泵进行性能检查，包括流量测试、振动测量、密封检查。',
    associatedObj: 'EQ-F003-001', PLNST: '已发布', DEL_FLAG: false, ERNAM: '仓储班长', ERDAT: '2026-05-20', LAST_SYNC: '2026-05-20',
    operations: [
      { VORNR:'0010', ARBPL:'WC-F003-001', LTXA1:'停机并关闭进出口阀门', STEUS:'人工工时', ARBEIT:0.3, components:[], tools:[] },
      { VORNR:'0020', ARBPL:'WC-F003-001', LTXA1:'流量与扬程测试', STEUS:'人工工时', ARBEIT:1.0, components:[], tools:[
        { WRKCT:'PRT-015', WRKTX:'便携式流量计', MGEIN:1 }
      ]},
      { VORNR:'0030', ARBPL:'WC-F003-001', LTXA1:'振动测量与轴承检查', STEUS:'人工工时', ARBEIT:0.5, components:[], tools:[
        { WRKCT:'PRT-016', WRKTX:'振动分析仪', MGEIN:1 }
      ]},
      { VORNR:'0040', ARBPL:'WC-F003-001', LTXA1:'机械密封检查与泄漏测试', STEUS:'人工工时', ARBEIT:0.8, components:[], tools:[] },
      { VORNR:'0050', ARBPL:'WC-F003-001', LTXA1:'恢复运行并记录参数', STEUS:'人工工时', ARBEIT:0.3, components:[], tools:[] }
    ],
    components: [], tools: []
  }
];

// ===== Material Master Data =====
const materialFactoryOptions = [
  { value:'1000', label:'1000（山东步长）' },
  { value:'1100', label:'1100（天津基地）' },
  { value:'1200', label:'1200（菏泽分厂）' }
];

const materialMrpCtrlOptions = [
  { value:'A06', label:'A06' },
  { value:'A01', label:'A01' },
  { value:'A02', label:'A02' },
  { value:'', label:'' }
];

const materialBatchMgmtOptions = [
  { value:'Y', label:'已启用' },
  { value:'N', label:'未启用' },
  { value:'', label:'全部' }
];

const materialProcTypeOptions = [
  { value:'external', label:'外购' },
  { value:'internal', label:'自制' },
  { value:'', label:'全部' }
];

const materialTypeOptions = [
  { value:'Z006', label:'Z006（耗材及其他）' },
  { value:'Z001', label:'Z001（原材料）' },
  { value:'Z002', label:'Z002（包装材料）' },
  { value:'Z003', label:'Z003（辅助材料）' },
  { value:'Z004', label:'Z004（半成品）' },
  { value:'Z005', label:'Z005（成品）' }
];

const materialData = [
  { id:'MAT001', code:'60000001', description:'大桶-天兰', factory:'1000', factoryName:'1000',
    materialType:'Z006', materialTypeName:'耗材及其他',
    materialGroup:'605', materialGroupName:'非生产性材料-...',
    baseUnit:'件', plannedDeliveryTime:null, originalValue:'', deleteFlag:'D', overviewScreen:'',
    mrpType:'ND', mrpController:'A06', procurementType:'external', batchManagement:'N', allowUnplanned:'N'
  },
  { id:'MAT002', code:'60000002', description:'大桶-粉', factory:'1000', factoryName:'1000',
    materialType:'Z006', materialTypeName:'耗材及其他',
    materialGroup:'605', materialGroupName:'非生产性材料-...',
    baseUnit:'件', plannedDeliveryTime:null, originalValue:'', deleteFlag:'D', overviewScreen:'',
    mrpType:'ND', mrpController:'A06', procurementType:'external', batchManagement:'N', allowUnplanned:'N'
  },
  { id:'MAT003', code:'60000003', description:'一服区工服...', factory:'1000', factoryName:'1000',
    materialType:'Z006', materialTypeName:'耗材及其他',
    materialGroup:'605', materialGroupName:'非生产性材料-...',
    baseUnit:'套', plannedDeliveryTime:null, originalValue:'', deleteFlag:'D', overviewScreen:'',
    mrpType:'ND', mrpController:'A06', procurementType:'external', batchManagement:'N', allowUnplanned:'N'
  },
  { id:'MAT004', code:'60000004', description:'一服区工服...', factory:'1000', factoryName:'1000',
    materialType:'Z006', materialTypeName:'耗材及其他',
    materialGroup:'605', materialGroupName:'非生产性材料-...',
    baseUnit:'套', plannedDeliveryTime:null, originalValue:'', deleteFlag:'D', overviewScreen:'',
    mrpType:'ND', mrpController:'A06', procurementType:'external', batchManagement:'N', allowUnplanned:'N'
  },
  { id:'MAT005', code:'60000005', description:'一服区工服...', factory:'1000', factoryName:'1000',
    materialType:'Z006', materialTypeName:'耗材及其他',
    materialGroup:'605', materialGroupName:'非生产性材料-...',
    baseUnit:'套', plannedDeliveryTime:null, originalValue:'', deleteFlag:'D', overviewScreen:'',
    mrpType:'ND', mrpController:'A06', procurementType:'external', batchManagement:'N', allowUnplanned:'N'
  },
  { id:'MAT006', code:'60000006', description:'一服区工服...', factory:'1000', factoryName:'1000',
    materialType:'Z006', materialTypeName:'耗材及其他',
    materialGroup:'605', materialGroupName:'非生产性材料-...',
    baseUnit:'套', plannedDeliveryTime:null, originalValue:'', deleteFlag:'D', overviewScreen:'',
    mrpType:'ND', mrpController:'A06', procurementType:'external', batchManagement:'N', allowUnplanned:'N'
  },
  { id:'MAT007', code:'60000007', description:'洁净区服-蓝', factory:'1000', factoryName:'1000',
    materialType:'Z006', materialTypeName:'耗材及其他',
    materialGroup:'605', materialGroupName:'非生产性材料-...',
    baseUnit:'套', plannedDeliveryTime:null, originalValue:'', deleteFlag:'D', overviewScreen:'',
    mrpType:'ND', mrpController:'A06', procurementType:'external', batchManagement:'N', allowUnplanned:'N'
  },
  { id:'MAT008', code:'60000008', description:'洁净区服-粉', factory:'1000', factoryName:'1000',
    materialType:'Z006', materialTypeName:'耗材及其他',
    materialGroup:'605', materialGroupName:'非生产性材料-...',
    baseUnit:'套', plannedDeliveryTime:null, originalValue:'', deleteFlag:'D', overviewScreen:'',
    mrpType:'ND', mrpController:'A06', procurementType:'external', batchManagement:'N', allowUnplanned:'N'
  },
  { id:'MAT009', code:'60000009', description:'洁净区工服...', factory:'1000', factoryName:'1000',
    materialType:'Z006', materialTypeName:'耗材及其他',
    materialGroup:'605', materialGroupName:'非生产性材料-...',
    baseUnit:'套', plannedDeliveryTime:null, originalValue:'', deleteFlag:'D', overviewScreen:'',
    mrpType:'ND', mrpController:'A06', procurementType:'external', batchManagement:'N', allowUnplanned:'N'
  },
  { id:'MAT010', code:'60000010', description:'工服袋', factory:'1000', factoryName:'1000',
    materialType:'Z006', materialTypeName:'耗材及其他',
    materialGroup:'605', materialGroupName:'非生产性材料-...',
    baseUnit:'个', plannedDeliveryTime:null, originalValue:'', deleteFlag:'D', overviewScreen:'',
    mrpType:'ND', mrpController:'A06', procurementType:'external', batchManagement:'N', allowUnplanned:'N'
  }
];