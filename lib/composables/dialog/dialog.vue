<template>
  <teleport to="body">
    <transition name="dialog-fade">
      <div v-show="modelValue" class="dialog-overlay" @click="handleOverlayClick">
        <div class="dialog-container" @click.stop>
          <!-- 头部标题区域 -->
          <header class="dialog-header">
            <h2 class="dialog-title" v-if="title">{{ title }}</h2>
            <button 
              v-if="closable" 
              @click="handleClose" 
              class="dialog-close-btn"
              aria-label="关闭对话框"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </header>
          
          <!-- 内容区域 -->
          <main class="dialog-content">
            <slot></slot>
          </main>
          
          <!-- 底部按钮区域 -->
          <footer v-if="showFooter" class="dialog-footer">
            <button 
              v-if="showCancelButton"
              @click="handleCancel"
              class="dialog-btn cancel-btn"
            >
              {{ cancelText }}
            </button>
            <button 
              v-if="showConfirmButton"
              @click="handleConfirm"
              class="dialog-btn confirm-btn"
            >
              {{ confirmText }}
            </button>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { defineModel } from 'vue'

defineOptions({ name: 'y-dialog' })

// 使用 defineModel 创建双向绑定
const modelValue = defineModel({
  type: Boolean,
  default: false
})

// 定义 props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  closable: {
    type: Boolean,
    default: true
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showCancelButton: {
    type: Boolean,
    default: true
  },
  showConfirmButton: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确认'
  }
})

// 定义事件
const emit = defineEmits(['confirm', 'cancel', 'close'])

// 处理遮罩点击事件
const handleOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    handleClose()
  }
}

// 处理关闭事件
const handleClose = () => {
  modelValue.value = false
  emit('close')
}

// 处理取消事件
const handleCancel = () => {
  handleClose()
  emit('cancel')
}

// 处理确认事件
const handleConfirm = () => {
  handleClose()
  emit('confirm')
}
</script>

<style scoped>
@reference "tailwindcss";
/* 对话框遮罩层 */
.dialog-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-black/50;
}

/* 对话框容器 */
.dialog-container {
  @apply bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden;
  transform: translateY(-10%);
}

/* 头部样式 */
.dialog-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-gray-200;
}

.dialog-title {
  @apply text-lg font-medium text-gray-900;
}

.dialog-close-btn {
  @apply text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition-colors;
}

/* 内容区域 */
.dialog-content {
  @apply px-6 py-4;
}

/* 底部按钮区域 */
.dialog-footer {
  @apply flex items-center justify-end px-6 py-4 bg-gray-50 gap-3;
}

/* 按钮样式 */
.dialog-btn {
  @apply px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.cancel-btn {
  @apply text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500;
}

.confirm-btn {
  @apply text-white bg-blue-600 border border-transparent hover:bg-blue-700 focus:ring-blue-500;
}

/* 过渡动画 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-active .dialog-container,
.dialog-fade-leave-active .dialog-container {
  transition: transform 0.3s;
}

.dialog-fade-enter-from .dialog-container,
.dialog-fade-leave-to .dialog-container {
  transform: translateY(-10%) scale(0.95);
}
</style>