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
      recoveryHint: '自定义布局可能挡住插件入口；这个按钮始终能打开编辑浮层并恢复默认。',
      recoveryShortcut: '布局：打开编辑浮层（恢复入口）',
      openPlugins: '插件页',
      riskyHint: '注意：侧栏或面板入口已被隐藏，界面上会留一个「布局」恢复按钮（位置随留白走）。快捷键也能打开编辑浮层。',
      shortcutHint: '快捷键：Ctrl/⌘+Alt+L 打开编辑浮层；再加 Shift 直接恢复默认布局。',
      offsetClamped: '偏移会自动限制，保证设置面板始终留在屏幕内。',
      blankHint: '点击恢复布局，或按 Ctrl/⌘+Alt+L',
      anchorHint: '依附位置',
      nothingToDrag: '当前没有可见区域可拖拽，用预设或恢复默认',
      showAll: '显示全部',
      launcherOnBlank: '仅剩空白页',
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
      recoveryHint: 'A custom layout can hide the plugin entry; this button always opens the edit overlay and can restore defaults.',
      recoveryShortcut: 'Layout: open the edit overlay (recovery)',
      openPlugins: 'Plugins page',
      riskyHint: 'Heads up: the sidebar or panel entry is hidden, so a "Layout" recovery button floats in a clear spot. The shortcut also opens the edit overlay.',
      shortcutHint: 'Shortcuts: Ctrl/⌘+Alt+L opens the edit overlay; add Shift to restore the default layout.',
      offsetClamped: 'Offsets are clipped so the settings panel always stays on screen.',
      blankHint: 'Click to restore the layout, or press Ctrl/⌘+Alt+L',
      anchorHint: 'Anchored to',
      nothingToDrag: 'No visible region to drag; use a preset or restore defaults',
      showAll: 'Show all',
      launcherOnBlank: 'Blank page',
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
        hideCenter: false,
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
        hideCenter: col.hideCenter === true,
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
      /** 落点重算信号：界面变化（新插件出现、布局重排）导致按钮被遮挡时递增。 */
      reposition: 0,
    };
    const listeners = new Set();
    let persistTimer = null;
    let cssFrame = null;
    /** 本次模块加载的随机盐：同一份配置在不同加载里会落到不同留白处。 */
    const mountSalt = Math.floor(Math.random() * 0xFFFFFFFF).toString(36);

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

    /**
     * 请求重新计算恢复按钮的落点。
     * 由全局 refresh 循环（跟着 DOM 变化跑）在检测到遮挡时调用：用户新装的插件、
     * 动态弹出的挂件都可能出现在按钮之后，落点必须能跟着改。
     * 加最小间隔，避免界面高频变动时按钮满屏跳。
     */
    let lastRepositionAt = 0;
    function requestReposition() {
      const now = Date.now();
      if (now - lastRepositionAt < 1200) return;
      lastRepositionAt = now;
      snapshot = { ...snapshot, reposition: snapshot.reposition + 1 };
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
.dshl-toolbar { position:fixed; left:50%; bottom:18px; transform:translateX(-50%); z-index:1200; display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:8px; max-width:calc(100vw - 24px); padding:7px 9px; border-radius:12px; background:var(--dsw-alias-bg-overlay); border:1px solid var(--dsw-alias-border-l2); box-shadow:var(--dsw-elevation-prominent, 0 8px 24px rgba(0,0,0,.25)); pointer-events:auto; font-size:12px; color:var(--dsw-alias-label-primary); }
.dshl-toolbarTitle { font-weight:600; padding:0 2px; white-space:nowrap; }
.dshl-toolbar .dshl-chip { height:24px; padding:0 9px; font-size:11px; white-space:nowrap; }
.dshl-toolbar .dshl-btn { height:24px; padding:0 9px; font-size:11px; white-space:nowrap; }
.dshl-launcherDock { position:fixed; z-index:1300; display:flex; flex-direction:column; align-items:center; gap:8px; pointer-events:none; transform:translate(-50%, -50%); }
.dshl-launcherDock[data-mode="blank"] { left:50%; top:50%; }
.dshl-launcherDock[data-mode="corner"] { left:calc(var(--dsh-frame-leading-clearance, 0px) + 12px); bottom:14px; top:auto; transform:none; }
.dshl-launcherRow { display:flex; align-items:center; gap:8px; pointer-events:none; }
.dshl-launcherQuestion { font-size:13px; line-height:20px; color:var(--dsw-alias-label-secondary); }
.dshl-launcherDock[data-mode="blank"] .dshl-launcher { height:44px; padding:0 22px 0 16px; font-size:14px; opacity:1; border-color:var(--dsw-alias-brand-primary); box-shadow:0 10px 28px rgba(0,0,0,.32); }
.dshl-launcherDock[data-mode="blank"] .dshl-launcherGhost { border-color:var(--dsw-alias-border-l2); font-weight:400; }
.dshl-launcherHint { font-size:11px; line-height:16px; color:var(--dsw-alias-label-secondary); background:var(--dsw-alias-bg-overlay); border:1px solid var(--dsw-alias-border-l1); border-radius:999px; padding:2px 10px; white-space:nowrap; }
.dshl-launcher { display:inline-flex; align-items:center; gap:6px; height:28px; padding:0 12px 0 9px; border-radius:999px; border:1px solid var(--dsw-alias-border-l2); background:var(--dsw-alias-bg-overlay); color:var(--dsw-alias-label-primary); font-size:12px; font-family:inherit; cursor:pointer; pointer-events:auto; box-shadow:var(--dsw-elevation-prominent, 0 6px 18px rgba(0,0,0,.25)); opacity:.72; transition:opacity .15s; }
.dshl-launcher:hover { opacity:1; }
.dshl-warn { margin:0; font-size:11px; line-height:17px; color:var(--dsw-alias-state-warn-primary); }
`;

    let baseStyle = null;
    let dynamicStyle = null;
    let observer = null;
    let refreshFrame = null;

    function ensureStyles() {
      // 插件模块热更新会重新执行 apply：清掉上一代留下的同名样式，避免旧规则覆盖新规则；
      // 本代自己的两个标签保持复用，防止每次重绘都重建样式。
      for (const stale of document.querySelectorAll('style[data-dsh-layout]')) {
        if (stale !== baseStyle && stale !== dynamicStyle) stale.remove();
      }
      if (baseStyle === null || !baseStyle.isConnected) {
        baseStyle = document.createElement('style');
        baseStyle.dataset.dshLayout = 'base';
        baseStyle.textContent = BASE_CSS;
        document.head.appendChild(baseStyle);
      }
      if (dynamicStyle === null || !dynamicStyle.isConnected) {
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
      const centerTrack = col.hideCenter ? '0px' : `minmax(${Math.round(col.centerMinWidth)}px, 1fr)`;
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
        lines.push(`[data-dshl-frame]:not([data-sidebar-collapsed]) > [data-dshl-region="${region}"] { grid-column: ${index + 1} !important; grid-row: 1 !important; }`);
      });
      lines.push('[data-dshl-frame] > [data-dshl-region="bottom"] { grid-row: 2 !important; grid-column: 1 / -1 !important; }');
      lines.push('[data-dshl-frame] > [data-side] { display: none !important; }');
      if (col.hideSidebar) lines.push('[data-dshl-frame] > [data-dshl-region="sidebar"] { display: none !important; }');
      if (col.hideCenter) lines.push('[data-dshl-frame] > [data-dshl-region="center"] { display: none !important; }');
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
      // 偏移只用来微调位置：夹取到「面板仍在屏幕内」的区间，避免把设置面板推到看不见的地方
      if (settings.offsetX !== 0 || settings.offsetY !== 0) {
        const viewportWidth = Math.max(360, window.innerWidth || 1280);
        const viewportHeight = Math.max(360, window.innerHeight || 800);
        const effectiveWidth = Math.min(settings.width ?? 800, viewportWidth - 48);
        const effectiveHeight = Math.min(settings.height ?? 684, viewportHeight - 48);
        const centerX = (viewportWidth - effectiveWidth) / 2;
        const centerY = (viewportHeight - effectiveHeight) / 2;
        const minLeft = 8;
        const maxLeft = Math.max(minLeft, viewportWidth - 8 - effectiveWidth);
        const minTop = 8;
        const maxTop = Math.max(minTop, viewportHeight - 8 - effectiveHeight);
        const left = Math.min(maxLeft, Math.max(minLeft, centerX + settings.offsetX));
        const top = Math.min(maxTop, Math.max(minTop, centerY + settings.offsetY));
        const deltaX = Math.round(left - centerX);
        const deltaY = Math.round(top - centerY);
        if (deltaX !== 0 || deltaY !== 0) {
          lines.push(`[data-dshl-settings] { position: relative !important; left: ${deltaX}px !important; top: ${deltaY}px !important; }`);
        }
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
    const ICON_LAYOUT = ['M2.8 3.2h3v9.6h-3zM8.2 3.2h3v4.8h-3zM8.2 9.6h3v3.2h-3z'];

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

    /* ============================== 恢复按钮的落点 ============================== */
    /**
     * 恢复按钮的落点策略（优先级从高到低）：
     * 1. 依附：贴在页面上某个可见控件的旁侧空隙里，视觉上像同一排的一部分；
     * 2. 留白：没有可用锚点时，在可用区域的空白处随机挑一个点；
     * 3. 空白页：整页没有任何可见区域 → 屏幕正中，最大号；
     * 4. 兜底：探测失败 → 左下角固定位。
     *
     * 关键约束：这套算法不认识任何具体插件。它只依赖浏览器提供的通用几何事实
     * （元素矩形、可见性、是否可交互），因此第三方插件无论把控件渲染到哪个容器、
     * 用什么框架、起什么类名，都会被同一套规则纳入计算。
     */
    const INTERACTIVE_SELECTOR = 'button, a, input, textarea, select, label, summary, [role="button"], [role="menuitem"], [role="tab"], [role="switch"], [role="combobox"], [contenteditable="true"]';

    function isInteractiveNode(node) {
      if (node === null || node === undefined) return false;
      if (node.closest('[data-dshl-layer]') !== null) return false;
      return node.closest(INTERACTIVE_SELECTOR) !== null;
    }

    /** 元素是否真实可见、有可点击尺寸、且与本插件无关（通用判定，不依赖类名）。 */
    function visibleRectOf(node) {
      if (node === null || node === undefined) return null;
      if (node.closest('[data-dshl-layer]') !== null) return null;
      const style = getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < 0.15) return null;
      if (node.closest('[inert]') !== null) return null;
      const rect = node.getBoundingClientRect();
      if (rect.width < 12 || rect.height < 12) return null;
      if (rect.right <= 0 || rect.bottom <= 0 || rect.left >= window.innerWidth || rect.top >= window.innerHeight) return null;
      return rect;
    }

    /**
     * 从整个文档收集「占位矩形」与「可依附锚点」。
     * 遍历 document.body 而不是四个列区域：第三方插件可能把界面渲染到 overlay、portal、
     * 甚至 body 直下，只扫列区域会完全看不见它们，于是按钮会压上去。
     * 悬浮小挂件（体积小、独立浮层）同样被纳入占位，避免遮挡。
     */
    function surveyPage() {
      const rects = [];
      const anchors = [];
      const seen = new Set();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      for (const candidate of document.body.querySelectorAll(INTERACTIVE_SELECTOR)) {
        if (seen.has(candidate)) continue;
        seen.add(candidate);
        const rect = visibleRectOf(candidate);
        if (rect === null) continue;
        rects.push({ left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom });
        // 太宽的控件（输入区、整行容器）不适合做「旁边落点」的参照
        if (rect.width > viewportWidth * 0.6) continue;
        if (rect.top < 0 || rect.left < 0 || rect.bottom > viewportHeight || rect.right > viewportWidth) continue;
        anchors.push({ node: candidate, rect });
      }
      return { rects, anchors };
    }

    /** 候选矩形是否与任何占位矩形相交（含 margin 呼吸空间）。矩形比较比点采样精确：点采样会从圆角和窄缝漏过去。 */
    function collidesRects(x, y, halfWidth, halfHeight, rects, margin) {
      const left = x - halfWidth - margin;
      const right = x + halfWidth + margin;
      const top = y - halfHeight - margin;
      const bottom = y + halfHeight + margin;
      for (const rect of rects) {
        if (rect.left < right && rect.right > left && rect.top < bottom && rect.bottom > top) return true;
      }
      return false;
    }

    /** 实测已落位按钮的矩形，看它是否真的压住了可交互元素（落位后的自检）。 */
    function measureLauncherOverlap(button) {
      if (button === null || button === undefined) return;
      const rect = button.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return 0;
      let hits = 0;
      for (let x = rect.left + 1; x <= rect.right - 1; x += 6) {
        for (let y = rect.top + 1; y <= rect.bottom - 1; y += 6) {
          const el = document.elementFromPoint(Math.round(x), Math.round(y));
          if (el !== null && el !== undefined && !button.contains(el) && isInteractiveNode(el)) hits += 1;
        }
      }
      return hits;
    }

    /** 四方向最近的可交互元素距离，越大越“空”。 */
    function probeClearance(x, y) {
      const steps = [16, 32, 48, 64, 96];
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      let clearance = 0;
      for (const [dx, dy] of dirs) {
        let reach = 0;
        for (const step of steps) {
          const px = x + dx * step;
          const py = y + dy * step;
          if (px < 0 || py < 0 || px >= window.innerWidth || py >= window.innerHeight) break;
          if (isInteractiveNode(document.elementFromPoint(px, py))) break;
          reach = step;
        }
        clearance += reach;
      }
      return clearance;
    }

    function mulberry32(seed) {
      let a = seed >>> 0;
      return () => {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function hashString(text) {
      let hash = 2166136261;
      for (let i = 0; i < text.length; i += 1) {
        hash ^= text.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
      }
      return hash >>> 0;
    }

    /** 恢复按钮的近似尺寸（半宽 / 半高）：自由落点用小号按钮，空白页用大号按钮。 */
    const LAUNCHER_HALF = { free: [36, 16], blank: [120, 60], corner: [36, 16] };

    /** 依附落点：贴在锚点控件旁侧的空隙里，返回按「贴合度」排序的候选。完全由几何决定，不认识任何插件。 */
    function anchorCandidates(anchors, rects, halfWidth, halfHeight) {
      const gap = 10;
      const out = [];
      const describe = (node) => {
        const direct = (node.getAttribute('aria-label') || node.innerText || node.getAttribute('placeholder') || '').replace(/\s+/g, ' ').trim();
        if (direct !== '') return direct.slice(0, 32);
        const img = node.querySelector('svg[data-icon], img[alt]');
        if (img !== null) {
          const hint = img.getAttribute('data-icon') || img.getAttribute('alt');
          if (hint) return hint.slice(0, 32);
        }
        const slot = node.closest('[data-slot]')?.getAttribute('data-slot');
        if (slot) return slot.split('.').pop();
        const cls = String(node.className || '').split(' ').find((name) => name !== '' && !/^_/.test(name));
        if (cls) return cls.replace(/-trigger$|-button$/, '');
        return node.tagName.toLowerCase();
      };

      // 把同一水平带（中心 y 相差 <12）的控件归成「一排」。一排的跨度就是可视工具栏的范围：
      // 依附点必须落在这个跨度内，否则会飘到工具栏外侧、看着像挂在卡片外面的异物。
      // 分组只看 y 坐标，不看父容器——跨插件、跨容器的同排控件也会被正确归到一起。
      const rows = [];
      const sorted = [...anchors].sort((a, b) => (a.rect.top + a.rect.height / 2) - (b.rect.top + b.rect.height / 2));
      for (const anchor of sorted) {
        const cy = anchor.rect.top + anchor.rect.height / 2;
        const row = rows.find((candidate) => Math.abs(candidate.centerY - cy) < 12);
        if (row === undefined) rows.push({ centerY: cy, anchors: [anchor] });
        else row.anchors.push(anchor);
      }
      for (const row of rows) {
        row.left = Math.min(...row.anchors.map((anchor) => anchor.rect.left));
        row.right = Math.max(...row.anchors.map((anchor) => anchor.rect.right));
      }
      const rowOf = (anchor) => rows.find((row) => row.anchors.includes(anchor));

      for (const anchor of anchors) {
        const rect = anchor.rect;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const row = rowOf(anchor);
        const inRow = row !== undefined && row.anchors.length >= 2;
        // 控件高度在工具栏量级（20~48）才像「同一排的东西」
        const toolbarLike = rect.height >= 20 && rect.height <= 48;
        const sides = [
          { side: 'right', x: rect.right + gap + halfWidth, y: centerY, horizontal: true },
          { side: 'left', x: rect.left - gap - halfWidth, y: centerY, horizontal: true },
          { side: 'below', x: centerX, y: rect.bottom + gap + halfHeight, horizontal: false },
          { side: 'above', x: centerX, y: rect.top - gap - halfHeight, horizontal: false },
        ];
        for (const candidate of sides) {
          // 只有落在一排控件的跨度内，才算「工具栏里多了一个按钮」；否则宁可不用这个锚点
          if (inRow && (candidate.x - halfWidth < row.left - 2 || candidate.x + halfWidth > row.right + 2)) continue;
          // 纵向贴靠容易落进输入区/正文里，只在没有同排伙伴时才允许
          if (!inRow && !candidate.horizontal) continue;
          const x = Math.round(candidate.x);
          const y = Math.round(candidate.y);
          if (x - halfWidth < 4 || x + halfWidth > window.innerWidth - 4) continue;
          if (y - halfHeight < 4 || y + halfHeight > window.innerHeight - 4) continue;
          // 用矩形碰撞而不是点采样：点采样会从圆角和窄缝漏过去
          if (collidesRects(x, y, halfWidth, halfHeight, rects, 6)) continue;
          // 反方向是否还有控件贴着：两侧都有控件说明落在一个真正的「缝」里，最协调
          const probe = candidate.horizontal
            ? { x: candidate.side === 'right' ? x + halfWidth + gap : x - halfWidth - gap, y }
            : { x, y: candidate.side === 'below' ? y + halfHeight + gap : y - halfHeight - gap };
          const neighbor = (probe.x > 0 && probe.y > 0 && probe.x < window.innerWidth && probe.y < window.innerHeight)
            ? document.elementFromPoint(Math.round(probe.x), Math.round(probe.y))
            : null;
          const inGap = isInteractiveNode(neighbor);
          let score = 0;
          if (candidate.horizontal) score += 60;
          if (inGap) score += 45;
          if (toolbarLike) score += 20;
          if (inRow) score += 25;
          score += Math.max(0, 30 - Math.abs(candidate.y - centerY) - Math.abs(candidate.x - centerX) / 8);
          out.push({
            mode: 'anchor',
            x,
            y,
            score,
            anchor: describe(anchor.node),
            side: candidate.side,
          });
        }
      }
      out.sort((a, b) => b.score - a.score);
      return out;
    }

    /**
     * 计算恢复按钮的落点；返回视口坐标与呈现模式。
     * 只用「整页测量 + 矩形碰撞」这一套通用规则，不认识任何具体插件：
     * 谁把控件放在哪里，都只是一个矩形，算法一视同仁。
     */
    function computeLauncherPlacement(regions, seedText) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const visible = [];
      for (const [name, node] of Object.entries(regions)) {
        if (node === null || node === undefined) continue;
        const rect = node.getBoundingClientRect();
        if (rect.width < 24 || rect.height < 24) continue;
        if (rect.right <= 0 || rect.bottom <= 0 || rect.left >= viewportWidth || rect.top >= viewportHeight) continue;
        visible.push({
          name,
          left: Math.max(0, rect.left),
          top: Math.max(0, rect.top),
          right: Math.min(viewportWidth, rect.right),
          bottom: Math.min(viewportHeight, rect.bottom),
        });
      }
      // 只剩空白页：屏幕正中，最大号的恢复入口
      if (visible.length === 0) return { mode: 'blank', x: Math.round(viewportWidth / 2), y: Math.round(viewportHeight / 2) };

      const random = mulberry32(hashString(seedText));
      const [halfWidth, halfHeight] = LAUNCHER_HALF.free;
      const { rects, anchors } = surveyPage();

      // 第一优先：依附到页面上任意控件旁边。位置由界面结构决定，人读到的是「那一排多了一个按钮」，
      // 而不是一个随机飘着的异物；只在高分候选里随机，避免每次都贴在同一个控件上。
      if (anchors.length > 0) {
        const candidates = anchorCandidates(anchors, rects, halfWidth, halfHeight);
        if (candidates.length > 0) {
          const best = candidates[0].score;
          const pool = candidates.filter((candidate) => candidate.score >= best - 12).slice(0, 6);
          return pool[Math.floor(random() * pool.length)] ?? candidates[0];
        }
      }

      // 第二优先：在可见区域的留白里随机。候选点用矩形碰撞一次性筛掉，不再逐点 elementFromPoint。
      const insetX = halfWidth + 6;
      const insetY = halfHeight + 6;
      const grid = [];
      for (const region of visible) {
        const left = region.left + insetX;
        const right = region.right - insetX;
        const top = region.top + insetY;
        const bottom = region.bottom - insetY;
        if (right <= left || bottom <= top) continue;
        const step = 40;
        for (let x = left; x <= right; x += step) {
          for (let y = top; y <= bottom; y += step) {
            grid.push({ x: Math.round(x), y: Math.round(y), region: region.name });
          }
        }
      }
      if (grid.length === 0) return { mode: 'corner', x: 0, y: 0 };

      const MAX_PROBES = 220;
      const probes = [];
      if (grid.length <= MAX_PROBES) {
        probes.push(...grid);
      } else {
        const stride = grid.length / MAX_PROBES;
        for (let i = 0; i < MAX_PROBES; i += 1) probes.push(grid[Math.floor(i * stride)]);
      }
      const clear = [];
      for (const candidate of probes) {
        if (collidesRects(candidate.x, candidate.y, halfWidth, halfHeight, rects, 6)) continue;
        clear.push({ ...candidate, clearance: probeClearance(candidate.x, candidate.y) });
      }
      if (clear.length === 0) return { mode: 'corner', x: 0, y: 0 };
      // 只留最空的一批再随机：位置看起来随机，但永远优先落在留白最充裕处
      const best = Math.max(...clear.map((candidate) => candidate.clearance));
      const pool = clear.filter((candidate) => candidate.clearance >= Math.max(best - 16, best * 0.7));
      const pick = pool[Math.floor(random() * pool.length)] ?? clear[0];
      return { mode: 'free', x: pick.x, y: pick.y, region: pick.region, clearance: pick.clearance };
    }

    /* ============================== 编辑面板（插件详情页内） ============================== */
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
            checked: item.region === 'sidebar' ? !col.hideSidebar
              : item.region === 'rightbar' ? !col.hideRightbar
                : !col.hideCenter,
            label: `${labels[item.region]} ${t('hide')}`,
            onChange: (on) => updateConfig((draft) => {
              if (item.region === 'sidebar') draft.columns.hideSidebar = !on;
              if (item.region === 'rightbar') draft.columns.hideRightbar = !on;
              if (item.region === 'center') draft.columns.hideCenter = !on;
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
        offset(t('offsetY'), 'offsetY', -500, 500),
        h('p', { className: 'dshl-hint' }, t('offsetClamped')));
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
      const risky = config.enabled
        && (config.columns.hideSidebar
          || config.sidebar.panelHidden.length > 0
          || config.sidebar.hidden.length >= BLOCKS.length);

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
        risky ? h('p', { className: 'dshl-warn' }, t('riskyHint')) : null,
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
        h('p', { className: 'dshl-hint' }, t('shortcutHint')),
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
    function EditOverlay({ t, ctx }) {
      const { config, targets, ui, reposition } = useStoreSnapshot();
      const [bounds, setBounds] = React.useState(null);
      const [dragging, setDragging] = React.useState(null);
      const [probeTick, setProbeTick] = React.useState(0);
      const [placementRetry, setPlacementRetry] = React.useState(0);
      const placementRef = React.useRef({ key: '', value: null });

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

      // 内容渲染完再探一次落点：首帧时会话/面板往往还是空的，探针会挑到马上被覆盖的位置
      React.useEffect(() => {
        let timer = null;
        let tries = 0;
        const bump = () => {
          tries += 1;
          setProbeTick((tick) => tick + 1);
          if (tries < 4) timer = window.setTimeout(bump, 350 * tries);
        };
        timer = window.setTimeout(bump, 320);
        return () => {
          if (timer !== null) window.clearTimeout(timer);
        };
      }, []);

      React.useEffect(() => {
        if (!ui.editing) return undefined;
        const onKeyDown = (event) => {
          if (event.key !== 'Escape' || event.defaultPrevented) return;
          if (document.querySelector('[role="dialog"]') !== null) return;
          setEditing(false);
        };
        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
      }, [ui.editing]);

      // 兜底点击通道：即使按钮被 pointer-events/遮挡问题吃掉，按坐标命中同样能触发
      React.useEffect(() => {
        const hitLauncher = (event) => {
          if (event.button !== 0 || event.defaultPrevented) return;
          const buttons = [...document.querySelectorAll('[data-dshl-button]')];
          for (const button of buttons) {
            const rect = button.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) continue;
            event.preventDefault();
            event.stopPropagation();
            button.click();
            return;
          }
        };
        document.addEventListener('pointerdown', hitLauncher, true);
        document.addEventListener('mousedown', hitLauncher, true);
        return () => {
          document.removeEventListener('pointerdown', hitLauncher, true);
          document.removeEventListener('mousedown', hitLauncher, true);
        };
      }, []);

      const active = config.enabled && bounds !== null;

      // 恢复入口的判定：只要「打开插件详情页」的路径可能断掉，就常驻一个恢复按钮
      const sidebarReachable = (() => {
        const sidebar = targets.regions.sidebar;
        if (sidebar === null || sidebar === undefined) return false;
        const rect = sidebar.getBoundingClientRect();
        if (rect.width < 40 || rect.right <= 8 || rect.left >= window.innerWidth - 8) return false;
        const nav = targets.blocks.panels;
        if (nav === null || nav === undefined) return true;
        return [...nav.children].some((node) => {
          const box = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return box.width > 0 && box.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
        });
      })();
      // 编辑区在会话区（main 面板）里：中栏被挤到屏幕外时同样进不了插件详情页
      const centerReachable = (() => {
        const center = targets.regions.center;
        if (center === null || center === undefined) return false;
        const rect = center.getBoundingClientRect();
        return rect.width >= 120 && rect.right > 8 && rect.left < window.innerWidth - 8;
      })();
      const risk = config.enabled
        && (config.columns.hideSidebar
          || config.columns.hideCenter
          || config.sidebar.panelHidden.length > 0
          || config.sidebar.hidden.length >= BLOCKS.length
          || !sidebarReachable
          || !centerReachable);

      // 落点随「可见区域的空白分布 + 配置指纹 + 本次加载的随机盐」变化：
      // 同一份配置每次打开可能落在不同留白处，但同一次会话内不会抖动。
      const placementSeed = `${config.columns.order.join(',')}|${config.columns.hideSidebar}|${config.columns.hideCenter}|${config.columns.hideRightbar}|${config.columns.hideBottom}|${config.sidebar.panelHidden.join(',')}|${config.sidebar.hidden.join(',')}|${window.innerWidth}x${window.innerHeight}|${mountSalt}|${placementRetry}|${reposition}`;
      const placementKey = `${risk ? 1 : 0}|${probeTick}|${placementSeed}`;
      if (placementRef.current.key !== placementKey) {
        placementRef.current = {
          key: placementKey,
          value: risk ? computeLauncherPlacement(targets.regions, placementSeed) : null,
        };
      }
      const placement = placementRef.current.value;

      // 落位后持续自检：按钮可能先落在空处，随后被加载出来的内容盖住——包括用户新装的、
      // 我们完全不认识的第三方插件控件。检测挂在全局 refresh 循环里（本来就跟着 DOM 变化跑），
      // 发现遮挡就 bump reposition 让落点重算。放在 active 早退之前：hooks 不能条件调用。
      React.useEffect(() => {
        if (placement === null || (placement.mode !== 'free' && placement.mode !== 'anchor')) return undefined;
        const timers = [300, 900, 1800, 3200].map((delay) => window.setTimeout(() => {
          const button = document.querySelector('[data-dshl-button="edit"]');
          if (button !== null && measureLauncherOverlap(button) > 0) requestReposition();
        }, delay));
        return () => {
          for (const timer of timers) window.clearTimeout(timer);
        };
      }, [placement]);

      if (!active) return null;
      // 打开插件页：中栏被藏起来时先放出来，否则切过去也是空白
      const openPlugins = () => {
        if (snapshot.config.columns.hideCenter) {
          updateConfig((draft) => { draft.columns.hideCenter = false; });
        }
        const layout = ctx !== null && ctx !== undefined && typeof ctx.get === 'function' ? ctx.get('layout') : undefined;
        if (layout === null || layout === undefined || typeof layout.selectPanel !== 'function') return;
        try {
          layout.selectPanel('plugins');
        } catch (error) {
          console.warn('[dsh-layout] 打开插件面板失败', error);
        }
      };

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
      const visibleRegionCount = Object.keys(bounds.regions).length;
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
          h('button', { type: 'button', className: 'dshl-btn', onClick: openPlugins }, t('openPlugins')),
          h('button', { type: 'button', className: 'dshl-btn', onClick: () => replaceConfig(null) }, t('reset')),
          visibleRegionCount === 0
            ? h('span', { className: 'dshl-itemSub' }, t('nothingToDrag'))
            : h('span', { className: 'dshl-itemSub' }, `${Math.round(config.columns.sidebarWidth)} / ${Math.round(config.columns.rightbarWidth)}`),
          h('button', { type: 'button', className: 'dshl-btn', 'data-primary': 'true', onClick: () => setEditing(false) }, t('done')))
        : null;
      // 恢复入口的按钮组：自由模式只有一枚「布局」；空白模式并排放 恢复默认 / 插件页 / 编辑模式
      const launcherActions = placement === null
        ? []
        : placement.mode === 'blank'
          ? [
            { key: 'reset', label: t('reset'), iconSize: 17, primary: true, run: () => { replaceConfig(null); setEditing(false); } },
            { key: 'plugins', label: t('openPlugins'), primary: false, run: openPlugins },
            { key: 'edit', label: t('editing'), primary: false, run: () => setEditing(true) },
          ]
          : [{ key: 'edit', label: t('title'), iconSize: 14, primary: false, run: () => setEditing(true) }];
      const floating = placement !== null && (placement.mode === 'free' || placement.mode === 'anchor');
      const launcher = risk && placement !== null
        ? h('div', {
          className: 'dshl-launcherDock',
          'data-dshl-layer': '',
          'data-mode': placement.mode,
          title: placement.mode === 'anchor' ? `${t('anchorHint')}：${placement.anchor ?? ''}` : undefined,
          style: floating
            ? { left: `${placement.x}px`, top: `${placement.y}px` }
            : undefined,
        },
        placement.mode === 'blank' ? h('span', { className: 'dshl-launcherQuestion' }, t('launcherOnBlank')) : null,
        h('div', { className: 'dshl-launcherRow' },
          ...launcherActions.map((action) => h('button', {
            key: action.key,
            type: 'button',
            className: action.primary ? 'dshl-launcher' : 'dshl-launcher dshl-launcherGhost',
            'data-dshl-button': action.key,
            'data-dshl-launcher': action.key === 'edit' && floating ? '' : undefined,
            style: { pointerEvents: 'auto' },
            title: action.key === 'edit' && floating ? t('recoveryHint') : undefined,
            onClick: action.run,
          }, action.key === 'edit' && floating ? icon(ICON_LAYOUT, 14) : null,
            action.key === 'reset' ? icon(ICON_LAYOUT, 17) : null,
            h('span', null, action.label)))),
        placement.mode === 'blank' ? h('span', { className: 'dshl-launcherHint' }, t('blankHint')) : null)
        : null;
      return h('div', { className: 'dshl-editLayer' }, boxes, handles, launcher, toolbar);
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

      // 遮挡守卫：DOM 变化后（含第三方插件刚出现）检查恢复按钮是否被压住，是则请求重新落点。
      // 放在 refresh 循环之外单独跑：refresh 只做识别，这里做的是「落点是否仍然成立」的判定。
      ctx.effect(() => {
        let timer = null;
        const check = () => {
          const button = document.querySelector('[data-dshl-button="edit"]');
          if (button !== null && measureLauncherOverlap(button) > 0) requestReposition();
        };
        const schedule = () => {
          if (timer !== null) return;
          timer = window.setTimeout(() => {
            timer = null;
            check();
          }, 600);
        };
        const observer2 = new MutationObserver(schedule);
        observer2.observe(document.body, { childList: true, subtree: true });
        return () => {
          observer2.disconnect();
          if (timer !== null) window.clearTimeout(timer);
        };
      }, 'dsh-layout: overlap guard');

      // 最后一道兜底：不依赖浮层组件是否渲染，直接从键盘恢复默认
      ctx.effect(() => {
        const onKeyDown = (event) => {
          if (event.ctrlKey !== true || event.altKey !== true || event.shiftKey !== true || event.metaKey === true) return;
          if (event.code !== 'KeyL') return;
          event.preventDefault();
          replaceConfig(null);
          setEditing(false);
        };
        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
      }, 'dsh-layout: hard reset shortcut');

      // Web 端的应急入口：地址栏加 #dsh-layout=reset 即可恢复默认
      ctx.effect(() => {
        const consumeHash = () => {
          const hash = window.location.hash;
          const at = hash.indexOf('dsh-layout=');
          if (at === -1) return;
          const value = hash.slice(at + 'dsh-layout='.length).split('&')[0];
          if (value !== 'reset' && value !== 'off') return;
          replaceConfig(null);
          setEditing(false);
          try {
            window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
          } catch (error) {
            console.warn('[dsh-layout] 无法清理地址栏哈希', error);
          }
        };
        consumeHash();
        window.addEventListener('hashchange', consumeHash);
        return () => window.removeEventListener('hashchange', consumeHash);
      }, 'dsh-layout: url reset');

      ctx.effect(() => {
        const activate = () => {
          if (!snapshot.config.enabled) updateConfig((draft) => { draft.enabled = true; }, { capture: true });
          setEditing(true);
        };
        const shortcuts = typeof ctx.get === 'function' ? ctx.get('shortcuts') : undefined;
        if (shortcuts !== null && shortcuts !== undefined && typeof shortcuts.register === 'function') {
          try {
            return shortcuts.register({
              id: 'dsh-layout.recovery',
              label: () => t('recoveryShortcut'),
              aliases: ['layout', 'recovery', '布局'],
              defaults: {
                'desktop:macos': { code: 'KeyL', modifiers: ['primary', 'alt'] },
                'desktop:windows': { code: 'KeyL', modifiers: ['primary', 'alt'] },
                'desktop:linux': { code: 'KeyL', modifiers: ['primary', 'alt'] },
                'web:macos': { code: 'KeyL', modifiers: ['primary', 'alt'] },
                'web:windows': { code: 'KeyL', modifiers: ['primary', 'alt'] },
                'web:linux': { code: 'KeyL', modifiers: ['primary', 'alt'] },
              },
              regions: ['page'],
              modals: [],
              resolve: () => ({ status: 'handled', run: activate }),
            });
          } catch (error) {
            console.warn('[dsh-layout] 快捷键注册失败，改用内置监听', error);
          }
        }
        const onKeyDown = (event) => {
          if (event.ctrlKey !== true || event.altKey !== true || event.metaKey === true || event.shiftKey === true) return;
          if (event.code !== 'KeyL') return;
          event.preventDefault();
          activate();
        };
        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
      }, 'dsh-layout: recovery shortcut');

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
      }, () => h(Boundary, null, h(EditOverlay, { t, ctx })))), 'dsh-layout: edit overlay');
    }

    return { apply, inject };
  },
});
