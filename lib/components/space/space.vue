<template>
  <div :class="classed">
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps,computed } from 'vue';
const props = defineProps({
  align:{
    type:String,
    default:'center',
    validator: (value) => ['start', 'end', 'center', 'baseline'].includes(value),
  },
  direction:{
    type: String,
    default: 'row',
    validator: (value) => ['row', 'col'].includes(value)
  },
  size:{
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  wrap:Boolean
});
console.log(props.wrap,55555555555555);
// 状态类
const sizeMap = {
  'sm': 'gap-2',
  'md': 'gap-4',
  'lg': 'gap-6'
}
const classed = computed(()=>({
    'flex':true,
    [`items-${props.align}`]:true,
    [`flex-${props.direction}`]:true,
    [sizeMap[props.size]]: true,
    'flex-wrap': props.wrap,
}));
</script>

<style>

</style>