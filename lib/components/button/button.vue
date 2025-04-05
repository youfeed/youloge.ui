<template>
  <button 
    :class="classed"
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
const classed = computed(() => {
    return {
        'y-button px-2 py-1 text-white text-gray bg-gray-500 hover:opacity-50 rounded': true,
        [`bg-${props.type}`]: true,
        [`rounded-${props.rounded}`]: props.rounded,
        'cursor-not-allowed opacity-50': props.disabled,
    }
});
//
const clickHandler = (e) => {
    props.disabled || emit('click',e)
}
</script>

<style>

</style>