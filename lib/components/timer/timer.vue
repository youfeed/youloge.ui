<template>
  <div>
    <slot
    :total="total"
    :days="days" :hours="hours" :minutes="minutes" 
    :seconds="seconds" :milliseconds="milliseconds"></slot>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, toRefs,watch } from 'vue';
const props = defineProps({
  deadline: {
    type: [Number,String,Date],
    required: true
  },
  current:{
    type: [Number,String,Date],
    default: Date.now() / 1000 >> 0
  },
  interval: {
    type: Number,
    default: 200
  },
  offset: {
    type: Number,
    default: 1
  }
}),emits = defineEmits(['finish']);
// 数据
const state = reactive({
    timer: null,offset:props.offset,
    total:10,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds:0,
}),{total,days,hours,minutes,seconds,milliseconds} = toRefs(state);
// 目标时间 毫秒
const targeTime = computed(()=>{
  let {deadline} = props;
  const currenTime = Number(deadline) ? new Date(Number(deadline) * 1000) : new Date(deadline.replace(/-/g, '/'));
  return currenTime.getTime(); 
});
// 时间方差 毫秒
const marginTime = computed(()=>{
    let {current} = props;
    const currenTime = Number(current) ? new Date(Number(current) * 1000) : new Date(current.replace(/-/g, '/'));
    return Date.now() - currenTime.getTime();
});
// 开始循环
const tickTime = ()=>{
  state.timer = setTimeout(()=>{
      state.total > 0 && tickTime();
    },props.interval);
}
onMounted(()=>{
    tickTime();
});

watch(() => state.timer, () => {
    let diff = targeTime.value + marginTime.value - Date.now();
    state.days = Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)),0).toString().padStart(2, '0');
    state.hours = Math.max(Math.floor(diff / 1000 / 3600),0).toString().padStart(2, '0');
    state.minutes = Math.max(Math.floor(diff / 1000 / 60),0).toString().padStart(2, '0');
    state.seconds = Math.max(Math.floor(diff / 1000 % 60),0).toString().padStart(2, '0');
    state.milliseconds = Math.max((diff % 1000),0).toString().padStart(3, '0');
    state.total = Math.floor(diff / 1000);
    if(state.offset && state.total - props.offset <= 0){
        state.offset = 0;emits('finish'); 
    }
    if(state.total <= 0){
        state.total = 0;
        state.milliseconds = '000'
        clearInterval(state.timer);
    }
});
</script>

<style>

</style>