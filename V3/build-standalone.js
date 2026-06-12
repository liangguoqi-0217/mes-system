const fs = require('fs');
const h = fs.readFileSync('main.html', 'utf8');
const c = fs.readFileSync('css/common.css', 'utf8');
const jf = ['js/data.js','js/app.js','js/pages/equipment-master.js','js/pages/functional-location.js','js/pages/work-center.js','js/pages/equipment-bom.js','js/pages/spare-parts-stock.js','js/pages/sp-purchase.js','js/pages/sp-pick.js','js/main.js'];
let js = '';
jf.forEach(f => { js += fs.readFileSync(f, 'utf8') + '\n'; });

let body = h.match(/<body>([\s\S]*)<\/body>/)[1];
body = body.replace(/<link[^>]*css\/common\.css[^>]*>/, '');
body = body.replace(/<script>[\s\S]*?window\.onerror[\s\S]*?<\/script>/, '');
body = body.replace(/<script src="js\/[^"]+"><\/script>/g, '');

const out = '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1.0">\n<title>MES系统</title>\n<style>' + c + '</style>\n</head>\n<body>' + body + '\n<script>' + js + '\n</script>\n</body>\n</html>';

fs.writeFileSync('standalone.html', out, 'utf8');
console.log('Done! Size:', out.length);
