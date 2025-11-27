<template>
  <div ref="watermarkContainer" class="y-watermark-container" :style="containerStyle">
    <slot></slot>
    <canvas ref="watermarkCanvas" class="y-watermark-canvas" v-show="false"></canvas>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

defineOptions({ name: 'y-watermark' })

const props = defineProps({
  // 水印内容，可以是文本或图片URL
  content: {
    type: [String, URL],
    default: 'Watermark'
  },
  // 水印类型：text | image
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'image'].includes(value)
  },
  // 字体大小（文本水印）
  fontSize: {
    type: Number,
    default: 16
  },
  // 字体颜色（文本水印）
  color: {
    type: String,
    default: 'rgba(0, 0, 0, 0.15)'
  },
  // 字体样式（文本水印）
  fontFamily: {
    type: String,
    default: 'Arial, sans-serif'
  },
  // 水印图片宽度（图片水印）
  imageWidth: {
    type: Number,
    default: 120
  },
  // 水印图片高度（图片水印）
  imageHeight: {
    type: Number,
    default: 64
  },
  // 水印旋转角度
  rotate: {
    type: Number,
    default: -22
  },
  // 水印透明度
  opacity: {
    type: Number,
    default: 0.15,
    validator: (value) => value >= 0 && value <= 1
  },
  // 水印之间的水平间距
  gapX: {
    type: Number,
    default: 100
  },
  // 水印之间的垂直间距
  gapY: {
    type: Number,
    default: 100
  },
  // 水印偏移量
  offsetLeft: {
    type: Number,
    default: 0
  },
  offsetTop: {
    type: Number,
    default: 0
  },
  // 水印层级
  zIndex: {
    type: Number,
    default: 9
  },
  // 是否在内容上方显示
  above: {
    type: Boolean,
    default: false
  },
  // 是否禁用水印
  disabled: {
    type: Boolean,
    default: false
  }
})

const watermarkContainer = ref(null)
const watermarkCanvas = ref(null)

// 计算容器样式
const containerStyle = computed(() => ({
  position: 'relative',
  overflow: 'hidden',
  zIndex: props.above ? props.zIndex : 'auto'
}))

// 创建水印
const createWatermark = () => {
  if (props.disabled || !watermarkCanvas.value) return

  const canvas = watermarkCanvas.value
  const ctx = canvas.getContext('2d')

  // 设置画布尺寸
  const canvasWidth = props.gapX + (props.type === 'text' ? props.fontSize * 2 : props.imageWidth)
  const canvasHeight = props.gapY + (props.type === 'text' ? props.fontSize * 2 : props.imageHeight)

  canvas.width = canvasWidth
  canvas.height = canvasHeight

  // 清除画布
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  // 保存当前状态
  ctx.save()

  // 设置透明度和旋转
  ctx.globalAlpha = props.opacity
  ctx.translate(canvasWidth / 2, canvasHeight / 2)
  ctx.rotate((props.rotate * Math.PI) / 180)

  if (props.type === 'text') {
    // 绘制文本水印
    ctx.font = `${props.fontSize}px ${props.fontFamily}`
    ctx.fillStyle = props.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(props.content, 0, 0)
  } else if (props.type === 'image') {
    // 绘制图片水印
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.drawImage(
        img,
        -props.imageWidth / 2,
        -props.imageHeight / 2,
        props.imageWidth,
        props.imageHeight
      )
      applyWatermark()
    }
    img.onerror = () => {
      console.error('Failed to load watermark image:', props.content)
    }
    img.src = props.content
    return
  }

  // 恢复状态
  ctx.restore()

  // 应用水印
  applyWatermark()
}

// 应用水印到容器
const applyWatermark = () => {
  if (props.disabled || !watermarkContainer.value || !watermarkCanvas.value) return

  const container = watermarkContainer.value
  const canvas = watermarkCanvas.value

  // 创建水印背景
  const dataURL = canvas.toDataURL()
  
  // 移除旧的水印元素
  const oldWatermark = container.querySelector('.y-watermark-wrapper')
  if (oldWatermark) {
    oldWatermark.remove()
  }

  // 创建新的水印元素
  const watermarkEl = document.createElement('div')
  watermarkEl.className = 'y-watermark-wrapper'
  watermarkEl.style.position = 'absolute'
  watermarkEl.style.top = '0'
  watermarkEl.style.left = '0'
  watermarkEl.style.width = '100%'
  watermarkEl.style.height = '100%'
  watermarkEl.style.pointerEvents = 'none'
  watermarkEl.style.backgroundImage = `url(${dataURL})`
  watermarkEl.style.backgroundRepeat = 'repeat'
  watermarkEl.style.backgroundSize = `${props.gapX + (props.type === 'text' ? props.fontSize * 2 : props.imageWidth)}px ${props.gapY + (props.type === 'text' ? props.fontSize * 2 : props.imageHeight)}px`
  watermarkEl.style.backgroundPosition = `${props.offsetLeft}px ${props.offsetTop}px`
  watermarkEl.style.zIndex = props.above ? 'auto' : props.zIndex

  container.appendChild(watermarkEl)
}

// 清除水印
const clearWatermark = () => {
  if (!watermarkContainer.value) return
  
  const watermarkEl = watermarkContainer.value.querySelector('.y-watermark-wrapper')
  if (watermarkEl) {
    watermarkEl.remove()
  }
}

// 监听内容大小变化
const resizeObserver = new ResizeObserver(() => {
  createWatermark()
})

// 监听属性变化
watch([
  () => props.content,
  () => props.type,
  () => props.fontSize,
  () => props.color,
  () => props.fontFamily,
  () => props.imageWidth,
  () => props.imageHeight,
  () => props.rotate,
  () => props.opacity,
  () => props.gapX,
  () => props.gapY,
  () => props.offsetLeft,
  () => props.offsetTop,
  () => props.disabled
], () => {
  nextTick(() => {
    createWatermark()
  })
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    createWatermark()
    if (watermarkContainer.value) {
      resizeObserver.observe(watermarkContainer.value)
    }
  })
})

onUnmounted(() => {
  clearWatermark()
  resizeObserver.disconnect()
})

// 暴露方法
defineExpose({
  createWatermark,
  clearWatermark
})
</script>

<style scoped>
.y-watermark-container {
  position: relative;
}

.y-watermark-canvas {
  display: none;
}
</style>