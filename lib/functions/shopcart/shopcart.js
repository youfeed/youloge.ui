import yShopcart from '../../components/shopcart/shopcart.vue'
import {createApp} from 'vue'
export default function useShopcart(config={},App = null){
  return new Promise((resolve, reject) => {
    let trueElment = document.querySelector(config?.selector);
    if(trueElment == null){
      config.fullscreen = true;
      trueElment = document.createElement('shopcart');
      trueElment.title = "useShopcart";
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
    App = createApp(yShopcart, config);App.mount(trueElment);
  })
}