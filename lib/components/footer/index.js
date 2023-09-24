import yFooter from './footer.vue';

yFooter.install = app => {
  app.component('y-footer', yFooter);
};

export default yFooter;