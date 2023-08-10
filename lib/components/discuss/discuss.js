import yDiscuss from './discuss.vue'
yDiscuss.install = app=>{
  app.component(yDiscuss.name, yDiscuss);
}
export default yDiscuss