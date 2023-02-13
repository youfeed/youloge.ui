<template>
  <a :href="props.to" @click.stop.prevent="onJump"><slot></slot></a>
</template>

<script>
import { inject } from 'vue'
export default { name:'rLink' }
</script>
<script setup>
const props = defineProps({
  to:String
})
// const { options } = inject('route')
const onJump = ()=>{
  history.pushState({}, '', props.to)
  // options.key = props.to
  console.log('onJump',props.to)
}
</script>
<style> 

</style>