<template>
    <span>
        <slot
        :total="total"
        :days="days"
        :hours="hours"
        :minutes="minutes"
        :seconds="seconds"
        :milliseconds="milliseconds"
        ></slot>
    </span>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, toRefs, watch } from "vue";
const props = defineProps({
    deadline: {
      type: [Number,Date],
      required: true,
    },
    current: {
      type: [Number,Date],
      default: Date.now(),
    },
    interval: {
      type: Number,
      default: 123,
    },
    offset: {
      type: Number,
      default: 1,
    },
  }),
  emits = defineEmits(["finish"]);
// 数据
const state = reactive({
    timer: null,trigger:false,
    offset: 1,
    total: 10,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  }),
  { total, days, hours, minutes, seconds, milliseconds } = toRefs(state);
// 目标时间 毫秒
const targeTime = computed(() => {
  let { deadline } = props;
  const currenTime = new Date(deadline) || new Date(deadline.replace(/-/g, "/"));
  return currenTime.getTime();
});
// 时间方差 毫秒
const marginTime = computed(() => {
  let { current } = props;
  const currenTime = new Date(current) || new Date(current.replace(/-/g, "/"));
  return Date.now() - currenTime.getTime();
});
// 开始循环
const tickTime = () => {
  if (state.timer) {
    clearInterval(state.timer);
  }
  state.timer = setInterval(() => {
    let diff = targeTime.value + marginTime.value - Date.now();
    state.days = Math.max(Math.floor(diff / (1000 * 3600 * 24)), 0)
      .toString()
      .padStart(2, "0");
    state.hours = Math.max(Math.floor(diff / 1000 / 3600), 0)
      .toString()
      .padStart(2, "0");
    state.minutes = Math.max(Math.floor(diff / 1000 / 60), 0)
      .toString()
      .padStart(2, "0");
    state.seconds = Math.max(Math.floor((diff / 1000) % 60), 0)
      .toString()
      .padStart(2, "0");
    state.milliseconds = Math.max(diff % 1000, 0)
      .toString()
      .padStart(3, "0");
    state.total = Math.floor(diff / 1000);
    if (state.waiting && state.total - props.offset <= 0) {
      state.waiting = false;
      emits("finish");
    }
    if (state.total <= 0) {
      state.total = 0;
      state.milliseconds = "000";
      clearInterval(state.timer);
    }
  }, props.interval);
};
onUnmounted(() => {
  state.timer && clearInterval(state.timer);
});
// 监听属性变化
watch(
  () => props,
  (newVal, oldVal) => {
    state.waiting = true; // 重置触发器
    tickTime();
  },
  { deep: true, immediate: true }
);
</script>

<style></style>
