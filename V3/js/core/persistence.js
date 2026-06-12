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
