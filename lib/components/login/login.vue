<template>
  <div class="y-login" :class="props.fullscreen ? 'w-full h-full fixed top-0 left-0 z-99999' :  'my-4 rounded shadow-2xl w-4xl hover:border-blue hover:border-1'">
    <iframe v-if="src" ref="ref" :src="src" w-full h-full backdrop-blur-lg></iframe>
  </div>
</template>

<script>
export default { name:'yLogin'}
import {getHashtag,useConfig} from '@lib/utils'
import { onMounted, reactive, toRefs,inject } from "vue";
</script>
<script setup>
defineOptions({ name: 'y-login',inheritAttrs:false });
const hash = getHashtag(),{UKEY,OPENURL} = useConfig(),state = reactive({ref:null,src:`${OPENURL}/login${hash}`});
const props = defineProps(['uuid','mail','money','close','fullscreen','onCall','data']),emit = defineEmits(['success','error','progress']);
const config = {...{ukey:UKEY,mail:props.mail,close:props.close},...(props?.data || {})};
onMounted(()=>{
  
  onMessage('progress',{'msg':'onMounted'});
  window.addEventListener('message',({origin,source,data})=>{
    let {method,params} = data[hash] || {};
    if(state.src.startsWith(origin) && method){
      let work = {
        'ready':()=>{
          source.postMessage({[hash]:{method:'init',params:config}},origin);
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