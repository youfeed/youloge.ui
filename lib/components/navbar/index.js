/**
 * 导航组件 navigation
 * 面包屑区域 breadcrumb 下划线|按钮|文字|下滑点
 * 进度条区域 progress 默认为下拉百分比进度
 */
import yNavbar from './navbar.vue';
yNavbar.install = app => {
    app.component('y-navbar', yNavbar);
};
export default yNavbar;