window.__ModuleLoader__.load({
  id: 'dsh-layout',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    // 面板要浮在设置弹层（body 下的 fixed 层）之上，只能渲染到 body；宿主没给 react-dom 时退回原位渲染。
    let createPortal = null;
    try {
      const reactDom = require('react-dom');
      createPortal = typeof reactDom.createPortal === 'function' ? reactDom.createPortal : null;
    } catch (error) {
      console.warn('[dsh-layout] 宿主未提供 react-dom，编辑面板只能渲染在浮层原位', error);
    }
    const NS = 'dsh-layout';

    // 「更多」菜单行优先用宿主的 primitives，拿不到就退化成普通按钮（功能不变，观感略有差异）
    let MenuItemButton = null;
    let MenuPrimitive = null;
    try {
      const primitives = require('@deepseek-ai/dsh-client-ui-primitives');
      if (primitives !== null && typeof primitives === 'object') {
        if (typeof primitives.MenuItemButton === 'function') MenuItemButton = primitives.MenuItemButton;
        if (typeof primitives.Menu === 'function') MenuPrimitive = primitives.Menu;
      }
    } catch (error) {
      console.warn('[dsh-layout] 宿主未提供菜单 primitives，收纳入口的菜单项降级为普通按钮', error);
    }

    /* ============================== 文案 ============================== */
    const zh = {
      title: '布局',
      desc: '调整 DSH 界面的结构与几何：三栏顺序、侧栏收纳、面板排序、会话区与设置页尺寸。',
      detected: '已识别界面结构',
      notDetected: '未识别界面结构',
      enable: '启用自定义布局',
      enableHint: '关闭后立即恢复 DSH 默认布局，配置保留。',
      footHint: '改动先预览，按保存才写入。',
      saveConfig: '保存',
      revertConfig: '还原',
      unsavedHint: '有未保存改动',
      desktopProbe: '桌面端诊断',
      desktopProbeHint: 'Electron 里 fixed 层可能被原生窗口栏或合成层影响，Web 端看不出来。点一下把环境与几何数据打到控制台。',
      desktopProbeRun: '运行诊断',
      desktopProbeConsole: 'F12 控制台看结果',
      editing: '编辑模式',
      editingHint: '在界面上直接拖动分隔条，浮动工具条里可换预设。',
      presets: '预设',
      presetStandard: '标准',
      presetCompact: '紧缩侧栏',
      presetFocus: '专注',
      presetRightSide: '右栏左置',
      presetWide: '宽屏',
      reset: '恢复默认',
      schemes: '布局方案',
      schemesHint: '把整套配置存成命名方案，随时切换。切换是整套替换：三栏、侧栏、拆解、槽位、收纳、联动规则全部跟着换。',
      schemesEmpty: '还没有保存的方案。调好布局后点「存为新方案」。',
      schemesSaveNew: '存为新方案',
      schemesNamePrefix: '方案',
      schemesApply: '应用',
      schemesUpdate: '用当前配置覆盖这套方案',
      schemesRename: '重命名',
      schemesDelete: '删除方案',
      schemesActive: '当前方案',
      schemesFull: '方案已满（上限 20 套），请先删掉不用的。',
      schemesApplied: '已应用方案',
      schemesSaved: '已保存',
      schemesDeleted: '已删除',
      schemesCount: (used) => `已存 ${used} / 20`,
      structure: '区域结构',
      structureHint: '拖动排序三栏、调整宽度、控制显隐。',
      tabStructure: '布局结构',
      tabSidebar: '侧栏',
      tabAreas: '区域拆解',
      tabRecognition: '识别诊断',
      tabPlugins: '插件与槽位',
      tabStructureHint: '三栏顺序、宽度、显隐，以及底部条与拖动分隔条。',
      tabSidebarHint: '侧栏内部区块、面板导航的排序与显隐。',
      tabAreasHint: '会话区 / 右栏 / 设置页内部的拆解与尺寸。',
      tabRecognitionHint: '宿主原生界面到手了什么，以及我配的拆解项在这台机器上有没有生效。',
      tabPluginsHint: '第三方插件贡献了哪些页面、可拆解单元与槽位条目，以及能对它们做什么。',
      coverageExpand: '展开逐项状态',
      coverageCollapse: '收起逐项状态',
      pluginPages: '插件页面',
      pluginPagesHint: '运行时识别到的插件界面页：官方登记 / 第三方登记 / 自动识别三档。',
      externalPageNone: '当前不在插件页，也还没有扫描记录。',
      externalCurrentPage: '扫描的页面：',
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
      coverageHint: '「此刻在场」是这一秒 DOM 里真实命中的单元；「上次观测」来自上次打开该区域页面时的结构快照，带时间；「从未识别」表示还没打开过那个页面。',
      coverageSummary: (detected, observed, never) => `此刻在场 ${detected} · 上次观测 ${observed} · 从未识别 ${never}`,
      coverageDetected: '此刻在场',
      coverageObserved: '上次观测',
      coverageAbsent: '上次未出现',
      coverageLegacy: '无快照',
      coverageNever: '从未识别',
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
      extTierDeclared: '声明',
      extTierRegistered: '登记',
      externalKind: '页面类型',
      extKindBoard: '看板',
      extKindDashboard: '仪表盘',
      extKindTabbed: '标签页',
      extKindScrollPage: '滚动页',
      extKindList: '列表页',
      extKindGeneric: '通用页面',
      externalGroups: '语义组',
      extGroupDeclared: '声明单元',
      extGroupHeader: '页头',
      extGroupOverview: '概览行',
      extGroupTabs: '标签组',
      extGroupColumns: '分栏组',
      extGroupMain: '主体',
      extGroupAside: '侧栏',
      extGroupFooter: '页底',
      externalGroupHint: '按结构归出的语义组，可整组隐藏；组内只读单元不受影响。',
      externalHideGroup: '隐藏整组',
      externalRegister: '登记此页结构',
      externalClearRegistry: '清除登记',
      externalRegistered: '已登记',
      externalDeclareHint: '插件自声明：在节点上写 data-dshl-declare="header"（可选 data-dshl-declare-label、data-dshl-declare-guard），拆解层会优先采用。',
      pluginSources: '插件来源',
      pluginSourcesHint: '宿主 slots 注册表的权威清单：哪个插件在哪个槽位注册了什么，以及此刻是否渲染。列表类槽位可精确隐藏/排序；入口类只排序，页面主体与单槽只读。',
      pluginSourcesUnavailable: '宿主未提供 slots 注册表接口，暂时列不出组件来源；页面内部的几何拆解仍然可用。',
      pluginSourcesCount: (slots, items, rendered) => `槽位 ${slots} · 条目 ${items} · 已渲染 ${rendered}`,
      slotShowAll: '显示全部槽位',
      slotNothingRendered: '当前页面还没有已渲染的插件条目。',
      slotSearch: '搜索槽位、条目、注册者',
      slotSearchEmpty: '没有匹配的槽位或条目。',
      slotSearchClear: '清空搜索',
      slotDragHint: '拖动行可调整同槽位内的顺序；箭头按钮每次移动一格。',
      slotNotRendered: '未渲染',
      slotEntryOnly: '入口 · 只排序',
      slotPageOnly: '页面主体 · 只读',
      slotSingleOnly: '单槽 · 只读',
      slotOverlayOnly: '弹层 · 只读',
      slotKindList: '列表',
      slotKindKeyed: '按 key',
      slotKindSingle: '单槽',
      slotKindChain: '链式',
      tabArrange: '槽位编排',
      tabArrangeHint: '把同一容器里的条目排成多列、调间距或收成图标；容器来自侧栏块与已渲染的列表槽位。',
      arrange: '容器排列',
      arrangeHint: '只改容器内条目的排布，不碰条目本身与顺序；关掉立即恢复宿主布局。',
      arrangeEmpty: '当前没有可排列的容器：需要侧栏在界面上，或列表槽位有两个以上已渲染条目。',
      arrangeColumns: '列数',
      arrangeDefault: '默认',
      arrangeGap: '间距',
      arrangeCompact: '只留图标',
      arrangeCompactHint: '隐藏每行第二个子元素（图标行里的文字），列窄时更整齐。',
      arrangeOffline: '此刻不在场',
      arrangeSlotPrefix: '槽位',
      arrangePanels: '侧栏 · 面板导航',
      arrangeFooter: '侧栏 · 底部操作',
      arrangeRightTabs: '右栏 · 标签栏',
      arrangeSettingsNav: '设置页 · 导航列',
      relocate: '区域搬移',
      relocateHint: '把单元搬到界面上任意位置：点「开始画框」，在界面上拖出一个框，框的位置就是落位、框的宽度就是宽度；源单元高度按内容自然展开。',
      relocateFrameHint: '框只决定位置与宽度。框比源单元窄时自动放大到源宽度；压住别的容器时自动往旁边的空白处让一让。',
      relocateSource: '源单元',
      relocateNone: '还没有搬移：选一个源单元，再点「开始画框」。',
      relocateEmptySources: '当前没有可搬移的单元。',
      relocateRemove: '移除',
      relocateRedraw: '重画',
      relocateAdjust: '调整',
      relocatePending: '此刻不在场，暂不生效',
      relocateActive: '已生效',
      relocateGone: '源单元不在场',
      relocateMoved: '已避开重叠',
      relocateFrameAt: (x, y) => `框在 (${x}, ${y})`,
      relocateFrameSize: (w, h) => ` · ${w}×${h}`,
      relocateConflict: '位置冲突',
      relocateConflictShort: '四周都被占满，暂时留在原位',
      relocateConflictHint: '框四周找不到不相交的位置（相邻容器把可用空间占满了）。把框画到更空的地方，或直接删掉这条搬移。',
      relocateLegacy: '需重画',
      relocateLegacyHint: (count) => `${count} 条旧的搬移（按目标容器与开头/结尾配置）没有位置信息，换算不出框。逐条点「重画」，或一次性清空。`,
      relocateLegacyClear: '清空需重画的',
      relocateSourceBlock: '侧栏块',
      relocateSourceUnit: '拆解单元',
      relocateSourceSlot: '槽位条目',
      frameStart: '开始画框',
      frameCancel: '取消',
      frameApply: '应用',
      frameTitle: (label) => `正在为「${label}」画框：按下并拖出一个矩形`,
      frameUsage: '松手即应用；Esc 或右键取消。框的左上角就是落位，框宽就是宽度。',
      frameUsageExisting: '已有框：框内拖可整体移动，拖右边缘可改宽度，方向键微调（Shift 加大步长），Enter 应用，Esc 取消。',
      frameTooSmall: '框太小了，再拉大一点。',
      frameClean: '空白处',
      frameNoHost: '不在任何区域内，按视口定位',
      frameHost: (name) => `落在「${name}」`,
      frameMigrate: '会压住容器里已有的内容，松手后自动避让',
      frameConflict: '会压住容器里已有的内容且四周没空位，松手后留在原位',
      frameHint: (width, sourceWidth) => `${width}px${width > sourceWidth ? `（已放大到源宽度 ${sourceWidth}px）` : ''}`,
      sync: '联动同步',
      syncHint: '面板导航与插件来源描述的是同一排图标：开启后在一处排序或隐藏，另一处跟着写，不再互相覆盖。',
      syncPanellistOrder: '排序同步',
      syncPanellistOrderHint: '在面板导航里拖动排序后，插件来源里对应条目的顺序一并更新；反之亦然。',
      syncPanellistHidden: '隐藏同步',
      syncPanellistHiddenHint: '隐藏一个面板图标时，插件来源里对应条目也标记为隐藏；反之亦然。',
      syncUnavailable: '宿主 slots 注册表不可用，联动同步暂不可用。',
      rules: '联动规则',
      rulesHint: '条件成立时叠加动作：条件只读当前界面状态（页面 / 折叠 / 区域在场 / 单元在场），动作只动显隐或容器排列；基础配置不受影响。',
      ruleWhen: '条件',
      ruleThen: '动作',
      ruleAdd: '添加规则',
      ruleNone: '还没有规则：选好条件与动作后点「添加规则」。',
      ruleHit: '命中',
      ruleMiss: '未命中',
      ruleRemove: '移除规则',
      ruleCondPage: '当前页面',
      ruleCondCollapsed: '侧栏折叠',
      ruleCondArea: '区域在场',
      ruleCondPresent: '单元在场',
      rulePageAny: '任意页面',
      rulePageConversation: '会话页',
      rulePagePlugins: '插件页',
      rulePagePluginDetail: '插件详情页',
      rulePageSettings: '设置页',
      rulePageExternal: '外部插件页',
      ruleCollapsedYes: '已折叠',
      ruleCollapsedNo: '未折叠',
      ruleAreaSidebar: '侧栏',
      ruleAreaCenter: '会话区',
      ruleAreaRightbar: '右栏',
      ruleAreaSettings: '设置页',
      ruleActionHide: '隐藏单元',
      ruleActionArrange: '容器排列',
      ruleActionScheme: '切换布局方案',
      ruleSchemeEmpty: '还没有保存的方案',
      ruleColumns: '列数',
      ruleEmptyValue: '当前没有可选项。',
      tabStorage: '入口收纳',
      tabStorageHint: '把不常用的侧栏入口收进「更多」菜单：侧栏只留常用的，收纳的入口在更多里点一下就能打开，再关开关就回到侧栏。',
      storage: '入口收纳',
      storageHint: '开关打开 = 收进该区域的「更多」菜单；关闭 = 回到原列表。只改显示位置，入口本身与插件都不变。',
      storageEmpty: '没有可收纳的入口：需要对应区域在界面上，且宿主 slots 注册表可用。',
      storageHostEntry: '宿主入口，始终显示',
      storageHiddenHint: '已在面板导航里隐藏',
      storageMenuLabel: '收纳的入口',
      storageMenuEmpty: '还没有收纳任何入口',
      storageZoneSidebar: '侧栏入口',
      storageZoneViews: '会话视图标签',
      storageZoneGuide: '右栏开始页卡片',
      storageZoneSettings: '设置页导航',
      storageZonePlugins: '插件页第三方插件',
      storageZoneHeaderUtilities: '会话头工具按钮',
      storageZoneSettingsActions: '设置页页头操作',
      storageZoneOffline: '此刻不在场',
      storageZoneEmpty: '这个区域当前没有可收纳的入口。',
      storageSettingsUnavailable: '设置面板没打开，或没有可收纳的导航项。',
      storagePluginsUnavailable: '插件页不在场，或没有可收纳的第三方插件。',
      storageGrantMore: '更多',
      storageGrantSettingsLabel: '收纳的设置页',
      storageGrantPluginsLabel: '收纳的插件',
      storageHeaderUtilitiesUnavailable: '会话头不在场，或工具行没有可收纳的按钮。',
      storageSettingsActionsUnavailable: '设置页页头不在场，或没有可收纳的按钮。',
      storageViewsUnavailable: '宿主槽位注册表不可用，列不出会话视图。',
      storageGuideUnavailable: '右栏开始页不在场，或没有可收纳的卡片。',
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
      panelShortcut: '布局：打开编辑面板',
      openPlugins: '插件页',
      riskyHint: '注意：侧栏或面板入口已被隐藏，界面上会留一个「布局」恢复按钮（位置随留白走）。快捷键也能打开编辑面板。',
      shortcutHint: '快捷键：Ctrl/⌘+Alt+L 打开编辑面板；再加 Shift 直接恢复默认布局。',
      panelTitle: '布局编辑面板',
      panelOpen: '打开编辑面板',
      panelClose: '关闭编辑面板',
      panelSideLeft: '贴左侧',
      panelSideRight: '贴右侧',
      panelCurrentPage: (page) => `当前页面：${page}`,
      panelEntryHint: '编辑面板是全局浮层：在哪个页面打开就停在哪个页面上，识别、预览、调整都对着当前界面。',
      panelOpened: '编辑面板已打开；按 Esc 或右上角关闭。',
      observedAt: (time) => `上次观测 ${time}`,
      observedArea: (time, area) => `上次观测 ${time} · ${area}`,
      observedUnknown: '曾识别过，但没有结构快照（升级前记录）。',
      notOnPage: '此刻不在这个页面上，开关可调但看不到效果。',
      surfaceOffline: '此刻不在场',
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
      // 布局白板（client.board.js 的文案也从这里取，白板不另建字典）
      board: '白板',
      boardTitle: '布局白板',
      boardOpen: '打开白板',
      boardHint: '左侧四栏列出全部结构；点画布上的框或栏里的行选中，右侧调它的可调项。改动即时生效。',
      boardPage: '当前页面',
      boardModeTrace: '描图',
      boardModeSkeleton: '骨架',
      boardCapture: '重新抓取',
      boardAdvanced: '高级面板',
      boardFilter: '搜索结构',
      boardEmptyGroup: '这一层没有节点',
      boardNoSelection: '在左侧四栏或画布上选一个节点，这里显示它的可调项。',
      boardSkeletonEmpty: '这个页面还没有结构快照。切到该页面看一次，或点「重新抓取」。',
      boardLayerRegion: '区域',
      boardLayerContainer: '容器',
      boardLayerSlot: '槽位',
      boardLayerControl: '控件',
      boardPresent: '此刻在场',
      boardAbsent: '此刻不在场',
      boardMoveLeft: '往前移一位',
      boardMoveRight: '往后移一位',
      boardMoveUp: '上移',
      boardMoveDown: '下移',
      boardCenterMinWidth: '会话区最小宽度',
      boardContentWidth: '会话内容最大宽度',
      boardNavWidth: '设置页导航宽度',
      boardColumns: '列数',
      boardGap: '间距',
      boardOrder: '顺序',
      boardRelocateTo: '画框搬移',
      boardRelocateRedraw: '重画框',
      boardRelocateClear: '清除搬移',
      boardStoreTo: '收进「更多」',
      boardReadonly: '这一项只读（入口类槽位只允许排序，隐藏会切断回页面的路径）。',
      boardReadonlyOverlay: '浮层 / 菜单类条目只读。',
      boardGeometryDrift: '结构快照可能已过期，建议重新抓取。',
      boardDriftTitle: '骨架可能已过期',
      boardDriftDetail: (added, removed) => `与上次抓取相比：新增 ${added} 个节点、少了 ${removed} 个。骨架按旧结构画，位置可能对不上。`,
      boardDriftRecapture: '重新抓取这一页',
      boardLoading: '正在加载白板…',
      boardLoadFail: '白板模块加载失败，已回落到编辑面板。',
      boardShowMore: '显示更多',
      boardLayers: '结构',
      boardProps: '属性',
      boardDrillIn: '区域内可选的控件',
      boardBucketUnit: '拆解单元',
      boardBucketEntry: '槽位条目',
      boardBucketXunit: '第三方单元',
      boardBucketStore: '可收纳入口',
      boardBucketOther: '其它',
    };
    const en = {
      title: 'Layout',
      desc: 'Adjust the structure and geometry of the DSH interface: column order, sidebar absorption, panel ordering, conversation and settings sizing.',
      detected: 'Interface detected',
      notDetected: 'Interface not detected',
      enable: 'Enable custom layout',
      enableHint: 'Turning this off restores the DSH default layout; your settings are kept.',
      footHint: 'Changes preview live; press Save to persist.',
      saveConfig: 'Save',
      revertConfig: 'Revert',
      unsavedHint: 'unsaved changes',
      desktopProbe: 'Desktop diagnosis',
      desktopProbeHint: 'In Electron, fixed layers can be affected by the native title bar or compositing surfaces — invisible on the web. Click to dump environment and geometry to the console.',
      desktopProbeRun: 'Run diagnosis',
      desktopProbeConsole: 'see console (F12)',
      editing: 'Edit mode',
      editingHint: 'Drag the dividers on the interface; switch presets from the floating toolbar.',
      presets: 'Presets',
      presetStandard: 'Standard',
      presetCompact: 'Compact rail',
      presetFocus: 'Focus',
      presetRightSide: 'Right column left',
      presetWide: 'Wide',
      reset: 'Reset',
      schemes: 'Layout schemes',
      schemesHint: 'Store the whole config as a named scheme and switch at will. Switching replaces everything: columns, sidebar, decomposition, slots, storage and linkage rules.',
      schemesEmpty: 'No saved scheme yet. Tune the layout, then use "Save as new scheme".',
      schemesSaveNew: 'Save as new scheme',
      schemesNamePrefix: 'Scheme',
      schemesApply: 'Apply',
      schemesUpdate: 'Overwrite this scheme with the current config',
      schemesRename: 'Rename',
      schemesDelete: 'Delete scheme',
      schemesActive: 'Current scheme',
      schemesFull: 'Scheme limit reached (20); delete one first.',
      schemesApplied: 'Applied scheme',
      schemesSaved: 'Saved',
      schemesDeleted: 'Deleted',
      schemesCount: (used) => `${used} / 20 saved`,
      structure: 'Region structure',
      structureHint: 'Reorder the three columns, resize them, or hide them.',
      tabStructure: 'Layout',
      tabSidebar: 'Sidebar',
      tabAreas: 'Area parts',
      tabRecognition: 'Diagnosis',
      tabPlugins: 'Plugins & slots',
      tabStructureHint: 'Column order, width, visibility, the bottom bar and the resize handles.',
      tabSidebarHint: 'Order and visibility of sidebar blocks and panel navigation.',
      tabAreasHint: 'Parts and sizes inside the conversation, right column and settings panel.',
      tabRecognitionHint: 'What the host native interface exposes, and whether the parts you configured actually took effect on this machine.',
      tabPluginsHint: 'Plugin pages, external units and slot entries contributed by third-party plugins, and what you can do with them.',
      coverageExpand: 'Show per-item status',
      coverageCollapse: 'Hide per-item status',
      pluginPages: 'Plugin pages',
      pluginPagesHint: 'Plugin interface pages recognized at runtime: officially registered, third-party registered, or auto-detected.',
      externalPageNone: 'Not on a plugin page, and no scan has been recorded yet.',
      externalCurrentPage: 'Scanned page: ',
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
      coverageHint: '"Live now" means the unit is in the DOM this second; "Last seen" comes from the structure snapshot taken the last time that page was open, with a timestamp; "Never seen" means that page has not been opened yet.',
      coverageSummary: (detected, observed, never) => `Live ${detected} · last seen ${observed} · never ${never}`,
      coverageDetected: 'Live now',
      coverageObserved: 'Last seen',
      coverageAbsent: 'Not in last scan',
      coverageLegacy: 'No snapshot',
      coverageNever: 'Never seen',
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
      extTierDeclared: 'Declared',
      extTierRegistered: 'Registered',
      externalKind: 'Page type',
      extKindBoard: 'Board',
      extKindDashboard: 'Dashboard',
      extKindTabbed: 'Tabbed',
      extKindScrollPage: 'Scroll page',
      extKindList: 'List',
      extKindGeneric: 'Generic',
      externalGroups: 'Semantic groups',
      extGroupDeclared: 'Declared units',
      extGroupHeader: 'Header',
      extGroupOverview: 'Overview rows',
      extGroupTabs: 'Tabs',
      extGroupColumns: 'Columns',
      extGroupMain: 'Main',
      extGroupAside: 'Aside',
      extGroupFooter: 'Footer',
      externalGroupHint: 'Groups inferred from structure; a group can be hidden at once. Read-only units in the group are unaffected.',
      externalHideGroup: 'Hide group',
      externalRegister: 'Register this page',
      externalClearRegistry: 'Clear registration',
      externalRegistered: 'Registered',
      externalDeclareHint: 'Plugin self-declaration: add data-dshl-declare="header" (optional data-dshl-declare-label, data-dshl-declare-guard) on a node; the decomposer prefers it.',
      pluginSources: 'Plugin sources',
      pluginSourcesHint: 'Authoritative list from the host slots registry: which plugin registered what in which slot, and whether it is rendered right now. List slots can be hidden/reordered precisely; entry slots are reorder-only, page bodies and single slots stay read-only.',
      pluginSourcesUnavailable: 'The host exposes no slots registry here, so component sources cannot be listed; in-page geometric decomposition still works.',
      pluginSourcesCount: (slots, items, rendered) => `${slots} slots · ${items} items · ${rendered} rendered`,
      slotShowAll: 'Show all slots',
      slotNothingRendered: 'No plugin entry is rendered on this page yet.',
      slotSearch: 'Search slots, entries, registrants',
      slotSearchEmpty: 'No slot or entry matches.',
      slotSearchClear: 'Clear search',
      slotDragHint: 'Drag a row to reorder within its slot; the arrows move one step at a time.',
      slotNotRendered: 'not rendered',
      slotEntryOnly: 'entry · reorder only',
      slotPageOnly: 'page body · read-only',
      slotSingleOnly: 'single slot · read-only',
      slotOverlayOnly: 'overlay · read-only',
      slotKindList: 'list',
      slotKindKeyed: 'keyed',
      slotKindSingle: 'single',
      slotKindChain: 'chain',
      tabArrange: 'Slots',
      tabArrangeHint: 'Lay entries of one container out in several columns, adjust the gap, or collapse icon rows; containers come from sidebar blocks and rendered list slots.',
      arrange: 'Container layout',
      arrangeHint: 'Only the arrangement inside a container changes, not the entries or their order; turning it off restores the host layout.',
      arrangeEmpty: 'No arrangeable container right now: the sidebar must be visible, or a list slot needs two or more rendered entries.',
      arrangeColumns: 'Columns',
      arrangeDefault: 'Default',
      arrangeGap: 'Gap',
      arrangeCompact: 'Icons only',
      arrangeCompactHint: 'Hides the second child of every row (the text on icon rows) so narrow columns stay tidy.',
      arrangeOffline: 'not present',
      arrangeSlotPrefix: 'Slot',
      arrangePanels: 'Sidebar · panel list',
      arrangeFooter: 'Sidebar · footer actions',
      arrangeRightTabs: 'Right column · tab strip',
      arrangeSettingsNav: 'Settings · navigation column',
      relocate: 'Move between areas',
      relocateHint: 'Move a unit anywhere on the interface: press "Draw frame", drag a rectangle over the interface. The frame position becomes the placement, the frame width becomes the width; the unit height follows its content.',
      relocateFrameHint: 'The frame only decides position and width. Narrower than the source? It grows to the source width. Overlapping another container? It steps aside into free space.',
      relocateSource: 'Source unit',
      relocateNone: 'No move yet: pick a source unit, then press "Draw frame".',
      relocateEmptySources: 'No movable unit right now.',
      relocateRemove: 'Remove',
      relocateRedraw: 'Redraw',
      relocateAdjust: 'Adjust',
      relocatePending: 'not present now, inactive',
      relocateActive: 'active',
      relocateGone: 'source not present',
      relocateMoved: 'nudged clear of overlap',
      relocateFrameAt: (x, y) => `frame at (${x}, ${y})`,
      relocateFrameSize: (w, h) => ` · ${w}×${h}`,
      relocateConflict: 'position conflict',
      relocateConflictShort: 'surrounded, staying put for now',
      relocateConflictHint: 'No position around the frame avoids overlap (neighbouring containers fill the free space). Draw the frame somewhere emptier, or remove this move.',
      relocateLegacy: 'needs redraw',
      relocateLegacyHint: (count) => `${count} older moves (configured by target container plus start/end) carry no position, so no frame can be derived. Redraw them one by one, or clear them all.`,
      relocateLegacyClear: 'Clear those needing redraw',
      relocateSourceBlock: 'Sidebar block',
      relocateSourceUnit: 'Part unit',
      relocateSourceSlot: 'Slot entry',
      frameStart: 'Draw frame',
      frameCancel: 'Cancel',
      frameApply: 'Apply',
      frameTitle: (label) => `Drawing a frame for "${label}": press and drag a rectangle`,
      frameUsage: 'Release to apply; Esc or right click to cancel. The top-left corner is the placement, the frame width is the width.',
      frameUsageExisting: 'Existing frame: drag inside to move, drag the right edge to resize, arrow keys nudge (Shift for bigger steps), Enter applies, Esc cancels.',
      frameTooSmall: 'The frame is too small, drag a bit further.',
      frameClean: 'free space',
      frameNoHost: 'outside any region, placed against the viewport',
      frameHost: (name) => `inside "${name}"`,
      frameMigrate: 'overlaps content already in the container, will step aside on release',
      frameConflict: 'overlaps content in the container with no free space, will stay put on release',
      frameHint: (width, sourceWidth) => `${width}px${width > sourceWidth ? ` (grown to source width ${sourceWidth}px)` : ''}`,
      sync: 'Linked state',
      syncHint: 'The panel list and the slot registry describe the same icon row: with this on, ordering or hiding one side writes the other, so the two views no longer override each other.',
      syncPanellistOrder: 'Sync order',
      syncPanellistOrderHint: 'Reorder in the panel list also updates the matching slot entries, and the other way around.',
      syncPanellistHidden: 'Sync visibility',
      syncPanellistHiddenHint: 'Hiding one panel icon also hides its slot entry, and the other way around.',
      syncUnavailable: 'The host slots registry is unavailable, so linked state is unavailable.',
      rules: 'Link rules',
      rulesHint: 'When a condition holds, an action is layered on top: conditions read the current UI state (page / collapsed / area present / unit present), actions only hide or arrange a container; the base configuration is untouched.',
      ruleWhen: 'When',
      ruleThen: 'Then',
      ruleAdd: 'Add rule',
      ruleNone: 'No rule yet: pick a condition and an action, then press "Add rule".',
      ruleHit: 'matched',
      ruleMiss: 'not matched',
      ruleRemove: 'Remove rule',
      ruleCondPage: 'Page',
      ruleCondCollapsed: 'Sidebar collapsed',
      ruleCondArea: 'Area present',
      ruleCondPresent: 'Unit present',
      rulePageAny: 'Any page',
      rulePageConversation: 'Conversation',
      rulePagePlugins: 'Plugins',
      rulePagePluginDetail: 'Plugin detail',
      rulePageSettings: 'Settings',
      rulePageExternal: 'External plugin page',
      ruleCollapsedYes: 'collapsed',
      ruleCollapsedNo: 'expanded',
      ruleAreaSidebar: 'Sidebar',
      ruleAreaCenter: 'Conversation',
      ruleAreaRightbar: 'Right column',
      ruleAreaSettings: 'Settings',
      ruleActionHide: 'Hide unit',
      ruleActionArrange: 'Arrange container',
      ruleActionScheme: 'Switch layout scheme',
      ruleSchemeEmpty: 'No saved scheme yet',
      ruleColumns: 'Columns',
      ruleEmptyValue: 'Nothing to pick right now.',
      tabStorage: 'Entry storage',
      tabStorageHint: 'Tuck rarely used sidebar entries into the More menu: keep the sidebar short, open tucked entries from More, and flip the switch back to restore them.',
      storage: 'Entry storage',
      storageHint: 'On = tucked into that area\'s More menu; off = back in its list. Only the display location changes; the entry and its plugin stay as they are.',
      storageEmpty: 'No storable entry right now: the area must be visible and the host slots registry available.',
      storageHostEntry: 'host entry, always shown',
      storageHiddenHint: 'hidden in the panel list',
      storageMenuLabel: 'Stored entries',
      storageMenuEmpty: 'Nothing stored yet',
      storageZoneSidebar: 'Sidebar entries',
      storageZoneViews: 'Session view tabs',
      storageZoneGuide: 'Right column start cards',
      storageZoneSettings: 'Settings navigation',
      storageZonePlugins: 'Third-party plugins',
      storageZoneHeaderUtilities: 'Conversation header tools',
      storageZoneSettingsActions: 'Settings header actions',
      storageZoneOffline: 'not present',
      storageZoneEmpty: 'No storable entry in this area right now.',
      storageSettingsUnavailable: 'The settings panel is not open, or has no storable navigation entry.',
      storagePluginsUnavailable: 'The plugins page is not present, or has no storable third-party plugin.',
      storageGrantMore: 'More',
      storageGrantSettingsLabel: 'Stored settings',
      storageGrantPluginsLabel: 'Stored plugins',
      storageHeaderUtilitiesUnavailable: 'The conversation header is not present, or its tool row has no storable button.',
      storageSettingsActionsUnavailable: 'The settings header is not present, or has no storable button.',
      storageViewsUnavailable: 'The host slots registry is unavailable, so session views cannot be listed.',
      storageGuideUnavailable: 'The right column start page is not present, or has no storable card.',
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
      panelShortcut: 'Layout: open the editor panel',
      openPlugins: 'Plugins page',
      riskyHint: 'Heads up: the sidebar or panel entry is hidden, so a "Layout" recovery button floats in a clear spot. The shortcut also opens the editor panel.',
      shortcutHint: 'Shortcuts: Ctrl/⌘+Alt+L opens the editor panel; add Shift to restore the default layout.',
      panelTitle: 'Layout editor panel',
      panelOpen: 'Open editor panel',
      panelClose: 'Close editor panel',
      panelSideLeft: 'Dock left',
      panelSideRight: 'Dock right',
      panelCurrentPage: (page) => `Page: ${page}`,
      panelEntryHint: 'The editor is a global overlay: it stays on whatever page you opened it from, so recognition, preview and tweaks all see the live interface.',
      panelOpened: 'Panel open; press Esc or the close button.',
      observedAt: (time) => `Last seen ${time}`,
      observedArea: (time, area) => `Last seen ${time} · ${area}`,
      observedUnknown: 'Seen before, but no structure snapshot (legacy record).',
      notOnPage: 'Not on this page now; toggles apply but the effect is not visible here.',
      surfaceOffline: 'Not present',
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
      // Layout board (client.board.js reads this dictionary; the board keeps no second copy)
      board: 'Board',
      boardTitle: 'Layout board',
      boardOpen: 'Open board',
      boardHint: 'The four columns on the left list every structure; select a box on the canvas or a row in a column, then tune it on the right. Changes apply instantly.',
      boardPage: 'Current page',
      boardModeTrace: 'Trace',
      boardModeSkeleton: 'Skeleton',
      boardCapture: 'Capture again',
      boardAdvanced: 'Advanced panel',
      boardFilter: 'Filter structure',
      boardEmptyGroup: 'No node in this layer',
      boardNoSelection: 'Pick a node in the four columns or on the canvas to see its controls here.',
      boardSkeletonEmpty: 'No structure snapshot for this page yet. Visit the page once, or use "Capture again".',
      boardLayerRegion: 'Region',
      boardLayerContainer: 'Container',
      boardLayerSlot: 'Slot',
      boardLayerControl: 'Control',
      boardPresent: 'Present now',
      boardAbsent: 'Not on this page',
      boardMoveLeft: 'Move one place earlier',
      boardMoveRight: 'Move one place later',
      boardMoveUp: 'Move up',
      boardMoveDown: 'Move down',
      boardCenterMinWidth: 'Conversation min width',
      boardContentWidth: 'Conversation content max width',
      boardNavWidth: 'Settings nav width',
      boardColumns: 'Columns',
      boardGap: 'Gap',
      boardOrder: 'Order',
      boardRelocateTo: 'Draw frame',
      boardRelocateRedraw: 'Redraw frame',
      boardRelocateClear: 'Clear move',
      boardStoreTo: 'Store into "More"',
      boardReadonly: 'Read-only: entry-like slots may only be reordered; hiding one cuts the way back to its page.',
      boardReadonlyOverlay: 'Overlay and menu entries are read-only.',
      boardGeometryDrift: 'The structure snapshot may be stale; capture again.',
      boardDriftTitle: 'The skeleton may be stale',
      boardDriftDetail: (added, removed) => `Compared with the last capture: ${added} nodes added, ${removed} missing. The skeleton uses the old structure, so positions may not match.`,
      boardDriftRecapture: 'Capture this page again',
      boardLoading: 'Loading the board…',
      boardLoadFail: 'The board module failed to load; fell back to the editor panel.',
      boardShowMore: 'Show more',
      boardLayers: 'Structure',
      boardProps: 'Properties',
      boardDrillIn: 'Controls inside this node',
      boardBucketUnit: 'Decomposed units',
      boardBucketEntry: 'Slot entries',
      boardBucketXunit: 'Third-party units',
      boardBucketStore: 'Storable entries',
      boardBucketOther: 'Other',
    };

    /* ============================== 布局白板：几何快照 ============================== */
    /**
     * 白板要能跨页编辑：目标页不在 DOM 里时画「结构骨架」，所以除了现有的
     * `area-snapshots`（只存单元 id）之外还要存几何。
     *
     * 坐标一律归一化到 frame 的 0..1，这样窗口大小、DPI 变化都不影响骨架比例。
     * 每页各存一份，按页面 key 索引；只存节点矩形，不存元素引用。
     * 详见 docs/plans/2026-11-09-布局白板.md。
     */
    const BOARD_GEOMETRY_KEY = 'dsh-layout/board-geometry/v1';
    const BOARD_GEOMETRY_MAX_PAGES = 8;
    const BOARD_GEOMETRY_REFRESH_MS = 5000;
    let boardGeometry = readJsonStore(BOARD_GEOMETRY_KEY);

    /** 归一化矩形：相对 frame 的左上角与尺寸，保留三位小数（骨架精度足够，体积小一半）。 */
    function normalizedRect(node, frameRect) {
      if (node === null || node === undefined || node.isConnected !== true) return null;
      const rect = node.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return null;
      if (frameRect.width < 1 || frameRect.height < 1) return null;
      const round = (value) => Math.round(value * 1000) / 1000;
      return {
        x: round((rect.left - frameRect.left) / frameRect.width),
        y: round((rect.top - frameRect.top) / frameRect.height),
        w: round(rect.width / frameRect.width),
        h: round(rect.height / frameRect.height),
      };
    }

    /** 当前页面的几何快照：区域 → 容器 → 槽位 → 控件，四层一次量完。 */
    function collectBoardGeometry(targets) {
      const frame = targets.frame;
      if (frame === null || frame === undefined) return null;
      const frameRect = frame.getBoundingClientRect();
      if (frameRect.width < 1 || frameRect.height < 1) return null;
      const nodes = [];
      const push = (id, layer, node) => {
        const rect = normalizedRect(node, frameRect);
        if (rect === null) return;
        nodes.push({ id, layer, ...rect });
      };
      for (const [region, node] of Object.entries(targets.regions)) push(`region:${region}`, 'region', node);
      if (targets.settings !== null && targets.settings !== undefined) push('region:settings', 'region', targets.settings);
      for (const [block, node] of Object.entries(targets.blocks)) push(`block:${block}`, 'container', node);
      for (const [unitId, list] of Object.entries(targets.units ?? {})) push(`unit:${unitId}`, 'container', list[0]);
      for (const entry of targets.arrange ?? []) if (entry.id !== undefined) push(`arrange:${entry.id}`, 'container', entry.node);
      for (const group of targets.slotSources?.graph ?? []) {
        const first = group.items.find((item) => item.rendered && item.tops.length > 0);
        if (first !== undefined) push(`slot:${group.slot}`, 'slot', first.tops[0]);
      }
      for (const group of targets.slotSources?.graph ?? []) {
        for (const item of group.items) {
          if (!item.rendered || item.tops.length === 0) continue;
          push(`entry:${item.entryKey}`, 'control', item.tops[0]);
        }
      }
      for (const unit of targets.external?.units ?? []) push(`xunit:${targets.external.pageKey}::${unit.key}`, 'control', unit.node);
      // 结构签名：骨架漂移校验的判据。只取「有哪些节点 + 各层数量」，不取坐标——
      // 坐标随窗口尺寸变化是正常的，节点增删与层级变化才是结构变了。
      const byLayer = {};
      for (const item of nodes) byLayer[item.layer] = (byLayer[item.layer] ?? 0) + 1;
      const signature = `${Object.keys(byLayer).sort().map((layer) => `${layer}:${byLayer[layer]}`).join(',')}|${nodes.length}`;
      return { at: Date.now(), frame: { width: Math.round(frameRect.width), height: Math.round(frameRect.height) }, nodes, signature };
    }

    /** 页面 key：白板按页面分桶，与联动规则的页面枚举同一套词。 */
    function boardPageKey(targets) {
      if (areaLive(targets, 'settings')) return 'settings';
      const external = targets.external ?? null;
      if (external !== null && external !== undefined) return `external:${external.pageKey}`;
      if (targets.conversation !== null && targets.conversation !== undefined) return 'conversation';
      if (document.querySelector('[data-plugin-detail]') !== null) return 'pluginDetail';
      return 'plugins';
    }
    function writeBoardGeometry() {
      // 页面数量上限：按观测时间淘汰最旧的，避免 localStorage 无界增长
      const keys = Object.keys(boardGeometry);
      if (keys.length > BOARD_GEOMETRY_MAX_PAGES) {
        keys.sort((a, b) => Number(boardGeometry[a]?.at ?? 0) - Number(boardGeometry[b]?.at ?? 0));
        for (const key of keys.slice(0, keys.length - BOARD_GEOMETRY_MAX_PAGES)) delete boardGeometry[key];
      }
      writeJsonStore(BOARD_GEOMETRY_KEY, boardGeometry);
    }

    /**
     * 记录当前页几何。
     * 只在「这一页还没有快照」或「超过刷新间隔」时重量，避免每次 DOM 变动都量一遍
     * （refresh 由 MutationObserver 驱动，流式输出时非常频繁）。
     *
     * 冻结：白板处于骨架态时，主 bundle 通过 boardHost.freezeGeometry(pageKey) 把该页钉住。
     * 否则每 5 秒自动重量一次，快照永远是新鲜的，漂移校验就永远检测不到东西
     * （这正是第一版实现里的真实缺陷）。冻结后骨架保持稳定，用户点「重新抓取」才解冻更新。
     */
    let boardFrozenPage = null;
    let boardGeometryDirty = false;
    function recordBoardGeometry(targets, force) {
      if (targets.ok !== true) return;
      const key = boardPageKey(targets);
      if (force !== true && boardFrozenPage === key) return;
      const previous = boardGeometry[key];
      const now = Date.now();
      if (force !== true && previous !== undefined && now - Number(previous.at ?? 0) < BOARD_GEOMETRY_REFRESH_MS) return;
      const value = collectBoardGeometry(targets);
      if (value === null || value.nodes.length === 0) return;
      boardGeometry = { ...boardGeometry, [key]: value };
      boardGeometryDirty = true;
      writeBoardGeometry();
      boardGeometryDirty = false;
    }

    /**
     * 骨架漂移校验：当前页的真实结构与快照对不上时返回诊断，否则 null。
     *
     * 为什么需要：骨架是「上次看见这一页时」记下的，宿主升级、插件增删都会让它与真实结构脱节；
     * 而用户这时正在骨架态编辑，看到的是过期结构却毫无提示。
     *
     * 判据只用「节点集合的差集」：多出来的节点说明新增了东西，缺的说明结构被改了。
     * 坐标变化不算漂移（窗口尺寸、DPI、内容长度都会影响），否则每次都会误报。
     */
    function boardGeometryDrift(targets) {
      if (targets.ok !== true) return null;
      const key = boardPageKey(targets);
      const saved = boardGeometry[key];
      if (saved === undefined || !Array.isArray(saved.nodes) || saved.nodes.length === 0) return null;
      const current = collectBoardGeometry(targets);
      if (current === null || current.nodes.length === 0) return null;
      const savedIds = new Set(saved.nodes.map((item) => item.id));
      const currentIds = new Set(current.nodes.map((item) => item.id));
      const added = [...currentIds].filter((id) => !savedIds.has(id));
      const removed = [...savedIds].filter((id) => !currentIds.has(id));
      // 少量变动（一两个条目随内容出现/消失）是正常的，不报漂移
      if (added.length + removed.length < 3) return null;
      return {
        pageKey: key,
        savedAt: Number(saved.at ?? 0),
        added: added.length,
        removed: removed.length,
        addedSample: added.slice(0, 5),
        removedSample: removed.slice(0, 5),
      };
    }

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
      // 插件来源（slots 注册表）：key 形如 `sidebar.panellist::task-board`；语义同上
      slots: { hide: [], order: {} },
      // 槽位编排（区内排列）：容器 id → { columns 2..3, gap, compact }；只收 2/3 列，1 列等于关闭
      arrange: {},
      // 区域搬移：源单元 id → { to: 目标容器 id, place: 'start' | 'end' }
      relocate: {},
      // 联动规则：条件（页面 / 折叠 / 区域在场 / 单元在场）→ 动作（隐藏 / 容器排列）
      rules: [],
      // 联动同步：面板导航与插件来源写同一份顺序/显隐
      sync: { panellistOrder: false, panellistHidden: false },
      // 入口收纳：七个收纳区各自的「收进更多」清单，条目存 { id, label }
      storage: { sidebar: [], views: [], guide: [], settings: [], plugins: [], headerUtilities: [], settingsActions: [] },
    };

    /**
     * 搬移配置只存一个「框」：位置 x/y + 宽度 w（视口坐标，与投影的 fixed 定位同一坐标系）。
     *
     * 为什么从「源 × 目标 × 位置」改成框（第十六轮）：
     * 原模型是源 22 × 目标 18 × 位置 2 的笛卡尔积，前五轮（形状兼容、链式剔除、窗口栏避让、
     * 槽位化、槽位方向修正）全在这个积上做减法，永远补不完。而「目标容器」和「位置」这两维，
     * 在用户可以直接用鼠标指出位置的前提下根本不需要建模——用户画出什么位置就是什么位置。
     *
     * 于是配置里只剩几何：框给位置与宽度，源高度按内容自然展开。
     * 源的形状表、目标的槽位表、二者之间的兼容判据随之全部删除（见 docs/plans/2026-11-10-搬移改框.md）。
     */

    /** 框宽下限：再窄的框没有可读性，源内容会被压没。 */
    const FRAME_MIN_WIDTH = 120;
    /** 框坐标与宽度的夹取范围：防止导入脏数据把源投到屏幕外。 */
    const FRAME_COORD_LIMIT = 20000;

    function normalizeFrame(raw) {
      if (raw === null || typeof raw !== 'object') return null;
      const x = Number(raw.x);
      const y = Number(raw.y);
      const w = Number(raw.w);
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(w)) return null;
      return {
        x: Math.round(Math.min(FRAME_COORD_LIMIT, Math.max(-FRAME_COORD_LIMIT, x))),
        y: Math.round(Math.min(FRAME_COORD_LIMIT, Math.max(-FRAME_COORD_LIMIT, y))),
        w: Math.round(Math.min(FRAME_COORD_LIMIT, Math.max(FRAME_MIN_WIDTH, w))),
      };
    }

    /** 联动规则的枚举：条件与动作都只认这几类，配置里出现的其它值一律丢掉。 */
    const RULE_CONDITION_KINDS = new Set(['page', 'collapsed', 'area', 'present']);
    const RULE_ACTION_KINDS = new Set(['hide', 'arrange', 'scheme']);
    const RULE_PAGE_VALUES = new Set(['any', 'conversation', 'plugins', 'pluginDetail', 'settings', 'external']);
    const RULE_AREA_VALUES = new Set(['sidebar', 'center', 'rightbar', 'settings']);

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
      arrange: [],
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
      // 插件来源（slots 条目）：键更长，上限放到 160；其余同外部插件单元
      const slotsRaw = raw.slots && typeof raw.slots === 'object' ? raw.slots : {};
      const slotHide = Array.isArray(slotsRaw.hide) ? slotsRaw.hide.filter((item) => typeof item === 'string' && item.length > 0 && item.length <= 160) : [];
      const slotOrder = {};
      if (slotsRaw.order !== null && typeof slotsRaw.order === 'object') {
        for (const [key, value] of Object.entries(slotsRaw.order)) {
          if (typeof key !== 'string' || key.length === 0 || key.length > 160) continue;
          const num = Number(value);
          if (!Number.isFinite(num)) continue;
          slotOrder[key] = Math.min(50, Math.max(-50, Math.round(num)));
        }
      }
      out.slots = {
        hide: [...new Set(slotHide)].slice(0, 200),
        order: Object.fromEntries(Object.entries(slotOrder).slice(0, 200)),
      };
      // 槽位编排：容器 id → 列数与间距。只认 2/3 列（1 列就是关掉，不落配置），未知字段丢弃
      const arrangeRaw = raw.arrange !== null && typeof raw.arrange === 'object' ? raw.arrange : {};
      const arrange = {};
      for (const [id, value] of Object.entries(arrangeRaw)) {
        if (Object.keys(arrange).length >= 12) break;
        if (typeof id !== 'string' || id.length === 0 || id.length > 120) continue;
        if (value === null || typeof value !== 'object') continue;
        const columns = Math.round(Number(value.columns));
        if (!Number.isFinite(columns) || columns < 2 || columns > 3) continue;
        arrange[id] = {
          columns,
          gap: clampInt(value.gap, 0, 32, 8),
          compact: value.compact === true,
        };
      }
      out.arrange = arrange;
      /*
       * 区域搬移：源 id → { frame: {x, y, w} }。
       *
       * 旧形态是 { to, place }（目标容器 + 开头/结尾）。那套值没有位置信息，换算不出框，
       * 所以不静默丢弃也不猜：保留成 { legacy: true } 让面板标「需重画」。
       * 静默删会让用户以为搬移自己消失了，而这正是前几轮被反复抱怨的那类行为。
       */
      const relocateRaw = raw.relocate !== null && typeof raw.relocate === 'object' ? raw.relocate : {};
      const relocate = {};
      for (const [sourceId, value] of Object.entries(relocateRaw)) {
        if (Object.keys(relocate).length >= 64) break;
        if (typeof sourceId !== 'string' || sourceId.length === 0 || sourceId.length > 160) continue;
        if (value === null || typeof value !== 'object') continue;
        const frame = normalizeFrame(value.frame);
        relocate[sourceId] = frame === null ? { legacy: true } : { frame };
      }
      out.relocate = relocate;
      // 联动规则：条件与动作都按枚举收束，非法规则直接丢弃（而不是留一条永远不生效的）
      const rulesRaw = Array.isArray(raw.rules) ? raw.rules : [];
      const rules = [];
      for (const item of rulesRaw) {
        if (rules.length >= 12) break;
        if (item === null || typeof item !== 'object') continue;
        const when = item.when !== null && typeof item.when === 'object' ? item.when : null;
        const then = item.then !== null && typeof item.then === 'object' ? item.then : null;
        if (when === null || then === null) continue;
        if (!RULE_CONDITION_KINDS.has(when.kind) || !RULE_ACTION_KINDS.has(then.kind)) continue;
        let whenValue;
        if (when.kind === 'collapsed') whenValue = when.value === true;
        else if (when.kind === 'page') {
          if (!RULE_PAGE_VALUES.has(when.value)) continue;
          whenValue = when.value;
        } else if (when.kind === 'area') {
          if (!RULE_AREA_VALUES.has(when.value)) continue;
          whenValue = when.value;
        } else {
          if (typeof when.value !== 'string' || when.value.length === 0 || when.value.length > 160) continue;
          whenValue = when.value;
        }
        const rule = {
          id: typeof item.id === 'string' && item.id.length > 0 && item.id.length <= 40 ? item.id : `r${rules.length + 1}`,
          when: { kind: when.kind, value: whenValue },
          then: null,
        };
        if (then.kind === 'hide') {
          if (typeof then.target !== 'string' || then.target.length === 0 || then.target.length > 160) continue;
          rule.then = { kind: 'hide', target: then.target };
        } else if (then.kind === 'scheme') {
          // 切方案动作：只认方案 id，名字仅用于卡片显示（方案改名后规则仍指向同一套）
          if (typeof then.scheme !== 'string' || then.scheme.length === 0 || then.scheme.length > 64) continue;
          rule.then = {
            kind: 'scheme',
            scheme: then.scheme,
            schemeName: typeof then.schemeName === 'string' ? then.schemeName.slice(0, 40) : '',
          };
        } else {
          const columns = Math.round(Number(then.columns));
          if (typeof then.container !== 'string' || then.container.length === 0 || then.container.length > 120) continue;
          if (!Number.isFinite(columns) || columns < 2 || columns > 3) continue;
          rule.then = { kind: 'arrange', container: then.container, columns };
        }
        rules.push(rule);
      }
      out.rules = rules;
      // 联动同步：两个布尔开关
      const syncRaw = raw.sync !== null && typeof raw.sync === 'object' ? raw.sync : {};
      out.sync = {
        panellistOrder: syncRaw.panellistOrder === true,
        panellistHidden: syncRaw.panellistHidden === true,
      };
      // 入口收纳：三个收纳区各自的条目清单；旧的 storage.tucked（纯标签）迁到 sidebar
      const storageRaw = raw.storage !== null && typeof raw.storage === 'object' ? raw.storage : {};
      /**
       * 收纳域条目。
       *
       * `id` 只在「非空字符串」时才保留：早期版本写条目时用 `entry.id ?? ''`，把「这个入口没有稳定 id」
       * 落成了空串；而运行期判定身份走 `storageKeyOf`（有非空 id 用 id，否则 kind+label）。
       * 两者对不上会导致同一入口在配置里出现两条、开关删不干净——实测 sidebar 域 7 条全是 `id: ''`，
       * 界面上 74 条误显示为已收纳。这里把空 id 收掉，让两条分支统一走 kind+label。
       * 补回真实 id 由运行期 StorageCard 按 label 对齐（此时还没有 DOM 可看，不能在这里做）。
       */
      const storageZone = (list) => {
        const out = [];
        for (const item of Array.isArray(list) ? list : []) {
          if (out.length >= 40) break;
          if (item === null || typeof item !== 'object') continue;
          const id = typeof item.id === 'string' && item.id.length > 0 && item.id.length <= 160 ? item.id : '';
          const kind = typeof item.kind === 'string' && item.kind.length <= 40 ? item.kind : '';
          const label = typeof item.label === 'string' && item.label.length > 0 && item.label.length <= 60 ? item.label : '';
          if (label === '') continue;
          if (out.some((entry) => entry.label === label && entry.id === id && (entry.kind ?? '') === kind)) continue;
          const record = { label };
          if (id !== '') record.id = id;
          if (kind !== '') record.kind = kind;
          out.push(record);
        }
        return out;
      };
      // 开始页卡片的稳定身份就是 kind：早期条目 id 为空时在此补成 id=kind（docs/plans/2026-11-08-身份键收口.md）
      const guideZone = () => {
        const out = [];
        for (const entry of storageZone(storageRaw.guide)) {
          const upgraded = entry.id === '' && (entry.kind ?? '') !== '' ? { ...entry, id: entry.kind } : entry;
          if (out.some((item) => item.id === upgraded.id && item.label === upgraded.label)) continue;
          out.push(upgraded);
        }
        return out;
      };
      /**
       * 收纳域：把历史遗留的 `id: ''` 条目收成「无 id」形态。
       *
       * 早期版本写条目时用 `entry.id ?? ''`，把「这个入口没有稳定 id」落成了空字符串；
       * 而运行时判断身份用的是 `storageKeyOf`，它的分支是「有非空 id 用 id，否则用 kind+label」。
       * 两者对不上，导致同一个入口在配置里出现两条、开关也删不干净
       * （实测 sidebar 域里 7 条全是 `id: ''`，界面上 74 条误显示为已收纳）。
       *
       * 这里只做「空 id → 去掉 id 字段」这一件事，不依赖 DOM：normalizeConfig 在模块加载早期就会跑，
       * 此时还没有任何界面可以观察。补回真实 id 由运行期的 StorageCard 按 label 对齐（见 syncStorageIds）。
       */
      const storage = {
        sidebar: storageZone(storageRaw.sidebar),
        views: storageZone(storageRaw.views),
        guide: guideZone(),
        settings: storageZone(storageRaw.settings),
        plugins: storageZone(storageRaw.plugins),
        headerUtilities: storageZone(storageRaw.headerUtilities),
        settingsActions: storageZone(storageRaw.settingsActions),
      };
      if (Array.isArray(storageRaw.tucked) && storage.sidebar.length === 0) {
        storage.sidebar = storageZone(storageRaw.tucked.map((label) => ({ id: '', label })));
      }
      out.storage = storage;
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
      /**
       * panel：编辑面板（全局浮层）是否打开；board：白板是否打开；side：面板贴哪一侧；
       * framer：正在画框的源 id（空串 = 没在画框）。画框是「点源 → 在界面上拖出一个框」的两步操作，
       * 中间态必须进 snapshot 才能让浮层跟着渲染。
       */
      ui: (() => {
        try {
          const raw = JSON.parse(window.localStorage.getItem('dsh-layout/ui/v1') ?? '{}');
          return { editing: false, panel: false, board: false, framer: '', side: raw !== null && raw.side === 'left' ? 'left' : 'right' };
        } catch (error) {
          console.warn('[dsh-layout] 读取界面记忆失败，使用默认值', error);
          return { editing: false, panel: false, board: false, framer: '', side: 'right' };
        }
      })(),
      /** 落点重算信号：界面变化（新插件出现、布局重排）导致按钮被遮挡时递增。 */
      reposition: 0,
      /** 是否有未保存的配置改动（显式保存模式）：面板据此显示保存/还原按钮与提示。 */
      dirty: false,
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
        const text = JSON.stringify(snapshot.config);
        // 缓存先写：宿主写的确认是异步的，界面不能等它
        try {
          window.localStorage.setItem(STORAGE_KEY, text);
        } catch (error) {
          console.warn('[dsh-layout] 保存本地布局配置失败', error);
        }
        hostWrite('document', text);
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
        ? `${Object.keys(value.regions).join(',')}|${value.panels.map((panel) => panel.label).join('\u0001')}|${value.settings ? 's' : ''}|${surfaceSignature(value.surfaces ?? [])}|${anomalySignature(value.anomalies ?? [])}|${externalSignature(value.external)}|snap:${value.areaSnapshotVersion ?? 0}|slots:${value.slotSources?.version ?? 0}|arr:${(value.arrange ?? []).map((item) => item.id).join(',')}`
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

    /**
     * 配置草稿：所有界面操作先落在内存里，由「保存」决定何时提交到持久化层。
     *
     * 为什么改成显式保存（第十五轮）：
     * 原本每次改动都立刻写 localStorage + 宿主，而宿主写是异步的，落地前它还会推回旧快照。
     * 实测「点一下收纳 → 280ms 后被宿主旧值盖回 → 再点 → 又盖回」，用户看到的是回退甚至循环。
     * 第十四轮用「写入在途」拦住了大部分，但那是**对抗竞态**，不是消除竞态。
     *
     * 改成显式保存后，竞态从根上消失：宿主永远收不到中间态，只在用户按「保存」时收到一份完整配置。
     *
     * 预览仍然实时：`updateConfig` 立刻改内存并重算样式，界面马上能看到效果，
     * 只是不落盘。关掉插件/刷新页面会丢弃未保存的草稿——这是显式保存的代价，
     * 面板上会一直显示「有未保存改动」提示。
     */
    let configBase = null;   // 上次保存（或刚从宿主读回）的配置，用于「还原」
    /** 草稿是否与已保存版本不同；放在 snapshot 里让面板能感知（模块级变量 React 看不见）。 */
    function configIsDirty() {
      return snapshot.dirty === true;
    }

    function setDirty(dirty) {
      if (snapshot.dirty === dirty) return;
      snapshot = { ...snapshot, dirty };
    }

    function updateConfig(mutator, options = {}) {
      const draft = clone(snapshot.config);
      mutator(draft);
      if (options.capture === true) captureGeometry(draft);
      // 记「改动前」的配置供还原用：必须在覆盖 snapshot.config 之前拿，
      // 否则 configBase 记的是改完之后的值，还原就成了原地不动（实测踩过）。
      const before = options.silent === true ? null : snapshot.config;
      snapshot = { ...snapshot, config: normalizeConfig(draft) };
      // 只标记脏，不落盘：等用户按「保存」
      if (before !== null) markDirty(before);
      annotateStored();
      applyDynamicCss();
      notify();
    }

    function replaceConfig(next, options = {}) {
      const before = options.silent === true ? null : snapshot.config;
      snapshot = { ...snapshot, config: normalizeConfig(next) };
      if (before !== null) markDirty(before);
      annotateStored();
      applyDynamicCss();
      notify();
    }

    /** 记脏：`before` 是这次改动之前的配置，第一次变脏时保存下来供「还原」。 */
    function markDirty(before) {
      if (configIsDirty()) return;
      if (configBase === null) configBase = before;
      setDirty(true);
    }

    /**
     * 保存：把当前内存配置提交到持久化层（localStorage 缓存 + 宿主设置文档）。
     * 这是**唯一**的持久化入口——其他所有配置改动都只改内存。
     */
    function saveConfig() {
      configBase = null;
      setDirty(false);
      schedulePersist();
      notify();
    }

    /** 还原：丢弃未保存的改动，回到已保存的配置。 */
    function revertConfig() {
      if (configBase === null) {
        setDirty(false);
        notify();
        return;
      }
      snapshot = { ...snapshot, config: configBase, dirty: false };
      configBase = null;
      annotateStored();
      applyDynamicCss();
      applyRelocations();
      notify();
    }

    function setEditing(editing) {
      if (snapshot.ui.editing === editing) return;
      snapshot = { ...snapshot, ui: { ...snapshot.ui, editing } };
      notify();
    }

    /** 打开/关闭全局编辑面板；面板开着才能识别当前页面并就地调整。 */
    function setPanel(panel) {
      if (snapshot.ui.panel === panel) return;
      snapshot = { ...snapshot, ui: { ...snapshot.ui, panel } };
      notify();
    }

    /**
     * 打开/关闭布局白板。
     *
     * 白板与编辑面板互斥（同屏两个全屏层没有意义），编辑模式的虚线框也一并退掉。
     * 但要记住「白板是从面板进去的」：关闭白板时把面板恢复回来，
     * 否则用户从面板点「打开白板」、点「完成」之后面板凭空消失，原来的操作位置也丢了。
     */
    let boardReturnPanel = false;
    function setBoard(board) {
      if (snapshot.ui.board === board) return;
      if (board) boardReturnPanel = snapshot.ui.panel;
      const restorePanel = board === false && boardReturnPanel;
      snapshot = {
        ...snapshot,
        ui: {
          ...snapshot.ui,
          board,
          panel: board ? false : (restorePanel ? true : snapshot.ui.panel),
          editing: board ? false : snapshot.ui.editing,
        },
      };
      if (board) boardGeometryDirty = true;
      if (board === false) boardReturnPanel = false;
      notify();
    }

    function setPanelSide(side) {
      if (snapshot.ui.side === side) return;
      snapshot = { ...snapshot, ui: { ...snapshot.ui, side } };
      try {
        window.localStorage.setItem('dsh-layout/ui/v1', JSON.stringify({ ...readStoredUi(), side }));
      } catch (error) {
        console.warn('[dsh-layout] 保存面板位置失败', error);
      }
      notify();
    }

    /** 面板入口统一走这里：没启用就先启用，再打开面板。 */
    function openPanel() {
      if (!snapshot.config.enabled) updateConfig((draft) => { draft.enabled = true; }, { capture: true });
      setPanel(true);
    }

    /** 白板入口：没启用就先启用，再关掉编辑面板、打开白板。 */
    function openBoard() {
      if (!snapshot.config.enabled) updateConfig((draft) => { draft.enabled = true; }, { capture: true });
      setBoard(true);
    }

    /**
     * 进入 / 退出画框模式。`sourceId` 是要搬的源（空串 = 退出）。
     *
     * 画框取代了「选目标容器 + 选开头/结尾」两步：用户直接在界面上拖出一个框，
     * 位置由框本身给出，目标容器只在运行时做碰撞判定、不进配置。
     *
     * 进入时**临时收起编辑面板**并记下它原来是否开着：面板贴在左/右会盖住要画的位置，
     * 而画框是「对着真实界面指位置」的操作，视野越干净越好。退出时恢复原状，
     * 否则用户「调整一下」之后面板凭空消失，还得重新找入口。
     */
    let panelBeforeFramer = false;
    function setFramer(sourceId) {
      if (snapshot.ui.framer === sourceId) return;
      const entering = sourceId !== '' && snapshot.ui.framer === '';
      const leaving = sourceId === '' && snapshot.ui.framer !== '';
      if (entering) {
        panelBeforeFramer = snapshot.ui.panel;
        snapshot = { ...snapshot, ui: { ...snapshot.ui, framer: sourceId, panel: false } };
      } else if (leaving) {
        snapshot = { ...snapshot, ui: { ...snapshot.ui, framer: sourceId, panel: panelBeforeFramer } };
        panelBeforeFramer = false;
      } else {
        snapshot = { ...snapshot, ui: { ...snapshot.ui, framer: sourceId } };
      }
      notify();
    }

    /**
     * 画框完成：把框写进配置。
     *
     * 宽度下限夹到源单元实测宽——用户把框画得比源还窄时，源内容会被压没，
     * 而「框不足以容纳源宽高时自动放大」正是这套机制该做的事。
     *
     * `mode` 为 'nudge' 时不走放大：拖动已有框只是改位置，宽度沿用配置里的值。
     * 否则每次微调都会被「源原始宽」重新顶一次，框永远拖不窄、也拖不到源宽以下。
     */
    function commitFrame(sourceId, rect, mode) {
      if (typeof sourceId !== 'string' || sourceId === '') return;
      const source = relocateSources(snapshot.targets).find((item) => item.id === sourceId);
      const sourceBox = source === undefined ? null : relocateSourceBox(source.node);
      const raw = Math.max(FRAME_MIN_WIDTH, Math.round(rect.w));
      const width = mode === 'nudge' ? raw : Math.max(raw, sourceBox === null ? 0 : Math.ceil(sourceBox.width));
      updateConfig((draft) => {
        draft.relocate[sourceId] = { frame: normalizeFrame({ x: rect.x, y: rect.y, w: width }) };
      });
      setFramer('');
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

    /* ============================== 布局方案 ============================== */
    /**
     * 方案 = 存下来的整套配置快照。切换就是 replaceConfig(整套配置)，
     * 与「恢复默认 / 导入」走同一个入口，不需要第二套应用路径。
     * 与写死的 PRESETS 的区别：预设是起点模板（不落库），方案是用户自己的（落库、可改名可覆盖）。
     */
    const LAYOUTS_KEY = 'dsh-layout/layouts/v1';
    const LAYOUTS_MAX = 20;

    /** 方案表：只认结构完整的条目，name 去空白、config 走 normalizeConfig，上限 20 套。 */
    function readLayouts() {
      const raw = readJsonStore(LAYOUTS_KEY);
      const list = [];
      for (const item of Array.isArray(raw.list) ? raw.list : []) {
        if (list.length >= LAYOUTS_MAX) break;
        if (item === null || typeof item !== 'object') continue;
        const id = typeof item.id === 'string' && item.id.length > 0 && item.id.length <= 64 ? item.id : '';
        const name = typeof item.name === 'string' ? item.name.trim().slice(0, 40) : '';
        if (id === '' || name === '' || item.config === null || typeof item.config !== 'object') continue;
        if (list.some((entry) => entry.id === id)) continue;
        list.push({ id, name, savedAt: Number.isFinite(Number(item.savedAt)) ? Number(item.savedAt) : 0, config: normalizeConfig(item.config) });
      }
      const active = typeof raw.active === 'string' && list.some((entry) => entry.id === raw.active) ? raw.active : '';
      return { active, list };
    }

    /** 方案表写两层：本地缓存立即写，宿主设置文档异步跟写（跨浏览器持久化的主力）。 */
    function writeLayouts(state) {
      const payload = { active: state.active, list: state.list };
      writeJsonStore(LAYOUTS_KEY, payload);
      hostWrite('schemes', JSON.stringify(payload));
    }

    /**
     * 读取方案表，并在「超出上限」时把截断后的结果写回存储。
     *
     * 只有一种情况该写回：存储里的条目数超过 LAYOUTS_MAX（读取时按上限截断，
     * 写回是为了让存储与内存一致，避免下次再截一遍）。
     *
     * 这里的判据**不能**写成「raw 比规范化后的 state 长」。规范化会丢弃非法条目
     * （id 为空、name 为空、config 不是对象、id 重复），这些被丢弃的条目本来就该丢；
     * 用它当写回条件会在任何一次「存储里有脏条目」时把整张方案表覆盖成内存里的残缺版本，
     * 极端情况下（读到的全是脏条目）会把方案表清空 —— 实测切方案规则触发后
     * localStorage 里 config 与 schemes 双双消失，就是从这类覆盖开始的。
     */
    function readLayoutsNormalized() {
      const state = readLayouts();
      if (state.list.length > LAYOUTS_MAX) writeLayouts(state);
      return state;
    }

    /** 方案 id 只需在本机唯一：时间戳 + 递增尾数，避免同一毫秒连点两次重号。 */
    let layoutSeq = 0;
    function nextLayoutId() {
      layoutSeq += 1;
      return `scheme-${Date.now().toString(36)}-${layoutSeq}`;
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
     * 会话区结构「见过没有」的记忆（升级前只有这一个布尔，现在由区域快照取代，保留用于迁移）。
     * 识别层只能在目标页面渲染时看见它，因此一旦在会话页识别成功过就记下来，
     * 让控制项在别的页面上仍然可用——CSS 规则是常驻的，切回会话页自然生效。
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

    /** 区域是否识别过：优先看结构快照，其次兼容升级前的「见过」布尔。 */
    function areaSeen(area) {
      if (areaSnapshots[area] !== undefined) return true;
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
     * 官方区域结构快照。
     * 识别层只在目标页面渲染时看得见它（会话区、右栏、设置面板都不常驻 DOM），
     * 所以每次「真正看见」就把这一刻可见的拆解单元存下来；卡片和覆盖度用
     * 「上次观测 hh:mm」说明此刻不在场时看到的是什么时候的结构。
     * 只存单元清单与时间，不存元素引用。
     */
    const AREA_SNAPSHOT_KEY = 'dsh-layout/area-snapshots/v1';
    const AREA_IDS = ['sidebar', 'center', 'rightbar', 'settings'];
    /** 区域名沿用已有词条，避免再维护一套同义词。 */
    const AREA_LABEL_KEYS = { sidebar: 'sidebar', center: 'center', rightbar: 'rightbar', settings: 'settingsPanel' };
    /** 长时间停在同一页时刷新观测时间，让「上次观测」接近离开时刻而不是进入时刻。 */
    const AREA_OBSERVED_REFRESH_MS = 30000;
    let areaSnapshots = (() => {
      try {
        const raw = JSON.parse(window.localStorage.getItem(AREA_SNAPSHOT_KEY) ?? '{}');
        return raw !== null && typeof raw === 'object' ? raw : {};
      } catch (error) {
        console.warn('[dsh-layout] 读取区域结构快照失败', error);
        return {};
      }
    })();
    const areaLiveLast = { sidebar: false, center: false, rightbar: false, settings: false };
    let areaSnapshotVersion = 0;

    function areaParts(targets) {
      return { sidebar: targets.sidebarParts, center: targets.convParts, rightbar: targets.rightbarParts, settings: targets.settingsParts };
    }

    /** 区域此刻是否在 DOM 里（有可解析的容器结构）。 */
    function areaLive(targets, area) {
      const parts = areaParts(targets)[area];
      return parts !== null && parts !== undefined;
    }

    /** 观测时间：当天只显示时分，跨天带上月日。 */
    function formatClock(at) {
      const date = new Date(Number(at));
      if (Number.isNaN(date.getTime())) return '—';
      const pad = (value) => String(value).padStart(2, '0');
      const clock = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
      return date.toDateString() === new Date().toDateString() ? clock : `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${clock}`;
    }

    function recordAreaSnapshots(targets) {
      let changed = false;
      const now = Date.now();
      for (const area of AREA_IDS) {
        const live = areaLive(targets, area);
        const wasLive = areaLiveLast[area];
        areaLiveLast[area] = live;
        if (!live) continue;
        // 与覆盖度同一套「在场」判定，快照里存声明表 id，回放时直接对得上
        const ids = PART_UNITS
          .filter((unit) => {
            if (unit.area !== area) return false;
            const present = (id) => (targets.units[id]?.length ?? 0) > 0;
            if (unit.kind === 'order') return (unit.needs ?? []).length > 0 && unit.needs.every(present);
            return present(unit.id) || (unit.targets ?? []).some(present);
          })
          .map((unit) => unit.id);
        const previous = areaSnapshots[area];
        const sameIds = previous !== undefined && Array.isArray(previous.ids) && previous.ids.join('|') === ids.join('|');
        if (sameIds && wasLive && now - Number(previous.at ?? 0) < AREA_OBSERVED_REFRESH_MS) continue;
        areaSnapshots = { ...areaSnapshots, [area]: { at: now, ids } };
        changed = true;
      }
      if (!changed) return;
      areaSnapshotVersion += 1;
      try {
        window.localStorage.setItem(AREA_SNAPSHOT_KEY, JSON.stringify(areaSnapshots));
      } catch (error) {
        console.warn('[dsh-layout] 保存区域结构快照失败', error);
      }
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
     * 插件自声明优先：页面里带 data-dshl-declare 的节点直接作为声明单元（tier=declared），
     * 不再参与启发式，避免和自动结果重复。
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
          tier: 'auto',
          label: (node.getAttribute('aria-label') ?? textFingerprintOf(node) ?? '').slice(0, 24),
          text: textFingerprintOf(node),
          rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
          confidence: ['header', 'footer', 'aside', 'scroll'].includes(type) || extra.repeat === true ? 'high' : 'low',
          judge,
          node,
        });
      };
      // 自声明单元：插件作者用 data-dshl-declare 标出结构，带 guard 的只允许排序/尺寸
      const declaredNodes = [...root.querySelectorAll('[data-dshl-declare]')].filter((node) => {
        if (node.closest('[data-dshl-layer]') !== null || node.closest('[data-shortcut-modal]') !== null) return false;
        const rect = node.getBoundingClientRect();
        return rect.width >= 16 && rect.height >= 12;
      });
      const declaredSet = new Set(declaredNodes);
      const inDeclared = (node) => declaredNodes.some((declared) => declared === node || declared.contains(node));
      declaredNodes.forEach((node, index) => {
        if (units.length >= EXTERNAL_MAX_UNITS) return;
        const rect = node.getBoundingClientRect();
        const guard = node.hasAttribute('data-dshl-declare-guard');
        const declaredType = (node.getAttribute('data-dshl-declare') ?? '').trim();
        const label = (node.getAttribute('data-dshl-declare-label') ?? declaredType).trim();
        units.push({
          key: `D${index}`,
          depth: 1,
          parentKey: null,
          index,
          tag: node.tagName,
          classPrefix: classPrefixOf(node),
          role: node.getAttribute('role') ?? '',
          type: 'declared',
          tier: 'declared',
          label: label.slice(0, 24),
          text: textFingerprintOf(node),
          rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
          confidence: 'high',
          judge: {
            interactive: node.querySelectorAll(XUNIT_INTERACTIVE).length,
            inputs: node.querySelectorAll(XUNIT_TEXT_INPUT).length,
            isScroll: false,
            onlyScroll: false,
            entry: guard,
            ratio: Math.round(((rect.width * rect.height) / (rootArea || 1)) * 1000) / 1000,
            actions: guard ? ['reorder', 'resize'] : ['hide', 'reorder', 'resize'],
            blocked: guard ? ['entry'] : [],
            position: getComputedStyle(node).position,
          },
          node,
        });
        seen.add(node);
      });
      const l1Nodes = [...root.children].filter((node) => {
        if (node.tagName === 'STYLE' || node.tagName === 'SCRIPT') return false;
        if (inDeclared(node)) return false;
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
          if (inDeclared(child)) return false;
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

    /** 人工登记表：登记过的页面，其单元在后续扫描里升为 registered 档（声明单元优先）。 */
    function readExternalRegistry() {
      const store = readJsonStore(EXTERNAL_REGISTRY_KEY);
      return store !== null && typeof store === 'object' ? store : {};
    }

    function registerExternalPage(pageKey, units) {
      const registry = readExternalRegistry();
      registry[pageKey] = {
        registeredAt: new Date().toISOString(),
        units: units.map((unit) => ({ key: unit.key, type: unit.type, tier: unit.tier, label: unit.label, classPrefix: unit.classPrefix, tag: unit.tag })),
      };
      writeJsonStore(EXTERNAL_REGISTRY_KEY, registry);
    }

    function clearExternalPageRegistry(pageKey) {
      const registry = readExternalRegistry();
      if (registry[pageKey] === undefined) return;
      delete registry[pageKey];
      writeJsonStore(EXTERNAL_REGISTRY_KEY, registry);
    }

    /**
     * 分类模板：把扫出来的单元归成语义组，并给出页面类型。
     * 纯结构判定，不认识具体插件：有分栏项→看板，有概览行→仪表盘，有标签项→标签页，
     * 只有滚动区→滚动页，有页头→列表页，其余为通用。
     */
    function inferExternalProfile(units) {
      const l1 = units.filter((unit) => unit.depth === 1);
      const hasType = (type) => units.some((unit) => unit.type === type);
      const kind = hasType('group-item')
        ? 'board'
        : hasType('row')
          ? 'dashboard'
          : hasType('tab-item')
            ? 'tabbed'
            : l1.length <= 2 && hasType('scroll')
              ? 'scrollPage'
              : hasType('header')
                ? 'list'
                : 'generic';
      const groups = [
        { id: 'declared', nameKey: 'extGroupDeclared', types: ['declared'] },
        { id: 'header', nameKey: 'extGroupHeader', types: ['header'] },
        { id: 'overview', nameKey: 'extGroupOverview', types: ['row'] },
        { id: 'tabs', nameKey: 'extGroupTabs', types: ['tab-item'] },
        { id: 'columns', nameKey: 'extGroupColumns', types: ['group-item'] },
        { id: 'main', nameKey: 'extGroupMain', types: ['main', 'scroll'] },
        { id: 'aside', nameKey: 'extGroupAside', types: ['aside'] },
        { id: 'footer', nameKey: 'extGroupFooter', types: ['footer'] },
      ]
        .map((group) => ({ ...group, unitKeys: units.filter((unit) => group.types.includes(unit.type)).map((unit) => unit.key) }))
        .filter((group) => group.unitKeys.length > 0);
      return { kind, groups };
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
    function requestExternalCleanup(pageKey, units) {      if (units.length === 0) return;
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
      // 人工登记过的页面：登记过的单元升为 registered 档（声明单元优先保留 declared）
      const registry = readExternalRegistry()[page.pageKey];
      if (registry !== undefined && Array.isArray(registry.units)) {
        const registered = new Set(registry.units.map((unit) => unit.key));
        for (const unit of units) {
          if (unit.tier !== 'declared' && registered.has(unit.key)) unit.tier = 'registered';
        }
      }
      externalScanCache = { pageKey: page.pageKey, root: page.root, at: now, units };
      if (page.iframe === null) persistExternalScan(page.pageKey, 'dom', units);
      else persistExternalScan(page.pageKey, 'iframe', []);
      requestExternalCleanup(page.pageKey, units);
      return units;
    }

    /* ============================== 插件来源（slots 注册表） ============================== */
    /**
     * 组件来源的权威数据：宿主 slots 服务能列出「谁在哪个槽位注册了什么」，
     * 再用 React fiber 的组件引用同一性把已渲染条目映射到真实 DOM。
     * 服务不可用或 fiber 失效时整块降级为不可用（页面内部的几何拆解继续工作）。
     */
    let slotsService = null;
    const SLOT_SCAN_MS = 1500;
    const SLOT_ENTRY_ATTR = 'data-dshl-slotentry';
    /** 条目渲染结果若是纯图标，向上找可操作的行：按钮 / 链接 / 菜单项 / 列表项。 */
    const SLOT_ROW_SELECTOR = 'button, a[href], [role="button"], [role="tab"], [role="menuitem"], [role="switch"], label, li';
    /** 入口类槽位：只允许排序，不允许隐藏（隐藏会切断回到页面的路径）。 */
    const SLOT_ENTRY_LIKE = /(panellist|\.tab\b|\.tab\.|menu|\.item\b|\.view\b|section\.icon|right\.pane\.tab)/;
    let slotScan = { at: 0, graph: [], version: 0 };

    function bindSlotsService(ctx) {
      try {
        const service = typeof ctx.get === 'function' ? ctx.get('slots') : undefined;
        slotsService = service !== null && service !== undefined && typeof service.entries === 'function' && typeof service.snapshot === 'function' ? service : null;
      } catch (error) {
        console.warn('[dsh-layout] 无法读取 slots 服务，插件来源面板降级', error);
        slotsService = null;
      }
    }

    /** 槽位可操作级别：列表里的普通条目可隐藏+排序；入口类只排序；页面主体与单槽/keyed/chain 只读。 */
    function slotCapabilities(slot, kind) {
      if (slot === 'main' || slot === 'main.conversation' || slot === 'root') return { hide: false, order: false, reason: 'page' };
      if (kind !== 'list') return { hide: false, order: false, reason: 'single' };
      if (SLOT_ENTRY_LIKE.test(slot)) return { hide: false, order: true, reason: 'entry' };
      return { hide: true, order: true, reason: null };
    }

    /**
     * 找到所有 React 树的顶端。
     * 宿主可能有多个 React 根（例如设置弹层单独挂到 body），只走 #root 会漏掉弹层里的组件；
     * 这里扫 body 的直接子级找 __reactContainer$，再回退到 #root 子节点的 fiber。
     */
    function reactTopFibers() {
      const containers = [];
      const rootEl = document.getElementById('root');
      if (rootEl !== null) containers.push(rootEl);
      for (const child of document.body.children) {
        if (child !== rootEl) containers.push(child);
      }
      const tops = [];
      for (const container of containers) {
        const containerKey = Object.keys(container).find((name) => name.startsWith('__reactContainer$'));
        if (containerKey === undefined) continue;
        let top = container[containerKey];
        let guard = 0;
        while (top !== null && top.return !== null && guard < 400) {
          top = top.return;
          guard += 1;
        }
        if (top !== null) tops.push(top);
      }
      if (tops.length > 0) return tops;
      if (rootEl === null) return tops;
      const child = rootEl.firstElementChild;
      const fiberKey = child === null ? undefined : Object.keys(child).find((name) => name.startsWith('__reactFiber$'));
      if (fiberKey === undefined) return tops;
      let top = child[fiberKey];
      let guard = 0;
      while (top !== null && top.return !== null && guard < 400) {
        top = top.return;
        guard += 1;
      }
      if (top !== null) tops.push(top);
      return tops;
    }

    /** 一个组件 fiber 子树里渲染出的所有宿主节点。 */
    function hostNodesOf(fiber) {
      const nodes = [];
      const walk = (node) => {
        if (node === null || node === undefined) return;
        if (typeof node.type === 'string' && node.stateNode instanceof Element) nodes.push(node.stateNode);
        walk(node.child);
        walk(node.sibling);
      };
      walk(fiber.child);
      return nodes;
    }

    /** 只留组件自己的顶层渲染结果：被同组件其它节点包含的节点去掉。 */
    function topHostNodes(nodes) {
      const set = new Set(nodes);
      return nodes.filter((node) => {
        let parent = node.parentElement;
        while (parent !== null) {
          if (set.has(parent)) return false;
          parent = parent.parentElement;
        }
        return true;
      });
    }

    function slotRowOf(node) {
      let current = node;
      for (let depth = 0; depth < 5 && current !== null; depth += 1) {
        if (typeof current.matches === 'function' && current.matches(SLOT_ROW_SELECTOR)) return current;
        current = current.parentElement;
      }
      return node;
    }

    /** 不可渲染的标签：槽位里注入的 <style>/<script> 会被 fiber 当成宿主节点，但它们既不可见也不能搬。 */
    const UNRENDERABLE_TAG = /^(STYLE|SCRIPT|LINK|META|TEMPLATE|NOSCRIPT)$/;

    /** 有真实尺寸才算可操作：零尺寸节点是未展开的挂载点或占位，搬它没有意义（且会污染下拉清单）。 */
    function hasBox(node) {
      if (node === null || node === undefined || typeof node.getBoundingClientRect !== 'function') return false;
      const rect = node.getBoundingClientRect();
      return rect.width >= 2 && rect.height >= 2;
    }

    function operationTargetOf(nodes) {
      // 先剔掉 <style>/<script> 这类不可渲染节点：它们有 fiber 但没有布局盒
      const renderable = nodes.filter((node) => node instanceof Element && !UNRENDERABLE_TAG.test(node.tagName));
      const tops = [...new Set(topHostNodes(renderable).map(slotRowOf))];
      // 弹层类条目（对话框 / 菜单 / 浮层）隐藏后可能让功能入口彻底消失，一律只读
      const overlay = tops.some((node) => node.matches?.('[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], dialog') === true
        || node.querySelector?.('[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], dialog') !== null);
      return { tops, orderable: tops.length === 1 && !overlay, overlay };
    }

    function scanSlots() {
      if (slotsService === null) return slotScan;
      const now = Date.now();
      if (slotScan.graph.length > 0 && now - slotScan.at < SLOT_SCAN_MS) return slotScan;
      try {
        const tree = slotsService.snapshot();
        const nodeByName = new Map();
        const walk = (node) => {
          if (node === null || node === undefined) return;
          if (node.type === 'slot' && !nodeByName.has(node.name)) nodeByName.set(node.name, node);
          for (const child of node.children ?? []) walk(child);
        };
        for (const node of tree) walk(node);
        const componentTargets = new Map();
        const graph = [];
        for (const [name, node] of nodeByName) {
          const occupants = node.occupants ?? [];
          if (occupants.length === 0) continue;
          let entries = [];
          try {
            entries = slotsService.entries(name);
          } catch (error) {
            entries = [];
          }
          const usedEntries = new Set();
          const capabilities = slotCapabilities(name, node.kind);
          const items = occupants.map((occupant, index) => {
            const id = occupant.id ?? occupant.key;
            let entry = entries.find((candidate, entryIndex) => {
              if (usedEntries.has(entryIndex)) return false;
              if (id === undefined) return false;
              return candidate.options?.id === id || candidate.options?.key === id;
            });
            if (entry === undefined) entry = entries[index] ?? null;
            else usedEntries.add(entries.indexOf(entry));
            const entryKey = id === undefined ? `${name}::#${index}` : `${name}::${id}`;
            return {
              slot: name,
              kind: node.kind,
              entryKey,
              id: id === undefined ? `#${index}` : String(id),
              order: occupant.order,
              active: occupant.active !== false,
              registrant: occupant.registrant ?? entry?.registrant ?? '',
              componentName: entry?.component?.name ?? '',
              component: entry?.component,
              rendered: false,
              hideable: capabilities.hide,
              orderable: capabilities.order,
              reason: capabilities.reason,
              tops: [],
            };
          }).filter((item) => !item.id.startsWith('dsh-layout'));
          // 组件引用只在内存里用于 fiber 匹配，卡片不读它
          for (const item of items) {
            if (typeof item.component !== 'function') continue;
            const list = componentTargets.get(item.component);
            if (list === undefined) componentTargets.set(item.component, [item]);
            else list.push(item);
          }
          graph.push({ slot: name, kind: node.kind, scope: node.scope, rendered: 0, items });
        }
        // fiber 定位：用注册表里的组件函数引用做同一性匹配，不依赖组件名（生产构建可能压缩或为空）
        const topFibers = reactTopFibers();
        if (topFibers.length > 0 && componentTargets.size > 0) {
          const seen = new Set();
          const visit = (fiber) => {
            if (fiber === null || fiber === undefined || seen.has(fiber)) return;
            seen.add(fiber);
            if (typeof fiber.type === 'function' && componentTargets.has(fiber.type)) {
              const nodes = hostNodesOf(fiber);
              if (nodes.length > 0) {
                const target = operationTargetOf(nodes);
                for (const item of componentTargets.get(fiber.type)) {
                  if (item.rendered) continue;
                  item.rendered = true;
                  item.tops = target.tops;
                  if (target.overlay) {
                    item.hideable = false;
                    item.orderable = false;
                    item.reason = 'overlay';
                  } else if (!target.orderable) {
                    item.orderable = false;
                  }
                }
              }
            }
            visit(fiber.child);
            visit(fiber.sibling);
          };
          for (const topFiber of topFibers) visit(topFiber);
        }
        for (const group of graph) group.rendered = group.items.filter((item) => item.rendered).length;
        slotScan = { at: now, graph, version: slotScan.version + 1 };
        return slotScan;
      } catch (error) {
        console.warn('[dsh-layout] 读取插件来源失败，本次跳过', error);
        return slotScan;
      }
    }

    /**
     * 槽位扫描有时效缓存；设置页这类「后打开的面板」第一次 refresh 时可能还在缓存期内，
     * 已渲染的条目拿不到标记。这里在「未渲染条目对应的槽位出口已经出现在 DOM」时提前让缓存失效，
     * 限频 300ms，避免流式输出等高频变更拖慢扫描。
     */
    function scanSlotsIfStale() {
      if (slotScan.graph.length === 0) return;
      const now = Date.now();
      if (now - slotScan.at >= SLOT_SCAN_MS || now - slotScan.at < 300) return;
      for (const group of slotScan.graph) {
        if (group.items.every((item) => item.rendered)) continue;
        const outlet = document.querySelector(`[data-slot="${group.slot}"]`);
        if (outlet !== null && outlet.childElementCount > 0) {
          slotScan = { ...slotScan, at: 0 };
          return;
        }
      }
    }

    /** 把已渲染条目标记到 DOM：样式与卡片都按 `槽位::条目id` 定位。 */
    const slotAnnotated = new Set();
    function annotateSlotEntries() {
      scanSlotsIfStale();
      const scan = scanSlots();
      if (slotsService === null || scan.graph.length === 0) return;
      const done = new Set();
      for (const group of scan.graph) {
        for (const item of group.items) {
          if (!item.rendered) continue;
          // 只标记可操作条目：页面主体、单槽与只读项不打标记，避免整页/整栏被挂上属性
          if (!item.hideable && !item.orderable) continue;
          for (const node of item.tops) {
            if (node === null || node === undefined || !node.isConnected) continue;
            if (node.getAttribute(SLOT_ENTRY_ATTR) !== item.entryKey) node.setAttribute(SLOT_ENTRY_ATTR, item.entryKey);
            done.add(node);
          }
        }
      }
      for (const node of slotAnnotated) {
        if (!done.has(node) && node.isConnected) node.removeAttribute(SLOT_ENTRY_ATTR);
      }
      slotAnnotated.clear();
      for (const node of done) slotAnnotated.add(node);
    }

    /* ============================== 槽位编排（区内排列的容器） ============================== */
    /**
     * 可排列容器：一类是宿主自己的布局容器（侧栏面板导航、底部操作、右栏标签栏、设置页导航），
     * 一类是列表槽位的出口（多个已渲染条目的共同父级）。
     * 两者都只打标记，排列由生成的网格样式完成；id 是配置键与卡片身份，槽位出口用 `slot:<槽位键>`。
     */
    const ARRANGE_KNOWN = [
      { id: 'panels', labelKey: 'arrangePanels', pick: (targets) => targets.blocks.panels ?? null },
      { id: 'sidebar-footer', labelKey: 'arrangeFooter', pick: (targets) => targets.blocks.footer ?? null },
      { id: 'rightbar-tabs', labelKey: 'arrangeRightTabs', pick: (targets) => targets.rightbarParts?.tabs ?? null },
      { id: 'settings-nav', labelKey: 'arrangeSettingsNav', pick: (targets) => targets.settingsParts?.nav ?? null },
    ];

    /** 最近公共祖先：槽位出口外面可能还包着一层，取所有已渲染条目的公共父级。 */
    function nearestCommonAncestor(nodes) {
      if (nodes.length === 0) return null;
      let candidate = nodes[0].parentElement;
      while (candidate !== null) {
        if (nodes.every((node) => candidate.contains(node))) return candidate;
        candidate = candidate.parentElement;
      }
      return null;
    }

    /** 浮层 / 菜单 / 弹层类槽位不参与排列：它们互相覆盖，排成网格没有意义。 */
    const ARRANGE_SKIP_SLOT = /(overlay|contextmenu|menu|popover|tooltip|dialog|toast)/i;

    /** 容器要有真实尺寸才算可排列：`display:contents` 的出口按第一个有尺寸的子元素算。 */
    function readableBox(node) {
      if (node === null || node === undefined) return null;
      const style = getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') return null;
      if (style.display === 'contents') {
        for (const child of node.children) {
          const box = child.getBoundingClientRect();
          if (box.width > 0 && box.height > 0) return box;
        }
        return null;
      }
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 ? rect : null;
    }

    /** 槽位出口容器：列表槽位里两个以上已渲染条目的共同父级。 */
    function slotArrangeContainers(targets) {
      const sources = targets.slotSources ?? null;
      if (sources === null) return [];
      const out = [];
      for (const group of sources.graph) {
        if (group.kind !== 'list' || ARRANGE_SKIP_SLOT.test(group.slot)) continue;
        const nodes = group.items.filter((item) => item.rendered && item.tops.length === 1).map((item) => item.tops[0]);
        if (nodes.length < 2) continue;
        const parent = nearestCommonAncestor(nodes);
        if (parent === null || parent === document.body || parent.children.length < 2) continue;
        if (readableBox(parent) === null) continue;
        out.push({ id: `slot:${group.slot}`, slot: group.slot, node: parent });
      }
      return out;
    }

    /** 已知容器可能只是外层包裹：向下穿过「只有一个子元素」的包裹，直到真正装条目的列表。 */
    function unwrapContainer(node) {
      let current = node;
      for (let depth = 0; depth < 4 && current !== null; depth += 1) {
        if (current.children.length !== 1) return current;
        const only = current.firstElementChild;
        if (only === null || only.children.length < 2) return current;
        current = only;
      }
      return current;
    }

    /** 当前可排列容器：已知容器优先，同一个节点只出现一次。 */
    function readArrangeContainers(targets) {
      const list = [];
      const used = new Set();
      const push = (entry) => {
        const node = entry.node;
        if (node === null || node === undefined || node.isConnected !== true) return;
        if (used.has(node)) return;
        if (readableBox(node) === null) return;
        used.add(node);
        list.push(entry);
      };
      for (const known of ARRANGE_KNOWN) push({ id: known.id, labelKey: known.labelKey, node: unwrapContainer(known.pick(targets)) });
      for (const entry of slotArrangeContainers(targets)) push(entry);
      return list;
    }

    /** 容器标记：每轮识别重打；容器消失时撤掉旧标记，避免样式命中已换位置的节点。 */
    const arrangeAnnotated = new Set();
    function annotateArrange(targets) {
      const done = new Set();
      for (const entry of targets.arrange ?? []) {
        if (entry.node === null || entry.node === undefined || entry.node.isConnected !== true) continue;
        mark(entry.node, 'data-dshl-arrange', entry.id);
        done.add(entry.node);
      }
      for (const node of arrangeAnnotated) {
        if (!done.has(node) && node.isConnected) node.removeAttribute('data-dshl-arrange');
      }
      arrangeAnnotated.clear();
      for (const node of done) arrangeAnnotated.add(node);
    }

    /* ============================== 区域搬移（画框投影） ============================== */
    /**
     * 搬移不移动 DOM 节点：源节点留在 React 树里，只改成 fixed 定位并落到用户画的框上。
     * 这样不触碰 React 协调器（没有 insertBefore/removeChild 风险），事件委托也仍然有效。
     *
     * 第十六轮把「目标容器 + 开头/结尾」整个换成「框」：位置由用户用鼠标直接指出，
     * 于是配置里只剩几何（框的位置与宽度），源高度按内容自然展开。
     * 目标容器不再进入配置，也就不再需要槽位表、形状表和它们之间的兼容判据。
     * 详细推导见 docs/plans/2026-11-10-搬移改画框.md。
     */
    const TELEPORT_ATTR = 'data-dshl-teleport';

    /** 可搬移源：侧栏块、拆解单元（显隐类）、已渲染且可操作的槽位条目（单目标、非弹层）。 */
    function relocateSources(targets) {
      const list = [];
      for (const [block, node] of Object.entries(targets.blocks ?? {})) {
        if (node === null || node === undefined) continue;
        list.push({ id: `block:${block}`, labelKey: BLOCK_LABEL_KEYS[block] ?? null, name: block, group: 'block', node });
      }
      for (const unit of PART_UNITS) {
        if (unit.kind !== 'hide') continue;
        const nodes = targets.units?.[unit.id] ?? [];
        if (nodes.length === 0) continue;
        list.push({ id: `unit:${unit.id}`, labelKey: unit.labelKey, name: unit.id, group: 'unit', node: nodes[0] });
      }
      const sources = targets.slotSources ?? null;
      if (sources !== null) {
        for (const group of sources.graph) {
          for (const item of group.items) {
            if (!item.rendered || item.tops.length !== 1) continue;
            if (!item.hideable && !item.orderable) continue;
            if (item.reason === 'overlay') continue;
            // 零尺寸条目不能搬：它们的矩形是 0×0，投影后既看不到也定位不到位，
            // 而且会往下拉清单里塞进一堆 `shell.overlay · xxx` 这类无意义选项
            // （实测混进了 context-menu / pet / baifan / 两个 <style>）。
            if (!hasBox(item.tops[0])) continue;
            list.push({ id: item.entryKey, labelKey: null, name: `${group.slot} · ${item.id}`, group: 'slot', node: item.tops[0] });
          }
        }
      }
      return list;
    }

    /** 搬移源标签：配置过的源即使此刻不在场，也能从静态表里拿到名字。 */
    function relocateSourceLabel(t, sourceId) {
      if (sourceId.startsWith('block:')) {
        const block = sourceId.slice(6);
        return t(BLOCK_LABEL_KEYS[block] ?? block);
      }
      if (sourceId.startsWith('unit:')) {
        const unit = PART_UNITS.find((item) => item.id === sourceId.slice(5));
        return unit === undefined ? sourceId.slice(5) : t(unit.labelKey);
      }
      if (sourceId.includes('::')) {
        const at = sourceId.indexOf('::');
        return `${sourceId.slice(0, at)} · ${sourceId.slice(at + 2)}`;
      }
      return sourceId;
    }

    /**
     * 源单元的原始尺寸缓存：投影会把节点宽度改写（宽度跟框），之后再量得到的是被改写后的值。
     * 框宽要靠「源原始宽度」兜底（框画窄了自动放大到源宽），所以必须以节点为键记住
     * 第一次（未投影时）量到的尺寸。用 WeakMap，节点被 React 重建后自然失效。
     */
    const relocateSourceBoxCache = new WeakMap();
    function relocateSourceBox(node) {
      if (node === null || node === undefined) return null;
      const cached = relocateSourceBoxCache.get(node);
      if (cached !== undefined) return cached;
      const box = readableBox(node);
      if (box === null) return null;
      relocateSourceBoxCache.set(node, box);
      return box;
    }

    /**
     * 框的最终宽高：宽度取「框宽」与「源原始宽」的较大者——用户把框画窄了不该把内容压没，
     * 这是「框不足以容纳源宽高时自动放大」的落地。高度不参与：源高度随内容自然展开。
     */
    function relocateFrameSize(frame, sourceBox) {
      const width = Math.max(FRAME_MIN_WIDTH, Math.round(frame.w), sourceBox === null ? 0 : Math.ceil(sourceBox.width));
      return { width };
    }

    /**
     * 框是否压住了容器里已被占用的内容：判据是矩形相交（不是「框落在容器内」）。
     * 压在内容边界上的框同样会盖住它，所以按相交算而不是按包含算。
     *
     * 框高取框自己的高（源的预计高），不能用障碍物的高——那是两个不同物体的尺寸。
     */
    function frameHitsContainer(frame, box) {
      if (box === null) return false;
      const height = Math.max(1, Math.round(frame.height));
      const width = frame.width;
      return frame.x < box.right && frame.x + width > box.left
        && frame.y < box.bottom && frame.y + height > box.top;
    }

    /**
     * 位置合法化：把框夹进视口（上界避开原生窗口栏），然后做碰撞迁移。
     *
     * 迁移策略是「四方向 × 由近到远」：框压住某个容器时，沿上下左右依次试「贴到容器外侧」的位置，
     * 取第一个不再碰撞的；都不行就保留用户画的位置并标记冲突（让面板说明，而不是悄悄换个地方）。
     *
     * 为什么不做「自动找最近空白」的全局搜索：用户画框时心里有位置，大幅移动会变成
     * 「我明明放这儿它自己跑了」。只做贴边微调，改动量最小且可预测。
     */
    function relocateResolveFrame(frame, obstacles, topBound, viewport) {
      const width = frame.width;
      const height = Math.max(1, Math.round(frame.height));
      const minX = 0;
      const maxX = Math.max(minX, viewport.width - width);
      const minY = topBound;
      const maxY = Math.max(minY, viewport.height - height);
      const clampX = (value) => Math.min(maxX, Math.max(minX, Math.round(value)));
      const clampY = (value) => Math.min(maxY, Math.max(minY, Math.round(value)));
      let x = clampX(frame.x);
      let y = clampY(frame.y);
      const hitAt = (px, py) => obstacles.some((box) => frameHitsContainer({ x: px, y: py, width, height }, box));
      if (!hitAt(x, y)) return { x, y, width, moved: x !== Math.round(frame.x) || y !== Math.round(frame.y) };
      // 四方向贴边：distance 用于排序，候选位置取「与冲突容器外侧对齐」
      const candidates = [];
      for (const box of obstacles) {
        candidates.push({ x, y: Math.round(box.top - height), gap: Math.abs(box.top - height - y), axis: 'above' });
        candidates.push({ x, y: Math.round(box.bottom), gap: Math.abs(box.bottom - y), axis: 'below' });
        candidates.push({ x: Math.round(box.left - width), y, gap: Math.abs(box.left - width - x), axis: 'left' });
        candidates.push({ x: Math.round(box.right), y, gap: Math.abs(box.right - x), axis: 'right' });
      }
      candidates.sort((a, b) => a.gap - b.gap);
      for (const candidate of candidates) {
        const px = clampX(candidate.x);
        const py = clampY(candidate.y);
        if (hitAt(px, py)) continue;
        return { x: px, y: py, width, moved: true, axis: candidate.axis };
      }
      return { x, y, width, moved: false, conflict: true };
    }

    /**
     * 框落在哪个区域：取包含框中心的区域。
     *
     * 区域是框的**目标容器**（框落进去的地方），不是障碍物——这一点必须先分清：
     * 视口被三栏铺满，如果把区域本身当障碍，任何位置都会「碰撞」，迁移永远找不到空位。
     * 真正的障碍是区域**内部**已经被内容占掉的部分（侧栏块、会话头、设置页导航列……），
     * 也就是用户说的「可迁入空间」里已经被占用的那一块。
     */
    function relocateHostOf(frame, targets) {
      const cx = frame.x + frame.width / 2;
      const cy = frame.y + frame.height;
      for (const [name, node] of Object.entries(targets.regions ?? {})) {
        const box = readableBox(node);
        if (box === null) continue;
        if (cx >= box.left && cx <= box.right && cy >= box.top && cy <= box.bottom) {
          return { name, box, node };
        }
      }
      return null;
    }

    /**
     * 目标容器内部已被占用的矩形。
     *
     * 层级要自适应，不能固定取「直接子元素」：宿主不同区域的结构深度不一样——
     * 侧栏区域下面是 `[data-slot=sidebar]` 再套一层才是真正的块容器，会话区下面是 convroot。
     * 固定取直接子级时，这类区域会退化成一个「把整个区域都包住」的障碍，框落哪儿都碰撞。
     * 所以从源节点所在层开始下钻：只要某层只有一个「实质包裹」子元素（不含源自身），就继续往里走，
     * 直到拿到一组真正并列的内容块。
     *
     * 源自身（及其祖先链）必须排除，否则「原地微调」会被自己挡住。
     */
    function relocateObstacleLevel(host, sourceNode) {
      let level = host.node;
      for (let depth = 0; depth < 4; depth += 1) {
        const kids = [...level.children].filter((child) => !(sourceNode !== null && sourceNode !== undefined && (child === sourceNode || child.contains(sourceNode))));
        const readable = kids.filter((child) => readableBox(child) !== null);
        // 只有一个实质子级、且它几乎撑满父级 → 只是个包裹层，继续下钻
        if (readable.length !== 1) return { level, kids: readable };
        const only = readable[0];
        const parentBox = readableBox(level);
        const onlyBox = readableBox(only);
        if (parentBox === null || onlyBox === null) return { level, kids: readable };
        const spansMost = onlyBox.width >= parentBox.width - 4 && onlyBox.height >= parentBox.height - 4;
        if (!spansMost) return { level, kids: readable };
        level = only;
      }
      return { level, kids: [...level.children].filter((child) => readableBox(child) !== null) };
    }

    function relocateObstacles(host, sourceNode) {
      if (host === null) return [];
      const { kids } = relocateObstacleLevel(host, sourceNode);
      const out = [];
      for (const child of kids) {
        const box = readableBox(child);
        if (box === null) continue;
        out.push({ left: box.left, top: box.top, right: box.right, bottom: box.bottom });
      }
      return out;
    }

    /**
     * 搬移解析：把配置里的框换算成一次落位。
     * `active` 是要建立投影的条目，`legacy` 是旧形态（{to, place}）需要重画的源 id。
     */
    function relocateResolve(targets, config) {
      const byId = new Map(relocateSources(targets).map((source) => [source.id, source]));
      const topBound = projectionTopBound();
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const active = [];
      const legacy = new Set();
      for (const [sourceId, spec] of Object.entries(config.relocate ?? {})) {
        if (spec === null || typeof spec !== 'object') continue;
        if (spec.legacy === true) {
          legacy.add(sourceId);
          continue;
        }
        const frame = normalizeFrame(spec.frame);
        if (frame === null) {
          legacy.add(sourceId);
          continue;
        }
        const source = byId.get(sourceId);
        if (source === undefined) continue;
        const sourceBox = relocateSourceBox(source.node);
        if (sourceBox === null) continue;
        const size = relocateFrameSize(frame, sourceBox);
        // 高度先按源当前高度估：源被改宽后高度会变，帧循环会再校正一次
        const probe = { x: frame.x, y: frame.y, width: size.width, height: Math.max(1, Math.round(sourceBox.height)) };
        // 目标容器 = 框落进去的那个区域；障碍 = 该区域内已被占用的同级内容
        const host = relocateHostOf(probe, targets);
        const obstacles = relocateObstacles(host, source.node);
        const resolved = relocateResolveFrame(probe, obstacles, topBound, viewport);
        active.push({ sourceId, node: source.node, frame, resolved, host: host === null ? '' : host.name });
      }
      return { active, legacy };
    }

    function relocateActiveList(targets, config) {
      return relocateResolve(targets, config).active;
    }

    const projection = { entries: new Map(), raf: 0, frames: 0 };

    function projectionCreate(item) {
      const node = item.node;
      const resolved = item.resolved;
      node.setAttribute(TELEPORT_ATTR, item.sourceId);
      node.style.setProperty('--dshl-tw', `${resolved.width}px`);
      node.style.setProperty('--dshl-tx', '0px');
      node.style.setProperty('--dshl-ty', '0px');
      /*
       * 注意：源节点若落在「自己形成层叠上下文」的祖先里（桌面端实测 `.composerSeat`
       * 有 z-index:9 + will-change:transform），投影的 z-index:1100 只在那一层内部有效，
       * 可能被同层或更高的兄弟盖住。这里**没有**去给宿主祖先提权——那会把整个容器
       * （实测 1253×128 的整条输入区）一起顶高，压住旁边不该被盖的内容。
       * 层叠问题留待单独评估，见 docs/details/注释/布局引擎.md。
       */
      // 位移必须**增量累加**而不是写绝对坐标：含 transform 的祖先会让 fixed 的 containing block
      // 不是视口，那时 left:0 并不等于屏幕左边，绝对赋值会整体偏移一个祖先的位置。
      // 累加「还差多少」与基准无关，两种情况都收敛到同一个视觉位置（实测踩过这条）。
      return { sourceId: item.sourceId, node, width: resolved.width, x: resolved.x, y: resolved.y, tx: 0, ty: 0, conflict: resolved.conflict === true };
    }

    function projectionDispose(entry) {
      if (entry.node.isConnected) {
        entry.node.removeAttribute(TELEPORT_ATTR);
        entry.node.style.removeProperty('--dshl-tw');
        entry.node.style.removeProperty('--dshl-tx');
        entry.node.style.removeProperty('--dshl-ty');
        // 宿主原本没有 style 属性时别留下一个空的
        if (entry.node.getAttribute('style') === '') entry.node.removeAttribute('style');
      }
      /*
       * **不要**在这里清源尺寸缓存。
       *
       * dispose 发生在重建投影之前（applyRelocations 先拆旧的再建新的），若在这里清缓存，
       * 紧接着的 relocateResolve 会重新量一次——而节点此刻刚从投影态恢复、宿主样式还没回流，
       * 量到的可能是被压过的宽度。那会让「框比源窄 → 放大到源宽」永远失效（框越画越窄）。
       * 缓存以节点为键、节点被 React 重建后自然失效，已经足够；这里只拆投影、不动缓存。
       */
    }


    function projectionClear() {
      for (const entry of projection.entries.values()) projectionDispose(entry);
      projection.entries.clear();
      if (projection.raf !== 0) window.cancelAnimationFrame(projection.raf);
      projection.raf = 0;
    }

    /**
     * 校正帧循环：把源节点从「原位置」推到「框的位置」。
     *
     * 为什么要循环而不是一次写完：一次定位会触发宿主重排（源被改宽 → 换行变 → 高度变），
     * 而高度又会改变「是否压住容器」的判定。这里每帧量一次真实矩形、补一次差值，
     * 差值收敛到 0.5px 以内就停帧。最多追 120 帧，避免常驻抖动。
     *
     * **位移用增量累加，不写绝对坐标**：含 transform 的祖先会让 fixed 的 containing block
     * 不是视口，那时 left:0 不等于屏幕左边，绝对赋值会整体偏移一个祖先的位置。
     * 累加「还差多少」与基准无关，两种情况都收敛到同一视觉位置。
     *
     * **纵向仍要避开窗口栏**：Electron 原生 `titleBarOverlay` 盖在 Web 层之上（本机 40px），
     * 那一带的 DOM 收得到 `elementFromPoint` 却收不到真实点击。落位阶段已经夹过，
     * 这里再夹是为了兜住「窗口栏高度变化 / 视口缩放」这类运行时变化。
     * 逻辑见 docs/details/注释/布局引擎.md。
     */
    function projectionStep() {
      projection.raf = 0;
      if (projection.entries.size === 0) return;
      projection.frames += 1;
      if (projection.frames > 120) return;
      const topBound = projectionTopBound();
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      let moving = false;
      /** 节点被 React 重建（离开文档）的条目先收集，循环结束后统一拆除（在 for...of 里删 Map 会跳过元素）。 */
      const dead = [];
      for (const entry of projection.entries.values()) {
        const node = entry.node;
        if (!node.isConnected) {
          dead.push(entry);
          continue;
        }
        const box = node.getBoundingClientRect();
        // 宽度跟框：源被改写宽度后若与期望不符（宿主样式抢优先级），每轮重新压一次
        if (Math.abs(box.width - entry.width) > 2) {
          node.style.setProperty('--dshl-tw', `${entry.width}px`);
          moving = true;
          continue;
        }
        const desiredX = Math.min(Math.max(0, entry.x), Math.max(0, viewport.width - entry.width));
        const desiredY = Math.min(Math.max(topBound, entry.y), Math.max(topBound, viewport.height - box.height));
        const dx = desiredX - box.left;
        const dy = desiredY - box.top;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          entry.tx += dx;
          entry.ty += dy;
          node.style.setProperty('--dshl-tx', `${entry.tx.toFixed(1)}px`);
          node.style.setProperty('--dshl-ty', `${entry.ty.toFixed(1)}px`);
          moving = true;
        }
      }
      for (const entry of dead) {
        projectionDispose(entry);
        projection.entries.delete(entry.sourceId);
      }
      if (moving) projection.raf = window.requestAnimationFrame(projectionStep);
    }

    function ensureProjectionLoop() {
      if (projection.raf !== 0 || projection.entries.size === 0) return;
      projection.frames = 0;
      projection.raf = window.requestAnimationFrame(projectionStep);
    }

    /** 按当前配置与识别结果同步投影：新增、变更、不再成立的搬移都在这里收敛。 */
    function applyRelocations(plan) {
      const relocate = plan !== undefined ? plan.relocate : currentPlan().relocate;
      if (snapshot.config.enabled !== true || Object.keys(relocate ?? {}).length === 0) {
        if (projection.entries.size > 0) projectionClear();
        return;
      }
      const list = relocateActiveList(snapshot.targets, { relocate });
      const next = new Map();
      for (const item of list) {
        const existing = projection.entries.get(item.sourceId);
        // 位置与宽度都没变就沿用：帧循环自己会收敛，不必重建（重建会重排一次 DOM 属性）
        if (existing !== undefined
          && existing.node === item.node
          && existing.x === item.resolved.x
          && existing.y === item.resolved.y
          && existing.width === item.resolved.width) {
          next.set(item.sourceId, existing);
          continue;
        }
        if (existing !== undefined) projectionDispose(existing);
        next.set(item.sourceId, projectionCreate(item));
      }
      for (const [sourceId, entry] of projection.entries) {
        if (!next.has(sourceId)) projectionDispose(entry);
      }
      projection.entries = next;
      ensureProjectionLoop();
    }

    /* ============================== 联动（条件规则 + 配置同步） ============================== */
    /**
     * 联动不新增运行时机制，只是把已有能力按条件叠加：
     * 条件读界面状态（页面 / 折叠 / 区域在场 / 单元在场），动作复用隐藏与容器排列，
     * 通过 computePlan 合成「基础配置 + 命中规则的叠加层」，样式与投影都只认这份 plan。
     */
    function pageKindOf(targets) {
      if (areaLive(targets, 'settings')) return 'settings';
      if (areaLive(targets, 'center')) return 'conversation';
      if (document.querySelector('[data-plugin-detail]') !== null) return 'pluginDetail';
      if ((targets.external ?? null) !== null) return 'external';
      return 'plugins';
    }

    function sidebarCollapsedNow() {
      const frame = document.querySelector('[data-dshl-frame]');
      return frame !== null && frame.hasAttribute('data-sidebar-collapsed');
    }

    /** 单元在场：侧栏块看 block 表，拆解单元看 target 表，槽位条目看注册表里的渲染状态。 */
    function unitPresent(targets, key) {
      if (typeof key !== 'string' || key.length === 0) return false;
      if (key.startsWith('block:')) return (targets.blocks?.[key.slice(6)] ?? null) !== null;
      if (key.startsWith('unit:')) return (targets.units?.[key.slice(5)] ?? []).length > 0;
      const sources = targets.slotSources ?? null;
      if (sources === null) return false;
      for (const group of sources.graph) {
        if (group.items.some((item) => item.entryKey === key && item.rendered)) return true;
      }
      return false;
    }

    function ruleMatches(when, targets) {
      if (when.kind === 'page') return when.value === 'any' || pageKindOf(targets) === when.value;
      if (when.kind === 'collapsed') return sidebarCollapsedNow() === when.value;
      if (when.kind === 'area') return areaLive(targets, when.value);
      if (when.kind === 'present') return unitPresent(targets, when.value);
      return false;
    }

    /** 基础配置 + 命中规则的叠加层；matched 记录命中的规则 id 供卡片显示状态。 */
    function computePlan(targets, config) {
      const plan = {
        hideKeys: new Set(),
        arrange: { ...(config.arrange ?? {}) },
        relocate: { ...(config.relocate ?? {}) },
        /** 命中的「切方案」规则要求的目标方案 id（同名多条时取最后一条命中的）。 */
        scheme: '',
        schemeName: '',
        matched: new Set(),
      };
      for (const rule of config.rules ?? []) {
        if (!ruleMatches(rule.when, targets)) continue;
        plan.matched.add(rule.id);
        if (rule.then.kind === 'hide') plan.hideKeys.add(rule.then.target);
        else if (rule.then.kind === 'scheme') {
          plan.scheme = rule.then.scheme;
          plan.schemeName = rule.then.schemeName ?? '';
        } else {
          const base = plan.arrange[rule.then.container];
          plan.arrange[rule.then.container] = { columns: rule.then.columns, gap: base?.gap ?? 8, compact: base?.compact === true };
        }
      }
      return plan;
    }

    /** plan 跟随 targets / config 的引用变化缓存：同一轮识别里样式与投影共用一份。 */
    let planCache = { targets: null, config: null, value: null };
    function currentPlan() {
      if (planCache.targets === snapshot.targets && planCache.config === snapshot.config) return planCache.value;
      const value = computePlan(snapshot.targets, snapshot.config);
      planCache = { targets: snapshot.targets, config: snapshot.config, value };
      return value;
    }

    /* ============================== 持久化：宿主设置文档（主）+ localStorage（缓存） ============================== */
    /**
     * 配置要跟着「用户 / 机器上的 DSH 设置」走，而不是跟着浏览器走：换浏览器、换 Web 端、清缓存
     * 都不该丢用户辛苦调好的布局（docs/plans/2026-11-08-配置跨浏览器持久化.md）。
     *
     * 分工：
     * - 主存储 = 宿主设置文档 `~/.dsh/settings.yaml` 的 `layout` 节，经 `ctx.configForms` 读写；
     *   落盘由宿主负责，同一份 DSH 安装下所有客户端读到同一份。
     * - 缓存 = localStorage：启动时先用它渲染（不必等异步读盘就闪一下默认布局），宿主读回后以宿主为准；
     *   宿主服务不可用时它就是唯一存储（降级，行为与改造前一致）。
     * - 方案表同样两层，走 `schemes` 字段。
     */
    const HOST_FORM_NAMESPACE = 'layout';
    let hostForm = null;
    /** 宿主是否可写：只读部署下不发写请求，避免无谓报错。 */
    let hostWritable = false;
    /** 宿主写入串行化：连点时不并发，也保证「写 → 读回」不乱序。 */
    let hostWriteChain = Promise.resolve();
    /**
     * 已写入值：读回到自己写的值时跳过，切断「写 → 读回 → 再写」的回环。
     *
     * 必须区分「已发出」和「宿主已确认」：`hostForm.set` 是异步的，发出后到落地之间
     * 宿主仍会推来旧快照。只比字符串挡不住——实测宿主推回的是**内容更旧的另一份文本**
     * （少了刚加的条目，长度 5401 vs 本地 5438），既不等于 lastWritten 也不等于 pending，
     * 会被判成外部改动而应用回去，表现为「点一次收纳生效，随即又被放出来」（30 次点击复现 3 次）。
     *
     * 所以判据换成「有没有写入在途」：在途期间收到的宿主快照一律不采用。
     * 有超时兜底，避免写入失败后永远吞掉宿主值。
     */
    let hostLastWritten = { document: null, schemes: null };
    let hostPending = { document: null, schemes: null };
    let hostPendingTimer = null;
    /** 写发出后多久还没被宿主确认，就放弃拦截（宿主写失败时不能让界面永远收不到外部改动）。 */
    const HOST_PENDING_TIMEOUT = 4000;
    /** 方案表版本号：宿主读回方案后让卡片重取。 */
    let layoutsVersion = 0;

    /** 取宿主配置表单并订阅；服务不在场时保持 null（此后全程走 localStorage）。 */
    function bindHostForm(ctx) {
      try {
        const forms = ctx === null || ctx === undefined ? undefined : ctx.configForms;
        if (forms === null || forms === undefined || typeof forms.get !== 'function') {
          console.warn('[dsh-layout] 宿主没有 configForms 服务，配置只存浏览器本地');
          window.__dshLayoutHostProbe = { forms: false };
          return;
        }
        hostForm = forms.get(HOST_FORM_NAMESPACE);
        if (hostForm === null || hostForm === undefined) {
          window.__dshLayoutHostProbe = { forms: true, form: false };
          return;
        }
        if (typeof hostForm.subscribe === 'function') hostForm.subscribe(consumeHostSnapshot);
        consumeHostSnapshot();
        const describe = typeof forms.describe === 'function' ? forms.describe() : null;
        const snapshotView = describe === null ? null : describe.getSnapshot();
        window.__dshLayoutHostProbe = {
          forms: true,
          form: true,
          namespaces: (snapshotView?.view?.namespaces ?? []).map((item) => item.ns).slice(0, 40),
          status: hostForm.getSnapshot()?.status,
          writable: hostForm.getSnapshot()?.writable,
          value: hostForm.getSnapshot()?.value,
        };
      } catch (error) {
        console.warn('[dsh-layout] 宿主设置表单不可用，配置退回浏览器本地存储', error);
        hostForm = null;
        window.__dshLayoutHostProbe = { error: String(error) };
      }
    }

    function consumeHostSnapshot() {
      if (hostForm === null) return;
      const snap = hostForm.getSnapshot();
      if (snap === null || snap === undefined || snap.status !== 'ready') return;
      hostWritable = snap.writable !== false;
      const value = snap.value ?? {};
      const documentText = typeof value.document === 'string' ? value.document : '';
      const schemesText = typeof value.schemes === 'string' ? value.schemes : '';
      // 宿主是空的（第一次升级到宿主存储）：把本地缓存推上去，否则用户不改任何设置就永远带不走旧配置
      if (documentText === '' || schemesText === '') {
        migrateLocalToHost(documentText === '', schemesText === '');
        return;
      }
      // 有未保存改动时，宿主推来的一律不采用：本地草稿是用户正在编辑的东西，
      // 被宿主的旧值盖掉就变成「改一下回退一下」甚至循环。显式保存之后不存在这个问题——
      // 用户按「保存」时才会写宿主，写之前宿主手里那份本来就是旧的。
      if (configIsDirty()) return;
      if (hostPending.document === null && documentText !== hostLastWritten.document) applyHostDocument(documentText);
      if (hostPending.schemes === null && schemesText !== hostLastWritten.schemes) applyHostSchemes(schemesText);
    }

    /** 一次性迁移：宿主该字段为空时，用 localStorage 里的现值填上（不覆盖宿主已有内容）。 */
    let hostMigrated = false;
    function migrateLocalToHost(fillDocument, fillSchemes) {
      if (hostMigrated) return;
      hostMigrated = true;
      if (fillDocument) {
        const cached = window.localStorage.getItem(STORAGE_KEY);
        if (cached !== null && cached !== '') {
          hostWrite('document', cached);
          console.info('[dsh-layout] 把浏览器本地布局配置迁移到宿主设置文档');
        }
      }
      if (fillSchemes) {
        const cached = window.localStorage.getItem(LAYOUTS_KEY);
        if (cached !== null && cached !== '' && cached !== '{}') {
          hostWrite('schemes', cached);
          console.info('[dsh-layout] 把浏览器本地布局方案迁移到宿主设置文档');
        }
      }
    }

    /** 宿主配置 → 界面。解析失败保留当前配置（不能让一份坏数据把界面清空）。 */
    function applyHostDocument(text) {
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (error) {
        console.warn('[dsh-layout] 宿主里的布局配置不是合法 JSON，保留当前配置', error);
        return;
      }
      const next = normalizeConfig(parsed);
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (error) { /* 缓存写失败不影响主存储 */ }
      snapshot = { ...snapshot, config: next };
      planCache = { targets: null, config: null, value: null };
      annotateStored();
      applyDynamicCss();
      applyRelocations();
      notify();
    }

    function applyHostSchemes(text) {
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (error) {
        console.warn('[dsh-layout] 宿主里的布局方案不是合法 JSON，保留当前方案表', error);
        return;
      }
      writeJsonStore(LAYOUTS_KEY, parsed);
      layoutsVersion += 1;
      notify();
    }

    /** 写宿主：只记账、异步串行发出；失败不回滚界面（本地缓存仍然有效）。 */
    function hostWrite(field, text) {
      if (hostForm === null || text === null || hostWritable !== true) return;
      hostLastWritten = { ...hostLastWritten, [field]: text };
      // 落地前的窗口期：期间的旧快照一律不采用，否则会把刚改的配置盖回去
      hostPending = { ...hostPending, [field]: text };
      if (hostPendingTimer !== null) window.clearTimeout(hostPendingTimer);
      hostPendingTimer = window.setTimeout(() => {
        hostPendingTimer = null;
        hostPending = { document: null, schemes: null };
      }, HOST_PENDING_TIMEOUT);
      hostWriteChain = hostWriteChain
        .then(() => (hostForm === null ? undefined : hostForm.set(field, text)))
        .then(() => {
          hostLastWritten = { ...hostLastWritten, [field]: text };
          // 这一笔已落地：清掉在途标记。若期间又排了新的一笔，保留它的标记。
          if (hostPending[field] === text) {
            hostPending = { ...hostPending, [field]: null };
            if (hostPending.document === null && hostPending.schemes === null && hostPendingTimer !== null) {
              window.clearTimeout(hostPendingTimer);
              hostPendingTimer = null;
            }
          }
        })
        .catch((error) => { console.warn('[dsh-layout] 写入宿主设置失败，本地缓存仍然有效', error); });
    }

    /**
     * 「切方案」动作的执行器。
     * 两个必须处理的陷阱：
     * 1. 回环：切方案会整体替换配置，而配置里就带着这条规则；直接应用会反复触发。
     *    解法是记录「上次应用发生在哪一份配置上」，同一份配置上同一目标只应用一次。
     * 2. 规则被吃掉：方案是整套配置，里面通常没有这条规则，替换后规则消失就再也不会触发。
     *    所以应用方案时先暂存当前 rules，替换后写回——规则是「触发条件」，方案是「布局内容」，两者分开。
     */
    let schemeApplied = { key: '', config: null };
    function applySchemeRule(plan) {
      if (plan.scheme === '') {
        schemeApplied = { key: '', config: null };
        return false;
      }
      if (schemeApplied.key === plan.scheme && schemeApplied.config === snapshot.config) return false;
      const state = readLayoutsNormalized();
      const entry = state.list.find((item) => item.id === plan.scheme);
      if (entry === undefined) {
        // 方案还不存在（规则先建、方案没存 / 方案被删）：记下这次尝试，避免每轮 refresh 都重扫一遍
        schemeApplied = { key: plan.scheme, config: snapshot.config };
        return false;
      }
      const rules = clone(snapshot.config.rules ?? []);
      replaceConfig(clone(entry.config));
      if (rules.length > 0 && JSON.stringify(snapshot.config.rules) !== JSON.stringify(rules)) {
        updateConfig((draft) => { draft.rules = rules; });
      }
      writeLayouts({ ...state, active: entry.id });
      schemeApplied = { key: plan.scheme, config: snapshot.config };
      return true;
    }

    /**
     * 面板导航行与插件来源条目是同一排图标：从 DOM 里取两侧的一一对应（label ↔ 条目键），
     * 开启同步后无论在哪一侧排序/隐藏，都把另一侧的配置写一致。
     */
    function panellistLinks(targets) {
      const sources = targets.slotSources ?? null;
      const out = [];
      if (sources === null) return out;
      const group = sources.graph.find((item) => item.slot === 'sidebar.panellist');
      if (group === undefined) return out;
      for (const item of group.items) {
        if (!item.rendered || item.tops.length !== 1) continue;
        const row = item.tops[0];
        const label = row.getAttribute('data-dshl-panel') ?? row.getAttribute('aria-label') ?? '';
        if (label === '') continue;
        out.push({ key: item.entryKey, label });
      }
      return out;
    }

    /**
     * 入口收纳用的「显示名 → 面板 id」表：只收有真实面板 id 的入口（从 slots 条目键反查），
     * 排除宿主的「插件」入口与「更多」这类伪行，避免把唯一的收纳入口本身藏掉。
     */
    function storagePanelIds(targets) {
      const map = new Map();
      for (const link of panellistLinks(targets)) {
        const at = link.key.indexOf('::');
        const panelId = at === -1 ? '' : link.key.slice(at + 2);
        if (panelId === '' || panelId === 'plugins') continue;
        map.set(link.label, panelId);
      }
      return map;
    }

    /* ============================== 入口收纳（分区自动发现） ============================== */
    /**
     * 收纳域 = 一个能自动发现入口的列表 + 一个原生「更多」菜单。
     * 目前三域：侧栏面板（slots: sidebar.panellist）、会话视图标签（slots: conversation.view）、
     * 右栏开始页卡片（DOM: data-sidebar-right-guide-entry）。新插件/新视图自动出现在清单里，不需要登记。
     */
    const STORED_VIEW_ATTR = 'data-dshl-stored-view';
    const STORED_GUIDE_ATTR = 'data-dshl-stored-guide';
    const STORED_SECTION_ATTR = 'data-dshl-stored-section';
    const STORED_BUTTON_ATTR = 'data-dshl-stored-button';
    /** 开始页卡片的宿主属性：值就是入口 kind，同一时刻唯一（docs/plans/2026-11-08-身份键收口.md）。 */
    const GUIDE_ENTRY_ATTR = 'data-sidebar-right-guide-entry';
    /** 槽位包装组件与 HOC：每个条目外面都有，组件名对身份没有区分度。 */
    const IDENTITY_NOISE = new Set(['SessionEntry', 'StrictSessionEntry', 'SlotErrorBoundary', 'SlotOutlet', 'RootEntry', 'Fragment', 'Suspense', 'Boundary', 'ErrorBoundary', 'Provider', 'Consumer']);

    /** 自身或附近祖先上的槽位条目标记：部分槽位把标记打在条目包裹层上（如设置页页头操作）。 */
    function slotEntryOf(node) {
      let current = node;
      for (let depth = 0; depth < 3 && current !== null && current !== undefined; depth += 1) {
        if (typeof current.getAttribute !== 'function') break;
        const value = current.getAttribute(SLOT_ENTRY_ATTR);
        if (typeof value === 'string' && value !== '') return value;
        current = current.parentElement;
      }
      return '';
    }

    /** 最近的 React 列表 key：宿主渲染槽位条目与列表项时用的条目 id，不随显示文案变化。 */
    function fiberKeyOf(node) {
      const fiberKey = Object.keys(node).find((name) => name.startsWith('__reactFiber$'));
      let fiber = fiberKey === undefined ? null : node[fiberKey];
      for (let depth = 0; depth < 12 && fiber !== null && fiber !== undefined; depth += 1) {
        if (typeof fiber.key === 'string' && fiber.key !== '') return fiber.key;
        fiber = fiber.return;
      }
      return '';
    }

    /** 最近的业务组件名：按钮既没有槽位键也没有列表 key 时，用宿主定义它的组件名兜底。 */
    function bizComponentOf(node) {
      const fiberKey = Object.keys(node).find((name) => name.startsWith('__reactFiber$'));
      let fiber = fiberKey === undefined ? null : node[fiberKey];
      for (let depth = 0; depth < 16 && fiber !== null && fiber !== undefined; depth += 1) {
        const type = fiber.type;
        if (typeof type === 'function') {
          const name = type.displayName ?? type.name ?? '';
          if (/^[A-Z][A-Za-z0-9]{3,}$/.test(name) && !IDENTITY_NOISE.has(name)) return name;
        }
        fiber = fiber.return;
      }
      return '';
    }

    /** DOM 元素在宿主里的稳定身份；取不到的部分是空串。 */
    function stableIdentityOf(node, options) {
      if (node === null || node === undefined) return { slotEntry: '', fiberKey: '', component: '' };
      return {
        slotEntry: slotEntryOf(node),
        fiberKey: fiberKeyOf(node),
        component: options !== null && options !== undefined && options.component === true ? bizComponentOf(node) : '',
      };
    }

    /** 配置里的身份键与 DOM 身份是否同一项：完整槽位键与 `槽位::id` 的后段都认。 */
    function identityMatches(id, identity) {
      if (typeof id !== 'string' || id === '') return false;
      if (identity.slotEntry !== '') {
        if (id === identity.slotEntry) return true;
        const at = identity.slotEntry.indexOf('::');
        if (at !== -1 && id === identity.slotEntry.slice(at + 2)) return true;
      }
      if (identity.fiberKey !== '' && (id === identity.fiberKey || id === `fiber:${identity.fiberKey}`)) return true;
      if (identity.component !== '' && id === `comp:${identity.component}`) return true;
      return false;
    }

    /**
     * 收纳条目的身份：稳定 id 优先；早期只有显示名的条目退回 kind+label。
     *
     * 注意必须判「非空字符串」而不是 `!== ''`：收纳域里的入口条目来源不止配置，
     * 还有运行时发现的（`readPluginCards` / `readButtonEntries` 等），它们多数没有 `id` 字段，
     * 值是 `undefined`。`undefined !== ''` 为真 → 直接返回 `undefined` → 这类条目互相全等，
     * 结果整张收纳表都显示成「已收纳」（实测 70+ 条误显示为已开启，而配置里是空的）。
     */
    function storageKeyOf(entry) {
      if (typeof entry.id === 'string' && entry.id !== '') return entry.id;
      return `${entry.kind ?? ''}\u0000${entry.label}`;
    }

    function sameStorageEntry(left, right) {
      return storageKeyOf(left) === storageKeyOf(right);
    }

    function resolveLabelText(label) {
      if (typeof label === 'function') {
        try {
          return String(label());
        } catch (error) {
          return null;
        }
      }
      return typeof label === 'string' ? label : null;
    }

    /** 会话视图标签：从 conversation.view 槽位条目自动发现（宿主固定显示 chat，不参与收纳）。 */
    function readViewEntries() {
      if (slotsService === null) return [];
      let entries = [];
      try {
        entries = slotsService.entries('conversation.view');
      } catch (error) {
        entries = [];
      }
      const out = [];
      for (const entry of entries) {
        const id = entry?.options?.id;
        if (typeof id !== 'string' || id.length === 0 || id === 'chat') continue;
        out.push({ id, label: resolveLabelText(entry.options?.label) ?? id });
      }
      return out;
    }

    /** 右栏开始页卡片：宿主不暴露条目列表，从 DOM 自动发现；身份就是卡片属性里的 kind（同一时刻唯一）。 */
    function guideLabelOf(node) {
      const title = node.querySelector('[class*="entryTitle"]');
      return ((title === null ? node.textContent : title.textContent) ?? '').trim().slice(0, 60);
    }

    function readGuideEntries() {
      const out = [];
      for (const node of document.querySelectorAll(`[${GUIDE_ENTRY_ATTR}]`)) {
        const kind = node.getAttribute(GUIDE_ENTRY_ATTR) ?? '';
        // 文件（files）是宿主保留的兜底入口：收起后没有可用的「更多」能回到它，不参与收纳
        if (kind === '' || kind === 'files') continue;
        const label = guideLabelOf(node);
        if (label === '') continue;
        if (out.some((entry) => entry.id === kind)) continue;
        out.push({ kind, label, id: kind });
      }
      return out;
    }

    /** 设置页导航：从 settings.section 槽位条目自动发现（导航行按显示名对应）。 */
    function readSettingsSections() {
      if (slotsService === null) return [];
      let entries = [];
      try {
        entries = slotsService.entries('settings.section');
      } catch (error) {
        entries = [];
      }
      const out = [];
      for (const entry of entries) {
        const id = entry?.options?.id;
        if (typeof id !== 'string' || id.length === 0) continue;
        out.push({ id, label: resolveLabelText(entry.options.label) ?? id });
      }
      return out;
    }

    /** 插件页第三方插件：DOM 自动发现（bundles 分组里的卡片，标题取卡片打开按钮文本）。 */
    function readPluginCards() {
      const group = document.querySelector('[data-plugin-group="bundles"]');
      if (group === null) return [];
      const out = [];
      for (const card of group.querySelectorAll('[data-plugin-package]')) {
        const id = card.getAttribute('data-plugin-package') ?? '';
        if (id === '') continue;
        const title = card.querySelector('button[class*="cardOpen"]');
        const label = ((title === null ? card.textContent : title.textContent) ?? '').trim().slice(0, 60);
        if (label === '') continue;
        out.push({ id, label });
      }
      return out;
    }

    /** 按钮的显示名：只用于展示与旧配置的 `label:` 键回退。 */
    function buttonLabelOf(button) {
      return (button.getAttribute('aria-label') ?? button.textContent ?? '').trim().slice(0, 60);
    }

    /** 按钮的收纳身份：槽位条目键（含祖先包裹层）→ 列表 key → 业务组件名 → 显示名。 */
    function buttonEntryIdOf(button, label) {
      const identity = stableIdentityOf(button, { component: true });
      if (identity.slotEntry !== '') return identity.slotEntry;
      if (identity.fiberKey !== '') return `fiber:${identity.fiberKey}`;
      if (identity.component !== '') return `comp:${identity.component}`;
      return `label:${label}`;
    }

    /** 按钮类入口（会话头工具行 / 设置页页头操作）：容器里的按钮自动发现，身份不依赖显示名；宿主「更多操作」是收纳入口本身，不参与。 */
    function readButtonEntries(outletSelector) {
      const outlet = document.querySelector(outletSelector);
      const container = outlet === null ? null : outlet.parentElement;
      if (container === null) return [];
      const out = [];
      for (const button of container.querySelectorAll('button')) {
        if (button.hasAttribute('data-dshl-grant-anchor')) continue;
        if (isHostMoreButton(button)) continue;
        const label = buttonLabelOf(button);
        if (label === '') continue;
        const id = buttonEntryIdOf(button, label);
        if (out.some((entry) => entry.id === id)) continue;
        out.push({ id, label });
      }
      return out;
    }

    function buttonZoneContainer(zone) {
      const selector = zone === 'headerUtilities' ? '[data-slot="conversation.session.header.utilities"]' : '[data-slot="settings.action"]';
      const outlet = document.querySelector(selector);
      return outlet === null ? null : outlet.parentElement;
    }

    /** 当前收纳域可发现的入口清单。 */
    function readStorageZones(targets) {
      const sidebar = [];
      const seen = new Set();
      for (const link of panellistLinks(targets)) {
        const at = link.key.indexOf('::');
        const id = at === -1 ? '' : link.key.slice(at + 2);
        if (id === '' || id === 'plugins' || seen.has(id)) continue;
        seen.add(id);
        sidebar.push({ id, label: link.label });
      }
      return {
        sidebar,
        views: readViewEntries(),
        guide: readGuideEntries(),
        settings: readSettingsSections(),
        plugins: readPluginCards(),
        headerUtilities: readButtonEntries('[data-slot="conversation.session.header.utilities"]'),
        settingsActions: readButtonEntries('[data-slot="settings.action"]'),
      };
    }

    /** 收纳条目的匹配：稳定身份优先；id 为空的早期条目退回显示名。 */
    function findStoredFor(stored, identity, label) {
      for (const entry of stored) {
        if (entry.id !== '') {
          if (identityMatches(entry.id, identity)) return entry;
          continue;
        }
        if (entry.label === label) return entry;
      }
      return null;
    }

    /** 收纳标记：按宿主稳定身份匹配后打属性（显示名只兜底旧条目），样式按属性收起；配置变少时撤掉旧标记。 */
    const storedAnnotated = new Set();
    function annotateStored() {
      const config = snapshot.config;
      const done = new Set();
      const viewStored = config.storage?.views ?? [];
      const guideStored = config.storage?.guide ?? [];
      const sectionStored = config.storage?.settings ?? [];
      for (const node of document.querySelectorAll('[data-conversation-tabs] button')) {
        const hit = findStoredFor(viewStored, stableIdentityOf(node, null), (node.textContent ?? '').trim());
        if (hit === null) continue;
        mark(node, STORED_VIEW_ATTR, hit.id);
        done.add(node);
      }
      for (const node of document.querySelectorAll(`[${GUIDE_ENTRY_ATTR}]`)) {
        const kind = node.getAttribute(GUIDE_ENTRY_ATTR) ?? '';
        const label = guideLabelOf(node);
        const hit = guideStored.find((entry) => {
          const key = entry.id !== '' ? entry.id : (entry.kind ?? '');
          if (key !== '') return key === kind;
          return entry.label === label;
        });
        if (hit === undefined) continue;
        mark(node, STORED_GUIDE_ATTR, hit.id !== '' ? hit.id : (hit.kind ?? ''));
        done.add(node);
      }
      for (const cell of document.querySelectorAll('[data-dshl-unit="set-nav"] button')) {
        const hit = findStoredFor(sectionStored, stableIdentityOf(cell, null), (cell.textContent ?? '').trim());
        if (hit === null) continue;
        mark(cell, STORED_SECTION_ATTR, hit.id);
        done.add(cell);
      }
      // 按钮类入口：按槽位条目键 / 列表 key / 组件名匹配容器里的按钮，旧 `label:` 键仍按显示名
      for (const zone of ['headerUtilities', 'settingsActions']) {
        const storedButtons = config.storage?.[zone] ?? [];
        if (storedButtons.length === 0) continue;
        const container = buttonZoneContainer(zone);
        if (container === null) continue;
        for (const button of container.querySelectorAll('button')) {
          if (button.hasAttribute('data-dshl-grant-anchor')) continue;
          if (isHostMoreButton(button)) continue;
          const label = buttonLabelOf(button);
          const identity = stableIdentityOf(button, { component: true });
          const hit = storedButtons.find((entry) => {
            if (entry.id === '') return entry.label === label;
            if (entry.id.startsWith('label:')) return entry.id === `label:${label}`;
            return identityMatches(entry.id, identity);
          });
          if (hit === undefined) continue;
          mark(button, STORED_BUTTON_ATTR, `${zone}:${hit.id}`);
          done.add(button);
        }
      }
      for (const node of storedAnnotated) {
        if (done.has(node) || node.isConnected !== true) continue;
        node.removeAttribute(STORED_VIEW_ATTR);
        node.removeAttribute(STORED_GUIDE_ATTR);
        node.removeAttribute(STORED_SECTION_ATTR);
        node.removeAttribute(STORED_BUTTON_ATTR);
      }
      storedAnnotated.clear();
      for (const node of done) storedAnnotated.add(node);
    }

    /** 「更多操作」按钮打标记：全局捕获监听靠它认出锚点，宿主重建元素后由每轮注解补上。 */
    const hostMoreMarked = new Set();
    function annotateHostMore() {
      const button = hostMoreButtonOf();
      const done = new Set();
      if (button !== null) {
        mark(button, 'data-dshl-morehost', '1');
        done.add(button);
      }
      for (const node of hostMoreMarked) {
        if (!done.has(node) && node.isConnected) node.removeAttribute('data-dshl-morehost');
      }
      hostMoreMarked.clear();
      for (const node of done) hostMoreMarked.add(node);
    }


    function syncSlotsFromPanelOrder(draft, links) {
      for (const link of links) delete draft.slots.order[link.key];
      for (const link of links) {
        const at = draft.sidebar.panelOrder.indexOf(link.label);
        if (at >= 0) draft.slots.order[link.key] = at;
      }
    }

    function syncPanelFromSlots(draft, links) {
      const ordered = links
        .filter((link) => Object.hasOwn(draft.slots.order, link.key))
        .sort((left, right) => draft.slots.order[left.key] - draft.slots.order[right.key]);
      if (ordered.length === 0) return;
      const rest = draft.sidebar.panelOrder.filter((label) => !ordered.some((link) => link.label === label));
      draft.sidebar.panelOrder = [...ordered.map((link) => link.label), ...rest];
    }

    function syncSlotsHidden(draft, links, label, hidden) {
      const link = links.find((item) => item.label === label);
      if (link === undefined) return;
      const set = new Set(draft.slots.hide);
      if (hidden) set.add(link.key);
      else set.delete(link.key);
      draft.slots.hide = [...set];
    }

    function syncPanelsHidden(draft, links, entryKey, hidden) {
      const link = links.find((item) => item.key === entryKey);
      if (link === undefined) return;
      const set = new Set(draft.sidebar.panelHidden);
      if (hidden) set.add(link.label);
      else set.delete(link.label);
      draft.sidebar.panelHidden = [...set];
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
      const targets = { ok, frame, regions, sidebarRoot, blocks, sidebarParts, panels, conversation, convParts, headerParts, composerParts, messagesParts, rightbarParts, settingsParts, settings, external: externalPage, units: {}, surfaces: [], anomalies: [], areaSnapshots, areaSnapshotVersion: 0, slotSources: null };
      targets.units = collectPartUnits(targets);
      recordAreaSnapshots(targets);
      targets.areaSnapshots = areaSnapshots;
      targets.areaSnapshotVersion = areaSnapshotVersion;
      targets.slotSources = slotsService === null ? null : scanSlots();
      targets.arrange = readArrangeContainers(targets);
      targets.storageZones = readStorageZones(targets);
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
      annotateArrange(targets);
      annotateStored();
      annotateHostMore();
    }

    function refresh() {
      // 槽位条目先打标记：收纳发现与插件来源都按 `data-dshl-slotentry` 读取，晚一步会拿到上一轮的旧标记
      annotateSlotEntries();
      const targets = readTargets();
      annotate(targets);
      setTargets(targets);
      // 白板骨架数据：每轮 refresh 都可能带上新页面，按间隔节流后落盘
      recordBoardGeometry(targets, false);
      // 识别结果可能没变（签名相同、不重绘），但联动条件可能变了（页面、折叠、条目在场），样式与投影每轮重算一次
      applyDynamicCss();
      // 「切方案」规则要在样式与投影之前生效：它会替换整套配置，后续两步必须按新配置算
      if (applySchemeRule(currentPlan())) {
        applyDynamicCss();
      }
      applyRelocations();
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
.dshl-tabs { display:flex; gap:2px; flex-wrap:wrap; border-bottom:1px solid var(--dsw-alias-border-l2); }
.dshl-tab { appearance:none; border:none; background:transparent; color:var(--dsw-alias-label-secondary); font:inherit; font-size:13px; line-height:20px; padding:8px 12px 9px; border-radius:8px 8px 0 0; cursor:pointer; position:relative; display:inline-flex; align-items:center; gap:4px; }
.dshl-tab:hover { background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-primary); }
.dshl-tab[data-active="true"] { color:var(--dsw-alias-brand-primary); font-weight:600; }
.dshl-tab[data-active="true"]:after { content:''; position:absolute; left:8px; right:8px; bottom:-1px; height:2px; border-radius:2px 2px 0 0; background:var(--dsw-alias-brand-primary); }
.dshl-tabBadge { font-size:10px; line-height:16px; min-width:16px; padding:0 4px; border-radius:999px; text-align:center; background:var(--dsw-alias-state-error-secondary, rgba(229,72,77,.16)); color:var(--dsw-alias-state-error-primary, #e5484d); }
.dshl-tabPanel { padding-top:12px; }
.dshl-tabHint { margin-top:-4px; }
.dshl-controlRow { display:flex; flex-wrap:wrap; gap:10px 28px; align-items:center; }
.dshl-control { display:flex; align-items:center; gap:8px; }
.dshl-control .dshl-rowLabel { font-size:13px; }
.dshl-tabPanel[data-tab="structure"] .dshl-cards { grid-template-columns:minmax(0, 640px); justify-content:center; }
.dshl-tabPanel[data-tab="sidebar"] .dshl-cards { grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); }
.dshl-tabPanel[data-tab="areas"] .dshl-cards { grid-template-columns:repeat(auto-fit, minmax(340px, 1fr)); }
.dshl-tabPanel[data-tab="recognition"] .dshl-cards { grid-template-columns:minmax(0, 1fr); }
.dshl-tabPanel[data-tab="arrange"] .dshl-cards { grid-template-columns:minmax(0, 680px); justify-content:center; }
.dshl-tabPanel[data-tab="storage"] .dshl-cards { grid-template-columns:minmax(0, 640px); justify-content:center; }
.dshl-arrangeRow { display:flex; flex-direction:column; gap:6px; padding:8px 10px; border-radius:var(--dsw-radius-md, 8px); background:var(--dsw-alias-bg-layer-2); }
.dshl-arrangeRow[data-offline="true"] { opacity:.6; }
.dshl-arrangeHead { display:flex; align-items:center; gap:8px; }
.dshl-arrangeName { flex:1; min-width:0; font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.dshl-arrangeCtl { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.dshl-arrangeCtl .dshl-chip { height:24px; padding:0 9px; font-size:11px; }
.dshl-select { height:28px; padding:0 6px; border-radius:8px; border:1px solid var(--dsw-alias-border-l1); background:var(--dsw-alias-bg-layer-2); color:var(--dsw-alias-label-primary); font:inherit; font-size:12px; min-width:0; }
.dshl-relocateForm { display:grid; grid-template-columns:repeat(auto-fit, minmax(132px, 1fr)); gap:8px; align-items:end; }
.dshl-relocateField { display:flex; flex-direction:column; gap:4px; min-width:0; font-size:12px; color:var(--dsw-alias-label-secondary); }
.dshl-relocateRow { display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:var(--dsw-radius-md, 8px); background:var(--dsw-alias-bg-layer-2); }
.dshl-relocateRow[data-squeezed="true"] { border:1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary) 55%, transparent); }
.dshl-relocateState { flex:none; font-size:11px; color:var(--dsw-alias-label-secondary); }
.dshl-relocateState[data-active="true"] { color:var(--dsw-alias-state-success-primary); }
/* 形状不适配警告：搬过去能「生效」但内容会被压没，行上直接说明压缩比 */
.dshl-relocateFitWarn { flex:none; font-size:11px; color:var(--dsw-alias-state-warn-primary); }
/* 画框中间层：全屏捕捉鼠标，压暗界面但保留可辨认度；框本身反向提亮，一眼看出会盖住什么 */
/* 压暗交给主框的 9999px 投影：它天然把「框内」留亮、「框外」压暗，一眼看出框住了什么。
   framer 自己不上底色，否则框内也被压一层，反而看不出选了哪块内容。 */
.dshl-framer { position:fixed; inset:0; z-index:1300; cursor:crosshair; }
/* 压暗只由主框负责（一框一层遮罩）。多个框各带 9999px 投影会叠加成好几层，越拖越黑。 */
.dshl-frameRect { position:absolute; border:1px solid var(--dsw-alias-brand-primary); background:color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent); pointer-events:none; }
.dshl-frameRect:not([data-preview]) { box-shadow:0 0 0 9999px color-mix(in srgb, var(--dsw-alias-bg-layer-1, #111) 14%, transparent); }
/* 落位影子：自动让位后的真实位置。虚线 + 无底色，与用户画的框区分开 */
.dshl-frameRect[data-preview="true"] { border-style:dashed; background:transparent; border-color:color-mix(in srgb, var(--dsw-alias-state-success-primary, #2fb37a) 80%, transparent); }
/* 右边缘改宽抓手：静默时只有一条细线，hover 变宽，提示「这里能拖」 */
.dshl-frameGrip { position:absolute; width:6px; height:28px; border-radius:3px; background:color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent); cursor:ew-resize; pointer-events:none; }
.dshl-frameHint { position:absolute; left:50%; transform:translateX(-50%); top:calc(var(--dshl-framer-top, 48px)); max-width:min(560px, calc(100vw - 32px)); padding:8px 12px; border-radius:10px; border:1px solid var(--dsw-alias-border-l2); background:color-mix(in srgb, var(--dsw-alias-bg-layer-1) 96%, transparent); color:var(--dsw-alias-label-primary); font-size:12px; line-height:18px; box-shadow:0 6px 20px rgba(0,0,0,.28); pointer-events:none; }
.dshl-frameUsage { color:var(--dsw-alias-label-secondary); }
.dshl-frameCtl { display:flex; align-items:center; gap:8px; margin-top:8px; pointer-events:auto; }
[data-dshl-teleport] { position:fixed !important; left:0 !important; top:0 !important; right:auto !important; bottom:auto !important; margin:0 !important; z-index:1100 !important; width:var(--dshl-tw, auto) !important; max-width:none !important; box-sizing:border-box; transform:translate(var(--dshl-tx, 0px), var(--dshl-ty, 0px)) !important; }
.dshl-storageMenuItem { display:flex; align-items:center; gap:8px; width:100%; padding:8px 12px; border:none; background:transparent; color:var(--dsw-alias-label-primary); font:inherit; font-size:13px; line-height:20px; text-align:left; border-radius:var(--dsw-radius-md, 8px); cursor:pointer; }
.dshl-storageMenuItem:hover { background:var(--dsw-alias-interactive-bg-hover); }
.dshl-storageMenuItem[data-current="true"] { color:var(--dsw-alias-brand-primary); }
.dshl-search { display:flex; align-items:center; gap:4px; }
.dshl-input { flex:1; min-width:0; height:28px; padding:0 8px; border-radius:8px; border:1px solid var(--dsw-alias-border-l1); background:var(--dsw-alias-bg-layer-2); color:var(--dsw-alias-label-primary); font:inherit; font-size:12px; }
.dshl-input::placeholder { color:var(--dsw-alias-label-secondary); }
.dshl-input:focus { outline:none; border-color:var(--dsw-alias-brand-primary); }
.dshl-input::-webkit-search-cancel-button { display:none; }
.dshl-inputInline { flex:1; min-width:0; height:26px; }
.dshl-moreDivider { flex:none; height:1px; margin:4px 8px; background:var(--dsw-alias-border-l1); }
.dshl-grantFallback { display:inline-flex; align-items:center; gap:6px; height:28px; padding:0 10px; border-radius:8px; border:1px solid var(--dsw-alias-border-l1); background:transparent; color:var(--dsw-alias-label-secondary); font:inherit; font-size:12px; cursor:pointer; }
.dshl-grantFallback:hover { background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-primary); }
.dshl-card { border:1px solid var(--dsw-alias-border-l1); border-radius:var(--dsw-radius-lg, 12px); background:var(--dsw-alias-bg-layer-1); padding:12px; display:flex; flex-direction:column; gap:10px; min-width:0; }
.dshl-cardHead { display:flex; flex-direction:column; gap:2px; }
.dshl-cardTitle { font-size:13px; font-weight:600; }
.dshl-cardDesc { font-size:11px; line-height:17px; color:var(--dsw-alias-label-secondary); }
.dshl-row { display:flex; align-items:center; gap:8px; min-height:28px; }
.dshl-rowLabel { flex:1; min-width:0; font-size:12px; }
.dshl-num { font-size:11px; color:var(--dsw-alias-label-secondary); min-width:46px; text-align:right; font-variant-numeric:tabular-nums; }
.dshl-slider { width:100%; margin:0; accent-color:var(--dsw-alias-brand-primary); height:16px; }
/* 开关：视觉 32×18，热区靠伪元素外扩到 32×24（::before 覆盖整个可点范围）。
   直接把元素撑到 24 会改变卡片里的行高与对齐，所以用伪元素扩热区而不改视觉盒。 */
.dshl-switch { position:relative; width:32px; height:18px; flex:none; border-radius:999px; border:1px solid var(--dsw-alias-border-l2); background:var(--dsw-alias-bg-layer-2); padding:0; cursor:pointer; transition:background .15s; }
.dshl-switch:before { content:''; position:absolute; left:-2px; right:-2px; top:-4px; bottom:-4px; border-radius:999px; }
.dshl-switch:after { content:''; position:absolute; top:2px; left:2px; width:12px; height:12px; border-radius:50%; background:var(--dsw-alias-label-secondary); transition:transform .15s, background .15s; }
.dshl-switch[aria-checked="true"] { background:var(--dsw-alias-brand-primary); border-color:var(--dsw-alias-brand-primary); }
.dshl-switch[aria-checked="true"]:after { transform:translateX(14px); background:var(--dsw-alias-bg-layer-1, #111); }
.dshl-list { display:flex; flex-direction:column; gap:4px; }
.dshl-listScroll { max-height:228px; overflow-y:auto; padding-right:2px; }
.dshl-item { display:flex; align-items:center; gap:6px; padding:4px 6px; border-radius:var(--dsw-radius-md, 8px); background:var(--dsw-alias-bg-layer-2); border:1px solid transparent; }
.dshl-item[data-dragover="true"] { border-color:var(--dsw-alias-brand-primary); }
.dshl-itemHandle { cursor:grab; color:var(--dsw-alias-label-secondary); display:inline-flex; flex:none; }
.dshl-itemLabel { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:12px; }
.dshl-item[data-active="true"] { border-color:var(--dsw-alias-brand-primary); background:color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, var(--dsw-alias-bg-layer-2)); }
.dshl-surfaceGroup { display:flex; flex-direction:column; gap:4px; }
.dshl-surfaceGroupTitle { font-size:11px; line-height:16px; color:var(--dsw-alias-label-secondary); }
/* 可折叠分组标题：整行可点，默认折叠。12 个槽位全展开有 92 行、占三屏。 */
.dshl-groupToggle { display:flex; align-items:center; gap:4px; width:100%; min-height:22px; padding:2px 4px; margin-left:-4px; border:none; border-radius:6px; background:transparent; color:var(--dsw-alias-label-secondary); font:inherit; font-size:11px; line-height:16px; text-align:left; cursor:pointer; }
.dshl-groupToggle:hover { background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-primary); }
.dshl-groupToggle svg { flex:none; }
.dshl-groupToggleLabel { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.dshl-groupToggle[data-open="true"] { color:var(--dsw-alias-label-primary); }
.dshl-surfaceGroup[data-open="true"], .dshl-groupToggle[data-open="true"] { color:var(--dsw-alias-label-primary); }
/* 入口收纳的七个分区：每区一块、块间有分隔线，标题行同时是折叠按钮。
   原来七区连成一串、每区各带独立滚动框，看不出边界，嵌套感也重。 */
.dshl-zoneList { display:flex; flex-direction:column; gap:0; }
.dshl-zone { display:flex; flex-direction:column; border-top:1px solid var(--dsw-alias-border-l1); }
.dshl-zone:first-child { border-top:none; }
.dshl-zoneHead { display:flex; align-items:center; gap:6px; width:100%; min-height:30px; padding:5px 4px; margin:0; border:none; border-radius:6px; background:transparent; color:var(--dsw-alias-label-secondary); font:inherit; font-size:12px; text-align:left; cursor:pointer; }
.dshl-zoneHead:hover { background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-primary); }
.dshl-zoneHead svg { flex:none; }
.dshl-zone[data-open="true"] .dshl-zoneHead { color:var(--dsw-alias-label-primary); font-weight:600; }
.dshl-zoneTitle { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.dshl-zoneCount { flex:none; font-size:11px; font-variant-numeric:tabular-nums; color:var(--dsw-alias-label-secondary); }
.dshl-zoneList .dshl-zoneList { padding:0 0 4px 17px; }
.dshl-zoneEmpty { margin:0 0 6px 17px; }
.dshl-surfaceDot { width:6px; height:6px; border-radius:50%; flex:none; background:var(--dsw-alias-label-secondary); opacity:.45; }
.dshl-surfaceDot[data-on="true"] { opacity:1; background:var(--dsw-alias-state-success-primary); }
.dshl-surfaceDot[data-on="true"][data-source="official"] { background:var(--dsw-alias-brand-primary); }
.dshl-surfaceDot[data-on="true"][data-source="third"] { background:var(--dsw-alias-state-warn-primary); }
.dshl-itemSub { font-size:11px; color:var(--dsw-alias-label-secondary); flex:none; }
.dshl-itemCtl { display:inline-flex; align-items:center; gap:2px; flex:none; margin-left:2px; }
/* 图标按钮：视觉 22×22，热区靠伪元素外扩到 26×26 */
.dshl-iconBtn { position:relative; width:22px; height:22px; flex:none; display:inline-flex; align-items:center; justify-content:center; padding:0; border:none; border-radius:4px; background:transparent; color:var(--dsw-alias-label-secondary); cursor:pointer; }
.dshl-iconBtn:before { content:''; position:absolute; inset:-2px; border-radius:6px; }
.dshl-iconBtn:hover { background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-primary); }
.dshl-iconBtn:disabled { opacity:.3; cursor:default; }
.dshl-btn { height:28px; padding:0 12px; border-radius:var(--dsw-radius-md, 8px); border:1px solid var(--dsw-alias-border-l1); background:transparent; color:var(--dsw-alias-label-primary); font-size:12px; font-family:inherit; cursor:pointer; }
.dshl-btn:hover { background:var(--dsw-alias-interactive-bg-hover); }
.dshl-btn[data-primary="true"] { background:var(--dsw-alias-brand-primary); border-color:var(--dsw-alias-brand-primary); color:var(--dsw-alias-bg-layer-1, #111); }
.dshl-btn[data-primary="true"]:hover { filter:brightness(1.08); }
/* 禁用态：按钮本来就置灰，但 :hover 仍会亮起来，看着像能点。 */
.dshl-btn:disabled { opacity:.4; cursor:default; }
.dshl-btn:disabled:hover { background:transparent; }
.dshl-btn[data-primary="true"]:disabled:hover { filter:none; }
.dshl-hint { font-size:11px; line-height:17px; color:var(--dsw-alias-label-secondary); }
.dshl-message { font-size:11px; color:var(--dsw-alias-state-success-primary); }
.dshl-message[data-error="true"] { color:var(--dsw-alias-state-error-primary); }
.dshl-field { display:flex; flex-direction:column; gap:4px; }
.dshl-fieldHead { display:flex; align-items:center; justify-content:space-between; font-size:12px; color:var(--dsw-alias-label-secondary); }
.dshl-divider { height:1px; background:var(--dsw-alias-border-l1); }
.dshl-editLayer { position:absolute; inset:0; pointer-events:none; z-index:40; }
.dshl-editBox { position:absolute; border:1px dashed color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent); border-radius:6px; pointer-events:none; }
.dshl-editBox[data-dim="true"] { border-color:var(--dsw-alias-border-l2); }
.dshl-editTag { position:absolute; top:5px; left:8px; font-size:11px; line-height:16px; padding:1px 7px; border-radius:999px; background:var(--dsw-alias-brand-primary); color:var(--dsw-alias-bg-layer-1, #111); pointer-events:auto; cursor:pointer; user-select:none; }
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
/* 面板外壳用 layer-2 而不是 bg-overlay：overlay 是中灰 #61666b，比卡片还亮两个层级，
   层次会倒过来；宿主设置弹层也用 layer-2，这里跟它对齐。 */
.dshl-panel { position:fixed; top:52px; bottom:16px; z-index:1250; width:min(480px, calc(100vw - 32px)); display:flex; flex-direction:column; border-radius:16px; border:1px solid var(--dsw-alias-border-l2); background:var(--dsw-alias-bg-layer-2); box-shadow:0 16px 40px rgba(0,0,0,.28); pointer-events:auto; color:var(--dsw-alias-label-primary); overflow:hidden; font-size:13px; line-height:20px; }
/* 白板加载中 / 加载失败的兜底层：与白板同层，不留白屏也不挡住恢复通道 */
.dshl-boardFallback { position:fixed; inset:0; z-index:1260; display:flex; align-items:center; justify-content:center; padding:24px; background:color-mix(in srgb, var(--dsw-alias-bg-overlay, #1b1b1f) 88%, transparent); color:var(--dsw-alias-label-primary); pointer-events:auto; }
.dshl-boardFallbackBox { display:flex; flex-direction:column; gap:10px; max-width:420px; padding:16px; border-radius:12px; border:1px solid var(--dsw-alias-border-l2); background:var(--dsw-alias-bg-layer-1); }
.dshl-boardFallbackBox p { margin:0; font-size:13px; line-height:20px; }
.dshl-panel[data-side="right"] { right:16px; }
.dshl-panel[data-side="left"] { left:16px; }
/* 四段骨架：头 / 工具区 / 分页条 / 滚动正文 / 底栏。
   工具区与分页条固定在面板上，只有正文滚——否则滚到深处就没有导航了（实测分页条会滚到 y=-210）。 */
.dshl-panelHead { display:flex; align-items:center; gap:6px; padding:8px 8px 8px 12px; border-bottom:1px solid var(--dsw-alias-border-l1); flex:none; }
.dshl-panelTitle { font-size:13px; font-weight:600; white-space:nowrap; }
.dshl-panelPage { flex:1; min-width:0; font-size:11px; line-height:16px; color:var(--dsw-alias-label-secondary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:right; }
.dshl-panelTool { flex:none; display:flex; align-items:center; gap:8px; flex-wrap:wrap; padding:8px 12px; border-bottom:1px solid var(--dsw-alias-border-l1); }
.dshl-panelTool .dshl-presets { flex:1 1 100%; gap:4px; }
.dshl-panelTool .dshl-presetsLabel { font-size:11px; }
.dshl-panelTool .dshl-controlRow { gap:8px 16px; flex:1 1 100%; }
.dshl-panelTool .dshl-control .dshl-rowLabel { font-size:12px; }
.dshl-panelTool .dshl-chip { height:24px; padding:0 9px; font-size:11px; }
.dshl-panelTool .dshl-btn { height:26px; padding:0 10px; }
.dshl-panelTabs { flex:none; padding:0 12px; }
.dshl-panelBody { flex:1; min-height:0; overflow-y:auto; padding:12px; font-size:13px; line-height:20px; color:var(--dsw-alias-label-primary); }
.dshl-panelFoot { flex:none; display:flex; align-items:center; gap:8px; flex-wrap:wrap; padding:8px 12px; border-top:1px solid var(--dsw-alias-border-l1); }
.dshl-panelFoot .dshl-message { flex:1 1 100%; }
.dshl-panel .dshl-cards { grid-template-columns:minmax(0,1fr); gap:10px; }
.dshl-panel .dshl-tabs { flex-wrap:nowrap; overflow-x:auto; scrollbar-width:none; }
.dshl-panel .dshl-tabs::-webkit-scrollbar { display:none; }
.dshl-panel .dshl-tab { padding:8px 8px 9px; font-size:12px; flex:none; }
.dshl-panel .dshl-tabPanel { padding-top:10px; }
.dshl-panel .dshl-card { padding:10px; gap:8px; border-radius:var(--dsw-radius-md, 12px); background:var(--dsw-alias-bg-layer-1); }
.dshl-panel .dshl-presets { gap:6px; }
.dshl-panel .dshl-listScroll { max-height:200px; }
.dshl-panel .dshl-list { gap:2px; }
.dshl-panel .dshl-item { padding:3px 6px; }
.dshl-panel .dshl-hint, .dshl-panel .dshl-cardDesc { color:var(--dsw-alias-label-secondary); }
.dshl-sourcesList { max-height:340px; overflow-y:auto; padding-right:2px; display:flex; flex-direction:column; gap:8px; }
@media (max-width: 900px) {
  /* 窄屏改底部抽屉：五段固定部分吃掉 197px，66vh 时正文只剩 267px，抬到 82vh 才够用。 */
  .dshl-panel { left:12px !important; right:12px !important; width:auto; top:auto; bottom:12px; max-height:82vh; }
  .dshl-panelTool { gap:6px; padding:6px 10px; }
  .dshl-panelTool .dshl-presets { gap:4px; }
  .dshl-panelFoot { padding:6px 10px; }
}
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

    function buildDynamicCss(config, plan) {
      if (!config.enabled) return '';
      const effective = plan !== undefined ? plan : { arrange: config.arrange ?? {}, hideKeys: new Set() };
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
      // 入口收纳：收纳的入口从原列表收起，改由各区的「更多」菜单提供（菜单行在 apply 里注册）
      for (const entry of config.storage.sidebar) {
        lines.push(`[data-dshl-panel="${cssAttr(entry.label)}"] { display: none !important; }`);
      }
      if (config.storage.views.length > 0) lines.push(`[${STORED_VIEW_ATTR}] { display: none !important; }`);
      if (config.storage.guide.length > 0) lines.push(`[${STORED_GUIDE_ATTR}] { display: none !important; }`);
      if (config.storage.settings.length > 0) lines.push(`[${STORED_SECTION_ATTR}] { display: none !important; }`);
      for (const entry of config.storage.plugins) {
        lines.push(`[data-plugin-package="${cssAttr(entry.id)}"] { display: none !important; }`);
      }
      if (config.storage.headerUtilities.length > 0 || config.storage.settingsActions.length > 0) {
        lines.push(`[${STORED_BUTTON_ATTR}] { display: none !important; }`);
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
      // 插件来源条目：键是 slot::条目id；只对已渲染并打了标记的条目生效
      for (const key of config.slots.hide) {
        lines.push(`[${SLOT_ENTRY_ATTR}="${cssAttr(key)}"] { display: none !important; }`);
      }
      for (const [key, order] of Object.entries(config.slots.order)) {
        lines.push(`[${SLOT_ENTRY_ATTR}="${cssAttr(key)}"] { order: ${Math.round(order)} !important; }`);
      }
      // 槽位编排：容器改网格排列。只对配置过的容器生效，配置清空即恢复宿主布局
      for (const [containerId, spec] of Object.entries(effective.arrange ?? {})) {
        const selector = `[data-dshl-arrange="${cssAttr(containerId)}"]`;
        lines.push(`${selector} { display: grid !important; grid-template-columns: repeat(${Math.round(spec.columns)}, minmax(0, 1fr)) !important; gap: ${Math.round(spec.gap)}px !important; align-content: start !important; }`);
        lines.push(`${selector} > * { min-width: 0 !important; }`);
        // 面板导航是图标 + 文字行：只留图标时把行内第二个子元素（文字）藏起来，并让图标居中
        if (containerId === 'panels' && spec.compact === true) {
          lines.push(`${selector} > * > *:nth-child(2) { display: none !important; }`);
          lines.push(`${selector} > * { justify-content: center !important; }`);
        }
      }
      // 联动规则的隐藏动作：叠加在基础配置之上，规则不命中就不生成
      for (const key of effective.hideKeys ?? []) {
        if (key.startsWith('unit:')) lines.push(`[data-dshl-unit="${cssAttr(key.slice(5))}"] { display: none !important; }`);
        else if (key.startsWith('block:')) lines.push(`[data-dshl-block="${cssAttr(key.slice(6))}"] { display: none !important; }`);
        else lines.push(`[${SLOT_ENTRY_ATTR}="${cssAttr(key)}"] { display: none !important; }`);
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
      const plan = currentPlan();
      const next = buildDynamicCss(snapshot.config, plan);
      if (dynamicStyle.textContent !== next) dynamicStyle.textContent = next;
    }

    function paint() {
      ensureStyles();
      annotate(snapshot.targets);
      applyDynamicCss();
      applyRelocations();
    }

    /* ============================== 工具组件 ============================== */
    const icon = (paths, size = 14) =>
      h('svg', { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true }, paths.map((d, index) => h('path', { key: index, d, stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' })));

    const ICON_GRIP = ['M6 4h.01M10 4h.01M6 8h.01M10 8h.01M6 12h.01M10 12h.01'];
    const ICON_RESET = ['M3.2 8a4.8 4.8 0 1 0 1.5-3.5', 'M3.2 3.2v3.4h3.4'];
    const ICON_LAYOUT = ['M2.8 3.2h3v9.6h-3zM8.2 3.2h3v4.8h-3zM8.2 9.6h3v3.2h-3z'];
    const ICON_UP = ['M8 12.5v-9', 'M4.6 7.6 8 4.2l3.4 3.4'];
    const ICON_DOWN = ['M8 3.5v9', 'M4.6 8.4 8 11.8l3.4-3.4'];
    const ICON_SWAP = ['M3 5.5h7', 'M7.5 3 10 5.5 7.5 8', 'M13 10.5H6', 'M8.5 8 6 10.5 8.5 13'];
    const ICON_CLOSE = ['M4.5 4.5l7 7', 'M11.5 4.5l-7 7'];
    const ICON_CARET = ['M6 4l4 4-4 4'];

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

    /**
     * 顶部安全区：Electron 原生 titleBarOverlay 盖在 Web 层之上（本机高度 40px），
     * 那一带的 DOM 收得到 elementFromPoint 却收不到真实点击。
     *
     * 恢复按钮是「界面被改坏」时的最后一道安全网，绝不能落在那里——
     * 实测落点算法把按钮放到 y=11（依附在头部工具行上方），Web 端看着正常、Electron 里点不动。
     * 这里按页面头栏底边算一个下界，所有候选点都要满足。
     */
    function launcherTopBound() {
      let bound = 44;
      const bar = document.querySelector('header');
      if (bar !== null) {
        const rect = bar.getBoundingClientRect();
        if (rect.top <= 4 && rect.height >= 20 && rect.height <= 80) bound = Math.max(bound, Math.round(rect.bottom) + 6);
      }
      return bound;
    }

    /**
     * 投影用的顶部安全界：只避开原生窗口栏本身，不避开整个页头。
     *
     * `launcherTopBound` 是给恢复按钮用的——按钮要「不压在页头内容上」，所以取页头底边 + 6。
     * 但搬移的源节点本来就来自页头/页顶区域，用同一个保守下界会把它推到侧栏顶部内容上，
     * 反而制造新的遮挡。这里只要求整块避开被原生层吃掉的窗口栏。
     *
     * 取 40（窗口栏高度本身），**不留余量**：元素顶端落在 y=40 时已经完全在原生层下方、
     * 可以正常点击。早先写成 44（多留 4px），结果只要目标本来就在 y=40 就被硬推下 4px，
     * 桌面端实测表现为「投影与占位符不对齐 dy=4」——那个偏差是自己造的。
     */
    const WINDOW_BAR_HEIGHT = 40;
    function projectionTopBound() {
      return WINDOW_BAR_HEIGHT;
    }

    /** 候选点是否落在安全区里（水平不出屏、整枚按钮都在窗口栏下面）。 */
    function launcherPointAllowed(x, y, halfWidth, halfHeight) {
      if (x - halfWidth < 4 || x + halfWidth > window.innerWidth - 4) return false;
      if (y - halfHeight < launcherTopBound()) return false;
      if (y + halfHeight > window.innerHeight - 4) return false;
      return true;
    }

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
          // 安全区统一校验：水平不出屏 + 整枚按钮都在窗口栏下面（见 launcherPointAllowed）
          if (!launcherPointAllowed(x, y, halfWidth, halfHeight)) continue;
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
            // 不进窗口栏辆射区（Electron 原生 titleBarOverlay 盖在 Web 层上）
            if (!launcherPointAllowed(Math.round(x), Math.round(y), halfWidth, halfHeight)) continue;
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
        if (!launcherPointAllowed(candidate.x, candidate.y, halfWidth, halfHeight)) continue;
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

    /* ============================== 编辑面板（全局浮层） ============================== */
    const BLOCK_LABEL_KEYS = { brand: 'blockBrand', 'new-session': 'blockNewSession', panels: 'blockPanels', workspaces: 'blockWorkspaces', footer: 'blockFooter' };

    /**
     * 编辑区分页：按「用户要回答的问题」分，不按数据结构分。
     * - 布局结构：三栏骨架与底部条
     * - 侧栏：侧栏内部区块与面板导航
     * - 入口收纳：把入口收进「更多」
     * - 区域拆解：会话区 / 右栏 / 设置页的拆解与尺寸
     * - 槽位编排：容器排列、搬移、联动
     * - 识别诊断：宿主原生界面到手了什么、我配的拆解项生效没
     * - 插件与槽位：第三方插件贡献了什么、能改哪些
     *
     * 前五页回答「我要改什么」，后两页回答「我改的东西对上了没」。
     * 后两页原来是同一页（7.8 屏，占全部内容 35%），拆开后各 1.6 / 3.0 屏。
     * 分页状态记在 localStorage，刷新后停在原页。
     */
    const EDITOR_TABS = [
      { id: 'structure', labelKey: 'tabStructure', hintKey: 'tabStructureHint', cards: ['schemes', 'structure'] },
      { id: 'sidebar', labelKey: 'tabSidebar', hintKey: 'tabSidebarHint', cards: ['blocks', 'panels'] },
      { id: 'storage', labelKey: 'tabStorage', hintKey: 'tabStorageHint', cards: ['storage'] },
      { id: 'areas', labelKey: 'tabAreas', hintKey: 'tabAreasHint', cards: ['conversation', 'rightbar', 'settings'] },
      { id: 'arrange', labelKey: 'tabArrange', hintKey: 'tabArrangeHint', cards: ['arrange', 'relocate', 'sync', 'rules'] },
      { id: 'recognition', labelKey: 'tabRecognition', hintKey: 'tabRecognitionHint', cards: ['surfaces', 'coverage'] },
      { id: 'plugins', labelKey: 'tabPlugins', hintKey: 'tabPluginsHint', cards: ['pluginPages', 'externalUnits', 'pluginSources'] },
    ];
    const UI_STORE_KEY = 'dsh-layout/ui/v1';

    function readStoredUi() {
      return readJsonStore(UI_STORE_KEY);
    }

    function readStoredEditorTab() {
      const store = readStoredUi();
      const tab = store.tab;
      return typeof tab === 'string' && EDITOR_TABS.some((item) => item.id === tab) ? tab : EDITOR_TABS[0].id;
    }

    function writeStoredEditorTab(tab) {
      const store = readStoredUi();
      if (store.tab === tab) return;
      store.tab = tab;
      writeJsonStore(UI_STORE_KEY, store);
    }

    /**
     * 布局方案卡片：当前配置存成命名方案、切换、覆盖、改名、删除。
     * 切换用 replaceConfig（与导入/恢复默认同一入口），所以是「整套替换」而非字段合并。
     */
    function SchemesCard({ config, t }) {
      const [state, setState] = React.useState(readLayoutsNormalized);
      const [draftName, setDraftName] = React.useState('');
      const [message, setMessage] = React.useState(null);
      const commit = (next, text) => {
        setState(next);
        writeLayouts(next);
        setMessage(text === undefined ? null : { ok: true, text });
      };
      const defaultName = () => `${t('schemesNamePrefix')} ${state.list.length + 1}`;
      const saveNew = () => {
        if (state.list.length >= LAYOUTS_MAX) {
          setMessage({ ok: false, text: t('schemesFull') });
          return;
        }
        const name = draftName.trim() === '' ? defaultName() : draftName.trim().slice(0, 40);
        const id = nextLayoutId();
        const entry = { id, name, savedAt: Date.now(), config: clone(snapshot.config) };
        commit({ active: id, list: [...state.list, entry] }, `${t('schemesSaved')}：${name}`);
        setDraftName('');
      };
      const apply = (entry) => {
        replaceConfig(clone(entry.config));
        commit({ ...state, active: entry.id }, `${t('schemesApplied')}：${entry.name}`);
      };
      const overwrite = (entry) => {
        const next = state.list.map((item) => (item.id === entry.id ? { ...item, savedAt: Date.now(), config: clone(snapshot.config) } : item));
        commit({ ...state, list: next }, `${t('schemesSaved')}：${entry.name}`);
      };
      const rename = (entry, name) => {
        const trimmed = name.trim().slice(0, 40);
        if (trimmed === '' || trimmed === entry.name) return;
        commit({ ...state, list: state.list.map((item) => (item.id === entry.id ? { ...item, name: trimmed } : item)) });
      };
      const remove = (entry) => {
        const list = state.list.filter((item) => item.id !== entry.id);
        commit({ active: state.active === entry.id ? '' : state.active, list }, `${t('schemesDeleted')}：${entry.name}`);
      };
      return h(Card, { title: t('schemes'), desc: t('schemesHint') },
        h('div', { className: 'dshl-row' },
          h('input', {
            type: 'text',
            className: 'dshl-input',
            value: draftName,
            placeholder: defaultName(),
            'aria-label': t('schemes'),
            maxLength: 40,
            onChange: (event) => setDraftName(event.target.value),
          }),
          h('button', {
            type: 'button',
            className: 'dshl-btn',
            disabled: state.list.length >= LAYOUTS_MAX,
            onClick: saveNew,
          }, t('schemesSaveNew'))),
        h('div', { className: 'dshl-row' },
          h('span', { className: 'dshl-rowLabel' }, t('schemesCount')(state.list.length)),
          message === null ? null : h('span', { className: 'dshl-message', 'data-error': message.ok ? 'false' : 'true' }, message.text)),
        state.list.length === 0
          ? h('p', { className: 'dshl-hint' }, t('schemesEmpty'))
          : h('div', { className: 'dshl-listScroll' }, h('div', { className: 'dshl-list' },
            ...state.list.map((entry) => h('div', {
              key: entry.id,
              className: 'dshl-item',
              'data-active': state.active === entry.id ? 'true' : undefined,
            },
              h('input', {
                type: 'text',
                className: 'dshl-input dshl-inputInline',
                defaultValue: entry.name,
                'aria-label': t('schemesRename'),
                maxLength: 40,
                onBlur: (event) => rename(entry, event.target.value),
                onKeyDown: (event) => { if (event.key === 'Enter') event.target.blur(); },
              }),
              state.active === entry.id ? h('span', { className: 'dshl-itemSub' }, t('schemesActive')) : null,
              h('span', { className: 'dshl-itemCtl' },
                h('button', { type: 'button', className: 'dshl-btn', onClick: () => apply(entry) }, t('schemesApply')),
                h('button', {
                  type: 'button',
                  className: 'dshl-iconBtn',
                  title: t('schemesUpdate'),
                  'aria-label': t('schemesUpdate'),
                  onClick: () => overwrite(entry),
                }, icon(ICON_DOWN, 12)),
                h('button', {
                  type: 'button',
                  className: 'dshl-iconBtn',
                  title: t('schemesDelete'),
                  'aria-label': t('schemesDelete'),
                  onClick: () => remove(entry),
                }, icon(ICON_CLOSE, 12))))))));
    }

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

    function BlocksCard({ config, targets, t }) {
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
        h(ObservationNote, { area: 'sidebar', targets, t }),
        h(PartSection, { sectionId: 'sidebarParts', config, targets, t }));
    }

    function PanelsCard({ config, targets, t }) {
      const detected = targets.panels.map((panel) => panel.label);
      const labels = [];
      for (const label of config.sidebar.panelOrder) if (!labels.includes(label)) labels.push(label);
      for (const label of detected) if (!labels.includes(label)) labels.push(label);
      const items = labels.map((label) => ({ key: label, label }));
      const links = panellistLinks(targets);
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
              if (draft.sync.panellistOrder) syncSlotsFromPanelOrder(draft, links);
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
                if (draft.sync.panellistHidden) syncSlotsHidden(draft, links, item.label, !on);
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
      const renderRow = (surface, extra) => h('div', { key: surface.id, className: 'dshl-item', 'data-active': surface.active === true ? 'true' : undefined },
        h('span', { className: 'dshl-surfaceDot', 'data-on': surface.present === false ? 'false' : 'true', 'data-source': surface.source, 'aria-hidden': true }),
        h('span', { className: 'dshl-itemLabel', title: surface.labelKey === undefined ? surface.label : undefined }, surface.labelKey === undefined ? surface.label : t(surface.labelKey)),
        extra === undefined ? null : h('span', { className: 'dshl-itemSub' }, extra));
      const anomalies = targets.anomalies ?? [];
      // 官方页面不在场时用区域快照补上「上次观测」：会话页/设置面板的结构不会常驻 DOM。
      const areaOfSurface = (surface) => (surface.id === 'page.conversation' ? 'center' : surface.id === 'dialog.settings' ? 'settings' : null);
      const hostStatus = (surface) => {
        if (surface.present) return t('surfaceRecognized');
        const area = areaOfSurface(surface);
        const snapshot = area === null ? null : (targets.areaSnapshots ?? {})[area];
        return snapshot === undefined || snapshot === null ? t('surfaceOffline') : t('observedAt')(formatClock(snapshot.at));
      };
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
          h('div', { className: 'dshl-list' }, hostPages.map((surface) => renderRow(surface, hostStatus(surface))))),
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
          h('p', { className: 'dshl-hint' }, t('reviewHint'))),
        /* 桌面端诊断：Electron 里 fixed 层可能被原生窗口栏或合成层影响，
           Web 端看不出来。点一下把环境与几何数据打到控制台，比来回问快。 */
        h('div', { className: 'dshl-surfaceGroup' },
          h('div', { className: 'dshl-surfaceGroupTitle' }, t('desktopProbe')),
          h('p', { className: 'dshl-hint' }, t('desktopProbeHint')),
          h('div', { className: 'dshl-row' },
            h('button', {
              type: 'button',
              className: 'dshl-btn',
              onClick: () => {
                if (typeof window.__dshlDesktopProbe === 'function') window.__dshlDesktopProbe({ winBarH: 40 });
                else console.warn('[dsh-layout] 诊断函数未注册');
              },
            }, t('desktopProbeRun')),
            h('span', { className: 'dshl-itemSub' }, t('desktopProbeConsole')))));
    }

    /**
     * 插件页面卡片：运行时识别到的第三方 / 官方插件界面页。
     * 从「界面结构」里拆出来单独成卡：它属于「插件贡献了什么」，
     * 跟宿主原生区域/页面不是一回事，混在一张表里会让「官方 0」这种计数看着像宿主自己没识别到。
     */
    function PluginPagesCard({ targets, t }) {
      const pluginPages = (targets.surfaces ?? []).filter((surface) => surface.kind === 'plugin-page');
      const tierText = (surface) => {
        if (surface.tier === 'official') return t('tierOfficialShort');
        if (surface.tier === 'third') return t('tierThirdShort');
        if (surface.tier === 'pending') return t('surfacePending');
        return t('tierAutoShort');
      };
      const officialCount = pluginPages.filter((surface) => surface.tier === 'official').length;
      const thirdCount = pluginPages.filter((surface) => surface.tier === 'third').length;
      const autoCount = pluginPages.filter((surface) => surface.tier === 'auto' || surface.tier === 'pending').length;
      return h(Card, { title: t('pluginPages'), desc: t('pluginPagesHint') },
        h('div', { className: 'dshl-hint' }, `${t('ownerOfficial')} ${officialCount} · ${t('ownerThird')} ${thirdCount} · ${t('ownerAuto')} ${autoCount}`),
        pluginPages.length === 0
          ? h('div', { className: 'dshl-hint' }, t('surfacesEmpty'))
          : h('div', { className: 'dshl-list dshl-listScroll' }, pluginPages.map((surface) => h('div', {
            key: surface.id,
            className: 'dshl-item',
            'data-active': surface.active === true ? 'true' : undefined,
          },
          h('span', { className: 'dshl-surfaceDot', 'data-on': surface.present === false ? 'false' : 'true', 'data-source': surface.source, 'aria-hidden': true }),
          h('span', { className: 'dshl-itemLabel', title: surface.labelKey === undefined ? surface.label : undefined }, surface.labelKey === undefined ? surface.label : t(surface.labelKey)),
          h('span', { className: 'dshl-itemSub' }, surface.drift === true ? t('surfaceDrift') : `${tierText(surface)}${surface.recognized ? '' : ` · ${t('surfacePending')}`}`)))));
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

    /**
     * 区域观测说明：区域此刻不在场时，说明卡片上的控制项对应的是哪一次快照。
     * 放在卡片层（而不是每组拆解项各来一行），避免同一句话重复四遍。
     */
    function ObservationNote({ area, targets, t }) {
      const observed = targets?.areaSnapshots?.[area] ?? null;
      if (areaLive(targets, area)) return null;
      if (observed === null) return areaSeen(area) ? h('p', { className: 'dshl-hint' }, t('observedUnknown')) : null;
      return h('p', { className: 'dshl-hint' }, `${t('observedArea')(formatClock(observed.at), t(AREA_LABEL_KEYS[area]))} · ${t('notOnPage')}`);
    }

    /** 一组拆解项：分隔线 + 说明 + 该组单元；区域还没观测过时只显示说明（不摆无效开关）。 */
    function PartSection({ sectionId, config, targets, t }) {
      const section = PART_SECTIONS.find((item) => item.id === sectionId);
      const units = PART_UNITS.filter((unit) => unit.section === sectionId);
      const seen = (targets?.areaSnapshots?.[section.area] ?? null) !== null || areaSeen(section.area);
      return h(React.Fragment, null,
        h('div', { className: 'dshl-divider' }),
        h('div', { className: 'dshl-cardDesc' }, seen ? t(section.hintKey) : t(section.missingKey)),
        seen ? units.map((unit) => h(PartRow, { key: unit.id, spec: unit, config, t })) : null);
    }

    /**
     * 拆解覆盖卡片：把声明表里的单元逐个列出状态。
     * 此刻在场 = 这一秒 DOM 里命中；上次观测 = 上次打开该区域页面时的结构快照（带时间）；
     * 从未识别 = 还没打开过那个页面。不再用「当前为空」混指两种情况。
     *
     * 只读状态，没有任何可操作控件——它是诊断用的，改的控制项在「区域拆解」「侧栏」两页。
     * 24 行全展开占 1.6 屏，但多数时候全绿、没有信息量，所以整体可折叠：
     * 默认收起，任一区有异常（从未识别 / 上次未出现）才自动展开。
     */
    function CoverageCard({ config, targets, t }) {
      const units = targets.units ?? {};
      const snapshots = targets.areaSnapshots ?? {};
      const [open, setOpen] = React.useState(null);
      const present = (id) => (units[id]?.length ?? 0) > 0;
      const snapshotFor = (area) => snapshots[area] ?? null;
      const statusOf = (spec) => {
        const snapshot = snapshotFor(spec.area);
        if (spec.kind === 'order') {
          const needs = spec.needs ?? [];
          if (needs.length > 0 && needs.every(present)) return 'detected';
        } else if (present(spec.id) || (spec.targets ?? []).some(present)) {
          return 'detected';
        }
        if (snapshot !== null) return snapshot.ids.includes(spec.id) ? 'observed' : 'absent';
        return areaSeen(spec.area) ? 'legacy' : 'never';
      };
      const rows = PART_UNITS.map((spec) => ({ spec, status: statusOf(spec), snapshot: snapshotFor(spec.area) }));
      const detected = rows.filter((row) => row.status === 'detected').length;
      const observed = rows.length - detected - rows.filter((row) => row.status === 'never').length;
      const never = rows.filter((row) => row.status === 'never').length;
      const rowStatusText = (row) => {
        if (row.status === 'detected') return t('coverageDetected');
        if (row.status === 'observed') return `${t('coverageObserved')} ${formatClock(row.snapshot.at)}`;
        if (row.status === 'absent') return t('coverageAbsent');
        if (row.status === 'legacy') return t('coverageLegacy');
        return t('coverageNever');
      };
      const areas = [
        ['sidebar', t('sidebar')],
        ['center', t('center')],
        ['rightbar', t('rightbar')],
        ['settings', t('settingsPanel')],
      ];
      const unitRow = (row) => h('div', { key: row.spec.id, className: 'dshl-item' },
        h('span', { className: 'dshl-surfaceDot', 'data-on': row.status === 'detected' ? 'true' : 'false', 'data-source': 'official', 'aria-hidden': true }),
        h('span', { className: 'dshl-itemLabel' }, t(row.spec.labelKey)),
        h('span', { className: 'dshl-itemSub' }, rowStatusText(row)));
      /* 有异常就默认展开：诊断页收起时只剩一行汇总，用户看不出问题在哪。 */
      const hasProblem = rows.some((row) => row.status === 'never' || row.status === 'absent');
      const expanded = open === null ? hasProblem : open;
      const groups = areas.map(([area, label]) => h('div', { key: area, className: 'dshl-surfaceGroup' },
        h('div', { className: 'dshl-surfaceGroupTitle' }, label),
        h('div', { className: 'dshl-list' }, rows.filter((row) => row.spec.area === area).map(unitRow))));
      return h(Card, { title: t('coverage'), desc: t('coverageHint') },
        h('div', { className: 'dshl-row' },
          h('span', { className: 'dshl-rowLabel' }, t('coverageSummary')(detected, observed, never)),
          h('button', {
            type: 'button',
            className: 'dshl-chip',
            'aria-expanded': expanded ? 'true' : 'false',
            onClick: () => setOpen(!expanded),
          }, expanded ? t('coverageCollapse') : t('coverageExpand'))),
        expanded ? groups : null);
    }

    /**
     * 外部插件单元卡片：第三方插件页面的自动拆解结果与可操作项。
     *
     * 从「拆解覆盖」里拆出来单独成页：那 13 行带着 6 个开关、23 个按钮，是所有卡片里
     * 控件最密的一块，混在只读诊断卡里用户根本不知道哪些能点。
     * 编辑面板是浮层，切到哪个页面就扫哪个页面；不是插件页时回退显示最近一次扫描结果。
     */
    function ExternalUnitsCard({ config, targets, t }) {
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
      const tierText = (unit) => (unit.tier === 'declared' ? t('extTierDeclared') : unit.tier === 'registered' ? t('extTierRegistered') : null);
      const externalProfile = external !== null && !externalIframe && externalUnits.length > 0 ? inferExternalProfile(externalUnits) : null;
      const registryEntry = external === null ? undefined : readExternalRegistry()[external.pageKey];
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
      const groupStateOf = (group) => {
        const keys = externalUnits
          .filter((unit) => group.unitKeys.includes(unit.key) && unit.judge.actions.includes('hide'))
          .map((unit) => externalUnitKey(external.pageKey, unit.key));
        if (keys.length === 0) return null;
        return { total: keys.length, hidden: keys.filter((key) => config.external.hide.includes(key)).length };
      };
      const toggleExternalGroup = (group, hide) => updateConfig((draft) => {
        const set = new Set(draft.external.hide);
        for (const unit of externalUnits) {
          if (!group.unitKeys.includes(unit.key)) continue;
          if (!unit.judge.actions.includes('hide')) continue;
          const key = externalUnitKey(external.pageKey, unit.key);
          if (hide) set.add(key);
          else set.delete(key);
        }
        draft.external.hide = [...set];
      });
      const registerPage = () => {
        if (external === null || externalUnits.length === 0) return;
        registerExternalPage(external.pageKey, externalUnits);
        refresh();
      };
      const clearRegistry = () => {
        if (external === null) return;
        clearExternalPageRegistry(external.pageKey);
        refresh();
      };
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
                h('span', { className: 'dshl-itemSub' }, `${tierText(unit) === null ? '' : `${tierText(unit)} · `}${blockedLabel(unit.judge.blocked).length > 0 ? blockedLabel(unit.judge.blocked) : externalActionText(unit)}`),
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
      return h(Card, { title: t('externalTitle'), desc: t('externalHint') },
        h('div', { className: 'dshl-hint' }, `${t('externalCurrentPage')}${external === null ? t('externalPageNone') : external.pageKey}`),
        externalHistorical ? h('div', { className: 'dshl-hint' }, `${t('externalHistorical')}${external.scannedAt === undefined ? '' : ` · ${String(external.scannedAt).replace('T', ' ').slice(0, 19)}`}`) : null,
        external !== null && !externalIframe && externalUnits.length > 0
          ? h('div', { className: 'dshl-hint' }, t('externalCount')(
            externalUnits.length,
            externalUnits.filter((unit) => unit.judge.actions.includes('hide')).length,
            externalUnits.filter((unit) => unit.judge.actions.includes('reorder')).length,
          ))
          : null,
        externalProfile !== null
          ? h('div', { className: 'dshl-hint' }, `${t('externalKind')}：${t(`extKind${externalProfile.kind[0].toUpperCase()}${externalProfile.kind.slice(1)}`)}${registryEntry === undefined ? '' : ` · ${t('externalRegistered')}`}`)
          : null,
        h('div', { className: 'dshl-list' }, externalRows),
        externalProfile !== null && externalProfile.groups.length > 0
          ? h('div', { className: 'dshl-surfaceGroup' },
            h('div', { className: 'dshl-surfaceGroupTitle' }, t('externalGroups')),
            h('div', { className: 'dshl-hint' }, t('externalGroupHint')),
            h('div', { className: 'dshl-list' }, externalProfile.groups.map((group) => {
              const state = groupStateOf(group);
              return h('div', { key: group.id, className: 'dshl-item' },
                h('span', { className: 'dshl-itemLabel' }, `${t(group.nameKey)} · ${group.unitKeys.length}`),
                h('span', { className: 'dshl-itemSub' }, state === null ? t('externalReadonly') : `${state.hidden}/${state.total}`),
                h('span', { className: 'dshl-itemCtl' },
                  state === null ? null : h(Switch, {
                    checked: state.hidden === state.total,
                    label: `${t('externalHideGroup')} ${t(group.nameKey)}`,
                    onChange: (on) => toggleExternalGroup(group, on),
                  })));
            })))
          : null,
        h('div', { className: 'dshl-row' },
          h('button', { type: 'button', className: 'dshl-btn', disabled: external === null || externalUnits.length === 0, onClick: exportExternal }, t('externalExport')),
          h('button', { type: 'button', className: 'dshl-btn', disabled: external === null || externalIframe || externalUnits.length === 0, onClick: registerPage }, t('externalRegister')),
          h('button', { type: 'button', className: 'dshl-btn', disabled: registryEntry === undefined, onClick: clearRegistry }, t('externalClearRegistry'))));
    }

    /**
     * 插件来源卡片：宿主 slots 注册表的权威清单。
     * 按槽位分组列出条目的注册者、顺序与渲染状态；已渲染条目可按 `槽位::条目id` 精确隐藏/排序。
     * 入口类只排序、页面主体与单槽只读——隐藏它们会切断回到页面的路径或直接白屏。
     */
    function PluginSourcesCard({ config, targets, t }) {
      const [showAll, setShowAll] = React.useState(false);
      const [search, setSearch] = React.useState('');
      const [collapsed, setCollapsed] = React.useState({});
      const [dragId, setDragId] = React.useState('');
      const [overId, setOverId] = React.useState('');
      const sources = targets.slotSources ?? null;
      if (sources === null) {
        return h(Card, { title: t('pluginSources'), desc: t('pluginSourcesHint') },
          h('p', { className: 'dshl-hint' }, t('pluginSourcesUnavailable')));
      }      // 默认可操作优先：只列出「有已渲染可操作条目」的槽位；打开开关才展示全部槽位与未渲染条目
      const operable = (group) => group.items.some((item) => item.rendered && (item.hideable || item.orderable));
      const groups = sources.graph
        .filter((group) => group.items.length > 0 && (showAll || (group.rendered > 0 && operable(group))))
        .sort((left, right) => ((operable(right) ? 1 : 0) - (operable(left) ? 1 : 0))
          || (right.rendered - left.rendered)
          || left.slot.localeCompare(right.slot));
      const itemCount = groups.reduce((sum, group) => sum + (showAll ? group.items.length : group.rendered), 0);
      const renderedCount = groups.reduce((sum, group) => sum + group.rendered, 0);
      const kindLabel = (kind) => t({ list: 'slotKindList', keyed: 'slotKindKeyed', single: 'slotKindSingle', chain: 'slotKindChain' }[kind] ?? 'slotKindSingle');
      const hidden = (key) => config.slots.hide.includes(key);
      const links = panellistLinks(targets);
      const toggleHide = (key, hide) => updateConfig((draft) => {
        const set = new Set(draft.slots.hide);
        if (hide) set.add(key);
        else set.delete(key);
        draft.slots.hide = [...set];
        if (draft.sync.panellistHidden && key.startsWith('sidebar.panellist::')) syncPanelsHidden(draft, links, key, hide);
      });
      /** 槽位内的视觉顺序：宿主按「order 升序、同值按注册顺序」摆放，配置里的 order 覆盖前者。 */
      const visualItems = (group) => group.items
        .map((item, index) => {
          const override = config.slots.order[item.entryKey];
          return { item, weight: override === undefined ? (item.order ?? 0) : override, index };
        })
        .sort((left, right) => (left.weight - right.weight) || (left.index - right.index))
        .map((entry) => entry.item);
      /** 搜索过滤：槽位键、条目 id、注册者、组件名任一命中即保留。 */
      const query = search.trim().toLowerCase();
      const matchesItem = (item) => query === ''
        || item.id.toLowerCase().includes(query)
        || (item.registrant ?? '').toLowerCase().includes(query)
        || (item.componentName ?? '').toLowerCase().includes(query);
      // 槽位键命中时整组条目都算命中（否则只能搜条目名，搜槽位名会得到空组）
      const matchesGroup = (group) => query === '' || group.slot.toLowerCase().includes(query) || group.items.some(matchesItem);
      const itemsOf = (group) => (group.slot.toLowerCase().includes(query) ? group.items : group.items.filter(matchesItem));
      const visibleGroups = groups
        .map((group) => ({ group, items: itemsOf(group) }))
        .filter((entry) => query === '' || entry.group.slot.toLowerCase().includes(query) || entry.items.length > 0);
      /**
       * 同槽位内调序：把整组的相对顺序写成 order 值。
       * 条目原来的 order 由宿主注册优先级决定（不等于「当前视觉序号」），所以在旧值上加减会让
       * 拖一格看着没动；这里直接按新序列编号 0..n-1，顺序完全由配置决定。
       */
      const applySequence = (slot, ids) => updateConfig((draft) => {
        const group = sources.graph.find((item) => item.slot === slot);
        if (group === undefined) return;
        const ordered = ids.filter((id) => group.items.some((item) => item.id === id));
        if (ordered.length === 0) return;
        ordered.forEach((id, index) => { draft.slots.order[`${slot}::${id}`] = index; });
        // 面板导航与插件来源共用同一排图标：开着同步时把面板顺序也写成同一序列（面板顺序存的是显示名）
        if (draft.sync.panellistOrder && slot === 'sidebar.panellist') {
          const labels = ordered.map((id) => links.find((link) => link.key === `sidebar.panellist::${id}`)?.label ?? '');
          const rest = draft.sidebar.panelOrder.filter((label) => label !== '' && !labels.includes(label));
          draft.sidebar.panelOrder = [...labels.filter((label) => label !== ''), ...rest];
        }
      });
      /** 拖拽 / 箭头共用的换位：只在同一槽位内调序（顺序键按槽位分开），跨槽位拖动不生效。 */
      const moveItem = (group, fromId, toId) => {
        const ids = visualItems(group).map((item) => item.id);
        const from = ids.indexOf(fromId);
        const to = ids.indexOf(toId);
        if (from < 0 || to < 0 || from === to) return;
        const next = [...ids];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        applySequence(group.slot, next);
      };
      /** 箭头按钮 = 与相邻一行交换，和拖拽同一套序列，避免两种顺序语义打架。 */
      const moveBy = (group, item, delta) => {
        const ids = visualItems(group).map((entry) => entry.id);
        const at = ids.indexOf(item.id);
        const target = at + delta;
        if (at < 0 || target < 0 || target >= ids.length) return;
        moveItem(group, item.id, ids[target]);
      };
      const lockText = (item) => {
        if (!item.rendered) return t('slotNotRendered');
        if (item.reason === 'entry') return t('slotEntryOnly');
        if (item.reason === 'page') return t('slotPageOnly');
        if (item.reason === 'overlay') return t('slotOverlayOnly');
        if (item.reason === 'single') return t('slotSingleOnly');
        return item.registrant || t('ownerUnknown');
      };
      const itemRow = (group, item) => {
        const orderValue = config.slots.order[item.entryKey];
        const draggable = item.orderable && item.rendered;
        return h('div', {
          key: item.entryKey,
          className: 'dshl-item',
          'data-active': item.rendered ? 'true' : undefined,
          'data-dragover': overId === item.entryKey && dragId !== item.entryKey ? 'true' : undefined,
          draggable,
          onDragStart: draggable ? (event) => {
            setDragId(item.entryKey);
            event.dataTransfer.effectAllowed = 'move';
            try { event.dataTransfer.setData('text/plain', item.entryKey); } catch (error) { /* 合成事件可能没有 dataTransfer */ }
          } : undefined,
          onDragOver: draggable ? (event) => {
            event.preventDefault();
            if (overId !== item.entryKey) setOverId(item.entryKey);
          } : undefined,
          onDragLeave: draggable ? () => setOverId((current) => (current === item.entryKey ? '' : current)) : undefined,
          onDrop: draggable ? (event) => {
            event.preventDefault();
            const from = dragId;
            setDragId('');
            setOverId('');
            const fromItem = group.items.find((entry) => entry.entryKey === from);
            if (fromItem !== undefined && fromItem.entryKey !== item.entryKey) moveItem(group, fromItem.id, item.id);
          } : undefined,
          onDragEnd: draggable ? () => { setDragId(''); setOverId(''); } : undefined,
        },
          draggable ? h('span', { className: 'dshl-itemHandle', title: t('slotDragHint'), 'aria-hidden': true }, icon(ICON_GRIP, 13)) : null,
          h('span', { className: 'dshl-surfaceDot', 'data-on': item.rendered ? 'true' : 'false', 'data-source': 'third', 'aria-hidden': true }),
          h('span', { className: 'dshl-itemLabel', title: `${item.entryKey} · ${item.componentName || item.registrant}` }, item.id),
          h('span', { className: 'dshl-itemSub' }, lockText(item)),
          h('span', { className: 'dshl-itemCtl' },
            draggable ? h('button', {
              type: 'button',
              className: 'dshl-iconBtn',
              title: t('externalOrderUp'),
              'aria-label': t('externalOrderUp'),
              onClick: () => moveBy(group, item, -1),
            }, icon(ICON_UP, 12)) : null,
            draggable ? h('button', {
              type: 'button',
              className: 'dshl-iconBtn',
              title: t('externalOrderDown'),
              'aria-label': t('externalOrderDown'),
              onClick: () => moveBy(group, item, 1),
            }, icon(ICON_DOWN, 12)) : null,
            orderValue === undefined ? null : h('span', { className: 'dshl-num' }, String(orderValue)),
            item.hideable && item.rendered ? h(Switch, {
              checked: !hidden(item.entryKey),
              label: `${t('hide')} ${item.id}`,
              onChange: (on) => toggleHide(item.entryKey, !on),
            }) : null));
      };
      return h(Card, { title: t('pluginSources'), desc: t('pluginSourcesHint') },
        h('div', { className: 'dshl-row' },
          h('span', { className: 'dshl-rowLabel' }, t('pluginSourcesCount')(groups.length, itemCount, renderedCount)),
          h('span', { className: 'dshl-itemSub' }, t('slotShowAll')),
          h(Switch, { checked: showAll, label: t('slotShowAll'), onChange: setShowAll })),
        groups.length === 0
          ? h('p', { className: 'dshl-hint' }, t('slotNothingRendered'))
          : h(React.Fragment, null,
            h('div', { className: 'dshl-search' },
              h('input', {
                type: 'search',
                className: 'dshl-input',
                value: search,
                placeholder: t('slotSearch'),
                'aria-label': t('slotSearch'),
                onChange: (event) => setSearch(event.target.value),
              }),
              search === '' ? null : h('button', {
                type: 'button',
                className: 'dshl-iconBtn',
                title: t('slotSearchClear'),
                'aria-label': t('slotSearchClear'),
                onClick: () => setSearch(''),
              }, icon(ICON_CLOSE, 12))),
            visibleGroups.length === 0
              ? h('p', { className: 'dshl-hint' }, t('slotSearchEmpty'))
              : h('div', { className: 'dshl-sourcesList' },
                ...visibleGroups.map(({ group, items }) => {
                  /* 12 个槽位全展开有 92 行、占三屏；默认折叠，点标题展开。
                     搜索时强制展开命中组，否则搜到了还看不见。 */
                  const open = query !== '' || collapsed[group.slot] !== true;
                  return h('div', { key: group.slot, className: 'dshl-surfaceGroup' },
                    h('button', {
                      type: 'button',
                      className: 'dshl-groupToggle',
                      'data-open': open ? 'true' : 'false',
                      'aria-expanded': open ? 'true' : 'false',
                      onClick: () => setCollapsed((prev) => ({ ...prev, [group.slot]: open })),
                    },
                    icon(open ? ICON_DOWN : ICON_CARET, 11),
                    h('span', { className: 'dshl-groupToggleLabel' }, `${group.slot} · ${kindLabel(group.kind)} · ${group.rendered}/${group.items.length}`)),
                    open
                      ? h('div', { className: 'dshl-list' },
                        ...visualItems(group)
                          .filter((item) => items.includes(item))
                          .map((item) => itemRow(group, item)))
                      : null);
                }))));
    }

    /**
     * 容器排列卡片：每个可排列容器一行，给列数（默认 / 2 / 3）、间距与紧凑开关。
     * 已配置但此刻不在场的容器也列出来（可改、可复位），避免切走页面后就调不到。
     */
    function ArrangeCard({ config, targets, t }) {
      const rows = [...(targets.arrange ?? [])];
      for (const id of Object.keys(config.arrange ?? {})) {
        if (rows.some((entry) => entry.id === id)) continue;
        const known = ARRANGE_KNOWN.find((item) => item.id === id);
        rows.push({ id, labelKey: known?.labelKey, slot: id.startsWith('slot:') ? id.slice(5) : undefined, node: null, offline: true });
      }
      const labelOf = (entry) => (entry.labelKey === undefined || entry.labelKey === null
        ? `${t('arrangeSlotPrefix')} ${entry.slot ?? entry.id}`
        : t(entry.labelKey));
      const setColumns = (id, columns) => updateConfig((draft) => {
        if (columns === null) {
          delete draft.arrange[id];
          return;
        }
        const current = draft.arrange[id];
        draft.arrange[id] = { columns, gap: current?.gap ?? 8, compact: current?.compact === true };
      });
      const setGap = (id, gap) => updateConfig((draft) => {
        if (draft.arrange[id] !== undefined) draft.arrange[id].gap = gap;
      });
      const setCompact = (id, compact) => updateConfig((draft) => {
        if (draft.arrange[id] !== undefined) draft.arrange[id].compact = compact;
      });
      const renderRow = (entry) => {
        const spec = config.arrange[entry.id] ?? null;
        const current = spec === null ? null : spec.columns;
        return h('div', { key: entry.id, className: 'dshl-arrangeRow', 'data-offline': entry.offline === true ? 'true' : undefined },
          h('div', { className: 'dshl-arrangeHead' },
            h('span', { className: 'dshl-arrangeName', title: entry.id }, labelOf(entry)),
            entry.offline === true ? h('span', { className: 'dshl-itemSub' }, t('arrangeOffline')) : null),
          h('div', { className: 'dshl-arrangeCtl' },
            h('span', { className: 'dshl-itemSub' }, t('arrangeColumns')),
            ...[null, 2, 3].map((columns) => h('button', {
              key: columns === null ? 'default' : String(columns),
              type: 'button',
              className: 'dshl-chip',
              'data-active': current === columns ? 'true' : undefined,
              onClick: () => setColumns(entry.id, columns),
            }, columns === null ? t('arrangeDefault') : String(columns)))),
          spec === null
            ? null
            : h(Field, { label: t('arrangeGap'), valueText: `${spec.gap}${t('px')}` },
              h(Slider, { value: spec.gap, min: 0, max: 32, step: 2, onChange: (value) => setGap(entry.id, value) })),
          entry.id === 'panels' && spec !== null
            ? h('div', { className: 'dshl-row' },
              h('span', { className: 'dshl-rowLabel', title: t('arrangeCompactHint') }, t('arrangeCompact')),
              h(Switch, { checked: spec.compact, label: t('arrangeCompact'), onChange: (on) => setCompact(entry.id, on) }))
            : null);
      };
      return h(Card, { title: t('arrange'), desc: t('arrangeHint') },
        rows.length === 0
          ? h('p', { className: 'dshl-hint' }, t('arrangeEmpty'))
          : h('div', { className: 'dshl-list' }, rows.map(renderRow)));
    }

    /**
     * 区域搬移卡片：选源 → 在界面上画一个框，位置与宽度都由框决定。
     *
     * 第十六轮去掉了「选目标容器」与「选开头/结尾」两个下拉：目标容器不进配置，
     * 位置由框本身给出（见 docs/plans/2026-11-10-搬移改画框.md）。
     * 已配置的搬移逐条显示此刻状态：生效 / 源不在场 / 需重画（旧形态）/ 位置与容器冲突。
     */
    function RelocateCard({ config, targets, t }) {
      const allSources = relocateSources(targets);
      const sourceIds = new Set(allSources.map((source) => source.id));
      const [sourceId, setSourceId] = React.useState('');
      const resolved = relocateResolve(targets, config);
      const activeById = new Map(resolved.active.map((item) => [item.sourceId, item]));
      const groups = [
        ['block', 'relocateSourceBlock'],
        ['unit', 'relocateSourceUnit'],
        ['slot', 'relocateSourceSlot'],
      ];
      /** 开始画框：面板保持开着也无妨——画框层在最上面，面板留在下面当状态参考。 */
      const startFraming = (id) => {
        if (id === '') return;
        setFramer(id);
      };
      const configured = Object.entries(config.relocate ?? {});
      const legacyIds = configured.filter(([, spec]) => spec !== null && typeof spec === 'object' && spec.legacy === true).map(([id]) => id);
      const clearLegacy = () => updateConfig((draft) => {
        for (const id of legacyIds) delete draft.relocate[id];
      });
      return h(Card, { title: t('relocate'), desc: t('relocateHint') },
        allSources.length === 0
          ? h('p', { className: 'dshl-hint' }, t('relocateEmptySources'))
          : h('div', { className: 'dshl-relocateForm' },
            h('label', { className: 'dshl-relocateField' }, t('relocateSource'),
              h('select', {
                className: 'dshl-select',
                value: sourceId,
                onChange: (event) => setSourceId(event.target.value),
              },
              h('option', { value: '' }, '—'),
              ...groups.map(([group, labelKey]) => {
                const items = allSources.filter((source) => source.group === group);
                return items.length === 0 ? null : h('optgroup', { key: group, label: t(labelKey) },
                  ...items.map((source) => h('option', { key: source.id, value: source.id },
                    source.labelKey === null ? source.name : t(source.labelKey))));
              }))),
            h('button', { type: 'button', className: 'dshl-btn', 'data-primary': 'true', disabled: sourceId === '', onClick: () => startFraming(sourceId) }, t('frameStart'))),
        h('p', { className: 'dshl-hint' }, t('relocateFrameHint')),
        legacyIds.length === 0 ? null : h('div', { className: 'dshl-relocateRow', 'data-squeezed': 'true' },
          h('span', { className: 'dshl-relocateState', 'data-squeezed': 'true' }, t('relocateLegacy')),
          h('span', { className: 'dshl-itemLabel' }, t('relocateLegacyHint')(legacyIds.length)),
          h('button', { type: 'button', className: 'dshl-btn', onClick: clearLegacy }, t('relocateLegacyClear'))),
        configured.length === 0
          ? h('p', { className: 'dshl-hint' }, t('relocateNone'))
          : h('div', { className: 'dshl-list' }, configured.map(([id, spec]) => {
            if (spec !== null && typeof spec === 'object' && spec.legacy === true) {
              return h('div', { key: id, className: 'dshl-relocateRow', 'data-squeezed': 'true' },
                h('span', { className: 'dshl-relocateState', 'data-squeezed': 'true' }, t('relocateLegacy')),
                h('span', { className: 'dshl-itemLabel', title: id }, relocateSourceLabel(t, id)),
                h('button', { type: 'button', className: 'dshl-btn', onClick: () => startFraming(id) }, t('relocateRedraw')));
            }
            const live = activeById.get(id) ?? null;
            const present = sourceIds.has(id);
            const conflict = live !== null && live.resolved.conflict === true;
            const moved = live !== null && live.resolved.moved === true && !conflict;
            const stateKey = conflict ? 'relocateConflict' : !present ? 'relocateGone' : live !== null ? 'relocateActive' : 'relocatePending';
            const frame = live === null ? spec.frame : live.frame;
            const size = live === null ? '' : t('relocateFrameSize')(live.resolved.width, live.node.getBoundingClientRect().height);
            return h('div', { key: id, className: 'dshl-relocateRow', 'data-squeezed': conflict ? 'true' : undefined },
              h('span', { className: 'dshl-relocateState', 'data-active': live !== null && !conflict ? 'true' : undefined, 'data-squeezed': conflict ? 'true' : undefined }, t(stateKey)),
              h('span', { className: 'dshl-itemLabel', title: id }, `${relocateSourceLabel(t, id)} · ${t('relocateFrameAt')(frame.x, frame.y)}${size}`),
              conflict
                ? h('span', { className: 'dshl-itemSub dshl-relocateFitWarn', title: t('relocateConflictHint') }, t('relocateConflictShort'))
                : (moved ? h('span', { className: 'dshl-itemSub' }, t('relocateMoved')) : null),
              h('button', {
                type: 'button',
                className: 'dshl-btn',
                onClick: () => startFraming(id),
              }, t('relocateAdjust')),
              h('button', {
                type: 'button',
                className: 'dshl-iconBtn',
                title: t('relocateRemove'),
                'aria-label': t('relocateRemove'),
                onClick: () => updateConfig((draft) => { delete draft.relocate[id]; }),
              }, icon(ICON_CLOSE, 12)));
          })));
    }

    /** 联动同步卡片：面板导航与插件来源写同一份顺序/显隐，避免两套配置互相覆盖。 */
    function SyncCard({ config, targets, t }) {
      const available = targets.slotSources !== null && targets.slotSources !== undefined;
      const row = (key, labelKey, hintKey) => h('div', { className: 'dshl-row' },
        h('span', { className: 'dshl-rowLabel', title: t(hintKey) }, t(labelKey)),
        h(Switch, {
          checked: config.sync[key],
          label: t(labelKey),
          onChange: (on) => updateConfig((draft) => { draft.sync[key] = on; }),
        }));
      return h(Card, { title: t('sync'), desc: t('syncHint') },
        available ? h(React.Fragment, null,
          row('panellistOrder', 'syncPanellistOrder', 'syncPanellistOrderHint'),
          row('panellistHidden', 'syncPanellistHidden', 'syncPanellistHiddenHint'))
          : h('p', { className: 'dshl-hint' }, t('syncUnavailable')));
    }

    /**
     * 联动规则卡片：条件（页面 / 折叠 / 区域在场 / 单元在场）→ 动作（隐藏单元 / 容器排列）。
     * 规则只在条件成立时叠加到基础配置之上，不修改基础配置本身。
     */
    function RulesCard({ config, targets, t }) {
      const sources = relocateSources(targets);
      const sourceOptions = sources.map((source) => ({ id: source.id, label: source.labelKey === null ? source.name : t(source.labelKey) }));
      const containers = [];
      for (const known of ARRANGE_KNOWN) containers.push({ id: known.id, label: t(known.labelKey) });
      for (const entry of targets.arrange ?? []) {
        if (!containers.some((item) => item.id === entry.id)) {
          containers.push({ id: entry.id, label: entry.labelKey === undefined || entry.labelKey === null ? `${t('arrangeSlotPrefix')} ${entry.slot ?? entry.id}` : t(entry.labelKey) });
        }
      }
      for (const id of Object.keys(config.arrange ?? {})) {
        if (!containers.some((item) => item.id === id)) {
          const known = ARRANGE_KNOWN.find((item) => item.id === id);
          containers.push({ id, label: known === undefined ? id : t(known.labelKey) });
        }
      }
      const valueOptions = (kind) => {
        if (kind === 'page') return [
          ['any', 'rulePageAny'],
          ['conversation', 'rulePageConversation'],
          ['plugins', 'rulePagePlugins'],
          ['pluginDetail', 'rulePagePluginDetail'],
          ['settings', 'rulePageSettings'],
          ['external', 'rulePageExternal'],
        ].map(([value, labelKey]) => ({ value, label: t(labelKey) }));
        if (kind === 'collapsed') return [
          { value: true, label: t('ruleCollapsedYes') },
          { value: false, label: t('ruleCollapsedNo') },
        ];
        if (kind === 'area') return [
          ['sidebar', 'ruleAreaSidebar'],
          ['center', 'ruleAreaCenter'],
          ['rightbar', 'ruleAreaRightbar'],
          ['settings', 'ruleAreaSettings'],
        ].map(([value, labelKey]) => ({ value, label: t(labelKey) }));
        return sourceOptions.map((option) => ({ value: option.id, label: option.label }));
      };
      const [condKind, setCondKind] = React.useState('page');
      const [condValue, setCondValue] = React.useState('settings');
      const [actionKind, setActionKind] = React.useState('hide');
      const [hideTarget, setHideTarget] = React.useState(sourceOptions[0]?.id ?? '');
      const [container, setContainer] = React.useState(containers[0]?.id ?? 'panels');
      const [columns, setColumns] = React.useState(2);
      // 「切方案」动作的目标：从已保存的布局方案里选（没有方案时该动作不可用）
      const schemeList = readLayoutsNormalized().list;
      const [schemeId, setSchemeId] = React.useState(schemeList[0]?.id ?? '');
      const conditions = valueOptions(condKind);
      const condLabel = (rule) => {
        const options = valueOptions(rule.when.kind);
        const hit = options.find((option) => String(option.value) === String(rule.when.value));
        const kindLabel = t({ page: 'ruleCondPage', collapsed: 'ruleCondCollapsed', area: 'ruleCondArea', present: 'ruleCondPresent' }[rule.when.kind] ?? 'ruleCondPage');
        return `${kindLabel} = ${hit === undefined ? String(rule.when.value) : hit.label}`;
      };
      const actionLabel = (rule) => {
        if (rule.then.kind === 'hide') {
          const hit = sources.find((source) => source.id === rule.then.target);
          const label = hit === undefined ? rule.then.target : (hit.labelKey === null ? hit.name : t(hit.labelKey));
          return `${t('ruleActionHide')}：${label}`;
        }
        if (rule.then.kind === 'scheme') {
          const hit = schemeList.find((item) => item.id === rule.then.scheme);
          return `${t('ruleActionScheme')}：${hit === undefined ? (rule.then.schemeName === '' ? rule.then.scheme : rule.then.schemeName) : hit.name}`;
        }
        const hit = containers.find((item) => item.id === rule.then.container);
        return `${t('ruleActionArrange')}：${hit === undefined ? rule.then.container : hit.label} · ${rule.then.columns} ${t('ruleColumns')}`;
      };
      const plan = computePlan(targets, config);
      const canAdd = actionKind === 'hide' ? hideTarget !== '' : actionKind === 'scheme' ? schemeId !== '' : container !== '';
      const add = () => {
        if (!canAdd) return;
        const then = actionKind === 'hide'
          ? { kind: 'hide', target: hideTarget }
          : actionKind === 'scheme'
            ? { kind: 'scheme', scheme: schemeId, schemeName: schemeList.find((item) => item.id === schemeId)?.name ?? '' }
            : { kind: 'arrange', container, columns };
        const rule = { id: `r${Date.now().toString(36)}`, when: { kind: condKind, value: condValue }, then };
        updateConfig((draft) => { draft.rules = [...draft.rules, rule].slice(0, 12); });
      };
      const field = (label, children) => h('label', { className: 'dshl-relocateField' }, label, children);
      return h(Card, { title: t('rules'), desc: t('rulesHint') },
        h('div', { className: 'dshl-relocateForm' },
          field(t('ruleWhen'), h('select', {
            className: 'dshl-select',
            value: condKind,
            onChange: (event) => {
              const kind = event.target.value;
              setCondKind(kind);
              const options = valueOptions(kind);
              setCondValue(options[0]?.value ?? '');
            },
          }, ...[
            ['page', 'ruleCondPage'],
            ['collapsed', 'ruleCondCollapsed'],
            ['area', 'ruleCondArea'],
            ['present', 'ruleCondPresent'],
          ].map(([kind, labelKey]) => h('option', { key: kind, value: kind }, t(labelKey))))),
          field('=', h('select', {
            className: 'dshl-select',
            value: String(condValue),
            onChange: (event) => {
              const raw = event.target.value;
              setCondValue(condKind === 'collapsed' ? raw === 'true' : raw);
            },
          }, conditions.length === 0
            ? h('option', { value: '' }, t('ruleEmptyValue'))
            : conditions.map((option) => h('option', { key: String(option.value), value: String(option.value) }, option.label)))),
          field(t('ruleThen'), h('select', {
            className: 'dshl-select',
            value: actionKind,
            onChange: (event) => setActionKind(event.target.value),
          },
          h('option', { value: 'hide' }, t('ruleActionHide')),
          h('option', { value: 'arrange' }, t('ruleActionArrange')),
          h('option', { value: 'scheme', disabled: schemeList.length === 0 }, t('ruleActionScheme')))),
          actionKind === 'hide'
            ? field(t('ruleActionHide'), h('select', {
              className: 'dshl-select',
              value: hideTarget,
              onChange: (event) => setHideTarget(event.target.value),
            }, sourceOptions.length === 0
              ? h('option', { value: '' }, t('ruleEmptyValue'))
              : sourceOptions.map((option) => h('option', { key: option.id, value: option.id }, option.label))))
            : actionKind === 'scheme'
              ? field(t('ruleActionScheme'), h('select', {
                className: 'dshl-select',
                value: schemeId,
                onChange: (event) => setSchemeId(event.target.value),
              }, schemeList.length === 0
                ? h('option', { value: '' }, t('ruleSchemeEmpty'))
                : schemeList.map((item) => h('option', { key: item.id, value: item.id }, item.name))))
              : h(React.Fragment, null,
                field(t('ruleActionArrange'), h('select', {
                  className: 'dshl-select',
                  value: container,
                  onChange: (event) => setContainer(event.target.value),
                }, containers.length === 0
                  ? h('option', { value: '' }, t('ruleEmptyValue'))
                  : containers.map((option) => h('option', { key: option.id, value: option.id }, option.label)))),
                field(t('ruleColumns'), h('select', {
                  className: 'dshl-select',
                  value: String(columns),
                  onChange: (event) => setColumns(Number(event.target.value)),
                },
                h('option', { value: '2' }, '2'),
                h('option', { value: '3' }, '3')))),
          h('button', {
            type: 'button',
            className: 'dshl-btn',
            'data-primary': 'true',
            disabled: !canAdd,
            onClick: add,
          }, t('ruleAdd'))),
        (config.rules ?? []).length === 0
          ? h('p', { className: 'dshl-hint' }, t('ruleNone'))
          : h('div', { className: 'dshl-list' }, ...(config.rules ?? []).map((rule) => h('div', { key: rule.id, className: 'dshl-relocateRow' },
            h('span', { className: 'dshl-relocateState', 'data-active': plan.matched.has(rule.id) ? 'true' : undefined }, plan.matched.has(rule.id) ? t('ruleHit') : t('ruleMiss')),
            h('span', { className: 'dshl-itemLabel', title: rule.id }, `${condLabel(rule)} → ${actionLabel(rule)}`),
            h('button', {
              type: 'button',
              className: 'dshl-iconBtn',
              title: t('ruleRemove'),
              'aria-label': t('ruleRemove'),
              onClick: () => updateConfig((draft) => { draft.rules = draft.rules.filter((item) => item.id !== rule.id); }),
            }, icon(ICON_CLOSE, 12))))));
    }

    /**
     * 入口收纳卡片：按收纳域列出可收纳入口（自动发现），开关 = 收进该区的「更多」菜单。
     * 已配置但此刻不在场的入口也列出（标「此刻不在场」），方便放回。
     */
    function StorageCard({ config, targets, t }) {
      const zones = targets.storageZones ?? { sidebar: [], views: [], guide: [], settings: [], plugins: [] };
      const sections = [
        { id: 'sidebar', titleKey: 'storageZoneSidebar', found: zones.sidebar ?? [], emptyKey: 'storageZoneEmpty' },
        { id: 'views', titleKey: 'storageZoneViews', found: zones.views ?? [], emptyKey: 'storageZoneEmpty' },
        { id: 'guide', titleKey: 'storageZoneGuide', found: zones.guide ?? [], emptyKey: 'storageGuideUnavailable' },
        { id: 'settings', titleKey: 'storageZoneSettings', found: zones.settings ?? [], emptyKey: 'storageSettingsUnavailable' },
        { id: 'plugins', titleKey: 'storageZonePlugins', found: zones.plugins ?? [], emptyKey: 'storagePluginsUnavailable' },
        { id: 'headerUtilities', titleKey: 'storageZoneHeaderUtilities', found: zones.headerUtilities ?? [], emptyKey: 'storageHeaderUtilitiesUnavailable' },
        { id: 'settingsActions', titleKey: 'storageZoneSettingsActions', found: zones.settingsActions ?? [], emptyKey: 'storageSettingsActionsUnavailable' },
      ];
      /**
       * 折叠态**惰性初始化一次**，之后只由用户点击改动。
       * 早先每帧按「还有未收纳项吗」实时算，于是收完最后一个入口的瞬间该区自己收起——
       * 表现为「收了又弹回去」。默认展开有未收纳项的区，全绿的就收起。
       */
      const [collapsed, setCollapsed] = React.useState(() => {
        const init = {};
        for (const section of sections) {
          const stored = config.storage?.[section.id] ?? [];
          const rows = section.found ?? [];
          const storedCount = rows.filter((entry) => stored.some((item) => sameStorageEntry(item, entry))).length;
          const shouldOpen = rows.length > 0 && storedCount < rows.length;
          if (!shouldOpen) init[section.id] = true;
        }
        return init;
      });
      const toggle = (zone, entry, on) => updateConfig((draft) => {
        const list = draft.storage[zone];
        const others = list.filter((item) => !sameStorageEntry(item, entry));
        // 写回时把身份原样存下来（含运行期发现的条目可能没有 id）：只存有值的字段，
        // 不要写成 `id: ''` ——读回时 `''` 与「没有 id」走的是两条不同分支，会被判成两个条目。
        const record = { label: entry.label };
        if (typeof entry.id === 'string' && entry.id !== '') record.id = entry.id;
        if (entry.kind !== undefined) record.kind = entry.kind;
        draft.storage[zone] = on ? [...others, record] : others;
      });
      /**
       * 历史条目补 id：旧数据里可能是 `{ label: '任务看板' }`（无 id），而当前发现清单里
       * 同名的条目有稳定 id（`task-board`）。不补的话两者永远配不上，界面会把它们当成两条，
       * 开关就出现「点了没反应 / 关不掉」。
       *
       * 只补「label 在该域唯一命中」的：同名两条时无法判断对应哪一个，宁可不动。
       */
      React.useEffect(() => {
        const patches = [];
        for (const section of sections) {
          const stored = config.storage?.[section.id] ?? [];
          const byLabel = new Map();
          for (const entry of section.found) {
            if (typeof entry.id !== 'string' || entry.id === '') continue;
            // 同名出现两次时置 null：无法判断该补哪一个，宁可不动
            byLabel.set(entry.label, byLabel.has(entry.label) ? null : entry.id);
          }
          for (const entry of stored) {
            if (typeof entry.id === 'string' && entry.id !== '') continue;
            const fixed = byLabel.get(entry.label);
            if (typeof fixed === 'string' && fixed !== '') patches.push({ zone: section.id, entry, id: fixed });
          }
        }
        if (patches.length === 0) return;
        updateConfig((draft) => {
          for (const patch of patches) {
            const list = draft.storage[patch.zone] ?? [];
            const at = list.findIndex((item) => item.label === patch.entry.label && (item.kind ?? '') === (patch.entry.kind ?? ''));
            if (at >= 0) list[at] = { ...list[at], id: patch.id };
          }
        });
      }, [config.storage, targets.storageZones]);
      const hiddenLabels = config.sidebar.panelHidden;
      const renderZone = (section) => {
        const stored = config.storage[section.id] ?? [];
        const rows = section.found.map((entry) => ({ ...entry, offline: false }));
        for (const entry of stored) {
          if (rows.some((row) => sameStorageEntry(row, entry))) continue;
          rows.push({ ...entry, offline: true });
        }
        /* 七个区原来是一串连着的标题 + 列表，分区之间没有分隔，用户看不出边界；
           而且每区各带一个独立滚动框，嵌套感很重。改成可折叠分区：
           标题行同时是折叠按钮，右侧给「已收纳/总数」的计数，折叠后只留一行。
           默认展开态由首次挂载时算一次写进 state（见上面的初始化 effect），之后完全由用户点击掌握。
           早先写成「每次渲染按 storedCount < rows.length 实时算」，于是收纳完最后一个入口的
           瞬间该区自动收起——用户看到的是「收了又自己弹回去」。 */
        const storedCount = rows.filter((entry) => stored.some((item) => sameStorageEntry(item, entry))).length;
        const open = collapsed[section.id] !== true;
        return h('section', { key: section.id, className: 'dshl-zone', 'data-open': open ? 'true' : 'false' },
          h('button', {
            type: 'button',
            className: 'dshl-zoneHead',
            'aria-expanded': open ? 'true' : 'false',
            onClick: () => setCollapsed((prev) => ({ ...prev, [section.id]: open })),
          },
          icon(open ? ICON_DOWN : ICON_CARET, 11),
          h('span', { className: 'dshl-zoneTitle' }, t(section.titleKey)),
          h('span', { className: 'dshl-zoneCount' }, storedCount === 0 ? `${rows.length}` : `${storedCount}/${rows.length}`)),
          open
            ? (rows.length === 0
              ? h('p', { className: 'dshl-hint dshl-zoneEmpty' }, t(section.emptyKey))
              : h('div', { className: 'dshl-list dshl-zoneList' }, ...rows.map((entry) => {
                const storedEntry = stored.find((item) => sameStorageEntry(item, entry));
                return h('div', { key: storageKeyOf(entry), className: 'dshl-row' },
                  h('span', { className: 'dshl-rowLabel' }, entry.label),
                  section.id === 'sidebar' && hiddenLabels.includes(entry.label) ? h('span', { className: 'dshl-itemSub' }, t('storageHiddenHint')) : null,
                  entry.offline ? h('span', { className: 'dshl-itemSub' }, t('storageZoneOffline')) : null,
                  h(Switch, {
                    checked: storedEntry !== undefined,
                    label: entry.label,
                    onChange: (on) => toggle(section.id, entry, on),
                  }));
              })))
            : null);
      };
      return h(Card, { title: t('storage'), desc: t('storageHint') },
        h('div', { className: 'dshl-zoneList' }, ...sections.map(renderZone)));
    }

    /** 「更多」菜单行：宿主渲染菜单，我们只贡献行；样式优先用宿主 MenuItemButton，缺失时退化为普通按钮。 */
    function StorageRow({ label, current, onSelect }) {
      return MenuItemButton !== null
        ? h(MenuItemButton, { current: current === true, onSelect }, label)
        : h('button', {
          type: 'button',
          role: 'menuitem',
          className: 'dshl-storageMenuItem',
          'data-current': current === true ? 'true' : undefined,
          onClick: onSelect,
        }, label);
    }

    /**
     * 侧栏「更多」菜单里的收纳行：点一下先关菜单再切到对应面板。
     * 面板 id 优先用配置里的 id，早期配置只有显示名时用 slots 反查。
     */
    function SidebarStorageMenu({ entries, onDismiss, ctx }) {
      const { config, targets } = useStoreSnapshot();
      if (config.enabled !== true) return null;
      const stored = config.storage?.sidebar ?? [];
      if (stored.length === 0) return null;
      const panelIds = storagePanelIds(targets);
      const activeIds = new Set(Array.isArray(entries) ? entries.filter((entry) => entry.active === true).map((entry) => entry.id) : []);
      const rows = [];
      for (const entry of stored) {
        const panelId = entry.id !== '' ? entry.id : panelIds.get(entry.label);
        if (panelId === undefined || panelId === '') continue;
        rows.push({ label: entry.label, panelId, active: activeIds.has(panelId) });
      }
      if (rows.length === 0) return null;
      const open = (panelId) => {
        if (typeof onDismiss === 'function') onDismiss();
        const layout = ctx !== null && ctx !== undefined && typeof ctx.get === 'function' ? ctx.get('layout') : undefined;
        if (layout === null || layout === undefined || typeof layout.selectPanel !== 'function') return;
        try {
          layout.selectPanel(panelId);
        } catch (error) {
          console.warn('[dsh-layout] 打开收纳入口失败，本次跳过', error);
        }
      };
      return h(React.Fragment, null, ...rows.map((row) => h(StorageRow, { key: row.panelId, label: row.label, current: row.active, onSelect: () => open(row.panelId) })));
    }

    /** 会话视图标签的「更多」菜单收纳行：owner 提供 onOpen（selectView），直接用它切视图。 */
    function ViewsStorageMenu({ entries, onOpen, onDismiss }) {
      const { config } = useStoreSnapshot();
      if (config.enabled !== true) return null;
      const stored = config.storage?.views ?? [];
      if (stored.length === 0) return null;
      const currentIds = new Set(Array.isArray(entries) ? entries.filter((entry) => entry.active === true).map((entry) => entry.id) : []);
      const rows = stored.filter((entry) => entry.id !== '');
      if (rows.length === 0) return null;
      const open = (id) => {
        if (typeof onDismiss === 'function') onDismiss();
        if (typeof onOpen !== 'function') return;
        try {
          onOpen(id);
        } catch (error) {
          console.warn('[dsh-layout] 打开收纳的会话视图失败，本次跳过', error);
        }
      };
      return h(React.Fragment, null, ...rows.map((row) => h(StorageRow, { key: row.id, label: row.label, current: currentIds.has(row.id), onSelect: () => open(row.id) })));
    }

    /** 右栏开始页的「更多工具」收纳行：owner 提供 onOpen(id)，id 形如 `kind:id`；按 kind 反查，不再比标题。 */
    function GuideStorageMenu({ entries, onOpen, onDismiss }) {
      const { config } = useStoreSnapshot();
      if (config.enabled !== true) return null;
      const stored = config.storage?.guide ?? [];
      if (stored.length === 0) return null;
      const owners = Array.isArray(entries) ? entries : [];
      const rows = [];
      for (const entry of stored) {
        const key = entry.id !== '' ? entry.id : (entry.kind ?? '');
        const hit = key !== ''
          ? owners.find((item) => String(item.id) === key || String(item.id).startsWith(`${key}:`))
          : owners.find((item) => item.label === entry.label);
        if (hit === undefined) continue;
        rows.push({ id: String(hit.id), label: entry.label });
      }
      if (rows.length === 0) return null;
      const open = (id) => {
        if (typeof onDismiss === 'function') onDismiss();
        if (typeof onOpen !== 'function') return;
        try {
          onOpen(id);
        } catch (error) {
          console.warn('[dsh-layout] 打开收纳的右栏开始页卡片失败，本次跳过', error);
        }
      };
      return h(React.Fragment, null, ...rows.map((row) => h(StorageRow, { key: row.id, label: row.label, onSelect: () => open(row.id) })));
    }

    /* ============================== 授予式「更多」（设置页导航 / 插件页第三方组） ============================== */
    /**
     * 设置页导航与插件页「已安装插件」分组都没有 actions 槽位，宿主也不暴露打开接口。
     * 做法：在目标容器里插一个外来锚点（display:contents 的 span），锚点内的按钮抄原生控件的
     * className 与内部结构，菜单用宿主 Menu primitives；打开目标时点原生控件本身（隐藏的也行）。
     */
    function settingsNavContainer() {
      const nav = document.querySelector('[data-dshl-unit="set-nav"]');
      if (nav === null) return null;
      return nav.querySelector('[class*="navList"]') ?? nav.firstElementChild;
    }

    function pluginsGroupHead() {
      const group = document.querySelector('[data-plugin-group="bundles"]');
      return group === null ? null : group.firstElementChild;
    }

    function settingsAnchorChrome(t) {
      const cells = [...document.querySelectorAll('[data-dshl-unit="set-nav"] button[class*="navCell"]')];
      const cell = cells.find((item) => item.getAttribute('aria-current') !== 'true') ?? cells[0];
      if (cell === undefined || cell.children.length < 2) return null;
      return {
        className: cell.className,
        children: [
          h('span', { key: 'icon', className: cell.children[0].className, 'aria-hidden': 'true' }, icon(ICON_LAYOUT, 16)),
          h('span', { key: 'label', className: cell.children[1].className }, t('storageGrantMore')),
        ],
      };
    }

    function pluginsAnchorChrome(t) {
      const native = document.querySelector('[data-plugin-group="extensions"] button[class*="groupMore"]');
      const children = [
        h('span', { key: 'label' }, t('storageGrantMore')),
        h('span', { key: 'chevron', 'aria-hidden': 'true', style: { display: 'inline-flex' } }, icon(['M6 3.5 10.5 8 6 12.5'], 14)),
      ];
      return native === null ? { className: 'dshl-grantFallback', children } : { className: native.className, children };
    }

    /** 设置页导航的收纳行：按分区 id 找导航按钮（与收起时的身份一致），点它切分区。 */
    function pickSettingsSection(id) {
      for (const cell of document.querySelectorAll('[data-dshl-unit="set-nav"] button')) {
        if (!identityMatches(id, stableIdentityOf(cell, null))) continue;
        cell.click();
        return true;
      }
      return false;
    }

    /** 会话头工具行 / 设置页页头操作：容器就是槽位出口的父级那一行。 */
    function headerUtilitiesContainer() {
      const outlet = document.querySelector('[data-slot="conversation.session.header.utilities"]');
      return outlet === null ? null : outlet.parentElement;
    }

    function settingsActionsContainer() {
      const outlet = document.querySelector('[data-slot="settings.action"]');
      return outlet === null ? null : outlet.parentElement;
    }

    function headerUtilitiesAnchorChrome() {
      const container = headerUtilitiesContainer();
      const native = container === null ? null : [...container.querySelectorAll('button')].find((button) => !button.hasAttribute('data-dshl-grant-anchor') && button.getAttribute('aria-label') !== null);
      const children = [h('span', { key: 'icon', 'aria-hidden': 'true', style: { display: 'inline-flex' } }, icon(['M3 8h2M7 8h2M11 8h2'], 14))];
      return native === null ? { className: 'dshl-grantFallback', children } : { className: native.className, children };
    }

    function settingsActionsAnchorChrome(t) {
      const container = settingsActionsContainer();
      const native = container === null ? null : [...container.querySelectorAll('button')].find((button) => !button.hasAttribute('data-dshl-grant-anchor'));
      const children = [t('storageGrantMore')];
      return native === null ? { className: 'dshl-grantFallback', children } : { className: native.className, children };
    }

    /** 打开被收纳的按钮：点它本身（display:none 不影响 React onClick）。 */
    function clickStoredButton(zone, id) {
      const target = document.querySelector(`[${STORED_BUTTON_ATTR}="${CSS.escape(`${zone}:${id}`)}"]`);
      if (target === null) return false;
      target.click();
      return true;
    }

    /* ============================== 会话头「更多操作」菜单承接收纳 ============================== */
    /**
     * 会话头工具行自带宿主「更多操作」按钮，收纳的按钮直接追加进这个菜单，
     * 按钮区不再出现第二个「更多」（docs/plans/2026-11-08-更多操作接管收纳.md）。
     * 注入是纯 DOM：宿主每次打开菜单都重建 DOM（实测注入节点随之清空），所以每次打开都重新注入。
     */
    const HOST_MORE_COMPONENT = 'SessionLogDownloadHeaderAction';
    const HOST_MORE_SLOT_ID = 'session-log-download';
    const HOST_MORE_ICON = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M2.8 3.2h3v9.6h-3zM8.2 3.2h3v4.8h-3zM8.2 9.6h3v3.2h-3z"/></svg>';
    let hostMoreWatchTimer = null;

    /** 会话头工具行里的宿主「更多操作」按钮：按业务组件名与槽位后段识别，不依赖文案。 */
    function isHostMoreButton(button) {
      const identity = stableIdentityOf(button, { component: true });
      if (identity.component === HOST_MORE_COMPONENT) return true;
      const at = identity.slotEntry.indexOf('::');
      return at !== -1 && identity.slotEntry.slice(at + 2) === HOST_MORE_SLOT_ID;
    }

    function hostMoreButtonOf() {
      const container = headerUtilitiesContainer();
      if (container === null) return null;
      for (const button of container.querySelectorAll('button')) {
        if (button.hasAttribute('data-dshl-grant-anchor')) continue;
        if (isHostMoreButton(button)) return button;
      }
      return null;
    }

    /** 菜单里建一行：className 与内部结构抄宿主菜单现有行；图标用自绘 SVG（宿主图标名不对外保证）。 */
    function hostMenuRow(template, label, onClick) {
      const wrap = document.createElement('div');
      wrap.className = template.wrap;
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('role', 'menuitem');
      button.className = template.row;
      if (template.icon !== '') {
        const iconSpan = document.createElement('span');
        iconSpan.className = template.icon;
        iconSpan.setAttribute('aria-hidden', 'true');
        iconSpan.innerHTML = HOST_MORE_ICON;
        button.appendChild(iconSpan);
      }
      const text = document.createElement('span');
      if (template.label !== '') text.className = template.label;
      text.textContent = label;
      button.appendChild(text);
      button.addEventListener('click', onClick);
      wrap.appendChild(button);
      return wrap;
    }

    /** 往宿主「更多操作」菜单末尾追加收纳行；菜单结构不符时什么都不做。 */
    function injectHostStorageRows(menu) {
      const stored = snapshot.config.storage?.headerUtilities ?? [];
      if (stored.length === 0) return;
      if (menu.hasAttribute('data-dshl-more-injected')) return;
      const viewport = menu.querySelector('[role="presentation"]');
      const source = viewport === null ? null : viewport.querySelector('button[role="menuitem"]');
      const sourceWrap = source === null ? null : source.parentElement;
      if (viewport === null || source === null || sourceWrap === null) return;
      const iconSpan = source.querySelector('span[class*="itemIcon"]');
      const labelSpan = source.querySelector('span[class*="itemLabel"]');
      const template = {
        wrap: sourceWrap.className,
        row: source.className,
        icon: iconSpan === null ? '' : iconSpan.className,
        label: labelSpan === null ? '' : labelSpan.className,
      };
      menu.setAttribute('data-dshl-more-injected', String(stored.length));
      const divider = document.createElement('div');
      divider.className = 'dshl-moreDivider';
      viewport.appendChild(divider);
      for (const entry of stored) {
        const target = document.querySelector(`[${STORED_BUTTON_ATTR}="${CSS.escape(`headerUtilities:${entry.id}`)}"]`);
        const label = target === null ? entry.label : buttonLabelOf(target);
        viewport.appendChild(hostMenuRow(template, label, () => {
          clickStoredButton('headerUtilities', entry.id);
          closeHostMoreMenu();
        }));
      }
    }

    /** 关闭宿主菜单：Escape 交给宿主菜单自己处理（实测有效）。 */
    function closeHostMoreMenu() {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    }

    /** 点「更多操作」后等菜单出现（宿主异步开菜单），出现后注入。 */
    function watchHostMoreMenu() {
      if (hostMoreWatchTimer !== null) window.clearTimeout(hostMoreWatchTimer);
      const before = new Set(document.querySelectorAll('[role="menu"]'));
      const started = performance.now();
      const tick = () => {
        hostMoreWatchTimer = null;
        const menu = [...document.querySelectorAll('[role="menu"]')].find((node) => !before.has(node));
        if (menu !== undefined) {
          injectHostStorageRows(menu);
          return;
        }
        if (performance.now() - started > 900) return;
        hostMoreWatchTimer = window.setTimeout(tick, 40);
      };
      hostMoreWatchTimer = window.setTimeout(tick, 40);
    }

    /** 捕获阶段监听：只处理打了 data-dshl-morehost 的「更多操作」按钮。 */
    function onHostMorePointer(event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('[data-dshl-morehost]') === null) return;
      watchHostMoreMenu();
    }

    function openPluginCard(packageName) {
      const card = document.querySelector(`[data-plugin-package="${CSS.escape(packageName)}"]`);
      if (card === null) return false;
      const target = card.querySelector('button[class*="cardOpen"]') ?? card.querySelector('button');
      if (target === null) return false;
      target.click();
      return true;
    }

    /** 授予式「更多」：锚点跟着容器重建自动重挂；菜单用宿主 Menu，行用宿主 MenuItemButton。 */
    function GrantedMenu({ zone, container, chrome, rows, onPick, t }) {
      const [open, setOpen] = React.useState(false);
      const [holder, setHolder] = React.useState(null);
      const holderRef = React.useRef(null);
      const chromeRef = React.useRef(chrome);
      chromeRef.current = chrome;
      React.useEffect(() => {
        const ensure = () => {
          const target = container();
          if (target === null) return;
          let node = holderRef.current;
          if (node === null || node.isConnected !== true) {
            if (node !== null && node.parentElement !== null) node.remove();
            node = document.createElement('span');
            node.setAttribute('data-dshl-grant', zone);
            node.style.display = 'contents';
            holderRef.current = node;
            setHolder(node);
          }
          if (node.parentElement !== target) target.appendChild(node);
        };
        ensure();
        const timer = window.setInterval(ensure, 900);
        return () => window.clearInterval(timer);
      }, [zone, container]);
      React.useEffect(() => () => {
        const node = holderRef.current;
        if (node !== null && node.parentElement !== null) node.parentElement.removeChild(node);
        holderRef.current = null;
      }, []);
      if (holder === null || rows.length === 0 || MenuPrimitive === null) return null;
      const close = () => setOpen(false);
      const anchorChrome = chromeRef.current();
      const anchor = h('button', {
        type: 'button',
        className: anchorChrome === null ? 'dshl-grantFallback' : anchorChrome.className,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'data-dshl-grant-anchor': zone,
        style: zone === 'settings' ? { width: '100%' } : undefined,
        onClick: () => setOpen((value) => !value),
      }, ...(anchorChrome === null ? [t('storageGrantMore')] : anchorChrome.children));
      return createPortal(h(MenuPrimitive, {
        open,
        onClose: close,
        portal: true,
        autoFocus: true,
        anchor,
      }, h(React.Fragment, null, ...rows.map((row) => h(StorageRow, {
        key: `${zone}:${row.id}`,
        label: row.label,
        current: row.current === true,
        onSelect: () => {
          close();
          onPick(row);
        },
      })))), holder);
    }

    /** 两个授予式「更多」的宿主：只在配置了收纳项、且目标容器在场时出现。 */
    function GrantedStorageMenus({ t }) {
      const { config } = useStoreSnapshot();
      if (config.enabled !== true) return null;
      const settingsStored = config.storage.settings ?? [];
      const pluginsStored = config.storage.plugins ?? [];
      const activeSection = (() => {
        const active = document.querySelector('[data-dshl-unit="set-nav"] button[aria-current="true"]');
        return active === null ? null : stableIdentityOf(active, null);
      })();
      const settingsRows = settingsStored.map((entry) => ({ id: entry.id, label: entry.label, current: activeSection !== null && identityMatches(entry.id, activeSection) }));
      const pluginRows = pluginsStored.map((entry) => ({ id: entry.id, label: entry.label, current: false }));
      const headerStored = config.storage.headerUtilities ?? [];
      const settingsActionStored = config.storage.settingsActions ?? [];
      // 会话头有宿主「更多操作」时，收纳行注入那个菜单（不再多一个「更多」）；只有宿主按钮不在场才退回授予式锚点
      const hostMore = hostMoreButtonOf();
      return h(React.Fragment, null,
        settingsRows.length > 0 ? h(GrantedMenu, {
          key: 'settings',
          zone: 'settings',
          t,
          container: settingsNavContainer,
          chrome: () => settingsAnchorChrome(t),
          rows: settingsRows,
          onPick: (row) => {
            if (!pickSettingsSection(row.id)) console.warn('[dsh-layout] 找不到收纳的设置项', row.label);
          },
        }) : null,
        pluginRows.length > 0 ? h(GrantedMenu, {
          key: 'plugins',
          zone: 'plugins',
          t,
          container: pluginsGroupHead,
          chrome: () => pluginsAnchorChrome(t),
          rows: pluginRows,
          onPick: (row) => {
            if (!openPluginCard(row.id)) console.warn('[dsh-layout] 找不到收纳的插件卡片', row.id);
          },
        }) : null,
        headerStored.length > 0 && hostMore === null ? h(GrantedMenu, {
          key: 'headerUtilities',
          zone: 'headerUtilities',
          t,
          container: headerUtilitiesContainer,
          chrome: () => headerUtilitiesAnchorChrome(),
          rows: headerStored.map((entry) => ({ id: entry.id, label: entry.label, current: false })),
          onPick: (row) => {
            if (!clickStoredButton('headerUtilities', row.id)) console.warn('[dsh-layout] 找不到收纳的会话头按钮', row.label);
          },
        }) : null,
        settingsActionStored.length > 0 ? h(GrantedMenu, {
          key: 'settingsActions',
          zone: 'settingsActions',
          t,
          container: settingsActionsContainer,
          chrome: () => settingsActionsAnchorChrome(t),
          rows: settingsActionStored.map((entry) => ({ id: entry.id, label: entry.label, current: false })),
          onPick: (row) => {
            if (!clickStoredButton('settingsActions', row.id)) console.warn('[dsh-layout] 找不到收纳的设置页页头按钮', row.label);
          },
        }) : null);
    }

    /**
     * 会话区卡片：内容宽度 + 四组拆解（基础三块与换序、会话头内部、消息区、输入区）。
     * 拆解项的开关由 PART_UNITS 声明表生成，卡片只负责摆位置。
     */
    function ConversationCard({ config, targets, t }) {
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
        h(ObservationNote, { area: 'center', targets, t }),
        h(PartSection, { sectionId: 'convBase', config, targets, t }),
        h(PartSection, { sectionId: 'convHeader', config, targets, t }),
        h(PartSection, { sectionId: 'messagesParts', config, targets, t }),
        h(PartSection, { sectionId: 'composerParts', config, targets, t }));
    }

    /** 右栏卡片：标签栏/内容区拆解（宽度在「区域结构」里调）。 */
    function RightbarCard({ config, targets, t }) {
      return h(Card, { title: t('rightbarPanel'), desc: t('rightbarPanelHint') },
        h(ObservationNote, { area: 'rightbar', targets, t }),
        h(PartSection, { sectionId: 'rightbarParts', config, targets, t }));
    }

    function SettingsCard({ config, targets, t }) {
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
        h(ObservationNote, { area: 'settings', targets, t }),
        h(PartSection, { sectionId: 'settingsParts', config, targets, t }));
    }

    /**
     * 面板正文：工具区、分页条、滚动卡片区、底栏四段。
     * 四段都是 `.dshl-panel` 的直接子节点（靠 flex 排），只有卡片区滚动，
     * 这样滚到哪一页都还能切分页、导出配置。浮层面板与详情页入口共用这一份正文。
     */
    function EditorBody({ t }) {
      const { config, targets, ui, dirty } = useStoreSnapshot();
      const [message, setMessage] = React.useState(null);
      const [activeTab, setActiveTab] = React.useState(readStoredEditorTab);
      const fileRef = React.useRef(null);
      const tabRefs = React.useRef({});
      const activeTabSpec = EDITOR_TABS.find((item) => item.id === activeTab) ?? EDITOR_TABS[0];
      const selectTab = (tabId) => {
        setActiveTab(tabId);
        writeStoredEditorTab(tabId);
      };
      /* 分页条按 WAI-ARIA tabs 模式走 roving tabindex：只有激活项进 Tab 序列，
         ←/→ 切相邻页，Home/End 跳到首尾。否则六个页签各占一个 Tab 位、方向键无效。 */
      const onTabKeyDown = (event) => {
        const index = EDITOR_TABS.findIndex((item) => item.id === activeTab);
        const count = EDITOR_TABS.length;
        let next = -1;
        if (event.key === 'ArrowRight') next = (index + 1) % count;
        else if (event.key === 'ArrowLeft') next = (index - 1 + count) % count;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = count - 1;
        if (next === -1) return;
        event.preventDefault();
        const spec = EDITOR_TABS[next];
        selectTab(spec.id);
        tabRefs.current[spec.id]?.focus();
      };
      const cardRenderers = {
        schemes: () => h(SchemesCard, { config, t }),
        structure: () => h(StructureCard, { config, t }),
        blocks: () => h(BlocksCard, { config, targets, t }),
        panels: () => h(PanelsCard, { config, targets, t }),
        storage: () => h(StorageCard, { config, targets, t }),
        surfaces: () => h(SurfacesCard, { targets, t }),
        coverage: () => h(CoverageCard, { config, targets, t }),
        pluginPages: () => h(PluginPagesCard, { targets, t }),
        externalUnits: () => h(ExternalUnitsCard, { config, targets, t }),
        pluginSources: () => h(PluginSourcesCard, { config, targets, t }),
        arrange: () => h(ArrangeCard, { config, targets, t }),
        relocate: () => h(RelocateCard, { config, targets, t }),
        sync: () => h(SyncCard, { config, targets, t }),
        rules: () => h(RulesCard, { config, targets, t }),
        conversation: () => h(ConversationCard, { config, targets, t }),
        rightbar: () => h(RightbarCard, { config, targets, t }),
        settings: () => h(SettingsCard, { config, targets, t }),
      };

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
          || config.columns.hideCenter
          || config.sidebar.panelHidden.length > 0
          || config.sidebar.hidden.length >= BLOCKS.length);

      return h(React.Fragment, null,
        h('div', { className: 'dshl-panelTool' },
          h('div', { className: 'dshl-controlRow' },
            h('div', { className: 'dshl-control' },
              h('span', { className: 'dshl-rowLabel' }, t('enable')),
              h(Switch, {
                checked: config.enabled,
                label: t('enable'),
                onChange: (on) => updateConfig((draft) => { draft.enabled = on; }, { capture: on }),
              })),
            h('div', { className: 'dshl-control' },
              h('span', { className: 'dshl-rowLabel' }, t('editing')),
              h(Switch, {
                checked: ui.editing,
                label: t('editing'),
                onChange: (on) => {
                  if (on && !snapshot.config.enabled) updateConfig((draft) => { draft.enabled = true; }, { capture: true });
                  setEditing(on);
                },
              })),
            h('div', { className: 'dshl-control' },
              h('button', { type: 'button', className: 'dshl-btn', 'data-primary': 'true', onClick: openBoard }, t('boardOpen')))),
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
          risky ? h('p', { className: 'dshl-warn' }, t('riskyHint')) : null),
        h('div', { className: 'dshl-panelTabs' },
          h('div', { className: 'dshl-tabs', role: 'tablist', 'aria-label': t('title'), onKeyDown: onTabKeyDown },
            ...EDITOR_TABS.map((tabSpec) => h('button', {
              key: tabSpec.id,
              type: 'button',
              role: 'tab',
              id: `dshl-tab-${tabSpec.id}`,
              ref: (node) => { tabRefs.current[tabSpec.id] = node; },
              className: 'dshl-tab',
              tabIndex: activeTab === tabSpec.id ? 0 : -1,
              'data-active': activeTab === tabSpec.id ? 'true' : undefined,
              'aria-selected': activeTab === tabSpec.id ? 'true' : 'false',
              'aria-controls': `dshl-tabpanel-${tabSpec.id}`,
              onClick: () => selectTab(tabSpec.id),
            },
            h('span', { className: 'dshl-tabLabel' }, t(tabSpec.labelKey)),
            tabSpec.id === 'recognition' && (targets.anomalies?.length ?? 0) > 0
              ? h('span', { className: 'dshl-tabBadge' }, String(targets.anomalies.length))
              : null)))),
        h('div', { className: 'dshl-panelBody' },
          h('div', {
            className: 'dshl-tabPanel',
            role: 'tabpanel',
            id: `dshl-tabpanel-${activeTab}`,
            'aria-labelledby': `dshl-tab-${activeTab}`,
            tabIndex: 0,
            'data-tab': activeTab,
          },
          h('p', { className: 'dshl-hint dshl-tabHint' }, t(activeTabSpec.hintKey)),
          h('div', { className: 'dshl-cards' }, activeTabSpec.cards.map((cardId) => cardRenderers[cardId]())))),
        h('div', { className: 'dshl-panelFoot' },
          /* 保存 / 还原：所有布局改动先落在内存里，按「保存」才写进宿主与本地缓存。
             这样宿主永远收不到中间态，也就没有「被旧快照盖回去」的回退与循环。 */
          h('button', {
            type: 'button',
            className: 'dshl-btn',
            'data-primary': dirty ? 'true' : undefined,
            disabled: !dirty,
            onClick: saveConfig,
          }, t('saveConfig')),
          h('button', {
            type: 'button',
            className: 'dshl-btn',
            disabled: !dirty,
            onClick: revertConfig,
          }, t('revertConfig')),
          dirty ? h('span', { className: 'dshl-dirtyBadge' }, t('unsavedHint')) : null,
          h('button', { type: 'button', className: 'dshl-btn', onClick: exportFile }, t('exportData')),
          h('button', { type: 'button', className: 'dshl-btn', onClick: () => fileRef.current !== null && fileRef.current.click() }, t('importData')),
          h('input', { ref: fileRef, type: 'file', accept: 'application/json,.json', style: { display: 'none' }, onChange: importFile }),
          message === null ? null : h('span', { className: 'dshl-message', 'data-error': message.ok ? 'false' : 'true' }, message.text)));
    }

    /** 面板标题上的当前页面：设置浮层 > 会话页 > 插件详情页 > 外部插件页 > 侧栏面板名。 */
    function currentPageLabel(targets, t) {
      if (areaLive(targets, 'settings')) return t('surfaceSettingsDialog');
      if (areaLive(targets, 'center')) return t('surfaceConversation');
      if (document.querySelector('[data-plugin-detail]') !== null) return t('surfacePluginDetail');
      const external = targets.external;
      if (external !== null && external !== undefined) return external.pageKey;
      const panel = activePageKey();
      return panel === '(unknown)' ? t('surfacePluginsManager') : panel;
    }

    /** 画框层的区域名翻译：只有四个固定区域，缺一个就退回原始名。 */
    function frameHostLabel(name, t) {
      const key = { sidebar: 'sidebar', center: 'center', rightbar: 'rightbar', settings: 'settingsPanel', bottom: 'bottomBar' }[name];
      return key === undefined ? name : t(key);
    }

    /**
     * 画框中间层：全屏捕捉鼠标，拖出一个矩形作为搬移的落位与宽度。
     *
     * 为什么要有这一层（取代原来的「选目标容器 + 选开头/结尾」）：
     * 目标容器与位置这两维在「用户能直接指出位置」的前提下不需要建模。用户画出什么位置就是什么位置，
     * 于是配置里只剩几何，槽位表与形状表整类问题随之消失（docs/plans/已完成/2026-11-10-搬移改画框.md）。
     *
     * 交互：
     * - 空白处按下并拖 → 画一个新框，松手提交
     * - 已有框时**框内按住拖 → 整体移动**（不必重画；只改位置，不走宽度放大）
     * - **拖右边中段 → 改宽度**
     * - 方向键微调 1px（Shift+方向键 10px），Enter 提交，Esc / 右键 / 「取消」退出
     *
     * 松手前实时显示最终会落在哪里（含自动让位后的位置），所见即所得。
     */
    function FrameLayer({ t }) {
      const { targets, ui } = useStoreSnapshot();
      const sourceId = ui.framer;
      const [rect, setRect] = React.useState(null);
      const [hint, setHint] = React.useState('');
      /** 拖拽意图：new（新画）/ move（整体平移）/ width（改右边缘宽）。 */
      const dragRef = React.useRef(null);
      const rootRef = React.useRef(null);
      const source = React.useMemo(
        () => (sourceId === '' ? null : (relocateSources(targets).find((item) => item.id === sourceId) ?? null)),
        [targets, sourceId],
      );
      const sourceBox = source === null ? null : relocateSourceBox(source.node);
      const sourceWidth = sourceBox === null ? 0 : Math.ceil(sourceBox.width);
      const sourceHeight = sourceBox === null ? 40 : Math.ceil(sourceBox.height);
      /** 已有框：进入画框层时用它预填，于是「重画」变成「在旧框上微调」。 */
      const existing = sourceId === '' ? null : normalizeFrame(snapshot.config.relocate?.[sourceId]?.frame);

      // 首次进入时把已有框填进来；没有就等用户画
      React.useEffect(() => {
        if (sourceId === '') return undefined;
        const start = normalizeFrame(snapshot.config.relocate?.[sourceId]?.frame);
        setRect(start === null ? null : { x: start.x, y: start.y, w: start.w, h: Math.max(8, sourceHeight) });
        setHint('');
        return undefined;
        // 只在切换目标源时重置：拖拽过程中的 rect 变化不该把框重置回旧值
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [sourceId]);

      // 源在画框期间被 React 重建（页面切换、列表增删）时直接退出，避免对着不存在的东西画框
      React.useEffect(() => {
        if (sourceId !== '' && source === null) setFramer('');
      }, [sourceId, source]);

      /**
       * 用与落位完全相同的判据算「最终会落在哪」：预览说没事、松手就跑掉是不可接受的。
       * 返回 { probe, host, boxes, resolved, hits } 供提示条与影子框共用。
       */
      const evaluate = (candidate) => {
        if (candidate === null) return null;
        const width = Math.max(FRAME_MIN_WIDTH, candidate.w, sourceWidth);
        const probe = { x: candidate.x, y: candidate.y, width, height: Math.max(8, candidate.h) };
        const host = relocateHostOf(probe, targets);
        const boxes = relocateObstacles(host, source === null ? null : source.node);
        const hits = boxes.some((box) => frameHitsContainer(probe, box));
        const resolved = relocateResolveFrame(probe, boxes, projectionTopBound(), { width: window.innerWidth, height: window.innerHeight });
        return { probe, host, boxes, resolved, hits };
      };

      const describe = (candidate) => {
        if (candidate === null || candidate.w < 8 || candidate.h < 8) {
          setHint(t('frameTooSmall'));
          return;
        }
        const result = evaluate(candidate);
        if (result === null) return;
        const place = result.host === null ? t('frameNoHost') : t('frameHost')(frameHostLabel(result.host.name, t));
        const state = result.hits ? (result.resolved.conflict === true ? t('frameConflict') : t('frameMigrate')) : t('frameClean');
        setHint(`${t('frameHint')(result.probe.width, sourceWidth)} · ${place} · ${state}`);
      };

      const resolveRect = (start, current) => {
        const left = Math.min(start.x, current.x);
        const top = Math.min(start.y, current.y);
        return {
          x: Math.round(left),
          y: Math.round(top),
          w: Math.round(Math.abs(current.x - start.x)),
          h: Math.round(Math.abs(current.y - start.y)),
        };
      };

      const REACH = 18;
      /**
       * 按下时的意图判定。
       *
       * 一个必须避开的坑：已有框时，在框外按下若立刻当成「新画」，用户只是想挪一下
       * 却点偏了几个像素，旧框就被整个丢掉、回到「从零画」。所以框外按下先标记为
       * `new`，**等移动超过阈值才真正切到新画**（拖拽开始时才 setRect），单击则什么都不改。
       */
      const onPointerDown = (event) => {
        if (event.button !== 0) {
          setFramer('');
          return;
        }
        event.preventDefault();
        const point = { x: event.clientX, y: event.clientY };
        if (rect !== null && rect.w >= 8) {
          const nearRightEdge = point.x >= rect.x + rect.w - REACH && point.x <= rect.x + rect.w + REACH
            && point.y >= rect.y && point.y <= rect.y + rect.h;
          const inside = point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h;
          if (nearRightEdge) dragRef.current = { mode: 'width', origin: point, base: rect, armed: true };
          else if (inside) dragRef.current = { mode: 'move', origin: point, base: rect, armed: true };
          // 框外：先待命，移动超过阈值才切成新画
          else dragRef.current = { mode: 'outside', origin: point, base: rect, armed: false };
        } else {
          dragRef.current = { mode: 'new', origin: point, base: null, armed: true };
          setRect({ x: point.x, y: point.y, w: 0, h: 0 });
        }
        try { rootRef.current?.setPointerCapture(event.pointerId); } catch (error) { /* 合成事件可能没有 pointerId */ }
      };

      const onPointerMove = (event) => {
        const drag = dragRef.current;
        if (drag === null) return;
        const point = { x: event.clientX, y: event.clientY };
        // 框外待命：位移够大才承认是「另画一个」，否则原框一律不动
        if (drag.mode === 'outside') {
          if (Math.abs(point.x - drag.origin.x) < 6 && Math.abs(point.y - drag.origin.y) < 6) return;
          drag.mode = 'new';
          setRect({ x: drag.origin.x, y: drag.origin.y, w: 0, h: 0 });
        }
        if (drag.mode === 'new') {
          const candidate = resolveRect(drag.origin, point);
          setRect(candidate);
          describe(candidate);
          return;
        }
        const dx = Math.round(point.x - drag.origin.x);
        if (drag.mode === 'move') {
          const candidate = { x: drag.base.x + dx, y: drag.base.y, w: drag.base.w, h: drag.base.h };
          setRect(candidate);
          describe(candidate);
          return;
        }
        // width：只改宽度，位置与高度不动
        const candidate = { x: drag.base.x, y: drag.base.y, w: Math.max(8, drag.base.w + dx), h: drag.base.h };
        setRect(candidate);
        describe(candidate);
      };

      const finishDrag = (event) => {
        const drag = dragRef.current;
        dragRef.current = null;
        if (drag === null) return;
        // 框外单击（没越过阈值）：什么都不改，保留原框
        if (drag.mode === 'outside') return;
        if (drag.mode === 'new') {
          const candidate = resolveRect(drag.origin, { x: event.clientX, y: event.clientY });
          // 单击（没拖出尺寸）视为误触，不提交——否则一个点击就会把源挪到鼠标点
          if (candidate.w < 8 || candidate.h < 8) {
            setRect(null);
            return;
          }
          commitFrame(sourceId, candidate);
          return;
        }
        // 平移或改宽：按当前框提交，宽度不走「放大到源宽」
        if (rect === null || rect.w < 8) {
          setRect(null);
          return;
        }
        commitFrame(sourceId, rect, 'nudge');
      };

      React.useEffect(() => {
        const onKeyDown = (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            setFramer('');
            return;
          }
          if (event.key === 'Enter' && rect !== null && rect.w >= 8) {
            event.preventDefault();
            commitFrame(sourceId, rect, 'nudge');
            return;
          }
          const step = event.shiftKey ? 10 : 1;
          const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
          if (delta === undefined || rect === null) return;
          event.preventDefault();
          const next = { ...rect, x: rect.x + delta[0], y: rect.y + delta[1] };
          setRect(next);
          describe(next);
        };
        // 捕获阶段先拦：画框层在最上面，Esc 不该同时触发面板/白板的逐层退出
        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
        // rect 进依赖：方向键与 Enter 都要读当前框
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [rect, sourceId]);

      if (sourceId === '') return null;
      const label = source === null
        ? sourceId
        : (source.labelKey === null ? source.name : t(source.labelKey));
      const shown = rect !== null && rect.w >= 8 && rect.h >= 8 ? rect : null;
      const preview = shown === null ? null : evaluate(shown);
      // 落位影子：自动让位后的真实位置。与框重合时不画，避免叠一条重线。
      const shadow = preview === null || (preview.resolved.x === shown.x && preview.resolved.y === shown.y) ? null : preview.resolved;
      return h('div', {
        className: 'dshl-framer',
        'data-dshl-layer': '',
        ref: rootRef,
        onPointerDown,
        onPointerMove,
        onPointerUp: finishDrag,
        onContextMenu: (event) => { event.preventDefault(); setFramer(''); },
      },
      shadow === null ? null : h('div', {
        className: 'dshl-frameRect',
        'data-preview': 'true',
        style: { left: `${shadow.x}px`, top: `${shadow.y}px`, width: `${shadow.width}px`, height: `${Math.max(8, shown.h)}px` },
      }),
      shown === null ? null : h('div', {
        className: 'dshl-frameRect',
        style: { left: `${shown.x}px`, top: `${shown.y}px`, width: `${shown.w}px`, height: `${shown.h}px` },
      },
      // 右边缘的改宽抓手：只有已画出框时才出现
      shown === null ? null : h('div', {
        className: 'dshl-frameGrip',
        style: { left: `${shown.x + shown.w - 3}px`, top: `${shown.y + shown.h / 2 - 14}px` },
      })),
      h('div', { className: 'dshl-frameHint' },
        h('div', null, t('frameTitle')(label)),
        hint === '' ? h('div', { className: 'dshl-frameUsage' }, t(existing === null ? 'frameUsage' : 'frameUsageExisting')) : h('div', null, hint),
        h('div', { className: 'dshl-frameCtl' },
          shown === null ? null : h('button', {
            type: 'button',
            className: 'dshl-btn',
            'data-primary': 'true',
            onClick: (event) => { event.stopPropagation(); commitFrame(sourceId, shown, 'nudge'); },
          }, t('frameApply')),
          h('button', {
            type: 'button',
            className: 'dshl-btn',
            onClick: (event) => { event.stopPropagation(); setFramer(''); },
          }, t('frameCancel')))));
    }

    /** 全局编辑面板：任意页面都能打开，开着时识别与预览都对着当前界面。 */
    function EditorPanel({ t }) {
      const { targets, ui } = useStoreSnapshot();
      const page = currentPageLabel(targets, t);
      return h('div', {
        className: 'dshl-panel',
        'data-dshl-layer': '',
        'data-side': ui.side ?? 'right',
        role: 'dialog',
        'aria-label': t('panelTitle'),
      },
      h('div', { className: 'dshl-panelHead' },
        h('span', { className: 'dshl-panelTitle' }, t('panelTitle')),
        h('span', { className: 'dshl-panelPage', title: page }, t('panelCurrentPage')(page)),
        h('button', {
          type: 'button',
          className: 'dshl-iconBtn',
          title: ui.side === 'left' ? t('panelSideRight') : t('panelSideLeft'),
          'aria-label': ui.side === 'left' ? t('panelSideRight') : t('panelSideLeft'),
          onClick: () => setPanelSide(ui.side === 'left' ? 'right' : 'left'),
        }, icon(ICON_SWAP, 14)),
        h('button', {
          type: 'button',
          className: 'dshl-iconBtn',
          title: t('panelClose'),
          'aria-label': t('panelClose'),
          onClick: () => setPanel(false),
        }, icon(ICON_CLOSE, 14))),
      h(EditorBody, { t }));
    }

    /** 插件详情页入口：编辑器搬进全局浮层后，这里只留开关、入口与约束说明。 */
    function PluginEntry({ t }) {
      const { config, targets, ui } = useStoreSnapshot();
      const risky = config.enabled
        && (config.columns.hideSidebar
          || config.columns.hideCenter
          || config.sidebar.panelHidden.length > 0
          || config.sidebar.hidden.length >= BLOCKS.length);
      return h('div', { className: 'dshl-root dshl-entry' },
        h('div', { className: 'dshl-head' },
          h('div', { className: 'dshl-headText' },
            h('h3', { className: 'dshl-title' }, t('title')),
            h('p', { className: 'dshl-desc' }, t('desc'))),
          h('span', { className: 'dshl-status' },
            h('span', { className: 'dshl-dot', 'data-ok': targets.ok ? 'true' : 'false' }),
            targets.ok ? t('detected') : t('notDetected'))),
        h('div', { className: 'dshl-controlRow' },
          h('button', { type: 'button', className: 'dshl-btn', 'data-primary': 'true', onClick: openPanel }, t('panelOpen')),
          h('div', { className: 'dshl-control' },
            h('span', { className: 'dshl-rowLabel' }, t('enable')),
            h(Switch, {
              checked: config.enabled,
              label: t('enable'),
              onChange: (on) => updateConfig((draft) => { draft.enabled = on; }, { capture: on }),
            }))),
        h('p', { className: 'dshl-hint' }, t('panelEntryHint')),
        ui.panel ? h('p', { className: 'dshl-hint' }, t('panelOpened')) : null,
        risky ? h('p', { className: 'dshl-warn' }, t('riskyHint')) : null,
        h('p', { className: 'dshl-hint' }, t('shortcutHint')),
        h('p', { className: 'dshl-hint' }, t('disabledHint')));
    }

    /* ============================== 布局白板（按需加载） ============================== */
    /**
     * 白板主体在独立 chunk `client.board.js` 里：主 bundle 已七千行，白板再加一千行会让它难以维护。
     * 这里只做三件事——首次打开时按需加载、把 chunk 的组件挂上去、加载失败时降级提示。
     *
     * 加载走 loader 的 `require.async('./client.board.js')`（DSH client-modules 原生支持的
     * 包内异步 chunk，chunk 自己用 `{ id, chunk, factory }` 注册）。失败不影响任何现有功能：
     * 用户仍能用编辑面板与全部恢复通道。
     * 详见 docs/plans/2026-11-09-布局白板.md。
     */
    let boardModule = null;
    let boardLoading = false;
    let boardError = null;
    const boardListeners = new Set();

    function notifyBoard() {
      for (const listener of boardListeners) {
        try {
          listener();
        } catch (error) {
          console.warn('[dsh-layout] 白板订阅回调失败', error);
        }
      }
    }

    function loadBoardModule() {
      if (boardModule !== null || boardLoading) return;
      boardLoading = true;
      boardError = null;
      notifyBoard();
      // 没有 require.async 的宿主（老版本 loader）直接降级
      const asyncRequire = typeof require.async === 'function' ? require.async : null;
      if (asyncRequire === null) {
        boardLoading = false;
        boardError = 'require.async 不可用';
        notifyBoard();
        return;
      }
      Promise.resolve()
        .then(() => asyncRequire('./client.board.js'))
        .then((mod) => {
          boardModule = mod;
          boardLoading = false;
          if (typeof mod.ensureBoardCss === 'function') mod.ensureBoardCss();
          notifyBoard();
        })
        .catch((error) => {
          boardModule = null;
          boardLoading = false;
          boardError = String(error);
          console.warn('[dsh-layout] 白板模块加载失败，编辑面板与恢复通道不受影响', error);
          notifyBoard();
        });
    }

    function useBoardModule() {
      const [, setTick] = React.useState(0);
      React.useEffect(() => {
        const listener = () => setTick((value) => value + 1);
        boardListeners.add(listener);
        return () => boardListeners.delete(listener);
      }, []);
      return { module: boardModule, loading: boardLoading, error: boardError };
    }

    /** 白板层：只在打开时加载 chunk；加载中与失败各有明确提示，不留白屏。 */
    function BoardLayer({ t }) {
      const { module: loaded, loading, error } = useBoardModule();
      React.useEffect(() => {
        loadBoardModule();
      }, []);
      if (error !== null) {
        return h('div', { className: 'dshl-boardFallback', 'data-dshl-layer': '' },
          h('div', { className: 'dshl-boardFallbackBox' },
            h('p', null, `${t('boardTitle')}：${t('boardLoadFail')}`),
            h('p', { className: 'dshl-hint' }, error),
            h('button', { type: 'button', className: 'dshl-btn', onClick: () => { setBoard(false); setPanel(true); } }, t('boardAdvanced'))));
      }
      if (loaded === null || loading) {
        return h('div', { className: 'dshl-boardFallback', 'data-dshl-layer': '' },
          h('div', { className: 'dshl-boardFallbackBox' }, h('p', null, t('boardLoading'))));
      }
      return h(loaded.Board, { t });
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

      // 面板、白板与编辑模式都能用 Esc 退出：白板 → 编辑模式 → 面板，逐层退。
      // 设置浮层在场时交给它自己处理；排除本插件自己的 dialog，否则打开面板后 Esc 永远被自己拦掉。
      React.useEffect(() => {
        if (!ui.editing && !ui.panel && !ui.board) return undefined;
        const onKeyDown = (event) => {
          if (event.key !== 'Escape' || event.defaultPrevented) return;
          if (document.querySelector('[role="dialog"]:not(.dshl-panel)') !== null) return;
          // 白板是最上层，先关它；它开着时面板与编辑模式本来就被关掉了
          if (snapshot.ui.board) {
            setBoard(false);
            return;
          }
          if (snapshot.ui.editing) {
            setEditing(false);
            return;
          }
          setPanel(false);
        };
        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
      }, [ui.editing, ui.panel, ui.board]);

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

      const panelNode = ui.panel ? h(EditorPanel, { t }) : null;
      // 设置弹层是 body 下的 fixed 层（z-index 1000）：留在 shell.overlay 里会被整层盖住，所以渲染到 body。
      const panel = panelNode === null || createPortal === null ? panelNode : createPortal(panelNode, document.body);
      // 白板同理：它要描在设置弹层、插件页这些页面之上，留在 overlay 里会被盖住（实测设置页打开后白板整条被压住）。
      const boardNode = ui.board ? h(Boundary, null, h(BoardLayer, { t })) : null;
      const board = boardNode === null || createPortal === null ? boardNode : createPortal(boardNode, document.body);
      // 画框层：要盖住设置弹层与插件页才能对着真实界面画框，所以同样渲染到 body。
      const framerNode = ui.framer === '' ? null : h(Boundary, null, h(FrameLayer, { t }));
      const framer = framerNode === null || createPortal === null ? framerNode : createPortal(framerNode, document.body);
      // 授予式「更多」：设置页导航与插件页第三方组没有 actions 槽位，锚点挂到这两个容器里
      const granted = h(GrantedStorageMenus, { t });
      // 面板不依赖三栏骨架：没有可拖区域时也能开，用于识别与调整。
      // 白板同理：它要能在「未启用 / 未识别结构」时打开（比如刚恢复默认想重新搭），所以一起带上。
      if (!active) return h(React.Fragment, null, granted, framer, board, panel);
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
            { key: 'edit', label: t('editing'), primary: false, run: () => { openPanel(); setEditing(true); } },
          ]
          : [{ key: 'edit', label: t('title'), iconSize: 14, primary: false, run: () => { openPanel(); setEditing(true); } }];
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
      return h(React.Fragment, null,
        h('div', { className: 'dshl-editLayer', 'data-dshl-layer': '' }, boxes, handles, launcher, toolbar),
        granted,
        // 白板是独立 chunk，只在打开时才挂载并加载；关闭时不占任何开销。portal 到 body 才能盖住设置弹层
        board,
        // 画框层同样 portal 到 body：要对着设置弹层、插件页这些真实界面画框
        framer,
        panel);
    }

    /* ============================== 插件装配 ============================== */
    const inject = ['slots', 'locale', 'configForms'];

    /**
     * 白板的宿主面：client.board.js 是独立 chunk，通过模块表 `require('dsh-layout')`
     * 取回这里的引用，从而共用同一份配置、识别结果与通用组件。
     *
     * 只暴露白板真正需要的东西。白板不复制状态、不自己写 localStorage，
     * 所有改动都经 updateConfig / replaceConfig 走同一套校验与持久化
     * （docs/plans/2026-11-09-布局白板.md）。
     */
    const boardHost = {
      t: null,
      h,
      React,
      Switch,
      BLOCKS,
      PART_UNITS,
      BLOCK_LABEL_KEYS,
      readPath,
      writePath,
      pageKindOf,
      /** 画框入口：白板的属性面板用它把「搬移到」换成「重画框」，两边共用同一套逻辑。 */
      setFramer,
      relocateSources,
      relocateResolve,
      /**
       * 白板读骨架用的页面 key：**必须与主 bundle 写快照时同一套判定**。
       * 白板原先自己用 pageKindOf 推导（会话优先），而写快照用 boardPageKey（第三方页优先），
       * 两套顺序在第三方插件页上会给出不同 key —— 白板于是读不到刚写的那一页骨架。
       * 这里直接暴露宿主实现，白板不再自己算。
       */
      boardPageKey,
      currentPageLabel,
      useStoreSnapshot,
      updateConfig,
      replaceConfig,
      applyPreset,
      setBoard,
      setPanel,
      openBoard,
      /** 白板切页面场景：复用宿主 layout 服务与快捷键，不自己造路由。 */
      navigate(kind) {
        if (kind === 'settings') {
          // 设置弹层由宿主快捷键打开（Ctrl/⌘ + Alt + ,）；侧栏那个「设置」是菜单触发器，
          // 点它只会弹出菜单，不会直接开面板（实测）。
          window.dispatchEvent(new KeyboardEvent('keydown', {
            key: ',', code: 'Comma', ctrlKey: true, altKey: true, bubbles: true, cancelable: true,
          }));
          return;
        }
        const layout = typeof ctxRef?.get === 'function' ? ctxRef.get('layout') : undefined;
        if (layout === null || layout === undefined || typeof layout.selectPanel !== 'function') return;
        try {
          // 会话页 = 关掉主面板；插件页 = 切到宿主自带的插件面板；插件详情页只能从插件页点进去，先到插件页
          if (kind === 'conversation') layout.selectPanel(null);
          else layout.selectPanel('plugins');
        } catch (error) {
          console.warn('[dsh-layout] 白板切页面失败，本次跳过', error);
        }
      },
      /** 白板读骨架：按页面 key 取几何快照。 */
      readGeometry(key) {
        return boardGeometry[key] ?? null;
      },
      /** 白板查漂移：骨架与真实结构对不上时返回诊断（null = 一致）。 */
      readDrift() {
        return boardGeometryDrift(snapshot.targets);
      },
      /** 白板切到骨架态时冻结该页快照：否则自动刷新会让漂移永远检测不到。 */
      freezeGeometry(key) {
        boardFrozenPage = key;
      },
      unfreezeGeometry() {
        boardFrozenPage = null;
      },
      /** 白板「重新抓取」：立刻重量当前页并落盘。 */
      recordGeometryNow() {
        // 重新抓取要先解冻，否则 recordBoardGeometry 会因冻结直接返回
        boardFrozenPage = null;
        recordBoardGeometry(snapshot.targets, true);
        notify();
      },
    };
    let ctxRef = null;

    function apply(ctx) {
      const t = ctx.locale.bind(NS);
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-layout: dictionaries');
      // 插件来源面板依赖 slots 注册表；拿不到就整体降级，不影响几何拆解
      bindSlotsService(ctx);
      // 宿主设置文档：配置与方案的第一存储（跨浏览器），服务不在场时全程走 localStorage（docs/plans/2026-11-08-配置跨浏览器持久化.md）
      bindHostForm(ctx);
      // 白板宿主面要用 ctx 切页面（layout.selectPanel）与取快捷键
      ctxRef = ctx;
      boardHost.t = t;

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
          projectionClear();
          removeStyles();
        };
      }, 'dsh-layout: interface bridge');

      ctx.effect(() => subscribe(() => {
        applyDynamicCss();
        applyRelocations();
      }), 'dsh-layout: layout styles');

      // 投影对齐：滚动与缩放会让目标位置漂移，重新起一帧校准（收敛后帧循环自己停）
      ctx.effect(() => {
        const kick = () => {
          if (projection.entries.size > 0) ensureProjectionLoop();
        };
        window.addEventListener('scroll', kick, { capture: true, passive: true });
        window.addEventListener('resize', kick);
        return () => {
          window.removeEventListener('scroll', kick, true);
          window.removeEventListener('resize', kick);
        };
      }, 'dsh-layout: projection alignment');

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

      // 会话头「更多操作」菜单：点击锚点后等菜单出现，把收纳行注入进去（纯 DOM，卸载时摘监听即可）
      ctx.effect(() => {
        document.addEventListener('click', onHostMorePointer, true);
        return () => {
          document.removeEventListener('click', onHostMorePointer, true);
          if (hostMoreWatchTimer !== null) window.clearTimeout(hostMoreWatchTimer);
          hostMoreWatchTimer = null;
        };
      }, 'dsh-layout: host more menu');

      ctx.effect(() => {
        /* 快捷键只开面板，不再顺带进编辑模式：编辑模式是「直接在界面上拖分隔条」的
           另一种工作方式，跟面板是并列的两条路径。原先一起触发，按一次快捷键会同时
           打开面板并在界面上铺一层可拖的虚线框，两套交互叠在一起。 */
        const activate = () => openPanel();
        const shortcuts = typeof ctx.get === 'function' ? ctx.get('shortcuts') : undefined;
        if (shortcuts !== null && shortcuts !== undefined && typeof shortcuts.register === 'function') {
          try {
            return shortcuts.register({
              id: 'dsh-layout.panel',
              label: () => t('panelShortcut'),
              aliases: ['layout', 'panel', '布局'],
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
      }, 'dsh-layout: panel shortcut');

      /**
       * 桌面端诊断：注册到 window 上，用户重载插件后直接在 DevTools 调
       * `__dshlDesktopProbe({ winBarH: 40 })` 即可，不需要粘贴脚本。
       *
       * 为什么要内置：Electron 里没法用 fetch 读本地文件，让用户手动粘贴整个脚本
       * 容易漏（实测用户只输了一行调用就报 not defined）。注册到 window 上就没有这个摩擦。
       *
       * 采集的是「Web 端测不出来、桌面端才可能出问题」的因素：
       * 祖先链上的 transform/filter/contain（会让 position:fixed 失效或偏移）、
       * 窗口栏覆盖区、投影与占位符偏差、面板是否被别的东西盖着。
       */
      function registerDesktopProbe() {
        window.__dshlDesktopProbe = function desktopProbe(options = {}) {
          const winBarH = options.winBarH ?? 40;
          const report = { at: new Date().toISOString(), env: {}, hijackers: [], windowBarViolations: [], relocation: [], panel: null, verdict: [] };
          report.env = {
            electron: /Electron/i.test(navigator.userAgent),
            devicePixelRatio: window.devicePixelRatio,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            outerHeight: window.outerHeight,
            screenHeight: window.screen.height,
            bodyClientHeight: document.body.clientHeight,
            // 面板实际用的下界（投影与恢复按钮各自的下界函数）
            projectionTopBound: projectionTopBound(),
            launcherTopBound: launcherTopBound(),
          };
          // 1) 祖先样式劫持：position:fixed 的定位基准是视口，但祖先只要有
          //    transform/filter/perspective/will-change/contain 就会改成相对该祖先定位。
          const fixedSelectors = ['[data-dshl-teleport]', '.dshl-panel', '[data-dshl-button]', '.dshl-board'];
          const seen = new Set();
          for (const sel of fixedSelectors) {
            for (const el of document.querySelectorAll(sel)) {
              let node = el.parentElement;
              let depth = 1;
              while (node !== null && node !== document.documentElement && depth < 16) {
                const cs = getComputedStyle(node);
                const why = [];
                if (cs.transform !== 'none') why.push(`transform:${cs.transform.slice(0, 28)}`);
                if (cs.filter !== 'none') why.push(`filter:${cs.filter}`);
                if (cs.perspective !== 'none') why.push('perspective');
                if (cs.willChange !== 'auto' && /transform|filter|perspective/.test(cs.willChange)) why.push(`will-change:${cs.willChange}`);
                if (cs.contain !== 'none' && /paint|layout|strict|content/.test(cs.contain)) why.push(`contain:${cs.contain}`);
                if (why.length > 0) {
                  const key = `${sel}|${depth}|${String(node.className).slice(0, 30)}`;
                  if (!seen.has(key)) {
                    seen.add(key);
                    report.hijackers.push({ forSelector: sel, depth, tag: node.tagName, cls: String(node.className).slice(0, 44), why });
                  }
                }
                node = node.parentElement;
                depth += 1;
              }
            }
          }
          // 2) 窗口栏覆盖区
          const checkBar = (sel, kind) => {
            for (const el of document.querySelectorAll(sel)) {
              const r = el.getBoundingClientRect();
              if (r.width === 0 || r.height === 0) continue;
              const covered = Math.max(0, Math.round(winBarH - r.top));
              if (covered > 0) {
                report.windowBarViolations.push({
                  kind,
                  id: el.getAttribute('data-dshl-teleport') || el.getAttribute('data-dshl-button') || String(el.className).slice(0, 30),
                  top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), coveredPx: covered,
                });
              }
            }
          };
          checkBar('[data-dshl-teleport]', 'teleport');
          checkBar('[data-dshl-button]', 'launcher');
          // 3) 投影落位与内部压扁：没有占位符了，改比「配置里的框」与「节点实际矩形」
          for (const node of document.querySelectorAll('[data-dshl-teleport]')) {
            const id = node.getAttribute('data-dshl-teleport');
            const spec = snapshot.config.relocate?.[id] ?? null;
            const frame = spec === null ? null : normalizeFrame(spec.frame);
            const nb = node.getBoundingClientRect();
            /*
             * 让位是否真的生效：落位矩形与「它所在区域里已被占用的内容」再判一次相交。
             * 这是画框机制最容易静默失效的一环——源压住了内容却没人报错，
             * 用户只会觉得「搬过去把东西盖住了」。
             */
            const probe = { x: nb.left, y: nb.top, width: nb.width, height: nb.height };
            const host = relocateHostOf(probe, snapshot.targets);
            const boxes = relocateObstacles(host, node);
            const overlapping = boxes.filter((box) => frameHitsContainer(probe, box)).length;
            report.relocation.push({
              id,
              frame,
              host: host === null ? null : host.name,
              node: { x: Math.round(nb.x), y: Math.round(nb.y), w: Math.round(nb.width), h: Math.round(nb.height) },
              dx: frame === null ? null : Math.round(nb.x - frame.x),
              dy: frame === null ? null : Math.round(nb.y - frame.y),
              overlapping,
              transform: getComputedStyle(node).transform.slice(0, 40),
              zeroWidthChildren: [...node.querySelectorAll('*')].filter((child) => child.getBoundingClientRect().width === 0 && child.children.length === 0).length,
            });
          }
          /*
           * 3.5) 背景纹理来源：用户截图里会话区被一层点阵盖住，Web 端完全复现不出来。
           * 把「有背景图/网格纹理、且尺寸够大」的元素连同它的类名与样式来源一起报出来，
           * 就能判断是宿主的皮肤、某个插件的 skin，还是本插件误加的。
           */
          report.textures = [];
          for (const el of document.querySelectorAll('body *')) {
            const cs = getComputedStyle(el);
            const bg = cs.backgroundImage;
            if (bg === 'none') continue;
            if (!/gradient|url\(/.test(bg)) continue;
            const r = el.getBoundingClientRect();
            if (r.width < 120 || r.height < 80) continue;
            // 只报「重复铺开」的纹理（点阵/网格），不要普通的一张大图
            const repeats = /repeating-/.test(bg) || cs.backgroundRepeat.split(',').some((v) => v.trim() === 'repeat');
            if (!repeats) continue;
            report.textures.push({
              tag: el.tagName,
              cls: String(el.className).slice(0, 60),
              id: el.id || null,
              bgImage: bg.slice(0, 140),
              bgSize: cs.backgroundSize,
              rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
              fromThisPlugin: el.closest('[data-dshl-layer], [data-dshl-teleport]') !== null,
            });
            if (report.textures.length > 10) break;
          }
          // 4) 面板遮挡
          const panel = document.querySelector('.dshl-panel');          if (panel !== null) {
            const r = panel.getBoundingClientRect();
            const cs = getComputedStyle(panel);
            const topEl = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
            report.panel = {
              rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
              position: cs.position,
              zIndex: cs.zIndex,
              transform: cs.transform.slice(0, 30),
              topmostAtCenter: topEl === null ? null : `${topEl.tagName}.${String(topEl.className).slice(0, 36)}`,
              panelIsTopmost: topEl !== null && panel.contains(topEl),
            };
          }
          // 5) 结论
          if (!report.env.electron) report.verdict.push('注意：当前不在 Electron 里，桌面端字段意义有限');
          if (report.hijackers.length > 0) report.verdict.push(`发现 ${report.hijackers.length} 处祖先样式会劫持 position:fixed`);
          if (report.windowBarViolations.length > 0) report.verdict.push(`${report.windowBarViolations.length} 个 fixed 元素落在窗口栏覆盖区（点不到）`);
          if (report.textures.length > 0) {
            const own = report.textures.filter((t) => t.fromThisPlugin).length;
            report.verdict.push(`发现 ${report.textures.length} 处平铺背景纹理${own > 0 ? `（其中 ${own} 处来自本插件，需修）` : '（都不是本插件加的，是宿主或其它插件）'}`);
          }
          /*
           * 会话区可见内容体检：用户截图里会话区整块被点阵盖住、看不到正文。
           * 这里列出会话区每个直接子级的位置/尺寸与「中心点上最上层是谁」，
           * 一眼能看出是「内容被压没」还是「被别的东西盖住」。
           */
          const center = document.querySelector('[data-dshl-region="center"]');
          if (center !== null) {
            report.centerArea = [...center.children].map((child) => {
              const r = child.getBoundingClientRect();
              const cx = r.left + r.width / 2;
              const cy = r.top + r.height / 2;
              const hit = (r.width > 0 && r.height > 0) ? document.elementFromPoint(cx, cy) : null;
              return {
                tag: child.tagName,
                cls: String(child.className).slice(0, 44),
                rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
                topmostAtCenter: hit === null ? null : `${hit.tagName}.${String(hit.className).slice(0, 32)}`,
                coveredByOthers: hit !== null && !child.contains(hit) && hit !== child,
              };
            });
            const covered = report.centerArea.filter((row) => row.coveredByOthers);
            if (covered.length > 0) report.verdict.push(`会话区有 ${covered.length} 个子块中心点被别的东西盖住`);
          }
          /*
           * 对齐判定：现在没有占位符了，直接比「配置里的框」与「节点实际矩形」。
           * 只允许两种合法偏移——水平方向被视口夹取、纵向被窗口栏下推（dy >= 0 且落点在安全区内）。
           * 其余偏差都算错位。
           */
          const badReloc = report.relocation.filter((item) => {
            if (item.dx === null) return false;
            const insideBar = item.node !== null && item.node.y < winBarH;
            if (insideBar) return true;
            return Math.abs(item.dx) > 2 || (Math.abs(item.dy) > 2 && item.dy < 0);
          });
          if (badReloc.length > 0) report.verdict.push(`${badReloc.length} 个搬移落点与配置的框不对齐`);
          const clampedNow = report.relocation.filter((item) => item.dy !== null && item.dy > 2 && item.node !== null && Math.abs(item.node.y - winBarH) <= 2);
          if (clampedNow.length > 0) report.verdict.push(`（其中 ${clampedNow.length} 个是被窗口栏下推到 ${winBarH}px，属正常）`);
          /*
           * 让位失效检测：落位仍与内容相交，说明「碰撞迁移」没能把源挪开。
           * 只有 resolved.conflict 的条目才该这样（四周被占满、有意留在原位），其余都是 bug。
           * 这里按「有没有重叠」报出来，让用户知道是「压住了」而不是「界面自己坏了」。
           */
          const stillOverlapping = report.relocation.filter((item) => item.overlapping > 0);
          for (const item of stillOverlapping) {
            report.verdict.push(`搬移 ${item.id} 的落点仍与 ${item.overlapping} 块内容相交（区域：${item.host ?? '无'}）—— 要么四周确实占满，要么是让位逻辑没生效`);
          }
          if (report.panel !== null && !report.panel.panelIsTopmost) report.verdict.push('面板中心点上不是面板自己：可能有东西盖着它');
          if (report.verdict.length === 0) report.verdict.push('未发现已知问题模式，请把整份 JSON 贴回');
          console.log('=== dsh-layout 桌面端诊断 ===');
          for (const line of report.verdict) console.log('•', line);
          console.log(JSON.stringify(report, null, 2));
          return report;
        };
        console.log('[dsh-layout] 桌面端诊断已就绪：__dshlDesktopProbe({ winBarH: 40 })');
      }

      ctx.effect(() => {
        registerDesktopProbe();
        return () => { delete window.__dshlDesktopProbe; };
      }, 'dsh-layout: desktop probe');

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
        return h(Boundary, null, h(PluginEntry, { t }));
      })), 'dsh-layout: plugin detail section');

      ctx.effect(() => ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'dsh-layout-editor',
        order: 900,
        label: () => t('editLayer'),
      }, () => h(Boundary, null, h(EditOverlay, { t, ctx })))), 'dsh-layout: edit overlay');

      // 入口收纳：把收纳的入口行挂到各区的原生「更多」菜单里（宿主渲染菜单，我们只提供行）
      ctx.effect(() => ctx.slots.inject('sidebar.panellist.actions', () => ctx.slots.register({
        name: 'sidebar.panellist.actions',
        id: 'dsh-layout-storage',
        order: -100,
        locale: NS,
        label: () => t('storageMenuLabel'),
      }, (props) => h(Boundary, null, h(SidebarStorageMenu, { ...props, ctx })))), 'dsh-layout: sidebar storage menu');

      ctx.effect(() => ctx.slots.inject('conversation.session.header.views.actions', () => ctx.slots.register({
        name: 'conversation.session.header.views.actions',
        id: 'dsh-layout-storage-views',
        order: -100,
        locale: NS,
        label: () => t('storageMenuLabel'),
      }, (props) => h(Boundary, null, h(ViewsStorageMenu, { ...props })))), 'dsh-layout: view storage menu');

      ctx.effect(() => ctx.slots.inject('sidebar.right.tab.guide.actions', () => ctx.slots.register({
        name: 'sidebar.right.tab.guide.actions',
        id: 'dsh-layout-storage-guide',
        order: -100,
        locale: NS,
        label: () => t('storageMenuLabel'),
      }, (props) => h(Boundary, null, h(GuideStorageMenu, { ...props })))), 'dsh-layout: guide storage menu');
    }

    return { apply, inject, boardHost };
  },
});
