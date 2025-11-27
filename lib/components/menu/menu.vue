<!-- YMenu.vue -->
<template>
    <div class="y-menu" :class="menuClass" :style="menuStyle">
        <!-- 头部区域 -->
        <div v-if="hasHeaderSlot" class="y-menu__header">
            <slot name="header" />
        </div>

        <!-- 菜单容器 -->
        <div class="y-menu__content">
            <!-- 递归渲染菜单项 -->
            <y-menu-details 
                v-for="item in options" 
                :key="item.uuid" 
                :item="item" 
                v-model:active="activeModel"
                :theme="theme"
            />
        </div>

        <!-- 底部区域 -->
        <div v-if="hasFooterSlot" class="y-menu__footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script setup>
import { watch } from 'less'
import { computed, useSlots } from 'vue'

const slots = useSlots()

// 控制菜单展开方式
const statusModel = defineModel('status', { 
    type: String,
    default: 'expand',
    validator: val => ['expand','collapse','hide'].includes(val)
})

// 活跃选中的栏目
const activeModel = defineModel('active', {
    type: Object,
    default: () => ({})
})

const props = defineProps({
    // 菜单数据（支持无限级嵌套）
    options: {
        type: Array,
        default: () => []
    },
    // 菜单宽度
    width: {
        type: [String, Number],
        default: '320px'
    },
    // 主题色
    theme: {
        type: String,
        default: 'light',
        validator: val => ['light', 'dark'].includes(val)
    }
})

const emit = defineEmits(['select'])

// 处理菜单数据，确保每个项都有必要的字段
const options = computed(() => {
    const addUUIDToItems = (items) => {
        return items.map((item, index) => {
            const newItem = {
                ...item,
                uuid: item.uuid || crypto.randomUUID(),
                key: item.key || `menu-item-${index}`,
                label: item.label || item.title || `菜单 ${index + 1}`,
                icon: item.icon || '',
                disabled: item.disabled || false,
                children: item.children || []
            }
            
            // 递归处理子项
            if (newItem.children && newItem.children.length > 0) {
                newItem.children = addUUIDToItems(newItem.children)
            }
            
            return newItem
        })
    }
    
    return addUUIDToItems(JSON.parse(JSON.stringify(props.options)))
})

// 计算属性
const hasHeaderSlot = computed(() => !!slots.header)
const hasFooterSlot = computed(() => !!slots.footer)

const menuClass = computed(() => [
    'y-menu',
    `y-menu--${props.theme}`,
    `y-menu--${statusModel.value}`,
])

const menuStyle = computed(() => {
    const style = {}
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    
    if (statusModel.value === 'collapse') {
        style.width = '80px' // 折叠状态下的宽度
    } else if (statusModel.value === 'hide') {
        style.width = '0'
        style.overflow = 'hidden'
    }
    
    return style
});
// 暴露方法给父组件
defineExpose({
    toggleStatus: (val) => {
        statusModel.value = val
    },
    setActive: (item) => {
        activeModel.value = item
    },
    getOptions:()=>{
        return options.value
    },
})
</script>

<style scoped>
.y-menu {
    display: flex;
    flex-direction: column;
    background-color: var(--white);
    max-width: 100vw;
    transition: all 0.3s ease;
    border-right: 1px solid var(--neutral-200);
    height: 100%;
}

.y-menu__content {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
}

/* 主题样式 */
.y-menu--light {
    background: #ffffff;
    color: #333333;
    border-right-color: #f0f0f0;
}

.y-menu--dark {
    background: #001529;
    color: rgba(255, 255, 255, 0.65);
    border-right-color: #434343;
}

/* 折叠状态 */
.y-menu--collapse {
    width: 80px !important;
}

.y-menu--collapse .y-menu__content {
    overflow: visible;
}

.y-menu--hide {
    width: 0 !important;
    overflow: hidden;
}

/* 头部和底部 */
.y-menu__header {
    padding: 16px;
    border-bottom: 1px solid var(--neutral-200);
}

.y-menu--dark .y-menu__header {
    border-bottom-color: #434343;
}

.y-menu__footer {
    padding: 16px;
    border-top: 1px solid var(--neutral-200);
}

.y-menu--dark .y-menu__footer {
    border-top-color: #434343;
}

/* 滚动条样式 */
.y-menu__content::-webkit-scrollbar {
    width: 6px;
}

.y-menu__content::-webkit-scrollbar-track {
    background: transparent;
}

.y-menu__content::-webkit-scrollbar-thumb {
    background: var(--neutral-300);
    border-radius: 3px;
}

.y-menu__content::-webkit-scrollbar-thumb:hover {
    background: var(--neutral-400);
}

.y-menu--dark .y-menu__content::-webkit-scrollbar-thumb {
    background: var(--neutral-600);
}

.y-menu--dark .y-menu__content::-webkit-scrollbar-thumb:hover {
    background: var(--neutral-500);
}
</style>