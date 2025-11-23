/**
 * 列表组件
 * 
 */
import yListItem from './item.vue';
yListItem.install = app => {
    app.component('y-list-item', yListItem);
};
export default yListItem;