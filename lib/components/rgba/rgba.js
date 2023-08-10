import yRgba from './rgba.vue';

yRgba.install = app => {
  app.component(yRgba.name, yRgba);
};

export default yRgba;