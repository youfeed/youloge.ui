import {createApp} from 'vue'
import yDialog from './dialog.vue'
const useDialog = (method,params={},shadeClose=true)=>{
  return ['alert','confirm','prompt','password'].includes(method) ? new Promise((resolve, reject) => {
    let App = null;let onCallback = ({emit,data})=>(App.unmount(),['success'].includes(emit) ? resolve(data) : reject(data));
    App = createApp(yDialog, {method,params,shadeClose,onCallback});
    const Vm = App.mount(document.createDocumentFragment());
    document.body.appendChild(Vm.$el);
  }) : console.error('useDialog 方法错误');
}
export default {name:'useDialog',use:useDialog}