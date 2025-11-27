<template>
  <div :class="dividerClass" :style="dividerStyle">
    <span v-if="direction === 'horizontal' && hasContent" class="y-divider__text">
      <slot />
    </span>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'

defineOptions({ name: 'y-divider' })

const slots = useSlots()
const props = defineProps({
  // 方向
  direction: {
    type: String,
    default: 'horizontal',
    validator: (val) => ['horizontal', 'vertical'].includes(val)
  },
  // 颜色
  color: {
    type: String,
    default: 'border-light'
  },
  // 粗细
  thickness: {
    type: [String, Number],
    default: 1
  },
  // 间距
  margin: {
    type: [String, Number],
    default: 16
  },
  // 样式类型
  variant: {
    type: String,
    default: 'solid',
    validator: (val) => ['solid', 'dashed', 'dotted'].includes(val)
  },
  // 文本位置
  position: {
    type: String,
    default: 'center',
    validator: (val) => ['left', 'center', 'right'].includes(val)
  },
  // 自定义类名
  class: {
    type: String,
    default: ''
  }
})

// 检查是否有内容
const hasContent = computed(() => !!(slots.default?.().length))

// 分割线类名
const dividerClass = computed(() => {
  const classes = ['y-divider', 'transition-colors', 'duration-200']
  
  // 方向样式
  if (props.direction === 'horizontal') {
    classes.push('w-full', 'flex', 'items-center')
    if (hasContent.value) {
      classes.push('y-divider--horizontal-with-text')
    }
  } else {
    classes.push('h-full', 'inline-flex', 'flex-col', 'justify-center')
  }
  
  // 边框样式
  const variantMap = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
  }
  classes.push(variantMap[props.variant] || 'border-solid')
  
  // 间距样式
  const marginNum = typeof props.margin === 'number' ? props.margin : parseInt(props.margin) || 16
  const spacingClass = props.direction === 'horizontal' 
    ? `my-${Math.round(marginNum / 4)}`
    : `mx-${Math.round(marginNum / 4)}`
  classes.push(spacingClass)
  
  // 文本对齐
  if (hasContent.value && props.direction === 'horizontal') {
    const positionMap = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end'
    }
    classes.push(positionMap[props.position] || 'justify-center')
  }
  
  // 自定义类名
  if (props.class) {
    classes.push(props.class)
  }
  
  return classes.join(' ')
})

// 分割线样式
const dividerStyle = computed(() => {
  const style = {}
  
  // 使用主题颜色变量
  const colorMap = {
    'border-light': 'var(--y-border-light)',
    'border': 'var(--y-border)',
    'border-dark': 'var(--y-border-dark)',
    'primary': 'var(--y-primary)',
    'success': 'var(--y-success)',
    'warning': 'var(--y-warning)',
    'error': 'var(--y-error)',
    'neutral': 'var(--y-neutral-300)'
  }
  
  style.borderColor = colorMap[props.color] || props.color
  
  // 边框粗细
  const thickness = typeof props.thickness === 'number' ? `${props.thickness}px` : props.thickness
  if (props.direction === 'horizontal') {
    style.borderBottomWidth = thickness
  } else {
    style.borderLeftWidth = thickness
  }
  
  return style
})
</script>

<style scoped>
.y-divider {
  box-sizing: border-box;
  border-color: inherit;
}

/* 水平分割线基础样式 */
.y-divider--horizontal-with-text {
  border-bottom-style: inherit;
  border-bottom-width: inherit;
}

/* 垂直分割线基础样式 */
.y-divider:not(.y-divider--horizontal-with-text) {
  border-left-style: inherit;
  border-left-width: inherit;
}

/* 文本样式 */
.y-divider__text {
  display: inline-block;
  padding: 0 12px;
  background-color: var(--y-bg-primary);
  color: var(--y-text-secondary);
  font-size: 14px;
  line-height: 1.4;
  white-space: nowrap;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .y-divider__text {
    background-color: var(--y-bg-dark);
    color: var(--y-text-secondary-dark);
  }
}

/* 响应式间距 */
@media (max-width: 768px) {
  .y-divider__text {
    padding: 0 8px;
    font-size: 12px;
  }
}

/* 动画效果 */
.y-divider {
  transition: border-color 0.2s ease-in-out;
}

/* 焦点状态 */
.y-divider:focus-visible {
  outline: 2px solid var(--y-primary);
  outline-offset: 2px;
}
</style>