/**
 * 表单组件 输入组件
 * 
 */
import yInput from './input.vue';
yInput.install = app => {
    app.component('y-input', yInput);
};
export default yInput;
export { yInput }