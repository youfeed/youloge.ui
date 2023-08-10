import yRich from './rich.vue';

yRich.install = app => {
  app.component(yRich.name, yRich);
};

export default yRich;