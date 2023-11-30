<template>
   <div class="y-goods w-full h-full" :class="props.fullscreen ? 'fixed top-0 left-0 z-999999' : 'rounded hover:border-blue hover:border-1'" >
    <iframe v-if="src" ref="ref" :src="src" w-full h-full backdrop-blur-sm></iframe>
  </div>
</template>
<script setup>
defineOptions({ name: 'y-shopcart',inheritAttrs:false });
import {getHashtag,useConfig} from '../../utils'
import { onMounted, reactive, toRefs,markRaw } from "vue";
const hash = getHashtag(),{UKEY,OPENURL} = useConfig(),state = reactive({ref:null,src:`${OPENURL}/shopcart${hash}`});
const props = defineProps(['uuid','mail','close','fullscreen','onCall','data']),emit = defineEmits(['success','error','progress']);
const config = {...{uuid:props.uuid,mail:props.mail,close:props.close,fullscreen:props.fullscreen},...{ukey:UKEY},...(props?.data || {})};
// {uuid:props.uuid,mail:props.mail,close:props.close,fullscreen:props.fullscreen}
onMounted(()=>{
  // state.src = `http://localhost:5175/shopcart.html${hash}`
  window.addEventListener('message',({origin,source,data})=>{
    let {method,params} = data[hash] || {};
    if(state.src.startsWith(origin) && method){
      let action = {
        'ready':()=>{
          source.postMessage({[hash]:{method:'init',params:config}},origin);
        },
        'success':()=>{postMessage('success',params)},
        'error':()=>{postMessage('error',params)},
      };
      action[method] ? action[method]() : (postMessage('progress',params));
    }
  })
})
const postMessage = (method,params)=>{
  emit(method,params) || props.onCall && props.onCall(method,params);
};
const {ref,src} = toRefs(state)
</script>

<style>

</style>