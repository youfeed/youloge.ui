<template>
  <form :class="cls"><slot></slot></form>
</template>

<script>
export default { name:'yForm' }
</script>
<script setup>
import { provide, reactive, toRefs } from 'vue'
const props = defineProps({
  model:Object,
  position:String,
  label:String,
  size:String,
})
const onReset = ()=>{
  console.log('onReset')
}
provide('useFrom',reactive(...toRefs(props)))
defineExpose(onReset)
</script>
<style>

</style>