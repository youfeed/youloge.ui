<template>
  <form 
    class="w-full transition-all duration-200"
    :class="formClasses"
    @submit.prevent="handleSubmit"
  >
    <slot></slot> <!-- 嵌套 GhFormItem + 按钮等 -->
  </form>
</template>

<script setup>
import { ref, provide, computed, unref } from 'vue'

// Props 定义
const props = defineProps({
  // 表单数据模型（双向绑定）
  modelValue: {
    type: Object,
    required: true,
    default: () => ({})
  },
  // 验证规则（{ 字段名: [规则1, 规则2] }）
  rules: {
    type: Object,
    default: () => ({})
  },
  // 标签对齐方式：top（默认，贴合 GitHub 表单）/ left
  labelPosition: {
    type: String,
    default: 'top',
    validator: val => ['top', 'left'].includes(val)
  },
  // 标签宽度（仅 labelPosition="left" 生效）
  labelWidth: {
    type: String,
    default: '100px'
  },
  // 表单项间距（默认 16px，紧凑风格）
  itemGap: {
    type: String,
    default: '16px',
    validator: val => val.endsWith('px') || val.endsWith('rem')
  }
})

// 暴露事件：表单提交（验证通过后触发）、重置
const emit = defineEmits(['submit', 'reset', 'update:modelValue'])

// 表单错误信息存储（{ 字段名: 错误提示 }）
const errors = ref({})
// 表单验证状态（true=验证中，false=未验证/验证完成）
const isValidatePending = ref(false)

// 计算表单基础样式（标签对齐方式 + 间距）
const formClasses = computed(() => {
  const gapValue = props.itemGap.replace(/[a-z]+/, '')
  return `space-y-${gapValue}`
})


// 单个字段验证逻辑
const validateField = async (prop) => {
  const model = unref(props.modelValue)
  const ruleList = props.rules[prop] || []
  if (ruleList.length === 0) return true // 无规则则默认通过

  // 遍历该字段的所有验证规则
  for (const rule of ruleList) {
    const { required, pattern, message, validator } = rule

    // 1. 必填验证
    if (required) {
      if (model[prop] === undefined || model[prop] === null || model[prop] === '') {
        errors.value[prop] = message || '此字段为必填项'
        return false
      }
    }

    // 2. 正则验证
    if (pattern && model[prop]) {
      const reg = new RegExp(pattern)
      if (!reg.test(model[prop])) {
        errors.value[prop] = message || '输入格式不正确'
        return false
      }
    }

    // 3. 自定义验证函数
    if (validator && typeof validator === 'function') {
      const result = await validator(model[prop], model)
      if (result !== true) {
        errors.value[prop] = result || message || '验证失败'
        return false
      }
    }
  }

  // 验证通过，清除错误信息
  delete errors.value[prop]
  return true
}

// 单个字段重置（清除值和错误）
const resetField = (prop) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [prop]: undefined
  })
  delete errors.value[prop]
}

// 表单整体验证（提交时触发）
const validate = async () => {
  isValidatePending.value = true
  const propList = Object.keys(props.rules)
  let isAllPass = true

  // 遍历所有带规则的字段，逐一验证
  for (const prop of propList) {
    const pass = await validateField(prop)
    if (!pass) isAllPass = false
  }

  isValidatePending.value = false
  return isAllPass
}

// 表单提交处理
const handleSubmit = async () => {
  const isPass = await validate()
  if (isPass) {
    emit('submit', props.modelValue) // 验证通过，触发 submit 事件
  }
}

// 表单重置处理（外部可调用）
const handleReset = () => {
  // 重置所有字段值
  const resetModel = Object.keys(props.modelValue).reduce((obj, key) => {
    obj[key] = undefined
    return obj
  }, {})
  emit('update:modelValue', resetModel)

  // 清除所有错误信息
  errors.value = {}
  emit('reset') // 触发 reset 事件
}
// 提供上下文给 GhFormItem（数据模型、规则、错误信息等）
provide('formContext', {
  model: props.modelValue,
  rules: props.rules,
  labelPosition: props.labelPosition,
  labelWidth: props.labelWidth,
  errors,
  validateField: validateField, // 单个字段验证方法
  resetField: resetField       // 单个字段重置方法
})
// 暴露给父组件的方法（手动验证、重置）
defineExpose({
  validate,
  reset: handleReset,
  validateField,
  resetField
})
</script>