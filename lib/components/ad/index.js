/**
 * 广告组件：默认父窗口大小
 * 
 */
import yAd from './ad.vue';
yAd.install = app => {
  yAd.component('y-ad', yAside);
};
export default yAd;