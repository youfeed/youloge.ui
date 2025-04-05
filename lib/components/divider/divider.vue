<template>
  <div :class="classed">
    <div v-if="$slots.default" :class="classlot">
        <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  height: {
    type: String,
    default: 'sm',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  position: {
    type: String,
    default: 'center',
    validator: (value) => ['center', 'left', 'right'].includes(value)
  }
});
const classed = computed(() => {
  return {
    'block relative h-[1px] bg-gray-200 border-t-1': true,
    'my-8': props.height === 'sm',
    'my-10': props.height === 'md',
    'my-16': props.height === 'lg'
  }
});
const classlot = computed(() => {
    return {
        'absolute text-gray px-2 bg-white -top-3': true,
        'left-1/2 -translate-x-1/2': props.position === 'center',
        'left-4': props.position === 'left',
        'right-4': props.position === 'right',
    }
});
</script>

<style>

</style>