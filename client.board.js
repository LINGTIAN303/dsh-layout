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

    const BOARD_CSS = `
.dshl-board { position:fixed; inset:0; z-index:1260; display:flex; flex-direction:column; color:var(--dsw-alias-label-primary); font-size:13px; line-height:20px; pointer-events:none; }
/* 描图态：整层透明、点击穿透，只有框与工具条吃事件——这样真实界面既能看见也能操作 */
.dshl-board[data-mode="trace"] { background:transparent; }
/* 抽象态：整层遮住界面，成为独立工作台 */
.dshl-board[data-mode="skeleton"] { background:var(--dsw-alias-bg-layer-2); pointer-events:auto; }
.dshl-boardHead { position:absolute; top:8px; left:50%; transform:translateX(-50%); z-index:2; display:flex; align-items:center; gap:5px; flex-wrap:wrap; justify-content:center; max-width:calc(100vw - 20px); padding:4px 9px; border-radius:999px; border:1px solid var(--dsw-alias-border-l2); background:color-mix(in srgb, var(--dsw-alias-bg-layer-1) 94%, transparent); box-shadow:0 4px 16px rgba(0,0,0,.24); pointer-events:auto; }
.dshl-boardTitle { font-size:12px; font-weight:600; white-space:nowrap; }
.dshl-boardPage { font-size:11px; color:var(--dsw-alias-label-secondary); white-space:nowrap; max-width:150px; overflow:hidden; text-overflow:ellipsis; }
.dshl-boardScenes { display:flex; align-items:center; gap:3px; flex-wrap:wrap; }
.dshl-boardScene { height:22px; padding:0 8px; border-radius:999px; border:1px solid var(--dsw-alias-border-l1); background:transparent; color:var(--dsw-alias-label-secondary); font:inherit; font-size:11px; cursor:pointer; white-space:nowrap; }
.dshl-boardScene:hover { background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-primary); }
.dshl-boardScene[data-active="true"] { border-color:var(--dsw-alias-brand-primary); color:var(--dsw-alias-brand-primary); background:color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent); }
.dshl-boardGrow { flex:1; min-width:0; }
/* 层级开关：四层各自可开关，描图态默认只开区域层——44 个框叠在一起没法看 */
.dshl-boardLayers { display:flex; align-items:center; gap:3px; padding-left:6px; border-left:1px solid var(--dsw-alias-border-l2); }
.dshl-boardLayer { height:22px; padding:0 8px; border-radius:999px; border:1px solid var(--dsw-alias-border-l1); background:transparent; color:var(--dsw-alias-label-secondary); font:inherit; font-size:11px; cursor:pointer; white-space:nowrap; }
.dshl-boardLayer[data-on="true"] { color:var(--dsw-alias-label-primary); border-color:currentColor; }
.dshl-boardLayer:hover { background:var(--dsw-alias-interactive-bg-hover); }
/* 画布铺满整层：框用视口坐标减去画布原点，与真实元素严格对齐 */
.dshl-boardCanvasWrap { position:absolute; inset:0; overflow:hidden; }
.dshl-board[data-mode="skeleton"] .dshl-boardCanvasWrap { inset:auto; top:0; left:0; right:0; bottom:0; background:var(--dsw-alias-bg-layer-2); }
.dshl-boardCanvas { position:absolute; inset:0; }
.dshl-boardBox { position:absolute; border:1px solid; border-radius:4px; pointer-events:auto; cursor:pointer; background:transparent; padding:0; }
.dshl-boardBox:hover { background:color-mix(in srgb, currentColor 14%, transparent); }
.dshl-boardBox[data-active="true"] { border-width:2px; background:color-mix(in srgb, currentColor 20%, transparent); }
.dshl-boardBoxTag { position:absolute; left:0; top:-14px; font-size:10px; line-height:13px; padding:0 3px; border-radius:3px; white-space:nowrap; color:var(--dsw-alias-bg-layer-1); background:currentColor; }
/* 只在框够宽时才显示标签：窄框上挂标签会互相压住（实测侧栏里十几个框的标签叠成一团） */
.dshl-boardBoxTag[data-tight="true"] { display:none; }
.dshl-boardBoxTag[data-below="true"] { top:auto; bottom:-14px; }
.dshl-boardEmpty { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding:24px; text-align:center; color:var(--dsw-alias-label-secondary); font-size:12px; }
/* 抽屉：描图态默认收起，按需拉出；收起时只剩一条窄标签，不遮挡真实界面 */
.dshl-boardDrawers { position:absolute; top:0; bottom:0; left:0; right:0; pointer-events:none; }
.dshl-boardDrawer { position:absolute; top:52px; bottom:52px; display:flex; flex-direction:column; pointer-events:auto; border-radius:10px; border:1px solid var(--dsw-alias-border-l2); background:var(--dsw-alias-bg-layer-1); box-shadow:0 10px 30px rgba(0,0,0,.28); overflow:hidden; }
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
.dshl-boardNode { display:flex; align-items:center; gap:6px; width:100%; padding:4px 7px; border-radius:6px; border:1px solid transparent; background:transparent; color:var(--dsw-alias-label-primary); font:inherit; font-size:12px; cursor:pointer; text-align:left; }
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
.dshl-boardFoot { position:absolute; left:50%; bottom:10px; transform:translateX(-50%); display:flex; gap:8px; align-items:center; flex-wrap:wrap; max-width:calc(100vw - 24px); padding:6px 10px; border-radius:999px; border:1px solid var(--dsw-alias-border-l2); background:color-mix(in srgb, var(--dsw-alias-bg-layer-1) 94%, transparent); box-shadow:0 4px 16px rgba(0,0,0,.24); pointer-events:auto; }
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
              const order = config.slots.order?.[key] ?? item.order ?? 0;
              controls.push(ctlNum('boardOrder', order, -50, 50, 1, (draft, value) => { draft.slots.order[key] = value; }));
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

    /* ============================== 画布几何 ============================== */

    function pageKeyOf(targets) {
      const kind = host.pageKindOf(targets);
      if (kind === 'external') return `external:${targets.external?.pageKey ?? '(unknown)'}`;
      return kind;
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
      const canvasRef = React.useRef(null);
      const tree = React.useMemo(() => buildTree(snapshot), [snapshot]);
      const pageKey = pageKeyOf(targets);
      const pageLabel = host.currentPageLabel(targets, t);

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
        if (mode !== 'skeleton') return;
        const geometry = host.readGeometry(pageKey);
        setRects(layoutSkeleton(geometry, canvasBox));
      }, [mode, pageKey, canvasBox, snapshot]);

      const allNodes = React.useMemo(() => {
        const map = new Map();
        for (const layer of LAYERS) for (const item of tree[layer]) map.set(item.id, item);
        return map;
      }, [tree]);
      const selectedNode = selected === null ? null : (allNodes.get(selected) ?? null);

      const needle = filter.trim().toLowerCase();
      const matches = (item) => needle === '' || item.id.toLowerCase().includes(needle) || String(item.label).toLowerCase().includes(needle);

      const scenes = [
        { key: 'conversation', labelKey: 'surfaceConversation', kind: 'conversation' },
        { key: 'plugins', labelKey: 'surfacePluginsManager', kind: 'plugins' },
        { key: 'pluginDetail', labelKey: 'surfacePluginDetail', kind: 'pluginDetail' },
        { key: 'settings', labelKey: 'surfaceSettingsDialog', kind: 'settings' },
      ];
      const currentKind = host.pageKindOf(targets);

      return h('div', { className: 'dshl-board', 'data-dshl-layer': '', 'data-mode': mode },
        // 画布铺满整层：描图态的框用视口坐标减去画布原点，与真实元素严格对齐；抽象态整层不透明
        h('div', { className: 'dshl-boardCanvasWrap', ref: canvasRef },
          h('div', { className: 'dshl-boardCanvas' },
            mode === 'skeleton' && Object.keys(rects).length === 0
              ? h('div', { className: 'dshl-boardEmpty' }, t('boardSkeletonEmpty'))
              : null,
            ...Object.entries(rects).map(([id, rect]) => {
              const item = allNodes.get(id);
              if (item === undefined) return null;
              if (layerOn[item.layer] !== true) return null;
              const color = LAYER_COLOR[item.layer];
              return h('button', {
                key: id,
                type: 'button',
                className: 'dshl-boardBox',
                'data-active': selected === id ? 'true' : undefined,
                style: { left: rect.x, top: rect.y, width: rect.w, height: rect.h, borderColor: color, color },
                title: `${id} · ${Math.round(rect.w)}×${Math.round(rect.h)}`,
                onClick: () => { setSelected(id); setDrawer('right', true); },
              },
              rect.h > 22
                ? h('span', {
                  className: 'dshl-boardBoxTag',
                  'data-below': rect.y < 22 ? 'true' : undefined,
                  'data-tight': rect.w < String(item.label).length * 7 + 10 ? 'true' : undefined,
                }, String(item.label))
                : null);
            }))),
        h('div', { className: 'dshl-boardHead' },
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
                        ...bucket.items.map((item) => h('button', {
                          key: item.id,
                          type: 'button',
                          className: 'dshl-boardNode',
                          'data-active': selected === item.id ? 'true' : undefined,
                          'data-offline': item.present ? undefined : 'true',
                          title: item.id,
                          onClick: () => { setSelected(item.id); setDrawer('right', true); },
                        },
                        h('span', { className: 'dshl-boardNodeLabel' }, String(item.label)),
                        item.source === 'official' ? null : h('span', { className: 'dshl-boardBadge', 'data-tier': item.source }, t(item.source === 'third' ? 'ownerThird' : 'ownerAuto')))),
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
                ...selectedNode.controls.map((ctl, index) => h(ControlField, { key: `${selectedNode.id}-${index}`, t, ctl }))))) : null,
        h('div', { className: 'dshl-boardFoot' },
          h('span', { className: 'dshl-boardHint' }, t('boardHint')),
          h('button', { type: 'button', className: 'dshl-btn', onClick: () => host.applyPreset('standard') }, t('presetStandard')),
          h('button', { type: 'button', className: 'dshl-btn', onClick: () => host.applyPreset('focus') }, t('presetFocus')),
          h('button', { type: 'button', className: 'dshl-btn', onClick: () => host.replaceConfig(null) }, t('reset'))));
    }

    return { Board, ensureBoardCss };
  },
});

