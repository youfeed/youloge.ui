/**
 * 单选组件 组合组件
 * 
 */
import yRadioGroup from './group.vue';
yRadioGroup.install = app => {
    app.component('y-radio-group', yRadioGroup);
};
export default yRadioGroup;