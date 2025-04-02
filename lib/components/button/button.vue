<template>
  <button 
    class="box-border items-center justify-center rounded text-center inline-flex gap-2 a-button-wrapper-reset m-0"
    :class="[classed,`-${props.size}`,`bg-${props.type}`]"
    hover-class="hover:bg-gray-200"
    active-class="active:bg-gray-300"
    @click="clickHandler"
  >按钮</button>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
const props = defineProps({
    type: { 
        type: String, 
        value: 'default|primary|success|danger|warning|info|secondary|accent|outline|ghost|link',
        default: 'primary' 
    },
    size:{ 
        type:String,
        value: 'sm|md|lg',
        default:'md'
    },
    rounded:{
        type:String,
        value: 'sm|md|lg|full',
        default:'md'
    },
    hover: Boolean,
    active: Boolean,
    hover: Boolean,
    disabled: Boolean
}),emit = defineEmits([])
//
const classed = computed(() => {
    // 
    return {

        'bg-gray-200': props.hover,
        'bg-gray-300': props.active,
        'cursor-not-allowed': props.disabled,
        'opacity-50': props.disabled,
        'text-gray-600': props.disabled,
    }
})
//
const clickHandler = (e) => {
    props.disabled || emit('click',e)
}
</script>

<style>

</style>