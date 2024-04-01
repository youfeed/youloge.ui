<template>
  <div class="y-rich" v-html="content">
  </div>
</template>
<script setup>
defineOptions({ name: 'y-rich',inheritAttrs:false });
import { computed, onMounted, reactive, toRefs } from 'vue';
import {apiFetch,vipFetch,useStorage} from "@lib/utils";
const emit = defineEmits(['onEscape'])
const props = defineProps({ uuid:String })
const state = reactive({
  ref:null,
  metadata:{},
  content:[]
})
onMounted(()=>{
  // 提取文章元数据
  apiFetch('article/info',{uuid:props.uuid}).then(({err,msg,data})=>{
    err == 200 ? (state.metadata = res.data,onContent()) : console.log(msg)
  })
})
// 提取文章富文本
const onContent = ()=>{
  fetch(`https://cdn.youloge.com/${props.uuid}?9`).then(r=>r.text()).then(content=>{
    console.log(content)
    state.content=content
  })
}
const {ref,src,metadata,content} = toRefs(state)
</script>
<style lang="scss">
.y-rich{
  padding: 10px;
  max-width: 680px; 
  margin: 0 auto;
  .title{
    margin: 0 0 1.3rem;
    font-size: 1.667rem;
    font-weight: 600;
    line-height: 1.31;
    color: #222
  }
  p{
    line-height: inherit;
    margin: 22px 0;
    letter-spacing: 2px;
    font-size: 14px;
    word-spacing: 2px;
  }
  a{
    color: #4dd0e1;
    border-bottom: 1px solid #4dd0e1;
    font-weight: 400;
    text-decoration: none;
    margin: 0 4px;
  }
  pre{
    box-shadow: 1px 2px 4px 2px #dfdfdf;
    padding: 10px;
  }
  iframe{
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
}
</style>