import plus from '../../functions/plus/plus'
const vLogin = {
  name:'login',
  mounted(el, binding, vnode, prevVnode){
    let {arg,value} = binding,app = null,instance = null;
    el.addEventListener(arg||'click',(e)=>{
      let {signature,expire} = JSON.parse(localStorage.getItem('youloge')||"{}");
      let timed = new Date().getTime() / 1000 >> 0;
      console.log(signature,timed,expire);
      (signature == null || timed > expire) 
      ? 
      plus.use().sso({close:true}).then(res=>(localStorage.setItem('youloge',JSON.stringify(res)),value())).catch(e=>console.log(e))
      :
      value();
    })
  }
}
export default vLogin;