import rLink from './link.vue';

rLink.install = app => {
  app.component(rLink.name, rLink);
};

export default rLink;