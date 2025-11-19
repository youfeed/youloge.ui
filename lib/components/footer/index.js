/**
 * 底部：版权 / 链接区
*/
import yFooter from './footer.vue';

yFooter.install = app => {
  app.component('y-footer', yFooter);
};

export default yFooter;