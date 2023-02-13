import yHeader from './header.vue';

yHeader.install = app => {
  app.component(yHeader.name, yHeader);
};

export default yHeader;