<template>
  <label class="y-radio" :class="radioClass">
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="isDisabled"
      @change="handleChange"
      class="y-radio__input"
    />
    <span class="y-radio__inner"></span>
    <span class="y-radio__label" v-if="$slots.default || label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>
import { computed, inject } from 'vue'

defineOptions({ name: 'y-radio' })

const formContext = inject('formContext', null)
const groupContext = inject('radioGroupContext', null)

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
  disabled: Boolean
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
  return props.disabled || groupContext?.disabled || formContext?.disabled
})

const radioClass = computed(() => [
  'y-radio',
  {
    'y-radio--checked': isChecked.value,
    'y-radio--disabled': isDisabled.value
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

<style>
.y-radio {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-right: 16px;
  font-size: 14px;
  color: var(--neutral-700, #374151);
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
  border: 2px solid var(--neutral-300, #d1d5db);
  border-radius: 50%;
  margin-right: 8px;
  transition: all 0.2s;
}

.y-radio--checked .y-radio__inner {
  border-color: var(--primary, #3b82f6);
  background-color: var(--primary, #3b82f6);
}

.y-radio--checked .y-radio__inner::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: var(--white, #ffffff);
  border-radius: 50%;
}

.y-radio--disabled {
  cursor: not-allowed;
  color: var(--neutral-400, #9ca3af);
}

.y-radio--disabled .y-radio__inner {
  border-color: var(--neutral-300, #d1d5db);
  background-color: var(--neutral-100, #f3f4f6);
}

.y-radio--disabled.y-radio--checked .y-radio__inner {
  background-color: var(--neutral-300, #d1d5db);
}

.y-radio__label {
  line-height: 1;
  user-select: none;
}

.y-radio__input:focus-visible + .y-radio__inner {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
</style>
