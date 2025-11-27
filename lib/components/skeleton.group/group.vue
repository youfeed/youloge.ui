<template>
  <div v-if="showGroup" class="y-skeleton-group w-full">
    <slot>
      <!-- 默认内容：3行文本骨架 -->
      <y-skeleton :rows="3" :animated="animated" />
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'y-skeleton-group' })

const props = defineProps({
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

// 计算是否显示骨架屏组
const showGroup = computed(() => props.loading)
</script>