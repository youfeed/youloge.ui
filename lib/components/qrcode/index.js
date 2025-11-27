/**
 * 二维码组件
 * 
 */
import yQrcode from './qrcode.vue';
yQrcode.install = app => {
    app.component('y-qrcode', yQrcode);
};
export default yQrcode;