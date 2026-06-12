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
    this.menu.forEach(item => {
      html += this.renderMenuItem(item, 0);
    });
    nav.innerHTML = html;
  },

  renderMenuItem(item, depth) {
    if (item.type === 'link') {
      const isActive = this.currentMain === item.id;
      return `<div class="nav-item">
        <div class="nav-header ${isActive?'active':''}" onclick="App.navigateTo('${item.id}','','${item.route}','${item.label}')">
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
    if (!contentArea || !topbarTitle) return;

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
