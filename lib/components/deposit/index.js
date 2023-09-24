import yDeposit from './deposit.vue';

yDeposit.install = app => {
  app.component('y-deposit', yDeposit);
};

export default yDeposit;