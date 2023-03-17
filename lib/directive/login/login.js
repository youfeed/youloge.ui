import { createApp } from 'vue';
import yLogin from './login.vue';

const vLogin = {
  name:'login',
  mounted(el, binding, vnode, prevVnode){
    let {arg,value} = binding,app = null,instance = null;
    el.addEventListener(arg||'click',(e)=>{
      let {signer,expire} = JSON.parse(localStorage.getItem('youloge')||"{}");
      let timed = new Date().getTime() / 1000 >> 0;
      if(signer == null || timed > expire){
        const {ukey} = JSON.parse(sessionStorage.getItem('youloge'||'{}'));
        const Fragment = document.createDocumentFragment('div')
        const onCallback = (emit)=>{
          instance = null;app?.unmount();
          emit == 'success' ? value() : '';
        }
        app = createApp(yLogin,{close:true,ukey:ukey,onCallback})
        instance = app.mount(Fragment)
        document.body.appendChild(Fragment)
      }else{
        value()
      }
    })
  }
}
export default {name:'login',use:vLogin}