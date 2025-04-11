/**
 * 表单组件 选择组件
 * 
 */
import ySelect from './select.vue';
ySelect.install = app => {
    app.component('y-select', ySelect);
};
export default ySelect;