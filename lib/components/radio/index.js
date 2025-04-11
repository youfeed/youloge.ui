/**
 * 表单组件 单选组件
 * 
 */
import yRadio from './radio.vue';
yRadio.install = app => {
    app.component('y-radio', yRadio);
};
export default yRadio;