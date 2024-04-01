/**
 * Ukey
 * 支付成功 解密signature 提取singer 发送给VIP接口 确认发货
 * 虚拟订单：24小时内 - 发货后 - 买家48小时自动确认收货
 * 商城订单：72小时内 - 发货后 - 买家21天后自动确认收货
 * 逾期订单：订单金额原路返回(不发货)
 */
import yPayment from './payment.vue';
yPayment.install = app => {
  app.component('y-payment', yPayment);
};
export default yPayment;