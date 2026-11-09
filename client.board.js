/**
 * 布局白板（包内异步 chunk）：全屏工作台。
 *
 * 为什么单独一个 chunk：主 bundle client.js 已 6800+ 行，白板再加一千行会让它难以维护。
 * DSH 的 client-modules loader 支持包内 chunk：本文件用
 * `__ModuleLoader__.load({ id: 'dsh-layout', chunk: 'client.board.js', factory })` 注册，
 * 主 bundle 在用户第一次打开白板时 `require.async('./client.board.js')` 按需加载。
 * 白板要用主 bundle 的识别结果、配置写入与通用组件，经模块表 `require('dsh-layout')` 取回
 * 主 bundle 导出的 boardHost，不复制第二份状态（docs/plans/2026-11-09-布局白板.md）。
 */
window.__ModuleLoader__.load({
  id: 'dsh-layout',
  chunk: 'client.board.js',
  factory: (require) => {
    const React = require('react');
    const h = React.createElement;
    // 主 bundle 导出的宿主面：状态、配置写入、通用组件、识别结果都在这里。
    // 经模块表取回同一个对象，不复制第二份状态。
    const host = require('dsh-layout').boardHost;

    /** 四层：区域 / 容器 / 槽位 / 控件。层决定进哪一栏，也决定属性面板给什么。 */
    const LAYERS = ['region', 'container', 'slot', 'control'];
    const LAYER_LABEL = { region: 'boardLayerRegion', container: 'boardLayerContainer', slot: 'boardLayerSlot', control: 'boardLayerControl' };
    const LAYER_COLOR = {
      region: 'var(--dshl-layer-region, #4c8dff)',
      container: 'var(--dshl-layer-container, #2fb37a)',
      slot: 'var(--dshl-layer-slot, #d99a2b)',
      control: 'var(--dshl-layer-control, #9b6ce0)',
    };

    /** 三栏区域与侧栏块沿用主 bundle 的既有枚举，不另立一套词。 */
    const REGION_ORDER = ['sidebar', 'center', 'rightbar'];
    const REGION_LABEL = { sidebar: 'sidebar', center: 'center', rightbar: 'rightbar', bottom: 'bottomBar', settings: 'settingsPanel' };
    /** 被当成「容器」的拆解单元；其余拆解单元落到「控件」栏，避免同一块结构在两栏各出现一次。 */
    const CONTAINER_PART_IDS = new Set(['conv-header', 'conv-messages', 'conv-composer', 'rb-tabs', 'rb-content', 'set-nav-hide', 'set-header', 'set-options']);

    /**
     * 顶部安全偏移：窗口栏是 Electron 原生 titleBarOverlay（本机实测高度 40px），
     * 它盖在 Web 层之上，DOM 里点不到那一带——浮层条原先放在 top:8px，整排按钮点不动。
     * 同时会话头也占 y 0..40，所以往下让到「页面头栏底边 + 间距」，两头都不压。
     * 用运行时测量而不是写死 48px：不同页面（插件页 / 设置弹层）头栏高度不一样。
     */
    function topSafeOffset() {
      const floor = 44;
      let offset = floor;
      const bar = document.querySelector('header');
      if (bar !== null) {
        const rect = bar.getBoundingClientRect();
        if (rect.top <= 4 && rect.height >= 20 && rect.height <= 80) offset = Math.max(offset, Math.round(rect.bottom) + 6);
      }
      return offset;
    }

    const BOARD_CSS = `
.dshl-board { position:fixed; inset:0; z-index:1260; display:flex; flex-direction:column; color:var(--dsw-alias-label-primary); font-size:13px; line-height:20px; pointer-events:none; }
/* 描图态：整层透明、点击穿透，只有框与工具条吃事件——这样真实界面既能看见也能操作 */
.dshl-board[data-mode="trace"] { background:transparent; }
/* 抽象态：整层遮住界面，成为独立工作台 */
.dshl-board[data-mode="skeleton"] { background:var(--dsw-alias-bg-layer-2); pointer-events:auto; }
/* 顶部条：位置由 --dshl-head-top 决定（运行时量页面头栏）。
   居中用 left:0/right:0 + margin auto，不能用 left:50% + translateX(-50%)——
   绝对定位下 left 定了、right 为 auto 时，可用宽度只有父级的一半，内容会被挤成两行。 */
.dshl-boardHead { position:absolute; left:0; right:0; top:var(--dshl-head-top, 48px); margin-inline:auto; width:max-content; z-index:2; display:flex; align-items:center; gap:5px; flex-wrap:wrap; justify-content:center; max-width:calc(100vw - 20px); padding:4px 9px; border-radius:999px; border:1px solid var(--dsw-alias-border-l2); background:color-mix(in srgb, var(--dsw-alias-bg-layer-1) 94%, transparent); box-shadow:0 4px 16px rgba(0,0,0,.24); pointer-events:auto; }
.dshl-boardTitle { font-size:12px; font-weight:600; white-space:nowrap; }
.dshl-boardPage { font-size:11px; color:var(--dsw-alias-label-secondary); white-space:nowrap; max-width:150px; overflow:hidden; text-overflow:ellipsis; }
.dshl-boardScenes { display:flex; align-items:center; gap:3px; flex-wrap:wrap; }
.dshl-boardScene { height:26px; padding:0 9px; border-radius:999px; border:1px solid var(--dsw-alias-border-l1); background:transparent; color:var(--dsw-alias-label-secondary); font:inherit; font-size:11px; cursor:pointer; white-space:nowrap; }
.dshl-boardScene:hover { background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-primary); }
.dshl-boardScene[data-active="true"] { border-color:var(--dsw-alias-brand-primary); color:var(--dsw-alias-brand-primary); background:color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent); }
.dshl-boardGrow { flex:1; min-width:0; }
/* 层级开关：四层各自可开关。默认关掉的层用虚线边框区分「关」与「开着但没框」 */
.dshl-boardLayers { display:flex; align-items:center; gap:3px; padding-left:6px; border-left:1px solid var(--dsw-alias-border-l2); }
.dshl-boardLayer { height:26px; padding:0 9px; border-radius:999px; border:1px dashed var(--dsw-alias-border-l1); background:transparent; color:var(--dsw-alias-label-secondary); font:inherit; font-size:11px; cursor:pointer; white-space:nowrap; }
.dshl-boardLayer[data-on="true"] { border-style:solid; color:var(--dsw-alias-label-primary); border-color:currentColor; background:color-mix(in srgb, currentColor 12%, transparent); }
.dshl-boardLayer:hover { background:var(--dsw-alias-interactive-bg-hover); }
/* 画布铺满整层：框用视口坐标减去画布原点，与真实元素严格对齐 */
.dshl-boardCanvasWrap { position:absolute; inset:0; overflow:hidden; }
.dshl-board[data-mode="skeleton"] .dshl-boardCanvasWrap { inset:auto; top:0; left:0; right:0; bottom:0; background:var(--dsw-alias-bg-layer-2); }
.dshl-boardCanvas { position:absolute; inset:0; }
.dshl-boardBox { position:absolute; border:1px solid; border-radius:4px; pointer-events:auto; cursor:pointer; background:transparent; padding:0; }
.dshl-boardBox:hover { background:color-mix(in srgb, currentColor 14%, transparent); }
.dshl-boardBox[data-active="true"] { border-width:2px; background:color-mix(in srgb, currentColor 20%, transparent); }
/* 下钻出来的子节点：虚线 + 呼吸感，提示「这些可以继续点」 */
.dshl-boardBox[data-drill="true"] { border-style:dashed; border-width:1.5px; }
.dshl-boardBox[data-drill="true"]:hover { border-style:solid; background:color-mix(in srgb, currentColor 22%, transparent); }
.dshl-boardBoxTag { position:absolute; left:0; top:-14px; font-size:10px; line-height:13px; padding:0 3px; border-radius:3px; white-space:nowrap; color:var(--dsw-alias-bg-layer-1); background:currentColor; }
/* 只在框够宽时才显示标签：窄框上挂标签会互相压住（实测侧栏里十几个框的标签叠成一团） */
.dshl-boardBoxTag[data-tight="true"] { display:none; }
.dshl-boardBoxTag[data-below="true"] { top:auto; bottom:-14px; }
.dshl-boardEmpty { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding:24px; text-align:center; color:var(--dsw-alias-label-secondary); font-size:12px; }
/* 骨架漂移提示条：骨架态贴在画布上方，提醒用户看到的是旧结构 */
/* 骨架漂移提示条同理：left/right 都定住再 margin auto，否则文案被压到父级一半宽。
   垂直位置接在顶部条下方，用同一组 CSS 变量。 */
.dshl-boardDrift { position:absolute; left:0; right:0; top:calc(var(--dshl-head-top, 48px) + var(--dshl-head-h, 32px) + 8px); margin-inline:auto; width:max-content; z-index:3; display:flex; align-items:center; gap:8px; max-width:calc(100vw - 40px); padding:6px 10px; border-radius:10px; border:1px solid color-mix(in srgb, var(--dsw-alias-state-warning-primary, #d99a2b) 60%, transparent); background:color-mix(in srgb, var(--dsw-alias-state-warning-primary, #d99a2b) 14%, var(--dsw-alias-bg-layer-1)); color:var(--dsw-alias-label-primary); font-size:11px; line-height:16px; box-shadow:0 4px 14px rgba(0,0,0,.22); pointer-events:auto; }
.dshl-boardDriftText { min-width:0; }
.dshl-boardDriftTitle { font-weight:600; }
.dshl-boardDriftBtn { flex:none; height:26px; padding:0 10px; border-radius:999px; border:1px solid var(--dsw-alias-border-l1); background:transparent; color:var(--dsw-alias-label-primary); font:inherit; font-size:11px; cursor:pointer; }
.dshl-boardDriftBtn:hover { background:var(--dsw-alias-interactive-bg-hover); }
/* 抽屉：描图态默认收起，按需拉出；收起时只剩一条窄标签，不遮挡真实界面 */
.dshl-boardDrawers { position:absolute; top:0; bottom:0; left:0; right:0; pointer-events:none; }
/* 抽屉的上下位置都由运行时写入的 CSS 变量决定：
   顶部条与底部条在窄屏会换行变高（实测 640px 下顶部条 67px、底部条 78px），
   写死偏移会让抽屉钻到条下面去（实测重叠 36px）。变量由 effect 直接写到根元素上，
   不进 React state——进 state 会形成「测量 → 重渲染 → 再测量」的正反馈。 */
.dshl-boardDrawer { position:absolute; top:calc(var(--dshl-head-top, 48px) + var(--dshl-head-h, 32px) + 8px); bottom:calc(var(--dshl-foot-h, 42px) + 20px); box-sizing:border-box; display:flex; flex-direction:column; pointer-events:auto; border-radius:10px; border:1px solid var(--dsw-alias-border-l2); background:var(--dsw-alias-bg-layer-1); box-shadow:0 10px 30px rgba(0,0,0,.28); overflow:hidden; }
.dshl-boardDrawer[data-side="left"] { left:8px; width:272px; }
.dshl-boardDrawer[data-side="right"] { right:8px; width:320px; }
.dshl-boardTabs { display:flex; flex-direction:column; gap:6px; pointer-events:auto; }
.dshl-boardTabBtn { display:inline-flex; align-items:center; gap:6px; height:28px; padding:0 10px; border-radius:999px; border:1px solid var(--dsw-alias-border-l2); background:color-mix(in srgb, var(--dsw-alias-bg-layer-1) 94%, transparent); color:var(--dsw-alias-label-primary); font:inherit; font-size:12px; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,.2); }
.dshl-boardTabBtn:hover { background:var(--dsw-alias-interactive-bg-hover); }
.dshl-boardTabBtn[data-active="true"] { border-color:var(--dsw-alias-brand-primary); color:var(--dsw-alias-brand-primary); }
.dshl-boardSearch { flex:none; padding:6px; border-bottom:1px solid var(--dsw-alias-border-l2); }
.dshl-boardGroups { flex:1; min-height:0; overflow:auto; }
.dshl-boardGroup { border-bottom:1px solid var(--dsw-alias-border-l2); }
.dshl-boardGroupHead { display:flex; align-items:center; gap:6px; width:100%; padding:6px 8px; border:none; background:transparent; color:var(--dsw-alias-label-primary); font:inherit; font-size:12px; font-weight:600; cursor:pointer; text-align:left; }
.dshl-boardGroupHead:hover { background:var(--dsw-alias-interactive-bg-hover); }
.dshl-boardDot { width:7px; height:7px; border-radius:2px; flex:none; }
.dshl-boardCount { margin-left:auto; font-weight:400; font-size:11px; color:var(--dsw-alias-label-secondary); }
.dshl-boardGroupBody { padding:0 4px 5px; display:flex; flex-direction:column; gap:2px; }
.dshl-boardSubHead { margin:6px 2px 2px; font-size:10px; line-height:14px; letter-spacing:.02em; color:var(--dsw-alias-label-secondary); }
/* flex:none 必须加：节点行是 flex item，父级有 max-height（下钻列表 220px）时会被压缩，
   实测 26px 被压到 22px，点击热区随之变小。 */
.dshl-boardNode { display:flex; align-items:center; gap:6px; width:100%; height:26px; flex:none; padding:0 7px; border-radius:6px; border:1px solid transparent; background:transparent; color:var(--dsw-alias-label-primary); font:inherit; font-size:12px; cursor:pointer; text-align:left; box-sizing:border-box; }
/* 窗口化占位：撑住滚动条长度，不显示任何内容 */
.dshl-boardPad { flex:none; width:100%; }
/* 长列表自己的滚动区：窗口化按它的 scrollTop 算可见区间，不能与其它列表共用 */
.dshl-boardScroll { max-height:320px; overflow:auto; display:flex; flex-direction:column; gap:2px; }
.dshl-boardNode:hover { background:var(--dsw-alias-interactive-bg-hover); }
.dshl-boardNode[data-active="true"] { border-color:var(--dsw-alias-brand-primary); background:color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent); }
.dshl-boardNode[data-offline="true"] { opacity:.5; }
.dshl-boardNodeLabel { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.dshl-boardBadge { flex:none; font-size:10px; line-height:15px; padding:0 5px; border-radius:999px; border:1px solid var(--dsw-alias-border-l1); color:var(--dsw-alias-label-secondary); }
.dshl-boardBadge[data-tier="official"] { border-color:color-mix(in srgb, var(--dsw-alias-brand-primary) 50%, transparent); color:var(--dsw-alias-brand-primary); }
.dshl-boardBadge[data-tier="third"] { border-color:color-mix(in srgb, var(--dshl-layer-slot, #d99a2b) 60%, transparent); color:var(--dshl-layer-slot, #d99a2b); }
.dshl-boardProps { flex:1; min-height:0; overflow:auto; padding:8px; display:flex; flex-direction:column; gap:9px; }
.dshl-boardPropHead { display:flex; flex-direction:column; gap:2px; padding-bottom:7px; border-bottom:1px solid var(--dsw-alias-border-l2); }
.dshl-boardPropPath { font-size:11px; color:var(--dsw-alias-label-secondary); word-break:break-all; }
.dshl-boardPropTitle { font-size:13px; font-weight:600; word-break:break-all; }
.dshl-boardField { display:flex; flex-direction:column; gap:4px; }
.dshl-boardFieldRow { display:flex; align-items:center; gap:8px; }
.dshl-boardFieldLabel { flex:1; min-width:0; font-size:12px; }
.dshl-boardFieldValue { font-size:11px; color:var(--dsw-alias-label-secondary); }
.dshl-boardNote { margin:0; font-size:11px; line-height:17px; color:var(--dsw-alias-label-secondary); }
.dshl-boardBtns { display:flex; gap:6px; flex-wrap:wrap; }
/* 下钻列表：属性面板里列出选中节点内部的直接下级。
   父级 max-height + overflow 时子行会被 flex 压缩，所以行本身要 flex:none（见 .dshl-boardNode）。 */
.dshl-boardDrill { display:flex; flex-direction:column; gap:2px; max-height:220px; overflow:auto; padding:4px; border-radius:8px; background:var(--dsw-alias-bg-layer-2); }
/* 底部条同理：left/right 都定住再 margin auto，否则内容被压到父级一半宽。 */
.dshl-boardFoot { position:absolute; left:0; right:0; bottom:10px; margin-inline:auto; width:max-content; display:flex; gap:8px; align-items:center; flex-wrap:wrap; justify-content:center; max-width:calc(100vw - 24px); padding:6px 10px; border-radius:999px; border:1px solid var(--dsw-alias-border-l2); background:color-mix(in srgb, var(--dsw-alias-bg-layer-1) 94%, transparent); box-shadow:0 4px 16px rgba(0,0,0,.24); pointer-events:auto; }
.dshl-boardHint { font-size:11px; color:var(--dsw-alias-label-secondary); }
`;

    /**
     * 白板样式只挂一次，且**不能用 `data-dsh-layout` 属性**：主 bundle 的 ensureStyles()
     * 会删掉所有 `style[data-dsh-layout]` 里不属于它自己的标签，白板样式会被一起清掉
     * （实测：白板打开后布局塌成一排）。
     */
    function ensureBoardCss() {
      if (document.querySelector('style[data-dshl-board]') !== null) return;
      const style = document.createElement('style');
      style.setAttribute('data-dshl-board', '');
      style.textContent = BOARD_CSS;
      document.head.appendChild(style);
    }

    /* ============================== 结构树 ============================== */

    /** 节点统一形状：层、身份、标签、来源、在场、DOM 引用、属性面板控件。 */
    function node(spec) {
      return {
        layer: spec.layer,
        id: spec.id,
        label: spec.label,
        source: spec.source ?? 'official',
        present: spec.present !== false,
        dom: spec.dom ?? null,
        controls: spec.controls ?? [],
      };
    }

    /** 控件描述：属性面板只认这几种 kind，不为每类节点各写一套渲染。 */
    const ctlFlag = (labelKey, value, write) => ({ kind: 'flag', labelKey, value, write });
    const ctlNum = (labelKey, value, min, max, step, write, fallbackText) => ({ kind: 'num', labelKey, value, min, max, step, write, fallbackText });
    const ctlNote = (text) => ({ kind: 'note', text });
    const ctlAction = (labelKey, run, disabled) => ({ kind: 'action', labelKey, run, disabled: disabled === true });
    const ctlMove = (labelKey, value, options, write) => ({ kind: 'move', labelKey, value, options, write });

    /** 区域节点：宿主写死的三栏 + 底部条 + 设置弹层；不画框造结构，只调它们的约束。 */
    function buildRegions(snapshot) {
      const { config, targets } = snapshot;
      const out = [];
      const order = config.columns.order;
      const shift = (key, delta) => {
        const at = order.indexOf(key);
        const to = at + delta;
        if (at < 0 || to < 0 || to >= order.length) return;
        host.updateConfig((draft) => {
          const next = draft.columns.order.filter((item) => item !== key);
          next.splice(to, 0, key);
          draft.columns.order = next;
        });
      };
      for (const key of REGION_ORDER) {
        const dom = targets.regions?.[key] ?? null;
        const controls = [];
        if (key === 'sidebar') {
          controls.push(ctlFlag('hide', config.columns.hideSidebar, (draft, on) => { draft.columns.hideSidebar = on; }));
          controls.push(ctlNum('width', config.columns.sidebarWidth, 180, 640, 4, (draft, value) => { draft.columns.sidebarWidth = value; }));
        } else if (key === 'rightbar') {
          controls.push(ctlFlag('hide', config.columns.hideRightbar, (draft, on) => { draft.columns.hideRightbar = on; }));
          controls.push(ctlNum('width', config.columns.rightbarWidth, 240, 900, 4, (draft, value) => { draft.columns.rightbarWidth = value; }));
        } else {
          controls.push(ctlFlag('hide', config.columns.hideCenter, (draft, on) => { draft.columns.hideCenter = on; }));
          controls.push(ctlNum('boardCenterMinWidth', config.columns.centerMinWidth, 240, 1200, 10, (draft, value) => { draft.columns.centerMinWidth = value; }));
          controls.push(ctlNum('boardContentWidth', config.center.contentWidth ?? 0, 0, 1600, 20, (draft, value) => { draft.center.contentWidth = value <= 0 ? null : value; }, 'follow'));
        }
        const at = order.indexOf(key);
        controls.push(ctlAction('boardMoveLeft', () => shift(key, -1), at <= 0));
        controls.push(ctlAction('boardMoveRight', () => shift(key, 1), at < 0 || at >= order.length - 1));
        out.push(node({
          layer: 'region',
          id: `region:${key}`,
          label: host.t(REGION_LABEL[key]),
          dom,
          present: dom !== null,
          controls,
        }));
      }
      const bottom = targets.regions?.bottom ?? null;
      out.push(node({
        layer: 'region',
        id: 'region:bottom',
        label: host.t('bottomBar'),
        dom: bottom,
        present: bottom !== null,
        controls: [ctlFlag('hide', config.columns.hideBottom, (draft, on) => { draft.columns.hideBottom = on; })],
      }));
      if (targets.settings !== null && targets.settings !== undefined) {
        out.push(node({
          layer: 'region',
          id: 'region:settings',
          label: host.t('settingsPanel'),
          dom: targets.settings,
          controls: [
            ctlNum('width', config.settings.width ?? 0, 0, 1400, 10, (draft, value) => { draft.settings.width = value <= 0 ? null : value; }, 'follow'),
            ctlNum('height', config.settings.height ?? 0, 0, 1200, 10, (draft, value) => { draft.settings.height = value <= 0 ? null : value; }, 'follow'),
            ctlNum('boardNavWidth', config.settings.navWidth ?? 0, 0, 360, 4, (draft, value) => { draft.settings.navWidth = value <= 0 ? null : value; }, 'follow'),
            ctlNum('offsetX', config.settings.offsetX, -600, 600, 10, (draft, value) => { draft.settings.offsetX = value; }),
            ctlNum('offsetY', config.settings.offsetY, -500, 500, 10, (draft, value) => { draft.settings.offsetY = value; }),
            ctlFlag('partNavHidden', config.settings.parts.hideNav, (draft, on) => { draft.settings.parts.hideNav = on; }),
            ctlFlag('partSetHeader', config.settings.parts.hideHeader, (draft, on) => { draft.settings.parts.hideHeader = on; }),
            ctlFlag('partSetOptions', config.settings.parts.hideOptions, (draft, on) => { draft.settings.parts.hideOptions = on; }),
          ],
        }));
      }
      return out;
    }

    /** 容器节点：侧栏五块 + 会话区/右栏/设置页的主区块 + 可排列容器。 */
    function buildContainers(snapshot) {
      const { config, targets } = snapshot;
      const out = [];
      const orderOf = (list, id) => list.indexOf(id);
      const shiftIn = (list, id, delta, write) => {
        const at = orderOf(list, id);
        const to = at + delta;
        if (at < 0 || to < 0 || to >= list.length) return;
        const next = list.filter((item) => item !== id);
        next.splice(to, 0, id);
        host.updateConfig((draft) => write(draft, next));
      };
      for (const block of host.BLOCKS) {
        const dom = targets.blocks?.[block] ?? null;
        const hidden = config.sidebar.hidden.includes(block);
        const controls = [
          ctlFlag('hide', hidden, (draft, on) => {
            const list = draft.sidebar.hidden.filter((item) => item !== block);
            if (on) list.push(block);
            draft.sidebar.hidden = list;
          }),
          ctlAction('boardMoveUp', () => shiftIn(config.sidebar.order, block, -1, (draft, next) => { draft.sidebar.order = next; }), orderOf(config.sidebar.order, block) <= 0),
          ctlAction('boardMoveDown', () => shiftIn(config.sidebar.order, block, 1, (draft, next) => { draft.sidebar.order = next; }), orderOf(config.sidebar.order, block) >= config.sidebar.order.length - 1),
        ];
        const relocate = config.relocate?.[`block:${block}`] ?? null;
        controls.push(ctlMove('boardRelocateTo', relocate?.to ?? '', host.RELOCATE_DESTINATIONS.map((item) => ({ value: item.id, label: host.t(item.labelKey) })), (draft, value) => {
          if (value === '') delete draft.relocate[`block:${block}`];
          else draft.relocate[`block:${block}`] = { to: value, place: relocate?.place ?? 'start' };
        }));
        out.push(node({
          layer: 'container',
          id: `block:${block}`,
          label: host.t(host.BLOCK_LABEL_KEYS[block] ?? block),
          dom,
          present: dom !== null,
          controls,
        }));
      }
      for (const unit of host.PART_UNITS) {
        if (!CONTAINER_PART_IDS.has(unit.id)) continue;
        const nodes = targets.units?.[unit.id] ?? [];
        const value = host.readPath(config, unit.path) === true;
        const controls = [
          ctlFlag(unit.labelKey, value, (draft, on) => { host.writePath(draft, unit.path, on); }),
        ];
        const relocate = config.relocate?.[`unit:${unit.id}`] ?? null;
        if (host.RELOCATE_DESTINATION_IDS.has(`unit:${unit.id}`)) {
          controls.push(ctlMove('boardRelocateTo', relocate?.to ?? '', host.RELOCATE_DESTINATIONS.map((item) => ({ value: item.id, label: host.t(item.labelKey) })), (draft, value2) => {
            if (value2 === '') delete draft.relocate[`unit:${unit.id}`];
            else draft.relocate[`unit:${unit.id}`] = { to: value2, place: relocate?.place ?? 'start' };
          }));
        }
        out.push(node({
          layer: 'container',
          id: `unit:${unit.id}`,
          label: host.t(unit.labelKey),
          dom: nodes[0] ?? null,
          present: nodes.length > 0,
          controls,
        }));
      }
      // 可排列容器：已知容器在上面已覆盖，这里只补槽位出口这类额外容器
      for (const entry of targets.arrange ?? []) {
        const known = out.some((item) => item.id === `arrange:${entry.id}`);
        if (known) continue;
        if (entry.labelKey === undefined) continue;
        const spec = config.arrange?.[entry.id] ?? null;
        out.push(node({
          layer: 'container',
          id: `arrange:${entry.id}`,
          label: host.t(entry.labelKey),
          dom: entry.node ?? null,
          present: entry.node !== undefined,
          controls: [
            ctlNum('boardColumns', spec?.columns ?? 0, 0, 3, 1, (draft, value) => {
              if (value <= 1) delete draft.arrange[entry.id];
              else draft.arrange[entry.id] = { columns: value, gap: spec?.gap ?? 8, compact: spec?.compact === true };
            }, 'off'),
            ctlNum('boardGap', spec?.gap ?? 8, 0, 32, 1, (draft, value) => {
              if (spec === null) return;
              draft.arrange[entry.id] = { columns: spec.columns, gap: value, compact: spec.compact === true };
            }),
          ],
        }));
      }
      return out;
    }

    /** 槽位节点：宿主 slots 注册表里的命名槽。 */
    function buildSlots(snapshot) {
      const { targets } = snapshot;
      const sources = targets.slotSources ?? null;
      if (sources === null) return [];
      const out = [];
      for (const group of sources.graph) {
        const rendered = group.items.filter((item) => item.rendered).length;
        out.push(node({
          layer: 'slot',
          id: `slot:${group.slot}`,
          label: group.slot,
          source: 'official',
          present: rendered > 0,
          controls: [
            ctlNote(`${group.slot} · ${group.kind} · ${group.items.length} 条目 / ${rendered} 已渲染`),
            ...group.items.slice(0, 12).map((item) => ctlNote(`${item.rendered ? '●' : '○'} ${item.id}`)),
          ],
        }));
      }
      return out;
    }

    /** 控件节点：拆解细粒度单元 + 槽位条目 + 第三方插件单元 + 按钮入口。 */
    function buildControls(snapshot) {
      const { config, targets } = snapshot;
      const out = [];
      for (const unit of host.PART_UNITS) {
        if (CONTAINER_PART_IDS.has(unit.id)) continue;
        const nodes = targets.units?.[unit.id] ?? [];
        out.push(node({
          layer: 'control',
          id: `unit:${unit.id}`,
          label: host.t(unit.labelKey),
          dom: nodes[0] ?? null,
          present: nodes.length > 0,
          controls: [ctlFlag('hide', host.readPath(config, unit.path) === true, (draft, on) => { host.writePath(draft, unit.path, on); })],
        }));
      }
      const sources = targets.slotSources ?? null;
      if (sources !== null) {
        for (const group of sources.graph) {
          for (const item of group.items) {
            const key = item.entryKey;
            const hidden = config.slots.hide.includes(key);
            const controls = [];
            if (item.hideable) controls.push(ctlFlag('hide', hidden, (draft, on) => {
              const list = draft.slots.hide.filter((value) => value !== key);
              if (on) list.push(key);
              draft.slots.hide = list;
            }));
            if (item.orderable) {
              // 顺序用上移/下移，不用裸数字滑块：`slots.order` 存的是相对序号，
              // 用户无法从「拖到 23」推出它会排到第几位；现有六页面板也是用上下移。
              const order = config.slots.order?.[key] ?? item.order ?? 0;
              controls.push(ctlAction('boardMoveUp', () => {
                host.updateConfig((draft) => { draft.slots.order[key] = order - 1; });
              }));
              controls.push(ctlAction('boardMoveDown', () => {
                host.updateConfig((draft) => { draft.slots.order[key] = order + 1; });
              }));
            }
            if (controls.length === 0) controls.push(ctlNote(item.reason === 'overlay' ? host.t('boardReadonlyOverlay') : host.t('boardReadonly')));
            out.push(node({
              layer: 'control',
              id: `entry:${key}`,
              label: item.id,
              source: item.registrant.includes('deepseek') ? 'official' : 'third',
              dom: item.tops?.[0] ?? null,
              present: item.rendered,
              controls,
            }));
          }
        }
      }
      const external = targets.external ?? null;
      if (external !== null) {
        for (const unit of external.units ?? []) {
          const key = `${external.pageKey}::${unit.key}`;
          out.push(node({
            layer: 'control',
            id: `xunit:${key}`,
            label: `${unit.key} ${unit.type}${unit.label === '' ? '' : ` · ${unit.label}`}`,
            source: unit.tier === 'declared' ? 'third' : 'auto',
            dom: unit.node ?? null,
            controls: [ctlFlag('hide', config.external.hide.includes(key), (draft, on) => {
              const list = draft.external.hide.filter((value) => value !== key);
              if (on) list.push(key);
              draft.external.hide = list;
            })],
          }));
        }
      }
      const zones = targets.storageZones ?? null;
      if (zones !== null) {
        for (const [zone, entries] of Object.entries(zones)) {
          for (const entry of entries) {
            const stored = (config.storage?.[zone] ?? []).some((value) => value.id === entry.id);
            out.push(node({
              layer: 'control',
              id: `store:${zone}::${entry.id}`,
              label: `${entry.label} · ${zone}`,
              source: 'official',
              controls: [ctlFlag('boardStoreTo', stored, (draft, on) => {
                const list = (draft.storage[zone] ?? []).filter((value) => value.id !== entry.id);
                if (on) list.push({ id: entry.id, label: entry.label });
                draft.storage[zone] = list;
              })],
            }));
          }
        }
      }
      return out;
    }

    function buildTree(snapshot) {
      return {
        region: buildRegions(snapshot),
        container: buildContainers(snapshot),
        slot: buildSlots(snapshot),
        control: buildControls(snapshot),
      };
    }

    /* ============================== 下钻：区域内部的节点 ============================== */

    /**
     * 某个节点的下级节点：选中区域后要能继续点选它内部的控件
     * （例：选中侧栏 → 点「面板导航」容器 → 点里面某个插件入口）。
     *
     * 判定用**几何包含**而不是维护一张父子表：宿主结构随时变，父子关系跟着 DOM 变，
     * 单独维护一份树必然与识别结果漂移。两个坐标源都支持：
     * - 描图态：元素矩形（getBoundingClientRect）
     * - 骨架态：快照归一化矩形换算后的画布矩形
     * 用「中心点落在父矩形内」而不是整框包含：子元素常常超出父框几个像素（阴影、溢出），
     * 整框包含会把它们误判成外部。
     */
    function containsCenter(outer, inner) {
      if (outer === undefined || inner === undefined) return false;
      const cx = inner.x + inner.w / 2;
      const cy = inner.y + inner.h / 2;
      return cx >= outer.x && cx <= outer.x + outer.w && cy >= outer.y && cy <= outer.y + outer.h;
    }

    /**
     * 直接下级：找出 parentRect 内「没有被另一个更大的候选整框包住」的节点。
     *
     * 两个容易踩错的地方（第一版都踩了）：
     * 1. **必须用整框包含，不能用中心点包含**。用中心点判断时，容器内部一个恰好盖住
     *    容器中心的控件会被当成「容器的父级」，把容器自己判成子级剔掉——实测侧栏里
     *    `block:brand` 整个消失，只剩它内部的品牌标识/收起按钮。
     * 2. **必须按面积从大到小处理**。大的先被接受，小的若落在大框里就说明它更深一层，
     *    直接跳过；按面积从小到大处理则相反，会先接受小控件再误判大容器。
     */
    function rectContains(outer, inner) {
      // 留 2px 容差：子元素常因边框/圆角/阴影比父框略大几个像素
      const pad = 2;
      return inner.x >= outer.x - pad
        && inner.y >= outer.y - pad
        && inner.x + inner.w <= outer.x + outer.w + pad
        && inner.y + inner.h <= outer.y + outer.h + pad;
    }

    function childrenOf(parentId, parentRect, candidates, rectsOf) {
      const inside = [];
      for (const item of candidates) {
        if (item.id === parentId) continue;
        const rect = rectsOf(item);
        if (rect === undefined) continue;
        if (!containsCenter(parentRect, rect)) continue;
        // 排除祖先与同尺寸别名：`slot:sidebar` 这类节点与 `region:sidebar` 矩形完全相同，
        // 它们会把真正的子节点全包住，让结果只剩一个（实测只剩 1 项）。
        // 判据：候选把父矩形整个包住 → 它是父级的祖先/同层别名，不是子级。
        if (rectContains(rect, parentRect)) continue;
        inside.push({ item, rect, area: rect.w * rect.h });
      }
      inside.sort((a, b) => b.area - a.area);
      const accepted = [];
      for (const entry of inside) {
        // 已被某个更大的直接下级整框包住 → 它是那个子节点的后代，不是父节点的直接下级
        if (accepted.some((other) => rectContains(other.rect, entry.rect))) continue;
        accepted.push(entry);
      }
      // 输出顺序按「层（区域→容器→槽位→控件）+ 从上到下、从左到右」排：
      // 面积排序只是判定中间态，直接拿来渲染会让按钮排在容器前面，读起来是乱的。
      const layerRank = { region: 0, container: 1, slot: 2, control: 3 };
      accepted.sort((a, b) => {
        const rank = (layerRank[a.item.layer] ?? 9) - (layerRank[b.item.layer] ?? 9);
        if (rank !== 0) return rank;
        if (Math.abs(a.rect.y - b.rect.y) > 2) return a.rect.y - b.rect.y;
        return a.rect.x - b.rect.x;
      });
      return accepted.map((entry) => entry.item);
    }

    /* ============================== 画布几何 ============================== */

    /**
     * 白板用的页面 key。
     * 直接取宿主实现：写快照与读快照必须用同一套判定，白板自己推一套会在第三方页上对不上
     * （宿主是「第三方页优先」，白板原来用 pageKindOf 是「会话优先」）。
     */
    function pageKeyOf(targets) {
      return host.boardPageKey(targets);
    }

    /**
     * 描图态：量真实元素矩形。
     * 输出坐标必须相对**画布容器**（框是 absolute 定位在画布里的），所以统一减去画布原点；
     * 直接把视口坐标塞进去会让框整体偏移一个侧栏宽度 + 顶栏高度（实测偏到屏幕外）。
     */
    function measureTrace(tree, box) {
      const rects = {};
      for (const layer of LAYERS) {
        for (const item of tree[layer]) {
          const dom = item.dom;
          if (dom === null || dom === undefined || dom.isConnected !== true) continue;
          const rect = dom.getBoundingClientRect();
          if (rect.width < 1 || rect.height < 1) continue;
          rects[item.id] = { x: rect.left - box.left, y: rect.top - box.top, w: rect.width, h: rect.height };
        }
      }
      return rects;
    }

    /** 抽象态：把快照里的归一化矩形铺到画布上（同样相对画布原点）。 */
    function layoutSkeleton(geometry, box) {
      const rects = {};
      if (geometry === null || geometry === undefined) return rects;
      for (const item of geometry.nodes ?? []) {
        rects[item.id] = {
          x: item.x * box.width,
          y: item.y * box.height,
          w: Math.max(2, item.w * box.width),
          h: Math.max(2, item.h * box.height),
        };
      }
      return rects;
    }

    /** 两组矩形是否等价：定时测量用，避免每轮都触发一次重渲染。 */
    function sameRects(a, b) {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      for (const key of keysA) {
        const left = a[key];
        const right = b[key];
        if (right === undefined) return false;
        if (Math.abs(left.x - right.x) > 0.5 || Math.abs(left.y - right.y) > 0.5
          || Math.abs(left.w - right.w) > 0.5 || Math.abs(left.h - right.h) > 0.5) return false;
      }
      return true;
    }

    /** 控件层默认每桶条数：条目可达数百，一次全渲染会让白板首帧明显卡顿。 */
    const PAGE_SIZE = 40;

    /** 控件层按来源分桶：拆解单元 / 第三方单元 / 槽位条目 / 收纳入口，各自成组更易找。 */
    const CONTROL_BUCKETS = [
      { key: 'unit', labelKey: 'boardBucketUnit', match: (id) => id.startsWith('unit:') },
      { key: 'xunit', labelKey: 'boardBucketXunit', match: (id) => id.startsWith('xunit:') },
      { key: 'entry', labelKey: 'boardBucketEntry', match: (id) => id.startsWith('entry:') },
      { key: 'store', labelKey: 'boardBucketStore', match: (id) => id.startsWith('store:') },
    ];

    /**
     * 控件层分桶。
     * 分页必须**按桶**做：全局取前 40 条时，第三方单元（排在槽位条目之后）会被整批截掉，
     * 而它正是用户最关心的那类（实测切到第三方插件页后控件栏一个第三方单元都看不到）。
     */
    function bucketControls(items, expanded) {
      const out = [];
      const rest = [...items];
      const take = (bucket, hit) => out.push({
        key: bucket.key,
        label: bucket.labelKey,
        total: hit.length,
        items: expanded ? hit : hit.slice(0, PAGE_SIZE),
        hidden: expanded ? 0 : Math.max(0, hit.length - PAGE_SIZE),
      });
      for (const bucket of CONTROL_BUCKETS) {
        const hit = rest.filter((item) => bucket.match(item.id));
        if (hit.length === 0) continue;
        for (const item of hit) rest.splice(rest.indexOf(item), 1);
        take(bucket, hit);
      }
      if (rest.length > 0) take({ key: 'other', labelKey: 'boardBucketOther' }, rest);
      return out;
    }

    /* ============================== 组件 ============================== */

    /**
     * 长列表窗口化：只渲染视口附近的行。
     *
     * 为什么需要：控件层全展开时可达 451 行，全渲染实测约 79ms（build 9.8 + layout 69.3），
     * 滚动时会明显掉帧。
     *
     * 为什么用「React onScroll + 渲染期算区间」而不是「effect 里 addEventListener」：
     * 后者实测拿不到滚动更新（effect 挂监听后窗口区间始终停在首屏），
     * 而 onScroll 是 React 自己管理的合成事件，时序确定；区间在渲染期直接算，
     * 不需要额外 state 同步，也不会漏掉程序化滚动。
     *
     * 每桶独立滚动容器：多个桶共用一个外层滚动容器时，各自的 scrollTop 相同，
     * 窗口会互相错位、行凭空出现或消失。
     */
    const ROW_HEIGHT = 26;
    const OVERSCAN = 8;
    /** 超过这个行数才窗口化；短列表直接平铺，省一层滚动区。 */
    const VIRTUAL_THRESHOLD = 80;
    /** 窗口化列表的高度上限：太高会挤掉同抽屉里的其它分组。 */
    const VIRTUAL_MAX_HEIGHT = 320;

    function BucketList({ t, items, selected, onSelect }) {
      const [scrollTop, setScrollTop] = React.useState(0);
      const virtual = items.length > VIRTUAL_THRESHOLD;
      const renderRow = (item) => h('button', {
        key: item.id,
        type: 'button',
        className: 'dshl-boardNode',
        'data-active': selected === item.id ? 'true' : undefined,
        'data-offline': item.present ? undefined : 'true',
        title: item.id,
        onClick: () => onSelect(item.id),
      },
      h('span', { className: 'dshl-boardNodeLabel' }, String(item.label)),
      item.source === 'official' ? null : h('span', { className: 'dshl-boardBadge', 'data-tier': item.source }, t(item.source === 'third' ? 'ownerThird' : 'ownerAuto')));
      if (!virtual) return h(React.Fragment, null, ...items.map(renderRow));
      // 渲染期直接算可见区间：不依赖 ref 与 effect 的时序
      const visible = Math.ceil(VIRTUAL_MAX_HEIGHT / ROW_HEIGHT);
      const first = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
      const last = Math.min(items.length, first + visible + OVERSCAN * 2);
      const rows = [];
      for (let index = first; index < last; index += 1) rows.push(renderRow(items[index]));
      return h('div', {
        className: 'dshl-boardScroll',
        style: { maxHeight: VIRTUAL_MAX_HEIGHT },
        onScroll: (event) => setScrollTop(event.currentTarget.scrollTop),
      },
      h('div', { className: 'dshl-boardPad', style: { height: first * ROW_HEIGHT } }),
      ...rows,
      h('div', { className: 'dshl-boardPad', style: { height: Math.max(0, (items.length - last) * ROW_HEIGHT) } }));
    }

    function ControlField({ t, ctl }) {
      if (ctl.kind === 'note') return h('p', { className: 'dshl-boardNote' }, ctl.text);
      if (ctl.kind === 'action') {
        return h('div', { className: 'dshl-boardBtns' },
          h('button', { type: 'button', className: 'dshl-btn', disabled: ctl.disabled, onClick: ctl.run }, t(ctl.labelKey)));
      }
      if (ctl.kind === 'flag') {
        return h('div', { className: 'dshl-boardFieldRow' },
          h('span', { className: 'dshl-boardFieldLabel' }, t(ctl.labelKey)),
          h(host.Switch, { checked: ctl.value, label: t(ctl.labelKey), onChange: (on) => host.updateConfig((draft) => ctl.write(draft, on)) }));
      }
      if (ctl.kind === 'num') {
        const fallback = ctl.value === 0 && ctl.fallbackText !== undefined;
        return h('div', { className: 'dshl-boardField' },
          h('div', { className: 'dshl-boardFieldRow' },
            h('span', { className: 'dshl-boardFieldLabel' }, t(ctl.labelKey)),
            h('span', { className: 'dshl-boardFieldValue' }, fallback ? t(ctl.fallbackText) : String(ctl.value))),
          h('input', {
            type: 'range',
            className: 'dshl-slider',
            min: ctl.min,
            max: ctl.max,
            step: ctl.step,
            value: ctl.value,
            'aria-label': t(ctl.labelKey),
            onChange: (event) => {
              const next = Number(event.target.value);
              host.updateConfig((draft) => ctl.write(draft, next));
            },
          }));
      }
      if (ctl.kind === 'move') {
        return h('div', { className: 'dshl-boardField' },
          h('span', { className: 'dshl-boardFieldLabel' }, t(ctl.labelKey)),
          h('select', {
            className: 'dshl-select',
            value: ctl.value,
            'aria-label': t(ctl.labelKey),
            onChange: (event) => {
              const next = event.target.value;
              host.updateConfig((draft) => ctl.write(draft, next));
            },
          }, h('option', { value: '' }, t('boardRelocateNone')),
          ...ctl.options.map((option) => h('option', { key: option.value, value: option.value }, option.label))));
      }
      return null;
    }

    function Board({ t }) {
      const snapshot = host.useStoreSnapshot();
      const { config, targets, ui } = snapshot;
      const [selected, setSelected] = React.useState(null);
      const [mode, setMode] = React.useState('trace');
      const [filter, setFilter] = React.useState('');
      const [collapsed, setCollapsed] = React.useState({});
      const [expandedLayer, setExpandedLayer] = React.useState({});
      /** 抽屉：左右各自独立开关；描图态默认全收起，不遮挡真实界面 */
      const [drawers, setDrawers] = React.useState({ left: false, right: false });
      const setDrawer = (side, on) => setDrawers((current) => ({ ...current, [side]: on }));
      /** 层级开关：描图态默认开区域 + 容器两层（骨架可见），槽位与控件层框太密默认关 */
      const [layerOn, setLayerOn] = React.useState({ region: true, container: true, slot: false, control: false });
      const [rects, setRects] = React.useState({});
      const [canvasBox, setCanvasBox] = React.useState({ left: 0, top: 0, width: 0, height: 0 });
      /**
       * 顶部安全偏移与顶/底条高度**不进 state**：它们是纯样式量，
       * 由下面的 effect 直接写进白板根元素的 CSS 变量（--dshl-head-top / --dshl-head-h / --dshl-foot-h）。
       * 进 state 会在窄屏换行时形成「测量 → 重渲染 → 再测量」的正反馈，实测打爆成 React #185。
       */
      /** 骨架漂移诊断：只在骨架态显示提示（描图态看到的就是真实结构，不存在漂移） */
      const [drift, setDrift] = React.useState(null);
      const canvasRef = React.useRef(null);
      /** 白板根元素：CSS 变量的宿主 */
      const boardRef = React.useRef(null);
      /** 顶部条元素：要量它的实际高度来给抽屉让位 */
      const headRef = React.useRef(null);
      /** 底部条元素：同上 */
      const footRef = React.useRef(null);
      const tree = React.useMemo(() => buildTree(snapshot), [snapshot]);
      const pageKey = pageKeyOf(targets);
      const pageLabel = host.currentPageLabel(targets, t);

      // 量顶部安全偏移 + 顶/底条自身高度：它们换行时抽屉要跟着让位。
      //
      // 关键：结果写进 CSS 变量（--dshl-head-top / --dshl-head-h / --dshl-foot-h），
      // **不写 React state**。写 state 会触发重渲染，重渲染可能改变条的高度，再触发测量——
      // 实测在窄屏换行时这个正反馈直接打爆成 React #185（无限渲染），白板整块崩掉。
      // 写 CSS 变量只影响样式、不触发 React 更新，从根上断掉这条回路。
      React.useLayoutEffect(() => {
        const sync = () => {
          const boardEl = boardRef.current;
          if (boardEl === null) return;
          boardEl.style.setProperty('--dshl-head-top', `${topSafeOffset()}px`);
          const el = headRef.current;
          if (el !== null) {
            const h = Math.round(el.getBoundingClientRect().height);
            if (h > 0) boardEl.style.setProperty('--dshl-head-h', `${h}px`);
          }
          const footEl = footRef.current;
          if (footEl !== null) {
            const h = Math.round(footEl.getBoundingClientRect().height);
            if (h > 0) boardEl.style.setProperty('--dshl-foot-h', `${h}px`);
          }
        };
        sync();
        const timer = window.setInterval(sync, 500);
        window.addEventListener('resize', sync);
        return () => {
          window.clearInterval(timer);
          window.removeEventListener('resize', sync);
        };
      }, [snapshot]);

      // 描图态量真实矩形：快照变化、窗口尺寸变化、以及 400ms 定时（过渡动画与延迟渲染）
      React.useLayoutEffect(() => {
        const measure = () => {
          const el = canvasRef.current;
          if (el === null) return;
          const rect = el.getBoundingClientRect();
          setCanvasBox((current) => (current.left === rect.left && current.top === rect.top && current.width === rect.width && current.height === rect.height
            ? current
            : { left: rect.left, top: rect.top, width: rect.width, height: rect.height }));
          if (mode !== 'trace') return;
          const next = measureTrace(tree, rect);
          // 矩形没变就不 setState：这个定时器每 400ms 跑一次，无条件 setState 会让整棵白板每 400ms 重渲染一次
          setRects((current) => (sameRects(current, next) ? current : next));
        };
        measure();
        const timer = window.setInterval(measure, 400);
        window.addEventListener('resize', measure);
        return () => {
          window.clearInterval(timer);
          window.removeEventListener('resize', measure);
        };
      }, [tree, mode, snapshot]);

      // 抽象态：从几何快照铺骨架
      React.useLayoutEffect(() => {
        if (mode !== 'skeleton') {
          setDrift(null);
          host.unfreezeGeometry();
          return;
        }
        // 冻结该页快照：否则主 bundle 每 5 秒自动重量，快照永远新鲜、漂移永远检测不到
        host.freezeGeometry(pageKey);
        const geometry = host.readGeometry(pageKey);
        // 画布尺寸必须**在这里当场量**，不能复用 canvasBox：
        // canvasBox 只由描图态的定时器更新，切到骨架态后那个 effect 直接 return，
        // 于是 canvasBox 永远停在初始的 0×0，骨架会被全部乘成 0 尺寸——实测骨架态一个框都不显示。
        const el = canvasRef.current;
        const boxOf = () => (el === null
          ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
          : (() => { const r = el.getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height }; })());
        const paintSkeleton = () => setRects(layoutSkeleton(host.readGeometry(pageKey), boxOf()));
        paintSkeleton();
        // 窗口尺寸变化时要重铺：骨架是按画布尺寸等比缩放的
        const onResize = () => paintSkeleton();
        window.addEventListener('resize', onResize);
        // 漂移校验只在骨架态做：描图态看到的就是真实结构，没有「过期」这回事
        setDrift(host.readDrift());
        return () => {
          window.removeEventListener('resize', onResize);
          host.unfreezeGeometry();
        };
      }, [mode, pageKey, snapshot]);

      /**
       * 切页清空选中：页面换了，原来选中的节点多半不在这一页上。
       * 不清的话属性面板会继续显示上一页的节点（还会标「此刻在场」），
       * 用户以为改的是当前页，实际改的是别处的配置。
       */
      const lastPageRef = React.useRef(pageKey);
      React.useEffect(() => {
        if (lastPageRef.current === pageKey) return;
        lastPageRef.current = pageKey;
        setSelected(null);
        setDrift(null);
      }, [pageKey]);

      const allNodes = React.useMemo(() => {
        const map = new Map();
        for (const layer of LAYERS) for (const item of tree[layer]) map.set(item.id, item);
        return map;
      }, [tree]);
      const selectedNode = selected === null ? null : (allNodes.get(selected) ?? null);

      /**
       * 下钻：选中节点后，把它内部的直接下级标成「可继续点」。
       * 先点区域（侧栏），再点区域里的容器（面板导航），再点容器里的控件（某个插件入口）——
       * 三级都是同一套逻辑，不额外维护父子表。
       *
       * 候选表只建一次：之前每层都重建一份全量数组，450+ 节点时会做 4 轮 O(n²) 扫描，
       * 而且「取第一个有下级的子节点」会随节点顺序漂移。改成预建 rect 索引 + 按面积升序，
       * 每层只在父矩形内扫一遍。
       */
      const drillPath = React.useMemo(() => {
        if (selected === null || rects[selected] === undefined) return [];
        const candidates = [];
        for (const layer of LAYERS) for (const item of tree[layer]) candidates.push(item);
        const rectOf = (item) => rects[item.id];
        const path = [];
        const seen = new Set([selected]);
        let parentRect = rects[selected];
        for (let depth = 0; depth < 4; depth += 1) {
          if (parentRect === undefined) break;
          const kids = childrenOf(selected, parentRect, candidates, rectOf).filter((item) => !seen.has(item.id));
          if (kids.length === 0) break;
          path.push(...kids);
          for (const kid of kids) seen.add(kid.id);
          // 继续往里：挑面积最大的那个子节点（通常是容器），避免随节点顺序漂移
          const next = kids
            .map((kid) => ({ kid, rect: rectOf(kid) }))
            .filter((entry) => entry.rect !== undefined)
            .sort((a, b) => (b.rect.w * b.rect.h) - (a.rect.w * a.rect.h))[0];
          if (next === undefined) break;
          parentRect = next.rect;
        }
        return path;
      }, [selected, rects, tree]);
      const drillSet = React.useMemo(() => new Set(drillPath.map((item) => item.id)), [drillPath]);

      const needle = filter.trim().toLowerCase();
      const matches = (item) => needle === '' || item.id.toLowerCase().includes(needle) || String(item.label).toLowerCase().includes(needle);

      const scenes = [
        { key: 'conversation', labelKey: 'surfaceConversation', kind: 'conversation' },
        { key: 'plugins', labelKey: 'surfacePluginsManager', kind: 'plugins' },
        { key: 'pluginDetail', labelKey: 'surfacePluginDetail', kind: 'pluginDetail' },
        { key: 'settings', labelKey: 'surfaceSettingsDialog', kind: 'settings' },
      ];
      const currentKind = host.pageKindOf(targets);

      return h('div', { className: 'dshl-board', ref: boardRef, 'data-dshl-layer': '', 'data-mode': mode },
        // 画布铺满整层：描图态的框用视口坐标减去画布原点，与真实元素严格对齐；抽象态整层不透明
        h('div', { className: 'dshl-boardCanvasWrap', ref: canvasRef },
          h('div', { className: 'dshl-boardCanvas' },
            mode === 'skeleton' && Object.keys(rects).length === 0
              ? h('div', { className: 'dshl-boardEmpty' }, t('boardSkeletonEmpty'))
              : null,
            ...Object.entries(rects).map(([id, rect]) => {
              const item = allNodes.get(id);
              if (item === undefined) return null;
              // 下钻出来的子节点即使所属层关着也显示：否则「选中区域后点里面控件」在默认层级下看不见
              const drilled = drillSet.has(id);
              if (layerOn[item.layer] !== true && !drilled) return null;
              const color = LAYER_COLOR[item.layer];
              return h('button', {
                key: id,
                type: 'button',
                className: 'dshl-boardBox',
                'data-active': selected === id ? 'true' : undefined,
                'data-drill': drilled ? 'true' : undefined,
                style: { left: rect.x, top: rect.y, width: rect.w, height: rect.h, borderColor: color, color },
                title: `${id} · ${Math.round(rect.w)}×${Math.round(rect.h)}`,
                onClick: (event) => {
                  event.stopPropagation();
                  setSelected(id);
                  setDrawer('right', true);
                },
              },
              rect.h > 22
                ? h('span', {
                  className: 'dshl-boardBoxTag',
                  'data-below': rect.y < 22 ? 'true' : undefined,
                  'data-tight': rect.w < String(item.label).length * 7 + 10 ? 'true' : undefined,
                }, String(item.label))
                : null);
            }))),
        // 骨架漂移提示：只在骨架态、且真实结构与快照对不上时出现
        mode === 'skeleton' && drift !== null
          ? h('div', { className: 'dshl-boardDrift' },
            h('span', { className: 'dshl-boardDriftText' },
              h('span', { className: 'dshl-boardDriftTitle' }, t('boardDriftTitle')),
              ' · ',
              t('boardDriftDetail')(drift.added, drift.removed)),
            h('button', {
              type: 'button',
              className: 'dshl-boardDriftBtn',
              onClick: () => {
                host.recordGeometryNow();
                setDrift(null);
              },
            }, t('boardDriftRecapture')))
          : null,
        h('div', { className: 'dshl-boardHead', ref: headRef },
          h('span', { className: 'dshl-boardTitle' }, t('boardTitle')),
          h('span', { className: 'dshl-boardPage', title: pageLabel }, pageLabel),
          h('span', { className: 'dshl-boardGrow' }),
          h('div', { className: 'dshl-boardScenes' },
            ...scenes.map((scene) => h('button', {
              key: scene.key,
              type: 'button',
              className: 'dshl-boardScene',
              'data-active': currentKind === scene.kind ? 'true' : undefined,
              onClick: () => host.navigate(scene.kind),
            }, t(scene.labelKey)))),
          h('button', {
            type: 'button',
            className: 'dshl-boardScene',
            'data-active': mode === 'trace' ? 'true' : undefined,
            onClick: () => setMode('trace'),
          }, t('boardModeTrace')),
          h('button', {
            type: 'button',
            className: 'dshl-boardScene',
            'data-active': mode === 'skeleton' ? 'true' : undefined,
            onClick: () => { setMode('skeleton'); setDrawer('left', true); },
          }, t('boardModeSkeleton')),
          h('button', {
            type: 'button',
            className: 'dshl-boardScene',
            onClick: () => host.recordGeometryNow(),
          }, t('boardCapture')),
          h('div', { className: 'dshl-boardLayers' },
            ...LAYERS.map((layer) => h('button', {
              key: layer,
              type: 'button',
              className: 'dshl-boardLayer',
              'data-on': layerOn[layer] ? 'true' : undefined,
              style: { color: layerOn[layer] ? LAYER_COLOR[layer] : undefined },
              onClick: () => setLayerOn((current) => ({ ...current, [layer]: !current[layer] })),
            }, t(LAYER_LABEL[layer])))),
          h('button', { type: 'button', className: 'dshl-boardScene', onClick: () => { host.setBoard(false); host.setPanel(true); } }, t('boardAdvanced')),
          h('button', {
            type: 'button',
            className: 'dshl-boardScene',
            'data-active': drawers.left ? 'true' : undefined,
            onClick: () => setDrawer('left', !drawers.left),
          }, `${t('boardLayers')} ${tree.region.length + tree.container.length + tree.slot.length + tree.control.length}`),
          h('button', {
            type: 'button',
            className: 'dshl-boardScene',
            'data-active': drawers.right ? 'true' : undefined,
            onClick: () => setDrawer('right', !drawers.right),
          }, selectedNode === null ? t('boardProps') : String(selectedNode.label)),
          h('button', { type: 'button', className: 'dshl-boardScene', onClick: () => host.setBoard(false) }, t('done'))),
        // 左抽屉：四栏
        drawers.left ? h('div', { className: 'dshl-boardDrawer', 'data-side': 'left' },
          h('div', { className: 'dshl-boardSearch' },
            h('input', {
              type: 'search',
              className: 'dshl-input',
              value: filter,
              placeholder: t('boardFilter'),
              'aria-label': t('boardFilter'),
              onChange: (event) => setFilter(event.target.value),
            })),
          h('div', { className: 'dshl-boardGroups' },
            ...LAYERS.map((layer) => {
              const items = tree[layer].filter(matches);
              const open = collapsed[layer] !== true;
              const expanded = expandedLayer[layer] === true;
              // 控件层条目最多（第三方插件单元 + 槽位条目 + 按钮入口可达数百），按来源分桶、各桶独立分页
              const buckets = layer === 'control'
                ? bucketControls(items, expanded)
                : [{ key: 'all', label: null, total: items.length, items: expanded ? items : items.slice(0, PAGE_SIZE), hidden: expanded ? 0 : Math.max(0, items.length - PAGE_SIZE) }];
              return h('div', { key: layer, className: 'dshl-boardGroup' },
                h('button', {
                  type: 'button',
                  className: 'dshl-boardGroupHead',
                  onClick: () => setCollapsed((current) => ({ ...current, [layer]: open })),
                },
                h('span', { className: 'dshl-boardDot', style: { background: LAYER_COLOR[layer] } }),
                h('span', null, t(LAYER_LABEL[layer])),
                h('span', { className: 'dshl-boardCount' }, `${items.length}`)),
                open ? h('div', { className: 'dshl-boardGroupBody' },
                  items.length === 0
                    ? h('p', { className: 'dshl-boardNote' }, t('boardEmptyGroup'))
                    : h(React.Fragment, null,
                      ...buckets.map((bucket) => h(React.Fragment, { key: `${layer}-${bucket.key}` },
                        bucket.label === null ? null : h('p', { className: 'dshl-boardSubHead' }, `${t(bucket.label)} · ${bucket.total}`),
                        // 长列表走窗口化（每桶独立滚动容器），短列表直接平铺
                        h(BucketList, {
                          t,
                          items: bucket.items,
                          selected,
                          onSelect: (id) => { setSelected(id); setDrawer('right', true); },
                        }),
                        bucket.hidden > 0
                          ? h('button', {
                            type: 'button',
                            className: 'dshl-boardNode',
                            onClick: () => setExpandedLayer((current) => ({ ...current, [layer]: true })),
                          }, h('span', { className: 'dshl-boardNodeLabel' }, `${t('boardShowMore')}（${bucket.hidden}）`))
                          : null)),
                      null)) : null);
            }))) : null,
        // 右抽屉：属性面板
        drawers.right ? h('div', { className: 'dshl-boardDrawer', 'data-side': 'right' },
          h('div', { className: 'dshl-boardProps' },
            selectedNode === null
              ? h('p', { className: 'dshl-boardNote' }, t('boardNoSelection'))
              : h(React.Fragment, null,
                h('div', { className: 'dshl-boardPropHead' },
                  h('span', { className: 'dshl-boardPropPath' }, `${t(LAYER_LABEL[selectedNode.layer])} · ${selectedNode.present ? t('boardPresent') : t('boardAbsent')}`),
                  h('span', { className: 'dshl-boardPropTitle' }, String(selectedNode.label)),
                  h('span', { className: 'dshl-boardPropPath' }, selectedNode.id)),
                // 下钻入口：列出这个节点内部的直接下级，点一行就选中它（等价于在画布上点那个框）
                drillPath.length === 0 ? null : h('div', { className: 'dshl-boardField' },
                  h('div', { className: 'dshl-boardFieldRow' },
                    h('span', { className: 'dshl-boardFieldLabel' }, t('boardDrillIn')),
                    h('span', { className: 'dshl-boardFieldValue' }, String(drillPath.length))),
                  h('div', { className: 'dshl-boardDrill' },
                    ...drillPath.map((item) => h('button', {
                      key: item.id,
                      type: 'button',
                      className: 'dshl-boardNode',
                      title: item.id,
                      onClick: () => setSelected(item.id),
                    },
                    h('span', { className: 'dshl-boardDot', style: { background: LAYER_COLOR[item.layer] } }),
                    h('span', { className: 'dshl-boardNodeLabel' }, String(item.label)),
                    h('span', { className: 'dshl-boardBadge' }, t(LAYER_LABEL[item.layer])))))),
                ...selectedNode.controls.map((ctl, index) => h(ControlField, { key: `${selectedNode.id}-${index}`, t, ctl }))))) : null,
        h('div', { className: 'dshl-boardFoot', ref: footRef },
          h('span', { className: 'dshl-boardHint' }, t('boardHint')),
          h('button', { type: 'button', className: 'dshl-btn', onClick: () => host.applyPreset('standard') }, t('presetStandard')),
          h('button', { type: 'button', className: 'dshl-btn', onClick: () => host.applyPreset('focus') }, t('presetFocus')),
          h('button', { type: 'button', className: 'dshl-btn', onClick: () => host.replaceConfig(null) }, t('reset'))));
    }

    return { Board, ensureBoardCss };
  },
});

