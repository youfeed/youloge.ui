<template>
  <a :href="props.to" :class="cls" @click.stop.prevent="onJump"><slot></slot></a>

</template>

<script>
export default { name:'yLink' }
</script>
<script setup>
import { computed } from 'vue'
const props = defineProps({
  type:String,
  underline:Boolean,
  disabled:Boolean,
  href:String,
  icon:String
})
const cls = computed(()=>{
  let kind = ['y-link'];
  ['type','underline','disabled'].forEach(is=>{
    props[is] && kind.push(`y-link-${props[is]}`)
  })
  return kind;
})
const onJump = ()=>{
  history.pushState({}, '', props.to)
  // options.key = props.to
  console.log('onJump',props.to)
}
</script>
<style> 

</style>