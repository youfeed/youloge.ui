import usePayment from './payment.js'

export default {
  install(app){
    app.config.globalProperties.$payment = usePayment
  }
}