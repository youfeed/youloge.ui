import yVideo from './video.vue';

yVideo.install = app => {
  app.component(yVideo.name, yVideo);
};

export default yVideo;