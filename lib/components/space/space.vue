<template>
  <!-- 间距容器：基于 flex 布局实现均匀间距 -->
  <div
    class="flex transition-all duration-200"
    :class="spaceClasses"
    :style="customStyle"
  >
    <slot></slot> <!-- 包裹需要控制间距的子组件 -->
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 定义 Props：覆盖间距核心场景
const props = defineProps({
  // 间距方向：水平（默认）/垂直
  direction: {
    type: String,
    default: 'horizontal',
    validator: (val) => ['horizontal', 'vertical'].includes(val)
  },
  // 间距大小（默认 8px，贴合 GitHub 组件间距风格）
  gap: {
    type: String,
    default: '8px',
    validator: (val) => val.endsWith('px') || val.endsWith('rem')
  },
  // 垂直对齐方式（仅水平方向生效）
  align: {
    type: String,
    default: 'center',
    validator: (val) => ['start', 'center', 'end', 'stretch', 'baseline'].includes(val)
  },
  // 是否允许换行（仅水平方向生效）
  wrap: {
    type: Boolean,
    default: false
  },
  // 子组件是否填充容器宽度/高度（垂直方向填充高度，水平方向填充宽度）
  fill: {
    type: Boolean,
    default: false
  }
})

// 计算动态样式类：整合 Unocss 原子类
const spaceClasses = computed(() => {
  // 方向类：水平=flex-row，垂直=flex-col
  const directionClass = props.direction === 'horizontal' ? 'flex-row' : 'flex-col'

  // 间距类：提取数值（如 "8px" → "gap-8"），适配 Unocss gap 原子类
  const gapValue = props.gap.replace(/[a-z]+/, '')
  const gapClass = `gap-${gapValue}`

  // 对齐类：仅水平方向生效，对应 items-*
  const alignClass = props.direction === 'horizontal' ? `items-${props.align}` : ''

  // 换行类：仅水平方向生效，flex-wrap
  const wrapClass = props.direction === 'horizontal' && props.wrap ? 'flex-wrap' : ''

  // 填充类：子组件填充容器
  const fillClass = props.fill ? (props.direction === 'horizontal' ? 'w-full' : 'h-full') : ''

  // 组合所有类（过滤空值）
  return [directionClass, gapClass, alignClass, wrapClass, fillClass].filter(Boolean).join(' ')
})

// 自定义样式（兼容特殊场景，如动态间距单位）
const customStyle = computed(() => {
  return {}
})
</script>