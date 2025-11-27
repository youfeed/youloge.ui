<template>
  <div :class="formItemClass">
    <!-- 标签和输入区域 -->
    <div :class="containerClass">
      <!-- 表单项标签 -->
      <label 
        v-if="label"
        :class="labelClass"
        :for="fieldId"
      >
        <span class="y-form-item__label-text">{{ label }}</span>
        <span v-if="required" class="y-form-item__required">*</span>
      </label>

      <!-- 输入组件容器 -->
      <div class="y-form-item__content">
        <slot />
        
        <!-- 帮助文本 -->
        <p v-if="helpText" class="y-form-item__help">
          {{ helpText }}
        </p>
        
        <!-- 错误提示 -->
        <p v-if="errorMessage" class="y-form-item__error">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, provide,onUnmounted,inject, watch, ref } from 'vue'

defineOptions({ name: 'y-form-item' })

// 注入表单上下文
const formContext = inject('formContext', null)

// Props定义
const props = defineProps({
  // 标签文本
  label: { type: String, default: '' },
  // 字段名
  prop: { type: String, required: true },
  // 是否必填
  required: { type: Boolean, default: false },
  // 帮助文本
  helpText: { type: String, default: '' },
  // 标签宽度
  labelWidth: { type: [String, Number], default: 'auto' },
  // 验证触发时机
  validateTrigger: {
    type: String,
    default: 'blur',
    validator: (val) => ['blur', 'change', 'manual'].includes(val)
  },
  // 是否显示校验图标
  showValidateIcon: { type: Boolean, default: true },
  // 自定义类名
  class: { type: String, default: '' }
})

// 响应式数据
const fieldId = computed(() => `field_${props.prop}`)
const isValidatePending = ref(false)

// 检查是否在表单中
if (!formContext) {
  console.warn('[y-form-item] 建议在 <y-form> 组件中使用以获得完整功能')
}

// 表单项类名
const formItemClass = computed(() => {
  const classes = ['y-form-item', 'w-full', 'box-border', 'transition-all', 'duration-200']
  
  // 布局方向
  const labelPosition = formContext?.labelPosition?.value || 'top'
  if (labelPosition === 'left') {
    classes.push('y-form-item--horizontal')
  } else {
    classes.push('y-form-item--vertical')
  }
  
  // 状态
  if (hasError.value) {
    classes.push('y-form-item--error')
  }
  
  if (isValidatePending.value) {
    classes.push('y-form-item--validating')
  }
  
  // 禁用/只读状态
  if (formContext?.disabled?.value) {
    classes.push('y-form-item--disabled')
  }
  
  if (formContext?.readonly?.value) {
    classes.push('y-form-item--readonly')
  }
  
  // 自定义类名
  if (props.class) {
    classes.push(props.class)
  }
  
  return classes.join(' ')
})

// 容器类名
const containerClass = computed(() => {
  const labelPosition = formContext?.labelPosition?.value || 'top'
  return labelPosition === 'left' 
    ? 'y-form-item__container--horizontal' 
    : 'y-form-item__container--vertical'
})

// 标签类名
const labelClass = computed(() => {
  const classes = ['y-form-item__label', 'text-text-secondary', 'font-medium', 'text-sm']
  
  // 对齐方式
  if (formContext?.labelPosition?.value === 'left') {
    classes.push('text-right')
  }
  
  return classes.join(' ')
})

// 标签样式
const labelStyle = computed(() => {
  const style = {}
  const labelWidth = props.labelWidth === 'auto' 
    ? formContext?.labelWidth?.value 
    : props.labelWidth
  
  if (formContext?.labelPosition?.value === 'left' && labelWidth) {
    const width = typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth
    style.width = width
    style.flexShrink = '0'
  }
  
  return style
})

// 错误信息
const errorMessage = computed(() => {
  if (!formContext) return ''
  return formContext.errors.value?.[props.prop] || ''
})

// 是否有错误
const hasError = computed(() => !!errorMessage.value)

// 监听字段值变化
if (formContext) {
  watch(
    () => formContext.model.value?.[props.prop],
    async (newVal, oldVal) => {
      if (props.validateTrigger === 'change' && newVal !== oldVal) {
        isValidatePending.value = true
        await formContext.validateField(props.prop)
        isValidatePending.value = false
      }
    },
    { deep: true }
  )
  
  // 监听blur事件
  const handleBlur = async () => {
    if (props.validateTrigger === 'blur') {
      isValidatePending.value = true
      await formContext.validateField(props.prop)
      isValidatePending.value = false
    }
  }
  
  // 注册字段
  if (formContext.registerField) {
    formContext.registerField(props.prop)
  }
  
  // 暴露blur处理方法给子组件
  provide('formItemContext', {
    prop: props.prop,
    required: props.required,
    validateTrigger: props.validateTrigger,
    handleBlur,
    hasError,
    isValidatePending
  })
}

// 清理
onUnmounted(() => {
  if (formContext?.unregisterField) {
    formContext.unregisterField(props.prop)
  }
})

// 暴露方法
defineExpose({
  validateField: () => formContext?.validateField?.(props.prop),
  resetField: () => formContext?.resetField?.(props.prop),
  clearError: () => formContext?.clearFieldError?.(props.prop)
})
</script>

<style scoped>
.y-form-item {
  margin-bottom: 16px;
  position: relative;
}

/* 垂直布局 */
.y-form-item--vertical {
  display: flex;
  flex-direction: column;
}

.y-form-item__container--vertical {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 水平布局 */
.y-form-item--horizontal {
  display: flex;
  flex-direction: column;
}

.y-form-item__container--horizontal {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

/* 标签样式 */
.y-form-item__label {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  line-height: 1.5;
  flex-shrink: 0;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}

.y-form-item__label:hover {
  color: var(--y-text-primary);
}

.y-form-item__required {
  color: var(--y-error);
  margin-left: 4px;
  font-size: 12px;
}

/* 内容区域 */
.y-form-item__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 帮助文本 */
.y-form-item__help {
  font-size: 12px;
  line-height: 1.4;
  color: var(--y-text-tertiary);
  margin: 0;
  padding: 0;
}

/* 错误提示 */
.y-form-item__error {
  font-size: 12px;
  line-height: 1.4;
  color: var(--y-error);
  margin: 0;
  padding: 0;
  min-height: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.y-form-item__error::before {
  content: '⚠';
  font-size: 10px;
}

/* 状态样式 */
.y-form-item--error {
  --y-input-border-color: var(--y-error);
}

.y-form-item--validating {
  position: relative;
}

.y-form-item--validating::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border: 2px solid var(--y-primary);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.y-form-item--disabled {
  opacity: 0.6;
  pointer-events: none;
}

.y-form-item--readonly {
  pointer-events: none;
}

/* 验证成功图标 */
.y-form-item--success :deep(input:not(:focus):not(:hover)) {
  border-color: var(--y-success);
  padding-right: 24px;
}

.y-form-item--success :deep(input:not(:focus):not(:hover))::after {
  content: '✓';
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--y-success);
}

/* 动画效果 */
.y-form-item__error {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from { transform: translateY(-50%) rotate(0deg); }
  to { transform: translateY(-50%) rotate(360deg); }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .y-form-item {
    margin-bottom: 12px;
  }
  
  .y-form-item__container--horizontal {
    flex-direction: column;
    gap: 6px;
  }
  
  .y-form-item__label {
    min-height: auto;
    text-align: left !important;
    width: 100% !important;
    margin-bottom: 4px;
  }
  
  .y-form-item__content {
    gap: 3px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .y-form-item__help {
    color: var(--y-text-tertiary-dark);
  }
}

/* 焦点状态 */
.y-form-item:focus-within .y-form-item__label {
  color: var(--y-primary);
}

/* 空状态 */
.y-form-item:empty {
  min-height: 40px;
  background-color: var(--y-bg-tertiary);
  border: 1px dashed var(--y-border-light);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--y-text-placeholder);
  font-size: 12px;
}

.y-form-item:empty::before {
  content: '请添加表单项';
}
</style>