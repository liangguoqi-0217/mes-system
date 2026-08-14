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
        return { ok:true, reservationNo: '1' + randomDigits(9) };
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
     * 修改批次特性（模拟 SAP 批次特性维护）
     * @param {Object} payload { batchNo, materialCode, reason, changes:[{charCode,charName,unit,oldValue,newValue}] }
     * @returns {Promise<{ok:true, logNo:string, changeBy:string, changeTime:string}>}
     * @rejects {Promise<{ok:false, code:string, message:string}>}
     */
    changeBatchChar(payload) {
      return delay(800).then(function () {
        if (Math.random() < 0.06) {
          return Promise.reject({ ok:false, code:'SAP_ERR', message:'SAP 批次特性修改失败：批次 ' + (payload.batchNo || '') + ' 已被锁定或被其他用户占用，请稍后重试。' });
        }
        const now = new Date();
        const pad = function (n) { return String(n).padStart(2, '0'); };
        const changeTime = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) +
          ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes());
        return {
          ok:true,
          logNo: 'BCL-' + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + '-' + randomDigits(3),
          changeBy: '当前用户',
          changeTime
        };
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

  window.SAP_MOCK = SAP_MOCK;
})();
