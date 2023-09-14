import yAside from './aside.vue';

yAside.install = app => {
  app.component(yAside.name, yAside);
};

export default yAside;