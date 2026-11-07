window.__ModuleLoader__.load({
  id: 'dsh-layout',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'dsh-layout';

    /* ============================== 文案 ============================== */
    const zh = {
      title: '布局',
      desc: '调整 DSH 界面的结构与几何：三栏顺序、侧栏收纳、面板排序、会话区与设置页尺寸。',
      detected: '已识别界面结构',
      notDetected: '未识别界面结构',
      enable: '启用自定义布局',
      enableHint: '关闭后立即恢复 DSH 默认布局，配置保留。',
      editing: '编辑模式',
      editingHint: '在界面上直接拖动分隔条，浮动工具条里可换预设。',
      presets: '预设',
      presetStandard: '标准',
      presetCompact: '紧缩侧栏',
      presetFocus: '专注',
      presetRightSide: '右栏左置',
      presetWide: '宽屏',
      reset: '恢复默认',
      structure: '区域结构',
      structureHint: '拖动排序三栏、调整宽度、控制显隐。',
      sidebar: '左侧栏',
      center: '会话区',
      rightbar: '右栏',
      bottomBar: '底部条',
      hide: '隐藏',
      width: '宽度',
      minWidth: '最小宽度',
      dragHint: '拖动排序',
      moveUp: '上移',
      moveDown: '下移',
      sidebarBlocks: '侧栏内容',
      sidebarBlocksHint: '排序或隐藏侧栏内部的区块。',
      blockBrand: '品牌行',
      blockNewSession: '新建会话',
      blockPanels: '面板导航',
      blockWorkspaces: '工作区',
      blockFooter: '底部操作',
      panels: '面板导航',
      panelsHint: '左栏面板图标的顺序与显隐；列表来自当前界面。',
      panelsEmpty: '未检测到面板，先打开左栏。',
      conversation: '会话区',
      conversationHint: '会话内容宽度；留空跟随默认列宽。',
      contentWidth: '内容宽度',
      followDefault: '跟随默认',
      settingsPanel: '设置页',
      settingsPanelHint: '设置面板的尺寸、导航宽度与位置偏移。',
      settingsWidth: '面板宽度',
      settingsHeight: '面板高度',
      settingsNav: '导航宽度',
      offsetX: '水平偏移',
      offsetY: '垂直偏移',
      data: '配置',
      exportData: '导出 JSON',
      importData: '导入 JSON',
      importOk: '已导入配置',
      importFail: '导入失败：不是有效的布局配置',
      editLayer: '布局编辑',
      done: '完成',
      handles: '拖动分隔条',
      px: 'px',
      follow: '默认',
      disabledHint: '启用后才会改变界面；右侧预览不需要重启。',
    };
    const en = {
      title: 'Layout',
      desc: 'Adjust the structure and geometry of the DSH interface: column order, sidebar absorption, panel ordering, conversation and settings sizing.',
      detected: 'Interface detected',
      notDetected: 'Interface not detected',
      enable: 'Enable custom layout',
      enableHint: 'Turning this off restores the DSH default layout; your settings are kept.',
      editing: 'Edit mode',
      editingHint: 'Drag the dividers on the interface; switch presets from the floating toolbar.',
      presets: 'Presets',
      presetStandard: 'Standard',
      presetCompact: 'Compact rail',
      presetFocus: 'Focus',
      presetRightSide: 'Right column left',
      presetWide: 'Wide',
      reset: 'Reset',
      structure: 'Region structure',
      structureHint: 'Reorder the three columns, resize them, or hide them.',
      sidebar: 'Sidebar',
      center: 'Conversation',
      rightbar: 'Right column',
      bottomBar: 'Bottom bar',
      hide: 'Hide',
      width: 'Width',
      minWidth: 'Min width',
      dragHint: 'Drag to order',
      moveUp: 'Move up',
      moveDown: 'Move down',
      sidebarBlocks: 'Sidebar content',
      sidebarBlocksHint: 'Order or hide the blocks inside the sidebar.',
      blockBrand: 'Brand row',
      blockNewSession: 'New session',
      blockPanels: 'Panels',
      blockWorkspaces: 'Workspaces',
      blockFooter: 'Footer actions',
      panels: 'Panel navigation',
      panelsHint: 'Order and visibility of the sidebar panel icons, read from the interface.',
      panelsEmpty: 'No panels detected; open the sidebar first.',
      conversation: 'Conversation',
      conversationHint: 'Content width; empty follows the default column width.',
      contentWidth: 'Content width',
      followDefault: 'Default',
      settingsPanel: 'Settings page',
      settingsPanelHint: 'Size, navigation width and offsets of the settings panel.',
      settingsWidth: 'Panel width',
      settingsHeight: 'Panel height',
      settingsNav: 'Navigation width',
      offsetX: 'Horizontal offset',
      offsetY: 'Vertical offset',
      data: 'Configuration',
      exportData: 'Export JSON',
      importData: 'Import JSON',
      importOk: 'Configuration imported',
      importFail: 'Import failed: not a valid layout configuration',
      editLayer: 'Layout edit',
      done: 'Done',
      handles: 'Resize handles',
      px: 'px',
      follow: 'Default',
      disabledHint: 'Nothing changes until enabled; preview applies immediately.',
    };

    /* ============================== 配置 ============================== */
    const STORAGE_KEY = 'dsh-layout/config/v1';
    const REGIONS = ['sidebar', 'center', 'rightbar'];
    const BLOCKS = ['brand', 'new-session', 'panels', 'workspaces', 'footer'];

    const DEFAULT_CONFIG = {
      version: 1,
      enabled: false,
      columns: {
        order: ['sidebar', 'center', 'rightbar'],
        sidebarWidth: 280,
        rightbarWidth: 520,
        centerMinWidth: 400,
        hideSidebar: false,
        hideRightbar: false,
        hideBottom: false,
        resizeHandles: true,
      },
      sidebar: { order: [...BLOCKS], hidden: [], panelOrder: [], panelHidden: [] },
      center: { contentWidth: null },
      settings: { width: null, height: null, navWidth: null, offsetX: 0, offsetY: 0 },
    };

    const ABSENT_TARGETS = {
      ok: false,
      frame: null,
      regions: {},
      sidebarRoot: null,
      blocks: {},
      panels: [],
      conversation: null,
      settings: null,
    };

    function clampInt(value, min, max, fallback) {
      const num = Number(value);
      if (!Number.isFinite(num)) return fallback;
      return Math.min(max, Math.max(min, Math.round(num)));
    }

    function clone(value) {
      return JSON.parse(JSON.stringify(value));
    }

    function uniqValid(list, allowed) {
      if (!Array.isArray(list)) return [];
      const out = [];
      for (const item of list) {
        if (typeof item === 'string' && allowed.includes(item) && !out.includes(item)) out.push(item);
      }
      return out;
    }

    /** 把任意来源（旧版本地存储、导入文件）收束成当前 schema；越界值夹取而不是丢弃。 */
    function normalizeConfig(raw) {
      const base = clone(DEFAULT_CONFIG);
      if (raw === null || typeof raw !== 'object') return base;
      const out = { ...base, version: 1, enabled: raw.enabled === true };
      const col = raw.columns && typeof raw.columns === 'object' ? raw.columns : {};
      const order = uniqValid(col.order, REGIONS);
      for (const region of REGIONS) if (!order.includes(region)) order.push(region);
      out.columns = {
        order,
        sidebarWidth: clampInt(col.sidebarWidth, 180, 640, base.columns.sidebarWidth),
        rightbarWidth: clampInt(col.rightbarWidth, 240, 900, base.columns.rightbarWidth),
        centerMinWidth: clampInt(col.centerMinWidth, 240, 1200, base.columns.centerMinWidth),
        hideSidebar: col.hideSidebar === true,
        hideRightbar: col.hideRightbar === true,
        hideBottom: col.hideBottom === true,
        resizeHandles: col.resizeHandles !== false,
      };
      const sb = raw.sidebar && typeof raw.sidebar === 'object' ? raw.sidebar : {};
      const blockOrder = uniqValid(sb.order, BLOCKS);
      for (const block of BLOCKS) if (!blockOrder.includes(block)) blockOrder.push(block);
      const strings = (list) => (Array.isArray(list) ? list.filter((item) => typeof item === 'string' && item.length > 0).slice(0, 200) : []);
      out.sidebar = {
        order: blockOrder,
        hidden: uniqValid(sb.hidden, BLOCKS),
        panelOrder: [...new Set(strings(sb.panelOrder))],
        panelHidden: [...new Set(strings(sb.panelHidden))],
      };
      const center = raw.center && typeof raw.center === 'object' ? raw.center : {};
      out.center = { contentWidth: center.contentWidth == null ? null : clampInt(center.contentWidth, 520, 1600, null) };
      const settings = raw.settings && typeof raw.settings === 'object' ? raw.settings : {};
      out.settings = {
        width: settings.width == null ? null : clampInt(settings.width, 560, 1400, null),
        height: settings.height == null ? null : clampInt(settings.height, 380, 1200, null),
        navWidth: settings.navWidth == null ? null : clampInt(settings.navWidth, 120, 360, null),
        offsetX: clampInt(settings.offsetX, -600, 600, 0),
        offsetY: clampInt(settings.offsetY, -500, 500, 0),
      };
      return out;
    }

    function readStoredConfig() {
      try {
        const text = window.localStorage.getItem(STORAGE_KEY);
        if (text === null) return null;
        return normalizeConfig(JSON.parse(text));
      } catch (error) {
        console.warn('[dsh-layout] 读取本地布局配置失败，使用默认值', error);
        return null;
      }
    }

    /* ============================== 状态 ============================== */
    let snapshot = {
      config: readStoredConfig() ?? normalizeConfig(null),
      targets: ABSENT_TARGETS,
      ui: { editing: false },
    };
    const listeners = new Set();
    let persistTimer = null;
    let cssFrame = null;

    function notify() {
      for (const listener of listeners) {
        try {
          listener();
        } catch (error) {
          console.warn('[dsh-layout] store listener failed', error);
        }
      }
    }

    function subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }

    function schedulePersist() {
      if (persistTimer !== null) window.clearTimeout(persistTimer);
      persistTimer = window.setTimeout(() => {
        persistTimer = null;
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot.config));
        } catch (error) {
          console.warn('[dsh-layout] 保存本地布局配置失败', error);
        }
      }, 250);
    }

    function schedulePaint() {
      if (cssFrame !== null) return;
      cssFrame = window.requestAnimationFrame(() => {
        cssFrame = null;
        paint();
      });
    }

    function setTargets(targets) {
      const previous = snapshot.targets;
      const signature = targets.ok
        ? `${Object.keys(targets.regions).join(',')}|${targets.panels.map((panel) => panel.label).join('\u0001')}|${targets.settings ? 's' : ''}`
        : '';
      const previousSignature = previous.ok
        ? `${Object.keys(previous.regions).join(',')}|${previous.panels.map((panel) => panel.label).join('\u0001')}|${previous.settings ? 's' : ''}`
        : '';
      if (signature === previousSignature && targets.ok === previous.ok) {
        snapshot = { ...snapshot, targets };
        return false;
      }
      snapshot = { ...snapshot, targets };
      paint();
      notify();
      return true;
    }

    function updateConfig(mutator, options = {}) {
      const draft = clone(snapshot.config);
      mutator(draft);
      if (options.capture === true) captureGeometry(draft);
      snapshot = { ...snapshot, config: normalizeConfig(draft) };
      schedulePersist();
      applyDynamicCss();
      notify();
    }

    function replaceConfig(next) {
      snapshot = { ...snapshot, config: normalizeConfig(next) };
      schedulePersist();
      applyDynamicCss();
      notify();
    }

    function setEditing(editing) {
      if (snapshot.ui.editing === editing) return;
      snapshot = { ...snapshot, ui: { ...snapshot.ui, editing } };
      notify();
    }

    /** 启用布局时，以当前界面的真实宽度作为起点，避免一开开关就跳变。 */
    function captureGeometry(draft) {
      const targets = snapshot.targets;
      const sidebar = targets.regions.sidebar;
      if (sidebar) {
        const width = sidebar.getBoundingClientRect().width;
        if (width > 120) draft.columns.sidebarWidth = clampInt(width, 180, 640, draft.columns.sidebarWidth);
      }
      const rightbar = targets.regions.rightbar;
      const rightbarWidth = rightbar ? rightbar.getBoundingClientRect().width : 0;
      if (rightbarWidth > 100) draft.columns.rightbarWidth = clampInt(rightbarWidth, 240, 900, draft.columns.rightbarWidth);
      else draft.columns.rightbarWidth = clampInt(window.innerWidth * 0.45, 240, 900, draft.columns.rightbarWidth);
      draft.sidebar.panelOrder = targets.panels.map((panel) => panel.label);
      draft.sidebar = { ...draft.sidebar, panelHidden: [] };
    }

    /* ============================== 预设 ============================== */
    const PRESETS = {
      standard: () => ({ enabled: true, columns: { order: ['sidebar', 'center', 'rightbar'], sidebarWidth: 280, rightbarWidth: 520, centerMinWidth: 400, hideSidebar: false, hideRightbar: false, hideBottom: false } }),
      compact: () => ({ enabled: true, columns: { order: ['sidebar', 'center', 'rightbar'], sidebarWidth: 224, rightbarWidth: 480, centerMinWidth: 420, hideSidebar: false, hideRightbar: false, hideBottom: false }, sidebar: { hidden: ['footer'], order: ['brand', 'new-session', 'panels', 'workspaces', 'footer'] } }),
      focus: () => ({ enabled: true, columns: { order: ['sidebar', 'center', 'rightbar'], hideSidebar: true, hideRightbar: true, hideBottom: true, centerMinWidth: 400, sidebarWidth: 280, rightbarWidth: 520 } }),
      rightSide: () => ({ enabled: true, columns: { order: ['rightbar', 'center', 'sidebar'], sidebarWidth: 280, rightbarWidth: 420, centerMinWidth: 400, hideSidebar: false, hideRightbar: false, hideBottom: false } }),
      wide: () => ({ enabled: true, columns: { order: ['sidebar', 'center', 'rightbar'], sidebarWidth: 300, rightbarWidth: 620, centerMinWidth: 520, hideSidebar: false, hideRightbar: false, hideBottom: false }, center: { contentWidth: 1000 } }),
    };

    function applyPreset(name) {
      const factory = PRESETS[name];
      if (factory === undefined) return;
      const patch = factory();
      updateConfig((draft) => {
        draft.enabled = true;
        Object.assign(draft.columns, patch.columns ?? {});
        if (patch.sidebar !== undefined) {
          draft.sidebar.hidden = patch.sidebar.hidden ?? [];
          if (patch.sidebar.order !== undefined) draft.sidebar.order = patch.sidebar.order;
        }
        if (patch.center !== undefined) Object.assign(draft.center, patch.center);
        if (patch.settings !== undefined) Object.assign(draft.settings, patch.settings);
      });
    }

    /* ============================== DOM 识别 ============================== */
    function first(root, selector) {
      return root === null || root === undefined ? null : root.querySelector(selector);
    }

    function classifySidebarBlocks(root) {
      const blocks = {};
      if (!root) return blocks;
      for (const child of root.children) {
        if (child.tagName === 'NAV') {
          blocks.panels = child;
          continue;
        }
        if (child.tagName === 'BUTTON' && blocks['new-session'] === undefined) {
          blocks['new-session'] = child;
          continue;
        }
        if (first(child, '[data-sidebar-toggle]') !== null || first(child, '[data-slot="sidebar.brand.mark"]') !== null) {
          blocks.brand = child;
          continue;
        }
        if (first(child, '[data-slot="sidebar.settings"]') !== null) {
          blocks.footer = child;
          continue;
        }
        if (first(child, '[data-slot="sidebar.workspaces"]') !== null || first(child, '[role="tree"]') !== null) {
          blocks.workspaces = child;
          continue;
        }
        if (blocks.brand === undefined) blocks.brand = child;
      }
      return blocks;
    }

    function panelLabelOf(node) {
      const own = node.getAttribute('aria-label');
      if (own) return own.trim();
      const inner = first(node, 'button[aria-label]');
      if (inner !== null) return (inner.getAttribute('aria-label') ?? '').trim();
      return (node.textContent ?? '').trim().slice(0, 24);
    }

    function readTargets() {
      const rootEl = document.getElementById('root');
      if (rootEl === null) return ABSENT_TARGETS;
      const frame = first(rootEl, '[data-slot="root"] > div');
      if (frame === null) return ABSENT_TARGETS;
      const kids = [...frame.children];
      const sidebarCol = kids.find((node) => first(node, '[data-slot="sidebar"]') !== null) ?? null;
      const centerCol = kids.find((node) => first(node, '[data-slot="main"]') !== null) ?? null;
      const rightbarCol = kids.find((node) => node.hasAttribute('data-rightbar-col') || first(node, '[data-slot="rightbar"]') !== null) ?? null;
      const bottomRow = kids.find((node) => node.hasAttribute('data-shell-bottom') || first(node, '[data-slot="shell.bottom"]') !== null) ?? null;
      const regions = {};
      if (sidebarCol) regions.sidebar = sidebarCol;
      if (centerCol) regions.center = centerCol;
      if (rightbarCol) regions.rightbar = rightbarCol;
      if (bottomRow) regions.bottom = bottomRow;
      const sidebarSeat = sidebarCol ? first(sidebarCol, '[data-slot="sidebar"]') : null;
      const sidebarRoot = sidebarSeat ? sidebarSeat.firstElementChild : null;
      const blocks = classifySidebarBlocks(sidebarRoot);
      const panels = [];
      if (blocks.panels) {
        for (const node of [...blocks.panels.children]) {
          const label = panelLabelOf(node);
          if (label === '') continue;
          panels.push({ label, node });
        }
      }
      const conversation = centerCol ? first(centerCol, '[data-conversation-content]') : null;
      const settings = document.querySelector('[data-shortcut-modal="settings"]');
      const ok = Boolean(sidebarCol && centerCol && rightbarCol);
      return { ok, frame, regions, sidebarRoot, blocks, panels, conversation, settings };
    }

    const MARKERS = [
      ['data-dshl-frame', (targets) => targets.frame],
      ['data-dshl-sidebar', (targets) => targets.sidebarRoot],
      ['data-dshl-conv', (targets) => targets.conversation],
      ['data-dshl-settings', (targets) => targets.settings],
    ];

    function mark(node, attribute, value = '') {
      if (node !== null && node !== undefined && node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
    }

    function annotate(targets) {
      for (const [attribute, pick] of MARKERS) mark(pick(targets), attribute);
      for (const [region, node] of Object.entries(targets.regions)) mark(node, 'data-dshl-region', region);
      for (const [block, node] of Object.entries(targets.blocks)) mark(node, 'data-dshl-block', block);
      for (const panel of targets.panels) mark(panel.node, 'data-dshl-panel', panel.label);
    }

    function refresh() {
      const targets = readTargets();
      annotate(targets);
      setTargets(targets);
      return targets;
    }

    /* ============================== 样式 ============================== */
    const BASE_CSS = `
.dshl-root { display:flex; flex-direction:column; gap:14px; font-size:13px; line-height:20px; color:var(--dsw-alias-label-primary); }
.dshl-head { display:flex; align-items:flex-start; gap:12px; }
.dshl-headText { flex:1; min-width:0; }
.dshl-title { margin:0; font-size:15px; font-weight:600; line-height:22px; }
.dshl-desc { margin:4px 0 0; font-size:12px; line-height:18px; color:var(--dsw-alias-label-secondary); }
.dshl-status { display:inline-flex; align-items:center; gap:6px; height:24px; padding:0 9px; border-radius:999px; font-size:11px; white-space:nowrap; background:var(--dsw-alias-bg-layer-2); border:1px solid var(--dsw-alias-border-l1); color:var(--dsw-alias-label-secondary); flex:none; }
.dshl-dot { width:6px; height:6px; border-radius:50%; background:var(--dsw-alias-state-idle-primary); }
.dshl-dot[data-ok="true"] { background:var(--dsw-alias-state-success-primary); }
.dshl-presets { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
.dshl-presetsLabel { font-size:12px; color:var(--dsw-alias-label-secondary); margin-right:2px; }
.dshl-chip { height:28px; padding:0 12px; border-radius:999px; border:1px solid var(--dsw-alias-border-l1); background:transparent; color:var(--dsw-alias-label-primary); font-size:12px; font-family:inherit; cursor:pointer; }
.dshl-chip:hover { background:var(--dsw-alias-interactive-bg-hover); }
.dshl-chip[data-active="true"] { border-color:var(--dsw-alias-brand-primary); color:var(--dsw-alias-brand-primary); background:color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent); }
.dshl-cards { display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:12px; align-items:start; }
.dshl-card { border:1px solid var(--dsw-alias-border-l1); border-radius:var(--dsw-radius-lg, 12px); background:var(--dsw-alias-bg-layer-1); padding:12px; display:flex; flex-direction:column; gap:10px; min-width:0; }
.dshl-cardHead { display:flex; flex-direction:column; gap:2px; }
.dshl-cardTitle { font-size:13px; font-weight:600; }
.dshl-cardDesc { font-size:11px; line-height:17px; color:var(--dsw-alias-label-secondary); }
.dshl-row { display:flex; align-items:center; gap:8px; min-height:28px; }
.dshl-rowLabel { flex:1; min-width:0; font-size:12px; }
.dshl-num { font-size:11px; color:var(--dsw-alias-label-secondary); min-width:46px; text-align:right; font-variant-numeric:tabular-nums; }
.dshl-slider { width:100%; margin:0; accent-color:var(--dsw-alias-brand-primary); height:16px; }
.dshl-switch { position:relative; width:32px; height:18px; flex:none; border-radius:999px; border:1px solid var(--dsw-alias-border-l2); background:var(--dsw-alias-bg-layer-2); padding:0; cursor:pointer; transition:background .15s; }
.dshl-switch:after { content:''; position:absolute; top:2px; left:2px; width:12px; height:12px; border-radius:50%; background:var(--dsw-alias-label-secondary); transition:transform .15s, background .15s; }
.dshl-switch[aria-checked="true"] { background:var(--dsw-alias-brand-primary); border-color:var(--dsw-alias-brand-primary); }
.dshl-switch[aria-checked="true"]:after { transform:translateX(14px); background:#fff; }
.dshl-list { display:flex; flex-direction:column; gap:4px; }
.dshl-listScroll { max-height:228px; overflow-y:auto; padding-right:2px; }
.dshl-item { display:flex; align-items:center; gap:6px; padding:4px 6px; border-radius:var(--dsw-radius-md, 8px); background:var(--dsw-alias-bg-layer-2); border:1px solid transparent; }
.dshl-item[data-dragover="true"] { border-color:var(--dsw-alias-brand-primary); }
.dshl-itemHandle { cursor:grab; color:var(--dsw-alias-label-secondary); display:inline-flex; flex:none; }
.dshl-itemLabel { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:12px; }
.dshl-itemSub { font-size:11px; color:var(--dsw-alias-label-secondary); flex:none; }
.dshl-iconBtn { width:22px; height:22px; flex:none; display:inline-flex; align-items:center; justify-content:center; padding:0; border:none; border-radius:4px; background:transparent; color:var(--dsw-alias-label-secondary); cursor:pointer; }
.dshl-iconBtn:hover { background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-primary); }
.dshl-iconBtn:disabled { opacity:.3; cursor:default; }
.dshl-foot { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.dshl-btn { height:28px; padding:0 12px; border-radius:var(--dsw-radius-md, 8px); border:1px solid var(--dsw-alias-border-l1); background:transparent; color:var(--dsw-alias-label-primary); font-size:12px; font-family:inherit; cursor:pointer; }
.dshl-btn:hover { background:var(--dsw-alias-interactive-bg-hover); }
.dshl-btn[data-primary="true"] { background:var(--dsw-alias-brand-primary); border-color:var(--dsw-alias-brand-primary); color:#fff; }
.dshl-btn[data-primary="true"]:hover { filter:brightness(1.08); }
.dshl-hint { font-size:11px; line-height:17px; color:var(--dsw-alias-label-secondary); }
.dshl-message { font-size:11px; color:var(--dsw-alias-state-success-primary); }
.dshl-message[data-error="true"] { color:var(--dsw-alias-state-error-primary); }
.dshl-field { display:flex; flex-direction:column; gap:4px; }
.dshl-fieldHead { display:flex; align-items:center; justify-content:space-between; font-size:12px; color:var(--dsw-alias-label-secondary); }
.dshl-divider { height:1px; background:var(--dsw-alias-border-l1); }
.dshl-editLayer { position:absolute; inset:0; pointer-events:none; z-index:40; }
.dshl-editBox { position:absolute; border:1px dashed color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent); border-radius:6px; pointer-events:none; }
.dshl-editBox[data-dim="true"] { border-color:var(--dsw-alias-border-l2); }
.dshl-editTag { position:absolute; top:5px; left:8px; font-size:11px; line-height:16px; padding:1px 7px; border-radius:999px; background:var(--dsw-alias-brand-primary); color:#fff; pointer-events:auto; cursor:pointer; user-select:none; }
.dshl-drag { position:absolute; top:0; bottom:0; width:12px; margin-left:-6px; pointer-events:auto; cursor:col-resize; touch-action:none; }
.dshl-drag:after { content:''; position:absolute; top:0; bottom:0; left:5px; width:2px; background:var(--dsw-alias-brand-primary); opacity:0; transition:opacity .12s; }
.dshl-drag:hover:after, .dshl-drag[data-active="true"]:after { opacity:.85; }
.dshl-toolbar { position:fixed; left:50%; bottom:18px; transform:translateX(-50%); z-index:1200; display:flex; align-items:center; gap:8px; padding:7px 9px; border-radius:12px; background:var(--dsw-alias-bg-overlay); border:1px solid var(--dsw-alias-border-l2); box-shadow:var(--dsw-elevation-prominent, 0 8px 24px rgba(0,0,0,.25)); pointer-events:auto; font-size:12px; color:var(--dsw-alias-label-primary); }
.dshl-toolbarTitle { font-weight:600; padding:0 2px; }
.dshl-toolbar .dshl-chip { height:24px; padding:0 9px; font-size:11px; }
.dshl-toolbar .dshl-btn { height:24px; padding:0 9px; font-size:11px; }
`;

    let baseStyle = null;
    let dynamicStyle = null;
    let observer = null;
    let refreshFrame = null;

    function ensureStyles() {
      if (baseStyle === null) {
        baseStyle = document.createElement('style');
        baseStyle.dataset.dshLayout = 'base';
        baseStyle.textContent = BASE_CSS;
        document.head.appendChild(baseStyle);
      }
      if (dynamicStyle === null) {
        dynamicStyle = document.createElement('style');
        dynamicStyle.dataset.dshLayout = 'dynamic';
        document.head.appendChild(dynamicStyle);
      }
    }

    function removeStyles() {
      if (baseStyle !== null) baseStyle.remove();
      if (dynamicStyle !== null) dynamicStyle.remove();
      baseStyle = null;
      dynamicStyle = null;
    }

    function cssAttr(value) {
      return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
    }

    /** 生成当前配置对应的覆盖样式；未启用时返回空串，界面保持宿主默认。 */
    function buildDynamicCss(config) {
      if (!config.enabled) return '';
      const col = config.columns;
      const lines = [];
      const order = col.order;
      const sidebarTrack = col.hideSidebar ? '0px' : `${Math.round(col.sidebarWidth)}px`;
      const rightbarTrack = col.hideRightbar ? '0px' : `${Math.round(col.rightbarWidth)}px`;
      const centerTrack = `minmax(${Math.round(col.centerMinWidth)}px, 1fr)`;
      const track = (region, rightShown) => {
        if (region === 'sidebar') return sidebarTrack;
        if (region === 'rightbar') return rightShown ? rightbarTrack : '0px';
        return centerTrack;
      };
      const template = (rightShown) => order.map((region) => track(region, rightShown)).join(' ');
      lines.push('@media (min-width: 768px) {');
      lines.push(`[data-dshl-frame]:not([data-sidebar-collapsed]) { grid-template-columns: ${template(true)} !important; }`);
      lines.push(`[data-dshl-frame]:not([data-sidebar-collapsed])[data-rightbar-collapsed] { grid-template-columns: ${template(false)} !important; }`);
      order.forEach((region, index) => {
        lines.push(`[data-dshl-frame] > [data-dshl-region="${region}"] { grid-column: ${index + 1} !important; grid-row: 1 !important; }`);
      });
      lines.push('[data-dshl-frame] > [data-dshl-region="bottom"] { grid-row: 2 !important; grid-column: 1 / -1 !important; }');
      lines.push('[data-dshl-frame] > [data-side] { display: none !important; }');
      if (col.hideSidebar) lines.push('[data-dshl-frame] > [data-dshl-region="sidebar"] { display: none !important; }');
      if (col.hideRightbar) {
        lines.push('[data-dshl-frame] > [data-dshl-region="rightbar"] { display: none !important; }');
        lines.push('[data-dshl-frame] [data-sidebar-right-panel] { display: none !important; }');
      }
      if (col.hideBottom) lines.push('[data-dshl-frame] > [data-dshl-region="bottom"] { display: none !important; }');
      lines.push('}');
      if (!col.hideRightbar) {
        lines.push(`[data-dshl-frame] [data-sidebar-right-panel] { width: ${Math.round(col.rightbarWidth)}px !important; max-width: ${Math.round(col.rightbarWidth)}px !important; --dsh-sidebar-width: ${Math.round(col.rightbarWidth)}px !important; }`);
        // 右栏排到最左时，停靠面板跟随到左边缘，否则会浮在别的列上
        if (order.indexOf('rightbar') === 0) {
          lines.push('[data-dshl-frame] [data-sidebar-right-panel] { right: auto !important; left: 0 !important; }');
        }
      }
      lines.push('[data-dshl-sidebar] { display: flex !important; flex-direction: column !important; }');
      config.sidebar.order.forEach((block, index) => {
        lines.push(`[data-dshl-sidebar] > [data-dshl-block="${block}"] { order: ${index + 1} !important; }`);
      });
      for (const block of config.sidebar.hidden) {
        lines.push(`[data-dshl-sidebar] > [data-dshl-block="${block}"] { display: none !important; }`);
      }
      lines.push('[data-dshl-block="panels"] { display: flex !important; flex-direction: column !important; }');
      lines.push('[data-dshl-panel] { order: 60 !important; }');
      config.sidebar.panelOrder.forEach((label, index) => {
        lines.push(`[data-dshl-panel="${cssAttr(label)}"] { order: ${index + 1} !important; }`);
      });
      for (const label of config.sidebar.panelHidden) {
        lines.push(`[data-dshl-panel="${cssAttr(label)}"] { display: none !important; }`);
      }
      if (config.center.contentWidth !== null) {
        const width = Math.round(config.center.contentWidth);
        lines.push(`[data-dshl-conv] { --dsh-chat-content-width: min(${width}px, 100%) !important; --dsh-composer-card-max-width: min(${width + 32}px, 100%) !important; }`);
      }
      const settings = config.settings;
      if (settings.width !== null) {
        lines.push(`[data-dshl-settings] { width: ${settings.width}px !important; max-width: min(${settings.width}px, calc(100vw - 48px)) !important; }`);
      }
      if (settings.height !== null) {
        lines.push(`[data-dshl-settings] { height: min(${settings.height}px, calc(100vh - 48px)) !important; }`);
      }
      if (settings.navWidth !== null) {
        lines.push(`[data-dshl-settings] { grid-template-columns: ${settings.navWidth}px minmax(0, 1fr) !important; }`);
      }
      if (settings.offsetX !== 0 || settings.offsetY !== 0) {
        lines.push(`[data-dshl-settings] { position: relative !important; left: ${settings.offsetX}px !important; top: ${settings.offsetY}px !important; }`);
      }
      return lines.join('\n');
    }

    function applyDynamicCss() {
      if (dynamicStyle === null) return;
      const next = buildDynamicCss(snapshot.config);
      if (dynamicStyle.textContent !== next) dynamicStyle.textContent = next;
    }

    function paint() {
      ensureStyles();
      annotate(snapshot.targets);
      applyDynamicCss();
    }

    /* ============================== 工具组件 ============================== */
    const icon = (paths, size = 14) =>
      h('svg', { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true }, paths.map((d, index) => h('path', { key: index, d, stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' })));

    const ICON_GRIP = ['M6 4h.01M10 4h.01M6 8h.01M10 8h.01M6 12h.01M10 12h.01'];
    const ICON_RESET = ['M3.2 8a4.8 4.8 0 1 0 1.5-3.5', 'M3.2 3.2v3.4h3.4'];

    function Switch({ checked, onChange, label }) {
      return h('button', {
        type: 'button',
        role: 'switch',
        'aria-checked': checked ? 'true' : 'false',
        'aria-label': label,
        className: 'dshl-switch',
        onClick: () => onChange(!checked),
      });
    }

    function Slider({ value, min, max, step = 1, onChange, disabled }) {
      return h('input', {
        type: 'range',
        className: 'dshl-slider',
        min,
        max,
        step,
        value: value,
        disabled: disabled === true,
        onChange: (event) => onChange(Number(event.target.value)),
      });
    }

    function Field({ label, valueText, children }) {
      return h('div', { className: 'dshl-field' },
        h('div', { className: 'dshl-fieldHead' }, h('span', null, label), valueText === undefined ? null : h('span', { className: 'dshl-num' }, valueText)),
        children);
    }

    function Card({ title, desc, children }) {
      return h('section', { className: 'dshl-card' },
        h('div', { className: 'dshl-cardHead' },
          h('div', { className: 'dshl-cardTitle' }, title),
          desc === undefined ? null : h('div', { className: 'dshl-cardDesc' }, desc)),
        children);
    }

    /** HTML5 拖放排序：拖动行到另一行上方即交换位置。 */
    function SortableList({ items, onMove, renderLabel, renderTrailing, empty }) {
      const [dragIndex, setDragIndex] = React.useState(-1);
      const [overIndex, setOverIndex] = React.useState(-1);
      if (items.length === 0) return h('div', { className: 'dshl-hint' }, empty);
      return h('div', { className: 'dshl-list' }, items.map((item, index) =>
        h('div', {
          key: item.key,
          className: 'dshl-item',
          draggable: true,
          'data-dragover': overIndex === index && dragIndex !== index ? 'true' : undefined,
          onDragStart: (event) => {
            setDragIndex(index);
            event.dataTransfer.effectAllowed = 'move';
            try { event.dataTransfer.setData('text/plain', item.key); } catch (error) { /* 某些合成事件没有 dataTransfer，忽略 */ }
          },
          onDragOver: (event) => {
            event.preventDefault();
            if (overIndex !== index) setOverIndex(index);
          },
          onDragLeave: () => setOverIndex((current) => (current === index ? -1 : current)),
          onDrop: (event) => {
            event.preventDefault();
            const from = dragIndex;
            setDragIndex(-1);
            setOverIndex(-1);
            if (from >= 0 && from !== index) onMove(from, index);
          },
          onDragEnd: () => { setDragIndex(-1); setOverIndex(-1); },
        },
        h('span', { className: 'dshl-itemHandle', title: '拖动排序', 'aria-hidden': true }, icon(ICON_GRIP, 13)),
        h('span', { className: 'dshl-itemLabel' }, renderLabel(item)),
        h('span', { className: 'dshl-itemSub' }, `${index + 1}`),
        renderTrailing === undefined ? null : renderTrailing(item, index))));
    }

    class Boundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { failed: false };
      }
      static getDerivedStateFromError() {
        return { failed: true };
      }
      componentDidCatch(error) {
        console.warn('[dsh-layout] 布局界面渲染失败', error);
      }
      render() {
        if (this.state.failed) return h('div', { className: 'dshl-hint' }, '布局界面渲染失败，请查看控制台。');
        return this.props.children;
      }
    }

    function useStoreSnapshot() {
      const [value, setValue] = React.useState(snapshot);
      React.useEffect(() => {
        setValue(snapshot);
        return subscribe(() => setValue(snapshot));
      }, []);
      return value;
    }

    /* ============================== 编辑面板（插件详情页内） ============================== */
    const REGION_LABEL_KEYS = { sidebar: 'sidebar', center: 'center', rightbar: 'rightbar', bottom: 'bottomBar' };
    const BLOCK_LABEL_KEYS = { brand: 'blockBrand', 'new-session': 'blockNewSession', panels: 'blockPanels', workspaces: 'blockWorkspaces', footer: 'blockFooter' };

    function StructureCard({ config, t }) {
      const col = config.columns;
      const labels = { sidebar: t('sidebar'), center: t('center'), rightbar: t('rightbar') };
      const items = col.order.map((region) => ({ key: region, region }));
      return h(Card, { title: t('structure'), desc: t('structureHint') },
        h(SortableList, {
          items,
          empty: '',
          onMove: (from, to) => updateConfig((draft) => {
            const next = [...draft.columns.order];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            draft.columns.order = next;
          }),
          renderLabel: (item) => labels[item.region],
          renderTrailing: (item) => h(Switch, {
            checked: item.region === 'sidebar' ? !col.hideSidebar : item.region === 'rightbar' ? !col.hideRightbar : true,
            label: `${labels[item.region]} ${t('hide')}`,
            onChange: (on) => updateConfig((draft) => {
              if (item.region === 'sidebar') draft.columns.hideSidebar = !on;
              if (item.region === 'rightbar') draft.columns.hideRightbar = !on;
            }),
          }),
        }),
        h(Field, { label: `${t('sidebar')} · ${t('width')}`, valueText: `${col.sidebarWidth}${t('px')}` },
          h(Slider, { value: col.sidebarWidth, min: 180, max: 640, onChange: (value) => updateConfig((draft) => { draft.columns.sidebarWidth = value; }) })),
        h(Field, { label: `${t('rightbar')} · ${t('width')}`, valueText: `${col.rightbarWidth}${t('px')}` },
          h(Slider, { value: col.rightbarWidth, min: 240, max: 900, onChange: (value) => updateConfig((draft) => { draft.columns.rightbarWidth = value; }) })),
        h(Field, { label: `${t('center')} · ${t('minWidth')}`, valueText: `${col.centerMinWidth}${t('px')}` },
          h(Slider, { value: col.centerMinWidth, min: 240, max: 1200, onChange: (value) => updateConfig((draft) => { draft.columns.centerMinWidth = value; }) })),
        h('div', { className: 'dshl-row' },
          h('span', { className: 'dshl-rowLabel' }, t('bottomBar')),
          h(Switch, { checked: !col.hideBottom, label: t('bottomBar'), onChange: (on) => updateConfig((draft) => { draft.columns.hideBottom = !on; }) })),
        h('div', { className: 'dshl-row' },
          h('span', { className: 'dshl-rowLabel' }, t('handles')),
          h(Switch, { checked: col.resizeHandles, label: t('handles'), onChange: (on) => updateConfig((draft) => { draft.columns.resizeHandles = on; }) })),
      );
    }

    function BlocksCard({ config, t }) {
      const items = config.sidebar.order.map((block) => ({ key: block, block }));
      return h(Card, { title: t('sidebarBlocks'), desc: t('sidebarBlocksHint') },
        h(SortableList, {
          items,
          empty: '',
          onMove: (from, to) => updateConfig((draft) => {
            const next = [...draft.sidebar.order];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            draft.sidebar.order = next;
          }),
          renderLabel: (item) => t(BLOCK_LABEL_KEYS[item.block] ?? item.block),
          renderTrailing: (item) => h(Switch, {
            checked: !config.sidebar.hidden.includes(item.block),
            label: t(BLOCK_LABEL_KEYS[item.block] ?? item.block),
            onChange: (on) => updateConfig((draft) => {
              const hidden = new Set(draft.sidebar.hidden);
              if (on) hidden.delete(item.block);
              else hidden.add(item.block);
              draft.sidebar.hidden = [...hidden];
            }),
          }),
        }));
    }

    function PanelsCard({ config, targets, t }) {
      const detected = targets.panels.map((panel) => panel.label);
      const labels = [];
      for (const label of config.sidebar.panelOrder) if (!labels.includes(label)) labels.push(label);
      for (const label of detected) if (!labels.includes(label)) labels.push(label);
      const items = labels.map((label) => ({ key: label, label }));
      return h(Card, { title: t('panels'), desc: t('panelsHint') },
        h('div', { className: 'dshl-listScroll' },
          h(SortableList, {
            items,
            empty: t('panelsEmpty'),
            onMove: (from, to) => updateConfig((draft) => {
              const next = [...labels];
              const [moved] = next.splice(from, 1);
              next.splice(to, 0, moved);
              draft.sidebar.panelOrder = next;
            }),
            renderLabel: (item) => item.label,
            renderTrailing: (item) => h(Switch, {
              checked: !config.sidebar.panelHidden.includes(item.label),
              label: item.label,
              onChange: (on) => updateConfig((draft) => {
                const hidden = new Set(draft.sidebar.panelHidden);
                if (on) hidden.delete(item.label);
                else hidden.add(item.label);
                draft.sidebar.panelHidden = [...hidden];
              }),
            }),
          })));
    }

    function FollowField({ label, value, fallback, min, max, step, onChange, t }) {
      return h(Field, { label, valueText: value === null ? t('followDefault') : `${value}${t('px')}` },
        h('div', { className: 'dshl-row' },
          h(Slider, { value: value ?? fallback, min, max, step, onChange }),
          h('button', {
            type: 'button',
            className: 'dshl-iconBtn',
            'aria-label': t('followDefault'),
            title: t('followDefault'),
            disabled: value === null,
            onClick: () => onChange(null),
          }, icon(ICON_RESET, 13))));
    }

    function ConversationCard({ config, t }) {
      return h(Card, { title: t('conversation'), desc: t('conversationHint') },
        h(FollowField, {
          label: t('contentWidth'),
          value: config.center.contentWidth,
          fallback: 900,
          min: 520,
          max: 1600,
          step: 10,
          t,
          onChange: (value) => updateConfig((draft) => { draft.center.contentWidth = value; }),
        }));
    }

    function SettingsCard({ config, t }) {
      const settings = config.settings;
      const num = (label, key, fallback, min, max) => h(FollowField, {
        key,
        label,
        value: settings[key],
        fallback,
        min,
        max,
        step: 10,
        t,
        onChange: (value) => updateConfig((draft) => { draft.settings[key] = value; }),
      });
      const offset = (label, key, min, max) => h(Field, { key, label, valueText: `${settings[key]}${t('px')}` },
        h(Slider, { value: settings[key], min, max, step: 10, onChange: (value) => updateConfig((draft) => { draft.settings[key] = value; }) }));
      return h(Card, { title: t('settingsPanel'), desc: t('settingsPanelHint') },
        num(t('settingsWidth'), 'width', 800, 560, 1400),
        num(t('settingsHeight'), 'height', 800, 380, 1200),
        num(t('settingsNav'), 'navWidth', 188, 120, 360),
        offset(t('offsetX'), 'offsetX', -600, 600),
        offset(t('offsetY'), 'offsetY', -500, 500));
    }

    function Editor({ t }) {
      const { config, targets, ui } = useStoreSnapshot();
      const [message, setMessage] = React.useState(null);
      const fileRef = React.useRef(null);

      const exportFile = () => {
        try {
          const blob = new Blob([JSON.stringify(snapshot.config, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'dsh-layout.json';
          anchor.click();
          window.setTimeout(() => URL.revokeObjectURL(url), 1000);
          setMessage({ ok: true, text: t('data') });
        } catch (error) {
          setMessage({ ok: false, text: String(error) });
        }
      };

      const importFile = async (event) => {
        const file = event.target.files && event.target.files[0];
        event.target.value = '';
        if (!file) return;
        try {
          replaceConfig(JSON.parse(await file.text()));
          setMessage({ ok: true, text: t('importOk') });
        } catch (error) {
          setMessage({ ok: false, text: t('importFail') });
        }
      };

      const presetLabels = [
        ['standard', t('presetStandard')],
        ['compact', t('presetCompact')],
        ['focus', t('presetFocus')],
        ['rightSide', t('presetRightSide')],
        ['wide', t('presetWide')],
      ];

      return h('div', { className: 'dshl-root' },
        h('div', { className: 'dshl-head' },
          h('div', { className: 'dshl-headText' },
            h('h3', { className: 'dshl-title' }, t('title')),
            h('p', { className: 'dshl-desc' }, t('desc'))),
          h('span', { className: 'dshl-status' },
            h('span', { className: 'dshl-dot', 'data-ok': targets.ok ? 'true' : 'false' }),
            targets.ok ? t('detected') : t('notDetected'))),
        h('div', { className: 'dshl-row' },
          h('span', { className: 'dshl-rowLabel' }, t('enable')),
          h(Switch, {
            checked: config.enabled,
            label: t('enable'),
            onChange: (on) => updateConfig((draft) => { draft.enabled = on; }, { capture: on }),
          })),
        h('p', { className: 'dshl-hint' }, t('enableHint')),
        h('div', { className: 'dshl-presets' },
          h('span', { className: 'dshl-presetsLabel' }, t('presets')),
          ...presetLabels.map(([name, label]) => h('button', {
            key: name,
            type: 'button',
            className: 'dshl-chip',
            onClick: () => applyPreset(name),
          }, label)),
          h('button', {
            type: 'button',
            className: 'dshl-chip',
            onClick: () => {
              replaceConfig(null);
              setEditing(false);
              setMessage(null);
            },
          }, t('reset'))),
        h('div', { className: 'dshl-row' },
          h('span', { className: 'dshl-rowLabel' }, t('editing')),
          h(Switch, {
            checked: ui.editing,
            label: t('editing'),
            onChange: (on) => {
              if (on && !snapshot.config.enabled) updateConfig((draft) => { draft.enabled = true; }, { capture: true });
              setEditing(on);
            },
          })),
        h('p', { className: 'dshl-hint' }, t('editingHint')),
        h('div', { className: 'dshl-cards' },
          h(StructureCard, { config, t }),
          h(BlocksCard, { config, t }),
          h(PanelsCard, { config, targets, t }),
          h(ConversationCard, { config, t }),
          h(SettingsCard, { config, t })),
        h('div', { className: 'dshl-divider' }),
        h('div', { className: 'dshl-foot' },
          h('button', { type: 'button', className: 'dshl-btn', onClick: exportFile }, t('exportData')),
          h('button', { type: 'button', className: 'dshl-btn', onClick: () => fileRef.current !== null && fileRef.current.click() }, t('importData')),
          h('input', { ref: fileRef, type: 'file', accept: 'application/json,.json', style: { display: 'none' }, onChange: importFile }),
          message === null ? null : h('span', { className: 'dshl-message', 'data-error': message.ok ? 'false' : 'true' }, message.text)),
        h('p', { className: 'dshl-hint' }, t('disabledHint')));
    }

    /* ============================== 编辑模式浮层 ============================== */
    function EditOverlay({ t }) {
      const { config, targets, ui } = useStoreSnapshot();
      const [bounds, setBounds] = React.useState(null);
      const [dragging, setDragging] = React.useState(null);

      const measure = React.useCallback(() => {
        const frame = targets.frame;
        if (frame === null || frame === undefined) {
          setBounds(null);
          return;
        }
        const frameRect = frame.getBoundingClientRect();
        const regions = {};
        for (const [region, node] of Object.entries(targets.regions)) {
          const rect = node.getBoundingClientRect();
          if (rect.width < 1 || rect.height < 1) continue;
          regions[region] = { left: rect.left - frameRect.left, top: rect.top - frameRect.top, width: rect.width, height: rect.height };
        }
        setBounds({ width: frameRect.width, height: frameRect.height, regions });
      }, [targets]);

      React.useLayoutEffect(() => {
        measure();
        const frame = targets.frame;
        const resizeObserver = frame ? new ResizeObserver(measure) : null;
        if (resizeObserver !== null && frame) resizeObserver.observe(frame);
        window.addEventListener('resize', measure);
        return () => {
          window.removeEventListener('resize', measure);
          if (resizeObserver !== null) resizeObserver.disconnect();
        };
      }, [measure, targets]);

      React.useEffect(() => {
        measure();
      }, [measure, config]);

      const active = config.enabled && bounds !== null;
      if (!active) return null;

      const labels = {
        sidebar: t('sidebar'),
        center: t('center'),
        rightbar: t('rightbar'),
        bottom: t('bottomBar'),
      };
      const order = config.columns.order.filter((region) => bounds.regions[region] !== undefined);
      const handles = [];
      const resizeOne = (region, startWidth, delta) => {
        updateConfig((draft) => {
          if (region === 'sidebar') draft.columns.sidebarWidth = clampInt(startWidth + delta, 180, 640, startWidth);
          else if (region === 'rightbar') draft.columns.rightbarWidth = clampInt(startWidth + delta, 240, 900, startWidth);
        });
      };
      const startDrag = (region, direction) => (event) => {
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = region === 'sidebar' ? snapshot.config.columns.sidebarWidth : snapshot.config.columns.rightbarWidth;
        setDragging(`${region}-${direction}`);
        const move = (moveEvent) => resizeOne(region, startWidth, (moveEvent.clientX - startX) * direction);
        const up = () => {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
          setDragging(null);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      };
      if (config.columns.resizeHandles) {
        for (let index = 0; index < order.length - 1; index += 1) {
          const left = order[index];
          const right = order[index + 1];
          const leftRect = bounds.regions[left];
          const boundary = leftRect.left + leftRect.width;
          if (right === 'center' && left !== 'center') {
            handles.push(h('div', {
              key: `${left}-${right}`,
              className: 'dshl-drag',
              'data-active': dragging === `${left}-1` ? 'true' : undefined,
              style: { left: boundary },
              title: `${labels[left]} — ${t('width')}`,
              onPointerDown: startDrag(left, 1),
            }));
          } else if (left === 'center' && right !== 'center') {
            handles.push(h('div', {
              key: `${left}-${right}`,
              className: 'dshl-drag',
              'data-active': dragging === `${right}--1` ? 'true' : undefined,
              style: { left: boundary },
              title: `${labels[right]} — ${t('width')}`,
              onPointerDown: startDrag(right, -1),
            }));
          }
        }
      }
      const boxes = ui.editing
        ? Object.entries(bounds.regions).map(([region, rect]) => h('div', {
          key: region,
          className: 'dshl-editBox',
          'data-dim': region === 'bottom' ? 'true' : undefined,
          style: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
        }, h('span', { className: 'dshl-editTag' }, labels[region] ?? region)))
        : null;
      const toolbar = ui.editing
        ? h('div', { className: 'dshl-toolbar' },
          h('span', { className: 'dshl-toolbarTitle' }, t('editLayer')),
          ...[
            ['standard', t('presetStandard')],
            ['compact', t('presetCompact')],
            ['focus', t('presetFocus')],
            ['rightSide', t('presetRightSide')],
            ['wide', t('presetWide')],
          ].map(([name, label]) => h('button', {
            key: name,
            type: 'button',
            className: 'dshl-chip',
            onClick: () => applyPreset(name),
          }, label)),
          h('button', { type: 'button', className: 'dshl-btn', onClick: () => replaceConfig(null) }, t('reset')),
          h('span', { className: 'dshl-itemSub' }, `${Math.round(config.columns.sidebarWidth)} / ${Math.round(config.columns.rightbarWidth)}`),
          h('button', { type: 'button', className: 'dshl-btn', 'data-primary': 'true', onClick: () => setEditing(false) }, t('done')))
        : null;
      return h('div', { className: 'dshl-editLayer' }, boxes, handles, toolbar);
    }

    /* ============================== 插件装配 ============================== */
    const inject = ['slots', 'locale'];

    function apply(ctx) {
      const t = ctx.locale.bind(NS);
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-layout: dictionaries');

      let refreshTimer = null;
      const scheduleRefresh = () => {
        if (refreshTimer !== null) return;
        refreshTimer = window.setTimeout(() => {
          refreshTimer = null;
          refresh();
        }, 120);
      };

      ctx.effect(() => {
        ensureStyles();
        refresh();
        observer = new MutationObserver(scheduleRefresh);
        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('resize', scheduleRefresh);
        return () => {
          window.removeEventListener('resize', scheduleRefresh);
          if (refreshTimer !== null) window.clearTimeout(refreshTimer);
          refreshTimer = null;
          if (observer !== null) observer.disconnect();
          observer = null;
          if (cssFrame !== null) window.cancelAnimationFrame(cssFrame);
          cssFrame = null;
          if (persistTimer !== null) window.clearTimeout(persistTimer);
          persistTimer = null;
          removeStyles();
        };
      }, 'dsh-layout: interface bridge');

      ctx.effect(() => subscribe(() => applyDynamicCss()), 'dsh-layout: layout styles');

      ctx.effect(() => ctx.slots.inject('plugins.detail.section', () => ctx.slots.register({
        name: 'plugins.detail.section',
        id: 'dsh-layout-section',
        order: 200,
        label: () => t('title'),
      }, (props) => {
        const subject = props !== null && props !== undefined ? props.subject : undefined;
        const pkg = subject !== null && subject !== undefined ? subject.pkg : undefined;
        const mine = subject !== null && subject !== undefined
          && (subject.kind === 'bundle' || subject.kind === 'row')
          && pkg !== null && pkg !== undefined && pkg.name === 'dsh-layout';
        if (!mine) return null;
        return h(Boundary, null, h(Editor, { t }));
      })), 'dsh-layout: plugin detail section');

      ctx.effect(() => ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'dsh-layout-editor',
        order: 900,
        label: () => t('editLayer'),
      }, () => h(Boundary, null, h(EditOverlay, { t })))), 'dsh-layout: edit overlay');
    }

    return { apply, inject };
  },
});
