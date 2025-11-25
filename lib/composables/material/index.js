import useMaterial from './material.js'
useMaterial.install = app =>{
  app.provide('useMaterial',useMaterial)
  app.config.globalProperties.useMaterial = useMaterial;
}
export default useMaterial;