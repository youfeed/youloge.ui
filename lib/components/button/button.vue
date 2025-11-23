<template>
    <button 
        class="y-button"
        :class="computedClass"
        :disabled="disabled"
        @click="clickHandler"
    >
        <span v-if="$slots.icon" class="y-button__icon">
            <slot name="icon" />
        </span>
        <span class="y-button__text">
            <slot />
        </span>
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
    disabled: Boolean,
    block: Boolean, // 新增：块级按钮
    loading: Boolean // 新增：加载状态
});

const emit = defineEmits(['click']);

// 计算类名 - 完全使用工具类
const computedClass = computed(() => {
    const classes = [
        // 基础按钮类
        'inline-flex items-center justify-center border border-solid outline-none cursor-pointer select-none transition-200',
        // 禁用状态
        props.disabled ? 'opacity-70 cursor-not-allowed pointer-events-none bg-neutral-300 border-neutral-300 text-neutral-500' : '',
        // 加载状态
        props.loading ? 'relative cursor-wait' : '',
        // 块级按钮
        props.block ? 'w-full' : '',
        // 无hover效果
        props.noHover ? 'no-hover' : '',
        
        // 尺寸类
        sizeClasses[props.size],
        
        // 圆角类
        roundedClasses[props.rounded] || 'rounded-md',
        
        // 类型类
        typeClasses[props.type]
    ];
    
    return classes.filter(Boolean).join(' ');
});

// 尺寸映射
const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-2 text-sm gap-2', 
    lg: 'px-4 py-3 text-base gap-2'
};

// 圆角映射
const roundedClasses = {
    '': 'rounded-md',
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md', 
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
};

// 类型映射 - 使用CSS变量
const typeClasses = {
    default: 'bg-neutral-100 border-neutral-200 text-neutral-900 hover:bg-neutral-200 hover:border-neutral-300',
    primary: 'bg-primary border-primary text-white hover:bg-primary-active hover:border-primary-active focus-visible:ring-primary',
    success: 'bg-success border-success text-white hover:bg-success-active hover:border-success-active focus-visible:ring-success',
    error: 'bg-error border-error text-white hover:bg-error-active hover:border-error-active focus-visible:ring-error',
    danger: 'bg-error border-error text-white hover:bg-error-active hover:border-error-active focus-visible:ring-error',
    warning: 'bg-warning border-warning text-neutral-900 hover:bg-warning-active hover:border-warning-active focus-visible:ring-warning',
    info: 'bg-info border-info text-white hover:bg-info-active hover:border-info-active focus-visible:ring-info',
    secondary: 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300',
    accent: 'bg-neutral-700 border-neutral-700 text-white hover:bg-neutral-800 hover:border-neutral-800',
    outline: 'bg-transparent border-neutral-200 text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300',
    ghost: 'bg-transparent border-transparent text-neutral-900 hover:bg-neutral-100 hover:border-neutral-200',
    link: 'bg-transparent border-transparent text-primary hover:bg-primary-10 hover:underline px-2 py-1'
};

const clickHandler = (e) => {
    if (!props.disabled && !props.loading) {
        emit('click', e);
    }
};
</script>

<style>
/* 基础按钮样式 - 使用工具类补充 */
.y-button {
    font-family: var(--font-family);
    font-weight: 500;
    line-height: 1.5;
    box-sizing: border-box;
    
    /* 使用工具类定义的过渡 */
    transition: background-color var(--transition-duration), 
                border-color var(--transition-duration), 
                color var(--transition-duration), 
                box-shadow var(--transition-duration);
}

/* 聚焦样式 - 使用工具类补充 */
.y-button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--neutral-100), 0 0 0 4px rgba(var(--primary-rgb), 0.3);
}

/* 无hover效果自定义样式 */
.y-button.no-hover {
    transition: none;
}
.y-button.no-hover:not(:disabled):hover {
    background-color: inherit !important;
    border-color: inherit !important;
    color: inherit !important;
    box-shadow: none !important;
}

/* 图标样式 */
.y-button__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
}

/* 文本样式 */
.y-button__text {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

/* 加载状态 */
.y-button:has(.y-button--loading) {
    position: relative;
    color: transparent !important;
}

.y-button--loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: y-button-spin 0.8s linear infinite;
}

@keyframes y-button-spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 响应式适配 */
@media (max-width: 640px) {
    .y-button {
        /* 移动端适当调整内边距 */
        padding-left: calc(var(--spacing-unit) * 1.5);
        padding-right: calc(var(--spacing-unit) * 1.5);
    }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
    .y-button[data-type="default"] {
        background-color: var(--neutral-800);
        border-color: var(--neutral-700);
        color: var(--neutral-100);
    }
    .y-button[data-type="default"]:hover {
        background-color: var(--neutral-700);
        border-color: var(--neutral-600);
    }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
    .y-button {
        border-width: 2px;
    }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
    .y-button {
        transition: none;
    }
    .y-button--loading {
        animation: none;
    }
}
</style>