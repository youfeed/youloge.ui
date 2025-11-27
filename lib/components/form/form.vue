<template>
  <form 
    :class="formClass"
    @submit.prevent="handleSubmit"
    @reset.prevent="handleReset"
  >
    <slot />
    
    <!-- 验证中遮罩 -->
    <div v-if="isValidatePending" class="y-form__loading">
      <div class="y-loading-spinner"></div>
    </div>
  </form>
</template>

<script setup>
import { ref, provide, computed, nextTick } from 'vue'

defineOptions({ name: 'y-form' })

// 使用 defineModel 简化双向绑定
const modelValue = defineModel({
  type: Object,
  default: () => ({})
})

const props = defineProps({
  // 验证规则
  rules: {
    type: Object,
    default: () => ({})
  },
  // 标签位置
  labelPosition: {
    type: String,
    default: 'top',
    validator: (val) => ['top', 'left', 'right'].includes(val)
  },
  // 标签宽度
  labelWidth: {
    type: [String, Number],
    default: '100px'
  },
  // 表单项间距
  spacing: {
    type: [String, Number],
    default: 16
  },
  // 表单尺寸
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg'].includes(val)
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否只读
  readonly: {
    type: Boolean,
    default: false
  },
  // 自定义类名
  class: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit', 'reset', 'validate'])

// 响应式数据
const errors = ref({})
const isValidatePending = ref(false)
const formFields = ref(new Set()) // 存储表单字段

// 表单类名
const formClass = computed(() => {
  const classes = ['y-form', 'w-full', 'transition-all', 'duration-200']
  
  // 尺寸类
  const sizeClasses = {
    sm: 'y-form--sm',
    md: 'y-form--md', 
    lg: 'y-form--lg'
  }
  classes.push(sizeClasses[props.size] || 'y-form--md')
  
  // 间距类
  const spacingNum = typeof props.spacing === 'number' ? props.spacing : parseInt(props.spacing) || 16
  const spacingClass = `y-form--spacing-${Math.round(spacingNum / 4)}`
  classes.push(spacingClass)
  
  // 状态类
  if (props.disabled) classes.push('y-form--disabled')
  if (props.readonly) classes.push('y-form--readonly')
  if (isValidatePending.value) classes.push('y-form--validating')
  
  // 自定义类名
  if (props.class) classes.push(props.class)
  
  return classes.join(' ')
})

// 注册表单字段
const registerField = (prop) => {
  formFields.value.add(prop)
}

// 注销表单字段
const unregisterField = (prop) => {
  formFields.value.delete(prop)
}

// 单个字段验证
const validateField = async (prop) => {
  const model = modelValue.value
  const ruleList = props.rules[prop] || []
  
  if (ruleList.length === 0) {
    delete errors.value[prop]
    return true
  }

  try {
    for (const rule of ruleList) {
      const { 
        required, 
        pattern, 
        min, 
        max, 
        len, 
        message, 
        validator,
        trigger = 'blur'
      } = rule

      // 必填验证
      if (required && (model[prop] === undefined || model[prop] === null || model[prop] === '')) {
        errors.value[prop] = message || '此字段为必填项'
        return false
      }

      // 如果字段为空且不是必填，跳过其他验证
      if (!model[prop]) continue

      // 长度验证
      if (len !== undefined && String(model[prop]).length !== len) {
        errors.value[prop] = message || `长度必须为${len}个字符`
        return false
      }

      // 最小长度验证
      if (min !== undefined && String(model[prop]).length < min) {
        errors.value[prop] = message || `长度不能少于${min}个字符`
        return false
      }

      // 最大长度验证
      if (max !== undefined && String(model[prop]).length > max) {
        errors.value[prop] = message || `长度不能超过${max}个字符`
        return false
      }

      // 正则验证
      if (pattern && !new RegExp(pattern).test(String(model[prop]))) {
        errors.value[prop] = message || '输入格式不正确'
        return false
      }

      // 自定义验证函数
      if (validator && typeof validator === 'function') {
        const result = await validator(model[prop], model)
        if (result !== true) {
          errors.value[prop] = result || message || '验证失败'
          return false
        }
      }
    }

    delete errors.value[prop]
    return true
  } catch (error) {
    console.error(`验证字段 ${prop} 时出错:`, error)
    errors.value[prop] = '验证过程中出现错误'
    return false
  }
}

// 重置单个字段
const resetField = (prop) => {
  modelValue.value = {
    ...modelValue.value,
    [prop]: undefined
  }
  delete errors.value[prop]
}

// 清除单个字段错误
const clearFieldError = (prop) => {
  delete errors.value[prop]
}

// 表单整体验证
const validate = async (fields = null) => {
  isValidatePending.value = true
  
  try {
    const fieldsToValidate = fields || Array.from(formFields.value)
    let isAllPass = true
    
    for (const prop of fieldsToValidate) {
      const pass = await validateField(prop)
      if (!pass) isAllPass = false
    }
    
    emit('validate', { valid: isAllPass, errors: errors.value })
    return isAllPass
  } finally {
    isValidatePending.value = false
  }
}

// 表单提交
const handleSubmit = async () => {
  if (props.disabled || props.readonly) return
  
  const isPass = await validate()
  if (isPass) {
    emit('submit', modelValue.value)
  }
}

// 表单重置
const handleReset = async () => {
  // 重置数据
  const resetModel = Object.keys(modelValue.value).reduce((obj, key) => {
    obj[key] = undefined
    return obj
  }, {})
  
  modelValue.value = resetModel
  errors.value = {}
  
  await nextTick()
  emit('reset')
}

// 清除所有错误
const clearErrors = () => {
  errors.value = {}
}

// 获取错误信息
const getErrors = () => ({ ...errors.value })

// 检查是否有错误
const hasErrors = computed(() => Object.keys(errors.value).length > 0)

// 提供上下文给子组件
provide('formContext', {
  model: modelValue,
  rules: computed(() => props.rules),
  labelPosition: computed(() => props.labelPosition),
  labelWidth: computed(() => props.labelWidth),
  size: computed(() => props.size),
  disabled: computed(() => props.disabled),
  readonly: computed(() => props.readonly),
  errors: computed(() => errors.value),
  isValidatePending: computed(() => isValidatePending.value),
  registerField,
  unregisterField,
  validateField,
  resetField,
  clearFieldError
})

// 暴露方法
defineExpose({
  validate,
  reset: handleReset,
  validateField,
  resetField,
  clearErrors,
  getErrors,
  hasErrors,
  registerField,
  unregisterField
})
</script>

<style scoped>
.y-form {
  box-sizing: border-box;
}

/* 表单尺寸 */
.y-form--sm {
  font-size: 14px;
}

.y-form--md {
  font-size: 16px;
}

.y-form--lg {
  font-size: 18px;
}

/* 表单间距 */
.y-form--spacing-1 {
  gap: 4px;
}

.y-form--spacing-2 {
  gap: 8px;
}

.y-form--spacing-3 {
  gap: 12px;
}

.y-form--spacing-4 {
  gap: 16px;
}

.y-form--spacing-5 {
  gap: 20px;
}

.y-form--spacing-6 {
  gap: 24px;
}

/* 状态样式 */
.y-form--disabled {
  opacity: 0.6;
  pointer-events: none;
}

.y-form--readonly {
  pointer-events: none;
}

.y-form--validating {
  position: relative;
}

/* 加载遮罩 */
.y-form__loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}

@media (prefers-color-scheme: dark) {
  .y-form__loading {
    background-color: rgba(0, 0, 0, 0.8);
  }
}

/* 焦点样式 */
.y-form:focus-within {
  outline: 2px solid var(--y-primary);
  outline-offset: 2px;
}

/* 错误状态动画 */
.y-form :deep(.y-form-item--error) {
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .y-form {
    font-size: 14px;
  }
  
  .y-form--spacing-4,
  .y-form--spacing-5,
  .y-form--spacing-6 {
    gap: 12px;
  }
}

/* 打印样式 */
@media print {
  .y-form__loading {
    display: none;
  }
  
  .y-form {
    opacity: 1;
  }
}
</style>