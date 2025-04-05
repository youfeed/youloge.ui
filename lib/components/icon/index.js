/**
 * 图标组件
 * 使用阿里 iconfont
 */
import yIcon from './icon.vue';
yIcon.install = app => {
    app.component('y-icon', yIcon);
};
export default yIcon;