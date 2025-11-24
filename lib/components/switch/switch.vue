<template>
  <label class="y-switch" :class="switchClass">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="isDisabled"
      @change="handleChange"
      class="y-switch__input"
    />
    <span class="y-switch__slider"></span>
    <span v-if="label" class="y-switch__label">{{ label }}</span>
  </label>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'y-switch' })

// 使用 defineModel 进行双向绑定
const modelValue = defineModel({
  type: Boolean,
  default: false
})

const props = defineProps({
  label: String,
  disabled: Boolean
})

const emit = defineEmits(['change'])

const isDisabled = computed(() => props.disabled)

const switchClass = computed(() => [
  'y-switch',
  {
    'y-switch--checked': modelValue.value,
    'y-switch--disabled': isDisabled.value
  }
])

const handleChange = (event) => {
  if (isDisabled.value) return
  const newValue = event.target.checked
  // 使用 defineModel 自动处理双向绑定
  modelValue.value = newValue
  // 只触发 change 事件
  emit('change', newValue)
}
</script>

<style scoped>
.y-switch {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.y-switch__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.y-switch__slider {
  position: relative;
  width: 40px;
  height: 20px;
  background-color: var(--neutral-300);
  border-radius: 20px;
  margin-right: 8px;
  transition: all 0.3s;
}

.y-switch__slider::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  left: 2px;
  top: 2px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s;
}

.y-switch--checked .y-switch__slider {
  background-color: var(--primary);
}

.y-switch--checked .y-switch__slider::before {
  transform: translateX(20px);
}

.y-switch--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.y-switch__label {
  font-size: 14px;
}
</style>