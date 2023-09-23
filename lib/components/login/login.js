import yLogin from './login.vue';

yLogin.install = app => {
  app.component(yLogin.name, yLogin);
};

export default yLogin;