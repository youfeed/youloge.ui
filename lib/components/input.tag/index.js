/**
 * 表单组件 - 标签输入框
 * 
 */
import yInputTag from './tag.vue';
yInputTag.install = app => {
    app.component('y-input-tag', yInputTag);
};
export default yInputTag;