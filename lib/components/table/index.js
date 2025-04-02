/**
 * 表单组件
 * 
 */
import yTable from './table.vue';
yTable.install = app => {
    yTable.component('y-table', yTable);
};
export default yTable;