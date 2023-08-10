<template>
  <transition>
    <div class="y-plus" v-show="show">
      <iframe :src="'https://open.youloge.com/'+props.path+props.hash" :style="props?.style"></iframe>
    </div>
  </transition>
</template>
<script>
export default { name:'yPlus',inheritAttrs:false}
</script>
<script setup>
import { onMounted, reactive,toRefs } from 'vue'
const props = defineProps({ hash:String,path:String,style:String })
console.log('props',props)
const state = reactive({
  show:false
})
onMounted(()=>{
  state.show = true;
})
const {show} = toRefs(state)
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
  background: #00000021;
  backdrop-filter: blur(10px);
  pointer-events: unset;
  iframe{
    outline: 0;
    width: 360px;
    height: 350px;
    border-radius: 5px;
    border: 0;
    margin-top: -20%;
  }
}
</style>