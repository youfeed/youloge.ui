<template>
  <div 
    class="flex flex-col w-full h-full min-h-[100vh]"
    :class="layoutClasses"
  >
    <slot></slot> <!-- 嵌套 Header/Sidebar/Content/Footer -->
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 布局方向：垂直（默认，Header-Content-Footer 上下排列）、水平（Sidebar-Content 左右排列）
  direction: {
    type: String,
    default: 'vertical',
    validator: val => ['vertical', 'horizontal'].includes(val)
  },
  // 全局内边距（统一控制各区域内边距，贴合 GitHub 紧凑风格）
  padding: {
    type: [String,Number],
    default: '0',
    validator: val => val >= 0 && val <= 120
  },
  // 背景色（默认白色，贴合 GitHub 页面背景）
  bgColor: {
    type: String,
    default: 'bg-white dark:bg-gray-900'
  }
})

// 动态样式：整合方向、背景色
const layoutClasses = computed(() => {
  return [
    props.bgColor,
    props.direction === 'horizontal' ? 'flex-row' : 'flex-col',
    `p-${props.padding}` // 适配 Unocss 内边距原子类
  ].join(' ')
})
</script>