import useCaptcha from './captcha.js'
useCaptcha.install = app =>{
  app.provide('useCaptcha',useCaptcha)
}
export default useCaptcha;