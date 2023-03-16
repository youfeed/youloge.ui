import { createApp } from 'vue'
import yLoading from './loading.vue'

const useLoading = function(cfg={}){
  const config = Object.assign({ text:'loading',duration:8000 },cfg);
  const Fragment = document.createDocumentFragment('div');
  const renderApp = ()=>createApp(yLoading, config);
  const App = renderApp(),Vm = App.mount(Fragment);document.body.appendChild(Vm.$el);
  const show = ()=>{
    Vm.toggle()
    setTimeout(() => { hide(); }, config.duration);
  }
  const hide = ()=>{
    Vm.toggle();
    App.unmount()
  }
  return {show,hide}
}

export default {name:'useLoading',use:useLoading}