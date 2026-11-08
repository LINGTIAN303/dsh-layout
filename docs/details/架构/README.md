# 插件架构

## 组成

```text
bundle: dsh-layout（package.json 的 dsh.bundle.patch + dsh.client）
├─ Host 半边 index.js             只导出 apply()，占位；不注册服务、不写配置
└─ Client 半边 client.js          全部界面与布局逻辑
   ├─ 配置模型 / 本地持久化        localStorage: dsh-layout/config/v1
   ├─ DOM 注解器                   识别外壳结构，写 data-dshl-* 标记
   ├─ 界面结构识别                 官方登记 / 第三方登记 / 自动识别 三档
   ├─ 样式引擎                     按配置生成 style[data-dsh-layout="dynamic"]
   ├─ plugins.detail.section 注册  插件详情页内的编辑区
   └─ shell.overlay 注册           编辑模式：列分隔条、区域框、浮动工具条
```

```mermaid
flowchart LR
  A[用户操作编辑区/浮层] --> B[store.updateConfig]
  B --> C[normalizeConfig 校验夹取]
  C --> D[localStorage 持久化 防抖]
  C --> E[buildDynamicCss]
  E --> F[style 标签写入页面]
  C --> G[notify 订阅者]
  G --> H[编辑区重渲染]
  I[MutationObserver 观察 body] --> J[readTargets 识别外壳]
  J --> K[annotate 写 data-dshl-*]
  K --> E
```

## 设计选择

1. **不替换宿主组件。** 宿主 `root` 单插槽里是 AppFrame，替换它就要重写三栏、抽屉、拖拽手柄、主题呈现等全部行为，且会连带影响所有依赖子插槽的插件。因此只做两件事：给宿主 DOM 打标记、用 CSS 覆盖几何。
2. **入口按需求放在插件详情页。** `plugins.detail.section` 的 owner props 带 `subject`（`kind: 'bundle' | 'row' | 'item'`），组件只在 `pkg.name === 'dsh-layout'` 时渲染，不会污染其它插件的详情页。
3. **编辑浮层常驻注册。** `shell.overlay` 是框架级浮层，编辑模式在任意页面都能操作；浮层根节点 `pointer-events:none`，只有手柄与工具条可点，不挡住会话。
4. **配置存本地。** 布局是纯客户端呈现偏好，不进会话日志、不进 Host 配置，因此不需要重启插件、不触发 profile 重载；代价是桌面端与浏览器端配置独立，用导出/导入跨端同步。
5. **读取时全量校验。** localStorage 与导入文件都属于不可信输入，统一走 `normalizeConfig`：枚举项去重、未知项丢弃、数值夹取到合法区间，旧版本缺字段用默认值补齐。

## 界面结构识别（三档）

布局的对象不只是三栏，还有每一个「界面页面」：宿主自带的会话页/插件页，以及各插件贡献的面板页。识别分三档，人工登记优先、算法兜底：

| 档位 | 来源 | 维护责任 |
| --- | --- | --- |
| 官方（official） | 宿主外壳区域 + 宿主页面 + 官方插件页面，登记在 `OFFICIAL_PAGES` | DSH 每次升级后主动复核 |
| 第三方（third） | 已适配的第三方插件页面，登记在 `THIRD_PARTY_PAGES` | 逐个补充，没适配的自动降级 |
| 自动识别（auto） | 前两档都没命中时的兜底：iframe / `data-dsh-plugin` 等插件自留痕迹 | 算法承担，只判「第三方或未知」，绝不判官方 |

判定顺序：官方表 → 第三方表 → 自动识别。关键纪律是**未登记的页面永远不会被判成官方**——官方只有一份人工名单，不会因为「长得像」而误判。

- 页面身份用**签名**表达：`tag` + CSS 模块前缀 + `data-*` 名值对；iframe 用源前缀。优先用宿主/插件自己写死的 `data` 值（如 `data-plugin-panel="true"`、`data-dsh-plugin="task-board"`），CSS 模块哈希只作次要依据。
- **登记失配可观测**：缓存记住 `registeredTier`（上次命中登记的档位）。若某页曾由登记认出来、现在掉到自动档，卡片显示「签名变化，待复核」——这说明 DSH 升级或插件更新改了结构，该去复核登记表。这条直接对应「官方每次更新必须适配」的要求。
- **异常自动落盘 + 一键导出**：识别异常写入 `localStorage` 键 `dsh-layout/surface-anomalies/v1`，两类：`drift`（登记过但签名变了）与 `unregistered`（从未登记、只靠自动识别）。「界面结构」卡片底部「待复核清单」列出条目并提供「导出待复核清单」（JSON，含实测签名、观测时间、命中次数）与「清空」。导出文件可直接对照更新 `OFFICIAL_PAGES` / `THIRD_PARTY_PAGES`。异常在页面恢复正常登记时自动清除，清单不会堆积已解决的问题。
- 页面列表来自侧栏面板行（`aria-current="page"` 判当前页），只收 `button` 子节点，排除「更多」这类菜单触发器。

## 区域界面拆解

「拆解」= 把某个区域认成更小的可控单元，让它们能独立显隐与互换位置。目前覆盖四个区域。

### 侧栏

| 单元 | 判定方式 |
| --- | --- |
| 品牌标识 | 品牌行里含 `[data-slot="sidebar.brand.mark"]` 的直接子级（按钮，图标 + 名称） |
| 收起按钮 | 品牌行里含 `[data-sidebar-toggle]` 的直接子级 |
| 状态按钮行 | 底部区里含 `[data-slot="sidebar.footer.action"]` 的直接子级 |
| 账号菜单 | 底部区里含 `[data-slot="sidebar.settings"]` 的直接子级 |

- 「直接子级」由锚点向上走到块的子级得到（与右栏同一套求法），中间多一层包裹不影响识别。
- 四个单元各自 `display:none`，互不影响。实测隐藏状态按钮行后底部区从 138px 收到 52px，再隐藏账号菜单后归 0。
- 品牌行只有两个直接子级，所以能单独隐藏任一：隐藏品牌标识只留收起按钮（仍可折起侧栏），隐藏收起按钮则保留标识。
- 拆解只碰宿主容器（品牌行、底部区、状态行、账号区），第三方插件塞进状态行的按钮只作为容器内容一起显隐；插件换版本不受影响。
- 账号菜单同时是设置入口（`settings.launcher`）：隐藏后设置仍可用 `Ctrl/⌘+Alt+,` 打开，属用户显式选择，不做额外拦截。

### 会话区

| 单元 | 宿主结构与判定 |
| --- | --- |
| 会话头 | `[data-slot="conversation.header"]`（`display:contents`）里的 `header` 元素，才是真正的 flex 项 |
| 消息区 | `[data-slot="conversation.session"]`，位于 `._scrollBody_` 下 |
| 输入区 | `[data-slot="conversation.composer"]` 的父元素 `._composerSeat_`，本身是 `position:sticky` 的 flex 项 |

- 可做的操作：三块**独立显隐**；会话头与正文**换前后**（`convroot` 上设 `order`）；输入区**提到消息区上方**（`convscroll` 上设 `order:-1`）。
- 提到上方时必须同时把输入区的 `position:sticky; bottom:0` 改成 `sticky; top:0`，否则它会跟着滚动内容一起跑出可视区——这是实测踩到的坑。
- 会话头内部再拆两行：**标题行**（面包屑 + 会话操作 + 工具 + 角标）与**视图标签行**（对话 / 轨迹等视图切换）。两行都是 `conversation.session.header` 槽位的元素子级；视图标签行按通用 ARIA 标记 `role=tablist` / `role=tab` 认，剩下那行就是标题行——不依赖 CSS 模块类名，宿主加视图也不受影响。
- 标题行内部再拆两段：**会话名**（面包屑，`conversation.session.header.lineage`）与**操作组**（智能体团队 / 权限等，`conversation.session.header.actions`）。两者同属标题行里的 titleCluster，按槽位各自向上取直接子级；隐藏会话名后操作组左移到原会话名位置，标题行高度不变。
- 输入区内部再拆一段：**任务面板**（待办清单，宿主写死的 `data-testid="todo-panel"`）可单独隐藏。它只在存在待办时渲染，没有待办就没有可隐藏对象；实测隐藏后输入区整体 170 → 128。
- 排版坑：会话头是 grid，宿主写死了 `grid-template-rows: 32px 35px` 与 `min-height: 76px`。只给一行 `display:none` 高度不会变，必须同时把行高交还 `auto` 并撤掉 `min-height`（实测隐藏标题行 78→46，隐藏标签行 78→43）；两行都隐藏时会话头整体 `display:none`。
- 拆解结果全部是 CSS `order` / `display` 覆盖，不改 React 树、不移动 DOM，宿主自身的滚动与粘贴行为不受影响。

### 右栏

| 单元 | 判定方式 |
| --- | --- |
| 标签栏 | 由 `[data-slot="sidebar.right.pane.tab.title"]` 向上找到「共同父的直接子级」 |
| 内容区 | 由 `[data-slot="sidebar.right.pane.tab"]` 同上定位 |

两个分支同父（`._tabHost_`，flex column），所以可各自隐藏，也可上下互换（`order` 互换）。定位不用 CSS module 哈希类名：先求两个 slot 的最近公共祖先，再各自向上取该祖先的直接子级，插件换构建也照样成立。

### 设置页

| 单元 | 判定方式 |
| --- | --- |
| 导航列 | 标题行（含 `settings.header` 的子级）+ `NAV` 元素 |
| 内容列 | 页头（含 `settings.action` / `settings.close`）+ 选项区（含 `settings.section`） |

设置面板是**命名网格区域**（`grid-template-areas: "title header" "nav options"`），所以不能只改列宽——隐藏导航后左侧会留一条空轨道。正确做法是**重写区域名并给子级重新指派 `grid-area`**：

- 隐藏导航：`grid-template-columns: minmax(0,1fr)`，区域改为单列，子级改挂 `dshlHeader` / `dshlOptions`。
- 导航右置：`grid-template-columns: minmax(0,1fr) <导航宽度>`，区域改为 `"dshlHeader dshlTitle" "dshlOptions dshlNav"`。导航宽度用户没设过时现场量一次真实值。

### 共同约定

- 结构识别成功后持久化标记（`dsh-layout/conv-parts/v1`、`dsh-layout/aux-parts/v1`）：编辑区挂在插件详情页上，此时会话区/右栏/设置面板可能不在 DOM 里，若只按「当前 DOM 有没有」判断，控制项会在插件页上永远不可用。`aux-parts` 按区域分键（`sidebar` / `rightbar` / `settings`）。

## 恢复通道（不可恢复状态防护）

布局可能改变「回到插件详情页」的路径，因此恢复能力必须独立于被改变的界面本身：

```mermaid
flowchart TD
  A[危险配置生效] --> B{是否还有可见区域}
  B -- 有 --> C[自由模式：探测留白后随机落点]
  B -- 三栏全隐 --> D[空白模式：屏幕正中给 恢复默认 / 插件页 / 编辑模式]
  C -- 探测失败 --> E[角落模式：左下角固定位]
  C --> F[点击打开编辑浮层]
  D --> G[恢复默认 / 打开插件页（自动放出会话区）/ 进入编辑模式]
  E --> F
  H[Ctrl/Alt+L] --> F
  I[Ctrl/Alt/Shift+L] --> J[直接恢复默认]
  K[Web: #dsh-layout=reset] --> J
  F --> J
  J --> L[动态样式清空 + 配置归零]
```

- 恢复入口的落点**不是固定位置**，且**不认识任何具体插件**：只依赖浏览器通用几何（元素矩形、可见性、可交互性）。第三方插件把控件放在哪里都只是一个矩形，算法一视同仁——这是「用户随时可能装新插件」的前提要求。
- 依附优先：测量整页（不只四个列区域，因为插件可渲染到 overlay/portal/body 直下），把同排控件按中心 y 归组，依附点必须落在该排跨度内且与所有占位矩形零相交；实测能稳定贴到表情包按钮、模型选择器这类工具栏空档。
- 遮挡守卫：DOM 变化后复查按钮矩形，被压住就递增 `reposition` 信号重算落点（1200ms 最小间隔防抖）。这条专门应对「未知插件在按钮之后才出现」。
- 空白模式把入口放在屏幕正中：这是最后一道「用户键盘失灵」的兜底，必须一眼可见、不必寻找。三枚按钮各自独立：恢复默认（回到宿主默认）、插件页（切到插件面板并自动放出被隐藏的会话区，因为插件页渲染在 main 面板里）、编辑模式（打开浮层，空白页下浮层无区域可框，工具条会提示「当前没有可见区域可拖拽」）。
- 快捷键与哈希重置不依赖浮层组件渲染，属于最后兜底；因此即使编辑浮层出问题也能恢复。
- 恢复按钮的点击还有一层不依赖样式的坐标命中兜底（document 捕获阶段监听 `pointerdown`/`mousedown`）。
- 设置面板偏移在生成样式时按视口夹取，面板不可能被配置到屏幕外。
- 折叠态（`:not([data-sidebar-collapsed])` 门控）不叠加本插件列序，避免「宿主列宽 + 本插件列序」错位造成的不可点击。

## 与宿主的交互面

| 交互 | 方式 |
| --- | --- |
| 读外壳结构 | 只读 DOM：`[data-slot="..."]`、`[data-rightbar-col]`、`[data-sidebar-right-panel]`、`[data-conversation-content]`、`[data-shortcut-modal="settings"]`、`aria-label` |
| 改几何 | 只写 CSS：自身 style 标签 + `data-dshl-*` 属性；不写宿主 inline style、不改宿主 class |
| 导航与路由 | 不改；仍由宿主负责（左栏面板切换、会话打开、设置开关） |
| 其它插件 | 通过宿主插槽共存；本插件不读取其它插件的样式或组件 |

## 升级稳定性

- 优先依赖宿主稳定的 `data-*` 属性与 `data-slot` 名称；CSS module 哈希类名一律作为兜底而非首选。
- 识别失败时 `targets.ok === false`，编辑区显示「未识别界面结构」，动态样式为空，界面维持宿主默认。
- 所有生成样式都限定在 `[data-dshl-frame]` 或 `[data-dshl-*]` 之下，不产生全局选择器，卸载时连同两个 style 标签一起移除。
