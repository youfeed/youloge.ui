<template>
  <form :class="cls"><slot></slot></form>
</template>

<script>
export default { name:'yForm' }
</script>
<script setup>
import { computed, provide, reactive, ref, toRefs } from 'vue'
const props = defineProps({
  // model:Object,
  position:String,
  label:String,
  size:String,
})
const cls = computed(()=>{
  let kind = ['y-form']

  return kind
})
const onReset = ()=>{
  console.log('onReset')
}
// provide('useFrom',ref(onReset))
// provide('useFrom',reactive(toRefs(...props)))
// defineExpose(onReset)
</script>
<style>

</style>