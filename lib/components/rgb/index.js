import yRgb from './rgb.vue';

yRgb.install = app => {
  app.component('y-rgb', yRgb);
};

export default yRgb;