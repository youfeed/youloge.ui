import { createApp } from 'vue'
import yLogin from '../../components/login/login.vue'
export default function useLogin(cfg={}){
  let config = Object.assign({ text:'loading',duration:8000 },cfg),App = null;
  return new Promise((resolve, reject)=>{
    const Fragment = document.createElement('TP');// createDocumentFragment createElement
    Fragment.title = config.text;
    config.onCall = (method,params)=>{
      let action = {
        'error':()=>{
          reject(params);App.unmount();
        },
        'success':()=>{
          resolve();App.unmount();
        }
      }
      action[method] ? action[method]() : console.log('onCall-error',params)
      console.log('onCall-hello2333',method,params)
    };
    App = createApp(yLogin, config);
    document.body.appendChild(App.mount(Fragment).$el);
    // let $el = App.mount(Fragment).$el
    // console.log(333,$el)
    // const show = ()=>{
    //   Vm.toggle()
    //   setTimeout(() => { hide(); }, config.duration);
    // }
    // const hide = ()=>{
    //   Vm.toggle();
    //   App.unmount()
    // }
    // return {show,hide}
  
    
  })
}