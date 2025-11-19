/**
 * 内容区：页面主体
 */
import yAside from './content.vue';

yAside.install = app => {
  app.component('y-content', yAside);
};

export default yAside;