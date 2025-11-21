<template>
  <div class="y-tab-pane" v-if="isActive">
    <slot />
  </div>
</template>

<script setup>
import { defineProps, computed, inject, ref,watch } from 'vue'

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

<style lang="less" scoped>
// 完全无 Less 变量
.y-tab-pane {
  width: 100%;
  box-sizing: border-box;
  animation: fadeIn 0.25s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>