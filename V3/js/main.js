// ===== Main App Controller =====
const App = {
  currentMain: '',
  currentSub: '',
  currentThird: '',
  menuOpen: {},

  // 新目录结构（方案G）：左侧竖排一级 + hover展开面板（二级分组+三级功能入口）
  menu: [
    {
      id:'main-data', label:'主数据管理', icon:'📋',
      groups: [
        {
          title:'物料', items: [
            { id:'material', label:'物料主数据', route:'material-master', pageObj:'MaterialMaster' }
          ]
        }
      ]
    },
    {
      id:'production-management', label:'生产管理', icon:'⚙️',
      groups: [
        {
          title:'成本对象', items: [
            { id:'process-order', label:'流程订单', route:'process-order' },
            { id:'internal-order', label:'内部订单', route:'internal-order' },
            { id:'cost-center', label:'成本中心', route:'cost-center' },
            { id:'project-info', label:'项目信息', route:'project-info' }
          ]
        },
        {
          title:'投料', items: [
            { id:'issue-order', label:'流程订单投料', route:'issue-order' },
            { id:'issue-order-batch', label:'流程订单投料-批导', route:'issue-order-batch' },
            { id:'issue-project', label:'项目投料', route:'issue-project' }
          ]
        },
        {
          title:'报工', items: [
            { id:'confirm', label:'报工', route:'confirm' },
            { id:'confirm-reverse', label:'报工冲销', route:'confirm-reverse' },
            { id:'confirm-batch', label:'报工-批导', route:'confirm-batch' },
            { id:'confirm-record', label:'报工记录', route:'confirm-record' }
          ]
        },
        {
          title:'收货', items: [
            { id:'goods-receipt', label:'收货', route:'goods-receipt' },
            { id:'goods-receipt-batch', label:'收货-批导', route:'goods-receipt-batch' }
          ]
        },
        {
          title:'合箱', items: [
            { id:'packing', label:'合箱', route:'packing' },
            { id:'packing-record', label:'合箱记录', route:'packing-record' }
          ]
        },
        {
          title:'技术性完成', items: [
            { id:'tech-complete', label:'订单技术性完成', route:'tech-complete' },
            { id:'tech-complete-record', label:'技术性完成记录', route:'tech-complete-record' }
          ]
        }
      ]
    },
    {
      id:'quality-management', label:'质量管理', icon:'✅',
      groups: [
        {
          title:'质量主数据', items: [
            { id:'quality-standard', label:'质量标准（检验计划+物料规格）', route:'quality-standard' },
            { id:'inspection-char', label:'主检验特性', route:'inspection-char' },
            { id:'inspection-method', label:'检验方法', route:'inspection-method' },
            { id:'sampling-plan', label:'取样方案', route:'sampling-plan' },
            { id:'defect-code', label:'缺陷代码目录', route:'defect-code' }
          ]
        },
        {
          title:'样品与检验', items: [
            { id:'sampling-task', label:'取样任务列表', route:'sampling-task' },
            { id:'sampling-exec', label:'取样执行（移动端）', route:'sampling-exec' },
            { id:'inspection-task', label:'检验任务列表', route:'inspection-task' },
            { id:'inspection-result', label:'检验结果录入（移动端）', route:'inspection-result' },
            { id:'auto-judge', label:'自动判定', route:'auto-judge' },
            { id:'oos-auto', label:'OOS 自动触发', route:'oos-auto' },
            { id:'coa-gen', label:'COA 生成', route:'coa-gen' }
          ]
        },
        {
          title:'稳定性与环境监测', items: [
            { id:'stability-study', label:'稳定性考察', route:'stability-study' }
          ]
        },
        {
          title:'质量事件管理', items: [
            { id:'deviation', label:'偏差管理', route:'deviation' },
            { id:'oos-mgmt', label:'OOS 管理', route:'oos-mgmt' },
            { id:'capa', label:'CAPA 管理', route:'capa' }
          ]
        },
        {
          title:'质量回顾与报表', items: [
            { id:'apqr', label:'APQR/APR', route:'apqr' },
            { id:'cpv', label:'CPV', route:'cpv' },
            { id:'inspection-rate', label:'检验完成率', route:'inspection-rate' },
            { id:'deviation-trend', label:'偏差/OOS 趋势', route:'deviation-trend' },
            { id:'quality-kpi', label:'质量 KPI 看板', route:'quality-kpi' }
          ]
        }
      ]
    },
    {
      id:'device-management', label:'设备管理', icon:'🔧',
      groups: [
        {
          title:'设备主数据', items: [
            { id:'functional-location', label:'功能位置', route:'functional-location', pageObj:'FunctionalLocation' },
            { id:'work-center', label:'工作中心', route:'work-center', pageObj:'WorkCenter' },
            { id:'maintenance-tasklist', label:'任务清单', route:'maintenance-tasklist', pageObj:'MaintenanceTasklist' },
            { id:'equipment', label:'设备主数据', route:'equipment-master', pageObj:'EquipmentMaster' },
            { id:'fault-code-kb', label:'故障代码知识库', route:'fault-code-kb', pageObj:'FaultCodeKnowledge' }
          ]
        },
        {
          title:'测量数据管理', items: [
            { id:'mr-entry', label:'录入测量数据', route:'mr-entry', pageObj:'MeasurementRecord' },
            { id:'mr-history', label:'历史查询与趋势', route:'mr-history' },
            { id:'mr-import', label:'批量导入', route:'mr-import' }
          ]
        },
        {
          title:'维修管理', items: [
            { id:'mf-preventive', label:'预防性维护计划', route:'mf-preventive', pageObj:'MaintPreventive' },
            { id:'mf-notification-v3', label:'通知单管理', route:'mf-notification-v3', pageObj:'MaintenanceNotificationV3' },
            { id:'mf-workorder', label:'维修工单管理', route:'mf-workorder', pageObj:'MaintenanceWorkOrderV3' },
            { id:'mf-reports', label:'设备维修履历与报表', route:'mf-reports', pageObj:'MaintenanceReports' }
          ]
        },
        {
          title:'设备报表分析', items: [
            { id:'report-workorder', label:'工单统计报表', route:'report-workorder' },
            { id:'report-reliability', label:'设备可靠性分析（MTTR/MTBF）', route:'report-reliability' },
            { id:'report-fault-rank', label:'故障排行榜', route:'report-fault-rank' },
            { id:'report-pm-rate', label:'预防性维护执行率', route:'report-pm-rate' },
            { id:'report-workload', label:'人员工作量统计', route:'report-workload' },
            { id:'report-spare-trend', label:'备件消耗趋势', route:'report-spare-trend' }
          ]
        }
      ]
    },
    {
      id:'purchase-demand', label:'采购需求管理', icon:'📦',
      groups: [
        {
          title:'备品备件管理', items: [
            { id:'sp-stock', label:'库存查询', route:'sp-stock' },
            { id:'sp-purchase', label:'采购申请', route:'sp-purchase' },
            { id:'sp-pick', label:'备件领用', route:'sp-pick' }
          ]
        }
      ]
    },
    {
      id:'hse-management', label:'HSE 管理', icon:'🛡️',
      groups: [
        {
          title:'HSE 主数据', items: [
            { id:'hse-hazard-list', label:'危险源清单', route:'hse-hazard-list' },
            { id:'hse-risk-standard', label:'风险评估标准（LEC/HAZOP等）', route:'hse-risk-standard' },
            { id:'hse-risk-matrix', label:'风险等级矩阵', route:'hse-risk-matrix' },
            { id:'hse-law-list', label:'适用法规清单', route:'hse-law-list' },
            { id:'hse-law-link', label:'法规条款关联至业务', route:'hse-law-link' },
            { id:'hse-chem-list', label:'危化品清单（CAS号、危险类别）', route:'hse-chem-list' },
            { id:'hse-sds', label:'SDS（安全数据表）管理', route:'hse-sds' },
            { id:'hse-ppe-template', label:'岗位劳保配置模板', route:'hse-ppe-template' },
            { id:'hse-ppe-list', label:'劳保用品清单', route:'hse-ppe-list' },
            { id:'hse-permit-type', label:'作业票类型定义', route:'hse-permit-type' },
            { id:'hse-safety-template', label:'安全措施模板', route:'hse-safety-template' },
            { id:'hse-inspect-item', label:'检查项目库', route:'hse-inspect-item' },
            { id:'hse-score-standard', label:'评分标准', route:'hse-score-standard' }
          ]
        },
        {
          title:'安全检查与隐患排查', items: [
            { id:'hse-inspect-daily', label:'日常巡检计划', route:'hse-inspect-daily' },
            { id:'hse-inspect-special', label:'专项检查计划（季节性/节假日前）', route:'hse-inspect-special' },
            { id:'hse-inspect-calendar', label:'计划执行日历', route:'hse-inspect-calendar' },
            { id:'hse-inspect-task', label:'检查任务列表（PC端/移动端）', route:'hse-inspect-task' },
            { id:'hse-inspect-result', label:'检查结果录入（合格/隐患/立即整改）', route:'hse-inspect-result' },
            { id:'hse-inspect-photo', label:'拍照上传', route:'hse-inspect-photo' },
            { id:'hse-hazard-register', label:'隐患登记（来源：检查/随手拍/员工上报）', route:'hse-hazard-register' },
            { id:'hse-hazard-evaluate', label:'隐患评估与分级', route:'hse-hazard-evaluate' },
            { id:'hse-hazard-rectify', label:'整改通知与任务分配', route:'hse-hazard-rectify' },
            { id:'hse-hazard-verify', label:'整改验收与关闭', route:'hse-hazard-verify' },
            { id:'hse-bbs-record', label:'观察记录（移动端快速填报）', route:'hse-bbs-record' },
            { id:'hse-bbs-stat', label:'观察统计', route:'hse-bbs-stat' }
          ]
        },
        {
          title:'作业票管理（PTW）', items: [
            { id:'hse-ptw-fire', label:'动火作业', route:'hse-ptw-fire' },
            { id:'hse-ptw-confined', label:'受限空间作业', route:'hse-ptw-confined' },
            { id:'hse-ptw-height', label:'高处作业', route:'hse-ptw-height' },
            { id:'hse-ptw-electric', label:'临时用电', route:'hse-ptw-electric' },
            { id:'hse-ptw-excavation', label:'动土作业', route:'hse-ptw-excavation' },
            { id:'hse-ptw-blind', label:'盲板抽堵作业', route:'hse-ptw-blind' },
            { id:'hse-jsa', label:'作业风险分析（JSA）', route:'hse-jsa' },
            { id:'hse-ptw-confirm', label:'安全措施逐项确认', route:'hse-ptw-confirm' },
            { id:'hse-ptw-approval', label:'审批流程（线下审批，系统录入结果）', route:'hse-ptw-approval' },
            { id:'hse-ptw-close', label:'作业票关闭', route:'hse-ptw-close' },
            { id:'hse-ptw-ledger', label:'作业票台账', route:'hse-ptw-ledger' }
          ]
        },
        {
          title:'事故与事件管理', items: [
            { id:'hse-accident-quick', label:'事故快报（移动端快速上报）', route:'hse-accident-quick' },
            { id:'hse-nearmiss', label:'未遂事件登记', route:'hse-nearmiss' },
            { id:'hse-firstaid', label:'急救/医疗处理记录', route:'hse-firstaid' },
            { id:'hse-investigate-team', label:'调查组成员', route:'hse-investigate-team' },
            { id:'hse-root-cause', label:'根本原因分析（5Why/鱼骨图）', route:'hse-root-cause' },
            { id:'hse-invest-conclusion', label:'调查结论与责任认定', route:'hse-invest-conclusion' },
            { id:'hse-capa-link', label:'CAPA关联', route:'hse-capa-link' },
            { id:'hse-capa-track', label:'措施跟踪与验证', route:'hse-capa-track' },
            { id:'hse-accident-stat', label:'事故事件台账与统计', route:'hse-accident-stat' }
          ]
        },
        {
          title:'职业健康与环境监测', items: [
            { id:'hse-oh-monitor-point', label:'危害因素监测点定义（噪声/粉尘/毒物等）', route:'hse-oh-monitor-point' },
            { id:'hse-oh-monitor-task', label:'监测任务与数据录入（移动端）', route:'hse-oh-monitor-task' },
            { id:'hse-oh-monitor-trend', label:'监测趋势分析', route:'hse-oh-monitor-trend' },
            { id:'hse-oh-contra', label:'职业禁忌证跟踪', route:'hse-oh-contra' },
            { id:'hse-health-exam', label:'体检记录（岗前/在岗/离岗）', route:'hse-health-exam' },
            { id:'hse-occup-disease', label:'职业病档案', route:'hse-occup-disease' },
            { id:'hse-ppe-record', label:'劳保用品领用记录', route:'hse-ppe-record' },
            { id:'hse-env-monitor-point', label:'监测点定义（废气/废水/噪声/固废）', route:'hse-env-monitor-point' },
            { id:'hse-env-monitor-task', label:'监测任务与数据录入', route:'hse-env-monitor-task' },
            { id:'hse-env-alarm', label:'排放超标自动报警', route:'hse-env-alarm' },
            { id:'hse-env-trend', label:'监测趋势分析', route:'hse-env-trend' }
          ]
        },
        {
          title:'培训与报表', items: [
            { id:'hse-train-plan', label:'培训计划', route:'hse-train-plan' },
            { id:'hse-train-record', label:'培训记录（参训人员/成绩）', route:'hse-train-record' },
            { id:'hse-cert-remind', label:'证书/资质到期提醒（特种作业证）', route:'hse-cert-remind' },
            { id:'hse-report-hazard-rate', label:'隐患排查治理率', route:'hse-report-hazard-rate' },
            { id:'hse-report-accident-trend', label:'事故事件趋势分析', route:'hse-report-accident-trend' },
            { id:'hse-report-ltir', label:'LTIR/TRIR（损工/可记录事故率）', route:'hse-report-ltir' },
            { id:'hse-report-ptw-stat', label:'作业票执行统计', route:'hse-report-ptw-stat' },
            { id:'hse-report-env-rate', label:'环境排放达标率', route:'hse-report-env-rate' },
            { id:'hse-report-kpi', label:'HSE KPI 看板', route:'hse-report-kpi' },
            { id:'hse-emergency-plan', label:'应急预案库', route:'hse-emergency-plan' },
            { id:'hse-emergency-drill', label:'应急演练记录', route:'hse-emergency-drill' }
          ]
        }
      ]
    },
    {
      id:'miniapp-mgmt', label:'小程序管理', icon:'📱',
      groups: [
        {
          title:'小程序管理', items: [
            { id:'miniapp', label:'小程序', route:'miniapp' }
          ]
        }
      ]
    }
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
    if (!badge) return;
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
              <p>基于现代Web架构，支持设备管理、</p>
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
    // 首页（独立项，不参与hover面板）
    html += '<div class="g-left-item" data-menu="home" onclick="App.navigateTo(\'home\',\'\',\'home\',\'首页\')">首页</div>';
    // 渲染一级菜单项
    this.menu.forEach(item => {
      html += '<div class="g-left-item" data-menu="' + item.id + '"'
        + ' onmouseenter="App.openGPanel(this)"'
        + ' onmouseleave="App.checkGPanelLeave(event)"'
        + '>' + item.label + '</div>';
    });
    nav.innerHTML = html;
  },

  // 方案G：打开 hover 面板
  openGPanel(el) {
    const menuKey = el.dataset.menu;
    const item = this.menu.find(m => m.id === menuKey);
    if (!item || !item.groups) return;

    // 清除所有激活状态
    document.querySelectorAll('.g-left-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    this._gCurrentMenu = menuKey;

    // 清除关闭定时器
    if (this._gPanelTimer) { clearTimeout(this._gPanelTimer); this._gPanelTimer = null; }

    const panel = document.getElementById('gHoverPanel');
    const inner = document.getElementById('gHoverPanelInner');
    if (!panel || !inner) return;

    // 面板顶部对齐当前菜单项顶部
    var itemRect = el.getBoundingClientRect();
    panel.style.top = itemRect.top + 'px';
    panel.style.maxHeight = (window.innerHeight - itemRect.top) + 'px';

    // 根据二级目录数量计算自适应宽度
    var colCount = item.groups.length;
    var colWidth = 200;
    var gap = 32;
    var padding = 56; // 28 * 2
    var panelWidth = colCount * colWidth + (colCount - 1) * gap + padding;
    var maxWidth = window.innerWidth - 280;
    if (panelWidth > maxWidth) panelWidth = maxWidth;
    panel.style.width = panelWidth + 'px';
    inner.style.width = panelWidth + 'px';

    let html = '<h3>' + item.label + '</h3>';
    html += '<div class="g-hover-grid" style="grid-template-columns: repeat(' + colCount + ', minmax(180px, 1fr));">';
    item.groups.forEach(g => {
      html += '<div class="g-hover-col">';
      html += '<div class="g-hover-col-title">' + g.title + '</div>';
      g.items.forEach(subItem => {
        html += '<div class="g-hover-link" onclick="App.navigateGItem(\'' + menuKey + '\',\'' + subItem.id + '\',\'' + subItem.route + '\',\'' + subItem.label + '\')">' + subItem.label + '</div>';
      });
      html += '</div>';
    });
    html += '</div>';
    inner.innerHTML = html;
    panel.classList.add('open');
  },

  // 方案G：保持面板打开（鼠标进入面板区域）
  keepGPanelOpen() {
    if (this._gPanelTimer) {
      clearTimeout(this._gPanelTimer);
      this._gPanelTimer = null;
    }
  },

  // 方案G：关闭 hover 面板
  closeGPanel() {
    var self = this;
    this._gPanelTimer = setTimeout(function() {
      var panel = document.getElementById('gHoverPanel');
      var inner = document.getElementById('gHoverPanelInner');
      if (panel) {
        panel.classList.remove('open');
        panel.style.width = '';
        panel.style.top = '';
        panel.style.maxHeight = '';
      }
      if (inner) {
        inner.style.width = '';
        var grid = inner.querySelector('.g-hover-grid');
        if (grid) grid.style.gridTemplateColumns = '';
      }
      document.querySelectorAll('.g-left-item').forEach(function(i) { i.classList.remove('active'); });
      self._gCurrentMenu = null;
    }, 150);
  },

  // 方案G：鼠标离开左侧菜单项时检查是否进入面板
  checkGPanelLeave(e) {
    var panel = document.getElementById('gHoverPanel');
    if (!panel) return;
    var rect = panel.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom) {
      return;
    }
    this.closeGPanel();
  },

  // 方案G：点击面板内的功能项
  navigateGItem(menuKey, itemId, route, label) {
    var menuItem = this.menu.find(function(m) { return m.id === menuKey; });
    this.currentMain = menuKey;
    this.currentSub = itemId;
    this.currentThird = '';

    var contentArea = document.getElementById('contentArea');
    var topbarTitle = document.getElementById('topbarTitle');
    if (!contentArea || !topbarTitle) return;

    topbarTitle.textContent = label || '';
    var pageObj = this.pageMap[route];
    if (pageObj) {
      try {
        contentArea.className = 'content-area full-width';
        contentArea.innerHTML = pageObj.render();
        // Special handling: measurement record tabs
        if (route === 'mr-entry' && pageObj === MeasurementRecord) {
          pageObj.activeTab = 'entry';
          pageObj.init();
        } else if (route === 'mr-history') {
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

    // 关闭面板
    var panel = document.getElementById('gHoverPanel');
    if (panel) panel.classList.remove('open');
    document.querySelectorAll('.g-left-item').forEach(function(i) { i.classList.remove('active'); });
    this._gCurrentMenu = null;

    this.renderSidebar();
    this.closeMobileSidebar();
  },

  navigateTo(mainId, subId, route, label) {
    this.currentMain = mainId;
    this.currentSub = subId || '';
    this.currentThird = '';

    const contentArea = document.getElementById('contentArea');
    const topbarTitle = document.getElementById('topbarTitle');
    if (!contentArea || !topbarTitle) return;

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
    var self = this;
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    var toggle = document.getElementById('menuToggle');

    function openSidebar() {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('show');
      toggle.setAttribute('aria-expanded', 'true');
    }
    function closeSidebar() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function() {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    // 点击遮罩层关闭
    if (overlay) {
      overlay.addEventListener('click', closeSidebar);
    }

    // 触摸滑动关闭：在 sidebar 上左滑关闭
    var touchStartX = 0;
    sidebar.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    sidebar.addEventListener('touchmove', function(e) {
      var deltaX = e.touches[0].clientX - touchStartX;
      if (deltaX < -30) {
        closeSidebar();
      }
    }, { passive: true });

    // 窗口大小变化时自动关闭
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        closeSidebar();
      }
    });
  },

  closeMobileSidebar() {
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar').classList.remove('open');
      var overlay = document.getElementById('sidebarOverlay');
      if (overlay) overlay.classList.remove('show');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
