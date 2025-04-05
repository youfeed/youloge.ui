<template>
  <a
    class="y-link"
    :class="classed"
    :href="disabled || !href ? undefined : href"
    :target="disabled || !href ? undefined : target"
    @click="handleClick">
    <slot />
  </a>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
    type: {
        type: String,
        default: 'default',
        validator: (value) => ['primary','success', 'warning', 'info', 'danger', 'default'].includes(value)
    },
    target: {
        type: String,
        default: '_blank',
        validator: (value) => ['_blank', '_self', '_parent', '_top'].includes(value)
    },
    underline: { type: Boolean,default: true },
    disabled: { type: Boolean,default: false },
    href: { type: String, default: '/' },
});
const emit = defineEmits({
    click: (e) => e instanceof MouseEvent,
});
//
const classed = computed(() => {
    return [
        'y-link hover:underline hover:text-blue-500',
        { [`text-${props.type}`]: props.type },
        { [`y-link-underline`]: props.underline },
        { 'cursor-not-allowed opacity-50': props.disabled }
    ]
})
//
function handleClick(event) {
    props.disabled || emit('click', event)
}
//
defineOptions({
  name: 'yLink',
})
</script>

<style></style>
