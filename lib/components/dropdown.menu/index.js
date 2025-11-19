/**
 * 下拉菜单 - 菜单项
 * 采用 Github风格
 */
import yDropdownMenu from './menu.vue';
yDropdownMenu.install = app => {
    app.component('y-dropdown-menu', yDropdownMenu);
};
export default yDropdownMenu;