import hashView from './hashview.vue';
hashView.install = app => {
  app.component('hash-view', hashView);
};
export default hashView;