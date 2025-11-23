<template>
  <div 
    class="y-icon"
    :style="iconStyle"
    @click="handleClick"
    role="img"
    :aria-label="name"
  >
    <!-- 加载状态 -->
    <div v-if="loading" class="y-icon__skeleton" />
    
    <!-- 加载成功 -->
    <div v-else-if="svgContent" v-html="svgContent" />
    
    <!-- 加载失败 -->
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

// 全局缓存
const iconCache = new Map()
const loading = ref(false)
const svgContent = ref('')
const error = ref(false)

const props = defineProps({
  name: {
    type: String,
    required: true,
    validator: val => val.includes(':')
  },
  size: {
    type: [String, Number],
    default: 16,
    validator: val => {
      const num = typeof val === 'number' ? val : parseInt(val)
      return !isNaN(num) && num >= 8 && num <= 128
    }
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  rotate: {
    type: [String, Number],
    default: 0,
    validator: val => {
      const deg = typeof val === 'number' ? val : parseInt(val)
      return !isNaN(deg) && deg >= 0 && deg <= 360
    }
  },
  flip: {
    type: String,
    default: 'none',
    validator: val => ['none', 'horizontal', 'vertical', 'both'].includes(val)
  },
  stopPropagation: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'error', 'load'])

const formatUnit = (val, unit = 'px') => {
  return typeof val === 'number' ? `${val}${unit}` : val
}

const processSvg = (svgText) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, 'image/svg+xml')
  const svg = doc.querySelector('svg')
  
  if (!svg) return ''
  
  svg.removeAttribute('width')
  svg.removeAttribute('height')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.setAttribute('fill', props.color)
  
  return new XMLSerializer().serializeToString(svg)
}

const loadIcon = async () => {
  const { name } = props
  if (!name) return
  
  if (iconCache.has(name)) {
    svgContent.value = processSvg(iconCache.get(name))
    emit('load')
    return
  }
  
  loading.value = true
  error.value = false
  
  try {
    const [prefix, iconName] = name.split(':')
    const url = `https://api.iconify.design/${prefix}/${iconName}.svg?width=unset&height=unset`
    const response = await fetch(url)
    
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
    
    const svgText = await response.text()
    iconCache.set(name, svgText)
    svgContent.value = processSvg(svgText)
    emit('load')
  } catch (err) {
    console.error(`[y-icon] Load failed (${name}):`, err.message)
    error.value = true
    emit('error', err)
  } finally {
    loading.value = false
  }
}

const handleClick = (e) => {
  if (props.stopPropagation) e.stopPropagation()
  emit('click', e)
}

watchEffect(() => {
  const { name, color } = props
  loadIcon(name, color)
}, { flush: 'post' })

onUnmounted(() => {
  svgContent.value = ''
})

const iconStyle = computed(() => {
  const size = formatUnit(props.size)
  const rotate = formatUnit(props.rotate, 'deg')
  let transform = `rotate(${rotate})`
  
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
    transition: 'transform 0.2s ease, color 0.2s ease',
    cursor: 'pointer'
  }
})
</script>

<style scoped>
.y-icon {
  box-sizing: border-box;
  line-height: 1;
  vertical-align: middle;
}

.y-icon__skeleton {
  width: 100%;
  height: 100%;
  background-color: var(--y-neutral-200);
  border-radius: 2px;
  animation: iconSkeleton 1.5s infinite ease-in-out;
}

.y-icon__fallback {
  width: 100%;
  height: 100%;
  color: var(--y-neutral-400);
}

@keyframes iconSkeleton {
  0% { opacity: 0.6; }
  50% { opacity: 0.4; }
  100% { opacity: 0.6; }
}

:root {
  --y-neutral-200: #e5e7eb;
  --y-neutral-400: #9ca3af;
}

@media (prefers-color-scheme: dark) {
  :root {
    --y-neutral-200: #374151;
    --y-neutral-400: #6b7280;
  }
}
</style>
