import { createApp,reactive,watchEffect } from 'vue'
import yLoading from './loading.vue'

const useLoading = function(cfg){
  const config = reactive({
    show:false,
    text:'loading',
    duration:8000,
    textColor:'#fff'
  })
  const Fragment = document.createDocumentFragment('div');
  const renderApp = ()=>createApp(yLoading, config);
  const App = renderApp(),Vm = App.mount(Fragment);document.body.appendChild(Vm.$el);
  const show = ()=>{
    Vm.toggle()
    setTimeout(() => {
      Vm.toggle()
      // obj.show = false
      App.unmount()
    }, 3000);
  }
  const hide = ()=>{
    config.show = false
  }
  return {show,hide}
}

export default {name:'useLoading',use:useLoading}