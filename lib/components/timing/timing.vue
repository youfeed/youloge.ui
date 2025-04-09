<template>
  <div>
    <slot :days="days" :hours="hours" :minutes="minutes" :seconds="seconds"></slot>
  </div>
</template>

<script setup>

import { onMounted,defineProps,defineEmits, reactive, toRefs } from 'vue';
const props = defineProps({
  time: {
    type: [Number,String],
    default: 100
  }
}),emits = defineEmits(['click']);
const state = reactive({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    diff:100
}),{days,hours,minutes,seconds} = toRefs(state);
// let timer = setTimeout(()=>{
//     state.diff = props.time - now;
//     let D = new Date(state.diff * 1000).toISOString().substr(11, 8).split(':');
//     state.days = D[0];
// },1000);

onMounted(()=>{
    let now = new Date().getTime() / 1000;
    let D = new Date().toISOString().substring(11, 8).split(':');
    state.days = D[0];
    console.log('timing mounted',D)
});

// return {
//   props,emits
// }
</script>

<style>

</style>