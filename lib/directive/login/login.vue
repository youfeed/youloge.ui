<template>
  <transition>
    <div class="y-login" v-show="show">
      <iframe :src="src+'/sso'+hash" ref="iframe"></iframe>
    </div>
  </transition>
</template>

<script>
export default { name:'yLogin' }
</script>
<script setup>
import { computed, onMounted, reactive, toRefs } from 'vue'
const props = defineProps({ onCallback:Function })
const state = reactive({
  hash:`#${Math.random().toString(32)}`,
  src:'https://open.youloge.com',
  name:'youloge.sso',
  iframe:'',
  show:false,
})
onMounted(()=>{
  state.show = true;
  const {ukey} = JSON.parse(sessionStorage.getItem('youloge'));
  state.iframe.onload = ()=>state.iframe.contentWindow.postMessage({ukey:ukey,name:state.name,hash:state.hash,close:true}, state.src);

  window.onmessage = (event)=>{
    let {origin,data} = event,{emit,name,hash} = data;
    console.log('login',event)
    if(origin == state.src && hash==state.hash && name == state.name){
      props.onCallback(emit);
      emit == 'success' && localStorage.setItem('youloge',JSON.stringify(data.data));
    }
  }
});
const {src,hash,show,iframe} = toRefs(state)
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
  background: #0c0c0c8f;
  
  iframe{
    outline: 0;
    background: #fff;
    width: 350px;
    height: 380px;
    border-radius: 5px;
    border: 0;
    margin-top: -30vh;
  }
}
</style>