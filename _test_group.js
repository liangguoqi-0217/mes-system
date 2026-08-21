const groupHtml = function(group) {
  if (group.placeholder) {
    return '<div class="hb-group hb-placeholder">' +
      '<div class="hb-group-header" style="cursor:default;">' +
        '<div style="display:flex;align-items:center;gap:10px;">' +
          '<span class="hb-group-icon">ICON</span>' +
          '<span class="hb-group-name">' + group.name + '</span>' +
        '</div>' +
        '<span class="hb-badge">敬请期待</span>' +
      '</div>' +
    '</div>';
  }
  const items = group.items.map(function(it) {
    const click = it.page ? "navigateTo('" + it.page + "')" : "showToast('功能开发中，敬请期待')";
    const badge = it.page ? '' : '<span class="hb-badge">敬请期待</span>';
    return '<div class="hb-item" onclick="' + click + '">' +
      '<span class="hb-item-name">' + it.name + '</span>' + badge +
      '<span class="hb-item-arrow">&gt;</span>' +
    '</div>';
  }).join('');
  return '<div class="hb-group">' +
    '<div class="hb-group-header" onclick="toggleGroup(this)">' +
      '<div style="display:flex;align-items:center;gap:10px;">' +
        '<span class="hb-group-icon">ICON</span>' +
        '<span class="hb-group-name">' + group.name + '</span>' +
        '<span class="hb-group-count">' + group.items.length + ' 项</span>' +
      '</div>' +
      '<span class="hb-arrow">V</span>' +
    '</div>' +
    '<div class="hb-group-items">' + items + '</div>' +
  '</div>';
};
const HOME_GROUPS = [
  { name: '设备管理', items: [{name:'设备信息',page:'device'},{name:'故障代码',page:'faultcode'}] },
  { name: '维修管理', items: [{name:'维修通知单',page:'notification'},{name:'维修工单',page:null},{name:'预防性维护',page:null}] },
  { name: '库存管理', items: [{name:'库存查询',page:'inventory'}] },
  { name: '生产管理', placeholder: true },
  { name: '质量管理', placeholder: true }
];
const html = HOME_GROUPS.map(groupHtml).join('\n');
console.log(html);
console.log('--- Total length:', html.length);
