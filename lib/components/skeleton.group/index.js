/**
 * 骨架屏组件
 * 
 */
import ySkeletonGroup from './group.vue';
ySkeletonGroup.install = app => {
    app.component('y-skeleton-group', ySkeletonGroup);
};
export default ySkeletonGroup;