// ===== Safety Stock Alert Report Page =====
const SafetyStockAlert = {
  page: 1, pageSize: 15, filtered: [], selected: [],

  // 物料类型映射（根据物料号前缀判断）
  _getMatType(matCode) {
    if (!matCode) return '';
    const prefix = matCode.substring(0, 6);
    const map = {
      '600010': '600-过滤器类', '600011': '600-过滤器类', '600012': '605-不锈钢制品类',
      '600006': '604-电器类',
      '100000': '成品药', '200000': '原料药-原材料类', '300000': '包材类',
      '400000': '冷链药品类', '500000': '原料药-中间体类', '600000': '608-备品备件类'
    };
    // 更精确的判断
    if (matCode.startsWith('600010') || matCode.startsWith('600011')) return '600-过滤器类';
    if (matCode.startsWith('6000108')) return '601-密封件类';
    if (matCode.startsWith('6000114') || matCode.startsWith('6000115')) return '601-密封件类';
    if (matCode.startsWith('600006')) return '604-电器类';
    if (matCode.startsWith('6000123')) return '602-接头管件类';
    if (matCode.startsWith('6000120')) return '603-仪表仪器类';
    if (matCode.startsWith('6000124') || matCode.startsWith('6000128')) return '603-仪表仪器类';
    if (matCode.startsWith('6000127')) return '605-不锈钢制品类';
    if (matCode.startsWith('100000')) return '成品药';
    if (matCode.startsWith('200000')) return '原料药-原材料类';
    if (matCode.startsWith('300000')) return '包材类';
    if (matCode.startsWith('400000')) return '冷链药品类';
    if (matCode.startsWith('500000')) return '原料药-中间体类';
    if (matCode.startsWith('600000')) return '608-备品备件类';
    return '';
  },

  render() {
    this.filtered = this._buildAlertData();
    this.page = 1;
    this.selected = [];
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,#d97706,#f59e0b);color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">安全库存预警</div><div style="font-size:13px;opacity:0.8;">实时监控备品备件库存水位，及时预警缺货风险</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary" style="background:rgba(255,255,255,0.15);color:white;" onclick="SafetyStockAlert.reset()">刷新</button>
            <button class="btn btn-blue" onclick="SafetyStockAlert.createPurchaseReq()">+ 创建采购申请</button>
          </div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>工厂</label><select id="ssaFactory">
            <option value="">全部</option>
            <option value="1000">1000 (山东寿光)</option>
            <option value="2000">2000 (江苏南通)</option>
            <option value="3000">3000 (浙江台州)</option>
          </select></div>
          <div class="filter-group"><label>物料</label><input type="text" id="ssaMatCode" placeholder="物料号或描述"></div>
          <div class="filter-group"><label>物料类型</label><select id="ssaMatType">
            <option value="">全部</option>
            <option value="600">600-过滤器类</option>
            <option value="601">601-密封件类</option>
            <option value="602">602-接头管件类</option>
            <option value="603">603-仪表仪器类</option>
            <option value="604">604-电器类</option>
            <option value="605">605-不锈钢制品类</option>
            <option value="606">606-实验室用品类</option>
            <option value="607">607-通用工具类</option>
            <option value="608">608-备品备件类</option>
            <option value="成品药">成品药</option>
            <option value="原料药">原料药-原材料类</option>
            <option value="包材">包材类</option>
            <option value="冷链">冷链药品类</option>
          </select></div>
          <div class="filter-group"><label>库存安全线状态</label><select id="ssaStatus">
            <option value="">全部</option>
            <option value="green">绿灯（库存充足）</option>
            <option value="red">红灯（库存不足）</option>
          </select></div>
          <div class="filter-actions">
            <button class="btn btn-primary btn-sm" onclick="SafetyStockAlert.search()">查询</button>
            <button class="btn btn-secondary btn-sm" onclick="SafetyStockAlert.reset()">重置</button>
          </div>
        </div>
        <!-- 统计卡片 -->
        <div style="display:flex;gap:16px;padding:16px 24px 0;flex-shrink:0;" id="ssaStats">
          ${this._renderStats(this.filtered)}
        </div>
        <div class="table-wrapper" style="flex:1;">
          <table class="data-table">
            <thead><tr>
              <th style="width:36px;text-align:center;"><input type="checkbox" onchange="SafetyStockAlert.toggleAll(this)" title="全选/取消全选"></th>
              <th>工厂</th><th>物料</th><th>物料描述</th><th>物料类型</th><th>非限制库存</th><th>质检库存</th><th>冻结库存</th><th>安全库存</th><th>单位</th><th>库存安全线状态</th>
            </tr></thead>
            <tbody id="ssaTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info">
            <span class="list-count" id="ssaCount">共 ${this.filtered.length} 条</span>
            <span id="ssaSelectedInfo" style="margin-left:12px;font-size:12px;color:var(--primary);${this.selected.length > 0 ? '' : 'display:none;'}">已选 ${this.selected.length} 条</span>
          </div>
          <div class="pagination">
            <button class="pagination-btn" id="ssaPrev" disabled onclick="SafetyStockAlert.prevPage()">‹</button>
            <span class="pagination-info" id="ssaPageInfo">第 1 / 1 页</span>
            <button class="pagination-btn" id="ssaNext" onclick="SafetyStockAlert.nextPage()">›</button>
            <select class="page-size-select" id="ssaPageSizeSel" onchange="SafetyStockAlert.changePageSize()"><option value="15">15条</option><option value="30">30条</option><option value="50">50条</option></select>
          </div>
        </div>
      </div>`;
  },

  _buildAlertData() {
    // 从 sparePartsStockData 聚合，补充安全库存字段
    const aggMap = new Map();
    sparePartsStockData.forEach(row => {
      const key = `${row.factory}|${row.matCode}`;
      if (!aggMap.has(key)) {
        aggMap.set(key, {
          factory: row.factory,
          matCode: row.matCode,
          matDesc: row.matDesc,
          unit: row.unit,
          unrestrictedQty: 0,
          qualityQty: 0,
          blockedQty: 0,
          safetyStock: this._getSafetyStock(row.matCode)
        });
      }
      const agg = aggMap.get(key);
      agg.unrestrictedQty += (row.unrestrictedQty || 0);
      agg.qualityQty += (row.qualityQty || 0);
      agg.blockedQty += (row.blockedQty || 0);
    });
    return [...aggMap.values()].map(row => {
      // 可用库存 = 非限制 + 质检（质检通过即可用）
      row.availableQty = row.unrestrictedQty + row.qualityQty;
      row.status = row.safetyStock > 0 && row.availableQty < row.safetyStock ? 'red' : 'green';
      row.matType = this._getMatType(row.matCode);
      // 缺货数量 = 安全库存 - 可用库存（仅当红灯时 > 0）
      row.shortfallQty = row.status === 'red' ? Math.max(0, row.safetyStock - row.availableQty) : 0;
      return row;
    });
  },

  _getSafetyStock(matCode) {
    // 安全库存 mock 数据（按物料号）
    const safetyStockMap = {
      '60001018': 50, '60001019': 60, '60001020': 40, '60001021': 30, '60001022': 45,
      '60001023': 50, '60001024': 35, '60001025': 55, '60001026': 48,
      '60001012': 20, '60001086': 100, '60001087': 80, '60001088': 90, '60001089': 500,
      '60001090': 1000, '60001146': 30, '60001147': 25,
      '60000655': 200, '60000656': 150, '60000657': 100,
      '60001128': 80, '60001129': 60, '60001131': 40, '60001132': 70,
      '60001238': 300, '60001271': 20, '60001272': 15, '60001249': 150, '60001207': 10, '60001281': 50,
      '10000009': 5000, '10000010': 3000, '10000011': 2000,
      '20000001': 100, '20000002': 80, '20000003': 60, '20000004': 50,
      '30000001': 20, '30000002': 100, '30000003': 40,
      '40000001': 100, '40000002': 500,
      '50000001': 30, '50000002': 20,
      '60000001': 15
    };
    return safetyStockMap[matCode] || 0;
  },

  _renderStats(data) {
    const green = data.filter(r => r.status === 'green').length;
    const red = data.filter(r => r.status === 'red').length;
    const total = data.length;
    return `
      <div style="flex:1;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 20px;display:flex;align-items:center;gap:12px;">
        <div style="width:40px;height:40px;background:#16a34a;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;color:white;">✓</div>
        <div><div style="font-size:22px;font-weight:700;color:#16a34a;">${green}</div><div style="font-size:12px;color:#15803d;">绿灯（库存充足）</div></div>
      </div>
      <div style="flex:1;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:14px 20px;display:flex;align-items:center;gap:12px;">
        <div style="width:40px;height:40px;background:#dc2626;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;color:white;">✗</div>
        <div><div style="font-size:22px;font-weight:700;color:#dc2626;">${red}</div><div style="font-size:12px;color:#991b1b;">红灯（库存不足）</div></div>
      </div>
      <div style="flex:1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 20px;display:flex;align-items:center;gap:12px;">
        <div style="width:40px;height:40px;background:#64748b;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;color:white;">Σ</div>
        <div><div style="font-size:22px;font-weight:700;color:#334155;">${total}</div><div style="font-size:12px;color:#64748b;">总计物料</div></div>
      </div>`;
  },

  _getStatusHtml(status) {
    if (status === 'green') {
      return '<span style="display:inline-flex;align-items:center;gap:4px;color:#16a34a;font-weight:600;"><span style="width:8px;height:8px;background:#16a34a;border-radius:50%;display:inline-block;"></span> 绿灯</span>';
    }
    return '<span style="display:inline-flex;align-items:center;gap:4px;color:#dc2626;font-weight:600;"><span style="width:8px;height:8px;background:#dc2626;border-radius:50%;display:inline-block;animation:pulse 1.5s infinite;"></span> 红灯</span>';
  },

  init() {
    this.filtered = this._buildAlertData();
    this.page = 1;
    this.selected = [];
    this.renderTable();
  },

  renderTable() {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.filtered.length / this.pageSize) || 1;

    document.getElementById('ssaCount').textContent = `共 ${this.filtered.length} 条`;
    document.getElementById('ssaPageInfo').textContent = `第 ${this.page} / ${totalPages} 页`;
    document.getElementById('ssaPrev').disabled = this.page <= 1;
    document.getElementById('ssaNext').disabled = this.page >= totalPages;
    if (document.getElementById('ssaPageSizeSel')) {
      document.getElementById('ssaPageSizeSel').value = this.pageSize;
    }

    // 更新统计卡片
    const statsEl = document.getElementById('ssaStats');
    if (statsEl) statsEl.innerHTML = this._renderStats(this.filtered);

    // 更新已选提示
    const selInfo = document.getElementById('ssaSelectedInfo');
    if (selInfo) {
      selInfo.textContent = `已选 ${this.selected.length} 条`;
      selInfo.style.display = this.selected.length > 0 ? '' : 'none';
    }

    const fmtNum = n => n != null && n !== '' ? Number(n).toLocaleString() : '0';
    document.getElementById('ssaTableBody').innerHTML = page.map((row, idx) => {
      const isRed = row.status === 'red';
      const globalIdx = start + idx;
      const isSelected = this.selected.includes(globalIdx);
      return `<tr style="${isRed ? 'background:#fef2f2;' : ''}">
        <td style="text-align:center;"><input type="checkbox" ${isSelected ? 'checked' : ''} onchange="SafetyStockAlert.toggleRow(${globalIdx}, this.checked)" ${!isRed ? 'disabled title="仅红灯物料可勾选创建采购申请"' : ''}></td>
        <td>${esc(row.factory)}</td>
        <td><strong style="color:var(--primary);">${esc(row.matCode)}</strong></td>
        <td>${esc(row.matDesc)}</td>
        <td>${esc(row.matType)}</td>
        <td style="text-align:right;color:#16a34a;font-weight:500;">${fmtNum(row.unrestrictedQty)}</td>
        <td style="text-align:right;color:#ca8a04;font-weight:500;">${fmtNum(row.qualityQty)}</td>
        <td style="text-align:right;color:#dc2626;font-weight:500;">${fmtNum(row.blockedQty)}</td>
        <td style="text-align:right;font-weight:600;${isRed ? 'color:#dc2626;' : 'color:#16a34a;'}">${fmtNum(row.safetyStock)}</td>
        <td style="text-align:center;">${esc(row.unit)}</td>
        <td style="text-align:center;">${this._getStatusHtml(row.status)}</td>
      </tr>`;
    }).join('');
  },

  toggleRow(globalIdx, checked) {
    if (checked) {
      if (!this.selected.includes(globalIdx)) this.selected.push(globalIdx);
    } else {
      this.selected = this.selected.filter(i => i !== globalIdx);
    }
    const selInfo = document.getElementById('ssaSelectedInfo');
    if (selInfo) {
      selInfo.textContent = `已选 ${this.selected.length} 条`;
      selInfo.style.display = this.selected.length > 0 ? '' : 'none';
    }
  },

  toggleAll(el) {
    const start = (this.page - 1) * this.pageSize;
    const page = this.filtered.slice(start, start + this.pageSize);
    if (el.checked) {
      // 只勾选红灯行
      page.forEach((row, idx) => {
        const globalIdx = start + idx;
        if (row.status === 'red' && !this.selected.includes(globalIdx)) {
          this.selected.push(globalIdx);
        }
      });
    } else {
      // 取消当前页所有勾选
      const pageIndices = page.map((_, idx) => start + idx);
      this.selected = this.selected.filter(i => !pageIndices.includes(i));
    }
    this.renderTable();
  },

  search() {
    const factory = document.getElementById('ssaFactory').value;
    const matCode = document.getElementById('ssaMatCode').value.trim();
    const matType = document.getElementById('ssaMatType').value;
    const status = document.getElementById('ssaStatus').value;

    let data = this._buildAlertData();

    if (factory) data = data.filter(r => r.factory === factory);
    if (matCode) data = data.filter(r => r.matCode.includes(matCode) || r.matDesc.includes(matCode));
    if (matType) data = data.filter(r => r.matType && r.matType.includes(matType));
    if (status) data = data.filter(r => r.status === status);

    this.filtered = data;
    this.selected = [];
    this.page = 1;
    this.renderTable();
  },

  reset() {
    document.getElementById('ssaFactory').value = '';
    document.getElementById('ssaMatCode').value = '';
    document.getElementById('ssaMatType').value = '';
    document.getElementById('ssaStatus').value = '';
    this.filtered = this._buildAlertData();
    this.selected = [];
    this.page = 1;
    this.renderTable();
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() { if (this.page < Math.ceil(this.filtered.length / this.pageSize)) { this.page++; this.renderTable(); } },
  changePageSize() { this.pageSize = parseInt(document.getElementById('ssaPageSizeSel').value); this.page = 1; this.renderTable(); },

  /**
   * 创建采购申请
   * 将勾选的红灯物料带到采购申请创建页面
   * 申请数量 = 安全库存 - 可用库存（缺货数量）
   */
  createPurchaseReq() {
    if (this.selected.length === 0) {
      toast('请先勾选需要采购的物料（仅红灯物料可选）');
      return;
    }

    // 收集勾选的物料数据
    const lines = this.selected.map(idx => {
      const row = this.filtered[idx];
      return {
        matCode: row.matCode,
        shortText: row.matDesc,
        reqQty: Math.max(1, row.shortfallQty || (row.safetyStock - row.availableQty)),
        unit: row.unit,
        matGroup: row.matCode.substring(0, 3),
        price: 0,
        totalValue: 0,
        status: 'N'
      };
    });

    // 存储到 sessionStorage，供采购申请页面读取
    sessionStorage.setItem('ssa_purchase_lines', JSON.stringify(lines));

    // 跳转到采购申请页面
    if (typeof App !== 'undefined' && App.pageMap && App.pageMap['sp-purchase']) {
      App.navigateTo('purchase-demand', 'sp-purchase', 'sp-purchase', '采购申请管理');
      // 延迟触发创建表单（等待页面渲染完成）
      setTimeout(() => {
        if (typeof SpPurchase !== 'undefined' && SpPurchase.openManualForm) {
          SpPurchase.openManualForm();
        }
      }, 300);
    } else {
      toast('跳转失败：采购申请页面未找到');
    }
  },

  exportData() {
    toast('数据导出功能开发中...');
  }
};
