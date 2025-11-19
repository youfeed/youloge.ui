/**
 * 按钮组件
 * 
 */
import yButton from './button.vue';
yButton.install = app => {
    app.component('y-button', yButton);
};
export default yButton;