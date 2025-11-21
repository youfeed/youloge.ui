<template>
  <div
    class="y-tab"
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

// 计算样式类（简化逻辑，避免复杂嵌套）
const tabClasses = computed(() => {
  const base = ['y-tab']
  if (tabsContext.activeKey.value === props.name) base.push('y-tab--active')
  if (props.disabled) base.push('y-tab--disabled')
  if (tabsContext.type === 'line') base.push('y-tab--line')
  if (tabsContext.type === 'card') base.push('y-tab--card')
  return base
})

// 计算内联动态样式（保持动态性，无 Less 变量）
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

<!-- 核心修复：Less 语法彻底纠错，简化嵌套，确保无解析错误 -->
<style lang="less" scoped>
// 基础样式：语法规范，无多余符号
.y-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 400;
  color: #4b5563;
  border-bottom: 2px solid transparent;
}

// 禁用态：独立选择器，语法简洁
.y-tab--disabled {
  color: #9ca3af !important;
  cursor: not-allowed;
  background-color: transparent !important;
}

// 激活态：独立选择器，统一加粗
.y-tab--active {
  font-weight: 500;
}

// 下划线式标签：单独定义，无嵌套歧义
.y-tab--line {
  margin-bottom: -1px;
}

// 下划线式 - 非禁用/非激活 hover 态
.y-tab--line:not(.y-tab--disabled):not(.y-tab--active):hover {
  color: #0969da;
  border-bottom-color: rgba(9, 105, 218, 0.3);
}

// 卡片式标签：单独定义，无嵌套歧义
.y-tab--card {
  border-right: 1px solid #e5e7eb;
}

// 卡片式 - 第一个标签左边框
.y-tab--card:first-child {
  border-left: 1px solid #e5e7eb;
}

// 卡片式 - 非禁用/非激活 hover 态
.y-tab--card:not(.y-tab--disabled):not(.y-tab--active):hover {
  color: #0969da;
  background-color: #f3f4f6;
}
</style>