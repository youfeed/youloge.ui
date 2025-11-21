<template>
  <!-- 图标容器：支持点击事件、加载/错误状态 -->
  <div 
    class="y-icon"
    :style="iconStyle"
    @click="handleClick"
    @error="handleError"
    role="img"
    :aria-label="name"
  >
    <!-- 加载中：GitHub 风格骨架屏（无浮夸动画） -->
    <div class="y-icon__skeleton" v-if="loading" />
    
    <!-- 加载成功：渲染 SVG -->
    <div v-else-if="svgContent" v-html="svgContent" />
    
    <!-- 加载失败：降级显示（可通过 slot 自定义） -->
    <slot v-else name="fallback">
      <div class="y-icon__fallback">
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      </div>
    </slot>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect, onUnmounted } from 'vue'

defineOptions({ name: 'y-icon' })

// 全局缓存：避免重复请求同一图标（跨组件共享）
const iconCache = new Map()
// 组件内状态：加载状态、SVG 内容、错误状态
const loading = ref(false)
const svgContent = ref('')
const error = ref(false)

// Props 定义：增强功能 + 合理校验
const props = defineProps({
  // 图标名（Iconify 格式：prefix:name，如 material-symbols:home）
  name: {
    type: String,
    required: true,
    validator: (val) => val.includes(':') // 确保格式正确
  },
  // 尺寸：支持数字（自动加 px）或带单位字符串（8-128px，贴合 GitHub 紧凑风格）
  size: {
    type: [String, Number],
    default: 16,
    validator: (val) => {
      const num = typeof val === 'number' ? val : parseInt(val)
      return !isNaN(num) && num >= 8 && num <= 128
    }
  },
  // 颜色：支持 CSS 颜色值（默认 currentColor，继承父级文本色）
  color: {
    type: String,
    default: 'currentColor'
  },
  // 旋转角度：0-360deg
  rotate: {
    type: [String, Number],
    default: 0,
    validator: (val) => {
      const deg = typeof val === 'number' ? val : parseInt(val)
      return !isNaN(deg) && deg >= 0 && deg <= 360
    }
  },
  // 翻转：水平/垂直/双向
  flip: {
    type: String,
    default: 'none',
    validator: (val) => ['none', 'horizontal', 'vertical', 'both'].includes(val)
  },
  // 点击是否阻止冒泡
  stopPropagation: {
    type: Boolean,
    default: false
  }
})

// 事件派发
const emit = defineEmits(['click', 'error', 'load'])

// 格式化单位（数字 → px，字符串直接使用）
const formatUnit = (val, unit = 'px') => {
  return typeof val === 'number' ? `${val}${unit}` : val
}

// 处理 SVG 内容：统一样式（避免 CDN 返回 SVG 样式冲突）
const processSvg = (svgText) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, 'image/svg+xml')
  const svg = doc.querySelector('svg')
  
  if (!svg) return ''
  
  // 清除 SVG 自带的宽高，继承组件尺寸
  svg.removeAttribute('width')
  svg.removeAttribute('height')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  
  // 强制设置 fill 为组件 color（覆盖 CDN 自带颜色）
  svg.setAttribute('fill', props.color)
  // 清除不必要的属性，精简 SVG
  svg.removeAttribute('fill-rule')
  svg.removeAttribute('stroke')
  svg.removeAttribute('stroke-width')
  
  // 序列化 SVG 为字符串
  return new XMLSerializer().serializeToString(svg)
}

// 加载图标：优先从缓存读取，无缓存则请求 CDN
const loadIcon = async () => {
  const { name } = props
  if (!name) return
  
  // 1. 从缓存读取
  if (iconCache.has(name)) {
    const cachedSvg = iconCache.get(name)
    svgContent.value = processSvg(cachedSvg)
    emit('load')
    return
  }
  
  // 2. 缓存未命中，请求 CDN
  loading.value = true
  error.value = false
  
  try {
    const [prefix, iconName] = name.split(':')
    // Iconify CDN 优化：关闭默认尺寸，仅传递必要参数
    const url = `https://api.iconify.design/${prefix}/${iconName}.svg?width=unset&height=unset`
    const response = await fetch(url)
    
    if (!response.ok) throw new Error(`HTTP 错误：${response.status}`)
    
    const svgText = await response.text()
    // 存入缓存（永久缓存，可根据需求改为 LRU 缓存）
    iconCache.set(name, svgText)
    // 处理 SVG 后渲染
    svgContent.value = processSvg(svgText)
    emit('load')
  } catch (err) {
    console.error(`[y-icon] 加载失败（${name}）：`, err.message)
    error.value = true
    emit('error', err)
  } finally {
    loading.value = false
  }
}

// 点击事件处理：支持阻止冒泡
const handleClick = (e) => {
  if (props.stopPropagation) e.stopPropagation()
  emit('click', e)
}

// 错误处理（SVG 渲染失败）
const handleError = (e) => {
  console.error(`[y-icon] 渲染失败（${props.name}）`, e)
  error.value = true
  emit('error', e)
}

// 监听 props 变化：重新加载图标（name/color 变化时）
watchEffect(() => {
  // 仅当 name 或 color 变化时重新加载（size/rotate/flip 仅改样式，无需重请求）
  const { name, color } = props
  loadIcon(name, color)
}, { flush: 'post' })

// 组件卸载：清除当前组件的 SVG 内容（避免内存泄漏）
onUnmounted(() => {
  svgContent.value = ''
})

// 图标样式：整合尺寸、旋转、翻转，贴合 GitHub 风格
const iconStyle = computed(() => {
  const size = formatUnit(props.size)
  const rotate = formatUnit(props.rotate, 'deg')
  let transform = `rotate(${rotate})`
  
  // 处理翻转
  if (props.flip === 'horizontal') transform += ' scaleX(-1)'
  else if (props.flip === 'vertical') transform += ' scaleY(-1)'
  else if (props.flip === 'both') transform += ' scaleX(-1) scaleY(-1)'
  
  return {
    width: size,
    height: size,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform,
    transition: 'transform 0.2s ease, color 0.2s ease', // 低调过渡，贴合 GitHub 风格
    cursor: 'pointer' // 点击时显示指针（非必须，可根据场景调整）
  }
})
</script>

<style lang="less" scoped>
// 核心样式：无多余装饰，贴合 GitHub 低调风格
.y-icon {
  box-sizing: border-box;
  line-height: 1; // 避免对齐问题
  vertical-align: middle; // 与文本垂直居中
  
  // 加载中骨架屏（GitHub 风格：浅灰背景 + 圆角）
  &__skeleton {
    width: 100%;
    height: 100%;
    background-color: var(--y-neutral-200);
    border-radius: 2px;
    // 低调加载动画（无脉冲，仅轻微透明度变化）
    animation: iconSkeleton 1.5s infinite ease-in-out;
  }
  
  // 加载失败降级图标（GitHub 风格：浅灰 + 无多余颜色）
  &__fallback {
    width: 100%;
    height: 100%;
    color: var(--y-neutral-400);
  }
}

// 骨架屏动画（低调，不突兀）
@keyframes iconSkeleton {
  0% { opacity: 0.6; }
  50% { opacity: 0.4; }
  100% { opacity: 0.6; }
}

// 全局变量关联（确保与其他组件风格统一）
:root {
  --y-neutral-200: @neutral-200;
  --y-neutral-400: @neutral-400;
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  :root {
    --y-neutral-200: @neutral-700;
    --y-neutral-400: @neutral-500;
  }
}
</style>