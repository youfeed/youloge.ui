<template>
  <div :class="inputClass">
    <!-- 前缀 -->
    <div v-if="prefix" class="y-input__prefix">
      {{ prefix }}
    </div>
    
    <!-- 输入框 -->
    <input
      ref="inputRef"
      v-model="inputValue"
      :class="inputElementClass"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="isReadonly"
      :maxlength="maxlength"
      :minlength="minlength"
      :inputmode="inputMode"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @change="handleChange"
    />
    
    <!-- 清空按钮 -->
    <button
      v-if="clearable && inputValue && !isDisabled && !isReadonly"
      type="button"
      class="y-input__clear"
      @click="handleClear"
      @mousedown.prevent
    >
      <svg class="y-input__clear-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>
    
    <!-- 后缀 -->
    <div v-if="suffix" class="y-input__suffix">
      {{ suffix }}
    </div>
    
    <!-- 字数统计 -->
    <div v-if="showWordCount" class="y-input__count">
      {{ currentLength }}{{ maxlength ? `/${maxlength}` : '' }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, nextTick } from 'vue'

defineOptions({ name: 'y-input' })

// 使用 defineModel
const inputValue = defineModel({
  type: [String, Number],
  default: ''
})

const props = defineProps({
  // 基础属性
  type: {
    type: String,
    default: 'text',
    validator: (val) => ['text', 'password', 'number', 'email', 'tel', 'url', 'search'].includes(val)
  },
  name: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  
  // 尺寸
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg'].includes(val)
  },
  
  // 状态
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  
  // 功能
  clearable: { type: Boolean, default: false },
  showWordCount: { type: Boolean, default: false },
  
  // 限制
  maxlength: [String, Number],
  minlength: [String, Number],
  
  // 装饰
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  
  // 对齐
  align: {
    type: String,
    default: 'left',
    validator: (val) => ['left', 'center', 'right'].includes(val)
  }
})

const emit = defineEmits(['input', 'change', 'blur', 'focus', 'clear'])

// 注入表单上下文
const formItemContext = inject('formItemContext', null)
const formContext = inject('formContext', null)

// 响应式数据
const inputRef = ref()
const isFocused = ref(false)

// 计算属性
const isDisabled = computed(() => {
  return props.disabled || formContext?.disabled?.value || false
})

const isReadonly = computed(() => {
  return props.readonly || formContext?.readonly?.value || false
})

const currentLength = computed(() => {
  return String(inputValue.value).length
})

const inputMode = computed(() => {
  const modeMap = {
    number: 'numeric',
    email: 'email',
    tel: 'tel',
    url: 'url'
  }
  return modeMap[props.type] || 'text'
})

const inputClass = computed(() => {
  const classes = [
    'y-input',
    'y-input--' + props.size,
    'y-input--' + props.align
  ]
  
  // 状态
  if (isDisabled.value) classes.push('y-input--disabled')
  if (isReadonly.value) classes.push('y-input--readonly')
  if (isFocused.value) classes.push('y-input--focused')
  
  // 错误状态
  if (formItemContext?.hasError?.value) {
    classes.push('y-input--error')
  }
  
  // 功能
  if (props.clearable) classes.push('y-input--clearable')
  if (props.showWordCount) classes.push('y-input--countable')
  if (props.prefix) classes.push('y-input--prefix')
  if (props.suffix) classes.push('y-input--suffix')
  
  return classes.join(' ')
})

const inputElementClass = computed(() => {
  const classes = ['y-input__inner']
  
  if (props.align !== 'left') {
    classes.push('y-input__inner--' + props.align)
  }
  
  return classes.join(' ')
})

// 事件处理
const handleInput = (e) => {
  const value = e.target.value
  inputValue.value = value
  emit('input', value)
  
  // 触发表单验证
  if (formItemContext?.validateTrigger === 'change') {
    formItemContext.handleBlur?.()
  }
}

const handleBlur = (e) => {
  isFocused.value = false
  emit('blur', e)
  
  // 触发表单验证
  if (formItemContext?.validateTrigger === 'blur') {
    formItemContext.handleBlur?.()
  }
}

const handleFocus = (e) => {
  isFocused.value = true
  emit('focus', e)
}

const handleChange = (e) => {
  emit('change', e.target.value)
}

const handleClear = () => {
  inputValue.value = ''
  emit('clear')
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// 暴露方法
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select(),
  inputRef
})
</script>

<style scoped>
.y-input {
  display: inline-flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  background-color: var(--y-bg-primary);
  border: 1px solid var(--y-border);
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
  position: relative;
}

.y-input:hover {
  border-color: var(--y-border-dark);
}

.y-input--focused {
  border-color: var(--y-primary);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

.y-input--error {
  border-color: var(--y-error);
}

.y-input--error.y-input--focused {
  box-shadow: 0 0 0 2px rgba(227, 77, 89, 0.1);
}

/* 尺寸变体 */
.y-input--sm {
  height: 28px;
  padding: 0 8px;
  font-size: 12px;
}

.y-input--md {
  height: 32px;
  padding: 0 12px;
  font-size: 14px;
}

.y-input--lg {
  height: 40px;
  padding: 0 16px;
  font-size: 16px;
}

/* 输入框核心 */
.y-input__inner {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--y-text-primary);
  font-family: inherit;
  font-size: inherit;
  line-height: 1.5;
}

.y-input__inner::placeholder {
  color: var(--y-text-placeholder);
}

.y-input__inner--center {
  text-align: center;
}

.y-input__inner--right {
  text-align: right;
}

/* 前缀 */
.y-input__prefix {
  margin-right: 8px;
  color: var(--y-text-secondary);
  font-size: 14px;
  flex-shrink: 0;
}

.y-input--prefix .y-input__inner {
  padding-left: 0;
}

/* 后缀 */
.y-input__suffix {
  margin-left: 8px;
  color: var(--y-text-secondary);
  font-size: 14px;
  flex-shrink: 0;
}

.y-input--suffix .y-input__inner,
.y-input--clearable .y-input__inner,
.y-input--countable .y-input__inner {
  padding-right: 0;
}

/* 清空按钮 */
.y-input__clear {
  margin-left: 8px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--y-text-tertiary);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.y-input__clear:hover {
  color: var(--y-text-secondary);
  background-color: var(--y-bg-tertiary);
}

.y-input__clear-icon {
  width: 14px;
  height: 14px;
}

/* 字数统计 */
.y-input__count {
  margin-left: 8px;
  font-size: 12px;
  color: var(--y-text-tertiary);
  flex-shrink: 0;
  min-width: 30px;
  text-align: right;
}

/* 状态样式 */
.y-input--disabled {
  background-color: var(--y-bg-tertiary);
  border-color: var(--y-border-light);
  cursor: not-allowed;
  color: var(--y-text-disabled);
}

.y-input--disabled .y-input__inner {
  cursor: not-allowed;
}

.y-input--disabled .y-input__inner::placeholder {
  color: var(--y-text-disabled);
}

.y-input--readonly {
  background-color: var(--y-bg-tertiary);
  color: var(--y-text-secondary);
}

.y-input--readonly .y-input__inner {
  cursor: default;
}

/* 无障碍 */
.y-input:focus-within {
  outline: 2px solid var(--y-primary);
  outline-offset: 2px;
}

/* 数字输入框隐藏箭头 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* 密码输入框隐藏眼睛图标 */
input[type="password"]::-webkit-credentials-auto-fill-button {
  display: none;
}

/* 响应式 */
@media (max-width: 768px) {
  .y-input--lg {
    height: 36px;
    font-size: 14px;
  }
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .y-input {
    background-color: var(--y-bg-dark);
  }
  
  .y-input--disabled,
  .y-input--readonly {
    background-color: var(--y-bg-tertiary-dark);
  }
}
</style>