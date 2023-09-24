import yVideo from './video.vue';

yVideo.install = app => {
  app.component('y-video', yVideo);
};

export default yVideo;