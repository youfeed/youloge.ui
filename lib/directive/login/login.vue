<template>
  <transition>
    <div class="y-login" v-show="show">
      <iframe :src="src" ref="iframe"></iframe>
    </div>
  </transition>
</template>

<script>
export default { name:'yLogin' }
</script>
<script setup>
import { computed, onMounted, reactive, toRefs } from 'vue'
import Youloge from '../..';
const props = defineProps({ onClose:Function,onSuccess:Function })
const state = reactive({
  src:'//sso.youloge.com',
  iframe:'',
  show:false
})
onMounted(()=>{
  const {ak} = JSON.parse(sessionStorage.getItem('youloge'));state.show = true;
  const {src,iframe} = state;
  iframe.onload = ()=>iframe.contentWindow.postMessage({ak:ak,name:'youloge.sso'}, "*");

  window.addEventListener('message',event=>{
    let {origin,data} = event,{emit} = data;
    if(origin.includes(src)){
      emit === 'success' ? [
        props.onSuccess(data),
        localStorage.setItem('profile',JSON.stringify(data.data)),
        Object.entries(data.data).forEach(([key,val])=>{
          localStorage.setItem(key,val)
        })
      ] : props.onClose(data);
    }
  });
});

const {iframe,show,src} = toRefs(state)
</script>
<style lang="scss">
.y-login{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 999999999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0c0c0c6e;
  iframe{
    outline: 0;
    background: #fff;
    width: 360px;
    height: 350px;
    border-radius: 5px;
    border: 0;
  }
}
</style>