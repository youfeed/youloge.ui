import { createApp,watchEffect } from 'vue'
import yLogin from './login.vue'

const obj = {
  show:false,
  text:'加载中...',
  target:'body',
  textColor:'#fff'
}
const $login = createApp(yLogin,{obj}).mount(typeof document !== 'undefined'?typeof document.createElement !== 'undefined'?document.createElement('div'):'':'')
const Login = {
  name:'useLogin',
  show(data){
    obj.show = true
    watchEffect(()=>{
      
    })
    setTimeout(()=>{
      obj.show = false
    },3000)
    document.body.appendChild($login.$el)
  },
  hide(){
    obj.show = false
  }
}
export default Login