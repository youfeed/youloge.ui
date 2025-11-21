<template>
    <button class="y-button" :class="computedClass" :data-size="size" :data-type="type" :data-rounded="rounded"
        :data-no-hover="noHover" :disabled="disabled" @click="clickHandler">
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
    // 禁用 hover 效果（部分场景用）
    noHover: {
        type: Boolean,
        default: false
    },
    disabled: Boolean
}), emit = defineEmits(['click']);
// 计算圆角类（映射全局圆角变量）
const roundedClass = computed(() => {
    const roundedMap = {
        '': `border-radius: @border-radius;`,
        'none': `border-radius: 0;`,
        'sm': `border-radius: @border-radius-sm;`,
        'md': `border-radius: @border-radius;`,
        'lg': `border-radius: @border-radius-lg;`,
        'xl': `border-radius: @border-radius-lg + 4px;`,
        'full': `border-radius: 9999px;`
    }
    return roundedMap[props.rounded]
})
// 
const computedClass = computed(() => {
    // 基础样式：间距、字体大小
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-5 py-2.5 text-lg'
    }
    // 类型样式：贴合GitHub配色（主蓝、灰调、危险红）
    const typeClasses = {
        default: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline: 'border border-gray-300 text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
    }
    // 禁用状态样式：降低透明度、取消hover效果
    const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : '';
    return `${sizeClasses[props.size]} ${typeClasses[props.type]} ${disabledClass}`
});
//
const clickHandler = (e) => {
    props.disabled || emit('click', e)
}
</script>

<style lang="less">
// 按钮核心样式（GitHub 风格：居中、无多余装饰）
.y-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: @font-sans;
    font-weight: 500; // GitHub 按钮默认中等权重
    outline: none;
    border: none;
    cursor: pointer;
    box-sizing: border-box;
    // 统一过渡动画（全局混入）
    .transition-base();

    // 禁用状态统一处理（全局混入）
    &:disabled {
        .disabled-state();
    }

    // 聚焦样式（GitHub 风格：细边框+轻微阴影，不突兀）
    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px @neutral-100, 0 0 0 4px fade(@primary-500, 30%);
    }

    // 非禁用且未禁用 hover 时，应用统一 hover 效果（全局混入）
    &:not(:disabled):not([data-no-hover="true"]) {
        .hover-effect();
    }

    // 图标插槽样式（间距适配全局变量）
    &__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: @spacing-1;
        font-size: inherit; // 继承按钮字体大小
    }

    // 文本插槽样式
    &__text {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    // 尺寸适配（基于全局间距/字体变量，通过 data 属性匹配）
    &[data-size="sm"] {
        padding: @spacing-1 @spacing-2;
        font-size: @font-size-xs;

        & __icon {
            width: 16px;
            height: 16px;
        }
    }

    &[data-size="md"] {
        padding: @spacing-2 @spacing-3;
        font-size: @font-size-sm;

        & __icon {
            width: 18px;
            height: 18px;
        }
    }

    &[data-size="lg"] {
        padding: @spacing-2 + 2px @spacing-4;
        font-size: @font-size-base;

        & __icon {
            width: 20px;
            height: 20px;
        }
    }

    // 圆角适配（全局圆角变量，通过 data 属性匹配）
    &[data-rounded="none"] {
        border-radius: 0;
    }

    &[data-rounded="sm"] {
        border-radius: @border-radius-sm;
    }

    &[data-rounded="md"] {
        border-radius: @border-radius;
    }

    &[data-rounded="lg"] {
        border-radius: @border-radius-lg;
    }

    &[data-rounded="xl"] {
        border-radius: @border-radius-lg + 4px;
    }

    &[data-rounded="full"] {
        border-radius: 9999px;
    }

    // 类型样式（GitHub 低饱和度配色风格，通过 data 属性匹配）
    // 1. 默认按钮（灰色调，无强烈对比）
    &[data-type="default"] {
        background-color: @neutral-100;
        color: @text-primary;
        border: 1px solid @border-color;

        &:hover:not(:disabled) {
            background-color: @neutral-200;
            border-color: @border-color-hover;
        }
    }

    // 2. 主按钮（GitHub 蓝，突出但不刺眼）
    &[data-type="primary"] {
        background-color: @primary-500;
        color: #fff;

        &:hover:not(:disabled) {
            background-color: @primary-600;
        }

        &:focus-visible {
            box-shadow: 0 0 0 2px #fff, 0 0 0 4px fade(@primary-500, 30%);
        }
    }

    // 3. 次要按钮（浅灰，比默认更淡）
    &[data-type="secondary"] {
        background-color: @neutral-50;
        color: @text-secondary;
        border: 1px solid @border-color;

        &:hover:not(:disabled) {
            background-color: @neutral-100;
        }
    }

    // 4. 危险/错误按钮（GitHub 红，低饱和度）
    &[data-type="danger"],
    &[data-type="error"] {
        background-color: @danger-500;
        color: #fff;

        &:hover:not(:disabled) {
            background-color: @danger-600;
        }

        &:focus-visible {
            box-shadow: 0 0 0 2px #fff, 0 0 0 4px fade(@danger-500, 30%);
        }
    }

    // 5. 警告按钮（GitHub 黄，低饱和度）
    &[data-type="warning"] {
        background-color: @warning-500;
        color: @neutral-900;

        &:hover:not(:disabled) {
            background-color: @warning-600;
        }
    }

    // 6. 信息按钮（浅蓝，贴合 GitHub 辅助色）
    &[data-type="info"] {
        background-color: @primary-50;
        color: @primary-600;
        border: 1px solid @primary-100;

        &:hover:not(:disabled) {
            background-color: @primary-100;
        }
    }

    // 7. 强调按钮（深灰，比默认更突出）
    &[data-type="accent"] {
        background-color: @neutral-700;
        color: #fff;

        &:hover:not(:disabled) {
            background-color: @neutral-800;
        }
    }

    // 8. 边框按钮（仅边框，无背景）
    &[data-type="outline"] {
        background-color: transparent;
        color: @text-primary;
        border: 1px solid @border-color;

        &:hover:not(:disabled) {
            background-color: @neutral-50;
            border-color: @border-color-hover;
        }
    }

    // 9. 幽灵按钮（hover 才显示背景）
    &[data-type="ghost"] {
        background-color: transparent;
        color: @text-primary;
        border: 1px solid transparent;

        &:hover:not(:disabled) {
            background-color: @neutral-100;
            border-color: @border-color;
        }
    }

    // 10. 链接按钮（无背景无边框，类似链接）
    &[data-type="link"] {
        background-color: transparent;
        color: @text-link;
        border: 1px solid transparent;
        padding: @spacing-1 @spacing-2; // 更小间距
        .link-hover(); // 全局链接混入

        &:hover:not(:disabled) {
            background-color: fade(@primary-500, 5%);
        }
    }
}
</style>