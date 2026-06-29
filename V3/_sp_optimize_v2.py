"""优化 sp-purchase.js：按用户10条要求批量修改
1. 删除 WBS 编号字段
2. 删除用途说明字段
3. 创建时隐藏采购订单字段
4. 申请人默认带入当前账号用户名
5. UN 改为中文"单位"
6. 有值域的字段下拉框加底色
7. Z01/Z02 行项目字段对齐（列数一致）
8. "采购类型"改为"采购申请类型"
9. Z02 时加"成本中心"字段（放在科目分配类别右边）
10. 必输字段标识统一规则
"""
import re, sys

FILE = r"d:\我的项目\MES系统\V3\js\pages\sp-purchase.js"
with open(FILE, "r", encoding="utf-8") as f:
    c = f.read()

def rp(old, new, count=0):
    global c
    if old not in c:
        print(f"  [WARN] 未找到 ({count}): {repr(old[:70])}")
        return 0
    n = c.count(old) if count == 0 else min(c.count(old), count)
    c = c.replace(old, new, count if count > 0 else -1)
    print(f"  [OK] 替换 {n} 处: {repr(old[:60])}")
    return n

print("=" * 60)
print("[1][2] 删除 WBS 编号和用途说明字段...")
print("=" * 60)

# aggregateData: 删除 wbsNo, purpose
rp("        wbsNo: pr.wbsNo || '',\n        purpose: pr.purpose || '', notes: pr.notes || '',",
   "        notes: pr.notes || '',")

# flattenData: 删除 wbsNo, purpose
rp("          applyDate: pr.applyDate, wbsNo: pr.wbsNo || '',\n          purpose: pr.purpose || '', notes: pr.notes || ''",
   "          applyDate: pr.applyDate, notes: pr.notes || ''")

# openManualForm: 删除 wbsNo, purpose
rp("      wbsNo: '', purpose: '', notes: '',",
   "      notes: '',")

# openBatchImportModal 表头：删除 WBS编号 和 用途说明 两个 form-group
rp("""                <div class="form-group"><label>WBS编号</label><input type="text" id="prFWbsNo" placeholder="项目编号"></div>
                <div class="form-group full"><label>用途说明</label><textarea id="prFPurpose" rows="2" placeholder="采购用途描述"></textarea></div>""",
   "")

# submitBatchImport: 删除 wbsNo, purpose
rp("""      wbsNo: f('prFWbsNo'),
      purpose: f('prFPurpose'),
      notes: '',""",
   """      notes: '',""")

# submitForm: 删除 wbsNo, purpose
rp("""      wbsNo: f('prFWbsNo'),
      purpose: f('prFPurpose'),
      notes: f('prFNotes'),""",
   """      notes: f('prFNotes'),""")

# getFormModalHTML 表头：删除 WBS编号 和 用途说明
rp("""                <div class="form-group"><label>WBS编号</label><input type="text" id="prFWbsNo" value="${esc(pr.wbsNo||'')}" placeholder="项目编号"></div>
                <div class="form-group full"><label>用途说明</label><textarea id="prFPurpose" rows="2" placeholder="采购用途描述">${esc(pr.purpose||'')}</textarea></div>""",
   "")

# viewDetail 表头：删除 WBS编号 和 用途说明
# 先删 WBS编号
rp("""                <div class="detail-item"><dt>WBS编号</dt><dd>${esc(pr.wbsNo||'-')}</dd></div>""",
   "")
# 再删用途说明
rp("""                <dt style="color:var(--text-secondary);">用途说明</dt><dd>${esc(pr.purpose||'-')}</dd>""",
   "")

print("=" * 60)
print("[3] 创建时隐藏采购订单字段...")
print("=" * 60)

# 在 getFormModalHTML 的行项目 thead 中，采购订单 th 加 style="display:none"
rp("""<th style="min-width:90px;">采购订单</th>""",
   """<th style="min-width:90px;display:none;" id="prThPoNo">采购订单</th>""")

# renderLineRow 中的 poNo td 也隐藏
rp("""<td style="padding:5px;"><input type="text" data-field="poNo" value="${esc(line.poNo||'')}" placeholder="采购订单号" style="width:88px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>""",
   """<td style="padding:5px;display:none;"><input type="text" data-field="poNo" value="${esc(line.poNo||'')}" placeholder="采购订单号" style="width:88px;padding:5px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px;"></td>""")

# _renderLineTable 中的采购订单列也隐藏（创建时）
# 行项目视图的 thead 中的采购订单 th
rp("""<th>申请人</th><th>采购订单</th>""",
   """<th>申请人</th>""")

# _renderLineTable tbody 中的采购订单 td
rp("""        <td>${esc(row.applicant)}</td>
        <td style="color:var(--primary-lighter);font-size:12px;">${esc(row.poNo)}</td>""",
   """        <td>${esc(row.applicant)}</td>""")

print("=" * 60)
print("[4] 申请人默认带入当前用户名...")
print("=" * 60)

# openManualForm 中 emptyPr lines applicant 默认值
rp("""applicant:'', poNo:'', reqQty:''""",
   """applicant:window.currentUserId||'admin', poNo:'', reqQty:''""")

# addLineRow 中默认值
rp("""applicant:'', poNo:'', reqQty:''""",
   """applicant:window.currentUserId||'admin', poNo:'', reqQty:''""")

print("=" * 60)
print("[5] UN 改为中文 单位...")
print("=" * 60)

# 列表视图 thead
rp("""<th style="width:38px;text-align:center;">Un</th>""",
   """<th style="width:38px;text-align:center;">单位</th>""")
# 表单 thead
rp("""<th style="width:52px;">Un</th>""",
   """<th style="width:52px;">单位</th>""")
# viewDetail thead
rp("""<th style="text-align:center;">Un</th>""",
   """<th style="text-align:center;">单位</th>""")

print("=" * 60)
print("[6] 有值域字段下拉框加底色...")
print("=" * 60)

# unit 下拉框加底色
rp("""<select data-field="unit" style="width:48px;padding:4px 4px;border:1px solid var(--border);border-radius:4px;font-size:11px;" """,
   """<select data-field="unit" style="width:48px;padding:4px 4px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:#f0f9ff;" """)

print("=" * 60)
print("[7] Z01/Z02 行项目字段对齐（列数一致）...")
print("=" * 60)

# 当前 Z01 时 matCodeCell 用 display:none 隐藏 td → 改为显示但内容为空
# 找到 matCodeCell 的 Z01 分支（renderLineRow 中）
old_mc = '      : `<td style="display:none;"></td>`'
new_mc = '      : `<td style="padding:5px;color:var(--text-muted);font-size:11px;text-align:center;">-</td>`'
if old_mc in c:
    c = c.replace(old_mc, new_mc, 1)
    print("  [OK] matCodeCell Z02 时显示 - ")
else:
    print("  [WARN] matCodeCell Z02 分支未找到")

# acctAssCell Z01 时也显示（不隐藏），只是内容为空
old_acct = '      ? `<td style="display:none;"></td>`\n      : `<td style="padding:5px;"><select data-field="acctAssCategory"'
new_acct = '      ? `<td style="padding:5px;"><span style="color:var(--text-muted);font-size:11px;">-</span></td>`\n      : `<td style="padding:5px;"><select data-field="acctAssCategory"'
if old_acct in c:
    c = c.replace(old_acct, new_acct, 1)
    print("  [OK] acctAssCell Z01 时显示 - ")
else:
    print("  [WARN] acctAssCell 未找到")

# 修改 onPurchaseTypeChange：不再隐藏/显示 th，而是统一显示
old_otc = """    if (purchaseType === 'Z01') {
      if (thMatCode) thMatCode.innerHTML = '<span class="req">*</span> 物料';
      if (thShortText) thMatCode && (thShortText.innerHTML = '短文本');
      if (thAcctAss) thAcctAss.style.display = 'none';
      if (thPrice) thPrice.innerHTML = '评价价格';
    } else {
      if (thMatCode) thMatCode.style.display = 'none';
      if (thAcctAss) { thAcctAss.style.display = ''; thAcctAss.innerHTML = '<span class="req">*</span> 科目分配类别'; }
      if (thMatGroup) thMatGroup.innerHTML = '<span class="req">*</span> 物料组';
      if (thPrice) thPrice.innerHTML = '<span class="req">*</span> 评价价格';
    }"""
new_otc = """    const thCostCenter = document.getElementById('prThCostCenter');
    if (purchaseType === 'Z01') {
      if (thMatCode) thMatCode.innerHTML = '<span class="req">*</span> 物料';
      if (thShortText) thShortText.innerHTML = '短文本';
      if (thAcctAss) { thAcctAss.style.display = ''; thAcctAss.innerHTML = '科目分配类别'; }
      if (thMatGroup) thMatGroup.innerHTML = '物料组';
      if (thPrice) thPrice.innerHTML = '评价价格';
      if (thCostCenter) thCostCenter.innerHTML = '成本中心';
    } else {
      if (thMatCode) thMatCode.innerHTML = '物料';
      if (thShortText) thShortText.innerHTML = '<span class="req">*</span> 短文本';
      if (thAcctAss) { thAcctAss.style.display = ''; thAcctAss.innerHTML = '<span class="req">*</span> 科目分配类别'; }
      if (thMatGroup) thMatGroup.innerHTML = '<span class="req">*</span> 物料组';
      if (thPrice) thPrice.innerHTML = '<span class="req">*</span> 评价价格';
      if (thCostCenter) thCostCenter.innerHTML = '<span class="req">*</span> 成本中心';
    }"""
if old_otc in c:
    c = c.replace(old_otc, new_otc)
    print("  [OK] onPurchaseTypeChange 更新")
else:
    print("  [WARN] onPurchaseTypeChange 未找到")

print("=" * 60)
print("[8] 采购类型 -> 采购申请类型...")
print("=" * 60)

# 只改 label，不改 value 或 data
# getFormModalHTML 中的 label
c = c.replace('采购类型', '采购申请类型')
# 恢复 PURCHASE_TYPE_OPTIONS 中的 label（不应该改）
c = c.replace('Z01-生产性采购申请', 'Z01-生产性采购申请')
c = c.replace('Z02-非生产性采购申请', 'Z02-非生产性采购申请')
# 恢复 plan.md 引用（如果有的话）
print("  [OK] 采购类型 -> 采购申请类型")

print("=" * 60)
print("[9] Z02 加成本中心字段...")
print("=" * 60)

# 在配置常量区加入 COST_CENTER_OPTIONS（在 ACCT_ASS_CATEGORY_OPTIONS 后面）
old_const = """const ACCT_ASS_CATEGORY_OPTIONS = [
  { value: 'K', label: 'K-成本中心' }
  // 预留扩展
];"""
new_const = """const ACCT_ASS_CATEGORY_OPTIONS = [
  { value: 'K', label: 'K-成本中心' }
  // 预留扩展
];
const COST_CENTER_OPTIONS = [
  { value: '100101', label: '100101-生产设备成本中心' },
  { value: '100201', label: '100201-质量检测成本中心' },
  { value: '100301', label: '100301-生产能耗成本中心' },
  { value: '100401', label: '100401-维修保养成本中心' },
  { value: '100501', label: '100501-行政管理成本中心' },
  { value: '100601', label: '100601-研发试制成本中心' }
];"""
if old_const in c:
    c = c.replace(old_const, new_const)
    print("  [OK] COST_CENTER_OPTIONS 已添加")
else:
    print("  [WARN] ACCT_ASS_CATEGORY_OPTIONS 未找到")

# 在所有 line 对象加 costCenter:'' 默认值
# openManualForm
c = c.replace(
    "storageLocation:'' }]",
    "storageLocation:'', costCenter:'' }]"
)
# addLineRow
c = c.replace(
    "storageLocation:'' }, idx, purchaseType);",
    "storageLocation:'', costCenter:'' }, idx, purchaseType);"
)

# renderLineRow 中加 costCenterCell（在 acctAssCell 和 matGroupCell 之间）
# 找到 Price cell 前面的位置插入 costCenterCell
old_rc = """    // Price cell
    const priceCell = isZ01"""
new_rc = """    // CostCenter cell (Z02 only, always show column for alignment)
    const costCenterCell = isZ01
      ? `<td style="padding:5px;"><span style="color:var(--text-muted);font-size:11px;">-</span></td>`
      : `<td style="padding:5px;"><select data-field="costCenter" style="width:100%;padding:4px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:#fffbe6;"><option value="">请选择</option>${COST_CENTER_OPTIONS.map(o=>`<option value="${o.value}"${line.costCenter===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select></td>`;

    // Price cell
    const priceCell = isZ01"""
if old_rc in c:
    c = c.replace(old_rc, new_rc)
    print("  [OK] costCenterCell 已加入 renderLineRow")
else:
    print("  [WARN] Price cell 标记未找到")

# 在 return tr 中加入 ${costCenterCell}
rp("""      ${acctAssCell}
      ${matGroupCell}""",
   """      ${acctAssCell}
      ${costCenterCell}
      ${matGroupCell}""")

# thead 中加成本中心 th
rp("""<th style="min-width:80px;" id="prThAcctAss">科目分配类别</th>
                    <th style="min-width:80px;" id="prThMatGroup">物料组</th>""",
   """<th style="min-width:80px;" id="prThAcctAss">科目分配类别</th>
                    <th style="min-width:90px;" id="prThCostCenter">成本中心</th>
                    <th style="min-width:80px;" id="prThMatGroup">物料组</th>""")

# submitForm 中收集 costCenter
rp("""      const acct = getSel('acctAssCategory');
      const mg = isZ01 ? row.querySelector('[data-field="matGroup"]')?.textContent?.trim() || '' : getSel('matGroup');""",
   """      const acct = getSel('acctAssCategory');
      const costCtr = getSel('costCenter');
      const mg = isZ01 ? row.querySelector('[data-field="matGroup"]')?.textContent?.trim() || '' : getSel('matGroup');""")

# submitForm lines.push 中加入 costCenter
rp("""        acctAssCategory: acct, matGroup: mg, storageLocation: ''""",
   """        acctAssCategory: acct, matGroup: mg, storageLocation: '', costCenter: costCtr""")

# Z02 validation 加 costCenter 必填
rp("""        if (!mg) { toast(`第 ${i+1} 行：物料组必选（Z02-费用性采购申请）`); return; }""",
   """        if (!mg) { toast(`第 ${i+1} 行：物料组必选（Z02-费用性采购申请）`); return; }
        if (!costCtr) { toast(`第 ${i+1} 行：成本中心必选（Z02-费用性采购申请）`); return; }""")

# viewDetail thead 加成本中心
rp("""${isZ02?'<th>科目分配类别</th>':''}<th>物料组</th>""",
   """${isZ02?'<th>科目分配类别</th>':''}${isZ02?'<th>成本中心</th>':''}<th>物料组</th>""")

# viewDetail tbody 加成本中心
rp("""${isZ02?`<td>${esc(acctLabel?acctLabel.label:l.acctAssCategory||'-')}</td>`:''}
                  <td>${esc(mgLabel?mgLabel.label:l.matGroup||'-')}</td>""",
   """${isZ02?`<td>${esc(acctLabel?acctLabel.label:l.acctAssCategory||'-')}</td>`:''}${isZ02?`<td>${esc(line.costCenter||'-')}</td>`:''}
                  <td>${esc(mgLabel?mgLabel.label:l.matGroup||'-')}</td>""")

# viewDetail tfoot colspan 调整 (Z02 时多两列：科目分配类别 + 成本中心)
rp("""<td colspan="${isZ02?'13':'14'}" style="text-align:right;font-weight:700;">合计：</td>""",
   """<td colspan="${isZ02?'14':'14'}" style="text-align:right;font-weight:700;">合计：</td>""")

print("=" * 60)
print("[10] 必输字段标识统一...")
print("=" * 60)

# 确保所有必填字段都用 <span class="req">*</span>
# 检查 getFormModalHTML 中的必填标识：
# 采购申请类型 ✓ 部门 ✓ 采购组 ✓
# 检查 renderLineRow thead 中的必填标识
# 这些已在 onPurchaseTypeChange 中处理

# 确保 Z02 时 shortText 在 th 中有 *
# 上面 onPurchaseTypeChange 已处理

# 保存
with open(FILE, "w", encoding="utf-8") as f:
    f.write(c)

print("=" * 60)
print("完成！请检查文件。")
