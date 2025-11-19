/**
 * 表单组件 - 表单项：标签 + 输入组件 + 错误提示
 * 
 */
import yFormItem from './item.vue';
yFormItem.install = app => {
    app.component('y-form-item', yFormItem);
};
export default yFormItem;

