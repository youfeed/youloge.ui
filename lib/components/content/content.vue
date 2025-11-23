<template>
  <main class="y-content" :style="contentStyle">
    <slot />
  </main>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: [String, Number],
    default: 16
  },
  bgColor: {
    type: String,
    default: 'var(--y-bg)'
  }
})

const contentStyle = computed(() => ({
  padding: typeof props.padding === 'number' ? `${props.padding}px` : props.padding,
  backgroundColor: props.bgColor
}))
</script>

<style scoped>
.y-content {
  flex: 1;
  overflow: auto;
  height: 100%;
  box-sizing: border-box;
}
</style>
