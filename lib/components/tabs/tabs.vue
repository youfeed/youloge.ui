<template>
  <div class="y-tabs" :class="tabsClasses">
    <!-- 标签容器（支持滚动 + 样式适配） -->
    <div class="y-tabs__list-container">
      <div class="y-tabs__list" :class="tabListClasses">
        <slot name="tab"></slot> <!-- 嵌套 y-tab 子组件 -->
      </div>
    </div>
    <!-- 内容容器（优化过渡动画） -->
    <div class="y-tabs__content-container">
      <transition-group name="y-tab-fade" mode="out-in" tag="div">
        <slot :key="activeKey"></slot> <!-- 嵌套 y-tab-pane 子组件 -->
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, computed, watch, onMounted } from 'vue'

defineOptions({ name: 'y-tabs' })

// Props 定义：保留功能，默认值贴合 GitHub 风格
const props = defineProps({
  defaultActive: { type: [String, Number], default: '' },
  align: { type: String, default: 'left', validator: val => ['left', 'center', 'right'].includes(val) },
  type: { type: String, default: 'line', validator: val => ['line', 'card'].includes(val) },
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
  const alignClass = `y-tabs__list--${props.align}`
  const typeClass = `y-tabs__list--${props.type}`
  const scrollClass = props.scrollable ? 'y-tabs__list--scrollable' : ''
  return `${alignClass} ${typeClass} ${scrollClass}`
})

const tabsClasses = computed(() => props.type === 'card' ? 'y-tabs--card' : '')

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

<style lang="less" scoped>
// 完全无 Less 变量，所有值为固定原生值
.y-tabs {
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;

  // 卡片式整体样式
  &--card {
    border: 1px solid #e5e7eb; // 固定浅灰边框
    border-radius: 6px;
    overflow: hidden;
  }

  // 标签容器（支持滚动）
  &__list-container {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    &::-webkit-scrollbar { display: none; }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  // 标签列表：flex 布局
  &__list {
    display: flex;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    list-style: none;

    // 对齐方式
    &--left { justify-content: flex-start; }
    &--center { justify-content: center; }
    &--right { justify-content: flex-end; }

    // 滚动模式
    &--scrollable { flex-wrap: nowrap; }

    // 下划线式样式
    &--line { border-bottom: 1px solid #e5e7eb; } // 固定边框色

    // 卡片式样式
    &--card {
      border-bottom: 1px solid #e5e7eb; // 固定边框色
      background-color: #f9fafb; // 固定浅背景
    }
  }

  // 内容容器
  &__content-container {
    padding: 16px;
    box-sizing: border-box;
  }
}

// 过渡动画
.y-tab-fade-enter-from,
.y-tab-fade-leave-to {
  opacity: 0;
  transform: translateY(3px);
}
.y-tab-fade-enter-active,
.y-tab-fade-leave-active {
  transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
}
</style>