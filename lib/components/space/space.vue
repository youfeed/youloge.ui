<template>
  <!-- 间距容器：基于原生 flex 布局，轻量无依赖 -->
  <div
    class="y-space"
    :style="containerStyle"
  >
    <slot></slot> <!-- 包裹需要控制间距的子组件 -->
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'y-space' })

// Props 定义：增强灵活性，保留核心功能
const props = defineProps({
  // 间距方向：水平（默认）/垂直
  direction: {
    type: String,
    default: 'horizontal',
    validator: (val) => ['horizontal', 'vertical'].includes(val)
  },
  // 间距大小：支持数字（自动转 px）、px/rem 字符串（贴合 GitHub 紧凑风格）
  gap: {
    type: [String, Number],
    default: 8,
    validator: (val) => {
      if (typeof val === 'number') return val >= 0 && val <= 64 // 限制合理范围
      return /^\d+(px|rem)$/.test(val) // 字符串需带合法单位
    }
  },
  // 对齐方式：水平方向=垂直对齐，垂直方向=水平对齐
  align: {
    type: String,
    default: 'center',
    validator: (val) => ['start', 'center', 'end', 'stretch', 'baseline'].includes(val)
  },
  // 是否允许换行（仅水平方向生效）
  wrap: {
    type: Boolean,
    default: false
  },
  // 子组件是否均匀填充容器空间（优化逻辑：子组件自动拉伸）
  fill: {
    type: Boolean,
    default: false
  },
  // 容器宽度（可选：限制最大宽度，避免溢出）
  width: {
    type: [String, Number],
    default: '100%'
  },
  // 容器高度（可选：仅垂直方向生效）
  height: {
    type: [String, Number],
    default: 'auto'
  }
})

// 格式化单位（数字→px，字符串校验合法性）
const formatUnit = (val) => {
  if (typeof val === 'number') return `${val}px`
  return val // 字符串已通过 validator 校验，直接使用
}

// 计算容器核心样式（替代 Unocss 原子类，原生 CSS 实现）
const containerStyle = computed(() => {
  // 基础 flex 布局
  const style = {
    display: 'flex',
    width: formatUnit(props.width),
    height: props.direction === 'vertical' ? formatUnit(props.height) : 'auto',
    gap: formatUnit(props.gap), // 原生 gap 支持 flex 间距（行+列）
    transition: 'all 0.2s ease', // 保留平滑过渡
    boxSizing: 'border-box'
  }

  // 方向：水平/垂直
  style.flexDirection = props.direction === 'horizontal' ? 'row' : 'column'

  // 对齐方式：水平方向→align-items，垂直方向→justify-content
  if (props.direction === 'horizontal') {
    style.alignItems = props.align
    style.flexWrap = props.wrap ? 'wrap' : 'nowrap'
    // 换行时防止子组件溢出，限制最小宽度
    if (props.wrap) style.minWidth = '0'
  } else {
    style.justifyContent = props.align
    style.flexWrap = 'nowrap' // 垂直方向不支持换行
  }

  // 子组件填充：均匀拉伸子组件（比仅给容器设宽高更合理）
  if (props.fill) {
    style.alignItems = props.direction === 'horizontal' ? 'stretch' : 'center'
    // 给所有直接子组件添加 flex: 1，实现均匀填充
    style['--y-space-fill'] = '1'
  }

  return style
})
</script>

<style lang="less" scoped>
// 基础容器样式：无多余装饰，仅控制布局
.y-space {
  // 子组件默认样式：避免溢出，保持对齐
  > * {
    box-sizing: border-box;
    min-width: 0; // 解决文本溢出问题
  }

  // 填充模式：子组件均匀拉伸
  &[style*="--y-space-fill: 1"] > * {
    flex: 1; // 占满剩余空间，均匀分配
    min-height: 0; // 垂直方向填充时避免高度溢出
  }

  // 水平换行模式：子组件换行后保持间距均匀
  &[style*="flex-wrap: wrap"] {
    row-gap: var(--y-space-row-gap, inherit); // 行间距继承 gap
    column-gap: var(--y-space-col-gap, inherit); // 列间距继承 gap
  }
}

// 响应式适配：小屏幕优化（≤575px）
@media (max-width: 575px) {
  .y-space {
    // 水平方向且未设置 wrap 时，小屏幕自动换行
    &[style*="flex-direction: row"][style*="flex-wrap: nowrap"] {
      flex-wrap: wrap !important;
      gap: calc(var(--y-space-mobile-gap, inherit) * 0.8) !important; // 间距缩小 20%，更紧凑
    }

    // 垂直方向小屏幕缩小间距
    &[style*="flex-direction: column"] {
      gap: calc(var(--y-space-mobile-gap, inherit) * 0.8) !important;
    }
  }
}
</style>