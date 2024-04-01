/**
 * @description 快捷充值组件
 */
import yDeposit from './deposit.vue';

yDeposit.install = app => {
  app.component('y-deposit', yDeposit);
};

export default yDeposit;