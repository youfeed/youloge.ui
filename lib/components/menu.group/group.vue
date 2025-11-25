<template>
  <li 
    class="y-menu-group"
    :class="groupClass"
    :style="groupStyle"
  >
    <!-- 组标题（可点击展开/收起） -->
    <div
      class="y-menu-group__header"
      :class="{ 'is-open': isOpen }"
      @click="handleToggle"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- 自定义插槽渲染 -->
      <slot v-if="hasSlot" :name="slotName" :item="item" />
      
      <!-- 默认渲染 -->
      <template v-else>
        <span v-if="item.icon" class="y-menu-group__icon">
          <y-icon :name="item.icon" size="16" />
        </span>
        <span class="y-menu-group__title">{{ item.label }}</span>
        <span class="y-menu-group__arrow">
          <y-icon :name="arrowIcon" size="16" />
        </span>
      </template>
    </div>

    <!-- 子菜单 -->
    <transition :name="transitionName">
      <ul
        v-if="shouldShowSubmenu"
        class="y-menu-group__submenu"
        :class="submenuClass"
      >
        <template v-for="(child, index) in item.children" :key="getItemKey(child, index)">
          <!-- 子菜单项 -->
          <y-menu-item
            :item="child"
            :level="level + 1"
            :mode="mode"
            :active-key="activeKey"
            @click="handleChildClick(child)"
          >
            <template v-if="hasChildSlot(child)" #[getChildSlotName(child)]="{ item: slotItem }">
              <slot :name="getChildSlotName(slotItem)" :item="slotItem" />
            </template>
          </y-menu-item>
        </template>
      </ul>
    </transition>
  </li>
</template>

<script setup>
import { ref, computed, useSlots } from 'vue'
// import YMenuItem from './YMenuItem.vue'

const slots = useSlots()

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  },
  mode: {
    type: String,
    default: 'vertical'
  },
  activeKey: {
    type: [String, Number],
    default: ''
  },
  openKeys: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['item-click', 'submenu-change'])

// 响应式数据
const isHovered = ref(false)

// 计算属性
const slotName = computed(() => props.item.key)
const hasSlot = computed(() => !!slots[slotName.value])

const isOpen = computed(() => props.openKeys.includes(props.item.key))

const arrowIcon = computed(() => {
  if (props.mode === 'horizontal') {
    return isOpen.value ? 'mdi:chevron-up' : 'mdi:chevron-down'
  }
  return isOpen.value ? 'mdi:chevron-up' : 'mdi:chevron-right'
})

const shouldShowSubmenu = computed(() => {
  if (props.mode === 'vertical') {
    return isOpen.value
  }
  return isHovered.value || isOpen.value
})

const transitionName = computed(() => {
  return props.mode === 'vertical' ? 'y-menu-slide' : 'y-menu-fade'
})

const groupClass = computed(() => [
  'y-menu-group',
  `y-menu-group--level-${props.level}`,
  {
    'y-menu-group--open': isOpen.value
  }
])

const groupStyle = computed(() => ({
  paddingLeft: props.mode === 'vertical' ? `${12 + props.level * 16}px` : '0'
}))

const submenuClass = computed(() => [
  'y-menu-group__submenu',
  `y-menu-group__submenu--${props.mode}`
])

// 方法
const getItemKey = (item, index) => {
  return item.key || item.id || `menu-item-${index}`
}

const hasChildSlot = (child) => {
  return !!slots[getChildSlotName(child)]
}

const getChildSlotName = (child) => {
  return `${props.item.key}.${child.key}`
}

const handleToggle = () => {
  if (props.item.disabled) return
  emit('submenu-change', props.item, !isOpen.value)
}

const handleChildClick = (child) => {
  emit('item-click', child)
}

const handleMouseEnter = () => {
  if (props.mode === 'horizontal') {
    isHovered.value = true
  }
}

const handleMouseLeave = () => {
  if (props.mode === 'horizontal') {
    isHovered.value = false
  }
}
</script>

<style scoped>
.y-menu-group {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

.y-menu-group__header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 4px;
  margin: 2px 4px;
  gap: 8px;
}

.y-menu-group__header:hover {
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.y-menu-group__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.y-menu-group__title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.y-menu-group__arrow {
  flex-shrink: 0;
  transition: transform 0.3s;
  display: flex;
  align-items: center;
}

.y-menu-group--open .y-menu-group__arrow {
  transform: rotate(180deg);
}

/* 子菜单样式 */
.y-menu-group__submenu {
  list-style: none;
  margin: 0;
  padding: 0;
  background: inherit;
  overflow: hidden;
}

.y-menu-group__submenu--horizontal {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  z-index: 1000;
  background: #001529;
  color: rgba(255, 255, 255, 0.65);
}

.y-menu-group__submenu--vertical {
  width: 100%;
}

/* 动画效果 */
.y-menu-slide-enter-active,
.y-menu-slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.y-menu-slide-enter-from,
.y-menu-slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.y-menu-slide-enter-to,
.y-menu-slide-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

.y-menu-fade-enter-active,
.y-menu-fade-leave-active {
  transition: all 0.3s ease;
}

.y-menu-fade-enter-from,
.y-menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.y-menu-fade-enter-to,
.y-menu-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>