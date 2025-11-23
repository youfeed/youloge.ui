/**
 * 列表组件
 * 
 */
import yList from './list.vue';
yList.install = app => {
    app.component('y-list', yList);
};
export default yList;