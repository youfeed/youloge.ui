/**
 * Drawer  组件库
 * @description: 组件库
 * @author: yujiajie
 * @createDate: 2023/7/17
 */
import yAside from './aside.vue';

yAside.install = app => {
  app.component(yAside.name, yAside);
};

export default yAside;