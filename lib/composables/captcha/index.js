import useCaptcha from './captcha.js'
useCaptcha.install = app =>{
  app.provide('useCaptcha',useCaptcha);
  app.config.globalProperties.useCaptcha = useCaptcha;
}
export default useCaptcha;