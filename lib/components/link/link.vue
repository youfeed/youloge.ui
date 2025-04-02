<template>
  <a
    class="y-link"
    :class="[

    ]"
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
        values: ['primary', 'success', 'warning', 'info', 'danger', 'default'],
        default: 'default',
    },
    underline: {
        type: Boolean,
        default: true,
    },
    href: { type: String, default: '' },
    target: {
        type: String,
        values:['_blank','_parent','_self','_top'],
        default: '_self',
    },
});
const emit = defineEmits({
    click: (e) => e instanceof MouseEvent,
});
//
const linkKls = computed(() => {
    return [
        'y-link',
        { [`bg-${props.type}`]: props.type },
        { [`y-link-underline`]: props.underline },
        { 'y-link-disabled': props.disabled }
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
