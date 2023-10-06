import { createApp,inject  } from 'vue'
import yLogin from '../../components/login/login.vue'
export default function useLogin(config={},App=null){
  return new Promise((resolve, reject)=>{
    let trueElment = document.querySelector(config?.selector);
    if(trueElment == null){
      config.fullscreen = true;
      trueElment = document.createElement('login');
      trueElment.title = "useLogin";
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
    App = createApp(yLogin, config);App.mount(trueElment);
  })
}