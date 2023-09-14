import yMessage from './message.vue'
import {createApp} from 'vue'
let Vm = null;
const useMessage = (method,params={},duration=3000)=>{
  if(Vm == null){
    Vm = createApp(yMessage).mount(document.createDocumentFragment());
    Vm.$el.className = 'y-message-container'
    document.body.appendChild(Vm.$el);
  }
  Vm.onPush(method,params,duration);
}

export default {name:'useMessage',use:useMessage};