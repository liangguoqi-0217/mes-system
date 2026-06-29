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
          <td><a href="javascript:void(0)" onclick="App.navigateTo('device-management','equipment-master','equipment-master','设备主数据')" style="color:var(--primary-lighter);">${esc(mp.equipmentName)}</a><br><span style="font-size:11px;color:var(--text-muted);">${esc(mp.equipmentCode)}</span></td>
          <td>${typeBadge}</td>
          <td>${mp.unit || '—'}</td>
          <td style="${mp.upperLimit !== null && mp.alarmEnabled ? 'color:#dc2626;font-weight:600;' : ''}">${upperStr}</td>
          <td style="${mp.lowerLimit !== null && mp.alarmEnabled ? 'color:#dc2626;font-weight:600;' : ''}">${lowerStr}</td>
          <td>${alarmBadge}</td>
          <td>${counterBadge}</td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="MeasurementPoint.viewDetail('${mp.id}')">查看</button>
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
