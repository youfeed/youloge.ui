<template>
  <div 
    class="y-icon"
    :style="iconStyle"
    v-html="svgContent"
    v-if="!error"
  />
  <div 
    class="y-icon y-icon--error"
    :style="iconStyle"
    v-else
  >
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: 24
  },
  color: {
    type: String,
    default: 'currentColor'
  }
})

const svgContent = ref('')
const error = ref(false)

// 核心：远程加载图标
const loadIcon = async () => {
  try {
    const [prefix, iconName] = props.name.split(':')
    const url = `https://api.iconify.design/${prefix}/${iconName}.svg`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('Icon not found')
    
    svgContent.value = await response.text()
    error.value = false
  } catch (err) {
    error.value = true
  }
}

const iconStyle = {
  width: typeof props.size === 'number' ? `${props.size}px` : props.size,
  height: typeof props.size === 'number' ? `${props.size}px` : props.size,
  color: props.color,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
}

// 监听图标名称变化
watch(() => props.name, loadIcon, { immediate: true })
</script>

<style scoped>
.y-icon {
  line-height: 1;
  vertical-align: middle;
}

.y-icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

.y-icon--error {
  color: #ff4d4f;
}
</style>