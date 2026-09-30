// 临时静态服务器：仅用于预览 V3/demo 下的方案对比页面
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = 'd:/我的项目/MES系统/V3';
const port = 8099;

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/' || p === '') p = '/demo/naive-layout.html';
  const f = path.join(root, p);
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); res.end('404'); return; }
    const ext = path.extname(f);
    const type = ext === '.html' ? 'text/html; charset=utf-8'
      : ext === '.css' ? 'text/css; charset=utf-8'
      : ext === '.js' ? 'application/javascript; charset=utf-8'
      : 'text/plain; charset=utf-8';
    res.writeHead(200, { 'Content-Type': type });
    res.end(d);
  });
}).listen(port, () => console.log('serving on http://localhost:' + port));
