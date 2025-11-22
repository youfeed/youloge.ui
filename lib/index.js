import '@lib/styles/index.less'; 

import { version } from "../package.json";
import { defineAsyncComponent } from "vue";
import { installCss } from "@lib/utils/style.js";

// 导出辅助函数
var composables = {},
  directives = {},
  components = {};
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const globComposables = import.meta.glob(["./composables/*/index.js"], {
  eager: true,
  import: "default",
});
const globDirectives = import.meta.glob(["./directives/*/index.js"], {
  eager: true,
  import: "default",
});
const globComponents = import.meta.glob(["./components/*/index.js"]);
// 函数组件
Object.entries(globComposables).forEach(([path, asyncModule]) => {
  const name = path.match(/\/composables\/(.+?)\/index\.js/)?.[1];
  const capitalizeName = "use" + name.split('.').map(is=>capitalize(is)).join('');
  composables[capitalizeName] = asyncModule;
});
// 指令函数
Object.entries(globDirectives).forEach(([path, asyncModule]) => {
  const name = path.match(/\/directives\/(.+?)\/index\.js/)?.[1];
  const capitalizeName = "v" + name.split('.').map(is=>capitalize(is)).join('');
  directives[capitalizeName] = asyncModule;
});
// 基础组件
Object.entries(globComponents).forEach(([path, asyncModule]) => {
  const name = path.match(/\/components\/(.+?)\/index\.js/)?.[1];
  const capitalizeName = "y" + name.split('.').map(is=>capitalize(is)).join('');
  components[capitalizeName] = defineAsyncComponent(asyncModule);
});
// 解构导出
export const { ...exported } = { ...composables, ...directives, ...components };
export const { ...exportComposables } = composables;
export const { ...exportDirectives } = directives;
export const { ...exportComponents } = components;

// 自动安装插件：要配置参数
export const install = (app, config) => {
  // 动态生成 style
  installCss();
  console.log(`✅ 全局动态样式注入成功`);
  // 配置文件
  let { APIKEY, APIURL, VIPURL, ROUTES } = config;
  let session = Object.assign(
    {
      APIKEY: "",
      APIURL: "https://api.youloge.com",
      VIPURL: "/",
      WWWURL: "/",
      ROUTES: [],
    },
    { APIKEY, APIURL, VIPURL, ROUTES }
  );
  sessionStorage.setItem("youloge", JSON.stringify(session));
  // 全局属性方法
  app.config.globalProperties.CONFIG = session;
  // 安装函数组件
  Object.keys(composables).forEach((key) => {
    app.config.globalProperties[key] = composables[key]
    app.provide(key, composables[key]);
    console.log(`✅ 全局绑定成功：${key}`);
  });
  // 安装样式组件
  Object.keys(components).forEach((key) => {
    app.component(key, components[key]);
  });
  // 安装指令组件
  Object.values(directives).forEach((val) => {
    app.directive(val.name, val);
  });
  // 导出路由
  app.provide("useRoutes", ROUTES);
};
const youloge = { name: "youloge", version, install };
export default youloge;
