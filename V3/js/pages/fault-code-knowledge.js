// ===== Fault Code Knowledge Page =====
const FaultCodeKnowledge = {
  selectedDir: 'A',
  selectedGroupId: null,
  selectedCode: null,
  expandedDirs: {A: true, B: false, C: false},
  expandedGroups: {},
  searchKeyword: '',
  searchResults: null,
  recommendMode: false,
  selectedEquipment: null,
  equipmentSearchText: '',
  equipmentSearchResults: [],
  recommendKeyword: '',
  recommendResults: null,

  _dirMeta: {
    A: { key:'A', label:'故障现象', clsSuffix:'SymptomGroups', codeClsSuffix:'Symptoms', color:'#3B82F6', bg:'#eff6ff' },
    B: { key:'B', label:'故障原因', clsSuffix:'CauseGroups', codeClsSuffix:'Causes', color:'#F59E0B', bg:'#fffbeb' },
    C: { key:'C', label:'解决措施', clsSuffix:'RemedyGroups', codeClsSuffix:'Remedies', color:'#10B981', bg:'#ecfdf5' }
  },

  _getGroups(dir) {
    if (dir === 'A') return window.faultCodeSymptomGroups || [];
    if (dir === 'B') return window.faultCodeCauseGroups || [];
    return window.faultCodeRemedyGroups || [];
  },

  _getRecommendations(code) {
    const recs = window.faultCodeRecommendations || {};
    return recs[code] || null;
  },

  render() {
    this._initState();
    return `<div style="display:flex;flex-direction:column;height:calc(100vh - 56px);">
      <div style="background:linear-gradient(135deg,#1E3A5F,#2D5A87);color:white;padding:14px 24px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:18px;font-weight:700;">故障代码知识库</div>
          <div style="font-size:12px;opacity:0.8;">三层代码体系 · 智能推荐 · 只读查阅</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          ${this.recommendMode ? `<div style="position:relative;">
            <input id="fckbSearch" placeholder="搜索代码/描述..." value="${esc(this.searchKeyword)}"
              style="padding:7px 14px 7px 32px;border:none;border-radius:20px;font-size:13px;width:220px;outline:none;background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.2);"
              onkeydown="if(event.key==='Enter')FaultCodeKnowledge.doSearch()">
            <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:14px;opacity:0.6;">&#128269;</span>
          </div>
          <button onclick="FaultCodeKnowledge.doSearch()"
            style="padding:6px 14px;background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3);border-radius:6px;font-size:12px;cursor:pointer;">搜索</button>` : ''}
          <button onclick="FaultCodeKnowledge.toggleRecommend()"
            style="padding:6px 14px;background:${this.recommendMode?'#F59E0B':'rgba(255,255,255,0.2)'};color:white;border:1px solid rgba(255,255,255,0.3);border-radius:6px;font-size:12px;cursor:pointer;font-weight:600;">
            ${this.recommendMode ? '浏览模式' : '智能推荐'}</button>
        </div>
      </div>
      <div style="flex:1;display:flex;overflow:hidden;">
        ${this._renderLeftPanel()}
        ${this._renderRightPanel()}
      </div>
      <div style="flex-shrink:0;padding:8px 24px;background:#f0f2f5;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;text-align:center;">
        此页面仅供查看，如需新增、修改或停用故障代码，请联系IT管理员（系统配置 → 故障代码体系管理）
      </div>
    </div>`;
  },

  init() {
    this._initState();
  },

  _initState() {
    if (!this._initializedForSession) {
      this.selectedDir = 'A';
      this.selectedGroupId = null;
      this.selectedCode = null;
      this.expandedDirs = {A: true, B: false, C: false};
      this.expandedGroups = {};
      this.searchResults = null;
      this._initializedForSession = true;
    }
  },

  _renderLeftPanel() {
    if (this.searchResults) {
      return this._renderSearchTree();
    }

    let html = `<div style="width:320px;flex-shrink:0;background:white;border-right:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;">
      <div style="flex:1;overflow-y:auto;padding:4px 0;user-select:none;">`;

    ['A','B','C'].forEach((dir, dirIndex) => {
      const meta = this._dirMeta[dir];
      const groups = this._getGroups(dir);
      const isExpanded = this.expandedDirs[dir];
      const isActive = this.selectedDir === dir && !this.selectedGroupId && !this.selectedCode;
      const isLastDir = dirIndex === 2;

      html += `<div class="tree-row ${isActive?'tree-row-active':''}" onclick="FaultCodeKnowledge.toggleDir('${dir}')"
        style="display:flex;align-items:center;gap:4px;padding:6px 8px 6px 4px;cursor:pointer;border-radius:4px;margin:1px 0;transition:background .15s;font-size:13px;">
        <span class="tree-toggle" style="cursor:pointer;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;color:#94a3b8;flex-shrink:0;border-radius:3px;background:#f1f5f9;">${isExpanded ? '&#9660;' : '&#9654;'}</span>
        <span style="width:6px;height:6px;border-radius:50%;background:${meta.color};flex-shrink:0;margin:0 4px;"></span>
        <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700;">${meta.label} (${dir})</span>
        <span style="font-size:10px;color:#94a3b8;flex-shrink:0;">${groups.length}组</span>
      </div>`;

      if (isExpanded && groups.length > 0) {
        groups.forEach((g, groupIndex) => {
          const groupExpanded = this.expandedGroups[g.groupId] || false;
          const groupActive = this.selectedGroupId === g.groupId && !this.selectedCode;
          const isLastGroup = groupIndex === groups.length - 1;

          let prefix1 = `<span style="display:inline-block;width:20px;position:relative;">`;
          for (let i = 0; i < 1; i++) {
            prefix1 += `<span style="position:absolute;left:${i*20+9}px;top:0;bottom:0;width:0;border-left:1px solid #e2e8f0;"></span>`;
          }
          prefix1 += `</span>`;

          html += `<div class="tree-row ${groupActive?'tree-row-active':''}" onclick="FaultCodeKnowledge.selectGroup('${dir}','${g.groupId}')"
            style="display:flex;align-items:center;gap:4px;padding:6px 8px 6px 4px;cursor:pointer;border-radius:4px;margin:1px 0;transition:background .15s;font-size:13px;">
            ${prefix1}
            <span class="tree-toggle" onclick="event.stopPropagation();FaultCodeKnowledge.toggleGroup('${g.groupId}')"
              style="cursor:pointer;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;color:#94a3b8;flex-shrink:0;border-radius:3px;background:#f1f5f9;">${groupExpanded ? '&#9660;' : '&#9654;'}</span>
            <span style="width:6px;height:6px;border-radius:50%;background:${meta.color};flex-shrink:0;margin:0 4px;opacity:0.5;"></span>
            <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;">${esc(g.groupName)}</span>
            <span style="font-size:10px;color:#94a3b8;flex-shrink:0;">${g.codes.length}</span>
          </div>`;

          if (groupExpanded && g.codes.length > 0) {
            g.codes.forEach((c, codeIndex) => {
              const codeActive = this.selectedCode && this.selectedCode.code === c.code;
              const isLastCode = codeIndex === g.codes.length - 1;

              let prefix2 = `<span style="display:inline-block;width:40px;position:relative;">`;
              for (let i = 0; i < 2; i++) {
                prefix2 += `<span style="position:absolute;left:${i*20+9}px;top:0;bottom:0;width:0;border-left:1px solid #e2e8f0;"></span>`;
              }
              prefix2 += `</span>`;

              html += `<div class="tree-row ${codeActive?'tree-row-active':''}" onclick="FaultCodeKnowledge.selectCode('${dir}','${g.groupId}')"
                data-code="${esc(c.code)}" data-desc="${esc(c.desc)}"
                style="display:flex;align-items:center;gap:4px;padding:6px 8px 6px 4px;cursor:pointer;border-radius:4px;margin:1px 0;transition:background .15s;font-size:12px;">
                ${prefix2}
                <span style="width:18px;flex-shrink:0;"></span>
                <span style="width:6px;height:6px;border-radius:50%;background:${meta.color};flex-shrink:0;margin:0 4px;opacity:0.25;"></span>
                <span style="font-weight:600;margin-right:8px;white-space:nowrap;">${esc(c.code)}</span>
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-secondary);">${esc(c.desc)}</span>
              </div>`;
            });
          }
        });
      }
    });

    html += `</div></div>`;
    return html;
  },

  _renderSearchTree() {
    const sr = this.searchResults;
    if (!sr || sr.length === 0) {
      return `<div style="width:320px;flex-shrink:0;background:white;border-right:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;">
        <div style="padding:16px;text-align:center;color:var(--text-muted);font-size:13px;">
          <div style="font-size:48px;margin-bottom:12px;color:#cbd5e1;">&#128269;</div>
          <div>未找到匹配的故障代码，请尝试其他关键词。</div>
          <button onclick="FaultCodeKnowledge.clearSearch()" style="margin-top:12px;padding:6px 16px;background:var(--primary-lighter);color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">返回浏览</button>
        </div>
      </div>`;
    }

    let html = `<div style="width:320px;flex-shrink:0;background:white;border-right:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;">
      <div style="padding:10px 12px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:12px;color:var(--text-secondary);">搜索"${esc(this.searchKeyword)}" · ${sr.length}条结果</span>
        <button onclick="FaultCodeKnowledge.clearSearch()" style="font-size:11px;color:var(--primary-lighter);background:none;border:none;cursor:pointer;">&#10005; 清除</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:4px 8px;">`;

    sr.forEach(item => {
      const meta = this._dirMeta[item.dir];
      html += `<div class="tree-row" onclick="FaultCodeKnowledge.selectCodeFromSearch('${item.dir}','${item.groupId}','${esc(item.code)}')"
        style="display:flex;align-items:center;gap:4px;padding:6px 8px;cursor:pointer;border-radius:4px;margin:1px 0;transition:background .15s;font-size:12px;">
        <span style="width:6px;height:6px;border-radius:50%;background:${meta.color};flex-shrink:0;margin:0 4px;"></span>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:600;color:var(--text);">${esc(item.code)}</div>
          <div style="color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(item.desc)}</div>
        </div>
        <span style="font-size:10px;color:#94a3b8;margin-left:8px;white-space:nowrap;background:#f1f5f9;padding:2px 6px;border-radius:3px;">${meta.label}</span>
      </div>`;
    });

    html += `</div></div>`;
    return html;
  },

  _renderRightPanel() {
    if (this.recommendMode) {
      return this._renderRecommendPanel();
    }

    if (this.searchResults) {
      return `<div style="flex:1;min-width:0;display:flex;align-items:center;justify-content:center;background:#f0f2f5;overflow-y:auto;">
        <div style="text-align:center;color:var(--text-muted);padding:40px;">
          <div style="font-size:48px;margin-bottom:12px;color:#cbd5e1;">&#9776;</div>
          <div style="font-size:15px;">请从左侧选择代码查看详情</div>
          <div style="font-size:12px;margin-top:4px;">搜索匹配到 ${this.searchResults.length} 条结果</div>
        </div>
      </div>`;
    }

    if (this.selectedCode) {
      return this._renderCodeDetail();
    }

    if (this.selectedGroupId) {
      return this._renderGroupDetail();
    }

    const meta = this._dirMeta[this.selectedDir];
    const groups = this._getGroups(this.selectedDir);
    const totalCodes = groups.reduce((sum, g) => sum + g.codes.length, 0);

    return `<div style="flex:1;min-width:0;padding:24px;background:#f0f2f5;overflow-y:auto;">
      <div style="background:white;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.06);text-align:center;max-width:500px;margin:0 auto;">
        <div style="width:48px;height:48px;border-radius:50%;background:${meta.bg};display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:${meta.color};margin:0 auto 16px;">${this.selectedDir}</div>
        <div style="font-size:20px;font-weight:700;color:#1f2937;margin-bottom:8px;">${meta.label}</div>
        <div style="display:inline-block;padding:4px 14px;background:#e5e7eb;border-radius:12px;font-size:13px;font-weight:600;color:#6b7280;margin-bottom:16px;">${this.selectedDir}</div>
        <div style="font-size:14px;color:#374151;margin-bottom:8px;">
          共 <strong style="color:#1E3A5F;font-size:20px;">${groups.length}</strong> 个代码组，<strong style="color:#1E3A5F;font-size:20px;">${totalCodes}</strong> 个代码
        </div>
        <div style="font-size:13px;color:#9ca3af;margin-top:12px;padding-top:16px;border-top:1px solid #f3f4f6;">
          请展开左侧代码组并点击具体代码查看详情与智能推荐
        </div>
      </div>
    </div>`;
  },

  _renderGroupDetail() {
    const meta = this._dirMeta[this.selectedDir];
    const groups = this._getGroups(this.selectedDir);
    const group = groups.find(g => g.groupId === this.selectedGroupId);
    if (!group) return this._renderEmptyRight();

    let html = `<div style="flex:1;min-width:0;overflow-y:auto;padding:24px;background:#f0f2f5;">
      <div style="background:white;border-radius:10px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:16px;">
        <div style="display:flex;align-items:center;margin-bottom:16px;">
          <span style="width:8px;height:8px;border-radius:50%;background:${meta.color};flex-shrink:0;margin-right:10px;"></span>
          <div>
            <div style="font-size:18px;font-weight:700;">${esc(group.groupName)}</div>
            <div style="font-size:12px;color:#6b7280;">所属目录：${meta.label} (${this.selectedDir})</div>
          </div>
        </div>
        <div style="padding:12px 16px;background:${meta.bg};border-radius:8px;margin-bottom:16px;font-size:13px;color:#4b5563;line-height:1.6;">
          ${esc(group.groupDesc)}
        </div>
        <div style="overflow-x:auto;">
          <table class="data-table" style="font-size:13px;">
            <thead><tr>
              <th style="width:100px;">代码</th><th>描述</th><th style="width:160px;">适用设备类型</th><th style="width:80px;text-align:center;">引用次数</th>
            </tr></thead>
            <tbody>`;

    group.codes.forEach(c => {
      const eqTags = (c.equipTypes || []).map(t =>
        `<span style="display:inline-block;padding:1px 8px;background:${meta.bg};color:${meta.color};border-radius:10px;font-size:11px;margin:1px 3px;">${esc(t)}</span>`
      ).join('') || '-';

      const isSelected = this.selectedCode && this.selectedCode.code === c.code;
      html += `<tr style="cursor:pointer;${isSelected?'background:'+meta.bg+';':''}"
        onclick="FaultCodeKnowledge.selectCodeDetail('${this.selectedDir}','${group.groupId}','${esc(c.code)}','${esc(c.desc)}')"
        onmouseenter="if(!${isSelected})this.style.background='#f8fafc';" onmouseleave="if(!${isSelected})this.style.background=''">
        <td><strong>${esc(c.code)}</strong></td>
        <td>${esc(c.desc)}</td>
        <td>${eqTags}</td>
        <td style="text-align:center;"><span class="badge ${c.refCount>=10?'badge-blue':'badge-gray'}">${c.refCount}次</span></td>
      </tr>`;
    });

    html += `</tbody></table></div>
        <div style="margin-top:12px;font-size:12px;color:#9ca3af;">
          适用设备类型：${esc((group.equipTypes||[]).join('、') || '全部')}
        </div>
      </div>
    </div>`;
    return html;
  },

  _renderCodeDetail() {
    const meta = this._dirMeta[this.selectedDir];
    const sc = this.selectedCode;

    const groups = this._getGroups(this.selectedDir);
    let parentGroup = null;
    for (const g of groups) {
      if (g.codes.some(c => c.code === sc.code)) { parentGroup = g; break; }
    }

    let html = `<div style="flex:1;min-width:0;overflow-y:auto;padding:24px;background:#f0f2f5;">
      <div style="background:white;border-radius:10px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:20px;">
        <div style="display:flex;align-items:flex-start;margin-bottom:20px;">
          <span style="width:8px;height:8px;border-radius:50%;background:${meta.color};flex-shrink:0;margin-right:12px;margin-top:8px;"></span>
          <div style="flex:1;">
            <div style="font-size:20px;font-weight:700;margin-bottom:4px;">${esc(sc.code)}</div>
            <div style="font-size:14px;color:#6b7280;">${esc(sc.desc)}</div>
          </div>
        </div>
        <div class="detail-grid" style="margin-bottom:0;">
          <div class="detail-item"><dt>所属目录</dt><dd>${meta.label} (${this.selectedDir})</dd></div>
          <div class="detail-item"><dt>所属代码组</dt><dd>${esc(parentGroup?parentGroup.groupName:'-')}</dd></div>
          <div class="detail-item"><dt>适用设备</dt><dd>${esc((sc.equipTypes||[]).join('、') || '-')}</dd></div>
          <div class="detail-item"><dt>引用次数</dt><dd><span class="badge ${sc.refCount>=10?'badge-blue':'badge-gray'}">${sc.refCount}次</span></dd></div>
        </div>
      </div>`;

    if (this.selectedDir === 'A') {
      html += this._renderSmartRecommend(sc.code);
    } else {
      html += `<div style="background:white;border-radius:10px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.06);text-align:center;">
        <div style="font-size:14px;color:#9ca3af;">智能推荐仅对故障现象(A)代码开放，查看原因/措施代码时不展示推荐。</div>
      </div>`;
    }

    html += `</div>`;
    return html;
  },

  _renderSmartRecommend(symptomCode) {
    const rec = this._getRecommendations(symptomCode);
    if (!rec || rec.totalRecords < 10) {
      const count = rec ? rec.totalRecords : 0;
      return `<div style="background:white;border-radius:10px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
        <div style="font-size:16px;font-weight:700;margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid #e5e7eb;">智能推荐</div>
        <div style="text-align:center;padding:20px;color:#9ca3af;">
          <div style="font-size:48px;margin-bottom:12px;color:#cbd5e1;">&#9783;</div>
          <div style="font-size:14px;color:#6b7280;">数据积累不足，暂无法提供推荐。</div>
          <div style="font-size:12px;margin-top:4px;">当前已记录 ${count} 次，需 ≥10 次后自动开启。</div>
        </div>
      </div>`;
    }

    const barColor1 = '#3B82F6';
    const barColor2 = '#10B981';

    const renderRecTable = (items, label, color) => {
      if (!items || !items.length) return '';
      let rows = '';
      items.forEach((r, i) => {
        rows += `<tr style="border-bottom:1px solid #f1f5f9;${i%2===0?'background:#fafbfc':''}">
          <td style="padding:8px 12px;text-align:center;font-weight:700;color:${i===0?color:'#6b7280'};">${i+1}</td>
          <td style="padding:8px 12px;font-weight:600;">${esc(r.code)}</td>
          <td style="padding:8px 12px;">${esc(r.desc)}</td>
          <td style="padding:8px 12px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <div style="flex:1;height:8px;background:#f1f5f9;border-radius:4px;overflow:hidden;">
                <div style="height:100%;width:${r.ratio}%;background:${color};border-radius:4px;transition:width .5s;"></div>
              </div>
              <span style="font-size:11px;font-weight:600;white-space:nowrap;min-width:32px;">${r.ratio}%</span>
            </div>
          </td>
        </tr>`;
      });
      return `<div style="margin-bottom:16px;">
        <div style="font-weight:600;font-size:14px;margin-bottom:10px;color:#1f2937;">${label}</div>
        <div style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead><tr style="background:#f8fafc;">
              <th style="padding:8px 12px;text-align:center;width:50px;">排名</th>
              <th style="padding:8px 12px;width:100px;">代码</th>
              <th style="padding:8px 12px;">描述</th>
              <th style="padding:8px 12px;width:130px;">占比</th>
            </tr></thead>
            <tbody>${rows}</tbody></table></div></div>`;
    };

    return `<div style="background:white;border-radius:10px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid #e5e7eb;">
        <div style="font-size:16px;font-weight:700;">智能推荐</div>
        <div style="font-size:11px;color:#9ca3af;">数据：近12个月 · 共${rec.totalRecords}张工单 · 计算日期：${rec.calcDate}</div>
      </div>
      ${renderRecTable(rec.causes, '该现象最常见的故障原因', barColor1)}
      ${renderRecTable(rec.remedies, '该现象最常用的解决措施', barColor2)}
      <div style="text-align:right;margin-top:12px;">
        <button onclick="FaultCodeKnowledge.viewRelatedOrders('${symptomCode}')"
          style="padding:8px 16px;background:var(--primary-lighter);color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">查看关联历史工单 &rarr;</button>
      </div>
    </div>`;
  },

  _renderEmptyRight() {
    return `<div style="flex:1;display:flex;align-items:center;justify-content:center;background:var(--bg);overflow-y:auto;">
      <div style="text-align:center;color:var(--text-muted);padding:40px;">
        <div style="font-size:48px;margin-bottom:12px;color:#cbd5e1;">&#9776;</div>
        <div style="font-size:15px;">请从左侧选择目录类型、代码组或代码</div>
      </div>
    </div>`;
  },

  toggleDir(dir) {
    this.expandedDirs[dir] = !this.expandedDirs[dir];
    this.selectedDir = dir;
    if (!this.expandedDirs[dir]) {
      this.selectedGroupId = null;
      this.selectedCode = null;
    }
    this._rerender();
  },

  toggleGroup(groupId) {
    this.expandedGroups[groupId] = !this.expandedGroups[groupId];
    this._rerender();
  },

  selectGroup(dir, groupId) {
    this.selectedDir = dir;
    this.expandedDirs[dir] = true;

    if (this.selectedGroupId === groupId && !this.selectedCode) {
      this.expandedGroups[groupId] = !this.expandedGroups[groupId];
    } else {
      this.selectedGroupId = groupId;
      this.selectedCode = null;
      this.expandedGroups[groupId] = true;
    }
    this._rerender();
  },

  selectCode(dir, groupId) {
    this.selectedDir = dir;
    this.expandedDirs[dir] = true;
    this.selectedGroupId = groupId;
    this.expandedGroups[groupId] = true;

    const el = event && event.currentTarget;
    if (el) {
      const code = el.getAttribute('data-code');
      const desc = el.getAttribute('data-desc');
      if (code) {
        const groups = this._getGroups(dir);
        for (const g of groups) {
          const found = g.codes.find(c => c.code === code);
          if (found) {
            this.selectedCode = found;
            break;
          }
        }
        if (!this.selectedCode) {
          this.selectedCode = { code, desc: desc || '', equipTypes: [], refCount: 0 };
        }
      }
    }
    this._rerender();
  },

  selectCodeDetail(dir, groupId, code, desc) {
    this.selectedDir = dir;
    this.selectedGroupId = groupId;
    const groups = this._getGroups(dir);
    for (const g of groups) {
      const found = g.codes.find(c => c.code === code);
      if (found) { this.selectedCode = found; break; }
    }
    if (!this.selectedCode) {
      this.selectedCode = { code, desc, equipTypes: [], refCount: 0 };
    }
    this._rerender();
  },

  selectCodeFromSearch(dir, groupId, code) {
    this.searchResults = null;
    this.searchKeyword = '';
    const groups = this._getGroups(dir);
    this.selectedDir = dir;
    this.expandedDirs[dir] = true;
    this.selectedGroupId = groupId;
    this.expandedGroups[groupId] = true;

    for (const g of groups) {
      const found = g.codes.find(c => c.code === code);
      if (found) { this.selectedCode = found; break; }
    }
    if (!this.selectedCode) {
      this.selectedCode = { code, desc: '', equipTypes: [], refCount: 0 };
    }
    this._rerender();
  },

  doSearch() {
    const input = document.getElementById('fckbSearch');
    const keyword = (input ? input.value : '').trim();
    if (!keyword) {
      this.clearSearch();
      return;
    }
    this.searchKeyword = keyword;
    const q = keyword.toLowerCase();
    const results = [];

    [{dir:'A',groups:this._getGroups('A')},{dir:'B',groups:this._getGroups('B')},{dir:'C',groups:this._getGroups('C')}].forEach(dg => {
      dg.groups.forEach(g => {
        g.codes.forEach(c => {
          if (c.code.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || g.groupName.toLowerCase().includes(q)) {
            results.push({ dir: dg.dir, groupId: g.groupId, groupName: g.groupName, code: c.code, desc: c.desc });
          }
        });
      });
    });

    this.searchResults = results;
    this.selectedCode = null;
    this.selectedGroupId = null;
    this._rerender();
  },

  clearSearch() {
    this.searchKeyword = '';
    this.searchResults = null;
    this.selectedCode = null;
    this.selectedGroupId = null;
    this._rerender();
  },

  viewRelatedOrders(symptomCode) {
    const records = workOrderFaultRecords.filter(r => r.phenomenonSnap && r.phenomenonSnap.includes(symptomCode));
    if (!records.length) {
      toast('暂无关联工单记录');
      return;
    }
    let body = `<div style="font-size:13px;">引用 <strong>${esc(symptomCode)}</strong> 的历史工单：</div>
      <div style="margin-top:12px;overflow-x:auto;"><table class="data-table" style="font-size:12px;">
        <thead><tr><th>工单号</th><th>故障现象</th><th>故障原因</th><th>解决措施</th><th>补充说明</th></tr></thead>
        <tbody>`;
    records.forEach(r => {
      body += `<tr>
        <td>${esc(r.AUFNR||'-')}</td>
        <td>${esc(r.phenomenonSnap||'-')}</td>
        <td>${esc(r.causeSnap||'-')}</td>
        <td>${esc(r.measureSnap||'-')}</td>
        <td>${esc(r.customText||'-')}</td>
      </tr>`;
    });
    body += `</tbody></table></div>`;
    showModal(`关联工单 · ${esc(symptomCode)}`, body, [{text:'关闭',cls:'btn-secondary',action:closeModal}], 'modal-lg');
  },

  toggleRecommend() {
    this.recommendMode = !this.recommendMode;
    if (!this.recommendMode) {
      this.selectedEquipment = null;
      this.equipmentSearchText = '';
      this.equipmentSearchResults = [];
      this.recommendKeyword = '';
      this.recommendResults = null;
    }
    this._rerender();
  },

  handleEquipmentSearch() {
    const input = document.getElementById('fckbEquipSearch');
    if (!input) return;
    this.equipmentSearchText = input.value.trim();
    if (!this.equipmentSearchText) {
      this.equipmentSearchResults = [];
      this._updateEquipmentSearchUI();
      return;
    }
    const q = this.equipmentSearchText.toLowerCase();
    const eqData = equipmentData;
    const results = [];
    eqData.forEach(e => {
      const codeMatch = e.code && e.code.toLowerCase().includes(q);
      const nameMatch = e.name && e.name.toLowerCase().includes(q);
      const typeMatch = e.typeName && e.typeName.toLowerCase().includes(q);
      if (codeMatch || nameMatch || typeMatch) {
        results.push({
          code: e.code, name: e.name, typeName: e.typeName || '',
          score: (codeMatch ? 3 : 0) + (nameMatch ? 2 : 0) + (typeMatch ? 1 : 0)
        });
      }
    });
    results.sort((a, b) => b.score - a.score);
    this.equipmentSearchResults = results.slice(0, 10);
    this._updateEquipmentSearchUI();
  },

  _updateEquipmentSearchUI() {
    const dropdown = document.getElementById('fckbEquipDropdown');
    if (!dropdown) return;
    if (!this.equipmentSearchResults.length) {
      dropdown.innerHTML = this.equipmentSearchText
        ? '<div style="padding:10px;font-size:12px;color:#9ca3af;text-align:center;">未找到匹配设备</div>'
        : '';
      return;
    }
    dropdown.innerHTML = this.equipmentSearchResults.map(e =>
      `<div onclick="FaultCodeKnowledge.selectEquipment('${esc(e.code)}')"
        style="padding:10px 12px;cursor:pointer;font-size:13px;border-bottom:1px solid #f1f5f9;transition:background .1s;"
        onmouseenter="this.style.background='#eff6ff';" onmouseleave="this.style.background=''">
        <div style="font-weight:600;color:#1f2937;">${esc(e.code)}</div>
        <div style="color:#6b7280;font-size:12px;">${esc(e.name)} ${e.typeName?'<span style="color:#9ca3af;">· '+esc(e.typeName)+'</span>':''}</div>
      </div>`
    ).join('');
  },

  selectEquipment(equipCode) {
    const eqData = equipmentData;
    this.selectedEquipment = eqData.find(e => e.code === equipCode) || null;
    this.equipmentSearchText = this.selectedEquipment ? (this.selectedEquipment.code + ' ' + this.selectedEquipment.name) : '';
    this.equipmentSearchResults = [];
    this.recommendResults = null;
    if (this.recommendKeyword && this.selectedEquipment) {
      this.doRecommend();
    }
    this._rerender();
  },

  handleKeywordInput() {
    const input = document.getElementById('fckbKeywordInput');
    if (!input) return;
    this.recommendKeyword = input.value.trim();
    if (this.recommendKeyword && this.selectedEquipment) {
      this.doRecommend();
    } else if (!this.recommendKeyword) {
      this.recommendResults = null;
      const resultDiv = document.getElementById('fckbRecommendResult');
      if (resultDiv) resultDiv.innerHTML = '';
    }
  },

  doRecommend() {
    const keyword = this.recommendKeyword;
    const equip = this.selectedEquipment;
    if (!keyword || !equip) return;

    const results = [];
    const q = keyword.toLowerCase();
    const keywords = q.replace(/[,，。；;、\s]+/g, ' ').split(' ').filter(k => k.length >= 1);

    [{dir:'A',meta:this._dirMeta.A,groups:this._getGroups('A')},
     {dir:'B',meta:this._dirMeta.B,groups:this._getGroups('B')},
     {dir:'C',meta:this._dirMeta.C,groups:this._getGroups('C')}].forEach(dg => {
      dg.groups.forEach(g => {
        g.codes.forEach(c => {
          let score = 0;
          const codeText = (c.code + ' ' + c.desc + ' ' + g.groupName).toLowerCase();

          keywords.forEach(kw => {
            if (codeText.includes(kw)) score += 10;
          });

          if (c.code.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)) {
            score += 20;
          }

          let equipBonus = 0;
          if (c.equipTypes && c.equipTypes.length) {
            if (equip.typeName && c.equipTypes.includes(equip.typeName)) equipBonus = 30;
            else if (equip.type && c.equipTypes.some(t => t && equip.type && t.includes(equip.type))) equipBonus = 20;
            else equipBonus = 5;
          } else {
            equipBonus = 10;
          }
          score += equipBonus;

          if (score > 0) {
            results.push({
              dir: dg.dir, groupId: g.groupId, groupName: g.groupName,
              code: c.code, desc: c.desc,
              equipTypes: c.equipTypes || [], refCount: c.refCount || 0,
              score: Math.min(100, Math.round(score * 1.2)),
              type: 'faultCode', meta: dg.meta
            });
          }
        });
      });
    });

    const faultRecords = workOrderFaultRecords;
    faultRecords.forEach(r => {
      let score = 0;
      const recText = ((r.AUFNR || '') + ' ' + (r.phenomenonSnap || '') + ' ' + (r.causeSnap || '') + ' ' + (r.measureSnap || '')).toLowerCase();
      keywords.forEach(kw => {
        if (recText.includes(kw)) score += 8;
      });
      if (score > 0) {
        results.push({
          dir: 'WO', groupId: '', groupName: '工单故障记录',
          code: r.AUFNR || '-', desc: (r.phenomenonSnap || '') + ' → ' + (r.measureSnap || r.causeSnap || ''),
          equipTypes: [], refCount: 0,
          score: Math.min(95, Math.round(score * 1.5)),
          type: 'workOrder', meta: { color: '#8B5CF6', bg: '#f5f3ff' }
        });
      }
    });

    results.sort((a, b) => b.score - a.score);
    this.recommendResults = results.filter(r => r.score >= 15).slice(0, 15);

    const resultDiv = document.getElementById('fckbRecommendResult');
    if (resultDiv) {
      if (!this.recommendResults.length) {
        resultDiv.innerHTML = `<div style="text-align:center;padding:24px;color:#9ca3af;">
          <div style="font-size:48px;margin-bottom:12px;color:#cbd5e1;">&#9776;</div>
          <div style="font-size:14px;">未找到匹配结果</div>
          <div style="font-size:12px;margin-top:4px;">尝试调整关键词或更换设备</div>
        </div>`;
      } else {
        resultDiv.innerHTML = `<div style="font-size:13px;color:#6b7280;margin-bottom:12px;font-weight:600;">
          找到 <strong style="color:#1E3A5F;">${this.recommendResults.length}</strong> 条推荐结果</div>`
          + this.recommendResults.map((r, i) => {
            const scoreColor = r.score >= 80 ? '#059669' : r.score >= 50 ? '#2563eb' : '#d97706';
            const bgColor = r.score >= 80 ? '#ecfdf5' : r.score >= 50 ? '#eff6ff' : '#fffbeb';
            const tagColors = { A: '#3B82F6', B: '#F59E0B', C: '#10B981', WO: '#8B5CF6' };
            const tagBgs = { A: '#eff6ff', B: '#fffbeb', C: '#ecfdf5', WO: '#f5f3ff' };
            const tagLabels = { A: '现象', B: '原因', C: '措施', WO: '工单' };

            return `<div style="border:1px solid #e5e7eb;border-radius:8px;padding:14px;margin-bottom:8px;cursor:pointer;transition:all .15s;background:white;"
              onclick="${r.type === 'faultCode' ? `FaultCodeKnowledge.selectCodeDetail('${r.dir}','${r.groupId}','${esc(r.code)}','${esc(r.desc)}');FaultCodeKnowledge.recommendMode=false;` : ''}"
              onmouseenter="this.style.borderColor='var(--primary-lighter)';this.style.boxShadow='0 2px 10px rgba(0,0,0,0.06)';"
              onmouseleave="this.style.borderColor='#e5e7eb';this.style.boxShadow='none';">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="width:26px;height:26px;border-radius:50%;background:${tagBgs[r.dir]};color:${tagColors[r.dir]};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">${r.dir}</span>
                  <span style="font-weight:700;font-size:13px;color:#1f2937;">${esc(r.code)}</span>
                  <span style="padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;background:${tagBgs[r.dir]};color:${tagColors[r.dir]};">${tagLabels[r.dir]||r.dir}</span>
                </div>
                <div style="display:flex;align-items:center;gap:6px;">
                  <div style="width:60px;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden;">
                    <div style="height:100%;width:${r.score}%;background:${scoreColor};border-radius:3px;transition:width .3s;"></div>
                  </div>
                  <span style="font-size:11px;font-weight:700;color:${scoreColor};min-width:32px;">${r.score}%</span>
                </div>
              </div>
              <div style="font-size:12px;color:#4b5563;line-height:1.5;">${esc(r.desc)}</div>
              <div style="font-size:11px;color:#9ca3af;margin-top:4px;">
                ${r.groupName ? esc(r.groupName) : ''}
                ${r.equipTypes.length ? (r.groupName ? ' · ' : '') + esc(r.equipTypes.join('、')) : ''}
                ${r.refCount ? ' · 引用 ' + r.refCount + ' 次' : ''}
              </div>
            </div>`;
          }).join('')
          + `<div style="font-size:11px;color:#9ca3af;margin-top:8px;text-align:center;">点击故障代码条目可跳转查看详情</div>`;
      }
    }
  },

  _renderRecommendPanel() {
    const equip = this.selectedEquipment;

    return `<div style="flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden;">
      <div style="flex:1;overflow-y:auto;padding:24px;background:#f0f2f5;">
        <div style="max-width:720px;margin:0 auto;">

          <div style="background:white;border-radius:12px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:20px;">
            <div style="font-size:17px;font-weight:700;color:#1f2937;margin-bottom:20px;display:flex;align-items:center;gap:8px;">
              <span>智能推荐引擎</span>
            </div>

            <div style="margin-bottom:16px;">
              <label style="font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:6px;">选择目标设备</label>
              <div style="position:relative;">
                <input id="fckbEquipSearch" placeholder="输入设备编码/名称/类型进行模糊搜索..."
                  value="${esc(this.equipmentSearchText)}"
                  oninput="FaultCodeKnowledge.handleEquipmentSearch()"
                  style="width:100%;padding:10px 14px;border:1px solid ${equip?'#10B981':'#d1d5db'};border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;transition:border-color .15s;"
                  onfocus="this.style.borderColor='#3B82F6';"
                  onblur="setTimeout(()=>{document.getElementById('fckbEquipDropdown').innerHTML='';FaultCodeKnowledge.equipmentSearchResults=[];},200);this.style.borderColor='${equip?'#10B981':'#d1d5db'}'">
                <div id="fckbEquipDropdown"
                  style="position:absolute;top:100%;left:0;right:0;background:white;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;max-height:240px;overflow-y:auto;z-index:10;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                </div>
              </div>
              ${equip ? `<div style="margin-top:8px;padding:10px 14px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;font-size:13px;display:flex;align-items:center;gap:8px;">
                <span style="color:#059669;">&#10003;</span>
                <span><strong>${esc(equip.code)}</strong> ${esc(equip.name)}</span>
                ${equip.typeName ? `<span style="color:#6b7280;">· ${esc(equip.typeName)}</span>` : ''}
                <button onclick="FaultCodeKnowledge.selectedEquipment=null;FaultCodeKnowledge.equipmentSearchText='';FaultCodeKnowledge.recommendResults=null;FaultCodeKnowledge._rerender();"
                  style="margin-left:auto;padding:2px 8px;background:#fee2e2;color:#dc2626;border:none;border-radius:4px;font-size:11px;cursor:pointer;">&#10005; 清除</button>
              </div>` : ''}
            </div>

            <div style="margin-bottom:8px;">
              <label style="font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:6px;">故障描述 / 关键词</label>
              <textarea id="fckbKeywordInput" rows="3" placeholder="输入故障现象、关键词或描述（如：泵驱动端轴承振动超标、密封泄漏...）"
                oninput="FaultCodeKnowledge.handleKeywordInput()"
                style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;resize:vertical;transition:border-color .15s;"
                onfocus="this.style.borderColor='#3B82F6';"
                onblur="this.style.borderColor='#d1d5db'">${esc(this.recommendKeyword)}</textarea>
            </div>

            <div style="font-size:12px;color:#9ca3af;line-height:1.6;">
              匹配范围：全部故障代码（现象/原因/措施）+ 历史工单故障记录<br>
              匹配算法：设备类型匹配 + 关键词相似度综合评分
            </div>
          </div>

          <div id="fckbRecommendResult" style="background:white;border-radius:12px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.06);min-height:120px;">
            ${this.recommendResults === null
              ? `<div style="text-align:center;padding:32px;color:#9ca3af;">
                  <div style="font-size:48px;margin-bottom:12px;color:#cbd5e1;">&#9776;</div>
                  <div style="font-size:14px;font-weight:600;color:#6b7280;">请在上述区域选择设备并输入关键词</div>
                  <div style="font-size:12px;margin-top:4px;">系统将实时匹配并推荐相关故障代码与历史工单</div>
                </div>`
              : ''}
          </div>
        </div>
      </div>
    </div>`;
  },

  _rerender() {
    const ca = document.getElementById('contentArea');
    if (ca) ca.innerHTML = this.render();
  }
};
