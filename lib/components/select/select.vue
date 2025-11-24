<template>
  <div class="y-select" :class="selectClass" ref="selectRef">
    <!-- 选择框 -->
    <div class="y-select__trigger" @click="toggleDropdown">
      <!-- 标签显示区域 -->
      <div class="y-select__display">
        <!-- 多选模式：显示标签 -->
        <div v-if="multiple" class="y-select__tags">
          <span v-for="(item, index) in selectedItems" :key="index" class="y-select__tag">
            {{ getOptionLabel(item) }}
            <span v-if="!disabled" class="y-select__tag-close" @click.stop="removeTag(item)">×</span>
          </span>
          
          <!-- 输入区域（多选时可输入） -->
          <input
            v-if="filterable"
            ref="inputRef"
            v-model="query"
            class="y-select__input"
            placeholder="回车确认输入"
            @input="handleInput"
            @keydown="handleKeydown"
            @focus="handleInputFocus"
          />
        </div>
        
        <!-- 单选模式 -->
        <div v-else class="y-select__single">
          <!-- 显示选中值或占位符 -->
          <span v-if="selectedItems.length > 0" class="y-select__value">
            {{ getOptionLabel(selectedItems[0]) }}
          </span>
          <span v-else class="y-select__placeholder">
            {{ placeholder }}
          </span>
          
          <!-- 输入区域（单选时可输入） -->
          <input
            v-if="filterable"
            ref="inputRef"
            v-model="query"
            class="y-select__input"
            :placeholder="placeholder"
            @input="handleInput"
            @focus="handleInputFocus"
          />
        </div>
      </div>
      
      <!-- 操作图标区域 -->
      <div class="y-select__actions">
        <span v-if="clearable && selectedItems.length > 0" class="y-select__clear" @click.stop="handleClear">
          ×
        </span>
        <span class="y-select__arrow" :class="{ 'y-select__arrow--open': showDropdown }">▼</span>
      </div>
    </div>
    
    <!-- 下拉区域 -->
    <div v-show="showDropdown" class="y-select__dropdown">
      <!-- 过滤输入区域 -->
      <div v-if="filterable" class="y-select__filter">
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          class="y-select__filter-input"
          :placeholder="searchPlaceholder"
          @input="handleSearch"
        />
      </div>
      
      <!-- 选项区域 -->
      <div class="y-select__options">
        <div
          v-for="option in filteredOptions"
          :key="getOptionValue(option)"
          class="y-select__option"
          :class="getOptionClass(option)"
          @click="handleOptionClick(option)"
        >
          <!-- 多选复选框 -->
          <span v-if="multiple" class="y-select__checkbox">
            <input
              type="checkbox"
              :checked="isSelected(option)"
              readonly
              class="y-select__checkbox-input"
            />
            <span class="y-select__checkbox-inner"></span>
          </span>
          
          <!-- 选项内容 -->
          <span class="y-select__option-label">
            {{ getOptionLabel(option) }}
          </span>
        </div>
        
        <!-- 无数据提示 -->
        <div v-if="filteredOptions.length === 0" class="y-select__empty">
          {{ emptyText }}
        </div>
      </div>
      
      <!-- 自定义创建区域 -->
      <div v-if="allowCreate && query && !isExistingOption" class="y-select__create" @click="createOption">
        + 创建 "{{ query }}"
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

defineOptions({ name: 'y-select' })

// 双向绑定
const modelValue = defineModel({
  type: [String, Number, Array, Object],
  default: null
})

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  multiple: Boolean,
  filterable: Boolean,
  allowCreate: Boolean,
  placeholder: {
    type: String,
    default: '请选择'
  },
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  },
  emptyText: {
    type: String,
    default: '无匹配数据'
  },
  max: {
    type: Number,
    default: 1
  },
  min: {
    type: Number,
    default: 1
  },
  clearable: {
    type: Boolean,
    default: true
  },
  disabled: Boolean,
  valueKey: {
    type: String,
    default: 'value'
  },
  labelKey: {
    type: String,
    default: 'label'
  }
})

const emit = defineEmits(['change', 'create', 'search'])

// 响应式数据
const selectRef = ref(null)
const inputRef = ref(null)
const searchInputRef = ref(null)
const showDropdown = ref(false)
const query = ref('')
const searchQuery = ref('')

// 计算属性
const selectClass = computed(() => [
  'y-select',
  {
    'y-select--open': showDropdown.value,
    'y-select--disabled': props.disabled,
    'y-select--multiple': props.multiple,
    'y-select--filterable': props.filterable
  }
])

// 工具函数
const getOptionValue = (option) => {
  return typeof option === 'object' ? option[props.valueKey] : option
}

const getOptionLabel = (option) => {
  if (typeof option === 'object') {
    return option[props.labelKey] || String(getOptionValue(option))
  }
  return String(option)
}

// 选中的选项
const selectedItems = computed(() => {
  if (!modelValue.value) return []
  if (props.multiple) {
    return Array.isArray(modelValue.value) ? modelValue.value : []
  }
  return [modelValue.value]
})

// 过滤后的选项
const filteredOptions = computed(() => {
  let options = props.options.map((option, index) => ({
    ...(typeof option === 'object' ? option : { 
      [props.valueKey]: option, 
      [props.labelKey]: option 
    }),
    index
  }))
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    options = options.filter(option => 
      getOptionLabel(option).toLowerCase().includes(query)
    )
  }
  
  return options
})

// 检查是否已存在相同选项
const isExistingOption = computed(() => {
  return props.options.some(option => 
    getOptionLabel(option).toLowerCase() === query.value.toLowerCase()
  )
})

// 检查选项是否选中
const isSelected = (option) => {
  const value = getOptionValue(option)
  if (props.multiple) {
    return selectedItems.value.some(item => getOptionValue(item) === value)
  }
  return getOptionValue(selectedItems.value[0]) === value
}

// 选项类名
const getOptionClass = (option) => ({
  'y-select__option--selected': isSelected(option),
  'y-select__option--disabled': option.disabled
})

// 事件处理
const toggleDropdown = () => {
  if (props.disabled) return
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    nextTick(() => {
      if (props.filterable) {
        searchInputRef.value?.focus()
      }
    })
  }
}

const handleInputFocus = () => {
  if (!showDropdown.value) {
    showDropdown.value = true
  }
}

const handleInput = () => {
  if (!showDropdown.value) {
    showDropdown.value = true
  }
}

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const handleOptionClick = (option) => {
  if (option.disabled || props.disabled) return
  
  const value = getOptionValue(option)
  
  if (props.multiple) {
    // 多选逻辑
    const currentValues = selectedItems.value.map(getOptionValue)
    const index = currentValues.indexOf(value)
    
    if (index > -1) {
      // 取消选择
      if (selectedItems.value.length > (props.min || 0)) {
        const newValues = [...selectedItems.value]
        newValues.splice(index, 1)
        modelValue.value = newValues
      }
    } else {
      // 添加选择
      if (!props.max || selectedItems.value.length < props.max) {
        modelValue.value = [...selectedItems.value, option]
      }
    }
  } else {
    // 单选逻辑
    modelValue.value = option
    showDropdown.value = false
    query.value = ''
    searchQuery.value = ''
  }
  
  emit('change', modelValue.value)
}

const removeTag = (item) => {
  if (props.disabled) return
  const value = getOptionValue(item)
  const currentValues = selectedItems.value.map(getOptionValue)
  const index = currentValues.indexOf(value)
  
  if (index > -1 && selectedItems.value.length > (props.min || 0)) {
    const newValues = [...selectedItems.value]
    newValues.splice(index, 1)
    modelValue.value = newValues
    emit('change', modelValue.value)
  }
}

const handleClear = () => {
  if (props.disabled) return
  modelValue.value = props.multiple ? [] : null
  emit('change', modelValue.value)
}

const handleKeydown = (event) => {
  if (event.key === 'Enter' && props.allowCreate && query.value) {
    createOption()
    event.preventDefault()
  } else if (event.key === 'Backspace' && !query.value && selectedItems.value.length > 0) {
    removeTag(selectedItems.value[selectedItems.value.length - 1])
  }
}

const createOption = () => {
  if (!query.value || props.disabled) return
  
  const newOption = {
    [props.valueKey]: query.value,
    [props.labelKey]: query.value
  }
  
  if (props.multiple) {
    if (!props.max || selectedItems.value.length < props.max) {
      modelValue.value = [...selectedItems.value, newOption]
    }
  } else {
    modelValue.value = newOption
    showDropdown.value = false
  }
  
  emit('create', newOption)
  emit('change', modelValue.value)
  query.value = ''
  searchQuery.value = ''
}

// 点击外部关闭
const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    showDropdown.value = false
    query.value = ''
    searchQuery.value = ''
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.y-select {
  position: relative;
  display: inline-block;
  width: 100%;
  font-size: 14px;
}

/* 触发区域 */
.y-select__trigger {
  display: flex;
  align-items: center;
  padding: 4px 6px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 20px;
}

.y-select__trigger:hover:not(.y-select--disabled) {
  border-color: #c0c4cc;
}

.y-select--open .y-select__trigger {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.y-select--disabled .y-select__trigger {
  background: #f5f7fa;
  cursor: not-allowed;
  opacity: 0.6;
}

/* 显示区域 */
.y-select__display {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
}

/* 标签区域 */
.y-select__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  flex: 1;
}

.y-select__tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background: #f0f9ff;
  border: 1px solid #c6e2ff;
  border-radius: 2px;
  font-size: 12px;
  color: #409eff;
}

.y-select__tag-close {
  margin-left: 4px;
  cursor: pointer;
  font-size: 14px;
}

.y-select__tag-close:hover {
  color: #0678ff;
}

/* 单选显示 */
.y-select__single {
  flex: 1;
  display: flex;
  align-items: center;
}

.y-select__value {
  color: #606266;
}

.y-select__placeholder {
  color: #c0c4cc;
}

/* 输入区域 */
.y-select__input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  min-width: 60px;
  color: #606266;
}

.y-select__input::placeholder {
  color: #c0c4cc;
}

/* 操作区域 */
.y-select__actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
}

.y-select__clear {
  cursor: pointer;
  color: #c0c4cc;
  padding: 2px;
  font-size: 16px;
}

.y-select__clear:hover {
  color: #909399;
}

.y-select__arrow {
  transition: transform 0.2s;
  color: #c0c4cc;
  font-size: 12px;
}

.y-select__arrow--open {
  transform: rotate(180deg);
}

/* 下拉区域 */
.y-select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  z-index: 1000;
  max-height: 200px;
  overflow: hidden;
}

/* 过滤区域 */
.y-select__filter {
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.y-select__filter-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  outline: none;
}

.y-select__filter-input:focus {
  border-color: #409eff;
}

/* 选项区域 */
.y-select__options {
  max-height: 150px;
  overflow-y: auto;
}

.y-select__option {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.y-select__option:hover:not(.y-select__option--disabled) {
  background: #f5f7fa;
}

.y-select__option--selected {
  background: #f0f9ff;
  color: #409eff;
}

.y-select__option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 复选框 */
.y-select__checkbox {
  position: relative;
  margin-right: 8px;
}

.y-select__checkbox-input {
  position: absolute;
  opacity: 0;
}

.y-select__checkbox-inner {
  display: block;
  width: 14px;
  height: 14px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  position: relative;
}

.y-select__option--selected .y-select__checkbox-inner {
  background: #409eff;
  border-color: #409eff;
}

.y-select__option--selected .y-select__checkbox-inner::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.y-select__option-label {
  flex: 1;
}

/* 空状态 */
.y-select__empty {
  padding: 16px;
  text-align: center;
  color: #909399;
}

/* 创建选项 */
.y-select__create {
  padding: 8px 12px;
  border-top: 1px solid #f0f0f0;
  cursor: pointer;
  color: #409eff;
}

.y-select__create:hover {
  background: #f5f7fa;
}
</style>