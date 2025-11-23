<template>
  <div 
    class="y-dropdown-item"
    :class="{'y-dropdown-item--disabled': disabled}"
    @click="handleClick"
  >
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (props.disabled) return
  emit('click', event)
}
</script>

<style scoped>
.y-dropdown-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
  white-space: nowrap;
}

.y-dropdown-item:hover:not(.y-dropdown-item--disabled) {
  background: #f5f5f5;
}

.y-dropdown-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .y-dropdown-item {
    color: #e5e7eb;
  }

  .y-dropdown-item:hover:not(.y-dropdown-item--disabled) {
    background: #374151;
  }
}
</style>