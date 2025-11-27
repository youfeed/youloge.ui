<template>
  <!-- 骨架屏容器 -->
  <div v-if="showSkeleton" :class="skeletonClass">
    <!-- 头像骨架 -->
    <div v-if="avatar" :class="avatarClass" :style="avatarStyle"></div>
    
    <!-- 内容区域 -->
    <div class="y-skeleton__content">
      <!-- 标题骨架 -->
      <div v-if="title" class="y-skeleton__title" :style="titleStyle"></div>
      
      <!-- 段落骨架 -->
      <div
        v-for="i in rows"
        :key="i"
        class="y-skeleton__row"
        :class="{ 'y-skeleton__row--last': i === rows }"
        :style="rowStyle(i)"
      ></div>
    </div>
  </div>
  
  <!-- 真实内容 -->
  <div v-else class="y-skeleton__content">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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
  }
})

// 计算是否显示骨架屏
const showSkeleton = computed(() => props.loading)

// 骨架屏样式类
const skeletonClass = computed(() => [
  'y-skeleton',
  'flex',
  'w-full',
  'p-4',
  {
    'y-skeleton--animated': props.animated
  }
])

// 头像样式类
const avatarClass = computed(() => [
  'y-skeleton__avatar',
  'flex-shrink-0',
  'mr-4',
  {
    'rounded-full': props.avatarShape === 'circle',
    'rounded': props.avatarShape === 'square'
  }
])

// 头像大小样式
const avatarStyle = computed(() => {
  const size = typeof props.avatarSize === 'number' ? `${props.avatarSize}px` : props.avatarSize
  return {
    width: size,
    height: size,
    backgroundColor: 'var(--y-skeleton-bg, #f3f4f6)'
  }
})



// 标题样式
const titleStyle = computed(() => {
  const width = typeof props.titleWidth === 'number' ? `${props.titleWidth}px` : props.titleWidth
  return {
    width: width,
    height: '16px'
  }
})

// 段落行样式
const rowStyle = (index) => {
  const width = index === props.rows ? '60%' : '100%'
  return {
    width: width,
    height: '14px'
  }
}
</script>

<style scoped>
.y-skeleton__title {
  background-color: var(--y-skeleton-bg, #f3f4f6);
  border-radius: 4px;
  margin-bottom: 16px;
}

.y-skeleton__row {
  background-color: var(--y-skeleton-bg, #f3f4f6);
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
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
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
  .y-skeleton__title,
  .y-skeleton__row {
    background-color: var(--y-skeleton-bg-dark, #374151);
  }
  
  .y-skeleton--animated .y-skeleton__avatar,
  .y-skeleton--animated .y-skeleton__title,
  .y-skeleton--animated .y-skeleton__row {
    background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  }
}
</style>