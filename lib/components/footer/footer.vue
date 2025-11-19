<template>
  <footer 
    class="flex items-center justify-center transition-all duration-200 border-t text-sm"
    :class="footerClasses"
    :style="customStyle"
  >
    <slot></slot>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 高度（默认 48px）
  height: {
    type: String,
    default: '48px'
  },
  // 边框颜色
  borderColor: {
    type: String,
    default: 'border-gray-200 dark:border-gray-800'
  },
  // 文本颜色（默认灰色，GitHub 底部文本风格）
  textColor: {
    type: String,
    default: 'text-gray-500 dark:text-gray-400'
  },
  // 内边距
  padding: {
    type: String,
    default: '16px',
    validator: val => val.endsWith('px') || val.endsWith('rem')
  }
})

const footerClasses = computed(() => {
  const paddingValue = props.padding.replace(/[a-z]+/, '')
  return [
    props.borderColor,
    props.textColor,
    `px-${paddingValue}`
  ].join(' ')
})

const customStyle = computed(() => {
  return {
    height: props.height,
    minHeight: props.height
  }
})
</script>