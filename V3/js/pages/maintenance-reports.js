// ===== 2.4 设备维修履历与报表 =====
const MaintenanceReports = {
  activeTab:'reports',

  render() {
    return `
    <div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="background:linear-gradient(135deg,var(--primary),var(--primary-light));color:white;padding:16px 24px;flex-shrink:0;">
        <div style="font-size:18px;font-weight:700;">设备维修履历与报表</div>
        <div style="font-size:13px;opacity:0.8;">MTTR/MTBF分析 | 故障排行 | 设备一生维修记录</div>
      </div>
      <div style="display:flex;gap:0;padding:8px 24px;background:white;border-bottom:1px solid var(--border);flex-shrink:0;">
        <button onclick="MaintenanceReports.switchTab('reports')" id="rptTabReports" style="padding:8px 18px;border:none;background:${this.activeTab==='reports'?'var(--primary)':'transparent'};color:${this.activeTab==='reports'?'white':'var(--text-secondary)'};border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s;margin-right:6px;">报表看板</button>
        <button onclick="MaintenanceReports.switchTab('history')" id="rptTabHistory" style="padding:8px 18px;border:none;background:${this.activeTab==='history'?'var(--primary)':'transparent'};color:${this.activeTab==='history'?'white':'var(--text-secondary)'};border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s;">设备维修履历</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:20px 24px;" id="rptContent">
        ${this.activeTab==='reports'?this.renderReports():this.renderHistory()}
      </div>
    </div>`;
  },

  init() { this.activeTab='reports'; },

  switchTab(name) {
    this.activeTab=name;
    const contentArea=document.getElementById('contentArea');
    if(contentArea)contentArea.innerHTML=this.render();
  },

  // 报表看板
  renderReports() {
    const reports=maintenanceReportData;
    if(!reports) return '<div style="text-align:center;padding:60px;color:var(--text-muted);">暂无报表数据</div>';

    // 工单执行统计
    let orderHtml=`<div style="background:white;border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:16px;">
      <div style="font-weight:700;font-size:15px;margin-bottom:16px;">工单执行情况</div>
      <div style="overflow-x:auto;"><table class="data-table" style="font-size:13px;">
        <thead><tr><th>期间</th><th>工单总数</th><th>已完成</th><th>完成率</th><th>平均工时(h)</th><th>平均成本(¥)</th></tr></thead>
        <tbody>`;

    const maxOrders=Math.max(...reports.orderExecStats.map(r=>r.totalOrders),1);
    reports.orderExecStats.forEach(r=>{
      const pct=((r.completed/r.totalOrders)*100).toFixed(1);
      const color=pct>=90?'var(--success)':pct>=75?'var(--warning)':'var(--danger)';
      orderHtml+=`<tr>
        <td><strong>${esc(r.period)}</strong></td>
        <td>${r.totalOrders}</td><td>${r.completed}</td>
        <td><span style="color:${color};font-weight:600;">${pct}%</span></td>
        <td>${r.avgHours}</td><td>${r.avgCost.toLocaleString()}</td>
      </tr>`;
    });
    orderHtml+=`</tbody></table></div></div>`;

    // MTTR/MTBF 图表
    let mttrHtml=`<div style="background:white;border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:16px;">
      <div style="font-weight:700;font-size:15px;margin-bottom:16px;">设备可靠性分析 (MTTR / MTBF)</div>
      <div style="display:flex;gap:20px;flex-wrap:wrap;">
        <div style="flex:1;min-width:300px;">
          <div style="font-weight:600;font-size:13px;margin-bottom:10px;color:var(--danger);">MTTR - 平均修复时间 (小时)</div>
          <div style="display:flex;align-items:flex-end;gap:8px;height:160px;padding:0 4px 20px 4px;border-bottom:2px solid var(--border);">`;

    const maxMttr=Math.max(...reports.mttrMtbf.map(r=>r.MTTR),1);
    reports.mttrMtbf.forEach((r,i)=>{
      const h=Math.max((r.MTTR/maxMttr)*130,4);
      mttrHtml+=`<div style="flex:1;text-align:center;">
        <div style="height:${h}px;background:linear-gradient(180deg, #ef4444, #fca5a5);border-radius:4px 4px 0 0;margin-bottom:4px;position:relative;transition:height .5s ease;"
          title="MTTR: ${r.MTTR}h">
          <div style="position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:700;color:var(--danger);white-space:nowrap;">${r.MTTR}h</div>
        </div>
        <div style="font-size:10px;color:var(--text-muted);transform:rotate(-30deg);transform-origin:center;margin-top:4px;">${r.period.replace('2026年','')}</div>
      </div>`;
    });

    mttrHtml+=`</div></div>
      <div style="flex:1;min-width:300px;">
        <div style="font-weight:600;font-size:13px;margin-bottom:10px;color:var(--success);">MTBF - 平均无故障时间 (小时)</div>
        <div style="display:flex;align-items:flex-end;gap:8px;height:160px;padding:0 4px 20px 4px;border-bottom:2px solid var(--border);">`;

    const maxMtbf=Math.max(...reports.mttrMtbf.map(r=>r.MTBF),1);
    reports.mttrMtbf.forEach(r=>{
      const h=Math.max((r.MTBF/maxMtbf)*130,4);
      mttrHtml+=`<div style="flex:1;text-align:center;">
        <div style="height:${h}px;background:linear-gradient(180deg, #059669, #6ee7b7);border-radius:4px 4px 0 0;margin-bottom:4px;transition:height .5s ease;"
          title="MTBF: ${r.MTBF}h">
          <div style="position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:700;color:#059669;white-space:nowrap;">${r.MTBF}h</div>
        </div>
        <div style="font-size:10px;color:var(--text-muted);transform:rotate(-30deg);transform-origin:center;margin-top:4px;">${r.period.replace('2026年','')}</div>
      </div>`;
    });
    mttrHtml+=`</div></div></div>
      <div style="margin-top:12px;padding:10px 14px;background:#f8fafc;border-radius:6px;font-size:12px;color:var(--text-secondary);line-height:1.6;">
        📐 <strong>MTTR</strong> (平均修复时间) = 总修复时间 ÷ 故障次数 | <strong>MTBF</strong> (平均无故障时间) = 运行总时间 ÷ 故障次数
      </div>
    </div>`;

    // 故障排行榜 (帕累托)
    let paretoHtml=`<div style="background:white;border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:16px;">
      <div style="font-weight:700;font-size:15px;margin-bottom:16px;">故障原因帕累托分析 (TOP10)</div>
      <div style="display:flex;gap:20px;">`;

    // 图表
    const maxCount=Math.max(...reports.top10Failures.map(f=>f.count),1);
    paretoHtml+=`<div style="flex:1;min-width:260px;">`;
    let cumPct=0;
    reports.top10Failures.forEach((f,idx)=>{
      cumPct+=f.pct;
      paretoHtml+=`<div style="margin-bottom:8px;display:flex;align-items:center;gap:8px;">
        <span style="width:14px;font-size:11px;color:var(--text-muted);text-align:right;">${idx+1}</span>
        <span style="font-size:11px;color:var(--text-secondary);width:80px;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(f.name)}">${esc(f.name)}</span>
        <div style="flex:1;height:18px;background:#f1f5f9;border-radius:3px;overflow:hidden;position:relative;">
          <div style="height:100%;width:${(f.count/maxCount)*100}%;background:linear-gradient(90deg, var(--primary-lighter), #60a5fa);border-radius:3px;transition:width .4s ease;"></div>
        </div>
        <span style="width:36px;font-size:11px;font-weight:600;color:var(--text);text-align:right;">${f.count}</span>
        <span style="width:42px;font-size:10px;color:var(--text-muted);text-align:right;">${cumPct}%</span>
      </div>`;
    });
    paretoHtml+=`<div style="margin-top:8px;font-size:11px;color:var(--text-muted);text-align:right;">累积百分比</div></div>`;

    // 表格
    paretoHtml+=`<div style="flex:1;min-width:200px;">
      <table class="data-table" style="font-size:12px;">
        <thead><tr><th>#</th><th>故障原因</th><th>次数</th><th>占比</th></tr></thead><tbody>`;
    reports.top10Failures.forEach((f,idx)=>{
      paretoHtml+=`<tr>
        <td>${idx+1}</td><td>${esc(f.name)}</td>
        <td style="font-weight:600;">${f.count}</td>
        <td><span style="color:${idx<3?'var(--danger)':'var(--text-secondary)'};">${f.pct}%</span></td>
      </tr>`;
    });
    paretoHtml+=`</tbody></table></div></div></div>`;

    return orderHtml+mttrHtml+paretoHtml;
  },

  // 设备维修履历
  renderHistory() {
    const eqOpts=equipmentData.map(e=>`<option value="${esc(e.code)}">${esc(e.name)} (${esc(e.code)})</option>`).join('');

    return `<div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding:16px;background:white;border:1px solid var(--border);border-radius:10px;">
        <label style="font-weight:600;font-size:13px;white-space:nowrap;">选择设备</label>
        <select id="rptSelectEq" onchange="MaintenanceReports._onEqChange()" style="flex:1;max-width:400px;padding:8px 12px;border:1px solid var(--border);border-radius:6px;">
          <option value="">请选择要查看履历的设备...</option>${eqOpts}
        </select>
      </div>
      <div id="rptEquipHistory"></div>
    </div>`;
  },

  _onEqChange() {
    const eqCode=document.getElementById('rptSelectEq').value;
    const container=document.getElementById('rptEquipHistory');
    if(!container)return;
    if(!eqCode){container.innerHTML='';return;}

    const eq=equipmentData.find(e=>e.code===eqCode);
    if(!eq)return;

    // 找到该设备相关的通知单
    const notifs=notificationV2Data.filter(n=>n.EQUNR===eqCode);
    // 找到该设备相关的工单
    const orders=workOrderV2Data.filter(w=>w.EQUNR===eqCode);
    // 该设备相关的测量点
    const measurementPoints=measurementPointData.filter(mp=>mp.equipmentId===eq.id);
    // 该设备相关的测量记录
    const records=measurementRecordData.filter(r=>r.equipmentId===eq.id);
    // 该设备相关的报警
    const alerts=alertEventData.filter(a=>a.equipmentId===eq.id);

    const totalMaintenance=orders.length;
    const faultOrders=orders.filter(w=>w.faultPhenomenon).length;
    const totalMats=materialComponentV2Data.filter(m=>orders.some(w=>w.id===m.orderId)).length;

    // 设备统计概览卡片
    let html=`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-bottom:20px;">
      <div class="stat-card" style="background:white;border:1px solid var(--border);border-radius:8px;padding:16px;">
        <div class="stat-label">维修次数</div><div class="stat-value">${totalMaintenance}</div>
        <div style="font-size:11px;color:var(--text-muted);">含故障维修${faultOrders}次</div>
      </div>
      <div class="stat-card" style="background:white;border:1px solid var(--border);border-radius:8px;padding:16px;">
        <div class="stat-label">消耗物料</div><div class="stat-value">${totalMats}</div>
        <div style="font-size:11px;color:var(--text-muted);">种备件</div>
      </div>
      <div class="stat-card" style="background:white;border:1px solid var(--border);border-radius:8px;padding:16px;">
        <div class="stat-label">测量点</div><div class="stat-value">${measurementPoints.length}</div>
        <div style="font-size:11px;color:var(--text-muted);">共${records.length}条记录</div>
      </div>
      <div class="stat-card" style="background:white;border:1px solid var(--border);border-radius:8px;padding:16px;">
        <div class="stat-label">报警事件</div><div class="stat-value">${alerts.length}</div>
        <div style="font-size:11px;color:var(--text-muted);">${alerts.filter(a=>a.status==='pending').length}条待处理</div>
      </div>
    </div>`;

    // 设备一生时间线
    html+=`<div style="background:white;border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:16px;">
      <div style="font-weight:700;font-size:15px;margin-bottom:16px;">📋 维修时间线</div>`;

    if(orders.length===0&&notifs.length===0){
      html+=`<div style="text-align:center;padding:40px;color:var(--text-muted);">该设备暂无维修记录</div>`;
    } else {
      html+=`<div style="position:relative;padding-left:30px;">`;
      html+=`<div style="position:absolute;left:12px;top:0;bottom:0;width:2px;background:var(--border);"></div>`;

      // 合并排序时间线
      const timeline=[];
      orders.forEach(w=>{
        timeline.push({type:'order',time:w.createdAt||w.GSTRP,data:w,icon:'🔧'});
      });
      notifs.forEach(n=>{
        timeline.push({type:'notif',time:n.createdAt||n.QMDAT,data:n,icon:'📢'});
      });
      alerts.forEach(a=>{
        timeline.push({type:'alert',time:a.createdAt,data:a,icon:'⚠️'});
      });
      timeline.sort((a,b)=>b.time.localeCompare(a.time));

      timeline.forEach(item=>{
        let color, bg, title, desc;
        if(item.type==='order'){
          if(item.data.STAT==='CLSD'){color='var(--text-muted)';bg='#f8fafc';}
          else if(item.data.STAT==='COMP'){color='var(--success)';bg='#f0fdf4';}
          else if(item.data.STAT==='EXEC'){color='#7c3aed';bg='#f5f3ff';}
          else{color='var(--warning)';bg='#fffbeb';}
          title=`工单 ${esc(item.data.AUFNR)}`;
          desc=item.data.KURZTEXT;
        } else if(item.type==='notif'){
          if(item.data.STAT==='ORDP'){color='var(--primary-lighter)';bg='#eff6ff';}
          else if(item.data.STAT==='NOCO'){color='var(--text-muted)';bg='#f8fafc';}
          else{color='var(--warning)';bg='#fffbeb';}
          title=`通知单 ${esc(item.data.QMNUM)}`;
          desc=item.data.FENAM;
        } else {
          color='var(--danger)';bg='#fef2f2';
          title=`测量点报警`;
          desc=item.data.description;
        }
        html+=`
          <div style="position:relative;margin-bottom:16px;padding:14px 16px;border:1px solid var(--border);border-radius:8px;background:${bg};border-left:3px solid ${color};">
            <div style="position:absolute;left:-24px;top:14px;width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 0 2px ${color};"></div>
            <div style="font-weight:600;font-size:13px;margin-bottom:4px;">${item.icon} ${title}</div>
            <div style="font-size:12px;color:var(--text-secondary);line-height:1.5;">${esc(desc)}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">${esc(item.time)}</div>
          </div>`;
      });
      html+=`</div>`;
    }
    html+=`</div>`;

    // 物料消耗汇总
    const orderIds=orders.map(w=>w.id);
    const allMats=materialComponentV2Data.filter(m=>orderIds.includes(m.orderId));
    if(allMats.length>0){
      html+=`<div style="background:white;border:1px solid var(--border);border-radius:10px;padding:20px;">
        <div style="font-weight:700;font-size:15px;margin-bottom:16px;">📦 历史物料消耗汇总</div>
        <table class="data-table" style="font-size:13px;">
          <thead><tr><th>物料编码</th><th>名称</th><th>需求数量</th><th>单位</th><th>实际领用</th><th>关联工单</th></tr></thead><tbody>`;
      allMats.forEach(m=>{
        const wo=orders.find(w=>w.id===m.orderId);
        html+=`<tr>
          <td>${esc(m.MATNR)}</td><td>${esc(m.MATKTX)}</td><td>${esc(m.BDMNG)}</td>
          <td>${esc(m.MEINS)}</td><td>${esc(m.ENMNG||'-')}</td>
          <td><span style="color:var(--primary-lighter);">${wo?esc(wo.AUFNR):'-'}</span></td>
        </tr>`;
      });
      html+=`</tbody></table></div>`;
    }

    container.innerHTML=html;
  }
};
