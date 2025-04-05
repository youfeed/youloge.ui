/**
 * 间距组件
 * 
 */
import ySpace from './space.vue';
ySpace.install = app => {
    app.component('y-space', ySpace);
};
export default ySpace;