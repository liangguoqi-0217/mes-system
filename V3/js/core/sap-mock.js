/* ============================================================
 * sap-mock.js — SAP 接口模拟层（预留单 / 物料凭证）
 * ------------------------------------------------------------
 * 业务规则：MES 创建/修改预留单时，必须先调用 SAP 接口并等待其
 * 反馈（预留编号 / 成功结果），MES 才将信息写入本地自建表；
 * 过账同样需 SAP 返回物料凭证号后 MES 才更新本地状态。
 *
 * 对接真实后端时，仅需替换本模块内部实现（保持方法签名不变）。
 * ============================================================ */
(function () {
  function delay(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function randomDigits(len) {
    let s = '';
    for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 10);
    return s;
  }

  /**
   * 生成 SAP 预留编号
   * 号码段：0000000001 ~ 8999999999（10 位数字，不足前补零）
   */
  function randomReservationNo() {
    const num = 1 + Math.floor(Math.random() * 8999999999);
    return String(num).padStart(10, '0');
  }

  const SAP_MOCK = {

    /**
     * 创建预留单（模拟 SAP BAPI_RESERVATION_CREATE）
     * @param {Object} payload { plant, moveType, issueLocation, targetLocation,
     *                          internalOrderNo, costCenter, processOrderNo, lines:[] }
     * @returns {Promise<{ok:true, reservationNo:string}>}
     * @rejects {Promise<{ok:false, code:string, message:string}>}
     */
    createReservation(payload) {
      return delay(900).then(function () {
        // 模拟约 12% 概率失败，用于演示 SAP 报错与重试流程
        if (Math.random() < 0.12) {
          return Promise.reject({ ok:false, code:'SAP_ERR', message:'SAP 系统繁忙，预留单创建未成功，请稍后重试。' });
        }
        return { ok:true, reservationNo: randomReservationNo() };
      });
    },

    /**
     * 修改预留单（模拟 SAP BAPI_RESERVATION_CHANGE）
     * @param {string} reservationNo 预留编号
     * @param {Object} payload 修改后的预留数据
     * @returns {Promise<{ok:true}>}
     * @rejects {Promise<{ok:false, code:string, message:string}>}
     */
    updateReservation(reservationNo, payload) {
      return delay(800).then(function () {
        if (Math.random() < 0.1) {
          return Promise.reject({ ok:false, code:'SAP_ERR', message:'SAP 修改预留 ' + reservationNo + ' 失败，请稍后重试。' });
        }
        return { ok:true };
      });
    },

    /**
     * 过账 / 发货（模拟 SAP MIGO 移动类型过账，返回物料凭证号）
     * @param {Object} payload { reservationNo, moveType, issueLocation, targetLocation,
     *                          materialCode, materialName, qty, unit, batch, ... }
     * @returns {Promise<{ok:true, materialDocNo:string}>}
     * @rejects {Promise<{ok:false, code:string, message:string}>}
     */
    postGoodsMovement(payload) {
      return delay(800).then(function () {
        if (Math.random() < 0.08) {
          return Promise.reject({ ok:false, code:'SAP_ERR', message:'过账失败：移动类型 ' + (payload.moveType || '') + ' 对物料 ' + (payload.materialCode || '') + ' 不允许，请联系 SAP 管理员。' });
        }
        return { ok:true, materialDocNo: '49' + randomDigits(8) };
      });
    },

    /**
     * 查询批次特性（模拟 SAP 批次特性读取 BAPI：输入 工厂/物料/批次 精准查找）
     * 说明：数据完全由 SAP 侧维护，MES 不落库；同一物料批次唯一，返回单个批次。
     * @param {Object} payload { factory, materialCode, batchNo }
     * @returns {Promise<{ok:true, data:{batchNo,materialCode,materialName,factory,location,chars}}>}
     * @rejects {Promise<{ok:false, code:string, message:string}>}
     */
    getBatchChars(payload) {
      const me = this;
      return delay(700).then(function () {
        const factory = String(payload.factory || '').trim();
        const materialCode = String(payload.materialCode || '').trim();
        const batchNo = String(payload.batchNo || '').trim();
        if (!factory || !materialCode || !batchNo) {
          return Promise.reject({ ok:false, code:'PARAM_ERR', message:'查询参数不完整：工厂、物料、批次均为必填项。' });
        }
        const d = me._batchCharDb.find(function (b) {
          return b.factory === factory && b.materialCode === materialCode && b.batchNo === batchNo;
        });
        if (!d) {
          return Promise.reject({ ok:false, code:'NOT_FOUND', message:'未查询到该物料批次的特性数据，请检查工厂/物料/批次后重试。' });
        }
        return { ok:true, data: {
          batchNo: d.batchNo, materialCode: d.materialCode, materialName: d.materialName,
          factory: d.factory, location: d.location,
          chars: d.chars.map(function (c) {
            return { charCode: c.charCode, charName: c.charName, charValue: c.charValue, unit: c.unit };
          })
        } };
      });
    },

    /**
     * 修改批次特性（模拟 SAP 批次特性维护，成功后 SAP 侧更新特性值并生成修改记录）
     * @param {Object} payload { factory, batchNo, materialCode, materialName, changes:[{charCode,charName,unit,oldValue,newValue}] }
     * @returns {Promise<{ok:true, logNo:string, changeBy:string, changeTime:string, changedCount:number}>}
     * @rejects {Promise<{ok:false, code:string, message:string}>}
     */
    changeBatchChar(payload) {
      const me = this;
      return delay(800).then(function () {
        if (Math.random() < 0.06) {
          return Promise.reject({ ok:false, code:'SAP_ERR', message:'SAP 批次特性修改失败：批次 ' + (payload.batchNo || '') + ' 已被锁定或被其他用户占用，请稍后重试。' });
        }
        const now = new Date();
        const pad = function (n) { return String(n).padStart(2, '0'); };
        const changeTime = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) +
          ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes());
        const logNo = 'BCL-' + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + '-' + randomDigits(3);
        const changes = payload.changes || [];
        // SAP 侧更新批次特性当前值
        const batch = me._batchCharDb.find(function (b) { return b.batchNo === payload.batchNo && b.materialCode === payload.materialCode; });
        if (batch) {
          changes.forEach(function (ch) {
            const c = batch.chars.find(function (x) { return x.charCode === ch.charCode; });
            if (c) c.charValue = ch.newValue;
          });
          batch.updateBy = '当前用户';
          batch.updateTime = changeTime;
        }
        // SAP 侧生成修改记录
        changes.forEach(function (ch) {
          me._batchCharLogDb.unshift({
            logNo: logNo + '-' + String(me._batchCharLogDb.length + 1).padStart(3, '0'),
            batchNo: payload.batchNo,
            materialCode: payload.materialCode,
            charCode: ch.charCode, charName: ch.charName, unit: ch.unit || '',
            oldValue: ch.oldValue, newValue: ch.newValue,
            changeBy: '当前用户', changeTime: changeTime, reason: ''
          });
        });
        return {
          ok:true,
          logNo: logNo,
          changeBy: '当前用户',
          changeTime: changeTime,
          changedCount: changes.length
        };
      });
    },

    /**
     * 查询批次特性修改记录（模拟 SAP 读取修改历史）
     * @param {Object} payload { batch, char, by, date }
     * @returns {Promise<{ok:true, list:Array, total:number}>}
     */
    getBatchCharLogs(payload) {
      const me = this;
      return delay(600).then(function () {
        const p = payload || {};
        const batch = String(p.batch || '').trim();
        const ch = String(p.char || '').trim();
        const by = String(p.by || '').trim();
        const date = String(p.date || '').trim();
        const list = me._batchCharLogDb.filter(function (r) {
          if (batch && !r.batchNo.includes(batch)) return false;
          if (ch && !(r.charName.includes(ch) || r.charCode.includes(ch))) return false;
          if (by && !r.changeBy.includes(by)) return false;
          if (date && !r.changeTime.startsWith(date)) return false;
          return true;
        });
        return { ok:true, list: list, total: me._batchCharLogDb.length };
      });
    },

    /**
     * 冲销物料凭证（模拟 SAP MIGO 冲销，移动类型自动映射反向）
     * @param {Object} payload { materialDocNo, sourceType, sourceDocNo, reverseMoveType,
     *                          materialCode, materialName, qty, unit, batch, factory, location, reason }
     * @returns {Promise<{ok:true, reversalDocNo:string, reverseMoveType:string}>}
     * @rejects {Promise<{ok:false, code:string, message:string}>}
     */
    reverseGoodsMovement(payload) {
      return delay(900).then(function () {
        if (Math.random() < 0.08) {
          return Promise.reject({ ok:false, code:'SAP_ERR', message:'冲销失败：物料凭证 ' + (payload.materialDocNo || '') + ' 已存在冲销记录或不允许冲销，请联系 SAP 管理员。' });
        }
        return {
          ok:true,
          reversalDocNo: '49' + randomDigits(8),
          reverseMoveType: payload.reverseMoveType
        };
      });
    },

    /* ---------- 全局 loading 遮罩 ---------- */
    showLoading(text) {
      let el = document.getElementById('sapLoadingLayer');
      if (!el) {
        el = document.createElement('div');
        el.id = 'sapLoadingLayer';
        el.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(15,23,42,0.45);backdrop-filter:blur(3px);';
        el.innerHTML =
          '<div style="width:46px;height:46px;border:3px solid rgba(255,255,255,0.25);border-top-color:#ffffff;border-radius:50%;animation:sapSpin .9s linear infinite;"></div>' +
          '<div style="margin-top:18px;color:#ffffff;font-size:14px;font-weight:600;letter-spacing:1px;">' + (text || '正在与 SAP 同步，请等待…') + '</div>' +
          '<style>@keyframes sapSpin{to{transform:rotate(360deg)}}</style>';
        document.body.appendChild(el);
      }
      el.style.display = 'flex';
    },

    hideLoading() {
      const el = document.getElementById('sapLoadingLayer');
      if (el) el.style.display = 'none';
    }
  };

  /* ------------------------------------------------------------
   * 批次特性数据（SAP 内部维护，MES 不落库，仅通过接口访问）
   * ------------------------------------------------------------ */
  SAP_MOCK._batchCharDb = [
    {
      batchNo: 'B260601', materialCode: 'M10001', materialName: '黄芩提取物',
      factory: '1000', location: 'A01原料仓',
      updateBy: '刘敏', updateTime: '2026-07-03 10:26',
      chars: [
        { charCode: 'CHAR01', charName: '黄芩苷含量', charValue: '92.5', unit: '%' },
        { charCode: 'CHAR02', charName: '水分', charValue: '4.2', unit: '%' },
        { charCode: 'CHAR03', charName: '粒度（通过100目）', charValue: '96.0', unit: '%' },
        { charCode: 'CHAR04', charName: '性状', charValue: '棕黄色粉末', unit: '' },
        { charCode: 'CHAR05', charName: '灰分', charValue: '3.1', unit: '%' }
      ]
    },
    {
      batchNo: 'B260602', materialCode: 'M10012', materialName: '药用淀粉',
      factory: '1000', location: 'A01原料仓',
      updateBy: '王芳', updateTime: '2026-07-05 14:02',
      chars: [
        { charCode: 'CHAR01', charName: '干燥失重', charValue: '11.8', unit: '%' },
        { charCode: 'CHAR02', charName: 'pH值', charValue: '5.6', unit: '' },
        { charCode: 'CHAR03', charName: '粒度', charValue: '合格', unit: '' },
        { charCode: 'CHAR04', charName: '性状', charValue: '白色粉末', unit: '' }
      ]
    },
    {
      batchNo: 'B260607', materialCode: 'M10001', materialName: '黄芩提取物',
      factory: '1000', location: 'B01线边仓',
      updateBy: '赵磊', updateTime: '2026-07-21 09:15',
      chars: [
        { charCode: 'CHAR01', charName: '黄芩苷含量', charValue: '91.8', unit: '%' },
        { charCode: 'CHAR02', charName: '水分', charValue: '4.5', unit: '%' },
        { charCode: 'CHAR03', charName: '粒度（通过100目）', charValue: '95.2', unit: '%' },
        { charCode: 'CHAR04', charName: '性状', charValue: '棕黄色粉末', unit: '' },
        { charCode: 'CHAR05', charName: '灰分', charValue: '3.4', unit: '%' }
      ]
    },
    {
      batchNo: 'B260608', materialCode: 'M10018', materialName: '硬脂酸镁',
      factory: '2001', location: 'A02辅料仓',
      updateBy: '张伟', updateTime: '2026-07-10 16:40',
      chars: [
        { charCode: 'CHAR01', charName: '含量', charValue: '98.6', unit: '%' },
        { charCode: 'CHAR02', charName: '干燥失重', charValue: '3.8', unit: '%' },
        { charCode: 'CHAR03', charName: '粒度（通过200目）', charValue: '92.0', unit: '%' },
        { charCode: 'CHAR04', charName: '性状', charValue: '白色疏松粉末', unit: '' }
      ]
    },
    {
      batchNo: 'B250812', materialCode: 'M20015', materialName: '乳糖（药用）',
      factory: '1000', location: 'A02辅料仓',
      updateBy: '刘敏', updateTime: '2026-07-08 11:20',
      chars: [
        { charCode: 'CHAR01', charName: '含量', charValue: '99.2', unit: '%' },
        { charCode: 'CHAR02', charName: '水分', charValue: '4.9', unit: '%' },
        { charCode: 'CHAR03', charName: '比旋度', charValue: '+52.3', unit: '°' },
        { charCode: 'CHAR04', charName: '性状', charValue: '白色结晶性粉末', unit: '' }
      ]
    },
    {
      batchNo: 'P260610', materialCode: 'F50001', materialName: '脑心通胶囊 0.4g*36粒',
      factory: '1000', location: 'C02成品暂存间',
      updateBy: '王芳', updateTime: '2026-07-11 15:30',
      chars: [
        { charCode: 'CHAR01', charName: '含量测定', charValue: '98.7', unit: '%' },
        { charCode: 'CHAR02', charName: '崩解时限', charValue: '18', unit: 'min' },
        { charCode: 'CHAR03', charName: '装量差异', charValue: '合格', unit: '' },
        { charCode: 'CHAR04', charName: '微生物限度', charValue: '合格', unit: '' },
        { charCode: 'CHAR05', charName: '性状', charValue: '内容物为棕黄色粉末', unit: '' }
      ]
    },
    {
      batchNo: 'P260618', materialCode: 'F50021', materialName: '稳心颗粒 5g*9袋',
      factory: '2002', location: 'C01暂存间',
      updateBy: '赵磊', updateTime: '2026-07-19 10:05',
      chars: [
        { charCode: 'CHAR01', charName: '含量测定', charValue: '99.1', unit: '%' },
        { charCode: 'CHAR02', charName: '粒度', charValue: '合格', unit: '' },
        { charCode: 'CHAR03', charName: '溶化性', charValue: '合格', unit: '' },
        { charCode: 'CHAR04', charName: '微生物限度', charValue: '合格', unit: '' },
        { charCode: 'CHAR05', charName: '性状', charValue: '棕黄色颗粒', unit: '' }
      ]
    }
  ];

  SAP_MOCK._batchCharLogDb = [
    {
      logNo: 'BCL-20260703-001', batchNo: 'B260601', materialCode: 'M10001',
      charCode: 'CHAR01', charName: '黄芩苷含量', unit: '%',
      oldValue: '91.8', newValue: '92.5', changeBy: '刘敏', changeTime: '2026-07-03 10:26',
      reason: '复检结果更新'
    },
    {
      logNo: 'BCL-20260705-001', batchNo: 'B260602', materialCode: 'M10012',
      charCode: 'CHAR02', charName: 'pH值', unit: '',
      oldValue: '5.8', newValue: '5.6', changeBy: '王芳', changeTime: '2026-07-05 14:02',
      reason: '检验数据修正'
    },
    {
      logNo: 'BCL-20260708-001', batchNo: 'B250812', materialCode: 'M20015',
      charCode: 'CHAR02', charName: '水分', unit: '%',
      oldValue: '5.2', newValue: '4.9', changeBy: '刘敏', changeTime: '2026-07-08 11:20',
      reason: '仓库复检结果更新'
    },
    {
      logNo: 'BCL-20260710-001', batchNo: 'B260608', materialCode: 'M10018',
      charCode: 'CHAR03', charName: '粒度（通过200目）', unit: '%',
      oldValue: '90.5', newValue: '92.0', changeBy: '张伟', changeTime: '2026-07-10 16:40',
      reason: '第三方检测报告确认'
    },
    {
      logNo: 'BCL-20260711-001', batchNo: 'P260610', materialCode: 'F50001',
      charCode: 'CHAR01', charName: '含量测定', unit: '%',
      oldValue: '98.2', newValue: '98.7', changeBy: '王芳', changeTime: '2026-07-11 15:30',
      reason: '成品检验放行数据'
    },
    {
      logNo: 'BCL-20260719-001', batchNo: 'P260618', materialCode: 'F50021',
      charCode: 'CHAR02', charName: '粒度', unit: '',
      oldValue: '不合格', newValue: '合格', changeBy: '赵磊', changeTime: '2026-07-19 10:05',
      reason: '重新取样检验合格'
    }
  ];

  window.SAP_MOCK = SAP_MOCK;
})();
