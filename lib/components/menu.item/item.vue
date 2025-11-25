<template>
  <li 
    class="y-menu-item"
    :class="itemClass"
    :style="itemStyle"
    @click="handleClick"
  >
    <div class="y-menu-item__content">
      <!-- 自定义插槽渲染 -->
      <slot v-if="hasSlot" :name="slotName" :item="item" />
      
      <!-- 默认渲染 -->
      <template v-else>
        <span v-if="item.icon" class="y-menu-item__icon">
          <y-icon :name="item.icon" size="16" />
        </span>
        <span class="y-menu-item__title">{{ item.label }}</span>
      </template>
    </div>
  </li>
</template>

<script setup>
import { computed, useSlots } from 'vue'

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
  }
})

const emit = defineEmits(['click'])

// 计算属性
const slotName = computed(() => props.item.key)
const hasSlot = computed(() => !!slots[slotName.value])

const isActive = computed(() => props.activeKey === props.item.key)

const itemClass = computed(() => [
  'y-menu-item',
  `y-menu-item--level-${props.level}`,
  {
    'y-menu-item--active': isActive.value,
    'y-menu-item--disabled': props.item.disabled
  }
])

const itemStyle = computed(() => ({
  paddingLeft: props.mode === 'vertical' ? `${12 + props.level * 16}px` : '0'
}))

// 方法
const handleClick = () => {
  if (props.item.disabled) return
  emit('click', props.item)
}
</script>

<style scoped>
.y-menu-item {
  list-style: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.y-menu-item__content {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  transition: all 0.3s;
  border-radius: 4px;
  margin: 2px 4px;
  gap: 8px;
}

.y-menu-item__content:hover {
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.y-menu-item--active .y-menu-item__content {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
  font-weight: 500;
}

.y-menu-item--disabled .y-menu-item__content {
  color: #ccc;
  cursor: not-allowed;
  background: transparent;
}

.y-menu-item--disabled .y-menu-item__content:hover {
  background: transparent;
  color: #ccc;
}

.y-menu-item__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.y-menu-item__title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>