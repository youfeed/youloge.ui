import yTextarea from './textarea.vue';

yTextarea.install = app => {
  app.component('y-textarea', yTextarea);
};

export default yTextarea;