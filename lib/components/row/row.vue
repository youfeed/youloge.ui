<template>
  <div class="y-row" :style="style"><slot></slot></div>
</template>
<script>
import { computed, provide } from 'vue'
export default { name:'yRow' }
</script>
<script setup>
const props = defineProps({
  gutter:{
    type:[Number,String],
    default:0
  }
})
const style = computed(()=>{
  return [
    {
      'margin-left':props.gutter>0?`-${props.gutter / 2}px`:false,
      'margin-right':props.gutter?`-${props.gutter / 2}px`:false,
    }
  ]
})
provide('useGutter',props.gutter)
</script>
<style>
.y-row{
  width:100%;
  height:auto;
  box-sizing: border-box;
  overflow: hidden;
}
</style>