/**
 * 选项卡 - 内容区：标签对应的面板
 * 采用 Github风格
 */
import yTabpane from './tabpane.vue';
yTabpane.install = app => {
    app.component('y-tab-pane', yTabpane);
};
export default yTabpane;