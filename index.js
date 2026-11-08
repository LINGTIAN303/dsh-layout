/**
 * 布局插件的 Host 半边。
 *
 * 职责只有一件：在宿主设置文档（~/.dsh/settings.yaml）里给本插件留一个命名空间，
 * 让界面配置与布局方案跟着「用户账号 / 机器上的 DSH 配置」走而不是浏览器 localStorage 走。
 * 换浏览器、换 Web 端、清缓存都不会丢；同一份 DSH 安装下的所有客户端读到的是同一份配置。
 *
 * 机制（与 ui-theme / ui-locale 同一条路）：导出 schemastery 的 Config，
 * 宿主把它当作本插件的配置节；客户端经 `ctx.configForms.get('layout')` 读值、写值，
 * 写入走宿主 `remote.settings.mutate`，落盘由宿主负责。界面仍全部由 client.js 呈现。
 */
import z from '@deepseek-ai/schemastery';

/** 配置在宿主设置文档里的命名空间（= 本插件在 profile 里的行 id）。 */
export const LAYOUT_SETTINGS_NAMESPACE = 'layout';

/**
 * 配置正文：整套布局配置 + 布局方案表，两者都以 JSON 字符串存放。
 * 不做结构化展开的原因：配置的字段会随版本演进（三轮下来加了 storage / arrange / relocate / rules / sync），
 * 每加一层都要同步 schema，而 schema 校验失败会让整节配置被丢弃——那正是最伤用户的情况。
 * 客户端本来就有 `normalizeConfig` 做权威校验（夹取数值、丢弃非法枚举），这里只做「字符串 + 长度上限」的粗校验，
 * 复合校验交给唯一事实源。
 */
const Config = z.object({
  /** 布局配置（normalizeConfig 校验后的 JSON）。 */
  document: z.string().default('').description('Layout configuration JSON'),
  /** 布局方案表（{ active, list } 的 JSON）。 */
  schemes: z.string().default('').description('Layout schemes JSON'),
});

/**
 * 让宿主把本插件的配置节纳入设置文档。
 * `settings.configure({ auto: false }, ctx.fiber)` 是各 UI 插件统一的接法：auto:false 表示
 * 不使用自动生成的设置界面（本插件的界面在自己的浮层里），但仍参与设置文档的读写与持久化。
 */
export function apply(ctx) {
  ctx.inject(['settings'], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
  });
}

export { Config };
