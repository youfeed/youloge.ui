<template>
  <transition>
    <div class="y-payment" v-show="show">
      <iframe :src="src+'/payment'+hash" ref="iframe"></iframe>
    </div>
  </transition>
</template>
<script>
export default { name:'yPayment',inheritAttrs:false}
</script>
<script setup>
import { onMounted, reactive,toRefs } from 'vue'
const props = defineProps({ ukey:String,local:String,money:Number,close:Boolean,onCallback:Function })
console.log('props',props)
const state = reactive({
  hash:`#${Math.random().toString(32)}`,
  src:'https://open.youloge.com',
  name:'youloge.payment',
  iframe:null,
  show:false
})
onMounted(()=>{
  const {ukey,close,local,money} = props;state.show = true;
  state.iframe.onload = ()=>state.iframe.contentWindow.postMessage({ukey:ukey,name:state.name,hash:state.hash,close:close,local:local,money:money}, state.src);
  window.onmessage = event=>{
    let {origin,data} = event,{emit,name,hash} = data;
    if(origin == state.src && hash == state.hash && name == state.name){
      props.onCallback({emit:emit,data:data.data})
    }
  }
})
const {src,hash,show,iframe} = toRefs(state)
</script>
<style lang="scss">
.y-payment{
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
    margin-top: -20vh;
  }
}
</style>