import yForm from './form.vue';

yForm.install = app => {
  app.component(yForm.name, yForm);
};

export default yForm;