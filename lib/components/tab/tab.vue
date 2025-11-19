<template>
  <div
    class="flex items-center px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-200"
    :class="tabClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot> <!-- 标签文本/图标 -->
  </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted } from 'vue'

// Props 定义
const props = defineProps({
  // 标签唯一标识（需与 GhTabPane 的 name 一致）
  name: {
    type: [String, Number],
    required: true
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 自定义标签颜色（覆盖全局 activeColor）
  color: {
    type: String,
    default: ''
  }
})

// 注入主组件上下文
const { activeKey, changeTab, type, activeColor, borderColor } = inject('tabsContext')

// 计算标签样式（激活态 + 禁用态 + 类型样式）
const tabClasses = computed(() => {
  const isActive = activeKey.value === props.name
  const currentActiveColor = props.color || activeColor

  // 基础样式：下划线式 vs 卡片式
  const baseStyle = type === 'line' 
    ? `border-b-2 ${isActive ? currentActiveColor : 'border-transparent'}` 
    : `border-r border-t ${borderColor} ${isActive ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}`

  // 激活态样式：文字颜色 + 边框颜色（卡片式）
  const activeStyle = isActive 
    ? `${currentActiveColor} ${type === 'card' ? `border-t-2 border-l-2 ${borderColor} -mb-px` : ''}` 
    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'

  // 禁用态样式
  const disabledStyle = props.disabled 
    ? 'opacity-50 cursor-not-allowed hover:text-inherit' 
    : ''

  return `${baseStyle} ${activeStyle} ${disabledStyle}`
})

// 点击标签切换（禁用时不触发）
const handleClick = () => {
  if (props.disabled) return
  changeTab(props.name)
}

// 挂载时将标签 name 加入主组件的 tabNames 数组
onMounted(() => {
  // 从主组件上下文反向获取 tabNames（需主组件暴露）
  const tabsInstance = inject('tabsInstance')
  if (tabsInstance && !props.disabled) {
    tabsInstance.tabNames.push(props.name)
  }
})

// 卸载时移除 name
onUnmounted(() => {
  const tabsInstance = inject('tabsInstance')
  if (tabsInstance) {
    tabsInstance.tabNames = tabsInstance.tabNames.filter(name => name !== props.name)
  }
})

// 向主组件暴露自身实例（用于 tabNames 管理）
inject('tabsInstance', {}).currentTab = { name: props.name, disabled: props.disabled }
</script>