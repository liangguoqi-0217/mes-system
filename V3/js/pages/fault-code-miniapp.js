// ===== 9. 小程序 — 移动端适配视图 =====
// 嵌入自研小程序页面（miniapp/device-info.html，含登录页的最新版本）
const MiniProgram = {
  render() {
    return `<iframe src="../miniapp/device-info.html" style="width:100%;height:calc(100vh - 56px);border:none;display:block;" scrolling="auto"></iframe>`;
  },

  init() {
    // 小程序页面通过 iframe 加载，无需额外初始化
  }
};
