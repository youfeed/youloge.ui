<template>
  <div :class="spaceClass" :style="spaceStyle">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'y-space' })

const props = defineProps({
  // 方向
  direction: {
    type: String,
    default: 'horizontal',
    validator: (val) => ['horizontal', 'vertical'].includes(val)
  },
  // 间距大小
  size: {
    type: [String, Number],
    default: 16
  },
  // 对齐方式
  align: {
    type: String,
    default: 'center',
    validator: (val) => ['start', 'center', 'end', 'stretch', 'baseline'].includes(val)
  },
  // 是否换行
  wrap: {
    type: Boolean,
    default: false
  },
  // 子组件填充
  fill: {
    type: Boolean,
    default: false
  },
  // 分隔符
  divider: {
    type: Boolean,
    default: false
  },
  // 自定义类名
  class: {
    type: String,
    default: ''
  }
})

// 间距类名计算
const spaceClass = computed(() => {
  const classes = ['y-space']
  
  // 方向样式
  if (props.direction === 'horizontal') {
    classes.push('flex', 'flex-row')
    if (props.wrap) {
      classes.push('flex-wrap')
    }
  } else {
    classes.push('flex', 'flex-col')
  }
  
  // 对齐方式映射
  const alignMap = {
    start: props.direction === 'horizontal' ? 'items-start' : 'justify-start',
    center: props.direction === 'horizontal' ? 'items-center' : 'justify-center',
    end: props.direction === 'horizontal' ? 'items-end' : 'justify-end',
    stretch: props.direction === 'horizontal' ? 'items-stretch' : 'justify-stretch',
    baseline: 'items-baseline'
  }
  classes.push(alignMap[props.align] || 'items-center')
  
  // 填充模式
  if (props.fill) {
    classes.push('y-space--fill')
  }
  
  // 分隔符模式
  if (props.divider) {
    classes.push('y-space--divider')
  }
  
  // 自定义类名
  if (props.class) {
    classes.push(props.class)
  }
  
  return classes.join(' ')
})

// 间距样式计算
const spaceStyle = computed(() => {
  const style = {}
  
  // 间距大小
  const gap = typeof props.size === 'number' ? `${props.size}px` : props.size
  style.gap = gap
  
  return style
})
</script>

<style scoped>
.y-space {
  box-sizing: border-box;
  width: 100%;
  transition: all 0.2s ease-in-out;
}

/* 子元素基础样式 */
.y-space > * {
  box-sizing: border-box;
  min-width: 0;
  flex-shrink: 0;
}

/* 填充模式：子元素均匀分配空间 */
.y-space--fill > * {
  flex: 1;
  min-width: 0;
}

.y-space--fill.y-space--divider > * {
  flex: 1;
}

/* 分隔符模式 */
.y-space--divider {
  position: relative;
}

.y-space--divider > * {
  position: relative;
}

.y-space--divider > *:not(:last-child)::after {
  content: '';
  position: absolute;
  background-color: var(--y-border-light);
  transition: all 0.2s ease-in-out;
}

/* 水平分隔符 */
.y-space--divider:not(.flex-col) > *:not(:last-child)::after {
  right: calc(var(--y-space-gap, 16px) / -2);
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 1em;
}

/* 垂直分隔符 */
.y-space--divider.flex-col > *:not(:last-child)::after {
  bottom: calc(var(--y-space-gap, 16px) / -2);
  left: 50%;
  transform: translateX(-50%);
  width: 1em;
  height: 1px;
}

/* 换行模式优化 */
.flex-wrap {
  align-content: flex-start;
}

.flex-wrap > * {
  flex-shrink: 1;
}

/* 响应式适配 */
@media (max-width: 768px) {
  /* 小屏幕自动调整间距 */
  .y-space {
    --y-space-gap: calc(var(--y-mobile-gap, 16px) * 0.8);
  }
  
  /* 小屏幕水平空间自动换行 */
  .y-space:not(.flex-col):not(.flex-wrap) {
    flex-wrap: wrap;
  }
  
  /* 分隔符小屏幕隐藏 */
  .y-space--divider > *:not(:last-child)::after {
    opacity: 0.6;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .y-space--divider > *:not(:last-child)::after {
    background-color: var(--y-border-dark);
  }
}

/* 动画效果 */
.y-space > * {
  transition: transform 0.2s ease-in-out;
}

.y-space > *:hover {
  transform: translateY(-1px);
}

/* 焦点状态 */
.y-space:focus-within {
  outline: 2px solid var(--y-primary);
  outline-offset: 2px;
}

/* 空状态 */
.y-space:empty {
  min-height: 40px;
  background-color: var(--y-bg-tertiary);
  border: 1px dashed var(--y-border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--y-text-placeholder);
  font-size: 14px;
}

.y-space:empty::before {
  content: '暂无内容';
}

/* 加载状态 */
.y-space--loading {
  position: relative;
  pointer-events: none;
}

.y-space--loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 10;
  backdrop-filter: blur(2px);
}

@media (prefers-color-scheme: dark) {
  .y-space--loading::before {
    background-color: rgba(0, 0, 0, 0.7);
  }
}
</style>