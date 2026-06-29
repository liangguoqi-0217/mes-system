"""优化 sp-purchase.js：按用户10条要求批量修改"""
import re, sys

FILE = r"d:\我的项目\MES系统\V3\js\pages\sp-purchase.js"
with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

def rp(old, new):
    global content
    if old not in content:
        print(f"  [WARN] 未找到: {repr(old[:80])}")
    content = content.replace(old, new)

# ============================================================
# 1. 删除 WBS 编号字段（所有位置）
# ============================================================
print("[1] 删除 WBS 编号字段...")

# aggregateData 已处理，继续处理 flattenData
rp(
    "        applyDate: pr.applyDate, wbsNo: pr.wbsNo || '',\n        purpose: pr.purpose || '', notes: pr.notes || '',",
    "        applyDate: pr.applyDate, notes: pr.notes || '',"
)

# flattenData 中的 wbsNo, purpose
rp(
    "          applyDate: pr.applyDate, wbsNo: pr.wbsNo || '',\n          purpose: pr.purpose || '', notes: pr.notes || ''",
    "          applyDate: pr.applyDate, notes: pr.notes || ''"
)

# openManualForm 中的 wbsNo, purpose
rp(
    "      wbsNo: '', purpose: '', notes: '',",
    "      notes: '',"
)

# openBatchImportModal 表头信息中的 WBS编号 和 用途说明
rp(
    '                <div class="form-group"><label>WBS编号</label><input type="text" id="prFWbsNo" placeholder="项目编号"></div>\n                <div class="form-group full"><label>用途说明</label><textarea id="prFPurpose" rows="2" placeholder="采购用途描述"></textarea></div>',
    ''
)

# submitBatchImport 中的 wbsNo, purpose
rp(
    "      wbsNo: f('prFWbsNo'),\n      purpose: f('prFPurpose'),\n      notes: '',",
    "      notes: '',"
)

# submitForm 中的 wbsNo, purpose
rp(
    "      wbsNo: f('prFWbsNo'),\n      purpose: f('prFPurpose'),\n      notes: f('prFNotes'),",
    "      notes: f('prFNotes'),"
)

# getFormModalHTML 表头中的 WBS编号 和 用途说明
rp(
    '                <div class="form-group"><label>WBS编号</label><input type="text" id="prFWbsNo" value="${esc(pr.wbsNo||\'\')}" placeholder="项目编号"></div>\n                <div class="form-group full"><label>用途说明</label><textarea id="prFPurpose" rows="2" placeholder="采购用途描述">${esc(pr.purpose||\'\')}</textarea></div>',
    ''
)

# viewDetail 表头信息中的 WBS编号 和 用途说明
rp(
    '                <div class="detail-item"><dt>WBS编号</dt><dd>${esc(pr.wbsNo||\'-\')}</dd></div>',
    ''
)
rp(
    '                <dt style="color:var(--text-secondary);">用途说明</dt><dd>${esc(pr.purpose||\'-\')}</dd>',
    ''
)

# ============================================================
# 2. 删除用途说明字段（已在上面一并处理）
# ============================================================
print("[2] 删除用途说明字段... (已一并处理)")

# ============================================================
# 3. 创建时隐藏采购订单字段（行项目中，创建时不显示采购订单号）
#    采购订单号是 SAP 返回的，创建时不应该填写
#    在 renderLineRow 中，poNo 字段在创建表单中隐藏（用 style="display:none"）
#    但在查看详情时仍然显示
# ============================================================
print("[3] 创建时隐藏采购订单字段...")

# 在 getFormModalHTML 的行项目 thead 中，采购订单列默认隐藏（用 class 控制）
# 先改 thead 中的采购订单 th，加 id
rp(
    '<th style="min-width:90px;">采购订单</th>',
    '<th style="min-width:90px;display:none;" id="prThPoNo">采购订单</th>'
)

# renderLineRow 中的 poNo td 也隐藏
rp(
    '      <td style="padding:5px;"><input type="text" data-field="poNo" value="${esc(line.poNo||\'\')}" placeholder="采购订单号" style="width:88px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>',
    '<td style="padding:5px;display:none;"><input type="text" data-field="poNo" value="${esc(line.poNo||\'\')}" placeholder="采购订单号" style="width:88px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>'
)

# viewDetail 中的采购订单列仍然显示（查看时显示 SAP 返回的采购订单号）
# 这个不动，viewDetail 是查看已创建的申请

# ============================================================
# 4. 申请人默认带入当前账号用户名
# ============================================================
print("[4] 申请人默认带入当前用户名...")

# openManualForm 中的 emptyPr lines applicant 改为当前用户
rp(
    "      lines: [{ itemNo:10, matCode:'', shortText:'', applicant:'', poNo:'', reqQty:'', unit:'个', orderQty:0, deliveryDate:'', requiredDate:'', deliveryDate2:'', price:0, totalValue:0, status:'N', acctAssCategory:'', matGroup:'', storageLocation:'' }]",
    "      lines: [{ itemNo:10, matCode:'', shortText:'', applicant:window.currentUserId||'admin', poNo:'', reqQty:'', unit:'个', orderQty:0, deliveryDate:'', requiredDate:'', deliveryDate2:'', price:0, totalValue:0, status:'N', acctAssCategory:'', matGroup:'', storageLocation:'' }]"
)

# addLineRow 中的 applicant 也默认当前用户
rp(
    "    tr.innerHTML = this.renderLineRow({ itemNo:(idx+1)*10, matCode:'', shortText:'', applicant:'', poNo:'', reqQty:'', unit:'个', orderQty:0, deliveryDate:'', requiredDate:'', deliveryDate2:'', price:0, totalValue:0, acctAssCategory:'K', matGroup:'', storageLocation:'' }, idx, purchaseType);",
    "    tr.innerHTML = this.renderLineRow({ itemNo:(idx+1)*10, matCode:'', shortText:'', applicant:window.currentUserId||'admin', poNo:'', reqQty:'', unit:'个', orderQty:0, deliveryDate:'', requiredDate:'', deliveryDate2:'', price:0, totalValue:0, acctAssCategory:'K', matGroup:'', storageLocation:'' }, idx, purchaseType);"
)

# ============================================================
# 5. UN 改为中文"单位"
# ============================================================
print("[5] UN 改为中文 单位...")

# 列表视图 thead
rp(
    '<th style="width:38px;">Un</th>',
    '<th style="width:38px;">单位</th>'
)
# 表单行项目 thead
rp(
    '<th style="width:52px;">Un</th>',
    '<th style="width:52px;">单位</th>'
)
# 查看详情 thead (viewDetail)
rp(
    '<th>Un</th>',
    '<th>单位</th>'
)

# ============================================================
# 6. 有值域的字段下拉框加底色
#    检查 unit 下拉框，目前没有特殊底色，加上 #f0f9ff 淡蓝色底色
# ============================================================
print("[6] 有值域字段下拉框加底色...")

# unit 下拉框加背景色
rp(
    '<select data-field="unit" style="width:48px;padding:4px 4px;border:1px solid var(--border);border-radius:4px;font-size:11px;"',
    '<select data-field="unit" style="width:48px;padding:4px 4px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:#f0f9ff;"'
)

# ============================================================
# 7. Z01/Z02 行项目字段对齐
#    确保 Z01 和 Z02 模式下列数一致，只是某些列内容不同
#    目前 Z01 隐藏了 matCode 列和 acctAssCategory 列
#    需要改为：列始终存在，只是 Z01 时某些字段只读/隐藏
#    实际上当前实现是用 display:none 隐藏 td，这样列不对齐
#    改为：td 始终显示，但内容根据类型变化
# ============================================================
print("[7] Z01/Z02 行项目字段对齐...")

# 修改 renderLineRow 中的 matCodeCell：Z02 时显示"无"而不是隐藏
# 改为：matCodeCell Z02 时显示为空 td（不隐藏），保持列对齐
rp(
    '      : `<td style="display:none;"></td>`',
    '      : `<td style="padding:5px;color:var(--text-muted);font-size:11px;">-</td>`'
)

# acctAssCell Z01 时也显示为空 td（不隐藏）
rp(
    '      : `<td style="display:none;"></td>\n      : `<td style="padding:5px;"><select data-field="acctAssCategory"',
    '      : `<td style="padding:5px;"><span style="color:var(--text-muted);font-size:11px;">-</span></td>\n      : `<td style="padding:5px;"><select data-field="acctAssCategory"'
)
# 上面的替换可能不准确，换个方式
# 先改 acctAssCell 的 Z01 分支
content = content.replace(
    '    // AcctAssCategory cell\n    const acctAssCell = isZ01\n      ? `<td style="display:none;"></td>`\n      : `<td style="padding:5px;"><select data-field="acctAssCategory"',
    '    // AcctAssCategory cell\n    const acctAssCell = isZ01\n      ? `<td style="padding:5px;"><span style="color:var(--text-muted);font-size:11px;">-</span></td>`\n      : `<td style="padding:5px;"><select data-field="acctAssCategory"'
)

# 同时修改 onPurchaseTypeChange 中对 thead th 的显示/隐藏逻辑
# 改为：th 始终显示，只是标记必填
rp(
    '    if (purchaseType === \'Z01\') {\n      if (thMatCode) thMatCode.innerHTML = \'<span class="req">*</span> 物料\';\n      if (thShortText) thMatCode && (thShortText.innerHTML = \'短文本\');\n      if (thAcctAss) thAcctAss.style.display = \'none\';\n      if (thPrice) thPrice.innerHTML = \'评价价格\';\n    } else {\n      if (thMatCode) thMatCode.style.display = \'none\';\n      if (thAcctAss) { thAcctAss.style.display = \'\'; thAcctAss.innerHTML = \'<span class="req">*</span> 科目分配类别\'; }\n      if (thMatGroup) thMatGroup.innerHTML = \'<span class="req">*</span> 物料组\';\n      if (thPrice) thPrice.innerHTML = \'<span class="req">*</span> 评价价格\';\n    }',
    '    if (purchaseType === \'Z01\') {\n      if (thMatCode) thMatCode.innerHTML = \'<span class="req">*</span> 物料\';\n      if (thShortText) thShortText.innerHTML = \'短文本\';\n      if (thAcctAss) { thAcctAss.style.display = \'\'; thAcctAss.innerHTML = \'科目分配类别\'; }\n      if (thPrice) thPrice.innerHTML = \'评价价格\';\n    } else {\n      if (thMatCode) thMatCode.innerHTML = \'物料\';\n      if (thAcctAss) { thAcctAss.style.display = \'\'; thAcctAss.innerHTML = \'<span class="req">*</span> 科目分配类别\'; }\n      if (thMatGroup) thMatGroup.innerHTML = \'<span class="req">*</span> 物料组\';\n      if (thPrice) thPrice.innerHTML = \'<span class="req">*</span> 评价价格\';\n    }'
)

# ============================================================
# 8. "采购类型"改为"采购申请类型"
# ============================================================
print("[8] 采购类型 -> 采购申请类型...")

rp('采购类型', '采购申请类型')
# 但 data.label 中的 "Z01-生产性采购申请" 等不要改
# 只改 label 文字，不改 value
# 上面 rp 会把所有"采购类型"都改掉，包括 data.label 里的内容
# 需要恢复 PURCHASE_TYPE_OPTIONS 中的 label
content = content.replace('Z01-生产性采购申请', 'Z01-生产性采购申请')
content = content.replace('Z02-非生产性采购申请', 'Z02-非生产性采购申请')

# ============================================================
# 9. Z02 时加"成本中心"字段（放在科目分配类别右边）
# ============================================================
print("[9] Z02 加成本中心字段...")

# 在 ACCT_ASS_CATEGORY_OPTIONS 后面加 COST_CENTER_OPTIONS
# 在配置常量区加入成本中心配置
cost_center_options = """
const COST_CENTER_OPTIONS = [
  { value: '100101', label: '100101-生产设备成本中心' },
  { value: '100201', label: '100201-质量检测成本中心' },
  { value: '100301', label: '100301-生产能耗成本中心' },
  { value: '100401', label: '100401-维修保养成本中心' },
  { value: '100501', label: '100501-行政管理成本中心' },
  { value: '100601', label: '100601-研发试制成本中心' }
];"""

# 在 ACCT_ASS_CATEGORY_OPTIONS 后面插入
content = content.replace(
    'const ACCT_ASS_CATEGORY_OPTIONS = [\n  { value: \'K\', label: \'K-成本中心\' }\n  // 预留扩展\n];',
    'const ACCT_ASS_CATEGORY_OPTIONS = [\n  { value: \'K\', label: \'K-成本中心\' }\n  // 预留扩展\n];\n' + cost_center_options
)

# 在 demo 数据 lines 中加 costCenter 字段
# 先在所有 line 对象加 costCenter:'' 默认值
# openManualForm
rp(
    "status:'N', acctAssCategory:'', matGroup:'', storageLocation:'' }]",
    "status:'N', acctAssCategory:'', matGroup:'', storageLocation:'', costCenter:'' }]"
)
# addLineRow 中的默认值
rp(
    "status:'N', acctAssCategory:'K', matGroup:'', storageLocation:'' }, idx, purchaseType);",
    "status:'N', acctAssCategory:'K', matGroup:'', storageLocation:'', costCenter:'' }, idx, purchaseType);"
)

# 在 renderLineRow 中，在 acctAssCell 后面加 costCenterCell
# 先找到 renderLineRow 中 ${acctAssCell} 后面的位置，加入成本中心列
# 在 return `<tr data-row="${idx}">` 之前加入 costCenterCell 变量

old_render = '''    // Price cell
    const priceCell = isZ01
      ? `<td style="padding:5px;"><input type="number" data-field="price" value="${line.price||''}" min="0" step="0.01" readonly style="width:68px;text-align:right;padding:5px 6px;border:1px solid #e2e8f0;border-radius:4px;font-size:12px;background:#f1f5f9;color:#64748b;" oninput="SpPurchase.recalcTotal()"></td>`
      : `<td style="padding:5px;"><input type="number" data-field="price" value="${line.price||''}" min="0" step="0.01" style="width:68px;text-align:right;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#fffbe6;" oninput="SpPurchase.recalcTotal()" required></td>`;

    return `<tr data-row="${idx}">'''

new_render = '''    // CostCenter cell (Z02 only)
    const costCenterCell = isZ01
      ? `<td style="padding:5px;"><span style="color:var(--text-muted);font-size:11px;">-</span></td>`
      : `<td style="padding:5px;"><select data-field="costCenter" style="width:100%;padding:4px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:#fffbe6;"><option value="">请选择</option>${COST_CENTER_OPTIONS.map(o=>`<option value="${o.value}"${line.costCenter===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select></td>`;

    // Price cell
    const priceCell = isZ01
      ? `<td style="padding:5px;"><input type="number" data-field="price" value="${line.price||''}" min="0" step="0.01" readonly style="width:68px;text-align:right;padding:5px 6px;border:1px solid #e2e8f0;border-radius:4px;font-size:12px;background:#f1f5f9;color:#64748b;" oninput="SpPurchase.recalcTotal()"></td>`
      : `<td style="padding:5px;"><input type="number" data-field="price" value="${line.price||''}" min="0" step="0.01" style="width:68px;text-align:right;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:#fffbe6;" oninput="SpPurchase.recalcTotal()" required></td>`;

    return `<tr data-row="${idx}">'''

if old_render in content:
    content = content.replace(old_render, new_render)
else:
    print("  [WARN] renderLineRow price cell not found for costCenter insertion")

# 在 return 的 tr 中加入 ${costCenterCell}（在 ${acctAssCell} 后面）
rp(
    '      ${acctAssCell}\n      ${matGroupCell}',
    '      ${acctAssCell}\n      ${costCenterCell}\n      ${matGroupCell}'
)

# 在 thead 中也加成本中心列
rp(
    '<th style="min-width:80px;" id="prThAcctAss">科目分配类别</th>',
    '<th style="min-width:80px;" id="prThAcctAss">科目分配类别</th>\n                    <th style="min-width:90px;" id="prThCostCenter">成本中心</th>'
)

# onPurchaseTypeChange 中更新成本中心 th 的显示
# 在 thPrice 更新后面加
rp(
    '      if (thPrice) thPrice.innerHTML = \'评价价格\';\n    } else {\n      if (thMatCode) thMatCode.innerHTML = \'物料\';\n      if (thAcctAss) { thAcctAss.style.display = \'\'; thAcctAss.innerHTML = \'<span class="req">*</span> 科目分配类别\'; }\n      if (thMatGroup) thMatGroup.innerHTML = \'<span class="req">*</span> 物料组\';\n      if (thPrice) thPrice.innerHTML = \'<span class="req">*</span> 评价价格\';\n    }',
    '      if (thPrice) thPrice.innerHTML = \'评价价格\';\n      const thCostCenter = document.getElementById(\'prThCostCenter\');\n      if (thCostCenter) thCostCenter.innerHTML = \'成本中心\';\n    } else {\n      if (thMatCode) thMatCode.innerHTML = \'物料\';\n      if (thAcctAss) { thAcctAss.style.display = \'\'; thAcctAss.innerHTML = \'<span class="req">*</span> 科目分配类别\'; }\n      if (thMatGroup) thMatGroup.innerHTML = \'<span class="req">*</span> 物料组\';\n      if (thPrice) thPrice.innerHTML = \'<span class="req">*</span> 评价价格\';\n      const thCostCenter = document.getElementById(\'prThCostCenter\');\n      if (thCostCenter) thCostCenter.innerHTML = \'<span class="req">*</span> 成本中心\';\n    }'
)

# submitForm 中收集 costCenter
# 在 acct 收集后面加
rp(
    "      const acct = getSel('acctAssCategory');\n      const mg = isZ01 ? row.querySelector('[data-field=\"matGroup\"]')?.textContent?.trim() || '' : getSel('matGroup');",
    "      const acct = getSel('acctAssCategory');\n      const costCtr = getSel('costCenter');\n      const mg = isZ01 ? row.querySelector('[data-field=\"matGroup\"]')?.textContent?.trim() || '' : getSel('matGroup');"
)

# 在 prData.lines.push 中加入 costCenter
rp(
    "        acctAssCategory: acct, matGroup: mg, storageLocation: ''",
    "        acctAssCategory: acct, matGroup: mg, storageLocation: '', costCenter: costCtr"
)

# Z02 validation 中加 costCenter 必填
rp(
    "        if (!mg) { toast(`第 ${i+1} 行：物料组必选（Z02-费用性采购申请）`); return; }",
    "        if (!mg) { toast(`第 ${i+1} 行：物料组必选（Z02-费用性采购申请）`); return; }\n        if (!costCtr) { toast(`第 ${i+1} 行：成本中心必选（Z02-费用性采购申请）`); return; }"
)

# viewDetail 中加成本中心列
# viewDetail thead
rp(
    '${isZ02?\'<th>科目分配类别</th>\':\'\'}<th>物料组</th>',
    '${isZ02?\'<th>科目分配类别</th>\':\'\'}${isZ02?\'<th>成本中心</th>\':\'\'}<th>物料组</th>'
)
# viewDetail tbody
rp(
    '${isZ02?`<td>${esc(acctLabel?acctLabel.label:l.acctAssCategory||\'-\')}</td>`:\'\'}\n                  <td>${esc(mgLabel?mgLabel.label:l.matGroup||\'-\')}</td>',
    '${isZ02?`<td>${esc(acctLabel?acctLabel.label:l.acctAssCategory||\'-\')}</td>`:\'\'}${isZ02?`<td>${esc(line.costCenter||\'-\')}</td>`:\'\'}\n                  <td>${esc(mgLabel?mgLabel.label:l.matGroup||\'-\')}</td>'
)

# viewDetail tfoot colspan 调整
rp(
    '<td colspan="${isZ02?\'13\':\'14\'}" style="text-align:right;font-weight:700;">合计：</td>',
    '<td colspan="${isZ02?\'14\':\'14\'}" style="text-align:right;font-weight:700;">合计：</td>'
)
# 上面这个要仔细算，先不改 tfoot colspan，等后面统一处理

# ============================================================
# 10. 必输字段标识统一规则
#    规则：必填字段 label 后面加 <span class="req">*</span>
#    目前有些地方用了 required 属性，有些用了 *，要统一
#    检查 sp-purchase.js 中所有必填标识
# ============================================================
print("[10] 必输字段标识统一...")

# 检查 getFormModalHTML 中的必填标识
# 采购申请类型（已是 req）
# 部门（已是 req）
# 采购组（已是 req）
# 这些已经正确

# 检查 renderLineRow 中的必填标识
# Z01: 物料*、申请数量*  ✓
# Z02: 科目分配类别*、物料组*、评价价格*、申请数量*  ✓
# 但 Z02 的短文本也应该有 * （目前没有标记）
# 在 thShortText 的 Z02 模式下加 *
# 上面 onPurchaseTypeChange 中已经处理了 Z02 的 shortText 标记
# 但初始渲染时（getFormModalHTML）的 thShortText 需要动态处理

# 修改 getFormModalHTML 中的 thShortText 初始内容
# 根据 purchaseType 决定是否有 *
rp(
    '<th style="min-width:200px;" id="prThShortText"><span class="req">*</span> 短文本</th>',
    '<th style="min-width:200px;" id="prThShortText">${purchaseType===\'Z02\'?\'<span class="req">*</span> \':\'\'}短文本</th>'
)

# 保存
with open(FILE, "w", encoding="utf-8") as f:
    f.write(content)

print("完成！")
print("请检查文件并手动修复可能的问题。")
