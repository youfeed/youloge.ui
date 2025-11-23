<template>
  <aside class="y-aside" :style="asideStyle">
    <slot />
  </aside>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  width: {
    type: [String, Number],
    default: 240
  },
  bgColor: {
    type: String,
    default: 'var(--y-bg)'
  }
})

const asideStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  backgroundColor: props.bgColor
}))
</script>

<style scoped>
.y-aside {
  flex-shrink: 0;
  height: 100%;
  overflow: auto;
}
</style>
