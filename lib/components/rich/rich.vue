<template>
  <div class="y-rich">
    <iframe ref="ref" :src="src"></iframe>
  </div>
</template>
<script>
export default {name:'yRich'}
</script>
<script setup>
import { computed, onMounted, reactive, toRefs } from 'vue';
const emit = defineEmits(['onEscape'])
const props = defineProps({
  uuid:String,
  onEscape:Function 
})
const state = reactive({ref:null,src:null})
onMounted(()=>{
  state.src = `https://open.youloge.com/rich`
  emit('onEscape',state);
})
const {ref,src} = toRefs(state)
</script>
<style lang="scss">
</style>