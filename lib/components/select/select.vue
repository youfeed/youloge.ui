<template>
  <div class="y-select" :class="{ 'y-select--disabled': disabled, 'y-select--error': error }">
    <!-- 选择器触发区（选中值 + 箭头） -->
    <div
      class="y-select__trigger"
      :style="{ width: width }"
      @click="toggleDropdown"
      @keydown.enter="toggleDropdown"
      @keydown.space="toggleDropdown"
      @keydown.esc="closeDropdown"
      tabindex="0"
      :aria-expanded="isDropdownOpen"
      :aria-disabled="disabled"
    >
      <!-- 选中值显示 -->
      <div class="y-select__value">
        <template v-if="isMultiple">
          <!-- 多选：标签组显示 -->
          <div class="y-select__tags" v-if="selectedValues.length > 0">
            <span
              v-for="(value, index) in selectedValues"
              :key="index"
              class="y-select__tag"
            >
              {{ getLabelByValue(value) }}
              <button
                type="button"
                class="y-select__tag-close"
                @click.stop="removeMultipleValue(value)"
              >
                ×
              </button>
            </span>
          </div>
          <span class="y-select__placeholder" v-else>{{ placeholder }}</span>
        </template>
        <template v-else>
          <!-- 单选：文本显示 -->
          <span v-if="selectedValue !== '' && selectedValue !== undefined">{{ getLabelByValue(selectedValue) }}</span>
          <span class="y-select__placeholder" v-else>{{ placeholder }}</span>
        </template>
      </div>

      <!-- 下拉箭头（旋转动画） -->
      <div class="y-select__arrow" :class="{ 'y-select__arrow--rotate': isDropdownOpen }">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 5L8 11L14 5" stroke="#6b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </div>

      <!-- 清空按钮（单选/多选有选中值时显示） -->
      <button
        v-if="allowClear && (selectedValue !== '' || selectedValues.length > 0) && !disabled"
        class="y-select__clear"
        @click.stop="clearSelection"
        aria-label="清空选择"
      >
        ×
      </button>
    </div>

    <!-- 下拉面板（悬浮定位） -->
    <div
      v-if="isDropdownOpen"
      class="y-select__dropdown"
      :style="{ width: width }"
      @click.stop
      @keydown.esc="closeDropdown"
      @keydown.up="handleKeyUp"
      @keydown.down="handleKeyDown"
      @keydown.enter="handleKeyEnter"
    >
      <!-- 搜索框（支持过滤选项） -->
      <div class="y-select__search" v-if="showSearch">
        <input
          type="text"
          class="y-select__search-input"
          v-model="searchKeyword"
          placeholder="搜索选项..."
          @focus="isSearchFocused = true"
          @blur="isSearchFocused = false"
          @input="filterOptions"
        />
      </div>

      <!-- 选项列表 -->
      <div class="y-select__options">
        <!-- 无匹配选项 -->
        <div class="y-select__option--empty" v-if="filteredOptions.length === 0">
          {{ searchKeyword ? '无匹配选项' : '暂无选项' }}
        </div>

        <!-- 选项列表 -->
        <div
          v-for="(option, index) in filteredOptions"
          :key="option.value + index"
          class="y-select__option"
          :class="{
            'y-select__option--selected': isMultiple 
              ? selectedValues.includes(option.value) 
              : selectedValue === option.value,
            'y-select__option--disabled': option.disabled,
            'y-select__option--highlighted': highlightedIndex === index
          }"
          @click.stop="selectOption(option)"
          @mouseenter="highlightedIndex = index"
          :aria-selected="isMultiple ? selectedValues.includes(option.value) : selectedValue === option.value"
        >
          <!-- 自定义选项模板（插槽优先） -->
          <slot name="option" :option="option">
            {{ option.label }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted, inject } from 'vue'

defineOptions({ name: 'y-select' })

// Props 定义：覆盖核心+增强功能
const props = defineProps({
  // 选项列表：[{ label: string, value: any, disabled?: boolean }]
  options: {
    type: Array,
    default: () => [],
    validator: (val) => val.every(item => 'label' in item && 'value' in item)
  },
  // 绑定值（单选字符串/数字，多选数组）
  modelValue: {
    type: [String, Number, Array],
    default: ''
  },
  // 占位提示文本
  placeholder: {
    type: String,
    default: '请选择'
  },
  // 是否支持多选
  multiple: {
    type: Boolean,
    default: false
  },
  // 是否支持搜索过滤
  showSearch: {
    type: Boolean,
    default: false
  },
  // 是否允许清空选择
  allowClear: {
    type: Boolean,
    default: true
  },
  // 选择器宽度（支持数字/字符串单位）
  width: {
    type: [String, Number],
    default: '100%'
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 错误态（由 form-item 传递）
  error: {
    type: Boolean,
    default: false
  },
  // 多选时最大显示标签数（超出显示数量提示）
  maxTagCount: {
    type: Number,
    default: 0 // 0 表示全部显示
  },
  // 搜索匹配方式：label/value/all（默认匹配标签）
  searchMatch: {
    type: String,
    default: 'label',
    validator: val => ['label', 'value', 'all'].includes(val)
  }
})

// 事件派发
const emit = defineEmits([
  'update:modelValue',
  'change',
  'clear',
  'dropdown-open',
  'dropdown-close'
])

// 表单适配：与 y-form/y-form-item 联动
const formItemContext = inject('yFormItemContext', { disabled: false })
const formContext = inject('formContext', null)
const prop = inject('formItemProp', '')

// 状态管理
const isDropdownOpen = ref(false) // 下拉面板是否展开
const selectedValue = ref('') // 单选选中值
const selectedValues = ref([]) // 多选选中值
const searchKeyword = ref('') // 搜索关键词
const filteredOptions = ref([]) // 过滤后的选项
const highlightedIndex = ref(-1) // 高亮选项索引
const isSearchFocused = ref(false) // 搜索框是否聚焦

// 格式化单位（数字转 px，字符串直接使用）
const formatUnit = (val) => {
  if (typeof val === 'number') return `${val}px`
  return val
}

// 初始化：同步绑定值到组件状态
const initSelectedValues = () => {
  if (props.multiple) {
    selectedValues.value = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  } else {
    selectedValue.value = props.modelValue || ''
  }
  // 初始化过滤选项
  filteredOptions.value = [...props.options]
}

// 根据值获取标签文本
const getLabelByValue = (value) => {
  const option = props.options.find(item => item.value === value)
  return option ? option.label : ''
}

// 切换下拉面板显示/隐藏
const toggleDropdown = () => {
  if (props.disabled || formItemContext.disabled) return
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    emit('dropdown-open')
    highlightedIndex.value = -1
    // 搜索框自动聚焦
    if (props.showSearch) {
      setTimeout(() => {
        const searchInput = document.querySelector('.y-select__search-input')
        searchInput?.focus()
      }, 100)
    }
  } else {
    emit('dropdown-close')
    // 清空搜索关键词
    searchKeyword.value = ''
    filteredOptions.value = [...props.options]
  }
}

// 关闭下拉面板
const closeDropdown = () => {
  if (isDropdownOpen.value) {
    isDropdownOpen.value = false
    emit('dropdown-close')
    searchKeyword.value = ''
    filteredOptions.value = [...props.options]
  }
}

// 选中选项
const selectOption = (option) => {
  if (option.disabled || props.disabled || formItemContext.disabled) return

  if (props.multiple) {
    // 多选：添加/移除选中值
    const index = selectedValues.value.indexOf(option.value)
    if (index === -1) {
      selectedValues.value.push(option.value)
    } else {
      selectedValues.value.splice(index, 1)
    }
    // 同步绑定值
    emit('update:modelValue', [...selectedValues.value])
    emit('change', [...selectedValues.value])
  } else {
    // 单选：设置选中值并关闭下拉
    selectedValue.value = option.value
    emit('update:modelValue', option.value)
    emit('change', option.value)
    closeDropdown()
  }

  // 触发表单验证
  if (formContext && prop) {
    formContext.validateField(prop)
  }
}

// 移除多选值
const removeMultipleValue = (value) => {
  if (props.disabled || formItemContext.disabled) return
  const index = selectedValues.value.indexOf(value)
  if (index !== -1) {
    selectedValues.value.splice(index, 1)
    emit('update:modelValue', [...selectedValues.value])
    emit('change', [...selectedValues.value])
    // 触发表单验证
    if (formContext && prop) {
      formContext.validateField(prop)
    }
  }
}

// 清空选择
const clearSelection = () => {
  if (props.disabled || formItemContext.disabled) return
  if (props.multiple) {
    selectedValues.value = []
    emit('update:modelValue', [])
  } else {
    selectedValue.value = ''
    emit('update:modelValue', '')
  }
  emit('change', props.multiple ? [] : '')
  emit('clear')
  // 触发表单验证
  if (formContext && prop) {
    formContext.validateField(prop)
  }
}

// 搜索过滤选项
const filterOptions = () => {
  if (!props.showSearch || !searchKeyword.value) {
    filteredOptions.value = [...props.options]
    return
  }

  const keyword = searchKeyword.value.toLowerCase()
  filteredOptions.value = props.options.filter(option => {
    if (props.searchMatch === 'label') {
      return option.label.toLowerCase().includes(keyword)
    } else if (props.searchMatch === 'value') {
      return String(option.value).toLowerCase().includes(keyword)
    } else {
      return option.label.toLowerCase().includes(keyword) || String(option.value).toLowerCase().includes(keyword)
    }
  })
}

// 键盘导航：上键
const handleKeyUp = (e) => {
  e.preventDefault()
  if (highlightedIndex.value <= 0) {
    highlightedIndex.value = filteredOptions.length - 1
  } else {
    highlightedIndex.value--
  }
  scrollToHighlightedOption()
}

// 键盘导航：下键
const handleKeyDown = (e) => {
  e.preventDefault()
  if (highlightedIndex.value >= filteredOptions.length - 1) {
    highlightedIndex.value = 0
  } else {
    highlightedIndex.value++
  }
  scrollToHighlightedOption()
}

// 键盘导航：回车选中
const handleKeyEnter = (e) => {
  e.preventDefault()
  if (highlightedIndex.value >= 0 && filteredOptions.length > 0) {
    const option = filteredOptions[highlightedIndex.value]
    selectOption(option)
  }
}

// 滚动到高亮选项
const scrollToHighlightedOption = () => {
  const optionsContainer = document.querySelector('.y-select__options')
  const highlightedOption = optionsContainer?.querySelector(`.y-select__option--highlighted`)
  if (highlightedOption) {
    const containerRect = optionsContainer.getBoundingClientRect()
    const optionRect = highlightedOption.getBoundingClientRect()
    if (optionRect.top < containerRect.top) {
      optionsContainer.scrollTop -= containerRect.top - optionRect.top
    } else if (optionRect.bottom > containerRect.bottom) {
      optionsContainer.scrollTop += optionRect.bottom - containerRect.bottom
    }
  }
}

// 监听绑定值变化，同步组件状态
watch(
  () => props.modelValue,
  () => {
    initSelectedValues()
  },
  { deep: true, immediate: true }
)

// 监听选项变化，同步过滤结果
watch(
  () => props.options,
  () => {
    filteredOptions.value = [...props.options]
    // 移除已被删除的选项的选中状态
    if (props.multiple) {
      selectedValues.value = selectedValues.value.filter(value => 
        props.options.some(option => option.value === value)
      )
    } else if (selectedValue.value && !props.options.some(option => option.value === selectedValue.value)) {
      selectedValue.value = ''
    }
  },
  { deep: true }
)

// 点击外部关闭下拉面板
const handleClickOutside = (e) => {
  const selectEl = document.querySelector('.y-select')
  if (selectEl && !selectEl.contains(e.target)) {
    closeDropdown()
  }
}

// 组件挂载/卸载时绑定/解绑事件
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 暴露 API 给父组件
defineExpose({
  openDropdown: () => {
    if (!props.disabled && formItemContext.disabled) toggleDropdown()
  },
  closeDropdown,
  clearSelection,
  getSelectedValues: () => props.multiple ? [...selectedValues.value] : selectedValue.value
})
</script>

<style lang="less" scoped>
// 选择器容器：基础样式
.y-select {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  font-size: 14px;
  color: #1f2937;

  // 禁用态
  &--disabled {
    .y-select__trigger {
      background-color: #f9fafb;
      border-color: #f3f4f6;
      cursor: not-allowed;

      .y-select__placeholder,
      .y-select__value,
      .y-select__arrow svg path {
        color: #9ca3af;
        stroke: #9ca3af;
      }

      .y-select__clear {
        color: #d1d5db;
        cursor: not-allowed;
      }
    }
  }

  // 错误态
  &--error {
    .y-select__trigger {
      border-color: #cf222e;

      &:focus-within {
        box-shadow: 0 0 0 2px rgba(207, 34, 46, 0.1);
      }
    }
  }

  // 触发区：核心交互区域
  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 8px 12px;
    padding-right: 36px; // 预留箭头和清空按钮空间
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    background-color: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease;
    box-sizing: border-box;
    overflow: hidden;

    &:focus-within {
      outline: none;
      border-color: #0969da;
      box-shadow: 0 0 0 2px rgba(9, 105, 218, 0.1);
    }

    &:hover:not(.y-select--disabled) {
      border-color: #d1d5db;
    }
  }

  // 选中值容器
  &__value {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  // 多选标签组
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    width: 100%;
  }

  // 多选标签
  &__tag {
    display: inline-flex;
    align-items: center;
    padding: 2px 6px;
    font-size: 13px;
    color: #4b5563;
    background-color: #f3f4f6;
    border-radius: 3px;
    border: 1px solid #e5e7eb;
  }

  // 多选标签关闭按钮
  &__tag-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    margin-left: 4px;
    padding: 0;
    border: none;
    background: transparent;
    color: #9ca3af;
    font-size: 10px;
    cursor: pointer;
    transition: color 0.15s ease;

    &:hover {
      color: #cf222e;
    }
  }

  // 占位提示文本
  &__placeholder {
    color: #9ca3af;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  // 下拉箭头
  &__arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.2s ease;

    &--rotate {
      transform: translateY(-50%) rotate(180deg);
    }
  }

  // 清空按钮
  &__clear {
    position: absolute;
    right: 28px;
    top: 50%;
    transform: translateY(-50%);
    padding: 2px;
    border: none;
    background: transparent;
    color: #9ca3af;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #cf222e;
    }
  }

  // 下拉面板
  &__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    margin-top: 4px;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
    max-height: 250px;
    overflow-y: auto;
  }

  // 搜索框容器
  &__search {
    padding: 8px;
    border-bottom: 1px solid #f3f4f6;
  }

  // 搜索输入框
  &__search-input {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid #e5e7eb;
    border-radius: 3px;
    font-size: 13px;
    color: #1f2937;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #0969da;
      box-shadow: 0 0 0 2px rgba(9, 105, 218, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
      font-size: 12px;
    }
  }

  // 选项列表容器
  &__options {
    max-height: 200px;
    overflow-y: auto;
  }

  // 选项项
  &__option {
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.15s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover:not(&--disabled):not(&--selected) {
      background-color: #f3f4f6;
    }

    // 选中态
    &--selected {
      background-color: #eff6ff;
      color: #0969da;
    }

    // 禁用态
    &--disabled {
      color: #9ca3af;
      cursor: not-allowed;
      background-color: transparent !important;
    }

    // 高亮态（键盘导航）
    &--highlighted:not(&--disabled) {
      background-color: #f3f4f6;
    }
  }

  // 无选项提示
  &__option--empty {
    padding: 12px;
    color: #6b7280;
    text-align: center;
    font-size: 13px;
  }

  // 响应式适配：小屏幕
  @media (max-width: 575px) {
    &__trigger {
      padding: 6px 10px;
      padding-right: 32px;
    }

    &__tag {
      padding: 1px 4px;
      font-size: 12px;
    }

    &__dropdown {
      max-height: 200px;
    }

    &__option {
      padding: 6px 10px;
      font-size: 13px;
    }

    &__search-input {
      padding: 4px 6px;
      font-size: 12px;
    }
  }
}
</style>