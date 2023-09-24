import yLogin from './login.vue';

yLogin.install = app => {
  app.component('y-login', yLogin);
};

export default yLogin;