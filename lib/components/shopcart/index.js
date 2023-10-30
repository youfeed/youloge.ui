import yShopcart from './shopcart.vue';
/**
 * 1. useGoods下单 传spu sku.uuid profile.uuid 返回 local money
 * 2. 使用 local money + usePayment 付款
 */
yShopcart.install = app => {
  app.component('y-shopcart', yShopcart);
};

export default yShopcart;