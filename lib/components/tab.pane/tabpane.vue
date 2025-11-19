<template>
  <!-- 仅激活的标签对应的内容显示 -->
  <div v-if="isActive" class="w-full transition-all duration-200" :class="paneClasses">
    <slot></slot> <!-- 内容区域 -->
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

// Props 定义（name 需与 GhTab 一致）
const props = defineProps({
  name: {
    type: [String, Number],
    required: true
  },
  // 内容区内边距（默认 0，贴合 GitHub 紧凑风格）
  padding: {
    type: String,
    default: '0',
    validator: val => val.endsWith('px') || val.endsWith('rem')
  }
})

// 注入主组件激活状态
const { activeKey } = inject('tabsContext')

// 判断是否激活（name 与 activeKey 匹配）
const isActive = computed(() => activeKey.value === props.name)

// 计算内容区样式（内边距）
const paneClasses = computed(() => {
  const paddingValue = props.padding.replace(/[a-z]+/, '')
  return `p-${paddingValue}`
})
</script>