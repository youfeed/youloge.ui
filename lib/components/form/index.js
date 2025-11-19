/**
 * 表单组件 核心状态与验证逻辑
 * 
 */
import yForm from './form.vue';
yForm.install = app => {
    app.component('y-form', yForm);
};
export default yForm;

