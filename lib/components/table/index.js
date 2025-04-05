/**
 * 表单组件
 * 
 */
import yTable from './table.vue';
yTable.install = app => {
    app.component('y-table', yTable);
};
export default yTable;