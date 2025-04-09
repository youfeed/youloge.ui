/**
 * 倒计时组件
 * 计算并暴漏时间
 */
import yTiming from "./timing.vue";
yTiming.install = (app) => {
  app.component("y-timing", yTiming);
};
export default yTiming;
