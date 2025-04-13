/**
 * 表单组件 
 * 
 */
import yForm from './form.vue';
yForm.install = app => {
    app.component('y-form', yForm);
};
export default yForm;

