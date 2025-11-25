/**
 * 表格组件 
 * 
 */
import yTableColumn from './column.vue';
yTableColumn.install = app => {
    app.component('y-table-column', yTableColumn);
};
export default yTableColumn;