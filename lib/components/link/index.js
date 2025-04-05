/**
 * 链接组件
 * 
 */
import yLink from './link.vue';
yLink.install = app => {
    app.component('y-link', yLink);
};
export default yLink;