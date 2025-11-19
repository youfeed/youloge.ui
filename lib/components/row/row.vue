<template>
  <div 
    class="flex flex-wrap transition-all duration-200"
    :class="rowClasses"
    :style="customStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 间距（默认 4px，贴合 GitHub 紧凑布局）
  gap: {
    type: String,
    default: '4px',
    validator: val => val.endsWith('px') || val.endsWith('rem')
  },
  // 水平对齐（对应 Unocss justify-*）
  justify: {
    type: String,
    default: 'start',
    validator: val => ['start', 'center', 'end', 'between', 'around'].includes(val)
  },
  // 垂直对齐（对应 Unocss items-*）
  align: {
    type: String,
    default: 'center',
    validator: val => ['start', 'center', 'end', 'stretch'].includes(val)
  },
  // 是否禁用换行（默认允许换行）
  noWrap: {
    type: Boolean,
    default: false
  }
})

// 动态组合 Unocss 原子类
const rowClasses = computed(() => {
  return [
    `gap-${props.gap.replace(/[a-z]+/, '')}`, // 间距（如 "8px" → "gap-8"）
    `justify-${props.justify}`,
    `items-${props.align}`,
    props.noWrap ? 'flex-nowrap' : 'flex-wrap'
  ].join(' ')
})

// 自定义样式（兼容特殊场景，如动态间距）
const customStyle = computed(() => {
  return {}
})
</script>