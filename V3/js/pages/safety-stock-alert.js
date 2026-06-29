// ===== Safety Stock Alert Report Page =====
const SafetyStockAlert = {
  page: 1, pageSize: 15, filtered: [],

  // 从 materialData 查找物料类型（Z001-Z006 标准值域）
  _getMatTypeFromMaterialData(matCode) {
    if (!matCode || typeof materialData === 'undefined') return '';
    const m = materialData.find(x => x.code === matCode && x.deleteFlag !== 'D');
    if (m) return (m.materialType || '') + '-' + (m.materialTypeName || '');
    return '';
  },

  render() {

    this.filtered = this._buildAlertData();
    this.page = 1;
    return `
      <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
        <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
          <div><div style="font-size:18px;font-weight:700;">安全库存预警</div><div style="font-size:13px;opacity:0.8;">实时监控备品备件库存水位，及时预警缺货风险</div></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary" style="background:rgba(255,255,255,0.15);color:white;" onclick="SafetyStockAlert.reset()">刷新</button>
          </div>
        </div>
        <div class="filter-bar" style="flex-shrink:0;">
          <div class="filter-group"><label>工厂</label><select id="ssaFactory">
            <option value="">全部</option>
            <option value="1000">1000 (山东步长制药工厂)</option>
            <option value="2001">2001 (陕西步长制药工厂)</option>
            <option value="2002">2002 (山东丹红制药工厂)</option>
            <option value="2003">2003 (山东神州制药工厂)</option>
            <option value="2004">2004 (山东康爱制药工厂)</option>
            <option value="2005">2005 (通化谷红制药工厂)</option>
            <option value="2006">2006 (吉林天成制药工厂)</option>
            <option value="2007">2007 (通化天实制药工厂)</option>
          </select></div>
          <div class="filter-group"><label>物料</label><input type="text" id="ssaMatCode" placeholder="物料号或描述"></div>
          <div class="filter-group"><label>物料类型</label><select id="ssaMatType">
            <option value="">全部</option>
            <option value="Z001">Z001-成品</option>
            <option value="Z002">Z002-半成品</option>
            <option value="Z003">Z003-原材料</option>
            <option value="Z004">Z004-辅料</option>
            <option value="Z005">Z005-包装材料</option>
            <option value="Z006">Z006-耗材及其他</option>
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
              <th>工厂</th><th>物料</th><th>物料描述</th><th>物料类型</th><th>非限制库存</th><th>质检库存</th><th>冻结库存</th><th>安全库存</th><th>单位</th><th>库存安全线状态</th>
            </tr></thead>
            <tbody id="ssaTableBody"></tbody>
          </table>
        </div>
        <div class="list-toolbar" style="flex-shrink:0;">
          <div class="list-info">
            <span class="list-count" id="ssaCount">共 ${this.filtered.length} 条</span>

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
      row.matType = this._getMatTypeFromMaterialData(row.matCode);
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

    const fmtNum = n => n != null && n !== '' ? Number(n).toLocaleString() : '0';
    document.getElementById('ssaTableBody').innerHTML = page.map((row, idx) => {
      const isRed = row.status === 'red';
      return `<tr style="${isRed ? 'background:#fef2f2;' : ''}">
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

  search() {
    const factory = document.getElementById('ssaFactory').value;
    const matCode = document.getElementById('ssaMatCode').value.trim();
    const matType = document.getElementById('ssaMatType').value;
    const status = document.getElementById('ssaStatus').value;

    let data = this._buildAlertData();

    if (factory) data = data.filter(r => r.factory === factory);
    if (matCode) data = data.filter(r => r.matCode.includes(matCode) || r.matDesc.includes(matCode));
    if (matType) data = data.filter(r => r.matType && r.matType.startsWith(matType));
    if (status) data = data.filter(r => r.status === status);

    this.filtered = data;
    this.page = 1;
    this.renderTable();
  },

  reset() {
    document.getElementById('ssaFactory').value = '';
    document.getElementById('ssaMatCode').value = '';
    document.getElementById('ssaMatType').value = '';
    document.getElementById('ssaStatus').value = '';
    this.filtered = this._buildAlertData();
    this.page = 1;
    this.renderTable();
  },

  prevPage() { if (this.page > 1) { this.page--; this.renderTable(); } },
  nextPage() { if (this.page < Math.ceil(this.filtered.length / this.pageSize)) { this.page++; this.renderTable(); } },
  changePageSize() { this.pageSize = parseInt(document.getElementById('ssaPageSizeSel').value); this.page = 1; this.renderTable(); },

  exportData() {
    toast('数据导出功能开发中...');
  }
};
