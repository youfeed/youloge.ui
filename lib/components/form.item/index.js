/**
 * 表单项组件
 */
import yFormItem from './item.vue'

yFormItem.install = app => {
  app.component('y-form-item', yFormItem)
}

export default yFormItem
export { yFormItem }

