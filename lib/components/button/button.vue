<template>
    <button 
        class="y-button"
        :class="buttonClass"
        :disabled="disabled || loading"
        @click="clickHandler"
    >
        <!-- 加载状态 -->
        <span v-if="loading" class="y-button__loading"></span>
        
        <!-- 图标 -->
        <span v-if="$slots.icon && !loading" class="y-button__icon">
            <slot name="icon" />
        </span>
        
        <!-- 文本 -->
        <span class="y-button__text">
            <slot />
        </span>
    </button>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

defineOptions({ name: 'y-button' });

const props = defineProps({
    type: { type: String, default: 'default' },
    size: { type: String, default: 'md' },
    rounded: { type: String, default: '' },
    disabled: Boolean,
    block: Boolean,
    loading: Boolean
});

const emit = defineEmits(['click']);

// 简化的类名计算
const buttonClass = computed(() => {
    return [
        'y-button',
        `y-button--${props.type}`,
        `y-button--${props.size}`,
        props.rounded && `y-button--rounded-${props.rounded}`,
        props.block && 'y-button--block',
        props.disabled && 'y-button--disabled',
        props.loading && 'y-button--loading'
    ].filter(Boolean).join(' ');
});

const clickHandler = (e) => {
    if (!props.disabled && !props.loading) {
        emit('click', e);
    }
};
</script>

<style scoped>
.y-button {
    /* 基础样式 */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid;
    outline: none;
    cursor: pointer;
    font-family: inherit;
    font-weight: 500;
    line-height: 1.5;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    user-select: none;
    position: relative;
    
    /* 默认样式 - 使用100-900色阶 */
    background-color: var(--neutral-100);
    border-color: var(--neutral-300);
    color: var(--text-900);
}

/* 按钮类型 - 使用正确的色阶变量 */
.y-button--default {
    background-color: var(--neutral-100);
    border-color: var(--neutral-300);
    color: var(--text-900);
}
.y-button--default:hover:not(.y-button--disabled) {
    background-color: var(--neutral-200);
    border-color: var(--neutral-400);
}

.y-button--primary {
    background-color: var(--primary-600);
    border-color: var(--primary-600);
    color: white;
}
.y-button--primary:hover:not(.y-button--disabled) {
    background-color: var(--primary-700);
    border-color: var(--primary-700);
}

.y-button--success {
    background-color: var(--success-600);
    border-color: var(--success-600);
    color: white;
}
.y-button--success:hover:not(.y-button--disabled) {
    background-color: var(--success-700);
    border-color: var(--success-700);
}

.y-button--error,
.y-button--danger {
    background-color: var(--error-600);
    border-color: var(--error-600);
    color: white;
}
.y-button--error:hover:not(.y-button--disabled),
.y-button--danger:hover:not(.y-button--disabled) {
    background-color: var(--error-700);
    border-color: var(--error-700);
}

.y-button--warning {
    background-color: var(--warning-500);
    border-color: var(--warning-500);
    color: var(--text-900);
}
.y-button--warning:hover:not(.y-button--disabled) {
    background-color: var(--warning-600);
    border-color: var(--warning-600);
}

.y-button--info {
    background-color: var(--info-600);
    border-color: var(--info-600);
    color: white;
}
.y-button--info:hover:not(.y-button--disabled) {
    background-color: var(--info-700);
    border-color: var(--info-700);
}

.y-button--outline {
    background-color: transparent;
    border-color: var(--neutral-300);
    color: var(--text-900);
}
.y-button--outline:hover:not(.y-button--disabled) {
    background-color: var(--neutral-50);
    border-color: var(--neutral-400);
}

.y-button--ghost {
    background-color: transparent;
    border-color: transparent;
    color: var(--text-900);
}
.y-button--ghost:hover:not(.y-button--disabled) {
    background-color: var(--neutral-100);
}

.y-button--link {
    background-color: transparent;
    border-color: transparent;
    color: var(--primary-600);
    text-decoration: underline;
}
.y-button--link:hover:not(.y-button--disabled) {
    color: var(--primary-700);
    text-decoration: none;
}

/* 按钮尺寸 */
.y-button--sm {
    padding: 4px 12px;
    font-size: 12px;
    gap: 4px;
    min-height: 24px;
}

.y-button--md {
    padding: 6px 16px;
    font-size: 14px;
    gap: 6px;
    min-height: 32px;
}

.y-button--lg {
    padding: 8px 20px;
    font-size: 16px;
    gap: 8px;
    min-height: 40px;
}

/* 圆角 */
.y-button--rounded-none { border-radius: 0; }
.y-button--rounded-sm { border-radius: 2px; }
.y-button--rounded-md { border-radius: 4px; }
.y-button--rounded-lg { border-radius: 8px; }
.y-button--rounded-xl { border-radius: 12px; }
.y-button--rounded-full { border-radius: 9999px; }

/* 块级按钮 */
.y-button--block {
    display: flex;
    width: 100%;
}

/* 禁用状态 */
.y-button--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}

/* 加载状态 */
.y-button--loading {
    color: transparent;
}
.y-button__loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: y-button-spin 1s linear infinite;
}

@keyframes y-button-spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 图标和文本 */
.y-button__icon {
    display: inline-flex;
    align-items: center;
    font-size: inherit;
}

.y-button__text {
    display: inline-flex;
    align-items: center;
}

/* 聚焦状态 */
.y-button:focus-visible {
    outline: 2px solid var(--primary-300);
    outline-offset: 2px;
}
</style>