import yMessage from './message.vue'
import {createApp} from 'vue'
let App =null, Vm = null;
const useMessage = (cfg={})=>{
  let config = Object.assign({duration:3000},cfg);
  if(App == null){
    App = createApp(yMessage, config),Vm = App.mount(document.createDocumentFragment());
    Vm.$el.className = 'y-message-container'
    document.body.appendChild(Vm.$el);
    console.log(Vm)
  }
  const onRender = (type,text)=>{
    console.log('onRender')
    Vm.onPush(Object.assign(config,{type:type,text:text}));
  }
  const success = (text='')=>onRender('success',text)
  const error = (text='')=>onRender('error',text)
  const warning = (text='')=>onRender('warning',text)
  const info = (text='')=>onRender('info',text)
  return {success,error,warning,info}
}

export default {name:'useMessage',use:useMessage};