// ===== Common App Utilities =====
// 用户身份管理
(function() {
  var params = new URLSearchParams(window.location.search);
  var userId = params.get('user');
  if (!userId) {
    // 尝试从 localStorage 读取上次登录用户
    var saved = localStorage.getItem('pm_v2_current_user');
    if (saved) {
      try { userId = JSON.parse(saved).id; } catch(e) {}
    }
  }
  window.currentUserId = userId || 'admin';
  window.currentUserRole = 'admin'; // 'admin' for full access, 'viewer' for read-only
})();
function esc(s) { return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function toast(msg) { alert(msg); }

function getStatusBadge(status) {
  const m = { running:'运行中',standby:'待机',fault:'故障',maintenance:'维修中',stopped:'停用',scrapped:'报废' };
  const c = { running:'badge-green',standby:'badge-blue',fault:'badge-red',maintenance:'badge-yellow',stopped:'badge-gray',scrapped:'badge-gray' };
  return `<span class="badge ${c[status]||'badge-gray'}">${m[status]||status}</span>`;
}
function getSyncBadge(s) {
  const m = { synced:'已同步',pending:'待同步',failed:'同步失败' };
  const c = { synced:'badge-green',pending:'badge-yellow',failed:'badge-red' };
  return `<span class="badge ${c[s]||'badge-gray'}">${m[s]||s}</span>`;
}
function getFLStatusBadge(s) {
  const m = { active:'正常启用',disabled:'临时停用',invalid:'永久作废' };
  const c = { active:'badge-green',disabled:'badge-yellow',invalid:'badge-red' };
  return `<span class="badge ${c[s]||'badge-gray'}">${m[s]||s}</span>`;
}
function getFLTypeText(t) {
  const m = { plant:'厂区',workshop:'车间',production_line:'产线',workstation:'工位',auxiliary:'辅助区' };
  return m[t] || t;
}

// Modal
function showModal(title, bodyHtml, footerBtns, cls) {
  const backdrop = document.getElementById('modalBackdrop');
  const btns = footerBtns || [{ text:'关闭',cls:'btn-secondary',action:closeModal }];
  backdrop.innerHTML = `<div class="modal ${cls||''}" onclick="event.stopPropagation()">
    <div class="modal-header"><h2 class="modal-title">${title}</h2><button class="modal-close" onclick="closeModal()">×</button></div>
    <div class="modal-body">${bodyHtml}</div>
    <div class="modal-footer">${btns.map(b => `<button class="btn ${b.cls||'btn-secondary'}" onclick="(${b.action.toString()})()">${b.text}</button>`).join('')}</div>
  </div>`;
  backdrop.classList.remove('hidden');
  backdrop.addEventListener('click', closeModal);
}
function closeModal() {
  document.getElementById('modalBackdrop').classList.add('hidden');
}

// Side Panel
function openSidePanel(title, subtitle, bodyHtml) {
  document.getElementById('sidePanelBackdrop').classList.add('show');
  const panel = document.getElementById('sidePanel');
  panel.innerHTML = `
    <div class="side-panel-header">
      <div><div class="modal-title">${title}</div><div style="font-size:12px;color:var(--text-secondary);">${subtitle||''}</div></div>
      <button class="modal-close" onclick="closeSidePanel()">×</button>
    </div>
    <div class="side-panel-body">${bodyHtml}</div>
    <div class="side-panel-footer"><button class="btn btn-secondary" onclick="closeSidePanel()">关闭</button></div>`;
  panel.classList.add('show');
}
function closeSidePanel() {
  document.getElementById('sidePanel').classList.remove('show');
  document.getElementById('sidePanelBackdrop').classList.remove('show');
}
