import useLogin from '@lib/functions/login/login'
import { useAuth } from "@lib/utils";
const vLogin = {
  name:'login',
  mounted(el, binding, vnode, prevVnode){
    let {arg,value} = binding,app = null,instance = null;
    el.addEventListener(arg||'click',(e)=>{
      useAuth()
      ? 
      value()
      :
      useLogin({close:true}).then(res=>(value())).catch(e=>console.log(e))
    })
  }
}
export default vLogin;