<template>
  <div class="w-full transition-all duration-200" :class="menuClasses">
    <slot></slot> <!-- 嵌套 GhDropdownItem / GhDropdownDivider -->
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 自定义菜单宽度（默认 160px，贴合 GitHub 下拉菜单宽度）
  width: {
    type: String,
    default: '160px'
  },
  // 背景色（默认继承主容器，支持自定义）
  bgColor: {
    type: String,
    default: 'bg-white dark:bg-gray-800'
  }
})

const menuClasses = computed(() => {
  return [
    props.bgColor,
    'rounded-md overflow-hidden' // 溢出隐藏，配合圆角
  ]
})

// 自定义宽度
const menuStyle = computed(() => {
  return { width: props.width }
})
</script>