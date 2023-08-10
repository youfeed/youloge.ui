import { createApp } from 'vue'
import yPassword from './password.vue'

const yPassword = function(cfg={}){
  const config = Object.assign({ rand:'XXX',autocomplete:false },cfg);
  const Fragment = document.createDocumentFragment('div');
  const renderApp = ()=>createApp(yLoading, config);
  const App = renderApp(),Vm = App.mount(Fragment);document.body.appendChild(Vm.$el);

  const show = ()=>{
    Vm.toggle()
    setTimeout(() => { hide(); }, config.autocomplete);
  }
  const hide = ()=>{
    Vm.toggle();
    App.unmount()
  }
  return {show,hide}
}

export default {name:'usePassword',use:yPassword}