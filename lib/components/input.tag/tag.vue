<template>
  <div :class="inputTagClass" @click="focusInput">
    <!-- 标签容器 -->
    <div class="y-input-tag__container">
      <!-- 已添加的标签 -->
      <div
        v-for="(tag, index) in tags"
        :key="index"
        class="y-input-tag__tag"
        :class="tagClass"
      >
        <span class="y-input-tag__tag-text">{{ tag }}</span>
        <button
          type="button"
          class="y-input-tag__tag-close"
          @click.stop="removeTag(index)"
          :disabled="isDisabled"
        >
          <svg class="y-input-tag__tag-close-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <!-- 输入框 -->
      <input
        ref="inputRef"
        v-model="inputValue"
        :class="inputClass"
        :placeholder="placeholder"
        :disabled="isDisabled"
        :maxlength="maxlength"
        @input="handleInput"
        @keydown="handleKeydown"
        @blur="handleBlur"
        @focus="handleFocus"
      />
    </div>

    <!-- 清空按钮 -->
    <button
      v-if="allowClear && tags.length > 0 && !isDisabled"
      type="button"
      class="y-input-tag__clear"
      @click.stop="clearAll"
    >
      <svg class="y-input-tag__clear-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>

    <!-- 提示信息 -->
    <div v-if="showHint" class="y-input-tag__hint">
      {{ hintMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, nextTick } from 'vue'

defineOptions({ name: 'y-input-tag' })

// 使用 defineModel
const tags = defineModel({
  type: Array,
  default: () => []
})

const props = defineProps({
  // 基础配置
  placeholder: { type: String, default: '输入标签，按回车添加' },
  maxlength: { type: [String, Number], default: 50 },
  
  // 功能控制
  maxTags: { type: Number, default: 0 }, // 0为无限制
  allowDuplicate: { type: Boolean, default: false },
  allowClear: { type: Boolean, default: true },
  
  // 分隔符
  separators: {
    type: Array,
    default: () => ['Enter', ',', ' ']
  },
  
  // 状态
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  
  // 自定义
  tagClass: { type: String, default: '' },
  errorMessage: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg'].includes(val)
  }
})

const emit = defineEmits(['tag-add', 'tag-remove', 'clear', 'change', 'focus', 'blur'])

// 注入表单上下文
const formItemContext = inject('formItemContext', null)

// 响应式数据
const inputRef = ref()
const inputValue = ref('')
const isFocused = ref(false)

// 计算属性
const isDisabled = computed(() => {
  return props.disabled || formItemContext?.disabled?.value || false
})

const isReadonly = computed(() => {
  return props.readonly || formItemContext?.readonly?.value || false
})

const canAddTag = computed(() => {
  if (props.maxTags === 0) return true
  return tags.value.length < props.maxTags
})

const showHint = computed(() => {
  return props.errorMessage || (!canAddTag.value && props.maxTags > 0)
})

const hintMessage = computed(() => {
  if (props.errorMessage) return props.errorMessage
  return `最多添加 ${props.maxTags} 个标签`
})

// 样式计算
const inputTagClass = computed(() => {
  const classes = [
    'y-input-tag',
    'y-input-tag--' + props.size,
    'w-full'
  ]
  
  if (isDisabled.value) classes.push('y-input-tag--disabled')
  if (isReadonly.value) classes.push('y-input-tag--readonly')
  if (isFocused.value) classes.push('y-input-tag--focused')
  if (formItemContext?.hasError?.value) classes.push('y-input-tag--error')
  
  return classes.join(' ')
})

const tagClass = computed(() => {
  const classes = ['y-input-tag__tag']
  if (props.tagClass) classes.push(props.tagClass)
  return classes.join(' ')
})

const inputClass = computed(() => {
  return [
    'y-input-tag__input',
    'bg-transparent',
    'border-none',
    'outline-none',
    'flex-1',
    'min-w-0'
  ].join(' ')
})

// 事件处理
const handleInput = (e) => {
  inputValue.value = e.target.value.trim()
}

const handleKeydown = (e) => {
  const key = e.key
  const value = inputValue.value.trim()
  
  // 检查是否为分隔符
  const isSeparator = props.separators.includes(key) || 
    (key === 'Enter' && props.separators.includes('Enter')) ||
    (key === ',' && props.separators.includes(',')) ||
    (key === ' ' && props.separators.includes(' '))
  
  if (isSeparator && value) {
    e.preventDefault()
    addTag(value)
    return
  }
  
  // 退格键删除最后一个标签
  if (key === 'Backspace' && !value && tags.value.length > 0) {
    removeTag(tags.value.length - 1)
  }
  
  // Tab键聚焦
  if (key === 'Tab') {
    e.preventDefault()
    if (value) {
      addTag(value)
    }
  }
}

const handleBlur = (e) => {
  isFocused.value = false
  emit('blur', e)
  
  // 失焦时添加标签
  const value = inputValue.value.trim()
  if (value) {
    addTag(value)
  }
  
  // 触发表单验证
  if (formItemContext?.validateTrigger === 'blur') {
    formItemContext.handleBlur?.()
  }
}

const handleFocus = (e) => {
  isFocused.value = true
  emit('focus', e)
}

const addTag = (tag) => {
  if (!canAddTag.value) return
  if (!props.allowDuplicate && tags.value.includes(tag)) return
  
  const newTags = [...tags.value, tag]
  tags.value = newTags
  inputValue.value = ''
  
  emit('tag-add', tag)
  emit('change', newTags)
  
  // 触发表单验证
  if (formItemContext?.validateTrigger === 'change') {
    formItemContext.handleBlur?.()
  }
  
  // 保持输入框聚焦
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const removeTag = (index) => {
  const removedTag = tags.value[index]
  const newTags = tags.value.filter((_, i) => i !== index)
  
  tags.value = newTags
  emit('tag-remove', removedTag, index)
  emit('change', newTags)
  
  // 保持输入框聚焦
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const clearAll = () => {
  tags.value = []
  inputValue.value = ''
  
  emit('clear')
  emit('change', [])
  
  // 保持输入框聚焦
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const focusInput = () => {
  if (!isDisabled.value && !isReadonly.value) {
    inputRef.value?.focus()
  }
}

// 暴露方法
defineExpose({
  focus: focusInput,
  blur: () => inputRef.value?.blur(),
  addTag,
  removeTag,
  clearAll,
  getTags: () => tags.value
})
</script>

<style scoped>
.y-input-tag {
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}

/* 容器样式 */
.y-input-tag__container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 6px 8px;
  border: 1px solid var(--y-border);
  border-radius: 4px;
  background-color: var(--y-bg-primary);
  gap: 6px;
  min-height: 32px;
  transition: all 0.2s ease-in-out;
}

/* 尺寸变体 */
.y-input-tag--sm .y-input-tag__container {
  padding: 4px 6px;
  min-height: 28px;
  gap: 4px;
}

.y-input-tag--lg .y-input-tag__container {
  padding: 8px 10px;
  min-height: 40px;
  gap: 8px;
}

/* 状态样式 */
.y-input-tag--focused .y-input-tag__container {
  border-color: var(--y-primary);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

.y-input-tag--error .y-input-tag__container {
  border-color: var(--y-error);
  box-shadow: 0 0 0 2px rgba(227, 77, 89, 0.1);
}

.y-input-tag--disabled .y-input-tag__container,
.y-input-tag--readonly .y-input-tag__container {
  background-color: var(--y-bg-tertiary);
  border-color: var(--y-border-light);
  color: var(--y-text-disabled);
  cursor: not-allowed;
}

/* 标签样式 */
.y-input-tag__tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background-color: var(--y-bg-tertiary);
  border: 1px solid var(--y-border-light);
  border-radius: 3px;
  color: var(--y-text-primary);
  font-size: 12px;
  line-height: 1.2;
  gap: 4px;
  transition: all 0.15s ease-in-out;
}

.y-input-tag__tag:hover {
  background-color: var(--y-bg-secondary);
  border-color: var(--y-border);
}

/* 标签文本 */
.y-input-tag__tag-text {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 标签关闭按钮 */
.y-input-tag__tag-close {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.15s;
}

.y-input-tag__tag-close-icon {
  width: 12px;
  height: 12px;
  color: var(--y-text-tertiary);
}

.y-input-tag__tag-close:hover .y-input-tag__tag-close-icon {
  color: var(--y-text-secondary);
  background-color: var(--y-bg-secondary);
  border-radius: 50%;
}

/* 输入框样式 */
.y-input-tag__input {
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: var(--y-text-primary);
  background: transparent;
}

.y-input-tag__input::placeholder {
  color: var(--y-text-placeholder);
}

/* 清空按钮 */
.y-input-tag__clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.15s;
  color: var(--y-text-tertiary);
}

.y-input-tag__clear:hover {
  color: var(--y-text-secondary);
  background-color: var(--y-bg-secondary);
}

.y-input-tag__clear-icon {
  width: 14px;
  height: 14px;
}

/* 提示信息 */
.y-input-tag__hint {
  font-size: 12px;
  line-height: 1.4;
  color: var(--y-text-tertiary);
  margin-top: 4px;
  padding: 0;
  transition: all 0.2s ease-in-out;
}

.y-input-tag--error .y-input-tag__hint {
  color: var(--y-error);
}

/* 动画效果 */
.y-input-tag__tag {
  animation: fadeIn 0.15s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .y-input-tag__container {
    padding: 4px 6px;
    gap: 4px;
  }
  
  .y-input-tag__tag {
    padding: 2px 4px;
    font-size: 11px;
  }
  
  .y-input-tag__tag-text {
    max-width: 80px;
  }
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .y-input-tag__container {
    background-color: var(--y-bg-dark);
    border-color: var(--y-border-dark);
  }
  
  .y-input-tag__tag {
    background-color: var(--y-bg-tertiary-dark);
    border-color: var(--y-border-dark);
  }
}

/* 焦点无障碍 */
.y-input-tag:focus-within {
  outline: 2px solid var(--y-primary);
  outline-offset: 2px;
}
</style>