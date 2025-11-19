/**
 * 选项卡
 * 采用 Github风格
 */
import yTabs from './tabs.vue';
yTabs.install = app => {
    app.component('y-tabs', yTabs);
};
export default yTabs;