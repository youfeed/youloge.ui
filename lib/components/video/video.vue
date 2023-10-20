<template>
  <div class="y-video">
    <iframe ref="ref" :src="src" allowfullscreen></iframe>
  </div>
</template>
<script setup>
defineOptions({ name: 'y-video',inheritAttrs:false });
import {getHashtag,useConfig} from '../../utils'
import { onMounted, reactive, toRefs } from "vue";
const hash = getHashtag(),{ukey,OPENURL} = useConfig(),state = reactive({ref:null,src:`${OPENURL}/video${hash}`});
const emit = defineEmits(['success','error','progress']);
const props = defineProps({ poster:String,uuid:String,dash:String,m3u8:String,flv:String,mp4:String });
const confog = {...{ukey:ukey,poster:props.poster,uuid:props.uuid,dash:props.dash,m3u8:props.m3u8,flv:props.flv,mp4:props.mp4},...(props?.data || {})};
onMounted(()=>{
  // state.src = `http://localhost:5173/video.html${hash}`
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
})
const postMessage = (method,params)=>{
  emit(method,params) || props.onCall && props.onCall(method,params);
};
const {ref,src} = toRefs(state)
</script>
<style lang="scss">
.y-video{
  // height: 0;
  // width: 100%; 
  // position: relative;
  // padding-top: 56.2%;
  aspect-ratio: 16 / 9;
  background: #333;
  border-radius: 10px;
  iframe{
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
}

</style>