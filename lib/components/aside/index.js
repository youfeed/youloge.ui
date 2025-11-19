/**
 * 侧边栏：导航 / 菜单区
 */
import yAside from './aside.vue';

yAside.install = app => {
  app.component('y-aside', yAside);
};

export default yAside;