<template>
    <div class="container">wallte/index{{ msg }}</div>
    <a href="#hello">点击加载 HashView#hello</a>
</template>

<script>
export default {name:'hello',icon:'icon'}
</script>
<script setup>
import { onMounted, reactive, toRefs } from 'vue'
const state = reactive({
    msg:''
})
onMounted(() => {
    state.msgmsg = '32325'
})
const {msg} = toRefs(state)
</script>
<style>

</style>