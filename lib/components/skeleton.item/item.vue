<template>
  <div class="y-skeleton-item" :class="itemClass" :style="itemStyle">
    <div class="y-skeleton-item__content"></div>
  </div>
</template>

<script>
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

const itemClass = computed(() => [
  'y-skeleton-item',
  `y-skeleton-item--${props.variant}`,
  {
    'y-skeleton-item--animated': props.animated
  }
])

const itemStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}))
</script>

<style scoped>
.y-skeleton-item {
  display: inline-block;
  background: #f0f0f0;
  border-radius: 4px;
}

.y-skeleton-item--text {
  height: 16px;
}

.y-skeleton-item--circle {
  border-radius: 50%;
}

.y-skeleton-item--rect {
  border-radius: 0;
}

.y-skeleton-item--button {
  height: 32px;
  border-radius: 6px;
}

.y-skeleton-item--animated {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 400% 100%;
  animation: y-skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes y-skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>