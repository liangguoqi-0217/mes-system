// ===== 维修知识库模块 =====
// 维修知识库：故障案例、维修方案、经验分享
const MaintenanceKnowledge = {
  page: 1, pageSize: 10, filtered: [],
  _editingId: null,
  _activeTab: 'case', // case | solution | experience
  _editData: null,

  _isAdmin() {
    return (window.currentUserRole || 'admin') === 'admin';
  },

  /* ========== Render ========== */
  render() {
    const createBtn = this._isAdmin()
      ? '<button class="btn btn-blue" onclick="MaintenanceKnowledge.createModal()">+ 新建知识</button>'
      : '';
    return `
    <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <div><div style="font-size:18px;font-weight:700;">维修知识库</div><div style="font-size:13px;opacity:0.8;">故障案例 | 维修方案 | 经验分享</div></div>
        <div style="display:flex;gap:8px;">${createBtn}</div>
      </div>
      <div style="display:flex;gap:0;padding:8px 24px;background:white;border-bottom:1px solid var(--border);flex-shrink:0;">
        <button onclick="MaintenanceKnowledge.switchTab('case')" id="mkTabCase" style="padding:8px 18px;border:none;background:${this._activeTab==='case'?'var(--primary)':'transparent'};color:${this._activeTab==='case'?'white':'var(--text-secondary)'};border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s;margin-right:6px;">故障案例</button>
        <button onclick="MaintenanceKnowledge.switchTab('solution')" id="mkTabSolution" style="padding:8px 18px;border:none;background:${this._activeTab==='solution'?'var(--primary)':'transparent'};color:${this._activeTab==='solution'?'white':'var(--text-secondary)'};border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s;margin-right:6px;">维修方案</button>
        <button onclick="MaintenanceKnowledge.switchTab('experience')" id="mkTabExperience" style="padding:8px 18px;border:none;background:${this._activeTab==='experience'?'var(--primary)':'transparent'};color:${this._activeTab==='experience'?'white':'var(--text-secondary)'};border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s;">经验分享</button>
      </div>
      <div class="filter-bar" style="flex-shrink:0;">
        <div class="filter-group"><label>关键词</label><input type="text" id="mkKeyword" placeholder="搜索标题/内容"></div>
        <div class="filter-group"><label>设备类型</label><input type="text" id="mkEqType" placeholder="设备类型"></div>
        <div class="filter-group"><label>故障类型</label><select id="mkFaultType">
          <option value="">全部</option><option value="机械">机械</option><option value="电气">电气</option><option value="液压">液压</option><option value="气动">气动</option><option value="软件">软件</option>
        </select></div>
        <div class="filter-actions">
          <button class="btn btn-primary btn-sm" onclick="MaintenanceKnowledge.search()">查询</button>
          <button class="btn btn-secondary btn-sm" onclick="MaintenanceKnowledge.reset()">重置</button>
        </div>
      </div>
      <div class="table-wrapper" style="flex:1;overflow-y:auto;padding:16px 24px;">
        ${this._activeTab === 'case' ? this.renderCaseList() : this._activeTab === 'solution' ? this.renderSolutionList() : this.renderExperienceList()}
      </div>
    </div>`;
  },

  init() {
    this.page = 1;
    this._activeTab = 'case';
  },

  switchTab(tab) {
    this._activeTab = tab;
    this.page = 1;
    const contentArea = document.getElementById('contentArea');
    if (contentArea) contentArea.innerHTML = this.render();
    this.bindEvents();
  },

  search() {
    this.page = 1;
    const contentArea = document.getElementById('contentArea');
    if (contentArea) contentArea.innerHTML = this.render();
    this.bindEvents();
  },

  reset() {
    this.page = 1;
    const keyword = document.getElementById('mkKeyword');
    const eqType = document.getElementById('mkEqType');
    const faultType = document.getElementById('mkFaultType');
    if (keyword) keyword.value = '';
    if (eqType) eqType.value = '';
    if (faultType) faultType.value = '';
    const contentArea = document.getElementById('contentArea');
    if (contentArea) contentArea.innerHTML = this.render();
    this.bindEvents();
  },

  renderCaseList() {
    const cases = this.getCaseData();
    if (!cases || cases.length === 0) {
      return '<div style="text-align:center;padding:60px;color:var(--text-muted);">暂无故障案例数据</div>';
    }
    let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;">';
    cases.forEach(item => {
      html += `
        <div style="background:white;border:1px solid var(--border);border-radius:10px;padding:16px;cursor:pointer;hover:shadow;" onclick="MaintenanceKnowledge.viewDetail('${item.id}')">
          <div style="font-weight:700;font-size:15px;margin-bottom:8px;color:var(--primary);">${esc(item.title || '')}</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px;"><strong>设备：</strong>${esc(item.equipment || '')}</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px;"><strong>故障类型：</strong>${esc(item.faultType || '')}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">${esc(item.description || '').substring(0, 80)}...</div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--text-muted);">
            <span>${esc(item.createdBy || '')} | ${esc(item.createdAt || '')}</span>
            <span style="background:var(--primary-light);color:white;padding:2px 8px;border-radius:4px;font-size:11px;">查看详情</span>
          </div>
        </div>`;
    });
    html += '</div>';
    return html;
  },

  renderSolutionList() {
    const solutions = this.getSolutionData();
    if (!solutions || solutions.length === 0) {
      return '<div style="text-align:center;padding:60px;color:var(--text-muted);">暂无维修方案数据</div>';
    }
    let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;">';
    solutions.forEach(item => {
      html += `
        <div style="background:white;border:1px solid var(--border);border-radius:10px;padding:16px;cursor:pointer;" onclick="MaintenanceKnowledge.viewSolution('${item.id}')">
          <div style="font-weight:700;font-size:15px;margin-bottom:8px;color:var(--success);">${esc(item.title || '')}</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px;"><strong>适用设备：</strong>${esc(item.equipment || '')}</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px;"><strong>维修时长：</strong>${esc(item.duration || '')}小时</div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">${esc(item.summary || '').substring(0, 80)}...</div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--text-muted);">
            <span>使用次数：${item.usageCount || 0}</span>
            <span style="background:var(--success);color:white;padding:2px 8px;border-radius:4px;font-size:11px;">查看方案</span>
          </div>
        </div>`;
    });
    html += '</div>';
    return html;
  },

  renderExperienceList() {
    const experiences = this.getExperienceData();
    if (!experiences || experiences.length === 0) {
      return '<div style="text-align:center;padding:60px;color:var(--text-muted);">暂无经验分享数据</div>';
    }
    let html = '';
    experiences.forEach(item => {
      html += `
        <div style="background:white;border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <div style="font-weight:700;font-size:16px;color:var(--warning);">${esc(item.title || '')}</div>
            <div style="font-size:12px;color:var(--text-muted);">${esc(item.createdAt || '')}</div>
          </div>
          <div style="font-size:14px;color:var(--text-primary);line-height:1.6;margin-bottom:12px;">${esc(item.content || '')}</div>
          <div style="display:flex;gap:16px;font-size:13px;color:var(--text-secondary);">
            <span><strong>分享人：</strong>${esc(item.author || '')}</span>
            <span><strong>点赞：</strong>${item.likes || 0}</span>
            <span><strong>评论：</strong>${item.comments || 0}</span>
          </div>
        </div>`;
    });
    return html;
  },

  getCaseData() {
    // 示例数据
    return [
      { id: 'CASE-001', title: '主轴轴承异响故障处理', equipment: 'CNC-001', faultType: '机械', description: '主轴在高速运转时出现异响，经检查发现轴承磨损严重，需要更换轴承并重新调整预紧力。', createdBy: '张三', createdAt: '2026-01-15' },
      { id: 'CASE-002', title: '伺服电机过载报警', equipment: 'ROBOT-002', faultType: '电气', description: '机器人伺服电机频繁出现过载报警，检查后发现驱动器参数设置不当，调整加减速时间后恢复正常。', createdBy: '李四', createdAt: '2026-02-20' },
      { id: 'CASE-003', title: '液压系统压力不稳定', equipment: 'PRESS-003', faultType: '液压', description: '液压机工作压力波动较大，排查发现溢流阀阀芯卡滞，清洗后故障排除。', createdBy: '王五', createdAt: '2026-03-10' }
    ];
  },

  getSolutionData() {
    // 示例数据
    return [
      { id: 'SOL-001', title: 'CNC主轴轴承更换标准作业程序', equipment: 'CNC系列', duration: 4, summary: '详细描述了CNC机床主轴轴承的更换步骤、所需工具和注意事项，包括拆卸、清洗、安装、调试等完整流程。', usageCount: 15 },
      { id: 'SOL-002', title: '机器人伺服系统故障诊断流程', equipment: '机器人系列', duration: 2, summary: '系统化的机器人伺服故障诊断方法，包括报警代码解读、信号检测、参数检查等步骤。', usageCount: 8 },
      { id: 'SOL-003', title: '液压系统泄漏快速定位方法', equipment: '液压设备', duration: 1.5, summary: '介绍了液压系统泄漏的常用检测方法，包括目视检查、压力测试、超声波检测等技术。', usageCount: 12 }
    ];
  },

  getExperienceData() {
    // 示例数据
    return [
      { id: 'EXP-001', title: '分享：如何预防CNC导轨磨损', content: '通过定期润滑、保持清洁、控制加工负荷等措施，可以有效延长CNC导轨的使用寿命。建议每3个月进行一次导轨精度检测...', author: '赵工', createdAt: '2026-04-05', likes: 23, comments: 5 },
      { id: 'EXP-002', title: '经验：机器人保养周期优化建议', content: '根据实际运行数据，我们发现将机器人保养周期从6个月调整为4个月后，故障率下降了40%。关键是要加强关节部位的润滑检查...', author: '钱工', createdAt: '2026-04-12', likes: 18, comments: 3 }
    ];
  },

  viewDetail(id) {
    alert('查看案例详情：' + id + '\n\n功能开发中...');
  },

  viewSolution(id) {
    alert('查看维修方案：' + id + '\n\n功能开发中...');
  },

  createModal() {
    alert('新建知识\n\n功能开发中...');
  },

  bindEvents() {
    // 绑定事件
  }
};
