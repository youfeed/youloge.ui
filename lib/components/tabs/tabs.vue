<template>
  <div class="w-full transition-all duration-200" :class="tabsClasses">
    <!-- 标签容器 -->
    <div class="flex border-b" :class="tabListClasses">
      <slot name="tab"></slot> <!-- 嵌套 GhTab 标签 -->
    </div>
    <!-- 内容容器（过渡动画） -->
    <div class="mt-4">
      <transition-group name="y-tab-fade" mode="out-in" tag="div">
        <slot :key="activeKey"></slot> <!-- 嵌套 GhTabPane 内容 -->
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, computed, watch } from 'vue'

// Props 定义
const props = defineProps({
  // 默认激活的标签 name（未指定则激活第一个非禁用标签）
  defaultActive: {
    type: [String, Number],
    default: ''
  },
  // 标签对齐方式：left（默认）/ center / right
  align: {
    type: String,
    default: 'left',
    validator: val => ['left', 'center', 'right'].includes(val)
  },
  // 是否启用卡片式样式（默认下划线式，贴合 GitHub 原生）
  type: {
    type: String,
    default: 'line',
    validator: val => ['line', 'card'].includes(val)
  },
  // 卡片式样式的边框颜色（仅 type="card" 生效）
  borderColor: {
    type: String,
    default: 'border-gray-200 dark:border-gray-700'
  },
  // 激活态颜色（下划线/卡片边框颜色）
  activeColor: {
    type: String,
    default: 'text-blue-600 dark:text-blue-400'
  }
})

// 暴露事件：标签切换时触发
const emit = defineEmits(['tab-change'])

// 激活状态管理（优先使用 defaultActive，无则后续自动激活第一个）
const activeKey = ref(props.defaultActive)
// 存储所有标签的 name（用于自动激活第一个）
const tabNames = ref([])

// 计算标签容器样式（对齐方式 + 卡片式样式）
const tabListClasses = computed(() => {
  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }[props.align]

  const cardClass = props.type === 'card' 
    ? `rounded-t-md overflow-hidden ${props.borderColor}` 
    : ''

  return `${alignClass} ${cardClass}`
})

// 计算整体样式（卡片式时添加顶部边框）
const tabsClasses = computed(() => {
  return props.type === 'card' ? `border ${props.borderColor}` : ''
})

// 切换标签逻辑
const changeTab = (key) => {
  if (activeKey.value === key) return
  activeKey.value = key
  emit('tab-change', key) // 触发切换事件
}

// 提供状态和方法给子组件（GhTab/GhTabPane）
provide('tabsContext', {
  activeKey,
  changeTab,
  type: props.type,
  activeColor: props.activeColor,
  borderColor: props.borderColor
})

// 监听 tabNames 变化：无默认激活时，自动激活第一个非禁用标签
watch(tabNames, (newNames) => {
  if (!props.defaultActive && newNames.length > 0) {
    activeKey.value = newNames[0]
  }
}, { immediate: true })

// 暴露给父组件的方法（手动切换标签）
defineExpose({
  setActiveKey: (key) => {
    if (tabNames.value.includes(key)) {
      changeTab(key)
    }
  },
  getActiveKey: () => activeKey.value
})
</script>

<!-- 内容区过渡动画样式（贴合 GitHub 温和过渡风格） -->
<style scoped>
.y-tab-fade-enter-from,
.y-tab-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
.y-tab-fade-enter-active,
.y-tab-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
</style>