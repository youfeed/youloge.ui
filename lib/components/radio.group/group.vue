<template>
    <div class="y-radio-group" :class="groupClass">
        <slot></slot>
    </div>
</template>

<script setup>
import { provide, computed } from 'vue'

defineOptions({ name: 'y-radio-group' })

const modelValue = defineModel({
    type: [String, Number, Boolean],
    default: ''
})

const props = defineProps({
    disabled: Boolean,
    variant: {
        type: String,
        default: 'default',
        validator: val => ['default', 'border', 'button', 'capsule'].includes(val)
    },
    vertical: Boolean
})

const emit = defineEmits(['change'])

const groupClass = computed(() => [
    'y-radio-group',
    `y-radio-group--${props.variant}`,
    {
        'y-radio-group--vertical': props.vertical
    }
])

// 提供上下文给子 radio
const groupContext = {
    modelValue,
    disabled: props.disabled,
    variant: props.variant,
    change: (value) => {
        modelValue.value = value
        emit('change', value)
    }
}

provide('radioGroupContext', groupContext)
</script>

<style>
.y-radio-group {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    width: fit-content;
}

.y-radio-group--border,
.y-radio-group--button,
.y-radio-group--capsule {
    gap: 0;
}

.y-radio-group--border .y-radio__inner,
.y-radio-group--button .y-radio__inner,
.y-radio-group--capsule .y-radio__inner {
    display: none;
}

/* 边框样式 - 根据图片实现 */
.y-radio-group--border .y-radio {
    position: relative;
    padding: 8px 16px;
    border-radius: 8px;
    background: var(--white, #ffffff);
    color: var(--neutral-700, #374151);
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
    user-select: none;

    /* 轻微阴影效果，模拟图片中的浮起感 */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* 悬停效果 */
.y-radio-group--border .y-radio:hover:not(.y-radio--disabled) {
    border-color: var(--primary, #4A90E2);
    color: var(--primary, #4A90E2);
}

/* 选中状态 - 完全匹配图片样式 */
.y-radio-group--border .y-radio--checked {
    border-color: var(--primary, #4A90E2);
    background-color: rgba(74, 144, 226, 0.08);
    /* 轻微蓝色背景 */
    color: var(--primary, #4A90E2);
}


/* 禁用状态 */
.y-radio-group--border .y-radio--disabled {
    background-color: var(--neutral-50, #f9fafb);
    border-color: var(--neutral-200, #e5e7eb);
    color: var(--neutral-400, #9ca3af);
    cursor: not-allowed;
    box-shadow: none;
}

/* 按钮之间的间距调整 */
.y-radio-group--border .y-radio:not(:last-child) {
    margin-right: 0;
}

/* 垂直布局调整 */
.y-radio-group--vertical.y-radio-group--border {
    flex-direction: column;
    align-items: stretch;
}

.y-radio-group--vertical.y-radio-group--border .y-radio {
    width: 100%;
    text-align: center;
}

/* 按钮样式（保持原有实现） */


.y-radio-group--button .y-radio {
    margin: 0;
    padding: 8px 16px;
    border-radius: 0;
    border: 1px solid var(--neutral-200, #e5e7eb);
    background: var(--white, #ffffff);
}

.y-radio-group--border .y-radio {
    margin: 0;
    padding: 8px 16px;
    border-radius: 0;
    border: 1px solid var(--neutral-200, #e5e7eb);
    background: var(--white, #ffffff);
}

.y-radio-group--border .y-radio:first-child, .y-radio-group--button .y-radio:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.y-radio-group--border .y-radio:first-child, .y-radio-group--button .y-radio:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.y-radio-group--border .y-radio:not(:first-child), .y-radio-group--button .y-radio:not(:first-child) {
    margin-left: -1px;
}

.y-radio-group--button .y-radio:hover:not(.y-radio--disabled):not(.y-radio--checked) {
    border-color: var(--primary, #3b82f6);
    color: var(--primary, #3b82f6);
}

.y-radio-group--button .y-radio--checked {
    border-color: var(--primary, #3b82f6);
    background: var(--primary, #3b82f6);
    color: var(--white, #ffffff);
}

/* 胶囊样式 */
.y-radio-group--capsule {
    border-radius: 20px;
    overflow: hidden;
    background: var(--neutral-100, #f3f4f6);
    padding: 4px;
}

.y-radio-group--capsule .y-radio {
    margin: 0;
    padding: 6px 16px;
    border-radius: 16px;
}

.y-radio-group--capsule .y-radio--checked {
    background: var(--primary, #3b82f6);
    color: var(--white, #ffffff);
}

/* 垂直布局通用调整 */
.y-radio-group--vertical {
    flex-direction: column;
    align-items: flex-start;
}

.y-radio-group--vertical.y-radio-group--button .y-radio,
.y-radio-group--vertical.y-radio-group--capsule .y-radio {
    width: 100%;
    margin-left: 0;
}

.y-radio-group--vertical.y-radio-group--button .y-radio:not(:first-child),
.y-radio-group--vertical.y-radio-group--capsule .y-radio:not(:first-child) {
    margin-top: -1px;
    margin-left: 0;
}

.y-radio-group--vertical.y-radio-group--button .y-radio:first-child {
    border-radius: 4px 4px 0 0;
}

.y-radio-group--vertical.y-radio-group--button .y-radio:last-child {
    border-radius: 0 0 4px 4px;
}
</style>