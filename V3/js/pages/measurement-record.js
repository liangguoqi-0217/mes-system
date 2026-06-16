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
        <a href="javascript:void(0)" onclick="App.navigateTo('device-management','measurement-point','measurement-point','测量点定义')" style="color:var(--primary-lighter);margin-top:8px;display:inline-block;">→ 前往定义测量点</a>
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
