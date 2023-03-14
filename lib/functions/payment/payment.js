import yPayment from './payment.vue'
import {createApp} from 'vue'
const usePayment = (cfg={})=>{
  let {ukey} = JSON.parse(sessionStorage.getItem('youloge')),config = Object.assign({ ukey:ukey,close:true,local:'',money:'' },cfg),App =null;

  const onCreate = (params)=>{
    App = createApp(yPayment, params)
    const Vm = App.mount(document.createDocumentFragment('div'));
    document.body.appendChild(Vm.$el);
  }
  const onDestroy = ()=>{
    App.unmount()
  }
  const onReturn = (params)=>{
    return new Promise((resolve, reject) => {
      params.onCallback = ({emit,data})=>{
        onDestroy();
        ['close','cancel'].includes(emit) ? reject(data) : resolve(data);
      }
      onCreate(params)
    })
  }
  const pay = (deploy)=>{
    const params = Object.assign({method:'pay'},config,deploy);
    return onReturn(params)
  }
  return {pay}
}

export default {name:'usePayment',use:usePayment};