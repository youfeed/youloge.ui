/**
 * 行容器
 */
import yRow from './row.vue';
yRow.install = app => {
  app.component('y-row', yRow);
};
export default yRow;