import usePlus from './plus.js'
usePlus.install = app =>{
  app.provide('usePlus',usePlus);
  app.config.globalProperties.usePlus = usePlus;
}
export default usePlus;