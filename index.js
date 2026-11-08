/**
 * 布局插件的 Host 半边。
 *
 * 职责只有一件：给本插件声明一个可持久化的配置节，让界面配置与布局方案跟着
 * 「DSH 安装 / profile」走，而不是跟着浏览器 localStorage 走。
 * 换浏览器、换 Web 端、清缓存都不会丢；同一 profile 下的所有客户端读到的是同一份配置。
 *
 * 当前版本（本机实测 DSH）的落盘机制：
 * - 宿主 settings 服务把「可配置的插件条目」写进**当前 profile 的 cordis.patch.yml**——
 *   早期版本那套独立 `~/.dsh/settings.yaml` 已被废弃，只剩一次性导入迁移。
 * - 写入只接受带 `.volatile()` 的字段（`isVolatilePath` 校验），没有标记会被拒绝。
 * - 客户端经 `ctx.configForms.get('layout')` 读值、写值，落盘与并发由宿主负责。
 *
 * 界面仍全部由 client.js 呈现；这里不碰任何 UI。
 */
import z from '@deepseek-ai/schemastery';

/** 配置命名空间（= 本插件在 profile 里的条目 id）。 */
export const LAYOUT_SETTINGS_NAMESPACE = 'layout';

/**
 * 配置正文：整套布局配置 + 布局方案表，都以 JSON 字符串存放。
 *
 * 不把配置展开成结构化字段的原因：配置会随版本演进（多轮下来加了 storage / arrange /
 * relocate / rules / sync），每加一层都要同步 schema；而 schema 校验失败会让整节配置被宿主
 * 丢弃——那正是最伤用户的情况。客户端已有 `normalizeConfig` 做权威校验（夹取数值、丢弃非法
 * 枚举），这里只做「字符串」粗校验，复合校验留在唯一事实源。
 */
const Config = z.object({
  /** 布局配置（`normalizeConfig` 校验后的 JSON）。 */
  document: z.string().default('').volatile().description('Layout configuration JSON'),
  /** 布局方案表（`{ active, list }` 的 JSON）。 */
  schemes: z.string().default('').volatile().description('Layout schemes JSON'),
});

/**
 * 让宿主把本插件的配置节纳入可编辑设置。
 * `settings.configure({ auto: false })` 与其他 UI 插件同一接法：auto:false 表示不生成自动
 * 设置界面（本插件的编辑界面在自己的浮层里），但仍参与设置文档的读写与持久化。
 * 第二个参数必须是**本插件自己的 fiber**：宿主按它把这一节配置登记到该条目名下。
 */
export function apply(ctx) {
  ctx.inject(['settings'], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
  });
}

export { Config };
