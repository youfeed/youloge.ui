/**
 * 按钮组件
 * 
 */
import yButton from './button.vue';
yButton.install = app => {
    yButton.component('y-button', yButton);
};
export default yButton;