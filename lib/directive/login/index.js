import useLogin from '../../functions/login/login'
const vLogin = {
  name:'login',
  mounted(el, binding, vnode, prevVnode){
    let {arg,value} = binding,app = null,instance = null;
    el.addEventListener(arg||'click',(e)=>{
      try {
        var youloge = JSON.parse(localStorage.getItem('youloge'));
      } catch (error) {
        var youloge = {};
      }
      let {signature,expire} = youloge;
      let timed = new Date().getTime() / 1000 >> 0;
      (signature == null || timed > expire) 
      ? 
      useLogin({close:true}).then(res=>(localStorage.setItem('youloge',JSON.stringify(res)),value())).catch(e=>console.log(e))
      :
      value();
    })
  }
}
export default vLogin;