/**
 * 导航组件
 * 
 */
import yNavbar from './navbar.vue';
yNavbar.install = app => {
    app.component('y-navbar', yNavbar);
};
export default yNavbar;