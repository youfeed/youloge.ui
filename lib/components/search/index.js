/**
 * 搜索组件
 * 需要自己根据type uuid 进行跳转
 */
import ySearch from './search.vue';
ySearch.install = app => {
  app.component('y-search', ySearch);
};
export default ySearch;