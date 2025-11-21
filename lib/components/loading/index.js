/**
 * 链接组件
 * 
 */
import yLoading from './loading.vue';
yLoading.install = app => {
    app.component('y-loading', yLoading);
};
export default yLoading;