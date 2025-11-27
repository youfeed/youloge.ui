<template>
  <label :class="radioClass">
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="isDisabled"
      @change="handleChange"
      class="y-radio__input sr-only"
    />
    <span class="y-radio__inner"></span>
    <span v-if="slots.default || label" class="y-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>
import { computed, inject, useSlots } from 'vue'

defineOptions({ name: 'y-radio' })

const formContext = inject('formContext', null)
const groupContext = inject('radioGroupContext', null)
const slots = useSlots()

const modelValue = defineModel({
  type: [String, Number, Boolean],
  default: false
})

const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    required: true
  },
  label: String,
  name: String,
  disabled: Boolean,
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg'].includes(val)
  }
})

const emit = defineEmits(['change'])

const isGroup = computed(() => !!groupContext)

const isChecked = computed(() => {
  if (isGroup.value) {
    return groupContext.modelValue?.value === props.value
  }
  return modelValue.value === props.value
})

const isDisabled = computed(() => {
  return props.disabled || groupContext?.disabled || formContext?.disabled?.value || false
})

const radioClass = computed(() => [
  'y-radio',
  'inline-flex',
  'items-center',
  'cursor-pointer',
  'select-none',
  'text-sm',
  'mr-4',
  'transition-all',
  'duration-200',
  {
    'y-radio--checked': isChecked.value,
    'y-radio--disabled': isDisabled.value,
    'y-radio--sm': props.size === 'sm',
    'y-radio--md': props.size === 'md',
    'y-radio--lg': props.size === 'lg',
    'cursor-not-allowed opacity-60': isDisabled.value
  }
])

const handleChange = (event) => {
  if (isDisabled.value) return
  
  if (isGroup.value) {
    groupContext.change(props.value)
  } else {
    modelValue.value = props.value
  }
  
  emit('change', props.value, event)
}
</script>

<style scoped>
.y-radio {
  color: var(--y-text-primary, #374151);
}

.y-radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.y-radio__inner {
  position: relative;
  width: 16px;
  height: 16px;
  border: 2px solid var(--y-border, #d1d5db);
  border-radius: 50%;
  margin-right: 8px;
  transition: all 0.2s ease-in-out;
  flex-shrink: 0;
}

/* 尺寸变体 */
.y-radio--sm .y-radio__inner {
  width: 14px;
  height: 14px;
  margin-right: 6px;
}

.y-radio--lg .y-radio__inner {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

/* 选中状态 */
.y-radio--checked .y-radio__inner {
  border-color: var(--y-primary, #3b82f6);
  background-color: var(--y-primary, #3b82f6);
}

.y-radio--checked .y-radio__inner::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: var(--y-white, #ffffff);
  border-radius: 50%;
  transition: all 0.15s ease-in-out;
}

/* 尺寸变体的选中状态 */
.y-radio--sm.y-radio--checked .y-radio__inner::after {
  width: 5px;
  height: 5px;
}

.y-radio--lg.y-radio--checked .y-radio__inner::after {
  width: 7px;
  height: 7px;
}

/* 禁用状态 */
.y-radio--disabled .y-radio__inner {
  border-color: var(--y-border-light, #e5e7eb);
  background-color: var(--y-bg-tertiary, #f3f4f6);
}

.y-radio--disabled.y-radio--checked .y-radio__inner {
  background-color: var(--y-border, #d1d5db);
}

.y-radio--disabled.y-radio--checked .y-radio__inner::after {
  background: var(--y-text-disabled, #9ca3af);
}

/* 标签样式 */
.y-radio__label {
  line-height: 1;
  user-select: none;
  color: var(--y-text-primary, #374151);
}

.y-radio--disabled .y-radio__label {
  color: var(--y-text-disabled, #9ca3af);
}

/* 焦点样式 */
.y-radio__input:focus-visible + .y-radio__inner {
  outline: 2px solid var(--y-primary, #3b82f6);
  outline-offset: 2px;
  border-radius: 50%;
}

/* 悬停效果 */
.y-radio:not(.y-radio--disabled):hover .y-radio__inner {
  border-color: var(--y-primary-hover, #2563eb);
}

.y-radio--checked:not(.y-radio--disabled):hover .y-radio__inner {
  border-color: var(--y-primary-active, #1d4ed8);
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .y-radio {
    color: var(--y-text-primary-dark, #f3f4f6);
  }
  
  .y-radio__inner {
    border-color: var(--y-border-dark, #4b5563);
  }
  
  .y-radio:not(.y-radio--disabled):hover .y-radio__inner {
    border-color: var(--y-primary-hover, #60a5fa);
  }
  
  .y-radio--disabled .y-radio__inner {
    border-color: var(--y-border-light-dark, #374151);
    background-color: var(--y-bg-tertiary-dark, #1f2937);
  }
  
  .y-radio--disabled .y-radio__label {
    color: var(--y-text-disabled-dark, #6b7280);
  }
}

/* 动画效果 */
.y-radio__inner {
  transform-origin: center;
}

.y-radio:not(.y-radio--disabled):active .y-radio__inner {
  transform: scale(0.95);
}
</style>