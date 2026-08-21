// ===== 9. 小程序 — 移动端适配视图 =====
// 嵌入自研小程序页面（miniapp/device-info.html，含登录页的最新版本）
const MiniProgram = {
  render() {
    // v=3 版本参数用于绕过浏览器对 iframe 内容的缓存，确保加载最新原型
    return `<iframe src="../miniapp/device-info.html?v=3" style="width:100%;height:calc(100vh - 56px);border:none;display:block;" scrolling="auto"></iframe>`;
  },

  init() {
    // 小程序页面通过 iframe 加载，无需额外初始化
  }
};
