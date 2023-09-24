import usePayment from './payment.js'
usePayment.install = app =>{
  app.provide('usePayment',usePayment)
}
export default usePayment;