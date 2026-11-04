/**
 * 留样规则（RetentionRule）— 质量管理 → 质量主数据 → 留样规则
 *
 * 物料维度的留样策略：是否留样、留样量、保存条件、保存期限规则、观察频次与次数。
 * 样品台账「留样登记」按本规则带出默认值；规则只描述"该留多久、观察几次"，不参与状态。
 */

const RetentionRule = {
  data: [
    { id: 'R01', plant: '2001', materialCode: 'MAT-10005', materialName: '布洛芬原料药', needSample: true, sampleQty: '0.500', unit: 'KG', storageCondition: '阴凉干燥处（≤25℃，RH≤60%）', keepRule: '有效期后 1 年', observeFreq: '每 12 个月', observeTimes: 3, enabled: true },
    { id: 'R02', plant: '2001', materialCode: 'MAT-20002', materialName: '布洛芬缓释胶囊', needSample: true, sampleQty: '2.000', unit: '盒', storageCondition: '密封、室温（10~30℃）', keepRule: '有效期后 1 年', observeFreq: '每 12 个月', observeTimes: 3, enabled: true },
    { id: 'R03', plant: '2001', materialCode: 'MAT-10009', materialName: '甘露醇辅料', needSample: true, sampleQty: '0.300', unit: 'KG', storageCondition: '密闭、干燥处', keepRule: '有效期后 6 个月', observeFreq: '每 12 个月', observeTimes: 2, enabled: true },
    { id: 'R04', plant: '2002', materialCode: 'MAT-30002', materialName: '丹红注射液', needSample: true, sampleQty: '4.000', unit: '支', storageCondition: '避光、阴凉处（2~8℃）', keepRule: '有效期后 1 年', observeFreq: '每 6 个月', observeTimes: 6, enabled: true },
    { id: 'R05', plant: '2002', materialCode: 'MAT-30003', materialName: '注射用水', needSample: false, sampleQty: '0.000', unit: 'L', storageCondition: '—', keepRule: '不留样', observeFreq: '—', observeTimes: 0, enabled: true },
    { id: 'R06', plant: '1000', materialCode: 'MAT-10006', materialName: '维生素C原料', needSample: true, sampleQty: '0.500', unit: 'KG', storageCondition: '避光、密封、干燥处', keepRule: '放行后 3 年', observeFreq: '每 12 个月', observeTimes: 3, enabled: true }
  ],

  plantOptions: [
    { code: '2001', name: '制剂工厂' },
    { code: '2002', name: '注射剂工厂' },
    { code: '1000', name: '原料工厂' }
  ],

  keepRuleOptions: ['有效期后 1 年', '有效期后 6 个月', '放行后 3 年'],
  freqOptions: ['每 12 个月', '每 6 个月', '每 3 个月'],

  // ==================== 页面骨架 ====================
  render() {
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);width:100%;overflow:hidden;">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div style="font-size:18px;font-weight:700;">留样规则</div>
          <button class="btn btn-sm" style="background:#fff;color:var(--primary);border:1px solid #fff;font-weight:600;"
            onclick="RetentionRule.openEdit()">+ 新增规则</button>
        </div>
        <div id="ruleFilterBar" style="flex-shrink:0;"></div>
        <div class="table-wrapper" id="ruleTableWrapper" style="flex:1;overflow:auto;width:100%;min-width:0;"></div>
      </div>`;
  },

  init() {
    this.renderFilterBar();
    if (window.QueryVariant) {
      QueryVariant.mount('retention-rule');
      QueryVariant.restore('retention-rule');
      QueryVariant.bindRecent('retention-rule');
    }
    this.renderTable();
  },

  _val(id) {
    const e = document.getElementById(id);
    return e ? String(e.value || '').trim() : '';
  },

  search() { this.renderTable(); },

  renderFilterBar() {
    const el = document.getElementById('ruleFilterBar');
    if (!el) return;
    const plantOpts = this.plantOptions.map(p => `<option value="${p.code}">${p.code} ${p.name}</option>`).join('');
    el.innerHTML = `<div class="filter-bar">
      <div class="filter-group"><label>工厂</label><select id="rulePlant"><option value="">全部</option>${plantOpts}</select></div>
      <div class="filter-group"><label>是否留样</label><select id="ruleNeed">
        <option value="">全部</option><option value="1">留样</option><option value="0">不留样</option>
      </select></div>
      <div class="filter-group"><label>物料</label><input type="text" id="ruleKeyword" placeholder="编码或名称"></div>
      ${FilterActions.render({ pageId: 'retention-rule', scope: 'RetentionRule', onExport: 'exportData' })}
    </div>`;
  },

  filtered() {
    const plant = this._val('rulePlant');
    const need = this._val('ruleNeed');
    const kw = this._val('ruleKeyword').toLowerCase();
    return this.data.filter(r => {
      if (plant && r.plant !== plant) return false;
      if (need === '1' && !r.needSample) return false;
      if (need === '0' && r.needSample) return false;
      if (kw && (r.materialCode + ' ' + r.materialName).toLowerCase().indexOf(kw) === -1) return false;
      return true;
    });
  },

  renderTable() {
    const el = document.getElementById('ruleTableWrapper');
    if (!el) return;
    const list = this.filtered();

    el.innerHTML = `<table class="data-table" style="min-width:1000px;">
      <thead><tr>
        <th style="width:120px;">工厂</th>
        <th style="width:120px;">物料编码</th>
        <th style="width:150px;">物料名称</th>
        <th style="width:80px;">是否留样</th>
        <th style="width:110px;">留样量</th>
        <th style="width:200px;">保存条件</th>
        <th style="width:130px;">保存期限规则</th>
        <th style="width:100px;">观察频次</th>
        <th style="width:80px;">观察次数</th>
        <th style="width:60px;">操作</th>
      </tr></thead>
      <tbody>${list.length ? list.map(r => this.renderRow(r)).join('')
        : '<tr><td colspan="10" class="empty-cell">暂无符合条件的留样规则</td></tr>'}</tbody>
    </table>`;
  },

  renderRow(r) {
    const plant = this.plantOptions.find(p => p.code === r.plant);
    return `<tr>
      <td style="font-size:12px;">${esc(r.plant)} ${esc(plant ? plant.name : '')}</td>
      <td style="font-family:monospace;font-size:12px;">${esc(r.materialCode)}</td>
      <td>${esc(r.materialName)}</td>
      <td>${r.needSample ? '<span class="badge badge-green">留样</span>' : '<span class="badge badge-gray">不留样</span>'}</td>
      <td style="font-size:12px;">${r.needSample ? esc(r.sampleQty) + ' ' + esc(r.unit) : '—'}</td>
      <td style="font-size:12px;">${esc(r.storageCondition)}</td>
      <td style="font-size:12px;">${esc(r.keepRule)}</td>
      <td style="font-size:12px;">${esc(r.observeFreq)}</td>
      <td style="font-size:12px;">${r.observeTimes ? r.observeTimes + ' 次' : '—'}</td>
      <td><div class="table-actions">
        <button class="btn btn-blue btn-sm" onclick="RetentionRule.openEdit('${r.id}')">编辑</button>
      </div></td>
    </tr>`;
  },

  // ==================== 新增 / 编辑规则 ====================
  openEdit(id) {
    const r = id ? this.data.find(x => x.id === id) : null;
    const v = k => (r ? r[k] : '');
    const plantOpts = this.plantOptions.map(p =>
      `<option value="${p.code}" ${r && r.plant === p.code ? 'selected' : ''}>${p.code} ${p.name}</option>`).join('');
    const keepOpts = this.keepRuleOptions.map(o =>
      `<option ${r && r.keepRule === o ? 'selected' : ''}>${o}</option>`).join('');
    const freqOpts = this.freqOptions.map(o =>
      `<option ${r && r.observeFreq === o ? 'selected' : ''}>${o}</option>`).join('');

    showModal(r ? '编辑留样规则' : '新增留样规则', `
      <div style="padding:4px 0;">
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px;">
          <div class="form-group"><label>工厂 <span class="req">*</span></label><select id="ruPlant">${plantOpts}</select></div>
          <div class="form-group"><label>物料编码 <span class="req">*</span></label><input type="text" id="ruCode" value="${esc(v('materialCode'))}" placeholder="如 MAT-10005"></div>
          <div class="form-group"><label>物料名称 <span class="req">*</span></label><input type="text" id="ruName" value="${esc(v('materialName'))}"></div>
          <div class="form-group"><label>是否留样</label><select id="ruNeed">
            <option value="1" ${!r || r.needSample ? 'selected' : ''}>留样</option>
            <option value="0" ${r && !r.needSample ? 'selected' : ''}>不留样</option>
          </select></div>
          <div class="form-group"><label>留样量</label><input type="text" id="ruQty" value="${esc(v('sampleQty') || '0.500')}"></div>
          <div class="form-group"><label>单位</label><input type="text" id="ruUnit" value="${esc(v('unit') || 'KG')}"></div>
          <div class="form-group"><label>保存条件</label><input type="text" id="ruCondition" value="${esc(v('storageCondition'))}"></div>
          <div class="form-group"><label>保存期限规则</label><select id="ruKeepRule">${keepOpts}</select></div>
          <div class="form-group"><label>观察频次</label><select id="ruFreq">${freqOpts}</select></div>
          <div class="form-group"><label>观察次数</label><input type="text" id="ruTimes" value="${esc(v('observeTimes') || 3)}"></div>
        </div>
      </div>`, [
      { text: '取消', cls: 'btn-secondary', action: closeModal },
      { text: '保存', cls: 'btn-primary', action: () => RetentionRule.save(id) }
    ], 'modal-md');
  },

  save(id) {
    const code = this._val('ruCode');
    const name = this._val('ruName');
    if (!code) return toast('请填写物料编码');
    if (!name) return toast('请填写物料名称');

    const needSample = this._val('ruNeed') === '1';
    const rec = {
      id: id || 'R' + String(this.data.length + 1).padStart(2, '0'),
      plant: this._val('ruPlant'),
      materialCode: code,
      materialName: name,
      needSample: needSample,
      sampleQty: needSample ? (this._val('ruQty') || '0.000') : '0.000',
      unit: this._val('ruUnit'),
      storageCondition: this._val('ruCondition') || '—',
      keepRule: needSample ? this._val('ruKeepRule') : '不留样',
      observeFreq: needSample ? this._val('ruFreq') : '—',
      observeTimes: needSample ? Number(this._val('ruTimes') || 0) : 0,
      enabled: true
    };

    if (id) {
      const idx = this.data.findIndex(x => x.id === id);
      if (idx > -1) this.data[idx] = rec;
    } else {
      this.data.unshift(rec);
    }
    closeModal();
    this.renderTable();
    toast(id ? '规则已更新' : '规则已新增');
  },

  // ==================== 导出 ====================
  exportData() {
    const head = ['工厂', '物料编码', '物料名称', '是否留样', '留样量', '单位', '保存条件', '保存期限规则', '观察频次', '观察次数'];
    const lines = this.filtered().map(r => [
      r.plant, r.materialCode, r.materialName, r.needSample ? '留样' : '不留样',
      r.sampleQty, r.unit, r.storageCondition, r.keepRule, r.observeFreq, r.observeTimes
    ]);
    if (!lines.length) return toast('无数据可导出');

    const csv = '\uFEFF' + [head.join(',')].concat(lines.map(row => row.map(c => {
      const t = String(c == null ? '' : c);
      return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
    }).join(','))).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = '留样规则_' + new Date().toISOString().substring(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('已导出 ' + lines.length + ' 条');
  }
};

// 查询变式注册
if (window.QueryVariant) {
  QueryVariant.register({
    pageId: 'retention-rule',
    fields: ['rulePlant', 'ruleNeed', 'ruleKeyword'],
    textFields: ['ruleKeyword'],
    labels: { rulePlant: '工厂', ruleNeed: '是否留样', ruleKeyword: '物料' },
    onApply: function () { RetentionRule.search(); }
  });
}
