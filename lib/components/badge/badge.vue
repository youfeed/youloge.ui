<template>
  <div class="y-badge">
    <!-- 内容插槽 -->
    <slot></slot>
    
    <!-- 徽章标记 -->
    <span
      v-if="showBadge"
      class="y-badge__mark"
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

<script>
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
    validator: val => ['primary', 'success', 'warning', 'danger'].includes(val)
  }
})

// 计算属性
const showBadge = computed(() => {
  if (props.hidden) return false
  if (props.dot) return true
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
  {
    'y-badge__mark--dot': props.dot,
    'y-badge__mark--number': isNumber.value,
    'y-badge__mark--text': !isNumber.value && props.value
  }
])
</script>

<style scoped>
.y-badge {
  position: relative;
  display: inline-block;
}

.y-badge__mark {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  z-index: 10;
}

/* 数字徽章 */
.y-badge__mark--number {
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9px;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: white;
}

/* 文字徽章 */
.y-badge__mark--text {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1;
  color: white;
  white-space: nowrap;
}

/* 圆点徽章 */
.y-badge__mark--dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
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
</style>