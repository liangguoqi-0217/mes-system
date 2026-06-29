FILE = r'd:\我的项目\MES系统\V3\js\pages\sp-purchase.js'
with open(FILE, 'r', encoding='utf-8') as f:
    c = f.read()

# Fix 1: viewDetail header field order
old1 = ('''                <div class="detail-item"><dt>采购申请类型</dt><dd><strong>${esc(ptLabel?ptLabel.label:pr.purchaseType||'-')}</strong></dd></div>
                <div class="detail-item"><dt>申请编号</dt><dd><strong>${esc(pr.docNo)}</strong></dd></div>
                <div class="detail-item"><dt>申请日期</dt><dd>${esc(pr.applyDate)}</dd></div>
                <div class="detail-item"><dt>工厂</dt><dd>${esc(pr.plant)}</dd></div>
                <div class="detail-item"><dt>部门</dt><dd>${esc(pr.dept)}</dd></div>
                <div class="detail-item"><dt>采购组</dt><dd>${esc(pgLabel?pgLabel.label:pr.purchaseGroup||'-')}</dd></div>''')

new1 = ('''                <div class="detail-item"><dt>采购申请类型</dt><dd><strong>${esc(ptLabel?ptLabel.label:pr.purchaseType||'-')}</strong></dd></div>
                <div class="detail-item"><dt>申请编号</dt><dd><strong>${esc(pr.docNo)}</strong></dd></div>
                <div class="detail-item"><dt>部门</dt><dd>${esc(pr.dept)}</dd></div>
                <div class="detail-item"><dt>采购组</dt><dd>${esc(pgLabel?pgLabel.label:pr.purchaseGroup||'-')}</dd></div>
                <div class="detail-item"><dt>工厂</dt><dd>${esc(pr.plant)}</dd></div>
                <div class="detail-item"><dt>申请日期</dt><dd>${esc(pr.applyDate)}</dd></div>''')

if old1 in c:
    c = c.replace(old1, new1)
    print('[OK] Fix 1: header order')
else:
    print('[SKIP] Fix 1')

# Fix 2: viewDetail thead - always show both columns
old2 = "<th>项次</th>${isZ01?'<th>物料</th>':''}<th>短文本</th>${isZ02?'<th>科目分配类别</th>':''}${isZ02?'<th>成本中心</th>':''}<th>物料组</th><th>申请人</th><th>采购订单</th><th style=\"text-align:right;\">申请数量</th><th>单位</th>"
new2 = "<th>项次</th>${isZ01?'<th>物料</th>':''}<th>短文本</th><th>科目分配类别</th><th>成本中心</th><th>物料组</th><th>申请人</th><th>采购订单</th><th style=\"text-align:right;\">申请数量</th><th>单位</th>"

if old2 in c:
    c = c.replace(old2, new2)
    print('[OK] Fix 2: thead')
else:
    print('[SKIP] Fix 2')

# Fix 3: viewDetail tbody
old3 = "${isZ02?'<td>${esc(acctLabel?acctLabel.label:l.acctAssCategory||'-')}</td>':''}${isZ02?'<td>${esc(l.costCenter||'-')}</td>':''}\n                  <td>${esc(mgLabel?mgLabel.label:l.matGroup||'-')}</td>"
new3 = "<td>${esc(acctLabel?acctLabel.label:l.acctAssCategory||'-')}</td>\n                  <td>${esc(l.costCenter||'-')}</td>\n                  <td>${esc(mgLabel?mgLabel.label:l.matGroup||'-')}</td>"

if old3 in c:
    c = c.replace(old3, new3)
    print('[OK] Fix 3: tbody')
else:
    print('[SKIP] Fix 3')

# Fix 4: tfoot colspan - find the actual line and replace
# After fix 2+3, Z01 has 17 cols, Z02 has 16 cols
# tfoot colspan = total cols - 1
import re
pattern = r'<td colspan="\$\{isZ02\?\'.*?\':\'.*?\'}" style="text-align:right;font-weight:700;">合计：</td>'
match = re.search(pattern, c)
if match:
    old4 = match.group(0)
    new4 = '<td colspan="${isZ02?\'15\':\'16\'}" style="text-align:right;font-weight:700;">合计：</td>'
    c = c.replace(old4, new4)
    print('[OK] Fix 4: tfoot colspan')
else:
    print('[SKIP] Fix 4 - searching manually...')
    for i, line in enumerate(c.split('\n')):
        if 'colspan' in line and '合计' in line:
            print(f'  Line {i+1}: {line.strip()[:150]}')

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(c)

print('\nDone!')
