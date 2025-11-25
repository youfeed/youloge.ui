/**
 * 骨架屏组件
 * 
 */
import ySkeletonItem from './item.vue';
ySkeletonItem.install = app => {
    app.component('y-skeleton-item', ySkeletonItem);
};
export default ySkeletonItem;