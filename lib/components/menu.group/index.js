/**
 * 菜单组件
 * 
 */
import yMenuGroup from './group.vue';
yMenuGroup.install = app => {
    app.component('y-menu-group', yMenuGroup);
};
export default yMenuGroup;