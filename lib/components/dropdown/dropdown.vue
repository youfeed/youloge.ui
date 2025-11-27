<template>
  <div class="y-dropdown" ref="dropdownRef">
    <div 
      class="y-dropdown__trigger"
      @click="toggleDropdown"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @keydown="handleKeyDown"
    >
      <slot name="trigger"></slot>
    </div>

    <Teleport to="body" v-if="useTeleport">
      <div
        v-show="isOpen"
        ref="contentRef"
        class="y-dropdown__content"
        :class="contentClasses"
        :style="contentStyle"
        @click.stop
        @mouseenter="handleContentMouseEnter"
        @mouseleave="handleContentMouseLeave"
      >
        <slot></slot>
      </div>
    </Teleport>
    
    <!-- 非teleport模式，直接在触发元素下方渲染 -->
    <div
      v-else
      v-show="isOpen"
      ref="contentRef"
      class="y-dropdown__content"
      :class="contentClasses"
      :style="contentStyle"
      @click.stop
      @mouseenter="handleContentMouseEnter"
      @mouseleave="handleContentMouseLeave"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  trigger: { 
    type: String, 
    default: 'click',
    validator: (value) => ['click', 'hover', 'contextmenu'].includes(value)
  },
  placement: { 
    type: String, 
    default: 'bottom-start',
    validator: (value) => [
      'top-start', 'top', 'top-end',
      'bottom-start', 'bottom', 'bottom-end',
      'left-start', 'left', 'left-end',
      'right-start', 'right', 'right-end'
    ].includes(value)
  },
  width: { type: [String, Number], default: 'auto' },
  offset: { type: Number, default: 4 },
  disabled: { type: Boolean, default: false },
  hideOnClick: { type: Boolean, default: true },
  showArrow: { type: Boolean, default: false },
  teleport: { type: Boolean, default: false },
  maxHeight: { type: [String, Number], default: 'auto' },
  autoClose: { 
    type: Boolean, 
    default: true 
  }
})

const emit = defineEmits(['open', 'close', 'toggle', 'visible-change'])

const dropdownRef = ref(null)
const contentRef = ref(null)
const isOpen = ref(false)
const contentStyle = ref({})
const isMouseOverContent = ref(false)
const useTeleport = ref(props.teleport)

// 计算内容样式类
const contentClasses = computed(() => ({
  'y-dropdown__content--open': isOpen.value,
  'y-dropdown__content--with-arrow': props.showArrow
}))

// 计算位置
const calculatePosition = () => {
  if (!dropdownRef.value || !contentRef.value) return
  
  const triggerRect = dropdownRef.value.getBoundingClientRect()
  const contentRect = contentRef.value.getBoundingClientRect()
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset
  }
  
  let top = 0
  let left = 0
  
  // 根据placement计算位置
  const placements = {
    'bottom-start': () => {
      top = triggerRect.bottom + props.offset
      left = triggerRect.left
    },
    'bottom-end': () => {
      top = triggerRect.bottom + props.offset
      left = triggerRect.right - contentRect.width
    },
    'bottom': () => {
      top = triggerRect.bottom + props.offset
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2
    },
    'top-start': () => {
      top = triggerRect.top - contentRect.height - props.offset
      left = triggerRect.left
    },
    'top-end': () => {
      top = triggerRect.top - contentRect.height - props.offset
      left = triggerRect.right - contentRect.width
    },
    'top': () => {
      top = triggerRect.top - contentRect.height - props.offset
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2
    },
    'left-start': () => {
      top = triggerRect.top
      left = triggerRect.left - contentRect.width - props.offset
    },
    'left-end': () => {
      top = triggerRect.bottom - contentRect.height
      left = triggerRect.left - contentRect.width - props.offset
    },
    'left': () => {
      top = triggerRect.top + (triggerRect.height - contentRect.height) / 2
      left = triggerRect.left - contentRect.width - props.offset
    },
    'right-start': () => {
      top = triggerRect.top
      left = triggerRect.right + props.offset
    },
    'right-end': () => {
      top = triggerRect.bottom - contentRect.height
      left = triggerRect.right + props.offset
    },
    'right': () => {
      top = triggerRect.top + (triggerRect.height - contentRect.height) / 2
      left = triggerRect.right + props.offset
    }
  }
  
  placements[props.placement]?.()
  
  // 智能边界检测，确保内容不超出视窗
  if (left + contentRect.width > viewport.width) {
    left = viewport.width - contentRect.width - 10
  }
  
  if (left < 0) {
    left = 10
  }
  
  if (top + contentRect.height > viewport.height) {
    // 尝试显示在上方
    top = triggerRect.top - contentRect.height - props.offset
  }
  
  // 设置最终位置
  contentStyle.value = {
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight,
    top: `${top}px`,
    left: `${left}px`,
    transform: isOpen.value ? 'scaleY(1)' : 'scaleY(0.95)',
    opacity: isOpen.value ? 1 : 0,
    visibility: isOpen.value ? 'visible' : 'hidden'
  }
}

// 切换下拉框
const toggleDropdown = (event) => {
  if (props.disabled) return
  if (props.trigger !== 'click' && props.trigger !== 'contextmenu') return
  
  event?.preventDefault()
  isOpen.value = !isOpen.value
}

// 鼠标进入触发器
const handleMouseEnter = () => {
  if (props.disabled) return
  if (props.trigger !== 'hover') return
  
  clearTimeout(closeTimeout)
  isOpen.value = true
}

// 鼠标离开触发器
const handleMouseLeave = () => {
  if (props.disabled) return
  if (props.trigger !== 'hover') return
  
  closeTimeout = setTimeout(() => {
    if (!isMouseOverContent.value) {
      isOpen.value = false
    }
  }, 150)
}

// 内容区域鼠标事件
const handleContentMouseEnter = () => {
  if (props.trigger !== 'hover') return
  isMouseOverContent.value = true
  clearTimeout(closeTimeout)
}

const handleContentMouseLeave = () => {
  if (props.trigger !== 'hover') return
  isMouseOverContent.value = false
  closeTimeout = setTimeout(() => {
    if (!isMouseOverContent.value) {
      isOpen.value = false
    }
  }, 150)
}

// 键盘事件处理
const handleKeyDown = (event) => {
  if (props.disabled) return
  
  switch (event.key) {
    case 'Escape':
      isOpen.value = false
      break
    case 'Enter':
    case ' ':
      if (props.trigger === 'click') {
        event.preventDefault()
        isOpen.value = !isOpen.value
      }
      break
  }
}

// 点击外部关闭
const handleClickOutside = (event) => {
  if (!isOpen.value || !props.autoClose) return
  if (!dropdownRef.value?.contains(event.target) && !contentRef.value?.contains(event.target)) {
    isOpen.value = false
  }
}

// 关闭定时器
let closeTimeout = null

// 监听打开状态变化
watch(isOpen, (newVal) => {
  emit('visible-change', newVal)
  if (newVal) {
    emit('open')
    nextTick(() => {
      calculatePosition()
    })
  } else {
    emit('close')
  }
  emit('toggle', newVal)
}, { immediate: false })

// 监听窗口大小变化
let resizeObserver = null
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // 使用ResizeObserver监听容器大小变化
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      if (isOpen.value) {
        calculatePosition()
      }
    })
    resizeObserver.observe(dropdownRef.value)
  }
  
  // 监听窗口滚动
  window.addEventListener('scroll', calculatePosition)
  window.addEventListener('resize', calculatePosition)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', calculatePosition)
  window.removeEventListener('resize', calculatePosition)
  clearTimeout(closeTimeout)
  
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

// 暴露方法
defineExpose({
  toggle: () => isOpen.value = !isOpen.value,
  open: () => isOpen.value = true,
  close: () => isOpen.value = false,
  updatePosition: calculatePosition
})
</script>

<style scoped>
.y-dropdown {
  display: inline-block;
  position: relative;
}

.y-dropdown__trigger {
  cursor: pointer;
  position: relative;
}

.y-dropdown__trigger[disabled] {
  cursor: not-allowed;
}

.y-dropdown__content {
  position: absolute;
  min-width: 160px;
  background: var(--y-bg, #fff);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--y-border-light, #e5e7eb);
  z-index: 1000;
  overflow: auto;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
  transform: scaleY(0.95);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.y-dropdown__content--open {
  transform: scaleY(1);
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.y-dropdown__content--with-arrow::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-bottom-color: var(--y-bg, #fff);
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .y-dropdown__content {
    background: var(--y-bg-dark, #1f2937);
    border-color: var(--y-border-dark, #374151);
  }
  
  .y-dropdown__content--with-arrow::before {
    border-bottom-color: var(--y-bg-dark, #1f2937);
  }
}
</style>