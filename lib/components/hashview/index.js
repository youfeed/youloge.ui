import HashView from './hashview.vue';

HashView.install = app => {
  app.component('hash-view', HashView);
};

export default HashView;