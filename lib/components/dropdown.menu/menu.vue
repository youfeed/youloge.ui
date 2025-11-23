<template>
  <div class="y-dropdown-menu" :style="menuStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  width: {
    type: [String, Number],
    default: 'auto'
  }
})

const menuStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width
}))
</script>

<style scoped>
.y-dropdown-menu {
  min-width: 160px;
  padding: 4px 0;
}
</style>