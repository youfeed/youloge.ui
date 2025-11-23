<template>
  <div class="y-dropdown" ref="dropdownRef">
    <div 
      class="y-dropdown__trigger"
      @click="toggleDropdown"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <slot name="trigger"></slot>
    </div>

    <!-- 移除teleport，直接在触发元素下方渲染 -->
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
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  trigger: { type: String, default: 'click' },
  placement: { type: String, default: 'bottom-start' },
  width: { type: [String, Number], default: 'auto' },
  offset: { type: Number, default: 4 }
})

const emit = defineEmits(['open', 'close', 'toggle'])

const dropdownRef = ref(null)
const contentRef = ref(null)
const isOpen = ref(false)
const contentStyle = ref({})

watch(isOpen, async (newVal) => {
  if (newVal) {
    await nextTick()
    calculatePosition()
  }
  emit(newVal ? 'open' : 'close')
  emit('toggle', newVal)
})

const contentClasses = computed(() => ({
  'y-dropdown__content--open': isOpen.value
}))

const calculatePosition = () => {
  if (!dropdownRef.value || !contentRef.value) return
  
  const triggerRect = dropdownRef.value.getBoundingClientRect()
  const contentRect = contentRef.value.getBoundingClientRect()
  
  let top = 0
  let left = 0
  
  const placements = {
    'bottom-start': () => {
      top = triggerRect.height + props.offset
      left = 0
    },
    'bottom-end': () => {
      top = triggerRect.height + props.offset
      left = triggerRect.width - contentRect.width
    },
    'bottom': () => {
      top = triggerRect.height + props.offset
      left = (triggerRect.width - contentRect.width) / 2
    },
    'top-start': () => {
      top = -contentRect.height - props.offset
      left = 0
    },
    'top-end': () => {
      top = -contentRect.height - props.offset
      left = triggerRect.width - contentRect.width
    },
    'top': () => {
      top = -contentRect.height - props.offset
      left = (triggerRect.width - contentRect.width) / 2
    },
    'left-start': () => {
      top = 0
      left = -contentRect.width - props.offset
    },
    'left-end': () => {
      top = triggerRect.height - contentRect.height
      left = -contentRect.width - props.offset
    },
    'left': () => {
      top = (triggerRect.height - contentRect.height) / 2
      left = -contentRect.width - props.offset
    },
    'right-start': () => {
      top = 0
      left = triggerRect.width + props.offset
    },
    'right-end': () => {
      top = triggerRect.height - contentRect.height
      left = triggerRect.width + props.offset
    },
    'right': () => {
      top = (triggerRect.height - contentRect.height) / 2
      left = triggerRect.width + props.offset
    }
  }
  
  placements[props.placement]?.() || placements['bottom-start']()
  
  contentStyle.value = {
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    top: `${top}px`,
    left: `${left}px`,
    transform: isOpen.value ? 'scale(1)' : 'scale(0.8)',
    opacity: isOpen.value ? 1 : 0
  }
}

const toggleDropdown = () => {
  if (props.trigger !== 'click') return
  isOpen.value = !isOpen.value
}

const handleMouseEnter = () => {
  if (props.trigger !== 'hover') return
  isOpen.value = true
}

const handleMouseLeave = () => {
  if (props.trigger !== 'hover') return
  setTimeout(() => {
    if (!isMouseOverContent.value) {
      isOpen.value = false
    }
  }, 100)
}

const isMouseOverContent = ref(false)

const handleContentMouseEnter = () => {
  if (props.trigger !== 'hover') return
  isMouseOverContent.value = true
}

const handleContentMouseLeave = () => {
  if (props.trigger !== 'hover') return
  isMouseOverContent.value = false
  setTimeout(() => {
    if (!isMouseOverContent.value) {
      isOpen.value = false
    }
  }, 100)
}

const handleClickOutside = (event) => {
  if (!isOpen.value) return
  if (!dropdownRef.value?.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.y-dropdown {
  display: inline-block;
  position: relative;
}

.y-dropdown__trigger {
  cursor: pointer;
}

.y-dropdown__content {
  position: absolute;
  min-width: 160px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  z-index: 1000;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(0.8);
  opacity: 0;
  pointer-events: none;
}

.y-dropdown__content--open {
  transform: scale(1);
  opacity: 1;
  pointer-events: auto;
}

@media (prefers-color-scheme: dark) {
  .y-dropdown__content {
    background: #1f2937;
    border-color: #374151;
  }
}
</style>