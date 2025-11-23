<!-- y-menu.vue -->
<template>
    <nav 
        class="y-menu" 
        :class="computedClass"
        :aria-orientation="orientation"
        role="menu"
    >
        <!-- 菜单标题 -->
        <div v-if="$slots.header || title" class="y-menu__header">
            <slot name="header">
                <h3 v-if="title" class="y-menu__title">{{ title }}</h3>
            </slot>
        </div>
        
        <!-- 菜单项容器 -->
        <ul class="y-menu__list" :class="listClass" role="none">
            <slot />
        </ul>
        
        <!-- 菜单底部 -->
        <div v-if="$slots.footer" class="y-menu__footer">
            <slot name="footer" />
        </div>
    </nav>
</template>

<script setup>
import { computed, provide } from 'vue'

const props = defineProps({
    // 菜单模式：vertical(侧边栏) / horizontal(导航栏)
    mode: {
        type: String,
        default: 'vertical',
        validator: (value) => ['vertical', 'horizontal'].includes(value)
    },
    // 菜单方向
    orientation: {
        type: String,
        default: 'vertical',
        validator: (value) => ['vertical', 'horizontal'].includes(value)
    },
    // 激活的菜单项key
    activeKey: [String, Number],
    // 标题
    title: String,
    // 尺寸
    size: {
        type: String,
        default: 'md',
        validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    // 是否可折叠
    collapsible: Boolean,
    // 是否折叠
    collapsed: Boolean,
    // 主题风格
    theme: {
        type: String,
        default: 'default',
        validator: (value) => ['default', 'primary', 'neutral', 'dark'].includes(value)
    },
    // 内边距
    padding: {
        type: String,
        default: 'normal',
        validator: (value) => ['none', 'compact', 'normal', 'comfortable'].includes(value)
    }
})

const emit = defineEmits(['update:activeKey', 'update:collapsed', 'item-click'])

// 计算根类名
const computedClass = computed(() => {
    return [
        `y-menu--${props.mode}`,
        `y-menu--${props.size}`,
        `y-menu--${props.theme}`,
        `y-menu--padding-${props.padding}`,
        {
            'y-menu--collapsible': props.collapsible,
            'y-menu--collapsed': props.collapsed,
            'y-menu--selectable': props.activeKey !== undefined
        }
    ].filter(Boolean).join(' ')
})

// 列表容器类
const listClass = computed(() => {
    return {
        'y-menu__list--horizontal': props.mode === 'horizontal',
        'y-menu__list--vertical': props.mode === 'vertical'
    }
})

// 提供上下文给子菜单项
provide('y-menu-context', {
    mode: computed(() => props.mode),
    size: computed(() => props.size),
    theme: computed(() => props.theme),
    activeKey: computed(() => props.activeKey),
    collapsed: computed(() => props.collapsed),
    onItemClick: (item) => {
        emit('item-click', item)
        if (item.key !== undefined) {
            emit('update:activeKey', item.key)
        }
    }
})
</script>

<style>
.y-menu {
    font-family: var(--font-family);
    box-sizing: border-box;
}

/* 模式样式 */
.y-menu--vertical {
    width: var(--menu-width, 240px);
    background: var(--menu-bg, var(--white));
    border-right: 1px solid var(--menu-border-color, var(--neutral-200));
    transition: all 0.3s ease;
}

.y-menu--horizontal {
    width: 100%;
    background: var(--menu-bg, var(--white));
    border-bottom: 1px solid var(--menu-border-color, var(--neutral-200));
}

/* 折叠状态 */
.y-menu--collapsed {
    width: var(--menu-collapsed-width, 60px);
}

/* 尺寸控制 */
.y-menu--sm {
    --menu-width: 200px;
    --menu-collapsed-width: 48px;
    font-size: var(--font-size-sm);
}

.y-menu--md {
    --menu-width: 240px;
    --menu-collapsed-width: 60px;
    font-size: var(--font-size-base);
}

.y-menu--lg {
    --menu-width: 280px;
    --menu-collapsed-width: 72px;
    font-size: var(--font-size-lg);
}

/* 内边距控制 */
.y-menu--padding-none .y-menu__item {
    padding: 0;
}

.y-menu--padding-compact .y-menu__item {
    padding: var(--spacing-1) var(--spacing-2);
}

.y-menu--padding-normal .y-menu__item {
    padding: var(--spacing-2) var(--spacing-3);
}

.y-menu--padding-comfortable .y-menu__item {
    padding: var(--spacing-3) var(--spacing-4);
}

/* 主题样式 */
.y-menu--default {
    --menu-bg: var(--white);
    --menu-border-color: var(--neutral-200);
    --menu-item-hover-bg: var(--neutral-100);
    --menu-item-active-bg: var(--primary-10);
    --menu-item-active-color: var(--primary);
}

.y-menu--primary {
    --menu-bg: var(--primary);
    --menu-border-color: var(--primary-active);
    --menu-item-hover-bg: rgba(255, 255, 255, 0.1);
    --menu-item-active-bg: rgba(255, 255, 255, 0.2);
    --menu-item-active-color: var(--white);
    color: var(--white);
}

.y-menu--neutral {
    --menu-bg: var(--neutral-50);
    --menu-border-color: var(--neutral-200);
    --menu-item-hover-bg: var(--neutral-100);
    --menu-item-active-bg: var(--neutral-200);
    --menu-item-active-color: var(--neutral-900);
}

.y-menu--dark {
    --menu-bg: var(--neutral-900);
    --menu-border-color: var(--neutral-700);
    --menu-item-hover-bg: var(--neutral-800);
    --menu-item-active-bg: var(--primary-20);
    --menu-item-active-color: var(--primary);
    color: var(--neutral-100);
}

/* 菜单头部 */
.y-menu__header {
    padding: var(--spacing-4) var(--spacing-4) var(--spacing-2);
    border-bottom: 1px solid var(--menu-border-color);
}

.y-menu__title {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: inherit;
}

/* 菜单列表 */
.y-menu__list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.y-menu__list--vertical {
    display: flex;
    flex-direction: column;
}

.y-menu__list--horizontal {
    display: flex;
    flex-direction: row;
}

/* 菜单底部 */
.y-menu__footer {
    padding: var(--spacing-4);
    border-top: 1px solid var(--menu-border-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .y-menu--horizontal {
        flex-direction: column;
    }
    
    .y-menu--horizontal .y-menu__list {
        flex-direction: column;
    }
}
</style>