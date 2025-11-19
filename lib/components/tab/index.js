/**
 * 选项卡 - 单个选项卡
 * 采用 Github风格
 */
import yTab from './tab.vue';
yTab.install = app => {
    app.component('y-tab', yTab);
};
export default yTab;