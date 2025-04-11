/**
 * 表单组件 开关组件
 * 
 */
import ySwitch from './switch.vue';
ySwitch.install = app => {
    app.component('y-switch', ySwitch);
};
export default ySwitch;
