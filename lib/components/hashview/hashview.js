import hashView from './hashview.vue';

hashView.install = app => {
  app.component(hashView.name, hashView);
};

export default hashView;