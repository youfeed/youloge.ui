<template>
  <main 
    class="flex-1 overflow-auto transition-all duration-200"
    :class="contentClasses"
    :style="customStyle"
  >
    <slot></slot>
  </main>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 内边距（默认 24px，GitHub 内容区留白风格）
  padding: {
    type: String,
    default: '24px',
    validator: val => val.endsWith('px') || val.endsWith('rem')
  },
  // 最大宽度（避免内容过宽，默认 1200px 居中）
  maxWidth: {
    type: String,
    default: '1200px'
  },
  // 是否居中
  centered: {
    type: Boolean,
    default: true
  }
})

const contentClasses = computed(() => {
  const paddingValue = props.padding.replace(/[a-z]+/, '')
  return [
    `p-${paddingValue}`,
    props.centered ? 'mx-auto' : '' // 居中对齐
  ].join(' ')
})

const customStyle = computed(() => {
  return {
    maxWidth: props.maxWidth
  }
})
</script>