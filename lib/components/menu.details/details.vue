<!-- YMenuDetails.vue -->
<template>
    <div class="y-menu-details" :class="detailsClass">
        <!-- 有子菜单的情况 -->
        <details v-if="hasChildren" :open="isOpen" @toggle="handleToggle">
            <summary class="y-menu-details__summary" :class="summaryClass">
                <span v-if="item.icon" class="y-menu-details__icon">
                    <y-icon :name="item.icon"></y-icon>
                </span>
                
                <span class="y-menu-details__label" :title="item.label">
                    {{ item.label }}
                </span>
                
                <span class="y-menu-details__arrow"></span>
            </summary>
            
            <div class="y-menu-details__content">
                <y-menu-details
                    v-for="child in item.children"
                    :key="child.uuid"
                    :item="child"
                    v-model:active="activeModel"
                    :theme="theme"
                    @item-click="$emit('item-click', $event)"
                />
            </div>
        </details>
        
        <!-- 叶子节点（无子菜单） -->
        <div v-else 
             class="y-menu-details__item" 
             :class="itemClass" 
             @click="handleClick">
            <span v-if="item.icon" class="y-menu-details__icon">
                <y-icon :name="item.icon"></y-icon>
            </span>
            
            <span class="y-menu-details__label" :title="item.label">
                {{ item.label }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    theme: {
        type: String,
        default: 'light'
    }
})

// 使用 defineModel 接收 active 状态
const activeModel = defineModel('active', {
    type: Object,
    default: () => ({})
})
// 内部状态管理展开/折叠
const isOpen = ref(false) // 默认展开

// 计算属性
const hasChildren = computed(() => {
    return props.item.children && props.item.children.length > 0
})

const isActive = computed(() => {
    return activeModel.value?.uuid === props.item.uuid
})
// 
const handleToggle = (event) => {
    isOpen.value = event.target.open
}

const handleClick = () => {
    if (props.item.disabled) return
    activeModel.value = props.item;
}
const detailsClass = computed(() => [
    'y-menu-details',
    {
        'y-menu-details--has-children': hasChildren.value,
        'y-menu-details--leaf': !hasChildren.value
    }
])

const summaryClass = computed(() => [
    'y-menu-details__summary',
    {
        'y-menu-details__summary--active': isActive.value,
        'y-menu-details__summary--open': isOpen.value
    }
])

const itemClass = computed(() => [
    'y-menu-details__item',
    {
        'y-menu-details__item--active': isActive.value,
        'y-menu-details__item--disabled': props.item.disabled
    }
])
</script>

<style scoped>
.y-menu-details {
    margin: 0;
}

.y-menu-details__summary {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    list-style: none;
    border: none;
    background: none;
    width: auto;
    text-align: left;
    font: inherit;
    color: inherit;
}

.y-menu-details__summary::-webkit-details-marker {
    display: none;
}

.y-menu-details__summary:hover {
    background-color: var(--neutral-100);
}

.y-menu-details--dark .y-menu-details__summary:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.y-menu-details__summary--active {
    color: var(--primary-600);
    background-color: var(--primary-50);
}

.y-menu-details--dark .y-menu-details__summary--active {
    color: var(--primary-300);
    background-color: rgba(24, 144, 255, 0.2);
}

.y-menu-details__item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.y-menu-details__item:hover {
    background-color: var(--neutral-50);
}

.y-menu-details--dark .y-menu-details__item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.y-menu-details__item--active {
    color: var(--primary-600);
    background-color: var(--primary-50);
}

.y-menu-details--dark .y-menu-details__item--active {
    color: var(--primary-300);
    background-color: rgba(24, 144, 255, 0.2);
}

.y-menu-details__item--disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.y-menu-details__item--disabled:hover {
    background-color: transparent;
}

.y-menu-details__icon {
    margin-right: 8px;
    flex-shrink: 0;
}

.y-menu-details__label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.y-menu-details__arrow {
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid currentColor;
    transition: transform 0.3s ease;
    margin-left: auto;
}

.y-menu-details__summary--open .y-menu-details__arrow {
    transform: rotate(180deg);
}

.y-menu-details__content {
    padding-left: 16px; /* 让浏览器自动处理缩进 */
    background-color: var(--neutral-100);
}

.y-menu-details--dark .y-menu-details__content {
    background-color: rgba(255, 255, 255, 0.05);
}
</style>