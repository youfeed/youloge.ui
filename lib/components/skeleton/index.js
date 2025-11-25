/**
 * 骨架屏组件
 * 
 */
import ySkeleton from './skeleton.vue';
ySkeleton.install = app => {
    app.component('y-skeleton', ySkeleton);
};
export default ySkeleton;