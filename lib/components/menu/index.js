/**
 * 菜单组件
 * 
 */
import yMenu from './menu.vue';
yMenu.install = app => {
    app.component('y-menu', yMenu);
};
export default yMenu;