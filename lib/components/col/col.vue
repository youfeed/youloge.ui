<template>
  <div :class="colClass" :style="colStyle">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'y-col' })

const props = defineProps({
  // 默认栅格值
  span: { 
    type: Number, 
    default: 24, 
    validator: val => val >= 0 && val <= 24 
  },
  // 偏移量
  offset: { 
    type: Number, 
    default: 0, 
    validator: val => val >= 0 && val <= 23 
  },
  // 响应式栅格
  xs: Number,
  sm: Number, 
  md: Number,
  lg: Number,
  xl: Number
})

// 基础类名
const colClass = computed(() => {
  const classes = ['box-border']
  
  // 隐藏状态
  if (props.span === 0) {
    classes.push('hidden')
  } else {
    classes.push('block')
  }
  
  return classes.join(' ')
})

// 样式计算
const colStyle = computed(() => {
  const style = {}
  
  // 基础样式
  if (props.span > 0) {
    style.width = `${(props.span / 24) * 100}%`
  }
  
  if (props.offset > 0) {
    style.marginLeft = `${(props.offset / 24) * 100}%`
  }
  
  // 响应式样式 - 使用CSS变量
  const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']
  breakpoints.forEach(bp => {
    if (props[bp] !== undefined) {
      style[`--y-${bp}-span`] = props[bp]
    }
  })
  
  return style
})
</script>

<style scoped>
.y-col {
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
}

/* 响应式断点样式 */
@media (max-width: 359px) {
  .y-col {
    width: var(--y-xs-span) !important;
  }
  .y-col[style*="--y-xs-span:0"] {
    display: none !important;
  }
}

@media (max-width: 575px) {
  .y-col {
    width: var(--y-sm-span) !important;
  }
  .y-col[style*="--y-sm-span:0"] {
    display: none !important;
  }
}

@media (max-width: 767px) {
  .y-col {
    width: var(--y-md-span) !important;
  }
  .y-col[style*="--y-md-span:0"] {
    display: none !important;
  }
}

@media (max-width: 1023px) {
  .y-col {
    width: var(--y-lg-span) !important;
  }
  .y-col[style*="--y-lg-span:0"] {
    display: none !important;
  }
}

@media (max-width: 1279px) {
  .y-col {
    width: var(--y-xl-span) !important;
  }
  .y-col[style*="--y-xl-span:0"] {
    display: none !important;
  }
}
</style>