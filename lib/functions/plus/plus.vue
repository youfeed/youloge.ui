<template>
  <transition>
    <div class="y-plus" v-show="show">
      <iframe :src="'https://open.youloge.com/payment'+hash" ref="iframe"></iframe>
    </div>
  </transition>
</template>
<script>
export default { name:'yPlus',inheritAttrs:false}
</script>
<script setup>
import { onMounted, reactive,toRefs } from 'vue'
const props = defineProps({ ukey:String,hash:String,local:String,money:Number,close:Boolean,onCallback:Function })
console.log('props',props)
const state = reactive({
  name:'youloge.plus',
  hash:`#${Math.random().toString(32)}`,
  target:'https://open.youloge.com',
  iframe:null,
  show:false
})
onMounted(()=>{
  state.show = true;
  const {ukey,close,local,money} = props;
  const {hash,target,name} = state;
  // window.onmessage = ({origin,data,source})=>{
  //   let {method,params} = data[hash];
  //   console.log('login.vue',origin,data,method,params)
  //   if(origin == target && method){
  //     let work = {
  //       'ready':()=>(state.show = true,source.postMessage({[hash]:{method:'init',params:{ukey:ukey,name:name,close:close,local:local,money:money}}},target)),
  //     };
  //     work[method] ? work[method]() : props.onCallback(method,params)
  //   }
  // };
})
const {target,hash,show,iframe} = toRefs(state)
</script>
<style lang="scss">
.y-plus{
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
  background: #00000073;
  backdrop-filter: blur(10px);
  iframe{
    outline: 0;
    width: 360px;
    height: 350px;
    border-radius: 5px;
    border: 0;
    margin-top: -20vh;
  }
}
</style>