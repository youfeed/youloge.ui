<template>
  <transition name="plus-fade">
    <div v-show="visible" class="plus-container" @click.self="handleOverlayClick">
      <div class="iframe-wrapper">
        <iframe 
          :src="iframeSrc" 
          :style="iframeStyle" 
          class="plus-iframe"
          @load="handleIframeLoad"
        ></iframe>
        <button 
          v-if="closable"
          @click="handleClose"
          class="close-btn"
          aria-label="关闭弹窗"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineOptions({ 
  name: 'y-plus',
  inheritAttrs: false 
})

// 定义 props
const props = defineProps({
  hash: {
    type: String,
    default: ''
  },
  path: {
    type: String,
    default: ''
  },
  style: {
    type: String,
    default: ''
  },
  baseUrl: {
    type: String,
    default: 'https://open.youloge.com/'
  },
  closable: {
    type: Boolean,
    default: true
  },
  closeOnOverlayClick: {
    type: Boolean,
    default: true
  },
  width: {
    type: [String, Number],
    default: 360
  },
  height: {
    type: [String, Number],
    default: 350
  }
})

// 定义事件
const emit = defineEmits(['close', 'load', 'error'])

// 控制显示状态
const visible = ref(false)

// 计算完整的 iframe URL
const iframeSrc = computed(() => {
  return `${props.baseUrl}${props.path || ''}${props.hash || ''}`
})

// 计算 iframe 样式
const iframeStyle = computed(() => {
  const customStyle = props.style || ''
  return customStyle
})

// 处理 iframe 加载完成
const handleIframeLoad = () => {
  emit('load')
}

// 处理 iframe 加载错误
const handleIframeError = () => {
  emit('error')
}

// 处理遮罩点击事件
const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    handleClose()
  }
}

// 处理关闭事件
const handleClose = () => {
  visible.value = false
  emit('close')
}

// 处理 ESC 键关闭
const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.closable) {
    handleClose()
  }
}

// 组件挂载时显示
onMounted(() => {
  visible.value = true
  document.addEventListener('keydown', handleKeydown)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
<style scoped>
@reference "tailwindcss";
/* 容器样式 */
.plus-container {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-md;
}

/* iframe 包装器 */
.iframe-wrapper {
  @apply relative -mt-[20%];
}

/* iframe 样式 */
.plus-iframe {
  @apply outline-none border-0 rounded-md;
  width: v-bind('typeof props.width === "number" ? props.width + "px" : props.width');
  height: v-bind('typeof props.height === "number" ? props.height + "px" : props.height');
}

/* 关闭按钮 */
.close-btn {
  @apply absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors;
}

/* 过渡动画 */
.plus-fade-enter-active,
.plus-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.plus-fade-enter-from,
.plus-fade-leave-to {
  opacity: 0;
}

.plus-fade-enter-active .iframe-wrapper,
.plus-fade-leave-active .iframe-wrapper {
  transition: transform 0.3s;
}

.plus-fade-enter-from .iframe-wrapper,
.plus-fade-leave-to .iframe-wrapper {
  transform: translateY(-20%) scale(0.95);
}
</style>