import useShopcart from './shopcart.js'
useShopcart.install = app =>{
  app.provide('useShopcart',useShopcart)
}
export default useShopcart;