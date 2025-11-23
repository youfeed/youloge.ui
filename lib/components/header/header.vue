<template>
  <header class="y-header" :style="headerStyle">
    <slot />
  </header>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  height: {
    type: [String, Number],
    default: 56
  },
  bgColor: {
    type: String,
    default: 'var(--y-bg)'
  }
})

const headerStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  backgroundColor: props.bgColor
}))
</script>

<style scoped>
.y-header {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
}
</style>
