import { createApp,inject  } from 'vue'
import yLogin from '@lib/components/login/login.vue'
import {setStorage} from '@lib/utils';
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
          setStorage(params);resolve(params);App.unmount();trueElment.remove();
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