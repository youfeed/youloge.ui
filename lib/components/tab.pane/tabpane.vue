<template>
  <div class="w-full box-border transition-opacity duration-300 ease-in-out" v-if="isActive">
    <slot />
  </div>
</template>

<script setup>
import { defineProps, computed, inject, ref, watch } from 'vue'

defineOptions({ name: 'y-tab-pane' })

// 注入上下文
const tabsContext = inject('yTabsContext', null)
if (!tabsContext) {
  throw new Error('[y-tab-pane] 必须嵌套在 <y-tabs> 组件中使用')
}

// Props
const props = defineProps({
  name: { type: [String, Number], required: true },
  cache: { type: Boolean, default: false }
})

// 计算是否激活（缓存逻辑）
const isActive = computed(() => {
  if (props.cache) {
    return tabsContext.activeKey.value === props.name || hasActivated.value
  }
  return tabsContext.activeKey.value === props.name
})

const hasActivated = ref(false)

// 监听激活状态
watch(isActive, (val) => {
  if (val) hasActivated.value = true
})
</script>

<style scoped>
/* 所有样式都已通过 Tailwind 类实现 */
</style>