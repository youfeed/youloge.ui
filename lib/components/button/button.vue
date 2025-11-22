<template>
    <button 
        class="y-button" 
        :data-size="size" 
        :data-type="type" 
        :data-rounded="rounded"
        :data-no-hover="noHover"
        :disabled="disabled" 
        @click="clickHandler"
    >
        <slot name="icon" class="y-button__icon" />
        <slot class="y-button__text" />
    </button>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
defineOptions({ name: 'y-button' });

const props = defineProps({
    type: {
        type: String,
        default: 'default',
        validator: (value) => ['default', 'primary', 'success', 'error', 'danger', 'warning', 'info', 'secondary', 'accent', 'outline', 'ghost', 'link'].includes(value)
    },
    size: {
        type: String,
        validator: (value) => ['sm', 'md', 'lg'].includes(value),
        default: 'md'
    },
    rounded: {
        type: String,
        validator: (value) => ['', 'none', 'sm', 'md', 'lg', 'xl', 'full'].includes(value),
        default: ''
    },
    noHover: {
        type: Boolean,
        default: false
    },
    disabled: Boolean
});

const emit = defineEmits(['click']);

// 计算基础类名（仅补充必要类，核心样式由 CSS 按 data 属性控制）
const computedClass = computed(() => {
    return props.disabled ? 'is-disabled' : '';
});

const clickHandler = (e) => {
    !props.disabled && emit('click', e);
};
</script>

<style>
/* 👉 1. 基础样式：统一结构、排版、过渡（GitHub 简约风格） */
.y-button {
    /* 布局基础 */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    /* 排版基础（对接全局字体） */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-weight: 500; /* GitHub 按钮默认中等权重 */
    line-height: 1.5;
    text-align: center;
    /* 交互基础 */
    outline: none;
    border: 1px solid transparent;
    cursor: pointer;
    user-select: none;
    /* 统一过渡（确保所有状态切换流畅） */
    transition: background-color var(--transition-duration), 
                border-color var(--transition-duration), 
                color var(--transition-duration), 
                box-shadow var(--transition-duration);
}

/* 👉 2. 状态样式：禁用、聚焦、无 hover（全局统一） */
.y-button.is-disabled,
.y-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;
    background-color: var(--neutral-300) !important;
    border-color: var(--neutral-300) !important;
    color: var(--neutral-500) !important;
    box-shadow: none !important;
}

/* 聚焦样式（符合 WCAG 标准，不突兀） */
.y-button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--neutral-100), 
                0 0 0 4px rgba(9, 105, 218, 0.3); /* 主色淡阴影 */
}

/* 无 hover 效果（通过 data 属性控制） */
.y-button[data-no-hover="true"]:not(:disabled) {
    transition: none;
}
.y-button[data-no-hover="true"]:not(:disabled):hover {
    background-color: inherit !important;
    border-color: inherit !important;
    color: inherit !important;
    box-shadow: none !important;
}

/* 👉 3. 内部元素样式（图标 + 文本） */
.y-button__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: calc(var(--spacing-unit) * 1); /* 间距对接全局单位 */
    font-size: inherit;
}

.y-button__text {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

/* 无文本时隐藏图标间距 */
.y-button:has(.y-button__text:empty) .y-button__icon {
    margin-right: 0;
}

/* 👉 4. 尺寸适配（基于全局 spacing-unit 计算，统一间距逻辑） */
.y-button[data-size="sm"] {
    padding: calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2);
    font-size: var(--font-size-xs);
}
.y-button[data-size="sm"] .y-button__icon {
    width: 16px;
    height: 16px;
}

.y-button[data-size="md"] {
    padding: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 3);
    font-size: var(--font-size-sm);
}
.y-button[data-size="md"] .y-button__icon {
    width: 18px;
    height: 18px;
}

.y-button[data-size="lg"] {
    padding: calc(var(--spacing-unit) * 2.5) calc(var(--spacing-unit) * 4);
    font-size: var(--font-size-base);
}
.y-button[data-size="lg"] .y-button__icon {
    width: 20px;
    height: 20px;
}

/* 👉 5. 圆角适配（对接全局圆角变量，支持动态调整） */
.y-button[data-rounded="none"] {
    border-radius: 0;
}
.y-button[data-rounded="sm"] {
    border-radius: var(--border-radius-sm);
}
.y-button[data-rounded="md"],
.y-button[data-rounded=""] { /* 默认圆角 */
    border-radius: var(--border-radius);
}
.y-button[data-rounded="lg"] {
    border-radius: var(--border-radius-lg);
}
.y-button[data-rounded="xl"] {
    border-radius: calc(var(--border-radius-lg) + 4px);
}
.y-button[data-rounded="full"] {
    border-radius: 9999px;
}

/* 👉 6. 类型样式（GitHub 低饱和度风格，对接全局功能色变量） */
/* 默认按钮（灰色调，无强烈对比） */
.y-button[data-type="default"] {
    background-color: var(--neutral-100);
    color: var(--neutral-900);
    border-color: var(--neutral-200);
}
.y-button[data-type="default"]:not(:disabled):hover {
    background-color: var(--neutral-200);
    border-color: var(--neutral-300);
}

/* 主按钮（GitHub 蓝，突出但不刺眼） */
.y-button[data-type="primary"] {
    background-color: var(--primary);
    color: var(--white);
    border-color: var(--primary);
}
.y-button[data-type="primary"]:not(:disabled):hover {
    background-color: var(--primary-active);
    border-color: var(--primary-active);
}
.y-button[data-type="primary"]:focus-visible {
    box-shadow: 0 0 0 2px var(--white), 
                0 0 0 4px rgba(9, 105, 218, 0.3);
}

/* 次要按钮（浅灰，比默认更淡） */
.y-button[data-type="secondary"] {
    background-color: var(--neutral-50);
    color: var(--neutral-700);
    border-color: var(--neutral-200);
}
.y-button[data-type="secondary"]:not(:disabled):hover {
    background-color: var(--neutral-100);
    border-color: var(--neutral-300);
}

/* 危险/错误按钮（GitHub 红，低饱和度） */
.y-button[data-type="danger"],
.y-button[data-type="error"] {
    background-color: var(--error);
    color: var(--white);
    border-color: var(--error);
}
.y-button[data-type="danger"]:not(:disabled):hover,
.y-button[data-type="error"]:not(:disabled):hover {
    background-color: var(--error-hover);
    border-color: var(--error-hover);
}
.y-button[data-type="danger"]:focus-visible,
.y-button[data-type="error"]:focus-visible {
    box-shadow: 0 0 0 2px var(--white), 
                0 0 0 4px rgba(207, 34, 46, 0.3);
}

/* 警告按钮（低饱和度黄，适配亮暗模式） */
.y-button[data-type="warning"] {
    background-color: var(--warning);
    color: var(--neutral-900);
    border-color: var(--warning);
}
.y-button[data-type="warning"]:not(:disabled):hover {
    background-color: var(--warning-hover);
    border-color: var(--warning-hover);
}

/* 信息按钮（浅蓝，辅助性） */
.y-button[data-type="info"] {
    background-color: var(--info);
    color: var(--white);
    border-color: var(--info);
}
.y-button[data-type="info"]:not(:disabled):hover {
    background-color: var(--info-hover);
    border-color: var(--info-hover);
}

/* 强调按钮（深灰，比默认更突出） */
.y-button[data-type="accent"] {
    background-color: var(--neutral-700);
    color: var(--white);
    border-color: var(--neutral-700);
}
.y-button[data-type="accent"]:not(:disabled):hover {
    background-color: var(--neutral-800);
    border-color: var(--neutral-800);
}

/* 边框按钮（仅边框，无背景） */
.y-button[data-type="outline"] {
    background-color: transparent;
    color: var(--neutral-900);
    border-color: var(--neutral-200);
}
.y-button[data-type="outline"]:not(:disabled):hover {
    background-color: var(--neutral-50);
    border-color: var(--neutral-300);
}

/* 幽灵按钮（hover 显示背景） */
.y-button[data-type="ghost"] {
    background-color: transparent;
    color: var(--neutral-900);
    border-color: transparent;
}
.y-button[data-type="ghost"]:not(:disabled):hover {
    background-color: var(--neutral-100);
    border-color: var(--neutral-200);
}

/* 链接按钮（无背景无边框，类似链接） */
.y-button[data-type="link"] {
    background-color: transparent;
    color: var(--primary);
    border-color: transparent;
    padding: calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2); /* 更小间距 */
}
.y-button[data-type="link"]:not(:disabled):hover {
    background-color: rgba(9, 105, 218, 0.05);
    color: var(--primary-active);
    text-decoration: underline;
}
.y-button[data-type="link"]:focus-visible {
    box-shadow: 0 0 0 2px var(--neutral-100), 
                0 0 0 4px rgba(9, 105, 218, 0.3);
}
</style>