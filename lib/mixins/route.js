import {createApp} from 'vue'
import HashView from "./hashview.vue";
export const setupRoute = (ROUTES,Vm=null)=>{
  if(Vm == null){
    Vm = createApp(HashView).mount(document.createDocumentFragment());
    document.body.appendChild(Vm.$el);
    Vm.onRoute(ROUTES);
  }
}
