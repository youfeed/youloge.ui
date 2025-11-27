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
        <span class="inline-flex items-center" :class="{ 'opacity-0': loading }">
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

// 使用 Tailwind CSS 配置计算按钮类名
const buttonClass = computed(() => {
    // 基础样式 - 使用我们定义的 btn 组件样式
    const classes = ['btn'];
    
    // 类型样式 - 使用 Tailwind 原生颜色
    const typeClass = getTypeClass(props.type);
    if (typeClass) classes.push(typeClass);
    
    // 尺寸样式 - 使用 Tailwind 原生类
    const sizeClass = getSizeClass(props.size);
    if (sizeClass) classes.push(sizeClass);
    
    // 圆角样式
    const roundedClass = getRoundedClass(props.rounded);
    if (roundedClass) classes.push(roundedClass);
    
    // 状态样式
    if (props.block) classes.push('w-full');
    if (props.disabled) classes.push('disabled');
    if (props.loading) classes.push('relative');
    
    // 添加交互反馈
    if (!props.disabled && !props.loading) {
        classes.push('btn-press');
    }
    
    return classes.join(' ');
});

// 类型样式映射 - 使用 Tailwind 原生颜色
const getTypeClass = (type) => {
    const typeMap = {
        default: 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200 hover:border-slate-400',
        primary: 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700',
        success: 'bg-green-600 border-green-600 text-white hover:bg-green-700 hover:border-green-700',
        error: 'bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700',
        danger: 'bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700',
        warning: 'bg-amber-500 border-amber-500 text-slate-900 hover:bg-amber-600 hover:border-amber-600',
        info: 'bg-cyan-600 border-cyan-600 text-white hover:bg-cyan-700 hover:border-cyan-700',
        outline: 'bg-transparent border-slate-300 text-slate-900 hover:bg-slate-50 hover:border-slate-400',
        ghost: 'bg-transparent border-transparent text-slate-900 hover:bg-slate-100',
        link: 'bg-transparent border-transparent text-blue-600 underline hover:text-blue-700 hover:no-underline'
    };
    
    return typeMap[type] || typeMap.default;
};

// 尺寸样式映射 - 使用 Tailwind 原生类
const getSizeClass = (size) => {
    const sizeMap = {
        sm: 'px-3 py-1 text-xs gap-1 min-h-6',
        md: 'px-4 py-1.5 text-sm gap-1.5 min-h-8',
        lg: 'px-5 py-2 text-base gap-2 min-h-10'
    };
    
    return sizeMap[size] || sizeMap.md;
};

// 圆角样式映射 - 使用 Tailwind 原生类
const getRoundedClass = (rounded) => {
    if (!rounded) return 'rounded-md';
    
    const roundedMap = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
    };
    
    return roundedMap[rounded] || 'rounded-md';
};

const clickHandler = (e) => {
    if (!props.disabled && !props.loading) {
        emit('click', e);
    }
};
</script>

