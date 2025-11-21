<template>
  <div class="y-form-item" :class="formItemClasses">
    <!-- 标签 + 输入区域容器 -->
    <div class="y-form-item__label-input-container" :class="labelInputContainerClasses">
      <!-- 表单项标签 -->
      <label 
        v-if="label"
        class="y-form-item__label"
        :style="labelStyle"
      >
        <span class="y-form-item__label-text">{{ label }}</span>
        <span v-if="required" class="y-form-item__required">*</span>
      </label>

      <!-- 输入组件容器（插槽：支持 Input、Select 等自定义组件） -->
      <div class="y-form-item__input-container" :style="inputContainerStyle">
        <slot></slot> <!-- 自定义输入组件 -->
        
        <!-- 错误提示（验证失败时显示） -->
        <p v-if="errors[prop]" class="y-form-item__error">
          {{ errors[prop] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, watch, ref } from 'vue'

defineOptions({ name: 'y-form-item' })

// 注入表单上下文（确保嵌套在 y-form 中使用）
const { model, rules, labelPosition, labelWidth, errors, validateField } = inject('formContext')
if (!model) {
  throw new Error('[y-form-item] 必须嵌套在 <y-form> 组件中使用')
}

// Props 定义（保留原有功能）
const props = defineProps({
  label: { type: String, default: '' },
  prop: { type: String, required: true },
  required: { type: Boolean, default: false },
  padding: {
    type: [String, Number],
    default: '0',
    validator: val => val >= 0 && val <= 120
  }
})

// 格式化单位（数字自动转 px，支持字符串单位）
const formatUnit = (val) => {
  if (typeof val === 'number') return `${val}px`
  return /^\d+(px|rem|em)$/.test(val) ? val : '0px'
}

// 计算表单项整体样式（布局方向）
const formItemClasses = computed(() => {
  return {
    'y-form-item--vertical': labelPosition === 'top', // 垂直布局（标签在上）
    'y-form-item--horizontal': labelPosition === 'left' // 水平布局（标签在左）
  }
})

// 计算标签+输入容器样式
const labelInputContainerClasses = computed(() => {
  return labelPosition === 'top' 
    ? 'y-form-item__label-input-container--vertical' 
    : 'y-form-item__label-input-container--horizontal'
})

// 计算标签样式（宽度、对齐、间距）
const labelStyle = computed(() => {
  const style = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#4b5563' // GitHub 灰色文本
  }

  // 水平布局：固定宽度 + 右对齐
  if (labelPosition === 'left') {
    style.width = labelWidth || '100px'
    style.textAlign = 'right'
    style.marginRight = '8px'
  }

  // 垂直布局：底部间距
  if (labelPosition === 'top') {
    style.marginBottom = '8px'
  }

  return style
})

// 计算输入容器样式（内边距、自适应）
const inputContainerStyle = computed(() => {
  return {
    padding: formatUnit(props.padding),
    flex: 1 // 占满剩余宽度
  }
})

// 监听字段值变化，触发单个字段验证（优化触发逻辑：非空/有错误时验证）
watch(
  () => model[props.prop],
  async (newVal) => {
    // 仅当字段有值、有错误记录时触发，避免初始空值误触发
    if (newVal !== undefined && newVal !== '' || errors[props.prop]) {
      await validateField(props.prop)
    }
  },
  { immediate: false, deep: true }
)

// 暴露输入组件相关（保留原有功能）
const inputRef = ref(null)
defineExpose({ inputRef })
</script>

<style lang="less" scoped>
// 表单项基础样式：统一间距、过渡
.y-form-item {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 16px; // 表单项之间间距
  transition: all 0.2s ease;
}

// 标签+输入容器：核心布局
.y-form-item__label-input-container {
  display: flex;
  align-items: flex-start; // 标签与输入框顶部对齐（避免输入框高度变化导致错位）
  width: 100%;
}

// 垂直布局（标签在上）
.y-form-item__label-input-container--vertical {
  flex-direction: column;
  align-items: flex-start;
}

// 水平布局（标签在左）
.y-form-item__label-input-container--horizontal {
  flex-direction: row;
  align-items: center; // 水平布局时垂直居中
}

// 标签样式：简洁低调
.y-form-item__label {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
}

// 必填星号：GitHub 红色风格，不突兀
.y-form-item__required {
  color: #cf222e;
  margin-left: 4px;
  font-size: 14px;
}

// 输入容器：自适应宽度，容纳控件和错误提示
.y-form-item__input-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 4px; // 控件与错误提示间距
}

// 错误提示：浅红色、小字体，位置贴合控件
.y-form-item__error {
  font-size: 12px;
  color: #cf222e;
  line-height: 1.4;
  margin: 0;
  padding: 0;
  height: 16px; // 固定高度，避免布局跳动
}

// 响应式适配：小屏幕自动转为垂直布局
@media (max-width: 575px) {
  .y-form-item__label-input-container--horizontal {
    flex-direction: column;
    align-items: flex-start;
  }

  .y-form-item__label {
    width: 100% !important;
    text-align: left !important;
    margin-right: 0 !important;
    margin-bottom: 8px !important;
  }
}
</style>