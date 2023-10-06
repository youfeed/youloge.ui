import yPayment from '../../components/payment/payment.vue'
import {createApp} from 'vue'
export default function usePayment(config={},App = null){
  return new Promise((resolve, reject) => {
    let trueElment = document.querySelector(config?.selector);
    if(trueElment == null){
      config.fullscreen = true;
      trueElment = document.createElement('payment');
      trueElment.title = "usePayment";
      document.body.appendChild(trueElment)
    }
    config.onCall = (method,params)=>{
      let action = {
        'success':()=>{
          resolve(params);App.unmount();trueElment.remove();
        },
        'error':()=>{
          reject(params);App.unmount();trueElment.remove();
        },
      }
      action[method] ? action[method]() : console.log('onCall',params)
    };
    App = createApp(yPayment, config);App.mount(trueElment);
  })
}