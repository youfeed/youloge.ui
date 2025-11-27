import useQrcode from './qrcode.js'
useQrcode.install = app =>{
  app.provide('useQrcode',useQrcode);
  app.config.globalProperties.useQrcode = useQrcode;
}
export default useQrcode;