/**
 * 下拉菜单 - 分割线
 * 采用 Github风格
 */
import yDropdownDivider from './divider.vue';
yDropdownDivider.install = app => {
    app.component('y-dropdown-divider', yDropdownDivider);
};
export default yDropdownDivider;