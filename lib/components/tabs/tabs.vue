<template>
  <div class="tabs" :class="tabsClasses">
    <!-- 标签容器（支持滚动 + 样式适配） -->
    <div class="list-container">
      <div class="list" :class="tabListClasses">
        <slot name="tab"></slot> <!-- 嵌套 y-tab 子组件 -->
      </div>
    </div>
    <!-- 内容容器（优化过渡动画） -->
    <div class="content-container">
      <transition-group name="tab-fade" mode="out-in" tag="div">
        <slot :key="activeKey"></slot> <!-- 嵌套 y-tab-pane 子组件 -->
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, computed, watch, onMounted, nextTick } from 'vue'

defineOptions({ name: 'y-tabs' })

// Props 定义：保留功能，默认值贴合 GitHub 风格
const props = defineProps({
  defaultActive: { type: [String, Number], default: '' },
  align: { 
    type: String, 
    default: 'left', 
    validator: val => ['left', 'center', 'right'].includes(val) 
  },
  type: { 
    type: String, 
    default: 'line', 
    validator: val => ['line', 'card'].includes(val) 
  },
  activeTextColor: { type: String, default: '#0969da' }, // GitHub 链接蓝
  activeBorderColor: { type: String, default: '' },
  borderColor: { type: String, default: '#e5e7eb' }, // 浅灰边框
  tabPadding: {
    type: [String, Number],
    default: 16,
    validator: val => typeof val === 'number' ? val >= 8 && val <= 32 : /^\d+(px|rem|em)$/.test(val)
  },
  scrollable: { type: Boolean, default: true }
})

const emit = defineEmits(['tab-change', 'tab-before-change'])

// 状态管理
const activeKey = ref(props.defaultActive)
const tabNames = ref([])
const allTabNames = ref([])
const isMounted = ref(false)

// 格式化单位
const formatUnit = (val) => typeof val === 'number' ? `${val}px` : val

// 最终激活态边框颜色（未指定则复用文本色）
const finalActiveBorderColor = computed(() => props.activeBorderColor || props.activeTextColor)

// 计算样式类
const tabListClasses = computed(() => {
  const classes = []
  
  // 对齐方式
  if (props.align === 'left') classes.push('justify-start')
  else if (props.align === 'center') classes.push('justify-center')
  else if (props.align === 'right') classes.push('justify-end')
  
  // 类型样式
  if (props.type === 'line') classes.push('border-b', 'border-gray-200')
  else if (props.type === 'card') classes.push('border-b', 'border-gray-200', 'bg-gray-50')
  
  return classes.join(' ')
})

const tabsClasses = computed(() => {
  return props.type === 'card' ? 'border border-gray-200 rounded-md overflow-hidden' : ''
})

// 切换标签逻辑
const changeTab = (key, fromChild = true) => {
  if (activeKey.value === key || !tabNames.value.includes(key)) {
    fromChild && console.warn(`[y-tabs] 标签 ${key} 不可切换（已激活或禁用）`)
    return
  }
  if (emit('tab-before-change', key, activeKey.value) === false) return
  activeKey.value = key
  emit('tab-change', key, activeKey.value)
}

// 提供给子组件的上下文（传递动态值，而非 CSS 变量）
provide('yTabsContext', {
  activeKey,
  changeTab,
  type: props.type,
  activeTextColor: props.activeTextColor,
  activeBorderColor: finalActiveBorderColor,
  borderColor: props.borderColor,
  tabPadding: formatUnit(props.tabPadding),
  tabKeys: allTabNames,
  registerTab: (name, disabled = false) => {
    if (!allTabNames.value.includes(name)) allTabNames.value.push(name)
    if (!disabled && !tabNames.value.includes(name)) tabNames.value.push(name)
  },
  unregisterTab: (name) => {
    allTabNames.value = allTabNames.value.filter(item => item !== name)
    tabNames.value = tabNames.value.filter(item => item !== name)
    if (activeKey.value === name && tabNames.value.length > 0) {
      changeTab(tabNames.value[0], false)
    }
  }
})

// 初始化激活标签
const initActiveKey = () => {
  if (props.defaultActive && tabNames.value.includes(props.defaultActive)) {
    activeKey.value = props.defaultActive
  } else if (tabNames.value.length > 0) {
    activeKey.value = tabNames.value[0]
  }
}

watch(tabNames, () => isMounted.value && initActiveKey(), { deep: true })

onMounted(() => {
  isMounted.value = true
  initActiveKey()
})

// 暴露 API
defineExpose({
  setActiveKey: (key) => changeTab(key, false),
  getActiveKey: () => activeKey.value,
  getAllTabs: () => allTabNames.value.map(name => ({
    name,
    disabled: !tabNames.value.includes(name)
  })),
  refreshCurrentTab: () => {
    const currentKey = activeKey.value
    activeKey.value = Symbol('temp')
    nextTick(() => activeKey.value = currentKey)
  }
})
</script>

<style scoped>
@reference "tailwindcss";
/* 使用 Tailwind 类实现所有样式 */
.tabs {
  @apply w-full box-border transition-all duration-200 ease-in-out;
}

.list-container {
  @apply w-full overflow-x-auto overflow-y-auto;
}

.list {
  @apply flex box-border p-0 m-0 list-none flex-nowrap;
}

.content-container {
  @apply p-4 box-border;
}
/* 兼容 WebKit 内核的额外处理（可选） */
.list-container::-webkit-scrollbar {
  display: none;
}
/* 过渡动画 */
.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(3px);
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
}
</style>