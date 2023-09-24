import yHeader from './header.vue';

yHeader.install = app => {
  app.component('y-header', yHeader);
};

export default yHeader;