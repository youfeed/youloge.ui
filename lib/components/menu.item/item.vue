<template>
  <li 
    class="y-menu-item"
    :class="computedClass"
    role="none"
  >
    <component
      :is="tag"
      class="y-menu-item__link"
      :class="linkClass"
      :to="to"
      :href="href"
      :target="target"
      :role="role"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled"
      :aria-current="isActive ? 'page' : null"
      @click="handleClick"
    >
      <!-- 图标部分 - 使用y-icon组件 -->
      <span v-if="$slots.icon || icon" class="y-menu-item__icon">
        <slot name="icon">
          <y-icon 
            v-if="icon" 
            :name="icon" 
            :size="iconSize" 
            :color="iconColor"
            :rotate="iconRotate"
            :flip="iconFlip"
          />
        </slot>
      </span>
      
      <span class="y-menu-item__text">
        <slot />
      </span>
      
      <span v-if="badge !== undefined" class="y-menu-item__badge">
        {{ badge }}
      </span>
      
      <span v-if="hasChildren" class="y-menu-item__indicator">
        <slot name="indicator">
          <y-icon 
            v-if="menuContext?.mode === 'vertical'" 
            name="mdi-light:chevron-right"
            size="16"
          />
          <y-icon 
            v-else 
            name="mdi-light:chevron-down"
            size="16"
          />
        </slot>
      </span>
      
      <span v-if="loading" class="y-menu-item__loading">
        <slot name="loading">
          <y-icon name="mdi-light:loading" size="16" class="animate-spin" />
        </slot>
      </span>
    </component>
    
    <y-menu
      v-if="hasChildren && (expanded || isActive)"
      v-bind="submenuProps"
      class="y-menu-item__submenu"
      :class="{ 'y-menu-item__submenu--expanded': expanded }"
    >
      <slot name="children" />
    </y-menu>
  </li>
</template>

<script setup>
import { computed, ref,inject, useSlots } from 'vue'
import YIcon from '@lib/components/icon/icon.vue' // 导入y-icon组件
const slots = useSlots();
const props = defineProps({
  key: [String, Number],
  to: [String, Object],
  href: String,
  target: String,
  icon: String, // 支持直接传递图标名称
  iconSize: {
    type: [String, Number],
    default: 16
  },
  iconColor: {
    type: String,
    default: 'currentColor'
  },
  iconRotate: {
    type: [String, Number],
    default: 0
  },
  iconFlip: {
    type: String,
    default: 'none'
  },
  badge: [String, Number],
  active: Boolean,
  disabled: Boolean,
  loading: Boolean,
  expandable: Boolean,
  defaultExpanded: Boolean,
  submenuProps: {
    type: Object,
    default: () => ({})
  }
})

// 其他逻辑保持不变...
const menuContext = inject('y-menu-context', null)
const expanded = ref(props.defaultExpanded)
const isActive = computed(() => 
  props.active || (props.key !== undefined && menuContext?.activeKey === props.key)
)

const hasChildren = computed(() => !!slots.children)

const tag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return 'button'
})

const role = computed(() => {
  if (props.to || props.href) return null
  return hasChildren.value ? 'menuitem' : 'button'
})

const computedClass = computed(() => {
  return [
    `y-menu-item--${menuContext?.size || 'md'}`,
    `y-menu-item--${menuContext?.theme || 'default'}`,
    {
      'y-menu-item--active': isActive.value,
      'y-menu-item--disabled': props.disabled,
      'y-menu-item--loading': props.loading,
      'y-menu-item--has-children': hasChildren.value,
      'y-menu-item--expanded': expanded.value,
      'y-menu-item--selectable': menuContext?.activeKey !== undefined
    }
  ].filter(Boolean).join(' ')
})

const linkClass = computed(() => {
  return {
    'y-menu-item__link--active': isActive.value,
    'y-menu-item__link--disabled': props.disabled
  }
})

const submenuProps = computed(() => ({
  mode: menuContext?.mode,
  theme: menuContext?.theme,
  size: menuContext?.size,
  nested: true,
  ...props.submenuProps
}))

const handleClick = (e) => {
  if (props.disabled || props.loading) {
    e.preventDefault()
    return
  }
  
  if (hasChildren.value && props.expandable) {
    expanded.value = !expanded.value
    emit('toggle', expanded.value, e)
    e.preventDefault()
    return
  }
  
  emit('click', e)
  
  if (menuContext) {
    menuContext.onItemClick({
      key: props.key,
      to: props.to,
      href: props.href,
      active: isActive.value
    })
  }
}
</script>

<style scoped>
/* 原有样式保持不变 */
.y-menu-item {
  position: relative;
  margin: 0;
  list-style: none;
}

.y-menu--vertical .y-menu-item {
  border-bottom: 1px solid var(--menu-border-color);
}

.y-menu--vertical .y-menu-item:last-child {
  border-bottom: none;
}

.y-menu--horizontal .y-menu-item {
  border-right: 1px solid var(--menu-border-color);
}

.y-menu--horizontal .y-menu-item:last-child {
  border-right: none;
}

.y-menu-item__link {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  text-decoration: none;
  color: inherit;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: var(--spacing-3);
  position: relative;
}

.y-menu-item__link:hover:not(.y-menu-item__link--disabled) {
  background-color: var(--menu-item-hover-bg);
}

.y-menu-item__link--active {
  background-color: var(--menu-item-active-bg) !important;
  color: var(--menu-item-active-color) !important;
  font-weight: 600;
}

.y-menu-item__link--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.y-menu-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  font-size: 16px;
}

.y-menu-item--sm .y-menu-item__icon {
  width: 16px;
  height: 16px;
  font-size: 14px;
}

.y-menu-item--lg .y-menu-item__icon {
  width: 24px;
  height: 24px;
  font-size: 18px;
}

.y-menu-item__text {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.y-menu-item__badge {
  padding: 2px 6px;
  background: var(--error);
  color: var(--white);
  border-radius: 10px;
  font-size: var(--font-size-xs);
  font-weight: 600;
  line-height: 1;
}

.y-menu-item__indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.y-menu-item--expanded .y-menu-item__indicator {
  transform: rotate(90deg);
}

.y-menu-item__loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.y-menu-item__submenu {
  background: var(--submenu-bg, var(--neutral-50));
  border-left: 2px solid var(--submenu-border-color, var(--neutral-200));
}

.y-menu--horizontal .y-menu-item__submenu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: var(--white);
  border: 1px solid var(--neutral-200);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  z-index: 1000;
}

.y-menu-item__link:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: -2px;
  z-index: 1;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
