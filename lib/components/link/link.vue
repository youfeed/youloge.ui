<template>
    <component :is="hasHref ? 'a' : 'span'"
        class="inline-flex items-center font-medium transition-colors duration-200 focus:outline-none focus:underline"
        :class="computedClass" :href="href" :target="external ? '_blank' : undefined"
        :rel="external ? 'noopener noreferrer' : undefined" :disabled="disabled" @click="$emit('click')">
        <slot></slot>
        <span v-if="external" class="ml-1 text-xs">↗</span>
    </component>
</template>

<script setup>
import { computed } from 'vue'
// defineOptions({ name: 'yLink' })
const props = defineProps({
    // 链接类型：默认/主要/危险/-muted（弱化）
    type: {
        type: String,
        default: 'default',
        validator: (val) => ['default', 'primary', 'danger', 'muted'].includes(val)
        // validator: (value) => ['primary', 'success', 'warning', 'info', 'danger', 'default'].includes(value)
    },
    // 是否外部链接（添加图标+新窗口打开）
    external: {
        type: Boolean,
        default: false
    },
    target: {
        type: String,
        default: '_blank',
        validator: (value) => ['_blank', '_self', '_parent', '_top'].includes(value)
    },
    underline: { 
        type: String, 
        default: 'hover',
        validator: (val) => ['hover', 'always', 'never'].includes(val)
    },
    disabled: { type: Boolean, default: false },
    href: { type: String, default: '' },
});
const emit = defineEmits({
    click: (e) => e instanceof MouseEvent,
});
// 计算是否有有效href
const hasHref = computed(() => !!props.href && !props.disabled)
//
const computedClass = computed(() => {
    // 类型配色：贴合GitHub原生链接风格（主蓝、灰调、危险红）
    const typeClasses = {
        default: 'text-gray-900 dark:text-gray-100',
        primary: 'text-blue-600 dark:text-blue-400', // GitHub主链接色
        danger: 'text-red-600 dark:text-red-400',    // 危险操作链接
        muted: 'text-gray-500 dark:text-gray-400'   // 弱化链接（如辅助文本）
    }
    // 下划线样式：按配置控制显示逻辑
    const underlineClasses = {
        hover: 'no-underline hover:underline', // 默认hover显示下划线
        always: 'underline',                   // 始终显示下划线
        never: 'no-underline'                  // 永不显示下划线
    }
    // 禁用状态：降低透明度、取消交互效果
    const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none hover:no-underline' : '';
    return `${typeClasses[props.type]} ${underlineClasses[props.underline]} ${disabledClass}`
})
//
function handleClick(event) {
    props.disabled || emit('click', event)
}
</script>

<style></style>
