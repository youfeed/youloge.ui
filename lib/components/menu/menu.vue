<template>
  <div 
    class="y-menu"
    :class="menuClass"
    :style="menuStyle"
  >
    <!-- Logo 区域 -->
    <div v-if="hasLogoSlot" class="y-menu__logo">
      <slot name="logo" />
    </div>

    <!-- 菜单容器 -->
    <div class="y-menu__container">
      <!-- 左侧内容 -->
      <div v-if="hasLeftSlot" class="y-menu__left">
        <slot name="left" />
      </div>

      <!-- 菜单内容 -->
      <div class="y-menu__content" :class="contentClass">
        <!-- 水平菜单 -->
        <template v-if="mode === 'horizontal'">
          <ul class="y-menu__horizontal">
            <template v-for="(item, index) in options" :key="getItemKey(item, index)">
              <!-- 有子菜单：使用 group 组件 -->
              <y-menu-group
                v-if="hasChildren(item)"
                :item="item"
                :level="0"
                :mode="mode"
                :active-key="internalActiveKey"
                :open-keys="internalOpenKeys"
                @item-click="handleItemClick"
                @submenu-change="handleSubmenuChange"
              >
                <!-- 传递插槽 -->
                <template v-if="hasSlot(item)" #[getSlotName(item)]="{ item: slotItem }">
                  <slot :name="getSlotName(slotItem)" :item="slotItem" />
                </template>
              </y-menu-group>
              
              <!-- 无子菜单：使用 item 组件 -->
              <y-menu-item
                v-else
                :item="item"
                :level="0"
                :mode="mode"
                :active-key="internalActiveKey"
                @click="handleItemClick(item)"
              >
                <template v-if="hasSlot(item)" #[getSlotName(item)]="{ item: slotItem }">
                  <slot :name="getSlotName(slotItem)" :item="slotItem" />
                </template>
              </y-menu-item>
            </template>
          </ul>
        </template>
        
        <!-- 垂直菜单 -->
        <template v-else>
          <ul class="y-menu__vertical">
            <template v-for="(item, index) in options" :key="getItemKey(item, index)">
              <!-- 有子菜单：使用 group 组件 -->
              <y-menu-group
                v-if="hasChildren(item)"
                :item="item"
                :level="0"
                :mode="mode"
                :active-key="internalActiveKey"
                :open-keys="internalOpenKeys"
                @item-click="handleItemClick"
                @submenu-change="handleSubmenuChange"
              >
                <template v-if="hasSlot(item)" #[getSlotName(item)]="{ item: slotItem }">
                  <slot :name="getSlotName(slotItem)" :item="slotItem" />
                </template>
              </y-menu-group>
              
              <!-- 无子菜单：使用 item 组件 -->
              <y-menu-item
                v-else
                :item="item"
                :level="0"
                :mode="mode"
                :active-key="internalActiveKey"
                @click="handleItemClick(item)"
              >
                <template v-if="hasSlot(item)" #[getSlotName(item)]="{ item: slotItem }">
                  <slot :name="getSlotName(slotItem)" :item="slotItem" />
                </template>
              </y-menu-item>
            </template>
          </ul>
        </template>
      </div>

      <!-- 右侧内容 -->
      <div v-if="hasRightSlot" class="y-menu__right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, useSlots } from 'vue'
// import YMenuGroup from './YMenuGroup.vue'
// import YMenuItem from './YMenuItem.vue'

const slots = useSlots()

const props = defineProps({
  // 菜单模式
  mode: {
    type: String,
    default: 'vertical',
    validator: val => ['vertical', 'horizontal'].includes(val)
  },
  // 菜单数据（最多支持2级）
  options: {
    type: Array,
    default: () => []
  },
  // 当前选中的菜单项 key
  activeKey: {
    type: [String, Number],
    default: ''
  },
  // 当前展开的子菜单 key 数组
  openKeys: {
    type: Array,
    default: () => []
  },
  // 菜单宽度（垂直模式）
  width: {
    type: [String, Number],
    default: '200px'
  },
  // 菜单高度（水平模式）
  height: {
    type: [String, Number],
    default: '64px'
  },
  // 主题色
  theme: {
    type: String,
    default: 'light',
    validator: val => ['light', 'dark'].includes(val)
  },
  // 菜单对齐方式
  align: {
    type: String,
    default: 'start',
    validator: val => ['start', 'center', 'end'].includes(val)
  }
})

const emit = defineEmits(['update:activeKey', 'update:openKeys', 'select', 'open-change'])

// 检查插槽是否存在
const hasLogoSlot = computed(() => !!slots.logo)
const hasLeftSlot = computed(() => !!slots.left)
const hasRightSlot = computed(() => !!slots.right)

// 响应式数据
const internalActiveKey = ref(props.activeKey)
const internalOpenKeys = ref([...props.openKeys])

// 计算属性
const menuClass = computed(() => [
  'y-menu',
  `y-menu--${props.mode}`,
  `y-menu--${props.theme}`
])

const menuStyle = computed(() => ({
  width: props.mode === 'vertical' ? 
    (typeof props.width === 'number' ? `${props.width}px` : props.width) : '100%',
  height: props.mode === 'horizontal' ? 
    (typeof props.height === 'number' ? `${props.height}px` : props.height) : 'auto'
}))

const contentClass = computed(() => [
  'y-menu__content',
  `y-menu__content--${props.align}`
])

// 方法
const getItemKey = (item, index) => {
  return item.key || item.id || `menu-item-${index}`
}

const hasChildren = (item) => {
  return item.children && item.children.length > 0
}

const hasSlot = (item) => {
  return !!slots[getSlotName(item)]
}

const getSlotName = (item) => {
  return item.key
}

const handleItemClick = (item) => {
  if (item.disabled) return
  
  internalActiveKey.value = item.key
  emit('update:activeKey', item.key)
  emit('select', item)
}

const handleSubmenuChange = (item, open) => {
  const key = item.key
  if (open) {
    if (!internalOpenKeys.value.includes(key)) {
      internalOpenKeys.value.push(key)
    }
  } else {
    const index = internalOpenKeys.value.indexOf(key)
    if (index > -1) {
      internalOpenKeys.value.splice(index, 1)
    }
  }
  
  emit('update:openKeys', [...internalOpenKeys.value])
  emit('open-change', internalOpenKeys.value)
}

// 监听 props 变化
watch(() => props.activeKey, (newVal) => {
  internalActiveKey.value = newVal
})

watch(() => props.openKeys, (newVal) => {
  internalOpenKeys.value = [...newVal]
})
</script>

<style scoped>
.y-menu {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.y-menu--light {
  background: #ffffff;
  color: #333333;
  border-bottom: 1px solid #f0f0f0;
}

.y-menu--dark {
  background: #001529;
  color: rgba(255, 255, 255, 0.65);
}

.y-menu--vertical {
  border-right: 1px solid #f0f0f0;
  border-bottom: none;
}

.y-menu--dark.y-menu--vertical {
  border-right: 1px solid #434343;
}

/* Logo 区域 */
.y-menu__logo {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  min-height: 64px;
}

.y-menu--dark .y-menu__logo {
  border-bottom: 1px solid #434343;
}

/* 菜单容器 */
.y-menu__container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}

.y-menu--vertical .y-menu__container {
  flex-direction: column;
  align-items: stretch;
}

/* 左侧内容 */
.y-menu__left {
  display: flex;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
}

.y-menu--vertical .y-menu__left {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.y-menu--dark .y-menu__left {
  border-bottom: 1px solid #434343;
}

/* 菜单内容 */
.y-menu__content {
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
}

.y-menu--vertical .y-menu__content {
  flex: 1;
  display: block;
  padding: 8px 0;
}

.y-menu__content--start {
  justify-content: flex-start;
}

.y-menu__content--center {
  justify-content: center;
}

.y-menu__content--end {
  justify-content: flex-end;
}

/* 右侧内容 */
.y-menu__right {
  display: flex;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
  margin-left: auto;
}

.y-menu--vertical .y-menu__right {
  margin-left: 0;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
}

.y-menu--dark .y-menu__right {
  border-top: 1px solid #434343;
}

/* 水平菜单列表 */
.y-menu__horizontal {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
}

.y-menu__content--start .y-menu__horizontal {
  justify-content: flex-start;
}

.y-menu__content--center .y-menu__horizontal {
  justify-content: center;
}

.y-menu__content--end .y-menu__horizontal {
  justify-content: flex-end;
}

/* 垂直菜单列表 */
.y-menu__vertical {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}
</style>