import { createApp } from 'vue'
import yLoading from './loading.vue'
export default function useLoading(config={}){
  const Fragment = document.createElement('div');
  const renderApp = ()=>createApp(yLoading, config);
  const App = renderApp(),Vm = App.mount(Fragment);document.body.appendChild(Vm.$el);
  const show = ()=>{
    Vm.toggle();
    setTimeout(() => { hide(); }, config.duration);
  }
  const hide = ()=>{
    Vm.toggle();
    App.unmount();
  }
  return {show,hide}
}