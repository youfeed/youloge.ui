<template>
    <component :is="href ? 'a' : 'span'" 
        :class="linkClasses"
        :href="href && !disabled ? href : undefined"
        :target="target && !disabled ? target : undefined"
        :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
        @click="clickHandler">
        <slot name="icon-left" class="shrink-0 w-4 h-4 flex items-center justify-center" :class="iconLeftClass" />
        <slot class="inline-flex items-center" />
        <slot name="icon-right" class="shrink-0 w-4 h-4 flex items-center justify-center" :class="iconRightClass" />
    </component>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

defineOptions({ name: 'y-link' })

const props = defineProps({
    type: {
        type: String,
        default: 'default',
        validator: (value) => ['default', 'primary', 'secondary', 'danger', 'success', 'info'].includes(value)
    },
    href: { type: String, default: '' },
    target: {
        type: String,
        default: '_self',
        validator: (value) => ['_self', '_blank', '_parent', '_top'].includes(value)
    },
    disabled: { type: Boolean, default: false },
    noHover: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    underline: {
        type: String,
        default: 'hover',
        validator: (value) => ['hover', 'always', 'none'].includes(value)
    }
})

const emit = defineEmits(['click'])

const clickHandler = (e) => {
    if (props.disabled) {
        e.preventDefault()
        e.stopPropagation()
        return
    }
    if (!props.href) {
        e.preventDefault()
        emit('click', e)
    }
}

// 基础样式
const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-sans',
    'text-sm',
    'font-normal',
    'no-underline',
    'cursor-pointer',
    'box-border',
    'transition-all',
    'duration-200',
    'ease-in-out',
    'focus:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-gray-100',
    'focus-visible:ring-offset-4',
    'focus-visible:ring-offset-blue-500',
    'focus-visible:ring-opacity-30',
    'rounded'
]

// 颜色映射
const colorClasses = {
    default: 'text-blue-600',
    primary: 'text-blue-700',
    secondary: 'text-gray-500',
    danger: 'text-red-600',
    success: 'text-green-600',
    info: 'text-blue-500'
}

// Hover 颜色映射
const hoverColorClasses = {
    default: 'hover:text-blue-700 hover:bg-gray-100',
    primary: 'hover:text-blue-800 hover:bg-gray-100',
    secondary: 'hover:text-gray-800 hover:bg-gray-100',
    danger: 'hover:text-red-700 hover:bg-gray-100',
    success: 'hover:text-green-700 hover:bg-gray-100',
    info: 'hover:text-blue-600 hover:bg-gray-100'
}

// 下划线样式
const underlineClasses = {
    always: 'underline underline-offset-2',
    hover: 'hover:underline hover:underline-offset-2',
    none: 'no-underline'
}

// 计算链接样式类
const linkClasses = computed(() => {
    return [
        ...baseClasses,
        colorClasses[props.type],
        props.disabled ? 'text-gray-400 cursor-not-allowed pointer-events-none' : '',
        props.noHover ? '' : hoverColorClasses[props.type],
        props.block ? 'flex w-full justify-start' : '',
        underlineClasses[props.underline]
    ].filter(Boolean)
})

// 图标间距
const iconLeftClass = computed(() => props.block ? 'mr-1' : 'mr-1')
const iconRightClass = computed(() => props.block ? 'ml-1' : 'ml-1')
</script>

<style scoped>
/* 自定义样式处理响应式设计 */
@media (max-width: 575px) {
    .y-link {
        font-size: 12px;
    }
    
    .y-link :deep(.y-link__icon) {
        width: 14px;
        height: 14px;
    }
}
</style>