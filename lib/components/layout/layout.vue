<template>
  <div class="y-layout" :class="layoutClass" :style="layoutStyle">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  direction: {
    type: String,
    default: 'vertical',
    validator: v => ['vertical', 'horizontal'].includes(v)
  },
  gap: {
    type: [String, Number],
    default: 0
  }
})

const layoutClass = computed(() => ({
  'y-layout-vertical': props.direction === 'vertical',
  'y-layout-horizontal': props.direction === 'horizontal'
}))

const layoutStyle = computed(() => ({
  '--y-gap': typeof props.gap === 'number' ? `${props.gap}px` : props.gap
}))
</script>

<style scoped>
.y-layout {
  display: flex;
  width: 100%;
  height: 100%;
}

.y-layout-vertical {
  flex-direction: column;
  gap: var(--y-gap);
}

.y-layout-horizontal {
  flex-direction: row;
  gap: var(--y-gap);
}
</style>
