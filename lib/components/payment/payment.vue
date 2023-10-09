<template>
  <div class="y-payment w-full h-full" :class="props.fullscreen ? 'fixed top-0 left-0 z-99999' : 'rounded hover:border-blue hover:border-1'" >
    <iframe v-if="src" ref="ref" :src="src" w-full h-full backdrop-blur-lg></iframe>
  </div>
</template>

<script setup>
import {getHashtag,useConfig} from '../../utils'
import { onMounted, reactive, toRefs } from "vue";
defineOptions({ name: 'y-payment',inheritAttrs:false });
const hash = getHashtag(),{ukey,OPENURL} = useConfig(),state = reactive({ref:null,src:`${OPENURL}/payment${hash}`});
const props = defineProps(['uuid','mail','money','close','local','notify','fullscreen','onCall','data']),emit = defineEmits(['success','error','progress']);
const confog = {...{ukey:ukey,mail:props.mail,money:props.money,close:props.close,local:props.local,notify:props.notify},...(props?.data || {})};
onMounted(()=>{
  // state.src = `http://localhost:5174/payment.html${hash}`
  window.addEventListener('message',({origin,source,data})=>{
    let {method,params} = data[hash] || {};
    if(state.src.startsWith(origin) && method){
      let action = {
        'ready':()=>{
          source.postMessage({[hash]:{method:'init',params:confog}},origin);
        },
        'success':()=>{postMessage('success',params)},
        'error':()=>{postMessage('error',params)},
      };
      action[method] ? action[method]() : (postMessage('progress',params));
    }
  })
});
const postMessage = (method,params)=>{
  emit(method,params) || props.onCall && props.onCall(method,params);
};
const {ref,src} = toRefs(state);
</script>
<style lang="scss">

</style>