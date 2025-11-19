<template>
  <header 
    class="flex items-center transition-all duration-200 border-b"
    :class="headerClasses"
    :style="customStyle"
  >
    <slot></slot>
  </header>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 高度（默认 56px，贴合 GitHub 导航栏高度）
  height: {
    type: String,
    default: '56px'
  },
  // 边框颜色（默认浅灰，GitHub 风格分割线）
  borderColor: {
    type: String,
    default: 'border-gray-200 dark:border-gray-800'
  },
  // 内边距（默认水平 16px）
  padding: {
    type: String,
    default: '16px',
    validator: val => val.endsWith('px') || val.endsWith('rem')
  }
})

const headerClasses = computed(() => {
  const paddingValue = props.padding.replace(/[a-z]+/, '')
  return [
    props.borderColor,
    `px-${paddingValue}` // 水平内边距
  ].join(' ')
})

const customStyle = computed(() => {
  return {
    height: props.height,
    minHeight: props.height // 确保高度不塌陷
  }
})
</script>