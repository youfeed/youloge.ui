import yMessage from './message.vue'
import {createApp} from 'vue'
let App =null, Vm = null;
const useMessage = (cfg={})=>{
  let config = Object.assign({duration:30000,timer:null},cfg);
  document.querySelector('.y-message-container')
  if(App == null){
    const Fragment = document.createDocumentFragment('div');
    App = createApp(yMessage, config),Vm = App.mount(Fragment);
    document.body.appendChild(Vm.$el);
    Vm.$el.className = 'y-message-container'
    console.log('Fragment',Vm.$el)
  }
  // 
  // 'success' | 'error' | 'warning' | 'info' | 'loading';
  const success = (content='')=>{
    //{uuid:uuid,name:`222 - ${uuid}`,type:'success',duration:3000,content:'hello'}
    config.content = content;
    config.type = 'success';
    Vm.onPush(config);
    console.log('success')
    console.log('config',config)
  }
  const error = () =>{

  }
  return {success,error}
}

export default {name:'useMessage',use:useMessage};