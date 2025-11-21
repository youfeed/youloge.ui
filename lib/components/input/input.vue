<template>
  <!-- 输入框容器：适配表单布局，支持错误态 -->
  <div class="y-input__container" :class="{ 'y-input__container--disabled': context.disabled }">
    <!-- 输入框核心：支持多种类型，双向绑定 -->
    <input
      :type="type"
      class="y-input"
      :class="{ 'y-input--error': error }"
      :value="modelValue"
      :placeholder="placeholder || `请输入${label || '内容'}`"
      :disabled="context.disabled"
      :maxlength="maxlength"
      :minlength="minlength"
      :min="type === 'number' ? min : undefined"
      :max="type === 'number' ? max : undefined"
      @input="handleInput"
      @blur="handleBlur"
      @change="handleChange"
    />
  </div>
</template>

<script setup>
import { defineProps, defineModel, emit, inject, watch, onUnmounted } from 'vue'

defineOptions({ name: 'y-input' })

// 注入表单项目上下文（与 y-form-item 联动）
const context = inject('yFormItemContext', { disabled: false })
// 注入表单全局上下文（验证相关）
const formContext = inject('formContext', null)

// 1. 清理冗余 Props，保留核心功能
const props = defineProps({
  // 输入框类型（文本/密码/数字等）
  type: {
    type: String,
    default: 'text',
    validator: val => ['text', 'password', 'number', 'email', 'tel', 'url'].includes(val)
  },
  // 标签文本（用于占位符默认值，实际标签由 y-form-item 控制）
  label: {
    type: String,
    default: ''
  },
  // 占位提示文本
  placeholder: {
    type: String,
    default: ''
  },
  // 最大长度
  maxlength: {
    type: [Number, String],
    default: ''
  },
  // 最小长度
  minlength: {
    type: [Number, String],
    default: ''
  },
  // 数字类型最小値
  min: {
    type: [Number, String],
    default: ''
  },
  // 数字类型最大值
  max: {
    type: [Number, String],
    default: ''
  },
  // 步长（仅数字类型）
  step: {
    type: [Number, String],
    default: ''
  },
  // 验证规则（支持字符串/数组/函数，与 form 联动）
  rules: {
    type: [String, Array, Function],
    default: () => []
  },
  // 自定义错误状态（由 form-item 传递，控制输入框错误样式）
  error: {
    type: Boolean,
    default: false
  }
})

// 2. 双向绑定：支持 v-model，兼容表单
const modelValue = defineModel({
  type: [String, Number],
  default: ''
})

// 3. 事件派发：透传常用事件
const emits = defineEmits(['input', 'change', 'blur', 'focus'])

// 4. 表单验证：正确注册/注销规则（与 formContext 联动）
const validatorKey = Symbol('y-input-validator') // 唯一标识，避免冲突

// 构建验证函数（支持自定义 rules）
const validator = (value) => {
  const rules = Array.isArray(props.rules) ? props.rules : [props.rules]
  let valid = true
  let message = ''

  for (const rule of rules) {
    if (typeof rule === 'function') {
      // 自定义验证函数
      const result = rule(value, modelValue.value)
      valid = result.valid
      message = result.message || ''
      if (!valid) break
    } else if (rule === 'required') {
      // 必填规则
      if (value === '' || value === undefined || value === null) {
        valid = false
        message = `${props.label || '输入框'} 为必填项`
        break
      }
    } else if (rule.includes('min:')) {
      // 最小长度/数值规则
      const minVal = Number(rule.split(':')[1])
      const length = type === 'number' ? Number(value) : String(value).length
      if (length < minVal) {
        valid = false
        message = `${props.label || '输入框'} 不能小于 ${minVal}`
        break
      }
    } else if (rule.includes('max:')) {
      // 最大长度/数值规则
      const maxVal = Number(rule.split(':')[1])
      const length = type === 'number' ? Number(value) : String(value).length
      if (length > maxVal) {
        valid = false
        message = `${props.label || '输入框'} 不能大于 ${maxVal}`
        break
      }
    } else if (rule === 'email') {
      // 邮箱格式规则
      const reg = /^[\w.-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+$/
      if (!reg.test(value)) {
        valid = false
        message = '邮箱格式不正确'
        break
      }
    }
  }

  return { valid, message }
}

// 注册验证规则（监听 rules 变化）
watch(
  () => props.rules,
  (newRules) => {
    if (formContext && newRules && newRules.length > 0) {
      formContext.setRules?.(validatorKey, validator)
    } else {
      formContext.deleteRules?.(validatorKey)
    }
  },
  { immediate: true, deep: true }
)

// 销毁时移除验证规则
onUnmounted(() => {
  formContext.deleteRules?.(validatorKey)
})

// 5. 事件处理：同步值与表单状态
const handleInput = (e) => {
  let value = e.target.value
  // 数字类型特殊处理（空值保留空字符串，避免出现 0）
  if (props.type === 'number') {
    value = value === '' ? '' : Number(value)
  }
  modelValue.value = value
  emits('input', value)
}

const handleBlur = (e) => {
  emits('blur', e)
  // 失焦时触发表单单项验证
  formContext?.validateField?.(formContext.currentProp)
}

const handleChange = (e) => {
  emits('change', e.target.value)
}
</script>

<style lang="less" scoped>
// 输入框容器：适配表单间距，统一对齐
.y-input__container {
  width: 100%;
  box-sizing: border-box;
}

// 核心输入框样式：GitHub 风格，低调简洁
.y-input {
  width: 100%;
  padding: 8px 12px;
  box-sizing: border-box;
  border: 1px solid #e5e7eb; // 浅灰边框
  border-radius: 4px; // 小圆角，不突兀
  font-size: 14px;
  color: #1f2937; // 深灰文本
  background-color: #ffffff;
  transition: all 0.2s ease; // 平滑过渡
  outline: none;

  // 聚焦态：蓝色边框 + 轻微阴影，贴合 GitHub 交互
  &:focus {
    border-color: #0969da;
    box-shadow: 0 0 0 2px rgba(9, 105, 218, 0.1);
  }

  // 错误态：红色边框，与表单错误提示呼应
  &.y-input--error {
    border-color: #cf222e;
    &:focus {
      box-shadow: 0 0 0 2px rgba(207, 34, 46, 0.1);
    }
  }

  // 占位符样式：浅灰，不抢眼
  &::placeholder {
    color: #9ca3af;
    font-size: 14px;
  }
}

// 禁用态：浅灰背景 + 淡色文本，无交互感
.y-input__container--disabled .y-input {
  background-color: #f9fafb;
  color: #9ca3af;
  border-color: #f3f4f6;
  cursor: not-allowed;
  &::placeholder {
    color: #d1d5db;
  }
}

// 数字输入框去掉默认箭头（可选，更简洁）
.y-input[type="number"]::-webkit-inner-spin-button,
.y-input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
</style>