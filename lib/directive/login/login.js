import { createApp } from 'vue';
import yLogin from './login.vue';

const vLogin = {
  name:'login',
  mounted(el, binding, vnode, prevVnode){
    let {arg,value} = binding,app = null,instance = null;
    el.addEventListener(arg||'click',(e)=>{
      let token = localStorage.getItem('token')
      let expire = localStorage.getItem('expire')
      let times = new Date().getTime() / 1000 >> 0;
      if(token == null || times > expire){
        const Fragment = document.createDocumentFragment('div')
        const onClose = ()=>{
          instance = null
          app?.unmount()
        }
        const onSuccess = ()=>{
          value()
        }
        app = createApp(yLogin,{onClose,onSuccess})
        instance = app.mount(Fragment)
        document.body.appendChild(Fragment)
      }else{
        value()
      }
    })
  },
}
export default vLogin