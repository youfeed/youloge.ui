<template>
  <div class="y-ad" hover:border-coolGray>
    <iframe ref="ref" src="https://open.youloge.com/ad#2333" border-none></iframe>
  </div>
</template>

<script>
export default { name:'yAd'}
</script>
<script setup>
import { defineProps, reactive, onMounted,toRefs } from 'vue'
const props = defineProps({
  type: {
    type: String,
    default: ''
  }
})
const state = reactive({
  ref:null
})
onMounted(() => {

})
const {ref} = toRefs(state);
</script>
<style>

</style>