<template>
  <div :class="groupClass">
    <slot></slot>
  </div>
</template>

<script setup>
import { provide, computed } from 'vue'

defineOptions({ name: 'y-radio-group' })

const modelValue = defineModel({
  type: [String, Number, Boolean],
  default: ''
})

const props = defineProps({
  disabled: Boolean,
  variant: {
    type: String,
    default: 'default',
    validator: val => ['default', 'border', 'button', 'capsule'].includes(val)
  },
  vertical: Boolean,
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg'].includes(val)
  }
})

const emit = defineEmits(['change'])

const groupClass = computed(() => [
  'y-radio-group',
  'inline-flex',
  'items-center',
  'flex-wrap',
  {
    'y-radio-group--default': props.variant === 'default',
    'y-radio-group--border': props.variant === 'border',
    'y-radio-group--button': props.variant === 'button',
    'y-radio-group--capsule': props.variant === 'capsule',
    'y-radio-group--vertical': props.vertical,
    'y-radio-group--sm': props.size === 'sm',
    'y-radio-group--md': props.size === 'md',
    'y-radio-group--lg': props.size === 'lg'
  }
])

// 提供上下文给子 radio
const groupContext = {
  modelValue,
  disabled: props.disabled,
  variant: props.variant,
  size: props.size,
  vertical: props.vertical,
  change: (value) => {
    modelValue.value = value
    emit('change', value)
  }
}

provide('radioGroupContext', groupContext)
</script>

<style scoped>
.y-radio-group {
  gap: 8px;
  width: fit-content;
}

.y-radio-group--vertical {
  flex-direction: column;
  align-items: flex-start;
}

/* default 变体 */
.y-radio-group--default {
  gap: 8px;
}

/* border 变体 */
.y-radio-group--border {
  gap: 0;
}

.y-radio-group--border .y-radio {
  position: relative;
  padding: 8px 16px;
  border-radius: 8px;
  background: var(--y-white, #ffffff);
  color: var(--y-text-primary, #374151);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
  border: 1px solid var(--y-border, #e5e7eb);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.y-radio-group--border .y-radio:not(:last-child) {
  margin-right: 8px;
}

.y-radio-group--border .y-radio:hover:not(.y-radio--disabled) {
  border-color: var(--y-primary, #3b82f6);
  color: var(--y-primary, #3b82f6);
}

.y-radio-group--border .y-radio--checked {
  border-color: var(--y-primary, #3b82f6);
  background-color: rgba(59, 130, 246, 0.08);
  color: var(--y-primary, #3b82f6);
}

.y-radio-group--border .y-radio--disabled {
  background-color: var(--y-bg-tertiary, #f9fafb);
  border-color: var(--y-border-light, #e5e7eb);
  color: var(--y-text-disabled, #9ca3af);
  cursor: not-allowed;
  box-shadow: none;
}

.y-radio-group--vertical.y-radio-group--border .y-radio {
  width: 100%;
  text-align: center;
  margin-right: 0;
  margin-bottom: 8px;
}

.y-radio-group--vertical.y-radio-group--border .y-radio:last-child {
  margin-bottom: 0;
}

/* button 变体 */
.y-radio-group--button {
  gap: 0;
}

.y-radio-group--button .y-radio {
  margin: 0;
  padding: 8px 16px;
  border-radius: 0;
  border: 1px solid var(--y-border, #e5e7eb);
  background: var(--y-white, #ffffff);
}

.y-radio-group--button .y-radio:first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.y-radio-group--button .y-radio:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.y-radio-group--button .y-radio:not(:first-child) {
  margin-left: -1px;
}

.y-radio-group--button .y-radio:hover:not(.y-radio--disabled):not(.y-radio--checked) {
  border-color: var(--y-primary, #3b82f6);
  color: var(--y-primary, #3b82f6);
}

.y-radio-group--button .y-radio--checked {
  border-color: var(--y-primary, #3b82f6);
  background: var(--y-primary, #3b82f6);
  color: var(--y-white, #ffffff);
}

.y-radio-group--vertical.y-radio-group--button .y-radio {
  width: 100%;
  margin-left: 0;
}

.y-radio-group--vertical.y-radio-group--button .y-radio:not(:first-child) {
  margin-top: -1px;
  margin-left: 0;
}

.y-radio-group--vertical.y-radio-group--button .y-radio:first-child {
  border-radius: 4px 4px 0 0;
}

.y-radio-group--vertical.y-radio-group--button .y-radio:last-child {
  border-radius: 0 0 4px 4px;
}

/* capsule 变体 */
.y-radio-group--capsule {
  gap: 0;
  border-radius: 20px;
  overflow: hidden;
  background: var(--y-bg-secondary, #f3f4f6);
  padding: 4px;
}

.y-radio-group--capsule .y-radio {
  margin: 0;
  padding: 6px 16px;
  border-radius: 16px;
  border: none;
  background: transparent;
}

.y-radio-group--capsule .y-radio--checked {
  background: var(--y-primary, #3b82f6);
  color: var(--y-white, #ffffff);
}

.y-radio-group--vertical.y-radio-group--capsule .y-radio {
  width: 100%;
  margin-left: 0;
}

.y-radio-group--vertical.y-radio-group--capsule .y-radio:not(:first-child) {
  margin-top: 2px;
  margin-left: 0;
}

/* 尺寸变体 */
.y-radio-group--sm .y-radio {
  padding: 6px 12px;
  font-size: 13px;
}

.y-radio-group--lg .y-radio {
  padding: 10px 20px;
  font-size: 15px;
}

.y-radio-group--sm.y-radio-group--capsule {
  padding: 2px;
}

.y-radio-group--sm.y-radio-group--capsule .y-radio {
  padding: 4px 12px;
  border-radius: 12px;
}

.y-radio-group--lg.y-radio-group--capsule {
  padding: 6px;
}

.y-radio-group--lg.y-radio-group--capsule .y-radio {
  padding: 8px 20px;
  border-radius: 18px;
}

/* 隐藏单选框原生输入 */
.y-radio-group--border .y-radio__inner,
.y-radio-group--button .y-radio__inner,
.y-radio-group--capsule .y-radio__inner {
  display: none;
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .y-radio-group--border .y-radio {
    background: var(--y-bg-primary-dark, #1f2937);
    color: var(--y-text-primary-dark, #f3f4f6);
    border-color: var(--y-border-dark, #4b5563);
  }
  
  .y-radio-group--button .y-radio {
    background: var(--y-bg-primary-dark, #1f2937);
    border-color: var(--y-border-dark, #4b5563);
  }
  
  .y-radio-group--capsule {
    background: var(--y-bg-secondary-dark, #374151);
  }
  
  .y-radio-group--border .y-radio--disabled {
    background: var(--y-bg-tertiary-dark, #111827);
    border-color: var(--y-border-light-dark, #374151);
  }
}

/* 焦点样式 */
.y-radio-group:focus-within {
  outline: 2px solid var(--y-primary, #3b82f6);
  outline-offset: 2px;
  border-radius: 4px;
}

.y-radio-group--capsule:focus-within {
  border-radius: 20px;
}
</style>