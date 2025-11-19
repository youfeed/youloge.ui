/**
 * 根容器
 */
import yLayout from './layout.vue';
yLayout.install = app => {
  app.component('y-layout', yLayout);
};
export default yLayout;