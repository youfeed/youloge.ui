/**
 * 下拉菜单 - 菜单项
 * 采用 Github风格
 */
import yDropdownItem from './item.vue';
yDropdownItem.install = app => {
    app.component('y-dropdown-item', yDropdownItem);
};
export default yDropdownItem;