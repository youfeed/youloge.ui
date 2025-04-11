/**
 * 导航组件
 * 下划线|按钮|文字|下滑点
 */
import yNavbar from './navbar.vue';
yNavbar.install = app => {
    app.component('y-navbar', yNavbar);
};
export default yNavbar;