<template>
  <div 
    class="transition-all duration-200"
    :class="colClasses"
    :style="customStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 占比（1-12 列，对应 Unocss grid-cols-12 体系）
  span: {
    type: [Number,String],
    default: 12,
    validator: val => val >= 1 && val <= 12
  },
  // 偏移量（左侧留白列数）
  offset: {
    type: [Number,String],
    default: 0,
    validator: val => val >= 0 && val <= 11
  },
  // 响应式占比（sm: 640px+，md: 768px+，lg: 1024px+）
  spanSm: {
    type: [Number,String,undefined],
    default: undefined,
    validator: val => val === undefined || (val >= 1 && val <= 12)
  },
  spanMd: {
    type: [Number,String,undefined],
    default: undefined,
    validator: val => val === undefined || (val >= 1 && val <= 12)
  },
  spanLg: {
    type: [Number,String,undefined],
    default: undefined,
    validator: val => val === undefined || (val >= 1 && val <= 12)
  }
})

// 动态组合 Unocss 原子类（适配 grid 布局）
const colClasses = computed(() => {
  const base = [
    `col-span-${props.span}`, // 基础占比
    props.offset > 0 ? `col-start-${props.offset + 1}` : '' // 偏移（col-start 从 1 开始）
  ]

  // 响应式占比（Unocss 媒体查询前缀）
  if (props.spanSm) base.push(`sm:col-span-${props.spanSm}`)
  if (props.spanMd) base.push(`md:col-span-${props.spanMd}`)
  if (props.spanLg) base.push(`lg:col-span-${props.spanLg}`)

  return base.filter(Boolean).join(' ')
})

const customStyle = computed(() => ({}))
</script>