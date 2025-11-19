<template>
  <!-- 模板内容完全不变，仅组件名调整 -->
  <div
    class="relative transition-all duration-200"
    :class="tagInputClasses"
    @click="focusInput"
  >
    <div class="flex flex-wrap gap-2 p-1">
      <!-- 标签列表 -->
      <div
        v-for="(tag, index) in currentTags"
        :key="index"
        class="inline-flex items-center px-2.5 py-1 text-sm rounded-md transition-colors duration-150"
        :class="tagClasses"
      >
        <span>{{ tag }}</span>
        <button
          type="button"
          class="ml-1 flex items-center justify-center w-4 h-4 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
        class="flex-1 min-w-[80px] px-2 py-1 text-sm bg-transparent outline-none focus:ring-0"
        :placeholder="placeholder"
        :value="inputValue"
        :disabled="disabled || (maxTags && currentTags.length >= maxTags)"
        :class="{ 'opacity-50': disabled || (maxTags && currentTags.length >= maxTags) }"
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
      class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      @click.stop="clearAllTags"
    >
      ✕
    </button>

    <!-- 底部提示 -->
    <p
      v-if="(maxTags && currentTags.length >= maxTags) || errorMessage"
      class="mt-1 text-xs"
      :class="hintTextClasses"
    >
      {{ errorMessage || `最多添加 ${maxTags} 个标签` }}
    </p>
  </div>
</template>

<script setup>
// 脚本逻辑完全不变，仅组件名关联调整
import { ref, watch, computed, onMounted, inject } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  placeholder: { type: String, default: '输入标签，按回车/逗号添加' },
  maxTags: { type: Number, default: 0 },
  allowDuplicate: { type: Boolean, default: false },
  allowClear: { type: Boolean, default: true },
  separators: { type: Array, default: () => ['Enter', 'Comma', 'Tab'] },
  disabled: { type: Boolean, default: false },
  minInputWidth: { type: String, default: '80px' },
  tagClass: { type: String, default: '' },
  errorMessage: { type: String, default: '' }
})

const emit = defineEmits([
  'update:modelValue',
  'tag-add',
  'tag-remove',
  'clear',
  'change'
])

const inputRef = ref(null)
const inputValue = ref('')
const isFocused = ref(false)
const currentTags = ref([...props.modelValue])

// 表单适配逻辑不变
const formContext = inject('formContext', null)
const prop = inject('formItemProp', '')

// 样式计算逻辑不变
const tagInputClasses = computed(() => {
  const base = 'border rounded-md transition-colors duration-200'
  const borderColor = isFocused.value
    ? 'border-blue-500 dark:border-blue-400'
    : props.errorMessage
      ? 'border-red-500 dark:border-red-400'
      : 'border-gray-300 dark:border-gray-700'
  const bgColor = 'bg-white dark:bg-gray-800'
  const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  return `${base} ${borderColor} ${bgColor} ${disabledClass}`
})

const tagClasses = computed(() => {
  const defaultClass = 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
  return props.tagClass ? `${props.tagClass} ${defaultClass}` : defaultClass
})

const hintTextClasses = computed(() => {
  return props.errorMessage
    ? 'text-red-600 dark:text-red-400'
    : 'text-gray-500 dark:text-gray-400'
})

// 监听与事件处理逻辑不变
watch(
  () => props.modelValue,
  (newVal) => {
    if (Array.isArray(newVal)) currentTags.value = [...newVal]
  },
  { deep: true }
)

watch(
  currentTags,
  (newTags) => {
    emit('update:modelValue', [...newTags])
    emit('change', [...newTags])
    if (formContext && prop) formContext.validateField(prop)
  },
  { deep: true }
)

const handleInput = (e) => {
  inputValue.value = e.target.value.trim()
}

const handleKeydown = (e) => {
  const key = e.key
  const isSeparator = props.separators.includes(key) || (key === ',' && props.separators.includes('Comma'))

  if (isSeparator && inputValue.value) {
    e.preventDefault()
    addTag(inputValue.value)
  }

  if (key === 'Backspace' && !inputValue.value && currentTags.value.length > 0) {
    removeTag(currentTags.value.length - 1)
  }
}

const handleBlur = () => {
  isFocused.value = false
  if (inputValue.value) addTag(inputValue.value)
}

const addTag = (tagText) => {
  if (props.maxTags > 0 && currentTags.value.length >= props.maxTags) return
  if (!props.allowDuplicate && currentTags.value.includes(tagText)) return

  currentTags.value.push(tagText)
  emit('tag-add', tagText)
  inputValue.value = ''
  focusInput()
}

const removeTag = (index) => {
  const removedTag = currentTags.value[index]
  currentTags.value.splice(index, 1)
  emit('tag-remove', removedTag, index)
  focusInput()
}

const clearAllTags = () => {
  currentTags.value = []
  emit('clear')
  focusInput()
}

const focusInput = () => {
  if (!props.disabled && inputRef.value) {
    inputRef.value.focus()
    isFocused.value = true
  }
}

defineExpose({
  focus: focusInput,
  addTag,
  removeTag,
  clearAllTags,
  getTags: () => [...currentTags.value]
})

onMounted(() => {
  if (props.modelValue.length === 0) focusInput()
})
</script>