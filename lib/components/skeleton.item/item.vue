<template>
  <div :class="itemClass" :style="itemStyle"></div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'y-skeleton-item' })

const props = defineProps({
  // 形状
  variant: {
    type: String,
    default: 'text', // text | circle | rect | button
    validator: val => ['text', 'circle', 'rect', 'button'].includes(val)
  },
  // 宽度
  width: {
    type: [String, Number],
    default: '100%'
  },
  // 高度
  height: {
    type: [String, Number],
    default: 'auto'
  },
  // 是否开启动画
  animated: {
    type: Boolean,
    default: true
  }
})

// 样式类
const itemClass = computed(() => [
  'y-skeleton-item',
  'inline-block',
  'bg-gray-100',
  {
    'rounded-full': props.variant === 'circle',
    'rounded': props.variant !== 'circle' && props.variant !== 'rect',
    'y-skeleton-item--animated': props.animated
  }
])

// 默认高度
const defaultHeight = computed(() => {
  switch (props.variant) {
    case 'text': return '16px'
    case 'button': return '32px'
    default: return props.height
  }
})

// 样式
const itemStyle = computed(() => {
  const width = typeof props.width === 'number' ? `${props.width}px` : props.width
  const height = props.height === 'auto' ? defaultHeight.value : 
                 (typeof props.height === 'number' ? `${props.height}px` : props.height)
  
  return {
    width: width,
    height: height,
    backgroundColor: 'var(--y-skeleton-bg, #f3f4f6)'
  }
})
</script>

<style scoped>
.y-skeleton-item--animated {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%) !important;
  background-size: 400% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .y-skeleton-item {
    background-color: var(--y-skeleton-bg-dark, #374151) !important;
  }
  
  .y-skeleton-item--animated {
    background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%) !important;
  }
}
</style>