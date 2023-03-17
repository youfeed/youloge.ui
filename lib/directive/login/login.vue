<template>
  <transition>
    <div class="y-login" v-show="show">
      <iframe :src="target+'/sso.html'+hash" ref="iframe"></iframe>
    </div>
  </transition>
</template>

<script>
export default { name:'yLogin' }
</script>
<script setup>
import { onMounted, reactive, toRefs } from 'vue'
const props = defineProps({ ukey:String,close:Boolean,onCallback:Function })
const state = reactive({
  hash:`#${Math.random().toString(32)}`,
  target:'https://open.youloge.com',
  // target:'http://127.0.0.1:5173',
  name:'youloge.sso',
  iframe:'',
  show:false,
})

onMounted(()=>{
  const {ukey,close} = props,{iframe,target,hash,name} = state
  window.onmessage = ({origin,data,source})=>{
    let {method,params} = data[hash];
    console.log('login.vue',origin,data,method,params)
    if(origin == target && method){
      let work = {
        'ready':()=>(state.show = true,source.postMessage({[hash]:{method:'init',params:{ukey:ukey,name:name,close:close}}},target)),
        'success':()=>{
          localStorage.setItem('youloge',JSON.stringify(params));
          props.onCallback(method);
        }
      };
      work[method] ? work[method]() : props.onCallback(method)
    }
  }
});
const {target,hash,show,iframe} = toRefs(state)
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