<template>
  <div class="y-discuss">
    <iframe ref="ref" :src="src"></iframe>
  </div>
</template>
<script>
export default {name:'yDiscuss'}
</script>
<script setup>
import { onMounted, reactive, toRefs } from 'vue'
const props = defineProps({ uuid:String })
const state = reactive({ ref:null,src:null })
onMounted(()=>{
  state.src = `https://open.youloge.com/discuss`
})
const {ref,src} = toRefs(state)
</script>
<style lang="scss">
</style>