<template>
  <div class="transition-all duration-200" :class="formItemClasses">
    <!-- 标签 + 输入区域容器 -->
    <div :class="labelInputContainerClasses">
      <!-- 表单项标签 -->
      <label 
        v-if="label"
        class="text-sm font-medium text-gray-700 dark:text-gray-300"
        :class="labelClasses"
        :style="labelStyle"
      >
        <span>{{ label }}</span>
        <span v-if="required" class="text-red-500 ml-1">*</span>
      </label>

      <!-- 输入组件容器（插槽：支持 Input、Select 等自定义组件） -->
      <div class="flex-1" :class="inputContainerClasses">
        <slot></slot> <!-- 自定义输入组件（如 input、gh-input 等） -->
        
        <!-- 错误提示（验证失败时显示） -->
        <p v-if="errors[prop]" class="mt-1 text-xs text-red-600 dark:text-red-400">
          {{ errors[prop] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, watch, ref } from 'vue'

// Props 定义
const props = defineProps({
  // 标签文本
  label: {
    type: String,
    default: ''
  },
  // 对应表单 model 的字段名（需与 rules 中的字段一致）
  prop: {
    type: String,
    required: true
  },
  // 是否显示必填星号（优先级高于规则中的 required）
  required: {
    type: Boolean,
    default: false
  },
  // 输入组件额外内边距
  padding: {
    type: [String,Number],
    default: '0',
    validator: val => val >= 0 && val <= 120
  }
})

// 注入表单上下文
const { model, rules, labelPosition, labelWidth, errors, validateField } = inject('formContext')

// 计算表单项整体样式
const formItemClasses = computed(() => {
  return labelPosition === 'top' ? 'flex flex-col' : 'flex items-center'
})

// 计算标签+输入区域容器样式
const labelInputContainerClasses = computed(() => {
  return labelPosition === 'top' ? 'flex flex-col' : 'flex w-full'
})

// 计算标签样式
const labelClasses = computed(() => {
  return labelPosition === 'top' ? 'mb-1' : 'mr-3'
})

// 计算标签内联样式（宽度）
const labelStyle = computed(() => {
  return labelPosition === 'left' ? { width: labelWidth, textAlign: 'right' } : {}
})

// 计算输入组件容器样式（内边距）
const inputContainerClasses = computed(() => {
  const paddingValue = props.padding
  return `p-${paddingValue}`
})

// 监听字段值变化，触发单个字段验证（可选：失焦时验证更友好）
const inputRef = ref(null)
watch(
  () => model[props.prop],
  async (newVal) => {
    // 仅当字段有值或之前有错误时触发验证（避免初始空值触发错误）
    if (newVal !== undefined || errors[props.prop]) {
      await validateField(props.prop)
    }
  },
  { immediate: false }
)

// 暴露输入组件 ref 给父组件（可选）
defineExpose({
  inputRef
})
</script>