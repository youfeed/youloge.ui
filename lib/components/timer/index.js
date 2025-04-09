/**
 * 倒计时组件
 * 计算并暴漏时间
 */
import yTimer from "./timer.vue";
yTimer.install = (app) => {
  app.component("y-timer", yTimer);
};
export default yTimer;
