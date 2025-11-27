<template>
    <button 
        :class="buttonClass"
        :disabled="disabled || loading"
        @click="clickHandler"
    >
        <!-- 加载状态 -->
        <span v-if="loading" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
        
        <!-- 图标 -->
        <span v-if="$slots.icon && !loading" class="inline-flex items-center">
            <slot name="icon" />
        </span>
        
        <!-- 文本 -->
        <span class="inline-flex items-center">
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

// UnoCSS类名计算
const buttonClass = computed(() => {
    const baseClasses = [
        'inline-flex',
        'items-center',
        'justify-center',
        'border',
        'outline-none',
        'cursor-pointer',
        'font-family-inherit',
        'font-medium',
        'leading-6',
        'no-underline',
        'transition-all',
        'duration-200',
        'ease-in-out',
        'select-none',
        'relative'
    ];

    // 类型样式
    const typeClasses = getTypeClasses(props.type);
    
    // 尺寸样式
    const sizeClasses = getSizeClasses(props.size);
    
    // 圆角样式
    const roundedClasses = props.rounded ? getRoundedClasses(props.rounded) : ['rounded'];
    
    // 状态样式
    const stateClasses = [
        props.block && 'w-full',
        props.disabled && 'opacity-60 cursor-not-allowed pointer-events-none',
        props.loading && 'text-transparent'
    ].filter(Boolean);

    return [...baseClasses, ...typeClasses, ...sizeClasses, ...roundedClasses, ...stateClasses].join(' ');
});

// 类型样式映射
const getTypeClasses = (type) => {
    const typeMap = {
        default: ['bg-neutral-100', 'border-neutral-300', 'text-neutral-900', 'hover:bg-neutral-200', 'hover:border-neutral-400'],
        primary: ['bg-primary-600', 'border-primary-600', 'text-white', 'hover:bg-primary-700', 'hover:border-primary-700'],
        success: ['bg-green-600', 'border-green-600', 'text-white', 'hover:bg-green-700', 'hover:border-green-700'],
        error: ['bg-red-600', 'border-red-600', 'text-white', 'hover:bg-red-700', 'hover:border-red-700'],
        danger: ['bg-red-600', 'border-red-600', 'text-white', 'hover:bg-red-700', 'hover:border-red-700'],
        warning: ['bg-yellow-500', 'border-yellow-500', 'text-neutral-900', 'hover:bg-yellow-600', 'hover:border-yellow-600'],
        info: ['bg-blue-600', 'border-blue-600', 'text-white', 'hover:bg-blue-700', 'hover:border-blue-700'],
        outline: ['bg-transparent', 'border-neutral-300', 'text-neutral-900', 'hover:bg-neutral-50', 'hover:border-neutral-400'],
        ghost: ['bg-transparent', 'border-transparent', 'text-neutral-900', 'hover:bg-neutral-100'],
        link: ['bg-transparent', 'border-transparent', 'text-primary-600', 'underline', 'hover:text-primary-700', 'hover:no-underline']
    };
    
    return typeMap[type] || typeMap.default;
};

// 尺寸样式映射
const getSizeClasses = (size) => {
    const sizeMap = {
        sm: ['px-3', 'py-1', 'text-xs', 'gap-1', 'min-h-6'],
        md: ['px-4', 'py-1.5', 'text-sm', 'gap-1.5', 'min-h-8'],
        lg: ['px-5', 'py-2', 'text-base', 'gap-2', 'min-h-10']
    };
    
    return sizeMap[size] || sizeMap.md;
};

// 圆角样式映射
const getRoundedClasses = (rounded) => {
    const roundedMap = {
        none: ['rounded-none'],
        sm: ['rounded-sm'],
        md: ['rounded-md'],
        lg: ['rounded-lg'],
        xl: ['rounded-xl'],
        full: ['rounded-full']
    };
    
    return roundedMap[rounded] || ['rounded'];
};

const clickHandler = (e) => {
    if (!props.disabled && !props.loading) {
        emit('click', e);
    }
};
</script>

<style scoped>
/* 聚焦状态样式 */
button:focus-visible {
    outline: 2px solid theme('colors.primary.300');
    outline-offset: 2px;
}

/* 禁用状态下的悬停效果需要禁用 */
button:disabled {
    pointer-events: none;
}

/* 确保加载状态下动画正常工作 */
.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
</style>