// ===== 平台配置（有效期/公司范围等） =====
const sharedInspConfigData={
  platformName:'集团来料检验共享平台',
  version:'V2.1.0',
  effectiveDate:'2025-01-01',
  shareValidityDays:90,
  requireVendorMatch:true,
  autoMatchThreshold:80,
  manualReviewThreshold:60,
  maxShareCount:0,
  enabledCompanies:['1000','2001','2003','2005','2006','2007','2008','2009','2010','2012','2013'],
  sapIntegration:true,
  sapEndpoint:'https://sap-bc.butchang.com/api/qm/inspection',
  notificationEnabled:true,
  notificationReceivers:['质量总监','集团质量部经理','各子公司质量负责人'],
  auditLogRetentionDays:730,
  dataCleanseCron:'0 2 * * 0'
};

const SharedInspConfig={
  render(){
    const c=sharedInspConfigData;
    const companyCheckboxes=sharedInspCompanyOptions.map(o=>`<label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;">
      <input type="checkbox" value="${o.value}" ${c.enabledCompanies.includes(o.value)?'checked':''} style="width:16px;height:16px;"> ${o.label}
    </label>`).join('');
    return`<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="padding:10px 20px;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;flex-shrink:0;">
        <div><div style="font-size:15px;font-weight:700;">平台配置</div><div style="font-size:12px;opacity:0.7;">共享有效期、公司范围、SAP集成、通知策略等参数配置</div></div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:20px 24px;">
        <div class="card" style="margin-bottom:20px;">
          <div class="card-header"><div class="card-title">基础信息</div></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;padding:16px;">
            <div class="form-group"><label>平台名称</label><input type="text" id="sicPlatformName" value="${esc(c.platformName)}" class="sic-input"></div>
            <div class="form-group"><label>版本号</label><input type="text" id="sicVersion" value="${esc(c.version)}" class="sic-input" readonly></div>
            <div class="form-group"><label>生效日期</label><input type="date" id="sicEffDate" value="${c.effectiveDate}" class="sic-input"></div>
          </div>
        </div>
        <div class="card" style="margin-bottom:20px;">
          <div class="card-header"><div class="card-title">共享规则配置</div></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;padding:16px;">
            <div class="form-group"><label>共享有效期（天）</label><input type="number" id="sicValidityDays" value="${c.shareValidityDays}" min="30" max="365" class="sic-input">
              <span style="font-size:11px;color:var(--text-muted);">超过有效期后共享结果将标识为"待审核"</span></div>
            <div class="form-group"><label>自动匹配阈值（%）</label><input type="number" id="sicAutoThreshold" value="${c.autoMatchThreshold}" min="50" max="100" class="sic-input">
              <span style="font-size:11px;color:var(--text-muted);">匹配度>=此值自动采纳，否则需人工审核</span></div>
            <div class="form-group"><label>人工审核阈值（%）</label><input type="number" id="sicManualThreshold" value="${c.manualReviewThreshold}" min="0" max="80" class="sic-input">
              <span style="font-size:11px;color:var(--text-muted);">匹配度低于此值禁止引用，必须独立检验</span></div>
            <div class="form-group"><label>是否要求供应商一致</label>
              <select id="sicVendorMatch" class="sic-input"><option value="true" ${c.requireVendorMatch?'selected':''}>是（必须同一供应商）</option><option value="false" ${!c.requireVendorMatch?'selected':''}>否（允许不同供应商）</option></select></div>
            <div class="form-group"><label>最大共享引用次数</label><input type="number" id="sicMaxShare" value="${c.maxShareCount}" min="0" class="sic-input">
              <span style="font-size:11px;color:var(--text-muted);">0=不限制</span></div>
          </div>
        </div>
        <div class="card" style="margin-bottom:20px;">
          <div class="card-header"><div class="card-title">参与共享的公司范围</div></div>
          <div style="padding:16px;">
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">勾选的公司将参与检验结果共享（可查询其他公司结果，也可被其他公司查询）</p>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">${companyCheckboxes}</div>
          </div>
        </div>
        <div class="card" style="margin-bottom:20px;">
          <div class="card-header"><div class="card-title">SAP集成配置</div></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;padding:16px;">
            <div class="form-group"><label>启用SAP集成</label>
              <select id="sicSapEnabled" class="sic-input"><option value="true" ${c.sapIntegration?'selected':''}>启用</option><option value="false" ${!c.sapIntegration?'selected':''}>停用</option></select></div>
            <div class="form-group full"><label>SAP接口地址</label><input type="text" id="sicSapEndpoint" value="${esc(c.sapEndpoint)}" class="sic-input" placeholder="SAP QM模块API地址"></div>
          </div>
        </div>
        <div class="card" style="margin-bottom:20px;">
          <div class="card-header"><div class="card-title">通知策略</div></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;padding:16px;">
            <div class="form-group"><label>启用通知</label>
              <select id="sicNotifyEnabled" class="sic-input"><option value="true" ${c.notificationEnabled?'selected':''}>启用</option><option value="false" ${!c.notificationEnabled?'selected':''}>停用</option></select></div>
            <div class="form-group full"><label>通知接收人（分号分隔）</label><input type="text" id="sicNotifyReceivers" value="${esc(c.notificationReceivers.join('; '))}" class="sic-input"></div>
          </div>
        </div>
        <div class="card" style="margin-bottom:20px;">
          <div class="card-header"><div class="card-title">数据管理</div></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;padding:16px;">
            <div class="form-group"><label>日志保留天数</label><input type="number" id="sicLogRetention" value="${c.auditLogRetentionDays}" min="90" max="3650" class="sic-input"></div>
            <div class="form-group"><label>数据清理定时</label><input type="text" id="sicCleanCron" value="${esc(c.dataCleanseCron)}" class="sic-input" placeholder="Cron表达式"></div>
          </div>
        </div>
        <div style="display:flex;gap:12px;justify-content:flex-end;padding:0 0 20px;">
          <button class="btn btn-secondary" onclick="SharedInspConfig.resetConfig()">恢复默认</button>
          <button class="btn btn-primary" onclick="SharedInspConfig.saveConfig()">💾 保存配置</button>
        </div>
      </div>
    </div>`;
  },

  init(){ /* 配置页面无需特殊初始化 */ },

  saveConfig(){
    const c=sharedInspConfigData;
    c.platformName=document.getElementById('sicPlatformName').value.trim()||c.platformName;
    c.effectiveDate=document.getElementById('sicEffDate').value||c.effectiveDate;
    c.shareValidityDays=parseInt(document.getElementById('sicValidityDays').value)||c.shareValidityDays;
    c.autoMatchThreshold=parseInt(document.getElementById('sicAutoThreshold').value)||c.autoMatchThreshold;
    c.manualReviewThreshold=parseInt(document.getElementById('sicManualThreshold').value)||c.manualReviewThreshold;
    c.requireVendorMatch=document.getElementById('sicVendorMatch').value==='true';
    c.maxShareCount=parseInt(document.getElementById('sicMaxShare').value)||0;
    c.sapIntegration=document.getElementById('sicSapEnabled').value==='true';
    c.sapEndpoint=document.getElementById('sicSapEndpoint').value.trim()||c.sapEndpoint;
    c.notificationEnabled=document.getElementById('sicNotifyEnabled').value==='true';
    c.notificationReceivers=(document.getElementById('sicNotifyReceivers').value||'').split(';').map(s=>s.trim()).filter(Boolean);
    c.auditLogRetentionDays=parseInt(document.getElementById('sicLogRetention').value)||c.auditLogRetentionDays;
    c.dataCleanseCron=document.getElementById('sicCleanCron').value.trim()||c.dataCleanseCron;
    // 更新公司范围
    c.enabledCompanies=Array.from(document.querySelectorAll('.card input[type="checkbox"]:checked')).map(el=>el.value);
    toast('配置已保存！\n版本：'+c.version+'\n共享公司数：'+c.enabledCompanies.length);
  },

  resetConfig(){
    showModal('确认恢复默认',
      '<p style="font-size:14px;color:var(--danger);">确定要恢复所有配置为默认值吗？此操作不可撤销。</p>',
      [{text:'取消',cls:'btn-secondary',action:closeModal},
       {text:'确认恢复',cls:'btn-primary',action:()=>{
        const defaults={platformName:'集团来料检验共享平台',version:'V2.1.0',effectiveDate:'2025-01-01',shareValidityDays:90,requireVendorMatch:true,autoMatchThreshold:80,manualReviewThreshold:60,maxShareCount:0,enabledCompanies:['1000','2001','2003','2005','2006','2007','2008','2009','2010','2012','2013'],sapIntegration:true,sapEndpoint:'https://sap-bc.butchang.com/api/qm/inspection',notificationEnabled:true,notificationReceivers:['质量总监','集团质量部经理','各子公司质量负责人'],auditLogRetentionDays:730,dataCleanseCron:'0 2 * * 0'};
        Object.assign(sharedInspConfigData,defaults);
        closeModal();document.getElementById('contentArea').innerHTML=SharedInspConfig.render();SharedInspConfig.init();
        toast('配置已恢复为默认值');
      }}]);
  }
};
