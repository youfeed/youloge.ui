import { createApp,reactive,watchEffect } from 'vue'
import yLoading from './loading.vue'

const obj = reactive({
  show:true,
  text:'加载中...',
  target:'body',
  textColor:'#fff'
})

const useLoading = {
  name:'useLoading',
  init:{},
  show(data){
    const $app = createApp(yLoading, {obj});
    const $loading = $app.mount(document.createElement('div'))
    watchEffect(()=>{
      
    })
    setTimeout(() => {
      obj.show = false
      $app.unmount()
    }, 3000);
    document.body.appendChild($loading.$el)
  },
  hide(){
    obj.show = false
  }
}

export default useLoading