<template>
  <button 
    class="inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="computedClass"
    :disabled="disabled"
    @click="clickHandler">
    <slot />
  </button>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
const props = defineProps({
    type: { 
        type: String,
        default: 'default',
        validator: (value) => ['default','primary','success','error','danger','warning','info','secondary','accent','outline','ghost','link'].includes(value)
    },
    size:{
        type:String,
        validator: (value) => ['sm','md','lg'].includes(value),
        default:'md'
    },
    rounded:{
        type:String,
        validator: (value) => ['','none','sm','md','lg','xl','full'].includes(value),
        default:''
    },
    disabled: Boolean
}),emit = defineEmits(['click']);
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
    props.disabled || emit('click',e)
}
</script>

<style>

</style>