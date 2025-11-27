<template>
  <div :class="rowClass" :style="rowStyle">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'y-row' })

const props = defineProps({
  // 间距
  gutter: {
    type: [String, Number],
    default: 16
  },
  // 水平对齐
  justify: {
    type: String,
    default: 'flex-start'
  },
  // 垂直对齐
  align: {
    type: String,
    default: 'stretch'
  },
  // 是否换行
  wrap: {
    type: Boolean,
    default: true
  }
})

// 基础类名
const rowClass = computed(() => {
  const classes = ['flex', 'w-full', 'box-border']
  
  // 对齐方式映射
  const justifyMap = {
    'flex-start': 'justify-start',
    'center': 'justify-center', 
    'flex-end': 'justify-end',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly'
  }
  
  const alignMap = {
    'stretch': 'items-stretch',
    'flex-start': 'items-start',
    'center': 'items-center',
    'flex-end': 'items-end',
    'baseline': 'items-baseline'
  }
  
  classes.push(justifyMap[props.justify] || 'justify-start')
  classes.push(alignMap[props.align] || 'items-stretch')
  classes.push(props.wrap ? 'flex-wrap' : 'flex-nowrap')
  
  return classes.join(' ')
})

// 样式计算
const rowStyle = computed(() => {
  const gutter = typeof props.gutter === 'number' ? `${props.gutter}px` : props.gutter
  return {
    margin: `calc(-${gutter} / 2)`
  }
})
</script>

<style scoped>
/* 列组件间距补偿 */
:deep(y-col) {
  padding: calc(var(--y-row-gutter, 16px) / 2);
  box-sizing: border-box;
}
</style>