<template>
    <!-- 输入框容器：适配表单布局，支持错误态 -->
    <div :class="inputClass" :style="inputStyle">
        <div class="y-input__prefix" v-if="props.prefix">{{ props.prefix }}</div>
        <!-- 输入框核心：支持多种类型，双向绑定 -->
        <input :name="name" :type="type" :value="model" :placeholder="placeholder || `请输入${label || '内容'}`"
            :disabled="context.disabled" :maxlength="maxlength" :minlength="minlength"
            @input="handleInput" @blur="handleBlur" @change="handleChange" />
        <span class="y-input__clearable" v-if="props.clearable" @click="onClearable">×</span>
        <div class="y-input__suffix" v-if="props.suffix">{{ props.suffix }}</div>
        <div class="y-input__wordCount" v-if="props.wordCount">{{ model.length }}/ {{ props.maxlength }}</div>
        <!-- <div class="">
        </div> -->
    </div>
</template>

<script setup>
import { defineProps, defineModel, inject, watch, onUnmounted, computed } from 'vue'

defineOptions({ name: 'y-input' })

// 注入表单项目上下文（与 y-form-item 联动）
const context = inject('yFormItemContext', { disabled: false })
// 注入表单全局上下文（验证相关）
const formContext = inject('formContext', null)
const model = defineModel({
    type: [String, Number],
    default: ''
});
// 核心功能
const props = defineProps({
    // 输入框类型（文本/密码/数字等）
    type: {
        type: String,
        default: 'text',
        validator: val => ['text', 'password', 'number', 'email', 'tel', 'url', 'search', 'submit', 'hidden'].includes(val)
    },
    // 输入框状态
    status: {
        type: String,
        default: 'default',
        validator: val => ['default', 'success', 'warning', 'error'].includes(val)
    },
    // 输入框状态
    size: {
        type: String,
        default: 'medium',
        validator: val => ['large', 'medium', 'small'].includes(val)
    },
    // 输入框状态
    align: {
        type: String,
        default: 'left',
        validator: val => ['left', 'center', 'right'].includes(val)
    },
    name: {
        type: String,
        default: ''
    },
    format: {},
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
    prefix: { type: String,default: '' },
    suffix: { type: String, default: '' },
    readonly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    autoWidth: { type: Boolean, default: false },
    wordCount: { type: Boolean, default: false },
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
// 事件派发：透传常用事件
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
            const result = rule(value, model.value)
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
);

// 销毁时移除验证规则
onUnmounted(() => {
    formContext.deleteRules?.(validatorKey)
});

// 5. 事件处理：同步值与表单状态
const handleInput = (e) => {
    let value = e.target.value
    // 数字类型特殊处理（空值保留空字符串，避免出现 0）
    if (props.type === 'number') {
        value = value === '' ? '' : Number(value)
    }
    model.value = value
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
// 清空输入
const onClearable = ()=>{
    console.log('onClearable')
    model.value = ''
}
//
const inputStyle = computed(() => [])
const inputClass = computed(() => [
    'y-input',
    `y-input-type-${props.type}`,
    `y-input-align-${props.align}`,
    `y-input-size-${props.size}`,
    `y-input-status-${props.status}`,
    {
        'y-input-clearable': props.clearable,
        'y-input-autowidth': props.autoWidth,
        'y-input-borderless': props.borderless,
        'y-input-disabled': props.disabled,
        'y-input-readonly': props.readonly,
    }
])
</script>

<style lang="less" scoped>
// 输入框容器：适配表单间距，统一对齐
.y-input {
    display: flex;
    position: relative;
    align-items: center;
    gap: 4px;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    margin: 0;
    padding: 0 4px;
    outline: 0;
    border-width: 1px;
    border-style: solid;
    border-color: var(--primary);
    min-width: 0;
    max-width: 100%;
    text-overflow: ellipsis;
    border-radius: var(--border-radius);
    font-size: var(--font-size-base);
    color: var(--neutral-700);
    background-color: var(--white);
    transition: all 0.2s ease;
    &:focus-within {
        padding: 10px;
        border-color: var(--primary) !important;
        box-shadow: 0 0 0 px var(--primary) !important;
    }
    &:hover {
        border-color: var(--primary-hover) !important;
    }
    &:hover .y-input__clearable{
        visibility: inherit;
    }
    // 占位符样式：浅灰，不抢眼
    &::placeholder {
        color: var(--neutral-400);
        font-size: 14px;
    }
    &.y-input-size-large{
        padding: 6px 10px;
        font-size:large;
    }
    &.y-input-size-medium{
        padding: 4px 8px;
        font-size: medium;
    }
    &.y-input-size-small{
        padding: 2px 4px;
        font-size:small;
    }
    &.y-input-status-default{
        border-color: var(--neutral-200);
    }
    &.y-input-status-success{
        border-color: var(--success);
    }
    &.y-input-status-warning{
        border-color: var(--warning);
    }
    &.y-input-status-error{
        border-color: var(--error);
    }
    &.y-input-borderless{
        border: 0;
    }
    &.y-input-align-center input{
        text-align: center;
    }
    &.y-input-align-right{
        text-align: right;
    }
    
    .y-input__clearable{
        visibility: hidden;
        cursor: pointer;
    }
    > input {
        flex: 1;
        border: none;
        outline: none;
        padding: 0;
        max-width: 100%;
        min-width: 0;
        color: var(--neutral-800);
        font: inherit;
        background-color: transparent;
        box-sizing: border-box;
        white-space: nowrap;
        word-wrap: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        
    }
}

.y-input__autowidth {
    width: fit-content;
    min-width: 60px;
}

.y-input-borderless {
    border: 0;
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