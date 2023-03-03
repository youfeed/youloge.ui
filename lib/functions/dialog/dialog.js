import yDialog from './dialog.vue'
import {createApp} from 'vue'
const useDialog = (cfg={})=>{
  let config = Object.assign({title:'提示',content:''},cfg);let App = null;
  
  const onCreate = (params)=>{
    App = createApp(yDialog, params)
    const Vm = App.mount(document.createDocumentFragment());
    document.body.appendChild(Vm.$el);
    // Vm.onShow();
  }
  const onDestroy = ()=>{
    App.unmount()
  }

  // 消息提示
  const alert = (deploy)=>{
    const params = Object.assign({method:'alert'},deploy,config);
    return onReturn(params)
  }
  // 消息确认
  const confirm = (deploy)=>{
    const params = Object.assign({method:'confirm'},deploy,config);
    return onReturn(params)
  }
  // 提交内容
  const prompt = (deploy)=>{
    const params = Object.assign({method:'prompt',type:'text',placeholder:'请输入...'},deploy,config);
    return onReturn(params)
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
  return {alert,confirm,prompt};
}

export default {name:'useDialog',use:useDialog}