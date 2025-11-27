<template>
  <div
    class="tab-base"
    :class="tabClasses"
    :style="tabStyle"
    :data-name="name"
    :data-disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script setup>
import { defineProps, computed, inject, onMounted, onUnmounted } from 'vue'

defineOptions({ name: 'y-tab' })

// 注入父组件上下文（确保父组件路径正确，建议 y-tab 放在 tabs 文件夹下，与 y-tabs 同级）
const tabsContext = inject('yTabsContext', null)
if (!tabsContext) {
  throw new Error('[y-tab] 必须嵌套在 <y-tabs> 组件中使用')
}

// Props 定义
const props = defineProps({
  name: { type: [String, Number], required: true },
  disabled: { type: Boolean, default: false }
})

// 基础样式类
const baseClasses = [
  'inline-flex',
  'items-center',
  'justify-center',
  'h-10',
  'box-border',
  'cursor-pointer',
  'transition-all',
  'duration-200',
  'ease-in-out',
  'text-sm',
  'font-normal',
  'text-gray-600',
  'border-b-2',
  'border-transparent'
]

// 计算样式类（简化逻辑，避免复杂嵌套）
const tabClasses = computed(() => {
  const classes = [...baseClasses]
  
  // 激活状态
  if (tabsContext.activeKey.value === props.name) {
    classes.push('font-medium')
  }
  
  // 禁用状态
  if (props.disabled) {
    classes.push('text-gray-400', 'cursor-not-allowed')
  }
  
  // 标签类型样式
  if (tabsContext.type === 'line') {
    classes.push('-mb-px')
  }
  
  if (tabsContext.type === 'card') {
    classes.push('border-r', 'border-gray-200')
    // 第一个标签添加左边框
    if (props.name === tabsContext.tabKeys.value[0]) {
      classes.push('border-l', 'border-gray-200')
    }
  }
  
  return classes
})

// 计算内联动态样式（保持动态性）
const tabStyle = computed(() => {
  const isActive = tabsContext.activeKey.value === props.name
  const style = { padding: `0 ${tabsContext.tabPadding}` }

  // 下划线式激活样式
  if (tabsContext.type === 'line' && isActive) {
    style.color = tabsContext.activeTextColor
    style.borderBottomColor = tabsContext.activeBorderColor.value
  }

  // 卡片式激活样式
  if (tabsContext.type === 'card' && isActive) {
    style.color = tabsContext.activeTextColor
    style.backgroundColor = '#ffffff'
    style.borderBottomColor = '#ffffff'
  }

  return style
})

// 点击事件
const handleClick = () => {
  if (props.disabled) return
  tabsContext.changeTab(props.name)
}

// 注册/注销标签
onMounted(() => {
  tabsContext.registerTab(props.name, props.disabled)
})

onUnmounted(() => {
  tabsContext.unregisterTab(props.name)
})
</script>

<style scoped>
/* 下划线式标签 - 非禁用/非激活 hover 态 */
.tab-base:not(.text-gray-400):not(.font-medium):hover {
  color: #0969da;
  border-bottom-color: rgba(9, 105, 218, 0.3);
}

/* 卡片式标签 - 非禁用/非激活 hover 态 */
.tab-base.border-r:not(.text-gray-400):not(.font-medium):hover {
  color: #0969da;
  background-color: #f3f4f6;
}
</style>