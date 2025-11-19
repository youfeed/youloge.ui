/**
 * 头部：导航栏 / 标题区
 */
import yHeader from './header.vue';

yHeader.install = app => {
  app.component('y-header', yHeader);
};

export default yHeader;