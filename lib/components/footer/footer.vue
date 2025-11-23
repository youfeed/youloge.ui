<template>
  <footer class="y-footer" :style="footerStyle">
    <slot />
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  height: {
    type: [String, Number],
    default: 48
  },
  bgColor: {
    type: String,
    default: 'var(--y-bg)'
  }
})

const footerStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  backgroundColor: props.bgColor
}))
</script>

<style scoped>
.y-footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
</style>
