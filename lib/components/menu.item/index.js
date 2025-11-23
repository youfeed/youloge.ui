/**
 * 菜单组件
 * 
 */
import yMenuItem from './item.vue';
yMenuItem.install = app => {
    app.component('y-menu-item', yMenuItem);
};
export default yMenuItem;