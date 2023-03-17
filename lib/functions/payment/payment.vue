<template>
  <transition>
    <div class="y-payment" v-show="show">
      <iframe :src="target+'/payment'+hash" ref="iframe"></iframe>
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
  target:'https://open.youloge.com',
  name:'youloge.payment',
  iframe:null,
  show:false
})
onMounted(()=>{
  const {ukey,close,local,money} = props;
  const {hash,target,name} = state;
  window.onmessage = ({origin,data,source})=>{
    let {method,params} = data[hash];
    console.log('login.vue',origin,data,method,params)
    if(origin == target && method){
      let work = {
        'ready':()=>(state.show = true,source.postMessage({[hash]:{method:'init',params:{ukey:ukey,name:name,close:close,local:local,money:money}}},target)),
      };
      work[method] ? work[method]() : props.onCallback(method,params)
    }
  };
})
const {target,hash,show,iframe} = toRefs(state)
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