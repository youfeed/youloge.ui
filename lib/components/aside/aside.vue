<template>
  <aside 
    class="transition-all duration-300 border-r overflow-hidden"
    :class="sidebarClasses"
    :style="customStyle"
  >
    <slot></slot>
  </aside>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 宽度（默认 240px，折叠后 64px）
  width: {
    type: String,
    default: '240px'
  },
  collapseWidth: {
    type: String,
    default: '64px'
  },
  // 是否折叠
  collapsed: {
    type: Boolean,
    default: false
  },
  // 边框颜色
  borderColor: {
    type: String,
    default: 'border-gray-200 dark:border-gray-800'
  },
  // 内边距
  padding: {
    type: String,
    default: '16px',
    validator: val => val.endsWith('px') || val.endsWith('rem')
  },
  // 是否固定（滚动时不跟随）
  fixed: {
    type: Boolean,
    default: false
  }
})

const sidebarClasses = computed(() => {
  const paddingValue = props.padding.replace(/[a-z]+/, '')
  return [
    props.borderColor,
    `p-${paddingValue}`,
    props.fixed ? 'fixed h-full z-10' : 'h-full' // 固定模式占满高度
  ].join(' ')
})

const customStyle = computed(() => {
  return {
    width: props.collapsed ? props.collapseWidth : props.width,
    flexShrink: 0 // 避免侧边栏被压缩
  }
})
</script>