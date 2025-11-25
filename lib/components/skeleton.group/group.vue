<template>
  <div class="y-skeleton-group" :class="groupClass">
    <slot>
      <!-- 默认内容：3行文本骨架 -->
      <y-skeleton :rows="3" :animated="animated" />
    </slot>
  </div>
</template>

<script>
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

const groupClass = computed(() => [
  'y-skeleton-group',
  {
    'y-skeleton-group--loading': props.loading
  }
])
</script>

<style scoped>
.y-skeleton-group {
  width: 100%;
}

.y-skeleton-group:not(.y-skeleton-group--loading) {
  display: none;
}
</style>