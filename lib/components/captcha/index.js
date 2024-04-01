import yCaptcha from './captcha.vue';

yCaptcha.install = app => {
  app.component('y-captcha', yCaptcha);
};

export default yCaptcha;