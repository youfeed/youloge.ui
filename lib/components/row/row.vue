<template>
  <div :class="cls" :style="sty"><slot></slot></div>
</template>
<script>
import { computed, provide } from 'vue'
export default { name:'yRow' }
</script>
<script setup>
const props = defineProps({
  gutter:{ type:String,default:'0'},
  justify:String
})
const {gutter,justify} = props
const cls = computed(()=>{
  return ['y-row',justify && `y-row-${justify}`]
})
const sty = computed(()=>{
  return [
    {
      // 'margin-left':! gutter || `-${gutter / 2}px`,
      // 'margin-right':! gutter || `-${gutter / 2}px`,
    }
  ]
})
!!gutter && provide('useGutter',props.gutter);
</script>
<style>

</style>