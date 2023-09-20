import yPayment from './payment.vue'
import {createApp} from 'vue'

export default function usePayment(cfg={}){
  let {ukey} = JSON.parse(sessionStorage.getItem('youloge')),config = {...{ukey:ukey,close:true,local:'',money:''},...cfg},App =null;

  const onCreate = (props)=>{
    App = createApp(yPayment, props)
    const Vm = App.mount(document.createDocumentFragment('div'));
    document.body.appendChild(Vm.$el);
  }
  const onDestroy = ()=>{
    App.unmount()
  }
  const onReturn = (props)=>{
    return new Promise((resolve, reject) => {
      props.onCallback = (method,params)=>{
        onDestroy();method == 'success' ? resolve(params) : reject(params);
      };onCreate(props)
    })
  }
  const pay = (deploy)=>{
    return onReturn({...config,...deploy,...{method:'pay'}})
  }
  return {pay}
}