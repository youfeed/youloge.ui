<template>
  <div>我的云盘</div>
  <div>{{ time }}</div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue';

const state = reactive({
  time:'0'
}),{time} = toRefs(state);

onMounted(()=>{
  state.time = Date.now()
})
</script>

<style>

</style>