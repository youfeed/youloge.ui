import { createApp,reactive,watchEffect } from 'vue'
import yLoading from './loading.vue'

const obj = {
  show:true,
  text:'加载中...2',
  target:'body',
  textColor:'#fff'
}
const renderApp = ()=>{
  console.log(4,obj)
  return createApp(yLoading, {obj});
}
const useLoading = {
  pool:[],
  name:'useLoading',
  init:{},
  show(data){
    const $div = document.createDocumentFragment('div'),$app = renderApp(),$mod = $app.mount($div)
    console.log(1,$div)
    console.log(2,$app)
    console.log(3,$mod)
    watchEffect(()=>{
      
    })
    
    setTimeout(() => {
      $mod.toggle()
      // obj.show = false
      // $app.unmount()
    }, 3000);
    document.body.appendChild($mod.$el)
  },
  hide(){
    obj.show = false
  }
}

export default useLoading