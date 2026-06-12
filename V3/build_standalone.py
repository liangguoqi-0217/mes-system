import re

base = r'c:\Users\Lenovo\CodeBuddy\20260528164347\v2'

# Read main.html
with open(f'{base}\\main.html', 'r', encoding='utf-8') as f:
    h = f.read()

# --- Extract inline layout <style> from head ---
head_match = re.search(r'<head>([\s\S]*?)</head>', h)
head_html = head_match.group(1) if head_match else ''
# Extract the <style> block (the layout styles after the CSS link)
style_match = re.search(r'<style>([\s\S]*?)</style>', head_html)
inline_style = style_match.group(0) if style_match else ''

# Read CSS
with open(f'{base}\\css\\common.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Read all JS files in order (must match main.html <script src="..."> order exactly)
js_files = [
    'js/data.js',
    'js/app.js',
    'js/core/persistence.js',
    'js/pages/material-master.js',
    'js/pages/equipment-master.js',
    'js/pages/functional-location.js',
    'js/pages/work-center.js',
    'js/pages/equipment-bom.js',
    'js/pages/measurement-point.js',
    'js/pages/measurement-record.js',
    'js/pages/spare-parts-stock.js',
    'js/pages/sp-purchase.js',
    'js/pages/sp-pick.js',
    'js/pages/maintenance-preventive.js',
    'js/pages/maintenance-notification-v3.js',
    'js/pages/maintenance-workorder-v3.js',
    'js/pages/maintenance-knowledge.js',
    'js/pages/maintenance-reports.js',
    'js/pages/maintenance-tasklist.js',
    'js/pages/fault-code-knowledge.js',
    'js/pages/fault-code-miniapp.js',
    'js/main.js',
]

js = ''
for fn in js_files:
    with open(f'{base}\\{fn}', 'r', encoding='utf-8') as fh:
        js += fh.read() + '\n'

# Extract body content
body_match = re.search(r'<body>([\s\S]*)</body>', h)
body = body_match.group(1) if body_match else ''

# Remove CSS link
body = re.sub(r'<link[^>]*css/common\.css[^>]*>', '', body)

# Remove JS src script tags (keep inline scripts like error handler)
body = re.sub(r'\s*<script src="js/[^"]+"></script>', '', body)

# Build the standalone HTML
out = (
    '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n'
    '<meta charset="UTF-8">\n'
    '<meta name="viewport" content="width=device-width,initial-scale=1.0">\n'
    '<title>MES系统</title>\n'
    '<style>' + css + '</style>\n'
    + inline_style + '\n'
    '</head>\n<body>'
    + body + '\n'
    '<script>\n' + js + '\n</script>\n'
    '</body>\n</html>'
)

with open(f'{base}\\standalone.html', 'w', encoding='utf-8') as f:
    f.write(out)

print(f'Done! Size: {len(out)} chars')

# === Verification ===
# 1. Verify layout CSS is included
layout_checks = [
    ('.app-layout', 'flex layout wrapper'),
    ('.sidebar {', 'sidebar base'),
    ('.main-area', 'main content area'),
    ('.content-area', 'content area styling'),
    ('.homepage {', 'homepage layout'),
    ('.homepage-bg-img', 'homepage bg image styling'),
    ('.nav-item', 'nav item styling'),
    ('margin-left: 260px', 'sidebar margin offset'),
]
all_ok = True
for css_class, desc in layout_checks:
    if css_class in out:
        print(f'  [OK] Layout CSS: {desc}')
    else:
        print(f'  [MISSING] Layout CSS: {desc}')
        all_ok = False

# 2. Verify no <!-- in script
script_start = out.find('<script>\n// ===== data.js =====')
script_end = out.rfind('</script>')
if script_start >= 0 and script_end > script_start:
    script_js = out[script_start:script_end]
    count = script_js.count('<!--')
    print(f'  [{ "OK" if count == 0 else "FAIL" }] <!-- in script: {count}')

# 3. Verify critical JS
for kw in ['App.init', 'DOMContentLoaded', 'spPurchaseData', 'sparePartsStockData', 'SpPurchase.filteredFlat']:
    found = kw in out
    if not found:
        print(f'  [MISSING] JS keyword: {kw}')
        all_ok = False
    else:
        print(f'  [OK] JS keyword: {kw}')

# 4. Verify error handler
has_onerror = 'window.onerror' in out
print(f'  [{"OK" if has_onerror else "WARN"}] window.onerror handler: {has_onerror}')
# Also check for try-catch
has_trycatch = 'try {' in out
print(f'  [{"OK" if has_trycatch else "WARN"}] try-catch: {has_trycatch}')

if all_ok:
    print('\n=== BUILD SUCCESSFUL ===')
else:
    print('\n=== BUILD COMPLETED WITH WARNINGS ===')
