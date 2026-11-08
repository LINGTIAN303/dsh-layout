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
      sidebarBlocksHint: '排序或隐藏侧栏内部的区块；下方还能再拆一层。',
      blockBrand: '品牌行',
      blockNewSession: '新建会话',
      blockPanels: '面板导航',
      blockWorkspaces: '工作区',
      blockFooter: '底部操作',
      sidebarPartsHint: '侧栏拆解：品牌行与底部区内部的单元可单独隐藏。',
      sidebarPartsMissing: '未识别侧栏内部结构，拆解项暂不可用。',
      partBrandIdentity: '品牌行 · 品牌标识',
      partBrandToggle: '品牌行 · 收起按钮',
      partFooterStatus: '底部区 · 状态按钮行',
      partFooterAccount: '底部区 · 账号菜单',
      panels: '面板导航',
      panelsHint: '左栏面板图标的顺序与显隐；列表来自当前界面。',
      panelsEmpty: '未检测到面板，先打开左栏。',
      conversation: '会话区',
      conversationHint: '会话内容宽度；留空跟随默认列宽。下方可把会话区拆成三块、把会话头再拆成两行。',
      convPartsHint: '会话区拆解：三块可独立显隐；会话头能与正文换前后，输入区能提到消息区上方。',
      convPartsMissing: '未识别会话区内部结构，拆解项暂不可用。',
      partHeader: '会话头',
      partMessages: '消息区',
      partComposer: '输入区',
      partHeaderBottom: '会话头放到正文下方',
      partComposerTop: '输入区提到消息区上方',
      headerPartsHint: '会话头拆解：标题行、视图标签行，以及标题行里的会话名与操作组可各自隐藏。',
      headerPartsMissing: '未识别会话头内部结构，拆解项暂不可用。',
      partHeaderTitle: '会话头 · 标题行',
      partHeaderTabs: '会话头 · 视图标签行',
      partHeaderCrumbs: '会话头 · 会话名',
      partHeaderActions: '会话头 · 操作组',
      partTabsTop: '视图标签行放到标题行上方',
      composerPartsHint: '输入区拆解：上方的任务面板与输入卡下方的状态条可各自隐藏。',
      partTodoPanel: '输入区 · 任务面板',
      partComposerDock: '输入区 · 状态条',
      messagesPartsHint: '消息区拆解：右侧的轮次导航条可单独隐藏。',
      messagesPartsMissing: '未识别消息区内部结构，拆解项暂不可用。',
      partTurnRail: '消息区 · 轮次导航',
      composerPartsMissing: '未识别输入区内部结构，拆解项暂不可用。',
      coverage: '拆解覆盖',
      coverageHint: '声明表里每个拆解单元此刻的状态；「当前为空」表示区域已识别、但这个单元现在没渲染（例如没有待办、右栏未展开）。',
      coverageSummary: (detected, empty, pending) => `已识别 ${detected} · 当前为空 ${empty} · 待识别 ${pending}`,
      coverageDetected: '已识别',
      coverageEmpty: '当前为空',
      coveragePending: '待识别',
      externalTitle: '外部插件单元',
      externalHint: '自动扫描当前插件页面的结构；安全项可直接隐藏/排序，风险项（入口、含输入、唯一滚动、占满整页）保持只读。',
      externalEmpty: '当前页面没有可扫描的外部插件结构（会话页，或还没打开插件页）。',
      externalIframe: '该页面是 iframe，内部结构无法拆解（只能整页显隐）。',
      externalCount: (total, hide, reorder) => `扫描到 ${total} 个候选 · 可隐藏 ${hide} · 可排序 ${reorder}`,
      externalHistorical: '当前不在插件页，显示最近一次扫描结果；切到该插件页后重新扫描并生效。',
      externalExport: '导出候选清单',
      externalReadonly: '只读',
      externalTypeHeader: '页头',
      externalTypeFooter: '页底',
      externalTypeAside: '侧栏',
      externalTypeScroll: '滚动区',
      externalTypeRow: '行区',
      externalTypeMain: '主体',
      externalTypeTabItem: '标签项',
      externalTypeGroupItem: '组内项',
      externalTypeContentItem: '内容项',
      externalBlockedOnlyScroll: '唯一滚动容器',
      externalBlockedInputs: '含输入控件',
      externalBlockedEntry: '入口类',
      externalBlockedTooLarge: '占满整页',
      externalActionHide: '可隐藏',
      externalActionReorder: '可排序',
      externalOrderUp: '上移',
      externalOrderDown: '下移',
      rightbarPanel: '右栏',
      rightbarPanelHint: '右栏内部的标签栏与内容区；宽度在「区域结构」里调。',
      rightbarPartsHint: '右栏拆解：标签栏与内容区可各自隐藏，标签栏也可放到内容区下方。',
      rightbarPartsMissing: '未识别右栏内部结构，拆解项暂不可用。',
      partTabs: '标签栏',
      partContent: '内容区',
      partTabsBottom: '标签栏放到内容区下方',
      settingsPartsHint: '设置页拆解：导航列、页头、选项区可各自隐藏，导航列还能移到右侧。',
      settingsPartsMissing: '尚未打开过设置面板，拆解项待识别（打开一次设置即可）。',
      partNavHidden: '显示导航列',
      partNavRight: '导航列放右侧',
      partSetHeader: '设置页 · 页头',
      partSetOptions: '设置页 · 选项区',
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
      surfaces: '界面结构',
      surfacesHint: '宿主原生区域预先登记；插件提供的界面页面在运行时识别，不依赖任何具体插件名。',
      surfaceNative: '原生区域',
      surfacePages: '原生页面',
      surfacePlugins: '插件页面',
      surfaceConversation: '会话页',
      surfaceSchedules: '自动化任务',
      surfacePluginsManager: '插件页',
      surfacePluginDetail: '插件详情页',
      surfaceOverlay: '浮层',
      surfaceSettingsDialog: '设置面板',
      ownerOfficial: '官方',
      ownerNative: '原生',
      ownerThird: '第三方',
      ownerAuto: '自动识别',
      tierLabel: '识别方式',
      tierOfficialShort: '官方登记',
      tierThirdShort: '第三方登记',
      tierAutoShort: '自动识别',
      ownerUnknown: '来源未知',
      surfaceRecognized: '已识别',
      surfacePending: '待识别',
      surfaceDrift: '签名变化，待复核',
      surfacesEmpty: '当前没识别到插件页面。',
      surfacesCount: (n) => `共 ${n} 个界面页面`,
      reviewTitle: '待复核清单',
      reviewEmpty: '没有识别异常。',
      reviewExport: '导出待复核清单',
      reviewClear: '清空',
      reviewHint: '异常会自动记录：曾由登记认出的页面签名变了（drift），或从未登记、只能靠自动识别（unregistered）。导出 JSON 后照签名更新登记表。',
      anomalyDrift: '签名变化',
      anomalyUnregistered: '未登记',
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
      sidebarBlocksHint: 'Order or hide the blocks inside the sidebar; one level deeper below.',
      blockBrand: 'Brand row',
      blockNewSession: 'New session',
      blockPanels: 'Panels',
      blockWorkspaces: 'Workspaces',
      blockFooter: 'Footer actions',
      sidebarPartsHint: 'Sidebar parts: units inside the brand row and the footer can be hidden separately.',
      sidebarPartsMissing: 'The sidebar internals are not recognized; the split controls are unavailable.',
      partBrandIdentity: 'Brand row · identity',
      partBrandToggle: 'Brand row · collapse button',
      partFooterStatus: 'Footer · status buttons',
      partFooterAccount: 'Footer · account menu',
      panels: 'Panel navigation',
      panelsHint: 'Order and visibility of the sidebar panel icons, read from the interface.',
      panelsEmpty: 'No panels detected; open the sidebar first.',
      conversation: 'Conversation',
      conversationHint: 'Content width; empty follows the default column width. Below you can split the conversation into parts and the header into two rows.',
      convPartsHint: 'Conversation parts: three independently hideable blocks; the header can move below the body and the composer can move above the messages.',
      convPartsMissing: 'The conversation internals are not recognized; the split controls are unavailable.',
      partHeader: 'Session header',
      partMessages: 'Messages',
      partComposer: 'Composer',
      partHeaderBottom: 'Header below the body',
      partComposerTop: 'Composer above the messages',
      headerPartsHint: 'Session header parts: the title row, the view tabs row, and the title row\'s session name and action group can each be hidden.',
      headerPartsMissing: 'The session header internals are not recognized; the split controls are unavailable.',
      partHeaderTitle: 'Header · title row',
      partHeaderTabs: 'Header · view tabs row',
      partHeaderCrumbs: 'Header · session name',
      partHeaderActions: 'Header · action group',
      partTabsTop: 'View tabs above the title row',
      composerPartsHint: 'Composer parts: the task panel above and the status bar below the input card can each be hidden.',
      partTodoPanel: 'Composer · task panel',
      partComposerDock: 'Composer · status bar',
      messagesPartsHint: 'Messages parts: the turn navigator rail on the right can be hidden separately.',
      messagesPartsMissing: 'The messages internals are not recognized; the split controls are unavailable.',
      partTurnRail: 'Messages · turn navigator',
      composerPartsMissing: 'The composer internals are not recognized; the split controls are unavailable.',
      coverage: 'Part coverage',
      coverageHint: 'Status of every declared part right now; "Empty" means the area is recognized but the part is not rendered at the moment (no todo list, right column closed, ...).',
      coverageSummary: (detected, empty, pending) => `Detected ${detected} · empty ${empty} · pending ${pending}`,
      coverageDetected: 'Detected',
      coverageEmpty: 'Empty',
      coveragePending: 'Pending',
      externalTitle: 'External plugin units',
      externalHint: 'Auto-scans the current plugin page; safe units can be hidden or reordered, risky ones (entry, inputs, only scroll container, fills page) stay read-only.',
      externalEmpty: 'No external plugin structure to scan on this page (conversation page, or no plugin page open).',
      externalIframe: 'This page is an iframe; its internals cannot be decomposed (whole-page visibility only).',
      externalCount: (total, hide, reorder) => `${total} candidates · ${hide} hideable · ${reorder} reorderable`,
      externalHistorical: 'Not on a plugin page right now; showing the last scan. Switch to that plugin page to rescan and apply.',
      externalExport: 'Export candidates',
      externalReadonly: 'Read only',
      externalTypeHeader: 'Header',
      externalTypeFooter: 'Footer',
      externalTypeAside: 'Aside',
      externalTypeScroll: 'Scroll area',
      externalTypeRow: 'Row',
      externalTypeMain: 'Main',
      externalTypeTabItem: 'Tab item',
      externalTypeGroupItem: 'Group item',
      externalTypeContentItem: 'Content item',
      externalBlockedOnlyScroll: 'Only scroll container',
      externalBlockedInputs: 'Contains inputs',
      externalBlockedEntry: 'Entry point',
      externalBlockedTooLarge: 'Fills the page',
      externalActionHide: 'Hideable',
      externalActionReorder: 'Reorderable',
      externalOrderUp: 'Move up',
      externalOrderDown: 'Move down',
      rightbarPanel: 'Right column',
      rightbarPanelHint: 'The tab strip and content area inside the right column; width is set in region structure.',
      rightbarPartsHint: 'Right column parts: the tab strip and content can each be hidden, and the tab strip can move below the content.',
      rightbarPartsMissing: 'The right column internals are not recognized; the split controls are unavailable.',
      partTabs: 'Tab strip',
      partContent: 'Content',
      partTabsBottom: 'Tab strip below the content',
      settingsPartsHint: 'Settings parts: the navigation column, the header and the options area can each be hidden; the navigation column can move to the right.',
      settingsPartsMissing: 'The settings panel has not been opened yet; open it once to enable these controls.',
      partNavHidden: 'Show navigation',
      partNavRight: 'Navigation on the right',
      partSetHeader: 'Settings · header',
      partSetOptions: 'Settings · options area',
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
      surfaces: 'Interface surfaces',
      surfacesHint: 'Native regions are declared ahead of time; plugin-provided pages are recognized at runtime without knowing any specific plugin.',
      surfaceNative: 'Native regions',
      surfacePages: 'Native pages',
      surfacePlugins: 'Plugin pages',
      surfaceConversation: 'Conversation',
      surfaceSchedules: 'Scheduled tasks',
      surfacePluginsManager: 'Plugins page',
      surfacePluginDetail: 'Plugin detail',
      surfaceOverlay: 'Overlay',
      surfaceSettingsDialog: 'Settings panel',
      ownerOfficial: 'Official',
      ownerNative: 'Native',
      ownerThird: 'Third party',
      ownerAuto: 'Auto-detected',
      tierLabel: 'Detected by',
      tierOfficialShort: 'Official registry',
      tierThirdShort: 'Third-party registry',
      tierAutoShort: 'Auto-detection',
      ownerUnknown: 'Unknown source',
      surfaceRecognized: 'Recognized',
      surfacePending: 'Pending',
      surfaceDrift: 'Signature changed, review needed',
      surfacesEmpty: 'No plugin page recognized yet.',
      surfacesCount: (n) => `${n} interface pages`,
      reviewTitle: 'Review queue',
      reviewEmpty: 'No recognition anomaly.',
      reviewExport: 'Export review list',
      reviewClear: 'Clear',
      reviewHint: 'Anomalies are recorded automatically: a registered page whose signature changed (drift), or a page never registered and only auto-detected (unregistered). Export the JSON and update the registry by signature.',
      anomalyDrift: 'Signature changed',
      anomalyUnregistered: 'Not registered',
    };

    /* ============================== 配置 ============================== */
    const STORAGE_KEY = 'dsh-layout/config/v1';
    const REGIONS = ['sidebar', 'center', 'rightbar'];
    const BLOCKS = ['brand', 'new-session', 'panels', 'workspaces', 'footer'];

    /**
     * 拆解单元声明表：所有拆解控制项的唯一事实源。
     * 区域识别器只负责把元素认出来（targets.units），标记、样式、卡片、覆盖度都从这张表派生，
     * 避免「识别一套、样式一套、卡片再一套」三处漂移。
     *
     * 字段：
     * - id：主标记（data-dshl-unit 的值）；targets 缺省时等于 [id]
     * - area：所属区域（决定覆盖度里的「区域是否识别过」）
     * - section：卡片分组（PART_SECTIONS 的 id）
     * - labelKey：文案键
     * - kind：hide = 显隐；order = 换序/换边（换序的结构规则手写在 buildDynamicCss）
     * - path：配置路径
     * - targets：隐藏时可命中的单元标记（缺省 [id]）
     * - needs：order 项判可用所需的单元
     * - after：写入配置后的联动
     */
    const PART_UNITS = [
      // 侧栏内部
      { id: 'sb-brand', area: 'sidebar', section: 'sidebarParts', labelKey: 'partBrandIdentity', kind: 'hide', path: ['sidebar', 'parts', 'hideIdentity'] },
      { id: 'sb-toggle', area: 'sidebar', section: 'sidebarParts', labelKey: 'partBrandToggle', kind: 'hide', path: ['sidebar', 'parts', 'hideToggle'] },
      { id: 'sb-status', area: 'sidebar', section: 'sidebarParts', labelKey: 'partFooterStatus', kind: 'hide', path: ['sidebar', 'parts', 'hideStatus'] },
      { id: 'sb-account', area: 'sidebar', section: 'sidebarParts', labelKey: 'partFooterAccount', kind: 'hide', path: ['sidebar', 'parts', 'hideAccount'] },
      // 会话区三块 + 两个换序
      { id: 'conv-header', area: 'center', section: 'convBase', labelKey: 'partHeader', kind: 'hide', path: ['center', 'parts', 'hideHeader'] },
      { id: 'conv-messages', area: 'center', section: 'convBase', labelKey: 'partMessages', kind: 'hide', path: ['center', 'parts', 'hideMessages'] },
      { id: 'conv-composer', area: 'center', section: 'convBase', labelKey: 'partComposer', kind: 'hide', path: ['center', 'parts', 'hideComposer'] },
      { id: 'conv-header-bottom', area: 'center', section: 'convBase', labelKey: 'partHeaderBottom', kind: 'order', path: ['center', 'parts', 'headerBottom'], needs: ['conv-header', 'conv-messages'] },
      { id: 'conv-composer-top', area: 'center', section: 'convBase', labelKey: 'partComposerTop', kind: 'order', path: ['center', 'parts', 'composerTop'], needs: ['conv-messages', 'conv-composer'] },
      // 会话头内部
      { id: 'conv-title-row', area: 'center', section: 'convHeader', labelKey: 'partHeaderTitle', kind: 'hide', path: ['center', 'parts', 'hideTitleRow'] },
      { id: 'conv-view-tabs', area: 'center', section: 'convHeader', labelKey: 'partHeaderTabs', kind: 'hide', path: ['center', 'parts', 'hideViewTabs'] },
      { id: 'conv-title-crumbs', area: 'center', section: 'convHeader', labelKey: 'partHeaderCrumbs', kind: 'hide', path: ['center', 'parts', 'hideTitleCrumbs'] },
      { id: 'conv-title-actions', area: 'center', section: 'convHeader', labelKey: 'partHeaderActions', kind: 'hide', path: ['center', 'parts', 'hideHeaderActions'] },
      { id: 'conv-tabs-top', area: 'center', section: 'convHeader', labelKey: 'partTabsTop', kind: 'order', path: ['center', 'parts', 'tabsTop'], needs: ['conv-title-row', 'conv-view-tabs'] },
      // 消息区 / 输入区附加块
      { id: 'conv-turn-rail', area: 'center', section: 'messagesParts', labelKey: 'partTurnRail', kind: 'hide', path: ['center', 'parts', 'hideTurnRail'] },
      { id: 'conv-todo-panel', area: 'center', section: 'composerParts', labelKey: 'partTodoPanel', kind: 'hide', path: ['center', 'parts', 'hideTodoPanel'] },
      { id: 'conv-dock', area: 'center', section: 'composerParts', labelKey: 'partComposerDock', kind: 'hide', path: ['center', 'parts', 'hideComposerDock'] },
      // 右栏
      { id: 'rb-tabs', area: 'rightbar', section: 'rightbarParts', labelKey: 'partTabs', kind: 'hide', path: ['rightbar', 'parts', 'hideTabs'] },
      { id: 'rb-content', area: 'rightbar', section: 'rightbarParts', labelKey: 'partContent', kind: 'hide', path: ['rightbar', 'parts', 'hideContent'] },
      { id: 'rb-tabs-bottom', area: 'rightbar', section: 'rightbarParts', labelKey: 'partTabsBottom', kind: 'order', path: ['rightbar', 'parts', 'tabsBottom'], needs: ['rb-tabs', 'rb-content'] },
      // 设置页
      { id: 'set-nav-hide', area: 'settings', section: 'settingsParts', labelKey: 'partNavHidden', kind: 'hide', path: ['settings', 'parts', 'hideNav'], targets: ['set-nav-title', 'set-nav'] },
      { id: 'set-nav-right', area: 'settings', section: 'settingsParts', labelKey: 'partNavRight', kind: 'order', path: ['settings', 'parts', 'navRight'], needs: ['set-nav'], after: (draft, on) => { if (on) draft.settings.parts.hideNav = false; } },
      { id: 'set-header', area: 'settings', section: 'settingsParts', labelKey: 'partSetHeader', kind: 'hide', path: ['settings', 'parts', 'hideHeader'] },
      { id: 'set-options', area: 'settings', section: 'settingsParts', labelKey: 'partSetOptions', kind: 'hide', path: ['settings', 'parts', 'hideOptions'] },
    ];

    /** 卡片分组：一张卡片里可能有多组拆解项，每组一段说明 + 该组单元 */
    const PART_SECTIONS = [
      { id: 'convBase', area: 'center', hintKey: 'convPartsHint', missingKey: 'convPartsMissing' },
      { id: 'convHeader', area: 'center', hintKey: 'headerPartsHint', missingKey: 'headerPartsMissing' },
      { id: 'messagesParts', area: 'center', hintKey: 'messagesPartsHint', missingKey: 'messagesPartsMissing' },
      { id: 'composerParts', area: 'center', hintKey: 'composerPartsHint', missingKey: 'composerPartsMissing' },
      { id: 'sidebarParts', area: 'sidebar', hintKey: 'sidebarPartsHint', missingKey: 'sidebarPartsMissing' },
      { id: 'rightbarParts', area: 'rightbar', hintKey: 'rightbarPartsHint', missingKey: 'rightbarPartsMissing' },
      { id: 'settingsParts', area: 'settings', hintKey: 'settingsPartsHint', missingKey: 'settingsPartsMissing' },
    ];


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
      sidebar: {
        order: [...BLOCKS],
        hidden: [],
        panelOrder: [],
        panelHidden: [],
        // 侧栏拆解：品牌行（品牌标识 / 收起按钮）与底部区（状态按钮行 / 账号菜单）
        parts: { hideIdentity: false, hideToggle: false, hideStatus: false, hideAccount: false },
      },
      center: {
        contentWidth: null,
        parts: { hideHeader: false, hideMessages: false, hideComposer: false, headerBottom: false, composerTop: false, hideTitleRow: false, hideViewTabs: false, hideTitleCrumbs: false, hideHeaderActions: false, hideTodoPanel: false, hideComposerDock: false, hideTurnRail: false, tabsTop: false },
      },
      rightbar: {
        parts: { hideTabs: false, hideContent: false, tabsBottom: false },
      },
      settings: {
        width: null,
        height: null,
        navWidth: null,
        offsetX: 0,
        offsetY: 0,
        parts: { hideNav: false, navRight: false, hideHeader: false, hideOptions: false },
      },
      // 外部插件单元：key 形如 `任务看板::L1.1.0`；hide 为键列表，order 为键到顺序的映射
      external: { hide: [], order: {} },
    };

    const ABSENT_TARGETS = {
      ok: false,
      frame: null,
      regions: {},
      sidebarRoot: null,
      blocks: {},
      sidebarParts: null,
      panels: [],
      conversation: null,
      convParts: null,
      headerParts: null,
      composerParts: null,
      messagesParts: null,
      external: null,
      units: {},
      settings: null,
      surfaces: [],
      anomalies: [],
    };

    function clampInt(value, min, max, fallback) {
      const num = Number(value);
      if (!Number.isFinite(num)) return fallback;
      return Math.min(max, Math.max(min, Math.round(num)));
    }

    function clone(value) {
      return JSON.parse(JSON.stringify(value));
    }

    /** 拆解单元的配置路径读写：声明表里只存路径，避免 24 个字段各写一遍取值/写值代码。 */
    function readPath(source, path) {
      let node = source;
      for (const key of path) {
        if (node === null || node === undefined) return undefined;
        node = node[key];
      }
      return node;
    }

    function writePath(target, path, value) {
      let node = target;
      for (let index = 0; index < path.length - 1; index += 1) node = node[path[index]];
      node[path[path.length - 1]] = value;
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
      const sidebarParts = sb.parts && typeof sb.parts === 'object' ? sb.parts : {};
      out.sidebar = {
        order: blockOrder,
        hidden: uniqValid(sb.hidden, BLOCKS),
        panelOrder: [...new Set(strings(sb.panelOrder))],
        panelHidden: [...new Set(strings(sb.panelHidden))],
        parts: {
          hideIdentity: sidebarParts.hideIdentity === true,
          hideToggle: sidebarParts.hideToggle === true,
          hideStatus: sidebarParts.hideStatus === true,
          hideAccount: sidebarParts.hideAccount === true,
        },
      };
      const center = raw.center && typeof raw.center === 'object' ? raw.center : {};
      const parts = center.parts && typeof center.parts === 'object' ? center.parts : {};
      out.center = {
        contentWidth: center.contentWidth == null ? null : clampInt(center.contentWidth, 520, 1600, null),
        // 会话区拆解：三块独立显隐 + 两个位置开关（会话头置底、输入区置顶）+ 会话头内部行/段 + 输入区任务面板
        parts: {
          hideHeader: parts.hideHeader === true,
          hideMessages: parts.hideMessages === true,
          hideComposer: parts.hideComposer === true,
          headerBottom: parts.headerBottom === true,
          composerTop: parts.composerTop === true,
          hideTitleRow: parts.hideTitleRow === true,
          hideViewTabs: parts.hideViewTabs === true,
          hideTitleCrumbs: parts.hideTitleCrumbs === true,
          hideHeaderActions: parts.hideHeaderActions === true,
          hideTodoPanel: parts.hideTodoPanel === true,
          hideComposerDock: parts.hideComposerDock === true,
          hideTurnRail: parts.hideTurnRail === true,
          tabsTop: parts.tabsTop === true,
        },
      };
      const settings = raw.settings && typeof raw.settings === 'object' ? raw.settings : {};
      const settingsParts = settings.parts && typeof settings.parts === 'object' ? settings.parts : {};
      out.settings = {
        width: settings.width == null ? null : clampInt(settings.width, 560, 1400, null),
        height: settings.height == null ? null : clampInt(settings.height, 380, 1200, null),
        navWidth: settings.navWidth == null ? null : clampInt(settings.navWidth, 120, 360, null),
        offsetX: clampInt(settings.offsetX, -600, 600, 0),
        offsetY: clampInt(settings.offsetY, -500, 500, 0),
        // 设置页拆解：导航列（含标题）、页头、选项区；导航列可换到右侧
        parts: {
          hideNav: settingsParts.hideNav === true,
          navRight: settingsParts.navRight === true,
          hideHeader: settingsParts.hideHeader === true,
          hideOptions: settingsParts.hideOptions === true,
        },
      };
      const rightbar = raw.rightbar && typeof raw.rightbar === 'object' ? raw.rightbar : {};
      const rightbarParts = rightbar.parts && typeof rightbar.parts === 'object' ? rightbar.parts : {};
      out.rightbar = {
        // 右栏拆解：标签栏与内容区
        parts: {
          hideTabs: rightbarParts.hideTabs === true,
          hideContent: rightbarParts.hideContent === true,
          tabsBottom: rightbarParts.tabsBottom === true,
        },
      };
      // 外部插件单元：键为 `pageKey::unitKey`；只保留字符串键与整数顺序，越界夹取
      const external = raw.external && typeof raw.external === 'object' ? raw.external : {};
      const hideList = Array.isArray(external.hide) ? external.hide.filter((item) => typeof item === 'string' && item.length > 0 && item.length <= 120) : [];
      const orderMap = {};
      if (external.order !== null && typeof external.order === 'object') {
        for (const [key, value] of Object.entries(external.order)) {
          if (typeof key !== 'string' || key.length === 0 || key.length > 120) continue;
          const num = Number(value);
          if (!Number.isFinite(num)) continue;
          orderMap[key] = Math.min(50, Math.max(-50, Math.round(num)));
        }
      }
      out.external = {
        hide: [...new Set(hideList)].slice(0, 200),
        order: Object.fromEntries(Object.entries(orderMap).slice(0, 200)),
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
      const surfaceSignature = (list) => list.map((surface) => `${surface.id}:${surface.active ? 1 : 0}:${surface.source}:${surface.tier}:${surface.recognized ? 1 : 0}`).join('|');
      const anomalySignature = (list) => list.map((item) => `${item.label}:${item.kind}`).join('|');
      // 外部插件扫描结果也进签名：页面切换/扫描变化时卡片与样式要跟着重绘
      const externalSignature = (value) => (value === null || value === undefined
        ? ''
        : `${value.pageKey}:${(value.units ?? []).map((unit) => unit.key).join(',')}:${value.iframe === null ? 'd' : 'i'}`);
      const buildSignature = (value) => (value.ok
        ? `${Object.keys(value.regions).join(',')}|${value.panels.map((panel) => panel.label).join('\u0001')}|${value.settings ? 's' : ''}|${surfaceSignature(value.surfaces ?? [])}|${anomalySignature(value.anomalies ?? [])}|${externalSignature(value.external)}`
        : '');
      const signature = buildSignature(targets);
      const previousSignature = buildSignature(previous);
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

    /** 从锚点向上走到容器的直接子级；中间多一层包裹也能认出来（拆解单元定位的统一做法）。 */
    function branchOf(container, selector) {
      if (container === null || container === undefined) return null;
      const target = container.querySelector(selector);
      if (target === null) return null;
      let cur = target;
      while (cur !== null && cur.parentElement !== container) cur = cur.parentElement;
      return cur !== null && cur.parentElement === container ? cur : null;
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

    /* ============================== 界面结构（surface）识别 ============================== */
    /**
     * 「界面结构」= 用户能看到的每一个界面单元：外壳区域 + 页面 + 浮层。
     *
     * 识别分三档，优先级从高到低（前两档都是人工登记，第三档才是算法兜底）：
     * 1. 官方（official）：DSH 自带区域与官方页面，登记在 OFFICIAL_PAGES。
     *    每次 DSH 升级都要主动复核这份表——它是适配责任，不是猜测结果。
     * 2. 第三方（third）：已适配的第三方插件页面，登记在 THIRD_PARTY_PAGES。
     *    逐个补，新插件没来得及适配时自然落到第三档。
     * 3. 自动识别（auto）：登记的签名都对不上时，按通用证据现场判定——
     *    iframe / data-dsh-plugin / 独立文档，命中即视为第三方；都不命中记 unknown。
     *
     * 关键纪律：未登记的页面绝不因为「长得像官方」被判成官方。官方只有一份人工名单。
     */
    const OFFICIAL_PAGES = [
      // 宿主外壳区域
      { id: 'region.sidebar', kind: 'region', labelKey: 'sidebar', selector: '[data-slot="sidebar"]' },
      { id: 'region.center', kind: 'region', labelKey: 'center', selector: '[data-slot="main"]' },
      { id: 'region.rightbar', kind: 'region', labelKey: 'rightbar', selector: '[data-slot="rightbar"]' },
      { id: 'region.bottom', kind: 'region', labelKey: 'bottomBar', selector: '[data-slot="shell.bottom"]' },
      { id: 'region.overlay', kind: 'region', labelKey: 'surfaceOverlay', selector: '[data-slot="shell.overlay"]' },
      // 宿主自带页面与浮层
      { id: 'page.conversation', kind: 'page', labelKey: 'surfaceConversation', selector: '[data-slot="main.conversation"]' },
      { id: 'page.plugins', kind: 'page', labelKey: 'surfacePluginsManager', selector: '[data-plugin-panel]' },
      { id: 'page.plugin-detail', kind: 'page', labelKey: 'surfacePluginDetail', selector: '[data-plugin-detail]' },
      { id: 'dialog.settings', kind: 'dialog', labelKey: 'surfaceSettingsDialog', selector: '[data-shortcut-modal="settings"]' },
      // 官方插件页面（随安装出现）。优先用宿主写死的 data 值做判定，比 CSS 模块哈希稳定得多。
      { id: 'page.panel:插件', kind: 'official-page', labelKey: 'surfacePluginsManager', signature: { tag: 'section', dataValues: { 'data-plugin-panel': 'true' } } },
      { id: 'page.panel:自动化任务', kind: 'official-page', labelKey: 'surfaceSchedules', signature: { tag: 'section', dataValues: { 'data-testid': 'task-manager-page' } } },
    ];

    /**
     * 已适配的第三方页面登记表（逐步补充）。
     * 判定优先用插件自己写的 data 值（最稳），其次才用 CSS 模块前缀；
     * 插件更新导致签名失配时，这一页会自动退回第三档「自动识别」，不会误判成官方。
     */
    const THIRD_PARTY_PAGES = [
      { id: 'page.panel:自媒体工作台', label: '自媒体工作台', signature: { tag: 'div', classPrefix: 'md-root' } },
      { id: 'page.panel:歸藏设计', label: '歸藏设计', signature: { tag: 'iframe', iframePrefix: '/guizang-design/' } },
      { id: 'page.panel:上下文洞察', label: '上下文洞察', signature: { tag: 'section', classPrefix: 'lc-ov-page' } },
      { id: 'page.panel:任务看板', label: '任务看板', signature: { tag: 'div', dataValues: { 'data-dsh-plugin': 'task-board' } } },
      { id: 'page.panel:技能中心', label: '技能中心', signature: { tag: 'div', dataValues: { 'data-dsh-plugin': 'skill-explorer' } } },
      { id: 'page.panel:MCP连接器', label: 'MCP连接器', signature: { tag: 'div', classPrefix: 'mcpConnectorMarketPanel' } },
      { id: 'page.panel:演示文稿', label: '演示文稿', signature: { tag: 'section', classPrefix: 'dshw', dataAttrs: ['data-main'] } },
    ];

    const SURFACE_STORE_KEY = 'dsh-layout/surfaces/v1';
    /** 识别异常记录：登记表与真实界面对不上的页面，落到这里等复核。 */
    const SURFACE_ANOMALY_KEY = 'dsh-layout/surface-anomalies/v1';

    function readJsonStore(key) {
      try {
        const raw = JSON.parse(window.localStorage.getItem(key) ?? '{}');
        return raw !== null && typeof raw === 'object' ? raw : {};
      } catch (error) {
        console.warn(`[dsh-layout] 读取 ${key} 失败，按空处理`, error);
        return {};
      }
    }

    function writeJsonStore(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`[dsh-layout] 保存 ${key} 失败`, error);
      }
    }

    let surfaceStore = readJsonStore(SURFACE_STORE_KEY);
    let surfaceStoreDirty = false;

    function flushSurfaceStore() {
      if (!surfaceStoreDirty) return;
      surfaceStoreDirty = false;
      writeJsonStore(SURFACE_STORE_KEY, surfaceStore);
    }

    /**
     * 识别异常表（键 = 页面名）。
     * 两类：
     * - drift：这一页曾由登记表认出来，现在签名对不上、掉到自动档 → 登记该复核了；
     * - unregistered：一直是自动识别、也没登记 → 需要补进第三方表（或确认是官方新页面）。
     * 记录实测签名与观测时间，导出后可直接照着改登记表。
     */
    let surfaceAnomalies = readJsonStore(SURFACE_ANOMALY_KEY);
    let surfaceAnomalyDirty = false;

    function recordAnomaly(label, kind, detail) {
      const previous = surfaceAnomalies[label];
      const same = previous !== undefined
        && previous.kind === kind
        && previous.observedTier === detail.observedTier
        && JSON.stringify(previous.signature) === JSON.stringify(detail.signature);
      // 同一条异常重复观测到就不动记录：避免每次界面刷新都改写时间戳，导致签名抖动与无谓写盘
      if (same) return;
      surfaceAnomalies[label] = {
        label,
        kind,
        expectedTier: detail.expectedTier ?? null,
        observedTier: detail.observedTier,
        source: detail.source,
        signature: detail.signature,
        firstSeenAt: previous?.firstSeenAt ?? Date.now(),
        lastSeenAt: Date.now(),
        count: (previous?.count ?? 0) + 1,
      };
      surfaceAnomalyDirty = true;
    }

    function flushAnomalies() {
      if (!surfaceAnomalyDirty) return;
      surfaceAnomalyDirty = false;
      writeJsonStore(SURFACE_ANOMALY_KEY, surfaceAnomalies);
    }

    /** 页面恢复正常登记后清掉对应异常，避免清单里留下已解决的问题。 */
    function clearAnomaly(label) {
      if (surfaceAnomalies[label] === undefined) return;
      delete surfaceAnomalies[label];
      surfaceAnomalyDirty = true;
    }

    /** 主面板当前渲染的页面根节点：可能是 section/div/iframe，取第一个有尺寸的子元素。 */
    function mainPageRoot() {
      const main = document.querySelector('[data-slot="main"]');
      if (main === null) return null;
      for (const child of main.children) {
        const rect = child.getBoundingClientRect();
        if (rect.width > 20 && rect.height > 20) return child;
      }
      return main.firstElementChild;
    }

    /** 页面签名：tag + CSS 模块前缀 + data-* 名值对，或 iframe 源前缀。 */
    function pageSignatureOf(root) {
      if (root === null || root === undefined) return null;
      if (root.tagName === 'IFRAME') {
        const src = (root.getAttribute('src') ?? '').split('?')[0];
        return { tag: 'iframe', iframeSrc: src, dataAttrs: [], data: {}, classPrefix: '' };
      }
      const data = {};
      const dataAttrs = [];
      for (const attr of root.attributes) {
        if (!attr.name.startsWith('data-') || attr.name.startsWith('data-dshl')) continue;
        dataAttrs.push(attr.name);
        data[attr.name] = attr.value;
      }
      dataAttrs.sort();
      const classPrefix = (String(root.className ?? '').split(' ').filter(Boolean)[0] ?? '').split('_')[0].slice(0, 24);
      return { tag: root.tagName.toLowerCase(), classPrefix, dataAttrs, data, iframeSrc: null };
    }

    /** 签名比对：tag 必须一致；iframe 比源前缀；dataValues 要求精确值；dataAttrs 要求属性存在；classPrefix 比前缀。 */
    function signatureMatches(signature, rule) {
      if (signature === null || rule === null || rule === undefined) return false;
      if (rule.tag !== undefined && signature.tag !== rule.tag) return false;
      if (rule.iframePrefix !== undefined) {
        return signature.iframeSrc !== null && signature.iframeSrc.startsWith(rule.iframePrefix);
      }
      for (const [name, value] of Object.entries(rule.dataValues ?? {})) {
        if (signature.data?.[name] !== value) return false;
      }
      for (const attr of rule.dataAttrs ?? []) {
        if (!signature.dataAttrs.includes(attr)) return false;
      }
      if (rule.classPrefix !== undefined && rule.classPrefix !== '' && !signature.classPrefix.startsWith(rule.classPrefix)) return false;
      return true;
    }

    /**
     * 自动识别（第三档）：人工名单都没命中时的兜底判定。
     * 只用「插件自己留下的痕迹」，不用外观推测，避免把第三方误认成官方。
     */
    function autoDetectSource(root, signature) {
      if (signature === null) return 'unknown';
      if (signature.tag === 'iframe') return 'third';
      if (signature.dataAttrs.includes('data-dsh-plugin')) return 'third';
      return 'unknown';
    }

    /**
     * 判定当前页面的归属与识别档位。
     * 顺序：官方登记 → 第三方登记 → 自动识别。返回 { source, tier, labelKey?, label? }。
     */
    function classifyPage(root) {
      const signature = pageSignatureOf(root);
      if (signature === null) return { source: 'unknown', tier: 'auto', signature: null };
      for (const rule of OFFICIAL_PAGES) {
        if (rule.signature !== undefined && signatureMatches(signature, rule.signature)) {
          return { source: 'official', tier: 'official', labelKey: rule.labelKey, signature };
        }
      }
      for (const rule of THIRD_PARTY_PAGES) {
        if (signatureMatches(signature, rule.signature)) {
          return { source: 'third', tier: 'third', label: rule.label, signature, pendingOfficial: rule.pendingOfficial === true };
        }
      }
      return { source: autoDetectSource(root, signature), tier: 'auto', signature };
    }

    /**
     * 收集当前所有界面结构。
     * - 外壳区域与宿主页面：来自官方登记表，按选择器判在场；
     * - 官方插件页面：只用于给侧栏面板行定档，不单独列一遍（面板行已经在插件页面组里）；
     * - 侧栏插件页面：逐个按三档分级识别。
     */
    function readSurfaces(targets) {
      const out = [];
      for (const surface of OFFICIAL_PAGES) {
        if (surface.selector === undefined) continue;
        out.push({
          id: surface.id,
          kind: surface.kind,
          labelKey: surface.labelKey,
          source: 'official',
          tier: 'official',
          present: document.querySelector(surface.selector) !== null,
        });
      }
      const root = mainPageRoot();
      const current = classifyPage(root);
      // 侧栏面板页面
      const nav = targets.blocks.panels ?? null;
      // 只收按钮：nav 里除面板按钮外还有「更多」这类菜单触发器，它们不指向页面
      const rows = nav === null ? [] : [...nav.children].filter((node) => node.tagName === 'BUTTON');
      const activeRow = rows.find((row) => row.getAttribute('aria-current') === 'page') ?? null;
      const activeLabel = activeRow === null ? null : (activeRow.getAttribute('aria-label') ?? '').trim();
      for (const row of rows) {
        const label = (row.getAttribute('aria-label') ?? '').trim();
        if (label === '') continue;
        const isActive = label === activeLabel && root !== null;
        // 侧栏面板的归属以「官方表命中 → 第三方表命中 → 自动识别」为准；
        // 未激活的行看不到自己的页面，只能用已缓存的结果，缓存里没有就标为待识别。
        const known = surfaceStore[label];
        const result = isActive ? current : (known ?? null);
        const source = result?.source ?? 'unknown';
        const tier = result?.tier ?? 'pending';
        // 登记失配：这一页曾经被官方/第三方登记表认出来，这次却掉到自动档 ——
        // 说明页面签名变了（DSH 升级或插件更新），该复核登记表了。
        // 用 registeredTier 记住「上次命中的档位」，不能拿当前结果比，否则一次失配就永久丢线索。
        const registeredTier = known?.registeredTier ?? (known?.tier === 'official' || known?.tier === 'third' ? known.tier : null);
        const drift = isActive && registeredTier !== null && current.tier === 'auto';
        if (isActive && current.signature !== null) {
          const nextRegisteredTier = current.tier === 'official' || current.tier === 'third' ? current.tier : registeredTier;
          const recorded = JSON.stringify({ source: current.source, tier: current.tier, signature: current.signature, registeredTier: nextRegisteredTier });
          if (known === undefined || JSON.stringify({ source: known.source, tier: known.tier, signature: known.signature, registeredTier }) !== recorded) {
            surfaceStore[label] = { source: current.source, tier: current.tier, signature: current.signature, registeredTier: nextRegisteredTier, seenAt: Date.now() };
            surfaceStoreDirty = true;
          }
          // 异常自动记录：掉档记 drift，从未登记的自动档记 unregistered；恢复正常则清掉旧异常。
          if (drift) {
            recordAnomaly(label, 'drift', { expectedTier: registeredTier, observedTier: current.tier, source: current.source, signature: current.signature });
          } else if (current.tier === 'auto') {
            recordAnomaly(label, 'unregistered', { expectedTier: null, observedTier: current.tier, source: current.source, signature: current.signature });
          } else {
            clearAnomaly(label);
          }
        }
        out.push({
          id: `page.panel:${label}`,
          kind: 'plugin-page',
          label,
          source,
          tier,
          drift,
          present: true,
          active: isActive,
          signature: result?.signature ?? null,
          recognized: isActive || known !== undefined,
        });
      }
      flushSurfaceStore();
      flushAnomalies();
      return out;
    }

    /**
     * 会话区拆解：把会话区认成三块，每块都是「真正参与 flex 布局的元素」。
     * 结构（宿主实现）：
     *   ._root_（flex column）
     *   ├─ [data-slot=conversation.header]（display:contents）→ header 本身才是 flex 项
     *   └─ ._body_（flex column）
     *      └─ ._scrollBody_（flex column，滚动容器）
     *         ├─ [data-slot=conversation.session]（display:contents）→ 消息内容
     *         └─ ._composerSeat_（flex 项）
     *            └─ [data-slot=conversation.composer]（display:contents）→ 输入区
     * 会话头与 body 同级可排前后；消息区与输入区同在 scrollBody 下可互换。
     */
    function readConversationParts(centerCol) {
      if (centerCol === null || centerCol === undefined) return null;
      const headerSlot = first(centerCol, '[data-slot="conversation.header"]');
      const sessionSlot = first(centerCol, '[data-slot="conversation.session"]');
      const composerSlot = first(centerCol, '[data-slot="conversation.composer"]');
      if (headerSlot === null || sessionSlot === null || composerSlot === null) return null;
      const root = headerSlot.parentElement;
      const body = sessionSlot.parentElement?.parentElement ?? null;
      const scrollBody = sessionSlot.parentElement;
      // flex 项解析：display:contents 的槽位本身不占位，取它的第一个元素子级
      const resolveItem = (slot) => {
        if (slot === null) return null;
        const style = getComputedStyle(slot);
        return style.display === 'contents' ? slot.firstElementChild : slot;
      };
      const headerItem = resolveItem(headerSlot);
      const messagesItem = sessionSlot;
      const composerItem = composerSlot.parentElement ?? null;
      if (root === null || scrollBody === null) return null;
      return { root, body, scrollBody, headerSlot, sessionSlot, composerSlot, headerItem, messagesItem, composerItem };
    }

    /**
     * 会话区结构「见过没有」的记忆。
     * 编辑区挂在插件详情页上，此时主面板是插件页、会话区不在 DOM 里，
     * 如果每次都按「当前 DOM 有没有」来判断，控制项会在插件页上永远显示不可用。
     * 因此一旦在会话页识别成功过就记下来（跨会话持久化），让控制项始终可用——
     * CSS 规则是常驻的，切回会话页自然生效。
     */
    const CONV_PARTS_KEY = 'dsh-layout/conv-parts/v1';
    let convPartsSeen = (() => {
      try {
        return window.localStorage.getItem(CONV_PARTS_KEY) === '1';
      } catch (error) {
        return false;
      }
    })();

    /** 右栏/设置面板同理会话区：面板不一定常驻 DOM，识别过一次就记住。 */
    const AUX_PARTS_KEY = 'dsh-layout/aux-parts/v1';
    const auxPartsFlags = (() => {
      try {
        const raw = JSON.parse(window.localStorage.getItem(AUX_PARTS_KEY) ?? '{}');
        return raw !== null && typeof raw === 'object' ? raw : {};
      } catch (error) {
        return {};
      }
    })();
    let rightbarPartsSeen = auxPartsFlags.rightbar === true;
    let settingsPartsSeen = auxPartsFlags.settings === true;
    let sidebarPartsSeen = auxPartsFlags.sidebar === true;

    /** 区域是否识别过：拆解卡片与覆盖度都用它判断「待识别」还是「当前为空」。 */
    function areaSeen(area) {
      if (area === 'sidebar') return sidebarPartsSeen;
      if (area === 'rightbar') return rightbarPartsSeen;
      if (area === 'settings') return settingsPartsSeen;
      return convPartsSeen;
    }

    function markAuxPartsSeen(key) {
      if (auxPartsFlags[key] === true) return;
      auxPartsFlags[key] = true;
      try { window.localStorage.setItem(AUX_PARTS_KEY, JSON.stringify(auxPartsFlags)); } catch (error) { console.warn('[dsh-layout] 保存拆解标记失败', error); }
    }

    /**
     * 右栏拆解：标签栏 / 内容区。
     * 结构（宿主实现）：
     *   ._panel_ → ._panelBody_ → ._surface_ → ._tabLayout_（grid）
     *     → ._tabCell_ → section._tabHost_（flex column）
     *        ├─ ._tabHostHeader_（标签栏，内含 [data-slot=sidebar.right.pane.tab.title]）
     *        └─ ._tabHostBody_（内容区，内含 [data-slot=sidebar.right.pane.tab]）
     * 两个分支同父（tabHost），所以既能各自隐藏，也能上下互换。
     * 定位方式：从两个稳定 slot 各自向上找到「共同父的直接子级」，
     * 这样不依赖 CSS module 的哈希类名。
     */
    function readRightbarParts() {
      const titleSlot = document.querySelector('[data-slot="sidebar.right.pane.tab.title"]');
      const tabSlot = document.querySelector('[data-slot="sidebar.right.pane.tab"]');
      if (titleSlot === null || tabSlot === null) return null;
      const ancestorsOf = (el) => {
        const out = [];
        for (let cur = el; cur !== null; cur = cur.parentElement) out.push(cur);
        return out;
      };
      const tabAncestors = new Set(ancestorsOf(tabSlot));
      const common = ancestorsOf(titleSlot).find((el) => tabAncestors.has(el)) ?? null;
      if (common === null || common === document.body) return null;
      const branchOf = (target) => {
        let cur = target;
        while (cur !== null && cur.parentElement !== common) cur = cur.parentElement;
        return cur !== null && cur.parentElement === common ? cur : null;
      };
      const tabs = branchOf(titleSlot);
      const content = branchOf(tabSlot);
      if (tabs === null || content === null || tabs === content) return null;
      return { host: common, tabs, content };
    }

    /**
     * 设置页拆解：导航区（标题 + 导航列）与内容区（页头 + 选项）。
     * 设置面板是 grid，两个区域各由两个子级构成，所以按「语义归属」成对隐藏/换边。
     * 子级识别只用宿主 slot：settings.header / settings.action / settings.close / settings.section。
     */
    function readSettingsParts(panel) {
      if (panel === null || panel === undefined) return null;
      const kids = [...panel.children];
      const bySlot = (slot) => kids.find((node) => first(node, `[data-slot="${slot}"]`) !== null) ?? null;
      const navTitle = bySlot('settings.header');
      const header = bySlot('settings.action') ?? bySlot('settings.close');
      const nav = kids.find((node) => node.tagName === 'NAV') ?? null;
      const options = bySlot('settings.section');
      if (nav === null && options === null) return null;
      return {
        panel,
        navTitle: navTitle ?? nav,
        nav,
        header,
        options,
        // 导航列（左）与内容列（右）各自的成员
        navSide: [navTitle ?? nav, nav].filter(Boolean),
        contentSide: [header, options].filter(Boolean),
      };
    }

    /**
     * 侧栏内部拆解：品牌行拆成「品牌标识」「收起按钮」，底部区拆成「状态按钮行」「账号菜单」。
     * 定位全部落在宿主的稳定标记上，不依赖 CSS 模块的哈希类名：
     * - 品牌标识：含 [data-slot=sidebar.brand.mark] 的那个直接子级
     * - 收起按钮：含 [data-sidebar-toggle] 的那个直接子级
     * - 状态按钮行：含 [data-slot=sidebar.footer.action] 的那个直接子级
     * - 账号菜单：含 [data-slot=sidebar.settings] 的那个直接子级
     * 「直接子级」由锚点向上找到块的子级得到，因此中间多一层包裹也不影响识别。
     */
    function readSidebarParts(blocks) {
      const brand = blocks.brand ?? null;
      const footer = blocks.footer ?? null;
      const identity = branchOf(brand, '[data-slot="sidebar.brand.mark"]');
      const toggle = branchOf(brand, '[data-sidebar-toggle]');
      const status = branchOf(footer, '[data-slot="sidebar.footer.action"]');
      const account = branchOf(footer, '[data-slot="sidebar.settings"]') ?? branchOf(footer, '[data-slot="settings.launcher"]');
      if (identity === null && toggle === null && status === null && account === null) return null;
      return { brand, footer, identity, toggle, status, account };
    }

    /**
     * 会话头拆解：标题行（面包屑 + 会话操作 + 工具 + 角标）与视图标签行。
     * 两行都是 [data-slot="conversation.session.header"]（display:contents）的元素子级，
     * 视图标签行靠通用 ARIA 标记 role=tablist / role=tab 认，其余那一行就是标题行。
     * 标题行内部再拆「会话名（面包屑）」与「操作组」：两者同属标题行里的 titleCluster，
     * 靠 conversation.session.header.lineage / .actions 两个槽位区分。
     */
    function readHeaderParts(convParts) {
      const header = convParts === null || convParts === undefined ? null : convParts.headerItem;
      if (header === null) return null;
      const sessionSlot = header.querySelector('[data-slot="conversation.session.header"]');
      if (sessionSlot === null) return null;
      const rows = [...sessionSlot.children].filter((node) => node.tagName !== 'STYLE' && node.tagName !== 'SCRIPT');
      const viewTabs = rows.find((node) => node.querySelector('[role="tablist"], [role="tab"]') !== null) ?? null;
      const titleRow = rows.find((node) => node !== viewTabs && (node.querySelector('[data-slot="conversation.session.header.actions"]') !== null || node.querySelector('[data-slot="conversation.session.header.utilities"]') !== null))
        ?? rows.find((node) => node !== viewTabs)
        ?? null;
      if (titleRow === null && viewTabs === null) return null;
      // 标题行内部的「会话名 / 操作组」：都在 titleCluster 这个直接子级里
      const cluster = titleRow === null ? null : [...titleRow.children].find((node) => node.querySelector('[data-slot="conversation.session.header.actions"]') !== null) ?? null;
      const crumbs = cluster === null ? null : branchOf(cluster, '[data-slot="conversation.session.header.lineage"]');
      const headerActions = cluster === null ? null : branchOf(cluster, '[data-slot="conversation.session.header.actions"]');
      return { header, titleRow, viewTabs, titleCluster: cluster, crumbs, headerActions };
    }

    /**
     * 输入区拆解：输入框上方的任务面板（待办清单）与输入卡下方的状态条。
     * 任务面板用宿主写死的 data-testid="todo-panel" 认；状态条用 conversation.composer.dock 槽位认。
     * 两者都只在有内容时渲染，没有时返回 null，样式中也就没有可隐藏的对象。
     */
    function readComposerParts(convParts) {
      const composer = convParts === null || convParts === undefined ? null : convParts.composerItem;
      if (composer === null) return null;
      const todo = composer.querySelector('[data-testid="todo-panel"]');
      const dockSlot = composer.querySelector('[data-slot="conversation.composer.dock"]');
      // 槽位本身是 display:contents，真正占位的是它的父级
      const dock = dockSlot === null ? null : (getComputedStyle(dockSlot).display === 'contents' ? dockSlot.parentElement : dockSlot);
      if (todo === null && dock === null) return null;
      return { composer, todo, dock };
    }

    /**
     * 消息区拆解：右侧的轮次导航条。
     * 结构：消息区（会话槽位）→ viewArea → conversation.view 槽位 → frame
     *       frame 的两个直接子级：含 conversation.chat.flow 的是消息流，另一个是轮次导航槽。
     * 校验方式：导航槽必须真的含一个 nav 元素，否则不认（避免把别的覆盖层当导航）。
     */
    function readMessagesParts(convParts) {
      const messages = convParts === null || convParts === undefined ? null : convParts.messagesItem;
      if (messages === null) return null;
      const viewArea = messages.firstElementChild ?? null;
      if (viewArea === null) return null;
      const viewSlot = viewArea.querySelector('[data-slot="conversation.view"]');
      if (viewSlot === null) return null;
      const frame = viewSlot.firstElementChild ?? null;
      if (frame === null) return null;
      const flow = branchOf(frame, '[data-slot="conversation.chat.flow"]');
      const rail = [...frame.children].find((node) => node !== flow && node.querySelector('nav') !== null) ?? null;
      if (rail === null) return null;
      return { messages, viewArea, frame, flow, rail };
    }

    /* ============================== 外部插件页面：自动拆解 ============================== */
    /**
     * 外部插件自动拆解（通用，不针对任何具体插件）。
     * 只依赖浏览器通用事实：几何、computedStyle、ARIA role、重复结构、交互控件数量。
     * 拆解深度固定 2 层：页面区域 → 区域的直接子级；不再往下。
     * 三档来源：插件自声明（data-dshl-unit）→ 人工登记 → 通用启发式。
     */
    const EXTERNAL_SCAN_KEY = 'dsh-layout/plugin-units/v1';
    const EXTERNAL_REGISTRY_KEY = 'dsh-layout/plugin-units-registry/v1';
    const EXTERNAL_MAX_DEPTH = 2;
    const EXTERNAL_MAX_UNITS = 80;
    const SCAN_SCROLL_MS = 1500;
    const XUNIT_TEXT_INPUT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="range"]), textarea, select, [contenteditable="true"]';
    const XUNIT_INTERACTIVE = 'button, a[href], input, textarea, select, [role="button"], [role="tab"], [role="menuitem"], [contenteditable="true"]';
    const XUNIT_ENTRY = '[role="tab"], [role="tablist"], [role="menuitem"], [role="navigation"], nav, a[href]';

    /** 当前激活的侧栏面板名，作为外部插件页面的稳定 pageKey。 */
    function activePageKey() {
      const active = [...document.querySelectorAll('[data-dshl-panel]')].find((node) => node.getAttribute('aria-current') === 'page');
      return active === null || active === undefined ? '(unknown)' : (active.getAttribute('data-dshl-panel') ?? '(unknown)');
    }

    /** 类名前缀：CSS module 哈希形如 `_7D6uKa_board` 时取哈希段，作为弱签名。 */
    function classPrefixOf(node) {
      const token = String(node.className ?? '').split(/\s+/).find((item) => item.length > 0) ?? '';
      const cleaned = token.replace(/^_+/, '');
      const segment = cleaned.split(/[_-]/)[0];
      return /^[A-Za-z0-9][A-Za-z0-9]*$/.test(segment) ? segment.slice(0, 16) : '';
    }

    function textFingerprintOf(node) {
      return (node.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 24);
    }

    /**
     * 找外部插件页面的根节点。
     * 会话页不扫；其余页面从 main 槽位里第一个真实布局盒起，收拢「整页单子级包裹」直到出现分支。
     * 槽位本身常是 display:contents（零尺寸），先按层级展开到第一个有尺寸的盒子，避免把零尺寸包裹当页面根。
     */
    function firstLaidOutBox(scope) {
      const queue = [scope];
      while (queue.length > 0) {
        const node = queue.shift();
        for (const child of node.children) {
          if (child.tagName === 'STYLE' || child.tagName === 'SCRIPT') continue;
          const style = getComputedStyle(child);
          const rect = child.getBoundingClientRect();
          if (style.display === 'contents' || rect.width < 40 || rect.height < 40) {
            queue.push(child);
            continue;
          }
          return child;
        }
      }
      return null;
    }

    function readExternalPage(centerCol) {
      if (centerCol === null || centerCol === undefined) return null;
      if (first(centerCol, '[data-slot="main.conversation"]') !== null) return null;
      // 布局插件自己的插件详情页（编辑区所在页）不是待拆解对象，跳过并保留上一次扫描结果
      if (first(centerCol, '[data-plugin-detail="dsh-layout"]') !== null) return null;
      const scope = first(centerCol, '[data-slot="main"]') ?? centerCol;
      let root = firstLaidOutBox(scope);
      if (root === null) return null;
      // 整页单子级包裹（含滚动根）向下收拢，最多 3 层。
      // 滚动容器里的内容可能比视口短，所以它是滚动容器时不再要求「高度占 90%」。
      for (let guard = 0; guard < 3; guard += 1) {
        const significant = [...root.children].filter((child) => {
          if (child.tagName === 'STYLE' || child.tagName === 'SCRIPT') return false;
          const rect = child.getBoundingClientRect();
          return rect.width >= 40 && rect.height >= 30;
        });
        if (significant.length !== 1) break;
        const only = significant[0];
        const parentRect = root.getBoundingClientRect();
        const childRect = only.getBoundingClientRect();
        const rootStyle = getComputedStyle(root);
        const rootScrolls = rootStyle.overflowY === 'auto' || rootStyle.overflowY === 'scroll';
        if (childRect.width < parentRect.width * 0.9) break;
        if (!rootScrolls && childRect.height < parentRect.height * 0.9) break;
        root = only;
      }
      const pageKey = activePageKey();
      const rootRect = root.getBoundingClientRect();
      // 只有 iframe 占页面主要面积时才当成 iframe 页面；页面里嵌了个小预览框不算
      const iframe = first(root, 'iframe');
      if (iframe !== null) {
        const iframeRect = iframe.getBoundingClientRect();
        const dominant = iframeRect.width * iframeRect.height >= rootRect.width * rootRect.height * 0.5;
        if (dominant) return { pageKey, root, iframe, units: [] };
      }
      if (root.tagName === 'IFRAME') return { pageKey, root, iframe: root, units: [] };
      return { pageKey, root, iframe: null, units: [] };
    }

    /** 页面里所有「真的在滚动」的容器数量：只有一个时它是页面主体，禁止隐藏。 */
    function countScrollContainers(root) {
      let count = 0;
      const walk = (node) => {
        for (const child of node.children) {
          if (child.tagName === 'STYLE' || child.tagName === 'SCRIPT' || child.tagName === 'IFRAME') continue;
          const style = getComputedStyle(child);
          if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && child.scrollHeight > child.clientHeight + 4) count += 1;
          walk(child);
        }
      };
      walk(root);
      return count;
    }

    /** 单元的可拆性判定：四档输出，入口类只给排序/尺寸不给隐藏。 */
    function judgeExternalUnit(node, rootArea, opts) {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      const interactive = node.querySelectorAll(XUNIT_INTERACTIVE).length;
      const inputs = node.querySelectorAll(XUNIT_TEXT_INPUT).length;
      const isScroll = (style.overflowY === 'auto' || style.overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 4;
      const onlyScroll = isScroll && opts.scrollCount <= 1;
      // 入口判定：以导航/切换为主要目的的单元，或「很小、只含少量链接/标签」的单元。
      // 一个带标题和若干按钮的页头不算入口——它不是一个导航单元。
      const entrySelf = node.matches(XUNIT_ENTRY) || node.getAttribute('role') === 'navigation';
      const navControls = node.querySelectorAll('a[href], [role="tab"], [role="menuitem"]').length;
      const textLength = (node.textContent ?? '').trim().length;
      const entrySmall = interactive > 0 && interactive <= 2 && navControls >= 1 && textLength <= 40;
      const entry = entrySelf || entrySmall;
      const ratio = (rect.width * rect.height) / (rootArea || 1);
      const actions = [];
      const blocked = [];
      if (onlyScroll) blocked.push('onlyScroll');
      if (inputs > 0) blocked.push('inputs');
      if (entry) blocked.push('entry');
      if (ratio > 0.85) blocked.push('tooLarge');
      if (!blocked.includes('onlyScroll') && !blocked.includes('inputs') && !blocked.includes('tooLarge') && !blocked.includes('entry')) actions.push('hide');
      if (opts.reorderable) actions.push('reorder');
      if (!blocked.includes('inputs') && !blocked.includes('onlyScroll')) actions.push('resize');
      return {
        interactive,
        inputs,
        isScroll,
        onlyScroll,
        entry,
        ratio: Math.round(ratio * 1000) / 1000,
        actions,
        blocked,
        position: style.position,
      };
    }

    /** 装饰性覆盖层：绝对/固定定位、不可交互、没有文字（氛围层、光效、背景图）。 */
    function isDecorativeNode(node) {
      const style = getComputedStyle(node);
      const fixedish = style.position === 'absolute' || style.position === 'fixed';
      if (!fixedish) return false;
      if (style.pointerEvents === 'none') return true;
      return node.querySelectorAll(XUNIT_INTERACTIVE).length === 0 && (node.textContent ?? '').trim().length === 0;
    }

    /** 区域类型：header / footer / aside / row / scroll / main */
    function classifyRegion(node, rootRect, rect) {
      const widthRatio = rect.width / (rootRect.width || 1);
      const heightRatio = rect.height / (rootRect.height || 1);
      const topGap = rect.top - rootRect.top;
      const bottomGap = rootRect.bottom - rect.bottom;
      const style = getComputedStyle(node);
      const isScroll = (style.overflowY === 'auto' || style.overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 4;
      if (widthRatio >= 0.5 && heightRatio <= 0.25 && topGap <= 24) return 'header';
      if (widthRatio >= 0.5 && heightRatio <= 0.25 && bottomGap <= 24) return 'footer';
      if (widthRatio >= 0.12 && widthRatio <= 0.45 && heightRatio >= 0.55) return 'aside';
      if (widthRatio >= 0.85 && heightRatio <= 0.4) return 'row';
      if (isScroll) return 'scroll';
      return 'main';
    }

    /**
     * 扫描外部插件页面，产出候选单元（只读发现）。
     * L1：页面根的直接子级（区域带，跳过装饰层）；
     * L2：区域里「成组」的直接子级（尺寸一致的重复结构，或 role 明确是 tablist/toolbar/nav/list/grid）；
     * 深度固定 2 层，再往下不扫。
     */
    function scanExternalUnits(root) {
      const rootRect = root.getBoundingClientRect();
      const rootArea = rootRect.width * rootRect.height;
      if (rootRect.width < 200 || rootRect.height < 120) return [];
      const scrollCount = countScrollContainers(root);
      const units = [];
      const seen = new Set();
      const push = (node, depth, parentKey, index, type, extra) => {
        if (units.length >= EXTERNAL_MAX_UNITS || seen.has(node)) return;
        seen.add(node);
        const rect = node.getBoundingClientRect();
        const judge = judgeExternalUnit(node, rootArea, { scrollCount, reorderable: extra.reorderable === true });
        const key = depth === 1 ? `L1.${index}` : `${parentKey}.${index}`;
        units.push({
          key,
          depth,
          parentKey,
          index,
          tag: node.tagName,
          classPrefix: classPrefixOf(node),
          role: node.getAttribute('role') ?? '',
          type,
          label: (node.getAttribute('aria-label') ?? textFingerprintOf(node) ?? '').slice(0, 24),
          text: textFingerprintOf(node),
          rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
          confidence: ['header', 'footer', 'aside', 'scroll'].includes(type) || extra.repeat === true ? 'high' : 'low',
          judge,
          node,
        });
      };
      const l1Nodes = [...root.children].filter((node) => {
        if (node.tagName === 'STYLE' || node.tagName === 'SCRIPT') return false;
        const rect = node.getBoundingClientRect();
        return rect.width >= 24 && rect.height >= 16;
      });
      const kept = l1Nodes.filter((node) => !isDecorativeNode(node));
      const signatures = kept.map((node) => `${node.tagName}|${classPrefixOf(node)}`);
      const repeatedCount = (index) => signatures.filter((sig) => sig === signatures[index]).length;
      kept.forEach((node, index) => {
        const rect = node.getBoundingClientRect();
        const type = classifyRegion(node, rootRect, rect);
        push(node, 1, null, l1Nodes.indexOf(node), type, { reorderable: kept.length >= 2, repeat: repeatedCount(index) >= 2 });
      });
      if (EXTERNAL_MAX_DEPTH < 2) return units;
      kept.forEach((node) => {
        const l1Index = l1Nodes.indexOf(node);
        const parentKey = `L1.${l1Index}`;
        const kids = [...node.children].filter((child) => {
          if (['STYLE', 'SCRIPT', 'IFRAME'].includes(child.tagName)) return false;
          const rect = child.getBoundingClientRect();
          return rect.width >= 24 && rect.height >= 16 && !isDecorativeNode(child);
        });
        if (kids.length < 2) return;
        const role = node.getAttribute('role') ?? '';
        const containerRole = ['tablist', 'toolbar', 'navigation', 'list', 'grid', 'group', 'menu', 'radiogroup'].includes(role)
          || node.querySelector('[role="tablist"], [role="toolbar"], [role="list"], [role="grid"]') !== null;
        const kidSignatures = kids.map((child) => `${child.tagName}|${classPrefixOf(child)}|${Math.round(child.getBoundingClientRect().height / 8)}`);
        const uniform = kidSignatures.every((sig) => sig === kidSignatures[0]);
        const isTabBar = role === 'tablist' || node.querySelector('[role="tablist"]') !== null;
        // 只拆「成组」或「本身是主体/侧栏/滚动区」的容器：
        // 尺寸一致的重复结构、语义明确的标签条/工具栏，以及主体区域里的带状子级；
        // 普通页头/页脚里的零散按钮与标题不拆，避免噪音。
        const parentType = classifyRegion(node, rootRect, node.getBoundingClientRect());
        const regionLike = ['main', 'aside', 'scroll'].includes(parentType);
        if (!uniform && !containerRole && !isTabBar && !regionLike) return;
        kids.forEach((child, childIndex) => {
          const type = isTabBar ? 'tab-item' : uniform ? 'group-item' : 'content-item';
          push(child, 2, parentKey, childIndex, type, { reorderable: true, repeat: uniform });
        });
      });
      return units;
    }

    /** 扫描缓存：同一页面同一根节点 1.5 秒内不重复扫，避免 MutationObserver 高频刷新时反复扫描。 */
    let externalScanCache = { pageKey: '', root: null, at: 0, units: [] };

    /** 外部单元键：`pageKey::unitKey`，同时作为标记值、配置键与清理依据。 */
    function externalUnitKey(pageKey, unitKey) {
      return `${pageKey}::${unitKey}`;
    }

    function persistExternalScan(pageKey, kind, units) {
      const store = readJsonStore(EXTERNAL_SCAN_KEY);
      store[pageKey] = {
        scannedAt: new Date().toISOString(),
        kind,
        // 持久化时去掉 DOM 引用，只保留可序列化字段
        units: units.map(({ node, ...rest }) => rest),
      };
      const keys = Object.keys(store).sort((a, b) => String(store[b].scannedAt).localeCompare(String(store[a].scannedAt)));
      for (const key of keys.slice(12)) delete store[key];
      writeJsonStore(EXTERNAL_SCAN_KEY, store);
    }

    /**
     * 签名失效自动清理：页面扫描成功后，删掉该页配置里已不存在的单元键。
     * 只在该页真的扫出单元时清理，避免页面加载中途的空扫描把配置清空；用 setTimeout 跳出识别循环。
     */
    function requestExternalCleanup(pageKey, units) {
      if (units.length === 0) return;
      const valid = new Set(units.map((unit) => externalUnitKey(pageKey, unit.key)));
      const current = snapshot.config.external;
      const stale = [
        ...current.hide.filter((key) => key.startsWith(`${pageKey}::`) && !valid.has(key)),
        ...Object.keys(current.order).filter((key) => key.startsWith(`${pageKey}::`) && !valid.has(key)),
      ];
      if (stale.length === 0) return;
      window.setTimeout(() => {
        const latest = snapshot.config.external;
        const staleNow = stale.filter((key) => latest.hide.includes(key) || Object.hasOwn(latest.order, key));
        if (staleNow.length === 0) return;
        updateConfig((draft) => {
          draft.external.hide = draft.external.hide.filter((key) => !staleNow.includes(key));
          for (const key of staleNow) delete draft.external.order[key];
        });
      }, 0);
    }

    function scanExternalPageCached(page) {
      const now = Date.now();
      if (externalScanCache.root === page.root && externalScanCache.pageKey === page.pageKey && now - externalScanCache.at < SCAN_SCROLL_MS) {
        return externalScanCache.units;
      }
      const units = page.iframe === null ? scanExternalUnits(page.root) : [];
      externalScanCache = { pageKey: page.pageKey, root: page.root, at: now, units };
      if (page.iframe === null) persistExternalScan(page.pageKey, 'dom', units);
      else persistExternalScan(page.pageKey, 'iframe', []);
      requestExternalCleanup(page.pageKey, units);
      return units;
    }


    /**
     * 把各区域识别结果收束成统一单元表：id → 元素数组（一个单元可能对应多个节点，例如设置页导航列含标题）。
     * 标记、样式、卡片、覆盖度都读这张表，不再各自维护一套形状。
     */
    function collectPartUnits(targets) {
      const units = {};
      const put = (id, node) => {
        if (node === null || node === undefined) return;
        (units[id] ??= []).push(node);
      };
      const sb = targets.sidebarParts;
      if (sb) {
        put('sb-brand', sb.identity);
        put('sb-toggle', sb.toggle);
        put('sb-status', sb.status);
        put('sb-account', sb.account);
      }
      const conv = targets.convParts;
      if (conv) {
        put('conv-header', conv.headerItem);
        put('conv-messages', conv.sessionSlot);
        put('conv-composer', conv.composerItem);
      }
      const hp = targets.headerParts;
      if (hp) {
        put('conv-title-row', hp.titleRow);
        put('conv-view-tabs', hp.viewTabs);
        put('conv-title-crumbs', hp.crumbs);
        put('conv-title-actions', hp.headerActions);
      }
      const cp = targets.composerParts;
      if (cp) {
        put('conv-todo-panel', cp.todo);
        put('conv-dock', cp.dock);
      }
      const mp = targets.messagesParts;
      if (mp) put('conv-turn-rail', mp.rail);
      const rb = targets.rightbarParts;
      if (rb) {
        put('rb-tabs', rb.tabs);
        put('rb-content', rb.content);
      }
      const st = targets.settingsParts;
      if (st) {
        put('set-nav-title', st.navTitle);
        put('set-nav', st.nav);
        put('set-header', st.header);
        put('set-options', st.options);
      }
      return units;
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
      const sidebarParts = readSidebarParts(blocks);
      if (sidebarParts !== null && !sidebarPartsSeen) {
        sidebarPartsSeen = true;
        markAuxPartsSeen('sidebar');
      }
      const panels = [];
      if (blocks.panels) {
        for (const node of [...blocks.panels.children]) {
          const label = panelLabelOf(node);
          if (label === '') continue;
          panels.push({ label, node });
        }
      }
      const conversation = centerCol ? first(centerCol, '[data-conversation-content]') : null;
      const convParts = readConversationParts(centerCol);
      if (convParts !== null && !convPartsSeen) {
        convPartsSeen = true;
        try { window.localStorage.setItem(CONV_PARTS_KEY, '1'); } catch (error) { console.warn('[dsh-layout] 保存会话区结构标记失败', error); }
      }
      const headerParts = readHeaderParts(convParts);
      const composerParts = readComposerParts(convParts);
      const messagesParts = readMessagesParts(convParts);
      const settings = document.querySelector('[data-shortcut-modal="settings"]');
      const rightbarParts = readRightbarParts();
      if (rightbarParts !== null && !rightbarPartsSeen) {
        rightbarPartsSeen = true;
        markAuxPartsSeen('rightbar');
      }
      const settingsParts = readSettingsParts(settings);
      if (settingsParts !== null && !settingsPartsSeen) {
        settingsPartsSeen = true;
        markAuxPartsSeen('settings');
      }
      const ok = Boolean(sidebarCol && centerCol && rightbarCol);
      const externalPage = readExternalPage(centerCol);
      if (externalPage !== null) externalPage.units = scanExternalPageCached(externalPage);
      const targets = { ok, frame, regions, sidebarRoot, blocks, sidebarParts, panels, conversation, convParts, headerParts, composerParts, messagesParts, rightbarParts, settingsParts, settings, external: externalPage, units: {}, surfaces: [], anomalies: [] };
      targets.units = collectPartUnits(targets);
      targets.surfaces = readSurfaces(targets);
      targets.anomalies = Object.values(surfaceAnomalies).sort((a, b) => b.lastSeenAt - a.lastSeenAt);
      return targets;
    }

    const MARKERS = [
      ['data-dshl-frame', (targets) => targets.frame],
      ['data-dshl-sidebar', (targets) => targets.sidebarRoot],
      ['data-dshl-conv', (targets) => targets.conversation],
      ['data-dshl-settings', (targets) => targets.settings],
    ];

    /** 上一轮注解过的外部单元节点：用于离开插件页时撤掉旧标记。 */
    const externalAnnotated = new Set();

    function mark(node, attribute, value = '') {
      if (node !== null && node !== undefined && node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
    }

    function annotate(targets) {
      for (const [attribute, pick] of MARKERS) mark(pick(targets), attribute);
      for (const [region, node] of Object.entries(targets.regions)) mark(node, 'data-dshl-region', region);
      for (const [block, node] of Object.entries(targets.blocks)) mark(node, 'data-dshl-block', block);
      for (const panel of targets.panels) mark(panel.node, 'data-dshl-panel', panel.label);
      // 结构性标记（换序容器等）单独标注；拆解单元统一走 data-dshl-unit
      const parts = targets.convParts;
      if (parts !== null && parts !== undefined) {
        mark(parts.root, 'data-dshl-convroot');
        mark(parts.body, 'data-dshl-convbody');
        mark(parts.scrollBody, 'data-dshl-convscroll');
      }
      const rb = targets.rightbarParts;
      if (rb !== null && rb !== undefined) mark(rb.host, 'data-dshl-rbhost');
      const st = targets.settingsParts;
      if (st !== null && st !== undefined) mark(st.panel, 'data-dshl-setpanel');
      for (const [unitId, nodes] of Object.entries(targets.units ?? {})) {
        for (const node of nodes) mark(node, 'data-dshl-unit', unitId);
      }
      // 外部插件单元：标记全键（pageKey::unitKey），供样式与清理定位；离开该页时撤掉旧标记
      const externalDone = new Set();
      const external = targets.external;
      if (external !== null && external !== undefined && external.units.length > 0) {
        for (const unit of external.units) {
          if (unit.node === undefined || unit.node === null || unit.node.isConnected !== true) continue;
          mark(unit.node, 'data-dshl-xunit', externalUnitKey(external.pageKey, unit.key));
          externalDone.add(unit.node);
        }
      }
      for (const node of externalAnnotated) {
        if (!externalDone.has(node)) node.removeAttribute('data-dshl-xunit');
      }
      externalAnnotated.clear();
      for (const node of externalDone) externalAnnotated.add(node);
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
.dshl-item[data-active="true"] { border-color:var(--dsw-alias-brand-primary); background:color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, var(--dsw-alias-bg-layer-2)); }
.dshl-surfaceGroup { display:flex; flex-direction:column; gap:4px; }
.dshl-surfaceGroupTitle { font-size:11px; line-height:16px; color:var(--dsw-alias-label-secondary); }
.dshl-surfaceDot { width:6px; height:6px; border-radius:50%; flex:none; background:var(--dsw-alias-label-secondary); opacity:.45; }
.dshl-surfaceDot[data-on="true"] { opacity:1; background:var(--dsw-alias-state-success-primary); }
.dshl-surfaceDot[data-on="true"][data-source="official"] { background:var(--dsw-alias-brand-primary); }
.dshl-surfaceDot[data-on="true"][data-source="third"] { background:var(--dsw-alias-state-warn-primary); }
.dshl-itemSub { font-size:11px; color:var(--dsw-alias-label-secondary); flex:none; }
.dshl-itemCtl { display:inline-flex; align-items:center; gap:2px; flex:none; margin-left:2px; }
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
    /**
     * 量出设置面板导航列的实际宽度。
     * 「导航右置」需要把导航列宽度从旧的左列搬到新的右列，用户没手动设过导航宽度时
     * 配置里是 null，只能现场量一次真实值。
     */
    function measuredSettingsNavWidth() {
      const nav = document.querySelector('[data-dshl-unit="set-nav"]');
      const width = nav === null ? 0 : nav.getBoundingClientRect().width;
      return width >= 80 ? Math.round(width) : 188;
    }

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
      // 拆解单元显隐：统一由声明表生成，卡片与样式不再各写一套选择器
      for (const unit of PART_UNITS) {
        if (unit.kind !== 'hide') continue;
        if (readPath(config, unit.path) !== true) continue;
        const selectors = (unit.targets ?? [unit.id]).map((id) => `[data-dshl-unit="${cssAttr(id)}"]`).join(', ');
        lines.push(`${selectors} { display: none !important; }`);
      }
      // 外部插件单元：显隐与排序。键是 pageKey::unitKey，只作用于当前页面已注解的单元
      for (const key of config.external.hide) {
        lines.push(`[data-dshl-xunit="${cssAttr(key)}"] { display: none !important; }`);
      }
      for (const [key, order] of Object.entries(config.external.order)) {
        lines.push(`[data-dshl-xunit="${cssAttr(key)}"] { order: ${Math.round(order)} !important; }`);
      }
      if (config.center.contentWidth !== null) {
        const width = Math.round(config.center.contentWidth);
        lines.push(`[data-dshl-conv] { --dsh-chat-content-width: min(${width}px, 100%) !important; --dsh-composer-card-max-width: min(${width + 32}px, 100%) !important; }`);
      }
      // 会话区换序：会话头与 body 同在 root 下；消息区与输入区同在 scrollBody 下（都是 flex column）
      const parts = config.center.parts;
      if (parts.headerBottom) {
        lines.push('[data-dshl-convroot] { display: flex !important; flex-direction: column !important; }');
        lines.push('[data-dshl-convbody] { order: 1 !important; }');
        lines.push('[data-dshl-unit="conv-header"] { order: 2 !important; }');
      }
      if (parts.composerTop) {
        lines.push('[data-dshl-convscroll] { display: flex !important; flex-direction: column !important; }');
        lines.push('[data-dshl-unit="conv-composer"] { order: -1 !important; }');
        // 输入区默认是「粘在底部」的 sticky；提到上方后必须改成粘顶，否则它会跟着内容滚走、跑到屏幕外
        lines.push('[data-dshl-unit="conv-composer"] { position: sticky !important; top: 0 !important; bottom: auto !important; }');
      }
      // 会话头内部拆解：宿主给会话头写死了两条网格行（32px / 35px）和 min-height。
      // 只给一行 display:none 会留下空轨道、高度不变，所以隐藏任一行时都要把行高交还 auto 并撤掉 min-height。
      if (parts.hideTitleRow && parts.hideViewTabs) {
        lines.push('[data-dshl-unit="conv-header"] { display: none !important; }');
      } else if (parts.hideTitleRow || parts.hideViewTabs) {
        lines.push('[data-dshl-unit="conv-header"] { grid-template-rows: auto !important; min-height: auto !important; }');
      }
      // 视图标签行放到标题行上方：网格按显式行列排，不能靠 order（受 0px 的 leading 列影响会错列）
      if (parts.tabsTop && !parts.hideTitleRow && !parts.hideViewTabs) {
        lines.push('[data-dshl-unit="conv-header"] { grid-template-rows: auto auto !important; min-height: auto !important; }');
        lines.push('[data-dshl-unit="conv-view-tabs"] { grid-column: 2 !important; grid-row: 1 !important; }');
        lines.push('[data-dshl-unit="conv-title-row"] { grid-column: 2 !important; grid-row: 2 !important; }');
      }
      // 右栏拆解：标签栏 / 内容区（同在 tabHost 这个 flex column 里）
      const rbParts = config.rightbar.parts;
      if (rbParts.tabsBottom) {
        lines.push('[data-dshl-rbhost] { display: flex !important; flex-direction: column !important; }');
        lines.push('[data-dshl-unit="rb-content"] { order: 1 !important; }');
        lines.push('[data-dshl-unit="rb-tabs"] { order: 2 !important; }');
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
      // 设置页拆解：导航列 / 内容列，以及内容列里的页头与选项区。
      // 宿主用命名网格区域摆放四个子级（"title header" / "nav options"），隐藏或换边必须成对重写
      // 区域名并给子级重新指派 grid-area，只改列宽会留下空轨道。
      // 折叠成单行时还要把 grid-template-rows 交还 1fr，否则宿主留下的两条轨道会让内容只占上半截。
      const setParts = settings.parts;
      const navShown = !setParts.hideNav;
      const headerShown = !setParts.hideHeader;
      const optionsShown = !setParts.hideOptions;
      const navTrack = settings.navWidth !== null ? `${Math.round(settings.navWidth)}px` : `${measuredSettingsNavWidth()}px`;
      const setGrid = (columns, rows, areas) => {
        const rowRule = rows === null ? '' : ` grid-template-rows: ${rows} !important;`;
        lines.push(`[data-dshl-setpanel] { grid-template-columns: ${columns} !important;${rowRule} grid-template-areas: ${areas} !important; }`);
        for (const [part, area] of Object.entries(assignAll)) lines.push(`[data-dshl-unit="${part}"] { grid-area: ${area} !important; }`);
      };
      const assignAll = { 'set-nav-title': 'dshlTitle', 'set-nav': 'dshlNav', 'set-header': 'dshlHeader', 'set-options': 'dshlOptions' };
      if (!navShown && !headerShown && !optionsShown) {
        // 四块全隐：没有可排的内容，保持宿主网格
      } else if (!navShown) {
        // 只剩内容列
        if (headerShown && optionsShown) setGrid('minmax(0, 1fr)', null, '"dshlHeader" "dshlOptions"');
        else if (optionsShown) setGrid('minmax(0, 1fr)', 'minmax(0, 1fr)', '"dshlOptions"');
        else setGrid('minmax(0, 1fr)', 'minmax(0, 1fr)', '"dshlHeader"');
      } else if (!headerShown && !optionsShown) {
        // 只剩导航列：单列铺满
        setGrid('minmax(0, 1fr)', null, '"dshlTitle" "dshlNav"');
      } else if (!headerShown) {
        // 页头隐藏：选项区跨两行上移，对齐面板顶部
        const columns = setParts.navRight ? `minmax(0, 1fr) ${navTrack}` : `${navTrack} minmax(0, 1fr)`;
        const areas = setParts.navRight ? '"dshlOptions dshlTitle" "dshlOptions dshlNav"' : '"dshlTitle dshlOptions" "dshlNav dshlOptions"';
        setGrid(columns, null, areas);
      } else if (setParts.navRight) {
        setGrid(`minmax(0, 1fr) ${navTrack}`, null, '"dshlHeader dshlTitle" "dshlOptions dshlNav"');
      }
      // 其余情况（全部显示、导航在左）保持宿主默认网格，不重写
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
    const ICON_UP = ['M8 12.5v-9', 'M4.6 7.6 8 4.2l3.4 3.4'];
    const ICON_DOWN = ['M8 3.5v9', 'M4.6 8.4 8 11.8l3.4-3.4'];

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
        }),
        h(PartSection, { sectionId: 'sidebarParts', config, t }));
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

    /**
     * 界面结构卡片：把「用户能看到的界面单元」摊开成一张表。
     * 三档识别在行上可见：官方登记 / 第三方登记 / 自动识别。
     * 未登记的页面标「自动识别」而不是「官方」，避免把第三方误当成官方。
     */
    function SurfacesCard({ targets, t }) {
      const surfaces = targets.surfaces ?? [];
      const regions = surfaces.filter((surface) => surface.kind === 'region');
      const hostPages = surfaces.filter((surface) => surface.kind === 'page' || surface.kind === 'dialog' || surface.kind === 'official-page');
      const pluginPages = surfaces.filter((surface) => surface.kind === 'plugin-page');
      const tierText = (surface) => {
        if (surface.tier === 'official') return t('tierOfficialShort');
        if (surface.tier === 'third') return t('tierThirdShort');
        if (surface.tier === 'pending') return t('surfacePending');
        return t('tierAutoShort');
      };
      const renderRow = (surface, extra) => h('div', { key: surface.id, className: 'dshl-item', 'data-active': surface.active === true ? 'true' : undefined },
        h('span', { className: 'dshl-surfaceDot', 'data-on': surface.present === false ? 'false' : 'true', 'data-source': surface.source, 'aria-hidden': true }),
        h('span', { className: 'dshl-itemLabel', title: surface.labelKey === undefined ? surface.label : undefined }, surface.labelKey === undefined ? surface.label : t(surface.labelKey)),
        extra === undefined ? null : h('span', { className: 'dshl-itemSub' }, extra));
      const officialCount = pluginPages.filter((surface) => surface.tier === 'official').length;
      const thirdCount = pluginPages.filter((surface) => surface.tier === 'third').length;
      const autoCount = pluginPages.filter((surface) => surface.tier === 'auto' || surface.tier === 'pending').length;
      const anomalies = targets.anomalies ?? [];
      const anomalyLabel = (item) => (item.kind === 'drift' ? t('anomalyDrift') : t('anomalyUnregistered'));
      const exportReview = () => {
        const payload = {
          exportedAt: new Date().toISOString(),
          plugin: 'dsh-layout',
          version: 1,
          note: '识别异常待复核清单：drift = 曾由登记表认出、现在签名对不上；unregistered = 从未登记、一直靠自动识别。',
          total: anomalies.length,
          anomalyCount: anomalies.filter((item) => item.kind === 'drift').length,
          unregisteredCount: anomalies.filter((item) => item.kind === 'unregistered').length,
          items: anomalies.map((item) => ({
            label: item.label,
            kind: item.kind,
            expectedTier: item.expectedTier,
            observedTier: item.observedTier,
            source: item.source,
            count: item.count,
            firstSeenAt: new Date(item.firstSeenAt).toISOString(),
            lastSeenAt: new Date(item.lastSeenAt).toISOString(),
            signature: item.signature,
          })),
        };
        try {
          const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = `dsh-layout-review-${new Date().toISOString().slice(0, 10)}.json`;
          anchor.click();
          window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
          console.warn('[dsh-layout] 导出复核清单失败', error);
        }
      };
      const clearReview = () => {
        for (const key of Object.keys(surfaceAnomalies)) delete surfaceAnomalies[key];
        writeJsonStore(SURFACE_ANOMALY_KEY, {});
        refresh();
      };
      return h(Card, { title: t('surfaces'), desc: t('surfacesHint') },
        h('div', { className: 'dshl-surfaceGroup' },
          h('div', { className: 'dshl-surfaceGroupTitle' }, t('surfaceNative')),
          h('div', { className: 'dshl-list' }, regions.map((surface) => renderRow(surface, t('ownerNative'))))),
        h('div', { className: 'dshl-surfaceGroup' },
          h('div', { className: 'dshl-surfaceGroupTitle' }, t('surfacePages')),
          h('div', { className: 'dshl-list' }, hostPages.map((surface) => renderRow(surface, surface.present ? t('surfaceRecognized') : '—')))),
        h('div', { className: 'dshl-surfaceGroup' },
          h('div', { className: 'dshl-surfaceGroupTitle' }, `${t('surfacePlugins')} · ${t('surfacesCount')(pluginPages.length)}`),
          h('div', { className: 'dshl-hint' }, `${t('ownerOfficial')} ${officialCount} · ${t('ownerThird')} ${thirdCount} · ${t('ownerAuto')} ${autoCount}`),
          pluginPages.length === 0
            ? h('div', { className: 'dshl-hint' }, t('surfacesEmpty'))
            : h('div', { className: 'dshl-list dshl-listScroll' }, pluginPages.map((surface) => renderRow(
              surface,
              surface.drift === true ? t('surfaceDrift') : `${tierText(surface)}${surface.recognized ? '' : ` · ${t('surfacePending')}`}`,
            )))),
        h('div', { className: 'dshl-surfaceGroup' },
          h('div', { className: 'dshl-surfaceGroupTitle' }, `${t('reviewTitle')} · ${anomalies.length}`),
          anomalies.length === 0
            ? h('div', { className: 'dshl-hint' }, t('reviewEmpty'))
            : h('div', { className: 'dshl-list dshl-listScroll' }, anomalies.map((item) => h('div', { key: item.label, className: 'dshl-item' },
              h('span', { className: 'dshl-surfaceDot', 'data-on': 'false', 'data-source': item.source, 'aria-hidden': true }),
              h('span', { className: 'dshl-itemLabel', title: `${item.label} · ${item.kind}` }, item.label),
              h('span', { className: 'dshl-itemSub' }, `${anomalyLabel(item)} · ×${item.count}`)))),
          h('div', { className: 'dshl-row' },
            h('button', {
              type: 'button',
              className: 'dshl-btn',
              disabled: anomalies.length === 0,
              onClick: exportReview,
            }, t('reviewExport')),
            h('button', {
              type: 'button',
              className: 'dshl-btn',
              disabled: anomalies.length === 0,
              onClick: clearReview,
            }, t('reviewClear'))),
          h('p', { className: 'dshl-hint' }, t('reviewHint'))));
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

    /**
     * 单个拆解项：hide 类用「显示」开关（checked = 未隐藏），order 类直接表达开关状态。
     * 取值/写值都走声明表里的路径，卡片不再逐项手写字段。
     */
    function PartRow({ spec, config, t }) {
      const stored = readPath(config, spec.path) === true;
      return h('div', { className: 'dshl-row' },
        h('span', { className: 'dshl-rowLabel' }, t(spec.labelKey)),
        h(Switch, {
          checked: spec.kind === 'order' ? stored : !stored,
          label: t(spec.labelKey),
          onChange: (on) => updateConfig((draft) => {
            writePath(draft, spec.path, spec.kind === 'order' ? on : !on);
            if (spec.after !== undefined) spec.after(draft, on);
          }),
        }));
    }

    /** 一组拆解项：分隔线 + 说明 + 该组单元；区域还没识别过时只显示说明（不摆无效开关）。 */
    function PartSection({ sectionId, config, t }) {
      const section = PART_SECTIONS.find((item) => item.id === sectionId);
      const units = PART_UNITS.filter((unit) => unit.section === sectionId);
      const seen = areaSeen(section.area);
      return h(React.Fragment, null,
        h('div', { className: 'dshl-divider' }),
        h('div', { className: 'dshl-cardDesc' }, seen ? t(section.hintKey) : t(section.missingKey)),
        seen ? units.map((unit) => h(PartRow, { key: unit.id, spec: unit, config, t })) : null);
    }

    /**
     * 拆解覆盖卡片：把声明表里的单元逐个列出状态。
     * 三种状态：已识别（此刻 DOM 里有）/ 当前为空（区域识别过，但该单元此刻没渲染，例如没有待办、右栏未展开）/ 待识别（区域还没识别过）。
     */
    function CoverageCard({ config, targets, t }) {
      const units = targets.units ?? {};
      const present = (id) => (units[id]?.length ?? 0) > 0;
      const statusOf = (spec) => {
        if (spec.kind === 'order') {
          const needs = spec.needs ?? [];
          if (needs.length > 0 && needs.every(present)) return 'detected';
        } else if (present(spec.id) || (spec.targets ?? []).some(present)) {
          return 'detected';
        }
        return areaSeen(spec.area) ? 'empty' : 'pending';
      };
      const rows = PART_UNITS.map((spec) => ({ spec, status: statusOf(spec) }));
      const detected = rows.filter((row) => row.status === 'detected').length;
      const empty = rows.filter((row) => row.status === 'empty').length;
      const pending = rows.length - detected - empty;
      const areas = [
        ['sidebar', t('sidebar')],
        ['center', t('center')],
        ['rightbar', t('rightbar')],
        ['settings', t('settingsPanel')],
      ];
      const unitRow = (row) => h('div', { key: row.spec.id, className: 'dshl-item' },
        h('span', { className: 'dshl-surfaceDot', 'data-on': row.status === 'detected' ? 'true' : 'false', 'data-source': 'official', 'aria-hidden': true }),
        h('span', { className: 'dshl-itemLabel' }, t(row.spec.labelKey)),
        h('span', { className: 'dshl-itemSub' }, row.status === 'detected' ? t('coverageDetected') : row.status === 'empty' ? t('coverageEmpty') : t('coveragePending')));
      // 外部插件页面：只读候选清单 + 导出。
      // 编辑区在插件详情页上，此刻不在插件页里，所以拿不到实时扫描；此时回退显示最近一次扫描结果。
      const liveExternal = targets.external ?? null;
      const lastScan = (() => {
        if (liveExternal !== null) return null;
        const store = readJsonStore(EXTERNAL_SCAN_KEY);
        const keys = Object.keys(store);
        if (keys.length === 0) return null;
        keys.sort((a, b) => String(store[b].scannedAt).localeCompare(String(store[a].scannedAt)));
        // 优先展示「最近扫描过的其他插件页」：编辑区常驻在「插件」页，展示插件列表自身结构意义不大
        const currentKey = activePageKey();
        const pick = keys.find((key) => key !== currentKey && store[key].kind === 'dom' && (store[key].units ?? []).length > 0) ?? keys[0];
        return { pageKey: pick, kind: store[pick].kind, units: store[pick].units ?? [], scannedAt: store[pick].scannedAt };
      })();
      const external = liveExternal ?? lastScan;
      const externalHistorical = liveExternal === null && lastScan !== null;
      const externalIframe = external !== null && ((external.iframe ?? null) !== null || external.kind === 'iframe');
      const externalUnits = external?.units ?? [];
      const typeLabel = (type) => t({
        header: 'externalTypeHeader',
        footer: 'externalTypeFooter',
        aside: 'externalTypeAside',
        scroll: 'externalTypeScroll',
        row: 'externalTypeRow',
        main: 'externalTypeMain',
        'tab-item': 'externalTypeTabItem',
        'group-item': 'externalTypeGroupItem',
        'content-item': 'externalTypeContentItem',
      }[type] ?? 'externalTypeContentItem');
      const blockedLabel = (flags) => flags.map((flag) => t({
        onlyScroll: 'externalBlockedOnlyScroll',
        inputs: 'externalBlockedInputs',
        entry: 'externalBlockedEntry',
        tooLarge: 'externalBlockedTooLarge',
      }[flag] ?? flag)).join(' / ');
      const externalActionText = (unit) => {
        const parts = [];
        if (unit.judge.actions.includes('hide')) parts.push(t('externalActionHide'));
        if (unit.judge.actions.includes('reorder')) parts.push(t('externalActionReorder'));
        return parts.length === 0 ? t('externalReadonly') : parts.join(' · ');
      };
      const hideExternal = (key, hide) => updateConfig((draft) => {
        const set = new Set(draft.external.hide);
        if (hide) set.add(key);
        else set.delete(key);
        draft.external.hide = [...set];
      });
      const shiftExternal = (key, delta) => updateConfig((draft) => {
        const current = Object.hasOwn(draft.external.order, key) ? draft.external.order[key] : 0;
        const next = Math.min(50, Math.max(-50, current + delta));
        if (next === 0) delete draft.external.order[key];
        else draft.external.order[key] = next;
      });
      const exportExternal = () => {
        const payload = {
          exportedAt: new Date().toISOString(),
          plugin: 'dsh-layout',
          version: 1,
          note: '外部插件自动拆解候选清单：只读阶段的扫描结果，可用于人工登记与模板化。actions 为允许的操作，blocked 为受限原因。',
          pages: external === null || externalUnits.length === 0
            ? []
            : [{ pageKey: external.pageKey, kind: externalIframe ? 'iframe' : 'dom', units: externalUnits }],
        };
        try {
          const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = `dsh-layout-external-units-${new Date().toISOString().slice(0, 10)}.json`;
          anchor.click();
          window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
          console.warn('[dsh-layout] 导出外部插件候选清单失败', error);
        }
      };
      const externalRows = external === null
        ? [h('div', { key: 'none', className: 'dshl-hint' }, t('externalEmpty'))]
        : externalIframe
          ? [h('div', { key: 'iframe', className: 'dshl-hint' }, t('externalIframe'))]
          : externalUnits.length === 0
            ? [h('div', { key: 'empty', className: 'dshl-hint' }, t('externalEmpty'))]
            : externalUnits.map((unit) => {
              const key = externalUnitKey(external.pageKey, unit.key);
              const hidden = config.external.hide.includes(key);
              const orderValue = config.external.order[key];
              const canHide = unit.judge.actions.includes('hide');
              const canOrder = unit.judge.actions.includes('reorder');
              return h('div', { key: unit.key, className: 'dshl-item' },
                h('span', { className: 'dshl-surfaceDot', 'data-on': canHide ? 'true' : 'false', 'data-source': 'third', 'aria-hidden': true }),
                h('span', { className: 'dshl-itemLabel', title: `${key} · ${unit.classPrefix}` }, `${typeLabel(unit.type)} · ${unit.label || unit.classPrefix || unit.tag}`),
                h('span', { className: 'dshl-itemSub' }, blockedLabel(unit.judge.blocked).length > 0 ? blockedLabel(unit.judge.blocked) : externalActionText(unit)),
                h('span', { className: 'dshl-itemCtl' },
                  canOrder ? h('button', {
                    type: 'button',
                    className: 'dshl-iconBtn',
                    title: t('externalOrderUp'),
                    'aria-label': t('externalOrderUp'),
                    onClick: () => shiftExternal(key, -1),
                  }, icon(ICON_UP, 12)) : null,
                  canOrder ? h('button', {
                    type: 'button',
                    className: 'dshl-iconBtn',
                    title: t('externalOrderDown'),
                    'aria-label': t('externalOrderDown'),
                    onClick: () => shiftExternal(key, 1),
                  }, icon(ICON_DOWN, 12)) : null,
                  orderValue === undefined ? null : h('span', { className: 'dshl-num' }, String(orderValue)),
                  canHide ? h(Switch, {
                    checked: !hidden,
                    label: `${t('hide')} ${unit.label || unit.key}`,
                    onChange: (on) => hideExternal(key, !on),
                  }) : null));
            });
      return h(Card, { title: t('coverage'), desc: t('coverageHint') },
        h('div', { className: 'dshl-hint' }, t('coverageSummary')(detected, empty, pending)),
        ...areas.map(([area, label]) => h('div', { key: area, className: 'dshl-surfaceGroup' },
          h('div', { className: 'dshl-surfaceGroupTitle' }, label),
          h('div', { className: 'dshl-list' }, rows.filter((row) => row.spec.area === area).map(unitRow)))),
        h('div', { className: 'dshl-surfaceGroup' },
          h('div', { className: 'dshl-surfaceGroupTitle' }, `${t('externalTitle')}${external === null ? '' : ` · ${external.pageKey}`}`),
          h('div', { className: 'dshl-hint' }, t('externalHint')),
          externalHistorical ? h('div', { className: 'dshl-hint' }, `${t('externalHistorical')}${external.scannedAt === undefined ? '' : ` · ${String(external.scannedAt).replace('T', ' ').slice(0, 19)}`}`) : null,
          external !== null && !externalIframe && externalUnits.length > 0
            ? h('div', { className: 'dshl-hint' }, t('externalCount')(
              externalUnits.length,
              externalUnits.filter((unit) => unit.judge.actions.includes('hide')).length,
              externalUnits.filter((unit) => unit.judge.actions.includes('reorder')).length,
            ))
            : null,
          h('div', { className: 'dshl-list dshl-listScroll' }, externalRows),
          h('div', { className: 'dshl-row' },
            h('button', { type: 'button', className: 'dshl-btn', disabled: external === null || externalUnits.length === 0, onClick: exportExternal }, t('externalExport')))));
    }

    /**
     * 会话区卡片：内容宽度 + 四组拆解（基础三块与换序、会话头内部、消息区、输入区）。
     * 拆解项的开关由 PART_UNITS 声明表生成，卡片只负责摆位置。
     */
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
        }),
        h(PartSection, { sectionId: 'convBase', config, t }),
        h(PartSection, { sectionId: 'convHeader', config, t }),
        h(PartSection, { sectionId: 'messagesParts', config, t }),
        h(PartSection, { sectionId: 'composerParts', config, t }));
    }

    /** 右栏卡片：标签栏/内容区拆解（宽度在「区域结构」里调）。 */
    function RightbarCard({ config, t }) {
      return h(Card, { title: t('rightbarPanel'), desc: t('rightbarPanelHint') },
        h(PartSection, { sectionId: 'rightbarParts', config, t }));
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
        h('p', { className: 'dshl-hint' }, t('offsetClamped')),
        h(PartSection, { sectionId: 'settingsParts', config, t }));
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
          h(SurfacesCard, { targets, t }),
          h(CoverageCard, { config, targets, t }),
          h(ConversationCard, { config, t }),
          h(RightbarCard, { config, t }),
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
