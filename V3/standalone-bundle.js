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
// ===== Common App Utilities =====
// 用户身份管理
(function() {
  var params = new URLSearchParams(window.location.search);
  var userId = params.get('user');
  if (!userId) {
    // 尝试从 localStorage 读取上次登录用户
    var saved = localStorage.getItem('pm_v2_current_user');
    if (saved) {
      try { userId = JSON.parse(saved).id; } catch(e) {}
    }
  }
  window.currentUserId = userId || 'admin';
  window.currentUserRole = 'admin'; // 'admin' for full access, 'viewer' for read-only
})();
function esc(s) { return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function toast(msg) { alert(msg); }

function getStatusBadge(status) {
  const m = { running:'运行中',standby:'待机',fault:'故障',maintenance:'维修中',stopped:'停用',scrapped:'报废' };
  const c = { running:'badge-green',standby:'badge-blue',fault:'badge-red',maintenance:'badge-yellow',stopped:'badge-gray',scrapped:'badge-gray' };
  return `<span class="badge ${c[status]||'badge-gray'}">${m[status]||status}</span>`;
}
function getSyncBadge(s) {
  const m = { synced:'已同步',pending:'待同步',failed:'同步失败' };
  const c = { synced:'badge-green',pending:'badge-yellow',failed:'badge-red' };
  return `<span class="badge ${c[s]||'badge-gray'}">${m[s]||s}</span>`;
}
function getFLStatusBadge(s) {
  const m = { active:'正常启用',disabled:'临时停用',invalid:'永久作废' };
  const c = { active:'badge-green',disabled:'badge-yellow',invalid:'badge-red' };
  return `<span class="badge ${c[s]||'badge-gray'}">${m[s]||s}</span>`;
}
function getFLTypeText(t) {
  const m = { plant:'厂区',workshop:'车间',production_line:'产线',workstation:'工位',auxiliary:'辅助区' };
  return m[t] || t;
}

// Modal
function showModal(title, bodyHtml, footerBtns, cls) {
  const backdrop = document.getElementById('modalBackdrop');
  const btns = footerBtns || [{ text:'关闭',cls:'btn-secondary',action:closeModal }];
  backdrop.innerHTML = `<div class="modal ${cls||''}" onclick="event.stopPropagation()">
    <div class="modal-header"><h2 class="modal-title">${title}</h2><button class="modal-close" onclick="closeModal()">×</button></div>
    <div class="modal-body">${bodyHtml}</div>
    <div class="modal-footer">${btns.map(b => `<button class="btn ${b.cls||'btn-secondary'}" onclick="(${b.action.toString()})()">${b.text}</button>`).join('')}</div>
  </div>`;
  backdrop.classList.remove('hidden');
  backdrop.addEventListener('click', closeModal);
}
function closeModal() {
  document.getElementById('modalBackdrop').classList.add('hidden');
}

// Side Panel
function openSidePanel(title, subtitle, bodyHtml) {
  document.getElementById('sidePanelBackdrop').classList.add('show');
  const panel = document.getElementById('sidePanel');
  panel.innerHTML = `
    <div class="side-panel-header">
      <div><div class="modal-title">${title}</div><div style="font-size:12px;color:var(--text-secondary);">${subtitle||''}</div></div>
      <button class="modal-close" onclick="closeSidePanel()">×</button>
    </div>
    <div class="side-panel-body">${bodyHtml}</div>
    <div class="side-panel-footer"><button class="btn btn-secondary" onclick="closeSidePanel()">关闭</button></div>`;
  panel.classList.add('show');
}
function closeSidePanel() {
  document.getElementById('sidePanel').classList.remove('show');
  document.getElementById('sidePanelBackdrop').classList.remove('show');
}

// ===== Data Persistence Service =====
// 跨设备数据持久化方案：localStorage 本地持久化 + 导出/导入 跨设备同步
// 架构预留：CloudBase 云端同步接口

window.PersistenceService = (function() {
  'use strict';

  const STORAGE_PREFIX = 'pm_v2_';
  const AUTO_SAVE_INTERVAL = 30000; // 30秒自动保存
  const DEBOUNCE_MS = 2000;         // 防抖间隔

  // ---- 业务数据变量注册表 ----
  // 仅注册用户可修改的业务数据，不包含静态选项/配置
  const DATA_REGISTRY = [
    // 设备主数据
    'equipmentData', 'eqStatusLogs',
    // 位置数据
    'locationData', 'locationTreeData', 'flMockData',
    // 工作中心
    'wcMockData', 'wcOrgTree',
    // BOM
    'bomListData', 'bomDetailData', 'bomLogs',
    // 安装/移交
    'installDocsData', 'installDocLogs',
    // 运行状态
    'eqRunStatusData', 'eqStatusChangeData', 'eqRunLogData',
    // 改造/退役
    'eqRetrofitData', 'eqRetireData',
    // 通知单
    'mfNotificationData', 'notificationV2Data',
    // 工单
    'mfOrderData', 'workOrderV2Data',
    // 工序与物料
    'operationV2Data', 'materialComponentV2Data',
    // 测量数据
    'measurementPointData', 'measurementRecordData',
    // 故障经验库
    'faultPhenomenaData', 'faultCauseData', 'faultMeasureData',
    'workOrderFaultRecords', 'pendingFaultItems', 'commonOperationLibrary',
    // 维修报表
    'maintenanceReportData',
    // 任务清单
    'taskListMockData',
    // 预防性维护
    'pmPlanData', 'pmScheduleData', 'pmGenLogData',
    // 告警事件
    'alertEventData'
  ];

  // ---- 内部状态 ----
  let _userId = 'default';
  let _saveTimer = null;
  let _dirtyFlags = {};   // 标记哪些变量被修改过
  let _initialized = false;

  // ---- 工具函数 ----
  function _storageKey(varName) {
    return STORAGE_PREFIX + _userId + '_' + varName;
  }

  function _deepClone(obj) {
    try { return JSON.parse(JSON.stringify(obj)); } catch(e) { return obj; }
  }

  function _isArrayLike(v) {
    return Array.isArray(v);
  }

  function _isPlainObject(v) {
    return v && typeof v === 'object' && !Array.isArray(v);
  }

  // ---- 核心方法 ----

  /** 获取当前用户ID */
  function getUserId() {
    return _userId;
  }

  /** 设置用户ID（登录时调用） */
  function setUserId(userId) {
    _userId = userId || 'default';
  }

  /** 标记数据已变更，触发延迟保存 */
  function markDirty(varName) {
    if (!_initialized) return;
    _dirtyFlags[varName] = true;
    if (_saveTimer) clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => _autoSave(), DEBOUNCE_MS);
  }

  /** 延迟自动保存变更的数据 */
  function _autoSave() {
    _saveTimer = null;
    const dirty = Object.keys(_dirtyFlags).filter(k => _dirtyFlags[k]);
    if (dirty.length === 0) return;

    dirty.forEach(name => _saveOne(name));
    _dirtyFlags = {};
  }

  /** 保存单个变量到 localStorage */
  function _saveOne(varName) {
    try {
      const val = window[varName];
      if (val === undefined) return;
      const key = _storageKey(varName);
      const serialized = JSON.stringify(val);
      if (serialized.length > 1024 * 1024 * 4) {
        // 超过4MB的单变量太大，跳过
        console.warn('[Persistence] 变量 ' + varName + ' 过大 (' +
          (serialized.length / 1024 / 1024).toFixed(1) + 'MB)，跳过存储');
        return;
      }
      localStorage.setItem(key, serialized);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.warn('[Persistence] localStorage 空间不足，请清理旧数据');
        _attemptCleanup();
      } else {
        console.error('[Persistence] 保存失败:', varName, e.message);
      }
    }
  }

  /** 空间不足时尝试清理最旧的非核心数据 */
  function _attemptCleanup() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STORAGE_PREFIX)) {
        keys.push(k);
      }
    }
    // 保留最近修改的 30 个 key
    if (keys.length > 30) {
      const toRemove = keys.slice(0, keys.length - 30);
      toRemove.forEach(k => localStorage.removeItem(k));
    }
  }

  /** 保存全部数据到 localStorage */
  function saveAll() {
    DATA_REGISTRY.forEach(name => _saveOne(name));
    _dirtyFlags = {};
    if (_saveTimer) { clearTimeout(_saveTimer); _saveTimer = null; }
  }

  /** 立即保存（供关键操作后调用） */
  function saveNow() {
    saveAll();
  }

  /** 从 localStorage 加载数据并恢复到 const 内存变量 */
  function loadAll() {
    let loadedCount = 0;
    let skippedCount = 0;

    DATA_REGISTRY.forEach(varName => {
      try {
        const key = _storageKey(varName);
        const raw = localStorage.getItem(key);
        if (raw === null) {
          skippedCount++;
          return;
        }

        const saved = JSON.parse(raw);
        const current = window[varName];

        if (current === undefined) {
          skippedCount++;
          return;
        }

        // 由于 data.js 使用 const 声明，不能重新赋值
        // 只能清空并重新填入内容
        if (_isArrayLike(current) && Array.isArray(saved)) {
          // 数组：清空后 push 保存的数据
          current.length = 0;
          current.push(...saved);
          loadedCount++;
        } else if (_isPlainObject(current) && _isPlainObject(saved)) {
          // 对象：清除所有 key 后 assign
          Object.keys(current).forEach(k => delete current[k]);
          Object.assign(current, saved);
          loadedCount++;
        } else {
          skippedCount++;
        }
      } catch (e) {
        console.warn('[Persistence] 加载 ' + varName + ' 失败:', e.message);
        skippedCount++;
      }
    });

    if (loadedCount > 0) {
      console.log('[Persistence] 已恢复 ' + loadedCount + ' 个数据变量 (' +
        skippedCount + ' 个使用默认值) - 用户: ' + _userId);
    }
    return { loadedCount, skippedCount };
  }

  /** 清空当前用户的所有持久化数据 */
  function clearAll() {
    DATA_REGISTRY.forEach(varName => {
      const key = _storageKey(varName);
      localStorage.removeItem(key);
    });
    _dirtyFlags = {};
  }

  /** 检查当前用户是否有已保存的数据 */
  function hasSavedData() {
    return DATA_REGISTRY.some(varName => {
      return localStorage.getItem(_storageKey(varName)) !== null;
    });
  }

  /** 获取持久化数据的存储统计信息 */
  function getStorageInfo() {
    let totalSize = 0;
    let count = 0;
    const items = [];

    DATA_REGISTRY.forEach(varName => {
      const raw = localStorage.getItem(_storageKey(varName));
      if (raw !== null) {
        count++;
        totalSize += raw.length;
        items.push({
          name: varName,
          sizeKB: (raw.length / 1024).toFixed(1),
          recordCount: Array.isArray(window[varName]) ? window[varName].length : 'N/A'
        });
      }
    });

    return {
      userId: _userId,
      totalKB: (totalSize / 1024).toFixed(1),
      totalMB: (totalSize / 1024 / 1024).toFixed(2),
      variableCount: count,
      items: items,
      quotaEstimate: _estimateQuota()
    };
  }

  function _estimateQuota() {
    // 估算 localStorage 剩余空间
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) used += localStorage.getItem(k).length;
    }
    const maxBytes = 5 * 1024 * 1024; // 通常 5MB
    return {
      usedKB: (used / 1024).toFixed(1),
      maxMB: 5,
      percentUsed: ((used / maxBytes) * 100).toFixed(1)
    };
  }

  // ---- 跨设备同步 ----

  /** 导出全部数据为 JSON 文件（供跨设备手动同步） */
  function exportToFile() {
    const snapshot = {
      version: '2.0',
      userId: _userId,
      exportedAt: new Date().toISOString(),
      variables: {}
    };

    DATA_REGISTRY.forEach(varName => {
      const val = window[varName];
      if (val !== undefined) {
        snapshot.variables[varName] = _deepClone(val);
      }
    });

    const json = JSON.stringify(snapshot, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'MES系统_数据备份_' + _userId + '_' +
      new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true, sizeKB: (json.length / 1024).toFixed(1) };
  }

  /** 从 JSON 文件导入数据（跨设备恢复） */
  function importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const snapshot = JSON.parse(e.target.result);

          if (!snapshot.variables || !snapshot.version) {
            return reject(new Error('无效的备份文件格式'));
          }

          let importCount = 0;
          Object.keys(snapshot.variables).forEach(varName => {
            const saved = snapshot.variables[varName];
            const current = window[varName];

            if (current === undefined) return;

            if (_isArrayLike(current) && Array.isArray(saved)) {
              current.length = 0;
              current.push(...saved);
              importCount++;
            } else if (_isPlainObject(current) && _isPlainObject(saved)) {
              Object.keys(current).forEach(k => delete current[k]);
              Object.assign(current, saved);
              importCount++;
            }
          });

          // 导入后立即保存到 localStorage
          saveAll();

          resolve({
            success: true,
            importCount: importCount,
            exportedAt: snapshot.exportedAt,
            sourceUser: snapshot.userId
          });
        } catch (err) {
          reject(new Error('JSON 解析失败: ' + err.message));
        }
      };
      reader.onerror = function() {
        reject(new Error('文件读取失败'));
      };
      reader.readAsText(file);
    });
  }

  /** 从剪贴板导入（备用快速恢复方式） */
  async function importFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      const snapshot = JSON.parse(text);

      if (!snapshot.variables || !snapshot.version) {
        throw new Error('无效的备份数据');
      }

      let importCount = 0;
      Object.keys(snapshot.variables).forEach(varName => {
        const saved = snapshot.variables[varName];
        const current = window[varName];
        if (current === undefined) return;

        if (_isArrayLike(current) && Array.isArray(saved)) {
          current.length = 0;
          current.push(...saved);
          importCount++;
        } else if (_isPlainObject(current) && _isPlainObject(saved)) {
          Object.keys(current).forEach(k => delete current[k]);
          Object.assign(current, saved);
          importCount++;
        }
      });

      saveAll();
      return { success: true, importCount, sourceUser: snapshot.userId };
    } catch (e) {
      throw new Error('剪贴板读取或解析失败: ' + e.message);
    }
  }

  /** 复制当前数据到剪贴板（快速跨设备传输） */
  async function copyToClipboard() {
    const snapshot = {
      version: '2.0',
      userId: _userId,
      exportedAt: new Date().toISOString(),
      variables: {}
    };

    DATA_REGISTRY.forEach(varName => {
      const val = window[varName];
      if (val !== undefined) {
        snapshot.variables[varName] = _deepClone(val);
      }
    });

    const json = JSON.stringify(snapshot);
    await navigator.clipboard.writeText(json);
    return { success: true, sizeKB: (json.length / 1024).toFixed(1) };
  }

  // ---- CloudBase 云端同步（架构预留） ----
  // 当集成 CloudBase 后可启用以下方法
  let _cloudSyncEnabled = false;

  function enableCloudSync(config) {
    _cloudSyncEnabled = true;
    // TODO: 初始化 CloudBase 连接
    // const app = cloudbase.init({ env: config.envId });
    // const auth = app.auth({ persistence: 'local' });
    // const db = app.database();
    console.log('[Persistence] CloudBase 云端同步已启用(架构预留)');
  }

  async function uploadToCloud() {
    if (!_cloudSyncEnabled) {
      throw new Error('云端同步未启用，请先集成 CloudBase');
    }
    // TODO: 实现 CloudBase 上传
    // const snapshot = createSnapshot();
    // await db.collection('pm_data').doc(_userId).set({ data: snapshot });
    throw new Error('CloudBase 集成待实现');
  }

  async function downloadFromCloud() {
    if (!_cloudSyncEnabled) {
      throw new Error('云端同步未启用，请先集成 CloudBase');
    }
    // TODO: 实现 CloudBase 下载
    throw new Error('CloudBase 集成待实现');
  }

  // ---- 生命周期管理 ----

  /** 初始化持久化服务 */
  function init(userId) {
    if (userId) _userId = userId;
    _initialized = true;

    // 1. 加载已保存的数据
    const result = loadAll();

    // 2. 注册页面关闭前自动保存
    window.addEventListener('beforeunload', function() {
      saveAll();
    });

    // 3. 注册页面隐藏时保存（移动端切换应用）
    window.addEventListener('pagehide', function() {
      saveAll();
    });

    // 4. 启动定期自动保存
    setInterval(function() {
      _autoSave();
    }, AUTO_SAVE_INTERVAL);

    // 5. 全局暴露 markDirty：各页面模块修改数据后可主动调用
    window.markDataDirty = markDirty;

    console.log('[Persistence] 服务初始化完成 | 用户: ' + _userId +
      ' | 恢复: ' + result.loadedCount + ' 变量 | 注册: ' + DATA_REGISTRY.length + ' 变量');

    return result;
  }

  /** 销毁（清理定时器） */
  function destroy() {
    _initialized = false;
    if (_saveTimer) clearTimeout(_saveTimer);
    saveAll();
  }

  // ---- 公开 API ----
  return {
    // 基础
    init: init,
    destroy: destroy,
    getUserId: getUserId,
    setUserId: setUserId,

    // 存储操作
    saveAll: saveAll,
    saveNow: saveNow,
    loadAll: loadAll,
    clearAll: clearAll,
    hasSavedData: hasSavedData,
    markDirty: markDirty,

    // 存储统计
    getStorageInfo: getStorageInfo,

    // 跨设备同步（文件）
    exportToFile: exportToFile,
    importFromFile: importFromFile,

    // 跨设备同步（剪贴板）
    copyToClipboard: copyToClipboard,
    importFromClipboard: importFromClipboard,

    // 云端同步（架构预留）
    enableCloudSync: enableCloudSync,
    uploadToCloud: uploadToCloud,
    downloadFromCloud: downloadFromCloud,

    // 注册表
    DATA_REGISTRY: DATA_REGISTRY
  };

})();

// ===== Material Master Page =====
const MaterialMaster = {
  page: 1, pageSize: 10, filtered: [],

  render() {
    const data = materialData;
    this.filtered = [...data];
    this.page = 1;
    return `
      <div class="mat-master" style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">物料主数据管理</div><div style="font-size:13px;opacity:0.8;">物料台账</div></div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>工厂</label><select id="matFactory"><option value="">全部</option>${materialFactoryOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>MRP控制者</label><select id="matMrpCtrl"><option value="">全部</option>${materialMrpCtrlOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>批次管理</label><select id="matWholesale"><option value="">全部</option>${materialBatchMgmtOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>采购类型</label><select id="matProcType"><option value="">全部</option>${materialProcTypeOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>物料类型</label><select id="matType"><option value="">全部</option>${materialTypeOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>物料号</label><input type="text" id="matCode" placeholder="模糊查询"></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="MaterialMaster.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="MaterialMaster.reset()">重置</button>
          </div>
        </div>
        <div style="flex-shrink:0;display:flex;justify-content:flex-end;padding:4px 16px 0;">
          <button class="btn btn-sm" style="background:#f1f5f9;color:#475569;border:1px solid var(--border);" onclick="MaterialMaster.export()">导出</button>
        </div>
        <div class="table-wrapper" style="flex:1;overflow-x:auto;">
          <table class="data-table" style="min-width:1600px;">
            <thead><tr>
              <th style="width:50px;">序号</th>
              <th>工厂</th>
              <th>物料号</th>
              <th>物料描述</th>
              <th>物料类型</th>
              <th>物料类型描述</th>
              <th>物料组</th>
              <th>物料组描述</th>
              <th>基本单位</th>
              <th>计划交货时间</th>
              <th>原始值</th>
              <th>删除标识</th>
              <th>MRP类型</th>
              <th>MRP控制者</th>
              <th>采购类型</th>
              <th>批次管理</th>
              <th>允许未计划交货</th>
            </tr></thead>
            <tbody id="matTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info"><span class="list-count" id="matCount">共 ${this.filtered.length} 条</span></div>
          <div class="pagination">
            <button class="pagination-btn" id="matPrev" disabled onclick="MaterialMaster.prevPage()">‹</button>
            <span class="pagination-info" id="matPageInfo">第 1 / ${Math.ceil(this.filtered.length/this.pageSize)} 页</span>
            <button class="pagination-btn" id="matNext" onclick="MaterialMaster.nextPage()">›</button>
            <select class="page-size-select" id="matPageSizeSel" onchange="MaterialMaster.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
          </div>
        </div>
      </div>`;
  },

  init() {
    this.filtered = [...materialData];
    this.page = 1;
    this.renderTable();
  },

  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;
    document.getElementById('matCount').textContent = `共 ${this.filtered.length} 条`;
    document.getElementById('matPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('matPrev').disabled = this.page <= 1;
    document.getElementById('matNext').disabled = this.page >= totalPages;
    document.getElementById('matPageSizeSel').value = this.pageSize;

    if (!document.getElementById('matTableBody')) return;
    document.getElementById('matTableBody').innerHTML = page.map((m, i) => `
      <tr>
        <td>${start + i + 1}</td>
        <td>${esc(m.factoryName)}</td>
        <td style="color:#2563eb;font-weight:600;">${esc(m.code)}</td>
        <td>${esc(m.description)}</td>
        <td>${esc(m.materialType)}</td>
        <td>${esc(m.materialTypeName)}</td>
        <td>${esc(m.materialGroup)}</td>
        <td>${esc(m.materialGroupName)}</td>
        <td>${esc(m.baseUnit)}</td>
        <td>${m.plannedDeliveryTime ? m.plannedDeliveryTime + '天' : ''}</td>
        <td>${m.originalValue !== undefined && m.originalValue !== '' ? m.originalValue : ''}</td>
        <td>${m.deleteFlag === 'D' ? '<span class="badge badge-red">D</span>' : ''}</td>
        <td>${esc(m.mrpType)}</td>
        <td>${esc(m.mrpController)}</td>
        <td>${m.procurementType === 'external' ? '外购' : m.procurementType === 'internal' ? '自制' : esc(m.procurementType)}</td>
        <td>${m.batchManagement === 'Y' ? '<span class="badge badge-green">已启用</span>' : '<span class="badge badge-gray">未启用</span>'}</td>
        <td>${m.allowUnplanned === 'Y' ? '允许' : '不允许'}</td>
      </tr>`).join('');
  },

  search() {
    const factory = document.getElementById('matFactory').value;
    const mrpCtrl = document.getElementById('matMrpCtrl').value;
    const wholesale = document.getElementById('matWholesale').value;
    const procType = document.getElementById('matProcType').value;
    const matType = document.getElementById('matType').value;
    const code = document.getElementById('matCode').value.trim();
    this.filtered = materialData.filter(m => {
      if (factory && m.factory !== factory) return false;
      if (mrpCtrl && m.mrpController !== mrpCtrl) return false;
      if (wholesale && m.batchManagement !== wholesale) return false;
      if (procType && m.procurementType !== procType) return false;
      if (matType && m.materialType !== matType) return false;
      if (code && !m.code.includes(code)) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
  },

  reset() {
    document.getElementById('matFactory').value = '';
    document.getElementById('matMrpCtrl').value = '';
    document.getElementById('matWholesale').value = '';
    document.getElementById('matProcType').value = '';
    document.getElementById('matType').value = '';
    document.getElementById('matCode').value = '';
    this.filtered = [...materialData];
    this.page = 1;
    this.renderTable();
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() { if (this.page < Math.ceil(this.filtered.length/this.pageSize)) { this.page++; this.renderTable(); } },
  changePageSize() { this.pageSize = parseInt(document.getElementById('matPageSizeSel').value); this.page = 1; this.renderTable(); },

  export() {
    toast('导出功能开发中');
  },

  addModal() {
    showModal(
      '新增物料',
      `<form id="matAddForm" onsubmit="return false;" style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;">
        <div class="form-group"><label>工厂<span class="required">*</span></label><select id="addMatFactory" required><option value="">请选择</option>${materialFactoryOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="form-group"><label>物料号<span class="required">*</span></label><input type="text" id="addMatCode" placeholder="请输入物料号" required /></div>
        <div class="form-group"><label>物料描述<span class="required">*</span></label><input type="text" id="addMatDesc" placeholder="请输入物料描述" required /></div>
        <div class="form-group"><label>物料类型<span class="required">*</span></label><select id="addMatType" required><option value="">请选择</option>${materialTypeOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="form-group"><label>物料组<span class="required">*</span></label><input type="text" id="addGroup" placeholder="请输入物料组" required /></div>
        <div class="form-group"><label>基本单位<span class="required">*</span></label><select id="addBaseUnit" required><option value="">请选择</option><option value="件">件</option><option value="套">套</option><option value="个">个</option><option value="kg">kg</option><option value="L">L</option><option value="箱">箱</option><option value="包">包</option></select></div>
        <div class="form-group"><label>MRP类型</label><select id="addMrpType"><option value="ND">ND（无）</option><option value="PD">PD（计划驱动）</option><option value="VM">VM（VMI）</option></select></div>
        <div class="form-group"><label>MRP控制者</label><select id="addMrpCtrl"><option value="">请选择</option>${materialMrpCtrlOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
        <div class="form-group"><label>采购类型</label><select id="addProcType"><option value="external">外购</option><option value="internal">自制</option></select></div>
        <div class="form-group"><label>计划交货时间(天)</label><input type="number" id="addPlannedDeliv" placeholder="例如：7" min="0" /></div>
        <div class="form-group"><label>批次管理</label><select id="addBatchMgmt"><option value="N">未启用</option><option value="Y">已启用</option></select></div>
        <div class="form-group"><label>允许未计划交货</label><select id="addAllowUnplanned"><option value="N">不允许</option><option value="Y">允许</option></select></div>
      </form>`,
      [
        { text:'取消', cls:'btn-secondary', action: closeModal },
        { text:'确认新增', cls:'btn-primary', action: ()=>{ MaterialMaster.saveNew(); } }
      ],
      'modal-xl'
    );
  },

  saveNew() {
    const code = document.getElementById('addMatCode').value.trim();
    const desc = document.getElementById('addMatDesc').value.trim();
    const factoryVal = document.getElementById('addMatFactory').value;
    const typeVal = document.getElementById('addMatType').value;
    const group = document.getElementById('addGroup').value.trim();
    const baseUnit = document.getElementById('addBaseUnit').value;

    if (!code || !desc || !factoryVal || !typeVal || !group || !baseUnit) { toast('请填写必填项'); return; }

    const factoryOpt = materialFactoryOptions.find(f => f.value === factoryVal);
    const typeOpt = materialTypeOptions.find(t => t.value === typeVal);

    const n = {
      id: 'MAT' + String(materialData.length + 1).padStart(3,'0'),
      code: code,
      description: desc,
      factory: factoryVal,
      factoryName: factoryOpt ? factoryOpt.label : factoryVal,
      materialType: typeVal,
      materialTypeName: typeOpt ? typeOpt.label : typeVal,
      materialGroup: group,
      materialGroupName: '',
      baseUnit: baseUnit,
      plannedDeliveryTime: parseInt(document.getElementById('addPlannedDeliv').value) || null,
      originalValue: '',
      deleteFlag: '',
      overviewScreen: '',
      mrpType: document.getElementById('addMrpType').value,
      mrpController: document.getElementById('addMrpCtrl').value,
      procurementType: document.getElementById('addProcType').value,
      batchManagement: document.getElementById('addBatchMgmt').value,
      allowUnplanned: document.getElementById('addAllowUnplanned').value
    };
    materialData.push(n);
    closeModal();
    this.init();
    toast('物料新增成功');
  }
};

// ===== Equipment Master Page =====
const EquipmentMaster = {
  page: 1, pageSize: 10, filtered: [],

  render() {
    const data = equipmentData;
    this.filtered = [...data];
    this.page = 1;
    return `
      <div class="eq-master" style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">设备主数据管理</div><div style="font-size:13px;opacity:0.8;">设备台账</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary" style="background:rgba(255,255,255,0.15);color:white;" onclick="EquipmentMaster.showStatsPanel()">统计分析</button>
            <button class="btn btn-blue" onclick="EquipmentMaster.addModal()">+ 新增设备</button>
          </div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>工厂</label><select id="eqFactory"><option value="">全部</option><option value="F001">制剂工厂</option><option value="F002">原料药工厂</option><option value="F003">仓储中心</option></select></div>
          <div class="filter-group"><label>功能位置</label><input type="text" id="eqLocation" placeholder="模糊查询"></div>
          <div class="filter-group"><label>设备类型</label><select id="eqType"><option value="">全部</option>${eqTypeOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>运行状态</label><select id="eqStatus"><option value="">全部</option>${eqStatusOptions.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>
          <div class="filter-group"><label>设备编码</label><input type="text" id="eqCode" placeholder="模糊查询"></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="EquipmentMaster.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="EquipmentMaster.reset()">重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table">
            <thead><tr><th>设备编码</th><th>设备名称</th><th>规格型号</th><th>制造商</th><th>功能位置</th><th>类型</th><th>状态</th><th>操作</th></tr></thead>
            <tbody id="eqTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info"><span class="list-count" id="eqCount">共 ${this.filtered.length} 条</span></div>
          <div class="pagination">
            <button class="pagination-btn" id="eqPrev" disabled onclick="EquipmentMaster.prevPage()">‹</button>
            <span class="pagination-info" id="eqPageInfo">第 1 / ${Math.ceil(this.filtered.length/this.pageSize)} 页</span>
            <button class="pagination-btn" id="eqNext" onclick="EquipmentMaster.nextPage()">›</button>
            <select class="page-size-select" id="eqPageSizeSel" onchange="EquipmentMaster.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
          </div>
        </div>
      </div>`;
  },

  init() {
    this.filtered = [...equipmentData];
    this.page = 1;
    this.renderTable();
  },

  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;
    document.getElementById('eqCount').textContent = `共 ${this.filtered.length} 条`;
    document.getElementById('eqPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('eqPrev').disabled = this.page <= 1;
    document.getElementById('eqNext').disabled = this.page >= totalPages;
    document.getElementById('eqPageSizeSel').value = this.pageSize;
    document.getElementById('eqTableBody').innerHTML = page.map(eq => `
      <tr>
        <td><span style="color:#2563eb;cursor:pointer;text-decoration:underline;font-weight:600;" onclick="EquipmentMaster.viewEquipmentPhotos('${eq.id}')" title="点击查看设备照片">${esc(eq.code)}</span></td><td>${esc(eq.name)}</td><td>${esc(eq.model)}</td><td>${esc(eq.manufacturer)}</td>
        <td><span style="color:var(--primary-lighter);cursor:pointer;text-decoration:underline;" onclick="EquipmentMaster.showLocation('${eq.location}')">${esc(eq.locationName)}</span></td>
        <td>${esc(eq.typeName)}</td><td>${getStatusBadge(eq.status)}</td>
        <td class="table-actions">
          <button class="btn btn-blue btn-sm" onclick="EquipmentMaster.maintain('${eq.id}')">${eq.status==='scrapped'?'查看':'维护'}</button>
          <button class="btn btn-success btn-sm" onclick="EquipmentMaster.goBOM('${eq.id}')">BOM</button>
          <button class="btn btn-warning btn-sm" onclick="EquipmentMaster.goMeasurementPoint('${eq.id}')" style="background:var(--warning);color:white;border:none;">测量点</button>
        </td>
      </tr>`).join('');
  },

  search() {
    const factory = document.getElementById('eqFactory').value;
    const location = document.getElementById('eqLocation').value.trim();
    const type = document.getElementById('eqType').value;
    const status = document.getElementById('eqStatus').value;
    const code = document.getElementById('eqCode').value.trim();
    this.filtered = equipmentData.filter(eq => {
      if (factory && !eq.location.startsWith(factory)) return false;
      if (location && !eq.locationName.includes(location)) return false;
      if (type && eq.type !== type) return false;
      if (status && eq.status !== status) return false;
      if (code && !eq.code.includes(code)) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
  },

  reset() {
    document.getElementById('eqFactory').value = '';
    document.getElementById('eqLocation').value = '';
    document.getElementById('eqType').value = '';
    document.getElementById('eqStatus').value = '';
    document.getElementById('eqCode').value = '';
    this.filtered = [...equipmentData];
    this.page = 1;
    this.renderTable();
  },

  showStatsPanel() {
    const total = equipmentData.length;
    const running = equipmentData.filter(e => e.status === 'running').length;
    const standby = equipmentData.filter(e => e.status === 'standby').length;
    const fault = equipmentData.filter(e => e.status === 'fault').length;
    const maint = equipmentData.filter(e => e.status === 'maintenance').length;
    const offline = total - running - standby - fault - maint;
    const pct = v => total > 0 ? ((v / total) * 100).toFixed(1) : '0.0';

    const makeCard = (status, label, icon, iconStyle, colorBar) => {
      const cnt = status === 'all' ? total : status === 'offline' ? offline
        : equipmentData.filter(e => e.status === status).length;
      const pctVal = pct(cnt);
      return `<div class="stat-card" style="cursor:pointer;transition:all .2s;min-width:0;"
        onclick="EquipmentMaster.filterByStatus('${status}')"
        onmouseenter="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 25px rgba(0,0,0,.12)';"
        onmouseleave="this.style.transform='';this.style.boxShadow='';">
        <div style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;${iconStyle}">${icon}</div>
        <div style="flex:1;"><div class="stat-label">${label}</div><div class="stat-value">${cnt}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
          <div style="flex:1;height:4px;background:#e5e7eb;border-radius:2px;overflow:hidden;">
            <div style="height:100%;width:${pctVal}%;${colorBar}border-radius:2px;transition:width .4s ease;"></div>
          </div>
          <span style="font-size:11px;color:var(--text-secondary);white-space:nowrap;">${pctVal}%</span>
        </div></div></div>`;
    };

    const cards = [
      makeCard('all', '设备总数', '&#128202;', 'background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;', 'background:linear-gradient(90deg,#667eea,#764ba2);'),
      makeCard('running', '运行中', '&#9989;', '', 'background:var(--success);'),
      makeCard('standby', '待机', '&#9208;', '', 'background:var(--primary-lighter);'),
      makeCard('fault', '故障', '&#9888;', '', 'background:var(--danger);'),
      makeCard('maintenance', '维修中', '&#128295;', '', 'background:var(--warning);'),
      makeCard('offline', '离线/其他', '&#10060;', 'background:rgba(107,114,128,.1);color:#6b7280;', 'background:#6b7280;')
    ].join('');

    const body = `<div style="padding:4px 0;">
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;">${cards}</div>
      <div style="margin-top:18px;padding:12px 16px;background:#f0f9ff;border-radius:8px;border:1px solid #bae6fd;font-size:13px;color:var(--text-secondary);text-align:center;">
        &#128161; 点击任意指标卡片，即可快速筛选下方设备列表
      </div></div>`;

    showModal('设备统计分析', body, [
      { text:'关闭', cls:'btn-secondary', action: closeModal }
    ], 'modal-lg');
  },

  filterByStatus(status) {
    closeModal();
    if (status === 'all') {
      this.filtered = [...equipmentData];
      if (document.getElementById('eqStatus')) document.getElementById('eqStatus').value = '';
    } else if (status === 'offline') {
      this.filtered = equipmentData.filter(e => !['running','standby','fault','maintenance'].includes(e.status));
      if (document.getElementById('eqStatus')) document.getElementById('eqStatus').value = '';
    } else {
      this.filtered = equipmentData.filter(e => e.status === status);
      if (document.getElementById('eqStatus')) document.getElementById('eqStatus').value = status;
    }
    this.page = 1;
    this.renderTable();
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() { if (this.page < Math.ceil(this.filtered.length/this.pageSize)) { this.page++; this.renderTable(); } },
  changePageSize() { this.pageSize = parseInt(document.getElementById('eqPageSizeSel').value); this.page = 1; this.renderTable(); },

  showLocation(locId) {
    const loc = locationData[locId];
    if (!loc) return;
    const typeMap = { factory:'工厂',line:'生产线',workstation:'工位' };
    showModal('功能位置详情', `
      <div class="detail-grid">
        <div class="detail-item"><dt>编码</dt><dd>${esc(loc.id)}</dd></div>
        <div class="detail-item"><dt>名称</dt><dd>${esc(loc.name)}</dd></div>
        <div class="detail-item"><dt>类型</dt><dd>${typeMap[loc.type]||loc.type}</dd></div>
        <div class="detail-item"><dt>描述</dt><dd>${esc(loc.description)}</dd></div>
      </div>`);
  },

  detail(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) return;
    this.detailEditingId = eqId;
    this.detailEditData = { ...eq };
    this.detailViewMode = 'view';
    this.detailActiveTab = 'general';

    const body = this._buildDetailBody();
    const footer = this._buildDetailFooter();

    showModal(`设备详情 - ${eq.name}`, body, footer, 'modal-lg');
  },

  _readonlyCell(label, value) {
    return `<div class="detail-item"><dt>${label}</dt><dd>${esc(value || '-')}</dd></div>`;
  },

  _editableCell(label, value, field, inputStyle) {
    const s = inputStyle || 'width:100%;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:13px;outline:none;';
    return `<div class="detail-item"><dt>${label}</dt><dd><input value="${esc(value||'')}" onchange="EquipmentMaster.updateDetailField('${field}',this.value)" placeholder="-" style="${s}" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'"></dd></div>`;
  },

  _buildDetailBody() {
    const d = this.detailEditData;
    const isView = this.detailViewMode === 'view';
    const cell = isView ? this._readonlyCell.bind(this) : this._editableCell.bind(this);

    const logs = eqStatusLogs[this.detailEditingId] || [];
    const logsHtml = logs.length ? logs.map(l => `
      <div style="padding:12px;background:#f8fafc;border-radius:6px;margin-bottom:8px;border-left:3px solid var(--primary);">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><strong>${esc(l.status)}</strong><span style="font-size:12px;color:var(--text-secondary);">${esc(l.time)}</span></div>
        <div style="font-size:13px;">${esc(l.description)}</div><div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">操作人：${esc(l.operator)}</div>
      </div>`).join('') : '<p style="color:var(--text-muted);text-align:center;padding:20px;">暂无记录</p>';

    return `
      <div style="margin-bottom:20px;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;">
        <div style="flex:1;">
          ${isView
            ? `<div style="font-size:20px;font-weight:700;color:var(--text);">${esc(d.name)}</div>`
            : `<input id="detailEqName" value="${esc(d.name)}" onchange="EquipmentMaster.updateDetailField('name',this.value)" style="font-size:20px;font-weight:700;border:1px solid var(--border);border-radius:6px;padding:6px 10px;width:100%;max-width:360px;outline:none;color:var(--text);" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">`
          }
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">
            编码：<strong>${esc(d.code)}</strong>
            &nbsp;|&nbsp;型号：${isView ? esc(d.model) : `<input value="${esc(d.model)}" onchange="EquipmentMaster.updateDetailField('model',this.value)" style="border:1px solid var(--border);border-radius:3px;padding:2px 6px;width:120px;font-size:12px;outline:none;" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">`}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;flex-shrink:0;">
          ${getStatusBadge(d.status)}
          ${isView && d.status !== 'scrapped'
            ? `<button class="btn btn-warning" onclick="EquipmentMaster.switchToEditMode();EquipmentMaster._refreshDetailModal();" style="font-size:13px;">✏️ 编辑</button>`
            : (isView ? '' : `<button class="btn btn-secondary btn-sm" onclick="EquipmentMaster.switchToViewMode();EquipmentMaster._refreshDetailModal();" style="font-size:12px;">↩ 返回查看</button>`)
          }
        </div>
      </div>
      <div class="form-tabs-bar" style="display:flex;border-bottom:2px solid var(--border);margin-bottom:0;flex-shrink:0;">
        <div class="form-tab ${this.detailActiveTab==='general'?'active':''}" onclick="EquipmentMaster.switchDetailTab(event,'general')">一般</div>
        <div class="form-tab ${this.detailActiveTab==='location'?'active':''}" onclick="EquipmentMaster.switchDetailTab(event,'location')">位置</div>
        <div class="form-tab ${this.detailActiveTab==='org'?'active':''}" onclick="EquipmentMaster.switchDetailTab(event,'org')">组织结构</div>
        <div class="form-tab ${this.detailActiveTab==='structure'?'active':''}" onclick="EquipmentMaster.switchDetailTab(event,'structure')">结构</div>
        <div class="form-tab ${this.detailActiveTab==='classification'?'active':''}" onclick="EquipmentMaster.switchDetailTab(event,'classification')">分类</div>
        <div class="form-tab ${this.detailActiveTab==='acceptance'?'active':''}" onclick="EquipmentMaster.switchDetailTab(event,'acceptance')">交付验收</div>
        <div class="form-tab ${this.detailActiveTab==='attachment'?'active':''}" onclick="EquipmentMaster.switchDetailTab(event,'attachment')">附件</div>
      </div>
      <div id="detailTabContainer" style="max-height:55vh;overflow-y:auto;padding:16px 0 0 0;">
        ${this._buildDetailTabContent(this.detailActiveTab)}
      </div>`;
  },

  _buildDetailFooter() {
    if (this.detailViewMode === 'view') {
      return [{ text:'关闭', cls:'btn-secondary', action: closeModal }];
    }
    return [
      { text:'取消', cls:'btn-secondary', action: ()=>{ EquipmentMaster.switchToViewMode(); EquipmentMaster._refreshDetailModal(); } },
      { text:'保存修改', cls:'btn-primary', action: ()=>{ EquipmentMaster.saveDetail(); } }
    ];
  },

  switchToEditMode() { this.detailViewMode = 'edit'; },
  switchToViewMode() { this.detailViewMode = 'view'; },

  _refreshDetailModal() {
    const modalBody = document.querySelector('.modal-backdrop:not(.hidden) .modal-body');
    const modalFooter = document.querySelector('.modal-backdrop:not(.hidden) .modal-footer');
    const modalTitle = document.querySelector('.modal-backdrop:not(.hidden) .modal-title');
    const d = this.detailEditData;
    if (modalBody) modalBody.innerHTML = this._buildDetailBody();
    if (modalFooter) modalFooter.innerHTML = this._buildDetailFooter().map(b => `<button class="btn ${b.cls||'btn-secondary'}" id="footerBtn_0">${b.text}</button>`).join('');
    if (modalTitle && d) modalTitle.textContent = '设备详情 - ' + d.name;

    const btns = this._buildDetailFooter();
    const actualBtns = modalFooter ? modalFooter.querySelectorAll('button') : [];
    actualBtns.forEach((btn, i) => {
      if (btns[i]) { btn.onclick = btns[i].action; btn.className = 'btn ' + (btns[i].cls||'btn-secondary'); btn.textContent = btns[i].text; }
    });
  },

  updateDetailField(field, value) {
    if (!this.detailEditData) return;
    this.detailEditData[field] = value;
    if (field === 'name') {
      const titleEl = document.querySelector('.modal-backdrop:not(.hidden) .modal-title');
      if (titleEl) titleEl.textContent = '设备详情 - ' + value;
    }
  },

  saveDetail() {
    if (!this.detailEditingId || !this.detailEditData) return;
    const idx = equipmentData.findIndex(e => e.id === this.detailEditingId);
    if (idx === -1) return;
    Object.assign(equipmentData[idx], this.detailEditData);
    toast('设备信息已保存！');
    this.detailViewMode = 'view';
    this._refreshDetailModal();
    this.renderTable();
  },

  _viewDetailPhoto(eqId, idx) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq || !eq.photos || !eq.photos[idx]) return;
    const photo = eq.photos[idx];
    showModal('设备照片 - ' + photo.name, `
      <div style="text-align:center;">
        <img src="${photo.dataUrl}" alt="${esc(photo.name)}" style="max-width:100%;max-height:70vh;border-radius:8px;">
      </div>`, [{ text:'关闭', cls:'btn-secondary', action: closeModal }], 'modal-lg');
  },

  viewEquipmentPhotos(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) { toast('设备不存在'); return; }

    // 判断是否有照片：优先用设备的photos，否则显示默认占位
    const hasCustomPhotos = eq.photos && eq.photos.length > 0;
    const displayPhotos = hasCustomPhotos ? eq.photos : [{ name: '设备外观照.png', dataUrl: 'images/equipment-photo.png', isDefault: true }];

    const photosHtml = displayPhotos.map((p, i) => `
      <div style="display:inline-block;margin:6px;border:1px solid var(--border);border-radius:8px;overflow:hidden;cursor:pointer;transition:transform .15s;width:220px;"
           onclick="EquipmentMaster._viewDetailPhotoFromList('${eqId}',${i})"
           onmouseenter="this.style.transform='scale(1.03)'" onmouseleave="this.style.transform='scale(1)'">
        <img src="${p.dataUrl}" alt="${esc(p.name)}" style="width:220px;height:165px;object-fit:cover;display:block;" onerror="this.onerror=null;this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 220 165%22><rect fill=%22%23f0f0f0%22 width=%22220%22 height=%22165%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2214%22>暂无图片</text></svg>'">
        <div style="padding:6px 10px;font-size:12px;color:var(--text-secondary);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:#fafbfc;">
          ${esc(p.name)} ${p.isDefault ? '<span style="color:var(--primary);font-size:11px;">(默认)</span>' : ''}
        </div>
      </div>`).join('');

    const hasQR = eq.qrCode && eq.qrCode.generated;

    showModal('设备照片 - ' + esc(eq.code), `
      <div style="padding:16px;">
        <div style="margin-bottom:16px;font-size:14px;color:var(--text-secondary);">
          设备编码：<strong>${esc(eq.code)}</strong> &nbsp;|&nbsp; 设备名称：<strong>${esc(eq.name)}</strong> &nbsp;|&nbsp; 共 <strong>${displayPhotos.length}</strong> 张照片
        </div>
        <div id="eqPhotoGallery" style="display:flex;flex-wrap:wrap;justify-content:center;max-height:55vh;overflow-y:auto;">
          ${photosHtml}
        </div>
      </div>
    `, [
      { text:'关闭', cls:'btn-secondary', action: closeModal },
      { text: hasQR ? '\uD83D\uDCE6 打印二维码' : '\uD83DCDF0 生成二维码', cls: hasQR ? 'btn-primary' : 'btn-warning', action: () => EquipmentMaster._handleQRCode(eqId) }
    ], 'modal-lg');
  },

  _viewDetailPhotoFromList(eqId, idx) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq || !eq.photos || !eq.photos[idx]) return;
    const photo = (eq.photos && eq.photos[idx]) || { name: '设备外观照.png', dataUrl: 'images/equipment-photo.png' };
    if (idx >= (eq.photos || []).length) photo = { name: '设备外观照.png', dataUrl: 'images/equipment-photo.png' };

    const actualPhoto = (eq.photos && eq.photos[idx]) ? eq.photos[idx] : { name: '设备外观照.png', dataUrl: 'images/equipment-photo.png' };

    const hasQR = eq.qrCode && eq.qrCode.generated;
    showModal('设备照片 - ' + (actualPhoto.name || '照片'), `
      <div style="text-align:center;">
        <img src="${actualPhoto.dataUrl}" alt="${esc(actualPhoto.name)}" style="max-width:100%;max-height:65vh;border-radius:8px;" onerror="this.onerror=null;this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22><rect fill=%22%23f0f0f0%22 width=%22400%22 height=%22300%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2216%22>暂无图片</text></svg>'">
        <div style="margin-top:8px;font-size:13px;color:var(--text-secondary);">${(eq.photos ? idx + 1 : 1)} / ${(eq.photos ? eq.photos.length : 1)}</div>
      </div>
    `, [
      { text:'关闭', cls:'btn-secondary', action: closeModal },
      { text: hasQR ? '\uD83D\uDCE6 打印二维码' : '\uD83DCDF0 生成二维码', cls: hasQR ? 'btn-primary' : 'btn-warning', action: () => { closeModal(); EquipmentMaster.viewEquipmentPhotos(eqId); setTimeout(() => EquipmentMaster._handleQRCode(eqId), 300); } }
    ], 'modal-lg');
  },

  // ---- 二维码生成与打印 ----
  _handleQRCode(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) { toast('设备不存在'); return; }

    // 如果已生成过二维码，直接展示（不可变）
    if (eq.qrCode && eq.qrCode.generated) {
      this._showQRCodeModal(eq);
      return;
    }

    // 首次生成：基于设备编码+名称+首次生成时间戳，确保唯一且不可变
    const qrContent = JSON.stringify({
      type: 'EQUIPMENT',
      id: eq.id,
      code: eq.code,
      name: eq.name,
      model: eq.model || '',
      location: eq.locationName || '',
      generatedAt: new Date().toISOString(),
      system: 'PM-Master'
    });

    // 生成二维码SVG
    const qrSvg = this._generateQRSVG(qrContent);

    // 保存到设备数据（一旦生成就不可变）
    eq.qrCode = {
      generated: true,
      content: qrContent,
      svg: qrSvg,
      generatedTime: new Date().toISOString().substring(0, 19).replace('T', ' ')
    };

    toast('设备二维码已生成！生成后不可更改');
    this._showQRCodeModal(eq);
  },

  _showQRCodeModal(eq) {
    const qc = eq.qrCode;
    if (!qc || !qc.generated) return;

    const printWin = () => {
      const win = window.open('', '_blank', 'width=500,height=700');
      win.document.write(`
<!DOCTYPE html><html><head><meta charset="utf-8"><title>设备二维码 - ${esc(eq.code)}</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:-apple-system,"Microsoft YaHei",sans-serif;display:flex;flex-direction:column;align-items:center;padding:40px 20px;background:#fff;}
.card{border:2px solid #e5e7eb;border-radius:12px;padding:32px;text-align:center;width:380px;}
.title{font-size:18px;font-weight:700;color:#111827;margin-bottom:4px;}.subtitle{font-size:13px;color:#6b7280;margin-bottom:20px;}
.qr-wrap{display:inline-block;padding:12px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:16px;}
.info{font-size:12px;color:#374151;line-height:2;text-align:left;background:#f9fafb;padding:12px;border-radius:6px;}
.info-row{display:flex;justify-content:space-between;}.label{color:#6b7280;}.value{font-weight:600;color:#111827;}
.footer{font-size:10px;color:#9ca3af;margin-top:16px;}@media print{body{padding:0;}}</style></head><body>
<div class="card">
  <div class="title">${esc(eq.name)}</div>
  <div class="subtitle">${esc(eq.code)} | ${esc(eq.model||'--')}</div>
  <div class="qr-wrap">${qc.svg}</div>
  <div class="info">
    <div class="info-row"><span class="label">设备编码</span><span class="value">${esc(eq.code)}</span></div>
    <div class="info-row"><span class="label">设备名称</span><span class="value">${esc(eq.name)}</span></div>
    <div class="info-row"><span class="label">型号</span><span class="value">${esc(eq.model||'--')}</span></div>
    <div class="info-row"><span class="label">位置</span><span class="value">${esc(eq.locationName||'--')}</span></div>
    <div class="info-row"><span class="label">生成时间</span><span class="value">${esc(qc.generatedTime)}</span></div>
  </div>
  <div class="footer">扫描二维码查看设备详细信息</div>
</div>
<script>window.onload=function(){window.print();}</script>
</body></html>`);
      win.document.close();
    };

    showModal(`设备二维码 - ${esc(eq.code)}`, `
      <div style="text-align:center;padding:20px;">
        <div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:4px;">${esc(eq.name)}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:20px;">${esc(eq.code)} &nbsp;|&nbsp; ${esc(eq.model||'--')}</div>

        <div id="qrDisplay" style="display:inline-block;padding:16px;background:#fff;border:2px solid var(--border);border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          ${qc.svg}
        </div>

        <div style="margin-top:16px;font-size:13px;color:var(--text-secondary);line-height:1.8;">
          设备编码：<strong>${esc(eq.code)}</strong><br>
          生成时间：<strong>${esc(qc.generatedTime)}</strong>
        </div>

        <div style="margin-top:14px;padding:10px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;font-size:12px;color:#166534;">
          &#9989; 二维码已锁定，不可修改。打印后可贴于设备机身用于扫码巡检。
        </div>
      </div>
    `, [
      { text:'关闭', cls:'btn-secondary', action: closeModal },
      { text:'\uD83D\uDCE6 打印二维码', cls:'btn-primary', action: () => { closeModal(); setTimeout(printWin, 200); } }
    ], 'modal-md');
  },

  // ---- 轻量级 QR Code SVG 生成器（纯JS，无依赖）----
  _generateQRSVG(text, size) {
    size = size || 5;
    const qr = _qrgen(text, size);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${qr.moduleCount} ${qr.moduleCount}" style="width:${Math.min(200, qr.moduleCount * 8)}px;height:${Math.min(200, qr.moduleCount * 8)}px;" shape-rendering="crispEdges"><path fill="#FFF" d="M0 0h${qr.moduleCount}v${qr.moduleCount}H0z"/><path fill="#111827" d="${qr.paths}"/></svg>`;
  },

  switchDetailTab(event, tabName) {
    this.detailActiveTab = tabName;
    const modal = event.target.closest('.modal');
    if (!modal) return;
    modal.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    const container = modal.querySelector('#detailTabContainer');
    if (container) container.innerHTML = this._buildDetailTabContent(tabName);
  },

  _buildDetailTabContent(tabName) {
    const d = this.detailEditData;
    const isView = this.detailViewMode === 'view';
    const cell = isView ? this._readonlyCell.bind(this) : this._editableCell.bind(this);

    const logs = eqStatusLogs[this.detailEditingId] || [];
    const logsHtml = logs.length ? logs.map(l => `
      <div style="padding:12px;background:#f8fafc;border-radius:6px;margin-bottom:8px;border-left:3px solid var(--primary);">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><strong>${esc(l.status)}</strong><span style="font-size:12px;color:var(--text-secondary);">${esc(l.time)}</span></div>
        <div style="font-size:13px;">${esc(l.description)}</div><div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">操作人：${esc(l.operator)}</div>
      </div>`).join('') : '<p style="color:var(--text-muted);text-align:center;padding:20px;">暂无记录</p>';

    const ap = d.acceptancePersonnel;
    const apVal = Array.isArray(ap) ? ap.join('、') : (ap || '');

    switch (tabName) {
      case 'general':
        return `<div class="detail-grid">${cell('出厂日期', d.factoryDate, 'factoryDate')}${cell('采购日期', d.purchaseDate, 'purchaseDate')}${cell('质保到期', d.warrantyEnd, 'warrantyEnd')}</div>
          <div style="margin-top:16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <div><strong style="font-size:14px;">状态变更记录</strong><div style="font-size:12px;color:var(--text-secondary);">实时展示设备运行状态变更</div></div>
            ${getStatusBadge(d.status)}
          </div>
          <div style="background:#f8fafc;border-radius:8px;padding:14px;">${logsHtml}</div>`;

      case 'location':
        return `<div class="detail-grid"><div class="detail-item"><dt>功能位置</dt><dd>${esc(d.locationName)}</dd></div></div>`;

      case 'org':
        return `<div class="detail-grid">${cell('负责人', d.leader, 'leader')}${cell('维保班组', d.teamName, 'teamName')}</div>`;

      case 'structure':
        return `<div class="detail-grid">${cell('序列号', d.serialNo, 'serialNo')}${cell('制造商', d.manufacturer, 'manufacturer')}</div>`;

      case 'classification':
        return `<div style="display:flex;gap:16px;flex-wrap:wrap;">
          <div style="flex:1;min-width:200px;background:#f8fafc;border-radius:8px;padding:14px;">
            <div style="font-weight:700;color:var(--primary);margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid var(--primary);">设备分类</div>
            ${cell('分类', d.category, 'category')}<div style="margin-top:8px;">${cell('组别', d.group, 'group')}</div><div style="margin-top:8px;">${cell('GMP管控', d.gmpClass, 'gmpClass')}</div>
          </div>
          <div style="flex:1;min-width:200px;background:#f8fafc;border-radius:8px;padding:14px;">
            <div style="font-weight:700;color:var(--primary);margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid var(--primary);">技术参数</div>
            ${cell('功率', d.power, 'power')}<div style="margin-top:8px;">${cell('电压', d.voltage, 'voltage')}</div><div style="margin-top:8px;">${cell('容量', d.capacity, 'capacity')}</div><div style="margin-top:8px;">${cell('材质', d.material, 'material')}</div><div style="margin-top:8px;">${cell('洁净等级', d.cleanLevel, 'cleanLevel')}</div>
          </div></div>`;

      case 'acceptance':
        return `<div class="detail-grid">
          ${cell('OA流程ID', d.oaProcessId, 'oaProcessId')}${cell('到货日期', d.arrivalDate, 'arrivalDate')}${cell('安装完成日期', d.installDate, 'installDate')}${cell('试运行时长', d.commissioningDuration, 'commissioningDuration')}${cell('调试负责人', d.commissioningManager, 'commissioningManager')}${cell('接收部门', d.receivingDept, 'receivingDept')}${cell('接收负责人', d.receiverPerson, 'receiverPerson')}${cell('移交说明', d.handoverNote, 'handoverNote')}${cell('交接意见', d.handoverOpinion, 'handoverOpinion')}${cell('验收人员', apVal, 'acceptancePersonnel')}</div>`;

      case 'attachment':
        return `<div style="margin-bottom:16px;"><strong style="font-size:14px;">设备照片</strong>
          <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:8px;">
            ${(d.photos && d.photos.length) ? d.photos.map((p, i) => `
              <div style="width:120px;height:120px;border:1px solid var(--border);border-radius:6px;overflow:hidden;cursor:pointer;position:relative;" onclick="EquipmentMaster._viewDetailPhoto('${esc(d.id)}',${i})">
                <img src="${esc(p.dataUrl)}" alt="${esc(p.name)}" style="width:100%;height:100%;object-fit:cover;">
                <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);color:white;font-size:10px;padding:2px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(p.name)}</div>
              </div>`).join('') : '<span style="color:var(--text-muted);font-size:13px;">暂无照片</span>'}
          </div></div>
        <div><strong style="font-size:14px;">电子文档</strong>
          <div style="margin-top:8px;">
            ${(d.documents && d.documents.length) ? d.documents.map(doc => `
              <div style="display:flex;align-items:center;padding:8px 12px;background:#f8fafc;border-radius:6px;margin-bottom:6px;border:1px solid var(--border);">
                <span style="font-size:16px;margin-right:8px;">&#128196;</span>
                <span style="font-size:13px;">${esc(doc.name)}</span>
                <span style="margin-left:auto;font-size:11px;color:var(--text-secondary);">${doc.size ? (doc.size < 1024 ? doc.size+'B' : (doc.size/1024).toFixed(1)+'KB') : ''}</span>
              </div>`).join('') : '<span style="color:var(--text-muted);font-size:13px;">暂无文档</span>'}
          </div></div>`;

      default: return '';
    }
  },

  // 分类-特性动态联动配置
  eqCategoryCharMap: {
    'motor': { name:'电机类', fields: [
      { id:'ratedPower', label:'额定功率', unit:'kW', type:'text' },
      { id:'ratedVoltage', label:'额定电压', unit:'V', type:'text' },
      { id:'ratedCurrent', label:'额定电流', unit:'A', type:'text' },
      { id:'ratedSpeed', label:'转速', unit:'rpm', type:'text' },
      { id:'protectionLevel', label:'防护等级', unit:'', type:'select', options:['IP23','IP44','IP54','IP55','IP65','IP66'] }
    ]},
    'pump': { name:'泵类', fields: [
      { id:'flowRate', label:'流量', unit:'m³/h', type:'text' },
      { id:'head', label:'扬程', unit:'m', type:'text' },
      { id:'pumpPower', label:'功率', unit:'kW', type:'text' },
      { id:'pumpSpeed', label:'转速', unit:'rpm', type:'text' },
      { id:'inletDiameter', label:'进口径', unit:'mm', type:'text' },
      { id:'outletDiameter', label:'出口径', unit:'mm', type:'text' }
    ]},
    'compressor': { name:'压缩机类', fields: [
      { id:'displacement', label:'排气量', unit:'m³/min', type:'text' },
      { id:'exhaustPressure', label:'排气压力', unit:'MPa', type:'text' },
      { id:'compPower', label:'功率', unit:'kW', type:'text' },
      { id:'coolingMethod', label:'冷却方式', unit:'', type:'select', options:['风冷','水冷','油冷'] }
    ]},
    'fan': { name:'风机类', fields: [
      { id:'airVolume', label:'风量', unit:'m³/h', type:'text' },
      { id:'airPressure', label:'风压', unit:'Pa', type:'text' },
      { id:'fanPower', label:'功率', unit:'kW', type:'text' },
      { id:'fanSpeed', label:'转速', unit:'rpm', type:'text' }
    ]},
    'valve': { name:'阀门类', fields: [
      { id:'nominalDiameter', label:'公称通径', unit:'mm', type:'select', options:['DN15','DN25','DN40','DN50','DN80','DN100','DN150','DN200'] },
      { id:'nominalPressure', label:'公称压力', unit:'MPa', type:'select', options:['1.0','1.6','2.5','4.0','6.4','10.0'] },
      { id:'connectionType', label:'连接方式', unit:'', type:'select', options:['法兰','螺纹','焊接','卡箍'] },
      { id:'valveMaterial', label:'阀体材质', unit:'', type:'select', options:['碳钢','304不锈钢','316L不锈钢','铸铁','黄铜'] }
    ]},
    'vessel': { name:'容器类', fields: [
      { id:'volume', label:'容积', unit:'L', type:'text' },
      { id:'designPressure', label:'设计压力', unit:'MPa', type:'text' },
      { id:'designTemp', label:'设计温度', unit:'°C', type:'text' },
      { id:'vesselMaterial', label:'主体材质', unit:'', type:'select', options:['Q245R','Q345R','304不锈钢','316L不锈钢','搪玻璃'] }
    ]},
    'heatex': { name:'换热器类', fields: [
      { id:'heatArea', label:'换热面积', unit:'m²', type:'text' },
      { id:'hexDesignPressure', label:'设计压力', unit:'MPa', type:'text' },
      { id:'hexDesignTemp', label:'设计温度', unit:'°C', type:'text' },
      { id:'hexMaterial', label:'主体材质', unit:'', type:'select', options:['304不锈钢','316L不锈钢','钛材','碳钢'] }
    ]}
  },

  addModal() {
    this.createActiveTab = 'general';
    this.createFormData = {};
    this.createCharValues = {};
    this.createPhotoFiles = [];
    this.createDocFiles = [];
    showModal('新增设备', this._buildCreateForm(), [
      { text:'取消',cls:'btn-secondary',action:()=>{ EquipmentMaster.createPhotoFiles=[]; EquipmentMaster.createDocFiles=[]; closeModal(); }},
      { text:'保存',cls:'btn-primary',action:()=>{ EquipmentMaster.submitCreate(); }}
    ], 'modal-xl');
  },

  _buildCreateForm() {
    return `<div class="form-tabs-bar" style="display:flex;border-bottom:2px solid var(--border);margin-bottom:0;flex-shrink:0;">
      <div class="form-tab active" onclick="EquipmentMaster.switchCreateTab(event,'general')">一般</div>
      <div class="form-tab" onclick="EquipmentMaster.switchCreateTab(event,'location')">位置</div>
      <div class="form-tab" onclick="EquipmentMaster.switchCreateTab(event,'org')">组织结构</div>
      <div class="form-tab" onclick="EquipmentMaster.switchCreateTab(event,'structure')">结构</div>
      <div class="form-tab" onclick="EquipmentMaster.switchCreateTab(event,'classification')">分类</div>
      <div class="form-tab" onclick="EquipmentMaster.switchCreateTab(event,'acceptance')">交付验收</div>
      <div class="form-tab" onclick="EquipmentMaster.switchCreateTab(event,'attachment')">附件</div>
    </div>
    <div id="createTabContainer" style="max-height:55vh;overflow-y:auto;padding:16px 0 0 0;">
      ${this._buildCreateGeneralTab()}
    </div>`;
  },

  _buildCreateGeneralTab() {
    const factoryOpts = FL_FACTORIES.map(f => `<option value="${esc(f.code)}">${esc(f.name)}</option>`).join('');
    return `<div id="create-tab-general" class="tab-panel active">
      <div class="form-section"><div class="form-section-title">基础信息</div>
      <div class="form-grid">
        <div class="form-group"><label>所属工厂<span class="req">*</span></label><select id="eqCreateFactory" onchange="EquipmentMaster._onFactoryChange()"><option value="">请选择</option>${factoryOpts}</select></div>
        <div class="form-group"><label>设备编号<span class="req">*</span></label><input type="text" id="eqCreateCode" placeholder="如 EQ-1000-001"></div>
        <div class="form-group"><label>设备描述<span class="req">*</span></label><input type="text" id="eqCreateName" placeholder="设备名称/描述"></div>
        <div class="form-group"><label>开始日期</label><input type="date" id="eqCreateStartDate"></div>
        <div class="form-group"><label>设备种类<span class="req">*</span></label><select id="eqCreateKind">
          <option value="">请选择</option>
          <option value="M">M - 动设备</option>
          <option value="S">S - 静设备</option>
          <option value="E">E - 电气</option>
          <option value="I">I - 仪表</option>
          <option value="O">O - 其它</option>
        </select></div>
        <div class="form-group"><label>序列号</label><input type="text" id="eqCreateSerialNo" placeholder="出厂序列号（选填）"></div>
        <div class="form-group"><label>制造商/型号</label><input type="text" id="eqCreateModel" placeholder="制造商名称/型号"></div>
      </div></div>
    </div>`;
  },

  _buildCreateLocationTab() {
    return `<div id="create-tab-location" class="tab-panel active">
      <div class="form-section"><div class="form-section-title">位置信息</div>
      <div class="form-grid">
        <div class="form-group"><label>位置</label><input type="text" id="eqCreateLocation" placeholder="如 固体制剂车间1层东侧"></div>
        <div class="form-group"><label>ABC标识<span class="req">*</span></label><select id="eqCreateAbc">
          <option value="">请选择</option>
          <option value="A">A - 关键设备</option>
          <option value="B">B - 主要设备</option>
          <option value="C">C - 一般设备</option>
        </select></div>
      </div></div>
    </div>`;
  },

  _buildCreateOrgTab() {
    return `<div id="create-tab-org" class="tab-panel active">
      <div class="form-section"><div class="form-section-title">组织结构信息</div>
      <div class="form-grid">
        <div class="form-group"><label>业务范围</label><input type="text" id="eqCreateBusinessArea" placeholder="如 固体制剂生产业务"></div>
        <div class="form-group"><label>资产编号</label><input type="text" id="eqCreateAssetNo" placeholder="如 AS-2024-001"></div>
        <div class="form-group"><label>成本中心</label><input type="text" id="eqCreateCostCenter" placeholder="如 CC-1000"></div>
        <div class="form-group"><label>WBS元素</label><input type="text" id="eqCreateWbs" placeholder="如 WBS-1000-001"></div>
        <div class="form-group"><label>计划人员组</label><select id="eqCreatePlannerGroup">
          <option value="">请选择</option>
          <option value="mechanical">机械组</option>
          <option value="electrical">电气组</option>
          <option value="instrument">仪表组</option>
          <option value="general">综合组</option>
        </select></div>
      </div></div>
    </div>`;
  },

  _buildCreateStructureTab() {
    // 构建功能位置树形选项
    const buildFLTree = (nodes, depth) => {
      let h = '';
      nodes.forEach(n => {
        const prefix = '\u00A0\u00A0'.repeat(depth);
        h += `<option value="${esc(n.id)}" data-code="${esc(n.code)}">${prefix}${esc(n.name)} (${esc(n.code)})</option>`;
        if (n.children && n.children.length) h += buildFLTree(n.children, depth + 1);
      });
      return h;
    };
    const flOpts = buildFLTree(flMockData.tree, 0);

    // 构建已有设备选项
    const eqOpts = equipmentData.map(eq => 
      `<option value="${esc(eq.id)}">${esc(eq.name)} (${esc(eq.code)})</option>`
    ).join('');

    return `<div id="create-tab-structure" class="tab-panel active">
      <div class="form-section"><div class="form-section-title">结构信息</div>
      <div class="form-grid">
        <div class="form-group"><label>功能位置</label><select id="eqCreateFL" style="max-width:100%;"><option value="">请选择</option>${flOpts}</select>
          <span style="font-size:11px;color:var(--text-muted);margin-top:2px;">选择设备安装的功能位置</span></div>
        <div class="form-group"><label>上一级设备</label><select id="eqCreateParentEq"><option value="">无（顶级设备）</option>${eqOpts}</select>
          <span style="font-size:11px;color:var(--text-muted);margin-top:2px;">选择设备归属的上级设备</span></div>
      </div></div>
    </div>`;
  },

  _buildCreateClassificationTab() {
    const catOpts = Object.entries(this.eqCategoryCharMap).map(([k,v]) => 
      `<option value="${k}">${v.name}</option>`
    ).join('');

    return `<div id="create-tab-classification" class="tab-panel active">
      <div class="form-section"><div class="form-section-title">设备分类</div>
      <div class="form-grid">
        <div class="form-group"><label>类别</label><select id="eqCreateCategory" onchange="EquipmentMaster._onCategoryChange()"><option value="">请选择</option>${catOpts}</select></div>
      </div></div>
      <div class="form-section" style="margin-top:12px;"><div class="form-section-title">特性参数</div>
      <div id="eqCreateCharFields" class="form-grid" style="padding:12px;background:#f8fafc;border-radius:8px;min-height:80px;">
        <div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">请先选择设备类别，特性参数将自动带出</div>
      </div></div>
    </div>`;
  },

  _buildCreateAcceptanceTab() {
    return `<div id="create-tab-acceptance" class="tab-panel active">
      <div class="form-section"><div class="form-section-title">流程与交付</div>
      <div class="form-grid">
        <div class="form-group"><label>OA流程ID</label><input type="text" id="eqCreateOaProcessId" placeholder="OA审批流程编号"></div>
        <div class="form-group"><label>到货日期</label><input type="date" id="eqCreateArrivalDate"></div>
        <div class="form-group"><label>安装完成日期</label><input type="date" id="eqCreateInstallDate"></div>
        <div class="form-group"><label>试运行时长</label><input type="text" id="eqCreateCommissioningDur" placeholder="如 72 小时"></div>
        <div class="form-group"><label>调试负责人</label><input type="text" id="eqCreateCommissioningMgr" placeholder="调试负责人姓名"></div>
        <div class="form-group"><label>接收部门</label><input type="text" id="eqCreateReceivingDept" placeholder="如 固体制剂车间"></div>
        <div class="form-group"><label>接收负责人</label><input type="text" id="eqCreateReceiverPerson" placeholder="接收负责人姓名"></div>
      </div></div>
      <div class="form-section" style="margin-top:12px;"><div class="form-section-title">移交与验收</div>
      <div class="form-grid">
        <div class="form-group full"><label>移交说明</label><textarea id="eqCreateHandoverNote" rows="2" placeholder="设备移交时的备注说明"></textarea></div>
        <div class="form-group full"><label>交接意见</label><textarea id="eqCreateHandoverOpinion" rows="2" placeholder="交接验收意见/结论"></textarea></div>
        <div class="form-group full"><label>验收人员</label>
          <div id="eqCreateAcceptancePersonnel" style="display:flex;flex-wrap:wrap;gap:8px;padding:8px 0;">
            ${['张工','李工','王工','赵工','陈工','刘工','周工','吴工'].map(p =>
              `<label style="display:inline-flex;align-items:center;gap:4px;font-size:13px;cursor:pointer;padding:4px 10px;border:1px solid var(--border);border-radius:4px;transition:all .15s;background:white;" class="acceptance-personnel-item">
                <input type="checkbox" value="${p}" style="margin:0;" onchange="EquipmentMaster._onAcceptancePersonnelChange(this)">${p}
              </label>`
            ).join('')}
          </div>
        </div>
      </div></div>
    </div>`;
  },

  _buildCreateAttachmentTab() {
    return `<div id="create-tab-attachment" class="tab-panel active">
      <div class="form-section"><div class="form-section-title">设备照片</div>
        <div class="form-group full">
          <label>上传设备外观照片</label>
          <input type="file" id="eqCreatePhotoInput" accept="image/*" multiple onchange="EquipmentMaster._onPhotoSelected(this)" style="padding:8px;font-size:13px;">
          <span style="font-size:11px;color:var(--text-muted);margin-top:4px;">支持 JPG、PNG、GIF、WEBP 格式，可多选</span>
          <div id="eqCreatePhotoPreview" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;min-height:60px;">
            <div style="width:100%;text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">暂无照片</div>
          </div>
        </div>
      </div>
      <div class="form-section" style="margin-top:12px;"><div class="form-section-title">操作电子文档</div>
        <div class="form-group full">
          <label>上传设备相关电子文档</label>
          <input type="file" id="eqCreateDocInput" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar" multiple onchange="EquipmentMaster._onDocumentSelected(this)" style="padding:8px;font-size:13px;">
          <span style="font-size:11px;color:var(--text-muted);margin-top:4px;">支持 PDF、Word、Excel、TXT、ZIP 等格式，可多选</span>
          <div id="eqCreateDocList" style="margin-top:10px;min-height:40px;">
            <div style="width:100%;text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">暂无文档</div>
          </div>
        </div>
      </div>
    </div>`;
  },

  _onAcceptancePersonnelChange(cb) {
    const label = cb.closest('.acceptance-personnel-item');
    if (label) {
      label.style.background = cb.checked ? '#eff6ff' : 'white';
      label.style.borderColor = cb.checked ? 'var(--primary-lighter)' : 'var(--border)';
      label.style.color = cb.checked ? 'var(--primary-lighter)' : '';
    }
  },

  _onPhotoSelected(input) {
    this.createPhotoFiles = this.createPhotoFiles || [];
    const container = document.getElementById('eqCreatePhotoPreview');
    if (!container) return;

    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.createPhotoFiles.push({ name: file.name, dataUrl: e.target.result });
        this._renderPhotoPreviews();
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  },

  _renderPhotoPreviews() {
    const container = document.getElementById('eqCreatePhotoPreview');
    if (!container) return;
    if (!this.createPhotoFiles || this.createPhotoFiles.length === 0) {
      container.innerHTML = '<div style="width:100%;text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">暂无照片</div>';
      return;
    }
    container.innerHTML = this.createPhotoFiles.map((f, i) => `
      <div style="position:relative;display:inline-block;border:1px solid var(--border);border-radius:6px;overflow:hidden;width:100px;height:100px;">
        <img src="${f.dataUrl}" alt="${esc(f.name)}" style="width:100%;height:100%;object-fit:cover;cursor:pointer;" onclick="EquipmentMaster._viewPhoto(${i})" title="点击查看大图">
        <button type="button" style="position:absolute;top:2px;right:2px;background:rgba(220,38,38,0.85);color:white;border:none;border-radius:50%;width:20px;height:20px;font-size:12px;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center;" onclick="event.stopPropagation();EquipmentMaster._removePhoto(${i})">&times;</button>
        <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);color:white;font-size:10px;padding:2px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(f.name)}</div>
      </div>`).join('');
  },

  _viewPhoto(idx) {
    if (!this.createPhotoFiles || !this.createPhotoFiles[idx]) return;
    const photo = this.createPhotoFiles[idx];
    showModal('设备照片 - ' + photo.name, `
      <div style="text-align:center;">
        <img src="${photo.dataUrl}" alt="${esc(photo.name)}" style="max-width:100%;max-height:70vh;border-radius:8px;">
      </div>`, [{ text:'关闭', cls:'btn-secondary', action: closeModal }], 'modal-lg');
  },

  _removePhoto(idx) {
    this.createPhotoFiles.splice(idx, 1);
    this._renderPhotoPreviews();
  },

  _onDocumentSelected(input) {
    this.createDocFiles = this.createDocFiles || [];
    const container = document.getElementById('eqCreateDocList');
    if (!container) return;

    Array.from(input.files).forEach(file => {
      this.createDocFiles.push({ name: file.name, size: file.size, file: file });
    });
    this._renderDocList();
    input.value = '';
  },

  _renderDocList() {
    const container = document.getElementById('eqCreateDocList');
    if (!container) return;
    if (!this.createDocFiles || this.createDocFiles.length === 0) {
      container.innerHTML = '<div style="width:100%;text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">暂无文档</div>';
      return;
    }
    const formatSize = (bytes) => bytes < 1024 ? bytes + ' B' : bytes < 1048576 ? (bytes / 1024).toFixed(1) + ' KB' : (bytes / 1048576).toFixed(1) + ' MB';
    container.innerHTML = this.createDocFiles.map((f, i) => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#f8fafc;border-radius:6px;margin-bottom:6px;border:1px solid var(--border);">
        <div style="display:flex;align-items:center;gap:8px;overflow:hidden;">
          <span style="font-size:18px;">&#128196;</span>
          <div style="overflow:hidden;">
            <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(f.name)}</div>
            <div style="font-size:11px;color:var(--text-secondary);">${formatSize(f.size)}</div>
          </div>
        </div>
        <button type="button" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:16px;padding:2px 6px;" onclick="EquipmentMaster._removeDoc(${i})">&times;</button>
      </div>`).join('');
  },

  _removeDoc(idx) {
    this.createDocFiles.splice(idx, 1);
    this._renderDocList();
  },

  switchCreateTab(event, tabName) {
    this.createActiveTab = tabName;
    const modal = event.target.closest('.modal');
    if (!modal) return;

    // 切换标签样式
    modal.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    // 构建对应面板内容并替换
    const container = modal.querySelector('#createTabContainer');
    if (!container) return;

    const tabBuilders = {
      general: this._buildCreateGeneralTab.bind(this),
      location: this._buildCreateLocationTab.bind(this),
      org: this._buildCreateOrgTab.bind(this),
      structure: this._buildCreateStructureTab.bind(this),
      classification: this._buildCreateClassificationTab.bind(this),
      acceptance: this._buildCreateAcceptanceTab.bind(this),
      attachment: this._buildCreateAttachmentTab.bind(this)
    };

    if (tabBuilders[tabName]) {
      // 在切换前保存当前面板中的表单数据
      this._saveCreateFormState();
      container.innerHTML = tabBuilders[tabName]();
      this._restoreCreateFormState();
    }
  },

  _saveCreateFormState() {
    // 保存当前可见表单字段的值
    this.createFormData = {};
    const container = document.getElementById('createTabContainer');
    if (!container) return;
    container.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.id && el.id.startsWith('eqCreate')) {
        this.createFormData[el.id] = el.type === 'checkbox' ? el.checked : el.value;
      }
    });
    // 保存验收人员多选状态
    const personnelContainer = document.getElementById('eqCreateAcceptancePersonnel');
    if (personnelContainer) {
      this._savedAcceptancePersonnel = Array.from(
        personnelContainer.querySelectorAll('input[type="checkbox"]:checked')
      ).map(cb => cb.value);
    }
  },

  _restoreCreateFormState() {
    Object.entries(this.createFormData).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) {
        if (el.type === 'checkbox') el.checked = val;
        else el.value = val || '';
      }
    });
    // 恢复分类特性值
    const charContainer = document.getElementById('eqCreateCharFields');
    if (charContainer && Object.keys(this.createCharValues).length > 0) {
      charContainer.querySelectorAll('input, select').forEach(el => {
        if (el.id && this.createCharValues[el.id] !== undefined) {
          el.value = this.createCharValues[el.id] || '';
        }
      });
    }
    // 恢复验收人员多选状态
    if (this._savedAcceptancePersonnel) {
      const personnelContainer = document.getElementById('eqCreateAcceptancePersonnel');
      if (personnelContainer) {
        personnelContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          const checked = this._savedAcceptancePersonnel.includes(cb.value);
          cb.checked = checked;
          this._onAcceptancePersonnelChange(cb);
        });
      }
      this._savedAcceptancePersonnel = null;
    }
  },

  _onFactoryChange() {
    // 工厂变更时提示用户将影响结构页签选项
  },

  _onCategoryChange() {
    const catEl = document.getElementById('eqCreateCategory');
    const catKey = catEl ? catEl.value : '';
    const container = document.getElementById('eqCreateCharFields');
    if (!container) return;

    if (!catKey || !this.eqCategoryCharMap[catKey]) {
      container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">请先选择设备类别，特性参数将自动带出</div>`;
      return;
    }

    const fields = this.eqCategoryCharMap[catKey].fields;
    let html = '';
    fields.forEach(f => {
      if (f.type === 'select' && f.options) {
        const opts = f.options.map(o => `<option value="${o}">${o}</option>`).join('');
        html += `<div class="form-group"><label>${esc(f.label)}${f.unit ? ' ('+f.unit+')' : ''}</label><select id="eqCreateChar_${f.id}"><option value="">请选择</option>${opts}</select></div>`;
      } else {
        html += `<div class="form-group"><label>${esc(f.label)}${f.unit ? ' ('+f.unit+')' : ''}</label><input type="text" id="eqCreateChar_${f.id}" placeholder="请输入${esc(f.label)}"></div>`;
      }
    });
    container.innerHTML = html;
  },

  submitCreate() {
    // 从当前活动的tab面板中收集所有字段值
    const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };

    // 先合并之前保存的表单状态
    const allData = { ...this.createFormData };
    const container = document.getElementById('createTabContainer');
    if (container) {
      container.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.id && el.id.startsWith('eqCreate')) {
          allData[el.id] = el.type === 'checkbox' ? el.checked : el.value;
        }
      });
    }

    const factory = getVal('eqCreateFactory');
    const code = getVal('eqCreateCode');
    const name = getVal('eqCreateName');
    const kind = getVal('eqCreateKind');
    const abc = getVal('eqCreateAbc');

    // 必填校验
    if (!factory) { toast('请选择所属工厂！'); return; }
    if (!code) { toast('请输入设备编号！'); return; }
    if (!name) { toast('请输入设备描述！'); return; }
    if (!kind) { toast('请选择设备种类！'); return; }
    if (!abc) { toast('请选择ABC标识！'); return; }

    // 编码唯一性校验
    if (equipmentData.some(e => e.code === code)) { toast('设备编号已存在，请更换！'); return; }

    const kindMap = { 'M':'动设备', 'S':'静设备', 'E':'电气', 'I':'仪表', 'O':'其它' };
    const catKey = getVal('eqCreateCategory');
    const catName = catKey && this.eqCategoryCharMap[catKey] ? this.eqCategoryCharMap[catKey].name : '';

    // 收集分类特性参数值
    const charContainer = document.getElementById('eqCreateCharFields');
    const charValues = {};
    if (charContainer) {
      charContainer.querySelectorAll('input, select').forEach(el => {
        if (el.id && el.id.startsWith('eqCreateChar_')) {
          const fieldId = el.id.replace('eqCreateChar_', '');
          charValues[fieldId] = el.value.trim();
        }
      });
    }

    // 收集验收人员多选
    const personnelEls = document.querySelectorAll('#eqCreateAcceptancePersonnel input[type="checkbox"]:checked');
    const acceptancePersonnel = Array.from(personnelEls).map(cb => cb.value);

    // 收集照片和文档（数据存储为引用，实际存储dataUrl）
    const photos = (this.createPhotoFiles || []).map(f => ({ name: f.name, dataUrl: f.dataUrl }));
    const docs = (this.createDocFiles || []).map(f => ({ name: f.name, size: f.size }));

    // 获取功能位置信息
    const flId = getVal('eqCreateFL');
    let flName = '', flCode = '';
    if (flId) {
      const found = this._findFLNode(flMockData.tree, flId);
      if (found) { flName = found.name; flCode = found.code; }
    }

    // 获取功能位置对应的工厂前缀（用于生成location字段）
    const locationVal = flId || factory;

    // 生成新ID
    const maxId = equipmentData.reduce((max, e) => {
      const num = parseInt(e.id.replace('EQ', ''));
      return num > max ? num : max;
    }, 0);
    const newId = 'EQ' + String(maxId + 1).padStart(3, '0');

    const newEq = {
      id: newId,
      code: code,
      name: name,
      model: getVal('eqCreateModel') || '-',
      manufacturer: getVal('eqCreateModel') || '-',
      serialNo: getVal('eqCreateSerialNo') || '-',
      type: kind,
      typeName: kindMap[kind] || kind,
      location: locationVal,
      locationName: flName || getVal('eqCreateLocation') || factory,
      workCenter: '',
      workCenterName: '',
      status: 'running',
      statusName: '运行中',
      power: charValues.ratedPower || charValues.pumpPower || charValues.compPower || '-',
      cleanLevel: '-',
      gmpClass: abc === 'A' ? '关键设备' : abc === 'B' ? '主要设备' : '一般设备',
      factoryDate: getVal('eqCreateStartDate') || '-',
      purchaseDate: '-',
      warrantyEnd: '-',
      leader: '-',
      team: '',
      teamName: '',
      category: catName || '-',
      group: kindMap[kind] || '-',
      priority: abc === 'A' ? '高' : abc === 'B' ? '中' : '低',
      maintenanceStrategy: abc === 'A' ? '月保养' : '季度保养',
      voltage: charValues.ratedVoltage || '-',
      capacity: charValues.flowRate || charValues.volume || '-',
      material: charValues.vesselMaterial || charValues.hexMaterial || charValues.valveMaterial || '-',
      envReq: '-',
      // 已有扩展字段
      eqKind: kind,
      abcIndicator: abc,
      businessArea: getVal('eqCreateBusinessArea') || '',
      assetNumber: getVal('eqCreateAssetNo') || '',
      costCenter: getVal('eqCreateCostCenter') || '',
      wbsElement: getVal('eqCreateWbs') || '',
      plannerGroup: getVal('eqCreatePlannerGroup') || '',
      functionalLocation: flId,
      functionalLocationCode: flCode,
      parentEquipmentId: getVal('eqCreateParentEq') || '',
      eqCategory: catKey,
      eqCategoryName: catName,
      characteristics: charValues,
      // 交付验收字段
      oaProcessId: getVal('eqCreateOaProcessId') || '',
      arrivalDate: getVal('eqCreateArrivalDate') || '',
      installDate: getVal('eqCreateInstallDate') || '',
      commissioningDuration: getVal('eqCreateCommissioningDur') || '',
      commissioningManager: getVal('eqCreateCommissioningMgr') || '',
      receivingDept: getVal('eqCreateReceivingDept') || '',
      receiverPerson: getVal('eqCreateReceiverPerson') || '',
      handoverNote: getVal('eqCreateHandoverNote') || '',
      handoverOpinion: getVal('eqCreateHandoverOpinion') || '',
      acceptancePersonnel: acceptancePersonnel,
      // 附件
      photos: photos,
      documents: docs,
      // 报废相关字段
      assetNo: '',
      disposalDate: null,
      disposalReason: null,
      disposalApprovalNo: null,
      disposalAttachment: null
    };

    equipmentData.push(newEq);
    // 清理临时状态
    this.createPhotoFiles = [];
    this.createDocFiles = [];
    toast('设备创建成功！编号：' + newEq.code);
    closeModal();
    this.renderTable();
  },

  _findFLNode(nodes, id) {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children && n.children.length) {
        const found = this._findFLNode(n.children, id);
        if (found) return found;
      }
    }
    return null;
  },

  goBOM(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) return;

    let bom = bomListData.find(b => b.eqCode === eq.code || b.eqCode === eqId);
    let isNew = false;

    if (!bom) {
      const maxId = bomListData.reduce((max, b) => {
        const num = parseInt(b.id.replace('BOM', ''));
        return num > max ? num : max;
      }, 0);
      const newId = 'BOM' + String(maxId + 1).padStart(3, '0');
      bom = {
        id: newId, eqCode: eq.code, eqName: eq.name, version: 'V1.0',
        status: 'draft', creator: '当前用户',
        createTime: new Date().toLocaleString('zh-CN'), syncTime: '-', syncStatus: 'pending'
      };
      bomListData.push(bom);
      bomDetailData[newId] = { eqCode: eq.code, eqName: eq.name, version: 'V1.0', status: 'draft', items: [] };
      if (!bomLogs[newId]) bomLogs[newId] = [];
      isNew = true;
    }

    const detail = bomDetailData[bom.id];
    this.bomEditingId = bom.id;
    this.bomEditingItems = (detail && detail.items) ? detail.items.map(item => ({ ...item })) : [];

    const logs = bomLogs[bom.id] || [];
    const statusMap = { published: '已发布', draft: '草稿', cancelled: '已作废' };

    const logsHtml = logs.length ? logs.map(l => `
      <div style="padding:10px;background:#f8fafc;border-radius:6px;margin-bottom:6px;border-left:3px solid var(--primary);">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
          <span class="badge badge-blue" style="font-size:11px;">${esc(l.version)} ${esc(l.action)}</span>
          <span style="font-size:11px;color:var(--text-secondary);">${esc(l.time)}</span>
        </div>
        <div style="font-size:12px;">${esc(l.content)}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:3px;">操作人：${esc(l.user)}</div>
      </div>`).join('') : '<p style="color:var(--text-muted);text-align:center;padding:16px;">暂无版本记录</p>';

    const body = `
      <div style="margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:18px;font-weight:700;">${esc(eq.name)}</div>
          <div style="font-size:12px;color:var(--text-secondary);">设备编码：${esc(eq.code)} | BOM版本：${esc(bom.version)}${isNew ? ' <span class="badge badge-yellow" style="margin-left:4px;font-size:11px;">新建</span>' : ''}</div>
        </div>
        <div><span class="badge ${bom.status === 'published' ? 'badge-green' : bom.status === 'draft' ? 'badge-yellow' : 'badge-red'}">${statusMap[bom.status] || bom.status}</span></div>
      </div>
      <div class="detail-grid" style="margin-bottom:16px;">
        <div class="detail-item"><dt>BOM编号</dt><dd>${esc(bom.id)}</dd></div>
        <div class="detail-item"><dt>设备编码</dt><dd>${esc(bom.eqCode)}</dd></div>
        <div class="detail-item"><dt>设备名称</dt><dd>${esc(bom.eqName)}</dd></div>
        <div class="detail-item"><dt>版本</dt><dd>${esc(bom.version)}</dd></div>
        <div class="detail-item"><dt>创建人</dt><dd>${esc(bom.creator)}</dd></div>
        <div class="detail-item"><dt>创建时间</dt><dd>${esc(bom.createTime)}</dd></div>
      </div>
      <div class="tabs" style="margin-bottom:16px;">
        <div class="tab active" onclick="EquipmentMaster.switchBomTab(event,'items')">BOM物料清单</div>
        <div class="tab" onclick="EquipmentMaster.switchBomTab(event,'logs')">版本日志</div>
      </div>
      <div id="bom-tab-items" class="tab-panel active">
        <div id="bomEditTableContainer">${this.renderBomEditTable()}</div>
      </div>
      <div id="bom-tab-logs" class="tab-panel">${logsHtml}</div>`;

    showModal(`BOM - ${eq.name}`, body, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '保存', cls: 'btn-primary', action: () => { EquipmentMaster.saveBom(); } }
    ], 'modal-lg');
  },

  // ===== 测量点弹窗（类似BOM） =====
  goMeasurementPoint(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) return;

    const eqPoints = measurementPointData.filter(mp => mp.equipmentId === eqId);
    this.mpEditingEqId = eqId;
    this.mpEditMode = 'view';
    this.mpActiveTab = 'list';

    const body = `
      <div style="margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:20px;font-weight:700;">${esc(eq.name)} - 测量点定义</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">设备编码：${esc(eq.code)} | 共 <strong>${eqPoints.length}</strong> 个测量点</div>
        </div>
        ${this.mpEditMode === 'view' ? `<button class="btn btn-blue btn-sm" onclick="EquipmentMaster.mpSwitchMode('edit'); EquipmentMaster.refreshMpModal();">✏ 编辑</button>` : ''}
      </div>
      <div class="tabs" style="margin-bottom:18px;">
        <div class="tab ${this.mpActiveTab==='list'?'active':''}" onclick="EquipmentMaster.switchMpTab(event,'list')">📋 测量点列表</div>
      </div>
      <div id="mp-tab-list" class="tab-panel active">
        ${this.renderMpList(eqPoints, eq)}
      </div>`;

    showModal(`测量点 - ${eq.name}`, body, [
      { text:'关闭', cls:'btn-secondary', action: closeModal },
      { text:'保存', cls:'btn-primary', action: () => { EquipmentMaster.saveMp(); } }
    ], 'modal-xl mp-modal');
  },

  renderMpList(points, eq) {
    if (points.length === 0) {
      return `<div style="text-align:center;padding:40px;color:var(--text-muted);">
        <div style="font-size:44px;margin-bottom:12px;">📐</div>
        <div style="font-size:14px;margin-bottom:14px;">该设备暂未配置测量点</div>
        <button class="btn btn-blue btn-sm" onclick="EquipmentMaster.addMpRow()">+ 新增测量点</button>
      </div>`;
    }

    let html = `<div style="overflow-x:auto;"><table class="data-table" style="font-size:13px;">
      <thead><tr>
        <th style="width:44px;">#</th>
        <th>编码</th>
        <th>名称</th>
        <th>类型</th>
        <th>单位</th>
        <th>阈值上限</th>
        <th>阈值下限</th>
        <th>报警</th>
        <th>计数器</th>
        <th>状态</th>
        <th style="width:100px;">操作</th>
      </tr></thead><tbody>`;

    points.forEach((mp, idx) => {
      html += `<tr style="height:42px;">
        <td style="text-align:center;color:var(--text-secondary);">${idx + 1}</td>
        <td><strong>${esc(mp.code)}</strong></td>
        <td>${esc(mp.name)}</td>
        <td><span class="badge ${mp.type==='QTY'?'badge-blue':'badge-purple'}">${mp.typeName}</span></td>
        <td>${esc(mp.unit || '-')}</td>
        <td>${esc(mp.upperLimit !== null ? mp.upperLimit : '-')}</td>
        <td>${esc(mp.lowerLimit !== null ? mp.lowerLimit : '-')}</td>
        <td>${mp.alarmEnabled ? '<span style="color:var(--danger);">● 开启</span>' : '<span style="color:var(--text-muted);">○ 关闭</span>'}</td>
        <td>${mp.isCounter ? '<span style="color:var(--warning);font-weight:bold;">⏱ 计数器</span>' : '-'}</td>
        <td><span class="badge ${mp.status==='active'?'badge-green':'badge-gray'}">${mp.statusName}</span></td>
        <td>
          ${this.mpEditMode === 'edit' ? `
            <button class="btn btn-sm" style="background:#dbeafe;color:#2563eb;border:none;padding:4px 10px;font-size:12px;cursor:pointer;border-radius:4px;" onclick="EquipmentMaster.editMp(${idx})">编辑</button>
            <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 10px;font-size:12px;cursor:pointer;border-radius:4px;" onclick="EquipmentMaster.deleteMp(${idx})">删除</button>
          ` : '-'}
        </td>
      </tr>`;
    });

    html += `</tbody></table></div>`;
    
    if (this.mpEditMode === 'edit') {
      html += `<div style="text-align:center;margin-top:14px;padding-top:14px;border-top:1px dashed var(--border);">
        <button class="btn btn-blue btn-sm" onclick="EquipmentMaster.addMpRow()">+ 新增测量点</button>
        <span style="margin-left:10px;font-size:13px;color:var(--text-muted);">共 ${points.length} 个测量点</span>
      </div>`;
    }

    return html;
  },

  mpSwitchMode(mode) {
    this.mpEditMode = mode;
  },

  switchMpTab(event, name) {
    const modal = document.querySelector('.modal-backdrop:not(.hidden) .modal');
    if (!modal) return;
    modal.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    modal.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const target = modal.querySelector(`#mp-tab-${name}`);
    if (target) target.classList.add('active');
  },

  refreshMpModal() {
    const modalBody = document.querySelector('.modal-backdrop:not(.hidden) .modal-body');
    if (!modalBody) return;

    const eqId = this.mpEditingEqId;
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) return;

    const eqPoints = measurementPointData.filter(mp => mp.equipmentId === eqId);

    modalBody.innerHTML = `
      <div style="margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:20px;font-weight:700;">${esc(eq.name)} - 测量点定义</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">设备编码：${esc(eq.code)} | 共 <strong>${eqPoints.length}</strong> 个测量点</div>
        </div>
        ${this.mpEditMode === 'view' ? `<button class="btn btn-blue btn-sm" onclick="EquipmentMaster.mpSwitchMode('edit'); EquipmentMaster.refreshMpModal();">✏ 编辑</button>` : 
          `<button class="btn btn-secondary btn-sm" onclick="EquipmentMaster.mpSwitchMode('view'); EquipmentMaster.refreshMpModal();">↩ 返回查看</button>`}
      </div>
      <div class="tabs" style="margin-bottom:18px;">
        <div class="tab ${this.mpActiveTab==='list'?'active':''}" onclick="EquipmentMaster.switchMpTab(event,'list')">📋 测量点列表</div>
      </div>
      <div id="mp-tab-list" class="tab-panel active">
        ${this.renderMpList(eqPoints, eq)}
      </div>`;

    // 刷新footer按钮可见性
    const footer = document.querySelector('.modal-backdrop:not(.hidden) .modal-footer');
    if (footer) {
      footer.style.display = this.mpEditMode === 'edit' ? '' : 'none';
    }
  },

  addMpRow() {
    const eq = equipmentData.find(e => e.id === this.mpEditingEqId);
    if (!eq) return;

    const maxNum = measurementPointData.reduce((max, mp) => {
      const num = parseInt(mp.id.replace('MP', ''));
      return num > max ? num : max;
    }, 0);
    const newId = 'MP' + String(maxNum + 1).padStart(3, '0');

    const newPoint = {
      id: newId,
      code: 'MP-' + eq.code + '-' + String(measurementPointData.filter(mp=>mp.equipmentId===this.mpEditingEqId).length + 1).padStart(3,'0'),
      name: '',
      equipmentId: this.mpEditingEqId,
      equipmentCode: eq.code,
      equipmentName: eq.name,
      bomComponentId: '',
      bomComponentName: '设备整体',
      type: 'QTY',
      typeName: '定量',
      unit: '',
      upperLimit: null,
      lowerLimit: null,
      alarmEnabled: false,
      qualitativeCodeGroup: '',
      alarmCodes: '',
      isCounter: false,
      initialCounter: null,
      yearlyEstimate: null,
      status: 'active',
      statusName: '启用',
      remark: '',
      createdBy: '当前用户',
      createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN')
    };

    measurementPointData.push(newPoint);
    toast('已添加新测量点，请在下方填写详细信息');
    this.refreshMpModal();

    // 自动滚动到底部并聚焦到最后一行的name输入框
    setTimeout(() => {
      const rows = document.querySelectorAll('#mp-tab-list table tbody tr');
      const lastRow = rows[rows.length - 1];
      if (lastRow) {
        lastRow.style.background = '#fef9c3';
        setTimeout(() => { lastRow.style.background = ''; }, 2000);
      }
    }, 100);
  },

  editMp(idx) {
    const eqPoints = measurementPointData.filter(mp => mp.equipmentId === this.mpEditingEqId);
    const mp = eqPoints[idx];
    if (!mp) return;

    const eq = equipmentData.find(e => e.id === this.mpEditingEqId);
    const codeGroupsHtml = Object.entries(qualitativeCodeGroups).map(([key, cg]) =>
      `<option value="${key}">${esc(cg.name)}</option>`
    ).join('');

    const unitOptions = ['mm/s','bar','℃','h','km','件','kN','mg','件/分钟','MPa','rpm','%','m³/h','Pa','m','L','m²','kg','t','V','A','Hz'].map(u=>
      `<option value="${u}" ${(mp.unit===u)?'selected':''}>${u}</option>`
    ).join('');

    showModal('编辑测量点', `
      <div style="margin-bottom:14px;padding:10px;background:#f0f9ff;border-radius:6px;font-size:13px;color:var(--text-secondary);">
        设备：<strong>${esc(eq?eq.name:'')}</strong> (${esc(eq?eq.code:'')})
      </div>
      <div class="form-grid">
        <div class="form-group"><label>测量点编码<span class="req">*</span></label><input id="mpEditCode" value="${esc(mp.code)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;"></div>
        <div class="form-group"><label>测量点名称<span class="req">*</span></label><input id="mpEditName" value="${esc(mp.name)}" placeholder="如 驱动端轴承振动"></div>
        <div class="form-group"><label>测量类型<span class="req">*</span></label>
          <select id="mpEditType" onchange="EquipmentMaster.onMpTypeChange()">
            <option value="QTY" ${mp.type==='QTY'?'selected':''}>定量 (QTY)</option>
            <option value="QLTY" ${mp.type==='QLTY'?'selected':''}>定性 (QLTY)</option>
          </select>
        </div>
        <div class="form-group"><label>单位</label>
          <select id="mpEditUnit"><option value="">请选择</option>${unitOptions}</select>
        </div>
        <div class="form-group"><label>阈值上限</label><input type="number" step="any" id="mpEditUpper" value="${mp.upperLimit!==null?mp.upperLimit:''}" placeholder="不填则无限制"></div>
        <div class="form-group"><label>阈值下限</label><input type="number" step="any" id="mpEditLower" value="${mp.lowerLimit!==null?mp.lowerLimit:''}" placeholder="不填则无限制"></div>
        <div class="form-group"><label>阈值报警</label>
          <select id="mpEditAlarm"><option value="true" ${mp.alarmEnabled?'selected':''}>开启</option><option value="false" ${!mp.alarmEnabled?'selected':''}>关闭</option></select>
        </div>
        <div class="form-group"><label>设为计数器</label>
          <select id="mpEditCounter"><option value="true" ${mp.isCounter?'selected':''}>是</option><option value="false" ${!mp.isCounter?'selected':''}>否</option></select>
        </div>
      </div>
      
      <div id="mpQualitativeSection" style="display:${mp.type==='QLTY'?'block':'none'};margin-top:14px;padding:14px;background:#faf5ff;border-radius:8px;border:1px solid #ddd6fe;">
        <div style="font-weight:600;color:#7c3aed;margin-bottom:10px;font-size:14px;">定性配置</div>
        <div class="form-grid">
          <div class="form-group"><label>代码组<span class="req">*</span></label>
            <select id="mpEditCodeGroup"><option value="">请选择</option>${codeGroupsHtml}</select>
          </div>
          <div class="form-group"><label>报警值</label><input id="mpEditAlarmCodes" value="${esc(mp.alarmCodes)}" placeholder="选中的代码视为报警，如 abnormal"></div>
        </div>
      </div>

      <div id="mpCounterSection" style="display:${mp.isCounter?'block':'none'};margin-top:14px;padding:14;background:#fffbeb;border-radius:8px;border:1px solid #fde68a;">
        <div style="font-weight:600;color:#d97706;margin-bottom:10px;font-size:14px;">计数器配置</div>
        <div class="form-grid">
          <div class="form-group"><label>初始读数</label><input type="number" id="mpEditInitialCounter" value="${mp.initialCounter!==null?mp.initialCounter:''}" placeholder="首次基准读数"></div>
          <div class="form-group"><label>年估算值</label><input type="number" id="mpEditYearlyEstimate" value="${mp.yearlyEstimate!==null?mp.yearlyEstimate:''}" placeholder="如 6000"></div>
        </div>
      </div>

      <div style="margin-top:14px;">
        <div class="form-group full"><label>备注</label><textarea id="mpEditRemark" rows="2" placeholder="可选备注说明">${esc(mp.remark)}</textarea></div>
      </div>

      <div style="margin-top:14px;padding:10px;background:#f8fafc;border-radius:6px;font-size:12px;color:var(--text-secondary);">
        状态：<select id="mpEditStatus" style="padding:4px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;">
          <option value="active" ${mp.status==='active'?'selected':''}>启用</option>
          <option value="inactive" ${mp.status==='inactive'?'selected':''}>停用</option>
        </select>
      </div>
    `, [
      { text:'取消',cls:'btn-secondary',action:closeModal },
      { text:'保存',cls:'btn-primary',action:()=>{ EquipmentMaster.saveMpEdit(mp.id); } }
    ]);
  },

  onMpTypeChange() {
    const typeEl = document.getElementById('mpEditType');
    const qualSec = document.getElementById('mpQualitativeSection');
    if (typeEl && qualSec) {
      qualSec.style.display = typeEl.value === 'QLTY' ? 'block' : 'none';
    }
  },

  saveMpEdit(mpId) {
    const mp = measurementPointData.find(m => m.id === mpId);
    if (!mp) return;

    const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const code = getVal('mpEditCode');
    const name = getVal('mpEditName');
    const type = getVal('mpEditType');

    if (!code) { toast('请填写测量点编码！'); return; }
    if (!name) { toast('请填写测量点名称！'); return; }

    // 编码唯一性校验（排除自身）
    if (measurementPointData.some(m => m.code === code && m.id !== mpId)) {
      toast('该编码已存在，请更换！'); return;
    }

    mp.code = code;
    mp.name = name;
    mp.type = type;
    mp.typeName = type === 'QTY' ? '定量' : '定性';
    mp.unit = getVal('mpEditUnit');
    mp.upperLimit = document.getElementById('mpEditUpper').value !== '' ? parseFloat(document.getElementById('mpEditUpper').value) : null;
    mp.lowerLimit = document.getElementById('mpEditLower').value !== '' ? parseFloat(document.getElementById('mpEditLower').value) : null;
    mp.alarmEnabled = getVal('mpEditAlarm') === 'true';
    mp.qualitativeCodeGroup = getVal('mpEditCodeGroup');
    mp.alarmCodes = getVal('mpEditAlarmCodes');
    mp.isCounter = getVal('mpEditCounter') === 'true';
    mp.initialCounter = document.getElementById('mpEditInitialCounter').value !== '' ? parseFloat(document.getElementById('mpEditInitialCounter').value) : null;
    mp.yearlyEstimate = document.getElementById('mpEditYearlyEstimate').value !== '' ? parseFloat(document.getElementById('mpEditYearlyEstimate').value) : null;
    mp.remark = getVal('mpEditRemark');
    mp.status = getVal('mpEditStatus');
    mp.statusName = mp.status === 'active' ? '启用' : '停用';
    mp.updatedAt = new Date().toLocaleString('zh-CN');

    toast('测量点保存成功！');
    closeModal();
    this.refreshMpModal();
  },

  deleteMp(idx) {
    const eqPoints = measurementPointData.filter(mp => mp.equipmentId === this.mpEditingEqId);
    const mp = eqPoints[idx];
    if (!mp) return;

    // 检查是否有测量记录
    const hasRecords = measurementRecordData.some(r => r.measurementPointId === mp.id);
    if (hasRecords) {
      toast('该测量点已有测量记录，无法删除！（可先停用）');
      return;
    }

    if (!confirm(`确认删除测量点「${mp.name}」？此操作不可撤销。`)) return;

    const dataIdx = measurementPointData.findIndex(m => m.id === mp.id);
    if (dataIdx >= 0) measurementPointData.splice(dataIdx, 1);

    toast('测量点已删除');
    this.refreshMpModal();
  },

  saveMp() {
    toast('测量点数据已保存！');
    closeModal();
  },

  renderBomEditTable() {
    const items = this.bomEditingItems || [];
    if (items.length === 0) {
      return `<div style="text-align:center;padding:30px;color:var(--text-muted);">
        <div style="font-size:40px;margin-bottom:8px;">&#128203;</div>
        <div style="font-size:13px;">暂无BOM组件，请点击下方按钮添加</div>
      </div>
      <div style="text-align:center;margin-top:12px;">
        <button class="btn btn-blue btn-sm" onclick="EquipmentMaster.addBomRow()">+ 添加组件</button>
      </div>`;
    }
    let html = `<div style="overflow-x:auto;"><table class="data-table" style="font-size:12px;">
      <thead><tr>
        <th style="width:30px;">#</th>
        <th>物料编码 <span style="color:#ef4444;">*</span></th>
        <th>物料名称 <span style="color:#ef4444;">*</span></th>
        <th style="width:80px;">单位</th>
        <th style="width:80px;">数量</th>
        <th>供应商</th>
        <th>备注</th>
        <th style="width:60px;">操作</th>
      </tr></thead><tbody>`;

    items.forEach((item, idx) => {
      html += `<tr>
        <td style="text-align:center;color:var(--text-secondary);">${idx + 1}</td>
        <td><input value="${esc(item.code)}" onchange="EquipmentMaster.updateBomItem(${idx},'code',this.value)" style="width:100%;padding:5px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;" placeholder="编码"></td>
        <td><input value="${esc(item.name)}" onchange="EquipmentMaster.updateBomItem(${idx},'name',this.value)" style="width:100%;padding:5px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;" placeholder="名称"></td>
        <td><input value="${esc(item.unit)}" onchange="EquipmentMaster.updateBomItem(${idx},'unit',this.value)" style="width:80px;padding:5px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;"></td>
        <td><input type="number" value="${item.qty}" onchange="EquipmentMaster.updateBomItem(${idx},'qty',parseFloat(this.value)||0)" style="width:70px;padding:5px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;" min="0" step="1"></td>
        <td><input value="${esc(item.supplier)}" onchange="EquipmentMaster.updateBomItem(${idx},'supplier',this.value)" style="width:100%;padding:5px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;" placeholder="供应商"></td>
        <td><input value="${esc(item.remark || '')}" onchange="EquipmentMaster.updateBomItem(${idx},'remark',this.value)" style="width:100%;padding:5px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;" placeholder="备注"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;cursor:pointer;border-radius:4px;" onclick="EquipmentMaster.deleteBomRow(${idx})">&#10005; 删除</button></td>
      </tr>`;
    });

    html += `</tbody></table></div>
    <div style="text-align:center;margin-top:12px;padding-top:12px;border-top:1px dashed var(--border);">
      <button class="btn btn-blue btn-sm" onclick="EquipmentMaster.addBomRow()">+ 添加组件</button>
      <span style="margin-left:8px;font-size:12px;color:var(--text-muted);">共 ${items.length} 个组件</span>
    </div>`;
    return html;
  },

  addBomRow() {
    if (!this.bomEditingItems) this.bomEditingItems = [];
    this.bomEditingItems.push({
      id: '', parentId: null, level: 0,
      code: '', name: '', unit: '个', qty: 1, supplier: '', remark: ''
    });
    this.refreshBomEditTable();
  },

  deleteBomRow(idx) {
    if (!this.bomEditingItems) return;
    this.bomEditingItems.splice(idx, 1);
    this.refreshBomEditTable();
  },

  updateBomItem(idx, field, value) {
    if (!this.bomEditingItems || !this.bomEditingItems[idx]) return;
    this.bomEditingItems[idx][field] = value;
  },

  refreshBomEditTable() {
    const container = document.getElementById('bomEditTableContainer');
    if (container) container.innerHTML = this.renderBomEditTable();
  },

  saveBom() {
    const bomId = this.bomEditingId;
    if (!bomId) return;
    const detail = bomDetailData[bomId];
    if (!detail) return;

    const items = this.bomEditingItems || [];
    const valid = items.every(it => it.code.trim() && it.name.trim());
    if (!valid) {
      toast('请完善所有组件的物料编码和物料名称！');
      return;
    }

    items.forEach((item, idx) => {
      if (!item.id) item.id = bomId + '-' + String(idx + 1).padStart(3, '0');
    });
    detail.items = [...items];

    if (!bomLogs[bomId]) bomLogs[bomId] = [];
    bomLogs[bomId].push({
      version: detail.version, action: '编辑',
      time: new Date().toLocaleString('zh-CN'), user: '当前用户',
      content: '更新BOM物料清单，共' + items.length + '个组件'
    });

    toast('BOM保存成功！');
    closeModal();
  },

  switchBomTab(event, name) {
    const modal = document.querySelector('.modal-backdrop:not(.hidden) .modal');
    if (!modal) return;
    modal.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    modal.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const target = modal.querySelector(`#bom-tab-${name}`);
    if (target) target.classList.add('active');
  },

  // ===== 设备维护/报废入口 =====
  maintain(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) { toast('设备不存在'); return; }

    // 已报废设备直接查看，不弹出菜单
    if (eq.status === 'scrapped') {
      this.detail(eqId);
      return;
    }

    const body = `
      <div style="padding:8px 0;">
        <div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe;margin-bottom:20px;">
          <span style="font-size:22px;flex-shrink:0;">🔧</span>
          <div style="font-size:13px;line-height:1.6;">
            <div style="font-weight:600;">请选择要执行的操作</div>
            <div style="color:var(--text-secondary);margin-top:2px;">设备：${esc(eq.code)} — ${esc(eq.name)}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <!-- 维护模块 -->
          <div id="maintain-option-maintenance" onclick="EquipmentMaster.detail('${eqId}')" 
               style="cursor:pointer;padding:24px 20px;border:2px solid var(--border);border-radius:12px;text-align:center;transition:all 0.2s;background:#fff;"
               onmouseover="this.style.borderColor='var(--primary)';this.style.boxShadow='0 4px 16px rgba(37,99,235,0.12)';this.style.transform='translateY(-2px)';"
               onmouseout="this.style.borderColor='var(--border)';this.style.boxShadow='none';this.style.transform='none';">
            <div style="font-size:36px;margin-bottom:10px;">🛠️</div>
            <div style="font-weight:700;font-size:15px;color:var(--text);margin-bottom:6px;">维护</div>
            <div style="font-size:12px;color:var(--text-muted);line-height:1.5;">查看/编辑设备详细信息<br>管理设备参数与档案</div>
          </div>

          <!-- 报废模块 -->
          <div id="maintain-option-disposal" onclick="EquipmentMaster.retire('${eqId}')" 
               style="cursor:pointer;padding:24px 20px;border:2px solid var(--border);border-radius:12px;text-align:center;transition:all 0.2s;background:#fff;"
               onmouseover="this.style.borderColor='#ef4444';this.style.boxShadow='0 4px 16px rgba(239,68,68,0.12)';this.style.transform='translateY(-2px)';"
               onmouseout="this.style.borderColor='var(--border)';this.style.boxShadow='none';this.style.transform='none';">
            <div style="font-size:36px;margin-bottom:10px;">🗑️</div>
            <div style="font-weight:700;font-size:15px;color:#dc2626;margin-bottom:6px;">报废</div>
            <div style="font-size:12px;color:var(--text-muted);line-height:1.5;">执行设备报废审批后操作<br>解绑位置并标记报废状态</div>
          </div>
        </div>
      </div>`;

    showModal('设备维护 — 选择操作',
      body,
      [{ text:'取消', cls:'btn-secondary', action: closeModal }],
      'modal-md');
  },

  // ===== 设备报废功能 =====
  retire(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) { toast('设备不存在'); return; }
    if (eq.status === 'scrapped') { toast('该设备已报废，无需重复操作'); return; }

    closeModal();
    this._openDisposalForm(eqId);
  },

  /* ========== 报废信息登记（完整表单） ========== */
  _openDisposalForm(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) return;

    const today = new Date().toISOString().split('T')[0];

    const body = `
    <div style="padding:2px 0;max-height:72vh;overflow-y:auto;padding-right:4px;" class="custom-scrollbar">

      <!-- 设备概览卡片 -->
      <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:linear-gradient(135deg,#fef2f2,#fee2e2);border-radius:10px;border:1px solid #fca5a5;margin-bottom:20px;">
        <div style="font-size:28px;">🗑️</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;font-size:15px;color:#991b1b;">设备报废登记</div>
          <div style="font-size:12.5px;color:#7f1d1d;margin-top:3px;">${esc(eq.code)} — ${esc(eq.name)} &nbsp;|&nbsp; ${esc(eq.locationName)}</div>
        </div>
        <span style="flex-shrink:0;font-size:11px;padding:4px 10px;background:white;border-radius:6px;color:#dc2626;font-weight:600;border:1px solid #fecaca;">此操作不可逆</span>
      </div>

      <!-- ===== 分组一：基础信息 ===== -->
      <fieldset style="border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:14px;">
        <legend style="font-weight:700;font-size:13.5px;color:var(--text);padding:0 8px;margin-left:12px;">📋 基础信息</legend>
        <div class="form-grid">
          <div class="form-group"><label>申请单号<span class="req">*</span></label><input id="dspApplyNo" placeholder="全局唯一编号，线下单据编号可录入系统备查"></div>
          <div class="form-group"><label>申请日期<span class="req">*</span></label><input type="date" id="dspApplyDate" value="${today}"></div>
          <div class="form-group"><label>申请人<span class="req">*</span></label><input id="dspApplicant" value="当前用户" placeholder="申请人姓名"></div>
          <div class="form-group"><label>设备编码 / 名称</label><input id="dspEqInfo" value="${esc(eq.code)} / ${esc(eq.name)}" readonly style="background:#f9fafb;"></div>
          <div class="form-group"><label>所属部门</label><input id="dspDept" value="${esc(eq.teamName||eq.workCenterName||'')}" placeholder="明确设备归属地"></div>
          <div class="form-group"><label>安装位置</label><input id="dspInstallLoc" value="${esc(eq.locationName)}" readonly style="background:#f9fafb;"></div>
        </div>
      </fieldset>

      <!-- ===== 分组二：设备关键追溯信息 ===== -->
      <fieldset style="border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:14px;">
        <legend style="font-weight:700;font-size:13.5px;color:var(--text);padding:0 8px;margin-left:12px;">🔍 设备关键追溯信息</legend>
        <div class="form-grid">
          <div class="form-group"><label>关键性评估</label>
            <select id="dspCriticality">
              <option value="">请选择</option>
              <option value="是">是 — 直接影响产品质量的关键设备</option>
              <option value="否">非关键设备</option>
            </select></div>
          <div class="form-group"><label>上一次验证/校准日期</label>
            <input type="date" id="dspLastValidDate" placeholder="确认设备在报废前是否处于受控状态"></div>
          <div class="form-group full"><label>涉及产品/品种</label>
            <textarea id="dspProducts" rows="2" placeholder="该设备用于生产过哪些药品/产品？影响批次范围评估（多行可换行）"></textarea></div>
        </div>
      </fieldset>

      <!-- ===== 分组三：报废原因与鉴定 ===== -->
      <fieldset style="border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:14px;">
        <legend style="font-weight:700;font-size:13.5px;color:var(--text);padding:0 8px;margin-left:12px;">📝 报废原因与鉴定</legend>
        <div class="form-grid">
          <div class="form-group"><label>报废原因分类<span class="req">*</span></label>
            <select id="dspReasonCat">
              <option value="">请选择</option>
              <option value="不可修复的故障">不可修复的故障</option>
              <option value="精度丧失无法恢复">精度丧失无法恢复</option>
              <option value="法规淘汰/不符合现行标准">法规淘汰 / 不符合现行标准</option>
              <option value="达到设计使用寿命">达到设计使用寿命</option>
              <option value="技术落后产能不足">技术落后 / 产能不足</option>
              <option value="环保要求不达标">环保要求不达标</option>
              <option value="安全事故损坏">安全事故损坏</option>
              <option value="其他">其他（请在下方补充说明）</option>
            </select></div>
          <div class="form-group"><label>鉴定人</label><input id="dspAppraiser" placeholder="签字确认，明确责任"></div>
          <div class="form-group"><label>鉴定日期<span class="req">*</span></label><input type="date" id="dspAppraisalDate" value="${today}"></div>
          <div class="form-group full"><label>技术鉴定结论</label>
            <textarea id="dspTechConclusion" rows="3" placeholder="设备部/工程部的专业评估，含关键指标数据（如转速、压力达不到工艺要求等）"></textarea>
            <span class="form-help">含关键指标数据及专业判断依据</span></div>
        </div>
      </fieldset>

      <!-- ===== 分组四：质量与合规影响 ===== -->
      <fieldset style="border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:14px;">
        <legend style="font-weight:700;font-size:13.5px;color:var(--text);padding:0 8px;margin-left:12px;">🛡️ 质量与合规影响</legend>
        <div class="form-grid">
          <div class="form-group"><label>质量评估结论</label>
            <select id="dspQualityConclusion">
              <option value="">请选择</option>
              <option value="无影响">无影响 — 不影响已生产产品质量</option>
              <option value="需追溯">需追溯 — 需对相关批次进行回顾性评估</option>
              <option value="有风险">有风险 — 可能影响已生产产品质量</option>
            </select></div>
          <div class="form-group"><label>变更控制编号</label><input id="dspChangeControlNo" placeholder="重大设备报废需启动变更控制流程"></div>
          <div class="form-group full"><label>涉及文件/记录</label>
            <textarea id="dspRelatedDocs" rows="2" placeholder="需同步撤销或修订的操作SOP、设备台账、验证文件清单等（多行可换行）"></textarea>
            <span class="form-help">列出需要同步处理的文件清单</span></div>
        </div>
      </fieldset>

      <!-- ===== 分组五：财务信息 ===== -->
      <fieldset style="border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:14px;">
        <legend style="font-weight:700;font-size:13.5px;color:var(--text);padding:0 8px;margin-left:12px;">💰 财务信息</legend>
        <div class="form-grid">
          <div class="form-group"><label>资产原值（元）</label><input id="dspAssetOriginal" type="number" placeholder="0.00" min="0" step="0.01"></div>
          <div class="form-group"><label>净值（元）</label><input id="dspAssetNet" type="number" placeholder="0.00" min="0" step="0.01"></div>
          <div class="form-group"><label>已提折旧（元）</label><input id="dspDepreciation" type="number" placeholder="0.00" min="0" step="0.01"></div>
          <div class="form-group"><label>处置方式<span class="req">*</span></label>
            <select id="dspDisposeMethod">
              <option value="">请选择</option>
              <option value="变卖">变卖</option>
              <option value="销毁">销毁</option>
              <option value="拆解留用">拆解留用</option>
              <option value="退回供应商">退回供应商</option>
              <option value="捐赠">捐赠</option>
              <option value="封存待处">封存待处理</option>
              <option value="其他">其他</option>
            </select></div>
        </div>
      </fieldset>

      <!-- ===== 审批附件 ===== -->
      <div style="background:#fafafa;border:1px dashed var(--border);border-radius:10px;padding:14px 16px;margin-bottom:14px;">
        <div style="font-weight:600;font-size:13px;color:var(--text);margin-bottom:8px;display:flex;align-items:center;gap:6px;"><span>📎</span> 审批附件</div>
        <input type="file" id="dspAttachment" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
               style="font-size:13px;display:block;width:100%;padding:6px 0;">
        <span class="form-help" style="margin-top:4px;">支持上传审批单扫描件、技术鉴定报告等，最大 10MB</span>
      </div>

      <!-- 进度区域 -->
      <div id="disposalProgress" style="display:none;padding:12px 16px;background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe;font-size:13px;">
        <div style="font-weight:600;margin-bottom:6px;">⏳ 处理进度</div>
        <div id="disposalSteps" style="line-height:1.8;"></div>
      </div>
      <div id="disposalResult" style="display:none;"></div>

    </div>`;

    EquipmentMaster._pendingDisposalEqId = eqId;
    showModal(`🗑️ 设备报废登记 — ${eq.name}`, body, [
      { text:'取消', cls:'btn-secondary', action: closeModal },
      { text:'确认报废', cls:'btn-primary', action: ()=>{ EquipmentMaster._executeDisposal(EquipmentMaster._pendingDisposalEqId); } }
    ], 'modal-xl');
  },

  _executeDisposal(eqId) {
    const eq = equipmentData.find(e => e.id === eqId);
    if (!eq) { toast('设备不存在'); return; }

    // 收集所有字段
    const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const applyNo     = v('dspApplyNo');
    const applyDate   = v('dspApplyDate');
    const applicant   = v('dspApplicant');
    const dept        = v('dspDept');
    const criticality = v('dspCriticality');
    const lastValidDt = v('dspLastValidDate');
    const products    = v('dspProducts');
    const reasonCat   = v('dspReasonCat');
    const appraiser   = v('dspAppraiser');
    const appraisalDt = v('dspAppraisalDate');
    const techConcl   = v('dspTechConclusion');
    const qualityConcl= v('dspQualityConclusion');
    const changeCtrlNo= v('dspChangeControlNo');
    const relatedDocs = v('dspRelatedDocs');
    const assetOrig   = v('dspAssetOriginal');
    const assetNet    = v('dspAssetNet');
    const depreciatn  = v('dspDepreciation');
    const disposeMtd  = v('dspDisposeMethod');

    const fileInput = document.getElementById('dspAttachment');
    const attachedFile = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0].name : null;

    // 校验必填项
    if (!applyNo)     { toast('请填写申请单号！'); return; }
    if (!applyDate)   { toast('请选择申请日期！'); return; }
    if (!applicant)   { toast('请填写申请人！'); return; }
    if (!reasonCat)   { toast('请选择报废原因分类！'); return; }
    if (!appraisalDt) { toast('请选择鉴定日期！'); return; }
    if (!disposeMtd)  { toast('请选择处置方式！'); return; }

    // 禁用按钮防重复提交
    document.querySelectorAll('.modal-backdrop:not(.hidden) .modal-footer button').forEach(b => {
      if (b.textContent.includes('确认')) b.disabled = true;
    });

    const progressEl = document.getElementById('disposalProgress');
    const stepsEl    = document.getElementById('disposalSteps');
    const resultEl   = document.getElementById('disposalResult');
    if (progressEl) progressEl.style.display = 'block';

    let html = '';

    setTimeout(() => {
      const oldLocName = eq.locationName, oldLocCode = eq.location;
      eq.location = ''; eq.locationName = '—（已拆除）';
      html += '<div style="color:var(--success);font-weight:500;">✅ Step 1/3 — 设备已从功能位置「' + esc(oldLocName) + '」拆除</div>';
      if (stepsEl) stepsEl.innerHTML = html;

      setTimeout(() => {
        eq.status = 'scrapped'; eq.statusName = '报废'; eq.syncStatus = 'pending';

        // 存储所有报废字段到设备对象
        Object.assign(eq, {
          disposalDate: applyDate,
          disposalReason: reasonCat,
          disposalApplyNo: applyNo,
          disposalApplicant: applicant,
          disposalDept: dept,
          disposalCriticality: criticality,
          disposalLastValidDate: lastValidDt,
          disposalProducts: products,
          disposalAppraiser: appraiser,
          disposalAppraisalDate: appraisalDt,
          disposalTechConclusion: techConcl,
          disposalQualityConclusion: qualityConcl,
          disposalChangeControlNo: changeCtrlNo,
          disposalRelatedDocs: relatedDocs,
          disposalAssetOriginal: assetOrig,
          disposalAssetNet: assetNet,
          disposalDepreciation: depreciatn,
          disposalMethod: disposeMtd,
          disposalAttachment: attachedFile
        });

        html += '<div style="color:var(--success);font-weight:500;">✅ Step 2/3 — 报废状态已标记，全部字段已保存至设备档案</div>';
        if (stepsEl) stepsEl.innerHTML = html;

        setTimeout(() => {
          if (resultEl) {
            resultEl.style.display = 'block';
            resultEl.innerHTML = `
            <div style="padding:16px;background:#f0fdf4;border-radius:10px;border:1px solid #86efac;">
              <div style="font-weight:700;color:#166534;font-size:15px;margin-bottom:12px;display:flex;align-items:center;gap:8px;">✅ 设备报废登记完成</div>
              <table style="width:100%;font-size:12.5px;line-height:2;">
                <tr><td style="color:var(--text-muted);white-space:nowrap;">设备</td><td><strong>${esc(eq.code)}</strong> — ${esc(eq.name)}</td></tr>
                <tr><td style="color:var(--text-muted);">申请单号</td><td>${esc(applyNo)}</td></tr>
                <tr><td style="color:var(--text-muted);">报废原因</td><td>${esc(reasonCat)}</td></tr>
                <tr><td style="color:var(--text-muted);">处置方式</td><td><strong>${esc(disposeMtd)}</strong></td></tr>
                <tr><td style="color:var(--text-muted);">鉴定人 / 日期</td><td>${esc(apraiser||'—')} / ${esc(appraisalDt)}</td></tr>
                ${assetOrig ? `<tr><td style="color:var(--text-muted);">资产原值 → 净值</td><td>¥${assetOrig} → ¥${assetNet||'0'} （折旧 ¥${depreciatn||'0'}）</td></tr>` : ''}
                ${attachedFile ? `<tr><td style="color:var(--text-muted);">附件</td><td>${esc(attachedFile)}</td></tr>` : ''}
              </table>
            </div>`;
          }

          const footer = document.querySelector('.modal-backdrop:not(.hidden) .modal-footer');
          if (footer) footer.innerHTML = '<button class="btn btn-primary" onclick="closeModal();EquipmentMaster.renderTable();">关闭</button>';

          // 日志记录
          if (!eqStatusLogs[eqId]) eqStatusLogs[eqId] = [];
          eqStatusLogs[eqId].push({
            time: new Date().toLocaleString('zh-CN'), status: '报废', operator: applicant,
            description: `设备报废登记完成 | 原因：${reasonCat} | 处置方式：${disposeMtd}${changeCtrlNo ? ' | 变更控制号：' + changeCtrlNo : ''}`
          });

          toast('设备报废登记完成！');
        }, 550);
      }, 550);
    }, 400);
  }
};

// ===== 轻量级 QR Code 生成器（纯JS实现，无外部依赖） =====
// 基于 QR Code 规范，支持 Byte 模式，使用 Reed-Solomon 纠错
function _qrgen(text, ecl) {
  ecl = ecl || 1; // 1=L(7%), 2=M(15%), 3=Q(25%), 4=H(30%)
  var _pad = [0xEC,0x11],_ec = ['111011111000100','111001001000100','111110011111000','111111110101000'],
    _al = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:',_gexp=[],_glog=[];
  for(var i=0;i<256;i++){_gexp[i]=i<8?1<<i:(_gexp[i-4]^_gexp[i-5]^_gexp[i-6]^_gexp[i-8])&255;_glog[_gexp[i]]=i;}
  function _rs(n,ec){var d=[];for(var i=0;i<n;i++)d.push(0);for(var i=0;i<n.length;i++){var e=d[0]^n[i];d.splice(0,1);d.push(0);for(var j=0;j<d.length;j++)d[j]^=_glog[e]<127?_gexp[(_glog[d[j]]+_glog[e])%255]:0;}return d;}
  var _mt=[[0,0,0,0,0],[1,0,0,0,0],[1,1,0,0,0],[1,1,1,0,0],[1,1,1,1,0]],
    _ft=[[[6,18],[6,22],[6,26],[6,30]],[[6,16,18],[6,22,26],[6,24,28],[6,26,30]],
          [[6,19,22],[6,18,26],[6,20,28],[6,24,32]],[[6,16,22,26],[6,22,26,30],[6,24,28,32],[6,26,28,34]]];
  function _getLenBits(ver,mode){return mode===1?ver<10?9:11:mode===2?ver<10?10:12:mode===4?ver<10?8:16:mode===8?8:0;}
  function _enc(mode,data){if(mode===1){var r='';data.split('').forEach(function(c){r+=('00000'+_al.indexOf(c).toString(2)).slice(-_al.indexOf(c)<10?4:5)});return r}
    if(mode===8){var r='';for(var i=0;i<data.length;i++)r+=('00000000'+data.charCodeAt(i).toString(2)).slice(-8);return r}return''}
  function _findVersion(ecl,text){
    for(var v=1;v<=40;v++){
      if(v<=9){var c=[17,32,53,78,106,134,154,192,230][v-1]}else if(v<=26){c=[276,322,370,428,461,523,583,644,718,792,858,929][v-10]}
      else{c=[1003,1091,1171,1273,1367,1465,1528,1628,1732,1840,1952,2068,2188,2303,2431,2563][v-27]}
      var lbits=_getLenBits(v,8),ml=text.length;
      if((lbits+ml*8+4)<=c*8-ecl*8-(_ft[v>26?3:v>9?2:0||0][ecl-1].reduce(function(a,b){return a+b},0))*8)return v}return 40}
  function _makeData(ver,ecl,text){
    var dlen=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3368,3537][ver],
      eccl=[0,[7,10,13,17],[10,16,22,28],[15,26,36,44],[20,36,52,68]][ecl],rblocks=[0,[1,1,1,1],[1,1,1,1],[1,1,2,2],[1,2,2,4]][ecl];
    var blocks=[],totalEcc=0;
    (function(){var n=rblocks[ecl],dl=dlen-ver;if(ver>=2&&ecl>0){if(ver<7){var gs=[0,0,1,1][ecl]}else if(ver<14){gs=[0,0,2,4][ecl]}else if(ver<21){gs=[0,0,2,4][ecl]}else if(ver<27){gs=[0,0,3,6][ecl]}else{gs=[0,0,3,7][ecl]}
      var bl=Math.floor((dl-gs*(n-1))/n),rem=dl-bl*n-gs*(n-1);
      for(var i=0;i<n;i++)blocks.push(bl+gs+(i<n-rem?0:1))}else{blocks.push(dl)}})();
    var dataStr='',padded;dataStr+=('0100')+('000'+text.length.toString(2)).slice(-_getLenBits(ver,8));
    dataStr+=_enc(8,text);while(dataStr.length%8)dataStr+='0';
    padded=dataStr;while(padded.length<dlen*8-padded.length/8)padded+=String.fromCharCode(parseInt(_pad.join('').substr((padded.length/8)%_pad.length,2),16)).charCodeAt(0).toString(2)?'':'';
    while(padded.length<dlen*8)padded+='00001111';while(padded.length>dlen*8)padded=padded.substr(0,padded.length-8);
    var dataWords=[];for(var i=0;i<padded.length;i+=8)dataWords.push(parseInt(padded.substr(i,8),2));
    var blockData=[],pos=0;blocks.forEach(function(bl){blockData.push(dataWords.slice(pos,pos+bl));pos+=bl});
    var eccBlocks=blockData.map(function(d,i){return _rs(d.concat(new Array(eccl[ecl]).fill(0)),eccl[ecl])});
    var result=[],maxL=Math.max.apply(null,blocks);
    for(var i=0;i<maxL;i++)blockData.forEach(function(b,d){if(i<b.length)result.push(b[i])});
    for(var i=0;i<eccl[ecl];i++)eccBlocks.forEach(function(b){result.push(b[i])});return result}
  function _placeFinder(m,r,c){for(var dr=-1;dr<=1;dr++)for(var dc=-1;dc<=1;dc++)
    if(!(dr===0&&dc===0))m[r+dr][c+dc]=1;m[r][c]=1;
    for(var i=-2;i<=2;i++){m[r][c+i]=m[r+i][c]=1;if(Math.abs(i)<2)m[r-2][c+i]=m[r+2][c+i]=m[r+i][c-2]=m[r+i][c+2]=1}}
  function _placeAlign(m,v){var p=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,32,54],[6,28,58],[6,26,62],[6,26,66],[6,30,70],[6,28,74],[6,32,78],[6,28,82],[6,28,86],[6,30,90],[6,28,94],[6,28,98],[6,30,102],[6,28,106],[6,30,110],[6,28,114],[6,28,118],[6,28,122],[6,26,124,128],[6,30,132,136],[6,28,140,144]][v];
    if(!p[v])return;p[v].forEach(function(pos){if(pos===6)return;for(var r=pos-2;r<=pos+2;r++)for(var c=pos-2;c<=pos+2;c++)m[r][c]=!(Math.abs(r-pos)<=1&&Math.abs(c-pos)<=1)})}
  function _placeTiming(m,s){for(var i=8;i<s-8;i++){m[6][i]=m[i][6]=i%2==0}}
  function _reserve(m,v){for(var i=0;i<8;i++){m[8][i]=m[i][8]=(i%2==0);m[8][s-1-i]=m[s-1-i][8]=(i%2==0)}
    m[8][8]=false;m[8][6]=m[6][8]=m[s-8][8]=m[8][s-8]=true;if(v>=7){m[s-11][8]=m[8][s-11]=m[s-10][8]=m[8][s-10]=m[s-9][8]=m[8][s-9]=m[s-8][8]=m[8][s-8]=m[s-7][8]=m[8][s-7]=m[s-6][8]=m[8][s-6]=m[s-5][8]=m[8][s-5]=m[s-4][8]=m[8][s-4]=m[s-3][8]=m[8][s-3]=!((s-11)%2==0)}}
  function _mask(m,s,f){var r,c;for(r=1;r<s-1;r++)for(c=1;c<s-1;c++){
    if(m[r][c]===undefined)switch(f){case 0:m[r][c]=(r+c)%2;break;case 1:m[r][c]=r%2;break;case 2:m[r][c]=c%3;break;case 3:m[r][c]=(r+c)%3;break;case 4:m[r][c]=(Math.floor(r/2)+Math.floor(c/3))%2;break;case 5:m[r][c]=(r*c)%2+(r*c)%3;break;case 6:m[r][c]=((r*c)%2+(r*c)%3)%2;break;default:m[r][c]=((r+c)%3+(r*c)%2)%2}}}
  function _fmt(f,ecl){var bits=(ecl<<3|f)<<10;for(var k=0;k<10;k++)bits=(bits<<1)^(bits&0x400?0x537:0);return(((ecl<<3|f)<<10)|bits)^0x5412}
  var ver=_findVersion(ecl,text),size=ver*4+17+((ver>1?1:0)*0),matrix=[];
  for(var i=0;i<size;i++)matrix.push(new Array(size).fill(undefined));
  _placeFinder(matrix,0,0);_placeFinder(matrix,size-7,0);_placeFinder(matrix,0,size-7);_placeAlign(matrix,ver);_placeTiming(matrix,size);_reserve(matrix,ver);
  var data=_makeData(ver,ecl,text),di=0,up=true,col=size-1,row=size-1;
  while(col>0){if(col===6)col--;for(var i=0;i<size;i++){for(var j=0;j<2;j++){if(matrix[row][col-j]===undefined){matrix[row][col-j]=data[di++]}}}
    row+=(up?-1:1);if(row<0||row>=size){row-=up?-1:1;col-=2;up=!up}}var minPenalty=Infinity,bestMask=0,bestMatrix;
  for(var msk=0;msk<8;msk++){var cp=matrix.map(function(r){return r.slice()});_mask(cp,size,msk);
    var penalty=0;for(var r=0;r<size;r++){var cnt=0;for(var c=0;c<size;c++){if(cp[r][c]){cnt++;penalty=cnt>=5?penalty+3+(cnt-5):penalty}else cnt=0}}
    for(var c=0;c<size;c++){var cnt=0;for(var r=0;r<size;r++){if(cp[r][c]){cnt++;penalty=cnt>=5?penalty+3+(cnt-5):penalty}else cnt=0}}
    for(var r=0;r<size-1;r++)for(var c=0;c<size-1;c++)if(cp[r][c]===cp[r][c+1]&&cp[r][c]===cp[r+1][c]&&cp[r][c]===cp[r+1][c+1])penalty+=3;
    var dark=0;for(var r=0;r<size;r++)for(var c=0;c<size;c++)dark+=cp[r][c]?1:0;penalty+=Math.abs(Math.round(dark/(size*size)/10*10)-5)*10;
    if(penalty<minPenalty){minPenalty=penalty;bestMask=msk;bestMatrix=cp}}
  var fmtInfo=_fmt(bestMask,ecl);for(var i=0;i<15;i++){var bit=(fmtInfo>>i)&1;
    if(i<8){if(bit)bestMatrix[Math.floor(i/3)][i%3+8]=1;else bestMatrix[Math.floor(i/3)][i%3+8]=0}else{if(bit)bestMatrix[size-1-(i-8)%8][Math.floor((i-8)/3)]=1;else bestMatrix[size-1-(i-8)%8][Math.floor((i-8)/3)]=0}}
  var paths='';for(var r=0;r<size;r++)for(var c=0;c<size;c++)if(bestMatrix[r][c])paths+='M'+c+' '+r+'h1v1h-1z ';
  return {moduleCount:size,paths:paths};
}

// ===== Functional Location Page =====
const FunctionalLocation = {
  selectedNode: null,
  expandedNodes: new Set(),
  treeData: flMockData.tree,
  searchTerm: '',
  searchResults: null,
  searchFilters: { factory: '', code: '', level: '' },
  levelOptions: [
    { value:'1', label:'1 - 工厂' },
    { value:'2', label:'2 - 车间' },
    { value:'3', label:'3 - 产线' },
    { value:'4', label:'4 - 工位' }
  ],

  _isAdmin() {
    return (window.currentUserRole || 'admin') === 'admin';
  },

  render() {
    const createBtn = this._isAdmin()
      ? '<button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3);" onclick="FunctionalLocation.createModal()">+ 创建功能位置</button>'
      : '';
    return `
      <div class="two-panel">
        <div class="left-panel">
          <div class="left-panel-header">
            <div class="left-panel-title">功能位置结构</div>
          </div>
          <div class="left-panel-body" id="flTreeContainer">
            ${this.renderTree()}
          </div>
        </div>
        <div class="right-panel">
          <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
            <div><div style="font-size:16px;font-weight:700;">功能位置管理</div><div style="font-size:12px;opacity:0.8;">位置层级结构管理</div></div>
            ${createBtn}
          </div>
          <div class="filter-bar" style="flex-shrink:0;">
            <div class="filter-group"><label>所属工厂</label><select id="flFilterFactory">
              <option value="">全部</option>
              ${this._renderFactoryOptions()}
            </select></div>
            <div class="filter-group"><label>功能位置编码</label><input type="text" id="flFilterCode" placeholder="模糊查询"></div>
            <div class="filter-group"><label>层级</label><select id="flFilterLevel">
              <option value="">全部</option>
              ${this.levelOptions.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
            </select></div>
            <div class="filter-actions">
              <button class="btn btn-primary btn-sm" onclick="FunctionalLocation.search()">查询</button>
              <button class="btn btn-secondary btn-sm" onclick="FunctionalLocation.reset()">重置</button>
            </div>
          </div>
          <div style="flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-muted);" id="flPlaceholder">
            <div style="text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;color:#cbd5e1;">&#9776;</div>
              <div style="font-size:15px;">请从左侧选择一个功能位置查看其下层级</div>
            </div>
          </div>
          <div id="flTablePanel" style="flex:1;overflow:hidden;display:none;"></div>
        </div>
      </div>`;
  },

  init() {
    this.searchFilters = { factory: '', code: '', level: '' };
    this.expandedNodes = new Set();
    this.treeData.forEach(n => {
      if (n.children && n.children.length > 0) this.expandedNodes.add(n.id);
    });
    this.renderTree();
    // 默认加载第一个根节点（工厂），展示所有功能位置
    if (this.treeData.length > 0) {
      this.selectedNode = this.treeData[0];
      this.renderTree();
      this.showTable(this.treeData[0]);
    }
  },

  _renderFactoryOptions() {
    return this.treeData.map(n => `<option value="${esc(n.code)}">${esc(n.name)}</option>`).join('');
  },

  search() {
    const factoryEl = document.getElementById('flFilterFactory');
    const codeEl = document.getElementById('flFilterCode');
    const levelEl = document.getElementById('flFilterLevel');
    const factory = factoryEl ? factoryEl.value : '';
    const code = codeEl ? codeEl.value.trim() : '';
    const level = levelEl ? levelEl.value : '';

    this.searchFilters = { factory, code, level };
    this.searchTerm = [factory, code, level].filter(Boolean).join('|');

    if (!factory && !code && !level) {
      this.searchResults = null;
      this.searchTerm = '';
      if (this.selectedNode) { this.showTable(this.selectedNode); }
      this.renderTree();
      return;
    }

    const results = [];
    const walk = (nodes, path) => {
      nodes.forEach(n => {
        let match = true;
        if (factory) match = match && (n.code === factory || n.code.startsWith(factory + '-'));
        if (code) match = match && n.code.toUpperCase().includes(code.toUpperCase());
        if (level) match = match && String(n.level) === level;
        if (match) results.push({ node: n, path: [...path, n.id] });
        if (n.children) walk(n.children, [...path, n.id]);
      });
    };
    walk(this.treeData, []);
    this.searchResults = results;
    if (results.length > 0) {
      results.forEach(r => { r.path.forEach(id => this.expandedNodes.add(id)); });
      this.selectedNode = results[0].node;
      this.showTable(results[0].node);
    } else {
      this.selectedNode = null;
      const placeholder = document.getElementById('flPlaceholder');
      const panel = document.getElementById('flTablePanel');
      if (placeholder) placeholder.style.display = 'flex';
      if (panel) panel.style.display = 'none';
    }
    this.renderTree();
  },

  reset() {
    const factoryEl = document.getElementById('flFilterFactory');
    const codeEl = document.getElementById('flFilterCode');
    const levelEl = document.getElementById('flFilterLevel');
    if (factoryEl) factoryEl.value = '';
    if (codeEl) codeEl.value = '';
    if (levelEl) levelEl.value = '';
    this.searchFilters = { factory: '', code: '', level: '' };
    this.searchTerm = '';
    this.searchResults = null;
    if (this.selectedNode) { this.showTable(this.selectedNode); }
    this.renderTree();
  },

  renderTree() {
    const container = document.getElementById('flTreeContainer');
    if (!container) return '';
    let html = '';
    if (this.searchTerm && this.searchResults && this.searchResults.length === 0) {
      html = '<div style="text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">未找到匹配的功能位置</div>';
    } else {
      this.treeData.forEach((n, i) => html += this.renderTreeNode(n, 0, i === this.treeData.length - 1));
    }
    container.innerHTML = html;
  },

  highlightText(text) {
    if (!this.searchTerm) return esc(text);
    const escaped = esc(text);
    const term = esc(this.searchTerm);
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escaped.replace(regex, '<mark style="background:#fde68a;color:#92400e;padding:0 1px;border-radius:2px;">$1</mark>');
  },

  renderTreeNode(node, depth, isLast) {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = this.expandedNodes.has(node.id);
    const isSelected = this.selectedNode && this.selectedNode.id === node.id;
    const typeLabel = { plant:'厂区', workshop:'车间', production_line:'产线', workstation:'工位', auxiliary:'辅助区' };
    const eqCount = node.equipmentCount != null && node.equipmentCount > 0 ? ` <span style="font-size:11px;color:#94a3b8;">(${node.equipmentCount})</span>` : '';

    let prefix = '';
    if (depth > 0) {
      prefix = `<span style="display:inline-block;width:${depth*20}px;position:relative;">`;
      for (let i = 0; i < depth; i++) {
        prefix += `<span style="position:absolute;left:${i*20+9}px;top:0;bottom:0;width:0;border-left:1px solid #e2e8f0;"></span>`;
      }
      prefix += `</span>`;
    }

    const toggleArrow = hasChildren
      ? `<span class="tree-toggle" onclick="FunctionalLocation.toggleNode(event,'${node.id}')" style="cursor:pointer;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;color:#94a3b8;flex-shrink:0;border-radius:3px;background:#f1f5f9;">${isExpanded ? '&#9660;' : '&#9654;'}</span>`
      : `<span style="width:18px;flex-shrink:0;"></span>`;

    const statusColor = node.status === 'active' ? '#22c55e' : node.status === 'disabled' ? '#eab308' : '#ef4444';

    let html = `<div class="tree-row ${isSelected?'tree-row-active':''}" onclick="FunctionalLocation.selectNode('${node.id}')" style="display:flex;align-items:center;gap:4px;padding:6px 8px 6px 4px;cursor:pointer;border-radius:4px;margin:1px 0;transition:background .15s;font-size:13px;">
      ${prefix}
      ${toggleArrow}
      <span style="width:6px;height:6px;border-radius:50%;background:${statusColor};flex-shrink:0;margin:0 4px;"></span>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${this.highlightText(node.name)}</span>
      <span style="font-size:10px;color:#94a3b8;flex-shrink:0;">${typeLabel[node.type]||node.type}</span>
      ${eqCount}
    </div>`;

    if (hasChildren && isExpanded) {
      node.children.forEach((child, i) => {
        html += this.renderTreeNode(child, depth + 1, i === node.children.length - 1);
      });
    }
    return html;
  },

  toggleNode(e, nodeId) {
    e.stopPropagation();
    if (this.expandedNodes.has(nodeId)) {
      this.expandedNodes.delete(nodeId);
    } else {
      this.expandedNodes.add(nodeId);
    }
    this.renderTree();
  },

  selectNode(nodeId) {
    const found = this.findNode(this.treeData, nodeId);
    if (found) {
      this.selectedNode = found;
      this.renderTree();
      this.showTable(found);
    }
  },

  findNode(nodes, id) {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) {
        const found = this.findNode(n.children, id);
        if (found) return found;
      }
    }
    return null;
  },

  _getAllDescendants(node) {
    const result = [];
    const walk = (children) => {
      if (!children || !children.length) return;
      children.forEach(c => {
        result.push(c);
        walk(c.children);
      });
    };
    walk(node.children);
    result.sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return (a.code || '').localeCompare(b.code || '');
    });
    return result;
  },

  showTable(node) {
    const descendants = this._getAllDescendants(node);
    const typeLabel = { plant:'厂区', workshop:'车间', production_line:'产线', workstation:'工位', auxiliary:'辅助区' };
    const categoryMap = { production:'生产类', building:'建筑类', technical:'技术类' };

    const tableHtml = descendants.length ? `
      <div class="table-wrapper" style="flex:1;overflow:auto;">
        <table class="data-table">
          <thead><tr>
            <th>功能位置编码</th>
            <th>名称</th>
            <th>层级</th>
            <th>状态</th>
            <th>类别</th>
            <th>操作</th>
          </tr></thead>
          <tbody>
            ${descendants.map(d => `
              <tr>
                <td><span style="font-family:monospace;font-size:12px;">${esc(d.code)}</span></td>
                <td>${esc(d.name)}</td>
                <td>${d.level || '-'} - ${typeLabel[d.type]||d.type||'-'}</td>
                <td>${getFLStatusBadge(d.status)}</td>
                <td>${categoryMap[d.category]||d.category||'-'}</td>
                <td><button class="btn btn-blue btn-sm" onclick="FunctionalLocation.viewDetail('${d.id}')">查看</button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>` : `<div style="text-align:center;padding:60px 20px;color:var(--text-muted);"><div style="font-size:40px;margin-bottom:10px;">&#128203;</div><div>该层级下暂无功能位置</div></div>`;

    const headerHtml = `
      <div style="padding:14px 20px;background:white;border-bottom:1px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <span style="font-size:15px;font-weight:700;">${esc(node.name)}</span>
          <span style="font-size:12px;color:var(--text-secondary);margin-left:8px;">${esc(node.code)}</span>
        </div>
        <span style="font-size:12px;color:var(--text-muted);">共 <strong>${descendants.length}</strong> 个下级功能位置</span>
      </div>`;

    const panel = document.getElementById('flTablePanel');
    const placeholder = document.getElementById('flPlaceholder');
    if (panel) {
      panel.innerHTML = headerHtml + tableHtml;
      panel.style.display = 'flex';
      panel.style.flexDirection = 'column';
    }
    if (placeholder) placeholder.style.display = 'none';
  },

  viewDetail(nodeId) {
    const node = this.findNode(this.treeData, nodeId);
    if (!node) return;

    const categoryMap = { production:'生产类', building:'建筑类', technical:'技术类' };
    const plannerMap = { mechanical:'机械组', electrical:'电气组', instrument:'仪表组', general:'综合组' };
    const levelLabel = (lvl) => { const o = this.levelOptions.find(l => l.value === String(lvl)); return o ? o.label : lvl; };
    const parentName = this._getParentName(node);
    const validPeriod = (node.validFrom || node.validTo)
      ? `${esc(node.validFrom||'-')} ~ ${esc(node.validTo||'-')}`
      : '-';

    const docHtml = node.document && node.document !== '-'
      ? `<div style="display:flex;flex-wrap:wrap;gap:6px;">${node.document.split(';').filter(Boolean).map(f =>
        `<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;font-size:12px;color:#1d4ed8;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
          ${esc(f.trim())}
        </span>`).join('')}</div>`
      : '<span style="color:var(--text-muted);">暂无附件</span>';

    const isAdmin = this._isAdmin();
    const footerBtns = isAdmin
      ? [
          { text:'关闭',cls:'btn-secondary',action:closeModal },
          { text:'编辑',cls:'btn-primary',action:`()=>{ closeModal(); FunctionalLocation.editModal('${node.id}'); }` }
        ]
      : [{ text:'关闭',cls:'btn-secondary',action:closeModal }];

    showModal('功能位置详情', `
      <div style="padding:28px 32px 20px;background:white;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border);">
          <div>
            <div style="font-size:20px;font-weight:700;color:var(--text-primary);">${esc(node.name)}</div>
            <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">编码：${esc(node.code)}</div>
          </div>
          <span style="font-size:13px;color:var(--text-muted);background:#f1f5f9;padding:6px 14px;border-radius:8px;">${getFLTypeText(node.type)}</span>
        </div>
        <div class="detail-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:18px 28px;">
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">功能位置编码</dt><dd style="font-size:15px;font-weight:600;color:var(--text-primary);font-family:monospace;">${esc(node.code)}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">有效期</dt><dd style="font-size:14px;color:var(--text-primary);">${validPeriod}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;grid-column:span 2;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">功能位置描述</dt><dd style="font-size:14px;color:var(--text-primary);line-height:1.6;">${esc(node.description||'-')}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">功能位置类别</dt><dd style="font-size:14px;color:var(--text-primary);">${categoryMap[node.category]||node.category||'-'}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">层级</dt><dd style="font-size:14px;color:var(--text-primary);">${levelLabel(node.level)}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">功能位置状态</dt><dd style="font-size:14px;">${getFLStatusBadge(node.status)}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">工厂</dt><dd style="font-size:14px;color:var(--text-primary);">${esc(node.factory||'-')}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">成本中心</dt><dd style="font-size:14px;color:var(--text-primary);">${esc(node.costCenter||'-')}<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">用于维修费归集，且专属别墅</div></dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">计划员组</dt><dd style="font-size:14px;color:var(--text-primary);">${plannerMap[node.plannerGroup]||node.plannerGroup||'-'}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">上级功能位置</dt><dd style="font-size:14px;color:var(--text-primary);">${parentName}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">安装允许</dt><dd style="font-size:14px;">${node.allowInstall ? '<span class="badge badge-green">是</span> — 允许安装特种设备' : '<span class="badge badge-gray">否</span> — 不允许安装特种设备'}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;grid-column:span 2;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">地址</dt><dd style="font-size:14px;color:var(--text-primary);line-height:1.6;">${esc(node.address||'-')}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;grid-column:span 2;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">文档</dt><dd>${docHtml}</dd></div>
        </div>
      </div>`, footerBtns, 'modal-lg');
  },

  _getParentName(node) {
    if (!node.parentId) return '无（顶级位置）';
    const parent = this.findNode(this.treeData, node.parentId);
    return parent ? `${parent.name} (${parent.code})` : node.parentId;
  },

  createModal() {
    if (!this._isAdmin()) { toast('无操作权限，仅管理员可创建功能位置'); return; }
    const factoryOpts = this.treeData.map(n => `<option value="${esc(n.code)}">${esc(n.name)}</option>`).join('');
    const parentVal = this.selectedNode ? this.selectedNode.id : '';
    showModal('创建功能位置', `
      <div class="form-grid" style="padding:8px 0;">
        <div class="form-group"><label>功能位置编码<span class="req">*</span></label><input id="flFormCode" placeholder="如 FL1000-W01-L01"></div>
        <div class="form-group"><label>层级<span class="req">*</span></label>
          <select id="flFormLevel"><option value="">请选择层级</option>${this.levelOptions.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>有效期</label><input id="flFormValidFrom" type="date"> ~ <input id="flFormValidTo" type="date" style="margin-top:4px;"></div>
        <div class="form-group" style="grid-column:span 2;"><label>功能位置描述</label><textarea id="flFormDesc" rows="2" placeholder="功能位置详细描述"></textarea></div>
        <div class="form-group"><label>功能位置类别<span class="req">*</span></label>
          <select id="flFormCategory"><option value="">请选择</option><option value="production">生产类</option><option value="building">建筑类</option><option value="technical">技术类</option></select>
        </div>
        <div class="form-group"><label>功能位置状态</label>
          <select id="flFormStatus"><option value="active">正常启用</option><option value="disabled">临时停用</option><option value="invalid">永久作废</option></select>
        </div>
        <div class="form-group"><label>工厂<span class="req">*</span></label>
          <select id="flFormFactory"><option value="">请选择工厂</option>${factoryOpts}</select>
        </div>
        <div class="form-group"><label>成本中心</label><input id="flFormCostCenter" placeholder="如 CC-1000-W01"><div style="font-size:11px;color:var(--text-muted);">用于维修费归集，且专属别墅</div></div>
        <div class="form-group"><label>计划员组</label>
          <select id="flFormPlanner"><option value="">请选择</option><option value="mechanical">机械组</option><option value="electrical">电气组</option><option value="instrument">仪表组</option><option value="general">综合组</option></select>
        </div>
        <div class="form-group"><label>上级功能位置</label>
          <select id="flFormParent"><option value="">无（顶级位置）</option>${this._renderFlatOptions()}</select>
        </div>
        <div class="form-group"><label>安装允许</label>
          <select id="flFormAllowInstall"><option value="1">是 — 允许安装特种设备</option><option value="0">否 — 不允许安装特种设备</option></select>
        </div>
        <div class="form-group" style="grid-column:span 2;"><label>地址</label><input id="flFormAddress" placeholder="车间具体地址"></div>
        <div class="form-group" style="grid-column:span 2;">
          <label>文档附件</label>
          <div style="border:2px dashed #d1d5db;border-radius:10px;padding:20px;text-align:center;background:#fafbfc;cursor:pointer;" onclick="document.getElementById('flFormDocFile').click();">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="display:block;margin:0 auto 8px;"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <div style="font-size:13px;color:#64748b;">点击或拖拽文件到此处上传</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:4px;">支持 PDF、Word、DWG 等格式，单个文件不超过 50MB</div>
            <input id="flFormDocFile" type="file" multiple accept=".pdf,.doc,.docx,.dwg,.xlsx,.xls" onchange="FunctionalLocation._onFileSelect(this,'flFormDocList')" style="display:none;">
            <div id="flFormDocList" style="margin-top:10px;display:none;"></div>
          </div>
        </div>
      </div>`, [
        { text:'取消',cls:'btn-secondary',action:closeModal },
        { text:'保存',cls:'btn-primary',action:()=>{ toast('功能位置已创建！'); closeModal(); } }
      ], 'modal-lg');
    if (parentVal) {
      setTimeout(() => { const sel = document.getElementById('flFormParent'); if (sel) sel.value = parentVal; }, 50);
    }
  },

  _onFileSelect(input, listId) {
    const files = input.files;
    const container = document.getElementById(listId);
    if (!container) return;
    if (files && files.length > 0) {
      let html = '<div style="display:flex;flex-direction:column;gap:4px;margin-top:8px;">';
      for (let i = 0; i < files.length; i++) {
        html += `<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:white;border:1px solid #e2e8f0;border-radius:6px;font-size:12px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
          <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(files[i].name)}</span>
          <span style="color:var(--text-muted);">${(files[i].size/1024/1024).toFixed(1)}MB</span>
        </div>`;
      }
      html += '</div>';
      container.innerHTML = html;
      container.style.display = 'block';
    } else {
      container.innerHTML = '';
      container.style.display = 'none';
    }
  },

  _renderFlatOptions() {
    const opts = [];
    const walk = (nodes, depth) => {
      nodes.forEach(n => {
        const prefix = '\u00A0\u00A0'.repeat(depth);
        opts.push(`<option value="${esc(n.id)}">${prefix}${esc(n.name)} (${esc(n.code)})</option>`);
        if (n.children && n.children.length) walk(n.children, depth + 1);
      });
    };
    walk(this.treeData, 0);
    return opts.join('');
  },

  editModal(nodeId) {
    if (!this._isAdmin()) { toast('无操作权限，仅管理员可编辑'); return; }
    const node = this.findNode(this.treeData, nodeId);
    if (!node) return;

    const parentName = this._getParentName(node);
    const catSel = v => `value="${esc(v)}"${node.category===v?' selected':''}`;
    const stsSel = v => `value="${esc(v)}"${node.status===v?' selected':''}`;
    const plnSel = v => `value="${esc(v)}"${node.plannerGroup===v?' selected':''}`;
    const aiSel = v => `value="${esc(v)}"${node.allowInstall===(v==='1')?' selected':''}`;
    const lvlSel = v => `value="${esc(v)}"${String(node.level)===v?' selected':''}`;

    showModal('编辑功能位置', `
      <div class="form-grid" style="padding:8px 0;">
        <div class="form-group"><label>功能位置编码<span class="req">*</span></label><input value="${esc(node.code)}" readonly style="background:#f9fafb;"></div>
        <div class="form-group"><label>层级<span class="req">*</span></label>
          <select id="flEditLevel">${this.levelOptions.map(o => `<option ${lvlSel(o.value)}>${o.label}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>有效期</label><input id="flEditValidFrom" type="date" value="${esc(node.validFrom||'')}"> ~ <input id="flEditValidTo" type="date" value="${esc(node.validTo||'')}" style="margin-top:4px;"></div>
        <div class="form-group" style="grid-column:span 2;"><label>功能位置描述</label><textarea id="flEditDesc" rows="2">${esc(node.description||'')}</textarea></div>
        <div class="form-group"><label>功能位置类别<span class="req">*</span></label>
          <select id="flEditCategory"><option ${catSel('production')}>生产类</option><option ${catSel('building')}>建筑类</option><option ${catSel('technical')}>技术类</option></select>
        </div>
        <div class="form-group"><label>功能位置状态</label>
          <select id="flEditStatus"><option ${stsSel('active')}>正常启用</option><option ${stsSel('disabled')}>临时停用</option><option ${stsSel('invalid')}>永久作废</option></select>
        </div>
        <div class="form-group"><label>工厂</label><input value="${esc(node.factory||'')}" readonly style="background:#f9fafb;"></div>
        <div class="form-group"><label>成本中心</label><input id="flEditCostCenter" value="${esc(node.costCenter||'')}"><div style="font-size:11px;color:var(--text-muted);">用于维修费归集，且专属别墅</div></div>
        <div class="form-group"><label>计划员组</label>
          <select id="flEditPlanner"><option ${plnSel('mechanical')}>机械组</option><option ${plnSel('electrical')}>电气组</option><option ${plnSel('instrument')}>仪表组</option><option ${plnSel('general')}>综合组</option></select>
        </div>
        <div class="form-group"><label>上级功能位置</label><input value="${parentName}" readonly style="background:#f9fafb;"></div>
        <div class="form-group"><label>安装允许</label>
          <select id="flEditAllowInstall"><option ${aiSel('1')}>是 — 允许安装特种设备</option><option ${aiSel('0')}>否 — 不允许安装特种设备</option></select>
        </div>
        <div class="form-group" style="grid-column:span 2;"><label>地址</label><input id="flEditAddress" value="${esc(node.address||'')}"></div>
        <div class="form-group" style="grid-column:span 2;">
          <label>文档附件</label>
          <div style="border:2px dashed #d1d5db;border-radius:10px;padding:20px;text-align:center;background:#fafbfc;cursor:pointer;" onclick="document.getElementById('flEditDocFile').click();">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="display:block;margin:0 auto 8px;"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <div style="font-size:13px;color:#64748b;">点击或拖拽文件到此处上传</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:4px;">支持 PDF、Word、DWG 等格式，单个文件不超过 50MB</div>
            <input id="flEditDocFile" type="file" multiple accept=".pdf,.doc,.docx,.dwg,.xlsx,.xls" onchange="FunctionalLocation._onFileSelect(this,'flEditDocList')" style="display:none;">
            <div id="flEditDocList">
              ${node.document && node.document !== '-' ? `<div style="margin-top:10px;"><div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;">已有文件：</div>` + node.document.split(';').filter(Boolean).map(f => `
                <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:white;border:1px solid #e2e8f0;border-radius:6px;font-size:12px;margin-bottom:4px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
                  <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(f.trim())}</span>
                </div>`).join('') + '</div>' : ''}
            </div>
          </div>
        </div>
      </div>`, [
        { text:'取消',cls:'btn-secondary',action:closeModal },
        { text:'保存',cls:'btn-primary',action:()=>{ toast('更新成功！'); closeModal(); if(FunctionalLocation.selectedNode){ FunctionalLocation.showTable(FunctionalLocation.selectedNode); } } }
      ]);
  }
};

// ===== Work Center Page =====
const WorkCenter = {
  selectedNode: null,
  expandedNodes: new Set(),
  orgTree: wcOrgTree,
  searchTerm: '',
  searchResults: null,
  searchFilters: { factory: '', code: '', name: '' },

  _isAdmin() {
    return (window.currentUserRole || 'admin') === 'admin';
  },

  render() {
    const createBtn = this._isAdmin()
      ? '<button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3);" onclick="WorkCenter.addModal()">+ 新增工作中心</button>'
      : '';
    return `
      <div class="two-panel">
        <div class="left-panel">
          <div class="left-panel-header">
            <div class="left-panel-title">组织架构</div>
          </div>
          <div class="left-panel-body" id="wcTreeContainer">
            ${this.renderOrgTree()}
          </div>
        </div>
        <div class="right-panel">
          <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
            <div><div style="font-size:16px;font-weight:700;">工作中心管理</div><div style="font-size:12px;opacity:0.8;">维修组织架构与能力管理</div></div>
            ${createBtn}
          </div>
          <div class="filter-bar" style="flex-shrink:0;">
            <div class="filter-group"><label>所属工厂</label><select id="wcFilterFactory">
              <option value="">全部</option>
              ${this._renderFactoryOptions()}
            </select></div>
            <div class="filter-group"><label>工作中心编码</label><input type="text" id="wcFilterCode" placeholder="模糊查询"></div>
            <div class="filter-group"><label>工作中心名称</label><input type="text" id="wcFilterName" placeholder="模糊查询"></div>
            <div class="filter-actions">
              <button class="btn btn-primary btn-sm" onclick="WorkCenter.search()">查询</button>
              <button class="btn btn-secondary btn-sm" onclick="WorkCenter.reset()">重置</button>
            </div>
          </div>
          <div style="flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-muted);" id="wcPlaceholder">
            <div style="text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;color:#cbd5e1;">&#9776;</div>
              <div style="font-size:15px;">请从左侧选择一个工厂或车间查看工作中心</div>
            </div>
          </div>
          <div id="wcTablePanel" style="flex:1;overflow:hidden;display:none;"></div>
        </div>
      </div>`;
  },

  init() {
    this.searchFilters = { factory: '', code: '', name: '' };
    this.expandedNodes = new Set();
    this.orgTree.forEach(n => this.expandedNodes.add(n.id));
    this.renderOrgTree();
    // 默认加载第一个根节点（工厂），展示所有工作中心
    if (this.orgTree.length > 0) {
      this.selectedNode = this.orgTree[0];
      this.renderOrgTree();
      this.showTable(this.orgTree[0]);
    }
  },

  _renderFactoryOptions() {
    return this.orgTree.map(n => `<option value="${esc(n.id)}">${esc(n.name)}</option>`).join('');
  },

  _getAllDescendants(node) {
    const result = [];
    const walk = (nodes) => {
      if (!nodes || !nodes.length) return;
      nodes.forEach(n => {
        if (n.type === 'workcenter') {
          const wc = wcMockData.find(w => w.id === n.id);
          if (wc) result.push(wc);
        }
        if (n.children) walk(n.children);
      });
    };
    if (node.type === 'workcenter') {
      const wc = wcMockData.find(w => w.id === node.id);
      if (wc) result.push(wc);
    }
    walk(node.children || []);
    result.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
    return result;
  },

  search() {
    const factoryEl = document.getElementById('wcFilterFactory');
    const codeEl = document.getElementById('wcFilterCode');
    const nameEl = document.getElementById('wcFilterName');
    const factory = factoryEl ? factoryEl.value : '';
    const code = codeEl ? codeEl.value.trim() : '';
    const name = nameEl ? nameEl.value.trim() : '';

    this.searchFilters = { factory, code, name };
    this.searchTerm = [factory, code, name].filter(Boolean).join('|');

    if (!this.selectedNode) return;

    let descendants = this._getAllDescendants(this.selectedNode);

    if (factory || code || name) {
      this.searchResults = descendants.filter(wc => {
        let match = true;
        if (factory) match = match && this._wcBelongsToFactory(wc, factory);
        if (code) match = match && wc.code.toUpperCase().includes(code.toUpperCase());
        if (name) match = match && wc.name.includes(name);
        return match;
      });
    } else {
      this.searchResults = null;
      this.searchTerm = '';
    }

    if (this.searchResults && this.searchResults.length === 0 && this.searchTerm) {
      this._showTable(descendants, 'empty');
    } else if (this.searchResults) {
      this._showTable(this.searchResults);
    } else {
      this._showTable(descendants);
    }
  },

  reset() {
    const factoryEl = document.getElementById('wcFilterFactory');
    const codeEl = document.getElementById('wcFilterCode');
    const nameEl = document.getElementById('wcFilterName');
    if (factoryEl) factoryEl.value = '';
    if (codeEl) codeEl.value = '';
    if (nameEl) nameEl.value = '';
    this.searchFilters = { factory: '', code: '', name: '' };
    this.searchTerm = '';
    this.searchResults = null;
    if (this.selectedNode) { this.showTable(this.selectedNode); }
  },

  _wcBelongsToFactory(wc, factoryId) {
    // Walk the tree to check if wc belongs to the given factory
    const factoryNode = this.findNode(this.orgTree, factoryId);
    if (!factoryNode) return false;
    const descendants = this._getDescendantIds(factoryNode);
    return descendants.has(wc.id);
  },

  _getDescendantIds(node) {
    const ids = new Set();
    const walk = (n) => {
      ids.add(n.id);
      if (n.children) n.children.forEach(c => walk(c));
    };
    walk(node);
    return ids;
  },

  renderOrgTree() {
    const container = document.getElementById('wcTreeContainer');
    if (!container) return '';
    let html = '';
    if (this.searchTerm && this.searchResults && this.searchResults.length === 0) {
      html = '<div style="text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">未找到匹配的工作中心</div>';
    } else {
      this.orgTree.forEach((n, i) => html += this.renderTreeNode(n, 0, i === this.orgTree.length - 1));
    }
    container.innerHTML = html;
  },

  highlightText(text) {
    if (!this.searchTerm) return esc(text);
    const escaped = esc(text);
    const terms = this.searchTerm.split('|').filter(Boolean);
    let result = escaped;
    terms.forEach(t => {
      const escapedTerm = esc(t);
      const regex = new RegExp(`(${escapedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      result = result.replace(regex, '<mark style="background:#fde68a;color:#92400e;padding:0 1px;border-radius:2px;">$1</mark>');
    });
    return result;
  },

  renderTreeNode(node, depth, isLast) {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = this.expandedNodes.has(node.id);
    const isSelected = this.selectedNode && this.selectedNode.id === node.id;
    const label = node.type === 'factory' ? '工厂' : node.type === 'workshop' ? '车间' : '工作中心';

    let prefix = '';
    if (depth > 0) {
      prefix = `<span style="display:inline-block;width:${depth*20}px;position:relative;">`;
      for (let i = 0; i < depth; i++) {
        prefix += `<span style="position:absolute;left:${i*20+9}px;top:0;bottom:0;width:0;border-left:1px solid #e2e8f0;"></span>`;
      }
      prefix += `</span>`;
    }

    const toggleArrow = hasChildren
      ? `<span class="tree-toggle" onclick="WorkCenter.toggleNode(event,'${node.id}')" style="cursor:pointer;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;color:#94a3b8;flex-shrink:0;border-radius:3px;background:#f1f5f9;">${isExpanded ? '&#9660;' : '&#9654;'}</span>`
      : `<span style="width:18px;flex-shrink:0;"></span>`;

    const dotColor = node.type === 'factory' ? '#3b82f6' : node.type === 'workshop' ? '#8b5cf6' : '#22c55e';

    let html = `<div class="tree-row ${isSelected?'tree-row-active':''}" onclick="WorkCenter.selectNode('${node.id}')" style="display:flex;align-items:center;gap:4px;padding:6px 8px 6px 4px;cursor:pointer;border-radius:4px;margin:1px 0;transition:background .15s;font-size:13px;">
      ${prefix}
      ${toggleArrow}
      <span style="width:6px;height:6px;border-radius:50%;background:${dotColor};flex-shrink:0;margin:0 4px;"></span>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${this.highlightText(node.name)}</span>
      <span style="font-size:10px;color:#94a3b8;flex-shrink:0;">${label}</span>
    </div>`;

    if (hasChildren && isExpanded) {
      node.children.forEach((child, i) => {
        html += this.renderTreeNode(child, depth + 1, i === node.children.length - 1);
      });
    }
    return html;
  },

  toggleNode(e, nodeId) {
    e.stopPropagation();
    if (this.expandedNodes.has(nodeId)) {
      this.expandedNodes.delete(nodeId);
    } else {
      this.expandedNodes.add(nodeId);
    }
    this.renderOrgTree();
  },

  selectNode(nodeId) {
    const found = this.findNode(this.orgTree, nodeId);
    if (found) {
      this.selectedNode = found;
      this.renderOrgTree();
      this.showTable(found);
    }
  },

  findNode(nodes, id) {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) {
        const found = this.findNode(n.children, id);
        if (found) return found;
      }
    }
    return null;
  },

  showTable(node) {
    const descendants = this._getAllDescendants(node);
    const statusMap = { active:'正常启用', disabled:'临时停用', cancelled:'永久作废' };
    const statusCls = { active:'badge-green', disabled:'badge-yellow', cancelled:'badge-red' };
    const typeMap = { internal:'内部班组', outsourced:'外包服务商' };

    this._showTable(descendants);
  },

  _showTable(items, state) {
    const statusMap = { active:'正常启用', disabled:'临时停用', cancelled:'永久作废' };
    const statusCls = { active:'badge-green', disabled:'badge-yellow', cancelled:'badge-red' };
    const typeMap = { internal:'内部班组', outsourced:'外包服务商' };

    const tableHtml = (items && items.length)
      ? `
      <div class="table-wrapper" style="flex:1;overflow:auto;">
        <table class="data-table">
          <thead><tr>
            <th>工作中心编码</th>
            <th>名称</th>
            <th>所属工厂</th>
            <th>类型</th>
            <th>状态</th>
            <th>负责人</th>
            <th>操作</th>
          </tr></thead>
          <tbody>
            ${items.map(wc => `
              <tr>
                <td><span style="font-size:12px;">${esc(wc.code)}</span></td>
                <td>${esc(wc.name)}</td>
                <td>${esc(wc.factoryName)}</td>
                <td>${typeMap[wc.type]||wc.type}</td>
                <td><span class="badge ${statusCls[wc.status]||'badge-gray'}">${statusMap[wc.status]||wc.status}</span></td>
                <td>${esc(wc.leader)}</td>
                <td><button class="btn btn-blue btn-sm" onclick="WorkCenter.viewDetail('${wc.id}')">查看</button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`
      : `<div style="text-align:center;padding:60px 20px;color:var(--text-muted);"><div style="font-size:40px;margin-bottom:10px;">&#128203;</div><div>${state === 'empty' ? '未找到匹配的工作中心' : '该层级下暂无工作中心'}</div></div>`;

    const labelMap = { factory:'工厂', workshop:'车间', workcenter:'工作中心' };
    const headerHtml = `
      <div style="padding:14px 20px;background:white;border-bottom:1px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <span style="font-size:15px;font-weight:700;">${esc(this.selectedNode ? this.selectedNode.name : '')}</span>
          <span style="font-size:12px;color:var(--text-secondary);margin-left:8px;">${labelMap[this.selectedNode ? this.selectedNode.type : '']||''}</span>
        </div>
        <span style="font-size:12px;color:var(--text-muted);">共 <strong>${items ? items.length : 0}</strong> 个工作中心</span>
      </div>`;

    const panel = document.getElementById('wcTablePanel');
    const placeholder = document.getElementById('wcPlaceholder');
    if (panel) {
      panel.innerHTML = headerHtml + tableHtml;
      panel.style.display = 'flex';
      panel.style.flexDirection = 'column';
    }
    if (placeholder) placeholder.style.display = 'none';
  },

  viewDetail(wcId) {
    const wc = wcMockData.find(w => w.id === wcId);
    if (!wc) return;

    const statusMap = { active:'正常启用', disabled:'临时停用', cancelled:'永久作废' };
    const statusCls = { active:'badge-green', disabled:'badge-yellow', cancelled:'badge-red' };
    const typeMap = { internal:'内部班组', outsourced:'外包服务商' };
    const specMap = { mechanical:'机械维修', electrical:'电气维修', general:'综合维修', instrument:'仪表维修', hvac:'暖通空调' };

    const isAdmin = this._isAdmin();
    const footerBtns = isAdmin
      ? [
          { text:'关闭',cls:'btn-secondary',action:closeModal },
          { text:'编辑',cls:'btn-primary',action:`()=>{ closeModal(); WorkCenter.editModal('${wc.id}'); }` }
        ]
      : [{ text:'关闭',cls:'btn-secondary',action:closeModal }];

    showModal('工作中心详情', `
      <div style="padding:28px 32px 20px;background:white;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border);">
          <div>
            <div style="font-size:20px;font-weight:700;color:var(--text-primary);">${esc(wc.name)}</div>
            <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">编码：${esc(wc.code)}</div>
          </div>
          <span class="badge ${statusCls[wc.status]||'badge-gray'}" style="font-size:13px;padding:6px 14px;border-radius:8px;">${statusMap[wc.status]||wc.status}</span>
        </div>
        <div class="detail-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:18px 28px;">
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">工作中心编码</dt><dd style="font-size:14px;color:var(--text-primary);">${esc(wc.code)}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">类型</dt><dd style="font-size:14px;color:var(--text-primary);">${typeMap[wc.type]||wc.type}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;grid-column:span 2;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">工作中心描述</dt><dd style="font-size:14px;color:var(--text-primary);line-height:1.6;">${esc(wc.description || '暂无描述')}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">所属工厂</dt><dd style="font-size:14px;color:var(--text-primary);">${esc(wc.factoryName)}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">专业方向</dt><dd style="font-size:14px;color:var(--text-primary);">${specMap[wc.specialty]||wc.specialty}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">负责人/所属部门</dt><dd style="font-size:14px;color:var(--text-primary);">${esc(wc.leader)}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">联系电话</dt><dd style="font-size:14px;color:var(--text-primary);">${esc(wc.phone)}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">成本中心</dt><dd style="font-size:14px;color:var(--text-primary);">${esc(wc.costCenter || '-')}</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">额定人数</dt><dd style="font-size:14px;color:var(--text-primary);">${wc.capacity} 人</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">在岗人数</dt><dd style="font-size:14px;color:var(--text-primary);">${wc.staffCount} 人</dd></div>
          <div class="detail-item" style="background:#fafbfc;border-radius:10px;padding:14px 18px;"><dt style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">班次</dt><dd style="font-size:14px;color:var(--text-primary);">${wc.shift} 班</dd></div>
        </div>
      </div>`, footerBtns, 'modal-lg');
  },

  addModal() {
    if (!this._isAdmin()) { toast('无操作权限，仅管理员可创建'); return; }
    const factoryOpts = this.orgTree.map(n => `<option value="${esc(n.id)}">${esc(n.name)}</option>`).join('');
    showModal('新增工作中心', `
      <div class="form-grid" style="padding:8px 0;">
        <div class="form-group"><label>工厂<span class="req">*</span></label>
          <select id="wcFormFactory"><option value="">请选择工厂</option>${factoryOpts}</select>
        </div>
        <div class="form-group"><label>工作中心编码<span class="req">*</span></label><input id="wcFormCode" placeholder="如 WC-F001-005"></div>
        <div class="form-group" style="grid-column:span 2;"><label>工作中心描述</label><textarea id="wcFormDesc" rows="2" placeholder="工作中心详细描述"></textarea></div>
        <div class="form-group"><label>负责人/所属部门<span class="req">*</span></label><input id="wcFormLeader" placeholder="如 张建国"></div>
        <div class="form-group"><label>联系电话</label><input id="wcFormPhone" placeholder="如 13800138000"></div>
        <div class="form-group"><label>成本中心</label><input id="wcFormCostCenter" placeholder="如 CC-1000-W01"></div>
        <div class="form-group"><label>类型</label>
          <select id="wcFormType"><option value="internal">内部班组</option><option value="outsourced">外包服务商</option></select>
        </div>
        <div class="form-group"><label>专业方向</label>
          <select id="wcFormSpec">
            <option value="mechanical">机械维修</option><option value="electrical">电气维修</option>
            <option value="general">综合维修</option><option value="instrument">仪表维修</option>
            <option value="hvac">暖通空调</option>
          </select>
        </div>
        <div class="form-group"><label>额定人数</label><input id="wcFormCap" type="number" value="5"></div>
        <div class="form-group"><label>班次</label><input id="wcFormShift" type="number" value="2"></div>
      </div>`, [
        { text:'取消',cls:'btn-secondary',action:closeModal },
        { text:'保存',cls:'btn-primary',action:()=>{ toast('工作中心已新增！'); closeModal(); } }
      ]);
  },

  editModal(wcId) {
    if (!this._isAdmin()) { toast('无操作权限，仅管理员可编辑'); return; }
    const wc = wcMockData.find(w => w.id === wcId);
    if (!wc) return;
    const factoryOpts = this.orgTree.map(n => `<option value="${esc(n.id)}"${n.id===wc.factory?' selected':''}>${esc(n.name)}</option>`).join('');
    const typeSel = v => `value="${esc(v)}"${wc.type===v?' selected':''}`;
    const specSel = v => `value="${esc(v)}"${wc.specialty===v?' selected':''}`;

    showModal('编辑工作中心', `
      <div class="form-grid" style="padding:8px 0;">
        <div class="form-group"><label>工作中心编码<span class="req">*</span></label><input value="${esc(wc.code)}" readonly style="background:#f9fafb;"></div>
        <div class="form-group"><label>名称</label><input id="wcEditName" value="${esc(wc.name)}"></div>
        <div class="form-group" style="grid-column:span 2;"><label>工作中心描述</label><textarea id="wcEditDesc" rows="2" placeholder="工作中心详细描述">${esc(wc.description||'')}</textarea></div>
        <div class="form-group"><label>负责人/所属部门</label><input id="wcEditLeader" value="${esc(wc.leader)}"></div>
        <div class="form-group"><label>联系电话</label><input id="wcEditPhone" value="${esc(wc.phone)}"></div>
        <div class="form-group"><label>成本中心</label><input id="wcEditCostCenter" value="${esc(wc.costCenter||'')}"></div>
        <div class="form-group"><label>类型</label>
          <select id="wcEditType"><option ${typeSel('internal')}>内部班组</option><option ${typeSel('outsourced')}>外包服务商</option></select>
        </div>
        <div class="form-group"><label>专业方向</label>
          <select id="wcEditSpec"><option ${specSel('mechanical')}>机械维修</option><option ${specSel('electrical')}>电气维修</option><option ${specSel('general')}>综合维修</option><option ${specSel('instrument')}>仪表维修</option><option ${specSel('hvac')}>暖通空调</option></select>
        </div>
        <div class="form-group"><label>额定人数</label><input id="wcEditCap" type="number" value="${wc.capacity}"></div>
        <div class="form-group"><label>班次</label><input id="wcEditShift" type="number" value="${wc.shift}"></div>
      </div>`, [
        { text:'取消',cls:'btn-secondary',action:closeModal },
        { text:'保存',cls:'btn-primary',action:()=>{ toast('更新成功！'); closeModal(); if(WorkCenter.selectedNode){ WorkCenter.showTable(WorkCenter.selectedNode); } } }
      ]);
  }
};

// ===== Equipment BOM Page =====
const EquipmentBOM = {
  page: 1, pageSize: 10, filtered: [],

  render() {
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">设备BOM管理</div><div style="font-size:13px;opacity:0.8;">物料清单</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary" style="background:rgba(255,255,255,0.15);color:white;" onclick="EquipmentBOM.reset()">🔄 刷新</button>
            <button class="btn btn-blue" onclick="EquipmentBOM.addModal()">+ 新增BOM</button>
          </div>
        </div>
        <div style="padding:12px 20px;background:white;border-bottom:1px solid var(--border);display:flex;gap:12px;flex-shrink:0;overflow-x:auto;">
          <div class="stat-card" style="min-width:140px;box-shadow:none;border:1px solid var(--border);padding:10px 14px;">
            <div class="stat-icon blue">📋</div><div><div class="stat-label">BOM总数</div><div class="stat-value" style="font-size:22px;">${bomListData.length}</div></div></div>
          <div class="stat-card" style="min-width:140px;box-shadow:none;border:1px solid var(--border);padding:10px 14px;">
            <div class="stat-icon green">✅</div><div><div class="stat-label">已发布</div><div class="stat-value" style="font-size:22px;">${bomListData.filter(b=>b.status==='published').length}</div></div></div>
          <div class="stat-card" style="min-width:140px;box-shadow:none;border:1px solid var(--border);padding:10px 14px;">
            <div class="stat-icon yellow">📝</div><div><div class="stat-label">草稿</div><div class="stat-value" style="font-size:22px;">${bomListData.filter(b=>b.status==='draft').length}</div></div></div>
          <div class="stat-card" style="min-width:140px;box-shadow:none;border:1px solid var(--border);padding:10px 14px;">
            <div class="stat-icon red">❌</div><div><div class="stat-label">已作废</div><div class="stat-value" style="font-size:22px;">${bomListData.filter(b=>b.status==='cancelled').length}</div></div></div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>设备编码</label><input type="text" id="bomEqCode" placeholder="模糊查询"></div>
          <div class="filter-group"><label>设备名称</label><input type="text" id="bomEqName" placeholder="模糊查询"></div>
          <div class="filter-group"><label>状态</label>
            <select id="bomStatus"><option value="">全部</option><option value="published">已发布</option><option value="draft">草稿</option><option value="cancelled">已作废</option></select>
          </div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="EquipmentBOM.search()">🔍 查询</button>
            <button class="btn btn-secondary btn-sm" onclick="EquipmentBOM.reset()">↺ 重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table">
            <thead><tr><th>BOM编号</th><th>设备编码</th><th>设备名称</th><th>版本</th><th>状态</th><th>创建人</th><th>创建时间</th><th>SAP</th><th>操作</th></tr></thead>
            <tbody id="bomTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info"><span class="list-count" id="bomCount">共 ${this.filtered.length} 条</span></div>
          <div class="pagination">
            <button class="pagination-btn" id="bomPrev" disabled onclick="EquipmentBOM.prevPage()">‹</button>
            <span class="pagination-info" id="bomPageInfo">第 1 / ${Math.ceil(this.filtered.length/this.pageSize)} 页</span>
            <button class="pagination-btn" id="bomNext" onclick="EquipmentBOM.nextPage()">›</button>
            <select class="page-size-select" id="bomPageSizeSel" onchange="EquipmentBOM.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
          </div>
        </div>
      </div>`;
  },

  init() {
    this.filtered = [...bomListData];
    this.page = 1;
    this.renderTable();
  },

  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;
    document.getElementById('bomCount').textContent = `共 ${this.filtered.length} 条`;
    document.getElementById('bomPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('bomPrev').disabled = this.page <= 1;
    document.getElementById('bomNext').disabled = this.page >= totalPages;
    document.getElementById('bomPageSizeSel').value = this.pageSize;

    const statusMap = { published:'已发布', draft:'草稿', cancelled:'已作废' };
    const statusCls = { published:'badge-green', draft:'badge-yellow', cancelled:'badge-red' };

    document.getElementById('bomTableBody').innerHTML = page.map(b => `
      <tr>
        <td><strong>${esc(b.id)}</strong></td>
        <td>${esc(b.eqCode)}</td>
        <td>${esc(b.eqName)}</td>
        <td>${esc(b.version)}</td>
        <td><span class="badge ${statusCls[b.status]||'badge-gray'}">${statusMap[b.status]||b.status}</span></td>
        <td>${esc(b.creator)}</td>
        <td>${esc(b.createTime)}</td>
        <td>${getSyncBadge(b.syncStatus)}</td>
        <td class="table-actions">
          <button class="btn btn-blue btn-sm" onclick="EquipmentBOM.detail('${b.id}')">👁 详情</button>
          <button class="btn btn-warning btn-sm" onclick="EquipmentBOM.edit('${b.id}')">✏ 编辑</button>
        </td>
      </tr>`).join('');
  },

  search() {
    const eqCode = document.getElementById('bomEqCode').value.trim();
    const eqName = document.getElementById('bomEqName').value.trim();
    const status = document.getElementById('bomStatus').value;
    this.filtered = bomListData.filter(b => {
      if (eqCode && !b.eqCode.includes(eqCode)) return false;
      if (eqName && !b.eqName.includes(eqName)) return false;
      if (status && b.status !== status) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
  },

  reset() {
    document.getElementById('bomEqCode').value = '';
    document.getElementById('bomEqName').value = '';
    document.getElementById('bomStatus').value = '';
    this.filtered = [...bomListData];
    this.page = 1;
    this.renderTable();
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() { if (this.page < Math.ceil(this.filtered.length/this.pageSize)) { this.page++; this.renderTable(); } },
  changePageSize() { this.pageSize = parseInt(document.getElementById('bomPageSizeSel').value); this.page = 1; this.renderTable(); },

  detail(bomId) {
    const bom = bomListData.find(b => b.id === bomId);
    if (!bom) return;
    const detail = bomDetailData[bomId];
    const logs = bomLogs[bomId] || [];

    const statusMap = { published:'已发布', draft:'草稿', cancelled:'已作废' };
    const logsHtml = logs.length ? logs.map(l => `
      <div style="padding:10px;background:#f8fafc;border-radius:6px;margin-bottom:6px;border-left:3px solid var(--primary);">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
          <span class="badge badge-blue" style="font-size:11px;">${esc(l.version)} ${esc(l.action)}</span>
          <span style="font-size:11px;color:var(--text-secondary);">${esc(l.time)}</span>
        </div>
        <div style="font-size:12px;">${esc(l.content)}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:3px;">操作人：${esc(l.user)}</div>
      </div>`).join('') : '<p style="color:var(--text-muted);text-align:center;padding:16px;">暂无版本记录</p>';

    let itemsHtml = '';
    if (detail && detail.items) {
      itemsHtml = `
        <table class="data-table" style="margin-top:8px;">
          <thead><tr><th>物料编码</th><th>物料名称</th><th>层级</th><th>单位</th><th>数量</th><th>供应商</th><th>备注</th></tr></thead>
          <tbody>${detail.items.map(item => `
            <tr>
              <td><strong>${esc(item.code)}</strong></td>
              <td style="padding-left:${item.level*20+12}px;">${item.level > 0 ? '├ ' : ''}${esc(item.name)}</td>
              <td>${item.level}</td>
              <td>${esc(item.unit)}</td>
              <td>${item.qty}</td>
              <td>${esc(item.supplier)}</td>
              <td style="font-size:12px;color:var(--text-secondary);">${esc(item.remark||'-')}</td>
            </tr>`).join('')}</tbody>
        </table>`;
    } else {
      itemsHtml = '<p style="color:var(--text-muted);text-align:center;padding:20px;">暂无BOM明细数据</p>';
    }

    openSidePanel(bom.eqName, `BOM: ${bom.id} | 版本: ${bom.version}`, `
      <div class="detail-grid" style="margin-bottom:20px;">
        <div class="detail-item"><dt>BOM编号</dt><dd>${esc(bom.id)}</dd></div>
        <div class="detail-item"><dt>设备编码</dt><dd>${esc(bom.eqCode)}</dd></div>
        <div class="detail-item"><dt>设备名称</dt><dd>${esc(bom.eqName)}</dd></div>
        <div class="detail-item"><dt>版本</dt><dd>${esc(bom.version)}</dd></div>
        <div class="detail-item"><dt>状态</dt><dd><span class="badge ${bom.status==='published'?'badge-green':bom.status==='draft'?'badge-yellow':'badge-red'}">${statusMap[bom.status]}</span></dd></div>
        <div class="detail-item"><dt>创建人</dt><dd>${esc(bom.creator)}</dd></div>
        <div class="detail-item"><dt>创建时间</dt><dd>${esc(bom.createTime)}</dd></div>
        <div class="detail-item"><dt>SAP同步</dt><dd>${getSyncBadge(bom.syncStatus)}</dd></div>
      </div>
      <div class="tabs" style="margin-bottom:16px;">
        <div class="tab active" onclick="EquipmentBOM.switchBomTab(event,'items')">📦 BOM物料清单</div>
        <div class="tab" onclick="EquipmentBOM.switchBomTab(event,'logs')">📋 版本日志</div>
      </div>
      <div id="bom-tab-items" class="tab-panel active">${itemsHtml}</div>
      <div id="bom-tab-logs" class="tab-panel">${logsHtml}</div>`);
  },

  switchBomTab(event, name) {
    const panel = document.getElementById('sidePanel');
    panel.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    panel.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const target = panel.querySelector(`#bom-tab-${name}`);
    if (target) target.classList.add('active');
  },

  edit(bomId) {
    const bom = bomListData.find(b => b.id === bomId);
    if (!bom) return;
    showModal('编辑BOM', `
      <div class="form-grid">
        <div class="form-group"><label>BOM编号</label><input value="${esc(bom.id)}" readonly style="background:#f9fafb;"></div>
        <div class="form-group"><label>设备编码</label><input value="${esc(bom.eqCode)}" readonly style="background:#f9fafb;"></div>
        <div class="form-group"><label>设备名称</label><input value="${esc(bom.eqName)}"></div>
        <div class="form-group"><label>版本</label><input value="${esc(bom.version)}"></div>
      </div>`, [
        { text:'取消',cls:'btn-secondary',action:closeModal },
        { text:'保存',cls:'btn-primary',action:()=>{ toast('BOM更新成功！'); closeModal(); } }
      ]);
  },

  addModal() {
    showModal('新增BOM', `
      <div class="form-grid">
        <div class="form-group"><label>设备编码<span class="req">*</span></label><input id="bomFormEqCode" placeholder="如 EQ007"></div>
        <div class="form-group"><label>设备名称<span class="req">*</span></label><input id="bomFormEqName" placeholder="如 新设备"></div>
        <div class="form-group"><label>版本</label><input id="bomFormVer" value="V1.0"></div>
        <div class="form-group"><label>创建人</label><input id="bomFormCreator" value="管理员"></div>
      </div>`, [
        { text:'取消',cls:'btn-secondary',action:closeModal },
        { text:'保存',cls:'btn-primary',action:()=>{ toast('BOM已新增！'); closeModal(); } }
      ]);
  }
};

// ===== 测量点定义页面 (静态主数据) =====
// 位置：设备主数据详情页 → "测量点" 按钮
const MeasurementPoint = {
  currentEquipmentId: '',
  currentEquipmentName: '',
  filteredData: [],
  pageSize: 10,
  currentPage: 1,

  init() {
    this.currentEquipmentId = '';
    this.currentEquipmentName = '';
    this.filteredData = [...measurementPointData];
    this.pageSize = 10;
    this.currentPage = 1;
    this.renderFilterBar();
    this.renderTable();
    this.setupEvents();
  },

  render() {
    return `<div class="eq-master" style="height:calc(100vh - 56px);display:flex;flex-direction:column;">
      <div style="background:white;border-bottom:1px solid var(--border);padding:12px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:14px;font-weight:600;">测量点定义</span>
          <span style="font-size:12px;color:var(--text-muted);">静态主数据管理</span>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-outline btn-sm" onclick="MeasurementPoint.filterByEquipment()">📋 按设备筛选</button>
          <button class="btn btn-primary btn-sm" onclick="MeasurementPoint.openAddDialog()">+ 新增测量点</button>
        </div>
      </div>
      <div id="mpFilterBar"></div>
      <div id="mpTableArea" style="flex:1;overflow:auto;padding:0 20px 20px;background:white;"></div>
    </div>`;
  },

  renderFilterBar() {
    const el = document.getElementById('mpFilterBar');
    if (!el) return;
    const activeCount = this.filteredData.filter(d => d.status === 'active').length;
    const totalCount = this.filteredData.length;
    el.innerHTML = `<div class="filter-bar">
      <div class="filter-group"><label>关键字</label><input type="text" id="mpSearchKeyword" placeholder="编码/名称/设备..." onkeyup="MeasurementPoint.doFilter()"></div>
      <div class="filter-group"><label>类型</label><select id="mpSearchType" onchange="MeasurementPoint.doFilter()">
        <option value="">全部</option><option value="QTY">定量</option><option value="QLTY">定性</option>
      </select></div>
      <div class="filter-group"><label>状态</label><select id="mpSearchStatus" onchange="MeasurementPoint.doFilter()">
        <option value="">全部</option><option value="active">启用</option><option value="inactive">停用</option>
      </select></div>
      <div class="filter-group"><label>是否计数器</label><select id="mpSearchCounter" onchange="MeasurementPoint.doFilter()">
        <option value="">全部</option><option value="yes">是</option><option value="no">否</option>
      </select></div>
      <div class="filter-actions">
        <button class="btn btn-secondary btn-sm" onclick="MeasurementPoint.resetFilter()">重置</button>
      </div>
    </div>
    <div class="list-toolbar">
      <div class="list-info">
        <span class="list-count">共 <b>${totalCount}</b> 条记录，启用 <b>${activeCount}</b> 条</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:12px;color:var(--text-muted);">每页</span>
        <select class="page-size-select" id="mpPageSize" onchange="MeasurementPoint.changePageSize()">
          <option value="10">10</option><option value="20">20</option><option value="50">50</option>
        </select>
        <span style="font-size:12px;color:var(--text-muted);">条</span>
      </div>
    </div>`;
  },

  renderTable() {
    const el = document.getElementById('mpTableArea');
    if (!el) return;
    const total = this.filteredData.length;
    const pages = Math.ceil(total / this.pageSize);
    if (this.currentPage > pages) this.currentPage = Math.max(1, pages);
    const start = (this.currentPage - 1) * this.pageSize;
    const pageData = this.filteredData.slice(start, start + this.pageSize);

    let html = `<div class="table-wrapper" style="max-height:calc(100vh - 260px);">
    <table class="data-table">
      <thead><tr>
        <th style="width:60px;">#</th>
        <th>编码</th>
        <th>测量点名称</th>
        <th>所属设备</th>
        <th>类型</th>
        <th>单位</th>
        <th>阈值上限</th>
        <th>阈值下限</th>
        <th>报警</th>
        <th>计数器</th>
        <th>状态</th>
        <th style="width:160px;">操作</th>
      </tr></thead>
      <tbody>`;

    if (pageData.length === 0) {
      html += `<tr><td colspan="12" style="text-align:center;padding:40px;color:var(--text-muted);">暂无测量点数据</td></tr>`;
    } else {
      pageData.forEach((mp, idx) => {
        const typeBadge = mp.type === 'QTY' ? '<span class="badge badge-blue badge-sm">定量</span>' : '<span class="badge badge-purple badge-sm">定性</span>';
        const alarmBadge = mp.alarmEnabled ? '<span class="badge badge-green badge-sm">✓ 开启</span>' : '<span class="badge badge-gray badge-sm">关闭</span>';
        const counterBadge = mp.isCounter ? '<span class="badge badge-yellow badge-sm">计数器</span>' : '<span style="font-size:12px;color:var(--text-muted);">—</span>';
        const statusBadge = mp.status === 'active' ? '<span class="badge badge-green badge-sm">启用</span>' : '<span class="badge badge-gray badge-sm">停用</span>';
        const upperStr = mp.upperLimit !== null ? mp.upperLimit : '—';
        const lowerStr = mp.lowerLimit !== null ? mp.lowerLimit : '—';
        const hasRecords = measurementRecordData.some(r => r.measurementPointId === mp.id);

        html += `<tr>
          <td style="color:var(--text-muted);">${start + idx + 1}</td>
          <td><code style="background:#f1f5f9;padding:2px 6px;border-radius:3px;font-size:12px;">${esc(mp.code)}</code></td>
          <td><b>${esc(mp.name)}</b></td>
          <td><a href="javascript:void(0)" onclick="App.navigateTo('main-data','equipment','equipment-master','设备主数据')" style="color:var(--primary-lighter);">${esc(mp.equipmentName)}</a><br><span style="font-size:11px;color:var(--text-muted);">${esc(mp.equipmentCode)}</span></td>
          <td>${typeBadge}</td>
          <td>${mp.unit || '—'}</td>
          <td style="${mp.upperLimit !== null && mp.alarmEnabled ? 'color:#dc2626;font-weight:600;' : ''}">${upperStr}</td>
          <td style="${mp.lowerLimit !== null && mp.alarmEnabled ? 'color:#dc2626;font-weight:600;' : ''}">${lowerStr}</td>
          <td>${alarmBadge}</td>
          <td>${counterBadge}</td>
          <td>${statusBadge}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-outline btn-sm" onclick="MeasurementPoint.openEditDialog('${mp.id}')">编辑</button>
              ${mp.status === 'active'
                ? `<button class="btn btn-secondary btn-sm" onclick="MeasurementPoint.toggleStatus('${mp.id}')">停用</button>`
                : `<button class="btn btn-success btn-sm" onclick="MeasurementPoint.toggleStatus('${mp.id}')">启用</button>`}
              ${!hasRecords
                ? `<button class="btn btn-secondary btn-sm" style="color:var(--danger);" onclick="MeasurementPoint.deletePoint('${mp.id}')">删除</button>`
                : `<button class="btn btn-secondary btn-sm" disabled title="已产生测量记录，不可删除" style="opacity:0.4;">删除</button>`}
            </div>
          </td>
        </tr>`;
      });
    }
    html += `</tbody></table></div>`;

    // Pagination
    if (total > this.pageSize) {
      let pageHtml = '';
      const maxBtns = 7;
      let startP = Math.max(1, this.currentPage - Math.floor(maxBtns / 2));
      let endP = Math.min(pages, startP + maxBtns - 1);
      if (endP - startP < maxBtns - 1) startP = Math.max(1, endP - maxBtns + 1);
      for (let i = startP; i <= endP; i++) {
        pageHtml += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" onclick="MeasurementPoint.goPage(${i})">${i}</button>`;
      }
      html += `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;background:white;">
        <span class="pagination-info">第 ${this.currentPage}/${pages} 页，共 ${total} 条</span>
        <div class="pagination">
          <button class="pagination-btn" onclick="MeasurementPoint.goPage(1)" ${this.currentPage === 1 ? 'disabled' : ''}>«</button>
          <button class="pagination-btn" onclick="MeasurementPoint.goPage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}>‹</button>
          ${pageHtml}
          <button class="pagination-btn" onclick="MeasurementPoint.goPage(${this.currentPage + 1})" ${this.currentPage === pages ? 'disabled' : ''}>›</button>
          <button class="pagination-btn" onclick="MeasurementPoint.goPage(${pages})" ${this.currentPage === pages ? 'disabled' : ''}>»</button>
        </div>
      </div>`;
    }
    el.innerHTML = html;
  },

  doFilter() {
    const keyword = (document.getElementById('mpSearchKeyword')?.value || '').toLowerCase();
    const type = document.getElementById('mpSearchType')?.value || '';
    const status = document.getElementById('mpSearchStatus')?.value || '';
    const counter = document.getElementById('mpSearchCounter')?.value || '';

    this.filteredData = measurementPointData.filter(mp => {
      if (keyword && !mp.code.toLowerCase().includes(keyword) && !mp.name.toLowerCase().includes(keyword) && !mp.equipmentName.toLowerCase().includes(keyword)) return false;
      if (type && mp.type !== type) return false;
      if (status && mp.status !== status) return false;
      if (counter === 'yes' && !mp.isCounter) return false;
      if (counter === 'no' && mp.isCounter) return false;
      return true;
    });
    this.currentPage = 1;
    this.renderTable();
  },

  resetFilter() {
    const kw = document.getElementById('mpSearchKeyword'); if (kw) kw.value = '';
    const tp = document.getElementById('mpSearchType'); if (tp) tp.value = '';
    const st = document.getElementById('mpSearchStatus'); if (st) st.value = '';
    const ct = document.getElementById('mpSearchCounter'); if (ct) ct.value = '';
    this.filteredData = [...measurementPointData];
    this.currentPage = 1;
    this.renderTable();
  },

  goPage(p) {
    const pages = Math.ceil(this.filteredData.length / this.pageSize);
    if (p < 1 || p > pages) return;
    this.currentPage = p;
    this.renderTable();
  },

  changePageSize() {
    const sel = document.getElementById('mpPageSize');
    if (sel) { this.pageSize = parseInt(sel.value); this.currentPage = 1; this.renderTable(); }
  },

  filterByEquipment() {
    let eqOpts = equipmentData.map(eq => `<option value="${eq.id}">${esc(eq.name)} (${esc(eq.code)})</option>`).join('');
    showModal('按设备筛选', `
      <div class="form-group">
        <label>选择设备</label>
        <select id="mpEqFilterSelect" style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:13px;">
          <option value="">全部设备</option>
          ${eqOpts}
        </select>
      </div>
      <div style="margin-top:12px;font-size:12px;color:var(--text-muted);">提示：也可从设备主数据→测量点按钮跳转查看特定设备</div>
    `, [
      { text:'取消', cls:'btn-secondary', action:closeModal },
      { text:'筛选', cls:'btn-primary', action:() => {
        const sel = document.getElementById('mpEqFilterSelect');
        const eqId = sel ? sel.value : '';
        if (eqId) {
          this.currentEquipmentId = eqId;
          const eq = equipmentData.find(e => e.id === eqId);
          this.currentEquipmentName = eq ? eq.name : '';
          this.filteredData = measurementPointData.filter(mp => mp.equipmentId === eqId);
        } else {
          this.currentEquipmentId = '';
          this.currentEquipmentName = '';
          this.filteredData = [...measurementPointData];
        }
        this.currentPage = 1;
        closeModal();
        this.renderTable();
        this.renderFilterBar();
      }}
    ]);
  },

  openAddDialog() {
    const formHtml = this.renderForm('');
    showModal('新增测量点', formHtml, [
      { text:'取消', cls:'btn-secondary', action:closeModal },
      { text:'保存', cls:'btn-primary', action:() => this.savePoint('') }
    ], 'modal-lg');
    this.initFormEvents();
  },

  openEditDialog(id) {
    const mp = measurementPointData.find(p => p.id === id);
    if (!mp) return toast('测量点不存在');
    const formHtml = this.renderForm(id);
    showModal('编辑测量点', formHtml, [
      { text:'取消', cls:'btn-secondary', action:closeModal },
      { text:'保存', cls:'btn-primary', action:() => this.savePoint(id) }
    ], 'modal-lg');
    this.initFormEvents();
    // Fill form values
    setTimeout(() => {
      this.fillForm(mp);
    }, 100);
  },

  renderForm(id) {
    const isEdit = !!id;
    return `
      <div class="form-grid col-2">
        <div class="form-group"><label>测量点编码 <span class="req">*</span></label><input type="text" id="mpFormCode" placeholder="自动生成或手动输入" ${isEdit ? 'readonly' : ''}></div>
        <div class="form-group"><label>测量点名称 <span class="req">*</span></label><input type="text" id="mpFormName" placeholder="如：泵驱动端轴承振动"></div>
        <div class="form-group"><label>所属设备 <span class="req">*</span></label>
          <select id="mpFormEquipment" ${isEdit ? 'disabled' : ''}>
            <option value="">请选择设备</option>
            ${equipmentData.map(eq => `<option value="${eq.id}">${esc(eq.name)} (${esc(eq.code)})</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>关联BOM组件</label>
          <select id="mpFormBomComponent">
            <option value="">设备整体</option>
          </select>
        </div>
        <div class="form-group"><label>测量点类型 <span class="req">*</span></label>
          <select id="mpFormType" onchange="MeasurementPoint.onTypeChange()">
            <option value="">请选择</option>
            <option value="QTY">定量</option>
            <option value="QLTY">定性</option>
          </select>
        </div>
        <div class="form-group"><label>状态</label>
          <select id="mpFormStatus">
            <option value="active">启用</option>
            <option value="inactive">停用</option>
          </select>
        </div>
      </div>

      <!-- 定量配置 -->
      <div id="mpQtyConfig" style="display:none;margin-top:16px;">
        <div class="form-section-title">定量配置</div>
        <div class="form-grid col-3">
          <div class="form-group"><label>单位 <span class="req">*</span></label>
            <select id="mpFormUnit">
              <option value="">请选择</option>
              <option value="mm/s">mm/s</option>
              <option value="bar">bar</option>
              <option value="℃">℃</option>
              <option value="h">h</option>
              <option value="km">km</option>
              <option value="rpm">rpm</option>
              <option value="kN">kN</option>
              <option value="mg">mg</option>
              <option value="MPa">MPa</option>
              <option value="%">%</option>
              <option value="件/分钟">件/分钟</option>
              <option value="件">件</option>
            </select>
          </div>
          <div class="form-group"><label>阈值上限</label><input type="number" id="mpFormUpper" placeholder="超过触发报警" step="any"></div>
          <div class="form-group"><label>阈值下限</label><input type="number" id="mpFormLower" placeholder="低于触发报警" step="any"></div>
        </div>
        <div class="form-grid" style="margin-top:12px;">
          <div class="form-group">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" id="mpFormAlarm" checked style="width:16px;height:16px;">
              启用阈值报警
            </label>
            <span style="font-size:11px;color:var(--text-muted);margin-top:4px;">录入数据越限时自动生成异常事件</span>
          </div>
        </div>
      </div>

      <!-- 定性配置 -->
      <div id="mpQltyConfig" style="display:none;margin-top:16px;">
        <div class="form-section-title">定性配置</div>
        <div class="form-grid col-2">
          <div class="form-group"><label>代码组 <span class="req">*</span></label>
            <select id="mpFormCodeGroup">
              <option value="">请选择</option>
              <option value="normal_abnormal">正常/异常</option>
              <option value="excellent_good_poor">优/良/差</option>
              <option value="pass_fail">合格/不合格</option>
              <option value="on_off">开启/关闭</option>
            </select>
          </div>
          <div class="form-group"><label>报警值（可多选）</label>
            <div id="mpFormAlarmCodes" style="display:flex;flex-wrap:wrap;gap:8px;padding-top:4px;">
              <span style="font-size:12px;color:var(--text-muted);">请先选择代码组</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 计数器配置 -->
      <div style="margin-top:16px;">
        <div class="form-section-title">计数器配置</div>
        <div class="form-grid col-3">
          <div class="form-group">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" id="mpFormIsCounter" style="width:16px;height:16px;" onchange="MeasurementPoint.onCounterChange()">
              设为计数器
            </label>
            <span style="font-size:11px;color:var(--text-muted);margin-top:4px;">开启后可累计运行量，如运行小时、产量</span>
          </div>
          <div class="form-group"><label>初始计数器读数</label><input type="number" id="mpFormInitCounter" placeholder="首次建立时的基准读数" step="any"></div>
          <div class="form-group"><label>年估算值</label><input type="number" id="mpFormYearly" placeholder="如 6000小时/年" step="any"></div>
        </div>
      </div>

      <div class="form-grid" style="margin-top:12px;">
        <div class="form-group full"><label>备注</label><textarea id="mpFormRemark" rows="2" placeholder="补充说明信息"></textarea></div>
      </div>`;
  },

  initFormEvents() {
    setTimeout(() => {
      const typeSel = document.getElementById('mpFormType');
      if (typeSel) typeSel.addEventListener('change', () => this.onTypeChange());
    }, 50);
  },

  onTypeChange() {
    const type = document.getElementById('mpFormType')?.value;
    const qtyEl = document.getElementById('mpQtyConfig');
    const qltyEl = document.getElementById('mpQltyConfig');
    if (qtyEl) qtyEl.style.display = type === 'QTY' ? 'block' : 'none';
    if (qltyEl) qltyEl.style.display = type === 'QLTY' ? 'block' : 'none';

    // 定性类型时，计数器自动取消
    if (type === 'QLTY') {
      const cb = document.getElementById('mpFormIsCounter');
      if (cb) { cb.checked = false; cb.disabled = true; }
    } else {
      const cb = document.getElementById('mpFormIsCounter');
      if (cb) cb.disabled = false;
    }

    // 更新报警值选项
    if (type === 'QLTY') {
      this.updateAlarmCodeOptions();
    }
  },

  updateAlarmCodeOptions() {
    const group = document.getElementById('mpFormCodeGroup')?.value;
    const container = document.getElementById('mpFormAlarmCodes');
    if (!container) return;
    if (!group || !qualitativeCodeGroups[group]) {
      container.innerHTML = '<span style="font-size:12px;color:var(--text-muted);">请先选择代码组</span>';
      return;
    }
    const grp = qualitativeCodeGroups[group];
    container.innerHTML = grp.codes.map((code, i) => `
      <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:13px;">
        <input type="checkbox" value="${code}" class="mp-alarm-code-cb" style="width:14px;height:14px;">
        ${esc(grp.labels[i])}
      </label>
    `).join('');

    // Listen to code group change
    const codeGroupSel = document.getElementById('mpFormCodeGroup');
    if (codeGroupSel) {
      codeGroupSel.onchange = () => this.updateAlarmCodeOptions();
    }
  },

  onCounterChange() {
    // Counter type must be quantitative
    const cb = document.getElementById('mpFormIsCounter');
    const type = document.getElementById('mpFormType')?.value;
    if (cb && cb.checked && type !== 'QTY') {
      toast('计数器类型必须是定量测量点，请先选择"定量"类型');
      cb.checked = false;
    }
  },

  fillForm(mp) {
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    setVal('mpFormCode', mp.code);
    setVal('mpFormName', mp.name);
    setVal('mpFormEquipment', mp.equipmentId);
    setVal('mpFormType', mp.type);
    setVal('mpFormStatus', mp.status);
    setVal('mpFormRemark', mp.remark || '');

    // Trigger type change to show correct config
    this.onTypeChange();

    if (mp.type === 'QTY') {
      setVal('mpFormUnit', mp.unit);
      setVal('mpFormUpper', mp.upperLimit);
      setVal('mpFormLower', mp.lowerLimit);
      const alarmCb = document.getElementById('mpFormAlarm');
      if (alarmCb) alarmCb.checked = mp.alarmEnabled;
    } else if (mp.type === 'QLTY') {
      setVal('mpFormCodeGroup', mp.qualitativeCodeGroup);
      setTimeout(() => {
        this.updateAlarmCodeOptions();
        const alarmCodes = (mp.alarmCodes || '').split(',').filter(Boolean);
        document.querySelectorAll('.mp-alarm-code-cb').forEach(cb => {
          cb.checked = alarmCodes.includes(cb.value);
        });
      }, 100);
    }

    const counterCb = document.getElementById('mpFormIsCounter');
    if (counterCb) counterCb.checked = mp.isCounter;
    if (mp.isCounter) {
      setVal('mpFormInitCounter', mp.initialCounter);
      setVal('mpFormYearly', mp.yearlyEstimate);
    }
  },

  savePoint(id) {
    const isEdit = !!id;
    const code = document.getElementById('mpFormCode')?.value.trim();
    const name = document.getElementById('mpFormName')?.value.trim();
    const equipmentId = document.getElementById('mpFormEquipment')?.value;
    const type = document.getElementById('mpFormType')?.value;
    const status = document.getElementById('mpFormStatus')?.value;
    const remark = document.getElementById('mpFormRemark')?.value || '';

    // Validation
    if (!code) return toast('请输入测量点编码');
    if (!name) return toast('请输入测量点名称');
    if (!equipmentId) return toast('请选择所属设备');
    if (!type) return toast('请选择测量点类型');

    // Check duplicate code
    const dup = measurementPointData.find(mp => mp.code === code && mp.id !== id);
    if (dup) return toast('测量点编码已存在，请使用其他编码');

    // Check duplicate name within same equipment
    const dupName = measurementPointData.find(mp => mp.equipmentId === equipmentId && mp.name === name && mp.id !== id);
    if (dupName) return toast('该设备下已存在同名测量点');

    const now = new Date().toISOString().replace('T',' ').substring(0,19);
    const equipment = equipmentData.find(e => e.id === equipmentId);

    let unit = '', upperLimit = null, lowerLimit = null, alarmEnabled = false;
    let qualitativeCodeGroup = '', alarmCodes = '';
    let isCounter = false, initialCounter = null, yearlyEstimate = null;

    if (type === 'QTY') {
      unit = document.getElementById('mpFormUnit')?.value || '';
      if (!unit) return toast('定量类型必须选择单位');
      const upperStr = document.getElementById('mpFormUpper')?.value;
      const lowerStr = document.getElementById('mpFormLower')?.value;
      upperLimit = upperStr ? parseFloat(upperStr) : null;
      lowerLimit = lowerStr ? parseFloat(lowerStr) : null;
      alarmEnabled = document.getElementById('mpFormAlarm')?.checked || false;
    } else if (type === 'QLTY') {
      qualitativeCodeGroup = document.getElementById('mpFormCodeGroup')?.value || '';
      if (!qualitativeCodeGroup) return toast('定性类型必须选择代码组');
      const checked = document.querySelectorAll('.mp-alarm-code-cb:checked');
      alarmCodes = Array.from(checked).map(cb => cb.value).join(',');
      alarmEnabled = alarmCodes.length > 0;
    }

    // Counter config
    isCounter = document.getElementById('mpFormIsCounter')?.checked || false;
    if (isCounter && type !== 'QTY') {
      return toast('计数器类型必须是定量测量点');
    }
    if (isCounter) {
      const initStr = document.getElementById('mpFormInitCounter')?.value;
      const yearStr = document.getElementById('mpFormYearly')?.value;
      initialCounter = initStr ? parseFloat(initStr) : null;
      yearlyEstimate = yearStr ? parseFloat(yearStr) : null;
    }

    if (isEdit) {
      const idx = measurementPointData.findIndex(mp => mp.id === id);
      if (idx >= 0) {
        measurementPointData[idx] = {
          ...measurementPointData[idx],
          name, equipmentId,
          equipmentCode: equipment ? equipment.code : measurementPointData[idx].equipmentCode,
          equipmentName: equipment ? equipment.name : measurementPointData[idx].equipmentName,
          type, typeName: type === 'QTY' ? '定量' : '定性',
          unit, upperLimit, lowerLimit, alarmEnabled,
          qualitativeCodeGroup, alarmCodes,
          isCounter, initialCounter, yearlyEstimate,
          status, statusName: status === 'active' ? '启用' : '停用',
          remark, updatedAt: now
        };
      }
    } else {
      const newId = 'MP' + String(measurementPointData.length + 1).padStart(3, '0');
      measurementPointData.push({
        id: newId, code, name, equipmentId,
        equipmentCode: equipment ? equipment.code : '',
        equipmentName: equipment ? equipment.name : '',
        bomComponentId: '', bomComponentName: '设备整体',
        type, typeName: type === 'QTY' ? '定量' : '定性',
        unit, upperLimit, lowerLimit, alarmEnabled,
        qualitativeCodeGroup, alarmCodes,
        isCounter, initialCounter, yearlyEstimate,
        status, statusName: status === 'active' ? '启用' : '停用',
        remark, createdBy: '当前用户', createdAt: now, updatedAt: now
      });
    }

    closeModal();
    this.doFilter();
    toast(isEdit ? '测量点已更新' : '测量点已创建');
  },

  toggleStatus(id) {
    const mp = measurementPointData.find(p => p.id === id);
    if (!mp) return;
    const newStatus = mp.status === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'active' ? '启用' : '停用';
    showModal(`确认${actionText}`, `<p style="font-size:14px;">确定要${actionText}测量点「${esc(mp.name)}」吗？</p>`, [
      { text:'取消', cls:'btn-secondary', action:closeModal },
      { text:'确认', cls:'btn-primary', action:() => {
        mp.status = newStatus;
        mp.statusName = newStatus === 'active' ? '启用' : '停用';
        mp.updatedAt = new Date().toISOString().replace('T',' ').substring(0,19);
        closeModal();
        this.doFilter();
        toast(`测量点已${actionText}`);
      }}
    ]);
  },

  deletePoint(id) {
    const mp = measurementPointData.find(p => p.id === id);
    if (!mp) return;
    const hasRecords = measurementRecordData.some(r => r.measurementPointId === id);
    if (hasRecords) return toast('该测量点已产生测量记录，不可删除');
    showModal('确认删除', `<p style="font-size:14px;color:var(--danger);">确定要删除测量点「${esc(mp.name)}」吗？此操作不可恢复。</p>`, [
      { text:'取消', cls:'btn-secondary', action:closeModal },
      { text:'确认删除', cls:'btn-primary', action:() => {
        const idx = measurementPointData.findIndex(p => p.id === id);
        if (idx >= 0) measurementPointData.splice(idx, 1);
        closeModal();
        this.doFilter();
        toast('测量点已删除');
      }}
    ]);
  },

  setupEvents() {
    // Any additional event listeners
  },

  // Called from equipment master to jump to specific equipment's measurement points
  showForEquipment(equipmentId) {
    this.currentEquipmentId = equipmentId;
    const eq = equipmentData.find(e => e.id === equipmentId);
    this.currentEquipmentName = eq ? eq.name : '';
    this.filteredData = measurementPointData.filter(mp => mp.equipmentId === equipmentId);
    this.currentPage = 1;
    this.renderFilterBar();
    this.renderTable();
  }
};

// ===== 测量数据记录模块 (动态业务数据) =====
// 左侧菜单：测量数据记录 → 录入 / 历史查询 / 批量导入
const MeasurementRecord = {
  activeTab: 'entry', // entry | history | import
  selectedEquipmentId: '',
  filteredRecords: [],
  pageSize: 10,
  currentPage: 1,

  // 自动通知单生成配置（PRD §7）
  _autoNotifyConfig: {
    dedupWindowMinutes: 60, // 防重复时间窗口（分钟）
    qtyOverPriority: '1-高',   // 定量超限默认优先级
    qltyAlarmPriority: '2-中', // 定性报警默认优先级
    creatorId: '系统自动'      // 创建人标识
  },

  /* ===== 自动通知单生成（PRD §2~§3）=====
   * 返回值：{ action:'created'|'appended'|'skipped', QMNUM, id }
   */
  _tryAutoCreateNotify(mp, eq, quantitativeValue, qualitativeValue, recordId, recordTime, operator) {
    const cfg = this._autoNotifyConfig;
    const now = new Date();
    const nowStr = now.toLocaleString('zh-CN');

    // 1) 确定超限方向/报警代码
    let alertType = '';    // 'upper_limit' | 'lower_limit' | 'qualitative_alarm'
    let alertCode = '';    // 定性报警代码
    let priority = '';
    let descPart = '';     // 用于通知单描述

    if (mp.type === 'QTY') {
      if (mp.upperLimit !== null && quantitativeValue > mp.upperLimit) {
        alertType = 'upper_limit';
        alertCode = 'UPPER';
        priority = cfg.qtyOverPriority;
        descPart = `读数 ${quantitativeValue}${mp.unit} 超出 [上限] ${mp.upperLimit}${mp.unit}`;
      } else if (mp.lowerLimit !== null && quantitativeValue < mp.lowerLimit) {
        alertType = 'lower_limit';
        alertCode = 'LOWER';
        priority = cfg.qtyOverPriority;
        descPart = `读数 ${quantitativeValue}${mp.unit} 低于 [下限] ${mp.lowerLimit}${mp.unit}`;
      } else {
        return { action: 'skipped' };
      }
    } else if (mp.type === 'QLTY') {
      const alarmCodes = (mp.alarmCodes || '').split(',').filter(Boolean);
      if (!alarmCodes.includes(qualitativeValue)) return { action: 'skipped' };
      alertType = 'qualitative_alarm';
      alertCode = qualitativeValue;
      priority = cfg.qltyAlarmPriority;
      const group = qualitativeCodeGroups[mp.qualitativeCodeGroup];
      const label = group ? group.labels[group.codes.indexOf(qualitativeValue)] : qualitativeValue;
      descPart = `状态报警：巡检记录为"${label}"`;
    } else {
      return { action: 'skipped' };
    }

    // 2) 防重复检查：同一测量点 + 同一方向/代码 + 时间窗口内 + 状态CRTE/ORDP
    const windowCutoff = new Date(now.getTime() - cfg.dedupWindowMinutes * 60 * 1000);
    const dupNotify = notificationV2Data.find(n => {
      // 必须是 M1 类型、自动生成、且状态未关闭
      if (n.QMART !== 'M1') return false;
      if (n.createdBy !== cfg.creatorId) return false;
      if (n.STAT !== 'CRTE' && n.STAT !== 'ORDP') return false;
      // 检查是否已关联相同设备+测量点+方向
      if (n.EQUNR !== eq.code) return false;
      // 在长文本中搜索匹配标记
      const tagKey = `[MP:${mp.id}|${alertType}|${alertCode}]`;
      if (!n.FENAM || !n.FENAM.includes(tagKey)) return false;
      // 检查时间窗口
      const notifTime = new Date(n.createdAt);
      return notifTime >= windowCutoff;
    });

    if (dupNotify) {
      // 3a) 重复 → 追加读数到已有通知单
      const appendText = `\n[${recordTime}] [凭证:${recordId}] [${operator}] ${descPart}`;
      dupNotify.FENAM += appendText;
      dupNotify.updatedAt = nowStr;
      return { action: 'appended', QMNUM: dupNotify.QMNUM, id: dupNotify.id };
    }

    // 3b) 不重复 → 创建新通知单
    const maxNum = notificationV2Data.reduce((max, n) => {
      const num = parseInt(n.QMNUM.replace('N', ''));
      return num > max ? num : max;
    }, 0);
    const newQMNUM = 'N' + String(maxNum + 1).padStart(7, '0');
    const newId = 'NOTIF' + String(notificationV2Data.length + 1).padStart(3, '0');

    const tagKey = `[MP:${mp.id}|${alertType}|${alertCode}]`;
    const shortDesc = `[${mp.name}] ${descPart}`;
    const fullDesc = `【测量点超限自动生成通知单】\n${tagKey}\n设备：${eq.name} (${eq.code})\n测量点：${mp.name} (${mp.code})\n阈值：${mp.upperLimit !== null ? '上限 ' + mp.upperLimit + mp.unit : ''}${mp.lowerLimit !== null ? (mp.upperLimit !== null ? ' / ' : '') + '下限 ' + mp.lowerLimit + mp.unit : ''}${mp.type === 'QLTY' ? '报警代码：' + (mp.alarmCodes || '') : ''}\n实际值：${mp.type === 'QTY' ? quantitativeValue + mp.unit : qualitativeValue}\n测量凭证：${recordId}\n测量时间：${recordTime}\n测量人：${operator}`;

    notificationV2Data.push({
      id: newId, QMNUM: newQMNUM, QMART: 'M1', QMART_TXT: 'M1 - 故障报告',
      EQUNR: eq.code, EQKTX: eq.name,
      FENAM: fullDesc + '\n---\n[摘要] ' + shortDesc,
      PRIOK: priority, STAT: 'CRTE', STAT_TXT: '待处理',
      QMNAM: operator || cfg.creatorId, QMDAT: nowStr,
      relatedOrder: '', closeReason: '', attachments: [],
      expectedDate: '', background: '',
      createdBy: cfg.creatorId, createdAt: nowStr, updatedAt: nowStr,
      // 扩展字段：关联测量凭证
      measurementPointId: mp.id, measurementPointCode: mp.code,
      triggerRecordId: recordId, triggerAlertType: alertType, triggerAlertCode: alertCode
    });

    return { action: 'created', QMNUM: newQMNUM, id: newId };
  },

  init() {
    this.activeTab = 'entry';
    this.selectedEquipmentId = '';
    this.filteredRecords = [...measurementRecordData];
    this.pageSize = 10;
    this.currentPage = 1;
    this.renderTabs();
    this.switchTab('entry');
  },

  render() {
    return `<div class="eq-master" style="height:calc(100vh - 56px);display:flex;flex-direction:column;">
      <div style="background:white;border-bottom:1px solid var(--border);padding:12px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:14px;font-weight:600;">测量数据记录</span>
          <span style="font-size:12px;color:var(--text-muted);">动态业务数据</span>
        </div>
        <div id="mrAlertSummary" style="display:flex;gap:12px;align-items:center;"></div>
      </div>
      <div class="tabs" id="mrTabs" style="padding:0 20px;background:white;flex-shrink:0;"></div>
      <div id="mrContent" style="flex:1;overflow:auto;padding:20px;background:var(--bg);"></div>
    </div>`;
  },

  renderTabs() {
    const el = document.getElementById('mrTabs');
    if (!el) return;
    el.innerHTML = `
      <div class="tab ${this.activeTab === 'entry' ? 'active' : ''}" onclick="MeasurementRecord.switchTab('entry')">📝 录入测量数据</div>
      <div class="tab ${this.activeTab === 'history' ? 'active' : ''}" onclick="MeasurementRecord.switchTab('history')">📊 历史查询与趋势</div>
      <div class="tab ${this.activeTab === 'import' ? 'active' : ''}" onclick="MeasurementRecord.switchTab('import')">📥 批量导入</div>
    `;
    this.renderAlertSummary();
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.renderTabs();
    const container = document.getElementById('mrContent');
    if (!container) return;
    switch (tab) {
      case 'entry': container.innerHTML = this.renderEntryPage(); this.initEntryPage(); break;
      case 'history': container.innerHTML = this.renderHistoryPage(); this.initHistoryPage(); break;
      case 'import': container.innerHTML = this.renderImportPage(); break;
    }
  },

  renderAlertSummary() {
    const el = document.getElementById('mrAlertSummary');
    if (!el) return;
    const pending = alertEventData.filter(a => a.status === 'pending').length;
    el.innerHTML = pending > 0
      ? `<span class="badge badge-red">⚠ ${pending} 条待处理异常事件</span>
         <button class="btn btn-sm btn-outline" onclick="MeasurementRecord.showAlerts()">查看</button>`
      : '<span style="font-size:12px;color:var(--text-muted);">✓ 无待处理异常</span>';
  },

  // ========== 录入测量数据 ==========
  renderEntryPage() {
    const eqOpts = equipmentData.map(eq => `<option value="${eq.id}">${esc(eq.name)} (${esc(eq.code)})</option>`).join('');
    return `
      <div style="max-width:900px;margin:0 auto;">
        <div style="background:white;border-radius:var(--radius-lg);box-shadow:var(--shadow);padding:20px;margin-bottom:20px;">
          <div style="font-size:14px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
            <span>📝 选择设备</span>
          </div>
          <div style="display:flex;gap:12px;align-items:flex-end;">
            <div class="form-group" style="flex:1;">
              <label>设备</label>
              <select id="mrEntryEquipment" onchange="MeasurementRecord.onEquipmentSelect()" style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:13px;">
                <option value="">请选择设备（或扫码）</option>
                ${eqOpts}
              </select>
            </div>
            <button class="btn btn-outline btn-sm" style="height:38px;" onclick="toast('扫码功能开发中')">📷 扫码</button>
            <button class="btn btn-outline btn-sm" style="height:38px;" onclick="toast('NFC功能开发中')">📡 NFC</button>
          </div>
        </div>
        <div id="mrEntryPoints" style="background:white;border-radius:var(--radius-lg);box-shadow:var(--shadow);padding:20px;">
          <div style="text-align:center;padding:40px;color:var(--text-muted);">请先选择设备</div>
        </div>
      </div>`;
  },

  initEntryPage() {
    if (this.selectedEquipmentId) {
      document.getElementById('mrEntryEquipment').value = this.selectedEquipmentId;
      this.onEquipmentSelect();
    }
  },

  onEquipmentSelect() {
    const eqId = document.getElementById('mrEntryEquipment')?.value;
    this.selectedEquipmentId = eqId;
    const container = document.getElementById('mrEntryPoints');
    if (!container) return;

    if (!eqId) {
      container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">请先选择设备</div>';
      return;
    }

    const eq = equipmentData.find(e => e.id === eqId);
    const points = measurementPointData.filter(mp => mp.equipmentId === eqId && mp.status === 'active');

    if (points.length === 0) {
      container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);">
        设备「${esc(eq.name)}」暂无已启用的测量点<br>
        <a href="javascript:void(0)" onclick="App.navigateTo('main-data','equipment','measurement-point','测量点定义')" style="color:var(--primary-lighter);margin-top:8px;display:inline-block;">→ 前往定义测量点</a>
      </div>`;
      return;
    }

    // Get latest readings for each point
    const getLatestRecord = (mpId) => {
      const records = measurementRecordData.filter(r => r.measurementPointId === mpId).sort((a,b) => b.recordTime.localeCompare(a.recordTime));
      return records[0] || null;
    };

    const now = new Date();
    const timeStr = now.toISOString().substring(0,16);

    container.innerHTML = `
      <div style="font-size:14px;font-weight:700;margin-bottom:16px;">
        📋 ${esc(eq.name)} — 测量点录入（共 ${points.length} 个启用测量点）
      </div>
      <div style="margin-bottom:12px;display:flex;gap:12px;align-items:center;">
        <div class="form-group"><label>测量时间</label><input type="datetime-local" id="mrRecordTime" value="${timeStr}" style="padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:13px;"></div>
        <div class="form-group"><label>测量人</label><input type="text" id="mrOperator" value="王工" style="padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:13px;"></div>
      </div>
      <table class="data-table" style="min-width:auto;">
        <thead><tr>
          <th style="width:40px;">#</th>
          <th>测量点</th>
          <th>类型</th>
          <th>上次读数</th>
          <th style="width:200px;">本次读数</th>
          <th>阈值</th>
          <th style="width:200px;">备注</th>
        </tr></thead>
        <tbody>
          ${points.map((mp, i) => {
            const latest = getLatestRecord(mp.id);
            let lastReading = '—';
            if (latest) {
              if (mp.type === 'QTY') lastReading = latest.quantitativeValue + ' ' + mp.unit;
              else lastReading = latest.qualitativeValue;
            }
            const thresholdStr = mp.alarmEnabled
              ? (mp.lowerLimit !== null && mp.upperLimit !== null ? `${mp.lowerLimit} ~ ${mp.upperLimit} ${mp.unit}`
                : mp.upperLimit !== null ? `≤ ${mp.upperLimit} ${mp.unit}`
                : mp.lowerLimit !== null ? `≥ ${mp.lowerLimit} ${mp.unit}` : '—')
              : '未启用';

            let inputHtml = '';
            if (mp.type === 'QTY') {
              inputHtml = `<div style="display:flex;align-items:center;gap:4px;">
                <input type="number" id="mrVal_${mp.id}" step="any" style="width:120px;padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:13px;" placeholder="输入读数">
                <span style="font-size:12px;color:var(--text-muted);">${mp.unit}</span>
              </div>`;
            } else {
              const group = qualitativeCodeGroups[mp.qualitativeCodeGroup];
              if (group) {
                inputHtml = `<select id="mrVal_${mp.id}" style="width:120px;padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:13px;">
                  <option value="">请选择</option>
                  ${group.codes.map((code, j) => `<option value="${code}">${group.labels[j]}</option>`).join('')}
                </select>`;
              }
            }

            return `<tr>
              <td>${i + 1}</td>
              <td><b>${esc(mp.name)}</b><br><span style="font-size:11px;color:var(--text-muted);">${esc(mp.code)}</span></td>
              <td>${mp.type === 'QTY' ? '<span class="badge badge-blue badge-sm">定量</span>' : '<span class="badge badge-purple badge-sm">定性</span>'}</td>
              <td style="font-size:12px;color:var(--text-secondary);">${lastReading}</td>
              <td>${inputHtml}</td>
              <td style="font-size:11px;color:var(--text-secondary);">${thresholdStr}</td>
              <td><input type="text" id="mrRemark_${mp.id}" style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:13px;" placeholder="备注"></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;">
        <span style="font-size:12px;color:var(--text-muted);">提示：保存后系统将自动进行阈值校验，超标项自动生成 M1 通知单</span>
        <button class="btn btn-primary" onclick="MeasurementRecord.submitRecords()">💾 保存全部测量数据</button>
      </div>`;
  },

  submitRecords() {
    const eqId = this.selectedEquipmentId;
    if (!eqId) return toast('请先选择设备');

    const points = measurementPointData.filter(mp => mp.equipmentId === eqId && mp.status === 'active');
    const recordTime = document.getElementById('mrRecordTime')?.value || new Date().toISOString().substring(0,19);
    const operator = document.getElementById('mrOperator')?.value || '';

    if (!recordTime) return toast('请选择测量时间');

    let savedCount = 0;
    let alertCount = 0;
    const now = new Date().toISOString().replace('T',' ').substring(0,19);

    points.forEach(mp => {
      const valEl = document.getElementById('mrVal_' + mp.id);
      const remarkEl = document.getElementById('mrRemark_' + mp.id);
      if (!valEl) return;

      let quantitativeValue = null;
      let qualitativeValue = '';

      if (mp.type === 'QTY') {
        const rawVal = valEl.value.trim();
        if (rawVal === '') return; // Skip empty
        quantitativeValue = parseFloat(rawVal);
        if (isNaN(quantitativeValue)) return;
      } else {
        qualitativeValue = valEl.value;
        if (!qualitativeValue) return; // Skip empty
      }

      const remark = remarkEl ? remarkEl.value : '';

      // Create record
      const recordId = 'MR' + String(measurementRecordData.length + 1).padStart(3, '0');
      measurementRecordData.push({
        id: recordId, measurementPointId: mp.id, equipmentId: eqId,
        recordTime, quantitativeValue, qualitativeValue, operator, remark,
        createdAt: now
      });
      savedCount++;

      // Check threshold alarm
      if (mp.alarmEnabled) {
        let triggered = false;
        let desc = '';

        if (mp.type === 'QTY') {
          if (mp.upperLimit !== null && quantitativeValue > mp.upperLimit) {
            triggered = true;
            desc = `${mp.name} 超标：${quantitativeValue}${mp.unit} > 上限 ${mp.upperLimit}${mp.unit}`;
          } else if (mp.lowerLimit !== null && quantitativeValue < mp.lowerLimit) {
            triggered = true;
            desc = `${mp.name} 低于下限：${quantitativeValue}${mp.unit} < 下限 ${mp.lowerLimit}${mp.unit}`;
          }
        } else if (mp.type === 'QLTY') {
          const alarmCodes = (mp.alarmCodes || '').split(',').filter(Boolean);
          if (alarmCodes.includes(qualitativeValue)) {
            triggered = true;
            const group = qualitativeCodeGroups[mp.qualitativeCodeGroup];
            const label = group ? group.labels[group.codes.indexOf(qualitativeValue)] : qualitativeValue;
            desc = `${mp.name} 状态异常：巡检记录为"${label}"`;
          }
        }

        if (triggered) {
          alertCount++;
          alertEventData.push({
            id: 'AE' + String(alertEventData.length + 1).padStart(3, '0'),
            equipmentId: eqId, measurementPointId: mp.id, recordId,
            alertType: mp.type === 'QTY' ? 'upper_limit' : 'qualitative_alarm',
            description: desc, status: 'pending', statusName: '待处理',
            createdAt: now, handler: ''
          });

          // PRD §2~§3: 自动生成 M1 通知单（含防重复）
          const eq = equipmentData.find(e => e.id === eqId);
          if (eq) {
            const notifResult = this._tryAutoCreateNotify(mp, eq, quantitativeValue, qualitativeValue, recordId, recordTime, operator);
            if (!this._autoNotifResults) this._autoNotifResults = [];
            this._autoNotifResults.push(notifResult);
          }

          // Also add to App notifications
          if (window.App && App.notifications) {
            App.notifications.unshift({
              id: Date.now(),
              type: 'warn',
              icon: '⚠',
              title: desc,
              desc: '设备：' + (equipmentData.find(e=>e.id===eqId)?.name||'') + '，操作人：' + operator,
              time: recordTime.substring(0,16),
              read: false
            });
            App._updateNotifyBadge();
          }
        }
      }

      // Handle counter update
      if (mp.isCounter && mp.type === 'QTY' && quantitativeValue !== null) {
        // Counter logic: calculate increment and update
        const previousRecords = measurementRecordData
          .filter(r => r.measurementPointId === mp.id && r.id !== recordId)
          .sort((a,b) => b.recordTime.localeCompare(a.recordTime));
        if (previousRecords.length > 0) {
          const lastCounterVal = previousRecords[0].quantitativeValue;
          if (lastCounterVal !== null && quantitativeValue > lastCounterVal) {
            const increment = quantitativeValue - lastCounterVal;
            // In real system, update accumulated counter value
          }
        }
      }
    });

    if (savedCount === 0) {
      return toast('请至少录入一个测量点的数据');
    }

    let msg = `已保存 ${savedCount} 条测量记录`;
    if (alertCount > 0) {
      msg += `，生成 ${alertCount} 条异常事件`;
    }
    // 汇总自动通知单生成结果
    if (this._autoNotifResults && this._autoNotifResults.length > 0) {
      const created = this._autoNotifResults.filter(r => r.action === 'created');
      const appended = this._autoNotifResults.filter(r => r.action === 'appended');
      if (created.length > 0) {
        msg += `\\n📋 已生成 ${created.length} 条通知单：${created.map(r => r.QMNUM).join('、')}（优先级：高）`;
      }
      if (appended.length > 0) {
        msg += `\\n📎 已追加到 ${appended.length} 条已有通知单：${appended.map(r => r.QMNUM).join('、')}`;
      }
    }
    toast(msg);
    this._autoNotifResults = null;

    // Refresh
    this.renderAlertSummary();
    this.onEquipmentSelect();
  },

  // ========== 历史查询与趋势分析 ==========
  renderHistoryPage() {
    const eqOpts = equipmentData.map(eq => `<option value="${eq.id}">${esc(eq.name)} (${esc(eq.code)})</option>`).join('');
    return `
      <div style="max-width:1300px;margin:0 auto;">
        <!-- Filter -->
        <div style="background:white;border-radius:var(--radius-lg);box-shadow:var(--shadow);padding:16px 20px;margin-bottom:16px;">
          <div class="filter-bar" style="padding:0;border:none;background:transparent;">
            <div class="filter-group"><label>设备</label><select id="mrHistEquipment" onchange="MeasurementRecord.doHistoryFilter()">
              <option value="">全部</option>${eqOpts}
            </select></div>
            <div class="filter-group"><label>测量点</label><select id="mrHistPoint" onchange="MeasurementRecord.doHistoryFilter()">
              <option value="">全部</option>
              ${measurementPointData.filter(mp=>mp.status==='active').map(mp=>`<option value="${mp.id}">${esc(mp.name)} (${esc(mp.code)})</option>`).join('')}
            </select></div>
            <div class="filter-group"><label>开始时间</label><input type="date" id="mrHistStart" onchange="MeasurementRecord.doHistoryFilter()"></div>
            <div class="filter-group"><label>结束时间</label><input type="date" id="mrHistEnd" onchange="MeasurementRecord.doHistoryFilter()"></div>
            <div class="filter-group"><label>测量人</label><input type="text" id="mrHistOperator" placeholder="输入测量人" onkeyup="MeasurementRecord.doHistoryFilter()"></div>
            <div class="filter-actions">
              <button class="btn btn-secondary btn-sm" onclick="MeasurementRecord.resetHistoryFilter()">重置</button>
              <button class="btn btn-outline btn-sm" onclick="MeasurementRecord.exportHistory()">📥 导出Excel</button>
            </div>
          </div>
        </div>

        <!-- Trend Chart Area -->
        <div id="mrTrendChart" style="background:white;border-radius:var(--radius-lg);box-shadow:var(--shadow);padding:20px;margin-bottom:16px;display:none;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <span style="font-size:14px;font-weight:700;">📈 趋势曲线</span>
            <button class="btn btn-sm btn-outline" onclick="document.getElementById('mrTrendChart').style.display='none'">关闭</button>
          </div>
          <div id="mrChartContainer" style="height:300px;position:relative;"></div>
        </div>

        <!-- Records Table -->
        <div id="mrHistTable" style="background:white;border-radius:var(--radius-lg);box-shadow:var(--shadow);padding:0 0 20px 0;overflow:hidden;"></div>
      </div>`;
  },

  initHistoryPage() {
    this.filteredRecords = [...measurementRecordData];
    this.currentPage = 1;
    this.renderHistoryTable();
  },

  doHistoryFilter() {
    const eqId = document.getElementById('mrHistEquipment')?.value || '';
    const mpId = document.getElementById('mrHistPoint')?.value || '';
    const startDate = document.getElementById('mrHistStart')?.value || '';
    const endDate = document.getElementById('mrHistEnd')?.value || '';
    const operator = (document.getElementById('mrHistOperator')?.value || '').toLowerCase();

    this.filteredRecords = measurementRecordData.filter(r => {
      if (eqId && r.equipmentId !== eqId) return false;
      if (mpId && r.measurementPointId !== mpId) return false;
      if (startDate && r.recordTime < startDate) return false;
      if (endDate && r.recordTime > endDate + 'T23:59:59') return false;
      if (operator && !r.operator.toLowerCase().includes(operator)) return false;
      return true;
    });
    this.currentPage = 1;
    this.renderHistoryTable();
  },

  resetHistoryFilter() {
    const els = ['mrHistEquipment','mrHistPoint','mrHistStart','mrHistEnd','mrHistOperator'];
    els.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    this.filteredRecords = [...measurementRecordData];
    this.currentPage = 1;
    this.renderHistoryTable();
  },

  renderHistoryTable() {
    const container = document.getElementById('mrHistTable');
    if (!container) return;

    const total = this.filteredRecords.length;
    const pages = Math.ceil(total / this.pageSize);
    if (this.currentPage > pages) this.currentPage = Math.max(1, pages);
    const start = (this.currentPage - 1) * this.pageSize;
    const pageData = this.filteredRecords.slice(start, start + this.pageSize);

    let html = `<div class="list-toolbar" style="border-bottom:1px solid var(--border);">
      <div class="list-info"><span class="list-count">共 <b>${total}</b> 条测量记录</span></div>
      <button class="btn btn-outline btn-sm" onclick="MeasurementRecord.showTrendChart()">📈 趋势图</button>
    </div>
    <div class="table-wrapper" style="max-height:calc(100vh - 460px);">
    <table class="data-table">
      <thead><tr>
        <th>记录时间</th><th>设备</th><th>测量点</th><th>类型</th><th>读数</th><th>测量人</th><th>是否超标</th><th>备注</th>
      </tr></thead>
      <tbody>`;

    if (pageData.length === 0) {
      html += `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-muted);">暂无测量记录</td></tr>`;
    } else {
      pageData.forEach(r => {
        const mp = measurementPointData.find(p => p.id === r.measurementPointId);
        const eq = equipmentData.find(e => e.id === r.equipmentId);
        if (!mp) return;

        let readingStr = '';
        let isAlert = false;

        if (mp.type === 'QTY') {
          readingStr = r.quantitativeValue + ' ' + mp.unit;
          if (mp.alarmEnabled) {
            if (mp.upperLimit !== null && r.quantitativeValue > mp.upperLimit) isAlert = true;
            if (mp.lowerLimit !== null && r.quantitativeValue < mp.lowerLimit) isAlert = true;
          }
        } else {
          const group = qualitativeCodeGroups[mp.qualitativeCodeGroup];
          const label = group ? group.labels[group.codes.indexOf(r.qualitativeValue)] : r.qualitativeValue;
          readingStr = label || r.qualitativeValue || '—';
          if (mp.alarmEnabled && mp.alarmCodes) {
            const codes = mp.alarmCodes.split(',').filter(Boolean);
            if (codes.includes(r.qualitativeValue)) isAlert = true;
          }
        }

        html += `<tr style="${isAlert ? 'background:#fef2f2;' : ''}">
          <td style="font-size:12px;">${r.recordTime}</td>
          <td>${esc(eq?.name || r.equipmentId)}</td>
          <td><b>${esc(mp.name)}</b><br><span style="font-size:11px;color:var(--text-muted);">${esc(mp.code)}</span></td>
          <td>${mp.type === 'QTY' ? '<span class="badge badge-blue badge-sm">定量</span>' : '<span class="badge badge-purple badge-sm">定性</span>'}</td>
          <td style="font-weight:600;${isAlert ? 'color:var(--danger);' : ''}">${readingStr}</td>
          <td>${esc(r.operator)}</td>
          <td>${isAlert ? '<span class="badge badge-red badge-sm">⚠ 超标</span>' : '<span class="badge badge-green badge-sm">✓ 正常</span>'}</td>
          <td style="font-size:12px;color:var(--text-secondary);max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(r.remark||'')}">${esc(r.remark || '—')}</td>
        </tr>`;
      });
    }
    html += `</tbody></table></div>`;

    // Pagination
    if (total > this.pageSize) {
      let pageHtml = '';
      const maxBtns = 7;
      let startP = Math.max(1, this.currentPage - Math.floor(maxBtns / 2));
      let endP = Math.min(pages, startP + maxBtns - 1);
      if (endP - startP < maxBtns - 1) startP = Math.max(1, endP - maxBtns + 1);
      for (let i = startP; i <= endP; i++) {
        pageHtml += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" onclick="MeasurementRecord.goHistoryPage(${i})">${i}</button>`;
      }
      html += `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 20px;">
        <span class="pagination-info">第 ${this.currentPage}/${pages} 页，共 ${total} 条</span>
        <div class="pagination">
          <button class="pagination-btn" onclick="MeasurementRecord.goHistoryPage(1)" ${this.currentPage===1?'disabled':''}>«</button>
          <button class="pagination-btn" onclick="MeasurementRecord.goHistoryPage(${this.currentPage-1})" ${this.currentPage===1?'disabled':''}>‹</button>
          ${pageHtml}
          <button class="pagination-btn" onclick="MeasurementRecord.goHistoryPage(${this.currentPage+1})" ${this.currentPage===pages?'disabled':''}>›</button>
          <button class="pagination-btn" onclick="MeasurementRecord.goHistoryPage(${pages})" ${this.currentPage===pages?'disabled':''}>»</button>
        </div>
      </div>`;
    }
    container.innerHTML = html;
  },

  goHistoryPage(p) {
    const pages = Math.ceil(this.filteredRecords.length / this.pageSize);
    if (p < 1 || p > pages) return;
    this.currentPage = p;
    this.renderHistoryTable();
  },

  showTrendChart() {
    const mpId = document.getElementById('mrHistPoint')?.value;
    if (!mpId) return toast('请先选择一个测量点以查看趋势图');

    const mp = measurementPointData.find(p => p.id === mpId);
    if (!mp || mp.type !== 'QTY') return toast('趋势图仅支持定量型测量点');

    const eqId = document.getElementById('mrHistEquipment')?.value;
    let records = this.filteredRecords.filter(r => r.measurementPointId === mpId);
    if (records.length < 2) return toast('数据不足，至少需要2条记录才能生成趋势图');

    const chartArea = document.getElementById('mrTrendChart');
    if (chartArea) chartArea.style.display = 'block';

    // Draw simple SVG trend chart
    this.drawTrendChart(mp, records);
  },

  drawTrendChart(mp, records) {
    const container = document.getElementById('mrChartContainer');
    if (!container) return;

    const w = container.clientWidth || 800;
    const h = 280;
    const pad = { top: 30, right: 40, bottom: 50, left: 70 };
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top - pad.bottom;

    // Sort by time
    records.sort((a,b) => a.recordTime.localeCompare(b.recordTime));

    const values = records.map(r => r.quantitativeValue);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    const scaleY = (v) => pad.top + ch - ((v - minVal) / range) * ch;
    const scaleX = (i) => pad.left + (i / Math.max(records.length - 1, 1)) * cw;

    // Build SVG path
    let pointsStr = records.map((r, i) => `${scaleX(i).toFixed(1)},${scaleY(r.quantitativeValue).toFixed(1)}`).join(' ');

    // Threshold lines
    let upperLine = '', lowerLine = '';
    if (mp.upperLimit !== null) {
      const y = scaleY(mp.upperLimit);
      upperLine = `<line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${pad.left + cw}" y2="${y.toFixed(1)}" stroke="#dc2626" stroke-dasharray="6,3" stroke-width="1.5"/>
        <text x="${pad.left + cw + 2}" y="${y + 4}" font-size="11" fill="#dc2626">上限 ${mp.upperLimit}${mp.unit}</text>`;
    }
    if (mp.lowerLimit !== null) {
      const y = scaleY(mp.lowerLimit);
      lowerLine = `<line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${pad.left + cw}" y2="${y.toFixed(1)}" stroke="#f59e0b" stroke-dasharray="6,3" stroke-width="1.5"/>
        <text x="${pad.left + cw + 2}" y="${y + 4}" font-size="11" fill="#f59e0b">下限 ${mp.lowerLimit}${mp.unit}</text>`;
    }

    // Y axis labels
    let yLabels = '';
    for (let i = 0; i <= 4; i++) {
      const val = minVal + (range * i / 4);
      const y = scaleY(val);
      yLabels += `<text x="${pad.left - 8}" y="${y + 4}" font-size="11" fill="var(--text-muted)" text-anchor="end">${val.toFixed(1)}</text>`;
      yLabels += `<line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${pad.left + cw}" y2="${y.toFixed(1)}" stroke="#f3f4f6" stroke-width="0.5"/>`;
    }

    // X axis labels
    let xLabels = '';
    const step = Math.max(1, Math.floor(records.length / 6));
    for (let i = 0; i < records.length; i += step) {
      const x = scaleX(i);
      const label = records[i].recordTime.substring(5, 16).replace('T',' ');
      xLabels += `<text x="${x}" y="${pad.top + ch + 20}" font-size="10" fill="var(--text-muted)" text-anchor="middle">${label}</text>`;
    }

    container.innerHTML = `
      <svg width="${w}" height="${h}" style="display:block;font-family:monospace;">
        <!-- Grid -->
        ${yLabels}
        ${xLabels}
        <!-- Axes -->
        <line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + ch}" stroke="#d1d5db" stroke-width="1"/>
        <line x1="${pad.left}" y1="${pad.top + ch}" x2="${pad.left + cw}" y2="${pad.top + ch}" stroke="#d1d5db" stroke-width="1"/>
        <!-- Thresholds -->
        ${upperLine}
        ${lowerLine}
        <!-- Trend Line -->
        <polyline points="${pointsStr}" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
        <!-- Data Points -->
        ${records.map((r, i) => {
          const x = scaleX(i), y = scaleY(r.quantitativeValue);
          const isAlert = (mp.upperLimit !== null && r.quantitativeValue > mp.upperLimit) || (mp.lowerLimit !== null && r.quantitativeValue < mp.lowerLimit);
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${isAlert ? '#dc2626' : '#3B82F6'}" stroke="white" stroke-width="1.5">
            <title>${r.recordTime}: ${r.quantitativeValue}${mp.unit}</title>
          </circle>`;
        }).join('')}
      </svg>
      <div style="text-align:center;margin-top:8px;font-size:12px;color:var(--text-muted);">
        ${esc(mp.name)} 趋势图 (${records[0].recordTime.substring(0,10)} ~ ${records[records.length-1].recordTime.substring(0,10)})
      </div>`;
  },

  exportHistory() {
    if (this.filteredRecords.length === 0) return toast('无数据可导出');
    // Simple CSV export
    let csv = '\uFEFF记录时间,设备,测量点,类型,读数,测量人,备注\n';
    this.filteredRecords.forEach(r => {
      const mp = measurementPointData.find(p => p.id === r.measurementPointId);
      const eq = equipmentData.find(e => e.id === r.equipmentId);
      const reading = mp?.type === 'QTY' ? (r.quantitativeValue + ' ' + (mp?.unit||'')) : r.qualitativeValue;
      csv += `${r.recordTime},"${eq?.name||''}","${mp?.name||''}",${mp?.typeName||''},"${reading}","${r.operator}","${r.remark||''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = '测量数据记录_' + new Date().toISOString().substring(0,10) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('导出成功');
  },

  // ========== 批量导入 ==========
  renderImportPage() {
    return `
      <div style="max-width:800px;margin:0 auto;">
        <div style="background:white;border-radius:var(--radius-lg);box-shadow:var(--shadow);padding:24px;">
          <div style="font-size:14px;font-weight:700;margin-bottom:16px;">📥 批量导入测量数据</div>

          <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:var(--radius);padding:16px;margin-bottom:20px;">
            <div style="font-size:13px;font-weight:600;margin-bottom:8px;">📋 操作说明</div>
            <ol style="font-size:12px;color:var(--text-secondary);padding-left:20px;line-height:1.8;">
              <li>下载Excel模板，按模板格式填写数据</li>
              <li>模板包含列：设备编码、测量点编码、测量时间、定量值/定性值、测量人、备注</li>
              <li>导入时系统将自动进行阈值校验，超标记录将生成异常事件</li>
              <li>导入完成后系统将自动阈值校验，超限记录自动生成 M1 通知单</li>
            </ol>
          </div>

          <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;">
            <button class="btn btn-outline" onclick="MeasurementRecord.downloadTemplate()">📥 下载Excel模板</button>
            <button class="btn btn-primary" onclick="MeasurementRecord.triggerImport()">📤 选择文件导入</button>
          </div>

          <div style="border:2px dashed var(--border);border-radius:var(--radius);padding:40px;text-align:center;color:var(--text-muted);" id="mrImportDropZone">
            <div style="font-size:36px;margin-bottom:12px;">📂</div>
            <div style="font-size:14px;">拖拽文件到此处，或点击上方"选择文件导入"</div>
            <div style="font-size:12px;margin-top:8px;">支持 .xlsx / .xls / .csv 格式</div>
          </div>

          <div id="mrImportResult" style="margin-top:20px;display:none;"></div>
        </div>
      </div>`;
  },

  downloadTemplate() {
    let csv = '\uFEFF设备编码,测量点编码,测量时间,定量值,定性值,测量人,备注\n';
    // Sample data
    csv += 'EQ-F003-001,MP-P101A-001,2026-06-02 08:30,3.2,,王工,早班巡检\n';
    csv += 'EQ-F003-001,MP-P101A-002,2026-06-02 08:30,6.5,,王工,\n';
    csv += 'EQ-F003-001,MP-P101A-003,2026-06-02 08:30,,normal,王工,油质清亮\n';
    csv += 'EQ-F001-001,MP-CNC-001,2026-06-02 09:00,2.1,,张工,正常\n';

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = '测量数据导入模板.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('模板已下载');
  },

  triggerImport() {
    // Simulate file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      this.processImport(file);
    };
    input.click();
  },

  processImport(file) {
    // Simulate import processing
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(l => l.trim());

      if (lines.length < 2) {
        this.showImportResult(0, 0, ['文件为空或格式不正确']);
        return;
      }

      let success = 0, fail = 0, notifCreated = 0, notifAppended = 0;
      const errors = [];
      const notifList = [];
      const now = new Date().toISOString().replace('T',' ').substring(0,19);

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length < 5) {
          fail++;
          errors.push(`第${i+1}行：列数不足`);
          continue;
        }

        const [eqCode, mpCode, recordTime, qtyVal, qltyVal, operator, remark] = cols;
        const eq = equipmentData.find(e => e.code === eqCode);
        const mp = measurementPointData.find(p => p.code === mpCode);

        if (!eq) { fail++; errors.push(`第${i+1}行：设备编码"${eqCode}"不存在`); continue; }
        if (!mp) { fail++; errors.push(`第${i+1}行：测量点编码"${mpCode}"不存在`); continue; }

        let quantitativeValue = null, qualitativeValue = '';
        if (mp.type === 'QTY') {
          quantitativeValue = parseFloat(qtyVal);
          if (isNaN(quantitativeValue)) { fail++; errors.push(`第${i+1}行：定量值格式错误`); continue; }
        } else {
          qualitativeValue = qltyVal;
          if (!qualitativeValue) { fail++; errors.push(`第${i+1}行：定性值不能为空`); continue; }
        }

        const recordId = 'MR' + String(measurementRecordData.length + 1).padStart(3, '0');
        measurementRecordData.push({
          id: recordId, measurementPointId: mp.id, equipmentId: eq.id,
          recordTime: recordTime || now, quantitativeValue, qualitativeValue,
          operator: operator || '批量导入', remark: remark || '',
          createdAt: now
        });

        // PRD §2.1: 批量导入也触发超限判断
        if (mp.alarmEnabled) {
          const notifResult = this._tryAutoCreateNotify(mp, eq, quantitativeValue, qualitativeValue, recordId, recordTime || now, operator || '批量导入');
          if (notifResult.action === 'created') {
            notifCreated++;
            notifList.push('📋 ' + notifResult.QMNUM);
          } else if (notifResult.action === 'appended') {
            notifAppended++;
          }
        }

        success++;
      }

      this.showImportResult(success, fail, errors, notifCreated, notifAppended, notifList);
    };
    reader.readAsText(file, 'UTF-8');
  },

  showImportResult(success, fail, errors, notifCreated, notifAppended, notifList) {
    const container = document.getElementById('mrImportResult');
    if (!container) return;
    container.style.display = 'block';
    let notifHtml = '';
    if (notifCreated > 0) {
      notifHtml = `<div style="margin-top:10px;padding:8px 12px;background:#eff6ff;border-radius:6px;font-size:12px;">🔔 因测量点超限，<b style="color:#1e40af;">自动生成 ${notifCreated} 条 M1 通知单</b>：${(notifList||[]).join('、')}`;
      if (notifAppended > 0) notifHtml += `<br>📎 另有 ${notifAppended} 条记录已追加到已有通知单（防重复窗口内）`;
      notifHtml += '</div>';
    }
    container.innerHTML = `
      <div style="background:${fail > 0 ? '#fef2f2' : '#f0fdf4'};border:1px solid ${fail > 0 ? '#fecaca' : '#bbf7d0'};border-radius:var(--radius);padding:16px;">
        <div style="font-size:14px;font-weight:700;margin-bottom:8px;">
          ${fail > 0 ? '⚠' : '✓'} 导入完成：成功 <b style="color:var(--success);">${success}</b> 条，失败 <b style="color:var(--danger);">${fail}</b> 条
        </div>
        ${notifHtml}
        ${errors.length > 0 ? `
          <div style="margin-top:8px;max-height:200px;overflow-y:auto;">
            <div style="font-size:12px;font-weight:600;margin-bottom:4px;">失败明细：</div>
            ${errors.map(e => `<div style="font-size:11px;color:var(--danger);padding:2px 0;">${esc(e)}</div>`).join('')}
          </div>` : ''}
      </div>`;
  },

  showAlerts() {
    let html = `<div style="max-height:400px;overflow-y:auto;">`;
    if (alertEventData.length === 0) {
      html += '<div style="text-align:center;padding:40px;color:var(--text-muted);">无异常事件</div>';
    } else {
      html += `<table class="data-table" style="min-width:auto;">
        <thead><tr><th>时间</th><th>描述</th><th>状态</th><th>操作</th></tr></thead><tbody>`;
      alertEventData.forEach(ae => {
        const statusBadge = ae.status === 'pending'
          ? '<span class="badge badge-red badge-sm">待处理</span>'
          : '<span class="badge badge-green badge-sm">已处理</span>';
        html += `<tr>
          <td style="font-size:12px;">${ae.createdAt}</td>
          <td style="font-size:13px;">${esc(ae.description)}</td>
          <td>${statusBadge}</td>
          <td>${ae.status === 'pending'
            ? `<button class="btn btn-sm btn-success" onclick="MeasurementRecord.resolveAlert('${ae.id}')">标记已处理</button>`
            : `<span style="font-size:12px;color:var(--text-muted);">${ae.handler || '—'}</span>`}</td>
        </tr>`;
      });
      html += '</tbody></table>';
    }
    html += '</div>';
    showModal('异常事件列表', html, [
      { text:'关闭', cls:'btn-secondary', action:closeModal }
    ], 'modal-lg');
  },

  resolveAlert(id) {
    const ae = alertEventData.find(a => a.id === id);
    if (ae) {
      ae.status = 'resolved';
      ae.statusName = '已处理';
      ae.handler = '管理员';
    }
    closeModal();
    this.renderAlertSummary();
    toast('异常事件已标记为已处理');
  }
};

// ===== Spare Parts Stock Query Page =====
const SparePartsStock = {
  page: 1, pageSize: 15, filtered: [],

  render() {
    this.filtered = [...sparePartsStockData];
    this.page = 1;
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">库存查询</div><div style="font-size:13px;opacity:0.8;">实时查看备品备件库存状态</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary" style="background:rgba(255,255,255,0.15);color:white;" onclick="SparePartsStock.reset()">刷新</button>
            <button class="btn btn-blue" onclick="SparePartsStock.exportData()">+ 导出</button>
          </div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>工厂</label><select id="spFactory">
            <option value="">全部</option>
            <option value="1000">1000 (山东寿光)</option>
            <option value="2000">2000 (江苏南通)</option>
            <option value="3000">3000 (浙江台州)</option>
          </select></div>
          <div class="filter-group"><label>库位</label><select id="spStorageLoc">
            <option value="">全部</option>
            <option value="1001">1001 (综合库-成品库)</option>
            <option value="1002">1002 (综合库-原材料库)</option>
            <option value="1003">1003 (综合库-包材库)</option>
            <option value="1004">1004 (冷库-冷链库)</option>
          </select></div>
          <div class="filter-group"><label>显示类型</label><select id="spDisplayType">
            <option value="batch">显示批次库存</option>
            <option value="summary">汇总显示</option>
          </select></div>
          <div class="filter-group"><label>WBS编号</label><input type="text" id="spWbsNo" placeholder="WBS编号"></div>
          <div class="filter-group"><label>物料号</label><input type="text" id="spMatCode" placeholder="物料号"></div>
          <div class="filter-group"><label>库存类型</label><select id="spStockType">
            <option value="">全部库存</option>
            <option value="unrestricted">非限制使用</option>
            <option value="quality">质检中</option>
            <option value="blocked">冻结</option>
          </select></div>
          <div class="filter-group"><label>批次</label><input type="text" id="spBatch" placeholder="批次"></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="SparePartsStock.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="SparePartsStock.reset()">重置</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table">
            <thead><tr>
              <th>工厂</th><th>库位</th><th>物料号</th><th>物料描述</th><th>批次</th>
              <th>非限制库存</th><th>质检库存</th><th>冻结库存</th><th>单位</th>
              <th>WBS编号</th><th>特殊库存</th><th>客户</th><th>供应商</th>
              <th>供应商批次</th><th>生产日期</th><th>有效期至</th>
            </tr></thead>
            <tbody id="spTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info"><span class="list-count" id="spCount">共 ${this.filtered.length} 条</span></div>
          <div class="pagination">
            <button class="pagination-btn" id="spPrev" disabled onclick="SparePartsStock.prevPage()">‹</button>
            <span class="pagination-info" id="spPageInfo">第 1 / ${Math.ceil(this.filtered.length/this.pageSize)} 页</span>
            <button class="pagination-btn" id="spNext" onclick="SparePartsStock.nextPage()">›</button>
            <select class="page-size-select" id="spPageSizeSel" onchange="SparePartsStock.changePageSize()"><option value="15">15条</option><option value="30">30条</option><option value="50">50条</option></select>
          </div>
        </div>
      </div>`;
  },

  init() {
    this.filtered = [...sparePartsStockData];
    this.page = 1;
    this.renderTable();
  },

  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;
    document.getElementById('spCount').textContent = `共 ${this.filtered.length} 条`;
    document.getElementById('spPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('spPrev').disabled = this.page <= 1;
    document.getElementById('spNext').disabled = this.page >= totalPages;
    document.getElementById('spPageSizeSel').value = this.pageSize;

    const fmtNum = n => n != null && n !== '' ? Number(n).toLocaleString() : '';
    document.getElementById('spTableBody').innerHTML = page.map(row => `
      <tr>
        <td>${esc(row.factory)}</td>
        <td>${esc(row.storageLoc)}</td>
        <td><strong style="color:var(--primary);">${esc(row.matCode)}</strong></td>
        <td>${esc(row.matDesc)}</td>
        <td>${esc(row.batch)}</td>
        <td style="text-align:right;color:#16a34a;">${fmtNum(row.unrestrictedQty)}</td>
        <td style="text-align:right;color:#ca8a04;">${fmtNum(row.qualityQty)}</td>
        <td style="text-align:right;color:#dc2626;">${fmtNum(row.blockedQty)}</td>
        <td style="text-align:center;">${esc(row.unit)}</td>
        <td>${esc(row.wbsNo||'-')}</td>
        <td>${esc(row.specialStock||'-')}</td>
        <td>${esc(row.customer||'-')}</td>
        <td>${esc(row.vendor||'-')}</td>
        <td>${esc(row.vendorBatch||'-')}</td>
        <td style="white-space:nowrap;">${esc(row.prodDate||'-')}</td>
        <td style="white-space:nowrap;${row.isExpiringSoon ? 'color:#dc2626;font-weight:700;' : ''}">${esc(row.expiryDate||'-')}</td>
      </tr>`).join('');
  },

  search() {
    const factory = document.getElementById('spFactory').value;
    const storageLoc = document.getElementById('spStorageLoc').value;
    const wbsNo = document.getElementById('spWbsNo').value.trim();
    const matCode = document.getElementById('spMatCode').value.trim();
    const stockType = document.getElementById('spStockType').value;
    const batch = document.getElementById('spBatch').value.trim();

    this.filtered = sparePartsStockData.filter(row => {
      if (factory && row.factory !== factory) return false;
      if (storageLoc && row.storageLoc !== storageLoc) return false;
      if (wbsNo && !(row.wbsNo || '').includes(wbsNo)) return false;
      if (matCode && !row.matCode.includes(matCode)) return false;
      if (batch && !row.batch.includes(batch)) return false;
      // Stock type filter
      if (stockType === 'unrestricted' && (!row.unrestrictedQty || row.unrestrictedQty <= 0)) return false;
      if (stockType === 'quality' && (!row.qualityQty || row.qualityQty <= 0)) return false;
      if (stockType === 'blocked' && (!row.blockedQty || row.blockedQty <= 0)) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
  },

  reset() {
    document.getElementById('spFactory').value = '';
    document.getElementById('spStorageLoc').value = '';
    document.getElementById('spDisplayType').value = 'batch';
    document.getElementById('spWbsNo').value = '';
    document.getElementById('spMatCode').value = '';
    document.getElementById('spStockType').value = '';
    document.getElementById('spBatch').value = '';
    this.filtered = [...sparePartsStockData];
    this.page = 1;
    this.renderTable();
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() { if (this.page < Math.ceil(this.filtered.length/this.pageSize)) { this.page++; this.renderTable(); } },
  changePageSize() { this.pageSize = parseInt(document.getElementById('spPageSizeSel').value); this.page = 1; this.renderTable(); },

  exportData() {
    toast('数据导出功能开发中...');
  }
};

// ===== Demo Data for Spare Parts Stock =====
const sparePartsStockData = [
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260304', unrestrictedQty:23280, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-10', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260305', unrestrictedQty:40800, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-19', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260305H', unrestrictedQty:120, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-10', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260306', unrestrictedQty:41160, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-25', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260307', unrestrictedQty:40680, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-26', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260308', unrestrictedQty:40800, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-28', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260308H', unrestrictedQty:120, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-03-26', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260401', unrestrictedQty:40920, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-04-07', expiryDate:'2028-03', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260402', unrestrictedQty:40680, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-04-08', expiryDate:'2028-03', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000009', matDesc:'腎石利通片-0.45g*5*2板/盒', batch:'260403', unrestrictedQty:40800, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'', vendorBatch:'', prodDate:'2026-04-09', expiryDate:'2028-03', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000010', matDesc:'阿莫西林胶囊-0.25g*24粒/盒', batch:'260201', unrestrictedQty:15000, qualityQty:500, blockedQty:200, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'山东鲁抗医药', vendorBatch:'LA-260201-01', prodDate:'2026-02-15', expiryDate:'2027-12', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000010', matDesc:'阿莫西林胶囊-0.25g*24粒/盒', batch:'260205', unrestrictedQty:28000, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'山东鲁抗医药', vendorBatch:'LA-260205-01', prodDate:'2026-02-20', expiryDate:'2028-01', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000010', matDesc:'阿莫西林胶囊-0.25g*24粒/盒', batch:'260301', unrestrictedQty:25000, qualityQty:1000, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'华北制药', vendorBatch:'HB-260301-01', prodDate:'2026-03-05', expiryDate:'2028-01', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000011', matDesc:'头孢克肟分散片-0.1g*6片/盒', batch:'260110', unrestrictedQty:8500, qualityQty:300, blockedQty:150, unit:'盒', wbsNo:'PRJ-2026-001', specialStock:'E', customer:'', vendor:'白云山制药', vendorBatch:'BY-260110', prodDate:'2026-01-20', expiryDate:'2027-10', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000011', matDesc:'头孢克肟分散片-0.1g*6片/盒', batch:'260210', unrestrictedQty:12000, qualityQty:null, blockedQty:null, unit:'盒', wbsNo:'', specialStock:'', customer:'', vendor:'白云山制药', vendorBatch:'BY-260210', prodDate:'2026-02-18', expiryDate:'2027-11', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1001-综合库-成品库', matCode:'10000011', matDesc:'头孢克肟分散片-0.1g*6片/盒', batch:'260315', unrestrictedQty:9600, qualityQty:400, blockedQty:null, unit:'盒', wbsNo:'PRJ-2026-002', specialStock:'E', customer:'', vendor:'白云山制药', vendorBatch:'BY-260315', prodDate:'2026-03-15', expiryDate:'2027-12', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1002-综合库-原材料库', matCode:'20000001', matDesc:'淀粉（药用级）-25kg/袋', batch:'250901', unrestrictedQty:500, qualityQty:null, blockedQty:50, unit:'袋', wbsNo:'', specialStock:'', customer:'', vendor:'山东西王集团', vendorBatch:'XW-250901', prodDate:'2025-09-10', expiryDate:'2027-09', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1002-综合库-原材料库', matCode:'20000001', matDesc:'淀粉（药用级）-25kg/袋', batch:'251101', unrestrictedQty:800, qualityQty:null, blockedQty:null, unit:'袋', wbsNo:'', specialStock:'', customer:'', vendor:'山东西王集团', vendorBatch:'XW-251101', prodDate:'2025-11-05', expiryDate:'2027-11', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1002-综合库-原材料库', matCode:'20000002', matDesc:'微晶纤维素 PH102-20kg/袋', batch:'260105', unrestrictedQty:200, qualityQty:50, blockedQty:null, unit:'袋', wbsNo:'', specialStock:'', customer:'', vendor:'安徽山河药辅', vendorBatch:'SH-260105', prodDate:'2026-01-15', expiryDate:'2028-01', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1002-综合库-原材料库', matCode:'20000002', matDesc:'微晶纤维素 PH102-20kg/袋', batch:'260220', unrestrictedQty:350, qualityQty:null, blockedQty:null, unit:'袋', wbsNo:'', specialStock:'', customer:'', vendor:'安徽山河药辅', vendorBatch:'SH-260220', prodDate:'2026-02-28', expiryDate:'2028-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1002-综合库-原材料库', matCode:'20000003', matDesc:'硬脂酸镁-10kg/桶', batch:'251208', unrestrictedQty:120, qualityQty:null, blockedQty:10, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'湖南尔康制药', vendorBatch:'EK-251208', prodDate:'2025-12-08', expiryDate:'2027-12', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1002-综合库-原材料库', matCode:'20000004', matDesc:'PVP K30-15kg/袋', batch:'260305', unrestrictedQty:180, qualityQty:20, blockedQty:null, unit:'袋', wbsNo:'', specialStock:'', customer:'', vendor:'巴斯夫中国', vendorBatch:'BF-260305', prodDate:'2026-03-05', expiryDate:'2028-03', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1003-综合库-包材库', matCode:'30000001', matDesc:'铝塑泡罩包装膜-PVC/PVDC复合膜-1200m/卷', batch:'260210', unrestrictedQty:45, qualityQty:5, blockedQty:null, unit:'卷', wbsNo:'', specialStock:'', customer:'', vendor:'江苏中金玛泰', vendorBatch:'ZJ-260210', prodDate:'2026-02-10', expiryDate:'2029-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1003-综合库-包材库', matCode:'30000001', matDesc:'铝塑泡罩包装膜-PVC/PVDC复合膜-1200m/卷', batch:'260318', unrestrictedQty:60, qualityQty:null, blockedQty:null, unit:'卷', wbsNo:'', specialStock:'', customer:'', vendor:'江苏中金玛泰', vendorBatch:'ZJ-260318', prodDate:'2026-03-18', expiryDate:'2029-03', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1003-综合库-包材库', matCode:'30000002', matDesc:'口服固体药用高密度聚乙烯瓶-100ml-500个/箱', batch:'260115', unrestrictedQty:200, qualityQty:null, blockedQty:10, unit:'箱', wbsNo:'', specialStock:'', customer:'', vendor:'江苏华鼎新材', vendorBatch:'HD-260115', prodDate:'2026-01-15', expiryDate:'2030-01', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1003-综合库-包材库', matCode:'30000002', matDesc:'口服固体药用高密度聚乙烯瓶-100ml-500个/箱', batch:'260308', unrestrictedQty:350, qualityQty:20, blockedQty:null, unit:'箱', wbsNo:'', specialStock:'', customer:'', vendor:'江苏华鼎新材', vendorBatch:'HD-260308', prodDate:'2026-03-08', expiryDate:'2030-03', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1003-综合库-包材库', matCode:'30000003', matDesc:'药品说明书纸-80g双胶纸-10000张/捆', batch:'260225', unrestrictedQty:80, qualityQty:null, blockedQty:5, unit:'捆', wbsNo:'', specialStock:'', customer:'', vendor:'山东太阳纸业', vendorBatch:'TY-260225', prodDate:'2026-02-25', expiryDate:'2030-02', isExpiringSoon:false },
  { factory:'1000', storageLoc:'1004-冷库-冷链库', matCode:'40000001', matDesc:'人血白蛋白-12.5g(25%,50ml)/瓶', batch:'260108', unrestrictedQty:200, qualityQty:50, blockedQty:10, unit:'瓶', wbsNo:'', specialStock:'', customer:'', vendor:'成都蓉生药业', vendorBatch:'RS-260108', prodDate:'2026-01-08', expiryDate:'2027-07', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1004-冷库-冷链库', matCode:'40000001', matDesc:'人血白蛋白-12.5g(25%,50ml)/瓶', batch:'260215', unrestrictedQty:300, qualityQty:null, blockedQty:null, unit:'瓶', wbsNo:'', specialStock:'', customer:'', vendor:'成都蓉生药业', vendorBatch:'RS-260215', prodDate:'2026-02-15', expiryDate:'2027-08', isExpiringSoon:true },
  { factory:'1000', storageLoc:'1004-冷库-冷链库', matCode:'40000002', matDesc:'重组人干扰素α2b注射液-18μg:0.3ml/支', batch:'260320', unrestrictedQty:1500, qualityQty:200, blockedQty:50, unit:'支', wbsNo:'', specialStock:'', customer:'', vendor:'安徽安科生物', vendorBatch:'AK-260320', prodDate:'2026-03-20', expiryDate:'2027-06', isExpiringSoon:true },
  { factory:'2000', storageLoc:'2001-原料仓库-A区', matCode:'50000001', matDesc:'7-氨基头孢烷酸(7-ACA)-1kg/桶', batch:'260118', unrestrictedQty:85, qualityQty:5, blockedQty:2, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'健康元海滨制药', vendorBatch:'JK-260118', prodDate:'2026-01-18', expiryDate:'2027-01', isExpiringSoon:true },
  { factory:'2000', storageLoc:'2001-原料仓库-A区', matCode:'50000001', matDesc:'7-氨基头孢烷酸(7-ACA)-1kg/桶', batch:'260303', unrestrictedQty:120, qualityQty:null, blockedQty:null, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'健康元海滨制药', vendorBatch:'JK-260303', prodDate:'2026-03-03', expiryDate:'2027-03', isExpiringSoon:false },
  { factory:'2000', storageLoc:'2001-原料仓库-A区', matCode:'50000002', matDesc:'青霉素G钾工业盐-25kg/桶', batch:'260212', unrestrictedQty:60, qualityQty:3, blockedQty:1, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'河南新乡华星', vendorBatch:'HX-260212', prodDate:'2026-02-12', expiryDate:'2027-08', isExpiringSoon:true },
  { factory:'2000', storageLoc:'2002-中间体库-B区', matCode:'60000001', matDesc:'头孢克肟活性酯-5kg/桶', batch:'260228', unrestrictedQty:35, qualityQty:2, blockedQty:1, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'浙江昂利康', vendorBatch:'AL-260228', prodDate:'2026-02-28', expiryDate:'2027-02', isExpiringSoon:true },
  { factory:'2000', storageLoc:'2002-中间体库-B区', matCode:'60000001', matDesc:'头孢克肟活性酯-5kg/桶', batch:'260310', unrestrictedQty:42, qualityQty:null, blockedQty:null, unit:'桶', wbsNo:'', specialStock:'', customer:'', vendor:'浙江昂利康', vendorBatch:'AL-260310', prodDate:'2026-03-10', expiryDate:'2027-03', isExpiringSoon:false }
];

// ===== Spare Parts Purchase Requisition Page =====
const SpPurchase = {
  page: 1, pageSize: 20, flatRows: [],
  editMode: false, editId: null,

  // Flatten data: each line item becomes one row for display
  flattenData() {
    const rows = [];
    spPurchaseData.forEach(pr => {
      if (!pr.lines || !pr.lines.length) return;
      pr.lines.forEach(line => {
        rows.push({
          _pr: pr, _line: line,
          docNo: pr.docNo, itemNo: line.itemNo,
          matCode: line.matCode || '', shortText: line.shortText || '',
          reqQty: line.reqQty, unit: line.unit || '',
          orderQty: line.orderQty || 0, deliveryDate: line.deliveryDate || '',
          applicant: pr.applicant, poNo: pr.poNo || '-',
          requiredDate: line.requiredDate || '',
          deliveryDate2: line.deliveryDate2 || '',
          price: line.price || 0, totalValue: line.totalValue || 0,
          plant: pr.plant, dept: pr.dept, status: pr.status,
          applyDate: pr.applyDate, wbsNo: pr.wbsNo || '',
          purpose: pr.purpose || '', notes: pr.notes || ''
        });
      });
    });
    return rows;
  },

  render() {
    this.flatRows = this.flattenData();
    this.filteredFlat = [...this.flatRows];
    this.page = 1;
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">采购申请提报</div><div style="font-size:13px;opacity:0.8;">手工提报采购申请，支持单据多行项目</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-blue" onclick="SpPurchase.openNewModal()"><span style="font-weight:700;font-size:16px;">+</span> 新建申请</button>
          </div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>采购申请</label><input type="text" id="prDocNo" placeholder="申请编号"></div>
          <div class="filter-group"><label>申请部门</label><select id="prDept">
            <option value="">全部</option>
            <option value="生产部">生产部</option>
            <option value="设备部">设备部</option>
            <option value="质量部">质量部</option>
            <option value="仓储物流部">仓储物流部</option>
          </select></div>
          <div class="filter-group"><label>状态</label><select id="prStatus">
            <option value="">全部</option>
            <option value="草稿">草稿</option>
            <option value="审批中">审批中</option>
            <option value="已审批">已审批</option>
            <option value="已拒绝">已拒绝</option>
            <option value="已撤回">已撤回</option>
          </select></div>
          <div class="filter-group"><label>物料号</label><input type="text" id="prMatCode" placeholder="物料号"></div>
          <div class="filter-group"><label>申请日期</label><input type="date" id="prDateFrom" style="padding:6px 10px;"></div>
          <div class="filter-group"><label>至</label><input type="date" id="prDateTo" style="padding:6px 10px;"></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="SpPurchase.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="SpPurchase.reset()">重置</button>
            <button class="btn btn-outline btn-sm" onclick="SpPurchase.printList()">打印</button>
            <button class="btn btn-outline btn-sm" onclick="SpPurchase.exportData()">导出</button>
          </div>
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table" style="min-width:1300px;">
            <thead><tr>
              <th>工厂</th><th>采购申请</th><th style="width:55px;text-align:center;">请求<br/>项目</th>
              <th>物料</th><th>短文本</th><th style="text-align:right;">申请数量</th><th style="width:38px;">Un</th>
              <th style="text-align:right;">订货数量</th><th>交货日期 A</th><th>申请人</th><th>采购订单</th>
              <th>需求日期</th><th>交货日期</th><th style="text-align:right;">评价价格</th><th style="text-align:right;font-weight:800;color:var(--danger);">总价值</th>
              <th style="width:90px;">操作</th>
            </tr></thead>
            <tbody id="prTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info">
            <span class="list-count" id="prCount">共 ${this.flatRows.length} 行</span>
            <span style="color:var(--text-muted);font-size:12px;">(共 ${spPurchaseData.length} 张申请单)</span>
          </div>
          <div class="pagination">
            <button class="pagination-btn" id="prPrev" disabled onclick="SpPurchase.prevPage()">‹</button>
            <span class="pagination-info" id="prPageInfo">第 ${this.page} / ${Math.ceil(Math.max(this.flatRows.length,1)/this.pageSize)} 页</span>
            <button class="pagination-btn" id="prNext" onclick="SpPurchase.nextPage()">›</button>
            <select class="page-size-select" id="prPageSizeSel" onchange="SpPurchase.changePageSize()"><option value="20">20条</option><option value="40">40条</option><option value="80">80条</option></select>
          </div>
        </div>
      </div>
      <div id="prModalContainer"></div>`;
  },

  init() {
    this.flatRows = this.flattenData();
    this.filteredFlat = [...this.flatRows];
    this.page = 1;
    this.renderTable();
  },

  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filteredFlat.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filteredFlat.length / this.pageSize) || 1;
    document.getElementById('prCount').textContent = `共 ${this.filteredFlat.length} 行`;
    document.getElementById('prPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('prPrev').disabled = this.page <= 1;
    document.getElementById('prNext').disabled = this.page >= totalPages;
    document.getElementById('prPageSizeSel').value = this.pageSize;

    const statusBadge = s => {
      const map = { '草稿':'badge-gray','审批中':'badge-blue','已审批':'badge-green','已拒绝':'badge-red','已撤回':'badge-yellow' };
      return `<span class="badge ${map[s]||'badge-gray'}">${esc(s)}</span>`;
    };

    // Group consecutive same-docNo rows for visual grouping
    let lastDoc = '';
    let groupIdx = 0;
    document.getElementById('prTableBody').innerHTML = page.map(row => {
      const isNewGroup = row.docNo !== lastDoc;
      lastDoc = row.docNo;

      const canEdit = row.status === '草稿';
      const canWithdraw = row.status === '审批中';
      let actions = '';
      if (isNewGroup) {
        actions += `<button class="btn btn-outline btn-sm" onclick="SpPurchase.viewDetail('${row.docNo}')">查看</button>`;
        if (canEdit) {
          actions += `<button class="btn btn-primary btn-sm" onclick="SpPurchase.openEditModal('${row.docNo}')">修改</button>`;
          actions += `<button class="btn btn-secondary btn-sm" onclick="SpPurchase.deleteReq('${row.docNo}')">删除</button>`;
        }
        if (canWithdraw) {
          actions += `<button class="btn btn-warning btn-sm" onclick="SpPurchase.withdraw('${row.docNo}')">撤回</button>`;
        }
      }

      const bgStyle = isNewGroup ? '' : '';
      return `<tr${bgStyle}>
        <td style="white-space:nowrap;">${isNewGroup ? esc(row.plant) : ''}</td>
        <td><strong style="color:var(--primary);">${isNewGroup ? esc(row.docNo) : ''}</strong></td>
        <td style="text-align:center;font-weight:600;">${row.itemNo}</td>
        <td><strong>${esc(row.matCode)}</strong></td>
        <td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(row.shortText)}">${esc(row.shortText)}</td>
        <td style="text-align:right;">${Number(row.reqQty).toLocaleString()}</td>
        <td style="text-align:center;">${esc(row.unit)}</td>
        <td style="text-align:right;color:var(--text-secondary);">${Number(row.orderQty).toLocaleString()}</td>
        <td style="white-space:nowrap;">${esc(row.deliveryDate)}</td>
        <td>${isNewGroup ? esc(row.applicant) : ''}</td>
        <td style="color:var(--primary-lighter);font-size:12px;">${isNewGroup ? esc(row.poNo) : ''}</td>
        <td style="white-space:nowrap;">${esc(row.requiredDate)}</td>
        <td style="white-space:nowrap;">${esc(row.deliveryDate2)}</td>
        <td style="text-align:right;">${Number(row.price).toFixed(2)}</td>
        <td style="text-align:right;font-weight:700;color:var(--danger);">${Number(row.totalValue).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
        <td>${actions}</td>
      </tr>`;
    }).join('');
  },

  search() {
    const docNo = document.getElementById('prDocNo').value.trim();
    const dept = document.getElementById('prDept').value;
    const status = document.getElementById('prStatus').value;
    const matCode = document.getElementById('prMatCode').value.trim();
    const dateFrom = document.getElementById('prDateFrom').value;
    const dateTo = document.getElementById('prDateTo').value;

    this.filteredFlat = this.flatRows.filter(row => {
      if (docNo && !row.docNo.includes(docNo)) return false;
      if (dept && row.dept !== dept) return false;
      if (status && row.status !== status) return false;
      if (matCode && !(row.matCode||'').includes(matCode)) return false;
      if (dateFrom && row.applyDate < dateFrom) return false;
      if (dateTo && row.applyDate > dateTo) return false;
      return true;
    });
    this.page = 1;
    this.renderTable();
  },

  reset() {
    document.getElementById('prDocNo').value = '';
    document.getElementById('prDept').value = '';
    document.getElementById('prStatus').value = '';
    document.getElementById('prMatCode').value = '';
    document.getElementById('prDateFrom').value = '';
    document.getElementById('prDateTo').value = '';
    this.filteredFlat = [...this.flatRows];
    this.page = 1;
    this.renderTable();
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() { const tp = Math.ceil(this.filteredFlat.length/this.pageSize); if (this.page < tp) { this.page++; this.renderTable(); } },
  changePageSize() { this.pageSize = parseInt(document.getElementById('prPageSizeSel').value); this.page = 1; this.renderTable(); },

  // ---- CRUD ----
  openNewModal() {
    this.editMode = false;
    this.editId = null;
    const emptyPr = {
      docNo: '', applyDate: new Date().toISOString().slice(0,10),
      plant: '1000', dept: '', applicant: '', status: '草稿',
      wbsNo: '', purpose: '', notes: '', poNo: '',
      lines: [{ itemNo:10, matCode:'', shortText:'', reqQty:'', unit:'个', orderQty:0, deliveryDate:'', requiredDate:'', deliveryDate2:'', price:0, totalValue:0 }]
    };
    document.getElementById('prModalContainer').innerHTML = this.getFormModalHTML(emptyPr);
  },

  openEditModal(docNo) {
    const pr = spPurchaseData.find(r => r.docNo === docNo);
    if (!pr) return;
    this.editMode = true;
    this.editId = docNo;
    document.getElementById('prModalContainer').innerHTML = this.getFormModalHTML(JSON.parse(JSON.stringify(pr)));
  },

  closeModal() { document.getElementById('prModalContainer').innerHTML = ''; },

  submitForm(saveOnly) {
    const f = id => document.getElementById(id)?.value ?? '';
    // Header
    const prData = {
      docNo: this.editMode ? this.editId : ('21' + String(Math.floor(Math.random()*900000000+100000000))),
      applyDate: f('prFApplyDate'),
      plant: f('prFPlant'),
      dept: f('prFDept'),
      applicant: f('prFApplicant'),
      wbsNo: f('prFWbsNo'),
      purpose: f('prFPurpose'),
      notes: f('prFNotes'),
      poNo: '',
      status: saveOnly ? '草稿' : '审批中',
      lines: []
    };

    if (!prData.dept || !prData.applicant) { toast('请填写必填字段：申请部门、申请人'); return; }

    // Collect lines from dynamic table
    const tbody = document.getElementById('prLinesBody');
    if (!tbody || !tbody.rows.length) { toast('请至少添加一行物料'); return; }
    let hasValidLine = false;
    for (let i = 0; i < tbody.rows.length; i++) {
      const r = tbody.rows[i];
      const mc = (r.cells[1]?.querySelector('input')?.value||'').trim();
      const st = (r.cells[2]?.querySelector('input')?.value||'').trim();
      const q = parseFloat(r.cells[3]?.querySelector('input')?.value)||0;
      const u = r.cells[4]?.querySelector('select')?.value||'';
      if (!mc && !st && !q) continue; // skip empty lines
      if (!mc || !st || !q) { toast(`请完整填写第 ${i+1} 行的物料号、短文本和数量`); return; }
      hasValidLine = true;
      const p = parseFloat(r.cells[9]?.querySelector('input')?.value)||0;
      prData.lines.push({
        itemNo: (i + 1) * 10,
        matCode: mc, shortText: st, reqQty: q, unit: u,
        orderQty: parseFloat(r.cells[5]?.querySelector('input')?.value)||0,
        deliveryDate: r.cells[6]?.querySelector('input')?.value||'',
        requiredDate: r.cells[7]?.querySelector('input')?.value||'',
        deliveryDate2: r.cells[8]?.querySelector('input')?.value||'',
        price: p, totalValue: q * p
      });
    }
    if (!hasValidLine) { toast('请至少添加一行有效物料信息'); return; }

    if (this.editMode) {
      const idx = spPurchaseData.findIndex(r => r.docNo === this.editId);
      if (idx >= 0) {
        prData.docNo = this.editId;
        spPurchaseData[idx] = prData;
        toast(saveOnly ? '保存成功' : '已提交审批');
      }
    } else {
      spPurchaseData.unshift(prData);
      toast(saveOnly ? '采购申请已保存为草稿' : '采购申请已提交审批');
    }

    this.closeModal();
    this.flatRows = this.flattenData();
    this.filteredFlat = [...this.flatRows];
    this.page = 1;
    this.renderTable();
  },

  deleteReq(docNo) {
    if (confirm('确定要删除采购申请 ' + docNo + ' 及其所有行项目吗？')) {
      const idx = spPurchaseData.findIndex(r => r.docNo === docNo);
      if (idx >= 0) { spPurchaseData.splice(idx, 1); }
      this.flatRows = this.flattenData(); this.filteredFlat = [...this.flatRows]; this.page=1; this.renderTable();
      toast('已删除');
    }
  },

  withdraw(docNo) {
    if (confirm('确定要撤回采购申请 ' + docNo + ' 吗？')) {
      const row = spPurchaseData.find(r => r.docNo === docNo);
      if (row) { row.status = '草稿'; }
      this.flatRows = this.flattenData(); this.filteredFlat = [...this.flatRows]; this.renderTable();
      toast('已撤回');
    }
  },

  viewDetail(docNo) {
    const pr = spPurchaseData.find(r => r.docNo === docNo); if (!pr) return;
    const sb = s => { const m={草稿:'gray',审批中:'blue',已审批:'green',已拒绝:'red',已撤回:'yellow'}; return `<span class="badge badge-${m[s]||'gray'}">${esc(s)}</span>`; };
    const grandTotal = pr.lines.reduce((s,l)=>s+(l.totalValue||0),0);
    const html = `
      <div class="modal-backdrop" id="prDetailBackdrop" onclick="SpPurchase.closeDetail()">
        <div class="modal" style="max-width:920px;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">采购申请详情 - ${esc(pr.docNo)} ${sb(pr.status)}</div>
            <button class="modal-close" onclick="SpPurchase.closeDetail()">✕</button>
          </div>
          <div class="modal-body" style="max-height:calc(85vh-120px);">
            <div class="form-section">
              <div class="form-section-title">表头信息</div>
              <div class="detail-grid">
                <div class="detail-item"><dt>申请编号</dt><dd><strong>${esc(pr.docNo)}</strong></dd></div>
                <div class="detail-item"><dt>状态</dt><dd>${sb(pr.status)}</dd></div>
                <div class="detail-item"><dt>申请日期</dt><dd>${esc(pr.applyDate)}</dd></div>
                <div class="detail-item"><dt>工厂</dt><dd>${esc(pr.plant)}</dd></div>
                <div class="detail-item"><dt>部门</dt><dd>${esc(pr.dept)}</dd></div>
                <div class="detail-item"><dt>申请人</dt><dd>${esc(pr.applicant)}</dd></div>
                <div class="detail-item"><dt>WBS编号</dt><dd>${esc(pr.wbsNo||'-')}</dd></div>
                <div class="detail-item"><dt>采购订单</dt><dd>${esc(pr.poNo||'-')}</dd></div>
              </div>
              <div style="margin-top:10px;padding:10px;background:#f8fafc;border-radius:6px;display:grid;grid-template-columns:auto 1fr;gap:6px 16px;font-size:13px;">
                <dt style="color:var(--text-secondary);">用途说明</dt><dd>${esc(pr.purpose||'-')}</dd>
                <dt style="color:var(--text-secondary);">备注</dt><dd>${esc(pr.notes||'-')}</dd>
              </div>
            </div>
            <div class="form-section" style="margin-top:16px;">
              <div class="form-section-title">行项目 (${pr.lines.length} 项，合计 ¥ ${grandTotal.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})})</div>
              <table class="data-table" style="min-width:900px;">
                <thead><tr>
                  <th>项次</th><th>物料</th><th>短文本</th><th style="text-align:right;">申请数量</th><th>Un</th>
                  <th style="text-align:right;">订货数量</th><th>交货日期A</th><th>需求日期</th><th>交货日期</th><th style="text-align:right;">评价价格</th><th style="text-align:right;font-weight:800;color:var(--danger);">总价值</th>
                </tr></thead>
                <tbody>${pr.lines.map((l,i)=>`<tr>
                  <td style="text-align:center;">${l.itemNo}</td>
                  <td><strong>${esc(l.matCode)}</strong></td>
                  <td>${esc(l.shortText)}</td>
                  <td style="text-align:right;">${Number(l.reqQty).toLocaleString()}</td>
                  <td style="text-align:center;">${esc(l.unit)}</td>
                  <td style="text-align:right;color:var(--text-secondary);">${Number(l.orderQty).toLocaleString()}</td>
                  <td style="white-space:nowrap;">${esc(l.deliveryDate||'-')}</td>
                  <td style="white-space:nowrap;">${esc(l.requiredDate||'-')}</td>
                  <td style="white-space:nowrap;">${esc(l.deliveryDate2||'-')}</td>
                  <td style="text-align:right;">${Number(l.price).toFixed(2)}</td>
                  <td style="text-align:right;font-weight:700;color:var(--danger);">${Number(l.totalValue).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                </tr>`).join('')}
                </tbody>
                <tfoot><tr style="background:#fef3f2;border-top:3px solid var(--border);">
                  <td colspan="10" style="text-align:right;font-weight:700;">合计：</td>
                  <td style="text-align:right;font-weight:800;color:var(--danger);font-size:15px;">¥ ${grandTotal.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                </tr></tfoot>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="SpPurchase.closeDetail()">关闭</button>
            <button class="btn btn-outline btn-sm" onclick="SpPurchase.printSingle('${pr.docNo}')">打印</button>
            <button class="btn btn-outline btn-sm" onclick="SpPurchase.exportData()">导出</button>
          </div>
        </div>
      </div>`;
    document.getElementById('prModalContainer').innerHTML = html;
  },

  closeDetail() { document.getElementById('prModalContainer').innerHTML = ''; },

  // ---- Modal Form ----
  getFormModalHTML(pr) {
    const linesHTML = pr.lines.map((l, i) => SpPurchase.renderLineRow(l, i)).join('');
    return `
      <div class="modal-backdrop" id="prModalBackdrop" onclick="SpPurchase.closeModal()">
        <div class="modal modal-lg" style="max-width:1100px;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">${this.editMode?'修改':'新建'}采购申请 ${this.editMode?('-'+pr.docNo):''}</div>
            <button class="modal-close" onclick="SpPurchase.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:calc(92vh-140px);">
            <${''}!-- Header ${''}-->
            <div class="form-section">
              <div class="form-section-title">表头信息</div>
              <div class="form-grid">
                <div class="form-group"><label>采购申请编号</label><input type="text" value="${esc(pr.docNo||'(自动生成)')}" disabled style="background:#f8fafc;"></div>
                <div class="form-group"><label><span class="req">*</span> 申请人</label><input type="text" id="prFApplicant" value="${esc(pr.applicant)}" placeholder="申请人姓名"></div>
                <div class="form-group"><label><span class="req">*</span> 部门</label><select id="prFDept"><option value="">请选择</option><option value="设备部"${pr.dept==='设备部'?' selected':''}>设备部</option><option value="生产部"${pr.dept==='生产部'?' selected':''}>生产部</option><option value="质量部"${pr.dept==='质量部'?' selected':''}>质量部</option><option value="仓储物流部"${pr.dept==='仓储物流部'?' selected':''}>仓储物流部</option></select></div>
                <div class="form-group"><label>工厂</label><select id="prFPlant">
                  <option value="1000"${pr.plant==='1000'?' selected':''}>1000 - 山东步长制药工厂</option>
                  <option value="2001"${pr.plant==='2001'?' selected':''}>2001 - 陕西步长制药工厂</option>
                  <option value="2002"${pr.plant==='2002'?' selected':''}>2002 - 山东丹红制药工厂</option>
                  <option value="2003"${pr.plant==='2003'?' selected':''}>2003 - 山东神州制药工厂</option>
                  <option value="2004"${pr.plant==='2004'?' selected':''}>2004 - 山东康爱制药工厂</option>
                  <option value="2005"${pr.plant==='2005'?' selected':''}>2005 - 通化谷红制药工厂</option>
                  <option value="2006"${pr.plant==='2006'?' selected':''}>2006 - 吉林天成制药工厂</option>
                  <option value="2007"${pr.plant==='2007'?' selected':''}>2007 - 通化天实制药工厂</option>
                  <option value="2008"${pr.plant==='2008'?' selected':''}>2008 - 梅河口步长制药工厂</option>
                  <option value="2009"${pr.plant==='2009'?' selected':''}>2009 - 辽宁奥达制药工厂</option>
                  <option value="2010"${pr.plant==='2010'?' selected':''}>2010 - 保定天浩制药工厂</option>
                  <option value="2011"${pr.plant==='2011'?' selected':''}>2011 - 邛崃天银制药工厂</option>
                  <option value="2012"${pr.plant==='2012'?' selected':''}>2012 - 陕西步长高新制药工厂</option>
                  <option value="2013"${pr.plant==='2013'?' selected':''}>2013 - 杨凌步长制药工厂</option>
                </select></div>
                <div class="form-group"><label>申请日期</label><input type="date" id="prFApplyDate" value="${esc(pr.applyDate)}"></div>
                <div class="form-group"><label>WBS编号</label><input type="text" id="prFWbsNo" value="${esc(pr.wbsNo||'')}" placeholder="项目编号"></div>
                <div class="form-group full"><label>用途说明</label><textarea id="prFPurpose" rows="2" placeholder="采购用途描述">${esc(pr.purpose||'')}</textarea></div>
                <div class="form-group full"><label>备注</label><textarea id="prFNotes" rows="2" placeholder="补充说明">${esc(pr.notes||'')}</textarea></div>
              </div>
            </div>

            <${''}!-- Line Items ${''}-->
            <div class="form-section" style="margin-top:14px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <div class="form-section-title" style="margin-bottom:0;">行项目</div>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-sm btn-outline" onclick="SpPurchase.addLineRow()" style="padding:4px 12px;font-size:12px;">+ 添加行</button>
                </div>
              </div>
              <div style="overflow-x:auto;">
                <table class="data-table" id="prLinesTable" style="min-width:920px;">
                  <thead><tr>
                    <th style="width:36px;text-align:center;">#</th>
                    <th style="min-width:100px;"><span class="req">*</span> 物料</th>
                    <th style="min-width:240px;"><span class="req">*</span> 短文本</th>
                    <th style="min-width:75px;text-align:right;"><span class="req">*</span> 申请数量</th>
                    <th style="width:52px;">Un</th>
                    <th style="min-width:70px;text-align:right;">订货数量</th>
                    <th style="min-width:95px;">交货日期A</th>
                    <th style="min-width:95px;">需求日期</th>
                    <th style="min-width:95px;">交货日期</th>
                    <th style="min-width:70px;text-align:right;">评价价格</th>
                    <th style="min-width:90px;text-align:right;font-weight:700;color:var(--danger);">总价值</th>
                    <th style="width:42px;"></th>
                  </tr></thead>
                  <tbody id="prLinesBody">${linesHTML}</tbody>
                </table>
              </div>
              <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--text-secondary);">
                <span>提示：点击 "+" 可添加多行物料；留空的行将被忽略</span>
                <span id="prGrandTotal" style="font-weight:700;color:var(--danger);font-size:15px;">合计: ¥ 0.00</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="SpPurchase.closeModal()">取消</button>
            <button class="btn btn-outline" onclick="SpPurchase.submitForm(true)">保存草稿</button>
            <button class="btn btn-primary" onclick="SpPurchase.submitForm(false)">提交审批</button>
          </div>
        </div>
      </div>`;
  },

  renderLineRow(line, idx) {
    return `<tr data-row="${idx}">
      <td style="text-align:center;color:var(--text-muted);font-weight:600;">${idx+1}</td>
      <td><input type="text" value="${esc(line.matCode||'')}" placeholder="物料号" style="padding:5px 8px;width:100%;border:1px solid var(--border);border-radius:4px;font-size:12px;" oninput="SpPurchase.recalcTotal()"></td>
      <td><input type="text" value="${esc(line.shortText||'')}" placeholder="物料描述" style="padding:5px 8px;width:100%;border:1px solid var(--border);border-radius:4px;font-size:12px;" oninput="SpPurchase.recalcTotal()"></td>
      <td style="padding:5px;"><input type="number" value="${line.reqQty||''}" min="0" step="any" style="width:72px;text-align:right;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;" oninput="SpPurchase.recalcTotal()"></td>
      <td style="padding:5px;"><select style="width:48px;padding:4px 4px;border:1px solid var(--border);border-radius:4px;font-size:11px;" onchange="SpPurchase.recalcTotal()">
        <option value="个"${line.unit==='个'?' selected':''}>个</option>
        <option value="KG"${line.unit==='KG'?' selected':''}>KG</option>
        <option value="套"${line.unit==='套'?' selected':''}>套</option>
        <option value="袋"${line.unit==='袋'?' selected':''}>袋</option>
        <option value="件"${line.unit==='件'?' selected':''}>件</option>
        <option value="台"${line.unit==='台'?' selected':''}>台</option>
        <option value="支"${line.unit==='支'?' selected':''}>支</option>
        <option value="桶"${line.unit==='桶'?' selected':''}>桶</option>
        <option value="组"${line.unit==='组'?' selected':''}>组</option>
        <option value="箱"${line.unit==='箱'?' selected':''}>箱</option>
        <option value="卷"${line.unit==='卷'?' selected':''}>卷</option>
        <option value="瓶"${line.unit==='瓶'?' selected':''}>瓶</option>
        <option value="盒"${line.unit==='盒'?' selected':''}>盒</option>
        <option value="方"${line.unit==='方'?' selected':''}>方</option>
        <option value="张"${line.unit==='张'?' selected':''}>张</option>
      </select></td>
      <td style="padding:5px;"><input type="number" value="${line.orderQty||''}" min="0" style="width:68px;text-align:right;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:5px;"><input type="text" value="${esc(line.deliveryDate||'')}" placeholder="YYYYMMDD" style="width:88px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:5px;"><input type="text" value="${esc(line.requiredDate||'')}" placeholder="YYYY.MM.DD" style="width:94px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:5px;"><input type="text" value="${esc(line.deliveryDate2||'')}" placeholder="YYYY.MM.DD" style="width:94px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:5px;"><input type="number" value="${line.price||''}" min="0" step="0.01" style="width:68px;text-align:right;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;" oninput="SpPurchase.recalcTotal()"></td>
      <td style="text-align:right;font-weight:700;color:var(--danger);padding:6px 4px;" class="line-total">${(Number(line.totalPrice||0)).toLocaleString(undefined,{minimumFractionDigits:2})}</td>
      <td style="padding:4px;"><button class="btn btn-sm" style="padding:3px 8px;font-size:18px;line-height:1;color:var(--danger);background:none;border:1px solid transparent;" onclick="SpPurchase.removeLineRow(this)" title="删除此行">&times;</button></td>
    </tr>`;
  },

  addLineRow() {
    const tbody = document.getElementById('prLinesBody');
    const idx = tbody.rows.length;
    const tr = document.createElement('tr');
    tr.innerHTML = this.renderLineRow({ itemNo:(idx+1)*10, matCode:'', shortText:'', reqQty:'', unit:'个', orderQty:0, deliveryDate:'', requiredDate:'', deliveryDate2:'', price:0, totalValue:0 }, idx);
    tbody.appendChild(tr);
    // re-index numbers
    this.reindexRows();
  },

  removeLineRow(btn) {
    const tr = btn.closest('tr');
    if (document.getElementById('prLinesBody').rows.length <= 1) {
      toast('至少保留一行');
      return;
    }
    tr.remove();
    this.reindexRows();
    this.recalcTotal();
  },

  reindexRows() {
    const rows = document.querySelectorAll('#prLinesBody tr');
    rows.forEach((r,i) => { r.querySelector('td:first-child').textContent = i+1; });
  },

  recalcTotal() {
    const rows = document.querySelectorAll('#prLinesBody tr');
    let grand = 0;
    rows.forEach(tr => {
      const qty = parseFloat(tr.cells[3].querySelector('input')?.value) || 0;
      const price = parseFloat(tr.cells[9].querySelector('input')?.value) || 0;
      const val = qty * price;
      const td = tr.querySelector('.line-total');
      if (td) td.textContent = val.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
      grand += val;
    });
    const gt = document.getElementById('prGrandTotal');
    if (gt) gt.textContent = '合计: ¥ ' + grand.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  },

  printList() { toast('打印功能开发中...'); },
  printSingle(docNo) { toast('打印申请单 ' + docNo + ' ...'); },
  exportData() { toast('导出功能开发中...'); }
};

// ===== Demo Data for Purchase Requisition (real factory codes & material codes) =====
const spPurchaseData = [
  {
    docNo:'2100002651', applyDate:'2026-05-06', plant:'1000 - 山东步长制药工厂', dept:'设备部', applicant:'李君',
    status:'已审批', wbsNo:'PRJ-2026-001', purpose:'固体制剂车间空调净化系统高效过滤器年度更换', notes:'原厂康斐尔/AAF品牌',
    poNo:'4100014248',
    lines:[
      {itemNo:10,matCode:'60001018',shortText:'高效过滤器-MIIPDF-635*520*93-27-AAF', reqQty:48,unit:'个',orderQty:48,deliveryDate:'20260715',requiredDate:'20260620',deliveryDate2:'20260715',price:850.00,totalValue:40800},
      {itemNo:20,matCode:'60001019',shortText:'高效过滤器-MIIPDF-635*762*93-27-AAF', reqQty:36,unit:'个',orderQty:36,deliveryDate:'20260715',requiredDate:'20260620',deliveryDate2:'20260715',price:920.00,totalValue:33120},
      {itemNo:30,matCode:'60001020',shortText:'高效过滤器-MIIPDF-416*416*93-27-AAF', reqQty:24,unit:'个',orderQty:24,deliveryDate:'20260715',requiredDate:'20260620',deliveryDate2:'20260715',price:680.00,totalValue:16320},
      {itemNo:40,matCode:'60001021',shortText:'高效过滤器-MIIPDF-635*1030*93-27-AAF', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260715',requiredDate:'20260620',deliveryDate2:'20260715',price:1050.00,totalValue:21000},
      {itemNo:50,matCode:'60001022',shortText:'高效过滤器-GSF-LS-631*516*95-01/22-康斐尔', reqQty:32,unit:'个',orderQty:32,deliveryDate:'20260720',requiredDate:'20260625',deliveryDate2:'20260720',price:750.00,totalValue:24000},
      {itemNo:60,matCode:'60001023',shortText:'高效过滤器-GSF-LS-631*758*95-01/22-康斐尔', reqQty:24,unit:'个',orderQty:24,deliveryDate:'20260720',requiredDate:'20260625',deliveryDate2:'20260720',price:820.00,totalValue:19680},
      {itemNo:70,matCode:'60001024',shortText:'高效过滤器-GSF-LS-412*412*95-01/22-康斐尔', reqQty:16,unit:'个',orderQty:16,deliveryDate:'20260720',requiredDate:'20260625',deliveryDate2:'20260720',price:620.00,totalValue:9920},
      {itemNo:80,matCode:'60001025',shortText:'高效过滤器-GSF-LS-1026*631*95-01/22-康斐尔', reqQty:12,unit:'个',orderQty:12,deliveryDate:'20260720',requiredDate:'20260625',deliveryDate2:'20260720',price:1100.00,totalValue:13200},
      {itemNo:90,matCode:'60001026',shortText:'高效过滤器-GSF-LS-762*631*95-01/22-康斐尔', reqQty:12,unit:'个',orderQty:12,deliveryDate:'20260720',requiredDate:'20260625',deliveryDate2:'20260720',price:960.00,totalValue:11520},
      {itemNo:100,matCode:'60001012',shortText:'耐湿高效过滤器-GKYS-305*30*150', reqQty:8,unit:'个',orderQty:8,deliveryDate:'20260720',requiredDate:'20260625',deliveryDate2:'20260720',price:580.00,totalValue:4640}
    ]
  },
  {
    docNo:'2100002752', applyDate:'2026-05-07', plant:'2001 - 陕西步长制药工厂', dept:'设备部', applicant:'王海涛',
    status:'审批中', wbsNo:'PRJ-2026-002', purpose:'发酵罐及配液罐O型密封圈年度备件采购', notes:'要求氟橡胶材质，需提供材质证明',
    poNo:'4100015321',
    lines:[
      {itemNo:10,matCode:'60001086',shortText:'O型圈-Φ360*5.7-材质:氟橡胶', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:65.00,totalValue:1300},
      {itemNo:20,matCode:'60001087',shortText:'O型圈-Φ506*6.99-材质:氟橡胶', reqQty:15,unit:'个',orderQty:15,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:85.00,totalValue:1275},
      {itemNo:30,matCode:'60001088',shortText:'O型圈-Φ399.5*8.4-材质:氟橡胶', reqQty:15,unit:'个',orderQty:15,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:78.00,totalValue:1170},
      {itemNo:40,matCode:'60001089',shortText:'O型圈-Φ44*3-材质:氟橡胶', reqQty:50,unit:'个',orderQty:50,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:8.00,totalValue:400},
      {itemNo:50,matCode:'60001090',shortText:'O型圈-Φ13.94*2.62-材质:氟橡胶', reqQty:100,unit:'个',orderQty:100,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:3.50,totalValue:350},
      {itemNo:60,matCode:'60001091',shortText:'O型圈-Φ6*2-材质:氟橡胶', reqQty:100,unit:'个',orderQty:100,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:2.00,totalValue:200},
      {itemNo:70,matCode:'60001092',shortText:'O型圈-Φ42*2.5-材质:氟橡胶', reqQty:80,unit:'个',orderQty:80,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:7.50,totalValue:600},
      {itemNo:80,matCode:'60001093',shortText:'O型圈-Φ7.6*2.62-材质:氟橡胶', reqQty:120,unit:'个',orderQty:120,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:2.50,totalValue:300},
      {itemNo:90,matCode:'60001094',shortText:'O型圈-Φ59.92*3.53-材质:氟橡胶', reqQty:60,unit:'个',orderQty:60,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:12.00,totalValue:720},
      {itemNo:100,matCode:'60001095',shortText:'O型圈-Φ10.77*2.62-材质:氟橡胶', reqQty:150,unit:'个',orderQty:150,deliveryDate:'20260701',requiredDate:'20260610',deliveryDate2:'20260701',price:3.00,totalValue:450}
    ]
  },
  {
    docNo:'2100002873', applyDate:'2026-05-09', plant:'2002 - 山东丹红制药工厂', dept:'设备部', applicant:'张建国',
    status:'已审批', wbsNo:'PRJ-2026-003', purpose:'配液系统隔膜阀膜片及管道法兰垫片更换', notes:'宝帝原厂膜片，需随货附合格证',
    poNo:'4100014655',
    lines:[
      {itemNo:10,matCode:'60001146',shortText:'隔膜阀膜片-尺寸:DN15-材质:PTFE/EPDM-宝帝', reqQty:30,unit:'个',orderQty:30,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:180.00,totalValue:5400},
      {itemNo:20,matCode:'60001147',shortText:'隔膜阀膜片-尺寸:DN25-材质:PTFE/EPDM-宝帝', reqQty:24,unit:'个',orderQty:24,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:220.00,totalValue:5280},
      {itemNo:30,matCode:'60001148',shortText:'隔膜阀膜片-尺寸:DN40-材质:PTFE/EPDM-宝帝', reqQty:16,unit:'个',orderQty:16,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:280.00,totalValue:4480},
      {itemNo:40,matCode:'60001149',shortText:'隔膜阀膜片-尺寸:DN50-材质:PTFE/EPDM-宝帝', reqQty:12,unit:'个',orderQty:12,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:350.00,totalValue:4200},
      {itemNo:50,matCode:'60001150',shortText:'隔膜阀膜片-尺寸:DN65-材质:PTFE/EPDM-宝帝', reqQty:8,unit:'个',orderQty:8,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:480.00,totalValue:3840},
      {itemNo:60,matCode:'60001103',shortText:'法兰垫片-DN100-材质:PTFE', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:25.00,totalValue:500},
      {itemNo:70,matCode:'60001107',shortText:'金属缠绕石墨垫-DN50', reqQty:30,unit:'个',orderQty:30,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:15.00,totalValue:450},
      {itemNo:80,matCode:'60001108',shortText:'金属缠绕石墨垫-DN80', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260620',requiredDate:'20260528',deliveryDate2:'20260620',price:22.00,totalValue:440}
    ]
  },
  {
    docNo:'2100002984', applyDate:'2026-05-12', plant:'2003 - 山东神州制药工厂', dept:'生产部', applicant:'陈永刚',
    status:'草稿', wbsNo:'', purpose:'车间照明及办公电器补充采购', notes:'',
    poNo:'',
    lines:[
      {itemNo:10,matCode:'60000655',shortText:'LED灯泡-30W', reqQty:50,unit:'个',orderQty:50,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:25.00,totalValue:1250},
      {itemNo:20,matCode:'60000656',shortText:'LED灯泡-60W', reqQty:30,unit:'个',orderQty:30,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:35.00,totalValue:1050},
      {itemNo:30,matCode:'60000657',shortText:'LED灯泡-100W', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:45.00,totalValue:900},
      {itemNo:40,matCode:'60000667',shortText:'插排-3插位', reqQty:15,unit:'个',orderQty:15,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:18.00,totalValue:270},
      {itemNo:50,matCode:'60000668',shortText:'插排-6插位', reqQty:10,unit:'个',orderQty:10,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:32.00,totalValue:320},
      {itemNo:60,matCode:'60001205',shortText:'插线板-6插位-3米', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:28.00,totalValue:560},
      {itemNo:70,matCode:'60001297',shortText:'插线板-8插位', reqQty:10,unit:'个',orderQty:10,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:38.00,totalValue:380},
      {itemNo:80,matCode:'60001298',shortText:'公牛插线板-4插位-5米', reqQty:8,unit:'个',orderQty:8,deliveryDate:'20260615',requiredDate:'20260601',deliveryDate2:'20260615',price:42.00,totalValue:336}
    ]
  },
  {
    docNo:'2100003105', applyDate:'2026-05-14', plant:'1000 - 山东步长制药工厂', dept:'设备部', applicant:'李君',
    status:'审批中', wbsNo:'PRJ-2026-005', purpose:'洁净区初效、中效过滤器季度更换', notes:'含安装服务',
    poNo:'4100016742',
    lines:[
      {itemNo:10,matCode:'60001128',shortText:'初效过滤器-592*592*360-G4-袋式', reqQty:60,unit:'个',orderQty:60,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:95.00,totalValue:5700},
      {itemNo:20,matCode:'60001129',shortText:'初效过滤器-286*592*360-G4-袋式', reqQty:40,unit:'个',orderQty:40,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:75.00,totalValue:3000},
      {itemNo:30,matCode:'60001130',shortText:'初效过滤器-592*286*360-G4-袋式', reqQty:40,unit:'个',orderQty:40,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:75.00,totalValue:3000},
      {itemNo:40,matCode:'60001131',shortText:'初效过滤器-286*286*360-G4-袋式', reqQty:30,unit:'个',orderQty:30,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:55.00,totalValue:1650},
      {itemNo:50,matCode:'60001132',shortText:'中效过滤器-592*592*600-M5-袋式', reqQty:48,unit:'个',orderQty:48,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:120.00,totalValue:5760},
      {itemNo:60,matCode:'60001133',shortText:'中效过滤器-286*592*600-M5-袋式', reqQty:32,unit:'个',orderQty:32,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:100.00,totalValue:3200},
      {itemNo:70,matCode:'60001134',shortText:'中效过滤器-592*286*600-M5-袋式', reqQty:32,unit:'个',orderQty:32,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:100.00,totalValue:3200},
      {itemNo:80,matCode:'60001036',shortText:'中效过滤器-286*286 效率 M5铝合金框-袋长600-分6P', reqQty:24,unit:'个',orderQty:24,deliveryDate:'20260630',requiredDate:'20260610',deliveryDate2:'20260630',price:82.00,totalValue:1968}
    ]
  },
  {
    docNo:'2100003206', applyDate:'2026-05-16', plant:'2006 - 吉林天成制药工厂', dept:'设备部', applicant:'刘志强',
    status:'已撤回', wbsNo:'', purpose:'气管及接头备件采购', notes:'已撤回，需重新确认规格型号',
    poNo:'',
    lines:[
      {itemNo:10,matCode:'60001238',shortText:'宝塔式气路接头-管子直径10mm-螺纹口1/4', reqQty:50,unit:'个',orderQty:50,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:8.00,totalValue:400},
      {itemNo:20,matCode:'60001242',shortText:'T型接头-3/8"-10个/包-ZD-30703-77 PVDF', reqQty:10,unit:'个',orderQty:100,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:15.00,totalValue:150},
      {itemNo:30,matCode:'60001243',shortText:'T型接头-1/2"-10个/包-ZD-30703-78 PVDF', reqQty:10,unit:'个',orderQty:100,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:18.00,totalValue:180},
      {itemNo:40,matCode:'60001256',shortText:'直型接头-1/8"-10个/包-ZD-40703-02 PVDF', reqQty:15,unit:'个',orderQty:150,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:12.00,totalValue:180},
      {itemNo:50,matCode:'60001257',shortText:'直型接头-3/8"-10个/包-ZD-30703-07 PVDF', reqQty:15,unit:'个',orderQty:150,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:14.00,totalValue:210},
      {itemNo:60,matCode:'60001258',shortText:'直型接头-1/2"-10个/包-ZD-30703-08 PVDF', reqQty:15,unit:'个',orderQty:150,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:16.00,totalValue:240},
      {itemNo:70,matCode:'60001105',shortText:'气管变径-12mm变10mm', reqQty:30,unit:'个',orderQty:30,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:5.00,totalValue:150},
      {itemNo:80,matCode:'60001106',shortText:'气管三通-12mm三通', reqQty:40,unit:'个',orderQty:40,deliveryDate:'20260620',requiredDate:'20260605',deliveryDate2:'20260620',price:4.50,totalValue:180}
    ]
  },
  {
    docNo:'2100003307', applyDate:'2026-05-18', plant:'2010 - 保定天浩制药工厂', dept:'质量部', applicant:'赵雪梅',
    status:'已拒绝', wbsNo:'PRJ-2026-007', purpose:'QC实验室培养皿架及不锈钢配件采购', notes:'被拒原因：补充设备使用年限说明后重新提交',
    poNo:'',
    lines:[
      {itemNo:10,matCode:'60001271',shortText:'304不锈钢培养皿架-90mm培养皿-放40个-带可翻转提手', reqQty:6,unit:'个',orderQty:6,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:380.00,totalValue:2280},
      {itemNo:20,matCode:'60001272',shortText:'304不锈钢培养皿架-90mm培养皿-放80个-带可翻转提手', reqQty:4,unit:'个',orderQty:4,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:520.00,totalValue:2080},
      {itemNo:30,matCode:'60001273',shortText:'不锈钢试管架-40孔/个-孔径21mm', reqQty:10,unit:'个',orderQty:10,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:120.00,totalValue:1200},
      {itemNo:40,matCode:'60001293',shortText:'贴壁式不锈钢置物架-304不锈钢-30cm*15cm*12cm', reqQty:8,unit:'个',orderQty:8,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:160.00,totalValue:1280}
    ]
  },
  {
    docNo:'2100003408', applyDate:'2026-05-20', plant:'1000 - 山东步长制药工厂', dept:'设备部', applicant:'王海涛',
    status:'审批中', wbsNo:'PRJ-2026-008', purpose:'气路系统管道接头及过滤器更换', notes:'需304不锈钢材质',
    poNo:'4100017356',
    lines:[
      {itemNo:10,matCode:'60001249',shortText:'宝塔头-外径25mm-内径9.6mm-30700-60', reqQty:20,unit:'个',orderQty:20,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:18.00,totalValue:360},
      {itemNo:20,matCode:'60001250',shortText:'宝塔头-外径50mm-内径9.6mm-30700-49', reqQty:15,unit:'个',orderQty:15,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:25.00,totalValue:375},
      {itemNo:30,matCode:'60001251',shortText:'卡箍-25mm-30800-75-304L不锈钢', reqQty:40,unit:'个',orderQty:40,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:10.00,totalValue:400},
      {itemNo:40,matCode:'60001252',shortText:'卡箍-50mm-30800-76-304L不锈钢', reqQty:30,unit:'个',orderQty:30,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:15.00,totalValue:450},
      {itemNo:50,matCode:'60001278',shortText:'管路直角接头-φ51mm', reqQty:25,unit:'个',orderQty:25,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:12.00,totalValue:300},
      {itemNo:60,matCode:'60001274',shortText:'气管直通变径接头-PG8-6-接头φP15mm-接头总长39.5mm', reqQty:35,unit:'个',orderQty:35,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:6.50,totalValue:227.50},
      {itemNo:70,matCode:'60001122',shortText:'不锈钢快装直通过滤器-20"226-插口(K50.5)-304不锈钢-226', reqQty:5,unit:'个',orderQty:5,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:350.00,totalValue:1750},
      {itemNo:80,matCode:'60001112',shortText:'Y型过滤器滤网-长460mm*宽18mm-材质:304不锈钢-DN15', reqQty:10,unit:'个',orderQty:10,deliveryDate:'20260705',requiredDate:'20260615',deliveryDate2:'20260705',price:65.00,totalValue:650}
    ]
  },
  {
    docNo:'2100003509', applyDate:'2026-05-22', plant:'2013 - 杨凌步长制药工厂', dept:'质量部', applicant:'赵雪梅',
    status:'草稿', wbsNo:'', purpose:'计量器具及环境监测仪表采购', notes:'需提供第三方检定证书',
    poNo:'',
    lines:[
      {itemNo:10,matCode:'60001207',shortText:'砝码-F1等级 1000g', reqQty:2,unit:'个',orderQty:2,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:680.00,totalValue:1360},
      {itemNo:20,matCode:'60001202',shortText:'温湿度计-GJWS-A1', reqQty:5,unit:'个',orderQty:5,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:85.00,totalValue:425},
      {itemNo:30,matCode:'60001294',shortText:'电子数显温湿度表-黑白色-带背光', reqQty:8,unit:'个',orderQty:8,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:68.00,totalValue:544},
      {itemNo:40,matCode:'60001229',shortText:'仪表加温度探头', reqQty:4,unit:'个',orderQty:4,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:350.00,totalValue:1400},
      {itemNo:50,matCode:'60001259',shortText:'红外测温仪--50~600℃', reqQty:2,unit:'个',orderQty:2,deliveryDate:'20260701',requiredDate:'20260615',deliveryDate2:'20260701',price:420.00,totalValue:840}
    ]
  },
  {
    docNo:'2100003600', applyDate:'2026-05-24', plant:'2005 - 通化谷红制药工厂', dept:'生产部', applicant:'陈永刚',
    status:'审批中', wbsNo:'PRJ-2026-009', purpose:'配料罐硅胶垫圈及法兰垫片更换', notes:'需食品级硅胶/PTFE材质',
    poNo:'4100017892',
    lines:[
      {itemNo:10,matCode:'60001154',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径25*内径9', reqQty:100,unit:'个',orderQty:100,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:3.50,totalValue:350},
      {itemNo:20,matCode:'60001155',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径25*内径16', reqQty:100,unit:'个',orderQty:100,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:4.00,totalValue:400},
      {itemNo:30,matCode:'60001156',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径34*内径19', reqQty:80,unit:'个',orderQty:80,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:5.50,totalValue:440},
      {itemNo:40,matCode:'60001157',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径40*内径25', reqQty:80,unit:'个',orderQty:80,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:6.00,totalValue:480},
      {itemNo:50,matCode:'60001158',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径50.5*内径22', reqQty:60,unit:'个',orderQty:60,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:7.50,totalValue:450},
      {itemNo:60,matCode:'60001159',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径50.5*内径29', reqQty:60,unit:'个',orderQty:60,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:8.00,totalValue:480},
      {itemNo:70,matCode:'60001160',shortText:'硅胶垫圈EPDM-材质:硅胶-尺寸:外径50.5*内径35', reqQty:60,unit:'个',orderQty:60,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:8.50,totalValue:510},
      {itemNo:80,matCode:'60001104',shortText:'卡盘垫片-尺寸:4″-PTFE-卡盘外径:119mm-卡盘内径:97.4mm', reqQty:30,unit:'个',orderQty:30,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:18.00,totalValue:540},
      {itemNo:90,matCode:'60001151',shortText:'氟橡胶垫片FKM-材质:氟胶-尺寸:外径50.5*内径23.5', reqQty:40,unit:'个',orderQty:40,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:6.00,totalValue:240},
      {itemNo:100,matCode:'60001152',shortText:'氟橡胶垫片FKM-材质:氟胶-尺寸:外径50.5*内径30', reqQty:40,unit:'个',orderQty:40,deliveryDate:'20260620',requiredDate:'20260601',deliveryDate2:'20260620',price:6.50,totalValue:260}
    ]
  },
  {
    docNo:'2100003701', applyDate:'2026-05-26', plant:'2012 - 陕西步长高新制药工厂', dept:'设备部', applicant:'刘志强',
    status:'审批中', wbsNo:'', purpose:'原料药车间压力表年度校验更换', notes:'部分压力表损坏需更换',
    poNo:'4100018125',
    lines:[
      {itemNo:10,matCode:'60001281',shortText:'压力表-0-2.5MPa', reqQty:15,unit:'个',orderQty:15,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:85.00,totalValue:1275},
      {itemNo:20,matCode:'60001282',shortText:'压力表-0-40', reqQty:10,unit:'个',orderQty:10,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:75.00,totalValue:750},
      {itemNo:30,matCode:'60001283',shortText:'压力表-0-1.6MPa', reqQty:12,unit:'个',orderQty:12,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:78.00,totalValue:936},
      {itemNo:40,matCode:'60001284',shortText:'压力表-0-1MPa', reqQty:12,unit:'个',orderQty:12,deliveryDate:'20260625',requiredDate:'20260610',deliveryDate2:'20260625',price:78.00,totalValue:936}
    ]
  }
];

// ===== Spare Parts Picking / Material Requisition Page =====
const SpPick = {
  page: 1, pageSize: 20,
  filteredData: [],

  render() {
    this.filteredData = [...spPickData];
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">备件领用</div><div style="font-size:13px;opacity:0.8;">维修工单备品备件领料申请与管理</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-blue" onclick="SpPick.openCreateModal()"><span style="font-weight:700;font-size:16px;">+</span> 创建领料单据</button>
          </div>
        </div>
        <${''}!-- Filter Bar ${''}-->
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>领备单号</label><input type="text" id="pickDocNo" placeholder="领料单编号"></div>
          <div class="filter-group"><label>移动类型</label><select id="pickMoveType">
            <option value="">全部</option>
            <option value="311">311-领料</option>
            <option value="312">312-退库</option>
            <option value="261">261-转储</option>
            <option value="201">201-GI</option>
          </select></div>
          <div class="filter-group"><label>请领部门</label><select id="pickDept">
            <option value="">全部</option>
            <option value="设备部">设备部</option>
            <option value="生产部">生产部</option>
            <option value="质量部">质量部</option>
            <option value="仓储物流部">仓储物流部</option>
          </select></div>
          <div class="filter-group"><label>工厂</label><select id="pickPlant">
            <option value="">全部</option>
            ${FL_FACTORIES.map(f=>`<option value="${f.code}">${f.code} - ${f.name}</option>`).join('')}
          </select></div>
          <div class="filter-group"><label>状态</label><select id="pickStatus">
            <option value="">全部</option>
            <option value="草稿">草稿</option>
            <option value="待审批">待审批</option>
            <option value="已发放">已发放</option>
            <option value="部分完成">部分完成</option>
            <option value="已完成">已完成</option>
          </select></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="SpPick.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="SpPick.reset()">重置</button>
            <button class="btn btn-outline btn-sm" onclick="SpPick.printList()">打印</button>
            <button class="btn btn-outline btn-sm" onclick="SpPick.exportData()">导出</button>
          </div>
        </div>
        <${''}!-- Table ${''}-->
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table" style="min-width:1100px;">
            <thead><tr>
              <th>领备单号</th><th>移动类型</th><th>工厂</th><th>请领部门</th><th>收货单位</th>
              <th style="text-align:right;">行项目数</th><th>领料日期</th><th>申请人</th><th>状态</th>
              <th style="width:140px;">操作</th>
            </tr></thead>
            <tbody id="pickTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info">
            <span class="list-count" id="pickCount">共 ${this.filteredData.length} 条</span>
          </div>
          <div class="pagination">
            <button class="pagination-btn" id="pickPrev" disabled onclick="SpPick.prevPage()">‹</button>
            <span class="pagination-info" id="pickPageInfo">第 ${this.page} / ${Math.ceil(Math.max(this.filteredData.length,1)/this.pageSize)} 页</span>
            <button class="pagination-btn" id="pickNext" onclick="SpPick.nextPage()">›</button>
            <select class="page-size-select" id="pickPageSizeSel" onchange="SpPick.changePageSize()"><option value="20">20条</option><option value="40">40条</option><option value="80">80条</option></select>
          </div>
        </div>
      </div>
      <div id="pickModalContainer"></div>`;
  },

  init() {
    this.filteredData = [...spPickData];
    this.page = 1;
    this.renderTable();
  },

  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filteredData.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filteredData.length / this.pageSize) || 1;
    document.getElementById('pickCount').textContent = `共 ${this.filteredData.length} 条`;
    document.getElementById('pickPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('pickPrev').disabled = this.page <= 1;
    document.getElementById('pickNext').disabled = this.page >= totalPages;

    const sb = s => {
      const m = {'草稿':'badge-gray','待审批':'badge-blue','已发放':'badge-green','部分完成':'badge-yellow','已完成':'badge-green'};
      return `<span class="badge ${m[s]||'badge-gray'}">${esc(s)}</span>`;
    };
    const mt = t => ({ '311':'311-领料','312':'312-退库','261':'261-转储','201':'201-GI' })[t]||t;

    document.getElementById('pickTableBody').innerHTML = page.map(r => `<tr>
      <td><strong style="color:var(--primary);">${esc(r.docNo)}</strong></td>
      <td>${esc(mt(r.moveType))}</td>
      <td>${esc(r.plant)}</td>
      <td>${esc(r.dept)}</td>
      <td>${esc(r.recvUnit)}</td>
      <td style="text-align:right;">${r.lines.length}</td>
      <td>${esc(r.pickDate)}</td>
      <td>${esc(r.applicant)}</td>
      <td>${sb(r.status)}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="SpPick.viewDetail('${r.docNo}')">查看</button>
        ${r.status==='草稿'?`<button class="btn btn-primary btn-sm" onclick="SpPick.openEditModal('${r.docNo}')">修改</button>`:''}
        ${r.status==='草稿'||r.status==='待审批'?`<button class="btn btn-secondary btn-sm" onclick="SpPick.deleteReq('${r.docNo}')">删除</button>`:''}
      </td>
    </tr>`).join('');
  },

  search() {
    const docNo = document.getElementById('pickDocNo')?.value?.trim()||'';
    const moveType = document.getElementById('pickMoveType')?.value||'';
    const dept = document.getElementById('pickDept')?.value||'';
    const plant = document.getElementById('pickPlant')?.value||'';
    const status = document.getElementById('pickStatus')?.value||'';

    this.filteredData = spPickData.filter(r => {
      if(docNo && !r.docNo.includes(docNo)) return false;
      if(moveType && r.moveType !== moveType) return false;
      if(dept && r.dept !== dept) return false;
      if(plant && !r.plant.includes(plant)) return false;
      if(status && r.status !== status) return false;
      return true;
    });
    this.page=1; this.renderTable();
  },

  reset() {
    ['pickDocNo','pickMoveType','pickDept','pickPlant','pickStatus'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
    this.filteredData=[...spPickData]; this.page=1; this.renderTable();
  },

  prevPage(){if(this.page>1){this.page--;this.renderTable();}},
  nextPage(){const tp=Math.ceil(this.filteredData.length/this.pageSize)||1;if(this.page<tp){this.page++;this.renderTable();}},
  changePageSize(){this.pageSize=parseInt(document.getElementById('pickPageSizeSel')?.value||20);this.page=1;this.renderTable();},

  // ---- Create Modal (Screenshot 1) ----
  openCreateModal() {
    const today=new Date().toISOString().slice(0,10);
    document.getElementById('pickModalContainer').innerHTML=`
      <div class="modal-backdrop" id="pickCreateBackdrop" onclick="SpPick.closeModal()">
        <div class="modal modal-lg" style="max-width:1200px;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">创建领料单据</div>
            <button class="modal-close" onclick="SpPick.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:calc(92vh-140px);">
            <${''}!-- Header Info ${''}-->
            <div class="form-section">
              <div class="form-grid">
                <div class="form-group"><label>工厂<span class="req">*</span></label><select id="pickCFPlant">
                  ${FL_FACTORIES.map(f=>`<option value="${f.code}"${f.code==='1000'?' selected':''}>${f.code} - ${f.name}</option>`).join('')}
                </select></div>
                <div class="form-group"><label>库存状态</label><select id="pickCFStockSts">
                  <option value="非限制转存" selected>非限制转存</option>
                  <option value="限制使用">限制使用</option>
                  <option value="冻结">冻结</option>
                </select></div>
                <div class="form-group"><label>收货单位</label><input type="text" id="pickCFRecvUnit" placeholder="如 2010 脱心东区清精维"></div>
                <div class="form-group"><label>移动类型</label><select id="pickCFMoveType">
                  <option value="311" selected>311-领料</option>
                  <option value="312">312-退库</option>
                  <option value="261">261-转储</option>
                  <option value="201">201-GI</option>
                </select></div>
                <div class="form-group"><label>领料日期<span class="req">*</span></label><input type="date" id="pickCFDate" value="${today}"></div>
                <div class="form-group"><label>请领部门<span class="req">*</span></label><select id="pickCFDept">
                  <option value="">请选择</option>
                  <option value="设备部">设备部</option>
                  <option value="生产部">生产部</option>
                  <option value="质量部">质量部</option>
                  <option value="仓储物流部">仓储物流部</option>
                </select></div>
                <div class="form-group"><label>请领人</label><input type="text" id="pickCFPerson" placeholder="请领人姓名"></div>
              </div>
            </div>

            <${''}!-- Line Items Table ${''}-->
            <div class="form-section" style="margin-top:14px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
                <div class="form-section-title" style="margin-bottom:0;">物料明细</div>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-sm btn-outline" onclick="SpPick.addPickRow()" style="padding:4px 12px;font-size:12px;">+ 添加行</button>
                </div>
              </div>
              <div style="overflow-x:auto;">
                <table class="data-table" id="pickLinesTable" style="min-width:900px;">
                  <thead><tr>
                    <th style="width:40px;text-align:center;">#</th>
                    <th style="min-width:110px;"><span class="req">*</span> 物料编号</th>
                    <th style="min-width:220px;">物料描述</th>
                    <th style="min-width:75px;text-align:right;"><span class="req">*</span> 领料数量</th>
                    <th style="width:52px;">单位</th>
                    <th style="min-width:90px;">批次</th>
                    <th style="min-width:100px;"><span class="req">*</span> 需求日期</th>
                    <th style="width:42px;"></th>
                  </tr></thead>
                  <tbody id="pickLinesBody">
                    ${this.renderPickLineRow({matCode:'',shortText:'',reqQty:'',unit:'个',batch:'',needDate:today},0)}
                  </tbody>
                </table>
              </div>
              <div style="margin-top:8px;font-size:13px;color:var(--text-secondary);">
                提示：点击物料编号可输入或搜索；留空的行将被忽略
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="SpPick.closeModal()">取消</button>
            <button class="btn btn-outline" onclick="SpPick.submitCreate(true)">保存草稿</button>
            <button class="btn btn-primary" onclick="SpPick.submitCreate(false)">提交审批</button>
          </div>
        </div>
      </div>`;
  },

  renderPickLineRow(line,idx){
    return `<tr data-row="${idx}">
      <td style="text-align:center;color:var(--text-muted);font-weight:600;">${idx+1}</td>
      <td><div style="position:relative;display:flex;align-items:center;">
        <input type="text" value="${esc(line.matCode||'')}" placeholder="输入/点击查" style="padding:5px 28px 5px 8px;width:100%;border:1px solid var(--border);border-radius:4px;font-size:12px;" oninput="SpPick.onMatCodeInput(this)">
        <span style="position:absolute;right:4px;color:var(--text-muted);cursor:pointer;font-size:14px;" title="查询物料" onclick="SpPick.searchMaterial(this)">&#128269;</span>
      </div></td>
      <td><input type="text" value="${esc(line.shortText||'')}" placeholder="物料描述自动填充" readonly style="padding:5px 8px;width:100%;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f8fafc;"></td>
      <td style="padding:5px;"><input type="number" value="${line.reqQty||''}" min="0" step="any" style="width:72px;text-align:right;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:5px;"><span style="font-size:12px;display:inline-block;padding:6px 4px;">${esc(line.unit||'个')}</span></td>
      <td style="padding:5px;"><input type="text" value="${esc(line.batch||'')}" placeholder="请输入批次" style="width:84px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:5px;"><input type="date" value="${line.needDate||''}" style="width:94px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td style="padding:4px;"><button class="btn btn-sm" style="padding:3px 8px;font-size:18px;line-height:1;color:var(--danger);background:none;border:1px solid transparent;" onclick="SpPick.removePickRow(this)" title="删除此行">&times;</button></td>
    </tr>`;
  },

  addPickRow(){
    const tbody=document.getElementById('pickLinesBody');
    const idx=tbody.rows.length;
    const tr=document.createElement('tr');
    tr.innerHTML=this.renderPickLineRow({matCode:'',shortText:'',reqQty:'',unit:'个',batch:'',needDate:new Date().toISOString().slice(0,10)},idx);
    tbody.appendChild(tr);
    this.reindexPickRows();
  },

  removePickRow(btn){
    const tr=btn.closest('tr');
    if(document.getElementById('pickLinesBody').rows.length<=1){toast('至少保留一行');return;}
    tr.remove();this.reindexPickRows();
  },

  reindexPickRows(){
    const rows=document.querySelectorAll('#pickLinesBody tr');
    rows.forEach((r,i)=>{r.querySelector('td:first-child').textContent=i+1;});
  },

  onMatCodeInput(input){ /* auto-fill description from material master */ },

  searchMaterial(btn){ toast('物料查询功能（对接SAP物料主数据）'); },

  submitCreate(saveOnly){
    const f=id=>document.getElementById(id)?.value??'';
    if(!f('pickCFDept')){toast('请选择请领部门');return;}

    const docNo='PK'+String(Math.floor(Math.random()*900000000+100000000));
    const req={
      docNo:docNo,
      plant:f('pickCFPlant'),
      stockStatus:f('pickCFStockSts'),
      recvUnit:f('pickCFRecvUnit'),
      moveType:f('pickCFMoveType')||'311',
      pickDate:f('pickCFDate'),
      dept:f('pickCFDept'),
      applicant:f('pickCFPerson')||'当前用户',
      status:saveOnly?'草稿':'待审批',
      createDate:new Date().toISOString().slice(0,10)+' '+new Date().toTimeString().slice(0,8),
      lines:[]
    };

    const tbody=document.getElementById('pickLinesBody');
    let hasValid=false;
    for(let i=0;i<tbody.rows.length;i++){
      const r=tbody.rows[i];
      const mc=(r.cells[1]?.querySelector('input')?.value||'').trim();
      const st=(r.cells[2]?.querySelector('input')?.value||'').trim();
      const q=parseFloat(r.cells[3]?.querySelector('input')?.value)||0;
      if(!mc&&!st&&!q)continue;
      if(!mc||!q){toast(`请完整填写第${i+1}行的物料编号和数量`);return;}
      hasValid=true;
      req.lines.push({
        matCode:mc,shortText:st,reqQty:q,unit:'个',
        batch:r.cells[4]?.nextElementSibling?.querySelector('input')?.value||'',
        needDate:r.cells[6]?.querySelector('input')?.value||'',
        issuedQty:0,completedQty:0
      });
    }
    if(!hasValid){toast('请至少添加一条有效物料');return;}

    spPickData.unshift(req);
    this.closeModal();
    this.filteredData=[...spPickData];this.page=1;this.renderTable();
    toast(saveOnly?'领料单已保存为草稿':'领料单已提交审批');
  },

  // ---- Edit Modal (Screenshot 2) ----
  openEditModal(docNo){
    const req=spPickData.find(r=>r.docNo===docNo);if(!req)return;
    this.editingId=docNo;
    const linesHTML=req.lines.map((l,i)=>this.renderEditPickLine(l,i)).join('');

    document.getElementById('pickModalContainer').innerHTML=`
      <div class="modal-backdrop" id="pickEditBackdrop" onclick="SpPick.closeModal()">
        <div class="modal modal-lg" style="max-width:1250px;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">修改领料单 - ${esc(req.docNo)} <span class="badge badge-${req.status==='草稿'?'gray':req.status==='待审批'?'blue':'green'}">${esc(req.status)}</span></div>
            <button class="modal-close" onclick="SpPick.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="max-height:calc(92vh-140px);">
            <${''}!-- Search Condition ${''}-->
            <div style="background:#f0f9ff;padding:10px 16px;border-radius:6px;margin-bottom:12px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
              <span style="font-weight:600;font-size:13px;color:var(--primary-dark,#1d4ed8);">搜索条件</span>
              <div class="filter-group" style="margin:0;"><label>领备单号</label><input type="text" value="${esc(req.docNo)}" style="padding:5px 8px;width:150px;border:1px solid var(--border);border-radius:4px;font-size:12px;" disabled></div>
              <button class="btn btn-primary btn-sm" onclick="toast('查询完成')">查询</button>
            </div>

            <${''}!-- Filter Row ${''}-->
            <div class="filter-bar" style="padding:8px 16px;margin-bottom:10px;">
              <div class="filter-group" style="margin:0;"><label>移动类型</label><select id="pickEFMoveType" style="padding:5px 8px;font-size:12px;"><option value="${req.moveType}"selected>${req.moveType}-领料</option></select></div>
              <div class="filter-group" style="margin:0;"><label>领料日期</label><input type="date" value="${req.pickDate}" id="pickEFDate" style="padding:5px 8px;font-size:12px;"></div>
              <div class="filter-group" style="margin:0;"><label>请领部门</label><input type="text" value="${esc(req.dept)}" id="pickEFDept" style="padding:5px 8px;width:120px;font-size:12px;"></div>
              <div class="filter-group" style="margin:0;"><label>创建日期</label><input type="text" value="${req.createDate}" style="padding:5px 8px;width:160px;font-size:12px;background:#f8fafc;" disabled></div>
              <div class="filter-group" style="margin:0;"><label>领料日期</label><input type="text" value="${req.pickDate}" style="padding:5px 8px;width:130px;font-size:12px;background:#f8fafc;" disabled></div>
              <div class="filter-actions" style="margin-left:auto;">
                <button class="btn btn-primary btn-sm" onclick="SpPick.submitEdit()">保存修改</button>
                <button class="btn btn-outline btn-sm" onclick="SpPick.printSingle('${req.docNo}')">打印</button>
              </div>
            </div>

            <${''}!-- Edit Lines Table ${''}-->
            <div style="overflow-x:auto;">
              <table class="data-table" style="min-width:1050px;">
                <thead><tr>
                  <th style="width:45px;text-align:center;">项目</th>
                  <th style="width:36px;">消息</th>
                  <th style="min-width:110px;"><span class="req">*</span> 物料编号</th>
                  <th style="min-width:200px;">物料描述</th>
                  <th style="min-width:70px;text-align:right;">已得数量</th>
                  <th style="min-width:75px;text-align:right;"><span class="req">*</span> 领料数量</th>
                  <th style="width:48px;">单位</th>
                  <th style="min-width:85px;">批次</th>
                  <th style="min-width:100px;"><span class="req">*</span> 需求日期</th>
                  <th style="min-width:65px;text-align:center;">已完成</th>
                  <th style="width:42px;"></th>
                </tr></thead>
                <tbody id="pickEditLinesBody">${linesHTML}</tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="SpPick.closeModal()">取消</button>
          </div>
        </div>
      </div>`;
  },

  renderEditPickLine(line,idx){
    const completed=line.completedQty>=line.reqQty?true:false;
    return `<tr data-row="${idx}">
      <td style="text-align:center;font-weight:600;color:var(--primary);">${(idx+1)*10}</td>
      <td style="text-align:center;"><input type="checkbox" ${completed?'checked':''} ${completed?'disabled':''}></td>
      <td><input type="text" value="${esc(line.matCode)}" readonly style="padding:5px 8px;width:100%;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f8fafc;"></td>
      <td><input type="text" value="${esc(line.shortText)}" readonly style="padding:5px 8px;width:100%;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f8fafc;"></td>
      <td style="text-align:right;padding:6px 4px;color:var(--text-secondary);">${Number(line.issuedQty||0).toLocaleString()}</td>
      <td style="padding:5px;"><input type="number" value="${line.reqQty}" min="0" step="any" style="width:68px;text-align:right;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;" ${completed?'disabled style="background:#f8fafc;"':''}></td>
      <td style="text-align:center;font-size:12px;">${esc(line.unit||'个')}</td>
      <td style="padding:5px;"><input type="text" value="${esc(line.batch||'')}" style="width:78px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;" ${completed?'disabled style="background:#f8fafc;"':''}></td>
      <td style="padding:5px;"><input type="date" value="${line.needDate||''}" style="width:94px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;" ${completed?'disabled style="background:#f8fafc;"':''}></td>
      <td style="text-align:center;font-weight:700;color:${completed?'var(--success,#16a34a)':'var(--text-muted)'};">${completed?'是':'否'}</td>
      <td style="padding:4px;"><button class="btn btn-sm" style="padding:3px 8px;font-size:18px;line-height:1;color:var(--danger);background:none;border:1px solid transparent;" onclick="SpPick.removeEditPickRow(this)" title="删除此行">&times;</button></td>
    </tr>`;
  },

  removeEditPickRow(btn){
    const tr=btn.closest('tr');
    if(document.getElementById('pickEditLinesBody').rows.length<=1){toast('至少保留一行');return;}
    tr.remove();
  },

  submitEdit(){
    if(!this.editingId)return;
    const req=spPickData.find(r=>r.docNo===this.editingId);if(!req)return;
    const tbody=document.getElementById('pickEditLinesBody');
    for(let i=0;i<tbody.rows.length;i++){
      const r=tbody.rows[i];
      const q=parseFloat(r.cells[5]?.querySelector('input')?.value)||0;
      const batch=r.cells[7]?.querySelector('input')?.value||'';
      const nd=r.cells[8]?.querySelector('input')?.value||'';
      if(req.lines[i]){
        req.lines[i].reqQty=q;
        req.lines[i].batch=batch;
        req.lines[i].needDate=nd;
      }
    }
    req.pickDate=document.getElementById('pickEFDate')?.value||req.pickDate;
    req.dept=document.getElementById('pickEFDept')?.value||req.dept;
    this.closeModal();
    this.filteredData=[...spPickData];this.renderTable();
    toast('领料单修改已保存');
  },

  // ---- View Detail ----
  viewDetail(docNo){
    const req=spPickData.find(r=>r.docNo===docNo);if(!req)return;
    const sb=s=>{const m={'草稿':'gray','待审批':'blue','已发放':'green','部分完成':'yellow','已完成':'green'};return `<span class="badge badge-${m[s]||'gray'}">${esc(s)}</span>`;};
    const totalReq=req.lines.reduce((s,l)=>s+(l.reqQty||0),0);

    const html=`<div class="modal-backdrop" id="pickDetailBackdrop" onclick="SpPick.closeDetail()">
      <div class="modal" style="max-width:950px;" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">领料单详情 - ${esc(req.docNo)} ${sb(req.status)}</div>
          <button class="modal-close" onclick="SpPick.closeDetail()">✕</button>
        </div>
        <div class="modal-body" style="max-height:calc(85vh-120px);">
          <div class="form-section">
            <div class="form-section-title">表头信息</div>
            <div class="detail-grid">
              <div class="detail-item"><dt>领备单号</dt><dd><strong>${esc(req.docNo)}</strong></dd></div>
              <div class="detail-item"><dt>状态</dt><dd>${sb(req.status)}</dd></div>
              <div class="detail-item"><dt>移动类型</dt><dd>${esc(req.moveType)}</dd></div>
              <div class="detail-item"><dt>工厂</dt><dd>${esc(req.plant)}</dd></div>
              <div class="detail-item"><dt>请领部门</dt><dd>${esc(req.dept)}</dd></div>
              <div class="detail-item"><dt>申请人</dt><dd>${esc(req.applicant)}</dd></div>
              <div class="detail-item"><dt>收货单位</dt><dd>${esc(req.recvUnit||'-')}</dd></div>
              <div class="detail-item"><dt>领料日期</dt><dd>${esc(req.pickDate)}</dd></div>
              <div class="detail-item"><dt>创建时间</dt><dd>${esc(req.createDate)}</dd></div>
            </div>
          </div>
          <div class="form-section" style="margin-top:16px;">
            <div class="form-section-title">行项目 (${req.lines.length} 项，合计领料 ${totalReq.toLocaleString()} )</div>
            <table class="data-table" style="min-width:850px;">
              <thead><tr>
                <th>项目</th><th>物料编号</th><th>物料描述</th><th style="text-align:right;">领料数量</th><th>单位</th>
                <th style="text-align:right;">已发数量</th><th>批次</th><th>需求日期</th><th style="text-align:center;">已完成</th>
              </tr></thead>
              <tbody>${req.lines.map((l,i)=>`<tr>
                <td style="text-align:center;">${(i+1)*10}</td>
                <td><strong>${esc(l.matCode)}</strong></td>
                <td>${esc(l.shortText)}</td>
                <td style="text-align:right;">${Number(l.reqQty).toLocaleString()}</td>
                <td style="text-align:center;">${esc(l.unit)}</td>
                <td style="text-align:right;color:var(--text-secondary);">${Number(l.issuedQty||0).toLocaleString()}</td>
                <td>${esc(l.batch||'-')}</td>
                <td>${esc(l.needDate||'-')}</td>
                <td style="text-align:center;font-weight:700;color:${l.completedQty>=l.reqQty?'var(--success,#16a34a)':'var(--text-muted)'};">${l.completedQty>=l.reqQty?'是':'否'}</td>
              </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="SpPick.closeDetail()">关闭</button>
          <button class="btn btn-outline btn-sm" onclick="SpPick.printSingle('${req.docNo}')">打印</button>
          <button class="btn btn-outline btn-sm" onclick="SpPick.exportData()">导出</button>
        </div>
      </div>
    </div>`;
    document.getElementById('pickModalContainer').innerHTML=html;
  },

  closeDetail(){document.getElementById('pickModalContainer').innerHTML='';},
  closeModal(){document.getElementById('pickModalContainer').innerHTML='';},
  deleteReq(docNo){
    if(confirm('确定要删除领料单 '+docNo+' 吗？')){
      const idx=spPickData.findIndex(r=>r.docNo===docNo);
      if(idx>=0)spPickData.splice(idx,1);
      this.filteredData=[...spPickData];this.page=1;this.renderTable();toast('已删除');
    }
  },
  printList(){toast('打印功能开发中...');},
  printSingle(docNo){toast('打印领料单 '+docNo+' ...');},
  exportData(){toast('导出功能开发中...');}
};

// ===== Demo Data for Spare Parts Pick =====
const spPickData = [
  {
    docNo:'PK260529001',moveType:'311',plant:'1000 - 山东步长制药工厂',dept:'设备部',applicant:'张建国',
    recvUnit:'2010 固体制剂车间清精维',stockStatus:'非限制转存',
    pickDate:'2026-05-29',createDate:'2026-05-29 08:15:30',status:'待审批',
    lines:[
      {matCode:'60001018',shortText:'高效过滤器-MIIPDF-635*520*93-27-AAF',reqQty:8,unit:'个',batch:'B20260501',needDate:'2026-06-01',issuedQty:0,completedQty:0},
      {matCode:'60001019',shortText:'高效过滤器-MIIPDF-635*762*93-27-AAF',reqQty:6,unit:'个',batch:'B20260502',needDate:'2026-06-01',issuedQty:0,completedQty:0},
      {matCode:'60001146',shortText:'隔膜阀膜片-DN15-材质:PTFE/EPDM-宝帝',reqQty:10,unit:'个',batch:'BM20260510',needDate:'2026-06-03',issuedQty:0,completedQty:0}
    ]
  },
  {
    docNo:'PK260528002',moveType:'311',plant:'2001 - 陕西步长制药工厂',dept:'设备部',applicant:'王海涛',
    recvUnit:'2001 发酵车间',stockStatus:'非限制转存',
    pickDate:'2026-05-28',createDate:'2026-05-28 09:20:00',status:'已发放',
    lines:[
      {matCode:'60001086',shortText:'O型圈-Φ360*5.7-材质:氟橡胶',reqQty:12,unit:'个',batch:'OR20260515',needDate:'2026-05-30',issuedQty:12,completedQty:12},
      {matCode:'60001087',shortText:'O型圈-Φ506*6.99-材质:氟橡胶',reqQty:8,unit:'个',batch:'OR20260515',needDate:'2026-05-30',issuedQty:8,completedQty:8},
      {matCode:'60001107',shortText:'金属缠绕石墨垫-DN50',reqQty:6,unit:'个',batch:'GD20260508',needDate:'2026-06-02',issuedQty:6,completedQty:6}
    ]
  },
  {
    docNo:'PK260527003',moveType:'311',plant:'1000 - 山东步长制药工厂',dept:'生产部',applicant:'李君',
    recvUnit:'1000 包装车间',stockStatus:'非限制转存',
    pickDate:'2026-05-27',createDate:'2026-05-27 14:30:00',status:'已完成',
    lines:[
      {matCode:'60001239',shortText:'插线板-10插位-5m',reqQty:5,unit:'个',batch:'EL20260420',needDate:'2026-05-28',issuedQty:5,completedQty:5},
      {matCode:'60000667',shortText:'插排-3插位',reqQty:10,unit:'个',batch:'EL20260420',needDate:'2026-05-28',issuedQty:10,completedQty:10},
      {matCode:'60000668',shortText:'插排-6插位',reqQty:8,unit:'个',batch:'EL20260421',needDate:'2026-05-28',issuedQty:8,completedQty:8},
      {matCode:'60001297',shortText:'插线板-8插位',reqQty:4,unit:'个',batch:'EL20260422',needDate:'2026-05-28',issuedQty:4,completedQty:4},
      {matCode:'60001353',shortText:'活动扳手-世达-8英寸-47250',reqQty:3,unit:'个',batch:'TOOL20260301',needDate:'2026-05-29',issuedQty:3,completedQty:3}
    ]
  },
  {
    docNo:'PK260526004',moveType:'311',plant:'2002 - 山东丹红制药工厂',dept:'设备部',applicant:'陈永刚',
    recvUnit:'2002 注射剂车间',stockStatus:'非限制转存',
    pickDate:'2026-05-26',createDate:'2026-05-26 10:00:00',status:'部分完成',
    lines:[
      {matCode:'60001170',shortText:'高效过滤器-850*850*93 H14AAF',reqQty:4,unit:'个',batch:'HF20260501',needDate:'2026-05-31',issuedQty:2,completedQty:2},
      {matCode:'60001169',shortText:'高效过滤器-575*575*93 H14AAF',reqQty:6,unit:'个',batch:'HF20260501',needDate:'2026-05-31',issuedQty:3,completedQty:3},
      {matCode:'60001171',shortText:'高效过滤器-450*850*93 H14AAF',reqQty:4,unit:'个',batch:'HF20260502',needDate:'2026-06-05',issuedQty:0,completedQty:0}
    ]
  },
  {
    docNo:'PK260525005',moveType:'311',plant:'1000 - 山东步长制药工厂',dept:'质量部',applicant:'赵雪梅',
    recvUnit:'1000 QC实验室',stockStatus:'非限制转存',
    pickDate:'2026-05-25',createDate:'2026-05-25 11:45:00',status:'已完成',
    lines:[
      {matCode:'60001207',shortText:'砝码-F1等级 1000g',reqQty:2,unit:'个',batch:'CAL20260401',needDate:'2026-05-26',issuedQty:2,completedQty:2},
      {matCode:'60001202',shortText:'温湿度计-GJWS-A1',reqQty:3,unit:'个',batch:'ENV20260415',needDate:'2026-05-26',issuedQty:3,completedQty:3},
      {matCode:'60001294',shortText:'电子数显温湿度表-黑白色-带背光',reqQty:5,unit:'个',batch:'ENV20260415',needDate:'2026-05-27',issuedQty:5,completedQty:5},
      {matCode:'60001259',shortText:'红外测温仪--50~600℃',reqQty:1,unit:'个',batch:'TM20260420',needDate:'2026-05-27',issuedQty:1,completedQty:1}
    ]
  },
  {
    docNo:'PK260524006',moveType:'312',plant:'1000 - 山东步长制药工厂',dept:'设备部',applicant:'刘志强',
    recvUnit:'1000 备件仓库',stockStatus:'非限制转存',
    pickDate:'2026-05-24',createDate:'2026-05-24 16:00:00',status:'已完成',
    lines:[
      {matCode:'60001358',shortText:'活动扳手-世达-8英寸-47250',reqQty:2,unit:'个',batch:'TOOL20260301',needDate:'2026-05-25',issuedQty:2,completedQty:2}
    ]
  },
  {
    docNo:'PK260523007',moveType:'311',plant:'2010 - 保定天浩制药工厂',dept:'设备部',applicant:'王海涛',
    recvUnit:'2010 原料药车间',stockStatus:'非限制转存',
    pickDate:'2026-05-23',createDate:'2026-05-23 09:00:00',status:'草稿',
    lines:[
      {matCode:'60001281',shortText:'压力表-0-2.5MPa',reqQty:5,unit:'个',batch:'',needDate:'2026-06-01',issuedQty:0,completedQty:0},
      {matCode:'60001282',shortText:'压力表-0-40',reqQty:3,unit:'个',batch:'',needDate:'2026-06-01',issuedQty:0,completedQty:0},
      {matCode:'60001283',shortText:'压力表-0-1.6MPa',reqQty:4,unit:'个',batch:'',needDate:'2026-06-01',issuedQty:0,completedQty:0},
      {matCode:'60001284',shortText:'压力表-0-1MPa',reqQty:4,unit:'个',batch:'',needDate:'2026-06-01',issuedQty:0,completedQty:0},
      {matCode:'60001259',shortText:'红外测温仪--50~600℃',reqQty:1,unit:'个',batch:'',needDate:'2026-06-05',issuedQty:0,completedQty:0},
      {matCode:'60001261',shortText:'投料袋支架-5L投料袋支架',reqQty:2,unit:'个',batch:'',needDate:'2026-06-10',issuedQty:0,completedQty:0},
      {matCode:'60001262',shortText:'投料袋支架-15L投料袋支架',reqQty:2,unit:'个',batch:'',needDate:'2026-06-10',issuedQty:0,completedQty:0},
      {matCode:'60001351',shortText:'乙二醇浓度计-415',reqQty:1,unit:'个',batch:'',needDate:'2026-06-15',issuedQty:0,completedQty:0}
    ]
  }
];

// ===== 2.1 预防性维护计划 (合并旧3.1+3.2+3.3) =====
const MaintPreventive = {
  tab: 'plan', // plan | schedule | auto | calendar
  page: 1, pageSize: 10,
  // Plan filters
  pFilter: { code: '', name: '', planType: '', status: '' },
  // Schedule filters
  sFilter: { code: '', planName: '', triggerType: '', status: '' },
  // Auto-gen filters
  aFilter: { scheduleId: '', eqInfo: '', result: '' },
  // Calendar state
  calYear: 2026, calMonth: 6,

  render() {
    return `<div class="page-container" style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div><div style="font-size:18px;font-weight:700;">预防性维护计划</div><div style="font-size:13px;opacity:0.8;">维修流程 → 预防性维护计划 | 策略配置 · 计划调度 · 工单生成 · 执行日历</div></div>
        <div style="display:flex;gap:8px;">
          ${this.tab==='plan'?`<button class="btn btn-blue" onclick="MaintPreventive.createPlan()">+ 新增维护计划</button>`:''}
          ${this.tab==='schedule'?`<button class="btn btn-blue" onclick="MaintPreventive.createSchedule()">+ 新增调度方案</button><button class="btn" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.4);" onclick="MaintPreventive.runDailyAutoGen()">🔍 一键扫描生成</button>`:''}
          ${this.tab==='auto'?`<button class="btn btn-blue" onclick="MaintPreventive.manualGen()">手动触发生成</button><button class="btn" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.4);" onclick="MaintPreventive.runDailyAutoGen()">🔍 一键扫描生成</button>`:''}
        </div>
      </div>
      <div style="display:flex;gap:0;padding:0 24px;background:white;border-bottom:2px solid var(--border);flex-shrink:0;">
        ${['plan','schedule','auto','calendar'].map(t=>{
          const labels={plan:'维护计划列表',schedule:'计划调度',auto:'工单生成日志',calendar:'计划执行日历'};
          const active=this.tab===t;
          return `<button onclick="MaintPreventive.switchTab('${t}')" style="padding:10px 18px;border:none;background:transparent;color:${active?'var(--primary)':'var(--text-secondary)'};font-size:13px;font-weight:${active?'600':'400'};cursor:pointer;border-bottom:${active?'2px solid var(--primary)':'2px solid transparent'};margin-bottom:-2px;transition:all .15s;">${labels[t]}</button>`;
        }).join('')}
      </div>
      <div style="flex:1;overflow-y:auto;" id="pvTabContent">
        ${this._renderCurrentTab()}
      </div>
    </div>`;
  },

  _renderCurrentTab() {
    if (this.tab === 'plan') return this._renderPlanTab();
    if (this.tab === 'schedule') return this._renderScheduleTab();
    if (this.tab === 'auto') return this._renderAutoTab();
    if (this.tab === 'calendar') return this._renderCalendarTab();
    return '';
  },

  init() { this.tab = 'plan'; this.page = 1; },

  switchTab(t) {
    this.tab = t; this.page = 1;
    const ca = document.getElementById('contentArea');
    if (ca) ca.innerHTML = this.render();
  },

  goPage(p) { this.page = Math.max(1, p); this._refreshContent(); },

  _refreshContent() {
    const el = document.getElementById('pvTabContent');
    if (el) el.innerHTML = this._renderCurrentTab();
  },

  // ======================== TAB 1: 维护计划列表 ========================
  _renderPlanTab() {
    const f = this.pFilter;
    let data = [...pmPlanData];
    if (f.code) data = data.filter(d => d.code.toLowerCase().includes(f.code.toLowerCase()));
    if (f.name) data = data.filter(d => d.name.toLowerCase().includes(f.name.toLowerCase()));
    if (f.planType) data = data.filter(d => d.planType === f.planType);
    if (f.status) data = data.filter(d => d.status === f.status);
    const total = data.length, totalPages = Math.ceil(total / this.pageSize);
    const start = (this.page - 1) * this.pageSize, pageData = data.slice(start, start + this.pageSize);
    const typeOpts = [
      { value:'counter',label:'基于计数器' },
      { value:'time',label:'基于时间' }
    ].map(o => `<option value="${o.value}" ${f.planType===o.value?'selected':''}>${o.label}</option>`).join('');
    const statusOpts = pmPlanStatusOptions.map(o => `<option value="${o.value}" ${f.status===o.value?'selected':''}>${o.label}</option>`).join('');
    const pagerHtml = this._renderPagination(total, totalPages);

    return `<div style="padding:16px 24px;display:flex;flex-direction:column;height:100%;">
      <div class="filter-bar">
        <div class="filter-group"><label>计划编码</label><input type="text" value="${esc(f.code)}" onchange="MaintPreventive.pFilter.code=this.value;MaintPreventive.searchPlan()" placeholder="计划编码"></div>
        <div class="filter-group"><label>计划名称</label><input type="text" value="${esc(f.name)}" onchange="MaintPreventive.pFilter.name=this.value;MaintPreventive.searchPlan()" placeholder="计划名称"></div>
        <div class="filter-group"><label>策略类型</label><select onchange="MaintPreventive.pFilter.planType=this.value;MaintPreventive.searchPlan()"><option value="">全部类型</option>${typeOpts}</select></div>
        <div class="filter-group"><label>状态</label><select onchange="MaintPreventive.pFilter.status=this.value;MaintPreventive.searchPlan()"><option value="">全部状态</option>${statusOpts}</select></div>
        <div class="filter-actions"><button class="btn btn-primary btn-sm" onclick="MaintPreventive.searchPlan()">查询</button><button class="btn btn-secondary btn-sm" onclick="MaintPreventive.resetPlanFilter()">重置</button></div>
      </div>
      <div class="table-wrapper" style="flex:1;overflow:auto;margin-top:12px;"><table class="data-table"><thead><tr>
        <th>计划编码</th><th>计划描述</th><th>策略类型</th><th>周期</th><th>设备/位置</th><th>工作中心</th><th>版本</th><th>状态</th><th>操作</th>
      </tr></thead><tbody>${pageData.map(d => {
        const s = pmPlanStatusOptions.find(o => o.value === d.status);
        const strategyLabel = d.planType === 'counter' ? '基于计数器' : d.planType === 'time' ? '基于时间' : '--';
        const stCls = d.planType === 'counter' ? 'badge-purple' : 'badge-blue';
        const cycleText = d.cycleValue ? `${d.cycleValue} ${d.cycleUnit||''}` : '--';
        const eqName = (d.devices && d.devices.length > 0) ? esc(d.devices[0].eqName) : (d.flInfo ? esc(d.flInfo.flName) : '--');
        return `<tr>
          <td><strong>${esc(d.code)}</strong></td>
          <td>${esc(d.name)}</td>
          <td><span class="badge badge-sm ${stCls}">${strategyLabel}</span></td>
          <td style="font-size:12px;">${cycleText}</td>
          <td style="font-size:12px;">${eqName}</td>
          <td style="font-size:12px;">${esc(d.workCenterName)}</td>
          <td>${esc(d.version)}</td>
          <td><span class="badge ${s?s.cls:'badge-gray'}">${s?s.label:d.status}</span></td>
          <td class="table-actions">${this._planRowActions(d)}</td>
        </tr>`;
      }).join('')}</tbody></table></div>
      ${pagerHtml}
    </div>`;
  },

  _planRowActions(d) {
    let btns = `<button class="btn btn-blue btn-sm" onclick="MaintPreventive.viewPlan('${d.id}')">查看</button>`;
    if (d.status === 'active') {
      btns += ` <button class="btn btn-sm" style="background:#fef3c7;color:#92400e;border:none;" onclick="MaintPreventive.disablePlan('${d.id}')">失效</button>`;
    }
    if (d.status === 'inactive') btns += ` <button class="btn btn-sm" style="background:#d1fae5;color:#065f46;border:none;" onclick="MaintPreventive.enablePlan('${d.id}')">生效</button>`;
    return btns;
  },

  searchPlan() { this.page = 1; this._refreshContent(); },
  resetPlanFilter() { this.pFilter = { code: '', name: '', planType: '', status: '' }; this.page = 1; this._refreshContent(); },

  createPlan() {
    const eqOpts = equipmentData.map(e => `<option value="${e.id}">${esc(e.code)} | ${esc(e.name)}</option>`).join('');
    const flOpts = Object.values(locationData).map(l => `<option value="${l.id}">${esc(l.id)} | ${esc(l.name)}</option>`).join('');
    const wcOpts = (wcMockData || []).map(w => `<option value="${w.id}">${esc(w.name)}</option>`).join('');
    const publishedTaskLists = (taskListMockData || []).filter(t => t.PLNST === '已发布');
    const tlOpts = publishedTaskLists.map(t => `<option value="${t.id}">${esc(t.PLNNR)} | ${esc(t.PLTXT)}</option>`).join('');

    const now = new Date();
    const todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

    showModal('新建维护计划', `
      <div class="plan-create-single" style="max-height:70vh;overflow-y:auto;padding-right:4px;">

        <!-- 计划描述 -->
        <div style="margin-bottom:18px;">
          <label style="font-weight:600;font-size:14px;display:block;margin-bottom:6px;">计划描述 <span class="req">*</span></label>
          <input type="text" id="pvPlanDesc" placeholder="如：每2000h例行保养" style="width:100%;padding:10px 12px;font-size:14px;border:1px solid var(--border);border-radius:6px;">
        </div>

        <!-- 基础信息 -->
        <div style="font-size:13px;font-weight:700;color:var(--text-secondary);padding:8px 0;margin-bottom:8px;border-bottom:1px dashed var(--border);">基础信息</div>
        <div class="form-grid">
          <div class="form-group">
            <label>设备 <span class="req">*</span></label>
            <select id="pvPlanEq" onchange="MaintPreventive._planOnEqChange()">
              <option value="">搜索/选择设备...</option>${eqOpts}
            </select>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">也可选择功能位置，二选一必填</div>
          </div>
          <div class="form-group">
            <label>功能位置</label>
            <select id="pvPlanFL" onchange="MaintPreventive._planOnFLChange()">
              <option value="">搜索/选择功能位置...</option>${flOpts}
            </select>
          </div>
          <div class="form-group">
            <label>设备/位置名称</label>
            <input type="text" id="pvPlanEqName" readonly style="background:#f9fafb;" placeholder="自动带出（只读）">
          </div>
          <div class="form-group">
            <label>策略类型 <span class="req">*</span></label>
            <select id="pvPlanStrategy" onchange="MaintPreventive._planOnStrategyChange()">
              <option value="counter">基于计数器</option>
              <option value="time">基于时间</option>
            </select>
          </div>
          <div class="form-group">
            <label>状态</label>
            <select id="pvPlanStatus">
              <option value="active">活跃</option>
              <option value="inactive">停用</option>
            </select>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">新建默认活跃，可停用</div>
          </div>
        </div>

        <!-- 策略参数（动态区域） -->
        <div style="font-size:13px;font-weight:700;color:var(--text-secondary);padding:8px 0;margin-bottom:8px;margin-top:4px;border-bottom:1px dashed var(--border);">策略参数</div>
        <div id="pvStrategyArea" style="margin-bottom:4px;"></div>

        <!-- 维护内容 -->
        <div style="font-size:13px;font-weight:700;color:var(--text-secondary);padding:8px 0;margin-bottom:8px;border-bottom:1px dashed var(--border);">维护内容</div>
        <div class="form-grid">
          <div class="form-group">
            <label>关联任务清单</label>
            <select id="pvPlanTaskList" onchange="MaintPreventive._planOnTaskListChange()">
              <option value="">搜索/选择任务清单...（可选）</option>${tlOpts}
            </select>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">可选，已发布的任务清单。选择后自动带出清单描述</div>
          </div>
          <div class="form-group">
            <label>任务清单描述</label>
            <input type="text" id="pvPlanTLDesc" readonly style="background:#f9fafb;" placeholder="自动带出（只读）">
          </div>
          <div class="form-group">
            <label>主要工作中心 <span class="req">*</span></label>
            <select id="pvPlanWC">
              <option value="">请选择工作中心</option>${wcOpts}
            </select>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">优先级：任务清单工作中心 > 设备主数据班组 > 手动选择</div>
          </div>
          <div class="form-group">
            <label>优先级</label>
            <select id="pvPlanPriority">
              <option value="normal">一般</option>
              <option value="important" selected>中</option>
              <option value="critical">高</option>
            </select>
          </div>
          <div class="form-group">
            <label>提前生成天数</label>
            <div style="display:flex;align-items:center;gap:8px;">
              <input type="number" id="pvPlanEarlyDays" value="7" min="0" max="90" style="width:80px;text-align:center;">
              <span style="font-size:13px;color:var(--text-secondary);">天</span>
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">到期前多少天自动生成工单，默认7天。仅基于时间的计划有效</div>
          </div>
        </div>

        <!-- 补充信息 -->
        <div style="font-size:13px;font-weight:700;color:var(--text-secondary);padding:8px 0;margin-bottom:8px;border-bottom:1px dashed var(--border);">补充信息</div>
        <div class="form-grid">
          <div class="form-group" style="grid-column:1/-1;">
            <label>长文本</label>
            <textarea id="pvPlanLongText" rows="3" placeholder="详细说明、特殊要求等" style="width:100%;resize:vertical;"></textarea>
          </div>
          <div class="form-group" style="grid-column:1/-1;">
            <label>附件</label>
            <div style="border:2px dashed var(--border);border-radius:8px;padding:16px;text-align:center;background:#fafbfc;">
              <span style="color:var(--text-muted);font-size:13px;">拖拽文件到此处或 <a href="javascript:void(0)" style="color:var(--primary);" onclick="MaintPreventive._planUploadFile()">点击上传</a></span>
            </div>
          </div>
        </div>

      </div>
    `, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '保存', cls: 'btn-primary', action: () => MaintPreventive._doCreatePlan() }
    ], 'modal-lg');

    // 初始化策略参数区域（默认基于计数器）
    this._planRenderStrategyCounter();
  },

  // ---- 策略类型切换 ----
  _planOnStrategyChange() {
    const type = document.getElementById('pvPlanStrategy').value;
    if (type === 'counter') {
      this._planRenderStrategyCounter();
    } else {
      this._planRenderStrategyTime();
    }
  },

  // ---- 渲染"基于时间"策略参数 ----
  _planRenderStrategyTime() {
    const today = new Date();
    // 默认下次到期日 = 当前日期 + 30天
    const defaultDue = new Date(today);
    defaultDue.setDate(defaultDue.getDate() + 30);
    const dueStr = defaultDue.getFullYear() + '-' + String(defaultDue.getMonth() + 1).padStart(2, '0') + '-' + String(defaultDue.getDate()).padStart(2, '0');

    const area = document.getElementById('pvStrategyArea');
    if (area) area.innerHTML = `
      <div class="form-grid">
        <div class="form-group">
          <label>周期类型 <span class="req">*</span></label>
          <select id="pvTimeCycleType">
            <option value="天">天</option>
            <option value="周">周</option>
            <option value="月" selected>月</option>
            <option value="年">年</option>
          </select>
        </div>
        <div class="form-group">
          <label>周期值 <span class="req">*</span></label>
          <input type="number" id="pvTimeCycleVal" value="3" min="1" style="width:100%;" placeholder="如：3">
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">如"每3个月"</div>
        </div>
        <div class="form-group">
          <label>下次到期日 <span class="req">*</span></label>
          <input type="date" id="pvTimeNextDue" value="${dueStr}">
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">系统自动计算：当前日期+周期，可修改</div>
        </div>
      </div>
      <div style="padding:8px 12px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;font-size:12px;color:#0369a1;margin-top:4px;">
        触发逻辑：到期前"提前生成天数"生成工单
      </div>
    `;
  },

  // ---- 渲染"基于计数器"策略参数 ----
  _planRenderStrategyCounter() {
    const eqId = document.getElementById('pvPlanEq').value;
    // 过滤该设备下类型为计数器的测量点
    let counterMPs = [];
    if (eqId) {
      counterMPs = measurementPointData.filter(mp => mp.equipmentId === eqId && mp.isCounter === true);
    }
    const mpOpts = counterMPs.map(mp => `<option value="${mp.id}" data-unit="${esc(mp.unit||'h')}">${esc(mp.code)} | ${esc(mp.name)} (${esc(mp.unit||'h')})</option>`).join('');

    const area = document.getElementById('pvStrategyArea');
    if (area) area.innerHTML = `
      <div class="form-grid">
        <div class="form-group">
          <label>计数器测量点 <span class="req">*</span></label>
          <select id="pvCounterMP" onchange="MaintPreventive._planOnCounterMPChange()">
            <option value="">选择测量点...</option>${mpOpts}
          </select>
          <div style="font-size:11px;color:${eqId?'var(--text-muted)':'var(--danger)'};margin-top:2px;">
            ${eqId ? (counterMPs.length > 0 ? '仅显示该设备下类型为"计数器"的测量点' : '该设备下暂无计数器测量点') : '请先选择设备'}
          </div>
        </div>
        <div class="form-group">
          <label>维护间隔 <span class="req">*</span></label>
          <div style="display:flex;align-items:center;gap:8px;">
            <input type="number" id="pvCounterInterval" value="2000" min="1" style="flex:1;" placeholder="数值">
            <select id="pvCounterUnit" style="width:100px;">
              <option value="h">小时</option>
              <option value="件">件</option>
              <option value="次">次</option>
            </select>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">填写数值，单位从测量点带出或手动选</div>
        </div>
        <div class="form-group">
          <label>当前累计读数</label>
          <input type="text" id="pvCounterCurrent" readonly style="background:#f9fafb;" placeholder="选择测量点后自动显示">
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">实时从系统读取计数器当前值，展示参考</div>
        </div>
        <div class="form-group">
          <label>上次维护读数</label>
          <input type="text" id="pvCounterLastMaint" readonly style="background:#f9fafb;" placeholder="上次工单完成时记录">
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">上次工单完成时记录的计数器读数</div>
        </div>
      </div>
      <div style="padding:8px 12px;background:#fefce8;border:1px solid #fef08a;border-radius:6px;font-size:12px;color:#854d0e;margin-top:4px;">
        触发逻辑：后台定期比对"当前累计读数 - 上次维护读数 ≥ 维护间隔"时，生成工单
      </div>
    `;
  },

  // ---- 设备选择变更 ----
  _planOnEqChange() {
    const eqId = document.getElementById('pvPlanEq').value;
    const nameInput = document.getElementById('pvPlanEqName');
    const flSelect = document.getElementById('pvPlanFL');
    // 选设备时清除功能位置选择
    if (eqId) {
      const eq = equipmentData.find(e => e.id === eqId);
      if (eq) {
        nameInput.value = eq.name;
        // 自动带出工作中心
        const wcSelect = document.getElementById('pvPlanWC');
        if (wcSelect && !wcSelect.value) {
          let wc = null;
          if (eq.team) wc = (wcMockData || []).find(w => w.name === eq.team);
          if (!wc && eq.workCenter) wc = (wcMockData || []).find(w => w.id === eq.workCenter);
          if (wc) wcSelect.value = wc.id;
        }
      }
      if (flSelect) flSelect.value = '';
    } else {
      nameInput.value = '';
    }
    // 如果策略类型是计数器，刷新计数器测量点列表
    const strategy = document.getElementById('pvPlanStrategy');
    if (strategy && strategy.value === 'counter') {
      this._planRenderStrategyCounter();
    }
  },

  // ---- 功能位置选择变更 ----
  _planOnFLChange() {
    const flId = document.getElementById('pvPlanFL').value;
    const nameInput = document.getElementById('pvPlanEqName');
    const eqSelect = document.getElementById('pvPlanEq');
    if (flId) {
      const loc = locationData[flId];
      if (loc) { nameInput.value = loc.name; }
      if (eqSelect) eqSelect.value = '';
    } else {
      nameInput.value = '';
    }
  },

  // ---- 计数器测量点选择变更 ----
  _planOnCounterMPChange() {
    const mpId = document.getElementById('pvCounterMP').value;
    const currentInput = document.getElementById('pvCounterCurrent');
    const lastMaintInput = document.getElementById('pvCounterLastMaint');
    const unitSelect = document.getElementById('pvCounterUnit');
    if (mpId) {
      const mp = measurementPointData.find(m => m.id === mpId);
      if (mp) {
        // 获取最新测量记录
        const latestRec = (measurementRecordData || [])
          .filter(r => r.measurementPointId === mpId && r.quantitativeValue !== null && r.quantitativeValue !== undefined)
          .sort((a, b) => new Date(b.recordTime) - new Date(a.recordTime))[0];
        if (latestRec) currentInput.value = latestRec.quantitativeValue;
        else currentInput.value = mp.initialCounter || '';
        // 上次维护读数：从计划扩展数据中查找匹配设备
        const matchingPlans = pmPlanData.filter(p => {
          const devs = p.devices || [];
          return devs.some(dd => dd.eqId === mp.equipmentId);
        });
        if (matchingPlans.length > 0) {
          const p = matchingPlans[0];
          lastMaintInput.value = (p.lastReading !== null && p.lastReading !== undefined) ? p.lastReading : '--';
        } else {
          lastMaintInput.value = '--';
        }
        // 自动设置单位
        if (unitSelect && mp.unit) {
          for (let i = 0; i < unitSelect.options.length; i++) {
            if (unitSelect.options[i].value === mp.unit) { unitSelect.selectedIndex = i; break; }
          }
        }
      }
    } else {
      currentInput.value = '';
      lastMaintInput.value = '';
    }
  },

  // ---- 任务清单选择变更 ----
  _planOnTaskListChange() {
    const tlId = document.getElementById('pvPlanTaskList').value;
    const descInput = document.getElementById('pvPlanTLDesc');
    const wcSelect = document.getElementById('pvPlanWC');
    if (tlId) {
      const tl = (taskListMockData || []).find(t => t.id === tlId);
      if (tl) {
        descInput.value = tl.PLTXT || '';
        // 自动带出工作中心：多级匹配
        if (wcSelect && !wcSelect.value) {
          let foundWc = null;
          // 1. 直接匹配 ARBPL 与 wcMockData.code
          if (tl.ARBPL) foundWc = (wcMockData || []).find(w => w.code === tl.ARBPL);
          // 2. 通过关联设备匹配：查找设备的 workCenter 或 team
          if (!foundWc && tl.associatedObj) {
            const eq = equipmentData.find(e => e.code === tl.associatedObj);
            if (eq) {
              if (eq.workCenter) foundWc = (wcMockData || []).find(w => w.id === eq.workCenter);
              if (!foundWc && eq.team) foundWc = (wcMockData || []).find(w => w.name === eq.team);
            }
          }
          if (foundWc) wcSelect.value = foundWc.id;
        }
      }
    } else {
      descInput.value = '';
    }
  },

  // ---- 附件上传 ----
  _planUploadFile() {
    toast('文件上传功能（可扩展对接OSS/本地存储）');
  },

  // ---- 保存计划 ----
  _doCreatePlan() {
    const desc = document.getElementById('pvPlanDesc').value.trim();
    const eqId = document.getElementById('pvPlanEq').value;
    const flId = document.getElementById('pvPlanFL').value;
    const strategy = document.getElementById('pvPlanStrategy').value;
    const status = document.getElementById('pvPlanStatus').value;
    const wcId = document.getElementById('pvPlanWC').value;
    const priority = document.getElementById('pvPlanPriority').value;
    const earlyDays = parseInt(document.getElementById('pvPlanEarlyDays').value) || 7;
    const longText = document.getElementById('pvPlanLongText').value.trim();

    // 必填项校验
    if (!desc) { toast('请输入计划描述！'); return; }
    if (!eqId && !flId) { toast('请选择设备或功能位置（二选一必填）！'); return; }
    if (!wcId) { toast('请选择主要工作中心！'); return; }

    // 策略参数校验
    let planType, cycleValue, cycleUnit, nextDueDate;
    if (strategy === 'counter') {
      const mpId = document.getElementById('pvCounterMP').value;
      const interval = document.getElementById('pvCounterInterval').value;
      const unit = document.getElementById('pvCounterUnit').value;
      if (!mpId) { toast('请选择计数器测量点！'); return; }
      if (!interval || parseInt(interval) <= 0) { toast('请输入有效的维护间隔！'); return; }
      planType = 'counter';
      cycleValue = parseInt(interval);
      cycleUnit = unit;
    } else {
      const cycleType = document.getElementById('pvTimeCycleType').value;
      const cycleVal = document.getElementById('pvTimeCycleVal').value;
      const nextDue = document.getElementById('pvTimeNextDue').value;
      if (!cycleVal || parseInt(cycleVal) <= 0) { toast('请输入有效的周期值！'); return; }
      if (!nextDue) { toast('请选择下次到期日！'); return; }
      planType = 'time';
      cycleValue = parseInt(cycleVal);
      cycleUnit = cycleType;
      nextDueDate = nextDue;
    }

    // 构建设备/位置信息
    let eqInfo = null, flInfo = null;
    let eqCategory = '', eqGroup = '', eqName = '';
    if (eqId) {
      const eq = equipmentData.find(e => e.id === eqId);
      if (eq) {
        eqInfo = { eqId: eq.id, eqCode: eq.code, eqName: eq.name, location: eq.location, locationName: eq.locationName, bindTime: new Date().toISOString().substring(0, 19).replace('T', ' ') };
        eqCategory = eq.category || '';
        eqGroup = eq.group || '';
        eqName = eq.name;
      }
    } else if (flId) {
      const loc = locationData[flId];
      if (loc) {
        flInfo = { flId: loc.id, flName: loc.name, flType: loc.type };
        eqName = loc.name;
      }
    }

    // 关联任务清单
    const tlId = document.getElementById('pvPlanTaskList').value;
    let ops = [], parts = [], associatedTaskList = null;
    if (tlId) {
      const tl = (taskListMockData || []).find(t => t.id === tlId);
      if (tl) {
        associatedTaskList = { id: tl.id, PLNNR: tl.PLNNR, PLNAL: tl.PLNAL };
        // 从任务清单复制工序
        if (tl.operations) {
          ops = tl.operations.map((o, i) => ({
            seq: String(i + 1), content: o.LTXA1 || o.content || '', guide: o.guide || '', safety: o.safety || '',
            gmp: o.gmp || '', stdHours: String(o.ARBEIT || o.stdHours || '0.5'), operator: o.operator || '维修工'
          }));
        }
        // 从任务清单复制物料（顶层 materials 或工序内嵌 components）
        const allMaterials = [];
        if (tl.materials && tl.materials.length > 0) {
          allMaterials.push(...tl.materials.map(m => ({ MATNR: m.matCode || '', MAKTX: m.matName || m.name || '', BDMNG: m.planQty || 1, MEINS: m.unit || '个' })));
        }
        if (tl.operations) {
          tl.operations.forEach(op => {
            if (op.components && op.components.length > 0) {
              allMaterials.push(...op.components);
            }
          });
        }
        // 去重（按 MATNR）
        const seen = new Set();
        const uniqueMaterials = allMaterials.filter(m => {
          const key = m.MATNR || '';
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        if (uniqueMaterials.length > 0) {
          parts = uniqueMaterials.map(m => ({
            matCode: m.MATNR || '', matName: m.MAKTX || '', spec: '', unit: m.MEINS || '个',
            planQty: m.BDMNG || 1, isKey: false, replaceCycle: '', remark: ''
          }));
        }
      }
    }

    // 工作中心
    const wc = (wcMockData || []).find(w => w.id === wcId);
    const wcName = wc ? wc.name : '';

    // 优先级映射
    const prioMap = { normal: '一般', important: '中', critical: '高' };
    const statusMap = { active: '已生效', inactive: '已失效' };

    // 生成计划编码
    const d = new Date();
    const code = 'JH-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + (pmPlanData.length + 1).toString().padStart(3, '0');
    const newId = 'PL' + String(pmPlanData.length + 1).padStart(3, '0');

    // 构建设备列表
    const devices = eqInfo ? [eqInfo] : [];

    // 获取当前计数器和上次维护读数
    let lastReading = null, currentReading = null;
    if (strategy === 'counter') {
      const mpId = document.getElementById('pvCounterMP').value;
      if (mpId) {
        const mp = measurementPointData.find(m => m.id === mpId);
        const currentVal = document.getElementById('pvCounterCurrent').value;
        currentReading = currentVal ? parseInt(currentVal) : (mp ? mp.initialCounter : null);
        const lastVal = document.getElementById('pvCounterLastMaint').value;
        lastReading = (lastVal && lastVal !== '--') ? parseInt(lastVal) : null;
      }
    }

    // 上次维护日期
    const lastMaintenanceDate = nextDueDate || '';

    // 推入数据
    pmPlanData.push({
      id: newId, code, name: desc,
      maintenanceType: 'monthly', maintenanceTypeName: '月保养',
      eqCategory, eqGroup,
      workCenter: wcId, workCenterName: wcName,
      stdHours: '4',
      priority,
      priorityName: prioMap[priority] || '中',
      version: 'V1.0',
      effectiveDate: d.toISOString().substring(0, 10),
      expireDate: '',
      creator: '当前用户',
      creatorTime: d.toISOString().substring(0, 19).replace('T', ' '),
      reviewer: '', reviewTime: '',
      status, statusName: statusMap[status] || '已生效',
      syncSAP: false,
      remark: longText,
      ops, parts, devices, attachments: [],
      // 扩展字段
      planType, cycleValue, cycleUnit, lastMaintenanceDate, lastReading, currentReading,
      associatedTaskList,
      estimatedDuration: '0.5天',
      nextDueDate: nextDueDate || '',
      earlyGenDays: earlyDays,
      flInfo: flInfo || null
    });

    toast('维护计划已创建：' + code);
    closeModal();
    this._refreshContent();
  },

  viewPlan(id) {
    const d = pmPlanData.find(x => x.id === id); if (!d) return;
    const s = pmPlanStatusOptions.find(o => o.value === d.status);
    const ops = d.ops || [], parts = d.parts || [], devs = d.devices || [];
    const strategyLabel = d.planType === 'counter' ? '基于计数器' : d.planType === 'time' ? '基于时间' : '--';
    const cycleText = d.cycleValue ? `${d.cycleValue} ${d.cycleUnit||''}` : '--';
    const tlText = d.associatedTaskList ? `${d.associatedTaskList.PLNNR||''}` : '未关联';
    showModal(`维护计划 ${esc(d.code)}`, `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border);">
        <div>
          <div style="font-size:20px;font-weight:700;color:var(--text);">${esc(d.name||d.code)}</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">${esc(d.code)} · <span class="badge ${s?s.cls:'badge-gray'}" style="font-size:12px;">${s?s.label:d.status}</span> · <span class="badge badge-sm ${d.planType==='counter'?'badge-purple':'badge-blue'}">${strategyLabel}</span></div>
        </div>
        <div style="display:flex;gap:8px;">${d.status==='active'?`<button class="btn btn-sm" style="background:#fef3c7;color:#92400e;border:none;" onclick="MaintPreventive.disablePlan('${d.id}');closeModal();">失效</button>`:d.status==='inactive'?`<button class="btn btn-sm" style="background:#d1fae5;color:#065f46;border:none;" onclick="MaintPreventive.enablePlan('${d.id}');closeModal();">生效</button>`:''}</div>
      </div>
      <div class="detail-grid">
        <div class="detail-item"><dt>计划编码</dt><dd>${esc(d.code)}</dd></div>
        <div class="detail-item"><dt>计划描述</dt><dd>${esc(d.name)}</dd></div>
        <div class="detail-item"><dt>策略类型</dt><dd>${strategyLabel}</dd></div>
        <div class="detail-item"><dt>维护周期</dt><dd>${cycleText}</dd></div>
        <div class="detail-item"><dt>设备/位置</dt><dd>${devs.length>0?esc(devs[0].eqName):(d.flInfo?esc(d.flInfo.flName):'--')}</dd></div>
        <div class="detail-item"><dt>工作中心</dt><dd>${esc(d.workCenterName)}</dd></div>
        <div class="detail-item"><dt>关联任务清单</dt><dd>${tlText}</dd></div>
        <div class="detail-item"><dt>优先级</dt><dd>${esc(d.priorityName||d.priority)}</dd></div>
        <div class="detail-item"><dt>提前生成天数</dt><dd>${d.earlyGenDays||7} 天</dd></div>
        <div class="detail-item"><dt>版本</dt><dd>${esc(d.version)}</dd></div>
        <div class="detail-item"><dt>创建人</dt><dd>${esc(d.creator)}</dd></div>
        <div class="detail-item"><dt>创建时间</dt><dd>${esc(d.creatorTime)}</dd></div>
      </div>
      ${d.remark?`<div style="margin-top:12px;background:#f8fafc;border-radius:8px;padding:16px;"><div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--text-secondary);">长文本</div><div style="font-size:13px;line-height:1.6;">${esc(d.remark)}</div></div>`:''}
      ${ops.length>0?`
        <div style="margin-top:14px;"><div style="font-weight:600;font-size:13px;margin-bottom:8px;">作业工序 (${ops.length})</div>
        <table class="data-table" style="font-size:12px;"><thead><tr><th>#</th><th>工序内容</th><th>标准工时</th><th>操作人</th></tr></thead>
        <tbody>${ops.map((o,i)=>`<tr><td>${i+1}</td><td>${esc(o.content)}</td><td>${esc(o.stdHours)}h</td><td>${esc(o.operator||'维修工')}</td></tr>`).join('')}</tbody></table></div>`:''}
      ${parts.length>0?`
        <div style="margin-top:14px;"><div style="font-weight:600;font-size:13px;margin-bottom:8px;">所需备件 (${parts.length})</div>
        <table class="data-table" style="font-size:12px;"><thead><tr><th>物料编码</th><th>名称</th><th>数量</th></tr></thead>
        <tbody>${parts.map(p=>`<tr><td>${esc(p.matCode)}</td><td>${esc(p.matName)}</td><td>${esc(p.planQty)} ${esc(p.unit)}</td></tr>`).join('')}</tbody></table></div>`:''}
    `, [{ text: '关闭', cls: 'btn-secondary', action: closeModal }], 'modal-lg');
  },

  enablePlan(id) {
    showModal('生效计划', '确定生效该维护计划？生效后可用于调度配置。', [
      { text: '取消', action: closeModal, cls: 'btn-secondary' },
      { text: '确认生效', action: () => { closeModal(); const p = pmPlanData.find(x => x.id === id); if (p) { p.status = 'active'; p.statusName = '已生效'; } this._refreshContent(); toast('计划已生效'); }, cls: 'btn-primary' }
    ]);
  },

  disablePlan(id) {
    showModal('失效计划', '失效后关联的调度方案将不生成新工单，确定失效？', [
      { text: '取消', action: closeModal, cls: 'btn-secondary' },
      { text: '确认失效', action: () => { closeModal(); const p = pmPlanData.find(x => x.id === id); if (p) { p.status = 'inactive'; p.statusName = '已失效'; } this._refreshContent(); toast('计划已失效'); }, cls: 'btn-primary' }
    ]);
  },

  copyPlan(id) {
    const src = pmPlanData.find(x => x.id === id); if (!src) return;
    const d = new Date();
    const code = 'JH-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + (pmPlanData.length + 1).toString().padStart(3, '0');
    const n = JSON.parse(JSON.stringify(src));
    n.id = 'PL' + (pmPlanData.length + 1).toString().padStart(3, '0'); n.code = code; n.name = src.name + '（副本）';
    n.status = 'active'; n.statusName = '已生效'; n.version = 'V1.0'; n.creator = '当前用户';
    n.creatorTime = d.toISOString().substring(0, 19).replace('T', ' ');
    pmPlanData.push(n);
    toast('已复制为新计划：' + code); this._refreshContent();
  },

  // ======================== TAB 2: 计划调度 ========================
  _renderScheduleTab() {
    const f = this.sFilter;
    let data = [...pmScheduleData];
    if (f.code) data = data.filter(d => d.code.toLowerCase().includes(f.code.toLowerCase()));
    if (f.planName) data = data.filter(d => d.planName.toLowerCase().includes(f.planName.toLowerCase()));
    if (f.triggerType) data = data.filter(d => d.triggerType === f.triggerType);
    if (f.status) data = data.filter(d => d.status === f.status);
    const total = data.length, totalPages = Math.ceil(total / this.pageSize);
    const start = (this.page - 1) * this.pageSize, pageData = data.slice(start, start + this.pageSize);
    const trigOpts = pmTriggerTypes.map(o => `<option value="${o.value}" ${f.triggerType===o.value?'selected':''}>${o.label}</option>`).join('');
    const sOpts = pmScheduleStatusOptions.map(o => `<option value="${o.value}" ${f.status===o.value?'selected':''}>${o.label}</option>`).join('');
    const pagerHtml = this._renderPagination(total, totalPages);

    return `<div style="padding:16px 24px;display:flex;flex-direction:column;height:100%;">
      <div class="filter-bar">
        <div class="filter-group"><label>调度编码</label><input type="text" value="${esc(f.code)}" onchange="MaintPreventive.sFilter.code=this.value;MaintPreventive.searchSchedule()" placeholder="调度编码"></div>
        <div class="filter-group"><label>关联计划</label><input type="text" value="${esc(f.planName)}" onchange="MaintPreventive.sFilter.planName=this.value;MaintPreventive.searchSchedule()" placeholder="计划名称"></div>
        <div class="filter-group"><label>触发类型</label><select onchange="MaintPreventive.sFilter.triggerType=this.value;MaintPreventive.searchSchedule()"><option value="">全部</option>${trigOpts}</select></div>
        <div class="filter-group"><label>状态</label><select onchange="MaintPreventive.sFilter.status=this.value;MaintPreventive.searchSchedule()"><option value="">全部</option>${sOpts}</select></div>
        <div class="filter-actions"><button class="btn btn-primary btn-sm" onclick="MaintPreventive.searchSchedule()">查询</button><button class="btn btn-secondary btn-sm" onclick="MaintPreventive.resetScheduleFilter()">重置</button></div>
      </div>
      <div class="table-wrapper" style="flex:1;overflow:auto;margin-top:12px;"><table class="data-table"><thead><tr>
        <th>调度编码</th><th>关联维护计划</th><th>触发类型</th><th>执行频率</th><th>覆盖设备</th><th>状态</th><th>最近生成</th><th>下次预计</th><th>操作</th>
      </tr></thead><tbody>${pageData.map(d => {
        const s = pmScheduleStatusOptions.find(o => o.value === d.status);
        const tt = pmTriggerTypes.find(o => o.value === d.triggerType);
        let freqText = d.frequency || '-';
        if (d.triggerType === 'hours') freqText = '每 ' + d.runHours + ' 小时';
        else if (d.triggerType === 'counter') freqText = '累计 ' + d.triggerCount + ' 次';
        else if (d.triggerType === 'combined') freqText = d.frequency + ' + ' + d.runHours + 'h';
        return `<tr>
          <td><strong>${esc(d.code)}</strong></td>
          <td style="font-size:12px;">${esc(d.planName)}<br><span style="color:var(--text-muted);">${esc(d.planCode)}</span></td>
          <td><span class="badge badge-sm ${d.triggerType==='time'?'badge-blue':d.triggerType==='hours'?'badge-green':d.triggerType==='counter'?'badge-purple':'badge-orange'}">${tt?tt.label:d.triggerType}</span></td>
          <td style="font-size:12px;">${freqText}</td>
          <td>${d.deviceCount} 台</td>
          <td><span class="badge ${s?s.cls:'badge-gray'}">${s?s.label:d.status}</span></td>
          <td style="font-size:12px;">${d.lastGenTime?d.lastGenTime.substring(0,10):'-'}</td>
          <td style="font-size:12px;">${d.nextGenTime?d.nextGenTime.substring(0,10):'-'}</td>
          <td class="table-actions">${this._scheduleRowActions(d)}</td>
        </tr>`;
      }).join('')}</tbody></table></div>
      ${pagerHtml}
    </div>`;
  },

  _scheduleRowActions(d) {
    let btns = '';
    if (d.status === 'active') btns += `<button class="btn btn-sm" style="background:#fef3c7;color:#92400e;border:none;" onclick="MaintPreventive.pauseSchedule('${d.id}')">暂停</button>`;
    if (d.status === 'active') btns += ` <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;" onclick="MaintPreventive.stopSchedule('${d.id}')">终止</button>`;
    if (d.status === 'paused') btns += `<button class="btn btn-sm" style="background:#d1fae5;color:#065f46;border:none;" onclick="MaintPreventive.activateSchedule('${d.id}')">启用</button>`;
    btns += ` <button class="btn btn-sm" style="background:#f1f5f9;color:#475569;border:1px solid var(--border);" onclick="MaintPreventive.viewScheduleLog('${d.id}')">日志</button>`;
    return btns || '-';
  },

  searchSchedule() { this.page = 1; this._refreshContent(); },
  resetScheduleFilter() { this.sFilter = { code: '', planName: '', triggerType: '', status: '' }; this.page = 1; this._refreshContent(); },

  createSchedule() {
    const planOpts = pmPlanData.filter(p => p.status === 'active').map(p => `<option value="${p.id}">${p.code} | ${p.name}</option>`).join('');
    showModal('新增调度方案', `
      <div class="form-grid">
        <div class="form-group"><label>关联维护计划<span class="req">*</span></label><select id="pvSchedPlan">${planOpts||'<option>暂无生效计划</option>'}</select></div>
        <div class="form-group"><label>调度名称<span class="req">*</span></label><input type="text" id="pvSchedName" placeholder="便于区分管理"></div>
        <div class="form-group"><label>触发类型</label><select id="pvSchedTrig">${pmTriggerTypes.map(o=>'<option value="'+o.value+'">'+o.label+'</option>').join('')}</select></div>
        <div class="form-group"><label>执行周期</label><input type="text" id="pvSchedFreq" value="每月" placeholder="如：每月、每季度"></div>
        <div class="form-group"><label>执行日期(号)</label><input type="number" id="pvSchedDay" value="1" min="1" max="31"></div>
        <div class="form-group"><label>执行时间</label><input type="time" id="pvSchedTime" value="08:00"></div>
        <div class="form-group"><label>允许提前(天)</label><input type="number" id="pvSchedEarly" value="3" min="0"></div>
        <div class="form-group"><label>允许延后(天)</label><input type="number" id="pvSchedLate" value="2" min="0"></div>
        <div class="form-group"><label>负责人</label><input type="text" id="pvSchedOwner" value="孙部长"></div>
        <div class="form-group"><label>部门</label><input type="text" id="pvSchedDept" value="设备部"></div>
      </div>
    `, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '创建', cls: 'btn-primary', action: () => {
        const planId = document.getElementById('pvSchedPlan').value;
        const name = document.getElementById('pvSchedName').value.trim();
        if (!planId || !name) { toast('请选择维护计划并输入调度名称！'); return; }
        const plan = pmPlanData.find(p => p.id === planId);
        pmScheduleData.push({
          id: 'SC' + String(pmScheduleData.length + 1).padStart(3, '0'),
          code: 'DD-' + new Date().toISOString().substring(0, 10).replace(/-/g, '') + '-' + String(pmScheduleData.length + 1).padStart(3, '0'),
          planId, planCode: plan ? plan.code : '', planName: plan ? plan.name : '', planType: plan ? plan.maintenanceType : 'monthly',
          scheduleName: name, triggerType: document.getElementById('pvSchedTrig').value, triggerTypeName: document.getElementById('pvSchedTrig').selectedOptions[0].text,
          frequency: document.getElementById('pvSchedFreq').value, execDay: parseInt(document.getElementById('pvSchedDay').value),
          execTime: document.getElementById('pvSchedTime').value, allowEarlyDays: parseInt(document.getElementById('pvSchedEarly').value),
          allowLateDays: parseInt(document.getElementById('pvSchedLate').value), deviceCount: 0, status: 'draft', statusName: '草稿',
          lastGenTime: '', nextGenTime: '', startDate: '', endDate: '', owner: document.getElementById('pvSchedOwner').value,
          dept: document.getElementById('pvSchedDept').value, autoDispatch: true, autoPickRemind: true
        });
        toast('调度方案已创建');
        closeModal(); this._refreshContent();
      }}
    ]);
  },

  activateSchedule(id) {
    showModal('启用调度', '确定启用该调度方案？启用后将按规则自动生成工单。', [
      { text: '取消', action: closeModal, cls: 'btn-secondary' },
      { text: '确认启用', action: () => { closeModal(); const s = pmScheduleData.find(x => x.id === id); if (s) { s.status = 'active'; s.statusName = '已启用'; } this._refreshContent(); toast('调度已启用'); }, cls: 'btn-primary' }
    ]);
  },

  pauseSchedule(id) {
    showModal('暂停调度', '暂停后不再自动生成工单，可随时恢复。', [
      { text: '取消', action: closeModal, cls: 'btn-secondary' },
      { text: '确认暂停', action: () => { closeModal(); const s = pmScheduleData.find(x => x.id === id); if (s) { s.status = 'paused'; s.statusName = '已暂停'; } this._refreshContent(); toast('调度已暂停'); }, cls: 'btn-primary' }
    ]);
  },

  stopSchedule(id) {
    showModal('终止调度', '终止后永久停止，无法恢复。确定终止？', [
      { text: '取消', action: closeModal, cls: 'btn-secondary' },
      { text: '确认终止', action: () => { closeModal(); const s = pmScheduleData.find(x => x.id === id); if (s) { s.status = 'stopped'; s.statusName = '已终止'; } this._refreshContent(); toast('调度已终止'); }, cls: 'btn-primary' }
    ]);
  },

  viewScheduleLog(id) {
    this.switchTab('auto');
  },

  // ======================== TAB 3: 工单生成日志 ========================
  _renderAutoTab() {
    // Stats
    const pendingCount = pmGenLogData.filter(d => d.result === 'pending').length;
    const successCount = pmGenLogData.filter(d => d.result === 'success').length;
    const failedCount = pmGenLogData.filter(d => d.result === 'failed').length;
    const todayPending = pmGenLogData.filter(d => d.result === 'pending' && d.planGenTime && d.planGenTime.substring(0, 10) <= new Date().toISOString().substring(0, 10)).length;

    const f = this.aFilter;
    let data = [...pmGenLogData];
    if (f.scheduleId) data = data.filter(d => d.scheduleId === f.scheduleId);
    if (f.eqInfo) data = data.filter(d => d.eqCode.toLowerCase().includes(f.eqInfo.toLowerCase()) || d.eqName.toLowerCase().includes(f.eqInfo.toLowerCase()));
    if (f.result) data = data.filter(d => d.result === f.result);
    const total = data.length, totalPages = Math.ceil(total / this.pageSize);
    const start = (this.page - 1) * this.pageSize, pageData = data.slice(start, start + this.pageSize);

    const schedOpts = pmScheduleData.map(s => `<option value="${s.id}" ${f.scheduleId===s.id?'selected':''}>${s.scheduleName}</option>`).join('');
    const resOpts = pmGenStatusOptions.map(o => `<option value="${o.value}" ${f.result===o.value?'selected':''}>${o.label}</option>`).join('');
    const pagerHtml = this._renderPagination(total, totalPages);

    return `<div style="padding:16px 24px;display:flex;flex-direction:column;height:100%;">
      <div class="stats-row" style="margin-bottom:16px;display:flex;gap:16px;">
        <div class="stat-card" style="flex:1;padding:16px;background:white;border:1px solid var(--border);border-radius:10px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#3B82F6;">${todayPending}</div><div style="font-size:12px;color:var(--text-secondary);">今日待生成</div></div>
        <div class="stat-card" style="flex:1;padding:16px;background:white;border:1px solid var(--border);border-radius:10px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#10B981;">${successCount}</div><div style="font-size:12px;color:var(--text-secondary);">已成功生成</div></div>
        <div class="stat-card" style="flex:1;padding:16px;background:white;border:1px solid var(--border);border-radius:10px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#DC2626;">${failedCount}</div><div style="font-size:12px;color:var(--text-secondary);">生成失败</div></div>
        <div class="stat-card" style="flex:1;padding:16px;background:white;border:1px solid var(--border);border-radius:10px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#F59E0B;">${pendingCount}</div><div style="font-size:12px;color:var(--text-secondary);">待补单数量</div></div>
      </div>
      <div class="filter-bar">
        <div class="filter-group"><label>调度方案</label><select onchange="MaintPreventive.aFilter.scheduleId=this.value;MaintPreventive.searchAuto()"><option value="">全部方案</option>${schedOpts}</select></div>
        <div class="filter-group"><label>设备</label><input type="text" value="${esc(f.eqInfo)}" onchange="MaintPreventive.aFilter.eqInfo=this.value;MaintPreventive.searchAuto()" placeholder="编码/名称"></div>
        <div class="filter-group"><label>生成状态</label><select onchange="MaintPreventive.aFilter.result=this.value;MaintPreventive.searchAuto()"><option value="">全部</option>${resOpts}</select></div>
        <div class="filter-actions"><button class="btn btn-primary btn-sm" onclick="MaintPreventive.searchAuto()">查询</button><button class="btn btn-secondary btn-sm" onclick="MaintPreventive.resetAutoFilter()">重置</button></div>
      </div>
      <div class="table-wrapper" style="flex:1;overflow:auto;margin-top:12px;"><table class="data-table"><thead><tr>
        <th>调度方案</th><th>设备</th><th>计划生成时间</th><th>实际生成时间</th><th>生成结果</th><th>工单编号</th><th>失败原因</th><th>操作</th>
      </tr></thead><tbody>${pageData.map(d => {
        const rs = pmGenStatusOptions.find(o => o.value === d.result);
        return `<tr>
          <td style="font-size:12px;">${esc(d.scheduleName)}<br><span style="color:var(--text-muted);">${esc(d.scheduleCode)}</span></td>
          <td style="font-size:12px;">${esc(d.eqCode)}<br><span style="color:var(--text-muted);">${esc(d.eqName)}</span></td>
          <td style="font-size:12px;">${d.planGenTime?d.planGenTime.substring(0,10):'-'}</td>
          <td style="font-size:12px;">${d.actualGenTime?d.actualGenTime.substring(0,16):'-'}</td>
          <td><span class="badge ${rs?rs.cls:'badge-gray'}">${rs?rs.label:d.result}</span></td>
          <td>${d.orderCode?`<strong style="color:var(--primary-lighter);cursor:pointer;" onclick="App.navigateTo('maintenance-flow','mf-workorder','mf-workorder','维修工单管理')">${esc(d.orderCode)}</strong>`:'<span style="color:var(--text-muted);">-</span>'}</td>
          <td style="font-size:11px;color:var(--danger);max-width:200px;">${esc(d.failReason||'-')}</td>
          <td class="table-actions">${d.result==='failed'?`<button class="btn btn-blue btn-sm" onclick="MaintPreventive.retryGen('${d.id}')">重试</button>`:d.result==='pending'?`<button class="btn btn-sm" style="background:#d1fae5;color:#065f46;border:none;" onclick="MaintPreventive.triggerGen('${d.id}')">触发生成</button>`:`<span style="color:var(--text-muted);">-</span>`}</td>
        </tr>`;
      }).join('')}</tbody></table></div>
      ${pagerHtml}
    </div>`;
  },

  searchAuto() { this.page = 1; this._refreshContent(); },
  resetAutoFilter() { this.aFilter = { scheduleId: '', eqInfo: '', result: '' }; this.page = 1; this._refreshContent(); },

  manualGen() {
    const schedOpts = pmScheduleData.filter(s => s.status === 'active').map(s => `<option value="${s.id}">${s.scheduleName} (${s.planCode})</option>`).join('');
    if (!schedOpts) { toast('没有可用的调度方案，请先启用调度！'); return; }
    showModal('手动批量生成工单', `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div class="form-group"><label>选择调度方案<span class="req">*</span></label><select id="mgSchedule">${schedOpts}</select></div>
        <div class="form-group"><label>生成范围</label><select id="mgScope"><option value="all">全部设备</option><option value="selected">指定设备</option></select></div>
        <div class="form-group"><label>生成周期</label><select id="mgPeriod"><option value="current">本次单次补单</option><option value="backlog">补全往期漏单</option></select></div>
      </div>
      <div style="margin-top:12px;padding:8px 12px;background:#f0fdf4;border-radius:6px;font-size:13px;color:#166534;">
        ⏳ 系统将根据调度方案的触发规则，自动生成对应设备的预防性维护工单（状态：编辑中）。
      </div>
    `, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '执行生成', cls: 'btn-primary', action: () => {
        const sid = document.getElementById('mgSchedule').value;
        const sched = pmScheduleData.find(s => s.id === sid);
        if (!sched) return;
        const plan = pmPlanData.find(p => p.id === sched.planId);
        if (!plan) { toast('未找到关联的维护计划！'); return; }
        const result = this._createPMWorkOrder(plan, sched, true, false);
        if (result.success) {
          toast(`✅ 工单 ${result.AUFNR} 已生成！（计划：${plan.name}，设备：${result.eqName}）`);
        } else if (result.blocked) {
          toast(`⚠ 该计划已有工单 ${result.AUFNR}，如需强制生成请从计划列表操作`);
        } else {
          toast(`❌ 生成失败：${result.msg}`);
        }
        closeModal(); this._refreshContent();
      }}
    ]);
  },

  batchReplenish() {
    // 批量补单：扫描所有漏单 -> 使用自动扫描逻辑
    this.runDailyAutoGen();
  },
  retryGen(id) {
    const log = pmGenLogData.find(x => x.id === id);
    if (!log) return;
    const sched = pmScheduleData.find(s => s.id === log.scheduleId);
    const plan = pmPlanData.find(p => p.id === (sched ? sched.planId : ''));
    if (!plan && sched) {
      toast('未找到关联的维护计划！'); return;
    }
    const result = this._createPMWorkOrder(plan, sched, true, true);
    if (result.success) {
      log.result = 'success'; log.resultName = '生成成功';
      log.orderCode = result.AUFNR; log.orderId = result.id;
      log.actualGenTime = new Date().toISOString().substring(0, 19).replace('T', ' ');
      log.failReason = '';
      toast(`✅ 重新生成成功！工单 ${result.AUFNR}`);
    } else {
      toast(`❌ 重新生成失败：${result.msg}`);
    }
    this._refreshContent();
  },
  triggerGen(id) {
    const log = pmGenLogData.find(x => x.id === id);
    if (!log) return;
    const sched = pmScheduleData.find(s => s.id === log.scheduleId);
    const plan = sched ? pmPlanData.find(p => p.id === sched.planId) : null;
    if (!plan) { toast('未找到关联的维护计划！'); return; }
    const result = this._createPMWorkOrder(plan, sched, true, false);
    if (result.success) {
      log.result = 'success'; log.resultName = '生成成功';
      log.orderCode = result.AUFNR; log.orderId = result.id;
      log.actualGenTime = new Date().toISOString().substring(0, 19).replace('T', ' ');
      log.operator = '当前用户';
      toast(`✅ 工单 ${result.AUFNR} 已生成！`);
    } else if (result.blocked) {
      toast(`⚠ 该计划已有工单 ${result.AUFNR}`);
    } else {
      toast(`❌ 生成失败：${result.msg}`);
    }
    this._refreshContent();
  },

  // ======================== 配置 & 工单生成引擎 (PRD §2~§3) ========================
  _genConfig: {
    earlyGenDays: 7,        // 时间型提前生成天数，默认7天
    defaultStatus: 'REL',   // REL=已审批待执行, APPR=待审批
    defaultPriority: '2-中', // 默认优先级
    creatorId: '系统自动',   // 自动生成时的创建人
  },

  /* ---- 防重检查 (PRD §2.1) ----
   * 检查同一计划是否已有未关闭的 PM01 工单
   * 返回：{ blocked: bool, existingAUFNR, reason }
   */
  _checkDuplicateOrder(planId) {
    const plan = pmPlanData.find(p => p.id === planId);
    if (!plan) return { blocked: false };
    // 查找该计划已生成且未关闭的工单（非 CLSD 状态即为未关闭）
    const existing = workOrderV2Data.find(wo =>
      wo.AUART === 'PM01' &&
      wo.sourceNo === plan.code &&
      wo.STAT !== 'CLSD'
    );
    if (existing) {
      return { blocked: true, existingAUFNR: existing.AUFNR, existingId: existing.id,
        reason: `维护计划 ${plan.code} 已有未关闭工单 ${existing.AUFNR}（状态：${existing.STAT_TXT}）` };
    }
    return { blocked: false };
  },

  /* ---- 判断时间型调度是否应生成 (PRD §2.1) ----
   * 下次到期日 ≤ 今天 + 提前生成天数
   */
  _shouldGenByTime(schedule) {
    const cfg = this._genConfig;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const deadline = new Date(today);
    deadline.setDate(deadline.getDate() + cfg.earlyGenDays);
    if (!schedule.nextGenTime) return false;
    const nextGen = new Date(schedule.nextGenTime);
    return nextGen <= deadline;
  },

  /* ---- 判断计数器型调度是否应生成 (PRD §2.1) ----
   * 当前计数器读数 ≥ 上次维护完成时的读数 + 维护间隔
   * 从测量点数据中获取当前计数器值
   */
  _shouldGenByCounter(schedule, plan) {
    if (!schedule.runHours || !schedule.currentHours) return false;
    // 上次维护完成时的读数：从上次成功生成的日志推算
    const lastGenLog = pmGenLogData
      .filter(g => g.scheduleId === schedule.id && g.result === 'success')
      .sort((a, b) => new Date(b.genTime) - new Date(a.genTime))[0];
    const lastCounter = lastGenLog ? (lastGenLog._lastCounterValue || schedule.initHours) : schedule.initHours;
    // 当前计数器值
    const devs = plan.devices || [];
    let currentCounter = schedule.currentHours;
    if (devs.length > 0) {
      // 尝试从测量记录获取最新计数器读数
      const eqId = devs[0].eqId;
      const counterMp = measurementPointData.find(mp =>
        mp.equipmentId === eqId && mp.isCounter === true);
      if (counterMp) {
        const lastRec = measurementRecordData
          .filter(r => r.measurementPointId === counterMp.id)
          .sort((a, b) => new Date(b.recordTime) - new Date(a.recordTime))[0];
        if (lastRec && lastRec.quantitativeValue !== null && lastRec.quantitativeValue !== undefined) {
          currentCounter = lastRec.quantitativeValue;
        }
      }
    }
    return (currentCounter - lastCounter) >= schedule.runHours;
  },

  /* ---- 核心：生成 PM01 工单 (PRD §3) ----
   * 参数：
   *   plan    - pmPlanData 项
   *   schedule - pmScheduleData 项（可为 null，手动生成时无调度）
   *   isManual - 是否手动触发
   *   force    - 是否强制生成（忽略防重）
   * 返回：{ success, AUFNR, id, msg }
   */
  _createPMWorkOrder(plan, schedule, isManual, force) {
    const cfg = this._genConfig;
    const now = new Date();
    const nowStr = now.toLocaleString('zh-CN');

    // 1) 防重检查（非强制时）
    if (!force) {
      const dup = this._checkDuplicateOrder(plan.id);
      if (dup.blocked) return { success: false, AUFNR: dup.existingAUFNR, msg: dup.reason, blocked: true };
    }

    // 2) 确定设备
    const devs = plan.devices || [];
    if (devs.length === 0) return { success: false, msg: '计划未关联任何设备，无法生成工单' };
    const dev = devs[0];
    const eq = equipmentData.find(e => e.id === dev.eqId);
    if (!eq) return { success: false, msg: `未找到设备 ${dev.eqCode}` };

    // 3) 生成工单号
    const maxNum = workOrderV2Data.reduce((max, wo) => {
      const n = parseInt(wo.AUFNR.replace('O', ''));
      return n > max ? n : max;
    }, 0);
    const AUFNR = 'O' + String(maxNum + 1).padStart(7, '0');
    const woId = 'WO' + String(workOrderV2Data.length + 1).padStart(5, '0');

    // 4) 计算计划日期
    const startDate = schedule && schedule.nextGenTime
      ? new Date(schedule.nextGenTime)
      : new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); // 默认明天
    const stdHours = parseFloat(plan.stdHours) || 4;
    const endDate = new Date(startDate.getTime() + Math.ceil(stdHours / 8) * 24 * 60 * 60 * 1000);
    const fmt = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' +
      String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    const startStr = fmt(startDate);
    const endStr = fmt(endDate);

    // 5) 构建描述
    const desc = `[${plan.name}] - ${eq.name}`;
    const priority = plan.priority === 'critical' ? '1-高' : plan.priority === 'important' ? '2-中' : cfg.defaultPriority;

    // 6) 确定任务清单号
    const taskListNo = plan.ops && plan.ops.length > 0 ? ('TL' + String(parseInt(plan.code.replace(/[^0-9]/g, '').substring(0, 6) || '1')).padStart(4, '0')) : '';

    // 7) 状态映射
    const orderStatus = isManual ? 'APPR' : cfg.defaultStatus; // 手动生成→待审批，自动→配置项
    const statLabel = orderStatus === 'APPR' ? '待审批' : '已审批/待执行';

    // 8) 推入数据
    workOrderV2Data.push({
      id: woId, AUFNR, AUART: 'PM01', AUART_TXT: 'PM01 - 预防性维护工单',
      EQUNR: eq.code, EQKTX: eq.name,
      KURZTEXT: desc, PRIOK: priority, STAT: orderStatus, STAT_TXT: statLabel,
      GSTRP: startStr, GLTRP: endStr, PERNR: isManual ? '当前用户' : '',
      sourceNo: plan.code, taskListNo,
      faultPhenomenon: '', faultCause: '', solution: '',
      safetyMeasures: '',
      acceptancePerson: '', acceptanceTime: '', acceptanceResult: '',
      createdBy: isManual ? '当前用户' : cfg.creatorId,
      createdAt: nowStr, updatedAt: nowStr,
      // 扩展字段
      _planId: plan.id, _scheduleId: schedule ? schedule.id : '',
      _planCode: plan.code, _planName: plan.name
    });

    // 9) 如果计划有工序，复制到 operationV2Data
    if (plan.ops && plan.ops.length > 0) {
      plan.ops.forEach(op => {
        operationV2Data.push({
          orderId: woId, VORNR: String(op.seq).padStart(4, '0'),
          LTXA1: op.content, ARBPL: plan.workCenterName || '维修一班',
          ARBEIT: parseFloat(op.stdHours) || 1.0, ISMNW: '',
          status: 'pending', feedback: ''
        });
      });
    }

    // 10) 记录生成日志
    const logId = 'GL' + String(pmGenLogData.length + 1).padStart(3, '0');
    pmGenLogData.push({
      id: logId, scheduleId: schedule ? schedule.id : '', scheduleCode: schedule ? schedule.code : '',
      scheduleName: schedule ? schedule.scheduleName : '手动生成',
      genType: isManual ? 'manual' : 'auto', genTypeName: isManual ? '手动' : '自动',
      eqCode: eq.code, eqName: eq.name,
      planGenTime: schedule && schedule.nextGenTime ? schedule.nextGenTime : startStr,
      actualGenTime: startStr, result: 'success', resultName: '生成成功',
      orderCode: AUFNR, orderId: woId, failReason: '',
      operator: isManual ? '当前用户' : cfg.creatorId, genTime: now.toISOString().substring(0, 19).replace('T', ' ')
    });

    // 11) 更新调度 lastGenTime
    if (schedule) {
      schedule.lastGenTime = now.toISOString().substring(0, 19).replace('T', ' ');
    }

    // 12) 推送待办通知
    if (window.App && App.notifications) {
      App.notifications.unshift({
        id: Date.now(),
        type: 'info', icon: '🔧',
        title: `维护计划 ${plan.code} 已${isManual ? '手动' : '自动'}生成工单 ${AUFNR}`,
        desc: `设备：${eq.name}，计划：${plan.name}`,
        time: nowStr.substring(0, 16),
        read: false
      });
      App._updateNotifyBadge();
    }

    return { success: true, AUFNR, id: woId, logId, eqName: eq.name, eqCode: eq.code };
  },

  /* ---- 手动生成工单 (PRD §2.2 + §4.2) ---- */
  manualGenOrder(planId) {
    const plan = pmPlanData.find(p => p.id === planId);
    if (!plan) return;
    if (plan.status !== 'active') { toast('只有"已生效"的计划可以生成工单！'); return; }

    // 找到关联调度
    const sched = pmScheduleData.find(s => s.planId === planId && s.status === 'active');

    // 防重检查
    const dup = this._checkDuplicateOrder(planId);
    const cfg = this._genConfig;

    // 设备信息
    const devs = plan.devices || [];
    const eq = devs.length > 0 ? equipmentData.find(e => e.id === devs[0].eqId) : null;

    // 预览信息
    const startDate = sched && sched.nextGenTime ? sched.nextGenTime.substring(0, 10) : new Date(Date.now() + 86400000).toISOString().substring(0, 10);
    const priority = plan.priority === 'critical' ? '1-高' : plan.priority === 'important' ? '2-中' : cfg.defaultPriority;

    showModal('生成预防性维护工单', `
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px;margin-bottom:16px;">
        <div style="font-size:14px;font-weight:700;margin-bottom:8px;">📋 工单预览</div>
        <table style="width:100%;font-size:13px;">
          <tr><td style="padding:4px 8px;color:var(--text-secondary);width:80px;">类型</td><td style="font-weight:600;">PM01 - 预防性维护工单</td></tr>
          <tr><td style="padding:4px 8px;color:var(--text-secondary);">计划</td><td>${esc(plan.code)} ${esc(plan.name)}</td></tr>
          <tr><td style="padding:4px 8px;color:var(--text-secondary);">设备</td><td>${eq ? esc(eq.code) + ' | ' + esc(eq.name) : '（未关联设备）'}</td></tr>
          <tr><td style="padding:4px 8px;color:var(--text-secondary);">优先级</td><td><span class="badge ${priority==='1-高'?'badge-red':'badge-yellow'}">${priority}</span></td></tr>
          <tr><td style="padding:4px 8px;color:var(--text-secondary);">工序数</td><td>${(plan.ops||[]).length} 道工序</td></tr>
          <tr><td style="padding:4px 8px;color:var(--text-secondary);">状态</td><td><span class="badge badge-yellow">APPR - 待审批</span></td></tr>
          <tr><td style="padding:4px 8px;color:var(--text-secondary);">描述</td><td style="font-size:12px;">[${esc(plan.name)}] - ${eq ? esc(eq.name) : '未知设备'}</td></tr>
        </table>
      </div>
      ${dup.blocked ? `
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px;margin-bottom:12px;">
        <div style="font-size:13px;color:#991b1b;">⚠ ${esc(dup.reason)}</div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-secondary);">您仍可强制生成新工单，但不建议重复操作。</div>
      </div>` : `
      <div style="color:var(--text-secondary);font-size:12px;margin-bottom:12px;">确认后将立即生成工单，附带计划中配置的工序及备件清单。</div>`}
    `, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: dup.blocked ? '强制生成' : '确认生成', cls: 'btn-primary',
        action: () => {
          const result = this._createPMWorkOrder(plan, sched, true, dup.blocked);
          if (result.success) {
            toast(`✅ 工单 ${result.AUFNR} 已生成！（计划：${plan.name}，设备：${result.eqName}）`);
          } else if (result.blocked) {
            toast(`⚠ 该计划已有工单 ${result.AUFNR}，生成被阻止`);
          } else {
            toast(`❌ 生成失败：${result.msg}`);
          }
          closeModal(); this._refreshContent();
        }
      }
    ]);
  },

  /* ---- 自动扫描：从单个调度判断并生成 (PRD §2.1) ---- */
  _autoGenFromSchedule(schedule) {
    const plan = pmPlanData.find(p => p.id === schedule.planId);
    if (!plan || plan.status !== 'active') return null;
    if (schedule.status !== 'active') return null;

    let shouldGen = false;
    if (schedule.triggerType === 'time') {
      shouldGen = this._shouldGenByTime(schedule);
    } else if (schedule.triggerType === 'hours') {
      shouldGen = this._shouldGenByCounter(schedule, plan);
    } else if (schedule.triggerType === 'combined') {
      shouldGen = this._shouldGenByTime(schedule) && this._shouldGenByCounter(schedule, plan);
    }

    if (!shouldGen) return { action: 'skipped', reason: '未到达生成条件' };

    // 防重
    const dup = this._checkDuplicateOrder(plan.id);
    if (dup.blocked) return { action: 'skipped', reason: dup.reason };

    const result = this._createPMWorkOrder(plan, schedule, false, false);
    return result;
  },

  /* ---- 一键扫描：对所有活跃调度执行自动生成 ---- */
  runDailyAutoGen() {
    const activeSchedules = pmScheduleData.filter(s => s.status === 'active');
    if (activeSchedules.length === 0) { toast('没有活跃的调度方案！'); return; }

    let created = 0, skipped = 0, failed = 0;
    const results = [];

    activeSchedules.forEach(schedule => {
      const r = this._autoGenFromSchedule(schedule);
      if (!r) return;
      results.push(r);
      if (r.success) created++;
      else if (r.action === 'skipped') skipped++;
      else failed++;
    });

    let msg = `扫描完成：${activeSchedules.length} 个调度方案`;
    if (created > 0) msg += `\n✅ 已生成 ${created} 条新工单`;
    if (skipped > 0) msg += `\n⏭ 跳过 ${skipped} 条（不满足条件或已存在未关闭工单）`;
    if (failed > 0) msg += `\n❌ 失败 ${failed} 条`;
    if (created === 0 && failed === 0) msg += '\n📭 当前无符合条件的计划';

    showModal('一键扫描生成结果', `
      <div style="padding:8px 0;">
        ${results.map(r => `
          <div style="padding:8px 12px;margin-bottom:6px;border-radius:6px;font-size:13px;
            background:${r.success?'#f0fdf4':r.action==='skipped'?'#f8fafc':'#fef2f2'};
            border:1px solid ${r.success?'#bbf7d0':r.action==='skipped'?'#e2e8f0':'#fecaca'};">
            ${r.success
              ? `✅ <b>${r.AUFNR}</b> — ${esc(r.eqName)}（${esc(r.eqCode)}）`
              : r.action === 'skipped'
              ? `⏭ ${esc(r.reason||'已跳过')}`
              : `❌ ${esc(r.msg||'生成失败')}`}
          </div>`).join('')}
      </div>
    `, [
      { text: '关闭', cls: 'btn-secondary', action: () => { closeModal(); this._refreshContent(); } }
    ]);
  },

  // ======================== TAB 4: 计划执行日历 ========================
  _renderCalendarTab() {
    const year = this.calYear, month = this.calMonth;
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const weekLabels = ['日', '一', '二', '三', '四', '五', '六'];

    // Gather schedule events
    const events = [];
    pmScheduleData.filter(s => s.status === 'active').forEach(s => {
      const nextDate = s.nextGenTime ? new Date(s.nextGenTime) : null;
      if (nextDate && nextDate.getFullYear() === year && nextDate.getMonth() === month - 1) {
        events.push({ day: nextDate.getDate(), type: 'schedule', label: s.scheduleName, plan: s.planName, trigger: s.triggerTypeName });
      }
    });
    // Gather pending gen logs
    pmGenLogData.filter(g => g.result === 'pending').forEach(g => {
      const genDate = g.planGenTime ? new Date(g.planGenTime) : null;
      if (genDate && genDate.getFullYear() === year && genDate.getMonth() === month - 1) {
        events.push({ day: genDate.getDate(), type: 'pending', label: g.scheduleName, equip: g.eqName });
      }
    });
    // Gather generated work orders (PRD §4.3: show work order icon)
    workOrderV2Data.filter(wo => wo.AUART === 'PM01' && wo.EQUNR).forEach(wo => {
      const woDate = wo.GSTRP ? new Date(wo.GSTRP) : null;
      if (woDate && woDate.getFullYear() === year && woDate.getMonth() === month - 1) {
        events.push({ day: woDate.getDate(), type: 'workorder', label: `🔧 ${wo.AUFNR}`, equip: wo.EQKTX, aufnr: wo.AUFNR, status: wo.STAT_TXT });
      }
    });

    let calHtml = '';
    // Add empty cells for days before 1st
    for (let i = 0; i < firstDay; i++) {
      calHtml += '<div style="min-height:80px;background:#f9fafb;border:1px solid var(--border);"></div>';
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEvents = events.filter(e => e.day === d);
      const isToday = year === new Date().getFullYear() && month === new Date().getMonth() + 1 && d === new Date().getDate();
      calHtml += `<div style="min-height:80px;border:1px solid var(--border);padding:6px 8px;cursor:pointer;${isToday?'background:#eff6ff;border-color:#3b82f6;':''}" onclick="MaintPreventive._calendarDayClick(${year},${month},${d})">
        <div style="font-weight:${isToday?'700':'500'};font-size:13px;color:${isToday?'var(--primary)':'var(--text)'};margin-bottom:4px;">${d}</div>
        ${dayEvents.slice(0, 3).map(e => {
          let bg, fg, icon = '';
          if (e.type === 'schedule') { bg = '#dbeafe'; fg = '#1e40af'; }
          else if (e.type === 'workorder') { bg = '#d1fae5'; fg = '#065f46'; icon = '🔧 '; }
          else { bg = '#fef3c7'; fg = '#92400e'; }
          return `<div style="font-size:10px;padding:2px 4px;border-radius:3px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:${bg};color:${fg};" title="${esc(e.label)} ${e.status||''}">${icon}${esc(e.label.substring(0, 14))}</div>`;
        }).join('')}
        ${dayEvents.length > 3 ? `<div style="font-size:10px;color:var(--text-muted);">+${dayEvents.length-3}项</div>` : ''}
      </div>`;
    }

    return `<div style="padding:16px 24px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <button class="btn btn-sm btn-outline" onclick="MaintPreventive.calYear--;MaintPreventive._refreshContent()">&lt;&lt;</button>
          <button class="btn btn-sm btn-outline" onclick="MaintPreventive.calMonth=Math.max(1,MaintPreventive.calMonth-1);if(MaintPreventive.calMonth===0){MaintPreventive.calMonth=12;MaintPreventive.calYear--;}MaintPreventive._refreshContent()">&lt;</button>
          <span style="font-size:16px;font-weight:700;min-width:120px;text-align:center;">${year}年 ${monthLabels[month-1]}</span>
          <button class="btn btn-sm btn-outline" onclick="MaintPreventive.calMonth=Math.min(12,MaintPreventive.calMonth+1);if(MaintPreventive.calMonth===13){MaintPreventive.calMonth=1;MaintPreventive.calYear++;}MaintPreventive._refreshContent()">&gt;</button>
          <button class="btn btn-sm btn-outline" onclick="MaintPreventive.calYear++;MaintPreventive._refreshContent()">&gt;&gt;</button>
        </div>
        <button class="btn btn-sm btn-outline" onclick="MaintPreventive.calYear=2026;MaintPreventive.calMonth=6;MaintPreventive._refreshContent()">今天</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:0;border-top:1px solid var(--border);border-left:1px solid var(--border);">
        ${weekLabels.map(w => `<div style="text-align:center;padding:8px;font-weight:600;font-size:12px;color:var(--text-secondary);background:#f8fafc;border-right:1px solid var(--border);border-bottom:1px solid var(--border);">${w}</div>`).join('')}
        ${calHtml}
      </div>
      <div style="display:flex;gap:20px;margin-top:16px;font-size:12px;color:var(--text-secondary);">
        <div><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:#dbeafe;margin-right:6px;"></span>调度执行日</div>
        <div><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:#fef3c7;margin-right:6px;"></span>待生成工单</div>
        <div><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:#d1fae5;margin-right:6px;"></span>已生成工单 (PM01)</div>
      </div>
    </div>`;
  },

  _calendarDayClick(year, month, day) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    toast(`查看 ${dateStr} 的维护计划详情`);
  },

  // ======================== Shared utils ========================
  _renderPagination(total, totalPages) {
    return `<div class="list-toolbar" style="flex-shrink:0;">
      <div class="list-info"><span class="list-count">共 ${total} 条</span></div>
      <div class="pagination">
        <button class="pagination-btn" ${this.page<=1?'disabled':''} onclick="MaintPreventive.goPage(${this.page-1})">‹</button>
        <span class="pagination-info">第 ${this.page} / ${totalPages||1} 页</span>
        <button class="pagination-btn" ${this.page>=totalPages?'disabled':''} onclick="MaintPreventive.goPage(${this.page+1})">›</button>
        <select class="page-size-select" onchange="MaintPreventive.pageSize=parseInt(this.value);MaintPreventive.page=1;MaintPreventive._refreshContent()">
          ${[10,20,50].map(n=>'<option '+(this.pageSize===n?'selected':'')+'>'+n+'条</option>').join('')}</select>
      </div></div>`;
  }
};

// ===== 2.2 通知单管理 V3 — 两种创建方式可视化入口 =====
// 改进：点击"新建通知单"弹出选择面板，明确展示人工录入 / 状态监测报警两种方式
const MaintenanceNotificationV3 = {
  page:1, pageSize:10, filtered:[],
  _searchQmnum:'', _searchEqunr:'', _searchQmart:'', _searchStat:'', _searchPriok:'',

  _typeBadge(t) {
    if (t === 'M1') return '<span class="badge badge-sm" style="background:#fee2e2;color:#dc2626;">M1-故障报告</span>';
    if (t === 'M2') return '<span class="badge badge-sm" style="background:#dbeafe;color:#2563eb;">M2-维护请求</span>';
    return '<span class="badge badge-sm">'+esc(t)+'</span>';
  },

  /* ========== Render ========== */
  render() {
    return `
    <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <!-- 顶部标题栏 -->
      <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div>
          <div style="font-size:18px;font-weight:700;">通知单管理</div>
          <div style="font-size:13px;opacity:0.8;margin-top:2px;">来源：人工录入 / 状态监测报警自动生成</div>
        </div>
        <button class="btn btn-blue" style="padding:10px 20px;font-size:14px;font-weight:600;border-radius:8px;"
          onclick="MaintenanceNotificationV3.showCreatePicker()">+ 新建通知单</button>
      </div>

      <!-- 筛选栏 -->
      <div class="filter-bar" style="flex-shrink:0;">
        <div class="filter-group"><label>通知单号</label><input type="text" id="nfV3QMNUM" placeholder="如 N0000001" value="${esc(this._searchQmnum)}"></div>
        <div class="filter-group"><label>设备编码</label><input type="text" id="nfV3EQUNR" placeholder="模糊查询" value="${esc(this._searchEqunr)}"></div>
        <div class="filter-group"><label>类型</label><select id="nfV3QMART">${notificationV2TypeOpts.map(o=>`<option value="${o.value}" ${this._searchQmart===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>状态</label><select id="nfV3STAT">${notificationV2StatusOpts.map(o=>`<option value="${o.value}" ${this._searchStat===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>优先级</label><select id="nfV3PRIOK">${notificationV2PriorityOpts.map(o=>`<option value="${o.value}" ${this._searchPriok===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="MaintenanceNotificationV3.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="MaintenanceNotificationV3.reset()">重置</button>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrapper" style="flex:1;">
        <table class="data-table">
          <thead><tr><th>通知单号</th><th>类型</th><th>设备编码</th><th>设备名称</th><th>故障描述</th><th>来源</th><th>优先级</th><th>状态</th><th>发现时间</th><th>操作</th></tr></thead>
          <tbody id="nfV3TableBody"></tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="list-toolbar" style="flex-shrink:0;">
        <div class="list-info"><span class="list-count" id="nfV3Count">共 0 条</span></div>
        <div class="pagination">
          <button class="pagination-btn" id="nfV3Prev" disabled onclick="MaintenanceNotificationV3.prevPage()">‹</button>
          <span class="pagination-info" id="nfV3PageInfo">第 1 / 1 页</span>
          <button class="pagination-btn" id="nfV3Next" onclick="MaintenanceNotificationV3.nextPage()">›</button>
          <select class="page-size-select" id="nfV3PageSize" onchange="MaintenanceNotificationV3.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
        </div>
      </div>
    </div>`;
  },

  init() { this.filtered=[...notificationV2Data]; this.page=1; this.renderTable(); },

  /* ========== 表格渲染 ========== */
  renderTable() {
    const start=(this.page-1)*this.pageSize;
    const page=this.filtered.slice(start,start+this.pageSize);
    const totalPages=Math.ceil(this.filtered.length/this.pageSize)||1;
    document.getElementById('nfV3Count').textContent=`共 ${this.filtered.length} 条`;
    document.getElementById('nfV3PageInfo').textContent=`第 ${this.page} / ${totalPages} 页`;
    document.getElementById('nfV3Prev').disabled=this.page<=1;
    document.getElementById('nfV3Next').disabled=this.page>=totalPages;
    document.getElementById('nfV3PageSize').value=this.pageSize;

    const statusBadge=s=>{
      if(s==='CRTE') return '<span class="badge badge-yellow">CRTE-待处理</span>';
      if(s==='ORDP') return '<span class="badge badge-blue">ORDP-已转工单</span>';
      if(s==='NOCO') return '<span class="badge badge-gray">NOCO-已关闭</span>';
      return '<span class="badge">'+esc(s)+'</span>';
    };
    const prioBadge=p=>{
      if(p==='1-高') return '<span style="color:var(--danger);font-weight:bold;">'+esc(p)+'</span>';
      if(p==='2-中') return '<span style="color:var(--warning);font-weight:bold;">'+esc(p)+'</span>';
      return '<span style="color:var(--text-secondary);">'+esc(p)+'</span>';
    };
    const sourceTag=n=>{
      if(n.createdBy==='系统自动') return '<span class="badge badge-sm" style="background:#dbeafe;color:#1e40af;">🔔 系统报警</span>';
      return '<span class="badge badge-sm" style="background:#f0fdf4;color:#166534;">👤 人工</span>';
    };

    document.getElementById('nfV3TableBody').innerHTML=page.map(n=>`
      <tr>
        <td><strong style="color:var(--primary-lighter);cursor:pointer;" onclick="MaintenanceNotificationV3.detail('${n.id}')">${esc(n.QMNUM)}</strong></td>
        <td>${MaintenanceNotificationV3._typeBadge(n.QMART)}</td>
        <td>${esc(n.EQUNR)}</td>
        <td>${esc(n.EQKTX)}</td>
        <td style="max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(n.FENAM)}">${esc(n.FENAM)}</td>
        <td>${sourceTag(n)}</td>
        <td>${prioBadge(n.PRIOK)}</td>
        <td>${statusBadge(n.STAT)}</td>
        <td>${esc(n.QMDAT)}</td>
        <td class="table-actions">
          <button class="btn btn-blue btn-sm" onclick="MaintenanceNotificationV3.detail('${n.id}')">查看</button>
          ${n.STAT==='CRTE'?`
            <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;" onclick="MaintenanceNotificationV3.closeNotify('${n.id}')">关闭</button>
          `:''}
        </td>
      </tr>`).join('');
  },

  /* ========== 搜索与分页 ========== */
  search() {
    this._searchQmnum=document.getElementById('nfV3QMNUM').value.trim();
    this._searchEqunr=document.getElementById('nfV3EQUNR').value.trim();
    this._searchQmart=document.getElementById('nfV3QMART').value;
    this._searchStat=document.getElementById('nfV3STAT').value;
    this._searchPriok=document.getElementById('nfV3PRIOK').value;
    this.filtered=notificationV2Data.filter(n=>{
      if(this._searchQmnum&&!n.QMNUM.includes(this._searchQmnum))return false;
      if(this._searchEqunr&&!n.EQUNR.includes(this._searchEqunr))return false;
      if(this._searchQmart&&n.QMART!==this._searchQmart)return false;
      if(this._searchStat&&n.STAT!==this._searchStat)return false;
      if(this._searchPriok&&n.PRIOK!==this._searchPriok)return false;
      return true;
    });
    this.page=1; this.renderTable();
  },

  reset() {
    document.getElementById('nfV3QMNUM').value='';
    document.getElementById('nfV3EQUNR').value='';
    document.getElementById('nfV3QMART').value='';
    document.getElementById('nfV3STAT').value='';
    document.getElementById('nfV3PRIOK').value='';
    this._searchQmnum='';this._searchEqunr='';this._searchQmart='';this._searchStat='';this._searchPriok='';
    this.filtered=[...notificationV2Data]; this.page=1; this.renderTable();
  },

  prevPage(){if(this.page>1){this.page--;this.renderTable();}},
  nextPage(){if(this.page<Math.ceil(this.filtered.length/this.pageSize)){this.page++;this.renderTable();}},
  changePageSize(){this.pageSize=parseInt(document.getElementById('nfV3PageSize').value);this.page=1;this.renderTable();},

  /* ====================================
     🎯 核心改进：创建方式选择面板
     ==================================== */
  showCreatePicker() {
    const body = `
    <div style="padding:8px 0;">
      <div style="font-size:14px;color:var(--text-secondary);margin-bottom:20px;text-align:center;">
        请选择以下两种方式之一创建通知单
      </div>

      <div style="display:flex;gap:16px;margin-bottom:8px;">

        <!-- 卡片一：手工录入 -->
        <div onclick="closeModal();MaintenanceNotificationV3.createManual()" style="flex:1;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:2px solid #bbf7d0;border-radius:12px;padding:28px 20px;cursor:pointer;transition:all .25s;text-align:center;"
          onmouseenter="this.style.borderColor='#22c55e';this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 25px rgba(34,197,94,.15)'"
          onmouseleave="this.style.borderColor='#bbf7d0';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:44px;margin-bottom:14px;">👤</div>
          <div style="font-size:16px;font-weight:700;color:#166534;margin-bottom:6px;">手工录入</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.5;">现场人员发现故障或提出维护请求时，手动填写通知单信息，包括设备、类型、故障描述等</div>
          <div style="margin-top:14px;display:inline-block;padding:6px 20px;background:#22c55e;color:white;border-radius:20px;font-size:12px;font-weight:600;">开始录入 →</div>
        </div>

        <!-- 卡片二：模拟报警自动生成 -->
        <div onclick="closeModal();MaintenanceNotificationV3.createAlarm()" style="flex:1;background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #bfdbfe;border-radius:12px;padding:28px 20px;cursor:pointer;transition:all .25s;text-align:center;"
          onmouseenter="this.style.borderColor='#3b82f6';this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 25px rgba(59,130,246,.15)'"
          onmouseleave="this.style.borderColor='#bfdbfe';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:44px;margin-bottom:14px;">🔔</div>
          <div style="font-size:16px;font-weight:700;color:#1e40af;margin-bottom:6px;">模拟报警生成</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.5;">模拟状态监测系统自动触发报警，自动选择设备、匹配报警模板，生成高优先级通知单</div>
          <div style="margin-top:14px;display:inline-block;padding:6px 20px;background:#3b82f6;color:white;border-radius:20px;font-size:12px;font-weight:600;">模拟报警 →</div>
        </div>
      </div>
    </div>`;

    showModal('📌 选择通知单创建方式', body, [
      { text: '取消', cls: 'btn-secondary', action: closeModal }
    ], 'modal-lg');
  },

  /* ========== 方式一：手工录入 ========== */
  createManual() {
    const eqOpts = equipmentData.filter(e => e.status !== 'disposed')
      .map(e => `<option value="${esc(e.code)}">${esc(e.name)} (${esc(e.code)})</option>`).join('');
    const typeOpts = `<option value="">请选择</option>
      <option value="M1">M1 - 故障报告（设备已发生异常，需维修介入）</option>
      <option value="M2">M2 - 维护请求（预防性/改善性需求，非紧急）</option>`;

    // 目录A代码组选项（级联第一级）
    const catAGroups = faultCatalog.A.groups;
    const groupOpts = '<option value="">请选择代码组</option>' + catAGroups.map(g => `<option value="${g.code}">${g.code} — ${g.name}</option>`).join('');

    const now = new Date();
    const nowStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0')
      + 'T' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');

    const secStyle = 'font-size:13px;font-weight:600;color:var(--text);padding-bottom:10px;border-bottom:2px solid var(--primary);margin-bottom:2px;display:flex;align-items:center;gap:8px;';

    showModal('📋 新建通知单', `
      <!-- ====== 类型选择（顶部突出） ====== -->
      <div style="margin-bottom:20px;">
        <div class="form-group" style="max-width:440px;">
          <label style="font-weight:600;">通知单类型 <span style="color:var(--danger);">*</span></label>
          <select id="nfV3CreateType" onchange="MaintenanceNotificationV3._onTypeChange()" style="font-size:14px;font-weight:500;">${typeOpts}</select>
          <span style="font-size:11px;color:var(--text-muted);margin-top:3px;display:block;" id="nfV3CreateTypeHint">选择后部分字段联动变化，保存后类型不可修改</span>
        </div>
      </div>

      <!-- ====== 基本信息 ====== -->
      <div style="${secStyle}">📋 基本信息</div>
      <div class="form-grid" style="margin-top:14px;">

        <div class="form-group">
          <label style="font-weight:600;">设备 <span style="color:var(--danger);">*</span></label>
          <div style="display:flex;gap:6px;">
            <select id="nfV3CreateEq" onchange="MaintenanceNotificationV3._onEqChange()" style="flex:1;"><option value="">搜索/选择设备...</option>${eqOpts}</select>
            <button type="button" onclick="toast('扫码功能需移动端支持')" style="padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:white;cursor:pointer;font-size:18px;" title="扫码选择设备">📷</button>
          </div>
        </div>

        <div class="form-group"><label style="font-weight:600;">功能位置</label><input id="nfV3CreateLoc" readonly style="background:#f9fafb;color:var(--text-secondary);" placeholder="选择设备后自动带出"></div>
        <div class="form-group"><label style="font-weight:600;">设备名称</label><input id="nfV3CreateEqName" readonly style="background:#f9fafb;color:var(--text-secondary);" placeholder="选择设备后自动带出"></div>

        <div id="nfV3CreateFaultPhen" class="form-group full" style="display:none;">
          <label style="font-weight:600;">故障现象 <span style="color:var(--danger);">*</span></label>
          <div style="display:flex;gap:8px;">
            <select id="nfV3CreateFaultGroup" onchange="MaintenanceNotificationV3._onCreateGroupChange()" style="flex:1;min-width:0;">${groupOpts}</select>
            <select id="nfV3CreateFaultCode" onchange="MaintenanceNotificationV3._onCreateFaultCodeChange()" style="flex:1;min-width:0;"><option value="">请先选择代码组</option></select>
          </div>
          <span style="font-size:11px;color:var(--text-muted);margin-top:3px;display:block;">目录类型A — 从标准故障代码体系选择</span>
        </div>

        <div class="form-group full">
          <label style="font-weight:600;" id="nfV3CreateDescLabel">故障描述 <span style="color:var(--danger);">*</span></label>
          <textarea id="nfV3CreateDesc" rows="4" placeholder="请详细描述故障现象、发生时间、影响范围等"></textarea>
          <span style="font-size:11px;color:var(--text-muted);margin-top:2px;">建议不超过200字</span>
        </div>

        <div class="form-group">
          <label style="font-weight:600;">优先级 <span style="color:var(--danger);">*</span></label>
          <select id="nfV3CreatePrio">
            <option value="1-高">1 - 高（紧急处理）</option>
            <option value="2-中" selected>2 - 中（尽快处理）</option>
            <option value="3-低">3 - 低（计划处理）</option>
          </select>
        </div>
      </div>

      <!-- ====== 补充信息（可折叠） ====== -->
      <div style="margin-top:24px;">
        <div onclick="
          const p=document.getElementById('nfV3SupplPanel');
          const a=document.getElementById('nfV3SupplArrow');
          p.style.display=p.style.display==='none'?'block':'none';
          a.textContent=p.style.display==='none'?'▶':'▼';
        " style="${secStyle}cursor:pointer;user-select:none;">
          <span id="nfV3SupplArrow">▶</span> 补充信息（选填）
        </div>
        <div id="nfV3SupplPanel" style="display:none;margin-top:14px;">
          <div class="form-grid">
            <div class="form-group"><label style="font-weight:600;">发现时间</label><input type="datetime-local" id="nfV3CreateTime" value="${nowStr}"></div>
            <div class="form-group"><label style="font-weight:600;">发现人</label><input id="nfV3CreateFinder" value="当前用户" placeholder="当前用户"></div>
            <div id="nfV3CreateExpectedDateWrap" class="form-group" style="display:none;"><label style="font-weight:600;">期望完成日期</label><input type="date" id="nfV3CreateExpectedDate"></div>
            <div class="form-group"><label style="font-weight:600;">附件</label>
              <div style="border:2px dashed var(--border);border-radius:8px;padding:16px;text-align:center;cursor:pointer;transition:all .15s;"
                onclick="toast('附件上传功能将在后续版本实现')"
                onmouseenter="this.style.borderColor='var(--primary)';this.style.background='#f8fafc';"
                onmouseleave="this.style.borderColor='var(--border)';this.style.background='white';">
                <div style="font-size:28px;margin-bottom:4px;">📎</div>
                <div style="font-size:12px;color:var(--text-muted);">点击上传图片/视频</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'保存',cls:'btn-primary',action:()=>{MaintenanceNotificationV3._saveManual();}}
    ], 'modal-lg');
    // 初始化M1状态联动
    this._onTypeChange();
  },

  _onTypeChange() {
    const type = document.getElementById('nfV3CreateType')?.value;
    const fPhen = document.getElementById('nfV3CreateFaultPhen');
    const expWrap = document.getElementById('nfV3CreateExpectedDateWrap');
    const descEl = document.getElementById('nfV3CreateDesc');
    const descLabel = document.getElementById('nfV3CreateDescLabel');
    const prioEl = document.getElementById('nfV3CreatePrio');
    const hint = document.getElementById('nfV3CreateTypeHint');

    if (type === 'M1') {
      if (fPhen) fPhen.style.display = '';
      if (expWrap) expWrap.style.display = 'none';
      if (descLabel) descLabel.innerHTML = '故障描述 <span style="color:var(--danger);">*</span>';
      if (descEl) descEl.placeholder = '请详细描述故障现象、发生时间、影响范围等（选择故障现象后自动填充描述）';
      if (prioEl && prioEl.value !== '1-高') prioEl.value = '1-高';
      if (hint) hint.textContent = 'M1 故障报告：记录已发生的设备故障/异常，保存后可转维修工单';
    } else if (type === 'M2') {
      if (fPhen) fPhen.style.display = 'none';
      if (expWrap) expWrap.style.display = '';
      if (descLabel) descLabel.innerHTML = '维护需求描述 <span style="color:var(--danger);">*</span>';
      if (descEl) descEl.placeholder = '请描述维护/改善需求，包括背景、期望效果等';
      if (prioEl && prioEl.value !== '2-中' && prioEl.value !== '3-低') prioEl.value = '2-中';
      if (hint) hint.textContent = 'M2 维护请求：预防性/改善性需求，不要求关联故障现象';
    }
  },

  _onEqChange() {
    const code = document.getElementById('nfV3CreateEq')?.value;
    const eq = equipmentData.find(e => e.code === code);
    const locEl = document.getElementById('nfV3CreateLoc');
    const nameEl = document.getElementById('nfV3CreateEqName');
    if (eq) {
      if (locEl) locEl.value = eq.locationName || '';
      if (nameEl) nameEl.value = eq.name || '';
    } else {
      if (locEl) locEl.value = '';
      if (nameEl) nameEl.value = '';
    }
  },

  _onCreateGroupChange() {
    const groupCode = document.getElementById('nfV3CreateFaultGroup')?.value;
    const codeEl = document.getElementById('nfV3CreateFaultCode');
    if (!codeEl) return;

    if (!groupCode) {
      codeEl.innerHTML = '<option value="">请先选择代码组</option>';
      return;
    }

    const catAGroups = faultCatalog.A.groups;
    const grp = catAGroups.find(g => g.code === groupCode);
    if (!grp) { codeEl.innerHTML = '<option value="">无可用代码</option>'; return; }

    let opts = '<option value="">请选择故障现象</option>';
    for (const sg of grp.subGroups) {
      for (const c of sg.codes) {
        opts += `<option value="${c.code}" data-name="${esc(c.name)}" data-full="${esc(sg.name + ' → ' + c.name)}">${c.code} — ${esc(sg.name)} → ${esc(c.name)}</option>`;
      }
    }
    codeEl.innerHTML = opts;
  },

  _onCreateFaultCodeChange() {
    const codeEl = document.getElementById('nfV3CreateFaultCode');
    const descEl = document.getElementById('nfV3CreateDesc');
    if (!codeEl || !descEl) return;
    const sel = codeEl.options[codeEl.selectedIndex];
    if (!sel || !sel.value) return;
    const fullName = sel.getAttribute('data-full') || sel.textContent;
    descEl.value = fullName;
  },

  _saveManual() {
    const qmart = document.getElementById('nfV3CreateType').value;
    const eqCode = document.getElementById('nfV3CreateEq').value;
    const prio = document.getElementById('nfV3CreatePrio').value;
    const desc = document.getElementById('nfV3CreateDesc').value.trim();

    if (!qmart) { toast('请选择通知单类型！'); return; }
    if (!eqCode) { toast('请选择关联设备！'); return; }
    if (!desc) { toast('请填写描述！'); return; }

    // M1 类型校验故障现象
    let faultCode = '';
    if (qmart === 'M1') {
      faultCode = document.getElementById('nfV3CreateFaultCode')?.value || '';
      if (!faultCode) { toast('请选择故障现象！'); return; }
    }

    const eq = equipmentData.find(e => e.code === eqCode);
    const maxNum = notificationV2Data.reduce((max, n) => {
      const num = parseInt(n.QMNUM.replace('N', ''));
      return num > max ? num : max;
    }, 0);
    const newQMNUM = 'N' + String(maxNum + 1).padStart(7, '0');
    const newId = 'NOTIF' + String(notificationV2Data.length + 1).padStart(3, '0');
    const qmartTxt = qmart === 'M1' ? 'M1 - 故障报告' : 'M2 - 维护请求';

    const finder = document.getElementById('nfV3CreateFinder')?.value?.trim() || '当前用户';
    const timeVal = document.getElementById('nfV3CreateTime')?.value || '';

    notificationV2Data.push({
      id: newId, QMNUM: newQMNUM, QMART: qmart, QMART_TXT: qmartTxt,
      EQUNR: eqCode, EQKTX: eq ? eq.name : '',
      FENAM: desc, PRIOK: prio, STAT: 'CRTE', STAT_TXT: '待处理',
      faultPhenomenonCode: faultCode, faultCauseCode: '', faultSolutionCode: '',
      QMNAM: finder, QMDAT: timeVal || new Date().toLocaleString('zh-CN'),
      relatedOrder: '', closeReason: '', attachments: [],
      expectedDate: document.getElementById('nfV3CreateExpectedDate')?.value || '',
      background: '',
      createdBy: finder, createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN')
    });

    toast('通知单创建成功！编号：' + newQMNUM);
    closeModal();
    this.filtered = [...notificationV2Data];
    this.renderTable();
  },

  /* ========== 方式二：模拟报警自动生成 ========== */
  createAlarm() {
    const eqOpts=equipmentData.map(e=>`<option value="${esc(e.code)}">${esc(e.name)} (${esc(e.code)})</option>`).join('');
    const alarmTemplates = [
      { id:'over-temp', label:'温度越上限', desc:'温度传感器读数超出上限阈值', template:'[{measurePoint}] 读数 {value}℃ 超出 [上限] {limit}℃' },
      { id:'over-vibration', label:'振动越限', desc:'振动传感器读数超出允许范围', template:'[{measurePoint}] 振动值 {value}mm/s 超出 [上限] {limit}mm/s' },
      { id:'over-pressure', label:'压力异常', desc:'压力传感器读数偏离正常范围', template:'[{measurePoint}] 读数 {value}MPa 超出 [上限] {limit}MPa' },
      { id:'abnormal-noise', label:'异常噪音', desc:'设备运行噪音超出正常范围', template:'[{measurePoint}] 噪音值 {value}dB 超出 [上限] {limit}dB，轴承/齿轮可能存在异常' },
      { id:'freq-alarm', label:'变频器报警', desc:'变频器故障代码触发报警', template:'[{measurePoint}] 变频器 {alarmCode} 报警，设备自动停运' },
      { id:'current-spike', label:'电流异常', desc:'电流表读数突变或持续偏高', template:'[{measurePoint}] 电流值 {value}A 超出 [上限] {limit}A，可能负载异常' }
    ];

    const alarmCards = alarmTemplates.map((a, i) => `
      <div onclick="document.querySelectorAll('#nfV3AlarmCards>div').forEach(d=>d.style.borderColor='var(--border)');this.style.borderColor='#3b82f6';this.style.background='#eff6ff';window._nfV3AlarmIdx=${i};" style="padding:12px;border:2px solid var(--border);border-radius:8px;cursor:pointer;transition:all .15s;margin-bottom:8px;"
        onmouseenter="if(window._nfV3AlarmIdx!==${i}){this.style.background='#f8fafc';}" onmouseleave="if(window._nfV3AlarmIdx!==${i}){this.style.background='white';}">
        <div style="font-size:14px;font-weight:600;color:var(--text);">⚠️ ${esc(a.label)}</div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">${esc(a.desc)}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;font-family:monospace;">模板：${esc(a.template)}</div>
      </div>`).join('');

    showModal('🔔 模拟状态监测报警', `
      <div style="margin-bottom:14px;padding:10px 14px;background:#fef3c7;border-radius:6px;font-size:13px;color:#92400e;border-left:3px solid #f59e0b;">
        💡 模拟方式：系统将根据您选择的设备和报警类型，自动填充故障描述并以"系统自动"身份创建通知单
      </div>
      <div class="form-grid" style="margin-bottom:16px;">
        <div class="form-group"><label>触发设备<span class="req">*</span></label><select id="nfV3AlarmEq"><option value="">请选择</option>${eqOpts}</select></div>
      </div>
      <div style="font-size:13px;font-weight:600;margin-bottom:8px;color:var(--text);">选择报警类型（点击高亮）：</div>
      <div id="nfV3AlarmCards" style="max-height:300px;overflow-y:auto;">${alarmCards}</div>
    `, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'生成报警通知单',cls:'btn-primary',action:()=>{
        const eqCode=document.getElementById('nfV3AlarmEq').value;
        if(!eqCode){toast('请选择触发设备！');return;}
        if(window._nfV3AlarmIdx===undefined||window._nfV3AlarmIdx<0){toast('请选择报警类型（点击卡片高亮）！');return;}
        const alarm=alarmTemplates[window._nfV3AlarmIdx];
        MaintenanceNotificationV3._saveAlarm(eqCode, alarm);
        window._nfV3AlarmIdx=undefined;
      }}
    ]);
  },

  _saveAlarm(eqCode, alarm) {
    const eq=equipmentData.find(e=>e.code===eqCode);
    const now=new Date().toLocaleString('zh-CN');

    // 生成模拟测量值
    const randomValue=()=>(Math.random()*50+120).toFixed(1);
    const alarmDesc = alarm.template
      .replace('{measurePoint}', eq?eq.name:'未知设备')
      .replace('{value}', randomValue())
      .replace('{limit}', alarm.id==='over-temp'?'150':alarm.id==='over-vibration'?'7.0':alarm.id==='over-pressure'?'1.0':alarm.id==='abnormal-noise'?'72':alarm.id==='current-spike'?'45':'--')
      .replace('{alarmCode}', 'F0'+(Math.floor(Math.random()*7)+1));

    // 根据报警类型自动匹配故障现象代码
    const alarmToFaultCode = {
      'over-temp': 'A04-1-01', 'over-vibration': 'A01-1-01', 'over-pressure': 'A04-1-02',
      'abnormal-noise': 'A01-1-01', 'freq-alarm': 'A02-1-02', 'current-spike': 'A02-1-01'
    };
    const faultCode = alarmToFaultCode[alarm.id] || '';

    const maxNum=notificationV2Data.reduce((max,n)=>{
      const num=parseInt(n.QMNUM.replace('N',''));
      return num>max?num:max;
    },0);
    const newQMNUM='N'+String(maxNum+1).padStart(7,'0');
    const newId='NOTIF'+String(notificationV2Data.length+1).padStart(3,'0');

    notificationV2Data.push({
      id:newId,QMNUM:newQMNUM,QMART:'M1',QMART_TXT:'M1 - 故障报告',
      EQUNR:eqCode,EQKTX:eq?eq.name:'',
      FENAM:`[${alarm.label}] ${alarmDesc}`,
      faultPhenomenonCode:faultCode, faultCauseCode:'', faultSolutionCode:'',
      PRIOK:'1-高',STAT:'CRTE',STAT_TXT:'待处理',
      QMNAM:'系统自动',QMDAT:now,
      relatedOrder:'',closeReason:'',attachments:[],
      expectedDate:'',background:'',
      createdBy:'系统自动',createdAt:now,updatedAt:now
    });

    toast('报警通知单已生成！编号：'+newQMNUM+'（来源：状态监测报警）');
    closeModal();
    this.filtered=[...notificationV2Data];
    this.renderTable();
  },

  /* ========== 详情 ========== */
  detail(id) {
    const n=notificationV2Data.find(x=>x.id===id);
    if(!n)return;
    const eq=equipmentData.find(e=>e.code===n.EQUNR);
    const wo=workOrderV2Data.find(w=>w.sourceNo===n.QMNUM);
    const statusColor=n.STAT==='CRTE'?'var(--warning)':n.STAT==='ORDP'?'var(--primary-lighter)':'var(--text-muted)';

    const srcTag=n.createdBy==='系统自动'?'<span class="badge" style="background:#dbeafe;color:#1e40af;">🔔 状态监测报警自动生成</span>':'<span class="badge" style="background:#f0fdf4;color:#166534;">👤 人工录入</span>';

    showModal(`通知单 ${esc(n.QMNUM)}`, `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border);">
        <div>
          <div style="font-size:20px;font-weight:700;color:var(--text);">通知单 ${esc(n.QMNUM)}</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">状态：<span style="color:${statusColor};font-weight:600;">${esc(n.STAT_TXT)}</span> | ${srcTag}</div>
        </div>
        <div style="display:flex;gap:8px;">
          ${n.STAT==='CRTE'?`
            <button class="btn btn-success btn-sm" onclick="MaintenanceNotificationV3.convertToOrder('${n.id}');closeModal();">转工单</button>
            <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;" onclick="MaintenanceNotificationV3.closeNotify('${n.id}')">关闭通知单</button>
          `:''}
        </div>
      </div>
      <div class="detail-grid" style="margin-bottom:16px;">
        <div class="detail-item"><dt>通知单类型</dt><dd>${MaintenanceNotificationV3._typeBadge(n.QMART)}</dd></div>
        <div class="detail-item"><dt>设备编码</dt><dd>${esc(n.EQUNR)}</dd></div>
        <div class="detail-item"><dt>设备名称</dt><dd>${esc(n.EQKTX)}</dd></div>
        <div class="detail-item"><dt>功能位置</dt><dd>${eq?esc(eq.locationName):'-'}</dd></div>
        <div class="detail-item"><dt>优先级</dt><dd>${esc(n.PRIOK)}</dd></div>
        <div class="detail-item"><dt>发现人</dt><dd>${esc(n.QMNAM)}</dd></div>
        <div class="detail-item"><dt>发现时间</dt><dd>${esc(n.QMDAT)}</dd></div>
        <div class="detail-item"><dt>来源</dt><dd>${srcTag}</dd></div>
        ${wo?`<div class="detail-item"><dt>关联工单</dt><dd><span style="color:var(--primary-lighter);font-weight:600;">${esc(wo.AUFNR)} (${esc(wo.STAT_TXT)})</span></dd></div>`:''}
        ${n.closeReason?`<div class="detail-item"><dt>关闭原因</dt><dd style="color:var(--text-muted);">${esc(n.closeReason)}</dd></div>`:''}
      </div>
      <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:16px;">
        <div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--text-secondary);">描述</div>
        <div style="font-size:14px;line-height:1.7;color:var(--text);white-space:pre-wrap;">${esc(n.FENAM)}</div>
      </div>
      ${n.faultPhenomenonCode || n.faultCauseCode || n.faultSolutionCode ? `
        <div style="background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:8px;padding:16px;margin-bottom:16px;">
          <div style="font-weight:600;font-size:13px;margin-bottom:10px;color:var(--primary-lighter);display:flex;align-items:center;gap:6px;">🔍 故障分析链（现象 → 原因 → 措施）</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
            <div style="background:white;border-radius:6px;padding:10px;text-align:center;">
              <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">故障现象（目录A）</div>
              <div style="font-size:13px;font-weight:600;color:#dc2626;">${n.faultPhenomenonCode ? esc(getCatalogFullName('A', n.faultPhenomenonCode)) : '<span style="color:var(--text-muted);">—</span>'}</div>
              ${n.faultPhenomenonCode ? `<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;font-family:monospace;">${esc(n.faultPhenomenonCode)}</div>` : ''}
            </div>
            <div style="background:white;border-radius:6px;padding:10px;text-align:center;">
              <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">故障原因（目录B）</div>
              <div style="font-size:13px;font-weight:600;color:#d97706;">${n.faultCauseCode ? esc(getCatalogFullName('B', n.faultCauseCode)) : '<span style="color:var(--text-muted);">— 待维修工补充 —</span>'}</div>
              ${n.faultCauseCode ? `<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;font-family:monospace;">${esc(n.faultCauseCode)}</div>` : ''}
            </div>
            <div style="background:white;border-radius:6px;padding:10px;text-align:center;">
              <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">解决措施（目录C）</div>
              <div style="font-size:13px;font-weight:600;color:#059669;">${n.faultSolutionCode ? esc(getCatalogFullName('C', n.faultSolutionCode)) : '<span style="color:var(--text-muted);">— 待维修工补充 —</span>'}</div>
              ${n.faultSolutionCode ? `<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;font-family:monospace;">${esc(n.faultSolutionCode)}</div>` : ''}
            </div>
          </div>
        </div>` : ''}
      ${n.attachments&&n.attachments.length?`
        <div style="margin-bottom:16px;">
          <div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--text-secondary);">附件 (${n.attachments.length})</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">${n.attachments.map(a=>`<span style="padding:4px 12px;background:var(--bg);border-radius:4px;font-size:12px;">📎 ${esc(a)}</span>`).join('')}</div>
        </div>`:''}
      <div style="font-size:12px;color:var(--text-muted);border-top:1px solid var(--border);padding-top:12px;">
        创建人：${esc(n.createdBy)} | 创建时间：${esc(n.createdAt)} | 更新时间：${esc(n.updatedAt)}
      </div>
    `);
  },

  /* ========== 转工单（委托到工单模块新版弹窗） ========== */
  convertToOrder(id) {
    MaintenanceWorkOrderV3._convertNotification(id);
  },

  /* ========== 关闭通知单 ========== */
  closeNotify(id) {
    const n=notificationV2Data.find(x=>x.id===id);
    if(!n)return;
    showModal('关闭通知单', `
      <div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);">
        通知单号：<strong>${esc(n.QMNUM)}</strong> | 设备：<strong>${esc(n.EQUNR)} ${esc(n.EQKTX)}</strong>
      </div>
      <div class="form-group"><label>关闭类型<span class="req">*</span></label>
        <select id="nfV3CloseType" onchange="document.getElementById('nfV3CloseReason').value=this.value" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;margin-bottom:8px;">
          <option value="">--- 请选择 ---</option>
          <option value="误报 - 经现场确认非设备故障">误报 - 非设备故障</option>
          <option value="已现场处理 - 无需生成工单">已现场处理 - 无需工单</option>
          <option value="重复通知 - 同一故障已有通知单处理中">重复通知 - 已有处理</option>
          <option value="其他原因（请在下方补充）">其他原因</option>
        </select></div>
      <div class="form-group"><label>关闭原因详述<span class="req">*</span></label>
        <textarea id="nfV3CloseReason" rows="3" placeholder="请填写关闭原因（如误报、无需处理等）"></textarea></div>
    `, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'确认关闭',cls:'btn-primary',action:()=>{
        const reason=document.getElementById('nfV3CloseReason').value.trim();
        if(!reason){toast('请填写关闭原因！');return;}
        n.STAT='NOCO';
        n.STAT_TXT='已关闭';
        n.closeReason=reason;
        n.updatedAt=new Date().toLocaleString('zh-CN');
        toast('通知单已关闭');
        closeModal();
        this.filtered=[...notificationV2Data];
        this.renderTable();
      }}
    ]);
  }
};

// ===== 2.3 维修工单管理 V3 — 三种创建方式可视化入口 =====
// 改进：用户进入页面即可明确看到三种工单创建方式
const MaintenanceWorkOrderV3 = {
  page:1, pageSize:10, filtered:[],
  // 筛选缓存
  _searchAufnr:'', _searchEqunr:'', _searchAuart:'', _searchStat:'', _searchPriok:'',

  _typeBadge(t) {
    if(t==='PM01')return '<span class="badge badge-sm" style="background:#dbeafe;color:#2563eb;">PM01-预防性</span>';
    if(t==='PM02')return '<span class="badge badge-sm" style="background:#fee2e2;color:#dc2626;">PM02-纠正性</span>';
    if(t==='PM03')return '<span class="badge badge-sm" style="background:#fef3c7;color:#92400e;">PM03-改造</span>';
    if(t==='ZI02')return '<span class="badge badge-sm" style="background:#f3e8ff;color:#7c3aed;">ZI02-拆卸</span>';
    return '<span class="badge badge-sm">'+esc(t)+'</span>';
  },

  /* ========== Render ========== */
  render() {
    return `
    <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <!-- 顶部标题栏 -->
      <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;flex-shrink:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-size:18px;font-weight:700;">维修工单管理</div>
            <div style="font-size:13px;opacity:0.8;margin-top:2px;">来源：手工创建 / 通知单转化 / 任务清单引用 / 引用维护计划</div>
          </div>
          <button class="btn btn-blue" style="padding:10px 20px;font-size:14px;font-weight:600;border-radius:8px;"
            onclick="MaintenanceWorkOrderV3.showCreatePicker()">+ 新建工单</button>
        </div>

      </div>

      <!-- 筛选栏 -->
      <div class="filter-bar" style="flex-shrink:0;">
        <div class="filter-group"><label>工单号</label><input type="text" id="wo3AUFNR" placeholder="如 O0000001" value="${esc(this._searchAufnr)}"></div>
        <div class="filter-group"><label>设备编码</label><input type="text" id="wo3EQUNR" placeholder="模糊查询" value="${esc(this._searchEqunr)}"></div>
        <div class="filter-group"><label>类型</label><select id="wo3AUART">${workOrderV2TypeOpts.map(o=>`<option value="${o.value}" ${this._searchAuart===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>状态</label><select id="wo3STAT">${workOrderV2StatusOpts.map(o=>`<option value="${o.value}" ${this._searchStat===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>
        <div class="filter-group"><label>优先级</label><select id="wo3PRIOK">${notificationV2PriorityOpts.map(o=>`<option value="${o.value}" ${this._searchPriok===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="MaintenanceWorkOrderV3.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="MaintenanceWorkOrderV3.reset()">重置</button>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrapper" style="flex:1;">
        <table class="data-table">
          <thead><tr>
            <th style="width:100px;">工单号</th>
            <th style="width:100px;">类型</th>
            <th style="width:80px;">设备编码</th>
            <th style="width:240px;">描述</th>
            <th style="width:70px;">优先级</th>
            <th style="width:60px;">来源</th>
            <th style="width:110px;">计划开始</th>
            <th style="width:80px;">负责人</th>
            <th style="width:180px;">操作</th>
          </tr></thead>
          <tbody id="wo3TableBody"></tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="list-toolbar" style="flex-shrink:0;">
        <div class="list-info"><span class="list-count" id="wo3Count">共 0 条</span></div>
        <div class="pagination">
          <button class="pagination-btn" id="wo3Prev" disabled onclick="MaintenanceWorkOrderV3.prevPage()">‹</button>
          <span class="pagination-info" id="wo3PageInfo">第 1 / 1 页</span>
          <button class="pagination-btn" id="wo3Next" onclick="MaintenanceWorkOrderV3.nextPage()">›</button>
          <select class="page-size-select" id="wo3PageSize" onchange="MaintenanceWorkOrderV3.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
        </div>
      </div>
    </div>`;
  },

  /* ========== Init ========== */
  init() {
    this.filtered=[...workOrderV2Data]; this.page=1;
    this._searchAufnr='';this._searchEqunr='';this._searchAuart='';this._searchStat='';this._searchPriok='';
    this.renderTable();
  },

  /* ========== Render Table ========== */
  renderTable() {
    const start=(this.page-1)*this.pageSize;
    const page=this.filtered.slice(start,start+this.pageSize);
    const tp=Math.ceil(this.filtered.length/this.pageSize)||1;
    document.getElementById('wo3Count').textContent='共 '+this.filtered.length+' 条';
    document.getElementById('wo3PageInfo').textContent='第 '+this.page+' / '+tp+' 页';
    document.getElementById('wo3Prev').disabled=this.page<=1;
    document.getElementById('wo3Next').disabled=this.page>=tp;
    document.getElementById('wo3PageSize').value=this.pageSize;

    const prioBadge=p=>{
      if(p==='1-高')return '<span style="color:var(--danger);font-weight:bold;">'+esc(p)+'</span>';
      if(p==='2-中')return '<span style="color:var(--warning);font-weight:bold;">'+esc(p)+'</span>';
      return esc(p);
    };
    const srcBadge = w => {
      if (w.planSource) return '<span class="badge badge-sm" style="background:#dcfce7;color:#166534;" title="来源维护计划: '+esc(w.planSource)+'">🔧 计划</span>';
      if (w.taskListNo) return '<span class="badge badge-sm" style="background:#f3e8ff;color:#7c3aed;" title="来源任务清单: '+esc(w.taskListNo)+'">📑 模板</span>';
      if (w.sourceNo) return '<span class="badge badge-sm" style="background:#dbeafe;color:#2563eb;" title="来源通知单: '+esc(w.sourceNo)+'">📋 通知单</span>';
      return '<span class="badge badge-sm" style="background:#e5e7eb;color:#6b7280;">✍️ 手工</span>';
    };

    document.getElementById('wo3TableBody').innerHTML=page.map(w=>`
      <tr>
        <td><strong style="color:var(--primary-lighter);cursor:pointer;" onclick="MaintenanceWorkOrderV3.detail('${w.id}')">${esc(w.AUFNR)}</strong></td>
        <td>${MaintenanceWorkOrderV3._typeBadge(w.AUART)}</td>
        <td>${esc(w.EQUNR)}</td>
        <td style="width:240px;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(w.KURZTEXT)}">${esc(w.KURZTEXT)}</td>
        <td>${prioBadge(w.PRIOK)}</td>
        <td>${srcBadge(w)}</td>
        <td style="font-size:12px;">${esc(w.GSTRP)}</td>
        <td>${esc(w.PERNR)}</td>
        <td class="table-actions">
          <button class="btn btn-blue btn-sm" onclick="MaintenanceWorkOrderV3.detail('${w.id}')">详情</button>
          ${w.STAT==='CRTE'?`<button class="btn btn-warning btn-sm" style="background:#f97316;color:white;border:none;" onclick="MaintenanceWorkOrderV3.changeStatus('${w.id}','APPR')">提交审批</button>`:''}
          ${w.STAT==='APPR'?`<button class="btn btn-success btn-sm" onclick="MaintenanceWorkOrderV3.changeStatus('${w.id}','REL')">审批通过</button><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;" onclick="MaintenanceWorkOrderV3.changeStatus('${w.id}','CRTE')">退回</button>`:''}
          ${w.STAT==='REL'?`<button class="btn btn-warning btn-sm" style="background:var(--warning);color:white;border:none;" onclick="MaintenanceWorkOrderV3.changeStatus('${w.id}','EXEC')">开始执行</button>`:''}
          ${w.STAT==='EXEC'?`<button class="btn btn-sm" style="background:#059669;color:white;border:none;" onclick="MaintenanceWorkOrderV3.changeStatus('${w.id}','COMP')">完工</button>`:''}
          ${w.STAT==='COMP'?`<button class="btn btn-secondary btn-sm" onclick="MaintenanceWorkOrderV3.changeStatus('${w.id}','CLSD')">关闭归档</button>`:''}
        </td>
      </tr>`).join('');
  },

  /* ========== 搜索与分页 ========== */
  search() {
    this._searchAufnr=document.getElementById('wo3AUFNR').value.trim();
    this._searchEqunr=document.getElementById('wo3EQUNR').value.trim();
    this._searchAuart=document.getElementById('wo3AUART').value;
    this._searchStat=document.getElementById('wo3STAT').value;
    this._searchPriok=document.getElementById('wo3PRIOK').value;
    this.filtered=workOrderV2Data.filter(w=>{
      if(this._searchAufnr&&!w.AUFNR.includes(this._searchAufnr))return false;
      if(this._searchEqunr&&!w.EQUNR.includes(this._searchEqunr))return false;
      if(this._searchAuart&&w.AUART!==this._searchAuart)return false;
      if(this._searchStat&&w.STAT!==this._searchStat)return false;
      if(this._searchPriok&&w.PRIOK!==this._searchPriok)return false;
      return true;
    });
    this.page=1; this.renderTable();
  },

  reset() {
    document.getElementById('wo3AUFNR').value='';
    document.getElementById('wo3EQUNR').value='';
    document.getElementById('wo3AUART').value='';
    document.getElementById('wo3STAT').value='';
    document.getElementById('wo3PRIOK').value='';
    this._searchAufnr='';this._searchEqunr='';this._searchAuart='';this._searchStat='';this._searchPriok='';
    this.filtered=[...workOrderV2Data]; this.page=1; this.renderTable();
  },

  prevPage(){if(this.page>1){this.page--;this.renderTable();}},
  nextPage(){if(this.page<Math.ceil(this.filtered.length/this.pageSize)){this.page++;this.renderTable();}},
  changePageSize(){this.pageSize=parseInt(document.getElementById('wo3PageSize').value);this.page=1;this.renderTable();},

  /* ====================================
     🎯 核心改进：创建方式选择面板
     ==================================== */
  showCreatePicker() {
    const crteNotifications = notificationV2Data.filter(n => n.STAT === 'CRTE');
    const publishedTaskLists = (typeof taskListMockData !== 'undefined' ? taskListMockData : []).filter(t => t.PLNST === '已发布');

    const activePlans = pmPlanData.filter(p => p.status === 'active');
    const body = `
    <div style="padding:4px 0;">
      <div style="font-size:14px;color:var(--text-secondary);margin-bottom:16px;text-align:center;">
        请选择一种方式来创建维修工单
      </div>

      <!-- 2×2 网格布局 -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">

        <!-- 卡片一：手工创建 -->
        <div onclick="closeModal();MaintenanceWorkOrderV3.createManual()"
          style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #bfdbfe;border-radius:12px;padding:20px 16px;cursor:pointer;transition:all .22s;text-align:center;"
          onmouseenter="this.style.borderColor='#3b82f6';this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(59,130,246,.15)'"
          onmouseleave="this.style.borderColor='#bfdbfe';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:36px;margin-bottom:8px;">✍️</div>
          <div style="font-size:15px;font-weight:700;color:#1e40af;margin-bottom:4px;">手工创建</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.45;">从零填写工单类型、设备、描述等信息，适合临时维修任务</div>
          <div style="margin-top:12px;"><span class="badge badge-blue" style="padding:5px 16px;border-radius:16px;font-size:12px;cursor:pointer;">开始创建 →</span></div>
        </div>

        <!-- 卡片二：引用通知单 -->
        <div onclick="closeModal();MaintenanceWorkOrderV3.createFromNotification()"
          style="background:linear-gradient(135deg,#fef3c7,#fef9c3);border:2px solid #fde68a;border-radius:12px;padding:20px 16px;cursor:pointer;transition:all .22s;text-align:center;"
          onmouseenter="this.style.borderColor='#f59e0b';this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(245,158,11,.15)'"
          onmouseleave="this.style.borderColor='#fde68a';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:36px;margin-bottom:8px;">📋</div>
          <div style="font-size:15px;font-weight:700;color:#92400e;margin-bottom:4px;">引用通知单</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.45;">从待处理通知单快速生成工单，自动带入设备和故障信息</div>
          <div style="margin-top:12px;display:flex;align-items:center;justify-content:center;gap:8px;">
            <span class="badge" style="padding:5px 16px;border-radius:16px;font-size:12px;background:#f59e0b;color:#fff;cursor:pointer;">选择通知单 →</span>
            ${crteNotifications.length > 0 ? `<span style="font-size:11px;padding:3px 10px;background:#fff7ed;color:#b45309;border-radius:10px;font-weight:600;">${crteNotifications.length} 条待处理</span>` : '<span style="font-size:11px;color:#d1d5db;">暂无待处理</span>'}
          </div>
        </div>

        <!-- 卡片三：引用任务清单 -->
        <div onclick="closeModal();MaintenanceWorkOrderV3.createFromTaskList()"
          style="background:linear-gradient(135deg,#f3e8ff,#ede9fe);border:2px solid #c4b5fd;border-radius:12px;padding:20px 16px;cursor:pointer;transition:all .22s;text-align:center;"
          onmouseenter="this.style.borderColor='#7c3aed';this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(124,58,237,.15)'"
          onmouseleave="this.style.borderColor='#c4b5fd';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:36px;margin-bottom:8px;">📑</div>
          <div style="font-size:15px;font-weight:700;color:#6d28d9;margin-bottom:4px;">引用任务清单</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.45;">引用标准作业模板，自动带入工序、物料和工具</div>
          <div style="margin-top:12px;display:flex;align-items:center;justify-content:center;gap:8px;">
            <span class="badge" style="padding:5px 16px;border-radius:16px;font-size:12px;background:#7c3aed;color:#fff;cursor:pointer;">选择模板 →</span>
            ${publishedTaskLists.length > 0 ? `<span style="font-size:11px;padding:3px 10px;background:#ede9fe;color:#6d28d9;border-radius:10px;font-weight:600;">${publishedTaskLists.length} 个已发布</span>` : '<span style="font-size:11px;color:#d1d5db;">暂无已发布</span>'}
          </div>
        </div>

        <!-- 卡片四：引用维护计划 -->
        <div onclick="closeModal();MaintenanceWorkOrderV3.createFromPlan()"
          style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #86efac;border-radius:12px;padding:20px 16px;cursor:pointer;transition:all .22s;text-align:center;"
          onmouseenter="this.style.borderColor='#10b981';this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(16,185,129,.15)'"
          onmouseleave="this.style.borderColor='#86efac';this.style.transform='translateY(0)';this.style.boxShadow='none'">
          <div style="font-size:36px;margin-bottom:8px;">🔧</div>
          <div style="font-size:15px;font-weight:700;color:#065f46;margin-bottom:4px;">引用维护计划</div>
          <div style="font-size:12px;color:#6b7280;line-height:1.45;">引用预防性维护计划，自动带入设备、工序和备件</div>
          <div style="margin-top:12px;display:flex;align-items:center;justify-content:center;gap:8px;">
            <span class="badge" style="padding:5px 16px;border-radius:16px;font-size:12px;background:#10b981;color:#fff;cursor:pointer;">选择计划 →</span>
            ${activePlans.length > 0 ? `<span style="font-size:11px;padding:3px 10px;background:#dcfce7;color:#166534;border-radius:10px;font-weight:600;">${activePlans.length} 个已生效</span>` : '<span style="font-size:11px;color:#d1d5db;">暂无已生效</span>'}
          </div>
        </div>

      </div>

      <div style="margin-top:14px;padding:8px 12px;background:#f9fafb;border-radius:8px;font-size:12px;color:var(--text-muted);text-align:center;border:1px dashed var(--border);">
        💡 提示：也可直接点击页面右上角「+ 新建工单」按钮快速创建
      </div>
    </div>`;

    showModal('📌 选择工单创建方式', body, [
      { text: '取消', cls: 'btn-secondary', action: closeModal }
    ], 'modal-xl');
  },

  /* ========== Mock 备件数据（用于页签2物料搜索） ========== */
  _spareParts() {
    return [
      { code:'100001',name:'深沟球轴承 6205-2RS',unit:'PC',spec:'6205-2RS' },
      { code:'100002',name:'圆柱滚子轴承 NU208',unit:'PC',spec:'NU208' },
      { code:'100003',name:'机械密封 MG1-80',unit:'SET',spec:'MG1-80' },
      { code:'100004',name:'O型圈套装 NBR',unit:'SET',spec:'NBR' },
      { code:'100005',name:'锂基润滑脂 3#',unit:'KG',spec:'3#' },
      { code:'100006',name:'液压油 46#抗磨',unit:'L',spec:'ISO VG46' },
      { code:'100007',name:'V带 SPB-2500',unit:'PC',spec:'SPB 2500' },
      { code:'100008',name:'滤芯 HX-63/10',unit:'PC',spec:'HX-63/10' },
      { code:'100009',name:'接触器 LC1D25M7C',unit:'PC',spec:'AC3 25A' },
      { code:'100010',name:'传感器 PT100',unit:'PC',spec:'PT100 -50~200℃' },
      { code:'100011',name:'螺栓套装 M12x50 8.8级',unit:'SET',spec:'M12x50' },
      { code:'100012',name:'密封垫片 DN80 石墨',unit:'PC',spec:'DN80' }
    ];
  },

  /* ========== 方式一：手工创建 ========== */
  createManual() {
    const eqOpts = equipmentData.filter(e => e.status !== 'disposed' && e.status !== 'scrapped')
      .map(e => `<option value="${esc(e.code)}">${esc(e.name)} (${esc(e.code)})</option>`).join('');
    const typeOpts = `<option value="">请选择</option>
      <option value="PM02" selected>PM02 - 维修工单（纠正性）</option>
      <option value="PM01">PM01 - 预防性维护工单</option>
      <option value="PM03">PM03 - 改造/项目工单</option>`;
    const wcOpts = '<option value="">请选择工作中心</option>' + wcMockData.filter(w => w.status === 'active')
      .map(w => `<option value="${esc(w.code)}">${esc(w.code)} — ${esc(w.name)}</option>`).join('');

    const now = new Date();
    const todayStr = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
    const secStyle = 'font-size:13px;font-weight:600;color:var(--text);padding-bottom:8px;border-bottom:2px solid var(--primary);margin-bottom:2px;display:flex;align-items:center;gap:8px;';

    showModal('🔧 新建维修工单', `
      <!-- ====== 工单类型（顶部突出） ====== -->
      <div style="margin-bottom:18px;">
        <div class="form-group" style="max-width:480px;">
          <label style="font-weight:600;">工单类型 <span style="color:var(--danger);">*</span></label>
          <select id="woNewType" onchange="MaintenanceWorkOrderV3._woOnTypeChange()" style="font-size:14px;font-weight:500;">${typeOpts}</select>
          <span style="font-size:11px;color:var(--text-muted);margin-top:3px;display:block;" id="woTypeHint">PM02：纠正性维修 | PM01：预防性 | PM03：改造项目（需填结算对象）</span>
        </div>
      </div>

      <!-- ====== 抬头信息 ====== -->
      <div style="${secStyle}">📋 抬头信息</div>
      <div class="form-grid" style="margin-top:12px;">

        <div class="form-group">
          <label style="font-weight:600;">设备 <span style="color:var(--danger);">*</span></label>
          <div style="display:flex;gap:6px;">
            <select id="woNewEq" onchange="MaintenanceWorkOrderV3._woOnEqChange()" style="flex:1;"><option value="">搜索/选择设备...</option>${eqOpts}</select>
            <button type="button" onclick="toast('扫码功能需移动端支持')" style="padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:white;cursor:pointer;font-size:18px;" title="扫码选择设备">📷</button>
          </div>
        </div>

        <div class="form-group"><label style="font-weight:600;">功能位置</label><input id="woNewLoc" readonly style="background:#f9fafb;color:var(--text-secondary);" placeholder="选择设备后自动带出"></div>
        <div class="form-group"><label style="font-weight:600;">设备名称</label><input id="woNewEqName" readonly style="background:#f9fafb;color:var(--text-secondary);" placeholder="选择设备后自动带出"></div>

        <div class="form-group">
          <label style="font-weight:600;">工作中心 <span style="color:var(--danger);" id="woNewWcReq">*</span></label>
          <select id="woNewWC">${wcOpts}</select>
        </div>

        <div class="form-group full">
          <label style="font-weight:600;">工单描述 <span style="color:var(--danger);" id="woNewDescReq">*</span></label>
          <input id="woNewDesc" placeholder="简要概括本次维修内容，如"更换驱动端轴承并重新对中"" maxlength="100">
          <span style="font-size:11px;color:var(--text-muted);">不超过100字</span>
        </div>

        <div class="form-group">
          <label style="font-weight:600;">优先级</label>
          <select id="woNewPrio">
            <option value="2-中" selected>2 - 中（尽快处理）</option>
            <option value="1-高">1 - 高（紧急处理）</option>
            <option value="3-低">3 - 低（计划处理）</option>
          </select>
        </div>

        <div class="form-group" style="display:flex;gap:10px;">
          <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
            <label style="font-weight:600;font-size:13px;">计划开始</label>
            <input type="date" id="woNewGstrp" style="padding:8px 10px;">
          </div>
          <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
            <label style="font-weight:600;font-size:13px;">计划完成</label>
            <input type="date" id="woNewGltrp" style="padding:8px 10px;">
          </div>
        </div>

        <div id="woNewSettleWrap" class="form-group" style="display:none;">
          <label style="font-weight:600;">结算对象 <span style="color:var(--danger);">*</span></label>
          <input id="woNewSettleObj" placeholder="内部订单号 / WBS元素" maxlength="30">
          <span style="font-size:11px;color:var(--text-muted);">PM03改造项目必须指定结算对象</span>
        </div>
      </div>

      <!-- ====== 页签区域 ====== -->
      <div style="margin-top:22px;">
        <div class="tabs" style="margin-bottom:2px;">
          <div class="tab active" id="woTabBtn1" onclick="MaintenanceWorkOrderV3._woSwitchTab('1')">工序</div>
          <div class="tab" id="woTabBtn2" onclick="MaintenanceWorkOrderV3._woSwitchTab('2')">物料组件</div>
          <div class="tab" id="woTabBtn3" onclick="MaintenanceWorkOrderV3._woSwitchTab('3')">安全措施</div>
          <div class="tab" id="woTabBtn4" onclick="MaintenanceWorkOrderV3._woSwitchTab('4')">附件</div>
        </div>

        <!-- 页签1：工序 -->
        <div class="tab-panel active" id="woTabPanel1" style="padding-top:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-size:12px;color:var(--text-secondary);">工序列表（至少一道方可保存）</span>
            <div style="display:flex;gap:6px;">
              <button class="btn btn-sm" style="background:#f0fdf4;color:#166534;border:1px solid #86efac;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woShowCommonOps()" title="从常用工序库快速添加">📋 常用工序库</button>
              <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddOperationRow()">+ 添加工序</button>
            </div>
          </div>
          <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
            <table class="data-table" style="font-size:12px;margin:0;" id="woOpsTable">
              <thead><tr>
                <th style="width:60px;">序号</th><th>工作描述 <span style="color:var(--danger);">*</span></th><th style="width:130px;">工作中心</th><th style="width:80px;">工时(h)</th><th style="width:50px;">操作</th>
              </tr></thead>
              <tbody id="woOpsBody">
                <tr id="woOpsRow1">
                  <td class="wo-op-seq">0010</td>
                  <td><input class="wo-op-desc" placeholder="如：切断电源上锁挂牌" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
                  <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;"><option value="">继承抬头</option>${wcOpts}</select></td>
                  <td><input class="wo-op-hrs" type="number" step="0.5" min="0" placeholder="0.5" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
                  <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 页签2：物料组件 -->
        <div class="tab-panel" id="woTabPanel2" style="padding-top:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-size:12px;color:var(--text-secondary);">物料需求列表（选填）</span>
            <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddMaterialRow()">+ 添加物料</button>
          </div>
          <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
            <table class="data-table" style="font-size:12px;margin:0;">
              <thead><tr><th style="width:120px;">物料编码</th><th>物料名称</th><th style="width:80px;">需求数量</th><th style="width:60px;">单位</th><th style="width:50px;">操作</th></tr></thead>
              <tbody id="woMatBody">
                <tr style="color:var(--text-muted);"><td colspan="5" style="text-align:center;padding:24px;font-size:12px;">暂无物料需求，点击上方按钮添加</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 页签3：安全措施 -->
        <div class="tab-panel" id="woTabPanel3" style="padding-top:12px;">
          <div class="form-group">
            <label style="font-weight:600;font-size:13px;">安全措施（选填）</label>
            <textarea id="woNewSafety" rows="5" placeholder="记录隔离、锁定、防护要求等，如：&#10;1. 关闭泵进出口阀门，确认管道排空&#10;2. 断电并执行LOTO程序&#10;3. 作业区域设置警示带，配备灭火器" style="resize:vertical;min-height:100px;"></textarea>
          </div>
        </div>

        <!-- 页签4：附件 -->
        <div class="tab-panel" id="woTabPanel4" style="padding-top:12px;">
          <div style="border:2px dashed var(--border);border-radius:8px;padding:24px;text-align:center;cursor:pointer;transition:all .15s;"
            onclick="toast('附件上传功能将在后续版本实现')"
            onmouseenter="this.style.borderColor='var(--primary)';this.style.background='#f8fafc';"
            onmouseleave="this.style.borderColor='var(--border)';this.style.background='white';">
            <div style="font-size:32px;margin-bottom:6px;">📎</div>
            <div style="font-size:13px;color:var(--text-secondary);">点击上传附件</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">支持图片、文档（故障照片、参考图纸等）</div>
          </div>
        </div>
      </div>
    `, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'保存为草稿',cls:'btn-secondary',style:'background:#f3f4f6;color:#374151;border:1px solid #d1d5db;',action:()=>{ MaintenanceWorkOrderV3._saveManual('draft'); }},
      {text:'保存',cls:'btn-primary',action:()=>{ MaintenanceWorkOrderV3._saveManual('full'); }}
    ], 'modal-xl');

    // 初始化类型联动
    this._woOnTypeChange();
  },

  /* ----- 工单类型联动（手工创建用） ----- */
  _woOnTypeChange() {
    const type = document.getElementById('woNewType')?.value;
    const settleWrap = document.getElementById('woNewSettleWrap');
    const wcReq = document.getElementById('woNewWcReq');
    const descReq = document.getElementById('woNewDescReq');
    const hint = document.getElementById('woTypeHint');
    if (settleWrap) settleWrap.style.display = type === 'PM03' ? '' : 'none';
    if (hint) {
      if (type === 'PM03') hint.textContent = 'PM03：改造/项目工单 — 需指定结算对象（内部订单号/WBS元素）';
      else if (type === 'PM01') hint.textContent = 'PM01：预防性维护 | PM02：纠正性维修 | PM03：改造项目';
      else hint.textContent = 'PM02：纠正性维修 | PM01：预防性 | PM03：改造项目';
    }
  },

  /* ----- 工单类型联动（通知单转化用） ----- */
  _woOnConvTypeChange() {
    const type = document.getElementById('woConvType')?.value;
    const settleWrap = document.getElementById('woConvSettleWrap');
    if (settleWrap) settleWrap.style.display = type === 'PM03' ? '' : 'none';
  },

  /* ----- 设备选择联动 ----- */
  _woOnEqChange() {
    const code = document.getElementById('woNewEq')?.value;
    const eq = equipmentData.find(e => e.code === code);
    const locEl = document.getElementById('woNewLoc');
    const nameEl = document.getElementById('woNewEqName');
    if (eq) {
      if (locEl) locEl.value = eq.locationName || '';
      if (nameEl) nameEl.value = eq.name || '';
    } else {
      if (locEl) locEl.value = '';
      if (nameEl) nameEl.value = '';
    }
  },

  /* ----- 页签切换 ----- */
  _woSwitchTab(tabId) {
    for (let i = 1; i <= 5; i++) {
      const btn = document.getElementById('woTabBtn'+i);
      const panel = document.getElementById('woTabPanel'+i);
      if (!btn) break;
      btn.classList.toggle('active', i === +tabId);
      if (panel) panel.classList.toggle('active', i === +tabId);
    }
  },

  /* ----- 工序行管理 ----- */
  _woAddOperationRow() {
    const body = document.getElementById('woOpsBody');
    if (!body) return;
    const rows = body.querySelectorAll('tr');
    const seq = String((rows.length) * 10).padStart(4, '0');
    const wcOpts = '<option value="">继承抬头</option>' + wcMockData.filter(w => w.status === 'active')
      .map(w => `<option value="${esc(w.code)}">${esc(w.name)}</option>`).join('');
    const tr = document.createElement('tr');
    tr.id = 'woOpsRow' + (rows.length + 1);
    tr.innerHTML = `<td class="wo-op-seq">${seq}</td>
      <td><input class="wo-op-desc" placeholder="如：拆卸电机地脚螺栓" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;">${wcOpts}</select></td>
      <td><input class="wo-op-hrs" type="number" step="0.5" min="0" placeholder="0.5" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>`;
    body.appendChild(tr);
    // 重新编排序号
    this._woRenumberOps();
  },

  _woRemoveOpRow(btn) {
    const tr = btn.closest('tr');
    if (!tr) return;
    const body = document.getElementById('woOpsBody');
    // 至少保留一行
    if (body && body.querySelectorAll('tr').length <= 1) {
      // 清空内容而非删除
      const inputs = tr.querySelectorAll('input');
      inputs.forEach(inp => { inp.value = ''; });
      return;
    }
    tr.remove();
    this._woRenumberOps();
  },

  _woRenumberOps() {
    const seqs = document.querySelectorAll('#woOpsBody .wo-op-seq');
    seqs.forEach((el, i) => { el.textContent = String((i + 1) * 10).padStart(4, '0'); });
  },

  _woCollectOperations() {
    const rows = document.querySelectorAll('#woOpsBody tr');
    const ops = [];
    rows.forEach((row, i) => {
      const desc = row.querySelector('.wo-op-desc')?.value?.trim();
      if (!desc) return;
      const wc = row.querySelector('.wo-op-wc')?.value || '';
      const hrs = parseFloat(row.querySelector('.wo-op-hrs')?.value) || 0;
      ops.push({ VORNR: String((i + 1) * 10).padStart(4, '0'), LTXA1: desc, ARBPL: wc, ARBEIT: hrs });
    });
    return ops;
  },

  /* ----- 常用工序库（支持手工创建 + 通知单转化两种场景） ----- */
  _woShowCommonOps() {
    const eqCode = document.getElementById('woNewEq')?.value || document.getElementById('woConvEqCode')?.value || '';
    const eq = equipmentData.find(e => e.code === eqCode);
    const eqTypeName = eq ? eq.typeName || eq.name : '';

    const cards = commonOperationLibrary.map(co => {
      const match = co.equipmentTypes.some(t => eqTypeName.includes(t) || t === '所有设备');
      const highlightStyle = match ? 'border-left:3px solid #10b981;' : 'opacity:0.65;';
      return `<div onclick="closeModal();MaintenanceWorkOrderV3._woInsertCommonOps('${co.id}')"
        style="padding:10px 12px;border:1px solid var(--border);border-radius:6px;cursor:pointer;margin-bottom:6px;transition:all .15s;${highlightStyle}"
        onmouseenter="this.style.background='#f0fdf4';this.style.borderColor='#86efac';"
        onmouseleave="this.style.background='white';this.style.borderColor='var(--border)';">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:600;font-size:13px;">🔧 ${esc(co.description)}</span>
          <span style="font-size:11px;background:#f3f4f6;padding:2px 8px;border-radius:10px;color:var(--text-secondary);">${esc(co.category)} · ${co.avgHours}h</span>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">${co.ops.slice(0,3).map(o=>esc(o)).join(' → ')}${co.ops.length>3?' …':''}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">适用设备：${esc(co.equipmentTypes.join('、'))} | 使用${co.useCount}次</div>
      </div>`;
    }).join('');

    showModal('📋 常用工序库', `
      <div style="margin-bottom:10px;font-size:13px;color:var(--text-secondary);">
        选择常用工序模板，自动填入工序页签。${eqTypeName ? `<span style="color:#10b981;font-weight:600;">绿色高亮</span>为匹配「${esc(eqTypeName)}」的模板。` : ''}
      </div>
      <div style="max-height:420px;overflow-y:auto;">${cards}</div>
    `, [{text:'关闭',cls:'btn-secondary',action:closeModal}], 'modal-lg');
  },

  _woInsertCommonOps(coId) {
    const co = commonOperationLibrary.find(c => c.id === coId);
    if (!co) return;
    // 先清空现有工序（保留一行）
    const body = document.getElementById('woOpsBody');
    if (!body) return;
    body.innerHTML = '';

    const wcOpts = '<option value="">继承抬头</option>' + wcMockData.filter(w => w.status === 'active')
      .map(w => `<option value="${esc(w.code)}">${esc(w.name)}</option>`).join('');

    co.ops.forEach((opDesc, i) => {
      const seq = String((i + 1) * 10).padStart(4, '0');
      const tr = document.createElement('tr');
      tr.id = 'woOpsRow' + (i + 1);
      tr.innerHTML = `<td class="wo-op-seq">${seq}</td>
        <td><input class="wo-op-desc" value="${esc(opDesc)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;">${wcOpts}</select></td>
        <td><input class="wo-op-hrs" type="number" step="0.5" min="0" value="${(co.avgHours/co.ops.length).toFixed(1)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>`;
      body.appendChild(tr);
    });
    // 切换到工序页签
    this._woSwitchTab('1');
    toast('已导入 ' + co.description + '（' + co.ops.length + ' 道工序）');
  },

  /* ----- 物料行管理 ----- */
  _woAddMaterialRow() {
    const body = document.getElementById('woMatBody');
    if (!body) return;
    // 移除空状态提示行
    const placeholder = body.querySelector('tr[data-placeholder]');
    if (placeholder) placeholder.remove();

    const partOpts = '<option value="">搜索物料...</option>' + this._spareParts()
      .map(p => `<option value="${esc(p.code)}" data-name="${esc(p.name)}" data-unit="${esc(p.unit)}">${esc(p.code)} — ${esc(p.name)}</option>`).join('');

    const idx = body.querySelectorAll('tr:not([data-placeholder])').length + 1;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>
      <select class="wo-mat-code" onchange="MaintenanceWorkOrderV3._woOnMatSelect(this)" style="width:100%;padding:6px 4px;font-size:11px;">${partOpts}</select></td>
      <td><input class="wo-mat-name" readonly style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f9fafb;" placeholder="选择物料后自动填充"></td>
      <td><input class="wo-mat-qty" type="number" step="0.1" min="0.1" value="1" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input class="wo-mat-unit" readonly style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f9fafb;text-align:center;" placeholder="-"></td>
      <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveMatRow(this)">×</button></td>`;
    body.appendChild(tr);
  },

  _woRemoveMatRow(btn) {
    const tr = btn.closest('tr');
    if (!tr) return;
    tr.remove();
    const body = document.getElementById('woMatBody');
    if (body && body.querySelectorAll('tr').length === 0) {
      body.innerHTML = '<tr data-placeholder><td colspan="5" style="text-align:center;padding:24px;font-size:12px;color:var(--text-muted);">暂无物料需求，点击上方按钮添加</td></tr>';
    }
  },

  _woOnMatSelect(sel) {
    const tr = sel.closest('tr');
    if (!tr) return;
    const opt = sel.options[sel.selectedIndex];
    const nameEl = tr.querySelector('.wo-mat-name');
    const unitEl = tr.querySelector('.wo-mat-unit');
    if (nameEl) nameEl.value = opt ? (opt.getAttribute('data-name') || '') : '';
    if (unitEl) unitEl.value = opt ? (opt.getAttribute('data-unit') || '') : '';
  },

  _woCollectMaterials() {
    const rows = document.querySelectorAll('#woMatBody tr:not([data-placeholder])');
    const mats = [];
    rows.forEach(row => {
      const code = row.querySelector('.wo-mat-code')?.value;
      if (!code) return;
      const name = row.querySelector('.wo-mat-name')?.value || '';
      const qty = parseFloat(row.querySelector('.wo-mat-qty')?.value) || 0;
      const unit = row.querySelector('.wo-mat-unit')?.value || '';
      if (qty > 0) mats.push({ MATNR: code, MATKTX: name, BDMNG: qty, MEINS: unit });
    });
    return mats;
  },

  /* ----- 工具/工装行管理（任务清单引用专用） ----- */
  _woAddToolRow(code, name, qty) {
    const body = document.getElementById('woToolBody');
    if (!body) return;
    const placeholder = body.querySelector('tr[data-placeholder]');
    if (placeholder) placeholder.remove();
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><input class="wo-tool-code" value="${esc(code||'')}" placeholder="工具编号" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input class="wo-tool-name" value="${esc(name||'')}" placeholder="工具/工装名称" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><input class="wo-tool-qty" type="number" step="1" min="1" value="${qty||1}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;text-align:center;"></td>
      <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveToolRow(this)">×</button></td>`;
    body.appendChild(tr);
  },

  _woRemoveToolRow(btn) {
    const tr = btn.closest('tr');
    if (!tr) return;
    tr.remove();
    const body = document.getElementById('woToolBody');
    if (body && body.querySelectorAll('tr').length === 0) {
      body.innerHTML = '<tr data-placeholder><td colspan="4" style="text-align:center;padding:24px;font-size:12px;color:var(--text-muted);">暂无工装工具需求，点击上方按钮添加</td></tr>';
    }
  },

  _woCollectTools() {
    const body = document.getElementById('woToolBody');
    if (!body) return [];
    const rows = body.querySelectorAll('tr:not([data-placeholder])');
    const tools = [];
    rows.forEach(row => {
      const code = (row.querySelector('.wo-tool-code')?.value || '').trim();
      const name = (row.querySelector('.wo-tool-name')?.value || '').trim();
      const qty = parseInt(row.querySelector('.wo-tool-qty')?.value) || 1;
      if (code || name) tools.push({ WRKCT: code || '', WRKTX: name || '', MGEIN: qty });
    });
    return tools;
  },

  /* ----- 保存逻辑 ----- */
  _saveManual(mode) {
    const auart = document.getElementById('woNewType').value;
    const eqCode = document.getElementById('woNewEq').value;
    const desc = document.getElementById('woNewDesc').value.trim();
    const wc = document.getElementById('woNewWC').value;
    const prio = document.getElementById('woNewPrio').value;
    const gstrp = document.getElementById('woNewGstrp').value;
    const gltrp = document.getElementById('woNewGltrp').value;
    const settleObj = document.getElementById('woNewSettleObj')?.value.trim() || '';
    const safety = document.getElementById('woNewSafety')?.value.trim() || '';

    // 基础校验——草稿和完整都需要
    if (!auart) { toast('请选择工单类型！'); return; }
    if (!eqCode) { toast('请选择关联设备！'); return; }

    if (mode === 'full') {
      // 完整保存：校验工作中心、描述、至少一道工序、PM03结算对象
      if (!wc) { toast('请选择工作中心！'); return; }
      if (!desc) { toast('请填写工单描述！'); return; }
      if (auart === 'PM03' && !settleObj) { toast('PM03 改造/项目工单必须填写结算对象！'); return; }
      const ops = this._woCollectOperations();
      if (ops.length === 0) { toast('请至少填写一道工序！'); return; }
    }

    const eq = equipmentData.find(e => e.code === eqCode);
    const maxNum = workOrderV2Data.reduce((max, w) => Math.max(max, parseInt(w.AUFNR.replace('O', ''))), 0);
    const newAUFNR = 'O' + String(maxNum + 1).padStart(7, '0');
    const newId = 'WO' + String(workOrderV2Data.length + 1).padStart(5, '0');

    const auartMap = { PM01:'PM01 - 预防性维护工单', PM02:'PM02 - 维修工单', PM03:'PM03 - 改造/项目工单', ZI02:'ZI02 - 拆卸回收工单' };
    const statTxt = mode === 'draft' ? '草稿' : '编辑中';

    const newOrder = {
      id: newId, AUFNR: newAUFNR, AUART: auart, AUART_TXT: auartMap[auart] || '',
      EQUNR: eqCode, EQKTX: eq ? eq.name : '',
      KURZTEXT: desc || '(草稿)', PRIOK: prio,
      STAT: 'CRTE', STAT_TXT: statTxt,
      GSTRP: gstrp || (new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2,'0')+'-'+String(new Date().getDate()).padStart(2,'0')), GLTRP: gltrp || '',
      PERNR: '当前用户',
      sourceNo: '', taskListNo: '',
      faultPhenomenon: '', faultCause: '', solution: '',
      faultPhenomenonCode: '', faultCauseCode: '', faultSolutionCode: '',
      safetyMeasures: safety,
      acceptancePerson: '', acceptanceTime: '', acceptanceResult: '',
      createdBy: '当前用户', createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN'),
      settlementObject: settleObj
    };
    workOrderV2Data.push(newOrder);

    // 保存工序数据
    const ops = this._woCollectOperations();
    if (ops.length > 0) {
      if (typeof operationV2Data === 'undefined') window.operationV2Data = [];
      ops.forEach(op => {
        operationV2Data.push({
          orderId: newId, VORNR: op.VORNR, LTXA1: op.LTXA1,
          ARBPL: op.ARBPL || wc, ARBEIT: op.ARBEIT, ISMNW: 0,
          status: 'pending', feedback: ''
        });
      });
    }

    // 保存物料数据
    const mats = this._woCollectMaterials();
    if (mats.length > 0) {
      if (typeof materialComponentV2Data === 'undefined') window.materialComponentV2Data = [];
      mats.forEach(m => {
        materialComponentV2Data.push({
          orderId: newId, MATNR: m.MATNR, MATKTX: m.MATKTX,
          BDMNG: m.BDMNG, MEINS: m.MEINS, ENMNG: 0, remark: ''
        });
      });
    }

    const msg = mode === 'draft' ? '草稿已保存！' : '工单已创建！';
    toast(msg + ' 编号：' + newAUFNR);
    closeModal();
    this.filtered = [...workOrderV2Data];
    this.renderTable();
  },

  /* ========== 方式二：从通知单转化 ========== */
  createFromNotification() {
    const crteNotifications = notificationV2Data.filter(n => n.STAT === 'CRTE');

    if (crteNotifications.length === 0) {
      showModal('📋 引用通知单',
        '<div style="text-align:center;padding:40px;"><div style="font-size:48px;margin-bottom:16px;">📭</div><div style="font-size:14px;color:var(--text-secondary);">当前没有待处理的通知单</div><div style="font-size:12px;color:var(--text-muted);margin-top:8px;">所有通知单已转工单或已关闭</div></div>',
        [{text:'关闭',cls:'btn-secondary',action:closeModal}]);
      return;
    }

    const rows = crteNotifications.map(n => {
      const prioColor = n.PRIOK==='1-高'?'#dc2626':n.PRIOK==='2-中'?'#d97706':'#6b7280';
      return `<tr style="cursor:pointer;" onclick="closeModal();MaintenanceWorkOrderV3._convertNotification('${n.id}')"
        onmouseenter="this.style.background='#f0f9ff'" onmouseleave="this.style.background='white'">
        <td><strong style="color:var(--primary-lighter);">${esc(n.QMNUM)}</strong></td>
        <td>${esc(n.QMART_TXT)}</td>
        <td>${esc(n.EQUNR)} ${esc(n.EQKTX)}</td>
        <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(n.FENAM)}">${esc(n.FENAM)}</td>
        <td><span style="color:${prioColor};font-weight:600;">${esc(n.PRIOK)}</span></td>
        <td>${esc(n.QMDAT)}</td>
      </tr>`;
    }).join('');

    const body = `
    <div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);">
      以下为当前<span style="font-weight:700;color:var(--warning);">待处理</span>的通知单，点击选择要转为工单的通知单：
    </div>
    <div style="max-height:360px;overflow-y:auto;">
      <table class="data-table" style="font-size:13px;">
        <thead><tr><th>通知单号</th><th>类型</th><th>设备</th><th>故障描述</th><th>优先级</th><th>创建日期</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

    showModal('📋 选择通知单转为工单', body, [{text:'取消',cls:'btn-secondary',action:closeModal}], 'modal-lg');
  },

  /* ========== 方式二：从通知单转化 — 优化版（确认+补充+页签） ========== */
  _convertNotification(notifId) {
    const n=notificationV2Data.find(x=>x.id===notifId);
    if(!n)return;

    const eq=equipmentData.find(e=>e.code===n.EQUNR);
    const defaultAUART = n.QMART==='M2'?'PM01':'PM02';
    const defaultWC = eq ? eq.workCenter : '';
    const defaultWCName = eq ? (eq.workCenterName || eq.teamName || '') : '';

    // 工单类型选项
    const typeOpts = `<option value="PM02" ${defaultAUART==='PM02'?'selected':''}>PM02 - 维修工单（纠正性）</option>
      <option value="PM01" ${defaultAUART==='PM01'?'selected':''}>PM01 - 预防性维护工单</option>
      <option value="PM03" ${defaultAUART==='PM03'?'selected':''}>PM03 - 改造/项目工单</option>`;

    // 工作中心选项
    const wcOpts = '<option value="">请选择工作中心</option>' + wcMockData.filter(w=>w.status==='active')
      .map(w=>`<option value="${esc(w.code)}" ${w.code===defaultWC?'selected':''}>${esc(w.code)} — ${esc(w.name)}</option>`).join('');

    // 自动生成工单描述：故障现象描述 - 设备名称
    let autoDesc = '';
    if (n.faultPhenomenonCode) {
      autoDesc = esc(getCatalogFullName('A', n.faultPhenomenonCode)) + ' - ' + esc(n.EQKTX||n.EQUNR);
    } else if (n.FENAM) {
      autoDesc = esc(n.FENAM) + ' - ' + esc(n.EQKTX||n.EQUNR);
    } else {
      autoDesc = esc(n.EQKTX||n.EQUNR) + '维修';
    }

    // 故障现象展示文本
    let faultPhenDisplay = '';
    if (n.faultPhenomenonCode) {
      faultPhenDisplay = esc(getCatalogFullName('A', n.faultPhenomenonCode));
    } else if (n.QMART === 'M1' && n.FENAM) {
      faultPhenDisplay = esc(n.FENAM);
    } else {
      faultPhenDisplay = '—（M2维护请求不要求故障现象）';
    }

    // 常用工序推荐提示
    let commonOpsHint = '';
    if (n.faultPhenomenonCode && eq) {
      const eqTypeName = eq.typeName || eq.name || '';
      const matchingOps = commonOperationLibrary.filter(co =>
        co.equipmentTypes.some(t => eqTypeName.includes(t) || t === '所有设备')
      );
      if (matchingOps.length > 0) {
        commonOpsHint = `<div style="margin-top:8px;padding:10px 14px;background:#fffbeb;border-radius:8px;font-size:12px;color:#92400e;border:1px solid #fde68a;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
          <span>💡 该故障现象常用的解决措施包括：<strong>${matchingOps.slice(0,3).map(co=>esc(co.description)).join('、')}</strong>${matchingOps.length>3?' 等'+(matchingOps.length-3)+'项':''}。是否从常用工序库引用？</span>
          <button class="btn btn-sm" style="background:#f59e0b;color:#fff;border:none;padding:5px 14px;font-size:12px;font-weight:600;border-radius:16px;white-space:nowrap;" onclick="MaintenanceWorkOrderV3._woShowCommonOps()">引用常用工序 →</button>
        </div>`;
      }
    }

    // M2通知单的期望完成日期（用于默认计划完成日期）
    const defaultGltrp = n.expectedDate || '';

    const secStyle = 'font-size:13px;font-weight:600;color:var(--text);padding-bottom:8px;border-bottom:2px solid var(--primary);margin-bottom:2px;display:flex;align-items:center;gap:8px;';

    showModal('📋 从通知单创建工单', `
      <!-- 顶部：通知单号 + 查看详情 -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:10px 14px;background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:8px;border:1px solid #bfdbfe;">
        <div style="font-size:14px;font-weight:700;color:#1e40af;">📋 从通知单创建工单</div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:13px;color:var(--text-secondary);">通知单号：<strong style="color:var(--primary-lighter);">${esc(n.QMNUM)}</strong></span>
          <button class="btn btn-sm" style="background:white;color:#2563eb;border:1px solid #93c5fd;padding:4px 12px;font-size:11px;font-weight:600;border-radius:14px;" onclick="closeModal();MaintenanceNotificationV3.detail('${n.id}')">查看通知单详情</button>
        </div>
      </div>

      <!-- ====== 通知单信息区（只读，自动带入） ====== -->
      <div style="${secStyle}">📋 通知单信息（自动带入，只读）</div>
      <div class="form-grid" style="margin-top:12px;margin-bottom:20px;">
        <div class="form-group">
          <label style="font-size:11px;color:var(--text-muted);">通知单类型</label>
          <input value="${esc(n.QMART_TXT)}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
        </div>
        <div class="form-group">
          <label style="font-size:11px;color:var(--text-muted);">设备</label>
          <input value="${esc(n.EQUNR)} ${esc(n.EQKTX)}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
        </div>
        <div class="form-group">
          <label style="font-size:11px;color:var(--text-muted);">功能位置</label>
          <input value="${eq?esc(eq.locationName):'—'}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
        </div>
        <div class="form-group">
          <label style="font-size:11px;color:var(--text-muted);">优先级</label>
          <input value="${esc(n.PRIOK)}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;font-weight:600;color:${n.PRIOK==='1-高'?'#dc2626':n.PRIOK==='2-中'?'#d97706':'#6b7280'};">
        </div>
        <div class="form-group full">
          <label style="font-size:11px;color:var(--text-muted);">故障现象</label>
          <input value="${faultPhenDisplay}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
        </div>
        <div class="form-group full">
          <label style="font-size:11px;color:var(--text-muted);">故障描述</label>
          <textarea readonly rows="2" style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;resize:none;">${esc(n.FENAM)}</textarea>
        </div>
      </div>

      <!-- ====== 工单补充信息区（需用户填写） ====== -->
      <div style="${secStyle}">📝 工单补充信息（需填写）</div>
      <div class="form-grid" style="margin-top:12px;margin-bottom:20px;">
        <div class="form-group">
          <label style="font-weight:600;">工单类型 <span style="color:var(--danger);">*</span></label>
          <select id="woConvType" onchange="MaintenanceWorkOrderV3._woOnConvTypeChange()" style="font-size:14px;font-weight:500;">${typeOpts}</select>
          <span style="font-size:11px;color:var(--text-muted);margin-top:3px;display:block;">${defaultAUART==='PM02'?'M1默认建议PM02（纠正性维修）':'M2默认建议PM01（预防性维护）'} | PM03需填写结算对象</span>
        </div>

        <div class="form-group full">
          <label style="font-weight:600;">工单描述 <span style="color:var(--danger);">*</span></label>
          <input id="woConvDesc" value="${autoDesc}" maxlength="100" placeholder="自动拼接生成，可修改">
          <span style="font-size:11px;color:var(--text-muted);">自动拼接：故障现象 + 设备名称，可手动修改</span>
        </div>

        <div class="form-group">
          <label style="font-weight:600;">主要工作中心 <span style="color:var(--danger);">*</span></label>
          <select id="woConvWC">${wcOpts}</select>
          ${defaultWC?`<span style="font-size:11px;color:var(--text-muted);">从设备主数据带出：${esc(defaultWCName)}</span>`:'<span style="font-size:11px;color:var(--text-muted);">设备未配置默认班组，请手动选择</span>'}
        </div>

        <div class="form-group" style="display:flex;gap:10px;">
          <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
            <label style="font-weight:600;font-size:13px;">计划开始</label>
            <input type="date" id="woConvGstrp" style="padding:8px 10px;">
          </div>
          <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
            <label style="font-weight:600;font-size:13px;">计划完成</label>
            <input type="date" id="woConvGltrp" value="${defaultGltrp}" style="padding:8px 10px;">
            ${n.QMART==='M2'&&defaultGltrp?'<span style="font-size:11px;color:var(--text-muted);">来自通知单期望完成日期</span>':''}
          </div>
        </div>

        <div id="woConvSettleWrap" class="form-group" style="display:none;">
          <label style="font-weight:600;">结算对象 <span style="color:var(--danger);">*</span></label>
          <input id="woConvSettleObj" placeholder="内部订单号 / WBS元素" maxlength="30">
          <span style="font-size:11px;color:var(--text-muted);">PM03改造项目必须指定结算对象</span>
        </div>

        <input type="hidden" id="woConvNotifId" value="${esc(notifId)}">
        <input type="hidden" id="woConvEqCode" value="${esc(n.EQUNR)}">
      </div>

      <!-- ====== 页签区域 ====== -->
      <div style="margin-top:4px;">
        <div class="tabs" style="margin-bottom:2px;">
          <div class="tab active" id="woTabBtn1" onclick="MaintenanceWorkOrderV3._woSwitchTab('1')">工序</div>
          <div class="tab" id="woTabBtn2" onclick="MaintenanceWorkOrderV3._woSwitchTab('2')">物料组件</div>
          <div class="tab" id="woTabBtn3" onclick="MaintenanceWorkOrderV3._woSwitchTab('3')">安全措施</div>
          <div class="tab" id="woTabBtn4" onclick="MaintenanceWorkOrderV3._woSwitchTab('4')">附件</div>
        </div>

        <!-- 页签1：工序 -->
        <div class="tab-panel active" id="woTabPanel1" style="padding-top:12px;">
          ${commonOpsHint}
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-size:12px;color:var(--text-secondary);">工序列表（至少一道方可保存）</span>
            <div style="display:flex;gap:6px;">
              <button class="btn btn-sm" style="background:#f0fdf4;color:#166534;border:1px solid #86efac;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woShowCommonOps()" title="从常用工序库快速添加">📋 常用工序库</button>
              <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddOperationRow()">+ 添加工序</button>
            </div>
          </div>
          <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
            <table class="data-table" style="font-size:12px;margin:0;" id="woOpsTable">
              <thead><tr>
                <th style="width:60px;">序号</th><th>工作描述 <span style="color:var(--danger);">*</span></th><th style="width:130px;">工作中心</th><th style="width:80px;">工时(h)</th><th style="width:50px;">操作</th>
              </tr></thead>
              <tbody id="woOpsBody">
                <tr id="woOpsRow1">
                  <td class="wo-op-seq">0010</td>
                  <td><input class="wo-op-desc" placeholder="如：切断电源上锁挂牌" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
                  <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;"><option value="">继承抬头</option>${wcOpts}</select></td>
                  <td><input class="wo-op-hrs" type="number" step="0.5" min="0" placeholder="0.5" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
                  <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 页签2：物料组件 -->
        <div class="tab-panel" id="woTabPanel2" style="padding-top:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-size:12px;color:var(--text-secondary);">物料需求列表（选填）</span>
            <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddMaterialRow()">+ 添加物料</button>
          </div>
          <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
            <table class="data-table" style="font-size:12px;margin:0;">
              <thead><tr><th style="width:120px;">物料编码</th><th>物料名称</th><th style="width:80px;">需求数量</th><th style="width:60px;">单位</th><th style="width:50px;">操作</th></tr></thead>
              <tbody id="woMatBody">
                <tr data-placeholder style="color:var(--text-muted);"><td colspan="5" style="text-align:center;padding:24px;font-size:12px;">暂无物料需求，点击上方按钮添加</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 页签3：安全措施 -->
        <div class="tab-panel" id="woTabPanel3" style="padding-top:12px;">
          <div class="form-group">
            <label style="font-weight:600;font-size:13px;">安全措施（选填）</label>
            <textarea id="woConvSafety" rows="5" placeholder="记录隔离、锁定、防护要求等，如：&#10;1. 关闭泵进出口阀门，确认管道排空&#10;2. 断电并执行LOTO程序&#10;3. 作业区域设置警示带，配备灭火器" style="resize:vertical;min-height:100px;"></textarea>
          </div>
        </div>

        <!-- 页签4：附件 -->
        <div class="tab-panel" id="woTabPanel4" style="padding-top:12px;">
          <div style="border:2px dashed var(--border);border-radius:8px;padding:24px;text-align:center;cursor:pointer;transition:all .15s;"
            onclick="toast('附件上传功能将在后续版本实现')"
            onmouseenter="this.style.borderColor='var(--primary)';this.style.background='#f8fafc';"
            onmouseleave="this.style.borderColor='var(--border)';this.style.background='white';">
            <div style="font-size:32px;margin-bottom:6px;">📎</div>
            <div style="font-size:13px;color:var(--text-secondary);">点击上传附件</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">支持图片、文档（故障照片、参考图纸等）</div>
          </div>
        </div>
      </div>
    `, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'保存为草稿',cls:'btn-secondary',style:'background:#f3f4f6;color:#374151;border:1px solid #d1d5db;',action:()=>{ MaintenanceWorkOrderV3._doConvertNotification('${notifId}','draft'); }},
      {text:'保存',cls:'btn-primary',action:()=>{ MaintenanceWorkOrderV3._doConvertNotification('${notifId}','full'); }}
    ], 'modal-xl');

    // 初始化PM03联动
    this._woOnConvTypeChange();
  },

  /* ----- 执行通知单→工单转换（支持草稿/完整模式） ----- */
  _doConvertNotification(notifId, mode) {
    const n=notificationV2Data.find(x=>x.id===notifId);
    if(!n)return;

    const auart=document.getElementById('woConvType')?.value;
    const desc=document.getElementById('woConvDesc')?.value.trim();
    const wc=document.getElementById('woConvWC')?.value;
    const gstrp=document.getElementById('woConvGstrp')?.value;
    const gltrp=document.getElementById('woConvGltrp')?.value;
    const settleObj=document.getElementById('woConvSettleObj')?.value.trim()||'';
    const safety=document.getElementById('woConvSafety')?.value.trim()||'';

    // 基础校验——草稿和完整都需要
    if(!auart){toast('请选择工单类型！');return;}
    // 设备从通知单自动带入，不需要单独校验（已在来源中确认）

    if(mode==='full'){
      // 完整保存校验
      if(!wc){toast('请选择主要工作中心！');return;}
      if(!desc){toast('请填写工单描述！');return;}
      if(auart==='PM03'&&!settleObj){toast('PM03 改造/项目工单必须填写结算对象！');return;}
      const ops=this._woCollectOperations();
      if(ops.length===0){toast('请至少填写一道工序！');return;}
    }

    const eq=equipmentData.find(e=>e.code===n.EQUNR);
    const maxNum=workOrderV2Data.reduce((max,w)=>Math.max(max,parseInt(w.AUFNR.replace('O',''))),0);
    const newAUFNR='O'+String(maxNum+1).padStart(7,'0');
    const newId='WO'+String(workOrderV2Data.length+1).padStart(5,'0');

    const auartMap={PM01:'PM01 - 预防性维护工单',PM02:'PM02 - 维修工单',PM03:'PM03 - 改造/项目工单',ZI02:'ZI02 - 拆卸回收工单'};
    const statTxt=mode==='draft'?'草稿':'编辑中';

    const newOrder={
      id:newId,AUFNR:newAUFNR,AUART:auart,AUART_TXT:auartMap[auart]||'',
      EQUNR:n.EQUNR,EQKTX:n.EQKTX,KURZTEXT:desc||(n.EQKTX||'维修'),
      PRIOK:n.PRIOK||'2-中',
      STAT:'CRTE',STAT_TXT:statTxt,
      GSTRP:gstrp||(new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2,'0')+'-'+String(new Date().getDate()).padStart(2,'0')),
      GLTRP:gltrp||'',
      PERNR:eq?(eq.leader||'当前用户'):'当前用户',
      sourceNo:n.QMNUM,taskListNo:'',
      faultPhenomenon:n.FENAM,faultCause:'',solution:'',
      faultPhenomenonCode:n.faultPhenomenonCode||'',faultCauseCode:'',faultSolutionCode:'',
      safetyMeasures:safety,acceptancePerson:'',acceptanceTime:'',acceptanceResult:'',
      createdBy:'当前用户',createdAt:new Date().toLocaleString('zh-CN'),
      updatedAt:new Date().toLocaleString('zh-CN'),
      settlementObject:settleObj
    };
    workOrderV2Data.push(newOrder);

    // 保存工序数据
    const ops=this._woCollectOperations();
    if(ops.length>0){
      if(typeof operationV2Data==='undefined')window.operationV2Data=[];
      ops.forEach(op=>{
        operationV2Data.push({
          orderId:newId,VORNR:op.VORNR,LTXA1:op.LTXA1,
          ARBPL:op.ARBPL||wc,ARBEIT:op.ARBEIT,ISMNW:0,
          status:'pending',feedback:''
        });
      });
    }

    // 保存物料数据
    const mats=this._woCollectMaterials();
    if(mats.length>0){
      if(typeof materialComponentV2Data==='undefined')window.materialComponentV2Data=[];
      mats.forEach(m=>{
        materialComponentV2Data.push({
          orderId:newId,MATNR:m.MATNR,MATKTX:m.MATKTX,
          BDMNG:m.BDMNG,MEINS:m.MEINS,ENMNG:0,remark:''
        });
      });
    }

    // 通知单状态联动 → ORDP（已转工单）
    n.relatedOrder=newAUFNR;
    n.STAT='ORDP';
    n.STAT_TXT='已转工单';
    n.updatedAt=new Date().toLocaleString('zh-CN');

    const msg=mode==='draft'?'草稿已保存！':'工单已生成！';
    toast(msg+' 编号：'+newAUFNR+(n.QMNUM?' (来源通知单: '+n.QMNUM+')':''));
    closeModal();
    this.filtered=[...workOrderV2Data];
    this.renderTable();
  },

  /* ========== 方式三：从任务清单引用 ========== */
  createFromTaskList() {
    const publishedTL = (typeof taskListMockData !== 'undefined' ? taskListMockData : []).filter(t => t.PLNST === '已发布');

    if (publishedTL.length === 0) {
      showModal('📑 引用任务清单',
        '<div style="text-align:center;padding:40px;"><div style="font-size:48px;margin-bottom:16px;">📭</div><div style="font-size:14px;color:var(--text-secondary);">当前没有已发布的任务清单</div><div style="font-size:12px;color:var(--text-muted);margin-top:8px;">请先在"设备主数据 → 任务清单"中创建并发布</div></div>',
        [{text:'关闭',cls:'btn-secondary',action:closeModal}]);
      return;
    }

    const typeText = { E:'设备', T:'功能位置', G:'通用' };
    const rows = publishedTL.map(tl => `
      <tr style="cursor:pointer;" onclick="closeModal();MaintenanceWorkOrderV3._selectTaskList('${tl.id}')"
        onmouseenter="this.style.background='#f5f3ff'" onmouseleave="this.style.background='white'">
        <td><strong style="color:#7c3aed;">${esc(tl.PLNNR)}</strong></td>
        <td>${esc(tl.PLTXT)}</td>
        <td><span class="badge badge-sm" style="background:#f3e8ff;color:#6d28d9;">${typeText[tl.PLNTY]||esc(tl.PLNTY)}</span></td>
        <td>${esc(tl.ARBPL)}</td>
        <td style="font-family:monospace;font-size:12px;">${esc(tl.PLNAL)}</td>
        <td>${(tl.operations||[]).length} 道工序</td>
      </tr>`).join('');

    const body = `
    <div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);">
      以下为已发布的<span style="font-weight:700;color:#7c3aed;">标准作业模板</span>，选择后将自动带入工序、物料与工具：
    </div>
    <div style="max-height:360px;overflow-y:auto;">
      <table class="data-table" style="font-size:13px;">
        <thead><tr><th>编码</th><th>描述</th><th>类型</th><th>工作中心</th><th>版本</th><th>工序数</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

    showModal('📑 选择任务清单模板', body, [{text:'取消',cls:'btn-secondary',action:closeModal}], 'modal-lg');
  },

  _selectTaskList(tlId) {
    const tl = (typeof taskListMockData !== 'undefined' ? taskListMockData : []).find(t => t.id === tlId);
    if (!tl) return;

    // 清单类型描述
    const tlTypeName = tl.PLNTY==='E'?'设备任务清单':tl.PLNTY==='T'?'功能位置任务清单':'通用任务清单';
    const tlUsageName = tl.PLNAW==='M01'?'维修':tl.PLNAW==='M02'?'检查':tl.PLNAW==='M03'?'润滑':esc(tl.PLNAW);

    // 根据清单用途默认工单类型
    const defaultAUART = (tl.PLNAW==='M01'||tl.PLNAW==='M02')?'PM01':'PM02';
    const typeOpts = `<option value="PM01" ${defaultAUART==='PM01'?'selected':''}>PM01 - 预防性维护工单</option>
      <option value="PM02" ${defaultAUART==='PM02'?'selected':''}>PM02 - 维修工单（纠正性）</option>
      <option value="PM03">PM03 - 改造/项目工单</option>`;

    // 设备：E类型自动带入关联设备（只读），G/T类型手动选择
    const isEqReadonly = tl.PLNTY === 'E' && tl.associatedObj;
    const defaultEq = isEqReadonly ? tl.associatedObj : '';
    const defaultEqInfo = defaultEq ? equipmentData.find(e => e.code === defaultEq) : null;

    const eqOpts = '<option value="">请选择设备</option>' + equipmentData.map(e =>
      `<option value="${esc(e.code)}" ${e.code===defaultEq?'selected':''}>${esc(e.name)} (${esc(e.code)})</option>`
    ).join('');

    // 工作中心选项
    const defaultWC = tl.ARBPL || '';
    const wcOpts = '<option value="">请选择工作中心</option>' + wcMockData.filter(w=>w.status==='active')
      .map(w => `<option value="${esc(w.code)}" ${w.code===defaultWC?'selected':''}>${esc(w.code)} — ${esc(w.name)}</option>`).join('');

    // 自动生成工单描述：任务清单描述 + 设备名称
    let autoDesc = esc(tl.PLTXT);
    if (defaultEqInfo) autoDesc = esc(tl.PLTXT) + ' - ' + esc(defaultEqInfo.name);

    const secStyle = 'font-size:13px;font-weight:600;color:var(--text);padding-bottom:8px;border-bottom:2px solid var(--primary);margin-bottom:2px;display:flex;align-items:center;gap:8px;';

    // ====== 预填充 HTML ======
    // 工序表行
    const opsRows = (tl.operations||[]).map((op, i) => `
      <tr id="woOpsRow${i+1}">
        <td class="wo-op-seq">${esc(op.VORNR)}</td>
        <td><input class="wo-op-desc" value="${esc(op.LTXA1)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;"><option value="">继承抬头</option>${wcOpts.replace(new RegExp(`value="${esc(op.ARBPL)}"`), `value="${esc(op.ARBPL)}" selected`)}</select></td>
        <td><input class="wo-op-hrs" type="number" step="0.5" min="0" value="${esc(op.ARBEIT)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>
      </tr>`).join('') || `<tr id="woOpsRow1">
      <td class="wo-op-seq">0010</td>
      <td><input class="wo-op-desc" placeholder="如：关闭阀门并排空" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;"><option value="">继承抬头</option>${wcOpts}</select></td>
      <td><input class="wo-op-hrs" type="number" step="0.5" min="0" placeholder="0.5" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>
    </tr>`;

    // 物料表行（收集工序级+工单级物料去重）
    const allMats = [];
    const matSeen = new Set();
    (tl.operations||[]).forEach(op => {
      (op.components||[]).forEach(c => {
        if (!matSeen.has(c.MATNR)) { matSeen.add(c.MATNR); allMats.push(c); }
      });
    });
    (tl.components||[]).forEach(c => {
      if (!matSeen.has(c.MATNR)) { matSeen.add(c.MATNR); allMats.push(c); }
    });
    const matBodyHtml = allMats.length > 0 ? allMats.map((c, i) => `
      <tr>
        <td><select class="wo-mat-code" onchange="MaintenanceWorkOrderV3._woOnMatSelect(this)" style="width:100%;padding:6px 4px;font-size:11px;">
          <option value="${esc(c.MATNR)}" data-name="${esc(c.MAKTX||'')}" data-unit="${esc(c.MEINS)}" selected>${esc(c.MATNR)} — ${esc(c.MAKTX||'')}</option></select></td>
        <td><input class="wo-mat-name" readonly value="${esc(c.MAKTX||'')}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f9fafb;"></td>
        <td><input class="wo-mat-qty" type="number" step="0.1" min="0.1" value="${esc(c.BDMNG)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input class="wo-mat-unit" readonly value="${esc(c.MEINS)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f9fafb;text-align:center;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveMatRow(this)">×</button></td>
      </tr>`).join('') : '<tr data-placeholder style="color:var(--text-muted);"><td colspan="5" style="text-align:center;padding:24px;font-size:12px;">暂无物料需求，点击上方按钮添加</td></tr>';

    // 工具表行（收集工序级+工单级工具去重）
    const allTools = [];
    const toolSeen = new Set();
    (tl.operations||[]).forEach(op => {
      (op.tools||[]).forEach(t => {
        const key = t.WRKCT || t.WRKTX;
        if (!toolSeen.has(key)) { toolSeen.add(key); allTools.push(t); }
      });
    });
    (tl.tools||[]).forEach(t => {
      const key = t.WRKCT || t.WRKTX;
      if (!toolSeen.has(key)) { toolSeen.add(key); allTools.push(t); }
    });
    const toolBodyHtml = allTools.length > 0 ? allTools.map(t => `
      <tr>
        <td><input class="wo-tool-code" value="${esc(t.WRKCT||'')}" placeholder="工具编号" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input class="wo-tool-name" value="${esc(t.WRKTX||'')}" placeholder="工具/工装名称" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input class="wo-tool-qty" type="number" step="1" min="1" value="${t.MGEIN||1}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;text-align:center;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveToolRow(this)">×</button></td>
      </tr>`).join('') : '<tr data-placeholder style="color:var(--text-muted);"><td colspan="4" style="text-align:center;padding:24px;font-size:12px;">暂无工装工具需求，点击上方按钮添加</td></tr>';

    const body = `
    <!-- 任务清单信息卡（确认源头） -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:10px 14px;background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-radius:8px;border:1px solid #c4b5fd;">
      <div>
        <div style="font-size:14px;font-weight:700;color:#5b21b6;">📑 从任务清单创建工单</div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">
          编码：<strong>${esc(tl.PLNNR)}</strong> | 版本：<strong>${esc(tl.PLNAL)}</strong> | ${tlTypeName} · ${tlUsageName}
          <span style="margin-left:10px;">| 清单描述：<strong>${esc(tl.PLTXT)}</strong></span>
        </div>
      </div>
      <button class="btn btn-sm" style="background:white;color:#5b21b6;border:1px solid #c4b5fd;padding:4px 12px;font-size:11px;font-weight:600;border-radius:14px;" onclick="closeModal();MaintenanceTasklist&&MaintenanceTasklist.detail?MaintenanceTasklist.detail('${tl.id}'):toast('请先打开任务清单模块')">查看任务清单详情</button>
    </div>

    <!-- ====== 任务清单只读信息 ====== -->
    <div style="${secStyle}">📋 任务清单信息（自动带入，只读）</div>
    <div class="form-grid" style="margin-top:10px;margin-bottom:18px;">
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">清单类型</label>
        <input value="${tlTypeName}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">清单用途</label>
        <input value="${tlUsageName}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">抬头工作中心</label>
        <input value="${esc(tl.ARBPL)}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">关联对象</label>
        <input value="${tl.associatedObj||'—（通用清单未绑定）'}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
    </div>

    <!-- ====== 工单抬头信息 ====== -->
    <div style="${secStyle}">📝 工单抬头信息（需确认/补充）</div>
    <div class="form-grid" style="margin-top:12px;margin-bottom:20px;">
      <div class="form-group">
        <label style="font-weight:600;">工单类型 <span style="color:var(--danger);">*</span></label>
        <select id="tlWoType" onchange="MaintenanceWorkOrderV3._tlOnTypeChange()" style="font-size:14px;font-weight:500;">${typeOpts}</select>
        <span style="font-size:11px;color:var(--text-muted);margin-top:3px;display:block;">${defaultAUART==='PM01'?'任务清单用途映射为PM01（预防性）':'默认PM02'} | PM03需填写结算对象</span>
      </div>

      <div class="form-group">
        <label style="font-weight:600;">设备 <span style="color:var(--danger);">*</span></label>
        ${isEqReadonly
          ? `<input value="${esc(defaultEq)} ${esc(defaultEqInfo?defaultEqInfo.name:'')}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;"><input type="hidden" id="tlWoEq" value="${esc(defaultEq)}"><span style="font-size:11px;color:var(--text-muted);">设备任务清单自动带入关联设备，只读</span>`
          : `<select id="tlWoEq" onchange="MaintenanceWorkOrderV3._tlOnEqChange()">${eqOpts}</select><span style="font-size:11px;color:var(--text-muted);">${tl.PLNTY==='G'?'通用清单需手动选择设备':tl.PLNTY==='T'?'请选择该功能位置下的设备':''}</span>`
        }
      </div>

      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">功能位置</label>
        <input id="tlWoLocation" value="${defaultEqInfo?esc(defaultEqInfo.locationName):'—'}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>

      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">设备名称</label>
        <input id="tlWoEqName" value="${defaultEqInfo?esc(defaultEqInfo.name):'—'}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>

      <div class="form-group full">
        <label style="font-weight:600;">工单描述 <span style="color:var(--danger);">*</span></label>
        <input id="tlWoDesc" value="${autoDesc}" maxlength="100" placeholder="自动填充任务清单描述，可修改">
        <span style="font-size:11px;color:var(--text-muted);">自动填充：任务清单描述 + 设备名称，可手动修改</span>
      </div>

      <div class="form-group">
        <label style="font-weight:600;">主要工作中心 <span style="color:var(--danger);">*</span></label>
        <select id="tlWoWC">${wcOpts}</select>
        ${defaultWC?`<span style="font-size:11px;color:var(--text-muted);">从任务清单抬头带出</span>`:'<span style="font-size:11px;color:var(--text-muted);">请选择工作中心</span>'}
      </div>

      <div class="form-group">
        <label style="font-weight:600;font-size:13px;">优先级</label>
        <select id="tlWoPrio"><option value="1-高">1-高</option><option value="2-中" selected>2-中</option><option value="3-低">3-低</option></select>
      </div>

      <div class="form-group" style="display:flex;gap:10px;">
        <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
          <label style="font-weight:600;font-size:13px;">计划开始</label>
          <input type="date" id="tlWoGstrp" style="padding:8px 10px;">
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
          <label style="font-weight:600;font-size:13px;">计划完成</label>
          <input type="date" id="tlWoGltrp" style="padding:8px 10px;">
        </div>
      </div>

      <div id="tlWoSettleWrap" class="form-group" style="display:none;">
        <label style="font-weight:600;">结算对象 <span style="color:var(--danger);">*</span></label>
        <input id="tlWoSettleObj" placeholder="内部订单号 / WBS元素" maxlength="30">
        <span style="font-size:11px;color:var(--text-muted);">PM03改造项目必须指定结算对象</span>
      </div>

      <input type="hidden" id="tlHiddenId" value="${esc(tl.id)}">
      <input type="hidden" id="tlHiddenEQUNR" value="${esc(defaultEq)}">
    </div>

    <!-- ====== 页签区域（从任务清单预填充，可编辑） ====== -->
    <div style="margin-top:4px;">
      <div class="tabs" style="margin-bottom:2px;">
        <div class="tab active" id="woTabBtn1" onclick="MaintenanceWorkOrderV3._woSwitchTab('1')">工序</div>
        <div class="tab" id="woTabBtn2" onclick="MaintenanceWorkOrderV3._woSwitchTab('2')">物料组件</div>
        <div class="tab" id="woTabBtn3" onclick="MaintenanceWorkOrderV3._woSwitchTab('3')">工具/工装</div>
        <div class="tab" id="woTabBtn4" onclick="MaintenanceWorkOrderV3._woSwitchTab('4')">安全措施</div>
        <div class="tab" id="woTabBtn5" onclick="MaintenanceWorkOrderV3._woSwitchTab('5')">附件</div>
      </div>

      <!-- 页签1：工序 -->
      <div class="tab-panel active" id="woTabPanel1" style="padding-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:12px;color:var(--text-secondary);">已从任务清单带入 <strong>${(tl.operations||[]).length}</strong> 道工序，可自由增删改</span>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddOperationRow()">+ 添加工序</button>
          </div>
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <table class="data-table" style="font-size:12px;margin:0;" id="woOpsTable">
            <thead><tr>
              <th style="width:60px;">序号</th><th>工作描述 <span style="color:var(--danger);">*</span></th><th style="width:130px;">工作中心</th><th style="width:80px;">工时(h)</th><th style="width:50px;">操作</th>
            </tr></thead>
            <tbody id="woOpsBody">${opsRows}</tbody>
          </table>
        </div>
      </div>

      <!-- 页签2：物料组件 -->
      <div class="tab-panel" id="woTabPanel2" style="padding-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:12px;color:var(--text-secondary);">已从任务清单带入 <strong>${allMats.length}</strong> 条物料，可自由增删改</span>
          <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddMaterialRow()">+ 添加物料</button>
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <table class="data-table" style="font-size:12px;margin:0;">
            <thead><tr><th style="width:120px;">物料编码</th><th>物料名称</th><th style="width:80px;">需求数量</th><th style="width:60px;">单位</th><th style="width:50px;">操作</th></tr></thead>
            <tbody id="woMatBody">${matBodyHtml}</tbody>
          </table>
        </div>
      </div>

      <!-- 页签3：工具/工装 -->
      <div class="tab-panel" id="woTabPanel3" style="padding-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:12px;color:var(--text-secondary);">已从任务清单带入 <strong>${allTools.length}</strong> 条工装工具，可自由增删改</span>
          <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddToolRow()">+ 添加工具</button>
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <table class="data-table" style="font-size:12px;margin:0;">
            <thead><tr><th style="width:120px;">工具编号</th><th>工具/工装名称</th><th style="width:80px;">数量</th><th style="width:50px;">操作</th></tr></thead>
            <tbody id="woToolBody">${toolBodyHtml}</tbody>
          </table>
        </div>
      </div>

      <!-- 页签4：安全措施 -->
      <div class="tab-panel" id="woTabPanel4" style="padding-top:12px;">
        <div class="form-group">
          <label style="font-weight:600;font-size:13px;">安全措施（选填）</label>
          <textarea id="tlWoSafety" rows="5" placeholder="记录隔离、锁定、防护要求等&#10;（任务清单通常不含安全措施，请手动填写）" style="resize:vertical;min-height:100px;"></textarea>
        </div>
      </div>

      <!-- 页签5：附件 -->
      <div class="tab-panel" id="woTabPanel5" style="padding-top:12px;">
        <div style="border:2px dashed var(--border);border-radius:8px;padding:24px;text-align:center;cursor:pointer;transition:all .15s;"
          onclick="toast('附件上传功能将在后续版本实现')"
          onmouseenter="this.style.borderColor='var(--primary)';this.style.background='#f8fafc';"
          onmouseleave="this.style.borderColor='var(--border)';this.style.background='white';">
          <div style="font-size:32px;margin-bottom:6px;">📎</div>
          <div style="font-size:13px;color:var(--text-secondary);">点击上传附件</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">支持图片、文档（作业指导书、参考图纸等）</div>
        </div>
      </div>
    </div>`;

    showModal('📑 从任务清单创建工单', body, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'保存为草稿',cls:'btn-secondary',style:'background:#f3f4f6;color:#374151;border:1px solid #d1d5db;',action:()=>{ MaintenanceWorkOrderV3._doCreateFromTaskList('${tl.id}','draft'); }},
      {text:'保存',cls:'btn-primary',action:()=>{ MaintenanceWorkOrderV3._doCreateFromTaskList('${tl.id}','full'); }}
    ], 'modal-xl');

    // 初始化PM03联动
    this._tlOnTypeChange();
  },

  _doCreateFromTaskList(tlId, mode) {
    const tl = (typeof taskListMockData !== 'undefined' ? taskListMockData : []).find(t => t.id === tlId);
    if (!tl) return;

    const eqCode = document.getElementById('tlWoEq')?.value || document.getElementById('tlHiddenEQUNR')?.value;
    if (!eqCode) { toast('请选择/确认关联设备！'); return; }

    const auart = document.getElementById('tlWoType')?.value;
    const desc = document.getElementById('tlWoDesc')?.value?.trim() || tl.PLTXT;
    const wc = document.getElementById('tlWoWC')?.value;
    const prio = document.getElementById('tlWoPrio')?.value || '2-中';
    const gstrp = document.getElementById('tlWoGstrp')?.value || '';
    const gltrp = document.getElementById('tlWoGltrp')?.value || '';
    const settleObj = document.getElementById('tlWoSettleObj')?.value?.trim() || '';
    const safety = document.getElementById('tlWoSafety')?.value?.trim() || '';

    if (!auart) { toast('请选择工单类型！'); return; }

    if (mode === 'full') {
      if (!wc) { toast('请选择主要工作中心！'); return; }
      if (!desc) { toast('请填写工单描述！'); return; }
      if (auart === 'PM03' && !settleObj) { toast('PM03 改造/项目工单必须填写结算对象！'); return; }
      const ops = this._woCollectOperations();
      if (ops.length === 0) { toast('请至少保留一道工序！'); return; }
    }

    const eq = equipmentData.find(e => e.code === eqCode);
    const maxNum = workOrderV2Data.reduce((max, w) => Math.max(max, parseInt(w.AUFNR.replace('O', ''))), 0);
    const newAUFNR = 'O' + String(maxNum + 1).padStart(7, '0');
    const newId = 'WO' + String(workOrderV2Data.length + 1).padStart(5, '0');

    const auartMap = { PM01: 'PM01 - 预防性维护工单', PM02: 'PM02 - 维修工单', PM03: 'PM03 - 改造/项目工单' };
    const statTxt = mode === 'draft' ? '草稿' : '编辑中';
    const today = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()).padStart(2, '0');

    // 创建工单
    workOrderV2Data.push({
      id: newId, AUFNR: newAUFNR, AUART: auart, AUART_TXT: auartMap[auart] || '',
      EQUNR: eqCode, EQKTX: eq ? eq.name : '', KURZTEXT: desc,
      PRIOK: prio, STAT: 'CRTE', STAT_TXT: statTxt,
      GSTRP: gstrp || today, GLTRP: gltrp || '',
      PERNR: eq ? (eq.leader || '当前用户') : '当前用户',
      sourceNo: '', taskListNo: tl.PLNNR, planSource: '',
      faultPhenomenon: '', faultCause: '', solution: '',
      faultPhenomenonCode: '', faultCauseCode: '', faultSolutionCode: '',
      safetyMeasures: safety, acceptancePerson: '', acceptanceTime: '', acceptanceResult: '',
      createdBy: '当前用户', createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN'),
      settlementObject: settleObj
    });

    // 保存工序（从表单收集，而非直接复制模板）
    const ops = this._woCollectOperations();
    if (ops.length > 0) {
      if (typeof operationV2Data === 'undefined') window.operationV2Data = [];
      ops.forEach(op => {
        operationV2Data.push({
          orderId: newId, VORNR: op.VORNR, LTXA1: op.LTXA1,
          ARBPL: op.ARBPL || wc, ARBEIT: op.ARBEIT, ISMNW: 0,
          status: 'pending', feedback: ''
        });
      });
    }

    // 保存物料（从表单收集）
    const mats = this._woCollectMaterials();
    if (mats.length > 0) {
      if (typeof materialComponentV2Data === 'undefined') window.materialComponentV2Data = [];
      mats.forEach(m => {
        materialComponentV2Data.push({
          orderId: newId, MATNR: m.MATNR, MATKTX: m.MATKTX,
          BDMNG: m.BDMNG, MEINS: m.MEINS, ENMNG: 0, remark: '来源模板: ' + tl.PLNNR
        });
      });
    }

    // 保存工具/工装（从表单收集）
    const tools = this._woCollectTools();
    if (tools.length > 0) {
      if (typeof toolComponentV2Data === 'undefined') window.toolComponentV2Data = [];
      tools.forEach(t => {
        toolComponentV2Data.push({
          orderId: newId, WRKCT: t.WRKCT, WRKTX: t.WRKTX,
          MGEIN: t.MGEIN, remark: '来源模板: ' + tl.PLNNR
        });
      });
    }

    const totalOps = operationV2Data.filter(o => o.orderId === newId).length;
    const totalMats = materialComponentV2Data.filter(m => m.orderId === newId).length;
    const totalTools = (typeof toolComponentV2Data !== 'undefined' ? toolComponentV2Data : []).filter(t => t.orderId === newId).length;

    const msg = mode === 'draft' ? '草稿已保存！' : '工单已生成！';
    toast(msg + ' 编号：' + newAUFNR + ' | 已带入 ' + totalOps + ' 道工序、' + totalMats + ' 条物料' + (totalTools > 0 ? '、' + totalTools + ' 件工具' : ''));
    closeModal();
    this.filtered = [...workOrderV2Data];
    this.renderTable();
  },

  /* ----- 任务清单引用辅助：工单类型联动 ----- */
  _tlOnTypeChange() {
    const type = document.getElementById('tlWoType')?.value;
    const settleWrap = document.getElementById('tlWoSettleWrap');
    if (settleWrap) settleWrap.style.display = type === 'PM03' ? '' : 'none';
  },

  /* ----- 任务清单引用辅助：设备选择联动 ----- */
  _tlOnEqChange() {
    const eqCode = document.getElementById('tlWoEq')?.value;
    const eq = equipmentData.find(e => e.code === eqCode);
    const locEl = document.getElementById('tlWoLocation');
    const nameEl = document.getElementById('tlWoEqName');
    const descEl = document.getElementById('tlWoDesc');
    if (locEl) locEl.value = eq ? eq.locationName : '—';
    if (nameEl) nameEl.value = eq ? eq.name : '—';
    // 自动更新工单描述
    if (descEl && eq) {
      const tl = (typeof taskListMockData !== 'undefined' ? taskListMockData : []).find(t => t.id === document.getElementById('tlHiddenId')?.value);
      if (tl) descEl.value = esc(tl.PLTXT) + ' - ' + esc(eq.name);
    }
  },

  /* ========== 方式四：引用维护计划 ========== */
  createFromPlan() {
    const activePlans = pmPlanData.filter(p => p.status === 'active');

    if (activePlans.length === 0) {
      showModal('🔧 引用维护计划',
        '<div style="text-align:center;padding:40px;"><div style="font-size:48px;margin-bottom:16px;">📭</div><div style="font-size:14px;color:var(--text-secondary);">当前没有已生效的维护计划</div><div style="font-size:12px;color:var(--text-muted);margin-top:8px;">请先在"预防性维护计划"中创建并启用计划</div></div>',
        [{text:'关闭',cls:'btn-secondary',action:closeModal}]);
      return;
    }

    const devNameMap = {};
    equipmentData.forEach(e => { devNameMap[e.id] = e.name + ' (' + e.code + ')'; });

    const rows = activePlans.map(p => {
      const devs = p.devices || [];
      const eqInfo = devs.length > 0
        ? (devNameMap[devs[0].eqId] || devs[0].eqCode || '未关联设备')
        : '未关联设备';
      const opsCount = (p.ops || []).length;
      const prio = p.priority === 'critical' ? '1-高' : p.priority === 'important' ? '2-中' : '3-低';
      const planTypeLabel = p.planType === 'counter'
        ? '基于计数器（'+esc(p.cycleUnit)+'）' : '基于时间（每'+p.cycleValue+p.cycleUnit+'）';
      const tlInfo = p.associatedTaskList
        ? `<span style="color:#7c3aed;font-size:11px;">📑 ${esc(p.associatedTaskList.PLNNR)}</span>`
        : '<span style="color:var(--text-muted);font-size:11px;">—</span>';
      return `<tr style="cursor:pointer;" onclick="closeModal();MaintenanceWorkOrderV3._selectPlan('${p.id}')"
        onmouseenter="this.style.background='#f0fdf4'" onmouseleave="this.style.background='white'">
        <td><strong style="color:#065f46;">${esc(p.code)}</strong></td>
        <td>${esc(p.name)}</td>
        <td style="font-size:12px;">${esc(eqInfo)}</td>
        <td>${esc(p.maintenanceTypeName)}</td>
        <td style="font-size:11px;">${planTypeLabel}</td>
        <td>${tlInfo}</td>
        <td>${opsCount} 道工序</td>
      </tr>`;
    }).join('');

    const body = `
    <div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);">
      以下为<span style="font-weight:700;color:#065f46;">已生效</span>的预防性维护计划，点击选择要生成工单的计划：
    </div>
    <div style="max-height:360px;overflow-y:auto;">
      <table class="data-table" style="font-size:13px;">
        <thead><tr><th>计划编号</th><th>计划名称</th><th>关联设备</th><th>维保类型</th><th>触发条件</th><th>关联清单</th><th>工序数</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

    showModal('🔧 选择维护计划生成工单', body, [{text:'取消',cls:'btn-secondary',action:closeModal}], 'modal-lg');
  },

  /* ----- _selectPlan：维护计划信息确认 + 工单补充 + 多页签 ----- */
  _selectPlan(planId) {
    const plan = pmPlanData.find(p => p.id === planId);
    if (!plan) return;

    // 设备（自动带入，不可修改）
    const devs = plan.devices || [];
    const eq = devs.length > 0 ? equipmentData.find(e => e.id === devs[0].eqId) : null;
    const eqCode = eq ? eq.code : (devs.length > 0 ? devs[0].eqCode || '' : '');
    const eqName = eq ? eq.name : (devs.length > 0 ? devs[0].eqName || '未知设备' : '未知设备');
    const eqLocation = eq ? eq.locationName : (devs.length > 0 ? devs[0].locationName || '—' : '—');
    if (!eqCode) { toast('该计划未关联有效设备，无法生成工单！'); return; }

    // 计划类型描述
    const planTypeDesc = plan.planType === 'counter'
      ? '基于计数器（' + (plan.cycleUnit || '运行小时') + '）'
      : '基于时间';
    const triggerDesc = plan.planType === 'counter'
      ? '每运行 ' + plan.cycleValue + ' ' + (plan.cycleUnit || '小时')
      : '每 ' + plan.cycleValue + ' ' + (plan.cycleUnit || '天');

    // 上次维护信息
    const lastMaint = plan.lastMaintenanceDate
      ? plan.lastMaintenanceDate + (plan.lastReading ? '（累计 ' + plan.lastReading + 'h）' : '')
      : '无记录';
    const currentReadingInfo = plan.planType === 'counter' && plan.currentReading
      ? plan.currentReading + 'h' : '—';

    // 关联任务清单
    const tl = plan.associatedTaskList
      ? ((typeof taskListMockData !== 'undefined' ? taskListMockData : []).find(t => t.id === plan.associatedTaskList.id))
      : null;

    // 工单类型（固定PM01，只读）
    const typeOpts = `<option value="PM01" selected>PM01 - 预防性维护工单</option>`;

    // 工作中心选项
    const defaultWC = tl ? tl.ARBPL : (eq ? eq.workCenter : (plan.workCenter || ''));
    const defaultWCName = tl
      ? (wcMockData.find(w => w.code === tl.ARBPL)?.name || '')
      : (eq ? eq.team : (plan.workCenterName || ''));
    const wcOpts = '<option value="">请选择工作中心</option>' + wcMockData.filter(w => w.status === 'active')
      .map(w => `<option value="${esc(w.code)}" ${w.code === defaultWC ? 'selected' : ''}>${esc(w.code)} — ${esc(w.name)}</option>`).join('');

    // 自动生成工单描述
    const autoDesc = esc(plan.name) + ' - ' + esc(eqName);

    // 日期推算
    let defaultGstrp = '';
    if (plan.planType === 'time' && plan.lastMaintenanceDate && plan.cycleValue) {
      // 时间型：上次维护 + 周期
      const d = new Date(plan.lastMaintenanceDate);
      d.setDate(d.getDate() + plan.cycleValue);
      defaultGstrp = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    } else {
      // 计数型：取当前日期
      const now = new Date();
      defaultGstrp = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    }

    // 预估完工日期：开始日期 + 预估工期
    let defaultGltrp = '';
    const estDays = parseFloat(plan.estimatedDuration) || parseFloat(plan.stdHours) / 8 || 0;
    if (defaultGstrp && estDays > 0) {
      const d = new Date(defaultGstrp);
      d.setDate(d.getDate() + Math.ceil(estDays));
      defaultGltrp = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    const secStyle = 'font-size:13px;font-weight:600;color:var(--text);padding-bottom:8px;border-bottom:2px solid var(--primary);margin-bottom:2px;display:flex;align-items:center;gap:8px;';

    // ====== 预填充 HTML（根据是否关联任务清单） ======
    const hasTL = !!tl;

    // 工序表行
    const opsFromTL = hasTL ? (tl.operations || []) : [];
    const opsFromPlan = !hasTL ? (plan.ops || []).map((op, i) => ({
      VORNR: String((i + 1) * 10).padStart(4, '0'),
      LTXA1: op.content,
      ARBPL: plan.workCenter || '',
      ARBEIT: parseFloat(op.stdHours) || 0.5
    })) : [];

    const opsToPreFill = hasTL ? opsFromTL : opsFromPlan;
    const opsCount = opsToPreFill.length;

    const opsRows = opsCount > 0 ? opsToPreFill.map((op, i) => `
      <tr id="woOpsRow${i+1}">
        <td class="wo-op-seq">${esc(op.VORNR)}</td>
        <td><input class="wo-op-desc" value="${esc(op.LTXA1)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;"><option value="">继承抬头</option>${wcOpts.replace(new RegExp(`value="${esc(op.ARBPL||defaultWC)}"`), `value="${esc(op.ARBPL||defaultWC)}" selected`)}</select></td>
        <td><input class="wo-op-hrs" type="number" step="0.5" min="0" value="${esc(op.ARBEIT||0.5)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>
      </tr>`).join('') : `<tr id="woOpsRow1">
      <td class="wo-op-seq">0010</td>
      <td><input class="wo-op-desc" placeholder="如：拆卸电机地脚螺栓" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><select class="wo-op-wc" style="width:100%;padding:6px 4px;font-size:11px;"><option value="">继承抬头</option>${wcOpts}</select></td>
      <td><input class="wo-op-hrs" type="number" step="0.5" min="0" placeholder="0.5" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
      <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveOpRow(this)">×</button></td>
    </tr>`;

    // 物料表行
    let matsToPreFill = [];
    if (hasTL) {
      const allMats = [];
      const matSeen = new Set();
      (tl.operations || []).forEach(op => {
        (op.components || []).forEach(c => {
          if (!matSeen.has(c.MATNR)) { matSeen.add(c.MATNR); allMats.push(c); }
        });
      });
      (tl.components || []).forEach(c => {
        if (!matSeen.has(c.MATNR)) { matSeen.add(c.MATNR); allMats.push(c); }
      });
      matsToPreFill = allMats;
    } else {
      // 从计划的 parts 转换为物料格式
      matsToPreFill = (plan.parts || []).map(p => ({
        MATNR: p.matCode, MAKTX: p.matName, BDMNG: p.planQty, MEINS: p.unit
      }));
    }
    const matBodyHtml = matsToPreFill.length > 0 ? matsToPreFill.map((c, i) => `
      <tr>
        <td><select class="wo-mat-code" onchange="MaintenanceWorkOrderV3._woOnMatSelect(this)" style="width:100%;padding:6px 4px;font-size:11px;">
          <option value="${esc(c.MATNR)}" data-name="${esc(c.MAKTX||'')}" data-unit="${esc(c.MEINS)}" selected>${esc(c.MATNR)} — ${esc(c.MAKTX||'')}</option></select></td>
        <td><input class="wo-mat-name" readonly value="${esc(c.MAKTX||'')}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f9fafb;"></td>
        <td><input class="wo-mat-qty" type="number" step="0.1" min="0.1" value="${esc(c.BDMNG)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input class="wo-mat-unit" readonly value="${esc(c.MEINS)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#f9fafb;text-align:center;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveMatRow(this)">×</button></td>
      </tr>`).join('') : '<tr data-placeholder style="color:var(--text-muted);"><td colspan="5" style="text-align:center;padding:24px;font-size:12px;">暂无物料需求，点击上方按钮添加</td></tr>';

    // 工具表行
    let toolsToPreFill = [];
    if (hasTL) {
      const allTools = [];
      const toolSeen = new Set();
      (tl.operations || []).forEach(op => {
        (op.tools || []).forEach(t => {
          const key = t.WRKCT || t.WRKTX;
          if (!toolSeen.has(key)) { toolSeen.add(key); allTools.push(t); }
        });
      });
      (tl.tools || []).forEach(t => {
        const key = t.WRKCT || t.WRKTX;
        if (!toolSeen.has(key)) { toolSeen.add(key); allTools.push(t); }
      });
      toolsToPreFill = allTools;
    } else {
      toolsToPreFill = (plan.tools || []);
    }
    const toolBodyHtml = toolsToPreFill.length > 0 ? toolsToPreFill.map(t => `
      <tr>
        <td><input class="wo-tool-code" value="${esc(t.WRKCT||'')}" placeholder="工具编号" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input class="wo-tool-name" value="${esc(t.WRKTX||'')}" placeholder="工具/工装名称" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input class="wo-tool-qty" type="number" step="1" min="1" value="${t.MGEIN||1}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;text-align:center;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:4px 8px;font-size:11px;" onclick="MaintenanceWorkOrderV3._woRemoveToolRow(this)">×</button></td>
      </tr>`).join('') : '<tr data-placeholder style="color:var(--text-muted);"><td colspan="4" style="text-align:center;padding:24px;font-size:12px;">暂无工装工具需求，点击上方按钮添加</td></tr>';

    // 物料/工具来源提示
    const matSourceHint = hasTL
      ? `已从任务清单 <strong>${esc(tl.PLNNR)}</strong> 带入 <strong>${matsToPreFill.length}</strong> 条物料`
      : (matsToPreFill.length > 0 ? '已从计划备件带入 <strong>'+matsToPreFill.length+'</strong> 条物料' : '暂无物料需求');
    const toolSourceHint = hasTL
      ? `已从任务清单 <strong>${esc(tl.PLNNR)}</strong> 带入 <strong>${toolsToPreFill.length}</strong> 件工装工具`
      : (toolsToPreFill.length > 0 ? '已带入 <strong>'+toolsToPreFill.length+'</strong> 件工装工具' : '暂无工装工具需求');

    const body = `
    <!-- 计划信息卡 -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:10px 14px;background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-radius:8px;border:1px solid #6ee7b7;">
      <div>
        <div style="font-size:14px;font-weight:700;color:#065f46;">🔧 从维护计划生成工单</div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">
          计划编号：<strong>${esc(plan.code)}</strong> | 版本：<strong>${esc(plan.version)}</strong> | ${esc(plan.maintenanceTypeName)} · ${planTypeDesc}
        </div>
      </div>
      <button class="btn btn-sm" style="background:white;color:#065f46;border:1px solid #6ee7b7;padding:4px 12px;font-size:11px;font-weight:600;border-radius:14px;" onclick="closeModal();MaintPreventive&&MaintPreventive.detail?MaintPreventive.detail('${plan.id}'):toast('请先打开预防性维护计划模块')">查看计划详情</button>
    </div>

    <!-- ====== 维护计划信息区（只读） ====== -->
    <div style="${secStyle}">📋 维护计划信息（自动带入，只读）</div>
    <div class="form-grid" style="margin-top:10px;margin-bottom:18px;">
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">计划描述</label>
        <input value="${esc(plan.name)}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">计划类型</label>
        <input value="${planTypeDesc}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">触发条件</label>
        <input value="${triggerDesc}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">设备</label>
        <input value="${esc(eqName)} (${esc(eqCode)})" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">功能位置</label>
        <input value="${esc(eqLocation)}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">上次维护</label>
        <input value="${lastMaint}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
      ${plan.planType === 'counter' ? `
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">当前读数</label>
        <input value="${currentReadingInfo}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>` : ''}
      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">关联任务清单</label>
        <input value="${hasTL ? esc(tl.PLNNR)+'（已发布版本'+esc(tl.PLNAL)+'）' : '未关联任务清单'}" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
      </div>
    </div>

    <!-- ====== 工单补充信息区 ====== -->
    <div style="${secStyle}">📝 工单补充信息（需确认/填写）</div>
    <div class="form-grid" style="margin-top:12px;margin-bottom:20px;">
      <div class="form-group">
        <label style="font-weight:600;">工单类型 <span style="color:var(--danger);">*</span></label>
        <select id="plWoType" onchange="MaintenanceWorkOrderV3._plOnTypeChange()" style="font-size:14px;font-weight:500;background:#f1f5f9;" disabled>${typeOpts}</select>
        <span style="font-size:11px;color:var(--text-muted);margin-top:3px;display:block;">从维护计划生成固定为 PM01（预防性），不可更改</span>
      </div>

      <div class="form-group">
        <label style="font-size:11px;color:var(--text-muted);">设备</label>
        <input value="${esc(eqName)} (${esc(eqCode)})" readonly style="background:#f1f5f9;color:var(--text-secondary);padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;width:100%;">
        <input type="hidden" id="plWoEq" value="${esc(eqCode)}">
        <span style="font-size:11px;color:var(--text-muted);">从维护计划自动带入，只读</span>
      </div>

      <div class="form-group full">
        <label style="font-weight:600;">工单描述 <span style="color:var(--danger);">*</span></label>
        <input id="plWoDesc" value="${autoDesc}" maxlength="100" placeholder="自动填充计划描述，可修改">
        <span style="font-size:11px;color:var(--text-muted);">自动填充：计划描述 + 设备名称，可手动修改</span>
      </div>

      <div class="form-group">
        <label style="font-weight:600;">主要工作中心 <span style="color:var(--danger);">*</span></label>
        <select id="plWoWC">${wcOpts}</select>
        <span style="font-size:11px;color:var(--text-muted);">${hasTL?'从关联任务清单抬头带出':(eq&&eq.team?'从设备主数据带出：'+esc(eq.team):'请选择工作中心')}</span>
      </div>

      <div class="form-group">
        <label style="font-weight:600;font-size:13px;">优先级</label>
        <select id="plWoPrio"><option value="1-高">1-高</option><option value="2-中" selected>2-中</option><option value="3-低">3-低</option></select>
        <span style="font-size:11px;color:var(--text-muted);">默认"中"，可根据实际调整</span>
      </div>

      <div class="form-group" style="display:flex;gap:10px;">
        <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
          <label style="font-weight:600;font-size:13px;">计划开始</label>
          <input type="date" id="plWoGstrp" value="${defaultGstrp}" style="padding:8px 10px;">
          <span style="font-size:10px;color:var(--text-muted);">${plan.planType==='time'?'到期日自动推算':'默认当前日期'}</span>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
          <label style="font-weight:600;font-size:13px;">计划完成</label>
          <input type="date" id="plWoGltrp" value="${defaultGltrp}" style="padding:8px 10px;">
          <span style="font-size:10px;color:var(--text-muted);">预估工期 ${plan.estimatedDuration||(plan.stdHours+'h')}</span>
        </div>
      </div>

      <div id="plWoSettleWrap" class="form-group" style="display:none;">
        <label style="font-weight:600;">结算对象 <span style="color:var(--danger);">*</span></label>
        <input id="plWoSettleObj" placeholder="内部订单号 / WBS元素" maxlength="30">
        <span style="font-size:11px;color:var(--text-muted);">PM03改造项目必须指定结算对象</span>
      </div>

      <input type="hidden" id="plHiddenId" value="${esc(plan.id)}">
      <input type="hidden" id="plHiddenEq" value="${esc(eqCode)}">
    </div>

    <!-- ====== 页签区域 ====== -->
    <div style="margin-top:4px;">
      <div class="tabs" style="margin-bottom:2px;">
        <div class="tab active" id="woTabBtn1" onclick="MaintenanceWorkOrderV3._woSwitchTab('1')">工序</div>
        <div class="tab" id="woTabBtn2" onclick="MaintenanceWorkOrderV3._woSwitchTab('2')">物料组件</div>
        <div class="tab" id="woTabBtn3" onclick="MaintenanceWorkOrderV3._woSwitchTab('3')">工具/工装</div>
        <div class="tab" id="woTabBtn4" onclick="MaintenanceWorkOrderV3._woSwitchTab('4')">安全措施</div>
        <div class="tab" id="woTabBtn5" onclick="MaintenanceWorkOrderV3._woSwitchTab('5')">附件</div>
      </div>

      <!-- 页签1：工序 -->
      <div class="tab-panel active" id="woTabPanel1" style="padding-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:12px;color:var(--text-secondary);">${hasTL?'已从任务清单带入 <strong>'+opsCount+'</strong> 道工序':'已从维护计划带入 <strong>'+opsCount+'</strong> 道工序'}，可自由增删改</span>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddOperationRow()">+ 添加工序</button>
          </div>
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <table class="data-table" style="font-size:12px;margin:0;" id="woOpsTable">
            <thead><tr>
              <th style="width:60px;">序号</th><th>工作描述 <span style="color:var(--danger);">*</span></th><th style="width:130px;">工作中心</th><th style="width:80px;">工时(h)</th><th style="width:50px;">操作</th>
            </tr></thead>
            <tbody id="woOpsBody">${opsRows}</tbody>
          </table>
        </div>
      </div>

      <!-- 页签2：物料组件 -->
      <div class="tab-panel" id="woTabPanel2" style="padding-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:12px;color:var(--text-secondary);">${matSourceHint}，可自由增删改</span>
          <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddMaterialRow()">+ 添加物料</button>
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <table class="data-table" style="font-size:12px;margin:0;">
            <thead><tr><th style="width:120px;">物料编码</th><th>物料名称</th><th style="width:80px;">需求数量</th><th style="width:60px;">单位</th><th style="width:50px;">操作</th></tr></thead>
            <tbody id="woMatBody">${matBodyHtml}</tbody>
          </table>
        </div>
      </div>

      <!-- 页签3：工具/工装 -->
      <div class="tab-panel" id="woTabPanel3" style="padding-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:12px;color:var(--text-secondary);">${toolSourceHint}，可自由增删改</span>
          <button class="btn btn-sm" style="background:#eff6ff;color:#1e40af;border:1px solid #93c5fd;padding:5px 12px;font-size:12px;" onclick="MaintenanceWorkOrderV3._woAddToolRow()">+ 添加工具</button>
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <table class="data-table" style="font-size:12px;margin:0;">
            <thead><tr><th style="width:120px;">工具编号</th><th>工具/工装名称</th><th style="width:80px;">数量</th><th style="width:50px;">操作</th></tr></thead>
            <tbody id="woToolBody">${toolBodyHtml}</tbody>
          </table>
        </div>
      </div>

      <!-- 页签4：安全措施 -->
      <div class="tab-panel" id="woTabPanel4" style="padding-top:12px;">
        <div class="form-group">
          <label style="font-weight:600;font-size:13px;">安全措施（选填）</label>
          <textarea id="plWoSafety" rows="5" placeholder="记录隔离、锁定、防护要求等&#10;（维护计划通常不含安全措施，请手动填写）" style="resize:vertical;min-height:100px;"></textarea>
        </div>
      </div>

      <!-- 页签5：附件 -->
      <div class="tab-panel" id="woTabPanel5" style="padding-top:12px;">
        <div style="border:2px dashed var(--border);border-radius:8px;padding:24px;text-align:center;cursor:pointer;transition:all .15s;"
          onclick="toast('附件上传功能将在后续版本实现')"
          onmouseenter="this.style.borderColor='var(--primary)';this.style.background='#f8fafc';"
          onmouseleave="this.style.borderColor='var(--border)';this.style.background='white';">
          <div style="font-size:32px;margin-bottom:6px;">📎</div>
          <div style="font-size:13px;color:var(--text-secondary);">点击上传附件</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">支持图片、文档（作业指导书、参考图纸等）</div>
        </div>
      </div>
    </div>`;

    showModal('🔧 从维护计划创建工单', body, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'保存为草稿',cls:'btn-secondary',style:'background:#f3f4f6;color:#374151;border:1px solid #d1d5db;',action:()=>{ MaintenanceWorkOrderV3._doCreateFromPlan('${plan.id}','draft'); }},
      {text:'保存',cls:'btn-primary',action:()=>{ MaintenanceWorkOrderV3._doCreateFromPlan('${plan.id}','full'); }}
    ], 'modal-xl');

    // 初始化PM03联动
    this._plOnTypeChange();
  },

  /* ----- _doCreateFromPlan：草稿/完整保存双模式 ----- */
  _doCreateFromPlan(planId, mode) {
    const plan = pmPlanData.find(p => p.id === planId);
    if (!plan) return;

    const eqCode = document.getElementById('plWoEq')?.value || document.getElementById('plHiddenEq')?.value;
    if (!eqCode) { toast('未获取到关联设备！'); return; }

    const auart = document.getElementById('plWoType')?.value || 'PM01';
    const desc = document.getElementById('plWoDesc')?.value?.trim() || (plan.name + ' - ' + (equipmentData.find(e => e.code === eqCode)?.name || ''));
    const wc = document.getElementById('plWoWC')?.value;
    const prio = document.getElementById('plWoPrio')?.value || '2-中';
    const gstrp = document.getElementById('plWoGstrp')?.value || '';
    const gltrp = document.getElementById('plWoGltrp')?.value || '';
    const settleObj = document.getElementById('plWoSettleObj')?.value?.trim() || '';
    const safety = document.getElementById('plWoSafety')?.value?.trim() || '';

    // 校验
    if (!auart) { toast('请确认工单类型！'); return; }

    if (mode === 'full') {
      if (!wc) { toast('请选择主要工作中心！'); return; }
      if (!desc) { toast('请填写工单描述！'); return; }
      if (auart === 'PM03' && !settleObj) { toast('PM03 改造/项目工单必须填写结算对象！'); return; }
      const ops = this._woCollectOperations();
      if (ops.length === 0) { toast('请至少保留一道工序！'); return; }
    }

    const eq = equipmentData.find(e => e.code === eqCode);
    const maxNum = workOrderV2Data.reduce((max, w) => Math.max(max, parseInt(w.AUFNR.replace('O', ''))), 0);
    const newAUFNR = 'O' + String(maxNum + 1).padStart(7, '0');
    const newId = 'WO' + String(workOrderV2Data.length + 1).padStart(5, '0');

    const auartMap = { PM01: 'PM01 - 预防性维护工单', PM02: 'PM02 - 维修工单', PM03: 'PM03 - 改造/项目工单' };
    const statTxt = mode === 'draft' ? '草稿' : '编辑中';
    const today = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()).padStart(2, '0');

    // 关联的任务清单号
    const tlNo = plan.associatedTaskList ? plan.associatedTaskList.PLNNR : '';

    // 创建工单
    workOrderV2Data.push({
      id: newId, AUFNR: newAUFNR, AUART: auart, AUART_TXT: auartMap[auart] || '',
      EQUNR: eqCode, EQKTX: eq ? eq.name : '', KURZTEXT: desc,
      PRIOK: prio, STAT: 'CRTE', STAT_TXT: statTxt,
      GSTRP: gstrp || today, GLTRP: gltrp || '',
      PERNR: eq ? (eq.leader || '当前用户') : '当前用户',
      sourceNo: '', taskListNo: tlNo,
      planSource: plan.code,   // 标记来源为维护计划
      faultPhenomenon: '', faultCause: '', solution: '',
      faultPhenomenonCode: '', faultCauseCode: '', faultSolutionCode: '',
      safetyMeasures: safety, acceptancePerson: '', acceptanceTime: '', acceptanceResult: '',
      createdBy: '当前用户', createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN'),
      settlementObject: settleObj
    });

    // 保存工序（从表单收集）
    const ops = this._woCollectOperations();
    if (ops.length > 0) {
      if (typeof operationV2Data === 'undefined') window.operationV2Data = [];
      ops.forEach(op => {
        operationV2Data.push({
          orderId: newId, VORNR: op.VORNR, LTXA1: op.LTXA1,
          ARBPL: op.ARBPL || wc, ARBEIT: op.ARBEIT, ISMNW: 0,
          status: 'pending', feedback: ''
        });
      });
    }

    // 保存物料（从表单收集）
    const mats = this._woCollectMaterials();
    if (mats.length > 0) {
      if (typeof materialComponentV2Data === 'undefined') window.materialComponentV2Data = [];
      mats.forEach(m => {
        materialComponentV2Data.push({
          orderId: newId, MATNR: m.MATNR, MATKTX: m.MATKTX,
          BDMNG: m.BDMNG, MEINS: m.MEINS, ENMNG: 0, remark: '来源计划: ' + plan.code
        });
      });
    }

    // 保存工具/工装（从表单收集）
    const tools = this._woCollectTools();
    if (tools.length > 0) {
      if (typeof toolComponentV2Data === 'undefined') window.toolComponentV2Data = [];
      tools.forEach(t => {
        toolComponentV2Data.push({
          orderId: newId, WRKCT: t.WRKCT, WRKTX: t.WRKTX,
          MGEIN: t.MGEIN, remark: '来源计划: ' + plan.code
        });
      });
    }

    const totalOps = operationV2Data.filter(o => o.orderId === newId).length;
    const totalMats = materialComponentV2Data.filter(m => m.orderId === newId).length;
    const totalTools = (typeof toolComponentV2Data !== 'undefined' ? toolComponentV2Data : []).filter(t => t.orderId === newId).length;

    const msg = mode === 'draft' ? '草稿已保存！' : '工单已生成！';
    toast(msg + ' 编号：' + newAUFNR + ' | 来源计划：' + plan.code + ' | 已带入 ' + totalOps + ' 道工序、' + totalMats + ' 条物料' + (totalTools > 0 ? '、' + totalTools + ' 件工具' : ''));
    closeModal();
    this.filtered = [...workOrderV2Data];
    this.renderTable();
  },

  /* ----- 维护计划引用辅助：工单类型联动（PM03结算对象） ----- */
  _plOnTypeChange() {
    const type = document.getElementById('plWoType')?.value;
    const settleWrap = document.getElementById('plWoSettleWrap');
    if (settleWrap) settleWrap.style.display = type === 'PM03' ? '' : 'none';
  },

  /* ====================================
     详情弹窗（多页签，与 v2 一致）
     ==================================== */
  detail(id) {
    const wo=workOrderV2Data.find(w=>w.id===id);
    if(!wo)return;
    this._detailId=id;
    this._detailTab='header';

    const eq=equipmentData.find(e=>e.code===wo.EQUNR);
    const ops=operationV2Data.filter(o=>o.orderId===id);
    const mats=materialComponentV2Data.filter(m=>m.orderId===id);
    const srcNotif=notificationV2Data.find(n=>n.QMNUM===wo.sourceNo);
    const srcTL = wo.taskListNo ? ((typeof taskListMockData !== 'undefined' ? taskListMockData : []).find(t=>t.PLNNR===wo.taskListNo)) : null;

    const body=this._buildDetailBody(wo,eq,ops,mats,srcNotif,srcTL);
    showModal('工单 '+esc(wo.AUFNR)+' - '+esc(wo.KURZTEXT), body, [
      {text:'关闭',cls:'btn-secondary',action:closeModal},
      {text:'保存',cls:'btn-primary',action:()=>{MaintenanceWorkOrderV3._saveDetail(wo.id);closeModal();}}
    ], 'modal-xl');
  },

  _buildDetailBody(wo,eq,ops,mats,srcNotif,srcTL) {
    const statColor={CRTE:'var(--warning)',APPR:'#f97316',REL:'var(--primary-lighter)',EXEC:'#7c3aed',COMP:'var(--success)',CLSD:'var(--text-muted)'};
    const statSteps=['CRTE','APPR','REL','EXEC','COMP','CLSD'];
    const stepLabels={CRTE:'编辑中',APPR:'待审批',REL:'已审批',EXEC:'执行中',COMP:'已完工',CLSD:'已关闭'};
    const currentStep=statSteps.indexOf(wo.STAT);

    let sourceInfo = '手动创建';
    if (srcTL) sourceInfo = '📑 任务清单: '+esc(srcTL.PLNNR)+' — '+esc(srcTL.PLTXT);
    else if (srcNotif) sourceInfo = '📋 通知单: '+esc(srcNotif.QMNUM);

    return `
    <div style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div>
          <div style="font-size:18px;font-weight:700;">工单 ${esc(wo.AUFNR)}</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">${esc(wo.EQUNR)} ${esc(wo.EQKTX)} | 来源：${sourceInfo}</div>
        </div>
        <div>
          <span class="badge" style="background:${statColor[wo.STAT]||'#6b7280'};color:white;font-size:13px;padding:4px 12px;">${esc(wo.STAT_TXT)}</span>
        </div>
      </div>
      <div style="display:flex;gap:4px;align-items:center;margin-top:8px;">
        ${statSteps.map((s,i)=>`
          <div style="flex:1;text-align:center;position:relative;">
            <div style="width:24px;height:24px;border-radius:50%;margin:0 auto 4px;background:${i<=currentStep?statColor[wo.STAT]:'#e5e7eb'};color:${i<=currentStep?'white':'#9ca3af'};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;">${i<=currentStep?'✓':i+1}</div>
            <div style="font-size:10px;color:${i<=currentStep?'var(--text)':'var(--text-muted)'};">${stepLabels[s]}</div>
            ${i<statSteps.length-1?`<div style="position:absolute;top:10px;left:60%;width:80%;height:2px;background:${i<currentStep?statColor[wo.STAT]:'#e5e7eb'};"></div>`:''}
          </div>
        `).join('')}
      </div>
    </div>

    <div class="tabs" style="margin-bottom:16px;border-bottom:2px solid var(--border);">
      <div class="tab ${this._detailTab==='header'?'active':''}" onclick="MaintenanceWorkOrderV3._switchTab(event,'header')">抬头数据</div>
      <div class="tab ${this._detailTab==='operations'?'active':''}" onclick="MaintenanceWorkOrderV3._switchTab(event,'operations')">工序 (${ops.length})</div>
      <div class="tab ${this._detailTab==='materials'?'active':''}" onclick="MaintenanceWorkOrderV3._switchTab(event,'materials')">物料组件 (${mats.length})</div>
      <div class="tab ${this._detailTab==='safety'?'active':''}" onclick="MaintenanceWorkOrderV3._switchTab(event,'safety')">安全措施</div>
      <div class="tab ${this._detailTab==='feedback'?'active':''}" onclick="MaintenanceWorkOrderV3._switchTab(event,'feedback')">执行反馈与关闭</div>
    </div>

    <div id="wo3DetailTabContent" style="max-height:50vh;overflow-y:auto;padding:4px 0;">
      ${this._buildTabContent(wo,eq,ops,mats,srcNotif,srcTL)}
    </div>`;
  },

  _switchTab(event,name) {
    this._detailTab=name;
    const wo=workOrderV2Data.find(w=>w.id===this._detailId);
    if(!wo)return;
    const eq=equipmentData.find(e=>e.code===wo.EQUNR);
    const ops=operationV2Data.filter(o=>o.orderId===this._detailId);
    const mats=materialComponentV2Data.filter(m=>m.orderId===this._detailId);
    const srcNotif=notificationV2Data.find(n=>n.QMNUM===wo.sourceNo);
    const srcTL = wo.taskListNo ? ((typeof taskListMockData !== 'undefined' ? taskListMockData : []).find(t=>t.PLNNR===wo.taskListNo)) : null;

    const modal=event.target.closest('.modal');
    if(modal){
      modal.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      event.target.classList.add('active');
    }
    const container=document.getElementById('wo3DetailTabContent');
    if(container)container.innerHTML=this._buildTabContent(wo,eq,ops,mats,srcNotif,srcTL);
  },

  _buildTabContent(wo,eq,ops,mats,srcNotif,srcTL) {
    switch(this._detailTab) {
      case 'header': return this._buildHeaderTab(wo,eq,srcNotif,srcTL);
      case 'operations': return this._buildOperationsTab(wo,ops);
      case 'materials': return this._buildMaterialsTab(wo,mats);
      case 'safety': return this._buildSafetyTab(wo);
      case 'feedback': return this._buildFeedbackTab(wo,ops);
      default: return '';
    }
  },

  _buildHeaderTab(wo,eq,srcNotif,srcTL) {
    let sourceLine='-';
    if(srcTL)sourceLine='📑 任务清单: '+esc(srcTL.PLNNR)+' — '+esc(srcTL.PLTXT);
    else if(srcNotif)sourceLine='📋 通知单: '+esc(srcNotif.QMNUM);
    else sourceLine='✍️ 手工创建';

    // Build fault chain display
    const hasFaultChain = wo.faultPhenomenonCode || wo.faultCauseCode || wo.faultSolutionCode;
    let faultChainHtml = '';
    if (hasFaultChain) {
      faultChainHtml = `
      <div style="grid-column:1/-1;background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:8px;padding:14px;">
        <div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--primary-lighter);">🔍 故障分析链</div>
        <div style="display:flex;align-items:center;gap:8px;font-size:12px;">
          <span style="padding:4px 10px;background:#fee2e2;border-radius:4px;color:#dc2626;">${wo.faultPhenomenonCode ? esc(getCatalogFullName('A', wo.faultPhenomenonCode)) : '—'}</span>
          <span style="color:var(--text-muted);">→</span>
          <span style="padding:4px 10px;background:#fef3c7;border-radius:4px;color:#d97706;">${wo.faultCauseCode ? esc(getCatalogFullName('B', wo.faultCauseCode)) : '—'}</span>
          <span style="color:var(--text-muted);">→</span>
          <span style="padding:4px 10px;background:#dcfce7;border-radius:4px;color:#059669;">${wo.faultSolutionCode ? esc(getCatalogFullName('C', wo.faultSolutionCode)) : '—'}</span>
        </div>
      </div>`;
    } else if (srcNotif && srcNotif.faultPhenomenonCode) {
      faultChainHtml = `
      <div style="grid-column:1/-1;background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:8px;padding:14px;">
        <div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--primary-lighter);">🔍 故障分析链（来自通知单）</div>
        <div style="display:flex;align-items:center;gap:8px;font-size:12px;">
          <span style="padding:4px 10px;background:#fee2e2;border-radius:4px;color:#dc2626;">${esc(getCatalogFullName('A', srcNotif.faultPhenomenonCode))}</span>
          <span style="color:var(--text-muted);">→</span>
          <span style="padding:4px 10px;background:#fef3c7;border-radius:4px;color:#d97706;">${srcNotif.faultCauseCode ? esc(getCatalogFullName('B', srcNotif.faultCauseCode)) : '待补充'}</span>
          <span style="color:var(--text-muted);">→</span>
          <span style="padding:4px 10px;background:#dcfce7;border-radius:4px;color:#059669;">${srcNotif.faultSolutionCode ? esc(getCatalogFullName('C', srcNotif.faultSolutionCode)) : '待补充'}</span>
        </div>
      </div>`;
    }

    return `<div class="detail-grid" style="margin-bottom:16px;">
      <div class="detail-item"><dt>工单类型</dt><dd>${MaintenanceWorkOrderV3._typeBadge(wo.AUART)}</dd></div>
      <div class="detail-item"><dt>设备编码</dt><dd>${esc(wo.EQUNR)}</dd></div>
      <div class="detail-item"><dt>设备名称</dt><dd>${esc(wo.EQKTX)}</dd></div>
      <div class="detail-item"><dt>功能位置</dt><dd>${eq?esc(eq.locationName):'-'}</dd></div>
      <div class="detail-item"><dt>优先级</dt><dd>${esc(wo.PRIOK)}</dd></div>
      <div class="detail-item"><dt>计划开始</dt><dd>${esc(wo.GSTRP)}</dd></div>
      <div class="detail-item"><dt>计划完成</dt><dd>${esc(wo.GLTRP)}</dd></div>
      <div class="detail-item"><dt>负责人</dt><dd>${esc(wo.PERNR)}</dd></div>
      <div class="detail-item"><dt>创建方式</dt><dd>${sourceLine}</dd></div>
      <div class="detail-item" style="grid-column:1/-1;"><dt>工单描述</dt><dd style="white-space:pre-wrap;">${esc(wo.KURZTEXT)}</dd></div>
      ${faultChainHtml}
      <div style="grid-column:1/-1;padding:12px 0;border-top:1px solid var(--border);margin-top:4px;">
        <div style="font-weight:600;font-size:13px;margin-bottom:8px;">状态变更</div>
        <div style="display:flex;gap:6px;">
          ${wo.STAT==='CRTE'?`<button class="btn btn-warning btn-sm" style="background:#f97316;color:white;border:none;" onclick="MaintenanceWorkOrderV3.changeStatus('${wo.id}','APPR');MaintenanceWorkOrderV3._refreshDetail();">提交审批 → APPR</button>`:''}
          ${wo.STAT==='APPR'?`<button class="btn btn-success btn-sm" onclick="MaintenanceWorkOrderV3.changeStatus('${wo.id}','REL');MaintenanceWorkOrderV3._refreshDetail();">审批通过 → REL</button><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;" onclick="MaintenanceWorkOrderV3.changeStatus('${wo.id}','CRTE');MaintenanceWorkOrderV3._refreshDetail();">审批退回 → CRTE</button>`:''}
          ${wo.STAT==='REL'?`<button class="btn btn-warning btn-sm" style="background:var(--warning);color:white;border:none;" onclick="MaintenanceWorkOrderV3.changeStatus('${wo.id}','EXEC');MaintenanceWorkOrderV3._refreshDetail();">开始执行 → EXEC</button>`:''}
          ${wo.STAT==='EXEC'?`<button class="btn btn-sm" style="background:#059669;color:white;border:none;" onclick="MaintenanceWorkOrderV3.changeStatus('${wo.id}','COMP');MaintenanceWorkOrderV3._refreshDetail();">完工验收 → COMP</button>`:''}
          ${wo.STAT==='COMP'?`<button class="btn btn-blue btn-sm" onclick="MaintenanceWorkOrderV3.changeStatus('${wo.id}','CLSD');MaintenanceWorkOrderV3._refreshDetail();">关闭归档 → CLSD</button>`:''}
        </div>
      </div>
    </div>`;
  },

  _buildOperationsTab(wo,ops) {
    const isEditable=wo.STAT==='CRTE'||wo.STAT==='REL';
    if(ops.length===0) {
      return `<div style="text-align:center;padding:40px;color:var(--text-muted);">
        <div style="font-size:36px;margin-bottom:8px;">🛠️</div><div style="font-size:13px;margin-bottom:12px;">暂无工序</div>
        ${isEditable?`<button class="btn btn-blue btn-sm" onclick="MaintenanceWorkOrderV3._addOperation('${wo.id}')">+ 添加工序</button>`:''}
      </div>`;
    }
    let html=`<div style="overflow-x:auto;"><table class="data-table" style="font-size:13px;">
      <thead><tr><th style="width:50px;">工序号</th><th>描述</th><th>工作中心</th><th>计划工时(h)</th><th>实际工时(h)</th><th>状态</th>${isEditable?`<th style="width:60px;">操作</th>`:''}</tr></thead><tbody>`;
    ops.forEach((o,idx)=>{
      const statusBadge=o.status==='completed'?'<span class="badge badge-green">✓ 完成</span>':
        o.status==='in_progress'?'<span class="badge badge-blue">▶ 进行中</span>':
        '<span class="badge badge-gray">○ 待执行</span>';
      html+=`<tr>
        <td style="text-align:center;">${esc(o.VORNR)}</td><td>${esc(o.LTXA1)}</td><td>${esc(o.ARBPL)}</td>
        <td>${esc(o.ARBEIT)}</td><td>${esc(o.ISMNW||'-')}</td><td>${statusBadge}</td>
        ${isEditable?`<td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:2px 6px;font-size:11px;cursor:pointer;" onclick="MaintenanceWorkOrderV3._removeOperation('${wo.id}',${idx})">删除</button></td>`:''}
      </tr>`;
    });
    html+=`</tbody></table></div>`;
    // 常见工序库
    html+=`<div style="margin-top:16px;padding:14px;background:#f0f9ff;border-radius:8px;border:1px solid #bae6fd;">
      <div style="font-weight:600;font-size:13px;color:var(--primary-lighter);margin-bottom:10px;">💡 常见工序库（点击快速引用）</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        ${commonOperationLibrary.map(cl=>`
          <button onclick="MaintenanceWorkOrderV3._useCommonOps('${wo.id}','${cl.keyword}')" style="padding:5px 12px;border:1px solid #93c5fd;background:white;border-radius:20px;cursor:pointer;font-size:12px;transition:all .15s;"
            onmouseenter="this.style.background='#eff6ff';this.style.borderColor='#3b82f6';"
            onmouseleave="this.style.background='white';this.style.borderColor='#93c5fd';">
            ${esc(cl.description)}</button>
        `).join('')}
      </div></div>`;
    if(isEditable){
      html+=`<div style="text-align:center;margin-top:12px;"><button class="btn btn-blue btn-sm" onclick="MaintenanceWorkOrderV3._addOperation('${wo.id}')">+ 添加工序</button></div>`;
    }
    return html;
  },

  _buildMaterialsTab(wo,mats) {
    const isEditable=wo.STAT==='CRTE'||wo.STAT==='REL';
    if(mats.length===0){
      return `<div style="text-align:center;padding:40px;color:var(--text-muted);">
        <div style="font-size:36px;margin-bottom:8px;">📦</div><div style="font-size:13px;margin-bottom:12px;">暂无物料组件</div>
        ${isEditable?`<button class="btn btn-blue btn-sm" onclick="MaintenanceWorkOrderV3._addMaterial('${wo.id}')">+ 添加物料</button>`:''}
      </div>`;
    }
    let html=`<table class="data-table" style="font-size:13px;">
      <thead><tr><th>物料编码</th><th>名称</th><th>需求数量</th><th>单位</th><th>实际领用</th><th>备注</th>${isEditable?'<th style="width:60px;">操作</th>':''}</tr></thead><tbody>`;
    mats.forEach((m,idx)=>{
      html+=`<tr>
        <td><strong>${esc(m.MATNR)}</strong></td><td>${esc(m.MATKTX)}</td><td>${esc(m.BDMNG)}</td>
        <td>${esc(m.MEINS)}</td><td>${esc(m.ENMNG||'-')}</td><td>${esc(m.remark||'')}</td>
        ${isEditable?`<td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;padding:2px 6px;font-size:11px;cursor:pointer;" onclick="MaintenanceWorkOrderV3._removeMaterial('${wo.id}',${idx})">删除</button></td>`:''}
      </tr>`;
    });
    html+=`</tbody></table>`;
    if(isEditable) html+=`<div style="text-align:center;margin-top:12px;"><button class="btn btn-blue btn-sm" onclick="MaintenanceWorkOrderV3._addMaterial('${wo.id}')">+ 添加物料</button></div>`;
    return html;
  },

  _buildSafetyTab(wo) {
    const isEditable=wo.STAT!=='CLSD';
    return `<div style="padding:8px 0;">
      <div style="font-weight:600;font-size:14px;margin-bottom:12px;color:var(--danger);">⚠ 安全措施</div>
      <textarea id="wo3SafetyMeasures" rows="6" placeholder="记录隔离、锁定、挂牌、危险警示、个人防护装备(PPE)等信息..."
        style="width:100%;padding:12px;border:1px solid var(--border);border-radius:8px;font-size:13px;line-height:1.6;resize:vertical;" ${isEditable?'':'readonly'}>${esc(wo.safetyMeasures||'')}</textarea>
      ${isEditable?`<button class="btn btn-primary btn-sm" style="margin-top:10px;" onclick="MaintenanceWorkOrderV3._saveSafety('${wo.id}')">保存安全措施</button>`:''}
      <div style="margin-top:14px;padding:12px;background:#fffbeb;border-radius:8px;border:1px solid #fde68a;">
        <div style="font-weight:600;font-size:13px;color:#d97706;margin-bottom:4px;">安全提示</div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
          ✓ 作业前必须执行LOTO（上锁挂牌）<br>✓ 确认能源隔离完成后方可作业<br>✓ 涉及密闭空间的需进行气体检测<br>✓ 高处作业佩戴安全带
        </div></div></div>`;
  },

  _buildFeedbackTab(wo,ops) {
    const isExecutable=wo.STAT==='EXEC'||wo.STAT==='COMP';
    return `<div style="padding:8px 0;">
      <div style="font-weight:600;font-size:14px;margin-bottom:10px;">工序反馈</div>
      <div style="max-height:200px;overflow-y:auto;margin-bottom:16px;">
        ${ops.map((o,idx)=>{
          const opIdx=operationV2Data.indexOf(o);
          return `<div style="display:flex;align-items:center;padding:8px 12px;background:${o.status==='completed'?'#f0fdf4':'#f8fafc'};border-radius:6px;margin-bottom:6px;gap:10px;border:1px solid ${o.status==='completed'?'#bbf7d0':'var(--border)'};">
            <input type="checkbox" ${o.status==='completed'?'checked':''} ${isExecutable?'':'disabled'} onchange="MaintenanceWorkOrderV3._toggleOpStatus(${opIdx},this.checked)">
            <div style="flex:1;font-size:13px;"><strong>${esc(o.VORNR)}</strong> ${esc(o.LTXA1)}</div>
            <input placeholder="实际工时(h)" value="${esc(o.ISMNW||'')}" style="width:90px;padding:4px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;" ${isExecutable?'':'readonly'} onchange="MaintenanceWorkOrderV3._updateOpHours(${opIdx},this.value)">
            <input placeholder="备注" value="${esc(o.feedback||'')}" style="width:160px;padding:4px 6px;border:1px solid var(--border);border-radius:3px;font-size:12px;" ${isExecutable?'':'readonly'} onchange="MaintenanceWorkOrderV3._updateOpFeedback(${opIdx},this.value)">
          </div>`;
        }).join('')}
      </div>
      <div style="font-weight:600;font-size:14px;margin-bottom:10px;">故障信息</div>
      <div style="padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:16px;border:1px solid var(--border);">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div class="form-group">
            <label style="font-weight:600;">故障现象（目录A · 通知单已记录）</label>
            <input value="${esc(wo.faultPhenomenonCode ? getCatalogFullName('A', wo.faultPhenomenonCode) : wo.faultPhenomenon||'')}" readonly style="background:#f0fdf4;border-color:#bbf7d0;color:#166534;width:100%;padding:6px 8px;border-radius:4px;font-size:12px;">
          </div>
          <div class="form-group">
            <label style="font-weight:600;">故障原因（目录B）<span class="req">*</span></label>
            ${isExecutable ? `<select id="wo3FaultCauseCode" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;">${buildCatalogOptions('B', true, wo.faultCauseCode)}</select><textarea id="wo3FaultCause" rows="1" placeholder="或手动补充原因..." style="width:100%;margin-top:6px;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;">${esc(wo.faultCause||'')}</textarea>`
              : `<input value="${esc(wo.faultCauseCode ? getCatalogFullName('B', wo.faultCauseCode) : wo.faultCause||'')}" readonly style="width:100%;padding:6px 8px;border-radius:4px;font-size:12px;background:var(--bg);">`}
          </div>
        </div>
        <div class="form-group full" style="margin-top:10px;">
          <label style="font-weight:600;">解决措施（目录C）<span class="req">*</span></label>
          ${isExecutable ? `<select id="wo3FaultSolutionCode" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;">${buildCatalogOptions('C', true, wo.faultSolutionCode)}</select><textarea id="wo3Solution" rows="2" placeholder="或手动补充措施..." style="width:100%;margin-top:6px;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;">${esc(wo.solution||'')}</textarea>`
            : `<textarea id="wo3Solution" rows="2" readonly style="width:100%;padding:6px 8px;background:var(--bg);border-radius:4px;font-size:12px;">${esc(wo.faultSolutionCode ? getCatalogFullName('C', wo.faultSolutionCode) : wo.solution||'')}</textarea>`}
        </div>
      </div>
      <div style="font-weight:600;font-size:14px;margin-bottom:10px;">验收信息</div>
      <div class="detail-grid" style="margin-bottom:16px;">
        <div class="form-group"><label>验收人</label><input id="wo3Acceptor" value="${esc(wo.acceptancePerson||'')}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;" ${wo.STAT==='EXEC'?'':'readonly'}></div>
        <div class="form-group"><label>验收时间</label><input type="datetime-local" id="wo3AcceptTime" value="${esc(wo.acceptanceTime||'')}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;" ${wo.STAT==='EXEC'?'':'readonly'}></div>
        <div class="form-group full"><label>验收结论</label><textarea id="wo3AcceptResult" rows="2" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;" ${wo.STAT==='EXEC'?'':'readonly'}>${esc(wo.acceptanceResult||'')}</textarea></div>
      </div>
      ${isExecutable?`<button class="btn btn-primary btn-sm" onclick="MaintenanceWorkOrderV3._saveFeedback('${wo.id}')">保存反馈</button>`:''}
      <div style="margin-top:12px;font-size:12px;color:var(--text-muted);">创建人：${esc(wo.createdBy)} | 创建：${esc(wo.createdAt)} | 更新：${esc(wo.updatedAt)}</div></div>`;
  },

  /* ========== 辅助方法 ========== */
  _addOperation(orderId) {
    const maxVornr=operationV2Data.filter(o=>o.orderId===orderId).reduce((max,o)=>Math.max(max,parseInt(o.VORNR)),0);
    const newVornr=String(maxVornr+10).padStart(4,'0');
    operationV2Data.push({orderId,VORNR:newVornr,LTXA1:'新工序',ARBPL:'维修一班',ARBEIT:1,ISMNW:'',status:'pending',feedback:''});
    toast('工序已添加'); this._refreshDetail();
  },
  _removeOperation(orderId,idx){
    const ops=operationV2Data.filter(o=>o.orderId===orderId);
    if(idx>=0&&idx<ops.length){const di=operationV2Data.indexOf(ops[idx]);if(di>=0)operationV2Data.splice(di,1);}
    toast('工序已删除'); this._refreshDetail();
  },
  _useCommonOps(orderId,keyword){
    const lib=commonOperationLibrary.find(cl=>cl.keyword===keyword);if(!lib)return;
    const existing=operationV2Data.filter(o=>o.orderId===orderId);
    const startVornr=existing.reduce((max,o)=>Math.max(max,parseInt(o.VORNR)),0);
    lib.ops.forEach((op,idx)=>{operationV2Data.push({orderId,VORNR:String(startVornr+(idx+1)*10).padStart(4,'0'),LTXA1:op,ARBPL:'维修一班',ARBEIT:1,ISMNW:'',status:'pending',feedback:''});});
    toast('已引用「'+lib.description+'」的 '+lib.ops.length+' 道工序'); this._refreshDetail();
  },

  _addMaterial(orderId) {
    showModal('添加物料', `
      <div class="form-grid">
        <div class="form-group"><label>物料编码<span class="req">*</span></label><input id="mat3MATNR" placeholder="如 MAT-SEAL-001"></div>
        <div class="form-group"><label>物料名称<span class="req">*</span></label><input id="mat3MATKTX" placeholder="物料名称"></div>
        <div class="form-group"><label>需求数量</label><input type="number" id="mat3BDMNG" value="1" min="1"></div>
        <div class="form-group"><label>单位</label><input id="mat3MEINS" value="个"></div>
        <div class="form-group full"><label>备注</label><input id="mat3Remark" placeholder="选填"></div>
      </div>`, [
      {text:'取消',cls:'btn-secondary',action:closeModal},
      {text:'添加',cls:'btn-primary',action:()=>{
        const MATNR=document.getElementById('mat3MATNR').value.trim();
        const MATKTX=document.getElementById('mat3MATKTX').value.trim();
        if(!MATNR||!MATKTX){toast('请完善物料编码和名称！');return;}
        materialComponentV2Data.push({orderId,MATNR,MATKTX,BDMNG:parseFloat(document.getElementById('mat3BDMNG').value)||1,MEINS:document.getElementById('mat3MEINS').value||'个',ENMNG:'',remark:document.getElementById('mat3Remark').value});
        toast('物料已添加'); closeModal(); this._refreshDetail();
      }}]);
  },
  _removeMaterial(orderId,idx){
    const mats=materialComponentV2Data.filter(m=>m.orderId===orderId);
    if(idx>=0&&idx<mats.length){const di=materialComponentV2Data.indexOf(mats[idx]);if(di>=0)materialComponentV2Data.splice(di,1);}
    toast('物料已删除'); this._refreshDetail();
  },

  _toggleOpStatus(opIdx,checked){if(opIdx>=0&&opIdx<operationV2Data.length){operationV2Data[opIdx].status=checked?'completed':'pending';this._refreshDetail();}},
  _updateOpHours(opIdx,value){if(opIdx>=0&&opIdx<operationV2Data.length)operationV2Data[opIdx].ISMNW=value||'';},
  _updateOpFeedback(opIdx,value){if(opIdx>=0&&opIdx<operationV2Data.length)operationV2Data[opIdx].feedback=value||'';},

  _saveSafety(orderId){
    const wo=workOrderV2Data.find(w=>w.id===orderId);if(!wo)return;
    wo.safetyMeasures=document.getElementById('wo3SafetyMeasures').value;
    wo.updatedAt=new Date().toLocaleString('zh-CN'); toast('安全措施已保存！');
  },
  _saveFeedback(orderId){
    const wo=workOrderV2Data.find(w=>w.id===orderId);if(!wo)return;
    const cauCode=document.getElementById('wo3FaultCauseCode');if(cauCode)wo.faultCauseCode=cauCode.value;
    const solCode=document.getElementById('wo3FaultSolutionCode');if(solCode)wo.faultSolutionCode=solCode.value;
    const cau=document.getElementById('wo3FaultCause');if(cau)wo.faultCause=cau.value;
    const sol=document.getElementById('wo3Solution');if(sol)wo.solution=sol.value;
    const acc=document.getElementById('wo3Acceptor');if(acc)wo.acceptancePerson=acc.value;
    const ati=document.getElementById('wo3AcceptTime');if(ati)wo.acceptanceTime=ati.value;
    const ars=document.getElementById('wo3AcceptResult');if(ars)wo.acceptanceResult=ars.value;
    wo.updatedAt=new Date().toLocaleString('zh-CN'); toast('反馈已保存！');
    // Write-back to linked notification if applicable
    if (wo.sourceNo) {
      const n = notificationV2Data.find(x => x.QMNUM === wo.sourceNo);
      if (n) {
        if (wo.faultCauseCode) n.faultCauseCode = wo.faultCauseCode;
        if (wo.faultSolutionCode) n.faultSolutionCode = wo.faultSolutionCode;
        if (wo.faultCause) n.faultCause = wo.faultCause;
        if (wo.solution) n.faultSolution = wo.solution;
      }
    }
  },

  changeStatus(orderId,newStatus) {
    const wo=workOrderV2Data.find(w=>w.id===orderId);if(!wo)return;
    const statusMap={CRTE:{STAT_TXT:'编辑中',color:'var(--warning)'},APPR:{STAT_TXT:'待审批',color:'#f97316'},REL:{STAT_TXT:'已审批/待执行',color:'var(--primary-lighter)'},EXEC:{STAT_TXT:'执行中',color:'#7c3aed'},COMP:{STAT_TXT:'已完工',color:'var(--success)'},CLSD:{STAT_TXT:'已关闭',color:'var(--text-muted)'}};
    const confirmText=wo.STAT==='CRTE'&&newStatus==='APPR'?'确认提交线下审批？工单将变为待审批状态。':
      wo.STAT==='APPR'&&newStatus==='REL'?'确认线下审批已通过？工单将进入待执行状态。':
      wo.STAT==='APPR'&&newStatus==='CRTE'?'确认退回？工单将回到编辑中状态。':
      wo.STAT==='REL'&&newStatus==='EXEC'?'确认开始执行？':wo.STAT==='EXEC'&&newStatus==='COMP'?'确认维修已完工？':
      wo.STAT==='COMP'&&newStatus==='CLSD'?'确认关闭归档？关闭后不可更改。':'确认变更状态？';
    if(!confirm(confirmText))return;
    wo.STAT=newStatus;wo.STAT_TXT=statusMap[newStatus].STAT_TXT;wo.updatedAt=new Date().toLocaleString('zh-CN');

    // Write-back: when COMP or CLSD, push fault cause/solution codes to linked notification
    if ((newStatus === 'COMP' || newStatus === 'CLSD') && wo.sourceNo) {
      const n = notificationV2Data.find(x => x.QMNUM === wo.sourceNo);
      if (n) {
        if (wo.faultCauseCode) n.faultCauseCode = wo.faultCauseCode;
        if (wo.faultSolutionCode) n.faultSolutionCode = wo.faultSolutionCode;
        if (wo.faultCause) n.faultCause = wo.faultCause;
        if (wo.solution) n.faultSolution = wo.solution;
        n.updatedAt = new Date().toLocaleString('zh-CN');
      }
    }

    toast('工单状态已变更为：'+wo.STAT_TXT);
    const tbody=document.getElementById('wo3TableBody');if(tbody)this.renderTable();
  },

  _saveDetail(id){
    const wo=workOrderV2Data.find(w=>w.id===id);if(!wo)return;
    this._saveFeedback(id);
    const safetyEl=document.getElementById('wo3SafetyMeasures');if(safetyEl)wo.safetyMeasures=safetyEl.value;
    toast('工单已保存！');
  },
  _refreshDetail(){
    const wo=workOrderV2Data.find(w=>w.id===this._detailId);if(!wo)return;
    const eq=equipmentData.find(e=>e.code===wo.EQUNR);
    const ops=operationV2Data.filter(o=>o.orderId===this._detailId);
    const mats=materialComponentV2Data.filter(m=>m.orderId===this._detailId);
    const srcNotif=notificationV2Data.find(n=>n.QMNUM===wo.sourceNo);
    const srcTL=wo.taskListNo?((typeof taskListMockData!=='undefined'?taskListMockData:[]).find(t=>t.PLNNR===wo.taskListNo)):null;
    const modalBody=document.querySelector('.modal-backdrop:not(.hidden) .modal-body');
    if(modalBody)modalBody.innerHTML=this._buildDetailBody(wo,eq,ops,mats,srcNotif,srcTL);
  }
};

// ===== 2.3 故障与经验库（重构 V3 — 基于「自研增强 + SAP 数据库」架构）=====
// ===== 2.4 设备维修履历与报表 =====
const MaintenanceReports = {
  activeTab:'reports',

  render() {
    return `
    <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;flex-shrink:0;">
        <div style="font-size:18px;font-weight:700;">设备维修履历与报表</div>
        <div style="font-size:13px;opacity:0.8;">MTTR/MTBF分析 | 故障排行 | 设备一生维修记录</div>
      </div>
      <div style="display:flex;gap:0;padding:8px 24px;background:white;border-bottom:1px solid var(--border);flex-shrink:0;">
        <button onclick="MaintenanceReports.switchTab('reports')" id="rptTabReports" style="padding:8px 18px;border:none;background:${this.activeTab==='reports'?'var(--primary)':'transparent'};color:${this.activeTab==='reports'?'white':'var(--text-secondary)'};border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s;margin-right:6px;">报表看板</button>
        <button onclick="MaintenanceReports.switchTab('history')" id="rptTabHistory" style="padding:8px 18px;border:none;background:${this.activeTab==='history'?'var(--primary)':'transparent'};color:${this.activeTab==='history'?'white':'var(--text-secondary)'};border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s;">设备维修履历</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:20px 24px;" id="rptContent">
        ${this.activeTab==='reports'?this.renderReports():this.renderHistory()}
      </div>
    </div>`;
  },

  init() { this.activeTab='reports'; },

  switchTab(name) {
    this.activeTab=name;
    const contentArea=document.getElementById('contentArea');
    if(contentArea)contentArea.innerHTML=this.render();
  },

  // 报表看板
  renderReports() {
    const reports=maintenanceReportData;
    if(!reports) return '<div style="text-align:center;padding:60px;color:var(--text-muted);">暂无报表数据</div>';

    // 工单执行统计
    let orderHtml=`<div style="background:white;border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:16px;">
      <div style="font-weight:700;font-size:15px;margin-bottom:16px;">工单执行情况</div>
      <div style="overflow-x:auto;"><table class="data-table" style="font-size:13px;">
        <thead><tr><th>期间</th><th>工单总数</th><th>已完成</th><th>完成率</th><th>平均工时(h)</th><th>平均成本(¥)</th></tr></thead>
        <tbody>`;

    const maxOrders=Math.max(...reports.orderExecStats.map(r=>r.totalOrders),1);
    reports.orderExecStats.forEach(r=>{
      const pct=((r.completed/r.totalOrders)*100).toFixed(1);
      const color=pct>=90?'var(--success)':pct>=75?'var(--warning)':'var(--danger)';
      orderHtml+=`<tr>
        <td><strong>${esc(r.period)}</strong></td>
        <td>${r.totalOrders}</td><td>${r.completed}</td>
        <td><span style="color:${color};font-weight:600;">${pct}%</span></td>
        <td>${r.avgHours}</td><td>${r.avgCost.toLocaleString()}</td>
      </tr>`;
    });
    orderHtml+=`</tbody></table></div></div>`;

    // MTTR/MTBF 图表
    let mttrHtml=`<div style="background:white;border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:16px;">
      <div style="font-weight:700;font-size:15px;margin-bottom:16px;">设备可靠性分析 (MTTR / MTBF)</div>
      <div style="display:flex;gap:20px;flex-wrap:wrap;">
        <div style="flex:1;min-width:300px;">
          <div style="font-weight:600;font-size:13px;margin-bottom:10px;color:var(--danger);">MTTR - 平均修复时间 (小时)</div>
          <div style="display:flex;align-items:flex-end;gap:8px;height:160px;padding:0 4px 20px 4px;border-bottom:2px solid var(--border);">`;

    const maxMttr=Math.max(...reports.mttrMtbf.map(r=>r.MTTR),1);
    reports.mttrMtbf.forEach((r,i)=>{
      const h=Math.max((r.MTTR/maxMttr)*130,4);
      mttrHtml+=`<div style="flex:1;text-align:center;">
        <div style="height:${h}px;background:linear-gradient(180deg, #ef4444, #fca5a5);border-radius:4px 4px 0 0;margin-bottom:4px;position:relative;transition:height .5s ease;"
          title="MTTR: ${r.MTTR}h">
          <div style="position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:700;color:var(--danger);white-space:nowrap;">${r.MTTR}h</div>
        </div>
        <div style="font-size:10px;color:var(--text-muted);transform:rotate(-30deg);transform-origin:center;margin-top:4px;">${r.period.replace('2026年','')}</div>
      </div>`;
    });

    mttrHtml+=`</div></div>
      <div style="flex:1;min-width:300px;">
        <div style="font-weight:600;font-size:13px;margin-bottom:10px;color:var(--success);">MTBF - 平均无故障时间 (小时)</div>
        <div style="display:flex;align-items:flex-end;gap:8px;height:160px;padding:0 4px 20px 4px;border-bottom:2px solid var(--border);">`;

    const maxMtbf=Math.max(...reports.mttrMtbf.map(r=>r.MTBF),1);
    reports.mttrMtbf.forEach(r=>{
      const h=Math.max((r.MTBF/maxMtbf)*130,4);
      mttrHtml+=`<div style="flex:1;text-align:center;">
        <div style="height:${h}px;background:linear-gradient(180deg, #059669, #6ee7b7);border-radius:4px 4px 0 0;margin-bottom:4px;transition:height .5s ease;"
          title="MTBF: ${r.MTBF}h">
          <div style="position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:700;color:#059669;white-space:nowrap;">${r.MTBF}h</div>
        </div>
        <div style="font-size:10px;color:var(--text-muted);transform:rotate(-30deg);transform-origin:center;margin-top:4px;">${r.period.replace('2026年','')}</div>
      </div>`;
    });
    mttrHtml+=`</div></div></div>
      <div style="margin-top:12px;padding:10px 14px;background:#f8fafc;border-radius:6px;font-size:12px;color:var(--text-secondary);line-height:1.6;">
        📐 <strong>MTTR</strong> (平均修复时间) = 总修复时间 ÷ 故障次数 | <strong>MTBF</strong> (平均无故障时间) = 运行总时间 ÷ 故障次数
      </div>
    </div>`;

    // 故障排行榜 (帕累托)
    let paretoHtml=`<div style="background:white;border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:16px;">
      <div style="font-weight:700;font-size:15px;margin-bottom:16px;">故障原因帕累托分析 (TOP10)</div>
      <div style="display:flex;gap:20px;">`;

    // 图表
    const maxCount=Math.max(...reports.top10Failures.map(f=>f.count),1);
    paretoHtml+=`<div style="flex:1;min-width:260px;">`;
    let cumPct=0;
    reports.top10Failures.forEach((f,idx)=>{
      cumPct+=f.pct;
      paretoHtml+=`<div style="margin-bottom:8px;display:flex;align-items:center;gap:8px;">
        <span style="width:14px;font-size:11px;color:var(--text-muted);text-align:right;">${idx+1}</span>
        <span style="font-size:11px;color:var(--text-secondary);width:80px;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(f.name)}">${esc(f.name)}</span>
        <div style="flex:1;height:18px;background:#f1f5f9;border-radius:3px;overflow:hidden;position:relative;">
          <div style="height:100%;width:${(f.count/maxCount)*100}%;background:linear-gradient(90deg, var(--primary-lighter), #60a5fa);border-radius:3px;transition:width .4s ease;"></div>
        </div>
        <span style="width:36px;font-size:11px;font-weight:600;color:var(--text);text-align:right;">${f.count}</span>
        <span style="width:42px;font-size:10px;color:var(--text-muted);text-align:right;">${cumPct}%</span>
      </div>`;
    });
    paretoHtml+=`<div style="margin-top:8px;font-size:11px;color:var(--text-muted);text-align:right;">累积百分比</div></div>`;

    // 表格
    paretoHtml+=`<div style="flex:1;min-width:200px;">
      <table class="data-table" style="font-size:12px;">
        <thead><tr><th>#</th><th>故障原因</th><th>次数</th><th>占比</th></tr></thead><tbody>`;
    reports.top10Failures.forEach((f,idx)=>{
      paretoHtml+=`<tr>
        <td>${idx+1}</td><td>${esc(f.name)}</td>
        <td style="font-weight:600;">${f.count}</td>
        <td><span style="color:${idx<3?'var(--danger)':'var(--text-secondary)'};">${f.pct}%</span></td>
      </tr>`;
    });
    paretoHtml+=`</tbody></table></div></div></div>`;

    return orderHtml+mttrHtml+paretoHtml;
  },

  // 设备维修履历
  renderHistory() {
    const eqOpts=equipmentData.map(e=>`<option value="${esc(e.code)}">${esc(e.name)} (${esc(e.code)})</option>`).join('');

    return `<div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding:16px;background:white;border:1px solid var(--border);border-radius:10px;">
        <label style="font-weight:600;font-size:13px;white-space:nowrap;">选择设备</label>
        <select id="rptSelectEq" onchange="MaintenanceReports._onEqChange()" style="flex:1;max-width:400px;padding:8px 12px;border:1px solid var(--border);border-radius:6px;">
          <option value="">请选择要查看履历的设备...</option>${eqOpts}
        </select>
      </div>
      <div id="rptEquipHistory"></div>
    </div>`;
  },

  _onEqChange() {
    const eqCode=document.getElementById('rptSelectEq').value;
    const container=document.getElementById('rptEquipHistory');
    if(!container)return;
    if(!eqCode){container.innerHTML='';return;}

    const eq=equipmentData.find(e=>e.code===eqCode);
    if(!eq)return;

    // 找到该设备相关的通知单
    const notifs=notificationV2Data.filter(n=>n.EQUNR===eqCode);
    // 找到该设备相关的工单
    const orders=workOrderV2Data.filter(w=>w.EQUNR===eqCode);
    // 该设备相关的测量点
    const measurementPoints=measurementPointData.filter(mp=>mp.equipmentId===eq.id);
    // 该设备相关的测量记录
    const records=measurementRecordData.filter(r=>r.equipmentId===eq.id);
    // 该设备相关的报警
    const alerts=alertEventData.filter(a=>a.equipmentId===eq.id);

    const totalMaintenance=orders.length;
    const faultOrders=orders.filter(w=>w.faultPhenomenon).length;
    const totalMats=materialComponentV2Data.filter(m=>orders.some(w=>w.id===m.orderId)).length;

    // 设备统计概览卡片
    let html=`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-bottom:20px;">
      <div class="stat-card" style="background:white;border:1px solid var(--border);border-radius:8px;padding:16px;">
        <div class="stat-label">维修次数</div><div class="stat-value">${totalMaintenance}</div>
        <div style="font-size:11px;color:var(--text-muted);">含故障维修${faultOrders}次</div>
      </div>
      <div class="stat-card" style="background:white;border:1px solid var(--border);border-radius:8px;padding:16px;">
        <div class="stat-label">消耗物料</div><div class="stat-value">${totalMats}</div>
        <div style="font-size:11px;color:var(--text-muted);">种备件</div>
      </div>
      <div class="stat-card" style="background:white;border:1px solid var(--border);border-radius:8px;padding:16px;">
        <div class="stat-label">测量点</div><div class="stat-value">${measurementPoints.length}</div>
        <div style="font-size:11px;color:var(--text-muted);">共${records.length}条记录</div>
      </div>
      <div class="stat-card" style="background:white;border:1px solid var(--border);border-radius:8px;padding:16px;">
        <div class="stat-label">报警事件</div><div class="stat-value">${alerts.length}</div>
        <div style="font-size:11px;color:var(--text-muted);">${alerts.filter(a=>a.status==='pending').length}条待处理</div>
      </div>
    </div>`;

    // 设备一生时间线
    html+=`<div style="background:white;border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:16px;">
      <div style="font-weight:700;font-size:15px;margin-bottom:16px;">📋 维修时间线</div>`;

    if(orders.length===0&&notifs.length===0){
      html+=`<div style="text-align:center;padding:40px;color:var(--text-muted);">该设备暂无维修记录</div>`;
    } else {
      html+=`<div style="position:relative;padding-left:30px;">`;
      html+=`<div style="position:absolute;left:12px;top:0;bottom:0;width:2px;background:var(--border);"></div>`;

      // 合并排序时间线
      const timeline=[];
      orders.forEach(w=>{
        timeline.push({type:'order',time:w.createdAt||w.GSTRP,data:w,icon:'🔧'});
      });
      notifs.forEach(n=>{
        timeline.push({type:'notif',time:n.createdAt||n.QMDAT,data:n,icon:'📢'});
      });
      alerts.forEach(a=>{
        timeline.push({type:'alert',time:a.createdAt,data:a,icon:'⚠️'});
      });
      timeline.sort((a,b)=>b.time.localeCompare(a.time));

      timeline.forEach(item=>{
        let color, bg, title, desc;
        if(item.type==='order'){
          if(item.data.STAT==='CLSD'){color='var(--text-muted)';bg='#f8fafc';}
          else if(item.data.STAT==='COMP'){color='var(--success)';bg='#f0fdf4';}
          else if(item.data.STAT==='EXEC'){color='#7c3aed';bg='#f5f3ff';}
          else{color='var(--warning)';bg='#fffbeb';}
          title=`工单 ${esc(item.data.AUFNR)}`;
          desc=item.data.KURZTEXT;
        } else if(item.type==='notif'){
          if(item.data.STAT==='ORDP'){color='var(--primary-lighter)';bg='#eff6ff';}
          else if(item.data.STAT==='NOCO'){color='var(--text-muted)';bg='#f8fafc';}
          else{color='var(--warning)';bg='#fffbeb';}
          title=`通知单 ${esc(item.data.QMNUM)}`;
          desc=item.data.FENAM;
        } else {
          color='var(--danger)';bg='#fef2f2';
          title=`测量点报警`;
          desc=item.data.description;
        }
        html+=`
          <div style="position:relative;margin-bottom:16px;padding:14px 16px;border:1px solid var(--border);border-radius:8px;background:${bg};border-left:3px solid ${color};">
            <div style="position:absolute;left:-24px;top:14px;width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 0 2px ${color};"></div>
            <div style="font-weight:600;font-size:13px;margin-bottom:4px;">${item.icon} ${title}</div>
            <div style="font-size:12px;color:var(--text-secondary);line-height:1.5;">${esc(desc)}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">${esc(item.time)}</div>
          </div>`;
      });
      html+=`</div>`;
    }
    html+=`</div>`;

    // 物料消耗汇总
    const orderIds=orders.map(w=>w.id);
    const allMats=materialComponentV2Data.filter(m=>orderIds.includes(m.orderId));
    if(allMats.length>0){
      html+=`<div style="background:white;border:1px solid var(--border);border-radius:10px;padding:20px;">
        <div style="font-weight:700;font-size:15px;margin-bottom:16px;">📦 历史物料消耗汇总</div>
        <table class="data-table" style="font-size:13px;">
          <thead><tr><th>物料编码</th><th>名称</th><th>需求数量</th><th>单位</th><th>实际领用</th><th>关联工单</th></tr></thead><tbody>`;
      allMats.forEach(m=>{
        const wo=orders.find(w=>w.id===m.orderId);
        html+=`<tr>
          <td>${esc(m.MATNR)}</td><td>${esc(m.MATKTX)}</td><td>${esc(m.BDMNG)}</td>
          <td>${esc(m.MEINS)}</td><td>${esc(m.ENMNG||'-')}</td>
          <td><span style="color:var(--primary-lighter);">${wo?esc(wo.AUFNR):'-'}</span></td>
        </tr>`;
      });
      html+=`</tbody></table></div>`;
    }

    container.innerHTML=html;
  }
};

// ===== 任务清单（标准作业模板）模块 =====
// 对齐SAP PM任务清单主数据管理
const MaintenanceTasklist = {
  page: 1, pageSize: 10, filtered: [],
  _editingId: null,       // 编辑中的任务清单ID（新建为null）
  _editingIsRevise: false, // 是否为修订模式
  _activeTab: 'header',    // 编辑弹窗当前页签
  _editData: null,         // 编辑态临时数据

  _isAdmin() {
    return (window.currentUserRole || 'admin') === 'admin';
  },

  /* ========== Render ========== */
  render() {
    const createBtn = this._isAdmin()
      ? '<button class="btn btn-blue" onclick="MaintenanceTasklist.createModal()">+ 新建任务清单</button>'
      : '';
    return `
    <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div><div style="font-size:18px;font-weight:700;">任务清单</div><div style="font-size:13px;opacity:0.8;">设备主数据 → 任务清单 | 标准作业模板（Task List）</div></div>
        <div style="display:flex;gap:8px;">${createBtn}</div>
      </div>
      <div class="filter-bar" style="flex-shrink:0;">
        <div class="filter-group"><label>任务清单编码</label><input type="text" id="tlPLNNR" placeholder="模糊查询"></div>
        <div class="filter-group"><label>描述</label><input type="text" id="tlPLTXT" placeholder="模糊查询"></div>
        <div class="filter-group"><label>类型</label><select id="tlPLNTY">
          <option value="">全部</option><option value="E">E-设备任务清单</option><option value="T">T-功能位置任务清单</option><option value="G">G-通用任务清单</option>
        </select></div>
        <div class="filter-group"><label>用途</label><select id="tlPLNAW">
          <option value="">全部</option><option value="M01">M01-维修</option><option value="M02">M02-检查</option><option value="M03">M03-润滑</option>
        </select></div>
        <div class="filter-group"><label>工作中心</label><input type="text" id="tlARBPL" placeholder="模糊查询"></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="MaintenanceTasklist.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="MaintenanceTasklist.reset()">重置</button>
        </div>
      </div>
      <div class="table-wrapper" style="flex:1;">
        <table class="data-table">
          <thead><tr>
            <th>任务清单编码</th><th>组计数器</th><th>描述</th><th>类型</th><th>用途</th><th>工作中心</th><th>状态</th><th>创建人/日期</th><th>操作</th>
          </tr></thead>
          <tbody id="tlTableBody"></tbody>
        </table>
      </div>
      <div class="list-toolbar" style="flex-shrink:0;">
        <div class="list-info"><span class="list-count" id="tlCount">共 0 条</span></div>
        <div class="pagination">
          <button class="pagination-btn" id="tlPrev" disabled onclick="MaintenanceTasklist.prevPage()">‹</button>
          <span class="pagination-info" id="tlPageInfo">第 1 / 1 页</span>
          <button class="pagination-btn" id="tlNext" onclick="MaintenanceTasklist.nextPage()">›</button>
          <select class="page-size-select" id="tlPageSize" onchange="MaintenanceTasklist.changePageSize()"><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option></select>
        </div>
      </div>
    </div>`;
  },

  /* ========== Init ========== */
  init() { this.filtered = [...taskListMockData]; this.page = 1; this.renderTable(); },

  /* ========== Render Table ========== */
  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;

    document.getElementById('tlCount').textContent = `共 ${this.filtered.length} 条`;
    document.getElementById('tlPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('tlPrev').disabled = this.page <= 1;
    document.getElementById('tlNext').disabled = this.page >= totalPages;
    document.getElementById('tlPageSize').value = this.pageSize;

    const typeText = { E: '设备任务清单', T: '功能位置任务清单', G: '通用任务清单' };
    const usageText = { M01: '维修', M02: '检查', M03: '润滑' };
    const statusCls = s => s === '已发布' ? 'badge-green' : 'badge-gray';

    document.getElementById('tlTableBody').innerHTML = page.map(tl => `
      <tr>
        <td><strong style="color:var(--primary-lighter);cursor:pointer;" onclick="MaintenanceTasklist.viewDetail('${tl.id}')">${esc(tl.PLNNR)}</strong></td>
        <td><span style="font-family:monospace;font-size:12px;">${esc(tl.PLNAL)}</span></td>
        <td>${esc(tl.PLTXT)}</td>
        <td><span style="font-size:12px;">${typeText[tl.PLNTY] || tl.PLNTY}</span></td>
        <td><span style="font-size:12px;">${usageText[tl.PLNAW] || tl.PLNAW}</span></td>
        <td>${esc(tl.ARBPL)}</td>
        <td><span class="badge ${statusCls(tl.PLNST)}">${esc(tl.PLNST)}</span></td>
        <td style="font-size:12px;">${esc(tl.ERNAM)} / ${esc(tl.ERDAT)}</td>
        <td class="table-actions">
          <button class="btn btn-blue btn-sm" onclick="MaintenanceTasklist.viewDetail('${tl.id}')">查看</button>
        </td>
      </tr>`).join('');
  },

  /* ========== Search / Filter ========== */
  search() {
    const plnnr = document.getElementById('tlPLNNR').value.trim();
    const pltxt = document.getElementById('tlPLTXT').value.trim();
    const plnty = document.getElementById('tlPLNTY').value;
    const plnaw = document.getElementById('tlPLNAW').value;
    const arbpl = document.getElementById('tlARBPL').value.trim();

    this.filtered = taskListMockData.filter(tl => {
      if (plnnr && !tl.PLNNR.includes(plnnr)) return false;
      if (pltxt && !tl.PLTXT.includes(pltxt)) return false;
      if (plnty && tl.PLNTY !== plnty) return false;
      if (plnaw && tl.PLNAW !== plnaw) return false;
      if (arbpl && !tl.ARBPL.includes(arbpl)) return false;
      return true;
    });
    this.page = 1; this.renderTable();
  },

  reset() {
    document.getElementById('tlPLNNR').value = '';
    document.getElementById('tlPLTXT').value = '';
    document.getElementById('tlPLNTY').value = '';
    document.getElementById('tlPLNAW').value = '';
    document.getElementById('tlARBPL').value = '';
    this.filtered = [...taskListMockData]; this.page = 1; this.renderTable();
  },

  prevPage(){ if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage(){ if (this.page < Math.ceil(this.filtered.length / this.pageSize)) { this.page++; this.renderTable(); } },
  changePageSize(){ this.pageSize = parseInt(document.getElementById('tlPageSize').value); this.page = 1; this.renderTable(); },

  /* ========== View Detail (Tabbed - same style as Edit) ========== */
  viewDetail(id) {
    const tl = taskListMockData.find(x => x.id === id);
    if (!tl) return;
    this._viewData = tl;
    this._viewActiveTab = 'header';
    this._showViewModal();
  },

  _showViewModal() {
    const d = this._viewData;
    const title = `任务清单 ${esc(d.PLNNR)}`;
    this._viewActiveTab = 'header';

    const bodyHtml = `
      <div style="display:flex;border-bottom:2px solid var(--border);margin-bottom:20px;gap:0;" id="tlViewTabs">
        <div class="tab ${this._viewActiveTab==='header'?'active':''}" onclick="MaintenanceTasklist._switchViewTab('header')" style="margin-bottom:-2px;">📋 抬头数据</div>
        <div class="tab ${this._viewActiveTab==='operations'?'active':''}" onclick="MaintenanceTasklist._switchViewTab('operations')" style="margin-bottom:-2px;">🔧 工序列表</div>
        <div class="tab ${this._viewActiveTab==='components'?'active':''}" onclick="MaintenanceTasklist._switchViewTab('components')" style="margin-bottom:-2px;">📦 物料组件</div>
        <div class="tab ${this._viewActiveTab==='tools'?'active':''}" onclick="MaintenanceTasklist._switchViewTab('tools')" style="margin-bottom:-2px;">🛠 工具/工装</div>
      </div>
      <div id="tlViewTabContent">
        ${this._renderViewHeaderTab(d)}
      </div>
    `;

    const isAdmin = this._isAdmin();
    const footerBtns = [
      { text: '关闭', cls: 'btn-secondary', action: closeModal }
    ];
    if (isAdmin && d.PLNST === '已发布') {
      footerBtns.push({ text: '编辑', cls: 'btn-primary', action: `()=>{ closeModal(); MaintenanceTasklist.startEdit('${d.id}'); }` });
    }

    showModal(title, bodyHtml, footerBtns, 'modal-xl');
  },

  _switchViewTab(tab) {
    this._viewActiveTab = tab;
    const d = this._viewData;

    const tabEl = document.getElementById('tlViewTabs');
    if (tabEl) {
      tabEl.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      const targetTab = tabEl.querySelector(`.tab[onclick*="${tab}"]`);
      if (targetTab) targetTab.classList.add('active');
    }

    const contentEl = document.getElementById('tlViewTabContent');
    if (contentEl) {
      contentEl.innerHTML = tab === 'header' ? this._renderViewHeaderTab(d)
        : tab === 'operations' ? this._renderViewOperationsTab(d)
        : tab === 'components' ? this._renderViewComponentsTab(d)
        : this._renderViewToolsTab(d);
    }
  },

  _renderViewHeaderTab(d) {
    const typeText = { E: '设备任务清单', T: '功能位置任务清单', G: '通用任务清单' };
    const usageText = { M01: '维修', M02: '检查', M03: '润滑' };

    return `
      <div class="form-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border);">
          <div>
            <div style="font-size:17px;font-weight:700;">${esc(d.PLTXT)}</div>
            <div style="font-size:13px;color:var(--text-secondary);margin-top:3px;">编码：${esc(d.PLNNR)} · 版本：${esc(d.PLNAL)} · ${typeText[d.PLNTY]||d.PLNTY}</div>
            <div style="font-size:13px;margin-top:2px;">删除标记：<span style="${d.DEL_FLAG ? 'color:#dc2626;font-weight:600;' : 'color:var(--text-secondary);'}">${d.DEL_FLAG ? '✓ 已标记' : '未标记'}</span></div>
          </div>
          <span class="badge ${d.PLNST==='已发布'?'badge-green':'badge-gray'}">${esc(d.PLNST)}</span>
        </div>
        <div class="detail-grid">
          <div class="detail-item"><dt>任务清单编码</dt><dd>${esc(d.PLNNR)}</dd></div>
          <div class="detail-item"><dt>组计数器（版本）</dt><dd>${esc(d.PLNAL)}</dd></div>
          <div class="detail-item"><dt>类型</dt><dd>${typeText[d.PLNTY]||d.PLNTY}</dd></div>
          <div class="detail-item"><dt>用途</dt><dd>${usageText[d.PLNAW]||d.PLNAW}</dd></div>
          <div class="detail-item"><dt>工作中心</dt><dd>${esc(d.ARBPL)}</dd></div>
          <div class="detail-item"><dt>创建人 / 日期</dt><dd>${esc(d.ERNAM)} / ${esc(d.ERDAT)}</dd></div>
          ${d.associatedObj ? `<div class="detail-item"><dt>关联对象</dt><dd>${esc(d.associatedObj)}</dd></div>` : ''}
        </div>
        ${d.longText ? `
          <div class="detail-grid" style="margin-top:14px;">
            <div class="detail-item" style="grid-column:1/-1;"><dt>长文本（作业指导说明）</dt><dd style="white-space:pre-wrap;line-height:1.7;">${esc(d.longText)}</dd></div>
          </div>` : ''}
      </div>`;
  },

  _renderViewOperationsTab(d) {
    const ops = d.operations || [];
    if (ops.length === 0) {
      return `<div class="form-section"><div style="text-align:center;padding:40px;color:var(--text-muted);"><div style="font-size:32px;margin-bottom:8px;">🔧</div><div style="font-size:13px;">暂无工序</div></div></div>`;
    }
    const steusText = { '人工工时': '人工工时', '机器工时': '机器工时', '准备工时': '准备工时' };
    const rows = ops.map((op, i) => `
      <tr>
        <td><span style="font-family:monospace;font-size:12px;">${esc(op.VORNR)}</span></td>
        <td>${esc(op.ARBPL)}</td>
        <td>${esc(op.LTXA1)}</td>
        <td><span style="font-size:12px;">${esc(op.STEUS)}</span></td>
        <td>${op.ARBEIT} h</td>
        <td style="font-size:12px;color:var(--text-secondary);">物料 ${(op.components||[]).length} 项 / 工具 ${(op.tools||[]).length} 项</td>
      </tr>`).join('');

    return `
      <div class="form-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-size:14px;font-weight:600;color:var(--text);">工序列表（${ops.length} 道）</span>
        </div>
        <div class="table-wrapper"><table class="data-table">
          <thead><tr><th>工序号</th><th>工作中心</th><th>工序描述</th><th>工时类型</th><th>计划工时</th><th>子资源</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
        ${ops.some(op => (op.components&&op.components.length) || (op.tools&&op.tools.length)) ? `
          <div style="margin-top:16px;">
            <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:8px;">工序子资源明细</div>
            ${ops.map((op, i) => {
              let parts = '';
              if (op.components && op.components.length) {
                parts += `<div style="margin-bottom:6px;"><span style="font-size:12px;color:var(--text-secondary);">工序${op.VORNR}物料：</span>${op.components.map(c => `<span class="badge badge-sm" style="background:#dbeafe;color:#1e40af;margin:2px;font-size:11px;">${esc(c.MATNR)} ×${c.BDMNG}${esc(c.MEINS)}</span>`).join('')}</div>`;
              }
              if (op.tools && op.tools.length) {
                parts += `<div style="margin-bottom:6px;"><span style="font-size:12px;color:var(--text-secondary);">工序${op.VORNR}工具：</span>${op.tools.map(t => `<span class="badge badge-sm" style="background:#fef3c7;color:#92400e;margin:2px;font-size:11px;">${esc(t.WRKTX||t.WRKCT||'工具')} ×${t.MGEIN||1}</span>`).join('')}</div>`;
              }
              return parts;
            }).filter(Boolean).join('')}
          </div>` : ''}
      </div>`;
  },

  _renderViewComponentsTab(d) {
    const comps = d.components || [];
    if (comps.length === 0) {
      return `<div class="form-section"><div style="text-align:center;padding:40px;color:var(--text-muted);"><div style="font-size:32px;margin-bottom:8px;">📦</div><div style="font-size:13px;">暂无计划备件</div></div></div>`;
    }
    const rows = comps.map(c => `
      <tr>
        <td>${esc(c.MATNR)}</td>
        <td>${esc(c.MAKTX)}</td>
        <td>${c.BDMNG}</td>
        <td>${esc(c.MEINS)}</td>
        <td><span style="font-size:12px;">${c.PTYPE==='stock'?'库存':'非库存'}</span></td>
      </tr>`).join('');

    return `
      <div class="form-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-size:14px;font-weight:600;color:var(--text);">计划备件（物料组件）</span>
          <span style="font-size:12px;color:var(--text-secondary);">共 ${comps.length} 项</span>
        </div>
        <div class="table-wrapper"><table class="data-table">
          <thead><tr><th>物料编码</th><th>物料描述</th><th>需求数量</th><th>单位</th><th>条目类别</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
      </div>`;
  },

  _renderViewToolsTab(d) {
    const tools = d.tools || [];
    if (tools.length === 0) {
      return `<div class="form-section"><div style="text-align:center;padding:40px;color:var(--text-muted);"><div style="font-size:32px;margin-bottom:8px;">🛠</div><div style="font-size:13px;">暂无工具配置</div></div></div>`;
    }
    const rows = tools.map(t => `
      <tr>
        <td>${esc(t.WRKCT||'-')}</td>
        <td>${esc(t.WRKTX||'-')}</td>
        <td>${t.MGEIN||'-'}</td>
      </tr>`).join('');

    return `
      <div class="form-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-size:14px;font-weight:600;color:var(--text);">工具/工装</span>
          <span style="font-size:12px;color:var(--text-secondary);">共 ${tools.length} 项</span>
        </div>
        <div class="table-wrapper"><table class="data-table">
          <thead><tr><th>工具编号</th><th>工具描述</th><th>数量</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
      </div>`;
  },

  /* ========== Create Modal ========== */
  createModal() {
    if (!this._isAdmin()) { toast('无操作权限，仅设备部主管可创建'); return; }
    this._editingId = null;
    this._editingIsRevise = false;
    this._initBlankEditData();
    this._showEditModal('新建任务清单');
  },

  /* ===== Start Edit (from view detail) ===== */
  startEdit(id) {
    const tl = taskListMockData.find(x => x.id === id);
    if (!tl) return;
    this._editingId = id;
    this._editingIsRevise = true;
    this._editData = JSON.parse(JSON.stringify(tl));
    this._showEditModal('编辑任务清单');
  },

  /* ===== Edit Data Management ===== */
  _initBlankEditData() {
    this._editData = {
      PLNNR: '', PLNAL: '', PLNTY: '', PLNAW: 'M01',
      PLTXT: '', longText: '', ARBPL: '', associatedObj: '',
      PLNST: '', DEL_FLAG: false, ERNAM: '当前用户', ERDAT: new Date().toISOString().slice(0, 10),
      operations: [],
      components: [],
      tools: []
    };
  },

  /* ========== Edit Modal UI ========== */
  _showEditModal(title) {
    const d = this._editData;
    this._activeTab = 'header';

    const typeOpts = [
      { v: '', l: '请选择' }, { v: 'E', l: 'E-设备任务清单' }, { v: 'T', l: 'T-功能位置任务清单' }, { v: 'G', l: 'G-通用任务清单' }
    ];
    const usageOpts = [
      { v: 'M01', l: 'M01-维修' }, { v: 'M02', l: 'M02-检查' }, { v: 'M03', l: 'M03-润滑' }
    ];
    const steusOpts = ['人工工时', '机器工时', '准备工时'];

    const makeSel = (value, opts) => opts.map(o =>
      `<option value="${esc(o.v||o)}" ${(o.v||o) === value ? 'selected' : ''}>${esc(o.l||o)}</option>`
    ).join('');

    const isReadonly = d.PLNNR && this._editingIsRevise;
    const plnnrDisplay = d.PLNNR ? d.PLNNR : '发布后由 SAP 自动生成';
    const plnalDisplay = d.PLNAL || '发布后由 SAP 返回';

    const bodyHtml = `
      <div style="display:flex;border-bottom:2px solid var(--border);margin-bottom:20px;gap:0;" id="tlEditTabs">
        <div class="tab ${this._activeTab === 'header' ? 'active' : ''}" onclick="MaintenanceTasklist._switchEditTab('header')" style="margin-bottom:-2px;">📋 抬头数据</div>
        <div class="tab ${this._activeTab === 'operations' ? 'active' : ''}" onclick="MaintenanceTasklist._switchEditTab('operations')" style="margin-bottom:-2px;">🔧 工序列表</div>
        <div class="tab ${this._activeTab === 'components' ? 'active' : ''}" onclick="MaintenanceTasklist._switchEditTab('components')" style="margin-bottom:-2px;">📦 物料组件</div>
        <div class="tab ${this._activeTab === 'tools' ? 'active' : ''}" onclick="MaintenanceTasklist._switchEditTab('tools')" style="margin-bottom:-2px;">🛠 工具/工装</div>
      </div>

      <div id="tlEditTabContent">
        ${this._renderHeaderTab(d, plnnrDisplay, plnalDisplay, typeOpts, usageOpts, isReadonly)}
      </div>
    `;

    const footerBtns = isReadonly ? [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '发布新版本', cls: 'btn-primary', action: `()=>{ MaintenanceTasklist._publish(); }` }
    ] : [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '发布', cls: 'btn-primary', action: `()=>{ MaintenanceTasklist._publish(); }` }
    ];

    showModal(title, bodyHtml, footerBtns, d.operations.length > 3 || d.components.length > 2 ? 'modal-xl' : 'modal-lg');
  },

  _switchEditTab(tab) {
    this._activeTab = tab;
    // Read current values from DOM before switching
    this._syncEditDataFromDOM();

    const d = this._editData;
    const isReadonly = d.PLNNR && this._editingIsRevise;
    const typeOpts = [
      { v: '', l: '请选择' }, { v: 'E', l: 'E-设备任务清单' }, { v: 'T', l: 'T-功能位置任务清单' }, { v: 'G', l: 'G-通用任务清单' }
    ];
    const usageOpts = [
      { v: 'M01', l: 'M01-维修' }, { v: 'M02', l: 'M02-检查' }, { v: 'M03', l: 'M03-润滑' }
    ];
    const plnnrDisplay = d.PLNNR ? d.PLNNR : '发布后由 SAP 自动生成';
    const plnalDisplay = d.PLNAL || '发布后由 SAP 返回';

    // Update tabs
    const tabEl = document.getElementById('tlEditTabs');
    if (tabEl) {
      tabEl.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      const targetTab = tabEl.querySelector(`.tab[onclick*="${tab}"]`);
      if (targetTab) targetTab.classList.add('active');
    }

    // Update content
    const contentEl = document.getElementById('tlEditTabContent');
    if (contentEl) {
      contentEl.innerHTML = tab === 'header' ? this._renderHeaderTab(d, plnnrDisplay, plnalDisplay, typeOpts, usageOpts, isReadonly)
        : tab === 'operations' ? this._renderOperationsTab(d)
        : tab === 'components' ? this._renderComponentsTab(d)
        : this._renderToolsTab(d);
    }
  },

  _syncEditDataFromDOM() {
    // Sync header fields
    const getVal = id => { const el = document.getElementById(id); return el ? el.value : ''; };
    this._editData.PLNTY = getVal('tlFldPLNTY') || this._editData.PLNTY;
    this._editData.PLNAW = getVal('tlFldPLNAW') || this._editData.PLNAW;
    this._editData.PLTXT = getVal('tlFldPLTXT') || this._editData.PLTXT;
    this._editData.longText = getVal('tlFldLongText') || this._editData.longText;
    this._editData.ARBPL = getVal('tlFldARBPL') || this._editData.ARBPL;
    this._editData.associatedObj = getVal('tlFldAssocObj') || this._editData.associatedObj;
    this._editData.DEL_FLAG = getVal('tlFldDelFlag') === 'true';
  },

  _renderHeaderTab(d, plnnrDisplay, plnalDisplay, typeOpts, usageOpts, isReadonly) {
    const makeSel = (value, opts) => opts.map(o =>
      `<option value="${esc(o.v||o)}" ${(o.v||o) === value ? 'selected' : ''}>${esc(o.l||o)}</option>`
    ).join('');

    return `
      <div class="form-section">
        <div class="form-grid">
          <div class="form-group">
            <label>任务清单编码</label>
            <input value="${esc(plnnrDisplay)}" readonly disabled style="background:#f9fafb;color:var(--text-secondary);">
          </div>
          <div class="form-group">
            <label>组计数器（版本）</label>
            <input value="${esc(plnalDisplay)}" readonly disabled style="background:#f9fafb;color:var(--text-secondary);">
          </div>
          <div class="form-group">
            <label>类型<span class="req">*</span></label>
            <select id="tlFldPLNTY" ${isReadonly&&d.PLNTY?'disabled':''}>${makeSel(d.PLNTY, typeOpts)}</select>
          </div>
          <div class="form-group">
            <label>用途<span class="req">*</span></label>
            <select id="tlFldPLNAW">${makeSel(d.PLNAW, usageOpts)}</select>
          </div>
          <div class="form-group">
            <label>描述<span class="req">*</span></label>
            <input id="tlFldPLTXT" value="${esc(d.PLTXT)}" placeholder="简要描述作业模板">
          </div>
          <div class="form-group">
            <label>工作中心<span class="req">*</span></label>
            <input id="tlFldARBPL" value="${esc(d.ARBPL)}" placeholder="如 WC-F001-001">
          </div>
          <div class="form-group">
            <label>关联对象</label>
            <input id="tlFldAssocObj" value="${esc(d.associatedObj||'')}" placeholder="${d.PLNTY==='E'?'设备编码（可多选，逗号分隔）':d.PLNTY==='T'?'功能位置编号':'G-通用无需选择'}">
          </div>
          <div class="form-group">
            <label>删除标记</label>
            <select id="tlFldDelFlag">
              <option value="false" ${!d.DEL_FLAG ? 'selected' : ''}>未标记</option>
              <option value="true" ${d.DEL_FLAG ? 'selected' : ''}>已标记</option>
            </select>
          </div>
          <div class="form-group full">
            <label>长文本（作业指导说明）</label>
            <textarea id="tlFldLongText" rows="3" placeholder="详细的作业步骤说明、安全注意事项等">${esc(d.longText||'')}</textarea>
          </div>
        </div>
      </div>`;
  },

  _renderOperationsTab(d) {
    const steusOpts = ['人工工时', '机器工时', '准备工时'];
    const makeSteusSel = (val) => steusOpts.map(s =>
      `<option value="${s}" ${s === val ? 'selected' : ''}>${s}</option>`
    ).join('');

    const opRows = (d.operations || []).map((op, i) => `
      <div style="background:#fafbfc;border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:12px;" id="tlOpRow${i}">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <span style="font-weight:600;font-size:13px;">工序 #${i + 1}：${esc(op.LTXA1 || '新工序')}</span>
          <div style="display:flex;gap:6px;">
            ${i > 0 ? `<button class="btn btn-sm btn-secondary" onclick="MaintenanceTasklist._moveOp(${i},-1)" title="上移">↑</button>` : ''}
            ${i < (d.operations||[]).length - 1 ? `<button class="btn btn-sm btn-secondary" onclick="MaintenanceTasklist._moveOp(${i},1)" title="下移">↓</button>` : ''}
            <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;" onclick="MaintenanceTasklist._removeOp(${i})" title="删除">✕</button>
          </div>
        </div>
        <div class="form-grid" style="gap:10px;">
          <div class="form-group">
            <label>工序号<span class="req">*</span></label>
            <input value="${esc(op.VORNR)}" onchange="MaintenanceTasklist._updateOpField(${i},'VORNR',this.value)" placeholder="如 0010" style="font-size:13px;">
          </div>
          <div class="form-group">
            <label>工作中心<span class="req">*</span></label>
            <input value="${esc(op.ARBPL)}" onchange="MaintenanceTasklist._updateOpField(${i},'ARBPL',this.value)" placeholder="继承抬头工作中心">
          </div>
          <div class="form-group">
            <label>工时类型</label>
            <select onchange="MaintenanceTasklist._updateOpField(${i},'STEUS',this.value)">${makeSteusSel(op.STEUS)}</select>
          </div>
          <div class="form-group">
            <label>计划工时 (h)</label>
            <input type="number" value="${op.ARBEIT}" onchange="MaintenanceTasklist._updateOpField(${i},'ARBEIT',parseFloat(this.value)||0)" step="0.5" min="0">
          </div>
        </div>
        <div class="form-group full" style="margin-top:8px;">
          <label>工序描述<span class="req">*</span></label>
          <input value="${esc(op.LTXA1)}" onchange="MaintenanceTasklist._updateOpField(${i},'LTXA1',this.value)" placeholder="描述该工序的作业内容">
        </div>
        <!-- Inline sub-resources -->
        <div style="margin-top:10px;display:flex;gap:10px;">
          <button class="btn btn-sm btn-blue" onclick="MaintenanceTasklist._addOpComponent(${i})">+ 添加物料</button>
          <button class="btn btn-sm btn-blue" onclick="MaintenanceTasklist._addOpTool(${i})">+ 添加工具</button>
        </div>
        ${(op.components && op.components.length) ? `
          <div style="margin-top:8px;">
            <span style="font-size:12px;font-weight:600;color:var(--text-secondary);">物料：</span>
            ${op.components.map((c, ci) => `<span class="badge badge-sm" style="background:#dbeafe;color:#1e40af;margin:2px;font-size:11px;cursor:pointer;" title="点击删除" onclick="MaintenanceTasklist._removeOpComponent(${i},${ci})">${esc(c.MATNR)} ×${c.BDMNG} ✕</span>`).join('')}
          </div>` : ''}
        ${(op.tools && op.tools.length) ? `
          <div style="margin-top:4px;">
            <span style="font-size:12px;font-weight:600;color:var(--text-secondary);">工具：</span>
            ${op.tools.map((t, ti) => `<span class="badge badge-sm" style="background:#fef3c7;color:#92400e;margin:2px;font-size:11px;cursor:pointer;" title="点击删除" onclick="MaintenanceTasklist._removeOpTool(${i},${ti})">${esc(t.WRKTX||t.WRKCT||'工具')} ✕</span>`).join('')}
          </div>` : ''}
      </div>`).join('');

    return `
      <div class="form-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-size:14px;font-weight:600;color:var(--text);">工序列表（至少 1 道）</span>
          <button class="btn btn-blue btn-sm" onclick="MaintenanceTasklist._addOp()">+ 添加工序</button>
        </div>
        ${opRows || '<div style="text-align:center;padding:40px;color:var(--text-muted);"><div style="font-size:32px;margin-bottom:8px;">🔧</div><div style="font-size:13px;">暂无工序，请点击上方按钮添加</div></div>'}
      </div>`;
  },

  _renderComponentsTab(d) {
    const rows = (d.components || []).map((c, i) => `
      <tr>
        <td><input value="${esc(c.MATNR)}" onchange="MaintenanceTasklist._updateCompField(${i},'MATNR',this.value)" placeholder="物料编码" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input value="${esc(c.MAKTX)}" onchange="MaintenanceTasklist._updateCompField(${i},'MAKTX',this.value)" placeholder="自动带出" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input type="number" value="${c.BDMNG}" onchange="MaintenanceTasklist._updateCompField(${i},'BDMNG',parseFloat(this.value)||0)" step="0.1" min="0" style="width:80px;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input value="${esc(c.MEINS)}" onchange="MaintenanceTasklist._updateCompField(${i},'MEINS',this.value)" placeholder="单位" style="width:70px;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td>
          <select onchange="MaintenanceTasklist._updateCompField(${i},'PTYPE',this.value)" style="padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;">
            <option value="stock" ${c.PTYPE==='stock'?'selected':''}>库存</option>
            <option value="nonstock" ${c.PTYPE==='nonstock'?'selected':''}>非库存</option>
          </select>
        </td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;" onclick="MaintenanceTasklist._removeComp(${i})">✕</button></td>
      </tr>`).join('');

    return `
      <div class="form-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-size:14px;font-weight:600;color:var(--text);">计划备件（物料组件）</span>
          <button class="btn btn-blue btn-sm" onclick="MaintenanceTasklist._addComp()">+ 添加物料</button>
        </div>
        ${rows ? `
          <div class="table-wrapper"><table class="data-table">
            <thead><tr><th>物料编码</th><th>物料描述</th><th style="width:90px;">需求数量</th><th style="width:80px;">单位</th><th>条目类别</th><th style="width:50px;"></th></tr></thead>
            <tbody>${rows}</tbody>
          </table></div>` : '<div style="text-align:center;padding:40px;color:var(--text-muted);"><div style="font-size:32px;margin-bottom:8px;">📦</div><div style="font-size:13px;">暂无计划备件</div></div>'}
      </div>`;
  },

  _renderToolsTab(d) {
    const rows = (d.tools || []).map((t, i) => `
      <tr>
        <td><input value="${esc(t.WRKCT||'')}" onchange="MaintenanceTasklist._updateToolField(${i},'WRKCT',this.value)" placeholder="如 PRT-001" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input value="${esc(t.WRKTX||'')}" onchange="MaintenanceTasklist._updateToolField(${i},'WRKTX',this.value)" placeholder="自由文本描述" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><input type="number" value="${t.MGEIN||''}" onchange="MaintenanceTasklist._updateToolField(${i},'MGEIN',parseInt(this.value)||0)" min="0" style="width:80px;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>
        <td><button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:none;" onclick="MaintenanceTasklist._removeTool(${i})">✕</button></td>
      </tr>`).join('');

    return `
      <div class="form-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-size:14px;font-weight:600;color:var(--text);">工具/工装</span>
          <button class="btn btn-blue btn-sm" onclick="MaintenanceTasklist._addTool()">+ 添加工具</button>
        </div>
        ${rows ? `
          <div class="table-wrapper"><table class="data-table">
            <thead><tr><th>工具编号</th><th>工具描述</th><th style="width:90px;">数量</th><th style="width:50px;"></th></tr></thead>
            <tbody>${rows}</tbody>
          </table></div>` : '<div style="text-align:center;padding:40px;color:var(--text-muted);"><div style="font-size:32px;margin-bottom:8px;">🛠</div><div style="font-size:13px;">暂无工具配置</div></div>'}
      </div>`;
  },

  /* ========== Operation CRUD ========== */
  _addOp() {
    const ops = this._editData.operations || [];
    const nextNo = String((ops.length + 1) * 10).padStart(4, '0');
    ops.push({
      VORNR: nextNo, ARBPL: this._editData.ARBPL || '',
      LTXA1: '', STEUS: '人工工时', ARBEIT: 1,
      components: [], tools: []
    });
    this._editData.operations = ops;
    this._refreshEditTab();
  },

  _removeOp(idx) {
    this._editData.operations.splice(idx, 1);
    // Re-number operations
    this._editData.operations.forEach((op, i) => {
      op.VORNR = String((i + 1) * 10).padStart(4, '0');
    });
    this._refreshEditTab();
  },

  _moveOp(idx, dir) {
    const ops = this._editData.operations;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= ops.length) return;
    [ops[idx], ops[newIdx]] = [ops[newIdx], ops[idx]];
    ops.forEach((op, i) => { op.VORNR = String((i + 1) * 10).padStart(4, '0'); });
    this._editData.operations = ops;
    this._refreshEditTab();
  },

  _updateOpField(idx, field, value) {
    if (this._editData.operations && this._editData.operations[idx]) {
      this._editData.operations[idx][field] = value;
    }
  },

  /* ========== Operation Sub-Resources ========== */
  _addOpComponent(opIdx) {
    const op = this._editData.operations[opIdx];
    if (!op.components) op.components = [];
    const matCode = prompt('物料编码：', 'MAT-');
    if (!matCode) return;
    op.components.push({ MATNR: matCode, MAKTX: '', BDMNG: 1, MEINS: 'PC' });
    this._editData.operations[opIdx] = op;
    this._refreshEditTab();
  },

  _removeOpComponent(opIdx, compIdx) {
    if (confirm('确定删除该物料组件？')) {
      this._editData.operations[opIdx].components.splice(compIdx, 1);
      this._refreshEditTab();
    }
  },

  _addOpTool(opIdx) {
    const op = this._editData.operations[opIdx];
    if (!op.tools) op.tools = [];
    const toolName = prompt('工具描述：', '');
    if (!toolName) return;
    op.tools.push({ WRKCT: '', WRKTX: toolName, MGEIN: 1 });
    this._editData.operations[opIdx] = op;
    this._refreshEditTab();
  },

  _removeOpTool(opIdx, toolIdx) {
    if (confirm('确定删除该工具？')) {
      this._editData.operations[opIdx].tools.splice(toolIdx, 1);
      this._refreshEditTab();
    }
  },

  /* ========== Component CRUD (Header-level) ========== */
  _addComp() {
    if (!this._editData.components) this._editData.components = [];
    const matCode = prompt('物料编码：', 'MAT-');
    if (!matCode) return;
    this._editData.components.push({ MATNR: matCode, MAKTX: '', BDMNG: 1, MEINS: 'PC', PTYPE: 'stock' });
    this._refreshEditTab();
  },

  _removeComp(idx) {
    if (confirm('确定删除该物料组件？')) {
      this._editData.components.splice(idx, 1);
      this._refreshEditTab();
    }
  },

  _updateCompField(idx, field, value) {
    if (this._editData.components && this._editData.components[idx]) {
      this._editData.components[idx][field] = value;
    }
  },

  /* ========== Tool CRUD (Header-level) ========== */
  _addTool() {
    if (!this._editData.tools) this._editData.tools = [];
    const toolName = prompt('工具描述：', '');
    if (!toolName) return;
    this._editData.tools.push({ WRKCT: '', WRKTX: toolName, MGEIN: 1 });
    this._refreshEditTab();
  },

  _removeTool(idx) {
    if (confirm('确定删除该工具？')) {
      this._editData.tools.splice(idx, 1);
      this._refreshEditTab();
    }
  },

  _updateToolField(idx, field, value) {
    if (this._editData.tools && this._editData.tools[idx]) {
      this._editData.tools[idx][field] = value;
    }
  },

  _refreshEditTab() {
    this._syncEditDataFromDOM();
    this._switchEditTab(this._activeTab);
  },

  /* ========== Publish ========== */
  _publish() {
    // Sync full data from DOM first
    this._syncEditDataFromDOM();
    const d = this._editData;

    // Validate
    if (!d.PLNTY) { toast('请选择任务清单类型'); return; }
    if (!d.PLTXT.trim()) { toast('请输入任务清单描述'); return; }
    if (!d.ARBPL.trim()) { toast('请输入工作中心'); return; }
    if (!d.operations || d.operations.length === 0) { toast('至少需要一道工序'); return; }
    // Validate each operation
    for (const op of d.operations) {
      if (!op.LTXA1.trim()) { toast(`工序 ${op.VORNR} 缺少描述`); return; }
      if (!op.ARBPL.trim()) { toast(`工序 ${op.VORNR} 缺少工作中心`); return; }
    }

    closeModal();

    if (this._editingIsRevise) {
      // Edit existing: update in-place
      const oldTl = taskListMockData.find(x => x.id === this._editingId);
      if (oldTl) {
        const delFlag = d.DEL_FLAG || false;
        Object.assign(oldTl, d);
        oldTl.id = this._editingId;
        oldTl.PLNST = delFlag ? '已停用' : '已发布';
        oldTl.LAST_SYNC = new Date().toISOString().slice(0,10);
        toast(`任务清单 ${d.PLNNR} 已更新！${delFlag ? '（已标记删除）' : ''}`);
      }
    } else {
      // New: simulate SAP returning PLNNR and PLNAL
      const newNo = String(taskListMockData.length + 1).padStart(7, '0');
      d.PLNNR = 'TL' + newNo.slice(-4);
      d.PLNAL = '1';
      d.PLNST = '已发布';
      d.ERNAM = '设备部主管';
      d.ERDAT = new Date().toISOString().slice(0, 10);
      d.LAST_SYNC = d.ERDAT;
      d.id = 'TL' + String(taskListMockData.length + 1).padStart(3, '0');
      taskListMockData.push(JSON.parse(JSON.stringify(d)));
      toast(`任务清单 ${d.PLNNR} 已发布！编码由 SAP 生成`);
    }

    this._editingId = null;
    this._editingIsRevise = false;
    this._editData = null;
    this.filtered = [...taskListMockData];
    this.page = 1;
    this.renderTable();
  }
};

// ===== 1.7 故障代码知识库（重构版）=====
// 三层树形结构：目录类型 → 代码组 → 代码 | 左树右表 + 智能推荐 | 只读查阅
const FaultCodeKnowledge = {
  // === State ===
  selectedDir: 'A',        // 选中目录: 'A'(现象), 'B'(原因), 'C'(措施)
  selectedGroupId: null,   // 选中代码组ID
  selectedCode: null,      // 选中代码 { code, desc, ... }
  expandedDirs: {A: true, B: false, C: false},
  expandedGroups: {},      // { groupId: true }
  searchKeyword: '',
  searchResults: null,     // 搜索结果

  // === 数据映射 ===
  _dirMeta: {
    A: { key:'A', label:'故障现象', icon:'👁', clsSuffix:'SymptomGroups', codeClsSuffix:'Symptoms', color:'#3B82F6', bg:'#eff6ff' },
    B: { key:'B', label:'故障原因', icon:'🔍', clsSuffix:'CauseGroups', codeClsSuffix:'Causes', color:'#F59E0B', bg:'#fffbeb' },
    C: { key:'C', label:'解决措施', icon:'🔧', clsSuffix:'RemedyGroups', codeClsSuffix:'Remedies', color:'#10B981', bg:'#ecfdf5' }
  },

  _getGroups(dir) {
    if (dir === 'A') return window.faultCodeSymptomGroups || [];
    if (dir === 'B') return window.faultCodeCauseGroups || [];
    return window.faultCodeRemedyGroups || [];
  },

  _getRecommendations(code) {
    const recs = window.faultCodeRecommendations || {};
    return recs[code] || null;
  },

  // === 入口 ===
  render() {
    this._initState();
    return `<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="background:linear-gradient(135deg,#1E3A5F,#2D5A87);color:white;padding:14px 24px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:18px;font-weight:700;">故障代码知识库</div>
          <div style="font-size:12px;opacity:0.8;">三层代码体系 · 智能推荐 · 只读查阅</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="position:relative;">
            <input id="fckbSearch" placeholder="搜索代码/描述..." value="${esc(this.searchKeyword)}"
              style="padding:7px 14px 7px 32px;border:none;border-radius:20px;font-size:13px;width:220px;outline:none;background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.2);"
              onkeydown="if(event.key==='Enter')FaultCodeKnowledge._doSearch()">
            <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:14px;opacity:0.6;">🔍</span>
          </div>
          <button onclick="FaultCodeKnowledge._doSearch()"
            style="padding:6px 14px;background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3);border-radius:6px;font-size:12px;cursor:pointer;">搜索</button>
        </div>
      </div>
      <div style="flex:1;display:flex;overflow:hidden;">
        ${this._renderLeftPanel()}
        ${this._renderRightPanel()}
      </div>
      <div style="flex-shrink:0;padding:8px 24px;background:#f0f2f5;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;text-align:center;">
        💡 此页面仅供查看，如需新增、修改或停用故障代码，请联系IT管理员（系统配置 → 故障代码体系管理）
      </div>
    </div>`;
  },

  init() {
    this._initState();
    // 恢复滚动位置无效，因为每次render都是新的
  },

  _initState() {
    // 重置状态（初始状态下保留searchKeyword以便回显）
    if (!this._initializedForSession) {
      this.selectedDir = 'A';
      this.selectedGroupId = null;
      this.selectedCode = null;
      this.expandedDirs = {A: true, B: false, C: false};
      this.expandedGroups = {};
      this.searchResults = null;
      this._initializedForSession = true;
    }
  },

  // ======================== 左侧树形导航 ========================
  _renderLeftPanel() {
    // 搜索模式：展示搜索结果树
    if (this.searchResults) {
      return this._renderSearchTree();
    }

    let html = `<div style="width:320px;flex-shrink:0;background:white;border-right:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;">
      <div style="flex:1;overflow-y:auto;padding:6px 0;user-select:none;">`;

    ['A','B','C'].forEach(dir => {
      const meta = this._dirMeta[dir];
      const groups = this._getGroups(dir);
      const isExpanded = this.expandedDirs[dir];
      const isActive = this.selectedDir === dir && !this.selectedGroupId && !this.selectedCode;

      // 目录类型（第一层）
      html += `<div style="padding:2px 8px;">
        <div onclick="FaultCodeKnowledge._toggleDir('${dir}')"
          style="display:flex;align-items:center;padding:10px 12px;cursor:pointer;border-radius:8px;font-weight:700;font-size:14px;transition:all .15s;
          ${isActive?'background:'+meta.bg+';color:'+meta.color+';':''}"
          onmouseenter="if(!${isActive})this.style.background='var(--bg)';" onmouseleave="if(!${isActive})this.style.background=''">
          <span style="width:20px;text-align:center;margin-right:8px;font-size:12px;transition:transform .2s;${isExpanded?'transform:rotate(90deg)':''}">▶</span>
          <span style="margin-right:6px;">${meta.icon}</span>
          <span>${meta.label} (${dir})</span>
          <span style="margin-left:auto;font-size:11px;opacity:0.5;">${groups.length}组</span>
        </div>`;

      // 代码组（第二层）+ 代码（第三层）
      if (isExpanded) {
        html += `<div style="padding-left:14px;">`;
        groups.forEach(g => {
          const groupExpanded = this.expandedGroups[g.groupId] || false;
          const groupActive = this.selectedGroupId === g.groupId && !this.selectedCode;

          html += `<div style="margin:1px 0;">
            <div onclick="FaultCodeKnowledge._selectGroup('${dir}','${g.groupId}')"
              style="display:flex;align-items:center;padding:8px 12px 8px 28px;cursor:pointer;border-radius:6px;font-size:13px;color:var(--text);transition:all .15s;
              ${groupActive?'background:'+meta.bg+';color:'+meta.color+';font-weight:600;':''}"
              onmouseenter="if(!${groupActive})this.style.background='var(--bg)';" onmouseleave="if(!${groupActive})this.style.background=''">
              <span onclick="event.stopPropagation();FaultCodeKnowledge._toggleGroup('${g.groupId}')"
                style="font-size:10px;margin-right:8px;transition:transform .2s;display:inline-block;width:14px;text-align:center;
                ${groupExpanded?'transform:rotate(90deg)':''}">▶</span>
              <span style="margin-right:6px;">📂</span>
              <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(g.groupName)}</span>
              <span style="font-size:11px;opacity:0.5;">${g.codes.length}</span>
            </div>`;

          // 代码列表（第三层）
          if (groupExpanded) {
            html += `<div style="padding-left:14px;">`;
            g.codes.forEach(c => {
              const codeActive = this.selectedCode && this.selectedCode.code === c.code;
              html += `<div onclick="FaultCodeKnowledge._selectCode('${dir}','${g.groupId}')"
                data-code="${esc(c.code)}" data-desc="${esc(c.desc)}"
                style="display:flex;align-items:center;padding:7px 12px 7px 44px;cursor:pointer;border-radius:4px;font-size:12px;color:var(--text-secondary);transition:all .15s;
                ${codeActive?'background:'+meta.bg+';color:'+meta.color+';font-weight:500;':''}"
                onmouseenter="if(!${codeActive})this.style.background='var(--bg)';this.style.color='var(--text)';" onmouseleave="if(!${codeActive})this.style.background='';this.style.color=''">
                <span style="margin-right:6px;">📄</span>
                <span style="font-weight:600;margin-right:8px;white-space:nowrap;">${esc(c.code)}</span>
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(c.desc)}</span>
              </div>`;
            });
            html += `</div>`;
          }
          html += `</div>`;
        });
        html += `</div>`;
      }
      html += `</div>`;
    });

    html += `</div></div>`;
    return html;
  },

  // 搜索树
  _renderSearchTree() {
    const sr = this.searchResults;
    if (!sr || sr.length === 0) {
      return `<div style="width:320px;flex-shrink:0;background:white;border-right:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;">
        <div style="padding:16px;text-align:center;color:var(--text-muted);font-size:13px;">
          <div style="font-size:36px;margin-bottom:8px;">📭</div>
          <div>未找到匹配的故障代码，请尝试其他关键词。</div>
          <button onclick="FaultCodeKnowledge._clearSearch()" style="margin-top:12px;padding:6px 16px;background:var(--primary-lighter);color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">返回浏览</button>
        </div>
      </div>`;
    }

    let html = `<div style="width:320px;flex-shrink:0;background:white;border-right:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;">
      <div style="padding:10px 12px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:12px;color:var(--text-secondary);">搜索"${esc(this.searchKeyword)}" · ${sr.length}条结果</span>
        <button onclick="FaultCodeKnowledge._clearSearch()" style="font-size:11px;color:var(--primary-lighter);background:none;border:none;cursor:pointer;">✕ 清除</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:4px 8px;">`;

    sr.forEach(item => {
      const meta = this._dirMeta[item.dir];
      html += `<div onclick="FaultCodeKnowledge._selectCodeFromSearch('${item.dir}','${item.groupId}','${esc(item.code)}')"
        style="display:flex;align-items:center;padding:10px 12px;cursor:pointer;border-radius:6px;font-size:12px;margin:2px 0;transition:all .15s;"
        onmouseenter="this.style.background='var(--bg)';" onmouseleave="this.style.background=''">
        <span style="width:24px;height:24px;border-radius:50%;background:${meta.bg};color:${meta.color};display:flex;align-items:center;justify-content:center;font-size:11px;margin-right:10px;flex-shrink:0;">${meta.icon}</span>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:600;color:var(--text);">${esc(item.code)}</div>
          <div style="color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(item.desc)}</div>
        </div>
        <span style="font-size:10px;color:var(--text-muted);margin-left:8px;white-space:nowrap;">${meta.label}</span>
      </div>`;
    });

    html += `</div></div>`;
    return html;
  },

  // ======================== 右侧内容区 ========================
  _renderRightPanel() {
    if (this.searchResults) {
      return `<div style="flex:1;min-width:0;display:flex;align-items:center;justify-content:center;background:#f0f2f5;overflow-y:auto;">
        <div style="text-align:center;color:#6b7280;padding:40px;">
          <div style="font-size:48px;margin-bottom:12px;">📋</div>
          <div style="font-size:15px;font-weight:600;color:#1f2937;">请从左侧选择代码查看详情</div>
          <div style="font-size:12px;margin-top:4px;color:#9ca3af;">搜索匹配到 ${this.searchResults.length} 条结果</div>
        </div>
      </div>`;
    }

    if (this.selectedCode) {
      return this._renderCodeDetail();
    }

    if (this.selectedGroupId) {
      return this._renderGroupDetail();
    }

    // 选中了目录类型但没有选代码组 — 显示概览
    const meta = this._dirMeta[this.selectedDir];
    const groups = this._getGroups(this.selectedDir);
    const totalCodes = groups.reduce((sum, g) => sum + g.codes.length, 0);

    return `<div style="flex:1;min-width:0;padding:24px;background:#f0f2f5;overflow-y:auto;">
      <div style="background:white;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.06);text-align:center;max-width:500px;margin:0 auto;">
        <div style="font-size:64px;margin-bottom:16px;">${meta.icon}</div>
        <div style="font-size:20px;font-weight:700;color:#1f2937;margin-bottom:8px;">${meta.label}</div>
        <div style="display:inline-block;padding:4px 14px;background:#e5e7eb;border-radius:12px;font-size:13px;font-weight:600;color:#6b7280;margin-bottom:16px;">${this.selectedDir}</div>
        <div style="font-size:14px;color:#374151;margin-bottom:8px;">
          共 <strong style="color:#1E3A5F;font-size:20px;">${groups.length}</strong> 个代码组，<strong style="color:#1E3A5F;font-size:20px;">${totalCodes}</strong> 个代码
        </div>
        <div style="font-size:13px;color:#9ca3af;margin-top:12px;padding-top:16px;border-top:1px solid #f3f4f6;">
          💡 请展开左侧代码组并点击具体代码查看详情与智能推荐
        </div>
      </div>
    </div>`;
  },

  // === 代码组详情 ===
  _renderGroupDetail() {
    const meta = this._dirMeta[this.selectedDir];
    const groups = this._getGroups(this.selectedDir);
    const group = groups.find(g => g.groupId === this.selectedGroupId);
    if (!group) return this._renderEmptyRight();

    let html = `<div style="flex:1;min-width:0;overflow-y:auto;padding:24px;background:#f0f2f5;">
      <div style="background:white;border-radius:10px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:16px;">
        <div style="display:flex;align-items:center;margin-bottom:16px;">
          <span style="font-size:24px;margin-right:10px;">📂</span>
          <div>
            <div style="font-size:18px;font-weight:700;">${esc(group.groupName)}</div>
            <div style="font-size:12px;color:#6b7280;">所属目录：${meta.icon} ${meta.label} (${this.selectedDir})</div>
          </div>
        </div>
        <div style="padding:12px 16px;background:${meta.bg};border-radius:8px;margin-bottom:16px;font-size:13px;color:#4b5563;line-height:1.6;">
          ${esc(group.groupDesc)}
        </div>
        <div style="overflow-x:auto;">
          <table class="data-table" style="font-size:13px;">
            <thead><tr>
              <th style="width:100px;">代码</th><th>描述</th><th style="width:160px;">适用设备类型</th><th style="width:80px;text-align:center;">引用次数</th>
            </tr></thead>
            <tbody>`;

    group.codes.forEach(c => {
      const eqTags = (c.equipTypes || []).map(t =>
        `<span style="display:inline-block;padding:1px 8px;background:${meta.bg};color:${meta.color};border-radius:10px;font-size:11px;margin:1px 3px;">${esc(t)}</span>`
      ).join('') || '-';

      const isSelected = this.selectedCode && this.selectedCode.code === c.code;
      html += `<tr style="cursor:pointer;${isSelected?'background:'+meta.bg+';':''}"
        onclick="FaultCodeKnowledge._selectCodeDetail('${this.selectedDir}','${group.groupId}','${esc(c.code)}','${esc(c.desc)}')"
        onmouseenter="if(!${isSelected})this.style.background='#f8fafc';" onmouseleave="if(!${isSelected})this.style.background=''">
        <td><strong>${esc(c.code)}</strong></td>
        <td>${esc(c.desc)}</td>
        <td>${eqTags}</td>
        <td style="text-align:center;"><span class="badge ${c.refCount>=10?'badge-blue':'badge-gray'}">${c.refCount}次</span></td>
      </tr>`;
    });

    html += `</tbody></table></div>
        <div style="margin-top:12px;font-size:12px;color:#9ca3af;">
          适用设备类型：${esc((group.equipTypes||[]).join('、') || '全部')}
        </div>
      </div>
    </div>`;
    return html;
  },

  // === 代码详情（含智能推荐）===
  _renderCodeDetail() {
    const meta = this._dirMeta[this.selectedDir];
    const sc = this.selectedCode;

    // 查找所属代码组
    const groups = this._getGroups(this.selectedDir);
    let parentGroup = null;
    for (const g of groups) {
      if (g.codes.some(c => c.code === sc.code)) { parentGroup = g; break; }
    }

    let html = `<div style="flex:1;min-width:0;overflow-y:auto;padding:24px;background:#f0f2f5;">
      <div style="background:white;border-radius:10px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:20px;">
        <div style="display:flex;align-items:flex-start;margin-bottom:20px;">
          <span style="font-size:28px;margin-right:12px;margin-top:2px;">📄</span>
          <div style="flex:1;">
            <div style="font-size:20px;font-weight:700;margin-bottom:4px;">${esc(sc.code)}</div>
            <div style="font-size:14px;color:#6b7280;">${esc(sc.desc)}</div>
          </div>
        </div>
        <div class="detail-grid" style="margin-bottom:0;">
          <div class="detail-item"><dt>所属目录</dt><dd>${meta.icon} ${meta.label} (${this.selectedDir})</dd></div>
          <div class="detail-item"><dt>所属代码组</dt><dd>📂 ${esc(parentGroup?parentGroup.groupName:'-')}</dd></div>
          <div class="detail-item"><dt>适用设备</dt><dd>${esc((sc.equipTypes||[]).join('、') || '-')}</dd></div>
          <div class="detail-item"><dt>引用次数</dt><dd><span class="badge ${sc.refCount>=10?'badge-blue':'badge-gray'}">${sc.refCount}次</span></dd></div>
        </div>
      </div>`;

    // 智能推荐区块（仅对现象代码）
    if (this.selectedDir === 'A') {
      html += this._renderSmartRecommend(sc.code);
    } else {
      html += `<div style="background:white;border-radius:10px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.06);text-align:center;">
        <div style="font-size:14px;color:#9ca3af;">💡 智能推荐仅对故障现象(A)代码开放，查看原因/措施代码时不展示推荐。</div>
      </div>`;
    }

    html += `</div>`;
    return html;
  },

  // === 智能推荐 ===
  _renderSmartRecommend(symptomCode) {
    const rec = this._getRecommendations(symptomCode);
    if (!rec || rec.totalRecords < 10) {
      const count = rec ? rec.totalRecords : 0;
      return `<div style="background:white;border-radius:10px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
        <div style="font-size:16px;font-weight:700;margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid #e5e7eb;">📊 智能推荐</div>
        <div style="text-align:center;padding:20px;color:#9ca3af;">
          <div style="font-size:32px;margin-bottom:8px;">📊</div>
          <div style="font-size:14px;color:#6b7280;">数据积累不足，暂无法提供推荐。</div>
          <div style="font-size:12px;margin-top:4px;">当前已记录 ${count} 次，需 ≥10 次后自动开启。</div>
        </div>
      </div>`;
    }

    const totalW = rec.totalRecords;
    const maxBar = 160;
    const barColor1 = '#3B82F6';
    const barColor2 = '#10B981';

    const renderRecTable = (items, label, icon, color) => {
      if (!items || !items.length) return '';
      let rows = '';
      items.forEach((r, i) => {
        rows += `<tr style="border-bottom:1px solid #f1f5f9;${i%2===0?'background:#fafbfc':''}">
          <td style="padding:8px 12px;text-align:center;font-weight:700;color:${i===0?color:'#6b7280'};">${i+1}</td>
          <td style="padding:8px 12px;font-weight:600;">${esc(r.code)}</td>
          <td style="padding:8px 12px;">${esc(r.desc)}</td>
          <td style="padding:8px 12px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <div style="flex:1;height:8px;background:#f1f5f9;border-radius:4px;overflow:hidden;">
                <div style="height:100%;width:${r.ratio}%;background:${color};border-radius:4px;transition:width .5s;"></div>
              </div>
              <span style="font-size:11px;font-weight:600;white-space:nowrap;min-width:32px;">${r.ratio}%</span>
            </div>
          </td>
        </tr>`;
      });
      return `<div style="margin-bottom:16px;">
        <div style="font-weight:600;font-size:14px;margin-bottom:10px;">${icon} ${label}</div>
        <div style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead><tr style="background:#f8fafc;">
              <th style="padding:8px 12px;text-align:center;width:50px;">排名</th>
              <th style="padding:8px 12px;width:100px;">代码</th>
              <th style="padding:8px 12px;">描述</th>
              <th style="padding:8px 12px;width:130px;">占比</th>
            </tr></thead>
            <tbody>${rows}</tbody></table></div></div>`;
    };

    return `<div style="background:white;border-radius:10px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid #e5e7eb;">
        <div style="font-size:16px;font-weight:700;">📊 智能推荐</div>
        <div style="font-size:11px;color:#9ca3af;">数据：近12个月 · 共${rec.totalRecords}张工单 · 计算日期：${rec.calcDate}</div>
      </div>
      ${renderRecTable(rec.causes, '该现象最常见的故障原因', '🔍', barColor1)}
      ${renderRecTable(rec.remedies, '该现象最常用的解决措施', '🔧', barColor2)}
      <div style="text-align:right;margin-top:12px;">
        <button onclick="FaultCodeKnowledge._viewRelatedOrders('${symptomCode}')"
          style="padding:8px 16px;background:var(--primary-lighter);color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">📋 查看关联历史工单 →</button>
      </div>
    </div>`;
  },

  _renderEmptyRight() {
    return `<div style="flex:1;display:flex;align-items:center;justify-content:center;background:var(--bg);overflow-y:auto;">
      <div style="text-align:center;color:var(--text-muted);padding:40px;">
        <div style="font-size:48px;margin-bottom:12px;">📂</div>
        <div style="font-size:15px;">请从左侧选择目录类型、代码组或代码</div>
      </div>
    </div>`;
  },

  // ======================== 交互方法 ========================
  _toggleDir(dir) {
    this.expandedDirs[dir] = !this.expandedDirs[dir];
    this.selectedDir = dir;
    // 收起时清除该目录的选中
    if (!this.expandedDirs[dir]) {
      this.selectedGroupId = null;
      this.selectedCode = null;
    }
    this._rerender();
  },

  _toggleGroup(groupId) {
    this.expandedGroups[groupId] = !this.expandedGroups[groupId];
    this._rerender();
  },

  _selectGroup(dir, groupId) {
    this.selectedDir = dir;
    this.expandedDirs[dir] = true;

    if (this.selectedGroupId === groupId && !this.selectedCode) {
      // 再次点击同一代码组，收起
      this.expandedGroups[groupId] = !this.expandedGroups[groupId];
    } else {
      this.selectedGroupId = groupId;
      this.selectedCode = null;
      this.expandedGroups[groupId] = true;
    }
    this._rerender();
  },

  _selectCode(dir, groupId) {
    this.selectedDir = dir;
    this.expandedDirs[dir] = true;
    this.selectedGroupId = groupId;
    this.expandedGroups[groupId] = true;

    // 从DOM获取代码信息
    const el = event && event.currentTarget;
    if (el) {
      const code = el.getAttribute('data-code');
      const desc = el.getAttribute('data-desc');
      if (code) {
        const groups = this._getGroups(dir);
        for (const g of groups) {
          const found = g.codes.find(c => c.code === code);
          if (found) {
            this.selectedCode = found;
            break;
          }
        }
        if (!this.selectedCode) {
          this.selectedCode = { code, desc: desc || '', equipTypes: [], refCount: 0 };
        }
      }
    }
    this._rerender();
  },

  _selectCodeDetail(dir, groupId, code, desc) {
    this.selectedDir = dir;
    this.selectedGroupId = groupId;
    const groups = this._getGroups(dir);
    for (const g of groups) {
      const found = g.codes.find(c => c.code === code);
      if (found) { this.selectedCode = found; break; }
    }
    if (!this.selectedCode) {
      this.selectedCode = { code, desc, equipTypes: [], refCount: 0 };
    }
    this._rerender();
  },

  _selectCodeFromSearch(dir, groupId, code) {
    this.searchResults = null;
    this.searchKeyword = '';
    const groups = this._getGroups(dir);
    this.selectedDir = dir;
    this.expandedDirs[dir] = true;
    this.selectedGroupId = groupId;
    this.expandedGroups[groupId] = true;

    for (const g of groups) {
      const found = g.codes.find(c => c.code === code);
      if (found) { this.selectedCode = found; break; }
    }
    if (!this.selectedCode) {
      this.selectedCode = { code, desc: '', equipTypes: [], refCount: 0 };
    }
    this._rerender();
  },

  _doSearch() {
    const input = document.getElementById('fckbSearch');
    const keyword = (input ? input.value : '').trim();
    if (!keyword) {
      this._clearSearch();
      return;
    }
    this.searchKeyword = keyword;
    const q = keyword.toLowerCase();
    const results = [];

    // 遍历三个目录
    [{dir:'A',groups:this._getGroups('A')},{dir:'B',groups:this._getGroups('B')},{dir:'C',groups:this._getGroups('C')}].forEach(dg => {
      dg.groups.forEach(g => {
        g.codes.forEach(c => {
          if (c.code.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || g.groupName.toLowerCase().includes(q)) {
            results.push({ dir: dg.dir, groupId: g.groupId, groupName: g.groupName, code: c.code, desc: c.desc });
          }
        });
      });
    });

    this.searchResults = results;
    this.selectedCode = null;
    this.selectedGroupId = null;
    this._rerender();
  },

  _clearSearch() {
    this.searchKeyword = '';
    this.searchResults = null;
    this.selectedCode = null;
    this.selectedGroupId = null;
    this._rerender();
  },

  _viewRelatedOrders(symptomCode) {
    // 模拟：找到引用该现象代码的工单故障记录
    const records = (window.workOrderFaultRecords || []).filter(r => r.phenomenonSnap && r.phenomenonSnap.includes(symptomCode));
    if (!records.length) {
      toast('暂无关联工单记录');
      return;
    }
    let body = `<div style="font-size:13px;">引用 <strong>${esc(symptomCode)}</strong> 的历史工单：</div>
      <div style="margin-top:12px;overflow-x:auto;"><table class="data-table" style="font-size:12px;">
        <thead><tr><th>工单号</th><th>故障现象</th><th>故障原因</th><th>解决措施</th><th>补充说明</th></tr></thead>
        <tbody>`;
    records.forEach(r => {
      body += `<tr>
        <td>${esc(r.AUFNR||'-')}</td>
        <td>${esc(r.phenomenonSnap||'-')}</td>
        <td>${esc(r.causeSnap||'-')}</td>
        <td>${esc(r.measureSnap||'-')}</td>
        <td>${esc(r.customText||'-')}</td>
      </tr>`;
    });
    body += `</tbody></table></div>`;
    showModal(`关联工单 · ${esc(symptomCode)}`, body, [{text:'关闭',cls:'btn-secondary',action:closeModal}], 'modal-lg');
  },

  _rerender() {
    const ca = document.getElementById('contentArea');
    if (ca) ca.innerHTML = this.render();
  }
};

// ===== 9. 小程序 — 移动端适配视图 =====
// 模拟小程序屏幕比例（375×667），提供移动端功能入口
const MiniProgram = {
  // === State ===
  currentPage: 'home',      // 'home' | 'fault-code-home' | 'fault-group-list' | 'fault-code-list' | 'fault-code-detail' | 'fault-search'
  pageStack: [],            // 页面栈
  mpDir: 'A',               // 当前查看的目录类型
  mpGroupId: null,
  mpCode: null,
  mpSearchKeyword: '',
  mpSearchResults: null,
  mpShowRecommend: true,    // 是否展开智能推荐

  // === 数据帮助 ===
  _dirMeta: {
    A: { key:'A', label:'故障现象', icon:'👁', color:'#3B82F6', bg:'#eff6ff' },
    B: { key:'B', label:'故障原因', icon:'🔍', color:'#F59E0B', bg:'#fffbeb' },
    C: { key:'C', label:'解决措施', icon:'🔧', color:'#10B981', bg:'#ecfdf5' }
  },
  _getGroups(dir) {
    if (dir === 'A') return window.faultCodeSymptomGroups || [];
    if (dir === 'B') return window.faultCodeCauseGroups || [];
    return window.faultCodeRemedyGroups || [];
  },
  _getRecommendations(code) {
    const recs = window.faultCodeRecommendations || {};
    return recs[code] || null;
  },

  // === 入口渲染 ===
  render() {
    return `<div style="display:flex;align-items:center;justify-content:center;height:calc(100vh - 56px);background:linear-gradient(135deg,#0f1b2d,#1E3A5F);padding:20px;">
      <!-- 手机外壳 -->
      <div style="width:390px;height:720px;background:#1a1a2e;border-radius:36px;padding:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5), 0 0 0 2px #333, 0 0 0 4px #1a1a2e;position:relative;">
        <!-- 手机顶部刘海 -->
        <div style="position:absolute;top:12px;left:50%;transform:translateX(-50%);width:120px;height:25px;background:#0a0a15;border-radius:0 0 16px 16px;z-index:10;"></div>
        <!-- 手机屏幕 -->
        <div style="width:100%;height:100%;background:#f5f5f5;border-radius:26px;overflow:hidden;display:flex;flex-direction:column;position:relative;">
          <!-- 状态栏 -->
          <div style="background:white;padding:6px 20px;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#333;flex-shrink:0;border-bottom:1px solid #eee;">
            <span>9:41</span>
            <span style="display:flex;gap:4px;">📶 📡 🔋</span>
          </div>
          <!-- 应用内容区 -->
          <div style="flex:1;overflow-y:auto;background:white;" id="mpContentArea">
            ${this._renderPage()}
          </div>
          <!-- 底部导航 -->
          ${this._renderTabBar()}
        </div>
      </div>
    </div>`;
  },

  init() {
    if (this.currentPage === 'home') {
      this.pageStack = [];
    }
  },

  // === 底部导航栏 ===
  _renderTabBar() {
    if (this.currentPage === 'home') {
      return `<div style="background:white;border-top:1px solid #e5e7eb;display:flex;padding:4px 0 6px;flex-shrink:0;">
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;padding:4px 0;color:var(--primary);font-size:11px;cursor:pointer;">
          <span style="font-size:18px;">🏠</span><span>首页</span>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;padding:4px 0;color:#999;font-size:11px;">
          <span style="font-size:18px;">📋</span><span>工单</span>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;padding:4px 0;color:#999;font-size:11px;">
          <span style="font-size:18px;">📦</span><span>备件</span>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;padding:4px 0;color:#999;font-size:11px;">
          <span style="font-size:18px;">👤</span><span>我的</span>
        </div>
      </div>`;
    }
    return '';
  },

  // === 导航栏（子页面）===
  _renderNav(title, showBack) {
    const backBtn = showBack ? `<span onclick="MiniProgram._goBack()" style="cursor:pointer;font-size:14px;">← 返回</span>` : '';
    return `<div style="background:white;padding:8px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #eee;flex-shrink:0;">
      <div style="font-size:13px;color:var(--primary);min-width:60px;">${backBtn}</div>
      <div style="font-size:15px;font-weight:700;text-align:center;flex:1;">${esc(title)}</div>
      <div style="min-width:60px;"></div>
    </div>`;
  },

  // === 页面路由 ===
  _renderPage() {
    switch (this.currentPage) {
      case 'home': return this._renderHome();
      case 'fault-code-home': return this._renderFaultCodeHome();
      case 'fault-group-list': return this._renderFaultGroupList();
      case 'fault-code-list': return this._renderFaultCodeList();
      case 'fault-code-detail': return this._renderFaultCodeDetail();
      case 'fault-search': return this._renderFaultSearch();
      default: return this._renderHome();
    }
  },

  _navigateTo(page) {
    this.pageStack.push(this.currentPage);
    this.currentPage = page;
    this._refreshContent();
  },

  _goBack() {
    if (this.pageStack.length > 0) {
      this.currentPage = this.pageStack.pop();
      this._refreshContent();
    }
  },

  _refreshContent() {
    const mp = document.getElementById('mpContentArea');
    if (mp) mp.innerHTML = this._renderPage();
  },

  // ======================== 首页 ========================
  _renderHome() {
    return `<div style="padding:0;">
      <!-- 搜索栏 -->
      <div style="padding:12px 16px;background:white;">
        <div onclick="MiniProgram._navigateTo('fault-code-home')"
          style="background:#f5f5f5;border-radius:20px;padding:10px 16px;display:flex;align-items:center;gap:8px;font-size:13px;color:#999;cursor:pointer;">
          <span>🔍</span><span>搜索故障代码...</span>
        </div>
      </div>
      <!-- Banner -->
      <div style="margin:0 12px 12px;background:linear-gradient(135deg,#1E3A5F,#3B82F6);border-radius:12px;padding:20px;color:white;">
        <div style="font-size:16px;font-weight:700;margin-bottom:4px;">MES系统</div>
        <div style="font-size:12px;opacity:0.8;">小程序版本 · 移动端快速查阅</div>
      </div>
      <!-- 功能入口 -->
      <div style="padding:0 12px;">
        <div style="font-size:14px;font-weight:700;margin-bottom:10px;color:#333;">常用功能</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div onclick="MiniProgram._navigateTo('fault-code-home')"
            style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:16px 14px;cursor:pointer;transition:all .15s;"
            onmouseenter="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)';this.style.borderColor='#3B82F6';">
            <div style="font-size:24px;margin-bottom:6px;">📖</div>
            <div style="font-size:14px;font-weight:600;color:#333;">故障代码知识库</div>
            <div style="font-size:11px;color:#999;margin-top:2px;">三层代码体系 · 智能推荐</div>
          </div>
          <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:16px 14px;cursor:pointer;opacity:0.5;"
            onmouseenter="this.style.opacity='0.7';">
            <div style="font-size:24px;margin-bottom:6px;">📋</div>
            <div style="font-size:14px;font-weight:600;color:#333;">维修工单</div>
            <div style="font-size:11px;color:#999;margin-top:2px;">开发中</div>
          </div>
          <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:16px 14px;cursor:pointer;opacity:0.5;">
            <div style="font-size:24px;margin-bottom:6px;">🔔</div>
            <div style="font-size:14px;font-weight:600;color:#333;">通知提醒</div>
            <div style="font-size:11px;color:#999;margin-top:2px;">开发中</div>
          </div>
          <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:16px 14px;cursor:pointer;opacity:0.5;">
            <div style="font-size:24px;margin-bottom:6px;">📊</div>
            <div style="font-size:14px;font-weight:600;color:#333;">设备状态</div>
            <div style="font-size:11px;color:#999;margin-top:2px;">开发中</div>
          </div>
        </div>
      </div>
      <!-- 底部提示 -->
      <div style="padding:20px 16px;text-align:center;font-size:11px;color:#ccc;">
        💡 仅供查看，维护请联系IT管理员
      </div>
    </div>`;
  },

  // ======================== 故障代码知识库首页 ========================
  _renderFaultCodeHome() {
    const dirCounts = {
      A: this._getGroups('A').reduce((s,g)=>s+g.codes.length,0),
      B: this._getGroups('B').reduce((s,g)=>s+g.codes.length,0),
      C: this._getGroups('C').reduce((s,g)=>s+g.codes.length,0)
    };
    const entries = [
      { dir:'A', meta:this._dirMeta.A, groups:this._getGroups('A'), codeCount:dirCounts.A },
      { dir:'B', meta:this._dirMeta.B, groups:this._getGroups('B'), codeCount:dirCounts.B },
      { dir:'C', meta:this._dirMeta.C, groups:this._getGroups('C'), codeCount:dirCounts.C }
    ];

    return `${this._renderNav('故障代码知识库', true)}
    <div style="padding:12px 14px;">
      <!-- 搜索栏 -->
      <div style="display:flex;gap:8px;margin-bottom:14px;">
        <div style="flex:1;position:relative;" onclick="MiniProgram._navigateTo('fault-search')">
          <input placeholder="搜索代码..." readonly
            style="width:100%;padding:8px 12px 8px 32px;background:#f5f5f5;border:none;border-radius:20px;font-size:13px;cursor:pointer;">
          <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:13px;">🔍</span>
        </div>
      </div>
      <!-- 三个目录入口 -->
      ${entries.map(e => `
        <div onclick="MiniProgram.mpDir='${e.dir}';MiniProgram._navigateTo('fault-group-list');"
          style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:10px;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:14px;"
          onmouseenter="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.06)';this.style.borderColor='${e.meta.color}';">
          <div style="width:44px;height:44px;background:${e.meta.bg};border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${e.meta.icon}</div>
          <div style="flex:1;">
            <div style="font-size:15px;font-weight:700;color:#333;">${e.meta.label}</div>
            <div style="font-size:12px;color:#999;margin-top:2px;">(${e.dir}) · ${e.groups.length}个代码组 · ${e.codeCount}个代码</div>
          </div>
          <span style="font-size:16px;color:#ccc;">→</span>
        </div>
      `).join('')}
      <div style="text-align:center;padding:16px;font-size:11px;color:#ccc;">
        💡 仅供查看，维护请联系IT管理员
      </div>
    </div>`;
  },

  // ======================== 代码组列表页 ========================
  _renderFaultGroupList() {
    const meta = this._dirMeta[this.mpDir];
    const groups = this._getGroups(this.mpDir);

    return `${this._renderNav(meta.label+'('+this.mpDir+')', true)}
    <div style="padding:10px 14px;">
      ${groups.map(g => `
        <div onclick="MiniProgram.mpGroupId='${g.groupId}';MiniProgram._navigateTo('fault-code-list');"
          style="background:white;border:1px solid #e5e7eb;border-radius:10px;padding:14px;margin-bottom:8px;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:space-between;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:14px;font-weight:600;color:#333;">📂 ${esc(g.groupName)}</div>
            <div style="font-size:11px;color:#999;margin-top:3px;">${g.codes.length}个代码 · 适用：${esc((g.equipTypes||[]).slice(0,2).join('、'))||'全部'}${(g.equipTypes||[]).length>2?'等':''}</div>
          </div>
          <span style="font-size:14px;color:#ccc;flex-shrink:0;margin-left:8px;">→</span>
        </div>
      `).join('')}
      <div style="text-align:center;padding:16px;font-size:11px;color:#ccc;">
        💡 点击代码组查看下属代码
      </div>
    </div>`;
  },

  // ======================== 代码列表页 ========================
  _renderFaultCodeList() {
    const meta = this._dirMeta[this.mpDir];
    const groups = this._getGroups(this.mpDir);
    const group = groups.find(g => g.groupId === this.mpGroupId);
    if (!group) return `<div style="padding:20px;text-align:center;color:#999;">代码组未找到</div>`;

    return `${this._renderNav(esc(group.groupName), true)}
    <div style="padding:12px 14px;">
      <!-- 代码组描述 -->
      <div style="background:${meta.bg};border-radius:8px;padding:12px;margin-bottom:14px;font-size:12px;color:var(--text-secondary);line-height:1.5;">
        ${esc(group.groupDesc)}
      </div>
      <!-- 代码列表 -->
      ${group.codes.map(c => `
        <div onclick="MiniProgram.mpCode='${esc(c.code)}';MiniProgram._navigateTo('fault-code-detail');"
          style="background:white;border:1px solid #e5e7eb;border-radius:10px;padding:14px;margin-bottom:8px;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:space-between;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:14px;font-weight:600;color:#333;">${esc(c.code)}</div>
            <div style="font-size:12px;color:#666;margin-top:2px;line-height:1.4;">${esc(c.desc)}</div>
            ${c.refCount>0?`<div style="font-size:11px;color:${meta.color};margin-top:3px;">引用${c.refCount}次</div>`:''}
          </div>
          <span style="font-size:14px;color:#ccc;flex-shrink:0;margin-left:8px;">→</span>
        </div>
      `).join('')}
      <div style="text-align:center;padding:16px;font-size:11px;color:#ccc;">
        💡 点击代码查看详情及智能推荐
      </div>
    </div>`;
  },

  // ======================== 代码详情页（含智能推荐）=======================
  _renderFaultCodeDetail() {
    const meta = this._dirMeta[this.mpDir];
    const groups = this._getGroups(this.mpDir);
    const group = groups.find(g => g.groupId === this.mpGroupId);
    const codeObj = group ? group.codes.find(c => c.code === this.mpCode) : null;
    if (!codeObj) return `<div style="padding:20px;text-align:center;color:#999;">代码未找到</div>`;

    // 智能推荐（仅现象代码）
    let recommendHtml = '';
    if (this.mpDir === 'A') {
      const rec = this._getRecommendations(this.mpCode);
      if (rec && rec.totalRecords >= 10) {
        const renderMiniList = (items, label, icon, color) => {
          if (!items || !items.length) return '';
          return `<div style="margin-bottom:12px;">
            <div style="font-weight:600;font-size:12px;margin-bottom:6px;">${icon} ${label}</div>
            ${items.map((r,i) => `
              <div style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12px;border-bottom:${i<items.length-1?'1px solid #f5f5f5':''};">
                <span style="font-weight:700;color:${color};min-width:18px;">${i+1}.</span>
                <span style="font-weight:600;">${esc(r.code)}</span>
                <span style="flex:1;color:#666;">${esc(r.desc)}</span>
                <div style="display:flex;align-items:center;gap:4px;min-width:52px;">
                  <div style="width:32px;height:4px;background:#f0f0f0;border-radius:2px;overflow:hidden;">
                    <div style="height:100%;width:${r.ratio}%;background:${color};border-radius:2px;"></div>
                  </div>
                  <span style="font-size:10px;font-weight:600;">${r.ratio}%</span>
                </div>
              </div>
            `).join('')}
          </div>`;
        };
        recommendHtml = `<div style="background:white;border:1px solid #e5e7eb;border-radius:10px;padding:14px;margin-top:12px;">
          <div onclick="MiniProgram.mpShowRecommend=!MiniProgram.mpShowRecommend;MiniProgram._refreshContent();"
            style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;margin-bottom:${this.mpShowRecommend?'12px':'0'};">
            <span style="font-weight:700;font-size:14px;">📊 智能推荐 ${this.mpShowRecommend?'▲':'▼'}</span>
            <span style="font-size:11px;color:#999;">${rec.totalRecords}张工单</span>
          </div>
          ${this.mpShowRecommend ? `
            ${renderMiniList(rec.causes, '最常见原因', '🔍', '#3B82F6')}
            ${renderMiniList(rec.remedies, '最常用措施', '🔧', '#10B981')}
            <div style="text-align:center;font-size:11px;color:#999;margin-top:8px;">数据：近12个月 · 计算日期：${rec.calcDate}</div>
          ` : ''}
        </div>`;
      } else {
        const count = rec ? rec.totalRecords : 0;
        recommendHtml = `<div style="background:white;border:1px solid #e5e7eb;border-radius:10px;padding:14px;margin-top:12px;text-align:center;">
          <div style="font-size:12px;color:#999;">📊 数据积累不足（${count}/10），暂无法提供推荐</div>
        </div>`;
      }
    }

    return `${this._renderNav('代码详情', true)}
    <div style="padding:14px;">
      <!-- 代码信息卡片 -->
      <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:18px;margin-bottom:8px;">
        <div style="font-size:20px;font-weight:700;color:${meta.color};margin-bottom:4px;">${esc(codeObj.code)}</div>
        <div style="font-size:13px;color:#666;line-height:1.5;margin-bottom:12px;">${esc(codeObj.desc)}</div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;font-size:11px;color:#999;">
          <div style="background:#f5f5f5;border-radius:6px;padding:4px 10px;">📂 ${meta.label}</div>
          <div style="background:#f5f5f5;border-radius:6px;padding:4px 10px;">📁 ${esc(group?group.groupName:'-')}</div>
          <div style="background:#f5f5f5;border-radius:6px;padding:4px 10px;">📊 引用${codeObj.refCount}次</div>
        </div>
        <div style="margin-top:10px;font-size:11px;color:#999;">
          适用设备：${esc((codeObj.equipTypes||[]).join('、') || '-')}
        </div>
      </div>
      ${recommendHtml}
      <div style="text-align:center;padding:16px;font-size:11px;color:#ccc;">
        💡 仅供查看，维护请联系IT管理员
      </div>
    </div>`;
  },

  // ======================== 搜索页面 ========================
  _renderFaultSearch() {
    this.mpSearchResults = null;
    return `${this._renderNav('搜索代码', true)}
    <div style="padding:14px;">
      <div style="display:flex;gap:8px;margin-bottom:14px;">
        <div style="flex:1;position:relative;">
          <input id="mpSearchInput" placeholder="输入代码或描述关键词..."
            style="width:100%;padding:10px 14px 10px 34px;background:#f5f5f5;border:2px solid transparent;border-radius:22px;font-size:13px;outline:none;transition:border-color .2s;"
            onfocus="this.style.borderColor='var(--primary-lighter)';"
            onblur="this.style.borderColor='transparent';"
            onkeydown="if(event.key==='Enter')MiniProgram._mpDoSearch()">
          <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:14px;">🔍</span>
        </div>
        <button onclick="MiniProgram._mpDoSearch()"
          style="padding:8px 18px;background:var(--primary-lighter);color:white;border:none;border-radius:22px;font-size:13px;font-weight:600;cursor:pointer;">搜索</button>
      </div>
      <div id="mpSearchResults">
        <div style="text-align:center;padding:40px 0;color:#ccc;">
          <div style="font-size:32px;margin-bottom:8px;">🔍</div>
          <div style="font-size:13px;">输入关键词搜索故障代码</div>
        </div>
      </div>
    </div>`;
  },

  _mpDoSearch() {
    const input = document.getElementById('mpSearchInput');
    const keyword = (input ? input.value : '').trim();
    if (!keyword) return;

    const q = keyword.toLowerCase();
    const results = [];
    [{dir:'A',groups:this._getGroups('A')},{dir:'B',groups:this._getGroups('B')},{dir:'C',groups:this._getGroups('C')}].forEach(dg => {
      dg.groups.forEach(g => {
        g.codes.forEach(c => {
          if (c.code.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || g.groupName.toLowerCase().includes(q)) {
            results.push({ dir: dg.dir, groupId: g.groupId, groupName: g.groupName, code: c.code, desc: c.desc });
          }
        });
      });
    });
    this.mpSearchResults = results;

    const container = document.getElementById('mpSearchResults');
    if (!container) return;

    if (!results.length) {
      container.innerHTML = `<div style="text-align:center;padding:40px 0;color:#999;">
        <div style="font-size:32px;margin-bottom:8px;">📭</div>
        <div style="font-size:13px;">未找到匹配的故障代码，请尝试其他关键词。</div>
      </div>`;
      return;
    }

    container.innerHTML = `<div style="font-size:12px;color:#999;margin-bottom:10px;">搜索"${esc(keyword)}" · 共${results.length}条</div>
      ${results.map(item => {
        const meta = this._dirMeta[item.dir];
        return `<div onclick="MiniProgram._mpSelectSearchResult('${item.dir}','${item.groupId}','${esc(item.code)}')"
          style="background:white;border:1px solid #e5e7eb;border-radius:10px;padding:14px;margin-bottom:8px;cursor:pointer;display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;background:${meta.bg};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">${meta.icon}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:600;">${esc(item.code)}</div>
            <div style="font-size:12px;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(item.desc)}</div>
            <div style="font-size:10px;color:#999;margin-top:2px;">${meta.label} · ${esc(item.groupName)}</div>
          </div>
          <span style="font-size:14px;color:#ccc;">→</span>
        </div>`;
      }).join('')}`;
  },

  _mpSelectSearchResult(dir, groupId, code) {
    this.mpDir = dir;
    this.mpGroupId = groupId;
    this.mpCode = code;
    this.mpSearchResults = null;
    // 直接导航到详情页（重新设置页面栈）
    this.pageStack = ['fault-code-home'];
    this.currentPage = 'fault-code-detail';
    this._refreshContent();
  }
};

// ===== Main App Controller =====
const App = {
  currentMain: '',
  currentSub: '',
  currentThird: '',
  menuOpen: {},

  menu: [
    { id:'home', label:'首页', type:'link', route:'home' },
    {
      id:'main-data', label:'1. 主数据管理', children: [
        { id:'material', label:'1.1 物料主数据', route:'material-master', pageObj:'MaterialMaster' },
        { id:'functional-location', label:'1.2 功能位置', route:'functional-location', pageObj:'FunctionalLocation' },
        { id:'work-center', label:'1.3 工作中心', route:'work-center', pageObj:'WorkCenter' },
        { id:'maintenance-tasklist', label:'1.4 任务清单', route:'maintenance-tasklist', pageObj:'MaintenanceTasklist' },
        { id:'equipment', label:'1.5 设备主数据', route:'equipment-master', pageObj:'EquipmentMaster' },
        { id:'fault-code-kb', label:'1.6 故障代码知识库', route:'fault-code-kb', pageObj:'FaultCodeKnowledge' }
      ]
    },
    {
      id:'maintenance-flow', label:'2. 维修流程', children: [
        { id:'mf-preventive', label:'2.1 预防性维护计划', route:'mf-preventive', pageObj:'MaintPreventive' },
        { id:'mf-notification-v3', label:'2.2 通知单管理', route:'mf-notification-v3', pageObj:'MaintenanceNotificationV3' },
        { id:'mf-workorder', label:'2.3 维修工单管理', route:'mf-workorder', pageObj:'MaintenanceWorkOrderV3' },
        { id:'mf-reports', label:'2.4 设备维修履历与报表', route:'mf-reports', pageObj:'MaintenanceReports' }
      ]
    },
    {
      id:'spare-parts', label:'3. 备品备件管理', children: [
        { id:'sp-stock', label:'3.1 库存查询', route:'sp-stock' },
        { id:'sp-purchase', label:'3.2 采购申请', route:'sp-purchase' },
        { id:'sp-pick', label:'3.3 备件领用', route:'sp-pick' }
      ]
    },
    {
      id:'measurement', label:'4. 测量数据记录', children: [
        { id:'mr-entry', label:'4.1 录入测量数据', route:'mr-entry', pageObj:'MeasurementRecord' },
        { id:'mr-history', label:'4.2 历史查询与趋势', route:'mr-history' },
        { id:'mr-import', label:'4.3 批量导入', route:'mr-import' }
      ]
    },
    { id:'miniapp', label:'9. 小程序', type:'link', route:'miniapp' }
  ],

  pageMap: {
    'material-master': MaterialMaster,
    'equipment-master': EquipmentMaster,
    'functional-location': FunctionalLocation,
    'work-center': WorkCenter,
    'equipment-bom': EquipmentBOM,
    'measurement-point': MeasurementPoint,
    'mr-entry': MeasurementRecord,
    'sp-stock': SparePartsStock,
    'sp-purchase': SpPurchase,
    'sp-pick': SpPick,
    'mf-preventive': MaintPreventive,
    'mf-notification-v3': MaintenanceNotificationV3,
    'mf-workorder': MaintenanceWorkOrderV3,
    'fault-code-kb': FaultCodeKnowledge,
    'mf-reports': MaintenanceReports,
    'maintenance-tasklist': MaintenanceTasklist,
    'miniapp': MiniProgram
  },

  init() {
    // 1. 初始化用户界面
    this._initUserUI();
    // 2. 初始化数据持久化服务
    this._initPersistence();
    this.renderSidebar();
    this.setupMenuToggle();
    this.setupTopbarButtons();
    this.navigateTo('home');
  },

  /* ===== 用户界面初始化 ===== */
  _initUserUI() {
    var userId = window.currentUserId || 'admin';
    var displayName = userId;
    var avatar = userId.charAt(0).toUpperCase();

    // 预设用户映射
    var userMap = {
      'admin': { name: '管理员', role: '系统管理员' },
      'engineer1': { name: '张工', role: '维修工程师' },
      'engineer2': { name: '李工', role: '维修工程师' }
    };

    if (userMap[userId]) {
      displayName = userMap[userId].name;
      avatar = displayName.charAt(0);
    }

    // 更新侧边栏
    var sa = document.getElementById('sidebarAvatar');
    var sn = document.getElementById('sidebarUsername');
    var sr = document.getElementById('sidebarRole');
    if (sa) sa.textContent = avatar;
    if (sn) sn.textContent = displayName;
    if (sr) sr.textContent = (userMap[userId] || {}).role || '操作员';

    // 更新顶栏
    var ta = document.getElementById('topbarAvatar');
    var tu = document.getElementById('topbarUsername');
    var ua = document.getElementById('userMenuAvatar');
    var un = document.getElementById('userMenuName');
    var ur = document.getElementById('userMenuRole');
    if (ta) ta.textContent = avatar;
    if (tu) tu.textContent = displayName;
    if (ua) ua.textContent = avatar;
    if (un) un.textContent = displayName;
    if (ur) ur.textContent = (userMap[userId] || {}).role || '操作员';
  },

  /* ===== 数据持久化初始化 ===== */
  _initPersistence() {
    var userId = window.currentUserId || 'admin';
    this._persistenceResult = window.PersistenceService.init(userId);
  },


  /* ===== Topbar Buttons ===== */
  setupTopbarButtons() {
    // Notification
    this.notifications = [
      { id:1, type:'warn', icon:'⚠', title:'CNC控制柜接线端子松动', desc:'紧急安全隐患需立即处理', time:'2026-06-01 10:30', read:false },
      { id:2, type:'info', icon:'📋', title:'6月预防性工单已生成', desc:'CNC加工中心月度润滑保养工单待派工', time:'2026-06-01 08:00', read:false },
      { id:3, type:'success',icon:'✓', title:'包装机维修工单已关闭', desc:'验收合格，包装线已恢复正常生产', time:'2026-05-22 16:30', read:false },
      { id:4, type:'info', icon:'📦', title:'备件领用审批通过', desc:'接头密封垫SP-SEAL-010领用3个已出库', time:'2026-05-22 09:15', read:true },
      { id:5, type:'danger',icon:'🔴',title:'纯化水泵变频器故障', desc:'1#变频器F007过载报警，已切换至2#单泵运行', time:'2026-05-27 10:00', read:true },
    ];
    this._activeDropdown = null;

    const btnNotify = document.getElementById('btnNotify');
    const notifyPanel = document.getElementById('notifyPanel');
    const btnSettings = document.getElementById('btnSettings');
    const settingsMenu = document.getElementById('settingsMenu');
    const btnUser = document.getElementById('btnUser');
    const userMenu = document.getElementById('userMenu');
    const btnFullscreen = document.getElementById('btnFullscreen');

    // Toggle notification panel
    btnNotify.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this._activeDropdown === 'notify') {
        this._closeAllDropdowns();
      } else {
        this._closeAllDropdowns();
        this._activeDropdown = 'notify';
        btnNotify.setAttribute('aria-expanded', 'true');
        notifyPanel.classList.add('show');
        this._renderNotifyList();
      }
    });

    // Toggle settings menu
    btnSettings.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this._activeDropdown === 'settings') {
        this._closeAllDropdowns();
      } else {
        this._closeAllDropdowns();
        this._activeDropdown = 'settings';
        btnSettings.setAttribute('aria-expanded', 'true');
        settingsMenu.classList.add('show');
      }
    });

    // Toggle user menu
    btnUser.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this._activeDropdown === 'user') {
        this._closeAllDropdowns();
      } else {
        this._closeAllDropdowns();
        this._activeDropdown = 'user';
        btnUser.setAttribute('aria-expanded', 'true');
        userMenu.classList.add('show');
      }
    });

    // Click outside to close
    document.addEventListener('click', () => this._closeAllDropdowns());

    // Prevent dropdown close when clicking inside panel
    [notifyPanel, settingsMenu, userMenu].forEach(panel => {
      panel.addEventListener('click', (e) => e.stopPropagation());
    });

    // Notification read all
    document.getElementById('notifyReadAll').addEventListener('click', () => {
      this.notifications.forEach(n => n.read = true);
      this._renderNotifyList();
      this._updateNotifyBadge();
    });

    // Notification clear
    document.getElementById('notifyClear').addEventListener('click', () => {
      this.notifications = [];
      this._renderNotifyList();
      this._updateNotifyBadge();
      this._closeAllDropdowns();
    });

    // Settings menu items
    settingsMenu.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        this._handleSettingsAction(action);
        this._closeAllDropdowns();
      });
    });

    // User menu items
    userMenu.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        this._handleUserAction(action);
        this._closeAllDropdowns();
      });
    });

    // Fullscreen toggle
    btnFullscreen.addEventListener('click', () => this._toggleFullscreen());

    this._updateNotifyBadge();
  },

  _closeAllDropdowns() {
    this._activeDropdown = null;
    document.querySelectorAll('.topbar-btn').forEach(b => b.removeAttribute('aria-expanded'));
    document.querySelectorAll('.topbar-dropdown').forEach(d => d.classList.remove('show'));
  },

  _renderNotifyList() {
    const container = document.getElementById('notifyList');
    if (!this.notifications.length) {
      container.innerHTML = '<div class="notify-empty">📭 暂无通知</div>';
      return;
    }
    container.innerHTML = this.notifications.map(n => `
      <div class="notify-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
        <span class="notify-item-icon ${n.type}">${n.icon}</span>
        <span class="notify-dot ${n.read ? 'read' : ''}"></span>
        <div class="notify-body">
          <div class="notify-item-title">${esc(n.title)}</div>
          <div class="notify-item-desc">${esc(n.desc)}</div>
          <div class="notify-item-time">${esc(n.time)}</div>
        </div>
      </div>
    `).join('');

    // Click to mark as read
    container.querySelectorAll('.notify-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = parseInt(el.dataset.id);
        const n = this.notifications.find(x => x.id === id);
        if (n) { n.read = true; }
        this._renderNotifyList();
        this._updateNotifyBadge();
      });
    });
  },

  _updateNotifyBadge() {
    const badge = document.getElementById('notifyBadge');
    const unread = this.notifications.filter(n => !n.read).length;
    if (unread > 0) {
      badge.textContent = unread > 99 ? '99+' : unread;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  },

  _handleSettingsAction(action) {
    switch (action) {
      case 'theme':
        toast('主题切换功能开发中');
        break;
      case 'preferences':
        toast('系统偏好设置开发中');
        break;
      case 'exportData':
        this._handleExportData();
        break;
      case 'importData':
        this._handleImportData();
        break;
      case 'dataInfo':
        this._handleDataInfo();
        break;
      case 'about':
        showModal('关于系统', `
          <div style="text-align:center;padding:20px 0;">
            <div style="font-size:32px;font-weight:700;color:var(--primary);margin-bottom:8px;">MES系统</div>
            <div style="font-size:14px;color:var(--text-secondary);">制造执行系统</div>
            <div style="margin-top:16px;font-size:12px;color:var(--text-muted);">
              <p>基于现代Web架构，支持预防性维护、</p>
              <p>维修工单管理、备品备件管理等核心功能。</p>
              <p style="margin-top:12px;">Version 2.0.0 · &copy; 2026</p>
            </div>
          </div>
        `);
        break;
    }
  },

  _handleUserAction(action) {
    switch (action) {
      case 'profile':
        toast('个人中心功能开发中');
        break;
      case 'password':
        toast('密码修改功能开发中');
        break;
      case 'exportData':
        this._handleExportData();
        break;
      case 'importData':
        this._handleImportData();
        break;
      case 'dataInfo':
        this._handleDataInfo();
        break;
      case 'logout':
        showModal('确认退出', '<p style="font-size:14px;color:var(--text-secondary);">退出前将自动保存当前工作数据。<br>下次使用同一用户名登录即可恢复。</p>', [
          { text:'取消', cls:'btn-secondary', action:closeModal },
          { text:'退出登录', cls:'btn-primary', action:function() {
            closeModal();
            // 保存数据后跳转登录页
            try { window.PersistenceService.saveAll(); } catch(e) {}
            localStorage.removeItem('pm_v2_current_user');
            window.location.href = 'login.html';
          }}
        ]);
        break;
    }
  },

  /* ===== 数据管理方法 ===== */

  /** 导出数据到 JSON 文件 */
  _handleExportData() {
    try {
      var result = window.PersistenceService.exportToFile();
      toast('数据已导出（' + result.sizeKB + ' KB）\n文件保存到下载目录，可在另一台电脑上导入恢复。');
    } catch(e) {
      toast('导出失败：' + e.message);
    }
  },

  /** 从 JSON 文件导入数据 */
  _handleImportData() {
    var self = this;
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    document.body.appendChild(input);

    input.addEventListener('change', function() {
      var file = this.files[0];
      if (!file) { document.body.removeChild(input); return; }

      showModal('导入确认',
        '<p style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">' +
        '即将从备份文件 <strong>' + esc(file.name) + '</strong>（' +
        (file.size / 1024).toFixed(1) + ' KB）导入数据。</p>' +
        '<p style="font-size:13px;color:var(--danger);background:#fef2f2;padding:10px;border-radius:6px;border:1px solid #fecaca;">' +
        '注意：导入将覆盖当前所有工作数据，建议先导出备份。</p>',
        [
          { text:'取消', cls:'btn-secondary', action:function() {
            closeModal();
            document.body.removeChild(input);
          }},
          { text:'确认导入', cls:'btn-primary', action:function() {
            closeModal();
            window.PersistenceService.importFromFile(file).then(function(result) {
              toast('数据导入成功！\n恢复了 ' + result.importCount + ' 个数据变量\n来源用户：' + (result.sourceUser || '未知') + '\n\n页面将刷新以应用数据。');
              setTimeout(function() { location.reload(); }, 1500);
            }).catch(function(err) {
              toast('导入失败：' + err.message);
            });
            document.body.removeChild(input);
          }}
        ]
      );
    });

    input.click();
  },

  /** 显示数据存储统计 */
  _handleDataInfo() {
    try {
      var info = window.PersistenceService.getStorageInfo();
      var itemsHtml = info.items.map(function(item) {
        return '<tr><td style="padding:4px 8px;font-size:12px;">' + esc(item.name) +
          '</td><td style="padding:4px 8px;font-size:12px;text-align:right;">' + item.sizeKB + ' KB</td>' +
          '<td style="padding:4px 8px;font-size:12px;text-align:right;">' + item.recordCount + '</td></tr>';
      }).join('');

      showModal('数据存储统计',
        '<div style="font-size:14px;line-height:1.8;">' +
        '<p><strong>当前用户：</strong>' + esc(info.userId) + '</p>' +
        '<p><strong>已保存变量：</strong>' + info.variableCount + ' 个</p>' +
        '<p><strong>总占用空间：</strong>' + info.totalKB + ' KB / ' + info.quotaEstimate.usedKB + ' KB (' + info.quotaEstimate.percentUsed + '%)</p>' +
        '<hr style="border:none;border-top:1px solid var(--border);margin:8px 0;">' +
        '<table style="width:100%;border-collapse:collapse;">' +
        '<thead><tr><th style="text-align:left;padding:4px 8px;font-size:12px;">变量名</th>' +
        '<th style="text-align:right;padding:4px 8px;font-size:12px;">大小</th>' +
        '<th style="text-align:right;padding:4px 8px;font-size:12px;">记录数</th></tr></thead>' +
        '<tbody>' + itemsHtml + '</tbody></table>' +
        '</div>',
        [
          { text:'清除数据', cls:'btn-danger', action:function() {
            closeModal();
            showModal('确认清除',
              '<p style="font-size:14px;color:var(--danger);">确定要清除 ' + esc(info.userId) + ' 在本机的所有数据吗？此操作不可恢复！</p>',
              [
                { text:'取消', cls:'btn-secondary', action:closeModal },
                { text:'确认清除', cls:'btn-primary', action:function() {
                  closeModal();
                  window.PersistenceService.clearAll();
                  toast('数据已清除，页面将刷新');
                  setTimeout(function() { location.reload(); }, 1000);
                }}
              ]
            );
          }},
          { text:'关闭', cls:'btn-secondary', action:closeModal }
        ]
      );
    } catch(e) {
      toast('获取存储信息失败：' + e.message);
    }
  },

  _toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  },

  renderSidebar() {
    const nav = document.getElementById('sidebarNav');
    let html = '';
    this.menu.forEach(item => {
      html += this.renderMenuItem(item, 0);
    });
    nav.innerHTML = html;
  },

  renderMenuItem(item, depth) {
    if (item.type === 'link') {
      const isActive = this.currentMain === item.id;
      return `<div class="nav-item">
        <div class="nav-header ${isActive?'active':''}" onclick="App.navigateTo('${item.id}')">
          <span>${item.label}</span>
        </div>
      </div>`;
    }

    // Group with children
    if (item.children) {
      const isOpen = this.menuOpen[item.id] !== false;
      const hasActiveChild = this.isActiveParent(item);
      let html = `<div class="nav-item">
        <div class="nav-header ${hasActiveChild?'active':''}" onclick="App.toggleMenu(event,'${item.id}')">
          <span>${item.label}</span>
          <span class="nav-arrow ${isOpen?'open':''}">&#9654;</span>
        </div>
        <div class="nav-submenu ${isOpen?'open':''}">`;

      item.children.forEach(child => {
        if (child.children) {
          // Third-level group
          const thirdOpen = this.menuOpen[child.id] !== false;
          const hasActiveThird = this.isActiveParent(child);
          html += `<div class="nav-subitem has-children ${this.currentSub === child.id ? 'active' : ''}" onclick="App.toggleThirdMenu(event,'${child.id}')">
            <span>${child.label}</span>
            <span class="nav-arrow ${thirdOpen?'open':''}" style="font-size:8px;">&#9654;</span>
          </div>`;
          html += `<div class="nav-third ${thirdOpen?'open':''}">`;
          child.children.forEach(third => {
            html += `<div class="nav-third-item ${this.currentThird === third.id ? 'active' : ''}" onclick="App.navigateToThird('${item.id}','${child.id}','${third.id}','${third.route}','${third.label}')">${third.label}</div>`;
          });
          html += '</div>';
        } else {
          html += `<div class="nav-subitem ${this.currentSub === child.id ? 'active' : ''}" onclick="App.navigateTo('${item.id}','${child.id}','${child.route}','${child.label}')">${child.label}</div>`;
        }
      });

      html += '</div></div>';
      return html;
    }
    return '';
  },

  isActiveParent(item) {
    if (!item.children) return false;
    return item.children.some(child => {
      if (child.children) {
        return child.children.some(third => third.id === this.currentThird);
      }
      return child.id === this.currentSub;
    });
  },

  toggleMenu(e, menuId) {
    e.stopPropagation();
    if (this.menuOpen[menuId] === undefined) {
      this.menuOpen[menuId] = false;
    } else {
      this.menuOpen[menuId] = !this.menuOpen[menuId];
    }
    this.renderSidebar();
  },

  toggleThirdMenu(e, menuId) {
    e.stopPropagation();
    if (this.menuOpen[menuId] === undefined) {
      this.menuOpen[menuId] = false;
    } else {
      this.menuOpen[menuId] = !this.menuOpen[menuId];
    }
    this.renderSidebar();
  },

  navigateTo(mainId, subId, route, label) {
    this.currentMain = mainId;
    this.currentSub = subId || '';
    this.currentThird = '';

    const contentArea = document.getElementById('contentArea');
    const topbarTitle = document.getElementById('topbarTitle');

    if (mainId === 'home') {
      topbarTitle.textContent = '首页';
      contentArea.className = 'content-area full-width';
      contentArea.innerHTML = this.renderHomepage();
      this.renderSidebar();
      this.closeMobileSidebar();
      return;
    }

    topbarTitle.textContent = label || '';
    const pageObj = this.pageMap[route];
    if (pageObj) {
      try {
        contentArea.className = 'content-area full-width';
        contentArea.innerHTML = pageObj.render();
        // Special handling: measurement record tabs
        if (route === 'mr-entry' && pageObj === MeasurementRecord) {
          pageObj.activeTab = 'entry';
          pageObj.init();
        } else if (route === 'mr-history') {
          // For history tab, use MeasurementRecord
          contentArea.innerHTML = MeasurementRecord.render();
          MeasurementRecord.activeTab = 'history';
          MeasurementRecord.init();
        } else if (route === 'mr-import') {
          contentArea.innerHTML = MeasurementRecord.render();
          MeasurementRecord.activeTab = 'import';
          MeasurementRecord.init();
        } else {
          pageObj.init();
        }
      } catch (e) {
        console.error('页面加载失败:', route, e);
        contentArea.className = 'content-area full-width';
        contentArea.innerHTML = this.renderError(route, label, e);
      }
    } else {
      contentArea.className = 'content-area full-width';
      contentArea.innerHTML = this.renderPlaceholder(label || route);
    }

    this.renderSidebar();
    this.closeMobileSidebar();
  },

  navigateToThird(mainId, subId, thirdId, route, label) {
    this.currentMain = mainId;
    this.currentSub = subId;
    this.currentThird = thirdId;

    const contentArea = document.getElementById('contentArea');
    const topbarTitle = document.getElementById('topbarTitle');

    topbarTitle.textContent = label || '';
    const pageObj = this.pageMap[route];
    if (pageObj) {
      try {
        contentArea.className = 'content-area full-width';
        contentArea.innerHTML = pageObj.render();
        pageObj.init();
      } catch (e) {
        console.error('页面加载失败:', route, e);
        contentArea.className = 'content-area full-width';
        contentArea.innerHTML = this.renderError(route, label, e);
      }
    } else {
      contentArea.className = 'content-area full-width';
      contentArea.innerHTML = this.renderPlaceholder(label || route);
    }

    this.renderSidebar();
    this.closeMobileSidebar();
  },

  renderError(route, label, error) {
    return `
      <div style="min-height:calc(100vh - 96px);display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fff1f2;border-radius:12px;">
        <div style="text-align:center;padding:40px;max-width:700px;">
          <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
          <div style="font-size:20px;font-weight:700;color:#dc2626;margin-bottom:8px;">页面加载失败</div>
          <div style="font-size:14px;color:#991b1b;margin-bottom:4px;">路由: ${esc(route || label || '未知')}</div>
          <div style="font-size:12px;color:#7f1d1d;background:#fecaca;border-radius:6px;padding:12px;margin-top:12px;text-align:left;font-family:monospace;max-height:200px;overflow:auto;">${esc(error.message || String(error))}</div>
          <button class="btn btn-primary" style="margin-top:20px;" onclick="App.navigateTo('home')">返回首页</button>
        </div>
      </div>`;
  },

  renderPlaceholder(title) {
    return `
      <div style="min-height:calc(100vh - 96px);display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f8fafc;border-radius:12px;">
        <div style="text-align:center;padding:40px;">
          <div style="font-size:48px;margin-bottom:20px;color:var(--text-muted);">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
          </div>
          <div style="font-size:20px;font-weight:700;color:var(--text-secondary);margin-bottom:8px;">${title}</div>
          <div style="font-size:14px;color:var(--text-muted);">功能开发中，敬请期待...</div>
        </div>
      </div>`;
  },

  renderHomepage() {
    return `
      <div class="homepage">
        <img class="homepage-bg-img" src="images/homepage-bg.jpg" alt="首页背景">
      </div>`;
  },

  setupMenuToggle() {
    document.getElementById('menuToggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
  },

  closeMobileSidebar() {
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar').classList.remove('open');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());

