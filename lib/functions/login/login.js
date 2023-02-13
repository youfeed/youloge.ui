import { createApp,watchEffect } from 'vue'
import yLogin from './login.vue'

const obj = {
  show:false,
  text:'加载中...',
  target:'body',
  textColor:'#fff'
}
const $login = createApp(yLogin, {obj}).mount(typeof document !== 'undefined'?typeof document.createElement !== 'undefined'?document.createElement('div'):'':'')
const Login = {
  name:'login',
  show(data){
    obj.show = true
    watchEffect(()=>{
      
    })
    document.body.appendChild($login.$el)
  },
  hide(){
    obj.show = true
  }
}
export default Login