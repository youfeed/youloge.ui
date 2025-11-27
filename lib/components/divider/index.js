/**
 * 分割线组件
 * 
 */
import yDivider from './divider.vue'

yDivider.install = app => {
  app.component('y-divider', yDivider)
}

export default yDivider
export { yDivider }
