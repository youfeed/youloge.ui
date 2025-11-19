/**
 * 工具提示组件
 * 
 */
import yTooltip from "./tooltip.vue";
yTooltip.install = (app) => {
  app.component("y-tooltip", yTooltip);
};
export default yTooltip;
