/**
 * 列容器
 */
import yCol from './col.vue';
yCol.install = app => {
  app.component('y-col', yCol);
};
export default yCol;