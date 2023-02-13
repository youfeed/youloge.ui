import yFooter from './footer.vue';

yFooter.install = app => {
  app.component(yFooter.name, yFooter);
};

export default yFooter;