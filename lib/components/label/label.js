import yLabel from './label.vue'
yLabel.install = app=>{
  app.component(yLabel.name, yLabel);
}
export default yLabel