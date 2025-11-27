<template>
  <div class="y-badge relative inline-block">
    <!-- 内容插槽 -->
    <slot></slot>
    
    <!-- 徽章标记 -->
    <span
      v-if="showBadge"
      class="y-badge__mark absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 z-10"
      :class="markClass"
    >
      <!-- 数字显示 -->
      <span v-if="isNumber" class="y-badge__number">
        {{ formattedValue }}
      </span>
      
      <!-- 文字显示 -->
      <span v-else-if="content" class="y-badge__text">
        {{ content }}
      </span>
      
      <!-- 圆点显示 -->
      <span v-else class="y-badge__dot"></span>
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'y-badge' })

const props = defineProps({
  // 徽章值
  value: {
    type: [String, Number],
    default: ''
  },
  // 最大值
  max: {
    type: Number,
    default: 99
  },
  // 是否显示为圆点
  dot: Boolean,
  // 是否隐藏
  hidden: Boolean,
  // 徽章类型
  type: {
    type: String,
    default: 'primary',
    validator: val => ['primary', 'success', 'warning', 'danger', 'info', 'default'].includes(val)
  },
  // 徽章大小
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg'].includes(val)
  },
  // 徽章位置
  position: {
    type: String,
    default: 'top-right',
    validator: (val) => ['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(val)
  },
  // 是否显示边框
  bordered: Boolean,
  // 是否独立显示
  standalone: Boolean
})

// 计算属性
const showBadge = computed(() => {
  if (props.hidden) return false
  if (props.dot) return true
  if (props.standalone) return true
  return props.value !== undefined && props.value !== null && props.value !== ''
})

const isNumber = computed(() => {
  return typeof props.value === 'number' || !isNaN(props.value)
})

const content = computed(() => {
  return props.value
})

const formattedValue = computed(() => {
  if (!isNumber.value) return props.value
  const numValue = Number(props.value)
  return numValue > props.max ? `${props.max}+` : numValue
})

const markClass = computed(() => [
  'y-badge__mark',
  `y-badge__mark--${props.type}`,
  `y-badge__mark--${props.size}`,
  `y-badge__mark--${props.position}`,
  {
    'y-badge__mark--dot': props.dot,
    'y-badge__mark--number': isNumber.value,
    'y-badge__mark--text': !isNumber.value && props.value,
    'y-badge__mark--bordered': props.bordered,
    'y-badge__mark--standalone': props.standalone
  }
])


</script>

<style scoped>
/* 数字徽章 */
.y-badge__mark--number {
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9px;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: #ffffff;
  font-weight: 500;
}

/* 文字徽章 */
.y-badge__mark--text {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1;
  color: #ffffff;
  white-space: nowrap;
  font-weight: 500;
}

/* 圆点徽章 */
.y-badge__mark--dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* 尺寸变体 */
.y-badge__mark--sm.y-badge__mark--number {
  min-width: 16px;
  height: 16px;
  font-size: 11px;
  line-height: 16px;
}

.y-badge__mark--sm.y-badge__mark--text {
  padding: 1px 4px;
  font-size: 11px;
}

.y-badge__mark--sm.y-badge__mark--dot {
  width: 6px;
  height: 6px;
}

.y-badge__mark--lg.y-badge__mark--number {
  min-width: 20px;
  height: 20px;
  font-size: 13px;
  line-height: 20px;
}

.y-badge__mark--lg.y-badge__mark--text {
  padding: 3px 8px;
  font-size: 13px;
}

.y-badge__mark--lg.y-badge__mark--dot {
  width: 10px;
  height: 10px;
}

/* 位置调整 */
.y-badge__mark--top-left {
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
}

.y-badge__mark--bottom-right {
  bottom: 0;
  right: 0;
  top: auto;
  transform: translate(50%, 50%);
}

.y-badge__mark--bottom-left {
  bottom: 0;
  left: 0;
  top: auto;
  transform: translate(-50%, 50%);
}

/* 边框样式 */
.y-badge__mark--bordered {
  box-shadow: 0 0 0 2px #ffffff;
}

/* 独立显示 */
.y-badge__mark--standalone {
  position: relative;
  transform: none;
  top: auto;
  right: auto;
  bottom: auto;
  left: auto;
}

/* 类型样式 */
.y-badge__mark--primary {
  background: #3b82f6;
}

.y-badge__mark--success {
  background: #10b981;
}

.y-badge__mark--warning {
  background: #f59e0b;
}

.y-badge__mark--danger {
  background: #ef4444;
}

.y-badge__mark--info {
  background: #06b6d4;
}

.y-badge__mark--default {
  background: #6b7280;
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .y-badge__mark--bordered {
    box-shadow: 0 0 0 2px #1f2937;
  }
}

/* 动画效果 */
.y-badge__mark {
  transition: all 0.2s ease-in-out;
  transform-origin: center;
}

.y-badge__mark:hover {
  transform: translate(50%, -50%) scale(1.1);
}

.y-badge__mark--top-left:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

.y-badge__mark--bottom-right:hover {
  transform: translate(50%, 50%) scale(1.1);
}

.y-badge__mark--bottom-left:hover {
  transform: translate(-50%, 50%) scale(1.1);
}

.y-badge__mark--standalone:hover {
  transform: scale(1.05);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .y-badge__mark--number {
    min-width: 16px;
    height: 16px;
    font-size: 11px;
  }
  
  .y-badge__mark--text {
    padding: 1px 4px;
    font-size: 11px;
  }
  
  .y-badge__mark--dot {
    width: 6px;
    height: 6px;
  }
}

/* 无障碍支持 */
.y-badge__mark[role="status"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 焦点样式 */
.y-badge:focus-within .y-badge__mark {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>