/**
 * 表单组件 多选组件
 * 
 */
import yCheckbox from './checkbox.vue';
yCheckbox.install = app => {
    app.component('y-checkbox', yCheckbox);
};
export default yCheckbox;

