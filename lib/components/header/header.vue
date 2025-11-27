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
    default: 60
  },
  bgColor: {
    type: String,
    default: 'var(--y-bg)'
  }
});

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
  box-sizing: border-box;
  /* backdrop-filter:saturate(50%) blur(4px);
  background-image: radial-gradient(transparent 1px, var(--white) 1px);
  background-size: 4px 4px; */
}
</style>
