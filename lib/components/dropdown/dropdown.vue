<template>
  <div
    class="inline-block relative"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    @click="handleTriggerClick"
    @mouseenter="handleTriggerHover('show')"
    @mouseleave="handleTriggerHover('hide')"
  >
    <slot name="trigger"></slot>

    <teleport to="body">
      <div
        v-if="isOpen"
        ref="menuRef"
        class="absolute z-50 transition-all duration-200 origin-top-left"
        :class="menuPositionClasses"
        @click.stop
      >
        <slot></slot>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide, computed } from 'vue'
// 导入自定义 useClickOutside @vueuse/core）
import useClickOutside from '@lib/composables/click.outside/'

const props = defineProps({
  trigger: {
    type: String,
    default: 'click',
    validator: val => ['click', 'hover'].includes(val)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placement: {
    type: String,
    default: 'bottom-start',
    validator: val => ['bottom-start', 'bottom-end', 'top-start', 'top-end'].includes(val)
  },
  clickOutsideClose: {
    type: Boolean,
    default: true
  },
  escClose: {
    type: Boolean,
    default: true
  }
})

const isOpen = ref(false)
provide('dropdownContext', { isOpen, disabled: props.disabled })

// 新增：目标元素 ref（触发元素容器）和菜单 ref（忽略点击）
const triggerRef = ref(null)
const menuRef = ref(null)

const menuPositionClasses = computed(() => {
  const base = 'rounded-md shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
  const positionMap = {
    'bottom-start': 'left-0 top-full mt-1',
    'bottom-end': 'right-0 top-full mt-1',
    'top-start': 'left-0 bottom-full mb-1',
    'top-end': 'right-0 bottom-full mb-1'
  }
  return `${base} ${positionMap[props.placement]}`
})

const handleTriggerClick = () => {
  if (props.disabled) return
  if (props.trigger === 'click') {
    isOpen.value = !isOpen.value
  }
}

let hoverTimer = null
const handleTriggerHover = (action) => {
  if (props.disabled || props.trigger !== 'hover') return
  clearTimeout(hoverTimer)
  if (action === 'show') {
    hoverTimer = setTimeout(() => { isOpen.value = true }, 150)
  } else {
    hoverTimer = setTimeout(() => { isOpen.value = false }, 150)
  }
}

// 核心修改：使用自定义 useClickOutside
let clickOutsideInstance = null
onMounted(() => {
  // 初始化 useClickOutside triggerRef，忽略菜单 ref（点击菜单不关闭）
  clickOutsideInstance = useClickOutside(triggerRef, () => {
    if (props.clickOutsideClose && isOpen.value) {
      isOpen.value = false
    }
  }, {
    ignoreRefs: [menuRef] // 忽略菜单元素，点击菜单内部不关闭
  })

  // 挂载事件监听
  if (props.clickOutsideClose) {
    clickOutsideInstance.mount()
  }

  // ESC 键监听
  window.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  // 卸载事件监听（避免内存泄漏）
  if (clickOutsideInstance) {
    clickOutsideInstance.unmount()
  }
  window.removeEventListener('keydown', handleEscKey)
  clearTimeout(hoverTimer)
})

const handleEscKey = (e) => {
  if (props.escClose && e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

defineExpose({
  open: () => { if (!props.disabled) isOpen.value = true },
  close: () => { isOpen.value = false },
  toggle: () => { if (!props.disabled) isOpen.value = !isOpen.value }
})
</script>