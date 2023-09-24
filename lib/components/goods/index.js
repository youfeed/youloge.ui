import yGoods from './goods.vue';

yGoods.install = app => {
  app.component('y-video', yGoods);
};

export default yGoods;