import rView from './view.vue';

rView.install = app => {
  app.component(rView.name, rView);
};

export default rView;