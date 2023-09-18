<template>
  <div class="container">hello{{ msg }}</div>
</template>

<script>
export default { name:'hello',icon:'icon'}
</script>
<script setup>
import { onMounted, reactive, toRefs } from 'vue'
const state = reactive({
    msg:'265165'
})
onMounted(() => {
    state.msg = Math.random().toString(16).slice(2)
})
const {msg} = toRefs(state)
</script>
<style>

</style>