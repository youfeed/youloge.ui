import yTag from './tag.vue'
yTag.install = app=>{
  app.component(yTag.name, yTag);
}
export default yTag