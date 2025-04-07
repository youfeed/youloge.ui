/**
 * 下拉菜单
 * 采用 Github风格
 */
import yDropdown from './dropdown.vue';
yDropdown.install = app => {
    app.component('y-dropdown', yDropdown);
};
export default yDropdown;