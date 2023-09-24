import usePlus from './plus.js'
usePlus.install = app =>{
  app.provide('usePlus',usePlus)
}
export default usePlus;