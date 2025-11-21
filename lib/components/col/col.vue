<template>
  <div 
    class="y-col"
    :style="colStyle"
  >
    <slot />
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

defineOptions({ name: 'y-col' })

// 核心修复：JS 计算所有断点的 span/offset，注入为 CSS 变量
const props = defineProps({
  span: { type: [Number, Object], default: 24, validator: val => val === 0 || (val >= 1 && val <= 24) },
  offset: { type: [Number, Object], default: 0, validator: val => val >= 0 && val <= 23 },
  xs: { type: [Number, Object], default: undefined }, // ≤359px
  sm: { type: [Number, Object], default: undefined }, // ≤575px
  md: { type: [Number, Object], default: undefined }, // ≤767px
  lg: { type: [Number, Object], default: undefined }, // ≤1023px
  xl: { type: [Number, Object], default: undefined }  // ≤1279px
})

// 解析单个断点的 span 和 offset
const parseBreakpoint = (val) => {
  if (!val) return { span: undefined, offset: 0 }
  if (typeof val === 'number') return { span: val, offset: 0 }
  return { span: val.span, offset: val.offset || 0 }
}

// 计算所有 CSS 变量（包括基础样式和响应式断点）
const colStyle = computed(() => {
  const base = {
    // 基础样式
    width: `${(props.span / 24) * 100}%`,
    marginLeft: `${(props.offset / 24) * 100}%`,
    display: props.span === 0 ? 'none' : 'block',
    boxSizing: 'border-box',
    transition: 'width 0.2s ease, margin-left 0.2s ease',
    // 注入响应式 CSS 变量（--y-[断点]-span/offset）
    '--y-xs-span': parseBreakpoint(props.xs).span,
    '--y-xs-offset': parseBreakpoint(props.xs).offset,
    '--y-sm-span': parseBreakpoint(props.sm).span,
    '--y-sm-offset': parseBreakpoint(props.sm).offset,
    '--y-md-span': parseBreakpoint(props.md).span,
    '--y-md-offset': parseBreakpoint(props.md).offset,
    '--y-lg-span': parseBreakpoint(props.lg).span,
    '--y-lg-offset': parseBreakpoint(props.lg).offset,
    '--y-xl-span': parseBreakpoint(props.xl).span,
    '--y-xl-offset': parseBreakpoint(props.xl).offset
  }

  // 处理断点为 0 时的隐藏逻辑
  Object.keys(base).forEach(key => {
    if (key.startsWith('--y-') && key.endsWith('-span') && base[key] === 0) {
      base[`${key.replace('span', 'display')}`] = 'none'
    }
  })

  return base
})
</script>

<style lang="less" scoped>
// 纯原生 Less，无任何复杂函数，仅用简单计算
.y-col {
  box-sizing: border-box;
  float: left;

  // 列内边距（紧凑风格）
  > * {
    box-sizing: border-box;
  }
}

// -------------------------- 响应式适配（仅用原生 CSS 计算，无 Less 函数）--------------------------
// 超小屏（≤359px：@xs-max）
@media (max-width: @xs-max) {
  .y-col {
    // 有 xs 配置时覆盖基础样式
    &[style*="--y-xs-span"] {
      width: calc( (var(--y-xs-span, 24) / 24) * 100% ) !important;
      margin-left: calc( (var(--y-xs-offset, 0) / 24) * 100% ) !important;
      display: var(--y-xs-display, block) !important;
    }
  }
}

// 小屏（≤575px：@sm-max）
@media (max-width: @sm-max) {
  .y-col {
    &[style*="--y-sm-span"] {
      width: calc( (var(--y-sm-span, 24) / 24) * 100% ) !important;
      margin-left: calc( (var(--y-sm-offset, 0) / 24) * 100% ) !important;
      display: var(--y-sm-display, block) !important;
    }
  }
}

// 中屏（≤767px：@md-max）
@media (max-width: @md-max) {
  .y-col {
    &[style*="--y-md-span"] {
      width: calc( (var(--y-md-span, 24) / 24) * 100% ) !important;
      margin-left: calc( (var(--y-md-offset, 0) / 24) * 100% ) !important;
      display: var(--y-md-display, block) !important;
    }
  }
}

// 大屏（≤1023px：@lg-max）
@media (max-width: @lg-max) {
  .y-col {
    &[style*="--y-lg-span"] {
      width: calc( (var(--y-lg-span, 24) / 24) * 100% ) !important;
      margin-left: calc( (var(--y-lg-offset, 0) / 24) * 100% ) !important;
      display: var(--y-lg-display, block) !important;
    }
  }
}

// 超大屏（≤1279px：@xl-max）
@media (max-width: @xl-max) {
  .y-col {
    &[style*="--y-xl-span"] {
      width: calc( (var(--y-xl-span, 24) / 24) * 100% ) !important;
      margin-left: calc( (var(--y-xl-offset, 0) / 24) * 100% ) !important;
      display: var(--y-xl-display, block) !important;
    }
  }
}
</style>