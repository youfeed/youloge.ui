<template>
  <div :class="classed">
    <slot name="header"></slot>
    <slot name="default"></slot>
    <slot name="footer"></slot>
  </div>
</template>

<script setup>
import { computed,defineProps } from 'vue';
const props = defineProps({
    border:{
        type:Boolean,
        default:true
    }
}),emits = defineEmits(['']);
const classed = computed(()=>({
    'block p-1':true,
    'border': props.border
}));
</script>

<style>

</style>