/**
 * 徽章组件
 * 
 */
import yBadge from './badge.vue';
yBadge.install = app => {
    app.component('y-badge', yBadge);
};
export default yBadge;