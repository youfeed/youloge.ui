<template>
  <div class="w-full h-px my-1" :class="dividerClasses"></div>
</template>

<script setup>
const props = defineProps({
  // 分割线颜色（默认和 divider 组件一致，保持风格统一）
  color: {
    type: String,
    default: 'bg-gray-200 dark:bg-gray-700'
  }
})

const dividerClasses = computed(() => {
  return props.color
})
</script>