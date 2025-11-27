/**
 * 菜单组件
 * 
 */
import yMenuDetails from './details.vue';
yMenuDetails.install = app => {
    app.component('y-menu-details', yMenuDetails);
};
export default yMenuDetails;
 