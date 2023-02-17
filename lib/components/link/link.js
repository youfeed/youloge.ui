import yLink from './link.vue';

yLink.install = app => {
  app.component(yLink.name, yLink);
};

export default yLink;