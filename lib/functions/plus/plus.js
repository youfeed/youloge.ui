import yPlus from './plus.vue'
import {createApp} from 'vue'
let EventBus = {};
const onCreate = (config={})=>{
  let hash = `#${Math.random().toString(32).substring(2)}`,URL = `https://open.youloge.com`;
  config.hash = hash;
  // 动态加载
  let App = createApp(yPlus, config)
  const Vm = App.mount(document.createDocumentFragment('div'));
  document.body.appendChild(Vm.$el);
  // 统一监听
  EventBus[hash] = {resolve:null,reject:null,event:null};
  
  const onMessage = ({origin,data,source})=>{
    let [keys] = Object.keys(data),{method,params} = data[keys] || {};
    let {resolve,reject,event} = EventBus[keys];
    if(method && URL.startsWith(origin) && keys === hash){
      let work = {
        'ready':()=>source.postMessage({[keys]:{method:'init',params:config}},origin),
        'success':()=>{onDispose();resolve && resolve.call(this,params)},
        'error':()=>{onDispose();reject && reject.call(this,params)},
        'close':()=>{onDispose();reject && reject.call(this,params)}
      };
      work[method] ? work[method]() : (event && event.call(this,params));
    }
  }
  const onDispose = ()=>{
    App.unmount();delete EventBus[hash];
    window.removeEventListener('message',onMessage);
  }
  window.addEventListener('message',onMessage)
  console.log(hash,EventBus)
  // 异步回调
  const promise = new Promise((resolve, reject) => (EventBus[hash].resolve = resolve,EventBus[hash].reject = reject));
  promise.prototype.x = 2333;
  promise.listener = event => {
    EventBus[hash].event = event
    return promise; 
  };
  return promise;
}
export default {name:'usePlus',use:function(cfg={}){
  let {ukey} = JSON.parse(sessionStorage.getItem('youloge'));
  const sso = (deploy)=>onCreate({...deploy,...{path:'sso',ukey:ukey},...cfg})
  const payment = (deploy)=>onCreate({...deploy,...{path:'payment',ukey:ukey},...cfg})
  return {sso,payment}
}};