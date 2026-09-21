// 临时验证脚本：验证库存查询三档聚合逻辑与红绿灯计算（运行后删除）
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, 'V3', 'js', 'pages', 'spare-parts-stock.js'), 'utf8');
const ctx = {};
vm.createContext(ctx);
try {
  new vm.Script(code).runInContext(ctx);
} catch (e) {
  console.error('LOAD FAILED:', e.message);
  process.exit(1);
}

const out = vm.runInContext(`(function () {
  const results = {};

  // 1) 双参安全库存取值
  results.getSS = {
    f1000_60001018: getSafetyStock('1000', '60001018'),   // 应为 50
    f2001_50000001: getSafetyStock('2001', '50000001'),   // 应为 30
    f2001_60001018: getSafetyStock('2001', '60001018'),   // 应为 0（该物料不在 2001）
    f1000_60000001: getSafetyStock('1000', '60000001')    // 应为 0（60000001 属于 2001）
  };

  // 2) 工厂汇总档聚合：50000001 在 2001 有 2 批次（85+5+2 / 120）=> 非限制 205 质检 5
  const plant = SparePartsStock._aggregateByPlant.bind(SparePartsStock);
  SparePartsStock.filtered = sparePartsStockData.slice();
  plant();
  // 工厂档行数 = 工厂|物料 去重数（在覆盖 filtered 之前记录）
  const plantKeys = new Set(sparePartsStockData.map(r => r.factory + '|' + r.matCode));
  results.plantCount = { rows: SparePartsStock.filtered.length, expected: plantKeys.size };
  const p50000001 = SparePartsStock.filtered.find(r => r.matCode === '50000001');
  results.plant50000001 = {
    factory: p50000001.factory,
    unrestrictedQty: p50000001.unrestrictedQty,
    qualityQty: p50000001.qualityQty,
    safetyStock: p50000001.safetyStock,
    availableQty: p50000001.availableQty,
    status: p50000001.status
  };

  // 3) 红灯物料 60001018（1000 厂 5004 库 8+2=10 < 50）
  const pRed = SparePartsStock.filtered.find(r => r.matCode === '60001018');
  results.plantRed = { factory: pRed.factory, availableQty: pRed.availableQty, safetyStock: pRed.safetyStock, status: pRed.status };

  // 4) 库位汇总档：无 status 字段（红绿灯已移除），safetyStock 保留
  SparePartsStock.filtered = sparePartsStockData.slice();
  SparePartsStock._aggregate.call(SparePartsStock);
  const sRow = SparePartsStock.filtered.find(r => r.matCode === '10000010');
  results.summaryRow = { hasStatus: Object.prototype.hasOwnProperty.call(sRow, 'status'), safetyStock: sRow.safetyStock };

  return results;
})()`, ctx);

console.log(JSON.stringify(out, null, 2));

// 断言
const assert = require('assert');
assert.strictEqual(out.getSS.f1000_60001018, 50);
assert.strictEqual(out.getSS.f2001_50000001, 30);
assert.strictEqual(out.getSS.f2001_60001018, 0);
assert.strictEqual(out.getSS.f1000_60000001, 0);

assert.strictEqual(out.plant50000001.factory, '2001');
assert.strictEqual(out.plant50000001.unrestrictedQty, 205);
assert.strictEqual(out.plant50000001.qualityQty, 5);
assert.strictEqual(out.plant50000001.safetyStock, 30);
assert.strictEqual(out.plant50000001.availableQty, 210);
assert.strictEqual(out.plant50000001.status, 'green');

assert.strictEqual(out.plantRed.factory, '1000');
assert.strictEqual(out.plantRed.availableQty, 10);
assert.strictEqual(out.plantRed.safetyStock, 50);
assert.strictEqual(out.plantRed.status, 'red');

assert.strictEqual(out.summaryRow.hasStatus, false);
assert.strictEqual(out.summaryRow.safetyStock, 3000);

assert.strictEqual(out.plantCount.rows, out.plantCount.expected);

console.log('\nALL ASSERTIONS PASSED');
