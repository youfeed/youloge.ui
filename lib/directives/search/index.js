import ySearch from '../../components/search'
import {createApp} from 'vue'
const vSearch = {
  name:'search',
  mounted(el, binding, vnode, prevVnode){
    let {arg,value} = binding,App = null,instance = null,config={};
    el.addEventListener(arg||'click',(e)=>{
      let trueElment = document.createElement('search');
      trueElment.title = "vSearch";
      document.body.appendChild(trueElment)
      config.onClose = ()=>{
        App.unmount();trueElment.remove();
      };
      config.onCall = (item)=>{
        value(item);App.unmount();trueElment.remove()
      };
      App = createApp(ySearch, config);App.mount(trueElment);
    })
  }
}
export default vSearch;