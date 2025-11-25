<template>
  <!-- 骨架屏容器 -->
  <div v-if="showSkeleton" class="y-skeleton" :class="skeletonClass">
    <!-- 头像骨架 -->
    <div v-if="avatar" class="y-skeleton__avatar" :class="avatarClass"></div>
    
    <!-- 内容区域 -->
    <div class="y-skeleton__content">
      <!-- 标题骨架 -->
      <div v-if="title" class="y-skeleton__title" :style="titleStyle"></div>
      
      <!-- 段落骨架 -->
      <div
        v-for="i in rows"
        :key="i"
        class="y-skeleton__row"
        :class="rowClass(i)"
        :style="rowStyle(i)"
      ></div>
    </div>
  </div>
  
  <!-- 真实内容 -->
  <div v-else class="y-skeleton__content">
    <slot></slot>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'

defineOptions({ name: 'y-skeleton' })

const props = defineProps({
  // 是否显示头像
  avatar: Boolean,
  // 头像大小
  avatarSize: {
    type: [String, Number],
    default: 40
  },
  // 头像形状
  avatarShape: {
    type: String,
    default: 'circle',
    validator: val => ['circle', 'square'].includes(val)
  },
  // 是否显示标题
  title: Boolean,
  // 标题宽度
  titleWidth: {
    type: [String, Number],
    default: '40%'
  },
  // 段落行数
  rows: {
    type: Number,
    default: 3
  },
  // 是否开启动画
  animated: {
    type: Boolean,
    default: true
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: true
  },
  // 加载Promise
  loadPromise: {
    type: [Promise, Function],
    default: null
  },
  // 延迟显示时间（毫秒）
  delay: {
    type: Number,
    default: 0
  },
  // 错误时是否显示内容
  showOnError: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['loading', 'success', 'error', 'finish'])

// 响应式状态
const internalLoading = ref(props.loading)
const showSkeleton = ref(false)
const loadError = ref(null)

// 计算属性
const skeletonClass = computed(() => [
  'y-skeleton',
  {
    'y-skeleton--animated': props.animated,
    'y-skeleton--loading': internalLoading.value
  }
])

const avatarClass = computed(() => [
  'y-skeleton__avatar',
  `y-skeleton__avatar--${props.avatarShape}`
])

const titleStyle = computed(() => ({
  width: typeof props.titleWidth === 'number' ? `${props.titleWidth}px` : props.titleWidth
}))

// 段落样式
const rowClass = (index) => {
  return [
    'y-skeleton__row',
    {
      'y-skeleton__row--last': index === props.rows
    }
  ]
}

const rowStyle = (index) => {
  if (index === props.rows) {
    return { width: '60%' }
  }
  return {}
}

// 处理加载状态
const handleLoading = (isLoading) => {
  internalLoading.value = isLoading
  showSkeleton.value = isLoading
  emit('loading', isLoading)
}

// 处理加载完成
const handleSuccess = () => {
  handleLoading(false)
  emit('success')
  emit('finish', { success: true, error: null })
}

// 处理加载错误
const handleError = (error) => {
  loadError.value = error
  handleLoading(false)
  emit('error', error)
  emit('finish', { success: false, error })
  
  // 根据配置决定是否显示内容
  showSkeleton.value = !props.showOnError
}

// 执行加载Promise
const executeLoadPromise = async () => {
  if (!props.loadPromise) return
  
  try {
    handleLoading(true)
    
    // 延迟显示
    if (props.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, props.delay))
    }
    
    // 执行Promise
    const promise = typeof props.loadPromise === 'function' 
      ? props.loadPromise() 
      : props.loadPromise
    
    await promise
    handleSuccess()
  } catch (error) {
    handleError(error)
  }
}

// 监听props变化
watch(() => props.loading, (newVal) => {
  if (!props.loadPromise) {
    internalLoading.value = newVal
    showSkeleton.value = newVal
  }
})

watch(() => props.loadPromise, (newPromise) => {
  if (newPromise) {
    executeLoadPromise()
  }
})

// 生命周期
onMounted(() => {
  if (props.loadPromise) {
    // 有Promise，自动执行
    executeLoadPromise()
  } else {
    // 没有Promise，使用loading状态
    internalLoading.value = props.loading
    showSkeleton.value = props.loading
  }
})

// 暴露方法
defineExpose({
  // 重新加载
  reload: () => {
    if (props.loadPromise) {
      executeLoadPromise()
    } else {
      handleLoading(true)
      setTimeout(() => handleLoading(false), 1000)
    }
  },
  // 手动设置加载状态
  setLoading: (isLoading) => {
    handleLoading(isLoading)
  },
  // 获取当前状态
  getState: () => ({
    loading: internalLoading.value,
    showSkeleton: showSkeleton.value,
    error: loadError.value
  })
})
</script>

<style scoped>
.y-skeleton {
  display: flex;
  width: 100%;
  padding: 16px;
}

.y-skeleton__avatar {
  flex-shrink: 0;
  background: #f0f0f0;
  margin-right: 16px;
}

.y-skeleton__avatar--circle {
  border-radius: 50%;
}

.y-skeleton__avatar--square {
  border-radius: 4px;
}

.y-skeleton__content {
  flex: 1;
  width: 0;
}

.y-skeleton__title {
  height: 16px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 16px;
}

.y-skeleton__row {
  height: 14px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 12px;
}

.y-skeleton__row:last-child {
  margin-bottom: 0;
}

/* 动画效果 */
.y-skeleton--animated .y-skeleton__avatar,
.y-skeleton--animated .y-skeleton__title,
.y-skeleton--animated .y-skeleton__row {
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