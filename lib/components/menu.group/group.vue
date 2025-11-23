<!-- y-menu-group.vue -->
<template>
    <li class="y-menu-group" role="none">
        <!-- 分组标题 -->
        <div v-if="$slots.header || title" class="y-menu-group__header">
            <slot name="header">
                <span class="y-menu-group__title">{{ title }}</span>
            </slot>
        </div>
        
        <!-- 分组内容 -->
        <ul class="y-menu-group__list" role="none">
            <slot />
        </ul>
    </li>
</template>

<script setup>
defineProps({
    title: String
})
</script>

<style>
.y-menu-group {
    margin: 0;
    padding: 0;
    list-style: none;
}

.y-menu-group__header {
    padding: var(--spacing-3) var(--spacing-4);
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--neutral-600);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.y-menu-group__list {
    margin: 0;
    padding: 0;
    list-style: none;
}
</style>