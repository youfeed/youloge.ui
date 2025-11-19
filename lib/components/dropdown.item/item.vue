<template>
  <div
    class="flex items-center w-full px-4 py-2 text-sm transition-colors duration-150 cursor-pointer"
    :class="itemClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    <!-- 图标插槽（预留扩展，如 GitHub 图标） -->
    <slot name="icon"></slot>
    <!-- 文本插槽 -->
    <slot class="ml-2"></slot>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 自定义文本颜色
  textColor: {
    type: String,
    default: 'text-gray-900 dark:text-gray-100'
  },
  // 自定义 hover 背景色
  hoverBgColor: {
    type: String,
    default: 'hover:bg-gray-100 dark:hover:bg-gray-700'
  }
})

// 注入父组件上下文
const { disabled: dropdownDisabled } = inject('dropdownContext', { disabled: false })

// 菜单项样式
const itemClasses = computed(() => {
  const disabledClass = props.disabled || dropdownDisabled
    ? 'opacity-50 cursor-not-allowed hover:bg-transparent'
    : props.hoverBgColor
  return [
    props.textColor,
    disabledClass
  ].join(' ')
})

// 点击事件（禁用时不触发）
const emit = defineEmits(['click'])
const handleClick = () => {
  if (props.disabled || dropdownDisabled) return
  emit('click')
  // 点击后关闭菜单（可通过 props 控制是否关闭，默认关闭）
  const { isOpen } = inject('dropdownContext', { isOpen: ref(false) })
  isOpen.value = false
}
</script>