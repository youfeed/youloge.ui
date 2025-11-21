<template>
  <div
    class="y-input-tag"
    :style="containerStyle"
    @click="focusInput"
  >
    <!-- 标签+输入框容器 -->
    <div class="y-input-tag__content">
      <!-- 标签列表 -->
      <div
        v-for="(tag, index) in currentTags"
        :key="index"
        class="y-input-tag__tag"
        :class="tagCustomClass"
      >
        <span class="y-input-tag__tag-text">{{ tag }}</span>
        <button
          type="button"
          class="y-input-tag__tag-close"
          @click.stop="removeTag(index)"
          :disabled="disabled"
        >
          ×
        </button>
      </div>

      <!-- 输入框 -->
      <input
        ref="inputRef"
        type="text"
        class="y-input-tag__input"
        :style="{ minWidth: minInputWidth }"
        :placeholder="placeholder"
        :value="inputValue"
        :disabled="disabled || (maxTags && currentTags.length >= maxTags)"
        @input="handleInput"
        @keydown="handleKeydown"
        @blur="handleBlur"
        @focus="isFocused = true"
      >
    </div>

    <!-- 清空按钮 -->
    <button
      v-if="allowClear && currentTags.length > 0 && !disabled"
      type="button"
      class="y-input-tag__clear"
      @click.stop="clearAllTags"
    >
      ✕
    </button>

    <!-- 底部提示 -->
    <p
      v-if="(maxTags && currentTags.length >= maxTags) || errorMessage"
      class="y-input-tag__hint"
      :class="hintTextClasses"
    >
      {{ errorMessage || `最多添加 ${maxTags} 个标签` }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, inject } from 'vue'

defineOptions({ name: 'y-input-tag' })

// Props 保留原有核心功能，优化默认值
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  placeholder: { type: String, default: '输入标签，按回车/逗号添加' },
  maxTags: { type: Number, default: 0 }, // 0 表示无限制
  allowDuplicate: { type: Boolean, default: false },
  allowClear: { type: Boolean, default: true },
  separators: { type: Array, default: () => ['Enter', 'Comma', 'Tab'] },
  disabled: { type: Boolean, default: false },
  minInputWidth: { type: String, default: '80px' },
  tagClass: { type: String, default: '' }, // 自定义标签类
  errorMessage: { type: String, default: '' },
  // 新增：标签间距（贴合组件库风格）
  tagGap: { type: [String, Number], default: 8 }
})

const emit = defineEmits([
  'update:modelValue',
  'tag-add',
  'tag-remove',
  'clear',
  'change'
])

// 状态管理
const inputRef = ref(null)
const inputValue = ref('')
const isFocused = ref(false)
const currentTags = ref([...props.modelValue])

// 表单适配：与 y-form/y-form-item 联动
const formContext = inject('formContext', null)
const formItemContext = inject('yFormItemContext', { disabled: false })
const prop = inject('formItemProp', '')

// 格式化单位（统一处理数字/字符串单位）
const formatUnit = (val) => {
  if (typeof val === 'number') return `${val}px`
  return val
}

// 计算容器核心样式（替代 Tailwind 原子类）
const containerStyle = computed(() => {
  return {
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    transition: 'all 0.2s ease',
    marginBottom: '4px' // 与底部提示间距
  }
})

// 标签自定义类（合并默认类与自定义类）
const tagCustomClass = computed(() => {
  return props.tagClass ? `y-input-tag__tag--custom ${props.tagClass}` : ''
})

// 提示文本样式（错误/普通提示区分）
const hintTextClasses = computed(() => {
  return props.errorMessage ? 'y-input-tag__hint--error' : 'y-input-tag__hint--normal'
})

// 监听模型值变化，同步当前标签
watch(
  () => props.modelValue,
  (newVal) => {
    if (Array.isArray(newVal)) currentTags.value = [...newVal]
  },
  { deep: true }
)

// 标签变化时触发事件与表单验证
watch(
  currentTags,
  (newTags) => {
    emit('update:modelValue', [...newTags])
    emit('change', [...newTags])
    // 触发表单单项验证
    if (formContext && prop) formContext.validateField(prop)
  },
  { deep: true }
)

// 输入事件：去空格
const handleInput = (e) => {
  inputValue.value = e.target.value.trim()
}

// 键盘事件：支持分隔符添加标签、退格删除最后一个标签
const handleKeydown = (e) => {
  const key = e.key
  const isSeparator = props.separators.includes(key) || (key === ',' && props.separators.includes('Comma'))

  // 分隔符添加标签
  if (isSeparator && inputValue.value) {
    e.preventDefault()
    addTag(inputValue.value)
  }

  // 退格删除最后一个标签（输入框为空时）
  if (key === 'Backspace' && !inputValue.value && currentTags.value.length > 0) {
    removeTag(currentTags.value.length - 1)
  }

  // 禁止 Tab 键默认行为（避免失焦）
  if (key === 'Tab' && isSeparator) e.preventDefault()
}

// 失焦时添加标签
const handleBlur = () => {
  isFocused.value = false
  if (inputValue.value) addTag(inputValue.value)
}

// 添加标签：校验重复、最大数量
const addTag = (tagText) => {
  if (props.maxTags > 0 && currentTags.value.length >= props.maxTags) return
  if (!props.allowDuplicate && currentTags.value.includes(tagText)) return

  currentTags.value.push(tagText)
  emit('tag-add', tagText)
  inputValue.value = ''
  focusInput() // 保持输入框聚焦
}

// 移除指定索引标签
const removeTag = (index) => {
  const removedTag = currentTags.value[index]
  currentTags.value.splice(index, 1)
  emit('tag-remove', removedTag, index)
  focusInput()
}

// 清空所有标签
const clearAllTags = () => {
  currentTags.value = []
  emit('clear')
  focusInput()
}

// 聚焦输入框
const focusInput = () => {
  if (!props.disabled && !formItemContext.disabled && inputRef.value) {
    inputRef.value.focus()
    isFocused.value = true
  }
}

// 暴露 API
defineExpose({
  focus: focusInput,
  addTag,
  removeTag,
  clearAllTags,
  getTags: () => [...currentTags.value]
})

// 初始化：无标签时自动聚焦
onMounted(() => {
  if (props.modelValue.length === 0) focusInput()
})
</script>

<style lang="less" scoped>
// 容器基础样式：贴合 GitHub 风格
.y-input-tag {
  &__content {
    display: flex;
    flex-wrap: wrap;
    gap: 8px; // 默认标签间距，可通过 tagGap props 覆盖
    padding: 6px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    background-color: #ffffff;
    transition: all 0.2s ease;
    align-items: center;

    // 聚焦态：蓝色边框 + 轻微阴影（与 y-input 一致）
    .y-input-tag__input:focus + & {
      border-color: #0969da;
      box-shadow: 0 0 0 2px rgba(9, 105, 218, 0.1);
    }

    // 错误态：红色边框
    .y-input-tag__hint--error ~ &,
    &:has(.y-input-tag__input:focus:invalid) {
      border-color: #cf222e;
      &:focus-within {
        box-shadow: 0 0 0 2px rgba(207, 34, 46, 0.1);
      }
    }

    // 禁用态：浅灰边框 + 背景
    &:has(.y-input-tag__input:disabled) {
      border-color: #f3f4f6;
      background-color: #f9fafb;
    }
  }

  // 标签样式：GitHub 浅灰风格
  &__tag {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    font-size: 13px;
    color: #4b5563;
    background-color: #f3f4f6;
    border-radius: 3px;
    border: 1px solid #e5e7eb;
    transition: all 0.15s ease;

    // 自定义标签类扩展
    &--custom {
      border: none;
    }

    // 禁用态标签
    &:has(.y-input-tag__tag-close:disabled) {
      background-color: #f9fafb;
      color: #9ca3af;
    }
  }

  // 标签文本
  &__tag-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px; // 限制标签最大宽度，避免溢出
  }

  // 标签关闭按钮
  &__tag-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-left: 6px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: #9ca3af;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover:not(:disabled) {
      color: #cf222e;
      background-color: #fef2f2;
    }

    &:disabled {
      cursor: not-allowed;
      color: #d1d5db;
    }
  }

  // 输入框样式：透明背景，融入容器
  &__input {
    flex: 1;
    min-width: 80px;
    padding: 4px 0;
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: #1f2937;
    transition: all 0.2s ease;

    &::placeholder {
      color: #9ca3af;
      font-size: 13px;
    }

    &:disabled {
      color: #9ca3af;
      cursor: not-allowed;
      &::placeholder {
        color: #d1d5db;
      }
    }

    // 输入框聚焦时，容器同步高亮
    &:focus {
      & + .y-input-tag__content {
        border-color: #0969da;
        box-shadow: 0 0 0 2px rgba(9, 105, 218, 0.1);
      }
    }
  }

  // 清空按钮
  &__clear {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    padding: 2px;
    border: none;
    background: transparent;
    color: #9ca3af;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: #cf222e;
    }
  }

  // 底部提示文本
  &__hint {
    margin: 4px 0 0 0;
    padding: 0;
    font-size: 12px;
    line-height: 1.4;

    // 错误提示
    &--error {
      color: #cf222e;
    }

    // 普通提示
    &--normal {
      color: #6b7280;
    }
  }

  // 响应式适配：小屏幕优化
  @media (max-width: 575px) {
    &__content {
      padding: 4px 8px;
      gap: 6px;
    }

    &__tag {
      padding: 3px 6px;
      font-size: 12px;
    }

    &__input {
      min-width: 60px;
      font-size: 13px;
    }
  }
}
</style>