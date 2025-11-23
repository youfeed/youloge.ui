<template>
  <div class="y-dropdown-divider"></div>
</template>

<script setup>
// 无props，仅作为视觉分隔符
</script>

<style scoped>
.y-dropdown-divider {
  height: 1px;
  margin: 4px 0;
  background: #e5e7eb;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .y-dropdown-divider {
    background: #374151;
  }
}
</style>