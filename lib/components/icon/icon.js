import yIcon from './icon.vue';

yIcon.install = app => {
  app.component(yIcon.name, yIcon);
};

export default yIcon;