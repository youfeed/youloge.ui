<template>
    <div class="y-navbar" :class="navbarClass" :style="navbarStyle">
        <nav class="y-navbar__container">
            <!-- 左侧区域 -->
            <div class="y-navbar__header">
                <slot name="header" />
            </div>
            <!-- 导航容器 -->
            <div class="y-navbar__content flex">
                <div class="" v-for="item in options" :key="item.uuid">
                    <y-button type="link" @click="itemClick(item)">{{ item.label }}</y-button>
                </div>
            </div>
            <!-- 右侧区域 -->
            <div class="y-navbar__footer">
                <slot name="footer" />
            </div>
        </nav>
        <!-- submenu 当展开方式为normal 导航容器有子菜单时候横向展示子菜单 -->
        <div v-if="props.type == 'normal' && activeOption.children?.length > 0" class="y-navbar__breadcrumb flex ">
            <div class="" v-for="item in activeOption.children" :key="item.uuid">
                <y-button type="link">{{ item.label }}</y-button>
            </div>
        </div>
        <!-- breadcrumb 插槽 -->
        <div v-if="slots.breadcrumb" class="y-navbar__breadcrumb">
            <slot name="breadcrumb" />
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref, toRaw, toRefs, useSlots } from 'vue'
const slots = useSlots();
const props = defineProps({
    // 二级菜单展开方式
    type: {
        type: String,
        default: 'normal',
        validator: (value) => ['normal', 'popup'].includes(value)
    },
    // 只支持到二级 三级忽略
    options: {
        type: Array,
        default: []
    },
    items: {
        type: Array,
        required: true,
    },
    align: {
        type: String,
        default: 'left',
        validator: (value) => ['left', 'center', 'right'].includes(value)
    },
    fixed: {
        type: Boolean,
        default: false
    },
}), emits = defineEmits(['change']);

const isMobile = ref(false)
const state = reactive({
    activeOption: {},
}), { activeOption } = toRefs(state);



// 点击选中
const itemClick = (item) => {
    state.activeOption = item
};



// 计算属性
const options = computed(() => {
    // 1. 用 toRaw 取出 props.options 的原始数据（避免响应式代理干扰）
    const rawOptions = toRaw(props.options);

    // 2. 定义 replacer：只给“非数组、非null、纯对象”添加 uuid
    const replacer = (key, value) => {
        // 过滤：只处理“节点对象”（排除数组、null、基础类型）
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // 关键：返回新对象（不修改原 value），合并原属性 + 新 uuid
            return {
                ...value,
                uuid: value.uuid || crypto.randomUUID(),
                label: value.label || value.title || `导航`,
                icon: value.icon || '',
                disabled: value.disabled || false,
                children: value.children || [],
                active: value.active || false
            };
        }
        // 数组、基础类型（字符串/数字）直接返回，不处理
        return value;
    };

    // 3. 执行递归修改（stringify + parse）
    const modifiedData = JSON.parse(JSON.stringify(rawOptions, replacer));

    console.log('modifiedData', modifiedData);
    return modifiedData;
});
const navbarClass = computed(() => [
    'y-navbar',
    `y-navbar--${props.theme}`,
    `y-navbar--${props.align}`,
    {
        'y-navbar--fixed': props.fixed,
        'y-navbar--mobile': isMobile.value,
        // 'y-navbar--mobile-open': isMobileMenuOpen.value
    }
])
const navbarStyle = computed(() => {
    const style = {}

    if (props.height) {
        style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    }

    if (props.background) {
        style.background = props.background
    }

    if (props.textColor) {
        style.color = props.textColor
    }

    return style
})
</script>

<style scoped>
.y-navbar {
    position: relative;
    background: var(--white);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    width: 100%;
    height: 100%;
}

.y-navbar--fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
}

.y-navbar__container {
    display: flex;
    align-items: center;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 24px;
    height: 100%;
}

.y-navbar__header {
    display: flex;
    align-items: center;
    margin-right: auto;
    flex-shrink: 0;
}
.y-navbar__content{
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
}
.y-navbar__breadcrumb{
    display: flex;
    align-items: center;
    max-width: 100%;
    height: 30px;
    background: var(--white);
}
</style>