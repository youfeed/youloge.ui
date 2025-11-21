import './styles/main.less'; 

import utils from "@lib/utils";
import { installCss } from "@lib/styles/main.js";
import { version } from "../package.json";
import { defineAsyncComponent } from "vue";

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
  const capitalizeName = "use" + capitalize(name);
  composables[capitalizeName] = asyncModule;
});
// 指令函数
Object.entries(globDirectives).forEach(([path, asyncModule]) => {
  const name = path.match(/\/directives\/(.+?)\/index\.js/)?.[1];
  const capitalizeName = "v" + capitalize(name);
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
  // 系统主题
  const toggleTheme = (theme) => {
    localStorage.setItem("youloge.theme", theme);
    let doc = document.querySelector("html");
    doc.classList.toggle("light", theme === "light");
    doc.classList.toggle("dark", theme === "dark");
  };
  const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
  const themeName = themeMedia.matches ? "dark" : "light";
  themeMedia.addEventListener("change", (event) =>
    toggleTheme(event.matches ? "dark" : "light")
  );
  localStorage.getItem("youloge.theme") || toggleTheme(themeName);
  app.provide("useTheme", toggleTheme);
  // 全局属性方法
  app.config.globalProperties.CONFIG = session;
  Object.entries(utils).forEach(([key, value]) => {
    app.config.globalProperties[key] = value
    console.log(`✅ 全局绑定成功：${key}`);
  });
  // 安装函数组件
  Object.keys(composables).forEach((key) => {
    app.provide(key, composables[key]);
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
