<template>
  <div :class="
  props.onCall ? 
    'w-full h-full fixed top-0 left-0 z-99999' 
    : 
    'my-4 rounded shadow-2xl w-4xl hover:border-blue hover:border-1'" 
    class="y-login">
    <iframe v-if="src" ref="ref" :src="src" w-full h-full backdrop-blur-lg></iframe>
  </div>
</template>

<script>
export default { name:'yLogin'}
import {getHashtag,getConfig} from '../../utils'
import { onMounted, reactive, toRefs } from "vue";
</script>
<script setup>
const ukey = getConfig('ukey'),IFRAME  = getConfig('IFRAME'),hash = getHashtag(),emit = defineEmits(['success','error','progress']);
const props = defineProps({ uuid:String,close:Boolean,onCall:Function }),state = reactive({ref:null,src:null});
onMounted(()=>{
  onMessage('progress',{'msg':'onMounted',ukey,IFRAME});
  state.src = `${IFRAME}/login${hash}`;
  window.addEventListener('message',({origin,source,data})=>{
    let {method,params} = data[hash] || {};
    console.log('origin',data[hash],data);
    if(origin==IFRAME && method){
      let work = {
        'ready':()=>{
          onMessage('progress',params);
          source.postMessage({[state.hash]:{method:'ready',params:{ukey:ukey,close:props.close}}},IFRAME);
          onMessage('progress',{msg:'配置初始化'});
        },
        'success':()=>{onMessage('success',params)},
        'error':()=>{onMessage('error',params)},
      };
      work[method] ? work[method]() : (onMessage('progress',params));
    }
  });
})
// 兼容回调
const onMessage = (method,params)=>{
  emit(method,params) || props.onCall && props.onCall(method,params);
}
const {ref,src} = toRefs(state);
</script>
<style lang="scss">

</style>