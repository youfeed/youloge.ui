<template>
  <transition>
    <div class="y-payment" v-show="show">
      <iframe src="http://127.0.0.1:5174/payment.html" ref="iframe"></iframe>
    </div>
  </transition>
</template>
<script>
export default { name:'yPayment',inheritAttrs:false}
</script>
<script setup>
import { onMounted, reactive,toRefs } from 'vue'
const props = defineProps({ ak:String,order:Object,close:Boolean,onCallback:Function })
console.log('props',props)
const state = reactive({
  src:'//open.youloge.com',iframe:null,show:false
})
onMounted(()=>{
  const {ak,close,order} = props,{src,iframe} = state;state.show = true;
  iframe.onload = ()=>iframe.contentWindow.postMessage({ak:ak,name:'youloge.payment',close:close,order:order}, "*");
  window.addEventListener('message',event=>{
    let {origin,data} = event,{emit} = data;
    console.log(event);
    // origin.includes(src) && 
    props.onCallback({emit:emit,data:data.data})
  });
})
const {iframe,show,src} = toRefs(state)
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