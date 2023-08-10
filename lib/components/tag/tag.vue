<template>
  <div :class="cls" :style="sty" @click="onClick">
    <span><slot></slot></span>
    <span v-if="closable" @click.stop="onClose">x</span>
  </div>
</template>
<script>
import { computed } from 'vue'
export default { name:'yTag' }
</script>
<script setup>
const props = defineProps({
  // round theme check color closable change checked
  type:String,
  color:String,
  size:String,
  close:Boolean,
  label:{ type:String,default:''},
  data: { type: Array,default: () => []},
})
const {type,size,color} = props
const cls = computed(()=>{
  return ['y-tag',type && `y-tag-${type}`,size && `y-tag-${size}`]
})
const sty = computed(()=>{
  return [
    {
      'color':!color || color,
      // 'margin-right':! gutter || `-${gutter / 2}px`,
    }
  ]
})
const emit = defineEmits(['click','close']) 
const onClose = (e)=>{
  emit('close',e)
}
const onClick = (e)=>{
  emit('click',e)
}
// !!gutter && provide('useGutter',props.gutter);
</script>
<style>

</style>